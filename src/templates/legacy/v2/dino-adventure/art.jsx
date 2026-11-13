/* ─────────────────────────────────────────────────────────────────────────────
   DINO ADVENTURE — illüstrasiyalar (SVG, yalnız görünüş)
   Xallı dinozavr yumurtası (çatlayan), balaca dino, qıjı, vulkan,
   uzunboyun dinozavr, iz, sümük, yuva. Hamısı aria-hidden.
   ───────────────────────────────────────────────────────────────────────── */
import { C as PAL, SPOTS } from './palette'
import { usePalette } from '../../../_shared/palette'

const EGG_PATH = 'M0 -70C38 -70 56 -10 56 18C56 52 30 72 0 72C-30 72 -56 52 -56 18C-56 -10 -38 -70 0 -70Z'
const CRACK = 'M-58 -4L-44 -14L-30 -2L-16 -16L0 -4L14 -18L28 -4L42 -16L58 -6'

function EggBody($p) {
  const C = usePalette(PAL)
  const { id, spot = C.TEAL } = $p
  return (
    <>
      <path d={EGG_PATH} fill={`url(#${id}-g)`} />
      {SPOTS.map((s, i) => (
        <ellipse key={i} cx={s.x.toFixed(1)} cy={s.y.toFixed(1)} rx={s.rx.toFixed(1)} ry={s.ry.toFixed(1)} transform={`rotate(${s.rot} ${s.x.toFixed(1)} ${s.y.toFixed(1)})`} fill={i % 3 ? spot : C.FERN} opacity=".75" />
      ))}
      <path d="M-30 -40C-24 -54 -12 -62 0 -64" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity=".6" />
    </>
  )
}

function EggDefs({ id }) {
  const C = usePalette(PAL)
  return (
    <defs>
      <radialGradient id={`${id}-g`} cx="36%" cy="30%" r="80%"><stop offset="0" stopColor="#FFFDF5" /><stop offset=".65" stopColor={C.EGG} /><stop offset="1" stopColor="#E3D3AE" /></radialGradient>
      <clipPath id={`${id}-top`}><path d={`${CRACK}V-80H-58Z`} /></clipPath>
      <clipPath id={`${id}-bot`}><path d={`${CRACK}V80H-58Z`} /></clipPath>
    </defs>
  )
}

/** Böyük açılış yumurtası: `open` → çatlar, qapaq uçur, balaca dino çıxır */
export function HatchEgg({ size = 200, open = false, style }) {
  const C = usePalette(PAL)
  const id = 'da-hatch'
  return (
    <svg viewBox="-80 -110 160 200" width={size} height={size * 1.25} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <EggDefs id={id} />
      {/* yuva */}
      <ellipse cx="0" cy="70" rx="74" ry="16" fill="#8A6A3A" />
      {/* balaca dino — qabığın arxasında qalxır */}
      <g style={{ transform: open ? 'translateY(-46px)' : 'translateY(30px)', transition: 'transform .6s cubic-bezier(.3,1.6,.5,1) .95s' }}>
        <BabyDinoHead />
      </g>
      {/* alt qabıq */}
      <g clipPath={`url(#${id}-bot)`}>
        <EggBody id={id} />
      </g>
      <path d={CRACK} fill="none" stroke="#8C7B5A" strokeWidth="2.4" strokeLinejoin="round" strokeDasharray="220" strokeDashoffset={open ? 0 : 220} style={{ transition: 'stroke-dashoffset .4s ease .35s' }} />
      {/* üst qabıq */}
      <g style={{ transformOrigin: '40px -10px', transform: open ? 'translate(60px,-120px) rotate(70deg)' : 'none', opacity: open ? 0 : 1, transition: 'transform .7s cubic-bezier(.4,0,.6,1) .8s, opacity .3s ease 1.25s' }}>
        <g clipPath={`url(#${id}-top)`}>
          <EggBody id={id} />
        </g>
      </g>
      {/* ön ot */}
      {[-66, -48, -30, 34, 52, 68].map((x, i) => (
        <path key={x} d={`M${x} 76Q${x + (i % 2 ? 6 : -6)} 56 ${x + (i % 2 ? 2 : -2)} 44`} stroke={i % 2 ? C.LEAF : C.FERN} strokeWidth="4" strokeLinecap="round" fill="none" />
      ))}
    </svg>
  )
}

/** Balaca dino başı (yumurtadan çıxan və «göndərildi» nişanı) */
export function BabyDinoHead({ scale = 1 }) {
  const C = usePalette(PAL)
  return (
    <g transform={`scale(${scale})`}>
      <path d="M-22 40V-6C-22 -34 22 -34 22 -6V40Z" fill={C.FERN} />
      <path d="M-14 -30l4 -10l4 9M-2 -34l4 -10l4 10M10 -30l4 -9l3 10" fill={C.LAVA} />
      <ellipse cx="0" cy="-8" rx="26" ry="20" fill={C.FERN} />
      <ellipse cx="6" cy="-2" rx="16" ry="11" fill={C.FERN_L} />
      <circle cx="-9" cy="-14" r="6.5" fill="#FFFFFF" /><circle cx="-8" cy="-13" r="3.6" fill={C.INK} /><circle cx="-6.8" cy="-14.4" r="1.2" fill="#FFFFFF" />
      <circle cx="11" cy="-14" r="6.5" fill="#FFFFFF" /><circle cx="12" cy="-13" r="3.6" fill={C.INK} /><circle cx="13.2" cy="-14.4" r="1.2" fill="#FFFFFF" />
      <path d="M-4 2Q4 9 14 2" fill="none" stroke={C.JUNGLE} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="-18" cy="-2" r="3.6" fill="#F49C8A" opacity=".6" /><circle cx="22" cy="-2" r="3.6" fill="#F49C8A" opacity=".6" />
    </g>
  )
}

/** Kiçik dino nişanı (HTML-də) */
export function DinoBadge({ size = 46, style }) {
  return (
    <svg viewBox="-30 -46 60 70" width={size} height={size * 1.17} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <BabyDinoHead />
    </svg>
  )
}

/** Sayğac yumurtası — ortada rəqəm */
export function NumberEgg({ id, spot, children, wobble }) {
  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox="-60 -74 120 150" width="100%" aria-hidden="true" style={{ display: 'block', overflow: 'visible', animation: wobble ? 'da-wobble 1s ease-in-out infinite' : undefined, transformOrigin: '50% 90%' }}>
        <EggDefs id={id} />
        <ellipse cx="0" cy="72" rx="44" ry="6" fill="#000" opacity=".12" />
        <EggBody id={id} spot={spot} />
      </svg>
      <div style={{ position: 'absolute', inset: '24% 0 10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  )
}

/** Qıjı yarpağı */
export function Fern($p) {
  const C = usePalette(PAL)
  const { width = 120, color = C.LEAF, flip, style } = $p
  const leaflets = 9
  return (
    <svg viewBox="0 0 120 160" width={width} height={width * 1.33} aria-hidden="true" style={{ display: 'block', overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined, ...style }}>
      <path d="M20 160C30 110 60 60 112 10" fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
      {Array.from({ length: leaflets }, (_, i) => {
        const t = (i + 1) / (leaflets + 1)
        const x = 20 + (112 - 20) * t + Math.sin(t * 3) * 4
        const y = 160 - 150 * t
        const len = 34 * (1 - t * 0.6)
        return (
          <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${-48 + t * 10})`}>
            <path d={`M0 0C${len * 0.3} ${-len * 0.25} ${len * 0.7} ${-len * 0.25} ${len} 0C${len * 0.7} ${len * 0.18} ${len * 0.3} ${len * 0.18} 0 0Z`} fill={color} />
            <path d={`M0 0C${-len * 0.3} ${len * 0.1} ${-len * 0.7} ${len * 0.5} ${-len * 0.9} ${len * 0.75}C${-len * 0.5} ${len * 0.62} ${-len * 0.2} ${len * 0.34} 0 0Z`} fill={color} opacity=".85" />
          </g>
        )
      })}
    </svg>
  )
}

/** Vulkan + tüstü */
export function Volcano({ width = 200, style }) {
  const C = usePalette(PAL)
  return (
    <svg viewBox="0 0 200 140" width={width} height={width * 0.7} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <defs>
        <linearGradient id="da-volc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7A6A58" /><stop offset="1" stopColor="#4E4438" /></linearGradient>
      </defs>
      {[[96, 10, 14, 0], [110, -6, 18, 1.2], [88, -22, 22, 2.4]].map(([x, y, r, d], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#E8E1D2" opacity=".85" style={{ animation: `da-smoke 4s ease-in-out ${d}s infinite`, transformOrigin: `${x}px ${y}px` }} />
      ))}
      <path d="M0 140L76 24H124L200 140Z" fill="url(#da-volc)" />
      <path d="M76 24H124L116 38C108 32 92 32 84 38Z" fill={C.LAVA} />
      <path d="M100 30C98 50 106 62 98 84C94 96 102 106 96 120" fill="none" stroke={C.LAVA} strokeWidth="5" strokeLinecap="round" opacity=".9" />
      <path d="M86 36C80 52 84 60 78 72" fill="none" stroke={C.AMBER} strokeWidth="3" strokeLinecap="round" opacity=".8" />
      <ellipse cx="100" cy="26" rx="26" ry="6" fill={C.AMBER} opacity=".5" style={{ animation: 'da-glow 2.4s ease-in-out infinite' }} />
    </svg>
  )
}

/** Uzunboyun dinozavr */
export function Brachio({ width = 220, style }) {
  const C = usePalette(PAL)
  return (
    <svg viewBox="0 0 220 180" width={width} height={width * 0.82} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <path d="M150 120C170 124 196 132 218 150C196 146 176 142 152 140Z" fill={C.LEAF} />
      <path d="M60 128C60 98 90 86 120 88C150 90 168 104 166 128C164 148 150 152 120 152C90 152 60 150 60 128Z" fill={C.LEAF} />
      <path d="M78 96C70 70 56 40 40 22" fill="none" stroke={C.LEAF} strokeWidth="22" strokeLinecap="round" />
      <ellipse cx="34" cy="16" rx="18" ry="11" fill={C.LEAF} />
      <circle cx="30" cy="12" r="3" fill={C.INK} /><circle cx="31" cy="11" r="1" fill="#FFFFFF" />
      <path d="M20 20Q26 24 32 21" fill="none" stroke={C.JUNGLE} strokeWidth="1.6" strokeLinecap="round" />
      {[[78, 146], [98, 150], [132, 150], [152, 146]].map(([x, y], i) => <rect key={i} x={x - 8} y={y - 10} width="16" height="30" rx="6" fill={i % 2 ? '#356A32' : C.LEAF} />)}
      {[[96, 110, 7], [118, 104, 5], [136, 116, 6], [108, 126, 4]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={C.FERN_L} opacity=".55" />)}
      <path d="M70 112C90 118 130 118 158 112" fill="none" stroke={C.FERN_L} strokeWidth="3" opacity=".4" />
    </svg>
  )
}

/** Üç barmaqlı dinozavr izi */
export function Footprint($p) {
  const C = usePalette(PAL)
  const { size = 30, color = C.LEAF, style, children } = $p
  return (
    <div style={{ position: 'relative', width: size, height: size * 1.1, ...style }}>
      <svg viewBox="-30 -34 60 66" width={size} height={size * 1.1} aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {/* teropod izi: dabanı yumru, üç uzun sivri barmaq */}
        <ellipse cx="0" cy="17" rx="14" ry="13" fill={color} />
        {[-36, 0, 36].map((r) => (
          <path key={r} transform={`rotate(${r} 0 14)`} d={r ? 'M-6.5 12C-7 0 -4 -14 0 -24C4 -14 7 0 6.5 12Z' : 'M-7 12C-7.5 -2 -4 -20 0 -32C4 -20 7.5 -2 7 12Z'} fill={color} />
        ))}
      </svg>
      {children && <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>{children}</div>}
    </div>
  )
}

/** Sümük (fosil) */
export function Bone({ width = 70, style }) {
  const C = usePalette(PAL)
  return (
    <svg viewBox="0 0 70 20" width={width} height={width * 0.29} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <path d="M10 6C4 0 -2 6 4 10C-2 14 4 20 10 14H60C66 20 72 14 66 10C72 6 66 0 60 6Z" fill={C.BONE} stroke="#C9BC9C" strokeWidth="1.2" />
    </svg>
  )
}

/** Yuva — xəritə sancağı */
export function Nest({ size = 56 }) {
  const C = usePalette(PAL)
  return (
    <svg viewBox="-30 -24 60 40" width={size} height={size * 0.67} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <ellipse cx="-8" cy="-4" rx="9" ry="12" fill={C.EGG} stroke="#C9BC9C" />
      <ellipse cx="8" cy="-6" rx="9" ry="12" fill={C.EGG} stroke="#C9BC9C" />
      <circle cx="10" cy="-10" r="2" fill={C.TEAL} /><circle cx="-10" cy="-2" r="1.6" fill={C.FERN} />
      <path d="M-28 2C-24 16 24 16 28 2C20 8 -20 8 -28 2Z" fill="#8A6A3A" />
      <path d="M-26 4C-14 12 14 12 26 4M-22 8C-10 14 10 14 22 8" stroke="#6B4F28" strokeWidth="1.2" fill="none" />
    </svg>
  )
}
