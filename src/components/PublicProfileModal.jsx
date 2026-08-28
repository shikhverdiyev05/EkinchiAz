import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import PublicProfilePage from '../pages/PublicProfilePage';

export default function PublicProfileModal({
  isOpen,
  userId,
  currentUser,
  onClose,
  onEditPost,
  onShowToast,
  onNavigateUser,
  onViewDetails
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen || !userId) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-center bg-gray-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto pb-10">
      <div className="bg-gray-50 w-full max-w-4xl min-h-screen sm:min-h-[90vh] sm:mt-10 sm:rounded-3xl shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
          <h2 className="text-lg font-black text-gray-900">Istifadəçi Profili</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto relative z-0">
          <PublicProfilePage 
            userId={userId}
            currentUser={currentUser}
            onNavigate={() => {}} 
            onNavigateUser={onNavigateUser}
            onEditPost={onEditPost}
            onShowToast={onShowToast}
            onViewDetails={onViewDetails}
            isModal={true}
          />
        </div>

      </div>
    </div>
  );
}
