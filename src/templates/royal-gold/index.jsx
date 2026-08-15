import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapMosaic, { MapRings } from '../_shared/MapMosaic'
import { parseLatLon } from '../_shared/geo'
import { OrderCta, MusicStartBubble } from '../_shared/TemplateActions'
import TemplateOutro from '../_shared/TemplateOutro'
import { getTemplateTheme } from '../templateConfig'
import { buildPresetMusic, PRESET_TRACKS, MUSIC_PLAY_MODES } from '../../data/music'
import { getPackageGates } from '../../data/packages'
import { formatAzDate, formatFullDateByLang, formatTime24 } from '../../utils/dateFormat'
import { unlockAudio } from '../../utils/audioUnlock'
import { trackEvent } from '../../utils/analytics'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useCountdown } from '../../hooks/useCountdown'
import { useTimeline } from '../../hooks/useTimeline'
import { useSeating } from '../../hooks/useSeating'
import { useRsvp } from '../../hooks/useRsvp'
import { useGuestbook } from '../../hooks/useGuestbook'
import { useGallery } from '../../hooks/useGallery'
import { useMusicPlayer } from '../../hooks/useMusicPlayer'
import t from '../../data/translations'

/* ─────────────────────────────────────────────────────────────────────────────
   ROYAL GOLD LUXURY — Claude Design "Digitoy Templates.dc.html" · t1

   Design story: klassik Bakı toyunun rəqəmsal versiyası. Qonağı əvvəlcə
   möhürlənmiş zərf qarşılayır — dəvətnamə "açılır", göstərilmir.
   Palitra: tünd fon (#0B0906) üzərində qızıl (#C5A059) / şampan (#E8D5A3).
   Tipoqrafika: Cormorant Garamond 300 + DM Sans.

   ⚠ Bu, Digitoy-un KÖHNƏ default dəvətnaməsi DEYİL — o, `simple-luxury`
   şablonudur. Royal Gold ayrıca premium dizayndır.

   ⚠ Bu fayl YALNIZ UI qatıdır — bütün biznes məntiqi hook-lardadır.
   Bölmə sırası design faylındakı "Struktur" leqendası ilə eynidir (13 bölmə).
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('royal-gold')
const DEFAULT_MUSIC = buildPresetMusic(PRESET_TRACKS[0], { playMode: MUSIC_PLAY_MODES.AUTO })

const serif = TH.fonts.heading
const sans  = TH.fonts.body

/* Şablona məxsus keyframe-lər — qlobal CSS-ə toxunmur, prefiks `rg-` */
const KEYFRAMES = `
@keyframes rg-seal   { 0%,100% { transform: translate(-50%,-50%) scale(1) } 50% { transform: translate(-50%,-50%) scale(1.06) } }
@keyframes rg-eq     { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
@keyframes rg-hint   { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes rg-drift  { from { transform: translate3d(0,0,0) } to { transform: translate3d(24px,-30px,0) } }
@keyframes rg-halo   { 0% { box-shadow: 0 0 0 6px ${TH.primary}24, 0 0 0 14px ${TH.primary}12 } 100% { box-shadow: 0 0 0 14px ${TH.primary}00, 0 0 0 26px ${TH.primary}00 } }
@keyframes rg-sweep  { 0% { background-position: 0% 50% } 100% { background-position: 200% 50% } }
@media (prefers-reduced-motion: reduce) {
  [data-rg] *, [data-rg] { animation: none !important; transition: none !important; }
}
`

/* ── Ambient: 3 çox yavaş qızıl işıq ləkəsi, opacity ≤ .07 (design spec) ── */
function GoldLights() {
  const spots = [
    { w: 320, top: '12%',  left: '-14%', dur: 18, delay: 0 },
    { w: 260, top: '46%',  right: '-12%', dur: 22, delay: 3 },
    { w: 300, bottom: '8%', left: '18%', dur: 26, delay: 6 },
  ]
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {spots.map((s, i) => (
        <span
          key={i}
          style={{
            position: 'absolute', width: s.w, height: s.w, borderRadius: '50%',
            top: s.top, left: s.left, right: s.right, bottom: s.bottom,
            background: `radial-gradient(circle, ${TH.primary}, transparent 68%)`,
            opacity: 0.07, filter: 'blur(30px)',
            animation: `rg-drift ${s.dur}s ease-in-out ${s.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  )
}

/* ── Scroll reveal: y:24px + blur 4px (design animation system) ── */
function Reveal({ children, style, delay = 0 }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div
      ref={ref}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        filter: visible ? 'blur(0px)' : 'blur(4px)',
        transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .7s cubic-bezier(.22,1,.36,1) ${delay}ms, filter .7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/* Mərkəzləşdirilmiş bölmə başlığı */
function SectionHead({ kicker, title, sub }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 20 }}>
      <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: TH.primary }}>
        {kicker}
      </div>
      <div style={{
        fontFamily: serif, fontWeight: 300, fontSize: 'clamp(22px,6vw,26px)',
        color: TH.accent, marginTop: 6, lineHeight: 1.25,
      }}>
        {title}
      </div>
      {sub && <div style={{ fontSize: 11, color: TH.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

/* Qızıl ornament sətri — romb + solub gedən xətlər */
function GoldOrnament() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '22px 0' }}>
      <span style={{ width: 52, height: 1, background: `linear-gradient(90deg, transparent, ${TH.primary}73)` }} />
      <span style={{ width: 4, height: 4, background: `${TH.primary}99`, transform: 'rotate(45deg)' }} />
      <span style={{ width: 6, height: 6, border: `1px solid ${TH.primary}80`, transform: 'rotate(45deg)' }} />
      <span style={{ width: 4, height: 4, background: `${TH.primary}99`, transform: 'rotate(45deg)' }} />
      <span style={{ width: 52, height: 1, background: `linear-gradient(270deg, transparent, ${TH.primary}73)` }} />
    </div>
  )
}

const btn = (filled) => ({
  flex: 1, textAlign: 'center', padding: '12px 6px',
  fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase',
  fontFamily: sans, cursor: 'pointer', textDecoration: 'none', display: 'block',
  background: filled ? TH.primary : 'transparent',
  color: filled ? '#1A1408' : TH.accent,
  border: filled ? '1px solid transparent' : `1px solid ${TH.primary}4D`,
})

const sectionBorder = { borderBottom: `1px solid ${TH.primary}1A` }

/* ═══════════════════════════════════════════════════════════════════════════
   01 — ZƏRF AÇILIŞI: möhürlənmiş zərf, flap rotateX(-165°), 1.4 s (design)
   ═══════════════════════════════════════════════════════════════════════════ */
function SealedEnvelope({ weddingData, isCouple, isCorp, eventLabel, onOpen }) {
  const [opening, setOpening] = useState(false)
  const [gone, setGone] = useState(false)

  const names = isCouple
    ? `${weddingData.groomName || ''} & ${weddingData.brideName || ''}`
    : (weddingData.eventName || weddingData.brideName || '')

  const monogram = isCouple
    ? `${(weddingData.groomName || '?')[0]}&${(weddingData.brideName || '?')[0]}`.toUpperCase()
    : ((weddingData.eventName || weddingData.brideName || '·')[0] || '·').toUpperCase()

  const start = () => {
    if (opening) return
    unlockAudio()
    setOpening(true)
    setTimeout(() => { setGone(true); onOpen() }, 1400)
  }

  if (gone) return null

  return (
    <div
      onClick={start}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') start() }}
      aria-label="Möhürü aç"
      style={{
        position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden',
        background: `radial-gradient(120% 80% at 50% 30%, #1C1509, ${TH.background} 72%)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: sans, padding: '0 24px',
      }}
    >
      {/* İki qatlı künc çərçivəsi */}
      <span style={{ position: 'absolute', inset: 18, border: `1px solid ${TH.primary}29`, pointerEvents: 'none' }} />
      <span style={{ position: 'absolute', inset: 24, border: `1px solid ${TH.primary}14`, pointerEvents: 'none' }} />

      <motion.div
        animate={opening ? { opacity: 0, y: 26 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: opening ? 0.45 : 0, ease: 'easeInOut' }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
      >
        <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: TH.muted, marginBottom: 26 }}>
          {eventLabel}
        </div>

        {/* Zərf + möhür */}
        <div style={{ position: 'relative', width: 220, height: 150, maxWidth: '72vw' }}>
          <span style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(150deg,#241D11,#15100A)',
            border: `1px solid ${TH.primary}4D`,
          }} />
          {/* Üst qapaq — toxunuşda 3D açılır */}
          <motion.span
            animate={opening ? { rotateX: -165 } : { rotateX: 0 }}
            transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 82,
              clipPath: 'polygon(0 0,100% 0,50% 100%)',
              background: 'linear-gradient(160deg,#2C2415,#1B1610)',
              borderBottom: `1px solid ${TH.primary}33`,
              transformOrigin: 'top center', transformStyle: 'preserve-3d', backfaceVisibility: 'hidden',
            }}
          />
          {/* Mum möhür */}
          <motion.span
            animate={opening ? { opacity: 0, scale: 0.7 } : {}}
            transition={{ duration: 0.35 }}
            style={{
              position: 'absolute', top: '32%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 44, height: 44, borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%,#D9B36C,#8A6A2E)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: serif, fontSize: 15, color: '#2A1F0C',
              boxShadow: '0 6px 18px rgba(0,0,0,.55)',
              animation: opening ? 'none' : 'rg-seal 3.4s ease-in-out infinite',
              zIndex: 2,
            }}
          >
            {monogram}
          </motion.span>
        </div>

        <div style={{ fontFamily: serif, fontWeight: 300, fontSize: 'clamp(24px,7vw,30px)', color: TH.accent, marginTop: 34 }}>
          {names}
        </div>
        <span style={{ width: 28, height: 1, background: TH.primary, margin: '12px 0' }} />
        <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: TH.muted }}>
          {formatFullDateByLang(weddingData.date, 'az')}
          {weddingData.venueName ? ` · ${String(weddingData.venueName).split(',').pop().trim()}` : ''}
        </div>

        <div style={{
          marginTop: 40, display: 'inline-flex', alignItems: 'center', gap: 10,
          border: `1px solid ${TH.primary}73`, borderRadius: 100, padding: '13px 24px',
          fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase',
          color: TH.accent, background: `${TH.primary}14`,
        }}>
          {isCorp ? 'Dəvətnaməni aç' : 'Möhürü aç'}<span>→</span>
        </div>
      </motion.div>

      <div style={{
        position: 'absolute', bottom: 34, left: 0, right: 0, textAlign: 'center',
        fontSize: 10, letterSpacing: '.14em', color: `${TH.muted}B3`,
        animation: 'rg-hint 2.6s ease-in-out infinite',
      }}>
        toxunun
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   03 — MUSİQİ: hero-nun sağ küncündə qızıl ekvalayzer dairəsi
   ═══════════════════════════════════════════════════════════════════════════ */
function GoldMusic({ lang, music, playerRef }) {
  const { audioProps, playing, play, pause, toggle, hasMusic } = useMusicPlayer({ lang, music })
  const [prompt, setPrompt] = useState(false)

  useEffect(() => {
    if (playerRef) playerRef.current = { play, pause }
  })

  /* ⚠ Phase 27: autoplay YOXDUR — zərf açılandan 900ms sonra yalnız
     "Musiqini Başlat" bubble-ı çıxır, səs qonağın toxunuşu ilə başlayır. */
  useEffect(() => {
    if (!hasMusic) return
    const id = setTimeout(() => setPrompt(true), 900)
    return () => clearTimeout(id)
  }, [hasMusic])

  if (!hasMusic) return null

  return (
    <>
      <audio {...audioProps} />
      {/* YALNIZ start helper — musiqi çalırsa klik heç nə etmir */}
      <MusicStartBubble
        theme={TH} lang={lang} visible={prompt} playing={playing}
        onStart={() => { if (!playing) play(); setPrompt(false) }}
      />
      <button
        onClick={toggle}
        aria-label={playing ? 'Musiqini dayandır' : 'Musiqini başlat'}
        style={{
          position: 'fixed',
          bottom: 'max(20px, env(safe-area-inset-bottom, 20px))',
          right: 20, zIndex: 55,
          width: 46, height: 46, borderRadius: '50%',
          border: `1px solid ${TH.primary}59`, background: `${TH.primary}1A`,
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
          cursor: 'pointer',
        }}
      >
        {[0, 0.18, 0.36].map((d) => (
          <span key={d} style={{
            width: 2, height: 12, background: playing ? TH.primary : `${TH.muted}99`,
            transformOrigin: 'bottom', display: 'block',
            animation: playing ? `rg-eq 1s ease-in-out ${d}s infinite` : 'none',
            transform: playing ? undefined : 'scaleY(.45)',
          }} />
        ))}
      </button>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function RoyalGoldTemplate({
  lang, setLang, weddingData, onBack, isDemoMode = false, initialGuestbook,
}) {
  const tr = t[lang] || t.az
  const [opened, setOpened] = useState(false)
  const musicRef = useRef(null)

  const isCouple = ['toy', 'nishan'].includes(weddingData.eventType)
  /* Location: koordinat varsa real xəritə, yoxsa köhnə abstrakt kart */
  const hasCoords = !!parseLatLon(weddingData)
  const isCorp   = ['corporate', 'other'].includes(weddingData.eventType)

  const eventLabels = {
    toy: tr.event_toy, nishan: tr.event_nishan,
    birthday: tr.event_birthday, corporate: tr.event_corporate,
    other: weddingData.eventName || tr.event_other,
  }
  const eventLabel = eventLabels[weddingData.eventType] || tr.event_toy

  const invMusic  = weddingData?.music || DEFAULT_MUSIC

  const activePkgId = isDemoMode ? 'PREMIUM' : (weddingData.package || 'SADE')
  const { allowRsvp: canShowRsvp, allowSeating: canShowSeating, allowGallery: canShowGallery } = getPackageGates(activePkgId)

  /* ── Hook-lar: bütün biznes məntiqi ── */
  const cd       = useCountdown({ date: weddingData.date, time: weddingData.time, lang, eventType: weddingData.eventType, eventName: weddingData.eventName })
  const timeline = useTimeline({ lang, eventType: weddingData.eventType, programSteps: weddingData.programSteps })
  const { inputRef: seatInputRef, ...seating } = useSeating({ seatingPlan: weddingData.seatingPlan, lang })
  const { inputRef: rsvpInputRef, ...rsvp }    = useRsvp({ lang, weddingData })
  const gbook    = useGuestbook({ lang, initialMessages: initialGuestbook })
  const gallery  = useGallery({ weddingData, isCouple, isCorp })

  useEffect(() => {
    if (!isDemoMode) trackEvent('invitation_opened', { lang, event_type: weddingData?.eventType })
  }, [])

  const { formattedDate, dayName } = formatAzDate(weddingData.date, lang)

  return (
    <div data-rg style={{ background: TH.background, minHeight: '100vh', fontFamily: sans, color: TH.text, overflowX: 'hidden', position: 'relative' }}>
      <style>{KEYFRAMES}</style>

      {/* 01 — ZƏRF AÇILIŞI */}
      {!opened && (
        <SealedEnvelope
          weddingData={weddingData}
          isCouple={isCouple}
          isCorp={isCorp}
          eventLabel={eventLabel}
          onOpen={() => setOpened(true)}
        />
      )}

      {opened && <GoldLights />}
      {/* 03 — MUSİQİ TOGGLE */}
      {opened && <GoldMusic lang={lang} music={invMusic} playerRef={musicRef} />}

      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            {/* 02 — STICKY HEADER */}
            <header style={{
              position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(11,9,6,0.88)', backdropFilter: 'blur(10px)',
              borderBottom: `1px solid ${TH.primary}29`,
            }}>
              <button
                onClick={onBack}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
                  fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: TH.muted,
                  cursor: 'pointer', fontFamily: sans, minHeight: 44, padding: '0 8px 0 0',
                }}
              >
                <span>←</span>{tr.btn_back}
              </button>
              <div style={{ fontFamily: serif, fontSize: 14, letterSpacing: '.06em' }}>
                <span style={{ color: TH.primary }}>Digitoy</span>
                <span style={{ color: `${TH.muted}73` }}>.az</span>
              </div>
              <LanguageSwitcher lang={lang} setLang={setLang} />
            </header>

            {/* 04 — HERO */}
            <section style={{
              position: 'relative', padding: '56px 26px 48px', textAlign: 'center',
              background: `radial-gradient(110% 70% at 50% 8%, #1A1409, ${TH.background} 70%)`,
              ...sectionBorder,
            }}>
              <span style={{ position: 'absolute', top: 14, left: 18, width: 34, height: 34, borderTop: `1px solid ${TH.primary}66`, borderLeft: `1px solid ${TH.primary}66` }} />
              <span style={{ position: 'absolute', top: 14, right: 18, width: 34, height: 34, borderTop: `1px solid ${TH.primary}66`, borderRight: `1px solid ${TH.primary}66` }} />

              <div style={{ maxWidth: 560, margin: '0 auto' }}>
                <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: TH.primary, marginBottom: 14 }}>
                  {eventLabel}
                </div>
                <div style={{ fontFamily: serif, fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: TH.muted }}>
                  {tr.inv_join}
                </div>

                {/* Adlar — 6 s-lik qızıl sweep (design reveal) */}
                <h1 style={{
                  fontFamily: serif, fontWeight: 300, fontSize: 'clamp(38px,13vw,52px)',
                  lineHeight: 1.06, margin: '20px 0 6px',
                  background: `linear-gradient(100deg, ${TH.accent}, #FFFFFF 45%, ${TH.accent} 70%, ${TH.primary})`,
                  backgroundSize: '220%', WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent', color: TH.accent,
                  animation: 'rg-sweep 6s ease-in-out 1',
                }}>
                  {isCouple ? (
                    <>
                      {weddingData.groomName}
                      <span style={{ display: 'block', fontStyle: 'italic', fontSize: '.5em', color: TH.primary, WebkitTextFillColor: TH.primary, margin: '2px 0' }}>&</span>
                      {weddingData.brideName}
                    </>
                  ) : (weddingData.eventName || weddingData.brideName)}
                </h1>

                {isCorp && weddingData.organizer?.trim() && (
                  <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: `${TH.primary}B3`, marginTop: 10 }}>
                    {tr.organizer_display}: {weddingData.organizer}
                  </div>
                )}

                <GoldOrnament />

                <div style={{ fontSize: 13, color: '#B9A88F', letterSpacing: '.06em' }}>{formattedDate}</div>
                {dayName && (
                  <div style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: `${TH.primary}B3`, marginTop: 5 }}>{dayName}</div>
                )}
                {weddingData.time && (
                  <div style={{ fontSize: 13, color: '#B9A88F', marginTop: 5 }}>{formatTime24(weddingData.time)}</div>
                )}
                {weddingData.venueName && (
                  <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: `${TH.primary}B3`, marginTop: 18 }}>
                    {weddingData.venueName}
                  </div>
                )}

                <div style={{
                  margin: '34px auto 0', width: 44, height: 44, border: `1px solid ${TH.primary}40`,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, color: `${TH.primary}99`, animation: 'rg-hint 2.8s ease-in-out infinite',
                }}>⌄</div>
              </div>
            </section>

            {/* 05 — COUNTDOWN */}
            <section style={{ padding: '34px 26px', ...sectionBorder }}>
              <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                <SectionHead kicker="Countdown" title={cd.title} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                  {[
                    { v: cd.days, l: cd.labels.days },
                    { v: cd.hours, l: cd.labels.hours },
                    { v: cd.minutes, l: cd.labels.minutes },
                    { v: cd.seconds, l: cd.labels.seconds },
                  ].map(({ v, l }) => (
                    <div key={l} style={{
                      background: `${TH.primary}0D`, border: `1px solid ${TH.primary}24`,
                      padding: '12px 4px', textAlign: 'center',
                    }}>
                      <div style={{ fontFamily: serif, fontSize: 'clamp(22px,6vw,26px)', color: TH.accent, fontVariantNumeric: 'tabular-nums' }}>
                        {String(v).padStart(2, '0')}
                      </div>
                      <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: TH.muted, marginTop: 2 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* 06 — LOCATION */}
            <section style={{ padding: '34px 26px', ...sectionBorder }}>
              <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                <SectionHead kicker="LOCATION" title={tr.inv_location} />
                {/* Hibrid xəritə — koordinat varsa OSM tile mozaikası,
                    yoxdursa köhnə abstrakt şəbəkə (heç vaxt boş blok olmur). */}
                <div style={{
                  background: 'radial-gradient(120% 120% at 50% 50%,#241C10,#120D07)',
                  border: `1px solid ${TH.primary}38`, position: 'relative', overflow: 'hidden',
                }}>
                  <MapMosaic
                    weddingData={weddingData}
                    theme={TH}
                    map={{ opacity: 0.55, filter: 'grayscale(1) brightness(.42) contrast(1.15)', tintOpacity: 0.4 }}
                    frame={<MapRings accent={TH.primary} />}
                  />
                  {!hasCoords && (
                    <div style={{
                      height: 'clamp(148px, 42vw, 168px)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', position: 'relative', overflow: 'hidden',
                    }}>
                      <span style={{
                        position: 'absolute', inset: 0, opacity: .2,
                        backgroundImage: `linear-gradient(${TH.primary}59 1px, transparent 1px), linear-gradient(90deg, ${TH.primary}59 1px, transparent 1px)`,
                        backgroundSize: '26px 26px',
                      }} />
                      <MapRings accent={TH.primary} />
                      <span style={{
                        width: 12, height: 12, borderRadius: '50%', background: TH.primary,
                        animation: 'rg-halo 4s ease-out infinite',
                      }} />
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: TH.text }}>
                  {weddingData.venueName}
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
                  <a href={weddingData.googleMapsUrl || '#'} target="_blank" rel="noopener noreferrer" style={btn(true)}>Maps</a>
                  <a href={weddingData.wazeUrl || '#'} target="_blank" rel="noopener noreferrer" style={btn(false)}>Waze</a>
                  {weddingData.appleMapsUrl && (
                    <a href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Apple</a>
                  )}
                </div>
              </Reveal>
            </section>

            {/* 07 — PROQRAM */}
            <section style={{ padding: '34px 26px', ...sectionBorder }}>
              <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                <SectionHead kicker="Schedule" title={timeline.sectionLabel} />
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <span style={{
                    position: 'absolute', left: 63, top: 14, bottom: 14, width: 1,
                    background: `linear-gradient(180deg, transparent, ${TH.primary}59, transparent)`,
                  }} />
                  {timeline.events.map((ev, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <span style={{ width: 46, flex: '0 0 auto', textAlign: 'right', fontSize: 10, letterSpacing: '.12em', color: TH.muted, paddingTop: 9 }}>
                        {ev.time}
                      </span>
                      <span style={{
                        width: 34, height: 34, flex: '0 0 auto', border: `1px solid ${TH.primary}4D`,
                        borderRadius: 8, background: TH.background,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                      }}>{ev.icon}</span>
                      <span style={{ paddingTop: 7, fontFamily: serif, fontSize: 17, color: TH.text }}>{ev.label}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* 08 — DRESS CODE (ikon əsaslı premium kart, theme-aware) */}
            <section style={{ padding: '34px 26px', ...sectionBorder }}>
              <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                <SectionHead kicker="STYLE" title={tr.inv_dresscode} />
                <DressCodeSection
                  theme={TH}
                  paletteId={weddingData.dressCodePalette}
                  note={weddingData.dressCodeDescription}
                  lang={lang}
                  serif={serif}
                  align="center"
                  onDark
                />
              </Reveal>
            </section>

            {/* 09 — OTURMA PLANI */}
            {canShowSeating && !seating.isEmpty && (
              <section style={{ padding: '34px 26px', ...sectionBorder }}>
                <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                  <SectionHead kicker="SEATING" title={seating.labels.title} sub={seating.labels.sub} />

                  {/* ⚠ Təkliflər siyahısı normal document flow-dadır — overlap olmur */}
                  <div>
                    <input
                      ref={seatInputRef}
                      type="text"
                      value={seating.query}
                      onChange={(e) => { seating.setQuery(e.target.value); seating.setActiveIdx(-1); if (seating.selected) seating.setSelected(null) }}
                      onKeyDown={seating.onKeyDown}
                      placeholder={seating.labels.hint}
                      role="combobox"
                      aria-expanded={seating.suggestions.length > 0}
                      aria-controls="rg-seating-list"
                      aria-autocomplete="list"
                      autoComplete="off"
                      style={{
                        width: '100%', background: `${TH.primary}0A`, border: `1px solid ${TH.primary}33`,
                        padding: '13px 16px', fontSize: 13, color: TH.text, fontFamily: sans, outline: 'none',
                      }}
                    />
                    {seating.suggestions.length > 0 && (
                      <ul id="rg-seating-list" role="listbox" style={{
                        listStyle: 'none', margin: '8px 0 0', padding: 4,
                        background: TH.surface, border: `1px solid ${TH.primary}33`,
                        maxHeight: 300, overflowY: 'auto',
                      }}>
                        {seating.suggestions.map((g, i) => (
                          <li
                            key={g.id ?? `${g.full_name}-${i}`}
                            role="option"
                            aria-selected={i === seating.activeIdx}
                            onMouseEnter={() => seating.setActiveIdx(i)}
                            onMouseDown={(e) => { e.preventDefault(); seating.pick(g) }}
                            style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
                              padding: '12px 14px', cursor: 'pointer',
                              background: i === seating.activeIdx ? `${TH.primary}1A` : 'transparent',
                            }}
                          >
                            <span style={{ fontSize: 13, color: TH.text }}>{g.full_name}</span>
                            <span style={{
                              background: TH.primary, color: '#1A1408', fontSize: 10,
                              letterSpacing: '.14em', padding: '4px 9px', whiteSpace: 'nowrap',
                            }}>{g.table_id}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {seating.showNotFound && (
                    <div style={{ marginTop: 12, fontSize: 12.5, color: TH.muted }}>{tr.inv_seat_fullname}</div>
                  )}

                  {seating.selected && (
                    <div style={{ marginTop: 12, background: `${TH.primary}0F`, border: `1px solid ${TH.primary}2E`, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                        <span style={{ fontSize: 12.5, color: TH.text }}>{seating.selected.full_name}</span>
                        <span style={{
                          background: TH.primary, color: '#1A1408', fontSize: 10,
                          letterSpacing: '.14em', padding: '4px 9px', textTransform: 'uppercase', whiteSpace: 'nowrap',
                        }}>{seating.selected.table_id}</span>
                      </div>
                      <div style={{ fontSize: 11, color: TH.muted, marginTop: 10, lineHeight: 1.6 }}>
                        {seating.selected.table_id}: {seating.tablemates.map((g) => g.full_name).join(', ')}
                      </div>
                      <button
                        onClick={seating.reset}
                        style={{
                          marginTop: 6, background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase',
                          color: TH.primary, fontFamily: sans, minHeight: 44, padding: '0 8px 0 0',
                        }}
                      >
                        Yenidən axtar
                      </button>
                    </div>
                  )}
                </Reveal>
              </section>
            )}

            {/* 10 — FOTO QALEREYA */}
            {canShowGallery && (
              <section id="gallery-section" style={{ padding: '34px 26px', textAlign: 'center', ...sectionBorder }}>
                <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                  <SectionHead kicker="Gallery" title={tr.inv_gallery} />

                  {gallery.demoPhotos.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 20 }}>
                      {gallery.demoPhotos.map((url, i) => (
                        <div key={i} style={{ aspectRatio: '3/2', overflow: 'hidden', background: '#1A1409' }}>
                          <img src={url} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'sepia(.18)' }} />
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{
                    width: 128, height: 128, margin: '0 auto', border: `1px solid ${TH.primary}4D`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF',
                  }}>
                    <QRCodeSVG value={gallery.photoShareUrl} size={104} bgColor="#FFFFFF" fgColor="#1A1408" level="M" />
                  </div>
                  <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: `${TH.muted}99`, marginTop: 12 }}>
                    {tr.inv_scan_upload}
                  </div>

                  <a href={gallery.photoShareUrl} style={{ ...btn(true), marginTop: 16, padding: 13 }}>
                    📷 {tr.inv_gallery_btn}
                  </a>
                  {/* ⚠ Phase 27: "Masa kartını yüklə" tamamilə silindi (QR + foto paylaşımı qalır) */}

                  <div style={{ fontSize: 12.5, color: TH.muted, marginTop: 16, lineHeight: 1.9 }}>
                    {tr.inv_gallery_desc}
                  </div>
                </Reveal>
              </section>
            )}

            {/* 11 — RSVP */}
            {canShowRsvp && (
              <section style={{ padding: '38px 26px 48px', textAlign: 'center', ...sectionBorder }}>
                <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: TH.primary }}>
                    <span style={{ width: 22, height: 1, background: `${TH.primary}99` }} />RSVP
                    <span style={{ width: 22, height: 1, background: `${TH.primary}99` }} />
                  </div>
                  <div style={{ fontFamily: serif, fontWeight: 300, fontSize: 'clamp(24px,7vw,28px)', color: TH.accent, lineHeight: 1.25, marginTop: 12 }}>
                    {rsvp.labels.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: TH.muted, margin: '10px 0 22px' }}>{rsvp.labels.subtitle}</div>

                  {rsvp.rsvpClosed && !rsvp.submitted ? (
                    <div style={{ border: `1px solid ${TH.primary}2E`, background: `${TH.primary}0D`, padding: 24 }}>
                      <div style={{ fontFamily: serif, fontSize: 18, color: TH.accent }}>{tr.rsvp_closed_title}</div>
                      <div style={{ fontSize: 11, color: TH.muted, marginTop: 6 }}>{tr.rsvp_closed_desc}</div>
                    </div>
                  ) : rsvp.alreadyDone ? (
                    <div style={{ border: `1px solid ${TH.primary}4D`, background: `${TH.primary}0D`, padding: 24 }}>
                      <div style={{ fontFamily: serif, fontSize: 18, color: TH.accent }}>{rsvp.labels.already_done}</div>
                      <div style={{ fontSize: 11, color: TH.muted, marginTop: 6 }}>{rsvp.selected?.full_name}</div>
                    </div>
                  ) : rsvp.submitted ? (
                    <div style={{ border: `1px solid ${TH.primary}4D`, background: `${TH.primary}0D`, padding: 24 }}>
                      <div style={{ fontFamily: serif, fontSize: 20, color: TH.accent }}>{rsvp.thanksMsg}</div>
                      <div style={{ fontSize: 11, color: TH.muted, marginTop: 6 }}>{rsvp.labels.thanks_sub}</div>
                    </div>
                  ) : (
                    <form onSubmit={rsvp.handleSubmit}>
                      <div style={{ marginBottom: 12 }}>
                        <input
                          ref={rsvpInputRef}
                          type="text"
                          value={rsvp.query}
                          onChange={(e) => { rsvp.setQuery(e.target.value); rsvp.setActiveIdx(-1); if (rsvp.selected) rsvp.setSelected(null) }}
                          onKeyDown={rsvp.onKeyDown}
                          placeholder={rsvp.labels.namePh}
                          required={!rsvp.useGuestMode}
                          autoComplete="off"
                          style={{
                            width: '100%', background: `${TH.primary}0A`, border: `1px solid ${TH.primary}33`,
                            padding: '14px 16px', fontSize: 13, color: TH.text, fontFamily: sans,
                            outline: 'none', textAlign: 'center',
                          }}
                        />
                        {rsvp.suggestions.length > 0 && (
                          /* flow-da qalır — aşağıdakı elementləri örtmür */
                          <ul role="listbox" style={{
                            listStyle: 'none', margin: '8px 0 0', padding: 4, textAlign: 'left',
                            background: TH.surface, border: `1px solid ${TH.primary}33`,
                            maxHeight: 260, overflowY: 'auto',
                          }}>
                            {rsvp.suggestions.map((g, i) => (
                              <li
                                key={g.id ?? `${g.full_name}-${i}`}
                                role="option"
                                aria-selected={i === rsvp.activeIdx}
                                onMouseEnter={() => rsvp.setActiveIdx(i)}
                                onMouseDown={(e) => { e.preventDefault(); rsvp.pick(g) }}
                                style={{
                                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
                                  padding: '12px 14px', cursor: 'pointer',
                                  background: i === rsvp.activeIdx ? `${TH.primary}1A` : 'transparent',
                                }}
                              >
                                <span style={{ fontSize: 13, color: TH.text }}>{g.full_name}</span>
                                <span style={{ fontSize: 10, letterSpacing: '.12em', color: TH.primary }}>{g.table_id}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {rsvp.showNotFound && (
                          <div style={{ fontSize: 10, color: `${TH.primary}CC`, marginTop: 6 }}>{rsvp.labels.not_in_list}</div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {[
                          { val: 'yes',   label: rsvp.labels.yes },
                          { val: 'no',    label: rsvp.labels.no },
                          { val: 'maybe', label: rsvp.labels.maybe },
                        ].map(({ val, label }) => {
                          const active = rsvp.status === val
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => rsvp.chooseStatus(val)}
                              style={{
                                flex: '1 1 40%', minHeight: 48, borderRadius: 100, cursor: 'pointer',
                                padding: '14px 8px', fontSize: 10.5, letterSpacing: '.14em',
                                textTransform: 'uppercase', fontFamily: sans,
                                background: active ? `linear-gradient(135deg, ${TH.primary}, #B8903A)` : 'transparent',
                                color: active ? '#FFFFFF' : TH.accent,
                                border: active ? '1px solid transparent' : `1px solid ${TH.primary}40`,
                                transition: 'all .2s',
                              }}
                            >
                              {label}
                            </button>
                          )
                        })}
                      </div>

                      {rsvp.status === 'yes' && (
                        <div style={{ marginTop: 12, border: `1px solid ${TH.primary}2E`, background: `${TH.primary}0D`, padding: '22px 18px' }}>
                          <div style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: TH.muted }}>
                            {rsvp.labels.plusq}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, marginTop: 18 }}>
                            <button type="button" onClick={rsvp.decPlusOne} disabled={rsvp.plusOne === 0} aria-label="Azalt"
                              style={{ width: 40, height: 40, border: `1px solid ${TH.primary}4D`, background: 'none', color: TH.muted, cursor: 'pointer', opacity: rsvp.plusOne === 0 ? .35 : 1 }}>
                              −
                            </button>
                            <span style={{ fontFamily: serif, fontSize: 34, color: TH.accent, width: 40, fontVariantNumeric: 'tabular-nums' }}>
                              {rsvp.plusOne}
                            </span>
                            <button type="button" onClick={rsvp.incPlusOne} disabled={rsvp.plusOne === rsvp.maxExtraGuests} aria-label="Artır"
                              style={{ width: 40, height: 40, border: `1px solid ${TH.primary}4D`, background: 'none', color: TH.primary, cursor: 'pointer', opacity: rsvp.plusOne === rsvp.maxExtraGuests ? .35 : 1 }}>
                              +
                            </button>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={!rsvp.canSubmit}
                        style={{
                          marginTop: 12, width: '100%', minHeight: 50, border: 'none',
                          background: TH.primary, color: '#1A1408',
                          cursor: rsvp.canSubmit ? 'pointer' : 'not-allowed',
                          fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase',
                          fontFamily: sans, opacity: rsvp.canSubmit ? 1 : .35,
                        }}
                      >
                        {rsvp.sending ? '…' : rsvp.labels.send}
                      </button>
                    </form>
                  )}

                  {/* ⚠ Phase 27: RSVP statistika paneli SİLİNDİ — qonaq digər
                      qonaqların cavablarını görməməlidir. Hesablama hook-da
                      qalır (API dəyişmir), sadəcə render olunmur. */}
                </Reveal>
              </section>
            )}

            {/* 12 — QONAQ DƏFTƏRİ */}
            <section style={{ padding: '34px 26px', ...sectionBorder }}>
              <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                <SectionHead kicker="Guestbook" title={gbook.labels.title} />

                <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 18 }}>
                  <input
                    type="text"
                    value={gbook.name}
                    onChange={(e) => gbook.setName(e.target.value)}
                    placeholder={gbook.labels.namePh}
                    style={{
                      background: `${TH.primary}0A`, border: `1px solid ${TH.primary}33`,
                      padding: '13px 16px', fontSize: 13, color: TH.text, fontFamily: sans, outline: 'none',
                    }}
                  />
                  <textarea
                    value={gbook.text}
                    onChange={(e) => gbook.setText(e.target.value)}
                    placeholder={gbook.labels.msgPh}
                    rows={3}
                    style={{
                      background: `${TH.primary}0A`, border: `1px solid ${TH.primary}33`,
                      padding: '14px 16px', fontSize: 13, color: TH.text, fontFamily: sans,
                      outline: 'none', resize: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!gbook.canSubmit}
                    style={{
                      minHeight: 46, border: 'none', background: TH.primary, color: '#1A1408',
                      cursor: gbook.canSubmit ? 'pointer' : 'not-allowed',
                      fontSize: 10.5, letterSpacing: '.2em', textTransform: 'uppercase',
                      fontFamily: sans, opacity: gbook.canSubmit ? 1 : .35,
                    }}
                  >
                    {gbook.sending ? gbook.labels.sending : gbook.labels.btn}
                  </button>
                </form>

                <div style={{ display: 'grid', gap: 14 }}>
                  {gbook.messages.map((raw, i) => {
                    const m = gbook.readMessage(raw)
                    return (
                      <div key={m.name + i} style={{ borderLeft: `1px solid ${TH.primary}4D`, padding: '6px 0 6px 14px' }}>
                        <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 15, color: '#D9CDB8', lineHeight: 1.6 }}>
                          “{m.text}”
                        </div>
                        <div style={{ fontSize: 10, color: TH.muted, marginTop: 6, letterSpacing: '.12em' }}>
                          — {m.name}{m.date ? ` · ${gbook.formatDate(m.date)}` : ''}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Reveal>
            </section>

            {/* 12.5 — SİFARİŞ CTA (yalnız builder önbaxışında; şərt komponentin içindədir) */}
            <OrderCta
              theme={TH} weddingData={weddingData} lang={lang}
              pageSlug={gallery.pageSlug} isDemoMode={isDemoMode}
              effectiveSlug={gallery.effectiveSlug} serif={serif}
            />

            {/* 13 — SON HİSSƏ: demo CTA + footer (9 şablonun ortağı) */}
            <TemplateOutro
              theme={TH} weddingData={weddingData} lang={lang}
              isDemoMode={isDemoMode} isCouple={isCouple} isCorp={isCorp}
              eventLabel={eventLabel} serif={serif}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
