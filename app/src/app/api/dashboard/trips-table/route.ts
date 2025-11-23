import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { trips } from "@/db/index";
import { getCurrentUserFromToken } from "@/lib/auth";
import { eq, and , sql, desc, ilike, or, type SQL } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const user = await getCurrentUserFromToken(req);

        if(!user){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const page = Number(url.searchParams.get("page") ?? 1);
        const limit = Number(url.searchParams.get("limit") ?? 5);
        const offset = (page - 1) * limit;
        const status = url.searchParams.get("status");
        const search = url.searchParams.get("search");

        const conditions: SQL[] = [eq(trips.userId, user.id)];

        if(status) {
            const statusFilter = status as "new" | "in_progress" | "completed" | "cancelled";
            conditions.push(eq(trips.status, statusFilter));
        }

        if(typeof search === "string" && search.trim() !== "") {
            conditions.push(
                or(
                    ilike(trips.tripName, `%${search}%`) as SQL,
                    ilike(trips.country, `%${search}%`) as SQL,
                    ilike(trips.state, `%${search}%`) as SQL
                ) as SQL
            );
        }

        const [{count}] = await db.select({
                count: sql<number>`COUNT(*)`
            })
            .from(trips)
            .where(and(...conditions));

        const query = db.select({
                id: trips.id,
                tripName: trips.tripName,
                startDate: trips.startDate,
                endDate: trips.endDate,
                status: trips.status,
                country: trips.country,
                state: trips.state,
            })
            .from(trips)
            .where(and(...conditions))
            .orderBy(desc(trips.startDate))
            .limit(limit)
            .offset(offset);

        const tableData = await query;

        return NextResponse.json({page, limit, total: Number(count), totalPages: Math.ceil(Number(count) / limit), tableData}, {status: 200});

    } catch (error) {
        console.error("Error in trip table route:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
};
