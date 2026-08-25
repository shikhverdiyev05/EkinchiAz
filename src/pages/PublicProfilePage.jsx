/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  getUserProfileApi, getUserPostsApi, getUserProductsApi,
  checkUserLikesSavesApi, toggleFollowApi
} from '../services/apiService';
import { PostCard } from '../components/PostCard';
import { PostModal } from '../components/PostModal';
import ProductCard from '../components/ProductCard';
import {
  MapPin, Calendar, Users, Loader2,
  UserCheck, UserMinus, Grid3X3, ArrowLeft,
  FileText, Share2, ShieldCheck, Phone, Mail,
  Sparkles, CheckCircle2, MessageSquare, PackageSearch
} from 'lucide-react';

export function PublicProfilePage({
  userId,
  onNavigate,
  onNavigateUser,
  currentUser,
  onEditPost,
  onShowToast,
  onViewDetails,
  onAddToCart,
  onToggleFavorite,
  favorites = []
}) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [followCount, setFollowCount] = useState(0);
  const [userLikes, setUserLikes] = useState([]);
  const [userSaves, setUserSaves] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const prof = await getUserProfileApi(userId, { force: true });
      if (!prof) {
        onShowToast?.('İstifadəçi profili tapılmadı');
        onNavigate?.('social');
        return;
      }
      setProfile(prof);
      setFollowCount(prof.followersCount || prof.followers || 0);

      const [userPosts, userProducts] = await Promise.all([
        getUserPostsApi(userId, { force: true }),
        getUserProductsApi(userId)
      ]);
      setPosts(userPosts || []);
      setProducts(userProducts || []);

      if (currentUser?.id) {
        const stats = await checkUserLikesSavesApi(currentUser.id, { force: true });
        setUserLikes(stats.likedPostIds || []);
        setUserSaves(stats.savedPostIds || []);
        setIsFollowing((stats.followingIds || []).includes(userId));
      }
    } catch (err) {
      console.error('PublicProfilePage loadData error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    const onRefresh = () => loadData();
    window.addEventListener('refreshPosts', onRefresh);
    return () => window.removeEventListener('refreshPosts', onRefresh);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, currentUser?.id]);

  const handleFollow = async () => {
    if (!currentUser) {
      onShowToast?.('İzləmək üçün daxil olun');
      return;
    }
    if (currentUser.id === userId) return;

    setFollowLoading(true);
    const next = !isFollowing;
    setIsFollowing(next);
    setFollowCount(c => next ? c + 1 : Math.max(0, c - 1));
    try {
      await toggleFollowApi(currentUser.id, userId, next);
      onShowToast?.(next ? `${profile.name} izlənilir` : 'İzləmədən çıxarıldı');
    } catch (err) {
      console.error('Follow error:', err);
      setIsFollowing(!next);
      setFollowCount(c => !next ? c + 1 : Math.max(0, c - 1));
      onShowToast?.('Xəta baş verdi');
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="text-xs font-bold text-gray-500">Profil yüklənir...</p>
      </div>
    );
  }

  if (!profile) return null;

  const avatarUrl = profile.avatar || profile.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'U')}&background=10b981&color=fff&size=200`;

  const isOwn = currentUser?.id === userId;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8 animate-fadeIn">

      {/* Back button */}
      <button
        onClick={() => onNavigate?.('social')}
        className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-500 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Aqrar Paylaşımlara Qayıt
      </button>

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Cover banner */}
        <div className="h-36 sm:h-52 bg-gradient-to-r from-emerald-700 via-teal-700 to-green-800 relative">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[size:16px_16px]" />
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 sm:-mt-14 mb-4">
            <div className="relative">
              <img
                src={avatarUrl}
                alt={profile.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-white shadow-xl bg-white"
              />
            </div>

            <div className="flex gap-3 sm:mb-2">
              {!isOwn && currentUser && (
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 ${
                    isFollowing
                      ? 'bg-gray-100 text-gray-800 hover:bg-red-50 hover:text-red-700'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {followLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isFollowing ? (
                    <><UserMinus className="w-4 h-4" /> İzləmədən Çıx</>
                  ) : (
                    <><UserCheck className="w-4 h-4" /> İzlə</>
                  )}
                </button>
              )}

              {isOwn && (
                <button
                  onClick={() => onNavigate?.('profile')}
                  className="px-6 py-2.5 rounded-2xl font-bold text-xs sm:text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                >
                  Şəxsi Profilim
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                {profile.name} {profile.surname || ''}
              </h1>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {profile.userType === 'company' ? 'Aqro Şirkət' : 'Təsdiqlənmiş Fermer'}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-1">
              {profile.region && (
                <span className="flex items-center gap-1.5 font-medium text-gray-700">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  {profile.region}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-gray-500">
                <Calendar className="w-4 h-4 text-emerald-600" />
                {profile.createdAt?.seconds
                  ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString('az-AZ', { year: 'numeric', month: 'long' })
                  : '2024'} tarixindən platformadadır
              </span>
            </div>

            {profile.address && (
              <p className="text-xs text-gray-600 pt-1 leading-relaxed">
                {profile.address}
              </p>
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 max-w-lg gap-4 pt-5 border-t border-gray-100 text-center">
            <div className="p-2 bg-gray-50 rounded-2xl">
              <div className="text-lg sm:text-2xl font-black text-gray-900">{posts.length}</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Paylaşım</div>
            </div>
            <div className="p-2 bg-gray-50 rounded-2xl">
              <div className="text-lg sm:text-2xl font-black text-gray-900">{products.length}</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Elan</div>
            </div>
            <div className="p-2 bg-gray-50 rounded-2xl">
              <div className="text-lg sm:text-2xl font-black text-gray-900">{followCount}</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">İzləyici</div>
            </div>
            <div className="p-2 bg-gray-50 rounded-2xl">
              <div className="text-lg sm:text-2xl font-black text-gray-900">{profile.followingCount || 0}</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">İzləyir</div>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-gray-200 gap-8">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 pb-3.5 font-black text-sm border-b-2 transition ${
            activeTab === 'posts'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <Share2 className="w-4 h-4" /> Paylaşımlar ({posts.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 pb-3.5 font-black text-sm border-b-2 transition ${
            activeTab === 'products'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <FileText className="w-4 h-4" /> Elanlar ({products.length})
        </button>
      </div>

      {/* Tab 1: Posts */}
      {activeTab === 'posts' && (
        posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
            <Share2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-700">Bu istifadəçinin hələ heç bir paylaşımı yoxdur</h3>
            <p className="text-xs text-gray-400 mt-1">İstifadəçi yeni təcrübə və fikirlərini bölüşdükdə burada görünəcək.</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                isLiked={userLikes.includes(post.id)}
                isSaved={userSaves.includes(post.id)}
                onOpenModal={setSelectedPost}
                onEdit={p => onEditPost?.(p)}
                onDelete={id => setPosts(prev => prev.filter(p => p.id !== id))}
                onNavigateUser={onNavigateUser}
                currentUser={currentUser}
                onShowToast={onShowToast}
              />
            ))}
          </div>
        )
      )}

      {/* Tab 2: Products */}
      {activeTab === 'products' && (
        products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
            <PackageSearch className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-700">Aktiv elan tapılmadı</h3>
            <p className="text-xs text-gray-400 mt-1">Bu fermer və ya şirkət tərəfindən satışa çıxarılmış məhsul yoxdur.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {products.map(prod => (
              <ProductCard
                key={prod.id}
                product={prod}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
                onToggleFavorite={onToggleFavorite}
                isFavorite={(Array.isArray(favorites) ? favorites : []).includes(prod.id)}
              />
            ))}
          </div>
        )
      )}

      {/* Post Modal */}
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

    </div>
  );
}

export default PublicProfilePage;
