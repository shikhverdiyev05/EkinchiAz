/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  HelpCircle, Search, ChevronDown, ShoppingBasket,
  Tractor, Users, Shield, Sprout, MessageSquare,
  Sparkles, Phone, Mail, ArrowRight, CheckCircle2
} from 'lucide-react';

const FAQ_CATEGORIES = [
  { id: 'all', label: 'Bütün Suallar', icon: HelpCircle },
  { id: 'general', label: 'Ümumi & Qeydiyyat', icon: Sprout },
  { id: 'sales', label: 'Satış & Məhsullar', icon: ShoppingBasket },
  { id: 'rent', label: 'İcarə & Texnika', icon: Tractor },
  { id: 'social', label: 'Aqrar İcma & Paylaşımlar', icon: MessageSquare },
  { id: 'security', label: 'Təhlükəsizlik & Ödənişlər', icon: Shield },
];

const FAQS = [
  {
    cat: 'general',
    q: 'Əkinçi.az platforması nə üçün yaradılıb?',
    a: 'Əkinçi.az Azərbaycanda kənd təsərrüfatı və aqrar sahənin tam rəqəmsallaşdırılması, fermerlərin texnikaya, tinglərə, gübrələrə və alıcılara birbaşa çıxışını təmin etmək üçün yaradılmış milli ekosistemdir. Vasitəçiləri aradan qaldıraraq fermerin gəlirini artırmağı hədəfləyirik.'
  },
  {
    cat: 'general',
    q: 'Platformadan istifadə ödənişlidirmi?',
    a: 'Xeyr. Fermerlər, bağbanlar və təsərrüfat sahibləri üçün platformada qeydiyyatdan keçmək, elan yerləşdirmək və təcrübə bölüşmək tamamilə pulsuzdur.'
  },
  {
    cat: 'general',
    q: 'Hansı regionlardan qoşulmaq mümkündür?',
    a: 'Azərbaycanın bütün 65+ rayon və şəhərindən (Bakı, Gəncə, Şəki, Lənkəran, Quba, Xaçmaz, Bərdə, Naxçıvan MR və s.) fermerlər platformadan aktiv istifadə edə bilər.'
  },
  {
    cat: 'sales',
    q: 'Hansı məhsulları birbaşa səbətə əlavə edib onlayn sifariş edə bilərəm?',
    a: 'Tinglər, toxumlar, bio və mineral gübrələr, aqrar dərmanlar, damlama suvarma boruları, arıçılıq və bağ alətlərini birbaşa səbətə əlavə edib çatdırılma sifarişi verə bilərsiniz.'
  },
  {
    cat: 'sales',
    q: 'Elan yerləşdirərkən nəyə diqqət yetirməliyəm?',
    a: 'Məhsulun real şəkillərini əlavə etmək, dəqiq qiymət, ölçü vahidi (kq, ton, ədəd) və yerləşdiyi rayonu qeyd etmək elanınızın baxış sayını 4 dəfə artırır.'
  },
  {
    cat: 'sales',
    q: 'Çatdırılma necə həyata keçirilir?',
    a: 'Satıcı ilə alıcı arasında birbaşa razılaşma və ya platformanın tərəfdaş aqro-logistika şirkətləri vasitəsilə regionlararası çatdırılma təmin edilir.'
  },
  {
    cat: 'rent',
    q: 'Texnika və traktor icarəsi sistemi necə işləyir?',
    a: 'İcarə elanında "İcarəyə Götür" düyməsinə klikləyərək tələb olunan tarixi, gün sayını və sahənin yerləşdiyi məkanı qeyd edirsiniz. Sahibkar sorğunuzu 24 saat ərzində təsdiqləyir.'
  },
  {
    cat: 'rent',
    q: 'İcarə qiymətinə operator və yanacaq daxildirmi?',
    a: 'Hər elanın təsvirində bu qeyd olunur. Əksər hallarda texnika operatorla birlikdə təmin edilir, yanacaq isə sifarişçinin sahə həcminə uyğun hesablanır.'
  },
  {
    cat: 'rent',
    q: 'İcarə sorğusunu sonradan ləğv etmək mümkündürmü?',
    a: 'Bəli, profilinizdəki "İcarə Sorğuları" bölməsinə daxil olaraq iş başlamazdan əvvəl sorğunu ödənişsiz ləğv edə bilərsiniz.'
  },
  {
    cat: 'social',
    q: 'Paylaşımlar bölməsində nələri müzakirə edə bilərik?',
    a: 'Bitki xəstəlikləri və müalicə yolları, gübrələmə təqvimi, hava şəraiti xəbərdarlıqları, subsidiya qaydaları, suvarma qrafikləri və yeni aqrotexnika təcrübələrini foto və şərhlərlə müzakirə edə bilərsiniz.'
  },
  {
    cat: 'social',
    q: 'Paylaşıma neçə şəkil əlavə etmək olar?',
    a: 'Hər bir paylaşıma 5-ə qədər yüksək keyfiyyətli şəkil və müvafiq mövzu taqları (#buğda, #traktor, #gübrə və s.) əlavə edə bilərsiniz.'
  },
  {
    cat: 'social',
    q: 'Digər fermerləri necə izləyə bilərəm?',
    a: 'İstifadəçinin profilinə keçid edərək "İzlə" düyməsini sıxmaq kifayətdir. Beləliklə onların yeni elan və paylaşımlarından dərhal xəbərdar olacaqsınız.'
  },
  {
    cat: 'security',
    q: 'Platformada satıcıların etibarlılığı necə yoxlanılır?',
    a: 'Platformada qeydiyyatdan keçən şirkətlərin VÖEN məlumatları, fermerlərin isə mobil nömrə və təsərrüfat ünvanı yoxlanılaraq "Təsdiqlənmiş Fermer" nişanı verilir.'
  },
  {
    cat: 'security',
    q: 'Şikayət və ya anlaşılmazlıq yaranarsa kimə müraciət etməliyəm?',
    a: 'Əlaqə bölməmizdən və ya birbaşa dəstək nömrəmizdən (+994 55 673 14 07) 7/24 xidmət göstərən aqro-moderasiya komandamızla əlaqə saxlaya bilərsiniz.'
  }
];

export function FaqPage({ onNavigateContact }) {
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const [openIdx, setOpenIdx] = useState(0);

  const filteredFaqs = FAQS.filter(item => {
    const matchesCat = activeCat === 'all' || item.cat === activeCat;
    const matchesSearch = !search.trim() ||
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mx-auto">
          <HelpCircle className="w-4 h-4 text-amber-300" />
          Kömək Mərkəzi
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">Tez-tez Verilən Suallar (FAQ)</h1>
        <p className="text-emerald-100 text-xs sm:text-sm max-w-xl mx-auto">
          Əkinçi.az platformasından istifadə, elan yerləşdirmə, icarə və sosial icma haqqında bütün suallarınızın cavabları
        </p>

        {/* Search input */}
        <div className="max-w-md mx-auto relative pt-2">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pt-1" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sualınızı və ya açar sözü yazın..."
            className="w-full pl-11 pr-4 py-3 bg-white text-gray-900 rounded-2xl text-xs sm:text-sm shadow-lg outline-none focus:ring-4 focus:ring-emerald-400/30"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {FAQ_CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const active = activeCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                active
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-emerald-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-600">Axtarışa uyğun sual tapılmadı</p>
            <p className="text-xs text-gray-400 mt-1">Daha sadə açar sözlərlə axtarın və ya bizimlə əlaqə saxlayın.</p>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xs overflow-hidden transition hover:border-emerald-200"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-black text-sm sm:text-base text-gray-900 leading-snug">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'bg-emerald-600 text-white rotate-180' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-4 bg-emerald-50/20 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still have questions banner */}
      <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-black text-gray-900">Sualınız cavabsız qaldı?</h3>
          <p className="text-xs text-gray-500">
            Dəstək komandamız sizə hər addımda kömək etməyə hazırdır.
          </p>
        </div>

        <button
          onClick={onNavigateContact}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center gap-2"
        >
          Bizimlə Əlaqə <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}

export default FaqPage;
