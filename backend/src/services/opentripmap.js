import fetch from "node-fetch";
import { config } from "../config/index.js";

export async function getPlacesByRadius(center, radius, kinds, limit = 50) {
  const url = new URL("https://api.opentripmap.com/0.1/en/places/radius");
  url.search = new URLSearchParams({
    apikey: config.openTripMapKey,
    radius,
    lon: center.lon,
    lat: center.lat,
    kinds: kinds || "interesting_places",
    limit,
  });

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch POIs");
  const data = await res.json();
  return data.features || [];
}
