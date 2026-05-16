import { ArrowLeft, MapPin, Navigation, QrCode, ExternalLink, ChevronDown } from 'lucide-react'
import FloralBackground from './FloralBackground'
import CountdownTimer from './CountdownTimer'
import SeatingSearch from './SeatingSearch'
import MusicToggle from './MusicToggle'
import LanguageSwitcher from '../LanguageSwitcher'
import { DRESS_CODE_PALETTES } from '../../data/constants'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import t from '../../data/translations'

function SectionWrapper({ children, className = '' }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div ref={ref} className={`reveal-hidden ${visible ? 'reveal-visible' : ''} ${className}`}>
      {children}
    </div>
  )
}

function GoldDividerOrnament() {
  return (
    <div className="flex items-center justify-center gap-3 my-8">
      <div className="flex-1 max-w-[80px] h-px" style={{ background: 'linear-gradient(to right, transparent, #C9A84C66)' }} />
      <div className="w-1 h-1 bg-gold rotate-45" />
      <div className="w-2 h-2 border border-gold rotate-45" />
      <div className="w-1 h-1 bg-gold rotate-45" />
      <div className="flex-1 max-w-[80px] h-px" style={{ background: 'linear-gradient(to left, transparent, #C9A84C66)' }} />
    </div>
  )
}

function formatDisplayDate(dateStr, lang) {
  if (!dateStr) return ''
  try {
    const locales = { az: 'az-AZ', en: 'en-US', ru: 'ru-RU' }
    return new Date(dateStr + 'T00:00:00').toLocaleDateString(locales[lang] || 'az-AZ', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default function InvitationPage({ lang, setLang, weddingData, onBack }) {
  const tr = t[lang]
  const palette = DRESS_CODE_PALETTES.find((p) => p.id === weddingData.dressCodePalette) || DRESS_CODE_PALETTES[0]

  const eventLabels = {
    toy: tr.event_toy, nishan: tr.event_nishan,
    birthday: tr.event_birthday, corporate: tr.event_corporate,
  }

  return (
    <div className="relative min-h-screen bg-cream overflow-x-hidden">
      <FloralBackground />
      <MusicToggle lang={lang} />

      {/* Sticky minimal header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-cream/90 backdrop-blur-sm border-b border-beige-dark/60">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs text-brown-muted hover:text-gold transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            {tr.btn_back}
          </button>
          <div className="font-serif text-sm">
            <span className="text-gold-gradient font-medium">Digitoy</span>
            <span className="text-brown-muted/60">.az</span>
          </div>
          <LanguageSwitcher lang={lang} setLang={setLang} />
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center">
        {/* Subtle top accent */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, transparent, #C9A84C, transparent)' }} />

        <div className="animate-fade-in">
          <p className="text-[10px] tracking-[0.35em] uppercase text-gold mb-6 font-medium">
            {eventLabels[weddingData.eventType] || tr.event_toy}
          </p>

          <p className="font-serif text-sm tracking-[0.2em] uppercase text-brown-muted mb-4">
            {tr.inv_join}
          </p>

          {/* Names */}
          <h1 className="font-serif leading-none mb-2">
            <span className="block text-4xl sm:text-5xl md:text-6xl text-ink font-light">{weddingData.brideName}</span>
            <span className="block text-3xl sm:text-4xl text-gold font-light italic my-1">{tr.inv_and}</span>
            <span className="block text-4xl sm:text-5xl md:text-6xl text-ink font-light">{weddingData.groomName}</span>
          </h1>

          <GoldDividerOrnament />

          <p className="text-sm text-brown-muted font-light tracking-wide mb-1">
            {formatDisplayDate(weddingData.date, lang)}
          </p>
          {weddingData.time && (
            <p className="text-sm text-brown-muted font-light">{weddingData.time}</p>
          )}
          {weddingData.venueName && (
            <p className="mt-3 text-xs tracking-[0.15em] uppercase text-gold/80">{weddingData.venueName}</p>
          )}
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <ChevronDown size={18} className="text-gold/40" />
        </div>
      </section>

      {/* ── COUNTDOWN ── */}
      <CountdownTimer date={weddingData.date} time={weddingData.time} lang={lang} />

      {/* ── LOCATION ── */}
      <section className="py-20 px-6 bg-cream">
        <SectionWrapper className="max-w-lg mx-auto text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-gold mb-2">Location</p>
          <h2 className="font-serif text-2xl text-ink font-light mb-3">{tr.inv_location}</h2>
          <p className="text-brown-muted text-sm mb-8">{weddingData.venueName}</p>
          <GoldDividerOrnament />
          <div className="flex gap-3 mt-2">
            <a
              href={weddingData.googleMapsUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 btn-gold text-xs tracking-widest uppercase"
            >
              <MapPin size={14} />
              {tr.inv_maps_btn}
            </a>
            <a
              href={weddingData.wazeUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 btn-outline-gold text-xs tracking-widest uppercase"
            >
              <Navigation size={14} />
              {tr.inv_waze_btn}
            </a>
          </div>
        </SectionWrapper>
      </section>

      {/* ── DRESS CODE ── */}
      <section className="py-20 px-6 bg-beige">
        <SectionWrapper className="max-w-lg mx-auto text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-gold mb-2">Style</p>
          <h2 className="font-serif text-2xl text-ink font-light mb-8">{tr.inv_dresscode}</h2>

          {/* Color swatches */}
          <div className="flex justify-center gap-4 mb-6">
            {palette.colors.map((color, i) => (
              <div key={color} className="flex flex-col items-center gap-2">
                <div
                  className="w-12 h-12 shadow-md border-2 border-white/80"
                  style={{ backgroundColor: color, borderRadius: '2px', transform: `rotate(${i % 2 === 0 ? '-3deg' : '3deg'})` }}
                />
                <div
                  className="w-2 h-2 rounded-full opacity-60"
                  style={{ backgroundColor: color }}
                />
              </div>
            ))}
          </div>

          <p className="font-serif text-lg text-ink mb-2">{palette.label[lang]}</p>
          <p className="text-sm text-brown-muted leading-relaxed max-w-xs mx-auto">
            {weddingData.dressCodeDescription || palette.description[lang]}
          </p>
        </SectionWrapper>
      </section>

      {/* ── SEATING PLAN ── */}
      {weddingData.seatingPlan && (
        <SeatingSearch seatingPlan={weddingData.seatingPlan} lang={lang} />
      )}

      {/* ── GALLERY ── */}
      <section className="py-20 px-6 bg-cream">
        <SectionWrapper className="max-w-lg mx-auto text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-gold mb-2">Gallery</p>
          <h2 className="font-serif text-2xl text-ink font-light mb-4">{tr.inv_gallery}</h2>
          <GoldDividerOrnament />

          {/* Simulated QR code */}
          <div className="inline-flex flex-col items-center mb-6">
            <div className="w-32 h-32 border-2 border-gold/30 bg-beige flex items-center justify-center relative mb-3">
              <div className="absolute inset-2 border border-gold/20" />
              <QrCode size={64} className="text-gold/40" />
              {/* Corner accents */}
              <div className="absolute top-1 left-1 w-4 h-4 border-l-2 border-t-2 border-gold" />
              <div className="absolute top-1 right-1 w-4 h-4 border-r-2 border-t-2 border-gold" />
              <div className="absolute bottom-1 left-1 w-4 h-4 border-l-2 border-b-2 border-gold" />
              <div className="absolute bottom-1 right-1 w-4 h-4 border-r-2 border-b-2 border-gold" />
            </div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-brown-muted">Scan to upload</p>
          </div>

          <p className="text-sm text-brown-muted leading-relaxed max-w-xs mx-auto mb-8">
            {tr.inv_gallery_desc}
          </p>

          <a
            href={weddingData.galleryLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 btn-gold text-xs tracking-widest uppercase"
          >
            <ExternalLink size={14} />
            {tr.inv_gallery_btn}
          </a>
        </SectionWrapper>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6 bg-ink text-center">
        <div className="font-serif text-base mb-2">
          <span className="text-gold">{weddingData.brideName}</span>
          <span className="text-white/30 mx-2 italic">&</span>
          <span className="text-gold">{weddingData.groomName}</span>
        </div>
        <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase mb-6">
          {weddingData.date}
        </p>
        <div className="h-px mb-6" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)' }} />
        <p className="text-white/20 text-[10px] tracking-widest">{tr.footer_made}</p>
      </footer>
    </div>
  )
}
