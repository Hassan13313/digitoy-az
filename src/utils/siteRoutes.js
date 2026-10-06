/* ══════════════════════════════════════════════════════════════════════════
   Phase 47 — ictimai marşrutların yoxlanışı (App.jsx + testlər).

   Saf modul: DOM-a yalnız navigateSpa/spaClick toxunur.
   ⚠ public/seo.php ilə UYĞUN olmalıdır: server naməlum yola HTTP 404 verir,
   SPA isə eyni yolda «Səhifə tapılmadı» ekranını göstərir
   (tests/site_routes_test.mjs).
   ══════════════════════════════════════════════════════════════════════ */

import { LEGAL_DOCS } from '../data/legal/docs.js'

/** '/demo/' → '/demo'; hash/sorğu atılır */
function norm(pathname) {
  const p = String(pathname || '/').split(/[?#]/)[0].replace(/\/+$/, '')
  return p === '' ? '/' : p
}

/** '/mexfilik' → 'privacy' və s.; deyilsə null */
export function matchLegalRoute(pathname) {
  const p = norm(pathname)
  return LEGAL_DOCS.find((d) => d.path === p)?.id ?? null
}

/** SPA-nın tanıdığı yol? Yalnız slug-suz yollar üçün çağırılır (App.jsx routeAfterAuth). */
export function isKnownSpaPath(pathname) {
  const p = norm(pathname)
  return p === '/' || p === '/index.html' || p === '/demo' || p === '/templates' || p === '/preview/live'
    || matchLegalRoute(p) !== null
    || /^\/demo\/template\/[^/]+$/.test(p)
    || /^\/admin(\/.*)?$/.test(p)
    || /^\/invite\/[^/]+(\/[^/]*)?$/.test(p)
}

/** Səhifəni yeniləmədən keçid — App.jsx `digitoy:navigate`-i dinləyir */
export function navigateSpa(path) {
  window.dispatchEvent(new CustomEvent('digitoy:navigate', { detail: { path } }))
}

/** <a href> üçün: adi klikdə SPA keçidi; Ctrl/Cmd/Shift/orta klikdə brauzerin öz davranışı */
export function spaClick(e, path) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  e.preventDefault()
  navigateSpa(path)
}
