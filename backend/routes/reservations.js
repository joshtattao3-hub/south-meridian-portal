const router = require("express").Router();
const { getReservations, getSlots, createReservation, updateReservation, deleteReservation } = require("../controllers/reservationsController");
const auth = require("../middleware/auth");

router.get("/slots/:facility_id", getSlots); // public
router.use(auth);
router.get("/",       getReservations);
router.post("/",      createReservation);
router.put("/:id",    updateReservation);
router.delete("/:id", deleteReservation);

module.exports = router;