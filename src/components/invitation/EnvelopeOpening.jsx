import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* Gold particles that burst when envelope opens */
function GoldParticle({ x, y, angle, speed, size, delay }) {
  const rad   = (angle * Math.PI) / 180
  const destX = Math.cos(rad) * speed
  const destY = Math.sin(rad) * speed

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `calc(50% + ${x}px)`,
        top:  `calc(50% + ${y}px)`,
        width: size, height: size,
        borderRadius: size > 4 ? '1px' : '50%',
        background: size > 5
          ? 'linear-gradient(135deg, #E8D5A3, #C5A059)'
          : 'radial-gradient(circle, #E8D5A3 0%, #C5A059 100%)',
        rotate: angle,
        zIndex: 20,
        pointerEvents: 'none',
      }}
      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      animate={{ opacity: 0, x: destX, y: destY, scale: 0, rotate: angle + 360 }}
      transition={{
        duration: 1.1 + Math.random() * 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    />
  )
}

function ParticleBurst({ active }) {
  if (!active) return null
  const particles = Array.from({ length: 36 }, (_, i) => ({
    angle:  (i * 10) + (Math.random() * 8 - 4),
    speed:  80 + Math.random() * 160,
    size:   Math.random() < 0.3 ? (3 + Math.random() * 4) : (2 + Math.random() * 3),
    delay:  Math.random() * 0.12,
    x:      (Math.random() - 0.5) * 20,
    y:      (Math.random() - 0.5) * 20,
  }))
  return (
    <>
      {particles.map((p, i) => <GoldParticle key={i} {...p} />)}
    </>
  )
}

/* ══════════════════════════════════════════════════
   BALMUMU MÖHÜR — nahamar kənar, real wax effekti
══════════════════════════════════════════════════ */
function sealInitials(eventType, brideName, groomName) {
  const first = (s) => ((s || '').trim()[0] || '').toUpperCase()
  if (eventType === 'toy' || eventType === 'nishan') {
    const b = first(brideName), g = first(groomName)
    return b && g ? `${b}${g}` : b || g || null
  }
  if (eventType === 'birthday') return first(brideName) || null
  return null
}

function WaxSeal({ eventType, brideName, groomName, pulse = true }) {
  const initials  = sealInitials(eventType, brideName, groomName)
  const isCorp    = eventType === 'corporate' || eventType === 'other'
  const isDeepRed = eventType === 'toy' || eventType === 'nishan'

  const sealGrad = isDeepRed
    ? 'radial-gradient(circle at 34% 28%, #9B2020 0%, #7A1010 35%, #5A0A0A 65%, #3E0606 100%)'
    : 'radial-gradient(circle at 34% 28%, #D4920C 0%, #A86C08 38%, #7A4C06 68%, #5A3404 100%)'
  const rimColor  = isDeepRed ? 'rgba(200,60,60,0.5)' : 'rgba(210,170,80,0.5)'
  const glowColor = isDeepRed ? 'rgba(155,32,32,0.3)' : 'rgba(212,146,12,0.3)'

  return (
    <div style={{ position: 'relative', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Ambient glow */}
      {pulse && (
        <div style={{
          position: 'absolute', inset: -10, borderRadius: '50%',
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 68%)`,
          animation: 'seal-glow 2.8s ease-in-out infinite',
        }} />
      )}
      {/* Outer wax ring — nahamar kənar */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '48% 52% 44% 56% / 54% 46% 56% 44%',
        background: sealGrad,
        opacity: 0.35,
        filter: 'blur(2px)',
      }} />
      {/* Main seal body */}
      <div style={{
        width: 58, height: 58,
        background: sealGrad,
        borderRadius: '52% 48% 46% 54% / 50% 54% 46% 50%',
        boxShadow: `
          0 6px 22px rgba(0,0,0,0.5),
          inset 0 3px 6px rgba(255,255,255,0.16),
          inset 0 -4px 8px rgba(0,0,0,0.4),
          inset 2px 0 4px rgba(0,0,0,0.2)
        `,
        border: `1.5px solid ${rimColor}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', flexShrink: 0,
      }}>
        {/* Wax texture — spoke lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }} viewBox="0 0 58 58">
          {[0, 25, 50, 75, 100, 125, 150, 175].map(a => (
            <line key={a} x1="29" y1="29"
              x2={29 + 32 * Math.cos(a * Math.PI / 180)}
              y2={29 + 32 * Math.sin(a * Math.PI / 180)}
              stroke="white" strokeWidth="0.7" />
          ))}
        </svg>
        {/* Inner rim circle */}
        <div style={{
          position: 'absolute', inset: 8, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.22)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
        }} />
        {/* Sheen highlight */}
        <div style={{
          position: 'absolute', top: 6, left: 10, width: 18, height: 8,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.18)',
          transform: 'rotate(-20deg)',
          filter: 'blur(1px)',
        }} />
        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {isCorp ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4.5" stroke="rgba(255,255,255,0.75)" strokeWidth="1"/>
              {[0,45,90,135,180,225,270,315].map((deg, i) => {
                const r = 9.5, rad = deg * Math.PI / 180
                return <line key={i} x1="12" y1="12"
                  x2={12 + r * Math.cos(rad)} y2={12 + r * Math.sin(rad)}
                  stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
              })}
              <circle cx="12" cy="12" r="9.5" stroke="rgba(255,255,255,0.28)" strokeWidth="0.6" strokeDasharray="2.5 2"/>
            </svg>
          ) : initials ? (
            <span style={{
              fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
              fontSize: initials.length === 1 ? 22 : 14,
              fontWeight: 500,
              fontStyle: 'italic',
              color: 'rgba(255,248,225,0.94)',
              textShadow: '0 1px 4px rgba(0,0,0,0.6), 0 0 8px rgba(0,0,0,0.3)',
              letterSpacing: initials.length > 1 ? '3px' : '0',
              userSelect: 'none',
            }}>
              {initials}
            </span>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
                fill="rgba(255,248,200,0.88)" />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   ULTRA-PREMIUM ZƏRF AÇILIŞI
   4 faz: idle → flap-open → card-rising → card-fullscreen
══════════════════════════════════════════════════ */
export default function EnvelopeOpening({
  brideName, groomName, eventLabel, eventType = 'toy', onComplete,
}) {
  const [phase,       setPhase]       = useState('idle')
  const [isDone,      setIsDone]      = useState(false)
  const [showParticles, setShowParticles] = useState(false)

  const handleClick = useCallback(() => {
    if (phase !== 'idle') return
    setPhase('flap-open')
    setTimeout(() => setShowParticles(true),        650)
    setTimeout(() => setPhase('card-rising'),       1100)
    setTimeout(() => setShowParticles(false),       1800)
    setTimeout(() => setPhase('card-fullscreen'),   2200)
    setTimeout(() => setIsDone(true),               2900)
    setTimeout(() => onComplete(),                  3200)
  }, [phase, onComplete])

  const isCorp         = eventType === 'corporate' || eventType === 'other'
  const isCouple       = eventType === 'toy' || eventType === 'nishan'
  const flapOpen       = phase !== 'idle'
  const cardRising     = phase === 'card-rising' || phase === 'card-fullscreen'
  const cardFullscreen = phase === 'card-fullscreen'

  const ENV = {
    body:   'linear-gradient(160deg, #FDFAF2 0%, #F6EFE0 55%, #EDE3CE 100%)',
    flap:   'linear-gradient(175deg, #F5EDD8 0%, #EDE1C6 55%, #E2D4B2 100%)',
    flapBk: 'linear-gradient(175deg, #FEFCF7 0%, #FAF5EC 100%)',
    inner:  'linear-gradient(160deg, #FEFCF6 0%, #F8F3E8 55%, #F2EAD8 100%)',
  }

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="envelope-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{
            background: 'linear-gradient(145deg, rgba(250,246,238,0.92) 0%, rgba(242,234,216,0.94) 50%, rgba(234,224,204,0.92) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeOut' } }}
        >
          {/* Radial ambient glow */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 70% 50% at 50% 44%, rgba(197,160,89,0.16) 0%, transparent 68%)',
          }} />
          {/* Subtle top vignette */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '35%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.03) 0%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          {/* ── FULLSCREEN CARD EXPANSION ── */}
          <AnimatePresence>
            {cardFullscreen && (
              <motion.div
                key="card-fullscreen"
                style={{
                  position: 'absolute', inset: 0, zIndex: 10,
                  background: 'linear-gradient(150deg, #FEFCF6 0%, #FAF5EC 40%, #F4EBD8 100%)',
                }}
                initial={{ opacity: 0, scale: 0.06, borderRadius: '50%' }}
                animate={{ opacity: 1, scale: 1, borderRadius: '0%' }}
                transition={{ type: 'spring', stiffness: 60, damping: 15, mass: 1.2 }}
              >
                {/* Corner ornaments */}
                {[
                  { top: 28, left: 28, bt: true,  bl: true  },
                  { top: 28, right: 28, bt: true,  br: true  },
                  { bottom: 28, left: 28, bb: true, bl: true  },
                  { bottom: 28, right: 28, bb: true, br: true  },
                ].map((o, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    top: o.top, left: o.left, right: o.right, bottom: o.bottom,
                    width: 32, height: 32,
                    borderTop:    o.bt ? '1px solid rgba(197,160,89,0.45)' : 'none',
                    borderLeft:   o.bl ? '1px solid rgba(197,160,89,0.45)' : 'none',
                    borderRight:  o.br ? '1px solid rgba(197,160,89,0.45)' : 'none',
                    borderBottom: o.bb ? '1px solid rgba(197,160,89,0.45)' : 'none',
                  }} />
                ))}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.6) 30%, rgba(197,160,89,0.8) 50%, rgba(197,160,89,0.6) 70%, transparent)',
                }} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
                  background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.45) 30%, rgba(197,160,89,0.65) 50%, rgba(197,160,89,0.45) 70%, transparent)',
                }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Gold particle burst ── */}
          <ParticleBurst active={showParticles} />

          {/* ── ENVELOPE ── */}
          <div
            className="relative w-full select-none"
            style={{
              maxWidth: 360,
              perspective: '1800px',
              cursor: phase === 'idle' ? 'pointer' : 'default',
            }}
            onClick={handleClick}
          >
            {/* Drop shadow ring under envelope */}
            <div style={{
              position: 'absolute', bottom: -16, left: '10%', right: '10%', height: 20,
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.18) 0%, transparent 70%)',
              filter: 'blur(8px)',
              pointerEvents: 'none',
            }} />

            {/* Envelope body */}
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '63%',
              background: ENV.body,
              boxShadow: `
                0 32px 80px rgba(0,0,0,0.16),
                0 12px 30px rgba(0,0,0,0.10),
                0 4px 8px rgba(0,0,0,0.06),
                inset 0 1px 0 rgba(255,255,255,0.75),
                inset 0 -1px 0 rgba(0,0,0,0.04)
              `,
              border: '1px solid rgba(197,160,89,0.3)',
            }}>
              {/* Top gold trim */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.7) 25%, rgba(230,200,130,0.9) 50%, rgba(197,160,89,0.7) 75%, transparent)',
              }} />
              {/* Bottom gold trim */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
                background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.5) 25%, rgba(197,160,89,0.7) 50%, rgba(197,160,89,0.5) 75%, transparent)',
              }} />
              {/* Left/right edge shadows */}
              <div style={{
                position: 'absolute', top: 0, left: 0, bottom: 0, width: 20,
                background: 'linear-gradient(to right, rgba(0,0,0,0.025), transparent)',
                pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute', top: 0, right: 0, bottom: 0, width: 20,
                background: 'linear-gradient(to left, rgba(0,0,0,0.025), transparent)',
                pointerEvents: 'none',
              }} />

              {/* ── INVITATION CARD (rises from envelope) ── */}
              <motion.div
                style={{
                  position: 'absolute',
                  left: 16, right: 16, top: 10, bottom: 10,
                  background: ENV.inner,
                  border: '1px solid rgba(221,213,200,0.6)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.85)',
                  zIndex: cardRising ? 10 : 2,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '0 24px',
                  overflow: 'hidden',
                }}
                initial={{ y: 0, opacity: 0 }}
                animate={cardRising ? { y: '-54%', opacity: 1 } : { y: 0, opacity: 0 }}
                transition={
                  cardRising
                    ? { type: 'spring', stiffness: 60, damping: 15, mass: 1.1, delay: 0.08 }
                    : { duration: 0.15 }
                }
              >
                {/* Card shimmer */}
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)',
                  animation: 'card-shimmer 4s ease-in-out infinite',
                }} />
                {/* Corner ornaments */}
                {[
                  { top: 9, left: 9,    bt: true, bl: true  },
                  { top: 9, right: 9,   bt: true, br: true  },
                  { bottom: 9, left: 9,  bb: true, bl: true  },
                  { bottom: 9, right: 9, bb: true, br: true  },
                ].map((o, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    top: o.top, left: o.left, right: o.right, bottom: o.bottom,
                    width: 12, height: 12,
                    borderTop:    o.bt ? '1px solid rgba(197,160,89,0.5)' : 'none',
                    borderLeft:   o.bl ? '1px solid rgba(197,160,89,0.5)' : 'none',
                    borderRight:  o.br ? '1px solid rgba(197,160,89,0.5)' : 'none',
                    borderBottom: o.bb ? '1px solid rgba(197,160,89,0.5)' : 'none',
                  }} />
                ))}
                {/* Top rule */}
                <div style={{
                  position: 'absolute', top: 0, left: 24, right: 24, height: 1,
                  background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.5), transparent)',
                }} />
                {/* Event label */}
                <p style={{
                  fontSize: '7.5px', letterSpacing: '0.42em',
                  textTransform: 'uppercase', color: 'rgba(197,160,89,0.9)',
                  fontWeight: 500, marginBottom: 10,
                  fontFamily: '"Inter", system-ui, sans-serif',
                }}>
                  {eventLabel}
                </p>
                {/* Gold divider */}
                <div style={{
                  width: 36, height: 1, marginBottom: 12,
                  background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.6), transparent)',
                }} />
                {/* Names */}
                <div style={{
                  fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
                  textAlign: 'center',
                }}>
                  {isCouple ? (
                    <>
                      <p style={{ fontSize: 20, color: '#1C1610', fontWeight: 300, lineHeight: 1.2, letterSpacing: '0.02em' }}>{brideName}</p>
                      <p style={{ fontSize: 13, color: 'rgba(197,160,89,0.85)', fontStyle: 'italic', margin: '4px 0', fontWeight: 300 }}>&amp;</p>
                      <p style={{ fontSize: 20, color: '#1C1610', fontWeight: 300, lineHeight: 1.2, letterSpacing: '0.02em' }}>{groomName}</p>
                    </>
                  ) : (
                    <p style={{
                      fontSize: isCorp ? 13 : 20,
                      color: '#1C1610', fontWeight: 300,
                      letterSpacing: isCorp ? '0.14em' : '0.02em',
                      textTransform: isCorp ? 'uppercase' : 'none',
                      lineHeight: 1.3,
                    }}>
                      {brideName}
                    </p>
                  )}
                </div>
                {/* Bottom divider */}
                <div style={{
                  width: 36, height: 1, marginTop: 12,
                  background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.6), transparent)',
                }} />
                {/* Pulse hint */}
                <motion.p
                  style={{
                    marginTop: 9, fontSize: '7px', letterSpacing: '0.24em',
                    textTransform: 'uppercase', color: 'rgba(140,118,95,0.7)',
                    fontFamily: '"Inter", system-ui, sans-serif',
                  }}
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Açılır…
                </motion.p>
                {/* Bottom rule */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 24, right: 24, height: 1,
                  background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.5), transparent)',
                }} />
              </motion.div>

              {/* ── BOTTOM POCKET FOLDS (z=3) ── */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, zIndex: 3,
                width: 0, height: 0, borderStyle: 'solid',
                borderWidth: '0 0 92px 182px',
                borderColor: 'transparent transparent rgba(196,184,164,0.58) transparent',
              }} />
              <div style={{
                position: 'absolute', bottom: 0, right: 0, zIndex: 3,
                width: 0, height: 0, borderStyle: 'solid',
                borderWidth: '0 182px 92px 0',
                borderColor: 'transparent rgba(196,184,164,0.58) transparent transparent',
              }} />
              {/* Bottom center shadow fold */}
              <div style={{
                position: 'absolute', bottom: 0, left: '50%', zIndex: 3,
                transform: 'translateX(-50%)',
                width: 2, height: 50,
                background: 'linear-gradient(to top, rgba(0,0,0,0.06), transparent)',
              }} />
              {/* Diamond ornament */}
              <div style={{
                position: 'absolute', bottom: 0, left: '50%', zIndex: 3,
                transform: 'translateX(-50%) translateY(50%) rotate(45deg)',
                width: 10, height: 10,
                background: 'linear-gradient(135deg, rgba(197,160,89,0.55), rgba(197,160,89,0.22))',
                border: '1px solid rgba(197,160,89,0.45)',
              }} />

              {/* ── ENVELOPE FLAP (z=4) ── */}
              <motion.div
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: '58%',
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                  zIndex: 4,
                }}
                animate={flapOpen ? { rotateX: -180 } : { rotateX: 0 }}
                transition={{ type: 'spring', stiffness: 60, damping: 15, mass: 1.2 }}
              >
                {/* Flap front */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: ENV.flap,
                  backfaceVisibility: 'hidden',
                  clipPath: 'polygon(0 0, 100% 0, 50% 89%)',
                }} />
                {/* Flap front shadow edge */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backfaceVisibility: 'hidden',
                  clipPath: 'polygon(0 0, 100% 0, 50% 89%)',
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(0,0,0,0.04) 100%)',
                }} />
                {/* Flap back (inner lining) */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: ENV.flapBk,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateX(180deg)',
                  clipPath: 'polygon(0 0, 100% 0, 50% 89%)',
                }} />

                {/* ── WAX SEAL — flap ucunda ── */}
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  left: '50%',
                  transform: 'translateX(-50%) translateY(50%)',
                  zIndex: 5,
                }}>
                  <motion.div
                    animate={flapOpen ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25, ease: 'easeIn' }}
                  >
                    <WaxSeal
                      eventType={eventType}
                      brideName={brideName}
                      groomName={groomName}
                      pulse={!flapOpen}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Tap instruction */}
            <motion.p
              style={{
                textAlign: 'center', marginTop: 32,
                fontSize: '10px', letterSpacing: '0.3em',
                textTransform: 'uppercase', color: 'rgba(140,118,95,0.65)',
                fontFamily: '"Inter", system-ui, sans-serif',
              }}
              animate={{ opacity: phase === 'idle' ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              Dəvətnaməni açın
            </motion.p>
          </div>

          <style>{`
            @keyframes seal-glow {
              0%, 100% { transform: scale(1);    opacity: 0.6;  }
              50%       { transform: scale(1.28); opacity: 1;    }
            }
            @keyframes card-shimmer {
              0%   { transform: translateX(-120%); }
              55%  { transform: translateX(220%);  }
              100% { transform: translateX(220%);  }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
