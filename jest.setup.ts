import mongoose from "mongoose";
import { Connection } from "./src/config/db.ts";

// Global setup - runs once before all test files
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = "test";

  // Connect to MongoDB if not already connected
  if (mongoose.connection.readyState === 0) {
    await Connection();
    console.log("MongoDB connected from setup file");
  }
});

