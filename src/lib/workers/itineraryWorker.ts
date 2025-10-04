import { Worker, Job } from "bullmq";
import redis from "../redis";
import { generateItinerary } from "../llm";
import { db } from "@/db/schema";
import { itinerary_generations } from "@/db/schema/itinerary_generations";
import { itineraries } from "@/db/schema/itineraries";
import { eq, sql } from "drizzle-orm";
import "dotenv/config";



export const itineraryWorker = new Worker("itinerary-generation-queue", 
    async (job: Job) => {
        const { cities, startDate, endDate, minBudget, maxBudget, interests, itineraryId, itineraryGenerationId } = job.data;

        try {

            await db.update(itinerary_generations)
                .set({ status: "running", attemptNumber: sql<number>`attempt_number + 1` })
                .where(eq(itinerary_generations.id, itineraryGenerationId));

            const {generatedPlan, generationKey, generationMeta} = await generateItinerary({ cities, startDate, endDate, minBudget, maxBudget, interests, currency: "Rupees" });

            //await db.transaction(async (tx) => {
                await db.update(itineraries)
                    .set({ generatedPlan: generatedPlan, 
                        generateStatus: "completed", 
                        generationCompletedAt: new Date(), 
                        generationAttempts: sql<number>`generation_attempts + 1`, 
                        generationMeta: {generationMeta} })
                    .where(eq(itineraries.id, itineraryId));
                
                await db.update(itinerary_generations)
                    .set({ status: "completed", 
                        generatedPlan: generatedPlan, 
                        completedAt: new Date(),
                        generatedMeta: {generationMeta},
                        errorMessage: null,
                        generationKey: generationKey
                    })
                    .where(eq(itinerary_generations.id, itineraryGenerationId));
            //});
        } catch (error) {
            console.error("Error processing job:", error);

            //await db.transaction(async (tx) => {
                await db.update(itineraries)
                    .set({ generateStatus: "failed", generationAttempts: sql<number>`generation_attempts + 1` })
                    .where(eq(itineraries.id, itineraryId));

                await db.update(itinerary_generations)
                    .set({ status: "failed", completedAt: new Date(), errorMessage: (error as Error).message })
                    .where(eq(itinerary_generations.id, itineraryGenerationId));
            //});
            throw error;
        }
    },
    {   connection: redis,
        limiter: {
            max: 3, 
            duration: 10000, 
        },
    }
)