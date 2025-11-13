import mongoose from "mongoose";
import dotenv from "dotenv";
import History from "../models/History.js";

dotenv.config();

async function clearHistory() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    
    await History.deleteMany({});
    console.log("✅ All history entries cleared");
    
    process.exit(0);
  } catch (error) {
    console.error("Error clearing history:", error);
    process.exit(1);
  }
}

clearHistory();