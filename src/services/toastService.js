// ─────────────────────────────────────────────────────────────────────────
// Global Toast & Confirm xidməti
// Browser alert() / confirm() / prompt() mesajlarının toast əvəzi.
// App.jsx registerToastHandler / registerConfirmHandler funksiyalarını
// bir dəfə qeydə alır, bütün komponentlər isə showToast / showConfirm
// funksiyalarından istifadə edir.
// ─────────────────────────────────────────────────────────────────────────

let toastHandler = null;
let confirmHandler = null;

/** App.jsx tərəfindən qeydə alınır — mesajı global toast-a ötürür */
export function registerToastHandler(fn) {
  toastHandler = fn;
}

/** Hər yerdən çağırıla bilən toast mesajı (alert əvəzi) */
export function showToast(message) {
  if (toastHandler) {
    toastHandler(message);
  } else if (typeof console !== 'undefined') {
    console.warn('[toast]', message);
  }
}

/** App.jsx tərəfindən qeydə alınır — Promise(true/false) qaytarır */
export function registerConfirmHandler(fn) {
  confirmHandler = fn;
}

/** Hər yerdən çağırıla bilən təsdiq dialoqu (confirm əvəzi) */
export function showConfirm(message) {
  if (confirmHandler) {
    return confirmHandler(message);
  }
  // Fallback — handler qeydə alınmayıbsa native confirm
  return Promise.resolve(typeof window !== 'undefined' ? window.confirm(message) : true);
}
