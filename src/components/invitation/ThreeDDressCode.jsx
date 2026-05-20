/* Luxury Dress Code Showcase — pure CSS, no Three.js */

const STYLE_ICONS = {
  blacktie: (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <path d="M21 8 L16 18 L21 16 L26 18 Z" fill="rgba(197,160,89,0.85)" />
      <path d="M21 34 L16 24 L21 26 L26 24 Z" fill="rgba(197,160,89,0.85)" />
      <rect x="19" y="17" width="4" height="8" rx="1" fill="rgba(197,160,89,0.6)" />
    </svg>
  ),
  cocktail: (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <path d="M13 10 L29 10 L22 22 L22 32 L20 32 L20 22 Z" stroke="rgba(197,160,89,0.8)" strokeWidth="1.2" fill="none" />
      <line x1="16" y1="32" x2="26" y2="32" stroke="rgba(197,160,89,0.6)" strokeWidth="1.2" />
      <circle cx="26" cy="14" r="2.5" fill="rgba(197,160,89,0.5)" />
    </svg>
  ),
  smartcasual: (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <path d="M14 12 L13 28 L29 28 L28 12 L24 14 L21 11 L18 14 Z" stroke="rgba(197,160,89,0.8)" strokeWidth="1.2" fill="none" />
      <path d="M21 11 L21 20" stroke="rgba(197,160,89,0.6)" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  ),
  creative: (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <circle cx="21" cy="21" r="10" stroke="rgba(197,160,89,0.7)" strokeWidth="1.2" strokeDasharray="3 2" fill="none" />
      <path d="M17 18 Q21 14 25 18 Q21 22 17 18Z" fill="rgba(197,160,89,0.55)" />
      <path d="M17 24 Q21 28 25 24 Q21 20 17 24Z" fill="rgba(197,160,89,0.55)" />
    </svg>
  ),
  pastel: (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      {[0,60,120,180,240,300].map((deg, i) => {
        const r = 12, rad = deg * Math.PI / 180
        const x = 21 + r * Math.cos(rad), y = 21 + r * Math.sin(rad)
        return <circle key={i} cx={x} cy={y} r="4" fill="rgba(197,160,89,0.5)" />
      })}
      <circle cx="21" cy="21" r="4" fill="rgba(197,160,89,0.8)" />
    </svg>
  ),
}

function FabricShimmer({ color }) {
  const lightColor = color + 'CC'
  return (
    <div style={{
      width: '100%',
      height: 120,
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 2,
    }}>
      {/* Base fabric */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(135deg, ${color}22 0%, ${color}44 40%, ${color}18 70%, ${color}33 100%)`,
      }} />
      {/* Weave texture lines horizontal */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 7px, rgba(255,255,255,0.06) 7px, rgba(255,255,255,0.06) 8px)',
      }} />
      {/* Weave texture lines vertical */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(90deg, transparent, transparent 7px, rgba(255,255,255,0.04) 7px, rgba(255,255,255,0.04) 8px)',
      }} />
      {/* Shimmer sweep */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)',
        animation: 'fabric-shimmer 3.5s ease-in-out infinite',
      }} />
      {/* Gold trim lines */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55) 30%, rgba(197,160,89,0.75) 50%, rgba(197,160,89,0.55) 70%, transparent)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.4) 30%, rgba(197,160,89,0.6) 50%, rgba(197,160,89,0.4) 70%, transparent)',
      }} />
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
      background: 'linear-gradient(160deg, #FDFAF4 0%, #F8F2E4 60%, #F2EAD6 100%)',
      border: '1px solid rgba(197,160,89,0.18)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Fabric shimmer strip */}
      <FabricShimmer color={color} />

      {/* Content */}
      <div style={{ padding: '28px 24px 24px', textAlign: 'center', position: 'relative' }}>
        {/* Style icon */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 64, height: 64,
          border: '1px solid rgba(197,160,89,0.25)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197,160,89,0.08) 0%, transparent 70%)',
          marginBottom: 20,
        }}>
          {iconEl}
        </div>

        {/* Color swatches — large, gold-framed circles */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
          {colors.map((c, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            }}>
              {/* Outer gold ring */}
              <div style={{
                width: 52, height: 52,
                border: '1px solid rgba(197,160,89,0.35)',
                borderRadius: '50%',
                padding: 4,
                background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.3), transparent 70%)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06), inset 0 1px 2px rgba(255,255,255,0.4)',
              }}>
                {/* Color fill */}
                <div style={{
                  width: '100%', height: '100%',
                  borderRadius: '50%',
                  backgroundColor: c,
                  boxShadow: `inset 0 2px 6px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.1)`,
                  background: `radial-gradient(circle at 35% 30%, ${c}EE, ${c} 50%, ${c}CC 100%)`,
                }} />
              </div>
              {/* Hex label */}
              <span style={{
                fontSize: 8, color: 'rgba(140,123,107,0.7)',
                fontFamily: '"Inter", system-ui, sans-serif',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                {c}
              </span>
            </div>
          ))}
        </div>

        {/* Thin gold divider */}
        <div style={{
          width: 48, height: 1, margin: '0 auto 14px',
          background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55), transparent)',
        }} />

        {/* Style name */}
        {label && (
          <p style={{
            fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
            fontSize: 15, fontWeight: 400, fontStyle: 'italic',
            color: 'rgba(26,26,26,0.75)',
            letterSpacing: '0.04em',
          }}>
            {label}
          </p>
        )}
      </div>

      <style>{`
        @keyframes fabric-shimmer {
          0%   { transform: translateX(-100%); }
          60%  { transform: translateX(200%);  }
          100% { transform: translateX(200%);  }
        }
      `}</style>
    </div>
  )
}
