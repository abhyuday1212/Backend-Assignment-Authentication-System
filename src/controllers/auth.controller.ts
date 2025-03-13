import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { User } from "../schema/user.schema.js";
import { authValidation } from "../types/auth.validation.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";
import transporter from "../config/nodemailer.js";
import { resetTokens } from "../cache/user.cache.js";
import dotnev from "dotenv";
dotnev.config();

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generatRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

// Register User controller
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { success, error } = authValidation.register.safeParse(req.body);

    if (!success) {
      throw new ApiError(400, "Validation Error", error.errors);
    }

    const { email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    const user = await User.create({
      email,
      password,
      role,
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      logger.error("Something went wrong while registering the user");
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    logger.info("New User registered successfully");

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered Successfully"));
  }
);

// Login User controller
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { success, error } = authValidation.login.safeParse(req.body);

  if (!success) {
    throw new ApiError(400, "Validation Error", error.errors);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const accessOptions = {
    httpOnly: true,
    secure: true,
    maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRY!) || 10 * 60 * 1000,
  };

  const refreshOptions = {
    httpOnly: true,
    secure: true,
    maxAge:
      parseInt(process.env.ACCESS_TOKEN_EXPIRY!) || 7 * 24 * 60 * 60 * 1000,
  };

  logger.info("User login successfully");

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessOptions)
    .cookie("refreshToken", refreshToken, refreshOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
        },
        "User logged In Successfully"
      )
    );
});

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      logger.warn("Unauthorized user tried to reset password");
      throw new ApiError(404, "User not found");
    }

    const token = jwt.sign(user.email, process.env.RESET_JWT_SECRET!);

    const resetLink = `${
      process.env.FRONTEND_URL || "http://localhost:8000"
    }/reset/${token}`;

    logger.info(`Password reset link Generated: ${resetLink}`); //testing

    // Store the token in local cache
    resetTokens.set(token, {
      email,
      token,
      resetLink,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 1 hour from now in milliseconds(3600000)
    });

    // Automatically delete the token after it expires, to prevent memoryLeak
    setTimeout(() => {
      resetTokens.delete(token);
    }, 3600000);

    // Compose email message
    // used the resouce: https://www.nodemailer.com/
    const mailOptions = {
      to: user.email,
      from: process.env.SENDER_EMAIL!,
      subject: "Password Reset Request",
      text: `If you requested a password reset, Please click on the following link, or paste it into your browser to complete the process:\n\n
        Reset URL: ${resetLink}\n\n
        If you are using the postman, you can use the following token to reset the password, copy the token and paste it in the params:\n\n
        Token: ${token}\n\n`,
    };

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger.error("Error sending password reset email", error);
          reject(error);
        } else {
          logger.info(`Password reset email sent to ${email}`);
          resolve(info);
        }
      });
    });

    // If everything was successful
    res
      .status(200)
      .json(
        new ApiResponse(200, null, "Password reset email sent successfully")
      );
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      throw new ApiError(400, "New password is required");
    }

    try {
      jwt.verify(token, process.env.RESET_JWT_SECRET!);
    } catch (error) {
      logger.error("Invalid JWT token for password reset", error);
      throw new ApiError(401, "Invalid or expired token");
    }

    const storedToken = resetTokens.get(token);
    if (!storedToken) {
      throw new ApiError(401, "Invalid or expired token");
    }

    if (Date.now() > storedToken.expiresAt) {
      resetTokens.delete(token);
      throw new ApiError(400, "Token expired");
    }

    const user = await User.findOne({ email: storedToken.email });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.password = newPassword;
    await user.save();

    resetTokens.delete(token);

    logger.info(`Password reset successful for user ${user.email}`);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Password reset successfully, use the new password to login"
        )
      );
  }
);

export const generateNewAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required");
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { _id: string };

    // Find user with this refresh token
    const user = await User.findOne({
      _id: decoded._id,
    });

    if (!user) {
      logger.warn("Unauthorized user tried to generate new token");
      throw new ApiError(401, "Invalid refresh token");
    }

    // Generate new access token
    const accessToken = await user.generateAccessToken();

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(new ApiResponse(200, null, "Token generated"));
  }
);
