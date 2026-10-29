import { C as PAL, BUNTING, KNIT } from './palette'
import { usePalette } from '../_shared/palette'

/* TEDDY BEAR — dekor */

/**
 * Ayıcıq (öndən). `wave` — sağ əl yellənir; `holding` — əlində ürək.
 * Tikiş xətləri (qırıq xətt) plüş oyuncaq hissi verir.
 */
export function Teddy({ width = 200, wave = false, holding = 'heart', style, children }) {
  const C = usePalette(PAL)
  const fur = C.HONEY
  const furD = C.HONEY_D
  const light = '#F3DCC0'
  return (
    <div style={{ position: 'relative', width, ...style }}>
      <svg aria-hidden="true" viewBox="0 0 200 220" width="100%" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <radialGradient id="tb-fur" cx="45%" cy="35%" r="70%">
            <stop offset="0" stopColor="#DDB083" /><stop offset=".7" stopColor={fur} /><stop offset="1" stopColor="#B4855A" />
          </radialGradient>
        </defs>
        {/* ayaqlar */}
        <ellipse cx="66" cy="196" rx="26" ry="20" fill="url(#tb-fur)" />
        <ellipse cx="134" cy="196" rx="26" ry="20" fill="url(#tb-fur)" />
        <ellipse cx="66" cy="200" rx="14" ry="11" fill={light} />
        <ellipse cx="134" cy="200" rx="14" ry="11" fill={light} />
        {/* bədən */}
        <ellipse cx="100" cy="150" rx="56" ry="54" fill="url(#tb-fur)" />
        <ellipse cx="100" cy="158" rx="34" ry="34" fill={light} />
        <path d="M100 104V200" stroke={furD} strokeOpacity=".35" strokeWidth="1.4" strokeDasharray="3 3" />
        {/* sol əl (ürəyi tutur) */}
        <ellipse cx="54" cy="140" rx="16" ry="26" transform="rotate(30 54 140)" fill="url(#tb-fur)" />
        {/* sağ əl (yellənir) */}
        <g style={{ transformBox: 'fill-box', transformOrigin: '20% 90%', animation: wave ? 'tb-wave .5s ease-in-out 3 alternate' : 'none' }}>
          <ellipse cx="150" cy="128" rx="16" ry="26" transform="rotate(-36 150 128)" fill="url(#tb-fur)" />
        </g>
        {holding === 'heart' && (
          <path d="M78 150c-8-10-24-4-20 8 3 9 20 18 20 18s17-9 20-18c4-12-12-18-20-8z" fill={C.BLUSH_D} stroke="#FFFFFF" strokeWidth="2" />
        )}
        {/* baş */}
        <circle cx="52" cy="40" r="20" fill="url(#tb-fur)" />
        <circle cx="148" cy="40" r="20" fill="url(#tb-fur)" />
        <circle cx="52" cy="40" r="11" fill={light} />
        <circle cx="148" cy="40" r="11" fill={light} />
        <circle cx="100" cy="72" r="50" fill="url(#tb-fur)" />
        <path d="M58 58C64 34 136 34 142 58" fill="none" stroke={furD} strokeOpacity=".3" strokeWidth="1.4" strokeDasharray="3 3" />
        <ellipse cx="100" cy="88" rx="24" ry="19" fill={light} />
        <ellipse cx="100" cy="80" rx="8" ry="6" fill="#3B2A1E" />
        <path d="M100 86v6M92 96c4 4 12 4 16 0" stroke="#3B2A1E" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="80" cy="64" r="5" fill="#3B2A1E" />
        <circle cx="120" cy="64" r="5" fill="#3B2A1E" />
        <circle cx="81.6" cy="62.4" r="1.6" fill="#FFFFFF" />
        <circle cx="121.6" cy="62.4" r="1.6" fill="#FFFFFF" />
        <ellipse cx="70" cy="82" rx="7" ry="4" fill={C.BLUSH_D} opacity=".45" />
        <ellipse cx="130" cy="82" rx="7" ry="4" fill={C.BLUSH_D} opacity=".45" />
        {/* papyon */}
        <path d="M100 120l-18-10v20zM100 120l18-10v20z" fill={C.SKY_D} />
        <circle cx="100" cy="120" r="5" fill="#9BBFD8" />
      </svg>
      {children}
    </div>
  )
}

/** Ürəkcik */
export function Heart($p) {
  const C = usePalette(PAL)
  const { size = 18, color = C.BLUSH_D, style } = $p
  return (
    <svg aria-hidden="true" viewBox="0 0 24 22" width={size} height={size * 0.92} style={{ display: 'block', ...style }}>
      <path d="M12 21S2 14 2 7.5C2 4 4.6 2 7.3 2c2 0 3.6 1.1 4.7 2.8C13.1 3.1 14.7 2 16.7 2 19.4 2 22 4 22 7.5 22 14 12 21 12 21z" fill={color} />
    </svg>
  )
}

/** Düymə (4 dəlikli) */
export function Button($p) {
  const C = usePalette(PAL)
  const { size = 34, color = C.SKY, style } = $p
  return (
    <span aria-hidden="true" style={{ position: 'relative', display: 'inline-block', width: size, height: size, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #FFFFFF, ${color} 60%)`, boxShadow: `inset 0 0 0 ${size * 0.08}px rgba(0,0,0,.06), 0 3px 6px rgba(91,67,50,.18)`, ...style }}>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, y]) => (
        <span key={`${x}${y}`} style={{ position: 'absolute', left: '50%', top: '50%', width: size * 0.13, height: size * 0.13, marginLeft: x * size * 0.12 - size * 0.065, marginTop: y * size * 0.12 - size * 0.065, borderRadius: '50%', background: 'rgba(91,67,50,.45)' }} />
      ))}
    </span>
  )
}

/** Bayraqcıq girlyandası */
export function Bunting({ count = 8, height = 54, style }) {
  const C = usePalette(PAL)
  return (
    <div aria-hidden="true" style={{ position: 'relative', height, ...style }}>
      <svg viewBox="0 0 400 20" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, width: '100%', height: 20 }}>
        <path d="M0 2Q200 26 400 2" fill="none" stroke={C.HONEY_D} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      </svg>
      <div style={{ position: 'absolute', left: '3%', right: '3%', top: 0, display: 'flex', justifyContent: 'space-between' }}>
        {Array.from({ length: count }, (_, i) => {
          const t = (i + 0.5) / count
          const sag = Math.sin(t * Math.PI) * 11
          return (
            <span key={i} style={{ width: 30, height: 36, marginTop: sag, clipPath: 'polygon(0 0, 100% 0, 50% 100%)', background: `${KNIT(C)(C.INK, 0.08)}, ${BUNTING(C)[i % BUNTING(C).length]}`, transformOrigin: '50% 0', animation: `tb-flag ${2.4 + (i % 3) * 0.5}s ease-in-out ${i * 0.2}s infinite alternate` }} />
          )
        })}
      </div>
    </div>
  )
}

/** Trikotaj yamaq — sayğac, masa */
export function Patch($p) {
  const C = usePalette(PAL)
  const { children, color = C.SKY, style } = $p
  return (
    <div style={{ position: 'relative', borderRadius: 22, background: `${KNIT(C)(C.INK, 0.09)}, ${color}`, outline: '2px dashed rgba(255,255,255,.85)', outlineOffset: -8, boxShadow: '0 10px 18px -12px rgba(91,67,50,.45)', ...style }}>
      {children}
    </div>
  )
}
