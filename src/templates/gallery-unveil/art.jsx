import { C as PAL, GOLD_GRAD, VELVET } from './palette'
import { usePalette } from '../_shared/palette'

/* GALLERY UNVEIL — zərli çərçivə, abstrakt əsər, məxmər örtük */

/** Abstrakt kompozisiya (modernist əsər) */
export function Artwork({ children }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#F1E9DA' }}>
      <span aria-hidden="true" style={{ position: 'absolute', left: '-12%', top: '8%', width: '70%', aspectRatio: '1', borderRadius: '50%', background: C.OCHRE, opacity: 0.92 }} />
      <span aria-hidden="true" style={{ position: 'absolute', right: '-18%', bottom: '-10%', width: '78%', aspectRatio: '1', borderRadius: '50%', background: C.PLUM }} />
      <span aria-hidden="true" style={{ position: 'absolute', left: '18%', bottom: '14%', width: '40%', height: '8%', background: C.INK }} />
      <span aria-hidden="true" style={{ position: 'absolute', right: '14%', top: '12%', width: '26%', aspectRatio: '1', border: `6px solid ${C.TEAL}`, borderRadius: '50%' }} />
      <span aria-hidden="true" style={{ position: 'absolute', left: '44%', top: '0', width: 3, height: '100%', background: C.INK, opacity: 0.8 }} />
      {children && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>}
    </div>
  )
}

/** Zərli çərçivə + ağ paspartu */
export function GildedFrame({ children, aspect = '0.8', mat = '9%', style }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', padding: 10, background: GOLD_GRAD(C), boxShadow: '0 26px 36px -20px rgba(0,0,0,.55), inset 0 0 0 2px rgba(120,90,30,.5)', ...style }}>
      <div style={{ padding: mat, background: '#FBFAF7', boxShadow: 'inset 0 2px 6px rgba(0,0,0,.18)' }}>
        <div style={{ position: 'relative', aspectRatio: aspect, overflow: 'hidden' }}>{children}</div>
      </div>
    </div>
  )
}

/** Məxmər örtük — `off` olanda aşağı sürüşüb düşür */
export function VelvetCloth({ off = false, instant = false }) {
  const C = usePalette(PAL)
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', inset: '-6% -8% -4%', zIndex: 4, pointerEvents: 'none', transformOrigin: '50% 0',
      transform: off ? 'translateY(115%) rotate(6deg) skewX(-4deg)' : 'none', opacity: off ? 0 : 1,
      transition: instant ? 'none' : 'transform 1.05s cubic-bezier(.55,0,.75,.45) .12s, opacity .35s ease .75s',
      background: VELVET(C), borderRadius: '40% 40% 6px 6px / 8% 8% 6px 6px', boxShadow: '0 20px 30px -10px rgba(0,0,0,.5)',
    }}>
      <span style={{ position: 'absolute', left: '-4%', right: '-4%', top: '18%', height: 10, borderRadius: 5, background: GOLD_GRAD(C), transform: 'rotate(-4deg)' }} />
      <span style={{ position: 'absolute', right: '10%', top: '20%', width: 10, height: 52, borderRadius: '5px 5px 8px 8px', background: GOLD_GRAD(C) }} />
    </div>
  )
}

/** Muzey etiketi */
export function MuseumLabel({ children, style }) {
  return (
    <div style={{ padding: '12px 14px', background: '#FFFFFF', borderRadius: 2, boxShadow: '0 4px 10px -6px rgba(0,0,0,.35)', textAlign: 'left', ...style }}>{children}</div>
  )
}
