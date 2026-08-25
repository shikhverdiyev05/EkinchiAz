// ─────────────────────────────────────────────
// Ümumi formatlama köməkçiləri (sosial modul)
// ─────────────────────────────────────────────

/** Firestore Timestamp | Date | number | string → millisaniyə */
export function toMs(value) {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value.seconds === 'number') return value.seconds * 1000;
  if (value instanceof Date) return value.getTime();
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

/** "indi", "5 dəq", "3 saat", "2 gün", "12 mart 2026" */
export function formatRelativeTime(value) {
  const ms = toMs(value);
  if (!ms) return 'indi';

  const diff = Date.now() - ms;
  if (diff < 0) return 'indi';

  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return 'indi';
  if (diff < hour) return `${Math.floor(diff / minute)} dəq əvvəl`;
  if (diff < day) return `${Math.floor(diff / hour)} saat əvvəl`;
  if (diff < 7 * day) return `${Math.floor(diff / day)} gün əvvəl`;

  try {
    return new Date(ms).toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return new Date(ms).toLocaleDateString();
  }
}

/** Tam tarix (tooltip üçün) */
export function formatFullDate(value) {
  const ms = toMs(value);
  if (!ms) return '';
  try {
    return new Date(ms).toLocaleString('az-AZ', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return new Date(ms).toLocaleString();
  }
}

/** 1200 → "1.2K" */
export function formatCount(value) {
  const n = Number(value) || 0;
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

/** Şəkli olmayan istifadəçilər üçün avatar URL-i */
export function avatarUrl(name, photo, size = 96) {
  if (photo && typeof photo === 'string' && photo.trim()) return photo;
  const safeName = encodeURIComponent(String(name || 'İstifadəçi').slice(0, 24));
  return `https://ui-avatars.com/api/?name=${safeName}&background=10b981&color=fff&bold=true&size=${size}`;
}

/** Paylaşım linki (kopyalama / paylaşma üçün) */
export function postShareUrl(postId) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/sosial?post=${postId}`;
}

/** Panoya kopyalama — köhnə brauzerlər üçün fallback ilə */
export async function copyToClipboard(text) {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch (err) {
    console.warn('copyToClipboard error:', err?.message);
    return false;
  }
}
