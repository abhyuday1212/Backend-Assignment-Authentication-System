import { Router } from "express";

import {
  forgotPassword,
  generateNewRefreshToken,
  loginUser,
  registerUser,
  resetPassword,
} from "../controllers/auth.controller.ts";

const router = Router();

// auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forget", forgotPassword);
router.post("/reset/:token", resetPassword);
router.post("/refresh", generateNewRefreshToken);

export default router;
