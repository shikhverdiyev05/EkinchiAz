import { useState, useMemo } from 'react';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';

export default function ListingsPage({
  products = [],
  categories = [],
  regions = [],
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
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const numMin = minPrice !== '' && !isNaN(Number(minPrice)) ? Number(minPrice) : 0;
    const numMax = maxPrice !== '' && !isNaN(Number(maxPrice)) ? Number(maxPrice) : Infinity;

    return products.filter((item) => {
      // 1. Axtarış
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query);
        const matchCat = item.category?.toLowerCase().includes(query);
        const matchSub = item.subcategory?.toLowerCase().includes(query);
        const matchLoc = item.location?.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchCat && !matchSub && !matchLoc) return false;
      }

      // 2. Növ (Satış / İcarə)
      if (selectedType !== 'all' && item.type !== selectedType) return false;

      // 3. Kateqoriya
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

      // 4. Region
      if (selectedRegion !== 'all') {
        const itemLoc = item.location || '';
        if (!itemLoc.toLowerCase().includes(selectedRegion.toLowerCase())) return false;
      }

      // 5. Qiymət aralığı (Min & Max)
      const itemPrice = Number(item.price) || 0;
      if (itemPrice < numMin || itemPrice > numMax) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.year || 0) - (a.year || 0);
    });
  }, [products, search, selectedType, selectedCategory, selectedRegion, minPrice, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedType('all');
    setSelectedCategory('all');
    setSelectedRegion('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
  };

  const activeFilterCount = (selectedType !== 'all' ? 1 : 0) + 
                            (selectedCategory !== 'all' ? 1 : 0) + 
                            (selectedRegion !== 'all' ? 1 : 0) + 
                            (minPrice !== '' ? 1 : 0) +
                            (maxPrice !== '' ? 1 : 0) +
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
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              onReset={handleResetFilters}
              categories={categories}
              regions={regions}
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
                    className="absolute right-3 top-2.5 sm:top-3 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Mobile Filter Trigger Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3.5 py-2 sm:py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm relative shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filtrlər</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-emerald-950 font-black text-[10px] flex items-center justify-center -mr-1">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Sub-bar: Count & Sort */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emerald-50 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">
                  Tapılan Elanlar: <span className="text-emerald-700 font-black">{filteredProducts.length}</span>
                </span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 underline"
                  >
                    Filtrləri təmizlə ({activeFilterCount})
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-gray-500 font-medium text-[11px]">Sırala:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs font-bold text-gray-800 outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="newest">Ən Yenilər</option>
                  <option value="price-asc">Ucuzdan Bahaya</option>
                  <option value="price-desc">Bahadan Ucuza</option>
                  <option value="rating">Reytinqə Görə</option>
                </select>
              </div>
            </div>

          </div>

          {/* Listings Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl p-10 sm:p-16 rounded-3xl border border-emerald-100 text-center space-y-3 shadow-xs">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl mx-auto text-emerald-600">
                🔍
              </div>
              <h3 className="font-black text-gray-900 text-base sm:text-lg">
                Uyğun elan tapılmadı
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Axtarış sözünü dəyişin, qiymət aralığını genişləndirin və ya digər kateqoriyalara nəzər salın.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
              >
                Bütün Filtrləri Sıfırla
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={onViewDetails}
                  onAddToCart={onAddToCart}
                  onOpenRentModal={onOpenRentModal}
                  onOpenContactModal={onOpenContactModal}
                  isFavorite={(Array.isArray(favorites) ? favorites : []).includes(product.id)}
                  onToggleFavorite={onToggleFavorite}
                  currentUser={currentUser}
                  onRequireAuth={onRequireAuth}
                />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Mobile Drawer Filter Modal */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto p-4 sm:p-6 shadow-2xl">
            <FilterSidebar
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              onReset={handleResetFilters}
              onCloseMobile={() => setMobileFilterOpen(false)}
              categories={categories}
              regions={regions}
            />
          </div>
        </div>
      )}

    </div>
  );
}