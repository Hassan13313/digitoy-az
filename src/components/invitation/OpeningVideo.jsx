import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

/* ─────────────────────────────────────────────────────────
   OpeningVideo — Phase 7.5
   Purely visual cinematic intro. Always silent.
   Audio belongs exclusively to the invitation music system.

   Three-step transition:
     t=0ms    zoom begins  — scale 1 → 1.18, 500ms
     t=0ms    dissolve     — opacity 1 → 0, 1300ms
     t=350ms  invitation mounts — blur/scale/opacity reveal
───────────────────────────────────────────────────────── */
const ZOOM_DUR  = 500
const FADE_DUR  = 1300
const INV_DELAY = 350
const TOTAL_DUR = FADE_DUR + INV_DELAY + 80
const FADE_LEAD = (TOTAL_DUR / 1000) - 0.1

export default function OpeningVideo({ onComplete }) {
  const videoRef      = useRef(null)
  const onCompleteRef = useRef(onComplete)
  const triggeredRef  = useRef(false)

  const [zooming, setZooming] = useState(false)
  const [fading,  setFading]  = useState(false)
  const [gone,    setGone]    = useState(false)

  onCompleteRef.current = onComplete

  const startFade = useCallback(() => {
    if (triggeredRef.current) return
    triggeredRef.current = true
    setZooming(true)
    setTimeout(() => {
      setFading(true)
      onCompleteRef.current()
    }, INV_DELAY)
    setTimeout(() => setGone(true), TOTAL_DUR)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted  = true
    video.volume = 0
    video.play().catch(startFade)

    const handleTimeUpdate = () => {
      if (!video.duration || isNaN(video.duration)) return
      if (video.duration - video.currentTime <= FADE_LEAD) startFade()
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended',      startFade)
    video.addEventListener('error',      startFade)
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended',      startFade)
      video.removeEventListener('error',      startFade)
    }
  }, [startFade])

  if (gone) return null

  return (
    <motion.div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: '#FDFAF4',
        overflow: 'hidden',
      }}
      initial={{ opacity: 1, scale: 1 }}
      animate={{
        scale:   zooming ? 1.18 : 1,
        opacity: fading  ? 0    : 1,
      }}
      transition={{
        scale:   { duration: ZOOM_DUR / 1000, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: FADE_DUR / 1000, ease: 'easeInOut' },
      }}
    >
      <video
        ref={videoRef}
        src="/digitoy-opening.mp4"
        muted
        playsInline
        preload="auto"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </motion.div>
  )
}
