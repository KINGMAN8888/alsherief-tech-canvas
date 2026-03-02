import { useState } from "react";
import { useApiQuery, useApiUpdate, useApiDelete } from "@/hooks/useApiHooks";
import { Trash2, MailOpen, Clock, MessageSquare, Mail, Phone, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface ContactMessage {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    service: string;
    message: string;
    isRead: boolean;
    createdAt: { seconds: number; nanoseconds: number } | number;
}

const getTimestamp = (ts: ContactMessage["createdAt"]) =>
    typeof ts === "number" ? ts : (ts?.seconds ?? 0) * 1000;

const getInitials = (name: string) =>
    name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();

const AdminMessages = () => {
    const { data: messages, isLoading } = useApiQuery<ContactMessage>("messages");
    const updateMessage = useApiUpdate("messages");
    const deleteMessage = useApiDelete("messages");
    const [selected, setSelected] = useState<ContactMessage | null>(null);

    const handleMarkRead = async (msg: ContactMessage) => {
        if (!msg.isRead && msg.id) {
            try { await updateMessage.mutateAsync({ id: msg.id, data: { isRead: true } }); }
            catch { /* silent */ }
        }
    };

    const handleView = (msg: ContactMessage) => {
        setSelected(msg);
        handleMarkRead(msg);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this message permanently?")) {
            try {
                await deleteMessage.mutateAsync(id);
                toast.success("Message deleted");
                if (selected?.id === id) setSelected(null);
            } catch { toast.error("Failed to delete"); }
        }
    };

    const sorted = [...(messages ?? [])].sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));
    const unread = sorted.filter(m => !m.isRead).length;

    // Avatar color ring
    const avatarColors = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#3b82f6"];
    const getAvatarColor = (name: string) => avatarColors[name.charCodeAt(0) % avatarColors.length];

    if (isLoading) return (
        <div className="flex gap-6 h-[calc(100vh-180px)]">
            <div className="w-80 rounded-2xl animate-pulse" style={{ background: "rgba(8,14,30,0.6)", border: "1px solid rgba(51,65,85,0.4)" }} />
            <div className="flex-1 rounded-2xl animate-pulse" style={{ background: "rgba(8,14,30,0.6)", border: "1px solid rgba(51,65,85,0.4)" }} />
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-[calc(100vh-160px)]">

            {/* Header */}
            <div className="flex items-center justify-between mb-5 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.3)" }}>
                        <MessageSquare size={20} className="text-pink-400" />
                    </div>
                    <div>
                        <h1 className="font-rajdhani text-2xl font-bold text-white">Inbox</h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {unread > 0 ? <span className="text-pink-400 font-semibold">{unread} unread</span> : "All messages read"} · {sorted.length} total
                        </p>
                    </div>
                </div>
                {unread > 0 && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-pink-400 px-3 py-1.5 rounded-full font-rajdhani uppercase" style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.25)" }}>
                        <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse inline-block" />
                        {unread} New
                    </span>
                )}
            </div>

            {/* Three-pane layout */}
            <div className="flex gap-5 flex-1 min-h-0">

                {/* Inbox List */}
                <div className="w-72 xl:w-80 shrink-0 rounded-2xl overflow-hidden flex flex-col" style={{ background: "rgba(8,14,30,0.7)", border: "1px solid rgba(51,65,85,0.5)" }}>
                    <div className="px-4 py-3 shrink-0" style={{ borderBottom: "1px solid rgba(51,65,85,0.4)" }}>
                        <p className="text-xs font-rajdhani font-bold text-slate-500 uppercase tracking-wider">Messages ({sorted.length})</p>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {sorted.length === 0 ? (
                            <div className="p-8 text-center text-slate-600">
                                <MailOpen size={28} className="mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No messages yet</p>
                            </div>
                        ) : sorted.map(msg => {
                            const color = getAvatarColor(msg.name);
                            const date = new Date(getTimestamp(msg.createdAt) || Date.now());
                            const isSelected = selected?.id === msg.id;
                            return (
                                <button
                                    key={msg.id}
                                    onClick={() => handleView(msg)}
                                    className="w-full p-4 text-left transition-all duration-200 flex gap-3"
                                    style={{
                                        borderBottom: "1px solid rgba(51,65,85,0.3)",
                                        background: isSelected ? `${color}10` : "transparent",
                                        borderLeft: isSelected ? `2px solid ${color}` : "2px solid transparent",
                                    }}
                                >
                                    {/* Avatar */}
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 font-rajdhani" style={{ background: `${color}30`, border: `1px solid ${color}40`, color }}>
                                        {getInitials(msg.name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className={`text-sm font-semibold truncate font-rajdhani ${!msg.isRead ? "text-white" : "text-slate-400"}`}>{msg.name}</span>
                                            <span className="text-[10px] text-slate-600 shrink-0 ml-2">{formatDistanceToNow(date, { addSuffix: true })}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {!msg.isRead && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />}
                                            <span className="text-[11px] text-slate-500 truncate">{msg.service}</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Message Detail */}
                <div className="flex-1 min-w-0 rounded-2xl overflow-hidden flex flex-col" style={{ background: "rgba(8,14,30,0.7)", border: "1px solid rgba(51,65,85,0.5)" }}>
                    {selected ? (
                        <div className="flex flex-col h-full">
                            {/* Detail Header */}
                            <div className="px-6 py-5 shrink-0" style={{ borderBottom: "1px solid rgba(51,65,85,0.4)" }}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex gap-4">
                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold font-rajdhani shrink-0" style={{ background: `${getAvatarColor(selected.name)}25`, border: `1px solid ${getAvatarColor(selected.name)}40`, color: getAvatarColor(selected.name) }}>
                                            {getInitials(selected.name)}
                                        </div>
                                        <div>
                                            <h2 className="font-rajdhani text-xl font-bold text-white">{selected.name}</h2>
                                            <div className="flex flex-wrap items-center gap-3 mt-1">
                                                <a href={`mailto:${selected.email}`} className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                                                    <Mail size={12} /> {selected.email}
                                                </a>
                                                {selected.phone && (
                                                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                                        <Phone size={12} /> {selected.phone}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <a href={`mailto:${selected.email}?subject=Re: ${selected.service}`} className="admin-btn-primary" style={{ padding: "0.5rem 0.875rem", fontSize: "0.8125rem" }}>
                                            <Mail size={14} /> Reply
                                        </a>
                                        <button onClick={() => handleDelete(selected.id!)} className="admin-btn-danger">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="px-6 py-3 flex items-center gap-4 shrink-0" style={{ borderBottom: "1px solid rgba(51,65,85,0.3)" }}>
                                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-violet-300 font-rajdhani" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)" }}>
                                    {selected.service}
                                </span>
                                <span className="flex items-center gap-1.5 text-[11px] text-slate-600">
                                    <Clock size={11} />
                                    {new Date(getTimestamp(selected.createdAt) || Date.now()).toLocaleString()}
                                </span>
                                {selected.isRead ? (
                                    <span className="flex items-center gap-1 text-[11px] text-emerald-500">
                                        <RefreshCw size={10} /> Read
                                    </span>
                                ) : (
                                    <span className="text-[11px] text-pink-400 font-bold">● Unread</span>
                                )}
                            </div>

                            {/* Message Body */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="rounded-xl p-5 text-slate-300 leading-relaxed whitespace-pre-wrap text-sm font-cairo" style={{ background: "rgba(4,9,15,0.5)", border: "1px solid rgba(51,65,85,0.4)" }}>
                                    {selected.message}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-700 gap-3">
                            <MailOpen size={48} className="opacity-20" />
                            <p className="font-rajdhani font-bold text-lg">Select a message to read</p>
                            <p className="text-xs text-slate-600">Choose from the inbox on the left</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminMessages;
