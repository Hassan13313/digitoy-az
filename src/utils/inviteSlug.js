/* ─────────────────────────────────────────────────────────────────────────────
   Dəvətnamə slug-ı — TƏK MƏNBƏ (Phase 46).

   Builder-in «Sifarişi təsdiqlə» düyməsi və admin sifariş səhifəsinin
   «Təsdiq et» düyməsi eyni slug-ı hesablamalıdır. Server (save_invitation.php
   › slug_alloc.php) bunun üzərinə sifariş koduna bağlı suffiks əlavə edir.
   Əvvəl bu kod BuilderForm.jsx-in içində idi.
   ───────────────────────────────────────────────────────────────────────── */

const COUPLE_TYPES = ['toy', 'nishan']
const CORP_TYPES   = ['corporate', 'other']

/** Ad → URL slug (AZ hərfləri latın qarşılığına) */
export function toSlug(str = '') {
  const MAP = {
    ə: 'e', Ə: 'e', ğ: 'g', Ğ: 'g', ı: 'i', İ: 'i', ö: 'o', Ö: 'o', ü: 'u', Ü: 'u', ş: 's', Ş: 's', ç: 'c', Ç: 'c',
    á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ñ: 'n', ä: 'a',
  }
  return str
    .split('').map(c => MAP[c] || c).join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** form_data → əsas slug (gelin-ve-bey · tədbir adı · şəxsin adı) */
export function computeInviteSlug(data = {}) {
  if (COUPLE_TYPES.includes(data.eventType)) return `${toSlug(data.brideName)}-ve-${toSlug(data.groomName)}`
  if (CORP_TYPES.includes(data.eventType)) return toSlug(data.eventName || 'tedbir')
  return toSlug(data.brideName || 'davetname')
}
