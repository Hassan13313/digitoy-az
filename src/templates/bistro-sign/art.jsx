import { C as PAL, AWNING, BRASS_GRAD } from './palette'
import { usePalette } from '../_shared/palette'

/* BISTRO SIGN — tente, asma lövhə, işıq girləndi */

/** Dalğalı kənarlı zolaqlı tente */
export function Awning({ height = 70, style }) {
  const C = usePalette(PAL)
  return (
    <div aria-hidden="true" style={{ position: 'relative', height, pointerEvents: 'none', ...style }}>
      <div style={{ position: 'absolute', inset: 0, background: AWNING(C), boxShadow: 'inset 0 -10px 14px -10px rgba(0,0,0,.35)' }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: -14, height: 16, background: AWNING(C),
        maskImage: 'radial-gradient(circle at 14px 0, #000 13.5px, transparent 14px)', WebkitMaskImage: 'radial-gradient(circle at 14px 0, #000 13.5px, transparent 14px)',
        maskSize: '28px 16px', WebkitMaskSize: '28px 16px', filter: 'drop-shadow(0 4px 3px rgba(0,0,0,.25))',
      }} />
    </div>
  )
}

/** İşıq girləndi — `on` olanda lampalar yanır */
export function StringLights({ count = 9, on = true, style }) {
  const C = usePalette(PAL)
  return (
    <div aria-hidden="true" style={{ position: 'relative', height: 50, pointerEvents: 'none', ...style }}>
      <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, width: '100%', height: 26 }}>
        <path d="M0 2Q50 26 100 2" fill="none" stroke="#2A2A2A" strokeWidth=".6" vectorEffect="non-scaling-stroke" />
      </svg>
      {Array.from({ length: count }, (_, i) => {
        const t = (i + 0.5) / count
        const y = (2 + 48 * t * (1 - t)) * 1.3 - 1
        return (
          <span key={i} style={{
            position: 'absolute', left: `${t * 100}%`, top: y, width: 10, height: 14, marginLeft: -5, borderRadius: '45% 45% 50% 50%',
            background: on ? C.BULB : '#8E8A80', boxShadow: on ? `0 0 10px 4px ${C.BULB}88, 0 0 2px #FFF` : 'none',
            transition: `background .2s ease ${0.25 + i * 0.06}s, box-shadow .3s ease ${0.25 + i * 0.06}s`,
          }} />
        )
      })}
    </div>
  )
}

/** Asma lövhə: ön üz «Bağlı», arxa üz «Açıq» — `open` olanda fırlanır */
export function HangingSign({ width = 240, open = false, front, back, instant = false, style }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', width, ...style }}>
      {/* kronşteyn + zəncirlər */}
      <div aria-hidden="true" style={{ position: 'relative', height: 46 }}>
        <span style={{ position: 'absolute', left: '10%', right: '10%', top: 0, height: 5, borderRadius: 3, background: BRASS_GRAD(C) }} />
        {['22%', '78%'].map((x) => (
          <span key={x} style={{ position: 'absolute', left: x, top: 4, width: 2, height: 42, marginLeft: -1, backgroundImage: `radial-gradient(ellipse 2px 3px, transparent 1px, ${C.BRASS} 1.4px, ${C.BRASS} 2px, transparent 2.4px)`, backgroundSize: '2px 6px' }} />
        ))}
      </div>
      <div style={{ position: 'relative', aspectRatio: '2.1', perspective: 800 }}>
        <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: open ? 'rotateY(180deg)' : 'none', transition: instant ? 'none' : 'transform .9s cubic-bezier(.5,-.3,.3,1.3) .05s' }}>
          {[front, back].map((content, i) => (
            <div key={i} style={{
              position: 'absolute', inset: 0, borderRadius: 14, padding: 5, background: BRASS_GRAD(C), backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
              transform: i ? 'rotateY(180deg)' : 'none', boxShadow: '0 16px 24px -14px rgba(0,0,0,.55)',
            }}>
              <div style={{ height: '100%', borderRadius: 10, background: i ? C.GREEN : C.CREAM_L, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: 'inset 0 0 0 2px rgba(201,160,74,.45)' }}>
                {content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Fincan nəlbəkisi (sayğac üçün) */
export function Saucer({ children, size = '100%' }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', width: size, aspectRatio: '1', borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #FFFFFF, #EFE6D3 70%, #DCCFB4)', boxShadow: '0 10px 16px -10px rgba(31,42,36,.5), inset 0 0 0 4px #FFFFFF' }}>
      <span aria-hidden="true" style={{ position: 'absolute', inset: '9%', borderRadius: '50%', border: `2px solid ${C.GREEN}`, opacity: 0.8 }} />
      <span aria-hidden="true" style={{ position: 'absolute', inset: '14%', borderRadius: '50%', border: `1px solid ${C.BRASS}`, opacity: 0.7 }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  )
}
