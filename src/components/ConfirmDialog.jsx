import { AlertTriangle } from 'lucide-react';

/**
 * Qlobal təsdiq dialoqu — window.confirm() əvəzi.
 * App.jsx tərəfindən render olunur, showConfirm() vasitəsilə açılır.
 */
export default function ConfirmDialog({ state, onConfirm, onCancel }) {
  if (!state?.open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-fadeIn">
        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-rose-500" />
        </div>
        <p className="text-sm font-bold text-gray-900 leading-relaxed mb-6">{state.message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition"
          >
            İmtina Et
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition"
          >
            Bəli, Davam Et
          </button>
        </div>
      </div>
    </div>
  );
}
