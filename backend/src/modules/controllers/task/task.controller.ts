import { Request, Response } from "express";
import { TaskService } from "../task/task.service";
import {
  parseTaskBody,
  parseTaskStatusBody,
} from "../../../utils/request-validation";

export class TaskController {
  static async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const task = await TaskService.createTask(
        parseTaskBody(req.body),
        req.user,
      );
      res.status(201).json(task);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getProjectTasks(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const tasks = await TaskService.getTasksByProject(
        String(req.params.projectId),
        req.user,
      );
      res.json(tasks);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const task = await TaskService.updateTaskStatus(
        String(req.params.taskId),
        parseTaskStatusBody(req.body).status,
        req.user,
      );

      res.json(task);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
