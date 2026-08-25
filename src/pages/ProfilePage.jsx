/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  User, FileText, Share2, Bookmark, Heart, ShoppingCart,
  Clock, MessageCircle, Users, Settings, Edit2, Loader2,
  LogOut, PackageSearch, Plus, MapPin, Camera, X, ShieldCheck
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { PostCard } from '../components/PostCard';
import { PostModal } from '../components/PostModal';
import {
  updateUserProfileApi, deleteProductApi, deleteBookingApi,
  getUserPostsApi, getSavedPostsApi, checkUserLikesSavesApi
} from '../services/apiService';
import { uploadImageToImgBB } from '../services/imageService';

const NAV_ITEMS = [
  { id: "info",      label: "Məlumatlarım",     icon: User },
  { id: "listings",  label: "Elanlarım",         icon: FileText },
  { id: "posts",     label: "Paylaşımlarım",     icon: Share2 },
  { id: "saved",     label: "Yadda Saxlananlar", icon: Bookmark },
  { id: "favorites", label: "Sevimlilər",        icon: Heart },
  { id: "rentals",   label: "İcarə Sorğuları",   icon: ShoppingCart },
  { id: "orders",    label: "Sifarişlər",        icon: Clock },
  { id: "settings",  label: "Parametrlər",       icon: Settings },
];

const REGIONS = [
  "Bakı","Sumqayıt","Gəncə","Mingəçevir","Şirvan","Lənkəran","Şəki","Bərdə",
  "Xaçmaz","Zaqatala","Quba","Qusar","Şabran","Siyəzən","Xızı","Ağdaş",
  "Göyçay","İsmayıllı","Şamaxı","Şəmkir","Tovuz","Qazax","Ağstafa","Goranboy",
  "Saatlı","Sabirabad","İmişli","Biləsuvar","Cəlilabad","Masallı","Astara",
  "Salyan","Neftçala","Naxçıvan MR"
];

function EmptyState({ icon: Icon, title, sub, cta, onCta }) {
  return (
    <div className="p-10 sm:p-14 rounded-3xl bg-white border border-gray-100 shadow-sm text-center space-y-4">
      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto">
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-gray-900 font-black text-base sm:text-lg">{title}</p>
        {sub && <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">{sub}</p>}
      </div>
      {cta && onCta && (
        <button
          onClick={onCta}
          className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 mx-auto"
        >
          <Plus className="w-4 h-4" /> {cta}
        </button>
      )}
    </div>
  );
}

// Extracted to module scope (not defined inside ProfilePage) so React sees
// a stable component type across renders — defining a component inside
// another component's render body recreates its type every render, which
// forces a full remount (lost internal state, animations, focus) instead
// of a normal update. Everything it needs is passed in as props.
function SidebarContent({
  currentAvatar,
  user,
  activeListingsCount,
  userPostsCount,
  followersCount,
  activeTab,
  setActiveTab,
  setSidebarOpen,
  userListingsCount,
  savedPostsCount,
  favoriteProductsCount,
  rentalBookingsCount,
  onLogout
}) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-gray-100 flex flex-col items-center text-center">
        <div className="relative mb-3">
          <img
            src={currentAvatar}
            alt={user?.name}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-50 shadow-md"
          />
          <button
            onClick={() => setActiveTab("settings")}
            className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full shadow-lg transition border-2 border-white"
            title="Parametrlər"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <h3 className="font-black text-gray-900 text-base sm:text-lg mb-0.5">{user?.name || "İstifadəçi"}</h3>
        <p className="text-xs text-gray-400 mb-2 truncate max-w-[200px]">{user?.email}</p>
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-100">
          {user?.userType === "company" ? "Aqro Şirkət" : "Fermer"}
        </span>

        {/* Stats Row */}
        <div className="grid grid-cols-3 w-full gap-2 mt-5 pt-5 border-t border-gray-100">
          <div className="text-center">
            <div className="font-black text-gray-900 text-base">{activeListingsCount}</div>
            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Elan</div>
          </div>
          <div className="text-center border-x border-gray-100">
            <div className="font-black text-gray-900 text-base">{userPostsCount}</div>
            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Paylaşım</div>
          </div>
          <div className="text-center">
            <div className="font-black text-gray-900 text-base">{followersCount}</div>
            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">İzləyici</div>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition ${
              activeTab === item.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-emerald-50/60 hover:text-emerald-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </div>
            {item.id === 'listings' && <span className="text-[10px] font-black opacity-80">{userListingsCount}</span>}
            {item.id === 'posts' && <span className="text-[10px] font-black opacity-80">{userPostsCount}</span>}
            {item.id === 'saved' && <span className="text-[10px] font-black opacity-80">{savedPostsCount}</span>}
            {item.id === 'favorites' && <span className="text-[10px] font-black opacity-80">{favoriteProductsCount}</span>}
            {item.id === 'rentals' && <span className="text-[10px] font-black opacity-80">{rentalBookingsCount}</span>}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition"
        >
          <LogOut className="w-4 h-4" /> Çıxış Et
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage({
  user,
  onLogout,
  userListings = [],
  rentalBookings = [],
  orders = [],
  favoriteProducts = [],
  onViewDetails,
  onAddToCart,
  onOpenRentModal,
  onOpenContactModal,
  onToggleFavorite,
  currentUser,
  onRequireAuth,
  onAddNewListing,
  onUpdateUser,
  onDeleteListing,
  onCancelRental,
  onRenewRental,
  onShowToast,
  onEditPost,
  onNavigateUser
}) {
  const [activeTab, setActiveTab] = useState("info");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [editRegion, setEditRegion] = useState(user?.region || "Bakı");
  const [editAddress, setEditAddress] = useState(user?.address || "");
  const [editUserType, setEditUserType] = useState(user?.userType || "farmer");
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [userLikes, setUserLikes] = useState([]);
  const [userSaves, setUserSaves] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const activeListingsCount = userListings.filter(p => p.inStock !== false).length;
  const followersCount = user?.followersCount || user?.followers || 0;
  const followingCount = user?.followingCount || user?.following || 0;

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=10b981&color=fff&size=200`;
  const currentAvatar = avatarPreview || user?.avatar || defaultAvatar;

  const loadUserPosts = async () => {
    if (!user?.id) return;
    setPostsLoading(true);
    try {
      const [posts, saved, stats] = await Promise.all([
        getUserPostsApi(user.id, { force: true }),
        getSavedPostsApi(user.id, { force: true }),
        checkUserLikesSavesApi(user.id, { force: true })
      ]);
      setUserPosts(posts);
      setSavedPosts(saved);
      setUserLikes(stats.likedPostIds || []);
      setUserSaves(stats.savedPostIds || []);
    } catch (err) {
      console.error('Load user posts error:', err);
    } finally {
      setPostsLoading(false);
    }
  };

  // Fetching user posts/saved/likes is a genuine side effect (talks to an
  // external API); the set-state-in-effect rule flags it because
  // loadUserPosts() calls setPostsLoading(true) before its first await, but
  // that's the standard "fetch on mount/dependency change" pattern, so it's
  // suppressed here rather than restructured away.
  useEffect(() => {
    if (user?.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadUserPosts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, activeTab]);

  useEffect(() => {
    const handleRefresh = () => {
      if (user?.id) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadUserPosts();
      }
    };
    window.addEventListener('refreshPosts', handleRefresh);
    return () => window.removeEventListener('refreshPosts', handleRefresh);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        onShowToast?.('Şəkil ölçüsü 5MB-dan kiçik olmalıdır');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsSavingProfile(true);
    try {
      let finalAvatarUrl = user?.avatar || "";
      if (avatarFile) {
        finalAvatarUrl = await uploadImageToImgBB(avatarFile);
      }
      const updateData = {
        name: editName.trim(),
        phone: editPhone.trim(),
        region: editRegion,
        address: editAddress.trim(),
        userType: editUserType,
        role: editUserType,
        avatar: finalAvatarUrl,
        photoURL: finalAvatarUrl
      };
      const updatedUser = await updateUserProfileApi(user.id, updateData);
      if (onUpdateUser) onUpdateUser(updatedUser);
      onShowToast?.("Profil məlumatlarınız uğurla yeniləndi!");
    } catch (err) {
      console.error(err);
      onShowToast?.("Profil yenilənərkən xəta baş verdi.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm("Bu elanı silmək istədiyinizdən əminsiniz?")) return;
    try {
      await deleteProductApi(prodId);
      if (onDeleteListing) onDeleteListing(prodId);
      onShowToast?.("Elan uğurla silindi");
    } catch {
      onShowToast?.("Elan silinərkən xəta baş verdi.");
    }
  };

  const handleCancelRentalBooking = async (id) => {
    if (!id) return onShowToast?.("Sorğu ID tapılmadı.");
    if (!window.confirm("Bu icarə sorğusunu ləğv etmək istədiyinizdən əminsiniz?")) return;
    try {
      await deleteBookingApi(id);
      if (onCancelRental) onCancelRental(id);
      onShowToast?.("İcarə sorğusu ləğv edildi");
    } catch (err) {
      onShowToast?.("Ləğv edilərkən xəta baş verdi");
    }
  };

  // Shared props for the SidebarContent component, used both in the mobile
  // slide-over and the desktop sticky sidebar below.
  const sidebarProps = {
    currentAvatar,
    user,
    activeListingsCount,
    userPostsCount: userPosts.length,
    followersCount,
    activeTab,
    setActiveTab,
    setSidebarOpen,
    userListingsCount: userListings.length,
    savedPostsCount: savedPosts.length,
    favoriteProductsCount: favoriteProducts.length,
    rentalBookingsCount: rentalBookings.length,
    onLogout
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">

      {/* Mobile Top Info Card */}
      <div className="md:hidden flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-3">
          <img src={currentAvatar} alt="" className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-100" />
          <div>
            <h2 className="font-black text-gray-900 text-sm">{user?.name}</h2>
            <p className="text-xs text-emerald-700 font-bold">{NAV_ITEMS.find(n => n.id === activeTab)?.label}</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="px-3.5 py-2 bg-emerald-50 text-emerald-800 rounded-2xl font-bold text-xs flex items-center gap-1.5"
        >
          <Settings className="w-4 h-4" /> Menyu
        </button>
      </div>

      {/* Mobile Sidebar Modal */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-[85%] max-w-xs bg-white h-full flex flex-col shadow-2xl animate-slideRight">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-500 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent {...sidebarProps} />
          </div>
        </div>
      )}

      <div className="flex gap-8">
        
        {/* Desktop Sticky Sidebar */}
        <div className="hidden md:block w-72 shrink-0 bg-white rounded-3xl border border-gray-100 shadow-sm h-[calc(100vh-7rem)] sticky top-24 overflow-hidden">
          <SidebarContent {...sidebarProps} />
        </div>

        {/* Main Tabs View */}
        <div className="flex-1 min-w-0">
          
          {/* TAB 1: INFO */}
          {activeTab === "info" && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <User className="w-6 h-6 text-emerald-600" /> Şəxsi Məlumatlar
                </h2>
                <button
                  onClick={() => setActiveTab("settings")}
                  className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-xs hover:bg-emerald-100 transition"
                >
                  Məlumatları Redaktə Et
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1">Ad və Soyad</span>
                  <span className="font-bold text-gray-900 text-sm">{user?.name || "Qeyd edilməyib"}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1">Email Ünvanı</span>
                  <span className="font-bold text-gray-900 text-sm">{user?.email || "Qeyd edilməyib"}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1">Əlaqə Nömrəsi</span>
                  <span className="font-bold text-gray-900 text-sm">{user?.phone || "Qeyd edilməyib"}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1">Təsərrüfat Regionu</span>
                  <span className="font-bold text-gray-900 text-sm">{user?.region || "Qeyd edilməyib"}</span>
                </div>
                <div className="sm:col-span-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1">Dəqiq Ünvan / Qeydlər</span>
                  <span className="font-bold text-gray-900 text-sm">{user?.address || "Qeyd edilməyib"}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SETTINGS */}
          {activeTab === "settings" && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
                <Settings className="w-6 h-6 text-emerald-600" /> Profil Parametrləri
              </h2>

              <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
                
                {/* Avatar change */}
                <div className="flex items-center gap-5">
                  <img src={currentAvatar} alt="" className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-100" />
                  <div>
                    <label className="cursor-pointer bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition inline-flex items-center gap-2 shadow-xs">
                      <Camera className="w-4 h-4" /> Şəkli Dəyiş
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                    <p className="text-[11px] text-gray-400 mt-1">Maks. 5MB (JPG, PNG, WEBP)</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Ad və Soyad</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Telefon</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+994 50 123 45 67"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Region</label>
                    <select
                      value={editRegion}
                      onChange={(e) => setEditRegion(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-emerald-500"
                    >
                      {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">İstifadəçi Növü</label>
                    <select
                      value={editUserType}
                      onChange={(e) => setEditUserType(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-emerald-500"
                    >
                      <option value="farmer">Fermer</option>
                      <option value="company">Aqro Şirkət</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Ünvan</label>
                    <input
                      type="text"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      placeholder="Kənd, rayon və ya küçə..."
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm shadow-md transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isSavingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                  Yadda Saxla
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: LISTINGS */}
          {activeTab === "listings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-emerald-600" /> Elanlarım ({userListings.length})
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Yerləşdirdiyiniz aqrar məhsul və texnika elanları</p>
                </div>
                <button
                  onClick={onAddNewListing}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Yeni Elan
                </button>
              </div>

              {userListings.length === 0 ? (
                <EmptyState
                  icon={PackageSearch}
                  title="Hələ heç bir elanınız yoxdur"
                  sub="Məhsullarınızı satmaq və ya icarəyə vermək üçün ilk elanınızı yerləşdirin."
                  cta="Yeni Elan Yarat"
                  onCta={onAddNewListing}
                />
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {userListings.map(prod => (
                    <div key={prod.id} className="relative group">
                      <ProductCard
                        product={prod}
                        onViewDetails={onViewDetails}
                        onAddToCart={onAddToCart}
                        onToggleFavorite={onToggleFavorite}
                        isFavorite={favoriteProducts.some(f => f.id === prod.id)}
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteProduct(prod.id); }}
                        className="absolute top-2.5 right-2.5 bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition z-10"
                        title="Elanı sil"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: POSTS */}
          {activeTab === "posts" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Share2 className="w-6 h-6 text-emerald-600" /> Paylaşımlarım ({userPosts.length})
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Aqrar icma ilə bölüşdüyünüz təcrübə və yazılar</p>
                </div>
                <button
                  onClick={() => onEditPost?.(null)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Yeni Paylaşım
                </button>
              </div>

              {postsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
              ) : userPosts.length === 0 ? (
                <EmptyState
                  icon={Share2}
                  title="Hələ heç bir paylaşımınız yoxdur"
                  sub="Təcrübənizi bölüşmək, sual vermək və ya məhsul xəbərdarlığı etmək üçün ilk paylaşımınızı edin."
                  cta="Paylaşım Et"
                  onCta={() => onEditPost?.(null)}
                />
              ) : (
                <div className="space-y-6 max-w-3xl">
                  {userPosts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      isLiked={userLikes.includes(post.id)}
                      isSaved={userSaves.includes(post.id)}
                      onOpenModal={setSelectedPost}
                      onEdit={p => onEditPost?.(p)}
                      onDelete={id => setUserPosts(prev => prev.filter(p => p.id !== id))}
                      onNavigateUser={onNavigateUser}
                      currentUser={currentUser}
                      onShowToast={onShowToast}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SAVED POSTS */}
          {activeTab === "saved" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <Bookmark className="w-6 h-6 text-emerald-600" /> Yadda Saxlanan Paylaşımlar ({savedPosts.length})
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Daha sonra oxumaq üçün saxladığınız faydalı paylaşımlar</p>
              </div>

              {savedPosts.length === 0 ? (
                <EmptyState
                  icon={Bookmark}
                  title="Saxlanılmış paylaşım yoxdur"
                  sub="Paylaşımlar bölməsindən maraqlı yazıları yadda saxlaya bilərsiniz."
                />
              ) : (
                <div className="space-y-6 max-w-3xl">
                  {savedPosts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      isLiked={userLikes.includes(post.id)}
                      isSaved={true}
                      onOpenModal={setSelectedPost}
                      onEdit={p => onEditPost?.(p)}
                      onDelete={id => setSavedPosts(prev => prev.filter(p => p.id !== id))}
                      onNavigateUser={onNavigateUser}
                      currentUser={currentUser}
                      onShowToast={onShowToast}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: FAVORITES */}
          {activeTab === "favorites" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-500 fill-current" /> Sevimli Elanlar ({favoriteProducts.length})
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Bəyəndiyiniz aqrar texnika və məhsullar</p>
              </div>

              {favoriteProducts.length === 0 ? (
                <EmptyState
                  icon={Heart}
                  title="Sevimli elan yoxdur"
                  sub="Kataloqdan bəyəndiyiniz elanları ürək işarəsinə klikləyərək buraya əlavə edə bilərsiniz."
                />
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {favoriteProducts.map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onViewDetails={onViewDetails}
                      onAddToCart={onAddToCart}
                      onToggleFavorite={onToggleFavorite}
                      isFavorite={true}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: RENTALS */}
          {activeTab === "rentals" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-emerald-600" /> İcarə Sorğuları ({rentalBookings.length})
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Göndərdiyiniz və qəbul etdiyiniz texnika icarə sifarişləri</p>
              </div>

              {rentalBookings.length === 0 ? (
                <EmptyState
                  icon={ShoppingCart}
                  title="İcarə sorğusu yoxdur"
                  sub="Traktor və aqrotexnikaları birbaşa elan səhifəsindən icarəyə götürə bilərsiniz."
                />
              ) : (
                <div className="space-y-4">
                  {rentalBookings.map(b => (
                    <div
                      key={b.id}
                      className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                    >
                      <div className="flex gap-4 items-center">
                        <img
                          src={b.productImage || "https://placehold.co/100x100"}
                          alt=""
                          className="w-16 h-16 rounded-2xl object-cover border border-gray-100"
                        />
                        <div>
                          <h4 className="font-black text-sm text-gray-900">{b.productTitle || b.title}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">İcarəçi: {b.tenantName}</p>
                          <p className="text-xs font-bold text-emerald-700 mt-1">{b.startDate} — {b.endDate}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleCancelRentalBooking(b.id)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs transition"
                        >
                          Ləğv Et
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-emerald-600" /> Sifariş Tarixçəsi ({orders.length})
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Səbət vasitəsilə rəsmiləşdirilmiş sifarişlər</p>
              </div>

              {orders.length === 0 ? (
                <EmptyState
                  icon={Clock}
                  title="Sifariş tarixçəsi boşdur"
                  sub="Məhsulları səbətə əlavə edib sifariş edə bilərsiniz."
                />
              ) : (
                <div className="space-y-4">
                  {orders.map(ord => (
                    <div key={ord.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div>
                          <span className="font-black text-xs text-gray-900">Sifariş #{ord.id?.slice(0, 8)}</span>
                          <p className="text-[11px] text-gray-400">{ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('az-AZ') : ''}</p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-black text-xs rounded-full">
                          {ord.totalAmount || 0} ₼
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

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
