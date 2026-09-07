import { useState, useEffect, useRef } from 'react'
import TemplateCell from './TemplateCell'
import AdminTranslations from './AdminTranslations'
import { setInvitationActive } from '../../utils/api'
import { RefreshCw, Search, X, ExternalLink, Languages, Power } from 'lucide-react'

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

/* Sütun şəbəkəsi bir yerdə — başlıq və sətirlər HƏMİŞƏ eyni qalsın deyə */
const GRID = '118px 1fr 92px 70px 92px 84px 78px 78px'

export default function AdminInvitationsList() {
  const [items,     setItems]     = useState([])
  const [total,     setTotal]     = useState(0)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [searchVal, setSearchVal] = useState('')
  const [search,    setSearch]    = useState('')
  /* Phase 36 — aktiv/deaktiv: iki addımlı təsdiq (brauzer confirm() YOX) */
  const [confirmSlug, setConfirmSlug] = useState(null)
  const [busySlug,    setBusySlug]    = useState(null)
  const [trSlug,      setTrSlug]      = useState(null)   /* açıq tərcümə modalı */
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

  /* ── Linki aç / bağla ──
     Yalnız `invitations.is_active` dəyişir: slug, QR, qalereya, upload
     qovluğu və form_data TOXUNULMUR — geri qaytarmaq bir kliklikdir. */
  const toggleActive = async (slug, nextActive) => {
    setBusySlug(slug)
    setError('')
    try {
      await setInvitationActive(slug, nextActive)
      setItems(prev => prev.map(x => (x.slug === slug ? { ...x, is_active: nextActive } : x)))
      setConfirmSlug(null)
    } catch (e) {
      setError(e?.message || 'Status dəyişdirilə bilmədi.')
    } finally {
      setBusySlug(null)
    }
  }

  return (
    <div style={{ padding: '32px 36px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
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
              <button type="button" onClick={clearSearch} aria-label="Axtarışı təmizlə" style={{ position: 'absolute', right: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'oklch(60% 0.03 60)', display: 'flex', alignItems: 'center' }}>
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

      {error && (
        <div style={{ marginBottom: 14, padding: '10px 14px', border: '1px solid oklch(48% 0.15 25)', borderRadius: 4, color: 'oklch(48% 0.15 25)', fontSize: 12, background: 'oklch(97% 0.02 25)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: 'oklch(60% 0.03 60)', fontSize: 13 }}>Yüklənir...</div>
      ) : items.length === 0 ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: 'oklch(60% 0.03 60)', fontSize: 13 }}>Dəvətnamə yoxdur.</div>
      ) : (
        <div style={{ background: 'white', border: '1px solid oklch(88% 0.02 60)', borderRadius: 6, overflowX: 'auto' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: GRID, gap: 10, padding: '10px 20px', background: 'oklch(95% 0.01 75)', borderBottom: '1px solid oklch(88% 0.02 60)', minWidth: 860 }}>
            {['Slug', 'Ad', 'Şablon', 'Növ', 'Məkan', 'Yaradılma', 'Status', 'Əməliyyat'].map((h, i) => (
              <span key={i} style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(50% 0.03 60)' }}>{h}</span>
            ))}
          </div>

          {items.map((inv, i) => {
            /* Sahə yoxdursa (köhnə backend) AKTİV sayılır — link bağlı görünməsin */
            const active = inv.is_active !== false
            const confirming = confirmSlug === inv.slug
            const busy = busySlug === inv.slug
            return (
              <div key={inv.slug} style={{
                display: 'grid', gridTemplateColumns: GRID, gap: 10, minWidth: 860,
                padding: '13px 20px',
                borderBottom: i < items.length - 1 ? '1px solid oklch(93% 0.01 75)' : 'none',
                alignItems: 'center',
                background: confirming ? 'oklch(97% 0.02 25)' : 'transparent',
                opacity: active ? 1 : 0.62,
              }}>
                <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: 'oklch(45% 0.07 75)', letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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

                {/* ── Status nişanı ── */}
                <span style={{
                  justifySelf: 'start',
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '3px 8px', borderRadius: 3,
                  fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600,
                  border: `1px solid ${active ? 'oklch(80% 0.06 150)' : 'oklch(82% 0.04 25)'}`,
                  color: active ? 'oklch(45% 0.1 150)' : 'oklch(48% 0.13 25)',
                  background: active ? 'oklch(97% 0.02 150)' : 'oklch(97% 0.02 25)',
                  whiteSpace: 'nowrap',
                }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: active ? 'oklch(58% 0.14 150)' : 'oklch(58% 0.16 25)',
                  }} />
                  {active ? 'Aktiv' : 'Deaktiv'}
                </span>

                {/* ── Əməliyyatlar ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                  {confirming ? (
                    <>
                      <button
                        type="button" disabled={busy}
                        onClick={() => toggleActive(inv.slug, !active)}
                        style={{
                          padding: '4px 7px', borderRadius: 3, border: 'none', cursor: 'pointer',
                          background: active ? 'oklch(48% 0.15 25)' : 'oklch(45% 0.1 150)',
                          color: 'white', fontSize: 9.5, letterSpacing: '0.05em',
                          textTransform: 'uppercase', opacity: busy ? 0.6 : 1, whiteSpace: 'nowrap',
                        }}
                      >
                        {busy ? '...' : 'Təsdiq'}
                      </button>
                      <button
                        type="button" onClick={() => setConfirmSlug(null)} aria-label="Ləğv et"
                        style={{ padding: '4px 5px', borderRadius: 3, border: '1px solid oklch(88% 0.02 60)', background: 'white', cursor: 'pointer', color: 'oklch(55% 0.03 60)', display: 'flex' }}
                      >
                        <X size={11} strokeWidth={2} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button" onClick={() => setTrSlug(inv.slug)}
                        title={`Məzmun tərcüməsi${inv.has_i18n?.en || inv.has_i18n?.ru ? ' (mövcuddur)' : ''}`}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', padding: 3, display: 'flex',
                          color: (inv.has_i18n?.en || inv.has_i18n?.ru) ? 'oklch(45% 0.1 150)' : 'oklch(62% 0.03 60)',
                        }}
                      >
                        <Languages size={13} strokeWidth={1.5} />
                      </button>
                      <button
                        type="button" onClick={() => setConfirmSlug(inv.slug)}
                        title={active ? 'Linki deaktiv et' : 'Linki yenidən aktiv et'}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', padding: 3, display: 'flex',
                          color: active ? 'oklch(48% 0.13 25)' : 'oklch(45% 0.1 150)',
                        }}
                      >
                        <Power size={13} strokeWidth={1.6} />
                      </button>
                      <a
                        href={`/invite/${inv.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'oklch(55% 0.07 80)', display: 'flex', alignItems: 'center', padding: 3 }}
                        title="Dəvətnaməni aç"
                      >
                        <ExternalLink size={13} strokeWidth={1.5} />
                      </a>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {trSlug && (
        <AdminTranslations
          key={trSlug}
          slug={trSlug}
          onClose={() => setTrSlug(null)}
          onSaved={(i18n) => setItems(prev => prev.map(x => (
            x.slug === trSlug
              ? { ...x, has_i18n: { en: !!i18n?.en, ru: !!i18n?.ru } }
              : x
          )))}
        />
      )}
    </div>
  )
}
