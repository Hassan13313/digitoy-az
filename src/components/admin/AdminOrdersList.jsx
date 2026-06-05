import { useState, useEffect, useRef } from 'react'
import { getOrdersList } from '../../utils/api'
import { RefreshCw, ChevronRight, Search, X } from 'lucide-react'

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
      display: 'inline-block', padding: '3px 8px', borderRadius: 3,
      fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
      textTransform: 'uppercase', background: s.bg, color: s.color,
    }}>
      {s.label}
    </span>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('az-AZ', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function AdminOrdersList({ onSelectOrder }) {
  const [orders,    setOrders]    = useState([])
  const [total,     setTotal]     = useState(0)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [statusTab, setStatusTab] = useState('submitted')
  const [search,    setSearch]    = useState('')
  const [searchVal, setSearchVal] = useState('')
  const debounceRef = useRef(null)

  const fetchOrders = (status, q = '') => {
    setLoading(true)
    setError('')
    getOrdersList(status, 50, 0, q)
      .then(data => {
        setOrders(data.orders || [])
        setTotal(data.total || 0)
      })
      .catch(() => setError('Sifarişlər yüklənmədi.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders(statusTab, search) }, [statusTab])

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
    <div style={{ padding: '32px 36px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
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
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Search input */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={13} strokeWidth={1.5} style={{
              position: 'absolute', left: 10, color: 'oklch(60% 0.03 60)', pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="DT kodu, ad, telefon..."
              value={searchVal}
              onChange={e => handleSearchChange(e.target.value)}
              style={{
                padding: '8px 32px 8px 30px',
                border: '1px solid oklch(85% 0.02 60)', borderRadius: 4,
                fontSize: 12, color: 'oklch(30% 0.02 60)',
                background: 'white', outline: 'none', width: 210,
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
          <button
            type="button"
            onClick={() => fetchOrders(statusTab, search)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', background: 'white',
              border: '1px solid oklch(85% 0.02 60)', borderRadius: 4,
              cursor: 'pointer', fontSize: 11, color: 'oklch(45% 0.03 60)',
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}
          >
            <RefreshCw size={12} strokeWidth={1.5} />
            Yenilə
          </button>
        </div>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 20, borderBottom: '1px solid oklch(88% 0.02 60)' }}>
        {[['submitted', 'Yeni'], ['approved', 'Təsdiqlənmiş'], ['rejected', 'Rədd'], ['all', 'Hamısı'], ['deleted', 'Silinmiş']].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setStatusTab(key)}
            style={{
              padding: '8px 16px', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 12, fontWeight: statusTab === key ? 600 : 400,
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
      ) : (
        <div style={{ background: 'white', border: '1px solid oklch(88% 0.02 60)', borderRadius: 6, overflow: 'hidden' }}>
          {/* Table header — Tarix | Bəy/Gəlin | Paket | Draft Code | Status */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '110px 1fr 110px 120px 90px 32px',
            gap: 16, padding: '10px 20px',
            background: 'oklch(95% 0.01 75)',
            borderBottom: '1px solid oklch(88% 0.02 60)',
          }}>
            {['Tarix', 'Bəy / Gəlin', 'Paket', 'Sifariş Kodu', 'Status', ''].map((h, i) => (
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
            <div
              key={order.draft_code || i}
              onClick={() => onSelectOrder(order.draft_code)}
              style={{
                display: 'grid',
                gridTemplateColumns: '110px 1fr 110px 120px 90px 32px',
                gap: 16, padding: '14px 20px',
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
              <span style={{
                fontFamily: 'monospace', fontSize: 11, fontWeight: 600,
                color: 'oklch(45% 0.06 75)', letterSpacing: '0.04em',
              }}>
                {order.draft_code || '—'}
              </span>
              <StatusBadge status={order.status} />
              <ChevronRight size={14} strokeWidth={1.5} style={{ color: 'oklch(75% 0.02 60)' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
