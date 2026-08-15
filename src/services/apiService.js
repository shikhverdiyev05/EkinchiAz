/* eslint-disable no-unused-vars */
// ─────────────────────────────────────────────────────────────────────────
// Firebase Firestore Xidmətləri
// Bütün GET / POST əməliyyatları Firestore vasitəsilə həyata keçirilir.
// Köhnə aqro-server.vercel.app/api artıq istifadə edilmir!
// ─────────────────────────────────────────────────────────────────────────

import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
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
  FAQ:        'faq',
  ABOUT:      'about',
  POSTS:      'posts',
};

// ════════════════════════════════
// 1. PRODUCTS
// ════════════════════════════════

/** GET — Firestore-dan bütün məhsulları oxuyur */
export async function getProductsApi() {
  const snap = await getDocs(collection(db, COL.PRODUCTS));
  return snap.docs.map(d => normalizeProduct({ id: d.id, ...d.data() }));
}

/** GET — Bir istifadəçinin öz məhsulları */
export async function getUserProductsApi(userId) {
  const q = query(
    collection(db, COL.PRODUCTS),
    where('userId', '==', userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => normalizeProduct({ id: d.id, ...d.data() }));
}

/**
 * POST — Yeni məhsul Firestore-a əlavə edir
 * @param {object} productData — imgbb-dən alınmış `image` URL daxil
 */
export async function createProductApi(productData) {
  const payload = {
    ...productData,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, COL.PRODUCTS), payload);
  return normalizeProduct({ id: ref.id, ...payload });
}

// ════════════════════════════════
// 2. USERS — Login & Register
// ════════════════════════════════

/**
 * LOGIN: Firestore-da email/şifrə ilə istifadəçi axtarır
 * Tapılsa token yaradıb localStorage-a saxlayır
 */
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

/**
 * REGISTER: Firestore-a yeni istifadəçi əlavə edir
 * Uğurlu olduqda token yaradıb localStorage-a saxlayır
 */
export async function registerUserApi(userData) {
  const normalizedEmail = userData.email.trim().toLowerCase();

  // E-poçt dublikat yoxlaması
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

// ════════════════════════════════
// 3. CATEGORIES
// ════════════════════════════════

export async function getCategoriesApi() {
  const snap = await getDocs(collection(db, COL.CATEGORIES));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ════════════════════════════════
// 4. REGIONS
// ════════════════════════════════

export async function getRegionsApi() {
  const snap = await getDocs(collection(db, COL.REGIONS));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ════════════════════════════════
// 5. ORDERS
// ════════════════════════════════

/** GET — İstifadəçinin sifarişlərini gətirir */
export async function getUserOrdersApi(userId) {
  const q = query(
    collection(db, COL.ORDERS),
    where('userId', '==', userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** POST — Yeni sifariş Firestore-a yazılır */
export async function createOrderApi(orderData) {
  const payload = {
    ...orderData,
    createdAt: serverTimestamp(),
    status: 'Qəbul edildi',
  };
  const ref = await addDoc(collection(db, COL.ORDERS), payload);
  return { id: ref.id, ...payload };
}

// ════════════════════════════════
// 6. BOOKINGS (İcarə Sifarişləri)
// ════════════════════════════════

/** GET — İstifadəçinin icarə sifarişlərini gətirir */
export async function getUserBookingsApi(userId) {
  const q = query(
    collection(db, COL.BOOKINGS),
    where('userId', '==', userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** POST — Yeni icarə sifarişi Firestore-a yazılır */
export async function createBookingApi(bookingData) {
  const payload = {
    ...bookingData,
    createdAt: serverTimestamp(),
    status: 'Təsdiq gözləyir',
  };
  const ref = await addDoc(collection(db, COL.BOOKINGS), payload);
  return { id: ref.id, ...payload };
}

// ════════════════════════════════
// 7. CONTACTS (Əlaqə Mesajları)
// ════════════════════════════════

/** POST — Satıcıya mesaj göndərmə Firestore-a yazılır */
export async function sendContactMessageApi(messageData) {
  const payload = {
    ...messageData,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, COL.CONTACTS), payload);
  return { id: ref.id, ...payload };
}

/** GET — İstifadəçinin əlaqə tarixçəsini gətirir */
export async function getUserContactsApi(userId) {
  const q = query(
    collection(db, COL.CONTACTS),
    where('senderId', '==', userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ════════════════════════════════
// 8. STATİK SƏHİFƏLƏR
// ════════════════════════════════

export async function getAboutApi() {
  const snap = await getDocs(collection(db, COL.ABOUT));
  return snap.docs[0]?.data() || null;
}

export async function getFaqApi() {
  const snap = await getDocs(collection(db, COL.FAQ));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getPostsApi() {
  const snap = await getDocs(collection(db, COL.POSTS));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ════════════════════════════════
// HELPER — Token Generator
// ════════════════════════════════
function generateToken(user) {
  const toB64 = (str) => {
    try { return btoa(unescape(encodeURIComponent(str))); }
    catch { return btoa(str.replace(/[^\x00-\x7F]/g, '')); }
  };
  const header  = toB64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = toB64(JSON.stringify({
    id:    user.id,
    email: user.email,
    name:  user.name,
    role:  user.role || user.userType || 'farmer',
    iat:   Math.floor(Date.now() / 1000),
    exp:   Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 gün
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
                || raw.category === 'Torpaq, Bağ və Əkin Sahələri';
  const type = raw.type || 'sale';
  const img  = raw.image || raw.imageUrl
    || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=80';

  return {
    id:             String(raw.id || `prod-${Date.now()}`),
    title:          raw.title || raw.name || 'Aqrar Məhsul',
    type,
    category:       raw.category    || 'Gübrələr',
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