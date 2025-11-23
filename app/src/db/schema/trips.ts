import {pgTable, serial, integer, text, timestamp, date, varchar, index, pgEnum} from "drizzle-orm/pg-core";
import {users} from "@/db/schema/users";
import { itineraries } from "./itineraries";
import {relations} from "drizzle-orm";

export const tripStatusEnum = pgEnum("trip_status_enum", ["new", "in_progress", "completed", "cancelled"]);

export const trips = pgTable("trips", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
    itineraryId: integer("itinerary_id").notNull().references(() => itineraries.id, {onDelete: "cascade"}),
    tripName: text("trip_name").notNull(),
    country: varchar("country", { length: 100 }),
    state: varchar("state", { length: 100 }),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    status: tripStatusEnum("status").notNull().default("new"), // new, in-progress, completed, cancelled
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => {
    return {
        userIdx: index("trips_user_id_idx").on(table.userId),
        statusIdx: index("trips_status_idx").on(table.status),
        startDateIdx: index("trips_start_date_idx").on(table.startDate),
    }
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

