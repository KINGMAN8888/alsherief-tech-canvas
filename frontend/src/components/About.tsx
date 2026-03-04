import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useApiQuery } from "@/hooks/useApiHooks";
import { useEffect } from "react";
import type { ElementType } from "react";
import { Circle } from "lucide-react";
import { ICON_REGISTRY } from "@/lib/iconRegistry";
import LoadingSpinner from "./LoadingSpinner";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: "easeOut" as const } },
};

interface AboutData {
  label?: string;
  labelAr?: string;
  title?: string;
  titleAr?: string;
  subtitle?: string;
  subtitleAr?: string;
  bio1?: string;
  bio1Ar?: string;
  bio2?: string;
  bio2Ar?: string;
  bio3?: string;
  bio3Ar?: string;
  bio4?: string;
  bio4Ar?: string;
  servicesLabel?: string;
  servicesLabelAr?: string;
  servicesTitle?: string;
  servicesTitleAr?: string;
  servicesSubtitle?: string;
  servicesSubtitleAr?: string;
}

interface ServiceData {
  id: string;
  title: string;
  titleAr?: string;
  badge: string;
  badgeAr?: string;
  description: string;
  descriptionAr?: string;
  icon: string;
  color: string;
  glow: string;
  borderHover: string;
  order: number;
}

const About = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { data: aboutDataArray, isLoading: loadingAbout } = useApiQuery<AboutData>("about");
  const { data: servicesData, isLoading: loadingServices } = useApiQuery<ServiceData>("about/services");

  const aboutData = aboutDataArray?.[0];

  // Inject dynamic CSS classes for service-specific styles (avoids inline style props)
  useEffect(() => {
    if (!servicesData) return;
    servicesData.forEach((s) => {
      const cardClass = `about-svc-card-${s.id}`;
      const glowClass = `about-svc-glow-${s.id}`;
      const overlayClass = `about-svc-glow-${s.id}-overlay`;
      const borderClass = `about-svc-glow-${s.id}-border`;
      if (!document.getElementById(`style-${cardClass}`)) {
        const styleEl = document.createElement("style");
        styleEl.id = `style-${cardClass}`;
        styleEl.innerHTML = `
          .${cardClass} { --about-glow: ${s.glow}; --about-border-hover: ${s.borderHover}; }
          .${glowClass} { background: ${s.glow}; }
          .${overlayClass} { background: radial-gradient(ellipse 80% 60% at 50% 0%, ${s.glow} 0%, transparent 70%); }
          .${borderClass} { box-shadow: inset 0 0 0 1px ${s.borderHover}; }
        `;
        document.head.appendChild(styleEl);
      }
    });
  }, [servicesData]);

  // Fallback to i18n if DB is empty for some reason
  const label = isRTL ? (aboutData?.labelAr || t("about.label")) : (aboutData?.label || t("about.label"));
  const title = isRTL ? (aboutData?.titleAr || t("about.title")) : (aboutData?.title || t("about.title"));
  const subtitle = isRTL ? (aboutData?.subtitleAr || t("about.subtitle")) : (aboutData?.subtitle || t("about.subtitle"));

  const bio1 = isRTL ? (aboutData?.bio1Ar || t("about.bio1")) : (aboutData?.bio1 || t("about.bio1"));
  const bio2 = isRTL ? (aboutData?.bio2Ar || t("about.bio2")) : (aboutData?.bio2 || t("about.bio2"));
  const bio3 = isRTL ? (aboutData?.bio3Ar || t("about.bio3")) : (aboutData?.bio3 || t("about.bio3"));
  const bio4 = isRTL ? (aboutData?.bio4Ar || t("about.bio4")) : (aboutData?.bio4 || t("about.bio4"));

  const servicesLabel = isRTL ? (aboutData?.servicesLabelAr || t("services.label")) : (aboutData?.servicesLabel || t("services.label"));
  const servicesTitle = isRTL ? (aboutData?.servicesTitleAr || t("services.title")) : (aboutData?.servicesTitle || t("services.title"));
  const servicesSubtitle = isRTL ? (aboutData?.servicesSubtitleAr || t("services.subtitle")) : (aboutData?.servicesSubtitle || t("services.subtitle"));

  return (
    <section id="about" className="relative py-28 overflow-hidden">
      {/* ═══════════ BACKGROUND ═══════════ */}
      <div className="absolute inset-0 bg-transparent" />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[length:32px_32px]" />

      {/* Ambient blobs */}
      <div className="absolute top-0 left-[20%] h-[400px] w-[400px] rounded-full bg-cyan-600/5 blur-[120px]" />
      <div className="absolute bottom-0 right-[10%] h-[350px] w-[350px] rounded-full bg-violet-600/5 blur-[100px]" />

      {/* Top separator */}
      <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-violet-500/15 to-transparent" />

      {/* ═══════════ CONTENT ═══════════ */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-3 font-rajdhani text-xs uppercase tracking-[0.3em] text-cyan-400/70">
            {label}
          </span>
          <h2 className="font-rajdhani text-4xl font-bold text-white md:text-5xl">
            <span className="text-gradient-cyan-violet">
              {title}
            </span>
          </h2>
          <p className="mt-4 mx-auto max-w-xl font-cairo text-sm text-slate-400 leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* ── Bio Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "100px" }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <div className="relative card-glass-panel p-8 md:p-12">

            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-500/20 rounded-tr-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-violet-500/30 rounded-br-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-violet-500/20 rounded-bl-2xl pointer-events-none" />

            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(6,182,212,0.04)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <p className="mb-6 font-cairo text-base md:text-lg leading-[1.9] text-slate-300 text-justify">
                {bio1}
              </p>
              <p className="mb-6 font-cairo text-base md:text-lg leading-[1.9] text-slate-400 text-justify">
                {bio2}
              </p>
              {bio3 && (
                <p className="mb-4 font-cairo text-base md:text-lg leading-[1.9] text-slate-400 text-justify">
                  {bio3}
                </p>
              )}
              {bio4 && (
                <p className="font-cairo text-base md:text-lg leading-[1.9] text-slate-400 text-justify">
                  {bio4}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Services Sub-header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block mb-3 font-rajdhani text-xs uppercase tracking-[0.3em] text-cyan-400/70">
            {servicesLabel}
          </span>
          <h3 className="font-rajdhani text-3xl font-bold text-white md:text-4xl">
            <span className="text-gradient-cyan-violet">
              {servicesTitle}
            </span>
          </h3>
          <p className="mt-4 mx-auto max-w-lg font-cairo text-sm text-slate-400 leading-relaxed">
            {servicesSubtitle}
          </p>
        </motion.div>

        {/* ── Service Cards Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "100px" }}
          className="flex flex-wrap justify-center gap-5"
        >
          {loadingServices ? (
            <div className="w-full text-cyan-400 py-12 flex justify-center animate-pulse tracking-widest font-rajdhani uppercase text-sm">Loading Services...</div>
          ) : servicesData?.map((s, i) => {
            const IconNode: ElementType = ICON_REGISTRY[s.icon] || Circle;
            const title = isRTL ? (s.titleAr || s.title) : s.title;
            const badge = isRTL ? (s.badgeAr || s.badge) : s.badge;
            const desc = isRTL ? (s.descriptionAr || s.description) : s.description;

            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`about-svc-card group relative flex flex-col card-interactive-panel w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.833rem)] xl:w-[calc(25%-0.9375rem)] about-svc-card-${s.id}`}
              >
                {/* Gradient top bar */}
                <div className={`h-[3px] w-full bg-gradient-to-r ${s.color} opacity-70 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Card body */}
                <div className="flex flex-col items-center text-center flex-1 px-6 pt-7 pb-6">

                  {/* Icon badge */}
                  <div className="relative mb-4">
                    <div
                      className={`absolute inset-0 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500 about-svc-glow-${s.id}`}
                    />
                    <div
                      className={`relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} shadow-lg`}
                    >
                      <IconNode className="h-7 w-7 text-white" strokeWidth={1.6} />
                    </div>
                  </div>

                  {/* Subtitle */}
                  <span className="mb-1 font-rajdhani text-[10px] uppercase tracking-[0.25em] text-slate-500">
                    {badge}
                  </span>

                  {/* Title */}
                  <h4 className="mb-3 font-rajdhani text-base font-bold text-white leading-tight">
                    {title}
                  </h4>

                  {/* Divider */}
                  <div className={`mb-4 h-[1px] w-8 rounded-full bg-gradient-to-r ${s.color}`} />

                  {/* Description */}
                  <p className="font-cairo text-xs leading-relaxed text-slate-400">
                    {desc}
                  </p>
                </div>

                {/* Hover glow overlay */}
                <div
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none about-svc-glow-${s.id}-overlay`}
                />

                {/* Hover border glow */}
                <div
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none about-svc-glow-${s.id}-border`}
                />
              </motion.div>
            )
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default About;
