const express = require("express");

const businessAuth = require("../middlewares/businessAuth.js");

const {
    getDashboardSummary,
    getRecentDebts,
    getOverdueDebts
} = require("../controllers/dashboardController");

const router = express.Router();

router.use(businessAuth);

router.get("/summary", getDashboardSummary);
router.get("/recent-debts", getRecentDebts);
router.get("/overdue-debts", getOverdueDebts);

module.exports = router;