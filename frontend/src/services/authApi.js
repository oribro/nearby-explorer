const BASE =
  process.env.NODE_ENV === "production"
    ? "https://nearby-explorer.onrender.com/api/auth"
    : "http://localhost:5000/api/auth";

export async function registerUser({ name, email, password }) {
  const res = await fetch(`${BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Registration failed");
  return json;
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Login failed");
  return json;
}
