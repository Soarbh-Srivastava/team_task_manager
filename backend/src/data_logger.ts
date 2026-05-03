import { DataSource } from "typeorm";
import { Project } from "./entities/Project";
import { Task } from "./entities/Task";
import { Team } from "./entities/Team";
import { User } from "./entities/User";

const databaseUrl = process.env.DATABASE_URL?.trim();
const explicitSslSetting = process.env.DB_SSL ?? process.env.DATABASE_SSL;
const sslSetting =
  explicitSslSetting === "true"
    ? { rejectUnauthorized: false }
    : explicitSslSetting === "false"
      ? false
      : databaseUrl
        ? { rejectUnauthorized: false }
        : false;

  const requiredDbVars = ["DB_HOST", "DB_USERNAME", "DB_PASSWORD", "DB_PORT", "DB_NAME"] as const;
  const missingDbVars = requiredDbVars.filter((key) => !process.env[key]);

  if (!databaseUrl && missingDbVars.length > 0) {
    throw new Error(
      `Database environment variables are missing: ${missingDbVars.join(", ")}. Set DATABASE_URL or the DB_* variables in Railway.`,
    );
  }

export const AppDataSource = new DataSource({
  type: "postgres",
  ...(databaseUrl
    ? { url: databaseUrl }
    : {
        host: process.env.DB_HOST,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
      }),
  ssl: sslSetting,
  entities: [User, Team, Project, Task],
  synchronize: true,
  logging: true,
});
