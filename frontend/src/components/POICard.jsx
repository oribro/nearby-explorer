import React, { useState } from "react";
import { saveFavorite } from "../services/api";
import Toast from "./Toast";

export default function POICard({ poi }) {
  const [toast, setToast] = useState(null);

  async function handleFavorite() {
    try {
      await saveFavorite(
        poi.title,
        poi.extract || "attraction",
        poi.point?.lat || poi.lat,
        poi.point?.lon || poi.lon
      );
      setToast({ message: "Added to favorites!", type: "success" });
    } catch (error) {
      console.error("Failed to add favorite:", error);
      setToast({ message: "Failed to add to favorites", type: "error" });
    }
  }
  return (
    <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition flex gap-4">
      {poi.thumbnail && (
        <img
          src={poi.thumbnail}
          alt={poi.title}
          className="w-20 h-20 object-cover rounded"
        />
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{poi.title}</h3>
        <p className="text-sm text-gray-600 mb-1">{poi.extract || 'No description available'}</p>
        <p className="text-sm text-gray-500">{(poi.distance / 1000).toFixed(2)} km away</p>
        <div className="flex gap-2 items-center">
          <a href={poi.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
            View on Wikipedia
          </a>
          <button
            onClick={handleFavorite}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
          >
            ❤️ Favorite
          </button>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
