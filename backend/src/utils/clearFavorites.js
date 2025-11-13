import mongoose from "mongoose";
import dotenv from "dotenv";
import Favourite from "../models/Favourite.js";

dotenv.config();

async function clearFavorites() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    
    await Favourite.deleteMany({});
    console.log("✅ All favorites cleared");
    
    process.exit(0);
  } catch (error) {
    console.error("Error clearing favorites:", error);
    process.exit(1);
  }
}

clearFavorites();