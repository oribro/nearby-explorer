import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Favourite from "../models/Favourite.js";
import History from "../models/History.js";

dotenv.config();

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Get first user (assuming you have at least one user)
    const user = await User.findOne();
    if (!user) {
      console.log("No users found. Please create a user first.");
      return;
    }

    // Insert dummy favourites
    await Favourite.deleteMany({ userId: user._id });
    const favourites = [
      {
        userId: user._id,
        placeName: "Central Park",
        placeType: "park",
        latitude: 40.7829,
        longitude: -73.9654,
      },
      {
        userId: user._id,
        placeName: "Starbucks Coffee",
        placeType: "cafe",
        latitude: 40.7580,
        longitude: -73.9855,
      },
      {
        userId: user._id,
        placeName: "Times Square",
        placeType: "attraction",
        latitude: 40.7580,
        longitude: -73.9855,
      },
    ];
    await Favourite.insertMany(favourites);

    // Insert dummy history
    await History.deleteMany({ userId: user._id });
    const history = [
      {
        userId: user._id,
        searchQuery: "restaurants near me",
        searchType: "text",
        resultsCount: 15,
      },
      {
        userId: user._id,
        searchQuery: "Location search",
        searchType: "location",
        resultsCount: 8,
      },
      {
        userId: user._id,
        searchQuery: "coffee shops",
        searchType: "text",
        resultsCount: 12,
      },
    ];
    await History.insertMany(history);

    console.log("✅ Dummy data inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();