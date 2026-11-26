import { useEffect, useRef, useState } from 'react'
import { Circle, RectangleHorizontal, Square } from 'lucide-react'
import { SIDE_LABEL, ZONE_PRESETS, clamp, seatsOf } from './seatingModel'
import { ZONE_ICON } from './HallPlan'

/* ─────────────────────────────────────────────────────────────────────────────
   Oturma planının pəncərələri: qonaq, tərəf və qrup (toplu), masa, zona.
   Böyük düymələr, «− / +» sayğac — texnologiyaya az bələd istifadəçi üçün.
   Yerli <dialog> (fokus tələsi, Esc, arxa fon brauzerdən).
   ───────────────────────────────────────────────────────────────────────── */

function SpDialog({ open, onClose, title, sub, children, footer, onSubmit, busy }) {
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog ref={ref} className="sp-dlg" onClose={onClose} onCancel={(e) => { if (busy) e.preventDefault() }}>
      {open && (
        <form className="sp-dform" noValidate={false} onSubmit={(e) => { e.preventDefault(); if (!busy) onSubmit?.(new FormData(e.currentTarget)) }}>
          <h3>{title}</h3>
          {sub && <p className="sp-dsub">{sub}</p>}
          {children}
          <menu>
            {footer}
            <span className="sp-sp" />
            <button type="button" className="sp-btn" onClick={onClose} disabled={busy}>Bağla</button>
            <button type="submit" className="sp-btn pri" disabled={busy}>{busy ? 'Saxlanılır…' : 'Yadda saxla'}</button>
          </menu>
        </form>
      )}
    </dialog>
  )
}

function Stepper({ name, value, min, max, label }) {
  const [v, setV] = useState(value)
  const set = (n) => setV(clamp(Number(n) || 0, min, max))
  return (
    <div className="sp-f">
      <span>{label}</span>
      <div className="sp-stepper">
        <button type="button" aria-label="Azalt" onClick={() => set(v - 1)}>−</button>
        <input type="number" name={name} value={v} min={min} max={max} inputMode="numeric" aria-label={label} onChange={(e) => set(e.target.value)} />
        <button type="button" aria-label="Artır" onClick={() => set(v + 1)}>+</button>
      </div>
    </div>
  )
}

function SidePick({ value, keep }) {
  return (
    <fieldset className="sp-big2">
      <legend>Kimin qonağıdır?</legend>
      {['bride', 'groom'].map((s) => (
        <label key={s} className={s}><input type="radio" name="side" value={s} defaultChecked={value === s} /><i className={`sp-sd ${s}`} />{SIDE_LABEL[s]}</label>
      ))}
      {keep ? <label><input type="radio" name="side" value="__keep" defaultChecked />Dəyişmə</label>
        : <label><input type="radio" name="side" value="" defaultChecked={!value} />Bilinmir</label>}
    </fieldset>
  )
}

function GroupPick({ value, groups, keep }) {
  return (
    <>
      <fieldset className="sp-chips-pick">
        <legend>Qrup</legend>
        {keep && <label><input type="radio" name="group" value="__keep" defaultChecked />Dəyişmə</label>}
        {[...groups, ''].map((g) => (
          <label key={g || '__none'}><input type="radio" name="group" value={g} defaultChecked={!keep && g === (value || '')} />{g || 'Qrupsuz'}</label>
        ))}
      </fieldset>
      <label className="sp-f">Yeni qrup lazımdırsa, adını yazın
        <input name="newgroup" maxLength={60} placeholder="məs. Universitet yoldaşları" autoComplete="off" />
      </label>
    </>
  )
}
const pickedGroup = (fd) => String(fd.get('newgroup') || '').trim() || String(fd.get('group') ?? '')

/** Silmə düyməsi: birinci toxunuş soruşur, ikinci silir (brauzerin confirm pəncərəsi olmadan) */
function DangerButton({ label, confirm, onClick, disabled }) {
  const [ask, setAsk] = useState(false)
  return (
    <button type="button" className={`sp-btn danger${ask ? ' is-ask' : ''}`} disabled={disabled}
      onClick={() => (ask ? onClick() : setAsk(true))}>{ask ? confirm : label}</button>
  )
}

/** Qonaq əlavə et / düzəliş. «+1» (yanındakılar) qonağın RSVP cavabından gəlir — burada yalnız göstərilir */
export function GuestDialog({ open, guest, tables, groups, showSides, defaultSide, onSave, onDelete, onClose, busy }) {
  const g = guest || { name: '', side: defaultSide || null, group: '', plus: 0, table: '' }
  return (
    <SpDialog open={open} onClose={onClose} busy={busy} title={guest ? 'Qonaq' : 'Qonaq əlavə et'}
      sub={guest?.plus > 0 ? `Cavabında yanında ${guest.plus} nəfər gələcəyini yazıb (${guest.plus + 1} yer)` : null}
      footer={guest && onDelete && <DangerButton label="Qonağı sil" confirm="Bəli, sil" disabled={busy} onClick={onDelete} />}
      onSubmit={(fd) => {
        const name = String(fd.get('name') || '').trim()
        if (!name) return
        onSave({
          name,
          side: showSides ? (String(fd.get('side') || '') || null) : g.side,
          group: pickedGroup(fd),
          table: String(fd.get('table') ?? ''),
          note: String(fd.get('note') || '').trim(),
        })
      }}>
      <label className="sp-f">Adı və soyadı<input name="name" required maxLength={120} defaultValue={g.name} autoComplete="off" /></label>
      {showSides && <SidePick value={g.side} />}
      <GroupPick value={g.group} groups={groups} />
      <label className="sp-f">Qeyd (ixtiyari)<input name="note" maxLength={300} defaultValue={g.note || ''} autoComplete="off" /></label>
      <label className="sp-f">Masa
        <select name="table" defaultValue={g.table}>
          <option value="">Hələ masası yoxdur</option>
          {tables.map((t) => <option key={t.name} value={t.name}>{t.name} ({t.used}/{t.cap})</option>)}
        </select>
      </label>
    </SpDialog>
  )
}

/** Seçilən qonaqlara tərəf və qrup */
export function TagDialog({ open, count, groups, showSides, onSave, onClose, busy }) {
  return (
    <SpDialog open={open} onClose={onClose} busy={busy} title={showSides ? 'Tərəf və qrup' : 'Qrup'} sub={`Seçilən ${count} qonaq üçün`}
      onSubmit={(fd) => {
        const patch = {}
        const side = String(fd.get('side') ?? '__keep')
        if (showSides && side !== '__keep') patch.side = side || null
        const grp = pickedGroup(fd)
        if (grp !== '__keep') patch.group = grp
        onSave(patch)
      }}>
      {showSides && <SidePick keep />}
      <GroupPick groups={groups} keep />
    </SpDialog>
  )
}

/** Masa: ad, forma, tutum; masadakı qonaqlar və silmə */
export function TableDialog({ open, table, guests = [], onSave, onDelete, onUnseat, onClose, busy }) {
  const isNew = !table?.existing
  const used = guests.reduce((s, g) => s + seatsOf(g), 0)
  return (
    <SpDialog open={open} onClose={onClose} busy={busy} title={isNew ? 'Yeni masa' : table.name}
      sub={isNew ? null : `${used} / ${table.cap} yer dolu`}
      footer={!isNew && onDelete && <DangerButton label="Masanı sil" confirm={guests.length ? 'Bəli, sil (qonaqlar siyahıya qayıdır)' : 'Bəli, sil'} disabled={busy} onClick={onDelete} />}
      onSubmit={(fd) => {
        const name = String(fd.get('name') || '').trim()
        if (!name) return
        onSave({ name, shape: fd.get('shape') === 'long' ? 'long' : 'round', cap: clamp(Number(fd.get('cap')) || 10, 1, 60) })
      }}>
      <label className="sp-f">Masanın adı<input name="name" required maxLength={80} defaultValue={table?.name || ''} autoComplete="off" /></label>
      <fieldset className="sp-big2">
        <legend>Forması</legend>
        <label><input type="radio" name="shape" value="round" defaultChecked={table?.shape !== 'long'} /><Circle aria-hidden="true" />Dəyirmi</label>
        <label><input type="radio" name="shape" value="long" defaultChecked={table?.shape === 'long'} /><RectangleHorizontal aria-hidden="true" />Uzun</label>
      </fieldset>
      <Stepper name="cap" value={table?.cap || 10} min={1} max={60} label="Neçə nəfərlikdir?" />
      {!isNew && (
        <div className="sp-f">
          <span>Masadakı qonaqlar</span>
          <ul className="sp-tlist">
            {guests.length ? guests.map((g) => (
              <li key={g.id}>
                <i className={`sp-sd ${g.side || ''}`} />
                <span>{g.name}{g.plus > 0 && <em> +{g.plus}</em>}</span>
                {onUnseat && <button type="button" disabled={busy} onClick={() => onUnseat(g.id)}>Masadan çıxar</button>}
              </li>
            )) : <li className="sp-muted">Bu masada hələ qonaq yoxdur.</li>}
          </ul>
        </div>
      )}
    </SpDialog>
  )
}

/** Zona: hazır adlar (Musiqi zonası…) və ya öz adı; forma */
export function ZoneDialog({ open, zone, onSave, onDelete, onClose }) {
  const isNew = !zone
  const [label, setLabel] = useState(zone?.label || '')
  return (
    <SpDialog open={open} onClose={onClose} title={isNew ? 'Yeni zona' : zone.label}
      footer={!isNew && <DangerButton label="Zonanı sil" confirm="Bəli, sil" onClick={onDelete} />}
      onSubmit={(fd) => {
        const l = String(fd.get('label') || '').trim()
        if (!l) return
        const preset = ZONE_PRESETS.find(([p]) => p === l)
        onSave({ label: l, shape: fd.get('shape') === 'oval' ? 'oval' : 'rect', kind: isNew ? (preset ? preset[1] : 'custom') : zone.kind })
      }}>
      {isNew && (
        <fieldset className="sp-chips-pick">
          <legend>Hazır adlardan seçin</legend>
          {ZONE_PRESETS.map(([l, k]) => {
            const Icon = ZONE_ICON[k]
            return <label key={k}><input type="radio" name="preset" value={k} checked={label === l} onChange={() => setLabel(l)} /><Icon aria-hidden="true" />{l}</label>
          })}
        </fieldset>
      )}
      <label className="sp-f">{isNew ? 'və ya öz adınızı yazın' : 'Zonanın adı'}
        <input name="label" required maxLength={30} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="məs. Gəlin otağı" autoComplete="off" />
      </label>
      <fieldset className="sp-big2">
        <legend>Forması</legend>
        <label><input type="radio" name="shape" value="rect" defaultChecked={zone?.shape !== 'oval'} /><Square aria-hidden="true" />Düzbucaq</label>
        <label><input type="radio" name="shape" value="oval" defaultChecked={zone?.shape === 'oval'} /><Circle aria-hidden="true" />Oval</label>
      </fieldset>
    </SpDialog>
  )
}
