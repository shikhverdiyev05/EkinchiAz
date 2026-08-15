import { useState } from 'react';
import ProductCard from '../components/ProductCard';

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
  onAddNewListing
}) {
  const [activeTab, setActiveTab] = useState('listings');

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8 pb-24 lg:pb-16 animate-fadeIn">
      
      {/* Profile Header Card */}
      <div className="p-4 sm:p-6 md:p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-emerald-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        
        {/* User Info */}
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 w-full md:w-auto min-w-0">
          <div className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-green-500 text-white font-black text-xl sm:text-2xl md:text-3xl flex items-center justify-center shadow-md shrink-0 ring-4 ring-emerald-50">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 break-words leading-tight">
                {user?.name || 'İstifadəçi'}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 shrink-0">
                {user?.userType === 'company' ? '🏢 Aqro Şirkət' : '🧑‍🌾 Fermer'}
              </span>
            </div>

            <p className="text-xs text-gray-600 break-words flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span>{user?.email || 'istifadeci@aqrobazar.az'}</span>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span className="font-semibold text-gray-700">{user?.phone || '+994 50 000 00 00'}</span>
            </p>

            <p className="text-[11px] text-emerald-800 font-medium flex flex-wrap items-center gap-x-2 gap-y-0.5 pt-0.5">
              <span>Məkan: <strong className="text-gray-800">{user?.region || 'Azərbaycan'}</strong></span>
              <span className="text-gray-300">•</span>
              <span>Üzvlük: <strong className="text-gray-800">{user?.joinedDate || 'Avqust 2026'}</strong></span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-emerald-100/80">
          <button
            onClick={onAddNewListing}
            className="flex-1 md:flex-initial px-4 sm:px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <span className="text-base leading-none">+</span>
            <span>Yeni Elan Ver</span>
          </button>
          <button
            onClick={onLogout}
            className="px-4 sm:px-5 py-2.5 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 font-bold text-xs sm:text-sm transition flex items-center justify-center whitespace-nowrap"
          >
            Çıxış
          </button>
        </div>

      </div>

      {/* Tabs Bar */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 bg-emerald-50/90 p-1.5 rounded-2xl sm:rounded-3xl border border-emerald-100 backdrop-blur-md max-w-full">
        
        <button
          onClick={() => setActiveTab('listings')}
          className={`flex-shrink-0 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'listings'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-emerald-800'
          }`}
        >
          📝 Mənim Elanlarım ({userListings.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-shrink-0 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-emerald-800'
          }`}
        >
          🛒 Sifarişlər və Ödənişlər ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('rentals')}
          className={`flex-shrink-0 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'rentals'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-emerald-800'
          }`}
        >
          🚜 İcarə Sorğuları ({rentalBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-shrink-0 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'favorites'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-emerald-800'
          }`}
        >
          ❤️ Sevimlilər ({favoriteProducts.length})
        </button>
      </div>

      {/* Tab Contents */}
      <div className="space-y-4">
        
        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900 text-base sm:text-lg">
                Mənim Paylaşdığım Elanlar ({userListings.length})
              </h3>
              <button
                onClick={onAddNewListing}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition"
              >
                + Yeni Elan Əlavə Et
              </button>
            </div>

            {userListings.length === 0 ? (
              <div className="p-8 sm:p-14 rounded-3xl bg-white/80 backdrop-blur-md border border-emerald-100 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl mx-auto">
                  🌾
                </div>
                <p className="text-gray-600 font-bold text-sm">Hələ heç bir elan paylaşmamısınız.</p>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Təsərrüfat məhsullarınızı, gübrələrinizi, toxumlarınızı və ya texnikalarınızı dərhal satışa və icarəyə çıxarın.
                </p>
                <button
                  onClick={onAddNewListing}
                  className="mt-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                >
                  İlk Elanını Paylaş
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {userListings.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={onViewDetails}
                    onAddToCart={onAddToCart}
                    onOpenRentModal={onOpenRentModal}
                    onOpenContactModal={onOpenContactModal}
                    isFavorite={favoriteProducts.some(p => p.id === product.id)}
                    onToggleFavorite={onToggleFavorite}
                    currentUser={currentUser}
                    onRequireAuth={onRequireAuth}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h3 className="font-black text-gray-900 text-base sm:text-lg mb-3">Onlayn E-Commerce Sifarişlərim və Ödənişlər</h3>
            {orders.length === 0 ? (
              <div className="p-8 sm:p-14 rounded-3xl bg-white/80 backdrop-blur-md border border-emerald-100 text-center space-y-2">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl mx-auto">
                  🛒
                </div>
                <p className="text-gray-600 font-bold text-sm">Hələ heç bir onlayn məhsul sifariş etməmisiniz.</p>
                <p className="text-xs text-emerald-700 font-semibold">Gübrələr, toxumlar və alətləri səbətə ataraq sifariş edə bilərsiniz.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order, idx) => (
                  <div key={order.id || idx} className="p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-black text-gray-900">Sifariş #{order.orderId || order.id || (10000 + idx)}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-bold">
                          ✓ {order.status || 'Qəbul edildi'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Tarix: {order.date || 'Bugün'} • Çatdırılma: {order.deliveryMethod || 'Qapıya qədər kuryerlə'}
                      </p>
                      {Array.isArray(order.items) && order.items.length > 0 && (
                        <p className="text-[11px] text-gray-600 font-medium pt-1">
                          Məhsullar: {order.items.map(i => `${i.title || i.name} (${i.quantity || 1} ədəd)`).join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] sm:text-xs text-gray-400 font-semibold">Yekun Məbləğ:</p>
                      <p className="text-base sm:text-lg font-black text-emerald-950">{(Number(order.totalAmount) || 0).toLocaleString()} AZN</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rentals Tab */}
        {activeTab === 'rentals' && (
          <div>
            <h3 className="font-black text-gray-900 text-base sm:text-lg mb-3">Texnika və Sahə İcarə Sifarişlərim</h3>
            {rentalBookings.length === 0 ? (
              <div className="p-8 sm:p-14 rounded-3xl bg-white/80 backdrop-blur-md border border-emerald-100 text-center space-y-2">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mx-auto">
                  🚜
                </div>
                <p className="text-gray-600 font-bold text-sm">Aktiv icarə sifarişiniz yoxdur.</p>
                <p className="text-xs text-gray-400">Traktor, kombayn və ya torpaq sahələri üçün icarə sorğusu göndərə bilərsiniz.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rentalBookings.map((b, idx) => (
                  <div key={b.id || idx} className="p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] sm:text-xs font-bold">İcarə</span>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900">{b.productTitle || b.title}</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Müddət: {b.days || 1} gün • Məkan: {b.locationNote || b.location || 'Məkan qeyd olunub'}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] sm:text-xs text-gray-400 font-semibold">Təxmini Məbləğ:</p>
                      <p className="text-base sm:text-lg font-black text-blue-900">{(Number(b.estimatedCost) || 0).toLocaleString()} AZN</p>
                      <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 inline-block mt-1">
                        {b.status || 'Təsdiq gözləyir'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div>
            <h3 className="font-black text-gray-900 text-base sm:text-lg mb-3">Sevimlilər Siyahım ({favoriteProducts.length})</h3>
            {favoriteProducts.length === 0 ? (
              <div className="p-8 sm:p-14 rounded-3xl bg-white/80 backdrop-blur-md border border-emerald-100 text-center space-y-2">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-2xl mx-auto">
                  ❤️
                </div>
                <p className="text-gray-600 font-bold text-sm">Heç bir elanı sevimlilərə əlavə etməmisiniz.</p>
                <p className="text-xs text-gray-400">Elanların üzərindəki ürək ❤️ ikonuna klikləyərək yadda saxlayın.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {favoriteProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={onViewDetails}
                    onAddToCart={onAddToCart}
                    onOpenRentModal={onOpenRentModal}
                    onOpenContactModal={onOpenContactModal}
                    isFavorite={true}
                    onToggleFavorite={onToggleFavorite}
                    currentUser={currentUser}
                    onRequireAuth={onRequireAuth}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}