/* ─────────────────────────────────────────────────────────────────────────────
   AÇILIŞ EKRANI — MƏTNLƏR VƏ MONOQRAM (Phase 45)

   NƏ ÜÇÜN: 16 şablonun hər birinin açılış ekranı öz mətnlərini birbaşa
   markup-da yazırdı («Dəvətnaməni aç», «toxunun», «Dəvətnamə», «Premyera»…).
   Nəticədə:
     • admin bu mətnləri dəyişə bilmirdi,
     • EN/RU dəvətnamədə açılış ekranı yenə Azərbaycanca qalırdı,
     • korporativ/digər tədbirdə monoqram kvadratına tədbir adının ilk hərfi
       düşürdü («Əliyev Turqayın kiçik toyu» → «Ə»).
   Bu fayl həmin mətnlərin TƏK MƏNBƏYİDİR: şablon da, admin panelinin
   «Açılış» redaktoru da defolt mətni buradan oxuyur — admin placeholder-da
   dəvətnamədə görünən mətnin EYNİSİNİ görür.

   ⚠ AZ MƏTNLƏR DƏYİŞMƏYİB: hər defolt əvvəlki markup-dakı sətirlə hərfbəhərf
   eynidir. İki istisna — ikisi də düzəlişdir:
     • Gazette rubrikası toy olmayan tədbirdə «Toy elanı» yazırdı.
     • Royal Gold / Floral Garden açılışında tarix həmişə AZ dilində idi.
   ⚠ React YOXDUR — node testləri bu faylı birbaşa yükləyir.
   ───────────────────────────────────────────────────────────────────────── */
import { formatFullDateByLang, formatTime24 } from '../../utils/dateFormat.js'
import { parseLatLon } from './geo.js'

/* ── Sabit ifadələr (AZ/EN/RU) ── */
export const OPENING_PHRASES = {
  open:         { az: 'Dəvətnaməni aç',          en: 'Open the invitation',     ru: 'Открыть приглашение' },
  openShort:    { az: 'Dəvəti aç',               en: 'Open invitation',         ru: 'Открыть приглашение' },
  tap:          { az: 'toxunun',                 en: 'tap to open',             ru: 'коснитесь' },
  invitation:   { az: 'Dəvətnamə',               en: 'Invitation',              ru: 'Приглашение' },
  checkin:      { az: 'Check-in et',             en: 'Check in',                ru: 'Пройти регистрацию' },
  premiere:     { az: 'Premyera',                en: 'Premiere',                ru: 'Премьера' },
  openPremiere: { az: 'Premyeranı aç',           en: 'Start the premiere',      ru: 'Начать премьеру' },
  lifeFilm:     { az: 'bir ömürlük film',        en: 'a film for a lifetime',   ru: 'фильм длиною в жизнь' },
  playRecord:   { az: 'Plyonkanı işə sal',       en: 'Play the record',         ru: 'Включить пластинку' },
  readIssue:    { az: 'Buraxılışı oxu',          en: 'Read the issue',          ru: 'Читать выпуск' },
  specialEd:    { az: 'Xüsusi buraxılış',        en: 'Special edition',         ru: 'Специальный выпуск' },
  openBox:      { az: 'Qutunu aç',               en: 'Open the box',            ru: 'Открыть шкатулку' },
  skyNight:     { az: 'O gecə göy belə görünürdü', en: 'This is how the sky looked that night', ru: 'Таким было небо в ту ночь' },
  enterEvent:   { az: 'Tədbirə daxil olun',      en: 'Enter the event',         ru: 'Перейти к событию' },
  enterInv:     { az: 'Dəvətnaməyə daxil olun',  en: 'Open the invitation',     ru: 'Открыть приглашение' },
  and:          { az: 'VƏ',                      en: 'AND',                     ru: 'И' },
  at:           { az: 'Saat',                    en: 'At',                      ru: 'В' },
  fDate:        { az: 'Tarix',                   en: 'Date',                    ru: 'Дата' },
  fTime:        { az: 'Saat',                    en: 'Time',                    ru: 'Время' },
  fGate:        { az: 'Qapı',                    en: 'Gate',                    ru: 'Выход' },
  openSeal:     { az: 'Möhürü aç',               en: 'Break the seal',          ru: 'Открыть печать' },
  tagline:      { az: 'Bir Dəvətnamədən Daha Artığı', en: 'MORE THAN AN INVITATION', ru: 'БОЛЬШЕ, ЧЕМ ПРИГЛАШЕНИЕ' },
  skip:         { az: 'Keç →',                   en: 'Skip →',                  ru: 'Пропустить →' },
}

/* Gazette rubrikası — tədbir növünə görə (əvvəl hər tədbirdə «Toy elanı» idi) */
const GAZETTE_RUBRIC = {
  toy:       { az: 'Toy elanı · Bakı',      en: 'Wedding notice · Baku',    ru: 'Свадебное объявление · Баку' },
  nishan:    { az: 'Nişan elanı · Bakı',    en: 'Engagement notice · Baku', ru: 'Объявление о помолвке · Баку' },
  birthday:  { az: 'Ad günü elanı · Bakı',  en: 'Birthday notice · Baku',   ru: 'Объявление о дне рождения · Баку' },
  corporate: { az: 'Tədbir elanı · Bakı',   en: 'Event notice · Baku',      ru: 'Объявление о событии · Баку' },
  other:     { az: 'Tədbir elanı · Bakı',   en: 'Event notice · Baku',      ru: 'Объявление о событии · Баку' },
}

export const OPENING_LANGS = ['az', 'en', 'ru']

/** İfadəni aktiv dildə qaytar (naməlum dil → AZ) */
export function phrase(key, lang = 'az') {
  const p = OPENING_PHRASES[key]
  return p ? (p[lang] || p.az) : ''
}

/* ── Admin panelində sahə adları ──
   Açarlar ümumidir (bütün şablonlarda eyni mənada), şablona məxsus izah
   `OPENING_SPEC[id].hints` ilə verilir. */
export const OPENING_SLOT_LABELS = {
  kicker:   'Üst yazı',
  sub:      'Əlavə sətir',
  title:    'Adlar / başlıq',
  meta:     'Tarix və məkan sətri',
  cta:      'Düymənin mətni',
  hint:     '«toxunun» ipucu',
  brand:    'Brend yazısı',
  pass:     '«Boarding pass» yazısı',
  route:    'Marşrut',
  fDate:    'Bilet sahəsi — tarix',
  fTime:    'Bilet sahəsi — saat',
  fGate:    'Bilet sahəsi — qapı',
  edition:  'Buraxılış sətri',
  masthead: 'Qəzetin adı',
  venue:    'Məkan sətri',
  no:       'Nömrə',
  and:      '«VƏ» bağlayıcısı',
  skip:     '«Keç» düyməsi',
}

/* ── Hər şablonun açılışında hansı sahələr var ──
   `mono`:
     'initials' — adların baş hərfləri göstərilən çərçivə (monoqram)
     'emblem'   — baş hərf yox, dekorativ nişan (almaz, daş, yarpaq, çiçək);
                  admin onu da mətn/stiker/şəkillə əvəz edə və ya gizlədə bilər
     null       — açılışda belə yer yoxdur
   `slots` — ekranda yuxarıdan aşağı sıra ilə (admin formu da bu sırada). */
export const OPENING_SPEC = {
  'royal-gold':      { mono: 'initials', slots: ['kicker', 'sub', 'title', 'meta', 'cta', 'hint'], hints: { sub: '«Anno …» ili' } },
  'oriental-luxe':   { mono: 'initials', slots: ['kicker', 'title', 'meta', 'cta', 'hint'] },
  'white-elegance':  { mono: 'initials', slots: ['sub', 'title', 'meta', 'cta', 'hint'], hints: { sub: 'Monoqramın altındakı «Dəvətnamə»' } },
  'vinyl-record':    { mono: 'initials', slots: ['kicker', 'title', 'meta', 'cta', 'hint'] },
  'royal-palace':    { mono: 'initials', slots: ['kicker', 'title', 'meta', 'cta', 'hint'] },
  'crystal-glass':   { mono: 'emblem',   slots: ['kicker', 'title', 'meta', 'cta', 'hint'] },
  'luxury-jewelry':  { mono: 'emblem',   slots: ['kicker', 'title', 'meta', 'cta', 'hint'] },
  'nature-touch':    { mono: 'emblem',   slots: ['title', 'meta', 'cta', 'hint'] },
  'floral-garden':   { mono: 'emblem',   slots: ['kicker', 'title', 'meta', 'cta', 'hint'] },
  'boarding-pass':   { mono: null, slots: ['brand', 'pass', 'route', 'title', 'fDate', 'fTime', 'fGate', 'kicker', 'meta', 'cta', 'hint'] },
  'cinema-premiere': { mono: null, slots: ['title', 'sub', 'kicker', 'meta', 'cta', 'hint'], hints: { sub: 'Kadrın altındakı kiçik yazı' } },
  'gazette':         { mono: null, slots: ['edition', 'masthead', 'sub', 'title', 'venue', 'meta', 'cta', 'hint'], hints: { sub: 'Rubrika' } },
  'mediterranean':   { mono: null, slots: ['title', 'kicker', 'meta', 'cta', 'hint'] },
  'modern-black':    { mono: null, slots: ['brand', 'no', 'kicker', 'title', 'and', 'meta', 'cta', 'hint'] },
  'night-sky':       { mono: null, slots: ['kicker', 'title', 'meta', 'cta', 'hint'] },
  /* Simple Luxury açılışı videodur — mətnlər yalnız video gecikəndə görünən
     afişada və «Keç» düyməsindədir. */
  'simple-luxury':   { mono: null, slots: ['brand', 'title', 'sub', 'skip'], hints: { sub: 'Afişadakı şüar', title: 'Yalnız video gecikəndə görünür' } },
}

/** Şablonun açılış təsviri (naməlum id → simple-luxury) */
export function getOpeningSpec(templateId) {
  return OPENING_SPEC[templateId] || OPENING_SPEC['simple-luxury']
}

/* ── Köməkçilər — əvvəl hər şablonda ayrıca yazılırdı ── */

/** Məkan adının son hissəsi («Gülüstan, Bakı» → «Bakı») */
function placeOf(wd) {
  return wd.venueName ? String(wd.venueName).split(',').pop().trim() : ''
}

/** «2026-11-21» → «21 · 11 · 2026» (ayırıcı şablona görə) */
function dotDate(wd, sep) {
  return String(wd.date || '').split('-').reverse().join(sep)
}

/** Roma rəqəmi — Royal Gold-un «Anno» ili üçün */
function roman(year) {
  const map = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let n = Number(year) || 0
  if (n < 1 || n > 3999) return ''
  return map.reduce((out, [v, s]) => { while (n >= v) { out += s; n -= v } return out }, '')
}

/** Adlar bir sətirdə — admin placeholder-ı və `title` defoltu */
export function openingNames(wd, isCouple) {
  if (isCouple) return [wd.groomName, wd.brideName].map((s) => String(s || '').trim()).filter(Boolean).join(' & ')
  return String(wd.eventName || wd.brideName || '').trim()
}

/** Gecə səması: xəritə linkindən koordinat, yoxdursa Bakı */
function nightCoords(wd) {
  const ll = parseLatLon(wd)
  const dms = (v, pos, neg) => {
    const d = Math.floor(Math.abs(v))
    const m = Math.round((Math.abs(v) - d) * 60)
    return `${d}°${String(m).padStart(2, '0')}′${v >= 0 ? pos : neg}`
  }
  return ll ? `${dms(ll[0], 'N', 'S')} · ${dms(ll[1], 'E', 'W')}` : '40°23′N · 49°52′E'
}

/**
 * Şablonun açılış sahələrinin DEFOLT mətnləri (override tətbiq olunmamış).
 * @param {string} templateId
 * @param {{weddingData:object, lang:string, isCouple:boolean, isCorp:boolean, eventLabel:string}} ctx
 * @returns {Record<string,string>}
 */
export function openingDefaults(templateId, ctx) {
  const wd = ctx.weddingData || {}
  const lang = OPENING_LANGS.includes(ctx.lang) ? ctx.lang : 'az'
  const P = (k) => phrase(k, lang)
  const names = openingNames(wd, ctx.isCouple)
  const fullDate = formatFullDateByLang(wd.date, lang)
  const base = { title: names, cta: P('open'), hint: P('tap') }

  switch (templateId) {
    case 'royal-gold': {
      const anno = roman(String(wd.date || '').slice(0, 4))
      return { ...base, kicker: ctx.eventLabel || '', sub: anno ? `Anno ${anno}` : '',
        meta: [fullDate, placeOf(wd)].filter(Boolean).join(' · '),
        cta: ctx.isCorp ? P('open') : P('openShort') }
    }
    case 'oriental-luxe':
      return { ...base, kicker: ctx.eventLabel || '', meta: [fullDate, placeOf(wd)].filter(Boolean).join(' · ') }
    case 'white-elegance':
      return { ...base, sub: P('invitation'), meta: dotDate(wd, ' · ') }
    case 'vinyl-record':
      return { ...base, kicker: 'Side A', meta: dotDate(wd, ' · '), cta: P('playRecord') }
    case 'royal-palace':
      return { ...base, kicker: P('invitation'), meta: dotDate(wd, ' · ') }
    case 'crystal-glass':
    case 'luxury-jewelry':
      return { ...base, kicker: P('invitation'), meta: dotDate(wd, ' · '),
        cta: templateId === 'luxury-jewelry' ? P('openBox') : P('open') }
    case 'nature-touch':
      return { ...base, meta: [placeOf(wd), fullDate].filter(Boolean).join(' · ') }
    case 'floral-garden':
      return { ...base, kicker: ctx.eventLabel || '', meta: fullDate,
        cta: ctx.isCorp ? P('enterEvent') : P('enterInv') }
    case 'boarding-pass':
      return { ...base, brand: 'DIGITOY AIR', pass: 'BOARDING PASS', route: 'GYD → ♥',
        fDate: P('fDate'), fTime: P('fTime'), fGate: P('fGate'),
        kicker: P('invitation'), meta: wd.venueName || '', cta: P('checkin') }
    case 'cinema-premiere':
      return { ...base, sub: P('lifeFilm'), kicker: P('premiere'),
        meta: [dotDate(wd, '.'), wd.venueName].filter(Boolean).join(' · '), cta: P('openPremiere') }
    case 'gazette': {
      const rubric = GAZETTE_RUBRIC[wd.eventType] || GAZETTE_RUBRIC.toy
      return { ...base, edition: P('specialEd'), masthead: 'THE GAZETTE',
        sub: rubric[lang] || rubric.az, venue: wd.venueName || '',
        meta: wd.time ? `${P('at')} ${wd.time}` : '', cta: P('readIssue') }
    }
    case 'mediterranean':
      return { ...base, kicker: P('invitation'), meta: [dotDate(wd, ' · '), wd.venueName].filter(Boolean).join(' · ') }
    case 'modern-black':
      return { ...base, brand: 'Digitoy', no: '№ 012', kicker: ctx.eventLabel || '', and: P('and'),
        /* Ekranda iki hissədir (tarix | məkan · saat) — override olmasa şablon
           onları ayrıca çəkir, bu sətir yalnız admin placeholder-ı üçündür. */
        meta: [dotDate(wd, '.'), [placeOf(wd).toLocaleUpperCase('az'), wd.time ? formatTime24(wd.time) : '']
          .filter(Boolean).join(' · ')].filter(Boolean).join('   '),
        cta: P('openShort') }
    case 'night-sky':
      return { ...base, kicker: P('skyNight'), meta: `${fullDate} · ${nightCoords(wd)}` }
    case 'simple-luxury':
    default:
      return { brand: 'Digitoy.az',
        title: ctx.isCouple ? names : String((ctx.isCorp ? wd.eventName : (wd.brideName || wd.eventName)) || '').trim(),
        sub: P('tagline'), skip: P('skip') }
  }
}

/* ── Monoqram ─────────────────────────────────────────────────────────────
   «Avtomatik» rejimdə nə göstərilir:
     • cütlük (toy/nişan)  → iki baş hərf, əvvəlki kimi
     • ad günü             → adın baş hərfi, əvvəlki kimi
     • korporativ / digər  → HƏRF YOX, şablonun öz ornamenti. Tədbir adının ilk
                             hərfi mənasızdır («Əliyev Turqayın…» → «Ə»).
   `null` qaytarılırsa şablon öz SVG ornamentini çəkir. */
const CORP_GLYPH = {
  'royal-gold':     '✦',
  'white-elegance': '✦',
  'vinyl-record':   '♪',
  'royal-palace':   '♛',
  'oriental-luxe':  null,   /* girih ulduzu (SVG) */
}

export function autoMonogram(templateId, ctx) {
  const wd = ctx.weddingData || {}
  if (ctx.isCorp && Object.prototype.hasOwnProperty.call(CORP_GLYPH, templateId)) {
    return CORP_GLYPH[templateId]
  }
  switch (templateId) {
    case 'vinyl-record': {
      const cut = (s) => String(s || '').trim().charAt(0).toUpperCase()
      if (ctx.isCouple) return [cut(wd.groomName), cut(wd.brideName)].filter(Boolean).join('&') || '♥'
      return cut(wd.eventName || wd.brideName) || '♥'
    }
    case 'royal-palace':
      return [wd.groomName, wd.brideName]
        .map((n) => String(n || '').trim().charAt(0).toUpperCase())
        .filter(Boolean).join(' ') || '♛'
    default:
      return ctx.isCouple
        ? `${(wd.groomName || '?')[0]}&${(wd.brideName || '?')[0]}`.toLocaleUpperCase('az')
        : ((wd.eventName || wd.brideName || '·')[0] || '·').toLocaleUpperCase('az')
  }
}

/* ── Admin override-ı + defolt → şablonun işlədəcəyi köməkçi ──────────────
   Şablon mətnləri belə soruşur: `ot.text('cta')`.
     • admin sahəni GİZLƏDİBSƏ → '' (şablon heç nə çəkmir)
     • admin aktiv dildə yazıbsa → onun mətni
     • yalnız AZ-da yazıbsa → AZ mətni (sistemin qalan override-ları ilə eyni
       qayda — bax adminOverrides.js › withStringOverrides)
     • heç nə yazmayıbsa → defolt
   `ot.custom(slot)` — sahə admin tərəfindən dəyişdirilibmi (gizlətmə daxil).
   Şablon bunu adların animasiyalı çəkilişini sadə mətnlə əvəz edəndə işlədir.

   ⚠ Override YOXDURSA davranış əvvəlki ilə eynidir: `text()` defoltu verir,
   `mono` avtomatik monoqramdır. */
export function makeOpeningText(templateId, ctx, opening = null) {
  const lang = OPENING_LANGS.includes(ctx.lang) ? ctx.lang : 'az'
  const defaults = openingDefaults(templateId, ctx)
  const texts = (opening && opening.text) || {}
  const hidden = new Set((opening && opening.hide) || [])

  const own = (slot) => {
    const e = texts[slot]
    return (e && (e[lang] || e.az)) || ''
  }

  const m = opening && opening.mono
  let mono
  if (!m || !m.mode || m.mode === 'auto') mono = { kind: 'auto', text: autoMonogram(templateId, ctx) }
  else if (m.mode === 'none') mono = { kind: 'none' }
  else if (m.mode === 'image' && m.image) mono = { kind: 'image', src: m.image }
  else if ((m.mode === 'text' || m.mode === 'sticker') && m.value) mono = { kind: m.mode, text: m.value }
  else mono = { kind: 'auto', text: autoMonogram(templateId, ctx) }

  const text = (slot) => (hidden.has(slot) ? '' : (own(slot) || defaults[slot] || ''))
  return {
    lang,
    defaults,
    mono,
    text,
    hidden: (slot) => hidden.has(slot),
    show: (slot) => !hidden.has(slot),
    custom: (slot) => hidden.has(slot) || !!own(slot),
    /** Sahə dəyişdirilməyibsə `undefined` (şablon öz zəngin markup-ını çəkir),
        dəyişdirilibsə yeni mətn ('' = gizli). */
    override: (slot) => ((hidden.has(slot) || own(slot)) ? text(slot) : undefined),
  }
}
