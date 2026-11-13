import { C as PAL, DUST } from './palette'
import { usePalette } from '../../../_shared/palette'

/* LITTLE PRINCE — dekor (hamısı aria-hidden) */

/** Tac — beş dişli, mirvarili, qaşlı */
export function Crown({ width = 120, uid = 'lp', style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 92" width={width} style={{ display: 'block', overflow: 'visible', ...style }}>
      <defs>
        <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF0BE" /><stop offset=".35" stopColor="#E3BE62" /><stop offset=".7" stopColor="#B68C36" /><stop offset="1" stopColor="#8C6A24" />
        </linearGradient>
        <linearGradient id={`${uid}-v`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#B8304A" /><stop offset="1" stopColor="#6E1426" />
        </linearGradient>
      </defs>
      {/* məxmər papaq */}
      <path d="M22 62C22 38 40 26 60 26S98 38 98 62Z" fill={`url(#${uid}-v)`} />
      {/* dişlər */}
      <path d="M12 70L8 30L32 50L44 18L60 44L76 18L88 50L112 30L108 70Z" fill={`url(#${uid}-g)`} stroke="#7A5A1C" strokeWidth="1" strokeLinejoin="round" />
      {/* mirvarilər */}
      {[[8, 28], [44, 16], [60, 12], [76, 16], [112, 28]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="4.6" fill="#FFFDF6" stroke="#B68C36" strokeWidth=".8" />
      ))}
      <circle cx="60" cy="5" r="3" fill="#FFFDF6" stroke="#B68C36" strokeWidth=".8" />
      <path d="M60 8V12" stroke="#B68C36" strokeWidth="1.4" />
      {/* hoqqa */}
      <rect x="10" y="68" width="100" height="16" rx="3" fill={`url(#${uid}-g)`} stroke="#7A5A1C" strokeWidth="1" />
      {[22, 41, 60, 79, 98].map((x, i) => (
        i % 2
          ? <ellipse key={x} cx={x} cy="76" rx="4.5" ry="4" fill="#2D4E9E" stroke="#FFF0BE" strokeWidth=".8" />
          : <path key={x} d={`M${x} 71l4 5l-4 5l-4 -5z`} fill="#B8304A" stroke="#FFF0BE" strokeWidth=".8" />
      ))}
      <path d="M14 71H106" stroke="#FFF6D6" strokeOpacity=".7" strokeWidth=".8" />
    </svg>
  )
}

/** Qotazlı məxmər yastıq */
export function Cushion({ width = 220, children, style }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', width, maxWidth: '100%', ...style }}>
      <svg aria-hidden="true" viewBox="0 0 220 80" width="100%" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <radialGradient id="lp-cush" cx="50%" cy="30%" r="80%">
            <stop offset="0" stopColor="#3B5DB3" /><stop offset=".6" stopColor={C.ROYAL} /><stop offset="1" stopColor={C.NAVY} />
          </radialGradient>
        </defs>
        <ellipse cx="110" cy="74" rx="104" ry="7" fill="rgba(0,0,0,.35)" />
        <path d="M14 22C40 8 180 8 206 22C214 40 214 52 206 64C180 76 40 76 14 64C6 52 6 40 14 22Z" fill="url(#lp-cush)" />
        <path d="M14 22C40 8 180 8 206 22C214 40 214 52 206 64C180 76 40 76 14 64C6 52 6 40 14 22Z" fill="none" stroke={C.GOLD} strokeWidth="2.2" strokeDasharray="0.1 4.2" strokeLinecap="round" />
        <path d="M40 30C80 24 140 24 180 30" stroke="#6E8BD6" strokeOpacity=".35" strokeWidth="3" fill="none" />
        {[[14, 22], [206, 22], [14, 64], [206, 64]].map(([x, y]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
            <circle r="4" fill={C.GOLD} />
            <path d={`M-4 ${y > 40 ? 3 : 3}L-6 ${y > 40 ? 18 : 16}H6L4 3Z`} fill={C.GOLD} />
            <path d="M-4 8H4" stroke="#8C6A24" strokeWidth=".8" />
          </g>
        ))}
      </svg>
      {children && <div style={{ position: 'absolute', left: '10%', right: '10%', top: '16%', bottom: '18%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>}
    </div>
  )
}

/** Qalxan — sayğac lövhəsi */
export const SHIELD = 'polygon(0 0, 100% 0, 100% 62%, 50% 100%, 0 62%)'

/** Qızılı toz (fon) */
export function Dust({ opacity = 1 }) {
  const C = usePalette(PAL)
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity }}>
      {DUST.map((d, i) => (
        <span key={i} style={{ position: 'absolute', left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s, borderRadius: '50%', background: C.GOLD_L, boxShadow: `0 0 ${d.s * 3}px ${C.GOLD}`, animation: `lp-twinkle 3.6s ease-in-out ${d.d}s infinite` }} />
      ))}
    </div>
  )
}

/** Kiçik tac — başlıq ornamenti */
export function CrownRule($p) {
  const C = usePalette(PAL)
  const { color = C.GOLD, width = 220, style } = $p
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 10, width, maxWidth: '100%', margin: '0 auto', ...style }}>
      <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${color})` }} />
      <svg viewBox="0 0 40 26" width="30" height="20" style={{ display: 'block' }}>
        <path d="M4 22L2 6L12 14L20 2L28 14L38 6L36 22Z" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="20" cy="2.5" r="1.8" fill={color} /><circle cx="2" cy="5.5" r="1.4" fill={color} /><circle cx="38" cy="5.5" r="1.4" fill={color} />
      </svg>
      <span style={{ flex: 1, height: 1, background: `linear-gradient(270deg, transparent, ${color})` }} />
    </div>
  )
}
