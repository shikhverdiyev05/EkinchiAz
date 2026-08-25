/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Users, Target, Heart, Clock,
  Sprout, Tractor, Cpu, Globe, Leaf, Star,
  FlaskConical, Wheat, TreeDeciduous,
  Shield, Sparkles
} from 'lucide-react';

const TEAM = [
  { role: 'Product Owner',       name: 'Şövkət Kərimov',   bio: 'Platformanın strateji baxışı, aqrar sahənin rəqəmsallaşdırılması və məhsul inkişafının rəhbəri.', skills: ['Aqrar İqtisadiyyat','Məhsul İdarəetməsi','Strategiya'], img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80' },
  { role: 'Project Lead',        name: 'Nadir Maxsudlu',   bio: 'Layihənin idarəedilməsi, komanda koordinasiyası və icra proseslərinə nəzarət edən lider.',         skills: ['Agile / Scrum','Komanda İdarəetməsi','Əməliyyatlar'],  img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80' },
  { role: 'IT Business Analyst', name: 'Aqşin Hüseynli',   bio: 'Fermer və istifadəçi tələblərinin təhlili, biznes proseslərinin sistemləşdirilməsi mütəxəssisi.',   skills: ['Biznes Analitika','Proses Modelləşdirmə','Data Analiz'],   img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80' },
  { role: 'UX/UI Designer',      name: 'Yasmin Hüseynova', bio: 'Sadə, intuitiv və fermerlər üçün rahat istifadə edilə biləcək müasir interfeyslərin yaradıcısı.',     skills: ['UI/UX Dizayn','İstifadəçi Təcrübəsi','Prototipləşdirmə'], img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80' },
  { role: 'Front-End Developer', name: 'Mail Şixverdiyev', bio: 'Platformanın interaktiv, sürətli və responsiv veb tətbiq kodlaşdırılmasını həyata keçirən mühəndis.', skills: ['React / Vite','Tailwind CSS','Web Performance'],          img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
];

const VALUES = [
  { icon: Leaf,      bg: 'bg-emerald-50', border: 'border-emerald-100', ibg: 'bg-emerald-100', ic: 'text-emerald-700', title: 'Şəffaflıq',    desc: 'Fermer və alıcı arasında açıq, dürüst ticarət mühiti formalaşdırılır.' },
  { icon: Star,      bg: 'bg-amber-50',   border: 'border-amber-100',   ibg: 'bg-amber-100',   ic: 'text-amber-700',   title: 'Keyfiyyət',    desc: 'Yalnız doğrulanmış satıcılar və sertifikatlı məhsullar platformada yer alır.' },
  { icon: Globe,     bg: 'bg-blue-50',    border: 'border-blue-100',    ibg: 'bg-blue-100',    ic: 'text-blue-700',    title: 'Əlçatanlıq',  desc: 'Ölkənin istənilən bölgəsindən platforma xidmətlərinə tam mobil çatmaq mümkündür.' },
  { icon: Cpu,       bg: 'bg-violet-50',  border: 'border-violet-100',  ibg: 'bg-violet-100',  ic: 'text-violet-700',  title: 'İnnovasiya',   desc: 'Süni intellektdən bulud texnologiyalarına qədər müasir həllər tətbiq edilir.' },
  { icon: Heart,     bg: 'bg-teal-50',    border: 'border-teal-100',    ibg: 'bg-teal-100',    ic: 'text-teal-700',    title: 'Birlik',       desc: 'Fermer-fermer, fermer-sahibkar əməkdaşlığının inkişafı əsas hədəfdir.' },
  { icon: Shield,    bg: 'bg-rose-50',    border: 'border-rose-100',    ibg: 'bg-rose-100',    ic: 'text-rose-700',    title: 'Etibarlılıq',  desc: 'Platformada hər əməliyyat izlənir, sənədləşdirilir, şikayət mexanizmi mövcuddur.' },
];

const HISTORY = [
  { year: '2023 Q1', title: 'İdeya & Araşdırma',   desc: 'Azərbaycanın aqrar sektorundakı rəqəmsallaşma boşluğunun müəyyənləşdirilməsi, bazar tədqiqatının aparılması.' },
  { year: '2023 Q4', title: 'MVP Hazırlığı',       desc: 'Komanda formalaşdı, ilk dizayn konsepsiyası, texniki arxitektura və MVP spesifikasiyaları hazırlandı.' },
  { year: '2024 Q2', title: 'Beta Buraxılışı',     desc: 'İlk 50 fermer ilə qapalı beta testlər başladı, ilk elanlar sistemə əlavə olundu, geri bildirim toplandı.' },
  { year: '2025 Q1', title: 'Açıq Platforma',      desc: 'Platforma ictimaiyyətə açıldı. İcarə, satış, kateqoriya sistemi, axtarış və filterlər aktiv edildi.' },
  { year: '2026',    title: 'Genişlənmə Mərhələsi',desc: 'Sosial modul, sorğu formaları, AI inteqrasiyası, fermer birlikləri ilə tərəfdaşlıq.' },
];

export function AboutPage({ onNavigateListings }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-12">
      
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-xl">
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
            <Sprout className="w-4 h-4 text-amber-300" />
            Əkinçi.az Haqqında
          </div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight">
            Azərbaycan Kənd Təsərrüfatını Rəqəmsallaşdırırıq
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Məqsədimiz hər bir fermerin torpağını daha səmərəli becərməsi, texnikasını asanlıqla icarəyə götürməsi və məhsulunu birbaşa alıcıya çatdırması üçün vahid rəqəmsal ekosistem yaratmaqdır.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-gray-900">Missiyamız</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Azərbaycan aqrar sektorunda vasitəçiləri minimuma endirmək, fermerlərin texnika və bazara çıxışını sürətləndirmək, ölkə daxilində ərzaq təhlükəsizliyinə texnoloji dəstək vermək.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-gray-900">Baxışımız</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Regionun ən innovativ, süni intellekt dəstəkli və etibarlı aqrar platformasına çevrilərək hər təsərrüfatın cib bələdçisi olmaq.
          </p>
        </div>
      </div>

      {/* Values Grid */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <Heart className="w-6 h-6 text-emerald-600" /> Dəyərlərimiz
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUES.map((val, idx) => (
            <div key={idx} className={`p-6 rounded-3xl border ${val.border} ${val.bg} space-y-2`}>
              <div className={`w-10 h-10 rounded-xl ${val.ibg} ${val.ic} flex items-center justify-center`}>
                <val.icon className="w-5 h-5" />
              </div>
              <h4 className="font-black text-gray-900 text-base">{val.title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-emerald-600" /> Komandamız
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {TEAM.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 text-center flex flex-col items-center hover:shadow-md transition"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-emerald-50 mb-3"
              />
              <h4 className="font-black text-sm text-gray-900">{member.name}</h4>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full my-1.5">
                {member.role}
              </span>
              <p className="text-[11px] text-gray-500 leading-relaxed mt-1">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* History Timeline */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-emerald-600" /> İnkişaf Tarixçəmiz
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {HISTORY.map((h, i) => (
            <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-1.5">
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md inline-block">
                {h.year}
              </span>
              <h4 className="font-black text-sm text-gray-900">{h.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default AboutPage;
