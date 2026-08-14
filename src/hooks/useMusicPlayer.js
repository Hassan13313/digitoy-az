import { useRef, useState } from 'react'
import { trackEvent } from '../utils/analytics'

/* ─────────────────────────────────────────────────────────────────────────────
   useMusicPlayer — lokal MP3 audio engine (UI-sız).

   MusicToggle.jsx-dən çıxarılıb. YouTube YOXDUR — `music.file` birbaşa
   HTML5 <audio> mənbəyidir, `startTime` ilk oxutmada tətbiq olunur.

   İstifadə:
     const { audioProps, playing, toggle, hasMusic } = useMusicPlayer({ lang, music })
     {hasMusic && <audio {...audioProps} />}
   ───────────────────────────────────────────────────────────────────────── */
export function useMusicPlayer({ lang, music = null }) {
  const audioRef   = useRef(null)
  const startedRef = useRef(false)
  const seekedRef  = useRef(false)
  const [playing, setPlaying] = useState(false)

  const src       = music?.file || null
  const startTime = Math.max(0, Math.floor(music?.startTime || 0))

  const play = () => {
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

  const pause  = () => { audioRef.current?.pause() }
  const toggle = () => { playing ? pause() : play() }

  /* Consumer bu propsları birbaşa <audio>-ya yayır */
  const audioProps = {
    ref: audioRef,
    src,
    loop: true,
    preload: 'metadata',
    onLoadedMetadata: (e) => {
      /* startTime-ı metadata gələn kimi tətbiq et — ilk play ani başlasın */
      if (!seekedRef.current && startTime > 0) {
        try { e.target.currentTime = startTime; seekedRef.current = true } catch { /* seek dəstəklənmir */ }
      }
    },
    onPlay:  () => setPlaying(true),
    onPause: () => setPlaying(false),
  }

  return { audioProps, audioRef, playing, play, pause, toggle, hasMusic: !!src }
}

export default useMusicPlayer
