import { motion } from "framer-motion";
import {
  Code2,
  Monitor,
  Smartphone,
  Server,
  Database,
  Settings,
  CircuitBoard,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useParams } from "react-router-dom";

interface SkillGroup {
  category: string;
  sub: string;
  icon: LucideIcon;
  color: string;
  glow: string;
  borderHover: string;
  items: string[];
}

const ICONS: LucideIcon[] = [Code2, Monitor, Smartphone, Server, Database, Settings, CircuitBoard];
const COLORS = [
  "from-cyan-500 to-blue-500",
  "from-blue-500 to-violet-500",
  "from-violet-500 to-purple-500",
  "from-teal-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-pink-500 to-rose-500",
];
const GLOWS = [
  "rgba(6,182,212,0.22)",
  "rgba(59,130,246,0.22)",
  "rgba(139,92,246,0.22)",
  "rgba(20,184,166,0.22)",
  "rgba(16,185,129,0.22)",
  "rgba(245,158,11,0.22)",
  "rgba(236,72,153,0.22)",
];
const BORDER_HOVERS = [
  "rgba(6,182,212,0.30)",
  "rgba(59,130,246,0.30)",
  "rgba(139,92,246,0.30)",
  "rgba(20,184,166,0.30)",
  "rgba(16,185,129,0.30)",
  "rgba(245,158,11,0.30)",
  "rgba(236,72,153,0.30)",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: "easeOut" as const },
  },
};

const Skills = () => {
  const { t } = useTranslation();
  const { locale } = useParams<{ locale: string }>();
  const { data: dbSkills, isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data } = await api.get('/portfolio/skills');
      return data;
    },
  });

  // Fallback map if db is empty (for transition)
  const legacyGroups: SkillGroup[] = (
    t("skills.groups", { returnObjects: true }) as Array<{ category: string; sub: string; items: string[] }>
  ).map((g, i) => ({
    ...g,
    icon: ICONS[i] || ICONS[0],
    color: COLORS[i] || COLORS[0],
    glow: GLOWS[i] || GLOWS[0],
    borderHover: BORDER_HOVERS[i] || BORDER_HOVERS[0],
  }));

  const activeGroups = dbSkills && dbSkills.length > 0
    ? dbSkills.map((g, i) => {
      // Find corresponding colors from the statically defined arrays to ensure design remains premium
      const idx = i % COLORS.length;
      return {
        ...g,
        icon: ICONS[idx] || ICONS[0],
        color: COLORS[idx],
        glow: GLOWS[idx],
        borderHover: BORDER_HOVERS[idx]
      };
    })
    : legacyGroups;

  const skillsTitle = t("skills.title");
  const skillsTitleLastSpace = skillsTitle.lastIndexOf(" ");
  const skillsTitlePart1 = skillsTitle.slice(0, skillsTitleLastSpace);
  const skillsTitlePart2 = skillsTitle.slice(skillsTitleLastSpace + 1);

  return (
    <section id="skills" className="relative py-28 overflow-hidden">

      {/* ═══════════ BACKGROUND ═══════════ */}
      <div className="absolute inset-0 bg-transparent" />

      {/* Plus-sign / dot grid pattern */}
      <div className="absolute inset-0 opacity-20 bg-pattern-plus-skills" />

      {/* Ambient blobs */}
      <div className="absolute top-[5%] left-[10%] h-[450px] w-[450px] rounded-full bg-cyan-600/5 blur-[140px]" />
      <div className="absolute bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[120px]" />
      <div className="absolute top-[50%] right-[30%] h-[300px] w-[300px] rounded-full bg-blue-600/4 blur-[100px]" />

      {/* Separators */}
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
            {t("skills.label")}
          </span>
          <h2 className="font-rajdhani text-4xl font-bold text-white md:text-5xl">
            {skillsTitlePart1}{" "}
            <span className="text-gradient-cyan-violet">
              {skillsTitlePart2}
            </span>
          </h2>
          <p className="mt-4 mx-auto max-w-xl font-cairo text-sm text-slate-400 leading-relaxed">
            {t("skills.description")}
          </p>
        </motion.div>

        {/* ── Skill Group Cards ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "100px" }}
          className="flex flex-wrap justify-center gap-5"
        >
          {isLoading ? (
            <div className="text-cyan-400 py-12 flex justify-center animate-pulse tracking-widest font-rajdhani uppercase text-sm w-full">Loading Skills...</div>
          ) : activeGroups.map((g) => (
            <motion.div
              key={g.category}
              variants={itemVariants}
              className="group relative flex flex-col card-interactive-panel w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.833rem)] xl:w-[calc(25%-0.9375rem)]"
              style={
                {
                  "--skill-glow": g.glow,
                  "--skill-border-hover": g.borderHover,
                } as React.CSSProperties
              }
            >
              {/* Gradient top bar */}
              <div
                className={`h-[3px] w-full bg-gradient-to-r ${g.color} opacity-70 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Card body */}
              <div className="flex flex-col items-center text-center flex-1 px-6 pt-7 pb-6">

                {/* Icon badge */}
                <div className="relative mb-4">
                  <div
                    className="absolute inset-0 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500 skill-glow-bg"
                  />
                  <div
                    className={`relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${g.color} shadow-lg`}
                  >
                    <g.icon className="h-7 w-7 text-white" strokeWidth={1.6} />
                  </div>
                </div>

                {/* Subtitle */}
                <span className="mb-1 font-rajdhani text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  {g.sub}
                </span>

                {/* Category title */}
                <h3 className="mb-3 font-rajdhani text-lg font-bold text-white leading-tight">
                  {g.category}
                </h3>

                {/* Gradient divider */}
                <div className={`mb-5 h-[1px] w-8 rounded-full bg-gradient-to-r ${g.color}`} />

                {/* Skill chips */}
                <div className="flex flex-wrap justify-center gap-1.5">
                  {g.items.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-lg border border-slate-700/50 bg-slate-800/50 px-2.5 py-1 font-cairo text-[11px] text-slate-400 transition-all duration-300 group-hover:border-slate-600/70 group-hover:text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover glow overlay */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none skill-overlay-bg"
              />

              {/* Hover border glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none skill-border-glow"
              />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Skills;
