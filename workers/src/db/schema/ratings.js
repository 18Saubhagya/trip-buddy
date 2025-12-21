import { pgTable, serial, integer, text, timestamp, index, jsonb } from "drizzle-orm/pg-core";
import { itinerary_generations } from "./itinerary_generations.js";
import { relations } from "drizzle-orm";
import { users } from "./users.js";
import { itineraries } from "./itineraries.js";

export const ratings = pgTable("ratings", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, {onDelete: "cascade" }),
    itineraryGenerationId: integer("itinerary_generation_id").notNull().references(() => itinerary_generations.id, { onDelete: "cascade" }),
    itineraryId: integer("itinerary_id").notNull().references(() => itineraries.id, { onDelete: "cascade" }),
    overall: integer("overall").notNull().default(1),
    comments: text("comments").default(""),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    interestScores: jsonb("interest_scores").default({}),
}, (table) => {
    return {
        userIdx: index("ratings_user_id_idx").on(table.userId),
        itineraryGenerationIdx: index("ratings_itinerary_generation_id_idx").on(table.itineraryGenerationId),
    }
})

export const ratingsRelations = relations(ratings, ({ one }) => ({
    user: one(users, {
        fields: [ratings.userId],
        references: [users.id],
    }),
    itineraryGeneration: one(itinerary_generations, {
        fields: [ratings.itineraryGenerationId],
        references: [itinerary_generations.id],
    }),
}));
