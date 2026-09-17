import { useState, useEffect } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
   useIsNarrow — admin panelin telefon rejimi (Phase 42.1).

   NƏ ÜÇÜN: admin panel masaüstü üçün qurulub — yan menyu, 860px-lik cədvəl
   sətirləri, 3 sütunlu kartlar. Samsung S24 Ultra-nın CSS viewport-u
   **412 × 915 dp**-dir (fiziki 1440px, amma DPR 3.5). O enin altında həmin
   düzümlər ya kəsilir, ya da üfüqi sürüşmə tələb edir.

   Sərhəd 900px seçilib: bu, yan menyu + məzmunun rahat sığdığı ən kiçik
   endir; ondan aşağıda düzüm şaquliyə keçir.

   ⚠ CSS media query ƏVƏZİNƏ JS: admin komponentləri inline `style` işlədir
   (Tailwind class-ları yoxdur), ona görə şərt JS-də hesablanmalıdır.
   ⚠ SSR yoxdur, amma `typeof window` yoxlaması qalır — build zamanı bu
   modul node-da da yüklənə bilər (testlər).
   ───────────────────────────────────────────────────────────────────────── */

const QUERY = '(max-width: 900px)'

export function useIsNarrow(query = QUERY) {
  const [narrow, setNarrow] = useState(
    () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false),
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e) => setNarrow(e.matches)
    mq.addEventListener('change', onChange)
    /* ⚠ Burada `setNarrow(mq.matches)` ÇAĞIRILMIR: ilkin dəyər onsuz da
       `useState`-in initializer-ində eyni sorğudan oxunur, təkrar çağırış
       isə effekt daxilində sinxron setState olardı (kaskad render). */
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return narrow
}

export default useIsNarrow
