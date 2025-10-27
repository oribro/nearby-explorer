const BASE_URL = "http://localhost:5000/api/places";

// frontend/src/services/api.js

function getAuthHeaders() {
  const token = localStorage.getItem("jwt");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function searchPlacesByText(q) {
  const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(q)}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Search failed");
  return data;
}

export async function searchPlacesByCoords(lat, lon) {
  const res = await fetch(`${BASE_URL}/search?lat=${lat}&lon=${lon}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Search failed");
  return data;
}
