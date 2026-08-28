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
import CreatePostPage        from './pages/CreatePostPage';

// Səhifələr
import HomePage             from './pages/HomePage';
import ListingsPage         from './pages/ListingsPage';
import ProductDetailPage    from './pages/ProductDetailPage';
import AddListingPage       from './pages/AddListingPage';
import ProfilePage          from './pages/ProfilePage';
import { AboutPage }        from './pages/AboutPage';
import { FaqPage }          from './pages/FaqPage';
import { ContactPage }      from './pages/ContactPage';
import { SocialFeedPage }   from './pages/SocialFeedPage';
import { PublicProfilePage } from './pages/PublicProfilePage';
import { NotFoundPage }      from './pages/NotFoundPage';
import { setStoredCurrentUser } from './services/storageService';
import { getPostByIdApi } from './services/apiService';
import { resolvePageFromPath } from './store/appReducer';
import { PostModal } from './components/PostModal';

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const {
    activePage, selectedProduct, selectedUser, listingFilters,
    products, categories, regions, isLoading,
    currentUser, authModalOpen, authMessage,
    cartItems, cartOpen,
    favorites,
    orders, rentalBookings,
    rentModalProduct, contactModalProduct, editPostData,
    toast,
  } = state;

  const [deepLinkPost, setDeepLinkPost] = React.useState(null);

  useEffect(() => {
    loadInitialData(dispatch);

    const handlePopState = () => {
      const path = window.location.pathname;
      const urlParams = new URLSearchParams(window.location.search);
      const postId = urlParams.get('post');

      if (postId) {
        dispatch({ type: A.SET_PAGE, page: 'social' });
        getPostByIdApi(postId).then(p => {
          if (p) setDeepLinkPost(p);
        });
        return;
      }

      if (path.startsWith('/istifadeci/')) {
        const uid = path.replace('/istifadeci/', '');
        if (uid) {
          dispatch({ type: A.SET_SELECTED_USER, user: uid });
          dispatch({ type: A.SET_PAGE, page: 'user-profile' });
          return;
        }
      }

      if (path.startsWith('/mehsul/')) {
        dispatch({ type: A.SET_PAGE, page: 'product-detail' });
        return;
      }

      const mappedPage = resolvePageFromPath(path);
      dispatch({ type: A.SET_PAGE, page: mappedPage });
    };

    // İlkin yükləmədə cari URL-dən səhifəni oxu (refresh zamanı və ya direct link)
    handlePopState();

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
        // If product not found, show 404 or listings
        dispatch({ type: A.SET_PAGE, page: 'not-found' });
      }
    }
  }, [products, selectedProduct]);

  // ── ?post=... query parametri birbaşa daxil ediləndə aç ──
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post');
    if (postId && !deepLinkPost) {
      getPostByIdApi(postId).then(post => {
        if (post) setDeepLinkPost(post);
      });
    }
  }, [deepLinkPost]);

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
    onNavigateUser:   (userId) => {
      if (userId === currentUser?.id) {
        navigateTo(dispatch, 'profile');
      } else {
        dispatch({ type: A.SET_SELECTED_USER, user: userId });
        navigateTo(dispatch, 'user-profile', null, userId);
      }
    },
    onNavigateCreatePost: (post = null) => {
      dispatch({ type: A.SET_EDIT_POST, post });
      navigateTo(dispatch, 'create-post');
    },
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
        onOpenCreatePost={() => navigateTo(dispatch, 'create-post')}
          onShowToast={(msg) => { dispatch({ type: A.SHOW_TOAST, message: msg }); setTimeout(() => dispatch({ type: A.CLEAR_TOAST }), 3000); }}
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
        onOpenCreatePost={() => navigateTo(dispatch, 'create-post')}
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
              dispatch({ type: A.SHOW_TOAST, message: 'Elanınız uğurla silindi' });
              setTimeout(() => dispatch({ type: A.CLEAR_TOAST }), 3000);
            }}
            onCancelRental={(id) => {
              dispatch({ type: A.DEL_BOOKING, id });
              dispatch({ type: A.SHOW_TOAST, message: 'İcarə sorğusu ləğv edildi' });
              setTimeout(() => dispatch({ type: A.CLEAR_TOAST }), 3000);
            }}
            onRenewRental={(booking) => {
              const productMock = {
                id: booking.productId,
                title: booking.productTitle || booking.title,
                image: booking.productImage,
                price: booking.productPrice || booking.price,
                unit: booking.productUnit || booking.unit,
                location: booking.locationNote || booking.location,
                seller: { name: booking.sellerName },
                existingBooking: booking
              };
              dispatch({ type: A.OPEN_RENT_MODAL, product: productMock });
            }}
            onShowToast={(msg) => { dispatch({ type: A.SHOW_TOAST, message: msg }); setTimeout(() => dispatch({ type: A.CLEAR_TOAST }), 3000); }}

          />
        )}

        {activePage === 'social'  && <SocialFeedPage {...commonProps} onShowToast={(msg) => { dispatch({ type: A.SHOW_TOAST, message: msg }); setTimeout(() => dispatch({ type: A.CLEAR_TOAST }), 3000); }} />}
        {activePage === 'user-profile' && selectedUser && (
          <PublicProfilePage 
            {...commonProps}
            userId={selectedUser}
            onNavigate={(page) => navigateTo(dispatch, page)}
            onShowToast={(msg) => { dispatch({ type: A.SHOW_TOAST, message: msg }); setTimeout(() => dispatch({ type: A.CLEAR_TOAST }), 3000); }}
          />
        )}
        {activePage === 'about'   && <AboutPage      onNavigateListings={(f) => handleNavigateListings(dispatch, f)} />}
        {activePage === 'faq'     && <FaqPage         onNavigateContact={() => navigateTo(dispatch, 'contact')} />}
        {activePage === 'contact' && <ContactPage     onShowToast={(msg) => { dispatch({ type: A.SHOW_TOAST, message: msg }); setTimeout(() => dispatch({ type: A.CLEAR_TOAST }), 3000); }} />}

        {activePage === 'create-post' && (
          <CreatePostPage
            currentUser={currentUser}
            existingPost={editPostData}
            onBack={() => navigateTo(dispatch, 'social')}
            onSuccess={() => {
              window.dispatchEvent(new Event('refreshPosts'));
              dispatch({ type: A.SHOW_TOAST, message: 'Paylaşım uğurla paylaşıldı! 🎉' });
              setTimeout(() => dispatch({ type: A.CLEAR_TOAST }), 3000);
            }}
            onShowToast={(msg) => { dispatch({ type: A.SHOW_TOAST, message: msg }); setTimeout(() => dispatch({ type: A.CLEAR_TOAST }), 3000); }}
          />
        )}

        {!['home', 'listings', 'product-detail', 'add-listing', 'profile', 'social', 'user-profile', 'about', 'faq', 'contact', 'create-post'].includes(activePage) && (
          <NotFoundPage onNavigate={(page) => navigateTo(dispatch, page)} />
        )}

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
        existingBooking={rentModalProduct?.existingBooking}
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

      {/* Deep Link Post Modal */}
      {deepLinkPost && (
        <PostModal
          isOpen={!!deepLinkPost}
          onClose={() => {
            setDeepLinkPost(null);
            // Clear query param without full reload
            window.history.replaceState(null, '', window.location.pathname);
          }}
          post={deepLinkPost}
          isLiked={(favorites || []).includes(deepLinkPost?.id)}
          isSaved={false}
          onNavigateUser={(uid) => {
            setDeepLinkPost(null);
            dispatch({ type: A.SET_SELECTED_USER, user: uid });
            navigateTo(dispatch, 'user-profile', null, uid);
          }}
          currentUser={currentUser}
          onShowToast={(msg) => { dispatch({ type: A.SHOW_TOAST, message: msg }); setTimeout(() => dispatch({ type: A.CLEAR_TOAST }), 3000); }}
        />
      )}



    </div>
  );
}
