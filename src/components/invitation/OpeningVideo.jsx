import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import t from '../../data/translations'

/* ─────────────────────────────────────────────────────────
   OpeningVideo — Phase 7.7
   Purely visual cinematic intro. Always silent.
   Audio belongs exclusively to the invitation music system.

   Flow:
     mount        → 200ms grace timer starts; video loads silently
     <200ms ready → video plays immediately, poster never shown
     >200ms ready → poster appears; fades when video becomes ready
     near-end     → dissolve into invitation (opacity only, no zoom)
     error/block  → poster held briefly, then dissolve into invitation
───────────────────────────────────────────────────────── */
const FADE_DUR       = 1700
const FADE_LEAD      = 1.9
const CROSSFADE_MS   = 700
/* UNIVERSAL fail-safe — applies to EVERY invitation (demo + real customer).
   If real playback has not begun within this window (canplay/loadeddata never
   fire, play() promise hangs, low-memory or in-app browser blocks decode), we
   enter the invitation anyway. No guest must ever be stranded on the poster. */
const OPEN_FALLBACK_MS = 3000
/* If a playing video stops advancing (mid-stream stall/buffer), enter anyway. */
const STALL_CHECK_MS   = 2500

export default function OpeningVideo({ onComplete, weddingData, lang = 'az' }) {
  const videoRef        = useRef(null)
  const onCompleteRef   = useRef(onComplete)
  const triggeredRef    = useRef(false)
  const playStartedRef  = useRef(false)
  const posterTimerRef  = useRef(null)
  const fallbackTimerRef = useRef(null)
  const stallTimerRef   = useRef(null)
  const lastTimeRef     = useRef(0)

  const [fading,     setFading]     = useState(false)
  const [gone,       setGone]       = useState(false)
  const [crossfaded, setCrossfaded] = useState(false)
  const [posterDone, setPosterDone] = useState(false)
  const [showPoster, setShowPoster] = useState(false)

  onCompleteRef.current = onComplete

  /* Idempotent entry into the invitation — runs at most once. */
  const startFade = useCallback(() => {
    if (triggeredRef.current) return
    triggeredRef.current = true
    clearTimeout(posterTimerRef.current)
    clearTimeout(fallbackTimerRef.current)
    clearInterval(stallTimerRef.current)
    setFading(true)
    onCompleteRef.current()
    setTimeout(() => setGone(true), FADE_DUR + 200)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted  = true
    video.volume = 0

    // Show poster only if the video isn't ready within 200ms
    posterTimerRef.current = setTimeout(() => setShowPoster(true), 200)

    // Universal safety net (see OPEN_FALLBACK_MS) — guarantees entry.
    fallbackTimerRef.current = setTimeout(startFade, OPEN_FALLBACK_MS)

    // Attempt playback; tolerate environments where the promise hangs/rejects.
    const tryPlay = () => {
      if (playStartedRef.current || triggeredRef.current) return
      const p = video.play()
      if (p && typeof p.then === 'function') {
        p.catch(() => startFade())   // autoplay blocked / decode refused → enter
      }
    }

    // Real playback confirmed — the premium flow takes over for capable devices.
    const handlePlaying = () => {
      if (playStartedRef.current || triggeredRef.current) return
      playStartedRef.current = true
      clearTimeout(posterTimerRef.current)
      clearTimeout(fallbackTimerRef.current)   // capable device → no time cap
      setCrossfaded(true)
      setTimeout(() => setPosterDone(true), CROSSFADE_MS + 50)
      // Mid-stream stall watchdog: if currentTime stops advancing, enter anyway.
      lastTimeRef.current = video.currentTime
      stallTimerRef.current = setInterval(() => {
        if (triggeredRef.current) { clearInterval(stallTimerRef.current); return }
        if (!video.paused && video.currentTime === lastTimeRef.current) startFade()
        lastTimeRef.current = video.currentTime
      }, STALL_CHECK_MS)
    }

    const handleTimeUpdate = () => {
      if (!video.duration || isNaN(video.duration)) return
      if (video.duration - video.currentTime <= FADE_LEAD) startFade()
    }

    // canplay never firing is the core bug — also attempt on loadeddata, and
    // immediately, so capable devices still start instantly.
    const handleReady = () => { clearTimeout(posterTimerRef.current); tryPlay() }
    const handleError = () => startFade()

    // Note: transient `stalled`/buffering is intentionally NOT a hard bail —
    // it is covered gracefully by the 3s pre-play fallback and the mid-play
    // stall watchdog, so a brief network hiccup won't cut a capable device's
    // video short. Only terminal failures (error/abort) bail immediately.
    video.addEventListener('loadeddata', handleReady)
    video.addEventListener('canplay',    handleReady)
    video.addEventListener('playing',    handlePlaying)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended',      startFade)
    video.addEventListener('error',      handleError)
    video.addEventListener('abort',      handleError)
    tryPlay()   // some browsers are ready before listeners attach

    return () => {
      clearTimeout(posterTimerRef.current)
      clearTimeout(fallbackTimerRef.current)
      clearInterval(stallTimerRef.current)
      video.removeEventListener('loadeddata', handleReady)
      video.removeEventListener('canplay',    handleReady)
      video.removeEventListener('playing',    handlePlaying)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended',      startFade)
      video.removeEventListener('error',      handleError)
      video.removeEventListener('abort',      handleError)
    }
  }, [startFade])

  const tr         = t[lang] || t.az
  const eventType  = weddingData?.eventType
  const isCouple   = ['toy', 'nishan'].includes(eventType)
  const isCorp     = ['corporate', 'other'].includes(eventType)
  const brideName  = weddingData?.brideName  || ''
  const groomName  = weddingData?.groomName  || ''
  const eventName  = weddingData?.eventName  || ''
  const displayAnd = tr.inv_and || '&'
  const tagline    = tr.opening_tagline || 'Bir Dəvətnamədən Daha Artığı'

  if (gone) return null

  return (
    <motion.div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: '#FDFAF4',
        overflow: 'hidden',
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{
        opacity: { duration: FADE_DUR / 1000, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      {/* Video — hidden behind poster until crossfade */}
      <video
        ref={videoRef}
        src="/digitoy-opening.mp4"
        muted
        playsInline
        preload="auto"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', display: 'block',
          opacity: crossfaded ? 1 : 0,
          transition: `opacity ${CROSSFADE_MS}ms ease-out`,
        }}
      />

      {/* Poster — shown only on slow connections (video not ready within 200ms) */}
      {showPoster && !posterDone && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            background: '#FDFAF4',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '40px 32px', textAlign: 'center',
            opacity: crossfaded ? 0 : 1,
            transition: `opacity ${CROSSFADE_MS}ms ease-out`,
          }}
        >
          {/* Top gold rule */}
          <div style={{
            width: 48, height: 1,
            background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.6), transparent)',
            marginBottom: 28,
          }} />

          {/* Wordmark */}
          <p style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: 9, letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: 'rgba(197,160,89,0.72)',
            fontWeight: 500, margin: '0 0 32px',
          }}>
            Digitoy.az
          </p>

          {/* Names */}
          {isCouple ? (
            <div>
              <p style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(38px, 10vw, 70px)',
                fontWeight: 300, letterSpacing: '-0.02em',
                color: '#1A140C', lineHeight: 1.05, margin: 0,
              }}>
                {brideName}
              </p>
              <p style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(22px, 5vw, 36px)',
                fontWeight: 300, fontStyle: 'italic',
                color: 'rgba(197,160,89,0.9)',
                lineHeight: 1.4, margin: '6px 0',
              }}>
                {displayAnd}
              </p>
              <p style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: 'clamp(38px, 10vw, 70px)',
                fontWeight: 300, letterSpacing: '-0.02em',
                color: '#1A140C', lineHeight: 1.05, margin: 0,
              }}>
                {groomName}
              </p>
            </div>
          ) : (
            <p style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(32px, 9vw, 60px)',
              fontWeight: 300, letterSpacing: '-0.01em',
              color: '#1A140C', lineHeight: 1.1, margin: 0,
            }}>
              {isCorp ? eventName : (brideName || eventName)}
            </p>
          )}

          {/* Bottom gold rule */}
          <div style={{
            width: 48, height: 1,
            background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.5), transparent)',
            margin: '28px 0 22px',
          }} />

          {/* Tagline */}
          <p style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: 8, letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: 'rgba(140,123,107,0.52)',
            fontWeight: 500, margin: 0,
          }}>
            {tagline}
          </p>
        </div>
      )}

      {/* Skip — həm demo, həm real dəvətnamədə. startFade ikili icranı bloklayır. */}
      {!fading && (
        <button
          type="button"
          onClick={startFade}
          aria-label={tr.opening_skip || 'Animasiyanı keç'}
          style={{
            position: 'absolute',
            bottom: 'max(22px, env(safe-area-inset-bottom, 22px))',
            right: 20, zIndex: 60,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '9px 18px',
            background: 'rgba(26,20,12,0.32)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(253,250,244,0.35)',
            borderRadius: 999, cursor: 'pointer',
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(253,250,244,0.92)', fontWeight: 500,
          }}
        >
          {tr.opening_skip || 'Keç →'}
        </button>
      )}
    </motion.div>
  )
}
