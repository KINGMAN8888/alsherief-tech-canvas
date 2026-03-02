import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Send,
  Mail,
  Heart,
  ArrowUp,
  Facebook,
  Instagram,
  MessageCircle,
  Phone,
  MapPin,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";

/* ─── social definitions — key maps to profile.social fields ─── */
const socialDefs = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    key: "linkedin",
    fallback: "https://linkedin.com/in/youssefalsherief",
    color: "hover:text-blue-400 hover:border-blue-400/30 hover:bg-blue-500/10",
  },
  {
    icon: Github,
    label: "GitHub",
    key: "github",
    fallback: "https://github.com/KINGMAN8888",
    color: "hover:text-slate-200 hover:border-slate-600/60 hover:bg-slate-700/30",
  },
  {
    icon: Send,
    label: "Telegram",
    key: "telegram",
    fallback: "https://t.me/KINGMAN_JOU",
    color: "hover:text-cyan-400 hover:border-cyan-400/30 hover:bg-cyan-500/10",
  },
  {
    icon: Facebook,
    label: "Facebook",
    key: "facebook",
    fallback: "https://facebook.com/kingsmanjou",
    color: "hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/10",
  },
  {
    icon: Instagram,
    label: "Instagram",
    key: "instagram",
    fallback: "https://instagram.com/kingman_jou",
    color: "hover:text-pink-400 hover:border-pink-400/30 hover:bg-pink-500/10",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    key: "whatsapp",
    fallback: "https://wa.me/201097585951",
    color: "hover:text-emerald-400 hover:border-emerald-400/30 hover:bg-emerald-500/10",
  },
];

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const Footer = () => {
  const { t } = useTranslation();
  const { locale } = useParams<{ locale: string }>();
  const loc = locale ?? "en";
  const { profile } = useProfile();

  // Build social links: use profile data if available, fallback to hardcoded defaults
  const socials = socialDefs.map(s => ({
    ...s,
    href: (profile?.social as Record<string, string> | undefined)?.[s.key] || s.fallback,
  }));

  const navLinks = [
    { labelKey: "nav.about", href: `/${loc}#about` },
    { labelKey: "nav.services", href: `/${loc}#services` },
    { labelKey: "nav.experience", href: `/${loc}#experience` },
    { labelKey: "nav.projects", href: `/${loc}#projects` },
    { labelKey: "nav.education", href: `/${loc}#education` },
    { labelKey: "nav.certs", href: `/${loc}#certifications` },
    { labelKey: "nav.skills", href: `/${loc}#skills` },
    { labelKey: "nav.blog", href: `/${loc}#blog` },
    { labelKey: "nav.contact", href: `/${loc}#contact` },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* ═══════════ BACKGROUND ═══════════ */}
      <div className="absolute inset-0 bg-[#010308]/80" />

      {/* Grid pattern */}
      <div className="absolute inset-0 footer-grid opacity-10" />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] bg-gradient-to-b from-cyan-500/5 to-transparent blur-[80px]" />

      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      {/* ═══════════ MAIN FOOTER ═══════════ */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-8 md:px-8">
        <div className="grid gap-12 md:grid-cols-12 mb-12">

          {/* ── Brand Column ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-4"
          >
            {/* Logo */}
            <a href={`/${loc}`} className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="flex flex-col leading-none">
                <span className="font-rajdhani text-lg font-bold text-white leading-none">
                  {profile?.name || t("nav.name")}
                </span>
                <span className="font-rajdhani text-[9px] uppercase tracking-[0.25em] text-cyan-400/60 leading-none mt-0.5">
                  {profile?.headline || t("nav.role")}
                </span>
              </div>
            </a>

            <p className="font-cairo text-sm leading-relaxed text-slate-500 mb-6 max-w-xs">
              {profile?.bio || t("footer.bio")}
            </p>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  aria-label={`${t("footer.visitSocial")} ${s.label}`}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800/60 bg-slate-900/60 text-slate-500 transition-all duration-300 ${s.color}`}
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── Quick Links Column ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-3"
          >
            <h4 className="mb-5 font-rajdhani text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
              {t("footer.quickLinks")}
            </h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="font-cairo text-sm text-slate-500 transition-colors duration-200 hover:text-cyan-400 flex items-center gap-1 group"
                >
                  <span className="h-px w-2 bg-slate-700 group-hover:w-3 group-hover:bg-cyan-500/60 transition-all duration-200" />
                  {t(l.labelKey)}
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── Contact Column ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-5"
          >
            <h4 className="mb-5 font-rajdhani text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
              {t("footer.getInTouch")}
            </h4>
            <div className="space-y-3 mb-6">
              <a
                href={`mailto:${profile?.email || "yousefmahmoudsaber@gmail.com"}`}
                className="flex items-center gap-3 group"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-slate-800/60 bg-slate-900/60 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-all duration-300">
                  <Mail className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <span className="font-cairo text-sm text-slate-500 group-hover:text-cyan-400 transition-colors duration-200 break-all">
                  {profile?.email || "yousefmahmoudsaber@gmail.com"}
                </span>
              </a>
              <a
                href={`tel:${(profile?.phone || "+201097585951").replace(/\s/g, "")}`}
                className="flex items-center gap-3 group"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-slate-800/60 bg-slate-900/60 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-all duration-300">
                  <Phone className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <span className="font-cairo text-sm text-slate-500 group-hover:text-cyan-400 transition-colors duration-200">
                  {profile?.phone || "+20 109 758 5951"}
                </span>
              </a>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-slate-800/60 bg-slate-900/60">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                </div>
                <span className="font-cairo text-sm text-slate-500">
                  {profile?.location || t("footer.location")}
                </span>
              </div>
            </div>

            {/* Back to top */}
            <button
              onClick={scrollToTop}
              className="group inline-flex items-center gap-2 rounded-xl border border-slate-800/60 bg-slate-900/40 px-4 py-2.5 font-rajdhani text-xs font-bold uppercase tracking-wider text-slate-500 transition-all duration-300 hover:border-cyan-500/30 hover:text-cyan-400 hover:bg-cyan-500/5"
            >
              <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
              {t("footer.backToTop")}
            </button>
          </motion.div>
        </div>

        {/* ═══════════ BOTTOM BAR ═══════════ */}
        <div className="relative border-t border-slate-800/60 pt-6 flex flex-col items-center gap-2 md:flex-row md:justify-between">

          {/* Gradient accent on divider */}
          <div className="absolute -top-px left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

          <p className="font-cairo text-xs text-slate-600">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>

          <p className="flex items-center gap-1.5 font-cairo text-xs text-slate-600">
            {t("footer.builtWith")}
            <Heart className="h-3 w-3 text-rose-500/70 fill-rose-500/40" />
            {t("footer.usingStack")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
