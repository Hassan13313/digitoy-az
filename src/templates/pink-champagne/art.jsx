import { C as PAL, BUBBLES, FOAM } from './palette'
import { usePalette } from '../_shared/palette'

/* PINK CHAMPAGNE — butulka, tıxac, köpük, bokallar */

/** Şampan butulkası — `popped` olanda tıxac uçur */
export function Bottle({ size = 120, popped = false, label, style }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', width: size, ...style }}>
      {/* tıxac */}
      <svg aria-hidden="true" viewBox="0 0 30 30" width={size * 0.22} style={{ position: 'absolute', left: '50%', top: -size * 0.12, marginLeft: -size * 0.11, overflow: 'visible', transform: popped ? 'translate(120px, -260px) rotate(540deg)' : 'none', opacity: popped ? 0 : 1, transition: 'transform .7s cubic-bezier(.2,.8,.4,1), opacity .2s ease .55s', zIndex: 2 }}>
        <path d="M6 30L4 8C4 2 26 2 26 8L24 30Z" fill="#D9B07A" />
        <path d="M4 8C4 2 26 2 26 8Z" fill="#EDCB98" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 100 300" width="100%" style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(0 18px 18px rgba(62,15,28,.35))' }}>
        <defs>
          <linearGradient id="pc-glass" x1="0" x2="1"><stop offset="0" stopColor="#2A0D16" /><stop offset=".3" stopColor="#6E2236" /><stop offset=".55" stopColor="#3E0F1C" /><stop offset="1" stopColor="#1F070E" /></linearGradient>
          <linearGradient id="pc-foil" x1="0" x2="1"><stop offset="0" stopColor="#B8924A" /><stop offset=".45" stopColor="#F6E2B4" /><stop offset="1" stopColor="#A47E38" /></linearGradient>
        </defs>
        <path d="M40 0H60V70C60 92 88 104 88 140V286C88 294 82 300 74 300H26C18 300 12 294 12 286V140C12 104 40 92 40 70Z" fill="url(#pc-glass)" />
        <path d="M38 0H62V64C62 76 66 82 70 88H30C34 82 38 76 38 64Z" fill="url(#pc-foil)" />
        <path d="M22 150C22 140 26 130 30 126V270" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="5" strokeLinecap="round" />
        <rect x="18" y="170" width="64" height="70" rx="6" fill="#FFF8F3" />
        <rect x="22" y="174" width="56" height="62" rx="4" fill="none" stroke={C.GOLD} strokeWidth="1.5" />
      </svg>
      {label && <div style={{ position: 'absolute', left: '18%', right: '18%', top: '58%', height: '21%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{label}</div>}
      {/* köpük */}
      {popped && (
        <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 0, width: 0, height: 0 }}>
          <span style={{ position: 'absolute', left: -60, top: -80, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,.95), rgba(247,182,196,.6) 45%, transparent 70%)', animation: 'pc-fade .25s ease-out .2s both' }} />
          {FOAM.map((f, i) => (
            <span key={i} style={{ position: 'absolute', left: -f.s / 2, top: -f.s / 2, width: f.s, height: f.s, borderRadius: '50%', background: i % 3 ? 'radial-gradient(circle at 35% 30%, #FFFFFF, #FFE4EA 60%, #F7B6C4)' : `radial-gradient(circle at 35% 30%, #FFD3DD, ${C.ROSE})`, boxShadow: '0 0 0 1px rgba(194,84,112,.35)', '--tx': `${Math.cos((f.a * Math.PI) / 180) * f.r}px`, '--ty': `${Math.sin((f.a * Math.PI) / 180) * f.r}px`, animation: `pc-foam ${f.dur}s cubic-bezier(.2,.8,.4,1) ${f.d}s both` }} />
          ))}
        </span>
      )}
    </div>
  )
}

/** Kupe bokalı (çəhrayı şampanla) */
export function Coupe({ size = 70, tilt = 0, style }) {
  const C = usePalette(PAL)
  return (
    <svg aria-hidden="true" viewBox="0 0 80 100" width={size} height={size * 1.25} style={{ display: 'block', overflow: 'visible', transform: `rotate(${tilt}deg)`, ...style }}>
      <path d="M6 18C6 40 22 50 40 50C58 50 74 40 74 18Z" fill="rgba(255,255,255,.35)" stroke={C.GOLD} strokeWidth="2" />
      <path d="M9 24C12 40 25 46 40 46C55 46 68 40 71 24Z" fill="#F3A3B5" opacity=".85" />
      <path d="M40 50V88M24 96C24 90 56 90 56 96Z" stroke={C.GOLD} strokeWidth="2.5" fill={C.GOLD} />
      {[[30, 34], [46, 30], [38, 40], [54, 38]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.6" fill="#FFFFFF" opacity=".9" />)}
    </svg>
  )
}

/** Fon qabarcıqları (yuxarı qalxır) */
export function Bubbles({ color = 'rgba(255,255,255,.55)', ring = 'rgba(227,119,143,.35)' }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {BUBBLES.map((b, i) => (
        <span key={i} style={{ position: 'absolute', left: `${b.x}%`, bottom: -30, width: b.s, height: b.s, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #FFFFFF 0 15%, ${color} 40%, transparent 70%)`, boxShadow: `inset 0 0 0 1px ${ring}`, animation: `pc-rise ${b.dur}s linear -${b.d}s infinite` }} />
      ))}
    </div>
  )
}

/** «Gəlin olacaq» lenti */
export function Sash({ text, font, style }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', display: 'inline-block', padding: '8px 34px', background: `linear-gradient(180deg, #F7B6C4, ${C.ROSE})`, color: '#FFFFFF', fontFamily: font, fontStyle: 'italic', fontSize: 20, lineHeight: 1.1, clipPath: 'polygon(0 0, 100% 0, 94% 50%, 100% 100%, 0 100%, 6% 50%)', boxShadow: '0 8px 14px -8px rgba(194,84,112,.6)', ...style }}>
      <span aria-hidden="true" style={{ position: 'absolute', left: '7%', right: '7%', top: 4, height: 1, background: 'rgba(255,255,255,.6)' }} />
      <span aria-hidden="true" style={{ position: 'absolute', left: '7%', right: '7%', bottom: 4, height: 1, background: 'rgba(255,255,255,.6)' }} />
      {text}
    </div>
  )
}
