import { useState } from 'react';

export default function SellerContactModal({ isOpen, product, onClose, onSendMessage }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+994 ');
  const [message, setMessage] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [errors, setErrors] = useState({});

  if (!isOpen || !product) return null;

  const validate = () => {
    const errs = {};
    const phoneRegex = /^(\+994|0)(50|51|55|70|77|99|10|60)\d{7}$/;

    if (!name.trim() || name.trim().length < 3) {
      errs.name = 'Adınızı daxil edin (ən azı 3 hərf)';
    }

    const cleanedPhone = phone.replace(/\s+/g, '');
    if (!cleanedPhone || !phoneRegex.test(cleanedPhone)) {
      errs.phone = 'Düzgün nömrə daxil edin: +994 50 123 45 67';
    }

    if (!message.trim() || message.trim().length < 5) {
      errs.message = 'Mesajınızı yazın (ən azı 5 simvol)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      productId: product.id,
      productTitle: product.title,
      senderName: name.trim(),
      senderPhone: phone.trim(),
      offerPrice: offerPrice ? Number(offerPrice) : null,
      message: message.trim(),
      seller: product.seller
    };

    onSendMessage(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-emerald-100 relative max-h-[92vh] overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold transition"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-amber-100">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl flex-shrink-0">
            🤝
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
              Satıcı ilə Birbaşa Əlaqə
            </span>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1 mt-0.5">
              {product.title}
            </h3>
            <p className="text-xs font-black text-amber-700">
              Qiymət: {product.price.toLocaleString()} {product.unit}
            </p>
          </div>
        </div>

        {/* Quick Contacts */}
        {product.seller && (
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-emerald-950">{product.seller.name}</p>
              <p className="text-[11px] text-gray-500">📞 {product.seller.phone}</p>
            </div>
            <a
              href={`https://wa.me/${product.seller.whatsapp}?text=${encodeURIComponent(`Salam, "${product.title}" haqqında məlumat almaq istəyirəm.`)}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              💬 WhatsApp
            </a>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          
          <div>
            <label className="block font-bold text-gray-700 mb-1">Adınız *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => { setName(e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: '' })); }}
              placeholder="Adınızı daxil edin"
              className={`w-full p-2.5 rounded-2xl border ${errors.name ? 'border-rose-500 ring-1 ring-rose-200' : 'border-gray-200'} text-xs font-medium`}
            />
            {errors.name && <p className="text-[11px] text-rose-600 font-bold mt-1">⚠ {errors.name}</p>}
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Telefon Nömrəniz *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => { setPhone(e.target.value); if (errors.phone) setErrors(prev => ({ ...prev, phone: '' })); }}
              placeholder="+994 50 123 45 67"
              className={`w-full p-2.5 rounded-2xl border ${errors.phone ? 'border-rose-500 ring-1 ring-rose-200' : 'border-gray-200'} text-xs font-semibold`}
            />
            {errors.phone && <p className="text-[11px] text-rose-600 font-bold mt-1">⚠ {errors.phone}</p>}
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Təklif Etdiyiniz Qiymət (AZN) - Könüllü</label>
            <input
              type="number"
              value={offerPrice}
              onChange={e => setOfferPrice(e.target.value)}
              placeholder="Məs: 34000"
              className="w-full p-2.5 rounded-2xl border border-gray-200 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Mesajınız *</label>
            <textarea
              rows="3"
              required
              value={message}
              onChange={e => { setMessage(e.target.value); if (errors.message) setErrors(prev => ({ ...prev, message: '' })); }}
              placeholder="Məhsula baxış keçirmək istəyirəm, yerləşmə dəqiq haradadır..."
              className={`w-full p-3 rounded-2xl border ${errors.message ? 'border-rose-500 ring-1 ring-rose-200' : 'border-gray-200'} text-xs font-medium`}
            />
            {errors.message && <p className="text-[11px] text-rose-600 font-bold mt-1">⚠ {errors.message}</p>}
          </div>

          <div className="pt-2 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs"
            >
              Bağla
            </button>
            <button
              type="submit"
              className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/25 transition active:scale-[0.99]"
            >
              Mesajı Göndər ✓
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
