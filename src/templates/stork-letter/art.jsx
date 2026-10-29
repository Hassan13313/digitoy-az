import { C, PERF } from './palette'

/* STORK LETTER — dekor */

/** Uçan leylək, dimdiyində bağlama */
export function Stork({ width = 200, flap = true, style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 120" width={width} style={{ display: 'block', overflow: 'visible', ...style }}>
      {/* ayaqlar */}
      <path d="M64 54L18 64M66 56L22 70" stroke={C.TERRA} strokeWidth="2.4" strokeLinecap="round" />
      {/* arxa qanad */}
      <g style={{ transformBox: 'fill-box', transformOrigin: '70% 100%', animation: flap ? 'sl-flap 1.4s ease-in-out infinite alternate' : 'none' }}>
        <path d="M96 44C92 28 98 12 118 2C110 14 108 24 108 36Z" fill="#E9E4DA" stroke={C.INK} strokeWidth="1.2" />
        <path d="M118 2C110 14 108 24 108 36L102 30C104 18 110 8 118 2Z" fill={C.INK} />
      </g>
      {/* gövdə */}
      <ellipse cx="90" cy="50" rx="34" ry="13" fill="#FFFFFF" stroke={C.INK} strokeWidth="1.3" />
      <path d="M58 50C50 52 46 56 44 60C52 58 58 56 62 54Z" fill={C.INK} />
      {/* boyun və baş */}
      <path d="M118 46C128 44 138 40 146 36" fill="none" stroke={C.INK} strokeWidth="10" strokeLinecap="round" />
      <path d="M118 46C128 44 138 40 146 36" fill="none" stroke="#FFFFFF" strokeWidth="7.4" strokeLinecap="round" />
      <circle cx="150" cy="34" r="6.4" fill="#FFFFFF" stroke={C.INK} strokeWidth="1.3" />
      <circle cx="152" cy="32.5" r="1.3" fill={C.INK} />
      <path d="M155 32L186 38L155 37Z" fill={C.TERRA} stroke="#A0613F" strokeWidth=".8" strokeLinejoin="round" />
      {/* ön qanad */}
      <g style={{ transformBox: 'fill-box', transformOrigin: '60% 100%', animation: flap ? 'sl-flap 1.4s ease-in-out .1s infinite alternate' : 'none' }}>
        <path d="M80 46C70 24 58 10 34 4C54 12 66 22 74 34C76 22 84 10 100 4C92 16 90 30 92 46Z" fill="#FFFFFF" stroke={C.INK} strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M34 4C46 8 56 14 62 20L56 24C50 16 42 10 34 4Z" fill={C.INK} />
        <path d="M100 4C94 12 92 18 90 26L86 22C88 14 94 8 100 4Z" fill={C.INK} />
      </g>
      {/* bağlama */}
      <path d="M182 38C180 46 178 52 177 60" stroke={C.SEPIA} strokeWidth="1.2" fill="none" />
      <path d="M164 72C164 62 170 58 177 58C184 58 190 62 190 72C190 84 184 90 177 90C170 90 164 84 164 72Z" fill={C.DUSTY_L} stroke={C.DUSTY_D} strokeWidth="1.2" />
      <path d="M170 60L177 54L184 60" fill={C.DUSTY_L} stroke={C.DUSTY_D} strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="177" cy="58" r="2.4" fill={C.DUSTY_D} />
      <path d="M168 74C172 76 182 76 186 74" stroke={C.DUSTY} strokeWidth="1" fill="none" strokeDasharray="2 2" />
    </svg>
  )
}

/** Poçt markası (perforasiyalı) */
export function Stamp({ width = 90, color = C.DUSTY, children, style, rotate = 0 }) {
  return (
    <div style={{ display: 'inline-block', filter: 'drop-shadow(0 6px 8px rgba(62,58,54,.22))', transform: `rotate(${rotate}deg)`, ...style }}>
      <div style={{ width, padding: 7, background: '#FFFDF8', ...PERF }}>
        <div style={{ position: 'relative', aspectRatio: '4 / 5', background: color, boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.55)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

/** Poçt ştampı (dairəvi) */
export function Postmark({ size = 96, top = '', bottom = '', mid = '', color = C.SEAL, font, waves = false, style }) {
  return (
    <div aria-hidden="true" style={{ position: 'relative', width: size, height: size, borderRadius: '50%', border: `2px solid ${color}`, color, opacity: 0.75, ...style }}>
      <div style={{ position: 'absolute', inset: 6, borderRadius: '50%', border: `1px solid ${color}` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: '22%', textAlign: 'center', fontFamily: font, fontSize: size * 0.11, letterSpacing: '.08em', textTransform: 'uppercase' }}>{top}</div>
      <div style={{ position: 'absolute', left: '10%', right: '10%', top: '42%', borderTop: `1px solid ${color}`, borderBottom: `1px solid ${color}`, padding: '2px 0', textAlign: 'center', fontFamily: font, fontSize: size * 0.12, fontWeight: 700 }}>{mid}</div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: '20%', textAlign: 'center', fontFamily: font, fontSize: size * 0.11, letterSpacing: '.08em' }}>{bottom}</div>
      {waves && (
        <svg viewBox="0 0 60 20" width={size * 0.9} style={{ position: 'absolute', left: '80%', top: '34%' }}>
          {[4, 10, 16].map((y) => <path key={y} d={`M0 ${y}Q15 ${y - 4} 30 ${y}T60 ${y}`} fill="none" stroke={color} strokeWidth="1.4" />)}
        </svg>
      )}
    </div>
  )
}

/** Mum möhür */
export function WaxSeal({ size = 64, cracked = false, initial = '', font, style }) {
  return (
    <div aria-hidden="true" style={{ position: 'relative', width: size, height: size, ...style }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '46% 54% 50% 50% / 52% 48% 52% 48%', background: `radial-gradient(circle at 38% 32%, #D2715F, ${C.SEAL} 55%, ${C.SEAL_D})`, boxShadow: '0 4px 8px rgba(62,58,54,.35), inset 0 -3px 6px rgba(0,0,0,.25)', transform: cracked ? 'scale(1.15) rotate(-14deg)' : 'none', opacity: cracked ? 0 : 1, transition: 'transform .45s ease, opacity .35s ease .15s' }}>
        <div style={{ position: 'absolute', inset: '16%', borderRadius: '50%', boxShadow: 'inset 0 0 0 2px rgba(255,220,200,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font, fontSize: size * 0.36, color: 'rgba(255,230,215,.85)' }}>{initial}</div>
      </div>
    </div>
  )
}
