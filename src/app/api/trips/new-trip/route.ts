import {db} from "@/db/schema";
import {trips} from "@/db/schema/trips";
import {itineraries} from "@/db/schema/itineraries";
import {NextResponse} from "next/server";
import {getCurrentUserFromToken} from "@/lib/auth";
import { type InferInsertModel } from "drizzle-orm";
import {itinerary_generations} from "@/db/schema/itinerary_generations";
import { itineraryQueue } from "@/lib/queues/itineraryQueue";
import { eq, and, sql } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const user = await getCurrentUserFromToken(req);

        if(!user){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const {country, state, cities, startDate, endDate, maxBudget, minBudget, interests} = body;
        if (!country || !state || !cities || !startDate || !endDate || !maxBudget || !minBudget || !interests) {
            return NextResponse.json({error: "All fields are required"}, {status: 400});
        }

        const existingItinerary = await db
        .select({ id: itineraries.id, generateStatus: itineraries.generateStatus })
        .from(itineraries)
        .where(
            and(
                sql`ARRAY[${cities.join(",")}]::text[] = ${itineraries.cities}`,
                eq(itineraries.minBudget, minBudget),
                eq(itineraries.maxBudget, maxBudget),
                eq(itineraries.interests, interests.join(", ")),
                eq(itineraries.generateStatus, "pending")
            )
        )
        .limit(1);

        if (existingItinerary.length > 0) {
            return NextResponse.json({message: "A similar itinerary generation is already in progress."}, { status: 409 });
        }

        //const generatePlan = await generateItinerary({cities, startDate, endDate, minBudget, maxBudget, interests, currency: "Rupees"});
        //const result = await db.transaction(async (tx) => {
            const [newItinerary] = await db.insert(itineraries).values({
                cities: cities,
                maxBudget: maxBudget,
                minBudget: minBudget,
                interests: interests.join(", "),
                generatedPlan: {},
            })
            .returning({id: itineraries.id});

            const [newItineraryGeneration] = await db.insert(itinerary_generations).values({
                itineraryId: newItinerary.id,
                status: "pending",
                createdAt: new Date(),
                generationKey: "",
                attemptNumber: 0,
            }).returning({id: itinerary_generations.id});

            type NewTrip = InferInsertModel<typeof trips>;

            const newTrip: NewTrip = {
                userId: user.id,
                itineraryId: newItinerary.id,
                country: country,
                state: state,
                tripName: `Trip to ${cities.join(", ")}`,
                startDate: new Date(startDate).toISOString().split("T")[0],
                endDate: new Date(endDate).toISOString().split("T")[0],
            };

            const [newTripRecord] = await db.insert(trips).values(newTrip).returning({id: trips.id});

            /*return {
                itineraryId: newItinerary.id,
                itineraryGenerationId: newItineraryGeneration.id,
                tripId: newTripRecord.id,
            };
        });*/

        await itineraryQueue.add("generate-itinerary", {
            cities,
            startDate,
            endDate,
            minBudget,
            maxBudget,
            interests,
            itineraryId: newItinerary.id,
            itineraryGenerationId: newItineraryGeneration.id,
            tripId: newTripRecord.id
        }, { jobId: `itinerary-${newItinerary.id}` });

        return NextResponse.json({ message: "Trip created successfully", tripId: newTripRecord.id }, { status: 201 });

    }
    catch(error) {
        console.error("Error creating new trip:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}