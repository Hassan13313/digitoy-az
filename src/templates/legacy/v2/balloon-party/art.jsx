/* ─────────────────────────────────────────────────────────────────────────────
   BALLOON PARTY — illüstrasiyalar (SVG, yalnız görünüş)
   Parlaq şarlar (adi və folqa), şar girləndi, konfetti fonu, konfet
   bankası, saqqız avtomatı, şam. Hamısı aria-hidden.
   ───────────────────────────────────────────────────────────────────────── */
import { C as PAL, DOTS } from './palette'
import { usePalette } from '../../../_shared/palette'

const BALLOON = 'M0 -36C18 -36 28 -20 28 -4C28 16 12 30 2 33L4.5 38H-4.5L-2 33C-12 30 -28 16 -28 -4C-28 -20 -18 -36 0 -36Z'

function shade(hex, k) {
  const h = hex.replace('#', '')
  const n = parseInt(h, 16)
  const f = (v) => Math.max(0, Math.min(255, Math.round(v * k)))
  return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`
}

/** Bir şar: `color` — hex, 'gold' və ya 'rose' (folqa) */
export function Balloon($p) {
  const C = usePalette(PAL)
  const { size = 60, color = C.PINK, string = 60, stringBend = 6, style, id } = $p
  const key = id || `bp-b-${String(color).replace('#', '')}`
  const foil = color === 'gold' || color === 'rose'
  const stops = color === 'gold'
    ? ['#FFF4D6', '#F2CF7E', '#C9913A', '#B9822F']
    : color === 'rose'
      ? ['#FFE9E3', '#F3B9AA', '#C9786A', '#B5685C']
      : ['#FFFFFF', color, shade(color, 0.86), shade(color, 0.7)]
  return (
    <svg viewBox={`-30 -40 60 ${80 + string}`} width={size} height={size * ((80 + string) / 60)} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <defs>
        <radialGradient id={key} cx="35%" cy="28%" r="78%">
          <stop offset="0" stopColor={stops[0]} stopOpacity={foil ? 1 : 0.95} />
          <stop offset=".28" stopColor={stops[1]} />
          <stop offset=".75" stopColor={stops[2]} />
          <stop offset="1" stopColor={stops[3]} />
        </radialGradient>
      </defs>
      <path d={`M0 38C${stringBend} ${38 + string * 0.35} ${-stringBend} ${38 + string * 0.7} 0 ${38 + string}`} fill="none" stroke={foil ? C.GOLD_D : 'rgba(74,48,70,.45)'} strokeWidth="1" />
      <path d={BALLOON} fill={`url(#${key})`} />
      <ellipse cx="-10" cy="-19" rx="6" ry="10" transform="rotate(28 -10 -19)" fill="#FFFFFF" opacity={foil ? 0.75 : 0.55} />
      <circle cx="-15" cy="-6" r="2" fill="#FFFFFF" opacity=".5" />
    </svg>
  )
}

/** Fon konfettisi */
export function Confetti({ opacity = 0.6, count = 26 }) {
  const C = usePalette(PAL)
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity, overflow: 'hidden' }}>
      {DOTS(C).slice(0, count).map((d, i) => (
        <span key={i} style={{ position: 'absolute', left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.sq ? d.s * 0.5 : d.s, borderRadius: d.sq ? 2 : '50%', background: d.c, transform: `rotate(${d.rot}deg)` }} />
      ))}
    </div>
  )
}

/** Şar girləndi — üst kənar boyu (orqanik qövs) */
const GARLAND = (() => {
  const cols = ['#EF8FA8', '#BDE8D7', '#FFE495', '#D6C5F3', '#F6C3CF', '#BFDCF6', 'gold']
  const out = []
  for (let i = 0; i < 24; i++) {
    const t = i / 23
    const x = -10 + t * 420
    const y = 34 + Math.sin(t * Math.PI) * 26 + ((i * 37) % 17) - 8
    const r = 16 + ((i * 53) % 13)
    out.push({ x, y, r, c: cols[(i * 5) % cols.length] })
  }
  return out
})()
export function Garland({ style }) {
  return (
    <svg viewBox="0 0 400 110" preserveAspectRatio="xMidYMin slice" width="100%" height="110" aria-hidden="true" style={{ display: 'block', ...style }}>
      <defs>
        {['EF8FA8', 'BDE8D7', 'FFE495', 'D6C5F3', 'F6C3CF', 'BFDCF6'].map((h) => (
          <radialGradient key={h} id={`bp-g-${h}`} cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".3" stopColor={`#${h}`} /><stop offset="1" stopColor={shade(`#${h}`, 0.78)} /></radialGradient>
        ))}
        <radialGradient id="bp-g-gold" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#FFF4D6" /><stop offset=".3" stopColor="#F2CF7E" /><stop offset="1" stopColor="#B9822F" /></radialGradient>
      </defs>
      {GARLAND.map((b, i) => (
        <g key={i}>
          <circle cx={b.x.toFixed(1)} cy={b.y.toFixed(1)} r={b.r} fill={`url(#bp-g-${b.c === 'gold' ? 'gold' : b.c.slice(1)})`} />
          <ellipse cx={(b.x - b.r * 0.35).toFixed(1)} cy={(b.y - b.r * 0.4).toFixed(1)} rx={b.r * 0.22} ry={b.r * 0.32} transform={`rotate(30 ${(b.x - b.r * 0.35).toFixed(1)} ${(b.y - b.r * 0.4).toFixed(1)})`} fill="#FFFFFF" opacity=".55" />
        </g>
      ))}
      {[[60, 72], [150, 84], [250, 86], [340, 72]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y}l6 -3l0 6z M${x} ${y}l-6 -3l0 6z`} fill="#FFFFFF" opacity=".7" />
      ))}
    </svg>
  )
}

/** Konfet bankası — sayğac (ortada etiket) */
export function CandyJar($p) {
  const C = usePalette(PAL)
  const { candies = ['#EF8FA8', C.MINT_D, '#FFE495'], lid = C.PINK_D, children } = $p
  const dots = []
  for (let i = 0; i < 26; i++) {
    const row = Math.floor(i / 6)
    const col = i % 6
    dots.push({ x: 14 + col * 10 + (row % 2) * 5, y: 92 - row * 9, c: candies[i % candies.length] })
  }
  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox="0 0 80 104" width="100%" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
        <ellipse cx="40" cy="101" rx="34" ry="4" fill="#000" opacity=".08" />
        <rect x="18" y="4" width="44" height="12" rx="4" fill={lid} />
        <rect x="14" y="13" width="52" height="7" rx="3" fill={shade(lid.startsWith('#') ? lid : C.PINK_D, 0.85)} />
        <path d="M14 22C6 30 6 44 6 56V90C6 98 12 100 18 100H62C68 100 74 98 74 90V56C74 44 74 30 66 22Z" fill="rgba(255,255,255,.55)" stroke="rgba(74,48,70,.18)" strokeWidth="1.2" />
        {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r="4.6" fill={d.c} />)}
        <path d="M14 30C10 40 10 56 10 70" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity=".7" fill="none" />
      </svg>
      <div style={{ position: 'absolute', left: '16%', right: '16%', top: '38%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>{children}</div>
    </div>
  )
}

/** Saqqız avtomatı — masa nömrəsi saqqız topunda düşür */
export function GumballMachine({ width = 200, children }) {
  const C = usePalette(PAL)
  const balls = [[-26, -10, '#EF8FA8'], [-8, -22, '#FFE495'], [12, -14, C.MINT_D], [28, -2, '#D6C5F3'], [-18, 10, '#BFDCF6'], [4, 4, '#F6C3CF'], [22, 18, '#EF8FA8'], [-30, 18, '#FFE495'], [-4, 22, '#D6C5F3'], [10, -32, '#BFDCF6'], [-24, -30, C.MINT_D]]
  return (
    <div style={{ position: 'relative', width, margin: '0 auto' }}>
      <svg viewBox="-60 -70 120 170" width={width} height={width * 1.42} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <radialGradient id="bp-globe" cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#FFFFFF" stopOpacity=".9" /><stop offset=".5" stopColor="#FFFFFF" stopOpacity=".35" /><stop offset="1" stopColor="#E7DFF2" stopOpacity=".55" /></radialGradient>
        </defs>
        <rect x="-8" y="-66" width="16" height="8" rx="3" fill={C.PINK_D} />
        <circle cx="0" cy="-4" r="50" fill="#FFFFFF" opacity=".3" />
        {balls.map(([x, y, c], i) => (
          <g key={i}><circle cx={x} cy={y} r="11" fill={c} /><circle cx={x - 3.5} cy={y - 4} r="3" fill="#FFFFFF" opacity=".6" /></g>
        ))}
        <circle cx="0" cy="-4" r="50" fill="url(#bp-globe)" stroke="rgba(74,48,70,.2)" strokeWidth="1.2" />
        <path d="M-30 -30C-24 -40 -12 -46 0 -47" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity=".8" fill="none" />
        <path d="M-34 44H34L42 96H-42Z" fill={C.PINK_D} />
        <path d="M-34 44H34L36 54H-36Z" fill="#B24A6C" />
        <circle cx="0" cy="66" r="10" fill={C.CREAM} stroke="#B24A6C" strokeWidth="2" />
        <path d="M-5 66H5" stroke="#B24A6C" strokeWidth="3" strokeLinecap="round" />
        <path d="M14 76H30V90H14Z" fill="#8E3756" />
      </svg>
      {children}
    </div>
  )
}

/** Şam (proqram tortunun üstündə) */
export function Candle($p) {
  const C = usePalette(PAL)
  const { color = C.MINT_D, h = 30 } = $p
  return (
    <svg viewBox={`-8 -22 16 ${h + 24}`} width="14" height={(h + 24) * 0.875} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <path d="M0 -20C4 -14 5 -8 0 -4C-5 -8 -4 -14 0 -20Z" fill="#FFB347" style={{ transformOrigin: '0px -4px', animation: 'bp-flame .4s ease-in-out infinite alternate' }} />
      <path d="M0 -14C2 -11 2 -8 0 -6C-2 -8 -2 -11 0 -14Z" fill="#FFF3B0" />
      <rect x="-4" y="0" width="8" height={h} rx="2" fill={color} />
      <path d={`M-4 6L4 2M-4 14L4 10M-4 22L4 18`} stroke="#FFFFFF" strokeWidth="1.6" opacity=".7" />
    </svg>
  )
}
