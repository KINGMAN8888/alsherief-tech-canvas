import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const education = [
  "B.Sc. Computer Science Technology — Al-Suwaidi University of Technology (currently enrolled)",
  "Preparatory Year — Ural Federal University, Russia (2024-2025)",
  "Apprenticeship Diploma (Computer Science) — Smart School (2021-2023)",
];

const certGroups = [
  { category: "Networking", items: ["Cisco CCNA", "Cisco CCNP", "CompTIA Network+"] },
  { category: "Maintenance", items: ["CompTIA A+"] },
  { category: "Cloud", items: ["Azure Administrator", "Azure Fundamentals", "AWS Cloud Fundamentals"] },
  { category: "Programming & AI", items: ["NVIDIA CUDA C/C++", "Microsoft C#", "UC Irvine IoT & Embedded Systems"] },
  { category: "Other", items: ["Meta Social Media Marketing", "Canva Design Internship"] },
];

const Education = () => {
  return (
    <section id="education" className="py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-2 font-rajdhani text-sm font-semibold uppercase tracking-widest text-primary">
            Learning & Credentials
          </h2>
          <h3 className="font-rajdhani text-3xl font-bold text-foreground md:text-4xl">
            Education & Certifications
          </h3>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass rounded-xl p-6"
          >
            <div className="mb-4 flex items-center gap-2 text-primary">
              <GraduationCap className="h-6 w-6" />
              <h4 className="font-rajdhani text-xl font-bold text-foreground">Academic Education</h4>
            </div>
            <ul className="space-y-3">
              {education.map((e, i) => (
                <li key={i} className="flex items-start gap-2 font-cairo text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                  {e}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass rounded-xl p-6"
          >
            <div className="mb-4 flex items-center gap-2 text-primary">
              <Award className="h-6 w-6" />
              <h4 className="font-rajdhani text-xl font-bold text-foreground">Certifications</h4>
            </div>
            <div className="space-y-4">
              {certGroups.map((g) => (
                <div key={g.category}>
                  <p className="mb-2 font-rajdhani text-sm font-semibold text-secondary">{g.category}</p>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((item) => (
                      <Badge
                        key={item}
                        variant="outline"
                        className="border-primary/20 text-foreground/80 font-cairo text-xs"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Education;
