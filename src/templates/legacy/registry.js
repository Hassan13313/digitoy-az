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

   v3 — FOTOLU TOY SERİYASI (2026-11-12, istifadəçi: «köhnələr köhnə versiyada qalsın»)
   Köhnə toy şablonları cüt-cüt fotolu dizayna keçir. Keçən şablonun indiki (v2)
   kodu `v2/<id>/`-də DONDURULUR; həmin şablonla artıq yaradılmış dəvətnamə
   (templateVersion 2) o surətlə açılır, yeni sifariş 3 alır.
     • versiya ŞABLONA görədir: v3-ə keçməmiş şablonun yenisi yenə 2 alır, ona
       görə cütləri ayrı-ayrı canlıya çıxarmaq təhlükəsizdir;
     • siyahı serverlə eynidir: api/template_version.php › TV_V3_TEMPLATES
       (tests/template_versions_test.mjs yoxlayır);
     • dondurulmuş surət ortaq reyestrlərdən (tema, şrift, açılış mətni, hekayə
       teması) oxuyur — v3 dizaynı onları DƏYİŞMİR (adı və ruhu qalır), test bunu
       snapshot ilə qoruyur.
   ───────────────────────────────────────────────────────────────────────── */
export const TEMPLATE_VERSION_LEGACY = 1
export const TEMPLATE_VERSION_V2 = 2
/* Kataloqun ümumi «yeni» versiyası; şablonun öz həqiqi versiyası — currentVersionOf(id) */
export const TEMPLATE_VERSION_CURRENT = 2
export const TEMPLATE_VERSION_PHOTO = 3

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

/* v3-ə (fotolu dizayna) keçmiş şablonların dondurulmuş v2 surəti */
/* 2026-11-13: «toy-15» patch-i ilə fotolu dizayna keçən 15 şablon (Simple Luxury istisna) */
const FROZEN_V2 = {
  'royal-palace':    lazy(() => import('./v2/royal-palace')),
  'oriental-luxe':   lazy(() => import('./v2/oriental-luxe')),
  'night-sky':       lazy(() => import('./v2/night-sky')),
  'mediterranean':   lazy(() => import('./v2/mediterranean')),
  'crystal-glass':   lazy(() => import('./v2/crystal-glass')),
  'gazette':         lazy(() => import('./v2/gazette')),
  'royal-gold':      lazy(() => import('./v2/royal-gold')),
  'luxury-jewelry':  lazy(() => import('./v2/luxury-jewelry')),
  'floral-garden':   lazy(() => import('./v2/floral-garden')),
  'white-elegance':  lazy(() => import('./v2/white-elegance')),
  'nature-touch':    lazy(() => import('./v2/nature-touch')),
  'vinyl-record':    lazy(() => import('./v2/vinyl-record')),
  'cinema-premiere': lazy(() => import('./v2/cinema-premiere')),
  'boarding-pass':   lazy(() => import('./v2/boarding-pass')),
  'modern-black':    lazy(() => import('./v2/modern-black')),
  /* 2026-11-13: xına gecəsi 5-liyi fotolu dizayna keçdi */
  'red-veil':        lazy(() => import('./v2/red-veil')),
  'xonca':           lazy(() => import('./v2/xonca')),
  'henna-buta':      lazy(() => import('./v2/henna-buta')),
  'mirror-candle':   lazy(() => import('./v2/mirror-candle')),
  'kelagayi':        lazy(() => import('./v2/kelagayi')),
  /* 2026-11-13: sünnət toyu 5-liyi fotolu dizayna keçdi */
  'little-prince':   lazy(() => import('./v2/little-prince')),
  'hero-comic':      lazy(() => import('./v2/hero-comic')),
  'mashallah':       lazy(() => import('./v2/mashallah')),
  'little-pilot':    lazy(() => import('./v2/little-pilot')),
  'football-star':   lazy(() => import('./v2/football-star')),
}
/** v3-ə keçmiş şablonlar (server: api/template_version.php › TV_V3_TEMPLATES) */
export const V3_TEMPLATES = Object.freeze(Object.keys(FROZEN_V2))

const has = (map, id) => Object.prototype.hasOwnProperty.call(map, id)

/** Bu şablonun köhnə versiyası varmı (simple-luxury-də yoxdur — dəyişməyib) */
export function hasLegacyVersion(templateId) {
  return has(LEGACY, templateId) || has(FROZEN_V2, templateId)
}

/** Şablonun YENİ dəvətnaməyə yazılan versiyası: fotolu seriyaya keçibsə 3, yoxsa 2 */
export function currentVersionOf(templateId) {
  return has(FROZEN_V2, templateId) ? TEMPLATE_VERSION_PHOTO : TEMPLATE_VERSION_CURRENT
}

/** «Köhnə dizayna qaytar» hədəfi: v3-dən v2-yə, v2-dən v1-ə; yoxdursa null */
export function previousVersionOf(templateId) {
  if (has(FROZEN_V2, templateId)) return TEMPLATE_VERSION_V2
  return has(LEGACY, templateId) ? TEMPLATE_VERSION_LEGACY : null
}

/** Bu versiya dondurulmuş surətlə göstərilirmi */
export function isFrozenVersion(templateId, version) {
  const v = Number(version)
  if (v === TEMPLATE_VERSION_LEGACY) return has(LEGACY, templateId)
  if (v === TEMPLATE_VERSION_V2) return has(FROZEN_V2, templateId)
  return false
}

/** Dəvətnamə köhnə versiyada göstərilməlidirmi */
export function isLegacyInvitation(weddingData, templateId) {
  return isFrozenVersion(templateId, weddingData?.templateVersion)
}

/** Dəvətnamə v1 dondurmasındadırmı (v1-in öz şriftləri və _shared-i var) */
export function isV1Invitation(weddingData, templateId) {
  return Number(weddingData?.templateVersion) === TEMPLATE_VERSION_LEGACY && has(LEGACY, templateId)
}

export function getLegacyComponent(templateId, version = TEMPLATE_VERSION_LEGACY) {
  return Number(version) === TEMPLATE_VERSION_V2 ? FROZEN_V2[templateId] : LEGACY[templateId]
}
