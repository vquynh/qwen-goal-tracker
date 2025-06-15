import "reflect-metadata"
import { DataSource } from "typeorm"
import {Goal} from "./entities/Goal";
import {Action} from "./entities/Action";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: true,
    entities: [Goal, Action],
    migrations: [__dirname + '/migrations/*.js'],
    subscribers: [],
})
