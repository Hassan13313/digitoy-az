import { useRef } from 'react'

export default function ShimmerButton({
  children,
  onClick,
  className = '',
  style = {},
  variant = 'gold', // 'gold' | 'outline'
  ...props
}) {
  const ref = useRef(null)

  const baseGold = {
    background: 'linear-gradient(135deg, #C5A059 0%, #B8903A 100%)',
    color: '#fff',
    border: 'none',
  }
  const baseOutline = {
    background: 'transparent',
    border: '1px solid rgba(197,160,89,0.55)',
    color: '#C5A059',
  }

  return (
    <button
      ref={ref}
      onClick={onClick}
      {...props}
      style={{
        ...(variant === 'gold' ? baseGold : baseOutline),
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        fontFamily: '"Inter", system-ui, sans-serif',
        fontSize: 11,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        fontWeight: 600,
        padding: '14px 36px',
        transition: 'opacity 0.25s, transform 0.2s',
        ...style,
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
      className={className}
    >
      {/* Shimmer sweep layer */}
      <span style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.32) 50%, transparent 70%)',
        animation: 'shimmer-sweep 2.4s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>

      <style>{`
        @keyframes shimmer-sweep {
          0%   { transform: translateX(-120%); }
          60%  { transform: translateX(220%); }
          100% { transform: translateX(220%); }
        }
      `}</style>
    </button>
  )
}
