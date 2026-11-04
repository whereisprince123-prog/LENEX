import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import adminApi from "../services/adminApi";

const AdminProtectedRoute = () => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const verifyAdmin = async () => {
            try {
                const response = await adminApi.get("/auth/admin/me");

                if (response.data.success) {
                    localStorage.setItem(
                        "lenex_admin",
                        JSON.stringify(response.data.admin)
                    );

                    setAuthenticated(true);
                }
            } catch (error) {
                console.error(
                    "Admin authentication error:",
                    error.response?.data || error.message
                );

                localStorage.removeItem("lenex_admin");
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        verifyAdmin();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">
                    Verifying admin session...
                </p>
            </div>
        );
    }

    if (!authenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;