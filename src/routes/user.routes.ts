import { Router } from "express";

import { logoutUser } from "../controllers/user.controller.ts";
import { verifyToken } from "../middlewares/auth.middleware.ts";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.ts";

const router = Router();

// Secured routes
// routes only accessible for user
router.post("/logout", verifyToken, logoutUser);
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);

export default router;
