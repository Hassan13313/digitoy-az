import { useState, useEffect, useRef } from 'react'
import { RefreshCw, Search, X, Trash2, ExternalLink, MessageSquare } from 'lucide-react'
import { getAdminGuestbook, deleteGuestbookMessage } from '../../utils/api'

/* ─────────────────────────────────────────────────────────────────────────────
   TƏBRİK MƏKTUBLARI — admin moderasiyası (Phase 36).

   Qonaqların yazdığı mesajlarda spam / təhqir / səhv məzmun ola bilər.
   Bu panel həmin mesajları göstərir və silməyə imkan verir.

   ⚠ QONAĞIN AXINI DƏYİŞMİR: yazma forması, `submit_guest_response.php` və
   dəvətnamədəki `Guestbook` bölməsi toxunulmur.

   ⚠ SİLMƏ RSVP-ni MƏHV ETMİR: eyni sətirdə iştirak cavabı varsa yalnız mesaj
   mətni silinir (backend qərar verir — bax `admin_guestbook.php`). Panel
   həmin sətirləri «RSVP» nişanı ilə göstərir ki, admin nə olacağını bilsin.
   ───────────────────────────────────────────────────────────────────────── */

const C = {
  ink:    'oklch(20% 0.02 60)',
  text:   'oklch(25% 0.02 60)',
  sub:    'oklch(55% 0.03 60)',
  faint:  'oklch(60% 0.03 60)',
  line:   'oklch(88% 0.02 60)',
  hair:   'oklch(93% 0.01 75)',
  head:   'oklch(95% 0.01 75)',
  gold:   'oklch(45% 0.07 75)',
  danger: 'oklch(48% 0.15 25)',
}

function formatDateTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso.replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('az-AZ', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminGuestbook() {
  const [items,     setItems]     = useState([])
  const [total,     setTotal]     = useState(0)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [searchVal, setSearchVal] = useState('')
  const [search,    setSearch]    = useState('')
  /* İki addımlı silmə — brauzer confirm() dialoqu İSTİFADƏ EDİLMİR */
  const [confirmId, setConfirmId] = useState(null)
  const [busyId,    setBusyId]    = useState(null)
  const debounceRef = useRef(null)

  const load = (q = '') => {
    setLoading(true)
    setError('')
    getAdminGuestbook({ search: q })
      .then((d) => { setItems(d.messages || []); setTotal(d.total || 0) })
      .catch(() => setError('Mesajlar yüklənmədi.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSearch = (val) => {
    setSearchVal(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => { setSearch(val); load(val) }, 400)
  }

  const clearSearch = () => { setSearchVal(''); setSearch(''); load('') }

  const handleDelete = async (id) => {
    setBusyId(id)
    try {
      await deleteGuestbookMessage(id)
      /* Optimistik deyil — server təsdiqindən SONRA siyahıdan çıxarılır,
         ona görə "silindi" göstərib geri qayıtma problemi yaranmır. */
      setItems((prev) => prev.filter((m) => m.id !== id))
      setTotal((n) => Math.max(0, n - 1))
      setConfirmId(null)
    } catch (e) {
      setError(e?.message || 'Mesaj silinmədi.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{
            fontFamily: '"Cormorant Garamond","Playfair Display",serif',
            fontSize: 24, fontWeight: 300, color: C.ink, margin: 0, letterSpacing: '-0.01em',
          }}>
            Təbrik Məktubları
          </h1>
          <p style={{ fontSize: 12, color: C.sub, margin: '4px 0 0' }}>
            {total} mesaj{search ? ` — "${search}"` : ''}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={13} strokeWidth={1.5} style={{ position: 'absolute', left: 10, color: C.faint, pointerEvents: 'none' }} />
            <input
              type="text" placeholder="Ad, mətn, slug axtar..."
              value={searchVal} onChange={(e) => handleSearch(e.target.value)}
              style={{
                padding: '8px 32px 8px 30px', border: `1px solid ${'oklch(85% 0.02 60)'}`, borderRadius: 4,
                fontSize: 12, color: 'oklch(30% 0.02 60)', background: 'white', outline: 'none', width: 220,
              }}
            />
            {searchVal && (
              <button type="button" onClick={clearSearch} aria-label="Axtarışı təmizlə" style={{ position: 'absolute', right: 8, background: 'none', border: 'none', cursor: 'pointer', color: C.faint, display: 'flex' }}>
                <X size={12} strokeWidth={2} />
              </button>
            )}
          </div>
          <button type="button" onClick={() => load(search)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'white',
            border: '1px solid oklch(85% 0.02 60)', borderRadius: 4, cursor: 'pointer',
            fontSize: 11, color: 'oklch(45% 0.03 60)', letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            <RefreshCw size={12} strokeWidth={1.5} />
            Yenilə
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: 14, padding: '10px 14px', border: `1px solid ${C.danger}`, borderRadius: 4, color: C.danger, fontSize: 12, background: 'oklch(97% 0.02 25)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: C.faint, fontSize: 13 }}>Yüklənir...</div>
      ) : items.length === 0 ? (
        <div style={{ padding: '56px 0', textAlign: 'center', color: C.faint, fontSize: 13 }}>
          <MessageSquare size={20} strokeWidth={1.2} style={{ opacity: 0.5, marginBottom: 10 }} />
          <div>Təbrik mesajı yoxdur.</div>
        </div>
      ) : (
        <div style={{ background: 'white', border: `1px solid ${C.line}`, borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '150px 130px 1fr 150px 88px', gap: 12, padding: '10px 20px', background: C.head, borderBottom: `1px solid ${C.line}` }}>
            {['Müəllif', 'Dəvətnamə', 'Mətn', 'Tarix', ''].map((h, i) => (
              <span key={i} style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(50% 0.03 60)' }}>{h}</span>
            ))}
          </div>

          {items.map((m, i) => (
            <div key={m.id} style={{
              display: 'grid', gridTemplateColumns: '150px 130px 1fr 150px 88px', gap: 12,
              padding: '13px 20px', alignItems: 'start',
              borderBottom: i < items.length - 1 ? `1px solid ${C.hair}` : 'none',
              background: confirmId === m.id ? 'oklch(97% 0.02 25)' : 'transparent',
            }}>
              <span style={{ fontSize: 13, color: C.text, fontWeight: 500, wordBreak: 'break-word' }}>
                {m.name || '—'}
              </span>

              <a
                href={`/invite/${m.slug}`} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: 'monospace', fontSize: 11, color: C.gold, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, wordBreak: 'break-all' }}
                title="Dəvətnaməni aç"
              >
                {m.slug}
                <ExternalLink size={10} strokeWidth={1.6} style={{ flexShrink: 0 }} />
              </a>

              <span style={{ fontSize: 12.5, color: C.text, lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {m.text}
                {m.has_rsvp && (
                  <span title="Bu sətirdə iştirak cavabı da var — silinəndə yalnız mətn gedir, RSVP qalır" style={{
                    marginLeft: 8, padding: '1px 6px', borderRadius: 3, fontSize: 9,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    border: '1px solid oklch(80% 0.05 150)', color: 'oklch(45% 0.09 150)', whiteSpace: 'nowrap',
                  }}>
                    RSVP
                  </span>
                )}
              </span>

              <span style={{ fontSize: 11, color: C.faint }}>{formatDateTime(m.created_at)}</span>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {confirmId === m.id ? (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button" disabled={busyId === m.id}
                      onClick={() => handleDelete(m.id)}
                      style={{
                        padding: '5px 9px', borderRadius: 4, border: 'none', cursor: 'pointer',
                        background: C.danger, color: 'white', fontSize: 10, letterSpacing: '0.06em',
                        textTransform: 'uppercase', opacity: busyId === m.id ? 0.6 : 1,
                      }}
                    >
                      {busyId === m.id ? '...' : 'Təsdiqlə'}
                    </button>
                    <button
                      type="button" onClick={() => setConfirmId(null)}
                      style={{ padding: '5px 8px', borderRadius: 4, border: `1px solid ${C.line}`, background: 'white', cursor: 'pointer', fontSize: 10, color: C.sub }}
                    >
                      Ləğv
                    </button>
                  </div>
                ) : (
                  <button
                    type="button" onClick={() => setConfirmId(m.id)}
                    title="Mesajı sil"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5, padding: '5px 9px',
                      borderRadius: 4, border: `1px solid ${C.line}`, background: 'white',
                      cursor: 'pointer', fontSize: 10, color: C.danger,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}
                  >
                    <Trash2 size={11} strokeWidth={1.6} />
                    Sil
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
