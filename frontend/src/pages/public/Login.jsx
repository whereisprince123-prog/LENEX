import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../services/api.js";
import ThemeToggle from "../../components/ThemeToggle.jsx";

function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "email" ? value.trimStart() : value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError(t("loginRequiredFields"));
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError(t("invalidEmailAddress"));
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/business/login", {
        email,
        password,
      });

      if (!response.data?.success) {
        setError(response.data?.message || t("unableToSignIn"));
        return;
      }

      // Store profile information only.
      // Authentication remains in the HttpOnly cookie.
      if (response.data.user) {
        localStorage.setItem(
          "lenex_user",
          JSON.stringify(response.data.user)
        );
      }

      if (response.data.business) {
        localStorage.setItem(
          "lenex_business",
          JSON.stringify(response.data.business)
        );
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.status === 401) {
        setError(t("invalidLoginCredentials"));
      } else if (err.response?.status === 403) {
        setError(
          err.response?.data?.message ||
            t("inactiveAccountMessage")
        );
      } else if (!err.response) {
        setError(t("connectionError"));
      } else {
        setError(
          err.response?.data?.message ||
            t("loginFailed")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-white text-gray-900 dark:bg-slate-900 dark:text-slate-100">

      {/* Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600">
            <span className="text-xl font-bold text-white">L</span>
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-950 dark:text-white">
              LENEX
            </h1>
            <p className="text-[11px] font-medium text-gray-500 dark:text-slate-400">
              {t("debtManagement")}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div className="text-sm text-gray-500 dark:text-slate-400">
            <span className="hidden sm:inline">
              {t("newToLenex")}{" "}
            </span>

            <Link
              to="/register"
              className="font-semibold text-sky-600 transition hover:text-sky-700"
            >
              {t("createAccount")} <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto flex min-h-[calc(100vh-150px)] max-w-7xl items-center px-6 py-10">
        <div className="grid w-full items-center gap-16 lg:grid-cols-[1fr_440px]">

          {/* Left section */}
          <section className="relative hidden lg:block">
            <div className="absolute -left-32 -top-28 h-[560px] w-[650px] rounded-[45%] bg-yellow-100/80 blur-3xl dark:bg-yellow-500/10" />

            <div className="absolute left-32 top-20 h-64 w-64 rounded-full bg-sky-100/60 blur-3xl dark:bg-sky-500/10" />

            <div className="relative z-10 max-w-xl">
              <div className="mb-7 flex items-center gap-3">
                <span className="h-[2px] w-10 bg-sky-500" />

                <span className="text-xs font-bold uppercase tracking-[0.22em] text-sky-600">
                  {t("businessWorkspace")}
                </span>
              </div>

              <h2 className="text-5xl font-bold leading-[1.08] tracking-tight text-gray-950 dark:text-white xl:text-6xl">
                {t("knowWhatIsOwed")}
                <br />
                <span className="text-sky-600">
                  {t("stayInControl")}
                </span>
              </h2>

              <p className="mt-7 max-w-lg text-lg leading-8 text-gray-500 dark:text-slate-400">
                {t("loginHeroDescription")}
              </p>

              {/* Statistics */}
              <div className="mt-11 grid max-w-xl grid-cols-2 gap-5">

                {/* Outstanding */}
                <div className="rounded-2xl border border-sky-100 bg-white/80 p-5 backdrop-blur-sm dark:border-sky-900 dark:bg-slate-900/80">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-500/15">
                    <span className="text-sky-600">↗</span>
                  </div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400 dark:text-slate-500">
                    {t("outstanding")}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
                    1.25M
                  </p>

                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    {t("rwfCurrentlyTracked")}
                  </p>
                </div>

                {/* Overdue */}
                <div className="rounded-2xl border border-yellow-200 bg-white/80 p-5 backdrop-blur-sm dark:border-yellow-900 dark:bg-slate-900/80">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-500/15">
                    <span className="text-yellow-600">◷</span>
                  </div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400 dark:text-slate-500">
                    {t("overdue")}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
                    07
                  </p>

                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    {t("customersNeedAttention")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Login form */}
          <section className="w-full">
            <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-[0_25px_70px_-25px_rgba(15,23,42,0.18)] dark:border-slate-700 dark:bg-slate-900 sm:p-9">

              {/* Form header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
                  {t("welcomeBack")}
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-slate-400">
                  {t("loginDescription")}
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300"
                  >
                    {t("emailAddress")}
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t("loginEmailPlaceholder")}
                    autoComplete="username"
                    required
                    maxLength={254}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300"
                  >
                    {t("password")}
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={t("enterYourPassword")}
                      autoComplete="current-password"
                      required
                      maxLength={72}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 pr-16 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-sky-600 hover:text-sky-700"
                      aria-label={
                        showPassword
                          ? t("hidePassword")
                          : t("showPassword")
                      }
                    >
                      {showPassword
                        ? t("hide")
                        : t("show")}
                    </button>
                  </div>

                  <div className="mt-2 text-right">
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-sky-600 transition hover:text-sky-700"
                    >
                      {t("forgotPassword")}
                    </Link>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 text-sm font-semibold text-white transition hover:bg-sky-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    t("signingIn")
                  ) : (
                    <>
                      {t("signInToAccount")}
                      <span className="text-lg transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}
                </button>
              </form>

              {/* Register divider */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-100 dark:bg-slate-800" />

                <span className="text-center text-xs text-gray-400 dark:text-slate-500">
                  {t("noBusinessAccount")}
                </span>

                <div className="h-px flex-1 bg-gray-100 dark:bg-slate-800" />
              </div>

              {/* Register link */}
              <div className="text-center">
                <Link
                  to="/register"
                  className="text-sm font-semibold text-sky-600 transition hover:text-sky-700"
                >
                  {t("createAccount")} <span className="ml-2">→</span>
                </Link>
              </div>

              {/* Security */}
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-slate-500">
                <span aria-hidden="true">♢</span>
                <span>{t("businessDataProtected")}</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-6 text-center text-xs text-gray-400 dark:text-slate-500">
        © 2026 LENEX · {t("loginFooterTagline")}
      </footer>
    </div>
  );
}

export default Login;