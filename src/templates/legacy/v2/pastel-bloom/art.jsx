import { C as PAL, TONES } from './palette'
import { usePalette } from '../../../_shared/palette'

/* PASTEL BLOOM — akvarel dekor (hamısı aria-hidden) */

/** Akvarel filtri və tonlar — kökdə bir dəfə çəkilir */
export function WatercolorDefs() {
  const C = usePalette(PAL)
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <filter id="pb-wc" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="10" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation=".7" />
        </filter>
        <filter id="pb-wc-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="1.4" />
        </filter>
        {Object.entries(TONES(C)).map(([k, [a, b, c]]) => (
          <radialGradient key={k} id={`pb-${k}`} cx="50%" cy="85%" r="85%">
            <stop offset="0" stopColor={c} stopOpacity=".85" /><stop offset=".45" stopColor={b} stopOpacity=".8" /><stop offset="1" stopColor={a} stopOpacity=".55" />
          </radialGradient>
        ))}
      </defs>
    </svg>
  )
}

/** Akvarel çiçəyi */
export function Bloom({ size = 120, tone = 'blush', rotate = 0, petals = 6, style }) {
  const C = usePalette(PAL)
  const [, , dark] = TONES(C)[tone] || TONES(C).blush
  const step = 360 / petals
  return (
    <svg aria-hidden="true" viewBox="-60 -60 120 120" width={size} height={size} style={{ display: 'block', overflow: 'visible', transform: `rotate(${rotate}deg)`, ...style }}>
      <g filter="url(#pb-wc)">
        {/* yarpaqlar */}
        <ellipse cx="0" cy="-44" rx="9" ry="20" transform="rotate(140)" fill="url(#pb-sage)" />
        <ellipse cx="0" cy="-44" rx="8" ry="18" transform="rotate(210)" fill="url(#pb-sage)" />
        {Array.from({ length: petals }, (_, i) => (
          <ellipse key={i} cx="0" cy="-22" rx="15" ry="24" transform={`rotate(${i * step})`} fill={`url(#pb-${tone})`} />
        ))}
        <circle r="10" fill={dark} fillOpacity=".55" />
      </g>
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2
        return <circle key={i} cx={Math.cos(a) * 6} cy={Math.sin(a) * 6} r="1.6" fill={dark} />
      })}
    </svg>
  )
}

/** Akvarel ləkəsi — sayğac üçün */
export function Dab({ size = 90, tone = 'blush', children, style }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto', ...style }}>
      <svg aria-hidden="true" viewBox="-50 -50 100 100" width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <g filter="url(#pb-wc-soft)">
          <path d="M-36 -18C-30 -40 4 -46 26 -36C46 -26 46 6 36 26C24 46 -10 46 -30 32C-46 20 -42 2 -36 -18Z" fill={`url(#pb-${tone})`} />
        </g>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{children}</div>
    </div>
  )
}

/** Kiçik budaq — başlıq ornamenti */
export function Sprig({ width = 200, style }) {
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width, maxWidth: '100%', margin: '0 auto', ...style }}>
      <Bloom size={20} tone="sage" petals={5} />
      <Bloom size={30} tone="blush" />
      <Bloom size={20} tone="butter" petals={5} />
    </div>
  )
}
