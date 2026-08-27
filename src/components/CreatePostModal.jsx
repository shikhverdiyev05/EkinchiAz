import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X, Image as ImageIcon, Upload, Loader2,
  Tag, Sparkles
} from 'lucide-react';
import { createPostApi, updatePostApi } from '../services/apiService';
import { uploadImageToImgBB } from '../services/imageService';

const SUGGESTED_TAGS = [
  'taxıl', 'traktor', 'gübrə', 'suvarma', 'istixana',
  'məsləhət', 'heyvandarlıq', 'aqroiqlim', 'toxum', 'texnika'
];

export function CreatePostModal({
  isOpen,
  onClose,
  onSuccess,
  existingPost = null,
  currentUser,
  onShowToast
}) {
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Modal hər dəfə açılanda və ya existingPost dəyişdikdə state-ləri bərpa et
  useEffect(() => {
    if (isOpen) {
      setDescription(existingPost?.description || '');
      setTags(Array.isArray(existingPost?.tags) ? [...existingPost.tags] : []);
      setImages(Array.isArray(existingPost?.images) ? [...existingPost.images] : []);
      setTagInput('');
    }
  }, [isOpen, existingPost]);

  // Bağlanma funksiyası
  const handleClose = useCallback(() => {
    if (submitting || uploadingImages) return;
    
    // State-ləri təmizlə
    setDescription('');
    setTags([]);
    setImages([]);
    setTagInput('');
    
    if (typeof onClose === 'function') {
      onClose();
    }
  }, [submitting, uploadingImages, onClose]);

  // Escape klavişi ilə bağlanma
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { 
      if (e.key === 'Escape') handleClose(); 
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, handleClose]);

  // Mobile scroll kilidi
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddTag = (t) => {
    const clean = t.replace(/^#/, '').trim().toLowerCase();
    if (!clean || tags.includes(clean)) { setTagInput(''); return; }
    if (tags.length >= 8) { onShowToast?.('Maksimum 8 taq əlavə edə bilərsiniz'); return; }
    setTags(prev => [...prev, clean]);
    setTagInput('');
  };

  const handleRemoveTag = (idx) =>
    setTags(prev => prev.filter((_, i) => i !== idx));

  const handleImageFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (!files.length) return;

    const remaining = 5 - images.length;
    if (remaining <= 0) { onShowToast?.('Maksimum 5 şəkil yükləyə bilərsiniz'); return; }
    const toUpload = files.slice(0, remaining);
    if (files.length > remaining) onShowToast?.(`Yalnız ilk ${remaining} şəkil əlavə ediləcək`);

    setUploadingImages(true);
    try {
      const urls = [];
      for (const file of toUpload) {
        if (file.size > 10 * 1024 * 1024) { onShowToast?.(`"${file.name}" 10MB-dan böyükdür, atlandı`); continue; }
        const url = await uploadImageToImgBB(file);
        if (url) urls.push(url);
      }
      if (urls.length > 0) {
        setImages(prev => [...prev, ...urls]);
        onShowToast?.(`${urls.length} şəkil uğurla yükləndi`);
      } else {
        onShowToast?.('Heç bir şəkil yüklənmədi');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      onShowToast?.('Şəkil yükləmə zamanı xəta baş verdi');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (idx) =>
    setImages(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!currentUser) { onShowToast?.('Paylaşım üçün daxil olun'); return; }
    const cleanDesc = description.trim();
    if (!cleanDesc) {
      onShowToast?.('Zəhmət olmasa mətn daxil edin');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        userId: currentUser.id,
        authorName: currentUser.name || 'Fermer',
        authorPhoto: currentUser.avatar || null,
        description: cleanDesc,
        tags,
        images,
      };

      if (existingPost?.id) {
        await updatePostApi(existingPost.id, payload);
      } else {
        await createPostApi(payload);
      }

      onSuccess?.();
      window.dispatchEvent(new Event('refreshPosts'));
      
      // Submit uğurlu olduqdan sonra submitting-i söndürüb birbaşa onClose çağırırıq
      setSubmitting(false);
      onClose?.();
    } catch (err) {
      console.error('Post submit error:', err);
      onShowToast?.('Paylaşım zamanı xəta baş verdi');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-gray-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-emerald-100 animate-slideUp md:animate-fadeIn">

        {/* Header */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                {existingPost ? 'Paylaşımı Redaktə Et' : 'Yeni Aqrar Paylaşım'}
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-500 hidden sm:block">Təcrübənizi icma ilə bölüşün</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting || uploadingImages}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">

            {/* User row */}
            <div className="flex items-center gap-3">
              <img
                src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'U')}&background=10b981&color=fff`}
                alt=""
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-100 shrink-0"
              />
              <div>
                <div className="font-black text-sm text-gray-900">{currentUser?.name || 'İstifadəçi'}</div>
                <div className="text-[11px] text-emerald-700 font-bold">
                  {currentUser?.region || 'Azərbaycan'} • {currentUser?.userType === 'company' ? 'Aqro Şirkət' : 'Fermer'}
                </div>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Torpaq becərməsi, məhsuldarlıq, dərmanlama və ya texnika barədə fikirlərinizi yazın..."
              className="w-full p-4 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none placeholder:text-gray-400"
            />

            {/* Tags */}
            <div>
              <label className="flex items-center gap-2 text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                Taqlar ({tags.length}/8)
              </label>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-bold">
                      #{tag}
                      <button type="button" onClick={() => handleRemoveTag(i)} className="text-emerald-400 hover:text-red-600 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); handleAddTag(tagInput); } }}
                  placeholder="Taq yazın və Enter basın"
                  className="flex-1 p-2.5 text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition"
                />
                <button type="button" onClick={() => handleAddTag(tagInput)} className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition">
                  Əlavə et
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {SUGGESTED_TAGS.filter(t => !tags.includes(t)).slice(0, 6).map(t => (
                  <button key={t} type="button" onClick={() => handleAddTag(t)} className="text-[11px] font-bold text-gray-500 hover:text-emerald-700 bg-gray-100 hover:bg-emerald-50 px-2 py-0.5 rounded-md transition">
                    +{t}
                  </button>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" /> Şəkillər ({images.length}/5)
                </span>
                {images.length < 5 && (
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImages}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 disabled:opacity-50">
                    <Upload className="w-3.5 h-3.5" />
                    {images.length > 0 ? 'Daha Çox' : 'Şəkil Seç'}
                  </button>
                )}
              </div>

              <input type="file" ref={fileInputRef} onChange={handleImageFiles} accept="image/*" multiple className="hidden" />

              {uploadingImages && (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 mb-3">
                  <Loader2 className="w-4 h-4 animate-spin" /> Yüklənir...
                </div>
              )}

              {images.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full transition">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && !uploadingImages && (
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-400 flex items-center justify-center text-gray-400 hover:text-emerald-600 transition">
                      <Upload className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ) : (
                <div onClick={() => !uploadingImages && fileInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-gray-200 hover:border-emerald-400 bg-gray-50/50 hover:bg-emerald-50/30 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition text-gray-400 hover:text-emerald-700">
                  <Upload className="w-7 h-7 mb-1.5" />
                  <span className="text-xs font-bold">Şəkilləri seçin (maks. 5)</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Bir dəfədə birdən çox seçmək mümkündür</span>
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="px-5 sm:px-6 py-4 border-t border-gray-100 bg-gray-50/60 flex items-center justify-end gap-3 shrink-0">
            <button type="button" onClick={handleClose} disabled={submitting || uploadingImages}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-200 transition disabled:opacity-50 cursor-pointer">
              Ləğv et
            </button>
            <button type="submit" disabled={submitting || uploadingImages || !description.trim()}
              className="px-7 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition disabled:opacity-50 flex items-center gap-2 cursor-pointer">
              {submitting ? (<><Loader2 className="w-4 h-4 animate-spin" /> Yadda saxlanılır...</>) : existingPost ? 'Yenilə' : 'Paylaş'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default CreatePostModal;