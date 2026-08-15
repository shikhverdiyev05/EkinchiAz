/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

// Komponentlər
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import RentalBookingModal from './components/RentalBookingModal';
import SellerContactModal from './components/SellerContactModal';
import AuthModal from './components/AuthModal';

// Səhifələr
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AddListingPage from './pages/AddListingPage';
import ProfilePage from './pages/ProfilePage';
import { AboutPage, FaqPage, ContactPage, SocialFeedPage } from './pages/StaticPages';

// Firestore Xidmətləri
import { 
  getProductsApi, 
  getCategoriesApi,
  getRegionsApi,
  getUserOrdersApi,
  getUserBookingsApi,
  createOrderApi,
  createBookingApi,
  sendContactMessageApi,
  getUserContactsApi,
  syncCartToFirestore,
  syncFavoritesToFirestore,
  getUserCartAndFavorites,
} from './services/apiService';
import { 
  getStoredCurrentUser, 
  setStoredCurrentUser, 
  logoutUser,
  getStoredCart,
  setStoredCart,
  getStoredFavorites,
  setStoredFavorites
} from './services/storageService';

export default function App() {
  const [activePage, setActivePage] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'listings', 'add-listing', 'profile', 'about', 'faq', 'contact', 'social'].includes(hash)) {
        return hash;
      }
    }
    return 'home';
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState(() => getStoredCurrentUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  // Cart & Bookings (localStorage persistent)
  const [cartItems, setCartItems] = useState(() => getStoredCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [rentalBookings, setRentalBookings] = useState([]);
  const [orders, setOrders] = useState([]);

  // Favorites (localStorage persistent)
  const [favorites, setFavorites] = useState(() => getStoredFavorites());

  // Modals
  const [rentModalProduct, setRentModalProduct] = useState(null);
  const [contactModalProduct, setContactModalProduct] = useState(null);

  const [toastMessage, setToastMessage] = useState(null);
  const [initialListingFilters, setInitialListingFilters] = useState({});

  // Səbət dəyişəndə localStorage və Firestore ilə sinxronlaşdır
  useEffect(() => {
    setStoredCart(cartItems);
    if (currentUser?.id) {
      syncCartToFirestore(currentUser.id, cartItems);
    }
  }, [cartItems, currentUser?.id]);

  // Sevimlilər dəyişəndə localStorage və Firestore ilə sinxronlaşdır
  useEffect(() => {
    setStoredFavorites(favorites);
    if (currentUser?.id) {
      syncFavoritesToFirestore(currentUser.id, favorites);
    }
  }, [favorites, currentUser?.id]);

  // Firestore-dan ilkin məhsul, kateqoriya və regionları çəkmək (GET)
  useEffect(() => {
    let isMounted = true;

    async function loadApiData() {
      setIsDataLoading(true);
      try {
        const [apiProds, apiCats, apiRegions] = await Promise.all([
          getProductsApi(),
          getCategoriesApi(),
          getRegionsApi()
        ]);
        if (isMounted) {
          setProducts(Array.isArray(apiProds) ? apiProds : []);
          setCategories(Array.isArray(apiCats) ? apiCats : []);
          setRegions(Array.isArray(apiRegions) ? apiRegions : []);
        }
      } catch (err) {
        console.error('API data loading error:', err);
      } finally {
        if (isMounted) setIsDataLoading(false);
      }
    }

    loadApiData();

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('mehsul-')) {
        const prodId = hash.replace('mehsul-', '');
        setProducts(prev => {
          const found = prev.find(p => p.id === prodId);
          if (found) {
            setSelectedProduct(found);
            setActivePage('product-detail');
          }
          return prev;
        });
        return;
      }
      if (['home', 'listings', 'add-listing', 'profile', 'about', 'faq', 'contact', 'social'].includes(hash)) {
        setActivePage(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      isMounted = false;
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Daxil olmuş istifadəçinin məlumatlarını (sifarişlər, icarələr, səbət) Firestore-dan çək
  const loadUserData = async (user) => {
    if (!user?.id) return;
    try {
      const [userOrders, userBookings, userCloudData] = await Promise.all([
        getUserOrdersApi(user.id),
        getUserBookingsApi(user.id),
        getUserCartAndFavorites(user.id)
      ]);
      setOrders(Array.isArray(userOrders) ? userOrders : []);
      setRentalBookings(Array.isArray(userBookings) ? userBookings : []);
      
      // Əgər Firestore-da bulud səbəti/sevimliləri varsa və yerli boşdursa, yüklə
      if (userCloudData?.cart && userCloudData.cart.length > 0 && cartItems.length === 0) {
        setCartItems(userCloudData.cart);
      }
      if (userCloudData?.favorites && userCloudData.favorites.length > 0 && favorites.length === 0) {
        setFavorites(userCloudData.favorites);
      }
    } catch (err) {
      console.error('İstifadəçi məlumatları yüklənmədi:', err);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      loadUserData(currentUser);
    }
  }, [currentUser?.id]);

  const navigateTo = (page, param = null) => {
    setActivePage(page);
    if (page === 'product-detail' && param) {
      setSelectedProduct(param);
      window.location.hash = `mehsul-${param.id}`;
    } else {
      window.location.hash = page === 'home' ? '' : page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRequireAuth = (customMsg) => {
    setAuthMessage(customMsg || 'Davam etmək üçün zəhmət olmasa daxil olun');
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user, message) => {
    setCurrentUser(user);
    setStoredCurrentUser(user);
    loadUserData(user);
    showToast(message || 'Giriş uğurla edildi!');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setOrders([]);
    setRentalBookings([]);
    navigateTo('home');
    showToast('Hesabdan çıxış edildi');
  };

  // 1. SƏBƏTƏ ƏLAVƏ ETMƏK (Login Tələb Olunur)
  const handleAddToCart = (product) => {
    if (!currentUser) {
      handleRequireAuth('Məhsulu səbətə əlavə etmək üçün daxil olun');
      return;
    }

    if (!product || !product.canAddToCart) {
      showToast('Bu məhsul səbətə əlavə edilmir!');
      return;
    }

    setCartItems(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const existing = safePrev.find(item => item.id === product.id);
      if (existing) {
        return safePrev.map(item =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...safePrev, { ...product, quantity: 1 }];
    });

    const titleStr = product.title ? product.title.slice(0, 20) : 'Məhsul';
    showToast(`"${titleStr}..." səbətə atıldı!`);
  };

  // 2. SEVİMLİLƏRƏ ƏLAVƏ ETMƏK (Login Tələb Olunur)
  const handleToggleFavorite = (productId) => {
    if (!currentUser) {
      handleRequireAuth('Elanları sevimlilərə əlavə etmək üçün daxil olun');
      return;
    }

    setFavorites(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      if (safePrev.includes(productId)) {
        showToast('Elan sevimlilərdən silindi');
        return safePrev.filter(id => id !== productId);
      } else {
        showToast('Elan sevimlilərə əlavə edildi');
        return [...safePrev, productId];
      }
    });
  };

  // 3. İCARƏ SİFARİŞİ (Login Tələb Olunur)
  const handleOpenRentModal = (prod) => {
    if (!currentUser) {
      handleRequireAuth('İcarə sifarişi göndərmək üçün daxil olun');
      return;
    }
    setRentModalProduct(prod);
  };

  // 4. SATICI İLƏ ƏLAQƏ (Login Tələb Olunur)
  const handleOpenContactModal = (prod) => {
    if (!currentUser) {
      handleRequireAuth('Satıcı ilə əlaqə saxlamaq üçün daxil olun');
      return;
    }
    setContactModalProduct(prod);
  };

  const handleOpenProductDetail = (product) => {
    if (!product) return;
    navigateTo('product-detail', product);
  };

  // 5. YENİ ELAN PAYLAŞMAQ (Firestore POST — AddListingPage-dən gəlir)
  const handleAddProductSubmit = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    setSelectedProduct(newProduct);
    navigateTo('product-detail', newProduct);
    showToast('Təbriklər! Elanınız ImgBB + Firestore vasitəsilə paylaşıldı!');
  };

  const handleNavigateListings = (filters = {}) => {
    setInitialListingFilters(filters);
    navigateTo('listings');
  };

  const handleAddListingClick = () => {
    if (!currentUser) {
      handleRequireAuth('Yeni elan yerləşdirmək üçün zəhmət olmasa daxil olun');
      return;
    }
    navigateTo('add-listing');
  };

  const cartCount = (Array.isArray(cartItems) ? cartItems : []).reduce((acc, item) => acc + (item.quantity || 1), 0);
  const favoriteProducts = (Array.isArray(products) ? products : []).filter(p => (Array.isArray(favorites) ? favorites : []).includes(p?.id));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50/60 via-teal-50/30 to-green-100/40 text-gray-800 font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl bg-gray-900/90 backdrop-blur-md text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 animate-slideUp border border-gray-700/50">
          <span className="text-emerald-400">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={(page) => navigateTo(page)}
        cartCount={cartCount}
        openCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        openAuthModal={() => setAuthModalOpen(true)}
        openProfile={() => navigateTo('profile')}
        onAddListingClick={handleAddListingClick}
      />

      {/* Main Content Pages */}
      <main className="flex-grow">
        {activePage === 'home' && (
          <HomePage
            products={products}
            categories={categories}
            regions={regions}
            onNavigateListings={handleNavigateListings}
            onSelectCategory={(catName) => handleNavigateListings({ category: catName })}
            onViewDetails={handleOpenProductDetail}
            onAddToCart={handleAddToCart}
            onOpenRentModal={handleOpenRentModal}
            onOpenContactModal={handleOpenContactModal}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            currentUser={currentUser}
            onRequireAuth={handleRequireAuth}
          />
        )}

        {activePage === 'listings' && (
          <ListingsPage
            products={products}
            categories={categories}
            regions={regions}
            initialFilters={initialListingFilters}
            onViewDetails={handleOpenProductDetail}
            onAddToCart={handleAddToCart}
            onOpenRentModal={handleOpenRentModal}
            onOpenContactModal={handleOpenContactModal}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            currentUser={currentUser}
            onRequireAuth={handleRequireAuth}
          />
        )}

        {activePage === 'product-detail' && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            onBack={() => navigateTo('listings')}
            onNavigateProduct={handleOpenProductDetail}
            onAddToCart={handleAddToCart}
            onOpenRentModal={handleOpenRentModal}
            onOpenContactModal={handleOpenContactModal}
            isFavorite={(Array.isArray(favorites) ? favorites : []).includes(selectedProduct?.id)}
            onToggleFavorite={handleToggleFavorite}
            currentUser={currentUser}
            onRequireAuth={handleRequireAuth}
          />
        )}

        {activePage === 'add-listing' && (
          <AddListingPage
            currentUser={currentUser}
            categories={categories || []}
            regions={regions || []}
            onRequireAuth={handleRequireAuth}
            onAddProduct={handleAddProductSubmit}
            onCancel={() => navigateTo('home')}
          />
        )}

        {activePage === 'profile' && (
          <ProfilePage
            user={currentUser}
            onLogout={handleLogout}
            userListings={products.filter(p => p.userId === currentUser?.id) || []}
            rentalBookings={rentalBookings || []}
            orders={orders || []}
            favoriteProducts={favoriteProducts || []}
            onViewDetails={handleOpenProductDetail}
            onAddToCart={handleAddToCart}
            onOpenRentModal={handleOpenRentModal}
            onOpenContactModal={handleOpenContactModal}
            onToggleFavorite={handleToggleFavorite}
            currentUser={currentUser}
            onRequireAuth={handleRequireAuth}
            onAddNewListing={handleAddListingClick}
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
              setStoredCurrentUser(updated);
            }}
            onDeleteListing={(delId) => {
              setProducts(prev => prev.filter(p => p.id !== delId));
              showToast('Elanınız uğurla silindi');
            }}
          />
        )}

        {activePage === 'social' && <SocialFeedPage onNavigateListings={handleNavigateListings} />}
        {activePage === 'about' && <AboutPage onNavigateListings={handleNavigateListings} />}
        {activePage === 'faq' && <FaqPage onNavigateContact={() => navigateTo('contact')} />}
        {activePage === 'contact' && <ContactPage onShowToast={showToast} />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(page) => navigateTo(page)}
        onSelectCategory={(catName) => handleNavigateListings({ category: catName })}
      />

      {/* Səbət */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems || []}
        currentUser={currentUser}
        onRequireAuth={handleRequireAuth}
        onUpdateQuantity={(id, delta) => {
          setCartItems(prev =>
            (Array.isArray(prev) ? prev : [])
              .map(item => (item.id === id ? { ...item, quantity: (item.quantity || 1) + delta } : item))
              .filter(item => (item.quantity || 0) > 0)
          );
        }}
        onRemoveItem={(id) => setCartItems(prev => (Array.isArray(prev) ? prev : []).filter(item => item.id !== id))}
        onCheckoutSuccess={async (newOrder) => {
          try {
            // Sifarişi Firestore-a yaz
            const orderPayload = {
              ...newOrder,
              userId: currentUser?.id,
              date: new Date().toLocaleDateString('az-AZ'),
            };
            const saved = await createOrderApi(orderPayload);
            setOrders(prev => [saved || orderPayload, ...(Array.isArray(prev) ? prev : [])]);
          } catch (err) {
            console.error('Sifariş Firestore-a yazılmadı:', err);
          }
          setCartItems([]);
          setIsCartOpen(false);
          showToast('Sifarişiniz uğurla rəsmiləşdirildi!');
        }}
      />

      {/* İcarə Modalı */}
      <RentalBookingModal
        isOpen={!!rentModalProduct}
        product={rentModalProduct}
        onClose={() => setRentModalProduct(null)}
        onSubmitBooking={async (bookingData) => {
          try {
            // İcarə sifarişini Firestore-a yaz
            const bookingPayload = {
              ...bookingData,
              userId: currentUser?.id,
            };
            const saved = await createBookingApi(bookingPayload);
            setRentalBookings(prev => [saved || bookingPayload, ...(Array.isArray(prev) ? prev : [])]);
          } catch (err) {
            console.error('İcarə sifarişi Firestore-a yazılmadı:', err);
          }
          setRentModalProduct(null);
          showToast('İcarə sorğunuz göndərildi!');
        }}
      />

      {/* Satıcı ilə Əlaqə Modalı */}
      <SellerContactModal
        isOpen={!!contactModalProduct}
        product={contactModalProduct}
        onClose={() => setContactModalProduct(null)}
        onSendMessage={async (msgData) => {
          try {
            await sendContactMessageApi({
              ...msgData,
              senderId:    currentUser?.id,
              senderName:  currentUser?.name,
              productId:   contactModalProduct?.id,
              productTitle:contactModalProduct?.title,
            });
          } catch (err) {
            console.error('Mesaj Firestore-a yazılmadı:', err);
          }
          setContactModalProduct(null);
          showToast('Mesajınız satıcıya çatdırıldı!');
        }}
      />

      {/* Giriş / Qeydiyyat Modalı */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMessage={authMessage}
      />

    </div>
  );
}