import { PHOTOS as candleRings } from './candle-rings/photos.js'
import { PHOTOS as bridalVeil } from './bridal-veil/photos.js'
import { PHOTOS as firstDance } from './first-dance/photos.js'
import { PHOTOS as ivorySilk } from './ivory-silk/photos.js'
import { PHOTOS as bakuNight } from './baku-night/photos.js'
import { PHOTOS as goldenHour } from './golden-hour/photos.js'
import { PHOTOS as shahdag } from './shahdag/photos.js'

/* ─────────────────────────────────────────────────────────────────────────────
   ŞABLONUN ŞƏKİL YERLƏRİ (2026-11) — admin «Şəkillər» tabı

   Foto ilə qurulmuş şablonlarda hər şəkil yeri (`<şablon>/photos.js › PHOTOS`)
   admin paneldən gizlədilə və ya başqa şəkillə əvəz edilə bilər.
   Model: `admin.images = { <açar>: { hide: true } | { src: '/uploads/_admin/…' } }`
   — həm şablon səviyyəsində («Şablonlar»), həm dəvətnamədə («Məzmun»).
   Açar yoxdursa şablonun öz fotosu göstərilir (davranış dəyişmir).
   ───────────────────────────────────────────────────────────────────────── */

const REGISTRY = {
  'candle-rings': candleRings,
  'bridal-veil': bridalVeil,
  'first-dance': firstDance,
  'ivory-silk': ivorySilk,
  'baku-night': bakuNight,
  'golden-hour': goldenHour,
  shahdag,
}

/** Bütün şablonların şəkil açarları — admin datasının ağ siyahısı */
export const TEMPLATE_PHOTO_KEYS = new Set(Object.values(REGISTRY).flat().map((p) => p.key))

/** Şablonun şəkil yerləri ([] — şəkil tabı yoxdur) */
export function templatePhotoSlots(templateId) {
  return REGISTRY[templateId] || []
}

/**
 * Hər yer üçün göstəriləcək şəkil: admin şəkli → şablonun fotosu; gizlədilibsə null.
 * `images` — normalizeOverrides-dən keçmiş `admin.images` (və ya null).
 */
export function resolvePhotos(slots, images) {
  const out = {}
  for (const p of slots) {
    const o = images?.[p.key]
    out[p.key] = o?.hide ? null : (o?.src || p.src)
  }
  return out
}

/** Admin bu yerə öz şəklini qoyub? (fotoya bağlı effektlər — məs. qığılcım yeri — söndürülür) */
export function isCustomPhoto(images, key) {
  return !!images?.[key]?.src
}
