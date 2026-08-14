/* eslint-disable no-unused-vars */
import  { useState } from 'react';

export default function HeroSection({ onSearch, onSelectCategory, onNavigateListings }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
    if (onNavigateListings) onNavigateListings();
  };

  return (
    <section className="relative overflow-hidden pt-4 pb-12 sm:pt-12 sm:pb-20">
      {/* Arxa Fon Gradientləri (Blur Effect) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 sm:h-96 bg-gradient-to-br from-emerald-400/25 via-green-300/20 to-teal-300/15 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Əsas Hero Başlığı */}
        <div className="text-center max-w-3xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-emerald-100/90 border border-emerald-200/80 backdrop-blur-md text-emerald-950 text-[10px] sm:text-xs font-bold mb-4 sm:mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
            <span>Azərbaycanın Birinci Rəqəmsal Aqrar Ticarət & İcarə Portalı</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.18] sm:leading-[1.12]">
            Torpaqdan Süfrəyə, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-800 via-green-600 to-teal-600 bg-clip-text text-transparent">
              Aqrar Güc Bir Arada
            </span>
          </h1>

          <p className="mt-3 sm:mt-5 text-xs sm:text-base md:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto px-2">
            Gübrələr, toxumlar, tinglər və alətləri onlayn səbətlə alın; kənd təsərrüfatı texnikaları və əkin sahələrini birbaşa satın və ya icarəyə götürün.
          </p>

          {/* Sürətli Axtarış Paneli */}
          <form onSubmit={handleSearchSubmit} className="mt-6 sm:mt-8 max-w-2xl mx-auto px-1">
            <div className="flex items-center p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-xl border border-emerald-200/90 shadow-lg shadow-emerald-900/5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              
              <div className="pl-2 sm:pl-3 text-emerald-600 flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Traktor, toxum, gübrə, torpaq sahəsi axtarın..."
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none font-medium"
              />

              <button
                type="submit"
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition active:scale-95 flex items-center gap-1.5 flex-shrink-0"
              >
                <span>Axtar</span>
                <svg className="w-3.5 h-3.5 hidden sm:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>

          {/* Populyar Teqlər */}
          <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-gray-600 px-2">
            <span className="text-gray-400">Populyar:</span>
            {['Gübrələr', 'Toxumlar', 'Belarus Traktor', 'Fındıq Bağı', 'Kombayn İcarəsi'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchTerm(tag);
                  if (onSearch) onSearch(tag);
                  if (onNavigateListings) onNavigateListings();
                }}
                className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-emerald-50 hover:text-emerald-900 border border-emerald-100 transition shadow-xs text-[10px] sm:text-xs"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>

        {/* Statistika Bloku (4-lü Responsive Grid) */}
        <div className="mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-md border border-emerald-100/90 text-center shadow-xs">
            <p className="text-xl sm:text-3xl font-black text-emerald-800 tracking-tight">500+</p>
            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 mt-0.5">Aktiv Aqrar Elan</p>
          </div>

          <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-md border border-emerald-100/90 text-center shadow-xs">
            <p className="text-xl sm:text-3xl font-black text-emerald-800 tracking-tight">1,200+</p>
            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 mt-0.5">Qeydiyyatlı Fermer</p>
          </div>

          <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-md border border-emerald-100/90 text-center shadow-xs">
            <p className="text-xl sm:text-3xl font-black text-emerald-800 tracking-tight">100%</p>
            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 mt-0.5">Yoxlanılmış Satıcılar</p>
          </div>

          <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-md border border-emerald-100/90 text-center shadow-xs">
            <p className="text-xl sm:text-3xl font-black text-emerald-800 tracking-tight">60+ Rayon</p>
            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 mt-0.5">Bütün Azərbaycan</p>
          </div>
        </div>

      </div>
    </section>
  );
}