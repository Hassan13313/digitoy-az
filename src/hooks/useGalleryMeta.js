import { useState, useEffect, useCallback, useRef } from 'react'
import { getGalleryMeta } from '../utils/api'

/* ─────────────────────────────────────────────────────────────────────────────
   useGalleryMeta — qalereya üz qapağı + CANLI sayğaclar (Phase 43)

   Bir mənbədən üç şey verir: toyun adı/tarixi, foto və video sayı, cütlüyün
   qapaq/stend ayarları.

   ⚠ BATAREYA QAYDASI (GalleryPage.jsx-dəki Phase 39 dərsi ilə eyni):
   interval YALNIZ tab görünəndə işləyir. Tab gizlənəndə tam dayanır, geri
   qayıdanda DƏRHAL bir dəfə yenilənir. Qalereya toy gecəsi saatlarla açıq
   qalır — arxa planda radionu oyatmaq telefonda ən bahalı əməliyyatdır.

   ⚠ SERVER ETag QAYTARIR: dəyişiklik olmayanda cavab 304-dür, yəni sorğu
   praktiki olaraq pulsuzdur.

   ⚠ XƏTA UDULUR: meta yüklənməsə komponent `null` görür və üz qapağını
   sadəcə göstərmir — qalereyanın özü (şəkillər) bundan ASILI DEYİL.
   ───────────────────────────────────────────────────────────────────────── */

const DEFAULT_INTERVAL = 20000

export function useGalleryMeta(slug, { interval = DEFAULT_INTERVAL, enabled = true } = {}) {
  const [meta,    setMeta]    = useState(null)
  const [loading, setLoading] = useState(Boolean(slug) && enabled)
  /* `failed` yalnız diaqnostika üçündür — UI heç vaxt xəta göstərmir,
     çünki üz qapağı olmadan da qalereya tam işləkdir. */
  const [failed,  setFailed]  = useState(false)

  /* Sökülmüşdən sonra setState çağırılmasın (React 19 xəbərdarlığı) */
  const aliveRef = useRef(true)
  useEffect(() => {
    aliveRef.current = true
    return () => { aliveRef.current = false }
  }, [])

  const refresh = useCallback(async () => {
    if (!slug || !enabled) return null
    try {
      const data = await getGalleryMeta(slug)
      if (!aliveRef.current) return null
      setMeta(data)
      setFailed(false)
      return data
    } catch {
      if (aliveRef.current) setFailed(true)
      return null
    } finally {
      if (aliveRef.current) setLoading(false)
    }
  }, [slug, enabled])

  useEffect(() => {
    if (!slug || !enabled) { setLoading(false); return }
    refresh()
  }, [slug, enabled, refresh])

  useEffect(() => {
    if (!slug || !enabled || !interval) return
    let timer = null

    const start = () => { if (timer === null) timer = setInterval(refresh, interval) }
    const stop  = () => { if (timer !== null) { clearInterval(timer); timer = null } }
    const onVisibility = () => {
      if (document.visibilityState === 'visible') { refresh(); start() } else stop()
    }

    if (document.visibilityState === 'visible') start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      stop()
    }
  }, [slug, enabled, interval, refresh])

  const counts = meta?.counts || { photos: 0, videos: 0, total: 0 }

  return {
    meta,
    loading,
    failed,
    refresh,
    counts,
    config: meta?.config || {},
    names:  meta?.names  || '',
    title:  meta?.title  || '',
    date:   meta?.date   || '',
    venue:  meta?.venue  || '',
    /* Dəvətnamə admin tərəfindən bağlanıbsa adlar verilmir (bax gallery_meta.php) */
    active: meta ? meta.active !== false : true,
  }
}

export default useGalleryMeta
