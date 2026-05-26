import { useEffect, useRef, useState } from 'react'

function randomBetween(min, max) { return Math.random() * (max - min) + min }

function Sparkle({ x, y, color, size, style }) {
  return (
    <svg
      aria-hidden
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        pointerEvents: 'none',
        animation: 'sparkle-fade 0.7s ease-in-out forwards',
        ...style,
      }}
      viewBox="0 0 68 68"
      fill="none"
    >
      <path
        d="M34 0C34 0 34 28 34 34C34 34 28 34 0 34C0 34 28 34 34 34C34 34 34 40 34 68C34 68 34 40 34 34C34 34 40 34 68 34C68 34 40 34 34 34C34 34 34 28 34 0Z"
        fill={color}
      />
    </svg>
  )
}

export default function SparklesText({ children, color = '#C5A059', className = '', style = {}, density = 5 }) {
  const [sparkles, setSparkles] = useState([])
  const id = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const newSparkle = {
        id: id.current++,
        x: `${randomBetween(0, 100)}%`,
        y: `${randomBetween(0, 100)}%`,
        color,
        size: randomBetween(6, 14),
      }
      setSparkles(prev => [...prev.slice(-density * 2), newSparkle])
      setTimeout(() => setSparkles(prev => prev.filter(s => s.id !== newSparkle.id)), 700)
    }, 280)

    return () => clearInterval(interval)
  }, [color, density])

  return (
    <span
      className={className}
      style={{ position: 'relative', display: 'inline-block', ...style }}
    >
      {sparkles.map(s => (
        <Sparkle key={s.id} {...s} />
      ))}
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>

      <style>{`
        @keyframes sparkle-fade {
          0%   { transform: scale(0) rotate(0deg);   opacity: 0; }
          40%  { transform: scale(1) rotate(45deg);  opacity: 1; }
          100% { transform: scale(0) rotate(90deg);  opacity: 0; }
        }
      `}</style>
    </span>
  )
}
