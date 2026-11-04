
const db = require("../config/db");

// Fetch logs for the authenticated business only
const getBusinessActivity = async (req, res) => {
    try {
        const businessId = req.user.business_id;

        if (!businessId) {
            return res.status(401).json({
                success: false,
                message: "Business ID missing from authentication token."
            });
        }

        const limit = Math.min(
            Math.max(parseInt(req.query.limit, 10) || 50, 1),
            100
        );
        const offset = Math.max(
            parseInt(req.query.offset, 10) || 0,
            0
        );

        const [logs] = await db.query(
            `SELECT
                log_id,
                user_id,
                action,
                entity_type,
                entity_id,
                description,
                created_at
             FROM activity_logs
             WHERE business_id = ?
             ORDER BY created_at DESC, log_id DESC
             LIMIT ? OFFSET ?`,
            [businessId, limit, offset]
        );

        return res.status(200).json({
            success: true,
            data: logs
        });
    } catch (error) {
        console.error("Get business activity error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve business activity."
        });
    }
};

// Reusable logger for business controllers
const logActivity = async ({
    businessId,
    userId,
    action,
    entityType,
    entityId = null,
    description
}) => {
    if (!businessId || !userId || !action || !entityType || !description) {
        throw new Error("Missing required business activity information.");
    }

    const [result] = await db.query(
        `INSERT INTO activity_logs
            (business_id, user_id, action, entity_type, entity_id, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
            businessId,
            userId,
            action,
            entityType,
            entityId,
            description
        ]
    );

    return result.insertId;
};

module.exports = {
    getBusinessActivity,
    logActivity
};
