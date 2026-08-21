import { useState, useMemo } from 'react';

export default function RentalBookingModal({ isOpen, product, onClose, onSubmitBooking }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+994 ');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [durationCount, setDurationCount] = useState(1);
  const [durationUnit, setDurationUnit] = useState('gün'); // 'gün' | 'həftə' | 'ay' | 'il'
  const [locationNote, setLocationNote] = useState('');
  const [notes, setNotes] = useState('');
  
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');
  const [countError, setCountError] = useState('');

  // Təxmini yekun icarə məbləğinin hesablanması
  const estimatedCost = useMemo(() => {
    if (!product || !product.price) return 0;
    const count = Number(durationCount) || 1;
    let multiplier = 1;
    if (durationUnit === 'həftə') multiplier = 7;
    if (durationUnit === 'ay') multiplier = 30;
    if (durationUnit === 'il') multiplier = 365;

    // Əgər məhsulun vahidi aylıq və ya illikdirsə
    const unitLower = (product.unit || '').toLowerCase();
    if (unitLower.includes('ay')) {
      multiplier = durationUnit === 'ay' ? 1 : durationUnit === 'il' ? 12 : durationUnit === 'gün' ? 1/30 : 7/30;
    } else if (unitLower.includes('il') || unitLower.includes('hektar')) {
      multiplier = durationUnit === 'il' ? 1 : durationUnit === 'ay' ? 1/12 : 1/365;
    }

    return Math.max(1, Math.round(product.price * count * (multiplier < 0.1 ? 1 : multiplier)));
  }, [product, durationCount, durationUnit]);

  if (!isOpen || !product) return null;

  const validatePhone = (value) => {
    const cleaned = value.replace(/\s+/g, '');
    const phoneRegex = /^(\+994|0)(50|51|55|70|77|99|10|60)\d{7}$/;
    if (!cleaned || cleaned === '+994') {
      return 'Əlaqə nömrəsi daxil edilməlidir';
    }
    if (!phoneRegex.test(cleaned)) {
      return 'Nümunə: +994 50 123 45 67';
    }
    return '';
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    setPhone(val);
    if (phoneError) setPhoneError(validatePhone(val));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!fullName.trim() || fullName.trim().length < 3) {
      setNameError('Ad və Soyad ən azı 3 hərfdən ibarət olmalıdır');
      return;
    } else {
      setNameError('');
    }

    const pError = validatePhone(phone);
    if (pError) {
      setPhoneError(pError);
      return;
    }

    if (!durationCount || Number(durationCount) <= 0) {
      setCountError('İcarə müddəti ən azı 1 olmalıdır');
      return;
    } else {
      setCountError('');
    }

    const durationText = `${durationCount} ${durationUnit}`;

    const bookingData = {
      id: `rent-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      productImage: product.image,
      productPrice: product.price,
      productUnit: product.unit,
      fullName: fullName.trim(),
      phone: phone.trim(),
      startDate: startDate,
      duration: durationText,
      durationCount: Number(durationCount),
      durationUnit: durationUnit,
      locationNote: locationNote.trim() || product.location || 'Qeyd olunmayıb',
      estimatedCost: estimatedCost,
      notes: notes.trim(),
      sellerName: product.seller?.name || 'Satıcı',
      status: 'Təsdiq gözləyir',
      createdAt: new Date().toLocaleDateString('az-AZ')
    };

    onSubmitBooking(bookingData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-emerald-100 relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold transition"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-emerald-100">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl flex-shrink-0">
            🚜
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              İcarə Rezervasiyası
            </span>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1 mt-0.5">
              {product.title}
            </h3>
            <p className="text-xs font-black text-blue-700">
              {(Number(product.price) || 0).toLocaleString()} {product.unit || 'AZN / gün'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          
          {/* Ad Soyad */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Adınız və Soyadınız *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (nameError) setNameError('');
              }}
              placeholder="Məs: Rəşad Əliyev"
              className={`w-full px-3.5 py-2.5 rounded-2xl bg-white border ${
                nameError ? 'border-rose-500' : 'border-gray-200'
              } text-xs font-medium text-gray-900 outline-none focus:border-emerald-500 transition`}
            />
            {nameError && (
              <p className="text-[11px] text-rose-600 font-bold mt-1">⚠ {nameError}</p>
            )}
          </div>

          {/* Əlaqə Nömrəsi */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Əlaqə Telefon Nömrəsi *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+994 50 123 45 67"
              className={`w-full px-3.5 py-2.5 rounded-2xl bg-white border ${
                phoneError ? 'border-rose-500' : 'border-gray-200'
              } text-xs font-semibold text-gray-900 outline-none focus:border-emerald-500 transition`}
            />
            {phoneError ? (
              <p className="text-[11px] text-rose-600 font-bold mt-1">⚠ {phoneError}</p>
            ) : (
              <p className="text-[10px] text-gray-400 mt-0.5">Format: +994 50 123 45 67</p>
            )}
          </div>

          {/* Başlanğıc Tarixi və İcarə Müddəti (User Input) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Başlanğıc Tarixi */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Başlanğıc Tarixi *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-bold text-gray-800 outline-none focus:border-emerald-500"
              />
            </div>

            {/* İcarə Müddəti (User Input Sayı + Vahid) */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                İcarə Müddəti (User Input) *
              </label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="365"
                  required
                  value={durationCount}
                  onChange={(e) => {
                    setDurationCount(e.target.value);
                    if (countError) setCountError('');
                  }}
                  className="w-20 px-3 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-black text-center text-gray-900 outline-none focus:border-emerald-500"
                />
                <select
                  value={durationUnit}
                  onChange={(e) => setDurationUnit(e.target.value)}
                  className="flex-1 px-2.5 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-bold text-gray-800 outline-none focus:border-emerald-500"
                >
                  <option value="gün">Günlük (Gün)</option>
                  <option value="həftə">Həftəlik (Həftə)</option>
                  <option value="ay">Aylıq (Ay)</option>
                  <option value="il">İllik (İl / Mövsüm)</option>
                </select>
              </div>
              {countError && <p className="text-[10px] text-rose-600 font-bold mt-1">⚠ {countError}</p>}
            </div>

          </div>

          {/* Təxmini Hesablanmış Məbləğ Kartı */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-700 block">Təxmini İcarə Məbləği</span>
              <p className="text-[11px] text-gray-600">
                {durationCount} {durationUnit} × {(Number(product.price) || 0).toLocaleString()} {product.unit || 'AZN'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-blue-900">{estimatedCost.toLocaleString()} AZN</span>
              <span className="block text-[9px] text-gray-400 font-semibold">(Razılaşma ilə)</span>
            </div>
          </div>

          {/* İcarə Yeri / Sahənin Ünvanı */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              İşin Görüləcəyi Məkan / Sahə Ünvanı
            </label>
            <input
              type="text"
              value={locationNote}
              onChange={(e) => setLocationNote(e.target.value)}
              placeholder="Məs: Bərdə rayonu, Alpoud kəndi, 10 hektar yonca sahəsi"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-medium text-gray-900 outline-none focus:border-emerald-500"
            />
          </div>

          {/* Əlavə Qeyd / Tələblər */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Əlavə Qeydlər və ya Xüsusi Tələblər
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Operator tələb olunurmu, yanacaq kimin hesabınadır və s."
              className="w-full p-3 rounded-2xl bg-white border border-gray-200 text-xs font-medium text-gray-900 outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition"
            >
              Bağla
            </button>
            <button
              type="submit"
              className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition active:scale-[0.99]"
            >
              İcarə Sorğusunu Göndər ✓
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
