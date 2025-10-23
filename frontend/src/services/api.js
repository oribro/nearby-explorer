export async function searchPlaces({ q, lat, lon, radius = 2000, limit = 15 }) {
  const params = new URLSearchParams({ q, lat, lon, radius, limit });
  const res = await fetch(`http://localhost:5000/api/places/search?${params}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
