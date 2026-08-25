/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Users, Plus, Loader2, Search, Filter,
  Sparkles, RefreshCw, MessageSquare, TrendingUp, Compass, Award,
  Flame, HelpCircle, ShieldCheck, Share2, Tag, ArrowRight,
  Send, Image as ImageIcon, MessageCircle
} from 'lucide-react';
import { getPostsApi, checkUserLikesSavesApi, getUsersByIdsApi } from '../services/apiService';
import { PostCard } from '../components/PostCard';
import { PostModal } from '../components/PostModal';

const FEED_TAGS = [
  'Hamısı', 'taxıl', 'traktor', 'gübrə', 'suvarma',
  'istixana', 'məsləhət', 'heyvandarlıq', 'aqroiqlim', 'toxum', 'pambıq'
];

const TRENDING_TOPICS = [
  { tag: '', count: '', label: '' }  
];

export function SocialFeedPage({ onNavigateUser, currentUser, onEditPost, onShowToast }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTag, setSelectedTag] = useState('Hamısı');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [userLikes, setUserLikes] = useState([]);
  const [userSaves, setUserSaves] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const p = await getPostsApi({ force: true });
      setPosts(p || []);

      if (currentUser?.id) {
        const stats = await checkUserLikesSavesApi(currentUser.id, { force: true });
        setUserLikes(stats.likedPostIds || []);
        setUserSaves(stats.savedPostIds || []);
      }
    } catch (err) {
      console.error('SocialFeedPage loadData error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    const handleRefresh = () => loadData(true);
    window.addEventListener('refreshPosts', handleRefresh);
    return () => window.removeEventListener('refreshPosts', handleRefresh);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesTag = selectedTag === 'Hamısı' ||
      (Array.isArray(post.tags) && post.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase()));
    
    const matchesSearch = !searchQuery.trim() ||
      (post.description && post.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.authorName && post.authorName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTag && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10 space-y-8 animate-fadeIn">
      
      {/* Feed Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Azərbaycan Aqrar Şəbəkəsi
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">Fermerlərin Təcrübə & Paylaşım Mərkəzi</h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Respublikanın hər yerindən fermerlərin əkin, dərmanlama, gübrələmə və texnika təcrübələrini canlı izləyin və ya öz təsərrüfatınızdan paylaşın.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="p-3 bg-white/15 hover:bg-white/25 rounded-2xl backdrop-blur-md transition text-white"
              title="Yenilə"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => onEditPost?.(null)}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-gray-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              Paylaşım Et
            </button>
          </div>
        </div>
      </div>

      {/* 3-Column Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Quick Filter Tags (Desktop Only) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
          
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="font-black text-sm text-gray-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600" /> Mövzu Taqları
            </h3>
            <div className="flex flex-col gap-1">
              {FEED_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    selectedTag === tag
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-gray-600 hover:bg-emerald-50/60 hover:text-emerald-800'
                  }`}
                >
                  {tag === 'Hamısı' ? '🌱 Bütün Paylaşımlar' : `#${tag}`}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-3xl border border-emerald-100 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Faydalı Qayda
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              Məhsul xəstəliyi və ya torpaq problemi barədə sual verərkən aydın fotoşəkillər əlavə etmək cavabların sürətini və dəqiqliyini artırır.
            </p>
          </div>

        </aside>

        {/* Center Column: Main Feed */}
        <main className="lg:col-span-6 space-y-6">
          
          {/* Quick Create Post Bar */}
          <div
            onClick={() => onEditPost?.(null)}
            className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-emerald-300 transition group"
          >
            <img
              src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'U')}&background=10b981&color=fff`}
              alt=""
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-100 shrink-0"
            />
            <div className="flex-1 py-2.5 px-4 bg-gray-50 group-hover:bg-emerald-50/50 rounded-2xl text-xs sm:text-sm text-gray-400 transition">
              Təsərrüfatınızdan nə xəbər var? Fikir və ya sualınızı yazın...
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition shrink-0">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>

          {/* Search & Mobile Tags Filter */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Paylaşım məzmunu və ya fermer adına görə axtarın..."
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm outline-none focus:bg-white focus:border-emerald-500 transition"
              />
            </div>

            {/* Mobile Tag Slider */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {FEED_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedTag === tag
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag === 'Hamısı' ? 'Hamısı' : `#${tag}`}
                </button>
              ))}
            </div>
          </div>

          {/* Posts List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin mb-3 text-emerald-600" />
              <p className="text-sm font-bold text-gray-600">Paylaşımlar yüklənir...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-3">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-base font-black text-gray-800">Heç bir paylaşım tapılmadı</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {searchQuery || selectedTag !== 'Hamısı'
                  ? 'Axtarış filtrinə uyğun paylaşım tapılmadı. Filtri sıfırlayıb yenidən yoxlayın.'
                  : 'İlk paylaşımı edərək aqrar təcrübənizi digər fermerlərlə bölüşün!'}
              </p>
              <button
                onClick={() => onEditPost?.(null)}
                className="mt-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition"
              >
                İndi Paylaşım Et
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map(post => (
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
          )}

        </main>

        {/* Right Column: Trending Topics & Agrarian Help (Desktop Only) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
          
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-black text-sm text-gray-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" /> Trend Müzakirələr
            </h3>
            
            <div className="space-y-3">
              {TRENDING_TOPICS.map((topic, i) => (
                <div
                  key={i}
                  onClick={() => { setSelectedTag(topic.tag); window.scrollTo({ top: 200, behavior: 'smooth' }); }}
                  className="p-3 bg-gray-50 hover:bg-emerald-50/60 rounded-2xl cursor-pointer transition"
                >
                  <div className="font-black text-xs text-emerald-800">#{topic.tag}</div>
                  <div className="text-[11px] text-gray-500 font-medium">{topic.label}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{topic.count}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="font-black text-sm text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Aqrar İcma Qaydaları
            </h3>
            <ul className="text-xs text-gray-600 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                Hörmətli və konstruktiv aqrar müzakirələr aparın.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                Real sahə fotoşəkilləri paylaşaraq digər fermerlərə kömək edin.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                Tövsiyə olunan dərmanlama dozalarına diqqət yetirin.
              </li>
            </ul>
          </div>

        </aside>

      </div>

      {/* Post Detail Modal */}
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

export default SocialFeedPage;
