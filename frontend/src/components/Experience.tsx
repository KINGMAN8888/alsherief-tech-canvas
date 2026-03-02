import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MapPin, Calendar } from "lucide-react";

const roleColors = [
  "from-cyan-500 to-blue-500",
  "from-violet-500 to-purple-500",
  "from-blue-500 to-indigo-500",
  "from-teal-500 to-cyan-500",
  "from-pink-500 to-violet-500",
];

const Experience = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  type Job = {
    role: string;
    company: string;
    location?: string;
    period: string;
    bullets: string[];
  };

  const jobs = t("experience.jobs", { returnObjects: true }) as Job[];

  return (
    <section id="experience" className="relative py-28 overflow-hidden">
      {/* ═══════════ BACKGROUND ═══════════ */}
      <div className="absolute inset-0 bg-transparent" />

      <div className="absolute inset-0 opacity-20 bg-pattern-grid-experience" />
      <div className="absolute top-[5%] left-[20%] h-[400px] w-[400px] rounded-full bg-cyan-600/5 blur-[130px]" />
      <div className="absolute bottom-[10%] right-[15%] h-[350px] w-[350px] rounded-full bg-violet-600/5 blur-[110px]" />
      <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-violet-500/15 to-transparent" />

      {/* ═══════════ CONTENT ═══════════ */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 md:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-3 font-rajdhani text-xs uppercase tracking-[0.3em] text-cyan-400/70">
            {t("experience.label")}
          </span>
          <h2 className="font-rajdhani text-4xl font-bold text-white md:text-5xl">
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              {t("experience.title")}
            </span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">

          {/* Vertical line */}
          <div
            className={`absolute top-0 bottom-0 w-[2px] ${isRTL
              ? "right-5 md:right-1/2 md:translate-x-[1px]"
              : "left-5 md:left-1/2 md:-translate-x-[1px]"
              }`}
          >
            <div className="h-full w-full bg-gradient-to-b from-cyan-500/60 via-blue-500/40 to-violet-500/60 shadow-[0_0_8px_rgba(6,182,212,0.3)]" />
          </div>

          {jobs.map((job, i) => {
            const color = roleColors[i % roleColors.length];
            // isLeft = card is on the LEFT side of the timeline
            // In RTL we mirror: even cards go to the right side (mirror of LTR even=left)
            const isLeft = i % 2 === 0;
            // In RTL, "isLeft" physically = RIGHT side (natural RTL block flow)
            // In LTR, "isLeft" physically = LEFT side

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative mb-12 md:w-1/2 ${isRTL
                  ? isLeft
                    // RTL right-side card: left edge faces center line → gap on left
                    ? "pr-14 md:pr-0 md:pl-14"
                    // RTL left-side card: right edge faces center line → gap on right
                    : "pr-14 md:mr-auto md:pr-14"
                  : isLeft
                    // LTR left-side card: right edge faces center line → gap on right
                    ? "pl-14 md:pl-0 md:pr-14"
                    // LTR right-side card: left edge faces center line → gap on left
                    : "pl-14 md:ml-auto md:pl-14"
                  }`}
              >
                {/* Timeline node */}
                <div
                  className={`absolute top-2 ${isRTL
                    ? `right-3 md:right-auto ${isLeft ? "md:-left-[9px]" : "md:-right-[9px]"}` // RTL: even=right card → node on left edge; odd=left card → node on right edge
                    : `left-3 md:left-auto ${isLeft ? "md:-right-[9px]" : "md:-left-[9px]"}` // LTR normal
                    }`}
                >
                  <div className={`relative h-[18px] w-[18px] rounded-full bg-gradient-to-br ${color} shadow-[0_0_12px_rgba(6,182,212,0.4)]`}>
                    <div className="absolute inset-[3px] rounded-full bg-[#020617]" />
                    <div className={`absolute inset-[5px] rounded-full bg-gradient-to-br ${color}`} />
                  </div>
                </div>

                {/* Card — text-right applied at card level for RTL */}
                <div className={`group relative rounded-xl border border-slate-800/60 bg-slate-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-800/30 overflow-hidden${isRTL ? " text-right" : ""}`}>

                  {/* Decorative corner */}
                  <div
                    className={`absolute top-0 w-10 h-10 border-cyan-500/20 ${isRTL
                      ? isLeft
                        ? "left-0 border-t-2 border-l-2 rounded-tl-xl"  // RTL right card → corner top-left
                        : "right-0 border-t-2 border-r-2 rounded-tr-xl" // RTL left  card → corner top-right
                      : isLeft
                        ? "right-0 border-t-2 border-r-2 rounded-tr-xl" // LTR left  card → corner top-right
                        : "left-0 border-t-2 border-l-2 rounded-tl-xl"  // LTR right card → corner top-left
                      }`}
                  />

                  {/* Period badge — always justify-end in RTL */}
                  <div className={`mb-3 flex ${isRTL ? "justify-end" : isLeft ? "justify-end" : "justify-start"
                    }`}>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/50 px-3 py-1">
                      <Calendar className="h-3 w-3 text-cyan-400/70" />
                      <span className="font-rajdhani text-xs font-semibold tracking-wide text-cyan-400/80">
                        {job.period}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="mb-1 font-rajdhani text-lg font-bold text-white">
                    {job.role}
                  </h3>

                  {/* Company + Location — always justify-end in RTL */}
                  <div className={`mb-3 flex items-center gap-2 flex-wrap ${isRTL ? "justify-end" : isLeft ? "justify-end" : "justify-start"
                    }`}>
                    <span className="font-cairo text-sm text-slate-400">{job.company}</span>
                    {job.location && (
                      <>
                        <span className="h-3 w-[1px] bg-slate-700" />
                        <span className={`inline-flex items-center gap-1 text-xs text-slate-500${isRTL ? " flex-row-reverse" : ""}`}>
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Bullets — always flex-row-reverse in RTL */}
                  <ul className="space-y-2">
                    {job.bullets.map((bullet, j) => (
                      <li
                        key={j}
                        className={`flex items-start gap-2${isRTL
                          ? " flex-row-reverse"                            // ALL RTL bullets: dot on left, text on right
                          : isLeft ? " md:flex-row-reverse" : ""           // LTR: only left cards flip
                          }`}
                      >
                        <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r ${color}`} />
                        <span className="font-cairo text-sm leading-relaxed text-slate-400">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Hover bottom line */}
                  <div className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r ${color} opacity-0 transition-opacity duration-300 group-hover:opacity-50`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
