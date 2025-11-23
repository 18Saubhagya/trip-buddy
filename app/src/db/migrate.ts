import {db} from './index';
import {migrate} from 'drizzle-orm/neon-http/migrator';
import * as dotenv from 'dotenv';

dotenv.config({path: '.env.local'});

const runMigrations = async () => {
    try {
        await migrate(db, {
            migrationsFolder: './src/db/migrations'
        })
        console.log('Migrations completed successfully.');
    }
    catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigrations()