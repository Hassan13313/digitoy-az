import { C as PAL, HEART } from './palette'
import { usePalette } from '../_shared/palette'

/* SILVER LOCKET — dekor */

function HeartFace({ uid, variant = 'front', children }) {
  const C = usePalette(PAL)
  const fill = variant === 'inside' ? `url(#${uid}-in)` : `url(#${uid}-sv)`
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg aria-hidden="true" viewBox="0 0 200 184" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id={`${uid}-sv`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9AA1AB" /><stop offset=".3" stopColor="#F4F6F9" /><stop offset=".55" stopColor={C.SILVER} /><stop offset=".72" stopColor="#FFFFFF" /><stop offset="1" stopColor="#8D949E" />
          </linearGradient>
          <radialGradient id={`${uid}-in`} cx="50%" cy="40%" r="70%">
            <stop offset="0" stopColor="#FBFCFD" /><stop offset=".7" stopColor="#D9DDE3" /><stop offset="1" stopColor="#A9B0BA" />
          </radialGradient>
        </defs>
        <path d={HEART} fill={fill} stroke="#7D848E" strokeWidth="1.4" />
        <path d={HEART} fill="none" stroke="#FFFFFF" strokeOpacity=".7" strokeWidth="1" transform="translate(100 92) scale(.9) translate(-100 -92)" />
        {variant === 'front' && (
          <>
            <path d={HEART} fill="none" stroke="#7D848E" strokeOpacity=".55" strokeWidth=".8" strokeDasharray="1 3" transform="translate(100 92) scale(.82) translate(-100 -92)" />
            {[[50, 50], [150, 50], [100, 150]].map(([x, y], i) => (
              <path key={i} d={`M${x} ${y - 6}c3 4 3 8 0 12c-3-4-3-8 0-12zM${x - 6} ${y}c4-3 8-3 12 0c-4 3-8 3-12 0z`} fill="#8D949E" opacity=".5" />
            ))}
          </>
        )}
        {variant === 'inside' && <path d={HEART} fill="none" stroke="#8D949E" strokeWidth="5" transform="translate(100 92) scale(.86) translate(-100 -92)" opacity=".45" />}
      </svg>
      {children && <div style={{ position: 'absolute', inset: '14% 16% 26%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{children}</div>}
    </div>
  )
}

/**
 * Ürək medalyon — `open` olanda qapağı yan tərəfə açılır, içi görünür.
 * front: qapağın üstündə (məs. monoqram); inside: içəridə (il sayı).
 */
export function Locket({ width = 220, open = false, front, inside, lid, uid = 'sl', instant = false, chain = true, style }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', width, ...style }}>
      {chain && (
        <div aria-hidden="true" style={{ position: 'absolute', left: '50%', bottom: '100%', width: 2, height: 140, marginLeft: -1, backgroundImage: `radial-gradient(circle, ${C.SILVER} 1.6px, transparent 2px)`, backgroundSize: '2px 7px' }} />
      )}
      <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: -12, width: 18, height: 18, marginLeft: -9, borderRadius: '50%', border: `3px solid ${C.SILVER}` }} />
      <div style={{ position: 'relative', width: '100%', aspectRatio: '200 / 184', perspective: 900 }}>
        <HeartFace uid={`${uid}-b`} variant="inside">{inside}</HeartFace>
        <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transformOrigin: '2% 40%', transform: open ? 'rotateY(-158deg)' : 'none', transition: instant ? 'none' : 'transform 1.2s cubic-bezier(.5,0,.2,1) .1s' }}>
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', filter: 'drop-shadow(0 12px 18px rgba(0,0,0,.45))' }}>
            <HeartFace uid={`${uid}-f`} variant="front">{front}</HeartFace>
          </div>
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <HeartFace uid={`${uid}-l`} variant="inside">{lid === undefined ? <SmallHeart size={22} color={C.ROSE} style={{ opacity: 0.7 }} /> : lid}</HeartFace>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Kiçik ürək (gümüş) */
export function SmallHeart($p) {
  const C = usePalette(PAL)
  const { size = 16, color = C.SILVER, style } = $p
  return (
    <svg aria-hidden="true" viewBox="0 0 200 184" width={size} height={size * 0.92} style={{ display: 'block', ...style }}>
      <path d={HEART} fill={color} />
    </svg>
  )
}

/** Zəncir ornamenti */
export function ChainRule($p) {
  const C = usePalette(PAL)
  const { width = 220, color = C.SILVER, style } = $p
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 8, width, maxWidth: '100%', margin: '0 auto', ...style }}>
      <span style={{ flex: 1, height: 4, backgroundImage: `radial-gradient(ellipse 3px 2px, transparent 1px, ${color} 1.4px, ${color} 2px, transparent 2.4px)`, backgroundSize: '7px 4px', opacity: 0.85 }} />
      <SmallHeart size={18} color={color} />
      <span style={{ flex: 1, height: 4, backgroundImage: `radial-gradient(ellipse 3px 2px, transparent 1px, ${color} 1.4px, ${color} 2px, transparent 2.4px)`, backgroundSize: '7px 4px', opacity: 0.85 }} />
    </div>
  )
}
