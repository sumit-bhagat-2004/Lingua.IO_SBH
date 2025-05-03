import express from "express";
import {
  getUser,
  getUserMilestones,
  onboardUser,
  syncUser,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.post("/clerk-webhook", syncUser);
router.patch("/onboard", requireAuth, onboardUser);
router.get("/me", requireAuth, getUser);
router.get("/me/milestones", requireAuth, getUserMilestones);

export default router;
