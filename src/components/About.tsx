import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Code2,
  Smartphone,
  Network,
  Cloud,
  ShieldCheck,
  Megaphone,
  Headphones,
} from "lucide-react";

/* Design-only data (no text) */
const serviceDesign = [
  {
    icon: Code2,
    color: "from-cyan-500 to-blue-500",
    glow: "rgba(6,182,212,0.22)",
    borderHover: "rgba(6,182,212,0.30)",
  },
  {
    icon: Smartphone,
    color: "from-blue-500 to-violet-500",
    glow: "rgba(59,130,246,0.22)",
    borderHover: "rgba(59,130,246,0.30)",
  },
  {
    icon: Network,
    color: "from-violet-500 to-purple-500",
    glow: "rgba(139,92,246,0.22)",
    borderHover: "rgba(139,92,246,0.30)",
  },
  {
    icon: Cloud,
    color: "from-cyan-400 to-teal-500",
    glow: "rgba(20,184,166,0.22)",
    borderHover: "rgba(20,184,166,0.30)",
  },
  {
    icon: ShieldCheck,
    color: "from-emerald-500 to-cyan-500",
    glow: "rgba(16,185,129,0.22)",
    borderHover: "rgba(16,185,129,0.30)",
  },
  {
    icon: Megaphone,
    color: "from-pink-500 to-violet-500",
    glow: "rgba(236,72,153,0.22)",
    borderHover: "rgba(236,72,153,0.30)",
  },
  {
    icon: Headphones,
    color: "from-amber-500 to-orange-500",
    glow: "rgba(245,158,11,0.22)",
    borderHover: "rgba(245,158,11,0.30)",
  },
];

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

const About = () => {
  const { t } = useTranslation();

  type SvcItem = { title: string; badge: string; description: string };
  const svcItems = t("services.items", { returnObjects: true }) as SvcItem[];
  const services = serviceDesign.map((d, i) => ({
    ...d,
    title: svcItems[i]?.title ?? "",
    subtitle: svcItems[i]?.badge ?? "",
    desc: svcItems[i]?.description ?? "",
  }));

  return (
    <section id="about" className="relative py-28 overflow-hidden">

      {/* ═══════════ BACKGROUND ═══════════ */}
      <div className="absolute inset-0 bg-[#050b18]" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(6,182,212,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

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
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-3 font-rajdhani text-xs uppercase tracking-[0.3em] text-cyan-400/70">
            {t("about.label")}
          </span>
          <h2 className="font-rajdhani text-4xl font-bold text-white md:text-5xl">
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              {t("about.title")}
            </span>
          </h2>
          <p className="mt-4 mx-auto max-w-xl font-cairo text-sm text-slate-400 leading-relaxed">
            {t("about.subtitle")}
          </p>
        </motion.div>

        {/* ── Bio Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <div className="relative rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm p-8 md:p-12 overflow-hidden">

            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-500/20 rounded-tr-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-violet-500/30 rounded-br-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-violet-500/20 rounded-bl-2xl pointer-events-none" />

            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(6,182,212,0.04)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <p className="mb-6 font-cairo text-base md:text-lg leading-[1.9] text-slate-300 text-justify">
                {t("about.bio1")}
              </p>
              <p className="mb-6 font-cairo text-base md:text-lg leading-[1.9] text-slate-400 text-justify">
                {t("about.bio2")}
              </p>
              <p className="mb-4 font-cairo text-base md:text-lg leading-[1.9] text-slate-400 text-justify">
                {t("about.bio3")}
              </p>
              <p className="font-cairo text-base md:text-lg leading-[1.9] text-slate-400 text-justify">
                {t("about.bio4")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Services Sub-header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block mb-3 font-rajdhani text-xs uppercase tracking-[0.3em] text-cyan-400/70">
            {t("services.label")}
          </span>
          <h3 className="font-rajdhani text-3xl font-bold text-white md:text-4xl">
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              {t("services.title")}
            </span>
          </h3>
          <p className="mt-4 mx-auto max-w-lg font-cairo text-sm text-slate-400 leading-relaxed">
            {t("services.subtitle")}
          </p>
        </motion.div>

        {/* ── Service Cards Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center"
        >
          {services.map((s, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="about-svc-card group relative flex flex-col rounded-2xl border border-slate-800/60 bg-slate-900/50 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:-translate-y-1 w-full"
              style={
                {
                  "--about-glow": s.glow,
                  "--about-border-hover": s.borderHover,
                } as React.CSSProperties
              }
            >
              {/* Gradient top bar */}
              <div className={`h-[3px] w-full bg-gradient-to-r ${s.color} opacity-70 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Card body */}
              <div className="flex flex-col items-center text-center flex-1 px-6 pt-7 pb-6">

                {/* Icon badge */}
                <div className="relative mb-4">
                  <div
                    className="absolute inset-0 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500"
                    style={{ background: s.glow }}
                  />
                  <div
                    className={`relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} shadow-lg`}
                  >
                    <s.icon className="h-7 w-7 text-white" strokeWidth={1.6} />
                  </div>
                </div>

                {/* Subtitle */}
                <span className="mb-1 font-rajdhani text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  {s.subtitle}
                </span>

                {/* Title */}
                <h4 className="mb-3 font-rajdhani text-base font-bold text-white leading-tight">
                  {s.title}
                </h4>

                {/* Divider */}
                <div className={`mb-4 h-[1px] w-8 rounded-full bg-gradient-to-r ${s.color}`} />

                {/* Description */}
                <p className="font-cairo text-xs leading-relaxed text-slate-400">
                  {s.desc}
                </p>
              </div>

              {/* Hover glow overlay */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${s.glow} 0%, transparent 70%)`,
                }}
              />

              {/* Hover border glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 0 1px ${s.borderHover}`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default About;
