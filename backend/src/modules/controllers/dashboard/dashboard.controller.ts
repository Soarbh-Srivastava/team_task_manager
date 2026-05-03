import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

export class DashboardController {
  static async summary(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const summary = await DashboardService.getSummary(req.user);
      res.json(summary);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
