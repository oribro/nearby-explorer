import fetch from "node-fetch";
import { config } from "../config/index.js";

export async function geocode(query) {
  const url = `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(
    query
  )}&apikey=${config.openTripMapKey}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to geocode");
  const data = await res.json();

  if (!data.lat || !data.lon) throw new Error("No coordinates found");
  return { lat: data.lat, lon: data.lon, name: data.name };
}
