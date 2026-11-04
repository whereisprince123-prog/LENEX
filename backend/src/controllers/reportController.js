
const db = require("../config/db");

// ==========================================
// HELPER: VALIDATE REPORT DATE FILTERS
// ==========================================

const getDateFilters = (req, res) => {
    const { startDate, endDate } = req.query;

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (startDate && !datePattern.test(startDate)) {
        res.status(400).json({
            success: false,
            message: "Invalid startDate. Use YYYY-MM-DD."
        });
        return null;
    }

    if (endDate && !datePattern.test(endDate)) {
        res.status(400).json({
            success: false,
            message: "Invalid endDate. Use YYYY-MM-DD."
        });
        return null;
    }

    if (startDate && endDate && startDate > endDate) {
        res.status(400).json({
            success: false,
            message: "Start date cannot be later than end date."
        });
        return null;
    }

    return { startDate, endDate };
};


// ==========================================
// GET FINANCIAL SUMMARY
// ==========================================

const getFinancialSummary = async (req, res) => {
    try {
        const businessId = req.user.business_id;

        const dates = getDateFilters(req, res);

        if (!dates) return;

        const { startDate, endDate } = dates;

        // Debt date filters
        let debtDateCondition = "";
        const debtParams = [businessId];

        if (startDate) {
            debtDateCondition += " AND d.debt_date >= ?";
            debtParams.push(startDate);
        }

        if (endDate) {
            debtDateCondition += " AND d.debt_date <= ?";
            debtParams.push(endDate);
        }

        // Payment date filters
        let paymentDateCondition = "";
        const paymentParams = [businessId];

        if (startDate) {
            paymentDateCondition += " AND dp.payment_date >= ?";
            paymentParams.push(`${startDate} 00:00:00`);
        }

        if (endDate) {
            paymentDateCondition += " AND dp.payment_date < DATE_ADD(?, INTERVAL 1 DAY)";
            paymentParams.push(endDate);
        }

        // 1. Financial summary
        const [summaryRows] = await db.query(
            `
            SELECT
                COUNT(*) AS total_debt_records,

                COALESCE(SUM(
                    CASE
                        WHEN d.status != 'CANCELLED'
                        THEN d.amount
                        ELSE 0
                    END
                ), 0) AS total_debt_amount,

                COALESCE(SUM(
                    CASE
                        WHEN d.status != 'CANCELLED'
                        THEN d.amount_paid
                        ELSE 0
                    END
                ), 0) AS total_paid_on_selected_debts,

                COALESCE(SUM(
                    CASE
                        WHEN d.status != 'CANCELLED'
                        THEN d.remaining_amount
                        ELSE 0
                    END
                ), 0) AS outstanding_balance,

                COALESCE(SUM(
                    CASE
                        WHEN d.status != 'CANCELLED'
                        AND d.remaining_amount > 0
                        AND d.due_date < CURDATE()
                        THEN d.remaining_amount
                        ELSE 0
                    END
                ), 0) AS overdue_balance,

                SUM(
                    CASE
                        WHEN d.status != 'CANCELLED'
                        AND d.remaining_amount > 0
                        AND d.due_date < CURDATE()
                        THEN 1
                        ELSE 0
                    END
                ) AS overdue_count

            FROM debts d
            WHERE d.business_id = ?
            ${debtDateCondition}
            `,
            debtParams
        );

        // 2. Actual payments received during selected period
        const [paymentRows] = await db.query(
            `
            SELECT
                COUNT(*) AS payment_count,
                COALESCE(SUM(dp.amount_paid), 0) AS total_collected
            FROM debt_payments dp
            WHERE dp.business_id = ?
            ${paymentDateCondition}
            `,
            paymentParams
        );

        // 3. Debt status breakdown
        const [statusRows] = await db.query(
            `
            SELECT
                COUNT(*) AS total_records,

                SUM(
                    CASE WHEN d.status = 'PAID'
                    THEN 1 ELSE 0 END
                ) AS paid_count,

                SUM(
                    CASE WHEN d.status = 'CANCELLED'
                    THEN 1 ELSE 0 END
                ) AS cancelled_count,

                SUM(
                    CASE
                        WHEN d.status != 'CANCELLED'
                        AND d.status != 'PAID'
                        AND d.remaining_amount > 0
                        AND d.due_date < CURDATE()
                        THEN 1 ELSE 0
                    END
                ) AS overdue_count,

                SUM(
                    CASE
                        WHEN d.status != 'CANCELLED'
                        AND d.status != 'PAID'
                        AND d.remaining_amount > 0
                        AND d.due_date >= CURDATE()
                        AND d.amount_paid > 0
                        THEN 1 ELSE 0
                    END
                ) AS partially_paid_count,

                SUM(
                    CASE
                        WHEN d.status != 'CANCELLED'
                        AND d.status != 'PAID'
                        AND d.remaining_amount > 0
                        AND d.due_date >= CURDATE()
                        AND d.amount_paid = 0
                        THEN 1 ELSE 0
                    END
                ) AS unpaid_count

            FROM debts d
            WHERE d.business_id = ?
            ${debtDateCondition}
            `,
            debtParams
        );

        const summary = summaryRows[0];
        const payments = paymentRows[0];
        const statuses = statusRows[0];

        res.status(200).json({
            success: true,
            data: {
                financial: {
                    totalDebtRecords: Number(summary.total_debt_records || 0),
                    totalDebtAmount: Number(summary.total_debt_amount || 0),
                    totalCollected: Number(payments.total_collected || 0),
                    outstandingBalance: Number(summary.outstanding_balance || 0),
                    overdueBalance: Number(summary.overdue_balance || 0),
                    overdueCount: Number(summary.overdue_count || 0),
                    paymentCount: Number(payments.payment_count || 0)
                },

                debtStatus: {
                    totalRecords: Number(statuses.total_records || 0),
                    paid: Number(statuses.paid_count || 0),
                    cancelled: Number(statuses.cancelled_count || 0),
                    overdue: Number(statuses.overdue_count || 0),
                    partiallyPaid: Number(statuses.partially_paid_count || 0),
                    unpaid: Number(statuses.unpaid_count || 0)
                },

                filters: {
                    startDate: startDate || null,
                    endDate: endDate || null
                }
            }
        });

    } catch (error) {
        console.error("Financial summary error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate financial summary."
        });
    }
};



// ==========================================
// GET PAYMENT HISTORY
// ==========================================

const getPaymentHistory = async (req, res) => {
    try {
        const businessId = req.user.business_id;

        const dates = getDateFilters(req, res);
        if (!dates) return;

        const { startDate, endDate } = dates;

        // Pagination
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(
            100,
            Math.max(1, parseInt(req.query.limit, 10) || 10)
        );

        const offset = (page - 1) * limit;

        const search = (req.query.search || "").trim();

        // Build filters safely
        let conditions = " WHERE dp.business_id = ?";
        const params = [businessId];

        if (startDate) {
            conditions += " AND dp.payment_date >= ?";
            params.push(`${startDate} 00:00:00`);
        }

        if (endDate) {
            conditions += " AND dp.payment_date < DATE_ADD(?, INTERVAL 1 DAY)";
            params.push(endDate);
        }

        if (search) {
            conditions += `
                AND (
                    c.full_name LIKE ?
                    OR c.phone_number LIKE ?
                    OR d.description LIKE ?
                    OR bu.full_name LIKE ?
                )
            `;

            const searchValue = `%${search}%`;

            params.push(
                searchValue,
                searchValue,
                searchValue,
                searchValue
            );
        }

        // Get total number of matching payments
        const [countRows] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM debt_payments dp
            INNER JOIN debts d
                ON dp.debt_id = d.debt_id
                AND dp.business_id = d.business_id
            INNER JOIN customers c
                ON d.customer_id = c.customer_id
                AND d.business_id = c.business_id
            LEFT JOIN business_users bu
                ON dp.recorded_by = bu.user_id
                AND dp.business_id = bu.business_id
            ${conditions}
            `,
            params
        );

        const totalRecords = Number(countRows[0].total || 0);

        // Get payment records
        const [payments] = await db.query(
            `
            SELECT
                dp.payment_id,
                dp.debt_id,
                dp.amount_paid,
                dp.payment_date,
                dp.notes AS payment_notes,

                d.description AS debt_description,
                d.amount AS original_debt_amount,
                d.amount_paid AS total_debt_paid,
                d.remaining_amount,
                d.status AS debt_status,

                c.customer_id,
                c.full_name AS customer_name,
                c.phone_number,

                bu.user_id AS recorded_by_id,
                bu.full_name AS recorded_by_name

            FROM debt_payments dp

            INNER JOIN debts d
                ON dp.debt_id = d.debt_id
                AND dp.business_id = d.business_id

            INNER JOIN customers c
                ON d.customer_id = c.customer_id
                AND d.business_id = c.business_id

            LEFT JOIN business_users bu
                ON dp.recorded_by = bu.user_id
                AND dp.business_id = bu.business_id

            ${conditions}

            ORDER BY dp.payment_date DESC, dp.payment_id DESC

            LIMIT ? OFFSET ?
            `,
            [...params, limit, offset]
        );

        res.status(200).json({
            success: true,
            data: payments,
            pagination: {
                currentPage: page,
                limit,
                totalRecords,
                totalPages: Math.ceil(totalRecords / limit)
            },
            filters: {
                startDate: startDate || null,
                endDate: endDate || null,
                search
            }
        });

    } catch (error) {
        console.error("Payment history error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve payment history."
        });
    }
};


module.exports = {
    getFinancialSummary,
    getPaymentHistory
};
