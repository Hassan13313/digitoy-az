/* ══════════════════════════════════════════════════
   DIGITOY.AZ — Media yükləmə siyasəti (client)

   Serverdəki public/api/media_policy.php ilə EYNİ olmalıdır.

   Ölçülmüş production limitləri (2026-08-31):
     upload_max_filesize = 100M   ← real tavan
     post_max_size       ≈ 104M
   Tətbiq limiti 90 MB — tavanın altında təhlükəsiz ehtiyat saxlayır.

   Köhnə davranış (hadisənin səbəbi): client HEÇ BİR yoxlama etmirdi.
   Qonaq 60-90 MB-lıq video seçir, mobil internetdə dəqiqələrlə (progress
   göstəricisi olmadan) gözləyirdi, sonra server 413 qaytarırdı — üstəlik
   kod uğursuz yükləməni daha 2 dəfə TƏKRARLAYIRDI (eyni faylı 3 dəfə
   göndərmək = 3× trafik və 3× gözləmə). İndi limit fayl SEÇİLƏN KİMİ,
   şəbəkəyə heç nə göndərilmədən yoxlanılır.
══════════════════════════════════════════════════ */

/* ══ İki ayrı tavan (server media_policy.php ilə eyni) ══
   TƏK SORĞU yolu server limitlərinə tabedir (post_max_size ≈ 104M) → 90 MB.
   HİSSƏLİ yol faylı 4 MB-lıq parçalarla göndərir, yəni server limitlərinə
   toxunmur → siyasət tavanı 2 GB. 2 GB-a çatmaq üçün heç bir server
   konfiqurasiyası dəyişdirilmir. */
export const MAX_UPLOAD_BYTES = 2147483648       /* 2 GiB */
export const MAX_UPLOAD_LABEL = '2 GB'

/** Bundan böyük fayllar hissə-hissə göndərilir */
export const CHUNK_THRESHOLD_BYTES = 6 * 1024 * 1024    /* 6 MB */
export const CHUNK_SIZE_BYTES      = 4 * 1024 * 1024    /* 4 MB — server tavanı 8 MB */

/* Bu ölçüdən yuxarı istifadəçiyə vaxt barədə xəbərdarlıq göstərilir:
   mobil internetdə 500 MB onlarla dəqiqə çəkə bilər. */
export const SLOW_UPLOAD_WARN_BYTES = 300 * 1024 * 1024 /* 300 MB */

/* Şəkillər bu ölçüdən böyükdürsə göndərməzdən əvvəl kiçildilir.
   Müasir telefon fotosu 8-20 MB olur; 2560px/JPEG 0.82 tipik olaraq
   1-2 MB verir — qalereyada vizual fərq yoxdur, yükləmə isə ~10 dəfə
   sürətlənir. Videolar TOXUNULMUR (brauzerdə etibarlı transkodlama yoxdur). */
export const IMAGE_RESIZE_THRESHOLD = 2 * 1024 * 1024   /* 2 MB */
export const IMAGE_MAX_DIMENSION    = 2560
export const IMAGE_JPEG_QUALITY     = 0.82

export const ACCEPT_IMAGE = 'image/*'
export const ACCEPT_VIDEO = 'video/*'
export const ACCEPT_ANY   = 'image/*,video/*'

/** İnsan üçün oxunaqlı ölçü */
export function humanSize(bytes) {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  if (bytes >= 1024)    return `${Math.round(bytes / 1024)} KB`
  return `${bytes} B`
}

/**
 * Fayl göndərilə bilərmi? — ŞƏBƏKƏYƏ ÇIXMADAN yoxlanılır.
 * @returns {{ ok: true } | { ok: false, message: string }}
 */
export function validateFile(file) {
  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')

  /* iOS bəzən HEIC/bəzi videolar üçün boş MIME verir — uzantıya baxırıq
     ki, fayl SÜKUTLA atılmasın (köhnə kod məhz belə edirdi). */
  if (!isImage && !isVideo) {
    const ext = (file.name.split('.').pop() || '').toLowerCase()
    const known = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif', 'mp4', 'mov', 'm4v']
    if (!known.includes(ext)) {
      return { ok: false, message: 'Yalnız şəkil və video göndərmək olar.' }
    }
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      message: `Çox böyükdür (${humanSize(file.size)}). Maksimum ${MAX_UPLOAD_LABEL}. `
             + 'Videonu qısaldın və ya kamera ayarlarından daha aşağı keyfiyyət seçin.',
    }
  }

  if (file.size === 0) {
    return { ok: false, message: 'Fayl boşdur və ya oxuna bilmədi.' }
  }

  return { ok: true }
}

/**
 * Şəkli göndərməzdən əvvəl kiçilt (canvas ilə yenidən kodlama).
 * Uğursuz olarsa ORİJİNAL fayl qaytarılır — sıxılma heç vaxt yükləməni
 * bloklamır. HEIC brauzerdə dekod olunmadığı üçün toxunulmur (server
 * Imagick ilə çevirir).
 */
export async function compressImage(file) {
  if (!file.type.startsWith('image/')) return file
  if (file.type === 'image/gif')       return file   /* animasiya itməsin */
  if (file.size <= IMAGE_RESIZE_THRESHOLD) return file
  if (typeof createImageBitmap !== 'function') return file

  try {
    /* createImageBitmap EXIF orientasiyasını tətbiq edir — şəkil yanakı düşmür */
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const { width, height } = bitmap
    const scale = Math.min(1, IMAGE_MAX_DIMENSION / Math.max(width, height))

    if (scale >= 1 && file.size <= IMAGE_RESIZE_THRESHOLD) {
      bitmap.close?.()
      return file
    }

    const w = Math.max(1, Math.round(width * scale))
    const h = Math.max(1, Math.round(height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    /* JPEG-də alfa kanalı yoxdur — şəffaf sahələr doldurulmasa QARA çıxır
       (ekran görüntüləri, stikerli şəkillər). Serverdəki thumbnail axını
       da eyni cür ağ fon qoyur (upload_photo.php: imagefill). */
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, w, h)
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close?.()

    const blob = await new Promise(res =>
      canvas.toBlob(res, 'image/jpeg', IMAGE_JPEG_QUALITY))

    /* Sıxılma faydasızsa (nadir) orijinalı saxla */
    if (!blob || blob.size >= file.size) return file

    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg',
      { type: 'image/jpeg', lastModified: Date.now() })
  } catch {
    return file
  }
}

/**
 * Videonun ilk kadrını JPEG poster kimi çıxar (server tərəfdə ffmpeg yoxdur).
 * Uğursuz olarsa null — yükləmə yenə də davam edir.
 */
export function extractVideoPoster(file) {
  return new Promise(resolve => {
    if (!file.type.startsWith('video/')) return resolve(null)

    const url   = URL.createObjectURL(file)
    const video = document.createElement('video')
    let settled = false

    const finish = (value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      URL.revokeObjectURL(url)
      video.removeAttribute('src')
      resolve(value)
    }

    /* Bəzi kodekləri (HEVC və s.) brauzer aça bilmir — sonsuz gözləmə olmasın */
    const timer = setTimeout(() => finish(null), 6000)

    video.muted       = true
    video.playsInline = true
    video.preload     = 'metadata'

    video.onloadeddata = () => {
      try {
        const scale = Math.min(1, 480 / Math.max(video.videoWidth, video.videoHeight))
        const w = Math.max(1, Math.round(video.videoWidth * scale))
        const h = Math.max(1, Math.round(video.videoHeight * scale))
        if (!w || !h) return finish(null)

        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d').drawImage(video, 0, 0, w, h)
        canvas.toBlob(b => finish(b || null), 'image/jpeg', 0.75)
      } catch {
        finish(null)
      }
    }
    video.onerror = () => finish(null)

    video.src = url
    /* İlk kadr qara olmasın deyə bir az irəli sarı */
    video.onloadedmetadata = () => {
      try { video.currentTime = Math.min(0.5, (video.duration || 1) / 4) } catch { /* boş ver */ }
    }
  })
}

/** Bu fayl hissə-hissə göndərilməlidirmi? */
export function needsChunkedUpload(file) {
  return file.size > CHUNK_THRESHOLD_BYTES
}

/** Yavaş şəbəkədə uzun çəkəcək fayl üçün xəbərdarlıq (yoxdursa null) */
export function slowUploadWarning(file) {
  if (file.size <= SLOW_UPLOAD_WARN_BYTES) return null
  return `${humanSize(file.size)} — mobil internetdə uzun çəkə bilər. `
       + 'Səhifəni bağlamayın; kəsilsə qaldığı yerdən davam edəcək.'
}
