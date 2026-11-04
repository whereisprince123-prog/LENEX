const express = require("express");

const businessAuth = require("../middlewares/businessAuth.js");

const {
    getAllDebts,
    getDebtById,
    createDebt,
    updateDebt,
    cancelDebt,
    markDebtAsPaid,
    recordDebtPayment
} = require("../controllers/debtController");

const router = express.Router();


// All debt routes require business authentication
router.use(businessAuth);


// GET all debts
router.get("/", getAllDebts);


// GET one debt
router.get("/:id", getDebtById);


// CREATE debt
router.post("/", createDebt);


// UPDATE debt
router.put("/:id", updateDebt);


// CANCEL debt
router.patch("/:id/cancel", cancelDebt);

// MARK debt as paid
router.patch("/:id/mark-paid", markDebtAsPaid);

// RECORD debt payment
router.post("/:id/payments",recordDebtPayment);


module.exports = router;