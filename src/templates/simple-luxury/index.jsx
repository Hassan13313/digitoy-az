import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { ArrowLeft, MapPin, Navigation, ExternalLink, ChevronDown, Camera } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { motion, AnimatePresence } from 'framer-motion'
import FloralBackground from '../../components/invitation/FloralBackground'
import CountdownTimer from '../../components/invitation/CountdownTimer'
import SeatingSearch from '../../components/invitation/SeatingSearch'
import MusicToggle from '../../components/invitation/MusicToggle'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import OpeningVideo from '../../components/invitation/OpeningVideo'
import RSVPSection from '../../components/invitation/RSVPSection'
import Guestbook from '../../components/invitation/Guestbook'
import EventTimeline from '../../components/invitation/EventTimeline'
/* three.js hero rings — lazy so the heavy 3D bundle loads only with the
   invitation hero, never on the landing/initial path. Visual enhancement;
   fades in when ready (fallback renders nothing, no layout shift). */
const DynamicHeroAnimation = lazy(() => import('../../components/invitation/DynamicHeroAnimation'))
import DressCodeSection from '../_shared/DressCodeSection'
import { OrderCta, MusicStartBubble } from '../_shared/TemplateActions'
import { Reveal, Stagger, enterDirection } from '../_shared/motion'
import TemplateOutro from '../_shared/TemplateOutro'
import { getTemplateTheme } from '../templateConfig'
import { buildPresetMusic, PRESET_TRACKS, MUSIC_PLAY_MODES } from '../../data/music'
import { getPackageGates } from '../../data/packages'
import { unlockAudio } from '../../utils/audioUnlock'
import { trackEvent } from '../../utils/analytics'
import { useGallery } from '../../hooks/useGallery'
import { formatAzDate, formatTime24 } from '../../utils/dateFormat'
import t from '../../data/translations'

/* Ortaq komponentlər (sifariş CTA / musiqi bubble) theme token-ləri ilə işləyir */
const TH = getTemplateTheme('simple-luxury')

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


/* Musiqi seçilməyən (legacy) dəvətnamələr üçün standart lokal preset melodiya.
   YouTube YOXDUR — həmişə lokal /music/*.mp3 çalınır. */
const DEFAULT_INV_MUSIC = buildPresetMusic(PRESET_TRACKS[0], { playMode: MUSIC_PLAY_MODES.AUTO })

/* ─────────────────────────────────────────────────────────────────────────────
   SIMPLE LUXURY — Digitoy-un KÖHNƏ standart (default) dəvətnaməsi.

   ⚠ Bu, indiyə qədər canlı sistemdə işləyən dizayndır. Əvvəllər səhvən
   "royal-gold" adlandırılmışdı; Royal Gold ayrıca premium şablondur
   (bax: templates/royal-gold/). Bu fayl bütün MÖVCUD müştərilərin
   dəvətnaməsidir — markup dəyişdirilməməlidir.

   Şablon müqaviləsi (bütün şablonlar bu propsları qəbul edir):
     { lang, setLang, weddingData, onBack, isDemoMode, initialGuestbook }
   ───────────────────────────────────────────────────────────────────────── */
export default function SimpleLuxuryTemplate({ lang, setLang, weddingData, onBack, isDemoMode = false, initialGuestbook }) {
  const tr = t[lang]
  const [envelopeOpened,   setEnvelopeOpened]   = useState(false)
  const [showMusicPrompt, setShowMusicPrompt] = useState(false)
  const musicRef = useRef(null)

  /* ⚠ Bubble scroll ilə GİZLƏNMİR — 9 şablonun hamısında eyni qayda:
     yalnız qonaq ona toxunanda yoxa çıxır. */

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
  /* Phase 25.3 — istifadəçinin seçdiyi musiqi (preset/mp3). Yoxdursa standart
     lokal preset melodiya (YouTube YOXDUR) + mövcud autoplay cəhdi. */
  const invMusic  = weddingData?.music || DEFAULT_INV_MUSIC

  const isCouple = ['toy', 'nishan'].includes(weddingData.eventType)
  const isCorp   = ['corporate', 'other'].includes(weddingData.eventType)

  const eventLabels = {
    toy: tr.event_toy, nishan: tr.event_nishan,
    birthday: tr.event_birthday, corporate: tr.event_corporate,
    other: weddingData.eventName || tr.event_other,
  }

  /* Qalereya/QR məntiqi — hooks/useGallery.js.
     `downloadTableCard` Phase 27-də bütün şablonlardan çıxarıldı; hook-da
     qalır, çünki admin paneli masa kartını oradan yaradır. */
  const { pageSlug, effectiveSlug, photoShareUrl } = useGallery({ weddingData, isCouple, isCorp })

  /* Feature gating — həmişə weddingData.package-dən oxunur, rol/URL fərqi yoxdur */
  const activePkgId = isDemoMode ? 'PREMIUM' : (weddingData.package || 'SADE')
  const { allowRsvp: canShowRsvp, allowSeating: canShowSeating, allowGallery: canShowGallery } = getPackageGates(activePkgId)

  /* ⚠ Phase 27: sifariş CTA-sı `_shared/TemplateActions.jsx`-ə köçdü —
     9 şablonun hamısında eyni mətn və eyni davranış (WhatsApp + draft). */

  return (
    <div
      className="relative min-h-screen bg-cream overflow-x-hidden"
      data-tpl="simple-luxury"
      data-enter={enterDirection('simple-luxury')}
      /* Basma/hover işığı — qızıl aksent (bax index.css › [data-press]) */
      style={{ '--tpl-glow': 'rgba(197,160,89,0.34)' }}
    >
      {/* Opening video — manages its own lifecycle, fades into invitation */}
      <OpeningVideo
        onComplete={() => {
          setEnvelopeOpened(true)
          /* Musiqi dəvətnamə açılan kimi başlayır.
             ⚠ Video ÖZÜ bitəndə ortada istifadəçi jesti olmur → brauzer
             bloklaya bilər; o halda `useMusicPlayer` qonağın növbəti
             toxunuşunda təkrar cəhd edir, bubble isə açıq qalır.
             "Keç" düyməsi ilə keçiləndə bu çağırış birbaşa klik hadisəsinin
             içindədir və dərhal işləyir. */
          musicRef.current?.play()
          setTimeout(() => setShowMusicPrompt(true), 1800)
        }}
        weddingData={weddingData}
        lang={lang}
      />

      {/* Music control — root level so position:fixed is viewport-relative, not transform-relative */}
      <MusicToggle ref={musicRef} lang={lang} music={invMusic} visible={envelopeOpened} />

      {/* Musiqini başlat bubble — Phase 27: 9 şablonun ortaq komponenti */}
      {/* YALNIZ start helper — MusicToggle.play() artıq çalırsa təsirsizdir */}
      <MusicStartBubble
        theme={TH} lang={lang} visible={showMusicPrompt}
        onStart={() => { musicRef.current?.play(); setShowMusicPrompt(false) }}
      />

      {/* Ambient premium background — Phase 25.4. Kept OUTSIDE the animated
          content wrapper below: a transform/filter ancestor would turn its
          position:fixed layers into page-relative ones, so it lives here where
          the outer container has no transform, keeping the glow/dust/sweep
          truly viewport-fixed as the guest scrolls. */}
      {envelopeOpened && <FloralBackground />}

      {/* Main invitation — the card settles into place: a soft scale-up from
          0.96, gentle blur clearing, over ~0.7s (Phase 25.4 envelope transition). */}
      <AnimatePresence>
        {envelopeOpened && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >

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
                  <span className="text-brown-dark/80 font-light">.az</span>
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
                      <span className="block text-5xl sm:text-6xl md:text-7xl text-ink font-light tracking-tight">{weddingData.groomName}</span>
                      <span className="block text-3xl sm:text-4xl text-gold font-light italic my-3">{tr.inv_and}</span>
                      <span className="block text-5xl sm:text-6xl md:text-7xl text-ink font-light tracking-tight">{weddingData.brideName}</span>
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
              <Reveal className="max-w-lg mx-auto text-center">
                <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-4 font-medium">LOCATION</p>
                <h2 className="font-serif text-2xl text-ink font-light tracking-tight mb-4">{tr.inv_location}</h2>
                <p className="text-brown-muted text-sm font-light tracking-wide leading-relaxed mb-10">{weddingData.venueName}</p>
                <GoldDividerOrnament />
                <Stagger base={110} className="flex gap-3 mt-4">
                  <a
                    data-press
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
                    data-press
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
                      data-press
                      href={weddingData.appleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 btn-outline-gold text-xs"
                    >
                      <ExternalLink size={13} strokeWidth={1.5} />
                      Apple Maps
                    </a>
                  )}
                </Stagger>
              </Reveal>
            </section>

            {/* ── EVENT TIMELINE (Program) ── */}
            <EventTimeline lang={lang} eventType={weddingData.eventType} programSteps={weddingData.programSteps} />

            {/* ── DRESS CODE ── */}
            <section className="py-28 px-6 bg-beige">
              <Reveal className="max-w-lg mx-auto text-center">
                <p className="text-[10px] tracking-[0.32em] uppercase text-gold mb-4 font-medium">Style</p>
                <h2 className="font-serif text-2xl text-ink font-light tracking-tight mb-10">{tr.inv_dresscode}</h2>

                {/* 9 şablonun ORTAQ geyim tərzi bölməsi — layihədə yeganə
                    dress code görünüşü (Claude Design siluetləri). */}
                <div className="mb-8">
                  <DressCodeSection
                    theme={TH}
                    paletteId={weddingData.dressCodePalette}
                    note={weddingData.dressCodeDescription}
                    lang={lang}
                    serif={TH.fonts?.heading}
                    align="center"
                  />
                </div>
              </Reveal>
            </section>

            {/* ── SEATING — lüks axtarış UI ── */}
            {weddingData.seatingPlan && canShowSeating && (
              <SeatingSearch seatingPlan={weddingData.seatingPlan} lang={lang} />
            )}

            {/* ── GALLERY ── */}
            {canShowGallery && <section id="gallery-section" className="py-28 px-6 bg-cream">
              <Reveal className="max-w-lg mx-auto text-center">
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
                  <p className="text-[9px] tracking-[0.28em] uppercase text-brown-muted/60 font-medium font-sans mb-5">{tr.inv_scan_upload}</p>
                  <a
                    data-press
                    href={photoShareUrl}
                    className="inline-flex items-center gap-2.5 btn-gold"
                    style={{ textDecoration: 'none' }}
                  >
                    <Camera size={12} strokeWidth={1.5} />
                    {tr.inv_gallery_btn}
                  </a>
                </div>

                <p className="text-sm text-brown-muted leading-[1.9] max-w-xs mx-auto font-light tracking-wide">
                  {tr.inv_gallery_desc}
                </p>
              </Reveal>
            </section>}

            {/* ── RSVP — yalnız VIP/PREMIUM paketlərdə ── */}
            {canShowRsvp && <RSVPSection lang={lang} weddingData={weddingData} />}

            {/* ── GUESTBOOK ── */}
            <Guestbook lang={lang} initialMessages={initialGuestbook} />

            {/* ── SİFARİŞ CTA — Phase 27: 9 şablonun ortaq komponenti.
                Görünmə şərti (!pageSlug && !isDemoMode) komponentin içindədir. ── */}
            <OrderCta
              theme={TH} weddingData={weddingData} lang={lang}
              pageSlug={pageSlug} isDemoMode={isDemoMode}
              effectiveSlug={effectiveSlug} serif={TH.fonts?.heading}
            />


            {/* ── SON HİSSƏ: demo CTA + footer (9 şablonun ortağı) ──
                Struktur əvvəl burada idi; Phase 27.4-də `_shared/TemplateOutro`
                komponentinə çıxarıldı ki, hər 9 şablonda eyni işləsin. */}
            <TemplateOutro
              theme={TH} weddingData={weddingData} lang={lang}
              isDemoMode={isDemoMode} isCouple={isCouple} isCorp={isCorp}
              eventLabel={eventLabels[weddingData.eventType]} serif={TH.fonts?.heading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
