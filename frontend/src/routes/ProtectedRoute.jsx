
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../services/api.js";

const ProtectedRoute = () => {
    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        const verifySession = async () => {
            try {
                // Ask the backend to verify the business session.
                await api.get("/auth/business/me");
                setAuthenticated(true);
            } catch (error) {
                console.error(
                    "Session verification failed:",
                    error.response?.data || error.message
                );
                setAuthenticated(false);
            }
        };

        verifySession();
    }, []);

    if (authenticated === null) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-gray-500">
                    Verifying your session...
                </p>
            </div>
        );
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
