/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { createProductApi } from '../services/apiService';
import { uploadImageToImgBB } from '../services/imageService';

// Kateqoriyalar üçün etibarlı standart alt kateqoriyalar (əgər serverdən gəlməzsə)
const DEFAULT_SUBCATEGORIES = {
  'Gübrələr': ['Azot Gübrələri', 'Fosfor Gübrələri', 'Kalium Gübrələri', 'Üzvi Gübrələr', 'Kompost'],
  'Gübrələr və Kimyəvi Maddələr': ['Azot Gübrələri', 'Fosfor Gübrələri', 'Kalium Gübrələri', 'Üzvi Gübrələr'],
  'Ağac və Bitkilər': ['Meyvə Tingləri', 'Dekorativ Ağaclar', 'Həmişəyaşıl Bitkilər', 'Gül və Çiçəklər'],
  'Toxumlar və Heyvan Yemləri': ['Taxıl Toxumları', 'Tərəvəz Toxumları', 'Yonca və Ot Toxumu', 'Qüvvəli Yemlər', 'Silas və Kəpək'],
  'Toxumlar': ['Taxıl Toxumları', 'Tərəvəz Toxumları', 'Bostan Bitkiləri', 'Yonca'],
  'Aqrar və Heyvan Dərmanları': ['Fungisidlər (Göbələk)', 'İnsektisidlər (Zərərverici)', 'Herbisidlər (Alaq)', 'Baytarlıq Dərmanları', 'Vitamin və Minerallar'],
  'Kənd Təsərrüfatı Texnikaları': ['Traktorlar', 'Kombaynlar', 'Kotan və Frezlər', 'Dərman Səpənlər', 'Otbiçənlər', 'Qoşqular'],
  'Torpaq, Bağ və Əkin Sahələri': ['Suvarılan Əkin Sahəsi', 'Meyvə Bağı', 'İstixana (Parnik)', 'Otlaq və Həyətyanı Sahə'],
  'Təsərrüfat Ləvazimatları': ['Damla Suvarma Sistemləri', 'Arıçılıq Ləvazimatları', 'Bağban Alətləri', 'Maldarlıq Avadanlıqları']
};

const DEFAULT_REGIONS = [
  'Bakı', 'Abşeron', 'Sumqayıt', 'Gəncə', 'Quba', 'Qusar', 'Xaçmaz', 'Şabran',
  'Qəbələ', 'Şəki', 'Zaqatala', 'Balakən', 'Qax', 'Bərdə', 'Tərtər', 'Ağdam',
  'Ağcabədi', 'Yevlax', 'Kürdəmir', 'Ucar', 'Göyçay', 'İsmayıllı', 'Şamaxı',
  'Şəmkir', 'Tovuz', 'Qazax', 'Ağstafa', 'Goranboy', 'Saatlı', 'Sabirabad',
  'İmişli', 'Biləsuvar', 'Cəlilabad', 'Masallı', 'Lənkəran', 'Astara', 'Lerik',
  'Salyan', 'Neftçala', 'Naxçıvan MR'
];

export default function AddListingPage({
  currentUser,
  categories = [],
  regions = [],
  onRequireAuth,
  onAddProduct,
  onCancel
}) {
  // Regionlar siyahısını təhlükəsiz formatda çıxarırıq (string array)
  const safeRegions = Array.isArray(regions) && regions.length > 0
    ? regions
        .map(r => (typeof r === 'string' ? r : r?.name || r?.id))
        .filter(r => r && r !== 'Hamısı' && r !== 'all')
    : DEFAULT_REGIONS;

  // Kateqoriyalar siyahısını təhlükəsiz formatda çıxarırıq
  const safeCategories = Array.isArray(categories) && categories.length > 0
    ? categories.filter(c => c.id !== 'all' && c.name)
    : [
        { id: 'gubreler', name: 'Gübrələr və Kimyəvi Maddələr' },
        { id: 'agac-bitki', name: 'Ağac və Bitkilər' },
        { id: 'toxum-yem', name: 'Toxumlar və Heyvan Yemləri' },
        { id: 'levazimatlar', name: 'Təsərrüfat Ləvazimatları' },
        { id: 'dermanlar', name: 'Aqrar və Heyvan Dərmanları' },
        { id: 'texnikalar', name: 'Kənd Təsərrüfatı Texnikaları' },
        { id: 'torpaq-saheleri', name: 'Torpaq, Bağ və Əkin Sahələri' }
      ];

  const [type, setType] = useState('sale');
  const [category, setCategory] = useState(safeCategories[0]?.name || 'Gübrələr');
  const [subcategory, setSubcategory] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('AZN / kisə');
  const [year, setYear] = useState(new Date().getFullYear());
  const [location, setLocation] = useState(safeRegions[0] || 'Bərdə');
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

  // Formu tamamilə təmizləyən funksiya
  const resetForm = () => {
    const defaultCat = safeCategories[0]?.name || 'Gübrələr';
    setType('sale');
    setCategory(defaultCat);
    setSubcategory('');
    setTitle('');
    setPrice('');
    setUnit(getSuggestedUnit('sale', defaultCat));
    setYear(new Date().getFullYear());
    setLocation(safeRegions[0] || 'Bərdə');
    setDescription('');
    setImageUrl('');
    setImageFilePreview('');
    setImageFile(null);
    setImageUploading(false);
    setFeatures([
      { key: 'Vəziyyəti', value: 'Yeni' },
      { key: 'Zəmanət', value: '1 il' }
    ]);
    setErrors({});
  };

  // Kateqoriyalar serverdən gec yüklənərsə, ilk kateqoriyanı seç
  useEffect(() => {
    if (safeCategories.length > 0 && !safeCategories.some(c => c.name === category)) {
      const firstCat = safeCategories[0].name;
      setCategory(firstCat);
      setUnit(getSuggestedUnit(type, firstCat));
    }
  }, [categories]);

  // Alt kateqoriyaların dinamik tapılması
  const activeCategoryObj = safeCategories.find(c => c.name === category);
  const subcategoriesList = (activeCategoryObj?.subcategories && activeCategoryObj.subcategories.length > 0)
    ? activeCategoryObj.subcategories
    : (DEFAULT_SUBCATEGORIES[category] || []);

  const getSuggestedUnit = (selectedType, selectedCategory) => {
    if (selectedType === 'rent') {
      return selectedCategory?.includes('Torpaq') || selectedCategory?.includes('Sahə') 
        ? 'AZN / hektar / il' 
        : 'AZN / gün';
    }
    if (selectedCategory?.includes('Gübrə')) return 'AZN / kisə';
    if (selectedCategory?.includes('Ağac') || selectedCategory?.includes('Bitki')) return 'AZN / ədəd';
    if (selectedCategory?.includes('Toxum') || selectedCategory?.includes('Yem')) return 'AZN / kq';
    if (selectedCategory?.includes('Dərman')) return 'AZN / flakon';
    if (selectedCategory?.includes('Texnika') || selectedCategory?.includes('Torpaq')) return 'AZN';
    return 'AZN / ədəd';
  };

  const handleTypeSelect = (newType) => {
    setType(newType);
    setUnit(getSuggestedUnit(newType, category));
  };

  const handleCategorySelect = (newCategory) => {
    setCategory(newCategory);
    const catObj = safeCategories.find(c => c.name === newCategory);
    const subList = catObj?.subcategories || DEFAULT_SUBCATEGORIES[newCategory] || [];
    setSubcategory(subList[0] || '');
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
        setImageFilePreview(reader.result);
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
    if (!imageUrl && !imageFile && !imageFilePreview) errs.image = 'Şəkil mütləq əlavə edilməlidir';

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
          setErrors(prev => ({ ...prev, image: 'Şəkil ImgBB serverinə yüklənərkən xəta baş verdi. İnternet əlaqənizi yoxlayın.' }));
          setSubmitting(false);
          setImageUploading(false);
          return;
        } finally {
          setImageUploading(false);
        }
      }

      if (!finalImage) {
        setErrors(prev => ({ ...prev, image: 'Şəkil mütləq əlavə edilməlidir' }));
        setSubmitting(false);
        return;
      }

      // ── Addım 2: Məhsulu Firestore-a yaz ──────────────────
      const isHeavyOrLand = category.includes('Texnika') || category.includes('Torpaq') || category.includes('Sahə');
      const featureObj = {};
      features.forEach(f => {
        if (f.key.trim() && f.value.trim()) featureObj[f.key.trim()] = f.value.trim();
      });

      const newProduct = {
        title:           title.trim(),
        type,
        category,
        subcategory:     subcategory || '',
        price:           Number(price),
        unit,
        year:            Number(year),
        location:        location || 'Bakı',
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
      
      // Formu tam təmizlə
      resetForm();
      
      onAddProduct(result || newProduct);

    } catch (err) {
      console.error('Elan paylaşma xətası:', err);
      setErrors(prev => ({ ...prev, global: 'Elan Firestore-a yazılarkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.' }));
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
        {/* Global Xəta Mesajı */}
        {errors.global && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs">
            ⚠ {errors.global}
          </div>
        )}

        {/* 1. Növ */}
        <div className="p-5 rounded-3xl bg-white/90 border border-emerald-100 shadow-xs space-y-3">
          <h3 className="font-black text-gray-900 text-sm">1. Elan Növü</h3>
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => handleTypeSelect('sale')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition ${type === 'sale' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 hover:border-emerald-200'}`}
            >
              <span className="font-bold text-gray-900 block">🌱 Satış Elanı</span>
              <p className="text-[11px] text-gray-500 mt-0.5">Gübrə, toxum, dərman, ting, avadanlıq və s.</p>
            </div>
            <div
              onClick={() => handleTypeSelect('rent')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition ${type === 'rent' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
            >
              <span className="font-bold text-gray-900 block">🚜 İcarə Elanı</span>
              <p className="text-[11px] text-gray-500 mt-0.5">Traktor, kombayn və ya əkin torpaqları</p>
            </div>
          </div>
        </div>

        {/* 2. Məlumatlar & Subkateqoriya & Region */}
        <div className="p-5 rounded-3xl bg-white/90 border border-emerald-100 shadow-xs space-y-4">
          <h3 className="font-black text-gray-900 text-sm">2. Kateqoriya və Məlumatlar</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kateqoriya Seçimi */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Kateqoriya *</label>
              <select
                value={category}
                onChange={(e) => handleCategorySelect(e.target.value)}
                className="w-full p-2.5 rounded-2xl border border-gray-200 font-bold text-xs bg-white focus:border-emerald-500 outline-none"
              >
                {safeCategories.map((c) => (
                  <option key={c.id || c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Subkateqoriya Seçimi */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Alt Kateqoriya (Subcategory)</label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full p-2.5 rounded-2xl border border-gray-200 font-semibold text-xs bg-white focus:border-emerald-500 outline-none"
              >
                <option value="">Alt kateqoriya seçin...</option>
                {subcategoriesList.map((sub, idx) => (
                  <option key={idx} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Region Seçimi */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Məkan / Rayon *</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-2xl border border-gray-200 font-bold text-xs bg-white focus:border-emerald-500 outline-none"
              >
                {safeRegions.map((regName, idx) => (
                  <option key={idx} value={regName}>{regName}</option>
                ))}
              </select>
            </div>

            {/* İstehsal İli */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">İstehsal İli</label>
              <input
                type="number"
                min="1990"
                max="2030"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full p-2.5 rounded-2xl border border-gray-200 text-xs font-semibold focus:border-emerald-500 outline-none"
              />
            </div>

            {/* Başlıq */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Elanın Başlığı *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors(prev => ({ ...prev, title: '' })); }}
                placeholder="Məs: Belarus MTZ-82.1 Traktoru və ya Karbamid Azot Gübrəsi"
                className={`w-full p-2.5 rounded-2xl border ${errors.title ? 'border-rose-500' : 'border-gray-200'} text-xs focus:border-emerald-500 outline-none`}
              />
              {errors.title && <p className="text-[11px] text-rose-600 font-bold mt-1">⚠ {errors.title}</p>}
            </div>

            {/* Qiymət */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Qiymət (AZN) *</label>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={price}
                onChange={(e) => { setPrice(e.target.value); if (errors.price) setErrors(prev => ({ ...prev, price: '' })); }}
                placeholder="Məs: 45"
                className={`w-full p-2.5 rounded-2xl border ${errors.price ? 'border-rose-500' : 'border-gray-200'} text-xs focus:border-emerald-500 outline-none`}
              />
              {errors.price && <p className="text-[11px] text-rose-600 font-bold mt-1">⚠ {errors.price}</p>}
            </div>

            {/* Qiymət Vahidi */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Ölçü Vahidi</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Məs: AZN / kisə və ya AZN / gün"
                className="w-full p-2.5 rounded-2xl border border-gray-200 text-xs focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Təsvir */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Ətraflı Təsvir *</label>
            <textarea
              rows="4"
              required
              value={description}
              onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors(prev => ({ ...prev, description: '' })); }}
              placeholder="Məhsulun keyfiyyəti, saxlanma şəraiti, çatdırılma və ya icarə şərtləri haqqında ətraflı məlumat..."
              className={`w-full p-2.5 rounded-2xl border ${errors.description ? 'border-rose-500' : 'border-gray-200'} text-xs resize-none focus:border-emerald-500 outline-none`}
            />
            {errors.description && <p className="text-[11px] text-rose-600 font-bold mt-1">⚠ {errors.description}</p>}
          </div>
        </div>

        {/* 3. Şəkil Yükləmə (ImgBB Cloud) */}
        <div className="p-5 rounded-3xl bg-white/90 border border-emerald-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-gray-900 text-sm">3. Məhsulun Şəkli (ImgBB Cloud) *</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setImageUploadType('file')}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold ${imageUploadType === 'file' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Kompüterdən Seç
              </button>
              <button
                type="button"
                onClick={() => setImageUploadType('url')}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold ${imageUploadType === 'url' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Şəkil Linki (URL)
              </button>
            </div>
          </div>

          {imageUploadType === 'file' ? (
            <div>
              <label className="border-2 border-dashed border-emerald-200 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-emerald-50/40 hover:bg-emerald-50/70 transition">
                <span className="text-2xl mb-1">📸</span>
                <span className="font-bold text-gray-700 text-xs">Şəkli seçmək üçün bura klikləyin</span>
                <span className="text-[10px] text-gray-400 mt-0.5">PNG, JPG və ya WEBP (Maksimum 5MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {imageFile && (
                <p className="text-[11px] text-emerald-700 font-bold mt-2">
                  ✓ Seçilmiş fayl: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          ) : (
            <div>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/mehsul-sekli.jpg"
                className="w-full p-2.5 rounded-2xl border border-gray-200 text-xs focus:border-emerald-500 outline-none"
              />
            </div>
          )}

          {/* Şəkil Önizləməsi */}
          {(imageFilePreview || imageUrl) && (
            <div className="relative w-32 h-24 rounded-xl overflow-hidden border border-emerald-200 shadow-xs mt-2">
              <img src={imageFilePreview || imageUrl} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => { setImageFile(null); setImageFilePreview(''); setImageUrl(''); }}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] hover:bg-rose-600"
              >
                ✕
              </button>
            </div>
          )}

          {errors.image && <p className="text-[11px] text-rose-600 font-bold">⚠ {errors.image}</p>}
        </div>

        {/* 4. Xüsusiyyətlər (Features) */}
        <div className="p-5 rounded-3xl bg-white/90 border border-emerald-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-gray-900 text-sm">4. Əlavə Xüsusiyyətlər</h3>
            <button
              type="button"
              onClick={handleAddFeature}
              className="text-emerald-700 font-bold text-xs hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-xl"
            >
              + Parametr Əlavə Et
            </button>
          </div>

          <div className="space-y-2">
            {features.map((feat, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Parametr (Məs: Çəki)"
                  value={feat.key}
                  onChange={(e) => handleFeatureChange(idx, 'key', e.target.value)}
                  className="flex-1 p-2 rounded-xl border border-gray-200 text-xs"
                />
                <input
                  type="text"
                  placeholder="Dəyər (Məs: 50 kq)"
                  value={feat.value}
                  onChange={(e) => handleFeatureChange(idx, 'value', e.target.value)}
                  className="flex-1 p-2 rounded-xl border border-gray-200 text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(idx)}
                  className="text-gray-400 hover:text-rose-600 px-2 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Satıcı Əlaqə Məlumatları */}
        <div className="p-5 rounded-3xl bg-white/90 border border-emerald-100 shadow-xs space-y-3">
          <h3 className="font-black text-gray-900 text-sm">5. Əlaqə Məlumatları</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Adınız / Şirkət Adı</label>
              <input
                type="text"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="w-full p-2.5 rounded-2xl border border-gray-200 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Əlaqə Nömrəsi *</label>
              <input
                type="tel"
                required
                value={sellerPhone}
                onChange={(e) => { setSellerPhone(e.target.value); if (errors.sellerPhone) setErrors(prev => ({ ...prev, sellerPhone: '' })); }}
                className={`w-full p-2.5 rounded-2xl border ${errors.sellerPhone ? 'border-rose-500' : 'border-gray-200'} text-xs`}
              />
              {errors.sellerPhone && <p className="text-[11px] text-rose-600 font-bold mt-1">⚠ {errors.sellerPhone}</p>}
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">WhatsApp Nömrəsi</label>
              <input
                type="text"
                value={sellerWhatsapp}
                onChange={(e) => setSellerWhatsapp(e.target.value)}
                placeholder="994501234567"
                className="w-full p-2.5 rounded-2xl border border-gray-200 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Təsdiq və Paylaşım Düyməsi */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting || imageUploading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-700/20 active:scale-[0.99] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {imageUploading ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Şəkil ImgBB-yə yüklənir...</span>
              </>
            ) : submitting ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Elan Firestore-a qeyd olunur...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Elanı Dərhal Paylaş</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}