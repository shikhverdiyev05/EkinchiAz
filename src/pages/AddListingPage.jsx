/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-useless-assignment */
import { useState, useEffect } from 'react';
import { CATEGORIES, REGIONS } from '../data/categories';

export default function AddListingPage({
  currentUser,
  onRequireAuth,
  onAddProduct,
  onCancel
}) {
  const [type, setType] = useState('sale'); // 'sale' | 'rent'
  const [category, setCategory] = useState('Gübrələr');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('AZN / kisə');
  const [year, setYear] = useState(new Date().getFullYear());
  const [location, setLocation] = useState('Bərdə');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=80');
  
  // Dynamic features key-value pairs
  const [features, setFeatures] = useState([
    { key: 'Vəziyyəti', value: 'Yeni' },
    { key: 'Zəmanət', value: '1 il' }
  ]);

  // Seller info
  const [sellerName, setSellerName] = useState(currentUser?.name || '');
  const [sellerPhone, setSellerPhone] = useState(currentUser?.phone || '+994 50 123 45 67');
  const [sellerWhatsapp, setSellerWhatsapp] = useState('994501234567');

  // Adjust suggested units based on category and type
  useEffect(() => {
    if (type === 'rent') {
      if (category === 'Torpaq, Bağ və Əkin Sahələri') {
        setUnit('AZN / hektar / il');
      } else {
        setUnit('AZN / gün');
      }
    } else {
      if (category === 'Gübrələr') setUnit('AZN / kisə');
      else if (category === 'Ağac və Bitkilər') setUnit('AZN / ədəd');
      else if (category === 'Toxumlar və Heyvan Yemləri') setUnit('AZN / kq');
      else if (category === 'Aqrar və Heyvan Dərmanları') setUnit('AZN / flakon');
      else if (category === 'Kənd Təsərrüfatı Texnikaları' || category === 'Torpaq, Bağ və Əkin Sahələri') setUnit('AZN');
      else setUnit('AZN / dəst');
    }
  }, [type, category]);

  // Check login requirement
  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center animate-fadeIn">
        <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-emerald-100 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 text-3xl flex items-center justify-center mx-auto">
            🔒
          </div>
          <h2 className="text-2xl font-black text-gray-900">Giriş Tələb Olunur</h2>
          <p className="text-xs sm:text-sm text-gray-600">
            AqroBazar platformasında yeni satış və ya icarə elanı yerləşdirmək üçün şəxsi hesabınıza daxil olmalısınız.
          </p>
          <button
            onClick={() => onRequireAuth('Yeni elan yerləşdirmək üçün daxil olun')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md"
          >
            Giriş Et / Qeydiyyatdan Keç
          </button>
        </div>
      </div>
    );
  }

  const handleAddFeature = () => {
    setFeatures([...features, { key: '', value: '' }]);
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (index, field, val) => {
    const updated = [...features];
    updated[index][field] = val;
    setFeatures(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Determine business logic flags
    const isHeavyOrLand = category === 'Kənd Təsərrüfatı Texnikaları' || category === 'Torpaq, Bağ və Əkin Sahələri';
    
    let canAddToCart = false;
    let requiresInquiry = false;
    let isRental = false;

    if (type === 'sale') {
      if (isHeavyOrLand) {
        canAddToCart = false;
        requiresInquiry = true;
      } else {
        canAddToCart = true;
        requiresInquiry = false;
      }
    } else {
      isRental = true;
      canAddToCart = false;
      requiresInquiry = false;
    }

    const featureObj = {};
    features.forEach(f => {
      if (f.key.trim() && f.value.trim()) {
        featureObj[f.key.trim()] = f.value.trim();
      }
    });

    const newProduct = {
      id: `prod-${Date.now()}`,
      title: title.trim(),
      type: type,
      canAddToCart: canAddToCart,
      requiresInquiry: requiresInquiry,
      isRental: isRental,
      category: category,
      price: Number(price),
      unit: unit,
      year: Number(year),
      location: location,
      inStock: true,
      rating: 5.0,
      reviewsCount: 1,
      image: imageUrl.trim() || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=80',
      gallery: [imageUrl.trim()],
      description: description.trim(),
      features: featureObj,
      seller: {
        name: sellerName || currentUser.name,
        phone: sellerPhone,
        whatsapp: sellerWhatsapp.replace(/\D/g, ''),
        verified: true,
        rating: 5.0,
        memberSince: '2026'
      },
      userId: currentUser.id
    };

    onAddProduct(newProduct);
  };

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 pb-24 lg:pb-16 animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Elan Yerləşdirmə Paneli
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight mt-1.5">
            Yeni Aqrar Elan Əlavə Et
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Satış və ya icarə elanınızın bütün təfərrüatlarını qeyd edərək minlərlə fermer və alıcıya çatdırın.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-bold text-gray-500 hover:text-gray-900 hidden sm:block"
        >
          Ləğv et ✕
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Elan Növü Seçimi */}
        <div className="p-5 sm:p-7 rounded-3xl bg-white/90 backdrop-blur-xl border border-emerald-100 shadow-xs space-y-4">
          <h3 className="font-black text-gray-900 text-sm sm:text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">1</span>
            <span>Elan Növünü Seçin</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setType('sale')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                type === 'sale' ? 'border-emerald-600 bg-emerald-50/70 shadow-xs' : 'border-gray-200 hover:border-emerald-200'
              }`}
            >
              <div>
                <span className="font-bold text-gray-900 text-sm block">🌱 Satış Elanı</span>
                <p className="text-[11px] text-gray-500 mt-0.5">Məhsulu birbaşa satmaq üçün</p>
              </div>
              <input type="radio" checked={type === 'sale'} readOnly className="accent-emerald-600 w-4 h-4" />
            </div>

            <div
              onClick={() => setType('rent')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                type === 'rent' ? 'border-blue-600 bg-blue-50/70 shadow-xs' : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              <div>
                <span className="font-bold text-gray-900 text-sm block">🚜 İcarə Elanı</span>
                <p className="text-[11px] text-gray-500 mt-0.5">Texnika və ya torpaq sahəsini icarəyə vermək üçün</p>
              </div>
              <input type="radio" checked={type === 'rent'} readOnly className="accent-blue-600 w-4 h-4" />
            </div>
          </div>
        </div>

        {/* 2. Kateqoriya & Əsas Məlumatlar */}
        <div className="p-5 sm:p-7 rounded-3xl bg-white/90 backdrop-blur-xl border border-emerald-100 shadow-xs space-y-4">
          <h3 className="font-black text-gray-900 text-sm sm:text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">2</span>
            <span>Kateqoriya və Məlumatlar</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Kateqoriya *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-bold text-gray-800 outline-none focus:border-emerald-500"
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Region */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Məkan / Rayon *</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-bold text-gray-800 outline-none focus:border-emerald-500"
              >
                {REGIONS.filter(r => r !== 'Hamısı').map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Elanın Başlığı *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Məs: Belarus MTZ-82.1 Traktoru və ya NPK 15-15-15 Gübrəsi"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Qiymət (AZN) *</label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Məs: 45"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Ölçü Vahidi *</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-bold text-gray-800 outline-none focus:border-emerald-500"
              >
                <option value="AZN">AZN (Ümumi Qiymət)</option>
                <option value="AZN / kisə">AZN / kisə</option>
                <option value="AZN / ədəd">AZN / ədəd</option>
                <option value="AZN / kq">AZN / kq</option>
                <option value="AZN / flakon">AZN / flakon</option>
                <option value="AZN / gün">AZN / gün (İcarə)</option>
                <option value="AZN / hektar">AZN / hektar</option>
                <option value="AZN / hektar / il">AZN / hektar / il (İcarə)</option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">İstehsal / Buraxılış İli</label>
              <input
                type="number"
                min="1990"
                max="2030"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Şəkil URL-i</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Ətraflı Təsvir *</label>
              <textarea
                rows="4"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Məhsulun vəziyyəti, çatdırılma və ya icarə şərtləri haqqında ətraflı məlumat yazın..."
                className="w-full p-3 rounded-2xl bg-white border border-gray-200 text-xs font-medium text-gray-900 outline-none focus:border-emerald-500"
              />
            </div>

          </div>
        </div>

        {/* 3. Dinamik Xüsusiyyətlər (Specifications) */}
        <div className="p-5 sm:p-7 rounded-3xl bg-white/90 backdrop-blur-xl border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-gray-900 text-sm sm:text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">3</span>
              <span>Texniki Göstəricilər və Xüsusiyyətlər</span>
            </h3>
            <button
              type="button"
              onClick={handleAddFeature}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              + Xüsusiyyət əlavə et
            </button>
          </div>

          <div className="space-y-2">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={feat.key}
                  onChange={(e) => handleFeatureChange(idx, 'key', e.target.value)}
                  placeholder="Parametr (məs: Gücü, Tərkibi, Sahə)"
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-medium outline-none"
                />
                <input
                  type="text"
                  value={feat.value}
                  onChange={(e) => handleFeatureChange(idx, 'value', e.target.value)}
                  placeholder="Dəyər (məs: 81 a.g., 50 kq, 4 Hektar)"
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-medium outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(idx)}
                  className="p-2 text-rose-500 hover:text-rose-700 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Satıcı Əlaqə Məlumatları */}
        <div className="p-5 sm:p-7 rounded-3xl bg-white/90 backdrop-blur-xl border border-emerald-100 shadow-xs space-y-4">
          <h3 className="font-black text-gray-900 text-sm sm:text-base flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">4</span>
            <span>Əlaqə Məlumatları</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Satıcı / Təsərrüfat Adı</label>
              <input
                type="text"
                required
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-semibold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Telefon Nömrəsi</label>
              <input
                type="tel"
                required
                value={sellerPhone}
                onChange={(e) => setSellerPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-semibold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp Nömrəsi</label>
              <input
                type="text"
                required
                value={sellerWhatsapp}
                onChange={(e) => setSellerWhatsapp(e.target.value)}
                placeholder="99450xxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-semibold outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 text-white font-black text-sm shadow-xl shadow-emerald-600/25 transition active:scale-[0.99]"
          >
            Elanı Dərhal Paylaş ✓
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs"
          >
            Ləğv Et
          </button>
        </div>

      </form>

    </div>
  );
}