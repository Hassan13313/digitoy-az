import { SEAT_TAKEN_HEX, SIDE_HEX, tableLabel } from './seatingModel'

/* ─────────────────────────────────────────────────────────────────────────────
   Masanın şəkli (SVG): süfrə, qızılı kənar, ətrafında stullar.
   Dolu stul qonağın tərəfinin rəngində, boş stul ağ; tutumdan artıq olan stul
   qırmızı («əlavə stul lazımdır»). `neutral` — dəvətnamədəki kiçik xəritə
   (rəng, say yoxdur); `me` — qonağın öz masası (tünd).
   Süfrə rəngi `#sp-linen` gradientidir (HallPlan / planlayıcı bir dəfə qoyur).
   ───────────────────────────────────────────────────────────────────────── */

const RUST = '#9A3B2E'

function chairProps(i, cap, seats, neutral) {
  if (neutral) return { fill: '#ECE5D9' }
  if (i >= cap) return { fill: RUST }
  if (i < seats.length) return { fill: SIDE_HEX[seats[i]] || SEAT_TAKEN_HEX }
  return { fill: '#FFFFFF', stroke: '#D3C7B5', strokeWidth: 1.2 }
}

export default function TableArt({ table, seats = [], neutral = false, me = false }) {
  const cap = table.cap || 10
  const n = Math.max(cap, neutral ? 0 : seats.length)
  const top = me ? '#2C2523' : 'url(#sp-linen)'
  const label = tableLabel(table)
  const count = `${seats.length}/${cap}`

  if (table.shape === 'long') {
    const m = Math.ceil(n / 2), b = n - m, cw = Math.min(9, 60 / Math.max(m, 1))
    const px = (k, cnt) => 10 + (k + 0.5) * 80 / cnt - cw / 2
    return (
      <svg className="sp-tsvg" viewBox="0 0 100 40" aria-hidden="true">
        {Array.from({ length: n }, (_, i) => (
          <rect key={i} x={i < m ? px(i, m) : px(i - m, b)} y={i < m ? 1 : 32} width={cw} height={7} rx={2.5} {...chairProps(i, cap, seats, neutral)} />
        ))}
        <rect x={6} y={10} width={88} height={20} rx={5} fill={top} stroke="#C5A059" strokeWidth={1.4} />
        <text x={50} y={neutral ? 20.5 : 18} className={`sp-tn sm${me ? ' me' : ''}`}>{label}</text>
        {!neutral && <text x={50} y={25.5} className="sp-tc sm">{count}</text>}
      </svg>
    )
  }

  const cw = Math.min(11, 190 / Math.max(n, 1))
  return (
    <svg className="sp-tsvg" viewBox="0 0 100 100" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={50 - cw / 2} y={2} width={cw} height={10} rx={3.5}
          transform={`rotate(${((i / n) * 360).toFixed(1)} 50 50)`} {...chairProps(i, cap, seats, neutral)} />
      ))}
      <circle cx={50} cy={50} r={34} fill={top} stroke="#C5A059" strokeWidth={1.8} />
      <circle cx={50} cy={50} r={29} fill="none" stroke={me ? '#84652A' : '#EADBB4'} strokeWidth={0.8} />
      <text x={50} y={neutral ? 51 : 47} className={`sp-tn${me ? ' me' : ''}`}>{label}</text>
      {!neutral && <text x={50} y={65} className={`sp-tc${seats.length > cap ? ' over' : ''}`}>{count}</text>}
    </svg>
  )
}

/** Süfrə gradienti — səhifədə bir dəfə */
export function LinenDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="sp-linen" cx="50%" cy="38%" r="65%">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F4ECDD" />
        </radialGradient>
      </defs>
    </svg>
  )
}
