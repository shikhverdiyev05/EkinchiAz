/* eslint-disable no-unused-vars */
import React from 'react';
import { FlaskConical, TreeDeciduous, Wheat, ShieldCheck, Tractor, Map as MapIcon, Wrench, Bird, ShoppingBasket, Microscope, Sprout } from 'lucide-react';

export default function FilterSidebar({
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
  selectedRegion,
  setSelectedRegion,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onReset,
  onCloseMobile,
  categories = [],
  regions = []
}) {
  const getCategoryIcon = (name) => {
    if (name?.includes('Gübrə')) return <FlaskConical className="w-3.5 h-3.5" />;
    if (name?.includes('Ağac') || name?.includes('Bitki') || name?.includes('Ting')) return <TreeDeciduous className="w-3.5 h-3.5" />;
    if (name?.includes('Toxum') || name?.includes('Yem')) return <Wheat className="w-3.5 h-3.5" />;
    if (name?.includes('Dərman')) return <ShieldCheck className="w-3.5 h-3.5" />;
    if (name?.includes('Texnika')) return <Tractor className="w-3.5 h-3.5" />;
    if (name?.includes('Torpaq') || name?.includes('Bağ') || name?.includes('Sahə')) return <MapIcon className="w-3.5 h-3.5" />;
    if (name?.includes('Ləvazimat') || name?.includes('Alət')) return <Wrench className="w-3.5 h-3.5" />;
    if (name?.includes('Heyvan') || name?.includes('Quşçu')) return <Bird className="w-3.5 h-3.5" />;
    if (name?.includes('Topdan') || name?.includes('Məhsul')) return <ShoppingBasket className="w-3.5 h-3.5" />;
    if (name?.includes('Aqronom') || name?.includes('Servis')) return <Microscope className="w-3.5 h-3.5" />;
    return <Sprout className="w-3.5 h-3.5" />;
  };

  // Kateqoriyaları obyekt → string-ə çeviririk
  const activeCategories = (Array.isArray(categories) ? categories : [])
    .filter(c => c && c.id !== 'all')
    .map(c => ({
      ...c,
      id:   String(c?.id   || c?.name || 'cat'),
      name: typeof c?.name === 'string' ? c.name : String(c?.name || c?.id || 'Kateqoriya'),
      icon: typeof c?.icon === 'string' ? c.icon : '🌱',
    }));

  // Regionları təhlükəsiz string massivinə çeviririk
  const activeRegions = (Array.isArray(regions) ? regions : [])
    .map(r => (typeof r === 'string' ? r : (r?.name || r?.id || '')))
    .map(r => (typeof r === 'string' ? r : String(r || '')))
    .filter(r => r && r !== 'Hamısı' && r !== 'all');

  const handleQuickBudget = (min, max) => {
    if (setMinPrice) setMinPrice(min !== null ? String(min) : '');
    if (setMaxPrice) setMaxPrice(max !== null ? String(max) : '');
  };

  return (
    <aside className="bg-white/90 backdrop-blur-xl rounded-3xl border border-emerald-100/90 p-4 sm:p-5 shadow-xs space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
        <h3 className="font-black text-gray-900 text-sm sm:text-base flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filtrlər</span>
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 transition underline underline-offset-2"
          >
            Sıfırla
          </button>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 1. Listing Type Switcher */}
      <div>
        <label className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
          Elan Növü
        </label>
        <div className="grid grid-cols-3 gap-1 bg-emerald-50/80 p-1 rounded-2xl border border-emerald-100">
          <button
            onClick={() => setSelectedType('all')}
            className={`py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
              selectedType === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-emerald-800'
            }`}
          >
            Hamısı
          </button>
          <button
            onClick={() => setSelectedType('sale')}
            className={`py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
              selectedType === 'sale'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-emerald-800'
            }`}
          >
            🌱 Satış
          </button>
          <button
            onClick={() => setSelectedType('rent')}
            className={`py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
              selectedType === 'rent'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-blue-800'
            }`}
          >
            🚜 İcarə
          </button>
        </div>
      </div>

      {/* 2. Categories List */}
      <div>
        <label className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
          Kateqoriyalar ({activeCategories.length})
        </label>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1 text-xs no-scrollbar">
          {activeCategories.map((cat) => {
            const catName = String(cat.name || '');
            const catIcon = getCategoryIcon(catName);
            const isSelected = selectedCategory === catName;
            return (
              <button
                key={cat.id || catName}
                onClick={() => setSelectedCategory(catName)}
                className={`w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition flex items-center justify-between text-xs ${
                  isSelected
                    ? 'bg-emerald-100 text-emerald-900 font-black'
                    : 'text-gray-600 hover:bg-emerald-50 font-medium'
                }`}
              >
                <span className="truncate flex items-center gap-1.5">
                  <span className={`${isSelected ? 'text-emerald-700' : 'text-emerald-600'}`}>{catIcon}</span>
                  <span>{catName}</span>
                </span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0 ml-1"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Region Filter (Məkan / Rayon) */}
      <div>
        <label className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
          Məkan / Rayon ({activeRegions.length})
        </label>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="w-full px-3 py-2 sm:py-2.5 rounded-2xl bg-white border border-emerald-100 text-xs font-bold text-gray-800 outline-none focus:border-emerald-500 shadow-xs"
        >
          <option value="all">Bütün Regionlar (Hamısı)</option>
          {activeRegions.map((regName, idx) => (
            <option key={idx} value={regName}>
              {regName}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Qiymət Filteri (Min & Max User Input) */}
      <div className="space-y-2">
        <label className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-700">
          Qiymət Aralığı (AZN)
        </label>

        {/* Min və Max Input Sahələri */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-gray-500 font-semibold block mb-0.5">Min Qiymət</span>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="any"
                value={minPrice ?? ''}
                onChange={(e) => setMinPrice && setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full pl-2.5 pr-8 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-900 outline-none focus:border-emerald-500"
              />
              <span className="absolute right-2 top-2 text-[10px] font-bold text-gray-400">AZN</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-gray-500 font-semibold block mb-0.5">Max Qiymət</span>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="any"
                value={maxPrice ?? ''}
                onChange={(e) => setMaxPrice && setMaxPrice(e.target.value)}
                placeholder="Limitsiz"
                className="w-full pl-2.5 pr-8 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-900 outline-none focus:border-emerald-500"
              />
              <span className="absolute right-2 top-2 text-[10px] font-bold text-gray-400">AZN</span>
            </div>
          </div>
        </div>

        {/* Sürətli Büdcə Teqləri */}
        <div className="flex flex-wrap gap-1 pt-1">
          <button
            type="button"
            onClick={() => handleQuickBudget(0, 50)}
            className="px-2 py-1 rounded-lg bg-gray-50 hover:bg-emerald-50 hover:text-emerald-800 text-[10px] font-bold text-gray-600 border border-gray-200 transition"
          >
            50 AZN-dək
          </button>
          <button
            type="button"
            onClick={() => handleQuickBudget(50, 500)}
            className="px-2 py-1 rounded-lg bg-gray-50 hover:bg-emerald-50 hover:text-emerald-800 text-[10px] font-bold text-gray-600 border border-gray-200 transition"
          >
            50 - 500 AZN
          </button>
          <button
            type="button"
            onClick={() => handleQuickBudget(500, 5000)}
            className="px-2 py-1 rounded-lg bg-gray-50 hover:bg-emerald-50 hover:text-emerald-800 text-[10px] font-bold text-gray-600 border border-gray-200 transition"
          >
            500 - 5,000 AZN
          </button>
          <button
            type="button"
            onClick={() => handleQuickBudget('', '')}
            className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 transition"
          >
            Hamısı
          </button>
        </div>
      </div>

      {/* Mobile Close / Apply Button */}
      {onCloseMobile && (
        <button
          onClick={onCloseMobile}
          className="lg:hidden w-full py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-md"
        >
          Filtrləri Tətbiq Et
        </button>
      )}

    </aside>
  );
}