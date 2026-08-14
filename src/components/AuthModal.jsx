/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */

import { useState } from 'react';
import { registerUser, loginUser } from '../services/storageService';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMessage }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+994 ');
  const [userType, setUserType] = useState('farmer'); // 'farmer' | 'company'
  const [region, setRegion] = useState('Bakı');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const user = loginUser(email, password);
      onAuthSuccess(user, 'Uğurla daxil oldunuz!');
      onClose();
    } catch (err) {
      setErrorMsg('Giriş zamanı xəta baş verdi.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name || !email || !password) {
      setErrorMsg('Zəhmət olmasa bütün vacib xanaları doldurun.');
      return;
    }

    try {
      const newUser = registerUser({
        name,
        email,
        phone,
        password,
        userType,
        region
      });
      onAuthSuccess(newUser, 'Qeydiyyat uğurla tamamlandı və hesaba daxil oldunuz!');
      onClose();
    } catch (err) {
      setErrorMsg('Qeydiyyat zamanı xəta baş verdi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-md flex items-center justify-center p-3.5 sm:p-4 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-md w-full border border-emerald-100 shadow-2xl overflow-hidden relative my-auto p-5 sm:p-7">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          ✕
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 text-white flex items-center justify-center mx-auto text-2xl mb-2 shadow-md">
            🌱
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900">
            {activeTab === 'login' ? 'Hesaba Giriş' : 'Yeni Hesab Yarat'}
          </h3>
          {initialMessage && (
            <p className="text-xs text-emerald-800 font-bold bg-emerald-50 py-1.5 px-3 rounded-xl mt-2 border border-emerald-100">
              {initialMessage}
            </p>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-emerald-50/80 p-1 rounded-2xl border border-emerald-100 mb-5 text-xs">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl font-bold transition ${
              activeTab === 'login' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600 hover:text-emerald-800'
            }`}
          >
            Daxil Ol
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl font-bold transition ${
              activeTab === 'register' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600 hover:text-emerald-800'
            }`}
          >
            Qeydiyyat
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">E-poçt Ünvanı</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="fermer@aqrobazar.az"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Şifrə</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md mt-2"
            >
              Hesaba Daxil Ol
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            
            {/* Role Selection */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Hesab Tipi</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setUserType('farmer')}
                  className={`py-2 rounded-xl border font-bold transition ${
                    userType === 'farmer' ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  🧑‍🌾 Fermer / Alıcı
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('company')}
                  className={`py-2 rounded-xl border font-bold transition ${
                    userType === 'company' ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  🏢 Aqro Şirkət / Satıcı
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Ad və Soyad / Şirkət Adı *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Məs: Rəşad Qasımov"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-gray-700 mb-1">E-poçt *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fermer@mail.az"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Telefon</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+994 50 123 45 67"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Şifrə Təyin Edin *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md mt-2"
            >
              Qeydiyyatı Tamamla və Giriş Et
            </button>
          </form>
        )}

      </div>
    </div>
  );
}