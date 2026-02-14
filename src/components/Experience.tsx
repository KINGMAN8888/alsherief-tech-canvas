import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

interface Role {
  title: string;
  company: string;
  period: string;
  achievements: string[];
}

const roles: Role[] = [
  {
    title: "IT Manager",
    company: "Telecommunications Without Borders Tourism Company (Makkah)",
    period: "2024 — Present",
    achievements: [
      "Complete management of the company's IT infrastructure.",
      "Overseeing website development and marketing campaigns.",
    ],
  },
  {
    title: "Assembly & Maintenance Technician",
    company: "Badr Group",
    period: "2023 — 2024",
    achievements: [
      "Assembled PCs for gaming and heavy-duty workstations.",
      "Diagnosed and repaired motherboard and electronic circuitry.",
    ],
  },
  {
    title: "IT & Digital Marketing Manager",
    company: "The Global View Restaurant (Clock Tower, Makkah)",
    period: "Jan 2022 — Mar 2023",
    achievements: [
      "Managed POS systems and internal networks.",
      "Led the digital marketing strategy and visual identity.",
    ],
  },
  {
    title: "IT Manager (Remote)",
    company: "Asia Oasis Tourism Company",
    period: "2022 — 2023",
    achievements: [
      "Provided remote technical support, server administration, and data protection.",
    ],
  },
  {
    title: "Freelancer",
    company: "Upwork / Fiverr",
    period: "2018 — Present",
    achievements: [
      "Provided web development, scripting, and system maintenance services to over 30 clients.",
    ],
  },
];

const Experience = () => {
  return (
    <section id="experience" className="py-24">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-2 font-rajdhani text-sm font-semibold uppercase tracking-widest text-primary">
            Career Timeline
          </h2>
          <h3 className="font-rajdhani text-3xl font-bold text-foreground md:text-4xl">
            Experience
          </h3>
        </motion.div>

        <div className="relative">
          {/* Gold vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 gold-line md:left-1/2 md:-translate-x-px" />

          {roles.map((role, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative mb-10 pl-12 md:w-1/2 md:pl-0 ${
                  isLeft ? "md:pr-12 md:text-right" : "md:ml-auto md:pl-12"
                }`}
              >
                {/* Node dot */}
                <span
                  className={`absolute top-1 left-2.5 h-3.5 w-3.5 rounded-full border-2 border-secondary bg-background md:left-auto ${
                    isLeft ? "md:-right-[7px]" : "md:-left-[7px]"
                  }`}
                />

                <span className="mb-1 inline-block rounded-full bg-secondary/10 px-3 py-0.5 font-cairo text-xs font-semibold text-secondary">
                  {role.period}
                </span>
                <h4 className="font-rajdhani text-lg font-bold text-foreground">{role.title}</h4>
                <p className="mb-2 font-cairo text-sm text-primary">{role.company}</p>
                <ul className={`space-y-1 ${isLeft ? "md:ml-auto" : ""}`}>
                  {role.achievements.map((a, j) => (
                    <li key={j} className="font-cairo text-sm text-muted-foreground">
                      {a}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
