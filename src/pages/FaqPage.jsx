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
      { q: 'Ekinchi.Az nə üçün yaradılıb?', a: 'Ekinchi.Az Azərbaycanda aqrar sahənin rəqəmsallaşdırılması, fermerlərin bazara birbaşa çıxışının təmin edilməsi, texnika/torpaq icarasının asanlaşdırılması məqsədilə yaradılmış innovativ platformadır. Fermerdən alıcıya birbaşa əlaqə qurulmasını hədəfləyirik.' },
      { q: 'Platforma ödənişlidirmi?', a: 'Xeyr. İlkin mərhələdə bütün fermerlər, sahibkarlar və icarəçilər üçün elan yerləşdirmək, baxmaq və müraciət etmək tamamilə pulsuzdur. Gələcəkdə premium xidmət paketləri nəzərdə tutulur.' },
      { q: 'Platformada qeydiyyat məcburidirmi?', a: 'Elanları baxmaq üçün qeydiyyat tələb olunmur. Lakin elan yerləşdirmək, sevimlilərə əlavə etmək, icarə sifarişi vermək üçün hesab açmaq lazımdır. Qeydiyyat yalnız 1 dəqiqə çəkir.' },
      { q: 'Hansı regionlara xidmət göstərilir?', a: 'Azərbaycanın bütün regionlarına xidmət göstərilir — Bakı, Gəncə, Mingəçevir, Lənkəran, Şirvan, Bərdə, Naxçıvan MR və digər bütün rayon mərkəzləri daxildir.' },
      { q: 'Mobil tətbiq varmı?', a: 'Hazırda veb versiyası bütün cihazlarda mükəmməl işləyir. Native mobil tətbiq (iOS/Android) 2024-cu ilin son çərxində planlaşdırılıb.' },
      { q: 'Platforma dilləri hansılardır?', a: 'Əsas dili Azərbaycan dilidir. Rusi və İngilis dili dəstəyi gələcək yeniliklərdə əlavə olunacaq.' },
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
      { q: 'Sifarişi ləğv edə bilərəmmi?', a: 'Bəli, sifariş təsdiqlənməzsə və ya çatdırılmıbsə profilinizdəki "Sifarişlər" bölməsindən ləğv edə bilərsiniz.' },
      { q: 'Məhsul keyfiyyəti zəmanətdirsə?', a: 'Platforma "Əlaqə" bölməsindən şikayət yazın. Satıcı ilə razılaşmazlıq yaranarsa adminlər məhkəmə qarşılıqlı həll etməyə kömək edir.' },
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
      { q: 'İcarə qiyməti necə müəyyən olunur?', a: 'Qiymət elan sahibi tərəfindən günlük/haftalık/aylıq bazada göstərilir. Müddətə görə endirim tətbiq edilə bilər.' },
      { q: 'Yanacaq və operator daxildirmi?', a: 'Bunun elan təsvirində qeyd olunmalıdır. Adətən traktor/kombayn icarəsində operator də dahildir, yanacaq isə icarəçidədir.' },
    ],
  },
  {
    label: 'Hesab & Elan',
    icon: Users,
    color: 'violet',
    faqs: [
      { q: 'Necə qeydiyyatdan keçmək olar?', a: 'Saytın yuxarı hissəsindəki "Daxil ol" düyməsini sıxın, adınızı, email və ya nömrənizi daxil edib "Qeydiyyat" seçin. Proses yalnız 1 dəqiqə çəkir.' },
      { q: 'Elanımı necə yerləşdirirəm?', a: 'Hesaba giriş etdikdən sonra "Elan Yerleşdir" düyməsini sıxın. Məhsul/texnika məlumatları, qiymət, şəkil əlavə edib göndərin. Elanınız 5 dəqiqə ərzində aktivleşir.' },
      { q: 'Elanı sonradan redaktə edə bilərəmmi?', a: 'Hələlik redaktə funksiyası inkişaf mərhələsindədir. Elanı silmək üçün profil bölməsindəki "Elanlarım" hissəsindən istifadə edə bilərsiniz.' },
      { q: 'Şifrəmi unutduqda nə etmək lazımdır?', a: 'Daxil olma ekranındakı "Şifrəni unutdum" bağlantısına basın. Email ünvanınıza sıfırlama linki göndəriləcək. Bağlantı 15 dəqiqə keçərlidir.' },
      { q: 'Profil məlumatlarımı necə dəyişmək olar?', a: 'Profil səhifəsində "Parametrlər" sekmesine daxil olun, məlumatları yeniləyin və "Saxla" düyməsini basın.' },
      { q: 'Şirkət hesabı necə açılır?', a: 'Qeydiyyat zamanı "Aqro Şirkət" növünü seçin və ya profil parametrlərindən dəyişin. Şirkətlərə xüsusi badge verilir.' },
    ],
  },
  {
    label: 'Aqronom Xidmətləri',
    icon: FlaskConical,
    color: 'green',
    faqs: [
      { q: 'Aqronom xidmətləri necə sifariş edilir?', a: 'Kateqoriya menyusundan "Aqronom xidmətləri" seçin, uyğun xidməti tapın və sifariş verin. Mütəxəssis sizinlə əlaqə saxlayaraq Planlaşdırılacaq.' },
      { q: 'Torpaq analizi necə aparılır?', a: 'Sizdən torpaq nümunələri tələb olunur, laboratoriyada analiz olunur və nəticə 3-5 iş günü ərzində sizə təqdim edilir.' },
      { q: 'Dronla çiləmə necə işləyir?', a: 'Dron sahəni xəritələyir, problem zonaları (xəstəlik, quru, alaq) aşkar edir. Sonra dəqiq doza ilə çiləmə aparılır.' },
      { q: 'Meyvə baq budaması nə vaxt göstərilir?', a: 'Dövrüyyə ulduzu (qış), qəvə ulduzu (yaz), sub-tropik bitkilər (sonbahar) — müxtəlif vaxtlarda. Mütəxəssis vaxtı müəyyən edəcək.' },
      { q: 'Quyu qazması üçün icazə lazımdırmı?', a: 'Bəli, dərin su quyuları üçün müvafiq icazə və layihə tələb olunur. Biz sizə sənədləri toplamaqdə kömək edirik.' },
    ],
  },
  {
    label: 'Heyvandarlıq & Quşçuluq',
    icon: Bird,
    color: 'orange',
    faqs: [
      { q: 'Heyvan alış-verişi necə təhlükəsizdir?', a: 'Satıcı profili yoxlanılır, heyvanın sağlamlıq sertifikatı (veterinar paşportu) tələb olunur. Ödəniş Heyvanı alındıqdan sonra edilir.' },
      { q: 'Arı ailəsi necə icarə alınır?', a: 'Balıqçılıq séance üçün arı ailələri icarə edilə bilər. Ailənin gücü (kadr sayı), melliferia dövrü qeyd olunur.' },
      { q: 'Qoyun/keçi alışı üçün nə lazımdır?', a: 'Veterinar paşport, qruplaşma nömrəsi, yaş və cinsiyyət. Satıcı profilində "Doğrulandı" işarəsi olanları prefer edin.' },
      { q: 'Yumurta incubatoru alışında quraşdırma daxildirmi?', a: 'Adətən quraşdırma xidməti əlavə pul karşılığında göstərilir. Elan təsvirində qeyd olunmalıdır.' },
    ],
  },
  {
    label: 'Təhlükəsizlik & Dəstək',
    icon: Shield,
    color: 'red',
    faqs: [
      { q: 'Satıcı realdırmı, necə yoxlayırsınız?', a: 'Yeni satıcıların nömrəsi, email, sosial şəbəkələr yoxlanılır. "Doğrulandı" badge-i alan satıcılar administratorski təsdiqlənib.' },
      { q: 'Dolubazarlıq olarsa niyə etibar edəcəm?', a: 'Platforma "Şikayət" funksiyası var. Adminlər 24 saat ərzində baxır, yanlış tapılarsa satıcı bloklanır və pul qaytarılır.' },
      { q: 'Şəxsi məlumatlarım qorunmurmı?', a: 'Bəli, GDPR standartlarına uyğun. Məlumatlarınız heç kimsə satılmır, 3-cü tərəflərə ötürülmür. Şifrələnmiş saxlanılır.' },
      { q: 'Texniki dəstək necə alınır?', a: 'Saytdakı "Əlaqə" forması, telefon (+994 55 673 14 07) və ya email (info@ekinchi.az) vasitəsilə 09:00-18:00 arasında dəstək alırsınız.' },
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

