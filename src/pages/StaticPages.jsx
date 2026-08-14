import  { useState } from 'react';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-700">Platforma Haqqında</span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">AqroBazar - Yeni Nəsil Aqrar Ekosistem</h1>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-emerald-100 p-8 space-y-6 text-sm text-gray-700 leading-relaxed shadow-sm">
        <p>
          <strong>AqroBazar</strong> Azərbaycanda aqrar sahənin rəqəmsallaşdırılması, fermerlərin bazara birbaşa çıxışının təmin edilməsi və texnika/torpaq icarəsinin asanlaşdırılması məqsədilə yaradılmış innovativ platformadır.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
            <h4 className="font-bold text-emerald-900 text-base mb-1">🌱 E-Commerce Bölməsi</h4>
            <p className="text-xs text-gray-600">Sertifikatlı toxumlar, mineral və üzvi gübrələr, bitki mühafizə vasitələri və təsərrüfat ləvazimatlarının onlayn satışı.</p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
            <h4 className="font-bold text-blue-900 text-base mb-1">🚜 İcarə və Texnika Portalı</h4>
            <p className="text-xs text-gray-600">Mövsümlük şum, səpin və biçin işləri üçün müasir kombayn, traktor və suvarılan münbit əkin sahələrinin icarəsi.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FaqPage() {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: "Hansı məhsulları birbaşa səbətə əlavə edib onlayn ala bilərəm?",
      a: "Gübrələr, ağac və bitki tingləri, toxumlar və yemlər, aqrar və baytarlıq dərmanları, həmçinin arıçılıq, bağbanlıq və maldarlıq alətlərini birbaşa səbətə əlavə edərək sifariş edə bilərsiniz."
    },
    {
      q: "Kənd təsərrüfatı texnikaları və torpaq sahələrini niyə səbətə atmaq olmur?",
      a: "Texnika və torpaq sahələri yüksək dəyərə və fərdi hüquqi/sənədləşmə şərtlərinə malik olduğu üçün onlar səbətə əlavə olunmur. Satış zamanı satıcı ilə birbaşa əlaqə yaradılır, icarə zamanı isə platforma üzərindən icarə sifarişi (rezervasiya) formalaşdırılır."
    },
    {
      q: "İcarə sifarişi necə işləyir?",
      a: "İcarəyə verilən texnika və ya torpaq elanında 'İcarə sifarişi' düyməsini sıxaraq tarixi, müddəti və yerləşməni qeyd edirsiniz. Sorğunuz dərhal satıcıya ötürülür və sizinlə əlaqə saxlanılır."
    },
    {
      q: "Platformada elan yerləşdirmək ödənişlidirmi?",
      a: "Xeyr, ilkin mərhələdə fermerlər və təsərrüfat sahibləri üçün elan yerləşdirmək tamamilə ödənişsizdir."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-700">Tez-tez Verilən Suallar</span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">Suallarınız var? Cavablandırırıq</h1>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-emerald-100 overflow-hidden shadow-xs">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full p-5 text-left font-bold text-sm text-gray-900 flex justify-between items-center"
            >
              <span>{faq.q}</span>
              <span className="text-emerald-600 font-black text-lg">{openIdx === idx ? '−' : '+'}</span>
            </button>
            {openIdx === idx && (
              <div className="p-5 pt-0 text-xs text-gray-600 leading-relaxed border-t border-emerald-50">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-700">Bizimlə Əlaqə</span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">Suallarınız və Təklifləriniz</h1>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-emerald-100 p-8 shadow-sm">
        {sent ? (
          <div className="py-8 text-center text-emerald-700 font-bold">
            Təşəkkür edirik! Mesajınız qəbul edildi. Tezliklə əlaqə saxlayacağıq.
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Adınız</label>
                <input required type="text" placeholder="Əli Əliyev" className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Əlaqə Nömrəsi</label>
                <input required type="tel" placeholder="+994 50 000 00 00" className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500" />
              </div>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Mesajınız</label>
              <textarea rows="4" required placeholder="Müraciətinizi qeyd edin..." className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 resize-none"></textarea>
            </div>
            <button type="submit" className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md">
              Məktubu Göndər
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function SocialFeedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-6">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center text-3xl mx-auto shadow-sm">
        💬
      </div>
      <h1 className="text-3xl font-black text-gray-900">Aqrar Sosial Şəbəkə və Paylaşımlar</h1>
      <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
        Tezliklə: Fermerlərin təcrübə mübadiləsi, aqronom məsləhətləri, məhsul xəstəliklərinin foto ilə təyini və sosial müzakirə platforması bu bölmədə aktivləşəcək.
      </p>
      <div className="inline-block px-4 py-2 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs">
        İnkişaf Mərhələsindədir
      </div>
    </div>
  );
}