import "reflect-metadata"
import { DataSource } from "typeorm"
import {Goal} from "./entities/Goal";
import {Action} from "./entities/Action";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "",
    password: "postgres",
    database: "postgres",
    synchronize: true,
    logging: true,
    entities: [Goal, Action],
    migrations: [__dirname + '/migrations/*.js'],
    subscribers: [],
})
