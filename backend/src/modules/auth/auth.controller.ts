import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import {
  parseLoginBody,
  parseSignupBody,
} from "../../utils/request-validation";

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const result = await AuthService.signup(parseSignupBody(req.body));
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(parseLoginBody(req.body));
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
