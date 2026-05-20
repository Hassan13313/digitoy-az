import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ══════════════════════════════════════════════════
   BALMUMU MÖHÜR
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
  const sealGrad  = isDeepRed
    ? 'radial-gradient(circle at 34% 30%, #8B1A1A 0%, #6B0F0F 40%, #4A0808 80%, #3A0505 100%)'
    : 'radial-gradient(circle at 34% 30%, #C8860A 0%, #A0600A 40%, #7A4008 80%, #5A2C04 100%)'
  const rimColor  = isDeepRed ? 'rgba(180,50,50,0.55)' : 'rgba(197,160,89,0.55)'

  return (
    <div style={{ position: 'relative', width: 58, height: 58, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {pulse && (
        <div style={{
          position: 'absolute', inset: -8, borderRadius: '50%',
          background: isDeepRed
            ? 'radial-gradient(circle, rgba(139,26,26,0.28) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(197,160,89,0.28) 0%, transparent 70%)',
          animation: 'seal-glow 2.6s ease-in-out infinite',
        }} />
      )}
      <div style={{
        width: 54, height: 54,
        background: sealGrad,
        borderRadius: '52% 48% 50% 46% / 48% 52% 46% 54%',
        boxShadow: '0 4px 18px rgba(0,0,0,0.45), inset 0 2px 4px rgba(255,255,255,0.14), inset 0 -3px 6px rgba(0,0,0,0.35)',
        border: `1.5px solid ${rimColor}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', flexShrink: 0,
      }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }} viewBox="0 0 54 54">
          {[0,30,60,90,120,150].map(a => (
            <line key={a} x1="27" y1="27"
              x2={27 + 30 * Math.cos(a * Math.PI / 180)}
              y2={27 + 30 * Math.sin(a * Math.PI / 180)}
              stroke="white" strokeWidth="0.8" />
          ))}
        </svg>
        <div style={{
          position: 'absolute', inset: 7, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.20)',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.25)',
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          {isCorp ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4" stroke="rgba(255,255,255,0.75)" strokeWidth="1"/>
              {[0,45,90,135,180,225,270,315].map((deg, i) => {
                const r = 9, rad = deg * Math.PI / 180
                return <line key={i} x1="12" y1="12"
                  x2={12 + r * Math.cos(rad)} y2={12 + r * Math.sin(rad)}
                  stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
              })}
              <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" strokeDasharray="2 2"/>
            </svg>
          ) : initials ? (
            <span style={{
              fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
              fontSize: initials.length === 1 ? 20 : 13,
              fontWeight: 600,
              color: 'rgba(255,245,220,0.92)',
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              letterSpacing: initials.length > 1 ? '2px' : '0',
              userSelect: 'none',
            }}>
              {initials}
            </span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
                fill="rgba(255,245,200,0.85)" />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   PREMIUM ZƏRF AÇILIŞI
   Anatomiya: arxa qat → cib qatı → dəvətnamə vərəqi → üçbucaq qapaq → möhür
   Animasiya: qapaq açılır → vərəq yuxarı çıxır → tam ekran genişlənir
══════════════════════════════════════════════════ */
export default function EnvelopeOpening({
  brideName, groomName, eventLabel, eventType = 'toy', onComplete,
}) {
  // phases: 'idle' → 'flap-open' → 'card-rising' → 'card-fullscreen' → done
  const [phase, setPhase]   = useState('idle')
  const [isDone, setIsDone] = useState(false)

  const handleClick = () => {
    if (phase !== 'idle') return
    setPhase('flap-open')
    setTimeout(() => setPhase('card-rising'),     1050)
    setTimeout(() => setPhase('card-fullscreen'), 2100)
    setTimeout(() => { setIsDone(true) },          2750)
    setTimeout(() => onComplete(),                 3100)
  }

  const isCorp    = eventType === 'corporate' || eventType === 'other'
  const isCouple  = eventType === 'toy' || eventType === 'nishan'
  const flapOpen  = phase !== 'idle'
  const cardRising = phase === 'card-rising' || phase === 'card-fullscreen'
  const cardFullscreen = phase === 'card-fullscreen'

  /* Envelope colour tokens */
  const ENV = {
    body:   'linear-gradient(165deg, #FBF8F0 0%, #F4EFE2 60%, #EDE5D4 100%)',
    flap:   'linear-gradient(180deg, #F2EBD9 0%, #E8DFC8 100%)',
    flapBk: 'linear-gradient(180deg, #FDFAF4 0%, #F8F3E8 100%)',
    edge:   'rgba(197,160,89,0.32)',
    inner:  'linear-gradient(180deg, #FDFAF4 0%, #F8F3E8 100%)',
    shadow: '0 28px 90px rgba(0,0,0,0.14), 0 6px 24px rgba(197,160,89,0.12), inset 0 1px 0 rgba(255,255,255,0.7)',
  }

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="envelope-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'linear-gradient(160deg, #FAF7F0 0%, #F2EBD9 100%)' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          {/* Ambient radial glow */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 65% 45% at 50% 42%, rgba(197,160,89,0.14) 0%, transparent 70%)',
          }} />

          {/* ── FULLSCREEN CARD EXPANSION OVERLAY ── */}
          <AnimatePresence>
            {cardFullscreen && (
              <motion.div
                key="card-fullscreen"
                style={{
                  position: 'absolute', inset: 0, zIndex: 10,
                  background: 'linear-gradient(160deg, #FDFAF4 0%, #F8F3E8 50%, #F2EBD9 100%)',
                }}
                initial={{ opacity: 0, scale: 0.08, borderRadius: '50%' }}
                animate={{ opacity: 1, scale: 1, borderRadius: '0%' }}
                transition={{ type: 'spring', stiffness: 58, damping: 20, mass: 1.2 }}
              >
                {/* Corner ornaments on fullscreen */}
                {[
                  { top: 24, left: 24, bT: true,  bL: true,  bB: false, bR: false },
                  { top: 24, right: 24, bT: true,  bR: true,  bB: false, bL: false },
                  { bottom: 24, left: 24, bB: true, bL: true,  bT: false, bR: false },
                  { bottom: 24, right: 24, bB: true, bR: true,  bT: false, bL: false },
                ].map((o, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    top: o.top, left: o.left, right: o.right, bottom: o.bottom,
                    width: 28, height: 28,
                    borderTop:    o.bT ? '1px solid rgba(197,160,89,0.4)' : 'none',
                    borderLeft:   o.bL ? '1px solid rgba(197,160,89,0.4)' : 'none',
                    borderRight:  o.bR ? '1px solid rgba(197,160,89,0.4)' : 'none',
                    borderBottom: o.bB ? '1px solid rgba(197,160,89,0.4)' : 'none',
                  }} />
                ))}
                {/* Top/bottom gold lines */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55) 30%, rgba(197,160,89,0.75) 50%, rgba(197,160,89,0.55) 70%, transparent)',
                }} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
                  background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.45) 30%, rgba(197,160,89,0.6) 50%, rgba(197,160,89,0.45) 70%, transparent)',
                }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── ENVELOPE ── */}
          <div
            className="relative w-full select-none"
            style={{ maxWidth: 340, perspective: '1600px', cursor: phase === 'idle' ? 'pointer' : 'default' }}
            onClick={handleClick}
          >
            {/* Envelope body container */}
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '65%',
              background: ENV.body,
              border: `1px solid ${ENV.edge}`,
              boxShadow: ENV.shadow,
            }}>
              {/* Gold trim top */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.65) 30%, rgba(197,160,89,0.85) 50%, rgba(197,160,89,0.65) 70%, transparent)',
              }} />
              {/* Gold trim bottom */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
                background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.45) 30%, rgba(197,160,89,0.6) 50%, rgba(197,160,89,0.45) 70%, transparent)',
              }} />

              {/* ── INVITATION CARD (z=2) — hidden inside envelope ── */}
              <motion.div
                style={{
                  position: 'absolute',
                  left: 14, right: 14, top: 8, bottom: 8,
                  background: ENV.inner,
                  border: '1px solid rgba(221,213,200,0.65)',
                  boxShadow: '0 2px 20px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.8)',
                  zIndex: cardRising ? 10 : 2,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '0 22px',
                }}
                initial={{ y: 0, opacity: 0 }}
                animate={
                  cardRising
                    ? { y: '-52%', opacity: 1 }
                    : { y: 0, opacity: 0 }
                }
                transition={
                  cardRising
                    ? { type: 'spring', stiffness: 56, damping: 14, mass: 1.1, delay: 0.05 }
                    : { duration: 0.15 }
                }
              >
                {/* Card corner ornaments */}
                {[
                  { top: 8, left: 8,   bT: true,  bL: true,  bB: false, bR: false },
                  { top: 8, right: 8,  bT: true,  bR: true,  bB: false, bL: false },
                  { bottom: 8, left: 8,  bB: true, bL: true,  bT: false, bR: false },
                  { bottom: 8, right: 8, bB: true, bR: true,  bT: false, bL: false },
                ].map((o, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    top: o.top, left: o.left, right: o.right, bottom: o.bottom,
                    width: 11, height: 11,
                    borderTop:    o.bT ? '1px solid rgba(197,160,89,0.45)' : 'none',
                    borderLeft:   o.bL ? '1px solid rgba(197,160,89,0.45)' : 'none',
                    borderRight:  o.bR ? '1px solid rgba(197,160,89,0.45)' : 'none',
                    borderBottom: o.bB ? '1px solid rgba(197,160,89,0.45)' : 'none',
                  }} />
                ))}
                {/* Card top rule */}
                <div style={{
                  position: 'absolute', top: 0, left: 24, right: 24, height: 1,
                  background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.5), transparent)',
                }} />

                {/* Event label */}
                <p style={{
                  fontSize: '7.5px', letterSpacing: '0.4em',
                  textTransform: 'uppercase', color: '#C5A059',
                  fontWeight: 500, marginBottom: 9,
                  fontFamily: '"Inter", system-ui, sans-serif',
                }}>
                  {eventLabel}
                </p>

                {/* Gold divider */}
                <div style={{
                  width: 32, height: 1, marginBottom: 11,
                  background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55), transparent)',
                }} />

                {/* Names */}
                <div style={{
                  fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
                  textAlign: 'center',
                }}>
                  {isCouple ? (
                    <>
                      <p style={{ fontSize: 19, color: '#1A1A1A', fontWeight: 300, lineHeight: 1.2 }}>{brideName}</p>
                      <p style={{ fontSize: 12, color: '#C5A059', fontStyle: 'italic', margin: '3px 0', fontWeight: 300 }}>&amp;</p>
                      <p style={{ fontSize: 19, color: '#1A1A1A', fontWeight: 300, lineHeight: 1.2 }}>{groomName}</p>
                    </>
                  ) : (
                    <p style={{
                      fontSize: isCorp ? 13 : 19,
                      color: '#1A1A1A', fontWeight: 300,
                      letterSpacing: isCorp ? '0.12em' : '0',
                      textTransform: isCorp ? 'uppercase' : 'none',
                      lineHeight: 1.3,
                    }}>
                      {brideName}
                    </p>
                  )}
                </div>

                {/* Bottom divider */}
                <div style={{
                  width: 32, height: 1, marginTop: 11,
                  background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55), transparent)',
                }} />

                {/* Pulse hint */}
                <motion.p
                  style={{
                    marginTop: 8, fontSize: '7px', letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#8C7B6B',
                    fontFamily: '"Inter", system-ui, sans-serif',
                  }}
                  animate={{ opacity: [1, 0.38, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Açılır…
                </motion.p>

                {/* Card bottom rule */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 24, right: 24, height: 1,
                  background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.5), transparent)',
                }} />
              </motion.div>

              {/* ── BOTTOM CİB FOLDS (z=3) — pocket walls covering card bottom ── */}
              {/* Left triangle fold */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, zIndex: 3,
                width: 0, height: 0,
                borderStyle: 'solid',
                borderWidth: '0 0 93px 172px',
                borderColor: 'transparent transparent rgba(202,192,175,0.62) transparent',
              }} />
              {/* Right triangle fold */}
              <div style={{
                position: 'absolute', bottom: 0, right: 0, zIndex: 3,
                width: 0, height: 0,
                borderStyle: 'solid',
                borderWidth: '0 172px 93px 0',
                borderColor: 'transparent rgba(202,192,175,0.62) transparent transparent',
              }} />
              {/* Center bottom diamond ornament */}
              <div style={{
                position: 'absolute', bottom: 0, left: '50%', zIndex: 3,
                transform: 'translateX(-50%) translateY(50%) rotate(45deg)',
                width: 9, height: 9,
                background: 'linear-gradient(135deg, rgba(197,160,89,0.5), rgba(197,160,89,0.2))',
                border: '1px solid rgba(197,160,89,0.4)',
              }} />

              {/* ── ENVELOPE FLAP (z=4) — üçbucaq qapaq, yuxarıdan açılır ── */}
              <motion.div
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: '58%',
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                  zIndex: 4,
                }}
                animate={flapOpen ? { rotateX: -180 } : { rotateX: 0 }}
                transition={{ type: 'spring', stiffness: 50, damping: 13, mass: 1.25 }}
              >
                {/* Flap front face */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: ENV.flap,
                  backfaceVisibility: 'hidden',
                  clipPath: 'polygon(0 0, 100% 0, 50% 88%)',
                  borderBottom: `1px solid ${ENV.edge}`,
                }} />
                {/* Flap light sheen */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backfaceVisibility: 'hidden',
                  clipPath: 'polygon(0 0, 100% 0, 50% 88%)',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.24) 0%, transparent 55%)',
                }} />
                {/* Flap fold depth shadow */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backfaceVisibility: 'hidden',
                  clipPath: 'polygon(0 0, 100% 0, 50% 88%)',
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0.04) 92%, transparent 100%)',
                }} />
                {/* Flap back — inner lining (görünür qapaq açıldıqda) */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: ENV.flapBk,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateX(180deg)',
                  clipPath: 'polygon(0 0, 100% 0, 50% 88%)',
                }} />

                {/* ── WAX SEAL — flap tipinin iti ucunda ── */}
                <div style={{
                  position: 'absolute',
                  bottom: '-1px',
                  left: '50%',
                  transform: 'translateX(-50%) translateY(50%)',
                  zIndex: 5,
                }}>
                  <motion.div
                    animate={flapOpen ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                    transition={{ duration: 0.22, ease: 'easeIn' }}
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

            {/* Instruction */}
            <motion.p
              style={{
                textAlign: 'center', marginTop: 28,
                fontSize: '10px', letterSpacing: '0.28em',
                textTransform: 'uppercase', color: '#9C8B78',
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
              0%, 100% { transform: scale(1);    opacity: 0.55; }
              50%       { transform: scale(1.22); opacity: 1;    }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
