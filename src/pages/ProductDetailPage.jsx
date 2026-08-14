/* eslint-disable react-hooks/rules-of-hooks */
import  { useState } from 'react';
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
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs">
          Elanlar siyahısına qayıt
        </button>
      </div>
    );
  }

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs', 'description', 'seller', 'reviews'

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
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 pb-24 lg:pb-16 animate-fadeIn">
      
      {/* Breadcrumb & Top Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-gray-500 font-medium overflow-x-auto no-scrollbar py-1">
          <button onClick={onBack} className="hover:text-emerald-700 font-bold flex items-center gap-1 flex-shrink-0">
            <span>← Geri</span>
          </button>
          <span>/</span>
          <span className="text-gray-600 flex-shrink-0">{product.category}</span>
          <span>/</span>
          <span className="text-gray-900 font-bold truncate max-w-[200px]">{product.title}</span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleFavoriteClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border transition text-xs font-bold ${
              isFavorite 
                ? 'bg-rose-50 border-rose-200 text-rose-600' 
                : 'bg-white/80 border-gray-200 text-gray-700 hover:text-rose-600'
            }`}
          >
            <span>❤️</span>
            <span className="hidden sm:inline">{isFavorite ? 'Sevimlilərdən sil' : 'Sevimlilərə əlavə et'}</span>
          </button>
        </div>
      </div>

      {/* Main Product Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Gallery (5 cols on lg) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Hero Image */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-emerald-950/10 border border-emerald-100 shadow-md">
            <img 
              src={selectedImage} 
              alt={product.title} 
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-md ${
                isSale ? 'bg-emerald-600' : 'bg-blue-600'
              }`}>
                {isSale ? 'Satış' : 'İcarə'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/40 text-white backdrop-blur-md border border-white/20">
                {product.category}
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-medium">
              <span className="backdrop-blur-md bg-black/50 px-2.5 py-1 rounded-xl">
                📍 {product.location}
              </span>
              <span className="backdrop-blur-md bg-black/50 px-2.5 py-1 rounded-xl">
                İstehsal ili: {product.year}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === imgUrl ? 'border-emerald-600 scale-105 shadow-sm' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`thumbnail-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Seller Contact Card */}
          {product.seller && (
            <div className="p-5 rounded-3xl bg-white/85 backdrop-blur-xl border border-emerald-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
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
                    <p className="text-xs text-gray-500">Üzv olub: {product.seller.memberSince || '2023'} • Reytinq: {product.seller.rating || '5.0'} ★</p>
                  </div>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-50">
                <a
                  href={`tel:${product.seller.phone}`}
                  className="py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Zəng Et</span>
                </a>

                <a
                  href={`https://wa.me/${product.seller.whatsapp}?text=${encodeURIComponent(`Salam, "${product.title}" elanı ilə bağlı əlaqə saxlayıram.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Title, Pricing, Actions, Specs (7 cols on lg) */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                Elan Kodu: #{product.id}
              </span>
              <span className="text-xs text-amber-500 font-bold">
                ★ {product.rating || '5.0'} ({product.reviewsCount || 12} rəy)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug">
              {product.title}
            </h1>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-green-50/70 border border-emerald-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                {isRent ? 'İcarə Qiyməti' : 'Satış Qiyməti'}
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-sm sm:text-base font-bold text-emerald-700">
                  {product.unit}
                </span>
              </div>
            </div>

            <div>
              {product.canAddToCart && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 inline-block">
                  ● Birbaşa Səbətə Əlavə Edilir
                </span>
              )}
              {product.requiresInquiry && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 inline-block">
                  ● Razılaşma və Əlaqə ilə
                </span>
              )}
              {isRent && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200 inline-block">
                  ● İcarə Rezervasiyası
                </span>
              )}
            </div>
          </div>

          {/* Dynamic Action Buttons Section */}
          <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-emerald-100/90 shadow-xs space-y-4">
            
            {/* 1. Cartable Goods (Gübrə, Toxum, Dərman, Alət) */}
            {product.canAddToCart && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-700">Miqdar:</span>
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
                  <span className="text-xs text-gray-400">({(product.price * quantity).toLocaleString()} AZN)</span>
                </div>

                <button
                  onClick={handleAddToCartWithQty}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-[0.99] transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Səbətə əlavə et ({(product.price * quantity).toLocaleString()} AZN)</span>
                </button>
              </div>
            )}

            {/* 2. High-value Sales (Traktor və Torpaq satışı) */}
            {product.requiresInquiry && isSale && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">
                  Bu kateqoriyadakı texnika və torpaq əmlakı səbətə əlavə olunmur, birbaşa satıcı ilə razılaşdırılır.
                </p>
                <button
                  onClick={() => onOpenContactModal(product)}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-[0.99] transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Satıcı ilə Əlaqə Saxla və Təklif Göndər</span>
                </button>
              </div>
            )}

            {/* 3. Rental Machinery and Land */}
            {isRent && (
              <div className="space-y-2">
                <p className="text-xs text-blue-900 font-medium">
                  İcarə müddətini seçərək online rezervasiya sifarişi formalaşdırın:
                </p>
                <button
                  onClick={() => onOpenRentModal(product)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 active:scale-[0.99] transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>İcarə Sifarişi və Rezervasiya Yaradın</span>
                </button>
              </div>
            )}

          </div>

          {/* Tabs: Specifications / Description */}
          <div className="bg-white/85 backdrop-blur-xl p-5 rounded-3xl border border-emerald-100/90 shadow-xs space-y-4">
            <div className="flex bg-emerald-50/80 p-1 rounded-2xl border border-emerald-100 text-xs">
              <button
                onClick={() => setActiveTab('specs')}
                className={`flex-1 py-2 rounded-xl font-bold transition ${
                  activeTab === 'specs' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600 hover:text-emerald-800'
                }`}
              >
                Xüsusiyyətlər
              </button>
              <button
                onClick={() => setActiveTab('description')}
                className={`flex-1 py-2 rounded-xl font-bold transition ${
                  activeTab === 'description' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600 hover:text-emerald-800'
                }`}
              >
                Təsvir
              </button>
            </div>

            {activeTab === 'specs' && (
              <div className="space-y-2 text-xs">
                {Object.entries(product.features || {}).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500 font-medium">{key}</span>
                    <span className="font-bold text-gray-900 text-right">{val}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Məkan</span>
                  <span className="font-bold text-gray-900">{product.location}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500 font-medium">İstehsal / Buraxılış İli</span>
                  <span className="font-bold text-gray-900">{product.year}</span>
                </div>
              </div>
            )}

            {activeTab === 'description' && (
              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-3">
                <p>{product.description}</p>
                <p className="text-xs text-gray-500">
                  Məhsul keyfiyyəti və dəqiqliyi satıcı tərəfindən zəmanət altındadır. Əlavə suallarınız üçün satıcı ilə birbaşa əlaqə qura bilərsiniz.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-emerald-100 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-gray-900">
              Oxşar Aqrar Elanlar
            </h3>
            <button onClick={onBack} className="text-xs font-bold text-emerald-700 hover:underline">
              Bütün elanlar →
            </button>
          </div>

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