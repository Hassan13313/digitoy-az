/* ─────────────────────────────────────────────────────────────────────────────
   UŞAQ AD GÜNÜ — ortaq köməkçilər (2026-10)

   Builder-də ad günü üçün İSTƏYƏ BAĞLI «Neçə yaşı tamam olur?» sahəsi var
   (`weddingData.age`). Sahə boşdursa şablonlar yaşı göstərmir — yerində öz
   nişanı (qəsr, planet, yumurta…) olur, heç bir boş yer qalmır.
   ⚠ React YOXDUR — node testləri bu faylı birbaşa yükləyə bilsin.
   ───────────────────────────────────────────────────────────────────────── */

import { isMultiConcept } from '../templateConfig.js'

/* Böyüyün ad günü versiyası: dəvət edən tək nəfərdir («mənimlə», «bizimlə» yox) */
export const SOLO_JOIN = {
  az: 'Bu özəl günü mənimlə paylaşmağınız mənim üçün böyük ehtiramdır',
  en: 'I would be deeply honored by your presence on my special day',
  ru: 'Для меня будет огромной честью разделить этот особенный день с вами',
}

/** İstənilən girişi 1–120 arası tam yaşa çevirir (yoxdursa null) */
export function parseAge(v) {
  const n = parseInt(String(v ?? '').replace(/\D/g, ''), 10)
  return Number.isFinite(n) && n >= 1 && n <= 120 ? n : null
}

/** Rus dilində «год / года / лет» */
function ruYears(n) {
  const m10 = n % 10, m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'год'
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'года'
  return 'лет'
}

/* Adminin mətni («Mətnlər › Hero»): {n} yerinə rəqəm yazılır */
function ownText(strings, key, n, lang) {
  const v = strings?.[key]?.[lang] || strings?.[key]?.az
  return v ? String(v).replace(/\{n\}/g, n) : ''
}

/** Rəqəmin yanındakı söz: «yaş» · «years» · «лет» */
export function ageWord(n, lang = 'az', strings = null) {
  const own = ownText(strings, 'age_word', n, lang)
  if (own) return own
  if (lang === 'ru') return ruYears(n)
  if (lang === 'en') return n === 1 ? 'year' : 'years'
  return 'yaş'
}

/**
 * Yaş cümləsi — adın ALTINDA tək sətir kimi işlənir, adla qrammatik bağ
 * qurmur (azərbaycanca yiyəlik şəkilçisi adın son hərfindən asılıdır və
 * səhv düşə bilər: «Ayanın», «Nərminin», «Aysunun»…).
 */
export function ageSentence(n, lang = 'az', strings = null) {
  if (!n) return ''
  const own = ownText(strings, 'age_sentence', n, lang)
  if (own) return own
  if (lang === 'ru') return `исполняется ${n} ${ruYears(n)}`
  if (lang === 'en') return `is turning ${n}`
  return `${n} yaşı tamam olur`
}

/* Qalereya izahı — ümumi tərcümə (`inv_gallery_desc`) toy üçündür
   («…bəy və gəlinlə paylaşın»). Uşaq şablonları öz neytral mətnini işlədir,
   amma admin bu sətri dəyişibsə HƏMİŞƏ adminin mətni göstərilir. */
const GALLERY_DESC = {
  az: 'Bayramda çəkdiyiniz şəkilləri buradan yükləyin — hamısı bir albomda toplanacaq.',
  en: 'Upload the photos you take at the party here — they will all gather in one album.',
  ru: 'Загружайте сюда фото с праздника — все они соберутся в одном альбоме.',
}
export function kidsGalleryDesc(adminOverrides, tr, lang = 'az') {
  const own = adminOverrides?.strings?.inv_gallery_desc
  if (own && (own[lang] || own.az)) return tr.inv_gallery_desc
  return GALLERY_DESC[lang] || GALLERY_DESC.az
}

/* Digər konseptlər üçün eyni neytral mətn — tədbirin adı ilə:
   «night» (xına, qız gecəsi, bayram), «event» (korporativ, açılış),
   «celebration» (sünnət, ildönümü, baby shower, məzuniyyət) */
const GALLERY_BY_KIND = {
  night: {
    az: 'Bu gecə çəkdiyiniz şəkilləri buradan yükləyin — hamısı bir albomda toplanacaq.',
    en: 'Upload the photos you take tonight here — they will all gather in one album.',
    ru: 'Загружайте сюда фото этого вечера — все они соберутся в одном альбоме.',
  },
  event: {
    az: 'Tədbirdə çəkdiyiniz şəkilləri buradan yükləyin — hamısı bir albomda toplanacaq.',
    en: 'Upload the photos you take at the event here — they will all gather in one album.',
    ru: 'Загружайте сюда фото с мероприятия — все они соберутся в одном альбоме.',
  },
  celebration: {
    az: 'Məclisdə çəkdiyiniz şəkilləri buradan yükləyin — hamısı bir albomda toplanacaq.',
    en: 'Upload the photos you take at the celebration here — they will all gather in one album.',
    ru: 'Загружайте сюда фото с торжества — все они соберутся в одном альбоме.',
  },
}
export function galleryDesc(adminOverrides, tr, lang = 'az', kind = 'celebration') {
  const own = adminOverrides?.strings?.inv_gallery_desc
  if (own && (own[lang] || own.az)) return tr.inv_gallery_desc
  const set = GALLERY_BY_KIND[kind] || GALLERY_DESC
  return set[lang] || set.az
}

/**
 * Tədbirə uyğun tərcümə lüğəti: «…bəy və gəlinlə paylaşın» yalnız toy və nişanda,
 * böyüyün ad günü versiyasında dəvət edən tək nəfərdir («mənimlə»).
 * Admin override-ları bunun üstünə qoyulur. Toy/nişanda EYNİ obyekt qayıdır.
 */
export function eventDict(dict, eventType, templateId, lang = 'az') {
  if (eventType === 'toy' || eventType === 'nishan') return dict
  return {
    ...dict,
    inv_gallery_desc: galleryDesc(null, dict, lang),
    ...(eventType === 'birthday' && isMultiConcept(templateId) ? { inv_join: SOLO_JOIN[lang] || SOLO_JOIN.az } : {}),
  }
}

/** «25 il birlikdə» — ildönümü şablonları üçün (yaş sahəsi = il sayı) */
export function yearsSentence(n, lang = 'az', strings = null) {
  if (!n) return ''
  const own = ownText(strings, 'years_sentence', n, lang)
  if (own) return own
  if (lang === 'ru') return `${n} ${ruYears(n)} вместе`
  if (lang === 'en') return `${n} ${n === 1 ? 'year' : 'years'} together`
  return `${n} il birlikdə`
}

/* Masa adı: oturma planında «Masa 4: …» yazılır və `table_id` = «Masa 4».
   Uşaq şablonları «Masa» sözünü ayrıca kiçik yazır, iri rəqəm üçün yalnız
   «4» lazımdır. «VIP», «Ailə masası» kimi adlar olduğu kimi qalır. */
export function tableNum(id) {
  const s = String(id || '').trim()
  const m = /^(masa|table|стол|stol)\s*[№#]?\s*(.+)$/i.exec(s)
  return m ? m[2] : s
}

/** İri masa rəqəminin ölçüsü — uzun adlarda kiçilir ki, çərçivədən çıxmasın */
export function tableSize(text, base = 60) {
  const n = Array.from(String(text || '')).length
  if (n <= 3) return base
  if (n <= 6) return Math.round(base * 0.6)
  return Math.round(base * 0.4)
}
