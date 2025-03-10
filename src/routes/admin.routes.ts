import { Router } from "express";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { deleteUser } from "../controllers/admin.controller.js";

const router = Router();

// allow admins to delete any user
// This route is only accessible to admins
router.delete("/delete/:id", verifyToken, authorize(["admin"]), deleteUser);

export default router;
