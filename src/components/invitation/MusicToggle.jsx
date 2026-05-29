import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Music, VolumeX } from 'lucide-react'
import t from '../../data/translations'

function loadYTScript() {
  return new Promise(resolve => {
    if (window.YT?.Player) { resolve(); return }
    if (!document.getElementById('yt-iframe-api')) {
      const s = document.createElement('script')
      s.id  = 'yt-iframe-api'
      s.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(s)
    }
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => { prev?.(); resolve() }
  })
}

const DEFAULT_VIDEO_ID = '7maJOI3QMu0'

const MusicToggle = forwardRef(function MusicToggle({ lang, videoId = DEFAULT_VIDEO_ID }, ref) {
  const tr           = t[lang]
  const containerRef = useRef(null)
  const playerRef    = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadYTScript().then(() => {
      if (cancelled || !containerRef.current) return
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          loop:     1,
          playlist: videoId,
          rel:      0,
          iv_load_policy: 3,
        },
        events: {
          onStateChange: (e) => {
            if (!cancelled)
              setPlaying(e.data === window.YT.PlayerState.PLAYING)
          },
        },
      })
    })
    return () => { cancelled = true }
  }, [])

  useImperativeHandle(ref, () => ({
    play:  () => playerRef.current?.playVideo?.(),
    pause: () => playerRef.current?.pauseVideo?.(),
  }))

  const toggle = () => {
    if (!playerRef.current) return
    playing ? playerRef.current.pauseVideo() : playerRef.current.playVideo()
  }

  return (
    <>
      {/* Hidden YouTube iframe */}
      <div
        ref={containerRef}
        style={{
          position: 'fixed', top: -9999, left: -9999,
          width: 1, height: 1, pointerEvents: 'none',
        }}
      />

      {/* Floating toggle button */}
      <button
        onClick={toggle}
        title={playing ? tr.inv_music_off : tr.inv_music_on}
        aria-label={playing ? tr.inv_music_off : tr.inv_music_on}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 group"
        style={{
          background: 'rgba(253,251,247,0.45)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(197,160,89,0.22)',
          boxShadow: '0 2px 24px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.6)',
        }}
      >
        {playing && (
          <span
            className="absolute inset-0 rounded-full animate-pulse-ring"
            style={{ background: 'rgba(197,160,89,0.08)' }}
          />
        )}
        {playing ? (
          <Music size={15} className="text-gold" strokeWidth={1.5} />
        ) : (
          <VolumeX
            size={15}
            strokeWidth={1.5}
            className="text-brown-muted group-hover:text-gold transition-colors duration-300"
          />
        )}
      </button>
    </>
  )
})

export default MusicToggle
