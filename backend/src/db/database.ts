import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.DATABASE as string)
  .then(() => console.log("database Connected"))
  .catch((err) => console.log("Database connection failed", err));

export const database = mongoose;
