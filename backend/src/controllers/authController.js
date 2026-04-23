const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/connection");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/jwt");

const SAFE_USER_FIELDS =
  "user_id, username, email, full_name, phone, city, country, role, is_active, created_at";

const register = async (req, res) => {
  try {
    const { username, email, password, full_name, phone, address, city, postal_code, country } =
      req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if username or email already exists
    const [existing] = await db.execute(
      "SELECT user_id FROM users WHERE email = ? OR username = ? LIMIT 1",
      [email, username]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Username or email already in use" });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const [result] = await db.execute(
      `INSERT INTO users (username, email, password_hash, full_name, phone, address, city, postal_code, country, role, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'buyer', 1)`,
      [
        username,
        email,
        password_hash,
        full_name || null,
        phone || null,
        address || null,
        city || null,
        postal_code || null,
        country || null,
      ]
    );

    const userId = result.insertId;

    // Log the registration
    try {
      await db.execute(
        `INSERT INTO audit_log (user_id, action, table_name, record_id, new_values)
         VALUES (?, 'register', 'users', ?, ?)`,
        [userId, userId, JSON.stringify({ username, email, role: "buyer" })]
      );
    } catch (_) {
      // audit_log is optional – don't fail the request
    }

    const token = jwt.sign(
      { user_id: userId, username, email, role: "buyer" },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const [rows] = await db.execute(
      `SELECT ${SAFE_USER_FIELDS} FROM users WHERE user_id = ?`,
      [userId]
    );

    return res.status(201).json({ token, user: rows[0] });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const [rows] = await db.execute(
      `SELECT user_id, username, email, password_hash, role, is_active FROM users WHERE email = ? LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const dbUser = rows[0];

    if (!dbUser.is_active) {
      return res.status(403).json({ message: "Account is disabled" });
    }

    const passwordMatch = await bcrypt.compare(password, dbUser.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Log the login
    try {
      await db.execute(
        `INSERT INTO audit_log (user_id, action, table_name, record_id, new_values)
         VALUES (?, 'login', 'users', ?, ?)`,
        [dbUser.user_id, dbUser.user_id, JSON.stringify({ email })]
      );
    } catch (_) {
      // audit_log is optional
    }

    const token = jwt.sign(
      {
        user_id: dbUser.user_id,
        username: dbUser.username,
        email: dbUser.email,
        role: dbUser.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const [userRows] = await db.execute(
      `SELECT ${SAFE_USER_FIELDS} FROM users WHERE user_id = ?`,
      [dbUser.user_id]
    );

    return res.json({ token, user: userRows[0] });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const me = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT ${SAFE_USER_FIELDS} FROM users WHERE user_id = ? AND is_active = 1`,
      [req.user.user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user: rows[0] });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

module.exports = { register, login, me };
