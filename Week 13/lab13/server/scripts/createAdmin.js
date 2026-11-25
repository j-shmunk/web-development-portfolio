import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
const name = process.env.ADMIN_NAME || "Administrator";

if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD || !process.env.JWT_SECRET) {
  console.error("Set MONGO_URI, JWT_SECRET, ADMIN_EMAIL, and ADMIN_PASSWORD in the server .env file.");
  process.exitCode = 1;
} else if (
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ADMIN_EMAIL.trim()) ||
  ADMIN_EMAIL.length > 254 ||
  ADMIN_PASSWORD.length < 12 ||
  ADMIN_PASSWORD.length > 128 ||
  !name.trim() ||
  name.length > 100
) {
  console.error("Use a valid email, a 12–128 character password, and an administrator name of 1–100 characters.");
  process.exitCode = 1;
} else {
  try {
    await mongoose.connect(MONGO_URI);
    const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const user = await User.findOneAndUpdate(
      { email: ADMIN_EMAIL.trim().toLowerCase() },
      { name: name.trim(), email: ADMIN_EMAIL.trim().toLowerCase(), password, role: "admin" },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    console.log(`Administrator account ready for ${user.email}.`);
  } catch (error) {
    console.error("Could not provision administrator:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
