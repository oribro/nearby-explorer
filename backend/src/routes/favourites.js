import express from "express";
import Favourite from "../models/Favourite.js";
import { authenticateJWT } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authenticateJWT, async (req, res) => {
  try {
    const favourites = await Favourite.find({ userId: req.user.id });
    res.json(favourites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", authenticateJWT, async (req, res) => {
  try {
    const { placeName, placeType, latitude, longitude } = req.body;
    const favourite = new Favourite({
      userId: req.user.id,
      placeName,
      placeType,
      latitude,
      longitude
    });
    await favourite.save();
    res.json(favourite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    await Favourite.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Favourite removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
