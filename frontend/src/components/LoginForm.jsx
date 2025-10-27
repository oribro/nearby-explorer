import React, { useState } from "react";
import { loginUser } from "../services/authApi";

export default function LoginForm({ onClose, onLoggedIn }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const resp = await loginUser(form);
      if (onLoggedIn) onLoggedIn(resp);
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Log in</h2>
      {error && <div className="text-red-600 mb-3">{error}</div>}

      <label className="block mb-2">
        <div className="text-sm mb-1">Email</div>
        <input name="email" value={form.email} onChange={onChange} type="email" className="w-full border p-2 rounded" />
      </label>

      <label className="block mb-4">
        <div className="text-sm mb-1">Password</div>
        <input name="password" value={form.password} onChange={onChange} type="password" className="w-full border p-2 rounded" />
      </label>

      <div className="flex gap-2">
        <button disabled={loading} type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded">
          {loading ? "Logging in..." : "Log in"}
        </button>
        <button type="button" onClick={onClose} className="px-4 rounded border">
          Cancel
        </button>
      </div>
    </form>
  );
}
