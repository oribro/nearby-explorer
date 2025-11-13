import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import placesRouter from "./routes/places.js";
import favouritesRouter from "./routes/favourites.js";
import historyRouter from "./routes/history.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-url.netlify.app', 'https://your-frontend-url.vercel.app']
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// routes
app.use("/api/auth", authRouter);
app.use("/api/places", placesRouter);
app.use("/api/favourites", favouritesRouter);
app.use("/api/history", historyRouter);

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
