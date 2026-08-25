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
  limit,
  documentId,
  increment,
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

// ══════════════════════════════════════════════════════════════════════════
// SOSİAL MODUL — PAYLAŞIMLAR / ŞƏRHLƏR / BƏYƏNMƏ / YADDA SAXLAMA / İZLƏMƏ
//
// Optimallaşdırma prinsipləri:
//  1. Heç bir sorğu `where` + `orderBy` birləşməsindən istifadə etmir
//     → Firestore "The query requires an index" xətası aradan qaldırılır.
//  2. Bəyənmə / yadda saxlama / izləmə sənədləri deterministik ID ilə yazılır
//     → yazmadan əvvəl axtarış sorğusu (getDocs) tələb olunmur (2x daha sürətli).
//  3. Sayğaclar atomik `increment()` ilə yenilənir → yarış vəziyyəti (race) yoxdur.
//  4. Nəticələr qısamüddətli yaddaş keşinə yazılır → təkrar naviqasiyada sorğu getmir.
// ══════════════════════════════════════════════════════════════════════════

const SOCIAL_CACHE_TTL = 45_000; // 45 saniyə
const socialCache = new Map();

function cacheGet(key) {
  const hit = socialCache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.ts > SOCIAL_CACHE_TTL) {
    socialCache.delete(key);
    return null;
  }
  return hit.value;
}

function cacheSet(key, value) {
  socialCache.set(key, { value, ts: Date.now() });
  return value;
}

/** Keşi tam və ya prefiksə görə təmizləyir (məs: 'posts', 'stats') */
export function invalidateSocialCache(prefix = '') {
  if (!prefix) { socialCache.clear(); return; }
  [...socialCache.keys()].forEach(k => { if (k.startsWith(prefix)) socialCache.delete(k); });
}

// ── Deterministik sənəd ID-ləri ──────────────────────────────────────────
export const likeDocId   = (postId, userId)             => `${postId}__${userId}`;
export const saveDocId   = (postId, userId)             => `${postId}__${userId}`;
export const followDocId = (followerId, followingId)    => `${followerId}__${followingId}`;

/** Firestore Timestamp | Date | string | number → millisaniyə */
export function toMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value.seconds === 'number') return value.seconds * 1000;
  if (value instanceof Date) return value.getTime();
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Paylaşım normalizatoru — komponentlərdə `undefined` xətalarının qarşısını alır */
export function normalizePost(raw) {
  if (!raw || !raw.id) return null;
  return {
    id:            String(raw.id),
    userId:        raw.userId || '',
    authorName:    raw.authorName || 'İstifadəçi',
    authorPhoto:   raw.authorPhoto || null,
    description:   typeof raw.description === 'string' ? raw.description : '',
    tags:          Array.isArray(raw.tags)
      ? raw.tags.map(t => String(t).replace(/^#/, '').trim()).filter(Boolean).slice(0, 10)
      : [],
    images:        Array.isArray(raw.images) ? raw.images.filter(img => typeof img === 'string' && img) : [],
    likesCount:    Math.max(0, Number(raw.likesCount) || 0),
    commentsCount: Math.max(0, Number(raw.commentsCount) || 0),
    savesCount:    Math.max(0, Number(raw.savesCount) || 0),
    createdAtMs:   toMillis(raw.createdAt) || Date.now(),
  };
}

/** Şərh normalizatoru */
export function normalizeComment(raw) {
  if (!raw || !raw.id) return null;
  return {
    id:          String(raw.id),
    postId:      raw.postId || '',
    userId:      raw.userId || '',
    authorName:  raw.authorName || 'İstifadəçi',
    authorPhoto: raw.authorPhoto || null,
    text:        typeof raw.text === 'string' ? raw.text : '',
    createdAtMs: toMillis(raw.createdAt) || Date.now(),
    pending:     Boolean(raw.pending),
  };
}

/** `in` sorğuları üçün massivi 10-luq hissələrə bölür */
function chunk(arr, size = 10) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// ── PAYLAŞIMLAR ──────────────────────────────────────────────────────────

/**
 * Yeni paylaşım yaradır.
 * DİQQƏT: yalnız URL şəkilləri saxlanılır — base64 sətirlər Firestore-un
 * 1 MB sənəd limitini aşdığı üçün rədd edilir (əvvəlki "post error" səbəbi).
 */
export async function createPostApi(postData) {
  if (!postData?.userId) throw new Error('Paylaşım yaratmaq üçün istifadəçi tələb olunur');

  const images = (Array.isArray(postData.images) ? postData.images : [])
    .filter(img => typeof img === 'string' && /^https?:\/\//i.test(img))
    .slice(0, 5);

  const description = String(postData.description || '').trim().slice(0, 3000);
  if (!description && images.length === 0) throw new Error('Paylaşım məzmunu boşdur');

  const payload = {
    userId:        postData.userId,
    authorName:    postData.authorName || 'İstifadəçi',
    authorPhoto:   postData.authorPhoto || null,
    description,
    tags:          (Array.isArray(postData.tags) ? postData.tags : [])
      .map(t => String(t).replace(/^#/, '').trim()).filter(Boolean).slice(0, 10),
    images,
    likesCount:    0,
    commentsCount: 0,
    sharesCount:   0,
    savesCount:    0,
    createdAt:     serverTimestamp(),
  };

  const ref = await addDoc(collection(db, COL.POSTS), payload);
  invalidateSocialCache('posts');
  return normalizePost({ id: ref.id, ...payload, createdAt: new Date() });
}

/** Bütün paylaşımlar (lentə görə sıralanmış, keşlənmiş) */
export async function getPostsApi({ force = false, max = 60 } = {}) {
  const key = `posts:feed:${max}`;
  if (!force) {
    const hit = cacheGet(key);
    if (hit) return hit;
  }

  try {
    let docs;
    try {
      // Tək sahə üzrə orderBy — kompozit indeks tələb etmir
      docs = (await getDocs(query(collection(db, COL.POSTS), orderBy('createdAt', 'desc'), limit(max)))).docs;
    } catch (orderErr) {
      console.warn('getPostsApi: orderBy alınmadı, müştəri tərəfdə sıralanır →', orderErr?.message);
      docs = (await getDocs(query(collection(db, COL.POSTS), limit(max)))).docs;
    }

    const posts = docs
      .map(d => normalizePost({ id: d.id, ...d.data() }))
      .filter(Boolean)
      .sort((a, b) => b.createdAtMs - a.createdAtMs);

    return cacheSet(key, posts);
  } catch (error) {
    console.error('getPostsApi error:', error);
    return cacheGet(key) || [];
  }
}

/** Bir istifadəçinin paylaşımları — `orderBy` YOX, müştəri tərəfdə sıralanır */
export async function getUserPostsApi(userId, { force = false } = {}) {
  if (!userId) return [];
  const key = `posts:user:${userId}`;
  if (!force) {
    const hit = cacheGet(key);
    if (hit) return hit;
  }

  try {
    const snap = await getDocs(query(collection(db, COL.POSTS), where('userId', '==', userId)));
    const posts = snap.docs
      .map(d => normalizePost({ id: d.id, ...d.data() }))
      .filter(Boolean)
      .sort((a, b) => b.createdAtMs - a.createdAtMs);
    return cacheSet(key, posts);
  } catch (error) {
    console.error('getUserPostsApi error:', error);
    return cacheGet(key) || [];
  }
}

/** ID massivinə görə paylaşımları gətirir (10-luq paralel `in` sorğuları) */
export async function getPostsByIdsApi(postIds = []) {
  const ids = [...new Set(postIds.filter(Boolean).map(String))];
  if (ids.length === 0) return [];

  try {
    const groups = await Promise.all(
      chunk(ids, 10).map(part =>
        getDocs(query(collection(db, COL.POSTS), where(documentId(), 'in', part)))
      )
    );
    return groups
      .flatMap(snap => snap.docs.map(d => normalizePost({ id: d.id, ...d.data() })))
      .filter(Boolean)
      .sort((a, b) => b.createdAtMs - a.createdAtMs);
  } catch (error) {
    console.error('getPostsByIdsApi error:', error);
    return [];
  }
}

/** İstifadəçinin yadda saxladığı paylaşımlar */
export async function getSavedPostsApi(userId, { force = false } = {}) {
  if (!userId) return [];
  const key = `posts:saved:${userId}`;
  if (!force) {
    const hit = cacheGet(key);
    if (hit) return hit;
  }

  try {
    const snap = await getDocs(query(collection(db, COL.SAVES), where('userId', '==', userId)));
    const ids = snap.docs.map(d => d.data()?.postId).filter(Boolean);
    return cacheSet(key, await getPostsByIdsApi(ids));
  } catch (error) {
    console.error('getSavedPostsApi error:', error);
    return cacheGet(key) || [];
  }
}

/** Tək paylaşım (deep-link üçün) */
export async function getPostByIdApi(postId) {
  if (!postId) return null;
  try {
    const snap = await getDoc(doc(db, COL.POSTS, postId));
    return snap.exists() ? normalizePost({ id: snap.id, ...snap.data() }) : null;
  } catch (error) {
    console.error('getPostByIdApi error:', error);
    return null;
  }
}

/** Paylaşımı və ona bağlı şərh/bəyənmə/yadda saxlama sənədlərini silir */
export async function deletePostApi(postId) {
  if (!postId) throw new Error('Post ID tələb olunur');

  await deleteDoc(doc(db, COL.POSTS, postId));

  // Bağlı sənədlərin təmizlənməsi — uğursuzluq əsas əməliyyatı pozmur
  Promise.allSettled(
    [COL.COMMENTS, COL.LIKES, COL.SAVES].map(async col => {
      const snap = await getDocs(query(collection(db, col), where('postId', '==', postId)));
      return Promise.allSettled(snap.docs.map(d => deleteDoc(d.ref)));
    })
  ).catch(err => console.warn('deletePostApi təmizləmə xətası:', err));

  invalidateSocialCache('posts');
  return true;
}

/** Paylaşımı redaktə edir */
export async function updatePostApi(postId, updateData) {
  if (!postId) throw new Error('Post ID tələb olunur');

  const payload = {
    description: String(updateData.description || '').trim().slice(0, 3000),
    tags: (Array.isArray(updateData.tags) ? updateData.tags : [])
      .map(t => String(t).replace(/^#/, '').trim()).filter(Boolean).slice(0, 10),
    images: (Array.isArray(updateData.images) ? updateData.images : [])
      .filter(img => typeof img === 'string' && /^https?:\/\//i.test(img)).slice(0, 5),
    updatedAt: serverTimestamp(),
  };

  await updateDoc(doc(db, COL.POSTS, postId), payload);
  invalidateSocialCache('posts');
  return true;
}

// ── İSTİFADƏÇİ PROFİLLƏRİ ────────────────────────────────────────────────

export async function getUserProfileApi(userId, { force = false } = {}) {
  if (!userId) return null;
  const key = `user:${userId}`;
  if (!force) {
    const hit = cacheGet(key);
    if (hit) return hit;
  }

  try {
    const snap = await getDoc(doc(db, COL.USERS, userId));
    if (!snap.exists()) return null;
    return cacheSet(key, { id: snap.id, ...snap.data() });
  } catch (error) {
    console.error('getUserProfileApi error:', error);
    return cacheGet(key) || null;
  }
}

/** Bir sorğu dəstəsi ilə bir çox istifadəçi profili */
export async function getUsersByIdsApi(userIds = []) {
  const ids = [...new Set(userIds.filter(Boolean).map(String))];
  if (ids.length === 0) return [];

  try {
    const groups = await Promise.all(
      chunk(ids, 10).map(part =>
        getDocs(query(collection(db, COL.USERS), where(documentId(), 'in', part)))
      )
    );
    return groups.flatMap(snap => snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (error) {
    console.error('getUsersByIdsApi error:', error);
    return [];
  }
}

// ── BƏYƏNMƏ / YADDA SAXLAMA / İZLƏMƏ ────────────────────────────────────

/** Bəyənmə — deterministik ID sayəsində oxuma sorğusu olmadan */
export async function toggleLikeApi(postId, userId, isLiked) {
  if (!postId || !userId) return false;
  try {
    const ref = doc(db, COL.LIKES, likeDocId(postId, userId));
    if (isLiked) {
      await setDoc(ref, { postId, userId, createdAt: serverTimestamp() });
    } else {
      await deleteDoc(ref);
    }
    await updateDoc(doc(db, COL.POSTS, postId), { likesCount: increment(isLiked ? 1 : -1) })
      .catch(err => console.warn('likesCount yenilənmədi:', err?.message));
    invalidateSocialCache('stats');
    return true;
  } catch (error) {
    console.error('toggleLikeApi error:', error);
    return false;
  }
}

/** Yadda saxlama */
export async function toggleSaveApi(postId, userId, isSaved) {
  if (!postId || !userId) return false;
  try {
    const ref = doc(db, COL.SAVES, saveDocId(postId, userId));
    if (isSaved) {
      await setDoc(ref, { postId, userId, createdAt: serverTimestamp() });
    } else {
      await deleteDoc(ref);
    }
    await updateDoc(doc(db, COL.POSTS, postId), { savesCount: increment(isSaved ? 1 : -1) })
      .catch(err => console.warn('savesCount yenilənmədi:', err?.message));
    invalidateSocialCache('stats');
    invalidateSocialCache('posts:saved');
    return true;
  } catch (error) {
    console.error('toggleSaveApi error:', error);
    return false;
  }
}

/** İzləmə — həm əlaqə sənədi, həm də iki tərəfin sayğacları yenilənir */
export async function toggleFollowApi(followerId, followingId, isFollowing) {
  if (!followerId || !followingId || followerId === followingId) return false;
  try {
    const ref = doc(db, COL.FOLLOWS, followDocId(followerId, followingId));
    if (isFollowing) {
      await setDoc(ref, { followerId, followingId, createdAt: serverTimestamp() });
    } else {
      await deleteDoc(ref);
    }

    const delta = isFollowing ? 1 : -1;
    await Promise.allSettled([
      setDoc(doc(db, COL.USERS, followingId), { followersCount: increment(delta) }, { merge: true }),
      setDoc(doc(db, COL.USERS, followerId),  { followingCount: increment(delta) }, { merge: true }),
    ]);

    invalidateSocialCache('stats');
    invalidateSocialCache('user');
    invalidateSocialCache('follow');
    return true;
  } catch (error) {
    console.error('toggleFollowApi error:', error);
    return false;
  }
}

/** İstifadəçinin bəyəndiyi / saxladığı / izlədiyi ID-lər — paralel və keşli */
export async function checkUserLikesSavesApi(userId, { force = false } = {}) {
  const empty = { likedPostIds: [], savedPostIds: [], followingIds: [] };
  if (!userId) return empty;

  const key = `stats:${userId}`;
  if (!force) {
    const hit = cacheGet(key);
    if (hit) return hit;
  }

  try {
    const [likesSnap, savesSnap, followsSnap] = await Promise.all([
      getDocs(query(collection(db, COL.LIKES),   where('userId', '==', userId))),
      getDocs(query(collection(db, COL.SAVES),   where('userId', '==', userId))),
      getDocs(query(collection(db, COL.FOLLOWS), where('followerId', '==', userId))),
    ]);

    return cacheSet(key, {
      likedPostIds: likesSnap.docs.map(d => d.data()?.postId).filter(Boolean),
      savedPostIds: savesSnap.docs.map(d => d.data()?.postId).filter(Boolean),
      followingIds: followsSnap.docs.map(d => d.data()?.followingId).filter(Boolean),
    });
  } catch (error) {
    console.error('checkUserLikesSavesApi error:', error);
    return cacheGet(key) || empty;
  }
}

/** İzləyicilər siyahısı (profil obyektləri ilə) */
export async function getFollowersApi(userId) {
  if (!userId) return [];
  const key = `follow:followers:${userId}`;
  const hit = cacheGet(key);
  if (hit) return hit;

  try {
    const snap = await getDocs(query(collection(db, COL.FOLLOWS), where('followingId', '==', userId)));
    const ids = snap.docs.map(d => d.data()?.followerId).filter(Boolean);
    return cacheSet(key, await getUsersByIdsApi(ids));
  } catch (error) {
    console.error('getFollowersApi error:', error);
    return [];
  }
}

/** İzlənilənlər siyahısı (profil obyektləri ilə) */
export async function getFollowingApi(userId) {
  if (!userId) return [];
  const key = `follow:following:${userId}`;
  const hit = cacheGet(key);
  if (hit) return hit;

  try {
    const snap = await getDocs(query(collection(db, COL.FOLLOWS), where('followerId', '==', userId)));
    const ids = snap.docs.map(d => d.data()?.followingId).filter(Boolean);
    return cacheSet(key, await getUsersByIdsApi(ids));
  } catch (error) {
    console.error('getFollowingApi error:', error);
    return [];
  }
}

/** Profil statistikası: paylaşım / izləyici / izlənilən sayı */
export async function getUserSocialCountsApi(userId) {
  const empty = { postsCount: 0, followersCount: 0, followingCount: 0 };
  if (!userId) return empty;

  const key = `counts:${userId}`;
  const hit = cacheGet(key);
  if (hit) return hit;

  try {
    const [postsSnap, followersSnap, followingSnap] = await Promise.all([
      getDocs(query(collection(db, COL.POSTS),   where('userId', '==', userId))),
      getDocs(query(collection(db, COL.FOLLOWS), where('followingId', '==', userId))),
      getDocs(query(collection(db, COL.FOLLOWS), where('followerId', '==', userId))),
    ]);
    return cacheSet(key, {
      postsCount:     postsSnap.size,
      followersCount: followersSnap.size,
      followingCount: followingSnap.size,
    });
  } catch (error) {
    console.error('getUserSocialCountsApi error:', error);
    return empty;
  }
}

// ── ŞƏRHLƏR ──────────────────────────────────────────────────────────────

/** Paylaşımın şərhləri — `orderBy` YOX (indeks xətası olmasın), müştəri tərəfdə sıralanır */
export async function getCommentsApi(postId) {
  if (!postId) return [];
  try {
    const snap = await getDocs(query(collection(db, COL.COMMENTS), where('postId', '==', postId)));
    return snap.docs
      .map(d => normalizeComment({ id: d.id, ...d.data() }))
      .filter(Boolean)
      .sort((a, b) => a.createdAtMs - b.createdAtMs);
  } catch (error) {
    console.error('getCommentsApi error:', error);
    return [];
  }
}

/** Şərh əlavə edir və paylaşımın şərh sayğacını artırır */
export async function addCommentApi(commentData) {
  const text = String(commentData?.text || '').trim();
  if (!commentData?.postId) throw new Error('Şərh üçün paylaşım tapılmadı');
  if (!commentData?.userId) throw new Error('Şərh yazmaq üçün daxil olun');
  if (!text) throw new Error('Şərh mətni boşdur');

  const payload = {
    postId:      commentData.postId,
    userId:      commentData.userId,
    authorName:  commentData.authorName || 'İstifadəçi',
    authorPhoto: commentData.authorPhoto || null,
    text:        text.slice(0, 1000),
    createdAt:   serverTimestamp(),
  };

  const ref = await addDoc(collection(db, COL.COMMENTS), payload);

  await updateDoc(doc(db, COL.POSTS, commentData.postId), { commentsCount: increment(1) })
    .catch(err => console.warn('commentsCount yenilənmədi:', err?.message));

  invalidateSocialCache('posts');
  return normalizeComment({ id: ref.id, ...payload, createdAt: new Date() });
}

/** Şərhi silir və sayğacı azaldır */
export async function deleteCommentApi(commentId, postId = null) {
  if (!commentId) throw new Error('Şərh ID tələb olunur');

  await deleteDoc(doc(db, COL.COMMENTS, commentId));

  if (postId) {
    await updateDoc(doc(db, COL.POSTS, postId), { commentsCount: increment(-1) })
      .catch(err => console.warn('commentsCount yenilənmədi:', err?.message));
    invalidateSocialCache('posts');
  }
  return true;
}


