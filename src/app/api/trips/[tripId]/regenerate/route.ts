import { db } from "@/db/index";
import { trips } from "@/db/index";
import { itineraries } from "@/db/schema/itineraries";
import { NextResponse } from "next/server";
import { itinerary_generations } from "@/db/schema/itinerary_generations";
import { itineraryQueue } from "@/lib/queues/itineraryQueue";
import { eq, and, sql, or } from "drizzle-orm";
import { getCurrentUserFromToken } from "@/lib/auth";
import { type InferInsertModel } from "drizzle-orm";
import { start } from "repl";

interface Params {
    tripId: string;
}

export async function POST(req: Request, {params} : {params: Params}) {
    try {
        const {tripId} = await params;
        //const tripId = Number(params.tripId);
        const tid = Number(tripId);
        if (isNaN(tid)) {
            return NextResponse.json({error: "Invalid trip ID"}, {status: 400});
        }
        const user = await getCurrentUserFromToken(req);

        if(!user){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const [trip] = await db
            .select({
                itineraryId: trips.itineraryId,
                startDate: trips.startDate,
                endDate: trips.endDate,
            })
            .from(trips)
            .where(and(eq(trips.id, tid)))
            .limit(1);
        
        const [oldItinerary] = await db
            .select({
                id: itineraries.id,
                cities: itineraries.cities,
                minBudget: itineraries.minBudget,
                maxBudget: itineraries.maxBudget,
                interests: itineraries.interests,
                generateStatus: itineraries.generateStatus,
            })
            .from(itineraries)
            .where(eq(itineraries.id, trip.itineraryId))
            .limit(1);

        let generationRecordId;
        
        if(oldItinerary.generateStatus === "completed") {

            const [newItineraryGeneration] = await db.insert(itinerary_generations).values({
                itineraryId: oldItinerary.id,
                status: "pending",
                createdAt: new Date(),
                generationKey: "",
                attemptNumber: 0,
            }).returning({id: itinerary_generations.id});

            generationRecordId = newItineraryGeneration.id;

        } else if(oldItinerary.generateStatus === "failed") {
            const [existingGenerations] = await db
                .select({id: itinerary_generations.id})
                .from(itinerary_generations)
                .where(and(eq(itinerary_generations.itineraryId, oldItinerary.id), or(eq(itinerary_generations.status, "pending"), eq(itinerary_generations.status, "failed"))))
                .limit(1);

            console.log(existingGenerations);
            
            
            await db.update(itinerary_generations)
                .set({ status: "pending", 
                       startedAt: new Date(), 
                       completedAt: null, 
                       errorMessage: null, 
                       generatedPlan: null, 
                       generationKey: sql`''`, 
                       attemptNumber: sql<number>`attempt_number + 1` })
                .where(eq(itinerary_generations.id, existingGenerations.id));

            generationRecordId = existingGenerations.id;

        } else {
            return NextResponse.json({error: "Itinerary generation is still in progress. Please wait."}, {status: 409});
        }

        const jobId = `itinerary-${generationRecordId}`;
        const existingJob = await itineraryQueue.getJob(jobId);

        if (existingJob) {
            const state = await existingJob.getState();
            if (["waiting", "active", "delayed", "paused"].includes(state)) {
                return NextResponse.json({ error: "A generation job is already running for this itinerary." }, { status: 409 });
            }

            await existingJob.remove();
        }
        
        await itineraryQueue.add("generate-itinerary", {
            cities: oldItinerary.cities,
            startDate: trip.startDate,
            endDate: trip.endDate,
            minBudget: oldItinerary.minBudget,
            maxBudget: oldItinerary.maxBudget,
            interests: oldItinerary.interests.split(",").map((interest) => interest.trim()),
            itineraryId: oldItinerary.id,
            itineraryGenerationId: generationRecordId,
            tripId: tid
        }, { jobId: jobId });

        return NextResponse.json({ message: "Trip created successfully", tripId: tid }, { status: 201 });
        
    } catch (error) {
        console.error("Error in regenerate route:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}

