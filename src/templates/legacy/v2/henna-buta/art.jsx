import { C as PAL, HAND, TIPS, BANDS } from './palette'
import { usePalette } from '../../../_shared/palette'

/* HENNA BUTA — dekor (hamısı aria-hidden) */

/** Mandala — xına naxışının mərkəzi gülü */
export function Mandala($p) {
  const C = usePalette(PAL)
  const { size = 120, color = C.HENNA, petals = 12, disc = null, style, children } = $p
  const step = 360 / petals
  return (
    <div aria-hidden={children ? undefined : 'true'} style={{ position: 'relative', width: size, height: size, ...style }}>
      <svg aria-hidden="true" viewBox="-50 -50 100 100" width={size} height={size} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <g fill="none" stroke={color} strokeWidth="1" strokeLinecap="round">
          <circle r="47" strokeDasharray="0.1 3.2" strokeWidth="1.8" />
          {Array.from({ length: petals }, (_, i) => (
            <path key={`o${i}`} transform={`rotate(${i * step})`} d="M0 -44C7 -38 7 -31 0 -27C-7 -31 -7 -38 0 -44Z" />
          ))}
          {Array.from({ length: petals }, (_, i) => (
            <path key={`i${i}`} transform={`rotate(${i * step + step / 2})`} d="M0 -34C4 -30 4 -26 0 -23C-4 -26 -4 -30 0 -34Z" />
          ))}
          <circle r="22" fill={disc || 'none'} />
          <circle r="19" strokeDasharray="0.1 2.6" strokeWidth="1.6" />
        </g>
        {Array.from({ length: petals }, (_, i) => (
          <circle key={`d${i}`} transform={`rotate(${i * step + step / 2})`} cx="0" cy="-41" r="1.3" fill={color} />
        ))}
      </svg>
      {children && <div style={{ position: 'absolute', inset: '24%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{children}</div>}
    </div>
  )
}

/** Yarpaq — sarmaşığın üstündə */
export function Leaf($p) {
  const C = usePalette(PAL)
  const { size = 18, color = C.HENNA, rotate = 0, style } = $p
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width={size} height={size} style={{ display: 'block', transform: `rotate(${rotate}deg)`, ...style }}>
      <path d="M2 18C2 9 8 3 18 2C17 12 11 18 2 18Z" fill="none" stroke={color} strokeWidth="1.2" />
      <path d="M2 18L13 7M7 13l1-4M10 10l3 0" fill="none" stroke={color} strokeWidth=".8" />
    </svg>
  )
}

/** Nöqtəli xətt — başlıq ornamenti */
export function DotRule($p) {
  const C = usePalette(PAL)
  const { color = C.HENNA, width = 220, style } = $p
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width, maxWidth: '100%', margin: '0 auto', ...style }}>
      <span style={{ flex: 1, height: 2, backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1.3px)`, backgroundSize: '7px 2px', backgroundRepeat: 'repeat-x' }} />
      <Leaf size={14} color={color} rotate={-45} />
      <Mandala size={22} color={color} petals={8} />
      <Leaf size={14} color={color} rotate={135} style={{ transform: 'scaleX(-1) rotate(-45deg)' }} />
      <span style={{ flex: 1, height: 2, backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1.3px)`, backgroundSize: '7px 2px', backgroundRepeat: 'repeat-x' }} />
    </div>
  )
}

/**
 * Ovuc və xına naxışı. `drawn=false` → yalnız ovuc; true → naxış xətt-xətt
 * çəkilir (stroke-dashoffset), barmaq ucları sonra dolur.
 */
export function HennaHand({ drawn = true, width = 220, instant = false, style }) {
  const C = usePalette(PAL)
  /* ⚠ yuvarlaq uclu xəttin sıfır uzunluqlu tirəsi nöqtə kimi görünür — çəkilənə qədər opacity 0 */
  const t = (delay, dur = 0.9) => (instant ? {} : { transition: `stroke-dashoffset ${dur}s ease ${delay}s, opacity 0s linear ${delay}s` })
  const line = (delay, dur) => ({ pathLength: 1, style: { strokeDasharray: 1, strokeDashoffset: drawn ? 0 : 1, opacity: drawn ? 1 : 0, ...t(delay, dur) } })
  const petals = Array.from({ length: 10 }, (_, i) => i * 36)
  return (
    <svg aria-hidden="true" viewBox="0 0 200 290" width={width} style={{ display: 'block', maxWidth: '100%', overflow: 'visible', ...style }}>
      <defs>
        <linearGradient id="hb-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6DCC4" /><stop offset="1" stopColor="#EBC3A0" />
        </linearGradient>
      </defs>
      <path d={HAND} fill="url(#hb-skin)" stroke={C.SKIN_D} strokeWidth="1.4" />
      <g fill="none" stroke={C.HENNA} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        {/* mərkəz gülü */}
        <circle cx="100" cy="196" r="7" {...line(0.1, 0.5)} />
        <circle cx="100" cy="196" r="14" {...line(0.25, 0.6)} />
        {petals.map((a, i) => (
          <path key={a} transform={`rotate(${a} 100 196)`} d="M100 180C105 175 105 168 100 163C95 168 95 175 100 180Z" {...line(0.35 + i * 0.03, 0.4)} />
        ))}
        <circle cx="100" cy="196" r="38" strokeDasharray="0.1 3" strokeWidth="1.8" style={{ opacity: drawn ? 1 : 0, transition: instant ? 'none' : 'opacity .4s ease .8s' }} />
        {/* bilək bəzəyi */}
        <path d="M66 262Q100 270 135 262" {...line(0.5, 0.6)} />
        <path d="M67 272Q100 280 135 272" {...line(0.6, 0.6)} />
        <path d="M68 262q4 7 8 0q4 7 8 0q4 7 8 0q4 7 8 0q4 7 8 0q4 7 8 0q4 7 8 0q4 7 8 0" {...line(0.7, 0.6)} />
        {/* gülün ovuca açılan sarmaşığı */}
        <path d="M100 234C98 222 92 214 84 214M100 234C102 222 108 214 116 214M100 234V258" {...line(0.55, 0.6)} />
        {/* buta — baş barmaq tərəfində */}
        <path d="M56 186C48 186 44 180 44 174C44 166 50 160 56 156C58 154 61 153 62 155C63 157 61 158 60 159C64 163 66 168 66 174C66 181 62 186 56 186Z" {...line(0.45, 0.6)} />
        <circle cx="56" cy="174" r="3" {...line(0.7, 0.3)} />
        {/* barmaq bəzəkləri */}
        {BANDS.map(([x1, x2, y], i) => (
          <g key={i}>
            <path d={`M${x1 + 1} ${y}H${x2 - 1}M${x1 + 1} ${y + 5}H${x2 - 1}`} {...line(0.75 + i * 0.08, 0.35)} />
            <path d={`M${(x1 + x2) / 2} ${y + 12}l3 4l-3 4l-3 -4z`} {...line(0.85 + i * 0.08, 0.3)} />
          </g>
        ))}
        {/* barmaq diblərində yarımdairələr */}
        <path d="M60 146q8 -8 16 0M83 142q9 -9 18 0M107 146q8 -8 16 0M129 156q6 -6 13 0" {...line(0.9, 0.5)} />
        <path d="M30 150q6 -4 10 2" {...line(0.95, 0.3)} />
      </g>
      {/* dolu barmaq ucları və nöqtələr */}
      <g fill={C.HENNA} style={{ opacity: drawn ? 1 : 0, transition: instant ? 'none' : 'opacity .5s ease 1.05s' }}>
        {TIPS.map((d) => <path key={d} d={d} />)}
        <circle cx="100" cy="196" r="3.2" />
        {BANDS.map(([x1, x2, y]) => [0.25, 0.5, 0.75].map((k) => <circle key={`${x1}-${k}`} cx={x1 + (x2 - x1) * k} cy={y + 2.5} r="1" />))}
      </g>
    </svg>
  )
}
