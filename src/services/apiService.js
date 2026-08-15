/* eslint-disable no-unused-vars */

const API_BASE_URL = 'https://aqro-server.vercel.app/api';

// ─────────────────────────────────────────────
// 1. PRODUCTS API (GET & POST)
// ─────────────────────────────────────────────
export async function getProductsApi() {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });

  if (!res.ok) throw new Error(`GET /api/products failed: ${res.status}`);

  const data = await res.json();
  return Array.isArray(data) ? data.map(normalizeProduct) : [];
}

export async function createProductApi(productData) {
  const token = localStorage.getItem('ekinchi_token');

  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(productData)
  });

  if (!res.ok) throw new Error(`POST /api/products failed: ${res.status}`);

  const result = await res.json();
  return normalizeProduct(result.data || result);
}

// ─────────────────────────────────────────────
// 2. USERS API — Login (GET) & Register (POST)
// ─────────────────────────────────────────────

/**
 * LOGIN: GET /api/users → email/password ilə uyğunluq axtarır
 * Uğurlu olduqda token yaradıb localStorage-a saxlayır
 */
export async function loginUserApi(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });

  if (!res.ok) {
    return { success: false, error: 'Server ilə əlaqə qurmaq mümkün olmadı. Zəhmət olmasa bir az sonra yenidən cəhd edin.' };
  }

  const users = await res.json();

  if (!Array.isArray(users)) {
    return { success: false, error: 'Server cavabı düzgün deyil.' };
  }

  const found = users.find(
    u => u?.email?.toLowerCase() === normalizedEmail && String(u?.password) === String(password)
  );

  if (!found) {
    return { success: false, error: 'Daxil edilmiş e-poçt və ya şifrə yanlışdır!' };
  }

  // Token yarat və localStorage-a saxla
  const token = generateToken(found);
  localStorage.setItem('ekinchi_token', token);
  localStorage.setItem('ekinchi_user', JSON.stringify(found));

  return { success: true, user: found, token };
}

/**
 * REGISTER: POST /api/users → yeni istifadəçi yaradır
 * Uğurlu olduqda token yaradıb localStorage-a saxlayır
 */
export async function registerUserApi(userData) {
  const payload = {
    id: `usr-${Date.now()}`,
    name: userData.name.trim(),
    email: userData.email.trim().toLowerCase(),
    phone: userData.phone.trim(),
    password: userData.password,
    userType: userData.userType || 'farmer',
    role: userData.userType || 'farmer',
    region: userData.region || 'Bakı',
    balance: '0.00 AZN',
    joinedDate: 'Avqust 2026',
    avatar: (userData.name.trim()[0] || 'U').toUpperCase()
  };

  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`POST /api/users failed: ${res.status}`);
  }

  const result = await res.json();
  const newUser = result.data || result || payload;

  // Token yarat və localStorage-a saxla
  const token = generateToken(newUser);
  localStorage.setItem('ekinchi_token', token);
  localStorage.setItem('ekinchi_user', JSON.stringify(newUser));

  return { success: true, user: newUser, token };
}

// ─────────────────────────────────────────────
// 3. CATEGORIES API
// ─────────────────────────────────────────────
export async function getCategoriesApi() {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });

  if (!res.ok) throw new Error(`GET /api/categories failed: ${res.status}`);

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// ─────────────────────────────────────────────
// 4. REGIONS API
// ─────────────────────────────────────────────
export async function getRegionsApi() {
  const res = await fetch(`${API_BASE_URL}/regions`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });

  if (!res.ok) throw new Error(`GET /api/regions failed: ${res.status}`);

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// ─────────────────────────────────────────────
// 5. STATİK SƏHİFƏLƏR
// ─────────────────────────────────────────────
export async function getAboutApi() {
  const res = await fetch(`${API_BASE_URL}/about`);
  if (!res.ok) return null;
  return res.json();
}

export async function getFaqApi() {
  const res = await fetch(`${API_BASE_URL}/faq`);
  if (!res.ok) return [];
  return res.json();
}

export async function getContactInfoApi() {
  const res = await fetch(`${API_BASE_URL}/contactInfo`);
  if (!res.ok) return null;
  return res.json();
}

export async function getPostsApi() {
  const res = await fetch(`${API_BASE_URL}/posts`);
  if (!res.ok) return [];
  return res.json();
}

export async function getMediaApi() {
  const res = await fetch(`${API_BASE_URL}/media`);
  if (!res.ok) return [];
  return res.json();
}

export async function getCommentsApi() {
  const res = await fetch(`${API_BASE_URL}/comments`);
  if (!res.ok) return [];
  return res.json();
}

// ─────────────────────────────────────────────
// HELPER — Token Generator (JWT-style simple token)
// ─────────────────────────────────────────────
function generateToken(user) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || user.userType || 'farmer',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 gün
  }));
  const signature = btoa(`${user.id}-${user.email}-ekinchi`);
  return `${header}.${payload}.${signature}`;
}

// ─────────────────────────────────────────────
// HELPER — Product Normalizer
// ─────────────────────────────────────────────
function normalizeProduct(raw) {
  if (!raw) return {};
  const isHeavy = raw.category === 'Kənd Təsərrüfatı Texnikaları' || raw.category === 'Torpaq, Bağ və Əkin Sahələri';
  const type = raw.type || 'sale';

  return {
    id: String(raw.id || raw._id || `prod-${Date.now()}`),
    title: raw.title || raw.name || 'Aqrar Məhsul',
    type,
    category: raw.category || 'Gübrələr',
    subcategory: raw.subcategory || '',
    price: Number(raw.price) || 0,
    unit: raw.unit || (type === 'rent' ? 'AZN / gün' : 'AZN'),
    year: Number(raw.year) || 2024,
    location: raw.location || raw.region || 'Bərdə',
    inStock: raw.inStock !== false,
    rating: Number(raw.rating) || 5.0,
    reviewsCount: Number(raw.reviewsCount) || 1,
    image: raw.image || raw.imageUrl || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=80',
    gallery: Array.isArray(raw.gallery) && raw.gallery.length > 0
      ? raw.gallery
      : [raw.image || raw.imageUrl || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=80'],
    description: raw.description || 'Yüksək keyfiyyətli aqrar məhsul.',
    features: raw.features || {},
    canAddToCart: raw.canAddToCart !== undefined ? raw.canAddToCart : (type === 'sale' && !isHeavy),
    requiresInquiry: raw.requiresInquiry !== undefined ? raw.requiresInquiry : (type === 'sale' && isHeavy),
    isRental: raw.isRental !== undefined ? raw.isRental : (type === 'rent'),
    seller: raw.seller || {
      name: 'Aqro Fermer',
      phone: '+994 50 123 45 67',
      whatsapp: '994501234567',
      verified: true,
      rating: 5.0,
      memberSince: '2024'
    }
  };
}