import { Express } from "express";

import authRouter from "./routes/auth.routes.ts";
import userRouter from "./routes/user.routes.ts";
import adminRouter from "./routes/admin.routes.ts";

export const setupRoutes = (app: Express) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/admin", adminRouter);

  // 404 handler for undefined routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
    });
  });
};
