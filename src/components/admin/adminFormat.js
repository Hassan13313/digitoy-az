/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN PANEL — tarix formatı və telefon ölçüləri (Phase 45)

   ⚠ NƏ ÜÇÜN `toLocaleDateString('az-AZ')` DEYİL: Chrome/Samsung Internet-in
   ICU datasında Azərbaycan dilinin qısa ay adları yoxdur — nəticə
   «2026 M06 29» çıxırdı, həftə günləri isə ingiliscə («Thu, Fri») qalırdı.
   Burada adlar əl ilə verilir, hər brauzerdə eyni görünür.
   ───────────────────────────────────────────────────────────────────────── */

const MON_SHORT = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avq', 'sen', 'okt', 'noy', 'dek']
const MON_LONG  = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr']
/* Rəsmi qısaltmalar: Bazar, Bazar ertəsi, Çərşənbə axşamı, Çərşənbə, Cümə axşamı, Cümə, Şənbə */
const WEEKDAY_SHORT = ['B.', 'B.e.', 'Ç.a.', 'Ç.', 'C.a.', 'C.', 'Ş.']

function toDate(v) {
  if (v instanceof Date) return v
  if (!v) return null
  const s = String(v)
  /* `2026-06-29 19:01:00` (MySQL) → ISO; tək tarix `2026-06-29` yerli gün kimi */
  const d = /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(s + 'T00:00:00') : new Date(s.replace(' ', 'T'))
  return Number.isNaN(d.getTime()) ? null : d
}

/**
 * «29 iyn 2026» / «29 iyun 2026, 19:01»
 * @param {string|Date} v
 * @param {{time?: boolean, year?: boolean, long?: boolean}} opt
 */
export function azDate(v, { time = false, year = true, long = false } = {}) {
  const d = toDate(v)
  if (!d) return v ? String(v) : '—'
  let s = `${d.getDate()} ${(long ? MON_LONG : MON_SHORT)[d.getMonth()]}`
  if (year) s += ` ${d.getFullYear()}`
  if (time) s += `, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return s
}

/** Qısa həftə günü — «B.e.», «Ş.» */
export function azWeekdayShort(v) {
  const d = toDate(v)
  return d ? WEEKDAY_SHORT[d.getDay()] : ''
}

/** Admin səhifələrinin kənar boşluğu — telefonda 14px (əvvəl 36px idi) */
export function pagePadding(narrow) {
  return narrow ? '16px 14px 24px' : '32px 36px'
}
