/* ─────────────────────────────────────────────────────────────────────────────
   ŞƏKİL KİÇİLTMƏ — data URI üçün (Phase 43)

   NƏ ÜÇÜN LAZIMDIR: «Bizim Hekayəmiz» blokları və qalereya üz qapağı
   builder-də — yəni slug HƏLƏ YARANMAMIŞ — redaktə olunur. Həmin anda
   `uploads/<slug>/` qovluğu mövcud deyil, ona görə şəkli fayl kimi
   yükləmək MÜMKÜN DEYİL. Bu məlumat dəvətnamənin qalan hər şeyi ilə
   birlikdə `form_data` JSON-unda saxlanılır.

   ⚠ ÖLÇÜ İNTİZAMI: `form_data` hər qonağın dəvətnaməni açanda endirdiyi
   yükdür. Telefonun mobil internetində hər əlavə 100 KB hiss olunur.
   Ona görə şəkillər AQRESSİV kiçildilir:
       uzun kənar ≤ 1000px, JPEG q≈0.72 → adətən 90–150 KB.
   `MAX_DATA_BYTES`-ı keçən nəticə üçün keyfiyyət pilləli azaldılır; hələ də
   böyükdürsə xəta atılır və istifadəçiyə açıq mesaj göstərilir.

   ⚠ EXIF DÖNDƏRİLMƏSİ: `createImageBitmap(blob, { imageOrientation: 'from-image' })`
   dəstəklənirsə işlədilir — əks halda iPhone-dan gələn portret şəkil yan
   düşərdi. Dəstəklənmirsə adi `<img>` yoluna keçilir (brauzerlərin çoxu
   onsuz da EXIF-i özü tətbiq edir).
   ───────────────────────────────────────────────────────────────────────── */

export const RESIZE_PRESETS = {
  /* Hekayə blokları (Phase 43, data URI) — köhnə data axını üçün saxlanılıb */
  story: { maxEdge: 1000, quality: 0.72, maxBytes: 260 * 1024 },
  /* Hekayə şəkilləri (Phase 44) — serverə FAYL kimi gedir (story_upload.php).
     `form_data`-ya düşmədiyi üçün keyfiyyət daha yüksəkdir; server onsuz da
     1400px-ə qədər yenidən kodlaşdırır. */
  storyUpload: { maxEdge: 1400, quality: 0.82, maxBytes: 700 * 1024 },
  /* Qalereya üz qapağı — tam ekran fon, bir qədər böyük */
  cover: { maxEdge: 1600, quality: 0.78, maxBytes: 900 * 1024 },
  /* QR stend — 300 DPI çapda işlədilir, ona görə ən yüksək */
  stand: { maxEdge: 1800, quality: 0.86, maxBytes: 1400 * 1024 },
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

async function decode(file) {
  /* EXIF orientasiyası ilə dekod — dəstəklənən brauzerlərdə */
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      try { return await createImageBitmap(file) } catch { /* <img> yoluna düş */ }
    }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('DECODE_FAILED')) }
    img.src = url
  })
}

function toBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('ENCODE_FAILED'))),
      'image/jpeg',
      quality,
    )
  })
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload  = () => resolve(String(fr.result))
    fr.onerror = () => reject(new Error('READ_FAILED'))
    fr.readAsDataURL(blob)
  })
}

/**
 * Şəkli kiçildib JPEG Blob qaytar.
 *
 * @param {File}   file
 * @param {'story'|'storyUpload'|'cover'|'stand'|object} preset
 * @returns {Promise<{blob: Blob, bytes: number, width: number, height: number}>}
 */
export async function resizeToBlob(file, preset = 'story') {
  const cfg = typeof preset === 'string' ? RESIZE_PRESETS[preset] : preset
  if (!cfg) throw new Error('BAD_PRESET')

  if (!file) {
    const e = new Error('NO_FILE'); e.code = 'NO_FILE'; throw e
  }
  /* HEIC brauzerdə dekod olunmaya bilər — ona görə `type` boş olsa da
     cəhd edirik, yalnız aşkar yanlış tipləri rədd edirik. */
  if (file.type && !ACCEPTED.includes(file.type) && !file.type.startsWith('image/')) {
    const e = new Error('NOT_IMAGE'); e.code = 'NOT_IMAGE'; throw e
  }
  /* 25 MB-dan böyük orijinalı dekod etməyə çalışmaq telefonu dondurur */
  if (file.size > 25 * 1024 * 1024) {
    const e = new Error('TOO_LARGE'); e.code = 'TOO_LARGE'; throw e
  }

  let src
  try {
    src = await decode(file)
  } catch {
    const e = new Error('DECODE_FAILED'); e.code = 'DECODE_FAILED'; throw e
  }

  const sw = src.width
  const sh = src.height
  if (!sw || !sh) {
    const e = new Error('DECODE_FAILED'); e.code = 'DECODE_FAILED'; throw e
  }

  const ratio = Math.min(1, cfg.maxEdge / Math.max(sw, sh))
  const w = Math.max(1, Math.round(sw * ratio))
  const h = Math.max(1, Math.round(sh * ratio))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  /* Şəffaf PNG → ağ fon (JPEG şəffaflığı saxlamır, əks halda qara çıxır) */
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, w, h)
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(src, 0, 0, w, h)
  src.close?.()

  /* Keyfiyyəti pilləli azaldaraq hədəf ölçüyə düş */
  let quality = cfg.quality
  let blob = await toBlob(canvas, quality)
  let guard = 0
  while (blob.size > cfg.maxBytes && quality > 0.42 && guard < 5) {
    quality -= 0.1
    blob = await toBlob(canvas, quality)
    guard++
  }

  if (blob.size > cfg.maxBytes) {
    const e = new Error('STILL_TOO_LARGE')
    e.code = 'STILL_TOO_LARGE'
    e.bytes = blob.size
    e.limit = cfg.maxBytes
    throw e
  }

  return { blob, bytes: blob.size, width: w, height: h }
}

/**
 * Şəkli kiçildib data URI qaytar (qalereya qapağı, QR stend).
 * @returns {Promise<{dataUrl: string, bytes: number, width: number, height: number}>}
 */
export async function resizeToDataUrl(file, preset = 'story') {
  const { blob, bytes, width, height } = await resizeToBlob(file, preset)
  const dataUrl = await blobToDataUrl(blob)
  return { dataUrl, bytes, width, height }
}

/** İnsana oxunaqlı ölçü */
export function humanBytes(n) {
  if (!n) return '0 KB'
  if (n < 1024) return n + ' B'
  if (n < 1024 * 1024) return Math.round(n / 1024) + ' KB'
  return (n / 1048576).toFixed(1) + ' MB'
}

/** Azərbaycanca xəta mesajı — komponentlər eyni mətni təkrarlamasın */
export function resizeErrorText(err) {
  switch (err?.code) {
    case 'NOT_IMAGE':       return 'Bu fayl şəkil deyil. JPG, PNG və ya WEBP seçin.'
    case 'TOO_LARGE':       return 'Şəkil çox böyükdür (25 MB-dan çox). Daha kiçik fayl seçin.'
    case 'DECODE_FAILED':   return 'Şəkil açıla bilmədi. Başqa fayl sınayın (HEIC formatı bəzi brauzerlərdə dəstəklənmir).'
    case 'STILL_TOO_LARGE': return 'Şəkli kiçiltmək alınmadı. Daha sadə/kiçik şəkil seçin.'
    default:                return 'Şəkil yüklənmədi. Yenidən cəhd edin.'
  }
}

export default resizeToDataUrl
