import mongoose from "mongoose";
import logger from "../utils/logger.ts";

export const Connection = async () => {
  const URI = process.env.DB_URI;

  try {
    await mongoose.connect(URI!);
    logger.info("Connected to Main Database successfully");
  } catch (error) {
    logger.error("Error while connecting to the databases", error);
  }
};
