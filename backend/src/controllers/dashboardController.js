const db = require("../config/db");

// Get dashboard summary
const getDashboardSummary = async (req, res) => {
    try {
        const businessId = req.user.business_id;

        const [customerResult] = await db.query(
            `
            SELECT COUNT(*) AS total_customers
            FROM customers
            WHERE business_id = ?
            AND is_active = TRUE
            `,
            [businessId]
        );

        const [unpaidResult] = await db.query(
            `
            SELECT
                COUNT(*) AS unpaid_count,
                COALESCE(SUM(amount), 0) AS unpaid_amount
            FROM debts
            WHERE business_id = ?
            AND status = 'UNPAID'
            `,
            [businessId]
        );

        const [overdueResult] = await db.query(
            `
            SELECT
                COUNT(*) AS overdue_count,
                COALESCE(SUM(amount), 0) AS overdue_amount
            FROM debts
            WHERE business_id = ?
            AND (
                status = 'OVERDUE'
                OR (status = 'UNPAID' AND due_date < CURDATE())
            )
            `,
            [businessId]
        );

        const [paidResult] = await db.query(
            `
            SELECT
                COUNT(*) AS paid_count,
                COALESCE(SUM(amount), 0) AS paid_amount
            FROM debts
            WHERE business_id = ?
            AND status = 'PAID'
            `,
            [businessId]
        );

        res.json({
            success: true,
            data: {
                total_customers: customerResult[0].total_customers,

                unpaid_count: unpaidResult[0].unpaid_count,
                unpaid_amount: Number(unpaidResult[0].unpaid_amount),

                overdue_count: overdueResult[0].overdue_count,
                overdue_amount: Number(overdueResult[0].overdue_amount),

                paid_count: paidResult[0].paid_count,
                paid_amount: Number(paidResult[0].paid_amount)
            }
        });

    } catch (error) {
        console.error("Dashboard summary error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load dashboard summary"
        });
    }
};


// Get recent debts
const getRecentDebts = async (req, res) => {
    try {
        const businessId = req.user.business_id;

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
                c.phone_number
            FROM debts d
            INNER JOIN customers c
                ON d.customer_id = c.customer_id
            WHERE d.business_id = ?
            ORDER BY d.created_at DESC
            LIMIT 10
            `,
            [businessId]
        );

        res.json({
            success: true,
            data: debts
        });

    } catch (error) {
        console.error("Recent debts error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load recent debts"
        });
    }
};


// Get overdue debts
const getOverdueDebts = async (req, res) => {
    try {
        const businessId = req.user.business_id;

        const [debts] = await db.query(
            `
            SELECT
                d.debt_id,
                d.amount,
                d.description,
                d.debt_date,
                d.due_date,
                d.status,
                c.customer_id,
                c.full_name AS customer_name,
                c.phone_number
            FROM debts d
            INNER JOIN customers c
                ON d.customer_id = c.customer_id
            WHERE d.business_id = ?
            AND (
                d.status = 'OVERDUE'
                OR (d.status = 'UNPAID' AND d.due_date < CURDATE())
            )
            ORDER BY d.due_date ASC
            LIMIT 10
            `,
            [businessId]
        );

        res.json({
            success: true,
            data: debts
        });

    } catch (error) {
        console.error("Overdue debts error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load overdue debts"
        });
    }
};


module.exports = {
    getDashboardSummary,
    getRecentDebts,
    getOverdueDebts
};