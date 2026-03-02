import { useState, useEffect } from "react";
import { useApiUpdate } from "@/hooks/useApiHooks";
import { useProfile } from "@/hooks/useProfile";
import {
    Save, User, Github, Linkedin, Twitter, Globe, MapPin, Mail,
    Briefcase, Eye, Phone, Send, Facebook, Instagram, MessageCircle,
    Languages, BarChart2, Hash, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import type { UserProfile } from "@/hooks/useProfile";

const defaultProfile: UserProfile = {
    name: "Yousef Alsherief",
    nameAr: "يوسف الشريف",
    headline: "Full Stack Engineer & AI Enthusiast",
    headlineAr: "مهندس فول ستاك ومتحمس للذكاء الاصطناعي",
    bio: "I build high-performance web applications with modern technologies.",
    bioAr: "أبني تطبيقات ويب عالية الأداء باستخدام أحدث التقنيات.",
    heroBio: "From server assembly to AI-powered applications — delivering end-to-end solutions across the entire technology stack with precision and scale.",
    heroBioAr: "من تجميع الخوادم إلى تطبيقات الذكاء الاصطناعي — أقدم حلولاً متكاملة عبر كامل مكدس التكنولوجيا بدقة وقابلية للتوسع.",
    heroBioCyan: "server assembly",
    heroBioViolet: "AI-powered applications",
    heroRoles: [
        "Full-Stack Developer",
        "AI Engineer",
        "Cloud Architect",
        "Computer Engineer",
        "System Administrator",
    ],
    location: "Alexandria, Egypt",
    locationAr: "الإسكندرية، مصر",
    availability: "Available for freelance work",
    availabilityAr: "متاح للعمل الحر",
    email: "contact@example.com",
    phone: "",
    yearsExp: 5,
    projectsCount: 30,
    technologiesCount: 20,
    countriesCount: 3,
    social: {
        github: "https://github.com/KINGMAN8888",
        linkedin: "https://linkedin.com/in/youssefalsherief",
        twitter: "",
        website: "",
        telegram: "https://t.me/KINGMAN_JOU",
        facebook: "https://facebook.com/kingsmanjou",
        instagram: "https://instagram.com/kingman_jou",
        whatsapp: "https://wa.me/201097585951",
    },
};

/**
 * Splits `text` by the given cyan/violet keywords and wraps each match
 * in a colored <span>. Used in both AdminProfile preview and Hero.tsx.
 */
export function renderColoredText(text: string, cyanWord?: string, violetWord?: string) {
    const markers: Array<{ word: string; color: "cyan" | "violet" }> = [];
    if (cyanWord?.trim()) markers.push({ word: cyanWord.trim(), color: "cyan" });
    if (violetWord?.trim()) markers.push({ word: violetWord.trim(), color: "violet" });
    if (markers.length === 0) return text;

    const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${markers.map(m => escape(m.word)).join("|")})`, "gi");
    const segments = text.split(regex);

    return segments.map((seg, i) => {
        if (cyanWord && seg.toLowerCase() === cyanWord.trim().toLowerCase())
            return <span key={i} className="text-cyan-400 font-semibold">{seg}</span>;
        if (violetWord && seg.toLowerCase() === violetWord.trim().toLowerCase())
            return <span key={i} className="text-violet-400 font-semibold">{seg}</span>;
        return <span key={i}>{seg}</span>;
    });
}

const AdminProfile = () => {
    const { profile, isLoading } = useProfile();
    const updateProfile = useApiUpdate("profile");
    const [formData, setFormData] = useState<UserProfile>(defaultProfile);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData({
                ...defaultProfile,
                ...profile,
                social: { ...defaultProfile.social, ...(profile.social as UserProfile["social"]) },
            });
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith("social.")) {
            const key = name.split(".")[1] as keyof UserProfile["social"];
            setFormData(prev => ({ ...prev, social: { ...prev.social, [key]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Always upsert via PUT /portfolio/profile
            await updateProfile.mutateAsync({ id: "main", data: formData });
            toast.success("Profile saved! Changes are now live across the site.");
        } catch {
            toast.error("Failed to save profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: "rgba(8,14,30,0.6)", border: "1px solid rgba(51,65,85,0.4)" }} />
            ))}
        </div>
    );

    const getSocial = (key: keyof UserProfile["social"]) => formData.social?.[key] ?? "";

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}>
                    <User size={20} className="text-violet-400" />
                </div>
                <div>
                    <h1 className="font-rajdhani text-2xl font-bold text-white">Profile Settings</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Changes save to the database and propagate across the entire site</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Live Preview Card */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <p className="admin-label mb-3"><Eye size={12} /> Live Preview</p>
                        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(8,14,30,0.8)", border: "1px solid rgba(51,65,85,0.5)" }}>
                            {/* Banner */}
                            <div className="h-20" style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.3), rgba(139,92,246,0.3))" }} />
                            {/* Avatar */}
                            <div className="px-5 pb-5">
                                <div className="w-16 h-16 rounded-2xl -mt-8 mb-3 flex items-center justify-center font-rajdhani text-xl font-bold text-white" style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)", border: "3px solid #080e1e" }}>
                                    {formData.name.charAt(0)}
                                </div>
                                <h3 className="font-rajdhani text-lg font-bold text-white leading-tight">{formData.name || "—"}</h3>
                                {formData.nameAr && <p className="text-xs text-slate-500 mt-0.5" dir="rtl">{formData.nameAr}</p>}
                                <p className="text-xs text-cyan-400 font-semibold mt-0.5">{formData.headline || "—"}</p>
                                {formData.location && (
                                    <p className="flex items-center gap-1 text-xs text-slate-500 mt-2"><MapPin size={10} /> {formData.location}</p>
                                )}
                                {formData.email && (
                                    <p className="flex items-center gap-1 text-xs text-slate-500 mt-1"><Mail size={10} /> {formData.email}</p>
                                )}
                                {formData.phone && (
                                    <p className="flex items-center gap-1 text-xs text-slate-500 mt-1"><Phone size={10} /> {formData.phone}</p>
                                )}
                                {formData.availability && (
                                    <span className="inline-flex items-center gap-1 mt-3 px-2.5 py-1 rounded-full text-[10px] font-bold font-rajdhani uppercase text-emerald-400" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                                        {formData.availability}
                                    </span>
                                )}
                                {formData.bio && (
                                    <p className="text-xs text-slate-400 mt-3 leading-relaxed line-clamp-3">{formData.bio}</p>
                                )}
                                {/* Social Icons */}
                                <div className="flex flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: "1px solid rgba(51,65,85,0.4)" }}>
                                    {getSocial("github") && <a href={getSocial("github")} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white transition-colors" style={{ background: "rgba(255,255,255,0.05)" }}><Github size={13} /></a>}
                                    {getSocial("linkedin") && <a href={getSocial("linkedin")} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-400 transition-colors" style={{ background: "rgba(255,255,255,0.05)" }}><Linkedin size={13} /></a>}
                                    {getSocial("twitter") && <a href={getSocial("twitter")} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-sky-400 transition-colors" style={{ background: "rgba(255,255,255,0.05)" }}><Twitter size={13} /></a>}
                                    {getSocial("telegram") && <a href={getSocial("telegram")} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-cyan-400 transition-colors" style={{ background: "rgba(255,255,255,0.05)" }}><Send size={13} /></a>}
                                    {getSocial("facebook") && <a href={getSocial("facebook")} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-500 transition-colors" style={{ background: "rgba(255,255,255,0.05)" }}><Facebook size={13} /></a>}
                                    {getSocial("instagram") && <a href={getSocial("instagram")} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-pink-400 transition-colors" style={{ background: "rgba(255,255,255,0.05)" }}><Instagram size={13} /></a>}
                                    {getSocial("whatsapp") && <a href={getSocial("whatsapp")} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-emerald-400 transition-colors" style={{ background: "rgba(255,255,255,0.05)" }}><MessageCircle size={13} /></a>}
                                    {getSocial("website") && <a href={getSocial("website")} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-cyan-400 transition-colors" style={{ background: "rgba(255,255,255,0.05)" }}><Globe size={13} /></a>}
                                </div>
                            </div>
                        </div>
                        {/* Live info badge */}
                        <div className="mt-3 rounded-xl p-3 text-xs text-slate-500" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}>
                            <span className="text-emerald-400 font-semibold">⚡ Live sync</span> — saving updates Hero, Contact & Footer instantly
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSave} className="space-y-5">

                        {/* Basic Info */}
                        <div className="admin-section-card">
                            <h2 className="font-rajdhani text-base font-bold text-white mb-4 flex items-center gap-2">
                                <User size={16} className="text-violet-400" /> Basic Information
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="admin-label"><User size={10} /> Display Name (EN)</label>
                                    <input required name="name" type="text" value={formData.name} onChange={handleChange} className="admin-input" placeholder="Your full name" />
                                </div>
                                <div>
                                    <label className="admin-label"><Briefcase size={10} /> Job Title / Headline (EN)</label>
                                    <input required name="headline" type="text" value={formData.headline} onChange={handleChange} className="admin-input" placeholder="e.g. Full Stack Engineer" />
                                </div>
                                <div>
                                    <label className="admin-label"><MapPin size={10} /> Location (EN)</label>
                                    <input name="location" type="text" value={formData.location} onChange={handleChange} className="admin-input" placeholder="City, Country" />
                                </div>
                                <div>
                                    <label className="admin-label"><Mail size={10} /> Public Email</label>
                                    <input required name="email" type="email" value={formData.email} onChange={handleChange} className="admin-input" placeholder="you@example.com" />
                                </div>
                                <div>
                                    <label className="admin-label"><Phone size={10} /> Phone Number</label>
                                    <input name="phone" type="tel" value={formData.phone || ""} onChange={handleChange} className="admin-input" placeholder="+20 109 758 5951" />
                                </div>
                                <div>
                                    <label className="admin-label">Availability Status (EN)</label>
                                    <input name="availability" type="text" value={formData.availability} onChange={handleChange} className="admin-input" placeholder="e.g. Open to opportunities" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="admin-label">About Me / Bio (EN)</label>
                                    <textarea name="bio" rows={4} value={formData.bio} onChange={handleChange} className="admin-textarea" placeholder="Tell the world about yourself..." />
                                </div>
                            </div>
                        </div>

                        {/* ═══ Hero Section Content ═══ */}
                        <div className="admin-section-card">
                            <h2 className="font-rajdhani text-base font-bold text-white mb-1 flex items-center gap-2">
                                <Sparkles size={16} className="text-cyan-400" /> Hero Section Content
                            </h2>
                            <p className="text-xs text-slate-500 mb-4">Controls the description paragraph and achievement stats visible in the Hero section of the website.</p>

                            {/* Hero Description */}
                            <div className="mb-4">
                                <label className="admin-label"><Briefcase size={10} /> Hero Description (EN) — paragraph under the headline</label>
                                <textarea
                                    name="heroBio"
                                    rows={3}
                                    value={formData.heroBio || ""}
                                    onChange={handleChange}
                                    className="admin-textarea"
                                    placeholder="From server assembly to AI-powered applications — delivering end-to-end solutions..."
                                />
                            </div>

                            {/* Color Highlights */}
                            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="rounded-xl p-3" style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)" }}>
                                    <label className="admin-label" style={{ color: "#22d3ee" }}>
                                        <span className="inline-block w-2 h-2 rounded bg-cyan-400 mr-1.5" />
                                        Cyan Highlight
                                    </label>
                                    <input
                                        name="heroBioCyan"
                                        type="text"
                                        value={formData.heroBioCyan || ""}
                                        onChange={handleChange}
                                        className="admin-input"
                                        placeholder="e.g. server assembly"
                                    />
                                    <p className="mt-1 text-[10px] text-slate-600">Exact phrase to color cyan.</p>
                                </div>
                                <div className="rounded-xl p-3" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)" }}>
                                    <label className="admin-label" style={{ color: "#a78bfa" }}>
                                        <span className="inline-block w-2 h-2 rounded bg-violet-400 mr-1.5" />
                                        Violet Highlight
                                    </label>
                                    <input
                                        name="heroBioViolet"
                                        type="text"
                                        value={formData.heroBioViolet || ""}
                                        onChange={handleChange}
                                        className="admin-input"
                                        placeholder="e.g. AI-powered applications"
                                    />
                                    <p className="mt-1 text-[10px] text-slate-600">Exact phrase to color violet.</p>
                                </div>
                            </div>

                            {/* Live preview */}
                            {formData.heroBio && (
                                <div className="mb-4 rounded-xl p-3" style={{ background: "rgba(8,14,30,0.8)", border: "1px dashed rgba(51,65,85,0.6)" }}>
                                    <p className="text-[10px] text-slate-600 mb-2 uppercase tracking-wider flex items-center gap-1"><Eye size={9} /> Preview</p>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        {renderColoredText(formData.heroBio, formData.heroBioCyan, formData.heroBioViolet)}
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="admin-label mb-2"><BarChart2 size={10} /> Achievement Stats (shown as animated counters)</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {([
                                        { name: "yearsExp" as const, label: "Years Exp", suffix: "+", color: "text-cyan-400", icon: "⚡" },
                                        { name: "projectsCount" as const, label: "Projects", suffix: "+", color: "text-blue-400", icon: "🚀" },
                                        { name: "technologiesCount" as const, label: "Technologies", suffix: "+", color: "text-violet-400", icon: "🔧" },
                                        { name: "countriesCount" as const, label: "Countries", suffix: "", color: "text-emerald-400", icon: "🌍" },
                                    ] as const).map(stat => {
                                        const val = (formData[stat.name] ?? 0) as number;
                                        return (
                                            <div key={stat.name} className="rounded-xl p-3 flex flex-col gap-2" style={{ background: "rgba(8,14,30,0.6)", border: "1px solid rgba(51,65,85,0.4)" }}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] text-slate-500 font-rajdhani uppercase tracking-wider">{stat.icon} {stat.label}</span>
                                                    <span className={`font-rajdhani font-black text-lg ${stat.color}`}>
                                                        {val}{stat.suffix}
                                                    </span>
                                                </div>
                                                <input
                                                    name={stat.name}
                                                    type="number"
                                                    min={0}
                                                    max={999}
                                                    value={val}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, [stat.name]: parseInt(e.target.value) || 0 }))}
                                                    className="admin-input text-center font-rajdhani font-bold text-lg"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ═══ Typing Roles ═══ */}
                        <div className="admin-section-card">
                            <h2 className="font-rajdhani text-base font-bold text-white mb-1 flex items-center gap-2">
                                <Hash size={16} className="text-green-400" />
                                Typing Roles Animation
                            </h2>
                            <p className="text-xs text-slate-500 mb-4">
                                These titles rotate in the <code className="text-cyan-400 bg-slate-800/60 px-1 rounded">role=</code> terminal animation on the Hero. Add, edit, reorder, or remove any title.
                            </p>

                            {/* Terminal preview */}
                            <div className="mb-4 rounded-xl px-4 py-3 font-mono text-sm flex items-center gap-2" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(6,182,212,0.2)" }}>
                                <span className="text-slate-500 select-none">~/dev $</span>
                                <span className="text-slate-400">role=</span>
                                <span className="text-cyan-400 font-bold">
                                    {(formData.heroRoles ?? [])[0] || "Full-Stack Developer"}
                                </span>
                                <span className="animate-pulse text-cyan-300 font-bold">|</span>
                            </div>

                            {/* Roles list */}
                            <div className="space-y-2 mb-3">
                                {(formData.heroRoles ?? []).map((role, idx) => (
                                    <div key={idx} className="flex items-center gap-2 group">
                                        {/* Order buttons */}
                                        <div className="flex flex-col gap-0.5">
                                            <button
                                                type="button"
                                                disabled={idx === 0}
                                                onClick={() => setFormData(prev => {
                                                    const arr = [...(prev.heroRoles ?? [])];
                                                    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                                                    return { ...prev, heroRoles: arr };
                                                })}
                                                className="text-slate-600 hover:text-cyan-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                                title="Move up"
                                            >▲</button>
                                            <button
                                                type="button"
                                                disabled={idx === (formData.heroRoles ?? []).length - 1}
                                                onClick={() => setFormData(prev => {
                                                    const arr = [...(prev.heroRoles ?? [])];
                                                    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
                                                    return { ...prev, heroRoles: arr };
                                                })}
                                                className="text-slate-600 hover:text-cyan-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                                title="Move down"
                                            >▼</button>
                                        </div>

                                        {/* Role badge number */}
                                        <span className="w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] text-slate-600 flex-shrink-0" style={{ background: "rgba(51,65,85,0.4)" }}>
                                            {idx + 1}
                                        </span>

                                        {/* Input */}
                                        <input
                                            type="text"
                                            value={role}
                                            onChange={(e) => setFormData(prev => {
                                                const arr = [...(prev.heroRoles ?? [])];
                                                arr[idx] = e.target.value;
                                                return { ...prev, heroRoles: arr };
                                            })}
                                            className="admin-input flex-1"
                                            placeholder="e.g. Full-Stack Developer"
                                        />

                                        {/* Delete */}
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                heroRoles: (prev.heroRoles ?? []).filter((_, i) => i !== idx)
                                            }))}
                                            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                                            title="Remove role"
                                        >✕</button>
                                    </div>
                                ))}
                            </div>

                            {/* Add new role */}
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    heroRoles: [...(prev.heroRoles ?? []), ""]
                                }))}
                                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-rajdhani font-semibold text-emerald-400 transition-all duration-200"
                                style={{ border: "1px dashed rgba(52,211,153,0.35)", background: "rgba(52,211,153,0.05)" }}
                            >
                                <span className="text-lg leading-none">+</span> Add New Role
                            </button>
                        </div>

                        {/* Arabic Content */}
                        <div className="admin-section-card">
                            <h2 className="font-rajdhani text-base font-bold text-white mb-4 flex items-center gap-2">
                                <Languages size={16} className="text-amber-400" /> Arabic Content (اللغة العربية)
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" dir="rtl">
                                <div>
                                    <label className="admin-label">الاسم (AR)</label>
                                    <input name="nameAr" type="text" value={formData.nameAr || ""} onChange={handleChange} className="admin-input text-right" placeholder="الاسم الكامل" />
                                </div>
                                <div>
                                    <label className="admin-label">المسمى الوظيفي (AR)</label>
                                    <input name="headlineAr" type="text" value={formData.headlineAr || ""} onChange={handleChange} className="admin-input text-right" placeholder="مثال: مهندس فول ستاك" />
                                </div>
                                <div>
                                    <label className="admin-label">الموقع (AR)</label>
                                    <input name="locationAr" type="text" value={formData.locationAr || ""} onChange={handleChange} className="admin-input text-right" placeholder="مدينة، دولة" />
                                </div>
                                <div>
                                    <label className="admin-label">حالة التوافر (AR)</label>
                                    <input name="availabilityAr" type="text" value={formData.availabilityAr || ""} onChange={handleChange} className="admin-input text-right" placeholder="مثال: متاح للعمل الحر" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="admin-label">نبذة عني (AR)</label>
                                    <textarea name="bioAr" rows={4} value={formData.bioAr || ""} onChange={handleChange} className="admin-textarea text-right" placeholder="اكتب عن نفسك بالعربية..." />
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="admin-section-card">
                            <h2 className="font-rajdhani text-base font-bold text-white mb-4 flex items-center gap-2">
                                <Globe size={16} className="text-cyan-400" /> Social & Web Links
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { name: "social.github", icon: Github, label: "GitHub URL", placeholder: "https://github.com/..." },
                                    { name: "social.linkedin", icon: Linkedin, label: "LinkedIn URL", placeholder: "https://linkedin.com/in/..." },
                                    { name: "social.twitter", icon: Twitter, label: "Twitter / X URL", placeholder: "https://twitter.com/..." },
                                    { name: "social.website", icon: Globe, label: "Personal Website", placeholder: "https://yoursite.com" },
                                    { name: "social.telegram", icon: Send, label: "Telegram URL", placeholder: "https://t.me/..." },
                                    { name: "social.facebook", icon: Facebook, label: "Facebook URL", placeholder: "https://facebook.com/..." },
                                    { name: "social.instagram", icon: Instagram, label: "Instagram URL", placeholder: "https://instagram.com/..." },
                                    { name: "social.whatsapp", icon: MessageCircle, label: "WhatsApp Link", placeholder: "https://wa.me/201097585951" },
                                ].map(field => (
                                    <div key={field.name}>
                                        <label className="admin-label"><field.icon size={10} /> {field.label}</label>
                                        <input
                                            name={field.name}
                                            type="url"
                                            value={getSocial(field.name.split(".")[1] as keyof UserProfile["social"])}
                                            onChange={handleChange}
                                            className="admin-input"
                                            placeholder={field.placeholder}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <button type="submit" disabled={isSaving} className="admin-btn-primary">
                                {isSaving ? (
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                                ) : <Save size={16} />}
                                {isSaving ? "Saving..." : "Save Profile"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
