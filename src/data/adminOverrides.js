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
import { OPENING_SLOT_LABELS } from '../templates/_shared/openingSpec.js'

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
  /* `hint` (Phase 45) — admin panelində kartın altında: sahənin NƏYİ əvəz etdiyi */
  { key: 'hero',      az: 'Hero',          en: 'Hero',
    hint: 'Üst etiket — tədbir adının (məs. «TOY») yerinə; başlıq — böyük adlar sətrinin yerinə.' },
  { key: 'countdown', az: 'Sayğac',        en: 'Countdown' },
  { key: 'venue',     az: 'Məkan / Xəritə', en: 'Location / Map' },
  { key: 'program',   az: 'Proqram',       en: 'Program' },
  { key: 'dresscode', az: 'Geyim kodu',    en: 'Dress code' },
  { key: 'seating',   az: 'Oturma planı',  en: 'Seating' },
  { key: 'gallery',   az: 'Qalereya / QR', en: 'Gallery / QR' },
  { key: 'rsvp',      az: 'İştirak təsdiqi', en: 'RSVP' },
  { key: 'guestbook', az: 'Qonaq dəftəri', en: 'Guestbook' },
  { key: 'footer',    az: 'Alt hissə',     en: 'Footer',
    hint: 'Başlıq — ən altdakı adlar sətri; üst etiket — ən alt imza sətri.' },
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
    ['seating.again',     '«Yenidən axtar» düyməsi'],
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

/** `max` SİMVOLA qədər kəs — emoji (surrogate cütü) yarıdan bölünmür.
    ⚠ `.slice()` UTF-16 vahidi sayır və emojini ortadan kəsə bilərdi: yarım
    surrogate JSON-da `\ud83d` kimi gedir və PHP `json_decode` BÜTÜN sorğunu
    rədd edir. Server `mb_substr` ilə kod nöqtəsi sayır — indi ikisi eynidir. */
function cutChars(s, max) {
  if (s.length <= max) return s
  const cps = Array.from(s)
  return cps.length > max ? cps.slice(0, max).join('') : s
}

/** Qısa mətn — kəsilir, kənar boşluqlar atılır (boş sətir = «override yoxdur») */
export function safeText(v, max = 160) {
  if (typeof v !== 'string') return null
  const s = v.replace(/\s+/g, ' ').trim()
  return s ? cutChars(s, max) : null
}

/** Uzun mətn (hekayə fəsli) — SƏTİR SONLARI QORUNUR, çünki dəvətnamədə
    `white-space: pre-line` ilə göstərilir. Nəzarət simvolları atılır,
    ardıcıl 2-dən çox boş sətir ikiyə endirilir. */
/* Sətir sonundan (\n) başqa nəzarət simvolları — regex literalı əvəzinə kod
   aralığı ilə (ESLint `no-control-regex`) */
function stripControls(s) {
  let out = ''
  for (const ch of s) {
    const c = ch.charCodeAt(0)
    out += (c === 10 || (c >= 32 && c !== 127)) ? ch : ' '
  }
  return out
}

export function safeLongText(v, max = 1500) {
  if (typeof v !== 'string') return null
  const s = stripControls(v.replace(/\r\n?/g, '\n'))
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return s ? cutChars(s, max) : null
}

/* ── Şəkil ünvanları (Phase 45) ──
   Yalnız serverin ÖZÜNÜN yaratdığı fayl adları qəbul edilir:
     • `/uploads/_admin/<slug>/<sha1>.jpg|png`  — admin yükləməsi
     • `/uploads/_story/<bucket>/<sha1>.jpg`     — builder hekayə şəkli
   Başqa host, `data:`, `javascript:`, `../` — hamısı rədd. */
const ADMIN_IMG_RE = /^\/uploads\/_admin\/[A-Za-z0-9-]{1,120}\/[a-f0-9]{20}\.(?:jpg|png)$/
const STORY_IMG_RE = /^\/uploads\/_story\/[a-f0-9]{24}\/[a-f0-9]{20}\.jpg$/

export function safeAdminImage(v) {
  return (typeof v === 'string' && ADMIN_IMG_RE.test(v)) ? v : null
}

export function safeStoryImage(v) {
  return (typeof v === 'string' && (ADMIN_IMG_RE.test(v) || STORY_IMG_RE.test(v))) ? v : null
}

/** {az,en,ru} mətn qovası — heç bir dil dolu deyilsə null */
function langBucket(raw, clean) {
  if (!raw || typeof raw !== 'object') return null
  const out = {}
  for (const lang of LANGS) {
    const t = clean(raw[lang])
    if (t) out[lang] = t
  }
  return Object.keys(out).length ? out : null
}

/* ── Açılış ekranı (Phase 45) ──
   { mono: { mode, value?, image? }, text: { slot: {az,en,ru} }, hide: [slot] }
   ⚠ Rejim 'auto' SAXLANILMIR — açarın olmaması elə avtomatik deməkdir. */
export const OPENING_SLOT_KEYS = Object.keys(OPENING_SLOT_LABELS)
const OPENING_SLOT_SET = new Set(OPENING_SLOT_KEYS)
export const MONO_MODES = ['none', 'text', 'sticker', 'image']
export const MONO_TEXT_MAX = 12
export const MONO_STICKER_MAX = 16

export function normalizeOpening(raw) {
  if (!raw || typeof raw !== 'object') return null
  const out = {}

  const m = raw.mono
  if (m && typeof m === 'object' && MONO_MODES.includes(m.mode)) {
    if (m.mode === 'none') out.mono = { mode: 'none' }
    else if (m.mode === 'image') {
      const img = safeAdminImage(m.image)
      if (img) out.mono = { mode: 'image', image: img }
    } else {
      const v = safeText(m.value, m.mode === 'text' ? MONO_TEXT_MAX : MONO_STICKER_MAX)
      if (v) out.mono = { mode: m.mode, value: v }
    }
  }

  if (raw.text && typeof raw.text === 'object') {
    const T = {}
    for (const [slot, val] of Object.entries(raw.text)) {
      if (!OPENING_SLOT_SET.has(slot)) continue
      const b = langBucket(val, (x) => safeText(x, 140))
      if (b) T[slot] = b
    }
    if (Object.keys(T).length) out.text = T
  }

  if (Array.isArray(raw.hide)) {
    const H = [...new Set(raw.hide.filter((k) => OPENING_SLOT_SET.has(k)))]
    if (H.length) out.hide = H
  }

  return Object.keys(out).length ? out : null
}

/* ── «Bizim Hekayəmiz» (Phase 45) ──
   {
     text: { kicker|title|sub|next|end|endSub|kpre|photo: {az,en,ru} },
     ch:   { c0: { title, text, caption: {az,en,ru}, date, icon, photos, hide } },
     add:  [ { id, title, text, caption, date, icon, photos } ]   ← admin-in öz fəsilləri
   }
   ⚠ Builder-in `loveStory` massivinə TOXUNULMUR — override render anında
   üstünə qoyulur (bax `applyStoryOverrides`), «Hamısını sıfırla» ilə hər şey
   müştərinin yazdığına qayıdır.
   ⚠ Fəsil açarı `c<indeks>`-dir (rəqəm deyil): PHP `{"0":…}` obyektini
   massivə çevirib `[…]` kimi geri yazır, prefiks bunun qarşısını alır.
   ⚠ `photos` elementləri: rəqəm = builder şəklinin indeksi (şəkli təkrar
   saxlamırıq, Phase 43-ün data URI şəkilləri də belə qorunur), sətir = yeni
   yüklənmiş şəklin ünvanı.
   ⚠ `date`/`icon` üçün `false` = «müştərininkini gizlət». */
export const STORY_TEXT_KEYS = ['kicker', 'title', 'sub', 'next', 'end', 'endSub', 'kpre', 'photo']
export const STORY_MAX_CHAPTERS = 12
export const STORY_MAX_PHOTOS = 6
const CH_KEY_RE = /^c(?:[0-9]|[1-2][0-9])$/
const ADD_ID_RE = /^[A-Za-z0-9_-]{1,40}$/

function normalizeChapter(raw, { allowIndex }) {
  if (!raw || typeof raw !== 'object') return null
  const c = {}
  const title   = langBucket(raw.title,   (x) => safeText(x, 160))
  const text    = langBucket(raw.text,    (x) => safeLongText(x, 1500))
  const caption = langBucket(raw.caption, (x) => safeText(x, 80))
  if (title) c.title = title
  if (text) c.text = text
  if (caption) c.caption = caption

  if (raw.date === false) c.date = false
  else { const d = safeText(raw.date, 60); if (d) c.date = d }
  if (raw.icon === false) c.icon = false
  else { const i = safeText(raw.icon, MONO_STICKER_MAX); if (i) c.icon = i }

  if (Array.isArray(raw.photos)) {
    const P = []
    for (const p of raw.photos) {
      if (P.length >= STORY_MAX_PHOTOS) break
      if (allowIndex && Number.isInteger(p) && p >= 0 && p < STORY_MAX_PHOTOS) { if (!P.includes(p)) P.push(p); continue }
      const url = safeStoryImage(p)
      if (url && !P.includes(url)) P.push(url)
    }
    c.photos = P   /* boş massiv də mənalıdır: «bütün şəkilləri gizlət» */
  }

  if (allowIndex && raw.hide === true) c.hide = true
  return c
}

export function normalizeStory(raw) {
  if (!raw || typeof raw !== 'object') return null
  const out = {}

  if (raw.text && typeof raw.text === 'object') {
    const T = {}
    for (const key of STORY_TEXT_KEYS) {
      const b = langBucket(raw.text[key], (x) => safeText(x, 200))
      if (b) T[key] = b
    }
    if (Object.keys(T).length) out.text = T
  }

  if (raw.ch && typeof raw.ch === 'object' && !Array.isArray(raw.ch)) {
    const CH = {}
    for (const [key, val] of Object.entries(raw.ch)) {
      if (!CH_KEY_RE.test(key)) continue
      const c = normalizeChapter(val, { allowIndex: true })
      if (c && Object.keys(c).length) CH[key] = c
    }
    if (Object.keys(CH).length) out.ch = CH
  }

  if (Array.isArray(raw.add)) {
    const A = []
    for (const val of raw.add) {
      if (A.length >= STORY_MAX_CHAPTERS) break
      const c = normalizeChapter(val, { allowIndex: false })
      if (!c) continue
      if (c.date === false) delete c.date
      if (c.icon === false) delete c.icon
      /* Tamamilə boş yeni fəsil saxlanılmır (dəvətnamədə onsuz da görünməzdi) */
      if (!c.title && !c.text && !(c.photos && c.photos.length)) continue
      c.id = (typeof val.id === 'string' && ADD_ID_RE.test(val.id)) ? val.id : `adm_${A.length}`
      A.push(c)
    }
    if (A.length) out.add = A
  }

  return Object.keys(out).length ? out : null
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

  /* ── Açılış ekranı və hekayə (Phase 45) ── */
  const opening = normalizeOpening(raw.opening)
  if (opening) out.opening = opening
  const story = normalizeStory(raw.story)
  if (story) out.story = story

  return Object.keys(out).length ? out : null
}

/* ── Hekayənin tətbiqi (Phase 45) ─────────────────────────────────────────
   `TemplateRenderer` bunu BÜTÜN şablonlardan əvvəl çağırır — 16 şablonun
   heç biri override-dan xəbərsiz qalmır (3 xüsusi şablon da daxil).

   Dil zənciri (hər mətn sahəsi üçün):
     admin-in aktiv dildəki mətni
     → (EN/RU-da) dəvətnamənin ÖZ tərcüməsi (i18n/lüğət), əgər varsa
     → admin-in AZ mətni
     → müştərinin mətni
   ⚠ Override YOXDURSA eyni referans qayıdır → React remount etmir. */
function photosOf(row) {
  if (!row || typeof row !== 'object') return []
  if (Array.isArray(row.photos)) return row.photos
  return row.photo ? [row.photo] : []
}

/**
 * @param {object} wd        resolveWeddingContent()-dən keçmiş (tərcümə olunmuş) data
 * @param {object|null} story normalizeStory() nəticəsi
 * @param {string} lang
 * @param {object} original  tərcüməsiz orijinal (AZ) data — «tərcümə varmı?» yoxlaması üçün
 */
export function applyStoryOverrides(wd, story, lang = 'az', original = wd) {
  if (!wd || !story || (!story.ch && !story.add)) return wd

  const base = Array.isArray(wd.loveStory) ? wd.loveStory : []
  const orig = Array.isArray(original && original.loveStory) ? original.loveStory : base

  const pick = (ov, localized, source) => {
    if (!ov) return localized
    if (ov[lang]) return ov[lang]
    if (lang !== 'az' && localized && localized !== source) return localized
    return ov.az || localized
  }

  const out = []
  base.forEach((row, i) => {
    const o = story.ch && story.ch['c' + i]
    if (!o || !row || typeof row !== 'object') { out.push(row); return }
    if (o.hide) return
    const src = (orig[i] && typeof orig[i] === 'object') ? orig[i] : row
    const next = { ...row }
    for (const f of ['title', 'text', 'caption']) {
      if (o[f]) next[f] = pick(o[f], row[f], src[f])
    }
    if (o.date === false) next.date = ''
    else if (o.date) next.date = o.date
    if (o.icon === false) next.icon = ''
    else if (o.icon) next.icon = o.icon
    if (Array.isArray(o.photos)) {
      const own = photosOf(src)
      next.photos = o.photos.map((p) => (typeof p === 'number' ? own[p] : p)).filter(Boolean)
      delete next.photo
    }
    out.push(next)
  })

  const fresh = (ov) => (ov ? (ov[lang] || ov.az || '') : '')
  for (const a of story.add || []) {
    out.push({
      id: a.id, title: fresh(a.title), text: fresh(a.text), caption: fresh(a.caption),
      date: a.date || '', icon: a.icon || '', photos: a.photos || [],
    })
  }

  return { ...wd, loveStory: out }
}

/**
 * Hekayə bölməsinin öz mətnləri (başlıq, alt başlıq, son sətirlər) üzərinə
 * admin mətnini qoyur. Qayda `withStringOverrides` ilə eynidir:
 * aktiv dil → AZ → şablonun öz mətni.
 * @param {object} copy   getStoryCopy() nəticəsi
 * @param {object|null} texts  story.text
 */
export function storyCopyWithOverrides(copy, texts, lang = 'az') {
  if (!texts) return copy
  const out = { ...copy }
  for (const key of STORY_TEXT_KEYS) {
    const e = texts[key]
    const v = e && (e[lang] || e.az)
    if (v) out[key] = v
  }
  return out
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

/**
 * Bölmə adı həlledicisi: `L(key, field, fallback)`. Admin (və ya şablon) o
 * sahəni doldurmayıbsa `fallback` — yəni əvvəlki mətn — qayıdır.
 * Fallback zənciri: aktiv dil → AZ → fallback. Sətir dəyəri (kicker) hər
 * dildə eynidir. TemplateShell və 3 xüsusi şablon eyni qaydanı işlədir.
 */
export function makeLabelResolver(sectionLabels, lang) {
  return (key, field, fallback) => {
    const v = sectionLabels?.[key]?.[field]
    if (!v) return fallback
    if (typeof v === 'string') return v
    return v[lang] || v.az || fallback
  }
}

/** Bölmənin admin adları `{ kicker, title }` — yazılmayan sahə `null`-dır və
    komponent öz mətnini göstərir (TemplateOutro `footer`, simple-luxury bölmələri). */
export function sectionHead(L, key) {
  return { kicker: L(key, 'kicker', null), title: L(key, 'title', null) }
}

/** `form_data`-dan təmizlənmiş override obyektini oxu (yoxdursa null) */
export function readOverrides(weddingData) {
  return normalizeOverrides(weddingData && weddingData.admin)
}
