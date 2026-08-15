import { useState } from 'react';

export default function Footer({ onNavigate, onSelectCategory }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setSubscribed(false);
    }, 4000);
  };

  const handleCategoryClick = (catName) => {
    if (onSelectCategory) {
      onSelectCategory(catName);
    } else if (onNavigate) {
      onNavigate('listings');
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-emerald-950 via-gray-950 to-black text-emerald-100/90 border-t border-emerald-900/60 mt-16 sm:mt-24 overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* 1. Üst Güvən Bloku (Trust Badges) */}
      <div className="border-b border-emerald-900/50 bg-emerald-950/60 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            <div className="flex items-center gap-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-700/50 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 group-hover:bg-emerald-600 transition-all text-emerald-300 group-hover:text-white">
                🌱
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white">Yoxlanılmış Satıcılar</h4>
                <p className="text-[10px] sm:text-xs text-emerald-300/70 mt-0.5">100% real təsərrüfat elanları</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-700/50 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 group-hover:bg-emerald-600 transition-all text-emerald-300 group-hover:text-white">
                🚜
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white">Müasir İcarə Portalı</h4>
                <p className="text-[10px] sm:text-xs text-emerald-300/70 mt-0.5">Traktor, kombayn və sahələr</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-700/50 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 group-hover:bg-emerald-600 transition-all text-emerald-300 group-hover:text-white">
                💳
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white">Onlayn Sifarişlər</h4>
                <p className="text-[10px] sm:text-xs text-emerald-300/70 mt-0.5">Səbət və qapıda təhvil</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-700/50 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 group-hover:bg-emerald-600 transition-all text-emerald-300 group-hover:text-white">
                📞
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-white">Birbaşa Əlaqə</h4>
                <p className="text-[10px] sm:text-xs text-emerald-300/70 mt-0.5">WhatsApp və zənglə danışıq</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Əsas Footer Bölməsi */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Sütun 1: Logo & Haqqında (2 colspan on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onNavigate('home')}>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-emerald-500/20">
                🌱
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight block">
                  AqroBazar
                </span>
                <span className="text-[9px] font-bold text-emerald-400 tracking-widest uppercase block -mt-1">
                  Rəqəmsal Aqrar Portal
                </span>
              </div>
            </div>

            <p className="text-xs text-emerald-200/75 leading-relaxed pr-0 sm:pr-4">
              Azərbaycan fermerləri və aqrar biznes sahibləri üçün vahid rəqəmsal e-ticarət və texnika/torpaq icarə platforması. Torpaqdan süfrəyə, bütün aqrar güc bir arada.
            </p>

            <div className="space-y-2 pt-2 text-xs text-emerald-300/90 font-medium">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Bakı şəhəri, Heydər Əliyev pr. 105, Azərbaycan</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+994125000000" className="hover:text-emerald-400 transition">+994 (12) 500-00-00</a>
              </div>
              <div className="flex items-center gap-2">
                <span>✉️</span>
                <a href="mailto:info@aqrobazar.az" className="hover:text-emerald-400 transition">info@aqrobazar.az</a>
              </div>
            </div>
          </div>

          {/* Sütun 2: Populyar Kateqoriyalar */}
          <div className="space-y-3.5">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
              Kateqoriyalar
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-200/75">
              <li>
                <button onClick={() => handleCategoryClick('Gübrələr və Kimyəvi Maddələr')} className="hover:text-white hover:translate-x-1 transition-all">
                  🧪 Gübrələr & Kimyəvi Maddələr
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Ağac və Bitkilər')} className="hover:text-white hover:translate-x-1 transition-all">
                  🌳 Meyvə və Tinglər
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Toxumlar və Heyvan Yemləri')} className="hover:text-white hover:translate-x-1 transition-all">
                  🌾 Toxumlar & Yemlər
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Kənd Təsərrüfatı Texnikaları')} className="hover:text-white hover:translate-x-1 transition-all">
                  🚜 Traktorlar & Kombaynlar
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Torpaq, Bağ və Əkin Sahələri')} className="hover:text-white hover:translate-x-1 transition-all">
                  🗺️ Əkin & Bağ Sahələri
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Təsərrüfat Ləvazimatları')} className="hover:text-white hover:translate-x-1 transition-all">
                  🛠️ Suvarma & Alətlər
                </button>
              </li>
            </ul>
          </div>

          {/* Sütun 3: Sürətli Keçidlər */}
          <div className="space-y-3.5">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
              Platforma
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-200/75">
              <li>
                <button onClick={() => onNavigate('listings')} className="hover:text-white hover:translate-x-1 transition-all">
                  🌾 Bütün Elanlar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('add-listing')} className="hover:text-white hover:translate-x-1 transition-all font-bold text-amber-400">
                  ➕ Yeni Elan Yerləşdir
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('social')} className="hover:text-white hover:translate-x-1 transition-all">
                  💬 Aqrar Sosial Şəbəkə
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white hover:translate-x-1 transition-all">
                  ℹ️ Haqqımızda & Missiya
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-white hover:translate-x-1 transition-all">
                  ❓ Tez-tez Verilən Suallar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white hover:translate-x-1 transition-all">
                  📞 Əlaqə & Dəstək
                </button>
              </li>
            </ul>
          </div>

          {/* Sütun 4: Abunəlik & Sosial Şəbəkələr */}
          <div className="space-y-4">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
              Yeniliklərə Qoşulun
            </h4>
            <p className="text-xs text-emerald-200/75 leading-relaxed">
              Dövlət subsidiyaları, aqrar qiymət endirimləri və ən son elanları e-poçtunuzla alın:
            </p>

            {subscribed ? (
              <div className="p-3 rounded-2xl bg-emerald-900/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold animate-fadeIn">
                ✓ Təşəkkürlər! E-poçtunuz qeydə alındı.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input 
                  type="email" 
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="adiniz@email.az"
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-emerald-950/80 border border-emerald-800 text-white placeholder-emerald-500/70 outline-none focus:border-emerald-400 transition"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-emerald-950 font-black text-xs rounded-2xl shadow-md transition active:scale-95"
                >
                  Abunə Ol
                </button>
              </form>
            )}

            {/* Sosial Şəbəkə İkonları */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block mb-2">Bizi İzləyin:</span>
              <div className="flex gap-2 text-xs">
                <a href="#" className="w-8 h-8 rounded-xl bg-emerald-900/80 border border-emerald-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition">
                  📱
                </a>
                <a href="#" className="w-8 h-8 rounded-xl bg-emerald-900/80 border border-emerald-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition">
                  💬
                </a>
                <a href="#" className="w-8 h-8 rounded-xl bg-emerald-900/80 border border-emerald-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition">
                  📸
                </a>
                <a href="#" className="w-8 h-8 rounded-xl bg-emerald-900/80 border border-emerald-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition">
                  🌐
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* 3. Alt Müəlliflik Hüququ və Şərtlər */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400/80">
          <p className="text-center sm:text-left">
            © 2026 <strong>AqroBazar</strong>. Bütün hüquqlar qorunur. Azərbaycanın aqrar inkişafı üçün hazırlandı.
          </p>
          <div className="flex flex-wrap justify-center gap-5 sm:gap-6 text-emerald-300/80 font-medium">
            <button onClick={() => onNavigate('about')} className="hover:text-white transition">Haqqımızda</button>
            <button onClick={() => onNavigate('faq')} className="hover:text-white transition">Qaydalar & FAQ</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition">Bizimlə Əlaqə</button>
          </div>
        </div>

      </div>

    </footer>
  );
}