import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function ThreeDCard({ children, className = '', style = {}, intensity = 12 }) {
  const ref = useRef(null)
  const [rotX, setRotX] = useState(0)
  const [rotY, setRotY] = useState(0)
  const [hovering, setHovering] = useState(false)

  const handleMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5  // -0.5 to 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    setRotY(x * intensity)
    setRotX(-y * intensity)
  }

  const handleMouseLeave = () => {
    setRotX(0)
    setRotY(0)
    setHovering(false)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        animate={{
          rotateX: rotX,
          rotateY: rotY,
          scale: hovering ? 1.025 : 1,
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
