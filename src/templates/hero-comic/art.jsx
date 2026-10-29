import { C as PAL, BURST } from './palette'
import { usePalette } from '../_shared/palette'

/* HERO COMIC — dekor */

/** Qəhrəman nişanı: dairə içində ildırım */
export function Emblem({ size = 64, style }) {
  const C = usePalette(PAL)
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" width={size} height={size} style={{ display: 'block', overflow: 'visible', ...style }}>
      <circle cx="32" cy="32" r="29" fill={C.RED} stroke={C.INK} strokeWidth="3.5" />
      <circle cx="32" cy="32" r="22" fill={C.YELLOW} stroke={C.INK} strokeWidth="2.5" />
      <path d="M36 10L20 36H31L27 54L45 26H34Z" fill={C.RED} stroke={C.INK} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  )
}

/** Partlayış: içində söz və ya rəqəm */
export function Burst($p) {
  const C = usePalette(PAL)
  const { size = 120, color = C.YELLOW, edge = C.RED, children, style, shape = BURST } = $p
  return (
    <div style={{ position: 'relative', width: size, height: size, ...style }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: C.INK, clipPath: shape, transform: 'translate(5px, 5px)' }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: edge, clipPath: shape }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: '7%', background: color, clipPath: shape }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{children}</div>
    </div>
  )
}

/** Danışıq balonu (quyruqlu) */
export function Bubble($p) {
  const C = usePalette(PAL)
  const { children, tail = 'left', bg = C.WHITE, style } = $p
  return (
    <div style={{ position: 'relative', background: bg, border: `3px solid ${C.INK}`, borderRadius: 26, padding: '14px 18px', boxShadow: `4px 4px 0 ${C.INK}`, ...style }}>
      {children}
      <svg aria-hidden="true" viewBox="0 0 30 24" width="30" height="24" style={{ position: 'absolute', bottom: -20, [tail]: 26, transform: tail === 'right' ? 'scaleX(-1)' : undefined }}>
        <path d="M2 0L6 22L26 0" fill={bg} stroke={C.INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M3 -1H25" stroke={bg} strokeWidth="4" />
      </svg>
    </div>
  )
}

/** Sarı başlıq qutusu (caption) */
export function Caption($p) {
  const C = usePalette(PAL)
  const { children, head, rotate = -2, bg = C.YELLOW, style } = $p
  return (
    <div style={{ display: 'inline-block', padding: '7px 14px 6px', background: bg, border: `3px solid ${C.INK}`, boxShadow: `4px 4px 0 ${C.INK}`, transform: `rotate(${rotate}deg)`, fontFamily: head, fontWeight: 800, fontSize: 14, letterSpacing: '.06em', textTransform: 'uppercase', color: C.INK, ...style }}>
      {children}
    </div>
  )
}
