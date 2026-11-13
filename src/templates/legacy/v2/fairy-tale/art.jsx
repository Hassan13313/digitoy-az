/* ─────────────────────────────────────────────────────────────────────────────
   FAIRY TALE — illüstrasiyalar (SVG, yalnız görünüş)
   Nağıl qəsri, ay, sehrli ulduzlar, tac, çubuq, güzgü çərçivəsi, kompas.
   Hamısı aria-hidden, təsadüfi dəyərlər modul səviyyəsində toxumla
   hesablanır (render təmiz qalır).
   ───────────────────────────────────────────────────────────────────────── */

import { C as PAL, seeded } from './palette'
import { usePalette } from '../../../_shared/palette'

/* Dörd şüalı sehrli ulduz */
export function Sparkle($p) {
  const C = usePalette(PAL)
  const { size = 14, color = C.GOLD_L, style, className } = $p
  return (
    <svg viewBox="-10 -10 20 20" width={size} height={size} aria-hidden="true" className={className} style={{ display: 'block', overflow: 'visible', ...style }}>
      <path d="M0 -10C1 -3 3 -1 10 0C3 1 1 3 0 10C-1 3 -3 1 -10 0C-3 -1 -1 -3 0 -10Z" fill={color} />
    </svg>
  )
}

/* Ulduzlu səma — sabit mövqelər */
const SKY = (() => {
  const r = seeded(7)
  return Array.from({ length: 34 }, () => ({ x: r() * 100, y: r() * 100, s: 3 + r() * 9, d: (r() * 4).toFixed(2), sp: r() > 0.72 }))
})()
export function StarField($p) {
  const C = usePalette(PAL)
  const { opacity = 1, color = C.GOLD_L, count = 34 } = $p
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity }}>
      {SKY.slice(0, count).map((p, i) => (
        p.sp
          ? <Sparkle key={i} size={p.s + 4} color={color} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, animation: `ft-twinkle ${3 + (i % 4)}s ease-in-out ${p.d}s infinite` }} />
          : <span key={i} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: p.s / 4, height: p.s / 4, borderRadius: '50%', background: color, animation: `ft-twinkle ${2.5 + (i % 5)}s ease-in-out ${p.d}s infinite` }} />
      ))}
    </div>
  )
}

export function Moon({ size = 60, style }) {
  return (
    <svg viewBox="-30 -30 60 60" width={size} height={size} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <defs>
        <radialGradient id="ft-moon" cx="38%" cy="40%" r="70%"><stop offset="0" stopColor="#FFFBEA" /><stop offset="1" stopColor="#EED39A" /></radialGradient>
        <radialGradient id="ft-moonglow"><stop offset=".55" stopColor="#FFF3C9" stopOpacity=".28" /><stop offset="1" stopColor="#FFF3C9" stopOpacity="0" /></radialGradient>
      </defs>
      <circle r="30" fill="url(#ft-moonglow)" />
      {/* aypara: böyük dairədən sağa sürüşmüş dairə çıxılır */}
      <path d="M-2 -21A21 21 0 1 0 14 15A17 17 0 1 1 -2 -21Z" fill="url(#ft-moon)" />
      <circle cx="-10" cy="-2" r="2.4" fill="#DDBF7C" opacity=".5" />
      <circle cx="-5" cy="10" r="1.6" fill="#DDBF7C" opacity=".45" />
    </svg>
  )
}

/* Yumşaq bulud */
export function Cloud({ width = 120, style, opacity = 0.9 }) {
  return (
    <svg viewBox="0 0 120 50" width={width} height={width * 0.42} aria-hidden="true" style={{ display: 'block', overflow: 'visible', opacity, ...style }}>
      <path d="M14 44C4 44 2 32 12 29C10 18 24 12 32 19C36 7 56 4 64 16C72 8 90 12 90 24C102 22 112 32 106 40C104 43 100 44 96 44Z" fill="#FFFFFF" opacity=".75" />
      <path d="M20 44C14 44 12 38 18 36C18 30 26 28 30 32C36 24 50 24 54 32C60 28 70 30 70 37C78 36 82 42 78 44Z" fill="#F4ECFA" />
    </svg>
  )
}

/* Dəyirmi bağ ağacı (topiar) */
export function Topiary({ size = 44, style, tone = '#6F8F6C' }) {
  const C = usePalette(PAL)
  return (
    <svg viewBox="0 0 40 56" width={size} height={size * 1.4} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <rect x="18" y="34" width="4" height="16" fill="#8A6A4A" />
      <circle cx="20" cy="22" r="16" fill={tone} />
      <circle cx="14" cy="16" r="6" fill="#FFFFFF" opacity=".14" />
      {[[10, 26], [27, 14], [24, 30], [15, 10]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2" fill={i % 2 ? '#F4C9D4' : '#FFF3C9'} />)}
      <path d="M12 50h16l-2 6h-12z" fill={C.ROSE_D} />
    </svg>
  )
}

/* ── Nağıl qəsri ──────────────────────────────────────────────────────────── */
function Tower($p) {
  const C = usePalette(PAL)
  const { x, w, top, base = 250, roofH, roof = C.VIOLET, wall = 'url(#ft-wall)', flag = C.ROSE, win = 2, flagDelay = 0, lit } = $p
  const cx = x + w / 2
  const apex = top - roofH
  const winW = Math.max(5, w * 0.22)
  const rows = []
  for (let k = 0; k < win; k++) {
    const wy = top + 16 + k * 34
    if (wy + 16 > base - 8) break
    rows.push(
      <path key={k} d={`M${cx - winW / 2} ${wy + 16}V${wy + winW / 2}A${winW / 2} ${winW / 2} 0 0 1 ${cx + winW / 2} ${wy + winW / 2}V${wy + 16}Z`}
        fill={lit ? '#FFD98A' : '#5B4E86'} style={lit ? { animation: `ft-glow ${3 + k}s ease-in-out ${k * 0.7}s infinite` } : undefined} />
    )
  }
  return (
    <g>
      <rect x={x} y={top} width={w} height={base - top} fill={wall} />
      <rect x={x + w * 0.62} y={top} width={w * 0.38} height={base - top} fill="#7C68B4" opacity=".14" />
      {rows}
      <rect x={x - 3} y={top - 3} width={w + 6} height={5} rx="1.5" fill="#4A3C80" />
      <path d={`M${x - 5} ${top - 2}Q${cx - w * 0.2} ${top - roofH * 0.45} ${cx} ${apex}Q${cx + w * 0.2} ${top - roofH * 0.45} ${x + w + 5} ${top - 2}Z`} fill={roof} />
      <path d={`M${x - 5} ${top - 2}Q${cx - w * 0.2} ${top - roofH * 0.45} ${cx} ${apex}L${cx} ${top - 2}Z`} fill="#FFFFFF" opacity=".18" />
      <path d={`M${cx} ${apex}v-12`} stroke={C.GOLD_D} strokeWidth="1.4" />
      <path d={`M${cx} ${apex - 12}l11 3.2l-11 3.2z`} fill={flag} style={{ transformOrigin: `${cx}px ${apex - 9}px`, animation: `ft-flag 2.4s ease-in-out ${flagDelay}s infinite` }} />
      <circle cx={cx} cy={apex} r="1.8" fill={C.GOLD} />
    </g>
  )
}

/** Qəsr: viewBox 0 0 320 260, alt xətt y=250 */
export function Castle({ width = 300, lit = true, style }) {
  const C = usePalette(PAL)
  return (
    <svg viewBox="0 0 320 262" width={width} height={width * 0.82} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <defs>
        <linearGradient id="ft-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FBF6FE" /><stop offset="1" stopColor="#DCCDEE" /></linearGradient>
        <linearGradient id="ft-wall2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E8DDF4" /><stop offset="1" stopColor="#C6B4E0" /></linearGradient>
      </defs>
      {/* arxa qüllələr */}
      <Tower x={58} w={26} top={98} roofH={56} roof="#8E7CC6" wall="url(#ft-wall2)" flag={C.GOLD} win={1} flagDelay={0.4} lit={lit} />
      <Tower x={238} w={26} top={88} roofH={60} roof="#8E7CC6" wall="url(#ft-wall2)" flag={C.GOLD} win={1} flagDelay={1.1} lit={lit} />
      {/* əsas bina */}
      <rect x="104" y="136" width="112" height="114" fill="url(#ft-wall)" />
      <rect x="182" y="136" width="34" height="114" fill="#7C68B4" opacity=".12" />
      <path d="M104 136h112" stroke="#4A3C80" strokeWidth="4" />
      {Array.from({ length: 7 }, (_, k) => <rect key={k} x={106 + k * 16} y="127" width="9" height="9" fill="url(#ft-wall)" />)}
      {/* mərkəzi hündür qüllə */}
      <Tower x={142} w={36} top={70} roofH={74} roof={C.VIOLET} flag={C.ROSE} win={2} flagDelay={0} lit={lit} />
      {/* ön yan qüllələr */}
      <Tower x={80} w={34} top={122} roofH={58} roof="#7B66B8" flag={C.ROSE} win={3} flagDelay={0.8} lit={lit} />
      <Tower x={206} w={34} top={112} roofH={62} roof="#7B66B8" flag={C.ROSE} win={3} flagDelay={1.5} lit={lit} />
      {/* darvaza */}
      <path d="M144 250V214A16 16 0 0 1 176 214V250Z" fill="#3B2F66" />
      <path d="M144 250V214A16 16 0 0 1 176 214V250" fill="none" stroke={C.GOLD} strokeWidth="2" />
      {[150, 156, 162, 168].map((x) => <path key={x} d={`M${x + 1} 206V250`} stroke="#6E5CA6" strokeWidth="1.2" />)}
      {[218, 230, 242].map((y) => <path key={y} d={`M145 ${y}H175`} stroke="#6E5CA6" strokeWidth="1.2" />)}
      {/* pəncərələr — əsas bina */}
      {[118, 196].map((x) => (
        <path key={x} d={`M${x} 196V178A6 6 0 0 1 ${x + 12} 178V196Z`} fill={lit ? '#FFD98A' : '#5B4E86'} style={lit ? { animation: 'ft-glow 4s ease-in-out .5s infinite' } : undefined} />
      ))}
      <circle cx="160" cy="160" r="9" fill="none" stroke={C.GOLD} strokeWidth="1.6" />
      <path d="M160 152v16M152 160h16M154.5 154.5l11 11M165.5 154.5l-11 11" stroke={C.GOLD} strokeWidth="1" />
      {/* pilləkən */}
      <path d="M138 250h44v4h-44zM132 254h56v4h-56z" fill="#CDBDE6" />
    </svg>
  )
}

/* Təpə + cığır (qəsrin altında) */
export function Hill({ style }) {
  const C = usePalette(PAL)
  return (
    <svg viewBox="0 0 400 120" preserveAspectRatio="none" width="100%" height="100%" aria-hidden="true" style={{ display: 'block', ...style }}>
      <defs>
        <linearGradient id="ft-hill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#A9BF9F" /><stop offset="1" stopColor="#7E9C79" /></linearGradient>
        <linearGradient id="ft-hill2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C4D3B8" /><stop offset="1" stopColor="#9BB59A" /></linearGradient>
      </defs>
      <path d="M0 52C60 30 110 40 170 26C230 12 300 30 400 18V120H0Z" fill="url(#ft-hill2)" />
      <path d="M0 74C70 56 130 66 200 50C270 36 330 54 400 46V120H0Z" fill="url(#ft-hill)" />
      <path d="M200 50C190 70 220 82 196 120" fill="none" stroke="#F3E7D1" strokeWidth="9" strokeLinecap="round" opacity=".8" />
      {[[40, 80], [80, 92], [330, 76], [362, 92], [120, 100], [280, 98]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r="3.2" fill={i % 2 ? '#F4C9D4' : '#FFF3C9'} />
          <circle r="1.2" fill={C.GOLD} />
        </g>
      ))}
    </svg>
  )
}

/* Kiçik tac */
export function Crown($p) {
  const C = usePalette(PAL)
  const { size = 34, color = C.GOLD, style } = $p
  return (
    <svg viewBox="0 0 40 30" width={size} height={size * 0.75} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <path d="M4 24L2 8L12 16L20 3L28 16L38 8L36 24Z" fill={color} />
      <path d="M4 24h32v4H4z" fill={color} opacity=".85" />
      <circle cx="20" cy="3" r="2.6" fill={C.ROSE} />
      <circle cx="2" cy="8" r="2" fill={C.ROSE} /><circle cx="38" cy="8" r="2" fill={C.ROSE} />
      <path d="M8 22L7 13" stroke="#FFF3C9" strokeWidth="1.2" opacity=".6" />
    </svg>
  )
}

/* Sehrli çubuq — RSVP seçim nişanı */
export function Wand({ size = 18, active }) {
  const C = usePalette(PAL)
  return (
    <svg viewBox="-10 -10 20 20" width={size} height={size} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      {active ? (
        <>
          <path d="M-7 8L2 -1" stroke={C.VIOLET} strokeWidth="2" strokeLinecap="round" />
          <path d="M4 -9C4.6 -5.4 5.6 -4.4 9 -3.8C5.6 -3.2 4.6 -2.2 4 1.4C3.4 -2.2 2.4 -3.2 -1 -3.8C2.4 -4.4 3.4 -5.4 4 -9Z" fill={C.GOLD} />
        </>
      ) : (
        <circle r="5.5" fill="none" stroke={C.LILAC} strokeWidth="1.4" />
      )}
    </svg>
  )
}

/* Qızıl naxışlı ayırıcı */
export function Flourish($p) {
  const C = usePalette(PAL)
  const { width = 150, color = C.GOLD, style } = $p
  return (
    <svg viewBox="0 0 150 20" width={width} height={width * 0.133} aria-hidden="true" style={{ display: 'block', margin: '0 auto', overflow: 'visible', ...style }}>
      <path d="M75 10C64 2 52 2 46 8C42 12 46 17 50 14C53 12 51 8 47 9M75 10C86 2 98 2 104 8C108 12 104 17 100 14C97 12 99 8 103 9" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M2 10H40M110 10H148" stroke={color} strokeWidth=".8" opacity=".6" />
      <path d="M75 4L78 10L75 16L72 10Z" fill={color} />
    </svg>
  )
}

/* Kitab üz qabığının künc naxışı (sol yuxarı; digərləri çevrilərək) */
export function CornerFiligree({ size = 54, style }) {
  const C = usePalette(PAL)
  return (
    <svg viewBox="0 0 54 54" width={size} height={size} aria-hidden="true" style={{ position: 'absolute', overflow: 'visible', ...style }}>
      <path d="M4 50V12C4 7 7 4 12 4H50" fill="none" stroke={C.GOLD} strokeWidth="1.4" />
      <path d="M10 44V18C10 13 13 10 18 10H44" fill="none" stroke={C.GOLD} strokeWidth=".8" opacity=".7" />
      <path d="M14 14C20 14 22 18 20 22C18 25 14 23 15 20M14 14C14 20 18 22 22 20C25 18 23 14 20 15" fill="none" stroke={C.GOLD_L} strokeWidth="1" />
      <circle cx="14" cy="14" r="2" fill={C.GOLD_L} />
    </svg>
  )
}

/* Güzgü çərçivəsi (oval, qıvrımlı) — 240×300 */
export function MirrorFrame({ width = 230, children }) {
  const C = usePalette(PAL)
  const h = width * 1.26
  return (
    <div style={{ position: 'relative', width, height: h, margin: '0 auto' }}>
      <svg viewBox="0 0 240 302" width={width} height={h} aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <linearGradient id="ft-mframe" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F1DA9C" /><stop offset=".45" stopColor={C.GOLD} /><stop offset=".7" stopColor="#F6E3B0" /><stop offset="1" stopColor="#9C7A3A" /></linearGradient>
          <radialGradient id="ft-glass" cx="42%" cy="36%" r="70%"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".45" stopColor="#ECE5F7" /><stop offset="1" stopColor="#B7A3D9" /></radialGradient>
        </defs>
        <ellipse cx="120" cy="150" rx="104" ry="132" fill="url(#ft-mframe)" />
        <ellipse cx="120" cy="150" rx="92" ry="120" fill="#8A6A30" opacity=".35" />
        <ellipse cx="120" cy="150" rx="88" ry="116" fill="url(#ft-glass)" />
        <path d="M58 92C70 64 96 50 118 48" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity=".55" />
        <path d="M120 2C110 10 108 20 120 24C132 20 130 10 120 2Z" fill="url(#ft-mframe)" />
        <circle cx="120" cy="14" r="4" fill={C.ROSE} />
        <path d="M120 298C108 290 106 280 120 276C134 280 132 290 120 298Z" fill="url(#ft-mframe)" />
        {[[-1, 1], [1, 1]].map(([sx], i) => (
          <g key={i} transform={`translate(${sx < 0 ? 18 : 222} 150) scale(${sx} 1)`}>
            <path d="M0 -26C-14 -18 -14 0 0 4C-10 8 -10 22 0 28" fill="none" stroke="url(#ft-mframe)" strokeWidth="5" strokeLinecap="round" />
          </g>
        ))}
      </svg>
      <div style={{ position: 'absolute', left: '17%', right: '17%', top: '16%', bottom: '16%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        {children}
      </div>
    </div>
  )
}

/* Kompas gülü — xəritənin küncü */
export function Compass({ size = 64, style }) {
  const C = usePalette(PAL)
  return (
    <svg viewBox="-32 -32 64 64" width={size} height={size} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <circle r="27" fill={C.CREAM} stroke={C.GOLD_D} strokeWidth="1" />
      <circle r="21" fill="none" stroke={C.GOLD} strokeWidth=".6" strokeDasharray="2 3" />
      <path d="M0 -25L4 -4L0 0L-4 -4Z" fill={C.VIOLET} /><path d="M0 25L4 4L0 0L-4 4Z" fill={C.GOLD} />
      <path d="M-25 0L-4 -4L0 0L-4 4Z" fill={C.GOLD} /><path d="M25 0L4 -4L0 0L4 4Z" fill={C.VIOLET} />
      <circle r="2.4" fill={C.CREAM} stroke={C.GOLD_D} />
      <text y="-28" textAnchor="middle" fontSize="8" fill={C.VIOLET} fontFamily="Georgia, serif">N</text>
    </svg>
  )
}

/* Fəsil vinyetləri — proqram sətirlərinin solunda (sıra ilə dəyişir) */
export function Vignette({ kind = 0, size = 38 }) {
  const C = usePalette(PAL)
  const k = kind % 6
  return (
    <svg viewBox="-20 -20 40 40" width={size} height={size} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <circle r="18" fill={C.CREAM} stroke={C.GOLD} strokeWidth="1.2" />
      <circle r="14.5" fill="none" stroke={C.GOLD} strokeWidth=".5" strokeDasharray="1.5 2.5" />
      {k === 0 && <path d="M-9 6L-10 -5L-4 0L0 -9L4 0L10 -5L9 6Z" fill={C.VIOLET} />}
      {k === 1 && <path d="M0 -10C1 -3 3 -1 10 0C3 1 1 3 0 10C-1 3 -3 1 -10 0C-3 -1 -1 -3 0 -10Z" fill={C.GOLD} />}
      {k === 2 && <g><rect x="-9" y="-1" width="18" height="9" rx="2" fill={C.ROSE} /><rect x="-6" y="-7" width="12" height="7" rx="2" fill="#F4D7DF" /><path d="M0 -7v-4" stroke={C.GOLD_D} strokeWidth="1.2" /><path d="M0 -14c1.5 1.5 1.5 3 0 3.4c-1.5-.4-1.5-1.9 0-3.4z" fill={C.GOLD} /></g>}
      {k === 3 && <g><path d="M-8 9L5 -4" stroke={C.VIOLET} strokeWidth="2.4" strokeLinecap="round" /><path d="M6 -11C6.6 -7 7.6 -6 11 -5.4C7.6 -4.8 6.6 -3.8 6 0C5.4 -3.8 4.4 -4.8 1 -5.4C4.4 -6 5.4 -7 6 -11Z" fill={C.GOLD} /></g>}
      {k === 4 && <g><rect x="-9" y="-5" width="18" height="13" rx="1.5" fill={C.LILAC} /><path d="M-9 -1h18M0 -5v13" stroke={C.GOLD} strokeWidth="1.6" /><path d="M0 -5c-3-5-8-3-5 0M0 -5c3-5 8-3 5 0" fill="none" stroke={C.GOLD} strokeWidth="1.4" /></g>}
      {k === 5 && <g><path d="M-10 9V-2L-6 -8L-2 -2V9ZM2 9V-4L6 -11L10 -4V9Z" fill={C.LILAC} /><path d="M-6 -8L-6 -12M6 -11V-14" stroke={C.GOLD_D} strokeWidth="1" /></g>}
    </svg>
  )
}

/* Üz qabığındakı qızıl qəsr nişanı (tək rəng, «folqa basması») */
export function CastleMark($p) {
  const C = usePalette(PAL)
  const { size = 74, color = C.GOLD_L } = $p
  return (
    <svg viewBox="0 0 80 70" width={size} height={size * 0.875} aria-hidden="true" style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}>
      <g fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round">
        <path d="M34 22L40 4L46 22ZM40 4V0" />
        <path d="M14 34L19.5 18L25 34ZM55 34L60.5 18L66 34Z" />
        <path d="M34 22H46V66H34ZM15 34H25V66H15ZM55 34H65V66H55ZM25 42H55V66H25Z" />
        <path d="M36 66V56A4 4 0 0 1 44 56V66" />
        <path d="M6 66H74" />
      </g>
      <path d="M40 0l6 1.8l-6 1.8z" fill={color} />
      <circle cx="40" cy="32" r="2.6" fill={color} />
    </svg>
  )
}

/* Yaş möhürü — qıvrım kənarlı qızıl medalyon */
const SCALLOP = (() => {
  const n = 18, R = 46, r = 41
  let d = ''
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2
    const rr = i % 2 ? r : R
    d += `${i ? 'L' : 'M'}${(Math.cos(a) * rr).toFixed(2)} ${(Math.sin(a) * rr).toFixed(2)}`
  }
  return d + 'Z'
})()
export function AgeSeal({ size = 96, children, style }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', width: size, height: size, ...style }}>
      <svg viewBox="-50 -50 100 100" width={size} height={size} aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <linearGradient id="ft-seal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F6E3B0" /><stop offset=".5" stopColor={C.GOLD} /><stop offset="1" stopColor="#9C7A3A" /></linearGradient>
        </defs>
        <path d={SCALLOP} fill="url(#ft-seal)" stroke="#8A6A30" strokeWidth=".8" />
        <circle r="35" fill="none" stroke="#FFF3C9" strokeWidth="1" opacity=".8" />
        <circle r="31" fill="none" stroke="#8A6A30" strokeWidth=".6" strokeDasharray="1.6 2.4" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        {children}
      </div>
    </div>
  )
}
