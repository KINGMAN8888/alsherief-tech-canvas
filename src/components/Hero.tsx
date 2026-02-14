import { motion } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden circuit-grid">
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,hsla(199,89%,60%,0.08)_0%,transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto max-w-3xl px-4 text-center"
      >
        <h1 className="mb-4 font-rajdhani text-4xl font-bold leading-tight text-foreground md:text-6xl">
          Engineering the Future,{" "}
          <span className="text-primary">One Line of Code</span> &{" "}
          <span className="text-secondary">One Circuit</span> at a Time.
        </h1>

        <p className="mx-auto mb-8 max-w-xl font-cairo text-lg text-muted-foreground">
          Computer Engineer | Full-Stack Developer | AI Specialist
        </p>

        <p className="mx-auto mb-10 max-w-2xl font-cairo text-sm text-muted-foreground/80">
          From server assembly and maintenance to building AI-powered web applications, I offer comprehensive expertise covering the entire technology product lifecycle.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <a href="#projects">
              <ArrowDown className="h-4 w-4" />
              View My Work
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 border-primary/30 text-primary hover:bg-primary/10">
            <a href="#contact">
              <Mail className="h-4 w-4" />
              Contact Me
            </a>
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
