const pool = require("../db");

// GET /api/complaints
async function getComplaints(req, res, next) {
  try {
    let query, params = [];

    if (req.user.role === "resident") {
      query = `SELECT c.*, u.first_name, u.last_name, u.block_lot
               FROM complaints c JOIN users u ON c.resident_id = u.id
               WHERE c.resident_id = $1 ORDER BY c.created_at DESC`;
      params = [req.user.id];
    } else {
      const { status, priority } = req.query;
      query = `SELECT c.*, u.first_name, u.last_name, u.block_lot
               FROM complaints c JOIN users u ON c.resident_id = u.id WHERE 1=1`;
      if (status)   { params.push(status);   query += ` AND c.status = $${params.length}`; }
      if (priority) { params.push(priority); query += ` AND c.priority = $${params.length}`; }
      query += " ORDER BY c.created_at DESC";
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/complaints/:id
async function getComplaintById(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT c.*, u.first_name, u.last_name, u.block_lot
       FROM complaints c JOIN users u ON c.resident_id = u.id WHERE c.id = $1`,
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Complaint not found." });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// POST /api/complaints
async function createComplaint(req, res, next) {
  try {
    const { subject, description, priority } = req.body;
    if (!subject || !description || !priority) {
      return res.status(400).json({ error: "Subject, description, and priority are required." });
    }
    const result = await pool.query(
      `INSERT INTO complaints (resident_id, subject, description, priority, status)
       VALUES ($1, $2, $3, $4, 'Pending') RETURNING *`,
      [req.user.id, subject, description, priority]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// PUT /api/complaints/:id
async function updateComplaint(req, res, next) {
  try {
    const { status, assigned_to } = req.body;
    const result = await pool.query(
      `UPDATE complaints SET status=$1, assigned_to=$2, updated_at=NOW()
       WHERE id=$3 RETURNING *`,
      [status, assigned_to || null, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Complaint not found." });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/complaints/:id
async function deleteComplaint(req, res, next) {
  try {
    const result = await pool.query("DELETE FROM complaints WHERE id=$1 RETURNING id", [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: "Complaint not found." });
    res.json({ message: "Complaint deleted." });
  } catch (err) {
    next(err);
  }
}

module.exports = { getComplaints, getComplaintById, createComplaint, updateComplaint, deleteComplaint };