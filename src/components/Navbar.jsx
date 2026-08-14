/* eslint-disable no-unused-vars */
import { useState } from "react";


export default function Navbar({ 
  activePage, 
  setActivePage, 
  cartCount, 
  openCart, 
  currentUser, 
  openAuthModal, 
  openProfile,
  searchQuery,
  setSearchQuery,
  listingTypeFilter,
  setListingTypeFilter
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 border-b border-emerald-100/60 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => { setActivePage('home'); }} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black bg-gradient-to-r from-emerald-800 to-green-600 bg-clip-text text-transparent tracking-tight">
                  AqroBazar
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-[11px] font-medium text-emerald-700 tracking-wider uppercase -mt-1">
                Aqrar Ticarət & İcarə
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-emerald-50/70 p-1.5 rounded-full border border-emerald-100/80 backdrop-blur-md">
            <button
              onClick={() => setActivePage('home')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activePage === 'home'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-sm'
                  : 'text-gray-700 hover:text-emerald-700 hover:bg-white/60'
              }`}
            >
              Ana Səhifə
            </button>
            <button
              onClick={() => setActivePage('listings')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activePage === 'listings'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-sm'
                  : 'text-gray-700 hover:text-emerald-700 hover:bg-white/60'
              }`}
            >
              <span>Elanlar</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                Satış & İcarə
              </span>
            </button>
            <button
              onClick={() => setActivePage('social')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activePage === 'social'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-sm'
                  : 'text-gray-700 hover:text-emerald-700 hover:bg-white/60'
              }`}
            >
              Paylaşımlar <span className="text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">Tezliklə</span>
            </button>
            <button
              onClick={() => setActivePage('about')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activePage === 'about'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-sm'
                  : 'text-gray-700 hover:text-emerald-700 hover:bg-white/60'
              }`}
            >
              Haqqımızda
            </button>
            <button
              onClick={() => setActivePage('faq')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activePage === 'faq'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-sm'
                  : 'text-gray-700 hover:text-emerald-700 hover:bg-white/60'
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => setActivePage('contact')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activePage === 'contact'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-sm'
                  : 'text-gray-700 hover:text-emerald-700 hover:bg-white/60'
              }`}
            >
              Əlaqə
            </button>
          </nav>

          {/* Right Action Icons & User Button */}
          <div className="flex items-center gap-3">
            
            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-2xl bg-white/80 border border-emerald-100 hover:border-emerald-300 text-emerald-800 hover:bg-emerald-50/80 transition-all shadow-sm group"
              title="Səbət"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth / Profile Area */}
            {currentUser ? (
              <div 
                onClick={openProfile}
                className="flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-2xl bg-white/80 border border-emerald-200/80 hover:border-emerald-400 cursor-pointer transition-all shadow-sm hover:shadow-md"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-bold flex items-center justify-center text-sm shadow-inner">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-gray-800 leading-none">{currentUser.name}</p>
                  <span className="text-[10px] text-emerald-600 font-medium">Profilə bax</span>
                </div>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Giriş / Qeydiyyat</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-emerald-100 space-y-2 bg-white/95 rounded-b-2xl shadow-xl px-2">
            <button
              onClick={() => { setActivePage('home'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"
            >
              Ana Səhifə
            </button>
            <button
              onClick={() => { setActivePage('listings'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 flex justify-between items-center"
            >
              <span>Elanlar</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Satış & İcarə</span>
            </button>
            <button
              onClick={() => { setActivePage('social'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"
            >
              Paylaşımlar (Sosial)
            </button>
            <button
              onClick={() => { setActivePage('about'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"
            >
              Haqqımızda
            </button>
            <button
              onClick={() => { setActivePage('faq'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"
            >
              FAQ
            </button>
            <button
              onClick={() => { setActivePage('contact'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"
            >
              Əlaqə
            </button>
          </div>
        )}
      </div>
    </header>
  );
}