import { useState } from "react";
import { useApiQuery, useApiAdd, useApiUpdate, useApiDelete } from "@/hooks/useApiHooks";
import { Plus, Edit2, Trash2, Cpu, X, Save } from "lucide-react";
import { toast } from "sonner";

interface SkillGroup {
    id?: string;
    category: string;
    sub: string;
    items: string[];
}

const categoryColors = [
    { bg: "rgba(6,182,212,0.1)", border: "rgba(6,182,212,0.3)", text: "#22d3ee", bar: "#06b6d4" },
    { bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.3)", text: "#a78bfa", bar: "#8b5cf6" },
    { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", text: "#34d399", bar: "#10b981" },
    { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", text: "#fbbf24", bar: "#f59e0b" },
    { bg: "rgba(236,72,153,0.1)", border: "rgba(236,72,153,0.3)", text: "#f472b6", bar: "#ec4899" },
    { bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.3)", text: "#60a5fa", bar: "#3b82f6" },
];

const AdminSkills = () => {
    const { data: skills, isLoading } = useApiQuery<SkillGroup>("skills");
    const addSkill = useApiAdd("skills");
    const updateSkill = useApiUpdate("skills");
    const deleteSkill = useApiDelete("skills");

    const [modalOpen, setModalOpen] = useState(false);
    const [current, setCurrent] = useState<Partial<SkillGroup>>({});

    const openNew = () => { setCurrent({}); setModalOpen(true); };
    const openEdit = (s: SkillGroup) => { setCurrent(s); setModalOpen(true); };
    const closeModal = () => { setModalOpen(false); setCurrent({}); };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Delete skill group "${name}"?`)) {
            try { await deleteSkill.mutateAsync(id); toast.success("Skill group deleted"); }
            catch { toast.error("Failed to delete"); }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let items = current.items || [];
            if (typeof items === "string") items = (items as string).split(",").map(t => t.trim()).filter(Boolean);
            const data = { ...current, items };
            if (current.id) { await updateSkill.mutateAsync({ id: current.id, data }); toast.success("Skill group updated"); }
            else { await addSkill.mutateAsync(data); toast.success("Skill group created"); }
            closeModal();
        } catch { toast.error("Failed to save"); }
    };

    const maxItems = Math.max(...(skills?.map(s => s.items.length) ?? [1]), 1);

    if (isLoading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: "rgba(8,14,30,0.6)", border: "1px solid rgba(51,65,85,0.4)" }} />)}
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
                        <Cpu size={20} className="text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="font-rajdhani text-2xl font-bold text-white">Skills Manager</h1>
                        <p className="text-xs text-slate-500 mt-0.5">{skills?.length ?? 0} skill categories</p>
                    </div>
                </div>
                <button onClick={openNew} className="admin-btn-primary">
                    <Plus size={16} /> New Skill Group
                </button>
            </div>

            {/* Grid */}
            {(!skills || skills.length === 0) ? (
                <div className="admin-empty-state">
                    <Cpu size={40} className="opacity-30" />
                    <p className="font-rajdhani font-bold text-lg">No skills yet</p>
                    <button onClick={openNew} className="admin-btn-primary mt-2"><Plus size={14} /> Add Group</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {skills.map((skill, idx) => {
                        const theme = categoryColors[idx % categoryColors.length];
                        return (
                            <div key={skill.id} className="rounded-2xl p-5 flex flex-col transition-all duration-300 hover:-translate-y-1" style={{ background: "rgba(8,14,30,0.7)", border: `1px solid ${theme.border}`, borderLeft: `3px solid ${theme.bar}` }}>
                                <div className="flex items-start justify-between mb-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest font-rajdhani" style={{ color: theme.text }}>{skill.sub}</span>
                                    <div className="flex gap-1.5">
                                        <button onClick={() => openEdit(skill)} className="admin-btn-icon edit"><Edit2 size={13} /></button>
                                        <button onClick={() => handleDelete(skill.id!, skill.category)} className="admin-btn-icon danger"><Trash2 size={13} /></button>
                                    </div>
                                </div>
                                <h3 className="font-rajdhani text-lg font-bold text-white mb-3">{skill.category}</h3>
                                {/* Progress bar */}
                                <div className="mb-3">
                                    <div className="flex justify-between text-[10px] text-slate-600 mb-1">
                                        <span>Skills</span>
                                        <span className="font-rajdhani font-bold" style={{ color: theme.text }}>{skill.items.length}</span>
                                    </div>
                                    <div className="h-1 rounded-full" style={{ background: "rgba(51,65,85,0.4)" }}>
                                        <div className="h-1 rounded-full transition-all duration-500" style={{ width: `${(skill.items.length / maxItems) * 100}%`, background: theme.bar }} />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5 flex-1">
                                    {skill.items.map((item, i) => (
                                        <span key={i} className="text-[11px] px-2 py-0.5 rounded text-slate-300" style={{ background: theme.bg, border: `1px solid ${theme.border}` }}>{item}</span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <>
                    <div className="admin-overlay" onClick={closeModal} />
                    <div className="admin-modal p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-rajdhani text-xl font-bold text-white">{current.id ? "Edit Skill Group" : "New Skill Group"}</h2>
                            <button onClick={closeModal} className="admin-btn-icon"><X size={16} /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="admin-label">Category Name</label>
                                    <input required type="text" value={current.category || ""} onChange={e => setCurrent({ ...current, category: e.target.value })} className="admin-input" placeholder="Frontend Development" />
                                </div>
                                <div>
                                    <label className="admin-label">Subtitle</label>
                                    <input required type="text" value={current.sub || ""} onChange={e => setCurrent({ ...current, sub: e.target.value })} className="admin-input" placeholder="UI/UX" />
                                </div>
                            </div>
                            <div>
                                <label className="admin-label">Skills List (comma separated)</label>
                                <input required type="text" value={typeof current.items === "object" ? current.items?.join(", ") : current.items || ""} onChange={e => setCurrent({ ...current, items: e.target.value as any })} className="admin-input" placeholder="React, Vue, Tailwind CSS" />
                            </div>
                            <div className="flex gap-3 pt-4" style={{ borderTop: "1px solid rgba(51,65,85,0.4)" }}>
                                <button type="button" onClick={closeModal} className="admin-btn-ghost flex-1">Cancel</button>
                                <button type="submit" disabled={addSkill.isPending || updateSkill.isPending} className="admin-btn-primary flex-1 justify-center">
                                    <Save size={15} /> {current.id ? "Save Changes" : "Create Group"}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminSkills;
