import express from "express";
import rateLimit from "express-rate-limit";
import { login, logout, register, session } from "../controllers/authController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many account requests. Try again in 15 minutes." },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/session", requireAuth, session);
router.post("/logout", logout);

export default router;
