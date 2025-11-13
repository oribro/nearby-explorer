import express from "express";
import History from "../models/History.js";
import { authenticateJWT } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authenticateJWT, async (req, res) => {
  try {
    const history = await History.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", authenticateJWT, async (req, res) => {
  try {
    const { searchQuery, searchType, resultsCount } = req.body;
    const history = new History({
      userId: req.user.id,
      searchQuery,
      searchType,
      resultsCount
    });
    await history.save();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
