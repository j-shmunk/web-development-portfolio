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

function validEmail(value) {
  return typeof value === "string" &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function issueSession(user, res) {
  const token = jwt.sign(
    {},
    process.env.JWT_SECRET,
    {
      subject: user._id.toString(),
      expiresIn: "1h",
      issuer: "merc-vapor-colorways",
      audience: "merc-vapor-colorways",
      algorithm: "HS256",
    },
  );
  res.cookie("userSession", token, { ...cookieOptions, maxAge: sessionDurationMs });
}

function userResponse(user) {
  return { id: user._id, name: user.name, email: user.email };
}

export async function register(req, res, next) {
  if (!isRecord(req.body)) {
    return res.status(400).json({ message: "Provide a name, valid email, and password." });
  }
  const { name, email, password } = req.body;
  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 80 ||
    !validEmail(email) ||
    typeof password !== "string" ||
    password.length < 12 ||
    password.length > 72 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return res.status(400).json({
      message: "Use a 2–80 character name, valid email, and password of 12–72 characters (maximum 72 UTF-8 bytes).",
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const exists = await User.exists({ email: normalizedEmail });
    if (exists) return res.status(409).json({ message: "An account with that email already exists." });

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
    });
    issueSession(user, res);
    res.status(201).json({ user: userResponse(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "An account with that email already exists." });
    }
    next(error);
  }
}

export async function login(req, res, next) {
  if (!isRecord(req.body)) {
    return res.status(400).json({ message: "Provide a valid email and password." });
  }
  const { email, password } = req.body;
  if (
    !validEmail(email) ||
    typeof password !== "string" ||
    password.length < 1 ||
    password.length > 72 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return res.status(400).json({ message: "Provide a valid email and password." });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    const matches = user && await bcrypt.compare(password, user.password);
    if (!matches) return res.status(401).json({ message: "Invalid email or password." });
    issueSession(user, res);
    res.json({ user: userResponse(user) });
  } catch (error) {
    next(error);
  }
}

export function session(req, res) {
  res.json({ user: userResponse(req.user) });
}

export function logout(req, res) {
  res.clearCookie("userSession", cookieOptions);
  res.json({ message: "Logged out." });
}
