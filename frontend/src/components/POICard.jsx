import React from "react";

export default function POICard({ poi }) {
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
        <a href={poi.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
          View on Wikipedia
        </a>
      </div>
    </div>
  );
}
