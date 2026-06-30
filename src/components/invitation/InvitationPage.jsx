import { useState, useCallback, useRef, useEffect, lazy, Suspense } from 'react'
import { ArrowLeft, MapPin, Navigation, Download, ExternalLink, ChevronDown, Camera, Music } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { motion, AnimatePresence } from 'framer-motion'
import FloralBackground from './FloralBackground'
import CountdownTimer from './CountdownTimer'
import SeatingSearch from './SeatingSearch'
import MusicToggle from './MusicToggle'
import LanguageSwitcher from '../LanguageSwitcher'
import OpeningVideo from './OpeningVideo'
import RSVPSection from './RSVPSection'
import Guestbook from './Guestbook'
import EventTimeline from './EventTimeline'
/* three.js hero rings — lazy so the heavy 3D bundle loads only with the
   invitation hero, never on the landing/initial path. Visual enhancement;
   fades in when ready (fallback renders nothing, no layout shift). */
const DynamicHeroAnimation = lazy(() => import('./DynamicHeroAnimation'))
import ThreeDDressCode from './ThreeDDressCode'
import { DRESS_CODE_PALETTES, WHATSAPP_NUMBER, SOCIAL_LINKS } from '../../data/constants'
import { getPackageGates } from '../../data/packages'
import { buildWhatsAppUrl } from '../../utils/whatsappOrder'
import { isAudioUnlocked, unlockAudio } from '../../utils/audioUnlock'
import { submitDraft } from '../../utils/api'
import { trackEvent } from '../../utils/analytics'
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


function getEventAudioId(eventType) {
  const t = String(eventType ?? '').toLowerCase().trim()
  if (t === 'birthday' || t === 'ad_gunu' || t === 'corporate' || t === 'korporativ') {
    return 'WCce-3XMdJs' // Rauf — ad günü / korporativ
  }
  return '7maJOI3QMu0' // Orxan Qarabasma — toy / xına / default
}

export default function InvitationPage({ lang, setLang, weddingData, onBack, isDemoMode = false, initialGuestbook }) {
  const tr = t[lang]
  const [envelopeOpened,   setEnvelopeOpened]   = useState(false)
  const [showMusicPrompt, setShowMusicPrompt] = useState(false)
  const musicRef = useRef(null)
  const musicHintDismissedRef = useRef(false)

  /* Musiqi ipucu — qonaq ilk dəfə scroll edəndə 300ms sonra yumşaq itir
     (yalnız bir dəfə, demo + real). Musiqi toggle-ı qalır, yalnız ipucu gizlənir. */
  useEffect(() => {
    if (!envelopeOpened) return
    const onFirstScroll = () => {
      if (musicHintDismissedRef.current) return
      musicHintDismissedRef.current = true
      window.removeEventListener('scroll', onFirstScroll)
      setTimeout(() => setShowMusicPrompt(false), 300)
    }
    window.addEventListener('scroll', onFirstScroll, { passive: true, once: true })
    return () => window.removeEventListener('scroll', onFirstScroll)
  }, [envelopeOpened])

  /* Dəvətnamə açıldı — demo rejimi nəzərə alınmır (yalnız real qonaq baxışları) */
  useEffect(() => {
    if (!isDemoMode) trackEvent('invitation_opened', { lang, event_type: weddingData?.eventType })
  }, [])

  /* Foto-paylaşım səhifəsindən #gallery ilə qayıdan qonağı birbaşa
     qalereya bölməsinə aparır — zərf animasiyası bitənə qədər gözləyir */
  useEffect(() => {
    if (!envelopeOpened || window.location.hash !== '#gallery') return
    const timer = setTimeout(() => {
      const el = document.getElementById('gallery-section')
      if (el) {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 72, behavior: 'smooth' })
        history.replaceState(null, '', window.location.pathname + window.location.search)
      }
    }, 1100)
    return () => clearTimeout(timer)
  }, [envelopeOpened])

  // Capture the very first user gesture on this page — whether the user
  // arrived via the landing page or a direct invite link — and unlock audio.
  useEffect(() => {
    const unlock = () => {
      unlockAudio()
      document.removeEventListener('touchstart', unlock, { capture: true })
      document.removeEventListener('click',      unlock, { capture: true })
    }
    document.addEventListener('touchstart', unlock, { capture: true, passive: true })
    document.addEventListener('click',      unlock, { capture: true })
    return () => {
      document.removeEventListener('touchstart', unlock, { capture: true })
      document.removeEventListener('click',      unlock, { capture: true })
    }
  }, [])
  const audioVideoId = getEventAudioId(weddingData?.eventType)
  const palette = DRESS_CODE_PALETTES.find((p) => p.id === weddingData.dressCodePalette) || DRESS_CODE_PALETTES[0]

  const isCouple = ['toy', 'nishan'].includes(weddingData.eventType)
  const isCorp   = ['corporate', 'other'].includes(weddingData.eventType)

  /* ── slug helper (mirrors BuilderForm.toSlug) ── */
  function toSlug(str = '') {
    return str.toLowerCase()
      .replace(/ç/g,'c').replace(/ğ/g,'g').replace(/[ışı]/g,'i')
      .replace(/ö/g,'o').replace(/ş/g,'s').replace(/ü/g,'u')
      .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'davetname'
  }

  const eventLabels = {
    toy: tr.event_toy, nishan: tr.event_nishan,
    birthday: tr.event_birthday, corporate: tr.event_corporate,
    other: weddingData.eventName || tr.event_other,
  }

  const fabricColor = palette.colors[0] || '#C9A88A'

  const pageSlug = (window.location.pathname.match(/\/invite\/([^/?#]+)/) || [])[1] || ''

  /* Feature gating — həmişə weddingData.package-dən oxunur, rol/URL fərqi yoxdur */
  const activePkgId = isDemoMode ? 'PREMIUM' : (weddingData.package || 'SADE')
  const { allowRsvp: canShowRsvp, allowSeating: canShowSeating, allowGallery: canShowGallery } = getPackageGates(activePkgId)

  const effectiveSlug = pageSlug || (
    isCouple
      ? `${toSlug(weddingData.brideName || '')}-ve-${toSlug(weddingData.groomName || '')}`
      : isCorp
        ? toSlug(weddingData.eventName || 'tedbir')
        : toSlug(weddingData.brideName || 'davetname')
  )
  const photoShareUrl = `${window.location.origin}/invite/${effectiveSlug}/foto`

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
    a.download = `masa-karti-${effectiveSlug || 'digitoy'}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }, [weddingData, effectiveSlug, photoShareUrl, isCouple])

  /* ── WhatsApp sifariş — birbaşa link, draft arxa planda ── */
  const waOrderUrl = buildWhatsAppUrl(weddingData, lang, WHATSAPP_NUMBER, effectiveSlug, '')

  const handleWhatsAppOrder = useCallback(() => {
    const sid = localStorage.getItem('digitoy_session_id') || ''
    const pkg = weddingData.package || weddingData.selectedPackage || 'SADE'
    submitDraft(sid, weddingData, pkg).catch(() => {})
  }, [weddingData])

  return (
    <div className="relative min-h-screen bg-cream overflow-x-hidden">
      {/* Opening video — manages its own lifecycle, fades into invitation */}
      <OpeningVideo
        onComplete={() => {
          setEnvelopeOpened(true)
          setTimeout(() => {
            const unlocked = isAudioUnlocked()
            if (unlocked) {
              musicRef.current?.play()
            }
            setShowMusicPrompt(true)
            if (unlocked) {
              setTimeout(() => setShowMusicPrompt(false), 5500)
            }
          }, 1800)
        }}
        weddingData={weddingData}
        lang={lang}
      />

      {/* Music control — root level so position:fixed is viewport-relative, not transform-relative */}
      {envelopeOpened && (
        <MusicToggle ref={musicRef} lang={lang} videoId={audioVideoId} />
      )}

      {/* Music-start pill — appears after the envelope opens, invites the guest to start the soundtrack */}
      <AnimatePresence>
        {showMusicPrompt && (
          <motion.button
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => {
              musicRef.current?.play()
              setShowMusicPrompt(false)
            }}
            style={{
              position: 'fixed',
              bottom: 'max(96px, calc(env(safe-area-inset-bottom, 20px) + 76px))',
              right: '20px',
              zIndex: 54,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px 10px 14px',
              background: 'rgba(253,250,244,0.94)',
              border: '1px solid rgba(197,160,89,0.4)',
              borderRadius: '99px',
              boxShadow: '0 8px 28px rgba(26,20,12,0.12), 0 1px 3px rgba(26,20,12,0.06)',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
            }}
            aria-label="Musiqini başlat"
          >
            <span style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 26, height: 26, borderRadius: '50%',
              background: 'rgba(197,160,89,0.14)',
              flexShrink: 0,
            }}>
              <Music size={13} style={{ color: 'rgba(197,160,89,0.95)' }} strokeWidth={1.5} />
            </span>
            <span style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: 12,
              letterSpacing: '0.04em',
              color: 'rgba(60,45,30,0.82)',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}>
              Musiqini Başlat
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main invitation — fades in after video */}
      <AnimatePresence>
        {envelopeOpened && (
          <motion.div
            initial={{ opacity: 0, scale: 1.015, filter: 'blur(16px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <FloralBackground />

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

                <p className="font-serif italic text-[15px] sm:text-base text-brown-dark/90 mb-6 font-normal tracking-wide leading-relaxed max-w-xs mx-auto">
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
                    <Suspense fallback={null}>
                      <DynamicHeroAnimation eventType={weddingData.eventType || 'toy'} />
                    </Suspense>
                  </div>
                ) : (
                  <div className="mt-10 max-w-xs mx-auto">
                    <Suspense fallback={null}>
                      <DynamicHeroAnimation eventType={weddingData.eventType || 'toy'} />
                    </Suspense>
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
                    className="flex-1 flex items-center justify-center gap-2 btn-gold text-xs"
                  >
                    <MapPin size={13} strokeWidth={1.5} />
                    <span className="hidden sm:inline">Google Maps</span>
                    <span className="sm:hidden">Maps</span>
                  </a>
                  <a
                    href={weddingData.wazeUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 btn-outline-gold text-xs"
                  >
                    <Navigation size={13} strokeWidth={1.5} />
                    Waze
                  </a>
                  {weddingData.appleMapsUrl && (
                    <a
                      href={weddingData.appleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 btn-outline-gold text-xs"
                    >
                      <ExternalLink size={13} strokeWidth={1.5} />
                      Apple Maps
                    </a>
                  )}
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

                {/* Luxury dress code showcase — qeyd kartın daxilindədir */}
                <div className="mb-8">
                  <ThreeDDressCode
                    color={fabricColor}
                    palette={palette}
                    paletteId={weddingData.dressCodePalette}
                    lang={lang}
                    note={weddingData.dressCodeDescription || palette.description[lang]}
                  />
                </div>
              </SectionWrapper>
            </section>

            {/* ── SEATING — lüks axtarış UI ── */}
            {weddingData.seatingPlan && canShowSeating && (
              <SeatingSearch seatingPlan={weddingData.seatingPlan} lang={lang} />
            )}

            {/* ── GALLERY ── */}
            {canShowGallery && <section id="gallery-section" className="py-28 px-6 bg-cream">
              <SectionWrapper className="max-w-lg mx-auto text-center">
                <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-4 font-medium">{tr.f_gallery}</p>
                <h2 className="font-serif text-2xl text-ink font-light tracking-tight mb-5">{tr.inv_gallery}</h2>
                <GoldDividerOrnament />

                {/* Demo sample photos grid */}
                {weddingData.demoPhotos?.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3,1fr)',
                    gap: 6,
                    marginBottom: 28,
                    width: '100%',
                  }}>
                    {weddingData.demoPhotos.map((url, i) => (
                      <div key={i} style={{ aspectRatio: '3/2', overflow: 'hidden', background: '#f0e8d8' }}>
                        <img
                          src={url}
                          alt=""
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      </div>
                    ))}
                  </div>
                )}

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

                <p className="text-sm text-brown-muted leading-[1.9] max-w-xs mx-auto font-light tracking-wide">
                  {tr.inv_gallery_desc}
                </p>
              </SectionWrapper>
            </section>}

            {/* ── RSVP — yalnız VIP/PREMIUM paketlərdə ── */}
            {canShowRsvp && <RSVPSection lang={lang} weddingData={weddingData} />}

            {/* ── GUESTBOOK ── */}
            <Guestbook lang={lang} initialMessages={initialGuestbook} />

            {/* ── SİFARİŞ EKRANI — yalnız preview modunda görünür, demo-da gizli ── */}
            {!pageSlug && !isDemoMode && (
              <SectionWrapper>
                <section style={{
                  padding: '96px 24px',
                  background: 'linear-gradient(180deg, #F8F3E8 0%, #EDE3CC 100%)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Ambient glow */}
                  <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(197,160,89,0.12) 0%, transparent 70%)',
                  }} />

                  {/* Üst ornament */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                    background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.7) 30%, rgba(197,160,89,1) 50%, rgba(197,160,89,0.7) 70%, transparent)',
                  }} />

                  <div className="max-w-lg mx-auto relative">
                    {/* Künc ornamentləri */}
                    <div style={{ position: 'absolute', top: -32, left: 0, width: 24, height: 24, borderTop: '1px solid rgba(197,160,89,0.5)', borderLeft: '1px solid rgba(197,160,89,0.5)' }} />
                    <div style={{ position: 'absolute', top: -32, right: 0, width: 24, height: 24, borderTop: '1px solid rgba(197,160,89,0.5)', borderRight: '1px solid rgba(197,160,89,0.5)' }} />
                    <div style={{ position: 'absolute', bottom: -32, left: 0, width: 24, height: 24, borderBottom: '1px solid rgba(197,160,89,0.5)', borderLeft: '1px solid rgba(197,160,89,0.5)' }} />
                    <div style={{ position: 'absolute', bottom: -32, right: 0, width: 24, height: 24, borderBottom: '1px solid rgba(197,160,89,0.5)', borderRight: '1px solid rgba(197,160,89,0.5)' }} />

                    <p className="font-mono text-[9px] tracking-[0.42em] uppercase text-gold/85 font-semibold mb-5">
                      Digitoy.az · Premium
                    </p>

                    <div className="gold-divider mb-8 max-w-[60px] mx-auto" />

                    <h2 className="font-serif text-[36px] font-light text-espresso leading-[1.15] tracking-[-0.01em] mb-4">
                      Dəvətnaməniz Hazırdır!
                    </h2>

                    <p className="text-sm text-brown-dark/72 font-light leading-[1.75] tracking-[0.01em] mb-10">
                      Dizaynı tamamladınız. İndi tək bir toxunuşla dəvətnamənizi
                      <br />sifariş verib canlıya ala bilərsiniz.
                    </p>

                    {/* WhatsApp sifariş düyməsi */}
                    <a
                      href={waOrderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleWhatsAppOrder}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 12,
                        padding: '18px 44px',
                        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                        textDecoration: 'none', cursor: 'pointer',
                        fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase',
                        color: 'white', fontFamily: '"Inter",system-ui,sans-serif', fontWeight: 700,
                        boxShadow: '0 12px 48px rgba(37,211,102,0.38), 0 4px 16px rgba(0,0,0,0.12)',
                        marginBottom: 20,
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Dəvətnaməni Sifariş Ver
                    </a>

                    <p style={{
                      fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: 'rgba(140,123,107,0.45)', fontFamily: '"Inter",system-ui,sans-serif',
                    }}>
                      WhatsApp vasitəsilə birbaşa əlaqə
                    </p>

                    <div className="gold-divider mt-8 max-w-[60px] mx-auto" />
                  </div>

                  {/* Alt ornament */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
                    background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.5) 40%, rgba(197,160,89,0.7) 50%, rgba(197,160,89,0.5) 60%, transparent)',
                  }} />
                </section>
              </SectionWrapper>
            )}

            {/* ── DEMO CTA — yalnız demo modunda göstərilir ── */}
            {isDemoMode && (() => {
              const DEMO_CTA = {
                az: { badge: 'Öz dəvətnamənizi hazırlayın', title: 'Sizə xüsusi hazırlansın', desc: 'Bu nümunəni bəyəndinizsə, paketinizi seçib öz dəvətnamənizi dəqiqələr ərzində hazırlaya bilərsiniz.', btn: 'Paketlərə keç' },
                en: { badge: 'Create your invitation', title: 'Make it yours', desc: 'If you liked this example, choose your package and create your invitation in minutes.', btn: 'Choose Package' },
                ru: { badge: 'Создайте своё приглашение', title: 'Сделайте своё', desc: 'Если вам понравился этот пример, выберите пакет и создайте своё приглашение за несколько минут.', btn: 'Выбрать пакет' },
              }
              const dc = DEMO_CTA[lang] || DEMO_CTA.az
              return (
                <div style={{ padding: '56px 24px 72px', background: 'linear-gradient(170deg, #FDFBF7 0%, #F4F1EA 100%)', textAlign: 'center' }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: '#C5A059', fontFamily: 'Inter,system-ui,sans-serif', fontWeight: 500, marginBottom: 16 }}>
                    {dc.badge}
                  </p>
                  <p style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 'clamp(22px,5vw,30px)', fontWeight: 300, color: '#1A1A1A', marginBottom: 12, letterSpacing: '-0.02em' }}>
                    {dc.title}
                  </p>
                  <p style={{ fontSize: 14, color: '#8C7B6B', fontFamily: 'Inter,system-ui,sans-serif', fontWeight: 300, maxWidth: 380, margin: '0 auto 36px', lineHeight: 1.7 }}>
                    {dc.desc}
                  </p>
                  <motion.button
                    onClick={() => {
                      onBack?.()
                      setTimeout(() => {
                        const firstCard = document.getElementById('first-pricing-card')
                        const fallback  = document.getElementById('paketler')
                        const el = firstCard || fallback
                        if (!el) return
                        const yOffset = firstCard ? -240 : -120
                        const top = el.getBoundingClientRect().top + window.scrollY + yOffset
                        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
                      }, 500)
                    }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 10,
                      padding: '14px 44px',
                      background: 'linear-gradient(135deg, #C5A059 0%, #B8903A 100%)',
                      border: 'none', borderRadius: 999,
                      cursor: 'pointer',
                      fontFamily: 'Inter,system-ui,sans-serif',
                      fontSize: 11, letterSpacing: '0.22em',
                      textTransform: 'uppercase', fontWeight: 600,
                      color: '#fff', position: 'relative', overflow: 'hidden',
                      boxShadow: '0 8px 28px rgba(197,160,89,0.35)',
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.22) 50%,transparent 70%)', animation: 'shimmer-sweep 2.4s ease-in-out infinite', pointerEvents: 'none' }} />
                    <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                      {dc.btn}
                      <span style={{ fontSize: 14, letterSpacing: 0, fontWeight: 400 }}>→</span>
                    </span>
                  </motion.button>
                </div>
              )
            })()}

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

              {/* ── DigiToy referral ── */}
              <p className="text-white/30 text-[10px] tracking-[0.28em] uppercase font-light mb-5">
                {tr.footer_referral}
              </p>
              <div className="flex items-center justify-center gap-4">
                {/* Instagram */}
                <a href={SOCIAL_LINKS.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:border-gold/50 hover:bg-gold/10 hover:scale-105 transition-all duration-200">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(197,160,89,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="5"/>
                    <circle cx="17.5" cy="6.5" r="1.2" fill="rgba(197,160,89,0.85)" stroke="none"/>
                  </svg>
                </a>
                {/* TikTok */}
                <a href={SOCIAL_LINKS.tiktok} aria-label="TikTok" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:border-gold/50 hover:bg-gold/10 hover:scale-105 transition-all duration-200">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(197,160,89,0.85)">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                  </svg>
                </a>
                {/* WhatsApp */}
                <a href={SOCIAL_LINKS.whatsapp} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:border-gold/50 hover:bg-gold/10 hover:scale-105 transition-all duration-200">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.18-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.85 0-3.67-.5-5.25-1.44l-.38-.22-3.67.96.98-3.58-.25-.38A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2c2.67 0 5.18 1.04 7.07 2.93A9.94 9.94 0 0 1 22 12c0 5.52-4.48 10-10 10z" fill="rgba(197,160,89,0.85)"/>
                    <path d="M17.5 14.4c-.3-.15-1.75-.86-2.02-.96s-.47-.15-.67.15-.77.96-.94 1.16-.35.22-.64.07a8.08 8.08 0 0 1-2.38-1.47 8.93 8.93 0 0 1-1.64-2.05c-.17-.3 0-.46.13-.6l.44-.52c.14-.17.18-.3.27-.5s.05-.37-.02-.52-.67-1.6-.91-2.2c-.24-.57-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41s.25-1.29.17-1.41-.27-.2-.57-.35z" fill="rgba(197,160,89,0.85)"/>
                  </svg>
                </a>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
