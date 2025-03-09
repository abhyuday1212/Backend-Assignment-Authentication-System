import { Router } from "express";

import { verifyToken } from "../middlewares/auth.middleware.ts";
import { authorize } from "../middlewares/role.middleware.ts";
import { deleteUser } from "../controllers/admin.controller.ts";

const router = Router();

// allow admins to delete any user
// This route is only accessible to admins
router.delete("/user/:id", verifyToken, authorize(["admin"]), deleteUser);

export default router;
