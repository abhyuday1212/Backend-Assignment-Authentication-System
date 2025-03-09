import { Response, NextFunction } from "express";

import { ApiError } from "../utils/apiErrors.js";
import { AuthRequest } from "./auth.middleware.js";

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "User does not have the required permissions")
      );
    }
    next();
  };
};
