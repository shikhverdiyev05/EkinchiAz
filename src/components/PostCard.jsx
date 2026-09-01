/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Heart, MessageCircle, Share2, Bookmark, MoreVertical,
  ChevronLeft, ChevronRight, Edit2, Trash2, MapPin, Tag
} from 'lucide-react';
import { toggleLikeApi, toggleSaveApi, deletePostApi, updatePostApi } from '../services/apiService';

export function PostCard({
  post,
  onOpenModal,
  onEdit,
  onDelete,
  isLiked: initLiked = false,
  isSaved: initSaved = false,
  onNavigateUser,
  currentUser,
  onShowToast
}) {
  const [currentImg, setCurrentImg] = useState(0);
  const [isLiked, setIsLiked] = useState(initLiked);
  const [isSaved, setIsSaved] = useState(initSaved);
  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);
  const [savesCount, setSavesCount] = useState(post?.savesCount || 0);
  const [shareCount, setShareCount] = useState(post?.shareCount || 0);
  const [showMenu, setShowMenu] = useState(false);

  React.useEffect(() => {
    setIsLiked(initLiked);
  }, [initLiked]);

  React.useEffect(() => {
    setIsSaved(initSaved);
  }, [initSaved]);

  if (!post) return null;

  const isOwner = currentUser?.id && currentUser.id === post.userId;
  const images = Array.isArray(post.images) ? post.images : [];
  const authorAvatar = post.authorPhoto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName || 'Fermer')}&background=10b981&color=fff`;

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUser) {
      onShowToast?.('Bəyənmək üçün daxil olun');
      return;
    }
    const next = !isLiked;
    setIsLiked(next);
    setLikesCount(prev => next ? prev + 1 : Math.max(0, prev - 1));
    await toggleLikeApi(post.id, currentUser.id, next);
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!currentUser?.id) {
      onShowToast?.('Yadda saxlamaq üçün daxil olun');
      return;
    }
    const next = !isSaved;
    setIsSaved(next);
    setSavesCount(prev => next ? prev + 1 : Math.max(0, prev - 1));
    await toggleSaveApi(post.id, currentUser.id, next);
    onShowToast?.(next ? 'Yadda saxlanılanlara əlavə edildi' : 'Yadda saxlanılanlardan çıxarıldı');
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/post/${post.id}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
      onShowToast?.('Paylaşım linki kopyalandı!');
      setShareCount(p => p + 1);
      await updatePostApi(post.id, { shareCount: (post.shareCount || 0) + 1 }).catch(() => {});
    } catch {
      onShowToast?.(url);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setShowMenu(false);
    if (!window.confirm('Bu paylaşımı silmək istədiyinizə əminsiniz?')) return;
    try {
      await deletePostApi(post.id);
      onDelete?.(post.id);
      onShowToast?.('Paylaşım silindi');
    } catch {
      onShowToast?.('Silinmə zamanı xəta baş verdi');
    }
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImg(p => (p + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImg(p => (p - 1 + images.length) % images.length);
  };

  const formattedDate = post.createdAt?.seconds
    ? new Date(post.createdAt.seconds * 1000).toLocaleDateString('az-AZ', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
      })
    : 'İndi';

  return (
    <article className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
      
      {/* Post Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-gray-50">
        <div
          onClick={() => onNavigateUser?.(post.userId)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src={authorAvatar}
            alt={post.authorName}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-100 group-hover:ring-emerald-400 transition"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-black text-sm text-gray-900 group-hover:text-emerald-700 transition">
                {post.authorName || 'Fermer'}
              </h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Aqrar İcma
              </span>
            </div>
            <p className="text-[11px] text-gray-400">{formattedDate}</p>
          </div>
        </div>

        {isOwner && (
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(v => !v); }}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-20 animate-fadeIn">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit?.(post); }}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Redaktə et
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Sil
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Text Description */}
      {post.description && (
        <div className="px-5 pt-3.5 pb-2 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
          {post.description}
        </div>
      )}

      {/* Post Tags */}
      {Array.isArray(post.tags) && post.tags.length > 0 && (
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {post.tags.map((t, i) => (
            <span
              key={i}
              className="text-xs font-bold text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 px-2.5 py-0.5 rounded-md transition"
            >
              #{t.replace(/^#/, '')}
            </span>
          ))}
        </div>
      )}

      {/* Post Images Carousel */}
      {images.length > 0 && (
        <div
          onClick={() => onOpenModal?.(post)}
          className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gray-950 overflow-hidden cursor-pointer group"
        >
          <img
            src={images[currentImg]}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs opacity-80 hover:opacity-100 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs opacity-80 hover:opacity-100 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === currentImg ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Post Action Footer */}
      <div className="p-4 sm:px-5 mt-auto flex items-center justify-between border-t border-gray-100 bg-gray-50/40">
        <div className="flex items-center gap-4">
          
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs font-black transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => onOpenModal?.(post)}
            className="flex items-center gap-1.5 text-xs font-black text-gray-600 hover:text-emerald-700 transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.commentsCount || 0}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-black text-gray-600 hover:text-blue-600 transition"
            title="Linki kopyala"
          >
            <Share2 className="w-5 h-5" />
            <span>{shareCount}</span>
          </button>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 p-1.5 px-2 rounded-xl transition ${
            isSaved ? 'text-emerald-700 bg-emerald-50' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
          }`}
          title="Yadda saxla"
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          <span className="text-xs font-black">{savesCount}</span>
        </button>
      </div>

    </article>
  );
}
