import { CATEGORIES, REGIONS } from '../data/categories';

export default function FilterSidebar({
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
  selectedRegion,
  setSelectedRegion,
  maxPrice,
  setMaxPrice,
  onReset
}) {
  return (
    <aside className="bg-white/80 backdrop-blur-xl rounded-3xl border border-emerald-100/90 p-5 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
        <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtrlər
        </h3>
        <button
          onClick={onReset}
          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline transition"
        >
          Sıfırla
        </button>
      </div>

      {/* 1. Listing Type Toggle (Hamısı / Satış / İcarə) */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2.5">
          Elan Növü
        </label>
        <div className="grid grid-cols-3 gap-1 bg-emerald-50/80 p-1 rounded-2xl border border-emerald-100">
          <button
            onClick={() => setSelectedType('all')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              selectedType === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-emerald-800'
            }`}
          >
            Hamısı
          </button>
          <button
            onClick={() => setSelectedType('sale')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              selectedType === 'sale'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-emerald-800'
            }`}
          >
            🌱 Satış
          </button>
          <button
            onClick={() => setSelectedType('rent')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              selectedType === 'rent'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-800'
            }`}
          >
            🚜 İcarə
          </button>
        </div>
      </div>

      {/* 2. Categories List */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2.5">
          Kateqoriyalar
        </label>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1 text-xs">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name || (cat.id === 'all' && selectedCategory === 'all');
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id === 'all' ? 'all' : cat.name)}
                className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-100/80 text-emerald-900 font-black'
                    : 'text-gray-600 hover:bg-emerald-50/60 font-medium'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Region Filter */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
          Məkan / Rayon
        </label>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="w-full px-3 py-2.5 rounded-2xl bg-white border border-emerald-100 text-xs font-semibold text-gray-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        >
          {REGIONS.map((reg) => (
            <option key={reg} value={reg === 'Hamısı' ? 'all' : reg}>
              {reg}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Price Slider */}
      <div>
        <div className="flex justify-between items-center text-xs mb-2">
          <label className="font-black uppercase tracking-wider text-gray-700">
            Maksimum Qiymət
          </label>
          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
            {maxPrice >= 200000 ? 'Limitsiz' : `${Number(maxPrice).toLocaleString()} AZN`}
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="200000"
          step="50"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full h-1.5 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>0 AZN</span>
          <span>100K AZN</span>
          <span>200K+ AZN</span>
        </div>
      </div>

    </aside>
  );
}