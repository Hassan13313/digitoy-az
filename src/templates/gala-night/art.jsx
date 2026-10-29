import { C as PAL, TOWER } from './palette'
import { usePalette } from '../_shared/palette'

/* GALA NIGHT — art-deco dekor */

/** Şampan qülləsi — `pour` olanda qədəhlər yuxarıdan aşağı dolur */
export function ChampagneTower({ width = 260, pour = true, instant = false, style }) {
  const C = usePalette(PAL)
  return (
    <svg aria-hidden="true" viewBox="0 0 220 176" width={width} style={{ display: 'block', maxWidth: '100%', overflow: 'visible', ...style }}>
      <defs>
        <clipPath id="gn-bowl"><path d="M-22 0Q-20 13 0 14Q20 13 22 0Z" /></clipPath>
        <linearGradient id="gn-wine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF0C4" /><stop offset="1" stopColor="#D9A94A" />
        </linearGradient>
      </defs>
      {/* şüşə — tökülən axın */}
      <g style={{ opacity: pour ? 1 : 0, transition: instant ? 'none' : 'opacity .3s ease .1s' }}>
        <path d="M110 -6V26" stroke="url(#gn-wine)" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="4 3" style={{ animation: pour && !instant ? 'gn-stream .4s linear infinite' : 'none' }} />
      </g>
      {TOWER.map((g, i) => (
        <g key={i} transform={`translate(${g.x} ${g.y})`}>
          <g clipPath="url(#gn-bowl)">
            <rect x="-24" y="-2" width="48" height="18" fill="url(#gn-wine)" style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', transform: pour ? 'scaleY(1)' : 'scaleY(0)', transition: instant ? 'none' : `transform .45s ease ${g.d}s` }} />
          </g>
          <path d="M-22 0Q-20 13 0 14Q20 13 22 0" fill="none" stroke={C.GOLD_L} strokeWidth="1.3" />
          <path d="M-22 0H22" stroke={C.GOLD_L} strokeOpacity=".7" strokeWidth=".8" />
          <path d="M0 14V28" stroke={C.GOLD_L} strokeWidth="1.2" />
          <path d="M-9 30Q0 26 9 30" fill="none" stroke={C.GOLD_L} strokeWidth="1.3" />
          {/* köpüklər */}
          {pour && !instant && [-8, 2, 9].map((bx, k) => (
            <circle key={k} cx={bx} cy="6" r="1.1" fill="#FFF6DA" style={{ animation: `gn-bubble 1.4s ease-in ${(g.d + 0.3 + k * 0.2).toFixed(2)}s infinite` }} />
          ))}
        </g>
      ))}
    </svg>
  )
}

/** Art-deco günəş şüaları */
export function Sunburst({ size = 360, opacity = 0.35, style }) {
  const C = usePalette(PAL)
  return (
    <svg aria-hidden="true" viewBox="-100 -100 200 100" width={size} style={{ display: 'block', overflow: 'visible', opacity, ...style }}>
      {Array.from({ length: 19 }, (_, i) => {
        const a = Math.PI + (i / 18) * Math.PI
        return <path key={i} d={`M0 0L${Math.cos(a) * 100} ${Math.sin(a) * 100}`} stroke={C.GOLD} strokeWidth={i % 2 ? 0.5 : 1} />
      })}
      {[30, 44, 58].map((r) => <path key={r} d={`M${-r} 0A${r} ${r} 0 0 1 ${r} 0`} fill="none" stroke={C.GOLD} strokeWidth=".7" />)}
    </svg>
  )
}

/** Yelpik ornamenti — başlıq */
export function Fan($p) {
  const C = usePalette(PAL)
  const { width = 220, color = C.GOLD, style } = $p
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 10, width, maxWidth: '100%', margin: '0 auto', ...style }}>
      <span style={{ flex: 1, height: 5, borderTop: `1px solid ${color}`, borderBottom: `1px solid ${color}` }} />
      <svg viewBox="-20 -18 40 20" width="44" height="22" style={{ display: 'block' }}>
        {Array.from({ length: 7 }, (_, i) => {
          const a = Math.PI + (i / 6) * Math.PI
          return <path key={i} d={`M0 0L${Math.cos(a) * 17} ${Math.sin(a) * 17}`} stroke={color} strokeWidth="1" />
        })}
        <path d="M-17 0A17 17 0 0 1 17 0" fill="none" stroke={color} strokeWidth="1.2" />
        <path d="M-6 0A6 6 0 0 1 6 0Z" fill={color} />
      </svg>
      <span style={{ flex: 1, height: 5, borderTop: `1px solid ${color}`, borderBottom: `1px solid ${color}` }} />
    </div>
  )
}

/** Künc yelpikləri — deco çərçivəsi üçün */
export function CornerFans($p) {
  const C = usePalette(PAL)
  const { color = C.GOLD, size = 34 } = $p
  const fan = (rot, pos) => (
    <svg key={rot} aria-hidden="true" viewBox="0 0 40 40" width={size} height={size} style={{ position: 'absolute', ...pos, transform: `rotate(${rot}deg)` }}>
      {[10, 18, 26].map((r) => <path key={r} d={`M0 ${r}A${r} ${r} 0 0 0 ${r} 0`} fill="none" stroke={color} strokeWidth="1" />)}
      {[0, 30, 60, 90].map((a) => <path key={a} d={`M0 0L${Math.cos((a * Math.PI) / 180) * 30} ${Math.sin((a * Math.PI) / 180) * 30}`} stroke={color} strokeWidth=".6" />)}
    </svg>
  )
  return (
    <>
      {fan(0, { left: 8, top: 8 })}
      {fan(90, { right: 8, top: 8 })}
      {fan(180, { right: 8, bottom: 8 })}
      {fan(270, { left: 8, bottom: 8 })}
    </>
  )
}
