import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin = () => {
    const { locale } = useParams<{ locale: string }>();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data.token, data.user);
            toast.success("Welcome back to the Control Center!");
            navigate(`/${locale}/admin`);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.error || "An error occurred during authentication.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030a16] flex items-center justify-center p-4 selection:bg-cyan-500/30">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.07)_0%,transparent_50%)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-violet-600/5 blur-[120px]" />
            <div className="absolute inset-0 circuit-grid opacity-30" />

            <div className="relative z-10 w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-md shadow-2xl mb-6 relative group">
                        <div className="absolute inset-0 rounded-2xl blur-xl bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors duration-500" />
                        <ShieldCheck className="h-8 w-8 text-cyan-400 relative z-10" />
                    </div>
                    <h1 className="font-rajdhani text-3xl md:text-4xl font-bold text-white mb-2">
                        System <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">Access</span>
                    </h1>
                    <p className="font-cairo text-sm text-slate-400 uppercase tracking-widest">
                        Authorization Required
                    </p>
                </div>

                {/* Login Form Card */}
                <div className="card-glass-panel p-8 relative overflow-hidden">
                    {/* Top border glow */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent" />

                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-400 pl-1 block">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-white font-cairo text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-sans"
                                    placeholder="admin@youssefalsherief.tech"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-rajdhani uppercase tracking-wider text-slate-400 pl-1 flex justify-between">
                                <span>Password / Passkey</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-sans"
                                    placeholder="••••••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-rajdhani font-bold uppercase tracking-wider text-sm py-3.5 px-4 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Authenticate <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    {/* Footer inside card */}
                    <div className="mt-8 text-center border-t border-slate-800/60 pt-4">
                        <Link to={`/${locale}`} className="text-xs font-cairo text-slate-500 hover:text-cyan-400 transition-colors">
                            Return to Public Site
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
