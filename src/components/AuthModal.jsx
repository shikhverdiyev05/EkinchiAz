/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { loginUserApi, registerUserApi } from '../services/apiService';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMessage = '' }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  
  // Input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+994 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('farmer');
  const [showPassword, setShowPassword] = useState(false);

  // Form Validation & Errors State
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(\+994|0)(50|51|55|70|77|99|10|60)\d{7}$/;

  const validateField = (fieldName, value) => {
    let error = '';

    if (fieldName === 'name') {
      if (!value.trim()) {
        error = 'Ad və Soyad mütləq daxil edilməlidir';
      } else if (value.trim().length < 3) {
        error = 'Ad və Soyad ən azı 3 hərfdən ibarət olmalıdır';
      }
    }

    if (fieldName === 'email') {
      if (!value.trim()) {
        error = 'E-poçt ünvanı mütləq daxil edilməlidir';
      } else if (!emailRegex.test(value.trim())) {
        error = 'Düzgün e-poçt daxil edin (məs: ad@fermer.az)';
      }
    }

    if (fieldName === 'phone') {
      const cleaned = value.replace(/\s+/g, '');
      if (!cleaned || cleaned === '+994') {
        error = 'Telefon nömrəsi mütləq daxil edilməlidir';
      } else if (!phoneRegex.test(cleaned)) {
        error = 'Format: +994 (50/51/55/70/77/99/10/60) xxx xx xx';
      }
    }

    if (fieldName === 'password') {
      if (!value) {
        error = 'Şifrə mütləq daxil edilməlidir';
      } else if (value.length < 6) {
        error = 'Şifrə ən azı 6 simvoldan ibarət olmalıdır';
      }
    }

    if (fieldName === 'confirmPassword') {
      if (!value) {
        error = 'Şifrənin təkrarı mütləq daxil edilməlidir';
      } else if (value !== password) {
        error = 'Şifrələr bir-biri ilə uyğun gəlmir';
      }
    }

    return error;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    let val = '';
    if (field === 'name') val = name;
    if (field === 'email') val = email;
    if (field === 'phone') val = phone;
    if (field === 'password') val = password;
    if (field === 'confirmPassword') val = confirmPassword;

    const err = validateField(field, val);
    setErrors(prev => ({ ...prev, [field]: err }));
  };

  const validateAll = () => {
    const newErrors = {};

    if (tab === 'login') {
      const eErr = validateField('email', email);
      const pErr = validateField('password', password);
      if (eErr) newErrors.email = eErr;
      if (pErr) newErrors.password = pErr;
    } else {
      const nErr = validateField('name', name);
      const eErr = validateField('email', email);
      const phErr = validateField('phone', phone);
      const pErr = validateField('password', password);
      const cpErr = validateField('confirmPassword', confirmPassword);
      
      if (nErr) newErrors.name = nErr;
      if (eErr) newErrors.email = eErr;
      if (phErr) newErrors.phone = phErr;
      if (pErr) newErrors.password = pErr;
      if (cpErr) newErrors.confirmPassword = cpErr;
    }

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true
    });

    return Object.keys(newErrors).length === 0;
  };

  // Login (GET) və Register (POST) Sorğuları
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setLoading(true);
    setErrors(prev => ({ ...prev, global: '' }));

    try {
      if (tab === 'login') {
        // 1. GET sorğusu ilə istifadəçiləri yoxlayır
        const response = await loginUserApi(email.trim(), password);
        
        if (response.success && response.user) {
          onAuthSuccess(response.user, `Xoş gəldiniz, ${response.user.name}!`);
          onClose();
        } else {
          setErrors(prev => ({ ...prev, global: response.error || 'Daxil edilmiş e-poçt və ya şifrə yanlışdır!' }));
        }
      } else {
        // 2. POST sorğusu ilə yeni istifadəçini API-yə göndərir
        const payload = {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password: password,
          userType: userType
        };

        const response = await registerUserApi(payload);

        if (response.success && response.user) {
          onAuthSuccess(response.user, 'Qeydiyyat uğurla tamamlandı və daxil oldunuz!');
          onClose();
        } else {
          setErrors(prev => ({ ...prev, global: 'Qeydiyyat zamanı xəta baş verdi. Zəhmət olmasa yenidən yoxlayın.' }));
        }
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, global: 'Şəbəkə xətası baş verdi. Zəhmət olmasa internet əlaqənizi yoxlayın.' }));
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (newTab) => {
    setTab(newTab);
    setErrors({});
    setTouched({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-emerald-100 relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold transition"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 text-2xl flex items-center justify-center mx-auto mb-2 font-black shadow-xs">
            🌱
          </div>
          <h3 className="text-xl font-black text-gray-900">
            {tab === 'login' ? 'Şəxsi Hesaba Giriş' : 'Yeni Hesab Qeydiyyatı'}
          </h3>
          {initialMessage && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 py-1.5 px-3 rounded-xl mt-2 font-bold">
              🔒 {initialMessage}
            </p>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-emerald-50/80 p-1 rounded-2xl border border-emerald-100 mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => switchTab('login')}
            className={`flex-1 py-2 rounded-xl transition ${
              tab === 'login' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600 hover:text-emerald-900'
            }`}
          >
            Daxil Ol
          </button>
          <button
            type="button"
            onClick={() => switchTab('register')}
            className={`flex-1 py-2 rounded-xl transition ${
              tab === 'register' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600 hover:text-emerald-900'
            }`}
          >
            Qeydiyyat
          </button>
        </div>

        {/* Global Error Notice */}
        {errors.global && (
          <div className="p-3 mb-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <span>⚠</span>
            <span>{errors.global}</span>
          </div>
        )}

        {/* Form with Real-time Validation */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3.5 text-xs">
          
          {/* Register: Ad və Soyad */}
          {tab === 'register' && (
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Ad və Soyad <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onBlur={() => handleBlur('name')}
                onChange={(e) => {
                  setName(e.target.value);
                  if (touched.name) setErrors(prev => ({ ...prev, name: validateField('name', e.target.value) }));
                }}
                placeholder="Məs: Qurban Əliyev"
                className={`w-full px-3.5 py-2.5 rounded-2xl bg-white border ${
                  errors.name && touched.name ? 'border-rose-500 bg-rose-50/30' : 'border-gray-200 focus:border-emerald-500'
                } text-xs font-medium text-gray-900 outline-none transition`}
              />
              {errors.name && touched.name && (
                <p className="text-[11px] text-rose-600 font-bold mt-1 animate-fadeIn">⚠ {errors.name}</p>
              )}
            </div>
          )}

          {/* E-poçt Ünvanı */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              E-poçt Ünvanı <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onBlur={() => handleBlur('email')}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched.email) setErrors(prev => ({ ...prev, email: validateField('email', e.target.value) }));
              }}
              placeholder="fermer@example.com"
              className={`w-full px-3.5 py-2.5 rounded-2xl bg-white border ${
                errors.email && touched.email ? 'border-rose-500 bg-rose-50/30' : 'border-gray-200 focus:border-emerald-500'
              } text-xs font-medium text-gray-900 outline-none transition`}
            />
            {errors.email && touched.email && (
              <p className="text-[11px] text-rose-600 font-bold mt-1 animate-fadeIn">⚠ {errors.email}</p>
            )}
          </div>

          {/* Register: Telefon Nömrəsi */}
          {tab === 'register' && (
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Telefon Nömrəsi <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onBlur={() => handleBlur('phone')}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (touched.phone) setErrors(prev => ({ ...prev, phone: validateField('phone', e.target.value) }));
                }}
                placeholder="+994 50 123 45 67"
                className={`w-full px-3.5 py-2.5 rounded-2xl bg-white border ${
                  errors.phone && touched.phone ? 'border-rose-500 bg-rose-50/30' : 'border-gray-200 focus:border-emerald-500'
                } text-xs font-semibold text-gray-900 outline-none transition`}
              />
              {errors.phone && touched.phone ? (
                <p className="text-[11px] text-rose-600 font-bold mt-1 animate-fadeIn">⚠ {errors.phone}</p>
              ) : (
                <p className="text-[10px] text-gray-400 mt-1">Format: +994 50 123 45 67</p>
              )}
            </div>
          )}

          {/* Register: İstifadəçi Növü */}
          {tab === 'register' && (
            <div>
              <label className="block font-bold text-gray-700 mb-1">Fəaliyyət Növü</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setUserType('farmer')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    userType === 'farmer' ? 'bg-emerald-100 border-emerald-600 text-emerald-950 shadow-xs' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  🌾 Fermer / Şəxsi
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('company')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    userType === 'company' ? 'bg-emerald-100 border-emerald-600 text-emerald-950 shadow-xs' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  🏢 Aqro-Şirkət
                </button>
              </div>
            </div>
          )}

          {/* Şifrə */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Şifrə <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onBlur={() => handleBlur('password')}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) setErrors(prev => ({ ...prev, password: validateField('password', e.target.value) }));
                }}
                placeholder="••••••••"
                className={`w-full px-3.5 py-2.5 rounded-2xl bg-white border ${
                  errors.password && touched.password ? 'border-rose-500 bg-rose-50/30' : 'border-gray-200 focus:border-emerald-500'
                } text-xs font-medium text-gray-900 outline-none pr-12 transition`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs font-bold"
              >
                {showPassword ? 'Gizlə' : 'Göstər'}
              </button>
            </div>
            {errors.password && touched.password && (
              <p className="text-[11px] text-rose-600 font-bold mt-1 animate-fadeIn">⚠ {errors.password}</p>
            )}
          </div>

          {/* Register: Şifrənin Təkrarı */}
          {tab === 'register' && (
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Şifrənin Təkrarı <span className="text-rose-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onBlur={() => handleBlur('confirmPassword')}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (touched.confirmPassword) {
                    setErrors(prev => ({ ...prev, confirmPassword: validateField('confirmPassword', e.target.value) }));
                  }
                }}
                placeholder="••••••••"
                className={`w-full px-3.5 py-2.5 rounded-2xl bg-white border ${
                  errors.confirmPassword && touched.confirmPassword ? 'border-rose-500 bg-rose-50/30' : 'border-gray-200 focus:border-emerald-500'
                } text-xs font-medium text-gray-900 outline-none transition`}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-[11px] text-rose-600 font-bold mt-1 animate-fadeIn">⚠ {errors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition active:scale-[0.99] disabled:opacity-70 mt-3"
          >
            {loading ? 'Yoxlanılır...' : tab === 'login' ? 'Daxil Ol →' : 'Qeydiyyatı Tamamla ✓'}
          </button>



        </form>

      </div>
    </div>
  );
}