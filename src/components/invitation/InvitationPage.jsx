import { useState, useCallback } from 'react'
import { ArrowLeft, MapPin, Navigation, Download, ExternalLink, ChevronDown, Camera } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
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

  const fabricColor = palette.colors[0] || '#C9A88A'

  const pageSlug = (window.location.pathname.match(/\/invite\/([^/?#]+)/) || [])[1] || ''
  const photoShareUrl = pageSlug
    ? `https://digitoy.az/invite/${pageSlug}/foto`
    : 'https://digitoy.az'

  const downloadTableCard = useCallback(() => {
    const names = isCouple
      ? `${weddingData.brideName || ''} & ${weddingData.groomName || ''}`
      : weddingData.brideName || weddingData.eventName || 'Digitoy'
    const dateStr = weddingData.date || ''
    const qrUrl = photoShareUrl

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="420" viewBox="0 0 420 420">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FDFAF4"/><stop offset="100%" stop-color="#F2EAD6"/></linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="transparent"/><stop offset="40%" stop-color="#C5A059"/><stop offset="60%" stop-color="#C5A059"/><stop offset="100%" stop-color="transparent"/></linearGradient>
  </defs>
  <rect width="420" height="420" fill="url(#bg)"/>
  <rect x="1" y="1" width="418" height="418" fill="none" stroke="rgba(197,160,89,0.4)" stroke-width="1"/>
  <rect x="12" y="12" width="396" height="396" fill="none" stroke="rgba(197,160,89,0.18)" stroke-width="0.5"/>
  <!-- Corner ornaments -->
  <path d="M22,22 L42,22 M22,22 L22,42" stroke="rgba(197,160,89,0.65)" stroke-width="1.5" fill="none"/>
  <path d="M398,22 L378,22 M398,22 L398,42" stroke="rgba(197,160,89,0.65)" stroke-width="1.5" fill="none"/>
  <path d="M22,398 L42,398 M22,398 L22,378" stroke="rgba(197,160,89,0.65)" stroke-width="1.5" fill="none"/>
  <path d="M398,398 L378,398 M398,398 L398,378" stroke="rgba(197,160,89,0.65)" stroke-width="1.5" fill="none"/>
  <!-- Title -->
  <text x="210" y="62" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="rgba(197,160,89,0.85)" letter-spacing="4">FOTO · PAYLAŞIM</text>
  <rect x="105" y="72" width="210" height="0.8" fill="url(#gold)"/>
  <!-- Names -->
  <text x="210" y="108" text-anchor="middle" font-family="Georgia,serif" font-size="22" font-weight="300" fill="#1A1A1A">${names}</text>
  <text x="210" y="132" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="rgba(140,123,107,0.7)" letter-spacing="2">${dateStr}</text>
  <rect x="150" y="144" width="120" height="0.6" fill="url(#gold)"/>
  <!-- QR placeholder area -->
  <rect x="135" y="158" width="150" height="150" rx="4" fill="white" stroke="rgba(197,160,89,0.3)" stroke-width="1"/>
  <text x="210" y="244" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="rgba(140,123,107,0.5)">${qrUrl}</text>
  <!-- Footer label -->
  <rect x="105" y="320" width="210" height="0.6" fill="url(#gold)"/>
  <text x="210" y="342" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="rgba(140,123,107,0.65)" letter-spacing="3">TOY ŞƏKİLLƏRİNİZİ PAYLAŞIN</text>
  <text x="210" y="380" text-anchor="middle" font-family="Georgia,serif" font-size="9" fill="rgba(197,160,89,0.6)" letter-spacing="2">digitoy.az</text>
</svg>`

    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `masa-karti-${pageSlug || 'digitoy'}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }, [weddingData, pageSlug, photoShareUrl, isCouple])

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
                {isCorp ? (
                  <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
                    <DynamicHeroAnimation eventType={weddingData.eventType || 'toy'} />
                  </div>
                ) : (
                  <div className="mt-10 max-w-xs mx-auto">
                    <DynamicHeroAnimation eventType={weddingData.eventType || 'toy'} />
                  </div>
                )}
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

                {/* Luxury dress code showcase */}
                <div className="mb-8">
                  <ThreeDDressCode color={fabricColor} palette={palette} lang={lang} />
                </div>

                <p className="text-sm text-brown-muted leading-[1.9] max-w-xs mx-auto font-light tracking-wide">
                  {weddingData.dressCodeDescription || palette.description[lang]}
                </p>
              </SectionWrapper>
            </section>

            {/* ── SEATING — lüks axtarış UI ── */}
            {weddingData.seatingPlan && (
              <SeatingSearch seatingPlan={weddingData.seatingPlan} lang={lang} />
            )}

            {/* ── GALLERY ── */}
            <section className="py-28 px-6 bg-cream">
              <SectionWrapper className="max-w-lg mx-auto text-center">
                <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-4 font-medium">Gallery</p>
                <h2 className="font-serif text-2xl text-ink font-light tracking-tight mb-5">{tr.inv_gallery}</h2>
                <GoldDividerOrnament />

                <div className="inline-flex flex-col items-center mb-8">
                  <div className="relative mb-4" style={{ padding: 12, border: '1px solid rgba(197,160,89,0.25)', background: 'rgba(253,250,244,0.8)' }}>
                    {/* Corner gold ornaments */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-l border-t" style={{ borderColor: 'rgba(197,160,89,0.5)' }} />
                    <div className="absolute top-2 right-2 w-4 h-4 border-r border-t" style={{ borderColor: 'rgba(197,160,89,0.5)' }} />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b" style={{ borderColor: 'rgba(197,160,89,0.5)' }} />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b" style={{ borderColor: 'rgba(197,160,89,0.5)' }} />
                    <QRCodeSVG
                      value={photoShareUrl}
                      size={120}
                      bgColor="transparent"
                      fgColor="rgba(26,20,12,0.85)"
                      level="M"
                    />
                  </div>
                  <p className="text-[9px] tracking-[0.28em] uppercase text-brown-muted/60 font-medium font-sans mb-5">Scan to upload</p>
                  <a
                    href={photoShareUrl}
                    className="inline-flex items-center gap-2.5 btn-gold"
                    style={{ textDecoration: 'none' }}
                  >
                    <Camera size={12} strokeWidth={1.5} />
                    Şəkilləri Paylaş
                  </a>
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
