/* Border Beam — kartın kənarı boyunca fırlanan işıq dəsti */
export default function BorderBeam({
  duration = 4,
  colorFrom = '#C5A059',
  colorTo = '#E8D5A3',
}) {
  return (
    <>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Rotating gradient that sweeps around the border */}
        <div
          style={{
            position: 'absolute',
            inset: '-50%',
            width: '200%',
            height: '200%',
            background: `conic-gradient(from 0deg, transparent 0%, transparent 40%, ${colorFrom} 50%, ${colorTo} 58%, transparent 65%, transparent 100%)`,
            animation: `beam-rotate ${duration}s linear infinite`,
          }}
        />
        {/* Mask to only show border ring */}
        <div
          style={{
            position: 'absolute',
            inset: 2,
            background: 'var(--border-beam-bg, #1a1105)',
            borderRadius: 'inherit',
          }}
        />
      </div>
      <style>{`
        @keyframes beam-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
