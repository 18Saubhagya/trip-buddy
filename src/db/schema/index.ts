import {drizzle} from 'drizzle-orm/neon-http';
import {neon} from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

import {users, usersRelations} from './users';
import {trips, tripsRelations} from './trips';
import {itineraries, itinerariesRelations} from './itineraries';


dotenv.config({path: '.env.local'});

console.log('Connecting to database with URL:', process.env.DATABASE_URL);
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, {
    schema: {
        users,
        trips,
        itineraries
    }
});

export {
    usersRelations,
    tripsRelations,
    itinerariesRelations,
    users,
    trips,
    itineraries,
};