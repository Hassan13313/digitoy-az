/* ─────────────────────────────────────────────────────────────────────────────
   GEO — Location bölməsinin xəritə hesablamaları (komponent deyil).

   ⚠ YENİ DATA SAHƏSİ YOXDUR: koordinatlar mövcud `wazeUrl` (`?ll=lat,lng`)
   və ya `googleMapsUrl` içindən oxunur → builder/DB/API toxunulmur.
   ───────────────────────────────────────────────────────────────────────── */

/** Waze / Google Maps URL-dən [lat, lon] çıxar (tapılmasa null) */
export function parseLatLon(weddingData) {
  const tryUrl = (url) => {
    if (typeof url !== 'string' || !url) return null
    const pats = [
      /[?&]ll=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,     // waze ?ll=
      /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,           // google @lat,lng
      /[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,      // google ?q=
      /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,       // google !3d!4d
    ]
    for (const re of pats) {
      const m = url.match(re)
      if (!m) continue
      const lat = parseFloat(m[1]), lon = parseFloat(m[2])
      if (Number.isFinite(lat) && Number.isFinite(lon) &&
          Math.abs(lat) <= 85 && Math.abs(lon) <= 180) return [lat, lon]
    }
    return null
  }
  return tryUrl(weddingData?.wazeUrl) || tryUrl(weddingData?.googleMapsUrl)
}

/** Slippy-map proyeksiyası: lat/lon → kəsr tile koordinatları */
export function toTile(lat, lon, z) {
  const n = 2 ** z
  const x = ((lon + 180) / 360) * n
  const r = (lat * Math.PI) / 180
  const y = ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n
  return [x, y]
}

/** Hex + alpha → rgba (theme token üzərində şəffaflıq) */
export function alpha(hex, a) {
  const h = String(hex || '').replace('#', '')
  if (h.length !== 6) return hex
  const n = parseInt(h, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

/* ── Kontrast köməkçiləri ──────────────────────────────────────────────────
   NƏ ÜÇÜN: ortaq komponentlər (məs. sifariş CTA-sı) 9 fərqli theme ilə
   render olunur. Bəzi şablonlarda `accent` fon rənginə çox yaxındır
   (simple-luxury: krem üzərində açıq qızıl → 1.2:1, oxunmur). Rəngi sabit
   seçmək əvəzinə hesablayırıq: aksent kifayət qədər kontrastlıdırsa qalır,
   deyilsə mətn rənginə düşür. Beləliklə hər şablon öz dilində qalır, amma
   heç bir yerdə görünməz mətn yaranmır. */
function toRgb(hex) {
  const h = String(hex || '').replace('#', '')
  if (h.length !== 6) return null
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function luminance(rgb) {
  const f = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
  return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2])
}

/** İki hex rəng arasında WCAG kontrast nisbəti (hesablana bilmirsə 0) */
export function contrast(fg, bg) {
  const a = toRgb(fg), b = toRgb(bg)
  if (!a || !b) return 0
  const l1 = luminance(a), l2 = luminance(b)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

/** `preferred` fonda oxunursa onu, oxunmursa `fallback`-i qaytarır */
export function readableOn(bg, preferred, fallback, min = 4.5) {
  return contrast(preferred, bg) >= min ? preferred : fallback
}
