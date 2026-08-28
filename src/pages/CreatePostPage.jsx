import { useState, useRef, useCallback } from "react";
import {
  ArrowLeft, Image as ImageIcon, X, Tag, Loader2,
  Sparkles, Upload, Send, Hash, AlertCircle, CheckCircle2
} from "lucide-react";
import { createPostApi, updatePostApi } from "../services/apiService";
import { uploadImageToImgBB, compressImage } from "../services/imageService";

const TAGS_PRESET = [
  { label: "taxıl", emoji: "🌾" }, { label: "traktor", emoji: "🚜" },
  { label: "gübrə", emoji: "🧪" }, { label: "suvarma", emoji: "💧" },
  { label: "istixana", emoji: "🏡" }, { label: "məsləhət", emoji: "💬" },
  { label: "heyvandarlıq", emoji: "🐄" }, { label: "toxum", emoji: "🌱" },
  { label: "texnika", emoji: "⚙️" }, { label: "aqroiqlim", emoji: "🌤️" },
  { label: "bazar", emoji: "🏪" }, { label: "üzüm", emoji: "🍇" },
];

export default function CreatePostPage({
  currentUser,
  existingPost = null,
  onSuccess,
  onBack,
  onShowToast,
}) {
  const [description, setDescription] = useState(existingPost?.description || "");
  const [tags, setTags] = useState(
    Array.isArray(existingPost?.tags) ? [...existingPost.tags] : []
  );
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState(
    Array.isArray(existingPost?.images) ? [...existingPost.images] : []
  );
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const toast = (msg, type = "info") => onShowToast?.(msg, type);

  // ── Tag management ─────────────────────────────────────────────────────
  const addTag = useCallback((raw) => {
    const clean = raw.replace(/^#/, "").trim().toLowerCase();
    if (!clean) return;
    if (tags.includes(clean)) { setTagInput(""); return; }
    if (tags.length >= 10) { toast("Maksimum 10 taq əlavə edə bilərsiniz"); return; }
    setTags((p) => [...p, clean]);
    setTagInput("");
  }, [tags]);

  const removeTag = (i) => setTags((p) => p.filter((_, idx) => idx !== i));

  // ── Image upload ────────────────────────────────────────────────────────
  const processFiles = useCallback(async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    const remaining = 5 - images.length;
    if (remaining <= 0) { toast("Maksimum 5 şəkil yükləyə bilərsiniz"); return; }

    const toUpload = files.filter((f) => f.type.startsWith("image/")).slice(0, remaining);
    if (!toUpload.length) { toast("Yalnız şəkil faylları qəbul edilir"); return; }
    if (files.length > remaining)
      toast(`Yalnız ilk ${remaining} şəkil əlavə ediləcək`);

    setUploading(true);
    setUploadProgress({ done: 0, total: toUpload.length });

    const urls = [];
    for (const file of toUpload) {
      if (file.size > 15 * 1024 * 1024) {
        toast(`"${file.name}" 15MB-dan böyükdür, atlandı`);
        continue;
      }
      try {
        const optimized = await compressImage(file, { maxSize: 1800, quality: 0.85 });
        const url = await uploadImageToImgBB(optimized);
        if (url) urls.push(url);
        setUploadProgress((p) => ({ ...p, done: p.done + 1 }));
      } catch {
        toast(`"${file.name}" yüklənərkən xəta baş verdi`);
      }
    }

    if (urls.length) {
      setImages((p) => [...p, ...urls]);
      toast(`${urls.length} şəkil uğurla yükləndi ✓`);
    }
    setUploading(false);
    setUploadProgress({ done: 0, total: 0 });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [images.length]);

  // ── Drag & drop ─────────────────────────────────────────────────────────
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!currentUser) { toast("Paylaşım üçün hesabınıza daxil olun"); return; }

    const desc = description.trim();
    if (!desc && images.length === 0) {
      toast("Zəhmət olmasa mətn və ya ən azı 1 şəkil əlavə edin");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        userId: currentUser.id,
        authorName: currentUser.name || "Fermer",
        authorPhoto: currentUser.avatar || null,
        description: desc,
        tags,
        images,
      };

      if (existingPost?.id) {
        await updatePostApi(existingPost.id, payload);
        toast("Paylaşım yeniləndi ✓");
      } else {
        await createPostApi(payload);
        toast("Paylaşım uğurla paylaşıldı ✓");
      }

      window.dispatchEvent(new Event("refreshPosts"));
      onSuccess?.();
      onBack?.();
    } catch (err) {
      console.error("Post submit error:", err);
      toast("Paylaşım zamanı xəta baş verdi");
      setSubmitting(false);
    }
  };

  const canSubmit = !submitting && !uploading && (description.trim() || images.length > 0);
  const charCount = description.length;
  const charMax = 2000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40">
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold text-sm transition group"
          >
            <div className="w-9 h-9 rounded-xl bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition">
              <ArrowLeft className="w-4.5 h-4.5" />
            </div>
            <span className="hidden sm:inline">Geri</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <h1 className="font-black text-gray-900 text-base sm:text-lg">
              {existingPost ? "Paylaşımı Redaktə et" : "Yeni Paylaşım"}
            </h1>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black text-sm shadow-md hover:shadow-lg transition-all"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Paylaşılır...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{existingPost ? "Yenilə" : "Paylaş"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Auth warning */}
        {!currentUser && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm font-bold text-amber-800">
            <AlertCircle className="w-5 h-5 shrink-0" />
            Paylaşım etmək üçün hesabınıza daxil olun.
          </div>
        )}

        {/* User card */}
        {currentUser && (
          <div className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <img
              src={
                currentUser.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || "U")}&background=10b981&color=fff&size=80`
              }
              alt=""
              className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-200 shrink-0"
            />
            <div>
              <div className="font-black text-gray-900">{currentUser.name || "İstifadəçi"}</div>
              <div className="text-xs font-bold text-emerald-700">
                {currentUser.region || "Azərbaycan"} ·{" "}
                {currentUser.userType === "company" ? "Aqro Şirkət" : "Fermer"}
              </div>
            </div>
            <div className="ml-auto">
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg text-[11px] font-black">
                <CheckCircle2 className="w-3 h-3" /> Doğrulanmış
              </span>
            </div>
          </div>
        )}

        {/* ── Text area ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, charMax))}
            placeholder="Torpaq becərməsi, məhsuldarlıq, ziyanverici mübarizəsi, texnika haqda fikirlərinizi bölüşün..."
            rows={6}
            className="w-full p-5 text-sm text-gray-900 bg-transparent outline-none resize-none placeholder:text-gray-400 leading-relaxed"
          />
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50 bg-gray-50/50">
            <span className="text-[11px] text-gray-400 font-bold">
              {charCount}/{charMax} simvol
            </span>
            <div
              className={`w-2 h-2 rounded-full transition-colors ${
                charCount > charMax * 0.9 ? "bg-red-400" : charCount > charMax * 0.7 ? "bg-amber-400" : "bg-emerald-400"
              }`}
            />
          </div>
        </div>

        {/* ── Images ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2 font-black text-sm text-gray-800">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              Şəkillər
              <span className="text-xs font-bold text-gray-400">({images.length}/5)</span>
            </div>
            {images.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 disabled:opacity-50 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                Şəkil əlavə et
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => processFiles(e.target.files)}
          />

          <div className="p-4">
            {/* Upload progress */}
            {uploading && (
              <div className="mb-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-emerald-800 mb-1">
                    Yüklənir... ({uploadProgress.done}/{uploadProgress.total})
                  </div>
                  <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${uploadProgress.total ? (uploadProgress.done / uploadProgress.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {images.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100 shadow-sm">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                    <button
                      type="button"
                      onClick={() => setImages((p) => p.filter((_, i) => i !== idx))}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {idx === 0 && (
                      <div className="absolute bottom-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                        ƏSAS
                      </div>
                    )}
                  </div>
                ))}
                {images.length < 5 && !uploading && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/30 flex flex-col items-center justify-center gap-1 text-gray-300 hover:text-emerald-500 transition-all"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="text-[9px] font-bold">Əlavə et</span>
                  </button>
                )}
              </div>
            ) : (
              <div
                onDrop={onDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`py-10 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                  ${dragOver ? "border-emerald-400 bg-emerald-50" : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/20"}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-black text-gray-600">
                    {dragOver ? "Buraxın!" : "Şəkilləri seçin və ya sürükləyin"}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Maksimum 5 şəkil · 15MB-a qədər · JPG, PNG, WEBP</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Tags ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 font-black text-sm text-gray-800">
            <Hash className="w-4 h-4 text-emerald-600" />
            Taqlar
            <span className="text-xs font-bold text-gray-400">({tags.length}/10)</span>
          </div>
          <div className="p-4 space-y-3">
            {/* Selected tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-black"
                  >
                    #{tag}
                    <button type="button" onClick={() => removeTag(i)} className="text-emerald-400 hover:text-red-500 transition-colors ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                  placeholder="Taq adı... (Enter ilə əlavə edin)"
                  className="w-full pl-9 pr-3 py-2.5 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition"
                />
              </div>
              <button
                type="button"
                onClick={() => addTag(tagInput)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition shadow-sm"
              >
                Əlavə et
              </button>
            </div>

            {/* Preset tags */}
            <div>
              <p className="text-[11px] font-bold text-gray-400 mb-2">Populyar taqlar:</p>
              <div className="flex flex-wrap gap-1.5">
                {TAGS_PRESET.filter((t) => !tags.includes(t.label)).map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => addTag(t.label)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 hover:text-emerald-800 bg-gray-50 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200 px-2.5 py-1 rounded-lg transition"
                  >
                    <span>{t.emoji}</span> {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Submit button (mobile bottom) ── */}
        <div className="pb-8">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-100 disabled:text-gray-400 text-white font-black text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Paylaşılır...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {existingPost ? "Paylaşımı Yenilə" : "İndi Paylaş"}
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
