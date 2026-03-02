import { motion } from "framer-motion";
import { ArrowDown, ChevronRight, Terminal, Cpu, Globe, Layers, Github, Linkedin, Send, Facebook, Instagram, MessageCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import * as THREE from "three";
import { useProfile } from "@/hooks/useProfile";
import { renderColoredText } from "@/pages/admin/AdminProfile";

/* ─── typing config ─── */
const TYPING_SPEED = 75;
const DELETING_SPEED = 35;
const PAUSE_AFTER_TYPE = 2200;

/* ─── stat defs — values overridden by profile from DB ─── */
const statKeys = [
  { key: "yearsExp" as const, labelKey: "hero.stats.yearsExp", suffix: "+", icon: Terminal, defaultVal: 5 },
  { key: "projectsCount" as const, labelKey: "hero.stats.projects", suffix: "+", icon: Layers, defaultVal: 30 },
  { key: "technologiesCount" as const, labelKey: "hero.stats.technologies", suffix: "+", icon: Cpu, defaultVal: 20 },
  { key: "countriesCount" as const, labelKey: "hero.stats.countries", suffix: "", icon: Globe, defaultVal: 3 },
];

/* ─── social links — fallback hrefs used if profile not yet loaded ─── */
const socialLinks = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    key: "linkedin" as const,
    fallback: "https://linkedin.com/in/youssefalsherief",
    hoverColor: "#3b82f6",
    hoverBg: "rgba(59,130,246,0.12)",
  },
  {
    icon: Github,
    label: "GitHub",
    key: "github" as const,
    fallback: "https://github.com/KINGMAN8888",
    hoverColor: "#e2e8f0",
    hoverBg: "rgba(226,232,240,0.08)",
  },
  {
    icon: Send,
    label: "Telegram",
    key: "telegram" as const,
    fallback: "https://t.me/KINGMAN_JOU",
    hoverColor: "#06b6d4",
    hoverBg: "rgba(6,182,212,0.12)",
  },
  {
    icon: Facebook,
    label: "Facebook",
    key: "facebook" as const,
    fallback: "https://facebook.com/kingsmanjou",
    hoverColor: "#60a5fa",
    hoverBg: "rgba(96,165,250,0.12)",
  },
  {
    icon: Instagram,
    label: "Instagram",
    key: "instagram" as const,
    fallback: "https://instagram.com/kingman_jou",
    hoverColor: "#f472b6",
    hoverBg: "rgba(244,114,182,0.12)",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    key: "whatsapp" as const,
    fallback: "https://wa.me/201097585951",
    hoverColor: "#34d399",
    hoverBg: "rgba(52,211,153,0.12)",
  },
];

/* ─── floating skill chips ─── */
const techChips = [
  { label: "React", color: "#61dafb" },
  { label: "Python", color: "#3b82f6" },
  { label: "AWS", color: "#f59e0b" },
  { label: "Docker", color: "#06b6d4" },
  { label: "AI/ML", color: "#8b5cf6" },
  { label: "Linux", color: "#10b981" },
];

/* ══════════════════════════════════════
   THREE.JS NEURAL NETWORK CANVAS
══════════════════════════════════════ */
const NeuralCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    /* Scene setup */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 2000);
    camera.position.z = 350;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    /* Particle count based on device */
    const COUNT = isMobile ? 80 : 180;
    const CONNECT_DIST = isMobile ? 80 : 110;
    const SPREAD = isMobile ? 200 : 350;

    /* Particle positions & velocities */
    const positions = new Float32Array(COUNT * 3);
    const velocities: THREE.Vector3[] = [];
    const colors = new Float32Array(COUNT * 3);

    const palette = [
      new THREE.Color("#06b6d4"),  // cyan
      new THREE.Color("#3b82f6"),  // blue
      new THREE.Color("#8b5cf6"),  // violet
      new THREE.Color("#a5f3fc"),  // light cyan
    ];

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * SPREAD * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD * 1.4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD;
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.18,
        (Math.random() - 0.5) * 0.18,
        (Math.random() - 0.5) * 0.08,
      ));
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    /* Point cloud */
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const pointMat = new THREE.PointsMaterial({
      size: isMobile ? 2.2 : 2.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, pointMat);
    scene.add(points);

    /* Line segments (connections) */
    const maxLines = COUNT * 4;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
    lineGeo.setDrawRange(0, 0);
    const lineMat = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
    }));
    scene.add(lineMat);

    /* Mouse interaction */
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    const handleTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current = {
          x: (e.touches[0].clientX / window.innerWidth - 0.5) * 2,
          y: -(e.touches[0].clientY / window.innerHeight - 0.5) * 2,
        };
      }
    };
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("touchmove", handleTouch, { passive: true });

    /* Resize */
    const handleResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    /* Animation loop */
    let frame = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;

      const pos = geo.attributes.position.array as Float32Array;

      /* Gentle camera drift following mouse */
      camera.position.x += (mouseRef.current.x * 30 - camera.position.x) * 0.018;
      camera.position.y += (mouseRef.current.y * 20 - camera.position.y) * 0.018;
      camera.lookAt(scene.position);

      /* Slow rotation of entire group */
      points.rotation.y += 0.0008;
      lineMat.rotation.y += 0.0008;

      /* Update particles */
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3] += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;

        /* Bounce off boundaries */
        if (Math.abs(pos[i * 3]) > SPREAD) velocities[i].x *= -1;
        if (Math.abs(pos[i * 3 + 1]) > SPREAD * 0.7) velocities[i].y *= -1;
        if (Math.abs(pos[i * 3 + 2]) > SPREAD * 0.5) velocities[i].z *= -1;
      }
      geo.attributes.position.needsUpdate = true;

      /* Build connection lines every 2 frames for perf */
      if (frame % 2 === 0) {
        let lineIdx = 0;
        const lp = lineGeo.attributes.position.array as Float32Array;
        const lc = lineGeo.attributes.color.array as Float32Array;

        for (let i = 0; i < COUNT && lineIdx < maxLines; i++) {
          for (let j = i + 1; j < COUNT && lineIdx < maxLines; j++) {
            const dx = pos[i * 3] - pos[j * 3];
            const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
            const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < CONNECT_DIST) {
              const alpha = 1 - dist / CONNECT_DIST;
              lp[lineIdx * 6] = pos[i * 3];
              lp[lineIdx * 6 + 1] = pos[i * 3 + 1];
              lp[lineIdx * 6 + 2] = pos[i * 3 + 2];
              lp[lineIdx * 6 + 3] = pos[j * 3];
              lp[lineIdx * 6 + 4] = pos[j * 3 + 1];
              lp[lineIdx * 6 + 5] = pos[j * 3 + 2];
              // color lerp between connected nodes
              lc[lineIdx * 6] = colors[i * 3] * alpha;
              lc[lineIdx * 6 + 1] = colors[i * 3 + 1] * alpha;
              lc[lineIdx * 6 + 2] = colors[i * 3 + 2] * alpha;
              lc[lineIdx * 6 + 3] = colors[j * 3] * alpha;
              lc[lineIdx * 6 + 4] = colors[j * 3 + 1] * alpha;
              lc[lineIdx * 6 + 5] = colors[j * 3 + 2] * alpha;
              lineIdx++;
            }
          }
        }
        lineGeo.setDrawRange(0, lineIdx * 2);
        lineGeo.attributes.position.needsUpdate = true;
        lineGeo.attributes.color.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("touchmove", handleTouch);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [isMobile]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
};

/* ══════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════ */
const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = Math.ceil(value / 40);
        const timer = setInterval(() => {
          start += step;
          if (start >= value) { setCount(value); clearInterval(timer); }
          else setCount(start);
        }, 35);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ══════════════════════════════════════
   HERO
══════════════════════════════════════ */
const Hero = () => {
  const { t } = useTranslation();
  const i18nRoles = t("hero.roles", { returnObjects: true }) as string[];
  const { profile } = useProfile();
  // Use DB roles if available, fall back to i18n
  const roles = (profile?.heroRoles && profile.heroRoles.length > 0) ? profile.heroRoles : i18nRoles;

  // Split profile name into first/last for the two-line hero display
  // Falls back to i18n hardcoded values while profile is loading
  const fullName = profile?.name || t("nav.name");
  const nameParts = fullName.trim().split(" ");
  const nameFirst = nameParts.slice(0, -1).join(" ") || nameParts[0];
  const nameLast = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const heroTagline = profile?.headline || t("hero.tagline");
  const heroDescription = profile?.heroBio || null;
  const heroCyan = profile?.heroBioCyan;
  const heroViolet = profile?.heroBioViolet;

  // Build stats from profile (with i18n defaults while loading)
  const statDefs = statKeys.map(s => ({
    ...s,
    value: (profile?.[s.key] ?? s.defaultVal) as number,
  }));

  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length - 1 === 0) {
          setIsDeleting(false);
          setRoleIndex(p => (p + 1) % roles.length);
        }
      }
    }, isDeleting ? DELETING_SPEED : TYPING_SPEED);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex, roles]);

  return (
    <section className="hero-root relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent">

      {/* ── GRADIENT BASE ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/70 via-transparent to-[#020617]/80 pointer-events-none" />

      {/* ── HEX GRID OVERLAY ── */}
      <div className="absolute inset-0 hero-hex-grid opacity-20 pointer-events-none" />

      {/* ── AMBIENT GLOWS ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-[10%] h-[600px] w-[600px] rounded-full bg-cyan-500/5 blur-[180px]" />
        <div className="absolute bottom-0 right-[5%] h-[500px] w-[500px] rounded-full bg-violet-600/5 blur-[160px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-blue-600/4 blur-[120px]" />
      </div>

      {/* ── VIGNETTE ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(2,6,23,0.75)_100%)] pointer-events-none" />

      {/* ══════════ CONTENT ══════════ */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-16 flex items-center justify-start lg:justify-center">
        <div className="hero-grid">

          {/* ── PROFILE CARD (mobile: first / desktop: right) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="hero-card-col"
          >
            {/* ══ FRAMELESS PHOTO — unified mobile + desktop ══ */}
            <div className="relative hero-photo-frame mx-auto animate-float group">

              {/* Floating tech chips — desktop only */}
              {techChips.map((chip, i) => {
                const angle = (i / techChips.length) * Math.PI * 2;
                const rx = 54, ry = 46;
                const x = 50 + rx * Math.cos(angle);
                const y = 50 + ry * Math.sin(angle);
                return (
                  <motion.div
                    key={chip.label}
                    className="hero-tech-chip absolute hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-rajdhani font-bold uppercase tracking-wider backdrop-blur-md z-20 whitespace-nowrap"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: "translate(-50%,-50%)",
                      borderColor: chip.color + "55",
                      color: chip.color,
                      background: chip.color + "12",
                      boxShadow: `0 0 12px ${chip.color}30`,
                      "--chip-color": chip.color,
                    } as React.CSSProperties}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.15 }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full animate-pulse hero-chip-dot" />
                    {chip.label}
                  </motion.div>
                );
              })}

              {/* Soft ambient glow behind figure */}
              <div className="absolute inset-x-[10%] inset-y-[5%] bg-gradient-to-b from-cyan-500/10 via-blue-600/8 to-violet-600/10 blur-3xl rounded-full pointer-events-none animate-pulse-glow" />

              {/* Ground reflection */}
              <div className="absolute -bottom-3 left-[15%] right-[15%] h-6 bg-cyan-500/20 blur-2xl rounded-full pointer-events-none" />

              {/* Photo — transparent background */}
              <img
                src="/assets/CV.P.W.B.webp"
                alt={t("nav.name")}
                className="relative z-10 w-full h-full object-contain select-none transition-transform duration-1000 group-hover:scale-[1.03] hero-photo-img"
                loading="eager"
                draggable={false}
              />
            </div>
          </motion.div>

          {/* ── TEXT CONTENT (mobile: second / desktop: left, order-first) ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
            className="hero-text-col"
          >
            {/* Terminal role indicator */}
            <div className="flex justify-center lg:justify-start">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-800/80 bg-slate-950/70 px-3 py-1.5 backdrop-blur-sm"
              >
                <span className="text-cyan-500/50 font-mono text-xs select-none">~/dev $</span>
                <span className="text-slate-500 font-mono text-xs select-none">role=</span>
                <span className="text-cyan-300 font-mono text-xs tracking-wide">{text}</span>
                <span className="inline-block w-[1.5px] h-[12px] bg-cyan-400 animate-pulse" />
              </motion.div>
            </div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8 }}
              className="hero-name font-rajdhani font-black leading-[0.92] tracking-tight mb-4"
            >
              <span className="block bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                {nameFirst}
              </span>
              {nameLast && (
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent hero-name-glow">
                  {nameLast}
                </span>
              )}
            </motion.h1>

            {/* Divider with tagline (headline from profile) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="mb-5 flex items-center gap-3 justify-center lg:justify-start"
            >
              <span className="h-px w-6 bg-gradient-to-r from-transparent to-cyan-500/60" />
              <span className="font-rajdhani text-base sm:text-lg font-semibold tracking-widest text-slate-400 uppercase">
                {heroTagline}
              </span>
              <span className="h-px w-6 bg-gradient-to-l from-transparent to-violet-500/60" />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="mb-8 max-w-[520px] mx-auto lg:mx-0 font-cairo text-sm sm:text-base text-slate-400 leading-[1.85] text-center lg:text-left"
            >
              {heroDescription ? (
                renderColoredText(heroDescription, heroCyan, heroViolet)
              ) : (
                <>
                  {t("hero.descriptionPart1")}{" "}
                  <span className="text-cyan-400 font-semibold">{t("hero.descriptionCyan")}</span>{" "}{t("hero.descriptionMid")}{" "}
                  <span className="text-violet-400 font-semibold">{t("hero.descriptionViolet")}</span>
                  {" "}{t("hero.descriptionEnd")}
                </>
              )}
            </motion.p>

            {/* ── SOCIAL LINKS ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 }}
              className="mb-4 grid grid-cols-6 gap-2"
            >
              {socialLinks.map((s, i) => {
                const href = profile?.social?.[s.key] || s.fallback;
                return (
                  <motion.a
                    key={s.label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 + i * 0.05, duration: 0.35 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.93 }}
                    className={`relative flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-800/70 bg-slate-900/40 backdrop-blur-sm py-2.5 px-1 group/social transition-colors duration-300 social-theme-${i}`}
                  >
                    <s.icon className="h-[15px] w-[15px] text-slate-500 group-hover/social:text-[inherit] transition-colors duration-200" />
                    <span className="font-rajdhani text-[8px] uppercase tracking-widest text-slate-600 group-hover/social:text-[inherit] transition-colors duration-200 leading-none">
                      {s.label}
                    </span>
                    {/* bottom accent line */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-0 group-hover/social:w-3/4 transition-all duration-400 rounded-full hero-social-accent" />
                  </motion.a>
                )
              })}
            </motion.div>

            {/* ── STATS ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05 }}
              className="hero-stats mb-8"
            >
              {statDefs.map((s) => (
                <div
                  key={s.labelKey}
                  className="hero-stat-item relative flex flex-col items-center justify-center rounded-xl border border-slate-800/70 bg-slate-900/40 backdrop-blur-sm py-3 px-2 gap-1 group hover:border-cyan-500/30 transition-colors duration-300"
                >
                  <s.icon className="h-3.5 w-3.5 text-cyan-500/60 mb-0.5" />
                  <span className="font-rajdhani text-xl sm:text-2xl font-black text-white">
                    <Counter value={s.value} suffix={s.suffix} />
                  </span>
                  <span className="font-rajdhani text-[10px] uppercase tracking-widest text-slate-600">
                    {t(s.labelKey)}
                  </span>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-0 bg-gradient-to-r from-cyan-500 to-violet-500 group-hover:w-3/4 transition-all duration-500 rounded-full" />
                </div>
              ))}
            </motion.div>

            {/* ── CTA BUTTONS ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.55 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              {/* Primary */}
              <a
                href="#projects"
                className="hero-btn-primary group relative w-full sm:w-auto inline-flex h-13 items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-7 font-rajdhani text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:shadow-[0_0_35px_rgba(6,182,212,0.45)] hover:scale-[1.02]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-500" />
                <span className="relative z-10 flex items-center gap-2">
                  {t("hero.viewProjects")}
                  <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </span>
              </a>

              {/* Secondary */}
              <a
                href="#contact"
                className="hero-btn-secondary group relative w-full sm:w-auto inline-flex h-13 items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/50 px-7 font-rajdhani text-sm font-bold uppercase tracking-widest text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/40 hover:text-white hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] hover:scale-[1.02]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t("hero.contactMe")}
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </a>
            </motion.div>
          </motion.div>

        </div>{/* /hero-grid */}
      </div>

    </section>
  );
};

export default Hero;
