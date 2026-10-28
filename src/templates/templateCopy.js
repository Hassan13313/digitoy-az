/* ─────────────────────────────────────────────────────────────────────────────
   ŞABLON MƏTNLƏRİNİN REYESTRİ (2026-10-28) — admin «Mətnlər» tabı üçün

   Hər premium şablonun `copy.js` faylı (LABELS + TXT + FIELDS) burada
   toplanır. Admin paneli buradan:
     • şablonun ÖZ bölmə başlıqlarını placeholder kimi göstərir,
     • yalnız həmin şablona aid sətirlərin sahələrini qurur.
   Override qatı (`data/adminOverrides.js`) bu açarları ağ siyahıya əlavə edir.

   ⚠ Şablon komponentləri bu faylı İDXAL ETMİR (hər biri yalnız öz copy.js-ini
   yükləyir) — reyestr şablon chunk-larına düşmür.
   ⚠ React YOXDUR, uzantılar qəsdən yazılıb — node testləri birbaşa yükləyir.
   ───────────────────────────────────────────────────────────────────────── */
import { copyPrefix } from './_shared/copyText.js'
import * as orientalLuxe from './oriental-luxe/copy.js'
import * as whiteElegance from './white-elegance/copy.js'
import * as vinylRecord from './vinyl-record/copy.js'
import * as royalPalace from './royal-palace/copy.js'
import * as crystalGlass from './crystal-glass/copy.js'
import * as luxuryJewelry from './luxury-jewelry/copy.js'
import * as natureTouch from './nature-touch/copy.js'
import * as boardingPass from './boarding-pass/copy.js'
import * as cinemaPremiere from './cinema-premiere/copy.js'
import * as gazette from './gazette/copy.js'
import * as mediterranean from './mediterranean/copy.js'
import * as nightSky from './night-sky/copy.js'
import * as modernBlack from './modern-black/copy.js'

const REGISTRY = {
  'oriental-luxe': orientalLuxe,
  'white-elegance': whiteElegance,
  'vinyl-record': vinylRecord,
  'royal-palace': royalPalace,
  'crystal-glass': crystalGlass,
  'luxury-jewelry': luxuryJewelry,
  'nature-touch': natureTouch,
  'boarding-pass': boardingPass,
  'cinema-premiere': cinemaPremiere,
  'gazette': gazette,
  'mediterranean': mediterranean,
  'night-sky': nightSky,
  'modern-black': modernBlack,
}

/** Şablonun öz bölmə başlıqları `{ countdown: { title: {az,en,ru} } … }` (yoxdursa null) */
export function templateLabels(templateId) {
  return REGISTRY[templateId]?.LABELS || null
}

/**
 * Şablonun admin sahələri, FIELDS sırası ilə:
 * `[{ key: 'tpl_boarding_pass.pax', section: 'hero', label, hint, defaults: {az,en,ru} }]`
 */
export function templateCopyFields(templateId) {
  const mod = REGISTRY[templateId]
  if (!mod) return []
  const prefix = copyPrefix(templateId)
  return mod.FIELDS.map(([k, section, label, hint]) => ({
    key: prefix + k,
    section,
    label,
    hint: hint || null,
    defaults: { az: mod.TXT.az[k], en: mod.TXT.en[k], ru: mod.TXT.ru[k] },
  }))
}

/** Bütün şablonların admin açarları — override qatının ağ siyahısı üçün */
export const TEMPLATE_COPY_KEYS = new Set(
  Object.keys(REGISTRY).flatMap((id) => templateCopyFields(id).map((f) => f.key)),
)
