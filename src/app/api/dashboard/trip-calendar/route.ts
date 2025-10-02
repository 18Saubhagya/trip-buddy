import { NextResponse } from "next/server";
import { db } from "@/db/schema";
import { trips } from "@/db/schema";
import { getCurrentUserFromToken } from "@/lib/auth";
import { eq, and , gt } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const user = await getCurrentUserFromToken(req);

        if(!user){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        let query = db.select({
                id: trips.id,
                tripName: trips.tripName,
                startDate: trips.startDate,
                endDate: trips.endDate,
                status: trips.status,
                country: trips.country,
                state: trips.state,
            })
            .from(trips)
            .where(and(
                eq(trips.userId, user.id),
                gt(trips.endDate, new Date().toISOString().split("T")[0])
            ))
            .orderBy(trips.startDate)

        const tableData = await query;

        return NextResponse.json({ trips: tableData}, {status: 200});

    } catch (error) {
        console.error("Error in trip table route:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
};
