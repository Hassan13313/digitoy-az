import { C as PAL, FLAKES, SKY_FLAKES, BAUBLES } from './palette'
import { usePalette } from '../../../_shared/palette'

/* SNOW GLOBE — qar kürəsi, oyuncaqlar, hədiyyə etiketi */

/** Küknar */
function Pine({ x, h, style }) {
  const C = usePalette(PAL)
  return (
    <svg aria-hidden="true" viewBox="0 0 40 60" style={{ position: 'absolute', left: `${x}%`, bottom: '18%', height: `${h}%`, overflow: 'visible', ...style }}>
      <path d="M20 2L34 24H27L38 40H28L40 54H0L12 40H2L13 24H6Z" fill={C.PINE} />
      <path d="M20 2L34 24H27L38 40H28L40 54H20Z" fill={C.PINE_L} opacity=".5" />
      <path d="M8 22L32 22M5 38L35 38" stroke="#FFFFFF" strokeWidth="2" opacity=".75" strokeLinecap="round" />
      <rect x="17" y="54" width="6" height="6" fill={C.WOOD} />
    </svg>
  )
}

/** Qar kürəsi — `shaking` olanda silkələnir, qar yağır */
export function SnowGlobe({ size = 260, snowing = true, shaking = false, plaque, style }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', width: size, ...style }}>
      <div style={{ position: 'relative', width: size, height: size, animation: shaking ? 'sg-shake .5s ease-in-out 2' : 'none', transformOrigin: '50% 90%' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(180deg, #2C4F7C, #4F78A8 60%, #9DBBD9)' }}>
          {/* ulduzlar */}
          <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(1.4px 1.4px at 30% 22%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 62% 16%, #fff 50%, transparent 51%), radial-gradient(1.4px 1.4px at 74% 34%, #fff 50%, transparent 51%)' }} />
          {/* ay */}
          <span aria-hidden="true" style={{ position: 'absolute', right: '22%', top: '16%', width: '12%', aspectRatio: '1', borderRadius: '50%', boxShadow: '-5px 3px 0 0 #FFF4C8' }} />
          <Pine x={14} h={34} />
          <Pine x={62} h={42} />
          <Pine x={76} h={28} />
          {/* ev */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '34%', bottom: '18%', width: '26%', height: '22%' }}>
            <span style={{ position: 'absolute', left: '-8%', right: '-8%', top: 0, height: '46%', background: C.RED_D, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} />
            <span style={{ position: 'absolute', left: '-6%', right: '-6%', top: '-4%', height: '16%', borderRadius: 6, background: '#FFFFFF', clipPath: 'polygon(50% 0, 100% 100%, 0 100%)', opacity: 0.95 }} />
            <span style={{ position: 'absolute', left: 0, right: 0, top: '44%', bottom: 0, background: '#E8D2B4' }} />
            <span style={{ position: 'absolute', left: '18%', top: '56%', width: '24%', height: '24%', background: '#FFD27A', boxShadow: '0 0 10px 3px rgba(255,210,122,.7)' }} />
            <span style={{ position: 'absolute', right: '16%', top: '58%', width: '22%', bottom: 0, background: C.WOOD }} />
          </div>
          {/* qar təpəsi */}
          <span aria-hidden="true" style={{ position: 'absolute', left: '-10%', right: '-10%', bottom: 0, height: '24%', borderRadius: '50% 50% 0 0', background: 'linear-gradient(180deg, #FFFFFF, #DCEBF7)' }} />
          {/* qar */}
          {snowing && FLAKES.map((f, i) => (
            <span key={i} aria-hidden="true" style={{ position: 'absolute', left: `${f.x}%`, top: '-4%', width: f.s, height: f.s, borderRadius: '50%', background: '#FFFFFF', opacity: 0.9, '--dx': `${f.dx}px`, animation: `sg-fall ${f.dur}s linear -${f.d}s infinite` }} />
          ))}
          {/* şüşə parıltısı */}
          <span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(40% 30% at 30% 22%, rgba(255,255,255,.55), transparent 70%), radial-gradient(circle at 50% 50%, transparent 62%, rgba(255,255,255,.25) 70%, rgba(255,255,255,.05) 72%)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.5), inset -10px -14px 30px rgba(20,40,66,.35)' }} />
        </div>
      </div>
      {/* altlıq */}
      <div style={{ position: 'relative', width: '86%', margin: '-10% auto 0', zIndex: 1 }}>
        <span aria-hidden="true" style={{ display: 'block', height: size * 0.06, borderRadius: '50%', background: 'linear-gradient(180deg, #F1D79A, #B08A3E)' }} />
        <div style={{ height: size * 0.2, borderRadius: '6px 6px 18px 18px', background: 'linear-gradient(180deg, #8A5A3A, #5E3A22)', boxShadow: '0 16px 24px -14px rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {plaque && <div style={{ padding: '4px 12px', borderRadius: 4, background: 'linear-gradient(160deg, #B08A3E, #F1D79A 45%, #C9A04A)', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.2)' }}>{plaque}</div>}
        </div>
      </div>
    </div>
  )
}

/** Ekran boyu qar */
export function SkySnow({ on = true }) {
  if (!on) return null
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {SKY_FLAKES.map((f, i) => (
        <span key={i} style={{ position: 'absolute', left: `${f.x}%`, top: '-3%', width: f.s, height: f.s, borderRadius: '50%', background: '#FFFFFF', opacity: 0.8, '--dx': `${f.dx}px`, animation: `sg-sky ${f.dur}s linear -${f.d}s infinite` }} />
      ))}
    </div>
  )
}

/** Yolka oyuncağı (sayğac üçün) */
export function Bauble({ i = 0, children, drop = 18 }) {
  const C = usePalette(PAL)
  const c = BAUBLES(C)[i % BAUBLES(C).length]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span aria-hidden="true" style={{ width: 1.5, height: drop, background: C.GOLD }} />
      <span aria-hidden="true" style={{ width: '24%', height: 9, borderRadius: '3px 3px 1px 1px', background: 'linear-gradient(90deg, #B08A3E, #F1D79A, #B08A3E)' }} />
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1', marginTop: -2, borderRadius: '50%', background: `radial-gradient(circle at 34% 30%, rgba(255,255,255,.75) 0 6%, transparent 22%), radial-gradient(circle at 50% 50%, ${c}, ${c} 55%, rgba(0,0,0,.35) 100%)`, boxShadow: '0 10px 16px -8px rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span aria-hidden="true" style={{ position: 'absolute', left: '14%', right: '14%', top: '78%', height: 3, borderRadius: 2, background: 'rgba(255,255,255,.5)' }} />
        {children}
      </div>
    </div>
  )
}

/** Qar dənəsi */
export function Flake($p) {
  const C = usePalette(PAL)
  const { size = 22, color = C.NIGHT, style } = $p
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block', ...style }}>
      <g stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none">
        {[0, 60, 120].map((a) => (
          <g key={a} transform={`rotate(${a} 12 12)`}>
            <path d="M12 2V22" /><path d="M9 4.5L12 7L15 4.5M9 19.5L12 17L15 19.5" />
          </g>
        ))}
      </g>
    </svg>
  )
}

/** Hədiyyə etiketi (masa üçün) */
export function GiftTag({ width = 210, children }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', width, margin: '0 auto', paddingTop: 34 }}>
      <svg aria-hidden="true" viewBox="0 0 100 40" width="56%" style={{ position: 'absolute', left: '22%', top: 0, overflow: 'visible' }}>
        <path d="M50 40C46 22 30 10 14 6M50 40C54 22 70 10 86 6" fill="none" stroke={C.RED} strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div style={{ position: 'relative', padding: '36px 18px 22px', background: `linear-gradient(160deg, #E4C79C, ${C.KRAFT})`, clipPath: 'polygon(20% 0, 80% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)', boxShadow: '0 16px 22px -12px rgba(0,0,0,.5)', textAlign: 'center' }}>
        <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 12, width: 14, height: 14, marginLeft: -7, borderRadius: '50%', background: C.NIGHT_D, boxShadow: `0 0 0 3px ${C.GOLD}` }} />
        {children}
      </div>
    </div>
  )
}
