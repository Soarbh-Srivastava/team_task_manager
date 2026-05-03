import { Router } from "express";
import { TaskController } from "../task/task.controller";
import { authenticate } from "../../../middleware/auth";

const router = Router();

router.get("/:projectId", authenticate, TaskController.getProjectTasks);
router.patch("/:taskId/status", authenticate, TaskController.updateStatus);

router.post("/", authenticate, TaskController.create);

export default router;
