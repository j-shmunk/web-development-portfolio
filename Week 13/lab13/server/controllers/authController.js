import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const sessionDurationMs = 60 * 60 * 1000;
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
};

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export async function login(req, res, next) {
  if (!isRecord(req.body)) {
    return res.status(400).json({ message: "Provide an email and password." });
  }
  const { email, password } = req.body;
  if (
    typeof email !== "string" ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof password !== "string" ||
    password.length < 1 ||
    password.length > 128
  ) {
    return res.status(400).json({ message: "Provide a valid email and password." });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    const matches = user && await bcrypt.compare(password, user.password);
    if (!matches || user.role !== "admin") {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
      {
        subject: user._id.toString(),
        expiresIn: "1h",
        issuer: "native-plant-admin",
        audience: "native-plant-admin",
        algorithm: "HS256",
      },
    );
    res.cookie("adminSession", token, { ...cookieOptions, maxAge: sessionDurationMs });
    res.json({
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
}

export function session(req, res) {
  res.json({
    user: { name: req.admin.name, email: req.admin.email },
  });
}

export function logout(req, res) {
  res.clearCookie("adminSession", cookieOptions);
  res.json({ message: "Signed out." });
}
