import { Check, ChevronDown, Pencil, X } from 'lucide-react'
import { initials, lc } from './seatingModel'

/* ─────────────────────────────────────────────────────────────────────────────
   Soldakı qonaq siyahısı: yalnız masası olmayanlar (axtarışda hamı), tərəf
   düymələri, qruplar başlıq kimi (yığılır, «Hamısını seç»). Sətrə toxunmaq —
   seçmək; siçanla tutub masaya çəkmək; barmaqla bir az saxlayıb çəkmək.
   Telefonda aşağıdan açılan pərdədir (`sheet`).
   ───────────────────────────────────────────────────────────────────────── */

const RSVP_TAG = { no: ['Gəlməyəcək', 'no'], none: ['Cavab verməyib', ''], maybe: ['Bəlkə gələr', ''] }

function rosterPool(guests, q) {
  const n = lc(q.trim())
  return n ? guests.filter((g) => lc(g.name).includes(n)) : guests.filter((g) => !g.table)
}

export default function GuestRoster({
  guests, sel, q, onQuery, side, onSide, showSides, groups, folded, onFold,
  onToggle, onSelectIds, onEdit, onAdd, onImport, readOnly, drag, sheet, onCloseSheet,
}) {
  const pool = rosterPool(guests, q)
  const bySide = (s) => pool.filter((g) => s === 'all' || g.side === s)
  const vis = bySide(showSides ? side : 'all')
  /* `groups` qonaqlardakı bütün qrupları da əhatə edir (groupList) */
  const sections = [...groups, ''].map((gr) => [gr, vis.filter((g) => lc(g.group) === lc(gr))]).filter(([, l]) => l.length)

  return (
    <aside className={`sp-roster${sheet ? ' is-open' : ''}`} data-drop="roster" aria-label="Qonaq siyahısı">
      <div className="sp-r-head">
        <h3>Qonaqlar</h3>
        {!readOnly && <button type="button" className="sp-btn sm pri" onClick={onAdd}>+ Qonaq</button>}
        <button type="button" className="sp-r-close" onClick={onCloseSheet} aria-label="Siyahını bağla"><X aria-hidden="true" /></button>
      </div>
      <div className="sp-r-tools">
        <input className="sp-search" type="search" value={q} onChange={(e) => onQuery(e.target.value)} placeholder="Qonaq axtar" aria-label="Qonaq axtar" />
        {showSides && (
          <div className="sp-sides" role="group" aria-label="Kimin qonağı">
            {[['all', 'Hamısı'], ['bride', 'Qız evi'], ['groom', 'Oğlan evi']].map(([s, l]) => (
              <button key={s} type="button" className={`${s}${side === s ? ' on' : ''}`} aria-pressed={side === s} onClick={() => onSide(s)}>
                {s !== 'all' && <i className={`sp-sd ${s}`} />}{l}<span>{bySide(s).length}</span>
              </button>
            ))}
          </div>
        )}
        <p className="sp-note">{q.trim() ? 'Axtarış bütün qonaqlarda gedir, masada olanlar da çıxır.' : 'Burada masası olmayan qonaqlar görünür.'}</p>
      </div>
      <div className="sp-list">
        {sections.map(([gr, list]) => {
          const shut = folded.has(gr)
          const all = list.every((g) => sel.has(g.id))
          return (
            <section key={gr || '__none'} className={shut ? 'is-shut' : ''}>
              <div className="sp-sec-h">
                <button type="button" className="sp-sec-t" aria-expanded={!shut} onClick={() => onFold(gr)}>
                  <ChevronDown aria-hidden="true" />{gr || 'Qrupsuz'}<b>{list.length}</b>
                </button>
                {!readOnly && (
                  <button type="button" className="sp-link" onClick={() => onSelectIds(list.map((g) => g.id), !all)}>
                    {all ? 'Seçimi götür' : 'Hamısını seç'}
                  </button>
                )}
              </div>
              {!shut && list.map((g) => <Row key={g.id} g={g} on={sel.has(g.id)} readOnly={readOnly} drag={drag} sel={sel} onToggle={onToggle} onEdit={onEdit} />)}
            </section>
          )
        })}
        {!sections.length && (
          q.trim() ? <p className="sp-r-empty">Bu adla qonaq tapılmadı.</p>
            : guests.length && guests.every((g) => g.table)
              ? <div className="sp-r-done"><b>Hamı yerləşdirildi</b><p>Kimisə başqa masaya keçirmək üçün masadakı adına toxunun.</p></div>
              : guests.length ? <p className="sp-r-empty">Bu tərəfdə masası olmayan qonaq qalmayıb.</p>
                : <div className="sp-r-done"><b>Hələ qonaq yoxdur</b><p>«+ Qonaq» ilə əlavə edin{onImport ? ' və ya Excel faylını yükləyin' : ''}.</p></div>
        )}
      </div>
      {onImport && !readOnly && <div className="sp-r-foot"><button type="button" className="sp-link" onClick={onImport}>Excel-dən siyahı yüklə</button></div>}
    </aside>
  )
}

function Row({ g, on, readOnly, drag, sel, onToggle, onEdit }) {
  const tag = RSVP_TAG[g.status]
  return (
    <div className={`sp-row${on ? ' is-sel' : ''}`}
      onPointerDown={readOnly ? undefined : (e) => {
        if (e.target.closest('.sp-edit')) return
        const ids = sel.has(g.id) ? [...sel] : [g.id]
        drag.startGuests(e, ids, g)
      }}>
      <button type="button" className="sp-pick" aria-pressed={on} disabled={readOnly} onClick={() => onToggle(g.id)}>
        <span className={`sp-av ${g.side || ''}`} aria-hidden="true">{on ? <Check /> : initials(g.name)}</span>
        <span className="sp-nm">
          <b>{g.name}</b>
          <small>
            {g.plus > 0 && <span className="sp-plus">+{g.plus} nəfər</span>}
            {g.table && <span>{g.table}</span>}
            {tag && <span className={`sp-tag ${tag[1]}`}>{tag[0]}</span>}
          </small>
        </span>
      </button>
      {!readOnly && (
        <button type="button" className="sp-edit" aria-label={`Düzəliş et: ${g.name}`} onClick={() => onEdit(g)}><Pencil aria-hidden="true" /></button>
      )}
    </div>
  )
}
