import { C } from './palette'

/* AWARD NIGHT — dekor */

/** Kubok (iki qulplu, postamentli) */
export function Trophy({ width = 150, uid = 'aw', style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 150" width={width} style={{ display: 'block', overflow: 'visible', ...style }}>
      <defs>
        <linearGradient id={`${uid}-g`} x1="0" x2="1">
          <stop offset="0" stopColor="#8C6618" /><stop offset=".25" stopColor="#E1B54E" /><stop offset=".45" stopColor="#FFF1C2" /><stop offset=".65" stopColor="#E1B54E" /><stop offset="1" stopColor="#7A5612" />
        </linearGradient>
      </defs>
      {/* qulplar */}
      <path d="M26 22C8 22 6 52 34 58" fill="none" stroke={`url(#${uid}-g)`} strokeWidth="6" strokeLinecap="round" />
      <path d="M94 22C112 22 114 52 86 58" fill="none" stroke={`url(#${uid}-g)`} strokeWidth="6" strokeLinecap="round" />
      {/* kasa */}
      <path d="M24 12H96C96 46 82 70 60 72C38 70 24 46 24 12Z" fill={`url(#${uid}-g)`} />
      <ellipse cx="60" cy="12" rx="36" ry="5" fill="#FFF1C2" opacity=".75" />
      <path d="M40 22C40 44 48 58 58 62" fill="none" stroke="#FFFFFF" strokeOpacity=".45" strokeWidth="3" strokeLinecap="round" />
      {/* ayaq */}
      <path d="M54 72H66L64 96H56Z" fill={`url(#${uid}-g)`} />
      <ellipse cx="60" cy="98" rx="16" ry="4" fill={`url(#${uid}-g)`} />
      {/* postament */}
      <rect x="34" y="102" width="52" height="12" rx="2" fill={`url(#${uid}-g)`} />
      <rect x="28" y="114" width="64" height="26" rx="2" fill="#2A060E" stroke={`url(#${uid}-g)`} strokeWidth="2" />
      <rect x="40" y="121" width="40" height="12" rx="1" fill={`url(#${uid}-g)`} opacity=".9" />
      {/* ulduz */}
      <path d="M60 28l3.5 7.2 8 1.1-5.8 5.6 1.4 7.9L60 46l-7.1 3.8 1.4-7.9-5.8-5.6 8-1.1z" fill="#FFF6D6" opacity=".9" />
    </svg>
  )
}

/** Dəfnə çələngi (yarım) — iki tərəfli */
export function Laurel({ width = 220, color = C.GOLD, style, children }) {
  const leaves = (flip) => (
    <g transform={flip ? 'translate(200 0) scale(-1 1)' : undefined}>
      <path d="M100 96C60 96 30 70 24 30" fill="none" stroke={color} strokeWidth="1.6" />
      {Array.from({ length: 8 }, (_, i) => {
        const t = i / 7
        const x = 100 - t * 72 - Math.sin(t * Math.PI) * 6
        const y = 96 - t * 64 + Math.sin(t * 2) * 2
        return <ellipse key={i} cx={x} cy={y} rx="9" ry="3.6" transform={`rotate(${-30 - t * 50} ${x} ${y})`} fill={color} />
      })}
    </g>
  )
  return (
    <div style={{ position: 'relative', width, maxWidth: '100%', margin: '0 auto', ...style }}>
      <svg aria-hidden="true" viewBox="0 0 200 104" width="100%" style={{ display: 'block' }}>
        {leaves(false)}
        {leaves(true)}
      </svg>
      {children && <div style={{ position: 'absolute', inset: '0 18% 10%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{children}</div>}
    </div>
  )
}

/** Medal — lentli */
export function Medal({ size = 80, children, ribbon = [C.CARPET, C.GOLD], style }) {
  return (
    <div style={{ position: 'relative', width: size, margin: '0 auto', paddingTop: size * 0.42, ...style }}>
      <span aria-hidden="true" style={{ position: 'absolute', left: '22%', top: 0, width: '26%', height: size * 0.58, background: ribbon[0], clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)', transform: 'rotate(14deg)', transformOrigin: '50% 0' }} />
      <span aria-hidden="true" style={{ position: 'absolute', right: '22%', top: 0, width: '26%', height: size * 0.58, background: ribbon[1], clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)', transform: 'rotate(-14deg)', transformOrigin: '50% 0' }} />
      <div style={{ position: 'relative', width: size, height: size, borderRadius: '50%', background: 'conic-gradient(from 200deg, #8C6618, #F6DD95, #E1B54E, #FFF1C2, #A07A22, #E1B54E, #8C6618)', boxShadow: '0 10px 16px -8px rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: '10%', borderRadius: '50%', border: '1px dashed rgba(90,60,10,.45)' }} />
        <div style={{ position: 'relative', textAlign: 'center' }}>{children}</div>
      </div>
    </div>
  )
}

/** Mis lövhə — vintli */
export function Plaque({ children, style }) {
  return (
    <div style={{ position: 'relative', padding: '16px 26px', borderRadius: 4, background: 'linear-gradient(180deg, #F3D98E 0%, #D9AE4A 45%, #B98C2C 55%, #E6C470 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.6), inset 0 -2px 0 rgba(90,60,10,.3), 0 14px 24px -14px rgba(0,0,0,.7)', color: C.INK, ...style }}>
      {[[8, 8], [8, null], [null, 8], [null, null]].map(([l, t], i) => (
        <span key={i} aria-hidden="true" style={{ position: 'absolute', left: l ?? undefined, right: l == null ? 8 : undefined, top: t ?? undefined, bottom: t == null ? 8 : undefined, width: 6, height: 6, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FFF4CF, #8C6618)' }} />
      ))}
      {children}
    </div>
  )
}
