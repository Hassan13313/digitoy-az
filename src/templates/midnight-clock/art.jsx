import { C, GOLD_GRAD } from './palette'

/* MIDNIGHT CLOCK — saat, atəşfəşanlıq, cib saatı */

const ROMAN = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']

/** Böyük saat siferblatı. min/hour — dəqiqə və saat əqrəbinin dərəcəsi */
export function ClockFace({ size = 260, minDeg = 0, hourDeg = 0, font, instant = false, glow = false, style }) {
  const tr = instant ? 'none' : 'transform .9s ease-in-out .1s'
  const trMin = instant ? 'none' : 'transform .9s steps(3, end) .1s'
  return (
    <div style={{ position: 'relative', width: size, height: size, borderRadius: '50%', padding: size * 0.04, background: GOLD_GRAD, boxShadow: glow ? `0 0 0 1px ${C.GOLD_D}, 0 0 60px 10px rgba(232,196,106,.45), 0 30px 40px -24px rgba(0,0,0,.8)` : `0 0 0 1px ${C.GOLD_D}, 0 30px 40px -24px rgba(0,0,0,.8)`, transition: 'box-shadow .5s ease', ...style }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle at 50% 40%, #FFFDF6, #F3EAD2 70%, #E2D3AE)', boxShadow: 'inset 0 4px 14px rgba(0,0,0,.25)' }}>
        {ROMAN.map((r, i) => {
          const a = (i / 12) * Math.PI * 2
          const rad = 0.39
          return (
            <span key={r} aria-hidden="true" style={{ position: 'absolute', left: `${50 + Math.sin(a) * rad * 100}%`, top: `${50 - Math.cos(a) * rad * 100}%`, transform: 'translate(-50%, -50%)', fontFamily: font, fontWeight: 600, fontSize: size * (i === 0 ? 0.085 : 0.066), color: i === 0 ? C.GOLD_D : C.INK, lineHeight: 1 }}>{r}</span>
          )
        })}
        {Array.from({ length: 60 }, (_, i) => (
          <span key={i} aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: i % 5 ? 1 : 2, height: size * (i % 5 ? 0.022 : 0.04), marginLeft: i % 5 ? -0.5 : -1, background: C.INK, opacity: i % 5 ? 0.35 : 0.7, transformOrigin: '50% 0', transform: `rotate(${i * 6}deg) translateY(${size * 0.395}px)` }} />
        ))}
        {/* saat əqrəbi */}
        <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: size * 0.035, height: size * 0.24, marginLeft: -size * 0.0175, borderRadius: size * 0.02, background: C.INK, transformOrigin: '50% 100%', transform: `translateY(-100%) rotate(${hourDeg}deg)`, transition: tr }} />
        {/* dəqiqə əqrəbi */}
        <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: size * 0.02, height: size * 0.34, marginLeft: -size * 0.01, borderRadius: size * 0.01, background: C.INK, transformOrigin: '50% 100%', transform: `translateY(-100%) rotate(${minDeg}deg)`, transition: trMin }} />
        <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: size * 0.07, height: size * 0.07, transform: 'translate(-50%, -50%)', borderRadius: '50%', background: GOLD_GRAD, boxShadow: '0 1px 3px rgba(0,0,0,.4)' }} />
      </div>
    </div>
  )
}

/** Atəşfəşanlıq partlayışı */
export function Burst({ x, y, size = 120, color = C.GOLD, delay = 0, loop = false }) {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: 0, height: 0, pointerEvents: 'none' }}>
      {Array.from({ length: 20 }, (_, i) => (
        <span key={i} style={{ position: 'absolute', left: 0, top: 0, width: 3, height: size * 0.5, marginLeft: -1.5, transformOrigin: '50% 0', transform: `rotate(${i * 18}deg)` }}>
          <span style={{ display: 'block', width: '100%', height: '28%', borderRadius: 2, background: `linear-gradient(transparent, ${color})`, boxShadow: `0 0 8px ${color}`, animation: `mc-ray 1.3s cubic-bezier(.2,.7,.3,1) ${delay}s ${loop ? 'infinite' : '1'} both` }} />
        </span>
      ))}
    </span>
  )
}

/** Mini saat — tədbir vaxtını göstərir */
export function MiniClock({ time = '00:00', size = 34, color = C.GOLD }) {
  const [h, m] = String(time).split(':').map((n) => parseInt(n, 10) || 0)
  const md = m * 6
  const hd = (h % 12) * 30 + m * 0.5
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" width={size} height={size} style={{ display: 'block', flexShrink: 0 }}>
      <circle cx="20" cy="20" r="17.5" fill="none" stroke={color} strokeWidth="2.5" />
      {[0, 90, 180, 270].map((a) => <line key={a} x1="20" y1="5" x2="20" y2="8" stroke={color} strokeWidth="2" transform={`rotate(${a} 20 20)`} />)}
      <line x1="20" y1="20" x2="20" y2="11" stroke={color} strokeWidth="2.6" strokeLinecap="round" transform={`rotate(${hd} 20 20)`} />
      <line x1="20" y1="20" x2="20" y2="7.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" transform={`rotate(${md} 20 20)`} />
      <circle cx="20" cy="20" r="2" fill={color} />
    </svg>
  )
}

/** Cib saatı (masa üçün) */
export function PocketWatch({ size = 190, children }) {
  return (
    <div style={{ position: 'relative', width: size, margin: '0 auto', paddingTop: size * 0.16 }}>
      <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 0, width: size * 0.16, height: size * 0.16, marginLeft: -size * 0.08, borderRadius: '50%', border: `${size * 0.03}px solid ${C.GOLD}` }} />
      <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: size * 0.12, width: size * 0.12, height: size * 0.08, marginLeft: -size * 0.06, borderRadius: 4, background: GOLD_GRAD }} />
      <div style={{ width: size, height: size, borderRadius: '50%', padding: size * 0.05, background: GOLD_GRAD, boxShadow: '0 22px 30px -16px rgba(0,0,0,.8)' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle at 50% 40%, #FFFDF6, #F0E4C4)', boxShadow: 'inset 0 3px 10px rgba(0,0,0,.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
