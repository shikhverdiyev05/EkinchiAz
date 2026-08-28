import { useRef, useState } from 'react';
import { FlaskConical, TreeDeciduous, Wheat, ShieldCheck, Tractor, Map as MapIcon, Wrench, Bird, ShoppingBasket, Microscope, Sprout, ChevronLeft, ChevronRight, Star, Quote, UserPlus, Megaphone, CheckCircle } from 'lucide-react';
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
  onRequireAuth,
  onAddListingClick
}) {
  const saleProducts = products.filter(p => p.type === 'sale').slice(0, 4);
  const rentalProducts = products.filter(p => p.type === 'rent').slice(0, 3);
  
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeDot, setActiveDot] = useState(0);

  const filteredCats = categories.filter(c => c.id !== 'all');

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

  const handleCategoryScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    if (scrollWidth <= clientWidth) return;
    const progress = scrollLeft / (scrollWidth - clientWidth);
    const index = Math.round(progress * (filteredCats.length - 1));
    setActiveDot(index);
  };

  const scrollToIndex = (index) => {
    if (!scrollRef.current) return;
    const { scrollWidth, clientWidth } = scrollRef.current;
    const targetScroll = (index / (filteredCats.length - 1)) * (scrollWidth - clientWidth);
    scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
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

          <div className="relative group/carousel">
            {/* Fade edges */}
            <div className="hidden sm:block absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-[#f8fafc] via-[#f8fafc]/80 to-transparent z-10 pointer-events-none" />
            <div className="hidden sm:block absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-[#f8fafc] via-[#f8fafc]/80 to-transparent z-10 pointer-events-none" />

            {/* Left Nav Arrow */}
            <button 
              onClick={() => scrollToIndex(Math.max(0, activeDot - 1))}
              className="hidden sm:flex absolute left-1 top-[45%] -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-white shadow-md border border-emerald-100 text-gray-500 hover:text-emerald-600 hover:scale-105 transition-all opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0"
              disabled={activeDot === 0}
            >
              <ChevronLeft className="w-5 h-5 -ml-0.5" />
            </button>

            {/* Right Nav Arrow */}
            <button 
              onClick={() => scrollToIndex(Math.min(filteredCats.length - 1, activeDot + 1))}
              className="hidden sm:flex absolute right-1 top-[45%] -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-white shadow-md border border-emerald-100 text-gray-500 hover:text-emerald-600 hover:scale-105 transition-all opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0"
              disabled={activeDot === filteredCats.length - 1}
            >
              <ChevronRight className="w-5 h-5 ml-0.5" />
            </button>

            <div 
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onScroll={handleCategoryScroll}
              className={`grid grid-cols-2 gap-3 sm:flex sm:items-stretch sm:gap-4 sm:overflow-x-auto sm:snap-x sm:snap-mandatory sm:pb-2 [&::-webkit-scrollbar]:hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filteredCats.map((cat, idx) => {
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

            {/* Dots Pagination */}
            <div className="hidden sm:flex items-center justify-center gap-2 mt-6">
              {filteredCats.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToIndex(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    idx === activeDot 
                      ? 'w-6 h-2 bg-emerald-500 shadow-sm' 
                      : 'w-2 h-2 bg-gray-200 hover:bg-emerald-300'
                  }`}
                  aria-label={`Səhifə ${idx + 1}`}
                />
              ))}
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

        {/* Necə İşləyir? */}
        <section className="relative mt-24">
          <div className="absolute inset-0 bg-emerald-50/50 rounded-[3rem] -mx-4 sm:mx-0"></div>
          <div className="relative z-10 px-4 sm:px-8 py-12 sm:py-16">
            <div className="text-center mb-12 sm:mb-16">
              <span className="text-emerald-600 font-black tracking-wider uppercase text-xs sm:text-sm">İstifadə Yolu</span>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight mt-2">Ekinchi.Az necə işləyir?</h2>
              <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-2xl mx-auto">Sadəcə 3 addımla aqrar bazarın bir parçası olun və qazancınızı artırın.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-emerald-100 via-emerald-300 to-emerald-100 -z-10"></div>
              
              {[
                { step: 1, title: "Qeydiyyatdan Keç", desc: "Nömrəniz və ya emailinizlə cəmi 1 dəqiqəyə öz profilinizi yaradın.", icon: <UserPlus className="w-8 h-8 text-emerald-600" /> },
                { step: 2, title: "Elanını Yerləşdir", desc: "Məhsul, texnika və ya xidmətinizin şəkillərini və məlumatlarını əlavə edin.", icon: <Megaphone className="w-8 h-8 text-emerald-600" /> },
                { step: 3, title: "Müştəri Tap", desc: "Bütün Azərbaycan üzrə minlərlə alıcı və fermerlə birbaşa əlaqə qurun.", icon: <CheckCircle className="w-8 h-8 text-emerald-600" /> }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-emerald-50 mb-6 relative group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold border-4 border-white shadow-sm">
                      {item.step}
                    </div>
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 max-w-[250px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fermerlərin Rəyləri */}
        <section className="py-8 sm:py-12 mt-10">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">Fermerlərin Rəyləri</h2>
            <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-2xl mx-auto">Azərbaycanın dörd bir yanından təsərrüfatını bizimlə böyüdən istifadəçilərimizin fikirləri.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Elvin Məmmədov",
                role: "Fermer, Quba",
                text: "Platforma vasitəsilə 5 tona yaxın alma məhsulumu cəmi 3 gün ərzində topdansatış alıcılarına satdım. Çox rahat və sürətlidir.",
                img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80"
              },
              {
                name: "Aysel Əliyeva",
                role: "Aqronom, Şəki",
                text: "Aqronom xidmətlərimi təklif etmək üçün ən yaxşı məkandır. Müştəri bazam əhəmiyyətli dərəcədə böyüdü.",
                img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
              },
              {
                name: "Rəşad Həsənov",
                role: "Traktor Sahibi, Bərdə",
                text: "Traktorumu boş qaldığı günlərdə icarəyə verirəm. Ekinchi.Az sayəsində texnikam heç vaxt boş dayanmır.",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow duration-300 border border-emerald-50 relative group">
                <Quote className="absolute top-6 right-6 text-emerald-50 w-12 h-12 group-hover:text-emerald-100 transition-colors" />
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-8 relative z-10 font-medium">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <img src={testimonial.img} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
                    <span className="text-xs text-gray-500">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Stats */}
        <section className="py-12 sm:py-16 bg-white/80 rounded-[2rem] border border-emerald-100/80 shadow-sm">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
              {[
                { value: "10,000+", label: "Aktiv Fermer", icon: UserPlus },
                { value: "25,000+", label: "Elan Paylaşıldı", icon: Megaphone },
                { value: "1,200+", label: "Şirkət və Marka", icon: CheckCircle },
                { value: "70+", label: "Rayon və Sahələr", icon: MapIcon }
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center p-4">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl mb-3">
                    <stat.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">Niyə Ekinchi.Az?</h2>
              <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-2xl mx-auto">Azərbaycan fermerlərinin və aqrar şirkətlərinin etmən güvəndiyi platforma.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                { title: "Birbaşa Satış", desc: "Vasitəçisiz alıcı ilə əlaqə qurun, komissiya ödəməyin.", icon: <ShieldCheck className="w-6 h-6 text-emerald-600" /> },
                { title: "Texnika İcarəsi", desc: "Traktor, kombayn, aqreqat icarə verin və ya siz bronlaşdırın.", icon: <Tractor className="w-6 h-6 text-emerald-600" /> },
                { title: "Torpaq İcarəsi", desc: "Münbit sahələr, bağlar və istixanaları uzunmüddətli kira götürün.", icon: <MapIcon className="w-6 h-6 text-emerald-600" /> },
                { title: "Aqronom Dəstəy", desc: "Peşəkar aqronomlardan torpaq analizi, dron çiləmə, budama xidmətləri.", icon: <Microscope className="w-6 h-6 text-emerald-600" /> },
                { title: "Heyvandarlıq", desc: "Damazlıq heyvan, arı ailələri, quşlar al və sat.", icon: <Bird className="w-6 h-6 text-emerald-600" /> },
                { title: "Sosial Paylaşımlar", desc: "Təcrübə, məsləhət, suallar və uğur hikayələrini paylaşın.", icon: <Share2 className="w-6 h-6 text-emerald-600" /> }
              ].map((feature, idx) => (
                <div key={idx} className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 group">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all mb-4 shrink-0">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter / CTA Banner */}
        <section className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 text-white p-8 sm:p-16 text-center shadow-2xl mt-10">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight leading-tight">
              Təsərrüfatınızı onlayn bazara çıxarmağa hazırsınız?
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Azərbaycanın ən böyük aqrar icmasına indi qoşulun. İlk elanınızı tam ödənişsiz yerləşdirin və satışlarınızı sürətləndirin.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => onNavigateListings()}
                className="w-full sm:w-auto px-8 py-4 bg-white text-emerald-900 font-black rounded-2xl hover:bg-gray-50 transition shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Elanlara Bax
              </button>
              <button 
                onClick={onAddListingClick}
                className="w-full sm:w-auto px-8 py-4 bg-emerald-700/50 hover:bg-emerald-600/50 backdrop-blur-md text-white font-black rounded-2xl border border-emerald-500/50 transition shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Yeni Elan Yerləşdir <span>→</span>
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
