import { useState } from 'react'
import HallPlan from './HallPlan'
import { lc } from './seatingModel'

/* ─────────────────────────────────────────────────────────────────────────────
   «Qonaq görünüşü»: dəvətnamədəki «masanı tap» necə görünəcək + müştərinin
   iki seçimi (zal planı / masa yoldaşları göstərilsin?). Qız/oğlan evi və
   qruplar qonağa heç vaxt göstərilmir.
   ───────────────────────────────────────────────────────────────────────── */

function YesNo({ id, title, text, value, yes, no, onChange, disabled }) {
  return (
    <div className="sp-note-card ask">
      <h4 id={id}>{title}</h4>
      <p>{text}</p>
      <div className="sp-big2" role="radiogroup" aria-labelledby={id}>
        <label><input type="radio" name={id} checked={value} disabled={disabled} onChange={() => onChange(true)} />{yes}</label>
        <label><input type="radio" name={id} checked={!value} disabled={disabled} onChange={() => onChange(false)} />{no}</label>
      </div>
    </div>
  )
}

export default function GuestPreview({ guests, layout, title, readOnly, busy, onChange }) {
  const seated = guests.filter((g) => g.table)
  const [q, setQ] = useState(seated[0]?.name.split(' ')[0] || '')
  const [pick, setPick] = useState(null)
  const n = lc(q.trim())
  const matches = n.length >= 2 ? seated.filter((g) => lc(g.name).includes(n)).slice(0, 5) : []
  const cur = matches.find((g) => g.id === pick) || matches[0]
  const mates = cur ? seated.filter((g) => g.table === cur.table) : []

  return (
    <div className="sp-gv">
      <div className="sp-phone"><div className="sp-screen">
        {title && <p className="sp-who">{title}</p>}
        <h4>Masanızı tapın</h4>
        <input className="sp-search" type="search" value={q} onChange={(e) => { setQ(e.target.value); setPick(null) }} placeholder="Adınızı yazın" aria-label="Qonaq kimi axtar" />
        {matches.length > 1 && (
          <ul className="sp-gres">
            {matches.map((g) => (
              <li key={g.id}><button type="button" aria-pressed={g.id === cur?.id} onClick={() => setPick(g.id)}><span>{g.name}</span><small>{g.table}</small></button></li>
            ))}
          </ul>
        )}
        {n.length >= 2 && !cur && <p className="sp-found-none">Bu adla masa tapılmadı.</p>}
        {cur && (
          <div className="sp-found">
            <p>{cur.name}, sizin masanız</p>
            <strong>{cur.table}</strong>
            {layout.showTablemates && mates.length > 0 && <p className="sp-mates">{mates.map((g) => g.name).join(', ')}</p>}
            {layout.showMap && <HallPlan layout={layout} mini highlight={cur.table} />}
          </div>
        )}
        {!seated.length && <p className="sp-found-none">Qonaqlar masalara yerləşdiriləndən sonra burada görünəcək.</p>}
      </div></div>
      <div className="sp-notes">
        <YesNo id="sp-show-map" title="Qonaqlar zal planını görsün?" value={layout.showMap} disabled={readOnly || busy}
          text="«Hə» seçsəniz, qonaq adını yazanda masa nömrəsi ilə yanaşı zalın kiçik planını da görür, öz masası işıqlanır. Planı əvvəlcə «Zal planı»nda restoranınıza uyğun düzün."
          yes="Hə, göstərilsin" no="Yox, yalnız masa nömrəsi" onChange={(v) => onChange('showMap', v)} />
        <YesNo id="sp-show-mates" title="Qonaqlar masa yoldaşlarını görsün?" value={layout.showTablemates} disabled={readOnly || busy}
          text="«Hə» seçsəniz, qonaq öz masasında kimlərlə oturacağını görür. «Yox» seçsəniz, yalnız masa nömrəsi görünür."
          yes="Hə, göstərilsin" no="Yox, yalnız masa nömrəsi" onChange={(v) => onChange('showTablemates', v)} />
        <div className="sp-note-card">
          <h4>Qonaq bunları heç vaxt görmür</h4>
          <ul><li>Qız evi və ya oğlan evi işarəsi</li><li>Qruplar, məsələn «Məhlə uşaqları»</li><li>Masası hələ təyin olunmayan qonaqlar axtarışda çıxmır</li></ul>
        </div>
      </div>
    </div>
  )
}
