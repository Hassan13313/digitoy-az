/* ─────────────────────────────────────────────────────────────────────────────
   PRERENDER (2026-11-14) — ana səhifə serverdə hazır HTML ilə verilir.

   NƏ ÜÇÜN: SPA qabığında ilk ekran JS (~190 KB gzip) yüklənib icra olunana
   qədər boş qalırdı — zəif mobil şəbəkədə LCP ~4.7 s (PageSpeed mobil 82),
   Google-un ilk keçidi isə xam HTML-də yalnız <noscript> mətnini görürdü.
   İndi `npm run build` sonunda scripts/prerender.mjs «/», /templates və
   /sablonlar/* səhifələrini HTML-ə çevirir (dist/_prerender/), seo.php onu
   `<div id="root" data-pre="<yol>">` içinə qoyur, main.jsx isə hydrateRoot ilə
   həmin DOM-u yerində «canlandırır» (yenidən çəkmir — LCP ilk boyamada qalır).

   QAYDA: brauzerin İLK render-i serverinki ilə eyni olmalıdır. Server bilmədiyi
   şeyə (ekran ölçüsü, localStorage, «hərəkəti azalt», vaxt) görə fərqli DOM
   çəkmək olmaz — dəyəri mount-dan sonra (useEffect) götürün. Fərq olanda React
   #418 verir və bütün səhifəni yenidən çəkir (main.jsx konsola yazır).

   IS_SSR        — Node-da prerender gedir (scripts/prerender.mjs bayrağı qoyur)
   PRERENDERED   — səhifə hazır HTML ilə açılıb (seo.php `data-pre` yazıb)
   STATIC_INTRO  — ilk ekranın giriş animasiyaları oynadılmır: ya serverdə
                   render gedir (mətn HTML-də görünən olmalıdır), ya da mətn
                   artıq ekrandadır (yenidən gizlədib «uçurmaq» göz qırpması olar).
   ───────────────────────────────────────────────────────────────────────── */

import { useSyncExternalStore } from 'react'

export const IS_SSR = typeof globalThis !== 'undefined' && globalThis.__DT_SSR__ === true

export const PRERENDERED = typeof document !== 'undefined'
  && !!document.getElementById('root')?.hasAttribute('data-pre')

export const STATIC_INTRO = IS_SSR || PRERENDERED

/* «Hərəkəti azalt» (iOS/Android ayarı) — server bunu bilmir və `false` çəkir. useSyncExternalStore
   hidrasiya zamanı server dəyərini (false) götürür — DOM eyni qalır (yoxsa #418), dərhal sonra
   həqiqi dəyərlə yenidən render edir. Hazır HTML-siz açılışda dəyər ilk render-dən doğrudur. */
const reducedMotionQuery = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null
const subscribeReducedMotion = (onChange) => {
  reducedMotionQuery?.addEventListener?.('change', onChange)
  return () => reducedMotionQuery?.removeEventListener?.('change', onChange)
}
export function useHydrationSafeReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, () => !!reducedMotionQuery?.matches, () => false)
}
