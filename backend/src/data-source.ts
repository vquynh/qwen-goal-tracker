import { DataSource } from 'typeorm';
import { Goal } from './entities/Goal';
import { Action } from './entities/Action';

export const AppDataSource = new DataSource({
    type: process.env.NODE_ENV === 'test' ? 'sqlite' : 'postgres',
    database: process.env.NODE_ENV === 'test' ? ':memory:' : process.env.DATABASE_URL,
    host: process.env.NODE_ENV !== 'test' ? process.env.DB_HOST : undefined,
    port: process.env.NODE_ENV !== 'test' ? parseInt(process.env.DB_PORT || '5432') : undefined,
    username: process.env.NODE_ENV !== 'test' ? process.env.DB_USERNAME : undefined,
    password: process.env.NODE_ENV !== 'test' ? process.env.DB_PASSWORD : undefined,
    synchronize: process.env.NODE_ENV === 'test', // Only for tests
    dropSchema: process.env.NODE_ENV === 'test', // Only for tests
    logging: false,
    entities: [Goal, Action],
    migrations: [__dirname + '/migrations/*.js'],
    subscribers: [],
    ...(process.env.NODE_ENV === 'test' && {
        extra: {
            foreignKeys: true
        }
    })
})
