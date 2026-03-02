import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download, ChevronRight, Globe } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/hooks/useProfile";

const langs = [
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "ar", label: "عر", flag: "🇸🇦" },
  { code: "ru", label: "RU", flag: "🇷🇺" },
] as const;

const navLinks = [
  { key: "about", href: "#about" },
  { key: "services", href: "#services" },
  { key: "experience", href: "#experience" },
  { key: "projects", href: "#projects" },
  { key: "education", href: "#education" },
  { key: "certs", href: "#certifications" },
  { key: "skills", href: "#skills" },
  { key: "blog", href: "#blog" },
  { key: "contact", href: "#contact" },
];


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { locale } = useParams<{ locale: string }>();
  const { t } = useTranslation();
  const { profile } = useProfile();

  // Display name and role from profile DB, fall back to i18n text while loading
  const displayName = profile?.name || t("nav.name");
  const displayRole = profile?.headline || t("nav.role");


  /* ── Scroll state + progress ── */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      setScrollProgress(pct);
      // expose progress as a CSS variable so we can avoid inline width styles
      document.documentElement.style.setProperty("--scroll-progress", `${pct}%`);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Active section via scroll position ── */
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.replace("#", ""));

    const updateActive = () => {
      const trigger = window.scrollY + window.innerHeight * 0.35;
      let current = "";

      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= trigger) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, []);

  /* ── Lock body scroll when mobile menu open ── */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* ── Close lang dropdown on outside click ── */
  useEffect(() => {
    if (!langOpen) return;
    const handler = () => setLangOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [langOpen]);

  const getHref = (hash: string) => `/${locale ?? "en"}${hash}`;

  const isActive = (href: string) =>
    activeSection === href.replace("#", "");

  const switchLocale = (code: string) => {
    // Keep the current sub-path (e.g., /projects/slug) when switching locale
    const segments = location.pathname.split("/").filter(Boolean);
    // segments[0] is the current locale; replace it
    const rest = segments.slice(1);
    const newPath = rest.length > 0 ? `/${code}/${rest.join("/")}` : `/${code}`;
    navigate(newPath);
    setLangOpen(false);
    setOpen(false);
  };

  const currentLang = langs.find((l) => l.code === locale) ?? langs[0];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? "bg-[#020810]/90 backdrop-blur-xl border-b border-slate-800/60 shadow-[0_4px_32px_rgba(0,0,0,0.5)]"
            : "bg-transparent"
          }`}
      >
        {/* Scroll progress bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-800/40">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 nav-progress"
            transition={{ duration: 0.1 }}
          />
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8 py-3">

          {/* ── Logo ── */}
          <a
            href={location.pathname === "/" ? "#" : `/${locale ?? "en"}`}
            className="flex items-center gap-2.5 group"
          >
            <div className="flex flex-col leading-none">
              <span className="font-rajdhani text-base font-bold text-white tracking-wide leading-none">
                {displayName}
              </span>
              <span className="font-rajdhani text-[9px] uppercase tracking-[0.25em] text-cyan-400/60 leading-none mt-0.5">
                {displayRole}
              </span>
            </div>
          </a>

          {/* ── Desktop links ── */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={getHref(l.href)}
                className={`relative px-3 py-1.5 font-rajdhani text-sm font-semibold tracking-wide transition-colors duration-200 rounded-lg ${isActive(l.href)
                    ? "text-cyan-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
              >
                {isActive(l.href) && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{t(`nav.${l.key}`)}</span>
              </a>
            ))}
          </div>

          {/* ── Desktop CTA ── */}
          <div className="hidden items-center gap-3 lg:flex">

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/50 px-3 font-rajdhani text-sm font-bold text-slate-300 transition-all duration-200 hover:border-slate-600 hover:text-white"
                aria-label="Switch language"
              >
                <Globe className="h-3.5 w-3.5 text-cyan-400/70" />
                <span>{currentLang.flag}</span>
                <span>{currentLang.label}</span>
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 right-0 w-32 rounded-xl border border-slate-700/60 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden z-[200]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {langs.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => switchLocale(lang.code)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 font-rajdhani text-sm font-semibold transition-colors duration-150 ${locale === lang.code
                            ? "text-cyan-400 bg-cyan-500/10"
                            : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                          }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                        {locale === lang.code && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="/assets/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-9 items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 font-rajdhani text-sm font-bold uppercase tracking-wider text-cyan-400 transition-all duration-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
            >
              <Download className="h-3.5 w-3.5" />
              {t("nav.downloadCv")}
            </a>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-800/60 text-slate-400 transition-colors hover:border-slate-600 hover:text-white lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={t("nav.closeMenu")}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 35 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-[#020810]/98 backdrop-blur-xl border-l border-slate-800/60 lg:hidden flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="font-rajdhani text-sm font-bold text-white">{t("nav.navigation")}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t("nav.closeMenu")}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 overflow-y-auto px-4 py-6">
                <div className="space-y-1">
                  {navLinks.map((l, i) => (
                    <motion.a
                      key={l.href}
                      href={getHref(l.href)}
                      onClick={() => setOpen(false)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 font-rajdhani text-base font-semibold tracking-wide transition-all duration-200 ${isActive(l.href)
                          ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                          : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                        }`}
                    >
                      <span>{t(`nav.${l.key}`)}</span>
                      <ChevronRight
                        className={`h-4 w-4 transition-colors ${isActive(l.href) ? "text-cyan-400" : "text-slate-600"
                          }`}
                      />
                    </motion.a>
                  ))}
                </div>

                {/* Mobile language switcher */}
                <div className="mt-6 pt-4 border-t border-slate-800/60">
                  <p className="mb-3 px-4 font-rajdhani text-[10px] uppercase tracking-[0.25em] text-slate-600">{t("nav.language")}</p>
                  <div className="flex gap-2 px-2">
                    {langs.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => switchLocale(lang.code)}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border py-2 font-rajdhani text-xs font-bold transition-all duration-150 ${locale === lang.code
                            ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                            : "border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-white"
                          }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </nav>

              {/* Drawer footer */}
              <div className="px-4 py-5 border-t border-slate-800/60">
                <a
                  href="/assets/cv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 font-rajdhani text-sm font-bold uppercase tracking-wider text-white shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-shadow duration-300"
                >
                  <Download className="h-4 w-4" />
                  {t("nav.downloadCv")}
                </a>
                <div className="mt-3 flex items-center justify-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-cairo text-[11px] text-slate-500">{t("nav.available")}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
