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
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

type DbSection = {
  heading: string;
  level?: number;
  isBulletList?: boolean;
  bullets?: string[];
  prose?: string;
  codeBlocks?: string[];
  isEmpty?: boolean;
};

const PALETTES = [
  { gradient: "from-cyan-500 to-blue-500", border: "border-cyan-500/20", icon: <BookOpen className="h-4 w-4 text-white" /> },
  { gradient: "from-emerald-500 to-cyan-500", border: "border-violet-500/20", icon: <CheckCircle2 className="h-4 w-4 text-white" /> },
  { gradient: "from-amber-500 to-orange-500", border: "border-amber-500/20", icon: <AlertTriangle className="h-4 w-4 text-white" /> },
  { gradient: "from-blue-500 to-violet-500", border: "border-blue-500/20", icon: <BookOpen className="h-4 w-4 text-white" /> },
  { gradient: "from-violet-500 to-pink-500", border: "border-pink-500/20", icon: <CheckCircle2 className="h-4 w-4 text-white" /> },
];

function getPalette(heading: string, idx: number) {
  const h = heading.toLowerCase();
  if (/feature|highlight|capabilit|what.+offer|function/i.test(h)) return PALETTES[1];
  if (/challenge|problem|difficult|issue/i.test(h)) return PALETTES[2];
  if (/tech|stack|built.with|architect|tool/i.test(h)) return PALETTES[3];
  if (/overview|about|intro|description|summary/i.test(h) || !heading) return PALETTES[0];
  return PALETTES[idx % PALETTES.length];
}

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

  // DB fields first, i18n fallback for legacy projects
  const projectTitle = project
    ? ((loc === "ar" && project.titleAr) ? project.titleAr : project.title || t(`projects.items.${slug}.title`, { defaultValue: project.slug }))
    : (slug ? t(`projects.items.${slug}.title`, { defaultValue: slug ?? "" }) : "");

  const projectDescription = project
    ? ((loc === "ar" && project.descriptionAr) ? project.descriptionAr : project.description || t(`projects.items.${slug}.description`, { defaultValue: "" }))
    : (slug ? t(`projects.items.${slug}.description`, { defaultValue: "" }) : "");

  const i18nLongDesc = slug ? t(`projects.items.${slug}.longDescription`, { defaultValue: "" }) : "";
  const projectLongDescription = project?.longDescription || i18nLongDesc || projectDescription;

  const i18nRawFeatures = slug ? t(`projects.items.${slug}.features`, { returnObjects: true, defaultValue: [] }) : [];
  const i18nFeatures: string[] = Array.isArray(i18nRawFeatures) ? i18nRawFeatures : [];
  const dbFeatures: string[] = Array.isArray(project?.features) ? (project.features as string[]) : [];
  const projectFeatures: string[] = dbFeatures.length > 0 ? dbFeatures : i18nFeatures;

  const projectChallenges = project?.challenges || (slug ? t(`projects.items.${slug}.challenges`, { defaultValue: "" }) : "");
  const projectTechDetails = project?.techDetails || (slug ? t(`projects.items.${slug}.techDetails`, { defaultValue: "" }) : "");

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
  const metaDescription = (projectDescription || projectLongDescription).slice(0, 160);
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: projectTitle,
    description: metaDescription,
    author: { "@type": "Person", name: "Youssef AlSherief", url: "https://youssefalsherief.tech" },
    url: project.link ?? canonicalUrl,
    ...(project.github ? { codeRepository: project.github } : {}),
    applicationCategory: "WebApplication",
    keywords: project.tech?.join(", ") ?? "",
    image: project.image,
  });

  // DB sections (dynamic from README parser)
  const dbSections: DbSection[] = Array.isArray(project.sections) ? project.sections : [];

  return (
    <main className="min-h-screen bg-[#020617]">
      <Helmet>
        <title>{projectTitle} — Project — Youssef AlSherief</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Youssef AlSherief — Portfolio" />
        <meta property="og:title" content={`${projectTitle} — Youssef AlSherief`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={project.image} />
        <meta property="og:image:alt" content={projectTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@YousefSaberjou" />
        <meta name="twitter:creator" content="@YousefSaberjou" />
        <meta name="twitter:title" content={`${projectTitle} — Youssef AlSherief`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={project.image} />
        <script type="application/ld+json">{jsonLd}</script>
      </Helmet>
      <Navbar />

      {/* ═══════════ HERO BANNER ═══════════ */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={project.image} alt="" className="h-full w-full object-cover opacity-20 blur-sm" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/60 via-[#020617]/80 to-[#020617]" />
        </div>
        <div className="absolute top-0 left-[20%] h-[300px] w-[300px] rounded-full bg-cyan-600/8 blur-[120px]" />
        <div className="absolute bottom-0 right-[20%] h-[250px] w-[250px] rounded-full bg-violet-600/6 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-32 md:px-8">
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
            <div className="mb-4 flex items-center gap-3">
              <span className="text-5xl">{project.emoji}</span>
              <div>
                <h1 className="font-rajdhani text-3xl font-bold text-white md:text-4xl lg:text-5xl">{projectTitle}</h1>
              </div>
            </div>
            <p className="mb-6 max-w-2xl font-cairo text-base leading-relaxed text-slate-400">{projectDescription}</p>
          </motion.div>

          {/* Tech badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-2"
          >
            {project.tech?.map((tech: string) => (
              <span key={tech} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-1.5 font-rajdhani text-xs font-medium text-slate-300 backdrop-blur-sm">
                <Layers className="h-3 w-3 text-cyan-400/60" />
                {tech}
              </span>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      </div>

      {/* ═══════════ CONTENT SECTIONS ═══════════ */}
      <div className="relative">
        <div className="absolute inset-0 bg-[#020617]" />
        <div className="absolute inset-0 project-radial-grid opacity-15" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 md:px-8">
          {/* Project Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12 overflow-hidden rounded-2xl border border-slate-800/60"
          >
            <div className="relative">
              <img
                src={project.image} alt={projectTitle} className="w-full object-cover" loading="eager"
                onError={(e) => { (e.target as HTMLImageElement).closest(".mb-12")?.classList.add("hidden"); }}
              />
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${project.color}`} />
            </div>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* ── LEFT COLUMN: dynamic README sections ── */}
            <div className="space-y-8 lg:col-span-2">
              {dbSections.length > 0 ? (
                /* Case A: render all real README sections from DB */
                dbSections.map((sec, idx) => {
                  const hasContent = sec.isEmpty === true
                    ? false
                    : (sec.isBulletList
                      ? (sec.bullets?.length ?? 0) > 0
                      : (sec.prose?.length ?? 0) > 10 || (sec.codeBlocks?.length ?? 0) > 0);
                  if (!hasContent && !(sec.heading)) return null;
                  const pal = getPalette(sec.heading, idx);
                  return (
                    <motion.section
                      key={idx}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.15 + idx * 0.06 }}
                      className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-8 backdrop-blur-sm overflow-hidden relative"
                    >
                      <div className={`absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 ${pal.border} rounded-tl-2xl`} />
                      {sec.heading && (
                        <div className="flex items-center gap-3 mb-5">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${pal.gradient}`}>
                            {pal.icon}
                          </div>
                          <h2 className="font-rajdhani text-xl font-bold text-white">{sec.heading}</h2>
                        </div>
                      )}
                      {sec.isBulletList ? (
                        <ul className="space-y-3">
                          {(sec.bullets ?? []).map((bullet, bi) => (
                            <li key={bi} className="flex items-start gap-3">
                              <motion.div
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.25 + bi * 0.04 }}
                                className="flex items-start gap-3 w-full"
                              >
                                <span className={`mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r ${pal.gradient}`} />
                                <span className="font-cairo text-sm leading-relaxed text-slate-400">{bullet}</span>
                              </motion.div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        sec.prose ? (
                          <p className="font-cairo text-sm leading-[1.9] text-slate-400 text-justify whitespace-pre-line">
                            {sec.prose}
                          </p>
                        ) : null
                      )}
                      {/* Code blocks rendered as terminal-style boxes */}
                      {(sec.codeBlocks ?? []).length > 0 && (
                        <div className="mt-4 space-y-3">
                          {(sec.codeBlocks ?? []).map((code, ci) => (
                            <div key={ci} className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#0d1117]">
                              <div className="flex items-center gap-2 border-b border-slate-700/40 bg-slate-900/60 px-4 py-2.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                                <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                                <span className="ml-2 font-mono text-xs text-slate-500">bash</span>
                              </div>
                              <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-emerald-300/90 font-mono">
                                <code>{code}</code>
                              </pre>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.section>

                  );
                })
              ) : (
                /* Case B: no DB sections — fallback to old static fields */
                <>
                  {projectLongDescription && (
                    <motion.section
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-8 backdrop-blur-sm overflow-hidden relative"
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                          <BookOpen className="h-4 w-4 text-white" />
                        </div>
                        <h2 className="font-rajdhani text-xl font-bold text-white">{t("projects.overview")}</h2>
                      </div>
                      <p className="font-cairo text-sm leading-[1.9] text-slate-400 text-justify">{projectLongDescription}</p>
                    </motion.section>
                  )}
                  {projectFeatures.length > 0 && (
                    <motion.section
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-8 backdrop-blur-sm overflow-hidden relative"
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500">
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        </div>
                        <h2 className="font-rajdhani text-xl font-bold text-white">{t("projects.keyFeatures")}</h2>
                      </div>
                      <ul className="space-y-3">
                        {projectFeatures.map((f, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" />
                            <span className="font-cairo text-sm leading-relaxed text-slate-400">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.section>
                  )}
                  {projectChallenges && (
                    <motion.section
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-8 backdrop-blur-sm overflow-hidden relative"
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                          <AlertTriangle className="h-4 w-4 text-white" />
                        </div>
                        <h2 className="font-rajdhani text-xl font-bold text-white">{t("projects.challengesSolutions")}</h2>
                      </div>
                      <p className="font-cairo text-sm leading-[1.9] text-slate-400 text-justify">{projectChallenges}</p>
                    </motion.section>
                  )}
                </>
              )}
            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <div className="space-y-8">
              <motion.section
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-7 backdrop-blur-sm overflow-hidden sticky top-28"
              >
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-blue-500/20 rounded-bl-2xl" />
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500">
                    <Wrench className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="font-rajdhani text-xl font-bold text-white">{t("projects.techStack")}</h2>
                </div>

                <div className="mb-6 flex flex-wrap gap-2">
                  {project.tech?.map((tech: string) => (
                    <span key={tech} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800/50 px-3 py-1.5 font-rajdhani text-xs font-medium text-slate-300">
                      <Layers className="h-3 w-3 text-cyan-400/60" />
                      {tech}
                    </span>
                  ))}
                </div>

                {(project.stars > 0 || project.forks > 0) && (
                  <div className="mb-5 flex gap-4 border-b border-slate-800/60 pb-5 font-rajdhani text-sm text-slate-400">
                    {project.stars > 0 && <span>⭐ {project.stars} stars</span>}
                    {project.forks > 0 && <span>🍴 {project.forks} forks</span>}
                  </div>
                )}

                {projectTechDetails && (
                  <div className="border-t border-slate-800/60 pt-5">
                    <p className="font-cairo text-sm leading-[1.9] text-slate-400 text-justify">{projectTechDetails}</p>
                  </div>
                )}

                <div className="mt-6 space-y-3 border-t border-slate-800/60 pt-5">
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
              </motion.section>
            </div>
          </div>

          {/* Bottom Nav */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}
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
