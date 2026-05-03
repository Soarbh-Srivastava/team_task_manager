import { Router } from "express";
import { authenticate } from "../../../middleware/auth";
import { TeamController } from "./team.controller";

const router = Router();

router.get("/", authenticate, TeamController.list);
router.post("/", authenticate, TeamController.create);
router.post("/:teamId/members", authenticate, TeamController.addMember);

export default router;
