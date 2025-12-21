import { pgTable, serial, text, jsonb, timestamp, integer, pgEnum, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { itineraries } from "./itineraries.js";

export const generationStatusEnum = pgEnum("itinerary_generation_status_enum", ["pending","running","completed","failed"]);

export const itinerary_generations = pgTable("itinerary_generations", {
    id: serial("id").primaryKey(),
    itineraryId: integer("itinerary_id").notNull().references(() => itineraries.id, { onDelete: "cascade" }),
    status: generationStatusEnum("status").notNull().default("pending"),
    startedAt: timestamp("started_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    completedAt: timestamp("completed_at"),
    attemptNumber: integer("attempt_number").notNull().default(1),
    generatedPlan: jsonb("generated_plan"),
    errorMessage: text("error_message"),
    generatedMeta: jsonb("generated_meta"),
    generationKey: text("generation_key").notNull(),
}, (table) => {
    return {
        itineraryIdx: index("itinerary_generations_itinerary_id_idx").on(table.itineraryId),
        statusIdx: index("itinerary_generations_status_idx").on(table.status),
    }
});

export const itineraryGenerationsRelations = relations(itinerary_generations, ({ one }) => ({
    itinerary: one(itineraries, {
        fields: [itinerary_generations.itineraryId],
        references: [itineraries.id],
    }),
}));
