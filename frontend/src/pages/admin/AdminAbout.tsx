import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApiQuery, useApiAdd, useApiUpdate, useApiDelete } from "@/hooks/useApiHooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Save, Plus, Trash2, Pencil, RefreshCw, GripVertical, CheckCircle2 } from "lucide-react";
import * as Icons from "lucide-react";

interface About {
    id?: string;
    label?: string;
    title?: string;
    subtitle?: string;
    bio1?: string;
    bio2?: string;
    bio3?: string;
    bio4?: string;
    labelAr?: string;
    titleAr?: string;
    subtitleAr?: string;
    bio1Ar?: string;
    bio2Ar?: string;
    bio3Ar?: string;
    bio4Ar?: string;
    servicesLabel?: string;
    servicesTitle?: string;
    servicesSubtitle?: string;
    servicesLabelAr?: string;
    servicesTitleAr?: string;
    servicesSubtitleAr?: string;
}

export default function AdminAbout() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar";

    // Core About Data Fetch
    const { data: aboutDataArray, isLoading: loadingAbout, refetch: refetchAbout } = useApiQuery<About[]>("about");
    const updateAboutMutation = useApiUpdate("about");
    const aboutData = aboutDataArray?.[0];

    // Services Data Fetch
    const { data: services, isLoading: loadingServices, refetch: refetchServices } = useApiQuery<any>("about/services");
    const createServiceMutation = useApiAdd("about/services");
    const updateServiceMutation = useApiUpdate<any>("about/services");
    const deleteServiceMutation = useApiDelete("about/services");

    // Local state for forms
    const [aboutForm, setAboutForm] = useState<any>(null);
    const [isSavingAbout, setIsSavingAbout] = useState(false);

    // Service Modal State
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState<any>(null);

    // Initialize about form once data loads
    if (aboutData && !aboutForm) {
        setAboutForm(aboutData);
    }

    const handleAboutChange = (field: string, value: string) => {
        setAboutForm((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSaveAbout = async () => {
        setIsSavingAbout(true);
        try {
            await updateAboutMutation.mutateAsync({ id: "main", data: aboutForm });
            refetchAbout();
        } finally {
            setIsSavingAbout(false);
        }
    };

    const handleOpenServiceModal = (service: any = null) => {
        if (service) {
            setCurrentService({ ...service });
        } else {
            setCurrentService({
                title: "", titleAr: "", badge: "", badgeAr: "",
                description: "", descriptionAr: "",
                icon: "Code2", color: "from-cyan-500 to-blue-500",
                glow: "rgba(6,182,212,0.22)", borderHover: "rgba(6,182,212,0.30)",
                order: services ? services.length : 0
            });
        }
        setIsServiceModalOpen(true);
    };

    const handleSaveService = async () => {
        if (currentService.id) {
            await updateServiceMutation.mutateAsync({ id: currentService.id, data: currentService });
        } else {
            await createServiceMutation.mutateAsync(currentService);
        }
        setIsServiceModalOpen(false);
        refetchServices();
    };

    const handleDeleteService = async (id: string) => {
        if (confirm("Are you sure you want to delete this service?")) {
            await deleteServiceMutation.mutateAsync(id);
            refetchServices();
        }
    };

    if (loadingAbout || loadingServices) {
        return <div className="p-8 flex items-center justify-center h-40"><RefreshCw className="animate-spin text-cyan-400" /></div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(139,92,246,0.08) 50%, rgba(4,9,15,0) 100%)", border: "1px solid rgba(6,182,212,0.15)" }}>
                <div>
                    <h1 className="font-rajdhani text-2xl md:text-3xl font-bold text-white mb-2">About & Services Control</h1>
                    <p className="text-sm text-slate-400">Manage your main bio and the service cards displayed on the portfolio.</p>
                </div>
            </div>

            {/* About Section Form */}
            {aboutForm && (
                <div className="card-glass-panel p-6 space-y-6">
                    <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                        <CheckCircle2 size={18} className="text-cyan-400" />
                        <h2 className="text-lg font-rajdhani font-bold text-white">Main About Content</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">English (Default)</h3>
                            <div>
                                <Label>Label (e.g., "About Me")</Label>
                                <Input className="mt-1 bg-slate-900/50" value={aboutForm.label || ""} onChange={e => handleAboutChange("label", e.target.value)} />
                            </div>
                            <div>
                                <Label>Title (e.g., "Who I Am")</Label>
                                <Input className="mt-1 bg-slate-900/50" value={aboutForm.title || ""} onChange={e => handleAboutChange("title", e.target.value)} />
                            </div>
                            <div>
                                <Label>Subtitle</Label>
                                <Textarea className="mt-1 bg-slate-900/50 h-20" value={aboutForm.subtitle || ""} onChange={e => handleAboutChange("subtitle", e.target.value)} />
                            </div>
                            <div>
                                <Label>Bio Paragraph 1</Label>
                                <Textarea className="mt-1 bg-slate-900/50 h-32" value={aboutForm.bio1 || ""} onChange={e => handleAboutChange("bio1", e.target.value)} />
                            </div>
                            <div>
                                <Label>Bio Paragraph 2</Label>
                                <Textarea className="mt-1 bg-slate-900/50 h-32" value={aboutForm.bio2 || ""} onChange={e => handleAboutChange("bio2", e.target.value)} />
                            </div>
                            <div>
                                <Label>Bio Paragraph 3</Label>
                                <Textarea className="mt-1 bg-slate-900/50 h-32" value={aboutForm.bio3 || ""} onChange={e => handleAboutChange("bio3", e.target.value)} />
                            </div>
                            <div>
                                <Label>Bio Paragraph 4</Label>
                                <Textarea className="mt-1 bg-slate-900/50 h-32" value={aboutForm.bio4 || ""} onChange={e => handleAboutChange("bio4", e.target.value)} />
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <p className="text-xs text-violet-400 uppercase tracking-wider font-bold mb-3">Services Section Header</p>
                            </div>
                            <div>
                                <Label>Services Label (e.g., "Services")</Label>
                                <Input className="mt-1 bg-slate-900/50" value={aboutForm.servicesLabel || ""} onChange={e => handleAboutChange("servicesLabel", e.target.value)} />
                            </div>
                            <div>
                                <Label>Services Title (e.g., "What I Offer")</Label>
                                <Input className="mt-1 bg-slate-900/50" value={aboutForm.servicesTitle || ""} onChange={e => handleAboutChange("servicesTitle", e.target.value)} />
                            </div>
                            <div>
                                <Label>Services Subtitle</Label>
                                <Textarea className="mt-1 bg-slate-900/50 h-20" value={aboutForm.servicesSubtitle || ""} onChange={e => handleAboutChange("servicesSubtitle", e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-4" dir="rtl">
                            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2" dir="ltr">Arabic (Optional)</h3>
                            <div>
                                <Label>العنوان الصغير</Label>
                                <Input className="mt-1 bg-slate-900/50 text-right" value={aboutForm.labelAr || ""} onChange={e => handleAboutChange("labelAr", e.target.value)} />
                            </div>
                            <div>
                                <Label>العنوان الرئيسي</Label>
                                <Input className="mt-1 bg-slate-900/50 text-right" value={aboutForm.titleAr || ""} onChange={e => handleAboutChange("titleAr", e.target.value)} />
                            </div>
                            <div>
                                <Label>الوصف التمهيدي</Label>
                                <Textarea className="mt-1 bg-slate-900/50 h-20 text-right" value={aboutForm.subtitleAr || ""} onChange={e => handleAboutChange("subtitleAr", e.target.value)} />
                            </div>
                            <div>
                                <Label>الفقرة الأولى</Label>
                                <Textarea className="mt-1 bg-slate-900/50 h-32 text-right" value={aboutForm.bio1Ar || ""} onChange={e => handleAboutChange("bio1Ar", e.target.value)} />
                            </div>
                            <div>
                                <Label>الفقرة الثانية</Label>
                                <Textarea className="mt-1 bg-slate-900/50 h-32 text-right" value={aboutForm.bio2Ar || ""} onChange={e => handleAboutChange("bio2Ar", e.target.value)} />
                            </div>
                            <div>
                                <Label>الفقرة الثالثة</Label>
                                <Textarea className="mt-1 bg-slate-900/50 h-32 text-right" value={aboutForm.bio3Ar || ""} onChange={e => handleAboutChange("bio3Ar", e.target.value)} />
                            </div>
                            <div>
                                <Label>الفقرة الرابعة</Label>
                                <Textarea className="mt-1 bg-slate-900/50 h-32 text-right" value={aboutForm.bio4Ar || ""} onChange={e => handleAboutChange("bio4Ar", e.target.value)} />
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <p className="text-xs text-violet-400 uppercase tracking-wider font-bold mb-3" dir="ltr">Services Section Header (AR)</p>
                            </div>
                            <div>
                                <Label>تسمية قسم الخدمات</Label>
                                <Input className="mt-1 bg-slate-900/50 text-right" value={aboutForm.servicesLabelAr || ""} onChange={e => handleAboutChange("servicesLabelAr", e.target.value)} />
                            </div>
                            <div>
                                <Label>عنوان قسم الخدمات</Label>
                                <Input className="mt-1 bg-slate-900/50 text-right" value={aboutForm.servicesTitleAr || ""} onChange={e => handleAboutChange("servicesTitleAr", e.target.value)} />
                            </div>
                            <div>
                                <Label>وصف قسم الخدمات</Label>
                                <Textarea className="mt-1 bg-slate-900/50 h-20 text-right" value={aboutForm.servicesSubtitleAr || ""} onChange={e => handleAboutChange("servicesSubtitleAr", e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-end">
                        <Button
                            onClick={handleSaveAbout}
                            disabled={isSavingAbout}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-rajdhani font-bold h-11 px-8 rounded-xl"
                        >
                            {isSavingAbout ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Save About Content
                        </Button>
                    </div>
                </div>
            )}

            {/* Services Section */}
            <div className="card-glass-panel p-6">
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-violet-400" />
                        <h2 className="text-lg font-rajdhani font-bold text-white">Services Cards</h2>
                    </div>
                    <Button
                        onClick={() => handleOpenServiceModal()}
                        className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white h-9 px-4 rounded-xl"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add Service
                    </Button>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services?.map((svc) => {
                        const IconNode = (Icons as any)[svc.icon] || Icons.Circle;
                        return (
                            <div key={svc.id} className="relative group bg-slate-900/40 border border-slate-700/50 rounded-xl p-5 hover:border-cyan-500/30 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-lg bg-gradient-to-br ${svc.color} shadow-lg shadow-${svc.color.split('-')[1]}-500/20`}>
                                        <IconNode className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button type="button" title="Edit service" onClick={() => handleOpenServiceModal(svc)} className="p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-800 rounded-md"><Pencil size={14} /></button>
                                        <button type="button" title="Delete service" onClick={() => handleDeleteService(svc.id)} className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800 rounded-md"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <div className="mb-1 text-[10px] uppercase tracking-wider text-cyan-400">{svc.badge}</div>
                                <h4 className="text-white font-rajdhani font-bold text-lg mb-2">{svc.title}</h4>
                                <p className="text-xs text-slate-400 line-clamp-3">{svc.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Service Modal */}
            <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
                <DialogContent className="sm:max-w-[700px] border-slate-700 bg-[#0A0F1C]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-rajdhani font-bold text-white mb-4">
                            {currentService?.id ? "Edit Service" : "Add New Service"}
                        </DialogTitle>
                    </DialogHeader>
                    {currentService && (
                        <div className="space-y-6 -mx-2 px-2 pb-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <Label>Title (EN)</Label>
                                    <Input className="bg-slate-900/60" value={currentService.title} onChange={e => setCurrentService({ ...currentService, title: e.target.value })} />

                                    <Label>Badge (EN)</Label>
                                    <Input className="bg-slate-900/60" value={currentService.badge} onChange={e => setCurrentService({ ...currentService, badge: e.target.value })} />

                                    <Label>Description (EN)</Label>
                                    <Textarea className="bg-slate-900/60 h-24" value={currentService.description} onChange={e => setCurrentService({ ...currentService, description: e.target.value })} />
                                </div>
                                <div className="space-y-3" dir="rtl">
                                    <Label>العنوان (AR)</Label>
                                    <Input className="bg-slate-900/60 text-right" value={currentService.titleAr} onChange={e => setCurrentService({ ...currentService, titleAr: e.target.value })} />

                                    <Label>الشارة (AR)</Label>
                                    <Input className="bg-slate-900/60 text-right" value={currentService.badgeAr} onChange={e => setCurrentService({ ...currentService, badgeAr: e.target.value })} />

                                    <Label>الوصف (AR)</Label>
                                    <Textarea className="bg-slate-900/60 h-24 text-right" value={currentService.descriptionAr} onChange={e => setCurrentService({ ...currentService, descriptionAr: e.target.value })} />
                                </div>
                            </div>

                            <div className="border-t border-slate-800 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>Icon Name (Lucide React)</Label>
                                    <Input className="bg-slate-900/60 mt-1" value={currentService.icon} onChange={e => setCurrentService({ ...currentService, icon: e.target.value })} placeholder="e.g. Code2, Monitor" />
                                </div>
                                <div>
                                    <Label>Gradient Classes (Tailwind)</Label>
                                    <Input className="bg-slate-900/60 mt-1" value={currentService.color} onChange={e => setCurrentService({ ...currentService, color: e.target.value })} placeholder="from-cyan-500 to-blue-500" />
                                </div>
                                <div>
                                    <Label>Glow Color (RGBA)</Label>
                                    <Input className="bg-slate-900/60 mt-1" value={currentService.glow} onChange={e => setCurrentService({ ...currentService, glow: e.target.value })} placeholder="rgba(6,182,212,0.22)" />
                                </div>
                                <div>
                                    <Label>Border Hover Strategy (RGBA)</Label>
                                    <Input className="bg-slate-900/60 mt-1" value={currentService.borderHover} onChange={e => setCurrentService({ ...currentService, borderHover: e.target.value })} placeholder="rgba(6,182,212,0.30)" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                                <Button variant="ghost" className="hover:bg-slate-800" onClick={() => setIsServiceModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleSaveService} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold">
                                    <Save className="h-4 w-4 mr-2" /> Save Service
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
