import { NextResponse } from "next/server";
import { db } from "@/db/schema";
import { trips, itineraries } from "@/db/schema";
import { getCurrentUserFromToken } from "@/lib/auth";
import { eq, and , gt } from "drizzle-orm";

export async function GET(req: Request) {
    try {
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
                    cities: itineraries.cities,
                    interests: itineraries.interests,
                },
            }
        )
        .from(trips)
        .innerJoin(itineraries, eq(trips.itineraryId, itineraries.id))
        .where(
            and(
                eq(trips.userId, user.id),
                gt(trips.startDate, new Date().toISOString().split("T")[0])
            )
        )
        .orderBy(trips.startDate)
        .limit(1);

        if(result.length === 0) {
            return NextResponse.json({ nextTrip: null });
        }

        return NextResponse.json({ nextTrip: result[0] });
    }
    catch (error) {
        console.error("Error in next-trip route:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
};
