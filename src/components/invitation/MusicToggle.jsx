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
      audioRef.current.volume = 0.25
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
      className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-ink flex items-center justify-center shadow-lg hover:bg-brown-dark transition-colors duration-300 group"
      aria-label={playing ? tr.inv_music_off : tr.inv_music_on}
    >
      {/* Pulse ring when playing */}
      {playing && (
        <span className="absolute inset-0 bg-gold/20 animate-pulse-ring rounded-none" />
      )}
      {loading ? (
        <div className="w-4 h-4 border border-gold border-t-transparent rounded-full animate-spin" />
      ) : playing ? (
        <Music size={16} className="text-gold" />
      ) : (
        <VolumeX size={16} className="text-white/60 group-hover:text-white transition-colors" />
      )}
    </button>
  )
}
