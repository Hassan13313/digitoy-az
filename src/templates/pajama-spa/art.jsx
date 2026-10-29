import { C, PILLOW, FEATHERS } from './palette'

/* PAJAMA SPA — yastıq, lələklər, yuxu maskası, xiyar dilimi */

/** Yumşaq yastıq — `bounce` olanda sıçrayır */
export function Pillow({ width = 240, bounce = false, children, style }) {
  return (
    <div style={{ position: 'relative', width, aspectRatio: '1.5', animation: bounce ? 'ps-squash .6s ease-out 1' : 'none', ...style }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '38% 38% 34% 34% / 46% 46% 40% 40%', background: PILLOW, boxShadow: 'inset 0 -10px 20px rgba(142,114,214,.25), 0 18px 26px -14px rgba(59,46,90,.4)' }}>
        <span aria-hidden="true" style={{ position: 'absolute', inset: '9%', borderRadius: '36% 36% 32% 32% / 44% 44% 38% 38%', border: '2px dashed rgba(142,114,214,.35)' }} />
        {[[6, 8], [94, 8], [6, 92], [94, 92]].map(([x, y], i) => (
          <span key={i} aria-hidden="true" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: 16, height: 16, marginLeft: -8, marginTop: -8, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #FFFFFF, #DCCFF7)' }} />
        ))}
      </div>
      {children && <div style={{ position: 'absolute', inset: '14%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{children}</div>}
    </div>
  )
}

/** Lələk */
export function Feather({ size = 20, color = '#FFFFFF', style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 40" width={size * 0.5} height={size} style={{ display: 'block', overflow: 'visible', ...style }}>
      <path d="M10 2C17 10 18 24 10 36C2 24 3 10 10 2Z" fill={color} stroke="rgba(142,114,214,.45)" strokeWidth="1" />
      <path d="M10 6V40" stroke="rgba(142,114,214,.6)" strokeWidth="1" />
    </svg>
  )
}

/** Lələk partlayışı */
export function FeatherBurst({ on = false }) {
  if (!on) return null
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none', zIndex: 3 }}>
      {FEATHERS.map((f, i) => (
        <span key={i} style={{ position: 'absolute', left: 0, top: 0, '--tx': `${Math.cos((f.a * Math.PI) / 180) * f.r}px`, '--ty': `${Math.sin((f.a * Math.PI) / 180) * f.r}px`, '--rot': `${f.rot}deg`, animation: `ps-feather ${f.dur}s cubic-bezier(.2,.8,.4,1) ${f.d}s both` }}>
          <Feather size={f.s} color={[C.LILAC, C.MINT, C.PEACH, '#FFFFFF'][i % 4]} />
        </span>
      ))}
    </span>
  )
}

/** Yuxu maskası */
export function SleepMask({ width = 220, children, style }) {
  return (
    <div style={{ position: 'relative', width, ...style }}>
      <span aria-hidden="true" style={{ position: 'absolute', left: '-8%', right: '-8%', top: '34%', height: 10, borderRadius: 5, background: C.LILAC_D, opacity: 0.7 }} />
      <div style={{ position: 'relative', aspectRatio: '2.1', borderRadius: '48% 48% 42% 42% / 60% 60% 50% 50%', background: `linear-gradient(160deg, ${C.PEACH}, #FFC0A8 60%, ${C.PEACH_D})`, boxShadow: 'inset 0 -6px 12px rgba(0,0,0,.08), 0 14px 22px -12px rgba(59,46,90,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <span aria-hidden="true" style={{ position: 'absolute', inset: '8%', borderRadius: '46% 46% 40% 40% / 58% 58% 48% 48%', border: '1.5px dashed rgba(255,255,255,.7)' }} />
        {children}
      </div>
    </div>
  )
}

/** Xiyar dilimi (bullet) */
export function Cucumber({ size = 30, style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" width={size} height={size} style={{ display: 'block', ...style }}>
      <circle cx="20" cy="20" r="18" fill="#7CC37A" />
      <circle cx="20" cy="20" r="14.5" fill="#D9F2C9" />
      {[0, 60, 120, 180, 240, 300].map((a) => <ellipse key={a} cx="20" cy="12" rx="1.6" ry="2.8" fill="#A8D88E" transform={`rotate(${a} 20 20)`} />)}
    </svg>
  )
}

/** Aypara */
export function Moon({ size = 46, style }) {
  return <span aria-hidden="true" style={{ display: 'block', width: size, height: size, borderRadius: '50%', boxShadow: `${-size * 0.22}px ${size * 0.1}px 0 0 #FFF1C9`, transform: 'rotate(-20deg)', ...style }} />
}
