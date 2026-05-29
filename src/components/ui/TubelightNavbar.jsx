import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ════════════════════════════════════════════
   TUBELIGHT NAVBAR — Mobile-first
   Desktop: tubelight indicator under active tab
   Mobile:  hamburger → slide-down menu
════════════════════════════════════════════ */
export default function TubelightNavbar({ lang, tabs, onTabClick, activeTab, logo, rightContent }) {
  const [scrolled,   setScrolled]   = useState(false)
  const [mounted,    setMounted]    = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close mobile menu on outside click */
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [menuOpen])

  const handleTab = (tab) => {
    if (menuOpen) {
      /* Menu bağlanma animasiyası 250ms — scroll 300ms sonra başlayır ki overlay blok etməsin */
      setMenuOpen(false)
      setTimeout(() => onTabClick(tab), 300)
    } else {
      onTabClick(tab)
    }
  }

  return (
    <motion.header
      ref={menuRef}
      className="fixed top-0 left-0 right-0 border-b border-beige-dark/35"
      style={{
        zIndex: 'var(--z-nav)',
        background: 'rgba(253,251,247,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.07)' : 'none',
        transition: 'box-shadow 0.4s ease',
      }}
      animate={{ height: scrolled ? 52 : 64 }}
      transition={{ duration: 0.3, ease: [0.32, 0, 0, 1] }}
    >
      <div style={{
        maxWidth: 1152, margin: '0 auto',
        padding: '0 20px',
        height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16,
      }}>
        {/* Logo */}
        <div style={{ flexShrink: 0 }}>
          {logo}
        </div>

        {/* ── Desktop tabs (≥640px) ── */}
        <nav
          className="hidden sm:flex"
          style={{ alignItems: 'center', gap: 2, position: 'relative' }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleTab(tab)}
                style={{
                  position: 'relative',
                  padding: scrolled ? '6px 12px' : '8px 14px',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 500,
                  color: isActive ? 'var(--gold, #C5A059)' : 'var(--brown-muted, #8C7B6B)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.22s ease',
                  outline: 'none',
                  minHeight: 44,
                  touchAction: 'manipulation',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'rgba(197,160,89,0.8)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#8C7B6B' }}
              >
                {tab.label}

                {/* Active tubelight indicator */}
                {isActive && mounted && (
                  <motion.div
                    layoutId="tubelight-indicator"
                    style={{
                      position: 'absolute',
                      bottom: -1, left: '10%', right: '10%',
                      height: 2,
                      background: 'linear-gradient(90deg, transparent, rgba(197,160,89,1) 30%, rgba(232,213,163,1) 50%, rgba(197,160,89,1) 70%, transparent)',
                      borderRadius: 1,
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 38 }}
                  />
                )}

                {/* Glow bloom */}
                {isActive && mounted && (
                  <motion.div
                    layoutId="tubelight-glow"
                    style={{
                      position: 'absolute',
                      bottom: -6, left: '0%', right: '0%',
                      height: 14,
                      background: 'radial-gradient(ellipse at 50% 0%, rgba(197,160,89,0.32) 0%, transparent 75%)',
                      filter: 'blur(3px)',
                      pointerEvents: 'none',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 38 }}
                  />
                )}
              </button>
            )
          })}
        </nav>

        {/* Right slot + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {rightContent}

          {/* ── Hamburger (mobile only) ── */}
          <button
            className="sm:hidden"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menyu"
            aria-expanded={menuOpen}
            style={{
              width: 40, height: 40,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 5,
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: 0, flexShrink: 0,
            }}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.22 }}
              style={{ display: 'block', width: 20, height: 1.5, background: '#8C7B6B', borderRadius: 1, transformOrigin: 'center' }}
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.18 }}
              style={{ display: 'block', width: 20, height: 1.5, background: '#8C7B6B', borderRadius: 1 }}
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.22 }}
              style={{ display: 'block', width: 20, height: 1.5, background: '#8C7B6B', borderRadius: 1, transformOrigin: 'center' }}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0, 0.68, 1] }}
            style={{
              overflow: 'hidden',
              borderTop: '1px solid rgba(221,213,200,0.4)',
              background: 'rgba(253,251,247,0.97)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div style={{ padding: '8px 20px 16px' }}>
              {tabs.map((tab, i) => {
                const isActive = activeTab === tab.id
                return (
                  <motion.button
                    key={tab.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                    onClick={() => handleTab(tab)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%', padding: '13px 4px',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      borderBottom: '1px solid rgba(221,213,200,0.3)',
                      textAlign: 'left', touchAction: 'manipulation',
                    }}
                  >
                    {/* Active dot */}
                    <span style={{
                      width: 4, height: 4, borderRadius: '50%', flexShrink: 0,
                      background: isActive ? '#C5A059' : 'transparent',
                      border: isActive ? 'none' : '1px solid rgba(197,160,89,0.35)',
                      transition: 'background 0.2s',
                    }} />
                    <span style={{
                      fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
                      fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 500,
                      color: isActive ? 'var(--gold, #C5A059)' : 'var(--brown-muted, #8C7B6B)',
                    }}>
                      {tab.label}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
