/* eslint-disable no-unused-vars */

export default function CartDrawer({ 
    isOpen, 
    onClose, 
    cartItems, 
    onUpdateQuantity, 
    onRemoveItem,
    onClearCart,
    onCheckout 
  }) {
    if (!isOpen) return null;
  
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 0 ? (subtotal > 200 ? 0 : 10) : 0;
    const total = subtotal + deliveryFee;
  
    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-fadeIn">
        <div 
          className="w-full max-w-md bg-white/95 backdrop-blur-2xl h-full shadow-2xl flex flex-col justify-between border-l border-emerald-100 animate-slideLeft"
        >
          {/* Header */}
          <div className="p-6 border-b border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Alış-veriş Səbəti</h3>
                <p className="text-xs text-gray-500">{cartItems.length} növ məhsul</p>
              </div>
            </div>
  
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          {/* Info Note about Cart Logic */}
          <div className="px-6 py-2 bg-emerald-50 text-[11px] text-emerald-800 border-b border-emerald-100 flex items-center gap-1.5">
            <svg className="w-4 h-4 flex-shrink-0 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Qeyd: Səbətdə yalnız birbaşa satılan aqrar mallar yer alır.</span>
          </div>
  
          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-400 flex items-center justify-center mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-800 text-base">Səbətiniz boşdur</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  Gübrələr, toxumlar, tinglər və ləvazimatlar bölməsindən məhsullar əlavə edə bilərsiniz.
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/40 border border-emerald-100 hover:border-emerald-200 transition"
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-16 h-16 rounded-xl object-cover border border-emerald-100 flex-shrink-0"
                  />
  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-gray-900 truncate">{item.title}</h4>
                    <p className="text-xs text-emerald-800 font-bold mt-0.5">
                      {item.price} AZN <span className="text-[10px] text-gray-500 font-normal">/ {item.unit}</span>
                    </p>
  
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-emerald-200 rounded-lg bg-white overflow-hidden shadow-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-0.5 text-xs text-gray-600 hover:bg-emerald-50"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-gray-600 hover:bg-emerald-50"
                        >
                          +
                        </button>
                      </div>
  
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[11px] text-rose-500 hover:text-rose-700 ml-auto font-medium"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
  
          {/* Footer & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-emerald-100 bg-white/60 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Məhsulların cəmi:</span>
                  <span className="font-semibold text-gray-900">{subtotal.toFixed(2)} AZN</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Çatdırılma:</span>
                  <span className="font-semibold text-gray-900">
                    {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">Pulsuz</span> : `${deliveryFee} AZN`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-emerald-100">
                  <span>Yekun məbləğ:</span>
                  <span className="text-emerald-700 text-lg">{total.toFixed(2)} AZN</span>
                </div>
              </div>
  
              <button
                onClick={onCheckout}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-[0.98]"
              >
                <span>Sifarişi rəsmiləşdir</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}
  
        </div>
      </div>
    );
  }