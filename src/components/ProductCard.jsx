export default function ProductCard({ 
  product, 
  onViewDetails, 
  onAddToCart, 
  onOpenRentModal, 
  onOpenContactModal,
  isFavorite = false,
  onToggleFavorite,
  currentUser,
  onRequireAuth
}) {
  const isSale = product.type === 'sale';
  const isRent = product.type === 'rent';

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      if (onRequireAuth) {
        onRequireAuth('Elanı sevimlilərə əlavə etmək üçün daxil olun');
      }
      return;
    }
    onToggleFavorite(product.id);
  };

  return (
    <div 
      onClick={() => onViewDetails(product)}
      className="group bg-white/85 backdrop-blur-md rounded-3xl border border-emerald-100/90 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer active:scale-[0.99]"
    >
      {/* Image & Badges */}
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-emerald-950/10">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
            <div className="flex flex-wrap gap-1">
              <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider text-white shadow-md ${
                isSale ? 'bg-emerald-600' : 'bg-blue-600'
              }`}>
                {isSale ? 'Satış' : 'İcarə'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/40 text-white backdrop-blur-md truncate max-w-[120px]">
                {product.category}
              </span>
            </div>

            {/* Favorite button with login check */}
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isFavorite 
                  ? 'bg-rose-500 text-white shadow-md' 
                  : 'bg-white/80 text-gray-700 hover:text-rose-500'
              }`}
              title={isFavorite ? 'Sevimlilərdən sil' : 'Sevimlilərə əlavə et'}
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>

          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white font-medium pointer-events-none">
            <span className="backdrop-blur-md bg-black/40 px-2 py-0.5 rounded-lg flex items-center gap-1">
              <span>📍</span>
              <span>{product.location}</span>
            </span>
            <span className="backdrop-blur-md bg-black/40 px-2 py-0.5 rounded-lg">
              İl: {product.year}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="p-4 sm:p-5">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-emerald-700 transition line-clamp-2 leading-snug">
            {product.title}
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Price & Action Button */}
      <div className="p-4 sm:p-5 pt-0">
        <div className="pt-3 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase block">
              {isRent ? 'İcarə haqqı' : 'Qiymət'}
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-950">
              {product.price.toLocaleString()} <span className="text-xs font-bold text-emerald-700">{product.unit}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {product.canAddToCart && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 text-white text-xs font-bold shadow-xs active:scale-95 transition"
              >
                + Səbətə at
              </button>
            )}

            {product.requiresInquiry && isSale && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenContactModal(product);
                }}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs active:scale-95 transition"
              >
                Satıcı ilə əlaqə
              </button>
            )}

            {isRent && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenRentModal(product);
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white text-xs font-bold shadow-xs active:scale-95 transition"
              >
                İcarə sifarişi
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}