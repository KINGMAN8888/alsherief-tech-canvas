import { motion } from "framer-motion";
import { Code, Cpu, Cloud, Bot } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

const services: Service[] = [
  {
    icon: Code,
    title: "Software Development",
    description:
      "Building integrated web and mobile applications using MERN Stack (MongoDB, Express, React, Node.js) and Flutter, with a focus on performance and user experience.",
  },
  {
    icon: Cpu,
    title: "Hardware & Networking",
    description:
      "Diagnosing and troubleshooting complex computer malfunctions, server setup, and network infrastructure design (Cisco Routing & Switching).",
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    description:
      "Deploying and managing applications on AWS, Azure, and Hostinger VPS using Containerization (Docker) and process automation technologies.",
  },
  {
    icon: Bot,
    title: "AI & Automation",
    description:
      "Developing intelligent solutions, Telegram bots, and task automation tools (Web Scraping & Workflow Automation) to increase productivity.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-2 font-rajdhani text-sm font-semibold uppercase tracking-widest text-primary">
            What I Do
          </h2>
          <h3 className="font-rajdhani text-3xl font-bold text-foreground md:text-4xl">
            The Hybrid Skillset
          </h3>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass rounded-xl p-6 transition-all duration-300 glow-blue-hover"
            >
              <s.icon className="mb-4 h-10 w-10 text-primary" />
              <h4 className="mb-2 font-rajdhani text-lg font-bold text-foreground">{s.title}</h4>
              <p className="font-cairo text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
