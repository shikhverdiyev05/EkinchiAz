/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';

export default function SellerContactModal({ product, onClose }) {
  if (!product) return null;

  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+994 ');
  const [sent, setSent] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2000);
  };

  const whatsappUrl = `https://wa.me/${product.seller?.whatsapp || '994500000000'}?text=${encodeURIComponent(`Salam, "${product.title}" elanı ilə bağlı əlaqə saxlayıram.`)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full border border-amber-100 shadow-2xl overflow-hidden relative p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {sent ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900">Mesajınız Satıcıya Göndərildi!</h3>
            <p className="text-sm text-gray-600 mt-2">
              Satıcı qısa müddətdə sizinlə əlaqə saxlayacaqdır.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
                Birbaşa Satıcı Əlaqəsi
              </span>
              <span className="text-xs text-gray-500 font-semibold">{product.category}</span>
            </div>

            <h3 className="text-xl font-black text-gray-900 leading-snug">
              {product.title}
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Bu kateqoriyadakı iri həcmli təsərrüfat əmlakı və texnikalar səbətə əlavə edilmir, birbaşa satıcı ilə razılaşdırılır.
            </p>

            {/* Seller Contact Card */}
            <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/60 border border-amber-200/70">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-black text-lg flex items-center justify-center shadow-md">
                    {product.seller?.name?.[0] || 'S'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      {product.seller?.name || 'Satıcı'}
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Yoxlanılmış
                      </span>
                    </h4>
                    <a 
                      href={`tel:${product.seller?.phone || ''}`}
                      className="text-base font-black text-emerald-800 hover:text-emerald-900 block mt-0.5 tracking-wide"
                    >
                      {product.seller?.phone || '+994 50 000 00 00'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="grid grid-cols-2 gap-2.5 mt-4">
                <a
                  href={`tel:${product.seller?.phone || ''}`}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Zəng Et</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
              <p className="font-bold text-gray-700 text-xs">Və ya birbaşa platforma daxili sorğu göndərin:</p>
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Adınız"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-amber-500"
                />
                <input
                  type="tel"
                  required
                  placeholder="Nömrəniz"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-amber-500"
                />
              </div>

              <textarea
                rows="2"
                required
                placeholder="Qiymət təklifi və ya sualınızı qeyd edin..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-amber-500 resize-none"
              ></textarea>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition active:scale-95"
              >
                Sorğunu Göndər
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}