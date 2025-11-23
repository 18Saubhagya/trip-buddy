import { NextResponse } from "next/server";
import { db } from "@/db";
import { ratings } from "@/db/schema/ratings";
import { itineraries } from "@/db/schema/itineraries";
import { itinerary_generations } from "@/db/schema/itinerary_generations";
import { trips } from "@/db/schema/trips";
import { eq, and, desc } from "drizzle-orm";
import { getCurrentUserFromToken } from "@/lib/auth";

export async function POST(req: Request) {

    try {
        const user = await getCurrentUserFromToken(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            itineraryId,
            overall,
            interestScores,
            comments,
        }: {
            itineraryId: number;
            overall: number;
            interestScores?: Record<string, number>;
            comments?: string | null;
        } = body;

        if (!itineraryId || typeof overall !== "number") {
            return NextResponse.json({ error: "itineraryId and overall rating are required" },{ status: 400 });
        }

        if (overall < 1 || overall > 5) {
            return NextResponse.json({ error: "Overall rating must be between 1 and 5" },{ status: 400 });
        }

        const [tripRow] = await db
            .select({
                tripId: trips.id,
                itineraryId: itineraries.id,
            })
            .from(itineraries)
            .innerJoin(trips, eq(trips.itineraryId, itineraries.id))
            .where(
                and(eq(itineraries.id, itineraryId), eq(trips.userId, user.id))
            )
            .limit(1);

        if (!tripRow) {
            return NextResponse.json({ error: "Itinerary not found or does not belong to you" }, { status: 404 });
        }

        const [latestGen] = await db
            .select({
                id: itinerary_generations.id,
            })
            .from(itinerary_generations)
            .where(eq(itinerary_generations.itineraryId, itineraryId))
            .orderBy(desc(itinerary_generations.createdAt))
            .limit(1);

        if (!latestGen) {
            return NextResponse.json({ error: "No generation record found for this itinerary" }, { status: 400 });
        }

        const cleanedInterestScores: Record<string, number> = {};
        if (interestScores && typeof interestScores === "object") {
            for (const [k, v] of Object.entries(interestScores)) {
                if (typeof v === "number") {
                    const clamped = Math.min(5, Math.max(1, Math.round(v)));
                    cleanedInterestScores[k] = clamped;
                }
            }
        }

        const [existing] = await db
            .select({ id: ratings.id })
            .from(ratings)
            .where(
                and(
                eq(ratings.userId, user.id),
                eq(ratings.itineraryGenerationId, latestGen.id)
                )
            )
            .limit(1);

        if (existing) {
            await db
                .update(ratings)
                .set({
                overall,
                comments: comments ?? "",
                interestScores: cleanedInterestScores,
                updatedAt: new Date(),
                })
                .where(eq(ratings.id, existing.id));
        } else {
            await db.insert(ratings).values({
                userId: user.id,
                itineraryId,
                itineraryGenerationId: latestGen.id,
                overall,
                comments: comments ?? "",
                interestScores: cleanedInterestScores,
            });
        }

        return NextResponse.json({ message: "Rating saved" }, { status: 201 });
    } catch (err) {
        console.error("Error in /api/ratings:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
