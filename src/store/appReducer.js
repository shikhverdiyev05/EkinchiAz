// ─────────────────────────────────────────────────────────────────────────
// App State — useReducer üçün initial state + reducer funksiyası
// ─────────────────────────────────────────────────────────────────────────
import { DEFAULT_CATEGORIES, DEFAULT_REGIONS } from '../services/apiService';
import {
  getStoredCurrentUser,
  getStoredCart,
  getStoredFavorites,
} from '../services/storageService';

// ─── Action Types ────────────────────────────────────────────────────────
export const A = {
  // Routing
  SET_PAGE:             'SET_PAGE',
  SET_SELECTED_PRODUCT: 'SET_SELECTED_PRODUCT',
  SET_LISTING_FILTERS:  'SET_LISTING_FILTERS',

  // Data
  SET_PRODUCTS:  'SET_PRODUCTS',
  ADD_PRODUCT:   'ADD_PRODUCT',
  DEL_PRODUCT:   'DEL_PRODUCT',
  SET_CATEGORIES:'SET_CATEGORIES',
  SET_REGIONS:   'SET_REGIONS',
  SET_LOADING:   'SET_LOADING',

  // Auth
  SET_USER:       'SET_USER',
  LOGOUT:         'LOGOUT',
  OPEN_AUTH:      'OPEN_AUTH',
  CLOSE_AUTH:     'CLOSE_AUTH',

  // Cart
  SET_CART:       'SET_CART',
  ADD_CART:       'ADD_CART',
  UPDATE_QTY:     'UPDATE_QTY',
  REMOVE_CART:    'REMOVE_CART',
  CLEAR_CART:     'CLEAR_CART',
  TOGGLE_CART:    'TOGGLE_CART',

  // Favorites
  SET_FAVORITES:     'SET_FAVORITES',
  TOGGLE_FAVORITE:   'TOGGLE_FAVORITE',

  // User Data
  SET_ORDERS:   'SET_ORDERS',
  ADD_ORDER:    'ADD_ORDER',
  SET_BOOKINGS: 'SET_BOOKINGS',
  ADD_BOOKING:  'ADD_BOOKING',
  UPDATE_BOOKING: 'UPDATE_BOOKING',
  DEL_BOOKING:  'DEL_BOOKING',

  // Modals
  OPEN_RENT_MODAL:    'OPEN_RENT_MODAL',
  CLOSE_RENT_MODAL:   'CLOSE_RENT_MODAL',
  OPEN_CONTACT_MODAL: 'OPEN_CONTACT_MODAL',
  CLOSE_CONTACT_MODAL:'CLOSE_CONTACT_MODAL',

  // Toast
  SHOW_TOAST:  'SHOW_TOAST',
  CLEAR_TOAST: 'CLEAR_TOAST',
};

// ─── Initial State ────────────────────────────────────────────────────────
export const routeToPageMap = {
  '/': 'home',
  '/elanlar': 'listings',
  '/yeni-elan': 'add-listing',
  '/profil': 'profile',
  '/haqqimizda': 'about',
  '/faq': 'faq',
  '/elaqe': 'contact',
  '/sosial': 'social'
};

export function resolvePageFromPath(path) {
  if (!path || path === '/') return 'home';
  if (path.startsWith('/mehsul/')) return 'product-detail';
  if (path.startsWith('/istifadeci/')) return 'user-profile';
  if (routeToPageMap[path]) return routeToPageMap[path];
  // If path is not found in known routes:
  return 'not-found';
}

function getInitialPage() {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname;
  // If query string has ?post=..., route to social feed where modal will open
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('post')) return 'social';
  return resolvePageFromPath(path);
}

export const initialState = {
  // Routing
  activePage:          getInitialPage(),
  selectedProduct:     null,
  selectedUser:        null,
  isCreatePostOpen:    false,
  editPostData:        null,
  listingFilters:      {},

  // Data
  products:    [],
  categories:  DEFAULT_CATEGORIES,
  regions:     DEFAULT_REGIONS,
  isLoading:   true,

  // Auth
  currentUser:   getStoredCurrentUser(),
  authModalOpen: false,
  authMessage:   '',

  // Cart
  cartItems:  getStoredCart(),
  cartOpen:   false,

  // Favorites
  favorites: getStoredFavorites(),

  // User data
  orders:          [],
  rentalBookings:  [],

  // Modals
  rentModalProduct:    null,
  contactModalProduct: null,

  // Toast
  toast: null,
};

// ─── Reducer ────────────────────────────────────────────────────────────
export function appReducer(state, action) {
  switch (action.type) {

    /* ── Routing ── */
    case A.SET_PAGE:
      return { ...state, activePage: action.page };
            case A.OPEN_CREATE_POST:
      return { ...state, isCreatePostOpen: true, editPostData: action.post || null };
    case A.CLOSE_CREATE_POST:
      return { ...state, isCreatePostOpen: false, editPostData: null };
    case A.SET_SELECTED_USER:
      return { ...state, selectedUser: action.user };
    case A.SET_SELECTED_PRODUCT:
      return { ...state, selectedProduct: action.product };
    case A.SET_LISTING_FILTERS:
      return { ...state, listingFilters: action.filters };

    /* ── Data ── */
    case A.SET_PRODUCTS:
      return { ...state, products: action.products };
    case A.ADD_PRODUCT:
      return { ...state, products: [action.product, ...state.products] };
    case A.DEL_PRODUCT:
      return { ...state, products: state.products.filter(p => p.id !== action.id) };
    case A.SET_CATEGORIES:
      return { ...state, categories: action.categories };
    case A.SET_REGIONS:
      return { ...state, regions: action.regions };
    case A.SET_LOADING:
      return { ...state, isLoading: action.value };

    /* ── Auth ── */
    case A.SET_USER:
      return { ...state, currentUser: action.user, authModalOpen: false };
    case A.LOGOUT:
      return { ...state, currentUser: null, orders: [], rentalBookings: [], cartItems: [], favorites: [] };
    case A.OPEN_AUTH:
      return { ...state, authModalOpen: true, authMessage: action.message || '' };
    case A.CLOSE_AUTH:
      return { ...state, authModalOpen: false, authMessage: '' };

    /* ── Cart ── */
    case A.SET_CART:
      return { ...state, cartItems: action.items };
    case A.ADD_CART: {
      const safe = Array.isArray(state.cartItems) ? state.cartItems : [];
      const existing = safe.find(i => i.id === action.product.id);
      const updated = existing
        ? safe.map(i => i.id === action.product.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i)
        : [...safe, { ...action.product, quantity: 1 }];
      return { ...state, cartItems: updated };
    }
    case A.UPDATE_QTY: {
      const updated = (Array.isArray(state.cartItems) ? state.cartItems : [])
        .map(i => i.id === action.id ? { ...i, quantity: (i.quantity || 1) + action.delta } : i)
        .filter(i => (i.quantity || 0) > 0);
      return { ...state, cartItems: updated };
    }
    case A.REMOVE_CART:
      return { ...state, cartItems: (Array.isArray(state.cartItems) ? state.cartItems : []).filter(i => i.id !== action.id) };
    case A.CLEAR_CART:
      return { ...state, cartItems: [] };
    case A.TOGGLE_CART:
      return { ...state, cartOpen: !state.cartOpen };

    /* ── Favorites ── */
    case A.SET_FAVORITES:
      return { ...state, favorites: action.favorites };
    case A.TOGGLE_FAVORITE: {
      const safe = Array.isArray(state.favorites) ? state.favorites : [];
      const next = safe.includes(action.id)
        ? safe.filter(id => id !== action.id)
        : [...safe, action.id];
      return { ...state, favorites: next };
    }

    /* ── User Data ── */
    case A.SET_ORDERS:
      return { ...state, orders: action.orders };
    case A.ADD_ORDER:
      return { ...state, orders: [action.order, ...state.orders] };
    case A.SET_BOOKINGS:
      return { ...state, rentalBookings: action.bookings };
    case A.ADD_BOOKING:
      return { ...state, rentalBookings: [action.booking, ...state.rentalBookings] };
    case A.UPDATE_BOOKING:
      return { ...state, rentalBookings: state.rentalBookings.map(b => b.id === action.booking.id ? action.booking : b) };
    case A.DEL_BOOKING:
      return { ...state, rentalBookings: state.rentalBookings.filter(b => b.id !== action.id) };

    /* ── Modals ── */
    case A.OPEN_RENT_MODAL:
      return { ...state, rentModalProduct: action.product };
    case A.CLOSE_RENT_MODAL:
      return { ...state, rentModalProduct: null };
    case A.OPEN_CONTACT_MODAL:
      return { ...state, contactModalProduct: action.product };
    case A.CLOSE_CONTACT_MODAL:
      return { ...state, contactModalProduct: null };

    /* ── Toast ── */
    case A.SHOW_TOAST:
      return { ...state, toast: action.message };
    case A.CLEAR_TOAST:
      return { ...state, toast: null };

    default:
      return state;
  }
}
