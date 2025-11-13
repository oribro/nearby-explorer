import React, { useState, useEffect } from "react";

export default function History({ onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const token = localStorage.getItem("jwt");
        const baseUrl = process.env.NODE_ENV === 'production' 
          ? 'https://your-backend-url.onrender.com'
          : 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log('History response:', data);
        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error);
        console.error('Response status:', error.status);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="mr-3 text-blue-600">← Back</button>
        <h2 className="text-2xl font-bold">Search History</h2>
      </div>
      
      {history.length === 0 ? (
        <p className="text-gray-500">No search history yet</p>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item._id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{item.searchQuery}</h3>
              <p className="text-sm text-gray-600">
                Type: {item.searchType} • Results: {item.resultsCount}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}