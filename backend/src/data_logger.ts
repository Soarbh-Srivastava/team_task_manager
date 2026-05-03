import { DataSource } from "typeorm";
import { Project } from "./entities/Project";
import { Task } from "./entities/Task";
import { Team } from "./entities/Team";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  entities: [User, Team, Project, Task],
  synchronize: true,
  logging: true,
});
