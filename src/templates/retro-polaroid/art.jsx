import { C, RAINBOW, SUNSET } from './palette'

/* RETRO POLAROID — ani foto, 70-ci illər */

/** Göy qurşağı zolağı (4 rəng) */
export function Rainbow({ vertical = false, thick = 6, style }) {
  const dir = vertical ? '90deg' : '180deg'
  const stops = RAINBOW.map((c, i) => `${c} ${i * 25}% ${(i + 1) * 25}%`).join(', ')
  return <span aria-hidden="true" style={{ display: 'block', ...(vertical ? { width: thick * 4 } : { height: thick * 4 }), background: `linear-gradient(${dir}, ${stops})`, ...style }} />
}

/** 70-ci illər gün batımı səhnəsi (foto sahəsi) */
export function SunsetScene({ children, sun = true }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: SUNSET }}>
      {sun && <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '30%', width: '56%', aspectRatio: '1', transform: 'translateX(-50%)', borderRadius: '50%', background: 'linear-gradient(180deg, #FFE7A3, #F6C35A)', maskImage: 'repeating-linear-gradient(180deg, #000 0 9%, transparent 9% 11.5%)', WebkitMaskImage: 'repeating-linear-gradient(180deg, #000 0 9%, transparent 9% 11.5%)', opacity: 0.95 }} />}
      {/* təpələr */}
      <svg aria-hidden="true" viewBox="0 0 100 40" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '34%' }}>
        <path d="M0 22C18 10 32 12 48 20C64 28 80 14 100 18V40H0Z" fill="#7A3B2A" />
        <path d="M0 30C22 22 40 26 58 32C74 37 88 28 100 30V40H0Z" fill="#4A2519" />
      </svg>
      {children && <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{children}</div>}
    </div>
  )
}

/**
 * Polaroid — `developed=false` olanda foto qaramtıl-boz (hələ aşkarlanmayıb),
 * true olanda yavaş-yavaş rəngə keçir.
 */
export function Polaroid({ width = 240, photo, caption, developed = true, rot = 0, instant = false, style }) {
  return (
    <div style={{ position: 'relative', width, padding: '6% 6% 0', background: C.WHITE, borderRadius: 3, boxShadow: '0 18px 30px -18px rgba(59,36,24,.55), 0 1px 2px rgba(59,36,24,.15)', transform: rot ? `rotate(${rot}deg)` : undefined, ...style }}>
      <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: '#2A2420' }}>
        {photo}
        <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 40% 40%, #4A423C, #1F1A17)', opacity: developed ? 0 : 1, transition: instant ? 'none' : 'opacity 1.25s ease-in .35s' }} />
        <span aria-hidden="true" style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.18), inset 0 0 28px rgba(0,0,0,.25)' }} />
      </div>
      <div style={{ minHeight: typeof width === 'number' ? width * 0.24 : 54, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 4px', textAlign: 'center' }}>
        {caption}
      </div>
    </div>
  )
}

/** Retro ani foto kamerası */
export function Camera({ width = 220, flash = false }) {
  return (
    <div aria-hidden="true" style={{ position: 'relative', width, aspectRatio: '1.45', pointerEvents: 'none' }}>
      {/* gövdə */}
      <div style={{ position: 'absolute', inset: '12% 0 0', borderRadius: 18, background: 'linear-gradient(180deg, #FBF5E8, #E8DCC4)', boxShadow: '0 20px 30px -16px rgba(0,0,0,.6), inset 0 -6px 0 rgba(0,0,0,.08)' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: '30%', height: '22%', display: 'flex', justifyContent: 'flex-start', paddingLeft: '12%' }}>
          {RAINBOW.map((c) => <span key={c} style={{ width: '5%', height: '100%', background: c }} />)}
        </div>
        {/* obyektiv */}
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: '46%', aspectRatio: '1', transform: 'translate(-50%, -46%)', borderRadius: '50%', background: 'radial-gradient(circle, #1A1512 0 30%, #3A322D 31% 44%, #121010 45% 58%, #2A2420 59% 100%)', boxShadow: '0 0 0 5px #2A2420, 0 6px 10px rgba(0,0,0,.4)' }}>
          <span style={{ position: 'absolute', left: '30%', top: '26%', width: '14%', height: '14%', borderRadius: '50%', background: 'rgba(255,255,255,.6)' }} />
        </div>
        {/* foto çıxışı */}
        <span style={{ position: 'absolute', left: '14%', right: '14%', bottom: '5%', height: 5, borderRadius: 3, background: '#2A2420' }} />
      </div>
      {/* üst hissə: flaş + düymə */}
      <div style={{ position: 'absolute', left: '8%', top: 0, width: '34%', height: '22%', borderRadius: '10px 10px 0 0', background: '#2A2420' }}>
        <span style={{ position: 'absolute', inset: '18% 12%', borderRadius: 4, background: flash ? '#FFFFFF' : 'linear-gradient(135deg, #CFC6B8, #8E857A)', boxShadow: flash ? '0 0 30px 14px rgba(255,255,255,.9)' : 'none', transition: 'background .1s, box-shadow .3s' }} />
      </div>
      <span style={{ position: 'absolute', right: '14%', top: '5%', width: '13%', height: '10%', borderRadius: '50% 50% 0 0', background: C.RED }} />
    </div>
  )
}
