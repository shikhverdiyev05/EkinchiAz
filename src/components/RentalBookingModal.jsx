/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useState } from "react";

export default function RentalBookingModal({ product, onClose, onSubmitBooking }) {
  if (!product) return null;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState(1);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+994 ');
  const [locationNote, setLocationNote] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return diffDays;
  };

  const daysCount = (startDate && endDate) ? calculateDays() : duration;
  const estimatedCost = product.price * daysCount;

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderData = {
      productTitle: product.title,
      productId: product.id,
      category: product.category,
      pricePerUnit: product.price,
      unit: product.unit,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || 'Razılaşma ilə',
      days: daysCount,
      estimatedCost,
      customerName: fullName,
      customerPhone: phone,
      locationNote,
      notes,
      orderDate: new Date().toLocaleDateString('az-AZ')
    };

    setIsSuccess(true);
    setTimeout(() => {
      onSubmitBooking(orderData);
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-xl w-full border border-blue-100 shadow-2xl overflow-hidden relative p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isSuccess ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900">İcarə Sifarişi Qəbul Olundu!</h3>
            <p className="text-sm text-gray-600 mt-2 max-w-sm mx-auto">
              Sifariş məlumatlarınız satıcıya göndərildi. Təsdiq üçün qısa zamanda sizinlə əlaqə saxlanılacaq.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-600 text-white">
                İcarə Sifarişi
              </span>
              <span className="text-xs text-gray-500 font-semibold">{product.category}</span>
            </div>

            <h3 className="text-xl font-black text-gray-900 leading-snug">
              {product.title}
            </h3>

            {/* Price Preview Card */}
            <div className="my-4 p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-blue-700 uppercase">İcarə Tarifi</p>
                <p className="text-xl font-black text-blue-950">
                  {product.price} <span className="text-xs font-semibold">{product.unit}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-blue-700 uppercase">Təxmini Məbləğ</p>
                <p className="text-xl font-black text-emerald-600">
                  {estimatedCost.toLocaleString()} AZN
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">İcarə Başlanğıc Tarixi *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">İcarə Bitmə Tarixi *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                  />
                </div>
              </div>

              {/* Customer Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Ad və Soyadınız *</label>
                  <input
                    type="text"
                    required
                    placeholder="Məs: Əli Əliyev"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Əlaqə Nömrəsi *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+994 50 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                  />
                </div>
              </div>

              {/* Delivery location */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Təsərrüfat Sahəsinin Yerləşməsi (Rayon / Kənd)</label>
                <input
                  type="text"
                  placeholder="Məs: Şəki rayonu, Kiş kəndi"
                  value={locationNote}
                  onChange={(e) => setLocationNote(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                />
              </div>

              {/* Additional notes */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Əlavə Qeydlər və Tələblər</label>
                <textarea
                  rows="2"
                  placeholder="İşin həcmi, tələb olunan aqreqatlar və s..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs resize-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition active:scale-[0.98]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>İcarə Sifarişini Təsdiq Et</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}