const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const authRoutes = require("./routes/authRoute.js");
const adminRoutes = require("./routes/adminRoute.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");
const customerRoutes = require("./routes/customerRoutes.js");
const debtRoutes = require("./routes/debtRoutes.js");

const activityRoutes = require("./routes/activityRoutes.js");
const adminActivityRoutes = require("./routes/adminActivityRoutes.js");
const settingsRoutes = require("./routes/settingsRoute");
const reportRoutes = require("./routes/reportRoutes.js");


const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

const allowedOrigins = [
    "http://localhost:5173",
    "https://lenex.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


// =====================================================
// TEST API
// =====================================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LENEX API is running"
    });
});


// =====================================================
// TEST DATABASE CONNECTION
// =====================================================

app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT DATABASE() AS name");

        res.status(200).json({
            success: true,
            message: "MySQL database connected successfully",
            database: rows[0].name
        });

    } catch (error) {
        console.error(
            "Database connection error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message
        });
    }
});


// =====================================================
// API ROUTES
// =====================================================

// Authentication
app.use("/api/auth", authRoutes);

// LENEX Admin
app.use("/api/admin", adminRoutes);

// Business Dashboard
app.use("/api/dashboard", dashboardRoutes);

// Customer Management
app.use("/api/customers", customerRoutes);

// Debt Management
app.use("/api/debts", debtRoutes);

// Business Activity Logs
app.use("/api/activity", activityRoutes);

// LENEX Admin Activity Logs
app.use("/api/admin/activity", adminActivityRoutes);

// Settings
app.use("/api/settings", settingsRoutes);

// Reports
app.use("/api/reports", reportRoutes);


// =====================================================
// SERVER
// =====================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`LENEX server running on port ${PORT}`);
});