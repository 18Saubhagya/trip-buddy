import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dotenv from "dotenv";

import { users } from "./schema/users";
import { trips } from "./schema/trips";
import { itineraries } from "./schema/itineraries";
import { itinerary_generations } from "./schema/itinerary_generations";

dotenv.config({ path: ".env.local" });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: false },
    max: 10,
});

export const db = drizzle(pool, {
    schema: { users, trips, itineraries, itinerary_generations },
});

export default db;
