import { FONT_STACKS } from '../templateConfig'
import { storyPhotoSrc } from '../../utils/api'

/* ─────────────────────────────────────────────────────────────────────────────
   «BİZİM HEKAYƏMİZ» — ŞABLON TEMALARI (Phase 44)

   Mənbə: Claude Design › «Love Story.dc.html» (DigiToy · Love Story bölməsi).
   Hər şablonun hekayədə ÖZ vizual dili var: çərçivə (polaroid, bilet, film
   lenti, qəzet kəsiyi…), əsas fotonun forması (tağ, dairə, oktaqon…),
   fəsil nişanları (I · 01 · A1 · ✦ I) və başlıq mətni.

   ⚠ Rənglər dizayn faylındakı kimidir, `templateConfig`-dəki kimi DEYİL:
   dizaynda bəzi tonlar hekayə kartlarının kontrastı üçün incələşdirilib
   (məs. night-sky `mute`). Admin rəng override-ı varsa üstünə qoyulur
   (bax `getStoryTheme`).
   ⚠ Şriftlər FONT_STACKS-dan gəlir — orada `Ə` glyph-i olmayan ailələr üçün
   yaxın ehtiyat şrift var (bax templateConfig › FONT_STACKS).
   ───────────────────────────────────────────────────────────────────────── */

const F = {
  cormorant:  FONT_STACKS.cormorant,
  vibes:      "'Great Vibes', 'Cormorant Garamond', Georgia, cursive",
  jost:       FONT_STACKS.jost,
  dm:         FONT_STACKS.dmsans,
  archivo:    FONT_STACKS.archivo,
  instrument: FONT_STACKS.instrument,
  marcellus:  FONT_STACKS.marcellus,
  newsreader: FONT_STACKS.newsreader,
  amiri:      FONT_STACKS.amiri,
  sg:         FONT_STACKS.spacegrotesk,
  mono:       FONT_STACKS.jetbrains,
  bebas:      FONT_STACKS.bebas,
  cinzel:     FONT_STACKS.cinzel,
  bask:       FONT_STACKS.baskerville,
  inter:      FONT_STACKS.inter,
  notoDisplay: FONT_STACKS.notoDisplay,
  hanken:     FONT_STACKS.hanken,
  fraunces:   FONT_STACKS.fraunces,
  mulish:     FONT_STACKS.mulish,
  /* Floral Garden: rus dilində şablon başlıq şriftini Cormorant-a keçirir
     (Fraunces-də kiril yoxdur) — dəyişən şablonun kök elementindədir */
  fgSerif:    `var(--fg-serif, ${FONT_STACKS.fraunces})`,
  /* Premium redizayn (2026-10) — hər şablon öz cütünü yükləyir (fonts.js) */
  unbounded:  FONT_STACKS.unbounded,
  interTight: FONT_STACKS.interTight,
  spectral:   FONT_STACKS.spectral,
  sourceSerif: FONT_STACKS.sourceSerif,
  commissioner: FONT_STACKS.commissioner,
  reemKufi:   FONT_STACKS.reemKufi,
  alegreya:   FONT_STACKS.alegreya,
  vollkorn:   FONT_STACKS.vollkorn,
  geologica:  FONT_STACKS.geologica,
  josefin:    FONT_STACKS.josefin,
  onest:      FONT_STACKS.onest,
  oswald:     FONT_STACKS.oswald,
  plexSans:   FONT_STACKS.plexSans,
  plexMono:   FONT_STACKS.plexMono,
  bigShoulders: FONT_STACKS.bigShoulders,
  playfair:   FONT_STACKS.playfair,
  youngSerif: FONT_STACKS.youngSerif,
  montserrat: FONT_STACKS.montserrat,
  cormorantSC: FONT_STACKS.cormorantSC,
  ebGaramond: FONT_STACKS.ebGaramond,
  imperial:   FONT_STACKS.imperial,
  libreBodoni: FONT_STACKS.libreBodoni,
  literata:   FONT_STACKS.literata,
  libreCaslon: FONT_STACKS.libreCaslon,
  raleway:    FONT_STACKS.raleway,
}
export const STORY_FONTS = F

export const OCT = 'polygon(14% 0,86% 0,100% 14%,100% 86%,86% 100%,14% 100%,0 86%,0 14%)'

/* Struktur defaultları — şablon yalnız fərqli olanı yazır */
const BASE = {
  labels: 'roman', kpre: false, tilt: false, dash: '3 6', textItalic: true,
  titleSize: 44, titleItalic: false, titleUpper: false, bigSize: 40,
  capItalic: true, script: false, record: false,
}

const T = {
  'royal-gold':      { bg: 'radial-gradient(120% 60% at 50% 0%,#1C1509,#0B0906 72%)', surf: '#16110A', ink: '#F3EADA', mute: '#C6B59C', hi: '#C5A059', line: '#C5A059', paper: '#F3EADA', paperInk: '#5C4A3A', head: F.notoDisplay, body: F.hanken, cap: F.vibes, script: true, titleFont: F.vibes, titleSize: 56, frame: 'mat', hero: 'arch', tilt: false },
  'simple-luxury':   { bg: 'linear-gradient(170deg,#FDFAF4,#F2EAD6)', surf: '#FFFFFF', ink: '#1A1A1A', mute: '#5C4A3A', hi: '#8A6A2E', line: '#C5A059', paper: '#FFFFFF', paperInk: '#5C4A3A', head: F.cormorant, body: F.inter, cap: F.vibes, script: true, titleFont: F.vibes, titleSize: 56, frame: 'polaroid', hero: 'arch', tilt: true },
  'floral-garden':   { bg: 'linear-gradient(170deg,#F4F6EF,#E8EEE4)', surf: '#FFFFFF', ink: '#213229', mute: '#5D6B61', hi: '#5E7C6B', line: '#C9768A', paper: '#FFFFFF', paperInk: '#5D6B61', head: F.fgSerif, body: F.mulish, cap: F.vibes, script: true, titleFont: F.vibes, titleSize: 54, frame: 'polaroid', hero: 'oval', tilt: true },
  'modern-black':    { bg: '#000000', surf: '#0D0D0D', ink: '#FFFFFF', mute: '#A3A3A3', hi: '#FFFFFF', line: '#FFFFFF', paper: '#FFFFFF', paperInk: '#0A0A0A', head: F.interTight, body: F.interTight, cap: F.interTight, capItalic: false, titleFont: F.unbounded, titleUpper: true, titleSize: 36, frame: 'minimal', hero: 'rect', labels: 'num2', dash: '0', textItalic: false },
  'white-elegance':  { bg: '#F6F4F0', surf: '#FBFAF7', ink: '#2B2723', mute: '#7A7166', hi: '#5A534B', line: '#8B8175', paper: '#FFFFFF', paperInk: '#7A7166', head: F.spectral, body: F.spectral, cap: F.spectral, titleFont: F.spectral, titleItalic: true, titleSize: 42, frame: 'mat', hero: 'arch', dash: '1 5' },
  'night-sky':       { bg: 'radial-gradient(130% 70% at 50% 110%,#1B2340,#070B18 70%)', surf: '#0F1526', ink: '#E4E9F5', mute: '#A2A8BC', hi: '#F2D9A6', line: '#C8CEE0', head: F.sourceSerif, body: F.commissioner, cap: F.sourceSerif, titleFont: F.sourceSerif, titleItalic: true, titleSize: 44, frame: 'glow', hero: 'circle', dash: '1 7', labels: 'star' },
  'oriental-luxe':   { bg: 'radial-gradient(140% 70% at 50% 0%,#5C1424,#4A0F1C 45%,#2E0710)', surf: '#3E0C17', ink: '#F3E4C4', mute: '#CDA88E', hi: '#D9B36C', line: '#D9B36C', paper: '#F3E4C4', paperInk: '#4A0F1C', head: F.reemKufi, body: F.alegreya, cap: F.alegreya, titleFont: F.reemKufi, titleSize: 36, frame: 'heraldic', hero: 'arch' },
  'nature-touch':    { bg: '#E8E2D3', surf: '#F6F2E7', ink: '#2F3A2C', mute: '#5C6B4C', hi: '#9A5530', line: '#5C6B4C', paper: '#F6F2E7', paperInk: '#3E4A3A', head: F.vollkorn, body: F.geologica, cap: F.vollkorn, titleFont: F.vollkorn, titleItalic: true, titleSize: 40, frame: 'polaroid', hero: 'arch', tilt: true },
  'crystal-glass':   { bg: 'linear-gradient(180deg,#F7F9FB,#EEF2F6 40%,#E9EEF2)', surf: 'rgba(255,255,255,0.6)', ink: '#23303B', mute: '#5A6772', hi: '#23303B', line: '#AEB9C3', head: F.josefin, body: F.onest, cap: F.josefin, capItalic: false, titleFont: F.josefin, titleSize: 40, frame: 'glass', hero: 'rounded', dash: '2 6', textItalic: false },
  'boarding-pass':   { bg: 'linear-gradient(180deg,#0E1B2E,#08111E)', surf: '#14243B', ink: '#F4EFE4', mute: '#9AA6B6', hi: '#D2A262', line: '#9AA6B6', paper: '#F4EFE4', paperInk: '#14243B', head: F.oswald, body: F.plexSans, cap: F.plexMono, capItalic: false, titleFont: F.oswald, titleSize: 40, titleUpper: true, frame: 'ticket', hero: 'rect', labels: 'num2', kpre: true, textItalic: false, dash: '6 6', bigSize: 32 },
  'cinema-premiere': { bg: 'radial-gradient(120% 50% at 50% 0%,#2A0A0F,#0B0A0C 60%)', surf: '#141215', ink: '#F2EBDD', mute: '#A9A39A', hi: '#D9A441', line: '#D9A441', head: F.playfair, body: F.playfair, cap: F.playfair, titleFont: F.bigShoulders, titleSize: 58, titleUpper: true, frame: 'film', hero: 'letterbox', labels: 'num2', kpre: true, dash: '0' },
  'vinyl-record':    { bg: 'radial-gradient(120% 50% at 50% 0%,#2A2420,#151312 60%)', surf: '#1E1B19', ink: '#F1E8D6', mute: '#B3A894', hi: '#D2642F', line: '#E2A93B', head: F.youngSerif, body: F.montserrat, cap: F.montserrat, capItalic: false, titleFont: F.youngSerif, titleSize: 40, frame: 'sleeve', hero: 'disc', record: true, labels: 'vinyl', kpre: true, textItalic: false, bigSize: 32 },
  'royal-palace':    { bg: 'linear-gradient(180deg,#141B3A,#0C1128)', surf: '#141B3A', ink: '#F3ECDD', mute: '#AAB0CC', hi: '#F0DCA0', line: '#D6B76E', paper: '#EFE3C8', paperInk: '#2A2340', head: F.cormorantSC, body: F.ebGaramond, cap: F.imperial, script: true, titleFont: F.cormorantSC, titleSize: 36, frame: 'heraldic', hero: 'arch' },
  'mediterranean':   { bg: '#FBF8F1', surf: '#F1E7D3', ink: '#1E3348', mute: '#5A6B7A', hi: '#1F5FA6', line: '#D7774E', paper: '#FFFFFF', paperInk: '#5A6B7A', head: F.libreBodoni, body: F.literata, cap: F.libreBodoni, titleFont: F.libreBodoni, titleItalic: true, titleSize: 44, frame: 'mat', hero: 'arch' },
  'gazette':         { bg: '#F3EEE2', surf: '#FBF9F3', ink: '#1A1917', mute: '#55514A', hi: '#B3261E', line: '#1A1917', paper: '#FBF9F3', paperInk: '#55514A', head: F.playfair, body: F.sourceSerif, cap: F.sourceSerif, titleFont: F.playfair, titleSize: 36, frame: 'clipping', hero: 'rect', labels: 'num', kpre: true, dash: '0', textItalic: false, bigSize: 32 },
  'luxury-jewelry':  { bg: 'radial-gradient(120% 50% at 50% 0%,#143A31,#07110E 60%)', surf: '#0E2A23', ink: '#F4F1EA', mute: '#9DB5AE', hi: '#A3D6C7', line: '#D9DEE0', head: F.libreCaslon, body: F.raleway, cap: F.libreCaslon, titleFont: F.libreCaslon, titleSize: 42, frame: 'gem', hero: 'octagon' },
}

/* ── Mətnlər (AZ/EN/RU) ── dizayndakı şablon adlandırmaları */
const COPY_BASE = {
  kicker:  { az: 'Hekayə', en: 'Story', ru: 'История' },
  title:   { az: 'Bizim Hekayəmiz', en: 'Our Story', ru: 'Наша история' },
  sub:     { az: 'Tanışlıqdan bu günə qədər yolumuz', en: 'Our journey from the day we met to today', ru: 'Наш путь от знакомства до сегодняшнего дня' },
  end:     { az: '…və hekayəmiz davam edir', en: '…and our story goes on', ru: '…и наша история продолжается' },
  next:    { az: 'Növbəti fəsil', en: 'Next chapter', ru: 'Следующая глава' },
  endSub:  { az: 'Bu günü sizinlə yazmaq istəyirik.', en: 'We want to write this day with you.', ru: 'Этот день мы хотим написать вместе с вами.' },
  kpre:    { az: '', en: '', ru: '' },
  photo:   { az: 'Foto', en: 'Photo', ru: 'Фото' },
}

const COPY = {
  'modern-black':    { title: { az: 'Bizim hekayəmiz', en: 'Our story', ru: 'Наша история' } },
  'night-sky':       { kicker: { az: 'Ulduz xəritəsi', en: 'Star map', ru: 'Звёздная карта' } },
  'boarding-pass':   {
    kicker: { az: 'Uçuş jurnalı', en: 'Flight log', ru: 'Бортовой журнал' },
    title:  { az: 'Bizim marşrut', en: 'Our route', ru: 'Наш маршрут' },
    end:    { az: 'Son dayanacaq: toy günümüz', en: 'Final stop: our wedding day', ru: 'Конечная остановка: наша свадьба' },
    kpre:   { az: 'Uçuş', en: 'Flight', ru: 'Рейс' },
  },
  'cinema-premiere': {
    kicker: { az: 'Premyera', en: 'Premiere', ru: 'Премьера' },
    title:  { az: 'Bizim Filmimiz', en: 'Our Film', ru: 'Наш фильм' },
    end:    { az: 'Davamı var…', en: 'To be continued…', ru: 'Продолжение следует…' },
    kpre:   { az: 'Səhnə', en: 'Scene', ru: 'Сцена' },
  },
  'vinyl-record':    {
    kicker: { az: 'Side A', en: 'Side A', ru: 'Side A' },
    title:  { az: 'Bizim albomumuz', en: 'Our album', ru: 'Наш альбом' },
    end:    { az: 'Side B — tezliklə', en: 'Side B — coming soon', ru: 'Side B — скоро' },
    kpre:   { az: 'Trek', en: 'Track', ru: 'Трек' },
  },
  'royal-palace':    { title: { az: 'Bizim Tariximiz', en: 'Our Chronicle', ru: 'Наша летопись' } },
  'mediterranean':   { kicker: { az: 'Sahil gündəliyi', en: 'Seaside diary', ru: 'Морской дневник' } },
  'gazette':         {
    kicker: { az: 'Xüsusi buraxılış', en: 'Special edition', ru: 'Специальный выпуск' },
    title:  { az: 'Bir sevgi hekayəsi', en: 'A love story', ru: 'История любви' },
    end:    { az: 'Davamı növbəti buraxılışda', en: 'Continued in the next issue', ru: 'Продолжение в следующем выпуске' },
    kpre:   { az: 'Səh.', en: 'P.', ru: 'Стр.' },
  },
  'luxury-jewelry':  { kicker: { az: 'Kolleksiya', en: 'Collection', ru: 'Коллекция' } },
}

/** Aktiv dil üçün mətnlər: şablon → baza, dil → AZ. */
export function getStoryCopy(templateId, lang = 'az') {
  const own = COPY[templateId] || {}
  const out = {}
  for (const key of Object.keys(COPY_BASE)) {
    const v = own[key] || COPY_BASE[key]
    out[key] = v[lang] ?? v.az
  }
  return out
}

/* ── Admin rəng override-ı (Phase 42) ──
   `form_data.admin.theme` yalnız `#RRGGBB` dəyərlər daşıyır (serverdə
   yoxlanılır). Hekayə palitrasına belə köçürülür:
     text → mətn, primary → vurğu, accent → xətlər, background → fon. */
export function getStoryTheme(templateId, adminTheme = null) {
  const t = { ...BASE, ...(T[templateId] || T['simple-luxury']) }
  if (adminTheme && typeof adminTheme === 'object') {
    const hex = (v) => (typeof v === 'string' && /^#[0-9A-Fa-f]{6}$/.test(v) ? v : null)
    if (hex(adminTheme.text))       t.ink  = adminTheme.text
    if (hex(adminTheme.primary))    t.hi   = adminTheme.primary
    if (hex(adminTheme.accent))     t.line = adminTheme.accent
    if (hex(adminTheme.background)) t.bg   = adminTheme.background
  }
  t.usesScript = [t.titleFont, t.cap].includes(F.vibes)
  return t
}

/* ── Tarix: `2019-06` / `2019-06-14` / sərbəst mətn → göstəriləcək etiket ── */
const MONTHS = {
  az: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
}

export function formatStoryDate(raw, lang = 'az') {
  const s = String(raw || '').trim()
  if (!s) return ''
  const months = MONTHS[lang] || MONTHS.az
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s)
  if (m) {
    const mi = Math.min(11, Math.max(0, parseInt(m[2], 10) - 1))
    return `${parseInt(m[3], 10)} ${months[mi]} ${m[1]}`
  }
  m = /^(\d{4})-(\d{1,2})$/.exec(s)
  if (m) {
    const mi = Math.min(11, Math.max(0, parseInt(m[2], 10) - 1))
    return `${months[mi]} ${m[1]}`
  }
  return s   /* sərbəst mətn (məs. «2019-cu ilin yazı») olduğu kimi */
}

/** Blokun şəkilləri: yeni `photos[]` + Phase 43-ün tək `photo` sahəsi.
    Təhlükəsiz olmayan ünvanlar (`storyPhotoSrc` → null) atılır. */
export const MAX_PHOTOS_PER_CHAPTER = 6
export function storyPhotos(block) {
  const raw = Array.isArray(block?.photos) ? block.photos : (block?.photo ? [block.photo] : [])
  return raw.map(storyPhotoSrc).filter(Boolean).slice(0, MAX_PHOTOS_PER_CHAPTER)
}

/* ── Fəsil nişanları — fəsil sayı sabit deyil, ona görə generasiya olunur ── */
function roman(n) {
  const map = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let out = ''
  for (const [v, s] of map) while (n >= v) { out += s; n -= v }
  return out
}

/** @param {number} i 0-dan  @param {number} total fəsil sayı */
export function chapterLabel(style, i, total) {
  const n = i + 1
  switch (style) {
    case 'num2':  return String(n).padStart(2, '0')
    case 'num':   return String(n)
    case 'star':  return '✦ ' + roman(n)
    /* Plastinka: birinci yarı A tərəfi, ikinci yarı B tərəfi (A1 A2 B1 B2) */
    case 'vinyl': {
      const half = Math.ceil(total / 2)
      return n <= half ? 'A' + n : 'B' + (n - half)
    }
    default:      return roman(n)
  }
}

/* ── Çərçivə (dizayndakı `frame()` ilə eyni) ── */
export function frameStyle(t, rot, ratio) {
  const r = t.tilt || t.frame === 'clipping' ? rot * (t.frame === 'clipping' ? 0.35 : 1) : 0
  const box = { position: 'relative', zIndex: 1, transform: `rotate(${r}deg)` }
  let outer = {}
  const inner = { width: '100%', aspectRatio: ratio, overflow: 'hidden', background: 'rgba(127,127,127,0.12)' }
  let cap = {
    fontFamily: t.cap, fontStyle: t.capItalic ? 'italic' : 'normal', fontSize: t.script ? 22 : 15,
    lineHeight: 1.2, paddingTop: 8, textAlign: 'center', color: t.mute, overflowWrap: 'anywhere',
  }
  const sh = '0 18px 40px rgba(0,0,0,0.35)'
  switch (t.frame) {
    case 'polaroid': Object.assign(box, { background: t.paper, padding: '10px 10px 8px', boxShadow: sh }); cap.color = t.paperInk; break
    case 'mat': Object.assign(box, { background: t.paper, padding: '14px 14px 12px', boxShadow: '0 14px 34px rgba(0,0,0,0.08)' }); cap.color = t.paperInk; break
    case 'minimal': outer = { border: '1px solid ' + t.line, padding: 6 }; Object.assign(cap, { fontSize: 18, textAlign: 'left', color: t.ink }); break
    case 'glow': outer = { border: '1px solid ' + t.line + '88', padding: 6, boxShadow: '0 0 40px ' + t.hi + '30' }; cap.fontSize = 17; break
    case 'heraldic': Object.assign(box, { background: t.surf, border: '1px solid ' + t.line, outline: '1px solid ' + t.line + '66', outlineOffset: 4, padding: 8, boxShadow: sh }); Object.assign(cap, { color: t.hi, fontSize: t.script ? 22 : 17 }); break
    case 'glass': Object.assign(box, { background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.95)', borderRadius: 18, padding: '8px 8px 6px', boxShadow: '0 20px 44px rgba(46,58,68,0.16)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }); inner.borderRadius = 12; cap.fontSize = 17; break
    case 'ticket': Object.assign(box, { background: t.paper, borderRadius: 10, padding: '8px 8px 10px', boxShadow: sh }); inner.borderRadius = 6
      cap = { fontFamily: t.cap, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.paperInk, borderTop: '1px dashed ' + t.paperInk + '66', marginTop: 10, padding: '10px 2px 26px', backgroundImage: `repeating-linear-gradient(90deg,${t.paperInk} 0 2px,transparent 2px 4px,${t.paperInk} 4px 5px,transparent 5px 8px)`, backgroundSize: '100% 14px', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom', overflowWrap: 'anywhere' }
      break
    case 'film': {
      const holes = 'repeating-linear-gradient(90deg,#F2F0EC66 0 7px,transparent 7px 15px)'
      Object.assign(box, { background: '#000', padding: '16px 6px 18px', backgroundImage: holes + ',' + holes, backgroundSize: '100% 5px,100% 5px', backgroundPosition: '0 5px,0 calc(100% - 5px)', backgroundRepeat: 'no-repeat', boxShadow: sh })
      Object.assign(cap, { color: t.hi, fontSize: 16 })
      break
    }
    case 'sleeve': Object.assign(box, { background: t.surf, border: '1px solid ' + t.line + '55', padding: '8px 8px 10px', boxShadow: sh }); cap = { fontFamily: t.cap, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.mute, paddingTop: 10, overflowWrap: 'anywhere' }; break
    case 'clipping': Object.assign(box, { background: t.paper, border: '1px solid ' + t.ink, padding: '6px 6px 8px', boxShadow: '3px 3px 0 rgba(0,0,0,0.08)' }); inner.filter = 'grayscale(1) contrast(1.05)'; Object.assign(cap, { fontSize: 12, textAlign: 'left', paddingTop: 6 }); break
    case 'gem': outer = { background: t.line, padding: 1.5, clipPath: OCT }; Object.assign(inner, { clipPath: OCT, background: t.surf }); Object.assign(cap, { color: t.hi, fontSize: 17, paddingTop: 10 }); break
    default: break
  }
  return { box, outer, inner, cap, tape: t.frame === 'polaroid' && t.tilt }
}

/* ── Əsas foto forması (dizayndakı `hero()` ilə eyni) ── */
export function heroStyle(t) {
  const L = '1px solid ' + t.line
  const o = { position: 'relative', width: '100%' }
  const i = { width: '100%', overflow: 'hidden', aspectRatio: '4/5', background: 'rgba(127,127,127,0.12)' }
  switch (t.hero) {
    case 'arch': Object.assign(o, { border: L, padding: 8, borderRadius: '999px 999px 0 0' }); Object.assign(i, { aspectRatio: '3/4', borderRadius: '999px 999px 0 0' }); break
    case 'circle': Object.assign(o, { border: L, padding: 8, borderRadius: '50%', boxShadow: '0 0 60px ' + t.hi + '26' }); Object.assign(i, { aspectRatio: '1', borderRadius: '50%' }); break
    case 'oval': Object.assign(o, { border: L, padding: 8, borderRadius: '50%' }); Object.assign(i, { aspectRatio: '3/4', borderRadius: '50%' }); break
    case 'rect': Object.assign(o, { border: L, padding: 8 }); if (t.frame === 'clipping') i.filter = 'grayscale(1) contrast(1.05)'; if (t.frame === 'ticket') { o.borderRadius = 14; i.borderRadius = 8 } break
    case 'letterbox': Object.assign(o, { background: '#000', padding: '26px 0', borderTop: L, borderBottom: L }); i.aspectRatio = '16/9'; break
    case 'disc': Object.assign(o, { padding: 12, borderRadius: '50%', background: 'repeating-radial-gradient(circle,#111 0 2px,#1D1D1D 2px 4px)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }); Object.assign(i, { aspectRatio: '1', borderRadius: '50%' }); break
    case 'octagon': Object.assign(o, { background: t.line, padding: 1.5, clipPath: OCT }); Object.assign(i, { clipPath: OCT, background: t.surf }); break
    case 'rounded': Object.assign(o, { background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.95)', borderRadius: 32, padding: 10, boxShadow: '0 24px 50px rgba(46,58,68,0.16)' }); i.borderRadius = 24; break
    default: break
  }
  return { outer: o, inner: i, disc: t.hero === 'disc' }
}

/* ── Fəsil maketi — şəkil sayına görə ──
   Dizaynda 4 maket var: `feature` (böyük çərçivə + üstünə düşən kart),
   `duo` (iki şəkilli kollaj), `hero` (mərkəzi forma), `split` (mətn + şəkil).
   Fəsil sayı və şəkil sayı sərbəst olduğu üçün seçim belədir:
     0 şəkil → `text` (kart), 2+ şəkil → `duo` (+ qalanlar kiçik çərçivələrdə),
     1 şəkil → dizayndakı ardıcıllıq: feature · split(güzgü) · hero · split. */
export function chapterLayout(index, photoCount) {
  if (photoCount === 0) return 'text'
  if (photoCount >= 2)  return 'duo'
  return ['feature', 'splitR', 'hero', 'split'][index % 4]
}

/* Birləşdirici xəttin giriş/çıxış nöqtələri (430 genişlikli viewBox-da) */
export function chapterAnchors(layout, index) {
  switch (layout) {
    case 'feature': return { in: 150, out: 120 }
    case 'duo':     return { in: 310, out: 300 }
    case 'hero':    return { in: 215, out: 215 }
    case 'split':   return { in: 130, out: 300 }
    case 'splitR':  return { in: 300, out: 130 }
    default:        return index % 2 ? { in: 160, out: 160 } : { in: 270, out: 270 }
  }
}
