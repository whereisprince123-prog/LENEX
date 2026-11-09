
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../services/api.js";
import ThemeToggle from "../../components/ThemeToggle.jsx";

function isAtLeast18Frontend(dateOfBirth) {
  if (!dateOfBirth) return false;

  const dob = new Date(`${dateOfBirth}T00:00:00`);
  const today = new Date();

  if (Number.isNaN(dob.getTime()) || dob >= today) return false;

  let age = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() &&
      today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age >= 18;
}

function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    business_name: "",
    business_phone: "",
    business_email: "",
    business_address: "",
    full_name: "",
    date_of_birth: "",
    email: "",
    phone_number: "",
    password: "",
    terms: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (["business_phone", "phone_number"].includes(name)) {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);

      setFormData((previous) => ({
        ...previous,
        [name]: digitsOnly,
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setStep(2);
  };

  const handleBack = () => {
    setError("");
    setSuccess("");
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.terms) {
      setError(t("acceptTermsError"));
      return;
    }

    if (!isAtLeast18Frontend(formData.date_of_birth)) {
      setError(t("minimumAgeError"));
      return;
    }

    if (!/^07\d{8}$/.test(formData.business_phone)) {
      setError(t("invalidBusinessPhone"));
      return;
    }

    if (!/^07\d{8}$/.test(formData.phone_number)) {
      setError(t("invalidOwnerPhone"));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError(t("invalidEmailAddress"));
      return;
    }

    if (
      formData.business_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.business_email.trim()
      )
    ) {
      setError(t("invalidBusinessEmail"));
      return;
    }

    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/;

    if (!strongPassword.test(formData.password)) {
      setError(t("strongPasswordError"));
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        business_name: formData.business_name,
        business_phone: formData.business_phone,
        business_email: formData.business_email,
        business_address: formData.business_address,
        full_name: formData.full_name,
        date_of_birth: formData.date_of_birth,
        email: formData.email.trim().toLowerCase(),
        phone_number: formData.phone_number,
        password: formData.password,
      };

      const response = await api.post(
        "/auth/business/register",
        registrationData
      );

      setSuccess(
        response.data.message || t("registrationSuccess")
      );

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Registration error:", err);

      if (!err.response) {
        setError(t("connectionError"));
      } else {
        setError(
          err.response?.data?.message ||
            t("registrationFailed")
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
              {t("alreadyHaveAccount")}{" "}
            </span>

            <Link
              to="/login"
              className="font-semibold text-sky-600 transition hover:text-sky-700"
            >
              {t("signIn")} <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto flex min-h-[calc(100vh-150px)] max-w-7xl items-center px-6 py-10">
        <div className="grid w-full items-center gap-16 lg:grid-cols-[1fr_500px]">

          {/* Left section */}
          <section className="relative hidden lg:block">
            <div className="absolute -left-32 -top-28 h-[600px] w-[680px] rounded-[45%] bg-yellow-100/80 blur-3xl dark:bg-yellow-500/10" />

            <div className="absolute left-48 top-24 h-64 w-64 rounded-full bg-sky-100/60 blur-3xl dark:bg-sky-500/10" />

            <div className="relative z-10 max-w-xl">
              <div className="mb-7 flex items-center gap-3">
                <span className="h-[2px] w-10 bg-yellow-400" />

                <span className="text-xs font-bold uppercase tracking-[0.22em] text-sky-600">
                  {t("startYourWorkspace")}
                </span>
              </div>

              <h2 className="text-5xl font-bold leading-[1.08] tracking-tight text-gray-950 dark:text-white xl:text-6xl">
                {t("buildBetter")}
                <br />
                <span className="text-sky-600">
                  {t("creditHabits")}
                </span>
              </h2>

              <p className="mt-7 max-w-lg text-lg leading-8 text-gray-500 dark:text-slate-400">
                {t("registerHeroDescription")}
              </p>

              {/* Benefits */}
              <div className="mt-10 space-y-5">
                <Benefit
                  number="01"
                  title={t("recordEveryDebt")}
                  description={t("recordEveryDebtDescription")}
                />

                <Benefit
                  number="02"
                  title={t("trackOverdue")}
                  description={t("trackOverdueDescription")}
                />

                <Benefit
                  number="03"
                  title={t("confirmPayments")}
                  description={t("confirmPaymentsDescription")}
                />
              </div>
            </div>
          </section>

          {/* Registration card */}
          <section className="w-full">
            <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-[0_25px_70px_-25px_rgba(15,23,42,0.18)] dark:border-slate-700 dark:bg-slate-900 sm:p-9">

              {/* Form header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
                  {t("createYourAccount")}
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-slate-400">
                  {t("registerDescription")}
                </p>
              </div>

              {/* Step indicator */}
              <div className="mb-8">
                <div className="flex items-center">

                  {/* Step 1 */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
                        step >= 1
                          ? "bg-sky-600 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step > 1 ? "✓" : "1"}
                    </div>

                    <div className="hidden sm:block">
                      <p
                        className={`text-xs font-bold ${
                          step === 1
                            ? "text-sky-600"
                            : "text-gray-400 dark:text-slate-500"
                        }`}
                      >
                        {t("stepOne")}
                      </p>

                      <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                        {t("business")}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`mx-4 h-px flex-1 transition ${
                      step >= 2 ? "bg-sky-500" : "bg-gray-200 dark:bg-slate-700"
                    }`}
                  />

                  {/* Step 2 */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
                        step === 2
                          ? "bg-sky-600 text-white"
                          : "bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500"
                      }`}
                    >
                      2
                    </div>

                    <div className="hidden sm:block">
                      <p
                        className={`text-xs font-bold ${
                          step === 2
                            ? "text-sky-600"
                            : "text-gray-400 dark:text-slate-500"
                        }`}
                      >
                        {t("stepTwo")}
                      </p>

                      <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                        {t("yourInformation")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <form onSubmit={handleNext} className="space-y-5">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sm font-bold text-sky-600 dark:bg-sky-500/10">
                      01
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">
                        {t("businessInformation")}
                      </h3>

                      <p className="text-xs text-gray-400 dark:text-slate-500">
                        {t("tellUsAboutBusiness")}
                      </p>
                    </div>
                  </div>

                  {/* Business name */}
                  <div>
                    <label
                      htmlFor="business_name"
                      className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300"
                    >
                      {t("businessName")}
                    </label>

                    <input
                      id="business_name"
                      name="business_name"
                      type="text"
                      value={formData.business_name}
                      onChange={handleChange}
                      required
                      placeholder={t("businessNamePlaceholder")}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-900"
                    />
                  </div>

                  {/* Business phone and email */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="business_phone"
                        className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300"
                      >
                        {t("businessPhone")}
                      </label>

                      <input
                        id="business_phone"
                        name="business_phone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        pattern="07[0-9]{8}"
                        value={formData.business_phone}
                        onChange={handleChange}
                        required
                        placeholder="0788 123 456"
                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-900"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="business_email"
                        className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300"
                      >
                        {t("businessEmail")}
                      </label>

                      <input
                        id="business_email"
                        name="business_email"
                        type="email"
                        value={formData.business_email}
                        onChange={handleChange}
                        placeholder="business@example.com"
                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-900"
                      />
                    </div>
                  </div>

                  {/* Business address */}
                  <div>
                    <label
                      htmlFor="business_address"
                      className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300"
                    >
                      {t("businessAddress")}
                      <span className="ml-1 font-normal text-gray-400 dark:text-slate-500">
                        ({t("optional")})
                      </span>
                    </label>

                    <input
                      id="business_address"
                      name="business_address"
                      type="text"
                      value={formData.business_address}
                      onChange={handleChange}
                      placeholder={t("businessAddressPlaceholder")}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-900"
                    />
                  </div>

                  {/* Continue */}
                  <button
                    type="submit"
                    className="group mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 text-sm font-semibold text-white transition hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-100"
                  >
                    {t("continue")}

                    <span className="text-lg transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                </form>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-50 text-sm font-bold text-yellow-600 dark:bg-yellow-500/10">
                      02
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">
                        {t("yourInformation")}
                      </h3>

                      <p className="text-xs text-gray-400 dark:text-slate-500">
                        {t("createBusinessOwnerAccount")}
                      </p>
                    </div>
                  </div>

                  {/* Full name */}
                  <div>
                    <label
                      htmlFor="full_name"
                      className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300"
                    >
                      {t("fullName")}
                    </label>

                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      placeholder="Jean Claude"
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-900"
                    />
                  </div>

                  {/* Date of birth */}
                  <div>
                    <label
                      htmlFor="date_of_birth"
                      className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300"
                    >
                      {t("dateOfBirth")}
                    </label>

                    <input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={handleChange}
                      required
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm dark:border-slate-700 dark:bg-slate-800"
                    />

                    <p className="mt-2 text-xs text-gray-400 dark:text-slate-500">
                      {t("minimumAgeHint")}
                    </p>
                  </div>

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
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-900"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone_number"
                      className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300"
                    >
                      {t("phoneNumber")}
                    </label>

                    <input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      pattern="07[0-9]{8}"
                      value={formData.phone_number}
                      onChange={handleChange}
                      required
                      placeholder="0788 111 111"
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-900"
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
                        onChange={handleChange}
                        required
                        minLength={8}
                        maxLength={72}
                        placeholder={t("strongPasswordPlaceholder")}
                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 pr-16 text-sm outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:focus:bg-slate-900"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 transition hover:text-gray-600"
                        aria-label={
                          showPassword
                            ? t("hidePassword")
                            : t("showPassword")
                        }
                      >
                        {showPassword ? t("hide") : t("show")}
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-gray-400 dark:text-slate-500">
                      {t("strongPasswordHint")}
                    </p>
                  </div>

                  {/* Terms */}
                  <label className="flex cursor-pointer items-start gap-3 pt-1">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleChange}
                      required
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                    />

                    <span className="text-xs leading-5 text-gray-500 dark:text-slate-400">
                      {t("agreeToTerms")}
                    </span>
                  </label>

                  {/* Error */}
                  {error && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300"
                    >
                      {error}
                    </div>
                  )}

                  {/* Success */}
                  {success && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-950/40 dark:text-green-300"
                    >
                      {success}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex h-12 flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      ← {t("back")}
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex h-12 flex-[2] items-center justify-center gap-2 rounded-xl bg-sky-600 text-sm font-semibold text-white transition hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loading ? (
                        t("creatingAccount")
                      ) : (
                        <>
                          {t("createAccount")}
                          <span className="text-lg transition-transform group-hover:translate-x-1">
                            →
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Security */}
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-slate-500">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z"
                />
              </svg>

              <span>{t("businessDataProtected")}</span>
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

/* Benefit component */
function Benefit({ number, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-sky-600 shadow-sm ring-1 ring-gray-100 dark:bg-slate-900 dark:ring-slate-700">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">
          {title}
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

export default Register;
