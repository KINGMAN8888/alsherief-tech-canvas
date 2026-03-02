import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Code2, Cpu, Cloud, Bot, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ServiceDesign {
  icon: LucideIcon;
  tags: string[];
  color: string;
  glow: string;
  borderHover: string;
}

const serviceDesign: ServiceDesign[] = [
  {
    icon: Code2,
    tags: ["React", "Node.js", "Flutter", "MongoDB", "TypeScript"],
    color: "from-cyan-500 to-blue-600",
    glow: "rgba(6,182,212,0.25)",
    borderHover: "rgba(6,182,212,0.35)",
  },
  {
    icon: Cpu,
    tags: ["Cisco", "Linux", "Windows Server", "TCP/IP", "VLANs"],
    color: "from-violet-500 to-purple-600",
    glow: "rgba(139,92,246,0.25)",
    borderHover: "rgba(139,92,246,0.35)",
  },
  {
    icon: Cloud,
    tags: ["AWS", "Azure", "Docker", "GitHub Actions", "Nginx"],
    color: "from-teal-400 to-cyan-600",
    glow: "rgba(20,184,166,0.25)",
    borderHover: "rgba(20,184,166,0.35)",
  },
  {
    icon: Bot,
    tags: ["Python", "OpenAI", "Selenium", "n8n", "Telegram API"],
    color: "from-pink-500 to-violet-600",
    glow: "rgba(236,72,153,0.25)",
    borderHover: "rgba(236,72,153,0.35)",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

const Services = () => {
  const { t } = useTranslation();

  type CardItem = { title: string; sub: string; description?: string; features: string[] };
  const cards = t("services.cards", { returnObjects: true }) as CardItem[];

  const services = serviceDesign.map((d, i) => ({
    ...d,
    title: cards[i]?.title ?? "",
    subtitle: cards[i]?.sub ?? "",
    description: cards[i]?.description ?? "",
    features: (cards[i]?.features ?? []) as string[],
  }));

  return (
    <section id="services" className="relative py-28 overflow-hidden">

      {/* ═══ BACKGROUND ═══ */}
      <div className="absolute inset-0 bg-transparent" />
      <div className="absolute inset-0 honeycomb-grid opacity-40" />
      <div className="absolute top-[10%] right-[15%] h-[420px] w-[420px] rounded-full bg-cyan-600/6 blur-[140px]" />
      <div className="absolute bottom-[5%] left-[10%] h-[360px] w-[360px] rounded-full bg-violet-600/6 blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(6,182,212,0.04)_0%,transparent_70%)]" />
      <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-violet-500/15 to-transparent" />

      {/* ═══ CONTENT ═══ */}
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
            {t("services.sectionLabel")}
          </span>
          <h2 className="font-rajdhani text-4xl font-bold text-white md:text-5xl">
            <span className="text-gradient-cyan-violet">
              {t("services.sectionTitle")}
            </span>
          </h2>
          <p className="mt-4 mx-auto max-w-xl font-cairo text-sm text-slate-400 leading-relaxed">
            {t("services.sectionSubtitle")}
          </p>
        </motion.div>

        {/* ── Service Cards Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "100px" }}
          className="flex flex-wrap justify-center gap-6"
        >
          {services.map((s, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`svc-card svc-theme-${idx} group relative flex flex-col card-interactive-panel w-full sm:w-[calc(50%-0.75rem)] xl:w-[calc(25%-1.125rem)]`}
            >
              {/* Gradient top bar */}
              <div className={`h-[3px] w-full bg-gradient-to-r ${s.color} opacity-70 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Card body */}
              <div className="flex flex-col items-center text-center flex-1 px-6 pt-8 pb-6">

                {/* Icon badge */}
                <div className="relative mb-5">
                  <div className="absolute inset-0 rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-500 svc-glow-bg" />
                  <div
                    className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} shadow-lg`}
                  >
                    <s.icon className="h-8 w-8 text-white" strokeWidth={1.6} />
                  </div>
                </div>

                {/* Subtitle */}
                <span className="mb-1 font-rajdhani text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  {s.subtitle}
                </span>

                {/* Title */}
                <h3 className="mb-3 font-rajdhani text-xl font-bold text-white leading-tight">
                  {s.title}
                </h3>

                {/* Divider */}
                <div className={`mb-4 h-[1px] w-10 rounded-full bg-gradient-to-r ${s.color}`} />

                {/* Description */}
                {s.description && (
                  <p className="mb-6 font-cairo text-sm leading-relaxed text-slate-400">
                    {s.description}
                  </p>
                )}

                {/* Feature list */}
                <ul className="mb-6 w-full space-y-2 text-left">
                  {s.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2">
                      <CheckCircle2
                        className="mt-[2px] h-[14px] w-[14px] flex-shrink-0 opacity-80 svc-icon-color"
                        strokeWidth={2}
                      />
                      <span className="font-cairo text-xs text-slate-400 leading-snug">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Tech tags */}
                <div className="mt-auto flex flex-wrap justify-center gap-1.5">
                  {s.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-700/60 bg-slate-800/50 px-2.5 py-0.5 font-rajdhani text-[10px] font-semibold uppercase tracking-wider text-slate-400 transition-colors duration-300 group-hover:border-slate-600/80 group-hover:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover glow overlay */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none svc-hover-overlay" />

              {/* Hover border glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none svc-hover-border" />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Services;
