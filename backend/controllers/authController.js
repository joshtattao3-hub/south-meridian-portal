const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { first_name, last_name, email, password, block_lot, contact } = req.body;

    if (!first_name || !last_name || !email || !password || !block_lot) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered." });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, block_lot, contact, role, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'resident', 'pending')
       RETURNING id, first_name, last_name, email, block_lot, contact, role, status`,
      [first_name, last_name, email, password_hash, block_lot, contact || null]
    );

    res.status(201).json({
      message: "Registration submitted. Pending approval.",
      user: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: "Invalid credentials." });

    if (user.status === "pending") {
      return res.status(403).json({ error: "Account pending approval by HOA officer." });
    }
    if (user.status === "inactive") {
      return res.status(403).json({ error: "Account is inactive. Contact HOA office." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials." });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      token,
      user: {
        id:         user.id,
        first_name: user.first_name,
        last_name:  user.last_name,
        email:      user.email,
        role:       user.role,
        block_lot:  user.block_lot,
        status:     user.status,
        avatar_url: user.avatar_url,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
async function getMe(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT id, first_name, last_name, email, role, block_lot, contact, status, avatar_url FROM users WHERE id = $1",
      [req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "User not found." });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getMe };