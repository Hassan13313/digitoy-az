import { useState, useEffect, useRef } from 'react'
import { RefreshCw, Search, X, Camera, HardDrive, Images, Upload } from 'lucide-react'

const BASE = (typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? 'https://digitoy.az/api' : '/api'

function getAdminToken() {
  try {
    const t = sessionStorage.getItem('adminToken')
    const e = parseInt(sessionStorage.getItem('adminTokenExp') || '0', 10)
    if (t && e && Date.now() < e * 1000) return t
  } catch {}
  return null
}

async function getPhotosSummary(search = '', limit = 50, offset = 0) {
  const p = new URLSearchParams({ limit, offset })
  if (search) p.set('search', search)
  const token = getAdminToken()
  const res = await fetch(`${BASE}/get_photos_summary.php?${p}`, {
    headers: token ? { 'X-Admin-Token': token } : {},
  })
  if (!res.ok) throw new Error(`get_photos_summary: ${res.status}`)
  return res.json()
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('az-AZ', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminPhotosList() {
  const [albums,    setAlbums]    = useState([])
  const [total,     setTotal]     = useState(0)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [searchVal, setSearchVal] = useState('')
  const [search,    setSearch]    = useState('')
  const debounceRef = useRef(null)

  const load = (q = '') => {
    setLoading(true)
    setError('')
    getPhotosSummary(q)
      .then(d => { setAlbums(d.albums || []); setTotal(d.total || 0) })
      .catch(() => setError('Foto məlumatları yüklənmədi.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSearch = (val) => {
    setSearchVal(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => { setSearch(val); load(val) }, 400)
  }

  const clearSearch = () => { setSearchVal(''); setSearch(''); load('') }

  const totalPhotos = albums.reduce((s, a) => s + a.photo_count, 0)
  const totalMb     = albums.reduce((s, a) => s + (a.total_mb || 0), 0).toFixed(1)

  return (
    <div style={{ padding: '32px 36px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{
            fontFamily: '"Cormorant Garamond","Playfair Display",serif',
            fontSize: 24, fontWeight: 300, color: 'oklch(20% 0.02 60)',
            margin: 0, letterSpacing: '-0.01em',
          }}>
            Fotolar
          </h1>
          <p style={{ fontSize: 12, color: 'oklch(55% 0.03 60)', margin: '4px 0 0' }}>
            {total} albom · {totalPhotos} foto · {totalMb} MB
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={13} strokeWidth={1.5} style={{ position: 'absolute', left: 10, color: 'oklch(60% 0.03 60)', pointerEvents: 'none' }} />
            <input
              type="text" placeholder="Slug axtar..."
              value={searchVal} onChange={e => handleSearch(e.target.value)}
              style={{ padding: '8px 32px 8px 30px', border: '1px solid oklch(85% 0.02 60)', borderRadius: 4, fontSize: 12, color: 'oklch(30% 0.02 60)', background: 'white', outline: 'none', width: 180 }}
            />
            {searchVal && (
              <button type="button" onClick={clearSearch} style={{ position: 'absolute', right: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'oklch(60% 0.03 60)', display: 'flex', alignItems: 'center' }}>
                <X size={12} strokeWidth={2} />
              </button>
            )}
          </div>
          <button type="button" onClick={() => load(search)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'white', border: '1px solid oklch(85% 0.02 60)', borderRadius: 4, cursor: 'pointer', fontSize: 11, color: 'oklch(45% 0.03 60)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <RefreshCw size={12} strokeWidth={1.5} />
            Yenilə
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: 'oklch(60% 0.03 60)', fontSize: 13 }}>Yüklənir...</div>
      ) : error ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: 'oklch(45% 0.1 25)', fontSize: 13 }}>{error}</div>
      ) : albums.length === 0 ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: 'oklch(60% 0.03 60)', fontSize: 13 }}>Foto yoxdur.</div>
      ) : (
        <div style={{ background: 'white', border: '1px solid oklch(88% 0.02 60)', borderRadius: 6, overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 160px 72px', gap: 16, padding: '10px 20px', background: 'oklch(95% 0.01 75)', borderBottom: '1px solid oklch(88% 0.02 60)' }}>
            {['Slug', 'Foto', 'Ölçü', 'Son yükləmə', 'Əməliyyat'].map((h, i) => (
              <span key={i} style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(50% 0.03 60)' }}>{h}</span>
            ))}
          </div>

          {albums.map((alb, i) => (
            <div key={alb.slug} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 160px 72px', gap: 16, padding: '13px 20px', borderBottom: i < albums.length - 1 ? '1px solid oklch(93% 0.01 75)' : 'none', alignItems: 'center' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: 'oklch(42% 0.07 75)', letterSpacing: '0.04em' }}>
                {alb.slug}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Camera size={11} strokeWidth={1.5} style={{ color: 'oklch(60% 0.04 75)' }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: 'oklch(25% 0.02 60)' }}>{alb.photo_count}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <HardDrive size={11} strokeWidth={1.5} style={{ color: 'oklch(60% 0.04 75)' }} />
                <span style={{ fontSize: 12, color: 'oklch(50% 0.03 60)' }}>{alb.total_mb} MB</span>
              </div>
              <span style={{ fontSize: 11, color: 'oklch(60% 0.03 60)' }}>
                {formatDate(alb.last_upload)}
              </span>

              {/* Əməliyyat düymələri */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <a
                  href={`/invite/${alb.slug}/qalereya-idare`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Qalereyanı idarə et"
                  style={{
                    width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'oklch(94% 0.03 80)', borderRadius: 4,
                    color: 'oklch(45% 0.08 75)', textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'oklch(88% 0.05 80)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'oklch(94% 0.03 80)' }}
                >
                  <Images size={13} strokeWidth={1.5} />
                </a>
                <a
                  href={`/invite/${alb.slug}/foto`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Foto yükləmə səhifəsi"
                  style={{
                    width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'oklch(94% 0.03 145)', borderRadius: 4,
                    color: 'oklch(38% 0.1 145)', textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'oklch(88% 0.06 145)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'oklch(94% 0.03 145)' }}
                >
                  <Upload size={13} strokeWidth={1.5} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
