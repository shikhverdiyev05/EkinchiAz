/* eslint-disable no-unused-vars */
import React from "react";

export default function HeroSection({ onSearch, onSelectCategory, onNavigateListings }) {
    const [searchTerm, setSearchTerm] = React.useState('');
  
    const handleSearchSubmit = (e) => {
      e.preventDefault();
      if (onSearch) onSearch(searchTerm);
      if (onNavigateListings) onNavigateListings();
    };
  
    return (
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
        {/* Background Gradient Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-emerald-400/20 via-green-300/20 to-teal-400/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
  
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Hero Header */}
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200/80 backdrop-blur-md text-emerald-900 text-xs font-bold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span>Azərbaycanın Birinci Rəqəmsal Aqrar Ticarət və İcarə Portalı</span>
            </div>
  
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.15]">
              Torpaqdan Süfrəyə, <br />
              <span className="bg-gradient-to-r from-emerald-700 via-green-600 to-teal-600 bg-clip-text text-transparent">
                Aqrar Güc Bir Arada
              </span>
            </h1>
  
            <p className="mt-4 text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
              Gübrələr, toxumlar, tinglər və alətləri səbətə ataraq onlayn alın; kənd təsərrüfatı texnikaları və torpaq sahələrini birbaşa satın və ya icarəyə götürün.
            </p>
  
            {/* Quick Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mt-8 relative max-w-2xl mx-auto">
              <div className="flex items-center p-2 rounded-3xl bg-white/90 backdrop-blur-xl border border-emerald-200/90 shadow-xl shadow-emerald-900/5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <div className="pl-3 text-emerald-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
  
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Traktor, toxum, gübrə, torpaq sahəsi və ya dərman axtarın..."
                  className="w-full px-3 py-2 text-sm text-gray-800 placeholder-gray-400 bg-transparent outline-none font-medium"
                />
  
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition active:scale-95 flex items-center gap-1.5 flex-shrink-0"
                >
                  <span>Axtar</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>
  
            {/* Quick Category Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-gray-600">
              <span className="text-gray-400">Populyar:</span>
              {['Gübrələr', 'Toxumlar', 'Belarus MTZ Traktor', 'Fındıq Bağı', 'İcarə Kombayn'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchTerm(tag);
                    if (onSearch) onSearch(tag);
                    if (onNavigateListings) onNavigateListings();
                  }}
                  className="px-3 py-1 rounded-full bg-white/70 hover:bg-emerald-50 hover:text-emerald-800 border border-emerald-100 transition shadow-xs"
                >
                  {tag}
                </button>
              ))}
            </div>
  
          </div>
  
          {/* Stats Strip */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-3xl bg-white/70 backdrop-blur-md border border-emerald-100/80 text-center shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-emerald-800">500+</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">Aktiv Aqrar Elan</p>
            </div>
            <div className="p-4 rounded-3xl bg-white/70 backdrop-blur-md border border-emerald-100/80 text-center shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-emerald-800">1,200+</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">Qeydiyyatlı Fermer</p>
            </div>
            <div className="p-4 rounded-3xl bg-white/70 backdrop-blur-md border border-emerald-100/80 text-center shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-emerald-800">100%</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">Yoxlanılmış Satıcılar</p>
            </div>
            <div className="p-4 rounded-3xl bg-white/70 backdrop-blur-md border border-emerald-100/80 text-center shadow-sm">
              <p className="text-2xl sm:text-3xl font-black text-emerald-800">60+ Rayon</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">Bütün Azərbaycan Üzrə</p>
            </div>
          </div>
  
        </div>
      </section>
    );
  }