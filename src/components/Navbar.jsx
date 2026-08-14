import  { useState } from 'react';

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

  const handleNavClick = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-white/85 border-b border-emerald-100/80 shadow-xs transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo */}
            <div 
              onClick={() => handleNavClick('home')} 
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none flex-shrink-0"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-400 flex items-center justify-center text-white shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-all text-xl">
                🌱
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-emerald-950 via-emerald-700 to-green-600 bg-clip-text text-transparent tracking-tight">
                    AqroBazar
                  </span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <p className="text-[9px] sm:text-[11px] font-bold text-emerald-700 tracking-wider uppercase -mt-0.5">
                  Aqrar Ticarət & İcarə
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-emerald-50/80 p-1.5 rounded-full border border-emerald-100/90 backdrop-blur-md">
              <button
                onClick={() => handleNavClick('home')}
                className={`px-4 py-2 rounded-full text-xs xl:text-sm font-bold transition-all ${
                  activePage === 'home' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-700 hover:text-emerald-800'
                }`}
              >
                Ana Səhifə
              </button>
              <button
                onClick={() => handleNavClick('listings')}
                className={`px-4 py-2 rounded-full text-xs xl:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  activePage === 'listings' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-700 hover:text-emerald-800'
                }`}
              >
                <span>Elanlar</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activePage === 'listings' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Satış & İcarə
                </span>
              </button>
              <button onClick={() => handleNavClick('social')} className={`px-3.5 py-2 rounded-full text-xs font-bold ${activePage === 'social' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:text-emerald-800'}`}>Paylaşımlar</button>
              <button onClick={() => handleNavClick('about')} className={`px-3.5 py-2 rounded-full text-xs font-bold ${activePage === 'about' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:text-emerald-800'}`}>Haqqımızda</button>
              <button onClick={() => handleNavClick('faq')} className={`px-3.5 py-2 rounded-full text-xs font-bold ${activePage === 'faq' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:text-emerald-800'}`}>FAQ</button>
              <button onClick={() => handleNavClick('contact')} className={`px-3.5 py-2 rounded-full text-xs font-bold ${activePage === 'contact' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:text-emerald-800'}`}>Əlaqə</button>
            </nav>

            {/* Top Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Add Listing Button */}
              <button
                onClick={onAddListingClick}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 sm:py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-black shadow-sm transition active:scale-95"
              >
                <span>+</span>
                <span>Elan Yerləşdir</span>
              </button>

              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative p-2.5 sm:p-3 rounded-2xl bg-white/90 border border-emerald-100 text-emerald-800 shadow-xs hover:bg-emerald-50 transition"
                title="Səbət"
              >
                <span className="text-lg">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black min-w-[20px] h-5 rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User / Login Button */}
              {currentUser ? (
                <div onClick={openProfile} className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-2xl bg-white/90 border border-emerald-200 cursor-pointer shadow-xs hover:border-emerald-400 transition">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-gray-900 leading-none truncate max-w-[100px]">{currentUser.name}</p>
                    <span className="text-[10px] text-emerald-700 font-semibold">Profil</span>
                  </div>
                </div>
              ) : (
                <button onClick={openAuthModal} className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-white text-xs sm:text-sm font-bold shadow-sm">
                  Giriş
                </button>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100"
              >
                <span className="text-lg leading-none">☰</span>
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
                <span>➕ Yeni Elan Paylaş</span>
                <span>→</span>
              </button>

              <button onClick={() => handleNavClick('home')} className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs">🏡 Ana Səhifə</button>
              <button onClick={() => handleNavClick('listings')} className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs">🌾 Bütün Elanlar (Satış & İcarə)</button>
              <button onClick={() => handleNavClick('social')} className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs">💬 Paylaşımlar (Sosial)</button>
              <button onClick={() => handleNavClick('about')} className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs">ℹ️ Haqqımızda</button>
              <button onClick={() => handleNavClick('faq')} className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs">❓ FAQ</button>
              <button onClick={() => handleNavClick('contact')} className="w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs">📞 Əlaqə</button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile App-like Bottom Navigation Dock */}
      <div className="lg:hidden fixed bottom-3 left-3 right-3 z-40">
        <div className="bg-white/90 backdrop-blur-2xl border border-emerald-100/90 shadow-2xl rounded-3xl p-1.5 flex items-center justify-around">
          <button onClick={() => handleNavClick('home')} className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition ${activePage === 'home' ? 'text-emerald-700 bg-emerald-50 font-black' : 'text-gray-500'}`}>
            <span className="text-base">🏡</span>
            <span className="text-[10px] font-bold mt-0.5">Ana Səhifə</span>
          </button>

          <button onClick={() => handleNavClick('listings')} className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition ${activePage === 'listings' ? 'text-emerald-700 bg-emerald-50 font-black' : 'text-gray-500'}`}>
            <span className="text-base">🌾</span>
            <span className="text-[10px] font-bold mt-0.5">Elanlar</span>
          </button>

          {/* Plus Add Listing */}
          <button onClick={onAddListingClick} className="flex flex-col items-center py-1 px-2.5 rounded-2xl bg-amber-500 text-white shadow-md scale-105">
            <span className="text-base font-black">➕</span>
            <span className="text-[9px] font-black mt-0.5">Elan Ver</span>
          </button>

          <button onClick={openCart} className="flex flex-col items-center py-1 px-2.5 rounded-2xl text-gray-500 relative">
            <span className="text-base">🛒</span>
            {cartCount > 0 && <span className="absolute top-0 right-1.5 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
            <span className="text-[10px] font-bold mt-0.5">Səbət</span>
          </button>

          <button onClick={() => currentUser ? handleNavClick('profile') : openAuthModal()} className={`flex flex-col items-center py-1 px-2.5 rounded-2xl transition ${activePage === 'profile' ? 'text-emerald-700 bg-emerald-50 font-black' : 'text-gray-500'}`}>
            <span className="text-base">👤</span>
            <span className="text-[10px] font-bold mt-0.5">{currentUser ? 'Profil' : 'Giriş'}</span>
          </button>
        </div>
      </div>
    </>
  );
}