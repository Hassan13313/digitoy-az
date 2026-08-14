import { useState, useEffect, useRef } from 'react'
import TemplateCell from './TemplateCell'
import { RefreshCw, Search, X, ExternalLink, Calendar, MapPin } from 'lucide-react'

const BASE = import.meta.env.VITE_API_URL || '/api'

function getAdminToken() {
  try {
    const t = sessionStorage.getItem('adminToken')
    const e = parseInt(sessionStorage.getItem('adminTokenExp') || '0', 10)
    if (t && e && Date.now() < e * 1000) return t
  } catch {}
  return null
}

async function getInvitationsList(search = '', limit = 50, offset = 0) {
  const p = new URLSearchParams({ limit, offset })
  if (search) p.set('search', search)
  const token = getAdminToken()
  const res = await fetch(`${BASE}/get_invitations_list.php?${p}`, {
    headers: token ? { 'X-Admin-Token': token } : {},
  })
  if (!res.ok) throw new Error(`get_invitations_list: ${res.status}`)
  return res.json()
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('az-AZ', { day: '2-digit', month: 'short', year: 'numeric' })
}

const EVENT_LABELS = {
  toy: 'Toy', nishan: 'Nişan', birthday: 'Ad günü', corporate: 'Korporativ', other: 'Digər',
}

export default function AdminInvitationsList() {
  const [items,     setItems]     = useState([])
  const [total,     setTotal]     = useState(0)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [searchVal, setSearchVal] = useState('')
  const [search,    setSearch]    = useState('')
  const debounceRef = useRef(null)

  const load = (q = '') => {
    setLoading(true)
    setError('')
    getInvitationsList(q)
      .then(d => { setItems(d.invitations || []); setTotal(d.total || 0) })
      .catch(() => setError('Dəvətnamələr yüklənmədi.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSearch = (val) => {
    setSearchVal(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => { setSearch(val); load(val) }, 400)
  }

  const clearSearch = () => { setSearchVal(''); setSearch(''); load('') }

  return (
    <div style={{ padding: '32px 36px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{
            fontFamily: '"Cormorant Garamond","Playfair Display",serif',
            fontSize: 24, fontWeight: 300, color: 'oklch(20% 0.02 60)',
            margin: 0, letterSpacing: '-0.01em',
          }}>
            Dəvətnamələr
          </h1>
          <p style={{ fontSize: 12, color: 'oklch(55% 0.03 60)', margin: '4px 0 0' }}>
            {total} dəvətnamə{search ? ` — "${search}"` : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={13} strokeWidth={1.5} style={{ position: 'absolute', left: 10, color: 'oklch(60% 0.03 60)', pointerEvents: 'none' }} />
            <input
              type="text" placeholder="Slug, ad axtar..."
              value={searchVal} onChange={e => handleSearch(e.target.value)}
              style={{
                padding: '8px 32px 8px 30px', border: '1px solid oklch(85% 0.02 60)', borderRadius: 4,
                fontSize: 12, color: 'oklch(30% 0.02 60)', background: 'white', outline: 'none', width: 200,
              }}
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
      ) : items.length === 0 ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: 'oklch(60% 0.03 60)', fontSize: 13 }}>Dəvətnamə yoxdur.</div>
      ) : (
        <div style={{ background: 'white', border: '1px solid oklch(88% 0.02 60)', borderRadius: 6, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 110px 84px 110px 100px 30px', gap: 12, padding: '10px 20px', background: 'oklch(95% 0.01 75)', borderBottom: '1px solid oklch(88% 0.02 60)' }}>
            {['Slug', 'Ad', 'Şablon', 'Növ', 'Məkan', 'Yaradılma', ''].map((h, i) => (
              <span key={i} style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(50% 0.03 60)' }}>{h}</span>
            ))}
          </div>

          {items.map((inv, i) => (
            <div key={inv.slug} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 110px 84px 110px 100px 30px', gap: 12, padding: '13px 20px', borderBottom: i < items.length - 1 ? '1px solid oklch(93% 0.01 75)' : 'none', alignItems: 'center' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: 'oklch(45% 0.07 75)', letterSpacing: '0.04em' }}>
                {inv.slug}
              </span>
              <span style={{ fontSize: 13, color: 'oklch(25% 0.02 60)', fontWeight: 500 }}>
                {inv.names}
              </span>
              <TemplateCell templateId={inv.template_id} />
              <span style={{ fontSize: 11, color: 'oklch(50% 0.04 75)' }}>
                {EVENT_LABELS[inv.event_type] || inv.event_type || '—'}
              </span>
              <span style={{ fontSize: 11, color: 'oklch(55% 0.03 60)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {inv.venue || '—'}
              </span>
              <span style={{ fontSize: 11, color: 'oklch(60% 0.03 60)' }}>
                {formatDate(inv.created_at)}
              </span>
              <a
                href={`/invite/${inv.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'oklch(55% 0.07 80)', display: 'flex', alignItems: 'center' }}
                title="Admin redaktə görünüşü"
              >
                <ExternalLink size={13} strokeWidth={1.5} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
