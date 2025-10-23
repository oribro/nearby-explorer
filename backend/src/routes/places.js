import express from "express";
import { geocodeText } from "../services/geocode.js";
import {
  searchWikipediaNearby,
  fetchWikiExtractsAndImages,
} from "../services/wikipedia.js";
import { cache } from "../services/cache.js";
import { haversine } from "../utils/distance.js";

const router = express.Router();

/**
 * GET /api/places/search
 * Query params:
 *  - q (optional) : location string (e.g., "Tel Aviv")
 *  - lat & lon (optional): numeric coordinates (if provided use these)
 *  - radius (optional, meters): default 5000
 *  - limit (optional): default 15
 */
router.get("/search", async (req, res) => {
  try {
    const { q, lat, lon } = req.query;
    const radius = parseInt(req.query.radius || "5000", 10);
    const limit = parseInt(req.query.limit || "15", 10);

    // Validate input
    let center;
    if (lat && lon) {
      center = { lat: parseFloat(lat), lon: parseFloat(lon) };
    } else if (q) {
      center = await geocodeText(q);
      if (!center) return res.status(404).json({ error: "Location not found" });
    } else {
      return res.status(400).json({ error: "Provide q or lat & lon" });
    }

    // Build cache key (rounded coords to improve hit rate)
    const cacheKey = `${center.lat.toFixed(4)}-${center.lon.toFixed(
      4
    )}-${radius}-${limit}`;
    if (cache.has(cacheKey)) {
      return res.json(cache.get(cacheKey));
    }

    // 1) Get list of nearby wiki pages (geosearch)
    const nearbyPages = await searchWikipediaNearby(
      center.lat,
      center.lon,
      radius,
      limit * 2
    );

    // 2) For each page, fetch extract + thumbnail in batches
    const pageIds = nearbyPages.map((p) => p.pageid);
    const details = await fetchWikiExtractsAndImages(pageIds);

    // 3) Merge & compute distance, sort & limit
    const enriched = nearbyPages
      .map((p) => {
        const detail = details[p.pageid] || {};
        const distance = haversine(center.lat, center.lon, p.lat, p.lon);
        return {
          pageid: p.pageid,
          title: p.title,
          lat: p.lat,
          lon: p.lon,
          distance, // meters
          extract: detail.extract || "",
          thumbnail: detail.thumbnail || null,
          wikipediaUrl:
            detail.wikipediaUrl ||
            `https://en.wikipedia.org/?curid=${p.pageid}`,
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    // Cache and return
    cache.set(cacheKey, enriched);
    res.json(enriched);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

export default router;
