import { C, SPARKS } from './palette'

/* NOVRUZ BONFIRE — tonqal, qığılcımlar, buta */

/** Tonqal: odun + alov dilləri. `lit=false` — yalnız közlər */
export function Bonfire({ size = 200, lit = true, instant = false, style }) {
  const flame = (d, fill, delay, extra) => (
    <path d={d} fill={fill} style={{ transformOrigin: '100px 150px', transformBox: 'view-box', animation: `nb-flick ${1.1 + delay}s ease-in-out ${delay}s infinite alternate`, ...extra }} />
  )
  return (
    <div style={{ position: 'relative', width: size, ...style }}>
      {/* parıltı */}
      <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '58%', width: '220%', aspectRatio: '1', transform: `translate(-50%, -50%) scale(${lit ? 1 : 0.25})`, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,160,60,.45), rgba(255,122,26,.15) 55%, transparent)', opacity: lit ? 1 : 0.6, transition: instant ? 'none' : 'transform .9s ease-out .15s, opacity .6s ease' }} />
      <svg aria-hidden="true" viewBox="0 0 200 190" width="100%" style={{ position: 'relative', display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="nb-wood" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8A5530" /><stop offset="1" stopColor="#4E2B16" /></linearGradient>
        </defs>
        <g style={{ transformOrigin: '100px 152px', transformBox: 'view-box', transform: `scale(${lit ? 1 : 0})`, transition: instant ? 'none' : 'transform .7s cubic-bezier(.3,1.4,.5,1) .1s' }}>
          {flame('M100 150C60 140 52 104 70 78C76 96 86 98 86 84C86 60 98 40 112 22C112 46 128 58 136 78C146 104 138 140 100 150Z', '#D93B2B', 0)}
          {flame('M100 150C72 142 66 114 80 94C84 106 92 106 92 96C92 78 102 64 110 50C112 68 124 80 128 98C134 122 124 144 100 150Z', '#FF7A1A', 0.15)}
          {flame('M100 150C82 144 80 124 88 110C92 118 96 118 98 110C100 98 106 88 110 80C114 96 120 106 120 120C120 136 114 146 100 150Z', '#FFC23D', 0.3)}
          {flame('M100 150C92 146 90 136 94 128C98 134 102 132 103 126C106 132 110 138 108 144C106 148 104 150 100 150Z', '#FFF1C2', 0.45)}
        </g>
        {/* odunlar */}
        <rect x="36" y="146" width="128" height="18" rx="9" fill="url(#nb-wood)" transform="rotate(-14 100 155)" />
        <rect x="36" y="146" width="128" height="18" rx="9" fill="url(#nb-wood)" transform="rotate(14 100 155)" />
        <circle cx="40" cy="170" r="7" fill="#C08A5A" /><circle cx="160" cy="170" r="7" fill="#C08A5A" />
        <circle cx="40" cy="170" r="3.5" fill="none" stroke="#8A5530" strokeWidth="1.2" /><circle cx="160" cy="170" r="3.5" fill="none" stroke="#8A5530" strokeWidth="1.2" />
        {/* közlər */}
        <ellipse cx="100" cy="158" rx="34" ry="7" fill={lit ? '#FF9A3D' : '#B5481F'} opacity=".85" style={{ transition: 'fill .4s ease' }} />
      </svg>
      {lit && SPARKS.map((p, i) => (
        <span key={i} aria-hidden="true" style={{ position: 'absolute', left: `${p.x}%`, top: '42%', width: p.s, height: p.s, borderRadius: '50%', background: '#FFD27A', boxShadow: '0 0 6px #FF9A3D', '--dx': `${p.dx}px`, animation: `nb-spark ${p.dur}s ease-out ${p.d}s infinite` }} />
      ))}
    </div>
  )
}

/** Buta naxışı */
export function Buta({ size = 30, color = C.EMBER, style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 50" width={size} height={size * 1.25} style={{ display: 'block', overflow: 'visible', ...style }}>
      <path d="M22 4C34 10 38 26 32 38C26 48 10 48 6 38C2 28 10 20 18 22C24 24 24 32 18 32C14 32 14 28 16 27" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M22 4C18 8 17 12 19 16" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="20" cy="38" r="2" fill={color} />
    </svg>
  )
}

/** Buta ilə xətt */
export function ButaRule({ color = C.EMBER, width = 200, style }) {
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width, maxWidth: '100%', margin: '0 auto', ...style }}>
      <span style={{ flex: 1, height: 1.5, background: `linear-gradient(90deg, transparent, ${color})` }} />
      <Buta size={18} color={color} style={{ transform: 'scaleX(-1)' }} />
      <Buta size={18} color={color} />
      <span style={{ flex: 1, height: 1.5, background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  )
}

/** Çıraq (masa üçün) */
export function Lamp({ size = 180, children }) {
  return (
    <div style={{ position: 'relative', width: size, margin: '0 auto' }}>
      <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: -6, width: '44%', height: '30%', transform: 'translateX(-50%)', borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,194,61,.7), transparent)', animation: 'nb-glow 2.4s ease-in-out infinite alternate' }} />
      <svg aria-hidden="true" viewBox="0 0 180 120" width="100%" style={{ position: 'relative', display: 'block', overflow: 'visible' }}>
        <defs><linearGradient id="nb-brass" x1="0" x2="1"><stop offset="0" stopColor="#8E6420" /><stop offset=".45" stopColor="#F2CB72" /><stop offset="1" stopColor="#7A5418" /></linearGradient></defs>
        <path d="M90 22C96 30 98 36 90 42C82 36 84 30 90 22Z" fill="#FFC23D" style={{ transformOrigin: '90px 42px', transformBox: 'view-box', animation: 'nb-flick 1.2s ease-in-out infinite alternate' }} />
        <path d="M20 66C30 50 60 44 90 44C120 44 150 50 160 66C150 92 120 104 90 104C60 104 30 92 20 66Z" fill="url(#nb-brass)" />
        <path d="M160 66C172 60 178 54 176 46" fill="none" stroke="url(#nb-brass)" strokeWidth="6" strokeLinecap="round" />
        <path d="M20 66C10 70 4 80 12 88" fill="none" stroke="url(#nb-brass)" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="90" cy="112" rx="40" ry="6" fill="url(#nb-brass)" />
      </svg>
      {children && <div style={{ position: 'absolute', left: 0, right: 0, top: '46%', bottom: '14%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{children}</div>}
    </div>
  )
}
