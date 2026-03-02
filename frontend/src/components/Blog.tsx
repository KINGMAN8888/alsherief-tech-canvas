import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { posts } from "@/data/posts";
import { useTranslation } from "react-i18next";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
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

const Blog = () => {
  const { t } = useTranslation();
  const { locale } = useParams<{ locale: string }>();

  // Featured post = first, rest = secondary
  const [featured, ...rest] = posts;

  const featuredTitle = t(`blog.items.${featured.slug}.title`);
  const featuredSummary = t(`blog.items.${featured.slug}.summary`);
  const featuredCategory = t(`blog.items.${featured.slug}.category`);

  const blogTitle = t("blog.title");
  const blogTitleLastSpace = blogTitle.lastIndexOf(" ");
  const blogTitlePart1 = blogTitle.slice(0, blogTitleLastSpace);
  const blogTitlePart2 = blogTitle.slice(blogTitleLastSpace + 1);

  return (
    <section id="blog" className="relative py-28 overflow-hidden">
      {/* ═══════════ BACKGROUND ═══════════ */}
      <div className="absolute inset-0 bg-transparent" />

      {/* Flowing wave lines */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.04]"
        preserveAspectRatio="none"
        viewBox="0 0 1200 800"
      >
        <path
          d="M0,400 C200,300 400,500 600,400 C800,300 1000,500 1200,400"
          fill="none"
          stroke="rgba(6,182,212,0.6)"
          strokeWidth="1.5"
        />
        <path
          d="M0,450 C200,350 400,550 600,450 C800,350 1000,550 1200,450"
          fill="none"
          stroke="rgba(139,92,246,0.4)"
          strokeWidth="1"
        />
        <path
          d="M0,350 C200,250 400,450 600,350 C800,250 1000,450 1200,350"
          fill="none"
          stroke="rgba(6,182,212,0.3)"
          strokeWidth="1"
        />
      </svg>

      {/* Ambient glow blobs */}
      <div className="absolute top-[10%] right-[5%] h-[500px] w-[500px] rounded-full bg-cyan-600/5 blur-[150px]" />
      <div className="absolute bottom-[10%] left-[10%] h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[130px]" />

      {/* Separators */}
      <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
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
            {t("blog.label")}
          </span>
          <h2 className="font-rajdhani text-4xl font-bold text-white md:text-5xl">
            {blogTitlePart1}{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              {blogTitlePart2}
            </span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto font-cairo text-base text-slate-400">
            {t("blog.description")}
          </p>
        </motion.div>

        {/* Featured Post — Large */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            to={`/${locale}/blog/${featured.slug}`}
            className="group relative block overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm transition-all duration-500 hover:border-slate-700/80"
          >
            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="relative h-64 md:h-full overflow-hidden">
                <img
                  src={featured.image}
                  alt={featuredTitle}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#020617]/80 hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 to-transparent md:hidden" />
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${featured.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center p-8 md:p-10">
                <div className="mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-rajdhani text-xs font-semibold uppercase tracking-wide text-cyan-400">
                    <Tag className="h-3 w-3" />
                    {featuredCategory}
                  </span>
                  <span className="rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-1 font-rajdhani text-xs font-semibold text-violet-400">
                    {t("blog.featured")}
                  </span>
                </div>

                <h3 className="mb-3 font-rajdhani text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 md:text-3xl">
                  {featuredTitle}
                </h3>

                <p className="mb-5 font-cairo text-sm leading-relaxed text-slate-400 text-justify">
                  {featuredSummary}
                </p>

                <div className="mb-6 flex items-center gap-4 font-cairo text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-cyan-400/50" />
                    {new Date(featured.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="h-3 w-[1px] bg-slate-700" />
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-cyan-400/50" />
                    {featured.readingTime}
                  </span>
                </div>

                <span className="group/link inline-flex items-center gap-1.5 font-rajdhani text-sm font-semibold text-cyan-400 transition-colors group-hover:text-cyan-300">
                  {t("blog.readArticle")}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Rest of Posts — Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "100px" }}
          className="grid gap-6 md:grid-cols-2"
        >
          {rest.map((post) => {
            const postTitle = t(`blog.items.${post.slug}.title`);
            const postSummary = t(`blog.items.${post.slug}.summary`);
            const postCategory = t(`blog.items.${post.slug}.category`);
            return (
              <motion.div key={post.slug} variants={itemVariants}>
                <Link
                  to={`/${locale}/blog/${post.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm transition-all duration-500 hover:border-slate-700/80 hover:bg-slate-800/20 h-full"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={postTitle}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
                    <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${post.color} opacity-70 group-hover:opacity-100 transition-opacity`} />

                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1 rounded-lg border border-slate-600/50 bg-slate-900/70 px-2.5 py-1 font-rajdhani text-xs font-semibold text-slate-300 backdrop-blur-sm">
                        <Tag className="h-3 w-3 text-cyan-400/70" />
                        {postCategory}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-2 font-rajdhani text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                      {postTitle}
                    </h3>

                    <p className="mb-4 flex-1 font-cairo text-sm leading-relaxed text-slate-400 text-justify">
                      {postSummary}
                    </p>

                    <div className="flex items-center justify-between border-t border-slate-800/60 pt-4">
                      <div className="flex items-center gap-3 font-cairo text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-cyan-400/50" />
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="h-3 w-[1px] bg-slate-700" />
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-cyan-400/50" />
                          {post.readingTime}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 font-rajdhani text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                        {t("blog.read")}
                        <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>

                  {/* Hover bottom gradient line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${post.color} opacity-0 transition-opacity duration-400 group-hover:opacity-70`} />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
