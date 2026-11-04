
const express = require("express");
const router = express.Router();

const adminAuth = require("../middlewares/adminAuth");
const {
    getAdminActivity
} = require("../controllers/adminActivityController");

router.get("/", adminAuth, getAdminActivity);

module.exports = router;
