
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import {
  Check,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Building2,
  Users,
  ChartNoAxesCombined,
  Wallet,
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Everything you need to start managing customer debts.",
    monthlyPrice: "Free",
    yearlyPrice: "Free",
    period: "forever",
    icon: Wallet,
    popular: false,
    button: "Start for free",
    link: "/register",
    features: [
      "Customer management",
      "Record customer debts",
      "Track payments",
      "View outstanding balances",
      "Basic business dashboard",
    ],
  },
  {
    name: "Professional",
    description: "More control and insights for growing businesses.",
    monthlyPrice: "Coming soon",
    yearlyPrice: "Coming soon",
    period: "per month",
    icon: Zap,
    popular: true,
    button: "Get started",
    link: "/register",
    features: [
      "Everything in Starter",
      "Advanced debt tracking",
      "Payment reminders",
      "Advanced reports",
      "Business performance insights",
      "Priority support",
    ],
  },
  {
    name: "Business",
    description: "Flexible solutions for businesses with bigger needs.",
    monthlyPrice: "Custom",
    yearlyPrice: "Custom",
    period: "pricing",
    icon: Building2,
    popular: false,
    button: "Talk to us",
    link: "/#contact",
    features: [
      "Everything in Professional",
      "Multiple business users",
      "Advanced business analytics",
      "Dedicated assistance",
      "Custom business solutions",
    ],
  },
];

const comparison = [
  {
    category: "Debt management",
    icon: Wallet,
    features: [
      ["Customer records", true, true, true],
      ["Debt recording", true, true, true],
      ["Payment tracking", true, true, true],
      ["Outstanding balance tracking", true, true, true],
    ],
  },
  {
    category: "Business insights",
    icon: ChartNoAxesCombined,
    features: [
      ["Basic dashboard", true, true, true],
      ["Advanced reports", false, true, true],
      ["Business analytics", false, true, true],
    ],
  },
  {
    category: "Business support",
    icon: Users,
    features: [
      ["Payment reminders", false, true, true],
      ["Priority support", false, true, true],
      ["Multiple users", false, false, true],
    ],
  },
];

function Pricing() {
  const [billing, setBilling] = useState("monthly");

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 pt-28 text-slate-900 transition-colors duration-300 dark:bg-[#050b1c] dark:text-white">
     <Navbar />
      {/* HERO */}
      <section className="relative px-4 pb-16 pt-8 sm:px-6">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative mx-auto w-full max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400">
            <Sparkles size={15} />
            LENEX Pricing
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Simple plans.
            <span className="block text-sky-500">
              Smarter debt management.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">
            Choose the tools that fit your business. Start organizing
            customer debts, tracking payments, and taking control of
            your business finances.
          </p>

          {/* BILLING SWITCH */}
          <div className="mt-9 inline-flex items-center rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                billing === "monthly"
                  ? "bg-sky-600 text-white shadow-md shadow-sky-500/20"
                  : "text-slate-500 hover:text-sky-600 dark:text-slate-400"
              }`}
            >
              Monthly
            </button>

            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                billing === "yearly"
                  ? "bg-sky-600 text-white shadow-md shadow-sky-500/20"
                  : "text-slate-500 hover:text-sky-600 dark:text-slate-400"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 px-4 pb-24 sm:px-6 lg:grid-cols-3 lg:items-stretch">
        {plans.map((plan) => {
          const Icon = plan.icon;

          return (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-2 ${
                plan.popular
                  ? "border-sky-500 bg-white shadow-2xl shadow-sky-500/10 dark:bg-slate-900"
                  : "border-slate-200 bg-white shadow-sm hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-sky-600 px-4 py-1.5 text-xs font-bold tracking-wide text-white shadow-lg shadow-sky-500/30">
                  RECOMMENDED
                </div>
              )}

              <div className="mb-6 flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  plan.popular
                    ? "bg-sky-600 text-white"
                    : "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400"
                }`}>
                  <Icon size={23} />
                </div>

                {plan.popular && (
                  <Sparkles size={20} className="text-sky-500" />
                )}
              </div>

              <h2 className="text-xl font-extrabold">{plan.name}</h2>

              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {plan.description}
              </p>

              <div className="my-7">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight">
                    {billing === "monthly"
                      ? plan.monthlyPrice
                      : plan.yearlyPrice}
                  </span>

                  {plan.name === "Starter" && (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      / forever
                    </span>
                  )}
                </div>

                {plan.name !== "Starter" && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {plan.name === "Professional"
                      ? "Subscription details coming soon"
                      : "Contact us for a tailored offer"}
                  </p>
                )}
              </div>

              <Link
                to={plan.link}
                className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 ${
                  plan.popular
                    ? "bg-sky-600 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-700"
                    : "border border-slate-200 text-slate-800 hover:border-sky-500 hover:text-sky-600 dark:border-slate-700 dark:text-white dark:hover:border-sky-500 dark:hover:text-sky-400"
                }`}
              >
                {plan.button}
                <ArrowRight size={17} />
              </Link>

              <div className="my-7 border-t border-slate-100 dark:border-slate-800" />

              <p className="mb-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                What's included
              </p>

              <ul className="flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check size={17} className="mt-0.5 shrink-0 text-sky-500" />
                    <span className="text-slate-600 dark:text-slate-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>

      {/* FEATURE COMPARISON */}
      <section className="border-y border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-500">
              Compare plans
            </span>

            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Find what works for you
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">
              Explore the tools available in each LENEX plan and choose
              what best supports your business.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900">
                  <th className="p-5 text-sm font-bold">Features</th>
                  <th className="p-5 text-center text-sm font-bold">Starter</th>
                  <th className="bg-sky-50/70 p-5 text-center text-sm font-bold text-sky-700 dark:bg-sky-500/10 dark:text-sky-400">
                    Professional
                  </th>
                  <th className="p-5 text-center text-sm font-bold">Business</th>
                </tr>
              </thead>

              <tbody>
                {comparison.map((group) => {
                  const Icon = group.icon;

                  return (
                    <>
                      <tr key={group.category}>
                        <td
                          colSpan={4}
                          className="border-t border-slate-200 bg-slate-50/70 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/40"
                        >
                          <div className="flex items-center gap-2 text-sm font-bold">
                            <Icon size={17} className="text-sky-500" />
                            {group.category}
                          </div>
                        </td>
                      </tr>

                      {group.features.map(([name, starter, pro, business]) => (
                        <tr
                          key={name}
                          className="border-t border-slate-100 dark:border-slate-800"
                        >
                          <td className="p-5 text-sm text-slate-600 dark:text-slate-300">
                            {name}
                          </td>

                          {[starter, pro, business].map((included, index) => (
                            <td
                              key={index}
                              className={`p-5 text-center ${
                                index === 1
                                  ? "bg-sky-50/50 dark:bg-sky-500/5"
                                  : ""
                              }`}
                            >
                              {included ? (
                                <Check
                                  size={19}
                                  className="mx-auto text-sky-500"
                                />
                              ) : (
                                <span className="text-slate-300 dark:text-slate-700">
                                  —
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Feature availability is subject to the final plan configuration.
          </p>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 px-4 py-16 sm:grid-cols-3 sm:px-6">
        {[
          {
            icon: ShieldCheck,
            title: "Your business, organized",
            text: "Keep customer debt records and payments organized.",
          },
          {
            icon: ChartNoAxesCombined,
            title: "Better visibility",
            text: "Understand outstanding balances and payment activity.",
          },
          {
            icon: Users,
            title: "Built for businesses",
            text: "Tools designed to support your business growth.",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                <Icon size={21} />
              </div>

              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* FINAL CTA */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 to-blue-700 px-6 py-14 text-center text-white shadow-2xl shadow-sky-900/10 sm:px-12">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Your business deserves better control.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-sky-100 sm:text-base">
            Start managing customer debts smarter with LENEX.
            Bring clarity to every balance and every payment.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-sky-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            Get started today
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

        {/* Copyright */}
    <p className="text-sm text-slate-500">
      © 2026 LENEX. "All rights reserved"
    </p>
    </main>
  );
}

export default Pricing;
