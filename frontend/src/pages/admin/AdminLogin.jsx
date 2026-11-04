
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff, LoaderCircle } from "lucide-react";
import adminApi from "../../services/adminApi";

const AdminLogin = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
        setError("Please enter your email and password.");
        return;
    }

  try {
    setLoading(true);

    const response = await adminApi.post("/auth/admin/login", {
        email: email.trim(),
        password,
    });

    const { admin } = response.data;

    if (!admin) {
        throw new Error("Invalid admin login response.");
    }

    // Store administrator information, not the JWT token.
    localStorage.setItem("lenex_admin", JSON.stringify(admin));

    navigate("/admin/dashboard", { replace: true });

} catch (err) {
    setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to sign in. Please try again."
    );
} finally {
    setLoading(false);
}
};

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-sm">
                        <ShieldCheck size={28} />
                    </div>

                    <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">
                        LENEX Admin
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Sign in to manage and monitor the platform.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
                >
                    <h2 className="text-lg font-semibold text-gray-900">
                        Administrator sign in
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Use your authorized administrator account.
                    </p>

                    {error && (
                        <div
                            role="alert"
                            className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                        >
                            {error}
                        </div>
                    )}

                    <div className="mt-6 space-y-5">
                        <div>
                            <label
                                htmlFor="admin-email"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Email address
                            </label>

                            <input
                                id="admin-email"
                                type="email"
                                autoComplete="username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                                className="w-full rounded-lg border border-gray-300 px-3.5 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="admin-password"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id="admin-password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-3.5 py-3 pr-12 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((value) => !value)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-800"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading && <LoaderCircle size={18} className="animate-spin" />}
                            {loading ? "Signing in..." : "Sign in securely"}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-xs text-gray-500">
                    Restricted access · Authorized LENEX administrators only
                </p>

                <p className="mt-4 text-center text-sm">
                    <Link to="/" className="font-medium text-sky-600 hover:text-sky-700">
                        Return to LENEX
                    </Link>
                </p>
            </div>
        </main>
    );
};

export default AdminLogin;
