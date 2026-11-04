const db = require("../config/db");

const { logActivity } = require("./activityController");
// ==========================================
// GET ALL DEBTS
// ==========================================

const getAllDebts = async (req, res) => {
    try {
        const businessId = req.user.business_id;

        const [debts] = await db.query(
            `
           SELECT
    d.debt_id,
    d.amount,
    d.amount_paid,
    d.remaining_amount,
    d.description,
    d.debt_date,
    d.due_date,
    d.status,
    d.paid_at,
    d.paid_by,
    d.description,
    d.notes,
    d.debt_date,
    d.created_at,

    c.customer_id,
    c.full_name AS customer_name,
    c.phone_number
FROM debts d
INNER JOIN customers c
    ON d.customer_id = c.customer_id
WHERE d.business_id = ?
ORDER BY d.created_at DESC
            `,
            [businessId]
        );

        res.status(200).json({
            success: true,
            data: debts
        });

    } catch (error) {

        console.error("Get debts error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve debts."
        });
    }
};


// ==========================================
// GET SINGLE DEBT
// ==========================================

const getDebtById = async (req, res) => {
    try {

        const businessId = req.user.business_id;
        const debtId = req.params.id;

        const [debts] = await db.query(
            `
            SELECT
                d.debt_id,
                d.amount,
                d.description,
                d.debt_date,
                d.due_date,
                d.status,
                d.created_at,

                c.customer_id,
                c.full_name AS customer_name,
                c.phone_number,
                c.home_address

            FROM debts d

            INNER JOIN customers c
                ON d.customer_id = c.customer_id

            WHERE d.debt_id = ?
            AND d.business_id = ?
            `,
            [debtId, businessId]
        );

        if (debts.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Debt not found."
            });
        }

        res.status(200).json({
            success: true,
            data: debts[0]
        });

    } catch (error) {

        console.error("Get debt error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve debt."
        });
    }
};


// ==========================================
// CREATE DEBT
// ==========================================

const createDebt = async (req, res) => {
    try {

        const businessId = req.user.business_id;
        const userId = req.user.user_id;

        const {
            customer_id,
            amount,
            description,
            debt_date,
            due_date,
            notes
        } = req.body;


        // VALIDATION

        if (
            !customer_id ||
            !amount ||
            !debt_date ||
            !due_date
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Customer, amount, debt date and due date are required."
            });
        }


        if (Number(amount) <= 0) {

            return res.status(400).json({
                success: false,
                message: "Debt amount must be greater than zero."
            });
        }


        // CHECK CUSTOMER

        const [customers] = await db.query(
            `
            SELECT customer_id
            FROM customers
            WHERE customer_id = ?
            AND business_id = ?
            AND is_active = TRUE
            `,
            [customer_id, businessId]
        );


        if (customers.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Customer not found or inactive."
            });
        }


        // CREATE DEBT

        const [result] = await db.query(
    `
    INSERT INTO debts (
        business_id,
        customer_id,
        amount,
        amount_paid,
        remaining_amount,
        description,
        debt_date,
        due_date,
        status,
        created_by,
        notes
    )
    VALUES (?, ?, ?, 0.00, ?, ?, ?, ?, 'UNPAID', ?, ?)
    `,
    [
        businessId,
        customer_id,
        amount,
        amount,
        description || null,
        debt_date,
        due_date,
        userId,
        notes || null
    ]
);

await logActivity({
    businessId,
    userId,
    action: "DEBT_CREATED",
    entityType: "DEBT",
    entityId: result.insertId,
    description: `Created debt #${result.insertId} for customer #${customer_id}, amount ${Number(amount).toFixed(2)} RWF.`
});


        res.status(201).json({
            success: true,
            message: "Debt recorded successfully.",
            data: {
                debt_id: result.insertId,
                customer_id,
                amount,
                description: description || null,
                debt_date,
                due_date,
                status: "UNPAID",
                notes: notes || null
            }
        });


    } catch (error) {

        console.error("Create debt error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to record debt."
        });
    }
};


// ==========================================
// UPDATE DEBT
// ==========================================

const updateDebt = async (req, res) => {
    try {

      const businessId = req.user.business_id;
const userId = req.user.user_id;
const debtId = req.params.id;

        const {
            customer_id,
            amount,
            description,
            debt_date,
            due_date,
            notes
        } = req.body;


        if (
            !customer_id ||
            !amount ||
            !debt_date ||
            !due_date
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Customer, amount, debt date and due date are required."
            });
        }


        if (Number(amount) <= 0) {

            return res.status(400).json({
                success: false,
                message: "Debt amount must be greater than zero."
            });
        }


        // CHECK CUSTOMER

        const [customers] = await db.query(
            `
            SELECT customer_id
            FROM customers
            WHERE customer_id = ?
            AND business_id = ?
            AND is_active = TRUE
            `,
            [customer_id, businessId]
        );


        if (customers.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Customer not found or inactive."
            });
        }


        // UPDATE

        const [result] = await db.query(
            `
            UPDATE debts

            SET
                customer_id = ?,
                amount = ?,
                description = ?,
                debt_date = ?,
                due_date = ?,
                notes = ?

            WHERE debt_id = ?
            AND business_id = ?
            AND status = 'UNPAID'
            `,
            [
                customer_id,
                amount,
                description || null,
                debt_date,
                due_date,
                notes || null,
                debtId,
                businessId
            ]
        );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "Debt not found or cannot be edited."
            });
        }


        await logActivity({
            businessId,
            userId,
            action: "DEBT_UPDATED",
            entityType: "DEBT",
            entityId: debtId,
            description: `Updated debt #${debtId} for customer #${customer_id}.`
        });

        res.status(200).json({
            success: true,
            message: "Debt updated successfully."
        });


    } catch (error) {

        console.error("Update debt error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update debt."
        });
    }
};


// ==========================================
// CANCEL DEBT
// ==========================================

const cancelDebt = async (req, res) => {
    try {

     const businessId = req.user.business_id;
const userId = req.user.user_id;
const debtId = req.params.id;


        const [result] = await db.query(
            `
            UPDATE debts

            SET status = 'CANCELLED'

            WHERE debt_id = ?
            AND business_id = ?
            AND status = 'UNPAID'
            `,
            [debtId, businessId]
        );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "Debt not found or cannot be cancelled."
            });
        }


        await logActivity({
            businessId,
            userId,
            action: "DEBT_CANCELLED",
            entityType: "DEBT",
            entityId: debtId,
description: `Cancelled debt #${debtId}.`
        });

        res.status(200).json({
            success: true,
            message: "Debt cancelled successfully."
        });


    } catch (error) {

        console.error("Cancel debt error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to cancel debt."
        });
    }
};


// ==========================================
// SHARED PAYMENT PROCESSOR
// Handles both manual payments and Mark as Paid
// ==========================================

const processDebtPayment = async (req, res, payFullBalance = false) => {
    let connection;
    let transactionStarted = false;

    try {
        const businessId = req.user.business_id;
        const userId = req.user.user_id;
        const debtId = req.params.id;

        connection = await db.getConnection();

        // Validate manual payment amount
        let paymentAmount;

        if (!payFullBalance) {
            paymentAmount = Number(req.body.amount_paid);

            if (
                req.body.amount_paid === undefined ||
                req.body.amount_paid === null ||
                req.body.amount_paid === "" ||
                !Number.isFinite(paymentAmount) ||
                paymentAmount <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Enter a valid payment amount greater than zero."
                });
            }
        }

        await connection.beginTransaction();
        transactionStarted = true;

        // Lock debt while processing payment
        const [debts] = await connection.query(
            `
            SELECT
                debt_id,
                business_id,
                amount,
                amount_paid,
                remaining_amount,
                status,
                due_date,
                CURDATE() AS today
            FROM debts
            WHERE debt_id = ?
            AND business_id = ?
            FOR UPDATE
            `,
            [debtId, businessId]
        );

        if (debts.length === 0) {
            await connection.rollback();
            transactionStarted = false;

            return res.status(404).json({
                success: false,
                message: "Debt not found."
            });
        }

        const debt = debts[0];

        if (debt.status === "PAID") {
            await connection.rollback();
            transactionStarted = false;

            return res.status(400).json({
                success: false,
                message: "This debt has already been fully paid."
            });
        }

        if (debt.status === "CANCELLED") {
            await connection.rollback();
            transactionStarted = false;

            return res.status(400).json({
                success: false,
                message: "Cancelled debts cannot receive payments."
            });
        }

        // Calculate using cents to avoid floating-point errors
        const originalAmount = Number(debt.amount);
        const currentPaid = Number(debt.amount_paid);

        const originalCents = Math.round(originalAmount * 100);
        const paidCents = Math.round(currentPaid * 100);
        const remainingCents = originalCents - paidCents;

        if (remainingCents <= 0) {
            await connection.rollback();
            transactionStarted = false;

            return res.status(400).json({
                success: false,
                message: "This debt has no remaining balance. Please review its status."
            });
        }

        // Mark as Paid automatically uses the full remaining balance
        if (payFullBalance) {
            paymentAmount = remainingCents / 100;
        }

        const paymentCents = Math.round(paymentAmount * 100);

        if (paymentCents <= 0) {
            await connection.rollback();
            transactionStarted = false;

            return res.status(400).json({
                success: false,
                message: "Payment must be greater than zero."
            });
        }

        // Prevent overpayment
        if (paymentCents > remainingCents) {
            await connection.rollback();
            transactionStarted = false;

            return res.status(400).json({
                success: false,
                message: `Payment cannot exceed the remaining balance of ${(remainingCents / 100).toFixed(2)} RWF.`
            });
        }

        const newPaidCents = paidCents + paymentCents;
        const newRemainingCents = originalCents - newPaidCents;

        const newAmountPaid = newPaidCents / 100;
        const newRemaining = newRemainingCents / 100;

        const newStatus =
            newRemainingCents === 0
                ? "PAID"
                : String(debt.due_date) < String(debt.today)
                    ? "OVERDUE"
                    : "PARTIALLY_PAID";

        const notes = payFullBalance
            ? "Full remaining balance paid using Mark as Paid."
            : (req.body.notes || null);

        // 1. Insert payment transaction
        await connection.query(
            `
            INSERT INTO debt_payments (
                debt_id,
                business_id,
                amount_paid,
                recorded_by,
                notes
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                debtId,
                businessId,
                paymentCents / 100,
                userId,
                notes
            ]
        );

        // 2. Update debt balance and status
        await connection.query(
            `
            UPDATE debts
            SET
                amount_paid = ?,
                remaining_amount = ?,
                status = ?,
                paid_at = CASE
                    WHEN ? = 'PAID' THEN NOW()
                    ELSE NULL
                END,
                paid_by = CASE
                    WHEN ? = 'PAID' THEN ?
                    ELSE NULL
                END
            WHERE debt_id = ?
            AND business_id = ?
            `,
            [
                newAmountPaid,
                newRemaining,
                newStatus,
                newStatus,
                newStatus,
                userId,
                debtId,
                businessId
            ]
        );

        // 3. Record activity
        await connection.query(
            `
            INSERT INTO activity_logs (
                business_id,
                user_id,
                action,
                entity_type,
                entity_id,
                description
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                businessId,
                userId,
                newStatus === "PAID"
                    ? "DEBT_MARKED_PAID"
                    : "DEBT_PAYMENT_RECORDED",
                "DEBT",
                debtId,
                `Recorded payment of ${(paymentCents / 100).toFixed(2)} RWF for debt #${debtId}. Total paid: ${newAmountPaid.toFixed(2)} RWF; remaining: ${newRemaining.toFixed(2)} RWF.`
            ]
        );

        // 4. Commit all changes together
        await connection.commit();
        transactionStarted = false;

        return res.status(200).json({
            success: true,
            message: newStatus === "PAID"
                ? "Payment recorded. Debt is fully paid."
                : "Payment recorded successfully.",
            data: {
                debt_id: debtId,
                original_amount: originalAmount,
                payment_amount: paymentCents / 100,
                total_paid: newAmountPaid,
                remaining_amount: newRemaining,
                status: newStatus
            }
        });

    } catch (error) {
        if (connection && transactionStarted) {
            await connection.rollback();
        }

        console.error("Debt payment error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to record payment."
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
};


// ==========================================
// MARK DEBT AS PAID
// Automatically records the full remaining balance
// ==========================================

const markDebtAsPaid = async (req, res) => {
    return processDebtPayment(req, res, true);
};


// ==========================================
// RECORD FULL OR PARTIAL DEBT PAYMENT
// ==========================================

const recordDebtPayment = async (req, res) => {
    return processDebtPayment(req, res, false);
};



module.exports = {
    getAllDebts,
    getDebtById,
    createDebt,
    updateDebt,
    cancelDebt,
    markDebtAsPaid,
    recordDebtPayment
};