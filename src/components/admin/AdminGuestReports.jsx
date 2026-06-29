import { useState, useEffect, useMemo } from 'react'
import { Search, X, RefreshCw, Download, LayoutList, AlignLeft, Printer } from 'lucide-react'
import { getGuests, exportGuestsCsv } from '../../utils/api'

const STATUS_DOT = { GOING: '🟢', NOT_GOING: '🔴', MAYBE: '🟡', NO_RESPONSE: '⚪' }
const STATUS_AZ  = { GOING: 'Gələcək', NOT_GOING: 'Gəlməyəcək', MAYBE: 'Bəlkə', NO_RESPONSE: 'Cavab yoxdur' }

const STATUS_META = {
  GOING:       { bg: 'oklch(93% 0.05 145)', color: 'oklch(35% 0.1 145)' },
  NOT_GOING:   { bg: 'oklch(94% 0.05 25)',  color: 'oklch(38% 0.12 25)' },
  MAYBE:       { bg: 'oklch(94% 0.06 80)',  color: 'oklch(42% 0.08 70)' },
  NO_RESPONSE: { bg: 'oklch(93% 0.01 60)',  color: 'oklch(50% 0.03 60)' },
}

const FILTERS = [
  { key: null,          label: 'Hamısı' },
  { key: 'GOING',       label: '🟢 Gələcək' },
  { key: 'NOT_GOING',   label: '🔴 Gəlməyəcək' },
  { key: 'MAYBE',       label: '🟡 Bəlkə' },
  { key: 'NO_RESPONSE', label: '⚪ Cavabsız' },
]

const COL_HDR = { fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(50% 0.03 60)' }

function StatusBadge({ status }) {
  const m = STATUS_META[status] || { bg: 'oklch(93% 0.01 60)', color: 'oklch(50% 0.03 60)' }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 3, fontSize: 10, fontWeight: 600, background: m.bg, color: m.color }}>
      {STATUS_DOT[status]} {STATUS_AZ[status] || status}
    </span>
  )
}

function StatCard({ label, value, color, highlight }) {
  return (
    <div style={{ flex: 1, minWidth: 80, background: highlight ? 'oklch(96% 0.03 80)' : 'white', border: `1px solid ${highlight ? 'oklch(78% 0.1 80)' : 'oklch(88% 0.02 60)'}`, borderRadius: 5, padding: '12px 14px', textAlign: 'center' }}>
      <div style={{ fontSize: 24, fontWeight: 300, color, lineHeight: 1, fontFamily: '"Cormorant Garamond",serif' }}>{value}</div>
      <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(55% 0.03 60)', marginTop: 4 }}>{label}</div>
    </div>
  )
}

/* ── Mode A: Masalara görə ── */
function ByTablesView({ guests, tableIds }) {
  const byTable = {}
  for (const tid of tableIds) byTable[tid] = []
  for (const g of guests) {
    if (byTable[g.table_id]) byTable[g.table_id].push(g)
    else byTable[g.table_id] = [g]
  }

  const COLS = '1fr 140px 58px 1fr 88px'

  return (
    <div>
      {tableIds.filter(tid => byTable[tid]?.length).map(tid => (
        <div key={tid} style={{ marginBottom: 18 }}>
          <div style={{ padding: '8px 14px', background: 'oklch(95% 0.01 75)', borderBottom: '1px solid oklch(88% 0.02 60)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'oklch(25% 0.03 60)' }}>{tid}</span>
            <span style={{ fontSize: 10, color: 'oklch(55% 0.03 60)' }}>
              {byTable[tid].filter(g => g.status !== 'NO_RESPONSE').length}/{byTable[tid].length} cavab
            </span>
          </div>
          {/* Column header for this table group */}
          <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: 8, padding: '5px 16px', background: 'oklch(97% 0.005 75)', borderBottom: '1px solid oklch(91% 0.01 75)' }}>
            {['Ad', 'Status', 'Əlavə', 'Qeyd', 'Tarix'].map((h, i) => (
              <span key={i} style={COL_HDR}>{h}</span>
            ))}
          </div>
          {byTable[tid].map(g => (
            <div key={g.id} style={{ display: 'grid', gridTemplateColumns: COLS, gap: 8, padding: '8px 16px', alignItems: 'center', borderBottom: '1px solid oklch(94% 0.01 60)' }}>
              <span style={{ fontSize: 13, color: 'oklch(22% 0.02 60)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.full_name}</span>
              <StatusBadge status={g.status} />
              <span style={{ fontSize: 12, color: 'oklch(35% 0.08 75)', fontWeight: 600, textAlign: 'center' }}>
                {g.extra_guests > 0 ? `+${g.extra_guests}` : '—'}
              </span>
              <span style={{ fontSize: 11, color: 'oklch(52% 0.03 60)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={g.notes || ''}>
                {g.notes || ''}
              </span>
              <span style={{ fontSize: 11, color: 'oklch(58% 0.03 60)' }}>
                {g.submitted_at ? new Date(g.submitted_at).toLocaleDateString('az-AZ', { day: '2-digit', month: 'short' }) : '—'}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/* ── Mode B: Statuslara görə ── */
function ByStatusView({ guests }) {
  const order = ['GOING', 'MAYBE', 'NOT_GOING', 'NO_RESPONSE']
  const byStatus = {}
  for (const s of order) byStatus[s] = []
  for (const g of guests) {
    if (byStatus[g.status]) byStatus[g.status].push(g)
    else byStatus[g.status] = [g]
  }

  const COLS = '1fr 120px 58px 1fr 88px'

  return (
    <div>
      {order.filter(s => byStatus[s]?.length).map(s => (
        <div key={s} style={{ marginBottom: 18 }}>
          <div style={{ padding: '8px 14px', background: STATUS_META[s]?.bg || 'oklch(95% 0.01 75)', borderBottom: '1px solid oklch(88% 0.02 60)' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: STATUS_META[s]?.color || 'oklch(30% 0.02 60)' }}>
              {STATUS_DOT[s]} {STATUS_AZ[s]} — {byStatus[s].length} nəfər
            </span>
          </div>
          {/* Column header */}
          <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: 8, padding: '5px 16px', background: 'oklch(97% 0.005 75)', borderBottom: '1px solid oklch(91% 0.01 75)' }}>
            {['Ad', 'Masa', 'Əlavə', 'Qeyd', 'Tarix'].map((h, i) => (
              <span key={i} style={COL_HDR}>{h}</span>
            ))}
          </div>
          {byStatus[s].map(g => (
            <div key={g.id} style={{ display: 'grid', gridTemplateColumns: COLS, gap: 8, padding: '8px 16px', alignItems: 'center', borderBottom: '1px solid oklch(94% 0.01 60)' }}>
              <span style={{ fontSize: 13, color: 'oklch(22% 0.02 60)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.full_name}</span>
              <span style={{ fontSize: 11, color: 'oklch(45% 0.05 75)' }}>{g.table_id}</span>
              <span style={{ fontSize: 12, color: 'oklch(35% 0.08 75)', fontWeight: 600, textAlign: 'center' }}>
                {g.extra_guests > 0 ? `+${g.extra_guests}` : '—'}
              </span>
              <span style={{ fontSize: 11, color: 'oklch(52% 0.03 60)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={g.notes || ''}>
                {g.notes || ''}
              </span>
              <span style={{ fontSize: 11, color: 'oklch(58% 0.03 60)' }}>
                {g.submitted_at ? new Date(g.submitted_at).toLocaleDateString('az-AZ', { day: '2-digit', month: 'short' }) : '—'}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/* ── Print: yeni pəncərədə A4 HTML açır ── */
function buildPrintHtml({ guests, stats, names, dateStr }) {
  const byTable = {}
  for (const g of guests) {
    if (!byTable[g.table_id]) byTable[g.table_id] = []
    byTable[g.table_id].push(g)
  }

  const PRINT_STATUS = {
    GOING: '✅ Gələcək', NOT_GOING: '❌ Gəlməyəcək',
    MAYBE: '🤔 Bəlkə', NO_RESPONSE: '—',
  }

  const tableHtml = Object.entries(byTable).map(([tid, list]) => `
    <div class="tbl">
      <div class="tbl-hdr">${tid} &mdash; ${list.length} nəfər</div>
      <table>
        <thead><tr><th>Ad</th><th>Status</th><th>Əlavə qonaq</th><th>Qeyd</th></tr></thead>
        <tbody>${list.map((g, i) => `
          <tr class="${i % 2 === 1 ? 'alt' : ''}">
            <td>${g.full_name}</td>
            <td>${PRINT_STATUS[g.status] || g.status}</td>
            <td style="text-align:center">${g.extra_guests > 0 ? '+' + g.extra_guests : '—'}</td>
            <td class="note">${g.notes ? g.notes.replace(/</g, '&lt;') : ''}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `).join('')

  return `<!DOCTYPE html>
<html lang="az">
<head>
<meta charset="UTF-8">
<title>Qonaq Siyahısı${names ? ' — ' + names : ''}</title>
<style>
  @page { size: A4 portrait; margin: 14mm 16mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, 'Times New Roman', serif; font-size: 10.5pt; color: #1a1a1a; }
  .header { text-align: center; margin-bottom: 14pt; padding-bottom: 10pt; border-bottom: 1.5pt solid #c8a86e; }
  .logo   { font-size: 7.5pt; letter-spacing: .2em; text-transform: uppercase; color: #999; margin-bottom: 3pt; font-family: Arial, sans-serif; }
  .ename  { font-size: 20pt; font-weight: 300; margin: 3pt 0 2pt; }
  .edate  { font-size: 9pt; color: #666; font-family: Arial, sans-serif; }
  .stats  { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5pt; margin-bottom: 14pt; }
  .sbox   { border: 1pt solid #ddd; padding: 7pt; text-align: center; border-radius: 3pt; }
  .sbox.hi{ border-color: #c8a86e; background: #fdf8f0; }
  .sval   { font-size: 16pt; font-weight: 300; color: #333; line-height: 1; }
  .sval.g { color: #2d7a50; }
  .sval.a { color: #7a5a20; }
  .slbl   { font-size: 6.5pt; letter-spacing: .1em; text-transform: uppercase; color: #999; margin-top: 3pt; font-family: Arial, sans-serif; }
  .tbl    { margin-bottom: 12pt; break-inside: avoid; }
  .tbl-hdr{ background: #f5f0e8; padding: 4pt 8pt; font-weight: bold; font-size: 9.5pt; border: 1pt solid #ddd; border-bottom: none; border-radius: 3pt 3pt 0 0; }
  table   { width: 100%; border-collapse: collapse; border: 1pt solid #ddd; font-size: 8.5pt; }
  th      { padding: 3.5pt 7pt; background: #faf7f2; text-align: left; font-size: 6.5pt; letter-spacing: .1em; text-transform: uppercase; color: #888; border-bottom: 1pt solid #ddd; font-weight: normal; font-family: Arial, sans-serif; }
  td      { padding: 3.5pt 7pt; border-bottom: 1pt solid #f0ece5; vertical-align: top; }
  tr.alt td { background: #fdfcfa; }
  td.note { color: #666; font-style: italic; }
  .footer { margin-top: 14pt; text-align: center; font-size: 7pt; color: #bbb; letter-spacing: .1em; font-family: Arial, sans-serif; }
</style>
</head>
<body>
<div class="header">
  <div class="logo">DigiToy.az &mdash; Qonaq Hesabatı</div>
  <div class="ename">${names || ''}</div>
  ${dateStr ? `<div class="edate">${dateStr}</div>` : ''}
</div>
<div class="stats">
  <div class="sbox"><div class="sval">${stats.total || 0}</div><div class="slbl">Ümumi qonaq</div></div>
  <div class="sbox"><div class="sval g">${stats.going || 0}</div><div class="slbl">Gələcək</div></div>
  <div class="sbox"><div class="sval">${stats.extra_guests_total || 0}</div><div class="slbl">Əlavə qonaq</div></div>
  <div class="sbox hi"><div class="sval a">${stats.real_attendance || 0}</div><div class="slbl">Real iştirak</div></div>
</div>
${tableHtml}
<div class="footer">${new Date().toLocaleDateString('az-AZ')} &nbsp;&middot;&nbsp; DigiToy.az</div>
<script>window.onload=function(){window.print();};<\/script>
</body>
</html>`
}

/* ── Əsas komponent ── */
export default function AdminGuestReports({ slug, names, dateStr = '' }) {
  const [data,         setData]         = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [mode,         setMode]         = useState('tables')
  const [filterStatus, setFilterStatus] = useState(null)
  const [filterTable,  setFilterTable]  = useState(null)
  const [searchVal,    setSearchVal]    = useState('')
  const [exporting,    setExporting]    = useState(false)

  const load = () => {
    if (!slug) return
    setLoading(true)
    setError('')
    getGuests(slug)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError('Məlumatlar yüklənmədi.'); setLoading(false) })
  }

  useEffect(() => { load() }, [slug])

  const allGuests = data?.guests ?? []
  const stats     = data?.stats  ?? {}
  const tableIds  = useMemo(() => [...new Set(allGuests.map(g => g.table_id))].sort(), [allGuests])

  /* ── Filterlər + axtarış ── */
  const visible = useMemo(() => allGuests.filter(g => {
    const matchStatus = filterStatus === null || g.status === filterStatus
    const matchTable  = filterTable  === null || g.table_id === filterTable
    const matchSearch = searchVal === '' || g.full_name.toLowerCase().includes(searchVal.toLowerCase())
    return matchStatus && matchTable && matchSearch
  }), [allGuests, filterStatus, filterTable, searchVal])

  const visibleTableIds = useMemo(() => [...new Set(visible.map(g => g.table_id))].sort(), [visible])

  const handleExport = async (exportMode) => {
    setExporting(true)
    try { await exportGuestsCsv(slug, exportMode) } catch { alert('Export xətası.') } finally { setExporting(false) }
  }

  const handlePrint = () => {
    const html = buildPrintHtml({ guests: allGuests, stats, names, dateStr })
    const w = window.open('', '_blank', 'width=850,height=700')
    if (!w) { alert('Pop-up bloklanıb. Brauzerin pop-up icazəsini açın.'); return }
    w.document.write(html)
    w.document.close()
  }

  const btnBase = { display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 10, fontWeight: 600 }

  if (!slug) return null

  return (
    <div style={{ marginTop: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'oklch(45% 0.03 60)', fontWeight: 600 }}>
          Qonaq Hesabatı
        </span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button type="button" onClick={handlePrint} disabled={!allGuests.length}
            style={{ ...btnBase, background: 'oklch(32% 0.04 60)', color: 'white', opacity: allGuests.length ? 1 : 0.4 }}>
            <Printer size={10} strokeWidth={2} />Çap et
          </button>
          <button type="button" onClick={() => handleExport('tables')} disabled={exporting || !allGuests.length}
            style={{ ...btnBase, background: 'oklch(38% 0.1 145)', color: 'white', opacity: allGuests.length ? 1 : 0.4 }}>
            <Download size={10} strokeWidth={2} />{exporting ? '...' : 'CSV (Masa)'}
          </button>
          <button type="button" onClick={() => handleExport('status')} disabled={exporting || !allGuests.length}
            style={{ ...btnBase, background: 'oklch(42% 0.09 75)', color: 'white', opacity: allGuests.length ? 1 : 0.4 }}>
            <Download size={10} strokeWidth={2} />{exporting ? '...' : 'CSV (Status)'}
          </button>
          <button type="button" onClick={load}
            style={{ ...btnBase, background: 'white', border: '1px solid oklch(85% 0.02 60)', color: 'oklch(50% 0.03 60)' }}>
            <RefreshCw size={10} strokeWidth={1.5} />Yenilə
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '20px 0', textAlign: 'center', fontSize: 12, color: 'oklch(60% 0.03 60)' }}>Yüklənir...</div>
      ) : error ? (
        <div style={{ padding: '14px', background: 'oklch(97% 0.02 25)', borderRadius: 4, fontSize: 12, color: 'oklch(42% 0.1 25)' }}>{error}</div>
      ) : (
        <>
          {/* Stats — 8 kart */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
            <StatCard label="Ümumi Qonaq"    value={stats.total              ?? 0} color="oklch(30% 0.03 60)" />
            <StatCard label="🟢 Gələcək"      value={stats.going              ?? 0} color="oklch(35% 0.1 145)" />
            <StatCard label="🔴 Gəlməyəcək"   value={stats.not_going          ?? 0} color="oklch(38% 0.12 25)" />
            <StatCard label="🟡 Bəlkə"        value={stats.maybe              ?? 0} color="oklch(42% 0.08 70)" />
            <StatCard label="⚪ Cavabsız"      value={stats.no_response        ?? 0} color="oklch(50% 0.03 60)" />
            <StatCard label="Cavab Faizi"     value={`${stats.response_rate   ?? 0}%`} color="oklch(38% 0.09 80)" />
            <StatCard label="➕ Əlavə qonaq"  value={stats.extra_guests_total ?? 0} color="oklch(38% 0.09 220)" />
            <StatCard label="Real İştirak"    value={stats.real_attendance    ?? 0} color="oklch(38% 0.08 75)" highlight />
          </div>

          {/* Mode switcher */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 12, border: '1px solid oklch(85% 0.02 60)', borderRadius: 4, overflow: 'hidden', width: 'fit-content' }}>
            {[
              { key: 'tables', label: 'Masalara görə', Icon: LayoutList },
              { key: 'status', label: 'Statusa görə',  Icon: AlignLeft },
            ].map(({ key, label, Icon }) => (
              <button key={key} type="button" onClick={() => setMode(key)}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: mode === key ? 700 : 400,
                  background: mode === key ? 'oklch(42% 0.09 75)' : 'white', color: mode === key ? 'white' : 'oklch(45% 0.03 60)' }}>
                <Icon size={11} strokeWidth={1.5} />{label}
              </button>
            ))}
          </div>

          {/* Search + Filters */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
              <Search size={13} strokeWidth={1.5} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'oklch(62% 0.03 60)', pointerEvents: 'none' }} />
              <input type="text" placeholder="Ad axtar..." value={searchVal} onChange={e => setSearchVal(e.target.value)}
                style={{ width: '100%', padding: '8px 30px 8px 30px', border: '1px solid oklch(85% 0.02 60)', borderRadius: 4, fontSize: 12, color: 'oklch(30% 0.02 60)', background: 'white', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => { e.target.style.borderColor = 'oklch(72% 0.12 80)' }}
                onBlur={e  => { e.target.style.borderColor = 'oklch(85% 0.02 60)' }}
              />
              {searchVal && <button type="button" onClick={() => setSearchVal('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}><X size={12} strokeWidth={2} style={{ color: 'oklch(60% 0.03 60)' }} /></button>}
            </div>

            {/* Table filter */}
            <select value={filterTable ?? ''} onChange={e => setFilterTable(e.target.value || null)}
              style={{ padding: '8px 10px', border: '1px solid oklch(85% 0.02 60)', borderRadius: 4, fontSize: 11, color: 'oklch(30% 0.02 60)', background: 'white', outline: 'none' }}>
              <option value="">Bütün masalar</option>
              {tableIds.map(tid => <option key={tid} value={tid}>{tid}</option>)}
            </select>
          </div>

          {/* Status filter tabs */}
          <div style={{ display: 'flex', gap: 2, marginBottom: 12, borderBottom: '1px solid oklch(88% 0.02 60)' }}>
            {FILTERS.map(({ key, label }) => {
              const active = filterStatus === key
              return (
                <button key={String(key)} type="button" onClick={() => setFilterStatus(key)}
                  style={{ padding: '7px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: active ? 700 : 400,
                    color: active ? 'oklch(30% 0.04 70)' : 'oklch(55% 0.03 60)',
                    borderBottom: active ? '2px solid oklch(72% 0.12 80)' : '2px solid transparent', marginBottom: -1 }}>
                  {label}
                </button>
              )
            })}
          </div>

          {/* Result count */}
          <div style={{ fontSize: 10, color: 'oklch(58% 0.03 60)', marginBottom: 10 }}>
            {visible.length} qonaq göstərilir {visible.length !== allGuests.length ? `(ümumi ${allGuests.length})` : ''}
          </div>

          {/* Table content */}
          {visible.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', fontSize: 12, color: 'oklch(62% 0.03 60)', background: 'white', border: '1px solid oklch(88% 0.02 60)', borderRadius: 5 }}>
              {searchVal || filterStatus || filterTable ? 'Nəticə tapılmadı.' : 'Hələ heç bir qonaq əlavə edilməyib.'}
            </div>
          ) : (
            <div style={{ background: 'white', border: '1px solid oklch(88% 0.02 60)', borderRadius: 5, overflow: 'hidden' }}>
              {mode === 'tables' ? (
                <ByTablesView guests={visible} tableIds={visibleTableIds} />
              ) : (
                <ByStatusView guests={visible} />
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
