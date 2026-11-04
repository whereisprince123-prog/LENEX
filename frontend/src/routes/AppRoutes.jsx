import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";

import Home from "../pages/public/Home.jsx";
import Login from "../pages/public/Login.jsx";
import Register from "../pages/public/Register.jsx";

import DashboardLayout from "../components/layouts/DashboardLayout.jsx";

import Dashboard from "../pages/Dashboard.jsx";
import Customers from "../pages/Customers.jsx";
import Debts from "../pages/Debts.jsx";
import Overdue from "../pages/Overdue.jsx";
import PaidDebts from "../pages/PaidDebt.jsx";
import Activity from "../pages/Activity.jsx";
import Settings from "../pages/Settings.jsx";
import FAQ from "../pages/public/FAQ.jsx";
import NotFound from "../pages/NotFound";

import AdminLogin from "../pages/admin/AdminLogin.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminProtectedRoute from "./AdminProtectedRoute.jsx";
import AdminLayout from "../components/layouts/AdminLayout.jsx";
import Businesses from "../pages/admin/Businesses.jsx";
import ActivityLogs from "../pages/admin/ActivityLogs.jsx";
import Administrators from "../pages/admin/Administrators.jsx";
import AdminSettings from "../pages/admin/AdminSettings.jsx";
import Reports from "../pages/Reports.jsx";
const AppRoutes = () => {
    return (
        <Routes>

            {/* Public pages */}
            <Route path="/" element={<Home />} />

            <Route
                path="/login"
                element={<Login />}
            />
            <Route
                path="/register"
                element={<Register />}
            />

            
<Route path="/faq" element={<FAQ />} />

            {/* Protected Business Dashboard */}
<Route element={<ProtectedRoute />}>
    <Route
        path="/dashboard"
        element={<DashboardLayout />}
    >
        <Route
            index
            element={<Dashboard />}
        />

        <Route
            path="customers"
            element={<Customers />}
        />

        <Route
            path="debts"
            element={<Debts />}
        />

        <Route
            path="overdue"
            element={<Overdue />}
        />

        <Route
            path="paid"
            element={<PaidDebts />}
        />
         <Route path="reports" element={<Reports />}/>

        <Route
            path="activity"
            element={<Activity />}
        />

        <Route
            path="settings"
            element={<Settings />}
        />
    </Route>
</Route>



{/* Admin login */}
<Route path="/admin/login" element={<AdminLogin />} />

{/* Protected admin portal */}
<Route element={<AdminProtectedRoute />}>
    <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="businesses" element={<Businesses />} />
        <Route path="activity" element={<ActivityLogs />} />
        <Route path="administrators" element={<Administrators />} />
        <Route path="settings" element={<AdminSettings />} />
       
    </Route>
</Route>




    <Route path="*" element={<NotFound />} />
        </Routes>

        
    );
};

export default AppRoutes;