import { C as PAL, RIBBON, CONFETTI } from './palette'
import { usePalette } from '../_shared/palette'

/* RIBBON CUT — qızılı qayçı, qırmızı lent, zümrüd qapılar */

/** Qızılı qayçı — `closed` olanda tiyələr bağlanır */
export function Scissors({ size = 110, closed = false, style }) {
  const C = usePalette(PAL)
  const blade = (rot) => ({ transformOrigin: '50px 50px', transform: `rotate(${rot}deg)`, transition: closed ? 'transform .14s ease-in .24s' : 'transform .2s ease-out' })
  return (
    <svg aria-hidden="true" viewBox="0 0 100 130" width={size} height={size * 1.3} style={{ display: 'block', overflow: 'visible', ...style }}>
      <defs>
        <linearGradient id="rc-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#A8822E" /><stop offset=".4" stopColor="#F5DE9C" /><stop offset=".7" stopColor={C.GOLD} /><stop offset="1" stopColor="#8A6A22" />
        </linearGradient>
        <linearGradient id="rc-steel" x1="0" x2="1">
          <stop offset="0" stopColor="#B9C0C8" /><stop offset=".5" stopColor="#F4F6F8" /><stop offset="1" stopColor="#9AA2AB" />
        </linearGradient>
      </defs>
      <g style={blade(closed ? 0 : -14)}>
        <path d="M50 50L44 4C44 1 48 0 49 3L54 50Z" fill="url(#rc-steel)" />
        <path d="M50 50L40 92" stroke="url(#rc-gold)" strokeWidth="7" strokeLinecap="round" />
        <circle cx="34" cy="108" r="15" fill="none" stroke="url(#rc-gold)" strokeWidth="7" />
      </g>
      <g style={blade(closed ? 0 : 14)}>
        <path d="M50 50L56 4C56 1 52 0 51 3L46 50Z" fill="url(#rc-steel)" />
        <path d="M50 50L60 92" stroke="url(#rc-gold)" strokeWidth="7" strokeLinecap="round" />
        <circle cx="66" cy="108" r="15" fill="none" stroke="url(#rc-gold)" strokeWidth="7" />
      </g>
      <circle cx="50" cy="50" r="4.5" fill="#8A6A22" />
    </svg>
  )
}

/** Atlaz fiyonk */
export function Bow({ size = 90, style }) {
  const C = usePalette(PAL)
  return (
    <svg aria-hidden="true" viewBox="0 0 120 90" width={size} height={size * 0.75} style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.35))', ...style }}>
      <defs>
        <linearGradient id="rc-bow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9465A" /><stop offset=".55" stopColor={C.RED} /><stop offset="1" stopColor="#8E1424" />
        </linearGradient>
      </defs>
      <path d="M60 38C40 6 6 6 8 30C10 50 34 54 60 44Z" fill="url(#rc-bow)" />
      <path d="M60 38C80 6 114 6 112 30C110 50 86 54 60 44Z" fill="url(#rc-bow)" />
      <path d="M54 46L36 88L48 80L54 90L60 50ZM66 46L84 88L72 80L66 90L60 50Z" fill="#9A1527" />
      <path d="M22 22C30 18 42 22 52 34M98 22C90 18 78 22 68 34" fill="none" stroke="#FF8A98" strokeWidth="2" strokeLinecap="round" opacity=".6" />
      <ellipse cx="60" cy="41" rx="11" ry="10" fill="url(#rc-bow)" stroke="#8E1424" strokeWidth="1" />
    </svg>
  )
}

/** Lent zolağı (tək parça) */
export function RibbonBand({ height = 30, style }) {
  const C = usePalette(PAL)
  return (
    <span aria-hidden="true" style={{ display: 'block', height, background: RIBBON(C), boxShadow: '0 6px 10px -4px rgba(0,0,0,.4), inset 0 2px 0 rgba(255,255,255,.18)', ...style }} />
  )
}

/** Zümrüd qapı tayı (qızılı çərçivəli) */
export function DoorLeaf({ side = 'left', open = false, style }) {
  const C = usePalette(PAL)
  const left = side === 'left'
  return (
    <div style={{
      position: 'absolute', top: 0, bottom: 0, [left ? 'left' : 'right']: 0, width: '50%',
      transformOrigin: left ? '0 50%' : '100% 50%', transform: open ? `perspective(900px) rotateY(${left ? 78 : -78}deg)` : 'none',
      transition: 'transform 1s cubic-bezier(.5,0,.3,1) .55s',
      background: `linear-gradient(${left ? 90 : 270}deg, #0B3127, #175443 70%, #12483A)`,
      boxShadow: `inset 0 0 0 2px ${C.GOLD_D}`, ...style,
    }}>
      <span aria-hidden="true" style={{ position: 'absolute', inset: '7% 14% 52%', border: `2px solid ${C.GOLD}`, borderRadius: '50% 50% 4px 4px / 22% 22% 4px 4px', opacity: 0.85 }} />
      <span aria-hidden="true" style={{ position: 'absolute', inset: '54% 14% 7%', border: `2px solid ${C.GOLD}`, borderRadius: 4, opacity: 0.85 }} />
      <span aria-hidden="true" style={{ position: 'absolute', top: '50%', [left ? 'right' : 'left']: '8%', width: 12, height: 12, marginTop: -6, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #FFF0C0, #A8822E)', boxShadow: '0 2px 4px rgba(0,0,0,.4)' }} />
    </div>
  )
}

/** Qızılı konfetti yağışı */
export function GoldRain({ on = false }) {
  const C = usePalette(PAL)
  if (!on) return null
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 5 }}>
      {CONFETTI(C).map((p, i) => (
        <span key={i} style={{
          position: 'absolute', left: `${p.x}%`, top: '-4%', width: p.s, height: p.s * 0.45, background: p.c, borderRadius: 1,
          '--dx': `${p.dx}px`, '--r': `${p.r}deg`, animation: `rc-fall ${p.dur}s cubic-bezier(.3,.6,.5,1) ${p.d}s both`,
        }} />
      ))}
    </div>
  )
}
