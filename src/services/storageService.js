/* eslint-disable no-unused-vars */
import initialProducts from '../data/products.json';
import initialUsers from '../data/users.json';

const PRODUCTS_KEY = 'agrobazar_products';
const USERS_KEY = 'agrobazar_users';
const CURRENT_USER_KEY = 'agrobazar_current_user';
const FAVORITES_KEY = 'agrobazar_favorites';
const ORDERS_KEY = 'agrobazar_orders';
const RENTALS_KEY = 'agrobazar_rentals';

// Initialize and get products
export function getStoredProducts() {
  try {
    const saved = localStorage.getItem(PRODUCTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return initialProducts;
}

export function saveProduct(newProduct) {
  const products = getStoredProducts();
  const updated = [newProduct, ...products];
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
  return updated;
}

// User Accounts Storage
export function getStoredUsers() {
  try {
    const saved = localStorage.getItem(USERS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return initialUsers;
}

export function registerUser(userData) {
  const users = getStoredUsers();
  const newUser = {
    id: `usr-${Date.now()}`,
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    password: userData.password,
    userType: userData.userType || 'farmer',
    region: userData.region || 'Bakı',
    balance: '0.00 AZN',
    joinedDate: new Date().toLocaleDateString('az-AZ', { month: 'long', year: 'numeric' }),
    avatar: (userData.name?.[0] || 'U').toUpperCase()
  };

  const updatedUsers = [newUser, ...users];
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  } catch (e) {
    console.error(e);
  }
  return newUser;
}

export function loginUser(email, password) {
  const users = getStoredUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  const loggedIn = existing || {
    id: `usr-${Date.now()}`,
    name: email.split('@')[0],
    email: email,
    phone: '+994 50 000 00 00',
    userType: 'farmer',
    region: 'Bakı',
    balance: '0.00 AZN',
    joinedDate: 'Avqust 2026',
    avatar: email[0].toUpperCase()
  };

  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedIn));
  } catch (e) {
    console.error(e);
  }
  return loggedIn;
}

export function getStoredCurrentUser() {
  try {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return null;
}

export function logoutUser() {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch (e) {
    console.error(e);
  }
}