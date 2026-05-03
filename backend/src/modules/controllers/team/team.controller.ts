import { Request, Response } from "express";
import { TeamService } from "./team.service";
import {
  parseMemberBody,
  parseTeamBody,
} from "../../../utils/request-validation";

export class TeamController {
  static async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const team = await TeamService.createTeam(
        parseTeamBody(req.body),
        req.user,
      );
      res.status(201).json(team);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const teams = await TeamService.listTeams(req.user);
      res.json(teams);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async addMember(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const team = await TeamService.addMember(
        String(req.params.teamId),
        parseMemberBody(req.body).memberEmail,
        req.user,
      );
      res.json(team);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
