import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="mb-4 font-rajdhani text-4xl font-bold text-foreground">
              Project Not Found
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
        <title>{project.title} — Project — Youssef AlSherief</title>
        <meta name="description" content={project.description || project.longDescription?.slice(0, 160)} />
        <meta property="og:title" content={`${project.title} — Youssef AlSherief`} />
        <meta property="og:description" content={project.description || project.longDescription?.slice(0, 160)} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/assets/CVP.png" />
      </Helmet>
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-28 md:px-8">
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
            <Link to="/#projects">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Link>
          </Button>

          <div className="mb-6 flex items-center gap-4">
            <span className="text-5xl">{project.emoji}</span>
            <div>
              <h1 className="font-rajdhani text-3xl font-bold text-foreground md:text-4xl">
                {project.title}
              </h1>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <Badge
                    key={t}
                    variant="outline"
                    className="border-primary/30 text-primary font-cairo text-xs"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {project.link && (
            <Button
              asChild
              size="sm"
              className="mb-8 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </a>
            </Button>
          )}
        </motion.div>

        <div className="space-y-10">
          {/* Overview */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="mb-4 font-rajdhani text-xl font-bold text-foreground">
              Overview
            </h2>
            <p className="font-cairo text-sm leading-relaxed text-muted-foreground">
              {project.longDescription}
            </p>
          </motion.section>

          {/* Features */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="mb-4 font-rajdhani text-xl font-bold text-foreground">
              Key Features
            </h2>
            <ul className="space-y-3">
              {project.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 font-cairo text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Technical Details */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="mb-4 font-rajdhani text-xl font-bold text-foreground">
              Technical Details
            </h2>
            <p className="font-cairo text-sm leading-relaxed text-muted-foreground">
              {project.techDetails}
            </p>
          </motion.section>

          {/* Challenges */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="mb-4 font-rajdhani text-xl font-bold text-foreground">
              Challenges & Solutions
            </h2>
            <p className="font-cairo text-sm leading-relaxed text-muted-foreground">
              {project.challenges}
            </p>
          </motion.section>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 border-t border-border pt-8"
        >
          <Button
            asChild
            variant="outline"
            className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
          >
            <Link to="/#projects">
              <ArrowLeft className="h-4 w-4" />
              Back to All Projects
            </Link>
          </Button>
        </motion.div>
      </div>
    </main>
  );
};

export default ProjectDetail;
