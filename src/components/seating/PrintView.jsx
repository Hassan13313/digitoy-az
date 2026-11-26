import { createPortal } from 'react-dom'
import HallPlan from './HallPlan'
import { seatsOf } from './seatingModel'

/* ─────────────────────────────────────────────────────────────────────────────
   Çap / PDF (2026-11-26, v53): restoran və menecer üçün A4 — zal planı,
   masa-masa siyahı (+1-lər, «gəlməyəcək»), masası olmayanlar. Səhifədən ayrı,
   body-nin birbaşa övladı kimi çəkilir; çap zamanı yalnız bu görünür
   (seating.css › @media print). Brauzerin «PDF kimi saxla» seçimi ilə PDF olur.
   ───────────────────────────────────────────────────────────────────────── */

export default function PrintView({ title, tables, byName, seatsByTable, layout, guests }) {
  const total = guests.reduce((s, g) => s + seatsOf(g), 0)
  const seated = tables.reduce((s, t) => s + t.used, 0)
  const free = guests.filter((g) => !g.table)
  return createPortal(
    <div className="sp-print-root" aria-hidden="true">
      <header className="sp-pr-head">
        <h1>{title || 'Oturma planı'}</h1>
        <p>{tables.length} masa · {seated} nəfər masada · cəmi {total} nəfər (yanındakılarla)</p>
      </header>
      <div className="sp-pr-hall"><HallPlan layout={layout} seatsByTable={seatsByTable} /></div>
      <div className="sp-pr-grid">
        {tables.map((t) => {
          const list = byName.get(t.name) || []
          return (
            <section key={t.name} className="sp-pr-table">
              <h2>{t.name} <small>{t.used} / {t.cap}</small></h2>
              <ol>
                {list.map((g) => (
                  <li key={g.id} className={g.status === 'no' ? 'is-no' : ''}>
                    {g.name}{g.plus > 0 && g.status !== 'no' && <b> +{g.plus}</b>}{g.status === 'no' && <i> — gəlməyəcək</i>}
                  </li>
                ))}
              </ol>
            </section>
          )
        })}
        {free.length > 0 && (
          <section className="sp-pr-table">
            <h2>Masası olmayanlar <small>{free.length}</small></h2>
            <ol>{free.map((g) => <li key={g.id}>{g.name}{g.plus > 0 && <b> +{g.plus}</b>}</li>)}</ol>
          </section>
        )}
      </div>
      <footer className="sp-pr-foot">digitoy.az</footer>
    </div>,
    document.body,
  )
}
