const express = require("express");

const adminAuth = require("../middlewares/adminAuth.js");

const {
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
} = require("../controllers/adminController");
const {
    getPlatformSettings,
    updatePlatformSettings
} = require("../controllers/settingsController");
const router = express.Router();


// Protect ALL admin routes
router.use(adminAuth);


// Business management
router.get("/businesses", getAllBusinesses);

router.get("/businesses/:id", getBusinessById);

router.patch(
    "/businesses/:id/status",
    updateBusinessStatus
);


// Platform statistics
router.get("/stats", getPlatformStats);

// Admin activity logs
router.get("/activity", getAdminActivity);

router.get("/administrators", getAllAdministrators);

router.post("/administrators", createAdministrator);

router.patch(
    "/administrators/:id/status",
    updateAdministratorStatus
);


router.patch("/profile", updateAdminProfile);
router.patch("/password", changeAdminPassword);



const superAdminOnly = (req, res, next) => {
    if (req.admin.role !== "SUPER_ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Only Super Admin can manage platform settings"
        });
    }

    next();
};

router.get(
    "/settings/platform",
    superAdminOnly,
    getPlatformSettings
);

router.patch(
    "/settings/platform",
    superAdminOnly,
    updatePlatformSettings
);







module.exports = router;