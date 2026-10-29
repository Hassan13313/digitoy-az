import { C, BANDS, SKY_DAY, SKY_NIGHT, WISPS } from './palette'

/* BOHO SUNSET — göy qurşağı tağı, batan günəş, pampas otu */

/** Göy qurşağı tağı içində gün batımı — `set` olanda günəş batır, gecə düşür */
export function SunArch({ width = 260, set = false, style }) {
  const W = width
  const b = W * 0.045
  const inner = W - 8 * b
  return (
    <div aria-hidden="true" style={{ position: 'relative', width: W, height: W * 1.18, ...style }}>
      {BANDS.map((c, i) => (
        <span key={i} style={{ position: 'absolute', left: i * b, right: i * b, top: i * b, bottom: 0, borderRadius: `${(W - 2 * i * b) / 2}px ${(W - 2 * i * b) / 2}px 0 0`, background: c }} />
      ))}
      <div style={{ position: 'absolute', left: 4 * b, right: 4 * b, top: 4 * b, bottom: 0, borderRadius: `${inner / 2}px ${inner / 2}px 0 0`, overflow: 'hidden', isolation: 'isolate', background: SKY_DAY }}>
        <span style={{ position: 'absolute', inset: 0, background: SKY_NIGHT, opacity: set ? 1 : 0, transition: 'opacity 1.3s ease .35s' }} />
        <span style={{ position: 'absolute', right: '22%', top: '16%', width: inner * 0.14, height: inner * 0.14, borderRadius: '50%', boxShadow: `${-inner * 0.035}px ${inner * 0.015}px 0 0 #FFF1D6`, transform: 'rotate(-20deg)', opacity: set ? 1 : 0, transition: 'opacity .8s ease 1.2s' }} />
        <span style={{ position: 'absolute', left: '50%', bottom: inner * 0.2, width: inner * 0.44, height: inner * 0.44, marginLeft: -inner * 0.22, borderRadius: '50%', background: 'radial-gradient(circle at 50% 45%, #FFF3D1, #FBD08B 55%, #F2A65A)', boxShadow: '0 0 40px 12px rgba(251,208,139,.55)', transform: set ? `translateY(${inner * 0.5}px)` : 'none', transition: 'transform 1.5s cubic-bezier(.5,0,.7,1)' }} />
        <svg viewBox="0 0 200 80" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: inner * 0.42 }}>
          <path d="M0 40 C40 24 70 30 100 38 C130 46 160 26 200 30 V80 H0 Z" fill="#C97A5B" />
          <path d="M0 54 C30 44 70 46 110 56 C140 62 170 50 200 52 V80 H0 Z" fill="#A85A40" />
          <path d="M0 68 C40 60 90 64 130 70 C160 74 180 68 200 68 V80 H0 Z" fill="#7F3F2E" />
        </svg>
      </div>
    </div>
  )
}

/* Kvadratik Bezye üzərində nöqtə */
const P0 = [30, 200], P1 = [24, 110], P2 = [34, 12]
function at(s) {
  const a = (1 - s) * (1 - s), m = 2 * (1 - s) * s, z = s * s
  return [a * P0[0] + m * P1[0] + z * P2[0], a * P0[1] + m * P1[1] + z * P2[1]]
}

/** Pampas otu */
export function Pampas({ height = 200, flip = false, color = C.PAMPAS, sway = true, delay = 0, style }) {
  return (
    <span aria-hidden="true" style={{ display: 'block', width: height * 0.3, height, transformOrigin: '50% 100%', animation: sway ? `bs-sway 4.5s ease-in-out ${delay}s infinite` : 'none', ...style }}>
      <svg viewBox="0 0 60 200" width="100%" height="100%" style={{ display: 'block', overflow: 'visible', transform: flip ? 'scaleX(-1)' : 'none' }}>
        <path d={`M${P0} Q${P1} ${P2}`} fill="none" stroke="#B89A72" strokeWidth="1.6" strokeLinecap="round" />
        <ellipse cx="30" cy="50" rx="11" ry="40" fill={color} opacity=".8" transform="rotate(4 30 50)" />
        {WISPS.map((w, i) => {
          const s = 0.52 + w.t * 0.48
          const [x, y] = at(s)
          const taper = Math.sin(Math.PI * Math.min(1, 0.15 + w.t * 0.95))
          const L = w.len * (0.5 + taper)
          const a = ((-90 + w.side * w.ang) * Math.PI) / 180
          return <path key={i} d={`M${x} ${y} l${Math.cos(a) * L} ${Math.sin(a) * L}`} stroke={color} strokeWidth={w.w} strokeLinecap="round" opacity={0.75 + (i % 3) * 0.08} />
        })}
      </svg>
    </span>
  )
}

/** Kiçik göy qurşağı nişanı */
export function Rainbow({ size = 48, style }) {
  const r = [22, 17, 12, 7]
  return (
    <svg aria-hidden="true" viewBox="0 0 48 26" width={size} height={size * 0.54} style={{ display: 'block', overflow: 'visible', ...style }}>
      {r.map((R, i) => <path key={i} d={`M${24 - R} 25 A${R} ${R} 0 0 1 ${24 + R} 25`} fill="none" stroke={BANDS[i]} strokeWidth="4.2" strokeLinecap="round" />)}
    </svg>
  )
}

/** Şüalı yarım günəş */
export function HalfSun({ size = 40, color = C.MUSTARD, style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 24" width={size} height={size * 0.6} style={{ display: 'block', overflow: 'visible', ...style }}>
      <path d="M8 22 A12 12 0 0 1 32 22 Z" fill={color} />
      {[-75, -45, -15, 15, 45, 75].map((a) => <path key={a} d="M20 6 V1" stroke={color} strokeWidth="2" strokeLinecap="round" transform={`rotate(${a} 20 22)`} />)}
      <path d="M2 23 H38" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
