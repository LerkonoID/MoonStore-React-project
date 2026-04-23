const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { register, login, me } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", authenticate, me);

module.exports = router;
