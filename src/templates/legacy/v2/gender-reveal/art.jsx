import { C as PAL } from './palette'
import { usePalette } from '../../../_shared/palette'

/* GENDER REVEAL — dekor */

const TONE = (C) => ({ pink: [C.PINK_L, C.PINK, C.PINK_D], blue: [C.BLUE_L, C.BLUE, C.BLUE_D], gold: ['#FFF2C9', C.GOLD, C.GOLD_D] })

/** Şar */
export function Balloon({ size = 50, tone = 'pink', string = 40, style }) {
  const C = usePalette(PAL)
  const [l, m, d] = TONE(C)[tone] || TONE(C).pink
  return (
    <span aria-hidden="true" style={{ position: 'relative', display: 'inline-block', width: size, height: size * 1.22 + string, ...style }}>
      <span style={{ position: 'absolute', left: 0, top: 0, width: size, height: size * 1.18, borderRadius: '50% 50% 48% 48% / 56% 56% 44% 44%', background: `radial-gradient(circle at 34% 28%, #FFFFFF 0 6%, ${l} 18%, ${m} 55%, ${d})` }} />
      <span style={{ position: 'absolute', left: '50%', top: size * 1.14, width: 8, height: 7, marginLeft: -4, background: d, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} />
      {string > 0 && <span style={{ position: 'absolute', left: '50%', top: size * 1.2, width: 1, height: string, background: 'rgba(51,54,92,.35)' }} />}
    </span>
  )
}

/** Hədiyyə qutusu — `open` qapağı atır */
export function GiftBox({ width = 200, open = false, tag, style }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', width, aspectRatio: '1 / 1', ...style }}>
      {/* gövdə */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '8%', right: '8%', top: '34%', bottom: 0, borderRadius: '6px 6px 12px 12px', background: `repeating-linear-gradient(135deg, ${C.BLUE} 0 18px, ${C.PINK} 18px 36px)`, boxShadow: 'inset 0 -12px 18px rgba(51,54,92,.15), 0 18px 28px -16px rgba(51,54,92,.5)' }} />
      <div aria-hidden="true" style={{ position: 'absolute', left: '44%', right: '44%', top: '34%', bottom: 0, background: C.GOLD, boxShadow: 'inset 0 0 0 1px rgba(199,154,44,.5)' }} />
      {/* qapaq */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '2%', right: '2%', top: '22%', height: '16%', transform: open ? 'translate(70%, -520%) rotate(50deg)' : 'none', opacity: open ? 0 : 1, transition: 'transform .9s cubic-bezier(.3,.9,.4,1), opacity .4s ease .5s', transformOrigin: '80% 100%' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 8, background: `repeating-linear-gradient(135deg, ${C.PINK} 0 18px, ${C.BLUE} 18px 36px)`, boxShadow: '0 6px 12px -6px rgba(51,54,92,.45)' }} />
        <div style={{ position: 'absolute', left: '42%', right: '42%', top: 0, bottom: 0, background: C.GOLD }} />
        {/* fiyonq */}
        <svg viewBox="0 0 100 50" width="56%" style={{ position: 'absolute', left: '22%', bottom: '86%', overflow: 'visible' }}>
          <path d="M50 46C38 20 10 14 12 32C14 46 40 46 50 46ZM50 46C62 20 90 14 88 32C86 46 60 46 50 46Z" fill={C.GOLD} stroke={C.GOLD_D} strokeWidth="1.4" />
          <circle cx="50" cy="44" r="7" fill={C.GOLD_D} />
        </svg>
      </div>
      {tag && (
        <div style={{ position: 'absolute', left: '50%', top: '56%', transform: 'translate(-50%, -50%) rotate(-4deg)', minWidth: '46%', padding: '10px 12px', borderRadius: 12, background: '#FFFFFF', boxShadow: '0 8px 16px -8px rgba(51,54,92,.5)', textAlign: 'center' }}>
          {tag}
        </div>
      )}
    </div>
  )
}

/** Sual işarəsi (qızılı) */
export function Question({ size = 60, style }) {
  const C = usePalette(PAL)
  return (
    <span aria-hidden="true" style={{ display: 'inline-block', fontFamily: 'inherit', fontWeight: 800, fontSize: size, lineHeight: 1, color: C.GOLD, WebkitTextStroke: `${Math.max(1, size / 30)}px ${C.GOLD_D}`, textShadow: `0 ${size / 20}px 0 rgba(51,54,92,.15)`, ...style }}>?</span>
  )
}
