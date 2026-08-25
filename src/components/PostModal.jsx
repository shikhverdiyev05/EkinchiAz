import { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, Share2, Bookmark, ChevronLeft, ChevronRight, Send, Check, UserPlus, UserCheck } from 'lucide-react';
import { getCommentsApi, addCommentApi, deleteCommentApi, toggleLikeApi, toggleSaveApi, toggleFollowApi } from '../services/apiService';

function formatCommentDate(createdAt) {
  if (!createdAt) return 'İndi';
  if (createdAt instanceof Date) return createdAt.toLocaleDateString('az-AZ');
  if (createdAt.seconds) return new Date(createdAt.seconds * 1000).toLocaleDateString('az-AZ');
  return new Date(createdAt).toLocaleDateString('az-AZ');
}

function formatPostDate(createdAt) {
  if (!createdAt) return new Date().toLocaleDateString('az-AZ');
  if (createdAt.seconds) return new Date(createdAt.seconds * 1000).toLocaleDateString('az-AZ');
  return new Date(createdAt).toLocaleDateString('az-AZ');
}

export function PostModal({ 
  post, 
  isOpen, 
  onClose, 
  isLiked: initLiked, 
  isSaved: initSaved, 
  onNavigateUser, 
  currentUser, 
  onShowToast,
  onLike,
  onSave,
  onShare,
  onFollow,
  isFollowing
}) {
  const [currentImg, setCurrentImg] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [isLiked, setIsLiked] = useState(initLiked);
  const [isSaved, setIsSaved] = useState(initSaved);
  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);
  const [shareCopied, setShareCopied] = useState(false);
  
  const getFollowingValue = () => typeof isFollowing === 'function' ? isFollowing() : (isFollowing || false);
  const [following, setFollowing] = useState(getFollowingValue);

  const loadComments = async () => {
    setLoading(true);
    const data = await getCommentsApi(post.id);
    setComments(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen && post) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadComments();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFollowing(getFollowingValue);
    }
  }, [isOpen, post, isFollowing]);

  if (!isOpen || !post) return null;

  const handleLike = async () => {
    if (onLike) {
      onLike(post.id);
      return;
    }
    if (!currentUser) return onShowToast?.('Evvelce daxil olun');
    const newState = !isLiked;
    setIsLiked(newState);
    setLikesCount(prev => newState ? prev + 1 : prev - 1);
    await toggleLikeApi(post.id, currentUser.id, newState);
  };

  const handleSave = async () => {
    if (onSave) {
      onSave(post.id);
      return;
    }
    if (!currentUser) return onShowToast?.('Evvelce daxil olun');
    setIsSaved(!isSaved);
    await toggleSaveApi(post.id, currentUser.id, !isSaved);
  };

  const handleShare = () => {
    if (onShare) {
      onShare(post.id);
      return;
    }
    navigator.clipboard.writeText(window.location.origin + '/?post=' + post.id);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleFollowClick = async () => {
    if (onFollow) {
      onFollow(post.userId);
      setFollowing(f => !f);
      return;
    }
    if (!currentUser) return onShowToast?.('Evvelce daxil olun');
    if (currentUser.id === post.userId) return;
    
    const newFollowing = !following;
    setFollowing(newFollowing);
    try {
      await toggleFollowApi(currentUser.id, post.userId, newFollowing);
    } catch {
      setFollowing(following);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    
    const commentData = {
      postId: post.id,
      userId: currentUser.id,
      authorName: currentUser.name || 'Istifadeci',
      authorPhoto: currentUser.photoURL || currentUser.avatar || null,
      text: newComment.trim(),
    };

    const added = await addCommentApi(commentData);
    setComments(prev => [...prev, added]);
    setNewComment('');
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Reyi silmek istediyinize eminsiniz?')) return;
    await deleteCommentApi(commentId);
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
      <button onClick={onClose} className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all z-50">
        <X className="w-6 h-6" />
      </button>

      <div className="bg-white w-full h-full sm:h-[85vh] sm:max-w-5xl sm:rounded-3xl flex flex-col sm:flex-row overflow-hidden shadow-2xl">
        
        <div className="w-full sm:w-[55%] bg-black relative flex items-center justify-center shrink-0">
          {post.images && post.images.length > 0 ? (
            <>
              <img src={post.images[currentImg]} alt="" className="max-h-full max-w-full object-contain" />
              
              {post.images.length > 1 && (
                <>
                  <button onClick={() => setCurrentImg(p => (p - 1 + post.images.length) % post.images.length)} className="absolute left-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={() => setCurrentImg(p => (p + 1) % post.images.length)} className="absolute right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {post.images.map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentImg ? 'bg-white scale-125' : 'bg-white/40'}`} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-emerald-50 flex items-center justify-center p-8 text-center">
              <p className="text-emerald-800 text-xl font-medium leading-relaxed">{post.description}</p>
            </div>
          )}
        </div>

        <div className="w-full sm:w-[45%] flex flex-col h-full bg-white relative">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
            <img 
              src={post.authorPhoto || `https://ui-avatars.com/api/?name=${post.authorName}&background=10b981&color=fff`} 
              className="w-10 h-10 rounded-full cursor-pointer hover:ring-2 ring-emerald-100 transition-all"
              onClick={() => { onClose(); onNavigateUser?.(post.userId); }}
            />
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 cursor-pointer" onClick={() => { onClose(); onNavigateUser?.(post.userId); }}>{post.authorName}</h4>
              <p className="text-xs text-gray-500">{formatPostDate(post.createdAt)}</p>
            </div>
            {currentUser && currentUser.id !== post.userId && (
              <button 
                onClick={handleFollowClick}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  following 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {following ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                {following ? 'Izleyir' : 'Izle'}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
            {post.images && post.images.length > 0 && post.description && (
              <div className="mb-6">
                <p className="text-gray-800 text-sm whitespace-pre-wrap">{post.description}</p>
                {post.tags && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="text-emerald-600 text-xs font-bold">#{tag.replace('#','')}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4 text-gray-400 text-sm">Yuklenir...</div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">Ilk reyi siz yazin.</div>
              ) : (
                comments.map(c => (
                  <div key={c.id} className="flex gap-3 group">
                    <img src={c.authorPhoto || `https://ui-avatars.com/api/?name=${c.authorName}&background=gray&color=fff`} className="w-8 h-8 rounded-full shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-2.5 inline-block">
                        <h5 className="font-bold text-xs text-gray-900 mb-0.5">{c.authorName}</h5>
                        <p className="text-sm text-gray-800">{c.text}</p>
                      </div>
                      <div className="flex gap-3 mt-1 ml-2 text-[10px] text-gray-400 font-medium">
                        <span>{formatCommentDate(c.createdAt)}</span>
                        {(currentUser?.id === c.userId || currentUser?.id === post.userId) && (
                          <button onClick={() => handleDeleteComment(c.id)} className="hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">Sil</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-4">
                <button onClick={handleLike} className={`transition-colors ${isLiked ? 'text-red-500' : 'text-gray-800 hover:text-gray-500'}`}>
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button className="text-gray-800 hover:text-gray-500 transition-colors">
                  <MessageCircle className="w-6 h-6" />
                </button>
                <button onClick={handleShare} className={`transition-colors ${shareCopied ? 'text-green-500' : 'text-gray-800 hover:text-gray-500'}`}>
                  {shareCopied ? <Check className="w-6 h-6" /> : <Share2 className="w-6 h-6" />}
                </button>
              </div>
              <button onClick={handleSave} className={`transition-colors ${isSaved ? 'text-gray-900' : 'text-gray-800 hover:text-gray-500'}`}>
                <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            <p className="font-bold text-sm text-gray-900 mb-4">{likesCount} beyenme</p>

            <form onSubmit={handleAddComment} className="flex items-center gap-2 relative">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Rey yazin..."
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-4 pr-12 text-sm outline-none focus:border-emerald-300 transition-colors"
              />
              <button 
                type="submit" 
                disabled={!newComment.trim()} 
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-emerald-600 disabled:text-gray-300 hover:bg-emerald-50 rounded-full transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}