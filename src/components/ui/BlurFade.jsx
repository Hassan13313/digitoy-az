import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

export default function BlurFade({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 20,
  blur = '8px',
  className = '',
  style = {},
  once = true,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset, filter: `blur(${blur})` }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
