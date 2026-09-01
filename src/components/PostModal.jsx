/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Heart, MessageCircle, Share2, Bookmark,
  ChevronLeft, ChevronRight, Send, Trash2, Loader2, Sparkles,
  ShieldCheck, ArrowRight , ArrowLeft
} from 'lucide-react';
import {
  getCommentsApi, addCommentApi, deleteCommentApi,
  toggleLikeApi, toggleSaveApi, toggleFollowApi,
  checkUserLikesSavesApi, updatePostApi
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
  const [savesCount, setSavesCount] = useState(post?.savesCount || 0);
  const [shareCount, setShareCount] = useState(post?.shareCount || 0);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const [prevOpen, setPrevOpen] = useState(false);
  const [prevPostId, setPrevPostId] = useState(post?.id);
  if (isOpen && (!prevOpen || post?.id !== prevPostId)) {
    setCurrentImg(0);
    setLoadingComments(true);
    setIsDescExpanded(false);
    setLikesCount(post?.likesCount || 0);
    setCommentsCount(post?.commentsCount || 0);
    setSavesCount(post?.savesCount || 0);
    setShareCount(post?.shareCount || 0);
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

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Sync like/save/follow status from Firestore when post changes
  useEffect(() => {
    if (!isOpen || !post?.id || !currentUser?.id) return;
    checkUserLikesSavesApi(currentUser.id, { force: true }).then(stats => {
      setIsLiked(stats.likedPostIds?.includes(post.id) ?? initLiked);
      setIsSaved(stats.savedPostIds?.includes(post.id) ?? initSaved);
      setIsFollowing(stats.followingIds?.includes(post.userId) ?? false);
    }).catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, post?.id, currentUser?.id]);

  useEffect(() => {
    if (isOpen && post?.id) {
      loadComments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, post?.id]);

  if (!isOpen || !post) return null;

  const images = Array.isArray(post.images) ? post.images : [];
  const authorAvatar = post.authorPhoto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(post.authorName || 'Fermer')}&background=10b981&color=fff`;

  const handleLike = async () => {
    if (!currentUser?.id) {
      onShowToast?.('Bəyənmək üçün daxil olun');
      return;
    }
    const next = !isLiked;
    setIsLiked(next);
    setLikesCount(p => next ? p + 1 : Math.max(0, p - 1));
    await toggleLikeApi(post.id, currentUser.id, next);
  };

  const handleSave = async () => {
    if (!currentUser?.id) {
      onShowToast?.('Yadda saxlamaq üçün daxil olun');
      return;
    }
    const next = !isSaved;
    setIsSaved(next);
    setSavesCount(p => next ? p + 1 : Math.max(0, p - 1));
    await toggleSaveApi(post.id, currentUser.id, next);
    onShowToast?.(next ? 'Yadda saxlanılanlara əlavə edildi' : 'Yadda saxlanılanlardan çıxarıldı');
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post.id}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
      onShowToast?.('Paylaşım linki kopyalandı!');
      setShareCount(p => p + 1);
      // Increment shareCount in Firestore
      await updatePostApi(post.id, { shareCount: (post.shareCount || 0) + 1 }).catch(() => {});
    } catch {
      onShowToast?.(url);
    }
  };

  const handleFollow = async () => {
    if (!currentUser?.id) {
      onShowToast?.('İzləmək üçün daxil olun');
      return;
    }
    if (followLoading) return;
    setFollowLoading(true);
    const next = !isFollowing;
    setIsFollowing(next);
    await toggleFollowApi(currentUser.id, post.userId, next);
    onShowToast?.(next ? 'İzləməyə başladınız' : 'İzləməni dayandırdınız');
    setFollowLoading(false);
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


  const formattedDate = post.createdAt?.seconds 
    ? new Date(post.createdAt.seconds * 1000).toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' }) 
    : 'İndi';

  const authorBar = (
    <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
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
            {post.userType === 'company' && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                İcma
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 font-medium">
            {formattedDate}
          </p>
        </div>
      </div>
      
      {/* Follow Button */}
      {currentUser && currentUser.id !== post.userId && (
        <button 
          onClick={handleFollow}
          disabled={followLoading}
          className={`text-xs font-bold px-4 py-1.5 rounded-full transition ${
            isFollowing 
              ? 'text-gray-600 bg-gray-100 hover:bg-gray-200' 
              : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
          } disabled:opacity-50`}
        >
          {followLoading ? '...' : isFollowing ? 'İzlənilir' : 'İzlə'}
        </button>
      )}
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black/90 backdrop-blur-sm sm:p-4 md:p-6 lg:p-8 animate-fadeIn">
      {/* Page Header */}
      <div className="w-full flex items-center justify-between p-4 bg-white md:hidden border-b border-gray-100">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Geri qayıt</span>
        </button>
        <span className="font-black text-emerald-700 flex items-center gap-1">
          <Sparkles className="w-4 h-4" />
          Aqrar Paylaşım
        </span>
      </div>

      <div className="relative w-full max-w-[1200px] mx-auto bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:h-[85vh] flex-1">
        
        {/* Desktop Close Button */}
        <div className="hidden md:flex absolute top-4 right-4 z-50">
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition shadow-xl border border-gray-600"
            title="Bağla"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full">
          
          {/* Mobile Author Bar */}
          <div className="block md:hidden">
            {authorBar}
          </div>

          {/* Left Side: Images Carousel + Action Bar below image */}
          {images.length > 0 && (
            <div className="w-full sm:h-auto md:w-[60%] flex flex-col bg-black relative shrink-0 sm:shrink border-r border-gray-100">
              {/* Image area */}
              <div className="flex-1 min-h-0 relative flex flex-col justify-center overflow-hidden">
                <img
                  src={images[currentImg]}
                  alt=""
                  className="w-full h-auto object-contain max-h-[55vh] md:max-h-[75vh]"
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImg(p => (p - 1 + images.length) % images.length)}
                      className="absolute left-3 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition shadow-lg"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setCurrentImg(p => (p + 1) % images.length)}
                      className="absolute right-3 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition shadow-lg"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 px-3 py-2 rounded-full backdrop-blur-md">
                      {images.map((_, i) => (
                        <span
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            i === currentImg ? 'bg-emerald-400 w-4' : 'bg-white/50 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Action Bar — directly below image */}
              <div className="bg-white p-3 sm:p-4 border-t border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 text-sm font-black transition ${
                      isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{likesCount}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 text-sm font-black text-gray-600 hover:text-blue-600 transition"
                    title="Linki kopyala"
                  >
                    <Share2 className="w-6 h-6" />
                    <span>{shareCount}</span>
                  </button>
                </div>

                <button
                  onClick={handleSave}
                  className={`flex items-center gap-1.5 p-1.5 px-3 rounded-xl transition ${
                    isSaved ? 'text-emerald-700 bg-emerald-50' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                  title="Yadda saxla"
                >
                  <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
                  <span className="text-sm font-black">{savesCount}</span>
                </button>
              </div>
            </div>
          )}

          {/* Right Side: Content */}
          <div className={`w-full flex flex-col min-h-0 flex-1 bg-white relative ${images.length > 0 ? 'md:w-[40%]' : 'md:w-full max-w-2xl mx-auto'}`}>
            
            {/* Desktop Author Bar */}
            <div className="hidden md:block">
              {authorBar}
            </div>

            {/* Scrollable Area (Description -> Comments) */}
            <div className="flex-1 overflow-y-auto flex flex-col">

              {/* Description & Tags */}
              {(post.description || (post.tags && post.tags.length > 0)) && (
                <div className="p-4 border-b border-gray-50 space-y-3 bg-gray-50/30">
                  {post.description && (
                    <div className="text-sm text-gray-800 leading-relaxed">
                      <p className={!isDescExpanded ? 'line-clamp-3' : 'whitespace-pre-wrap'}>
                        {post.description}
                      </p>
                      {post.description.length > 100 && (
                        <button
                          onClick={() => setIsDescExpanded(v => !v)}
                          className="text-emerald-600 hover:text-emerald-700 font-bold mt-1 text-xs transition"
                        >
                          {isDescExpanded ? 'Daha az göstər' : '... daha çox göstər'}
                        </button>
                      )}
                    </div>
                  )}
                  {Array.isArray(post.tags) && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((t, idx) => (
                        <span key={idx} className="text-xs font-bold text-emerald-700 bg-emerald-100/50 px-2.5 py-1 rounded-md">
                          #{t.replace(/^#/, '')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Comments List */}
              <div className="p-4 space-y-4">
                <h5 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                  Şərhlər ({commentsCount > 0 && commentsCount !== comments.length ? commentsCount : comments.length})
                </h5>

                {loadingComments ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                    <p className="text-xs font-bold text-gray-400">Hələ heç bir şərh yazılmayıb. İlk fikri siz bildirin!</p>
                  </div>
                ) : (
                  <div className="space-y-4 pb-4">
                    {comments.map((comment, idx) => (
                      <div key={comment.id || idx} className="flex gap-3">
                        <img
                          src={comment.authorPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.authorName || 'U')}&background=10b981&color=fff`}
                          alt=""
                          onClick={() => { onClose(); onNavigateUser?.(comment.userId); }}
                          className="w-8 h-8 rounded-full object-cover shrink-0 cursor-pointer hover:ring-2 ring-emerald-200 transition"
                        />
                        <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-none p-3 relative group">
                          <h6 
                            onClick={() => { onClose(); onNavigateUser?.(comment.userId); }}
                            className="text-xs font-black text-gray-900 mb-0.5 cursor-pointer hover:text-emerald-700 transition inline-block"
                          >
                            {comment.authorName || 'İstifadəçi'}
                          </h6>
                          <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {comment.text}
                          </p>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            {comment.createdAt?.seconds 
                              ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString('az-AZ') 
                              : ''}
                          </span>
                          
                          {/* Delete Comment */}
                          {(comment.userId === currentUser?.id || post.userId === currentUser?.id) && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Comment Form (Fixed at bottom) */}
            <div className="p-4 border-t border-gray-100 bg-white shrink-0">
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Fikrinizi və ya sualınızı yazın..."
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-emerald-500 transition"
                />
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm disabled:opacity-50 transition flex items-center justify-center"
                >
                  {submittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default PostModal;
