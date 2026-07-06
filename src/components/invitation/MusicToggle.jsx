import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Music, VolumeX } from 'lucide-react'
import t from '../../data/translations'
import { trackEvent } from '../../utils/analytics'

/* Phase 25.3 — tam lokal audio engine (YouTube YOXDUR).
   `music` obyekti (bax: src/data/music.js) həmişə verilir:
   • preset → lokal /music/*.mp3
   • mp3    → yüklənmiş fayl URL / blob
   music.file birbaşa HTML5 <audio> mənbəyidir; startTime ilk oxutmada tətbiq olunur. */
const MusicToggle = forwardRef(function MusicToggle({ lang, music = null }, ref) {
  const tr         = t[lang]
  const audioRef   = useRef(null)
  const startedRef = useRef(false)
  const seekedRef  = useRef(false)
  const [playing, setPlaying] = useState(false)

  const src       = music?.file || null
  const startTime = Math.max(0, Math.floor(music?.startTime || 0))

  const playMedia = () => {
    const a = audioRef.current
    if (!a) return
    if (!seekedRef.current && startTime > 0) {
      try { a.currentTime = startTime } catch { /* metadata hələ yüklənməyib */ }
      seekedRef.current = true
    }
    a.play().then(() => {
      if (!startedRef.current) {
        startedRef.current = true
        trackEvent('music_started', { lang, provider: music?.provider || 'preset' })
      }
    }).catch(() => {}) /* autoplay bloklanıbsa — istifadəçi düymə ilə başladacaq */
  }

  const pauseMedia = () => { audioRef.current?.pause() }

  useImperativeHandle(ref, () => ({ play: playMedia, pause: pauseMedia }))

  const toggle = () => { playing ? pauseMedia() : playMedia() }

  /* musiqi mənbəyi yoxdursa heç nə render etmə (müdafiə) */
  if (!src) return null

  return (
    <>
      {/* Lokal MP3 audio engine */}
      <audio
        ref={audioRef}
        src={src}
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
