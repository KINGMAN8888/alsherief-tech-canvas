import { useState } from "react";
import { useApiQuery, useApiAdd, useApiUpdate, useApiDelete } from "@/hooks/useApiHooks";
import { Plus, Edit2, Trash2, Medal, X, Save, Tag, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadMediaFile } from "@/lib/mediaUpload";

interface CertItem {
    id?: string;
    title: string;
    issuer: string;
    category: string;
    image: string;
}

const AdminCertifications = () => {
    const { data: certs, isLoading } = useApiQuery<CertItem>("certifications");
    const addCert = useApiAdd("certifications");
    const updateCert = useApiUpdate("certifications");
    const deleteCert = useApiDelete("certifications");

    const [modalOpen, setModalOpen] = useState(false);
    const [current, setCurrent] = useState<Partial<CertItem>>({});
    const [filterCat, setFilterCat] = useState<string>("All");
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const allCategories = ["All", ...Array.from(new Set(certs?.map(c => c.category).filter(Boolean) ?? []))];

    const openNew = () => { setCurrent({}); setModalOpen(true); };
    const openEdit = (c: CertItem) => { setCurrent(c); setModalOpen(true); };
    const closeModal = () => { setModalOpen(false); setCurrent({}); };

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`Delete "${title}"?`)) {
            try { await deleteCert.mutateAsync(id); toast.success("Certification deleted"); }
            catch { toast.error("Failed to delete"); }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (current.id) { await updateCert.mutateAsync({ id: current.id, data: current }); toast.success("Certification updated"); }
            else { await addCert.mutateAsync(current); toast.success("Certification added"); }
            closeModal();
        } catch { toast.error("Failed to save"); }
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

    const filtered = filterCat === "All" ? certs : certs?.filter(c => c.category === filterCat);

    if (isLoading) return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="h-52 rounded-2xl animate-pulse" style={{ background: "rgba(8,14,30,0.6)", border: "1px solid rgba(51,65,85,0.4)" }} />)}
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
                        <Medal size={20} className="text-amber-400" />
                    </div>
                    <div>
                        <h1 className="font-rajdhani text-2xl font-bold text-white">Certifications</h1>
                        <p className="text-xs text-slate-500 mt-0.5">{certs?.length ?? 0} certificates</p>
                    </div>
                </div>
                <button onClick={openNew} className="admin-btn-primary"><Plus size={16} /> Add Certificate</button>
            </div>

            {/* Category Filters */}
            {allCategories.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-5">
                    {allCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterCat(cat)}
                            className="px-3 py-1.5 rounded-lg text-xs font-rajdhani font-bold uppercase tracking-wide transition-all duration-200"
                            style={{
                                background: filterCat === cat ? "rgba(6,182,212,0.15)" : "rgba(8,14,30,0.6)",
                                border: filterCat === cat ? "1px solid rgba(6,182,212,0.4)" : "1px solid rgba(51,65,85,0.4)",
                                color: filterCat === cat ? "#22d3ee" : "#64748b",
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {/* Grid */}
            {(!filtered || filtered.length === 0) ? (
                <div className="admin-empty-state">
                    <Medal size={40} className="opacity-30" />
                    <p className="font-rajdhani font-bold text-lg">No certifications found</p>
                    <button onClick={openNew} className="admin-btn-primary mt-2"><Plus size={14} /> Add Certificate</button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filtered.map((cert) => (
                        <div key={cert.id} className="rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1" style={{ background: "rgba(8,14,30,0.7)", border: "1px solid rgba(51,65,85,0.5)" }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,158,11,0.3)"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(51,65,85,0.5)"}
                        >
                            {/* Image */}
                            <div className="aspect-[4/3] bg-slate-900 relative overflow-hidden">
                                <img src={cert.image} alt={cert.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105 transition-transform" />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: "rgba(4,9,15,0.6)", backdropFilter: "blur(4px)" }}>
                                    <button onClick={() => openEdit(cert)} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all" style={{ background: "rgba(96,165,250,0.3)" }}><Edit2 size={15} className="text-blue-300" /></button>
                                    <button onClick={() => handleDelete(cert.id!, cert.title)} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all" style={{ background: "rgba(239,68,68,0.3)" }}><Trash2 size={15} className="text-red-300" /></button>
                                </div>
                            </div>
                            {/* Info */}
                            <div className="p-3 flex-1 flex flex-col">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400 font-rajdhani mb-0.5">{cert.category}</span>
                                <h3 className="text-xs font-bold text-white font-rajdhani leading-snug mb-1 flex-1">{cert.title}</h3>
                                <p className="text-[10px] text-slate-500 truncate">{cert.issuer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <>
                    <div className="admin-overlay" onClick={closeModal} />
                    <div className="admin-modal p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-rajdhani text-xl font-bold text-white">{current.id ? "Edit Certificate" : "Add Certificate"}</h2>
                            <button onClick={closeModal} className="admin-btn-icon"><X size={16} /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="admin-label">Title</label>
                                <input required type="text" value={current.title || ""} onChange={e => setCurrent({ ...current, title: e.target.value })} className="admin-input" placeholder="AWS Solutions Architect" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="admin-label">Issuer</label>
                                    <input required type="text" value={current.issuer || ""} onChange={e => setCurrent({ ...current, issuer: e.target.value })} className="admin-input" placeholder="Amazon Web Services" />
                                </div>
                                <div>
                                    <label className="admin-label"><Tag size={10} /> Category</label>
                                    <input required type="text" value={current.category || ""} onChange={e => setCurrent({ ...current, category: e.target.value })} className="admin-input" placeholder="Cloud Computing" />
                                </div>
                            </div>
                            <div>
                                <label className="admin-label">Image URL or Path</label>
                                <input required type="text" value={current.image || ""} onChange={e => setCurrent({ ...current, image: e.target.value })} className="admin-input" placeholder="/certs/aws.png or uploaded file URL" />
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
                            {current.image && (
                                <div className="rounded-xl overflow-hidden h-32" style={{ border: "1px solid rgba(51,65,85,0.4)" }}>
                                    <img src={current.image} alt="preview" className="w-full h-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                                </div>
                            )}
                            <div className="flex gap-3 pt-4" style={{ borderTop: "1px solid rgba(51,65,85,0.4)" }}>
                                <button type="button" onClick={closeModal} className="admin-btn-ghost flex-1">Cancel</button>
                                <button type="submit" disabled={addCert.isPending || updateCert.isPending} className="admin-btn-primary flex-1 justify-center">
                                    <Save size={15} /> {current.id ? "Save Changes" : "Add Certificate"}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminCertifications;
