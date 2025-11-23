import {drizzle} from 'drizzle-orm/neon-http';
import {neon} from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

import {users, usersRelations} from './schema/users';
import {trips, tripsRelations} from './schema/trips';
import {itineraries, itinerariesRelations} from './schema/itineraries';
import { itinerary_generations, itineraryGenerationsRelations } from './schema/itinerary_generations';


dotenv.config({path: '.env.local'});

declare global {
    var _neonClient: ReturnType<typeof neon> | undefined;
    var _db: ReturnType<typeof drizzle> | undefined;
}

console.log('Connecting to database with URL:', process.env.DATABASE_URL);
const sql = global._neonClient ?? neon(process.env.DATABASE_URL!);
if (process.env.NODE_ENV !== "production") {
    global._neonClient = sql;
}


export const db = global._db ?? drizzle(sql, {
    schema: {
        users,
        trips,
        itineraries,
        itinerary_generations,
    }
});

if (process.env.NODE_ENV !== "production") {
    global._db = db;
}

export {
    usersRelations,
    tripsRelations,
    itinerariesRelations,
    users,
    trips,
    itineraries,
};