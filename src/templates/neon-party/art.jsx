import { C, boxGlow } from './palette'

/* NEON PARTY — neon dekor */

/** Neon ulduz (xətt) */
export function NeonStar({ size = 28, color = C.YELLOW, on = true, style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block', overflow: 'visible', filter: on ? `drop-shadow(0 0 3px ${color}) drop-shadow(0 0 8px ${color})` : 'none', ...style }}>
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7.1L12 17.3 5.7 21l1.7-7.1L2 9.2l7.1-.6z" fill="none" stroke={on ? '#FFFFFF' : C.TUBE} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7.1L12 17.3 5.7 21l1.7-7.1L2 9.2l7.1-.6z" fill="none" stroke={on ? color : C.TUBE} strokeWidth="3.2" strokeLinejoin="round" opacity=".55" />
    </svg>
  )
}

/** Neon çərçivə — `on=false` sönük borular */
export function NeonFrame({ color = C.CYAN, on = true, radius = 22, children, style, flicker }) {
  return (
    <div style={{ position: 'relative', borderRadius: radius, boxShadow: on ? boxGlow(color) : `0 0 0 1.5px ${C.TUBE}`, animation: on && flicker ? flicker : 'none', ...style }}>
      {children}
    </div>
  )
}

/** Neon xətt — başlıq ornamenti */
export function NeonRule({ width = 200, colors = [C.PINK, C.CYAN], style }) {
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width, maxWidth: '100%', margin: '0 auto', ...style }}>
      <span style={{ flex: 1, height: 2, borderRadius: 2, background: '#FFFFFF', boxShadow: `0 0 6px ${colors[0]}, 0 0 14px ${colors[0]}` }} />
      <NeonStar size={20} />
      <span style={{ flex: 1, height: 2, borderRadius: 2, background: '#FFFFFF', boxShadow: `0 0 6px ${colors[1]}, 0 0 14px ${colors[1]}` }} />
    </div>
  )
}
