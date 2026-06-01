const pool = require("../db");

// GET /api/announcements — public
async function getAnnouncements(req, res, next) {
  try {
    const { priority } = req.query;
    let query = `SELECT a.*, u.first_name, u.last_name
                 FROM announcements a
                 LEFT JOIN users u ON a.author_id = u.id
                 WHERE a.published = true`;
    const params = [];
    if (priority) { params.push(priority); query += ` AND a.priority = $${params.length}`; }
    query += " ORDER BY a.created_at DESC";
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/announcements/all — admin/officer sees unpublished too
async function getAllAnnouncements(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT a.*, u.first_name, u.last_name FROM announcements a
       LEFT JOIN users u ON a.author_id = u.id ORDER BY a.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// POST /api/announcements
async function createAnnouncement(req, res, next) {
  try {
    const { title, body, priority, published } = req.body;
    if (!title || !body || !priority) {
      return res.status(400).json({ error: "Title, body, and priority are required." });
    }
    const result = await pool.query(
      `INSERT INTO announcements (title, body, priority, author_id, published)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, body, priority, req.user.id, published ?? true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// PUT /api/announcements/:id
async function updateAnnouncement(req, res, next) {
  try {
    const { title, body, priority, published } = req.body;
    const result = await pool.query(
      `UPDATE announcements SET title=$1, body=$2, priority=$3, published=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [title, body, priority, published, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Announcement not found." });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/announcements/:id
async function deleteAnnouncement(req, res, next) {
  try {
    const result = await pool.query("DELETE FROM announcements WHERE id=$1 RETURNING id", [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: "Announcement not found." });
    res.json({ message: "Announcement deleted." });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAnnouncements, getAllAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };