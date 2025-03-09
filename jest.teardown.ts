import mongoose from "mongoose";

export default async function () {
  // Close the MongoDB connection
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log("MongoDB connection closed from teardown file");
  }
}
