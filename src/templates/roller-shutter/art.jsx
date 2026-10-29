import { C, SHUTTER, HAZARD, STEEL_GRAD, INTERIOR } from './palette'

/* ROLLER SHUTTER — metal jalüz, neon lövhə, perçinli lövhələr */

/** Perçinlər (dörd küncdə) */
export function Rivets({ inset = 8, size = 7 }) {
  const pos = [{ left: inset, top: inset }, { right: inset, top: inset }, { left: inset, bottom: inset }, { right: inset, bottom: inset }]
  return pos.map((p, i) => (
    <span key={i} aria-hidden="true" style={{ position: 'absolute', ...p, width: size, height: size, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #FFFFFF, #8F979F 60%, #5E666E)', boxShadow: '0 1px 1px rgba(0,0,0,.35)', pointerEvents: 'none' }} />
  ))
}

/** Neon «Açıq» lövhəsi (dükanın içində) */
export function NeonOpen({ text, size = 34, on = true, font, delay = 0 }) {
  return (
    <span style={{
      display: 'inline-block', padding: '6px 16px 8px', borderRadius: 12, border: `2.5px solid ${on ? '#FFF3D6' : '#6B5A40'}`,
      boxShadow: on ? `0 0 8px ${C.AMBER}, 0 0 22px ${C.AMBER}, inset 0 0 10px ${C.AMBER}` : 'none',
      fontFamily: font, fontWeight: 800, fontSize: size, lineHeight: 1, letterSpacing: '.08em', textTransform: 'uppercase',
      color: on ? '#FFF6E2' : '#6B5A40', textShadow: on ? `0 0 6px ${C.AMBER}, 0 0 16px ${C.AMBER}` : 'none',
      transition: `all .25s ease ${delay}s`,
    }}>{text}</span>
  )
}

/** Dükanın içi: rəflər + neon */
export function ShopInterior({ children }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: INTERIOR, overflow: 'hidden' }}>
      {[22, 48, 74].map((y) => (
        <span key={y} aria-hidden="true" style={{ position: 'absolute', left: '6%', right: '6%', top: `${y}%`, height: 4, background: 'rgba(40,26,14,.55)' }} />
      ))}
      {[[10, 14, 10], [24, 12, 14], [62, 13, 12], [78, 12, 9], [16, 40, 12], [70, 40, 15], [84, 66, 10], [12, 66, 13]].map(([x, y, w], i) => (
        <span key={i} aria-hidden="true" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${w}%`, height: '7%', borderRadius: 3, background: 'rgba(40,26,14,.35)' }} />
      ))}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  )
}

/** Vitrin: üstdə jalüz qutusu, `open` olanda jalüz yuxarı qalxır */
export function Storefront({ open = false, instant = false, children, aspect = '0.95', style }) {
  return (
    <div style={{ position: 'relative', ...style }}>
      {/* jalüz qutusu */}
      <div aria-hidden="true" style={{ position: 'relative', zIndex: 3, height: 22, borderRadius: '6px 6px 2px 2px', background: STEEL_GRAD, boxShadow: '0 4px 6px rgba(0,0,0,.35)' }}>
        <span style={{ position: 'absolute', left: 8, right: 8, top: 9, height: 2, background: 'rgba(0,0,0,.18)' }} />
      </div>
      <div style={{ position: 'relative', aspectRatio: aspect, overflow: 'hidden', borderLeft: `8px solid ${C.CHAR_L}`, borderRight: `8px solid ${C.CHAR_L}`, borderBottom: `8px solid ${C.CHAR_L}`, background: '#000' }}>
        <ShopInterior>{children}</ShopInterior>
        <div style={{
          position: 'absolute', inset: 0, background: SHUTTER, transform: open ? 'translateY(-101%)' : 'none',
          transition: instant ? 'none' : 'transform 1.15s cubic-bezier(.6,0,.3,1) .1s', boxShadow: 'inset 0 -14px 18px -12px rgba(0,0,0,.35)',
        }}>
          <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 18, background: HAZARD, borderTop: '3px solid #5E666E' }} />
          <span aria-hidden="true" style={{ position: 'absolute', left: '50%', bottom: 18, width: 46, height: 10, marginLeft: -23, borderRadius: '0 0 6px 6px', background: '#5E666E' }} />
        </div>
      </div>
    </div>
  )
}

/** Polad lövhə (perçinli) */
export function SteelPlate({ children, pad = '14px 10px', radius = 6, style }) {
  return (
    <div style={{ position: 'relative', padding: pad, borderRadius: radius, background: STEEL_GRAD, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.18), 0 10px 16px -10px rgba(0,0,0,.45)', ...style }}>
      <Rivets inset={6} size={6} />
      {children}
    </div>
  )
}
