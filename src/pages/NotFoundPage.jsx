/* eslint-disable no-unused-vars */
import React from 'react';
import { Home, List, MessageSquare, ArrowLeft, Sprout } from 'lucide-react';

export function NotFoundPage({ onNavigate }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl p-8 sm:p-12 max-w-lg w-full text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <Sprout className="w-10 h-10 animate-bounce" />
        </div>

        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">404</h1>
          <h2 className="text-lg font-black text-emerald-800 mt-1">Səhifə Tapılmadı</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Axtardığınız səhifə silinib və ya mövcud deyil. Aşağıdakı keçidlərlə davam edə bilərsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => onNavigate?.('home')}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
          >
            <Home className="w-4 h-4" /> Ana Səhifə
          </button>
          <button
            onClick={() => onNavigate?.('listings')}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition"
          >
            <List className="w-4 h-4" /> Bütün Elanlar
          </button>
          <button
            onClick={() => onNavigate?.('social')}
            className="sm:col-span-2 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition"
          >
            <MessageSquare className="w-4 h-4" /> Aqrar Paylaşımlar
          </button>
        </div>
      </div>
    </div>
  );
}
