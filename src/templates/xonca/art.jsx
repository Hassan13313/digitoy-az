import { C, CANDLES, SWEETS } from './palette'

/* XONÇA — dekor (hamısı aria-hidden) */

/** Səkkizguşəli ulduz — mis üzərində döymə naxış */
export function Star8({ size = 14, color = C.BRASS, fill = 'none', style }) {
  return (
    <svg aria-hidden="true" viewBox="-10 -10 20 20" width={size} height={size} style={{ display: 'block', overflow: 'visible', ...style }}>
      <rect x="-6.2" y="-6.2" width="12.4" height="12.4" fill={fill} stroke={color} strokeWidth="1.2" />
      <rect x="-6.2" y="-6.2" width="12.4" height="12.4" fill={fill} stroke={color} strokeWidth="1.2" transform="rotate(45)" />
      <circle r="2.2" fill={color} />
    </svg>
  )
}

/** Döymə xətti — bölmə başlığı */
export function Engraving({ color = C.BRASS, width = 220, style }) {
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 8, width, maxWidth: '100%', margin: '0 auto', ...style }}>
      <span style={{ flex: 1, height: 3, borderTop: `1px solid ${color}`, borderBottom: `1px dotted ${color}`, opacity: 0.8 }} />
      <span style={{ width: 4, height: 4, borderRadius: '50%', background: color }} />
      <Star8 size={18} color={color} />
      <span style={{ width: 4, height: 4, borderRadius: '50%', background: color }} />
      <span style={{ flex: 1, height: 3, borderTop: `1px solid ${color}`, borderBottom: `1px dotted ${color}`, opacity: 0.8 }} />
    </div>
  )
}

/**
 * Xonça — şamlı mis məcməyi (3/4 görünüş).
 * lit=false → şamlar sönük; true olanda hər şam öz gecikməsi ilə alışır.
 */
export function Xonca({ uid = 'xc', lit = true, width = 300, style }) {
  const sorted = [...CANDLES].sort((a, b) => a.y - b.y)
  const back = sorted.filter((c) => c.y < 172)
  const front = sorted.filter((c) => c.y >= 172)
  const candle = (c) => (
    <g key={`${c.x}-${c.y}`}>
      <ellipse cx={c.x} cy={c.y} rx="9" ry="3.2" fill="rgba(40,16,6,.35)" />
      <rect x={c.x - 6} y={c.y - c.h} width="12" height={c.h} rx="2" fill={`url(#${uid}-wax)`} />
      <ellipse cx={c.x} cy={c.y - c.h} rx="6" ry="2" fill="#FFF8EC" />
      <path d={`M${c.x} ${c.y - c.h - 1}v-5`} stroke="#3A2414" strokeWidth="1.2" />
      <g style={{ opacity: lit ? 1 : 0, transition: `opacity .35s ease ${lit ? c.d + 0.25 : 0}s` }}>
        <circle cx={c.x} cy={c.y - c.h - 12} r="22" fill={`url(#${uid}-glow)`} />
        <g style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', animation: 'xc-flame 1.3s ease-in-out infinite alternate', animationDelay: `${(c.d * 1.7).toFixed(2)}s` }}>
          <path d={`M${c.x} ${c.y - c.h - 22}C${c.x + 5} ${c.y - c.h - 14} ${c.x + 5.5} ${c.y - c.h - 6} ${c.x} ${c.y - c.h - 4}C${c.x - 5.5} ${c.y - c.h - 6} ${c.x - 5} ${c.y - c.h - 14} ${c.x} ${c.y - c.h - 22}Z`} fill={`url(#${uid}-flame)`} />
        </g>
      </g>
    </g>
  )
  return (
    <svg aria-hidden="true" viewBox="0 0 300 250" width={width} style={{ display: 'block', maxWidth: '100%', overflow: 'visible', ...style }}>
      <defs>
        <radialGradient id={`${uid}-face`} cx="42%" cy="38%" r="70%">
          <stop offset="0" stopColor="#F6C495" /><stop offset=".35" stopColor="#CB7D49" /><stop offset=".72" stopColor="#99522A" /><stop offset="1" stopColor="#6A3217" />
        </radialGradient>
        <linearGradient id={`${uid}-side`} x1="0" x2="1">
          <stop offset="0" stopColor="#5A2A12" /><stop offset=".3" stopColor="#B06635" /><stop offset=".55" stopColor="#E2A06A" /><stop offset=".8" stopColor="#9C552B" /><stop offset="1" stopColor="#5A2A12" />
        </linearGradient>
        <linearGradient id={`${uid}-wax`} x1="0" x2="1">
          <stop offset="0" stopColor="#E7D2B0" /><stop offset=".45" stopColor="#FFF8EA" /><stop offset="1" stopColor="#D9BE95" />
        </linearGradient>
        <radialGradient id={`${uid}-flame`} cx="50%" cy="72%" r="60%">
          <stop offset="0" stopColor="#FFFFFF" /><stop offset=".3" stopColor="#FFE9A8" /><stop offset=".75" stopColor="#FFAE45" /><stop offset="1" stopColor="#FF7A1F" />
        </radialGradient>
        <radialGradient id={`${uid}-glow`}>
          <stop offset="0" stopColor="#FFD58A" stopOpacity=".55" /><stop offset="1" stopColor="#FFD58A" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="150" cy="232" rx="142" ry="15" fill="rgba(0,0,0,.4)" />
      {/* yan divar və muncuqlu kənar */}
      <ellipse cx="150" cy="180" rx="136" ry="50" fill={`url(#${uid}-side)`} />
      <ellipse cx="150" cy="170" rx="136" ry="50" fill={`url(#${uid}-side)`} />
      <ellipse cx="150" cy="170" rx="136" ry="50" fill="none" stroke={C.BRASS} strokeWidth="2.4" strokeDasharray="1.5 5" strokeLinecap="round" />
      {/* üz */}
      <ellipse cx="150" cy="170" rx="124" ry="43" fill={`url(#${uid}-face)`} />
      <ellipse cx="150" cy="170" rx="104" ry="35" fill="none" stroke="#5A2A12" strokeOpacity=".45" strokeWidth="1" strokeDasharray="3 3" />
      <ellipse cx="150" cy="170" rx="80" ry="27" fill="none" stroke="#FFE1BC" strokeOpacity=".35" strokeWidth="1" />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2
        return <path key={i} d={`M${150 + Math.cos(a) * 114} ${170 + Math.sin(a) * 39}l3 -3l3 3l-3 3z`} fill="#5A2A12" fillOpacity=".4" />
      })}

      {back.map(candle)}

      {/* xına kasası */}
      <ellipse cx="150" cy="182" rx="26" ry="7" fill="rgba(40,16,6,.35)" />
      <path d="M126 168c2 10 10 15 24 15s22-5 24-15z" fill="#F4E6CF" stroke={C.BRASS} strokeWidth="1" />
      <path d="M128 172c6 3 14 4 22 4s16-1 22-4" fill="none" stroke={C.RIBBON} strokeWidth="1.4" strokeDasharray="2 2.5" />
      <ellipse cx="150" cy="168" rx="24" ry="6.5" fill="#F4E6CF" stroke={C.BRASS} strokeWidth="1" />
      <ellipse cx="150" cy="167.5" rx="20" ry="5" fill={C.HENNA} />
      <path d="M140 166c4-3 16-3 20 0" fill="none" stroke="#A65A2B" strokeWidth="1.2" />

      {SWEETS.map((s, i) => (
        <g key={i}>
          <ellipse cx={s.x} cy={s.y + 2} rx="9" ry="3" fill="rgba(40,16,6,.3)" />
          <path d={`M${s.x - 9} ${s.y}a9 5 0 0 1 18 0a9 4 0 0 1 -18 0z`} fill={s.c} />
          <path d={`M${s.x - 5} ${s.y - 1.5}l2 1.5l2 -1.5l2 1.5l2 -1.5l2 1.5`} fill="none" stroke="#9C6A3A" strokeWidth=".7" />
        </g>
      ))}

      {front.map(candle)}

      {/* qırmızı lent */}
      <g transform="translate(150 222)">
        <path d="M0 0c-10-10-28-12-30-4s18 8 30 4zM0 0c10-10 28-12 30-4s-18 8-30 4z" fill={C.RIBBON} />
        <path d="M0 0l-14 20M0 0l12 22" stroke={C.RIBBON} strokeWidth="4" strokeLinecap="round" />
        <circle r="4.5" fill="#C93A47" />
      </g>
    </svg>
  )
}

/** Şamdanda şam — proqramda: gecə keçdikcə şam əriyir */
export function CandleStick({ h = 40, lit = true, style }) {
  return (
    <span aria-hidden="true" style={{ position: 'relative', display: 'inline-block', width: 30, height: h + 34, ...style }}>
      {lit && <span style={{ position: 'absolute', left: '50%', top: 0, width: 9, height: 16, marginLeft: -4.5, borderRadius: '50% 50% 45% 45% / 62% 62% 38% 38%', background: 'radial-gradient(circle at 50% 70%, #FFFFFF 0 18%, #FFE29A 36%, #FFA53A 72%, rgba(255,120,30,0) 100%)', transformOrigin: '50% 90%', animation: 'xc-flame 1.4s ease-in-out infinite alternate', boxShadow: '0 0 22px 8px rgba(255,180,80,.32)' }} />}
      <span style={{ position: 'absolute', left: '50%', top: 15, width: 1.4, height: 5, marginLeft: -0.7, background: '#3A2414' }} />
      <span style={{ position: 'absolute', left: 9, right: 9, top: 20, height: h, borderRadius: '2px 2px 1px 1px', background: 'linear-gradient(90deg, #E7D2B0, #FFF8EA 45%, #D9BE95)' }} />
      <span style={{ position: 'absolute', left: 3, right: 3, bottom: 6, height: 6, borderRadius: '50%', background: 'linear-gradient(90deg, #7E3F1E, #E3A06C 50%, #7E3F1E)' }} />
      <span style={{ position: 'absolute', left: 9, right: 9, bottom: 0, height: 8, borderRadius: '0 0 50% 50%', background: 'linear-gradient(90deg, #6A3217, #C97B48 50%, #6A3217)' }} />
    </span>
  )
}
