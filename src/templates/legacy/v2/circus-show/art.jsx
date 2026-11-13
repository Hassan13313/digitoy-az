/* ─────────────────────────────────────────────────────────────────────────────
   CIRCUS SHOW — illüstrasiyalar (SVG, yalnız görünüş)
   Zolaqlı sirk çadırı, nağara, bayraqcıq girləndi, lampa girləndi, ulduz
   partlayışı, silindr papaq, halqa, ulduz. Hamısı aria-hidden.
   ───────────────────────────────────────────────────────────────────────── */
import { C as PAL } from './palette'
import { usePalette } from '../../../_shared/palette'

/* Beşguşəli ulduz */
export function Star($p) {
  const C = usePalette(PAL)
  const { size = 16, color = C.MUSTARD, style } = $p
  return (
    <svg viewBox="-10 -10 20 20" width={size} height={size} aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle', overflow: 'visible', ...style }}>
      <path d="M0 -9.5L2.8 -3L9.6 -3L4.2 1.2L6.2 8.4L0 4.2L-6.2 8.4L-4.2 1.2L-9.6 -3L-2.8 -3Z" fill={color} />
    </svg>
  )
}

/* Bayraqcıq girləndi — enə uzanır */
export function Bunting({ count = 11, height = 46, style }) {
  const C = usePalette(PAL)
  const cols = [C.RED, C.MUSTARD, C.TEAL, C.CREAM, C.NAVY]
  const w = 400 / count
  return (
    <svg viewBox={`0 0 400 ${height}`} preserveAspectRatio="none" width="100%" height={height} aria-hidden="true" style={{ display: 'block', ...style }}>
      <path d={`M0 4Q200 ${height * 0.42} 400 4`} fill="none" stroke={C.INK} strokeWidth="1.2" opacity=".55" />
      {Array.from({ length: count }, (_, i) => {
        const x0 = i * w + 3, x1 = (i + 1) * w - 3
        const t0 = x0 / 400, t1 = x1 / 400
        const y = (t) => 4 + 4 * t * (1 - t) * (height * 0.42 - 4)
        const tm = (t0 + t1) / 2
        return <path key={i} d={`M${x0} ${y(t0)}L${x1} ${y(t1)}L${(x0 + x1) / 2} ${y(tm) + height * 0.5}Z`} fill={cols[i % cols.length]} stroke={C.INK} strokeOpacity=".15" />
      })}
    </svg>
  )
}

/* Lampa girləndi — gecə səhnəsi */
export function StringLights({ count = 12, style }) {
  const C = usePalette(PAL)
  return (
    <svg viewBox="0 0 400 60" preserveAspectRatio="none" width="100%" height="60" aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <path d="M-10 6Q100 52 200 18Q300 -10 410 34" fill="none" stroke="#0A0F26" strokeWidth="1.5" />
      {Array.from({ length: count }, (_, i) => {
        const t = (i + 0.5) / count
        const x = -10 + t * 420
        const y = t < 0.5 ? 6 + (1 - Math.pow(1 - t * 2, 2)) * 26 + (t * 2) * (12 - 6) : 18 + Math.sin((t - 0.5) * Math.PI) * 10
        return (
          <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
            <circle r="9" fill={C.MUSTARD} opacity=".18" style={{ animation: `cs-bulb ${1.6 + (i % 3) * 0.4}s ease-in-out ${(i % 4) * 0.3}s infinite` }} />
            <circle cy="3" r="3.6" fill={i % 3 === 0 ? '#FFD983' : i % 3 === 1 ? '#FFB0A0' : '#FFF1C2'} />
          </g>
        )
      })}
    </svg>
  )
}

/* Sirk çadırı — viewBox 0 0 300 230; `open` → giriş pərdələri yığılır */
export function Tent({ width = 280, open = false, glow = false, style }) {
  const C = usePalette(PAL)
  const wedges = 10
  const roof = []
  for (let i = 0; i < wedges; i++) {
    const x0 = 18 + (i * 264) / wedges, x1 = 18 + ((i + 1) * 264) / wedges
    roof.push(<path key={i} d={`M150 14L${x0} 108L${x1} 108Z`} fill={i % 2 ? C.CREAM : C.RED} />)
  }
  const scallops = 12
  return (
    <svg viewBox="0 0 300 232" width={width} height={width * 0.773} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <defs>
        <radialGradient id="cs-inside" cx="50%" cy="80%" r="70%"><stop offset="0" stopColor="#FFE7A3" /><stop offset=".6" stopColor={C.MUSTARD} /><stop offset="1" stopColor="#7A2A12" /></radialGradient>
      </defs>
      <ellipse cx="150" cy="222" rx="140" ry="9" fill="#000000" opacity=".18" />
      {/* bayraq + dirək */}
      <path d="M150 14V-6" stroke={C.INK} strokeWidth="2" />
      <path d="M150 -6l20 6l-20 6z" fill={C.MUSTARD} style={{ transformOrigin: '150px 0px', animation: 'cs-flag 2.2s ease-in-out infinite' }} />
      {/* gövdə — şaquli zolaqlar */}
      {Array.from({ length: 11 }, (_, i) => (
        <rect key={i} x={36 + i * 20.7} y="108" width="20.7" height="110" fill={i % 2 ? C.CREAM : C.RED} />
      ))}
      <rect x="36" y="108" width="228" height="110" fill="url(#cs-shade)" />
      <defs><linearGradient id="cs-shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#000" stopOpacity=".18" /><stop offset=".4" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".22" /></linearGradient></defs>
      {/* giriş */}
      <path d="M118 218V156Q150 118 182 156V218Z" fill={glow ? 'url(#cs-inside)' : '#3B1520'} />
      <g style={{ transformOrigin: '118px 160px', transform: open ? 'scaleX(.18)' : 'none', transition: 'transform .7s cubic-bezier(.5,0,.2,1) .25s' }}>
        <path d="M118 218V156Q134 136 150 134V218Z" fill={C.RED_D} />
        <path d="M128 150V218M138 140V218" stroke="#7E1422" strokeWidth="1.2" />
      </g>
      <g style={{ transformOrigin: '182px 160px', transform: open ? 'scaleX(.18)' : 'none', transition: 'transform .7s cubic-bezier(.5,0,.2,1) .25s' }}>
        <path d="M182 218V156Q166 136 150 134V218Z" fill={C.RED_D} />
        <path d="M172 150V218M162 140V218" stroke="#7E1422" strokeWidth="1.2" />
      </g>
      <path d="M118 218V156Q150 118 182 156V218" fill="none" stroke={C.MUSTARD} strokeWidth="3" />
      {/* dam */}
      {roof}
      <path d="M150 14L18 108H282Z" fill="url(#cs-roofshade)" />
      <defs><linearGradient id="cs-roofshade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFFFFF" stopOpacity=".12" /><stop offset=".5" stopColor="#FFFFFF" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".18" /></linearGradient></defs>
      {/* fəstonlu haşiyə */}
      {Array.from({ length: scallops }, (_, i) => {
        const x = 18 + (i * 264) / scallops
        const w = 264 / scallops
        return <path key={i} d={`M${x} 106H${x + w}A${w / 2} ${w / 2.2} 0 0 1 ${x} 106Z`} fill={i % 2 ? C.MUSTARD : C.NAVY} transform={`translate(0 0) scale(1 1)`} />
      })}
      {Array.from({ length: scallops }, (_, i) => <circle key={i} cx={18 + (i + 0.5) * (264 / scallops)} cy="112" r="2.2" fill={C.CREAM} />)}
      <circle cx="150" cy="14" r="4" fill={C.MUSTARD} />
    </svg>
  )
}

/* Sirk nağarası — viewBox 0 0 140 110 */
export function Drum({ width = 130, style }) {
  const C = usePalette(PAL)
  const zig = []
  for (let i = 0; i < 9; i++) {
    const x = 14 + i * 14
    zig.push(`${i ? 'L' : 'M'}${x} ${i % 2 ? 88 : 40}`)
  }
  return (
    <svg viewBox="0 0 140 110" width={width} height={width * 0.786} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <ellipse cx="70" cy="100" rx="60" ry="8" fill="#000" opacity=".25" />
      <path d="M10 34V86C10 98 130 98 130 86V34Z" fill={C.RED} />
      <path d="M10 34V86C10 98 130 98 130 86V34Z" fill="url(#cs-drumshade)" />
      <defs><linearGradient id="cs-drumshade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#000" stopOpacity=".25" /><stop offset=".35" stopColor="#FFF" stopOpacity=".12" /><stop offset="1" stopColor="#000" stopOpacity=".3" /></linearGradient></defs>
      <path d={zig.join('')} fill="none" stroke={C.MUSTARD} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M10 40C10 50 130 50 130 40M10 84C10 94 130 94 130 84" fill="none" stroke={C.NAVY} strokeWidth="7" />
      <ellipse cx="70" cy="34" rx="60" ry="13" fill={C.CREAM} stroke={C.NAVY} strokeWidth="5" />
      <ellipse cx="62" cy="31" rx="30" ry="5" fill="#FFFFFF" opacity=".7" />
      {/* çubuqlar */}
      <path d="M40 8L74 30" stroke="#8A5A2B" strokeWidth="4" strokeLinecap="round" />
      <circle cx="40" cy="8" r="5" fill={C.CREAM} />
      <path d="M104 4L80 28" stroke="#8A5A2B" strokeWidth="4" strokeLinecap="round" />
      <circle cx="104" cy="4" r="5" fill={C.CREAM} />
    </svg>
  )
}

/* Ulduz partlayışı medalyonu (yaş üçün) */
const BURST = (() => {
  const n = 22
  let d = ''
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2
    const r = i % 2 ? 40 : 49
    d += `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`
  }
  return d + 'Z'
})()
export function Starburst({ size = 120, children, style }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', width: size, height: size, ...style }}>
      <svg viewBox="-52 -52 104 104" width={size} height={size} aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <path d={BURST} fill={C.MUSTARD} stroke={C.RED} strokeWidth="2.2" strokeLinejoin="round" />
        <circle r="34" fill={C.RED} />
        <circle r="30" fill="none" stroke={C.CREAM} strokeWidth="1.4" strokeDasharray="2 3" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{children}</div>
    </div>
  )
}

/* Silindr papaq — «cavab göndərildi» */
export function TopHat({ size = 46, style }) {
  const C = usePalette(PAL)
  return (
    <svg viewBox="0 0 60 50" width={size} height={size * 0.83} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <ellipse cx="30" cy="42" rx="27" ry="6" fill={C.NAVY} />
      <path d="M14 42V8C14 4 46 4 46 8V42Z" fill={C.NAVY} />
      <rect x="14" y="30" width="32" height="7" fill={C.RED} />
      <ellipse cx="30" cy="8" rx="16" ry="3.5" fill="#2E3D74" />
      <path d="M48 20l4 -10l3 8z" fill={C.MUSTARD} />
    </svg>
  )
}

/* Zolaqlı halqa — masa nömrəsi */
export function Hoop({ size = 220, children }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg viewBox="-60 -60 120 120" width={size} height={size} aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'visible', animation: 'cs-spin 18s linear infinite' }}>
        <circle r="50" fill="none" stroke={C.CREAM} strokeWidth="11" />
        <circle r="50" fill="none" stroke={C.RED} strokeWidth="11" strokeDasharray="13.09 13.09" />
        <circle r="56" fill="none" stroke={C.NAVY} strokeWidth="1.2" />
        <circle r="44" fill="none" stroke={C.NAVY} strokeWidth="1.2" />
        {Array.from({ length: 8 }, (_, k) => {
          const a = (k / 8) * Math.PI * 2
          return <path key={k} transform={`translate(${(Math.cos(a) * 58).toFixed(1)} ${(Math.sin(a) * 58).toFixed(1)}) scale(.45)`} d="M0 -9.5L2.8 -3L9.6 -3L4.2 1.2L6.2 8.4L0 4.2L-6.2 8.4L-4.2 1.2L-9.6 -3L-2.8 -3Z" fill={C.MUSTARD} />
        })}
      </svg>
      <div style={{ position: 'absolute', inset: '20%', borderRadius: '50%', background: C.CREAM, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: 'inset 0 4px 12px rgba(0,0,0,.12)' }}>{children}</div>
    </div>
  )
}

/* Nağara postamenti — sayğac */
export function Pedestal($p) {
  const C = usePalette(PAL)
  const { color = C.RED, band = C.MUSTARD, children } = $p
  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox="0 0 80 96" width="100%" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
        <ellipse cx="40" cy="90" rx="38" ry="6" fill="#000" opacity=".18" />
        <path d="M4 16V82C4 92 76 92 76 82V16Z" fill={color} />
        <path d="M4 16V82C4 92 76 92 76 82V16Z" fill="url(#cs-ped)" />
        <defs><linearGradient id="cs-ped" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#000" stopOpacity=".22" /><stop offset=".4" stopColor="#FFF" stopOpacity=".14" /><stop offset="1" stopColor="#000" stopOpacity=".28" /></linearGradient></defs>
        <path d="M4 76C4 86 76 86 76 76" fill="none" stroke={band} strokeWidth="5" />
        <ellipse cx="40" cy="16" rx="36" ry="10" fill={C.CREAM} stroke={band} strokeWidth="4" />
        {[16, 40, 64].map((x) => <path key={x} transform={`translate(${x} 84) scale(.32)`} d="M0 -9.5L2.8 -3L9.6 -3L4.2 1.2L6.2 8.4L0 4.2L-6.2 8.4L-4.2 1.2L-9.6 -3L-2.8 -3Z" fill={C.CREAM} />)}
      </svg>
      <div style={{ position: 'absolute', left: 0, right: 0, top: '26%', bottom: '18%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  )
}
