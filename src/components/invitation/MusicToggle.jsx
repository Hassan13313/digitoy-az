import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Music, VolumeX } from 'lucide-react'
import t from '../../data/translations'
import { trackEvent } from '../../utils/analytics'

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

/* Phase 25.3 — music prop (bax: src/data/music.js):
   • music.provider === 'mp3'    → HTML5 <audio> engine (music.file = URL)
   • music.provider === 'preset' → YouTube engine (music.file = video ID)
   • music yoxdursa              → legacy davranış: videoId prop (tədbir növünə görə)
   startTime hər iki engine-də ilk oxutmada tətbiq olunur. */
const MusicToggle = forwardRef(function MusicToggle({ lang, videoId = DEFAULT_VIDEO_ID, music = null }, ref) {
  const tr           = t[lang]
  const containerRef = useRef(null)
  const playerRef    = useRef(null)
  const audioRef     = useRef(null)
  const startedRef   = useRef(false)
  const seekedRef    = useRef(false)
  const [playing, setPlaying] = useState(false)

  const isMp3     = music?.provider === 'mp3' && !!music?.file
  const ytVideoId = (music?.provider === 'preset' && music?.file) ? music.file : videoId
  const startTime = Math.max(0, Math.floor(music?.startTime || 0))

  /* ── YouTube engine (preset / legacy) ── */
  useEffect(() => {
    if (isMp3) return
    let cancelled = false
    loadYTScript().then(() => {
      if (cancelled || !containerRef.current) return
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: ytVideoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          loop:     1,
          playlist: ytVideoId,
          rel:      0,
          iv_load_policy: 3,
          ...(startTime > 0 ? { start: startTime } : {}),
        },
        events: {
          onStateChange: (e) => {
            if (cancelled) return
            const isPlaying = e.data === window.YT.PlayerState.PLAYING
            setPlaying(isPlaying)
            if (isPlaying && !startedRef.current) {
              startedRef.current = true
              trackEvent('music_started', { lang, provider: music?.provider || 'default' })
            }
          },
        },
      })
    })
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const playMedia = () => {
    if (isMp3) {
      const a = audioRef.current
      if (!a) return
      if (!seekedRef.current && startTime > 0) {
        try { a.currentTime = startTime } catch { /* metadata hələ yüklənməyib */ }
        seekedRef.current = true
      }
      a.play().then(() => {
        if (!startedRef.current) {
          startedRef.current = true
          trackEvent('music_started', { lang, provider: 'mp3' })
        }
      }).catch(() => {}) /* autoplay bloklanıbsa — istifadəçi düymə ilə başladacaq */
    } else {
      const p = playerRef.current
      if (!p?.playVideo) return
      if (!seekedRef.current && startTime > 0) {
        p.seekTo?.(startTime, true)
        seekedRef.current = true
      }
      p.playVideo()
    }
  }

  const pauseMedia = () => {
    if (isMp3) audioRef.current?.pause()
    else playerRef.current?.pauseVideo?.()
  }

  useImperativeHandle(ref, () => ({ play: playMedia, pause: pauseMedia }))

  const toggle = () => { playing ? pauseMedia() : playMedia() }

  return (
    <>
      {/* Hidden media engine */}
      {isMp3 ? (
        <audio
          ref={audioRef}
          src={music.file}
          loop
          preload="metadata"
          onLoadedMetadata={(e) => {
            /* startTime-ı metadata gələn kimi tətbiq et — ilk play ani başlasın */
            if (!seekedRef.current && startTime > 0) {
              try { e.target.currentTime = startTime; seekedRef.current = true } catch {}
            }
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      ) : (
        <div
          ref={containerRef}
          style={{
            position: 'fixed', top: -9999, left: -9999,
            width: 1, height: 1, pointerEvents: 'none',
          }}
        />
      )}

      {/* Floating toggle button */}
      <button
        onClick={toggle}
        title={playing ? tr.inv_music_off : tr.inv_music_on}
        aria-label={playing ? tr.inv_music_off : tr.inv_music_on}
        className="fixed w-14 h-14 rounded-full flex items-center justify-center glass glow-gold transition-all duration-base group"
        style={{
          bottom: 'max(20px, env(safe-area-inset-bottom, 20px))',
          right: '20px',
          zIndex: 55,
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
