import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import colorwayRoutes from "./routes/colorways.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5002;

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/colorways", colorwayRoutes);
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});
app.use((error, req, res, next) => {
  console.error(error);
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ message: "Request body must be valid JSON." });
  }
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ message: error.message });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: "That email or style code is already in use." });
  }
  res.status(500).json({ message: "Internal server error." });
});

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is required. Copy .env.example to .env and configure it.");
  process.exitCode = 1;
} else if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET is required and must contain at least 32 characters.");
  process.exitCode = 1;
} else {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Mercurial Vapor API is running on port ${port}`);
    });
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    process.exitCode = 1;
  }
}
