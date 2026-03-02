import { motion } from "framer-motion";
import { ExternalLink, ArrowRight, Github, Layers } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const Projects = () => {
  const { t } = useTranslation();
  const { locale } = useParams<{ locale: string }>();

  const { data: dbProjects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get('/portfolio/projects');
      return data;
    },
  });

  const projects = dbProjects || [];

  const projectsTitle = t("projects.title");
  const projectsTitleLastSpace = projectsTitle.lastIndexOf(" ");
  const projectsTitlePart1 = projectsTitle.slice(0, projectsTitleLastSpace);
  const projectsTitlePart2 = projectsTitle.slice(projectsTitleLastSpace + 1);

  return (
    <section id="projects" className="relative py-28 overflow-hidden">
      {/* ═══════════ BACKGROUND ═══════════ */}
      <div className="absolute inset-0 bg-transparent" />

      {/* Dotted matrix pattern */}
      <div className="absolute inset-0 opacity-25 bg-pattern-dots-projects" />

      {/* Ambient glow blobs */}
      <div className="absolute top-[10%] left-[5%] h-[500px] w-[500px] rounded-full bg-cyan-600/5 blur-[150px]" />
      <div className="absolute bottom-[5%] right-[10%] h-[450px] w-[450px] rounded-full bg-violet-600/5 blur-[130px]" />
      <div className="absolute top-[60%] left-[50%] h-[300px] w-[300px] rounded-full bg-blue-600/4 blur-[100px]" />

      {/* Top separator */}
      <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-violet-500/15 to-transparent" />

      {/* ═══════════ CONTENT ═══════════ */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-3 font-rajdhani text-xs uppercase tracking-[0.3em] text-cyan-400/70">
            {t("projects.label")}
          </span>
          <h2 className="font-rajdhani text-4xl font-bold text-white md:text-5xl">
            {projectsTitlePart1}{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              {projectsTitlePart2}
            </span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto font-cairo text-base text-slate-400">
            {t("projects.description")}
          </p>
        </motion.div>

        {/* Project Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "100px" }}
          className="flex flex-wrap justify-center gap-6"
        >
          {isLoading ? (
            <div className="text-cyan-400 py-12 flex justify-center animate-pulse tracking-widest font-rajdhani uppercase text-sm">Loading Projects Data...</div>
          ) : projects.map((p, i) => {
            // Use DB fields directly if they exist, fallback to translation keys for legacy data
            const title = p.title_en && locale === 'ar' && p.title_ar
              ? p.title_ar
              : p.title_en || t(`projects.items.${p.slug}.title`, p.slug || 'Project');

            const description = p.description_en && locale === 'ar' && p.description_ar
              ? p.description_ar
              : p.description_en || t(`projects.items.${p.slug}.description`, 'No description available.');
            return (
              <motion.div
                key={p.slug}
                variants={itemVariants}
                className="group relative flex flex-col rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-slate-700/80 hover:bg-slate-800/20 cursor-pointer w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
              >
                {/* Full-card link overlay */}
                <Link
                  to={`/${locale}/projects/${p.slug}`}
                  className="absolute inset-0 z-0"
                  aria-label={title}
                  tabIndex={-1}
                />

                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={p.image}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  {/* Fallback if image fails */}
                  <div className="hidden absolute inset-0 items-center justify-center bg-slate-900/80">
                    <span className="text-6xl">{p.emoji}</span>
                  </div>

                  {/* Image overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030a16] via-[#030a16]/40 to-transparent" />

                  {/* Top gradient accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${p.color} opacity-70 group-hover:opacity-100 transition-opacity duration-300`} />

                  {/* Emoji badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-2xl drop-shadow-lg">{p.emoji}</span>
                  </div>

                  {/* GitHub badge */}
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={t("projects.githubRepo")}
                      aria-label={t("projects.githubRepo")}
                      className="z-10 absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 text-slate-400 transition-all duration-300 hover:text-white hover:border-cyan-500/50 hover:bg-slate-800/80"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-1 flex-col p-6">
                  {/* Title */}
                  <h3 className="mb-2 font-rajdhani text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="mb-4 flex-1 font-cairo text-sm leading-relaxed text-slate-400 text-justify">
                    {description}
                  </p>

                  {/* Tech Stack */}
                  <div className="mb-5 flex flex-wrap gap-2">
                    {p.tech.map((techItem) => (
                      <span
                        key={techItem}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-700/50 bg-slate-800/50 px-2.5 py-1 font-rajdhani text-xs font-medium text-slate-300"
                      >
                        <Layers className="h-3 w-3 text-cyan-400/60" />
                        {techItem}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-1 border-t border-slate-800/60">
                    <Link
                      to={`/${locale}/projects/${p.slug}`}
                      className="group/link inline-flex items-center gap-1.5 pt-3 font-rajdhani text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
                    >
                      {t(`projects.viewDetails`)}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 pt-3 font-rajdhani text-sm font-semibold text-slate-400 transition-colors hover:text-white"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {t(`projects.liveDemo`)}
                      </a>
                    )}
                  </div>
                </div>

                {/* Hover bottom gradient line */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${p.color} opacity-0 transition-opacity duration-400 group-hover:opacity-70`}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
