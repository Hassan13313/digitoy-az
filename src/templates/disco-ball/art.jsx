import { SPOTS } from './palette'

/* DISCO BALL — güzgü kürə, işıq ləkələri */

/** Güzgü kürə — `spin` olanda fırlanır, `lit` olanda parlayır */
export function MirrorBall({ size = 180, spin = true, lit = true, chain = 80, style }) {
  return (
    <div style={{ position: 'relative', width: size, ...style }}>
      {chain > 0 && <span aria-hidden="true" style={{ position: 'absolute', left: '50%', bottom: '100%', width: 2, height: chain, marginLeft: -1, background: 'linear-gradient(#8C93A8, #D8DCE6)' }} />}
      <div style={{
        position: 'relative', width: size, height: size, borderRadius: '50%', overflow: 'hidden',
        boxShadow: lit ? `0 0 40px 6px rgba(255,255,255,.35), 0 0 90px 20px rgba(182,156,255,.35)` : '0 0 0 1px rgba(255,255,255,.1)',
        transition: 'box-shadow .6s ease .2s',
      }}>
        {/* fasetlər */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `repeating-linear-gradient(90deg, rgba(20,11,46,.55) 0 1.5px, transparent 1.5px ${size / 12}px), repeating-linear-gradient(0deg, rgba(20,11,46,.55) 0 1.5px, transparent 1.5px ${size / 12}px), repeating-linear-gradient(90deg, #C9CEDB 0 ${size / 24}px, #F4F6FB ${size / 24}px ${size / 12}px, #9AA1B6 ${size / 12}px ${size / 8}px, #E6E9F2 ${size / 8}px ${size / 6}px)`,
          backgroundSize: `${size / 3}px ${size / 12}px, auto, ${size / 3}px 100%`, '--tile': `${size / 3}px`,
          animation: spin ? 'db-spin 2.4s linear infinite' : 'none',
          filter: lit ? 'none' : 'brightness(.35)', transition: 'filter .6s ease .2s',
        }} />
        {/* parıltılar */}
        {lit && [[30, 26], [62, 40], [44, 66], [74, 70], [24, 54]].map(([x, y], i) => (
          <span key={i} aria-hidden="true" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: size * 0.07, height: size * 0.07, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 0 8px 3px #FFFFFF', animation: `db-twinkle 1.${i + 2}s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
        {/* kölgə və həcm */}
        <span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 34% 28%, rgba(255,255,255,.55), transparent 35%), radial-gradient(circle at 70% 75%, rgba(20,11,46,.65), transparent 60%)' }} />
      </div>
    </div>
  )
}

/** Divarlarda fırlanan işıq ləkələri */
export function LightSpots({ on = true, style }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: '-30%', pointerEvents: 'none', opacity: on ? 1 : 0, transition: 'opacity .6s ease .3s', animation: on ? 'db-rotate 16s linear infinite' : 'none', ...style }}>
      {SPOTS.map((p, i) => (
        <span key={i} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, borderRadius: '50%', background: p.c, boxShadow: `0 0 10px 2px ${p.c}`, opacity: 0.75 }} />
      ))}
    </div>
  )
}

/** İşıq şüası (proyektor) */
export function Beam({ side = 'left', on = true, color = 'rgba(255,62,165,.35)' }) {
  const left = side === 'left'
  return (
    <span aria-hidden="true" style={{
      position: 'absolute', top: 0, [left ? 'left' : 'right']: '-10%', width: '70%', height: '60%', pointerEvents: 'none',
      background: `linear-gradient(${left ? 160 : 200}deg, ${color}, transparent 70%)`, clipPath: left ? 'polygon(0 0, 18% 0, 100% 100%, 64% 100%)' : 'polygon(82% 0, 100% 0, 36% 100%, 0 100%)',
      opacity: on ? 1 : 0, transition: 'opacity .4s ease .1s', mixBlendMode: 'screen',
    }} />
  )
}
