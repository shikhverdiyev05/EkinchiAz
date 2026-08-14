
export default function ProductDetailModal({ 
  product, 
  onClose, 
  onAddToCart, 
  onOpenRentModal, 
  onOpenContactModal 
}) {
  if (!product) return null;

  const isSale = product.type === 'sale';
  const isRent = product.type === 'rent';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-3xl w-full border border-emerald-100 shadow-2xl overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Image & Badges */}
          <div className="relative h-72 md:h-full bg-emerald-950 min-h-[300px]">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-md ${
                isSale ? 'bg-emerald-600' : 'bg-blue-600'
              }`}>
                {isSale ? 'Satış Elanı' : 'İcarə Elanı'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30">
                {product.category}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 text-sm text-emerald-300 font-medium mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{product.location}</span>
                <span className="mx-1">•</span>
                <span>İl: {product.year}</span>
              </div>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
                <span>Elan ID: #{product.id}</span>
                <span className="flex items-center gap-1 text-amber-500">
                  ★ {product.rating || '5.0'} (Yoxlanılmış Satıcı)
                </span>
              </div>

              <h2 className="text-2xl font-black text-gray-900 leading-snug">
                {product.title}
              </h2>

              {/* Price Tag */}
              <div className="mt-4 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider block">
                    {isRent ? 'İcarə qiyməti' : 'Satış qiyməti'}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-emerald-950">
                      {product.price.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-emerald-700">
                      {product.unit}
                    </span>
                  </div>
                </div>

                <div className="text-right text-xs text-gray-600 font-medium">
                  {product.canAddToCart && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Stokda var
                    </span>
                  )}
                  {product.requiresInquiry && (
                    <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full font-bold">
                      Razılaşma yolu ilə
                    </span>
                  )}
                  {isRent && (
                    <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full font-bold">
                      Bronlaşdırma aktivdir
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Təsvir və Məlumat
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications Table */}
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Xüsusiyyətlər
                </h4>
                <div className="grid grid-cols-1 gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-100 text-xs">
                  {Object.entries(product.features || {}).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-gray-200/60 last:border-0">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="font-bold text-gray-900">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seller Information */}
              {product.seller && (
                <div className="mt-5 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                      {product.seller.name[0]}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-gray-900 flex items-center gap-1">
                        {product.seller.name}
                        {product.seller.verified && (
                          <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </h5>
                      <p className="text-[11px] text-gray-500">{product.seller.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions based on product category rules */}
            <div className="mt-6 pt-4 border-t border-emerald-100">
              {product.canAddToCart && (
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-[0.98]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Səbətə əlavə et ({product.price} {product.unit})</span>
                </button>
              )}

              {product.requiresInquiry && isSale && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenContactModal(product);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition active:scale-[0.98]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Satıcı ilə əlaqə saxla (Səbətə əlavə olunmur)</span>
                </button>
              )}

              {isRent && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenRentModal(product);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition active:scale-[0.98]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>İcarə sifarişi və Rezervasiya et</span>
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}