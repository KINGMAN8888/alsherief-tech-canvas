import { forwardRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Mail, Lock, Eye, EyeOff, Shield, ShieldCheck,
    CheckCircle2, AlertCircle, KeyRound, RefreshCw, Zap,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

// ── Zod schemas (client-side) ─────────────────────────────────────────────────

const emailSchema = z.object({
    newEmail: z.string().min(1, "New email is required").email("Invalid email format"),
    confirmEmail: z.string().min(1, "Please confirm your new email"),
}).refine((d) => d.newEmail === d.confirmEmail, {
    message: "Emails don't match",
    path: ["confirmEmail"],
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(8, "Must be at least 8 characters")
        .regex(/[A-Z]/, "Must include an uppercase letter")
        .regex(/[0-9]/, "Must include a number"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type EmailForm    = z.infer<typeof emailSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

// ── Password strength ───────────────────────────────────────────────────────

const getStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8)  score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;
    return score; // 0-5
};

const strengthLabel    = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
const strengthBarClass = ["", "bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-green-400", "bg-cyan-400"];
const strengthTextClass= ["", "text-red-400", "text-orange-400", "text-yellow-400", "text-green-400", "text-cyan-400"];

// ── Reusable Field component ──────────────────────────────────────────────────

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
    icon: React.ElementType;
    reveal?: boolean;
    onToggle?: () => void;
};

const Field = forwardRef<HTMLInputElement, FieldProps>(({
    label, error, icon: Icon, type = "text", placeholder, reveal, onToggle, ...props
}, ref) => (
    <div className="space-y-1.5">
        <label className="text-xs font-rajdhani font-semibold text-slate-400 uppercase tracking-wider">
            {label}
        </label>
        <div className="relative">
            <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
            <input
                ref={ref}
                type={reveal !== undefined ? (reveal ? "text" : "password") : type}
                placeholder={placeholder}
                className={`w-full bg-slate-900/60 border rounded-xl pl-10 ${onToggle ? 'pr-10' : 'pr-4'} py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
                    error
                        ? "border-red-500/50 focus:ring-red-500/30"
                        : "border-slate-700/60 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                }`}
                {...props}
            />
            {onToggle && (
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                >
                    {reveal ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
            )}
        </div>
        {error && (
            <p className="flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle size={11} /> {error}
            </p>
        )}
    </div>
));

Field.displayName = "Field";

// ── Main Page ─────────────────────────────────────────────────────────────────

const AdminAccount = () => {
    const { locale } = useParams<{ locale: string }>();
    const navigate   = useNavigate();
    const { user, login, logout } = useAuth();

    // reveal toggles
    const [revealCurPw,   setRevealCurPw]   = useState(false);
    const [revealNewPw,   setRevealNewPw]   = useState(false);
    const [revealConPw,   setRevealConPw]   = useState(false);

    // email form
    const emailForm = useForm<EmailForm>({ resolver: zodResolver(emailSchema), mode: 'onTouched' });
    const passwordForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema), mode: 'onTouched' });

    const newPasswordValue = passwordForm.watch("newPassword", "");
    const strength = getStrength(newPasswordValue);

    // ── Submit: change email ─────────────────────────────────────────────────
    const onEmailSubmit = async (data: EmailForm) => {
        try {
            const res = await api.put("/auth/account/email", data);
            const updatedUser = res.data.user;

            // Refresh AuthContext with same token but new email
            const token = localStorage.getItem("token") ?? "";
            login(token, updatedUser);

            toast.success("Email updated successfully!", {
                description: `Your login email is now: ${updatedUser.email}`,
            });
            emailForm.reset();
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
                (err as { response?: { data?: { details?: Array<{ message: string }> } } })?.response?.data?.details?.[0]?.message ??
                "Failed to update email";
            toast.error(msg);
        }
    };

    // ── Submit: change password ──────────────────────────────────────────────
    const onPasswordSubmit = async (data: PasswordForm) => {
        try {
            await api.put("/auth/account/password", data);
            toast.success("Password changed successfully!", {
                description: "You'll be redirected to login with your new password.",
            });
            passwordForm.reset();
            setTimeout(() => {
                logout();
                navigate(`/${locale}/admin/login`);
            }, 2000);
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
                (err as { response?: { data?: { details?: Array<{ message: string }> } } })?.response?.data?.details?.[0]?.message ??
                "Failed to update password";
            toast.error(msg);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">

            {/* ── Page Header ─────────────────────────────────────────────── */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center admin-icon-cyan">
                    <Shield size={20} className="text-cyan-400" />
                </div>
                <div>
                    <h1 className="font-rajdhani text-2xl font-bold text-white">Account Security</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Manage your login credentials</p>
                </div>
            </div>

            {/* ── Current Account Info ────────────────────────────────────── */}
            <div className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 admin-card-cyan-tint">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-rajdhani font-bold text-xl text-white shrink-0 admin-avatar-gradient">
                    {user?.name?.charAt(0)?.toUpperCase() ?? "A"}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-rajdhani font-bold text-white text-lg leading-tight">{user?.name ?? "Admin"}</p>
                    <p className="text-sm text-slate-400 mt-0.5 truncate">{user?.email}</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-rajdhani font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full shrink-0">
                    <ShieldCheck size={13} />
                    {user?.role ?? "admin"}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ── Change Email ─────────────────────────────────────────── */}
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                    autoComplete="off"
                    className="rounded-2xl p-6 space-y-5 admin-card-glass">

                    {/* Section header */}
                    <div className="flex items-center gap-3 pb-4 admin-divider">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center admin-icon-cyan-sm">
                            <Mail size={16} className="text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="font-rajdhani font-bold text-white">Change Email</h2>
                            <p className="text-[11px] text-slate-500">Current: {user?.email}</p>
                        </div>
                    </div>

                    <Field
                        label="New Email"
                        icon={Mail}
                        type="email"
                        placeholder="new@example.com"
                        autoComplete="email"
                        error={emailForm.formState.errors.newEmail?.message}
                        {...emailForm.register("newEmail")}
                    />

                    <Field
                        label="Confirm New Email"
                        icon={Mail}
                        type="email"
                        placeholder="Repeat new email"
                        autoComplete="email"
                        error={emailForm.formState.errors.confirmEmail?.message}
                        {...emailForm.register("confirmEmail")}
                    />

                    <button
                        type="submit"
                        disabled={emailForm.formState.isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-rajdhani font-bold text-sm text-white transition-all duration-200 disabled:opacity-50 admin-btn-grad-cyan"
                    >
                        {emailForm.formState.isSubmitting ? (
                            <><RefreshCw size={14} className="animate-spin" /> Updating...</>
                        ) : (
                            <><CheckCircle2 size={14} /> Update Email</>
                        )}
                    </button>
                </form>

                {/* ── Change Password ───────────────────────────────────────── */}
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    autoComplete="off"
                    className="rounded-2xl p-6 space-y-5 admin-card-glass">

                    {/* Section header */}
                    <div className="flex items-center gap-3 pb-4 admin-divider">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center admin-icon-violet">
                            <KeyRound size={16} className="text-violet-400" />
                        </div>
                        <div>
                            <h2 className="font-rajdhani font-bold text-white">Change Password</h2>
                            <p className="text-[11px] text-slate-500">You'll be logged out after changing</p>
                        </div>
                    </div>

                    <Field
                        label="Current Password"
                        icon={Lock}
                        placeholder="Enter your current password"
                        reveal={revealCurPw}
                        onToggle={() => setRevealCurPw(p => !p)}
                        autoComplete="current-password"
                        error={passwordForm.formState.errors.currentPassword?.message}
                        {...passwordForm.register("currentPassword")}
                    />

                    <div className="space-y-1.5">
                        <Field
                            label="New Password"
                            icon={Lock}
                            placeholder="Min 8 chars, 1 uppercase, 1 number"
                            reveal={revealNewPw}
                            onToggle={() => setRevealNewPw(p => !p)}
                            autoComplete="new-password"
                            error={passwordForm.formState.errors.newPassword?.message}
                            {...passwordForm.register("newPassword")}
                        />
                        {/* Strength bar */}
                        {newPasswordValue.length > 0 && (
                            <div className="space-y-1 pt-1">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= strength ? strengthBarClass[strength] : "bg-slate-700/50"}`} />
                                    ))}
                                </div>
                                <p className={`text-[11px] font-rajdhani font-semibold ${strengthTextClass[strength]}`}>
                                    {strengthLabel[strength]}
                                </p>
                            </div>
                        )}
                    </div>

                    <Field
                        label="Confirm New Password"
                        icon={Lock}
                        placeholder="Repeat new password"
                        reveal={revealConPw}
                        onToggle={() => setRevealConPw(p => !p)}
                        autoComplete="new-password"
                        error={passwordForm.formState.errors.confirmPassword?.message}
                        {...passwordForm.register("confirmPassword")}
                    />

                    <button
                        type="submit"
                        disabled={passwordForm.formState.isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-rajdhani font-bold text-sm text-white transition-all duration-200 disabled:opacity-50 admin-btn-grad-violet"
                    >
                        {passwordForm.formState.isSubmitting ? (
                            <><RefreshCw size={14} className="animate-spin" /> Updating...</>
                        ) : (
                            <><CheckCircle2 size={14} /> Change Password</>
                        )}
                    </button>
                </form>
            </div>

            {/* ── Security Tips ─────────────────────────────────────────────── */}
            <div className="rounded-xl p-5 admin-card-emerald-tint">
                <div className="flex items-center gap-2 mb-3">
                    <Zap size={14} className="text-emerald-400" />
                    <span className="font-rajdhani font-bold text-emerald-400 text-sm uppercase tracking-wider">Security Tips</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                        "Use a unique password not used elsewhere",
                        "Mix uppercase, numbers and symbols",
                        "Avoid personal info in your password",
                        "Keep your account email always accessible",
                    ].map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                            <CheckCircle2 size={12} className="text-emerald-500/60 mt-0.5 shrink-0" />
                            {tip}
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
};

export default AdminAccount;
