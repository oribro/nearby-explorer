import jwt from "jsonwebtoken";

export function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "Authorization header missing" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  try {
    const secret = process.env.JWT_SECRET || "devsecret";
    const payload = jwt.verify(token, secret);
    req.user = payload; // attach decoded user to request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
