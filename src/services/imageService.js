// ─────────────────────────────────────────────
// ImgBB Şəkil Yükləmə Xidməti
// API Key .env-dən: VITE_IMGBB_API_KEY
// ─────────────────────────────────────────────

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_ENDPOINT = 'https://api.imgbb.com/1/upload';

/**
 * File obyektini ImgBB-yə yükləyir, URL qaytarır
 * @param {File|Blob} file
 * @returns {Promise<string>} image URL
 */
export async function uploadImageToImgBB(file) {
  if (!IMGBB_API_KEY) throw new Error('ImgBB API açarı tapılmadı (VITE_IMGBB_API_KEY)');

  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${IMGBB_ENDPOINT}?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(`ImgBB yükləmə xətası: ${res.status}`);

  const data = await res.json();
  if (!data.success) throw new Error('ImgBB: şəkil yüklənmədi');

  return data.data.url; // https://i.ibb.co/xxx/image.jpg
}

/**
 * Base64 stringini ImgBB-yə yükləyir, URL qaytarır
 * @param {string} base64String  — data:image/...;base64,... formatında
 * @returns {Promise<string>} image URL
 */
export async function uploadBase64ToImgBB(base64String) {
  if (!IMGBB_API_KEY) throw new Error('ImgBB API açarı tapılmadı (VITE_IMGBB_API_KEY)');

  const base64 = String(base64String).replace(/^data:image\/[a-z+]+;base64,/, '');

  const formData = new FormData();
  formData.append('image', base64);

  const res = await fetch(`${IMGBB_ENDPOINT}?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(`ImgBB yükləmə xətası: ${res.status}`);

  const data = await res.json();
  if (!data.success) throw new Error('ImgBB: şəkil yüklənmədi');

  return data.data.url;
}

/**
 * Şəkli brauzerdə kiçildir və sıxır — yükləmə 5-10x sürətlənir.
 * Uğursuz olarsa orijinal fayl qaytarılır.
 * @param {File} file
 * @param {{ maxSize?: number, quality?: number }} options
 * @returns {Promise<File|Blob>}
 */
export async function compressImage(file, { maxSize = 1600, quality = 0.82 } = {}) {
  if (!file || !file.type?.startsWith('image/') || file.type === 'image/gif') return file;

  try {
    const bitmap = typeof createImageBitmap === 'function'
      ? await createImageBitmap(file)
      : await loadImageElement(file);

    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (!blob || blob.size >= file.size) return file;

    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch (err) {
    console.warn('compressImage: sıxılma alınmadı, orijinal istifadə olunur —', err?.message);
    return file;
  }
}

function loadImageElement(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Şəkil oxunmadı')); };
    img.src = url;
  });
}

/**
 * Bir neçə şəkli paralel sıxır və yükləyir.
 * @param {File[]} files
 * @param {(done: number, total: number) => void} [onProgress]
 * @returns {Promise<string[]>} URL massivi
 */
export async function uploadImages(files = [], onProgress) {
  const list = Array.from(files).filter(Boolean);
  if (list.length === 0) return [];

  let done = 0;
  const total = list.length;

  const results = await Promise.all(
    list.map(async file => {
      const optimized = await compressImage(file);
      const url = await uploadImageToImgBB(optimized);
      done += 1;
      onProgress?.(done, total);
      return url;
    })
  );

  return results.filter(Boolean);
}
