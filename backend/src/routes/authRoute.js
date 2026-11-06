const express = require("express");
const adminAuth = require("../middlewares/adminAuth.js");
const {
    businessLoginLimiter,
    adminLoginLimiter
} = require("../middlewares/authRateLimiter.js");
const {
    registerBusiness,
    loginAdmin,
    businessLogin,
    logoutBusiness,
    logoutAdmin,
    getBusinessProfile,
    getAdminProfile
} = require("../controllers/authController");
const businessAuth = require("../middlewares/businessAuth.js");
const router = express.Router();


// ================================
// ADMIN AUTH
// ================================

router.post("/admin/login", adminLoginLimiter, loginAdmin);
router.post("/admin/logout", logoutAdmin);
router.get("/admin/me", adminAuth, getAdminProfile);
// ================================
// BUSINESS AUTH
// ================================

router.post("/business/register", registerBusiness);
router.post("/business/login", businessLoginLimiter, businessLogin);
router.post("/business/logout", logoutBusiness);
router.get("/business/me", businessAuth, getBusinessProfile);


module.exports = router;