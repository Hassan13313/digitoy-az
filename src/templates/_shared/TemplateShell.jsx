import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeCard from './DressCodeCard'
import { buildPresetMusic, PRESET_TRACKS, MUSIC_PLAY_MODES } from '../../data/music'
import { getPackageGates } from '../../data/packages'
import { formatAzDate, formatFullDateByLang, formatTime24 } from '../../utils/dateFormat'
import { isAudioUnlocked } from '../../utils/audioUnlock'
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
   TEMPLATE SHELL — 13 bölməlik ortaq dəvətnamə skeleti.

   NƏ ÜÇÜN: simple-luxury / royal-gold / floral-garden hər biri öz markup-ını
   yazır (tarixi səbəb + fərdi dizayn dili). Qalan şablonlar üçün eyni 800
   sətri təkrarlamaq həm baxımsızdır, həm də bir bölmə düzəlişi 6 yerdə
   təkrarlanardı. Bu shell strukturu bir yerdə saxlayır; hər şablon yalnız
   ÖZ vizual dilini (`design` knob-ları + öz açılış ekranı) verir.

   ⚠ MÜQAVİLƏLƏR TOXUNULMUR:
     • TemplateRenderer / TemplateProvider / registry → dəyişmir
     • Hook contract → 7 hook olduğu kimi çağırılır, yeni biznes məntiqi YOXDUR
     • Şablon props → { lang, setLang, weddingData, onBack, isDemoMode,
                        initialGuestbook, isPreview }

   ⚠ RƏNGLƏR: bütün rənglər `theme` token-lərindən gəlir (templateConfig).
   Bu faylda heç bir hardcode rəng yoxdur — yalnız ağ/qara alpha overlay-lər
   `theme` üzərində hesablanır.
   ───────────────────────────────────────────────────────────────────────── */

const DEFAULT_MUSIC = buildPresetMusic(PRESET_TRACKS[0], { playMode: MUSIC_PLAY_MODES.AUTO })

/* Hex + alpha → rgba (token üzərində şəffaflıq, hardcode rəng deyil) */
function alpha(hex, a) {
  const h = String(hex || '').replace('#', '')
  if (h.length !== 6) return hex
  const n = parseInt(h, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

/* ── Scroll reveal — hər şablonun öz "hərəkət dili" ilə ── */
function Reveal({ children, style, motionStyle = 'fade' }) {
  const [ref, visible] = useScrollReveal()
  const variants = {
    fade:   { hidden: { opacity: 0, transform: 'translateY(12px)' },  shown: { opacity: 1, transform: 'translateY(0)' } },
    rise:   { hidden: { opacity: 0, transform: 'translateY(24px)' },  shown: { opacity: 1, transform: 'translateY(0)' } },
    settle: { hidden: { opacity: 0, transform: 'translateY(32px)' },  shown: { opacity: 1, transform: 'translateY(0)' } },
    clip:   { hidden: { opacity: 0, transform: 'translateY(18px)' },  shown: { opacity: 1, transform: 'translateY(0)' } },
  }
  const v = variants[motionStyle] || variants.fade
  const st = visible ? v.shown : v.hidden
  return (
    <div ref={ref} style={{ ...style, ...st, transition: 'opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)' }}>
      {children}
    </div>
  )
}

/* Bölmə başlığı — MODUL səviyyəsində (render daxilində yaradılsa,
   hər render-də yeni komponent tipi olar və subtree remount edilər). */
function SectionHead({ kicker, title, sub, theme, design, serif }) {
  return (
    <div style={{ marginBottom: 18, textAlign: design.align }}>
      <div style={{ fontSize: 9, letterSpacing: design.kicker, textTransform: 'uppercase', color: design.accentColor || theme.primary }}>{kicker}</div>
      <div style={{
        fontFamily: serif, fontStyle: design.headingStyle, fontWeight: 300,
        fontSize: 'clamp(21px, 6vw, 26px)', color: design.headingColor || theme.accent, marginTop: 6, lineHeight: 1.25,
        textTransform: design.headingTransform,
        letterSpacing: design.headingTransform === 'uppercase' ? '.08em' : 'normal',
      }}>{title}</div>
      {sub && <div style={{ fontSize: 11, color: theme.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

export default function TemplateShell({
  /* şablon propsları */
  lang, setLang, weddingData, onBack, isDemoMode = false, initialGuestbook,
  /* şablona məxsus */
  templateId, theme, design = {}, Opening, keyframes = '', ambient = null,
}) {
  const tr = t[lang] || t.az
  const [opened, setOpened] = useState(false)
  const musicRef = useRef(null)

  const D = {
    radius: 16,
    align: 'center',
    headingTransform: 'none',
    headingStyle: 'normal',
    kicker: '.32em',
    dark: false,
    alternate: true,
    motion: 'fade',
    buttonRadius: 100,
    ...design,
  }

  /* ⚠ KONTRAST: bəzi şablonlarda `theme.primary` fon rəngidir (modern-black
     #0A0A0A, white-elegance #FFFFFF). Kiçik aksent mətnlər üçün oxunaqlı token
     şablonun özü seçir; default olaraq primary qalır. */
  const ACC     = D.accentColor || theme.primary
  const HEAD    = D.headingColor || theme.accent
  const CTA_BG  = D.ctaBg   || theme.primary
  const CTA_TXT = D.ctaText || (D.dark ? theme.text : theme.background)

  const serif = theme.fonts?.heading
  const sans  = theme.fonts?.body

  const isCouple = ['toy', 'nishan'].includes(weddingData.eventType)
  const isCorp   = ['corporate', 'other'].includes(weddingData.eventType)

  const eventLabels = {
    toy: tr.event_toy, nishan: tr.event_nishan,
    birthday: tr.event_birthday, corporate: tr.event_corporate,
    other: weddingData.eventName || tr.event_other,
  }
  const eventLabel = eventLabels[weddingData.eventType] || tr.event_toy

  const invMusic  = weddingData?.music || DEFAULT_MUSIC
  const autoStart = weddingData?.music ? invMusic.playMode === 'auto' : true

  const activePkgId = isDemoMode ? 'PREMIUM' : (weddingData.package || 'SADE')
  const { allowRsvp: canShowRsvp, allowSeating: canShowSeating, allowGallery: canShowGallery } = getPackageGates(activePkgId)

  /* ── 7 HOOK — biznes məntiqinin YEGANƏ mənbəyi ── */
  const cd       = useCountdown({ date: weddingData.date, time: weddingData.time, lang, eventType: weddingData.eventType, eventName: weddingData.eventName })
  const timeline = useTimeline({ lang, eventType: weddingData.eventType, programSteps: weddingData.programSteps })
  const { inputRef: seatInputRef, ...seating } = useSeating({ seatingPlan: weddingData.seatingPlan, lang })
  const { inputRef: rsvpInputRef, ...rsvp }    = useRsvp({ lang, weddingData })
  const gbook    = useGuestbook({ lang, initialMessages: initialGuestbook })
  const gallery  = useGallery({ weddingData, isCouple, isCorp })
  const music    = useMusicPlayer({ lang, music: invMusic })

  useEffect(() => { musicRef.current = { play: music.play, pause: music.pause } })

  useEffect(() => {
    if (!isDemoMode) trackEvent('invitation_opened', { lang, event_type: weddingData?.eventType })
  }, [])

  useEffect(() => {
    if (!opened) return
    const id = setTimeout(() => { if (isAudioUnlocked() && autoStart) musicRef.current?.play() }, 900)
    return () => clearTimeout(id)
  }, [opened, autoStart])

  const { formattedDate, dayName } = formatAzDate(weddingData.date, lang)

  /* ── Ortaq stil yardımçıları (hamısı token əsaslı) ── */
  const line   = alpha(theme.accent, 0.28)
  const soft   = alpha(theme.accent, 0.12)
  const card   = D.dark ? alpha(theme.accent, 0.06) : alpha(theme.background, 1)
  const field  = D.dark ? alpha(theme.accent, 0.07) : alpha(theme.background, 1)

  const sectionStyle = (i) => ({
    padding: 'clamp(28px, 7vw, 36px) clamp(18px, 6vw, 28px)',
    background: D.alternate && i % 2 === 1 ? theme.surface : 'transparent',
    borderBottom: D.alternate ? 'none' : `1px solid ${alpha(theme.accent, 0.1)}`,
  })
  const inner = { maxWidth: 560, margin: '0 auto', textAlign: D.align }

  const btn = (filled) => ({
    flex: 1, minWidth: 88, textAlign: 'center', display: 'block',
    padding: 'clamp(11px, 3vw, 13px) 6px', borderRadius: D.buttonRadius,
    fontSize: 'clamp(9px, 2.4vw, 9.5px)', letterSpacing: '.14em', textTransform: 'uppercase',
    fontFamily: sans, cursor: 'pointer', textDecoration: 'none',
    background: filled ? CTA_BG : 'transparent',
    color: filled ? CTA_TXT : theme.accent,
    border: filled ? '1px solid transparent' : `1px solid ${alpha(theme.accent, 0.35)}`,
  })

  const inputStyle = {
    width: '100%', background: field, border: `1px solid ${alpha(theme.accent, 0.3)}`,
    borderRadius: D.buttonRadius === 0 ? 0 : 100, padding: '13px 16px',
    fontSize: 13, color: theme.text, fontFamily: sans, outline: 'none',
  }

  const names = isCouple
    ? `${weddingData.brideName || ''}\n${weddingData.groomName || ''}`
    : (weddingData.eventName || weddingData.brideName || '')

  return (
    <div
      data-tpl={templateId}
      style={{ background: theme.background, minHeight: '100vh', fontFamily: sans, color: theme.text, overflowX: 'hidden', position: 'relative' }}
    >
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          [data-tpl="${templateId}"], [data-tpl="${templateId}"] * { animation: none !important; transition: none !important; }
        }
        ${keyframes}
      `}</style>

      {/* 01 — ZƏRF AÇILIŞI */}
      {!opened && Opening && (
        <Opening
          theme={theme} weddingData={weddingData} isCouple={isCouple} isCorp={isCorp}
          eventLabel={eventLabel} lang={lang} onOpen={() => setOpened(true)}
        />
      )}

      {opened && ambient}

      {/* 03 — MUSİQİ TOGGLE */}
      {opened && music.hasMusic && (
        <>
          <audio {...music.audioProps} />
          <button
            onClick={music.toggle}
            aria-label={music.playing ? 'Musiqini dayandır' : 'Musiqini başlat'}
            style={{
              position: 'fixed', bottom: 'max(20px, env(safe-area-inset-bottom, 20px))', right: 20, zIndex: 55,
              width: 46, height: 46, borderRadius: '50%',
              border: `1px solid ${alpha(theme.accent, 0.4)}`, background: D.dark ? alpha(theme.accent, 0.12) : alpha(theme.surface, 0.95),
              backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, cursor: 'pointer',
            }}
          >
            {[0, 0.18, 0.36].map((d) => (
              <span key={d} style={{
                width: 2.5, height: 12, background: music.playing ? ACC : alpha(theme.muted, 0.6),
                transformOrigin: 'bottom', display: 'block',
                animation: music.playing ? `tpl-eq 1s ease-in-out ${d}s infinite` : 'none',
                transform: music.playing ? undefined : 'scaleY(.45)',
              }} />
            ))}
          </button>
        </>
      )}

      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            {/* 02 — STICKY HEADER */}
            <header style={{
              position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: alpha(theme.background, 0.9), backdropFilter: 'blur(10px)',
              borderBottom: `1px solid ${alpha(theme.accent, 0.18)}`,
            }}>
              <button onClick={onBack} style={{
                display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
                fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: theme.muted,
                cursor: 'pointer', fontFamily: sans, minHeight: 44, padding: '0 8px 0 0',
              }}>
                <span>←</span>{tr.btn_back}
              </button>
              <div style={{ fontFamily: serif, fontSize: 14, letterSpacing: '.06em' }}>
                <span style={{ color: ACC }}>Digitoy</span>
                <span style={{ color: alpha(theme.muted, 0.6) }}>.az</span>
              </div>
              <LanguageSwitcher lang={lang} setLang={setLang} />
            </header>

            {/* 04 — HERO */}
            <section style={{ ...sectionStyle(0), padding: 'clamp(40px, 10vw, 56px) clamp(18px, 6vw, 28px) clamp(34px, 8vw, 48px)' }}>
              <div style={inner}>
                <div style={{ fontSize: 9, letterSpacing: '.45em', textTransform: 'uppercase', color: ACC, marginBottom: 12 }}>
                  {eventLabel}
                </div>
                <div style={{ fontFamily: serif, fontSize: 11, letterSpacing: '.3em', textTransform: 'uppercase', color: theme.muted }}>
                  {tr.inv_join}
                </div>
                <h1 style={{
                  fontFamily: serif, fontStyle: D.headingStyle, fontWeight: 300,
                  fontSize: 'clamp(34px, 11vw, 52px)', lineHeight: 1.08, color: HEAD,
                  margin: '16px 0 0', whiteSpace: 'pre-line',
                  textTransform: D.headingTransform,
                  letterSpacing: D.headingTransform === 'uppercase' ? '-.02em' : 'normal',
                }}>
                  {isCouple ? (
                    <>
                      {weddingData.brideName}
                      <span style={{ display: 'block', fontSize: '.5em', color: ACC, margin: '2px 0', fontStyle: 'italic' }}>{tr.inv_and}</span>
                      {weddingData.groomName}
                    </>
                  ) : names}
                </h1>

                {isCorp && weddingData.organizer?.trim() && (
                  <div style={{ fontSize: 10, letterSpacing: '.24em', textTransform: 'uppercase', color: ACC, marginTop: 10 }}>
                    {tr.organizer_display}: {weddingData.organizer}
                  </div>
                )}

                {D.ornament ? <div style={{ margin: '20px 0' }}>{D.ornament}</div> : (
                  <div style={{ display: 'flex', justifyContent: D.align === 'left' ? 'flex-start' : 'center', alignItems: 'center', gap: 8, margin: '20px 0' }}>
                    <span style={{ width: 44, height: 1, background: alpha(theme.accent, 0.5) }} />
                    <span style={{ width: 4, height: 4, background: ACC, transform: 'rotate(45deg)' }} />
                    <span style={{ width: 44, height: 1, background: alpha(theme.accent, 0.5) }} />
                  </div>
                )}

                <div style={{ fontSize: 13, color: theme.text }}>{formattedDate}</div>
                <div style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: ACC, marginTop: 5 }}>
                  {[dayName, weddingData.time ? formatTime24(weddingData.time) : ''].filter(Boolean).join(' · ')}
                </div>
                {weddingData.venueName && (
                  <div style={{ fontSize: 10, letterSpacing: '.26em', textTransform: 'uppercase', color: theme.muted, marginTop: 14 }}>
                    {weddingData.venueName}
                  </div>
                )}

                <div style={{
                  margin: D.align === 'left' ? '28px 0 0' : '28px auto 0', width: 40, height: 40,
                  border: `1px solid ${alpha(theme.accent, 0.3)}`, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, color: ACC, animation: 'tpl-hint 2.8s ease-in-out infinite',
                }}>⌄</div>
              </div>
            </section>

            {/* 05 — COUNTDOWN */}
            <section style={sectionStyle(1)}>
              <Reveal style={inner} motionStyle={D.motion}>
                <SectionHead kicker="Countdown" title={cd.title} theme={theme} design={D} serif={serif} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(6px, 2vw, 8px)' }}>
                  {[
                    { v: cd.days, l: cd.labels.days },
                    { v: cd.hours, l: cd.labels.hours },
                    { v: cd.minutes, l: cd.labels.minutes },
                    { v: cd.seconds, l: cd.labels.seconds },
                  ].map(({ v, l }) => (
                    <div key={l} style={{
                      background: soft, border: `1px solid ${alpha(theme.accent, 0.18)}`,
                      borderRadius: D.radius === 0 ? 0 : 10, padding: 'clamp(10px, 3vw, 14px) 2px', textAlign: 'center',
                    }}>
                      <div style={{ fontFamily: serif, fontSize: 'clamp(20px, 6vw, 26px)', color: HEAD, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                        {String(v).padStart(2, '0')}
                      </div>
                      <div style={{ fontSize: 7.5, letterSpacing: '.16em', textTransform: 'uppercase', color: theme.muted, marginTop: 5 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* 06 — LOCATION */}
            <section style={sectionStyle(2)}>
              <Reveal style={inner} motionStyle={D.motion}>
                <SectionHead kicker="Location" title={tr.inv_location} theme={theme} design={D} serif={serif} />
                <div style={{ borderRadius: D.radius, overflow: 'hidden', border: `1px solid ${line}` }}>
                  <div style={{
                    height: 'clamp(110px, 26vw, 136px)', position: 'relative', overflow: 'hidden',
                    background: `linear-gradient(140deg, ${alpha(theme.primary, 0.28)}, ${alpha(theme.secondary || theme.primary, 0.16)})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{
                      position: 'absolute', inset: 0, opacity: 0.2,
                      backgroundImage: `linear-gradient(${alpha(theme.accent, 0.35)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.accent, 0.35)} 1px, transparent 1px)`,
                      backgroundSize: '26px 26px',
                    }} />
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: ACC, boxShadow: `0 0 0 8px ${alpha(theme.primary, 0.16)}` }} />
                  </div>
                  <div style={{ padding: 'clamp(14px, 4vw, 18px)', background: card }}>
                    <div style={{ fontFamily: serif, fontSize: 'clamp(17px, 5vw, 20px)', color: theme.text }}>
                      {weddingData.venueName || tr.inv_location}
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
                      <a href={weddingData.googleMapsUrl || '#'} target="_blank" rel="noopener noreferrer" style={btn(true)}>Maps</a>
                      <a href={weddingData.wazeUrl || '#'} target="_blank" rel="noopener noreferrer" style={btn(false)}>Waze</a>
                      {weddingData.appleMapsUrl && (
                        <a href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Apple</a>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            </section>

            {/* 07 — PROQRAM */}
            <section style={sectionStyle(3)}>
              <Reveal style={inner} motionStyle={D.motion}>
                <SectionHead kicker="Schedule" title={timeline.sectionLabel} theme={theme} design={D} serif={serif} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
                  {timeline.events.map((ev, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'clamp(10px, 3vw, 14px)' }}>
                      <span style={{ width: 44, flex: '0 0 auto', fontSize: 10, letterSpacing: '.1em', color: theme.muted, paddingTop: 9, textAlign: 'right' }}>
                        {ev.time}
                      </span>
                      <span style={{
                        width: 32, height: 32, flex: '0 0 auto', border: `1px solid ${alpha(theme.accent, 0.3)}`,
                        borderRadius: D.radius === 0 ? 0 : 8, background: card,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                      }}>{ev.icon}</span>
                      <span style={{ paddingTop: 6, fontFamily: serif, fontSize: 'clamp(15px, 4.4vw, 17px)', color: theme.text, minWidth: 0 }}>
                        {ev.label}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </section>

            {/* 08 — DRESS CODE (ortaq komponent) */}
            <section style={sectionStyle(4)}>
              <Reveal style={inner} motionStyle={D.motion}>
                <SectionHead kicker="Style" title={tr.inv_dresscode} theme={theme} design={D} serif={serif} />
                <div style={{ textAlign: 'left' }}>
                  <DressCodeCard
                    theme={theme}
                    paletteId={weddingData.dressCodePalette}
                    note={weddingData.dressCodeDescription}
                    lang={lang}
                    isCouple={isCouple}
                    onDark={D.dark}
                  />
                </div>
              </Reveal>
            </section>

            {/* 09 — OTURMA PLANI */}
            {canShowSeating && !seating.isEmpty && (
              <section style={sectionStyle(5)}>
                <Reveal style={inner} motionStyle={D.motion}>
                  <SectionHead kicker="Seating" title={seating.labels.title} sub={seating.labels.sub} theme={theme} design={D} serif={serif} />
                  {/* ⚠ Təkliflər siyahısı normal document flow-da — overlap olmur */}
                  <div style={{ textAlign: 'left' }}>
                    <input
                      ref={seatInputRef}
                      type="text"
                      value={seating.query}
                      onChange={(e) => { seating.setQuery(e.target.value); seating.setActiveIdx(-1); if (seating.selected) seating.setSelected(null) }}
                      onKeyDown={seating.onKeyDown}
                      placeholder={seating.labels.hint}
                      role="combobox"
                      aria-expanded={seating.suggestions.length > 0}
                      aria-controls={`${templateId}-seating-list`}
                      aria-autocomplete="list"
                      autoComplete="off"
                      style={inputStyle}
                    />
                    {seating.suggestions.length > 0 && (
                      <ul id={`${templateId}-seating-list`} role="listbox" style={{
                        listStyle: 'none', margin: '8px 0 0', padding: 4,
                        background: card, border: `1px solid ${alpha(theme.accent, 0.3)}`,
                        borderRadius: D.radius, maxHeight: 300, overflowY: 'auto',
                      }}>
                        {seating.suggestions.map((g, i) => (
                          <li
                            key={g.id ?? `${g.full_name}-${i}`}
                            role="option"
                            aria-selected={i === seating.activeIdx}
                            onMouseEnter={() => seating.setActiveIdx(i)}
                            onMouseDown={(e) => { e.preventDefault(); seating.pick(g) }}
                            style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
                              padding: '11px 12px', cursor: 'pointer', borderRadius: D.radius === 0 ? 0 : 10,
                              background: i === seating.activeIdx ? soft : 'transparent',
                            }}
                          >
                            <span style={{ fontSize: 13, color: theme.text, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.full_name}</span>
                            <span style={{
                              background: CTA_BG, color: CTA_TXT,
                              fontSize: 9, letterSpacing: '.1em', padding: '4px 9px',
                              borderRadius: D.buttonRadius === 0 ? 0 : 100, whiteSpace: 'nowrap', flexShrink: 0,
                            }}>{g.table_id}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {seating.showNotFound && (
                      <div style={{ marginTop: 12, fontSize: 12, color: theme.muted }}>{tr.inv_seat_fullname}</div>
                    )}

                    {seating.selected && (
                      <div style={{ marginTop: 12, background: card, border: `1px solid ${alpha(theme.primary, 0.35)}`, borderRadius: D.radius, padding: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 13, color: theme.text }}>{seating.selected.full_name}</span>
                          <span style={{
                            background: CTA_BG, color: CTA_TXT, fontSize: 9,
                            letterSpacing: '.1em', padding: '4px 10px', borderRadius: D.buttonRadius === 0 ? 0 : 100,
                            textTransform: 'uppercase', whiteSpace: 'nowrap',
                          }}>{seating.selected.table_id}</span>
                        </div>
                        <div style={{ fontSize: 11, color: theme.muted, marginTop: 10, lineHeight: 1.6 }}>
                          {seating.selected.table_id}: {seating.tablemates.map((g) => g.full_name).join(', ')}
                        </div>
                        <button onClick={seating.reset} style={{
                          marginTop: 6, background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase',
                          color: ACC, fontFamily: sans, minHeight: 44, padding: '0 8px 0 0',
                        }}>Yenidən axtar</button>
                      </div>
                    )}
                  </div>
                </Reveal>
              </section>
            )}

            {/* 10 — QALEREYA + QR */}
            {canShowGallery && (
              <section id="gallery-section" style={sectionStyle(6)}>
                <Reveal style={inner} motionStyle={D.motion}>
                  <div style={{ background: card, border: `1px solid ${line}`, borderRadius: D.radius, padding: 'clamp(16px, 5vw, 22px)', textAlign: 'center' }}>
                    <SectionHead kicker="Gallery" title={tr.inv_gallery} theme={theme} design={D} serif={serif} />

                    {gallery.demoPhotos.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 18 }}>
                        {gallery.demoPhotos.map((url, i) => (
                          <div key={i} style={{ aspectRatio: '3/2', overflow: 'hidden', background: theme.surface, borderRadius: D.radius === 0 ? 0 : 6 }}>
                            <img src={url} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{
                      width: 128, height: 128, margin: '4px auto 0', borderRadius: D.radius === 0 ? 0 : 12,
                      background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${alpha(theme.accent, 0.25)}`,
                    }}>
                      <QRCodeSVG value={gallery.photoShareUrl} size={104} bgColor="#FFFFFF" fgColor="#1A1A1A" level="M" />
                    </div>
                    <div style={{ fontSize: 8, letterSpacing: '.28em', textTransform: 'uppercase', color: theme.muted, marginTop: 12 }}>
                      Scan to upload
                    </div>

                    <a href={gallery.photoShareUrl} style={{ ...btn(true), marginTop: 14, padding: 13 }}>📷 Şəkilləri Paylaş</a>
                    <button onClick={gallery.downloadTableCard} style={{ ...btn(false), marginTop: 8, padding: 13, width: '100%' }}>
                      ⤓ Masa kartını yüklə
                    </button>

                    <div style={{ fontSize: 12, color: theme.muted, marginTop: 14, lineHeight: 1.8 }}>{tr.inv_gallery_desc}</div>
                  </div>
                </Reveal>
              </section>
            )}

            {/* 11 — RSVP */}
            {canShowRsvp && (
              <section style={sectionStyle(7)}>
                <Reveal style={inner} motionStyle={D.motion}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 9, letterSpacing: '.42em', textTransform: 'uppercase', color: ACC }}>
                    <span style={{ width: 22, height: 1, background: alpha(ACC, 0.6) }} />RSVP
                    <span style={{ width: 22, height: 1, background: alpha(ACC, 0.6) }} />
                  </div>
                  <div style={{ fontFamily: serif, fontStyle: D.headingStyle, fontSize: 'clamp(22px, 6.5vw, 28px)', color: HEAD, marginTop: 12, lineHeight: 1.3 }}>
                    {rsvp.labels.title}
                  </div>
                  <div style={{ fontSize: 12, color: theme.muted, margin: '10px 0 20px' }}>{rsvp.labels.subtitle}</div>

                  {rsvp.rsvpClosed && !rsvp.submitted ? (
                    <div style={{ background: card, border: `1px solid ${line}`, borderRadius: D.radius, padding: 22 }}>
                      <div style={{ fontFamily: serif, fontSize: 18, color: theme.text }}>{tr.rsvp_closed_title}</div>
                      <div style={{ fontSize: 11, color: theme.muted, marginTop: 6 }}>{tr.rsvp_closed_desc}</div>
                    </div>
                  ) : rsvp.alreadyDone ? (
                    <div style={{ background: card, border: `1px solid ${line}`, borderRadius: D.radius, padding: 22 }}>
                      <div style={{ fontFamily: serif, fontSize: 18, color: theme.text }}>{rsvp.labels.already_done}</div>
                      <div style={{ fontSize: 11, color: theme.muted, marginTop: 6 }}>{rsvp.selected?.full_name}</div>
                    </div>
                  ) : rsvp.submitted ? (
                    <div style={{ background: card, border: `1px solid ${line}`, borderRadius: D.radius, padding: 22 }}>
                      <div style={{ fontFamily: serif, fontStyle: D.headingStyle, fontSize: 20, color: HEAD }}>{rsvp.thanksMsg}</div>
                      <div style={{ fontSize: 11, color: theme.muted, marginTop: 6 }}>{rsvp.labels.thanks_sub}</div>
                    </div>
                  ) : (
                    <form onSubmit={rsvp.handleSubmit}>
                      <div style={{ marginBottom: 12, textAlign: 'left' }}>
                        <input
                          ref={rsvpInputRef}
                          type="text"
                          value={rsvp.query}
                          onChange={(e) => { rsvp.setQuery(e.target.value); rsvp.setActiveIdx(-1); if (rsvp.selected) rsvp.setSelected(null) }}
                          onKeyDown={rsvp.onKeyDown}
                          placeholder={rsvp.labels.namePh}
                          required={!rsvp.useGuestMode}
                          autoComplete="off"
                          style={{ ...inputStyle, textAlign: D.align === 'left' ? 'left' : 'center' }}
                        />
                        {rsvp.suggestions.length > 0 && (
                          <ul role="listbox" style={{
                            listStyle: 'none', margin: '8px 0 0', padding: 4,
                            background: card, border: `1px solid ${alpha(theme.accent, 0.3)}`,
                            borderRadius: D.radius, maxHeight: 260, overflowY: 'auto',
                          }}>
                            {rsvp.suggestions.map((g, i) => (
                              <li
                                key={g.id ?? `${g.full_name}-${i}`}
                                role="option"
                                aria-selected={i === rsvp.activeIdx}
                                onMouseEnter={() => rsvp.setActiveIdx(i)}
                                onMouseDown={(e) => { e.preventDefault(); rsvp.pick(g) }}
                                style={{
                                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
                                  padding: '11px 12px', cursor: 'pointer', borderRadius: D.radius === 0 ? 0 : 10,
                                  background: i === rsvp.activeIdx ? soft : 'transparent',
                                }}
                              >
                                <span style={{ fontSize: 13, color: theme.text }}>{g.full_name}</span>
                                <span style={{ fontSize: 9, letterSpacing: '.1em', color: ACC }}>{g.table_id}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {rsvp.showNotFound && (
                          <div style={{ fontSize: 10, color: ACC, marginTop: 6 }}>{rsvp.labels.not_in_list}</div>
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
                              key={val} type="button" onClick={() => rsvp.chooseStatus(val)}
                              style={{
                                flex: '1 1 40%', minWidth: 110, minHeight: 48, cursor: 'pointer',
                                borderRadius: D.buttonRadius, padding: '13px 8px',
                                fontSize: 'clamp(9.5px, 2.6vw, 10.5px)', letterSpacing: '.16em',
                                textTransform: 'uppercase', fontFamily: sans,
                                background: active ? CTA_BG : 'transparent',
                                color: active ? CTA_TXT : theme.accent,
                                border: active ? '1px solid transparent' : `1px solid ${alpha(theme.accent, 0.35)}`,
                                transition: 'all .2s',
                              }}
                            >{label}</button>
                          )
                        })}
                      </div>

                      {rsvp.status === 'yes' && (
                        <div style={{ marginTop: 12, background: card, border: `1px solid ${line}`, borderRadius: D.radius, padding: 20, textAlign: 'center' }}>
                          <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: theme.muted }}>{rsvp.labels.plusq}</div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 16 }}>
                            <button type="button" onClick={rsvp.decPlusOne} disabled={rsvp.plusOne === 0} aria-label="Azalt"
                              style={{ width: 40, height: 40, border: `1px solid ${alpha(theme.accent, 0.3)}`, borderRadius: D.buttonRadius === 0 ? 0 : '50%', background: 'none', color: theme.muted, cursor: 'pointer', opacity: rsvp.plusOne === 0 ? 0.35 : 1 }}>−</button>
                            <span style={{ fontFamily: serif, fontSize: 32, color: HEAD, width: 40, fontVariantNumeric: 'tabular-nums' }}>{rsvp.plusOne}</span>
                            <button type="button" onClick={rsvp.incPlusOne} disabled={rsvp.plusOne === rsvp.maxExtraGuests} aria-label="Artır"
                              style={{ width: 40, height: 40, border: `1px solid ${alpha(theme.accent, 0.3)}`, borderRadius: D.buttonRadius === 0 ? 0 : '50%', background: 'none', color: ACC, cursor: 'pointer', opacity: rsvp.plusOne === rsvp.maxExtraGuests ? 0.35 : 1 }}>+</button>
                          </div>
                        </div>
                      )}

                      <button type="submit" disabled={!rsvp.canSubmit} style={{
                        marginTop: 12, width: '100%', minHeight: 50, border: 'none', borderRadius: D.buttonRadius,
                        background: CTA_BG, color: CTA_TXT,
                        cursor: rsvp.canSubmit ? 'pointer' : 'not-allowed',
                        fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', fontFamily: sans,
                        opacity: rsvp.canSubmit ? 1 : 0.35,
                      }}>{rsvp.sending ? '…' : rsvp.labels.send}</button>
                    </form>
                  )}

                  {rsvp.stats && (
                    <div style={{ marginTop: 22, background: card, border: `1px solid ${line}`, borderRadius: D.radius, overflow: 'hidden', textAlign: 'left' }}>
                      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${alpha(theme.accent, 0.15)}`, display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 9, letterSpacing: '.26em', textTransform: 'uppercase', color: ACC }}>Cəmi cavab</span>
                        <span style={{ fontSize: 9, color: theme.muted }}>{rsvp.stats.responded}/{rsvp.stats.total}</span>
                      </div>
                      <div style={{ padding: '14px 16px 0' }}>
                        <div style={{ height: 2, background: alpha(theme.muted, 0.25) }}>
                          <div style={{ width: `${rsvp.stats.total ? Math.round((rsvp.stats.responded / rsvp.stats.total) * 100) : 0}%`, height: '100%', background: ACC }} />
                        </div>
                      </div>
                      <div style={{ padding: '8px 0 4px' }}>
                        {[
                          { l: 'İştirak edəcək', v: rsvp.stats.going,    c: HEAD },
                          { l: 'Gəlməyəcək',     v: rsvp.stats.notGoing, c: theme.muted },
                          { l: 'Əlavə qonaq',    v: rsvp.stats.extra,    c: ACC },
                        ].map(({ l, v, c }) => (
                          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 16px' }}>
                            <span style={{ fontSize: 10, color: theme.muted }}>{l}</span>
                            <span style={{ fontFamily: serif, fontSize: 22, color: c }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Reveal>
              </section>
            )}

            {/* 12 — QONAQ DƏFTƏRİ */}
            <section style={sectionStyle(8)}>
              <Reveal style={inner} motionStyle={D.motion}>
                <SectionHead kicker="Guestbook" title={gbook.labels.title} theme={theme} design={D} serif={serif} />
                <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 18, textAlign: 'left' }}>
                  <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbook.labels.namePh} style={inputStyle} />
                  <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbook.labels.msgPh} rows={3}
                    style={{ ...inputStyle, borderRadius: D.radius, resize: 'none' }} />
                  <button type="submit" disabled={!gbook.canSubmit} style={{
                    minHeight: 46, border: 'none', borderRadius: D.buttonRadius, background: CTA_BG,
                    color: CTA_TXT, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed',
                    fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase', fontFamily: sans,
                    opacity: gbook.canSubmit ? 1 : 0.35,
                  }}>{gbook.sending ? gbook.labels.sending : gbook.labels.btn}</button>
                </form>

                <div style={{ display: 'grid', gap: 10, textAlign: 'left' }}>
                  {gbook.messages.map((raw, i) => {
                    const m = gbook.readMessage(raw)
                    return (
                      <div key={m.name + i} style={{
                        background: D.dark ? 'transparent' : theme.surface,
                        borderLeft: D.dark ? `1px solid ${alpha(theme.accent, 0.35)}` : 'none',
                        borderRadius: D.dark ? 0 : D.radius,
                        padding: D.dark ? '6px 0 6px 14px' : 16,
                      }}>
                        <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 15, color: theme.text, lineHeight: 1.65 }}>“{m.text}”</div>
                        <div style={{ fontSize: 11, color: theme.muted, marginTop: 8 }}>
                          — {m.name}{m.date ? ` · ${gbook.formatDate(m.date)}` : ''}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Reveal>
            </section>

            {/* 13 — FOOTER */}
            <footer style={{
              padding: 'clamp(34px, 9vw, 44px) clamp(18px, 6vw, 26px) clamp(44px, 11vw, 56px)',
              textAlign: 'center', background: theme.footerBg, borderTop: `1px solid ${alpha(theme.accent, 0.18)}`,
            }}>
              <div style={{ fontFamily: serif, fontStyle: D.headingStyle, fontSize: 'clamp(17px, 5vw, 19px)', color: theme.footerText, letterSpacing: '.04em' }}>
                {isCouple ? (
                  <>{weddingData.brideName}<span style={{ opacity: 0.4, margin: '0 10px' }}>&</span>{weddingData.groomName}</>
                ) : (weddingData.eventName || weddingData.brideName)}
              </div>
              <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: alpha(theme.footerText, 0.5), marginTop: 10 }}>
                {formatFullDateByLang(weddingData.date, lang)}
              </div>
              <div style={{ width: 100, height: 1, background: alpha(theme.footerText, 0.25), margin: '20px auto' }} />
              <div style={{ fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: alpha(theme.footerText, 0.4) }}>
                Digitoy.az ilə hazırlanıb
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { alpha }
