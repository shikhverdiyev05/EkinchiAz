export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: About Platform */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-white font-black text-xl shadow-lg">
                🌱
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                AqroBazar
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Azərbaycan fermerləri və aqrar biznes sahibləri üçün vahid rəqəmsal e-ticarət və icarə platforması.
            </p>
            <div className="flex items-center gap-3 text-xs text-emerald-300">
              <span>📍 Bakı, Azərbaycan</span>
              <span>•</span>
              <span>📞 +994 12 500 00 00</span>
            </div>
          </div>

          {/* Col 2: Satış Bölməsi */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Satış Məhsulları
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li><button onClick={() => onNavigate('listings')} className="hover:text-white transition">Gübrələr və Preparatlar</button></li>
              <li><button onClick={() => onNavigate('listings')} className="hover:text-white transition">Toxumlar və Heyvan Yemləri</button></li>
              <li><button onClick={() => onNavigate('listings')} className="hover:text-white transition">Ağac və Meyvə Tingləri</button></li>
              <li><button onClick={() => onNavigate('listings')} className="hover:text-white transition">Bağbanlıq və Maldarlıq Alətləri</button></li>
              <li><button onClick={() => onNavigate('listings')} className="hover:text-white transition">Traktor və Texnikalar Satışı</button></li>
              <li><button onClick={() => onNavigate('listings')} className="hover:text-white transition">Torpaq və Əkin Sahələri Satışı</button></li>
            </ul>
          </div>

          {/* Col 3: İcarə və Xidmətlər */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              İcarə Xidmətləri
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li><button onClick={() => onNavigate('listings')} className="hover:text-white transition">Kombayn və Traktor İcarəsi</button></li>
              <li><button onClick={() => onNavigate('listings')} className="hover:text-white transition">Suvarılan Əkin Sahələri İcarəsi</button></li>
              <li><button onClick={() => onNavigate('listings')} className="hover:text-white transition">Otlaq və Fermalar İcarəsi</button></li>
              <li><button onClick={() => onNavigate('faq')} className="hover:text-white transition">İcarə Şərtləri və Sifariş</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-white transition">Fermerlər üçün Bələdçi</button></li>
            </ul>
          </div>

          {/* Col 4: Sosial və Xəbərlər */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Xəbərdar Olun
            </h4>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Aqrar yeniliklər, subsidiya xəbərləri və xüsusi təklifləri qaçırmayın:
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="E-poçt ünvanınız"
                className="w-full px-3 py-2 text-xs rounded-xl bg-emerald-900/60 border border-emerald-800 text-white placeholder-emerald-400 outline-none focus:border-emerald-400"
              />
              <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl transition">
                Qoşul
              </button>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-emerald-900/60 text-center text-xs text-emerald-400/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 AqroBazar. Bütün hüquqlar qorunur.</p>
          <div className="flex gap-6">
            <button onClick={() => onNavigate('about')} className="hover:text-white transition">Haqqımızda</button>
            <button onClick={() => onNavigate('faq')} className="hover:text-white transition">FAQ</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition">Əlaqə</button>
          </div>
        </div>

      </div>
    </footer>
  );
}