import express from "express";
import cors from "cors";
import placesRouter from "./routes/places.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/places", placesRouter);

export default app;
