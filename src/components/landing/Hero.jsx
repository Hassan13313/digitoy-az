import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Sparkles, Timer, MapPin, Shirt, Users, Camera, Music, Crown, ChevronLeft, ChevronRight, UserCheck, Clock, BookOpen, User } from 'lucide-react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import t from '../../data/translations'
import BlurFade from '../ui/BlurFade'
import AnimatedShinyText from '../ui/AnimatedShinyText'
import SparklesText from '../ui/SparklesText'
import AnimatedNumber from '../ui/AnimatedNumber'
import ShimmerButton from '../ui/ShimmerButton'

const featureKeys = ['countdown', 'maps', 'dresscode', 'seating', 'gallery', 'music', 'rsvp', 'timeline', 'guestbook']
const featureIcons = { countdown: Timer, maps: MapPin, dresscode: Shirt, seating: Users, gallery: Camera, music: Music, rsvp: UserCheck, timeline: Clock, guestbook: BookOpen }

function getDressStyles(tr) {
  return [
    { id: 'blacktie',    label: 'Black Tie',    sub: tr.dresscode_blacktie_sub,    male: { icon: User, text: tr.dress_blacktie_male },    female: { icon: Sparkles, text: tr.dress_blacktie_female } },
    { id: 'cocktail',    label: 'Cocktail',     sub: tr.dresscode_cocktail_sub,    male: { icon: User, text: tr.dress_cocktail_male },    female: { icon: Sparkles, text: tr.dress_cocktail_female } },
    { id: 'smartcasual', label: 'Smart Casual', sub: tr.dresscode_smartcasual_sub, male: { icon: User, text: tr.dress_smartcasual_male }, female: { icon: Sparkles, text: tr.dress_smartcasual_female } },
    { id: 'creative',    label: 'Creative',     sub: tr.dresscode_creative_sub,    male: { icon: User, text: tr.dress_creative_male },    female: { icon: Sparkles, text: tr.dress_creative_female } },
  ]
}

function DressCodePanel({ tr }) {
  const [selectedStyle, setSelectedStyle] = useState(null)
  const [note, setNote] = useState('')
  const DRESS_STYLES = getDressStyles(tr)
  const active = DRESS_STYLES.find(s => s.id === selectedStyle)

  return (
    <div className="space-y-4">
      <p className="text-[10px] tracking-[0.28em] uppercase text-gold font-medium text-center">{tr.f_dresscode}</p>
      <p className="text-brown-muted text-sm font-light text-center">{tr.f_dresscode_desc}</p>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {DRESS_STYLES.map(({ id, label, sub }) => {
          const isActive = selectedStyle === id
          return (
            <button key={id} onClick={() => setSelectedStyle(isActive ? null : id)}
              className={`px-3 py-3 rounded-xl border text-left transition-all duration-300 ${isActive ? 'bg-gold/10 border-gold/60 shadow-sm' : 'bg-white/30 border-white/50 hover:border-gold/30 hover:bg-white/50'}`}>
              <p className={`text-[11px] font-semibold tracking-wide ${isActive ? 'text-gold' : 'text-ink'}`}>{label}</p>
              <p className="text-[10px] text-brown-muted font-light mt-0.5">{sub}</p>
            </button>
          )
        })}
      </div>
      {active && (
        <div className="flex justify-center gap-4 pt-1 transition-all duration-300">
          {[{ role: tr.dress_male_role, ...active.male }, { role: tr.dress_female_role, ...active.female }].map(({ role, icon: Icon, text }) => (
            <div key={role} className="flex flex-col items-center gap-2 px-4 py-3 bg-white/30 border border-white/50 rounded-xl backdrop-blur-sm flex-1">
              <Icon size={18} className="text-amber-700/80" strokeWidth={1.4} />
              <p className="text-[10px] text-amber-700/80 font-medium text-center leading-relaxed">{role}:<br /><span className="font-light text-brown-muted">{text}</span></p>
            </div>
          ))}
        </div>
      )}
      <div className="relative z-20 pointer-events-auto mt-6">
        <p className="text-[10px] tracking-[0.18em] uppercase text-brown-muted/60 mb-2">{tr.dress_note_label}</p>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder={tr.dress_note_ph} rows={2}
          className="w-full text-xs px-4 py-2.5 bg-white/40 border border-white/50 rounded-xl outline-none text-ink placeholder-brown-muted/40 focus:border-gold/50 transition-colors backdrop-blur-sm resize-none font-light" />
      </div>
    </div>
  )
}

const slides = [{ bg: 'from-amber-50 to-stone-100' }, { bg: 'from-rose-50 to-amber-50' }, { bg: 'from-stone-100 to-amber-100' }]

function GallerySlider({ tr }) {
  const [current, setCurrent] = useState(0)
  return (
    <div className="text-center space-y-4">
      <p className="text-[10px] tracking-[0.28em] uppercase text-gold font-medium">{tr.f_gallery}</p>
      <p className="text-brown-muted text-sm font-light">{tr.f_gallery_desc}</p>
      <div className="relative max-w-xs mx-auto mt-3">
        <div className={`w-full h-44 rounded-xl bg-gradient-to-br ${slides[current].bg} border border-white/60 flex items-center justify-center transition-all duration-500`}>
          <div className="flex flex-col items-center gap-2 opacity-40">
            <Camera size={28} className="text-gold" strokeWidth={1.2} />
            <span className="text-[11px] text-brown-muted font-light">{tr.gallery_slide} {current + 1}</span>
          </div>
        </div>
        <button onClick={() => setCurrent(i => (i - 1 + slides.length) % slides.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/60 border border-white/70 backdrop-blur-sm flex items-center justify-center hover:bg-white/80 transition-all duration-200 shadow-sm">
          <ChevronLeft size={14} className="text-gold" strokeWidth={2} />
        </button>
        <button onClick={() => setCurrent(i => (i + 1) % slides.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/60 border border-white/70 backdrop-blur-sm flex items-center justify-center hover:bg-white/80 transition-all duration-200 shadow-sm">
          <ChevronRight size={14} className="text-gold" strokeWidth={2} />
        </button>
      </div>
      <div className="flex justify-center gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-4 h-2 bg-gold' : 'w-2 h-2 bg-gold/30'}`} />
        ))}
      </div>
      <p className="text-[11px] text-brown-muted/70 font-light">{tr.gallery_qr_hint}</p>
    </div>
  )
}

function RSVPPanel({ tr }) {
  const [name, setName] = useState('')
  const [status, setStatus] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const submit = (s) => { if (!name.trim()) return; setStatus(s); setSubmitted(true) }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-[10px] tracking-[0.28em] uppercase text-gold font-medium">{tr.rsvp_panel_title}</p>
        <p className="text-brown-muted text-sm font-light mt-1">{tr.rsvp_panel_sub}</p>
      </div>
      {!submitted ? (
        <>
          <div className="relative z-20 pointer-events-auto">
            <p className="text-[10px] tracking-[0.18em] uppercase text-brown-muted/60 mb-2">{tr.rsvp_name}</p>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Məs: Əli Məmmədov"
              className="w-full text-xs px-4 py-2.5 bg-white/40 border border-white/50 rounded-xl outline-none text-ink placeholder-brown-muted/40 focus:border-gold/50 transition-colors backdrop-blur-sm" />
          </div>
          <div className="flex gap-3 relative z-20 pointer-events-auto">
            <button onClick={() => submit('yes')} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold/10 border border-gold/40 rounded-xl text-xs text-gold font-medium hover:bg-gold/20 transition-all duration-300">
              <UserCheck size={13} strokeWidth={1.5} />{tr.rsvp_yes_btn}
            </button>
            <button onClick={() => submit('no')} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/30 border border-white/50 rounded-xl text-xs text-brown-muted font-medium hover:bg-white/50 transition-all duration-300">
              {tr.rsvp_no_btn}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-4 px-5 bg-gold/[0.06] border border-gold/30 rounded-xl">
          <UserCheck size={24} className="text-gold mx-auto mb-2" strokeWidth={1.4} />
          <p className="font-serif text-base text-ink font-light">{tr.rsvp_thanks_msg}, <span className="text-gold">{name}</span>!</p>
          <p className="text-[11px] text-brown-muted font-light mt-1">{status === 'yes' ? tr.rsvp_yes_sub : tr.rsvp_no_sub}</p>
          <button onClick={() => { setSubmitted(false); setName(''); setStatus(null) }} className="mt-3 text-[10px] text-gold/60 hover:text-gold transition-colors underline underline-offset-2">{tr.rsvp_change}</button>
        </div>
      )}
    </div>
  )
}

function TimelinePanel({ tr }) {
  const TIMELINE = [
    { time: '18:00', label: tr.timeline_i1 }, { time: '19:00', label: tr.timeline_i2 },
    { time: '19:30', label: tr.timeline_i3 }, { time: '21:00', label: tr.timeline_i4 },
    { time: '23:00', label: tr.timeline_i5 },
  ]
  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-[10px] tracking-[0.28em] uppercase text-gold font-medium">{tr.timeline_title}</p>
        <p className="text-brown-muted text-sm font-light mt-1">{tr.timeline_sub}</p>
      </div>
      <div className="relative pl-6 space-y-4">
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gold/25" />
        {TIMELINE.map(({ time, label }, i) => (
          <div key={i} className="flex items-start gap-4 relative">
            <div className="w-5 h-5 rounded-full bg-white/60 border border-gold/50 flex items-center justify-center flex-shrink-0 -ml-6 z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-gold/70" />
            </div>
            <div className="pb-1">
              <span className="text-[10px] tracking-[0.18em] text-gold font-medium">{time}</span>
              <p className="text-[12px] text-ink font-light leading-snug mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GuestbookPanel({ tr }) {
  const [message, setMessage] = useState('')
  const [guestName, setGuestName] = useState('')
  const [messages, setMessages] = useState([{ name: 'Aytən X.', text: 'Xoşbəxt olun, canım! 🤍' }])
  const [sent, setSent] = useState(false)

  const send = () => {
    if (!message.trim()) return
    setMessages(prev => [{ name: guestName.trim() || tr.guestbook_default_name, text: message.trim() }, ...prev])
    setMessage(''); setGuestName(''); setSent(true)
    setTimeout(() => setSent(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-[10px] tracking-[0.28em] uppercase text-gold font-medium">{tr.guestbook_title}</p>
        <p className="text-brown-muted text-sm font-light mt-1">{tr.guestbook_sub}</p>
      </div>
      <div className="relative z-20 pointer-events-auto space-y-2">
        <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)} placeholder={tr.guestbook_name_ph}
          className="w-full text-xs px-4 py-2.5 bg-white/40 border border-white/50 rounded-xl outline-none text-ink placeholder-brown-muted/40 focus:border-gold/50 transition-colors backdrop-blur-sm" />
        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={tr.guestbook_msg_ph} rows={3}
          className="w-full text-xs px-4 py-2.5 bg-white/40 border border-white/50 rounded-xl outline-none text-ink placeholder-brown-muted/40 focus:border-gold/50 transition-colors backdrop-blur-sm resize-none font-light" />
        <button onClick={send} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gold/15 border border-gold/40 rounded-xl text-xs text-gold font-medium hover:bg-gold/25 transition-all duration-300">
          <BookOpen size={12} strokeWidth={1.5} />
          {sent ? tr.guestbook_sent_btn : tr.guestbook_send_btn}
        </button>
      </div>
      {messages.length > 0 && (
        <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div key={i} className="px-4 py-3 bg-white/30 border border-white/40 rounded-xl">
              <p className="text-[10px] text-gold font-medium">{m.name}</p>
              <p className="text-[11px] text-ink font-light mt-0.5 leading-relaxed">{m.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MusicPlayer({ tr }) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)
  const toggle = () => {
    if (!audioRef.current) return
    playing ? audioRef.current.pause() : audioRef.current.play().catch(() => {})
    setPlaying(p => !p)
  }
  const bars = [3, 5, 8, 6, 10, 7, 4, 9, 5, 3]
  return (
    <div className="text-center space-y-4">
      <p className="text-[10px] tracking-[0.28em] uppercase text-gold font-medium">{tr.f_music}</p>
      <p className="text-brown-muted text-sm font-light">{tr.f_music_desc}</p>
      <audio ref={audioRef} src="/wedding-music.mp3" loop preload="none" />
      <div className="flex flex-col items-center gap-4 mt-4">
        <button onClick={toggle} className="w-16 h-16 rounded-full bg-white/40 border border-gold/40 flex items-center justify-center shadow-lg backdrop-blur-md hover:bg-white/60 hover:border-gold/70 transition-all duration-300">
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="6" y="5" width="4" height="14" rx="1" fill="#C5A059"/><rect x="14" y="5" width="4" height="14" rx="1" fill="#C5A059"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M11 5L6 9H3v6h3l5 4V5z" fill="#C5A059" opacity="0.85"/><line x1="17" y1="7" x2="23" y2="13" stroke="#C5A059" strokeWidth="1.8" strokeLinecap="round"/><line x1="23" y1="7" x2="17" y2="13" stroke="#C5A059" strokeWidth="1.8" strokeLinecap="round"/></svg>
          )}
        </button>
        <div className="flex gap-1 items-end h-8">
          {bars.map((h, i) => (
            <div key={i} className="w-1 rounded-full transition-all duration-500"
              style={{ height: playing ? `${h * 3}px` : '3px', backgroundColor: '#C5A059', opacity: playing ? 0.7 : 0.25, animation: playing ? `pulse 0.9s ease-in-out ${i * 90}ms infinite alternate` : 'none' }} />
          ))}
        </div>
        <p className="text-[11px] text-brown-muted/70 font-light italic">{playing ? tr.music_playing_text : tr.music_start_text}</p>
        <p className="text-[10px] text-gold/60 tracking-wide">Canon in D — Johann Pachelbel</p>
      </div>
    </div>
  )
}

function FeatureContent({ featureKey, tr }) {
  const [seatingName, setSeatingName] = useState('')
  const WEDDING_DATE = new Date('2025-09-20T18:00:00')
  const calcTime = () => {
    const diff = WEDDING_DATE - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return { days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) }
  }
  const [timeLeft, setTimeLeft] = useState(calcTime)
  useEffect(() => {
    if (featureKey !== 'countdown') return
    const id = setInterval(() => setTimeLeft(calcTime()), 1000)
    return () => clearInterval(id)
  }, [featureKey])

  if (featureKey === 'countdown') {
    const units = [
      { v: String(timeLeft.days).padStart(2, '0'),    l: tr.inv_days },
      { v: String(timeLeft.hours).padStart(2, '0'),   l: tr.inv_hours },
      { v: String(timeLeft.minutes).padStart(2, '0'), l: tr.inv_minutes },
      { v: String(timeLeft.seconds).padStart(2, '0'), l: tr.inv_seconds },
    ]
    return (
      <div className="text-center space-y-4">
        <p className="text-[10px] tracking-[0.28em] uppercase text-gold font-medium">{tr.f_countdown}</p>
        <p className="text-brown-muted text-sm font-light">{tr.f_countdown_desc}</p>
        <div className="flex justify-center gap-3 mt-4">
          {units.map(({ v, l }) => (
            <div key={l} className="flex flex-col items-center bg-white/20 border border-white/30 rounded-xl p-4 w-20 text-center">
              <span className="font-serif text-3xl text-ink font-light leading-none">{v}</span>
              <span className="text-xs tracking-widest text-amber-700/80 mt-2 uppercase">{l}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (featureKey === 'maps') return (
    <div className="text-center space-y-4">
      <p className="text-[10px] tracking-[0.28em] uppercase text-gold font-medium">{tr.f_maps}</p>
      <p className="text-brown-muted text-sm font-light">{tr.f_maps_desc}</p>
      <div className="mt-3 space-y-1">
        <p className="font-serif text-lg text-ink font-light tracking-wide">Hilton Baku</p>
        <p className="text-[11px] text-brown-muted/80 font-light tracking-wide">1 Azadlıq Square, Bakı AZ1000, Azərbaycan</p>
      </div>
      <div className="flex justify-center gap-3 mt-5">
        <a href="https://maps.google.com/?q=Hilton+Baku" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-5 py-3 bg-white/60 border border-gold/30 rounded-xl text-xs text-ink font-medium hover:bg-amber-50 hover:border-gold/60 transition-all duration-300">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#C5A059" opacity="0.8"/><circle cx="12" cy="9" r="2.5" fill="white"/></svg>
          Google Maps
        </a>
      </div>
    </div>
  )

  if (featureKey === 'dresscode') return <DressCodePanel tr={tr} />
  if (featureKey === 'seating') return (
    <div className="text-center space-y-4">
      <p className="text-[10px] tracking-[0.28em] uppercase text-gold font-medium">{tr.f_seating}</p>
      <p className="text-brown-muted text-sm font-light">{tr.f_seating_desc}</p>
      <div className="flex gap-2 mt-2 max-w-xs mx-auto">
        <input type="text" value={seatingName} onChange={e => setSeatingName(e.target.value)} placeholder="Məs: Əli Məmmədov"
          className="flex-1 text-xs px-4 py-2.5 bg-white/40 border border-white/50 rounded-xl outline-none text-ink placeholder-brown-muted/40 focus:border-gold/50 transition-colors backdrop-blur-sm" />
        <button className="px-4 py-2.5 bg-gold/20 border border-gold/30 rounded-xl text-[10px] text-gold font-medium hover:bg-gold/30 transition-colors">{tr.seating_search_btn}</button>
      </div>
      {seatingName && (
        <div className="mt-3 max-w-sm mx-auto px-5 py-4 border border-gold/40 rounded-xl bg-gold/[0.06] backdrop-blur-sm space-y-3 text-left">
          <p className="font-serif text-base text-ink font-light">{tr.seating_your_table_label} <span className="text-gold font-medium">{tr.inv_table} № 5</span></p>
          <div className="h-px bg-gold/20" />
          <div className="flex flex-wrap gap-2">
            {['Elşən Məmmədov', 'Günel Məmmədova', 'Leyla Əliyeva'].map(name => (
              <span key={name} className="text-[11px] text-ink font-light px-3 py-1.5 bg-white/50 border border-white/60 rounded-lg backdrop-blur-sm">{name}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  if (featureKey === 'gallery') return <GallerySlider tr={tr} />
  if (featureKey === 'music') return <MusicPlayer tr={tr} />
  if (featureKey === 'rsvp') return <RSVPPanel tr={tr} />
  if (featureKey === 'timeline') return <TimelinePanel tr={tr} />
  if (featureKey === 'guestbook') return <GuestbookPanel tr={tr} />
  return null
}

/* ── Gold concentric rings — parallax-aware decorator ── */
function GoldRings() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 80, damping: 20 })
  const sy = useSpring(my, { stiffness: 80, damping: 20 })
  const ringsX = useTransform(sx, (v) => -v * 8)
  const ringsY = useTransform(sy, (v) => -v * 8)

  useEffect(() => {
    const onMove = (e) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      mx.set((e.clientX - cx) / window.innerWidth)
      my.set((e.clientY - cy) / window.innerHeight)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mx, my])

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ x: ringsX, y: ringsY, zIndex: 0 }}
      aria-hidden
    >
      <div className="absolute rounded-full border border-gold/[0.12]" style={{ width: 280, height: 280, top: '50%', left: '50%', marginTop: -140, marginLeft: -140 }} />
      <div className="absolute rounded-full border border-gold/[0.08]" style={{ width: 480, height: 480, top: '50%', left: '50%', marginTop: -240, marginLeft: -240 }} />
      <div className="absolute rounded-full border border-gold/[0.05]" style={{ width: 680, height: 680, top: '50%', left: '50%', marginTop: -340, marginLeft: -340 }} />
    </motion.div>
  )
}

/* ── Silk-inspired animated background (CSS-based, no WebGL needed) ── */
function SilkBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
      <video
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-multiply"
        style={{ filter: 'saturate(0.7) contrast(1.05)' }}
      >
        <source src="/rings-bg.mp4" type="video/mp4" />
      </video>
      {/* Silk shimmer overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(253,251,247,0.92) 0%, rgba(244,241,234,0.88) 50%, rgba(253,251,247,0.92) 100%)',
      }} />
      {/* Ambient gold orb */}
      <div style={{
        position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: '90vw', height: '60vh', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(232,213,163,0.18) 0%, transparent 68%)',
        animation: 'orb-float 12s ease-in-out infinite',
      }} />
      {/* Bottom vignette */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
        background: 'linear-gradient(to top, rgba(244,241,234,0.6), transparent)',
      }} />
      <style>{`
        @keyframes orb-float {
          0%, 100% { transform: translateX(-50%) translateY(0);  }
          50%       { transform: translateX(-50%) translateY(-24px); }
        }
      `}</style>
    </div>
  )
}

export default function Hero({ lang, onStart, onDemo }) {
  const tr = t[lang]
  const [activeFeature, setActiveFeature] = useState(null)
  const features = featureKeys.map(k => ({ key: k, label: tr[`f_${k}`] }))

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-36 pb-28 overflow-hidden">
      <SilkBackground />
      <GoldRings />

      {/* ── Announcement badge — glass-gold pill ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.32, 0, 0.68, 1] }}
        className="relative inline-flex items-center gap-2.5 px-[18px] py-2 rounded-full glass-gold text-[11px] font-semibold tracking-[0.32em] text-gold-dark uppercase mb-12"
      >
        <span className="text-gold">✦</span>
        <span>Premium Digital Invitation</span>
        <span className="text-gold">✦</span>
      </motion.div>

      {/* ── H1 ── */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05, ease: [0.32, 0, 0.68, 1] }}
        className="relative font-serif font-normal text-espresso text-center mt-0 mb-3.5 leading-[1.02] tracking-[-0.01em] max-w-3xl"
        style={{ fontSize: 'clamp(48px, 6vw, 84px)' }}
      >
        {tr.hero_line1}{' '}
        <span className="italic text-gold-gradient" style={{ filter: 'drop-shadow(0 4px 24px rgba(197,160,89,0.35))' }}>
          {tr.hero_line2}
        </span>
      </motion.h1>

      {/* Gold divider ornament */}
      <BlurFade delay={0.45}>
        <div className="relative flex items-center gap-3 mb-10 w-full max-w-[200px]">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55))' }} />
          <div className="w-1 h-1 bg-gold rotate-45 opacity-70" />
          <div className="w-2 h-2 border border-gold/60 rotate-45" />
          <div className="w-1 h-1 bg-gold rotate-45 opacity-70" />
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(197,160,89,0.55))' }} />
        </div>
      </BlurFade>

      {/* ── Subtitle ── */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12, ease: [0.32, 0, 0.68, 1] }}
        className="relative text-brown-dark text-[17px] text-center leading-[1.65] max-w-[480px] mb-8"
      >
        {tr.hero_subtitle}
      </motion.p>

      {/* ── CTA Buttons ── */}
      <BlurFade delay={0.6}>
        <div className="relative flex flex-col sm:flex-row gap-3 mb-20">
          <motion.button
            onClick={onStart}
            className="btn-gold min-h-[52px]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
          >
            {tr.hero_cta}
          </motion.button>
          <motion.button
            onClick={onDemo}
            className="btn-ghost-gold min-h-[52px]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
          >
            {tr.hero_demo}
          </motion.button>
        </div>
      </BlurFade>

      {/* ── Feature pills ── */}
      <BlurFade delay={0.7}>
        <div className="relative flex flex-wrap justify-center gap-2 max-w-xl">
          {features.map(({ key, label }) => {
            const Icon = featureIcons[key]
            const isActive = activeFeature === key
            return (
              <button
                key={key}
                onClick={() => setActiveFeature(isActive ? null : key)}
                className={`flex items-center gap-2 text-[10px] tracking-[0.12em] px-4 py-2 border uppercase transition-all duration-300 active:scale-95 cursor-pointer ${
                  isActive ? 'bg-gold/15 border-gold/60 text-gold' : 'bg-beige border-beige-dark/60 text-brown-muted hover:border-gold/40 hover:text-gold/80'
                }`}
              >
                <Icon size={10} strokeWidth={1.5} />
                {label}
              </button>
            )
          })}
        </div>
      </BlurFade>

      {/* Feature panel */}
      <div className={`relative max-w-2xl w-full mx-auto mt-8 transition-all duration-500 overflow-visible ${activeFeature ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {activeFeature && (
          <div className="bg-white/40 backdrop-blur-md border border-amber-500/10 hover:border-amber-500/30 rounded-2xl p-6 shadow-xl transition-all duration-500">
            <FeatureContent featureKey={activeFeature} tr={tr} />
          </div>
        )}
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
        <ChevronDown size={18} className="text-gold/35" strokeWidth={1.5} />
      </div>
    </section>
  )
}

export function FAQSection({ lang = 'az' }) {
  const tr = t[lang]
  const [open, setOpen] = useState(null)
  const faqs = [
    { q: tr.faq_q1, a: tr.faq_a1 },
    { q: tr.faq_q2, a: tr.faq_a2 },
    { q: tr.faq_q3, a: tr.faq_a3 },
  ]

  return (
    <section id="faq" className="py-20 relative z-10 bg-cream/80 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-6">
        <BlurFade>
          <div className="text-center mb-12">
            <p className="text-[10px] tracking-[0.38em] uppercase text-gold font-medium mb-4">FAQ</p>
            <h3 className="font-serif text-2xl sm:text-3xl text-ink font-light tracking-tight">{tr.faq_title}</h3>
            <div className="flex items-center justify-center gap-3 mt-5 max-w-[180px] mx-auto">
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55))' }} />
              <div className="w-1.5 h-1.5 border border-gold/60 rotate-45" />
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(197,160,89,0.55))' }} />
            </div>
          </div>
        </BlurFade>
        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => {
            const isOpen = open === i
            return (
              <BlurFade key={i} delay={i * 0.08}>
                <div className="bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-5 sm:px-6 py-4 text-left min-h-[52px] touch-manipulation"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm text-ink font-light pr-4 leading-relaxed">{q}</span>
                    <motion.span
                      className="flex-shrink-0 text-gold"
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: [0.32, 0, 0.68, 1] }}
                    >
                      <ChevronDown size={16} strokeWidth={1.5} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.32, 0, 0.68, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p className="px-5 sm:px-6 pb-5 text-[13px] text-brown-muted font-light leading-[1.85] border-t border-white/30 pt-3">{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </BlurFade>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function HeroFooter({ lang = 'az' }) {
  const tr = t[lang]
  return (
    <footer id="site-footer" className="relative z-10 bg-espresso/95 backdrop-blur-md pt-14 pb-8 px-6">
      <div id="contact-section" />
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-10 border-b border-white/10">
          <div>
            <div className="font-serif text-xl tracking-widest mb-2">
              <span className="text-gold font-light">Digitoy</span>
              <span className="text-white/30 font-light">.az</span>
            </div>
            <p className="text-white/40 text-[11px] font-light tracking-wide max-w-[220px] leading-relaxed">{tr.footer_tagline}</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:border-gold/50 hover:bg-gold/10 transition-all duration-300">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(197,160,89,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="rgba(197,160,89,0.7)" stroke="none"/></svg>
            </a>
            <a href="https://wa.me/994555696549" aria-label="WhatsApp" className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:border-gold/50 hover:bg-gold/10 transition-all duration-300">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.18-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.85 0-3.67-.5-5.25-1.44l-.38-.22-3.67.96.98-3.58-.25-.38A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2c2.67 0 5.18 1.04 7.07 2.93A9.94 9.94 0 0 1 22 12c0 5.52-4.48 10-10 10z" fill="rgba(197,160,89,0.7)"/></svg>
            </a>
          </div>
        </div>
        <p className="text-center text-white/20 text-[10px] tracking-[0.25em] mt-7 uppercase font-light">
          © {new Date().getFullYear()} Digitoy.az. {tr.footer_rights}
        </p>
      </div>
    </footer>
  )
}

export function FeaturesSection({ lang = 'az' }) {
  const tr = t[lang]
  const cards = [
    { Icon: Timer,     titleKey: 'f_countdown', descKey: 'fg_countdown_desc' },
    { Icon: MapPin,    titleKey: 'f_maps',       descKey: 'fg_maps_desc'      },
    { Icon: Shirt,     titleKey: 'f_dresscode',  descKey: 'fg_dresscode_desc' },
    { Icon: Users,     titleKey: 'f_seating',    descKey: 'fg_seating_desc'   },
    { Icon: Camera,    titleKey: 'f_gallery',    descKey: 'fg_gallery_desc'   },
    { Icon: Music,     titleKey: 'f_music',      descKey: 'fg_music_desc'     },
    { Icon: UserCheck, titleKey: 'f_rsvp',       descKey: 'fg_rsvp_desc'      },
    { Icon: Clock,     titleKey: 'f_timeline',   descKey: 'fg_timeline_desc'  },
    { Icon: BookOpen,  titleKey: 'f_guestbook',  descKey: 'fg_guestbook_desc' },
  ]

  return (
    <section id="features" className="py-12 md:py-24 px-6 relative z-10 bg-beige/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto">
        <BlurFade>
          <div className="text-center mb-12">
            <p className="text-[10px] tracking-[0.38em] uppercase text-gold font-medium mb-4">{tr.features_badge}</p>
            <h3 className="font-serif text-2xl md:text-4xl text-ink font-light tracking-tight">{tr.features_section_heading}</h3>
            <div className="flex items-center justify-center gap-3 mt-5 max-w-[180px] mx-auto">
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55))' }} />
              <div className="w-1 h-1 bg-gold rotate-45 opacity-70" />
              <div className="w-2 h-2 border border-gold/60 rotate-45" />
              <div className="w-1 h-1 bg-gold rotate-45 opacity-70" />
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(197,160,89,0.55))' }} />
            </div>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map(({ Icon, titleKey, descKey }, i) => (
            <BlurFade key={titleKey} delay={i * 0.06}>
              <div className="group bg-white/30 backdrop-blur-sm border border-amber-500/10 rounded-xl p-5 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-2xl hover:bg-white/50 hover:border-amber-500/30 transition-all duration-500 h-full">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors duration-300">
                    <Icon size={16} className="text-gold" strokeWidth={1.5} />
                  </div>
                  <p className="text-[11px] tracking-[0.18em] uppercase text-ink font-semibold">{tr[titleKey]}</p>
                </div>
                <p className="text-[11px] text-brown-muted font-light leading-[1.9]">{tr[descKey]}</p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
