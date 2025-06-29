import {db} from "@/db/schema";
import {trips} from "@/db/schema/trips";
import {itineraries} from "@/db/schema/itineraries";
import {NextResponse} from "next/server";
import {getCurrentUserFromToken} from "@/lib/auth";
import { type InferInsertModel } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const user = await getCurrentUserFromToken(req);

        if(!user){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const {cities, startDate, endDate, maxBudget, minBudget, interests} = body;
        if (!cities || !startDate || !endDate || !maxBudget || !minBudget || !interests) {
            return NextResponse.json({error: "All fields are required"}, {status: 400});
        }

        const [newItinerary] = await db.insert(itineraries).values({
            cities: cities.join(", "),
            days: Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)),
            maxBudget: maxBudget,
            minBudget: minBudget,
            interests: interests.join(", "),
            generatedPlan: {},
        })
        .returning({id: itineraries.id});

        if (!newItinerary) {
            return NextResponse.json({error: "Failed to create itinerary"}, {status: 500});
        }

        type NewTrip = InferInsertModel<typeof trips>;

        const newTrip: NewTrip = {
            userId: user.id,
            itineraryId: newItinerary.id,
            tripName: `Trip to ${cities.join(", ")}`,
            startDate: new Date(startDate).toISOString().split("T")[0],
            endDate: new Date(endDate).toISOString().split("T")[0],
        };

        await db.insert(trips).values(newTrip);

        return NextResponse.json({ message: "Trip created successfully" }, { status: 201 });

    }
    catch(error) {
        console.error("Error creating new trip:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}