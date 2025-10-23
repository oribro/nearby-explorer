import React from "react";

export default function POICard({ poi }) {
  return (
    <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <h3 className="font-semibold text-lg">{poi.name}</h3>
      <p className="text-sm text-gray-600 capitalize">{poi.kind?.split(",")[0] || "Unknown"}</p>
      <p className="text-sm text-gray-500">{(poi.distance / 1000).toFixed(2)} km away</p>
    </div>
  );
}
