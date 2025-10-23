import express from "express";
import { geocode } from "../services/geocode.js";
import { getPlacesByRadius } from "../services/opentripmap.js";
import { cache } from "../services/cache.js";
import { haversine } from "../utils/distance.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const { q, lat, lon, radius = 2000, kinds, limit = 15 } = req.query;

    // Get coordinates either from query or geocode
    let center;
    if (lat && lon) {
      center = { lat: parseFloat(lat), lon: parseFloat(lon) };
    } else if (q) {
      center = await geocode(q);
    } else {
      return res.status(400).json({ error: "Missing location or coordinates" });
    }

    const cacheKey = `${center.lat.toFixed(3)}-${center.lon.toFixed(
      3
    )}-${radius}-${kinds}`;
    if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

    const pois = await getPlacesByRadius(center, radius, kinds, limit * 3);
    const enriched = pois.map((p) => {
      const dist = haversine(
        center.lat,
        center.lon,
        p.geometry.coordinates[1],
        p.geometry.coordinates[0]
      );
      return {
        xid: p.properties.xid,
        name: p.properties.name,
        kind: p.properties.kinds,
        distance: dist,
      };
    });

    const result = enriched
      .filter((p) => p.name)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    cache.set(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
