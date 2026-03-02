import { useState } from "react";
import { Copy, Link2, Loader2, Upload, Check } from "lucide-react";
import { toast } from "sonner";
import { uploadMediaFile } from "@/lib/mediaUpload";

const GlobalMediaUploader = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState("");
    const [copied, setCopied] = useState(false);

    const handleUpload = async (file?: File) => {
        if (!file) return;
        setIsUploading(true);
        try {
            const url = await uploadMediaFile(file);
            setUploadedUrl(url);
            toast.success("Media uploaded successfully");
        } catch {
            toast.error("Failed to upload media");
        } finally {
            setIsUploading(false);
        }
    };

    const handleCopy = async () => {
        if (!uploadedUrl) return;
        try {
            await navigator.clipboard.writeText(uploadedUrl);
            setCopied(true);
            toast.success("URL copied to clipboard");
            setTimeout(() => setCopied(false), 1500);
        } catch {
            toast.error("Failed to copy URL");
        }
    };

    return (
        <div className="rounded-xl p-3 mt-4 bg-cyan-500/5 border border-cyan-500/20">
            <p className="text-[10px] font-rajdhani font-bold uppercase tracking-widest text-cyan-400 mb-2">
                Media Upload
            </p>

            <div className="flex flex-wrap items-center gap-2">
                <label className="admin-btn-ghost cursor-pointer text-xs px-2.5 py-1.5">
                    <Upload size={13} /> {isUploading ? "Uploading..." : "Upload from device"}
                    <input
                        type="file"
                        accept="image/*,video/*,audio/*,.pdf"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(e) => handleUpload(e.target.files?.[0])}
                    />
                </label>

                {isUploading && <Loader2 size={14} className="animate-spin text-cyan-400" />}
            </div>

            {uploadedUrl && (
                <div className="mt-2 space-y-2">
                    <div className="w-full rounded-lg px-2.5 py-2 text-[11px] text-slate-300 break-all bg-[#04090f]/50 border border-slate-700/40">
                        {uploadedUrl}
                    </div>
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="admin-btn-ghost text-xs px-2.5 py-1.5"
                    >
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                        {copied ? "Copied" : "Copy URL"}
                        <Link2 size={12} className="ml-0.5 opacity-70" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default GlobalMediaUploader;
