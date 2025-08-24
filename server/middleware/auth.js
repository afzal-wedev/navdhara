import { verifyToken } from "../utils/jwt.js";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = verifyToken(token); // decode the JWT
    req.user = decoded; // should contain { id, email }
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
};
