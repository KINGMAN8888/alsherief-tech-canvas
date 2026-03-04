import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Layers,
  Wrench,
  Loader2,
  FileText,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const ProjectDetail = () => {
  const { slug, locale } = useParams<{ slug: string; locale: string }>();
  const { t } = useTranslation();
  const loc = locale ?? "en";

  const { data: allProjects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await api.get("/portfolio/projects");
      return data;
    },
  });

  const project = allProjects?.find((p: any) => p.slug === slug);

  // Title and description: DB first, i18n fallback
  const projectTitle = project
    ? ((loc === "ar" && project.titleAr) ? project.titleAr : project.title || t(`projects.items.${slug}.title`, { defaultValue: project.slug }))
    : (slug ? t(`projects.items.${slug}.title`, { defaultValue: slug ?? "" }) : "");

  const projectDescription = project
    ? ((loc === "ar" && project.descriptionAr) ? project.descriptionAr : project.description || "")
    : (slug ? t(`projects.items.${slug}.description`, { defaultValue: "" }) : "");

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#020617]">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center pt-20">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-[#020617]">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="mb-4 font-rajdhani text-4xl font-bold text-white">{t("projects.notFound")}</h1>
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
  const metaDescription = projectDescription.slice(0, 160);
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: projectTitle,
    description: metaDescription,
    author: { "@type": "Person", name: "Youssef AlSherief", url: "https://youssefalsherief.tech" },
    url: project.link ?? canonicalUrl,
    ...(project.github ? { codeRepository: project.github } : {}),
    applicationCategory: "WebApplication",
    keywords: (project.tech ?? []).join(", "),
    image: project.image,
  });

  const hasReadme = typeof project.readmeRaw === "string" && project.readmeRaw.trim().length > 50;

  return (
    <main className="min-h-screen bg-[#020617]">
      <Helmet>
        <title>{projectTitle} — Project — Youssef AlSherief</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={`${projectTitle} — Youssef AlSherief`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={project.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${projectTitle} — Youssef AlSherief`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={project.image} />
        <script type="application/ld+json">{jsonLd}</script>
      </Helmet>
      <Navbar />

      {/* ═══════════ HERO ═══════════ */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={project.image} alt="" className="h-full w-full object-cover opacity-20 blur-sm" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/60 via-[#020617]/80 to-[#020617]" />
        </div>
        <div className="absolute top-0 left-[20%] h-[300px] w-[300px] rounded-full bg-cyan-600/8 blur-[120px]" />
        <div className="absolute bottom-0 right-[20%] h-[250px] w-[250px] rounded-full bg-violet-600/6 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-32 md:px-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Link
              to={`/${loc}/#projects`}
              className="group mb-8 inline-flex items-center gap-2 font-rajdhani text-sm font-semibold text-slate-400 transition-colors hover:text-cyan-400"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {t("projects.backToProjects")}
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {project.emoji && <span className="text-5xl">{project.emoji}</span>}
              <div>
                <h1 className="font-rajdhani text-3xl font-bold text-white md:text-4xl lg:text-5xl">{projectTitle}</h1>
                {project.language && (
                  <span className="mt-1 inline-block font-rajdhani text-sm text-slate-500">{project.language}</span>
                )}
              </div>
            </div>
            {projectDescription && (
              <p className="mb-6 max-w-3xl font-cairo text-base leading-relaxed text-slate-400">{projectDescription}</p>
            )}
          </motion.div>

          {/* Tech + stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap items-center gap-3"
          >
            {(project.tech ?? []).map((tech: string) => (
              <span key={tech} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-1.5 font-rajdhani text-xs font-medium text-slate-300 backdrop-blur-sm">
                <Layers className="h-3 w-3 text-cyan-400/60" />
                {tech}
              </span>
            ))}
            {project.stars > 0 && (
              <span className="font-rajdhani text-sm text-slate-500">⭐ {project.stars}</span>
            )}
            {project.forks > 0 && (
              <span className="font-rajdhani text-sm text-slate-500">🍴 {project.forks}</span>
            )}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      </div>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <div className="relative">
        <div className="absolute inset-0 bg-[#020617]" />
        <div className="absolute inset-0 project-radial-grid opacity-15" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:px-8">
          {/* Preview image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12 overflow-hidden rounded-2xl border border-slate-800/60"
          >
            <div className="relative">
              <img
                src={project.image} alt={projectTitle} className="w-full object-cover" loading="eager"
                onError={(e) => { (e.target as HTMLImageElement).closest(".mb-12")?.classList.add("hidden"); }}
              />
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${project.color || "from-cyan-500 to-blue-500"}`} />
            </div>
          </motion.div>

          <div className="grid gap-10 lg:grid-cols-3">

            {/* ─── LEFT: README content ─────────────────────────────────────── */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl border border-slate-800/60 bg-slate-900/30 p-8 backdrop-blur-sm"
              >
                {hasReadme ? (
                  <>
                    <div className="mb-6 flex items-center gap-3 border-b border-slate-800/60 pb-5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <h2 className="font-rajdhani text-xl font-bold text-white">README</h2>
                    </div>
                    <MarkdownRenderer content={project.readmeRaw} />
                  </>
                ) : (
                  /* Fallback when no README was fetched */
                  <div>
                    <div className="mb-6 flex items-center gap-3 border-b border-slate-800/60 pb-5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <h2 className="font-rajdhani text-xl font-bold text-white">{t("projects.overview")}</h2>
                    </div>
                    <p className="font-cairo text-sm leading-[1.9] text-slate-400">{projectDescription}</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* ─── RIGHT: Sidebar ───────────────────────────────────────────── */}
            <div className="space-y-6">
              {/* Tech Stack card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6 backdrop-blur-sm sticky top-28"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500">
                    <Wrench className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="font-rajdhani text-lg font-bold text-white">{t("projects.techStack")}</h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(project.tech ?? []).map((tech: string) => (
                    <span key={tech} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800/50 px-3 py-1.5 font-rajdhani text-xs font-medium text-slate-300">
                      <Layers className="h-3 w-3 text-cyan-400/60" />
                      {tech}
                    </span>
                  ))}
                </div>

                {/* GitHub stats */}
                {(project.stars > 0 || project.forks > 0) && (
                  <div className="mt-5 flex gap-5 border-t border-slate-800/60 pt-4 font-rajdhani text-sm text-slate-400">
                    {project.stars > 0 && <span>⭐ {project.stars} stars</span>}
                    {project.forks > 0 && <span>🍴 {project.forks} forks</span>}
                  </div>
                )}

                {/* Action links */}
                <div className="mt-5 space-y-3 border-t border-slate-800/60 pt-5">
                  {project.link && (
                    <a
                      href={project.link} target="_blank" rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-3 font-rajdhani text-sm font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t("projects.viewLiveDemo")}
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github} target="_blank" rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/40 py-3 font-rajdhani text-sm font-bold text-slate-300 transition-all hover:border-slate-600 hover:text-white"
                    >
                      <Github className="h-4 w-4" />
                      {t("projects.viewSourceCode")}
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom nav */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 border-t border-slate-800/60 pt-8"
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
