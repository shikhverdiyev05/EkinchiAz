/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react';
import {
  Info, Users, Target, Heart, Clock, Handshake, ChevronDown,
  Sprout, Tractor, ShoppingBasket, Cpu, Globe, Leaf, Star, CheckCircle,
  FlaskConical, Wheat, TreeDeciduous, MapPin, Phone, Mail,
  ArrowRight, Shield, TrendingUp, MessageCircle,
  ChevronLeft, ChevronRight, AlertCircle, Loader2
} from 'lucide-react';


export function SocialFeedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-6">
      <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
        <Users className="w-10 h-10 text-emerald-700" />
      </div>
      <h1 className="text-3xl font-black text-gray-900">Aqrar Sosial Şəbəkə və Paylaşımlar</h1>
      <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
        Tezliklə: Fermerlərin təcrübə mübadiləsi, aqronom məsləhətləri, məhsul xəstəliklərinin foto ilə
        təyini və sosial müzakirə platforması bu bölmədə aktivləşəcək.
      </p>
      <div className="inline-block px-4 py-2 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs">
        İnkişaf Mərhələsindədir
      </div>
    </div>
  );
}
