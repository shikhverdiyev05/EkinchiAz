import { useState, useRef } from 'react';
import { X, Image as ImageIcon, Upload, Loader2, Tags } from 'lucide-react';
import { createPostApi, updatePostApi } from '../services/apiService';

export function CreatePostModal({ isOpen, onClose, onSuccess, existingPost = null, currentUser, onShowToast }) {
  const [description, setDescription] = useState(existingPost?.description || '');
  const [tagsInput, setTagsInput] = useState(existingPost?.tags?.join(', ') || '');
  const [images, setImages] = useState(existingPost?.images || []);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      onShowToast?.('Maksimum 5 şəkil yükləyə bilərsiniz.');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() && images.length === 0) return;
    if (!currentUser) return onShowToast?.('Daxil olun');
    setLoading(true);

    try {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t);
      const postData = {
        userId: currentUser.id,
        authorName: currentUser.name || 'İstifadəçi',
        authorPhoto: currentUser.photoURL || null,
        description: description.trim(),
        tags,
        images,
      };

      if (existingPost) {
        await updatePostApi(existingPost.id, postData);
      } else {
        await createPostApi(postData);
      }
      
      setDescription('');
      setTagsInput('');
      setImages([]);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      onShowToast?.('Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-black text-gray-900">{existingPost ? 'Paylaşımı Redaktə Et' : 'Yeni Paylaşım'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1">
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Nə düşünürsünüz? (Məsləhət, təcrübə və ya sualınızı yazın...)"
            className="w-full min-h-[120px] p-4 text-gray-800 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none mb-4"
          />

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-700">
              <Tags className="w-4 h-4 text-emerald-600" />
              Taqlar (vergüllə ayırın)
            </div>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="məs: #traktor, #buğda, #məsləhət"
              className="w-full p-3 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
            />
          </div>

          <div className="mb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" /> Şəkillər ({images.length}/5)
              </span>
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  + Əlavə et
                </button>
              )}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="hidden"
            />

            {images.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all cursor-pointer"
              >
                <Upload className="w-6 h-6 mb-2" />
                <span className="text-sm font-bold">Şəkil yükləmək üçün klikləyin</span>
              </div>
            )}
          </div>
        </form>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading || (!description.trim() && images.length === 0)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {existingPost ? 'Yadda Saxla' : 'Paylaş'}
          </button>
        </div>
      </div>
    </div>
  );
}
