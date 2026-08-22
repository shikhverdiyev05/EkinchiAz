/* eslint-disable no-unused-vars */
import React, { useReducer, useEffect } from 'react';

// Store
import { appReducer, initialState, A } from './store/appReducer';
import {
  loadInitialData,
  loadUserData,
  navigateTo,
  handleNavigateListings,
  handleAuthSuccess,
  handleLogout,
  handleRequireAuth,
  handleAddToCart,
  handleToggleFavorite,
  handleCheckout,
  handleSubmitBooking,
  handleSendContact,
  handleAddProductSubmit,
  handleAddListingClick,
  syncCartEffect,
  syncFavoritesEffect,
} from './store/appActions';

// Komponentlər
import Navbar               from './components/Navbar';
import Footer               from './components/Footer';
import CartDrawer           from './components/CartDrawer';
import RentalBookingModal   from './components/RentalBookingModal';
import SellerContactModal   from './components/SellerContactModal';
import AuthModal            from './components/AuthModal';

// Səhifələr
import HomePage             from './pages/HomePage';
import ListingsPage         from './pages/ListingsPage';
import ProductDetailPage    from './pages/ProductDetailPage';
import AddListingPage       from './pages/AddListingPage';
import ProfilePage          from './pages/ProfilePage';
import { AboutPage, FaqPage, ContactPage, SocialFeedPage } from './pages/StaticPages';
import { setStoredCurrentUser } from './services/storageService';

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const {
    activePage, selectedProduct, listingFilters,
    products, categories, regions, isLoading,
    currentUser, authModalOpen, authMessage,
    cartItems, cartOpen,
    favorites,
    orders, rentalBookings,
    rentModalProduct, contactModalProduct,
    toast,
  } = state;

  useEffect(() => {
    loadInitialData(dispatch);

    const routeToPageMap = {
      '/': 'home',
      '/elanlar': 'listings',
      '/yeni-elan': 'add-listing',
      '/profil': 'profile',
      '/haqqimizda': 'about',
      '/faq': 'faq',
      '/elaqe': 'contact',
      '/sosial': 'social'
    };

    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/mehsul/')) {
        const prodId = path.replace('/mehsul/', '');
        dispatch({ type: A.SET_PAGE, page: 'product-detail' });
        // Setting the selected product will be handled by the next useEffect when products array is loaded
        return;
      }
      const mappedPage = routeToPageMap[path] || 'home';
      dispatch({ type: A.SET_PAGE, page: mappedPage });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // ── Səhifə birbaşa məhsul linki ilə (deep link) açılanda məhsulu tap ──
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/mehsul/') && products.length > 0 && !selectedProduct) {
      const prodId = path.replace('/mehsul/', '');
      const found = products.find(p => p.id === prodId);
      if (found) {
        dispatch({ type: A.SET_SELECTED_PRODUCT, product: found });
      } else {
        // If product not found, fallback to listings
        window.history.replaceState(null, '', '/elanlar');
        dispatch({ type: A.SET_PAGE, page: 'listings' });
      }
    }
  }, [products, selectedProduct]);

  // ── Giriş etmiş istifadəçinin məlumatları ────────────────────────────
  useEffect(() => {
    if (currentUser?.id) loadUserData(dispatch, currentUser, cartItems, favorites);
  }, [currentUser?.id]); // eslint-disable-line

  // ── Səbəti sinxronlaşdır ──────────────────────────────────────────────
  useEffect(() => {
    syncCartEffect(currentUser?.id, cartItems);
  }, [cartItems, currentUser?.id]);

  // ── Sevimlileri sinxronlaşdır ─────────────────────────────────────────
  useEffect(() => {
    syncFavoritesEffect(currentUser?.id, favorites);
  }, [favorites, currentUser?.id]);

  // ── Köməkçi dəyişənlər ────────────────────────────────────────────────
  const cartCount       = (Array.isArray(cartItems) ? cartItems : []).reduce((acc, i) => acc + (i.quantity || 1), 0);
  const favoriteProducts = products.filter(p => (Array.isArray(favorites) ? favorites : []).includes(p?.id));

  // ── Shared prop'lar (hər səhifəyə gedir) ─────────────────────────────
  const commonProps = {
    currentUser,
    favorites,
    onToggleFavorite: (id) => handleToggleFavorite(dispatch, id, currentUser, favorites),
    onViewDetails:    (product) => navigateTo(dispatch, 'product-detail', product),
    onAddToCart:      (product) => handleAddToCart(dispatch, product, currentUser),
    onOpenRentModal:  (prod) => {
      if (!currentUser) { handleRequireAuth(dispatch, 'İcarə sifarişi göndərmək üçün daxil olun'); return; }
      dispatch({ type: A.OPEN_RENT_MODAL, product: prod });
    },
    onOpenContactModal: (prod) => {
      if (!currentUser) { handleRequireAuth(dispatch, 'Satıcı ilə əlaqə saxlamaq üçün daxil olun'); return; }
      dispatch({ type: A.OPEN_CONTACT_MODAL, product: prod });
    },
    onRequireAuth: (msg) => handleRequireAuth(dispatch, msg),
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50/60 via-teal-50/30 to-green-100/40 text-gray-800 font-sans selection:bg-emerald-600 selection:text-white">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl bg-gray-900/90 backdrop-blur-md text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 animate-slideUp border border-gray-700/50 pointer-events-none">
          <span className="text-emerald-400">✓</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={(page) => navigateTo(dispatch, page)}
        cartCount={cartCount}
        openCart={() => dispatch({ type: A.TOGGLE_CART })}
        currentUser={currentUser}
        openAuthModal={() => dispatch({ type: A.OPEN_AUTH })}
        openProfile={() => navigateTo(dispatch, 'profile')}
        onAddListingClick={() => handleAddListingClick(dispatch, currentUser)}
      />

      {/* ── Routing ───────────────────────────────────────────────────── */}
      <main className="flex-grow">

        {activePage === 'home' && (
          <HomePage
            {...commonProps}
            products={products}
            categories={categories}
            regions={regions}
            onNavigateListings={(f) => handleNavigateListings(dispatch, f)}
            onSelectCategory={(catName) => handleNavigateListings(dispatch, { category: catName })}
            onAddListingClick={() => handleAddListingClick(dispatch, currentUser)}
          />
        )}

        {activePage === 'listings' && (
          <ListingsPage
            {...commonProps}
            products={products}
            categories={categories}
            regions={regions}
            initialFilters={listingFilters}
          />
        )}

        {activePage === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            {...commonProps}
            product={selectedProduct}
            allProducts={products}
            onBack={() => navigateTo(dispatch, 'listings')}
            onNavigateProduct={(p) => navigateTo(dispatch, 'product-detail', p)}
            isFavorite={(Array.isArray(favorites) ? favorites : []).includes(selectedProduct?.id)}
          />
        )}

        {activePage === 'add-listing' && (
          <AddListingPage
            currentUser={currentUser}
            categories={categories}
            regions={regions}
            onRequireAuth={(msg) => handleRequireAuth(dispatch, msg)}
            onAddProduct={(p) => handleAddProductSubmit(dispatch, p)}
            onCancel={() => navigateTo(dispatch, 'home')}
          />
        )}

        {activePage === 'profile' && (
          <ProfilePage
            {...commonProps}
            user={currentUser}
            onLogout={() => handleLogout(dispatch)}
            userListings={products.filter(p => p.userId === currentUser?.id)}
            rentalBookings={rentalBookings}
            orders={orders}
            favoriteProducts={favoriteProducts}
            onNavigateListings={(f) => handleNavigateListings(dispatch, f)}
            onAddNewListing={() => handleAddListingClick(dispatch, currentUser)}
            onUpdateUser={(updated) => {
              dispatch({ type: A.SET_USER, user: updated });
              setStoredCurrentUser(updated);
            }}
            onDeleteListing={(id) => {
              dispatch({ type: A.DEL_PRODUCT, id });
              // toast
              dispatch({ type: A.SHOW_TOAST, message: 'Elanınız uğurla silindi' });
              setTimeout(() => dispatch({ type: A.CLEAR_TOAST }), 3000);
            }}
          />
        )}

        {activePage === 'social'  && <SocialFeedPage onNavigateListings={(f) => handleNavigateListings(dispatch, f)} />}
        {activePage === 'about'   && <AboutPage      onNavigateListings={(f) => handleNavigateListings(dispatch, f)} />}
        {activePage === 'faq'     && <FaqPage         onNavigateContact={() => navigateTo(dispatch, 'contact')} />}
        {activePage === 'contact' && <ContactPage     onShowToast={(msg) => { dispatch({ type: A.SHOW_TOAST, message: msg }); setTimeout(() => dispatch({ type: A.CLEAR_TOAST }), 3000); }} />}

      </main>

      {/* Footer */}
      <Footer
        onNavigate={(page) => navigateTo(dispatch, page)}
        onSelectCategory={(catName) => handleNavigateListings(dispatch, { category: catName })}
      />

      {/* Səbət */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => dispatch({ type: A.TOGGLE_CART })}
        cartItems={cartItems}
        currentUser={currentUser}
        onRequireAuth={(msg) => handleRequireAuth(dispatch, msg)}
        onUpdateQuantity={(id, delta) => dispatch({ type: A.UPDATE_QTY, id, delta })}
        onRemoveItem={(id) => dispatch({ type: A.REMOVE_CART, id })}
        onCheckoutSuccess={(order) => handleCheckout(dispatch, order, currentUser)}
      />

      {/* İcarə Modalı */}
      <RentalBookingModal
        isOpen={!!rentModalProduct}
        product={rentModalProduct}
        onClose={() => dispatch({ type: A.CLOSE_RENT_MODAL })}
        onSubmitBooking={(data) => handleSubmitBooking(dispatch, data, currentUser?.id)}
      />

      {/* Satıcı ilə Əlaqə Modalı */}
      <SellerContactModal
        isOpen={!!contactModalProduct}
        product={contactModalProduct}
        onClose={() => dispatch({ type: A.CLOSE_CONTACT_MODAL })}
        onSendMessage={(data) => handleSendContact(dispatch, data, currentUser, contactModalProduct)}
      />

      {/* Auth Modalı */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => dispatch({ type: A.CLOSE_AUTH })}
        onAuthSuccess={(user, msg) => handleAuthSuccess(dispatch, user, msg, cartItems, favorites)}
        initialMessage={authMessage}
      />

    </div>
  );
}
