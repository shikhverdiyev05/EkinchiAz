/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  X, Heart, MessageCircle, Share2, Bookmark,
  ChevronLeft, ChevronRight, Send, Trash2, Loader2, Sparkles,
  ShieldCheck, ArrowRight
} from 'lucide-react';
import {
  getCommentsApi, addCommentApi, deleteCommentApi,
  toggleLikeApi, toggleSaveApi
} from '../services/apiService';

export function PostModal({
  post,
  isOpen,
  onClose,
  isLiked: initLiked = false,
  isSaved: initSaved = false,
  onNavigateUser,
  currentUser,
  onShowToast
}) {
  const [currentImg, setCurrentImg] = useState(0);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(initLiked);
  const [isSaved, setIsSaved] = useState(initSaved);
  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(post?.commentsCount || 0);

  const [prevOpen, setPrevOpen] = useState(false);
  const [prevPostId, setPrevPostId] = useState(post?.id);
  if (isOpen && (!prevOpen || post?.id !== prevPostId)) {
    setCurrentImg(0);
    setLoadingComments(true);
    setPrevOpen(true);
    setPrevPostId(post?.id);
  } else if (!isOpen && prevOpen) {
    setPrevOpen(false);
  }

  const loadComments = async () => {
    try {
      const data = await getCommentsApi(post.id);
      setComments(data || []);
    } catch (err) {
      console.error('loadComments error:', err);
    } finally {
      setLoadingComments(false);
    }
  };


  useEffect(() => {
    if (isOpen && post?.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadComments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, post?.id]);

  if (!isOpen || !post) return null;

  const images = Array.isArray(post.images) ? post.images : [];
  const authorAvatar = post.authorPhoto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName || 'Fermer')}&background=10b981&color=fff`;

  const handleLike = async () => {
    if (!currentUser) {
      onShowToast?.('Bəyənmək üçün daxil olun');
      return;
    }
    const next = !isLiked;
    setIsLiked(next);
    setLikesCount(p => next ? p + 1 : Math.max(0, p - 1));
    await toggleLikeApi(post.id, currentUser.id, next);
  };

  const handleSave = async () => {
    if (!currentUser) {
      onShowToast?.('Yadda saxlamaq üçün daxil olun');
      return;
    }
    const next = !isSaved;
    setIsSaved(next);
    await toggleSaveApi(post.id, currentUser.id, next);
    onShowToast?.(next ? 'Yadda saxlanılanlara əlavə edildi' : 'Yadda saxlanılanlardan çıxarıldı');
  };

  const handleShare = () => {
    const url = `${window.location.origin}/?post=${post.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      onShowToast?.('Paylaşım linki kopyalandı!');
    } else {
      onShowToast?.(url);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const clean = commentText.trim();
    if (!clean) return;
    if (!currentUser) {
      onShowToast?.('Şərh yazmaq üçün daxil olun');
      return;
    }

    setSubmittingComment(true);
    try {
      const payload = {
        postId: post.id,
        userId: currentUser.id,
        authorName: currentUser.name || 'Fermer',
        authorPhoto: currentUser.avatar || null,
        text: clean,
      };
      const created = await addCommentApi(payload);
      setComments(prev => [...prev, created]);
      setCommentText('');
      setCommentsCount(prev => prev + 1);
      onShowToast?.('Şərhiniz əlavə olundu');
    } catch (err) {
      console.error('addComment error:', err);
      onShowToast?.('Şərh əlavə edilərkən xəta baş verdi');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteCommentApi(commentId, post.id);
      setComments(prev => prev.filter(c => c.id !== commentId));
      setCommentsCount(prev => Math.max(0, prev - 1));
      onShowToast?.('Şərh silindi');
    } catch (err) {
      console.error('deleteComment error:', err);
      onShowToast?.('Şərh silinmədi');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-gray-950/85 backdrop-blur-md animate-fadeIn">
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition z-50 shadow-lg"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="bg-white w-full h-full max-h-[92vh] sm:max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-emerald-950/20">
        
        {/* Left Side: Images Carousel */}
        <div className="w-full md:w-[55%] bg-gray-950 flex items-center justify-center relative min-h-[260px] md:min-h-[520px]">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImg]}
                alt=""
                className="max-w-full max-h-[60vh] md:max-h-[85vh] object-contain transition-all duration-300"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImg(p => (p - 1 + images.length) % images.length)}
                    className="absolute left-3 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition shadow-md"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setCurrentImg(p => (p + 1) % images.length)}
                    className="absolute right-3 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition shadow-md"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-xs">
                    {images.map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === currentImg ? 'bg-emerald-400 scale-125' : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-emerald-300">
              <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-60" />
              <p className="text-sm font-bold">Mətn və ya Məsləhət Paylaşımı</p>
            </div>
          )}
        </div>

        {/* Right Side: Author, Content, Comments, Form */}
        <div className="w-full md:w-[45%] flex flex-col h-full bg-white relative">
          
          {/* Post Author Bar */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/30">
            <div
              onClick={() => { onClose(); onNavigateUser?.(post.userId); }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img
                src={authorAvatar}
                alt={post.authorName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-200 group-hover:ring-emerald-400 transition"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-sm text-gray-900 group-hover:text-emerald-700 transition">
                    {post.authorName || 'Fermer'}
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    İcma
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  {post.createdAt?.seconds ? new Date(post.createdAt.seconds * 1000).toLocaleDateString('az-AZ') : 'İndi'}
                </p>
              </div>
            </div>
          </div>

          {/* Description & Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Description */}
            {post.description && (
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {post.description}
              </div>
            )}

            {/* Tags */}
            {Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((t, idx) => (
                  <span key={idx} className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                    #{t.replace(/^#/, '')}
                  </span>
                ))}
              </div>
            )}

            {/* Comments Divider */}
            <div className="pt-2">
              <h5 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
                Şərhlər ({commentsCount > 0 && commentsCount !== comments.length ? commentsCount : comments.length})
              </h5>

              {loadingComments ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400 font-bold">
                  Hələ heç bir şərh yazılmayıb. İlk fikri siz bildirin!
                </div>
              ) : (
                <div className="space-y-3">
                  {comments.map((c) => {
                    const isMyComment = currentUser?.id && (currentUser.id === c.userId || currentUser.id === post.userId);
                    return (
                      <div key={c.id} className="flex gap-2.5 group">
                        <img
                          src={c.authorPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.authorName || 'U')}&background=10b981&color=fff`}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover mt-1 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="bg-gray-50 hover:bg-gray-100/70 p-3 rounded-2xl rounded-tl-xs transition border border-gray-100">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-black text-xs text-gray-900 truncate">{c.authorName}</span>
                              <span className="text-[10px] text-gray-400 shrink-0">
                                {c.createdAt ? new Date(c.createdAt).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' }) : ''}
                              </span>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{c.text}</p>
                          </div>

                          {isMyComment && (
                            <button
                              onClick={() => handleDeleteComment(c.id)}
                              className="text-[10px] font-bold text-red-500 hover:text-red-700 ml-2 mt-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              Sil
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Actions & Comment Input Form */}
          <div className="p-4 border-t border-gray-100 bg-white space-y-3">
            
            {/* Quick Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 text-xs font-black transition ${
                    isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{likesCount}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="text-gray-600 hover:text-blue-600 transition"
                  title="Linki kopyala"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleSave}
                className={`p-1.5 rounded-xl transition ${
                  isSaved ? 'text-emerald-700 bg-emerald-50' : 'text-gray-400 hover:text-gray-700'
                }`}
                title="Yadda saxla"
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Fikrinizi və ya sualınızı yazın..."
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:bg-white focus:border-emerald-500 transition"
              />
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs disabled:opacity-50 transition flex items-center justify-center"
              >
                {submittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>

          </div>

        </div>
      </div>
    </div>
  );
}

export default PostModal;
