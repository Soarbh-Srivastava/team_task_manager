import { Router } from "express";
import { authenticate } from "../../../middleware/auth";
import { DashboardController } from "./dashboard.controller";

const router = Router();

router.get("/summary", authenticate, DashboardController.summary);

export default router;
