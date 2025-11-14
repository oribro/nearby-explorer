import React, { useState } from "react";
import Toast from "./Toast";

export default function UseLocationButton({ onUseLocation }) {
  const [toast, setToast] = useState(null);

  async function handleClick() {
    if (!navigator.geolocation) {
      setToast({ message: "Geolocation not supported", type: "error" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        onUseLocation({ lat: latitude, lon: longitude });
      },
      (err) => {
        setToast({ message: `Location permission denied: ${err.message}`, type: "error" });
      }
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        📍 Use My Location
      </button>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
