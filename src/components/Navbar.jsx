import { useState, useEffect } from 'react';
import { Home, List, MessageSquare, Info, HelpCircle, Phone, PlusCircle, ShoppingCart, User, Menu, Plus } from 'lucide-react';

export default function Navbar({ 
  activePage, 
  setActivePage, 
  cartCount, 
  openCart, 
  currentUser, 
  openAuthModal, 
  openProfile,
  onAddListingClick
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [showBottomBar, setShowBottomBar] = useState(true);
  const [isNearFooter, setIsNearFooter] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let prevY = typeof window !== 'undefined' ? window.scrollY : 0;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const diff = currentY - prevY;

      // Footere çatıb-çatmadığını yoxla (aşağıdan 320px məsafə)
      const nearBottom = currentY + windowHeight >= docHeight - 320;
      setIsNearFooter(nearBottom);

      // Back to top düyməsi 300px-dən sonra görünür
      setShowBackToTop(currentY > 300);

      // Footere çatıbsa -> HƏR İKİSİ GİZLƏNSİN
      if (nearBottom) {
        setShowNavbar(false);
        setShowBottomBar(false);
        setMobileMenuOpen(false);
      } 
      // Səhifənin ən yuxarısında hər ikisi görünür
      else if (currentY < 20) {
        setShowNavbar(true);
        setShowBottomBar(true);
      } 
      // Aşağı scroll olunanda: Navbar gizlənir, BottomBar görünür
      else if (diff > 8) {
        setShowNavbar(false);
        setShowBottomBar(true);
        setMobileMenuOpen(false);
      } 
      // Yuxarı scroll olunanda: Navbar görünür, BottomBar gizlənir
      else if (diff < -8) {
        setShowNavbar(true);
        setShowBottomBar(false);
      }

      prevY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    setShowNavbar(true);
    setShowBottomBar(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Header Placeholder */}
      <div className="h-16 sm:h-20" />

      {/* Top Header (Aşağı scroll-da və Footer-də gizlənir, Yuxarı scroll-da açılır) */}
      <header className={`fixed top-0 left-0 right-0 z-40 w-full backdrop-blur-2xl bg-white/90 border-b border-emerald-100/80 shadow-xs transition-transform duration-300 ${
        showNavbar && !isNearFooter ? 'translate-y-0' : '-translate-y-full lg:translate-y-0'
      }`}>
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
            
            {/* Logo */}
            <div 
              onClick={() => handleNavClick('home')} 
              className="flex items-center gap-2 cursor-pointer group select-none flex-shrink-0"
            >
              <img src="/logowobg.png" alt="Ekinchi.Az" className="w-9 h-9 sm:w-11 sm:h-11 object-contain group-hover:scale-105 transition-all duration-300" />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-emerald-950 via-emerald-700 to-green-600 bg-clip-text text-transparent tracking-tight transition-all duration-300">
                    Ekinchi.Az
                  </span>
                  <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <p className="hidden xl:block text-[10px] font-bold text-emerald-700 tracking-wider uppercase -mt-0.5 transition-all duration-300">
                  Aqrar Ticarət & İcarə
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-emerald-50/80 p-1 rounded-full border border-emerald-100/90 backdrop-blur-md flex-shrink-1">
              <button
                onClick={() => handleNavClick('home')}
                className={`px-3 xl:px-4 py-1.5 xl:py-2 rounded-full text-[11px] xl:text-xs font-bold transition-all ${
                  activePage === 'home' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-700 hover:text-emerald-800'
                }`}
              >
                Ana Səhifə
              </button>
              <button
                onClick={() => handleNavClick('listings')}
                className={`px-3 xl:px-4 py-1.5 xl:py-2 rounded-full text-[11px] xl:text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activePage === 'listings' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-700 hover:text-emerald-800'
                }`}
              >
                <span>Elanlar</span>
                <span className={`hidden xl:inline-block text-[9px] px-2 py-0.5 rounded-full font-bold ${
                  activePage === 'listings' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Satış & İcarə
                </span>
              </button>
              <button onClick={() => handleNavClick('social')} className={`px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-full text-[11px] xl:text-xs font-bold transition-all ${activePage === 'social' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:text-emerald-800'}`}>Paylaşımlar</button>
              <button onClick={() => handleNavClick('about')} className={`px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-full text-[11px] xl:text-xs font-bold transition-all ${activePage === 'about' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:text-emerald-800'}`}>Haqqımızda</button>
              <button onClick={() => handleNavClick('faq')} className={`px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-full text-[11px] xl:text-xs font-bold transition-all ${activePage === 'faq' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:text-emerald-800'}`}>FAQ</button>
              <button onClick={() => handleNavClick('contact')} className={`px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-full text-[11px] xl:text-xs font-bold transition-all ${activePage === 'contact' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:text-emerald-800'}`}>Əlaqə</button>
            </nav>

            {/* Top Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
              
              {/* Add Listing Button */}
              <button
                onClick={onAddListingClick}
                className="hidden sm:flex items-center gap-1.5 p-2 xl:px-3.5 xl:py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black shadow-sm transition active:scale-95"
                title="Elan Yerləşdir"
              >
                <Plus className="w-5 h-5 xl:w-4 xl:h-4" />
                <span className="hidden xl:inline text-sm">Elan Yerləşdir</span>
              </button>

              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative p-2 sm:p-2.5 rounded-2xl bg-white/90 border border-emerald-100 text-emerald-800 shadow-xs hover:bg-emerald-50 transition"
                title="Səbət"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] sm:text-[10px] font-black min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-5 rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User / Login Button */}
              {currentUser ? (
                <div onClick={openProfile} className="flex items-center gap-2 p-1 xl:pl-1.5 xl:pr-3 xl:py-1.5 rounded-2xl bg-white/90 border border-emerald-200 cursor-pointer shadow-xs hover:border-emerald-400 transition" title="Profil">
                  {currentUser.avatar && currentUser.avatar.startsWith('http') ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover shadow-xs ring-1 ring-emerald-300"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="hidden xl:block text-left">
                    <p className="text-xs font-bold text-gray-900 leading-none truncate max-w-[80px]">{currentUser.name}</p>
                    <span className="text-[10px] text-emerald-700 font-semibold">Profil</span>
                  </div>
                </div>
              ) : (
                <button onClick={openAuthModal} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-white text-xs sm:text-sm font-bold shadow-sm">
                  Giriş
                </button>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Mobile Full Dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-emerald-100 space-y-1.5 bg-white/95 backdrop-blur-2xl rounded-b-3xl shadow-xl px-2 mb-3 animate-slideUp">
              <button
                onClick={onAddListingClick}
                className="w-full text-left px-4 py-3 rounded-2xl font-black text-xs sm:text-sm bg-amber-500 text-white shadow-xs flex items-center justify-between"
              >
                <span className="flex items-center gap-2"><PlusCircle className="w-4 h-4" /> Yeni Elan Paylaş</span>
                <span>→</span>
              </button>

              <button onClick={() => handleNavClick('home')} className="w-full px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 text-gray-700 hover:bg-emerald-50"><Home className="w-4 h-4 text-emerald-600" /> Ana Səhifə</button>
              <button onClick={() => handleNavClick('listings')} className="w-full px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 text-gray-700 hover:bg-emerald-50"><List className="w-4 h-4 text-emerald-600" /> Bütün Elanlar (Satış & İcarə)</button>
              <button onClick={() => handleNavClick('social')} className="w-full px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 text-gray-700 hover:bg-emerald-50"><MessageSquare className="w-4 h-4 text-emerald-600" /> Paylaşımlar (Sosial)</button>
              <button onClick={() => handleNavClick('about')} className="w-full px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 text-gray-700 hover:bg-emerald-50"><Info className="w-4 h-4 text-emerald-600" /> Haqqımızda</button>
              <button onClick={() => handleNavClick('faq')} className="w-full px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 text-gray-700 hover:bg-emerald-50"><HelpCircle className="w-4 h-4 text-emerald-600" /> FAQ</button>
              <button onClick={() => handleNavClick('contact')} className="w-full px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 text-gray-700 hover:bg-emerald-50"><Phone className="w-4 h-4 text-emerald-600" /> Əlaqə</button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile App-like Bottom Navigation Dock (Yuxarı scroll-da və Footer-də gizlənir, Aşağı scroll-da görünür) */}
      <div className={`lg:hidden fixed bottom-3 left-3 right-3 z-40 transition-all duration-300 transform ${
        showBottomBar && !isNearFooter ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
      }`}>
        <div className="bg-white/95 backdrop-blur-2xl border border-emerald-100/90 shadow-2xl rounded-2xl p-1.5 flex items-stretch justify-between gap-1">
          <button onClick={() => handleNavClick('home')} className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition ${activePage === 'home' ? 'text-emerald-700 bg-emerald-50 font-black' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold">Ana Səhifə</span>
          </button>

          <button onClick={() => handleNavClick('listings')} className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition ${activePage === 'listings' ? 'text-emerald-700 bg-emerald-50 font-black' : 'text-gray-500 hover:bg-gray-50'}`}>
            <List className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold">Elanlar</span>
          </button>

          {/* Plus Add Listing */}
          <button onClick={onAddListingClick} className="flex-1 flex flex-col items-center justify-center py-2 rounded-xl bg-amber-500 text-white shadow-md active:scale-95 transition">
            <Plus className="w-6 h-6 mb-0.5 stroke-[3]" />
            <span className="text-[9px] font-black">Elan Ver</span>
          </button>

          <button onClick={openCart} className="flex-1 flex flex-col items-center justify-center py-2 rounded-xl text-gray-500 hover:bg-gray-50 relative">
            <ShoppingCart className="w-5 h-5 mb-1" />
            {cartCount > 0 && <span className="absolute top-1 right-2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
            <span className="text-[9px] font-bold">Səbət</span>
          </button>

          <button onClick={() => currentUser ? handleNavClick('profile') : openAuthModal()} className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition ${activePage === 'profile' ? 'text-emerald-700 bg-emerald-50 font-black' : 'text-gray-500 hover:bg-gray-50'}`}>
            <User className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold">Profil</span>
          </button>
        </div>
      </div>

      {/* Floating Return to Top Button (Sağ küncdə, footerdəki yazılara mane olmayacaq şəkildə) */}
      <button
        onClick={scrollToTop}
        title="Yuxarı Qayıt"
        className={`fixed bottom-24 lg:bottom-6 right-5 sm:right-8 z-50 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-500 text-white shadow-2xl shadow-emerald-950/30 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group ${
          showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
      >
        <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </>
  );
}
