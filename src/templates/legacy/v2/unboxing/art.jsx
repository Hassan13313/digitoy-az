import { C as PAL, BOX_FRONT, ORB } from './palette'
import { usePalette } from '../../../_shared/palette'

/* UNBOXING — premium qutu, işıq şüaları, parlayan məhsul */

/** İşıq şüaları (qutudan çıxan) */
export function Rays({ on = true, size = 420, style }) {
  return (
    <span aria-hidden="true" style={{
      position: 'absolute', left: '50%', top: '50%', width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, borderRadius: '50%', pointerEvents: 'none',
      background: 'repeating-conic-gradient(from 0deg, rgba(185,168,255,.32) 0 6deg, transparent 6deg 18deg)',
      maskImage: 'radial-gradient(circle, #000 0 18%, transparent 68%)', WebkitMaskImage: 'radial-gradient(circle, #000 0 18%, transparent 68%)',
      transform: `scale(${on ? 1 : 0.2})`, opacity: on ? 1 : 0, transition: 'transform .9s cubic-bezier(.2,.8,.3,1) .45s, opacity .5s ease .45s',
      animation: on ? 'ub-spin 18s linear infinite' : 'none', ...style,
    }} />
  )
}

/** Parlayan məhsul — orb */
export function Orb({ size = 110, children, style }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, borderRadius: '50%', background: ORB, boxShadow: `0 0 40px 8px rgba(124,92,255,.55), 0 0 90px 20px rgba(124,92,255,.25), inset -8px -10px 20px rgba(30,20,90,.45)`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      <span aria-hidden="true" style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: '1.5px solid rgba(185,168,255,.55)', transform: 'rotateX(70deg)', pointerEvents: 'none' }} />
      {children}
    </div>
  )
}

/** Premium qutu — `open` olanda qapaq qalxıb uçur */
export function GiftBox({ width = 220, open = false, instant = false, label, style }) {
  return (
    <div style={{ position: 'relative', width, ...style }}>
      {/* qapaq */}
      <div style={{
        position: 'relative', zIndex: 2, aspectRatio: '5.5', margin: '0 -5%', borderRadius: 8,
        background: 'linear-gradient(180deg, #34317A, #23215A)', boxShadow: '0 8px 14px -6px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.18)',
        transform: open ? 'translateY(-150%) rotate(-14deg)' : 'none', opacity: open ? 0 : 1,
        transition: instant ? 'none' : 'transform .7s cubic-bezier(.3,.7,.3,1) .1s, opacity .4s ease .5s',
      }}>
        <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '9%', marginLeft: '-4.5%', background: 'linear-gradient(90deg, #A08BFF, #E3DCFF, #A08BFF)' }} />
      </div>
      {/* gövdə */}
      <div style={{ position: 'relative', aspectRatio: '1.6', borderRadius: '4px 4px 10px 10px', background: BOX_FRONT, boxShadow: '0 26px 34px -18px rgba(0,0,0,.8), inset 0 0 0 1px rgba(185,168,255,.15)' }}>
        <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '8%', marginLeft: '-4%', background: 'linear-gradient(90deg, #A08BFF, #E3DCFF, #A08BFF)', opacity: 0.9 }} />
        {label && <div style={{ position: 'absolute', left: 0, right: 0, bottom: '12%', display: 'flex', justifyContent: 'center' }}>{label}</div>}
      </div>
      <span aria-hidden="true" style={{ display: 'block', height: 14, margin: '0 -18%', borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(124,92,255,.45), transparent)', marginTop: 4 }} />
    </div>
  )
}

/** «Yeni» nişanı */
export function NewChip({ text, font }) {
  const C = usePalette(PAL)
  return (
    <span style={{ display: 'inline-block', padding: '5px 12px', borderRadius: 999, background: '#1E1C48', border: `1px solid ${C.VIOLET_L}`, fontFamily: font, fontWeight: 600, fontSize: 12, letterSpacing: '.22em', textTransform: 'uppercase', color: C.VIOLET_L }}>{text}</span>
  )
}
