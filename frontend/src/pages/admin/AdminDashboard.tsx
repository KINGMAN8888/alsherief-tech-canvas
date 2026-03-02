import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useApiQuery } from "@/hooks/useApiHooks";
import {
    FolderGit2, MessageSquare, Medal, Cpu,
    User, ShieldCheck, ArrowUpRight, Zap,
    TrendingUp, Bell, ChevronRight, Info, Shield
} from "lucide-react";

const AdminDashboard = () => {
    const { locale } = useParams<{ locale: string }>();
    const { data: projects } = useApiQuery<{ id: string }>("projects");
    const { data: skills } = useApiQuery<{ id: string }>("skills");
    const { data: certs } = useApiQuery<{ id: string }>("certifications");
    const { data: messages } = useApiQuery<{ id: string; isRead: boolean }>("messages");
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const unread = messages?.filter(m => !m.isRead).length ?? 0;

    const stats = [
        {
            label: "Total Projects",
            value: projects?.length ?? "—",
            icon: FolderGit2,
            iconClass: "text-cyan-400",
            cardClass: "stat-icon-cyan",
            link: `/${locale}/admin/projects`,
            sub: "Portfolio items",
        },
        {
            label: "Skill Groups",
            value: skills?.length ?? "—",
            icon: Cpu,
            iconClass: "text-emerald-400",
            cardClass: "stat-icon-green",
            link: `/${locale}/admin/skills`,
            sub: "Technology areas",
        },
        {
            label: "Certifications",
            value: certs?.length ?? "—",
            icon: Medal,
            iconClass: "text-amber-400",
            cardClass: "stat-icon-amber",
            link: `/${locale}/admin/certifications`,
            sub: "Issued badges",
        },
        {
            label: "Unread Messages",
            value: unread,
            icon: MessageSquare,
            iconClass: "text-pink-400",
            cardClass: "stat-icon-pink",
            link: `/${locale}/admin/messages`,
            sub: unread > 0 ? "Needs attention" : "All caught up",
            alert: unread > 0,
        },
    ];

    const quickActions = [
        { label: "Manage Projects", desc: "Add or edit portfolio items", icon: FolderGit2, iconClass: "text-cyan-400", iconBgClass: "qa-icon-cyan", color: "#06b6d4", link: `/${locale}/admin/projects` },
        { label: "Update Profile", desc: "Edit bio and social links", icon: User, iconClass: "text-violet-400", iconBgClass: "qa-icon-violet", color: "#8b5cf6", link: `/${locale}/admin/profile` },
        { label: "Add Skills", desc: "Update tech skill groups", icon: Cpu, iconClass: "text-emerald-400", iconBgClass: "qa-icon-green", color: "#10b981", link: `/${locale}/admin/skills` },
        { label: "Update About & Services", desc: "Edit bio and service cards", icon: Info, iconClass: "text-purple-400", iconBgClass: "qa-icon-purple", color: "#a855f7", link: `/${locale}/admin/about` },
        { label: "Certificates", desc: "Add new certifications", icon: Medal, iconClass: "text-amber-400", iconBgClass: "qa-icon-amber", color: "#f59e0b", link: `/${locale}/admin/certifications` },
        { label: "Read Messages", desc: `${unread} unread waiting`, icon: MessageSquare, iconClass: "text-pink-400", iconBgClass: "qa-icon-pink", color: "#ec4899", link: `/${locale}/admin/messages` },
        { label: "Account Security", desc: "Change email or password", icon: Shield, iconClass: "text-cyan-400", iconBgClass: "qa-icon-cyan", color: "#06b6d4", link: `/${locale}/admin/account` },
        { label: "System Status", desc: "All systems operational", icon: ShieldCheck, iconClass: "text-emerald-400", iconBgClass: "qa-icon-emerald", color: "#34d399", link: "#", disabled: true },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Greeting Bar */}
            <div className="rounded-2xl p-6 admin-card-greeting">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Zap size={16} className="text-cyan-400" />
                            <span className="text-xs text-cyan-400 font-rajdhani font-bold uppercase tracking-widest">Command Center</span>
                        </div>
                        <h1 className="font-rajdhani text-2xl md:text-3xl font-bold text-white">
                            Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">Yousef</span> 👋
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">Here's your portfolio control panel. Everything you need, in one place.</p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                        <span className="font-rajdhani text-2xl font-bold text-white tabular-nums">
                            {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </span>
                        <span className="text-xs text-slate-500">
                            {time.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </span>
                    </div>
                </div>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Link key={i} to={stat.link} className="admin-stat-card p-5 block group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.cardClass}`}>
                                <stat.icon size={20} className={stat.iconClass} />
                            </div>
                            {stat.alert && (
                                <span className="flex items-center gap-1 text-[10px] font-rajdhani font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                                    <Bell size={10} /> NEW
                                </span>
                            )}
                            {!stat.alert && (
                                <TrendingUp size={14} className="text-slate-700 group-hover:text-slate-500 transition-colors" />
                            )}
                        </div>
                        <p className="text-xs text-slate-500 font-rajdhani uppercase tracking-wider mb-1">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <span className="font-rajdhani text-3xl font-bold text-white">{stat.value}</span>
                            <span className="text-[11px] text-slate-600 font-rajdhani">{stat.sub}</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Zap size={16} className="text-cyan-400" />
                    <h2 className="font-rajdhani text-lg font-bold text-white">Quick Actions</h2>
                    <div className="flex-1 h-px ml-2 admin-separator-line" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickActions.map((action, i) => (
                        <Link
                            key={i}
                            to={action.link}
                            className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 admin-quickaction-card ${action.disabled ? "pointer-events-none opacity-50" : ""}`}
                            onMouseEnter={e => { if (!action.disabled) { (e.currentTarget as HTMLElement).style.borderColor = action.color + "40"; (e.currentTarget as HTMLElement).style.background = action.color + "08"; } }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = ""; (e.currentTarget as HTMLElement).style.background = ""; }}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${action.iconBgClass}`}>
                                <action.icon size={18} className={action.iconClass} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-rajdhani font-bold text-white text-sm group-hover:text-white">{action.label}</p>
                                <p className="text-[11px] text-slate-500 mt-0.5 truncate">{action.desc}</p>
                            </div>
                            {!action.disabled && <ChevronRight size={16} className="text-slate-700 group-hover:text-slate-400 shrink-0 transition-colors" />}
                        </Link>
                    ))}
                </div>
            </div>

            {/* System Status */}
            <div className="rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 admin-card-emerald-tint-light">
                <div className="flex items-center gap-3">
                    <div className="admin-status-dot" />
                    <div>
                        <p className="text-sm font-rajdhani font-bold text-emerald-400">All Systems Operational</p>
                        <p className="text-xs text-slate-500 mt-0.5">Database connected · API healthy · No active alerts</p>
                    </div>
                </div>
                <span className="admin-badge-success shrink-0">
                    <ShieldCheck size={12} />
                    Secure
                </span>
            </div>

        </div>
    );
};

export default AdminDashboard;
