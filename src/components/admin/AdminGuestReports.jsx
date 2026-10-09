import { useState, useEffect, useMemo } from 'react'
import { getGuests, exportGuestsCsv } from '../../utils/api'
import { azDate } from './adminFormat'
import GuestReportTab from './v2/GuestReportTab'
import { Notice } from './v2/adminUi'

/* ─────────────────────────────────────────────────────────────────────────────
   Qonaq hesabatı — UI redesign 2026-10 (görünüş v2/GuestReportTab)

   Məntiq dəyişməyib: get_guests.php, masalara / statusa görə qruplaşdırma,
   axtarış + masa + status filtri, serverdən CSV (export_guests.php), A4 çap.
   ⚠ Çap pəncərəsi admin səhifəsi ilə EYNİ mənşəlidir — qonaq adı və qeyd
   (builder-də müştəri yazır) HTML kimi yazılmır, hamısı escape olunur.
   ───────────────────────────────────────────────────────────────────────── */

const VIEW_STATUS = { GOING: 'yes', NOT_GOING: 'no', MAYBE: 'maybe', NO_RESPONSE: 'none' }
const STATUS_TITLE = { GOING: 'Gələcək', MAYBE: 'Bəlkə', NOT_GOING: 'Gəlməyəcək', NO_RESPONSE: 'Cavabsız' }
const STATUS_ORDER = ['GOING', 'MAYBE', 'NOT_GOING', 'NO_RESPONSE']

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

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
      <div class="tbl-hdr">${esc(tid)} &mdash; ${list.length} nəfər</div>
      <table>
        <thead><tr><th>Ad</th><th>Status</th><th>Əlavə qonaq</th><th>Qeyd</th></tr></thead>
        <tbody>${list.map((g, i) => `
          <tr class="${i % 2 === 1 ? 'alt' : ''}">
            <td>${esc(g.full_name)}</td>
            <td>${esc(PRINT_STATUS[g.status] || g.status)}</td>
            <td style="text-align:center">${g.extra_guests > 0 ? '+' + esc(g.extra_guests) : '—'}</td>
            <td class="note">${esc(g.notes || '')}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `).join('')

  return `<!DOCTYPE html>
<html lang="az">
<head>
<meta charset="UTF-8">
<title>Qonaq Siyahısı${names ? ' — ' + esc(names) : ''}</title>
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
  <div class="ename">${esc(names || '')}</div>
  ${dateStr ? `<div class="edate">${esc(dateStr)}</div>` : ''}
</div>
<div class="stats">
  <div class="sbox"><div class="sval">${esc(stats.total || 0)}</div><div class="slbl">Ümumi qonaq</div></div>
  <div class="sbox"><div class="sval g">${esc(stats.going || 0)}</div><div class="slbl">Gələcək</div></div>
  <div class="sbox"><div class="sval">${esc(stats.extra_guests_total || 0)}</div><div class="slbl">Əlavə qonaq</div></div>
  <div class="sbox hi"><div class="sval a">${esc(stats.real_attendance || 0)}</div><div class="slbl">Real iştirak</div></div>
</div>
${tableHtml}
<div class="footer">${esc(azDate(new Date(), { long: true }))} &nbsp;&middot;&nbsp; DigiToy.az</div>
<script>window.onload=function(){window.print();};<\/script>
</body>
</html>`
}

const statusOf = (g) => VIEW_STATUS[g.status] || 'none'

const toRow = (g, withTable) => ({
  id: String(g.id),
  name: g.full_name,
  status: statusOf(g),
  plus: Number(g.extra_guests) || 0,
  /* statusa görə görünüşdə masa da görünsün (köhnə «Masa» sütunu) */
  note: [withTable ? g.table_id : null, g.notes || null].filter(Boolean).join(' · '),
  date: g.submitted_at ? azDate(g.submitted_at, { year: false }) : '',
})

export default function AdminGuestReports({ slug, names, dateStr = '' }) {
  const [data,         setData]         = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [notice,       setNotice]       = useState('')
  const [view,         setView]         = useState('table')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterTable,  setFilterTable]  = useState('')
  const [searchVal,    setSearchVal]    = useState('')

  const load = () => {
    if (!slug) return
    setLoading(true)
    setError('')
    getGuests(slug)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError('Məlumatlar yüklənmədi.'); setLoading(false) })
  }

  useEffect(() => { load() }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  const allGuests = useMemo(() => data?.guests ?? [], [data])
  const stats     = data?.stats ?? {}
  const tableIds  = useMemo(() => [...new Set(allGuests.map(g => g.table_id))].sort(), [allGuests])

  /* ── Filterlər + axtarış ── */
  const baseVisible = useMemo(() => allGuests.filter(g =>
    (filterTable === '' || g.table_id === filterTable)
    && (searchVal === '' || (g.full_name || '').toLowerCase().includes(searchVal.toLowerCase())),
  ), [allGuests, filterTable, searchVal])
  const visible = useMemo(
    () => baseVisible.filter(g => filterStatus === 'all' || statusOf(g) === filterStatus),
    [baseVisible, filterStatus],
  )

  const statusCounts = useMemo(() => {
    const c = { all: baseVisible.length, yes: 0, no: 0, maybe: 0, none: 0 }
    for (const g of baseVisible) c[statusOf(g)] += 1
    return c
  }, [baseVisible])

  const groups = useMemo(() => {
    if (view === 'status') {
      return STATUS_ORDER.map(s => {
        const list = visible.filter(g => g.status === s)
        return { id: s, title: STATUS_TITLE[s], meta: `${list.length} nəfər`, guests: list.map(g => toRow(g, true)) }
      })
    }
    const ids = [...new Set(visible.map(g => g.table_id))].sort()
    return ids.map(tid => {
      const list = visible.filter(g => g.table_id === tid)
      const answered = list.filter(g => g.status !== 'NO_RESPONSE').length
      return { id: String(tid), title: tid, meta: `${answered}/${list.length} cavab`, guests: list.map(g => toRow(g, false)) }
    })
  }, [visible, view])

  const handleExport = async (by) => {
    setNotice('')
    try { await exportGuestsCsv(slug, by === 'table' ? 'tables' : 'status') }
    catch { setNotice('Export xətası.') }
  }

  const handlePrint = () => {
    const html = buildPrintHtml({ guests: allGuests, stats, names, dateStr })
    const w = window.open('', '_blank', 'width=850,height=700')
    if (!w) { setNotice('Pop-up bloklanıb. Brauzerin pop-up icazəsini açın.'); return }
    w.document.write(html)
    w.document.close()
  }

  if (!slug) return null

  return (
    <>
      {error && <Notice tone="danger" title={error} className="mb-4" />}
      {notice && <Notice tone="warning" title={notice} className="mb-4" />}
      <GuestReportTab
        stats={{
          total: stats.total ?? 0, yes: stats.going ?? 0, no: stats.not_going ?? 0,
          maybe: stats.maybe ?? 0, none: stats.no_response ?? 0, rate: stats.response_rate ?? 0,
          plus: stats.extra_guests_total ?? 0, real: stats.real_attendance ?? 0,
        }}
        view={view}
        onView={setView}
        search={searchVal}
        onSearch={setSearchVal}
        tableFilter={filterTable}
        onTableFilter={setFilterTable}
        tableOptions={[{ value: '', label: 'Bütün masalar' }, ...tableIds.map(t => ({ value: t, label: t }))]}
        statusFilter={filterStatus}
        onStatusFilter={setFilterStatus}
        statusCounts={statusCounts}
        groups={groups}
        shownCount={visible.length}
        onResetFilters={() => { setFilterStatus('all'); setFilterTable(''); setSearchVal('') }}
        onPrint={allGuests.length ? handlePrint : undefined}
        onExportCsv={allGuests.length ? handleExport : undefined}
        onRefresh={load}
        refreshing={loading && !!data}
        loading={loading && !data}
      />
    </>
  )
}
