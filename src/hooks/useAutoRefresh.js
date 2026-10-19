import { useCallback, useEffect, useState } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
   useAutoRefresh — «canlı» məlumat üçün sayğac (Phase 50, Müştəri paneli).

   `tick` hər `ms`-dən bir artır, YALNIZ tab görünəndə. Tab gizlənəndə interval
   dayanır (batareya, server yükü); geri qayıdanda DƏRHAL bir dəfə artır ki,
   müştəri köhnə rəqəmə baxmasın. GalleryPage.jsx-dəki eyni nümunədir.
   İstifadə: `tick`-i yükləmə effektinin asılılıqlarına qoy; `refresh()` — əl ilə.
   ───────────────────────────────────────────────────────────────────────── */
export function useAutoRefresh(ms = 60000, enabled = true) {
  const [tick, setTick] = useState(0)
  const refresh = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    if (!enabled) return undefined
    let timer = null
    const start = () => { if (timer === null) timer = setInterval(refresh, ms) }
    const stop = () => { if (timer !== null) { clearInterval(timer); timer = null } }
    const onVisibility = () => {
      if (document.visibilityState === 'visible') { refresh(); start() } else stop()
    }
    if (document.visibilityState === 'visible') start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      stop()
    }
  }, [ms, enabled, refresh])

  return [tick, refresh]
}
