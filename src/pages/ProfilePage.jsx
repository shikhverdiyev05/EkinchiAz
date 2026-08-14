import { useState } from 'react';
import ProductCard from '../components/ProductCard';

export default function ProfilePage({
  user,
  onLogout,
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
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 pb-24 lg:pb-16 animate-fadeIn">
      
      {/* Profile Header */}
      <div className="p-5 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-emerald-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-green-500 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
                {user?.name || 'İstifadəçi'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                {user?.userType === 'company' ? '🏢 Aqro Şirkət' : '🧑‍🌾 Fermer'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {user?.email || 'istifadeci@aqrobazar.az'} • {user?.phone || '+994 50 000 00 00'}
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
              Məkan: {user?.region || 'Azərbaycan'} • Üzvlük: {user?.joinedDate || '2026'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={onAddNewListing}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm"
          >
            + Yeni Elan Ver
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2.5 rounded-2xl border border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-rose-700 font-bold text-xs transition"
          >
            Çıxış
          </button>
        </div>

      </div>

      {/* Tabs Bar */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 bg-emerald-50/80 p-1.5 rounded-2xl sm:rounded-3xl border border-emerald-100 backdrop-blur-md max-w-2xl">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-shrink-0 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-emerald-800'
          }`}
        >
          🛒 Sifarişlər ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('rentals')}
          className={`flex-shrink-0 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'rentals'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-emerald-800'
          }`}
        >
          🚜 İcarə Sorğuları ({rentalBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-shrink-0 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all ${
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
        
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h3 className="font-black text-gray-900 text-base sm:text-lg mb-3">Onlayn E-Commerce Sifarişlərim</h3>
            {orders.length === 0 ? (
              <div className="p-8 sm:p-12 rounded-3xl bg-white/80 backdrop-blur-md border border-emerald-100 text-center space-y-2">
                <p className="text-gray-500 text-xs">Hələ heç bir onlayn məhsul sifariş etməmisiniz.</p>
                <p className="text-[11px] text-emerald-700 font-semibold">Gübrələr, toxumlar və alətləri səbətə ataraq sifariş edə bilərsiniz.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-gray-900">Sifariş #{order.orderId || (10000 + idx)}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓ Qəbul edildi
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Tarix: {order.date || 'Bugün'} • Çatdırılma: Qapıya qədər kuryerlə
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-semibold">Yekun Məbləğ:</p>
                      <p className="text-base sm:text-lg font-black text-emerald-950">{order.totalAmount || '45.00'} AZN</p>
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
              <div className="p-8 sm:p-12 rounded-3xl bg-white/80 backdrop-blur-md border border-emerald-100 text-center">
                <p className="text-gray-500 text-xs">Aktiv icarə sifarişiniz yoxdur.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rentalBookings.map((b, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">İcarə</span>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900">{b.productTitle}</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Müddət: {b.startDate} - {b.endDate} ({b.days} gün) • Məkan: {b.locationNote || 'Məkan qeyd olunub'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-semibold">Təxmini Məbləğ:</p>
                      <p className="text-base sm:text-lg font-black text-blue-900">{b.estimatedCost?.toLocaleString()} AZN</p>
                      <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 inline-block mt-1">
                        Təsdiq gözləyir
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
              <div className="p-8 sm:p-12 rounded-3xl bg-white/80 backdrop-blur-md border border-emerald-100 text-center">
                <p className="text-gray-500 text-xs">Heç bir elanı sevimlilərə əlavə etməmisiniz.</p>
                <p className="text-[11px] text-gray-400 mt-1">Elanların üzərindəki ürək ❤️ ikonuna klikləyərək yadda saxlayın.</p>
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