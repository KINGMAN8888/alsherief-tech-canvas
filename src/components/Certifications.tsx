import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, X, ZoomIn } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CertItem {
  title: string;
  issuer: string;
  category: string;
  image: string;
  color: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const CERT_IMAGES = [
  "/certs/Ural-Federal-University.jpg",
  "/certs/microsoft new.png",
  "/certs/Microsoft.png",
  "/certs/NVIDIA.png",
  "/certs/UCI.png",
  "/certs/UCDAVIS.png",
  "/certs/HP.png",
  "/certs/Meta.png",
  "/certs/MARKTING.jpg",
  "/certs/CANVA.png",
];

const CERT_COLORS = [
  "from-violet-500 to-purple-500",
  "from-blue-500 to-cyan-500",
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-cyan-500 to-blue-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-cyan-500",
  "from-blue-500 to-violet-500",
  "from-pink-500 to-rose-500",
  "from-purple-500 to-pink-500",
];

const Certifications = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<CertItem | null>(null);

  const certItems: CertItem[] = (
    t("certifications.items", { returnObjects: true }) as Array<{
      title: string;
      issuer: string;
      category: string;
    }>
  ).map((item, i) => ({
    ...item,
    image: CERT_IMAGES[i],
    color: CERT_COLORS[i],
  }));

  const certTitle = t("certifications.title");
  const certTitleLastSpace = certTitle.lastIndexOf(" ");
  const certTitlePart1 = certTitle.slice(0, certTitleLastSpace);
  const certTitlePart2 = certTitle.slice(certTitleLastSpace + 1);

  return (
    <section id="certifications" className="relative py-28 overflow-hidden">
      {/* ═══════════ BACKGROUND ═══════════ */}
      <div className="absolute inset-0 bg-[#050b18]" />

      {/* Hexagon-like grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(60deg, rgba(6,182,212,0.05) 1px, transparent 1px), linear-gradient(-60deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Ambient glow blobs */}
      <div className="absolute top-[10%] left-[5%] h-[450px] w-[450px] rounded-full bg-cyan-600/5 blur-[140px]" />
      <div className="absolute bottom-[5%] right-[5%] h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[120px]" />
      <div className="absolute top-[50%] left-[40%] h-[300px] w-[300px] rounded-full bg-blue-600/4 blur-[100px]" />

      {/* Separators */}
      <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-violet-500/15 to-transparent" />

      {/* ═══════════ CONTENT ═══════════ */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-3 font-rajdhani text-xs uppercase tracking-[0.3em] text-cyan-400/70">
            {t("certifications.label")}
          </span>
          <h2 className="font-rajdhani text-4xl font-bold text-white md:text-5xl">
            {certTitlePart1}{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              {certTitlePart2}
            </span>
          </h2>
          <p className="mt-4 mx-auto max-w-xl font-cairo text-sm text-slate-400 leading-relaxed">
            {t("certifications.description")}
          </p>
        </motion.div>

        {/* Certificate Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 justify-items-center"
        >
          {certItems.map((cert) => (
            <motion.button
              key={cert.title}
              variants={cardVariants}
              onClick={() => setSelected(cert)}
              className="group relative flex flex-col rounded-2xl border border-slate-800/60 bg-slate-900/50 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:-translate-y-1.5 w-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
            >
              {/* Gradient top bar */}
              <div
                className={`h-[3px] w-full bg-gradient-to-r ${cert.color} opacity-70 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Certificate image */}
              <div className="relative overflow-hidden bg-slate-950/60">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Hover zoom overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 transition-all duration-400 group-hover:bg-slate-900/40">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
                    <ZoomIn className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Category badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span
                    className={`inline-block rounded-md bg-gradient-to-r ${cert.color} px-2.5 py-0.5 font-rajdhani text-[10px] font-bold uppercase tracking-wide text-white shadow-md opacity-90`}
                  >
                    {cert.category}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="flex flex-col flex-1 px-4 pt-4 pb-4">
                {/* Icon + Title row */}
                <div className="flex items-start gap-2 mb-1.5">
                  <div className={`mt-0.5 flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br ${cert.color}`}>
                    <Award className="h-3.5 w-3.5 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="font-rajdhani text-sm font-bold text-white leading-snug">
                    {cert.title}
                  </h3>
                </div>

                {/* Issuer */}
                <p className="font-cairo text-[11px] text-cyan-400/70 pl-8">
                  {cert.issuer}
                </p>
              </div>

              {/* Hover glow overlay */}
              <div
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br ${cert.color}`}
                style={{ opacity: 0, mixBlendMode: "soft-light" }}
              />

              {/* Hover border glow via box-shadow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ring-1 ring-slate-600/60" />
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* ═══════════ LIGHTBOX MODAL ═══════════ */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-3xl rounded-2xl border border-slate-700/60 bg-slate-900/95 overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal gradient top bar */}
              <div className={`h-[3px] w-full bg-gradient-to-r ${selected.color}`} />

              {/* Close button */}
              <button
                type="button"
                aria-label={t("certifications.closeModal", "Close modal")}
                title={t("certifications.closeModal", "Close modal")}
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-slate-700/60 bg-slate-800/80 text-slate-400 transition-colors hover:border-slate-600 hover:text-white backdrop-blur-sm"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Certificate image */}
              <div className="bg-slate-950/50">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full object-contain max-h-[65vh]"
                />
              </div>

              {/* Modal footer */}
              <div className="px-6 py-4 flex items-center gap-3">
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${selected.color}`}>
                  <Award className="h-4.5 w-4.5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-rajdhani text-base font-bold text-white leading-snug">
                    {selected.title}
                  </h3>
                  <p className="font-cairo text-xs text-cyan-400/80 mt-0.5">
                    Issued by {selected.issuer}
                  </p>
                </div>
                <span
                  className={`ml-auto inline-block rounded-md bg-gradient-to-r ${selected.color} px-3 py-1 font-rajdhani text-[11px] font-bold uppercase tracking-wide text-white`}
                >
                  {selected.category}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certifications;
