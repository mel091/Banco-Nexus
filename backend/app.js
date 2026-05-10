import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";

dotenv.config();

const startServer = async () => {
  await connectDB();

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
};

startServer();
