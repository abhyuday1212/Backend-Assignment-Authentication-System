import { Request, Response, NextFunction } from "express";

import { ApiError } from "../utils/apiErrors.ts";

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Only log errors in non-test environments
  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  res.status(err.statusCode || 500).json({
    success: err.success,
    message: err.message,
    errors: err.errors,
  });
};
