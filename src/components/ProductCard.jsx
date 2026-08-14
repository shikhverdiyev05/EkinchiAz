export default function ProductCard({ 
  product, 
  onViewDetails, 
  onAddToCart, 
  onOpenRentModal, 
  onOpenContactModal,
  isFavorite,
  onToggleFavorite 
}) {
  const isSale = product.type === 'sale';
  const isRent = product.type === 'rent';

  return (
    <div className="group bg-white/80 backdrop-blur-md rounded-3xl border border-emerald-100/80 hover:border-emerald-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Image & Badges */}
      <div className="relative h-52 w-full overflow-hidden bg-emerald-950/10">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

        {/* Listing Type Tag (Satış / İcarə) */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {isSale ? (
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-600/90 text-white backdrop-blur-md shadow-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse"></span>
              Satış
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-600/90 text-white backdrop-blur-md shadow-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-200 animate-pulse"></span>
              İcarə
            </span>
          )}

          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/40 text-white backdrop-blur-md border border-white/20">
            {product.category}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isFavorite 
              ? 'bg-rose-500 text-white shadow-md' 
              : 'bg-white/80 text-gray-700 hover:text-rose-500 hover:bg-white'
          }`}
          title="Sevimlilərə əlavə et"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>

        {/* Location & Year Badges at Image Bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90 font-medium">
          <span className="flex items-center gap-1 backdrop-blur-md bg-black/30 px-2.5 py-1 rounded-lg">
            <svg className="w-3.5 h-3.5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {product.location}
          </span>

          <span className="backdrop-blur-md bg-black/30 px-2.5 py-1 rounded-lg">
            İl: {product.year}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 
            onClick={() => onViewDetails(product)}
            className="font-bold text-gray-900 text-base leading-snug group-hover:text-emerald-700 transition cursor-pointer line-clamp-2"
          >
            {product.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Key Specs Preview */}
          <div className="mt-3.5 pt-3 border-t border-emerald-50 grid grid-cols-2 gap-2 text-[11px] text-gray-500">
            {Object.entries(product.features || {}).slice(0, 2).map(([key, val]) => (
              <div key={key} className="truncate">
                <span className="font-medium text-gray-700">{key}:</span> {val}
              </div>
            ))}
          </div>
        </div>

        {/* Price & Action Area */}
        <div className="mt-5 pt-3 border-t border-emerald-100 flex items-center justify-between gap-2">
          
          {/* Price */}
          <div>
            <span className="text-[10px] text-gray-600 font-semibold block uppercase">
              {isRent ? 'İcarə haqqı' : 'Qiymət'}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-emerald-900 tracking-tight">
                {product.price.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-700">
                {product.unit}
              </span>
            </div>
          </div>

          {/* Dynamic Action Buttons according to Rules */}
          <div className="flex items-center gap-1.5">
            {/* View Details Button */}
            <button
              onClick={() => onViewDetails(product)}
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition"
              title="Ətraflı bax"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>

            {/* CASE 1: Standard Purchasable Product (Gübrə, Toxum, Dərman, Ting, Ləvazimat) -> ADD TO CART */}
            {product.canAddToCart && (
              <button
                onClick={() => onAddToCart(product)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition active:scale-95"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                <span>Səbətə at</span>
              </button>
            )}

            {/* CASE 2: High-value Equipment / Land Sale -> DIRECT SELLER CONTACT ONLY */}
            {product.requiresInquiry && isSale && (
              <button
                onClick={() => onOpenContactModal(product)}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition active:scale-95"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Satıcı ilə əlaqə</span>
              </button>
            )}

            {/* CASE 3: RENTAL Equipment / Land -> CREATE RENTAL ORDER / BOOKING */}
            {isRent && (
              <button
                onClick={() => onOpenRentModal(product)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition active:scale-95"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>İcarə sifarişi</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}