import { Router } from "express";
import { authenticate } from "../../../middleware/auth";
import { ProjectController } from "./project.controller";

const router = Router();

router.get("/", authenticate, ProjectController.list);
router.post("/", authenticate, ProjectController.create);

export default router;
