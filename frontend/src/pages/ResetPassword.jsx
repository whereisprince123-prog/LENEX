import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const strongPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (!token) {
            setError("Your password reset link is missing its token.");
            return;
        }

        if (!strongPassword.test(password)) {
            setError(
                "Password must contain at least 8 characters, including uppercase, lowercase, a number and a special character."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Your passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/auth/business/reset-password",
                {
                    token,
                    password,
                }
            );

            setMessage(
                response.data.message ||
                "Your password has been reset successfully."
            );

            setPassword("");
            setConfirmPassword("");

            // Give the user time to read the success message.
            setTimeout(() => {
                navigate("/login");
            }, 2500);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to reset your password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 dark:bg-slate-950 dark:text-white">
            <div className="mx-auto flex min-h-[75vh] max-w-md items-center justify-center">
                <div className="w-full rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-9">

                    {/* Logo and heading */}
                    <div className="mb-8 text-center">
                        <Link
                            to="/"
                            className="text-3xl font-bold tracking-tight text-blue-600"
                        >
                            LENEX
                        </Link>

                        <h1 className="mt-6 text-2xl font-bold">
                            Create a new password
                        </h1>

                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Enter your new password below to regain access
                            to your LENEX account.
                        </p>
                    </div>

                    {/* Missing token */}
                    {!token && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                            Your reset link is invalid or incomplete.
                            Please request a new password reset link.
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div
                            role="alert"
                            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                        >
                            {error}
                        </div>
                    )}

                    {/* Success message */}
                    {message && (
                        <div
                            role="status"
                            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
                        >
                            {message}
                            <p className="mt-1">
                                Redirecting you to login...
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* New password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium"
                            >
                                New password
                            </label>

                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    autoComplete="new-password"
                                    required
                                    disabled={!token || loading || !!message}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-20 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-blue-900"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-blue-600"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Confirm password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-2 block text-sm font-medium"
                            >
                                Confirm new password
                            </label>

                            <input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                                required
                                disabled={!token || loading || !!message}
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-blue-900"
                            />
                        </div>

                        {/* Password requirements */}
                        <div className="rounded-lg bg-slate-50 p-3 text-xs leading-6 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            Your password must have:
                            <ul className="ml-4 list-disc">
                                <li>At least 8 characters</li>
                                <li>One uppercase and one lowercase letter</li>
                                <li>At least one number</li>
                                <li>At least one special character</li>
                            </ul>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={!token || loading || !!message}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Resetting password..." : "Reset password"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;