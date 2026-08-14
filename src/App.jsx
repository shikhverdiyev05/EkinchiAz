import { useState } from 'react';
import productsData from './data/products.json';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import ProfilePage from './pages/ProfilePage';
import { AboutPage, FaqPage, ContactPage, SocialFeedPage } from './pages/StaticPages';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import RentalBookingModal from './components/RentalBookingModal';
import SellerContactModal from './components/SellerContactModal';
import AuthModal from './components/AuthModal';

export default function App() {
  // Navigation State: 'home', 'listings', 'profile', 'about', 'faq', 'contact', 'social'
  const [activePage, setActivePage] = useState('home');
  const [listingsFilters, setListingsFilters] = useState({});

  // Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // E-commerce Cart State
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Rental Bookings State
  const [rentalBookings, setRentalBookings] = useState([]);

  // Wishlist State (Favorite Product IDs)
  const [favorites, setFavorites] = useState(['prod-1', 'prod-8']);

  // Orders History State
  const [orders, setOrders] = useState([]);

  // Active Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rentModalProduct, setRentModalProduct] = useState(null);
  const [contactModalProduct, setContactModalProduct] = useState(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Cart Actions
  const handleAddToCart = (product) => {
    if (!product.canAddToCart) {
      showToast('Bu kateqoriyadakı məhsul səbətə əlavə edilmir!');
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    showToast(`"${product.title.slice(0, 24)}..." səbətə əlavə olundu!`);
  };

  const handleUpdateQuantity = (productId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    const newOrder = {
      orderId: Math.floor(10000 + Math.random() * 90000),
      items: [...cartItems],
      totalAmount: cartItems.reduce((s, i) => s + (i.price * i.quantity), 0) + 10,
      date: new Date().toLocaleDateString('az-AZ')
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setIsCartOpen(false);
    showToast('Sifarişiniz uğurla rəsmiləşdirildi!');
  };

  // Rental Booking Submit
  const handleRentalBookingSubmit = (bookingData) => {
    setRentalBookings((prev) => [bookingData, ...prev]);
    showToast(`İcarə sorğusu satıcıya göndərildi!`);
  };

  // Wishlist Toggle
  const handleToggleFavorite = (productId) => {
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Elan sevimlilərdən çıxarıldı');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Elan sevimlilərə əlavə olundu');
        return [...prev, productId];
      }
    });
  };

  // Navigation helpers
  const handleNavigateToListings = (filters = {}) => {
    setListingsFilters(filters);
    setActivePage('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const favoriteProducts = productsData.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-green-100/40 text-gray-800 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900/90 backdrop-blur-xl text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-700/50 text-xs font-bold flex items-center gap-2 animate-slideUp">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        openAuthModal={() => setAuthModalOpen(true)}
        openProfile={() => setActivePage('profile')}
      />

      {/* Main Page Router */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            products={productsData}
            onNavigateListings={handleNavigateToListings}
            onSelectCategory={(cat) => handleNavigateToListings({ category: cat })}
            onViewDetails={(product) => setSelectedProduct(product)}
            onAddToCart={handleAddToCart}
            onOpenRentModal={(product) => setRentModalProduct(product)}
            onOpenContactModal={(product) => setContactModalProduct(product)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activePage === 'listings' && (
          <ListingsPage
            products={productsData}
            initialFilters={listingsFilters}
            onViewDetails={(product) => setSelectedProduct(product)}
            onAddToCart={handleAddToCart}
            onOpenRentModal={(product) => setRentModalProduct(product)}
            onOpenContactModal={(product) => setContactModalProduct(product)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activePage === 'profile' && (
          <ProfilePage
            user={currentUser}
            onLogout={() => {
              setCurrentUser(null);
              setActivePage('home');
              showToast('Hesabdan çıxış edildi');
            }}
            rentalBookings={rentalBookings}
            orders={orders}
            favoriteProducts={favoriteProducts}
            onViewDetails={(product) => setSelectedProduct(product)}
            onAddToCart={handleAddToCart}
            onOpenRentModal={(product) => setRentModalProduct(product)}
            onOpenContactModal={(product) => setContactModalProduct(product)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activePage === 'about' && <AboutPage />}
        {activePage === 'faq' && <FaqPage />}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'social' && <SocialFeedPage />}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={(page) => { setActivePage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onOpenRentModal={(product) => setRentModalProduct(product)}
        onOpenContactModal={(product) => setContactModalProduct(product)}
      />

      <RentalBookingModal
        product={rentModalProduct}
        onClose={() => setRentModalProduct(null)}
        onSubmitBooking={handleRentalBookingSubmit}
      />

      <SellerContactModal
        product={contactModalProduct}
        onClose={() => setContactModalProduct(null)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Xoş gəldiniz, ${user.name}!`);
        }}
      />

    </div>
  );
}
