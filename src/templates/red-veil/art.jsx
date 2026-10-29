import { C as PAL } from './palette'
import { usePalette } from '../_shared/palette'

/* RED VEIL — dekor (hamısı aria-hidden) */

const BUTA = 'M20 57C9 57 3 48 3 38C3 24 15 15 22 8C25 5 29 3 32 5C35 8 31 11 29 13C35 19 37 28 37 37C37 49 30 57 20 57Z'
const BUTA_IN = 'M20 50C13 50 9 44 9 38C9 29 16 23 21 18C27 23 31 30 31 37C31 45 26 50 20 50Z'

/** Buta — Azərbaycan ornamentinin «badam» motivi */
export function Buta($p) {
  const C = usePalette(PAL)
  const { size = 26, color = C.GOLD, fill = 'none', flip = false, style } = $p
  return (
    <svg aria-hidden="true" viewBox="0 0 40 60" width={size} height={size * 1.5} style={{ display: 'block', transform: flip ? 'scaleX(-1)' : undefined, overflow: 'visible', ...style }}>
      <path d={BUTA} fill={fill} stroke={color} strokeWidth="1.6" />
      <path d={BUTA_IN} fill="none" stroke={color} strokeWidth="1" strokeDasharray="2 2.2" />
      <circle cx="20" cy="38" r="3.6" fill={color} />
      <circle cx="20" cy="38" r="7.4" fill="none" stroke={color} strokeWidth=".8" />
      <path d="M31 6c3-3 7-3 8 0" fill="none" stroke={color} strokeWidth="1" />
    </svg>
  )
}

/** Buta xətti — bölmə başlığının ornamenti */
export function ButaRule($p) {
  const C = usePalette(PAL)
  const { color = C.GOLD, width = 220, style } = $p
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width, maxWidth: '100%', margin: '0 auto', ...style }}>
      <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${color})` }} />
      <span style={{ width: 5, height: 5, transform: 'rotate(45deg)', background: color }} />
      <Buta size={16} color={color} flip />
      <Buta size={16} color={color} />
      <span style={{ width: 5, height: 5, transform: 'rotate(45deg)', background: color }} />
      <span style={{ flex: 1, height: 1, background: `linear-gradient(270deg, transparent, ${color})` }} />
    </div>
  )
}

/** Qızılı qotaz (püskül) */
export function Tassel($p) {
  const C = usePalette(PAL)
  const { h = 36, color = C.GOLD, style } = $p
  return (
    <svg aria-hidden="true" viewBox="0 0 16 44" width={(h * 16) / 44} height={h} style={{ display: 'block', ...style }}>
      <path d="M8 0V10" stroke={color} strokeWidth="1.2" />
      <circle cx="8" cy="12.5" r="3.4" fill={color} />
      <path d="M4.2 16h7.6l1.2 4H3z" fill={color} />
      {[3.6, 5.4, 7.2, 8.8, 10.6, 12.4].map((x, i) => (
        <path key={x} d={`M${x} 20L${x + (i - 2.5) * 0.5} ${40 + (i % 2) * 3}`} stroke={color} strokeWidth="1" strokeLinecap="round" />
      ))}
      <path d="M3.4 24h9.2" stroke={C.WINE} strokeOpacity=".35" strokeWidth=".8" />
    </svg>
  )
}

/** Örpəyin ətəyi: qızılı tikmə zolağı (naxışlı) */
export function EmbroideryBand($p) {
  const C = usePalette(PAL)
  const { id, color = C.GOLD, height = 22, style } = $p
  return (
    <svg aria-hidden="true" width="100%" height={height} style={{ display: 'block', ...style }}>
      <defs>
        <pattern id={id} width="36" height={height} patternUnits="userSpaceOnUse">
          <path d={`M0 ${height / 2}L9 3L18 ${height / 2}L27 ${height - 3}L36 ${height / 2}`} fill="none" stroke={color} strokeWidth="1.1" />
          <path d={`M18 ${height / 2 - 4}l4 4-4 4-4-4z`} fill={color} />
          <circle cx="0" cy={height / 2} r="1.8" fill={color} />
          <circle cx="9" cy="5.5" r=".9" fill={color} />
          <circle cx="27" cy={height - 5.5} r=".9" fill={color} />
        </pattern>
      </defs>
      <rect x="0" y="0.6" width="100%" height=".9" fill={color} />
      <rect x="0" y={height - 1.5} width="100%" height=".9" fill={color} />
      <rect x="0" y="0" width="100%" height={height} fill={`url(#${id})`} />
    </svg>
  )
}

/** Hero-nun yuxarısında asılan qırmızı örpək qıvrımı */
export function VeilDrape({ height = 120 }) {
  const C = usePalette(PAL)
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height }}>
      <svg viewBox="0 0 400 120" preserveAspectRatio="none" width="100%" height="100%" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="rv-drape" x1="0" x2="1">
            {[0, 0.12, 0.25, 0.38, 0.5, 0.62, 0.75, 0.88, 1].map((o, i) => <stop key={o} offset={o} stopColor={i % 2 ? '#9E2235' : '#6E1222'} />)}
          </linearGradient>
        </defs>
        <path d="M0 0H400V46C362 96 282 104 200 70C118 104 38 96 0 46Z" fill="url(#rv-drape)" />
        <path d="M0 46C38 96 118 104 200 70C282 104 362 96 400 46" fill="none" stroke={C.GOLD} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <path d="M0 40C38 88 118 96 200 62C282 96 362 88 400 40" fill="none" stroke={C.GOLD} strokeWidth="1" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" opacity=".8" />
      </svg>
      {[['3%', 54], ['50%', 70], ['97%', 54]].map(([x, y]) => (
        <span key={x} style={{ position: 'absolute', left: x, top: `${(y / 120) * 100}%`, transform: 'translateX(-50%)', transformOrigin: 'top center', animation: 'rv-swing 4.5s ease-in-out infinite' }}>
          <Tassel h={40} />
        </span>
      ))}
    </div>
  )
}

/** Şam — açılışda və proqramda */
export function Candle({ h = 46, lit = true, style }) {
  return (
    <span aria-hidden="true" style={{ position: 'relative', display: 'inline-block', width: 14, height: h + 22, ...style }}>
      {lit && (
        <span style={{ position: 'absolute', left: '50%', top: 0, width: 10, height: 18, marginLeft: -5, borderRadius: '50% 50% 45% 45% / 62% 62% 38% 38%', background: 'radial-gradient(circle at 50% 70%, #FFFFFF 0 18%, #FFE29A 34%, #FFA53A 70%, rgba(255,120,30,0) 100%)', transformOrigin: '50% 90%', animation: 'rv-flame 1.4s ease-in-out infinite alternate', boxShadow: '0 0 24px 8px rgba(255,190,90,.35)' }} />
      )}
      <span style={{ position: 'absolute', left: '50%', top: 16, width: 1.5, height: 6, marginLeft: -0.75, background: '#3A2A20' }} />
      <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: h, borderRadius: '3px 3px 2px 2px', background: 'linear-gradient(90deg, #E9D8BE, #FFF7EA 45%, #E2CDAE)' }} />
    </span>
  )
}
