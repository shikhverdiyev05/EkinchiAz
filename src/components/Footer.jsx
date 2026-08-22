import { useState } from 'react';
import { 
  MapPin, Phone, Mail, 
  FlaskConical, TreeDeciduous, Wheat, Tractor, Map, Wrench, 
  List, PlusCircle, MessageSquare, Info, HelpCircle
} from 'lucide-react';
import LogoImg from '../assets/logowobg.png';

// Sosial media ikonları üçün yığcam SVG komponentləri
const FbIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);
const IgIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const TwIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const LiIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

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

      {/* Əsas Footer Bölməsi */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Sütun 1: Logo & Haqqında */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onNavigate('home')}>
              <img src={LogoImg} alt="Ekinchi.Az" className="w-11 h-11 object-contain" />
              <div>
                <span className="text-2xl font-black text-white tracking-tight block">
                  Ekinchi.Az
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
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>Bakı şəhəri, Heydər Əliyev pr. 105, Azərbaycan</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500" />
                <a href="tel:+994556731407" className="hover:text-emerald-400 transition">+994 55 673 14 07</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500" />
                <a href="mailto:info@ekinchi.az" className="hover:text-emerald-400 transition">info@ekinchi.az</a>
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
                <button onClick={() => handleCategoryClick('Gübrələr və Kimyəvi Maddələr')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                  <FlaskConical className="w-3.5 h-3.5" /> Gübrələr & Kimyəvi Maddələr
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Ağac və Bitkilər')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                  <TreeDeciduous className="w-3.5 h-3.5" /> Meyvə və Tinglər
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Toxumlar və Heyvan Yemləri')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                  <Wheat className="w-3.5 h-3.5" /> Toxumlar & Yemlər
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Kənd Təsərrüfatı Texnikaları')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                  <Tractor className="w-3.5 h-3.5" /> Traktorlar & Kombaynlar
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Torpaq, Bağ və Əkin Sahələri')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                  <Map className="w-3.5 h-3.5" /> Əkin & Bağ Sahələri
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Təsərrüfat Ləvazimatları')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5" /> Suvarma & Alətlər
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
                <button onClick={() => onNavigate('listings')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                  <List className="w-3.5 h-3.5" /> Bütün Elanlar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('add-listing')} className="hover:text-white hover:translate-x-1 transition-all font-bold text-amber-400 flex items-center gap-2">
                  <PlusCircle className="w-3.5 h-3.5" /> Yeni Elan Yerləşdir
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('social')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" /> Aqrar Sosial Şəbəkə
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                  <Info className="w-3.5 h-3.5" /> Haqqımızda & Missiya
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5" /> Tez-tez Verilən Suallar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> Əlaqə & Dəstək
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
              <div className="flex gap-2 text-emerald-100">
                <a href="#" className="w-8 h-8 rounded-xl bg-emerald-900/80 border border-emerald-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition">
                  <FbIcon />
                </a>
                <a href="#" className="w-8 h-8 rounded-xl bg-emerald-900/80 border border-emerald-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition">
                  <IgIcon />
                </a>
                <a href="#" className="w-8 h-8 rounded-xl bg-emerald-900/80 border border-emerald-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition">
                  <TwIcon />
                </a>
                <a href="#" className="w-8 h-8 rounded-xl bg-emerald-900/80 border border-emerald-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition">
                  <LiIcon />
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Sponsorlar və Tərəfdaşlar */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-emerald-900/50">
          <h4 className="text-[10px] text-center uppercase tracking-widest text-emerald-500/80 mb-6 font-bold">
            Tərəfdaşlarımız və Sponsorlar
          </h4>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Temp sponsor logoları */}
            <div className="flex items-center gap-2 text-emerald-100 font-bold text-sm">
              <Tractor className="w-5 h-5" /> AqroTexnika MMC
            </div>
            <div className="flex items-center gap-2 text-emerald-100 font-bold text-sm">
              <Wheat className="w-5 h-5" /> Taxıl Bankı
            </div>
            <div className="flex items-center gap-2 text-emerald-100 font-bold text-sm">
              <FlaskConical className="w-5 h-5" /> BioGübrə ASC
            </div>
            <div className="flex items-center gap-2 text-emerald-100 font-bold text-sm">
              <TreeDeciduous className="w-5 h-5" /> Yaşıl Bağ
            </div>
            <div className="flex items-center gap-2 text-emerald-100 font-bold text-sm">
              <Map className="w-5 h-5" /> Aqroİnvest
            </div>
          </div>
        </div>

        {/* Alt Müəlliflik Hüququ və Şərtlər */}
        <div className="mt-8 pt-6 border-t border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400/80">
          <p className="text-center sm:text-left">
            © 2026 <strong>Ekinchi.Az</strong>. Bütün hüquqlar qorunur. Azərbaycanın aqrar inkişafı üçün hazırlandı.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-emerald-300/80 font-medium">
            <button onClick={() => onNavigate('about')} className="hover:text-white transition">Haqqımızda</button>
            <button onClick={() => onNavigate('faq')} className="hover:text-white transition">Qaydalar & FAQ</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition">Bizimlə Əlaqə</button>
            <span className="hidden sm:inline text-emerald-900/50">|</span>
            <button onClick={() => alert('Məxfilik Siyasəti səhifəsi hazırlanır.')} className="hover:text-white transition">Məxfilik Siyasəti</button>
            <button onClick={() => alert('İstifadə Şərtləri səhifəsi hazırlanır.')} className="hover:text-white transition">İstifadə Şərtləri</button>
          </div>
        </div>

      </div>

    </footer>
  );
}
