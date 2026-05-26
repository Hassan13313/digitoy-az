/* Digitoy.az Phase 0 — Fixed animated backdrop.
   Renders behind all content (z-index 0).
   Glass panels blur these blobs through backdrop-filter. */

export default function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#F5F0E8',
      }}
    >
      {/* Gold — top-left */}
      <div style={{
        position: 'absolute',
        width: 720, height: 720,
        left: '-8%', top: '-8%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(197,160,89,0.30) 0%, transparent 68%)',
        filter: 'blur(48px)',
        animation: 'blob-drift-1 18s ease-in-out infinite',
        willChange: 'transform',
      }} />

      {/* Rose/blush — top-right */}
      <div style={{
        position: 'absolute',
        width: 600, height: 600,
        right: '-6%', top: '-4%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,197,184,0.24) 0%, transparent 68%)',
        filter: 'blur(56px)',
        animation: 'blob-drift-2 22s ease-in-out infinite',
        willChange: 'transform',
      }} />

      {/* Amber — center-bottom */}
      <div style={{
        position: 'absolute',
        width: 780, height: 780,
        left: '32%', top: '42%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,213,163,0.20) 0%, transparent 68%)',
        filter: 'blur(64px)',
        animation: 'blob-drift-3 26s ease-in-out infinite',
        willChange: 'transform',
      }} />

      {/* Small gold — bottom-right */}
      <div style={{
        position: 'absolute',
        width: 460, height: 460,
        right: '4%', bottom: '8%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(197,160,89,0.16) 0%, transparent 68%)',
        filter: 'blur(44px)',
        animation: 'blob-drift-4 20s ease-in-out infinite',
        willChange: 'transform',
      }} />
    </div>
  )
}
