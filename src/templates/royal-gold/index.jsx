import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import LoveStorySection from '../_shared/LoveStorySection'
import { getStoryTheme } from '../_shared/loveStoryTheme'
import MapSection from '../_shared/MapSection'
import { directionsUrl, openMapUrl } from '../_shared/geo'
import { OrderCta, MusicStartBubble } from '../_shared/TemplateActions'
import TemplateOutro from '../_shared/TemplateOutro'
import { getTemplateTheme, FONT_STACKS } from '../templateConfig'
import { buildPresetMusic, PRESET_TRACKS, MUSIC_PLAY_MODES, shouldAutoPlay } from '../../data/music'
import { getSectionVisibility } from '../../data/sections'
import { formatAzDate, formatTime24, dateParts } from '../../utils/dateFormat'
import { unlockAudio } from '../../utils/audioUnlock'
import { trackEvent } from '../../utils/analytics'
import { Reveal, PopDigit, enterDirection } from '../_shared/motion'
import { hidePhoto } from '../../utils/photoGallery'
import { useCountdown } from '../../hooks/useCountdown'
import { useTimeline } from '../../hooks/useTimeline'
import { useSeating } from '../../hooks/useSeating'
import { useRsvp } from '../../hooks/useRsvp'
import { useGuestbook } from '../../hooks/useGuestbook'
import { useGallery } from '../../hooks/useGallery'
import { useMusicPlayer } from '../../hooks/useMusicPlayer'
import { useMusicPrompt } from '../../hooks/useMusicPrompt'
import t from '../../data/translations'
import { mergeSectionLabels, withStringOverrides, makeLabelResolver, sectionHead } from '../../data/adminOverrides'
import { makeOpeningText, phrase } from '../_shared/openingSpec'
import { MonoContent } from '../_shared/MonoContent'
import { Rosette, RosetteMark, GuillocheBand, ChronoDial, CoinLegend } from './guilloche'
import { FOIL } from './foil'

/* ─────────────────────────────────────────────────────────────────────────────
   ROYAL GOLD LUXURY — «Qızıl gravür» (premium redizayn, 2026-10)

   Konsept: suveren qızılın vizual dili — sikkə, banknot və saat siferblatı.
   Hər qızıl element ya HƏKK OLUNUB (guilloche xətləri), ya da FOLQADIR
   (metal qradiyent). Parlayan ləkə, uçan zərrəcik, bulanıq halo YOXDUR.

   Bölmələrin şablona məxsus forması:
     açılış     → sikkə-medalyon: guilloche rozeti xətt-xətt həkk olunur,
                  kənarında «Anno …» və tədbir adı sikkə yazısı kimi
     hero       → gravür sertifikat: ikiqat çərçivə, banknot lenti,
                  klassik dəvətnamə tarix bloku («Şənbə | 13 | Mart»)
     sayğac     → xronoqraf: siferblat + addımlayan saniyə əqrəbi + 3 alt-siferblat
     məkan      → banknot halqası içində dairəvi xəritə
     proqram    → ziyafət menyu kartı (nöqtəli xətlə saat)
     masa       → fil sümüyü yer kartı (escort card)
     RSVP       → fil sümüyü cavab kartı (reply card)
   Düzülüş simmetrik və mərkəzdədir — rəsmi mərasim.

   Palitra: lak qara #0B0906 · qızıl #C5A059 · şampan #E8D5A3 · fil sümüyü
   #F4EAD5. Şriftlər: Noto Serif Display (gravür başlıq) · Hanken Grotesk
   (mətn) · Ballet (yalnız «&» — mis qələm kalliqrafiyası).

   ⚠ Bu fayl YALNIZ UI qatıdır — bütün biznes məntiqi hook-lardadır.
   Funksiyalar (RSVP, masa axtarışı, qonaq dəftəri, foto QR, xəritə,
   musiqi, dil, admin override-ları) əvvəlki ilə EYNİ hook-ları çağırır.
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('royal-gold')
const DEFAULT_MUSIC = buildPresetMusic(PRESET_TRACKS[0], { playMode: MUSIC_PLAY_MODES.AUTO })

const display = TH.fonts.heading
const sans    = TH.fonts.body
const script  = FONT_STACKS.ballet

/* Fil sümüyü kart (yer kartı, cavab kartı) */
const IVORY    = 'linear-gradient(162deg, #F8F0DF 0%, #F1E6CC 55%, #E7D7B4 100%)'
const INK      = '#2A2012'
const INK_SOFT = '#6B5A40'
const BRONZE   = '#8A6A2E'
const LINE     = 'rgba(197,160,89,.42)'

/* Folqa mətn — fon mətnin formasına kəsilir */
const foil = {
  background: FOIL, backgroundSize: '200% 100%',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: TH.accent,
}

/* Şablona məxsus keyframe-lər — prefiks `rg-` */
const KEYFRAMES = `
@keyframes rg-draw  { to { stroke-dashoffset: 0 } }
@keyframes rg-fade  { from { opacity: 0 } to { opacity: 1 } }
@keyframes rg-rise  { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes rg-spin  { to { transform: rotate(360deg) } }
@keyframes rg-sheen { from { background-position: 100% 0 } to { background-position: 0% 0 } }
@keyframes rg-line  { from { transform: scaleX(0) } to { transform: scaleX(1) } }
@keyframes rg-eq    { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
@keyframes rg-cue   { 0% { transform: scaleY(0); transform-origin: top } 45% { transform: scaleY(1); transform-origin: top }
                      55% { transform: scaleY(1); transform-origin: bottom } 100% { transform: scaleY(0); transform-origin: bottom } }
@keyframes rg-breathe { 0%,100% { opacity: .45 } 50% { opacity: .9 } }

[data-rg] ::placeholder { color: rgba(198,181,156,.55); }
[data-rg] .rg-card ::placeholder { color: rgba(42,32,18,.42); }
[data-rg] input:focus-visible, [data-rg] textarea:focus-visible { border-color: #E8D5A3 !important; outline: none; }
[data-rg] .rg-card input:focus-visible { border-color: ${INK} !important; }
[data-rg] button:focus-visible, [data-rg] a:focus-visible, [data-rg] [role="button"]:focus-visible { outline: 1px solid #E8D5A3; outline-offset: 3px; }
[data-rg] .rg-card button:focus-visible { outline-color: ${INK}; }

@media (prefers-reduced-motion: reduce) {
  [data-rg] *, [data-rg] { animation: none !important; transition: none !important; }
  [data-rg] use, [data-rg] circle { stroke-dashoffset: 0 !important; }
}
`

/* ═══════════════════════════════════════════════════════════════════════════
   01 — AÇILIŞ: sikkə-medalyon

   Ardıcıllıq bir torna kəsimi kimi gedir: qara lak → guilloche rozeti xətt-xətt
   həkk olunur (≈2.3 s) → mərkəz diski və sikkə yazıları → monoqram folqa ilə
   → adlar → «Dəvəti aç». Toxunanda medalyon fırlanaraq kameraya yaxınlaşır
   (siferblatın içindən keçirik) və dəvətnamə açılır.

   ⚠ `onOpenStart` MÜTLƏQ toxunuş hadisəsinin içində çağırılır (iOS musiqi).
   ═══════════════════════════════════════════════════════════════════════════ */
function CoinOpening({ weddingData, isCouple, isCorp, ot, onOpen, onOpenStart }) {
  const [opening, setOpening] = useState(false)
  const [gone, setGone] = useState(false)

  /* Admin adları öz mətni ilə əvəz edibsə tək sətir, yoxsa «Ad & Ad» */
  const titleOv = ot.override('title')
  const first = titleOv !== undefined
    ? titleOv
    : (isCouple ? (weddingData.groomName || '') : (weddingData.eventName || weddingData.brideName || ''))
  const second = titleOv !== undefined ? '' : (isCouple ? (weddingData.brideName || '') : '')
  const anno = ot.text('sub')
  const kicker = ot.show('kicker') ? ot.text('kicker') : ''
  const isImage = ot.mono.kind === 'image'

  const start = () => {
    if (opening) return
    unlockAudio()
    /* ⚠ Musiqi toxunuşun İÇİNDƏ başlayır — `onOpen` 1.4 s sonra gəlir və o
       vaxt brauzerin jest pəncərəsi bağlı olur. */
    onOpenStart?.()
    setOpening(true)
    setTimeout(() => { setGone(true); onOpen() }, 1400)
  }

  if (gone) return null

  return (
    <motion.div
      onClick={start}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); start() } }}
      aria-label={isCorp ? phrase('open', ot.lang) : phrase('openSeal', ot.lang)}
      data-rg
      animate={opening ? { opacity: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.75, ease: 'easeOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden',
        background: `radial-gradient(120% 70% at 50% 38%, #17110A 0%, ${TH.background} 62%, #050403 100%)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: sans, padding: '0 22px', textAlign: 'center',
      }}
    >
      {/* Medalyon — açılışda həkk olunur, toxunanda kameraya yaxınlaşır */}
      <motion.div
        animate={opening ? { scale: 5.2, rotate: 28, opacity: 0 } : {}}
        transition={{ duration: 1.25, ease: [0.7, 0, 0.84, 0] }}
        style={{ position: 'relative', width: 'min(84vw, 340px)', aspectRatio: '1', flex: '0 0 auto' }}
      >
        <div style={{ position: 'absolute', inset: 0, animation: 'rg-spin 160s linear 2.6s infinite' }}>
          <Rosette size="100%" draw delay={0.15} />
        </div>

        {/* Mərkəz diski + sikkə yazıları */}
        <svg viewBox="-170 -170 340 340" aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', animation: 'rg-fade 1s ease-out 1.5s both' }}>
          <circle r="72" fill="#0B0906" stroke="#C5A059" strokeWidth="1" />
          <circle r="66" fill="none" stroke="#C5A059" strokeOpacity=".35" strokeWidth=".6" />
          <CoinLegend r={55} text={anno} lang={ot.lang} position="top" font={sans} />
          <CoinLegend r={62} text={kicker} lang={ot.lang} position="bottom" font={sans} />
        </svg>

        {/* Monoqram — folqa ilə; admin şəkil/stiker/mətn seçə bilər */}
        <div style={{
          position: 'absolute', left: '33%', top: '33%', width: '34%', height: '34%',
          borderRadius: '50%', overflow: isImage ? 'hidden' : 'visible',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'rg-rise 1s cubic-bezier(.22,.61,.36,1) 2.05s both',
        }}>
          <span style={{
            fontFamily: display, fontStyle: 'italic', fontWeight: 400, whiteSpace: 'nowrap',
            fontSize: 'clamp(24px, 7.6vw, 31px)', lineHeight: 1, letterSpacing: '.02em',
            width: isImage ? '100%' : undefined, height: isImage ? '100%' : undefined,
            ...(isImage ? {} : foil),
          }}>
            <MonoContent mono={ot.mono} />
          </span>
        </div>
      </motion.div>

      <motion.div
        animate={opening ? { opacity: 0, y: 18 } : {}}
        transition={{ duration: 0.5, ease: 'easeIn' }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {titleOv !== '' && (
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'center', flexWrap: 'wrap',
            columnGap: 12, marginTop: 'clamp(26px, 6vh, 40px)', maxWidth: 360,
            fontFamily: display, fontWeight: 300, fontSize: 'clamp(30px, 9.4vw, 40px)', lineHeight: 1.08,
            animation: 'rg-rise 1s cubic-bezier(.22,.61,.36,1) 2.5s both',
          }}>
            <span style={foil}>{first}</span>
            {second && (
              <>
                <span style={{ fontFamily: script, fontSize: '1.08em', color: TH.primary, lineHeight: 0.8 }}>&amp;</span>
                <span style={foil}>{second}</span>
              </>
            )}
          </div>
        )}

        {ot.show('meta') && (
          <div style={{
            marginTop: 14, fontSize: 13, letterSpacing: '.04em', color: TH.muted, maxWidth: 320,
            animation: 'rg-rise .9s ease-out 2.85s both',
          }}>
            {ot.text('meta')}
          </div>
        )}

        {ot.show('cta') && (
          <div style={{ marginTop: 'clamp(26px, 5vh, 38px)', animation: 'rg-rise .9s ease-out 3.25s both' }}>
            <div style={{ fontFamily: display, fontStyle: 'italic', fontSize: 19, color: TH.accent, letterSpacing: '.01em' }}>
              {ot.text('cta')}
            </div>
            <div aria-hidden="true" style={{
              height: 1, marginTop: 8, background: FOIL,
              transformOrigin: '50% 50%', animation: 'rg-line 1.1s cubic-bezier(.22,.61,.36,1) 3.5s both',
            }} />
          </div>
        )}
      </motion.div>

      {ot.show('hint') && (
        <div style={{
          position: 'absolute', left: 0, right: 0,
          bottom: 'calc(28px + env(safe-area-inset-bottom, 0px))',
          fontSize: 11.5, letterSpacing: '.18em', color: TH.muted,
          animation: 'rg-fade .8s ease-out 4s both, rg-breathe 3.2s ease-in-out 4.8s infinite',
        }}>
          {ot.text('hint')}
        </div>
      )}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MUSİQİ — folqa halqalı dairə, içində ekvalayzer
   ═══════════════════════════════════════════════════════════════════════════ */
function GoldMusic({ lang, music, playerRef, visible = false, autoPlay = false }) {
  const { audioProps, playing, play, pause, toggle, hasMusic } = useMusicPlayer({
    lang, music, autoStart: visible && autoPlay,
  })

  useEffect(() => {
    if (playerRef) playerRef.current = { play, pause }
  })

  /* Bubble: açılışdan 900ms sonra çıxır, İLK SCROLL-da və ya toxunanda gedir */
  const [prompt, dismissPrompt] = useMusicPrompt({ enabled: visible && hasMusic })

  if (!hasMusic) return null

  return (
    <>
      {/* ⚠ <audio> açılışdan ƏVVƏL də mount olunur ki, toxunuşda play()
          sinxron çağırıla bilsin (iOS Safari). Görünən yalnız UI-dır. */}
      <audio {...audioProps} />
      {!visible ? null : (
        <>
          <MusicStartBubble
            theme={TH} lang={lang} visible={prompt} playing={playing}
            onStart={() => { if (!playing) play(); dismissPrompt() }}
          />
          <button
            onClick={toggle}
            data-press
            aria-label={playing ? 'Musiqini dayandır' : 'Musiqini başlat'}
            style={{
              position: 'fixed',
              bottom: 'calc(max(20px, env(safe-area-inset-bottom, 20px)) + var(--dt-preview-offset, 0px))',
              right: 20, zIndex: 55, width: 48, height: 48, borderRadius: '50%', padding: 0,
              border: 'none', cursor: 'pointer', background: FOIL,
              boxShadow: '0 10px 24px rgba(0,0,0,.55)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{
              position: 'absolute', inset: 1.5, borderRadius: '50%', background: '#0F0C08',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
            }}>
              {[0, 0.18, 0.36].map((d) => (
                <span key={d} style={{
                  width: 2, height: 13, background: playing ? TH.accent : `${TH.muted}99`,
                  transformOrigin: 'bottom', display: 'block',
                  animation: playing ? `rg-eq 1s ease-in-out ${d}s infinite` : 'none',
                  transform: playing ? undefined : 'scaleY(.45)',
                }} />
              ))}
            </span>
          </button>
        </>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   LÖVHƏ — hər bölmənin qabı: banknot lenti + rozet emblemi + başlıq.
   `kicker` YALNIZ admin yazanda görünür (şablonun öz ingiliscə üst yazısı
   yoxdur — başlığı rozet emblemi daşıyır).
   ═══════════════════════════════════════════════════════════════════════════ */
function PlateHead({ title, kicker, sub }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 30 }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
        <RosetteMark size={30} />
      </div>
      {title && (
        <h2 style={{
          fontFamily: display, fontStyle: 'italic', fontWeight: 300, margin: 0,
          fontSize: 'clamp(28px, 8.4vw, 34px)', lineHeight: 1.15, color: TH.accent,
        }}>
          {title}
        </h2>
      )}
      {kicker && (
        <div style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: TH.primary, marginTop: 10 }}>
          {kicker}
        </div>
      )}
      {sub && (
        <p style={{ fontSize: 13.5, color: TH.muted, margin: '10px auto 0', maxWidth: 300, lineHeight: 1.6 }}>{sub}</p>
      )}
    </div>
  )
}

function Plate({ id, section, title, kicker, sub, children, style = {} }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '52px 24px 64px', ...style }}>
      <GuillocheBand width="min(64%, 240px)" opacity={0.55} style={{ marginBottom: 44 }} />
      <Reveal style={{ maxWidth: 480, margin: '0 auto' }}>
        {(title || kicker || sub) && <PlateHead title={title} kicker={kicker} sub={sub} />}
        {children}
      </Reveal>
    </section>
  )
}

/* Düymələr — folqa (əsas) və gravür kontur (ikinci dərəcəli) */
const btn = (filled) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  minHeight: 46, padding: '12px 20px', textDecoration: 'none', cursor: 'pointer',
  fontFamily: sans, fontSize: 13, fontWeight: 500, letterSpacing: '.04em',
  background: filled ? FOIL : 'transparent',
  color: filled ? '#1A1408' : TH.accent,
  border: filled ? 'none' : `1px solid ${LINE}`,
})

/* Tünd fonda sətir sahəsi — yalnız alt xətt (qələm xətti) */
const lineInput = {
  width: '100%', background: 'transparent', border: 'none', borderRadius: 0,
  borderBottom: `1px solid ${LINE}`, padding: '12px 6px',
  fontFamily: display, fontStyle: 'italic', fontSize: 19, color: TH.accent, outline: 'none',
}

/* Fil sümüyü kart qabı */
function IvoryCard({ children, style = {} }) {
  return (
    <div className="rg-card" style={{
      position: 'relative', background: IVORY, color: INK, textAlign: 'center',
      boxShadow: '0 26px 56px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.55)',
      ...style,
    }}>
      <span aria-hidden="true" style={{ position: 'absolute', inset: 7, border: `1px solid ${BRONZE}73`, pointerEvents: 'none' }} />
      <span aria-hidden="true" style={{ position: 'absolute', inset: 10, border: `1px solid ${BRONZE}2E`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  )
}

/* Təklif siyahısı (masa və RSVP axtarışı) */
function SuggestList({ id, items, activeIdx, setActiveIdx, onPick, light = false, showTable = true }) {
  if (!items.length) return null
  return (
    <ul id={id} role="listbox" style={{
      listStyle: 'none', margin: '8px 0 0', padding: 4, textAlign: 'left',
      background: light ? '#EFE4CB' : TH.surface,
      border: `1px solid ${light ? '#C9B48A' : LINE}`,
      maxHeight: 280, overflowY: 'auto',
    }}>
      {items.map((g, i) => (
        <li
          key={g.id ?? `${g.full_name}-${i}`}
          role="option"
          aria-selected={i === activeIdx}
          onMouseEnter={() => setActiveIdx(i)}
          onMouseDown={(e) => { e.preventDefault(); onPick(g) }}
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
            padding: '12px 14px', cursor: 'pointer',
            background: i === activeIdx ? (light ? 'rgba(138,106,46,.14)' : 'rgba(197,160,89,.12)') : 'transparent',
          }}
        >
          <span style={{ fontSize: 14, color: light ? INK : TH.text }}>{g.full_name}</span>
          {showTable && g.table_id && (
            <span style={{ fontSize: 12, letterSpacing: '.06em', color: light ? BRONZE : TH.primary, whiteSpace: 'nowrap' }}>{g.table_id}</span>
          )}
        </li>
      ))}
    </ul>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function RoyalGoldTemplate({
  lang, setLang, weddingData, onBack, isDemoMode = false, initialGuestbook,
  /* Phase 45 — admin override-ları və admin önbaxışında açılışı atlamaq */
  adminOverrides = null, startOpened = false,
}) {
  const adminStrings = adminOverrides?.strings || null
  const tr = withStringOverrides(t[lang] || t.az, adminStrings, lang)
  const L = makeLabelResolver(mergeSectionLabels(null, adminOverrides), lang)
  const [opened, setOpened] = useState(startOpened)
  const musicRef = useRef(null)

  const isCouple = ['toy', 'nishan'].includes(weddingData.eventType)
  const dirUrl = directionsUrl(weddingData)
  const mapUrl = openMapUrl(weddingData)
  const isCorp   = ['corporate', 'other'].includes(weddingData.eventType)

  const eventLabels = {
    toy: tr.event_toy, nishan: tr.event_nishan,
    birthday: tr.event_birthday, corporate: tr.event_corporate,
    other: weddingData.eventName || tr.event_other,
  }
  const eventLabel = eventLabels[weddingData.eventType] || tr.event_toy
  const ot = makeOpeningText(
    'royal-gold', { weddingData, lang, isCouple, isCorp, eventLabel }, adminOverrides?.opening || null,
  )

  const activePkgId = isDemoMode ? 'PREMIUM' : (weddingData.package || 'SADE')

  /* Bölmə görünürlüyü: paket icazəsi AND cütlüyün seçimi */
  const S = getSectionVisibility(weddingData, activePkgId)
  const canShowSeating = S.seating
  const canShowGallery = S.gallery
  const canShowRsvp    = S.rsvp

  const invMusic  = S.music ? (weddingData?.music || DEFAULT_MUSIC) : null
  const autoPlay  = shouldAutoPlay(invMusic)

  /* ── Hook-lar: bütün biznes məntiqi ── */
  const cd       = useCountdown({ date: weddingData.date, time: weddingData.time, lang, eventType: weddingData.eventType, eventName: weddingData.eventName })
  const timeline = useTimeline({ lang, eventType: weddingData.eventType, programSteps: weddingData.programSteps })
  const { inputRef: seatInputRef, ...seating } = useSeating({ seatingPlan: weddingData.seatingPlan, lang })
  const { inputRef: rsvpInputRef, ...rsvp }    = useRsvp({ lang, weddingData })
  const gbook    = useGuestbook({ lang, initialMessages: initialGuestbook })
  const gallery  = useGallery({ weddingData, isCouple, isCorp })
  const rsvpL    = withStringOverrides(rsvp.labels,    adminStrings, lang, 'rsvp.')
  const gbookL   = withStringOverrides(gbook.labels,   adminStrings, lang, 'gbook.')
  const seatingL = withStringOverrides(seating.labels, adminStrings, lang, 'seating.')
  const heroTitle = L('hero', 'title', null)

  useEffect(() => {
    if (!isDemoMode) trackEvent('invitation_opened', { lang, event_type: weddingData?.eventType })
  }, [])

  const { formattedDate, dayName } = formatAzDate(weddingData.date, lang)
  const dp = dateParts(weddingData.date, lang)
  const time = weddingData.time ? formatTime24(weddingData.time) : ''
  /* Bölmə üst yazısı — yalnız admin yazıbsa (bax PlateHead) */
  const K = (key) => L(key, 'kicker', null)
  const MAP_BOX = 'min(80vw, 320px)'

  return (
    <div
      data-rg
      data-enter={enterDirection('royal-gold')}
      style={{
        background: TH.background, minHeight: '100vh', fontFamily: sans, color: TH.text,
        overflowX: 'hidden', position: 'relative', isolation: 'isolate',
        '--tpl-glow': `${TH.primary}47`,
      }}
    >
      <style>{KEYFRAMES}</style>

      {/* 01 — AÇILIŞ */}
      {!opened && (
        <CoinOpening
          weddingData={weddingData}
          isCouple={isCouple}
          isCorp={isCorp}
          ot={ot}
          onOpen={() => setOpened(true)}
          onOpenStart={autoPlay ? () => musicRef.current?.play() : undefined}
        />
      )}

      {/* 03 — MUSİQİ */}
      <GoldMusic lang={lang} music={invMusic} playerRef={musicRef} visible={opened} autoPlay={autoPlay} />

      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            {/* 02 — BAŞLIQ ZOLAĞI */}
            <header style={{
              position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(11,9,6,.86)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            }}>
              <button
                onClick={onBack}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
                  fontSize: 13, color: TH.muted, cursor: 'pointer', fontFamily: sans,
                  minHeight: 44, padding: '0 8px 0 0',
                }}
              >
                <span aria-hidden="true">←</span>{tr.btn_back}
              </button>
              <div style={{ fontFamily: display, fontStyle: 'italic', fontSize: 16, color: TH.accent, letterSpacing: '.01em' }}>
                Digitoy
              </div>
              <LanguageSwitcher lang={lang} setLang={setLang} theme={TH} />
              <span aria-hidden="true" style={{
                position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, opacity: 0.35,
                background: `linear-gradient(90deg, transparent, ${TH.primary}, transparent)`,
              }} />
            </header>

            {/* 04 — HERO: gravür sertifikat */}
            <section style={{
              position: 'relative', minHeight: 'calc(100svh - 52px)', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '64px 26px 84px', textAlign: 'center',
              background: `radial-gradient(90% 60% at 50% 45%, #15100A, ${TH.background} 72%)`,
            }}>
              <div aria-hidden="true" style={{
                position: 'absolute', left: '50%', top: '46%', width: 'min(150vw, 660px)',
                transform: 'translate(-50%,-50%)', pointerEvents: 'none',
              }}>
                <Rosette size="100%" opacity={0.075} />
              </div>
              <span aria-hidden="true" style={{ position: 'absolute', inset: 12, border: `1px solid ${TH.primary}52`, pointerEvents: 'none' }} />
              <span aria-hidden="true" style={{ position: 'absolute', inset: 17, border: `1px solid ${TH.primary}24`, pointerEvents: 'none' }} />
              <GuillocheBand width="min(62%, 260px)" opacity={0.75} style={{ position: 'absolute', top: 30, left: 0, right: 0 }} />
              <GuillocheBand width="min(62%, 260px)" opacity={0.75} style={{ position: 'absolute', bottom: 30, left: 0, right: 0 }} />

              <div style={{ position: 'relative', maxWidth: 440, width: '100%' }}>
                <div style={{ fontSize: 11, letterSpacing: '.34em', textTransform: 'uppercase', color: `${TH.accent}CC` }}>
                  {L('hero', 'kicker', eventLabel)}
                </div>
                <p style={{
                  fontFamily: display, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.55,
                  color: TH.muted, maxWidth: 300, margin: '16px auto 0',
                }}>
                  {tr.inv_join}
                </p>

                <h1 style={{ margin: '26px 0 0', fontWeight: 300, lineHeight: 1 }}>
                  {heroTitle ? (
                    <span style={{ ...foil, fontFamily: display, fontSize: 'clamp(40px, 12vw, 58px)', display: 'block', animation: 'rg-sheen 3.4s ease-out .4s 1 both' }}>{heroTitle}</span>
                  ) : isCouple ? (
                    <>
                      <span style={{ ...foil, fontFamily: display, fontSize: 'clamp(44px, 14.5vw, 66px)', display: 'block', animation: 'rg-sheen 3.4s ease-out .4s 1 both' }}>
                        {weddingData.groomName}
                      </span>
                      <span style={{ fontFamily: script, fontSize: 'clamp(38px, 11vw, 52px)', color: TH.primary, display: 'block', lineHeight: 1, margin: '2px 0 0' }}>&amp;</span>
                      <span style={{ ...foil, fontFamily: display, fontSize: 'clamp(44px, 14.5vw, 66px)', display: 'block', animation: 'rg-sheen 3.4s ease-out .7s 1 both' }}>
                        {weddingData.brideName}
                      </span>
                    </>
                  ) : (
                    <span style={{ ...foil, fontFamily: display, fontSize: 'clamp(40px, 12vw, 58px)', display: 'block' }}>
                      {weddingData.eventName || weddingData.brideName}
                    </span>
                  )}
                </h1>

                {isCorp && weddingData.organizer?.trim() && (
                  <div style={{ fontSize: 13, color: TH.muted, marginTop: 14 }}>
                    {tr.organizer_display}: {weddingData.organizer}
                  </div>
                )}

                {/* Klassik dəvətnamə tarix bloku: Şənbə | 13 | Mart */}
                {dp ? (
                  <div style={{ marginTop: 38 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', columnGap: 16 }}>
                      <div style={{
                        textAlign: 'right', fontFamily: display, fontStyle: 'italic', fontSize: 17, color: TH.accent,
                        borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, padding: '8px 0', lineHeight: 1.25,
                      }}>{dp.weekday}</div>
                      <div style={{ ...foil, fontFamily: display, fontWeight: 300, fontSize: 'clamp(56px, 18vw, 76px)', lineHeight: 0.9, fontVariantNumeric: 'lining-nums' }}>
                        {dp.day}
                      </div>
                      <div style={{
                        textAlign: 'left', fontFamily: display, fontStyle: 'italic', fontSize: 17, color: TH.accent,
                        borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, padding: '8px 0', lineHeight: 1.25,
                      }}>{dp.month}</div>
                    </div>
                    <div style={{ marginTop: 14, fontSize: 12, letterSpacing: '.42em', color: TH.muted, paddingLeft: '.42em' }}>{dp.year}</div>
                    {time && time !== '—' && (
                      <div style={{ marginTop: 8, fontFamily: display, fontSize: 22, color: TH.accent }}>{time}</div>
                    )}
                  </div>
                ) : (
                  <div style={{ marginTop: 30, fontSize: 14, color: TH.muted }}>
                    {formattedDate}{dayName ? ` · ${dayName}` : ''}{time ? ` · ${time}` : ''}
                  </div>
                )}

                {weddingData.venueName && (
                  <div style={{ marginTop: 26, fontFamily: display, fontStyle: 'italic', fontSize: 18, color: TH.text, lineHeight: 1.4 }}>
                    {weddingData.venueName}
                  </div>
                )}
              </div>

              <span aria-hidden="true" style={{
                position: 'absolute', left: '50%', bottom: 54, width: 1, height: 34, marginLeft: -0.5,
                background: `linear-gradient(180deg, ${TH.primary}, transparent)`,
                animation: 'rg-cue 2.8s cubic-bezier(.6,0,.4,1) 1.4s infinite',
              }} />
            </section>

            {/* 05 — SAYĞAC: xronoqraf */}
            {S.countdown && (
              <Plate title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
                <div style={{ position: 'relative', width: 'min(78vw, 300px)', aspectRatio: '1', margin: '0 auto' }}>
                  <ChronoDial size="100%" seconds={cd.seconds} />
                  <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ ...foil, fontFamily: display, fontWeight: 300, fontSize: 'clamp(54px, 17vw, 70px)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                      <PopDigit value={cd.days} />
                    </div>
                    <div style={{ marginTop: 8, fontSize: 11.5, letterSpacing: '.28em', textTransform: 'uppercase', color: TH.muted, paddingLeft: '.28em' }}>
                      {cd.labels.days}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(12px, 5vw, 24px)', marginTop: 28 }}>
                  {[
                    { v: cd.hours, l: cd.labels.hours },
                    { v: cd.minutes, l: cd.labels.minutes },
                    { v: cd.seconds, l: cd.labels.seconds, pop: true },
                  ].map(({ v, l, pop }) => (
                    <div key={l} style={{
                      width: 76, height: 76, borderRadius: '50%',
                      border: `1px solid ${TH.primary}80`,
                      boxShadow: `inset 0 0 0 4px ${TH.background}, inset 0 0 0 5px ${TH.primary}2E`,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontFamily: display, fontSize: 25, lineHeight: 1, color: TH.accent, fontVariantNumeric: 'tabular-nums' }}>
                        <PopDigit value={v} pop={pop} />
                      </span>
                      <span style={{ fontSize: 9.5, letterSpacing: '.14em', textTransform: 'uppercase', color: TH.muted, marginTop: 5 }}>{l}</span>
                    </div>
                  ))}
                </div>
              </Plate>
            )}

            {/* 05b — BİZİM HEKAYƏMİZ (default bağlıdır — data/sections.js) */}
            {S.lovestory && Array.isArray(weddingData.loveStory) && weddingData.loveStory.length > 0 && (
              <section data-section="lovestory" style={{ padding: 'clamp(48px,12vw,64px) 22px clamp(56px,14vw,80px)', background: getStoryTheme('royal-gold').bg }}>
                <GuillocheBand width="min(64%, 240px)" opacity={0.55} style={{ marginBottom: 36 }} />
                <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                  <LoveStorySection
                    story={weddingData.loveStory} templateId="royal-gold" lang={lang}
                    copyOverrides={adminOverrides?.story?.text || null}
                  />
                </Reveal>
              </section>
            )}

            {/* 06 — MƏKAN: banknot halqası içində dairəvi xəritə */}
            {S.venue && (
              <Plate title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
                <div style={{ position: 'relative', width: MAP_BOX, aspectRatio: '1', margin: '0 auto' }}>
                  <Rosette size="100%" rose={false} inner={false} stroke={0.7} style={{ position: 'absolute', inset: 0 }} />
                  <div style={{
                    position: 'absolute', left: '50%', top: '50%', width: '82%', height: '82%',
                    transform: 'translate(-50%,-50%)', borderRadius: '50%', overflow: 'hidden',
                    boxShadow: `0 0 0 1px ${TH.primary}66, 0 18px 40px rgba(0,0,0,.6)`,
                  }}>
                    <MapSection
                      weddingData={weddingData}
                      theme={TH}
                      accent={TH.primary}
                      height={`calc(${MAP_BOX} * .82)`}
                      map={{ opacity: 0.6, filter: 'grayscale(1) brightness(.42) contrast(1.2)', tintOpacity: 0.42 }}
                      frame={<MapPin />}
                      fallback={(
                        <div style={{
                          height: `calc(${MAP_BOX} * .82)`, position: 'relative',
                          background: 'radial-gradient(circle, #1E170D, #0E0B07 70%)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span aria-hidden="true" style={{
                            position: 'absolute', inset: 0, opacity: 0.22,
                            backgroundImage: `linear-gradient(${TH.primary}59 1px, transparent 1px), linear-gradient(90deg, ${TH.primary}59 1px, transparent 1px)`,
                            backgroundSize: '22px 22px',
                          }} />
                          <MapPin />
                        </div>
                      )}
                    />
                  </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: 24, fontFamily: display, fontSize: 24, lineHeight: 1.3, color: TH.accent }}>
                  {weddingData.venueName}
                </div>
                {weddingData.venueNote && (
                  <div style={{ textAlign: 'center', marginTop: 6, fontSize: 13.5, color: TH.muted, lineHeight: 1.55 }}>
                    {weddingData.venueNote}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {dirUrl && <a data-press href={dirUrl} target="_blank" rel="noopener noreferrer" style={btn(true)}>{tr.inv_directions_btn}</a>}
                  {mapUrl && <a data-press href={mapUrl} target="_blank" rel="noopener noreferrer" style={btn(!dirUrl)}>Maps</a>}
                  {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Waze</a>}
                  {weddingData.appleMapsUrl && (
                    <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Apple</a>
                  )}
                </div>
              </Plate>
            )}

            {/* 07 — PROQRAM: ziyafət menyu kartı */}
            {S.program && (
              <Plate title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
                <div style={{
                  position: 'relative', padding: '26px 22px 22px',
                  border: `1px solid ${TH.primary}66`, outline: `1px solid ${TH.primary}24`, outlineOffset: 5,
                  background: 'linear-gradient(180deg, rgba(197,160,89,.055), rgba(197,160,89,.015))',
                }}>
                  {timeline.events.map((ev, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-end', gap: 10, padding: '12px 0',
                      borderTop: i ? `1px solid ${TH.primary}14` : 'none',
                    }}>
                      <span style={{ fontFamily: display, fontSize: 18.5, lineHeight: 1.3, color: TH.text, flex: '0 1 auto', textAlign: 'left' }}>
                        {ev.label}
                      </span>
                      <span aria-hidden="true" style={{
                        flex: '1 1 18px', minWidth: 18, marginBottom: 6,
                        borderBottom: `1px dotted ${TH.primary}8C`,
                      }} />
                      <span style={{ fontSize: 13.5, letterSpacing: '.06em', color: TH.primary, fontVariantNumeric: 'tabular-nums', flex: '0 0 auto' }}>
                        {ev.time}
                      </span>
                    </div>
                  ))}
                </div>
              </Plate>
            )}

            {/* 08 — GEYİM TƏRZİ */}
            {S.dresscode && (
              <Plate title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
                <DressCodeSection
                  theme={TH}
                  paletteId={weddingData.dressCodePalette}
                  customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders}
                  note={weddingData.dressCodeDescription}
                  lang={lang}
                  serif={display}
                  align="center"
                  onDark
                />
              </Plate>
            )}

            {/* 09 — MASA AXTARIŞI: fil sümüyü yer kartı */}
            {canShowSeating && !seating.isEmpty && (
              <Plate title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
                <div>
                  <input
                    ref={seatInputRef}
                    type="text"
                    value={seating.query}
                    onChange={(e) => { seating.setQuery(e.target.value); seating.setActiveIdx(-1); if (seating.selected) seating.setSelected(null) }}
                    onKeyDown={seating.onKeyDown}
                    placeholder={seatingL.hint}
                    role="combobox"
                    aria-expanded={seating.suggestions.length > 0}
                    aria-controls="rg-seating-list"
                    aria-autocomplete="list"
                    autoComplete="off"
                    style={{ ...lineInput, textAlign: 'center' }}
                  />
                  <SuggestList
                    id="rg-seating-list" items={seating.suggestions}
                    activeIdx={seating.activeIdx} setActiveIdx={seating.setActiveIdx} onPick={seating.pick}
                  />
                </div>

                {seating.showNotFound && (
                  <div style={{ marginTop: 14, fontSize: 13, color: TH.muted, textAlign: 'center' }}>{tr.inv_seat_fullname}</div>
                )}

                {seating.selected && (
                  <IvoryCard style={{ margin: '28px auto 0', maxWidth: 340, padding: '32px 24px 18px' }}>
                    <div style={{ fontFamily: display, fontStyle: 'italic', fontSize: 21, lineHeight: 1.3 }}>
                      {seating.selected.full_name}
                    </div>
                    <div aria-hidden="true" style={{ width: 56, height: 1, background: FOIL, margin: '14px auto' }} />
                    <div style={{ fontFamily: display, fontWeight: 300, fontSize: 44, lineHeight: 1, color: '#7A5A22' }}>
                      {seating.selected.table_id}
                    </div>
                    {seating.tablemates.length > 0 && (
                      <div style={{ fontSize: 13, color: INK_SOFT, marginTop: 16, lineHeight: 1.65 }}>
                        {seating.tablemates.map((g) => g.full_name).join(', ')}
                      </div>
                    )}
                    <button
                      onClick={seating.reset}
                      data-press
                      style={{
                        marginTop: 10, background: 'none', border: 'none', cursor: 'pointer',
                        fontFamily: display, fontStyle: 'italic', fontSize: 15, color: BRONZE,
                        minHeight: 44, padding: '0 8px', textDecoration: 'underline', textUnderlineOffset: 4,
                      }}
                    >
                      {seatingL.again || 'Yenidən axtar'}
                    </button>
                  </IvoryCard>
                )}
              </Plate>
            )}

            {/* 10 — FOTO PAYLAŞIMI */}
            {canShowGallery && (
              <Plate id="gallery-section" title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
                <div style={{ textAlign: 'center' }}>
                  {gallery.demoPhotos.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 28 }}>
                      {gallery.demoPhotos.map((url, i) => (
                        <div key={i} style={{ aspectRatio: '4/5', overflow: 'hidden', background: '#1A1409', padding: 3, border: `1px solid ${TH.primary}59` }}>
                          <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'sepia(.16) contrast(1.04)' }} />
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ position: 'relative', width: 168, height: 168, margin: '0 auto', background: IVORY, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 18px 40px rgba(0,0,0,.5)' }}>
                    <span aria-hidden="true" style={{ position: 'absolute', inset: 6, border: `1px solid ${BRONZE}66` }} />
                    <QRCodeSVG value={gallery.photoShareUrl} size={124} bgColor="transparent" fgColor="#1F170B" level="M" />
                  </div>
                  <div style={{ fontSize: 12.5, color: TH.muted, marginTop: 14, letterSpacing: '.03em' }}>
                    {tr.inv_scan_upload}
                  </div>

                  <a data-press href={gallery.photoShareUrl} style={{ ...btn(true), marginTop: 20, minWidth: 220 }}>
                    {tr.inv_gallery_btn}
                  </a>

                  <p style={{ fontSize: 13.5, color: TH.muted, margin: '18px auto 0', lineHeight: 1.75, maxWidth: 340 }}>
                    {tr.inv_gallery_desc}
                  </p>
                </div>
              </Plate>
            )}

            {/* 11 — İŞTİRAK TƏSDİQİ: səhifənin öz axınında — ayrıca fil sümüyü kart
                 yox (qonaq rəyi: kart çox qabarıq görünürdü). Qızıl xətlər,
                 sikkə nişanlı seçimlər, dar kontur düymə. Məntiq eynidir. */}
            {canShowRsvp && (
              <Plate title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
                <div style={{ maxWidth: 400, margin: '0 auto' }}>
                  {(rsvp.rsvpClosed && !rsvp.submitted) || rsvp.alreadyDone || rsvp.submitted ? (
                    <div style={{ textAlign: 'center', padding: '4px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><RosetteMark size={26} opacity={1} /></div>
                      <div style={{ fontFamily: display, fontStyle: 'italic', fontSize: 23, color: '#E6DAC3' }}>
                        {rsvp.rsvpClosed && !rsvp.submitted ? tr.rsvp_closed_title : rsvp.alreadyDone ? rsvpL.already_done : rsvp.thanksMsg}
                      </div>
                      <div style={{ fontSize: 13.5, color: TH.muted, marginTop: 6 }}>
                        {rsvp.rsvpClosed && !rsvp.submitted ? tr.rsvp_closed_desc : rsvp.alreadyDone ? rsvp.selected?.full_name : rsvpL.thanks_sub}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={rsvp.handleSubmit}>
                      <input
                        ref={rsvpInputRef}
                        type="text"
                        value={rsvp.query}
                        onChange={(e) => { rsvp.setQuery(e.target.value); rsvp.setActiveIdx(-1); if (rsvp.selected) rsvp.setSelected(null) }}
                        onKeyDown={rsvp.onKeyDown}
                        placeholder={rsvpL.namePh}
                        required={!rsvp.useGuestMode}
                        autoComplete="off"
                        style={{ ...lineInput, textAlign: 'center' }}
                      />
                      <SuggestList
                        items={rsvp.suggestions}
                        activeIdx={rsvp.activeIdx} setActiveIdx={rsvp.setActiveIdx} onPick={rsvp.pick}
                      />
                      {rsvp.showNotFound && (
                        <div style={{ fontSize: 13, color: TH.muted, marginTop: 8, textAlign: 'center' }}>{rsvpL.not_in_list}</div>
                      )}

                      <div role="radiogroup" aria-label={L('rsvp', 'title', rsvpL.title)} style={{ marginTop: 18 }}>
                        {[
                          { val: 'yes',   label: rsvpL.yes },
                          { val: 'no',    label: rsvpL.no },
                          { val: 'maybe', label: rsvpL.maybe },
                        ].map(({ val, label }) => {
                          const active = rsvp.status === val
                          return (
                            <button
                              key={val}
                              type="button"
                              role="radio"
                              aria-checked={active}
                              onClick={() => rsvp.chooseStatus(val)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 14, width: '100%', minHeight: 50,
                                padding: '0 4px', background: 'none', border: 'none', cursor: 'pointer',
                                borderBottom: '1px solid rgba(197,160,89,.18)', textAlign: 'left',
                                fontFamily: display, fontSize: 18.5, color: active ? '#E6DAC3' : TH.muted,
                              }}
                            >
                              <span aria-hidden="true" style={{
                                width: 16, height: 16, flex: '0 0 auto', borderRadius: '50%',
                                border: `1px solid ${LINE}`, background: active ? FOIL : 'transparent',
                              }} />
                              <span style={{ fontStyle: active ? 'italic' : 'normal' }}>{label}</span>
                            </button>
                          )
                        })}
                      </div>

                      {rsvp.status === 'yes' && (
                        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                          <span style={{ fontSize: 14, color: TH.muted, lineHeight: 1.4 }}>{rsvpL.plusq}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
                            <button type="button" onClick={rsvp.decPlusOne} disabled={rsvp.plusOne === 0} data-press aria-label="Azalt"
                              style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${LINE}`, background: 'none', color: '#E6DAC3', fontSize: 18, cursor: 'pointer', opacity: rsvp.plusOne === 0 ? 0.35 : 1 }}>
                              −
                            </button>
                            <span style={{ fontFamily: display, fontSize: 26, color: '#E6DAC3', width: 30, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
                              {rsvp.plusOne}
                            </span>
                            <button type="button" onClick={rsvp.incPlusOne} disabled={rsvp.plusOne === rsvp.maxExtraGuests} data-press aria-label="Artır"
                              style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${LINE}`, background: 'none', color: '#E6DAC3', fontSize: 18, cursor: 'pointer', opacity: rsvp.plusOne === rsvp.maxExtraGuests ? 0.35 : 1 }}>
                              +
                            </button>
                          </div>
                        </div>
                      )}

                      <div style={{ textAlign: 'center', marginTop: 24 }}>
                        <button
                          type="submit"
                          disabled={!rsvp.canSubmit}
                          data-press
                          style={{
                            minWidth: 200, minHeight: 46, padding: '0 28px', background: 'transparent',
                            border: `1px solid ${rsvp.canSubmit ? TH.primary : LINE}`, color: rsvp.canSubmit ? TH.primary : TH.muted,
                            cursor: rsvp.canSubmit ? 'pointer' : 'not-allowed', opacity: rsvp.canSubmit ? 1 : 0.6,
                            fontFamily: display, fontStyle: 'italic', fontSize: 18,
                          }}
                        >
                          {rsvp.sending ? '…' : rsvpL.send}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
                {/* ⚠ Phase 27: RSVP statistika paneli qonağa göstərilmir */}
              </Plate>
            )}

            {/* 12 — TƏBRİK KİTABI */}
            {S.guestbook && (
              <Plate title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
                <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 12, marginBottom: 8 }}>
                  <input
                    type="text"
                    value={gbook.name}
                    onChange={(e) => gbook.setName(e.target.value)}
                    placeholder={gbookL.namePh}
                    style={lineInput}
                  />
                  <textarea
                    value={gbook.text}
                    onChange={(e) => gbook.setText(e.target.value)}
                    placeholder={gbookL.msgPh}
                    rows={3}
                    style={{
                      background: 'rgba(197,160,89,.04)', border: `1px solid ${LINE}`, borderRadius: 0,
                      padding: '14px 14px', marginTop: 6, fontFamily: display, fontStyle: 'italic', fontSize: 17,
                      lineHeight: 1.5, color: TH.accent, outline: 'none', resize: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!gbook.canSubmit}
                    data-press
                    style={{ ...btn(gbook.canSubmit), width: '100%', minHeight: 50, opacity: gbook.canSubmit ? 1 : 0.6, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}
                  >
                    {gbook.sending ? gbookL.sending : gbookL.btn}
                  </button>
                  {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 13, textAlign: 'center', color: TH.text }}>⚠ {gbookL.error}</p>}
                </form>

                <div>
                  {gbook.messages.map((raw, i) => {
                    const m = gbook.readMessage(raw)
                    return (
                      <figure key={m.name + i} style={{ margin: 0, padding: '26px 0 0', textAlign: 'center' }}>
                        <svg viewBox="0 0 12 12" width="9" height="9" aria-hidden="true" style={{ display: 'block', margin: '0 auto 18px', opacity: 0.8 }}>
                          <path d="M6 0 L7.4 4.6 L12 6 L7.4 7.4 L6 12 L4.6 7.4 L0 6 L4.6 4.6 Z" fill={TH.primary} />
                        </svg>
                        <blockquote style={{ margin: 0, fontFamily: display, fontStyle: 'italic', fontWeight: 300, fontSize: 18.5, lineHeight: 1.6, color: '#E6DAC3' }}>
                          “{m.text}”
                        </blockquote>
                        <figcaption style={{ marginTop: 10, fontSize: 12.5, letterSpacing: '.06em', color: TH.muted }}>
                          {m.name}{m.date ? ` · ${gbook.formatDate(m.date)}` : ''}
                        </figcaption>
                      </figure>
                    )
                  })}
                </div>
              </Plate>
            )}

            {/* 12.5 — SİFARİŞ CTA (yalnız builder önbaxışında) */}
            <OrderCta
              theme={TH} weddingData={weddingData} lang={lang}
              pageSlug={gallery.pageSlug} isDemoMode={isDemoMode}
              effectiveSlug={gallery.effectiveSlug} serif={display}
            />

            {/* 13 — SON HİSSƏ: demo CTA + footer */}
            <div style={{ paddingTop: 8 }}>
              <GuillocheBand width="min(64%, 240px)" opacity={0.5} style={{ marginBottom: 0 }} />
            </div>
            <TemplateOutro
              theme={TH} weddingData={weddingData} lang={lang}
              isDemoMode={isDemoMode} isCouple={isCouple} isCorp={isCorp}
              eventLabel={eventLabel} serif={display}
              footer={sectionHead(L, 'footer')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* Xəritənin mərkəzindəki qızıl romb nişanı */
function MapPin() {
  return (
    <span aria-hidden="true" style={{
      position: 'absolute', left: '50%', top: '50%', width: 34, height: 34,
      transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(232,213,163,.55)' }} />
      <span style={{ width: 11, height: 11, transform: 'rotate(45deg)', background: FOIL, boxShadow: '0 0 0 3px rgba(11,9,6,.85)' }} />
    </span>
  )
}
