import express from "express";
import rateLimit from "express-rate-limit";
import { login, logout, session } from "../controllers/authController.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many sign-in attempts. Try again in 15 minutes." },
});

router.post("/login", loginLimiter, login);
router.get("/session", requireAdmin, session);
router.post("/logout", logout);

export default router;
