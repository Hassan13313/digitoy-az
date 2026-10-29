import { C, VELVET, DUST } from './palette'

/* MASQUERADE BALL — Venesiya maskası, məxmər pərdələr, qızılı toz */

/** Venesiya maskası (lələkli) */
export function Mask({ size = 240, stick = true, style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 220 150" width={size} height={size * 0.68} style={{ display: 'block', overflow: 'visible', ...style }}>
      <defs>
        <linearGradient id="mb-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A6822F" /><stop offset=".35" stopColor="#F4DC9C" /><stop offset=".6" stopColor="#D9B25F" /><stop offset="1" stopColor="#8A6A22" />
        </linearGradient>
        <linearGradient id="mb-feather" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#5A1C4A" /><stop offset=".6" stopColor="#9E1B32" /><stop offset="1" stopColor="#E0486A" />
        </linearGradient>
      </defs>
      {/* lələklər */}
      <path d="M44 52C20 30 14 4 30 -20C34 6 46 26 62 40Z" fill="url(#mb-feather)" />
      <path d="M56 46C46 20 52 -6 72 -22C68 4 70 24 78 38Z" fill="#5A1C4A" />
      <path d="M36 56C8 44 -6 20 2 -4C12 20 28 36 48 48Z" fill="#9E1B32" opacity=".85" />
      <path d="M30 -20C34 6 46 26 62 40M72 -22C68 4 70 24 78 38M2 -4C12 20 28 36 48 48" fill="none" stroke="#F4DC9C" strokeWidth="1.2" opacity=".7" />
      {/* çubuq */}
      {stick && <path d="M190 74L214 150" stroke="url(#mb-gold)" strokeWidth="6" strokeLinecap="round" />}
      {/* maska */}
      <path d="M110 46C140 22 196 26 206 56C214 82 188 104 156 102C136 100 122 88 110 88C98 88 84 100 64 102C32 104 6 82 14 56C24 26 80 22 110 46Z" fill="url(#mb-gold)" stroke="#8A6A22" strokeWidth="1.5" />
      <path d="M110 54C134 36 182 38 192 60C198 78 180 92 156 92C138 92 124 80 110 80C96 80 82 92 64 92C40 92 22 78 28 60C38 38 86 36 110 54Z" fill="#3A1030" opacity=".92" />
      {/* göz yuvaları */}
      <path d="M70 58C82 52 96 56 100 64C92 72 76 72 66 66Z" fill="#0D0A10" />
      <path d="M150 58C138 52 124 56 120 64C128 72 144 72 154 66Z" fill="#0D0A10" />
      <path d="M62 54C76 44 98 48 104 62M158 54C144 44 122 48 116 62" fill="none" stroke="url(#mb-gold)" strokeWidth="3" strokeLinecap="round" />
      {/* naxış */}
      <path d="M110 80C106 88 110 96 116 94M40 76C48 86 60 86 64 80M180 76C172 86 160 86 156 80M110 40C110 30 104 24 98 26" fill="none" stroke="#F4DC9C" strokeWidth="1.6" strokeLinecap="round" opacity=".9" />
      <circle cx="110" cy="46" r="5" fill="#9E1B32" stroke="#F4DC9C" strokeWidth="1.5" />
      {[[36, 64], [184, 64], [110, 98]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.6" fill="#F4DC9C" />)}
    </svg>
  )
}

/** Məxmər pərdə tayı */
export function Curtain({ side = 'left', open = false, instant = false }) {
  const left = side === 'left'
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', top: 0, bottom: 0, [left ? 'left' : 'right']: 0, width: '54%', zIndex: 3, pointerEvents: 'none',
      background: VELVET, boxShadow: left ? 'inset -16px 0 24px -10px rgba(0,0,0,.6)' : 'inset 16px 0 24px -10px rgba(0,0,0,.6)',
      transform: `translateX(${(left ? -1 : 1) * (open ? 100 : 74)}%)`, transition: instant ? 'none' : 'transform 1.1s cubic-bezier(.6,0,.3,1) .25s',
    }}>
      <span style={{ position: 'absolute', [left ? 'right' : 'left']: '8%', top: '46%', width: 18, height: 70, borderRadius: 9, background: 'linear-gradient(90deg, #A6822F, #F4DC9C, #A6822F)', opacity: 0.9 }} />
    </div>
  )
}

/** Qızılı toz partlayışı */
export function GoldDust({ on = false }) {
  if (!on) return null
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '42%', width: 0, height: 0, pointerEvents: 'none', zIndex: 4 }}>
      {DUST.map((p, i) => (
        <span key={i} style={{ position: 'absolute', left: 0, top: 0, width: p.s, height: p.s, borderRadius: '50%', background: '#F4DC9C', boxShadow: '0 0 6px #F4DC9C', '--tx': `${Math.cos((p.a * Math.PI) / 180) * p.r}px`, '--ty': `${Math.sin((p.a * Math.PI) / 180) * p.r}px`, animation: `mb-dust ${p.dur}s ease-out ${p.d}s both` }} />
      ))}
    </span>
  )
}

/** Çilçıraq parıltısı */
export function Chandelier({ size = 120, style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 90" width={size} height={size * 0.75} style={{ display: 'block', overflow: 'visible', ...style }}>
      <line x1="60" y1="-40" x2="60" y2="20" stroke={C.GOLD} strokeWidth="2" />
      <path d="M14 40C30 60 90 60 106 40" fill="none" stroke={C.GOLD} strokeWidth="3" />
      <path d="M30 30C40 44 80 44 90 30" fill="none" stroke={C.GOLD} strokeWidth="2.5" />
      {[14, 34, 60, 86, 106].map((x, i) => (
        <g key={i}>
          <path d={`M${x} ${i === 2 ? 46 : 40}v8`} stroke={C.GOLD} strokeWidth="2" />
          <path d={`M${x} ${i === 2 ? 32 : 26}c3 5 3 8 0 10c-3-2-3-5 0-10z`} fill="#FFE7A8" style={{ filter: 'drop-shadow(0 0 4px #FFD27A)' }} />
          <path d={`M${x} ${i === 2 ? 54 : 48}l-3 8h6z`} fill="#F4DC9C" opacity=".85" />
        </g>
      ))}
      <circle cx="60" cy="20" r="5" fill={C.GOLD} />
    </svg>
  )
}
