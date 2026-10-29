import { C } from './palette'

/* YEARBOOK — marker cizgiləri, varsity yamaq */

/** Marker cizgisi: ulduz / ürək / gülüş / ox */
export function Doodle({ kind = 'star', size = 34, color = C.BLUE, style }) {
  const p = {
    star: 'M17 3l4 9 10 1-7.5 6.5L26 30l-9-5.5L8 30l2.5-10.5L3 13l10-1z',
    heart: 'M17 30S4 22 4 12c0-4.5 3.4-8 7.5-8 2.7 0 4.5 1.6 5.5 3.6C18 5.6 19.8 4 22.5 4 26.6 4 30 7.5 30 12c0 10-13 18-13 18z',
    smile: 'M17 3a14 14 0 1 0 0.01 0zM11 13v2M23 13v2M10 20c4 5 10 5 14 0',
    arrow: 'M3 25C10 12 20 8 30 9M30 9l-6-4M30 9l-5 6',
    burst: 'M17 2v7M17 25v7M2 17h7M25 17h7M6.5 6.5l5 5M22.5 22.5l5 5M27.5 6.5l-5 5M11.5 22.5l-5 5',
  }[kind]
  return (
    <svg aria-hidden="true" viewBox="0 0 34 34" width={size} height={size} style={{ display: 'block', overflow: 'visible', ...style }}>
      <path d={p} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Yuvarlaq varsity yamağı (tikişli kənar) */
export function Patch({ size = 120, children, bg = C.BLUE, style }) {
  return (
    <div style={{
      position: 'relative', width: size, height: size, borderRadius: '50%', background: bg,
      boxShadow: `0 0 0 ${size * 0.04}px ${C.WHITE}, 0 0 0 ${size * 0.075}px ${C.YELLOW}, 0 12px 20px -10px rgba(15,37,102,.6)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', ...style,
    }}>
      <span aria-hidden="true" style={{ position: 'absolute', inset: size * 0.06, borderRadius: '50%', border: `1.5px dashed ${C.YELLOW}`, opacity: 0.7 }} />
      {children}
    </div>
  )
}

/** Bir-bir görünən imza */
export function Signature({ text, color = C.BLUE, rot = -6, font, size = 26, delay = 0, show = true, style }) {
  return (
    <span aria-hidden="true" style={{
      position: 'absolute', display: 'block', whiteSpace: 'nowrap', fontFamily: font, fontSize: size, lineHeight: 1, color,
      transform: `rotate(${rot}deg) scale(${show ? 1 : 0.4})`, opacity: show ? 1 : 0,
      transition: `transform .35s cubic-bezier(.3,1.6,.5,1) ${delay}s, opacity .2s ease ${delay}s`, ...style,
    }}>{text}</span>
  )
}
