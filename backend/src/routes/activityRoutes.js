
const express = require("express");
const router = express.Router();

const businessAuth = require("../middlewares/businessAuth");
const {
    getBusinessActivity
} = require("../controllers/activityController");

router.get("/", businessAuth, getBusinessActivity);

module.exports = router;
