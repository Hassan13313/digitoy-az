import { lazy } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
   KÖHNƏ ŞABLON VERSİYASI (v1) — 2026-10-28

   NƏ ÜÇÜN VAR: premium redizayn (v2) canlıya çıxanda artıq TƏSDİQLƏNMİŞ
   dəvətnamələr müştərinin seçdiyi köhnə görünüşdə qalmalıdır — dizaynı
   onların razılığı olmadan dəyişmək olmaz. Bu qovluq canlı versiyanın
   (c165f5c) şablon kodunun DONDURULMUŞ surətidir; admin dəvətnaməni
   «Yeni dizayna keçir» ilə v2-yə keçirənə qədər o, bu kodla göstərilir.

   Qayda (form_data.templateVersion):
     • 1 → bu qovluqdakı köhnə şablon
     • 2 və ya açar yoxdur → yeni şablon (builder, demo, kataloq həmişə yeni)
   Server (`api/template_version.php`) yeni dəvətnaməyə 2 yazır, köhnə
   sətirlərdə açar olmadığı üçün oxuyanda 1 qaytarır.

   ⚠ BU QOVLUQDAKI FAYLLARI REDAKTƏ ETMƏYİN — məqsəd köhnə görünüşü olduğu
   kimi saxlamaqdır. simple-luxury redizayn olunmayıb, onun versiyası yoxdur.
   ───────────────────────────────────────────────────────────────────────── */
export const TEMPLATE_VERSION_LEGACY = 1
export const TEMPLATE_VERSION_CURRENT = 2

const LEGACY = {
  'royal-gold':      lazy(() => import('./royal-gold')),
  'floral-garden':   lazy(() => import('./floral-garden')),
  'modern-black':    lazy(() => import('./modern-black')),
  'white-elegance':  lazy(() => import('./white-elegance')),
  'night-sky':       lazy(() => import('./night-sky')),
  'oriental-luxe':   lazy(() => import('./oriental-luxe')),
  'nature-touch':    lazy(() => import('./nature-touch')),
  'crystal-glass':   lazy(() => import('./crystal-glass')),
  'boarding-pass':   lazy(() => import('./boarding-pass')),
  'cinema-premiere': lazy(() => import('./cinema-premiere')),
  'vinyl-record':    lazy(() => import('./vinyl-record')),
  'royal-palace':    lazy(() => import('./royal-palace')),
  'mediterranean':   lazy(() => import('./mediterranean')),
  'gazette':         lazy(() => import('./gazette')),
  'luxury-jewelry':  lazy(() => import('./luxury-jewelry')),
}

/** Bu şablonun köhnə versiyası varmı (simple-luxury-də yoxdur — dəyişməyib) */
export function hasLegacyVersion(templateId) {
  return Object.prototype.hasOwnProperty.call(LEGACY, templateId)
}

/** Dəvətnamə köhnə versiyada göstərilməlidirmi */
export function isLegacyInvitation(weddingData, templateId) {
  return Number(weddingData?.templateVersion) === TEMPLATE_VERSION_LEGACY && hasLegacyVersion(templateId)
}

export function getLegacyComponent(templateId) {
  return LEGACY[templateId]
}
