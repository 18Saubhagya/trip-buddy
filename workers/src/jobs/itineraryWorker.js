import { Worker } from "bullmq";
import redis from "../lib/redis.js";
import { generateItinerary } from "../lib/llm.js";
import { db } from "../db/worker-db.js";
import { itineraries } from "../db/schema/itineraries.js";
import { itinerary_generations } from "../db/schema/itinerary_generations.js";
import { trips } from "../db/schema/trips.js";
import { users } from "../db/schema/users.js";
import { eq, sql } from "drizzle-orm";
import "dotenv/config";
import { sendMail } from "../lib/mailer.js";

export const itineraryWorker = new Worker("itinerary-generation-queue", 
    async (job) => {
        const { cities, startDate, endDate, minBudget, maxBudget, interests, itineraryId, itineraryGenerationId, tripId } = job.data;

        try {
            await db.update(itinerary_generations)
                .set({ status: "running", attemptNumber: sql`attempt_number + 1` })
                .where(eq(itinerary_generations.id, itineraryGenerationId));

            const {generatedPlan, generationKey, generationMeta} = await generateItinerary({ 
                cities, 
                startDate, 
                endDate, 
                minBudget, 
                maxBudget, 
                interests, 
                currency: "Rupees" 
            });

            await db.update(itineraries)
                .set({ 
                    generatedPlan: generatedPlan, 
                    generateStatus: "completed", 
                    generationCompletedAt: new Date(), 
                    generationAttempts: sql`generation_attempts + 1`, 
                    generationMeta: generationMeta 
                })
                .where(eq(itineraries.id, itineraryId));
            
            await db.update(itinerary_generations)
                .set({ 
                    status: "completed", 
                    generatedPlan: generatedPlan, 
                    completedAt: new Date(),
                    generatedMeta: generationMeta,
                    errorMessage: null,
                    generationKey: generationKey
                })
                .where(eq(itinerary_generations.id, itineraryGenerationId));

            const [tripData] = await db
                .select({
                    tripName: trips.tripName,
                    userEmail: users.email,
                })
                .from(trips)
                .where(eq(trips.id, tripId))
                .leftJoin(users, eq(users.id, trips.userId));

            await sendMail({
                to: tripData.userEmail,
                status: "completed",
                itineraryName: tripData.tripName,
                tripId: tripId,
            });

        } catch (error) {
            console.error("Error processing job:", error);

            await db.update(itineraries)
                .set({ 
                    generateStatus: "failed", 
                    generationAttempts: sql`generation_attempts + 1` 
                })
                .where(eq(itineraries.id, itineraryId));

            await db.update(itinerary_generations)
                .set({ 
                    status: "failed", 
                    completedAt: new Date(), 
                    errorMessage: error.message 
                })
                .where(eq(itinerary_generations.id, itineraryGenerationId));

            try {
                const [tripData] = await db
                    .select({
                        tripName: trips.tripName,
                        userEmail: users.email,
                    })
                    .from(trips)
                    .where(eq(trips.id, tripId))
                    .leftJoin(users, eq(users.id, trips.userId));

                await sendMail({
                    to: tripData.userEmail,
                    status: "failed",
                    itineraryName: tripData.tripName,
                    tripId: tripId,
                });
            } catch (emailError) {
                console.error("Error sending failure email:", emailError);
            }
            
            throw error;
        }
    },
    {   
        connection: redis,
        limiter: {
            max: 3, 
            duration: 10000, 
        },
    }
);
