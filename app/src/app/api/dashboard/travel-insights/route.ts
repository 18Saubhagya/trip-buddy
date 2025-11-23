import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { trips, itineraries } from "@/db/index";
import { getCurrentUserFromToken } from "@/lib/auth";
import { eq, and , gt, sql, asc, desc } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const user = await getCurrentUserFromToken(req);

        if(!user){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const [stats] = await db.select({
                totalDays: sql<number>`COALESCE(SUM(DATE_PART('day', ${trips.endDate}::timestamp - ${trips.startDate}::timestamp)),0)`,
                statesVisited: sql<number>`COALESCE(COUNT(DISTINCT ${trips.state}),0)`,
                totalBudget: sql<number>`COALESCE(SUM(${itineraries.maxBudget}),0)`,
                avgDuration: sql<number>`COALESCE(AVG(DATE_PART('day', ${trips.endDate}::timestamp - ${trips.startDate}::timestamp)),0)`,
            })
            .from(trips)
            .innerJoin(itineraries, eq(trips.itineraryId, itineraries.id))
            .where(eq(trips.userId, user.id));
        
        const monthlyTrips = await db.select({
                month: sql<number>`EXTRACT(MONTH FROM ${trips.startDate})`,
                tripCount: sql<number>`COUNT(*)`,
            })
            .from(trips)
            .where(
                and(
                    eq(trips.userId, user.id),
                    gt(trips.startDate, new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0])
                )
            )
            .groupBy(sql`EXTRACT(MONTH FROM ${trips.startDate})`)
            .orderBy(asc(sql`EXTRACT(MONTH FROM ${trips.startDate})`));

        const budgetQueryTrip = await db.select({
                tripName: trips.tripName,
                budget: itineraries.maxBudget,
            })
            .from(trips)
            .innerJoin(itineraries, eq(trips.itineraryId, itineraries.id))
            .where(eq(trips.userId, user.id))
            .orderBy(desc(trips.startDate))
            .limit(8);

        return NextResponse.json({ stats, monthlyTrips, budgetQueryTrip });
    }
    catch (error) {
        console.error("Error in insight route:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
};
