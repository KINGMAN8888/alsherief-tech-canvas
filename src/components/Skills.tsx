import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const groups = [
  {
    category: "Languages",
    items: ["Python", "JavaScript (ES6+)", "TypeScript", "C++", "C#", "Dart", "PHP", "SQL"],
  },
  {
    category: "Frontend",
    items: ["React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap"],
  },
  { category: "Mobile", items: ["Flutter"] },
  { category: "Backend", items: ["Node.js", "Express.js", "Prisma ORM"] },
  { category: "Databases", items: ["MongoDB", "MySQL", "PostgreSQL"] },
  {
    category: "DevOps & Tools",
    items: ["Git/GitHub", "Docker", "Linux", "Postman", "VS Code"],
  },
  {
    category: "Hardware",
    items: ["PCB Microsoldering", "PC Assembly", "Network Cabling"],
  },
];

const Skills = () => {
  return (
    <section id="skills" className="py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-2 font-rajdhani text-sm font-semibold uppercase tracking-widest text-primary">
            Tech Stack
          </h2>
          <h3 className="font-rajdhani text-3xl font-bold text-foreground md:text-4xl">
            Technical Skills
          </h3>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, i) => (
            <motion.div
              key={g.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="glass rounded-xl p-5"
            >
              <h4 className="mb-3 font-rajdhani text-sm font-bold uppercase tracking-wider text-secondary">
                {g.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <Badge
                    key={item}
                    className="bg-primary/10 text-primary border-primary/20 font-cairo text-xs"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
