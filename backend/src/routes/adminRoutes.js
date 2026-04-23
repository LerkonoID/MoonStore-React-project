const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { listUsers, updateUserRole, updateUserStatus } = require("../controllers/adminController");
const { authenticate, requireRole } = require("../middleware/auth");

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});

router.use(adminLimiter);
router.use(authenticate);

router.get("/users", requireRole("admin", "operator"), listUsers);
router.put("/users/:id/role", requireRole("admin"), updateUserRole);
router.put("/users/:id/status", requireRole("admin"), updateUserStatus);

module.exports = router;
