import { useState, useEffect, useRef } from 'react'
import TemplateCell from './TemplateCell'
import { listTemplates } from '../../templates/templateConfig'
import { getOrdersList, adminPurge } from '../../utils/api'
import { RefreshCw, ChevronRight, Search, X, Trash2 } from 'lucide-react'
import { useIsNarrow } from '../../hooks/useIsNarrow'
import { azDate, pagePadding } from './adminFormat'

const STATUS_STYLES = {
  submitted: { bg: 'oklch(94% 0.06 80)',  color: 'oklch(45% 0.08 70)',  label: 'Yeni' },
  approved:  { bg: 'oklch(93% 0.05 145)', color: 'oklch(38% 0.1 145)',  label: 'Təsdiqləndi' },
  rejected:  { bg: 'oklch(94% 0.05 25)',  color: 'oklch(40% 0.12 25)',  label: 'Rədd edildi' },
  deleted:   { bg: 'oklch(92% 0.01 0)',   color: 'oklch(45% 0.02 0)',   label: 'Silinmiş' },
  draft:     { bg: 'oklch(93% 0.02 60)',  color: 'oklch(50% 0.03 60)',  label: 'Qaralama' },
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.draft
  return (
    <span style={{
      display: 'inline-block', padding: '3px 8px', borderRadius: 3, flexShrink: 0,
      fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
      textTransform: 'uppercase', background: s.bg, color: s.color,
    }}>
      {s.label}
    </span>
  )
}

/* ⚠ `toLocaleDateString('az-AZ')` Chrome-da «M06 29» verirdi — bax adminFormat */
function formatDate(iso) {
  return azDate(iso, { time: true, year: false })
}

export default function AdminOrdersList({ onSelectOrder }) {
  /* Telefonda (S24 Ultra ≈ 384px) 7 sütunlu cədvəl sığmırdı — sətirlər karta çevrilir */
  const narrow = useIsNarrow()
  const [orders,    setOrders]    = useState([])
  const [total,     setTotal]     = useState(0)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [statusTab, setStatusTab] = useState('submitted')
  const [search,    setSearch]    = useState('')
  const [searchVal, setSearchVal] = useState('')
  /* Phase 4 — şablon filtri ('' = hamısı) */
  const [templateFilter, setTemplateFilter] = useState('')
  const debounceRef = useRef(null)
  /* Phase 46 — «Silinmiş» tabında birdəfəlik silmə (iki addımlı təsdiq) */
  const [confirmCode, setConfirmCode] = useState(null)
  const [confirmAll,  setConfirmAll]  = useState(false)
  const [purgeBusy,   setPurgeBusy]   = useState(false)
  const [purgeError,  setPurgeError]  = useState('')
  const trash = statusTab === 'deleted'

  const purge = async (payload, after) => {
    setPurgeBusy(true)
    setPurgeError('')
    try {
      await adminPurge(payload)
      after()
    } catch (e) {
      setPurgeError(e?.message || 'Silinmədi.')
    } finally {
      setPurgeBusy(false)
    }
  }
  const purgeOne = (code) => purge({ action: 'order', draft_code: code }, () => {
    setOrders(prev => prev.filter(o => o.draft_code !== code))
    setTotal(t => Math.max(0, t - 1))
    setConfirmCode(null)
  })
  const purgeAll = () => purge({ action: 'deleted_orders' }, () => {
    setOrders([])
    setTotal(0)
    setConfirmAll(false)
  })

  const fetchOrders = (status, q = '', tpl = templateFilter) => {
    setLoading(true)
    setError('')
    getOrdersList(status, 50, 0, q, tpl)
      .then(data => {
        setOrders(data.orders || [])
        setTotal(data.total || 0)
      })
      .catch(() => setError('Sifarişlər yüklənmədi.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders(statusTab, search, templateFilter) }, [statusTab, templateFilter])

  /* Axtarış — 400ms debounce */
  const handleSearchChange = (val) => {
    setSearchVal(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearch(val)
      fetchOrders(statusTab, val)
    }, 400)
  }

  const clearSearch = () => {
    setSearchVal('')
    setSearch('')
    fetchOrders(statusTab, '')
  }

  return (
    <div style={{ padding: pagePadding(narrow) }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: narrow ? 'stretch' : 'center', justifyContent: 'space-between', marginBottom: 20,
        flexDirection: narrow ? 'column' : 'row', gap: narrow ? 12 : 0,
      }}>
        <div>
          <h1 style={{
            fontFamily: '"Cormorant Garamond","Playfair Display",serif',
            fontSize: 24, fontWeight: 300, color: 'oklch(20% 0.02 60)',
            margin: 0, letterSpacing: '-0.01em',
          }}>
            Sifarişlər
          </h1>
          <p style={{ fontSize: 12, color: 'oklch(55% 0.03 60)', margin: '4px 0 0', letterSpacing: '0.02em' }}>
            {total} sifariş{search ? ` — "${search}" üzrə` : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: narrow ? 'wrap' : 'nowrap' }}>
          {/* Search input */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: narrow ? '1 1 100%' : undefined }}>
            <Search size={13} strokeWidth={1.5} style={{
              position: 'absolute', left: 10, color: 'oklch(60% 0.03 60)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="DT kodu, ad, telefon..."
              value={searchVal}
              onChange={e => handleSearchChange(e.target.value)}
              style={{
                padding: narrow ? '11px 36px 11px 32px' : '8px 32px 8px 30px',
                border: '1px solid oklch(85% 0.02 60)', borderRadius: narrow ? 8 : 4,
                fontSize: narrow ? 15 : 12, color: 'oklch(30% 0.02 60)',
                background: 'white', outline: 'none', width: narrow ? '100%' : 210,
                transition: 'border-color 0.15s',
              }}
              onFocus={e => { e.target.style.borderColor = 'oklch(72% 0.12 80)' }}
              onBlur={e => { e.target.style.borderColor = 'oklch(85% 0.02 60)' }}
            />
            {searchVal && (
              <button type="button" onClick={clearSearch} style={{
                position: 'absolute', right: 8, background: 'none', border: 'none',
                cursor: 'pointer', padding: 2, color: 'oklch(60% 0.03 60)',
                display: 'flex', alignItems: 'center',
              }}>
                <X size={12} strokeWidth={2} />
              </button>
            )}
          </div>
          {/* Phase 4 — şablon filtri; seçimlər metadata-dan gəlir, hardcode yox */}
          <select
            value={templateFilter}
            onChange={(e) => setTemplateFilter(e.target.value)}
            title="Şablon üzrə filtr"
            style={{
              padding: narrow ? '10px 10px' : '8px 10px', fontSize: narrow ? 14 : 11, borderRadius: narrow ? 8 : 4,
              border: '1px solid oklch(85% 0.02 60)', background: 'white',
              color: 'oklch(45% 0.03 60)', cursor: 'pointer', outline: 'none',
              flex: narrow ? '1 1 auto' : undefined, minHeight: narrow ? 42 : undefined, minWidth: 0,
            }}
          >
            <option value="">Bütün şablonlar</option>
            {listTemplates().map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => fetchOrders(statusTab, search, templateFilter)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', background: 'white',
              border: '1px solid oklch(85% 0.02 60)', borderRadius: narrow ? 8 : 4,
              cursor: 'pointer', fontSize: 11, color: 'oklch(45% 0.03 60)',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              minHeight: narrow ? 42 : undefined, flex: '0 0 auto',
            }}
          >
            <RefreshCw size={12} strokeWidth={1.5} />
            Yenilə
          </button>
        </div>
      </div>

      {/* Status tabs — telefonda üfüqi sürüşür */}
      <div style={{
        display: 'flex', gap: 2, marginBottom: 20, borderBottom: '1px solid oklch(88% 0.02 60)',
        overflowX: narrow ? 'auto' : undefined, WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
      }}>
        {[['submitted', 'Yeni'], ['approved', 'Təsdiqlənmiş'], ['rejected', 'Rədd'], ['all', 'Hamısı'], ['deleted', 'Silinmiş']].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setStatusTab(key)}
            style={{
              padding: narrow ? '11px 14px' : '8px 16px', background: 'none', border: 'none', flex: '0 0 auto',
              whiteSpace: 'nowrap',
              cursor: 'pointer', fontSize: narrow ? 13.5 : 12, fontWeight: statusTab === key ? 600 : 400,
              color: statusTab === key ? 'oklch(30% 0.04 70)' : 'oklch(55% 0.03 60)',
              borderBottom: statusTab === key ? '2px solid oklch(72% 0.12 80)' : '2px solid transparent',
              marginBottom: -1, letterSpacing: '0.04em',
              transition: 'color 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Phase 46 — Silinmiş: hamısını birdəfəlik sil */}
      {trash && !loading && orders.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14,
          padding: '11px 14px', background: 'oklch(97% 0.015 25)', border: '1px solid oklch(88% 0.04 25)', borderRadius: 8,
        }}>
          <span style={{ fontSize: 12.5, color: 'oklch(40% 0.05 25)', flex: '1 1 220px' }}>
            Silinmiş sifarişlər buradan birdəfəlik silinə bilər — bir daha heç yerdə görünməyəcək.
          </span>
          {confirmAll ? (
            <>
              <button type="button" disabled={purgeBusy} onClick={purgeAll} style={purgeBtn(true)}>
                {purgeBusy ? 'Silinir…' : `Bəli, ${total} sifarişi sil`}
              </button>
              <button type="button" disabled={purgeBusy} onClick={() => setConfirmAll(false)} style={purgeBtn(false)}>Ləğv et</button>
            </>
          ) : (
            <button type="button" onClick={() => setConfirmAll(true)} style={purgeBtn(true)}>
              <Trash2 size={13} /> Hamısını birdəfəlik sil ({total})
            </button>
          )}
          {purgeError && <span role="alert" style={{ flexBasis: '100%', fontSize: 12, color: 'oklch(48% 0.16 25)' }}>{purgeError}</span>}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: 'oklch(60% 0.03 60)', fontSize: 13 }}>
          Yüklənir...
        </div>
      ) : error ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: 'oklch(45% 0.1 25)', fontSize: 13 }}>
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: 'oklch(60% 0.03 60)', fontSize: 13 }}>
          Sifariş yoxdur.
        </div>
      ) : narrow ? (
        /* ── Telefon: hər sifariş bir kart (bütün kart toxunula bilir) ──
           ⚠ `minmax(0, 1fr)`: yoxsa uzun ad (nowrap) sütunu ekrandan enli edir
           və kartın sağ tərəfi (status nişanı) kəsilirdi. */
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 10 }}>
          {orders.map((order, i) => (
            <div key={order.draft_code || i} style={{ display: 'grid', gap: 6 }}>
            <button
              type="button"
              onClick={() => onSelectOrder(order.draft_code)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                padding: '14px 14px', minHeight: 72, cursor: 'pointer', fontFamily: 'inherit',
                background: 'white', border: '1px solid oklch(88% 0.02 60)', borderRadius: 10,
              }}
            >
              <div style={{ flex: 1, minWidth: 0, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 15, color: 'oklch(25% 0.02 60)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {order.names || '—'}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 12, color: 'oklch(52% 0.03 60)' }}>
                  <span>{formatDate(order.submitted_at)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{order.package_label}</span>
                  <span aria-hidden="true">·</span>
                  <TemplateCell templateId={order.template_id} />
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: 'oklch(45% 0.06 75)', letterSpacing: '0.04em' }}>
                  {order.draft_code || '—'}
                </span>
              </div>
              <ChevronRight size={18} strokeWidth={1.5} style={{ color: 'oklch(70% 0.02 60)', flexShrink: 0 }} />
            </button>
            {trash && order.draft_code && (
              <RowPurge code={order.draft_code} confirming={confirmCode === order.draft_code} busy={purgeBusy}
                onAsk={() => setConfirmCode(order.draft_code)} onYes={() => purgeOne(order.draft_code)} onNo={() => setConfirmCode(null)} />
            )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: 'white', border: '1px solid oklch(88% 0.02 60)', borderRadius: 6, overflow: 'hidden' }}>
          {/* Table header — Tarix | Bəy/Gəlin | Paket | Draft Code | Status */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr 100px 110px 110px 86px 30px',
            gap: 12, padding: '10px 20px',
            background: 'oklch(95% 0.01 75)',
            borderBottom: '1px solid oklch(88% 0.02 60)',
          }}>
            {['Tarix', 'Bəy / Gəlin', 'Paket', 'Şablon', 'Sifariş Kodu', 'Status', ''].map((h, i) => (
              <span key={i} style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'oklch(50% 0.03 60)',
              }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {orders.map((order, i) => (
            <div key={order.draft_code || i}>
            <div
              onClick={() => onSelectOrder(order.draft_code)}
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 100px 110px 110px 86px 30px',
                gap: 12, padding: '14px 20px',
                borderBottom: i < orders.length - 1 ? '1px solid oklch(93% 0.01 75)' : 'none',
                cursor: 'pointer', transition: 'background 0.12s',
                alignItems: 'center',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'oklch(97% 0.01 80)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white' }}
            >
              <span style={{ fontSize: 11, color: 'oklch(55% 0.03 60)' }}>
                {formatDate(order.submitted_at)}
              </span>
              <span style={{ fontSize: 13, color: 'oklch(25% 0.02 60)', fontWeight: 500 }}>
                {order.names}
              </span>
              <span style={{ fontSize: 11, color: 'oklch(50% 0.04 75)' }}>
                {order.package_label}
              </span>
              <TemplateCell templateId={order.template_id} />
              <span style={{
                fontFamily: 'monospace', fontSize: 11, fontWeight: 600,
                color: 'oklch(45% 0.06 75)', letterSpacing: '0.04em',
              }}>
                {order.draft_code || '—'}
              </span>
              <StatusBadge status={order.status} />
              {trash && order.draft_code ? (
                <button type="button" title="Birdəfəlik sil" aria-label="Birdəfəlik sil"
                  onClick={e => { e.stopPropagation(); setConfirmCode(order.draft_code) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, display: 'flex', color: 'oklch(48% 0.16 25)' }}>
                  <Trash2 size={14} strokeWidth={1.6} />
                </button>
              ) : (
                <ChevronRight size={14} strokeWidth={1.5} style={{ color: 'oklch(75% 0.02 60)' }} />
              )}
            </div>
            {trash && confirmCode === order.draft_code && (
              <div style={{ padding: '0 20px 12px' }}>
                <RowPurge code={order.draft_code} confirming busy={purgeBusy}
                  onYes={() => purgeOne(order.draft_code)} onNo={() => setConfirmCode(null)} />
              </div>
            )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Phase 46 — sətir üçün birdəfəlik silmə (iki addımlı) ── */
function purgeBtn(danger) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 36, padding: '7px 13px',
    borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
    border: danger ? 'none' : '1px solid oklch(85% 0.02 60)',
    background: danger ? 'oklch(48% 0.16 25)' : 'white', color: danger ? 'white' : 'oklch(40% 0.03 60)',
  }
}

function RowPurge({ code, confirming, busy, onAsk, onYes, onNo }) {
  if (!confirming) {
    return (
      <button type="button" onClick={onAsk} style={{ ...purgeBtn(false), justifyContent: 'center', color: 'oklch(48% 0.16 25)' }}>
        <Trash2 size={13} /> Birdəfəlik sil
      </button>
    )
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '8px 10px', background: 'oklch(97% 0.015 25)', borderRadius: 8 }}>
      <span style={{ fontSize: 12.5, color: 'oklch(40% 0.05 25)', flex: '1 1 160px' }}>{code} birdəfəlik silinsin?</span>
      <button type="button" disabled={busy} onClick={onYes} style={purgeBtn(true)}>{busy ? 'Silinir…' : 'Bəli, sil'}</button>
      <button type="button" disabled={busy} onClick={onNo} style={purgeBtn(false)}>Ləğv et</button>
    </div>
  )
}
