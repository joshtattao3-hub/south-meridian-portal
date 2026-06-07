const router = require("express").Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require("../controllers/usersController");
const auth = require("../middleware/auth");
// upload route
const multer  = require("multer");
const path    = require("path");
const storage = multer.diskStorage({
  destination: "uploads/avatars/",
  filename: (req, file, cb) => cb(null, `${req.params.id}-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/:id/avatar", upload.single("avatar"), async (req, res, next) => {
  try {
    const url = `/uploads/avatars/${req.file.filename}`;
    const result = await require("../db").query(
      "UPDATE users SET avatar_url = $1 WHERE id = $2 RETURNING avatar_url",
      [url, req.params.id]
    );
    res.json({ avatar_url: result.rows[0].avatar_url });
  } catch (err) { next(err); }
});

// All user routes require authentication
router.use(auth);

router.get("/",     getAllUsers);   // admin/officer
router.get("/:id",  getUserById);  // admin/officer
router.post("/",    createUser);   // admin only
router.put("/:id",  updateUser);   // admin only
router.delete("/:id", deleteUser); // admin only

module.exports = router;