import { useRef, useState } from 'react'
import { Music, VolumeX } from 'lucide-react'
import t from '../../data/translations'

const MUSIC_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3'

export default function MusicToggle({ lang }) {
  const tr = t[lang]
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(MUSIC_URL)
      audioRef.current.loop = true
      audioRef.current.volume = 0.22
    }
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      try {
        setLoading(true)
        await audioRef.current.play()
        setPlaying(true)
      } catch {
        // autoplay blocked — silently ignore
      } finally {
        setLoading(false)
      }
    }
  }

  return (
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
      {/* Soft glow ring when playing */}
      {playing && (
        <span
          className="absolute inset-0 rounded-full animate-pulse-ring"
          style={{ background: 'rgba(197,160,89,0.08)' }}
        />
      )}

      {loading ? (
        <div className="w-4 h-4 border border-gold border-t-transparent rounded-full animate-spin" />
      ) : playing ? (
        <Music size={15} className="text-gold" strokeWidth={1.5} />
      ) : (
        <VolumeX
          size={15}
          strokeWidth={1.5}
          className="text-brown-muted group-hover:text-gold transition-colors duration-300"
        />
      )}
    </button>
  )
}
