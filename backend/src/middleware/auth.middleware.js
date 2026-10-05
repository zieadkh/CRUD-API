import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyAccessToken = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization Bearer token required" });
    }
    const token = header.split(" ")[1];
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid or expired access token" });
    }
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
