import React, { useState, useEffect } from "react";
import { deleteFavorite } from "../services/api";
import Toast from "./Toast";

export default function Favourites({ onBack }) {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  async function handleUnfavorite(favoriteId) {
    try {
      await deleteFavorite(favoriteId);
      setFavourites(favourites.filter(fav => fav._id !== favoriteId));
      setToast({ message: "Removed from favorites!", type: "success" });
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      setToast({ message: "Failed to remove favorite", type: "error" });
    }
  }

  useEffect(() => {
    async function fetchFavourites() {
      try {
        const token = localStorage.getItem("jwt");
        const baseUrl = process.env.NODE_ENV === 'production' 
          ? 'https://nearby-explorer.onrender.com'
          : 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/favourites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setFavourites(data);
      } catch (error) {
        console.error("Error fetching favourites:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFavourites();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="mr-3 text-blue-600">← Back</button>
        <h2 className="text-2xl font-bold">My Favourites</h2>
      </div>
      
      {favourites.length === 0 ? (
        <p className="text-gray-500">No favourites yet</p>
      ) : (
        <div className="space-y-3">
          {favourites.map((fav) => (
            <div key={fav._id} className="border rounded-lg p-4 flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{fav.placeName}</h3>
                <p className="text-sm text-gray-600 capitalize">{fav.placeType}</p>
                <p className="text-xs text-gray-500">
                  {fav.latitude.toFixed(4)}, {fav.longitude.toFixed(4)}
                </p>
              </div>
              <button
                onClick={() => handleUnfavorite(fav._id)}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
              >
                💔 Remove
              </button>
            </div>
          ))}
        </div>
      )}
      {toast && (
        <div className="fixed bottom-20 right-4 z-[9999]">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
}