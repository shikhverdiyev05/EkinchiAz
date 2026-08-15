import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';

export default function HomePage({
  products,
  categories = [],
  onNavigateListings,
  onSelectCategory,
  onViewDetails,
  onAddToCart,
  onOpenRentModal,
  onOpenContactModal,
  favorites = [],
  onToggleFavorite,
  currentUser,
  onRequireAuth
}) {
  const saleProducts = products.filter(p => p.type === 'sale').slice(0, 4);
  const rentalProducts = products.filter(p => p.type === 'rent').slice(0, 3);

  return (
    <div className="space-y-12 sm:space-y-16 pb-24 lg:pb-16 animate-fadeIn">
      
      {/* Hero Section */}
      <HeroSection 
        onSearch={(term) => onNavigateListings({ search: term })}
        onSelectCategory={onSelectCategory}
        onNavigateListings={onNavigateListings}
      />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-14 sm:space-y-20">
        
        {/* Categories Explorer */}
        <section>
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-700">
                Bütün Sahələr
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight mt-0.5 sm:mt-1">
                Kateqoriyalar üzrə Kəşf Edin
              </h2>
            </div>
            <button
              onClick={() => onNavigateListings()}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span className="hidden sm:inline">Bütün elanlara bax</span>
              <span className="sm:hidden">Hamısı</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-3 sm:pb-0 scroll-smooth snap-x">
            {categories.filter(c => c.id !== 'all').map((cat) => (
              <div
                key={cat.id}
                onClick={() => onNavigateListings({ category: cat.name })}
                className="group p-4 sm:p-5 rounded-3xl bg-white/85 backdrop-blur-md border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between min-w-[160px] sm:min-w-0 snap-start flex-shrink-0"
              >
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center font-bold text-xl group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
                    {cat.icon || (
                      cat.id === 'gubreler' || cat.name?.includes('Gübrə') ? '🧪' :
                      cat.id === 'agac-bitki' || cat.name?.includes('Ağac') || cat.name?.includes('Bitki') ? '🌳' :
                      cat.id === 'toxum-yem' || cat.name?.includes('Toxum') || cat.name?.includes('Yem') ? '🌾' :
                      cat.id === 'levazimatlar' || cat.name?.includes('Ləvazimat') || cat.name?.includes('Alət') ? '🛠️' :
                      cat.id === 'dermanlar' || cat.name?.includes('Dərman') ? '🛡️' :
                      cat.id === 'texnikalar' || cat.name?.includes('Texnika') ? '🚜' :
                      cat.id === 'torpaq-saheleri' || cat.name?.includes('Torpaq') || cat.name?.includes('Bağ') ? '🗺️' : '🌱'
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm mt-3 sm:mt-4 group-hover:text-emerald-800 transition">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-emerald-50 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-emerald-700">
                  <span>
                    {cat.type === 'sale' ? 'Yalnız Satış' : cat.type === 'both' ? 'Satış & İcarə' : 'İcarə'}
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Sale Items */}
        <section>
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-700">
                  E-Commerce / Birbaşa Satış
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight mt-0.5 sm:mt-1">
                Satışda Olan Məhsullar
              </h2>
            </div>
            <button
              onClick={() => onNavigateListings({ type: 'sale' })}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>Bütün satış elanları</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {saleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
                onOpenRentModal={onOpenRentModal}
                onOpenContactModal={onOpenContactModal}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={onToggleFavorite}
                currentUser={currentUser}
                onRequireAuth={onRequireAuth}
              />
            ))}
          </div>
        </section>

        {/* Featured Rental Items Banner */}
        <section className="p-5 sm:p-8 md:p-10 rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-emerald-950 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between">
            <div>
              <span className="px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-blue-500/30 text-cyan-300 border border-cyan-500/30">
                AqroTexnika və Torpaq İcarəsi
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight mt-2 sm:mt-3">
                Kənd Təsərrüfatı Texnikaları və Sahə İcarəsi
              </h2>
              <p className="text-xs text-blue-200/80 mt-1 max-w-xl">
                Kombaynlar, güclü traktorlar və suvarılan münbit torpaq sahələri üçün bronlaşdırma və icarə sifarişi yaradın.
              </p>
            </div>
            <button
              onClick={() => onNavigateListings({ type: 'rent' })}
              className="mt-4 sm:mt-0 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20 transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Bütün İcarə Elanları</span>
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10">
            {rentalProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
                onOpenRentModal={onOpenRentModal}
                onOpenContactModal={onOpenContactModal}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={onToggleFavorite}
                currentUser={currentUser}
                onRequireAuth={onRequireAuth}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}