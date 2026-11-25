import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

export default async function requireAdmin(req, res, next) {
  const token = req.cookies.adminSession;
  if (!token) {
    return res.status(401).json({ message: "Please sign in as an administrator." });
  }

  try {
    const claims = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "native-plant-admin",
      audience: "native-plant-admin",
    });
    if (typeof claims.sub !== "string" || !mongoose.isValidObjectId(claims.sub)) {
      return res.status(401).json({ message: "Your session is invalid. Please sign in again." });
    }

    const user = await User.findOne({ _id: claims.sub, role: "admin" }).select("_id name email role");
    if (!user) {
      return res.status(401).json({ message: "Your administrator account is unavailable." });
    }
    req.admin = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Your session has expired. Please sign in again." });
    }
    next(error);
  }
}
