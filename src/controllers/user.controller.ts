import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiErrors.js";
import { User } from "../schema/user.schema.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { userValidation } from "../types/user.validation.js";
import logger from "../utils/logger.js";

export const getUserProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
      logger.warn("Unauthorized user tried to get a user profile");
      throw new ApiError(404, "User not found");
    }

    res.json(new ApiResponse(200, user, "User profile retrieved successfully"));
  }
);

export const updateUserProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { success, error } = userValidation.updateProfile.safeParse(req.body);

    if (!success) {
      throw new ApiError(400, "Validation Error", error.errors);
    }

    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { email: req.body.email } },
      {
        new: true,
        select: "-password -refreshToken",
        runValidators: true,
      }
    );

    if (!updatedUser) {
      logger.warn("Unauthorized user tried to update a user profile");
      throw new ApiError(404, "User not found");
    }

    res.json(
      new ApiResponse(200, updatedUser, "User profile updated successfully")
    );
  }
);

// logout user controller
export const logoutUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1, // this removes the field from document
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged Out"));
  }
);
