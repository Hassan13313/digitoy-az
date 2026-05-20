import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ══════════════════════════════════════════════════
   WAX SEAL — dinamik, premium balmumu möhür
══════════════════════════════════════════════════ */
function sealInitials(eventType, brideName, groomName) {
  const first = (s) => ((s || '').trim()[0] || '').toUpperCase()
  if (eventType === 'toy' || eventType === 'nishan') {
    const b = first(brideName), g = first(groomName)
    return b && g ? `${b}${g}` : b || g || null
  }
  if (eventType === 'birthday') return first(brideName) || null
  return null // corporate/other → simvol
}

function WaxSeal({ eventType, brideName, groomName, pulse = true }) {
  const initials    = sealInitials(eventType, brideName, groomName)
  const isCorp      = eventType === 'corporate' || eventType === 'other'
  const isDeepRed   = eventType === 'toy' || eventType === 'nishan'
  const sealGrad    = isDeepRed
    ? 'radial-gradient(circle at 34% 30%, #8B1A1A 0%, #6B0F0F 40%, #4A0808 80%, #3A0505 100%)'
    : 'radial-gradient(circle at 34% 30%, #C8860A 0%, #A0600A 40%, #7A4008 80%, #5A2C04 100%)'
  const rimColor    = isDeepRed ? 'rgba(180,50,50,0.55)' : 'rgba(197,160,89,0.55)'

  return (
    <div className="relative flex items-center justify-center" style={{ width: 60, height: 60 }}>
      {/* Outer glow pulse */}
      {pulse && (
        <div className="absolute rounded-full" style={{
          inset: '-8px',
          background: isDeepRed
            ? 'radial-gradient(circle, rgba(139,26,26,0.28) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(197,160,89,0.28) 0%, transparent 70%)',
          animation: 'seal-glow 2.6s ease-in-out infinite',
        }} />
      )}
      {/* Wax blob — irregular border-radius simulates real wax */}
      <div style={{
        width: 56, height: 56,
        background: sealGrad,
        borderRadius: '52% 48% 50% 46% / 48% 52% 46% 54%',
        boxShadow: `0 4px 18px rgba(0,0,0,0.45), inset 0 2px 4px rgba(255,255,255,0.14), inset 0 -3px 6px rgba(0,0,0,0.35)`,
        border: `1.5px solid ${rimColor}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* Wax texture overlay — subtle radial lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 56 56">
          {[0,30,60,90,120,150].map(a => (
            <line key={a}
              x1="28" y1="28"
              x2={28 + 30 * Math.cos(a * Math.PI / 180)}
              y2={28 + 30 * Math.sin(a * Math.PI / 180)}
              stroke="white" strokeWidth="0.8"
            />
          ))}
        </svg>
        {/* Inner emboss ring */}
        <div style={{
          position: 'absolute', inset: 7,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.20)',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.25)',
        }} />
        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {isCorp ? (
            /* Corporate — öküz gözü / floral seal motif */
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4" stroke="rgba(255,255,255,0.75)" strokeWidth="1"/>
              {[0,45,90,135,180,225,270,315].map((deg, i) => {
                const r  = 9, rad = deg * Math.PI / 180
                const x2 = 12 + r * Math.cos(rad), y2 = 12 + r * Math.sin(rad)
                const mx = 12 + 6.5 * Math.cos(rad), my = 12 + 6.5 * Math.sin(rad)
                return <line key={i} x1="12" y1="12" x2={x2} y2={y2} stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
              })}
              <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" strokeDasharray="2 2"/>
            </svg>
          ) : initials ? (
            <span style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: initials.length === 1 ? 20 : 14,
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
   PREMIUM ENVELOPE OPENING
══════════════════════════════════════════════════ */
export default function EnvelopeOpening({
  brideName, groomName, eventLabel, eventType = 'toy', onComplete,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [done,   setDone]   = useState(false)

  const handleClick = () => {
    if (isOpen) return
    setIsOpen(true)
    setTimeout(() => { setDone(true); setTimeout(() => onComplete(), 650) }, 2100)
  }

  const isCorp   = eventType === 'corporate' || eventType === 'other'
  const isCouple = eventType === 'toy' || eventType === 'nishan'

  /* ── envelope palette ── */
  const ENV = {
    body:    'linear-gradient(165deg, #FBF8F0 0%, #F4EFE2 60%, #EDE5D4 100%)',
    flap:    'linear-gradient(180deg, #F2EBD9 0%, #E8DFC8 100%)',
    flapSh:  'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 55%)',
    edge:    'rgba(197,160,89,0.32)',
    inner:   'linear-gradient(180deg, #FDFAF4 0%, #F8F3E8 100%)',
    shadow:  '0 24px 80px rgba(0,0,0,0.13), 0 6px 24px rgba(197,160,89,0.12), inset 0 1px 0 rgba(255,255,255,0.7)',
  }

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'linear-gradient(160deg, #FAF7F0 0%, #F2EBD9 100%)' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Radial ambient glow */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 65% 45% at 50% 42%, rgba(197,160,89,0.13) 0%, transparent 68%)',
          }} />
          {/* Fine noise texture overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px',
          }} />

          <div
            className="relative w-full max-w-[340px] cursor-pointer select-none"
            style={{ perspective: '1600px' }}
            onClick={handleClick}
          >
            {/* ════════ ENVELOPE BODY ════════ */}
            <div
              className="relative"
              style={{
                width: '100%', paddingBottom: '65%',
                background: ENV.body,
                border: `1px solid ${ENV.edge}`,
                boxShadow: ENV.shadow,
              }}
            >
              {/* Gold top trim line */}
              <div className="absolute top-0 left-0 right-0 h-px" style={{
                background: 'linear-gradient(to right, transparent 0%, rgba(197,160,89,0.6) 30%, rgba(197,160,89,0.8) 50%, rgba(197,160,89,0.6) 70%, transparent 100%)',
              }} />
              {/* Gold bottom trim line */}
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{
                background: 'linear-gradient(to right, transparent 0%, rgba(197,160,89,0.4) 30%, rgba(197,160,89,0.55) 50%, rgba(197,160,89,0.4) 70%, transparent 100%)',
              }} />

              {/* ── Bottom fold triangles ── */}
              {/* Left triangle */}
              <div className="absolute bottom-0 left-0" style={{
                width: 0, height: 0,
                borderStyle: 'solid',
                borderWidth: '0 0 94px 175px',
                borderColor: 'transparent transparent rgba(205,195,178,0.6) transparent',
              }} />
              {/* Right triangle */}
              <div className="absolute bottom-0 right-0" style={{
                width: 0, height: 0,
                borderStyle: 'solid',
                borderWidth: '0 175px 94px 0',
                borderColor: 'transparent rgba(205,195,178,0.6) transparent transparent',
              }} />
              {/* Center bottom gold diamond ornament */}
              <div className="absolute bottom-0 left-1/2" style={{
                transform: 'translateX(-50%) translateY(50%) rotate(45deg)',
                width: 10, height: 10,
                background: 'linear-gradient(135deg, rgba(197,160,89,0.5), rgba(197,160,89,0.2))',
                border: '1px solid rgba(197,160,89,0.4)',
              }} />

              {/* ── FLAP (top lid) ── */}
              <motion.div
                className="absolute top-0 left-0 right-0"
                style={{
                  height: '60%',
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                  zIndex: isOpen ? 0 : 20,
                }}
                animate={isOpen ? { rotateX: -178 } : { rotateX: 0 }}
                transition={{ type: 'spring', stiffness: 55, damping: 14, mass: 1.2 }}
              >
                {/* Flap front face */}
                <div className="absolute inset-0" style={{
                  background: ENV.flap,
                  backfaceVisibility: 'hidden',
                  clipPath: 'polygon(0 0, 100% 0, 50% 87%)',
                  borderBottom: `1px solid ${ENV.edge}`,
                }} />
                {/* Flap light sheen */}
                <div className="absolute inset-0" style={{
                  backfaceVisibility: 'hidden',
                  clipPath: 'polygon(0 0, 100% 0, 50% 87%)',
                  background: ENV.flapSh,
                }} />
                {/* Flap fold crease subtle line */}
                <div className="absolute inset-0" style={{
                  backfaceVisibility: 'hidden',
                  clipPath: 'polygon(0 0, 100% 0, 50% 87%)',
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.04) 90%, transparent 100%)',
                }} />
                {/* Flap back */}
                <div className="absolute inset-0" style={{
                  background: ENV.inner,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateX(180deg)',
                  clipPath: 'polygon(0 0, 100% 0, 50% 87%)',
                }} />

                {/* ── WAX SEAL — at flap tip ── */}
                <div className="absolute" style={{
                  bottom: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%) translateY(50%)',
                  zIndex: 30,
                }}>
                  <motion.div
                    animate={isOpen ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                    transition={{ duration: 0.28 }}
                  >
                    <WaxSeal
                      eventType={eventType}
                      brideName={brideName}
                      groomName={groomName}
                      pulse={!isOpen}
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* ── INNER CARD — slides up on open ── */}
              <motion.div
                className="absolute left-0 right-0 flex flex-col items-center justify-center text-center"
                style={{
                  top: '11%', height: '78%', zIndex: 10,
                  background: ENV.inner,
                  border: `1px solid rgba(221,213,200,0.65)`,
                  boxShadow: '0 2px 20px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.8)',
                  margin: '0 14px',
                  padding: '0 24px',
                }}
                animate={isOpen ? { y: '-44%', opacity: 1 } : { y: 0, opacity: 0.97 }}
                transition={{ delay: 0.55, duration: 0.9, ease: [0.35, 0, 0.15, 1] }}
              >
                {/* Card top gold rule */}
                <div className="absolute top-0 left-8 right-8 h-px" style={{
                  background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.5), transparent)',
                }} />
                {/* Card corner ornaments */}
                {[['top-2','left-2'],['top-2','right-2'],['bottom-2','left-2'],['bottom-2','right-2']].map(([t,l],i) => (
                  <div key={i} className={`absolute ${t} ${l} w-3 h-3`} style={{
                    borderTop:    i < 2 ? '1px solid rgba(197,160,89,0.45)' : 'none',
                    borderBottom: i >= 2 ? '1px solid rgba(197,160,89,0.45)' : 'none',
                    borderLeft:   (i===0||i===2) ? '1px solid rgba(197,160,89,0.45)' : 'none',
                    borderRight:  (i===1||i===3) ? '1px solid rgba(197,160,89,0.45)' : 'none',
                  }} />
                ))}

                <p style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '8px', letterSpacing: '0.42em',
                  textTransform: 'uppercase', color: '#C5A059',
                  fontWeight: 500, marginBottom: '12px',
                }}>
                  {eventLabel}
                </p>

                {/* Thin gold divider */}
                <div style={{
                  width: 36, height: 1, marginBottom: 12,
                  background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55), transparent)',
                }} />

                {/* Names */}
                <div style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
                  {isCouple ? (
                    <>
                      <p style={{ fontSize: 20, color: '#1A1A1A', fontWeight: 300, lineHeight: 1.2 }}>{brideName}</p>
                      <p style={{ fontSize: 13, color: '#C5A059', fontStyle: 'italic', margin: '3px 0' }}>&amp;</p>
                      <p style={{ fontSize: 20, color: '#1A1A1A', fontWeight: 300, lineHeight: 1.2 }}>{groomName}</p>
                    </>
                  ) : (
                    <p style={{
                      fontSize: isCorp ? 15 : 20, color: '#1A1A1A', fontWeight: 300,
                      letterSpacing: isCorp ? '0.12em' : '0',
                      textTransform: isCorp ? 'uppercase' : 'none',
                    }}>{brideName}</p>
                  )}
                </div>

                {/* Bottom divider */}
                <div style={{
                  width: 36, height: 1, marginTop: 12, marginBottom: 10,
                  background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55), transparent)',
                }} />

                {/* Pulse hint */}
                <motion.p
                  style={{ fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8C7B6B' }}
                  animate={{ opacity: isOpen ? 0 : [1, 0.38, 1] }}
                  transition={isOpen ? {} : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {isOpen ? 'Açılır…' : 'Açmaq üçün toxunun'}
                </motion.p>

                {/* Card bottom gold rule */}
                <div className="absolute bottom-0 left-8 right-8 h-px" style={{
                  background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.5), transparent)',
                }} />
              </motion.div>
            </div>

            {/* Instruction */}
            <motion.p
              className="text-center mt-8"
              style={{ fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#9C8B78' }}
              animate={{ opacity: isOpen ? 0 : 1 }}
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
