// ══════════════════════════════════════════════════════════════════════════
// BATCH SERVICE — sürətli UI, minimal Firestore yazması
//
// İstifadəçi bəyənmə / yadda saxlama / izləmə düymələrini sürətlə klikləyə bilər.
// Hər klik üçün ayrı yazma göndərmək əvəzinə:
//   • əməliyyatlar deduplikasiya olunur (yalnız SON vəziyyət yazılır),
//   • qısa gecikmədən (debounce) sonra HAMISI tək `writeBatch` ilə göndərilir,
//   • sayğac dəyişikliyi yalnız real fərq olduqda tətbiq edilir (drift olmur),
//   • səhifə bağlananda növbə dərhal boşaldılır.
//
// Deterministik sənəd ID-ləri sayəsində yazmadan əvvəl heç bir oxuma sorğusu
// (getDocs) lazım deyil — bu, əvvəlki versiyaya nisbətən çox daha sürətlidir.
// ══════════════════════════════════════════════════════════════════════════

import { doc, serverTimestamp, writeBatch, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { invalidateSocialCache, likeDocId, saveDocId, followDocId } from './apiService';

const DEBOUNCE_MS = 1200;

/** key → { type, ...payload, initial, current } */
const queue = new Map();

let timer = null;
let flushing = false;
let listenersAttached = false;

function attachUnloadListeners() {
  if (listenersAttached || typeof window === 'undefined') return;
  listenersAttached = true;

  const onHide = () => { if (queue.size) flushNow(); };
  window.addEventListener('pagehide', onHide);
  window.addEventListener('beforeunload', onHide);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') onHide();
  });
}

function schedule() {
  attachUnloadListeners();
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => { timer = null; flushBatch(); }, DEBOUNCE_MS);
}

/**
 * Növbəyə əməliyyat yazır.
 * `initial` — ilk klikdən ƏVVƏLKİ vəziyyət; `current` — ən son vəziyyət.
 * Beləliklə istifadəçi 5 dəfə klikləsə də, serverə yalnız real fərq gedir.
 */
function enqueue(key, entry) {
  const existing = queue.get(key);
  if (existing) {
    existing.current = entry.current;
  } else {
    queue.set(key, { ...entry, initial: !entry.current });
  }
  schedule();
}

export function queueLike(postId, userId, isLiked) {
  if (!postId || !userId) return;
  enqueue(`like:${postId}:${userId}`, { type: 'like', postId, userId, current: !!isLiked });
}

export function queueSave(postId, userId, isSaved) {
  if (!postId || !userId) return;
  enqueue(`save:${postId}:${userId}`, { type: 'save', postId, userId, current: !!isSaved });
}

export function queueFollow(followerId, followingId, isFollowing) {
  if (!followerId || !followingId || followerId === followingId) return;
  enqueue(`follow:${followerId}:${followingId}`, {
    type: 'follow', followerId, followingId, current: !!isFollowing,
  });
}

/** Növbəni Firestore-a tək `writeBatch` ilə göndərir */
async function flushBatch() {
  if (flushing || queue.size === 0) return;

  flushing = true;
  const entries = [...queue.values()];
  queue.clear();

  try {
    const batch = writeBatch(db);
    // Sayğac dəyişiklikləri: { 'posts/ID': { likesCount: 2 } }
    const counters = new Map();

    const addCounter = (path, field, delta) => {
      if (!delta) return;
      const current = counters.get(path) || {};
      current[field] = (current[field] || 0) + delta;
      counters.set(path, current);
    };

    let writes = 0;

    for (const entry of entries) {
      // Real dəyişiklik yoxdursa (aç-bağla edilib) — heç nə etmə
      const changed = entry.initial !== entry.current;

      if (entry.type === 'like') {
        const ref = doc(db, 'likes', likeDocId(entry.postId, entry.userId));
        if (entry.current) batch.set(ref, { postId: entry.postId, userId: entry.userId, createdAt: serverTimestamp() });
        else batch.delete(ref);
        writes++;
        if (changed) addCounter(`posts/${entry.postId}`, 'likesCount', entry.current ? 1 : -1);
      }

      else if (entry.type === 'save') {
        const ref = doc(db, 'saves', saveDocId(entry.postId, entry.userId));
        if (entry.current) batch.set(ref, { postId: entry.postId, userId: entry.userId, createdAt: serverTimestamp() });
        else batch.delete(ref);
        writes++;
        if (changed) addCounter(`posts/${entry.postId}`, 'savesCount', entry.current ? 1 : -1);
      }

      else if (entry.type === 'follow') {
        const ref = doc(db, 'follows', followDocId(entry.followerId, entry.followingId));
        if (entry.current) {
          batch.set(ref, {
            followerId: entry.followerId,
            followingId: entry.followingId,
            createdAt: serverTimestamp(),
          });
        } else {
          batch.delete(ref);
        }
        writes++;
        if (changed) {
          addCounter(`users/${entry.followingId}`, 'followersCount', entry.current ? 1 : -1);
          addCounter(`users/${entry.followerId}`,  'followingCount', entry.current ? 1 : -1);
        }
      }
    }

    // Sayğaclar — atomik increment, `merge` ilə (sənəd yoxdursa yaradılır)
    for (const [path, fields] of counters.entries()) {
      const [col, id] = path.split('/');
      const data = {};
      Object.entries(fields).forEach(([field, delta]) => { data[field] = increment(delta); });
      batch.set(doc(db, col, id), data, { merge: true });
      writes++;
    }

    if (writes > 0) {
      await batch.commit();
      invalidateSocialCache('stats');
      invalidateSocialCache('counts');
      invalidateSocialCache('posts:saved');
    }
  } catch (error) {
    console.error('Batch flush error:', error);
    // Uğursuz əməliyyatları geri qaytar ki, növbəti cəhddə göndərilsin
    entries.forEach(entry => {
      const key = entry.type === 'follow'
        ? `follow:${entry.followerId}:${entry.followingId}`
        : `${entry.type}:${entry.postId}:${entry.userId}`;
      if (!queue.has(key)) queue.set(key, entry);
    });
  } finally {
    flushing = false;
    if (queue.size > 0) schedule();
  }
}

/** Gözləmədən dərhal göndər (səhifə dəyişəndə / bağlananda) */
export function flushNow() {
  if (timer) { clearTimeout(timer); timer = null; }
  return flushBatch();
}

/** Debug / test üçün növbənin vəziyyəti */
export function getQueueStatus() {
  const status = { likes: 0, saves: 0, follows: 0, total: queue.size };
  queue.forEach(entry => {
    if (entry.type === 'like') status.likes++;
    else if (entry.type === 'save') status.saves++;
    else if (entry.type === 'follow') status.follows++;
  });
  return status;
}
