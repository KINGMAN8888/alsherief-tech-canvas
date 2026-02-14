import { motion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { projects } from "@/data/projects";

const Projects = () => {
  return (
    <section id="projects" className="py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-2 font-rajdhani text-sm font-semibold uppercase tracking-widest text-primary">
            Portfolio
          </h2>
          <h3 className="font-rajdhani text-3xl font-bold text-foreground md:text-4xl">
            Featured Projects
          </h3>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass rounded-xl p-6 transition-all duration-300 glow-blue-hover flex flex-col"
            >
              <span className="mb-3 text-3xl">{p.emoji}</span>
              <h4 className="mb-2 font-rajdhani text-xl font-bold text-foreground">{p.title}</h4>
              <p className="mb-4 flex-1 font-cairo text-sm leading-relaxed text-muted-foreground">
                {p.description}
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <Badge
                    key={t}
                    variant="outline"
                    className="border-primary/30 text-primary font-cairo text-xs"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary/80">
                  <Link to={`/projects/${p.slug}`}>
                    View Details
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                {p.link && (
                  <Button asChild variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary/80">
                    <a href={p.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
