
const express = require("express");
const { getPublicSettings } = require("../controllers/settingsController");

const router = express.Router();

// Public route: no login required
router.get("/public", getPublicSettings);

module.exports = router;
