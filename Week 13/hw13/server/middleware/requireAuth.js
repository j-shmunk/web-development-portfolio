import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

export default async function requireAuth(req, res, next) {
  const token = req.cookies.userSession;
  if (!token) {
    return res.status(401).json({ message: "Please log in to access the colorway catalog." });
  }

  try {
    const claims = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "merc-vapor-colorways",
      audience: "merc-vapor-colorways",
    });
    if (typeof claims.sub !== "string" || !mongoose.isValidObjectId(claims.sub)) {
      return res.status(401).json({ message: "Your session is invalid. Please log in again." });
    }
    const user = await User.findById(claims.sub).select("_id name email");
    if (!user) {
      return res.status(401).json({ message: "Your account is unavailable. Please log in again." });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Your session has expired. Please log in again." });
    }
    next(error);
  }
}
