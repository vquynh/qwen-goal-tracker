// test/setup.ts
import { AppDataSource } from '../data-source';

beforeAll(async () => {
    try {
        // Check if DataSource is already initialized
        if (!AppDataSource.isInitialized) {
            // Configure for testing with SQLite in memory
            await AppDataSource.initialize();
        }
    } catch (error) {
        console.error('Error initializing test DataSource:', error);
        throw error;
    }
});

afterAll(async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
});