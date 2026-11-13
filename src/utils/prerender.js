/* ─────────────────────────────────────────────────────────────────────────────
   PRERENDER (2026-11-14) — ana səhifə serverdə hazır HTML ilə verilir.

   NƏ ÜÇÜN: SPA qabığında ilk ekran JS (~190 KB gzip) yüklənib icra olunana
   qədər boş qalırdı — zəif mobil şəbəkədə LCP ~4.7 s (PageSpeed mobil 82),
   Google-un ilk keçidi isə xam HTML-də yalnız <noscript> mətnini görürdü.
   İndi `npm run build` sonunda scripts/prerender.mjs LandingPage-i HTML-ə
   çevirir (dist/_prerender/home.html), seo.php onu `<div id="root" data-pre="/">`
   içinə qoyur. JS gələndə React həmin məzmunu eyni görünüşlü öz ağacı ilə
   əvəz edir (hydrate yox — sadə və etibarlı).

   IS_SSR        — Node-da prerender gedir (scripts/prerender.mjs bayrağı qoyur)
   PRERENDERED   — səhifə hazır HTML ilə açılıb (seo.php `data-pre` yazıb)
   STATIC_INTRO  — ilk ekranın giriş animasiyaları oynadılmır: ya serverdə
                   render gedir (mətn HTML-də görünən olmalıdır), ya da mətn
                   artıq ekrandadır (yenidən gizlədib «uçurmaq» göz qırpması olar).
   ───────────────────────────────────────────────────────────────────────── */

export const IS_SSR = typeof globalThis !== 'undefined' && globalThis.__DT_SSR__ === true

export const PRERENDERED = typeof document !== 'undefined'
  && !!document.getElementById('root')?.hasAttribute('data-pre')

export const STATIC_INTRO = IS_SSR || PRERENDERED
