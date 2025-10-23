import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import UseLocationButton from "./components/UseLocationButton";
import POIList from "./components/POIList";
import Spinner from "./components/Spinner";
import { searchPlacesByText, searchPlacesByCoords } from "./services/api";

export default function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch({ q, lat, lon }) {
  try {
    setLoading(true);
    setError("");

    let data;
    if (lat && lon) {
      // user clicked "Use My Location"
      data = await searchPlacesByCoords(lat, lon);
    } else if (q) {
      // user typed text manually
      data = await searchPlacesByText(q);
    } else {
      throw new Error("No search input provided");
    }

    setResults(data);
  } catch (err) {
    setError("Failed to fetch results");
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Nearby Explorer</h1>

      <div className="flex gap-2 mb-4">
        <SearchBar onSearch={handleSearch} />
        <UseLocationButton onUseLocation={handleSearch} />
      </div>

      {loading && <Spinner />}
      {error && <p className="text-red-500">{error}</p>}

      <POIList results={results} />
    </main>
  );
}
