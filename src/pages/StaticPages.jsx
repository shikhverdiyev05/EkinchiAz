import { useState, useRef, useEffect } from 'react';
import {
  Info, Users, Target, Heart, Clock, Handshake, ChevronDown,
  Sprout, Tractor, ShoppingBasket, Cpu, Globe, Leaf, Star, CheckCircle,
  FlaskConical, Wheat, TreeDeciduous, MapPin, Phone, Mail,
  ArrowRight, Zap, Shield, TrendingUp, Award, MessageCircle,
  ChevronLeft, ChevronRight, AlertCircle, Loader2
} from 'lucide-react';
import { sendContactMessageApi } from '../services/apiService';

/* ════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { id: 'melumat',     label: 'Məlumat',      icon: Info },
  { id: 'komanda',     label: 'Komandamız',    icon: Users },
  { id: 'missiya',     label: 'Missiyamız',    icon: Target },
  { id: 'deyerler',    label: 'Dəyərlərimiz',  icon: Heart },
  { id: 'tarix',       label: 'Tarixçə',        icon: Clock },
  { id: 'terefdaslar', label: 'Tərəfdaşlar',   icon: Handshake },
];

const TEAM = [
  { role: 'Product Owner',       name: 'Əli Hüseynov',   img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80' },
  { role: 'Project Lead',        name: 'Nərmin Quliyeva', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
  { role: 'IT Business Analyst', name: 'Rauf Əliyev',     img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80' },
  { role: 'UX/UI Designer',      name: 'Günel Muradova',  img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
  { role: 'Front-End Developer', name: 'Tural Babayev',   img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
];

const PARTNERS = [
  { name: 'AqroTexnika MMC', icon: Tractor },
  { name: 'Taxıl Bankı',     icon: Wheat },
  { name: 'BioGübrə ASC',    icon: FlaskConical },
  { name: 'Yaşıl Bağ',       icon: TreeDeciduous },
  { name: 'AqroİnvestAz',    icon: Globe },
  { name: 'FermerNet',       icon: Leaf },
];

const HISTORY = [
  { year: '2023 Q1', title: 'İdeya & Araşdırma',   desc: 'Azərbaycanın aqrar sektorundakı rəqəmsallaşma boşluğunun müəyyənləşdirilməsi, bazar tədqiqatının aparılması.', color: 'emerald' },
  { year: '2023 Q4', title: 'MVP Hazırlığı',         desc: 'Komanda formalaşdı, ilk dizayn konsepsi, texniki arxitektura və MVP spesifikasiyaları hazırlandı.',             color: 'teal' },
  { year: '2024 Q2', title: 'Beta Buraxılışı',       desc: 'İlk 50 fermer ilə qapalı beta testlər başladı, ilk elanlar sisteme əlavə olundu, geri bildirim toplandi.',     color: 'cyan' },
  { year: '2025 Q1', title: 'Açıq Platforma',        desc: 'Platforma ictimaiyyətə açıldı. İcarə, satış, kateqoriya sistemi, axtarış və filterlər aktiv edildi.',           color: 'blue' },
  { year: '2026',    title: 'Genişlənmə Mərhələsi',  desc: 'Sosial modul, sorğu formaları, AI inteqrasiyası, fermer birlikləri ilə tərəfdaşlıq. Mövcud roadmap icra edilir.', color: 'violet' },
];

const VALUES = [
  { icon: Leaf,         color: 'emerald', title: 'Şəffaflıq',     desc: 'Fermer və alıcı arasında açıq, dürüst ticarət mühiti formalaşdırılır.' },
  { icon: Star,         color: 'amber',   title: 'Keyfiyyət',      desc: 'Yalnız doğrulanmış satıcılar və sertifikatlı məhsullar platformada yer alır.' },
  { icon: Globe,        color: 'blue',    title: 'Əlçatanlıq',     desc: 'Ölkənin istənilən bölgəsindən platforma xidmətinə tam mobil çatmaq mümkündür.' },
  { icon: Cpu,          color: 'violet',  title: 'İnnovasiya',      desc: 'AI-dən bulud texnologiyalarına qədər müasir həllər tətbiq edilir.' },
  { icon: Handshake,    color: 'teal',    title: 'Birlik',          desc: 'Fermer-fermer, fermer-sahibkar əməkdaşlığının inkişafı əsas hədəfdir.' },
  { icon: Shield,       color: 'rose',    title: 'Etibarlılıq',    desc: 'Platformada hər əməliyyat izlənir, sənədləşdirilir, şikayət mexanizmi mövcuddur.' },
];

const MISSION_POINTS = [
  { icon: MessageCircle, title: 'Fermerlərarası Əlaqə',         desc: 'Fermerlərin daha sıx əlaqədə olması, yaranan problemləri birlikdə həll etmək, müzakirə aparmaq — platformanın əsas hədəfidir.' },
  { icon: TrendingUp,    title: 'Aqrar Sahənin İnkişafı',       desc: 'Aqrar sahəni daha da inkişaf etdirmək və geniş bir topluluq yaratmaq. Növbəti mərhələdə fermer-sahibkar əməkdaşlığı üçün yeni imkanlar təqdim olunacaq.' },
  { icon: Cpu,           title: 'Süni İntellekt İnteqrasiyası', desc: 'Məhsul xəstəliklərinin avtomatik tanınması, qiymət proqnozlaşdırma, torpaq analizi — süni intellektin inteqrasiyası planlanır.' },
  { icon: ArrowRight,    title: 'Sorğu Formaları & CRM',        desc: 'Fermerlərin dövlət qurumları, aqronom xidmətləri və subsidiya proqramları ilə birbaşa əlaqəsi üçün sorğu formaları da teskil olunacaq.' },
];

/* ════════════════════════════════════════════════════════════════════
   PARTNER AUTO-SCROLL SLIDER
═══════════════════════════════════════════════════════════════════ */
function PartnerSlider() {
  const ref = useRef(null);
  const doubled = [...PARTNERS, ...PARTNERS, ...PARTNERS];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let id, pos = 0;
    const singleW = el.scrollWidth / 3;
    const tick = () => {
      pos += 0.5;
      if (pos >= singleW) pos = 0;
      el.scrollLeft = pos;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div ref={ref} className="flex gap-4 overflow-x-hidden py-3" style={{ scrollbarWidth: 'none' }}>
        {doubled.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className="inline-flex shrink-0 items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 shadow-sm text-sm font-bold text-gray-800 hover:bg-white hover:shadow-md transition-all">
              <Icon className="w-4 h-4 text-emerald-600" />
              {p.name}
            </div>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-emerald-50 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-emerald-50 to-transparent z-10" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ABOUT PAGE
═══════════════════════════════════════════════════════════════════ */
export function AboutPage() {
  const [active, setActive] = useState('melumat');
  const refs = Object.fromEntries(NAV_ITEMS.map(n => [n.id, useRef(null)]));
  
  const teamScrollRef = useRef(null);
  const [activeTeamDot, setActiveTeamDot] = useState(0);

  const handleTeamScroll = () => {
    if (!teamScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = teamScrollRef.current;
    if (scrollWidth <= clientWidth) return;
    const progress = scrollLeft / (scrollWidth - clientWidth);
    const index = Math.round(progress * (TEAM.length - 1));
    setActiveTeamDot(index);
  };

  const scrollTeamTo = (index) => {
    if (!teamScrollRef.current) return;
    const { scrollWidth, clientWidth } = teamScrollRef.current;
    const targetScroll = (index / (TEAM.length - 1)) * (scrollWidth - clientWidth);
    teamScrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  const scrollTo = (id) => {
    setActive(id);
    refs[id]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const obs = NAV_ITEMS.map(({ id }) => {
      const el = refs[id]?.current;
      if (!el) return null;
      const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(id); }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });
      o.observe(el);
      return o;
    }).filter(Boolean);
    return () => obs.forEach(o => o.disconnect());
  }, []);

  return (
    <div className="animate-fadeIn pb-24 lg:pb-16">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 text-white">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-800/30 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-widest mb-6">
              <Sprout className="w-3.5 h-3.5" /> Platforma Haqqında
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
              Ekinchi.Az —<br />
              <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                Yeni Nəsil Aqrar Ekosistem
              </span>
            </h1>
            <p className="text-emerald-100/80 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
              Azərbaycanın fermerlərini, sahibkarlarını və aqrar biznes dünyasını bir araya gətirən, torpaqdan
              süfrəyə bilavasitə körpü quran rəqəmsal platforma.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { val: '500+', lbl: 'Aktiv Elan' },
                { val: '10+',  lbl: 'Kateqoriya' },
                { val: '5',    lbl: 'Komanda Üzvü' },
                { val: '6',    lbl: 'Tərəfdaş' },
              ].map(({ val, lbl }) => (
                <div key={lbl}>
                  <div className="text-3xl font-black text-emerald-300">{val}</div>
                  <div className="text-xs text-emerald-400/80 font-bold mt-0.5">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY: Sidebar + Content ── */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sticky Aside Nav ── */}
          <aside className="lg:w-60 shrink-0">
            <nav className="sticky top-24 bg-white/95 backdrop-blur-xl rounded-3xl border border-emerald-100/80 shadow-sm overflow-hidden">
              <div className="px-3 py-3 border-b border-emerald-50">
                <p className="text-[9px] uppercase font-black tracking-widest text-emerald-600 px-2 py-1">Bölmələr</p>
              </div>
              <div className="p-2 space-y-1">
                {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-left transition-all duration-200 ${
                      active === id
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-200'
                        : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active === id ? 'text-white' : 'text-emerald-500'}`} />
                    {label}
                    {active === id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />}
                  </button>
                ))}
              </div>
            </nav>
          </aside>

          {/* ── Main Content ── */}
          <main className="flex-1 space-y-20 min-w-0">

            {/* ── SECTION: MƏLUMAT ── */}
            <section ref={refs.melumat} id="melumat" className="scroll-mt-28">
              <SectionHeader icon={Info} color="emerald" label="Platforma Məlumatı" title="Biz Kimik?" />

              <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
                <p className="text-base leading-loose text-gray-700">
                  <strong className="text-emerald-800">Ekinchi.Az</strong> Azərbaycanda aqrar sahənin rəqəmsallaşdırılması,
                  fermerlərin bazara birbaşa çıxışının təmin edilməsi və texnika/torpaq icarəsinin asanlaşdırılması
                  məqsədilə yaradılmış innovativ platformadır. Kənd təsərrüfatı sektorunun potensialını tam üzə
                  çıxarmaq üçün texnologiya ilə ənənəvi fermerlik birləşdirilir.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: Sprout,         grad: 'from-emerald-500 to-teal-500',   bg: 'from-emerald-50 to-teal-50',   border: 'border-emerald-100',   title: 'E-Commerce Bölməsi',      desc: 'Sertifikatlı toxumlar, mineral və üzvi gübrələr, bitki mühafizə vasitələri, aqrar alətlər — birbaşa onlayn sifariş.' },
                    { icon: Tractor,        grad: 'from-blue-500 to-cyan-500',       bg: 'from-blue-50 to-cyan-50',       border: 'border-blue-100',       title: 'İcarə & Texnika Portalı', desc: 'Mövsümlük traktor, kombayn, torpaq sahəsi icarəsi — bronlaşdırma formu ilə sürətli sifariş.' },
                    { icon: ShoppingBasket, grad: 'from-amber-500 to-orange-500',    bg: 'from-amber-50 to-orange-50',    border: 'border-amber-100',      title: 'Topdan Ticarət Kanalı',  desc: 'Fermer birliklərinə özel topdan satış qiymətləri, birbaşa müqavilə imkanları.' },
                    { icon: Globe,          grad: 'from-violet-500 to-purple-500',   bg: 'from-violet-50 to-purple-50',   border: 'border-violet-100',     title: 'Rəqəmsal Ekosistem',     desc: 'Sosial şəbəkə, sorğu formaları, AI köməkçisi, fermer topluluğu — yaxın gələcəkdə.' },
                  ].map(({ icon: Icon, grad, bg, border, title, desc }) => (
                    <div key={title} className={`relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br ${bg} border ${border} group hover:shadow-md transition-all`}>
                      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${grad} opacity-10 group-hover:opacity-20 transition-opacity`} />
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center mb-3 shadow-sm`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-black text-gray-900 text-sm mb-1.5">{title}</h4>
                      <p className="text-[11px] text-gray-600 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {[
                    { val: '500+', lbl: 'Aktiv Elan', icon: Sprout,   color: 'emerald' },
                    { val: '10+',  lbl: 'Kateqoriya', icon: ShoppingBasket, color: 'blue' },
                    { val: '5',    lbl: 'Komanda',     icon: Users,    color: 'violet' },
                    { val: '6+',   lbl: 'Tərəfdaş',   icon: Handshake,color: 'amber' },
                  ].map(({ val, lbl, icon: Icon, color }) => (
                    <div key={lbl} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs text-center hover:border-emerald-200 hover:shadow-md transition-all">
                      <div className={`w-8 h-8 rounded-xl bg-${color}-100 flex items-center justify-center mx-auto mb-2`}>
                        <Icon className={`w-4 h-4 text-${color}-600`} />
                      </div>
                      <div className="text-2xl font-black text-gray-900">{val}</div>
                      <div className="text-[10px] font-bold text-gray-400 mt-0.5">{lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── SECTION: KOMANDA ── */}
            <section ref={refs.komanda} id="komanda" className="scroll-mt-28">
              <SectionHeader icon={Users} color="blue" label="İnsanlarımız" title="Komandamız" />
              <p className="text-sm text-gray-600 mb-7 leading-relaxed">
                Ekinchi.Az-ın arxasında aqrar sektor, texnologiya və dizayn sahəsindəki fərqli peşəkar 5 nəfərlik
                çevik komanda durur. Hər üzv platformanın müvəffəqiyyəti üçün öz ekspertizasını tam gücü ilə ortaya qoyur.
              </p>

              <div className="relative w-full overflow-hidden group/team">
                {/* Fade edges */}
                <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-gray-50/50 to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-gray-50/50 to-transparent z-10 pointer-events-none" />

                <div 
                  ref={teamScrollRef}
                  onScroll={handleTeamScroll}
                  className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 px-2 [&::-webkit-scrollbar]:hidden" 
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {TEAM.map((m, i) => (
                    <div key={i} className="relative shrink-0 w-[240px] h-[320px] rounded-[32px] overflow-hidden snap-center group shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 bg-gray-50">
                      <img 
                        src={m.img} 
                        alt={m.name} 
                        className="w-full h-full object-cover grayscale opacity-90 transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100" 
                      />
                      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm px-5 py-4 rounded-[20px] shadow-sm transform transition-transform duration-300">
                        <h3 className="font-black text-gray-900 text-[15px]">{m.name}</h3>
                        <p className="text-[11px] font-bold text-gray-500 mt-1 uppercase tracking-wider">{m.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Naviqasiya oxları və nöqtələr */}
                <div className="flex items-center justify-center gap-4 mt-2">
                  <button 
                    onClick={() => scrollTeamTo(Math.max(0, activeTeamDot - 1))}
                    disabled={activeTeamDot === 0}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 text-gray-500 hover:text-emerald-600 hover:border-emerald-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5 -ml-0.5" />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {TEAM.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => scrollTeamTo(idx)}
                        className={`transition-all duration-300 rounded-full ${
                          idx === activeTeamDot 
                            ? 'w-6 h-2 bg-emerald-500 shadow-sm' 
                            : 'w-2 h-2 bg-gray-300 hover:bg-emerald-300'
                        }`}
                        aria-label={`Komanda üzvü ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <button 
                    onClick={() => scrollTeamTo(Math.min(TEAM.length - 1, activeTeamDot + 1))}
                    disabled={activeTeamDot === TEAM.length - 1}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 text-gray-500 hover:text-emerald-600 hover:border-emerald-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5 ml-0.5" />
                  </button>
                </div>
              </div>
            </section>

            {/* ── SECTION: MİSSİYA ── */}
            <section ref={refs.missiya} id="missiya" className="scroll-mt-28">
              <SectionHeader icon={Target} color="teal" label="Hara gedirik?" title="Missiyamız" />

              {/* Mission quote card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-800 text-white p-8 sm:p-10 mb-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="text-6xl text-emerald-400/40 font-black leading-none mb-2">"</div>
                  <p className="text-base sm:text-xl font-semibold leading-relaxed text-emerald-50 max-w-3xl">
                    Azərbaycanın aqrar sektorunu rəqəmsallaşdırmaq, fermerləri bir-biri ilə və bazarla
                    əlaqələndirmək, problemlərini birlikdə həll etməyə, müzakirə aparmağa imkan yaratmaq
                    və geniş bir aqrar topluluq formalaşdırmaqdır.
                  </p>
                  <p className="mt-4 text-xs text-emerald-400 font-bold">— Ekinchi.Az Komandası</p>
                </div>
              </div>

              <div className="space-y-4">
                {MISSION_POINTS.map(({ icon: Icon, title, desc }, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-sm mb-1">{title}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── SECTION: DƏYƏRLƏR ── */}
            <section ref={refs.deyerler} id="deyerler" className="scroll-mt-28">
              <SectionHeader icon={Heart} color="rose" label="Nəyə inanırıq?" title="Dəyərlərimiz" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {VALUES.map(({ icon: Icon, color, title, desc }) => (
                  <div key={title} className={`p-5 rounded-3xl bg-${color}-50 border border-${color}-100 hover:border-${color}-300 hover:shadow-lg transition-all group cursor-default`}>
                    <div className={`w-11 h-11 rounded-2xl bg-${color}-100 flex items-center justify-center mb-4 group-hover:bg-${color}-500 transition-colors shadow-xs`}>
                      <Icon className={`w-5 h-5 text-${color}-600 group-hover:text-white transition-colors`} />
                    </div>
                    <h4 className="font-black text-gray-900 text-sm mb-2">{title}</h4>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── SECTION: TARİXÇƏ ── */}
            <section ref={refs.tarix} id="tarix" className="scroll-mt-28">
              <SectionHeader icon={Clock} color="amber" label="Yolumuz" title="Tarixçə" />

              <div className="relative">
                {/* Vertical track */}
                <div className="absolute left-5 sm:left-6 top-5 bottom-5 w-0.5 bg-gradient-to-b from-emerald-300 via-teal-300 to-violet-300 hidden sm:block rounded-full" />

                <div className="space-y-5">
                  {HISTORY.map(({ year, title, desc, color }, i) => (
                    <div key={i} className="flex gap-5 sm:gap-6 relative group">
                      {/* Circle node */}
                      <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-full bg-gradient-to-br items-center justify-center z-10 shadow-md ring-4 ring-white"
                        style={{ background: `var(--tw-gradient-from, #10b981)` }}
                      >
                        <div className={`w-12 h-12 rounded-full bg-${color}-500 flex items-center justify-center shadow-sm ring-4 ring-white`}>
                          <span className="text-white font-black text-[9px] text-center leading-tight">{year.includes('Q') ? year.split(' ').join('\n') : year}</span>
                        </div>
                      </div>

                      <div className={`flex-1 p-5 rounded-2xl bg-white border border-${color}-100 hover:border-${color}-300 hover:shadow-md transition-all`}>
                        <div className={`sm:hidden inline-block text-[10px] font-black uppercase text-${color}-700 bg-${color}-100 px-2.5 py-0.5 rounded-full mb-2`}>{year}</div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h4 className="font-black text-gray-900 text-sm">{title}</h4>
                          <span className={`hidden sm:block text-[10px] font-black text-${color}-700 bg-${color}-100 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0`}>{year}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── SECTION: TƏRƏFDAŞLAR ── */}
            <section ref={refs.terefdaslar} id="terefdaslar" className="scroll-mt-28">
              <SectionHeader icon={Handshake} color="purple" label="Birlikdə güclüyük" title="Tərəfdaşlarımız" />

              <p className="text-sm text-gray-600 mb-7 leading-relaxed">
                Ekinchi.Az-ın missiyasına inanan, Azərbaycan aqrar sektorunu güclü görmək istəyən tərəfdaş
                şirkət və qurumlarla əməkdaşlıq edirik.
              </p>

              {/* Auto-scroll slider */}
              <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-6 mb-6 overflow-hidden">
                <PartnerSlider />
              </div>

              {/* Partner cards grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {PARTNERS.map(({ name, icon: Icon }) => (
                  <div key={name} className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 transition-colors shadow-xs">
                      <Icon className="w-4 h-4 text-emerald-700 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">{name}</span>
                      <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Tərəfdaş</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Become partner CTA */}
              <div className="mt-6 p-6 rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-black text-base mb-1">Tərəfdaş olun</h4>
                  <p className="text-xs text-emerald-200 leading-relaxed max-w-sm">
                    Ekinchi.Az ilə tərəfdaşlıq qurmaq istəyirsinizsə bizimlə əlaqə saxlayın.
                  </p>
                </div>
                <div className="flex gap-3 text-xs shrink-0">
                  <a href="mailto:info@ekinchi.az" className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 px-4 py-2.5 rounded-2xl font-bold transition-all">
                    <Mail className="w-3.5 h-3.5" /> info@ekinchi.az
                  </a>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}

/* ── Section Header Helper ── */
function SectionHeader({ icon: Icon, color, label, title }) {
  return (
    <div className="flex items-start gap-4 mb-7">
      <div className={`w-12 h-12 rounded-2xl bg-${color}-100 flex items-center justify-center shrink-0 shadow-xs`}>
        <Icon className={`w-6 h-6 text-${color}-700`} />
      </div>
      <div>
        <span className={`text-[10px] font-black uppercase tracking-widest text-${color}-600`}>{label}</span>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">{title}</h2>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   FAQ PAGE
═══════════════════════════════════════════════════════════════════ */
const FAQ_CATS = [
  {
    label: 'Ümumi',
    icon: Info,
    color: 'emerald',
    faqs: [
      { q: 'Ekinchi.Az nə üçün yaradılıb?', a: 'Ekinchi.Az Azərbaycanda aqrar sahənin rəqəmsallaşdırılması, fermerlərin bazara birbaşa çıxışının təmin edilməsi, texnika/torpaq icarəsinin asanlaşdırılması məqsədilə yaradılmış innovativ platformadır. Fermerdən alıcıya birbaşa əlaqə qurulmasını hədəfləyirik.' },
      { q: 'Platforma ödənişlidirmi?', a: 'Xeyr. İlkin mərhələdə bütün fermerlər, sahibkarlar və icarəçilər üçün elan yerləşdirmək, baxmaq və müraciət etmək tamamilə pulsuzdur. Gələcəkdə premium xidmət paketləri nəzərdə tutulur.' },
      { q: 'Platformada qeydiyyat məcburidirmi?', a: 'Elanları baxmaq üçün qeydiyyat tələb olunmur. Lakin elan yerləşdirmək, sevimlilərə əlavə etmək, icarə sifarişi vermək üçün hesab açmaq lazımdır. Qeydiyyat yalnız 1 dəqiqə çəkir.' },
      { q: 'Hansı regionlara xidmət göstərilir?', a: 'Azərbaycanın bütün regionlarına xidmət göstərilir — Bakı, Gəncə, Mingəçevir, Lənkəran, Şirvan, Bərdə, Naxçıvan MR və digər bütün rayon mərkəzləri daxildir.' },
    ],
  },
  {
    label: 'Satış & Alış',
    icon: ShoppingBasket,
    color: 'amber',
    faqs: [
      { q: 'Hansı məhsulları birbaşa səbətə əlavə edib ala bilərəm?', a: 'Gübrələr, ağac və bitki tingləri, toxumlar, heyvan yemlər, aqrar dərmanlar, arıçılıq, bağbanlıq və maldarlıq alətlərini birbaşa səbətə əlavə edərək sifariş edə bilərsiniz.' },
      { q: 'Kənd təsərrüfatı texnikaları niyə səbətə əlavə olunmur?', a: 'Texnika və torpaq sahələri yüksək dəyərə malik olduğundan onlar üçün fərqli axın yaradılıb — satıcı ilə birbaşa əlaqə qurulur və ya platforma üzərindən icarə sifarişi verilir.' },
      { q: 'Sifariş verdikdən sonra çatdırılma müddəti nə qədərdir?', a: 'Çatdırılma müddəti satıcıdan satıcıya dəyişir. Şəhərdaxili sifarişlər üçün 1-2 iş günü, regionlararası sifarişlər üçün 3-5 iş günü gözlənilir.' },
      { q: 'Ödəniş üsulları hansılardır?', a: 'Hazırda nağd ödəniş (çatdırılmada) və bank köçürməsi dəstəklənir. Onlayn kartla ödəniş sistemi tezliklə aktiv ediləcək.' },
    ],
  },
  {
    label: 'İcarə & Texnika',
    icon: Tractor,
    color: 'blue',
    faqs: [
      { q: 'İcarə sifarişi necə işləyir?', a: 'İcarəyə verilən texnika və ya torpaq elanında "İcarə sifarişi" düyməsini sıxaraq tarixi, müddəti, məkanı qeyd edirsiniz. Sorğunuz dərhal satıcıya ötürülür və 24 saat ərzində əlaqə saxlanılır.' },
      { q: 'İcarəni ləğv etmək mümkündürmü?', a: 'Bəli, icarə başlamazdan 48 saat əvvəl ləğvetmə sorğusu göndərə bilərsiniz. Ləğvetmə şərtləri satıcı ilə razılaşma əsasında müəyyənləşdirilir.' },
      { q: 'Sahə və torpaq icarəsi üçün sənəd lazımdırmı?', a: 'Torpaq sahəsi icarəsi zamanı iki tərəf arasında icarə müqaviləsi tövsiyə olunur. Platforma müqavilə şablonu yaxın zamanda hazırlanacaq.' },
      { q: 'Texnika arızalananda nə etmək lazımdır?', a: 'Problem yaranan halda dərhal platforma üzərindən satıcıya bildiriş göndərin. Satıcı texnikanı dəyişdirmək və ya problemi həll etmək öhdəliyini daşıyır.' },
    ],
  },
  {
    label: 'Hesab & Elan',
    icon: Users,
    color: 'violet',
    faqs: [
      { q: 'Necə qeydiyyatdan keçmək olar?', a: 'Saytın yuxarı hissəsindəki "Daxil ol" düyməsini sıxın, adınızı, email və ya nömrənizi daxil edib "Qeydiyyat" seçin. Proses yalnız 1 dəqiqə çəkir.' },
      { q: 'Elanımı necə yerləşdirirəm?', a: 'Hesaba giriş etdikdən sonra "Elan Yerləşdir" düyməsini sıxın. Məhsul/texnika məlumatları, qiymət, şəkil əlavə edib göndərin. Elanınız 5 dəqiqə ərzində aktivləşir.' },
      { q: 'Elanı sonradan redaktə edə bilərəmmi?', a: 'Hələlik redaktə funksiyası inkişaf mərhələsindədir. Elanı silmək üçün profil bölməsindəki "Elanlarım" hissəsindən istifadə edə bilərsiniz.' },
      { q: 'Şifrəmi unutduqda nə etmək lazımdır?', a: 'Daxil olma ekranındakı "Şifrəni unutdum" bağlantısına basın. Email ünvanınıza sıfırlama linki göndəriləcək. Bağlantı 15 dəqiqə keçərlidir.' },
    ],
  },
];

export function FaqPage() {
  const [cat, setCat] = useState(0);
  const [open, setOpen] = useState(null);

  const handleCat = (i) => { setCat(i); setOpen(null); };
  const current = FAQ_CATS[cat];

  return (
    <div className="animate-fadeIn pb-24 lg:pb-16">

      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-950 to-teal-900 text-white py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-widest mb-4">
            Tez-tez Verilən Suallar
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mb-4">Suallarınız var?</h1>
          <p className="text-emerald-200/80 text-base max-w-lg mx-auto">
            Ekinchi.Az haqqında ən çox verilən sualların cavablarını aşağıda tapa bilərsiniz.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Category nav */}
          <div className="lg:w-56 shrink-0">
            <nav className="lg:sticky lg:top-24 bg-white/95 backdrop-blur-xl rounded-3xl border border-emerald-100 shadow-sm overflow-hidden">
              <div className="px-3 py-3 border-b border-emerald-50">
                <p className="text-[9px] uppercase font-black tracking-widest text-emerald-600 px-2 py-1">Mövzular</p>
              </div>
              <div className="p-2 space-y-1">
                {FAQ_CATS.map(({ label, icon: Icon, color }, i) => (
                  <button
                    key={label}
                    onClick={() => handleCat(i)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-left transition-all duration-200 ${
                      cat === i
                        ? `bg-${color}-600 text-white shadow-md`
                        : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0`} />
                    {label}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* FAQ accordions */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-5">
              {(() => { const I = current.icon; return <I className={`w-5 h-5 text-${current.color}-600`} />; })()}
              <h2 className="text-lg font-black text-gray-900">{current.label}</h2>
              <span className={`ml-auto text-[10px] font-black text-${current.color}-700 bg-${current.color}-100 px-2.5 py-0.5 rounded-full`}>
                {current.faqs.length} sual
              </span>
            </div>

            <div className="space-y-3">
              {current.faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border overflow-hidden bg-white transition-all duration-200 ${
                    open === i ? `border-${current.color}-300 shadow-md` : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full px-5 py-4 text-left flex items-start gap-3"
                  >
                    <span className={`w-6 h-6 rounded-lg bg-${current.color}-100 text-${current.color}-700 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5`}>
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm font-bold text-gray-900 text-left">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
                  </button>
                  {open === i && (
                    <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-50 ml-9 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA banner */}
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-black text-sm">Başqa sualınız var?</p>
                <p className="text-xs text-emerald-200 mt-0.5">Komandamız sizə kömək etməyə hazırdır.</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <a href="tel:+994556731407" className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 rounded-xl font-bold transition-all">
                  <Phone className="w-3.5 h-3.5" /> +994 55 673 14 07
                </a>
                <a href="mailto:info@ekinchi.az" className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 rounded-xl font-bold transition-all">
                  <Mail className="w-3.5 h-3.5" /> info@ekinchi.az
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   CONTACT PAGE
═══════════════════════════════════════════════════════════════════ */
export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (name, value) => {
    let error = '';
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) error = 'Bu xana doldurulmalıdır';
        else if (/\d/.test(value)) error = 'Rəqəm daxil etmək olmaz';
        else if (!/^[A-Za-zƏəŞşÇçÖöĞğIıİi\s\-]+$/.test(value)) error = 'Yalnız hərflərdən istifadə edin';
        break;
      case 'email':
        if (!value.trim()) error = 'Email daxil edilməlidir';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Düzgün email formatı deyil';
        break;
      case 'phone':
        if (!value.trim()) error = 'Nömrə daxil edilməlidir';
        else {
          const digits = value.replace(/\D/g, '');
          if (digits.length !== 9 && digits.length !== 10) error = 'Nömrə tam deyil (məs: 55 123 45 67)';
        }
        break;
      case 'message':
        if (!value.trim()) error = 'Mesaj daxil edilməlidir';
        else if (value.trim().length < 10) error = 'Mesaj ən azı 10 simvol olmalıdır';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let val = value;
    if (name === 'phone') {
      val = val.replace(/[^\d\s-]/g, ''); // Hərfləri dərhal sil
    } else if (name === 'firstName' || name === 'lastName') {
      val = val.replace(/[\d]/g, ''); // Rəqəmləri dərhal sil
    }

    setFormData(prev => ({ ...prev, [name]: val }));
    
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validate(name, val) }));
    }
    if (apiError) setApiError(null);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      newErrors[key] = validate(key, formData[key]);
      touched[key] = true;
    });
    
    setErrors(newErrors);
    setTouched({ ...touched });

    if (Object.values(newErrors).some(err => err !== '')) {
      return;
    }

    setLoading(true);
    setApiError(null);
    try {
      await sendContactMessageApi({
        type: 'contact_page',
        senderName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        phone: `+994${formData.phone.replace(/\D/g, '')}`,
        message: formData.message.trim(),
      });
      setSent(true);
    } catch (err) {
      console.error('Mesaj göndərilmədi:', err);
      setApiError('Xəta baş verdi. Zəhmət olmasa daha sonra yenidən cəhd edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 lg:py-20 animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">
          Bizimlə əlaqə saxlayın
        </h1>
        <p className="text-gray-500 text-sm sm:text-base font-bold max-w-2xl mx-auto">
          Layihəniz, suallarınız və ya təklifləriniz barədə danışmaq istəyirsiniz? Sizinlə ünsiyyət qurmaqdan məmnun olarıq!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 max-w-5xl mx-auto">
        {/* Form Column */}
        <div className="order-2 lg:order-1">
          {sent ? (
            <div className="py-12 px-8 text-center text-emerald-700 bg-emerald-50 rounded-3xl border border-emerald-100 h-full flex flex-col items-center justify-center">
              <CheckCircle className="w-12 h-12 mb-4 text-emerald-600" />
              <h3 className="text-xl font-black mb-2">Müraciətiniz qəbul edildi!</h3>
              <p className="text-sm font-bold text-emerald-800/70">
                Təşəkkür edirik. Komandamız sizinlə tezliklə əlaqə saxlayacaq.
              </p>
              <button 
                onClick={() => { setSent(false); setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' }); setTouched({}); setErrors({}); }}
                className="mt-6 px-6 py-2 rounded-xl bg-white border border-emerald-200 text-emerald-700 text-sm font-bold hover:bg-emerald-100 transition-colors"
              >
                Yeni mesaj göndər
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {apiError && (
                <div className="flex items-center gap-2 p-4 text-sm font-bold text-red-700 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{apiError}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-700">Ad</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleChange} onBlur={handleBlur} type="text" placeholder="Adınız" className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm font-semibold ${errors.firstName && touched.firstName ? 'border-red-400 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'}`} />
                  {errors.firstName && touched.firstName && <p className="text-xs text-red-500 font-bold mt-1 pl-1">{errors.firstName}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-700">Soyad</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleChange} onBlur={handleBlur} type="text" placeholder="Soyadınız" className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm font-semibold ${errors.lastName && touched.lastName ? 'border-red-400 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'}`} />
                  {errors.lastName && touched.lastName && <p className="text-xs text-red-500 font-bold mt-1 pl-1">{errors.lastName}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">Email</label>
                <input required name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} type="email" placeholder="siz@sirket.com" className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm font-semibold ${errors.email && touched.email ? 'border-red-400 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'}`} />
                {errors.email && touched.email && <p className="text-xs text-red-500 font-bold mt-1 pl-1">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">Əlaqə nömrəsi</label>
                <div className="flex gap-2">
                  <div className="shrink-0 flex items-center justify-center px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 font-bold text-sm">
                    +994
                  </div>
                  <input required name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} type="tel" placeholder="55 123 45 67" className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm font-semibold ${errors.phone && touched.phone ? 'border-red-400 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'}`} />
                </div>
                {errors.phone && touched.phone && <p className="text-xs text-red-500 font-bold mt-1 pl-1">{errors.phone}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700">Mesajınız</label>
                <textarea name="message" value={formData.message} onChange={handleChange} onBlur={handleBlur} rows="5" required placeholder="Mesajınızı bura yazın..." className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm font-semibold resize-none ${errors.message && touched.message ? 'border-red-400 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'}`}></textarea>
                {errors.message && touched.message && <p className="text-xs text-red-500 font-bold mt-1 pl-1">{errors.message}</p>}
              </div>
              <button disabled={loading} type="submit" className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Göndərilir...' : 'Mesajı göndər'}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Column */}
        <div className="order-1 lg:order-2 flex flex-col gap-10">
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-2">Zəng edin</h3>
            <p className="text-sm text-gray-500 mb-4 font-bold">Komandamızla həftəiçi 09:00 - 18:00 arası əlaqə saxlayın.</p>
            <a href="tel:+994556731407" className="inline-flex items-center gap-2 text-emerald-700 font-black hover:text-emerald-800 transition-colors">
              <Phone className="w-5 h-5" /> +994 (55) 673 14 07
            </a>
          </div>

          <div>
            <h3 className="text-lg font-black text-gray-900 mb-2">Bizə yazın</h3>
            <p className="text-sm text-gray-500 mb-4 font-bold">Səmimi komandamızla onlayn əlaqə qurun.</p>
            <div className="space-y-4">
              <a href="#" className="flex items-center gap-3 text-gray-900 font-bold text-sm hover:text-emerald-600 transition-colors">
                <MessageCircle className="w-5 h-5 text-emerald-600" /> Canlı çat başlat
              </a>
              <a href="mailto:info@ekinchi.az" className="flex items-center gap-3 text-gray-900 font-bold text-sm hover:text-emerald-600 transition-colors">
                <Mail className="w-5 h-5 text-emerald-600" /> Email göndər
              </a>
              <a href="#" className="flex items-center gap-3 text-gray-900 font-bold text-sm hover:text-emerald-600 transition-colors">
                <Globe className="w-5 h-5 text-emerald-600" /> Sosial mediada yazın
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black text-gray-900 mb-2">Ziyarət edin</h3>
            <p className="text-sm text-gray-500 mb-4 font-bold">Baş ofisimizdə qonağımız olun.</p>
            <a href="#" className="inline-flex items-start gap-2 text-gray-900 font-bold text-sm hover:text-emerald-600 transition-colors max-w-[250px]">
              <MapPin className="w-5 h-5 text-emerald-600 shrink-0 -mt-0.5" /> 
              Bakı ş., Nərimanov r-nu, Əhməd Rəcəbli küç. 1/9
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SOCIAL FEED PAGE
═══════════════════════════════════════════════════════════════════ */
export function SocialFeedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-6">
      <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
        <Users className="w-10 h-10 text-emerald-700" />
      </div>
      <h1 className="text-3xl font-black text-gray-900">Aqrar Sosial Şəbəkə və Paylaşımlar</h1>
      <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
        Tezliklə: Fermerlərin təcrübə mübadiləsi, aqronom məsləhətləri, məhsul xəstəliklərinin foto ilə
        təyini və sosial müzakirə platforması bu bölmədə aktivləşəcək.
      </p>
      <div className="inline-block px-4 py-2 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs">
        İnkişaf Mərhələsindədir
      </div>
    </div>
  );
}
