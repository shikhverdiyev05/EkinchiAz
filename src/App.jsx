/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import RentalBookingModal from './components/RentalBookingModal';
import SellerContactModal from './components/SellerContactModal';
import AuthModal from './components/AuthModal';

import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AddListingPage from './pages/AddListingPage';
import ProfilePage from './pages/ProfilePage';
import { AboutPage, FaqPage, ContactPage, SocialFeedPage } from './pages/StaticPages';

import { 
  getStoredProducts, 
  saveProduct, 
  getStoredCurrentUser, 
  logoutUser 
} from './services/storageService';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  // Cart & Bookings
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [rentalBookings, setRentalBookings] = useState([]);
  const [orders, setOrders] = useState([]);

  // Favorites: Default liked state false (empty array)
  const [favorites, setFavorites] = useState([]);

  // Modals for rent & contact
  const [rentModalProduct, setRentModalProduct] = useState(null);
  const [contactModalProduct, setContactModalProduct] = useState(null);

  // Notifications
  const [toastMessage, setToastMessage] = useState(null);
  const [initialListingFilters, setInitialListingFilters] = useState({});

  // Initialize storage
  useEffect(() => {
    setProducts(getStoredProducts());
    setCurrentUser(getStoredCurrentUser());
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleRequireAuth = (customMsg) => {
    setAuthMessage(customMsg || 'Davam etmək üçün zəhmət olmasa daxil olun');
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user, message) => {
    setCurrentUser(user);
    showToast(message || 'Giriş uğurla edildi!');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setActivePage('home');
    showToast('Hesabdan çıxış edildi');
  };

  const handleAddToCart = (product) => {
    if (!product.canAddToCart) {
      showToast('Bu məhsul səbətə əlavə edilmir!');
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    showToast(`"${product.title.slice(0, 20)}..." səbətə atıldı!`);
  };

  const handleToggleFavorite = (productId) => {
    if (!currentUser) {
      handleRequireAuth('Elanları sevimlilərə əlavə etmək üçün daxil olun');
      return;
    }

    setFavorites(prev => {
      if (prev.includes(productId)) {
        showToast('Elan sevimlilərdən silindi');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Elan sevimlilərə əlavə edildi');
        return [...prev, productId];
      }
    });
  };

  const handleOpenProductDetail = (product) => {
    setSelectedProduct(product);
    setActivePage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddProductSubmit = (newProduct) => {
    const updated = saveProduct(newProduct);
    setProducts(updated);
    setSelectedProduct(newProduct);
    setActivePage('product-detail');
    showToast('Təbriklər! Yeni elanınız uğurla paylaşıldı!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateListings = (filters = {}) => {
    setInitialListingFilters(filters);
    setActivePage('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddListingClick = () => {
    if (!currentUser) {
      handleRequireAuth('Yeni elan yerləşdirmək üçün zəhmət olmasa daxil olun');
      return;
    }
    setActivePage('add-listing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50/60 via-teal-50/30 to-green-100/40 text-gray-800 font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-emerald-950 text-white px-4 sm:px-5 py-3 rounded-2xl shadow-2xl border border-emerald-700/80 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-fadeIn">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cartCount}
        openCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        openAuthModal={() => {
          setAuthMessage('');
          setAuthModalOpen(true);
        }}
        openProfile={() => {
          setActivePage('profile');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onAddListingClick={handleAddListingClick}
      />

      {/* Main Pages Router */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            products={products}
            onNavigateListings={handleNavigateListings}
            onSelectCategory={(catName) => handleNavigateListings({ category: catName })}
            onViewDetails={handleOpenProductDetail}
            onAddToCart={handleAddToCart}
            onOpenRentModal={(prod) => setRentModalProduct(prod)}
            onOpenContactModal={(prod) => setContactModalProduct(prod)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            currentUser={currentUser}
            onRequireAuth={handleRequireAuth}
          />
        )}

        {activePage === 'listings' && (
          <ListingsPage
            products={products}
            initialFilters={initialListingFilters}
            onViewDetails={handleOpenProductDetail}
            onAddToCart={handleAddToCart}
            onOpenRentModal={(prod) => setRentModalProduct(prod)}
            onOpenContactModal={(prod) => setContactModalProduct(prod)}
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
            onBack={() => setActivePage('listings')}
            onNavigateProduct={handleOpenProductDetail}
            onAddToCart={handleAddToCart}
            onOpenRentModal={(prod) => setRentModalProduct(prod)}
            onOpenContactModal={(prod) => setContactModalProduct(prod)}
            isFavorite={selectedProduct ? favorites.includes(selectedProduct.id) : false}
            onToggleFavorite={handleToggleFavorite}
            currentUser={currentUser}
            onRequireAuth={handleRequireAuth}
          />
        )}

        {activePage === 'add-listing' && (
          <AddListingPage
            currentUser={currentUser}
            onRequireAuth={handleRequireAuth}
            onAddProduct={handleAddProductSubmit}
            onCancel={() => setActivePage('home')}
          />
        )}

        {activePage === 'profile' && (
          <ProfilePage
            user={currentUser}
            onLogout={handleLogout}
            rentalBookings={rentalBookings}
            orders={orders}
            favoriteProducts={favoriteProducts}
            onViewDetails={handleOpenProductDetail}
            onAddToCart={handleAddToCart}
            onOpenRentModal={(prod) => setRentModalProduct(prod)}
            onOpenContactModal={(prod) => setContactModalProduct(prod)}
            onToggleFavorite={handleToggleFavorite}
            currentUser={currentUser}
            onRequireAuth={handleRequireAuth}
            onAddNewListing={handleAddListingClick}
          />
        )}

        {activePage === 'about' && <AboutPage onNavigateListings={handleNavigateListings} />}
        {activePage === 'faq' && <FaqPage onNavigateContact={() => setActivePage('contact')} />}
        {activePage === 'contact' && <ContactPage onShowToast={showToast} />}
        {activePage === 'social' && <SocialFeedPage onNavigateListings={handleNavigateListings} />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={(catName) => handleNavigateListings({ category: catName })}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={(id, delta) => {
          setCartItems(prev =>
            prev
              .map(item => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
              .filter(item => item.quantity > 0)
          );
        }}
        onRemoveItem={(id) => setCartItems(prev => prev.filter(item => item.id !== id))}
        onCheckoutSuccess={(newOrder) => {
          setOrders(prev => [newOrder, ...prev]);
          setCartItems([]);
          setIsCartOpen(false);
          showToast('Sifarişiniz uğurla rəsmiləşdirildi!');
        }}
      />

      {/* Rental Booking Modal */}
      <RentalBookingModal
        isOpen={!!rentModalProduct}
        product={rentModalProduct}
        onClose={() => setRentModalProduct(null)}
        onSubmitBooking={(bookingData) => {
          setRentalBookings(prev => [bookingData, ...prev]);
          setRentModalProduct(null);
          showToast('İcarə sorğunuz satıcıya göndərildi!');
        }}
      />

      {/* Seller Contact Modal for Heavy Equipment / Land */}
      <SellerContactModal
        isOpen={!!contactModalProduct}
        product={contactModalProduct}
        onClose={() => setContactModalProduct(null)}
        onSendMessage={(msgData) => {
          setContactModalProduct(null);
          showToast('Mesajınız satıcıya çatdırıldı!');
        }}
      />

      {/* Auth Modal (Login / Register to JSON Store) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMessage={authMessage}
      />

    </div>
  );
}