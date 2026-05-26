import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export default function AnimatedNumber({ value, duration = 2, suffix = '', prefix = '', className = '', style = {} }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true

    const start = 0
    const end = Number(value)
    const steps = Math.ceil(duration * 60)
    let step = 0

    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCurrent(Math.round(start + (end - start) * eased))
      if (step >= steps) clearInterval(timer)
    }, 1000 / 60)

    return () => clearInterval(timer)
  }, [inView, value, duration])

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{current}{suffix}
    </span>
  )
}
