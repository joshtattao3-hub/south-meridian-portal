const pool = require("../db");

// GET /api/events — public
async function getEvents(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT e.*, u.first_name, u.last_name FROM events e
       LEFT JOIN users u ON e.author_id = u.id
       ORDER BY e.event_datetime ASC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// POST /api/events — officer/admin
async function createEvent(req, res, next) {
  try {
    const { title, description, event_datetime, venue } = req.body;
    if (!title || !event_datetime || !venue) {
      return res.status(400).json({ error: "Title, date/time, and venue are required." });
    }
    const result = await pool.query(
      `INSERT INTO events (title, description, event_datetime, venue, author_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description || null, event_datetime, venue, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// PUT /api/events/:id
async function updateEvent(req, res, next) {
  try {
    const { title, description, event_datetime, venue } = req.body;
    const result = await pool.query(
      `UPDATE events SET title=$1, description=$2, event_datetime=$3, venue=$4
       WHERE id=$5 RETURNING *`,
      [title, description, event_datetime, venue, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Event not found." });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/events/:id
async function deleteEvent(req, res, next) {
  try {
    const result = await pool.query("DELETE FROM events WHERE id=$1 RETURNING id", [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: "Event not found." });
    res.json({ message: "Event deleted." });
  } catch (err) {
    next(err);
  }
}

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };