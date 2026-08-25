import { useState, useEffect, useCallback } from 'react';
import { Users, Plus, Loader2 } from 'lucide-react';
import { getPostsApi, checkUserLikesSavesApi, toggleLikeApi, toggleSaveApi, toggleFollowApi } from '../services/apiService';
import { PostCard } from '../components/PostCard';
import { PostModal } from '../components/PostModal';
import { CreatePostModal } from '../components/CreatePostModal';

export function SocialFeedPage({ onNavigateUser, currentUser, onShowToast }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [userLikes, setUserLikes] = useState([]);
  const [userSaves, setUserSaves] = useState([]);
  const [userFollows, setUserFollows] = useState([]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const p = await getPostsApi();
      setPosts(p);

      if (currentUser) {
        const stats = await checkUserLikesSavesApi(currentUser.id);
        setUserLikes(stats.likedPostIds);
        setUserSaves(stats.savedPostIds);
        setUserFollows(stats.followingIds);
      }
    } catch (error) {
      console.error('loadData error:', error);
      onShowToast?.('Paylaşımlar yüklənərkən xəta baş verdi');
    } finally {
      setLoading(false);
    }
  }, [currentUser, onShowToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLike = async (postId) => {
    if (!currentUser) return onShowToast?.('Əvvəlcə daxil olun');
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const newLiked = !userLikes.includes(postId);
    setUserLikes(prev => newLiked ? [...prev, postId] : prev.filter(id => id !== postId));
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likesCount: newLiked ? (p.likesCount || 0) + 1 : (p.likesCount || 0) - 1 } : p));
    
    try {
      await toggleLikeApi(postId, currentUser.id, newLiked);
    } catch (error) {
      setUserLikes(prev => newLiked ? prev.filter(id => id !== postId) : [...prev, postId]);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likesCount: newLiked ? (p.likesCount || 0) - 1 : (p.likesCount || 0) + 1 } : p));
      onShowToast?.('Bəyənənlər siyahısı yenilənərkən xəta baş verdi');
    }
  };

  const handleSave = async (postId) => {
    if (!currentUser) return onShowToast?.('Əvvəlcə daxil olun');
    const newSaved = !userSaves.includes(postId);
    setUserSaves(prev => newSaved ? [...prev, postId] : prev.filter(id => id !== postId));
    
    try {
      await toggleSaveApi(postId, currentUser.id, newSaved);
    } catch (error) {
      setUserSaves(prev => newSaved ? prev.filter(id => id !== postId) : [...prev, postId]);
      onShowToast?.('Yadda saxlama yenilənərkən xəta baş verdi');
    }
  };

  const handleShare = (postId) => {
    navigator.clipboard.writeText(window.location.origin + '/?post=' + postId);
    onShowToast?.('Link kopyalandı');
  };

  const handleFollow = async (authorId) => {
    if (!currentUser) return onShowToast?.('Əvvəlcə daxil olun');
    if (currentUser.id === authorId) return;
    
    const newFollowing = !userFollows.includes(authorId);
    setUserFollows(prev => newFollowing ? [...prev, authorId] : prev.filter(id => id !== authorId));
    
    try {
      await toggleFollowApi(currentUser.id, authorId, newFollowing);
    } catch (error) {
      setUserFollows(prev => newFollowing ? prev.filter(id => id !== authorId) : [...prev, authorId]);
      onShowToast?.('İzləmə yenilənərkən xəta baş verdi');
    }
  };

  const isFollowing = (authorId) => userFollows.includes(authorId);

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-24 lg:pb-16 animate-fadeIn">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 text-white relative overflow-hidden shadow-md">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-emerald-100 border border-white/20 inline-block">
            Sosial Sebeke
          </span>
          <h1 className="text-2xl sm:text-4xl font-black mt-2 tracking-tight">
            Fermer Paylasimlari
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1.5 leading-relaxed">
            Aqrar icmanin tecrube ve fikirlari. Tecrube paylasin, sual verin, birlikde inkisaf edek.
          </p>
        </div>
      </div>

      {/* Create Post Button & Posts Grid */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-gray-900">Paylasimlar</h2>
        <button 
          onClick={() => { if (!currentUser) return onShowToast?.('Əvvəlcə daxil olun'); setIsCreateOpen(true); }}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> Yeni Paylasim
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
          <p>Yuklenir...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <p className="text-gray-500">Hele hec bir paylasim yoxdur.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post}
              isLiked={userLikes.includes(post.id)}
              isSaved={userSaves.includes(post.id)}
              isFollowing={isFollowing(post.userId)}
              onOpenModal={setSelectedPost}
              onNavigateUser={onNavigateUser}
              currentUser={currentUser}
              onShowToast={onShowToast}
              onLike={handleLike}
              onSave={handleSave}
              onShare={handleShare}
              onFollow={handleFollow}
              showActions={false}
            />
          ))}
        </div>
      )}

      <CreatePostModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSuccess={loadData}
        currentUser={currentUser}
        onShowToast={onShowToast}
      />

      <PostModal 
        isOpen={!!selectedPost} 
        onClose={() => setSelectedPost(null)} 
        post={selectedPost}
        isLiked={selectedPost ? userLikes.includes(selectedPost.id) : false}
        isSaved={selectedPost ? userSaves.includes(selectedPost.id) : false}
        onNavigateUser={onNavigateUser}
        currentUser={currentUser}
        onShowToast={onShowToast}
        onLike={(id) => handleLike(id)}
        onSave={(id) => handleSave(id)}
        onShare={(id) => handleShare(id)}
        onFollow={handleFollow}
        isFollowing={selectedPost ? isFollowing(selectedPost.userId) : false}
      />
    </div>
  );
}
