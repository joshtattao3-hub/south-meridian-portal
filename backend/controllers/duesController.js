const pool = require("../db");

// GET /api/dues — returns periods with payment status for the resident
async function getDues(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    
    let query, params = [];

    if (req.user.role === "resident") {
      query = `SELECT dp.*, pay.status as payment_status, pay.paid_at, pay.paid_amount, pay.reference
              FROM dues_periods dp
              LEFT JOIN dues_payments pay ON dp.id = pay.period_id AND pay.resident_id = $1
              WHERE dp.is_posted = true
              ORDER BY dp.period_month DESC`;
      params = [req.user.id];
    } else {
  query = `SELECT dp.*, pay.status as payment_status, pay.paid_at, pay.paid_amount, pay.reference
          FROM dues_periods dp
          LEFT JOIN dues_payments pay ON dp.id = pay.period_id
          WHERE dp.is_posted = true
          ORDER BY dp.period_month DESC`;
  params = [];
  }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/dues/payments — all payments (admin)
async function getPayments(req, res, next) {
  try {
    const { status } = req.query;
    let query = `SELECT pay.*, dp.label, dp.amount as period_amount, dp.due_date,
                 u.first_name, u.last_name, u.block_lot
                 FROM dues_payments pay
                 JOIN dues_periods dp ON pay.period_id = dp.id
                 JOIN users u ON pay.resident_id = u.id WHERE 1=1`;
    const params = [];
    if (status) { params.push(status); query += ` AND pay.status = $${params.length}`; }
    query += " ORDER BY pay.created_at DESC";
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// POST /api/dues/periods — admin creates a billing period
async function createPeriod(req, res, next) {
  try {
    const { label, period_month, amount, due_date } = req.body;
    if (!label || !period_month || !amount || !due_date) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const result = await pool.query(
      `INSERT INTO dues_periods (label, period_month, amount, due_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [label, period_month, amount, due_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// POST /api/dues/pay — resident submits payment
async function submitPayment(req, res, next) {
  try {
    const { period_id, paid_amount, reference, notes } = req.body;
    if (!period_id || !paid_amount) {
      return res.status(400).json({ error: "Period and amount are required." });
    }
    const result = await pool.query(
      `INSERT INTO dues_payments (period_id, resident_id, status, paid_amount, reference, notes)
       VALUES ($1, $2, 'Paid', $3, $4, $5) RETURNING *`,
      [period_id, req.user.id, paid_amount, reference || null, notes || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// PUT /api/dues/payments/:id — admin updates payment status
async function updatePayment(req, res, next) {
  try {
    const { status, notes } = req.body;
    const result = await pool.query(
      `UPDATE dues_payments SET status=$1, notes=$2 WHERE id=$3 RETURNING *`,
      [status, notes || null, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Payment not found." });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { getDues, getPayments, createPeriod, submitPayment, updatePayment };