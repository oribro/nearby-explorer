import React from "react";

export default function UseLocationButton({ onUseLocation }) {
  async function handleClick() {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        onUseLocation({ lat: latitude, lon: longitude });
      },
      (err) => {
        alert("Location permission denied or error: " + err.message);
      }
    );
  }

  return (
    <button
      onClick={handleClick}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      📍 Use My Location
    </button>
  );
}
