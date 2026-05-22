import mongoose from "mongoose";

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI no está configurada");
  }

  const maxAttempts = 10;
  const retryDelayMs = 3000;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        retryReads: true,
        retryWrites: true,
      });

      console.log("MongoDB connected");
      return;
    } catch (error) {
      console.error(
        `MongoDB connection error (intento ${attempt}/${maxAttempts}):`,
        error.message
      );

      if (attempt === maxAttempts) {
        process.exit(1);
      }

      await wait(retryDelayMs);
    }
  }
};

export default connectDB;