/* eslint-disable no-unused-vars */

// ─────────────────────────────────────────────
// Auth, Cart & Favorites Storage Service
// localStorage əsaslı saxlama xidməti
// ─────────────────────────────────────────────

const USER_KEY = 'ekinchi_user';
const TOKEN_KEY = 'ekinchi_token';
const CART_KEY = 'ekinchi_cart';
const FAVS_KEY = 'ekinchi_favorites';

/**
 * localStorage-dan cari istifadəçini oxuyur
 */
export function getStoredCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * İstifadəçini localStorage-a yazır
 */
export function setStoredCurrentUser(user) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
  return user;
}

/**
 * localStorage-dan tokeni oxuyur
 */
export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || null;
}

/**
 * Çıxış — localStorage-dan user və tokeni silir
 */
export function logoutUser() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  return null;
}

/**
 * İstifadəçinin login vəziyyətini yoxlayır
 */
export function isAuthenticated() {
  return !!getStoredToken() && !!getStoredCurrentUser();
}

/**
 * Səbəti localStorage-dan oxuyur
 */
export function getStoredCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Səbəti localStorage-a yazır
 */
export function setStoredCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items || []));
  } catch (err) {
    console.error('Cart localStorage error:', err);
  }
}

/**
 * Sevimliləri localStorage-dan oxuyur
 */
export function getStoredFavorites() {
  try {
    const raw = localStorage.getItem(FAVS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Sevimliləri localStorage-a yazır
 */
export function setStoredFavorites(favIds) {
  try {
    localStorage.setItem(FAVS_KEY, JSON.stringify(favIds || []));
  } catch (err) {
    console.error('Favorites localStorage error:', err);
  }
}