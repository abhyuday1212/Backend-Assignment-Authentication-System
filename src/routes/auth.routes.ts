import { Router } from "express";

import {
  forgotPassword,
  generateNewAccessToken,
  loginUser,
  registerUser,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = Router();

// auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forget", forgotPassword);
router.post("/reset/:token", resetPassword);
router.post("/refresh", generateNewAccessToken);

export default router;
