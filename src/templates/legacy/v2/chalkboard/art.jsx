import { C as PAL } from './palette'
import { usePalette } from '../../../_shared/palette'

/* CHALKBOARD — taxta çərçivə, təbaşir, cizgilər */

/** Taxta çərçivə (bölmənin içinə) */
export function WoodFrame({ inset = 0, thick = 12 }) {
  const C = usePalette(PAL)
  return (
    <span aria-hidden="true" style={{
      position: 'absolute', inset, pointerEvents: 'none',
      border: `${thick}px solid ${C.WOOD}`,
      borderImage: `linear-gradient(135deg, #B07C50, #7A4E2C 30%, #A87448 55%, #6E4628 80%, ${C.WOOD}) 1`,
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.35), inset 0 6px 14px rgba(0,0,0,.35)',
    }} />
  )
}

/** Təbaşir rəfi: təbaşir parçaları + pozan */
export function ChalkTray({ style }) {
  const C = usePalette(PAL)
  return (
    <div aria-hidden="true" style={{ position: 'relative', height: 22, background: `linear-gradient(180deg, #A87448, ${C.WOOD_D})`, boxShadow: '0 6px 10px -4px rgba(0,0,0,.5)', ...style }}>
      <span style={{ position: 'absolute', left: '18%', top: -6, width: 34, height: 8, borderRadius: 3, background: C.CHALK, transform: 'rotate(-4deg)' }} />
      <span style={{ position: 'absolute', left: '32%', top: -5, width: 22, height: 7, borderRadius: 3, background: C.YELLOW, transform: 'rotate(6deg)' }} />
      <span style={{ position: 'absolute', left: '40%', top: -5, width: 18, height: 7, borderRadius: 3, background: C.PINK }} />
      <span style={{ position: 'absolute', right: '16%', top: -14, width: 62, height: 18, borderRadius: 4, background: 'linear-gradient(180deg, #3A3A3A 0 45%, #D9D2C2 45%)', boxShadow: '0 2px 3px rgba(0,0,0,.4)' }} />
    </div>
  )
}

/** Təbaşir cizgisi: ulduz, papaq, ox, ürək, alt xətt */
export function ChalkDoodle($p) {
  const C = usePalette(PAL)
  const { kind = 'star', size = 40, color = C.CHALK, style } = $p
  const paths = {
    star: 'M20 3l4.6 10.4 11.4 1.1-8.6 7.6 2.6 11.2L20 27.4 10 33.3l2.6-11.2L4 14.5l11.4-1.1z',
    cap: 'M2 15L20 7l18 8-18 8zM9 18v8c0 3 5 5 11 5s11-2 11-5v-8M34 16v10',
    arrow: 'M3 30C12 14 22 10 36 9M36 9l-7-4M36 9l-6 6',
    heart: 'M20 34S5 25 5 14c0-5 4-9 8.5-9 3 0 5.2 1.8 6.5 4 1.3-2.2 3.5-4 6.5-4C31 5 35 9 35 14c0 11-15 20-15 20z',
    sun: 'M20 12a8 8 0 1 0 .01 0zM20 2v5M20 33v5M2 20h5M33 20h5M7 7l3.5 3.5M29.5 29.5L33 33M33 7l-3.5 3.5M10.5 29.5L7 33',
    aplus: 'M4 34L12 6l8 28M7 24h10M28 14v14M21 21h14',
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" width={size} height={size} style={{ display: 'block', overflow: 'visible', opacity: 0.9, ...style }}>
      <path d={paths[kind]} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 1.4" />
    </svg>
  )
}

/** Təbaşir alt xətti (əl ilə çəkilmiş) */
export function ChalkLine($p) {
  const C = usePalette(PAL)
  const { width = 160, color = C.CHALK, draw = true, delay = 0, style } = $p
  return (
    <svg aria-hidden="true" viewBox="0 0 200 14" width={width} height={width * 0.07} style={{ display: 'block', margin: '0 auto', overflow: 'visible', ...style }}>
      <path d="M4 9C40 4 80 11 120 6S180 5 196 8" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray="220" strokeDashoffset={draw ? 0 : 220} style={{ transition: `stroke-dashoffset .6s ease ${delay}s`, opacity: 0.85 }} />
    </svg>
  )
}
