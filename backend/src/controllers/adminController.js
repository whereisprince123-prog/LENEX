const db = require("../config/db");
const bcrypt = require("bcryptjs");

// Get all businesses
const getAllBusinesses = async (req, res) => {
    try {
        const [businesses] = await db.query(`
            SELECT
                b.business_id,
                b.business_name,
                b.business_phone,
                b.business_email,
                b.business_address,
                b.status,
                b.created_at,
                COUNT(DISTINCT bu.user_id) AS total_users,
                COUNT(DISTINCT c.customer_id) AS total_customers,
                COUNT(DISTINCT d.debt_id) AS total_debts
            FROM businesses b
            LEFT JOIN business_users bu
                ON b.business_id = bu.business_id
            LEFT JOIN customers c
                ON b.business_id = c.business_id
            LEFT JOIN debts d
                ON b.business_id = d.business_id
            GROUP BY b.business_id
            ORDER BY b.created_at DESC
        `);

        res.status(200).json({
            success: true,
            data: businesses
        });

    } catch (error) {
        console.error("Get businesses error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve businesses"
        });
    }
};


// Get one business
const getBusinessById = async (req, res) => {
    try {
        const { id } = req.params;

        const [businesses] = await db.query(
            `
            SELECT
                business_id,
                business_name,
                business_phone,
                business_email,
                business_address,
                status,
                created_at,
                updated_at
            FROM businesses
            WHERE business_id = ?
            `,
            [id]
        );

        if (businesses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        res.status(200).json({
            success: true,
            data: businesses[0]
        });

    } catch (error) {
        console.error("Get business error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve business"
        });
    }
};


// Update business status
const updateBusinessStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "PENDING",
            "ACTIVE",
            "SUSPENDED",
            "INACTIVE"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid business status"
            });
        }

        const [result] = await db.query(
            `
            UPDATE businesses
            SET status = ?
            WHERE business_id = ?
            `,
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        
await db.query(
    `INSERT INTO admin_activity_logs
        (
            admin_id,
            action,
            entity_type,
            entity_id,
            description,
            ip_address,
            user_agent
        )
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
        req.admin.admin_id,
        "BUSINESS_STATUS_UPDATED",
        "BUSINESS",
        String(id),
        `Changed business ${id} status to ${status}`,
        req.ip || null,
        req.get("user-agent")?.slice(0, 500) || null
    ]
);


        res.status(200).json({
            success: true,
            message: `Business status changed to ${status}`
        });

    } catch (error) {
        console.error("Update business status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update business status"
        });
    }
};


// Get platform statistics
const getPlatformStats = async (req, res) => {
    try {
        const [[businessStats]] = await db.query(`
            SELECT COUNT(*) AS total_businesses
            FROM businesses
        `);

        const [[customerStats]] = await db.query(`
            SELECT COUNT(*) AS total_customers
            FROM customers
        `);

        const [[debtStats]] = await db.query(`
            SELECT
                COUNT(*) AS total_debts,
                COALESCE(SUM(amount), 0) AS total_debt_amount
            FROM debts
        `);

        const [[paidStats]] = await db.query(`
            SELECT
                COUNT(*) AS paid_debts,
                COALESCE(SUM(amount), 0) AS paid_amount
            FROM debts
            WHERE status = 'PAID'
        `);

        res.status(200).json({
            success: true,
            data: {
                total_businesses: businessStats.total_businesses,
                total_customers: customerStats.total_customers,
                total_debts: debtStats.total_debts,
                total_debt_amount: debtStats.total_debt_amount,
                paid_debts: paidStats.paid_debts,
                paid_amount: paidStats.paid_amount
            }
        });

    } catch (error) {
        console.error("Platform statistics error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve platform statistics"
        });
    }
};



const getAdminActivity = async (req, res) => {
    try {
        const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
        const limit = Math.min(
            100,
            Math.max(1, Number.parseInt(req.query.limit, 10) || 20)
        );
        const offset = (page - 1) * limit;

        const action = String(req.query.action || "").trim();
        const search = String(req.query.search || "").trim();

        const conditions = [];
        const params = [];

        if (action) {
            conditions.push("l.action = ?");
            params.push(action);
        }

        if (search) {
            conditions.push(`(
                l.description LIKE ?
                OR l.entity_type LIKE ?
                OR l.action LIKE ?
                OR a.full_name LIKE ?
                OR a.email LIKE ?
            )`);

            const term = `%${search}%`;
            params.push(term, term, term, term, term);
        }

        const whereClause = conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

        const [logs] = await db.query(
            `SELECT
                l.log_id,
                l.admin_id,
                a.full_name AS admin_name,
                a.email AS admin_email,
                l.action,
                l.entity_type,
                l.entity_id,
                l.description,
                l.ip_address,
                l.created_at
             FROM admin_activity_logs l
             LEFT JOIN admins a ON a.admin_id = l.admin_id
             ${whereClause}
             ORDER BY l.created_at DESC, l.log_id DESC
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        const [[countResult]] = await db.query(
            `SELECT COUNT(*) AS total
             FROM admin_activity_logs l
             LEFT JOIN admins a ON a.admin_id = l.admin_id
             ${whereClause}`,
            params
        );

        const total = Number(countResult.total);

        res.status(200).json({
            success: true,
            data: logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Get admin activity error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve admin activity"
        });
    }
};
    

// GET ALL ADMINISTRATORS
const getAllAdministrators = async (req, res) => {
    try {
        const { search = "" } = req.query;

        const [admins] = await db.query(
            `SELECT
                admin_id,
                full_name,
                email,
                role,
                is_active,
                created_at,
                updated_at
             FROM admins
             WHERE full_name LIKE ?
                OR email LIKE ?
             ORDER BY created_at DESC`,
            [`%${search}%`, `%${search}%`]
        );

        res.status(200).json({
            success: true,
            data: admins
        });
    } catch (error) {
        console.error("Get administrators error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve administrators"
        });
    }
};


// CREATE A NEW ADMINISTRATOR
const createAdministrator = async (req, res) => {
    try {
        // Only a super-admin can create other administrators.
        if (req.admin.role !== "SUPER_ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Only a super-admin can create administrators"
            });
        }

        const { full_name, email, password, role } = req.body;

        if (!full_name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (!["SUPER_ADMIN", "ADMIN"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid administrator role"
            });
        }

        if (full_name.trim().length > 100 ||
            email.trim().length > 150) {
            return res.status(400).json({
                success: false,
                message: "Name or email is too long"
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const [existing] = await db.query(
            "SELECT admin_id FROM admins WHERE email = ?",
            [normalizedEmail]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "An administrator with this email already exists"
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const [result] = await db.query(
            `INSERT INTO admins
                (full_name, email, password_hash, role, is_active)
             VALUES (?, ?, ?, ?, 1)`,
            [
                full_name.trim(),
                normalizedEmail,
                passwordHash,
                role
            ]
        );

        res.status(201).json({
            success: true,
            message: "Administrator created successfully",
            data: {
                admin_id: result.insertId,
                full_name: full_name.trim(),
                email: normalizedEmail,
                role,
                is_active: 1
            }
        });
    } catch (error) {
        console.error("Create administrator error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create administrator"
        });
    }
};


// ACTIVATE OR DEACTIVATE AN ADMINISTRATOR
const updateAdministratorStatus = async (req, res) => {
    try {
        if (req.admin.role !== "SUPER_ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Only a super-admin can change administrator status"
            });
        }

        const { id } = req.params;
        const { is_active } = req.body;

        if (!/^\d+$/.test(id) || Number(id) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid administrator ID"
            });
        }

        if (is_active !== true && is_active !== false &&
            is_active !== 1 && is_active !== 0) {
            return res.status(400).json({
                success: false,
                message: "is_active must be true, false, 1, or 0"
            });
        }

        const activeValue = Number(is_active);

        const [admins] = await db.query(
            `SELECT admin_id, role, is_active
             FROM admins
             WHERE admin_id = ?`,
            [id]
        );

        if (admins.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Administrator not found"
            });
        }

        const target = admins[0];

        // Prevent an administrator from deactivating their own account.
        if (
            String(target.admin_id) === String(req.admin.admin_id) &&
            activeValue === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "You cannot deactivate your own account"
            });
        }

        // Never allow the last active super-admin to be deactivated.
        if (
            target.role === "SUPER_ADMIN" &&
            Number(target.is_active) === 1 &&
            activeValue === 0
        ) {
            const [activeSuperAdmins] = await db.query(
                `SELECT COUNT(*) AS total
                 FROM admins
                 WHERE role = 'SUPER_ADMIN'
                   AND is_active = 1`
            );

            if (Number(activeSuperAdmins[0].total) <= 1) {
                return res.status(400).json({
                    success: false,
                    message: "The last active super-admin cannot be deactivated"
                });
            }
        }

        await db.query(
            `UPDATE admins
             SET is_active = ?
             WHERE admin_id = ?`,
            [activeValue, id]
        );

        res.status(200).json({
            success: true,
            message: activeValue
                ? "Administrator activated successfully"
                : "Administrator deactivated successfully"
        });
    } catch (error) {
        console.error("Update administrator status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update administrator status"
        });
    }
};


// UPDATE ADMIN PROFILE
const updateAdminProfile = async (req, res) => {
    try {
        const adminId = req.admin.admin_id;
        const { full_name, email } = req.body;

        if (
            typeof full_name !== "string" ||
            typeof email !== "string" ||
            !full_name.trim() ||
            !email.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Full name and email are required"
            });
        }

        const name = full_name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        if (name.length > 100 || normalizedEmail.length > 150) {
            return res.status(400).json({
                success: false,
                message: "Name or email is too long"
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        const [existing] = await db.query(
            `SELECT admin_id
             FROM admins
             WHERE email = ? AND admin_id <> ?`,
            [normalizedEmail, adminId]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "That email is already in use"
            });
        }

        const [result] = await db.query(
            `UPDATE admins
             SET full_name = ?, email = ?
             WHERE admin_id = ? AND is_active = 1`,
            [name, normalizedEmail, adminId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Active administrator account not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                admin_id: adminId,
                full_name: name,
                email: normalizedEmail
            }
        });
    } catch (error) {
        console.error("Update admin profile error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
};


// CHANGE ADMIN PASSWORD
const changeAdminPassword = async (req, res) => {
    try {
        const adminId = req.admin.admin_id;
        const { current_password, new_password } = req.body;

        if (
            typeof current_password !== "string" ||
            typeof new_password !== "string" ||
            !current_password ||
            !new_password
        ) {
            return res.status(400).json({
                success: false,
                message: "Current and new passwords are required"
            });
        }

        if (new_password.length < 8 || new_password.length > 72) {
            return res.status(400).json({
                success: false,
                message: "New password must be 8–72 characters long"
            });
        }

        const [admins] = await db.query(
            `SELECT password_hash
             FROM admins
             WHERE admin_id = ? AND is_active = 1`,
            [adminId]
        );

        if (admins.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Active administrator account not found"
            });
        }

        const passwordMatches = await bcrypt.compare(
            current_password,
            admins[0].password_hash
        );

        if (!passwordMatches) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        const samePassword = await bcrypt.compare(
            new_password,
            admins[0].password_hash
        );

        if (samePassword) {
            return res.status(400).json({
                success: false,
                message: "Choose a password different from your current one"
            });
        }

        const passwordHash = await bcrypt.hash(new_password, 12);

        await db.query(
            `UPDATE admins
             SET password_hash = ?
             WHERE admin_id = ?`,
            [passwordHash, adminId]
        );

        res.status(200).json({
            success: true,
            message: "Password changed successfully. Please sign in again."
        });
    } catch (error) {
        console.error("Change admin password error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to change password"
        });
    }
};


module.exports = {
    getAllBusinesses,
    getBusinessById,
    updateBusinessStatus,
    getPlatformStats,
    getAdminActivity,
    getAllAdministrators,
    createAdministrator,
    updateAdministratorStatus,
    updateAdminProfile,
    changeAdminPassword
};