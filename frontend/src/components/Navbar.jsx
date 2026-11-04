
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

import {
  Home,
  Info,
  Mail,
  ArrowUp,
  Menu,
  X,
  UserPlus,
} from "lucide-react";

function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", id: "home", icon: Home },
    { name: "About", id: "about", icon: Info },
    { name: "Contact", id: "contact", icon: Mail },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      setIsScrolled(scrollY > 80);
      setShowBackToTop(scrollY > 400);

      let currentSection = "home";
      const scrollPosition = scrollY + 150;

      navLinks.forEach(({ id }) => {
        const section = document.getElementById(id);

        if (section && section.offsetTop <= scrollPosition) {
          currentSection = id;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveSection("home");
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* FLOATING NAVBAR */}
      <header
        className={`
          fixed left-1/2 z-50 -translate-x-1/2
          transition-all duration-500 ease-in-out
          ${isScrolled ? "top-5 w-fit" : "top-4 w-[94%] max-w-7xl"}
        `}
      >
        <div
          className={`
            mx-auto flex items-center justify-between
            rounded-2xl border border-gray-200/80
            bg-white/90 backdrop-blur-xl
            shadow-xl shadow-slate-900/10
            transition-all duration-500
            dark:border-slate-700 dark:bg-slate-900/90
            dark:shadow-black/40

            ${
              isScrolled
                ? "w-fit gap-3 px-3 py-2.5 sm:gap-5 sm:px-5"
                : "w-full px-4 py-3 sm:px-6"
            }
          `}
        >
          {/* LOGO */}
          <Link
            to="/"
            onClick={scrollToTop}
            aria-label="LENEX home"
            className="flex shrink-0 items-center gap-2.5"
          >
            <div className={`
              flex items-center justify-center rounded-xl
              bg-sky-600 text-white shadow-lg shadow-sky-500/20
              transition-all duration-300
              ${isScrolled ? "h-9 w-9" : "h-10 w-10"}
            `}>
              <span className="text-lg font-bold">L</span>
            </div>

            <div className={isScrolled ? "hidden md:block" : "block"}>
              <h1 className="text-lg font-bold tracking-tight text-gray-950 dark:text-white">
                LENEX
              </h1>
              <p className="text-[10px] font-medium text-gray-400 dark:text-slate-400">
                Debt Management
              </p>
            </div>
          </Link>

          {/* NAVIGATION ICONS - MOBILE AND DESKTOP */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;

              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  title={link.name}
                  aria-label={link.name}
                  aria-current={isActive ? "location" : undefined}
                  className={`
                    flex h-10 w-10 items-center justify-center
                    rounded-xl transition-all duration-300
                    ${
                      isActive
                        ? "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400"
                        : "text-gray-500 hover:bg-gray-100 hover:text-sky-600 dark:text-slate-400 dark:hover:bg-slate-800"
                    }
                  `}
                >
                  <Icon size={19} strokeWidth={2} />
                </button>
              );
            })}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* DESKTOP GET STARTED */}
            <Link
              to="/register"
              className="
                hidden md:flex items-center gap-2
                rounded-xl bg-sky-600 px-4 py-2.5
                text-sm font-semibold text-white
                shadow-sm transition hover:-translate-y-0.5
                hover:bg-sky-700 hover:shadow-lg
              "
            >
              <UserPlus size={17} />
              Get started
            </Link>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl border border-gray-200
                bg-white text-gray-700 transition
                hover:bg-gray-100
                dark:border-slate-700 dark:bg-slate-800
                dark:text-white dark:hover:bg-slate-700
                md:hidden
              "
            >
              {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN */}
        <div
          className={`
            absolute left-0 right-0 top-full mt-3
            rounded-2xl border border-gray-200
            bg-white p-3 shadow-2xl
            transition-all duration-300
            dark:border-slate-700 dark:bg-slate-900
            md:hidden
            ${
              mobileMenuOpen
                ? "visible translate-y-0 opacity-100"
                : "invisible -translate-y-2 opacity-0 pointer-events-none"
            }
          `}
        >
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  className="
                    flex w-full items-center gap-3
                    rounded-xl px-4 py-3 text-left
                    text-sm font-semibold text-gray-600
                    transition hover:bg-sky-50 hover:text-sky-600
                    dark:text-slate-300 dark:hover:bg-slate-800
                  "
                >
                  <Icon size={19} />
                  {link.name}
                </button>
              );
            })}
          </div>

          <div className="my-3 border-t border-gray-100 dark:border-slate-700" />

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="
                flex items-center justify-center rounded-xl
                border border-gray-200 px-3 py-3
                text-sm font-semibold text-gray-700
                dark:border-slate-700 dark:text-white
              "
            >
              Sign in
            </Link>

            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="
                flex items-center justify-center gap-2
                rounded-xl bg-sky-600 px-3 py-3
                text-sm font-semibold text-white
              "
            >
              <UserPlus size={17} />
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* BACK TO TOP */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          title="Back to top"
          className="
            fixed bottom-6 right-6 z-50
            flex h-12 w-12 items-center justify-center
            rounded-full bg-sky-600 text-white
            shadow-lg shadow-sky-200
            transition-all duration-300
            hover:-translate-y-1 hover:bg-sky-700
            dark:shadow-sky-900/40
          "
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
}

export default Navbar;
