const rateLimit = require("express-rate-limit");

// Business login: maximum 5 failed attempts per 15 minutes
const businessLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,

    message: {
        success: false,
        message: "Too many login attempts. Please try again after 15 minutes."
    }
});

// Admin login: maximum 5 failed attempts per 15 minutes
const adminLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,

    message: {
        success: false,
        message: "Too many admin login attempts. Please try again after 15 minutes."
    }
});


const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many password reset requests. Please try again later."
    }
});

const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many password reset attempts. Please try again later."
    }
});

module.exports = {
    businessLoginLimiter,
    adminLoginLimiter,
    forgotPasswordLimiter,
    resetPasswordLimiter
};