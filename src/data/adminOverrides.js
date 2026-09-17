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

/* ─────────────────────────────────────────────────────────────────────────
   MƏTN KATALOQU (Phase 42.1 · #7)

   Dəvətnamədə istifadəçinin GÖRDÜYÜ hər sətir. Admin panel bunları bölmə-
   bölmə göstərir. Açarlar İKİ mənbədəndir:
     • prefikssiz  → `translations.js` açarı (`tr.inv_location`)
     • `rsvp.` / `gbook.` / `seating.` → həmin hook-un öz etiket obyekti
       (məs. `useRsvp` öz daxili lüğətini saxlayır, translations.js-də deyil)

   ⚠ BURAYA SİSTEM MƏTNİ YAZILMIR: API cavabları, xəta kodları, admin daxili
   texniki mətnlər kataloqda YOXDUR — yalnız qonağın gördüyü sətirlər.
   ───────────────────────────────────────────────────────────────────────── */
export const STRING_CATALOG = {
  hero: [
    ['inv_join',          'Giriş cümləsi'],
    ['inv_and',           '«və» bağlayıcısı'],
    ['organizer_display', 'İmza («Hörmətlə»)'],
    ['event_toy',         'Tədbir adı — toy'],
    ['event_nishan',      'Tədbir adı — nişan'],
    ['event_birthday',    'Tədbir adı — ad günü'],
    ['event_corporate',   'Tədbir adı — korporativ'],
    ['event_other',       'Tədbir adı — digər'],
  ],
  venue: [
    ['inv_location',        'Bölmə adı'],
    ['inv_directions_btn',  'Düymə — yol göstər'],
  ],
  dresscode: [
    ['inv_dresscode', 'Bölmə adı'],
  ],
  seating: [
    ['seating.title',     'Başlıq'],
    ['seating.sub',       'Alt mətn'],
    ['seating.hint',      'İpucu'],
    ['inv_seat_fullname', 'Ad sahəsi'],
  ],
  gallery: [
    ['inv_gallery',       'Bölmə adı'],
    ['inv_gallery_desc',  'İzah'],
    ['inv_gallery_btn',   'Düymə'],
    ['inv_scan_upload',   'QR izahı'],
  ],
  rsvp: [
    ['rsvp.title',        'Sual'],
    ['rsvp.subtitle',     'Alt mətn'],
    ['rsvp.namePh',       'Ad sahəsi'],
    ['rsvp.yes',          'Cavab — gələcəyəm'],
    ['rsvp.maybe',        'Cavab — dəqiq deyil'],
    ['rsvp.no',           'Cavab — gəlməyəcəyəm'],
    ['rsvp.plusq',        'Əlavə qonaq sualı'],
    ['rsvp.send',         'Göndər düyməsi'],
    ['rsvp.thanks_sub',   'Təşəkkür mətni'],
    ['rsvp.already_done', 'Artıq cavablanıb'],
    ['rsvp.not_in_list',  'Siyahıda yoxdur'],
    ['rsvp_closed_title', 'Bağlıdır — başlıq'],
    ['rsvp_closed_desc',  'Bağlıdır — izah'],
  ],
  guestbook: [
    ['gbook.title',   'Başlıq'],
    ['gbook.namePh',  'Ad sahəsi'],
    ['gbook.msgPh',   'Mesaj sahəsi'],
    ['gbook.btn',     'Göndər düyməsi'],
    ['gbook.sending', 'Göndərilir…'],
  ],
  footer: [
    ['btn_back', 'Geri düyməsi'],
  ],
}

/** Kataloqdakı bütün açarlar (yoxlama üçün düz siyahı) */
export const STRING_KEYS = Object.values(STRING_CATALOG).flat().map(([k]) => k)

const STRING_KEY_SET = new Set(STRING_KEYS)


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

  /* ── Mətn override-ları (Phase 42.1) ── */
  if (raw.strings && typeof raw.strings === 'object') {
    const S = {}
    for (const [key, val] of Object.entries(raw.strings)) {
      /* ⚠ Yalnız KATALOQDAKI açarlar: ixtiyari açar qəbul etsək admin
         sistem mətnini də əvəz edə bilərdi. */
      if (!STRING_KEY_SET.has(key) || !val || typeof val !== 'object') continue
      const bucket = {}
      for (const lang of LANGS) {
        const t = safeText(val[lang], 400)
        if (t) bucket[lang] = t
      }
      if (Object.keys(bucket).length) S[key] = bucket
    }
    if (Object.keys(S).length) out.strings = S
  }

  return Object.keys(out).length ? out : null
}

/* ── Mətn tətbiqi ─────────────────────────────────────────────────────────
   Çağırış nöqtələri DƏYİŞMİR: `tr.inv_location` kimi ~38 yer var, hər birini
   əl ilə sarımaq həm riskli, həm baxımsız olardı. Əvəzinə obyektin özü nazik
   `Proxy` ilə örtülür.

   ⚠ Override yoxdursa Proxy YARADILMIR — EYNİ referans qayıdır, yəni mövcud
   dəvətnamələrin render axını toxunulmaz qalır. */

/**
 * @param {object} base    orijinal etiket obyekti (`t[lang]`, `rsvp.labels`…)
 * @param {object} strings `overrides.strings`
 * @param {string} lang    aktiv dil
 * @param {string} prefix  hook etiketləri üçün ('rsvp.', 'gbook.', 'seating.')
 */
export function withStringOverrides(base, strings, lang, prefix = '') {
  if (!base || !strings) return base

  /* Bu obyektə aid ən azı bir override varmı? Yoxdursa sarımırıq. */
  let relevant = false
  for (const k of Object.keys(strings)) {
    if (prefix ? k.startsWith(prefix) : !k.includes('.')) { relevant = true; break }
  }
  if (!relevant) return base

  return new Proxy(base, {
    get(target, key) {
      if (typeof key !== 'string') return target[key]
      const entry = strings[prefix + key]
      /* Fallback zənciri: aktiv dil → AZ → orijinal */
      const value = entry && (entry[lang] || entry.az)
      return value || target[key]
    },
  })
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
