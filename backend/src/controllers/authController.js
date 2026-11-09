const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidRwandaPhone = (phone) => {
    return /^07\d{8}$/.test(phone);
};

const isAtLeast18 = (dateOfBirth) => {
    if (!dateOfBirth || !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
        return false;
    }

    const dob = new Date(`${dateOfBirth}T00:00:00`);
    const today = new Date();

    if (Number.isNaN(dob.getTime()) || dob >= today) {
        return false;
    }

    let age = today.getFullYear() - dob.getFullYear();

    const birthdayHasNotOccurred =
        today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() &&
         today.getDate() < dob.getDate());

    if (birthdayHasNotOccurred) age--;

    return age >= 18;
};



const registerBusiness = async (req, res) => {
    let connection;
    let transactionStarted = false;

    try {
        const {
            business_name,
            business_phone,
            business_email,
            business_address,
            full_name,
            date_of_birth,
            email,
            phone_number,
            password
        } = req.body;

        // 1. Required fields
        if (
            !business_name?.trim() ||
            !business_phone ||
            !full_name?.trim() ||
            !date_of_birth ||
            !email ||
            !phone_number ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // 2. Validate email addresses
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedBusinessEmail = business_email?.trim().toLowerCase();

        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid owner email address"
            });
        }

        if (
            normalizedBusinessEmail &&
            !isValidEmail(normalizedBusinessEmail)
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid business email address"
            });
        }

        // 3. Validate phone numbers
        if (!isValidRwandaPhone(business_phone)) {
            return res.status(400).json({
                success: false,
                message: "Business phone must contain exactly 10 digits and start with 07"
            });
        }

        if (!isValidRwandaPhone(phone_number)) {
            return res.status(400).json({
                success: false,
                message: "Owner phone must contain exactly 10 digits and start with 07"
            });
        }

        // 4. Validate age
        if (!isAtLeast18(date_of_birth)) {
            return res.status(400).json({
                success: false,
                message: "You must be at least 18 years old to register"
            });
        }

        // 5. Validate password strength
        const strongPassword =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/;

        if (!strongPassword.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters, including uppercase, lowercase, a number and a special character"
            });
        }

        // 6. Check duplicate business email
        if (normalizedBusinessEmail) {
            const [existingBusiness] = await db.query(
                `SELECT business_id
                 FROM businesses
                 WHERE LOWER(business_email) = ?
                 LIMIT 1`,
                [normalizedBusinessEmail]
            );

            if (existingBusiness.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Business email already exists"
                });
            }
        }

        // 7. Check duplicate owner email
        const [existingUser] = await db.query(
            `SELECT user_id
             FROM business_users
             WHERE LOWER(email) = ?
             LIMIT 1`,
            [normalizedEmail]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        // 8. Hash password
        const password_hash = await bcrypt.hash(password, 12);

        // 9. Start transaction
        connection = await db.getConnection();
        await connection.beginTransaction();
        transactionStarted = true;

        // 10. Create business
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
                business_name.trim(),
                business_phone,
                normalizedBusinessEmail || null,
                business_address?.trim() || null
            ]
        );

        const business_id = businessResult.insertId;

        // 11. Create business owner
        const [userResult] = await connection.query(
            `INSERT INTO business_users
            (
                business_id,
                full_name,
                date_of_birth,
                email,
                phone_number,
                password_hash,
                role
            )
            VALUES (?, ?, ?, ?, ?, ?, 'OWNER')`,
            [
                business_id,
                full_name.trim(),
                date_of_birth,
                normalizedEmail,
                phone_number,
                password_hash
            ]
        );

        const user_id = userResult.insertId;

        // 12. Commit transaction
        await connection.commit();
        transactionStarted = false;

        return res.status(201).json({
            success: true,
            message: "Business registered successfully",
            data: {
                business_id,
                user_id,
                business_name: business_name.trim(),
                owner_name: full_name.trim(),
                email: normalizedEmail,
                role: "OWNER"
            }
        });

    } catch (error) {
        if (connection && transactionStarted) {
            await connection.rollback();
        }

        console.error("Business registration error:", error);

        return res.status(500).json({
            success: false,
            message: "Business registration failed. Please try again."
        });

    } finally {
        if (connection) {
            connection.release();
        }
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


// =====================================
// FORGOT BUSINESS PASSWORD
// =====================================

const forgotBusinessPassword = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        // Find the business user
        const [users] = await db.query(
            `SELECT user_id, full_name, email
             FROM business_users
             WHERE LOWER(email) = ?
             AND is_active = TRUE
             LIMIT 1`,
            [email]
        );

        // Always return a generic response for unknown emails
        const genericMessage =
            "If an active account exists with that email, password reset instructions will be sent.";

        if (users.length === 0) {
            return res.status(200).json({
                success: true,
                message: genericMessage
            });
        }

        const user = users[0];

        // Generate a secure random token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Store only the SHA-256 hash
        const tokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Remove previous unused reset tokens for this user
        await db.query(
            `DELETE FROM password_reset_tokens
             WHERE user_id = ? AND used_at IS NULL`,
            [user.user_id]
        );

        // Save the token with a 15-minute expiry
        await db.query(
            `INSERT INTO password_reset_tokens
             (user_id, token_hash, expires_at)
             VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 15 MINUTE))`,
            [user.user_id, tokenHash]
        );

        // Build the frontend reset link
        const resetLink =
            `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        // // Send the reset email
        // await sendEmail({
        //     to: user.email,
        //     subject: "Reset your LENEX password",
        //     html: `
        //         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        //             <h2>Password Reset Request</h2>

        //             <p>Hello ${user.full_name},</p>

        //             <p>
        //                 We received a request to reset your LENEX account password.
        //             </p>

        //             <p>
        //                 Click the button below to create a new password.
        //             </p>

        //             <a href="${resetLink}"
        //                style="display:inline-block; background:#2563eb; color:white;
        //                padding:12px 24px; text-decoration:none; border-radius:6px;">
        //                 Reset Password
        //             </a>

        //             <p>This link expires in 15 minutes and can only be used once.</p>

        //             <p>If you did not request this reset, you can ignore this email.</p>

        //             <p>LENEX Support Team</p>
        //         </div>
        //     `
        // });

        // Send the reset email
console.log("Password reset email attempt:", user.email);

const emailResult = await sendEmail({
    to: user.email,
    subject: "Reset your LENEX password",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h2>Password Reset Request</h2>
            <p>Hello ${user.full_name},</p>
            <p>We received a request to reset your LENEX account password.</p>
            <p>Click the button below to create a new password.</p>
            <a href="${resetLink}"
               style="display:inline-block; background:#2563eb; color:white;
               padding:12px 24px; text-decoration:none; border-radius:6px;">
                Reset Password
            </a>
            <p>This link expires in 15 minutes and can only be used once.</p>
            <p>If you did not request this reset, you can ignore this email.</p>
            <p>LENEX Support Team</p>
        </div>
    `
});

console.log("Resend response:", emailResult);

        return res.status(200).json({
            success: true,
            message: genericMessage
        });

    } catch (error) {
        console.error("Forgot password error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to process your request. Please try again later."
        });
    }
};


// =====================================
// RESET BUSINESS PASSWORD
// =====================================

const resetBusinessPassword = async (req, res) => {
    let connection;

    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: "Reset token and new password are required"
            });
        }

        // Apply the same password-strength rules as registration
        const strongPassword =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/;

        if (!strongPassword.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters, including uppercase, lowercase, a number and a special character"
            });
        }

        // Hash the submitted token
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        connection = await db.getConnection();
        await connection.beginTransaction();

        // Lock the reset record to prevent simultaneous token use
        const [records] = await connection.query(
            `SELECT reset_id, user_id
             FROM password_reset_tokens
             WHERE token_hash = ?
             AND used_at IS NULL
             AND expires_at > UTC_TIMESTAMP()
             LIMIT 1
             FOR UPDATE`,
            [tokenHash]
        );

        if (records.length === 0) {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "This password reset link is invalid or has expired"
            });
        }

        const resetRecord = records[0];

        // Hash the new password
        const passwordHash = await bcrypt.hash(password, 12);

        // Update the business user's password
        await connection.query(
            `UPDATE business_users
             SET password_hash = ?
             WHERE user_id = ?`,
            [passwordHash, resetRecord.user_id]
        );

        // Mark this token as used
        await connection.query(
            `UPDATE password_reset_tokens
             SET used_at = UTC_TIMESTAMP()
             WHERE reset_id = ?`,
            [resetRecord.reset_id]
        );

        // Invalidate any other outstanding reset links
        await connection.query(
            `DELETE FROM password_reset_tokens
             WHERE user_id = ?
             AND reset_id != ?`,
            [resetRecord.user_id, resetRecord.reset_id]
        );

        await connection.commit();

        return res.status(200).json({
            success: true,
            message: "Your password has been reset successfully. Please log in with your new password."
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error("Reset password error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to reset your password. Please try again."
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
};

module.exports = {
    registerBusiness,
    loginAdmin,
    businessLogin,
    logoutBusiness,
    logoutAdmin,
    getBusinessProfile,
    getAdminProfile,
    forgotBusinessPassword,
    resetBusinessPassword
};