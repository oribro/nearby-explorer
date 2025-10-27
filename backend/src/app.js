import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import placesRouter from "./routes/places.js"; // if you already have places

dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRouter);
app.use("/api/places", placesRouter); // keep your existing places router

// connect to mongo and start
async function start() {
  try {
    await mongoose.connect(MONGO_URI, { autoIndex: true });
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`✅ Backend running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Failed to start:", err);
    process.exit(1);
  }
}

start();
