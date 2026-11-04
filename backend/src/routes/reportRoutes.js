
const express = require("express");

const businessAuth = require("../middlewares/businessAuth.js");

const {
    getFinancialSummary,
    getPaymentHistory
} = require("../controllers/reportController");

const router = express.Router();

// All report routes require business authentication
router.use(businessAuth);

// GET financial summary
router.get("/summary", getFinancialSummary);
router.get("/payments", getPaymentHistory);

module.exports = router;
