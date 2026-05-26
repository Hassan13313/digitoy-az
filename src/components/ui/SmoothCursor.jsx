import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function SmoothCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 22, stiffness: 220, mass: 0.5 }
  const springX = useSpring(cursorX, springConfig)
  const springY = useSpring(cursorY, springConfig)

  const isHoveringLink = useRef(false)
  const scaleValue = useMotionValue(1)
  const springScale = useSpring(scaleValue, { damping: 20, stiffness: 300 })

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX - 12)
      cursorY.set(e.clientY - 12)
    }

    const enterLink = () => { isHoveringLink.current = true; scaleValue.set(1.8) }
    const leaveLink = () => { isHoveringLink.current = false; scaleValue.set(1) }

    window.addEventListener('mousemove', move)

    const addListeners = () => {
      document.querySelectorAll('a, button, [role="button"], input, textarea, select').forEach(el => {
        el.addEventListener('mouseenter', enterLink)
        el.addEventListener('mouseleave', leaveLink)
      })
    }

    addListeners()
    const observer = new MutationObserver(addListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', move)
      observer.disconnect()
    }
  }, [cursorX, cursorY, scaleValue])

  return (
    <>
      {/* Main blob cursor */}
      <motion.div
        style={{
          position: 'fixed',
          left: springX,
          top: springY,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197,160,89,0.75) 0%, rgba(197,160,89,0.2) 70%)',
          border: '1px solid rgba(197,160,89,0.55)',
          pointerEvents: 'none',
          zIndex: 9999,
          scale: springScale,
          backdropFilter: 'blur(1px)',
          boxShadow: '0 0 12px rgba(197,160,89,0.3)',
          mixBlendMode: 'multiply',
        }}
      />
      {/* Dot center */}
      <motion.div
        style={{
          position: 'fixed',
          left: cursorX,
          top: cursorY,
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: '#C5A059',
          pointerEvents: 'none',
          zIndex: 10000,
          translateX: 10,
          translateY: 10,
        }}
      />
    </>
  )
}
