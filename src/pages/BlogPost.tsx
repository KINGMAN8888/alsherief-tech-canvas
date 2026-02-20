import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag, User, ArrowRight } from "lucide-react";
import { posts } from "@/data/posts";
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const BlogPost = () => {
  const { slug, locale } = useParams<{ slug: string; locale: string }>();
  const { t } = useTranslation();
  const post = posts.find((p) => p.slug === slug);
  const currentIdx = posts.findIndex((p) => p.slug === slug);
  const loc = locale ?? "en";

  // Prev / Next navigation
  const prevPost = currentIdx > 0 ? posts[currentIdx - 1] : null;
  const nextPost = currentIdx < posts.length - 1 ? posts[currentIdx + 1] : null;

  // Translated post content
  const postTitle = slug ? t(`blog.items.${slug}.title`) : "";
  const postSummary = slug ? t(`blog.items.${slug}.summary`) : "";
  const postCategory = slug ? t(`blog.items.${slug}.category`) : "";
  const postContent = slug
    ? (t(`blog.items.${slug}.content`, { returnObjects: true }) as string[])
    : [];

  if (!post) {
    return (
      <main className="min-h-screen bg-[#020617]">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="mb-4 font-rajdhani text-4xl font-bold text-white">
              {t("blog.notFound")}
            </h1>
            <Link
              to={`/${loc}/#blog`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/50 px-6 py-3 font-rajdhani text-sm font-semibold text-cyan-400 backdrop-blur-sm transition-all hover:border-cyan-500/40 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("blog.backToBlog")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const canonicalUrl = `https://youssefalsherief.tech/${loc}/blog/${slug}`;
  const articleJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: postTitle,
    description: postSummary,
    image: post.image,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Youssef AlSherief",
      url: "https://youssefalsherief.tech",
    },
    publisher: {
      "@type": "Person",
      name: "Youssef AlSherief",
      url: "https://youssefalsherief.tech",
    },
    url: canonicalUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  });

  return (
    <main className="min-h-screen bg-[#020617]">
      <Helmet>
        <title>{postTitle} — Blog — Youssef AlSherief</title>
        <meta name="description" content={postSummary} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Youssef AlSherief — Portfolio" />
        <meta property="og:title" content={`${postTitle} — Youssef AlSherief`} />
        <meta property="og:description" content={postSummary} />
        <meta property="og:image" content={post.image} />
        <meta property="og:image:alt" content={postTitle} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content="Youssef AlSherief" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@YousefSaberjou" />
        <meta name="twitter:creator" content="@YousefSaberjou" />
        <meta name="twitter:title" content={`${postTitle} — Youssef AlSherief`} />
        <meta name="twitter:description" content={postSummary} />
        <meta name="twitter:image" content={post.image} />

        {/* JSON-LD */}
        <script type="application/ld+json">{articleJsonLd}</script>
      </Helmet>
      <Navbar />

      {/* ═══════════ HERO BANNER ═══════════ */}
      <div className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={post.image}
            alt=""
            className="h-full w-full object-cover opacity-25 blur-sm"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-[#020617]/70 to-[#020617]" />
        </div>

        {/* Ambient blobs */}
        <div className="absolute top-0 left-[20%] h-[300px] w-[300px] rounded-full bg-cyan-600/8 blur-[120px]" />
        <div className="absolute bottom-0 right-[20%] h-[250px] w-[250px] rounded-full bg-violet-600/6 blur-[100px]" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 pb-12 pt-32 md:px-8">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to={`/${loc}/#blog`}
              className="group mb-8 inline-flex items-center gap-2 font-rajdhani text-sm font-semibold text-slate-400 transition-colors hover:text-cyan-400"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {t("blog.backToBlog")}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Category + Meta */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-rajdhani text-xs font-semibold uppercase tracking-wide text-cyan-400">
                <Tag className="h-3 w-3" />
                {postCategory}
              </span>
              <span className="flex items-center gap-1.5 font-cairo text-xs text-slate-500">
                <Calendar className="h-3.5 w-3.5 text-cyan-400/50" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="h-3 w-[1px] bg-slate-700" />
              <span className="flex items-center gap-1.5 font-cairo text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5 text-cyan-400/50" />
                {post.readingTime}
              </span>
            </div>

            <h1 className="mb-4 font-rajdhani text-3xl font-bold text-white md:text-5xl lg:text-6xl leading-tight">
              {postTitle}
            </h1>

            <p className="max-w-2xl font-cairo text-base text-slate-400 leading-relaxed">
              {postSummary}
            </p>

            {/* Author */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-rajdhani text-sm font-bold text-white">
                  {t("blog.author")}
                </p>
                <p className="font-cairo text-xs text-slate-500">
                  {t("blog.authorRole")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom separator */}
        <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      </div>

      {/* ═══════════ ARTICLE CONTENT ═══════════ */}
      <div className="relative">
        <div className="absolute inset-0 bg-[#020617]" />
        <div className="absolute inset-0 article-radial-grid opacity-15" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 md:px-8">
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12 overflow-hidden rounded-2xl border border-slate-800/60"
          >
            <div className="relative">
              <img
                src={post.image}
                alt={postTitle}
                className="w-full object-cover"
                loading="eager"
              />
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${post.color}`} />
            </div>
          </motion.div>

          {/* Article Body */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-8 md:p-12 backdrop-blur-sm overflow-hidden relative"
          >
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-cyan-500/20 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-violet-500/20 rounded-br-2xl" />

            <div className="space-y-6">
              {postContent.map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                  className="font-cairo text-base leading-[2] text-slate-300 text-justify"
                >
                  {i === 0 ? (
                    <>
                      <span className={`float-left mr-3 mt-1 font-rajdhani text-5xl font-bold leading-none bg-gradient-to-br ${post.color} bg-clip-text text-transparent`}>
                        {paragraph.charAt(0)}
                      </span>
                      {paragraph.slice(1)}
                    </>
                  ) : (
                    paragraph
                  )}
                </motion.p>
              ))}
            </div>
          </motion.article>

          {/* ═══════════ POST NAVIGATION ═══════════ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 grid gap-4 md:grid-cols-2"
          >
            {/* Previous Post */}
            {prevPost ? (
              <Link
                to={`/${loc}/blog/${prevPost.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-slate-700/80"
              >
                <ArrowLeft className="h-5 w-5 flex-shrink-0 text-slate-500 transition-transform group-hover:-translate-x-1 group-hover:text-cyan-400" />
                <div className="min-w-0">
                  <span className="block font-rajdhani text-xs uppercase tracking-wide text-slate-500 mb-1">
                    {t("blog.previous")}
                  </span>
                  <span className="block truncate font-rajdhani text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                    {t(`blog.items.${prevPost.slug}.title`)}
                  </span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {/* Next Post */}
            {nextPost ? (
              <Link
                to={`/${loc}/blog/${nextPost.slug}`}
                className="group flex items-center justify-end gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-slate-700/80 text-right"
              >
                <div className="min-w-0">
                  <span className="block font-rajdhani text-xs uppercase tracking-wide text-slate-500 mb-1">
                    {t("blog.next")}
                  </span>
                  <span className="block truncate font-rajdhani text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                    {t(`blog.items.${nextPost.slug}.title`)}
                  </span>
                </div>
                <ArrowRight className="h-5 w-5 flex-shrink-0 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-cyan-400" />
              </Link>
            ) : (
              <div />
            )}
          </motion.div>

          {/* Back to all */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 flex justify-center"
          >
            <Link
              to={`/${loc}/#blog`}
              className="group inline-flex items-center gap-2 font-rajdhani text-sm font-semibold text-slate-400 transition-colors hover:text-cyan-400"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {t("blog.allArticles")}
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default BlogPost;
