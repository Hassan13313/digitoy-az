import { C as PAL, SASH } from './palette'
import { usePalette } from '../_shared/palette'

/* LAST BELL — məktəb zəngi, ağ bant, qırmızı lent */

/** Mis məktəb zəngi (taxta dəstəkli, qırmızı lentli) */
export function Bell({ size = 140, ringing = false, style }) {
  const C = usePalette(PAL)
  return (
    <div style={{ width: size, transformOrigin: '50% 12%', animation: ringing ? 'lb-ring .16s ease-in-out 6 alternate' : 'none', ...style }}>
      <svg aria-hidden="true" viewBox="0 0 120 150" width="100%" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="lb-brass" x1="0" x2="1">
            <stop offset="0" stopColor="#8E6B22" /><stop offset=".35" stopColor="#F2D58A" /><stop offset=".55" stopColor="#C9A04A" /><stop offset="1" stopColor="#7A5A1C" />
          </linearGradient>
          <linearGradient id="lb-wood" x1="0" x2="1">
            <stop offset="0" stopColor="#5A341C" /><stop offset=".45" stopColor="#9A6440" /><stop offset="1" stopColor="#5A341C" />
          </linearGradient>
        </defs>
        {/* dəstək */}
        <rect x="52" y="2" width="16" height="40" rx="8" fill="url(#lb-wood)" />
        <rect x="48" y="38" width="24" height="8" rx="3" fill="#8E6B22" />
        {/* zəng */}
        <path d="M60 44C38 44 32 64 30 84C28 104 22 114 12 122H108C98 114 92 104 90 84C88 64 82 44 60 44Z" fill="url(#lb-brass)" />
        <path d="M10 122H110C112 122 112 130 110 130H10C8 130 8 122 10 122Z" fill="#9C7A2E" />
        <path d="M44 62C40 74 39 90 36 108" fill="none" stroke="#FFF3C8" strokeOpacity=".6" strokeWidth="4" strokeLinecap="round" />
        <circle cx="60" cy="138" r="8" fill="#7A5A1C" />
        {/* qırmızı lent */}
        <path d="M48 46C36 40 30 50 38 56C44 60 50 52 56 48ZM72 46C84 40 90 50 82 56C76 60 70 52 64 48Z" fill={C.RED} />
        <path d="M56 50L48 74L54 70L58 78ZM64 50L72 74L66 70L62 78Z" fill={C.RED_D} />
        <circle cx="60" cy="48" r="5" fill={C.RED} />
      </svg>
    </div>
  )
}

/** Zəng səsi — genişlənən dalğalar */
export function SoundRings($p) {
  const C = usePalette(PAL)
  const { on = false, color = C.GOLD } = $p
  if (!on) return null
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      {[0, 0.25, 0.5].map((d) => (
        <span key={d} style={{ position: 'absolute', left: -60, top: -60, width: 120, height: 120, borderRadius: '50%', border: `3px solid ${color}`, animation: `lb-wave 1s ease-out ${d}s both` }} />
      ))}
    </span>
  )
}

/** Ağ bant (məktəbli fiyonku) */
export function Bow({ size = 90, style }) {
  const C = usePalette(PAL)
  return (
    <svg aria-hidden="true" viewBox="0 0 120 90" width={size} height={size * 0.75} style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(0 6px 8px rgba(28,42,74,.18))', ...style }}>
      <g fill={C.WHITE} stroke="#D9DEE8" strokeWidth="1.2">
        <path d="M60 40C40 8 6 4 6 30C6 50 30 60 60 46Z" />
        <path d="M60 40C80 8 114 4 114 30C114 50 90 60 60 46Z" />
        <path d="M54 46L34 88L46 80L52 90L60 50Z" />
        <path d="M66 46L86 88L74 80L68 90L60 50Z" />
      </g>
      <g fill="none" stroke="#E6EAF2" strokeWidth="1">
        <path d="M58 40C44 20 22 14 14 26M58 42C40 34 24 34 14 38" />
        <path d="M62 40C76 20 98 14 106 26M62 42C80 34 96 34 106 38" />
      </g>
      <ellipse cx="60" cy="43" rx="10" ry="9" fill={C.WHITE} stroke="#D9DEE8" strokeWidth="1.2" />
    </svg>
  )
}

/** Qırmızı məzun lenti (qızılı kənar zolaqlı) */
export function Sash({ children, style, height = 64 }) {
  const C = usePalette(PAL)
  return (
    <div style={{
      position: 'relative', height, display: 'flex', alignItems: 'center', justifyContent: 'center', background: SASH(C),
      boxShadow: '0 10px 20px -10px rgba(147,11,33,.6)', ...style,
    }}>
      <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 5, height: 2, background: C.GOLD, opacity: 0.85 }} />
      <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 5, height: 2, background: C.GOLD, opacity: 0.85 }} />
      {children}
    </div>
  )
}
