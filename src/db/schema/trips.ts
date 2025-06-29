import {pgTable, serial, integer, text, timestamp, date} from "drizzle-orm/pg-core";
import {users} from "@/db/schema/users";
import { itineraries } from "./itineraries";
import {relations} from "drizzle-orm";

export const trips = pgTable("trips", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id),
    itineraryId: integer("itinerary_id").notNull().references(() => itineraries.id),
    tripName: text("trip_name").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    status: text("status").notNull().default("new"), // new, in-progress, completed, cancelled
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const tripsRelations = relations(trips, ({one}) => ({
    user: one(users, {
        fields: [trips.userId],
        references: [users.id],
    }),
    itinerary: one(itineraries, {
        fields: [trips.itineraryId],
        references: [itineraries.id],
    }),
}));

