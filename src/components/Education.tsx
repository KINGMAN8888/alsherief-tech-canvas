import { motion } from "framer-motion";
import {
  GraduationCap,
  Award,
  Calendar,
  MapPin,
  BookOpen,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const Education = () => {
  const { t } = useTranslation();

  const educationData = (
    t("education.degrees", { returnObjects: true }) as Array<{
      degree: string;
      institution: string;
      location?: string;
      period: string;
    }>
  ).map((d, i) => ({
    ...d,
    color: [
      "from-cyan-500 to-blue-500",
      "from-violet-500 to-purple-500",
      "from-blue-500 to-indigo-500",
    ][i],
  }));

  const certGroupsData = (
    t("education.certGroups", { returnObjects: true }) as Array<{
      category: string;
      items: string[];
    }>
  ).map((g, i) => ({
    ...g,
    color: [
      "from-cyan-500 to-blue-500",
      "from-emerald-500 to-teal-500",
      "from-blue-500 to-violet-500",
      "from-violet-500 to-purple-500",
      "from-emerald-400 to-cyan-500",
      "from-pink-500 to-rose-500",
    ][i],
  }));

  const languagesList = t("education.languages", {
    returnObjects: true,
  }) as string[];

  const languageLevels = [100, 90, 70];

  const eduTitle = t("education.title");
  const eduTitleLastSpace = eduTitle.lastIndexOf(" ");
  const eduTitlePart1 = eduTitle.slice(0, eduTitleLastSpace);
  const eduTitlePart2 = eduTitle.slice(eduTitleLastSpace + 1);

  return (
    <section id="education" className="relative py-28 overflow-hidden">
      {/* ═══════════ BACKGROUND ═══════════ */}
      <div className="absolute inset-0 bg-[#040d1a]" />

      {/* Cross-hatch pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(45deg, rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(-45deg, rgba(139,92,246,0.03) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Ambient glow blobs */}
      <div className="absolute top-[15%] right-[10%] h-[400px] w-[400px] rounded-full bg-cyan-600/5 blur-[130px]" />
      <div className="absolute bottom-[10%] left-[15%] h-[350px] w-[350px] rounded-full bg-violet-600/5 blur-[110px]" />

      {/* Top separator */}
      <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-violet-500/15 to-transparent" />

      {/* ═══════════ CONTENT ═══════════ */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-3 font-rajdhani text-xs uppercase tracking-[0.3em] text-cyan-400/70">
            {t("education.label")}
          </span>
          <h2 className="font-rajdhani text-4xl font-bold text-white md:text-5xl">
            {eduTitlePart1}{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              {eduTitlePart2}
            </span>
          </h2>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-5">
          {/* ═══════ Academic Education — Left Column ═══════ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-7 backdrop-blur-sm overflow-hidden relative h-full">
              {/* Decorative corner */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-cyan-500/20 rounded-tl-2xl" />

              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-rajdhani text-xl font-bold text-white">
                  {t("education.label")}
                </h3>
              </div>

              {/* Education Timeline */}
              <div className="relative space-y-6">
                {/* Vertical line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-cyan-500/40 via-blue-500/30 to-violet-500/40" />

                {educationData.map((e, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="relative pl-8"
                  >
                    {/* Node */}
                    <div className="absolute left-0 top-1">
                      <div
                        className={`h-4 w-4 rounded-full bg-gradient-to-br ${e.color} shadow-[0_0_10px_rgba(6,182,212,0.3)]`}
                      >
                        <div className="absolute inset-[3px] rounded-full bg-[#040d1a]" />
                        <div
                          className={`absolute inset-[5px] rounded-full bg-gradient-to-br ${e.color}`}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <h4 className="font-rajdhani text-base font-bold text-white mb-1">
                      {e.degree}
                    </h4>
                    <p className="font-cairo text-sm text-slate-400 mb-1">
                      {e.institution}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-xs text-cyan-400/70">
                        <Calendar className="h-3 w-3" />
                        {e.period}
                      </span>
                      {e.location && (
                        <>
                          <span className="h-3 w-[1px] bg-slate-700" />
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="h-3 w-3" />
                            {e.location}
                          </span>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Languages */}
              <div className="mt-8 pt-6 border-t border-slate-800/60">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-1 w-5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500" />
                  <span className="font-rajdhani text-sm font-bold uppercase tracking-wide text-slate-300">
                    {t("education.languagesTitle")}
                  </span>
                </div>
                <div className="space-y-4">
                  {languagesList.map((langStr, i) => {
                    const pct = languageLevels[i] ?? 70;
                    const [name, level] = langStr.replace(")", "").split(" (");
                    return (
                      <div key={langStr}>
                        <div className="mb-1.5 flex justify-between">
                          <span className="font-rajdhani text-sm font-semibold text-white">
                            {name}
                          </span>
                          <span className="font-rajdhani text-xs font-semibold text-cyan-400/80">
                            {level}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-800/70 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ═══════ Certifications — Right Column ═══════ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-7 backdrop-blur-sm overflow-hidden relative h-full">
              {/* Decorative corner */}
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-violet-500/20 rounded-br-2xl" />

              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-rajdhani text-xl font-bold text-white">
                  {t("education.certsTitle")}
                </h3>
              </div>

              {/* Cert Groups */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="space-y-6"
              >
                {certGroupsData.map((g) => (
                  <motion.div key={g.category} variants={itemVariants}>
                    {/* Category Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`h-1 w-5 rounded-full bg-gradient-to-r ${g.color}`}
                      />
                      <span className="font-rajdhani text-sm font-bold uppercase tracking-wide text-slate-300">
                        {g.category}
                      </span>
                    </div>

                    {/* Cert Chips */}
                    <div className="flex flex-wrap gap-2">
                      {g.items.map((item) => (
                        <span
                          key={item}
                          className="group inline-flex items-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-1.5 font-cairo text-xs text-slate-300 transition-all duration-300 hover:border-slate-600/80 hover:bg-slate-700/40"
                        >
                          <BookOpen className="h-3 w-3 text-cyan-400/50 group-hover:text-cyan-400/80 transition-colors" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Education;
