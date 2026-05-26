import { useRef, useState } from 'react'

/* Aceternity-style Glowing Effect — cursor yaxınlaşanda kart kənarı parlayır */
export default function GlowingCard({ children, style = {}, className = '', glowColor = 'rgba(197,160,89,0.55)' }) {
  const ref = useRef(null)
  const [glow, setGlow] = useState({ x: 0, y: 0, opacity: 0 })

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setGlow({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setGlow(g => ({ ...g, opacity: 0 }))}
      className={className}
      style={{ position: 'relative', ...style }}
    >
      {/* Border glow layer */}
      <div
        style={{
          position: 'absolute',
          inset: -1,
          borderRadius: 'inherit',
          background: `radial-gradient(320px circle at ${glow.x}px ${glow.y}px, ${glowColor}, transparent 70%)`,
          opacity: glow.opacity,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
        {children}
      </div>
    </div>
  )
}
