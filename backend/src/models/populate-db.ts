import "reflect-metadata";
import dotenv from "dotenv";
import { AppDataSource } from "../data_logger";
import { Project } from "../entities/Project";
import { Task, TaskPriority, TaskStatus } from "../entities/Task";
import { Team } from "../entities/Team";
import { User } from "../entities/User";
import { Roles } from "../types/roles";
import { hashPassword } from "../utils/auth";

const result = dotenv.config();
if (result.error && (result.error as NodeJS.ErrnoException).code !== "ENOENT") {
  throw result.error;
}

async function main() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const teamRepo = AppDataSource.getRepository(Team);
  const projectRepo = AppDataSource.getRepository(Project);
  const taskRepo = AppDataSource.getRepository(Task);

  const adminEmail = "admin@teamtask.local";
  const memberEmail = "member@teamtask.local";

  let admin = await userRepo.findOne({ where: { email: adminEmail } });
  if (!admin) {
    admin = userRepo.create({
      email: adminEmail,
      full_name: "System Admin",
      password_hash: hashPassword("Admin1234!"),
      role: Roles.ADMIN,
    });
    admin = await userRepo.save(admin);
  }

  let member = await userRepo.findOne({ where: { email: memberEmail } });
  if (!member) {
    member = userRepo.create({
      email: memberEmail,
      full_name: "Sample Member",
      password_hash: hashPassword("Member1234!"),
      role: Roles.MEMBER,
    });
    member = await userRepo.save(member);
  }

  let team = await teamRepo.findOne({
    where: { name: "Launch Team" },
    relations: ["owner", "members"],
  });

  if (!team) {
    team = teamRepo.create({
      name: "Launch Team",
      description: "Seeded team for trying the API",
      owner: admin,
      members: [admin, member],
    });
    team = await teamRepo.save(team);
  }

  let project = await projectRepo.findOne({
    where: { name: "Q2 Delivery" },
    relations: ["team"],
  });

  if (!project) {
    project = projectRepo.create({
      name: "Q2 Delivery",
      description: "Seed project for dashboard and task testing",
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      team,
    });
    project = await projectRepo.save(project);
  }

  const existingTask = await taskRepo.findOne({
    where: { title: "Seeded task" },
    relations: ["project"],
  });

  if (!existingTask) {
    const task = taskRepo.create({
      title: "Seeded task",
      description: "Use this task to test the task flow",
      priority: TaskPriority.HIGH,
      status: TaskStatus.IN_PROGRESS,
      due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      creator: admin,
      assignee: member,
      project,
      completed_at: null,
    });

    await taskRepo.save(task);
  }

  await AppDataSource.destroy();
  console.log("Seed data created successfully");
}

main().catch(async (error) => {
  console.error("Seed script failed:", error);
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  process.exit(1);
});
