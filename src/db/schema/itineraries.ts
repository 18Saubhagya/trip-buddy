import {pgTable, serial, text, jsonb, timestamp, integer, varchar, index, pgEnum} from "drizzle-orm/pg-core"
import {trips} from "@/db/schema/trips";
import {relations} from "drizzle-orm";

export const tripStatusEnum = pgEnum("generate_status_enum", ["pending","completed","failed"]);

export const itineraries = pgTable("itineraries", {
    id: serial("id").primaryKey(),
    cities: text("cities").array().notNull(),
    interests: text("interests").notNull(),
    maxBudget: integer("max_budget").notNull(),
    minBudget: integer("min_budget").notNull(),
    currency: varchar("currency", { length: 10 }).notNull().default("Rupees"),
    generatedPlan: jsonb("generated_plan"),
    generateStatus: tripStatusEnum("generate_status").notNull().default("pending"), // pending, completed, failed
    generationAttempts: integer("generation_attempts").notNull().default(0),
    generationCompletedAt: timestamp("generation_completed_at"),
    generationMeta: jsonb("generation_meta"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => {
    return {
        statusIdx: index("itineraries_generate_status_idx").on(table.generateStatus),
        budgetIdx: index("itineraries_max_budget_idx").on(table.minBudget,table.maxBudget),
    }
});

export const itinerariesRelations = relations(itineraries, ({many}) => ({
    trips: many(trips),
}));