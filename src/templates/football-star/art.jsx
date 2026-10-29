import { C } from './palette'

/* FOOTBALL STAR — dekor */

/** Futbol topu */
export function Ball({ size = 60, style }) {
  return (
    <svg aria-hidden="true" viewBox="-50 -50 100 100" width={size} height={size} style={{ display: 'block', overflow: 'visible', ...style }}>
      <defs>
        <radialGradient id="fs-ball" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#FFFFFF" /><stop offset=".7" stopColor="#F1F3F5" /><stop offset="1" stopColor="#C9CFD6" />
        </radialGradient>
        <clipPath id="fs-ball-clip"><circle r="47" /></clipPath>
      </defs>
      <circle r="47" fill="url(#fs-ball)" stroke="#1B2530" strokeWidth="2" />
      <g clipPath="url(#fs-ball-clip)" fill="#1B2530">
        <path d="M0 -16L15 -5L9 13H-9L-15 -5Z" />
        {[0, 72, 144, 216, 288].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path d="M0 -40L11 -48L8 -60H-8L-11 -48Z" />
            <path d="M0 -16L0 -40" stroke="#1B2530" strokeWidth="2" />
          </g>
        ))}
      </g>
    </svg>
  )
}

/** Qapı (tor) — `bulge` toru dartır */
export function Goal({ width = 300, bulge = false, delay = 0, style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 300 130" width={width} style={{ display: 'block', maxWidth: '100%', overflow: 'visible', ...style }}>
      <defs>
        <pattern id="fs-net" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M0 0L10 10M10 0L0 10" stroke="rgba(255,255,255,.55)" strokeWidth=".8" />
        </pattern>
      </defs>
      <g style={{ transformBox: 'fill-box', transformOrigin: '50% 0%', transform: bulge ? 'scale(1.06, 1.18)' : 'none', transition: `transform .25s cubic-bezier(.3,1.6,.5,1) ${delay}s` }}>
        <path d="M24 14H276L262 112H38Z" fill="url(#fs-net)" />
        <path d="M24 14L38 112M276 14L262 112M38 112H262" stroke="rgba(255,255,255,.5)" strokeWidth="1.2" fill="none" />
      </g>
      <path d="M18 124V10H282V124" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinejoin="round" />
      <path d="M0 124H300" stroke={C.LINE} strokeWidth="3" />
    </svg>
  )
}

/** Forma (arxadan) — ad və nömrə */
export function Jersey({ width = 240, name, number, head, digits, color = C.NAVY, trim = C.GOLD, children, style }) {
  return (
    <div style={{ position: 'relative', width, maxWidth: '100%', margin: '0 auto', ...style }}>
      <svg aria-hidden="true" viewBox="0 0 240 250" width="100%" style={{ display: 'block', filter: 'drop-shadow(0 18px 22px rgba(0,0,0,.35))' }}>
        <defs>
          <linearGradient id={`fs-j-${color.slice(1)}`} x1="0" x2="1">
            <stop offset="0" stopColor={color} /><stop offset=".5" stopColor={color} stopOpacity=".88" /><stop offset="1" stopColor={color} />
          </linearGradient>
        </defs>
        <path d="M84 8C92 18 148 18 156 8L206 26L236 82L198 100L188 84V242H52V84L42 100L4 82L34 26Z" fill={`url(#fs-j-${color.slice(1)})`} />
        <path d="M84 8C92 18 148 18 156 8" fill="none" stroke={trim} strokeWidth="6" />
        <path d="M4 82L42 100M236 82L198 100" stroke={trim} strokeWidth="6" />
        <path d="M60 236H180" stroke={trim} strokeWidth="4" opacity=".7" />
        <path d="M120 22V236" stroke="#FFFFFF" strokeOpacity=".06" strokeWidth="60" />
      </svg>
      <div style={{ position: 'absolute', left: '22%', right: '22%', top: '18%', bottom: '8%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: C.WHITE }}>
        {name != null && <div style={{ fontFamily: head, fontWeight: 600, fontSize: 'clamp(14px, 4.4vw, 19px)', letterSpacing: '.08em', textTransform: 'uppercase', lineHeight: 1.1, overflowWrap: 'anywhere', maxWidth: '100%' }}>{name}</div>}
        {number != null && (() => {
          const t = String(number)
          const n = Array.from(t).length
          const size = n <= 2 ? 'clamp(70px, 22vw, 104px)' : n <= 4 ? 'clamp(44px, 13vw, 60px)' : 'clamp(22px, 6.4vw, 30px)'
          return <div style={{ marginTop: 4, fontFamily: /^\d+$/.test(t) ? digits : head, fontWeight: n <= 4 ? 800 : 600, fontSize: size, lineHeight: 1, color: trim, textShadow: '0 3px 0 rgba(0,0,0,.25)', overflowWrap: 'anywhere' }}>{t}</div>
        })()}
        {children}
      </div>
    </div>
  )
}

/** Fit (hakim fiti) ikonu */
export function Whistle({ size = 20, color = C.GOLD, style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block', ...style }}>
      <path d="M3 13a6 6 0 0 0 11.6 2.2L21 13V9h-9.2A6 6 0 0 0 3 13z" fill={color} />
      <circle cx="9" cy="13" r="2" fill={C.NAVY} />
      <path d="M12 9V6h3" stroke={color} strokeWidth="1.6" fill="none" />
    </svg>
  )
}
