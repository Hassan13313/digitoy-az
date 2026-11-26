import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Check, Pencil, Plus } from 'lucide-react'
import GuestRoster from './GuestRoster'
import TableCards from './TableCards'
import HallPlan from './HallPlan'
import GuestPreview from './GuestPreview'
import { LinenDefs } from './TableArt'
import { GuestDialog, TableDialog, TagDialog, ZoneDialog } from './SeatingDialogs'
import useSeatDrag from './useSeatDrag'
import {
  SIDE_EVENTS, groupList, layoutPayload, lc, nextId, nextTableName, normalizeLayout,
  plannerGuests, seatSides, seatsOf,
} from './seatingModel'
import './seating.css'

/* ─────────────────────────────────────────────────────────────────────────────
   Oturma planı (2026-11-26): solda qonaq siyahısı, sağda masalar / zal planı /
   qonaq görünüşü. Admin (AdminSeatingPlan) və müştəri paneli (OwnerSeating)
   eyni komponenti işlədir; server əməliyyatları `api` ilə gəlir:
     addGuest(d) · updateGuest(id, d) · deleteGuest(id) · bulk(ids, patch)
     saveLayout(layout, { renames, removed }) · undo?()   (hamısı Promise)
   Hər əməliyyatdan sonra `onReload()`. `readOnly` — yalnız baxış (PİN-siz).
   ───────────────────────────────────────────────────────────────────────── */

const VIEWS = [['cards', 'Masalar'], ['map', 'Zal planı'], ['guest', 'Qonaq görünüşü']]

function useNarrow(ref, px) {
  const [narrow, setNarrow] = useState(false)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < px))
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref, px])
  return narrow
}

export default function SeatingPlanner({ data, loading, readOnly = false, eventType = '', title = '', api, onReload, onImport }) {
  const rootRef = useRef(null)
  const hallRef = useRef(null)
  const narrow = useNarrow(rootRef, 760)

  const guests = useMemo(() => plannerGuests(data), [data])
  const serverLayout = useMemo(() => normalizeLayout(data?.layout, guests.map((g) => g.table)), [data, guests])
  const [draft, setDraft] = useState(null)           /* «Zalı düzənlə» zamanı yerli dəyişikliklər */
  const layout = draft || serverLayout
  const [editing, setEditing] = useState(false)

  const [view, setView] = useState('cards')
  const [selRaw, setSel] = useState(() => new Set())
  const [q, setQ] = useState('')
  const [side, setSide] = useState('all')
  const [folded, setFolded] = useState(() => new Set())
  const [dlg, setDlg] = useState(null)               /* { type, ... , key } */
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState(null)
  const [sheet, setSheet] = useState(false)

  const showSides = SIDE_EVENTS.has(eventType || '') || guests.some((g) => g.side)
  const groups = useMemo(() => groupList(layout.groups, guests), [layout.groups, guests])
  const byTable = useMemo(() => {
    const m = new Map()
    for (const g of guests) if (g.table) { const k = lc(g.table); m.set(k, [...(m.get(k) || []), g]) }
    return m
  }, [guests])
  const tablesView = useMemo(() => layout.tables.map((t) => {
    const list = byTable.get(lc(t.name)) || []
    return { ...t, list, used: list.reduce((s, g) => s + seatsOf(g), 0) }
  }), [layout.tables, byTable])
  const byName = useMemo(() => new Map(tablesView.map((t) => [t.name, t.list])), [tablesView])
  const seatsByTable = useMemo(() => new Map(tablesView.map((t) => [t.name, seatSides(t.list)])), [tablesView])

  /* Seçim: serverdən yeni məlumat gələndə artıq olmayan qonaqlar sayılmır */
  const sel = useMemo(() => {
    const ids = new Set(guests.map((g) => g.id))
    return new Set([...selRaw].filter((id) => ids.has(id)))
  }, [selRaw, guests])

  const tt = useRef(0)
  const say = useCallback((msg, opts = {}) => {
    setToast({ msg, ...opts, at: Date.now() })
    clearTimeout(tt.current)
    tt.current = setTimeout(() => setToast(null), opts.error ? 7000 : 5000)
  }, [])
  useEffect(() => () => clearTimeout(tt.current), [])

  /** Server əməliyyatı: məşğul vəziyyəti, xəta bildirişi, sonra yenidən yüklə */
  const run = async (fn, okMsg) => {
    if (busy) return false
    setBusy(true)
    try {
      await fn()
      await onReload?.()
      if (okMsg) say(okMsg, { undo: !!api.undo })
      return true
    } catch (e) {
      say(e?.message || 'Əməliyyat alınmadı. Bağlantını yoxlayıb yenidən cəhd edin.', { error: true })
      return false
    } finally {
      setBusy(false)
    }
  }

  const place = (ids, tableName) => {
    ids = [...ids]
    if (!ids.length || readOnly) return
    const t = tablesView.find((x) => x.name === tableName)
    const moving = guests.filter((g) => ids.includes(g.id))
    const who = moving.length === 1 ? moving[0].name : `${moving.length} qonaq`
    let msg = tableName ? `${tableName}: ${who} yerləşdirildi` : `${who} masadan çıxarıldı`
    if (t) {
      const after = t.used + moving.filter((g) => lc(g.table) !== lc(t.name)).reduce((s, g) => s + seatsOf(g), 0)
      if (after > t.cap) msg += `. Masada yer qalmadı (${after}/${t.cap})`
    }
    setSel((s) => { const n = new Set(s); ids.forEach((id) => n.delete(id)); return n })
    run(() => api.bulk(ids, { table_id: tableName }), msg)
  }

  /* Plan dərhal ekranda dəyişir; server rədd etsə əvvəlki hala qayıdır */
  const saveLayout = async (next, extra = {}, msg) => {
    const prev = draft
    setDraft(next)
    const ok = await run(() => api.saveLayout(layoutPayload(next), { renames: extra.renames || [], removed: extra.removed || [] }), msg)
    if (!ok) setDraft(prev)
    else if (!editing) setDraft(null)
    return ok
  }

  const drag = useSeatDrag({
    onStart: () => { if (narrow) setSheet(false) },
    onDrop: (ids, target) => {
      if (target === 'roster') place(ids.filter((id) => guests.find((g) => g.id === id)?.table), '')
      else if (target.startsWith('table:')) place(ids, target.slice(6))
    },
    onMove: (kind, id, pos) => setDraft((d) => {
      const base = d || serverLayout
      return kind === 'zone'
        ? { ...base, zones: base.zones.map((z) => (z.id === id ? { ...z, ...pos } : z)) }
        : { ...base, tables: base.tables.map((t) => (t.name === id ? { ...t, ...pos } : t)) }
    }),
    onResize: (id, box) => setDraft((d) => {
      const base = d || serverLayout
      return { ...base, zones: base.zones.map((z) => (z.id === id ? { ...z, ...box } : z)) }
    }),
  })

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !document.querySelector('dialog[open]')) setSel(new Set()) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const toggle = (id) => setSel((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const selectIds = (ids, on) => setSel((s) => { const n = new Set(s); ids.forEach((id) => (on ? n.add(id) : n.delete(id))); return n })
  const fold = (g) => setFolded((s) => { const n = new Set(s); n.has(g) ? n.delete(g) : n.add(g); return n })
  const open = (type, extra = {}) => setDlg({ type, key: Date.now(), ...extra })
  const close = () => setDlg(null)

  /* ── Masa / zona pəncərələri ── */
  const saveTable = async (form) => {
    const old = dlg.table?.existing ? dlg.table : null
    const clash = layout.tables.some((t) => lc(t.name) === lc(form.name) && t.name !== old?.name)
    if (clash) { say(`«${form.name}» adlı masa artıq var`, { error: true }); return }
    const next = old
      ? { ...layout, tables: layout.tables.map((t) => (t.name === old.name ? { ...t, ...form } : t)) }
      : { ...layout, tables: [...layout.tables, { ...form, x: null, y: null }] }
    const renames = old && old.name !== form.name ? [{ from: old.name, to: form.name }] : []
    const placed = normalizeLayout(next, [])
    if (await saveLayout(placed, { renames }, old ? 'Yadda saxlanıldı' : `${form.name} əlavə edildi`)) close()
  }
  const deleteTable = async () => {
    const t = dlg.table
    const next = { ...layout, tables: layout.tables.filter((x) => x.name !== t.name) }
    if (await saveLayout(next, { removed: [t.name] }, `${t.name} silindi${t.list?.length ? ', qonaqları siyahıya qayıtdı' : ''}`)) close()
  }
  const saveZone = (form) => {
    const base = layout
    const next = dlg.zone
      ? { ...base, zones: base.zones.map((z) => (z.id === dlg.zone.id ? { ...z, ...form } : z)) }
      : { ...base, zones: [...base.zones, { id: nextId(base.zones), x: 50, y: 50, w: 16, h: 8, ...form }] }
    setDraft(next)
    close()
    if (!dlg.zone) say(`${form.label} əlavə edildi. Onu tutub istədiyiniz yerə çəkin`)
  }
  const deleteZone = () => { setDraft({ ...layout, zones: layout.zones.filter((z) => z.id !== dlg.zone.id) }); close() }
  const startEdit = () => { setDraft(layout); setEditing(true); setSel(new Set()) }
  const finishEdit = async () => {
    if (await saveLayout(layout, {}, 'Zal planı yadda saxlanıldı')) { setEditing(false); setDraft(null) }
  }

  /* ── Qonaq pəncərələri ── */
  const saveGuest = async (form) => {
    const g = dlg.guest
    const ok = g
      ? await run(() => api.updateGuest(g.id, form), 'Yadda saxlanıldı')
      : await run(() => api.addGuest(form), `${form.name} əlavə edildi`)
    if (ok) close()
  }
  const saveTag = async (patch) => {
    const ids = [...sel]
    const p = {}
    if ('side' in patch) p.side = patch.side
    if ('group' in patch) p.group_name = patch.group
    if (!Object.keys(p).length) { close(); return }
    if (await run(() => api.bulk(ids, p), `${ids.length} qonaq yeniləndi`)) close()
  }

  const total = guests.length, seated = guests.filter((g) => g.table).length
  const placing = sel.size > 0 && !readOnly && !editing
  const anySeated = [...sel].some((id) => guests.find((g) => g.id === id)?.table)

  const steps = (where) => (
    <ol className="sp-steps">
      <li className={sel.size ? 'done' : 'now'}><b>{sel.size ? <Check aria-hidden="true" /> : '1'}</b>{narrow ? '«Qonaq seç» düyməsi ilə qonaqları seçin' : 'Soldakı siyahıdan qonaqları seçin'}</li>
      <li className={sel.size ? 'now' : ''}><b>2</b>{where === 'map' ? 'Xəritədə masaya toxunun' : 'Masaya toxunun və ya adı masaya sürüşdürün'}</li>
    </ol>
  )
  const legend = (
    <div className="sp-legend">
      {showSides && <><span><i className="sp-chair bride" />Qız evi</span><span><i className="sp-chair groom" />Oğlan evi</span></>}
      {!showSides && <span><i className="sp-chair taken" />Dolu stul</span>}
      <span><i className="sp-chair" />Boş stul</span>
    </div>
  )

  return (
    <div ref={rootRef} className={`sp${narrow ? ' is-narrow' : ''}${placing ? ' is-placing' : ''}${sheet ? ' has-sheet' : ''}`}>
      <LinenDefs />
      <div className="sp-top">
        <div className="sp-prog">
          <p><b>{seated}</b> / {total} qonaq yerləşdirilib</p>
          <div className="sp-pbar"><span style={{ width: `${total ? (seated / total) * 100 : 0}%` }} /></div>
          <small>{total - seated ? `${total - seated} qonaq hələ masasızdır` : total ? 'Hamı yerləşdirilib' : 'Qonaq siyahısı boşdur'}</small>
        </div>
        <div className="sp-seg" role="tablist" aria-label="Görünüş">
          {VIEWS.map(([v, l]) => <button key={v} type="button" role="tab" aria-selected={view === v} onClick={() => setView(v)}>{l}</button>)}
        </div>
      </div>

      <div className="sp-body">
        <GuestRoster guests={guests} sel={sel} q={q} onQuery={setQ} side={side} onSide={setSide} showSides={showSides}
          groups={groups} folded={folded} onFold={fold} onToggle={toggle} onSelectIds={selectIds}
          onEdit={(g) => open('guest', { guest: g })} onAdd={() => open('guest')} onImport={onImport}
          readOnly={readOnly} drag={drag} sheet={sheet} onCloseSheet={() => setSheet(false)} />

        <div className="sp-stage">
          {loading && !data ? <p className="sp-loading">Yüklənir…</p> : (
            <>
              {view === 'cards' && (
                <>
                  <div className="sp-v-head"><h3>Masalar</h3>{legend}
                    {!readOnly && <button type="button" className="sp-btn" onClick={() => open('table', { table: { name: nextTableName(layout.tables), shape: 'round', cap: 10 } })}><Plus aria-hidden="true" />Masa əlavə et</button>}
                  </div>
                  {!readOnly && steps('cards')}
                  {readOnly && <p className="sp-ro">Baxış rejimi: dəyişmək üçün yuxarıda PİN-i daxil edin.</p>}
                  <TableCards tables={tablesView} byTable={byName} sel={sel} readOnly={readOnly || editing} drag={drag}
                    onToggle={toggle} onPlace={(name) => place(sel, name)}
                    onEdit={(t) => open('table', { table: { ...t, existing: true } })}
                    onAdd={() => open('table', { table: { name: nextTableName(layout.tables), shape: 'round', cap: 10 } })} />
                </>
              )}
              {view === 'map' && (
                <>
                  {editing ? (
                    <div className="sp-edit-bar">
                      <p><b>Zalı düzənləyirsiniz.</b> Masaları və zonaları tutub istədiyiniz yerə çəkin. Zonanı küncündəki kvadratdan dartıb böyüdün. Adını dəyişmək və ya silmək üçün üstünə toxunun.</p>
                      <div className="sp-eb-btns">
                        <button type="button" className="sp-btn" onClick={() => open('table', { table: { name: nextTableName(layout.tables), shape: 'round', cap: 10 } })}><Plus aria-hidden="true" />Masa</button>
                        <button type="button" className="sp-btn" onClick={() => open('zone')}><Plus aria-hidden="true" />Zona</button>
                        <button type="button" className="sp-btn pri" disabled={busy} onClick={finishEdit}>{busy ? 'Saxlanılır…' : 'Hazırdır'}</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="sp-v-head"><h3>Zal planı</h3>{legend}
                        {!readOnly && <button type="button" className="sp-btn" onClick={startEdit}><Pencil aria-hidden="true" />Zalı düzənlə</button>}
                      </div>
                      {!readOnly && steps('map')}
                    </>
                  )}
                  <div className="sp-hall-wrap">
                    <HallPlan layout={layout} seatsByTable={seatsByTable} editing={editing} hallRef={hallRef}
                      onTablePointerDown={(e, t) => { if (editing) drag.startItem(e, 'table', t, hallRef.current) }}
                      onTableClick={(t) => {
                        if (readOnly) return
                        if (!editing && sel.size) place(sel, t.name)
                        else open('table', { table: { ...tablesView.find((x) => x.name === t.name), existing: true } })
                      }}
                      onZonePointerDown={(e, z) => drag.startItem(e, 'zone', z, hallRef.current)}
                      onZoneClick={(z) => open('zone', { zone: z })}
                      onResizePointerDown={(e, z) => drag.startResize(e, z, hallRef.current)} />
                  </div>
                </>
              )}
              {view === 'guest' && (
                <GuestPreview guests={guests} layout={layout} title={title} readOnly={readOnly} busy={busy}
                  onChange={(key, value) => saveLayout({ ...layout, [key]: value }, {}, key === 'showMap'
                    ? (value ? 'Qonaqlar zal planını görəcək' : 'Qonaqlar zal planını görməyəcək')
                    : (value ? 'Qonaqlar masa yoldaşlarını görəcək' : 'Qonaqlar yalnız masa nömrəsini görəcək'))} />
              )}
            </>
          )}
        </div>
      </div>

      {narrow && !sel.size && <button type="button" className="sp-fab" onClick={() => setSheet(true)}>Qonaq seç <span>{total - seated}</span></button>}
      {narrow && sheet && <div className="sp-scrim" onClick={() => setSheet(false)} />}

      {sel.size > 0 && !readOnly && !editing && (
        <div className="sp-selbar" role="region" aria-label="Seçilmiş qonaqlar">
          <div className="sp-sb-txt"><b>{sel.size} qonaq seçildi</b>{!narrow && <span>İndi masaya toxunun və ya sürüşdürün</span>}</div>
          {narrow && (sheet
            ? <button type="button" className="go" onClick={() => setSheet(false)}>Masa seç</button>
            : <button type="button" onClick={() => setSheet(true)}>Siyahı</button>)}
          <button type="button" onClick={() => open('tag')}>{showSides ? 'Tərəf və qrup' : 'Qrup'}</button>
          {anySeated && <button type="button" disabled={busy} onClick={() => place([...sel].filter((id) => guests.find((g) => g.id === id)?.table), '')}>Masadan çıxar</button>}
          <button type="button" onClick={() => setSel(new Set())}>Ləğv et</button>
        </div>
      )}

      {toast && (
        <div className={`sp-toast${toast.error ? ' is-error' : ''}`} role="status" aria-live="polite" key={toast.at}>
          <span>{toast.msg}</span>
          {toast.undo && api.undo && <button type="button" disabled={busy} onClick={() => { setToast(null); run(() => api.undo(), 'Geri qaytarıldı') }}>Geri qaytar</button>}
        </div>
      )}

      {dlg?.type === 'guest' && (
        <GuestDialog key={dlg.key} open guest={dlg.guest} tables={tablesView} groups={groups} showSides={showSides}
          defaultSide={side !== 'all' ? side : null} busy={busy} onClose={close} onSave={saveGuest}
          onDelete={dlg.guest ? async () => { if (await run(() => api.deleteGuest(dlg.guest.id), `${dlg.guest.name} silindi`)) close() } : undefined} />
      )}
      {dlg?.type === 'tag' && <TagDialog key={dlg.key} open count={sel.size} groups={groups} showSides={showSides} busy={busy} onClose={close} onSave={saveTag} />}
      {dlg?.type === 'table' && (
        <TableDialog key={dlg.key} open table={dlg.table} guests={dlg.table?.existing ? byName.get(dlg.table.name) || [] : []} busy={busy}
          onClose={close} onSave={saveTable} onDelete={deleteTable}
          onUnseat={(id) => place([id], '')} />
      )}
      {dlg?.type === 'zone' && <ZoneDialog key={dlg.key} open zone={dlg.zone} onClose={close} onSave={saveZone} onDelete={deleteZone} />}
    </div>
  )
}
