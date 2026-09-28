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

/** Canvas-dakı kadrın orta parlaqlığı (0-255). Oxuna bilməsə null. */
function frameLuma(ctx, w, h) {
  try {
    const sw = Math.min(16, w), sh = Math.min(16, h)
    const probe = document.createElement('canvas')
    probe.width = sw
    probe.height = sh
    const pctx = probe.getContext('2d', { willReadFrequently: true })
    pctx.drawImage(ctx.canvas, 0, 0, sw, sh)
    const d = pctx.getImageData(0, 0, sw, sh).data
    let sum = 0
    for (let i = 0; i < d.length; i += 4) sum += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
    return sum / (d.length / 4)
  } catch {
    return null
  }
}

/* Bu parlaqlıqdan aşağı kadr «qara» sayılır (fade-in, qapalı obyektiv…) */
const DARK_FRAME_LUMA = 16

/**
 * Videodan JPEG poster çıxar (server tərəfdə ffmpeg yoxdur).
 * Uğursuz olarsa null — yükləmə yenə də davam edir.
 *
 * ⚠ 2026-09-28 düzəlişi (canlıda qalereyada QARA qapaqlar): kadr əvvəl
 * `loadeddata`-da çəkilirdi. O hadisə seek BİTMƏMİŞ (bəzən kadr hələ
 * dekod olunmamış) gəlir və iPhone Safari-də canvas-a qara kadr düşürdü.
 * İndi kadr yalnız `seeked`-dən SONRA çəkilir, qaranlıq kadr aşkar edilsə
 * videonun sonrakı nöqtələri sınanır və ən işıqlısı götürülür.
 */
export function extractVideoPoster(file) {
  return new Promise(resolve => {
    if (!file.type.startsWith('video/')) return resolve(null)

    const url   = URL.createObjectURL(file)
    const video = document.createElement('video')
    let settled = false
    let best = null          /* { blob, luma } */
    let attempt = 0

    const finish = (value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      video.onseeked = video.onloadedmetadata = video.onerror = null
      try { video.pause() } catch { /* boş ver */ }
      URL.revokeObjectURL(url)
      video.removeAttribute('src')
      try { video.load() } catch { /* boş ver */ }
      resolve(value)
    }

    /* Bəzi kodekləri (HEVC və s.) brauzer aça bilmir — sonsuz gözləmə olmasın.
       Vaxt bitəndə ən azı bir kadr alınıbsa o qaytarılır. */
    const timer = setTimeout(() => finish(best?.blob || null), 9000)

    video.muted       = true
    video.playsInline = true
    video.preload     = 'auto'
    video.setAttribute('playsinline', '')
    video.setAttribute('muted', '')

    /* Sınanacaq nöqtələr: əvvəl ~1 s, qaranlıqdırsa 25% və 50% */
    const points = () => {
      const d = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 2
      return [Math.min(1, d * 0.1), d * 0.25, d * 0.5]
    }

    const capture = () => new Promise(res => {
      const draw = () => {
        try {
          const scale = Math.min(1, 480 / Math.max(video.videoWidth, video.videoHeight))
          const w = Math.max(1, Math.round(video.videoWidth * scale))
          const h = Math.max(1, Math.round(video.videoHeight * scale))
          if (!video.videoWidth || !video.videoHeight) return res(null)
          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')
          ctx.drawImage(video, 0, 0, w, h)
          const luma = frameLuma(ctx, w, h)
          canvas.toBlob(b => res(b ? { blob: b, luma: luma ?? 255 } : null), 'image/jpeg', 0.8)
        } catch {
          res(null)
        }
      }
      /* Kadr ekrana həqiqətən çatandan sonra çək (dəstəklənirsə) */
      if (typeof video.requestVideoFrameCallback === 'function') {
        let done = false
        video.requestVideoFrameCallback(() => { if (!done) { done = true; draw() } })
        setTimeout(() => { if (!done) { done = true; draw() } }, 250)
      } else {
        setTimeout(draw, 60)
      }
    })

    video.onseeked = async () => {
      const shot = await capture()
      if (settled) return
      if (shot && (!best || shot.luma > best.luma)) best = shot
      const pts = points()
      if ((best && best.luma >= DARK_FRAME_LUMA) || attempt >= pts.length - 1) {
        return finish(best?.blob || null)
      }
      attempt += 1
      try { video.currentTime = pts[attempt] } catch { finish(best?.blob || null) }
    }

    video.onloadedmetadata = () => {
      /* iOS Safari səssiz play/pause olmadan kadrı dekod etməyə bilər */
      const p = video.play?.()
      if (p && typeof p.then === 'function') p.then(() => video.pause()).catch(() => {})
      try { video.currentTime = points()[0] } catch { finish(null) }
    }
    video.onerror = () => finish(best?.blob || null)

    video.src = url
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
