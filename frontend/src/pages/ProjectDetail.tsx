import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  CheckCircle2,
  Layers,
  Wrench,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { projects } from "@/data/projects";
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const ProjectDetail = () => {
  const { slug, locale } = useParams<{ slug: string; locale: string }>();
  const { t } = useTranslation();
  const project = projects.find((p) => p.slug === slug);
  const loc = locale ?? "en";

  const projectTitle = slug ? t(`projects.items.${slug}.title`) : "";
  const projectDescription = slug ? t(`projects.items.${slug}.description`) : "";
  const projectLongDescription = slug ? t(`projects.items.${slug}.longDescription`) : "";
  const projectFeatures = slug
    ? (t(`projects.items.${slug}.features`, { returnObjects: true }) as string[])
    : [];
  const projectChallenges = slug ? t(`projects.items.${slug}.challenges`) : "";
  const projectTechDetails = slug ? t(`projects.items.${slug}.techDetails`) : "";

  if (!project) {
    return (
      <main className="min-h-screen bg-[#020617]">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="mb-4 font-rajdhani text-4xl font-bold text-white">
              {t("projects.notFound")}
            </h1>
            <Link
              to={`/${loc}/`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/50 px-6 py-3 font-rajdhani text-sm font-semibold text-cyan-400 backdrop-blur-sm transition-all hover:border-cyan-500/40 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("projects.backToHome")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const canonicalUrl = `https://youssefalsherief.tech/${loc}/projects/${slug}`;
  const metaDescription = (projectDescription || projectLongDescription).slice(0, 160);
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: projectTitle,
    description: metaDescription,
    author: {
      "@type": "Person",
      name: "Youssef AlSherief",
      url: "https://youssefalsherief.tech",
    },
    url: project.link ?? canonicalUrl,
    ...(project.github ? { codeRepository: project.github } : {}),
    applicationCategory: "WebApplication",
    keywords: project.tech.join(", "),
    image: project.image,
  });

  return (
    <main className="min-h-screen bg-[#020617]">
      <Helmet>
        <title>{projectTitle} — Project — Youssef AlSherief</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Youssef AlSherief — Portfolio" />
        <meta property="og:title" content={`${projectTitle} — Youssef AlSherief`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={project.image} />
        <meta property="og:image:alt" content={projectTitle} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@YousefSaberjou" />
        <meta name="twitter:creator" content="@YousefSaberjou" />
        <meta name="twitter:title" content={`${projectTitle} — Youssef AlSherief`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={project.image} />

        {/* JSON-LD */}
        <script type="application/ld+json">{jsonLd}</script>
      </Helmet>
      <Navbar />

      {/* ═══════════ HERO BANNER ═══════════ */}
      <div className="relative overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src={project.image}
            alt=""
            className="h-full w-full object-cover opacity-20 blur-sm"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/60 via-[#020617]/80 to-[#020617]" />
        </div>

        {/* Ambient blobs */}
        <div className="absolute top-0 left-[20%] h-[300px] w-[300px] rounded-full bg-cyan-600/8 blur-[120px]" />
        <div className="absolute bottom-0 right-[20%] h-[250px] w-[250px] rounded-full bg-violet-600/6 blur-[100px]" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-32 md:px-8">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to={`/${loc}/#projects`}
              className="group mb-8 inline-flex items-center gap-2 font-rajdhani text-sm font-semibold text-slate-400 transition-colors hover:text-cyan-400"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {t("projects.backToProjects")}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 md:flex-row md:items-end md:gap-8"
          >
            {/* Emoji + Title */}
            <div className="flex-1">
              <span className="mb-4 inline-block text-5xl drop-shadow-lg">
                {project.emoji}
              </span>
              <h1 className="mb-3 font-rajdhani text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                {projectTitle}
              </h1>
              <p className="max-w-2xl font-cairo text-base text-slate-400 leading-relaxed text-justify">
                {projectDescription}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 font-rajdhani text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
                  <ExternalLink className="h-4 w-4" />
                  {t("projects.liveDemo")}
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/50 px-6 font-rajdhani text-sm font-bold uppercase tracking-wider text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/40 hover:text-white"
                >
                  <Github className="h-4 w-4" />
                  {t("projects.sourceCode")}
                </a>
              )}
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-1.5 font-rajdhani text-xs font-medium text-slate-300 backdrop-blur-sm"
              >
                <Layers className="h-3 w-3 text-cyan-400/60" />
                {tech}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Bottom separator */}
        <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      </div>

      {/* ═══════════ CONTENT SECTIONS ═══════════ */}
      <div className="relative">
        {/* Background */}
        <div className="absolute inset-0 bg-[#020617]" />
        <div className="absolute inset-0 project-radial-grid opacity-15" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 md:px-8">
          {/* Project Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12 overflow-hidden rounded-2xl border border-slate-800/60"
          >
            <div className="relative">
              <img
                src={project.image}
                alt={projectTitle}
                className="w-full object-cover"
                loading="eager"
                onError={(e) => {
                  (e.target as HTMLImageElement).closest("div.mb-12")?.classList.add("hidden");
                }}
              />
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${project.color}`} />
            </div>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content — Left Column */}
            <div className="space-y-8 lg:col-span-2">
              {/* Overview */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-8 backdrop-blur-sm overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-cyan-500/20 rounded-tl-2xl" />
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="font-rajdhani text-xl font-bold text-white">
                    {t("projects.overview")}
                  </h2>
                </div>
                <p className="font-cairo text-sm leading-[1.9] text-slate-400 text-justify">
                  {projectLongDescription}
                </p>
              </motion.section>

              {/* Key Features */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-8 backdrop-blur-sm overflow-hidden relative"
              >
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-violet-500/20 rounded-br-2xl" />
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="font-rajdhani text-xl font-bold text-white">
                    {t("projects.keyFeatures")}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {projectFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                        className="flex items-start gap-3 w-full"
                      >
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" />
                        <span className="font-cairo text-sm leading-relaxed text-slate-400">
                          {feature}
                        </span>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </motion.section>

              {/* Challenges & Solutions */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-8 backdrop-blur-sm overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-amber-500/20 rounded-tr-2xl" />
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                    <AlertTriangle className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="font-rajdhani text-xl font-bold text-white">
                    {t("projects.challengesSolutions")}
                  </h2>
                </div>
                <p className="font-cairo text-sm leading-[1.9] text-slate-400 text-justify">
                  {projectChallenges}
                </p>
              </motion.section>
            </div>

            {/* Sidebar — Right Column */}
            <div className="space-y-8">
              {/* Technical Details */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-7 backdrop-blur-sm overflow-hidden sticky top-28"
              >
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-blue-500/20 rounded-bl-2xl" />
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500">
                    <Wrench className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="font-rajdhani text-xl font-bold text-white">
                    {t("projects.techStack")}
                  </h2>
                </div>

                {/* Tech chips */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800/50 px-3 py-1.5 font-rajdhani text-xs font-medium text-slate-300"
                    >
                      <Layers className="h-3 w-3 text-cyan-400/60" />
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Details */}
                <div className="border-t border-slate-800/60 pt-5">
                  <p className="font-cairo text-sm leading-[1.9] text-slate-400 text-justify">
                    {projectTechDetails}
                  </p>
                </div>

                {/* Links */}
                <div className="mt-6 space-y-3 border-t border-slate-800/60 pt-5">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-3 font-rajdhani text-sm font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t("projects.viewLiveDemo")}
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 py-3 font-rajdhani text-sm font-bold text-slate-300 transition-all hover:border-slate-600 hover:text-white"
                    >
                      <Github className="h-4 w-4" />
                      {t("projects.viewSourceCode")}
                    </a>
                  )}
                </div>
              </motion.section>
            </div>
          </div>

          {/* Bottom Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 flex items-center justify-between border-t border-slate-800/60 pt-8"
          >
            <Link
              to={`/${loc}/#projects`}
              className="group inline-flex items-center gap-2 font-rajdhani text-sm font-semibold text-slate-400 transition-colors hover:text-cyan-400"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {t("projects.allProjects")}
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default ProjectDetail;
