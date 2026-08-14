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
  onToggleFavorite
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'rentals', 'favorites', 'my-listings'

  // User mock listings
  const userListings = [
    {
      id: "my-1",
      title: "Orqanik Alma Tingləri (1 İllik)",
      type: "sale",
      canAddToCart: true,
      requiresInquiry: false,
      category: "Ağac və Bitkilər",
      price: 6,
      unit: "AZN / ədəd",
      year: 2024,
      location: "Quba",
      inStock: true,
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&w=800&q=80",
      description: "Öz bağımızdan calaq olunmuş təmiz sort tinglər.",
      features: { "Sort": "Qızıləhmədi", "Miqdar": "500 ədəd" }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-emerald-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-green-500 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
            {user?.name ? user.name[0].toUpperCase() : 'F'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-gray-900">{user?.name || 'Fermer Qasımov'}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {user?.userType === 'company' ? 'Təsərrüfat Sahibi' : 'Fermer / İstehsalçı'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{user?.email || 'fermer@aqrobazar.az'} • {user?.phone || '+994 50 123 45 67'}</p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">Üzvlük: {user?.joinedDate || 'Avqust 2026'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onLogout}
            className="px-5 py-2.5 rounded-2xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition"
          >
            Çıxış Et
          </button>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex bg-emerald-50/70 p-1.5 rounded-2xl border border-emerald-100 backdrop-blur-md max-w-xl">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-emerald-800'
          }`}
        >
          🛒 Sifarişlərim ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('rentals')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'rentals'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-emerald-800'
          }`}
        >
          🚜 İcarə Sorğuları ({rentalBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'favorites'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-emerald-800'
          }`}
        >
          ❤️ Sevimlilər ({favoriteProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('my-listings')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'my-listings'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-emerald-800'
          }`}
        >
          📦 Elanlarım ({userListings.length})
        </button>
      </div>

      {/* Tab Content 1: E-commerce Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="font-black text-gray-900 text-lg">Alış-Veriş Sifarişləri Tarixçəsi</h3>
          {orders.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white/70 backdrop-blur-md border border-emerald-100 text-center">
              <p className="text-gray-500 text-xs">Hələ heç bir onlayn sifariş etməmisiniz.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">Sifariş #{order.orderId || (1000 + idx)}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">Qəbul edildi</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Tarix: {order.date || 'Bugün'} • Məhsul sayı: {order.items?.length || 1}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Yekun məbləğ:</p>
                    <p className="text-base font-black text-emerald-800">{order.totalAmount || '75.00'} AZN</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Rental Bookings */}
      {activeTab === 'rentals' && (
        <div className="space-y-4">
          <h3 className="font-black text-gray-900 text-lg">İcarə Sifarişləri və Rezervasiyalar</h3>
          {rentalBookings.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white/70 backdrop-blur-md border border-emerald-100 text-center">
              <p className="text-gray-500 text-xs">Aktiv icarə sifarişiniz yoxdur.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rentalBookings.map((b, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">İcarə</span>
                      <h4 className="text-sm font-bold text-gray-900">{b.productTitle}</h4>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Müddət: {b.startDate} - {b.endDate} ({b.days} gün) • Məkan: {b.locationNote || 'Qeyd olunmayıb'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400">Hesablanmış məbləğ:</p>
                    <p className="text-base font-black text-blue-900">{b.estimatedCost?.toLocaleString()} AZN</p>
                    <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">Təsdiq gözləyir</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Wishlist */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <h3 className="font-black text-gray-900 text-lg">Yadda Saxlanılan Elanlar</h3>
          {favoriteProducts.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white/70 backdrop-blur-md border border-emerald-100 text-center">
              <p className="text-gray-500 text-xs">Heç bir elanı sevimlilərə əlavə etməmisiniz.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 4: User's Listings */}
      {activeTab === 'my-listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-gray-900 text-lg">Mənim Yerləşdirdiyim Elanlar</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userListings.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
                onOpenRentModal={onOpenRentModal}
                onOpenContactModal={onOpenContactModal}
                isFavorite={false}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}