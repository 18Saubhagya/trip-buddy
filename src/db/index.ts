import {drizzle} from 'drizzle-orm/neon-http';
import {neon} from '@neondatabase/serverless';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config({path: '.env.local'});

console.log('Connecting to database with URL:', process.env.DATABASE_URL);
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, {schema});