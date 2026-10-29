import { C as PAL } from './palette'
import { usePalette } from '../_shared/palette'

/* KƏLAĞAYI — dekor (hamısı aria-hidden) */

const BUTA = 'M0 12C-6 12-9 7-9 2C-9-5-3-9 1-13C2-14 4-15 5-14C6-12 4-11 3-10C6-7 8-3 8 2C8 8 5 12 0 12Z'

/** Kiçik buta (svg) */
export function Buta($p) {
  const C = usePalette(PAL)
  const { size = 16, color = C.CRIMSON, style } = $p
  return (
    <svg aria-hidden="true" viewBox="-10 -16 20 30" width={size} height={size * 1.5} style={{ display: 'block', ...style }}>
      <path d={BUTA} fill={color} />
      <path d="M0 7C-3 7-4.5 4.5-4.5 2C-4.5-1-2-3 0-5" fill="none" stroke={C.SILK} strokeWidth="1" />
      <circle cx="0" cy="3" r="1.6" fill={C.SILK} />
    </svg>
  )
}

/** Üç buta — bölmə başlığı */
export function ButaTrio({ style }) {
  const C = usePalette(PAL)
  return (
    <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 10, ...style }}>
      <span style={{ width: 46, height: 3, background: `linear-gradient(90deg, transparent, ${C.CRIMSON})`, alignSelf: 'center' }} />
      <Buta size={13} color={C.INDIGO} style={{ transform: 'rotate(-20deg)' }} />
      <Buta size={17} color={C.CRIMSON} />
      <Buta size={13} color={C.SAFFRON_D} style={{ transform: 'rotate(20deg) scaleX(-1)' }} />
      <span style={{ width: 46, height: 3, background: `linear-gradient(270deg, transparent, ${C.CRIMSON})`, alignSelf: 'center' }} />
    </div>
  )
}

/**
 * Kəlağayı — kvadrat ipək yaylıq, romb kimi (45°) çəkilir. viewBox 0 0 200 200.
 * Haşiyə zolaqları, haşiyə boyunca butalar, sahədə səpələnmiş butalar,
 * ortada səkkizguşəli ulduzlu medalyon.
 */
export function KelagayiSquare({ uid = 'kg', dim = false }) {
  const C = usePalette(PAL)
  const S = 141.42 /* romb diaqonalı = 200 */
  const h = S / 2
  const borderButas = []
  for (let i = 0; i < 9; i++) {
    const t = -h + 14 + i * ((S - 28) / 8)
    borderButas.push([t, -h + 10], [t, h - 10], [-h + 10, t], [h - 10, t])
  }
  const field = []
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      if (Math.abs(r) + Math.abs(c) <= 1) continue
      field.push([c * 18 + (r % 2 ? 9 : 0), r * 18])
    }
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" width="100%" height="100%" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={`${uid}-silk`} cx="45%" cy="35%" r="75%">
          <stop offset="0" stopColor="#FFF9EC" /><stop offset=".6" stopColor={C.SILK} /><stop offset="1" stopColor={C.SILK_D} />
        </radialGradient>
      </defs>
      <g transform="rotate(45 100 100) translate(100 100)" opacity={dim ? 0.55 : 1}>
        <rect x={-h} y={-h} width={S} height={S} fill={`url(#${uid}-silk)`} />
        {/* haşiyə */}
        <rect x={-h + 1.5} y={-h + 1.5} width={S - 3} height={S - 3} fill="none" stroke={C.CRIMSON} strokeWidth="3" />
        <rect x={-h + 5} y={-h + 5} width={S - 10} height={S - 10} fill="none" stroke={C.INDIGO} strokeWidth=".8" />
        <rect x={-h + 17} y={-h + 17} width={S - 34} height={S - 34} fill="none" stroke={C.CRIMSON} strokeWidth="1.2" />
        <rect x={-h + 19.5} y={-h + 19.5} width={S - 39} height={S - 39} fill="none" stroke={C.SAFFRON_D} strokeWidth=".6" strokeDasharray="1.5 1.5" />
        {borderButas.map(([x, y], i) => (
          <path key={i} d={BUTA} transform={`translate(${x} ${y}) scale(.36) rotate(${(i % 4) * 90})`} fill={i % 2 ? C.CRIMSON : C.INDIGO} />
        ))}
        {/* künclər */}
        {[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy], i) => (
          <g key={i} transform={`translate(${sx * (h - 17)} ${sy * (h - 17)}) rotate(${i * 90 + 45})`}>
            <path d="M0 -10L6 0L0 10L-6 0Z" fill={C.SAFFRON} stroke={C.CRIMSON} strokeWidth=".8" />
          </g>
        ))}
        {/* sahə */}
        {field.map(([x, y], i) => (
          <path key={i} d={BUTA} transform={`translate(${x} ${y}) scale(.42) rotate(${i % 2 ? 0 : 180})`} fill={i % 3 === 0 ? C.SAFFRON_D : C.INDIGO} opacity=".9" />
        ))}
        {/* medalyon */}
        <circle r="17" fill={C.CRIMSON} />
        <circle r="14.5" fill="none" stroke={C.SAFFRON} strokeWidth=".8" strokeDasharray="1.4 1.6" />
        <g fill={C.SAFFRON}>
          <rect x="-8" y="-8" width="16" height="16" />
          <rect x="-8" y="-8" width="16" height="16" transform="rotate(45)" />
        </g>
        <circle r="4.5" fill={C.CRIMSON} />
        <circle r="2" fill={C.SILK} />
      </g>
    </svg>
  )
}

/** Romb lövhə — sayğac və masa üçün */
export function Diamond({ size = 80, children, style }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto', ...style }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: '14.6%', transform: 'rotate(45deg)', background: C.SILK, border: `3px solid ${C.CRIMSON}`, outline: `1px solid ${C.SAFFRON_D}`, outlineOffset: -7, boxShadow: '0 12px 20px -12px rgba(110,18,34,.55)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{children}</div>
    </div>
  )
}
