const pool = require("../db");
const bcrypt = require("bcryptjs");

// GET /api/users
async function getAllUsers(req, res, next) {
  try {
    const { role, status, search } = req.query;
    let query = `SELECT id, first_name, last_name, email, block_lot, contact, role, status, avatar_url, created_at
                 FROM users WHERE 1=1`;
    const params = [];

    if (role)   { params.push(role);         query += ` AND role = $${params.length}`; }
    if (status) { params.push(status);       query += ` AND status = $${params.length}`; }
    if (search) { params.push(`%${search}%`); query += ` AND (first_name ILIKE $${params.length} OR last_name ILIKE $${params.length} OR email ILIKE $${params.length})`; }

    query += " ORDER BY created_at DESC";
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/users/:id
async function getUserById(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT id, first_name, last_name, email, block_lot, contact, role, status, avatar_url, created_at FROM users WHERE id = $1",
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "User not found." });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// POST /api/users — admin creates user
async function createUser(req, res, next) {
  try {
    const { first_name, last_name, email, password, block_lot, contact, role } = req.body;
    if (!first_name || !last_name || !email || !password || !block_lot || !role) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, block_lot, contact, role, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
       RETURNING id, first_name, last_name, email, block_lot, contact, role, status`,
      [first_name, last_name, email, password_hash, block_lot, contact || null, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// PUT /api/users/:id
async function updateUser(req, res, next) {
  try {
    const { first_name, last_name, email, block_lot, contact, role, status, phone, last_login } = req.body;
    const result = await pool.query(
      `UPDATE users SET first_name=$1, last_name=$2, email=$3, block_lot=$4,
       contact=$5, role=$6, status=$7, phone=$8, last_login=$9, updated_at=NOW()
       WHERE id=$10
       RETURNING id, first_name, last_name, email, block_lot, contact, role, status`,
      [first_name, last_name, email, block_lot, contact, role, status, phone, last_login, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "User not found." });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/users/:id
async function deleteUser(req, res, next) {
  try {
    const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING id", [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: "User not found." });
    res.json({ message: "User deleted." });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };