import { C, ENVS } from './palette'

/* LOVE LETTERS — məktublar, ip, marka */

/** Zərf (arxa tərəfi: qapaq xətləri) */
export function Envelope({ width = 240, color = C.ENV1, children, back = true, style }) {
  return (
    <div style={{ position: 'relative', width, aspectRatio: '1.55', borderRadius: 4, background: color, boxShadow: '0 10px 18px -12px rgba(47,53,80,.5), inset 0 0 0 1px rgba(0,0,0,.05)', overflow: 'hidden', ...style }}>
      {back && (
        <svg aria-hidden="true" viewBox="0 0 155 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <path d="M0 0L77.5 54L155 0" fill="none" stroke="rgba(80,60,40,.22)" strokeWidth=".8" vectorEffect="non-scaling-stroke" />
          <path d="M0 100L62 46M155 100L93 46" fill="none" stroke="rgba(80,60,40,.14)" strokeWidth=".8" vectorEffect="non-scaling-stroke" />
          <path d="M0 0L77.5 54L155 0Z" fill="rgba(255,255,255,.18)" />
        </svg>
      )}
      {children}
    </div>
  )
}

/* Dişli kənar: deşiklər yalnız padding zolağında (məzmun sahəsi bütöv) */
const PERF_IMG = 'radial-gradient(circle at 3px 3px, transparent 2px, #000 2.4px), linear-gradient(#000, #000)'
const PERF = {
  maskImage: PERF_IMG, WebkitMaskImage: PERF_IMG,
  maskSize: '6px 6px, auto', WebkitMaskSize: '6px 6px, auto',
  maskPosition: '-3px -3px, 0 0', WebkitMaskPosition: '-3px -3px, 0 0',
  maskRepeat: 'repeat, no-repeat', WebkitMaskRepeat: 'repeat, no-repeat',
  maskClip: 'border-box, content-box', WebkitMaskClip: 'border-box, content-box',
  maskComposite: 'add', WebkitMaskComposite: 'source-over',
}

/** Poçt markası (dişli kənar) */
export function Stamp({ size = 46, color = C.ROSE_L, children, rot = 6, style }) {
  return (
    <div aria-hidden="true" style={{
      position: 'relative', width: size, height: size * 1.18, padding: 4, transform: `rotate(${rot}deg)`,
      background: '#FFFDF8', boxShadow: '0 2px 4px rgba(0,0,0,.15)',
      ...PERF, ...style,
    }}>
      <div style={{ width: '100%', height: '100%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children || <HeartLine size={size * 0.46} color="#FFFDF8" />}
      </div>
    </div>
  )
}

/** Xətli ürək */
export function HeartLine({ size = 22, color = C.ROSE, fill = 'none', style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 22" width={size} height={size * 0.92} style={{ display: 'block', overflow: 'visible', ...style }}>
      <path d="M12 20.5S2 14.4 2 7.6C2 4.4 4.5 2 7.5 2c2 0 3.6 1.1 4.5 2.7C12.9 3.1 14.5 2 16.5 2 19.5 2 22 4.4 22 7.6c0 6.8-10 12.9-10 12.9z" fill={fill} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

/** İp (çarpaz) və fiyonk — açılanda sürüşüb düşür */
export function Twine({ off = false, instant = false }) {
  const tr = instant ? 'none' : 'transform .55s cubic-bezier(.5,0,.8,.4), opacity .45s ease .1s'
  const rope = (extra) => ({
    position: 'absolute', background: `repeating-linear-gradient(45deg, ${C.TWINE} 0 3px, ${C.TWINE_D} 3px 4.5px)`, boxShadow: '0 1px 2px rgba(0,0,0,.25)', ...extra,
  })
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', transform: off ? 'translateY(70%) rotate(8deg)' : 'none', opacity: off ? 0 : 1, transition: tr, zIndex: 6 }}>
      <span style={rope({ left: '-4%', right: '-4%', top: '50%', height: 4, marginTop: -2 })} />
      <span style={rope({ top: '-6%', bottom: '-6%', left: '50%', width: 4, marginLeft: -2 })} />
      <svg viewBox="0 0 60 40" width="64" height="44" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -54%)', overflow: 'visible' }}>
        <path d="M30 20C20 6 6 6 8 16C10 26 22 24 30 20ZM30 20C40 6 54 6 52 16C50 26 38 24 30 20Z" fill="none" stroke={C.TWINE} strokeWidth="3.4" />
        <path d="M30 20L20 38M30 20L42 38" stroke={C.TWINE} strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="30" cy="20" r="4" fill={C.TWINE_D} />
      </svg>
    </div>
  )
}

/** Bağlama: zərflər yelpik kimi açılır, üstdəki məktub qalxır */
export function LetterBundle({ width = 260, open = false, letter, instant = false, front }) {
  const fan = [
    { r: -18, x: -26, y: 12 },
    { r: -8, x: -12, y: 4 },
    { r: 11, x: 16, y: 8 },
    { r: 0, x: 0, y: 0 },
  ]
  const closed = [{ r: -3 }, { r: 2.5 }, { r: -1.5 }, { r: 0.5 }]
  return (
    <div style={{ position: 'relative', width, aspectRatio: '1.55' }}>
      {ENVS.map((col, i) => {
        const f = open ? fan[i] : { x: 0, y: 0, ...closed[i] }
        const top = i === ENVS.length - 1
        return (
          <div key={i} style={{ position: 'absolute', inset: 0, transform: `translate(${f.x}%, ${f.y}%) rotate(${f.r}deg)`, transition: instant ? 'none' : `transform .7s cubic-bezier(.3,.8,.3,1) ${0.3 + i * 0.05}s`, zIndex: i }}>
            {top && (
              <div style={{
                position: 'absolute', left: '7%', right: '7%', top: '5%', height: '90%', zIndex: 0,
                transform: open ? 'translateY(-72%)' : 'translateY(0)', transition: instant ? 'none' : 'transform .7s cubic-bezier(.3,.8,.3,1) .75s',
              }}>
                {letter}
              </div>
            )}
            <Envelope width="100%" color={col} style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
              {top && front}
            </Envelope>
          </div>
        )
      })}
      <Twine off={open} instant={instant} />
    </div>
  )
}
