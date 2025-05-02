import express from "express";
import { syncUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/clerk-webhook", syncUser);

export default router;
