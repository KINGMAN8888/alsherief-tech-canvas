import { motion } from "framer-motion";
import { Globe, GraduationCap, Languages } from "lucide-react";

const highlights = [
  { icon: GraduationCap, text: "CS @ Al-Suwaidi University of Technology + Ural Federal University, Russia" },
  { icon: Globe, text: "Russia & Egypt — International Experience" },
  { icon: Languages, text: "Arabic (Native) · English (Advanced) · Russian (Advanced)" },
];

const About = () => {
  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="grid items-center gap-12 md:grid-cols-2"
        >
          {/* Hexagonal photo */}
          <div className="flex justify-center">
            <div className="hex-clip h-72 w-72 bg-muted flex items-center justify-center">
              <img
                src="/assets/CVP.png"
                alt="Youssef AlSherief"
                className="hex-clip h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Text */}
          <div>
            <h2 className="mb-2 font-rajdhani text-sm font-semibold uppercase tracking-widest text-primary">
              About Me
            </h2>
            <h3 className="mb-6 font-rajdhani text-3xl font-bold text-foreground md:text-4xl">
              The Story
            </h3>
            <p className="mb-4 font-cairo text-muted-foreground leading-relaxed">
              I am Youssef AlSherief (Youssef Mahmoud Saber), a software engineer and IT infrastructure technician. My journey began six years ago in the depths of hardware maintenance, giving me a unique understanding of how systems work from the inside.
            </p>
            <p className="mb-8 font-cairo text-muted-foreground leading-relaxed">
              Currently, I'm studying Computer Science at Al-Suwaidi University of Technology, having completed a year of study at Ural Federal University in Russia. I combine academic study with practical experience in IT department management and full-stack web application development using cutting-edge technologies like MERN Stack and Cloud Computing.
            </p>

            <div className="space-y-4">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3">
                  <h.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="font-cairo text-sm text-muted-foreground">{h.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
