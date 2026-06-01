const pool = require("../db");

// GET /api/facilities — with their slots
async function getFacilities(req, res, next) {
  try {
    const facilities = await pool.query(
      "SELECT * FROM facilities WHERE active = true ORDER BY name ASC"
    );
    const slots = await pool.query(
      "SELECT * FROM facility_slots WHERE active = true ORDER BY start_time ASC"
    );

    // Attach slots to each facility
    const result = facilities.rows.map(f => ({
      ...f,
      slots: slots.rows.filter(s => s.facility_id === f.id),
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
}

// POST /api/facilities — admin only
async function createFacility(req, res, next) {
  try {
    const { name, description, capacity, icon } = req.body;
    if (!name || !capacity) {
      return res.status(400).json({ error: "Name and capacity are required." });
    }
    const result = await pool.query(
      `INSERT INTO facilities (name, description, capacity, icon, active)
       VALUES ($1, $2, $3, $4, true) RETURNING *`,
      [name, description || null, capacity, icon || "building"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// PUT /api/facilities/:id
async function updateFacility(req, res, next) {
  try {
    const { name, description, capacity, icon, active } = req.body;
    const result = await pool.query(
      `UPDATE facilities SET name=$1, description=$2, capacity=$3, icon=$4, active=$5
       WHERE id=$6 RETURNING *`,
      [name, description, capacity, icon, active, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Facility not found." });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/facilities/:id
async function deleteFacility(req, res, next) {
  try {
    await pool.query("UPDATE facilities SET active=false WHERE id=$1", [req.params.id]);
    res.json({ message: "Facility deactivated." });
  } catch (err) {
    next(err);
  }
}

module.exports = { getFacilities, createFacility, updateFacility, deleteFacility };