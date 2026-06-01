const pool = require("../db");

// GET /api/reservations
async function getReservations(req, res, next) {
  try {
    let query, params = [];

    if (req.user.role === "resident") {
      query = `SELECT r.*, f.name as facility_name, fs.label as slot_label, fs.start_time, fs.end_time
               FROM reservations r
               JOIN facilities f ON r.facility_id = f.id
               JOIN facility_slots fs ON r.slot_id = fs.id
               WHERE r.resident_id = $1 ORDER BY r.date DESC`;
      params = [req.user.id];
    } else {
      const { status } = req.query;
      query = `SELECT r.*, f.name as facility_name, fs.label as slot_label,
               u.first_name, u.last_name, u.block_lot
               FROM reservations r
               JOIN facilities f ON r.facility_id = f.id
               JOIN facility_slots fs ON r.slot_id = fs.id
               JOIN users u ON r.resident_id = u.id WHERE 1=1`;
      if (status) { params.push(status); query += ` AND r.status = $${params.length}`; }
      query += " ORDER BY r.date DESC";
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/reservations/slots/:facility_id — get slots for a facility
async function getSlots(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT * FROM facility_slots WHERE facility_id = $1 AND active = true ORDER BY start_time",
      [req.params.facility_id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// POST /api/reservations
async function createReservation(req, res, next) {
  try {
    const { facility_id, slot_id, date, notes } = req.body;
    if (!facility_id || !slot_id || !date) {
      return res.status(400).json({ error: "Facility, slot, and date are required." });
    }

    // Check for conflicts
    const conflict = await pool.query(
      `SELECT id FROM reservations
       WHERE facility_id=$1 AND slot_id=$2 AND date=$3 AND status != 'Cancelled'`,
      [facility_id, slot_id, date]
    );
    if (conflict.rows.length > 0) {
      return res.status(409).json({ error: "This time slot is already taken." });
    }

    const result = await pool.query(
      `INSERT INTO reservations (facility_id, slot_id, resident_id, date, notes, status)
       VALUES ($1, $2, $3, $4, $5, 'Pending') RETURNING *`,
      [facility_id, slot_id, req.user.id, date, notes || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// PUT /api/reservations/:id — approve/reject
async function updateReservation(req, res, next) {
  try {
    const { status } = req.body;
    const result = await pool.query(
      `UPDATE reservations SET status=$1, approved_by=$2, updated_at=NOW()
       WHERE id=$3 RETURNING *`,
      [status, req.user.id, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Reservation not found." });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/reservations/:id — cancel
async function deleteReservation(req, res, next) {
  try {
    const result = await pool.query(
      "UPDATE reservations SET status='Cancelled', updated_at=NOW() WHERE id=$1 RETURNING *",
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Reservation not found." });
    res.json({ message: "Reservation cancelled." });
  } catch (err) {
    next(err);
  }
}

module.exports = { getReservations, getSlots, createReservation, updateReservation, deleteReservation };