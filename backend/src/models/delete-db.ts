import "reflect-metadata";
import dotenv from "dotenv";
import { AppDataSource } from "../data_logger";

const result = dotenv.config();
if (result.error && (result.error as NodeJS.ErrnoException).code !== "ENOENT") {
  throw result.error;
}

async function main() {
  await AppDataSource.initialize();

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.query(
    'TRUNCATE TABLE "tasks", "projects", "team_members", "teams", "users" RESTART IDENTITY CASCADE',
  );
  await queryRunner.release();

  await AppDataSource.destroy();
  console.log("Database truncated successfully");
}

main().catch(async (error) => {
  console.error("Delete-db script failed:", error);
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  process.exit(1);
});
