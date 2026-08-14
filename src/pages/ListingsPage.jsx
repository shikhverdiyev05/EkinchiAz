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
  favorites,
  onToggleFavorite
}) {
  const [search, setSearch] = useState(initialFilters.search || '');
  const [selectedType, setSelectedType] = useState(initialFilters.type || 'all'); // 'all', 'sale', 'rent'
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || 'all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [maxPrice, setMaxPrice] = useState(200000);
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-asc', 'price-desc', 'rating'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // 1. Search Query
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchCat = item.category.toLowerCase().includes(query);
        const matchLoc = item.location.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchCat && !matchLoc) return false;
      }

      // 2. Listing Type (Satış / İcarə)
      if (selectedType !== 'all') {
        if (item.type !== selectedType) return false;
      }

      // 3. Category
      if (selectedCategory !== 'all') {
        if (item.category !== selectedCategory) return false;
      }

      // 4. Region
      if (selectedRegion !== 'all') {
        if (item.location !== selectedRegion) return false;
      }

      // 5. Price
      if (item.price > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return (b.year || 0) - (a.year || 0);
      return 0;
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-green-700 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-emerald-100 border border-white/20">
            Aqro Elanlar Portalı
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mt-2 tracking-tight">
            Aqrar Satış və İcarə Elanları
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 leading-relaxed">
            Gübrə, toxum, dərman, ting, avadanlıqlar, kənd təsərrüfatı texnikaları və torpaq sahələri bir məkanda.
          </p>
        </div>
      </div>

      {/* Main Filter & Listing Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28">
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

        {/* Listings Content Column */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Control Bar (Search, Type Badges, Mobile Filter Trigger, Sort) */}
          <div className="bg-white/80 backdrop-blur-xl p-4 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
            
            {/* Search Input Row */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Elanlar üzrə axtarış (Məs: Gübrə, Traktor, Fındıq bağı...)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs font-semibold text-gray-800 placeholder-gray-400 outline-none focus:border-emerald-500 focus:bg-white transition"
                />
                <svg className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden px-4 py-2.5 rounded-2xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span>Filtrlər</span>
              </button>
            </div>

            {/* Mobile Collapsible Filter Sidebar */}
            {mobileFilterOpen && (
              <div className="lg:hidden pt-3 border-t border-emerald-100">
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
            )}

            {/* Status & Sort Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-50 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800">
                  Tapılan Elanlar:
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-black">
                  {filteredProducts.length} ədəd
                </span>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-semibold">Sıralama:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-gray-700 outline-none focus:border-emerald-500"
                >
                  <option value="newest">Ən Yenilər</option>
                  <option value="price-asc">Qiymət: Ucuzdan Bahaya</option>
                  <option value="price-desc">Qiymət: Bahadan Ucuza</option>
                  <option value="rating">Reytinqə Görə</option>
                </select>
              </div>
            </div>

          </div>

          {/* Active Filter Badges */}
          {(selectedType !== 'all' || selectedCategory !== 'all' || selectedRegion !== 'all' || search) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-400 font-medium">Aktiv filterlər:</span>
              
              {selectedType !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Növ: {selectedType === 'sale' ? 'Satış' : 'İcarə'}
                  <button onClick={() => setSelectedType('all')} className="hover:text-black">✕</button>
                </span>
              )}

              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Kateqoriya: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-black">✕</button>
                </span>
              )}

              {selectedRegion !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Rayon: {selectedRegion}
                  <button onClick={() => setSelectedRegion('all')} className="hover:text-black">✕</button>
                </span>
              )}

              {search && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Axtarış: "{search}"
                  <button onClick={() => setSearch('')} className="hover:text-black">✕</button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-rose-600 font-bold hover:underline ml-1"
              >
                Hamısını təmizlə
              </button>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white/70 backdrop-blur-md border border-emerald-100 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto text-2xl">
                🔍
              </div>
              <h3 className="font-black text-gray-900 text-lg">Axtarışınıza uyğun elan tapılmadı</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Filtrləri dəyişərək və ya axtarış sözünü sadələşdirərək yenidən yoxlayın.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
              >
                Filtrləri Sıfırla
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}