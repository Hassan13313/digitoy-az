import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'

/* ════════════════════════════════════════════
   3D CAROUSEL (CU4)
   Touch/swipe + click navigation, CSS perspective
   rotateY for cards, active card fully visible
════════════════════════════════════════════ */

/* Responsive card dimensions — JS-side (window not available at module init, resolved at render) */
const CARD_W  = typeof window !== 'undefined' && window.innerWidth < 480 ? 240 : 340
const CARD_H  = typeof window !== 'undefined' && window.innerWidth < 480 ? 300 : 420
const VISIBLE = typeof window !== 'undefined' && window.innerWidth < 480 ? 1 : 2

function CarouselCard({ item, offset, onClick }) {
  const absOffset = Math.abs(offset)
  const sign      = Math.sign(offset) || 1

  const rotateY  = offset * 38
  const translateX = offset * CARD_W * 0.72
  const translateZ = -(absOffset * 140)
  const scale    = 1 - absOffset * 0.12
  const opacity  = offset === 0 ? 1 : Math.max(0, 1 - absOffset * 0.38)
  const zIndex   = 100 - absOffset * 10

  return (
    <motion.div
      onClick={offset !== 0 ? onClick : undefined}
      animate={{
        rotateY,
        x: translateX,
        z: translateZ,
        scale,
        opacity,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      style={{
        position: 'absolute',
        left: '50%',
        marginLeft: -CARD_W / 2,
        width: CARD_W,
        height: CARD_H,
        zIndex,
        cursor: offset !== 0 ? 'pointer' : 'default',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: offset === 0
          ? '0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(197,160,89,0.18)'
          : '0 12px 40px rgba(0,0,0,0.12)',
        border: offset === 0 ? '1px solid rgba(197,160,89,0.3)' : '1px solid rgba(197,160,89,0.1)',
      }}
    >
      {/* Image */}
      {item.src ? (
        <img
          src={item.src}
          alt={item.alt || ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          draggable={false}
        />
      ) : (
        /* Placeholder when no src */
        <div style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(145deg, #FDFBF7 0%, #F4EDE0 40%, #EAE0CC 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 12,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(197,160,89,0.12)',
            border: '1px solid rgba(197,160,89,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="1.2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
          {item.label && (
            <p style={{
              fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(197,160,89,0.7)', fontFamily: 'Inter,system-ui,sans-serif',
            }}>
              {item.label}
            </p>
          )}
        </div>
      )}

      {/* Active overlay gradient */}
      {offset === 0 && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(26,17,5,0.45) 0%, transparent 55%)',
        }}>
          {item.caption && (
            <div style={{ position: 'absolute', bottom: 22, left: 22, right: 22 }}>
              <p style={{
                color: 'rgba(255,255,255,0.9)',
                fontFamily: '"Cormorant Garamond",Georgia,serif',
                fontSize: 16, fontWeight: 300, letterSpacing: '0.04em',
              }}>
                {item.caption}
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default function ThreeDCarousel({ items = [], autoPlay = true, autoInterval = 4200 }) {
  const [current, setCurrent] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart  = useRef(null)
  const timerRef   = useRef(null)
  const n = items.length

  const go = useCallback((idx) => {
    setCurrent(((idx % n) + n) % n)
  }, [n])

  const prev = () => go(current - 1)
  const next = () => go(current + 1)

  /* Auto-play */
  useEffect(() => {
    if (!autoPlay || n < 2) return
    timerRef.current = setInterval(() => go(current + 1), autoInterval)
    return () => clearInterval(timerRef.current)
  }, [current, autoPlay, autoInterval, go, n])

  /* Touch / pointer drag */
  const onPointerDown = (e) => {
    dragStart.current = e.clientX
    setIsDragging(false)
  }
  const onPointerMove = (e) => {
    if (dragStart.current === null) return
    if (Math.abs(e.clientX - dragStart.current) > 6) setIsDragging(true)
  }
  const onPointerUp = (e) => {
    if (dragStart.current === null) return
    const delta = e.clientX - dragStart.current
    if (Math.abs(delta) > 48) { delta < 0 ? next() : prev() }
    dragStart.current = null
  }

  if (n === 0) return null

  /* Compute offsets for visible window */
  const offsets = items.map((_, i) => {
    let off = i - current
    if (off > n / 2)  off -= n
    if (off < -n / 2) off += n
    return off
  })

  return (
    <div
      style={{ position: 'relative', width: '100%' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* 3D stage */}
      <div style={{
        position: 'relative',
        height: CARD_H + 48,
        perspective: 1200,
        perspectiveOrigin: '50% 50%',
        overflow: 'hidden',
      }}>
        {items.map((item, i) => {
          const off = offsets[i]
          if (Math.abs(off) > VISIBLE) return null
          return (
            <CarouselCard
              key={i}
              item={item}
              offset={off}
              onClick={() => go(i)}
            />
          )
        })}
      </div>

      {/* Dot navigation */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24,
        alignItems: 'center',
      }}>
        <button
          onClick={prev}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            border: '1px solid rgba(197,160,89,0.4)',
            background: 'transparent', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#C5A059', fontSize: 18, lineHeight: 1,
          }}
        >
          ‹
        </button>

        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            style={{
              width: i === current ? 20 : 7,
              height: 7, borderRadius: 4,
              background: i === current ? '#C5A059' : 'rgba(197,160,89,0.28)',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.35s ease', padding: 0,
            }}
          />
        ))}

        <button
          onClick={next}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            border: '1px solid rgba(197,160,89,0.4)',
            background: 'transparent', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#C5A059', fontSize: 18, lineHeight: 1,
          }}
        >
          ›
        </button>
      </div>
    </div>
  )
}
