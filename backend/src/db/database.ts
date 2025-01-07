import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(`mongodb://mongodb:27017/toursewa`)
  .then(() => console.log("database Connected"))
  .catch((err) => console.log("Database connection failed", err));

export const database = mongoose;
