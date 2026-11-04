import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api.js";

function Register() {


  const [formData, setFormData] = useState({
    business_name: "",
    business_phone: "",
    business_email: "",
    business_address: "",

    full_name: "",
    email: "",
    phone_number: "",
    password: "",

    terms: false,
  });

   const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();

    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
        const registrationData = {
            business_name: formData.business_name,
            business_phone: formData.business_phone,
            business_email: formData.business_email,
            business_address: formData.business_address,
            full_name: formData.full_name,
            email: formData.email,
            phone_number: formData.phone_number,
            password: formData.password
        };

   

        const response = await api.post(
            "/auth/business/register",
            registrationData
        );

   

        setSuccess(
            response.data.message || "Business registered successfully!"
        );

        setTimeout(() => {
            navigate("/login");
        }, 1500);



 

        setError(
            error.response?.data?.message ||
            "Registration failed. Please try again."
        );

    } finally {
        setLoading(false);
    }
};

  return (
    <div className="min-h-screen overflow-hidden bg-white text-gray-900">

      {/* ================= HEADER ================= */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">

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

        <div className="text-sm text-gray-500">
          <span className="hidden sm:inline">
            Already have an account?{" "}
          </span>

          <Link
            to="/login"
            className="font-semibold text-sky-600 transition hover:text-sky-700"
          >
            Sign in
            <span className="ml-2">→</span>
          </Link>
        </div>

      </header>


      {/* ================= MAIN ================= */}
      <main className="mx-auto flex min-h-[calc(100vh-150px)] max-w-7xl items-center px-6 py-10">

        <div className="grid w-full items-center gap-16 lg:grid-cols-[1fr_500px]">


          {/* ================= LEFT ================= */}
          <section className="relative hidden lg:block">

            {/* Yellow Glow */}
            <div className="absolute -left-32 -top-28 h-[600px] w-[680px] rounded-[45%] bg-yellow-100/80 blur-3xl" />

            {/* Blue Glow */}
            <div className="absolute left-48 top-24 h-64 w-64 rounded-full bg-sky-100/60 blur-3xl" />

            <div className="relative z-10 max-w-xl">

              <div className="mb-7 flex items-center gap-3">

                <span className="h-[2px] w-10 bg-yellow-400" />

                <span className="text-xs font-bold uppercase tracking-[0.22em] text-sky-600">
                  Start your workspace
                </span>

              </div>


              <h2 className="text-5xl font-bold leading-[1.08] tracking-tight text-gray-950 xl:text-6xl">
                Build better
                <br />

                <span className="text-sky-600">
                  credit habits.
                </span>
              </h2>


              <p className="mt-7 max-w-lg text-lg leading-8 text-gray-500">
                Create your LENEX business account and start
                keeping every customer debt organized in one
                simple workspace.
              </p>


              {/* Benefits */}
              <div className="mt-10 space-y-5">

                <Benefit
                  number="01"
                  title="Record every debt"
                  description="Keep customer credit records organized."
                />

                <Benefit
                  number="02"
                  title="Track what is overdue"
                  description="Know which customers need attention."
                />

                <Benefit
                  number="03"
                  title="Confirm payments"
                  description="Mark debts as paid after receiving cash."
                />

              </div>

            </div>

          </section>


          {/* ================= REGISTER CARD ================= */}
          <section className="w-full">

            <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-[0_25px_70px_-25px_rgba(15,23,42,0.18)] sm:p-9">


              {/* ================= FORM HEADER ================= */}
              <div className="mb-8">

                <h2 className="text-3xl font-bold tracking-tight text-gray-950">
                  Create your account
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Set up your business workspace in a few simple steps.
                </p>

              </div>


              {/* ================= STEP INDICATOR ================= */}
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
                            : "text-gray-400"
                        }`}
                      >
                        STEP 1
                      </p>

                      <p className="text-sm font-semibold text-gray-800">
                        Business
                      </p>
                    </div>

                  </div>


                  {/* Connector */}
                  <div
                    className={`mx-4 h-px flex-1 transition ${
                      step >= 2
                        ? "bg-sky-500"
                        : "bg-gray-200"
                    }`}
                  />


                  {/* Step 2 */}
                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
                        step === 2
                          ? "bg-sky-600 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      2
                    </div>

                    <div className="hidden sm:block">
                      <p
                        className={`text-xs font-bold ${
                          step === 2
                            ? "text-sky-600"
                            : "text-gray-400"
                        }`}
                      >
                        STEP 2
                      </p>

                      <p className="text-sm font-semibold text-gray-800">
                        Your information
                      </p>
                    </div>

                  </div>

                </div>

              </div>


              {/* ================= STEP 1 ================= */}
              {step === 1 && (

                <form onSubmit={handleNext} className="space-y-5">

                  {/* Step Heading */}
                  <div className="mb-6 flex items-center gap-3">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sm font-bold text-sky-600">
                      01
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        Business information
                      </h3>

                      <p className="text-xs text-gray-400">
                        Tell us about your business
                      </p>
                    </div>

                  </div>


                  {/* Business Name */}
                  <div>

                    <label
                      htmlFor="business_name"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Business name
                    </label>

                    <input
                      id="business_name"
                      name="business_name"
                      type="text"
                      value={formData.business_name}
                      onChange={handleChange}
                      required
                      placeholder="ABC Shop"
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50"
                    />

                  </div>


                  {/* Phone + Email */}
                  <div className="grid gap-4 sm:grid-cols-2">

                    <div>

                      <label
                        htmlFor="business_phone"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Business phone
                      </label>

                      <input
                        id="business_phone"
                        name="business_phone"
                        type="tel"
                        value={formData.business_phone}
                        onChange={handleChange}
                        required
                        placeholder="0788 123 456"
                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50"
                      />

                    </div>


                    <div>

                      <label
                        htmlFor="business_email"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                      >
                        Business email
                      </label>

                      <input
                        id="business_email"
                        name="business_email"
                        type="email"
                        value={formData.business_email}
                        onChange={handleChange}
                        placeholder="business@example.com"
                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50"
                      />

                    </div>

                  </div>


                  {/* Address */}
                  <div>

                    <label
                      htmlFor="business_address"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Business address
                      <span className="ml-1 font-normal text-gray-400">
                        (optional)
                      </span>
                    </label>

                    <input
                      id="business_address"
                      name="business_address"
                      type="text"
                      value={formData.business_address}
                      onChange={handleChange}
                      placeholder="Rubavu, Rwanda"
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50"
                    />

                  </div>


                  {/* Continue */}
                  <button
                    type="submit"
                    className="group mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 text-sm font-semibold text-white transition hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-100"
                  >
                    Continue

                    <span className="text-lg transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </button>

                </form>

              )}


              {/* ================= STEP 2 ================= */}
              {step === 2 && (

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Step Heading */}
                  <div className="mb-6 flex items-center gap-3">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-50 text-sm font-bold text-yellow-600">
                      02
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        Your information
                      </h3>

                      <p className="text-xs text-gray-400">
                        Create your business owner account
                      </p>
                    </div>

                  </div>


                  {/* Full Name */}
                  <div>

                    <label
                      htmlFor="full_name"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Full name
                    </label>

                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      placeholder="Jean Claude"
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50"
                    />

                  </div>


                  {/* Email */}
                  <div>

                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50"
                    />

                  </div>


                  {/* Phone */}
                  <div>

                    <label
                      htmlFor="phone_number"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Phone number
                    </label>

                    <input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="0788 111 111"
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50"
                    />

                  </div>


                  {/* Password */}
                  <div>

                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                      Password
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
                        placeholder="Create a strong password"
                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 pr-16 text-sm outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>

                    </div>

                    <p className="mt-2 text-xs text-gray-400">
                      Use at least 8 characters.
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

                    <span className="text-xs leading-5 text-gray-500">
                      I agree to the LENEX terms of service and
                      understand how my business data is handled.
                    </span>

                  </label>


                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">

                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex h-12 flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      ← Back
                    </button>

                   <button
    type="submit"
    disabled={loading}
    className="group flex h-12 flex-[2] items-center justify-center gap-2 rounded-xl bg-sky-600 text-sm font-semibold text-white transition hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-100 disabled:cursor-not-allowed disabled:opacity-70"
>
    {loading ? (
        "Creating account..."
    ) : (
        <>
            Create account
            <span className="text-lg transition-transform group-hover:translate-x-1">
                →
            </span>
        </>
    )}
</button>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">
                    {success}
                </div>
            )}

                  </div>

                </form>

              )}

            </div>


            {/* Security */}
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">

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


/* ================= BENEFIT COMPONENT ================= */

function Benefit({ number, title, description }) {
  return (
    <div className="flex items-start gap-4">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-sky-600 shadow-sm ring-1 ring-gray-100">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900">
          {title}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>

    </div>
  );
}

export default Register;