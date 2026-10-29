/* ─────────────────────────────────────────────────────────────────────────────
   UŞAQ AD GÜNÜ — ortaq köməkçilər (2026-10)

   Builder-də ad günü üçün İSTƏYƏ BAĞLI «Neçə yaşı tamam olur?» sahəsi var
   (`weddingData.age`). Sahə boşdursa şablonlar yaşı göstərmir — yerində öz
   nişanı (qəsr, planet, yumurta…) olur, heç bir boş yer qalmır.
   ⚠ React YOXDUR — node testləri bu faylı birbaşa yükləyə bilsin.
   ───────────────────────────────────────────────────────────────────────── */

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

/** Rəqəmin yanındakı söz: «yaş» · «years» · «лет» */
export function ageWord(n, lang = 'az') {
  if (lang === 'ru') return ruYears(n)
  if (lang === 'en') return n === 1 ? 'year' : 'years'
  return 'yaş'
}

/**
 * Yaş cümləsi — adın ALTINDA tək sətir kimi işlənir, adla qrammatik bağ
 * qurmur (azərbaycanca yiyəlik şəkilçisi adın son hərfindən asılıdır və
 * səhv düşə bilər: «Ayanın», «Nərminin», «Aysunun»…).
 */
export function ageSentence(n, lang = 'az') {
  if (!n) return ''
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
