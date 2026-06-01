const router = require("express").Router();
const { getDues, getPayments, createPeriod, submitPayment, updatePayment } = require("../controllers/duesController");
const auth = require("../middleware/auth");

router.use(auth);

router.get("/",                getDues);
router.get("/payments",        getPayments);
router.post("/periods",        createPeriod);
router.post("/pay",            submitPayment);
router.put("/payments/:id",    updatePayment);

module.exports = router;