import { Router } from "express";

import { logoutUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

// Secured routes
//user only routes
router.get("/profile", verifyToken,authorize(["user"]), getUserProfile);

// routes accessible for user with valid token only (protected via middleware)
router.post("/logout", verifyToken, logoutUser);
router.patch("/update", verifyToken, updateUserProfile);

export default router;
