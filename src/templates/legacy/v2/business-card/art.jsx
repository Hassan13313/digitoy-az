import { C as PAL } from './palette'
import { usePalette } from '../../../_shared/palette'

/* BUSINESS CARD — dekor */

/** Vizit kartı — iki üzlü, `flipped` arxa üzü göstərir */
export function Card({ front, back, flipped = false, width = 320, style }) {
  const C = usePalette(PAL)
  const face = { position: 'absolute', inset: 0, borderRadius: 6, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', overflow: 'hidden' }
  return (
    <div style={{ position: 'relative', width, aspectRatio: '85 / 55', perspective: 1200, ...style }}>
      <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'none', transition: 'transform 1s cubic-bezier(.6,0,.25,1) .1s' }}>
        <div style={{ ...face, background: C.WHITE, boxShadow: '0 1px 0 rgba(0,0,0,.04), 0 24px 40px -22px rgba(0,0,0,.35)' }}>{front}</div>
        <div style={{ ...face, transform: 'rotateY(180deg)', background: C.KLEIN, color: C.WHITE, boxShadow: '0 24px 40px -22px rgba(36,56,232,.55)' }}>{back}</div>
      </div>
    </div>
  )
}

/** Künc işarələri (kəsmə nişanları) */
export function CropMarks($p) {
  const C = usePalette(PAL)
  const { color = C.KLEIN, size = 14, inset = -8 } = $p
  const m = (pos, rot) => (
    <span key={rot} aria-hidden="true" style={{ position: 'absolute', ...pos, width: size, height: size, borderTop: `1.5px solid ${color}`, borderLeft: `1.5px solid ${color}`, transform: `rotate(${rot}deg)` }} />
  )
  return (
    <>
      {m({ left: inset, top: inset }, 0)}
      {m({ right: inset, top: inset }, 90)}
      {m({ right: inset, bottom: inset }, 180)}
      {m({ left: inset, bottom: inset }, 270)}
    </>
  )
}
