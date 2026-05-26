/* Digitoy.az Phase 0 — Element-level spot glow.
   Place INSIDE a `position: relative` parent to glow behind a specific card.

   Usage:
     <div style={{ position: 'relative' }}>
       <GlowBlob color="rgba(197,160,89,0.35)" size={300} top="-20%" left="10%" />
       <YourCard />
     </div>                                                                     */

export default function GlowBlob({
  color  = 'rgba(197, 160, 89, 0.28)',
  size   = 320,
  blur   = 60,
  style  = {},
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position:      'absolute',
        width:          size,
        height:         size,
        borderRadius:  '50%',
        background:    `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter:        `blur(${blur}px)`,
        pointerEvents: 'none',
        zIndex:         0,
        ...style,
      }}
    />
  )
}
