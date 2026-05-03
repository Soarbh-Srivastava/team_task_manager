import dotenv from "dotenv";
const result = dotenv.config();

if (result.error && (result.error as NodeJS.ErrnoException).code !== "ENOENT") {
  console.log("Error loading environment variables, aborting...");
  process.exit(1);
}

const portEnv = process.env.PORT;

import "reflect-metadata";
import express from "express";
import { isNumber } from "./utils/isNumber";
import { logger } from "./logger";
import { AppDataSource } from "./data_logger";
import authRoutes from "./modules/auth/auth.routes";
import taskRoutes from "./modules/controllers/task/task.routes";
import teamRoutes from "./modules/controllers/team/team.routes";
import projectRoutes from "./modules/controllers/project/project.routes";
import dashboardRoutes from "./modules/controllers/dashboard/dashboard.routes";

const app = express();

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
];

function isRailwayOrigin(origin: string) {
  try {
    const url = new URL(origin);
    return url.hostname.endsWith(".up.railway.app");
  } catch {
    return false;
  }
}

function getAllowedOrigins() {
  const configuredOrigins =
    process.env.CORS_ORIGIN ?? process.env.FRONTEND_ORIGIN;

  if (!configuredOrigins) {
    return defaultAllowedOrigins;
  }

  return configuredOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function isAllowedOrigin(origin: string | undefined) {
  if (!origin) {
    return true;
  }

  const allowedOrigins = getAllowedOrigins();

  return allowedOrigins.includes(origin) || isRailwayOrigin(origin);
}

function setupExpress() {
  app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (typeof origin === "string" && isAllowedOrigin(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Vary", "Origin");
    }

    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    );
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }

    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/auth", authRoutes);
  app.use("/tasks", taskRoutes);
  app.use("/teams", teamRoutes);
  app.use("/projects", projectRoutes);
  app.use("/dashboard", dashboardRoutes);

  app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
  });
}

function startServer() {
  let port: number;

  if (portEnv && isNumber(portEnv)) {
    port = Number(portEnv);
  } else {
    port = 9000;
  }

  app.listen(port, () => {
    logger.info(`HTTP REST API server is now at http://localhost:${port}`);
  });
}

AppDataSource.initialize()
  .then(() => {
    logger.info("The datasource has been intialized succesfully");
    setupExpress();
    startServer();
  })
  .catch((err) => {
    logger.error(`Error during datasource initialization. `, err);
    process.exit(1);
  });
