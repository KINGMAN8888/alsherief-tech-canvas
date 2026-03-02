import { useState } from "react";
import { Link, useNavigate, useParams, Outlet, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    FolderGit2,
    GraduationCap,
    MessageSquare,
    LogOut,
    Menu,
    X,
    User,
    Medal,
    ChevronRight,
    ExternalLink,
    Cpu,
    Zap,
    BookOpen,
    Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import GlobalMediaUploader from "@/components/admin/GlobalMediaUploader";

const AdminLayout = () => {
    const { locale } = useParams<{ locale: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try {
            logout();
            toast.success("Signed out safely.");
            navigate(`/${locale}/admin/login`);
        } catch {
            toast.error("Error signing out.");
        }
    };

    const menuItems = [
        { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: `/${locale}/admin`, color: "text-cyan-400", exact: true },
        { id: "profile", icon: User, label: "Profile", path: `/${locale}/admin/profile`, color: "text-violet-400" },
        { id: "projects", icon: FolderGit2, label: "Projects", path: `/${locale}/admin/projects`, color: "text-blue-400" },
        { id: "skills", icon: Cpu, label: "Skills", path: `/${locale}/admin/skills`, color: "text-emerald-400" },
        { id: "certs", icon: Medal, label: "Certifications", path: `/${locale}/admin/certifications`, color: "text-amber-400" },
        { id: "about", icon: User, label: "About & Services", path: `/${locale}/admin/about`, color: "text-indigo-400" },
        { id: "messages", icon: MessageSquare, label: "Messages", path: `/${locale}/admin/messages`, color: "text-pink-400" },
        { id: "blog", icon: BookOpen, label: "Blog", path: `/${locale}/admin/blog`, color: "text-orange-400" },
        { id: "account", icon: Shield, label: "Account", path: `/${locale}/admin/account`, color: "text-cyan-400" },
    ];

    const isActive = (item: typeof menuItems[0]) => {
        if (item.exact) return location.pathname === item.path || location.pathname === item.path + "/";
        return location.pathname.startsWith(item.path);
    };

    const currentPage = menuItems.find(item => isActive(item));

    return (
        <div className="min-h-screen font-cairo selection:bg-cyan-500/30 admin-page-bg">

            {/* Mobile Top Bar */}
            <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-slate-800/60 sticky top-0 z-50 admin-topbar-mobile">
                <div className="flex items-center gap-2">
                    <Zap size={18} className="text-cyan-400" />
                    <span className="font-rajdhani text-lg font-bold text-white">Command Center</span>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-white transition-colors">
                    {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            <div className="flex h-screen lg:h-auto lg:min-h-screen">

                {/* ═══════ SIDEBAR ═══════ */}
                <aside
                    className={`
                        fixed lg:sticky top-0 left-0 z-40 h-screen flex flex-col admin-sidebar-bg
                        transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                    `}
                >
                    {/* Logo */}
                    <div className="px-6 pt-6 pb-4 hidden lg:block">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center admin-logo-icon-bg">
                                <Zap size={18} className="text-cyan-400" />
                            </div>
                            <div>
                                <h1 className="font-rajdhani text-lg font-bold text-white leading-none">Command Center</h1>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Admin v2.0</p>
                            </div>
                        </div>
                    </div>

                    {/* Admin Avatar Card */}
                    <div className="mx-4 mb-5 p-3 rounded-xl admin-avatar-card">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-rajdhani font-bold text-sm text-white shrink-0 admin-avatar-gradient">
                                A
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">Yousef Alsherief</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="admin-status-dot" />
                                    <span className="text-[10px] text-emerald-400 font-rajdhani font-bold uppercase tracking-wider">Online</span>
                                </div>
                            </div>
                            <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-rajdhani font-bold uppercase">Admin</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-rajdhani px-3 mb-3">Navigation</p>
                        {menuItems.map((item) => {
                            const active = isActive(item);
                            return (
                                <Link
                                    key={item.id}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${active ? "admin-nav-active" : "admin-nav-item text-slate-400"}`}
                                >
                                    {/* Icon */}
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${active ? "bg-cyan-500/20" : "bg-white/4 group-hover:bg-white/8"}`}>
                                        <item.icon size={16} strokeWidth={active ? 2.5 : 2} className={active ? "text-cyan-400" : `${item.color} opacity-60 group-hover:opacity-100`} />
                                    </div>
                                    <span className={`text-sm font-semibold font-rajdhani ${active ? "text-cyan-300" : "text-slate-400 group-hover:text-slate-200"}`}>{item.label}</span>
                                    {active && <ChevronRight size={14} className="ml-auto text-cyan-500/60" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom area */}
                    <div className="p-3 mt-auto admin-sidebar-footer">
                        <GlobalMediaUploader />

                        {/* View Portfolio */}
                        <Link
                            to={`/${locale}`}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-slate-500 hover:text-slate-300 transition-colors text-sm mb-1 hover:bg-white/4"
                        >
                            <ExternalLink size={15} />
                            <span className="font-semibold font-rajdhani">View Portfolio</span>
                        </Link>

                        {/* Sign Out */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-red-400/80 hover:text-red-300 hover:bg-red-500/8 transition-all text-sm border border-transparent hover:border-red-500/20"
                        >
                            <LogOut size={15} />
                            <span className="font-semibold font-rajdhani">Sign Out</span>
                        </button>
                    </div>
                </aside>

                {/* Overlay */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
                )}

                {/* ═══════ MAIN CONTENT ═══════ */}
                <main className="flex-1 min-w-0 flex flex-col min-h-screen overflow-x-hidden">

                    {/* Top Header Bar */}
                    <header className="hidden lg:flex items-center justify-between px-8 py-4 shrink-0 admin-header-bar">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-slate-600 font-rajdhani">Admin</span>
                            <ChevronRight size={14} className="text-slate-700" />
                            <span className="font-rajdhani font-semibold text-white">{currentPage?.label || "Dashboard"}</span>
                        </div>

                        {/* Right side indicators */}
                        <div className="flex items-center gap-3">
                            <span className="admin-badge-success text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                                System Online
                            </span>
                            <div className="w-px h-5 bg-slate-800" />
                            <span className="text-xs text-slate-500 font-rajdhani">
                                {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                            </span>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="flex-1 p-4 md:p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
