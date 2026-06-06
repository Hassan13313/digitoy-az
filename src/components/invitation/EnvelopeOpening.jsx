import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── GOLD PARTICLE BURST ─── */
function GoldParticle({ angle, speed, size, delay, x, y }) {
  const rad = (angle * Math.PI) / 180
  return (
    <motion.div style={{
      position: 'absolute', left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`,
      width: size, height: size, borderRadius: size > 4 ? '1px' : '50%',
      background: size > 5
        ? 'linear-gradient(135deg,#E8D5A3,#C5A059)'
        : 'radial-gradient(circle,#EDD98A 0%,#C5A059 100%)',
      rotate: angle, zIndex: 30, pointerEvents: 'none',
    }}
      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      animate={{ opacity: 0, x: Math.cos(rad) * speed, y: Math.sin(rad) * speed, scale: 0, rotate: angle + 360 }}
      transition={{ duration: 1.1 + Math.random() * 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}
function ParticleBurst({ active }) {
  if (!active) return null
  const ps = Array.from({ length: 22 }, (_, i) => ({
    angle: i * 16.4 + (Math.random() * 6 - 3),
    speed: 52 + Math.random() * 90,
    size: Math.random() < 0.28 ? 3 + Math.random() * 4 : 2 + Math.random() * 2.5,
    delay: Math.random() * 0.1,
    x: (Math.random() - 0.5) * 10,
    y: (Math.random() - 0.5) * 10,
  }))
  return <>{ps.map((p, i) => <GoldParticle key={i} {...p} />)}</>
}

/* ─── REALISTIC WAX SEAL ─── */
function sealInitials(eventType, brideName, groomName) {
  const first = s => ((s || '').trim()[0] || '').toUpperCase()
  if (eventType === 'toy' || eventType === 'nishan') {
    const b = first(brideName), g = first(groomName)
    return b && g ? `${b}${g}` : b || g || null
  }
  return first(brideName) || null
}

function HexWaxSeal({ eventType, brideName, groomName, pulse = true, cracked = false, size = 82 }) {
  const initials = sealInitials(eventType, brideName, groomName)
  const isWed = eventType === 'toy' || eventType === 'nishan'
  const cx = size / 2, cy = size / 2
  const hex = `${cx * 0.5},${cy * 0.08} ${cx * 1.52},${cy * 0.08} ${cx * 1.94},${cy} ${cx * 1.52},${cy * 1.9} ${cx * 0.5},${cy * 1.9} ${cx * 0.08},${cy}`
  const haloHex = `${cx * 0.44},${cy * 0.02} ${cx * 1.58},${cy * 0.02} ${cx * 2.02},${cy} ${cx * 1.58},${cy * 1.96} ${cx * 0.44},${cy * 1.96} ${cx * 0.02},${cy}`
  const glowC = isWed ? 'rgba(92,14,28,0.22)' : 'rgba(197,160,89,0.18)'
  const c0 = isWed ? '#8C2232' : '#6A3218'
  const c1 = isWed ? '#5A0C1C' : '#471F0E'
  const c2 = isWed ? '#2C060F' : '#1C0C06'
  const fSize = initials ? (initials.length === 1 ? size * 0.29 : size * 0.185) : 0
  const svgW = size + 10

  return (
    <div style={{ position: 'relative', width: svgW, height: svgW, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {pulse && (
        <div style={{
          position: 'absolute', inset: -16, borderRadius: '50%',
          background: `radial-gradient(circle,${glowC} 0%,transparent 62%)`,
          animation: 'seal-glow 3.2s ease-in-out infinite', pointerEvents: 'none',
        }} />
      )}
      <AnimatePresence>
        {cracked && (
          <motion.div key="crack" style={{ position: 'absolute', inset: 0, zIndex: 12, pointerEvents: 'none' }}
            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.8, 0] }} transition={{ duration: 0.55, times: [0, 0.08, 0.4, 1] }}>
            <svg viewBox={`0 0 ${svgW} ${svgW}`} style={{ width: '100%', height: '100%' }}>
              <line x1={cx + 3} y1={cy - 28} x2={cx - 5} y2={cy - 4} stroke="rgba(255,235,185,0.95)" strokeWidth="1.8" strokeLinecap="round" />
              <line x1={cx - 5} y1={cy - 4} x2={cx + 4} y2={cy + 6} stroke="rgba(255,235,185,0.9)" strokeWidth="1.2" strokeLinecap="round" />
              <line x1={cx + 4} y1={cy + 6} x2={cx - 3} y2={cy + 26} stroke="rgba(255,235,185,0.85)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1={cx - 5} y1={cy - 4} x2={cx - 18} y2={cy + 8} stroke="rgba(255,235,185,0.55)" strokeWidth="0.9" strokeLinecap="round" />
              <line x1={cx + 2} y1={cy - 16} x2={cx + 16} y2={cy - 8} stroke="rgba(255,235,185,0.45)" strokeWidth="0.8" strokeLinecap="round" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
      <svg viewBox={`0 0 ${svgW} ${svgW}`} style={{ width: svgW, height: svgW, overflow: 'visible' }}>
        <defs>
          <filter id="wax-disp" x="-16%" y="-16%" width="132%" height="132%">
            <feTurbulence type="turbulence" baseFrequency="0.058 0.054" numOctaves="4" seed="13" result="turb" />
            <feDisplacementMap in="SourceGraphic" in2="turb" scale={size * 0.058} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="wax-spec" x="-12%" y="-12%" width="124%" height="124%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="bump" />
            <feSpecularLighting in="bump" surfaceScale="9" specularConstant="1.7" specularExponent="30" result="spec" lightingColor="rgba(255,210,135,0.72)">
              <fePointLight x={cx * 0.55} y={cy * 0.4} z={size * 0.55} />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="clip" />
            <feComposite in="SourceGraphic" in2="clip" operator="arithmetic" k1="0" k2="1" k3="0.85" k4="0" />
          </filter>
          <filter id="wax-shadow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id="wax-glow2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id="txt-shadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodColor="rgba(0,0,0,0.88)" floodOpacity="1" />
          </filter>
          <radialGradient id="wax-grad" cx="33%" cy="25%" r="74%">
            <stop offset="0%" stopColor={c0} />
            <stop offset="42%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </radialGradient>
        </defs>
        <ellipse cx={cx + 5} cy={svgW - 3} rx={size * 0.32} ry={size * 0.055} fill="rgba(0,0,0,0.3)" filter="url(#wax-shadow)" />
        <polygon points={haloHex} fill={c1} filter="url(#wax-glow2)" opacity="0.5" transform={`translate(5,5)`} />
        <polygon points={hex} fill="url(#wax-grad)" filter="url(#wax-disp)" transform={`translate(5,5)`} />
        <polygon points={hex} fill="url(#wax-grad)" filter="url(#wax-spec)" opacity="0.88" transform={`translate(5,5)`} />
        <polygon points={`${cx * 0.58},${cy * 0.18} ${cx * 1.44},${cy * 0.18} ${cx * 1.84},${cy} ${cx * 1.44},${cy * 1.8} ${cx * 0.58},${cy * 1.8} ${cx * 0.18},${cy}`}
          fill="none" stroke="rgba(197,160,89,0.65)" strokeWidth="1.3" transform={`translate(5,5)`} />
        <polygon points={`${cx * 0.68},${cy * 0.3} ${cx * 1.34},${cy * 0.3} ${cx * 1.7},${cy} ${cx * 1.34},${cy * 1.68} ${cx * 0.68},${cy * 1.68} ${cx * 0.32},${cy}`}
          fill="none" stroke="rgba(197,160,89,0.22)" strokeWidth="0.65" transform={`translate(5,5)`} />
        <ellipse cx={cx * 0.78 + 5} cy={cy * 0.6 + 5} rx={size * 0.14} ry={size * 0.075}
          fill="rgba(255,255,255,0.2)" transform={`rotate(-18,${cx * 0.78 + 5},${cy * 0.6 + 5})`}
          filter="url(#wax-glow2)" opacity="0.8" />
        {initials && (
          <text x={cx + 5} y={cy + 6} textAnchor="middle" dominantBaseline="middle"
            fontFamily="Cormorant Garamond,Playfair Display,Georgia,serif"
            fontSize={fSize} fontWeight="700" fontStyle="italic"
            fill="rgba(255,242,205,0.97)" letterSpacing={initials.length > 1 ? '2.5' : '0.5'}
            filter="url(#txt-shadow)">
            {initials}
          </text>
        )}
      </svg>
    </div>
  )
}

/* ─── PHASE 1: FULL-SCREEN INTRO TYPOGRAPHY ─── */
function IntroScene({ brideName, groomName, eventLabel, eventType, peaked }) {
  const isCouple = eventType === 'toy' || eventType === 'nishan'
  const fade = (delay) => ({
    opacity: peaked ? 1 : 0,
    transform: peaked ? 'translateY(0px)' : 'translateY(12px)',
    transition: `opacity 0.6s ease ${delay}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
  })
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', padding: '0 40px' }}>
      <div style={{ ...fade(0), fontSize: '7.5px', letterSpacing: '0.52em', textTransform: 'uppercase',
        color: 'rgba(160,128,70,0.72)', fontFamily: '"Inter",system-ui,sans-serif',
        fontWeight: 500, marginBottom: 30 }}>
        {eventLabel}
      </div>
      <div style={{ textAlign: 'center', fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif' }}>
        {isCouple ? (
          <>
            <div style={{ ...fade(0.12), fontSize: 'clamp(38px,11vw,70px)', fontWeight: 300, color: '#1E140C',
              letterSpacing: '-0.02em', lineHeight: 1.05 }}>{brideName}</div>
            <div style={{ ...fade(0.28), margin: '10px 0', fontSize: 'clamp(22px,6vw,34px)',
              fontStyle: 'italic', fontWeight: 300, color: 'rgba(168,132,60,0.68)' }}>&amp;</div>
            <div style={{ ...fade(0.42), fontSize: 'clamp(38px,11vw,70px)', fontWeight: 300, color: '#1E140C',
              letterSpacing: '-0.02em', lineHeight: 1.05 }}>{groomName}</div>
          </>
        ) : (
          <div style={{ ...fade(0.12), fontSize: 'clamp(28px,8vw,54px)', fontWeight: 300,
            color: '#1E140C', letterSpacing: '-0.01em', lineHeight: 1.1 }}>{brideName}</div>
        )}
      </div>
      <div style={{ ...fade(0.58), margin: '28px auto', width: 52, height: 1,
        background: 'linear-gradient(to right,transparent,rgba(168,132,60,0.6),transparent)' }} />
      <div style={{ ...fade(0.68),
        fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
        fontSize: 'clamp(17px,5vw,23px)', fontWeight: 400, fontStyle: 'italic',
        color: 'rgba(42,26,12,0.55)', letterSpacing: '0.015em',
        textAlign: 'center', maxWidth: 320, lineHeight: 1.45 }}>
        Bir Dəvətnamədən Daha Artığı
      </div>
    </div>
  )
}

/* ─── V3 MAIN: HERO CARD REVEAL ─── */
export default function EnvelopeOpening({
  brideName, groomName, eventLabel, eventType = 'toy', onComplete,
}) {
  const [introPeaked,    setIntroPeaked]    = useState(false)
  const [introGone,      setIntroGone]      = useState(false)
  const [cardVisible,    setCardVisible]    = useState(false)
  const [envVisible,     setEnvVisible]     = useState(false)
  const [isReady,        setIsReady]        = useState(false)
  const [flapOpen,       setFlapOpen]       = useState(false)
  const [cardRising,     setCardRising]     = useState(false)
  const [cardFullscreen, setCardFullscreen] = useState(false)
  const [isDone,         setIsDone]         = useState(false)
  const [particles,      setParticles]      = useState(false)
  const [sealCracked,    setSealCracked]    = useState(false)

  useEffect(() => {
    const ts = [
      setTimeout(() => setIntroPeaked(true),   80),
      setTimeout(() => setIntroGone(true),    2500),
      setTimeout(() => setCardVisible(true),  2900),
      setTimeout(() => setEnvVisible(true),   3950),
      setTimeout(() => setIsReady(true),      4800),
    ]
    return () => ts.forEach(clearTimeout)
  }, [])

  const handleTap = useCallback(() => {
    if (!isReady) return
    setSealCracked(true)
    setIsReady(false)
    setTimeout(() => setFlapOpen(true),        110)
    setTimeout(() => setParticles(true),       480)
    setTimeout(() => setCardRising(true),      920)
    setTimeout(() => setParticles(false),     1640)
    setTimeout(() => setCardFullscreen(true), 2080)
    setTimeout(() => setIsDone(true),         2880)
    setTimeout(() => onComplete(),            3280)
  }, [isReady, onComplete])

  const isCouple = eventType === 'toy' || eventType === 'nishan'
  const isCorp   = eventType === 'corporate' || eventType === 'other'
  const cardShadow = cardRising
    ? '0 32px 80px rgba(0,0,0,0.22),0 14px 36px rgba(0,0,0,0.12),0 4px 10px rgba(0,0,0,0.07),inset 0 2px 0 rgba(255,255,255,0.9)'
    : '0 10px 38px rgba(0,0,0,0.12),0 3px 10px rgba(0,0,0,0.06),inset 0 1.5px 0 rgba(255,255,255,0.88)'

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div key="v3" className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'linear-gradient(160deg,#FDFCFA 0%,#FAF7F1 38%,#F5EFE5 100%)' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: 'easeOut' } }}
        >
          {/* Centre bloom */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 56% 52% at 50% 44%,rgba(255,255,255,0.72) 0%,transparent 100%)' }} />
          {/* Soft vignette */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%,transparent 50%,rgba(192,172,128,0.14) 100%)' }} />

          {/* ══ PHASE 1: INTRO TYPOGRAPHY ══ */}
          <AnimatePresence>
            {!introGone && (
              <motion.div key="intro" style={{ position: 'absolute', inset: 0, zIndex: 8 }}
                initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.48 }}>
                <IntroScene brideName={brideName} groomName={groomName}
                  eventLabel={eventLabel} eventType={eventType} peaked={introPeaked} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ══ PHASES 2–4: CARD + ENVELOPE SCENE ══ */}
          <AnimatePresence>
            {cardVisible && !cardFullscreen && (
              <motion.div key="scene"
                style={{ position: 'relative', zIndex: 5, width: 'min(296px,92vw)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'visible' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.38 }}
              >
                {/* Scene stack: 228px tall, overflow visible for card rise */}
                <div style={{ position: 'relative', width: '100%', height: 228, overflow: 'visible' }}>

                  {/* ENVELOPE BODY — Phase 3+, z:2 (behind card) */}
                  <motion.div style={{
                    position: 'absolute', bottom: 0, left: 16, right: 16, height: 168,
                    background: 'linear-gradient(158deg,#F8F3E8 0%,#EEE1C4 55%,#E4D4AC 100%)',
                    boxShadow: '0 0 0 1px rgba(197,160,89,0.16),0 16px 44px rgba(0,0,0,0.1),0 5px 14px rgba(0,0,0,0.06)',
                    zIndex: 2, overflow: 'hidden',
                  }}
                    initial={{ opacity: 0, y: 10, scale: 0.93 }}
                    animate={{ opacity: envVisible ? 1 : 0, y: envVisible ? 0 : 10, scale: envVisible ? 1 : 0.93 }}
                    transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Paper grain */}
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.055, pointerEvents: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='en'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23en)'/%3E%3C/svg%3E")`,
                      backgroundSize: '180px 180px', mixBlendMode: 'multiply' }} />
                    {/* Top gold line */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                      background: 'linear-gradient(to right,transparent,rgba(197,160,89,0.9) 20%,rgba(228,200,120,1) 50%,rgba(197,160,89,0.9) 80%,transparent)' }} />
                    {/* Left fold */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 1,
                      width: 0, height: 0, borderStyle: 'solid', borderWidth: '0 0 82px 132px',
                      borderColor: 'transparent transparent rgba(196,180,150,0.52) transparent',
                      filter: 'drop-shadow(2px -5px 8px rgba(0,0,0,0.05))' }} />
                    {/* Right fold */}
                    <div style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 1,
                      width: 0, height: 0, borderStyle: 'solid', borderWidth: '0 132px 82px 0',
                      borderColor: 'transparent rgba(186,170,142,0.46) transparent transparent',
                      filter: 'drop-shadow(-2px -5px 8px rgba(0,0,0,0.04))' }} />
                    {/* Bottom diamond */}
                    <div style={{ position: 'absolute', bottom: 0, left: '50%',
                      transform: 'translateX(-50%) translateY(50%) rotate(45deg)',
                      width: 7, height: 7, zIndex: 2,
                      background: 'linear-gradient(135deg,rgba(197,160,89,0.62),rgba(197,160,89,0.22))',
                      border: '1px solid rgba(197,160,89,0.5)' }} />
                  </motion.div>

                  {/* INVITATION CARD — Phase 2+, z:4 (the HERO) */}
                  <motion.div style={{
                    position: 'absolute', bottom: 0, left: 26, right: 26, height: 140,
                    zIndex: 4,
                    background: 'linear-gradient(162deg,#FEFCF6 0%,#FAF6EC 52%,#F2ECD8 100%)',
                    border: '1px solid rgba(212,196,168,0.46)',
                    boxShadow: cardShadow,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '0 14px', overflow: 'hidden',
                  }}
                    initial={{ opacity: 0, filter: 'blur(10px)', scale: 1.04, y: 0 }}
                    animate={cardRising
                      ? { opacity: 1, filter: 'blur(0px)', scale: 1, y: -195, rotateX: 0 }
                      : { opacity: 1, filter: 'blur(0px)', scale: 1, y: 0, rotateX: 0 }}
                    transition={cardRising
                      ? { duration: 1.65, ease: [0.04, 1, 0.06, 1] }
                      : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Paper grain */}
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='cg'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23cg)'/%3E%3C/svg%3E")`,
                      backgroundSize: '130px 130px' }} />
                    {/* Top edge highlight */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2.5,
                      background: 'linear-gradient(to bottom,rgba(255,255,255,0.9),transparent)' }} />
                    {/* Shimmer */}
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
                      background: 'linear-gradient(108deg,transparent 28%,rgba(255,255,255,0.18) 50%,transparent 72%)',
                      animation: 'card-shimmer 5.5s ease-in-out infinite' }} />
                    {/* Corner ornaments */}
                    {[{ top: 7, left: 7, bt: true, bl: true }, { top: 7, right: 7, bt: true, br: true },
                      { bottom: 7, left: 7, bb: true, bl: true }, { bottom: 7, right: 7, bb: true, br: true }].map((o, i) => (
                      <div key={i} style={{ position: 'absolute',
                        top: o.top, left: o.left, right: o.right, bottom: o.bottom, width: 9, height: 9,
                        borderTop: o.bt ? '1px solid rgba(197,160,89,0.44)' : 'none',
                        borderLeft: o.bl ? '1px solid rgba(197,160,89,0.44)' : 'none',
                        borderRight: o.br ? '1px solid rgba(197,160,89,0.44)' : 'none',
                        borderBottom: o.bb ? '1px solid rgba(197,160,89,0.44)' : 'none',
                      }} />
                    ))}
                    <div style={{ position: 'absolute', top: 0, left: 16, right: 16, height: 1,
                      background: 'linear-gradient(to right,transparent,rgba(197,160,89,0.44),transparent)' }} />
                    {/* Card content */}
                    <p style={{ fontSize: '6px', letterSpacing: '0.42em', textTransform: 'uppercase',
                      color: 'rgba(197,160,89,0.82)', margin: '0 0 6px',
                      fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 500 }}>{eventLabel}</p>
                    <div style={{ width: 26, height: 1, marginBottom: 9,
                      background: 'linear-gradient(to right,transparent,rgba(197,160,89,0.46),transparent)' }} />
                    <div style={{ textAlign: 'center', fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif' }}>
                      {isCouple ? (
                        <>
                          <p style={{ fontSize: 17, color: '#1A110A', fontWeight: 300, lineHeight: 1.18, margin: 0, letterSpacing: '0.02em' }}>{brideName}</p>
                          <p style={{ fontSize: 10, color: 'rgba(197,160,89,0.76)', fontStyle: 'italic', margin: '2px 0', fontWeight: 300 }}>&amp;</p>
                          <p style={{ fontSize: 17, color: '#1A110A', fontWeight: 300, lineHeight: 1.18, margin: 0, letterSpacing: '0.02em' }}>{groomName}</p>
                        </>
                      ) : (
                        <p style={{ fontSize: isCorp ? 12 : 17, color: '#1A110A', fontWeight: 300,
                          letterSpacing: isCorp ? '0.15em' : '0.02em',
                          textTransform: isCorp ? 'uppercase' : 'none', lineHeight: 1.2, margin: 0 }}>{brideName}</p>
                      )}
                    </div>
                    <div style={{ width: 26, height: 1, marginTop: 9,
                      background: 'linear-gradient(to right,transparent,rgba(197,160,89,0.46),transparent)' }} />
                    {/* Ornament */}
                    <div style={{ marginTop: 7, display: 'flex', gap: 5, alignItems: 'center' }}>
                      <div style={{ width: 14, height: '0.5px', background: 'rgba(197,160,89,0.38)' }} />
                      <div style={{ width: 4, height: 4, background: 'rgba(197,160,89,0.44)', transform: 'rotate(45deg)' }} />
                      <div style={{ width: 14, height: '0.5px', background: 'rgba(197,160,89,0.38)' }} />
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, left: 16, right: 16, height: 1,
                      background: 'linear-gradient(to right,transparent,rgba(197,160,89,0.38),transparent)' }} />
                  </motion.div>

                  {/* ENVELOPE FLAP + WAX SEAL — z:5 (above card, user taps seal here) */}
                  <motion.div
                    style={{
                      position: 'absolute', top: 60, left: 16, right: 16, height: 80,
                      zIndex: 5, transformStyle: 'preserve-3d', transformOrigin: 'top center',
                      cursor: envVisible && isReady ? 'pointer' : 'default',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: envVisible ? 1 : 0, rotateX: flapOpen ? -176 : 0 }}
                    transition={{
                      opacity: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                      rotateX: { type: 'tween', duration: 0.92, ease: [0.18, 0.42, 0.38, 0.96] },
                    }}
                    onClick={handleTap}
                  >
                    {/* Flap front */}
                    <div style={{ position: 'absolute', inset: 0,
                      background: 'linear-gradient(165deg,#F5EED8 0%,#EADDB8 52%,#DED0A0 100%)',
                      backfaceVisibility: 'hidden', clipPath: 'polygon(0 0,100% 0,50% 100%)' }} />
                    <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                      clipPath: 'polygon(0 0,100% 0,50% 100%)',
                      background: 'linear-gradient(to bottom,rgba(255,255,255,0.28) 0%,transparent 45%,rgba(0,0,0,0.05) 100%)',
                      pointerEvents: 'none' }} />
                    {/* Paper grain on flap */}
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backfaceVisibility: 'hidden',
                      clipPath: 'polygon(0 0,100% 0,50% 100%)', pointerEvents: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='fg'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.62' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23fg)'/%3E%3C/svg%3E")`,
                      backgroundSize: '160px 160px' }} />
                    {/* Inner lining (visible when flap flips) */}
                    <div style={{ position: 'absolute', inset: 0,
                      background: 'linear-gradient(165deg,#FDFDF9 0%,#F8F8F2 100%)',
                      backfaceVisibility: 'hidden', transform: 'rotateX(180deg)',
                      clipPath: 'polygon(0 0,100% 0,50% 100%)' }} />
                    {/* WAX SEAL */}
                    <div style={{ position: 'absolute', bottom: -4, left: '50%',
                      transform: 'translateX(-50%) translateY(50%)', backfaceVisibility: 'hidden' }}>
                      <motion.div
                        animate={flapOpen
                          ? { scale: 1.22, opacity: 0, rotate: 16 }
                          : { scale: 1, opacity: envVisible ? 1 : 0, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                      >
                        <HexWaxSeal eventType={eventType} brideName={brideName}
                          groomName={groomName} pulse={isReady && !flapOpen}
                          cracked={sealCracked} size={82} />
                      </motion.div>
                    </div>
                  </motion.div>

                </div>

                {/* TAP HINT */}
                <motion.div style={{ marginTop: 22, textAlign: 'center', display: 'flex',
                  flexDirection: 'column', alignItems: 'center', gap: 5 }}
                  animate={{ opacity: isReady && !flapOpen ? 0.62 : 0 }}
                  transition={{ duration: 0.38 }}
                >
                  <div style={{ width: 24, height: 1, background: 'linear-gradient(to right,transparent,rgba(168,128,58,0.42),transparent)' }} />
                  <p style={{ fontSize: '8.5px', letterSpacing: '0.3em', textTransform: 'uppercase',
                    color: 'rgba(136,104,52,0.7)', fontFamily: '"Inter",system-ui,sans-serif', margin: 0 }}>
                    Möhürü açın
                  </p>
                  <div style={{ width: 24, height: 1, background: 'linear-gradient(to right,transparent,rgba(168,128,58,0.42),transparent)' }} />
                </motion.div>

              </motion.div>
            )}
          </AnimatePresence>

          <ParticleBurst active={particles} />

          {/* ══ PHASE 5: FULLSCREEN EXPANSION ══ */}
          <AnimatePresence>
            {cardFullscreen && (
              <motion.div key="full" style={{ position: 'absolute', inset: 0, zIndex: 10,
                background: 'linear-gradient(150deg,#FEFCF6 0%,#FAF5EC 42%,#F4EBD8 100%)' }}
                initial={{ opacity: 0, scale: 0.065, borderRadius: '50%' }}
                animate={{ opacity: 1, scale: 1, borderRadius: '0%' }}
                transition={{ type: 'spring', stiffness: 50, damping: 13, mass: 1.5 }}
              >
                <motion.div style={{ position: 'absolute', inset: 0, background: '#FFFEFB', zIndex: 1 }}
                  initial={{ opacity: 0.8 }} animate={{ opacity: 0 }} transition={{ duration: 0.65, ease: 'easeOut' }} />
                {[{ top: 28, left: 28, bt: true, bl: true }, { top: 28, right: 28, bt: true, br: true },
                  { bottom: 28, left: 28, bb: true, bl: true }, { bottom: 28, right: 28, bb: true, br: true }].map((o, i) => (
                  <motion.div key={i} style={{ position: 'absolute',
                    top: o.top, left: o.left, right: o.right, bottom: o.bottom, width: 30, height: 30,
                    borderTop: o.bt ? '1px solid rgba(197,160,89,0.42)' : 'none',
                    borderLeft: o.bl ? '1px solid rgba(197,160,89,0.42)' : 'none',
                    borderRight: o.br ? '1px solid rgba(197,160,89,0.42)' : 'none',
                    borderBottom: o.bb ? '1px solid rgba(197,160,89,0.42)' : 'none',
                  }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 + i * 0.055, duration: 0.4 }} />
                ))}
                <div style={{ position: 'absolute', top: 0, left: 16, right: 16, height: 1,
                  background: 'linear-gradient(to right,transparent,rgba(197,160,89,0.65) 30%,rgba(197,160,89,0.85) 50%,rgba(197,160,89,0.65) 70%,transparent)' }} />
              </motion.div>
            )}
          </AnimatePresence>

          <style>{`
            @keyframes seal-glow {
              0%,100% { transform: scale(1);    opacity: 0.42; }
              50%      { transform: scale(1.38); opacity: 1;    }
            }
            @keyframes card-shimmer {
              0%   { transform: translateX(-145%); }
              55%  { transform: translateX(245%);  }
              100% { transform: translateX(245%);  }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
