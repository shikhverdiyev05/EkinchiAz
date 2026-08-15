// ─────────────────────────────────────────────
// ImgBB Şəkil Yükləmə Xidməti
// API Key .env-dən: VITE_IMGBB_API_KEY
// ─────────────────────────────────────────────

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

/**
 * File obyektini ImgBB-yə yükləyir, URL qaytarır
 * @param {File} file
 * @returns {Promise<string>} image URL
 */
export async function uploadImageToImgBB(file) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    { method: 'POST', body: formData }
  );

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
  const base64 = base64String.replace(/^data:image\/[a-z]+;base64,/, '');

  const formData = new FormData();
  formData.append('image', base64);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) throw new Error(`ImgBB yükləmə xətası: ${res.status}`);

  const data = await res.json();
  if (!data.success) throw new Error('ImgBB: şəkil yüklənmədi');

  return data.data.url;
}
