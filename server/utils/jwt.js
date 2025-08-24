import jwt from "jsonwebtoken";

export const signToken = (payload, expiresIn = "7d") =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn:"7d" });

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET); // decoded payload return karega
  } catch (error) {
    return null; // agar token invalid/expired hai
  }
};
