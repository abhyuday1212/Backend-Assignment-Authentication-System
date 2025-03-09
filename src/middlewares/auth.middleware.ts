import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { ApiError } from "../utils/apiErrors.ts";
import { User } from "../schema/user.schema.ts";

export interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.accessToken || req.header["authorization"]?.split(" ")[1];

  if (!token) {
    return next(new ApiError(401, "Unauthorized request"));
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as { _id: string };

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid token");
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid access token"));
  }
};
