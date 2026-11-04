const express = require("express");

const businessAuth = require("../middlewares/businessAuth.js");

const {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
} = require("../controllers/customerController");

const router = express.Router();

// All customer routes require business authentication
router.use(businessAuth);

// GET /api/customers
router.get("/", getAllCustomers);

// GET /api/customers/:id
router.get("/:id", getCustomerById);

// POST /api/customers
router.post("/", createCustomer);

// PUT /api/customers/:id
router.put("/:id", updateCustomer);

// DELETE /api/customers/:id
router.delete("/:id", deleteCustomer);

module.exports = router;