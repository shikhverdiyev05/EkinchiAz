/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Home, List, ShoppingCart, Plus, MessageSquare,
  User, Menu, X, ChevronDown, Sparkles, LogIn
} from 'lucide-react';
import LogoImg from '../assets/logowobg.png';

export function Navbar({
  activePage,
  setActivePage,
  cartCount = 0,
  openCart,
  currentUser,
  openAuthModal,
  openProfile,
  onAddListingClick,
  onOpenCreatePost
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Check if we are near the bottom (within 100px)
      const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100;
      setIsAtBottom(bottom);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCenterAction = () => {
    if (activePage === 'social') {
      if (!currentUser) {
        openAuthModal?.();
        return;
      }
      onOpenCreatePost?.();
    } else {
      onAddListingClick?.();
    }
  };

  const isSocial = activePage === 'social';

  return (
    <>
      {/* Top Desktop & Mobile Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100 py-2.5'
            : 'bg-white border-b border-gray-100 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <img src={LogoImg} alt="Ekinchi.az" className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105" />
            <div className="hidden sm:block">
              <span className="font-black text-lg text-emerald-900 tracking-tight block leading-tight">
                ƏKİNÇİ<span className="text-emerald-500">.AZ</span>
              </span>
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block">
                Milli Aqrar Platforma
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-gray-50/80 p-1.5 rounded-2xl border border-gray-200/80">
            <button
              onClick={() => handleNav('home')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === 'home'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/50'
              }`}
            >
              Ana Səhifə
            </button>

            <button
              onClick={() => handleNav('listings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === 'listings'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/50'
              }`}
            >
              Bütün Elanlar
            </button>

            <button
              onClick={() => handleNav('social')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activePage === 'social'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/50'
              }`}
            >              
              Paylaşımlar
            </button>

            <button
              onClick={() => handleNav('about')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === 'about'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/50'
              }`}
            >
              Haqqımızda
            </button>

            <button
              onClick={() => handleNav('faq')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === 'faq'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/50'
              }`}
            >
              FAQ
            </button>

            <button
              onClick={() => handleNav('contact')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === 'contact'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/50'
              }`}
            >
              Əlaqə
            </button>
          </nav>

          {/* Desktop Right Side Actions */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Dynamic CTA Button */}
            <button
              onClick={handleCenterAction}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-950 rounded-2xl font-black text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              {isSocial ? 'Paylaşım Et' : 'Elan Ver'}
            </button>

            {/* Cart Drawer Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 text-gray-700 hover:text-emerald-700 bg-gray-50 hover:bg-emerald-50 rounded-2xl transition border border-gray-200"
              title="Səbət"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            {currentUser ? (
              <button
                onClick={openProfile}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 bg-gray-50 hover:bg-emerald-50 rounded-2xl transition border border-gray-200"
              >
                <img
                  src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'U')}&background=10b981&color=fff`}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-200"
                />
                <span className="text-xs font-black text-gray-800 truncate max-w-[100px]">
                  {currentUser.name?.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" /> Daxil Ol
              </button>
            )}
          </div>

          {/* Mobile Top Bar Actions (Cart & Hamburger) */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={openCart}
              className="relative p-2 text-gray-700 bg-gray-50 rounded-xl border border-gray-200"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(v => !v)}
              className="p-2 text-gray-700 bg-gray-50 rounded-xl border border-gray-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-2xl px-4 py-5 space-y-2 animate-slideDown">
            <button
              onClick={() => handleNav('home')}
              className="w-full text-left px-4 py-3 rounded-2xl font-bold text-sm text-gray-800 hover:bg-emerald-50 hover:text-emerald-700 transition"
            >
              Ana Səhifə
            </button>
            <button
              onClick={() => handleNav('listings')}
              className="w-full text-left px-4 py-3 rounded-2xl font-bold text-sm text-gray-800 hover:bg-emerald-50 hover:text-emerald-700 transition"
            >
              Bütün Elanlar
            </button>
            <button
              onClick={() => handleNav('social')}
              className="w-full text-left px-4 py-3 rounded-2xl font-bold text-sm text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100 transition flex items-center justify-between"
            >
              <span>Aqrar Paylaşımlar</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </button>
            <button
              onClick={() => handleNav('about')}
              className="w-full text-left px-4 py-3 rounded-2xl font-bold text-sm text-gray-800 hover:bg-emerald-50 hover:text-emerald-700 transition"
            >
              Haqqımızda
            </button>
            <button
              onClick={() => handleNav('faq')}
              className="w-full text-left px-4 py-3 rounded-2xl font-bold text-sm text-gray-800 hover:bg-emerald-50 hover:text-emerald-700 transition"
            >
              Tez-tez Verilən Suallar (FAQ)
            </button>
            <button
              onClick={() => handleNav('contact')}
              className="w-full text-left px-4 py-3 rounded-2xl font-bold text-sm text-gray-800 hover:bg-emerald-50 hover:text-emerald-700 transition"
            >
              Əlaqə
            </button>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* BOTTOM MOBILE NAVBAR                                               */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-in-out ${isAtBottom ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <div className="flex items-center justify-around max-w-md mx-auto px-1" style={{ paddingBottom: 'env(safe-area-inset-bottom, 4px)', paddingTop: '4px' }}>

          {/* 1. Ana Səhifə */}
          <button
            onClick={() => handleNav('home')}
            className="flex-1 flex flex-col items-center justify-center py-1.5 gap-0.5 relative"
          >
            <Home className={`w-5 h-5 transition-colors ${
              activePage === 'home' ? 'text-emerald-600' : 'text-gray-400'
            }`} />
            <span className={`text-[9px] font-bold transition-colors leading-none ${
              activePage === 'home' ? 'text-emerald-700' : 'text-gray-400'
            }`}>
              Ana Səhifə
            </span>
            {activePage === 'home' && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-emerald-600 rounded-full" />
            )}
          </button>

          {/* 2. Elanlar */}
          <button
            onClick={() => handleNav('listings')}
            className="flex-1 flex flex-col items-center justify-center py-1.5 gap-0.5 relative"
          >
            <List className={`w-5 h-5 transition-colors ${
              activePage === 'listings' ? 'text-emerald-600' : 'text-gray-400'
            }`} />
            <span className={`text-[9px] font-bold transition-colors leading-none ${
              activePage === 'listings' ? 'text-emerald-700' : 'text-gray-400'
            }`}>
              Elanlar
            </span>
            {activePage === 'listings' && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-emerald-600 rounded-full" />
            )}
          </button>

          {/* 3. CENTER PLUS BUTTON */}
          <div className="flex-1 flex justify-center -mt-4">
            <button
              onClick={handleCenterAction}
              className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_4px_14px_rgba(16,185,129,0.4)] flex items-center justify-center active:scale-95 transition-transform border-[3px] border-white"
              title={isSocial ? 'Paylaşım Et' : 'Elan Yerləşdir'}
            >
              <Plus className="w-5 h-5 stroke-[3]" />
            </button>
          </div>

          {/* 4. Paylaşımlar */}
          <button
            onClick={() => handleNav('social')}
            className="flex-1 flex flex-col items-center justify-center py-1.5 gap-0.5 relative"
          >
            <MessageSquare className={`w-5 h-5 transition-colors ${
              activePage === 'social' ? 'text-emerald-600' : 'text-gray-400'
            }`} />
            <span className={`text-[9px] font-bold transition-colors leading-none ${
              activePage === 'social' ? 'text-emerald-700' : 'text-gray-400'
            }`}>
              Paylaşımlar
            </span>
            {activePage === 'social' && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-emerald-600 rounded-full" />
            )}
          </button>

          {/* 5. Profil */}
          <button
            onClick={() => currentUser ? handleNav('profile') : openAuthModal?.()}
            className="flex-1 flex flex-col items-center justify-center py-1.5 gap-0.5 relative"
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt=""
                className={`w-6 h-6 rounded-full object-cover ${
                  activePage === 'profile' ? 'ring-2 ring-emerald-500 ring-offset-1' : ''
                }`}
              />
            ) : (
              <User className={`w-5 h-5 transition-colors ${
                activePage === 'profile' ? 'text-emerald-600' : 'text-gray-400'
              }`} />
            )}
            <span className={`text-[9px] font-bold transition-colors leading-none ${
              activePage === 'profile' ? 'text-emerald-700' : 'text-gray-400'
            }`}>
              Profil
            </span>
            {activePage === 'profile' && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-emerald-600 rounded-full" />
            )}
          </button>

        </div>
      </div>
    </>
  );
}

export default Navbar;
