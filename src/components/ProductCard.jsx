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
      if (onRequireAuth) onRequireAuth('Elanı sevimlilərə əlavə etmək üçün daxil olun');
      return;
    }
    onToggleFavorite(product.id);
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      if (onRequireAuth) onRequireAuth('Məhsulu səbətə əlavə etmək üçün daxil olun');
      return;
    }
    onAddToCart(product);
  };

  const handleContactClick = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      if (onRequireAuth) onRequireAuth('Satıcı ilə əlaqə saxlamaq üçün daxil olun');
      return;
    }
    onOpenContactModal(product);
  };

  const handleRentClick = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      if (onRequireAuth) onRequireAuth('İcarə sifarişi göndərmək üçün daxil olun');
      return;
    }
    onOpenRentModal(product);
  };

  return (
    <div 
      onClick={() => onViewDetails(product)}
      className="group bg-white/85 backdrop-blur-md rounded-3xl border border-emerald-100/90 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer active:scale-[0.99]"
    >
      <div>
        {/* Image & Badges */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-emerald-950/10">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
            <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase text-white shadow-md ${
              isSale ? 'bg-emerald-600' : 'bg-blue-600'
            }`}>
              {isSale ? 'Satış' : 'İcarə'}
            </span>

            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isFavorite ? 'bg-rose-500 text-white shadow-md' : 'bg-white/80 text-gray-700 hover:text-rose-500'
              }`}
            >
              ❤️
            </button>
          </div>

          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white font-medium pointer-events-none">
            <span className="backdrop-blur-md bg-black/40 px-2 py-0.5 rounded-lg">📍 {product.location}</span>
            <span className="backdrop-blur-md bg-black/40 px-2 py-0.5 rounded-lg">İl: {product.year}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
            {product.category} {product.subcategory ? `• ${product.subcategory}` : ''}
          </span>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-emerald-700 transition line-clamp-2 leading-snug">
            {product.title}
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-1.5 line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer Price & Action */}
      <div className="p-4 sm:p-5 pt-0">
        <div className="pt-3 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase block">{isRent ? 'İcarə haqqı' : 'Qiymət'}</span>
            <span className="text-base sm:text-lg font-black text-emerald-950">
              {product.price.toLocaleString()} <span className="text-xs font-bold text-emerald-700">{product.unit}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {product.canAddToCart && (
              <button
                onClick={handleAddToCartClick}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs active:scale-95 transition"
              >
                + Səbətə at
              </button>
            )}

            {product.requiresInquiry && isSale && (
              <button
                onClick={handleContactClick}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs active:scale-95 transition"
              >
                Satıcı ilə əlaqə
              </button>
            )}

            {isRent && (
              <button
                onClick={handleRentClick}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs active:scale-95 transition"
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