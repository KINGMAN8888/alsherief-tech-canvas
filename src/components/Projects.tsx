import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Project {
  emoji: string;
  title: string;
  description: string;
  tech: string[];
  link?: string;
}

const projects: Project[] = [
  {
    emoji: "🖥️",
    title: "PC Master Platform",
    description:
      "A comprehensive e-commerce platform for PC builds with AI-powered build suggestion assistant, 3D compatibility simulation, and inventory management.",
    tech: ["MERN Stack", "JWT Auth", "AI Integration"],
    link: "https://pc-master-files.onrender.com",
  },
  {
    emoji: "🤖",
    title: "Smart Answer AI Bot",
    description:
      "A Telegram service bot for Arab students and expatriates in Russia — instant translation, CV writing, academic support, and logistics.",
    tech: ["Python", "Telegram API", "NLP"],
    link: "https://t.me/SmartAnswerAi_bot",
  },
  {
    emoji: "✅",
    title: "Dom Dash Do",
    description: "A modern, fast to-do application with intuitive UX.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Local Storage"],
    link: "https://dom-dash-do.lovable.app",
  },
  {
    emoji: "🌐",
    title: "Al-Tawasul Platform",
    description:
      "A social networking application with a chat and interaction system.",
    tech: ["Docker", "Prisma", "VPS Hosting"],
  },
  {
    emoji: "🐍",
    title: "Python Hub Platform",
    description:
      "An educational platform for programming students, including tests and a payment gateway.",
    tech: ["Python", "Web", "Payments"],
  },
];

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
              {p.link && (
                <Button asChild variant="ghost" size="sm" className="w-fit gap-1 text-primary hover:text-primary/80">
                  <a href={p.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Live Demo
                  </a>
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
