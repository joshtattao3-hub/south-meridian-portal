const router = require("express").Router();
const { getComplaints, getComplaintById, createComplaint, updateComplaint, deleteComplaint } = require("../controllers/complaintsController");
const auth = require("../middleware/auth");

router.use(auth);

router.get("/",       getComplaints);
router.get("/:id",    getComplaintById);
router.post("/",      createComplaint);
router.put("/:id",    updateComplaint);
router.delete("/:id", deleteComplaint);

module.exports = router;