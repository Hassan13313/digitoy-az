import { C as PAL, GILT, MIRROR_DIM, MIRROR_LIT } from './palette'
import { usePalette } from '../_shared/palette'

/* MIRROR & CANDLE — dekor */

/** Parıltı ulduzu ✦ (CSS) */
export function Glint($p) {
  const C = usePalette(PAL)
  const { size = 10, color = C.GOLD_L, style } = $p
  return (
    <span aria-hidden="true" style={{ display: 'inline-block', width: size, height: size, background: color, clipPath: 'polygon(50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40%)', ...style }} />
  )
}

/** Başlıq ornamenti: xətt · ✦ · oval · ✦ · xətt */
export function GiltRule($p) {
  const C = usePalette(PAL)
  const { width = 220, color = C.GOLD, style } = $p
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width, maxWidth: '100%', margin: '0 auto', ...style }}>
      <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${color})` }} />
      <Glint size={9} color={color} />
      <span style={{ width: 12, height: 17, borderRadius: '50%', border: `1px solid ${color}` }} />
      <Glint size={9} color={color} />
      <span style={{ flex: 1, height: 1, background: `linear-gradient(270deg, transparent, ${color})` }} />
    </div>
  )
}

/**
 * Oval güzgü — qızılı çərçivə, yuxarıda tac ornamenti. İçindəki məzmun
 * (ad, rəqəm…) uşaq kimi ötürülür. `lit` güzgünü işıqlandırır və parıltı keçir.
 */
export function Mirror({ width = 240, ratio = 1.32, lit = true, crest = true, glintKey, children, style, inner }) {
  const C = usePalette(PAL)
  const h = typeof width === 'number' ? Math.round(width * ratio) : undefined
  return (
    <div style={{ position: 'relative', width, maxWidth: '100%', margin: '0 auto', ...style }}>
      {crest && (
        <svg aria-hidden="true" viewBox="0 0 120 40" width="46%" style={{ position: 'absolute', left: '27%', top: -2, transform: 'translateY(-62%)', zIndex: 2, overflow: 'visible' }}>
          <defs>
            <linearGradient id="mc-crest" x1="0" x2="1"><stop offset="0" stopColor="#9C7A34" /><stop offset=".5" stopColor="#FFF1C4" /><stop offset="1" stopColor="#9C7A34" /></linearGradient>
          </defs>
          <path d="M60 4C70 4 74 14 70 20C78 14 92 14 98 22C104 30 98 38 90 36C94 30 88 24 80 28C74 31 70 36 60 38C50 36 46 31 40 28C32 24 26 30 30 36C22 38 16 30 22 22C28 14 42 14 50 20C46 14 50 4 60 4Z" fill="url(#mc-crest)" stroke="#6E5220" strokeWidth=".6" />
          <circle cx="60" cy="16" r="4" fill="#FFF6DA" stroke="#6E5220" strokeWidth=".6" />
        </svg>
      )}
      <div style={{ position: 'relative', width: '100%', aspectRatio: `1 / ${ratio}`, maxHeight: h, borderRadius: '50%', padding: '6%', background: GILT(C), boxShadow: '0 30px 50px -24px rgba(0,0,0,.85), inset 0 0 0 1px rgba(255,240,200,.4)' }}>
        <div style={{ position: 'absolute', inset: '3.2%', borderRadius: '50%', border: '1.5px dotted rgba(80,55,15,.55)' }} />
        <div style={{ position: 'relative', height: '100%', borderRadius: '50%', overflow: 'hidden', background: MIRROR_DIM, boxShadow: 'inset 0 0 0 2px rgba(60,40,10,.6), inset 0 8px 30px rgba(0,0,0,.6)', ...inner }}>
          <div style={{ position: 'absolute', inset: 0, background: MIRROR_LIT, opacity: lit ? 1 : 0, transition: 'opacity 1.2s ease .35s' }} />
          <div key={glintKey} aria-hidden="true" style={{ position: 'absolute', top: '-20%', bottom: '-20%', width: '38%', left: '-60%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent)', transform: lit ? 'translateX(420%) rotate(18deg)' : 'rotate(18deg)', transition: lit ? 'transform 1.3s cubic-bezier(.5,0,.3,1) .5s' : 'none' }} />
          <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 12%' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Şamdan və şam (yandırıla bilən) */
export function Candlestick({ h = 70, lit = true, delay = 0, style }) {
  const C = usePalette(PAL)
  return (
    <span aria-hidden="true" style={{ position: 'relative', display: 'inline-block', width: 44, height: h + 60, ...style }}>
      <span style={{ position: 'absolute', left: '50%', top: 0, width: 12, height: 22, marginLeft: -6, borderRadius: '50% 50% 45% 45% / 62% 62% 38% 38%', background: 'radial-gradient(circle at 50% 70%, #FFFFFF 0 18%, #FFE7A8 36%, #FFAA44 72%, rgba(255,120,30,0) 100%)', transformOrigin: '50% 90%', opacity: lit ? 1 : 0, transition: `opacity .4s ease ${delay}s`, animation: 'mc-flame 1.4s ease-in-out infinite alternate', boxShadow: lit ? '0 0 40px 16px rgba(255,190,90,.35)' : 'none' }} />
      <span style={{ position: 'absolute', left: '50%', top: 20, width: 1.5, height: 6, marginLeft: -0.75, background: '#2A1A0E' }} />
      <span style={{ position: 'absolute', left: 14, right: 14, top: 25, height: h, borderRadius: '3px 3px 1px 1px', background: 'linear-gradient(90deg, #E2D2B6, #FFF9EC 45%, #D3BE98)' }} />
      <span style={{ position: 'absolute', left: 8, right: 8, top: h + 22, height: 7, borderRadius: '50%', background: GILT(C) }} />
      <span style={{ position: 'absolute', left: 18, right: 18, top: h + 28, height: 18, background: `linear-gradient(90deg, #8C6A2A, ${C.GOLD_L} 50%, #8C6A2A)` }} />
      <span style={{ position: 'absolute', left: 6, right: 6, bottom: 0, height: 12, borderRadius: '50% 50% 4px 4px', background: 'linear-gradient(90deg, #7A5C22, #F0D48C 50%, #7A5C22)' }} />
    </span>
  )
}
