/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

export default function RentalBookingModal({ isOpen, product, onClose, onSubmitBooking }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+994 ');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('1 gün');
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');

  if (!isOpen || !product) return null;

  // Phone validation: Azerbaijani phone number regex (+994 50/51/55/70/77/99 xxx xx xx)
  const validatePhone = (value) => {
    const cleaned = value.replace(/\s+/g, '');
    const phoneRegex = /^(\+994|0)(50|51|55|70|77|99|10|60)\d{7}$/;
    if (!cleaned || cleaned === '+994') {
      return 'Əlaqə nömrəsi daxil edilməlidir';
    }
    if (!phoneRegex.test(cleaned)) {
      return 'Nümunə: +994 50 123 45 67 (Düzgün operator prefiksi seçin)';
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
    
    // Name validation
    if (!fullName.trim() || fullName.trim().length < 3) {
      setNameError('Ad və Soyad ən azı 3 hərfdən ibarət olmalıdır');
      return;
    } else {
      setNameError('');
    }

    // Phone validation
    const pError = validatePhone(phone);
    if (pError) {
      setPhoneError(pError);
      return;
    }

    const bookingData = {
      id: `rent-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      productImage: product.image,
      productPrice: product.price,
      productUnit: product.unit,
      fullName: fullName.trim(),
      phone: phone.trim(),
      duration: duration,
      notes: notes.trim(),
      sellerName: product.seller?.name || 'Satıcı',
      status: 'Gözləmədə',
      createdAt: new Date().toLocaleDateString('az-AZ')
    };

    onSubmitBooking(bookingData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-emerald-100 relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold transition"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-emerald-100">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl flex-shrink-0">
            🚜
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              İcarə Sifarişi
            </span>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1 mt-0.5">
              {product.title}
            </h3>
            <p className="text-xs font-black text-blue-700">
              {product.price.toLocaleString()} {product.unit}
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
              placeholder="Məs: Əli Məmmədov"
              className={`w-full px-3.5 py-2.5 rounded-2xl bg-white border ${
                nameError ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-200 focus:border-emerald-500'
              } text-xs font-medium text-gray-900 outline-none transition`}
            />
            {nameError && (
              <p className="text-[11px] text-rose-600 font-bold mt-1">⚠ {nameError}</p>
            )}
          </div>

          {/* Əlaqə Nömrəsi (Form Validation ilə) */}
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
                phoneError ? 'border-rose-500 focus:ring-rose-200' : 'border-gray-200 focus:border-emerald-500'
              } text-xs font-semibold text-gray-900 outline-none transition`}
            />
            {phoneError ? (
              <p className="text-[11px] text-rose-600 font-bold mt-1">⚠ {phoneError}</p>
            ) : (
              <p className="text-[10px] text-gray-400 mt-1">Format: +994 50 123 45 67</p>
            )}
          </div>

          {/* Təxmini İcarə Müddəti */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Təxmini İcarə Müddəti *
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-bold text-gray-800 outline-none focus:border-emerald-500"
            >
              <option value="1 gün">1 Günlük</option>
              <option value="3 gün">3 Günlük</option>
              <option value="1 həftə">1 Həftəlik</option>
              <option value="1 ay">1 Aylıq</option>
              <option value="Mövsümlük (3 ay)">Mövsümlük (3 ay)</option>
              <option value="1 illik (Torpaq/Bağ)">1 İllik (Torpaq/Bağ)</option>
            </select>
          </div>

          {/* Əlavə Qeyd / Tələblər */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Əlavə Qeydlər və ya Xüsusi İstəklər
            </label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Görüləcək işin həcmi, operator tələb olunurmu və ya başqa qeydləriniz..."
              className="w-full p-3 rounded-2xl bg-white border border-gray-200 text-xs font-medium text-gray-900 outline-none focus:border-emerald-500"
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