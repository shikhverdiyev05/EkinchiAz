/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { createProductApi } from '../services/apiService';
import { uploadImageToImgBB } from '../services/imageService';

export default function AddListingPage({
  currentUser,
  categories = [],
  regions = [],
  onRequireAuth,
  onAddProduct,
  onCancel
}) {
  const [type, setType] = useState('sale');
  const [category, setCategory] = useState('Gübrələr');
  const [subcategory, setSubcategory] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('AZN / kisə');
  const [year, setYear] = useState(new Date().getFullYear());
  const [location, setLocation] = useState('Bərdə');
  const [description, setDescription] = useState('');
  
  // Şəkil yükləmə
  const [imageUploadType, setImageUploadType] = useState('file');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFilePreview, setImageFilePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  
  const [features, setFeatures] = useState([
    { key: 'Vəziyyəti', value: 'Yeni' },
    { key: 'Zəmanət', value: '1 il' }
  ]);

  const [sellerName, setSellerName] = useState(currentUser?.name || '');
  const [sellerPhone, setSellerPhone] = useState(currentUser?.phone || '+994 50 123 45 67');
  const [sellerWhatsapp, setSellerWhatsapp] = useState('994501234567');

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const activeCategoryObj = categories.find(c => c.name === category);
  const subcategoriesList = activeCategoryObj?.subcategories || [];

  const getSuggestedUnit = (selectedType, selectedCategory) => {
    if (selectedType === 'rent') {
      return selectedCategory === 'Torpaq, Bağ və Əkin Sahələri' ? 'AZN / hektar / il' : 'AZN / gün';
    }
    switch (selectedCategory) {
      case 'Gübrələr': return 'AZN / kisə';
      case 'Ağac və Bitkilər': return 'AZN / ədəd';
      case 'Toxumlar və Heyvan Yemləri': return 'AZN / kq';
      case 'Aqrar və Heyvan Dərmanları': return 'AZN / flakon';
      case 'Kənd Təsərrüfatı Texnikaları':
      case 'Torpaq, Bağ və Əkin Sahələri': return 'AZN';
      default: return 'AZN / dəst';
    }
  };

  const handleTypeSelect = (newType) => {
    setType(newType);
    setUnit(getSuggestedUnit(newType, category));
  };

  const handleCategorySelect = (newCategory) => {
    setCategory(newCategory);
    const catObj = categories.find(c => c.name === newCategory);
    setSubcategory(catObj?.subcategories?.[0] || '');
    setUnit(getSuggestedUnit(type, newCategory));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Şəklin həcmi maksimum 5MB ola bilər' }));
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFilePreview(reader.result); // yalnız önizləmə üçün
        setErrors(prev => ({ ...prev, image: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddFeature = () => setFeatures([...features, { key: '', value: '' }]);
  const handleRemoveFeature = (idx) => setFeatures(features.filter((_, i) => i !== idx));
  const handleFeatureChange = (idx, field, val) => {
    const updated = [...features];
    updated[idx][field] = val;
    setFeatures(updated);
  };

  const validateListing = () => {
    const errs = {};
    const phoneRegex = /^(\+994|0)(50|51|55|70|77|99|10|60)\d{7}$/;

    if (!title.trim() || title.trim().length < 5) errs.title = 'Elan başlığı ən azı 5 simvol olmalıdır';
    if (!price || Number(price) <= 0) errs.price = 'Qiymət 0-dan böyük olmalıdır';
    if (!description.trim() || description.trim().length < 15) errs.description = 'Təsvir ən azı 15 simvol olmalıdır';

    const cleanedPhone = sellerPhone.replace(/\s+/g, '');
    if (!cleanedPhone || !phoneRegex.test(cleanedPhone)) errs.sellerPhone = 'Düzgün nömrə: +994 50 123 45 67';
    if (!imageUrl && !imageFilePreview) errs.image = 'Şəkil mütləq əlavə edilməlidir';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      onRequireAuth('Elanı paylaşmaq üçün zəhmət olmasa daxil olun');
      return;
    }

    if (!validateListing()) return;
    setSubmitting(true);

    try {
      // ── Addım 1: Şəkili ImgBB-yə yüklə ───────────────────
      let finalImage = imageUrl || '';

      if (imageFile) {
        setImageUploading(true);
        try {
          finalImage = await uploadImageToImgBB(imageFile);
        } catch (imgErr) {
          console.error('ImgBB xətası:', imgErr);
          setErrors(prev => ({ ...prev, image: 'Şəkil yüklənərkən xəta baş verdi.' }));
          return;
        } finally {
          setImageUploading(false);
        }
      }

      if (!finalImage) {
        setErrors(prev => ({ ...prev, image: 'Şəkil mütləq əlavə edilməlidir' }));
        return;
      }

      // ── Addım 2: Məhsulu Firestore-a yaz ──────────────────
      const isHeavyOrLand = category === 'Kənd Təsərrüfatı Texnikaları'
                          || category === 'Torpaq, Bağ və Əkin Sahələri';
      const featureObj = {};
      features.forEach(f => {
        if (f.key.trim() && f.value.trim()) featureObj[f.key.trim()] = f.value.trim();
      });

      const newProduct = {
        title:           title.trim(),
        type,
        category,
        subcategory,
        price:           Number(price),
        unit,
        year:            Number(year),
        location,
        inStock:         true,
        rating:          5.0,
        reviewsCount:    1,
        image:           finalImage,
        gallery:         [finalImage],
        description:     description.trim(),
        features:        featureObj,
        canAddToCart:    type === 'sale' && !isHeavyOrLand,
        requiresInquiry: type === 'sale' &&  isHeavyOrLand,
        isRental:        type === 'rent',
        seller: {
          name:        sellerName || currentUser.name,
          phone:       sellerPhone,
          whatsapp:    sellerWhatsapp.replace(/\D/g, ''),
          verified:    true,
          rating:      5.0,
          memberSince: '2026',
        },
        userId: currentUser.id,
      };

      const result = await createProductApi(newProduct);
      onAddProduct(result || newProduct);

    } catch (err) {
      console.error('Elan paylaşma xətası:', err);
      setErrors(prev => ({ ...prev, global: 'Elan paylaşılarkən xəta baş verdi.' }));
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 pb-24 lg:pb-16 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] sm:text-xs font-black uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Elan Paneli
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mt-1.5">
            Yeni Aqrar Elan Əlavə Et
          </h1>
        </div>
        <button onClick={onCancel} className="text-xs font-bold text-gray-500 hover:text-gray-900 hidden sm:block">
          Ləğv et ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* 1. Növ */}
        <div className="p-5 rounded-3xl bg-white/90 border border-emerald-100 shadow-xs space-y-3">
          <h3 className="font-black text-gray-900 text-sm">1. Elan Növü</h3>
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => handleTypeSelect('sale')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition ${type === 'sale' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200'}`}
            >
              <span className="font-bold text-gray-900 block">🌱 Satış Elanı</span>
            </div>
            <div
              onClick={() => handleTypeSelect('rent')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition ${type === 'rent' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
            >
              <span className="font-bold text-gray-900 block">🚜 İcarə Elanı</span>
            </div>
          </div>
        </div>

        {/* 2. Məlumatlar & Subkateqoriya */}
        <div className="p-5 rounded-3xl bg-white/90 border border-emerald-100 shadow-xs space-y-4">
          <h3 className="font-black text-gray-900 text-sm">2. Kateqoriya və Məlumatlar</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Kateqoriya *</label>
              <select
                value={category}
                onChange={(e) => handleCategorySelect(e.target.value)}
                className="w-full p-2.5 rounded-2xl border border-gray-200 font-bold text-xs"
              >
                {categories.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id || c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Alt Kateqoriya (Subcategory)</label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full p-2.5 rounded-2xl border border-gray-200 font-semibold text-xs"
              >
                <option value="">Alt kateqoriya seçin...</option>
                {subcategoriesList.map((sub, idx) => (
                  <option key={idx} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Məkan / Rayon *</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-2xl border border-gray-200 font-bold text-xs"
              >
                {regions
                  .filter(r => r.name !== 'Hamısı')
                  .map(r => (
                    <option key={r.id || r.name} value={r.name}>{r.name}</option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">İstehsal İli</label>
              <input
                type="number"
                min="1990"
                max="2030"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full p-2.5 rounded-2xl border border-gray-200 text-xs font-semibold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Elanın Başlığı *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors(prev => ({ ...prev, title: '' })); }}
                placeholder="Məs: Belarus MTZ-82.1 Traktoru"
                className={`w-full p-2.5 rounded-2xl border ${errors.title ? 'border-rose-500' : 'border-gray-200'} text-xs`}
              />
              {errors.title && <p className="text-[11px] text-rose-600 font-bold mt-1">⚠ {errors.title}</p>}
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Qiymət (AZN) *</label>
              <input
                type="number"
                required
                min="1"
                value={price}
                onChange={(e) => { setPrice(e.target.value); if (errors.price) setErrors(prev => ({ ...prev, price: '' })); }}
                placeholder="45"
                className={`w-full p-2.5 rounded-2xl border ${errors.price ? 'border-rose-500' : 'border-gray-200'} text-xs`}
              />
              {errors.price && <p className="text-[11px] text-rose-600 font-bold mt-1">⚠ {errors.price}</p>}
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Ölçü Vahidi *</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full p-2.5 rounded-2xl border border-gray-200 font-bold text-xs"
              >
                <option value="AZN">AZN</option>
                <option value="AZN / kisə">AZN / kisə</option>
                <option value="AZN / ədəd">AZN / ədəd</option>
                <option value="AZN / kq">AZN / kq</option>
                <option value="AZN / flakon">AZN / flakon</option>
                <option value="AZN / gün">AZN / gün</option>
                <option value="AZN / hektar">AZN / hektar</option>
                <option value="AZN / hektar / il">AZN / hektar / il</option>
              </select>
            </div>

            {/* 3. Şəkil: Fayl və ya URL */}
            <div className="sm:col-span-2 space-y-2 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <label className="font-bold text-gray-700">Məhsul Şəkli *</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setImageUploadType('file')}
                    className={`px-3 py-1 rounded-xl font-bold text-[11px] ${imageUploadType === 'file' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    📁 Fayldan Yüklə
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUploadType('url')}
                    className={`px-3 py-1 rounded-xl font-bold text-[11px] ${imageUploadType === 'url' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    🔗 URL Keçidi
                  </button>
                </div>
              </div>

              {imageUploadType === 'file' ? (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2.5 rounded-2xl border border-gray-200 text-xs bg-emerald-50/50"
                />
              ) : (
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-2xl border border-gray-200 text-xs"
                />
              )}

              {(imageFilePreview || imageUrl) && (
                <div className="mt-2 flex items-center gap-3 p-2 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <img src={imageFilePreview || imageUrl} alt="Preview" className="w-16 h-16 rounded-xl object-cover" />
                  <span className="font-bold text-emerald-950">✓ Şəkil hazırdır</span>
                </div>
              )}
              {errors.image && <p className="text-[11px] text-rose-600 font-bold mt-1">⚠ {errors.image}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Ətraflı Təsvir *</label>
              <textarea
                rows="4"
                required
                value={description}
                onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors(prev => ({ ...prev, description: '' })); }}
                placeholder="Məhsul haqqında ətraflı məlumat..."
                className={`w-full p-3 rounded-2xl border ${errors.description ? 'border-rose-500' : 'border-gray-200'} text-xs font-medium`}
              />
              {errors.description && <p className="text-[11px] text-rose-600 font-bold mt-1">⚠ {errors.description}</p>}
            </div>

          </div>
        </div>

        {/* Göstəricilər */}
        <div className="p-5 rounded-3xl bg-white/90 border border-emerald-100 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-gray-900 text-sm">3. Göstəricilər</h3>
            <button type="button" onClick={handleAddFeature} className="font-bold text-emerald-700">+ Əlavə et</button>
          </div>
          {features.map((feat, idx) => (
            <div key={idx} className="flex gap-2">
              <input value={feat.key} onChange={e => handleFeatureChange(idx, 'key', e.target.value)} placeholder="Parametr" className="flex-1 p-2 rounded-xl border border-gray-200 text-xs" />
              <input value={feat.value} onChange={e => handleFeatureChange(idx, 'value', e.target.value)} placeholder="Dəyər" className="flex-1 p-2 rounded-xl border border-gray-200 text-xs" />
              <button type="button" onClick={() => handleRemoveFeature(idx)} className="p-2 text-rose-500 font-bold">✕</button>
            </div>
          ))}
        </div>

        {/* Əlaqə */}
        <div className="p-5 rounded-3xl bg-white/90 border border-emerald-100 shadow-xs space-y-4">
          <h3 className="font-black text-gray-900 text-sm">4. Satıcı Əlaqə</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Satıcı Adı *</label>
              <input type="text" required value={sellerName} onChange={(e) => setSellerName(e.target.value)} className="w-full p-2.5 rounded-2xl border border-gray-200 text-xs font-semibold" />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Telefon *</label>
              <input type="tel" required value={sellerPhone} onChange={(e) => { setSellerPhone(e.target.value); if (errors.sellerPhone) setErrors(prev => ({ ...prev, sellerPhone: '' })); }} className={`w-full p-2.5 rounded-2xl border ${errors.sellerPhone ? 'border-rose-500' : 'border-gray-200'} text-xs font-semibold`} />
              {errors.sellerPhone && <p className="text-[11px] text-rose-600 font-bold mt-1">⚠ {errors.sellerPhone}</p>}
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">WhatsApp</label>
              <input type="text" value={sellerWhatsapp} onChange={(e) => setSellerWhatsapp(e.target.value)} placeholder="99450xxxxxxx" className="w-full p-2.5 rounded-2xl border border-gray-200 text-xs font-semibold" />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 text-white font-black text-sm shadow-xl"
          >
            {submitting ? 'REST API-yə Göndərilir...' : 'Elanı Dərhal Paylaş (POST) ✓'}
          </button>
          <button type="button" onClick={onCancel} className="px-6 py-4 rounded-2xl bg-gray-100 font-bold text-xs">Ləğv Et</button>
        </div>

      </form>
    </div>
  );
}