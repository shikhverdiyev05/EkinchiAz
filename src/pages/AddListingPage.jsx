/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, X, Plus, Upload, Link, Image as ImageIcon, Loader2 } from 'lucide-react';
import { createProductApi, DEFAULT_CATEGORIES, DEFAULT_REGIONS } from '../services/apiService';
import { uploadImageToImgBB } from '../services/imageService';

// ── Leaflet: dynamik import to avoid SSR issues ──────────────────────
let MapComponent = null;

// Təhlükəsiz string çıxaran köməkçi funksiya
const toStringVal = (item) => {
  if (typeof item === 'string') return item;
  if (item && typeof item === 'object') return item.name || item.title || item.label || item.id || '';
  return String(item || '');
};

// Torpaq / Bağ / Əkin sahəsi kateqoriyaları
const LAND_CATEGORIES = ['Torpaq', 'Bağ', 'Əkin', 'Sahə', 'Bağça'];
const isLandCategory = (cat) => LAND_CATEGORIES.some(k => toStringVal(cat).includes(k));

// Valyuta seçimləri
const CURRENCIES = ['AZN', 'USD'];

// Unit suffix seçimləri
const UNIT_SUFFIXES = ['ədəd', 'kisə', 'kq', 'ton', 'litr', 'flakon', 'gün', 'ay', 'il', 'hektar', 'sot'];

export default function AddListingPage({
  currentUser,
  categories = [],
  regions = [],
  onRequireAuth,
  onAddProduct,
  onCancel
}) {
  // ── Safe arrays ──────────────────────────────────────────────────
  const safeRegions = Array.isArray(regions) && regions.length > 0
    ? regions.flatMap(r => {
        if (typeof r === 'string') return [r];
        if (Array.isArray(r?.items)) return r.items.map(toStringVal);
        if (r?.name && typeof r.name === 'string') return [r.name];
        if (typeof r === 'object' && r !== null) {
          return Object.values(r).map(toStringVal).filter(v => v && v.length > 1 && !v.startsWith('http'));
        }
        return [];
      }).map(toStringVal).filter(r => r && r !== 'Hamısı' && r !== 'all')
    : DEFAULT_REGIONS;

  const safeCategories = (Array.isArray(categories) && categories.length > 0
    ? categories.filter(c => c && c.id !== 'all')
    : DEFAULT_CATEGORIES).map(c => ({
      id: c?.id || toStringVal(c?.name) || 'cat',
      name: toStringVal(c?.name || c?.title || c?.id || 'Gübrələr'),
      subcategories: Array.isArray(c?.subcategories) ? c.subcategories.map(toStringVal).filter(Boolean) : []
    }));

  const initialCatName = safeCategories[0]?.name || 'Gübrələr və Kimyəvi Maddələr';

  // ── State ────────────────────────────────────────────────────────
  const [type, setType] = useState('sale');
  const [category, setCategory] = useState(initialCatName);
  const [subcategory, setSubcategory] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('AZN');
  const [unitSuffix, setUnitSuffix] = useState('kisə');
  const [year, setYear] = useState(new Date().getFullYear());
  const [location, setLocation] = useState(safeRegions[0] || 'Bərdə');
  const [description, setDescription] = useState('');

  // Multi-image state
  const [imageUploadType, setImageUploadType] = useState('file');
  const [images, setImages] = useState([]); // [{src: string, file?: File, url?: string}]
  const [imageUploading, setImageUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  // Map state (land/bağ/əkin)
  const [mapCoords, setMapCoords] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const [features, setFeatures] = useState([
    { key: 'Vəziyyəti', value: 'Yeni' },
    { key: 'Zəmanət', value: '1 il' }
  ]);

  const [sellerName, setSellerName] = useState(currentUser?.name || '');
  const [sellerPhone, setSellerPhone] = useState(currentUser?.phone || '+994 55 673 14 07');
  const [sellerWhatsapp, setSellerWhatsapp] = useState(
    currentUser?.phone ? currentUser.phone.replace(/\D/g, '') : '994556731407'
  );

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ── Derived ──────────────────────────────────────────────────────
  // If the stored category name is not in the loaded list (e.g. categories loaded async after mount),
  // fall back to the first available without calling setState inside an effect.
  const effectiveCategory = safeCategories.some(c => c.name === category || c.id === category)
    ? category
    : (safeCategories[0]?.name || category);

  const isLand = isLandCategory(effectiveCategory);
  const unit = `${currency} / ${unitSuffix}`;

  const activeCategoryObj = safeCategories.find(c => c.name === effectiveCategory || c.id === effectiveCategory);
  const defaultCategoryObj = DEFAULT_CATEGORIES.find(c => c.name === effectiveCategory || c.id === effectiveCategory);
  const rawSubList = (activeCategoryObj?.subcategories?.length > 0)
    ? activeCategoryObj.subcategories
    : (defaultCategoryObj?.subcategories || []);
  const subcategoriesList = rawSubList.map(toStringVal).filter(Boolean);

  // ── Handlers ─────────────────────────────────────────────────────
  const getSuggestedUnitSuffix = useCallback((selectedType, selectedCat) => {
    const catStr = toStringVal(selectedCat);
    if (selectedType === 'rent') return catStr.includes('Torpaq') || catStr.includes('Sahə') ? 'il' : 'gün';
    if (catStr.includes('Gübrə')) return 'kisə';
    if (catStr.includes('Ağac') || catStr.includes('Bitki') || catStr.includes('Ting')) return 'ədəd';
    if (catStr.includes('Toxum') || catStr.includes('Yem')) return 'kq';
    if (catStr.includes('Dərman')) return 'flakon';
    return 'ədəd';
  }, []);

  const handleTypeSelect = (newType) => {
    setType(newType);
    setUnitSuffix(getSuggestedUnitSuffix(newType, category));
  };

  const handleCategorySelect = (newCategory) => {
    const catName = toStringVal(newCategory);
    setCategory(catName);
    const catObj = safeCategories.find(c => c.name === catName || c.id === catName)
      || DEFAULT_CATEGORIES.find(c => c.name === catName || c.id === catName);
    const subList = (catObj?.subcategories || []).map(toStringVal).filter(Boolean);
    setSubcategory(subList[0] || '');
    setUnitSuffix(getSuggestedUnitSuffix(type, catName));
  };

  // ── Image handlers ───────────────────────────────────────────────
  const addFiles = (files) => {
    const remaining = 5 - images.length;
    if (remaining <= 0) return;
    const toAdd = Array.from(files).slice(0, remaining);
    const newImgs = [];
    toAdd.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: `${file.name} faylı 5MB limitini aşır` }));
        return;
      }
      const src = URL.createObjectURL(file);
      newImgs.push({ src, file });
    });
    setImages(prev => [...prev, ...newImgs]);
    setErrors(prev => ({ ...prev, image: '' }));
  };

  const addUrl = () => {
    if (!urlInput.trim()) return;
    if (images.length >= 5) { setErrors(prev => ({ ...prev, image: 'Maksimum 5 şəkil əlavə edilə bilər' })); return; }
    try {
      new URL(urlInput.trim()); // validate
      setImages(prev => [...prev, { src: urlInput.trim(), url: urlInput.trim() }]);
      setUrlInput('');
      setErrors(prev => ({ ...prev, image: '' }));
    } catch {
      setErrors(prev => ({ ...prev, image: 'Düzgün URL daxil edin' }));
    }
  };

  const removeImage = (idx) => {
    setImages(prev => {
      const copy = [...prev];
      if (copy[idx]?.src && copy[idx]?.file) URL.revokeObjectURL(copy[idx].src);
      copy.splice(idx, 1);
      return copy;
    });
  };

  const handleFileInput = (e) => addFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  // ── Features ─────────────────────────────────────────────────────
  const handleAddFeature = () => setFeatures([...features, { key: '', value: '' }]);
  const handleRemoveFeature = (idx) => setFeatures(features.filter((_, i) => i !== idx));
  const handleFeatureChange = (idx, field, val) => {
    const updated = [...features];
    updated[idx][field] = val;
    setFeatures(updated);
  };

  // ── Validation ───────────────────────────────────────────────────
  const validateListing = () => {
    const errs = {};
    const phoneRegex = /^(\+994|0)(50|51|55|70|77|99|10|60)\d{7}$/;
    if (!title.trim() || title.trim().length < 5) errs.title = 'Elan başlığı ən azı 5 simvol olmalıdır';
    if (!price || Number(price) <= 0) errs.price = 'Qiymət 0-dan böyük olmalıdır';
    if (!description.trim() || description.trim().length < 15) errs.description = 'Təsvir ən azı 15 simvol olmalıdır';
    const cleanedPhone = sellerPhone.replace(/\s+/g, '');
    if (!cleanedPhone || !phoneRegex.test(cleanedPhone)) errs.sellerPhone = 'Düzgün nömrə: +994 50 123 45 67';
    if (images.length === 0) errs.image = 'Ən azı 1 şəkil mütləq əlavə edilməlidir';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) { onRequireAuth('Elanı paylaşmaq üçün zəhmət olmasa daxil olun'); return; }
    if (!validateListing()) return;
    setSubmitting(true);

    try {
      setImageUploading(true);
      const uploadedUrls = [];
      for (const img of images) {
        if (img.url) {
          uploadedUrls.push(img.url);
        } else if (img.file) {
          try {
            const url = await uploadImageToImgBB(img.file);
            uploadedUrls.push(url);
          } catch {
            setErrors(prev => ({ ...prev, image: `${img.file.name} yüklənərkən xəta baş verdi` }));
            setSubmitting(false); setImageUploading(false); return;
          }
        }
      }
      setImageUploading(false);

      const catStr = toStringVal(category);
      const isHeavyOrLand = catStr.includes('Texnika') || catStr.includes('Torpaq') || catStr.includes('Sahə');
      const featureObj = {};
      features.forEach(f => { if (f.key.trim() && f.value.trim()) featureObj[f.key.trim()] = f.value.trim(); });

      const newProduct = {
        title:           title.trim(),
        type,
        category:        catStr,
        subcategory:     toStringVal(subcategory),
        price:           Number(price),
        unit,
        year:            Number(year),
        location:        toStringVal(location) || 'Bakı',
        inStock:         true,
        rating:          5.0,
        reviewsCount:    1,
        image:           uploadedUrls[0] || '',
        gallery:         uploadedUrls,
        description:     description.trim(),
        features:        featureObj,
        canAddToCart:    type === 'sale' && !isHeavyOrLand,
        requiresInquiry: type === 'sale' && isHeavyOrLand,
        isRental:        type === 'rent',
        ...(mapCoords ? { coordinates: { lat: mapCoords.lat, lng: mapCoords.lng } } : {}),
        seller: {
          name:        sellerName || currentUser.name || 'Aqro Satıcı',
          phone:       sellerPhone || currentUser.phone || '',
          whatsapp:    sellerWhatsapp.replace(/\D/g, '') || '',
          verified:    true,
          rating:      5.0,
          memberSince: '2026',
        },
        userId: currentUser.id,
      };

      const result = await createProductApi(newProduct);
      // Cleanup object URLs
      images.forEach(img => { if (img.src && img.file) URL.revokeObjectURL(img.src); });
      setImages([]);
      setTitle(''); setPrice(''); setDescription(''); setErrors({});
      setCategory(initialCatName); setSubcategory(''); setMapCoords(null);
      onAddProduct(result || newProduct);
    } catch (err) {
      console.error('Elan paylaşma xətası:', err);
      setErrors(prev => ({ ...prev, global: 'Elan Firestore-a yazılarkən xəta baş verdi. Yenidən cəhd edin.' }));
    } finally {
      setSubmitting(false);
      setImageUploading(false);
    }
  };

  // ── UI helpers ───────────────────────────────────────────────────
  const inputCls = (err) => `w-full p-2.5 rounded-2xl border ${err ? 'border-rose-500' : 'border-gray-200'} text-xs focus:border-emerald-500 outline-none transition`;

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 pb-24 lg:pb-16 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] sm:text-xs font-black uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">Elan Paneli</span>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mt-1.5">Yeni Aqrar Elan Əlavə Et</h1>
        </div>
        <button onClick={onCancel} className="text-xs font-bold text-gray-500 hover:text-gray-900 hidden sm:block">Ləğv et ✕</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {errors.global && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs flex items-center gap-2">
            <X className="w-4 h-4 shrink-0" /> {errors.global}
          </div>
        )}

        {/* 1. Elan Növü */}
        <div className="p-5 rounded-3xl bg-white/90 border border-emerald-100 shadow-xs space-y-3">
          <h3 className="font-black text-gray-900 text-sm">1. Elan Növü</h3>
          <div className="grid grid-cols-2 gap-3">
            <div onClick={() => handleTypeSelect('sale')} className={`p-4 rounded-2xl border-2 cursor-pointer transition ${type === 'sale' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 hover:border-emerald-200'}`}>
              <span className="font-bold text-gray-900 block">🌱 Satış Elanı</span>
              <p className="text-[11px] text-gray-500 mt-0.5">Gübrə, toxum, dərman, ting, avadanlıq və s.</p>
            </div>
            <div onClick={() => handleTypeSelect('rent')} className={`p-4 rounded-2xl border-2 cursor-pointer transition ${type === 'rent' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
              <span className="font-bold text-gray-900 block">🚜 İcarə Elanı</span>
              <p className="text-[11px] text-gray-500 mt-0.5">Traktor, kombayn və ya əkin torpaqları</p>
            </div>
          </div>
        </div>

        {/* 2. Kateqoriya və Məlumatlar */}
        <div className="p-5 rounded-3xl bg-white/90 border border-emerald-100 shadow-xs space-y-4">
          <h3 className="font-black text-gray-900 text-sm">2. Kateqoriya və Məlumatlar</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Kateqoriya *</label>
              <select value={effectiveCategory} onChange={(e) => handleCategorySelect(e.target.value)} className="w-full p-2.5 rounded-2xl border border-gray-200 font-bold text-xs bg-white focus:border-emerald-500 outline-none">
                {safeCategories.map((c, idx) => <option key={c.id || idx} value={toStringVal(c.name)}>{toStringVal(c.name)}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Alt Kateqoriya</label>
              <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="w-full p-2.5 rounded-2xl border border-gray-200 font-semibold text-xs bg-white focus:border-emerald-500 outline-none">
                <option value="">Alt kateqoriya seçin...</option>
                {subcategoriesList.map((sub, idx) => <option key={idx} value={toStringVal(sub)}>{toStringVal(sub)}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Məkan / Rayon *</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2.5 rounded-2xl border border-gray-200 font-bold text-xs bg-white focus:border-emerald-500 outline-none">
                {safeRegions.map((reg, idx) => <option key={idx} value={toStringVal(reg)}>{toStringVal(reg)}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">İstehsal İli</label>
              <input type="number" min="1990" max="2030" value={year} onChange={(e) => setYear(e.target.value)} className="w-full p-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:border-emerald-500 outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Elanın Başlığı *</label>
              <input type="text" required value={title} onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors(prev => ({ ...prev, title: '' })); }} placeholder="Məs: Belarus MTZ-82.1 Traktoru" className={inputCls(errors.title)} />
              {errors.title && <p className="text-[11px] text-rose-600 font-bold mt-1">⚠ {errors.title}</p>}
            </div>

            {/* Qiymət + Valyuta + Ölçü Vahidi */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Qiymət *</label>
              <div className="flex gap-2">
                <input type="number" required min="1" step="any" value={price} onChange={(e) => { setPrice(e.target.value); if (errors.price) setErrors(prev => ({ ...prev, price: '' })); }} placeholder="Məs: 45" className={`flex-1 p-2.5 rounded-2xl border ${errors.price ? 'border-rose-500' : 'border-gray-200'} text-xs focus:border-emerald-500 outline-none`} />
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="shrink-0 p-2.5 rounded-2xl border border-gray-200 font-bold text-xs bg-white focus:border-emerald-500 outline-none">
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {errors.price && <p className="text-[11px] text-rose-600 font-bold mt-1">⚠ {errors.price}</p>}
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Ölçü Vahidi</label>
              <div className="flex gap-2 items-center">
                <span className="text-gray-400 font-bold shrink-0 text-[11px]">{currency} /</span>
                <select value={unitSuffix} onChange={(e) => setUnitSuffix(e.target.value)} className="flex-1 p-2.5 rounded-2xl border border-gray-200 font-semibold text-xs bg-white focus:border-emerald-500 outline-none">
                  {UNIT_SUFFIXES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <input type="text" value={unitSuffix} onChange={(e) => setUnitSuffix(e.target.value)} placeholder="kisə" className="flex-1 p-2.5 rounded-2xl border border-gray-200 text-xs focus:border-emerald-500 outline-none" />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Nəticə: <strong>{unit}</strong></p>
            </div>
          </div>

          {/* Torpaq/Bağ/Əkin üçün Xəritə Seçimi */}
          {isLand && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-emerald-800 text-xs">Ərazinin Xəritədə Yeri (Satellit görünüş)</span>
                </div>
                <button type="button" onClick={() => setShowMap(!showMap)} className="px-3 py-1 rounded-xl text-[11px] font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition">
                  {showMap ? 'Xəritəni Bağla' : 'Xəritəni Aç'}
                </button>
              </div>
              {mapCoords && (
                <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  ✓ Seçilmiş koordinat: {mapCoords.lat.toFixed(5)}, {mapCoords.lng.toFixed(5)}
                  <button type="button" onClick={() => setMapCoords(null)} className="ml-2 text-rose-500 hover:text-rose-700"><X className="w-3 h-3" /></button>
                </p>
              )}
              {showMap && <LeafletMapPicker onSelect={(coords) => { setMapCoords(coords); }} selectedCoords={mapCoords} />}
            </div>
          )}

          {/* Ətraflı Təsvir */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Ətraflı Təsvir *</label>
            <textarea rows="4" required value={description} onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors(prev => ({ ...prev, description: '' })); }} placeholder="Məhsulun keyfiyyəti, saxlanma şəraiti, çatdırılma şərtləri..." className={`w-full p-2.5 rounded-2xl border ${errors.description ? 'border-rose-500' : 'border-gray-200'} text-xs resize-none focus:border-emerald-500 outline-none`} />
            {errors.description && <p className="text-[11px] text-rose-600 font-bold mt-1">⚠ {errors.description}</p>}
          </div>
        </div>

        {/* 3. Şəkillər */}
        <div className="p-5 rounded-3xl bg-white/90 border border-emerald-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-gray-900 text-sm">3. Məhsulun Şəkilləri *</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Maksimum 5 şəkil (hər biri max 5MB)</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setImageUploadType('file')} className={`px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 ${imageUploadType === 'file' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                <Upload className="w-3 h-3" /> Cihazdan Seç
              </button>
              <button type="button" onClick={() => setImageUploadType('url')} className={`px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 ${imageUploadType === 'url' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                <Link className="w-3 h-3" /> Şəkil Linki
              </button>
            </div>
          </div>

          {imageUploadType === 'file' ? (
            <label
              className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition ${images.length >= 5 ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' : 'border-emerald-200 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/70'}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={images.length < 5 ? handleDrop : undefined}
            >
              <ImageIcon className="w-8 h-8 text-emerald-400 mb-2" />
              <span className="font-bold text-gray-700 text-xs">Şəkilləri seçmək üçün bura klikləyin və ya sürüşdürün</span>
              <span className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, WEBP — Maksimum 5MB / şəkil • {images.length}/5 əlavə edilib</span>
              <input type="file" accept="image/*" multiple onChange={handleFileInput} className="hidden" disabled={images.length >= 5} />
            </label>
          ) : (
            <div className="flex gap-2">
              <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl(); } }} placeholder="https://example.com/mehsul-sekli.jpg" className="flex-1 p-2.5 rounded-2xl border border-gray-200 text-xs focus:border-emerald-500 outline-none" disabled={images.length >= 5} />
              <button type="button" onClick={addUrl} disabled={images.length >= 5} className="px-4 py-2 rounded-2xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 transition flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Əlavə Et
              </button>
            </div>
          )}

          {/* Şəkil Gallery Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden border border-emerald-200 aspect-square bg-gray-100 shadow-sm">
                  <img src={img.src} alt={`Şəkil ${idx + 1}`} className="w-full h-full object-cover" />
                  {idx === 0 && <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] font-bold bg-emerald-600/80 text-white py-0.5">Əsas</span>}
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-black/60 hover:bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
              {images.length < 5 && imageUploadType === 'file' && (
                <label className="relative rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-400 aspect-square bg-gray-50 flex items-center justify-center cursor-pointer transition">
                  <Plus className="w-6 h-6 text-gray-400" />
                  <input type="file" accept="image/*" multiple onChange={handleFileInput} className="hidden" />
                </label>
              )}
            </div>
          )}

          {errors.image && <p className="text-[11px] text-rose-600 font-bold">⚠ {errors.image}</p>}
        </div>

        {/* 4. Xüsusiyyətlər */}
        <div className="p-5 rounded-3xl bg-white/90 border border-emerald-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-gray-900 text-sm">4. Əlavə Xüsusiyyətlər</h3>
            <button type="button" onClick={handleAddFeature} className="text-emerald-700 font-bold text-xs hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-xl flex items-center gap-1">
              <Plus className="w-3 h-3" /> Parametr Əlavə Et
            </button>
          </div>
          <div className="space-y-2">
            {features.map((feat, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input type="text" placeholder="Parametr (Məs: Çəki)" value={feat.key} onChange={(e) => handleFeatureChange(idx, 'key', e.target.value)} className="flex-1 p-2 rounded-xl border border-gray-200 text-xs focus:border-emerald-400 outline-none" />
                <input type="text" placeholder="Dəyər (Məs: 50 kq)" value={feat.value} onChange={(e) => handleFeatureChange(idx, 'value', e.target.value)} className="flex-1 p-2 rounded-xl border border-gray-200 text-xs focus:border-emerald-400 outline-none" />
                <button type="button" onClick={() => handleRemoveFeature(idx)} className="text-gray-400 hover:text-rose-600 p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Əlaqə Məlumatları */}
        <div className="p-5 rounded-3xl bg-white/90 border border-emerald-100 shadow-xs space-y-3">
          <h3 className="font-black text-gray-900 text-sm">5. Əlaqə Məlumatları</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Adınız / Şirkət Adı</label>
              <input type="text" value={sellerName} onChange={(e) => setSellerName(e.target.value)} className="w-full p-2.5 rounded-2xl border border-gray-200 text-xs focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Əlaqə Nömrəsi *</label>
              <input type="tel" required value={sellerPhone} onChange={(e) => { setSellerPhone(e.target.value); if (errors.sellerPhone) setErrors(prev => ({ ...prev, sellerPhone: '' })); }} className={`w-full p-2.5 rounded-2xl border ${errors.sellerPhone ? 'border-rose-500' : 'border-gray-200'} text-xs focus:border-emerald-500 outline-none`} />
              {errors.sellerPhone && <p className="text-[11px] text-rose-600 font-bold mt-1">⚠ {errors.sellerPhone}</p>}
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">WhatsApp Nömrəsi</label>
              <div className="flex gap-1 items-center">
                <span className="shrink-0 text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-2.5 rounded-xl border border-gray-200">+994</span>
                <input type="tel" value={sellerWhatsapp.replace(/^994/, '')} onChange={(e) => setSellerWhatsapp('994' + e.target.value.replace(/\D/g, ''))} placeholder="" className="flex-1 p-2.5 rounded-2xl border border-gray-200 text-xs focus:border-emerald-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button type="submit" disabled={submitting || imageUploading} className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-700/20 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {imageUploading ? (<><Loader2 className="w-5 h-5 animate-spin" /><span>Şəkillər ImgBB-yə yüklənir...</span></>) : submitting ? (<><Loader2 className="w-5 h-5 animate-spin" /><span>Elan Firestore-a qeyd olunur...</span></>) : (<><span>🚀</span><span>Elanı Dərhal Paylaş</span></>)}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Leaflet Map Picker (inline, lazy - Satellite tile via Google Maps)
──────────────────────────────────────────────────────────────────── */
function LeafletMapPicker({ onSelect, selectedCoords }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let L;
    const init = async () => {
      try {
        L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');

        // Fix default marker icons
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        if (!mapRef.current || mapInstanceRef.current) return;

        const defaultCenter = selectedCoords
          ? [selectedCoords.lat, selectedCoords.lng]
          : [40.4093, 49.8671]; // Bakı

        const map = L.map(mapRef.current, { zoomControl: true }).setView(defaultCenter, 10);
        mapInstanceRef.current = map;

        // Satellite tile (Esri World Imagery)
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and GIS User Community',
          maxZoom: 19,
        }).addTo(map);

        if (selectedCoords) {
          markerRef.current = L.marker([selectedCoords.lat, selectedCoords.lng]).addTo(map);
        }

        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
          else markerRef.current = L.marker([lat, lng]).addTo(map);
          onSelect({ lat, lng });
        });

        setLoaded(true);
      } catch (err) {
        console.error('Leaflet init error:', err);
        setError('Xəritə yüklənmədi. Koordinatları əl ilə daxil edin.');
        setLoaded(true);
      }
    };
    init();
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) return (
    <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-bold">
      {error}
    </div>
  );

  return (
    <div className="rounded-2xl overflow-hidden border border-emerald-300 shadow-sm relative">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-emerald-50 z-10 rounded-2xl">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="ml-2 text-xs text-emerald-700 font-bold">Xəritə yüklənir...</span>
        </div>
      )}
      <div ref={mapRef} style={{ height: '300px', width: '100%' }} />
      <p className="text-[10px] text-center text-gray-500 py-1.5 bg-white border-t border-emerald-100">
        Ərazinin yerini seçmək üçün xəritədə klikləyin (Peyk görünüşü)
      </p>
    </div>
  );
}
