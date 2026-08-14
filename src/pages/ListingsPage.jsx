import { useState, useMemo } from 'react';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';

export default function ListingsPage({
  products,
  initialFilters = {},
  onViewDetails,
  onAddToCart,
  onOpenRentModal,
  onOpenContactModal,
  favorites = [],
  onToggleFavorite,
  currentUser,
  onRequireAuth
}) {
  const [search, setSearch] = useState(initialFilters.search || '');
  const [selectedType, setSelectedType] = useState(initialFilters.type || 'all');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || 'all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [maxPrice, setMaxPrice] = useState(200000);
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchCat = item.category.toLowerCase().includes(query);
        const matchLoc = item.location.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchCat && !matchLoc) return false;
      }
      if (selectedType !== 'all' && item.type !== selectedType) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedRegion !== 'all' && item.location !== selectedRegion) return false;
      if (item.price > maxPrice) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.year || 0) - (a.year || 0);
    });
  }, [products, search, selectedType, selectedCategory, selectedRegion, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedType('all');
    setSelectedCategory('all');
    setSelectedRegion('all');
    setMaxPrice(200000);
    setSortBy('newest');
  };

  const activeFilterCount = (selectedType !== 'all' ? 1 : 0) + 
                            (selectedCategory !== 'all' ? 1 : 0) + 
                            (selectedRegion !== 'all' ? 1 : 0) + 
                            (search.trim() ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-24 lg:pb-16 animate-fadeIn">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 text-white relative overflow-hidden shadow-md">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-emerald-100 border border-white/20 inline-block">
            Aqro Elanlar Portalı
          </span>
          <h1 className="text-2xl sm:text-4xl font-black mt-2 tracking-tight">
            Aqrar Satış və İcarə Elanları
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1.5 leading-relaxed">
            Gübrə, toxum, dərman, ting, avadanlıqlar, kənd təsərrüfatı texnikaları və torpaq sahələri bir məkanda.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <FilterSidebar
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              onReset={handleResetFilters}
            />
          </div>
        </div>

        {/* Listings Section */}
        <div className="lg:col-span-3 space-y-5 sm:space-y-6">
          
          {/* Top Filter & Search Bar */}
          <div className="bg-white/90 backdrop-blur-xl p-3.5 sm:p-4 rounded-3xl border border-emerald-100 shadow-xs space-y-3">
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Elanlar üzrə axtarın (Traktor, Gübrə, Sahə...)"
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs sm:text-sm font-semibold text-gray-800 placeholder-gray-400 outline-none focus:border-emerald-500 focus:bg-white transition"
                />
                <svg className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5 sm:top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-2 sm:top-2.5 text-xs text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-emerald-100 text-emerald-950 font-bold text-xs flex items-center gap-1.5 flex-shrink-0"
              >
                <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span>Filtrlər</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Results count & Sort row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-50 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-semibold">Tapılan elan:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-black text-xs">
                  {filteredProducts.length} ədəd
                </span>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-gray-500 font-semibold hidden sm:inline">Sıralama:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-gray-800 outline-none"
                >
                  <option value="newest">Ən Yenilər</option>
                  <option value="price-asc">Qiymət: Ucuzdan Bahaya</option>
                  <option value="price-desc">Qiymət: Bahadan Ucuza</option>
                  <option value="rating">Reytinqə Görə</option>
                </select>
              </div>
            </div>

          </div>

          {/* Active Filter Pills */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-gray-400 text-[11px] font-semibold">Aktiv:</span>
              
              {selectedType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
                  {selectedType === 'sale' ? 'Satış' : 'İcarə'}
                  <button onClick={() => setSelectedType('all')} className="hover:text-black">✕</button>
                </span>
              )}

              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-black">✕</button>
                </span>
              )}

              {selectedRegion !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
                  {selectedRegion}
                  <button onClick={() => setSelectedRegion('all')} className="hover:text-black">✕</button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-rose-600 text-xs font-bold hover:underline ml-1"
              >
                Hamısını təmizlə
              </button>
            </div>
          )}

          {/* Mobile Filter Modal Drawer */}
          {mobileFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
              <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-4 animate-slideUp">
                <FilterSidebar
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedRegion={selectedRegion}
                  setSelectedRegion={setSelectedRegion}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  onReset={handleResetFilters}
                  onCloseMobile={() => setMobileFilterOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-white/80 backdrop-blur-md border border-emerald-100 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto text-2xl">
                🔍
              </div>
              <h3 className="font-black text-gray-900 text-base sm:text-lg">Axtarışa uyğun elan tapılmadı</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Filtrləri dəyişərək və ya başqa sözlə axtarış edərək yenidən yoxlayın.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
              >
                Filtrləri Sıfırla
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
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
          )}

        </div>

      </div>

    </div>
  );
}