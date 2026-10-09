import { useEffect, useState } from 'react'
import { motion, useScroll } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const [pct, setPct] = useState(0)
  /* UI redesign (2026-10): `data-avoid-scroll-progress` elementi (məs. builder-in
     mobildə yapışan «Növbəti» paneli) dairənin yerinə düşəndə dairə gizlənir —
     dekorativ göstəricidir (pointerEvents: none), düymənin üstünü örtməsin. */
  const [covered, setCovered] = useState(false)

  useEffect(() => {
    const check = () => {
      const zone = { l: innerWidth - 76, t: innerHeight - 76, r: innerWidth - 28, b: innerHeight - 28 }
      const hit = [...document.querySelectorAll('[data-avoid-scroll-progress]')].some((el) => {
        const r = el.getBoundingClientRect()
        return r.width > 0 && r.left < zone.r && r.right > zone.l && r.top < zone.b && r.bottom > zone.t
      })
      setCovered(hit)
    }
    const off = scrollYProgress.on('change', (v) => { setPct(Math.round(v * 100)); check() })
    window.addEventListener('resize', check)
    const id = setInterval(check, 1000)   /* builder addım dəyişəndə də (scroll olmadan) */
    return () => { off(); window.removeEventListener('resize', check); clearInterval(id) }
  }, [scrollYProgress])

  const r = 18
  const circumference = 2 * Math.PI * r

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        zIndex: 998,
        width: 48,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        /* Səhifənin lap başında (0%) gizli: orada heç nə göstərmir, telefonda isə
           hero-nun alt sətrinin («Готово за ~5 минут») üstünə düşürdü (Phase 49.8). */
        opacity: covered || pct < 1 ? 0 : 1,
        transition: 'opacity 200ms ease',
      }}
    >
      <svg width="48" height="48" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle
          cx="24" cy="24" r={r}
          fill="none"
          stroke="rgba(197,160,89,0.12)"
          strokeWidth="2"
        />
        <motion.circle
          cx="24" cy="24" r={r}
          fill="none"
          stroke="#C5A059"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ pathLength: scrollYProgress }}
        />
      </svg>
      <span style={{
        fontSize: 8,
        color: 'rgba(197,160,89,0.8)',
        fontFamily: '"Inter", system-ui, sans-serif',
        fontWeight: 600,
        letterSpacing: '0.05em',
      }}>
        {pct}
      </span>
    </div>
  )
}
