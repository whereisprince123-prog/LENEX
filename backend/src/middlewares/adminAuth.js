const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
    try {
        const token = req.cookies?.lenex_admin_token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please log in as an administrator"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.type !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        req.admin = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired admin session"
        });
    }
};

module.exports = adminAuth;