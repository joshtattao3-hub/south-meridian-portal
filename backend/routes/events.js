const router = require("express").Router();
const { getEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/eventsController");
const auth = require("../middleware/auth");

router.get("/",       getEvents);              // public
router.post("/",      auth, createEvent);
router.put("/:id",    auth, updateEvent);
router.delete("/:id", auth, deleteEvent);

module.exports = router;