import { C as PAL, STRIPES, SPARKS, halfWidth } from './palette'
import { usePalette } from '../_shared/palette'

/* PARIS NIGHT — Eyfel qülləsi, şlyapa qutusu, makaronlar, kafe tenti */

const TOWER = 'M50 0 L51 12 L54 14 L56 66 L64 68 L64 72 L60 72 L66 116 L76 118 L76 124 L72 124 L94 200 L74 200 Q50 148 26 200 L6 200 L28 124 L24 124 L24 118 L34 116 L40 72 L36 72 L36 68 L44 66 L46 14 L49 12 Z'

function zigzag(y0, y1, steps, side = 0) {
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const y = y0 + ((y1 - y0) * i) / steps
    const w = halfWidth(y) * 0.92
    if (side === 0) pts.push(`${50 + (i % 2 ? w : -w)},${y}`)
    else {
      const outer = 50 + side * w
      const inner = 50 + side * Math.max(3, w - 12 - ((y - 124) / 76) * 2)
      pts.push(`${i % 2 ? outer : inner},${y}`)
    }
  }
  return pts.join(' ')
}
const LATTICE = [zigzag(15, 65, 9), zigzag(73, 115, 6), zigzag(125, 196, 6, -1), zigzag(125, 196, 6, 1)]

/** Eyfel qülləsi — `sparkle` olanda qızılı işıqlar yanıb-sönür */
export function EiffelTower($p) {
  const C = usePalette(PAL)
  const { height = 300, sparkle = false, color = C.GOLD, glow = true, style } = $p
  return (
    <svg aria-hidden="true" viewBox="-2 -2 104 204" {...(typeof height === 'number' ? { width: height / 2, height } : {})} style={{ display: 'block', overflow: 'visible', ...(typeof height === 'number' ? {} : { height, width: 'auto', aspectRatio: '104 / 204' }), filter: glow ? `drop-shadow(0 0 ${typeof height === 'number' ? Math.max(2, height / 40) : 8}px rgba(225,188,120,.55))` : 'none', ...style }}>
      <path d={TOWER} fill="rgba(225,188,120,.12)" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      {LATTICE.map((p, i) => <polyline key={i} points={p} fill="none" stroke={color} strokeWidth=".8" opacity=".85" />)}
      <path d="M36 70 H64 M26 121 H74" stroke={color} strokeWidth="2.2" />
      {sparkle && SPARKS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="1.5" fill="#FFFFFF" style={{ animation: `pn-sparkle ${s.dur}s ease-in-out ${s.d}s infinite both` }} />
      ))}
    </svg>
  )
}

/** Makaron (3/4 görünüş) — üst qabıqda uşaqlar (rəqəm və s.) */
export function Macaron($p) {
  const C = usePalette(PAL)
  const { size = 80, color = C.ROSE, children, style } = $p
  return (
    <div style={{ position: 'relative', width: size, maxWidth: '100%', aspectRatio: '1 / .86', ...style }}>
      <span aria-hidden="true" style={{ position: 'absolute', left: '4%', right: '4%', bottom: 0, height: '36%', borderRadius: '24% 24% 50% 50% / 30% 30% 70% 70%', background: `linear-gradient(180deg, ${color}, color-mix(in srgb, ${color} 78%, #000))`, boxShadow: '0 10px 14px -10px rgba(0,0,0,.45)' }} />
      <span aria-hidden="true" style={{ position: 'absolute', left: '6%', right: '6%', bottom: '28%', height: '12%', borderRadius: 999, background: 'repeating-radial-gradient(circle at 50% 0, rgba(255,255,255,.55) 0 2px, transparent 2px 5px), color-mix(in srgb, ' + color + ' 88%, #fff)' }} />
      <span aria-hidden="true" style={{ position: 'absolute', left: '9%', right: '9%', bottom: '34%', height: '12%', borderRadius: 999, background: '#FFF8EC', boxShadow: 'inset 0 -2px 3px rgba(0,0,0,.08)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '60%', borderRadius: '50% 50% 40% 40% / 62% 62% 38% 38%', background: `radial-gradient(90% 70% at 35% 25%, color-mix(in srgb, ${color} 55%, #fff), ${color} 70%)`, boxShadow: 'inset 0 -5px 8px rgba(0,0,0,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  )
}

/** Şlyapa qutusu — `open` olanda qapaq uçur, makaronlar çıxır */
export function HatBox({ width = 230, open = false, children }) {
  const C = usePalette(PAL)
  const W = width
  const macs = [[-17, 0.2, C.LEMON], [17, 0.25, C.RASPBERRY], [-34, 0.05, C.ROSE], [0, 0, C.PISTACHIO], [34, 0.1, C.LAVENDER]]
  return (
    <div style={{ position: 'relative', width: W, height: W }}>
      {/* gövdə */}
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: W * 0.26, height: W * 0.6, borderRadius: `0 0 50% 50% / 0 0 ${W * 0.12}px ${W * 0.12}px`, background: `${STRIPES(C)}`, boxShadow: `inset ${-W * 0.12}px 0 ${W * 0.1}px rgba(0,0,0,.28), inset ${W * 0.08}px 0 ${W * 0.08}px rgba(255,255,255,.25), 0 ${W * 0.08}px ${W * 0.1}px -${W * 0.05}px rgba(0,0,0,.5)` }}>
        <span style={{ position: 'absolute', left: 0, right: 0, bottom: W * 0.06, height: W * 0.07, background: C.ROSE, borderRadius: `0 0 50% 50% / 0 0 ${W * 0.05}px ${W * 0.05}px`, opacity: 0.95 }} />
      </div>
      {/* ağız */}
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: W * 0.15, height: W * 0.22, borderRadius: '50%', background: `radial-gradient(60% 60% at 50% 60%, #FFE9EE, ${C.ROSE_D})`, border: `${W * 0.012}px solid #FFFFFF` }} />
      {/* makaronlar */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '6%', right: '6%', top: -W * 0.42, height: W * 0.68, overflow: 'hidden' }}>
        {macs.map(([x, d, c], i) => (
          <span key={i} style={{ position: 'absolute', left: `calc(50% + ${x}% - ${W * 0.13}px)`, bottom: i < 2 ? W * 0.2 : W * 0.02, transform: open ? 'translateY(0)' : `translateY(${W * 0.6}px)`, transition: `transform .55s cubic-bezier(.3,1.5,.5,1) ${0.25 + d}s` }}>
            <Macaron size={W * 0.26} color={c} />
          </span>
        ))}
      </div>
      {/* qapaq */}
      <div style={{ position: 'absolute', left: -W * 0.03, right: -W * 0.03, top: W * 0.06, height: W * 0.36, zIndex: 3, transformOrigin: '80% 50%', transform: open ? `translate(${W * 0.55}px, ${-W * 0.5}px) rotate(28deg)` : 'none', opacity: open ? 0 : 1, transition: 'transform .7s cubic-bezier(.3,.7,.3,1), opacity .5s ease .45s' }}>
        <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: W * 0.11, height: W * 0.2, borderRadius: `0 0 50% 50% / 0 0 ${W * 0.11}px ${W * 0.11}px`, background: `linear-gradient(90deg, ${C.ROSE_D}, ${C.ROSE} 35%, #F7B4C3 55%, ${C.ROSE_D})` }} />
        <span aria-hidden="true" style={{ position: 'absolute', left: '46%', width: '8%', top: W * 0.12, height: W * 0.21, background: C.INK }} />
        <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: W * 0.24, borderRadius: '50%', background: `radial-gradient(70% 70% at 40% 35%, #FBD3DC, ${C.ROSE})`, boxShadow: `inset 0 ${-W * 0.015}px ${W * 0.02}px rgba(0,0,0,.12)` }} />
        <Bow size={W * 0.3} style={{ position: 'absolute', left: '50%', top: W * 0.02, marginLeft: -W * 0.15 }} />
        {children && <div style={{ position: 'absolute', left: '50%', top: W * 0.2, transform: 'translateX(-50%)', zIndex: 2 }}>{children}</div>}
      </div>
    </div>
  )
}

/** Fiyonk */
export function Bow($p) {
  const C = usePalette(PAL)
  const { size = 60, color = C.INK, style } = $p
  return (
    <svg aria-hidden="true" viewBox="0 0 60 30" width={size} height={size / 2} style={{ display: 'block', overflow: 'visible', ...style }}>
      <path d="M30 15 C18 0 4 2 6 12 C8 22 20 22 30 15 Z" fill={color} />
      <path d="M30 15 C42 0 56 2 54 12 C52 22 40 22 30 15 Z" fill={color} />
      <path d="M28 16 L20 30 M32 16 L40 30" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="30" cy="15" rx="4.5" ry="4" fill={color} stroke="rgba(255,255,255,.35)" strokeWidth="1" />
    </svg>
  )
}

/** Kafe tenti — dişli zolaq */
export function Awning($p) {
  const C = usePalette(PAL)
  const { height = 34, tooth = 24, color = C.ROSE } = $p
  const mask = `radial-gradient(${tooth / 2}px at ${tooth / 2}px ${height - tooth / 2}px, #000 98%, transparent) 0 0 / ${tooth}px ${height}px repeat-x, linear-gradient(#000, #000) top / 100% ${height - tooth / 2}px no-repeat`
  return <div aria-hidden="true" style={{ height, background: `repeating-linear-gradient(90deg, ${color} 0 ${tooth}px, #FFFFFF ${tooth}px ${tooth * 2}px)`, WebkitMask: mask, mask }} />
}

/** Poçt möhürü */
export function Postmark($p) {
  const C = usePalette(PAL)
  const { size = 54, color = C.ROSE_D, style } = $p
  return (
    <svg aria-hidden="true" viewBox="0 0 80 50" width={size * 1.6} height={size} style={{ display: 'block', overflow: 'visible', ...style }}>
      <circle cx="25" cy="25" r="21" fill="none" stroke={color} strokeWidth="1.6" />
      <circle cx="25" cy="25" r="15" fill="none" stroke={color} strokeWidth=".8" />
      <text x="25" y="28.5" textAnchor="middle" fontSize="10" fontWeight="700" letterSpacing="1" fill={color} style={{ fontFamily: 'system-ui, sans-serif' }}>PARIS</text>
      {[16, 22, 28, 34].map((y) => <path key={y} d={`M48 ${y} q5 -3 10 0 t10 0 t10 0`} fill="none" stroke={color} strokeWidth="1.4" />)}
    </svg>
  )
}

/** Paris damları — silsilə */
export function Rooftops({ color = '#0B0E22', style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 60" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 60, ...style }}>
      <path fill={color} d="M0 60 V34 H18 V24 L30 16 L42 24 V34 H56 V20 H62 V12 H66 V20 H74 V30 L96 22 L118 30 V40 H132 V26 L146 18 L160 26 V36 H178 V22 H184 V14 H188 V22 H202 V32 L224 20 L246 32 V38 H262 V28 L272 20 L282 28 V34 H300 V18 H306 V10 H310 V18 H322 V30 L344 22 L366 30 V36 H384 V26 H392 V20 H396 V26 H400 V60 Z" />
      {[[24, 28], [80, 34], [140, 30], [194, 26], [232, 34], [270, 30], [312, 24], [352, 32]].map(([x, y], i) => <rect key={i} x={x} y={y} width="4" height="5" fill="#F4DE8E" opacity={i % 3 ? 0.85 : 0.4} />)}
    </svg>
  )
}
