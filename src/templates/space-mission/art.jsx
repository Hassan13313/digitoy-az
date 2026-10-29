/* ─────────────────────────────────────────────────────────────────────────────
   SPACE MISSION — illüstrasiyalar (SVG, yalnız görünüş)
   Retro raket, planetlər, buraxılış qülləsi, tüstü, radar, missiya nişanı,
   illuminator, kosmonavt dəbilqəsi. Hamısı aria-hidden.
   ───────────────────────────────────────────────────────────────────────── */
import { C, STARS } from './palette'

/* Ulduzlu səma */
export function Stars({ count = 60, opacity = 1 }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity, overflow: 'hidden' }}>
      {STARS.slice(0, count).map((p, i) => (
        <span key={i} style={{
          position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, borderRadius: '50%',
          background: p.c ? C.SUN : '#FFFFFF', boxShadow: p.s > 2.4 ? `0 0 6px ${p.c ? C.SUN : '#FFFFFF'}` : 'none',
          animation: `sm-twinkle ${2.5 + (i % 5)}s ease-in-out ${p.d}s infinite`,
        }} />
      ))}
    </div>
  )
}

/* Retro raket — viewBox mərkəzi x=0, burun y=-92, ucluq y=50 */
export function Rocket({ size = 120, flame = true, big = false, style }) {
  return (
    <svg viewBox="-44 -100 88 210" width={size} height={size * 2.39} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <defs>
        <linearGradient id="sm-body" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".55" stopColor="#F1EEFA" /><stop offset="1" stopColor="#C9C4E4" /></linearGradient>
        <linearGradient id="sm-nose" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFA766" /><stop offset=".6" stopColor={C.TANGERINE} /><stop offset="1" stopColor="#D9642A" /></linearGradient>
        <linearGradient id="sm-flame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF6C9" /><stop offset=".35" stopColor={C.SUN} /><stop offset=".75" stopColor={C.TANGERINE} /><stop offset="1" stopColor={C.TANGERINE} stopOpacity="0" /></linearGradient>
      </defs>
      {flame && (
        <g style={{ transformOrigin: '0px 50px', animation: `sm-flame ${big ? '.18s' : '.25s'} ease-in-out infinite alternate` }}>
          <path d={big ? 'M-15 50C-16 80 -8 112 0 150C8 112 16 80 15 50Z' : 'M-12 50C-12 70 -6 88 0 104C6 88 12 70 12 50Z'} fill="url(#sm-flame)" />
          <path d={big ? 'M-7 50C-7 72 -3 92 0 112C3 92 7 72 7 50Z' : 'M-6 50C-6 62 -3 74 0 82C3 74 6 62 6 50Z'} fill="#FFFBEA" opacity=".9" />
        </g>
      )}
      {/* qanadlar */}
      <path d="M-20 4C-30 14 -40 34 -40 54L-20 42Z" fill={C.TANGERINE} />
      <path d="M20 4C30 14 40 34 40 54L20 42Z" fill="#D9642A" />
      {/* ucluq */}
      <path d="M-13 40H13L17 52H-17Z" fill="#6E6A8E" />
      {/* gövdə */}
      <path d="M0 -92C18 -76 24 -40 22 0C21 18 20 32 18 42H-18C-20 32 -21 18 -22 0C-24 -40 -18 -76 0 -92Z" fill="url(#sm-body)" />
      {/* burun */}
      <path d="M0 -92C12 -82 18 -66 20 -52H-20C-18 -66 -12 -82 0 -92Z" fill="url(#sm-nose)" />
      <path d="M-20 -52H20" stroke="#B9B3D6" strokeWidth="1.2" />
      {/* zolaq */}
      <rect x="-22" y="14" width="44" height="7" fill={C.PINK} />
      {/* ön qanad */}
      <path d="M-3 18H3L4 58H-4Z" fill="#E0763A" />
      {/* illuminator */}
      <circle cy="-22" r="12.5" fill="#8A85AE" />
      <circle cy="-22" r="10" fill={C.SKY} />
      <circle cy="-22" r="10" fill="url(#sm-glass)" />
      <path d="M-6 -26A7 7 0 0 1 1 -30" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity=".85" />
      <defs><radialGradient id="sm-glass" cx="35%" cy="35%"><stop offset="0" stopColor="#D8ECFF" /><stop offset="1" stopColor="#3B5FBF" stopOpacity=".6" /></radialGradient></defs>
      {/* pərçimlər */}
      {[-6, 4, 30].map((y) => <circle key={y} cx="14" cy={y} r="1.1" fill="#B9B3D6" />)}
    </svg>
  )
}

/* Planet — istəyə görə halqa, zolaq, krater */
export function Planet({ size = 80, c1 = C.PINK, c2 = C.TANGERINE, ring = false, ringColor = C.SUN, bands = false, craters = false, tilt = -16, style, childStyle, children }) {
  const id = `sm-p-${c1.slice(1)}-${c2.slice(1)}-${String(tilt).replace('-', 'm')}`
  return (
    <div style={{ position: 'relative', width: size, height: size, ...style }}>
      <svg viewBox="-50 -50 100 100" width={size} height={size} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <radialGradient id={id} cx="34%" cy="30%" r="80%"><stop offset="0" stopColor={c1} /><stop offset="1" stopColor={c2} /></radialGradient>
          <clipPath id={`${id}-c`}><circle r="40" /></clipPath>
        </defs>
        {ring && <ellipse rx="68" ry="15" transform={`rotate(${tilt})`} fill="none" stroke={ringColor} strokeWidth="5" opacity=".9" />}
        {ring && <ellipse rx="61" ry="12.5" transform={`rotate(${tilt})`} fill="none" stroke={ringColor} strokeWidth="1.4" opacity=".45" />}
        <circle r="40" fill={`url(#${id})`} />
        {bands && (
          <g clipPath={`url(#${id}-c)`} opacity=".35">
            <path d="M-50 -14C-20 -20 20 -8 50 -16V-6C20 2 -20 -10 -50 -4Z" fill="#FFFFFF" />
            <path d="M-50 12C-20 6 20 18 50 10V18C20 26 -20 14 -50 20Z" fill="#000000" opacity=".5" />
          </g>
        )}
        {craters && (
          <g opacity=".35">
            <circle cx="-14" cy="-10" r="7" fill="#000000" opacity=".35" /><circle cx="16" cy="12" r="5" fill="#000000" opacity=".3" /><circle cx="6" cy="-22" r="3.5" fill="#000000" opacity=".3" />
          </g>
        )}
        <circle r="40" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity=".18" />
        <path d="M-26 -22A32 32 0 0 1 2 -36" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity=".35" />
        {ring && (
          <g clipPath={`url(#${id}-f)`}>
            <ellipse rx="68" ry="15" transform={`rotate(${tilt})`} fill="none" stroke={ringColor} strokeWidth="5" />
            <ellipse rx="61" ry="12.5" transform={`rotate(${tilt})`} fill="none" stroke={ringColor} strokeWidth="1.4" opacity=".6" />
          </g>
        )}
        <defs><clipPath id={`${id}-f`}><rect x="-80" y="0" width="160" height="60" transform={`rotate(${tilt})`} /></clipPath></defs>
      </svg>
      {children && <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', ...childStyle }}>{children}</div>}
    </div>
  )
}

/* Buraxılış qülləsi (qəfəs konstruksiya) */
export function Gantry({ height = 260, style }) {
  const rows = 9
  return (
    <svg viewBox={`0 0 60 ${height}`} width="60" height={height} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <path d={`M8 0V${height}M40 0V${height}`} stroke="#2A2F57" strokeWidth="4" />
      {Array.from({ length: rows }, (_, i) => {
        const y = (i * height) / rows
        const y2 = ((i + 1) * height) / rows
        return <path key={i} d={`M8 ${y}L40 ${y2}M40 ${y}L8 ${y2}M8 ${y}H40`} stroke="#2A2F57" strokeWidth="1.6" />
      })}
      <path d={`M40 ${height * 0.3}H60M40 ${height * 0.62}H60`} stroke="#2A2F57" strokeWidth="3" />
      <circle cx="24" cy="-4" r="3" fill={C.RED} style={{ animation: 'sm-blink 1.2s steps(2) infinite' }} />
    </svg>
  )
}

/* Tüstü buludu */
export function Smoke({ width = 240, style }) {
  return (
    <svg viewBox="0 0 240 90" width={width} height={width * 0.375} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      {[[40, 60, 34], [80, 50, 40], [120, 56, 46], [160, 50, 40], [200, 62, 34], [100, 30, 30], [140, 32, 30]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? '#F1EEF8' : '#FFFFFF'} opacity=".95" />
      ))}
    </svg>
  )
}

/* Radar şəbəkəsi (xəritənin üstündə) */
export function RadarGrid() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <svg viewBox="-50 -50 100 100" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {[16, 30, 44].map((r) => <circle key={r} r={r} fill="none" stroke={C.MINT} strokeWidth=".35" opacity=".7" />)}
        <path d="M-50 0H50M0 -50V50" stroke={C.MINT} strokeWidth=".3" opacity=".6" />
        {Array.from({ length: 36 }, (_, k) => {
          const a = (k / 36) * Math.PI * 2
          const r1 = k % 3 ? 47 : 45
          return <path key={k} d={`M${(Math.cos(a) * r1).toFixed(2)} ${(Math.sin(a) * r1).toFixed(2)}L${(Math.cos(a) * 49).toFixed(2)} ${(Math.sin(a) * 49).toFixed(2)}`} stroke={C.MINT} strokeWidth=".4" />
        })}
      </svg>
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `conic-gradient(from 0deg, ${C.MINT}55, transparent 22%, transparent)`, animation: 'sm-sweep 4s linear infinite', mixBlendMode: 'screen' }} />
    </span>
  )
}

/* Missiya nişanı — tikişli dairəvi emblem (masa nömrəsi üçün) */
export function MissionPatch({ size = 230, top = '', bottom = '', children }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg viewBox="-100 -100 200 200" width={size} height={size} aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <radialGradient id="sm-patch" cx="40%" cy="35%"><stop offset="0" stopColor={C.PURPLE} /><stop offset="1" stopColor={C.VIOLET} /></radialGradient>
          <path id="sm-arc-top" d="M-72 0A72 72 0 0 1 72 0" />
          <path id="sm-arc-bot" d="M-72 0A72 72 0 0 0 72 0" />
        </defs>
        <circle r="98" fill={C.SUN} />
        <circle r="98" fill="none" stroke="#C99418" strokeWidth="2" strokeDasharray="3 3" />
        <circle r="88" fill={C.DEEP} />
        <circle r="62" fill="url(#sm-patch)" />
        <circle r="62" fill="none" stroke={C.MINT} strokeWidth="1.5" strokeDasharray="2 3" />
        <text fontSize="13" letterSpacing="3" fill={C.SUN} fontFamily="'Exo 2', system-ui, sans-serif" fontWeight="700"><textPath href="#sm-arc-top" startOffset="50%" textAnchor="middle">{top}</textPath></text>
        <text fontSize="12" letterSpacing="3" fill={C.MINT} fontFamily="'Exo 2', system-ui, sans-serif" fontWeight="700" dy="10"><textPath href="#sm-arc-bot" startOffset="50%" textAnchor="middle">{bottom}</textPath></text>
        {[-1, 1].map((sx) => <path key={sx} d={`M${sx * 80} -6l3 6l-3 6l-3 -6z`} fill={C.SUN} />)}
      </svg>
      <div style={{ position: 'absolute', inset: '24%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{children}</div>
    </div>
  )
}

/* Kosmonavt dəbilqəsi — «cavab göndərildi» nişanı */
export function Helmet({ size = 40, style }) {
  return (
    <svg viewBox="-24 -24 48 48" width={size} height={size} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <circle r="20" fill="#F5F3FF" />
      <rect x="-15" y="-11" width="30" height="20" rx="10" fill="#2A3166" />
      <path d="M-9 -6A10 10 0 0 1 2 -9" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity=".7" />
      <rect x="-12" y="15" width="24" height="7" rx="3" fill={C.TANGERINE} />
      <circle cx="17" cy="-4" r="3" fill={C.SUN} />
    </svg>
  )
}

/* Ulduz nişanı — RSVP seçimi */
export function StarMark({ active, size = 18 }) {
  return (
    <svg viewBox="-10 -10 20 20" width={size} height={size} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      {active
        ? <path d="M0 -9L2.6 -2.8L9 -2.8L3.8 1.2L5.8 8L0 4L-5.8 8L-3.8 1.2L-9 -2.8L-2.6 -2.8Z" fill={C.SUN} />
        : <circle r="5.5" fill="none" stroke={C.MUTED} strokeWidth="1.4" opacity=".7" />}
    </svg>
  )
}

/* Orbit nişanı — bölmə başlığının üstündə */
export function OrbitIcon({ size = 44, color = C.SUN }) {
  return (
    <svg viewBox="-24 -14 48 28" width={size} height={size * 0.58} aria-hidden="true" style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}>
      <ellipse rx="22" ry="7" fill="none" stroke={color} strokeWidth="1.2" opacity=".7" transform="rotate(-12)" />
      <circle r="7" fill={color} />
      <circle cx="18" cy="-8" r="2.4" fill={C.MINT} style={{ animation: 'sm-twinkle 2s ease-in-out infinite' }} />
    </svg>
  )
}

/* Kometa izi */
export function Comet({ width = 120, style }) {
  return (
    <svg viewBox="0 0 120 30" width={width} height={width / 4} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <defs><linearGradient id="sm-comet" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFFFFF" stopOpacity="0" /><stop offset="1" stopColor="#FFFFFF" stopOpacity=".9" /></linearGradient></defs>
      <path d="M0 22L112 8" stroke="url(#sm-comet)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="112" cy="8" r="4" fill="#FFFFFF" />
    </svg>
  )
}
