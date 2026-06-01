const router = require("express").Router();
const { getFacilities, createFacility, updateFacility, deleteFacility } = require("../controllers/facilitiesController");
const auth = require("../middleware/auth");

// Public
router.get("/", getFacilities);

// Protected
router.post("/",      auth, createFacility);
router.put("/:id",    auth, updateFacility);
router.delete("/:id", auth, deleteFacility);

module.exports = router;