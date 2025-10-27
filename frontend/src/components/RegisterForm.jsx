// frontend/src/components/RegisterForm.jsx
import React, { useState } from "react";
import { registerUser } from "../services/authApi";

export default function RegisterForm({ onClose, onRegistered }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please fill all required fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Invalid email address.");
      return;
    }

    setLoading(true);
    try {
      const resp = await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setSuccess("Registration successful!");
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
      if (onRegistered) onRegistered(resp.user);
      // Optionally auto-close after a short delay
      setTimeout(() => {
        if (onClose) onClose();
      }, 800);
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Create account</h2>

      {error && <div className="text-red-600 mb-3">{error}</div>}
      {success && <div className="text-green-600 mb-3">{success}</div>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          <div className="text-sm mb-1">Name</div>
          <input name="name" value={form.name} onChange={onChange} className="w-full border p-2 rounded" />
        </label>

        <label className="block mb-2">
          <div className="text-sm mb-1">Email</div>
          <input name="email" value={form.email} onChange={onChange} type="email" className="w-full border p-2 rounded" />
        </label>

        <label className="block mb-2">
          <div className="text-sm mb-1">Password</div>
          <input name="password" value={form.password} onChange={onChange} type="password" className="w-full border p-2 rounded" />
        </label>

        <label className="block mb-4">
          <div className="text-sm mb-1">Confirm Password</div>
          <input name="confirmPassword" value={form.confirmPassword} onChange={onChange} type="password" className="w-full border p-2 rounded" />
        </label>

        <div className="flex gap-2">
          <button disabled={loading} type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded">
            {loading ? "Signing up..." : "Sign up"}
          </button>
          <button type="button" onClick={onClose} className="px-4 rounded border">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
