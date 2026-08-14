/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    userType: 'farmer' // 'farmer' (fermer) or 'company' (şirkət/satıcı)
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const user = {
        name: formData.name || (formData.email.split('@')[0] || 'Aqro İstifadəçi'),
        email: formData.email,
        phone: formData.phone || '+994 50 123 45 67',
        userType: formData.userType,
        joinedDate: 'Avqust 2026',
        balance: '0.00 AZN'
      };
      onLoginSuccess(user);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-md w-full border border-emerald-100 shadow-2xl overflow-hidden relative p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Tab switcher */}
        <div className="flex bg-emerald-50/70 p-1 rounded-2xl border border-emerald-100 mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-emerald-700'
            }`}
          >
            Daxil Ol
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'register'
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-emerald-700'
            }`}
          >
            Qeydiyyat
          </button>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-black text-gray-900">
            {mode === 'login' ? 'AqroBazar-a Xoş Gəlmisiniz' : 'Yeni Hesab Yaradın'}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {mode === 'login' 
              ? 'Elan yerləşdirmək, icarə və alış-veriş etmək üçün daxil olun' 
              : 'Azərbaycanın ən böyük aqrar ekosisteminə qoşulun'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {mode === 'register' && (
            <>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Ad və Soyad / Şirkət Adı *</label>
                <input
                  type="text"
                  required
                  placeholder="Məs: Rəşad Qasımov"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Hesab Tipi *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: 'farmer' })}
                    className={`py-2 rounded-xl border font-bold text-center transition ${
                      formData.userType === 'farmer'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    🌱 Fermer / Alıcı
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: 'company' })}
                    className={`py-2 rounded-xl border font-bold text-center transition ${
                      formData.userType === 'company'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    🚜 Satıcı / Şirkət
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Əlaqə Nömrəsi *</label>
                <input
                  type="tel"
                  required
                  placeholder="+994 50 123 45 67"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block font-bold text-gray-700 mb-1">E-poçt Ünvanı *</label>
            <input
              type="email"
              required
              placeholder="fermer@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Şifrə *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {mode === 'login' && (
            <div className="flex justify-end">
              <a href="#forgot" className="text-[11px] text-emerald-700 hover:underline">Şifrəni unutmusunuz?</a>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span>{mode === 'login' ? 'Daxil Ol' : 'Hesab Yarat'}</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
          {mode === 'login' ? (
            <p>
              Hesabınız yoxdur?{' '}
              <button 
                onClick={() => setMode('register')} 
                className="text-emerald-700 font-bold hover:underline"
              >
                Qeydiyyatdan keçin
              </button>
            </p>
          ) : (
            <p>
              Artıq hesabınız var?{' '}
              <button 
                onClick={() => setMode('login')} 
                className="text-emerald-700 font-bold hover:underline"
              >
                Daxil olun
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}