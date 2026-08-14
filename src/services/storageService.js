/* eslint-disable no-unused-vars */
import initialProducts from '../data/products.json';
import initialUsers from '../data/users.json';

const PRODUCTS_KEY = 'agrobazar_products';
const USERS_KEY = 'agrobazar_users';
const CURRENT_USER_KEY = 'agrobazar_current_user';

// Safe JSON parser
function safeParse(str, fallback) {
  if (!str) return fallback;
  try {
    const parsed = JSON.parse(str);
    return parsed || fallback;
  } catch (e) {
    return fallback;
  }
}

// Initialize and get products safely
export function getStoredProducts() {
  if (typeof window === 'undefined') return initialProducts || [];
  try {
    const saved = localStorage.getItem(PRODUCTS_KEY);
    const parsed = safeParse(saved, null);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Error reading products from storage:', e);
  }
  return initialProducts || [];
}

export function saveProduct(newProduct) {
  const products = getStoredProducts();
  const updated = [newProduct, ...products];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving product to storage:', e);
    }
  }
  return updated;
}

// User Accounts Storage safely
export function getStoredUsers() {
  if (typeof window === 'undefined') return initialUsers || [];
  try {
    const saved = localStorage.getItem(USERS_KEY);
    const parsed = safeParse(saved, null);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Error reading users from storage:', e);
  }
  return initialUsers || [];
}

export function registerUser(userData) {
  const users = getStoredUsers();
  const newUser = {
    id: `usr-${Date.now()}`,
    name: userData.name || 'İstifadəçi',
    email: userData.email || '',
    phone: userData.phone || '+994 50 123 45 67',
    password: userData.password || '',
    userType: userData.userType || 'farmer',
    region: userData.region || 'Bakı',
    balance: '0.00 AZN',
    joinedDate: 'Avqust 2026',
    avatar: (userData.name?.[0] || 'U').toUpperCase()
  };

  const updatedUsers = [newUser, ...users];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    } catch (e) {
      console.error('Error registering user:', e);
    }
  }
  return newUser;
}

export function loginUser(email, password) {
  const users = getStoredUsers();
  const existing = users.find(u => u?.email?.toLowerCase() === email.toLowerCase());
  
  const loggedIn = existing || {
    id: `usr-${Date.now()}`,
    name: email.split('@')[0] || 'Fermer',
    email: email,
    phone: '+994 50 123 45 67',
    userType: 'farmer',
    region: 'Bakı',
    balance: '0.00 AZN',
    joinedDate: 'Avqust 2026',
    avatar: (email[0] || 'U').toUpperCase()
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedIn));
    } catch (e) {
      console.error('Error logging in user:', e);
    }
  }
  return loggedIn;
}

export function getStoredCurrentUser() {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    return safeParse(saved, null);
  } catch (e) {
    console.error('Error reading current user:', e);
  }
  return null;
}

export function logoutUser() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch (e) {
      console.error('Error logging out user:', e);
    }
  }
}

