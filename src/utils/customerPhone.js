/* ─────────────────────────────────────────────────────────────────────────────
   Müştərinin əlaqə nömrəsi (Phase 50) — builderdə könüllü sahə.

   ⚠ Nömrə form_data-ya YAZILMIR: form_data təsdiqdən sonra dəvətnamədə
   ictimai qaytarılır (get_invitation.php) və qonaqlar onu görərdi. Nömrə
   ayrıca state-də saxlanılır və yalnız draft_invitations.customer_phone-a
   gedir (save_draft / submit_draft).

   normalizeCustomerPhone — public/api/phone_lib.php ilə HƏRFBƏHƏRF eyni
   qayda; hər ikisi tests/fixtures/phone_cases.json ilə yoxlanılır.
   ───────────────────────────────────────────────────────────────────────── */

import { waChatUrl } from './waLink.js'

const STORE_KEY = 'digitoy_customer_phone'

/** 050 123 45 67 · 501234567 · 994… · 00994… · +994… → +994XXXXXXXXX; digər «+» (7–15 rəqəm) → +<rəqəmlər>; qalanı → null */
export function normalizeCustomerPhone(raw) {
  if (typeof raw !== 'string') return null
  const s = raw.trim()
  if (s === '' || s.length > 40) return null
  if (!/^\+?[0-9\s\-().]+$/.test(s)) return null

  let plus = s[0] === '+'
  let digits = s.replace(/\D/g, '')

  if (!plus && digits.startsWith('00')) {
    digits = digits.slice(2)
    plus = true
  }
  if (digits.length === 12 && digits.startsWith('994')) return '+' + digits
  if (!plus && digits.length === 10 && digits[0] === '0') return '+994' + digits.slice(1)
  /* 9 rəqəm: operator kodu ilə (50…, 70…). «0» ilə başlayırsa yerli nömrədir və bir rəqəm əskikdir */
  if (!plus && digits.length === 9 && digits[0] !== '0') return '+994' + digits
  if (plus && digits.length >= 7 && digits.length <= 15) return '+' + digits
  return null
}

/** +994501234567 → «+994 50 123 45 67»; digər nömrələr olduğu kimi */
export function formatPhoneDisplay(phone) {
  const m = /^\+994(\d{2})(\d{3})(\d{2})(\d{2})$/.exec(phone || '')
  return m ? `+994 ${m[1]} ${m[2]} ${m[3]} ${m[4]}` : (phone || '')
}

/** Müştəriyə WhatsApp linki (nömrə tanınmırsa undefined). `encodedText` — encodeURIComponent olunmuş mətn */
export function customerWaUrl(phone, encodedText = '') {
  const n = normalizeCustomerPhone(phone)
  return n ? waChatUrl(n, encodedText) : undefined
}

/** Builder sessiyasında yazılmış nömrə (önbaxışdan «Sifariş et» üçün) */
export function readCustomerPhone() {
  try { return sessionStorage.getItem(STORE_KEY) || '' } catch { return '' }
}

export function saveCustomerPhone(value) {
  try {
    if (value) sessionStorage.setItem(STORE_KEY, value)
    else sessionStorage.removeItem(STORE_KEY)
  } catch { /* private rejim */ }
}
