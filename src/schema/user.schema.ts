import mongoose, { Document } from "mongoose";

import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";

interface UserDocument extends Document {
  email: string;
  password: string;
  role: "user" | "admin";
  refreshToken?: string;
  generateAccessToken(): Promise<string>;
  generatRefreshToken(): Promise<string>;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  refreshToken: {
    type: String,
    requierd: false,
  },
});

// mogoose middleware for hashing password just before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// mongoose methods for comparing password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

// mongoose methods for generating access token
userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY!,
    } as SignOptions
  );
};

// mongoose methods for generating refresh token
userSchema.methods.generatRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY!,
    } as SignOptions
  );
};

const User = mongoose.model<UserDocument>("User", userSchema);

export { User };
