import { useState, useEffect } from 'react'
import { RefreshCw, Users, Search, X, Download, Printer } from 'lucide-react'
import { getRsvpResponses } from '../../utils/api'

const STATUS_AZ = { yes: 'Gələcək', maybe: 'Bəlkə', no: 'Gəlməyəcək' }

const STATUS_META = {
  yes:   { label: 'Gələcək',          bg: 'oklch(93% 0.05 145)', color: 'oklch(35% 0.1 145)' },
  maybe: { label: 'Hələ dəqiq deyil', bg: 'oklch(94% 0.06 80)',  color: 'oklch(42% 0.08 70)' },
  no:    { label: 'Gəlməyəcək',       bg: 'oklch(94% 0.05 25)',  color: 'oklch(38% 0.12 25)' },
}

const FILTERS = [
  { key: null,    label: 'Hamısı' },
  { key: 'yes',   label: 'Gələcək' },
  { key: 'maybe', label: 'Bəlkə' },
  { key: 'no',    label: 'Gəlməyəcək' },
]

/* ── CSV Export ── */
function exportCSV(responses, slug) {
  const today    = new Date().toISOString().slice(0, 10)
  const filename = `rsvp-${slug}-${today}.csv`
  const escape   = (val) => {
    const s = String(val ?? '')
    return s.includes(';') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"` : s
  }
  const SEP    = ';'
  const header = ['Ad', 'Status', 'Əlavə Qonaq', 'Tarix'].join(SEP)
  const rows   = responses.map(r => [
    escape(r.name),
    escape(STATUS_AZ[r.status] || r.status),
    escape(r.extra_guests ?? 0),
    escape(r.created_at ? r.created_at.slice(0, 10) : ''),
  ].join(SEP))

  const bom     = '﻿'
  const content = bom + [header, ...rows].join('\r\n')
  const blob    = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url     = URL.createObjectURL(blob)
  const a       = document.createElement('a')
  a.href        = url
  a.download    = filename
  a.click()
  URL.revokeObjectURL(url)
}

/* ── Print Window ── */
function handlePrint(data, names, slug) {
  const today    = new Date().toLocaleDateString('az-AZ', { day: '2-digit', month: 'long', year: 'numeric' })
  const total    = (data?.stats?.yes ?? 0) + (data?.stats?.guests ?? 0)
  const responses = data?.responses ?? []

  const statRows = [
    ['Gələcək',          data?.stats?.yes    ?? 0],
    ['Bəlkə',           data?.stats?.maybe  ?? 0],
    ['Gəlməyəcək',      data?.stats?.no     ?? 0],
    ['Əlavə Qonaq',     data?.stats?.guests ?? 0],
    ['Ümumi İştirakçı', total],
  ]

  const tableRows = responses.map(r => `
    <tr>
      <td>${r.name ?? '—'}</td>
      <td>${STATUS_AZ[r.status] ?? r.status}</td>
      <td>${r.extra_guests > 0 ? '+' + r.extra_guests : '—'}</td>
      <td>${r.created_at ? r.created_at.slice(0, 10) : '—'}</td>
    </tr>
  `).join('')

  const html = `<!DOCTYPE html>
<html lang="az">
<head>
  <meta charset="utf-8">
  <title>RSVP — ${slug}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, "Times New Roman", serif; color: #2a2a2a; padding: 36px 48px; font-size: 13px; }
    .header { border-bottom: 1.5px solid #c5a059; padding-bottom: 18px; margin-bottom: 24px; }
    .header h1 { font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #c5a059; font-family: Arial, sans-serif; font-weight: 600; margin-bottom: 10px; }
    .header h2 { font-size: 22px; font-weight: 400; color: #1a1a1a; margin-bottom: 6px; }
    .header p  { font-size: 11px; color: #888; font-family: Arial, sans-serif; letter-spacing: 0.04em; }
    .stats { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
    .stat { border: 1px solid #ddd; padding: 12px 16px; text-align: center; min-width: 100px; }
    .stat .val { font-size: 24px; font-weight: 300; color: #c5a059; line-height: 1; }
    .stat .lbl { font-size: 8px; text-transform: uppercase; letter-spacing: 0.14em; color: #888; font-family: Arial, sans-serif; margin-top: 5px; }
    .stat.total { border-color: #c5a059; background: #fdfaf4; }
    .stat.total .val { color: #8a6a20; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #f5f0e8; border: 1px solid #ddd; padding: 8px 12px; text-align: left; font-family: Arial, sans-serif; font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; font-weight: 600; }
    td { border: 1px solid #e8e2d8; padding: 8px 12px; }
    tr:nth-child(even) td { background: #fdfaf4; }
    @media print {
      body { padding: 20px 30px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Digitoy RSVP Report</h1>
    <h2>${names || slug}</h2>
    <p>Tarix: ${today}</p>
  </div>

  <div class="stats">
    ${statRows.map(([label, val], i) => `
      <div class="stat${i === 4 ? ' total' : ''}">
        <div class="val">${val}</div>
        <div class="lbl">${label}</div>
      </div>
    `).join('')}
  </div>

  <table>
    <thead>
      <tr><th>Ad</th><th>Status</th><th>Əlavə Qonaq</th><th>Tarix</th></tr>
    </thead>
    <tbody>
      ${tableRows || '<tr><td colspan="4" style="text-align:center;color:#999">Cavab yoxdur</td></tr>'}
    </tbody>
  </table>

  <script>window.onload = () => { window.print() }<\/script>
</body>
</html>`

  const win = window.open('', '_blank', 'width=900,height=700')
  win.document.write(html)
  win.document.close()
}

/* ── Sub-components ── */
function StatCard({ label, value, color, highlight }) {
  return (
    <div style={{
      flex: 1, background: highlight ? 'oklch(96% 0.03 80)' : 'white',
      border: `1px solid ${highlight ? 'oklch(78% 0.1 80)' : 'oklch(88% 0.02 60)'}`,
      borderRadius: 5, padding: '14px 16px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 26, fontFamily: '"Cormorant Garamond",serif', fontWeight: 300, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'oklch(55% 0.03 60)', marginTop: 5 }}>{label}</div>
    </div>
  )
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || { label: status, bg: 'oklch(93% 0.02 60)', color: 'oklch(45% 0.03 60)' }
  return (
    <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 3, fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', background: m.bg, color: m.color }}>
      {m.label}
    </span>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('az-AZ', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

/* ── Main component ── */
export default function AdminRSVPBlock({ slug, names }) {
  const [data,         setData]         = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [filterStatus, setFilterStatus] = useState(null)
  const [searchVal,    setSearchVal]    = useState('')

  const load = () => {
    if (!slug) return
    setLoading(true)
    setError('')
    getRsvpResponses(slug)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError('RSVP məlumatları yüklənmədi.'); setLoading(false) })
  }

  useEffect(() => { load() }, [slug])

  if (!slug) return null

  const hasData   = !!data?.responses?.length
  const totalPax  = (data?.stats?.yes ?? 0) + (data?.stats?.guests ?? 0)

  const visible = (data?.responses ?? []).filter(r => {
    const matchFilter = filterStatus === null || r.status === filterStatus
    const matchSearch = searchVal === '' || (r.name ?? '').toLowerCase().includes(searchVal.toLowerCase())
    return matchFilter && matchSearch
  })

  const btnBase = { display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', transition: 'opacity 0.15s' }
  const disabledStyle = { background: 'oklch(92% 0.02 60)', color: 'oklch(65% 0.03 60)', cursor: 'not-allowed' }

  return (
    <div style={{ marginTop: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Users size={13} strokeWidth={1.5} style={{ color: 'oklch(55% 0.06 75)' }} />
          <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'oklch(45% 0.03 60)', fontWeight: 600 }}>
            RSVP Cavabları
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {/* CSV Export */}
          <button
            type="button"
            onClick={() => exportCSV(data?.responses ?? [], slug)}
            disabled={!hasData}
            title="CSV kimi yüklə"
            style={{ ...btnBase, ...(hasData ? { background: 'oklch(38% 0.1 145)', color: 'white' } : disabledStyle) }}
            onMouseEnter={e => { if (hasData) e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            <Download size={10} strokeWidth={2} />
            CSV Export
          </button>

          {/* Çap et */}
          <button
            type="button"
            onClick={() => handlePrint(data, names, slug)}
            disabled={!hasData}
            title="Çap et"
            style={{ ...btnBase, ...(hasData ? { background: 'oklch(45% 0.07 75)', color: 'white' } : disabledStyle) }}
            onMouseEnter={e => { if (hasData) e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            <Printer size={10} strokeWidth={2} />
            Çap et
          </button>

          {/* Yenilə */}
          <button type="button" onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: 'white', border: '1px solid oklch(85% 0.02 60)', borderRadius: 3, cursor: 'pointer', fontSize: 10, color: 'oklch(50% 0.03 60)' }}>
            <RefreshCw size={10} strokeWidth={1.5} />
            Yenilə
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '20px 0', textAlign: 'center', fontSize: 12, color: 'oklch(60% 0.03 60)' }}>Yüklənir...</div>
      ) : error ? (
        <div style={{ padding: '16px', background: 'oklch(97% 0.02 25)', borderRadius: 4, fontSize: 12, color: 'oklch(42% 0.1 25)' }}>{error}</div>
      ) : (
        <>
          {/* Stat kartlar — 2 sıra: 4 + 1 */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <StatCard label="Gələcək"      value={data?.stats?.yes    ?? 0} color="oklch(35% 0.1 145)" />
            <StatCard label="Bəlkə"        value={data?.stats?.maybe  ?? 0} color="oklch(42% 0.08 70)" />
            <StatCard label="Gəlməyəcək"  value={data?.stats?.no     ?? 0} color="oklch(38% 0.12 25)" />
            <StatCard label="Əlavə Qonaq" value={data?.stats?.guests ?? 0} color="oklch(45% 0.07 75)" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <StatCard label="Ümumi İştirakçı" value={totalPax} color="oklch(38% 0.09 80)" highlight />
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <Search size={13} strokeWidth={1.5} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'oklch(62% 0.03 60)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Ad axtar..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              style={{ width: '100%', padding: '8px 32px 8px 30px', border: '1px solid oklch(85% 0.02 60)', borderRadius: 4, fontSize: 12, color: 'oklch(30% 0.02 60)', background: 'white', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => { e.target.style.borderColor = 'oklch(72% 0.12 80)' }}
              onBlur={e  => { e.target.style.borderColor = 'oklch(85% 0.02 60)' }}
            />
            {searchVal && (
              <button type="button" onClick={() => setSearchVal('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'oklch(60% 0.03 60)', display: 'flex', alignItems: 'center', padding: 2 }}>
                <X size={12} strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 2, marginBottom: 14, borderBottom: '1px solid oklch(88% 0.02 60)' }}>
            {FILTERS.map(({ key, label }) => {
              const active = filterStatus === key
              return (
                <button key={String(key)} type="button" onClick={() => setFilterStatus(key)} style={{ padding: '7px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: active ? 600 : 400, color: active ? 'oklch(30% 0.04 70)' : 'oklch(55% 0.03 60)', borderBottom: active ? '2px solid oklch(72% 0.12 80)' : '2px solid transparent', marginBottom: -1, letterSpacing: '0.03em', transition: 'color 0.12s' }}>
                  {label}
                </button>
              )
            })}
          </div>

          {/* Siyahı */}
          {visible.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', fontSize: 12, color: 'oklch(62% 0.03 60)', background: 'white', border: '1px solid oklch(88% 0.02 60)', borderRadius: 5 }}>
              {searchVal || filterStatus ? 'Nəticə tapılmadı.' : 'Hələ heç kim cavab verməyib.'}
            </div>
          ) : (
            <div style={{ background: 'white', border: '1px solid oklch(88% 0.02 60)', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 60px 110px', gap: 12, padding: '8px 16px', background: 'oklch(95% 0.01 75)', borderBottom: '1px solid oklch(88% 0.02 60)' }}>
                {['Ad', 'Status', 'Qonaq', 'Tarix'].map((h, i) => (
                  <span key={i} style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'oklch(50% 0.03 60)' }}>{h}</span>
                ))}
              </div>
              {visible.map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 60px 110px', gap: 12, padding: '11px 16px', alignItems: 'center', borderBottom: i < visible.length - 1 ? '1px solid oklch(93% 0.01 75)' : 'none' }}>
                  <span style={{ fontSize: 13, color: 'oklch(22% 0.02 60)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name || '—'}</span>
                  <StatusBadge status={r.status} />
                  <span style={{ fontSize: 13, color: 'oklch(40% 0.03 60)', fontWeight: 500 }}>{r.extra_guests > 0 ? `+${r.extra_guests}` : '—'}</span>
                  <span style={{ fontSize: 11, color: 'oklch(58% 0.03 60)' }}>{formatDate(r.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
