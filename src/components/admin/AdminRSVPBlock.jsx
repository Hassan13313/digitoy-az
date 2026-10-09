import { useState, useEffect, useMemo } from 'react'
import { getRsvpResponses } from '../../utils/api'
import { azDate } from './adminFormat'
import RsvpTab from './v2/RsvpTab'
import { Notice } from './v2/adminUi'

/* ─────────────────────────────────────────────────────────────────────────────
   İştirak təsdiqi cavabları (Phase 48 — siyahısız RSVP)
   UI redesign 2026-10: görünüş v2/RsvpTab. Məntiq dəyişməyib: get_rsvp_responses,
   CSV (UTF-8 BOM, «;»), çap pəncərəsi (qonaq adı HTML kimi yazılmır).
   ───────────────────────────────────────────────────────────────────────── */

const STATUS_AZ = { yes: 'Gələcək', maybe: 'Bəlkə', no: 'Gəlməyəcək' }

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

/* Qonaq adı İCTİMAİ formadan gəlir — çap pəncərəsinə HTML kimi yazılmamalıdır */
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

/* ── Print Window ── */
function handlePrint(data, names, slug) {
  const today    = azDate(new Date(), { long: true })
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
      <td>${esc(r.name || '—')}</td>
      <td>${esc(STATUS_AZ[r.status] ?? r.status)}</td>
      <td>${r.extra_guests > 0 ? '+' + esc(r.extra_guests) : '—'}</td>
      <td>${r.created_at ? esc(r.created_at.slice(0, 10)) : '—'}</td>
    </tr>
  `).join('')

  const html = `<!DOCTYPE html>
<html lang="az">
<head>
  <meta charset="utf-8">
  <title>İştirak Təsdiqi — ${esc(slug)}</title>
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
    <h1>Digitoy İştirak Təsdiqi Hesabatı</h1>
    <h2>${esc(names || slug)}</h2>
    <p>Tarix: ${esc(today)}</p>
  </div>

  <div class="stats">
    ${statRows.map(([label, val], i) => `
      <div class="stat${i === 4 ? ' total' : ''}">
        <div class="val">${esc(val)}</div>
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
  if (!win) return   /* popup bloklanıb */
  win.document.write(html)
  win.document.close()
}

const formatDate = (iso) => azDate(iso, { time: true, year: false })

export default function AdminRSVPBlock({ slug, names }) {
  const [data,      setData]      = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [tab,       setTab]       = useState('all')
  const [searchVal, setSearchVal] = useState('')

  const load = () => {
    if (!slug) return
    setLoading(true)
    setError('')
    getRsvpResponses(slug)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError('İştirak Təsdiqi məlumatları yüklənmədi.'); setLoading(false) })
  }

  useEffect(() => { load() }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  const responses = useMemo(() => data?.responses ?? [], [data])
  const hasData = responses.length > 0

  const rows = useMemo(() => responses
    .map((r, i) => ({ ...r, _i: i }))
    .filter(r => (tab === 'all' || r.status === tab)
      && (searchVal === '' || (r.name ?? '').toLowerCase().includes(searchVal.toLowerCase())))
    .map(r => ({
      id: `${r._i}-${r.created_at || ''}`,
      name: r.name || '—',
      status: r.status,
      plus: Number(r.extra_guests) || 0,
      date: r.created_at ? formatDate(r.created_at) : '',
    })), [responses, tab, searchVal])

  const counts = useMemo(() => ({
    all: responses.length,
    yes: responses.filter(r => r.status === 'yes').length,
    maybe: responses.filter(r => r.status === 'maybe').length,
    no: responses.filter(r => r.status === 'no').length,
  }), [responses])

  if (!slug) return null

  const s = data?.stats || {}
  return (
    <>
      {error && <Notice tone="danger" title={error} className="mb-4" />}
      <RsvpTab
        stats={{ yes: s.yes ?? 0, maybe: s.maybe ?? 0, no: s.no ?? 0, plus: s.guests ?? 0, total: (s.yes ?? 0) + (s.guests ?? 0) }}
        rows={rows}
        tab={tab}
        onTab={setTab}
        counts={counts}
        search={searchVal}
        onSearch={setSearchVal}
        onExportCsv={hasData ? () => exportCSV(responses, slug) : undefined}
        onPrint={hasData ? () => handlePrint(data, names, slug) : undefined}
        onRefresh={load}
        refreshing={loading && !!data}
        loading={loading && !data}
      />
    </>
  )
}
