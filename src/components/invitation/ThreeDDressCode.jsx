/* ══════════════════════════════════════════════════
   LUXURY DRESS CODE — Glassmorphism 3D showcase
   No Three.js. Pure CSS depth, shimmer, gold glow.
══════════════════════════════════════════════════ */

const STYLE_ICONS = {
  blacktie: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      {/* Bow tie */}
      <path d="M20 16 L13 12 L13 20 L20 17Z" fill="rgba(197,160,89,0.75)"/>
      <path d="M20 16 L27 12 L27 20 L20 17Z" fill="rgba(197,160,89,0.6)"/>
      <path d="M20 24 L13 20 L13 28 L20 23Z" fill="rgba(197,160,89,0.6)"/>
      <path d="M20 24 L27 20 L27 28 L20 23Z" fill="rgba(197,160,89,0.75)"/>
      <circle cx="20" cy="20" r="2.5" fill="rgba(197,160,89,0.9)"/>
    </svg>
  ),
  cocktail: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M11 10 L29 10 L21.5 23 L21.5 32 L18.5 32 L18.5 23 Z" stroke="rgba(197,160,89,0.8)" strokeWidth="1.2" fill="rgba(197,160,89,0.08)"/>
      <line x1="14" y1="32" x2="26" y2="32" stroke="rgba(197,160,89,0.55)" strokeWidth="1.2"/>
      <circle cx="24.5" cy="13.5" r="3" fill="none" stroke="rgba(197,160,89,0.7)" strokeWidth="1"/>
      <path d="M22 16 L27 11" stroke="rgba(197,160,89,0.5)" strokeWidth="0.8"/>
    </svg>
  ),
  smartcasual: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      {/* Shirt outline */}
      <path d="M14 11 L11 16 L15 16 L15 30 L25 30 L25 16 L29 16 L26 11 L22.5 14 L20 11 L17.5 14 Z" stroke="rgba(197,160,89,0.75)" strokeWidth="1.1" fill="rgba(197,160,89,0.07)" strokeLinejoin="round"/>
      <line x1="20" y1="11" x2="20" y2="22" stroke="rgba(197,160,89,0.5)" strokeWidth="0.9" strokeDasharray="2 2"/>
    </svg>
  ),
  creative: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="11" stroke="rgba(197,160,89,0.65)" strokeWidth="1" strokeDasharray="3 2.5" fill="none"/>
      <path d="M15 17 Q20 12 25 17 Q20 22 15 17Z" fill="rgba(197,160,89,0.55)"/>
      <path d="M15 23 Q20 28 25 23 Q20 18 15 23Z" fill="rgba(197,160,89,0.45)"/>
      <circle cx="20" cy="20" r="2" fill="rgba(197,160,89,0.8)"/>
    </svg>
  ),
  pastel: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      {[0,60,120,180,240,300].map((deg,i) => {
        const r = 11, rad = deg * Math.PI / 180
        return <circle key={i} cx={20 + r*Math.cos(rad)} cy={20 + r*Math.sin(rad)} r="4" fill="rgba(197,160,89,0.5)"/>
      })}
      <circle cx="20" cy="20" r="4.5" fill="rgba(197,160,89,0.85)"/>
    </svg>
  ),
}

function ColorSphere({ color, size = 48 }) {
  return (
    <div style={{
      width: size, height: size,
      position: 'relative',
      cursor: 'default',
      filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.14))',
      transition: 'transform 0.25s ease, filter 0.25s ease',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px) scale(1.08)'
      e.currentTarget.style.filter = 'drop-shadow(0 8px 18px rgba(0,0,0,0.2))'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = ''
      e.currentTarget.style.filter = 'drop-shadow(0 4px 10px rgba(0,0,0,0.14))'
    }}
    >
      {/* Gold ring */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        padding: 4,
        background: 'conic-gradient(from 45deg, rgba(197,160,89,0.8), rgba(230,200,130,0.95), rgba(180,140,60,0.7), rgba(230,200,130,0.95), rgba(197,160,89,0.8))',
        boxShadow: '0 0 0 1px rgba(197,160,89,0.2), 0 2px 8px rgba(197,160,89,0.2)',
      }}>
        {/* Color fill */}
        <div style={{
          width: '100%', height: '100%',
          borderRadius: '50%',
          background: `radial-gradient(circle at 32% 28%, color-mix(in srgb, ${color} 60%, white 40%) 0%, ${color} 50%, color-mix(in srgb, ${color} 85%, black 15%) 100%)`,
          boxShadow: 'inset 0 -3px 8px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.3)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Specular highlight */}
          <div style={{
            position: 'absolute', top: '15%', left: '20%',
            width: '36%', height: '22%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.55) 0%, transparent 80%)',
            transform: 'rotate(-20deg)',
            filter: 'blur(1px)',
          }} />
        </div>
      </div>
    </div>
  )
}

export default function ThreeDDressCode({ color = '#C9A88A', palette, lang }) {
  const styleKey = palette?.id || 'smartcasual'
  const iconEl   = STYLE_ICONS[styleKey] || STYLE_ICONS.smartcasual
  const colors   = palette?.colors || [color]
  const label    = palette?.label?.[lang] || palette?.label?.az || ''

  return (
    <div style={{
      position: 'relative',
      background: 'linear-gradient(145deg, #FBF8F0 0%, #F6EFE0 50%, #EDE4CE 100%)',
      border: '1px solid rgba(197,160,89,0.2)',
      overflow: 'hidden',
    }}>
      {/* Background shimmer bands */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(115deg, transparent, transparent 40px, rgba(255,255,255,0.04) 40px, rgba(255,255,255,0.04) 41px)',
      }} />

      {/* Glassmorphism top panel */}
      <div style={{
        position: 'relative',
        margin: '24px 24px 0',
        background: 'rgba(255,255,255,0.42)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.7)',
        borderBottom: '1px solid rgba(197,160,89,0.15)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.85)',
        padding: '20px 20px 18px',
        display: 'flex', alignItems: 'center', gap: 18,
      }}>
        {/* Style icon container — 3D depth */}
        <div style={{
          width: 64, height: 64, flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(253,250,244,0.6))',
          border: '1px solid rgba(197,160,89,0.28)',
          borderBottom: '1px solid rgba(197,160,89,0.4)',
          boxShadow: `
            0 8px 20px rgba(0,0,0,0.08),
            0 2px 4px rgba(0,0,0,0.04),
            inset 0 1px 2px rgba(255,255,255,0.9),
            0 0 0 1px rgba(197,160,89,0.08)
          `,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 2,
          transform: 'perspective(200px) rotateY(-4deg)',
        }}>
          {iconEl}
        </div>
        {/* Label area */}
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(197,160,89,0.85)', marginBottom: 6,
            fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 500,
          }}>
            Dress Code · Style
          </p>
          {label && (
            <p style={{
              fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
              fontSize: 18, fontWeight: 300, fontStyle: 'italic',
              color: '#1C1610', letterSpacing: '0.03em', lineHeight: 1.2,
            }}>
              {label}
            </p>
          )}
          {/* Gold rule */}
          <div style={{
            height: 1, marginTop: 10,
            background: 'linear-gradient(to right, rgba(197,160,89,0.5), transparent)',
          }} />
        </div>
      </div>

      {/* Color spheres panel */}
      <div style={{
        margin: '0 24px 24px',
        background: 'rgba(255,255,255,0.28)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.6)',
        borderTop: 'none',
        boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
        padding: '22px 20px',
      }}>
        <p style={{
          fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase',
          color: 'rgba(140,123,107,0.65)', marginBottom: 18, textAlign: 'center',
          fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 500,
        }}>
          Color Palette
        </p>
        <div style={{
          display: 'flex', justifyContent: 'center',
          gap: 20, flexWrap: 'wrap',
        }}>
          {colors.map((c, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <ColorSphere color={c} size={52} />
              <span style={{
                fontSize: 7.5, letterSpacing: '0.08em',
                color: 'rgba(140,123,107,0.6)', textTransform: 'uppercase',
                fontFamily: '"Inter",system-ui,sans-serif',
              }}>
                {c}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Shimmer sweep animation */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.14) 50%, transparent 70%)',
        animation: 'glassmorphism-sweep 5s ease-in-out infinite',
      }} />

      <style>{`
        @keyframes glassmorphism-sweep {
          0%   { transform: translateX(-100%); }
          60%  { transform: translateX(250%);  }
          100% { transform: translateX(250%);  }
        }
      `}</style>
    </div>
  )
}
