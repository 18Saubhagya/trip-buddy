import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { trips, itineraries } from "@/db/index";
import { getCurrentUserFromToken } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

interface Params {
    tripId: string;
}

export async function GET(req: Request, {params} : {params: Params}) {
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

        const result = await db.select(
            {
                tripId: trips.id,
                tripName: trips.tripName,
                startDate: trips.startDate,
                endDate: trips.endDate,
                status: trips.status,
                country: trips.country,
                state: trips.state,
                itinerary: {
                    id: itineraries.id,
                    cities: itineraries.cities,
                    interests: itineraries.interests,
                    generatedPlan: itineraries.generatedPlan,
                    generateStatus: itineraries.generateStatus,
                },
            }
        )
        .from(trips)
        .innerJoin(itineraries, eq(trips.itineraryId, itineraries.id))
        .where(
            and(
                eq(trips.id, tid),
            )
        )

        if(result === undefined || result.length === 0){
            return NextResponse.json({ nextTrip: null });
        }

        return NextResponse.json({ trip: result[0] });
    }
    catch (error) {
        console.error("Error in next-trip route:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
};
