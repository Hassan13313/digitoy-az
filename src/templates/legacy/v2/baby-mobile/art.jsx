import { C as PAL, HANG, SPARKS } from './palette'
import { usePalette } from '../../../_shared/palette'

/* BABY MOBILE — keçə dekor */

const PATHS = {
  star: 'M50 6L62 36L94 38L69 58L78 90L50 72L22 90L31 58L6 38L38 36Z',
  moon: 'M64 8C40 12 24 32 24 54C24 76 42 94 66 94C78 94 88 89 94 82C86 86 78 88 70 88C46 88 30 70 30 48C30 30 44 14 64 8Z',
  cloud: 'M24 74C12 74 6 64 8 56C10 46 20 42 28 44C30 30 42 22 54 24C64 26 72 34 74 44C84 42 94 50 94 60C94 70 86 76 76 76Z',
  heart: 'M50 88C50 88 10 64 10 38C10 22 22 12 34 12C42 12 48 17 50 24C52 17 58 12 66 12C78 12 90 22 90 38C90 64 50 88 50 88Z',
}

/** Keçə fiqur — tikiş xətti ilə */
export function Felt($p) {
  const C = usePalette(PAL)
  const { shape = 'star', size = 60, color = C.MUSTARD, children, style } = $p
  const d = PATHS[shape] || PATHS.star
  return (
    <div style={{ position: 'relative', width: size, height: size, ...style }}>
      <svg aria-hidden="true" viewBox="0 0 100 100" width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible', filter: 'drop-shadow(0 4px 4px rgba(20,26,50,.3))' }}>
        <defs>
          <pattern id={`bm-f-${shape}-${color.slice(1)}`} width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill={color} />
            <circle cx="1" cy="1" r=".7" fill="#FFFFFF" opacity=".2" />
            <circle cx="3" cy="3" r=".7" fill="#000000" opacity=".06" />
          </pattern>
        </defs>
        <path d={d} fill={`url(#bm-f-${shape}-${color.slice(1)})`} />
        <path d={d} fill="none" stroke="#FFFFFF" strokeOpacity=".85" strokeWidth="1.6" strokeDasharray="4 3.4" transform="translate(50 50) scale(.86) translate(-50 -50)" />
      </svg>
      {children && <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{children}</div>}
    </div>
  )
}

/** Beşik mobili — taxta halqa, saplar, keçə fiqurlar */
export function Mobile({ width = 300, spin = false, style }) {
  const C = usePalette(PAL)
  return (
    <div aria-hidden="true" style={{ position: 'relative', width, height: 250, margin: '0 auto', transformOrigin: '50% 0', animation: spin ? 'bm-swing 1.6s ease-in-out' : 'bm-sway 6s ease-in-out infinite', ...style }}>
      {/* qarmaq və mərkəz sapı */}
      <span style={{ position: 'absolute', left: '50%', top: 0, width: 2, height: 34, marginLeft: -1, background: 'rgba(255,244,222,.55)' }} />
      <span style={{ position: 'absolute', left: '50%', top: -6, width: 14, height: 14, marginLeft: -7, borderRadius: '50%', border: `3px solid ${C.MUSTARD}` }} />
      {/* taxta halqa */}
      <span style={{ position: 'absolute', left: '4%', right: '4%', top: 30, height: 22, borderRadius: '50%', border: '5px solid #C9955A', boxShadow: 'inset 0 2px 0 rgba(255,255,255,.25), 0 3px 6px rgba(0,0,0,.25)' }} />
      {[18, 50, 82].map((x) => <span key={x} style={{ position: 'absolute', left: `${x}%`, top: 6, width: 1.4, height: 30, background: 'rgba(255,244,222,.45)', transform: `rotate(${(50 - x) * 0.5}deg)`, transformOrigin: '50% 100%' }} />)}
      {HANG(C).map((h, i) => (
        <span key={i} style={{ position: 'absolute', left: `${h.x}%`, top: 44, transform: 'translateX(-50%)' }}>
          <span style={{ display: 'block', width: 1.2, height: h.len, margin: '0 auto', background: 'rgba(255,244,222,.5)' }} />
          <span style={{ display: 'block', marginTop: -2, transformOrigin: '50% 0', animation: spin ? `bm-turn .9s ease-in-out ${(i * 0.08).toFixed(2)}s 2` : `bm-dangle ${3 + i * 0.4}s ease-in-out ${(i * 0.3).toFixed(2)}s infinite` }}>
            <Felt shape={h.shape} size={h.shape === 'cloud' ? 62 : 46} color={h.color} />
          </span>
        </span>
      ))}
    </div>
  )
}

/** Ulduz tozu (fon) */
export function Sparks({ opacity = 1 }) {
  const C = usePalette(PAL)
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity }}>
      {SPARKS.map((s, i) => (
        <span key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, borderRadius: '50%', background: C.CREAM, animation: `bm-twinkle 3.4s ease-in-out ${s.d}s infinite` }} />
      ))}
    </div>
  )
}

/** Musiqi notu */
export function Note($p) {
  const C = usePalette(PAL)
  const { size = 22, color = C.CREAM, style } = $p
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block', ...style }}>
      <path d="M9 18a3 3 0 1 1-2-2.8V5l11-2v11.2A3 3 0 1 1 16 11.4V6.4L9 7.6z" fill={color} />
    </svg>
  )
}
