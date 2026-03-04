import { motion } from "framer-motion";
import { ArrowDown, ChevronRight, Terminal, Cpu, Globe, Layers, Github, Linkedin, Send, Facebook, Instagram, MessageCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/hooks/useProfile";
import { renderColoredText } from "@/lib/renderColoredText";

/* ─── typing config ─── */
const TYPING_SPEED = 75;
const DELETING_SPEED = 35;
const PAUSE_AFTER_TYPE = 2200;

/* ─── stat defs — values overridden by profile from DB ─── */
const statKeys = [
  { key: "yearsExp" as const, labelKey: "hero.stats.yearsExp", suffix: "+", icon: Terminal, defaultVal: 5 },
  { key: "projectsCount" as const, labelKey: "hero.stats.projects", suffix: "+", icon: Layers, defaultVal: 30 },
  { key: "technologiesCount" as const, labelKey: "hero.stats.technologies", suffix: "+", icon: Cpu, defaultVal: 20 },
  { key: "countriesCount" as const, labelKey: "hero.stats.countries", suffix: "", icon: Globe, defaultVal: 3 },
];

/* ─── social links — fallback hrefs used if profile not yet loaded ─── */
const socialLinks = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    key: "linkedin" as const,
    fallback: "https://linkedin.com/in/youssefalsherief",
    hoverColor: "#3b82f6",
    hoverBg: "rgba(59,130,246,0.12)",
  },
  {
    icon: Github,
    label: "GitHub",
    key: "github" as const,
    fallback: "https://github.com/KINGMAN8888",
    hoverColor: "#e2e8f0",
    hoverBg: "rgba(226,232,240,0.08)",
  },
  {
    icon: Send,
    label: "Telegram",
    key: "telegram" as const,
    fallback: "https://t.me/KINGMAN_JOU",
    hoverColor: "#06b6d4",
    hoverBg: "rgba(6,182,212,0.12)",
  },
  {
    icon: Facebook,
    label: "Facebook",
    key: "facebook" as const,
    fallback: "https://facebook.com/kingsmanjou",
    hoverColor: "#60a5fa",
    hoverBg: "rgba(96,165,250,0.12)",
  },
  {
    icon: Instagram,
    label: "Instagram",
    key: "instagram" as const,
    fallback: "https://instagram.com/kingman_jou",
    hoverColor: "#f472b6",
    hoverBg: "rgba(244,114,182,0.12)",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    key: "whatsapp" as const,
    fallback: "https://wa.me/201097585951",
    hoverColor: "#34d399",
    hoverBg: "rgba(52,211,153,0.12)",
  },
];

/* ─── floating skill chips ─── */
const techChips = [
  { label: "React", color: "#61dafb" },
  { label: "Python", color: "#3b82f6" },
  { label: "AWS", color: "#f59e0b" },
  { label: "Docker", color: "#06b6d4" },
  { label: "AI/ML", color: "#8b5cf6" },
  { label: "Linux", color: "#10b981" },
];

/* ══════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════ */
const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = Math.ceil(value / 40);
        const timer = setInterval(() => {
          start += step;
          if (start >= value) { setCount(value); clearInterval(timer); }
          else setCount(start);
        }, 35);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ══════════════════════════════════════
   HERO
══════════════════════════════════════ */
const Hero = () => {
  const { t } = useTranslation();
  const i18nRoles = t("hero.roles", { returnObjects: true }) as string[];
  const { profile } = useProfile();
  // Use DB roles if available, fall back to i18n
  const roles = (profile?.heroRoles && profile.heroRoles.length > 0) ? profile.heroRoles : i18nRoles;

  // Split profile name into first/last for the two-line hero display
  // Falls back to i18n hardcoded values while profile is loading
  const fullName = profile?.name || t("nav.name");
  const nameParts = fullName.trim().split(" ");
  const nameFirst = nameParts.slice(0, -1).join(" ") || nameParts[0];
  const nameLast = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const heroTagline = profile?.headline || t("hero.tagline");
  const heroDescription = profile?.heroBio || null;
  const heroCyan = profile?.heroBioCyan;
  const heroViolet = profile?.heroBioViolet;

  // Build stats from profile (with i18n defaults while loading)
  const statDefs = statKeys.map(s => ({
    ...s,
    value: (profile?.[s.key] ?? s.defaultVal) as number,
  }));

  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length - 1 === 0) {
          setIsDeleting(false);
          setRoleIndex(p => (p + 1) % roles.length);
        }
      }
    }, isDeleting ? DELETING_SPEED : TYPING_SPEED);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex, roles]);

  return (
    <section className="hero-root relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent">

      {/* ── GRADIENT BASE ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/70 via-transparent to-[#020617]/80 pointer-events-none" />

      {/* ── HEX GRID OVERLAY ── */}
      <div className="absolute inset-0 hero-hex-grid opacity-20 pointer-events-none" />

      {/* ── AMBIENT GLOWS ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-[10%] h-[600px] w-[600px] rounded-full bg-cyan-500/5 blur-[180px]" />
        <div className="absolute bottom-0 right-[5%] h-[500px] w-[500px] rounded-full bg-violet-600/5 blur-[160px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-blue-600/4 blur-[120px]" />
      </div>

      {/* ── VIGNETTE ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(2,6,23,0.75)_100%)] pointer-events-none" />

      {/* ══════════ CONTENT ══════════ */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-16 flex items-center justify-start lg:justify-center">
        <div className="hero-grid">

          {/* ── PROFILE CARD (mobile: first / desktop: right) ── */}
          {/* NOTE: opacity starts at 1 so the LCP <img> is visibly painted immediately.
              Animating from opacity:0 would keep the image invisible until framer fires,
              inflating the LCP "element render delay" metric by ~1–3 s. */}
          <motion.div
            initial={{ opacity: 1, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="hero-card-col"
          >
            {/* ══ FRAMELESS PHOTO — unified mobile + desktop ══ */}
            <div className="relative hero-photo-frame mx-auto animate-float group">

              {/* Floating tech chips — desktop only */}
              {techChips.map((chip, i) => {
                const angle = (i / techChips.length) * Math.PI * 2;
                const rx = 54, ry = 46;
                const x = 50 + rx * Math.cos(angle);
                const y = 50 + ry * Math.sin(angle);
                return (
                  <motion.div
                    key={chip.label}
                    className="hero-tech-chip absolute hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-rajdhani font-bold uppercase tracking-wider backdrop-blur-md z-20 whitespace-nowrap"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: "translate(-50%,-50%)",
                      borderColor: chip.color + "55",
                      color: chip.color,
                      background: chip.color + "12",
                      boxShadow: `0 0 12px ${chip.color}30`,
                      "--chip-color": chip.color,
                    } as React.CSSProperties}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.15 }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full animate-pulse hero-chip-dot" />
                    {chip.label}
                  </motion.div>
                );
              })}

              {/* Soft ambient glow behind figure */}
              <div className="absolute inset-x-[10%] inset-y-[5%] bg-gradient-to-b from-cyan-500/10 via-blue-600/8 to-violet-600/10 blur-3xl rounded-full pointer-events-none animate-pulse-glow" />

              {/* Ground reflection */}
              <div className="absolute -bottom-3 left-[15%] right-[15%] h-6 bg-cyan-500/20 blur-2xl rounded-full pointer-events-none" />

              {/* Photo — transparent background */}
              <img
                src="/assets/CV.P.W.B-440.webp"
                srcSet="/assets/CV.P.W.B-440.webp 440w, /assets/CV.P.W.B-880.webp 880w, /assets/CV.P.W.B.webp 1000w"
                sizes="(max-width: 768px) 90vw, 440px"
                alt={t("nav.name")}
                className="relative z-10 w-full h-full object-contain select-none transition-transform duration-1000 group-hover:scale-[1.03] hero-photo-img"
                loading="eager"
                fetchPriority="high"
                width={480}
                height={560}
                draggable={false}
              />
            </div>
          </motion.div>

          {/* ── TEXT CONTENT (mobile: second / desktop: left, order-first) ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
            className="hero-text-col"
          >
            {/* Terminal role indicator */}
            <div className="flex justify-center lg:justify-start">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-800/80 bg-slate-950/70 px-3 py-1.5 backdrop-blur-sm"
              >
                <span className="text-cyan-500/50 font-mono text-xs select-none">~/dev $</span>
                <span className="text-slate-500 font-mono text-xs select-none">role=</span>
                <span className="text-cyan-300 font-mono text-xs tracking-wide">{text}</span>
                <span className="inline-block w-[1.5px] h-[12px] bg-cyan-400 animate-pulse" />
              </motion.div>
            </div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8 }}
              className="hero-name font-rajdhani font-black leading-[0.92] tracking-tight mb-4"
            >
              <span className="block bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                {nameFirst}
              </span>
              {nameLast && (
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent hero-name-glow">
                  {nameLast}
                </span>
              )}
            </motion.h1>

            {/* Divider with tagline (headline from profile) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="mb-5 flex items-center gap-3 justify-center lg:justify-start"
            >
              <span className="h-px w-6 bg-gradient-to-r from-transparent to-cyan-500/60" />
              <span className="font-rajdhani text-base sm:text-lg font-semibold tracking-widest text-slate-400 uppercase">
                {heroTagline}
              </span>
              <span className="h-px w-6 bg-gradient-to-l from-transparent to-violet-500/60" />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="mb-8 max-w-[520px] mx-auto lg:mx-0 font-cairo text-sm sm:text-base text-slate-400 leading-[1.85] text-center lg:text-left"
            >
              {heroDescription ? (
                renderColoredText(heroDescription, heroCyan, heroViolet)
              ) : (
                <>
                  {t("hero.descriptionPart1")}{" "}
                  <span className="text-cyan-400 font-semibold">{t("hero.descriptionCyan")}</span>{" "}{t("hero.descriptionMid")}{" "}
                  <span className="text-violet-400 font-semibold">{t("hero.descriptionViolet")}</span>
                  {" "}{t("hero.descriptionEnd")}
                </>
              )}
            </motion.p>

            {/* ── SOCIAL LINKS ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 }}
              className="mb-4 grid grid-cols-6 gap-2"
            >
              {socialLinks.map((s, i) => {
                const href = profile?.social?.[s.key] || s.fallback;
                return (
                  <motion.a
                    key={s.label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 + i * 0.05, duration: 0.35 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.93 }}
                    className={`relative flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-800/70 bg-slate-900/40 backdrop-blur-sm py-2.5 px-1 group/social transition-colors duration-300 social-theme-${i}`}
                  >
                    <s.icon className="h-[15px] w-[15px] text-slate-500 group-hover/social:text-[inherit] transition-colors duration-200" />
                    <span className="font-rajdhani text-[8px] uppercase tracking-widest text-slate-600 group-hover/social:text-[inherit] transition-colors duration-200 leading-none">
                      {s.label}
                    </span>
                    {/* bottom accent line */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-3/4 scale-x-0 group-hover/social:scale-x-100 origin-center transition-transform duration-400 rounded-full hero-social-accent" />
                  </motion.a>
                )
              })}
            </motion.div>

            {/* ── STATS ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05 }}
              className="hero-stats mb-8"
            >
              {statDefs.map((s) => (
                <div
                  key={s.labelKey}
                  className="hero-stat-item relative flex flex-col items-center justify-center rounded-xl border border-slate-800/70 bg-slate-900/40 backdrop-blur-sm py-3 px-2 gap-1 group hover:border-cyan-500/30 transition-colors duration-300"
                >
                  <s.icon className="h-3.5 w-3.5 text-cyan-500/60 mb-0.5" />
                  <span className="font-rajdhani text-xl sm:text-2xl font-black text-white">
                    <Counter value={s.value} suffix={s.suffix} />
                  </span>
                  <span className="font-rajdhani text-[10px] uppercase tracking-widest text-slate-600">
                    {t(s.labelKey)}
                  </span>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-3/4 bg-gradient-to-r from-cyan-500 to-violet-500 scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-500 rounded-full" />
                </div>
              ))}
            </motion.div>

            {/* ── CTA BUTTONS ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.55 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              {/* Primary */}
              <a
                href="#projects"
                className="hero-btn-primary group relative w-full sm:w-auto inline-flex h-13 items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-7 font-rajdhani text-sm font-bold uppercase tracking-widest text-white transition-[transform,box-shadow] duration-300 hover:shadow-[0_0_35px_rgba(6,182,212,0.45)] hover:scale-[1.02]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center gap-2">
                  {t("hero.viewProjects")}
                  <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </span>
              </a>

              {/* Secondary */}
              <a
                href="#contact"
                className="hero-btn-secondary group relative w-full sm:w-auto inline-flex h-13 items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/50 px-7 font-rajdhani text-sm font-bold uppercase tracking-widest text-slate-300 backdrop-blur-sm transition-[transform,box-shadow,border-color,color] duration-300 hover:border-cyan-500/40 hover:text-white hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] hover:scale-[1.02]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t("hero.contactMe")}
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </a>
            </motion.div>
          </motion.div>

        </div>{/* /hero-grid */}
      </div>

    </section>
  );
};

export default Hero;
