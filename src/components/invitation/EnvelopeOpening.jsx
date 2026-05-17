import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function EnvelopeOpening({ brideName, groomName, eventLabel, onComplete }) {
  const [isOpen, setIsOpen] = useState(false)
  const [done, setDone] = useState(false)

  const handleClick = () => {
    if (isOpen) return
    setIsOpen(true)
    setTimeout(() => {
      setDone(true)
      setTimeout(() => onComplete(), 600)
    }, 1800)
  }

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: '#FDFBF7' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(197,160,89,0.10) 0%, transparent 70%)',
            }}
          />

          <div
            className="relative w-full max-w-sm cursor-pointer select-none"
            style={{ perspective: '1200px' }}
            onClick={handleClick}
          >
            {/* Envelope body */}
            <div
              className="relative rounded-none overflow-visible"
              style={{
                width: '100%',
                paddingBottom: '70%',
                background: '#F4F1EA',
                border: '1px solid rgba(221,213,200,0.8)',
                boxShadow: '0 8px 48px rgba(0,0,0,0.07), 0 2px 12px rgba(197,160,89,0.08)',
              }}
            >
              {/* Envelope bottom triangle decorations */}
              <div
                className="absolute bottom-0 left-0 w-0 h-0"
                style={{
                  borderStyle: 'solid',
                  borderWidth: '0 0 80px 160px',
                  borderColor: `transparent transparent rgba(221,213,200,0.5) transparent`,
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-0 h-0"
                style={{
                  borderStyle: 'solid',
                  borderWidth: '0 160px 80px 0',
                  borderColor: `transparent rgba(221,213,200,0.5) transparent transparent`,
                }}
              />

              {/* Envelope flap (top lid) */}
              <motion.div
                className="absolute top-0 left-0 right-0"
                style={{
                  height: '55%',
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                  zIndex: isOpen ? 0 : 20,
                }}
                animate={isOpen ? { rotateX: -175 } : { rotateX: 0 }}
                transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* Flap face */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: '#EDE9E1',
                    backfaceVisibility: 'hidden',
                    clipPath: 'polygon(0 0, 100% 0, 50% 90%)',
                    borderBottom: '1px solid rgba(197,160,89,0.25)',
                  }}
                />
                {/* Flap back */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: '#F4F1EA',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateX(180deg)',
                    clipPath: 'polygon(0 0, 100% 0, 50% 90%)',
                  }}
                />
                {/* Gold wax seal */}
                {!isOpen && (
                  <div
                    className="absolute"
                    style={{
                      bottom: '-14px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 30,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: 'radial-gradient(circle at 35% 35%, #E8D5A3, #C5A059)',
                        boxShadow: '0 2px 8px rgba(197,160,89,0.4)',
                        border: '1px solid rgba(197,160,89,0.6)',
                      }}
                    >
                      <span className="text-[10px]" style={{ color: '#7A5C1E' }}>✦</span>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Inner card — slides up when opened */}
              <motion.div
                className="absolute left-0 right-0 flex flex-col items-center justify-center text-center px-8"
                style={{
                  top: '10%',
                  height: '80%',
                  zIndex: 10,
                  background: '#FDFBF7',
                  border: '1px solid rgba(221,213,200,0.5)',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                  margin: '0 12px',
                }}
                animate={isOpen ? { y: '-38%', opacity: 1 } : { y: 0, opacity: 0.95 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              >
                <p
                  className="text-[9px] tracking-[0.38em] uppercase font-medium mb-4"
                  style={{ color: '#C5A059' }}
                >
                  {eventLabel}
                </p>
                <div
                  className="h-px w-12 mb-4"
                  style={{ background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.5), transparent)' }}
                />
                <h2
                  className="mb-1 font-light"
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: '22px',
                    color: '#1A1A1A',
                    lineHeight: 1.2,
                  }}
                >
                  {brideName}
                </h2>
                {groomName && (
                  <>
                    <span
                      style={{
                        fontFamily: '"Playfair Display", Georgia, serif',
                        fontSize: '14px',
                        color: '#C5A059',
                        fontStyle: 'italic',
                      }}
                    >
                      &
                    </span>
                    <h2
                      className="mb-4 font-light"
                      style={{
                        fontFamily: '"Playfair Display", Georgia, serif',
                        fontSize: '22px',
                        color: '#1A1A1A',
                        lineHeight: 1.2,
                      }}
                    >
                      {groomName}
                    </h2>
                  </>
                )}
                <div
                  className="h-px w-12 mb-4"
                  style={{ background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.5), transparent)' }}
                />
                <p
                  className="text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: '#8C7B6B' }}
                >
                  {isOpen ? 'Açılır...' : 'Açmaq üçün toxunun'}
                </p>
              </motion.div>
            </div>

            {/* Instruction text below envelope */}
            <motion.p
              className="text-center mt-8 text-[11px] tracking-[0.22em] uppercase"
              style={{ color: '#8C7B6B' }}
              animate={{ opacity: isOpen ? 0 : 1 }}
            >
              Dəvətnaməni açın
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
