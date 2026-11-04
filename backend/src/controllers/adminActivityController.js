
const db = require("../config/db");

// Fetch logs for the authenticated admin
const getAdminActivity = async (req, res) => {
    try {
        const adminId = req.admin.admin_id;

        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: "Admin ID missing from authentication token."
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
                admin_id,
                action,
                entity_type,
                entity_id,
                description,
                created_at
             FROM admin_activity_logs
             WHERE admin_id = ?
             ORDER BY created_at DESC, log_id DESC
             LIMIT ? OFFSET ?`,
            [adminId, limit, offset]
        );

        return res.status(200).json({
            success: true,
            data: logs
        });
    } catch (error) {
        console.error("Get admin activity error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve admin activity."
        });
    }
};

// Reusable logger for admin controllers
const logAdminActivity = async ({
    adminId,
    action,
    entityType,
    entityId = null,
    description
}) => {
    if (!adminId || !action || !entityType || !description) {
        throw new Error("Missing required admin activity information.");
    }

    const [result] = await db.query(
        `INSERT INTO admin_activity_logs
            (admin_id, action, entity_type, entity_id, description)
         VALUES (?, ?, ?, ?, ?)`,
        [adminId, action, entityType, entityId, description]
    );

    return result.insertId;
};

module.exports = {
    getAdminActivity,
    logAdminActivity
};
