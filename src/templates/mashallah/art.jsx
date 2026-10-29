import { C, NAZAR, GLASS, SASH } from './palette'

/* MAŞALLAH — dekor */

/** Göz muncuğu (nazar) — şüşə parıltılı */
export function Nazar({ size = 80, shine = false, style }) {
  const n = typeof size === 'number' ? size : 200
  return (
    <span aria-hidden="true" style={{ position: 'relative', display: 'block', width: size, height: size, borderRadius: '50%', background: NAZAR, boxShadow: `inset 0 0 0 ${Math.max(1, n * 0.02)}px rgba(255,255,255,.35), 0 ${n * 0.12}px ${n * 0.22}px -${n * 0.08}px rgba(8,38,88,.55)`, overflow: 'hidden', ...style }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: GLASS }} />
      <span style={{ position: 'absolute', left: '41%', top: '39%', width: '7%', height: '7%', borderRadius: '50%', background: 'rgba(255,255,255,.9)' }} />
      <span style={{ position: 'absolute', top: '-30%', bottom: '-30%', left: '-70%', width: '40%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.65), transparent)', transform: shine ? 'translateX(520%) rotate(20deg)' : 'rotate(20deg)', transition: shine ? 'transform 1.1s ease .2s' : 'none' }} />
    </span>
  )
}

/** Şüşə muncuq (sadə) */
export function Bead({ size = 14, color = C.COBALT, style }) {
  return <span aria-hidden="true" style={{ display: 'inline-block', width: size, height: size, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,.85), ${color} 45%, ${color})`, boxShadow: '0 2px 3px rgba(8,38,88,.3)', ...style }} />
}

/** Muncuq sapı — başlıq ornamenti */
export function BeadRule({ width = 220, style }) {
  const cols = [C.TURQ, C.WHITE, C.COBALT, C.GOLD, C.COBALT, C.WHITE, C.TURQ]
  return (
    <div aria-hidden="true" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width, maxWidth: '100%', margin: '0 auto', ...style }}>
      <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: `linear-gradient(90deg, transparent, ${C.GOLD} 20%, ${C.GOLD} 80%, transparent)` }} />
      {cols.slice(0, 3).map((c, i) => <Bead key={`a${i}`} size={8 + i} color={c} style={{ position: 'relative' }} />)}
      <Nazar size={24} style={{ position: 'relative' }} />
      {cols.slice(4).map((c, i) => <Bead key={`b${i}`} size={10 - i} color={c} style={{ position: 'relative' }} />)}
    </div>
  )
}

/** Atlas lent — üzərində yazı */
export function Sash({ children, font, rotate = -6, size = 22, style }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', transform: `rotate(${rotate}deg)`, ...style }}>
      <span aria-hidden="true" style={{ position: 'absolute', left: -16, top: 8, bottom: -8, width: 26, background: C.COBALT_D, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 40% 50%)' }} />
      <span aria-hidden="true" style={{ position: 'absolute', right: -16, top: 8, bottom: -8, width: 26, background: C.COBALT_D, clipPath: 'polygon(0 0, 100% 0, 60% 50%, 100% 100%, 0 100%)' }} />
      <div style={{ position: 'relative', padding: '9px 26px 8px', background: SASH, borderTop: `2px solid ${C.GOLD}`, borderBottom: `2px solid ${C.GOLD}`, boxShadow: '0 8px 16px -8px rgba(8,38,88,.6)', fontFamily: font, fontStyle: 'italic', fontWeight: 500, fontSize: size, lineHeight: 1.1, color: C.GOLD_L, whiteSpace: 'nowrap' }}>
        {children}
      </div>
    </div>
  )
}
