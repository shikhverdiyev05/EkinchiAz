/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import { Heart, MapPin, Phone, MessageCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage({
  product,
  allProducts = [],
  onBack,
  onNavigateProduct,
  onAddToCart,
  onOpenRentModal,
  onOpenContactModal,
  isFavorite = false,
  onToggleFavorite,
  currentUser,
  onRequireAuth
}) {
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-800">Elan tapılmadı</h2>
        <button onClick={onBack} className="mt-4 px-5 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold text-xs">
          Elanlar siyahısına qayıt
        </button>
      </div>
    );
  }

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'description'

  const isSale = product.type === 'sale';
  const isRent = product.type === 'rent';
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleFavoriteClick = () => {
    if (!currentUser) {
      if (onRequireAuth) onRequireAuth('Sevimlilərə əlavə etmək üçün daxil olun');
      return;
    }
    onToggleFavorite(product.id);
  };

  const handleAddToCartWithQty = () => {
    if (!currentUser) {
      if (onRequireAuth) onRequireAuth('Məhsulu səbətə əlavə etmək üçün daxil olun');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
  };

  const handleOpenContact = () => {
    if (!currentUser) {
      if (onRequireAuth) onRequireAuth('Satıcı ilə əlaqə saxlamaq üçün daxil olun');
      return;
    }
    onOpenContactModal(product);
  };

  const handleOpenRent = () => {
    if (!currentUser) {
      if (onRequireAuth) onRequireAuth('İcarə sifarişi göndərmək üçün daxil olun');
      return;
    }
    onOpenRentModal(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 pb-24 lg:pb-16 animate-fadeIn">
      
      {/* Compact Breadcrumb & Favorite Bar */}
      <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs">
        
        {/* Sol: Geri düyməsi + breadcrumb */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          
          {/* Geri Düyməsi — Pill */}
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition active:scale-95 shrink-0 shadow-sm"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden xs:inline">Geri</span>
          </button>

          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-1 text-gray-400 font-medium min-w-0 overflow-hidden">
            <svg className="w-3 h-3 shrink-0 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
            <span className="truncate text-gray-500 max-w-[80px] sm:max-w-[140px]" title={product.category}>
              {product.category}
            </span>
            {product.subcategory && (
              <>
                <svg className="w-3 h-3 shrink-0 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <span className="truncate text-gray-500 max-w-[80px] sm:max-w-[120px] hidden sm:inline" title={product.subcategory}>
                  {product.subcategory}
                </span>
              </>
            )}
            <svg className="w-3 h-3 shrink-0 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
            <span className="truncate text-gray-800 font-bold max-w-[100px] sm:max-w-[200px]" title={product.title}>
              {product.title}
            </span>
          </div>
        </div>

        {/* Sağ: Sevimli İkon Düyməsi */}
        <button
          onClick={handleFavoriteClick}
          title={isFavorite ? 'Sevimlilərdən sil' : 'Sevimlilərə əlavə et'}
          className={`shrink-0 flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl border transition text-[11px] sm:text-xs font-bold active:scale-95 ${
            isFavorite 
              ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-xs' 
              : 'bg-white border-gray-200 text-gray-500 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-rose-500' : 'text-gray-400'}`} />
          <span className="hidden sm:inline">{isFavorite ? 'Sevimlilərdən sil' : 'Sevimlilərə əlavə et'}</span>
        </button>

      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Sol Sütun: Qalereya və Satıcı */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-emerald-950/10 border border-emerald-100 shadow-md">
            <img 
              src={selectedImage} 
              alt={product.title} 
              className="w-full h-full object-cover transition-all duration-300"
            />

            <div className="absolute top-3 left-3 flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase text-white shadow-md ${
                isSale ? 'bg-emerald-600' : 'bg-blue-600'
              }`}>
                {isSale ? 'Satış' : 'İcarə'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/40 text-white backdrop-blur-md">
                {product.category}
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-medium">
              <span className="backdrop-blur-md bg-black/50 px-2.5 py-1 rounded-xl flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {product.location}
              </span>
              <span className="backdrop-blur-md bg-black/50 px-2.5 py-1 rounded-xl">
                İstehsal: {product.year}
              </span>
            </div>
          </div>

          {/* Qalereya */}
          {gallery.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === imgUrl ? 'border-emerald-600 scale-105 shadow-sm' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Satıcı Kartı */}
          {product.seller && (
            <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-emerald-100 shadow-xs space-y-3.5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white font-black text-lg flex items-center justify-center shadow-md">
                  {product.seller.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                    {product.seller.name}
                    {product.seller.verified && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        ✓ Yoxlanılmış
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-gray-500">Üzvlük: {product.seller.memberSince || '2024'} • Reytinq: {product.seller.rating || '5.0'} ★</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-50">
                <a
                  href={`tel:${product.seller.phone}`}
                  className="py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-4 h-4" /> <span>Zəng Et</span>
                </a>
                <a
                  href={`https://wa.me/${product.seller.whatsapp}?text=${encodeURIComponent(`Salam, "${product.title}" elanı ilə bağlı yazıram.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" /> <span>WhatsApp</span>
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Sağ Sütun: Qiymət və Əməliyyatlar */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                Elan Kodu: #{product.id}
              </span>
              {product.subcategory && (
                <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                  {product.subcategory}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug mt-2">
              {product.title}
            </h1>
          </div>

          {/* Qiymət Bloku */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-green-50/70 border border-emerald-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                {isRent ? 'İcarə Qiyməti' : 'Satış Qiyməti'}
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl sm:text-4xl font-black text-emerald-950">
                  {(Number(product.price) || 0).toLocaleString()}
                </span>
                <span className="text-sm sm:text-base font-bold text-emerald-700">
                  {isSale ? 'AZN' : (product.unit || 'AZN/gün')}
                </span>
              </div>
            </div>

            <div>
              {product.canAddToCart && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                  ● Səbətə Əlavə Edilir
                </span>
              )}
              {product.requiresInquiry && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  ● Razılaşma və Əlaqə ilə
                </span>
              )}
              {isRent && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
                  ● İcarə Rezervasiyası
                </span>
              )}
            </div>
          </div>

          {/* Dinamik Əməliyyat Düymələri (Auth Guarded) */}
          <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-emerald-100 shadow-xs space-y-4">
            
            {product.canAddToCart && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-700">Sifariş Sayı:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-gray-500 hover:text-black font-bold text-base"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 text-xs font-black text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-gray-500 hover:text-black font-bold text-base"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs font-bold text-emerald-800">Cəmi: {(product.price * quantity).toLocaleString()} AZN</span>
                </div>

                <button
                  onClick={handleAddToCartWithQty}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 text-white font-bold text-sm shadow-md transition active:scale-[0.99]"
                >
                  + Səbətə əlavə et ({(product.price * quantity).toLocaleString()} AZN)
                </button>
              </div>
            )}

            {product.requiresInquiry && isSale && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">
                  Bu kateqoriyadakı texnika və torpaq əmlakı səbətə əlavə olunmur, birbaşa satıcı ilə razılaşdırılır.
                </p>
                <button
                  onClick={handleOpenContact}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition active:scale-[0.99]"
                >
                  Satıcı ilə Əlaqə Saxla və Razılaş
                </button>
              </div>
            )}

            {isRent && (
              <div className="space-y-2">
                <p className="text-xs text-blue-900 font-medium">
                  Mövsümlük və ya günlük icarə rezervasiyası yaradın:
                </p>
                <button
                  onClick={handleOpenRent}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white font-bold text-sm shadow-md transition active:scale-[0.99]"
                >
                  İcarə Sifarişi və Rezervasiya
                </button>
              </div>
            )}

          </div>

          {/* Spesifikasiyalar / Təsvir */}
          <div className="bg-white/85 backdrop-blur-xl p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
            <div className="flex bg-emerald-50/80 p-1 rounded-2xl border border-emerald-100 text-xs">
              <button
                onClick={() => setActiveTab('specs')}
                className={`flex-1 py-2 rounded-xl font-bold transition ${
                  activeTab === 'specs' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600'
                }`}
              >
                Xüsusiyyətlər
              </button>
              <button
                onClick={() => setActiveTab('description')}
                className={`flex-1 py-2 rounded-xl font-bold transition ${
                  activeTab === 'description' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600'
                }`}
              >
                Təsvir
              </button>
            </div>

            {activeTab === 'specs' && (
              <div className="space-y-2 text-xs">
                {Object.entries(product.features || {}).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500">{key}:</span>
                    <span className="font-bold text-gray-900">{val}</span>
                  </div>
                ))}
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Məkan:</span>
                  <span className="font-bold text-gray-900">{product.location}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-500">İl:</span>
                  <span className="font-bold text-gray-900">{product.year}</span>
                </div>
              </div>
            )}

            {activeTab === 'description' && (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2">
                <p>{product.description}</p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Oxşar Elanlar */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-emerald-100 space-y-6">
          <h3 className="text-xl sm:text-2xl font-black text-gray-900">
            Oxşar Aqrar Elanlar
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onViewDetails={onNavigateProduct}
                onAddToCart={onAddToCart}
                onOpenRentModal={onOpenRentModal}
                onOpenContactModal={onOpenContactModal}
                isFavorite={false}
                onToggleFavorite={onToggleFavorite}
                currentUser={currentUser}
                onRequireAuth={onRequireAuth}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
