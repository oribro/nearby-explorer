const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nearby-explorer.onrender.com/api/places"
    : "http://localhost:5000/api/places";

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

export async function saveSearchHistory(searchQuery, searchType, resultsCount) {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://nearby-explorer.onrender.com"
      : "http://localhost:5000";
  const res = await fetch(`${baseUrl}/api/history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ searchQuery, searchType, resultsCount }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("History save error:", res.status, errorText);
    throw new Error(`Failed to save history: ${res.status} ${errorText}`);
  }
  return res.json();
}

export async function saveFavorite(placeName, placeType, latitude, longitude) {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://nearby-explorer.onrender.com"
      : "http://localhost:5000";
  const res = await fetch(`${baseUrl}/api/favourites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ placeName, placeType, latitude, longitude }),
  });
  if (!res.ok) throw new Error("Failed to save favorite");
  return res.json();
}

export async function deleteFavorite(favoriteId) {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://nearby-explorer.onrender.com"
      : "http://localhost:5000";
  const res = await fetch(`${baseUrl}/api/favourites/${favoriteId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Failed to delete favorite");
  return res.json();
}
