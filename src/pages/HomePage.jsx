import React, { useRef, useState } from 'react';
import { FlaskConical, TreeDeciduous, Wheat, ShieldCheck, Tractor, Map as MapIcon, Wrench, Bird, ShoppingBasket, Microscope, Sprout } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';

export default function HomePage({
  products = [],
  categories = [],
  regions = [],
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
  
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-24 lg:pb-16 animate-fadeIn">
      
      {/* Hero Section */}
      <HeroSection 
        products={products}
        categories={categories}
        regions={regions}
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

          <div className="relative">
            <div 
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className={`grid grid-cols-2 gap-3 sm:flex sm:items-stretch sm:gap-4 sm:overflow-x-auto sm:pb-4 custom-scrollbar ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            >
              {categories.filter(c => c.id !== 'all').map((cat, idx) => {
                // İkon seçimi
                const getCategoryIcon = (name) => {
                  if (name?.includes('Gübrə')) return <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6" />;
                  if (name?.includes('Ağac') || name?.includes('Bitki') || name?.includes('Ting')) return <TreeDeciduous className="w-5 h-5 sm:w-6 sm:h-6" />;
                  if (name?.includes('Toxum') || name?.includes('Yem')) return <Wheat className="w-5 h-5 sm:w-6 sm:h-6" />;
                  if (name?.includes('Dərman')) return <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />;
                  if (name?.includes('Texnika')) return <Tractor className="w-5 h-5 sm:w-6 sm:h-6" />;
                  if (name?.includes('Torpaq') || name?.includes('Bağ') || name?.includes('Sahə')) return <MapIcon className="w-5 h-5 sm:w-6 sm:h-6" />;
                  if (name?.includes('Ləvazimat') || name?.includes('Alət')) return <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />;
                  if (name?.includes('Heyvan') || name?.includes('Quşçu')) return <Bird className="w-5 h-5 sm:w-6 sm:h-6" />;
                  if (name?.includes('Topdan') || name?.includes('Məhsul')) return <ShoppingBasket className="w-5 h-5 sm:w-6 sm:h-6" />;
                  if (name?.includes('Aqronom') || name?.includes('Servis')) return <Microscope className="w-5 h-5 sm:w-6 sm:h-6" />;
                  return <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />;
                };
                const icon = getCategoryIcon(cat.name);

                // Məcburi description fallback — DEFAULT_CATEGORIES-dən götürülür
                const fallbackDesc = {
                  'Gübrələr və Kimyəvi Maddələr': 'Azot, fosfor, kalium, mikroelementlər və üzvi kompost gübrələri',
                  'Ağac, Bitki və Meyvə Tingləri': 'Sertifikatlı meyvə tingləri, dekorativ ağaclar və gül kolları',
                  'Toxumlar və Heyvan Yemləri': 'Məhsuldar taxıl, tərəvəz toxumları və yüksək proteinli yemlər',
                  'Aqrar və Heyvan Dərmanları': 'Zərərverici, alaq və xəstəliklərə qarşı dərmanlar',
                  'Kənd Təsərrüfatı Texnikaları': 'Traktorlar, kombaynlar, kotanlar və aqrar texnikalar',
                  'Torpaq, Bağ və Əkin Sahələri': 'Münbit suvarılan torpaqlar, meyvə bağları, istixanalar',
                  'Təsərrüfat və Bağ Ləvazimatları': 'Damla suvarma, arıçılıq, budama alətləri və şitillik ləvazimatları',
                  'Heyvandarlıq və Quşçuluq': 'Damazlıq iribuynuzlu heyvanlar, arı ailələri, quşlar',
                  'Topdan Aqrar Məhsul Satışı': 'Fermerdən birbaşa bal, meyvə-tərəvəz və taxıl məhsulları',
                  'Aqronom və Aqro-Servis Xidmətləri': 'Torpaq analizindən dronla çiləməyə qədər aqrar xidmətlər',
                };
                const desc = cat.description || fallbackDesc[cat.name] || 'Azərbaycan fermerlərinin aqrar elanları';

                return (
                  <div
                    key={cat.id || cat.name}
                    onClick={() => onNavigateListings({ category: cat.name })}
                    className={`group p-4 sm:p-5 rounded-3xl bg-white/90 backdrop-blur-md border border-emerald-100 hover:border-emerald-400 hover:bg-emerald-50/60 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex-col h-full sm:w-[240px] lg:w-[260px] sm:snap-start sm:shrink-0 ${idx >= 4 ? 'hidden sm:flex' : 'flex'}`}
                  >
                    {/* İkon */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center font-bold text-xl group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs shrink-0">
                      {icon}
                    </div>

                    {/* Başlıq + Description */}
                    <div className="flex-1 mt-3">
                      <h3 className="font-bold text-gray-900 text-xs sm:text-[13px] leading-snug group-hover:text-emerald-800 transition line-clamp-2 h-[34px]">
                        {cat.name}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1.5 leading-relaxed line-clamp-3 h-[48px]">
                        {desc}
                      </p>
                    </div>

                    {/* Alt Footer */}
                    <div className="mt-3 pt-2.5 border-t border-emerald-100/80 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-emerald-700 shrink-0">
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700">
                        {cat.type === 'sale' ? 'Satış' : cat.type === 'both' ? 'Satış & İcarə' : 'İcarə'}
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform text-base leading-none">→</span>
                    </div>
                  </div>
                );
              })}
            </div>
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
