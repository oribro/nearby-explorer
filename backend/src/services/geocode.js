import fetch from "node-fetch";

/**
 * Geocode free-text location using Nominatim (OpenStreetMap)
 * Returns { lat, lon, display_name } or null
 */
export async function geocodeText(q) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.search = new URLSearchParams({
    q,
    format: "json",
    limit: 1,
  });

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "Nearby-Explorer/1.0 (+https://example.local)" },
  });
  if (!res.ok) throw new Error("Failed to geocode via Nominatim");
  const data = await res.json();
  if (!data || !data.length) return null;
  const top = data[0];
  return {
    lat: parseFloat(top.lat),
    lon: parseFloat(top.lon),
    display_name: top.display_name,
  };
}
