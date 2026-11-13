import { C as PAL, CONFETTI } from './palette'
import { usePalette } from '../../../_shared/palette'

/* CAPS TOSS — məzun papağı, diplom, möhür */

/** Məzun papağı (kvadrat taxta + qotaz) */
export function Cap($p) {
  const C = usePalette(PAL)
  const { size = 120, tassel = C.GOLD, board = '#27396A', style } = $p
  return (
    <svg aria-hidden="true" viewBox="0 0 120 92" width={size} height={typeof size === 'number' ? size * 0.77 : undefined} style={{ display: 'block', overflow: 'visible', ...(typeof size === 'number' ? null : { height: 'auto' }), ...style }}>
      {/* baş hissəsi */}
      <path d="M30 36v22c0 9 14 16 30 16s30-7 30-16V36Z" fill="#0F1A33" />
      <path d="M30 52c0 9 14 16 30 16s30-7 30-16" fill="none" stroke="#2A3B66" strokeWidth="1.2" />
      {/* taxta */}
      <path d="M4 30L60 8L116 30L60 52Z" fill={board} />
      <path d="M4 30L60 52L116 30L116 33L60 55L4 33Z" fill="#0B1428" />
      <path d="M12 30L60 11.5L108 30" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
      {/* qotaz */}
      <path d="M60 30C74 32 92 34 100 40V62" fill="none" stroke={tassel} strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="30" r="3.6" fill={tassel} />
      <path d="M96 62h8l2 18h-12Z" fill={tassel} />
      <path d="M97 66v14M100 66v14M103 66v14" stroke="rgba(0,0,0,.18)" strokeWidth=".8" />
    </svg>
  )
}

/** Konfetti partlayışı (açılışda) */
export function ConfettiBurst({ on = false }) {
  const C = usePalette(PAL)
  if (!on) return null
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {CONFETTI(C).map((p, i) => (
        <span key={i} style={{
          position: 'absolute', left: `${p.x}%`, top: '-4%', width: p.s, height: p.s * 0.45, background: p.c, borderRadius: 1,
          '--dx': `${p.dx}px`, '--r': `${p.r}deg`,
          animation: `ct-fall ${p.dur}s cubic-bezier(.3,.6,.5,1) ${p.d}s both`,
        }} />
      ))}
    </div>
  )
}

/** Qızıl möhür (ulduzlu kənar) */
export function Seal({ size = 64, children, style }) {
  const C = usePalette(PAL)
  const pts = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2
    const r = i % 2 ? 44 : 50
    return `${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`
  }).join(' ')
  return (
    <div style={{ position: 'relative', width: size, height: size, ...style }}>
      <svg aria-hidden="true" viewBox="0 0 100 100" width={size} height={size} style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <defs>
          <radialGradient id="ct-seal" cx="40%" cy="35%" r="70%">
            <stop offset="0" stopColor="#FFF0BF" /><stop offset=".55" stopColor={C.GOLD} /><stop offset="1" stopColor="#9C7522" />
          </radialGradient>
        </defs>
        <polygon points={pts} fill="url(#ct-seal)" />
        <circle cx="50" cy="50" r="34" fill="none" stroke="#9C7522" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#FFF0BF" strokeWidth=".8" opacity=".7" />
      </svg>
      {children && <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{children}</div>}
    </div>
  )
}

/** Diplom tumarı (iki ucu bükülü) */
export function Scroll({ children, style }) {
  const C = usePalette(PAL)
  const roll = (side) => ({
    position: 'absolute', left: -8, right: -8, height: 18, [side]: -9, borderRadius: 9,
    background: 'linear-gradient(180deg, #E6D9B8, #F7EFDA 45%, #D3C29A)', boxShadow: '0 4px 8px -4px rgba(0,0,0,.35)',
  })
  return (
    <div style={{ position: 'relative', margin: '14px 8px', background: `linear-gradient(90deg, rgba(0,0,0,.05), transparent 8%, transparent 92%, rgba(0,0,0,.05)), ${C.PARCH}`, boxShadow: '0 18px 28px -20px rgba(20,33,61,.6)', ...style }}>
      <span aria-hidden="true" style={roll('top')} />
      <span aria-hidden="true" style={roll('bottom')} />
      {children}
    </div>
  )
}
