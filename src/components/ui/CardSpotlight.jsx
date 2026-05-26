import { useRef, useState } from 'react'

export default function CardSpotlight({ children, style = {}, className = '', spotColor = 'rgba(197,160,89,0.09)' }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: '50%', y: '50%' })
  const [visible, setVisible] = useState(false)

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos({
      x: `${e.clientX - rect.left}px`,
      y: `${e.clientY - rect.top}px`,
    })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
    >
      {/* Spotlight radial gradient following cursor */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(280px circle at ${pos.x} ${pos.y}, ${spotColor}, transparent 70%)`,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.35s ease',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
