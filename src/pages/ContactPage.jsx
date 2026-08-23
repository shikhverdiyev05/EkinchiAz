import { useState, useRef, useEffect } from 'react';
import {
  Info, Users, Target, Heart, Clock, Handshake, ChevronDown,
  Sprout, Tractor, ShoppingBasket, Cpu, Globe, Leaf, Star, CheckCircle,
  FlaskConical, Wheat, TreeDeciduous, MapPin, Phone, Mail,
  ArrowRight, Shield, TrendingUp, MessageCircle,
  ChevronLeft, ChevronRight, AlertCircle, Loader2
} from 'lucide-react';
import { sendContactMessageApi } from '../services/apiService';


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
        else if (!/^[a-zA-Z0-9._%+-]{4,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) error = 'Düzgün email daxil edin (məs: isim@domain.com, min 4 simvol)';
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

