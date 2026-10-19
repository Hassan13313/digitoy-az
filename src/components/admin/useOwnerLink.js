import { useCallback, useEffect, useState } from 'react'
import { getOwnerLink, rotateOwnerLink } from '../../utils/ownerApi'

/* ─────────────────────────────────────────────────────────────────────────────
   «Müştəri paneli» linki — admin tərəfi (Phase 50).

   Link ilk istəkdə yaranır və sonra HƏMİŞƏ eynidir (admin istənilən qədər
   kopyalaya bilər). `rotate()` yeni açar yazır — köhnə link dərhal bağlanır.
   ───────────────────────────────────────────────────────────────────────── */
export function useOwnerLink(slug) {
  const [result, setResult] = useState({ slug: null, url: '', error: '' })
  const [rotating, setRotating] = useState(false)

  useEffect(() => {
    if (!slug) return undefined
    let alive = true
    getOwnerLink(slug)
      .then((d) => { if (alive) setResult({ slug, url: d?.url || '', error: '' }) })
      .catch((e) => {
        if (!alive) return
        const error = e.status === 401 ? 'Sessiya bitib — yenidən daxil olun.'
          : e.status === 404 ? 'Dəvətnamə tapılmadı.'
          : 'Link alınmadı. Bir az sonra yenidən yoxlayın.'
        setResult({ slug, url: '', error })
      })
    return () => { alive = false }
  }, [slug])

  const rotate = useCallback(async () => {
    setRotating(true)
    try {
      const d = await rotateOwnerLink(slug)
      setResult({ slug, url: d?.url || '', error: '' })
      return true
    } catch {
      return false
    } finally {
      setRotating(false)
    }
  }, [slug])

  const current = result.slug === slug
  return {
    url: current ? result.url : '',
    error: current ? result.error : '',
    loading: Boolean(slug) && !current,
    rotating,
    rotate,
  }
}
