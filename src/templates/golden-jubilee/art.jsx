import { C, LEATHER_BG, PAGE_BG } from './palette'

/* GOLDEN JUBILEE — dəri albom, qızıl naxış */

/** Qızıl basma çərçivə (iki xətt) */
export function GoldFrame({ inset = 14, radius = 6, color = C.GOLD, opacity = 0.9 }) {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', inset, borderRadius: radius, border: `1.5px solid ${color}`, opacity, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', inset: 5, borderRadius: Math.max(0, radius - 3), border: `1px solid ${color}`, opacity: 0.7 }} />
    </span>
  )
}

/** Albomun metal künc qoruyucuları */
export function MetalCorners({ size = 34 }) {
  const pos = [
    { left: 0, top: 0, transform: 'none' },
    { right: 0, top: 0, transform: 'scaleX(-1)' },
    { left: 0, bottom: 0, transform: 'scaleY(-1)' },
    { right: 0, bottom: 0, transform: 'scale(-1,-1)' },
  ]
  return pos.map((p, i) => (
    <svg key={i} aria-hidden="true" viewBox="0 0 40 40" width={size} height={size} style={{ position: 'absolute', ...p, display: 'block', pointerEvents: 'none' }}>
      <defs>
        <linearGradient id={`gj-mc-${i}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F3DE9C" /><stop offset=".5" stopColor="#C49A43" /><stop offset="1" stopColor="#8A6A26" />
        </linearGradient>
      </defs>
      <path d="M0 0H40L0 40Z" fill={`url(#gj-mc-${i})`} />
      <path d="M5 5H27L5 27Z" fill="none" stroke="#FFF1C2" strokeOpacity=".55" strokeWidth="1" />
      <circle cx="11" cy="11" r="2" fill="#7A5B1E" />
    </svg>
  ))
}

/** Foto küncləri (kağız) — elementin dörd küncündə */
export function PhotoCorners({ size = 18, color = C.LEATHER_D }) {
  const pos = [
    { left: -4, top: -4, transform: 'none' },
    { right: -4, top: -4, transform: 'scaleX(-1)' },
    { left: -4, bottom: -4, transform: 'scaleY(-1)' },
    { right: -4, bottom: -4, transform: 'scale(-1,-1)' },
  ]
  return pos.map((p, i) => (
    <svg key={i} aria-hidden="true" viewBox="0 0 20 20" width={size} height={size} style={{ position: 'absolute', ...p, display: 'block', pointerEvents: 'none', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.25))' }}>
      <path d="M0 0H20L0 20Z" fill={color} />
      <path d="M3 3H14L3 14Z" fill="none" stroke="#FFFFFF" strokeOpacity=".18" strokeWidth=".8" />
    </svg>
  ))
}

/** Qızıl ornament xətti */
export function Flourish({ width = 200, color = C.GOLD, style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 20" width={width} height={width * 0.1} style={{ display: 'block', margin: '0 auto', maxWidth: '100%', overflow: 'visible', ...style }}>
      <path d="M4 10H76M124 10H196" stroke={color} strokeWidth="1" />
      <path d="M76 10c8-8 16-8 24 0c8 8 16 8 24 0M76 10c8 8 16 8 24 0c8-8 16-8 24 0" fill="none" stroke={color} strokeWidth="1.2" />
      <circle cx="100" cy="10" r="2.6" fill={color} />
      <path d="M4 10l-4-3v6zM196 10l4-3v6z" fill={color} />
    </svg>
  )
}

/**
 * Dəri albom — `open` olanda üz qabığı sol kənar ətrafında açılır.
 * cover: üz qabığındakı məzmun · page: ilk səhifə
 */
export function Album({ width = 320, open = false, cover, page, instant = false, style }) {
  return (
    <div style={{ position: 'relative', width, aspectRatio: '3 / 4', perspective: 1400, ...style }}>
      {/* səhifələr (kənardan görünən qalınlıq) */}
      <span aria-hidden="true" style={{ position: 'absolute', inset: '4px -6px -6px 4px', borderRadius: '4px 10px 10px 4px', background: 'repeating-linear-gradient(90deg, #EADFC6 0 1px, #FBF5E7 1px 3px)', boxShadow: '0 30px 40px -24px rgba(0,0,0,.7)' }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: '3px 8px 8px 3px', overflow: 'hidden', background: PAGE_BG, boxShadow: 'inset 14px 0 18px -14px rgba(60,40,20,.45)' }}>
        {page}
      </div>
      <div style={{
        position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transformOrigin: '0 50%',
        transform: open ? 'rotateY(-118deg)' : 'none',
        transition: instant ? 'none' : 'transform 1.3s cubic-bezier(.55,0,.2,1) .05s',
      }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '3px 8px 8px 3px', overflow: 'hidden', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', background: LEATHER_BG, boxShadow: 'inset 10px 0 14px -8px rgba(0,0,0,.6), inset 0 0 0 1px rgba(0,0,0,.4)' }}>
          {/* tikiş xətti */}
          <span aria-hidden="true" style={{ position: 'absolute', inset: 8, borderRadius: 6, border: '1.5px dashed rgba(243,222,156,.32)' }} />
          <MetalCorners size={Math.round(typeof width === 'number' ? width * 0.11 : 34)} />
          {cover}
        </div>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '8px 3px 3px 8px', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: `repeating-linear-gradient(45deg, rgba(90,30,27,.08) 0 8px, transparent 8px 16px), ${C.CREAM}` }} />
      </div>
    </div>
  )
}
