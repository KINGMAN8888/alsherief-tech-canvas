import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { posts } from "@/data/posts";
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="mb-4 font-rajdhani text-4xl font-bold text-foreground">
              Article Not Found
            </h1>
            <Button asChild variant="outline" className="gap-2 border-primary/30 text-primary">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title} — Youssef AlSherief</title>
        <meta name="description" content={post.excerpt || post.title} />
        <meta property="og:title" content={`${post.title} — Youssef AlSherief`} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="/assets/CVP.png" />
      </Helmet>
      <Navbar />
      <article className="mx-auto max-w-3xl px-4 pb-24 pt-28 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mb-8 gap-2 text-muted-foreground hover:text-primary"
          >
            <Link to="/#blog">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <Badge
            variant="outline"
            className="mb-4 border-primary/30 text-primary font-cairo text-xs"
          >
            {post.category}
          </Badge>

          <h1 className="mb-4 font-rajdhani text-3xl font-bold text-foreground md:text-5xl">
            {post.title}
          </h1>

          <div className="mb-10 flex items-center gap-4 font-cairo text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readingTime}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {post.content.map((paragraph, i) => (
            <p
              key={i}
              className="font-cairo text-base leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 border-t border-border pt-8"
        >
          <Button
            asChild
            variant="outline"
            className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
          >
            <Link to="/#blog">
              <ArrowLeft className="h-4 w-4" />
              Back to All Articles
            </Link>
          </Button>
        </motion.div>
      </article>
    </main>
  );
};

export default BlogPost;
