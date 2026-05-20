import { useState } from 'react'
import { ArrowLeft, MapPin, Navigation, QrCode, ExternalLink, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import FloralBackground from './FloralBackground'
import CountdownTimer from './CountdownTimer'
import SeatingSearch from './SeatingSearch'
import MusicToggle from './MusicToggle'
import LanguageSwitcher from '../LanguageSwitcher'
import EnvelopeOpening from './EnvelopeOpening'
import RSVPSection from './RSVPSection'
import Guestbook from './Guestbook'
import EventTimeline from './EventTimeline'
import DynamicHeroAnimation from './DynamicHeroAnimation'
import ThreeDSeatingChart from './ThreeDSeatingChart'
import ThreeDDressCode from './ThreeDDressCode'
import { DRESS_CODE_PALETTES } from '../../data/constants'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { formatAzDate, formatFullDateByLang, formatTime24 } from '../../utils/dateFormat'
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
    <div className="flex items-center justify-center gap-3 my-10">
      <div className="flex-1 max-w-[60px] h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.45))' }} />
      <div className="w-1 h-1 bg-gold/60 rotate-45" />
      <div className="w-1.5 h-1.5 border border-gold/50 rotate-45" />
      <div className="w-1 h-1 bg-gold/60 rotate-45" />
      <div className="flex-1 max-w-[60px] h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(197,160,89,0.45))' }} />
    </div>
  )
}


export default function InvitationPage({ lang, setLang, weddingData, onBack }) {
  const tr = t[lang]
  const [envelopeOpened, setEnvelopeOpened] = useState(false)
  const palette = DRESS_CODE_PALETTES.find((p) => p.id === weddingData.dressCodePalette) || DRESS_CODE_PALETTES[0]

  const isCouple = ['toy', 'nishan'].includes(weddingData.eventType)
  const isCorp   = ['corporate', 'other'].includes(weddingData.eventType)

  const eventLabels = {
    toy: tr.event_toy, nishan: tr.event_nishan,
    birthday: tr.event_birthday, corporate: tr.event_corporate,
    other: weddingData.eventName || tr.event_other,
  }

  // Primary palette color for 3D fabric
  const fabricColor = palette.colors[0] || '#C9A88A'

  return (
    <div className="relative min-h-screen bg-cream overflow-x-hidden">
      {/* Envelope opening screen */}
      <EnvelopeOpening
        brideName={isCorp ? (weddingData.eventName || eventLabels[weddingData.eventType]) : weddingData.brideName}
        groomName={isCouple ? weddingData.groomName : null}
        eventLabel={eventLabels[weddingData.eventType] || tr.event_other}
        eventType={weddingData.eventType || 'toy'}
        onComplete={() => setEnvelopeOpened(true)}
      />

      {/* Main invitation — fades in after envelope */}
      <AnimatePresence>
        {envelopeOpened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
          >
            <FloralBackground />
            <MusicToggle lang={lang} />

            {/* Sticky minimal header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-cream/88 backdrop-blur-md border-b border-beige-dark/30">
              <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase text-brown-muted hover:text-gold transition-colors duration-300 font-medium"
                >
                  <ArrowLeft size={13} strokeWidth={1.5} />
                  {tr.btn_back}
                </button>
                <div className="font-serif text-sm tracking-wider">
                  <span className="text-gold font-light">Digitoy</span>
                  <span className="text-brown-muted/40 font-light">.az</span>
                </div>
                <LanguageSwitcher lang={lang} setLang={setLang} />
              </div>
            </header>

            {/* ── HERO ── */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-20 text-center">
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.5), transparent)' }} />

              <div className="animate-fade-in w-full">
                <p className="text-[9px] tracking-[0.45em] uppercase text-gold mb-8 font-medium">
                  {eventLabels[weddingData.eventType] || tr.event_toy}
                </p>

                <p className="font-serif text-[11px] tracking-[0.3em] uppercase text-brown-muted mb-6 font-light">
                  {tr.inv_join}
                </p>

                {/* Names */}
                <h1 className="font-serif leading-none mb-3">
                  {isCouple ? (
                    <>
                      <span className="block text-5xl sm:text-6xl md:text-7xl text-ink font-light tracking-tight">{weddingData.brideName}</span>
                      <span className="block text-3xl sm:text-4xl text-gold font-light italic my-3">{tr.inv_and}</span>
                      <span className="block text-5xl sm:text-6xl md:text-7xl text-ink font-light tracking-tight">{weddingData.groomName}</span>
                    </>
                  ) : isCorp ? (
                    <span className="block text-4xl sm:text-5xl md:text-6xl text-ink font-light tracking-widest uppercase text-center">
                      {weddingData.eventName || eventLabels[weddingData.eventType]}
                    </span>
                  ) : (
                    <span className="block text-5xl sm:text-6xl md:text-7xl text-ink font-light tracking-tight">{weddingData.brideName}</span>
                  )}
                </h1>

                {isCorp && weddingData.organizer?.trim() && (
                  <p className="text-[10px] tracking-[0.28em] uppercase text-gold/70 font-medium mt-2 mb-1">
                    {tr.organizer_display}: {weddingData.organizer}
                  </p>
                )}

                <GoldDividerOrnament />

                {(() => {
                  const { formattedDate, dayName } = formatAzDate(weddingData.date, lang)
                  return (
                    <>
                      <p className="text-sm text-brown-muted font-light tracking-wider mb-0.5">
                        {formattedDate}
                      </p>
                      {dayName && (
                        <p className="text-[11px] tracking-[0.22em] uppercase text-gold/70 font-medium mb-1.5">
                          {dayName}
                        </p>
                      )}
                    </>
                  )
                })()}
                {weddingData.time && (
                  <p className="text-sm text-brown-muted font-light tracking-wide">{formatTime24(weddingData.time)}</p>
                )}
                {weddingData.venueName && (
                  <p className="mt-5 text-[10px] tracking-[0.28em] uppercase text-gold/70 font-medium">{weddingData.venueName}</p>
                )}

                {/* Dynamic animation by event type */}
                <div className="mt-10 max-w-xs mx-auto">
                  <DynamicHeroAnimation eventType={weddingData.eventType || 'toy'} />
                </div>
              </div>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
                <ChevronDown size={16} className="text-gold/30" strokeWidth={1.5} />
              </div>
            </section>

            {/* ── COUNTDOWN ── */}
            <CountdownTimer
              date={weddingData.date}
              time={weddingData.time}
              lang={lang}
              eventType={weddingData.eventType || 'toy'}
              eventName={weddingData.eventName || ''}
            />

            {/* ── LOCATION ── */}
            <section className="py-28 px-6 bg-cream">
              <SectionWrapper className="max-w-lg mx-auto text-center">
                <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-4 font-medium">Location</p>
                <h2 className="font-serif text-2xl text-ink font-light tracking-tight mb-4">{tr.inv_location}</h2>
                <p className="text-brown-muted text-sm font-light tracking-wide leading-relaxed mb-10">{weddingData.venueName}</p>
                <GoldDividerOrnament />
                <div className="flex gap-3 mt-4">
                  <a
                    href={weddingData.googleMapsUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-[#d4af37] text-black text-xs tracking-widest uppercase font-medium transition-opacity hover:opacity-90"
                  >
                    <MapPin size={13} strokeWidth={1.5} />
                    Google Maps
                  </a>
                  <a
                    href={weddingData.wazeUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-5 border border-[#d4af37] text-[#d4af37] text-xs tracking-widest uppercase font-medium transition-opacity hover:opacity-80"
                  >
                    <Navigation size={13} strokeWidth={1.5} />
                    Waze
                  </a>
                </div>
              </SectionWrapper>
            </section>

            {/* ── EVENT TIMELINE (Program) ── */}
            <EventTimeline lang={lang} eventType={weddingData.eventType} programSteps={weddingData.programSteps} />

            {/* ── DRESS CODE ── */}
            <section className="py-28 px-6 bg-beige">
              <SectionWrapper className="max-w-lg mx-auto text-center">
                <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-4 font-medium">Style</p>
                <h2 className="font-serif text-2xl text-ink font-light tracking-tight mb-10">{tr.inv_dresscode}</h2>

                {/* 3D animated fabric */}
                <div className="mb-8">
                  <ThreeDDressCode color={fabricColor} />
                </div>

                {/* Color swatches */}
                <div className="flex justify-center gap-5 mb-8">
                  {palette.colors.map((color, i) => (
                    <div key={color} className="flex flex-col items-center gap-2.5">
                      <div
                        className="w-10 h-10 border border-white/60 shadow-sm"
                        style={{
                          backgroundColor: color,
                          borderRadius: '1px',
                          transform: `rotate(${i % 2 === 0 ? '-4deg' : '4deg'})`,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        }}
                      />
                      <div
                        className="w-1.5 h-1.5 rounded-full opacity-50"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  ))}
                </div>

                <p className="font-serif text-lg text-ink mb-3 font-light">{palette.label[lang]}</p>
                <p className="text-sm text-brown-muted leading-[1.9] max-w-xs mx-auto font-light tracking-wide">
                  {weddingData.dressCodeDescription || palette.description[lang]}
                </p>
              </SectionWrapper>
            </section>

            {/* ── SEATING PLAN — 3D if has data, else classic search ── */}
            {weddingData.seatingPlan && (
              <>
                <ThreeDSeatingChart seatingPlan={weddingData.seatingPlan} lang={lang} />
                <SeatingSearch seatingPlan={weddingData.seatingPlan} lang={lang} />
              </>
            )}

            {/* ── GALLERY ── */}
            <section className="py-28 px-6 bg-cream">
              <SectionWrapper className="max-w-lg mx-auto text-center">
                <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-4 font-medium">Gallery</p>
                <h2 className="font-serif text-2xl text-ink font-light tracking-tight mb-5">{tr.inv_gallery}</h2>
                <GoldDividerOrnament />

                <div className="inline-flex flex-col items-center mb-8">
                  <div className="w-28 h-28 border border-gold/20 bg-beige/60 flex items-center justify-center relative mb-4">
                    <div className="absolute inset-2 border border-gold/10" />
                    <QrCode size={56} className="text-gold/30" strokeWidth={1} />
                    <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-l border-t border-gold/50" />
                    <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-r border-t border-gold/50" />
                    <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-l border-b border-gold/50" />
                    <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-r border-b border-gold/50" />
                  </div>
                  <p className="text-[9px] tracking-[0.28em] uppercase text-brown-muted/60 font-medium">Scan to upload</p>
                </div>

                <p className="text-sm text-brown-muted leading-[1.9] max-w-xs mx-auto mb-10 font-light tracking-wide">
                  {tr.inv_gallery_desc}
                </p>

                <a
                  href={weddingData.galleryLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 btn-gold"
                >
                  <ExternalLink size={13} strokeWidth={1.5} />
                  {tr.inv_gallery_btn}
                </a>
              </SectionWrapper>
            </section>

            {/* ── RSVP ── */}
            <RSVPSection lang={lang} weddingData={weddingData} />

            {/* ── GUESTBOOK ── */}
            <Guestbook lang={lang} />

            {/* ── FOOTER ── */}
            <footer className="py-16 px-6 bg-espresso text-center">
              <div className="font-serif text-base mb-3 tracking-wider">
                {isCouple ? (
                  <>
                    <span className="text-gold font-light">{weddingData.brideName}</span>
                    <span className="text-white/25 mx-3 italic font-light">&</span>
                    <span className="text-gold font-light">{weddingData.groomName}</span>
                  </>
                ) : isCorp ? (
                  <span className="text-gold font-light tracking-widest uppercase text-sm">
                    {weddingData.eventName || eventLabels[weddingData.eventType]}
                  </span>
                ) : (
                  <span className="text-gold font-light">{weddingData.brideName}</span>
                )}
              </div>
              <p className="text-white/25 text-[10px] tracking-[0.2em] uppercase font-medium mb-8">
                {formatFullDateByLang(weddingData.date, lang)}
              </p>
              <div className="gold-divider mb-8 max-w-[120px] mx-auto opacity-25" />
              <p className="text-white/15 text-[10px] tracking-widest">{tr.footer_made}</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
