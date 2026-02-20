import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Send,
  User,
  AtSign,
  MessageSquare,
  Loader2,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";

const socials = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/youssefalsherief",
    color: "hover:border-blue-500/40 hover:text-blue-400",
  },
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/KINGMAN8888",
    color: "hover:border-slate-400/40 hover:text-white",
  },
  {
    icon: Send,
    label: "Telegram",
    href: "https://t.me/KINGMAN_JOU",
    color: "hover:border-cyan-500/40 hover:text-cyan-400",
  },
  {
    icon: Facebook,
    label: "Facebook",
    href: "https://www.facebook.com/kingsmanjou",
    color: "hover:border-blue-600/40 hover:text-blue-500",
  },
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://www.instagram.com/kingman_jou",
    color: "hover:border-pink-500/40 hover:text-pink-400",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: "https://wa.me/201097585951",
    color: "hover:border-green-500/40 hover:text-green-400",
  },
];

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactInfo = [
    {
      icon: Mail,
      label: t("contact.emailLabel"),
      value: "yousefmahmoudsaber@gmail.com",
      href: "mailto:yousefmahmoudsaber@gmail.com",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Phone,
      label: t("contact.phoneLabel"),
      value: "+20 109 758 5951",
      href: "tel:+201097585951",
      color: "from-blue-500 to-violet-500",
    },
    {
      icon: MapPin,
      label: t("contact.locationLabel"),
      value: t("contact.location"),
      href: undefined,
      color: "from-violet-500 to-purple-500",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.message.trim()
    ) {
      toast({
        title: t("contact.errorRequired"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (serviceId && templateId && publicKey && formRef.current) {
      emailjs
        .sendForm(serviceId, templateId, formRef.current, publicKey)
        .then(
          () => {
            toast({
              title: t("contact.successTitle"),
              description: t("contact.successMsg"),
            });
            setForm({ name: "", email: "", subject: "", message: "" });
            setLoading(false);
          },
          (error) => {
            console.error("EmailJS Error:", error);
            toast({
              title: t("contact.errorTitle"),
              description: t("contact.errorMsg"),
              variant: "destructive",
            });
            setLoading(false);
          }
        );
    } else {
      toast({
        title: "Configuration Missing",
        description: "EmailJS env variables are missing.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const contactTitle = t("contact.title");
  const contactTitleLastSpace = contactTitle.lastIndexOf(" ");
  const contactTitlePart1 = contactTitle.slice(0, contactTitleLastSpace);
  const contactTitlePart2 = contactTitle.slice(contactTitleLastSpace + 1);

  return (
    <section id="contact" className="relative py-28 overflow-hidden">
      {/* ═══════════ BACKGROUND ═══════════ */}
      <div className="absolute inset-0 bg-[#040d1a]" />

      {/* Radial ring pattern */}
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.15)_0%,transparent_60%)]" />
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[length:28px_28px]" />

      {/* Ambient glow blobs */}
      <div className="absolute top-[5%] left-[15%] h-[400px] w-[400px] rounded-full bg-cyan-600/5 blur-[140px]" />
      <div className="absolute bottom-[10%] right-[10%] h-[350px] w-[350px] rounded-full bg-violet-600/5 blur-[120px]" />

      {/* Separators */}
      <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-violet-500/15 to-transparent" />

      {/* ═══════════ CONTENT ═══════════ */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-3 font-rajdhani text-xs uppercase tracking-[0.3em] text-cyan-400/70">
            {t("contact.label")}
          </span>
          <h2 className="font-rajdhani text-4xl font-bold text-white md:text-5xl">
            {contactTitlePart1}{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              {contactTitlePart2}
            </span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto font-cairo text-base text-slate-400">
            {t("contact.description")}
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-5">
          {/* ═══════ Form — Left ═══════ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-8 backdrop-blur-sm overflow-hidden relative"
            >
              {/* Decorative corner */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-cyan-500/20 rounded-tl-2xl" />

              <h3 className="mb-6 font-rajdhani text-xl font-bold text-white flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                {t("contact.sendMessage")}
              </h3>

              <div className="space-y-5">
                {/* Name + Email row */}
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 font-rajdhani text-xs font-semibold uppercase tracking-wide text-slate-400">
                      <User className="h-3.5 w-3.5 text-cyan-400/60" />
                      {t("contact.fullName")} <span className="text-cyan-500">*</span>
                    </label>
                    <input
                      name="user_name"
                      type="text"
                      required
                      maxLength={100}
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder={t("contact.namePlaceholder")}
                      className="w-full rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-3 font-cairo text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 font-rajdhani text-xs font-semibold uppercase tracking-wide text-slate-400">
                      <AtSign className="h-3.5 w-3.5 text-cyan-400/60" />
                      {t("contact.email")} <span className="text-cyan-500">*</span>
                    </label>
                    <input
                      name="user_email"
                      type="email"
                      required
                      maxLength={255}
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder={t("contact.emailPlaceholder")}
                      className="w-full rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-3 font-cairo text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 font-rajdhani text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <Mail className="h-3.5 w-3.5 text-cyan-400/60" />
                    {t("contact.subject")}
                  </label>
                  <input
                    name="subject"
                    type="text"
                    maxLength={200}
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    placeholder={t("contact.subjectPlaceholder")}
                    className="w-full rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-3 font-cairo text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 font-rajdhani text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <MessageSquare className="h-3.5 w-3.5 text-cyan-400/60" />
                    {t("contact.message")} <span className="text-cyan-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    maxLength={2000}
                    rows={6}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder={t("contact.messagePlaceholder")}
                    className="w-full rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-3 font-cairo text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 resize-none"
                  />
                  <p className="text-right font-cairo text-xs text-slate-600">
                    {form.message.length}/2000
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-3.5 font-rajdhani text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
                  {loading ? (
                    <span className="relative flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("contact.sending")}
                    </span>
                  ) : (
                    <span className="relative flex items-center justify-center gap-2">
                      <Send className="h-4 w-4" />
                      {t("contact.send")}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* ═══════ Contact Info — Right ═══════ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact Cards */}
            {contactInfo.map((info, i) => {
              const Wrapper = info.href ? "a" : "div";
              return (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Wrapper
                    {...(info.href
                      ? {
                        href: info.href,
                        target: info.href.startsWith("http")
                          ? "_blank"
                          : undefined,
                        rel: info.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined,
                      }
                      : {})}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-800/30"
                  >
                    <div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${info.color} shadow-lg shadow-black/20`}
                    >
                      <info.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-rajdhani text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {info.label}
                      </p>
                      <p className="font-cairo text-sm text-slate-300 group-hover:text-white transition-colors">
                        {info.value}
                      </p>
                    </div>
                  </Wrapper>
                </motion.div>
              );
            })}

            {/* Social Links Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6 backdrop-blur-sm overflow-hidden relative"
            >
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-violet-500/20 rounded-br-2xl" />

              <h4 className="mb-4 font-rajdhani text-sm font-bold uppercase tracking-wide text-slate-400">
                {t("contact.connectWith")}
              </h4>
              <div className="flex flex-wrap gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    aria-label={`${t("footer.visitSocial")} ${s.label}`}
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800/40 text-slate-400 transition-all duration-300 ${s.color}`}
                  >
                    <s.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Availability Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </span>
                <p className="font-rajdhani text-sm font-bold text-emerald-400">
                  {t("contact.availableBadge")}
                </p>
              </div>
              <p className="mt-2 pl-6 font-cairo text-xs text-slate-400">
                {t("contact.availableMsg")}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
