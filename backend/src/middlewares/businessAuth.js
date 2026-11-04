const jwt = require("jsonwebtoken");

const businessAuth = (req, res, next) => {
    try {
        // Read the token from the HttpOnly cookie
        const token = req.cookies?.lenex_token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please log in to continue"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.type !== "business") {
            return res.status(403).json({
                success: false,
                message: "Business access required"
            });
        }

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired session"
        });
    }
};

module.exports = businessAuth;