import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreVertical, ChevronLeft, ChevronRight, Edit2, Trash2, Check, UserPlus, UserCheck } from 'lucide-react';
import { toggleLikeApi, toggleSaveApi, deletePostApi, toggleFollowApi } from '../services/apiService';

export function PostCard({ 
  post, 
  onOpenModal, 
  onEdit, 
  onDelete, 
  isLiked: initLiked, 
  isSaved: initSaved, 
  onNavigateUser, 
  currentUser, 
  onShowToast,
  onLike,
  onSave,
  onShare,
  onFollow,
  isFollowing,
  showActions = true
}) {
  const [currentImg, setCurrentImg] = useState(0);
  const [isLiked, setIsLiked] = useState(initLiked);
  const [isSaved, setIsSaved] = useState(initSaved);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showOptions, setShowOptions] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [following, setFollowing] = useState(isFollowing || false);

  const isOwner = currentUser?.id === post.userId;

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
      setFollowing(!following);
      return;
    }
    if (!currentUser) return onShowToast?.('Evvelce daxil olun');
    if (currentUser.id === post.userId) return;
    
    const newFollowing = !following;
    setFollowing(newFollowing);
    try {
      await toggleFollowApi(currentUser.id, post.userId, newFollowing);
    } catch (error) {
      setFollowing(following);
    }
  };

  const nextImg = (e) => {
    e.stopPropagation();
    setCurrentImg(p => (p + 1) % post.images.length);
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setCurrentImg(p => (p - 1 + post.images.length) % post.images.length);
  };

  const handleDelete = async () => {
    if (!window.confirm('Postu silmek istediyinize eminsiniz?')) return;
    await deletePostApi(post.id);
    onDelete?.(post.id);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="p-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigateUser?.(post.userId)}
        >
          <img 
            src={post.authorPhoto || `https://ui-avatars.com/api/?name=${post.authorName}&background=10b981&color=fff`}
            alt={post.authorName} 
            className="w-10 h-10 rounded-full object-cover group-hover:ring-2 ring-emerald-100 transition-all"
          />
          <div>
            <h4 className="font-bold text-gray-900 text-sm group-hover:text-emerald-700 transition-colors">{post.authorName}</h4>
            <p className="text-xs text-gray-500">{new Date(post.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString('az-AZ')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isOwner && currentUser && currentUser.id !== post.userId && (
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

          {showActions && isOwner && (
            <div className="relative">
              <button onClick={() => setShowOptions(!showOptions)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                <MoreVertical className="w-5 h-5" />
              </button>
              {showOptions && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                  <button 
                    onClick={() => { setShowOptions(false); onEdit?.(post); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" /> Redakte
                  </button>
                  <button 
                    onClick={() => { setShowOptions(false); handleDelete(); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Sil
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {post.description && (
        <div className="px-4 pb-3">
          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{post.description}</p>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {post.tags.map((tag, i) => (
                <span key={i} className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {post.images && post.images.length > 0 && (
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gray-100 group cursor-pointer" onClick={() => onOpenModal?.(post)}>
          <img src={post.images[currentImg]} alt="" className="w-full h-full object-cover" />
          
          {post.images.length > 1 && (
            <>
              <button 
                onClick={prevImg}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextImg}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {post.images.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImg ? 'bg-white scale-125' : 'bg-white/50'}`} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="p-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex gap-4">
          <button onClick={handleLike} className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} /> {likesCount}
          </button>
          <button onClick={() => onOpenModal?.(post)} className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors">
            <MessageCircle className="w-5 h-5" /> {post.commentsCount || 0}
          </button>
          <button onClick={handleShare} className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${shareCopied ? 'text-green-500' : 'text-gray-500 hover:text-blue-600'}`}>
            {shareCopied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
            {shareCopied && <span className="text-xs">Kopyalandi</span>}
          </button>
        </div>
        <button onClick={handleSave} className={`text-gray-400 hover:text-gray-900 transition-colors ${isSaved ? 'text-gray-900' : ''}`}>
          <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
}