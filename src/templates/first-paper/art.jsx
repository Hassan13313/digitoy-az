import { C as PAL, WASHI } from './palette'
import { usePalette } from '../_shared/palette'

/* FIRST PAPER — origami dekor */

/* Künc qatları: menteşə oxu, mərkəzi; simmetriya oxu (arxa üz üçün) */
const FLAPS = [
  { clip: 'polygon(0 0, 50% 0, 0 50%)', hinge: '1,-1,0', origin: '25% 25%', mirror: '1,1,0', mo: '0 0' },
  { clip: 'polygon(50% 0, 100% 0, 100% 50%)', hinge: '1,1,0', origin: '75% 25%', mirror: '1,-1,0', mo: '100% 0' },
  { clip: 'polygon(100% 50%, 100% 100%, 50% 100%)', hinge: '1,-1,0', origin: '75% 75%', mirror: '1,1,0', mo: '100% 100%' },
  { clip: 'polygon(0 50%, 50% 100%, 0 100%)', hinge: '1,1,0', origin: '25% 75%', mirror: '1,-1,0', mo: '0 100%' },
]

/** Qatlanmış vərəq — `open` olanda dörd künc açılır */
export function FoldedSheet({ width = 300, open = false, children, instant = false, style }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', width, aspectRatio: '1', perspective: 1100, ...style }}>
      {/* mərkəzi romb (həmişə yerində) */}
      <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)', background: C.WHITE }} />
      {FLAPS.map((f, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transformOrigin: f.origin,
          transform: open ? `rotate3d(${f.hinge}, 0deg)` : `rotate3d(${f.hinge}, 180deg) translateZ(-1px)`,
          transition: instant ? 'none' : `transform .75s cubic-bezier(.45,0,.2,1) ${0.05 + i * 0.16}s`,
        }}>
          <div style={{ position: 'absolute', inset: 0, clipPath: f.clip, background: C.WHITE, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }} />
          <div style={{ position: 'absolute', inset: 0, clipPath: f.clip, background: WASHI(C), backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transformOrigin: f.mo, transform: `rotate3d(${f.mirror}, 180deg)` }} />
        </div>
      ))}
      {/* qat izləri */}
      <Creases style={{ opacity: open ? 1 : 0, transition: instant ? 'none' : 'opacity .4s ease .9s' }} />
      <div style={{ position: 'absolute', inset: '22%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: open ? 1 : 0, transition: instant ? 'none' : 'opacity .5s ease .85s' }}>
        {children}
      </div>
    </div>
  )
}

/** Açılmış vərəqdə qat izləri (romb + diaqonallar) */
export function Creases({ style }) {
  const C = usePalette(PAL)
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }}>
      <path d="M50 0L100 50L50 100L0 50Z" fill="none" stroke={C.CREASE} strokeWidth=".5" vectorEffect="non-scaling-stroke" />
      <path d="M0 0L100 100M100 0L0 100" fill="none" stroke={C.CREASE} strokeWidth=".5" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" opacity=".6" />
    </svg>
  )
}

/** Origami ürək (üzlü) */
export function PaperHeart({ size = 28, tone = 'blue', style }) {
  const C = usePalette(PAL)
  const sh = tone === 'blue'
    ? ['#5B86E5', C.BLUE, '#2B52B0', C.BLUE_D]
    : tone === 'sky'
      ? ['#D3E0FA', C.SKY, '#93ADE3', '#7F9BD6']
      : ['#FFFFFF', '#F1EEE7', '#E4DFD4', '#D6D0C3']
  return (
    <svg aria-hidden="true" viewBox="0 0 100 92" width={size} height={size * 0.92} style={{ display: 'block', overflow: 'visible', ...style }}>
      <path d="M0 30L25 4L50 30Z" fill={sh[0]} />
      <path d="M50 30L75 4L100 30Z" fill={sh[1]} />
      <path d="M0 30L50 30L50 90Z" fill={sh[2]} />
      <path d="M50 30L100 30L50 90Z" fill={sh[3]} />
    </svg>
  )
}

/** Masa kartı (çadır qatı) */
export function TentCard({ width = 220, children }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', width, margin: '0 auto', perspective: 700 }}>
      <div aria-hidden="true" style={{ height: 26, background: `linear-gradient(180deg, ${C.SHADE}, #F3F0E9)`, transform: 'rotateX(52deg)', transformOrigin: '50% 100%', borderRadius: '6px 6px 0 0', boxShadow: 'inset 0 -1px 0 rgba(0,0,0,.08)' }} />
      <div style={{ position: 'relative', padding: '20px 16px 22px', background: C.WHITE, borderRadius: '0 0 6px 6px', boxShadow: '0 22px 22px -18px rgba(35,43,74,.5)', textAlign: 'center' }}>
        <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 1, background: C.CREASE }} />
        {children}
      </div>
    </div>
  )
}

/** Kağız lent (foto üçün) */
export function Tape({ rot = -4, style }) {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: -10, width: 64, height: 20, marginLeft: -32, transform: `rotate(${rot}deg)`, background: 'rgba(169,192,238,.7)', boxShadow: '0 1px 2px rgba(0,0,0,.08)', maskImage: 'linear-gradient(90deg, transparent 0 2px, #000 2px calc(100% - 2px), transparent calc(100% - 2px))', ...style }} />
  )
}
