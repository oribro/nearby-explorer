// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import UseLocationButton from "./components/UseLocationButton";
import POIList from "./components/POIList";
import Spinner from "./components/Spinner";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import { searchPlacesByText, searchPlacesByCoords } from "./services/api";

export default function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  // check for JWT in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  async function handleSearch({ q, lat, lon }) {
    try {
      setLoading(true);
      setError("");

      let data;
      if (lat && lon) {
        data = await searchPlacesByCoords(lat, lon);
      } else if (q) {
        data = await searchPlacesByText(q);
      } else {
        throw new Error("No search input provided");
      }

      setResults(data);
    } catch (err) {
       if (err.message.includes("401")) {
        setError("You must be logged in to search");
      } else {
        setError("Failed to fetch results");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
  }

  function handleLoginSuccess({ token, user }) {
    localStorage.setItem("jwt", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setShowLogin(false);
  }

  function handleRegisterSuccess({ user }) {
    // optional: auto-login after register or just show message
    setUser(user);
    setShowRegister(false);
    // optionally request backend for token if you want auto-login
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 flex justify-center items-start">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur rounded-2xl shadow-xl p-6 mt-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Nearby Explorer</h1>
          <div className="flex gap-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowRegister(true)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Sign up
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </div>

        {/* Only show search if logged in */}
        {user && (
          <>
            <div className="flex gap-2 mb-4">
              <SearchBar onSearch={handleSearch} />
              <UseLocationButton onUseLocation={handleSearch} />
            </div>

            {loading && <Spinner />}
            {error && <p className="text-red-500">{error}</p>}
            <POIList results={results} />
          </>
        )}

        {/* Register/Login modals */}
        {showRegister && (
          <RegisterForm
            onClose={() => setShowRegister(false)}
            onRegistered={handleRegisterSuccess}
          />
        )}
        {showLogin && (
          <LoginForm
            onClose={() => setShowLogin(false)}
            onLoggedIn={handleLoginSuccess}
          />
        )}
      </div>
    </main>
  );
}
