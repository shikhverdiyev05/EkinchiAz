// ─────────────────────────────────────────────────────────────────────────
// App Actions — Bütün handler funksiyaları dispatch ilə
// ─────────────────────────────────────────────────────────────────────────
import { A } from './appReducer';
import {
  getProductsApi,
  getCategoriesApi,
  getRegionsApi,
  getUserOrdersApi,
  getUserBookingsApi,
  createOrderApi,
  createBookingApi,
  sendContactMessageApi,
  syncCartToFirestore,
  syncFavoritesToFirestore,
  getUserCartAndFavorites,
} from '../services/apiService';
import {
  setStoredCurrentUser,
  setStoredCart,
  setStoredFavorites,
  logoutUser,
} from '../services/storageService';

// ─── Toast helper ────────────────────────────────────────────────────────
export function showToast(dispatch, message) {
  dispatch({ type: A.SHOW_TOAST, message });
  setTimeout(() => dispatch({ type: A.CLEAR_TOAST }), 3000);
}

// ─── Navigation ─────────────────────────────────────────────────────────
export const pageToRouteMap = {
  'home': '/',
  'listings': '/elanlar',
  'add-listing': '/yeni-elan',
  'profile': '/profil',
  'about': '/haqqimizda',
  'faq': '/faq',
  'contact': '/elaqe',
  'social': '/sosial',
  'create-post': '/paylas'
};

export function navigateTo(dispatch, page, product = null, user = null) {
  dispatch({ type: A.SET_PAGE, page });
  
  let path = '/';
  if (page === 'product-detail' && product) {
    dispatch({ type: A.SET_SELECTED_PRODUCT, product });
    path = `/mehsul/${product.id}`;
  } else if (page === 'user-profile' && user) {
    dispatch({ type: A.SET_SELECTED_USER, user });
    path = `/istifadeci/${user}`;
  } else if (pageToRouteMap[page]) {
    path = pageToRouteMap[page];
  } else if (page === 'not-found') {
    path = window.location.pathname;
  }

  if (window.location.pathname !== path) {
    window.history.pushState(null, '', path);
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function handleNavigateListings(dispatch, filters = {}) {
  dispatch({ type: A.SET_LISTING_FILTERS, filters });
  navigateTo(dispatch, 'listings');
}

// ─── API: İlkin Data ─────────────────────────────────────────────────────
export async function loadInitialData(dispatch) {
  try {
    const [apiProds, apiCats, apiRegions] = await Promise.all([
      getProductsApi(),
      getCategoriesApi(),
      getRegionsApi(),
    ]);
    dispatch({ type: A.SET_PRODUCTS,   products:   Array.isArray(apiProds)    ? apiProds    : [] });
    dispatch({ type: A.SET_CATEGORIES, categories: Array.isArray(apiCats)     ? apiCats     : [] });
    dispatch({ type: A.SET_REGIONS,    regions:    Array.isArray(apiRegions)  ? apiRegions  : [] });
  } catch (err) {
    console.error('API data loading error:', err);
    showToast(dispatch, 'Məlumatları yükləmək mümkün olmadı');
  } finally {
    dispatch({ type: A.SET_LOADING, value: false });
  }
}

// ─── API: İstifadəçi Məlumatları ────────────────────────────────────────
export async function loadUserData(dispatch, user, currentCart = [], currentFavs = []) {
  if (!user?.id) return;
  try {
    const [userOrders, userBookings, cloudData] = await Promise.all([
      getUserOrdersApi(user.id),
      getUserBookingsApi(user.id),
      getUserCartAndFavorites(user.id),
    ]);
    dispatch({ type: A.SET_ORDERS,   orders:   Array.isArray(userOrders)   ? userOrders   : [] });
    dispatch({ type: A.SET_BOOKINGS, bookings: Array.isArray(userBookings) ? userBookings : [] });

    // Yalnız yerli boşdursa bulud məlumatını yüklə
    if (cloudData?.cart?.length > 0 && currentCart.length === 0) {
      dispatch({ type: A.SET_CART, items: cloudData.cart });
    }
    if (cloudData?.favorites?.length > 0 && currentFavs.length === 0) {
      dispatch({ type: A.SET_FAVORITES, favorites: cloudData.favorites });
    }
  } catch (err) {
    console.error('İstifadəçi məlumatları yüklənmədi:', err);
    showToast(dispatch, 'Profil məlumatları tam yüklənmədi');
  }
}

// ─── Auth Handlers ────────────────────────────────────────────────────────
export function handleAuthSuccess(dispatch, user, message, currentCart, currentFavs) {
  setStoredCurrentUser(user);
  dispatch({ type: A.SET_USER, user });
  loadUserData(dispatch, user, currentCart, currentFavs);
  showToast(dispatch, message || 'Giriş uğurla edildi!');
}

export function handleLogout(dispatch) {
  logoutUser();
  dispatch({ type: A.LOGOUT });
  navigateTo(dispatch, 'home');
  showToast(dispatch, 'Hesabdan çıxış edildi');
}

export function handleRequireAuth(dispatch, message) {
  dispatch({ type: A.OPEN_AUTH, message: message || 'Davam etmək üçün zəhmət olmasa daxil olun' });
}

// ─── Cart Handlers ────────────────────────────────────────────────────────
export function handleAddToCart(dispatch, product, currentUser) {
  if (!currentUser) {
    handleRequireAuth(dispatch, 'Məhsulu səbətə əlavə etmək üçün daxil olun');
    return;
  }
  if (!product?.canAddToCart) {
    showToast(dispatch, 'Bu məhsul səbətə əlavə edilmir!');
    return;
  }
  dispatch({ type: A.ADD_CART, product });
  showToast(dispatch, `Səbətə əlavə olundu`);
}

export function syncCartEffect(userId, cartItems) {
  setStoredCart(cartItems);
  if (userId) syncCartToFirestore(userId, cartItems);
}

// ─── Checkout ────────────────────────────────────────────────────────────
export async function handleCheckout(dispatch, newOrder, currentUser) {
  try {
    const payload = {
      ...newOrder,
      userId: currentUser?.id,
      date: new Date().toLocaleDateString('az-AZ'),
    };
    const saved = await createOrderApi(payload);
    dispatch({ type: A.ADD_ORDER, order: saved || payload });
    dispatch({ type: A.CLEAR_CART });
    dispatch({ type: A.TOGGLE_CART }); // close
    showToast(dispatch, 'Sifariş uğurla tamamlandı');
  } catch (err) {
    console.error('Sifariş Firestore-a yazılmadı:', err);
    showToast(dispatch, 'Xəta baş verdi, zəhmət olmasa yenidən cəhd edin');
  }
}

// ─── Favorites Handlers ───────────────────────────────────────────────────
export function handleToggleFavorite(dispatch, productId, currentUser, currentFavs) {
  if (!currentUser) {
    handleRequireAuth(dispatch, 'Elanları sevimlilərə əlavə etmək üçün daxil olun');
    return;
  }
  const isIn = (Array.isArray(currentFavs) ? currentFavs : []).includes(productId);
  dispatch({ type: A.TOGGLE_FAVORITE, id: productId });
  showToast(dispatch, isIn ? 'Sevimlilərdən silindi' : 'Sevimlilərə əlavə olundu');
}

export function syncFavoritesEffect(userId, favorites) {
  setStoredFavorites(favorites);
  if (userId) syncFavoritesToFirestore(userId, favorites);
}

// ─── Rental Booking ──────────────────────────────────────────────────────
export async function handleSubmitBooking(dispatch, bookingData, userId) {
  try {
    const payload = { ...bookingData, userId };
    const saved = await createBookingApi(payload);
    
    if (bookingData.existingId) {
      dispatch({ type: A.UPDATE_BOOKING, booking: saved || payload });
    } else {
      dispatch({ type: A.ADD_BOOKING, booking: saved || payload });
    }
    
    dispatch({ type: A.CLOSE_RENT_MODAL });
    showToast(dispatch, 'İcarə sorğusu uğurla göndərildi');
  } catch (err) {
    console.error('İcarə sifarişi Firestore-a yazılmadı:', err);
    showToast(dispatch, 'Sorğu göndərilərkən xəta baş verdi');
  }
}

// ─── Contact Message ─────────────────────────────────────────────────────
export async function handleSendContact(dispatch, msgData, currentUser, product) {
  try {
    await sendContactMessageApi({
      ...msgData,
      senderId:     currentUser?.id,
      senderName:   currentUser?.name,
      productId:    product?.id,
      productTitle: product?.title,
    });
    dispatch({ type: A.CLOSE_CONTACT_MODAL });
    showToast(dispatch, 'Mesajınız uğurla göndərildi');
  } catch (err) {
    console.error('Mesaj Firestore-a yazılmadı:', err);
    showToast(dispatch, 'Mesaj göndərilmədi, zəhmət olmasa yenidən cəhd edin');
  }
}

// ─── Listing Handlers ────────────────────────────────────────────────────
export function handleAddProductSubmit(dispatch, newProduct) {
  dispatch({ type: A.ADD_PRODUCT, product: newProduct });
  navigateTo(dispatch, 'product-detail', newProduct);
  showToast(dispatch, 'Elanınız uğurla paylaşıldı!');
}

export function handleAddListingClick(dispatch, currentUser) {
  if (!currentUser) {
    handleRequireAuth(dispatch, 'Yeni elan yerləşdirmək üçün zəhmət olmasa daxil olun');
    return;
  }
  navigateTo(dispatch, 'add-listing');
}
