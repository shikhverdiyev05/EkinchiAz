import { useState, useEffect } from 'react';
import { getUserProfileApi, getUserPostsApi, checkUserLikesSavesApi, toggleFollowApi } from '../services/apiService';
import { PostCard } from '../components/PostCard';
import { PostModal } from '../components/PostModal';
import { CreatePostModal } from '../components/CreatePostModal';
import { MapPin, Calendar, Users, Loader2 } from 'lucide-react';

export function PublicProfilePage({ userId, onNavigate, onNavigateUser, currentUser, onShowToast }) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [userLikes, setUserLikes] = useState([]);
  const [userSaves, setUserSaves] = useState([]);

  const [selectedPost, setSelectedPost] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const prof = await getUserProfileApi(userId);
    if (!prof) {
      onShowToast?.('İstifadəçi tapılmadı');
      onNavigate('social');
      return;
    }
    setProfile(prof);

    const userPosts = await getUserPostsApi(userId);
    setPosts(userPosts);

    if (currentUser) {
      const stats = await checkUserLikesSavesApi(currentUser.id);
      setUserLikes(stats.likedPostIds);
      setUserSaves(stats.savedPostIds);
      setIsFollowing(stats.followingIds.includes(userId));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [userId, currentUser]);

  const handleFollow = async () => {
    if (!currentUser) return onShowToast?.('Əvvəlcə daxil olun');
    if (currentUser.id === userId) return;
    const newState = !isFollowing;
    setIsFollowing(newState);
    await toggleFollowApi(currentUser.id, userId, newState);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <img 
          src={profile.photoURL || `https://ui-avatars.com/api/?name=${profile.name}&background=10b981&color=fff&size=200`} 
          alt={profile.name} 
          className="w-32 h-32 rounded-full object-cover ring-4 ring-emerald-50"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900 mb-2">{profile.name} {profile.surname}</h1>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile.region || 'Azərbaycan'}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {profile.createdAt ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString() : '2024'} qoşulub</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-6 mb-6">
            <div className="text-center">
              <div className="font-black text-gray-900 text-lg">{posts.length}</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Paylaşım</div>
            </div>
            <div className="text-center">
              <div className="font-black text-gray-900 text-lg">{profile.followersCount || 0}</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">İzləyici</div>
            </div>
            <div className="text-center">
              <div className="font-black text-gray-900 text-lg">{profile.followingCount || 0}</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">İzləyir</div>
            </div>
          </div>
          {currentUser && currentUser.id !== userId && (
            <button 
              onClick={handleFollow}
              className={`px-8 py-2.5 rounded-xl font-bold transition-colors ${isFollowing ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
            >
              {isFollowing ? 'İzləmədən Çıx' : 'İzlə'}
            </button>
          )}
          {currentUser && currentUser.id === userId && (
            <button onClick={() => onNavigate('profile')} className="px-8 py-2.5 rounded-xl font-bold bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors">
              Profili Redaktə Et
            </button>
          )}
        </div>
      </div>

      <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-emerald-600" /> İstifadəçinin Paylaşımları
      </h2>
      
      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
          <p className="text-gray-500">Hələ heç bir paylaşım yoxdur.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post}
              isLiked={userLikes.includes(post.id)}
              isSaved={userSaves.includes(post.id)}
              onOpenModal={setSelectedPost}
              onEdit={p => { setEditPost(p); setIsCreateOpen(true); }}
              onDelete={id => setPosts(prev => prev.filter(p => p.id !== id))}
              onNavigateUser={onNavigateUser}
              currentUser={currentUser}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      )}

      <PostModal 
        isOpen={!!selectedPost} 
        onClose={() => setSelectedPost(null)} 
        post={selectedPost}
        isLiked={selectedPost ? userLikes.includes(selectedPost.id) : false}
        isSaved={selectedPost ? userSaves.includes(selectedPost.id) : false}
        onNavigateUser={onNavigateUser}
        currentUser={currentUser}
        onShowToast={onShowToast}
      />

      <CreatePostModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        existingPost={editPost}
        onSuccess={loadData}
        currentUser={currentUser}
        onShowToast={onShowToast}
      />
    </div>
  );
}
