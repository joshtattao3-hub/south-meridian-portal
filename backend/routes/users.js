const router = require("express").Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require("../controllers/usersController");
const auth = require("../middleware/auth");

// All user routes require authentication
router.use(auth);

router.get("/",     getAllUsers);   // admin/officer
router.get("/:id",  getUserById);  // admin/officer
router.post("/",    createUser);   // admin only
router.put("/:id",  updateUser);   // admin only
router.delete("/:id", deleteUser); // admin only

module.exports = router;