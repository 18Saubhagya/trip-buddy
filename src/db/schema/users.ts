import {pgTable, serial, text, varchar, boolean, timestamp, index} from 'drizzle-orm/pg-core';
import {trips} from "@/db/schema/trips";
import {relations} from 'drizzle-orm';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', {length: 50}).notNull(),
    email: varchar('email').unique().notNull(),
    password: text("password").notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
    isActive: boolean('is_active').default(true),
    verifyToken: text('verify_token'),
    verifyTokenExpiry: timestamp('verify_token_expiry'),
    resetPasswordToken: text('reset_password_token'),
    resetPasswordTokenExpiry: timestamp('reset_password_token_expiry'),
    isVerified: boolean('is_verified').default(false),
    lastLoginAt: timestamp("last_login_at"),
}, (table) => {
    return {
        activeIdx : index('users_is_active_idx').on(table.isActive),
        verifiedIdx : index('users_is_verified_idx').on(table.isVerified),
    }
});

export const usersRelations = relations(users, ({many}) => ({
    trips: many(trips),
}));

