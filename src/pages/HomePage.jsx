/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react';
import {
  FlaskConical, TreeDeciduous, Wheat, Share2, ShieldCheck,
  Tractor, Map as MapIcon, Wrench, Bird, ShoppingBasket,
  Microscope, Sprout, ChevronLeft, ChevronRight, Star,
  Quote, UserPlus, Megaphone, CheckCircle, Sparkles,
  Calculator, ArrowRight, Shield, Award, Droplets, Sun,
  Leaf, Calendar, HelpCircle, Layers
} from 'lucide-react';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';

const SEASONAL_TIPS = [
  {
    id: 'spring',
    season: 'Yaz Mövsümü',
    icon: Sprout,
    badge: 'Mart — May',
    title: 'Torpağın Hazırlanması & Toxum Səpini',
    points: [
      'Torpağın dərin şumlanması və kultivasiyası aparılmalı, alaq otları təmizlənməlidir.',
      'Azot və fosfor tərkibli ilkin mineral gübrələr torpağın 10-15 sm qatına verilməlidir.',
      'Pomidor, badımcan və bibər şitilləri istixanalardan açıq sahəyə köçürülməzdən əvvəl bərkidilməlidir.'
    ]
  },
  {
    id: 'summer',
    season: 'Yay Mövsümü',
    icon: Sun,
    badge: 'İyun — Avqust',
    title: 'Damlama Suvarma & Zərərvericilərlə Mübarizə',
    points: [
      'Su itkisinin qarşısını almaq üçün suvarma yalnız səhər tezdən və ya axşam saatlarında aparılmalıdır.',
      'Meyvə bağlarında unlu şeh, pas və kəpənək sürfələrinə qarşı bioloji dərmanlama tətbiq edilməlidir.',
      'Taxıl biçini zamanı kombayn itkilərini minimuma endirmək üçün kəsici aqreqatlar kalibrlənməlidir.'
    ]
  },
  {
    id: 'autumn',
    season: 'Payız Mövsümü',
    icon: Leaf,
    badge: 'Sentyabr — Noyabr',
    title: 'Məhsul Yığımı & Payızlıq Əkinlər',
    points: [
      'Payızlıq buğda və arpa səpini üçün sertifikatlaşdırılmış elit toxum sortlarından istifadə edin.',
      'Yığılmış meyvə və tərəvəzlər üçün soyuducu anbar rütubəti 85-90% səviyyəsində saxlanılmalıdır.',
      'Ağacların dibi bellənməli, üzvi peyin və kalium gübrələri ilə qışa hazırlıq aparılmalıdır.'
    ]
  },
  {
    id: 'winter',
    season: 'Qış Mövsümü',
    icon: Droplets,
    badge: 'Dekabr — Fevral',
    title: 'İstixana İqlimi & Aqrotexnika Qulluğu',
    points: [
      'İstixanalarda gecə temperaturunun +14°C-dən aşağı düşməməsi üçün istilik sistemləri yoxlanılmalıdır.',
      'Qış aylarında traktor və kultivatorların hidravlika və mühərrik yağları dəyişdirilməlidir.',
      'Meyvə bağlarında quru və xəstə budaqların sanitar budanması həyata keçirilməlidir.'
    ]
  }
];


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
  onAddListingClick,
  onNavigate
}) {
  const saleProducts = products.filter(p => p.type === 'sale').slice(0, 4);
  const rentalProducts = products.filter(p => p.type === 'rent').slice(0, 4);
  
  const scrollRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);
  const [activeSeason, setActiveSeason] = useState('spring');

  // Simple Agrarian Calculator State
  const [calcArea, setCalcArea] = useState(1);
  const [calcCrop, setCalcCrop] = useState('wheat');

  const filteredCats = categories.filter(c => c.id !== 'all');

  const scrollToIndex = (index) => {
    if (!scrollRef.current) return;
    const { scrollWidth, clientWidth } = scrollRef.current;
    const targetScroll = (index / (filteredCats.length - 1)) * (scrollWidth - clientWidth);
    scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    setActiveDot(index);
  };

  // Calculator logic
  const getCalcResults = () => {
    const area = parseFloat(calcArea) || 0;
    if (calcCrop === 'wheat') {
      return {
        seed: (area * 200).toFixed(0) + ' kq',
        fertilizer: (area * 150).toFixed(0) + ' kq (Nitroamofoska)',
        yield: (area * 3.5).toFixed(1) + ' ton',
      };
    } else if (calcCrop === 'barley') {
      return {
        seed: (area * 180).toFixed(0) + ' kq',
        fertilizer: (area * 120).toFixed(0) + ' kq',
        yield: (area * 3.0).toFixed(1) + ' ton',
      };
    } else if (calcCrop === 'cotton') {
      return {
        seed: (area * 25).toFixed(0) + ' kq',
        fertilizer: (area * 200).toFixed(0) + ' kq',
        yield: (area * 3.8).toFixed(1) + ' ton',
      };
    } else {
      return {
        seed: (area * 35).toFixed(0) + ' min ədəd şitil',
        fertilizer: (area * 300).toFixed(0) + ' kq',
        yield: (area * 40).toFixed(0) + ' ton',
      };
    }
  };

  const calcRes = getCalcResults();
  const currentSeasonData = SEASONAL_TIPS.find(s => s.id === activeSeason) || SEASONAL_TIPS[0];

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
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative group/carousel">
            <div
              ref={scrollRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth"
              style={{ scrollbarWidth: 'none' }}
            >
              {filteredCats.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.name)}
                  className="shrink-0 w-36 sm:w-44 bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer text-center group flex flex-col items-center justify-between"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                    {cat.icon || '🌱'}
                  </div>
                  <div>
                    <h4 className="font-black text-xs sm:text-sm text-gray-900 group-hover:text-emerald-700 transition">
                      {cat.name}
                    </h4>
                    <span className="text-[10px] text-gray-400 font-bold block mt-0.5">
                      {cat.count ? `${cat.count} elan` : 'Kəşf et'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Featured Sale Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-700">
                Alış & Çatdırılma
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight mt-0.5 sm:mt-1">
                Satışda Olan Aqrar Məhsullar
              </h2>
            </div>
            <button
              onClick={() => onNavigateListings({ type: 'sale' })}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              Hamısına bax <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {saleProducts.map(prod => (
              <ProductCard
                key={prod.id}
                product={prod}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
                onToggleFavorite={onToggleFavorite}
                isFavorite={(Array.isArray(favorites) ? favorites : []).includes(prod.id)}
              />
            ))}
          </div>
        </section>

        {/* Featured Rentals */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-700">
                Texnika & Sahə
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight mt-0.5 sm:mt-1">
                İcarəyə Verilən Aqrotexnikalar
              </h2>
            </div>
            <button
              onClick={() => onNavigateListings({ type: 'rent' })}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              Hamısına bax <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {rentalProducts.map(prod => (
              <ProductCard
                key={prod.id}
                product={prod}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
                onToggleFavorite={onToggleFavorite}
                isFavorite={(Array.isArray(favorites) ? favorites : []).includes(prod.id)}
              />
            ))}
          </div>
        </section>

        {/* Seasonal Agricultural Guide (New Interactive Content) */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Aqronom Məsləhətləri
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                Fəsillər Üzrə Aqrar Təqvim və Tövsiyələr
              </h3>
            </div>

            {/* Season Switcher Pills */}
            <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {SEASONAL_TIPS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSeason(s.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
                    activeSeason === s.id
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s.season}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-emerald-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <currentSeasonData.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-base sm:text-lg text-gray-900">{currentSeasonData.title}</h4>
                  <span className="text-xs font-bold text-emerald-700">{currentSeasonData.badge}</span>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              {currentSeasonData.points.map((pt, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-emerald-100/80 shadow-xs flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700 leading-relaxed">{pt}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Agricultural Calculator (Interactive) */}
        <section className="bg-gradient-to-br from-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 text-xs font-black uppercase text-amber-300">
                <Calculator className="w-3.5 h-3.5" />
                Fermer Köməkçisi
              </div>
              <h3 className="text-2xl sm:text-3xl font-black">
                Əkin və Məhsuldarlıq Kalkulyatoru
              </h3>
              <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                Sahənizin ölçüsünü və əkmək istədiyiniz bitkini daxil edin, tələb olunan toxum, gübrə normasını və təxmini məhsuldarlığı dərhal hesablayın.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1.5">Sahə Ölçüsü (Hektar)</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={calcArea}
                    onChange={(e) => setCalcArea(e.target.value)}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1.5">Bitki Növü</label>
                  <select
                    value={calcCrop}
                    onChange={(e) => setCalcCrop(e.target.value)}
                    className="w-full p-3 bg-emerald-950 border border-white/20 rounded-xl text-white text-sm outline-none focus:border-amber-400"
                  >
                    <option value="wheat">Buğda (Taxıl)</option>
                    <option value="barley">Arpa</option>
                    <option value="cotton">Pambıq</option>
                    <option value="tomato">Pomidor (İstixana/Açıq)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className="bg-white text-gray-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
              <h4 className="font-black text-base text-emerald-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {calcArea} Hektar üçün Təxmini Hesablama
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs font-bold text-gray-500">Tələb Olunan Toxum</span>
                  <span className="text-sm font-black text-gray-900">{calcRes.seed}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs font-bold text-gray-500">Əsas Gübrə Norması</span>
                  <span className="text-sm font-black text-gray-900">{calcRes.fertilizer}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-800">Proqnozlaşdırılan Məhsul</span>
                  <span className="text-sm font-black text-emerald-700">{calcRes.yield}</span>
                </div>
              </div>

              <p className="text-[10px] text-gray-400 italic text-center">
                * Məlumatlar Azərbaycan Elmi-Tədqiqat Əkinçilik İnstitutunun orta aqro-iqlim standartlarına əsaslanır.
              </p>
            </div>

          </div>
        </section>

        {/* Community & Social Feed Teaser */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-black">
              <Share2 className="w-3.5 h-3.5" />
              Sosial Aqrar Şəbəkə
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900">
              Digər Fermerlərin Paylaşımlarına Qoşulun
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-lg">
              Suvarma təcrübələri, ziyanvericilərə qarşı məsləhətlər və texnika təkliflərini birbaşa fermerlərdən oxuyun və ya öz təcrübənizi paylaşın.
            </p>
          </div>

          <button
            onClick={() => onNavigate ? onNavigate('social') : onNavigateListings?.()}
            className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center gap-2 shrink-0"
          >
            Paylaşımlara Keç <ArrowRight className="w-4 h-4" />
          </button>
        </section>

      </div>
    </div>
  );
}
