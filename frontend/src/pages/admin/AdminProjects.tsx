import { useState } from "react";
import { useApiQuery, useApiAdd, useApiUpdate, useApiDelete } from "@/hooks/useApiHooks";
import { Plus, Edit2, Trash2, ExternalLink, Github, FolderGit2, X, Save, Upload, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { uploadMediaFile } from "@/lib/mediaUpload";

interface Project {
    id?: string;
    slug: string;
    emoji: string;
    tech: string[];
    link?: string;
    github?: string;
    image: string;
    color: string;
}

const emptyProject: Partial<Project> = { slug: "", emoji: "", tech: [], link: "", github: "", image: "", color: "" };

const AdminProjects = () => {
    const { data: projects, isLoading } = useApiQuery<Project>("projects");
    const addProject = useApiAdd("projects");
    const updateProject = useApiUpdate("projects");
    const deleteProject = useApiDelete("projects");

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [current, setCurrent] = useState<Partial<Project>>(emptyProject);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [githubUrl, setGithubUrl] = useState("");
    const [isFetchingGithub, setIsFetchingGithub] = useState(false);

    const openNew = () => { setCurrent(emptyProject); setGithubUrl(""); setDrawerOpen(true); };
    const openEdit = (p: Project) => { setCurrent(p); setGithubUrl(""); setDrawerOpen(true); };
    const closeDrawer = () => { setDrawerOpen(false); setCurrent(emptyProject); setGithubUrl(""); };

    const fetchFromGitHub = async () => {
        const match = githubUrl.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);
        if (!match) { toast.error("Invalid GitHub URL"); return; }
        const [, owner, repo] = match;
        setIsFetchingGithub(true);
        try {
            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
                headers: { Accept: "application/vnd.github+json" },
            });
            if (!res.ok) throw new Error("Not found");
            const data = await res.json();

            const tech: string[] = [];
            if (data.topics && data.topics.length > 0) {
                tech.push(...data.topics);
            } else if (data.language) {
                tech.push(data.language);
            }

            setCurrent(prev => ({
                ...prev,
                slug: data.name,
                github: data.html_url,
                link: data.homepage || "",
                image: `https://opengraph.githubassets.com/1/${owner}/${repo}`,
                tech,
                emoji: prev.emoji || "💻",
                color: prev.color || "from-slate-700 to-slate-900",
            }));
            toast.success("GitHub data fetched! Review and save.");
        } catch {
            toast.error("Failed to fetch. Make sure the repository is public.");
        } finally {
            setIsFetchingGithub(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Delete project "${name}"? This cannot be undone.`)) {
            try { await deleteProject.mutateAsync(id); toast.success("Project deleted"); }
            catch { toast.error("Failed to delete"); }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let tech = current.tech || [];
            if (typeof tech === "string") tech = (tech as string).split(",").map(t => t.trim()).filter(Boolean);
            const data = { ...current, tech };
            if (current.id) { await updateProject.mutateAsync({ id: current.id, data }); toast.success("Project updated"); }
            else { await addProject.mutateAsync(data); toast.success("Project created"); }
            closeDrawer();
        } catch { toast.error("Failed to save project"); }
    };

    const handleImageUpload = async (file?: File) => {
        if (!file) return;
        setIsUploadingImage(true);
        try {
            const uploadedUrl = await uploadMediaFile(file);
            setCurrent((prev) => ({ ...prev, image: uploadedUrl }));
            toast.success("Image uploaded successfully");
        } catch {
            toast.error("Failed to upload image");
        } finally {
            setIsUploadingImage(false);
        }
    };

    if (isLoading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <div key={i} className="h-56 rounded-2xl animate-pulse admin-project-skeleton" />)}
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center admin-icon-cyan-lg">
                        <FolderGit2 size={20} className="text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="font-rajdhani text-2xl font-bold text-white">Projects Manager</h1>
                        <p className="text-xs text-slate-500 mt-0.5">{projects?.length ?? 0} portfolio items</p>
                    </div>
                </div>
                <button onClick={openNew} className="admin-btn-primary">
                    <Plus size={16} /> New Project
                </button>
            </div>

            {/* Grid */}
            {(!projects || projects.length === 0) ? (
                <div className="admin-empty-state">
                    <FolderGit2 size={40} className="opacity-30" />
                    <p className="font-rajdhani font-bold text-lg">No projects yet</p>
                    <p className="text-sm">Click "New Project" to add your first portfolio item</p>
                    <button onClick={openNew} className="admin-btn-primary mt-2"><Plus size={14} /> Add Project</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {projects.map((project) => (
                        <div key={project.id} className="rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] admin-project-card"
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(6,182,212,0.25)"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = ""}
                        >
                            {/* Banner */}
                            <div className={`h-36 w-full relative overflow-hidden bg-gradient-to-br ${project.color || "from-cyan-500 to-blue-600"}`}>
                                <div className="absolute inset-0 bg-black/30" />
                                <img src={project.image} alt={project.slug} className="w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
                                <div className="absolute bottom-3 left-4 text-3xl drop-shadow-lg">{project.emoji}</div>
                                {/* Action buttons on hover */}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button onClick={() => openEdit(project)} title="Edit project" aria-label="Edit project" className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all admin-project-action-edit">
                                        <Edit2 size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(project.id!, project.slug)} title="Delete project" aria-label="Delete project" className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all admin-project-action-delete">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-rajdhani text-lg font-bold text-white mb-2">{project.slug}</h3>
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {project.tech.slice(0, 5).map((t, i) => (
                                        <span key={i} className="text-[10px] font-bold uppercase text-cyan-400 px-2 py-0.5 rounded admin-project-tech-badge">{t}</span>
                                    ))}
                                    {project.tech.length > 5 && <span className="text-[10px] text-slate-500 px-2 py-0.5">+{project.tech.length - 5}</span>}
                                </div>
                                <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-700/40">
                                    <div className="flex gap-2">
                                        {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="admin-btn-icon" title="Live"><ExternalLink size={13} /></a>}
                                        {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="admin-btn-icon" title="GitHub"><Github size={13} /></a>}
                                    </div>
                                    <div className="flex gap-1.5">
                                        <button onClick={() => openEdit(project)} title="Edit project" aria-label="Edit project" className="admin-btn-icon edit"><Edit2 size={13} /></button>
                                        <button onClick={() => handleDelete(project.id!, project.slug)} title="Delete project" aria-label="Delete project" className="admin-btn-icon danger"><Trash2 size={13} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Drawer */}
            {drawerOpen && (
                <>
                    <div className="admin-overlay" onClick={closeDrawer} />
                    <div className="admin-drawer p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-rajdhani text-xl font-bold text-white">{current.id ? "Edit Project" : "New Project"}</h2>
                            <button onClick={closeDrawer} title="Close drawer" aria-label="Close drawer" className="admin-btn-icon"><X size={16} /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            {/* GitHub Auto-fetch */}
                            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                                <p className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5 mb-3">
                                    <Sparkles size={13} /> Auto-fill from GitHub
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={githubUrl}
                                        onChange={e => setGithubUrl(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), fetchFromGitHub())}
                                        className="admin-input flex-1 text-sm"
                                        placeholder="https://github.com/owner/repo"
                                    />
                                    <button
                                        type="button"
                                        onClick={fetchFromGitHub}
                                        disabled={isFetchingGithub || !githubUrl.trim()}
                                        className="admin-btn-primary px-4 shrink-0 disabled:opacity-50"
                                    >
                                        {isFetchingGithub
                                            ? <><Loader2 size={14} className="animate-spin" /> Fetching...</>
                                            : <><Github size={14} /> Fetch</>
                                        }
                                    </button>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-2">Paste a public repo URL to auto-fill slug, tech stack, links, and preview image.</p>
                            </div>

                            <div>
                                <label className="admin-label">Slug (unique ID)</label>
                                <input required type="text" value={current.slug || ""} onChange={e => setCurrent({ ...current, slug: e.target.value })} className="admin-input" placeholder="e.g. my-cool-project" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="admin-label">Emoji Icon</label>
                                    <input required type="text" value={current.emoji || ""} onChange={e => setCurrent({ ...current, emoji: e.target.value })} className="admin-input" placeholder="💻" />
                                </div>
                                <div>
                                    <label className="admin-label">Gradient Color</label>
                                    <input required type="text" value={current.color || ""} onChange={e => setCurrent({ ...current, color: e.target.value })} className="admin-input" placeholder="from-cyan-500 to-blue-600" />
                                </div>
                            </div>
                            <div>
                                <label className="admin-label">Tech Stack (comma separated)</label>
                                <input required type="text" value={typeof current.tech === "object" ? current.tech?.join(", ") : current.tech || ""} onChange={e => setCurrent({ ...current, tech: e.target.value as unknown as string[] })} className="admin-input" placeholder="React, Node.js, PostgreSQL" />
                            </div>
                            <div>
                                <label className="admin-label">Image URL</label>
                                <input required type="text" value={current.image || ""} onChange={e => setCurrent({ ...current, image: e.target.value })} className="admin-input" placeholder="https://... or uploaded file URL" />
                                <div className="mt-2 flex items-center gap-2">
                                    <label className="admin-btn-ghost cursor-pointer">
                                        <Upload size={14} /> {isUploadingImage ? "Uploading..." : "Upload from device"}
                                        <input
                                            type="file"
                                            accept="image/*,video/*,audio/*,.pdf"
                                            className="hidden"
                                            disabled={isUploadingImage}
                                            onChange={(e) => handleImageUpload(e.target.files?.[0])}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="admin-label">Live Link (optional)</label>
                                    <input type="text" value={current.link || ""} onChange={e => setCurrent({ ...current, link: e.target.value })} className="admin-input" placeholder="https://..." />
                                </div>
                                <div>
                                    <label className="admin-label">GitHub Link (optional)</label>
                                    <input type="text" value={current.github || ""} onChange={e => setCurrent({ ...current, github: e.target.value })} className="admin-input" placeholder="https://github.com/..." />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-slate-700/40">
                                <button type="button" onClick={closeDrawer} className="admin-btn-ghost flex-1">Cancel</button>
                                <button type="submit" disabled={addProject.isPending || updateProject.isPending} className="admin-btn-primary flex-1 justify-center">
                                    <Save size={15} /> {current.id ? "Save Changes" : "Create Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminProjects;
