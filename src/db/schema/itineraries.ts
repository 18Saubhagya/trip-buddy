import {pgTable, serial, text, jsonb, timestamp, integer} from "drizzle-orm/pg-core"
import {trips} from "@/db/schema/trips";
import {relations} from "drizzle-orm";

export const itineraries = pgTable("itineraries", {
    id: serial("id").primaryKey(),
    days: integer("days").notNull(),
    cities: text("cities").notNull(),
    interests: text("interests").notNull(),
    maxBudget: integer("max_budget").notNull(),
    minBudget: integer("min_budget").notNull(),
    generatedPlan: jsonb("generated_plan").notNull(),
    generateStatus: text("generate_status").notNull().default("pending"), // pending, completed, failed
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const itinerariesRelations = relations(itineraries, ({many}) => ({
    trips: many(trips),
}));