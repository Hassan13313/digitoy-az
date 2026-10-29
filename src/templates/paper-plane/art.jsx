import { C as PAL, AIRMAIL } from './palette'
import { usePalette } from '../_shared/palette'

/* PAPER PLANE — kağız təyyarə, buludlar, hava poçtu */

/** Kağız təyyarə (yandan) */
export function Plane({ size = 80, tone = 'white', style }) {
  const C = usePalette(PAL)
  const f = tone === 'blue' ? ['#3B7BE6', '#2558B8', '#1B4590', '#1B4590'] : [C.WHITE, '#DCE8F7', '#B9CCE6', '#9FB6D6']
  return (
    <svg aria-hidden="true" viewBox="0 0 100 60" width={size} height={size * 0.6} style={{ display: 'block', overflow: 'visible', ...style }}>
      <path d="M2 30L98 4L40 40Z" fill={f[0]} />
      <path d="M40 40L98 4L52 56Z" fill={f[1]} />
      <path d="M40 40L46 52L52 56Z" fill={f[2]} />
      <path d="M2 30L98 4L40 40L52 56L98 4" fill="none" stroke={f[3]} strokeWidth="1" strokeLinejoin="round" />
    </svg>
  )
}

/** Yumşaq bulud */
export function Cloud({ w = 120, opacity = 0.9, style }) {
  const C = usePalette(PAL)
  return (
    <span aria-hidden="true" style={{ position: 'absolute', display: 'block', width: w, height: w * 0.42, opacity, pointerEvents: 'none', ...style }}>
      <span style={{ position: 'absolute', left: '8%', bottom: 0, width: '84%', height: '52%', borderRadius: 999, background: C.WHITE }} />
      <span style={{ position: 'absolute', left: '20%', bottom: '22%', width: '36%', height: '74%', borderRadius: '50%', background: C.WHITE }} />
      <span style={{ position: 'absolute', left: '44%', bottom: '18%', width: '42%', height: '86%', borderRadius: '50%', background: C.WHITE }} />
    </span>
  )
}

/** Təyyarənin qırıq-qırıq izi (əyri) */
export function Trail($p) {
  const C = usePalette(PAL)
  const { d = 'M10 150C80 140 120 60 200 70S330 20 390 10', on = true, delay = 0, dur = 0.9, color = C.BLUE, style } = $p
  return (
    <svg aria-hidden="true" viewBox="0 0 400 160" preserveAspectRatio="none" style={{ position: 'absolute', overflow: 'visible', pointerEvents: 'none', clipPath: on ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)', transition: `clip-path ${dur}s cubic-bezier(.4,0,.6,1) ${delay}s`, ...style }}>
      <path d={d} fill="none" stroke={color} strokeWidth="2.4" strokeDasharray="7 9" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity=".7" />
    </svg>
  )
}

/** Hava poçtu çərçivəsi (zolaqlı kənar) */
export function Airmail({ children, pad = 8, radius = 10, style }) {
  const C = usePalette(PAL)
  return (
    <div style={{ padding: pad, borderRadius: radius, background: AIRMAIL(C), boxShadow: '0 14px 24px -14px rgba(27,45,79,.45)', ...style }}>
      <div style={{ position: 'relative', height: '100%', borderRadius: Math.max(0, radius - 4), background: C.WHITE, overflow: 'hidden' }}>{children}</div>
    </div>
  )
}

/** Poçt möhürü (dalğalı xətli dairə) */
export function Postmark($p) {
  const C = usePalette(PAL)
  const { size = 74, children, color = C.BLUE, style } = $p
  return (
    <div aria-hidden="true" style={{ position: 'relative', width: size, height: size, ...style }}>
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <circle cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth="3" opacity=".7" />
        <circle cx="50" cy="50" r="36" fill="none" stroke={color} strokeWidth="1.4" opacity=".6" />
        <path d="M-40 40c10-6 20 6 30 0s20 6 30 0M-40 56c10-6 20 6 30 0s20 6 30 0" fill="none" stroke={color} strokeWidth="2.4" opacity=".55" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color, transform: 'rotate(-10deg)' }}>{children}</div>
    </div>
  )
}
