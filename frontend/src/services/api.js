const BASE_URL = "http://localhost:5000/api/places";

export async function searchPlacesByText(query) {
  const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to fetch places");
  return res.json();
}

export async function searchPlacesByCoords(lat, lon) {
  const res = await fetch(`${BASE_URL}/search?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error("Failed to fetch places");
  return res.json();
}
