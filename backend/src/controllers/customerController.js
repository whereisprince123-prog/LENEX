
const db = require("../config/db");
const { logActivity } = require("./activityController");

// ===============================
// GET ALL CUSTOMERS
// ===============================
const getAllCustomers = async (req, res) => {
    try {
        const businessId = req.user.business_id;

        const [customers] = await db.query(
            `SELECT customer_id, full_name, phone_number,
                    home_address, notes, is_active, created_at
             FROM customers
             WHERE business_id = ? AND is_active = TRUE
             ORDER BY created_at DESC`,
            [businessId]
        );

        res.status(200).json({ success: true, data: customers });
    } catch (error) {
        console.error("Get customers error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve customers."
        });
    }
};

// ===============================
// GET CUSTOMER BY ID
// ===============================
const getCustomerById = async (req, res) => {
    try {
        const businessId = req.user.business_id;
        const customerId = req.params.id;

        const [customers] = await db.query(
            `SELECT customer_id, full_name, phone_number,
                    home_address, notes, is_active, created_at
             FROM customers
             WHERE customer_id = ? AND business_id = ?`,
            [customerId, businessId]
        );

        if (customers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer not found."
            });
        }

        res.status(200).json({
            success: true,
            data: customers[0]
        });
    } catch (error) {
        console.error("Get customer error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve customer."
        });
    }
};

// ===============================
// CREATE CUSTOMER
// ===============================
const createCustomer = async (req, res) => {
    try {
        const businessId = req.user.business_id;
        const userId = req.user.user_id;

        const { full_name, phone_number, home_address, notes } = req.body;

        if (!full_name || !phone_number) {
            return res.status(400).json({
                success: false,
                message: "Full name and phone number are required."
            });
        }

        const [result] = await db.query(
            `INSERT INTO customers
                (business_id, full_name, phone_number, home_address, notes)
             VALUES (?, ?, ?, ?, ?)`,
            [
                businessId,
                full_name,
                phone_number,
                home_address || null,
                notes || null
            ]
        );

        await logActivity({
            businessId,
            userId,
            action: "CUSTOMER_CREATED",
            entityType: "CUSTOMER",
            entityId: result.insertId,
            description: `Created customer ${full_name}`
        });

        res.status(201).json({
            success: true,
            message: "Customer created successfully.",
            data: {
                customer_id: result.insertId,
                full_name,
                phone_number,
                home_address: home_address || null,
                notes: notes || null
            }
        });
    } catch (error) {
        console.error("Create customer error:", error);
        res.status(500).json({
            success: false,
            message: "Customer creation or activity logging failed."
        });
    }
};

// ===============================
// UPDATE CUSTOMER
// ===============================
const updateCustomer = async (req, res) => {
    try {
        const businessId = req.user.business_id;
        const userId = req.user.user_id;
        const customerId = req.params.id;

        const { full_name, phone_number, home_address, notes } = req.body;

        if (!full_name || !phone_number) {
            return res.status(400).json({
                success: false,
                message: "Full name and phone number are required."
            });
        }

        const [result] = await db.query(
            `UPDATE customers
             SET full_name = ?, phone_number = ?,
                 home_address = ?, notes = ?
             WHERE customer_id = ? AND business_id = ?`,
            [
                full_name,
                phone_number,
                home_address || null,
                notes || null,
                customerId,
                businessId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer not found or no changes made."
            });
        }

        await logActivity({
            businessId,
            userId,
            action: "CUSTOMER_UPDATED",
            entityType: "CUSTOMER",
            entityId: customerId,
            description: `Updated customer ${full_name}`
        });

        res.status(200).json({
            success: true,
            message: "Customer updated successfully."
        });
    } catch (error) {
        console.error("Update customer error:", error);
        res.status(500).json({
            success: false,
            message: "Customer update or activity logging failed."
        });
    }
};

// ===============================
// DELETE CUSTOMER (SOFT DELETE)
// ===============================
const deleteCustomer = async (req, res) => {
    try {
        const businessId = req.user.business_id;
        const userId = req.user.user_id;
        const customerId = req.params.id;

        // Retrieve the customer name before soft deletion.
        const [customers] = await db.query(
            `SELECT full_name FROM customers
             WHERE customer_id = ? AND business_id = ?
               AND is_active = TRUE`,
            [customerId, businessId]
        );

        if (customers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer not found."
            });
        }

        const customerName = customers[0].full_name;

        const [result] = await db.query(
            `UPDATE customers
             SET is_active = FALSE
             WHERE customer_id = ? AND business_id = ?
               AND is_active = TRUE`,
            [customerId, businessId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer not found."
            });
        }

        await logActivity({
            businessId,
            userId,
            action: "CUSTOMER_DELETED",
            entityType: "CUSTOMER",
            entityId: customerId,
            description: `Deleted customer ${customerName}`
        });

        res.status(200).json({
            success: true,
            message: "Customer deleted successfully."
        });
    } catch (error) {
        console.error("Delete customer error:", error);
        res.status(500).json({
            success: false,
            message: "Customer deletion or activity logging failed."
        });
    }
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
};
