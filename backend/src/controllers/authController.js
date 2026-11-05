const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");


const registerBusiness = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const {
            business_name,
            business_phone,
            business_email,
            business_address,
            full_name,
            email,
            phone_number,
            password
        } = req.body;

        // 1. Validate required fields
        if (
            !business_name ||
            !business_phone ||
            !full_name ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // 2. Check if business email already exists
        if (business_email) {
            const [existingBusiness] = await db.query(
                "SELECT business_id FROM businesses WHERE business_email = ?",
                [business_email]
            );

            if (existingBusiness.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Business email already exists"
                });
            }
        }

        // 3. Check if owner email already exists
        const [existingUser] = await db.query(
            "SELECT user_id FROM business_users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        // 4. Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // 5. Start transaction
        await connection.beginTransaction();

        // 6. Create business
        const [businessResult] = await connection.query(
            `INSERT INTO businesses
            (
                business_name,
                business_phone,
                business_email,
                business_address,
                status
            )
            VALUES (?, ?, ?, ?, 'ACTIVE')`,
            [
                business_name,
                business_phone,
                business_email || null,
                business_address || null
            ]
        );

        const business_id = businessResult.insertId;

        // 7. Create business owner
        const [userResult] = await connection.query(
            `INSERT INTO business_users
            (
                business_id,
                full_name,
                email,
                phone_number,
                password_hash,
                role
            )
            VALUES (?, ?, ?, ?, ?, 'OWNER')`,
            [
                business_id,
                full_name,
                email,
                phone_number || null,
                password_hash
            ]
        );

        const user_id = userResult.insertId;

        // 8. Commit transaction
        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Business registered successfully",
            data: {
                business_id,
                user_id,
                business_name,
                owner_name: full_name,
                email,
                role: "OWNER"
            }
        });

    } catch (error) {

        // Rollback if something goes wrong
        await connection.rollback();

        console.error("Business registration error:", error);

        res.status(500).json({
            success: false,
            message: "Business registration failed",
            error: error.message
        });

    } finally {
        connection.release();
    }
};




const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find admin
        const [admins] = await db.query(
            `SELECT 
                admin_id,
                full_name,
                email,
                password_hash,
                role,
                is_active
             FROM admins
             WHERE email = ?
             LIMIT 1`,
            [email]
        );

        if (admins.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const admin = admins[0];

        // Check if admin is active
        if (!admin.is_active) {
            return res.status(403).json({
                success: false,
                message: "Admin account is inactive"
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            admin.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

      // Create admin JWT
const token = jwt.sign(
    {
        admin_id: admin.admin_id,
        email: admin.email,
        role: admin.role,
        type: "admin"
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    }
);

// Store token in a separate HttpOnly cookie
res.cookie("lenex_admin_token", token, {
     httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/"
});

// Return administrator information, not the token
return res.status(200).json({
    success: true,
    message: "Admin login successful",
    admin: {
        admin_id: admin.admin_id,
        full_name: admin.full_name,
        email: admin.email,
        role: admin.role
    }
});

    } catch (error) {
        console.error("Admin login error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

//business login
const businessLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find business user and business
        const [users] = await db.query(
            `SELECT
                bu.user_id,
                bu.business_id,
                bu.full_name,
                bu.email,
                bu.phone_number,
                bu.password_hash,
                bu.role,
                bu.is_active AS user_active,

                b.business_name,
                b.business_phone,
                b.business_email,
                b.status AS business_status

             FROM business_users bu

             INNER JOIN businesses b
                ON bu.business_id = b.business_id

             WHERE bu.email = ?

             LIMIT 1`,
            [email]
        );

        // User doesn't exist
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        // Check user status
        if (!user.user_active) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive"
            });
        }

        // Check business status
        if (user.business_status !== "ACTIVE") {
            return res.status(403).json({
                success: false,
                message: `Business account is ${user.business_status.toLowerCase()}`
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

      // Create business JWT
const token = jwt.sign(
    {
        user_id: user.user_id,
        business_id: user.business_id,
        email: user.email,
        role: user.role,
        type: "business"
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    }
);

// Store token in an HttpOnly cookie
res.cookie("lenex_token", token, {
     httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/"
});

// Return only non-secret account information
return res.status(200).json({
    success: true,
    message: "Business login successful",
    user: {
        user_id: user.user_id,
        business_id: user.business_id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role
    },
    business: {
        business_id: user.business_id,
        business_name: user.business_name,
        business_phone: user.business_phone,
        business_email: user.business_email
    }
});

    } catch (error) {
        console.error("Business login error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const logoutBusiness = (req, res) => {
    res.clearCookie("lenex_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/"
    });

    return res.status(200).json({
        success: true,
        message: "Business logged out successfully"
    });
};

const logoutAdmin = (req, res) => {
    res.clearCookie("lenex_admin_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/"
    });

    return res.status(200).json({
        success: true,
        message: "Admin logged out successfully"
    });
};





const getBusinessProfile = async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT
                bu.user_id,
                bu.business_id,
                bu.full_name,
                bu.email,
                bu.phone_number,
                bu.role,
                b.business_name,
                b.business_phone,
                b.business_email
             FROM business_users bu
             INNER JOIN businesses b
                ON bu.business_id = b.business_id
             WHERE bu.user_id = ?
             LIMIT 1`,
            [req.user.user_id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Business user not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Business session verified",
            user: {
                user_id: users[0].user_id,
                business_id: users[0].business_id,
                full_name: users[0].full_name,
                email: users[0].email,
                phone_number: users[0].phone_number,
                role: users[0].role
            },
            business: {
                business_id: users[0].business_id,
                business_name: users[0].business_name,
                business_phone: users[0].business_phone,
                business_email: users[0].business_email
            }
        });

    } catch (error) {
        console.error("Get business profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Could not verify business session"
        });
    }
};


const getAdminProfile = async (req, res) => {
    try {
        const [admins] = await db.query(
            `SELECT admin_id, full_name, email, role
             FROM admins
             WHERE admin_id = ? AND is_active = TRUE`,
            [req.admin.admin_id]
        );

        if (admins.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Admin account not found or inactive"
            });
        }

        return res.status(200).json({
            success: true,
            admin: admins[0]
        });

    } catch (error) {
        console.error("Get admin profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to verify admin session"
        });
    }
};

module.exports = {
    registerBusiness,
    loginAdmin,
    businessLogin,
    logoutBusiness,
    logoutAdmin,
    getBusinessProfile,
    getAdminProfile
};