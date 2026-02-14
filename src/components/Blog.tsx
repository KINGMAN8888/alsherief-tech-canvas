import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { posts } from "@/data/posts";

const Blog = () => {
  return (
    <section id="blog" className="py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-2 font-rajdhani text-sm font-semibold uppercase tracking-widest text-primary">
            Blog
          </h2>
          <h3 className="font-rajdhani text-3xl font-bold text-foreground md:text-4xl">
            Latest Articles
          </h3>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass rounded-xl p-6 transition-all duration-300 glow-blue-hover flex flex-col"
            >
              <Badge
                variant="outline"
                className="mb-3 w-fit border-primary/30 text-primary font-cairo text-xs"
              >
                {post.category}
              </Badge>
              <h4 className="mb-2 font-rajdhani text-xl font-bold text-foreground">
                {post.title}
              </h4>
              <p className="mb-4 flex-1 font-cairo text-sm leading-relaxed text-muted-foreground">
                {post.summary}
              </p>
              <div className="mb-4 flex items-center gap-4 font-cairo text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingTime}
                </span>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="w-fit gap-1 text-primary hover:text-primary/80"
              >
                <Link to={`/blog/${post.slug}`}>
                  Read More
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
