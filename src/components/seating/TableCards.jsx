import { AlertTriangle, PlusCircle } from 'lucide-react'
import TableArt from './TableArt'
import { apartConflicts, seatSides, seatsOf } from './seatingModel'

/* ─────────────────────────────────────────────────────────────────────────────
   Masalar kart görünüşündə: masanın şəkli (stullar tərəf rəngində), ad, dolu /
   boş yer, qonaqların tam adları. Qonaq seçiləndə kartın istənilən yerinə
   toxunmaq — həmin masaya yerləşdirmək.
   v53: «gəlməyəcəyəm» cavabı verənlər stul tutmur — kartda xəbərdarlıq və bir
   kliklə masadan çıxarma; «ayrı otursun» deyilən qonaqlar eyni masadadırsa xəbərdarlıq.
   ───────────────────────────────────────────────────────────────────────── */

export default function TableCards({ tables, byTable, sel, links, readOnly, drag, onToggle, onPlace, onEdit, onAdd, onUnseat }) {
  const placing = sel.size > 0 && !readOnly
  return (
    <div className="sp-grid">
      {tables.map((t) => {
        const list = byTable.get(t.name) || []
        const used = list.reduce((s, g) => s + seatsOf(g), 0)
        const over = used > t.cap
        const no = list.filter((g) => g.status === 'no')
        const clash = apartConflicts(list, links)
        const nameOf = (id) => list.find((g) => g.id === id)?.name || ''
        const st = over ? <span className="sp-st warn">{used - t.cap} stul əlavə edin</span>
          : used === t.cap ? <span className="sp-st full">Masa doludur</span>
            : <span className="sp-st">{used ? `${t.cap - used} boş yer` : 'Boş masa'}</span>
        return (
          <article key={t.name} className={`sp-tcard${over ? ' over' : ''}${placing ? ' is-target' : ''}`} data-drop={`table:${t.name}`}
            onClick={placing ? (e) => { if (!e.target.closest('button')) onPlace(t.name) } : undefined}>
            <div className={`sp-tc-art ${t.shape}`}><TableArt table={t} seats={seatSides(list)} /></div>
            <h4>{t.name}</h4>
            <p className="sp-tc-meta"><b>{used}</b> / {t.cap} nəfər, {st}</p>
            {no.length > 0 && (
              <div className="sp-warn">
                <AlertTriangle aria-hidden="true" />
                <span>{no.length} nəfər gəlməyəcəyini yazıb, yeri boşdur</span>
                {!readOnly && <button type="button" onClick={() => onUnseat(no.map((g) => g.id))}>Masadan çıxar</button>}
              </div>
            )}
            {clash.map(([a, b]) => (
              <div key={`${a}-${b}`} className="sp-warn"><AlertTriangle aria-hidden="true" /><span>{nameOf(a)} və {nameOf(b)} ayrı oturmalıdır</span></div>
            ))}
            {list.length ? (
              <ul className="sp-names">
                {list.map((g) => (
                  <li key={g.id} onPointerDown={readOnly ? undefined : (e) => drag.startGuests(e, sel.has(g.id) ? [...sel] : [g.id], g)}>
                    <button type="button" className={`sp-nm-btn${sel.has(g.id) ? ' is-sel' : ''}${g.status === 'no' ? ' is-no' : ''}`} aria-pressed={sel.has(g.id)} disabled={readOnly} onClick={() => onToggle(g.id)}>
                      <i className={`sp-sd ${g.side || ''}`} /><span>{g.name}</span>
                      {g.status === 'no' ? <small>gəlməyəcək</small> : g.plus > 0 && <em>+{g.plus}</em>}
                    </button>
                  </li>
                ))}
              </ul>
            ) : <p className="sp-tc-empty">{readOnly ? 'Bu masada hələ qonaq yoxdur' : 'Qonaqları seçin və bu masaya toxunun'}</p>}
            {!readOnly && (placing
              ? <button type="button" className="sp-place" onClick={() => onPlace(t.name)}>Bu masaya yerləşdir</button>
              : <button type="button" className="sp-tc-edit" onClick={() => onEdit(t)}>Masanı dəyiş</button>)}
          </article>
        )
      })}
      {!readOnly && <button type="button" className="sp-add-card" onClick={onAdd}><PlusCircle aria-hidden="true" /><span>Yeni masa</span></button>}
    </div>
  )
}
