import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (q.trim()) onSearch({ q });
  }

  return (
    <form onSubmit={handleSubmit} className="flex-grow flex">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Enter a location..."
        className="border p-2 flex-grow rounded-l"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
}
