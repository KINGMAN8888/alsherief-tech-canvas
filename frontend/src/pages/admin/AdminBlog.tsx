import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useApiAdd, useApiDelete } from "@/hooks/useApiHooks";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import {
    Plus, Edit2, Trash2, BookOpen, X, Save, Eye, EyeOff,
    Calendar, Clock, Tag, ChevronRight, Globe, Upload
} from "lucide-react";
import { toast } from "sonner";
import { uploadMediaFile } from "@/lib/mediaUpload";

interface BlogPost {
    id?: string;
    title: string;
    titleAr?: string;
    slug: string;
    excerpt?: string;
    excerptAr?: string;
    content: string;
    contentAr?: string;
    imageUrl?: string;
    category: string;
    readingTime: string;
    color: string;
    published: boolean;
    authorId?: string;
    createdAt?: string;
}

const emptyPost: Partial<BlogPost> = {
    title: "", titleAr: "", slug: "", excerpt: "", excerptAr: "",
    content: "", contentAr: "", imageUrl: "",
    category: "General", readingTime: "5 min read",
    color: "from-cyan-500 to-blue-500", published: false,
};

const COLOR_PRESETS = [
    { label: "Cyan → Blue", value: "from-cyan-500 to-blue-500" },
    { label: "Violet → Purple", value: "from-violet-500 to-purple-500" },
    { label: "Emerald → Teal", value: "from-emerald-500 to-teal-500" },
    { label: "Rose → Pink", value: "from-rose-500 to-pink-500" },
    { label: "Orange → Amber", value: "from-orange-500 to-amber-500" },
    { label: "Sky → Indigo", value: "from-sky-500 to-indigo-500" },
];

// Custom hook - fetches ALL posts (admin endpoint)
const useBlogAdmin = () => {
    return useQuery<BlogPost[]>({
        queryKey: ["blog-admin"],
        queryFn: async () => {
            const res = await api.get("/portfolio/blog/admin");
            return res.data;
        },
    });
};

const useUpdateBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<BlogPost> }) => {
            const res = await api.put(`/portfolio/blog/${id}`, data);
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blog-admin"] }),
    });
};

const AdminBlog = () => {
    const { locale } = useParams<{ locale: string }>();
    const { data: posts, isLoading } = useBlogAdmin();
    const addPost = useApiAdd<BlogPost>("blog");
    const updatePost = useUpdateBlog();
    const deletePost = useApiDelete("blog");
    const queryClient = useQueryClient();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [current, setCurrent] = useState<Partial<BlogPost>>(emptyPost);
    const [lang, setLang] = useState<"en" | "ar">("en");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const openNew = () => { setCurrent(emptyPost); setLang("en"); setDrawerOpen(true); };
    const openEdit = (p: BlogPost) => { setCurrent(p); setLang("en"); setDrawerOpen(true); };
    const closeDrawer = () => { setDrawerOpen(false); setCurrent(emptyPost); };

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`Delete "${title}"? This cannot be undone.`)) {
            try { await deletePost.mutateAsync(id); queryClient.invalidateQueries({ queryKey: ["blog-admin"] }); toast.success("Post deleted"); }
            catch { toast.error("Failed to delete"); }
        }
    };

    const togglePublish = async (post: BlogPost) => {
        try {
            await updatePost.mutateAsync({ id: post.id!, data: { published: !post.published } });
            toast.success(post.published ? "Post unpublished" : "Post published!");
        } catch { toast.error("Failed to update status"); }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (current.id) {
                await updatePost.mutateAsync({ id: current.id, data: current });
                toast.success("Post updated");
            } else {
                await addPost.mutateAsync(current);
                queryClient.invalidateQueries({ queryKey: ["blog-admin"] });
                toast.success("Post created");
            }
            closeDrawer();
        } catch (err: any) {
            toast.error(err?.response?.data?.error ?? "Failed to save post");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCoverUpload = async (file?: File) => {
        if (!file) return;
        setIsUploadingImage(true);
        try {
            const uploadedUrl = await uploadMediaFile(file);
            setCurrent((prev) => ({ ...prev, imageUrl: uploadedUrl }));
            toast.success("Cover uploaded successfully");
        } catch {
            toast.error("Failed to upload cover");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const published = posts?.filter(p => p.published).length ?? 0;
    const drafts = (posts?.length ?? 0) - published;

    if (isLoading) return (
        <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: "rgba(8,14,30,0.6)", border: "1px solid rgba(51,65,85,0.4)" }} />
            ))}
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)" }}>
                        <BookOpen size={20} className="text-orange-400" />
                    </div>
                    <div>
                        <h1 className="font-rajdhani text-2xl font-bold text-white">Blog Manager</h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            <span className="text-emerald-400 font-semibold">{published} published</span>
                            <span className="text-slate-600 mx-1">·</span>
                            <span className="text-amber-400 font-semibold">{drafts} drafts</span>
                        </p>
                    </div>
                </div>
                <button onClick={openNew} className="admin-btn-primary">
                    <Plus size={16} /> New Article
                </button>
            </div>

            {/* Post List */}
            {(!posts || posts.length === 0) ? (
                <div className="admin-empty-state">
                    <BookOpen size={44} className="opacity-20" />
                    <p className="font-rajdhani font-bold text-xl">No articles yet</p>
                    <p className="text-sm max-w-sm text-center">Start writing your first article. Supports bilingual content (English + Arabic).</p>
                    <button onClick={openNew} className="admin-btn-primary mt-2"><Plus size={14} /> Write an Article</button>
                </div>
            ) : (
                <div className="space-y-3">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group"
                            style={{ background: "rgba(8,14,30,0.7)", border: "1px solid rgba(51,65,85,0.5)" }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(249,115,22,0.2)"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(51,65,85,0.5)"}
                        >
                            {/* Color stripe */}
                            <div className={`w-1 h-14 rounded-full bg-gradient-to-b shrink-0 ${post.color}`} />

                            {/* Image thumb */}
                            {post.imageUrl ? (
                                <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 hidden sm:block">
                                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className={`w-16 h-12 rounded-xl shrink-0 bg-gradient-to-br ${post.color} hidden sm:flex items-center justify-center`}>
                                    <BookOpen size={18} className="text-white/60" />
                                </div>
                            )}

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-rajdhani font-bold text-white text-base truncate">{post.title}</h3>
                                    {post.titleAr && <span title="Has Arabic translation"><Globe size={12} className="text-cyan-400/60 shrink-0" /></span>}
                                </div>
                                <div className="flex items-center gap-3 mt-1 flex-wrap">
                                    <span className="text-[10px] font-bold uppercase text-orange-400 font-rajdhani tracking-wider">{post.category}</span>
                                    <span className="flex items-center gap-1 text-[10px] text-slate-600"><Clock size={9} /> {post.readingTime}</span>
                                    <span className="flex items-center gap-1 text-[10px] text-slate-600"><Calendar size={9} />
                                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                                    </span>
                                    <span className="text-[10px] text-slate-700 truncate max-w-[160px]">/{post.slug}</span>
                                </div>
                            </div>

                            {/* Status + Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                {/* Publish toggle */}
                                <button
                                    onClick={() => togglePublish(post)}
                                    title={post.published ? "Click to unpublish" : "Click to publish"}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold font-rajdhani uppercase tracking-wide transition-all"
                                    style={{
                                        background: post.published ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                                        border: post.published ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(245,158,11,0.3)",
                                        color: post.published ? "#34d399" : "#fbbf24",
                                    }}
                                >
                                    {post.published ? <Eye size={11} /> : <EyeOff size={11} />}
                                    {post.published ? "Published" : "Draft"}
                                </button>

                                {/* View live */}
                                {post.published && (
                                    <Link
                                        to={`/${locale}/blog/${post.slug}`}
                                        target="_blank"
                                        className="admin-btn-icon"
                                        title="View live post"
                                    >
                                        <ChevronRight size={14} />
                                    </Link>
                                )}

                                <button onClick={() => openEdit(post)} className="admin-btn-icon edit"><Edit2 size={13} /></button>
                                <button onClick={() => handleDelete(post.id!, post.title)} className="admin-btn-icon danger"><Trash2 size={13} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ══════ SIDE DRAWER ══════ */}
            {drawerOpen && (
                <>
                    <div className="admin-overlay" onClick={closeDrawer} />
                    <div className="admin-drawer" style={{ width: "600px" }}>
                        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4" style={{ background: "#080e1e", borderBottom: "1px solid rgba(51,65,85,0.5)" }}>
                            <h2 className="font-rajdhani text-xl font-bold text-white">{current.id ? "Edit Article" : "New Article"}</h2>
                            <button onClick={closeDrawer} className="admin-btn-icon"><X size={16} /></button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-5">

                            {/* Language Tab Switcher */}
                            <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(4,9,15,0.5)", border: "1px solid rgba(51,65,85,0.4)" }}>
                                {(["en", "ar"] as const).map(l => (
                                    <button
                                        key={l}
                                        type="button"
                                        onClick={() => setLang(l)}
                                        className="flex-1 py-2 rounded-lg text-sm font-rajdhani font-bold uppercase tracking-wide transition-all"
                                        style={{
                                            background: lang === l ? "rgba(249,115,22,0.15)" : "transparent",
                                            border: lang === l ? "1px solid rgba(249,115,22,0.3)" : "1px solid transparent",
                                            color: lang === l ? "#fb923c" : "#64748b",
                                        }}
                                    >
                                        {l === "en" ? "🇺🇸 English" : "🇸🇦 Arabic"}
                                    </button>
                                ))}
                            </div>

                            {/* EN Fields */}
                            {lang === "en" && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="admin-label">Title (EN) *</label>
                                        <input required type="text" value={current.title || ""} onChange={e => setCurrent({ ...current, title: e.target.value })} className="admin-input" placeholder="Article title in English" />
                                    </div>
                                    <div>
                                        <label className="admin-label">Summary / Excerpt (EN)</label>
                                        <textarea rows={2} value={current.excerpt || ""} onChange={e => setCurrent({ ...current, excerpt: e.target.value })} className="admin-textarea" placeholder="Short summary shown in the blog list..." />
                                    </div>
                                    <div>
                                        <label className="admin-label">Full Content (EN) *</label>
                                        <textarea required rows={8} value={current.content || ""} onChange={e => setCurrent({ ...current, content: e.target.value })} className="admin-textarea" placeholder="Write the full article body here. Each paragraph will be rendered separately." style={{ minHeight: "180px" }} />
                                        <p className="text-[10px] text-slate-600 mt-1">Separate paragraphs with a blank line (each paragraph renders individually in the article view)</p>
                                    </div>
                                </div>
                            )}

                            {/* AR Fields */}
                            {lang === "ar" && (
                                <div className="space-y-4" dir="rtl">
                                    <div>
                                        <label className="admin-label" style={{ direction: "ltr" }}>Title (AR)</label>
                                        <input type="text" value={current.titleAr || ""} onChange={e => setCurrent({ ...current, titleAr: e.target.value })} className="admin-input" style={{ textAlign: "right" }} placeholder="عنوان المقال بالعربية" />
                                    </div>
                                    <div>
                                        <label className="admin-label" style={{ direction: "ltr" }}>Summary (AR)</label>
                                        <textarea rows={2} value={current.excerptAr || ""} onChange={e => setCurrent({ ...current, excerptAr: e.target.value })} className="admin-textarea" style={{ textAlign: "right" }} placeholder="ملخص قصير يظهر في قائمة المقالات..." />
                                    </div>
                                    <div>
                                        <label className="admin-label" style={{ direction: "ltr" }}>Full Content (AR)</label>
                                        <textarea rows={8} value={current.contentAr || ""} onChange={e => setCurrent({ ...current, contentAr: e.target.value })} className="admin-textarea" style={{ textAlign: "right", minHeight: "180px" }} placeholder="محتوى المقال الكامل بالعربية. كل فقرة تُعرض منفصلة." />
                                    </div>
                                </div>
                            )}

                            {/* Shared Metadata */}
                            <div className="pt-2" style={{ borderTop: "1px solid rgba(51,65,85,0.4)" }}>
                                <p className="text-[10px] text-slate-600 uppercase tracking-widest font-rajdhani mb-3">Article Metadata</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="admin-label"><Tag size={10} /> Category</label>
                                        <input required type="text" value={current.category || ""} onChange={e => setCurrent({ ...current, category: e.target.value })} className="admin-input" placeholder="e.g. DevOps, AI, Web Dev" />
                                    </div>
                                    <div>
                                        <label className="admin-label"><Clock size={10} /> Reading Time</label>
                                        <input required type="text" value={current.readingTime || ""} onChange={e => setCurrent({ ...current, readingTime: e.target.value })} className="admin-input" placeholder="e.g. 8 min read" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="admin-label">URL Slug *</label>
                                        <input required type="text" value={current.slug || ""} onChange={e => setCurrent({ ...current, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })} className="admin-input" placeholder="my-article-slug" />
                                        <p className="text-[10px] text-slate-600 mt-1">/{locale}/blog/<span className="text-cyan-400">{current.slug || "your-slug"}</span></p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="admin-label">Cover Image URL</label>
                                        <input type="text" value={current.imageUrl || ""} onChange={e => setCurrent({ ...current, imageUrl: e.target.value })} className="admin-input" placeholder="https://... or uploaded file URL" />
                                        <div className="mt-2 flex items-center gap-2">
                                            <label className="admin-btn-ghost cursor-pointer">
                                                <Upload size={14} /> {isUploadingImage ? "Uploading..." : "Upload from device"}
                                                <input
                                                    type="file"
                                                    accept="image/*,video/*,audio/*,.pdf"
                                                    className="hidden"
                                                    disabled={isUploadingImage}
                                                    onChange={(e) => handleCoverUpload(e.target.files?.[0])}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    {current.imageUrl && (
                                        <div className="col-span-2 rounded-xl overflow-hidden h-32">
                                            <img src={current.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                                        </div>
                                    )}
                                    {/* Color Preset */}
                                    <div className="col-span-2">
                                        <label className="admin-label">Accent Color</label>
                                        <div className="flex flex-wrap gap-2">
                                            {COLOR_PRESETS.map(c => (
                                                <button
                                                    key={c.value}
                                                    type="button"
                                                    onClick={() => setCurrent({ ...current, color: c.value })}
                                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all"
                                                    style={{
                                                        border: current.color === c.value ? "1px solid rgba(6,182,212,0.5)" : "1px solid rgba(51,65,85,0.4)",
                                                        background: current.color === c.value ? "rgba(6,182,212,0.1)" : "rgba(8,14,30,0.5)",
                                                        color: current.color === c.value ? "#22d3ee" : "#64748b",
                                                    }}
                                                >
                                                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${c.value}`} />
                                                    {c.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Publish toggle */}
                            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(4,9,15,0.5)", border: "1px solid rgba(51,65,85,0.4)" }}>
                                <div>
                                    <p className="text-sm font-rajdhani font-bold text-white">Publication Status</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                        {current.published ? "Article is live and visible to visitors" : "Article is saved as draft, not publicly visible"}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setCurrent({ ...current, published: !current.published })}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold font-rajdhani uppercase transition-all shrink-0"
                                    style={{
                                        background: current.published ? "rgba(16,185,129,0.15)" : "rgba(51,65,85,0.3)",
                                        border: current.published ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(51,65,85,0.5)",
                                        color: current.published ? "#34d399" : "#64748b",
                                    }}
                                >
                                    {current.published ? <Eye size={13} /> : <EyeOff size={13} />}
                                    {current.published ? "Published" : "Draft"}
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2" style={{ borderTop: "1px solid rgba(51,65,85,0.4)" }}>
                                <button type="button" onClick={closeDrawer} className="admin-btn-ghost flex-1">Cancel</button>
                                <button type="submit" disabled={isSaving} className="admin-btn-primary flex-1 justify-center">
                                    {isSaving ? (
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                                    ) : <Save size={15} />}
                                    {isSaving ? "Saving..." : current.id ? "Save Changes" : "Publish Article"}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminBlog;
