/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN OVERRIDE QATI (Phase 42) — «Invitation Content Manager»-in beyni.

   NƏ ÜÇÜN VAR: builder dəvətnaməni yaradır, amma sonradan admin mətni,
   rəngi və ya şrifti düzəltmək istəyə bilər. Builder-ə toxunmaq olmaz
   (müştəri axını pozular), şablon fayllarına toxunmaq olmaz (dəyişiklik
   BÜTÜN dəvətnamələrə keçər). Ona görə bu qat var: dəyişikliklər YALNIZ
   həmin dəvətnamənin `form_data.admin` açarında saxlanılır və render anında
   şablonun üstünə qoyulur.

   ⚠ NƏYƏ TOXUNMUR (geriyə uyğunluq):
     • `form_data.admin` YOXDURSA hər şey əvvəlki kimidir — funksiyalar
       eyni obyekt referansını qaytarır, React remount etmir.
     • Builder, approval, slug, i18n / i18nMeta müqavilələri dəyişmir.
     • Bölmə görünürlüyü ÜÇÜN YENİ SAHƏ YARADILMIR: Phase 35-dən mövcud olan
       `form_data.sections` işlədilir (bax data/sections.js).

   ⚠ TƏHLÜKƏSİZLİK: bütün dəyərlər BURADA yoxlanılır (ağ siyahı + format).
   Admin paneldən gələn mətn birbaşa stilə düşmür — rəng yalnız hex ola
   bilər, şrift yalnız reyestrdəki ailə, ölçü yalnız dar diapazonda ədəd.
   Beləliklə override qatı CSS inyeksiya vektoru olmur.
   ───────────────────────────────────────────────────────────────────────── */

/* ⚠ UZANTI QƏSDƏN YAZILIB (`.js`): layihədə idxallar adətən uzantısızdır,
   çünki Vite onları özü həll edir. Amma node (tests/*.mjs) uzantı tələb edir
   və bu faylın MƏNTİQİ test edilməlidir — override qatı həm geriyə uyğunluğu,
   həm də admin panelindən gələn dəyərlərin təhlükəsizliyini qoruyur.
   `.js` hər iki mühitdə işləyir. */
import { FONT_STACKS } from '../templates/templateConfig.js'

/* Admin-in dəyişə bildiyi theme token-ləri (PART 4).
   ⚠ Bu siyahı QƏSDƏN dardır: `surface`, `muted`, `footerBg` kimi törəmə
   rənglər şablonun daxili ritmini qurur, onları açsaq admin asanlıqla
   oxunmaz kombinasiya yarada bilər. */
export const THEME_KEYS = ['primary', 'secondary', 'accent', 'background', 'text']

export const THEME_LABELS = {
  primary:    { az: 'Əsas rəng',    en: 'Primary',    ru: 'Основной' },
  secondary:  { az: 'İkinci rəng',  en: 'Secondary',  ru: 'Вторичный' },
  accent:     { az: 'Aksent',       en: 'Accent',     ru: 'Акцент' },
  background: { az: 'Fon',          en: 'Background', ru: 'Фон' },
  text:       { az: 'Mətn',         en: 'Text',       ru: 'Текст' },
}

/* Tipoqrafiya (PART 5) — ölçü DEYİL, ƏMSALdır.
   ⚠ Səbəb: şablonlarda ölçülər `clamp(15px, 4.4vw, 17px)` şəklindədir və
   responsiv davranış oradadır. Sabit piksel qoysaq mobil tipoqrafiya
   sınardı. Əmsal isə bütöv miqyası saxlayır — struktur pozulmur. */
export const FONT_SCALE_MIN = 0.85
export const FONT_SCALE_MAX = 1.25

/** Admin seçə bilən şrift ailələri (reyestrdən — ixtiyari ad qəbul edilmir) */
export const FONT_CHOICES = Object.keys(FONT_STACKS)

/* Content Manager-in bölmələri (PART 3).
   `key` → `TemplateShell`-in `sectionLabels` açarı ilə EYNİDİR, ona görə
   admin mətni birbaşa mövcud mexanizmə düşür — yeni render yolu yoxdur. */
export const CONTENT_SECTIONS = [
  { key: 'hero',      az: 'Hero',          en: 'Hero' },
  { key: 'countdown', az: 'Sayğac',        en: 'Countdown' },
  { key: 'venue',     az: 'Məkan / Xəritə', en: 'Location / Map' },
  { key: 'program',   az: 'Proqram',       en: 'Program' },
  { key: 'dresscode', az: 'Geyim kodu',    en: 'Dress code' },
  { key: 'seating',   az: 'Oturma planı',  en: 'Seating' },
  { key: 'gallery',   az: 'Qalereya / QR', en: 'Gallery / QR' },
  { key: 'rsvp',      az: 'İştirak təsdiqi', en: 'RSVP' },
  { key: 'guestbook', az: 'Qonaq dəftəri', en: 'Guestbook' },
  { key: 'footer',    az: 'Alt hissə',     en: 'Footer' },
]

const LANGS = ['az', 'en', 'ru']

/* ── Yoxlayıcılar ─────────────────────────────────────────────────────── */

const HEX_RE = /^#[0-9A-Fa-f]{6}$/

/** Hex rəng (`#RRGGBB`) — başqa formada null */
export function safeColor(v) {
  if (typeof v !== 'string') return null
  const s = v.trim()
  return HEX_RE.test(s) ? s.toUpperCase() : null
}

/** Şrift ailəsinin açarı → CSS stack (naməlum açarda null) */
export function safeFont(key) {
  return (typeof key === 'string' && FONT_STACKS[key]) ? key : null
}

/** Tipoqrafiya əmsalı — diapazondan kənar dəyər sərhədə sıxılır */
export function safeScale(v) {
  const n = Number(v)
  if (!Number.isFinite(n)) return null
  return Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, Math.round(n * 100) / 100))
}

/** Qısa mətn — kəsilir, kənar boşluqlar atılır (boş sətir = «override yoxdur») */
export function safeText(v, max = 160) {
  if (typeof v !== 'string') return null
  const s = v.replace(/\s+/g, ' ').trim()
  return s ? s.slice(0, max) : null
}

/* ── Normallaşdırma ───────────────────────────────────────────────────── */

/**
 * Admin panelindən və ya DB-dən gələn xam obyekti TƏMİZ override obyektinə
 * çevirir. Naməlum açarlar, yanlış formatlar SƏSSİZCƏ atılır.
 * Heç bir etibarlı dəyər qalmasa `null` qaytarır (yəni «override yoxdur»).
 */
export function normalizeOverrides(raw) {
  if (!raw || typeof raw !== 'object') return null
  const out = {}

  /* ── Rənglər ── */
  if (raw.theme && typeof raw.theme === 'object') {
    const t = {}
    for (const k of THEME_KEYS) {
      const c = safeColor(raw.theme[k])
      if (c) t[k] = c
    }
    if (Object.keys(t).length) out.theme = t
  }

  /* ── Şriftlər ── */
  if (raw.fonts && typeof raw.fonts === 'object') {
    const f = {}
    const h = safeFont(raw.fonts.heading)
    const b = safeFont(raw.fonts.body)
    const hs = safeScale(raw.fonts.headingScale)
    const bs = safeScale(raw.fonts.bodyScale)
    if (h) f.heading = h
    if (b) f.body = b
    /* 1 = dəyişiklik yoxdur → saxlamağın mənası yoxdur */
    if (hs && hs !== 1) f.headingScale = hs
    if (bs && bs !== 1) f.bodyScale = bs
    if (Object.keys(f).length) out.fonts = f
  }

  /* ── Bölmə mətnləri ── */
  if (raw.labels && typeof raw.labels === 'object') {
    const known = new Set(CONTENT_SECTIONS.map((s) => s.key))
    const L = {}
    for (const [key, val] of Object.entries(raw.labels)) {
      if (!known.has(key) || !val || typeof val !== 'object') continue
      const entry = {}

      const kick = safeText(val.kicker, 40)
      if (kick) entry.kicker = kick.toLocaleUpperCase('az')

      if (val.title && typeof val.title === 'object') {
        const title = {}
        for (const lang of LANGS) {
          const t = safeText(val.title[lang], 160)
          if (t) title[lang] = t
        }
        if (Object.keys(title).length) entry.title = title
      }

      if (Object.keys(entry).length) L[key] = entry
    }
    if (Object.keys(L).length) out.labels = L
  }

  return Object.keys(out).length ? out : null
}

/* ── Render tərəfi ────────────────────────────────────────────────────── */

/**
 * Şablonun theme-inin üstünə admin rənglərini və şriftlərini qoyur.
 * ⚠ Override yoxdursa EYNİ REFERANS qaytarılır → React remount etmir və
 * mövcud dəvətnamələrin render axını zərrə qədər dəyişmir.
 */
export function applyThemeOverrides(theme, overrides) {
  if (!theme || !overrides) return theme
  const { theme: colors, fonts } = overrides
  if (!colors && !fonts) return theme

  const out = { ...theme }
  if (colors) Object.assign(out, colors)

  if (fonts) {
    out.fonts = { ...(theme.fonts || {}) }
    if (fonts.heading) out.fonts.heading = FONT_STACKS[fonts.heading]
    if (fonts.body)    out.fonts.body    = FONT_STACKS[fonts.body]
    /* Əmsallar `TemplateShell`-də CSS dəyişəni kimi tətbiq olunur */
    if (fonts.headingScale) out.headingScale = fonts.headingScale
    if (fonts.bodyScale)    out.bodyScale    = fonts.bodyScale
  }
  return out
}

/**
 * Şablonun öz bölmə adları ilə admin-in yazdıqlarını birləşdirir.
 * Admin ÜSTÜNDÜR, amma yalnız doldurduğu dil/sahə üçün — qalanı şablonun
 * (və ya sistemin) öz mətnində qalır.
 */
export function mergeSectionLabels(templateLabels, overrides) {
  const admin = overrides && overrides.labels
  if (!admin) return templateLabels || null

  const out = { ...(templateLabels || {}) }
  for (const [key, entry] of Object.entries(admin)) {
    const base = out[key] || {}
    const next = { ...base }
    if (entry.kicker) next.kicker = entry.kicker
    if (entry.title) {
      const baseTitle = (base.title && typeof base.title === 'object') ? base.title : {}
      next.title = { ...baseTitle, ...entry.title }
    }
    out[key] = next
  }
  return out
}

/** `form_data`-dan təmizlənmiş override obyektini oxu (yoxdursa null) */
export function readOverrides(weddingData) {
  return normalizeOverrides(weddingData && weddingData.admin)
}
