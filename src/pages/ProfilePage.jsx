/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  User, FileText, Share2, Bookmark, Heart, MessageCircle,
  Users, UserCheck, Settings, LogOut, Plus, X, RefreshCw,
  Edit2, Camera, Phone, MapPin, Calendar, Mail,
  Loader2, CheckCircle, AlertCircle, Trash2, ShoppingCart, Clock, Tractor, Wheat
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { updateUserProfileApi, deleteProductApi, deleteBookingApi } from "../services/apiService";
import { uploadImageToImgBB } from "../services/imageService";

const REGIONS = ["Baki","Abseron","Sumqayit","Gence","Quba","Qusar","Xacmaz","Sabran","Qebele","Seki","Zaqatala","Balaken","Qax","Berde","Terter","Agdam","Agcabedi","Yevlax","Kirdamir","Ucar","Goycay","Ismayilli","Samahi","Semkir","Tovuz","Qazax","Agstafa","Goranboy","Saatli","Sabirabad","Imisli","Bilasuvar","Celilabad","Masalli","Lenkaran","Astara","Lerik","Salyan","Neftcala","Naxcivan MR"];

const DEFAULT_REGIONS = [
  "Bakı","Abşeron","Sumqayıt","Gəncə","Quba","Qusar","Xaçmaz","Şabran",
  "Qəbələ","Şəki","Zaqatala","Balakən","Qax","Bərdə","Tərtər","Ağdam",
  "Ağcabədi","Yevlax","Kürdəmir","Ucar","Göyçay","İsmayıllı","Şamaxı",
  "Şəmkir","Tovuz","Qazax","Ağstafa","Goranboy","Saatlı","Sabirabad",
  "İmişli","Biləsuvar","Cəlilabad","Masallı","Lənkəran","Astara","Lerik",
  "Salyan","Neftçala","Naxçıvan MR"
];

const NAV_ITEMS = [
  { id: "info",      label: "Məlumatlarım",     icon: User },
  { id: "listings",  label: "Elanlarım",         icon: FileText },
  { id: "posts",     label: "Paylaşımlarım",     icon: Share2 },
  { id: "saved",     label: "Yadda Saxlananlar", icon: Bookmark },
  { id: "favorites", label: "Sevimlilər",        icon: Heart },
  { id: "rentals",   label: "İcarə Sorğuları",   icon: ShoppingCart },
  { id: "orders",    label: "Sifarişlər",        icon: Clock },
  { id: "comments",  label: "Şərhlər",           icon: MessageCircle },
  { id: "followers", label: "İzləyicilər",       icon: Users },
  { id: "following", label: "İzlədiklərim",      icon: UserCheck },
  { id: "settings",  label: "Parametrlər",       icon: Settings },
];

function EmptyState({ icon, title, sub, cta, onCta }) {
  return (
    <div className="p-10 sm:p-14 rounded-3xl bg-white/80 border border-emerald-100 text-center space-y-3">
      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl mx-auto">{icon}</div>
      <p className="text-gray-700 font-bold text-sm">{title}</p>
      {sub && <p className="text-xs text-gray-400 max-w-xs mx-auto">{sub}</p>}
      {cta && onCta && (
        <button onClick={onCta} className="mt-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition">
          {cta}
        </button>
      )}
    </div>
  );
}

export default function ProfilePage({
  user, onLogout,
  userListings = [], rentalBookings = [], orders = [], favoriteProducts = [],
  onViewDetails, onAddToCart, onOpenRentModal, onOpenContactModal,
  onToggleFavorite, currentUser, onRequireAuth, onAddNewListing,
  onUpdateUser, onDeleteListing, onCancelRental, onRenewRental
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
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [cancelingId, setCancelingId] = useState(null);
  const [renewingId, setRenewingId] = useState(null);

  const activeListings = userListings.filter(p => p.inStock !== false).length;
  const followersCount = user?.followers || 0;
  const followingCount = user?.following || 0;
  const isImgAvatar = user?.avatar && user.avatar.startsWith("http");

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
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
    setProfileMsg({ type: "", text: "" });
    try {
      let finalAvatarUrl = user?.avatar || "";
      if (avatarFile) finalAvatarUrl = await uploadImageToImgBB(avatarFile);
      const updateData = { name: editName.trim(), phone: editPhone.trim(), region: editRegion, address: editAddress.trim(), userType: editUserType, role: editUserType, avatar: finalAvatarUrl };
      const updatedUser = await updateUserProfileApi(user.id, updateData);
      if (onUpdateUser) onUpdateUser(updatedUser);
      setProfileMsg({ type: "success", text: "Profil məlumatlarınız uğurla yeniləndi!" });
      setTimeout(() => setProfileMsg({ type: "", text: "" }), 4000);
    } catch (err) {
      setProfileMsg({ type: "error", text: "Profil yenilənərkən xəta baş verdi." });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm("Bu elanı silmək istədiyinizdən əminsiniz?")) return;
    try {
      await deleteProductApi(prodId);
      if (onDeleteListing) onDeleteListing(prodId);
    } catch { alert("Elan silinərkən xəta baş verdi."); }
  };

  const handleCancelRental = async (id) => {
    if (!window.confirm("Bu icarə sorğusunu ləğv etmək istədiyinizdən əminsiniz?")) return;
    setCancelingId(id);
    try {
      await deleteBookingApi(id);
      if (onCancelRental) onCancelRental(id);
    } catch (err) {
      alert("Ləğv edilərkən xəta baş verdi.");
    } finally {
      setCancelingId(null);
    }
  };

  const handleRenewRental = (booking) => {
    if (onRenewRental) onRenewRental(booking);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-emerald-100">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            {isImgAvatar
              ? <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-200" />
              : <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-lg flex items-center justify-center">{user?.name?.[0]?.toUpperCase() || "U"}</div>
            }
            <button onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }} className="absolute -bottom-1 -right-1 bg-emerald-600 text-white w-5 h-5 rounded-full flex items-center justify-center">
              <Edit2 className="w-2.5 h-2.5" />
            </button>
          </div>
          <div className="min-w-0">
            <p className="font-black text-gray-900 text-sm truncate">{user?.name || "İstifadəçi"}</p>
            <p className="text-[11px] text-gray-400 truncate">{user?.email || ""}</p>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-0.5">
              {user?.userType === "company" ? "Aqro Şirkət" : "Fermer"}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1 mt-4">
          {[
            { label: "Elan", value: activeListings },
            { label: "Paylaşım", value: 0 },
            { label: "İzləyici", value: followersCount },
            { label: "İzlənilən", value: followingCount },
          ].map(s => (
            <div key={s.label} className="text-center bg-emerald-50/80 rounded-xl py-2 px-1">
              <p className="font-black text-gray-900 text-sm leading-none">{s.value}</p>
              <p className="text-[9px] text-gray-500 font-semibold mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <nav className="flex-1 py-3 space-y-0.5 px-2">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${isActive ? "bg-emerald-600 text-white shadow-sm" : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-800"}`}>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.id === "listings" && userListings.length > 0 && <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-emerald-100 text-emerald-700"}`}>{userListings.length}</span>}
              {item.id === "favorites" && favoriteProducts.length > 0 && <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-rose-100 text-rose-600"}`}>{favoriteProducts.length}</span>}
              {item.id === "rentals" && rentalBookings.length > 0 && <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-blue-100 text-blue-700"}`}>{rentalBookings.length}</span>}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-emerald-100 space-y-2">
        <button onClick={onAddNewListing} className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex items-center justify-center gap-2 transition">
          <Plus className="w-4 h-4" /> Yeni Elan
        </button>
        <button onClick={() => alert("Paylaşım funksiyası tezliklə əlavə olunacaq!")} className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-black text-xs flex items-center justify-center gap-2 transition">
          <Share2 className="w-4 h-4" /> Yeni Paylaşım
        </button>
        <button onClick={onLogout} className="w-full py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-100 font-bold text-xs flex items-center justify-center gap-2 transition">
          <LogOut className="w-3.5 h-3.5" /> Çıxış
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "info": return (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900">Şəxsi Məlumatlarım</h2>
            <button onClick={() => setActiveTab("settings")} className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
              <Edit2 className="w-3 h-3" /> Redaktə Et
            </button>
          </div>
          <div className="bg-white/95 rounded-3xl border border-emerald-100 p-6 space-y-4">
            <div className="flex items-center gap-5">
              {isImgAvatar
                ? <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-3xl object-cover ring-4 ring-emerald-100" />
                : <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-3xl flex items-center justify-center ring-4 ring-emerald-100">{user?.name?.[0]?.toUpperCase() || "U"}</div>
              }
              <div>
                <h3 className="text-xl font-black text-gray-900">{user?.name || "İstifadəçi"}</h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block mt-1">
                  {user?.userType === "company" ? "Aqro Şirkət" : "Fermer"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { icon: Mail, label: "Email", value: user?.email || "—" },
                { icon: Phone, label: "Telefon", value: user?.phone || "—" },
                { icon: MapPin, label: "Region", value: user?.region || "—" },
                { icon: Calendar, label: "Üzvlük", value: user?.joinedDate || "Avqust 2026" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <Icon className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                    <p className="text-xs font-bold text-gray-800 mt-0.5 break-all">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Aktiv Elan", value: activeListings, color: "emerald" },
              { label: "Paylaşım", value: 0, color: "blue" },
              { label: "İzləyici", value: followersCount, color: "purple" },
              { label: "İzlənilən", value: followingCount, color: "amber" },
            ].map(({ label, value, color }) => (
              <div key={label} className={`p-4 rounded-2xl bg-${color}-50 border border-${color}-100 text-center`}>
                <p className="text-2xl font-black text-gray-900">{value}</p>
                <p className="text-[11px] text-gray-500 font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      );
      case "listings": return (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-900">Mənim Elanlarım <span className="text-base text-gray-400 font-bold">({userListings.length})</span></h2>
            <button onClick={onAddNewListing} className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1"><Plus className="w-3 h-3" /> Yeni Elan</button>
          </div>
          {userListings.length === 0
            ? <EmptyState icon={<Wheat className="w-6 h-6 text-emerald-600" />} title="Hələ heç bir elan paylaşmamısınız." sub="Məhsullarınızı dərhal satışa çıxarın." cta="İlk Elanı Paylaş" onCta={onAddNewListing} />
            : <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {userListings.map(product => (
                  <div key={product.id} className="relative group">
                    <ProductCard product={product} onViewDetails={onViewDetails} onAddToCart={onAddToCart} onOpenRentModal={onOpenRentModal} onOpenContactModal={onOpenContactModal} isFavorite={favoriteProducts.some(p => p.id === product.id)} onToggleFavorite={onToggleFavorite} currentUser={currentUser} onRequireAuth={onRequireAuth} />
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id); }} className="absolute top-3 right-12 z-20 p-2 rounded-full bg-white/90 hover:bg-rose-600 text-gray-700 hover:text-white shadow-md transition-all" title="Elanı Sil">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
          }
        </div>
      );
      case "posts": return (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-900">Paylaşımlarım</h2>
            <button onClick={() => alert("Paylaşım funksiyası tezliklə əlavə olunacaq!")} className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-xl flex items-center gap-1 transition"><Plus className="w-3 h-3" /> Yeni Paylaşım</button>
          </div>
          <EmptyState icon={<Share2 className="w-6 h-6 text-emerald-600" />} title="Hələ heç bir paylaşım yoxdur." sub="Sosial paylaşım funksiyası tezliklə əlavə olunacaq." />
        </div>
      );
      case "saved": return <div><h2 className="text-lg font-black text-gray-900 mb-4">Yadda Saxlananlar</h2><EmptyState icon={<Bookmark className="w-6 h-6 text-emerald-600" />} title="Heç bir şey yadda saxlanılmayıb." sub="Yadda saxlama funksiyası tezliklə əlavə olunacaq." /></div>;
      case "favorites": return (
        <div>
          <h2 className="text-lg font-black text-gray-900 mb-4">Sevimlilər <span className="text-base text-gray-400 font-bold">({favoriteProducts.length})</span></h2>
          {favoriteProducts.length === 0
            ? <EmptyState icon={<Heart className="w-6 h-6 text-rose-500" />} title="Heç bir elan sevimlilərə əlavə edilməyib." sub="Elanların üzərindəki ürək ikonuna klikləyərək əlavə edin." />
            : <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {favoriteProducts.map(product => <ProductCard key={product.id} product={product} onViewDetails={onViewDetails} onAddToCart={onAddToCart} onOpenRentModal={onOpenRentModal} onOpenContactModal={onOpenContactModal} isFavorite={true} onToggleFavorite={onToggleFavorite} currentUser={currentUser} onRequireAuth={onRequireAuth} />)}
              </div>
          }
        </div>
      );
      case "rentals": return (
        <div>
          <h2 className="text-lg font-black text-gray-900 mb-4">İcarə Sorğularım <span className="text-base text-gray-400 font-bold">({rentalBookings.length})</span></h2>
          {rentalBookings.length === 0
            ? <EmptyState icon={<Tractor className="w-6 h-6 text-blue-600" />} title="Aktiv icarə sorğunuz yoxdur." sub="Traktor, kombayn və ya torpaq sahələri üçün icarə sorğusu göndərə bilərsiniz." />
            : <div className="space-y-3">
                {rentalBookings.map((b, idx) => {
                  const key = b.id || idx;
                  return (
                    <div key={key} className="p-4 sm:p-5 rounded-2xl bg-white/95 border border-blue-100 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">İcarə</span>
                            <h4 className="text-sm font-bold text-gray-900">{b.productTitle || b.title}</h4>
                          </div>
                          <p className="text-xs text-gray-500">Müddət: <strong>{b.duration || (b.days ? b.days + ' gün' : '1 gün')}</strong> • Məkan: {b.locationNote || b.location || "—"}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block ${b.status === "Təsdiqləndi" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : b.status === "Ləğv edildi" ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                            {b.status || "Təsdiq gözləyir"}
                          </span>
                        </div>
                        <div className="flex flex-col sm:items-end gap-2">
                          <p className="text-lg font-black text-blue-900">{(Number(b.estimatedCost) || 0).toLocaleString()} AZN</p>
                          {b.status !== "Ləğv edildi" && (
                            <div className="flex gap-2">
                              <button onClick={() => handleRenewRental(b)} disabled={renewingId === key} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold transition disabled:opacity-50">
                                {renewingId === key ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />} Yenilə
                              </button>
                              <button onClick={() => handleCancelRental(key)} disabled={cancelingId === key} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[11px] font-bold transition disabled:opacity-50">
                                {cancelingId === key ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />} Ləğv Et
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
          }
        </div>
      );
      case "orders": return (
        <div>
          <h2 className="text-lg font-black text-gray-900 mb-4">Sifarişlər <span className="text-base text-gray-400 font-bold">({orders.length})</span></h2>
          {orders.length === 0
            ? <EmptyState icon={<ShoppingCart className="w-6 h-6 text-emerald-600" />} title="Hələ heç bir sifariş etməmisiniz." sub="Gübrələr, toxumlar və alətləri səbətə ataraq sifariş edə bilərsiniz." />
            : <div className="space-y-3">
                {orders.map((order, idx) => (
                  <div key={order.id || idx} className="p-4 sm:p-5 rounded-2xl bg-white/95 border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-gray-900">Sifariş #{order.orderId || order.id || (10000 + idx)}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">✓ {order.status || "Qəbul edildi"}</span>
                      </div>
                      <p className="text-xs text-gray-500">Tarix: {order.date || "Bugün"}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] text-gray-400 font-semibold">Yekun Məbləğ:</p>
                      <p className="text-lg font-black text-emerald-950">{(Number(order.totalAmount) || 0).toLocaleString()} AZN</p>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      );
      case "comments": return <div><h2 className="text-lg font-black text-gray-900 mb-4">Şərhlər</h2><EmptyState icon={<MessageCircle className="w-6 h-6 text-emerald-600" />} title="Heç bir şərh tapılmadı." sub="Şərh funksiyası tezliklə əlavə olunacaq." /></div>;
      case "followers": return <div><h2 className="text-lg font-black text-gray-900 mb-4">İzləyicilər ({followersCount})</h2><EmptyState icon={<Users className="w-6 h-6 text-emerald-600" />} title="Hələ heç bir izləyici yoxdur." sub="İzləyici funksiyası tezliklə əlavə olunacaq." /></div>;
      case "following": return <div><h2 className="text-lg font-black text-gray-900 mb-4">İzlədiklərim ({followingCount})</h2><EmptyState icon={<UserCheck className="w-6 h-6 text-emerald-600" />} title="Hələ heç kim izlənilmir." sub="İzləmə funksiyası tezliklə əlavə olunacaq." /></div>;
      case "settings": return (
        <div className="space-y-5">
          <h2 className="text-lg font-black text-gray-900">Parametrlər — Profili Redaktə Et</h2>
          <div className="bg-white/95 rounded-3xl border border-emerald-100 p-6 shadow-xs">
            {profileMsg.text && (
              <div className={`p-3 rounded-2xl mb-5 text-xs font-bold flex items-center gap-2 ${profileMsg.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-rose-50 border border-rose-200 text-rose-700"}`}>
                {profileMsg.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {profileMsg.text}
              </div>
            )}
            <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-2">Profil Şəkli</label>
                <div className="flex items-center gap-4">
                  {avatarPreview
                    ? <img src={avatarPreview} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-400" />
                    : <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-xl flex items-center justify-center">{editName?.[0]?.toUpperCase() || "U"}</div>
                  }
                  <label className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold cursor-pointer transition inline-flex items-center gap-2">
                    <Camera className="w-4 h-4" /> Şəkil Seç
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Ad və Soyad *</label>
                  <input type="text" required value={editName} onChange={e => setEditName(e.target.value)} className="w-full p-3 rounded-2xl border border-gray-200 font-bold text-xs focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Əlaqə Nömrəsi *</label>
                  <input type="tel" required value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="+994 50 123 45 67" className="w-full p-3 rounded-2xl border border-gray-200 font-bold text-xs focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Region / Rayon *</label>
                  <select value={editRegion} onChange={e => setEditRegion(e.target.value)} className="w-full p-3 rounded-2xl border border-gray-200 font-bold text-xs bg-white focus:border-emerald-500 outline-none">
                    {DEFAULT_REGIONS.map((r, i) => <option key={i} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Hesab Növü</label>
                  <select value={editUserType} onChange={e => setEditUserType(e.target.value)} className="w-full p-3 rounded-2xl border border-gray-200 font-bold text-xs bg-white focus:border-emerald-500 outline-none">
                    <option value="farmer">Fərdi Fermer / Təsərrüfatçı</option>
                    <option value="company">Aqro Şirkət / Müəssisə</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Dəqiq Ünvan</label>
                  <input type="text" value={editAddress} onChange={e => setEditAddress(e.target.value)} placeholder="Məs: Bərdə rayonu, Alpoud kəndi" className="w-full p-3 rounded-2xl border border-gray-200 text-xs focus:border-emerald-500 outline-none" />
                </div>
              </div>
              <button type="submit" disabled={isSavingProfile} className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition disabled:opacity-50 flex items-center gap-2">
                {isSavingProfile ? <><Loader2 className="w-4 h-4 animate-spin" /> Yenilənir...</> : <><CheckCircle className="w-4 h-4" /> Dəyişiklikləri Saxla</>}
              </button>
            </form>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 lg:pb-16 animate-fadeIn">
      <div className="flex gap-6">
        <aside className="hidden lg:flex flex-col w-64 shrink-0">
          <div className="sticky top-24 bg-white/95 backdrop-blur-xl rounded-3xl border border-emerald-100 shadow-xs overflow-hidden">
            <SidebarContent />
          </div>
        </aside>

        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <div className="relative z-10 w-72 bg-white/98 backdrop-blur-xl shadow-2xl overflow-y-auto">
              <button onClick={() => setSidebarOpen(false)} className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100"><X className="w-4 h-4" /></button>
              <SidebarContent />
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0">
          <div className="lg:hidden flex items-center justify-between mb-4 bg-white/90 rounded-2xl border border-emerald-100 p-3">
            <button onClick={() => setSidebarOpen(true)} className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-sm">☰</span>
              {NAV_ITEMS.find(n => n.id === activeTab)?.label || "Profil"}
            </button>
            <button onClick={onAddNewListing} className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold flex items-center gap-1">
              <Plus className="w-3 h-3" /> Elan
            </button>
          </div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
