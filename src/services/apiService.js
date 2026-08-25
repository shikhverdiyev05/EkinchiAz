/* eslint-disable no-unused-vars */
// ─────────────────────────────────────────────────────────────────────────
// Firebase Firestore Xidmətləri
// Bütün GET / POST / UPDATE əməliyyatları Firestore vasitəsilə həyata keçirilir.
// ─────────────────────────────────────────────────────────────────────────

import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../firebase';

// ────────────────────────────────
// COLLECTİON ADLARI
// ────────────────────────────────
const COL = {
  PRODUCTS:   'products',
  USERS:      'users',
  CATEGORIES: 'categories',
  REGIONS:    'regions',
  ORDERS:     'orders',
  BOOKINGS:   'bookings',
  CONTACTS:   'contacts',
  CARTS:      'user_carts',
  FAVORITES:  'user_favorites',
  FAQ:        'faq',
  ABOUT:      'about',
  POSTS:      'posts',
  COMMENTS:   'comments',
  LIKES:      'likes',
  SAVES:      'saves',
  FOLLOWS:    'follows',
};

// ────────────────────────────────
// 70+ ƏTRAFLI AZƏRBAYCAN REGİONLARI
// ────────────────────────────────
export const DEFAULT_REGIONS = [
  'Bakı', 'Abşeron', 'Sumqayıt', 'Gəncə', 'Mingəçevir', 'Şirvan', 'Naxçıvan MR',
  'Quba', 'Qusar', 'Xaçmaz', 'Şabran', 'Siyəzən', 'Xızı',
  'Qəbələ', 'Şəki', 'Zaqatala', 'Balakən', 'Qax', 'Oğuz',
  'Bərdə', 'Tərtər', 'Ağdam', 'Ağcabədi', 'Yevlax', 'Füzuli', 'Cəbrayıl', 'Zəngilan', 'Qubadlı', 'Laçın', 'Kəlbəcər', 'Şuşa', 'Xankəndi', 'Xocalı', 'Xocavənd',
  'Kürdəmir', 'Ucar', 'Göyçay', 'Zərdab', 'Ağdaş', 'İsmayıllı', 'Şamaxı', 'Qobustan', 'Ağsu',
  'Şəmkir', 'Tovuz', 'Qazax', 'Ağstafa', 'Gədəbəy', 'Daşkəsən', 'Goranboy', 'Samux', 'Göygöl',
  'Saatlı', 'Sabirabad', 'İmişli', 'Beyləqan', 'Biləsuvar', 'Cəlilabad', 'Masallı', 'Lənkəran', 'Astara', 'Lerik', 'Yardımlı',
  'Salyan', 'Neftçala', 'Hacıqabul',
  'Şahbuz', 'Babək', 'Ordubad', 'Culfa', 'Kəngərli', 'Sədərək', 'Şərur'
];

// ────────────────────────────────
// 10 ZƏNGİN AQRAR KATEQORİYA VƏ ALT KATEQORİYALAR
// ────────────────────────────────
export const DEFAULT_CATEGORIES = [
  {
    id: 'gubreler',
    name: 'Gübrələr və Kimyəvi Maddələr',
    icon: '🧪',
    type: 'sale',
    description: 'Azot, fosfor, kalium, mikroelementlər və üzvi kompost gübrələri',
    subcategories: [
      'Azot Gübrələri (Karbamid, Selitra)',
      'Fosfor və Ammophos Gübrələri',
      'Kalium və Kompleks NPK Gübrələri',
      'Üzvi və Bio-Gübrələr',
      'Maye və Yarpaq Gübrələri',
      'Mikroelementlər və Şelat Maddələri',
      'Torpaq Kondisionerləri və Kompost'
    ]
  },
  {
    id: 'agac-bitki',
    name: 'Ağac, Bitki və Meyvə Tingləri',
    icon: '🌳',
    type: 'sale',
    description: 'Sertifikatlı meyvə tingləri, dekorativ və həmişəyaşıl ağaclar, gül kolları',
    subcategories: [
      'Meyvə Tingləri (Alma, Armud, Şaftalı, Gavalı, Gilas)',
      'Qərzəkli Meyvələr (Fındıq, Qoz, Badam, Püstə)',
      'Subtropik Bitkilər (Zeytun, Nar, Xurma, Əncir, Sitrus)',
      'Dekorativ və Həmişəyaşıl Park Ağacları',
      'Gül və Landşaft Çiçəkləri',
      'Tərəvəz Şitilləri və Çiyələk Kolları',
      'Üzüm Tənəkləri və Giləmeyvələr'
    ]
  },
  {
    id: 'toxum-yem',
    name: 'Toxumlar və Heyvan Yemləri',
    icon: '🌾',
    type: 'sale',
    description: 'Məhsuldar taxıl, tərəvəz, bostan toxumları və yüksək proteinli yemlər',
    subcategories: [
      'Taxıl Toxumları (Buğda, Arpa, Vələmir, Çovdar)',
      'Tərəvəz və Bostan Bitkisi Toxumları',
      'Yonca, Koronqa və Çəmən Ot Toxumları',
      'Qüvvəli Yemlər və Kombikormlar',
      'Silos, Senaj, Pres Ot və Kəpək',
      'Mineral Yem Əlavələri, Premikslər və Duzlar'
    ]
  },
  {
    id: 'dermanlar',
    name: 'Aqrar və Heyvan Dərmanları',
    icon: '🛡️',
    type: 'sale',
    description: 'Zərərvericilərə, alaq otlarına və xəstəliklərə qarşı dərmanlar, baytarlıq vasitələri',
    subcategories: [
      'Fungisidlər (Göbələk və pas xəstəlikləri əleyhinə)',
      'İnsektisidlər (Zərərverici həşərat əleyhinə)',
      'Herbisidlər (Alaq otları əleyhinə)',
      'Akarisidlər və Nematosidlər',
      'Baytarlıq Dərmanları, Antibiotiklər və Peyvəndlər',
      'Bitki Biostimulyatorları, Amin Turşuları və Vitaminlər'
    ]
  },
  {
    id: 'texnikalar',
    name: 'Kənd Təsərrüfatı Texnikaları',
    icon: '🚜',
    type: 'both',
    description: 'Traktorlar, kombaynlar, aqreqatlar, qoşqular və əkin-biçin texnikaları',
    subcategories: [
      'Təkərli və Tırtıllı Traktorlar',
      'Taxılyığan və Yemyığan Kombaynlar',
      'Kotanlar, Frezlər, Diskli Malalar və Kultivatorlar',
      'Dərman Çiləyən və Gübrə Səpən Aqreqatlar',
      'Otbiçən, Dırmıq və Presvuran Texnikalar',
      'Traktor Qoşquları və Təsərrüfat Yükdaşıma Texnikası',
      'Dizel Suvarma Pompaları və Aqrar Generatorlar'
    ]
  },
  {
    id: 'torpaq-saheleri',
    name: 'Torpaq, Bağ və Əkin Sahələri',
    icon: '🗺️',
    type: 'both',
    description: 'Münbit suvarılan əkin torpaqları, bar verən meyvə bağları və istixanalar',
    subcategories: [
      'Suvarılan Əkin Sahələri (Mülkiyyət və İcarə)',
      'Bar Verən Meyvə və Fındıq Bağları',
      'Müasir İstixana Kompleksləri (Parniklər)',
      'Otlaq və Maldarlıq Təsərrüfat Sahələri',
      'Balıqçılıq Gölləri və Su Hövzələri',
      'Təsərrüfat Təyinatlı Həyətyanı Sahələr'
    ]
  },
  {
    id: 'levazimatlar',
    name: 'Təsərrüfat və Bağ Ləvazimatları',
    icon: '🛠️',
    type: 'sale',
    description: 'Damla suvarma boruları, arıçılıq qutuları, budama və əl alətləri',
    subcategories: [
      'Damla və Yağışmator Suvarma Sistemləri',
      'Arıçılıq Avadanlıqları, Pətəklər və Bal Süzənlər',
      'Budama Qayçıları, Mişarlar və Əl Alətləri',
      'Şitillik Kasetləri və İstixana Plyonkaları',
      'Aqro-Tekstil, Kölgəlik və Doluvuran Torlar',
      'Elektron Təsərrüfat Tərəziləri və Qablaşdırma Yeşikləri'
    ]
  },
  {
    id: 'heyvandarliq',
    name: 'Heyvandarlıq və Quşçuluq',
    icon: '🐄',
    type: 'sale',
    description: 'Damazlıq iribuynuzlu və xırdabuynuzlu heyvanlar, quşlar və arı ailələri',
    subcategories: [
      'Südlük və Ətlik İnəklər (Holşteyn, Simental, Şvis)',
      'Damazlıq Qoyunlar (Qala, Balbas, Qarabağ) və Keçilər',
      'Damazlıq Qafqaz Arı Ailələri və Ana Arılar',
      'Kənd Toyuqları, Cücələr, Qaz və Ördək Balaları',
      'Yumurta və Avtomatik İnkubator Avadanlıqları',
      'Sağım Aparatları və Süd Soyuducu Çənlər'
    ]
  },
  {
    id: 'mehsul-satisi',
    name: 'Topdan Aqrar Məhsul Satışı',
    icon: '🧺',
    type: 'sale',
    description: 'Fermerdən birbaşa təbii bal, meyvə-tərəvəz və taxıl məhsulları',
    subcategories: [
      'Təbii Dağ, Meşə və Cökə Balları',
      'Meyvə və Tərəvəz (Topdan və Pərakəndə)',
      'Taxıl, Buğda, Qarğıdalı və Paxlalı Bitkilər',
      'Quru Meyvələr, Çərəzlər və Zəfəran',
      'Təbii Kənd Pendiri, Kərə Yağı və Süd Məhsulları'
    ]
  },
  {
    id: 'aqronom-xidmetleri',
    name: 'Aqronom və Aqro-Servis Xidmətləri',
    icon: '🔬',
    type: 'both',
    description: 'Torpaq və su laborator analizləri, aqronom konsultasiyası, dronla dərmanlama',
    subcategories: [
      'Torpaq və Su Laboratoriya Analizləri',
      'Aqrar Dronla Sahələrin Çilənməsi və Xəritələnməsi',
      'Meyvə Bağlarının Peşəkar Budanması və Peyvəndi',
      'Dərin Su Quyu Qazılması və Nasos Quraşdırılması',
      'Təsərrüfat Layihələndirilməsi və Mövsümi Aqronom Müşayiəti'
    ]
  }
];

// ════════════════════════════════
// 1. PRODUCTS
// ════════════════════════════════

/** GET — Firestore-dan bütün məhsulları oxuyur */
export async function getProductsApi() {
  try {
    const snap = await getDocs(collection(db, COL.PRODUCTS));
    return snap.docs.map(d => normalizeProduct({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('getProductsApi error:', err);
    return [];
  }
}

/** GET — Bir istifadəçinin öz məhsulları */
export async function getUserProductsApi(userId) {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, COL.PRODUCTS),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => normalizeProduct({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('getUserProductsApi error:', err);
    return [];
  }
}

/** POST — Yeni məhsul Firestore-a əlavə edir */
export async function createProductApi(productData) {
  const payload = {
    ...productData,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, COL.PRODUCTS), payload);
  return normalizeProduct({ id: ref.id, ...payload });
}

/** DELETE — Məhsulu Firestore-dan silir */
export async function deleteProductApi(productId) {
  if (!productId) return;
  await deleteDoc(doc(db, COL.PRODUCTS, productId));
}

// ════════════════════════════════
// 2. USERS — Login, Register & Edit Profile
// ════════════════════════════════

export async function loginUserApi(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  const q = query(
    collection(db, COL.USERS),
    where('email', '==', normalizedEmail)
  );
  const snap = await getDocs(q);

  if (snap.empty) {
    return { success: false, error: 'Bu e-poçt ünvanı ilə qeydiyyat tapılmadı.' };
  }

  const userDoc = snap.docs[0];
  const userData = { id: userDoc.id, ...userDoc.data() };

  if (String(userData.password) !== String(password)) {
    return { success: false, error: 'Daxil edilmiş şifrə yanlışdır!' };
  }

  const token = generateToken(userData);
  localStorage.setItem('ekinchi_token', token);
  localStorage.setItem('ekinchi_user', JSON.stringify(userData));

  return { success: true, user: userData, token };
}

export async function registerUserApi(userData) {
  const normalizedEmail = userData.email.trim().toLowerCase();

  const existing = query(
    collection(db, COL.USERS),
    where('email', '==', normalizedEmail)
  );
  const existSnap = await getDocs(existing);
  if (!existSnap.empty) {
    return { success: false, error: 'Bu e-poçt ünvanı artıq qeydiyyatdan keçib.' };
  }

  const payload = {
    name:       userData.name.trim(),
    email:      normalizedEmail,
    phone:      userData.phone.trim(),
    password:   userData.password,
    userType:   userData.userType || 'farmer',
    role:       userData.userType || 'farmer',
    region:     userData.region  || 'Bakı',
    address:    userData.address || '',
    balance:    '0.00 AZN',
    joinedDate: new Date().toLocaleDateString('az-AZ', { month: 'long', year: 'numeric' }),
    avatar:     (userData.name.trim()[0] || 'U').toUpperCase(),
    createdAt:  serverTimestamp(),
  };

  const ref = await addDoc(collection(db, COL.USERS), payload);
  const newUser = { id: ref.id, ...payload };

  const token = generateToken(newUser);
  localStorage.setItem('ekinchi_token', token);
  localStorage.setItem('ekinchi_user', JSON.stringify(newUser));

  return { success: true, user: newUser, token };
}

export async function updateUserProfileApi(userId, updateData) {
  if (!userId) throw new Error('User ID tələb olunur');

  const userDocRef = doc(db, COL.USERS, userId);
  await updateDoc(userDocRef, {
    ...updateData,
    updatedAt: serverTimestamp(),
  });

  const updatedSnap = await getDoc(userDocRef);
  const updatedUser = { id: updatedSnap.id, ...updatedSnap.data() };

  localStorage.setItem('ekinchi_user', JSON.stringify(updatedUser));
  return updatedUser;
}

// ════════════════════════════════
// 3. CATEGORIES & REGIONS (Normalizasiya edilmiş və Zəngin)
// ════════════════════════════════

export async function getCategoriesApi() {
  try {
    const snap = await getDocs(collection(db, COL.CATEGORIES));
    const cloudCats = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    return cloudCats;
  } catch (err) {
    console.error('getCategoriesApi error:', err);
    return [];
  }
}

export async function getRegionsApi() {
  try {
    const snap = await getDocs(collection(db, COL.REGIONS));
    const regionsList = new Set(); // Sırf Firebase-dən oxunacaq

    snap.docs.forEach(docSnap => {
      const data = docSnap.data();
      if (typeof data === 'string') {
        regionsList.add(data);
      } else if (Array.isArray(data)) {
        data.forEach(r => typeof r === 'string' && regionsList.add(r));
      } else if (typeof data === 'object' && data !== null) {
        if (data.name && typeof data.name === 'string') regionsList.add(data.name);
        if (Array.isArray(data.items)) data.items.forEach(r => typeof r === 'string' && regionsList.add(r));
        if (Array.isArray(data.regions)) data.regions.forEach(r => typeof r === 'string' && regionsList.add(r));
        Object.values(data).forEach(val => {
          if (typeof val === 'string' && val.length > 1 && !val.startsWith('http') && val !== docSnap.id) {
            regionsList.add(val);
          }
        });
      }
    });

    return Array.from(regionsList).filter(r => r && r !== 'Hamısı' && r !== 'all');
  } catch (err) {
    console.error('getRegionsApi error:', err);
    return [];
  }
}

// ════════════════════════════════
// 4. ORDERS & BOOKINGS
// ════════════════════════════════

export async function getUserOrdersApi(userId) {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, COL.ORDERS),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('getUserOrdersApi error:', err);
    return [];
  }
}

export async function createOrderApi(orderData) {
  const payload = {
    ...orderData,
    createdAt: serverTimestamp(),
    status: 'Qəbul edildi',
  };
  const ref = await addDoc(collection(db, COL.ORDERS), payload);
  return { id: ref.id, ...payload };
}

export async function getUserBookingsApi(userId) {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, COL.BOOKINGS),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('getUserBookingsApi error:', err);
    return [];
  }
}

export async function createBookingApi(bookingData) {
  const { existingId, id, ...restData } = bookingData;
  const payload = {
    ...restData,
    status: 'Təsdiq gözləyir',
  };
  
  if (existingId) {
    const ref = doc(db, COL.BOOKINGS, existingId);
    await updateDoc(ref, payload);
    return { id: existingId, ...payload };
  } else {
    payload.createdAt = serverTimestamp();
    const ref = await addDoc(collection(db, COL.BOOKINGS), payload);
    return { id: ref.id, ...payload };
  }
}

export async function deleteBookingApi(bookingId) {
  if (!bookingId) {
    console.warn('deleteBookingApi: bookingId təyin edilməyib');
    return;
  }
  const ref = doc(db, COL.BOOKINGS, String(bookingId));
  await deleteDoc(ref);
}

// ════════════════════════════════
// 5. CONTACTS & INQUIRIES
// ════════════════════════════════

export async function sendContactMessageApi(messageData) {
  const payload = {
    ...messageData,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, COL.CONTACTS), payload);
  return { id: ref.id, ...payload };
}

export async function getUserContactsApi(userId) {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, COL.CONTACTS),
      where('senderId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('getUserContactsApi error:', err);
    return [];
  }
}

// ════════════════════════════════
// 6. CART & FAVORITES SYNC (Firestore)
// ════════════════════════════════

export async function syncCartToFirestore(userId, cartItems) {
  if (!userId) return;
  try {
    const docRef = doc(db, COL.CARTS, userId);
    await setDoc(docRef, { items: cartItems || [], updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.error('Cart Firestore sync error:', err);
  }
}

export async function syncFavoritesToFirestore(userId, favoriteIds) {
  if (!userId) return;
  try {
    const docRef = doc(db, COL.FAVORITES, userId);
    await setDoc(docRef, { favorites: favoriteIds || [], updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.error('Favorites Firestore sync error:', err);
  }
}

export async function getUserCartAndFavorites(userId) {
  if (!userId) return { cart: [], favorites: [] };
  try {
    const [cartSnap, favSnap] = await Promise.all([
      getDoc(doc(db, COL.CARTS, userId)),
      getDoc(doc(db, COL.FAVORITES, userId)),
    ]);
    return {
      cart: cartSnap.exists() ? (cartSnap.data()?.items || []) : [],
      favorites: favSnap.exists() ? (favSnap.data()?.favorites || []) : [],
    };
  } catch (err) {
    console.error('getUserCartAndFavorites error:', err);
    return { cart: [], favorites: [] };
  }
}

// ════════════════════════════════
// 7. STATİK SƏHİFƏLƏR
// ════════════════════════════════

export async function getAboutApi() {
  try {
    const snap = await getDocs(collection(db, COL.ABOUT));
    return snap.docs[0]?.data() || null;
  } catch {
    return null;
  }
}

export async function getFaqApi() {
  try {
    const snap = await getDocs(collection(db, COL.FAQ));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}


// ════════════════════════════════
// HELPER — Token Generator
// ════════════════════════════════
function generateToken(user) {
  const toB64 = (str) => {
    try { return btoa(unescape(encodeURIComponent(str))); }
    catch { 
      // eslint-disable-next-line no-control-regex
      return btoa(str.replace(/[^\x00-\x7F]/g, '')); 
    }
  };
  const header  = toB64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = toB64(JSON.stringify({
    id:    user.id,
    email: user.email,
    name:  user.name,
    role:  user.role || user.userType || 'farmer',
    iat:   Math.floor(Date.now() / 1000),
    exp:   Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  }));
  const sig = toB64(`${user.id}-${user.email}-ekinchi`);
  return `${header}.${payload}.${sig}`;
}

// ════════════════════════════════
// HELPER — Product Normalizer
// ════════════════════════════════
function normalizeProduct(raw) {
  if (!raw) return {};
  const isHeavy = raw.category === 'Kənd Təsərrüfatı Texnikaları'
                || raw.category === 'Torpaq, Bağ və Əkin Sahələri'
                || (typeof raw.category === 'string' && (raw.category.includes('Texnika') || raw.category.includes('Torpaq')));
  const type = raw.type || 'sale';
  const img  = raw.image || raw.imageUrl
    || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=80';

  return {
    id:             String(raw.id || `prod-${Date.now()}`),
    title:          raw.title || raw.name || 'Aqrar Məhsul',
    type,
    category:       raw.category    || 'Gübrələr və Kimyəvi Maddələr',
    subcategory:    raw.subcategory  || '',
    price:          Number(raw.price) || 0,
    unit:           raw.unit || (type === 'rent' ? 'AZN / gün' : 'AZN'),
    year:           Number(raw.year)  || 2024,
    location:       raw.location     || raw.region || 'Bərdə',
    inStock:        raw.inStock !== false,
    rating:         Number(raw.rating)       || 5.0,
    reviewsCount:   Number(raw.reviewsCount) || 1,
    image:          img,
    gallery:        Array.isArray(raw.gallery) && raw.gallery.length ? raw.gallery : [img],
    description:    raw.description  || 'Yüksək keyfiyyətli aqrar məhsul.',
    features:       raw.features     || {},
    userId:         raw.userId       || '',
    canAddToCart:   raw.canAddToCart    !== undefined ? raw.canAddToCart    : (type === 'sale' && !isHeavy),
    requiresInquiry:raw.requiresInquiry !== undefined ? raw.requiresInquiry : (type === 'sale' &&  isHeavy),
    isRental:       raw.isRental        !== undefined ? raw.isRental        : (type === 'rent'),
    seller: raw.seller || {
      name:        'Aqro Fermer',
      phone:       '+994 50 123 45 67',
      whatsapp:    '994501234567',
      verified:    true,
      rating:      5.0,
      memberSince: '2024',
    },
  };
}
// ==========================================
// SOCIAL FEED & POSTS API
// ==========================================

export async function createPostApi(postData) {
  try {
    const docRef = await addDoc(collection(db, COL.POSTS), {
      ...postData,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...postData, createdAt: new Date() };
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function getPostsApi() {
  try {
    const q = query(collection(db, COL.POSTS), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error getting posts:", error);
    return [];
  }
}

export async function getUserPostsApi(userId) {
  try {
    const q = query(collection(db, COL.POSTS), where("userId", "==", userId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error getting user posts:", error);
    return [];
  }
}

export async function deletePostApi(postId) {
  try {
    await deleteDoc(doc(db, COL.POSTS, postId));
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

export async function updatePostApi(postId, updateData) {
  try {
    await updateDoc(doc(db, COL.POSTS, postId), updateData);
    return true;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

export async function getUserProfileApi(userId) {
  try {
    const userDoc = await getDoc(doc(db, COL.USERS, userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

export async function toggleLikeApi(postId, userId, isLiked) {
  try {
    const q = query(collection(db, COL.LIKES), where("postId", "==", postId), where("userId", "==", userId));
    const snap = await getDocs(q);
    
    if (isLiked && snap.empty) {
      await addDoc(collection(db, COL.LIKES), { postId, userId, createdAt: serverTimestamp() });
    } else if (!isLiked && !snap.empty) {
      const deletes = snap.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletes);
    }
  } catch (error) {
    console.error("Error toggling like:", error);
  }
}

export async function checkUserLikesSavesApi(userId) {
  try {
    const likesSnap = await getDocs(query(collection(db, COL.LIKES), where("userId", "==", userId)));
    const savesSnap = await getDocs(query(collection(db, COL.SAVES), where("userId", "==", userId)));
    const followsSnap = await getDocs(query(collection(db, COL.FOLLOWS), where("followerId", "==", userId)));
    
    return {
      likedPostIds: likesSnap.docs.map(d => d.data().postId),
      savedPostIds: savesSnap.docs.map(d => d.data().postId),
      followingIds: followsSnap.docs.map(d => d.data().followingId),
    };
  } catch (error) {
    console.error("Error checking likes/saves/follows:", error);
    return { likedPostIds: [], savedPostIds: [], followingIds: [] };
  }
}

export async function toggleFollowApi(followerId, followingId, isFollowing) {
  try {
    const q = query(collection(db, COL.FOLLOWS), where("followerId", "==", followerId), where("followingId", "==", followingId));
    const snap = await getDocs(q);
    
    if (isFollowing && snap.empty) {
      await addDoc(collection(db, COL.FOLLOWS), { followerId, followingId, createdAt: serverTimestamp() });
    } else if (!isFollowing && !snap.empty) {
      const deletes = snap.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletes);
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
  }
}

export async function toggleSaveApi(postId, userId, isSaved) {
  try {
    const q = query(collection(db, COL.SAVES), where("postId", "==", postId), where("userId", "==", userId));
    const snap = await getDocs(q);
    
    if (isSaved && snap.empty) {
      await addDoc(collection(db, COL.SAVES), { postId, userId, createdAt: serverTimestamp() });
    } else if (!isSaved && !snap.empty) {
      const deletes = snap.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletes);
    }
  } catch (error) {
    console.error("Error toggling save:", error);
  }
}

export async function getCommentsApi(postId) {
  try {
    const q = query(collection(db, COL.COMMENTS), where("postId", "==", postId), orderBy("createdAt", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error getting comments:", error);
    return [];
  }
}

export async function addCommentApi(commentData) {
  try {
    const docRef = await addDoc(collection(db, COL.COMMENTS), {
      ...commentData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...commentData, createdAt: new Date() };
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

export async function deleteCommentApi(commentId) {
  try {
    await deleteDoc(doc(db, COL.COMMENTS, commentId));
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}
