// test/setup.ts
import { AppDataSource } from '../src/data-source';

beforeAll(async () => {
    // Use SQLite for testing instead of PostgreSQL
    if (!AppDataSource.isInitialized) {
        AppDataSource.setOptions({
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            dropSchema: true,
            entities: ['src/**/*.entity{.ts,.js}'],
            migrations: ['src/migrations/**/*{.ts,.js}']
            // Remove the cli property - it's not valid for SQLite
        });
        await AppDataSource.initialize();
    }
});

afterAll(async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
});