/* eslint-disable no-unused-vars */

// ─────────────────────────────────────────────
// Auth Storage Service — localStorage əsaslı
// ─────────────────────────────────────────────

const USER_KEY = 'ekinchi_user';
const TOKEN_KEY = 'ekinchi_token';

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
 * İstifadəçinin login vəziyyətini yoxlayır (token + user mövcuddursa)
 */
export function isAuthenticated() {
  return !!getStoredToken() && !!getStoredCurrentUser();
}