import { useState, useRef, useEffect } from 'react';
import {
  Info, Users, Target, Heart, Clock, Handshake, ChevronDown,
  Sprout, Tractor, ShoppingBasket, Cpu, Globe, Leaf, Star, CheckCircle,
  FlaskConical, Wheat, TreeDeciduous, MapPin, Phone, Mail,
  ArrowRight, Shield, TrendingUp, MessageCircle,
  ChevronLeft, ChevronRight, AlertCircle, Loader2
} from 'lucide-react';


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

