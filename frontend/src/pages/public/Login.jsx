import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api.js";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/business/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );
      const { token, user, business } = response.data;

// Save authentication data
localStorage.setItem("lenex_token", token);
localStorage.setItem("lenex_user", JSON.stringify(user));
localStorage.setItem("lenex_business", JSON.stringify(business));
        if (response.data.success) {
            navigate("/dashboard");
        }

    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message ||
        "Login failed. Please check your email and password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-white text-gray-900">

      {/* ================= HEADER ================= */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">

        {/* LENEX Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600">
            <span className="text-xl font-bold text-white">
              L
            </span>
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-950">
              LENEX
            </h1>

            <p className="text-[11px] font-medium text-gray-500">
              Debt Management
            </p>
          </div>
        </Link>

        {/* Register Link */}
        <div className="text-sm text-gray-500">
          <span className="hidden sm:inline">
            New to LENEX?{" "}
          </span>

          <Link
            to="/register"
            className="font-semibold text-sky-600 transition hover:text-sky-700"
          >
            Create account
            <span className="ml-2">→</span>
          </Link>
        </div>
      </header>


      {/* ================= MAIN ================= */}
      <main className="mx-auto flex min-h-[calc(100vh-150px)] max-w-7xl items-center px-6 py-10">

        <div className="grid w-full items-center gap-16 lg:grid-cols-[1fr_440px]">


          {/* ================= LEFT SECTION ================= */}
          <section className="relative hidden lg:block">

            {/* Yellow blurred background shape */}
            <div className="absolute -left-32 -top-28 h-[560px] w-[650px] rounded-[45%] bg-yellow-100/80 blur-3xl" />

            {/* Small Sky Blue Blur */}
            <div className="absolute left-32 top-20 h-64 w-64 rounded-full bg-sky-100/60 blur-3xl" />

            {/* Content */}
            <div className="relative z-10 max-w-xl">

              {/* Label */}
              <div className="mb-7 flex items-center gap-3">

                <span className="h-[2px] w-10 bg-sky-500" />

                <span className="text-xs font-bold uppercase tracking-[0.22em] text-sky-600">
                  Business Workspace
                </span>

              </div>


              {/* Main Heading */}
              <h2 className="text-5xl font-bold leading-[1.08] tracking-tight text-gray-950 xl:text-6xl">

                Know what is owed.

                <br />

                <span className="text-sky-600">
                  Stay in control.
                </span>

              </h2>


              {/* Description */}
              <p className="mt-7 max-w-lg text-lg leading-8 text-gray-500">
                Manage customer debts, follow overdue balances,
                and keep your credit records organized from one
                simple workspace.
              </p>


              {/* ================= STAT CARDS ================= */}
              <div className="mt-11 grid max-w-xl grid-cols-2 gap-5">

                {/* Outstanding */}
                <div className="rounded-2xl border border-sky-100 bg-white/80 p-5 backdrop-blur-sm">

                  <div className="mb-5 flex items-center justify-between">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100">
                      <svg
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M4 19V9m5 10V5m5 14v-7m5 7V3"
                        />
                      </svg>
                    </div>

                  </div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                    Outstanding
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-950">
                    1.25M
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    RWF currently tracked
                  </p>

                </div>


                {/* Overdue */}
                <div className="rounded-2xl border border-yellow-200 bg-white/80 p-5 backdrop-blur-sm">

                  <div className="mb-5 flex items-center justify-between">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                      <svg
                        className="h-5 w-5 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="8"
                          strokeWidth="1.8"
                        />

                        <path
                          strokeLinecap="round"
                          strokeWidth="1.8"
                          d="M12 7v5l3 2"
                        />
                      </svg>
                    </div>

                  </div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                    Overdue
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-950">
                    07
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Customers need attention
                  </p>

                </div>

              </div>

            </div>
          </section>


          {/* ================= LOGIN SECTION ================= */}
          <section className="w-full">

            <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-[0_25px_70px_-25px_rgba(15,23,42,0.18)] sm:p-9">

              {/* Form Header */}
              <div className="mb-8">

                <h2 className="text-3xl font-bold tracking-tight text-gray-950">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Sign in to access your business workspace.
                </p>

              </div>


              {/* ================= ERROR MESSAGE ================= */}
              {error && (
                <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}


              {/* ================= FORM ================= */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email address
                  </label>

                  <div className="relative">

                    <svg
                      className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                        strokeWidth="1.8"
                      />

                      <path
                        strokeLinecap="round"
                        strokeWidth="1.8"
                        d="M3 7l9 6 9-6"
                      />
                    </svg>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@business.com"
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50"
                    />

                  </div>

                </div>


                {/* Password */}
                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-semibold text-sky-600 transition hover:text-sky-700"
                    >
                      Forgot password?
                    </button>

                  </div>


                  <div className="relative">

                    {/* Lock Icon */}
                    <svg
                      className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="10"
                        rx="2"
                        strokeWidth="1.8"
                      />

                      <path
                        strokeLinecap="round"
                        strokeWidth="1.8"
                        d="M8 10V7a4 4 0 018 0v3"
                      />
                    </svg>


                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50"
                    />


                    {/* Show Password */}
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                      aria-label="Toggle password visibility"
                    >

                      {showPassword ? (

                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                            d="M3 3l18 18"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                            d="M10.6 10.6a2 2 0 102.8 2.8"
                          />

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                            d="M6.2 6.2A12.8 12.8 0 002 12c1.3 4 5 8 10 8 1.7 0 3.2-.4 4.5-1"
                          />
                        </svg>

                      ) : (

                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                            d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
                          />

                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            strokeWidth="1.8"
                          />
                        </svg>

                      )}

                    </button>

                  </div>

                </div>


                {/* Remember Me */}
                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                  />

                  <span className="text-sm text-gray-500">
                    Remember me
                  </span>

                </label>


                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 text-sm font-semibold text-white transition hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    "Signing in..."
                  ) : (
                    <>
                      Sign in to your account

                      <span className="text-lg transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}
                </button>

              </form>


              {/* Divider */}
              <div className="my-7 flex items-center gap-4">

                <div className="h-px flex-1 bg-gray-100" />

                <span className="text-xs text-gray-400">
                  Don't have a business account?
                </span>

                <div className="h-px flex-1 bg-gray-100" />

              </div>


              {/* Register */}
              <div className="text-center">

                <Link
                  to="/register"
                  className="text-sm font-semibold text-sky-600 transition hover:text-sky-700"
                >
                  Create an account
                  <span className="ml-2">→</span>
                </Link>

              </div>


              {/* Security */}
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">

                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z"
                  />
                </svg>

                <span>
                  Your business data stays protected.
                </span>

              </div>

            </div>

          </section>

        </div>

      </main>


      {/* Footer */}
      <footer className="pb-6 text-center text-xs text-gray-400">
        © 2026 LENEX · Smarter Credit. Better Business.
      </footer>

    </div>
  );
}

export default Login;

