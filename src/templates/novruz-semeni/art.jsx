import { C as PAL, EGGS, BLADES, COPPER_GRAD } from './palette'
import { usePalette } from '../_shared/palette'

/* NOVRUZ SƏMƏNİ — səməni, boyanmış yumurtalar, mis xonça */

const PAT = {
  dots: 'radial-gradient(circle, rgba(255,255,255,.85) 0 2.2px, transparent 2.6px) 0 0 / 11px 11px',
  zigzag: 'linear-gradient(135deg, rgba(255,255,255,.8) 25%, transparent 25%) -6px 0 / 12px 12px, linear-gradient(225deg, rgba(255,255,255,.8) 25%, transparent 25%) -6px 0 / 12px 12px',
  stripes: 'repeating-linear-gradient(0deg, transparent 0 7px, rgba(255,255,255,.75) 7px 10px)',
}

/** Boyanmış yumurta */
export function Egg({ size = 60, i = 0, children, style }) {
  const e = EGGS[i % EGGS.length]
  return (
    <div style={{ position: 'relative', width: size, aspectRatio: '0.78', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: `${PAT[e.pat]}, radial-gradient(circle at 35% 30%, rgba(255,255,255,.45), transparent 40%), ${e.base}`, boxShadow: 'inset -6px -8px 12px rgba(0,0,0,.18), 0 8px 12px -6px rgba(36,51,28,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: '46%', height: '12%', background: 'rgba(255,255,255,.88)' }} />
      {children && <div style={{ position: 'relative', textAlign: 'center' }}>{children}</div>}
    </div>
  )
}

/** Səməni qabı: `grown=false` — cücərti yeni çıxır */
export function Semeni({ size = 220, grown = true, instant = false, style }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', width: size, ...style }}>
      <svg aria-hidden="true" viewBox="0 0 100 90" width="100%" style={{ display: 'block', overflow: 'visible' }}>
        <g style={{ transformOrigin: '50px 60px', transformBox: 'view-box', transform: `scaleY(${grown ? 1 : 0.18})`, transition: instant ? 'none' : 'transform 1.1s cubic-bezier(.3,1.2,.4,1) .15s' }}>
          {BLADES.map((b, i) => (
            <path key={i} d={`M${b.x} 60Q${b.x + b.bend * 0.3} ${60 - b.h * 0.5} ${b.x + b.bend} ${60 - b.h}`} fill="none" stroke={b.tone} strokeWidth={b.w} strokeLinecap="round"
              style={{ transformOrigin: `${b.x}px 60px`, transformBox: 'view-box', animation: `ns-sway ${2.6 + b.d * 3}s ease-in-out ${b.d}s infinite alternate` }} />
          ))}
        </g>
        {/* qab */}
        <path d="M16 58H84C82 74 70 84 50 84C30 84 18 74 16 58Z" fill="#C98B4E" />
        <path d="M16 58H84C82 74 70 84 50 84C30 84 18 74 16 58Z" fill="url(#ns-bowl)" opacity=".5" />
        <ellipse cx="50" cy="58" rx="34" ry="5" fill="#8A5226" />
        <ellipse cx="50" cy="57.4" rx="31" ry="3.6" fill="#5E3A18" />
        <defs><linearGradient id="ns-bowl" x1="0" x2="1"><stop offset="0" stopColor="#5E3A18" /><stop offset=".4" stopColor="#F1C994" /><stop offset="1" stopColor="#5E3A18" /></linearGradient></defs>
        {/* qırmızı lent */}
        <path d="M22 50C40 54 60 54 78 50L78 56C60 60 40 60 22 56Z" fill={C.RED} style={{ opacity: grown ? 1 : 0, transition: instant ? 'none' : 'opacity .3s ease .9s' }} />
        <g style={{ transformOrigin: '50px 53px', transformBox: 'view-box', transform: `scale(${grown ? 1 : 0})`, transition: instant ? 'none' : 'transform .4s cubic-bezier(.3,1.6,.5,1) 1s' }}>
          <path d="M50 53C42 44 32 46 36 53C38 58 46 56 50 53ZM50 53C58 44 68 46 64 53C62 58 54 56 50 53Z" fill={C.RED} />
          <path d="M48 54L42 66L47 63L49 67L50 55ZM52 54L58 66L53 63L51 67L50 55Z" fill={C.RED_D} />
          <circle cx="50" cy="53" r="2.8" fill={C.RED_D} />
        </g>
      </svg>
    </div>
  )
}

/** Mis xonça (sini) */
export function Tray({ width = 300, children, style }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', width, ...style }}>
      <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '34%', borderRadius: '50%', background: COPPER_GRAD(C), boxShadow: '0 16px 20px -12px rgba(36,51,28,.5), inset 0 -4px 0 rgba(0,0,0,.15)' }} />
      <span aria-hidden="true" style={{ position: 'absolute', left: '6%', right: '6%', bottom: '4%', height: '26%', borderRadius: '50%', border: '1.5px dashed rgba(94,58,24,.45)' }} />
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  )
}

/** Kiçik cücərti (bullet) */
export function Sprout({ size = 24, style }) {
  const C = usePalette(PAL)
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block', overflow: 'visible', ...style }}>
      <path d="M12 22V12" stroke={C.GREEN} strokeWidth="2" strokeLinecap="round" />
      <path d="M12 13C12 7 8 4 3 4C3 9 6 13 12 13Z" fill={C.SPROUT} />
      <path d="M12 11C12 6 15 3 21 3C21 8 18 11 12 11Z" fill={C.GREEN} />
    </svg>
  )
}
