import {pgTable, serial, varchar, boolean, timestamp} from 'drizzle-orm/pg-core';


export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', {length: 50}).notNull(),
    email: varchar('email').unique().notNull(),
    password: varchar('password', { length: 100}).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
    isActive: boolean('is_active').default(true),
    verifyToken: varchar('verify_token', { length: 100 }),
    verifyTokenExpiry: timestamp('verify_token_expiry'),
    resetPasswordToken: varchar('reset_password_token', { length: 100 }),
    resetPasswordTokenExpiry: timestamp('reset_password_token_expiry'),
    isVerified: boolean('is_verified').default(false),
})