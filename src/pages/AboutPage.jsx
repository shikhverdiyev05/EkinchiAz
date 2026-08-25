/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react';
import {
  Info, Users, Target, Heart, Clock, Handshake,
  Sprout, Tractor, ShoppingBasket, Cpu, Globe, Leaf, Star,
  FlaskConical, Wheat, TreeDeciduous, Mail,
  ArrowRight, Shield, TrendingUp, MessageCircle, Sparkles, Check
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'melumat',     label: 'Melumat',      icon: Info },
  { id: 'komanda',     label: 'Komandamiz',   icon: Users },
  { id: 'missiya',     label: 'Missiyamiz',   icon: Target },
  { id: 'deyerler',   label: 'Deyerlerimiz', icon: Heart },
  { id: 'tarix',      label: 'Tarixce',       icon: Clock },
  { id: 'terefdaslar',label: 'Terefdaslar',   icon: Handshake },
];

const TEAM = [
  { role: 'Product Owner',       name: 'Sovket Kerimov',   bio: 'Platformanin strateji baxisi, aqrar sahenin reqemsallaShdirilmasi ve mehsul inkisafinin rehberi.', skills: ['Aqrar Iqtisadiyyat','Mehsul Idareaetmesi','Strategiya'], img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80', color: 'emerald' },
  { role: 'Project Lead',        name: 'Nadir Maxsudlu',   bio: 'Layihenin idareaedilmesi, komanda koordinasiyasi ve icra proseslerine nezaret eden lider.',         skills: ['Agile / Scrum','Komanda Idareaetmesi','Emeliyyatlar'],  img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', color: 'teal' },
  { role: 'IT Business Analyst', name: 'Aqsin Huseynli',   bio: 'Fermer ve istifadeci telablerinin tahlili, biznes proseslerinin sistemleSHdirilmesi mutexessisi.',   skills: ['Biznes Analitika','Proses Modellesdirme','Data Analiz'],   img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80', color: 'blue' },
  { role: 'UX/UI Designer',      name: 'Yasmin Huseynova', bio: 'Sade, intuitiv ve fermerler ucun rahat istifade edile bilecek muasir interfeyslerin yaradicisi.',     skills: ['UI/UX Dizayn','Istifadeci Tecrubesi','Prototiplesdirme'], img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80', color: 'violet' },
  { role: 'Front-End Developer', name: 'Mail Sixverdiyev',  bio: 'Platformanin interaktiv, suretli ve responsiv veb tetbiq kodlaSHdirilmasini heyata keciren muhendis.', skills: ['React / Vite','Tailwind CSS','Web Performance'],          img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', color: 'rose' },
];

const COLOR_MAP = {
  emerald: { ring: 'ring-emerald-400', dot: 'bg-emerald-500', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30', skill: 'bg-emerald-500/10 text-emerald-200 border-emerald-400/20' },
  teal:    { ring: 'ring-teal-400',    dot: 'bg-teal-500',    badge: 'bg-teal-500/20 text-teal-300 border-teal-400/30',         skill: 'bg-teal-500/10 text-teal-200 border-teal-400/20' },
  blue:    { ring: 'ring-blue-400',    dot: 'bg-blue-500',    badge: 'bg-blue-500/20 text-blue-300 border-blue-400/30',         skill: 'bg-blue-500/10 text-blue-200 border-blue-400/20' },
  violet:  { ring: 'ring-violet-400',  dot: 'bg-violet-500',  badge: 'bg-violet-500/20 text-violet-300 border-violet-400/30',   skill: 'bg-violet-500/10 text-violet-200 border-violet-400/20' },
  rose:    { ring: 'ring-rose-400',    dot: 'bg-rose-500',    badge: 'bg-rose-500/20 text-rose-300 border-rose-400/30',         skill: 'bg-rose-500/10 text-rose-200 border-rose-400/20' },
};

const PARTNERS = [
  { name: 'AqroTexnika MMC', icon: Tractor },
  { name: 'Taxil Banki',     icon: Wheat },
  { name: 'BioGubre ASC',    icon: FlaskConical },
  { name: 'Yasil Bag',       icon: TreeDeciduous },
  { name: 'AqroInvestAz',    icon: Globe },
  { name: 'FermerNet',       icon: Leaf },
];

const HISTORY = [
  { year: '2023 Q1', title: 'Ideya & Arashdirma',   desc: 'Azerbaycanin aqrar sektorundaki reqemsallasma boslugunun mueyyenleshdirilmesi, bazar tedqiqatinin aparilmasi.' },
  { year: '2023 Q4', title: 'MVP Hazirliqi',         desc: 'Komanda formalaShdi, ilk dizayn konsepsi, texniki arxitektura ve MVP spesifikasiyalari hazirland.' },
  { year: '2024 Q2', title: 'Beta Buraxilisi',       desc: 'Ilk 50 fermer ile qapali beta testler baSladi, ilk elanlar sisteme elave olundu, geri bildirim toplandi.' },
  { year: '2025 Q1', title: 'Aciq Platforma',        desc: 'Platforma ictimaiyyete acildi. Icare, satis, kateqoriya sistemi, axtaris ve filterler aktiv edildi.' },
  { year: '2026',    title: 'Genishlenme Merhelesi', desc: 'Sosial modul, sorgu formalari, AI inteqrasiyasi, fermer birlikler ile terefdashliq. Roadmap icra edilir.' },
];

const VALUES = [
  { icon: Leaf,      bg: 'bg-emerald-50', border: 'border-emerald-100', ibg: 'bg-emerald-100', ic: 'text-emerald-700', title: 'Seffafliqa',  desc: 'Fermer ve alici arasinda aciq, durust ticaraet muhiti formalaShdirilir.' },
  { icon: Star,      bg: 'bg-amber-50',   border: 'border-amber-100',   ibg: 'bg-amber-100',   ic: 'text-amber-700',   title: 'Keyfiyyat',  desc: 'Yalniz dogrulanmiS saticilir ve sertifikatli mehsullar platformada yer alir.' },
  { icon: Globe,     bg: 'bg-blue-50',    border: 'border-blue-100',    ibg: 'bg-blue-100',    ic: 'text-blue-700',    title: 'Elcatanliqa',desc: 'Olkenin istanilan bolgesinden platforma xidmetine tam mobil catmaq mumkundur.' },
  { icon: Cpu,       bg: 'bg-violet-50',  border: 'border-violet-100',  ibg: 'bg-violet-100',  ic: 'text-violet-700',  title: 'Innovasiya', desc: 'AI-den bulud texnologiyalarina qeder muasir hellor tetbiq edilir.' },
  { icon: Handshake, bg: 'bg-teal-50',    border: 'border-teal-100',    ibg: 'bg-teal-100',    ic: 'text-teal-700',    title: 'Birlik',     desc: 'Fermer-fermer, fermer-sahibkar emedaSHliqinin inkisafi esas hedafdir.' },
  { icon: Shield,    bg: 'bg-rose-50',    border: 'border-rose-100',    ibg: 'bg-rose-100',    ic: 'text-rose-700',    title: 'Etibarlilik',desc: 'Platformada her emeliyyat izlenir, senedleSHdirilir, Sikayat mexanizmi movcuddur.' },
];

const MISSION_POINTS = [
  { icon: MessageCircle, title: 'Fermerlararasi Elaqe',         desc: 'Fermerler daha six elaqede olsun, yaranan problemlari birlikde hell etsin, muzakire aparsin.' },
  { icon: TrendingUp,    title: 'Aqrar Sahenin Inkisafi',       desc: 'Aqrar saheni inkisaf etdirmek ve genis topluluq yaratmaq — novbeti merhelede yeni imkanlar.' },
  { icon: Cpu,           title: 'Suni Intellekt Inteqrasiyasi', desc: 'Mehsul xesteliklerinin tanimmasi, qiymeyit proqnozlasdirma, torpaq analizi planlanir.' },
  { icon: ArrowRight,    title: 'Sorgu Formalari & CRM',        desc: 'Fermerler dovlet qurumlari ve subsidiya proqramlari ile birbasSa elaqe ucun sorgu formalari.' },
];

function SectionHeader({ icon: Icon, label, title }) {
  return (
    <div className="flex items-start gap-3.5 mb-7">
      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-5 h-5 text-emerald-700" />
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-0.5">{label}</p>
        <h2 className="text-lg sm:text-2xl font-black text-gray-900 leading-tight">{title}</h2>
      </div>
    </div>
  );
}

function PartnerTicker() {
  const ref = useRef(null);
  const items = [...PARTNERS, ...PARTNERS, ...PARTNERS];
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf, pos = 0;
    const w = el.scrollWidth / 3;
    const step = () => { pos = (pos + 0.5) % w; el.scrollLeft = pos; raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="relative overflow-hidden py-1">
      <div ref={ref} className="flex gap-2.5 overflow-x-hidden" style={{ scrollbarWidth: 'none' }}>
        {items.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-gray-800 hover:border-emerald-300 transition-colors">
              <Icon className="w-3.5 h-3.5 text-emerald-600" />
              {p.name}
            </div>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent z-10" />
    </div>
  );
}

export function AboutPage() {
  const [selectedMember, setSelectedMember] = useState(0);
  const sectionRefs = useRef({});

  const member = TEAM[selectedMember] || TEAM[0];
  const colors = COLOR_MAP[member.color];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-4">
            <Sprout className="w-3 h-3" /> Platforma Haqqinda
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3">
            Ekinchi.Az —{' '}
            <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
              Yeni Nesil Aqrar Ekosistem
            </span>
          </h1>
          <p className="text-emerald-100/70 text-sm sm:text-base max-w-xl leading-relaxed mb-7">
            Azerbaycanin fermerlerini, sahibkarlarini ve aqrar biznes dunyasini bir araya getiren reqemsal platforma.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {[['500+','Aktiv Elan'],['10+','Kateqoriya'],['5','Komanda'],['6+','Terefdaslar']].map(([v,l]) => (
              <div key={l} className="bg-white/10 border border-white/10 rounded-2xl px-4 py-2 text-center">
                <div className="text-xl sm:text-2xl font-black text-emerald-300">{v}</div>
                <div className="text-[10px] text-emerald-200/70 font-semibold mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">

        {/* MELUMAT */}
        <section ref={el => sectionRefs.current.melumat = el} id="melumat" className="scroll-mt-32">
          <SectionHeader icon={Info} label="Platforma Melumat" title="Biz Kimik?" />
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-5">
            <strong className="text-emerald-800 font-black">Ekinchi.Az</strong> Azerbaycanda aqrar sahenin reqemsallaShdirilmasi,
            fermerler ucun bazara birbasSa cixiSin temin edilmesi ve texnika/torpaq icaresinin asanlashdirilmasi
            meqsedile yaradilmiS innovativ platformadir.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: Sprout,         grad: 'from-emerald-500 to-teal-600',   bg: 'bg-emerald-50',  bd:'border-emerald-100',  title:'E-Commerce',         desc:'Toxumlar, gubreler, bitki dermanlar ve aletler.' },
              { icon: Tractor,        grad: 'from-blue-500 to-cyan-600',      bg: 'bg-blue-50',     bd:'border-blue-100',     title:'Icare & Texnika',    desc:'Movsumlu traktor, kombayn ve torpaq bronu.' },
              { icon: ShoppingBasket, grad: 'from-amber-500 to-orange-500',   bg: 'bg-amber-50',    bd:'border-amber-100',    title:'Topdan Satis',       desc:'Xususi topdan qiymeti ve birbasSa muqavile.' },
              { icon: Globe,          grad: 'from-violet-500 to-purple-600',  bg: 'bg-violet-50',   bd:'border-violet-100',   title:'Reqemsal Ekosistem', desc:'Sosial Sebeke, AI komekci ve fermer icmasi.' },
            ].map(({ icon: Icon, grad, bg, bd, title, desc }) => (
              <div key={title} className={`p-4 sm:p-5 rounded-2xl ${bg} border ${bd} hover:shadow-md transition-all`}>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center mb-3 text-white shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-black text-gray-900 text-xs sm:text-sm mb-1">{title}</h4>
                <p className="text-[11px] text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* KOMANDA */}
        <section ref={el => sectionRefs.current.komanda = el} id="komanda" className="scroll-mt-32">
          <SectionHeader icon={Users} label="Komandamiz" title="Pesekar Komanda" />
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
            <div className="xl:col-span-5 space-y-2">
              {TEAM.map((m, idx) => {
                const isActive = selectedMember === idx;
                return (
                  <button
                    key={m.name}
                    onClick={() => setSelectedMember(idx)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-700 border-emerald-600 shadow-md shadow-emerald-700/20'
                        : 'bg-white border-gray-100 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm'
                    }`}
                  >
                    <img src={m.img} alt={m.name} className={`w-11 h-11 rounded-xl object-cover ring-2 ${isActive ? 'ring-white/30' : 'ring-emerald-100'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`font-black text-sm truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>{m.name}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-wider truncate ${isActive ? 'text-emerald-200' : 'text-emerald-700'}`}>{m.role}</p>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />}
                  </button>
                );
              })}
            </div>
            <div className="xl:col-span-7 bg-gray-900 rounded-3xl p-5 sm:p-7 shadow-xl border border-white/5 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/8 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 flex items-start gap-4 mb-5">
                <img src={member.img} alt={member.name} className={`w-20 h-20 rounded-2xl object-cover ring-2 ${colors.ring} ring-offset-2 ring-offset-gray-900 shadow-lg shrink-0`} />
                <div className="flex-1 pt-1">
                  <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${colors.badge} mb-2`}>{member.role}</span>
                  <h3 className="text-white font-black text-base sm:text-lg leading-tight">{member.name}</h3>
                  <div className={`w-7 h-0.5 rounded-full ${colors.dot} mt-1.5 opacity-80`} />
                </div>
              </div>
              <p className="relative z-10 text-gray-400 text-xs sm:text-sm leading-relaxed mb-5">{member.bio}</p>
              <div className="relative z-10 mb-5">
                <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-2">Ekspertiza</p>
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map(s => (
                    <span key={s} className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${colors.skill}`}>{s}</span>
                  ))}
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-1.5 pt-4 border-t border-white/10">
                {TEAM.map((_, i) => (
                  <button key={i} onClick={() => setSelectedMember(i)}
                    className={`rounded-full transition-all duration-200 ${selectedMember === i ? 'w-5 h-2 ' + colors.dot : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'}`}
                  />
                ))}
                <span className="ml-auto text-[10px] text-gray-600 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Ekinchi.Az
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* MISSIYA */}
        <section ref={el => sectionRefs.current.missiya = el} id="missiya" className="scroll-mt-32">
          <SectionHeader icon={Target} label="Hara gedirik?" title="Missiyamiz" />
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-800 text-white p-6 sm:p-8 mb-4">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <p className="text-sm sm:text-lg font-medium leading-relaxed text-emerald-50 max-w-2xl">
                Azerbaycanin aqrar sektorunu reqemsallashdirmaq, fermerleri bir-biri ile ve bazarla
                elagelendirmek ve genis bir aqrar topluluq formalaShdurmaq.
              </p>
              <p className="mt-3 text-xs text-emerald-400 font-bold">— Ekinchi.Az Komandasi</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {MISSION_POINTS.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="flex gap-3 p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-xs sm:text-sm mb-1">{title}</h4>
                  <p className="text-[11px] text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DEYERLER */}
        <section ref={el => sectionRefs.current.deyerler = el} id="deyerler" className="scroll-mt-32">
          <SectionHeader icon={Heart} label="Neyee inaniriq?" title="Deyerlerimiz" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {VALUES.map(({ icon: Icon, bg, border, ibg, ic, title, desc }) => (
              <div key={title} className={`p-5 rounded-2xl ${bg} border ${border} hover:shadow-md transition-all`}>
                <div className={`w-9 h-9 rounded-xl ${ibg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${ic}`} />
                </div>
                <h4 className="font-black text-gray-900 text-sm mb-1.5">{title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TARIXCE */}
        <section ref={el => sectionRefs.current.tarix = el} id="tarix" className="scroll-mt-32">
          <SectionHeader icon={Clock} label="Yolumuz" title="Tarixce & Yol Xeritesi" />
          <div className="space-y-0">
            {HISTORY.map(({ year, title, desc }, i) => (
              <div key={i} className="flex items-start gap-3 sm:gap-4 group">
                <div className="shrink-0 w-14 sm:w-20 text-right pt-1">
                  <span className="inline-block text-[9px] sm:text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full whitespace-nowrap">{year}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100 ring-offset-1 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                  {i < HISTORY.length - 1 && <div className="w-px flex-1 bg-emerald-200 mt-1 min-h-[2.5rem]" />}
                </div>
                <div className="flex-1 pb-5">
                  <h4 className="font-black text-gray-900 text-sm mb-1">{title}</h4>
                  <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TEREFDASLAR */}
        <section ref={el => sectionRefs.current.terefdaslar = el} id="terefdaslar" className="scroll-mt-32">
          <SectionHeader icon={Handshake} label="Birlikde gucluyuk" title="Terefdaslarimiz" />
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 shadow-sm overflow-hidden">
            <PartnerTicker />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {PARTNERS.map(({ name, icon: Icon }) => (
              <div key={name} className="flex items-center gap-2.5 p-3.5 rounded-xl bg-white border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all group">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 transition-colors">
                  <Icon className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 leading-tight">{name}</p>
                  <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Terefdaslar</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-800 text-white">
            <div>
              <h4 className="font-black text-sm mb-0.5">Terefdashliq ucun elaqe</h4>
              <p className="text-xs text-emerald-200">Ekinchi.Az ile terefdashliq qurmaq isteyirsinizsee bizimle elaqe saxlayin.</p>
            </div>
            <a href="mailto:info@ekinchi.az" className="shrink-0 inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 px-4 py-2 rounded-xl text-xs font-bold transition-all">
              <Mail className="w-3.5 h-3.5" /> info@ekinchi.az
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
