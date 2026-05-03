import { Request, Response } from "express";
import { ProjectService } from "./project.service";
import { parseProjectBody } from "../../../utils/request-validation";

export class ProjectController {
  static async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const project = await ProjectService.createProject(
        parseProjectBody(req.body),
        req.user,
      );
      res.status(201).json(project);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const projects = await ProjectService.listProjects(
        req.user,
        req.query.teamId as string | undefined,
      );
      res.json(projects);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
