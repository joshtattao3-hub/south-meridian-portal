const router = require("express").Router();
const { getAnnouncements, getAllAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = require("../controllers/announcementsController");
const auth = require("../middleware/auth");

router.get("/",        getAnnouncements);     // public
router.get("/all",     auth, getAllAnnouncements); // officer/admin
router.post("/",       auth, createAnnouncement);
router.put("/:id",     auth, updateAnnouncement);
router.delete("/:id",  auth, deleteAnnouncement);

module.exports = router;