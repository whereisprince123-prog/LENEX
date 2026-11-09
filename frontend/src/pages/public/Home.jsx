import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useForm, ValidationError } from "@formspree/react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import api from "../../services/api";
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
    User,
    MessageSquare,
    Lock,
    CheckCircle2
} from "lucide-react";

function Home() {
  const { t } = useTranslation();
  const [state, handleSubmit] = useForm("maeyrkaj");

  const [contactInfo, setContactInfo] = useState({
    support_email: "admin@lenex.com",
    contact_phone: "+250 787 950 052",
    whatsapp_number: "",
    contact_address: "",
    city: "Kigali",
    country: "Rwanda",
    business_hours: "Monday - Friday · 8:00 AM - 5:00 PM",
    facebook_url: "",
    instagram_url: "",
    linkedin_url: "",
    website_url: "",
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await api.get("/settings/public");

        if (response.data.success && response.data.data) {
          setContactInfo((current) => ({
            ...current,
            ...response.data.data,
          }));
        }
      } catch (error) {
        console.error("Could not load LENEX contact information:", error);
      }
    };

    fetchContactInfo();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />

      {/* HERO */}
      <section
        id="home"
        className="relative overflow-hidden bg-white dark:bg-slate-950"
      >
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-yellow-100/70 blur-3xl dark:bg-yellow-500/5" />
        <div className="absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-sky-50 blur-3xl dark:bg-sky-500/5" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:py-32">
          {/* Hero Content */}
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-700">
                {t("simpleDebtManagement")}
              </span>
            </div>

            <h1 className="max-w-2xl text-5xl font-bold leading-[1.08] tracking-tight text-gray-950 md:text-6xl lg:text-7xl dark:text-slate-100">
              {t("heroTitleStart")}{" "}
              <span className="text-sky-600">
                {t("heroTitleHighlight")}
              </span>{" "}
              {t("heroTitleEnd")}
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-gray-500 dark:text-slate-400">
              {t("heroDescription")}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="group flex items-center gap-2 rounded-xl bg-gray-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-600"
              >
                {t("getStarted")}
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <a
                href="#how-it-works"
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
              >
                {t("seeHowItWorks")}
              </a>
            </div>

            <div className="mt-8 flex items-center gap-3 text-sm text-gray-400">
              <div className="flex -space-x-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-sky-100 text-xs font-bold text-sky-600">
                  ✓
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-yellow-100 text-xs font-bold text-yellow-600">
                  ✓
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-bold text-gray-600">
                  ✓
                </span>
              </div>

              <span>{t("builtForCreditBusinesses")}</span>
            </div>
          </div>

          {/* Hero Dashboard Preview */}
          <div className="relative">
            <div className="absolute inset-0 rounded-[3rem] bg-sky-100/60 blur-3xl" />

            <div className="relative rounded-3xl border border-gray-200 bg-white p-5 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)] dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                <div>
                  <p className="text-xs font-medium text-gray-400 dark:text-slate-400">
                    {t("businessOverview")}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-gray-950 dark:text-slate-100">
                    {t("welcomeToLenex")}
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
                  <span className="text-sm font-bold text-sky-600">L</span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-sky-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                    {t("outstanding")}
                  </p>
                  <p className="mt-3 text-2xl font-bold text-gray-950">
                    1.25M
                  </p>
                  <p className="mt-1 text-xs text-gray-500">RWF</p>
                </div>

                <div className="rounded-2xl bg-yellow-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-yellow-700">
                    {t("overdue")}
                  </p>
                  <p className="mt-3 text-2xl font-bold text-gray-950">
                    07
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {t("customers")}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-gray-100 dark:border-slate-800">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100">
                    {t("recentDebts")}
                  </h4>
                  <span className="text-xs font-semibold text-sky-600">
                    {t("viewAll")}
                  </span>
                </div>

                <DebtPreview
                  name="Jean Claude"
                  description={t("groceries")}
                  amount="50,000 RWF"
                  status="OVERDUE"
                />

                <DebtPreview
                  name="Emmanuel"
                  description={t("buildingMaterials")}
                  amount="120,000 RWF"
                  status="UNPAID"
                />

                <DebtPreview
                  name="Claudine"
                  description={t("householdGoods")}
                  amount="35,000 RWF"
                  status="PAID"
                />
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-gray-950 px-5 py-4">
                <div>
                  <p className="text-xs text-gray-400">
                    {t("todaysReminder")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {t("customersNeedAttention")}
                  </p>
                </div>
                <span className="text-yellow-400">→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="relative overflow-hidden bg-white py-24 transition-colors duration-300 dark:bg-slate-950 sm:py-28"
      >
        <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-600">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
              </svg>
              <span>{t("howLenexWorks")}</span>
            </div>

            <h2 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl dark:text-slate-100">
              {t("howItWorksHeading")}{" "}
              <span className="text-sky-500">LENEX</span>
              <br />
              {t("yourCustomerDebts")}
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
              {t("howItWorksDescription")}
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-14 lg:grid-cols-4 lg:gap-0">
            {/* STEP 1 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="absolute left-1/2 top-0 z-20 flex h-10 w-10 -translate-x-[88px] -translate-y-1/2 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white shadow-lg shadow-sky-200 dark:shadow-sky-400">
                1
              </div>

              <div className="flex h-40 w-40 items-center justify-center rounded-full border border-sky-100 bg-white shadow-[0_15px_50px_rgba(56,189,248,0.10)] dark:border-slate-700 dark:bg-slate-900">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-sky-50 text-sky-500 dark:bg-slate-800 dark:text-sky-400">
                  <svg
                    className="h-11 w-11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M5.5 20c.8-3.2 3.1-5 6.5-5s5.7 1.8 6.5 5" />
                  </svg>
                </div>
              </div>

              <h3 className="mt-8 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {t("recordTheDebt")}
              </h3>
              <p className="mt-3 max-w-[230px] text-sm leading-7 text-slate-500 sm:text-base dark:text-slate-400">
                {t("recordDebtDescription")}
              </p>

              <div className="pointer-events-none absolute left-[65%] top-16 hidden w-[150px] lg:block">
                <svg viewBox="0 0 150 80" className="h-20 w-full" fill="none">
                  <path
                    d="M5 25 C45 70, 105 70, 145 25"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeDasharray="8 9"
                    strokeLinecap="round"
                    className="text-sky-400"
                  />
                </svg>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="absolute left-1/2 top-0 z-20 flex h-10 w-10 -translate-x-[88px] -translate-y-1/2 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white shadow-lg shadow-sky-200 dark:shadow-sky-400">
                2
              </div>

              <div className="flex h-40 w-40 items-center justify-center rounded-full border border-sky-100 bg-white shadow-[0_15px_50px_rgba(56,189,248,0.10)] dark:border-slate-700 dark:bg-slate-900">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-sky-50 text-sky-500 dark:bg-sky-500/10 dark:text-sky-400">
                  <svg
                    className="h-11 w-11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.5V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6v-2.5h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h2.5v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v2.5H21a1.7 1.7 0 0 0-1.6 1Z" />
                  </svg>
                </div>
              </div>

              <h3 className="mt-8 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {t("trackTheDebt")}
              </h3>
              <p className="mt-3 max-w-[230px] text-sm leading-7 text-slate-500 sm:text-base dark:text-slate-400">
                {t("trackDebtDescription")}
              </p>

              <div className="pointer-events-none absolute left-[65%] top-16 hidden w-[150px] lg:block">
                <svg viewBox="0 0 150 80" className="h-20 w-full" fill="none">
                  <path
                    d="M5 25 C45 70, 105 70, 145 25"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeDasharray="8 9"
                    strokeLinecap="round"
                    className="text-sky-400"
                  />
                </svg>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="absolute left-1/2 top-0 z-20 flex h-10 w-10 -translate-x-[88px] -translate-y-1/2 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white shadow-lg shadow-sky-200 dark:shadow-sky-400">
                3
              </div>

              <div className="flex h-40 w-40 items-center justify-center rounded-full border border-sky-100 bg-white shadow-[0_15px_50px_rgba(56,189,248,0.10)] dark:border-slate-700 dark:bg-slate-900">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-sky-50 text-sky-500 dark:bg-slate-800 dark:text-sky-400">
                  <svg
                    className="h-11 w-11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
                    <path d="M4 8h14.5A2.5 2.5 0 0 1 21 10.5v4H17a2 2 0 1 1 0-4h4" />
                    <circle cx="17" cy="12.5" r=".5" fill="currentColor" />
                  </svg>
                </div>
              </div>

              <h3 className="mt-8 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {t("receiveTheCash")}
              </h3>
              <p className="mt-3 max-w-[230px] text-sm leading-7 text-slate-500 sm:text-base dark:text-slate-400">
                {t("receiveCashDescription")}
              </p>

              <div className="pointer-events-none absolute left-[65%] top-16 hidden w-[150px] lg:block">
                <svg viewBox="0 0 150 80" className="h-20 w-full" fill="none">
                  <path
                    d="M5 25 C45 70, 105 70, 145 25"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeDasharray="8 9"
                    strokeLinecap="round"
                    className="text-sky-400"
                  />
                </svg>
              </div>
            </div>

            {/* STEP 4 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="absolute left-1/2 top-0 z-20 flex h-10 w-10 -translate-x-[88px] -translate-y-1/2 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white shadow-lg shadow-sky-200 dark:shadow-sky-400">
                4
              </div>

              <div className="flex h-40 w-40 items-center justify-center rounded-full border border-sky-100 bg-white shadow-[0_15px_50px_rgba(56,189,248,0.10)] dark:border-slate-700 dark:bg-slate-900">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-sky-50 text-sky-500 dark:bg-slate-800 dark:text-sky-400">
                  <svg
                    className="h-11 w-11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="8.5" />
                    <path d="m8.5 12 2.3 2.3 4.8-5" />
                  </svg>
                </div>
              </div>

              <h3 className="mt-8 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {t("markAsPaid")}
              </h3>
              <p className="mt-3 max-w-[230px] text-sm leading-7 text-slate-500 sm:text-base dark:text-slate-400">
                {t("markPaidDescription")}
              </p>
            </div>
          </div>

          {/* IMPORTANT NOTE */}
          <div className="mx-auto mt-20 max-w-2xl rounded-2xl border border-yellow-200 bg-yellow-50/70 px-6 py-5 text-center dark:border-yellow-500/20 dark:bg-yellow-500/10">
            <div className="flex items-start justify-center gap-3">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9Zm1 13h-2v-2h2v2Zm0-4h-2V7h2v5Z" />
              </svg>

              <p className="text-sm leading-6 text-yellow-800 dark:text-yellow">
                <span className="font-semibold">{t("important")}</span>{" "}
                {t("directPaymentNotice")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="relative overflow-hidden bg-white py-24 dark:bg-slate-950"
      >
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-sky-50 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-600">
                {t("aboutLenex")}
              </p>

              <h2 className="mt-4 max-w-xl text-4xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl dark:text-slate-100">
                {t("lenexPrinciple")}
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-gray-500 dark:text-slate-400">
                {t("aboutParagraphOne")}
              </p>

              <p className="mt-5 max-w-xl text-lg leading-8 text-gray-500 dark:text-slate-400">
                {t("aboutParagraphTwo")}
              </p>

              {/* Founder & CEO */}
              <div className="mt-16 flex flex-col items-center text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-sky-100">
                  <span className="text-2xl font-bold text-sky-600">PN</span>
                </div>

                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-sky-600">
                  {t("founderAndCEO")}
                </p>

                <h3 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-slate-100">
                  Prince NIWEMUGISHA
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500 dark:text-slate-400">
                  {t("founderDescription")}
                </p>
              </div>

              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 font-semibold text-sky-600 transition hover:text-sky-700"
              >
                {t("startManagingDebts")}
                <span>→</span>
              </Link>
            </div>

            {/* About Visual */}
            <div className="relative">
              <div className="absolute -inset-6 rounded-[3rem] bg-yellow-50 blur-2xl" />

              <div className="relative rounded-3xl border border-gray-200 bg-white p-7 shadow-[0_25px_60px_-25px_rgba(15,23,42,0.18)] dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-slate-800">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-400">
                      {t("yourCreditRecords")}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-950 dark:text-slate-100">
                      {t("organized")}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50">
                    <svg
                      className="h-6 w-6 text-sky-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M5 12l4 4L19 6"
                      />
                    </svg>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <Record
                    title={t("customerDebts")}
                    value="24"
                    type="blue"
                  />
                  <Record
                    title={t("overdueAccounts")}
                    value="07"
                    type="yellow"
                  />
                  <Record
                    title={t("paidDebts")}
                    value="18"
                    type="green"
                  />
                </div>

                <div className="mt-6 rounded-2xl bg-gray-950 p-5">
                  <p className="text-xs text-gray-400 dark:text-slate-400">
                    {t("lenexPrincipleLabel")}
                  </p>
                  <p className="mt-2 text-lg font-semibold leading-7 text-white">
                    {t("lenexPrincipleDescription")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="bg-white px-6 py-24 dark:bg-slate-950 sm:px-10 lg:px-16"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-500">
              {t("contactUs")}
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl dark:text-slate-100">
              {t("contactHeading")}
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-500 sm:text-lg dark:text-slate-400">
              {t("contactDescription")}
            </p>
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
            {/* LEFT CONTACT CARD */}
            <div className="relative overflow-hidden rounded-[28px] bg-slate-950 p-8 text-white sm:p-10">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-sky-500/10" />

              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-400">
                  {t("getInTouch")}
                </p>

                <h3 className="mt-6 text-3xl font-bold">
                  {t("wereHereToHelp")}
                </h3>

                <p className="mt-5 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
                  {t("contactSupportDescription")}
                </p>

                {/* Contact Details */}
                <div className="mt-10 space-y-7">
                  {contactInfo.support_email && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 ring-1 ring-slate-800">
                        <Mail size={20} className="text-sky-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {t("emailAddress")}
                        </p>
                        <a
                          href={`mailto:${contactInfo.support_email}`}
                          className="mt-1 block text-sm font-semibold text-white transition hover:text-sky-400"
                        >
                          {contactInfo.support_email}
                        </a>
                      </div>
                    </div>
                  )}

                  {contactInfo.contact_phone && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 ring-1 ring-slate-800">
                        <Phone size={20} className="text-sky-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {t("phoneNumber")}
                        </p>
                        <a
                          href={`tel:${contactInfo.contact_phone.replace(/[^\d+]/g, "")}`}
                          className="mt-1 block text-sm font-semibold text-white transition hover:text-sky-400"
                        >
                          {contactInfo.contact_phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {contactInfo.whatsapp_number && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 ring-1 ring-slate-800">
                        <MessageSquare size={20} className="text-sky-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          WhatsApp
                        </p>
                        <a
                          href={`https://wa.me/${contactInfo.whatsapp_number.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 block text-sm font-semibold text-white transition hover:text-sky-400"
                        >
                          {contactInfo.whatsapp_number}
                        </a>
                      </div>
                    </div>
                  )}

                  {(contactInfo.contact_address ||
                    contactInfo.city ||
                    contactInfo.country) && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 ring-1 ring-slate-800">
                        <MapPin size={20} className="text-sky-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {t("location")}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {[
                            contactInfo.contact_address,
                            contactInfo.city,
                            contactInfo.country,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Business Hours */}
                {contactInfo.business_hours && (
                  <div className="mt-10 rounded-2xl bg-slate-900 p-5 ring-1 ring-slate-800">
                    <div className="flex items-start gap-3">
                      <Clock
                        size={19}
                        className="mt-0.5 shrink-0 text-sky-400"
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {t("businessHours")}
                        </p>
                        <p className="mt-2 text-sm text-slate-400">
                          {contactInfo.business_hours}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="rounded-[28px] border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
              {state.succeeded ? (
                <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                    <CheckCircle2 size={32} className="text-green-500" />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-slate-950 dark:text-white">
                    {t("messageSent")}
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {t("contactSuccessMessage")}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50">
                      <MessageSquare size={22} className="text-sky-500" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-slate-950 dark:text-slate-100">
                        {t("sendUsMessage")}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {t("contactFormDescription")}
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-6"
                  >
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-400"
                      >
                        <User size={16} className="text-sky-500" />
                        {t("fullName")}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="name"
                        type="text"
                        name="name"
                        required
                        placeholder={t("yourName")}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-800 dark:focus:ring-sky-500/10"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-400"
                      >
                        <Mail size={16} className="text-sky-500" />
                        {t("emailAddress")}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-800 dark:focus:ring-sky-500/10"
                      />

                      <ValidationError
                        prefix="Email"
                        field="email"
                        errors={state.errors}
                        className="mt-2 text-sm text-red-500"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-400"
                      >
                        <Phone size={16} className="text-sky-500" />
                        {t("phoneNumber")}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        placeholder="e.g. 0788111111"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-800 dark:focus:ring-sky-500/10"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-400"
                      >
                        <MessageSquare size={16} className="text-sky-500" />
                        {t("message")}
                        <span className="text-red-500">*</span>
                      </label>

                      <textarea
                        id="message"
                        name="message"
                        rows="6"
                        required
                        placeholder={t("messagePlaceholder")}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-800 dark:focus:ring-sky-500/10"
                      />

                      <ValidationError
                        prefix="Message"
                        field="message"
                        errors={state.errors}
                        className="mt-2 text-sm text-red-500"
                      />
                    </div>

                    {state.errors && (
                      <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                        <span className="text-sm text-red-600">
                          {t("contactFormError")}
                        </span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={state.submitting}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 hover:shadow-lg hover:shadow-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {state.submitting ? (
                        t("sending")
                      ) : (
                        <>
                          {t("sendMessage")}
                          <Send
                            size={17}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                      <Lock size={14} />
                      <span>{t("privacyNotice")}</span>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white py-20 dark:bg-slate-950">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative overflow-hidden rounded-[2rem] bg-sky-600 px-8 py-14 text-center sm:px-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500 blur-2xl" />
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-yellow-300/20 blur-3xl" />

            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-100">
                {t("getStartedWithLenex")}
              </p>

              <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-bold tracking-tight text-white md:text-5xl">
                {t("finalCtaHeading")}
              </h2>

              <p className="mx-auto mt-5 max-w-xl leading-7 text-sky-100">
                {t("finalCtaDescription")}
              </p>

              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-sky-600 transition hover:bg-gray-50"
              >
                {t("createYourAccount")}
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative overflow-hidden bg-slate-950 text-white">
        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="pointer-events-none absolute right-[12%] bottom-[-120px] h-64 w-64 rounded-full border border-sky-500/10" />
        <div className="pointer-events-none absolute left-[8%] bottom-20 h-3 w-3 rounded-full bg-yellow-400/60" />
        <div className="pointer-events-none absolute right-[30%] top-24 h-2 w-2 rounded-full bg-sky-400/50" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* TOP CTA */}
          <div className="relative overflow-hidden border-b border-white/10 py-16 sm:py-20">
            <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-30">
              <div className="absolute right-[-100px] top-[-150px] h-80 w-80 rounded-full border-[40px] border-sky-500/10" />
            </div>

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-yellow-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                  {t("footerTagline")}
                </span>

                <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  {t("footerCtaHeading")}{" "}
                  <span className="text-sky-400">
                    {t("customerDebts")}
                  </span>
                </h2>

                <p className="mt-4 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
                  {t("footerCtaDescription")}
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-3 rounded-xl bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-sky-400 hover:shadow-sky-500/30"
                >
                  {t("getStartedWithLenex")}
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" strokeLinecap="round" />
                    <path
                      d="m13 6 6 6-6 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* MAIN FOOTER CONTENT */}
          <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-6 lg:gap-8">
            {/* BRAND */}
            <div className="sm:col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white">
                  <span className="text-lg font-bold">L</span>
                </div>

                <div>
                  <div className="text-lg font-bold text-white">LENEX</div>
                  <div className="text-xs text-slate-400">
                    {t("footerTagline")}
                  </div>
                </div>
              </Link>

              <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
                {t("footerDescription")}
              </p>

              {/* Social media */}
              <div className="mt-7 flex items-center gap-3">
                <a
                  href={contactInfo.instagram_url || "#"}
                  aria-label="Instagram"
                  target={contactInfo.instagram_url ? "_blank" : undefined}
                  rel={contactInfo.instagram_url ? "noopener noreferrer" : undefined}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition duration-300 hover:-translate-y-1 hover:border-pink-400/40 hover:bg-pink-500/10 hover:text-pink-400"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle
                      cx="17.5"
                      cy="6.5"
                      r="1"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                </a>

                <a
                  href={contactInfo.linkedin_url || "#"}
                  aria-label="LinkedIn"
                  target={contactInfo.linkedin_url ? "_blank" : undefined}
                  rel={contactInfo.linkedin_url ? "noopener noreferrer" : undefined}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition duration-300 hover:-translate-y-1 hover:border-sky-400/40 hover:bg-sky-500/10 hover:text-sky-400"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M5.2 3.5A2.2 2.2 0 1 1 5.2 7.9a2.2 2.2 0 0 1 0-4.4ZM3.4 9h3.6v11.5H3.4V9Zm5.8 0h3.5v1.6h.1c.5-.9 1.7-2 3.5-2 3.7 0 4.4 2.4 4.4 5.5v6.4h-3.6v-5.7c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1v5.8H9.2V9Z" />
                  </svg>
                </a>

                {contactInfo.facebook_url && (
                  <a
                    href={contactInfo.facebook_url}
                    aria-label="Facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-400"
                  >
                    <span className="text-lg font-bold">f</span>
                  </a>
                )}
              </div>
            </div>

            {/* PRODUCT */}
            <div>
              <h3 className="text-sm font-semibold text-white">
                {t("product")}
              </h3>
              <ul className="mt-5 space-y-3">
                <li>
                  <a
                    href="#how-it-works"
                    className="text-sm text-slate-400 transition hover:text-sky-400"
                  >
                    {t("howItWorks")}
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-sm text-slate-400 transition hover:text-sky-400"
                  >
                    {t("features")}
                  </a>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-sm text-slate-400 transition hover:text-sky-400"
                  >
                    {t("getStarted")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-sm text-slate-400 transition hover:text-sky-400"
                  >
                    {t("signIn")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h3 className="text-sm font-semibold text-white">
                {t("company")}
              </h3>
              <ul className="mt-5 space-y-3">
                <li>
                  <a
                    href="#about"
                    className="text-sm text-slate-400 transition hover:text-sky-400"
                  >
                    {t("aboutLenex")}
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-sm text-slate-400 transition hover:text-sky-400"
                  >
                    {t("contact")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-400 transition hover:text-sky-400"
                  >
                    {t("careers")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-400 transition hover:text-sky-400"
                  >
                    {t("partners")}
                  </a>
                </li>
              </ul>
            </div>

            {/* RESOURCES */}
            <div>
              <h3 className="text-sm font-semibold text-white">
                {t("resources")}
              </h3>
              <ul className="mt-5 space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-400 transition hover:text-sky-400"
                  >
                    {t("helpCenter")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-400 transition hover:text-sky-400"
                  >
                    {t("documentation")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-400 transition hover:text-sky-400"
                  >
                    {t("guides")}
                  </a>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-sm text-slate-400 transition hover:text-sky-400"
                  >
                    {t("faqs")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* LEGAL */}
            <div>
              <h3 className="text-sm font-semibold text-white">
                {t("legal")}
              </h3>
              <ul className="mt-5 space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-400 transition hover:text-sky-400"
                  >
                    {t("privacyPolicy")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-400 transition hover:text-sky-400"
                  >
                    {t("termsOfService")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-400 transition hover:text-sky-400"
                  >
                    {t("cookiePolicy")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-400 transition hover:text-sky-400"
                  >
                    {t("security")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* CONTACT STRIP */}
          <div className="border-t border-white/10 py-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                {contactInfo.support_email && (
                  <a
                    href={`mailto:${contactInfo.support_email}`}
                    className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-sky-400"
                  >
                    <Mail size={16} />
                    {contactInfo.support_email}
                  </a>
                )}

                <span className="flex items-center gap-2 text-sm text-slate-400">
                  <MapPin size={16} />
                  {[contactInfo.city, contactInfo.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>

              <p className="text-sm text-slate-500">
                © {new Date().getFullYear()} LENEX. {t("allRightsReserved")}
              </p>
            </div>
          </div>

          {/* BOTTOM BRAND LINE */}
          <div className="relative flex items-center justify-center pb-8 pt-2">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />
            <span className="relative bg-slate-950 px-5 text-xs font-medium tracking-widest text-slate-600">
              LENEX
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}


/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-2xl text-center">

      <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-600">
        {eyebrow}
      </p>

      <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
        {title}
      </h2>

      <p className="mt-5 text-lg leading-8 text-gray-500">
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   STEP
========================================================= */

function Step({ number, title, description }) {
  return (
    <div className="group relative rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-50">

      <div className="flex items-center justify-between">

        <span className="text-sm font-bold text-sky-600">
          {number}
        </span>

        <span className="text-gray-300 transition group-hover:text-sky-400">
          →
        </span>

      </div>

      <h3 className="mt-8 text-xl font-bold text-gray-950">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-gray-500">
        {description}
      </p>

    </div>
  );
}


//Debt Preview
function DebtPreview({ name, description, amount, status }) {
  const { t } = useTranslation();

  const statusLabels = {
    OVERDUE: t("statusOverdue"),
    UNPAID: t("statusUnpaid"),
    PAID: t("statusPaid"),
  };

  const statusColors = {
    OVERDUE: "bg-red-50 text-red-600",
    UNPAID: "bg-yellow-50 text-yellow-700",
    PAID: "bg-green-50 text-green-600",
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 last:border-0 dark:border-slate-800">
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
          {name}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          {description}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-bold text-gray-900 dark:text-slate-100">
          {amount}
        </p>
        <span
          className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold ${statusColors[status] || "bg-gray-100 text-gray-600"}`}
        >
          {statusLabels[status] || status}
        </span>
      </div>
    </div>
  );
}


/* =========================================================
   BENEFIT / RECORD
========================================================= */

function Record({ title, value, type }) {
  const styles = {
    blue: "bg-sky-50 text-sky-600",
    yellow: "bg-yellow-50 text-yellow-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-slate-800">
  <div className="flex items-center gap-3">
    <span className={`h-2.5 w-2.5 rounded-full ${styles[type]}`} />

    <span className="text-sm font-medium text-gray-600 dark:text-slate-300">
      {title}
    </span>
  </div>

  <span className="font-bold text-gray-950 dark:text-white">
    {value}
  </span>
</div>
  );
}


/* =========================================================
   CONTACT INFO
========================================================= */

function ContactInfo({ title, value, icon }) {
  return (
    <div className="flex items-center gap-4">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-sky-400 ring-1 ring-gray-800">
        {icon}
      </div>

      <div>

        <p className="text-xs text-gray-500">
          {title}
        </p>

        <p className="mt-1 text-sm font-semibold text-white">
          {value}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   INPUT
========================================================= */

function Input({ label, placeholder, type }) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50"
      />

    </div>
  );
}

export default Home;