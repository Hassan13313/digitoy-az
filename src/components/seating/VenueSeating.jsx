import { useCallback, useEffect, useState } from 'react'
import SeatingPlanner from './SeatingPlanner'

/* ─────────────────────────────────────────────────────────────────────────────
   Restoran / menecer üçün YALNIZ BAXIŞ: /invite/<slug>/zal#k=<açar> (2026-11-26, v53)
   Açar URL fragment-indədir (serverə, Referer-ə, önbaxış botuna getmir), bu
   tabda sessionStorage-da saxlanılır və ünvan sətrindən silinir.
   Server: api/seating_view.php — yalnız ad, masa, say (telefon/qeyd/tərəf yox).
   ───────────────────────────────────────────────────────────────────────── */

const API = import.meta.env.VITE_API_URL || '/api'
const KEY_RE = /^[a-f0-9]{48}$/

function boot() {
  const m = window.location.pathname.match(/^\/invite\/([^/?#]+)\/zal\/?$/)
  const slug = m ? decodeURIComponent(m[1]) : ''
  const h = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const fromUrl = h.get('k')
  let key = KEY_RE.test(fromUrl || '') ? fromUrl : null
  try {
    if (key) sessionStorage.setItem(`dt_venue_${slug}`, key)
    else key = sessionStorage.getItem(`dt_venue_${slug}`)
  } catch { /* gizli rejim */ }
  if (fromUrl) window.history.replaceState(null, '', window.location.pathname)
  return { slug, key: KEY_RE.test(key || '') ? key : null }
}

export default function VenueSeating() {
  const [{ slug, key }] = useState(boot)
  const [data, setData] = useState(null)
  const [error, setError] = useState(key ? '' : 'invalid')

  const load = useCallback(() => {
    if (!slug || !key) return Promise.resolve()
    return fetch(`${API}/seating_view.php?slug=${encodeURIComponent(slug)}`, { headers: { 'X-Venue-Key': key } })
      .then((r) => {
        if (r.status === 401) { setError('invalid'); return null }
        if (!r.ok) throw new Error(String(r.status))
        return r.json()
      })
      .then((d) => { if (d) { setData(d); setError('') } })
      .catch(() => setError('network'))
  }, [slug, key])
  useEffect(() => { load() }, [load])

  const when = [data?.date, data?.time].filter(Boolean).join(', ')
  return (
    <main style={{ maxWidth: 1240, margin: '0 auto', padding: '24px 16px 80px', background: '#F4F1EA', minHeight: '100vh' }}>
      <header style={{ marginBottom: 18 }}>
        <p style={{ margin: 0, fontSize: 13, color: '#84652A' }}>Oturma planı — restoran üçün</p>
        <h1 style={{ margin: '4px 0 2px', font: '700 30px "Cormorant Garamond","Playfair Display",Georgia,serif', color: '#2C2523' }}>{data?.names || 'Oturma planı'}</h1>
        {(when || data?.venue) && <p style={{ margin: 0, color: '#6B5E54', fontSize: 14 }}>{[when, data?.venue].filter(Boolean).join(' — ')}</p>}
      </header>
      {error === 'invalid' && <p role="alert" style={{ padding: 16, borderRadius: 12, background: '#F7E9E4', color: '#9A3B2E' }}>Link etibarsızdır və ya yenilənib. Toy sahibindən yeni link istəyin.</p>}
      {error === 'network' && <p role="alert" style={{ padding: 16, borderRadius: 12, background: '#F7E9E4', color: '#9A3B2E' }}>Plan yüklənmədi. İnterneti yoxlayıb səhifəni yeniləyin.</p>}
      {!error && (
        <SeatingPlanner data={data} loading={!data} readOnly title={data?.names || ''} views={['cards', 'map']} roNote=""
          api={{}} onReload={load} />
      )}
    </main>
  )
}
