import { forwardRef, useImperativeHandle } from 'react'
import { Music, VolumeX } from 'lucide-react'
import t from '../../data/translations'
import { useMusicPlayer } from '../../hooks/useMusicPlayer'

/* Audio engine artıq `hooks/useMusicPlayer.js`-dədir — bu fayl yalnız
   simple-luxury-nin üzən qızıl düyməsidir (UI qatı).

   ⚠ `visible` = dəvətnamə açılıb (açılış videosu bitib). <audio> BUNDAN ASILI
   DEYİL — həmişə mount olunur ki, video "Keç" düyməsi ilə keçiləndə play()
   birbaşa klik hadisəsinin içində çağırıla bilsin. Görünən yalnız düymədir. */
const MusicToggle = forwardRef(function MusicToggle({ lang, music = null, visible = false, autoPlay = false }, ref) {
  const tr = t[lang]
  const { audioProps, playing, play, pause, toggle, hasMusic } = useMusicPlayer({
    lang, music, autoStart: visible && autoPlay,
  })

  useImperativeHandle(ref, () => ({ play, pause }))

  /* musiqi mənbəyi yoxdursa heç nə render etmə (müdafiə) */
  if (!hasMusic) return null

  return (
    <>
      {/* Lokal MP3 audio engine */}
      <audio {...audioProps} />

      {/* Floating toggle button */}
      {visible && (
      <button
        onClick={toggle}
        data-press
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
      )}
    </>
  )
})

export default MusicToggle
