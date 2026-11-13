import { C as PAL, CLOUDS } from './palette'
import { usePalette } from '../../../_shared/palette'

/* LITTLE PILOT — dekor */

/** Bulud (CSS) */
export function Cloud({ w = 120, opacity = 1, style }) {
  const C = usePalette(PAL)
  return (
    <span aria-hidden="true" style={{ position: 'absolute', display: 'block', width: w, height: w * 0.42, opacity, ...style }}>
      <span style={{ position: 'absolute', left: '8%', right: '8%', bottom: 0, height: '52%', borderRadius: 999, background: C.CLOUD }} />
      <span style={{ position: 'absolute', left: '18%', bottom: '22%', width: '38%', height: '78%', borderRadius: '50%', background: C.CLOUD }} />
      <span style={{ position: 'absolute', left: '44%', bottom: '18%', width: '34%', height: '62%', borderRadius: '50%', background: C.CLOUD }} />
    </span>
  )
}

/** Sürüşən buludlar (fon) */
export function Sky({ part = false, opacity = 1 }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity }}>
      {CLOUDS.map((c, i) => (
        <span key={i} style={{ position: 'absolute', left: `${c.x}%`, top: `${c.y}%`, transform: part ? `translateX(${c.x < 40 ? -160 : 160}%)` : 'none', transition: 'transform 1.3s cubic-bezier(.5,0,.3,1) .2s' }}>
          <span style={{ display: 'block', animation: `lp2-drift ${c.d}s linear infinite alternate` }}>
            <Cloud w={c.w} opacity={c.o} style={{ position: 'relative' }} />
          </span>
        </span>
      ))}
    </div>
  )
}

/** Təyyarə (yandan, sağa baxır) */
export function Plane({ width = 130, badge, style }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', width, ...style }}>
      <svg aria-hidden="true" viewBox="0 0 140 72" width="100%" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="pl-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FF7A63" /><stop offset=".55" stopColor={C.RED} /><stop offset="1" stopColor={C.RED_D} />
          </linearGradient>
        </defs>
        {/* quyruq */}
        <path d="M8 18L22 18L34 36H14Z" fill={C.RED_D} />
        <path d="M6 36H40L36 44H10Z" fill={C.YELLOW} />
        {/* gövdə */}
        <path d="M14 34C30 24 80 22 108 28C122 31 126 40 120 46C112 52 60 54 28 48C16 46 10 40 14 34Z" fill="url(#pl-body)" />
        <path d="M30 40H110" stroke="#FFFFFF" strokeOpacity=".7" strokeWidth="2" />
        {/* kabin */}
        <path d="M70 28C74 16 92 15 98 28Z" fill="#CDEEFC" stroke={C.NAVY} strokeWidth="1.5" />
        <path d="M82 18V28" stroke={C.NAVY} strokeWidth="1.2" />
        {/* qanad */}
        <path d="M54 42L96 42L90 58H46Z" fill={C.YELLOW} stroke={C.RED_D} strokeWidth="1" />
        {/* təkərlər */}
        <path d="M64 50L60 62M84 50L88 62" stroke={C.NAVY} strokeWidth="2" />
        <circle cx="60" cy="64" r="5" fill={C.NAVY} /><circle cx="88" cy="64" r="5" fill={C.NAVY} />
        <circle cx="60" cy="64" r="2" fill="#FFFFFF" /><circle cx="88" cy="64" r="2" fill="#FFFFFF" />
        {/* burun və pərvanə */}
        <path d="M118 32C126 34 128 42 120 46Z" fill={C.NAVY} />
        <g style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'lp2-prop .14s linear infinite' }}>
          <ellipse cx="129" cy="39" rx="2.6" ry="22" fill={C.NAVY} opacity=".55" />
        </g>
        <circle cx="127" cy="39" r="3" fill={C.YELLOW} />
      </svg>
      {badge != null && (
        <span style={{ position: 'absolute', left: '36%', top: '42%', transform: 'translate(-50%, -50%)', minWidth: 26, height: 26, padding: '0 5px', borderRadius: 999, background: '#FFFFFF', border: `2px solid ${C.NAVY}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: C.NAVY }}>{badge}</span>
      )}
    </div>
  )
}

/** Kiçik təyyarə ikonu (proqram üçün) */
export function PlaneIcon($p) {
  const C = usePalette(PAL)
  const { size = 22, color = C.RED, style } = $p
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block', ...style }}>
      <path d="M2 13l8-1 4-8h2l-2 8 6-.5 2-2.5h1.5l-1 4 1 4H22l-2-2.5-6-.5 2 8h-2l-4-8-8-1z" fill={color} />
    </svg>
  )
}

/** Quyruq — masa nömrəsi quyruqda yazılır */
export function TailFin({ children, width = 200, style }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', width, aspectRatio: '1 / 1.05', margin: '0 auto', ...style }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, clipPath: 'polygon(30% 0, 64% 0, 100% 100%, 0 100%)', background: `linear-gradient(160deg, #FF7A63, ${C.RED} 50%, ${C.RED_D})` }} />
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: '14%', height: '10%', background: C.YELLOW, clipPath: 'polygon(4% 0, 96% 0, 100% 100%, 0 100%)' }} />
      <div style={{ position: 'absolute', left: '18%', right: '14%', top: '26%', bottom: '28%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{children}</div>
    </div>
  )
}
