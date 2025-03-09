import { Request, Response } from "express";
import mongoose from "mongoose";

import { User } from "../schema/user.schema.ts";
import { ApiError } from "../utils/apiErrors.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import logger from "../utils/logger.ts";

// delete a user, admin only action
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    logger.warn(`Invalid user ID format: ${id}`);
    throw new ApiError(400, "Invalid user ID format");
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    logger.warn("Unauthorized user tried to delete a user");
    throw new ApiError(400, "User not found");
  }

  logger.info(`User ${id} deleted successfully by admin`);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully by the admin"));
});
