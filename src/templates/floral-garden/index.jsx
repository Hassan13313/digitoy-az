import { createContext, useContext, useState, useEffect, useRef } from 'react'
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
import { applyThemeOverrides, mergeSectionLabels, withStringOverrides, makeLabelResolver, sectionHead } from '../../data/adminOverrides'
import { makeOpeningText, phrase } from '../_shared/openingSpec'
import { scaleFont } from '../_shared/palette'
import { tableParts, tableFontPx } from '../_shared/tableBadge'
import { EmblemSlot } from '../_shared/MonoContent'
import {
  cornerBouquet, smallBouquet, cardBouquet, sprigMark, singleBloom,
  BLOSSOM_DATA_URI, VINE_DATA_URI, PAPER_DATA_URI,
} from './botanicals'

/* ─────────────────────────────────────────────────────────────────────────────
   FLORAL GARDEN ROMANCE — «Bağ mərasimi» (premium redizayn, 2026-10)

   Konsept: floristin qurduğu gündüz bağ mərasimi. Bəzək YALNIZ çiçəkdir —
   pion, bağ qızılgülü, evkalipt, qönçə; çərçivə, nazik xətt, büyük hərfli
   etiket yoxdur. Düzülüş asimmetrikdir və sola yığılır (bağ qeyri-rəsmidir),
   Royal Gold-un simmetrik mərkəz oxunun əksi.

   Bölmələrin şablona məxsus forması:
     açılış   → çiçək qapısı: dörd küncdə buketlər bir-bir açır; toxunanda
                buketlər iki yana aralanır və qonaq bağa daxil olur
     hero     → sağ-yuxarı küncdən sallanan buket, sola yığılmış adlar
     bağ yolu → sol kənarda bütün səhifə boyu uzanan yaşıl gövdə; proqramın
                hər hadisəsi bu gövdədə AÇAN çiçəkdir
     sayğac   → böyük «gün» rəqəmi + bir sətirdə saat/dəqiqə/saniyə
     məkan    → tağlı bağ pəncərəsi içində xəritə, küncündə buket
     masa     → ağ yer kartı, budaq nişanı ilə
     RSVP     → küncünə pion taxılmış ağ kart, seçimlər yumşaq həblər

   Palitra: səhər kətanı #F4F6EF · evkalipt #5E7C6B · qıjı mürəkkəbi #213229
   · pion #C9768A · tozcuq #E9C46A. Şriftlər: Fraunces (yumşaq serif,
   başlıqlar; rus dilində Cormorant) · Mulish (mətn).

   ⚠ Bu fayl YALNIZ UI qatıdır — bütün biznes məntiqi hook-lardadır.
   ───────────────────────────────────────────────────────────────────────── */

const BASE_TH = getTemplateTheme('floral-garden')
/* Admin rəng/şrift override-ları tətbiq olunmuş tema (bax default export) —
   komponentlər onu kontekstdən oxuyur; override yoxdursa BASE_TH-nin özüdür. */
const ThemeCtx = createContext(BASE_TH)
const useTH = () => useContext(ThemeCtx)
const DEFAULT_MUSIC = buildPresetMusic(PRESET_TRACKS[0], { playMode: MUSIC_PLAY_MODES.AUTO })

/* Başlıq şrifti CSS dəyişənidir: Fraunces-də kiril olmadığı üçün rus dilində
   kök element onu bütövlükdə Cormorant-a keçirir (bir sətirdə iki şrift
   qarışmasın deyə — hərf-hərf ehtiyat yox). */
const serif = 'var(--fg-serif)'

const ROSE_TXT = '#A4526A'        /* kiçik mətn üçün kontrastlı qızılgül */
const LINE     = 'rgba(94,124,107,.32)'
const SOFT     = "'SOFT' 100, 'WONK' 0"

/* Buketlər modul səviyyəsində bir dəfə qurulur (statik SVG mətni).
   ⚠ `{ __html }` obyekti də SABİTDİR: React 19 bu prop-u obyekt kimi
   müqayisə edir — hər render-də yeni obyekt versək, sayğacın hər saniyəlik
   yenilənməsində bütün buketlər DOM-dan silinib yenidən parse olunur
   (açılış animasiyası hər saniyə sıfırlanırdı, telefonda isə yük idi). */
const html = (s) => ({ __html: s })
const OPEN_TL = html(cornerBouquet('fgo1', { seed: 1, t0: 0.2 }))
const OPEN_TR = html(smallBouquet('fgo2', { seed: 2, t0: 0.7 }))
const OPEN_BR = html(cornerBouquet('fgo3', { seed: 3, flip: true, t0: 0.45 }))
const OPEN_BL = html(smallBouquet('fgo4', { seed: 4, t0: 0.95 }))
const HERO_TR = html(cornerBouquet('fgh1', { seed: 5 }))
const HERO_BL = html(smallBouquet('fgh2', { seed: 6 }))
const CARD    = html(cardBouquet('fgc1', { seed: 7 }))
const SPRIG   = html(sprigMark('fgs1', { seed: 8 }))
const EMBLEM  = html(singleBloom('fge1', { kind: 'peony', hue: 'pink', size: 80, seed: 12 }))

const svgBox = (art, style) => (
  <div aria-hidden="true" style={{ lineHeight: 0, pointerEvents: 'none', ...style }} dangerouslySetInnerHTML={art} />
)

const KEYFRAMESOf = (TH) => (`
@keyframes fg-in    { from { opacity: 0; transform: scale(.94) } to { opacity: 1; transform: none } }
@keyframes fg-bloom { from { opacity: 0; transform: scale(.2) rotate(-50deg) } to { opacity: 1; transform: none } }
@keyframes fg-grow  { from { opacity: 0; transform: scale(.35) } to { opacity: 1; transform: none } }
@keyframes fg-rise  { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes fg-fade  { from { opacity: 0 } to { opacity: 1 } }
@keyframes fg-eq    { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
@keyframes fg-breathe { 0%,100% { opacity: .5 } 50% { opacity: 1 } }

[data-fg] .fg-anim .fgb { transform-box: fill-box; transform-origin: 50% 50%; animation: fg-bloom 1.3s cubic-bezier(.2,.8,.2,1) 1.1s both; }
[data-fg] .fg-anim .fgl { transform-box: fill-box; transform-origin: 50% 100%; animation: fg-grow 1.2s cubic-bezier(.2,.8,.2,1) .15s both; }
[data-fg] ::placeholder { color: rgba(93,107,97,.62); }
[data-fg] input:focus-visible, [data-fg] textarea:focus-visible { border-color: ${TH.primary} !important; box-shadow: 0 0 0 3px rgba(94,124,107,.16); outline: none; }
[data-fg] button:focus-visible, [data-fg] a:focus-visible, [data-fg] [role="button"]:focus-visible { outline: 2px solid ${TH.primary}; outline-offset: 3px; }

@media (prefers-reduced-motion: reduce) {
  [data-fg] *, [data-fg] { animation: none !important; transition: none !important; }
}
`)

/* ═══════════════════════════════════════════════════════════════════════════
   01 — AÇILIŞ: çiçək qapısı

   Kətan fon → küncdən-küncə buketlərin yarpaqları böyüyür, çiçəklər bir-bir
   açır → mərkəzdə pion, adlar, düymə. Toxunanda sol buketlər sola, sağ
   buketlər sağa aralanır — qonaq bağa addımlayır.

   ⚠ `onOpenStart` MÜTLƏQ toxunuş hadisəsinin içində çağırılır (iOS musiqi).
   ═══════════════════════════════════════════════════════════════════════════ */
function GardenGate({ weddingData, isCouple, ot, onOpen, onOpenStart }) {
  const TH = useTH()
  const sans = TH.fonts.body
  const INK = TH.text
  const EUCA = TH.primary
  const PEONY = TH.accent
  const MUTED = TH.muted
  const [opening, setOpening] = useState(false)
  const [gone, setGone] = useState(false)

  const titleOv = ot.override('title')
  const first = titleOv !== undefined
    ? titleOv
    : (isCouple ? (weddingData.groomName || '') : (weddingData.eventName || weddingData.brideName || ''))
  const second = titleOv !== undefined ? '' : (isCouple ? (weddingData.brideName || '') : '')

  const start = () => {
    if (opening) return
    unlockAudio()
    onOpenStart?.()
    setOpening(true)
    setTimeout(() => { setGone(true); onOpen() }, 1250)
  }

  if (gone) return null

  const part = (dir) => ({
    animate: opening ? { x: dir === 'l' ? '-75%' : '75%', rotate: dir === 'l' ? -9 : 9, opacity: 0 } : {},
    transition: { duration: 1.15, ease: [0.62, 0, 0.3, 1] },
  })

  return (
    <motion.div
      onClick={start}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); start() } }}
      aria-label={ot.text('cta') || phrase('open', ot.lang)}
      data-fg
      animate={opening ? { backgroundColor: 'rgba(244,246,239,0)' } : {}}
      transition={{ duration: 0.5, delay: 0.75 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden',
        backgroundColor: TH.background, backgroundImage: PAPER_DATA_URI,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 28px', fontFamily: sans,
      }}
    >
      <div className="fg-anim" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <motion.div {...part('l')} style={{ position: 'absolute', left: -74, top: -64, width: 'min(88vw, 350px)' }}>
          <div style={{ animation: 'fg-in 1.2s ease-out .05s both' }}>{svgBox(OPEN_TL)}</div>
        </motion.div>
        <motion.div {...part('r')} style={{ position: 'absolute', right: -52, top: -34, width: 'min(54vw, 210px)' }}>
          <div style={{ animation: 'fg-in 1.2s ease-out .4s both' }}>{svgBox(OPEN_TR, { transform: 'scaleX(-1)' })}</div>
        </motion.div>
        <motion.div {...part('r')} style={{ position: 'absolute', right: -84, bottom: -66, width: 'min(90vw, 360px)' }}>
          <div style={{ animation: 'fg-in 1.2s ease-out .25s both' }}>{svgBox(OPEN_BR)}</div>
        </motion.div>
        <motion.div {...part('l')} style={{ position: 'absolute', left: -54, bottom: -34, width: 'min(54vw, 210px)' }}>
          <div style={{ animation: 'fg-in 1.2s ease-out .6s both' }}>{svgBox(OPEN_BL, { transform: 'scaleY(-1)' })}</div>
        </motion.div>
      </div>

      <motion.div
        animate={opening ? { opacity: 0, scale: 0.96 } : {}}
        transition={{ duration: 0.55, ease: 'easeIn' }}
        style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 330 }}
      >
        {ot.mono.kind !== 'none' && (
          <div style={{ marginBottom: 18 }}>
            <EmblemSlot
              mono={ot.mono} size={84} delay={1.6}
              border={`1px solid ${PEONY}66`} background="rgba(255,255,255,.82)"
              color={ROSE_TXT} font={serif}
            >
              <div className="fg-anim" style={{ width: 66, height: 66, margin: '0 auto' }}>
                <div style={{ animation: 'fg-bloom 1.5s cubic-bezier(.2,.8,.2,1) 1.6s both' }}>{svgBox(EMBLEM)}</div>
              </div>
            </EmblemSlot>
          </div>
        )}

        {ot.show('kicker') && (
          <div style={{
            fontFamily: serif, fontStyle: 'italic', fontSize: 17, color: ROSE_TXT, fontVariationSettings: SOFT,
            animation: 'fg-rise .9s ease-out 1.9s both',
          }}>
            {ot.text('kicker')}
          </div>
        )}

        {titleOv !== '' && (
          <div data-fit style={{
            marginTop: 10, fontFamily: serif, fontStyle: 'italic', fontWeight: 300,
            fontSize: 'clamp(40px, 13vw, 56px)', lineHeight: 1.02, color: INK,
            fontVariationSettings: SOFT, letterSpacing: '-.01em',
            animation: 'fg-rise 1.1s cubic-bezier(.22,.61,.36,1) 2.15s both',
          }}>
            <div>{first}</div>
            {second && (
              <>
                <div style={{ fontSize: '.66em', color: PEONY, margin: '2px 0' }}>{ot.text('and')}</div>
                <div>{second}</div>
              </>
            )}
          </div>
        )}

        {ot.show('meta') && (
          <div style={{ marginTop: 18, fontSize: 14.5, color: MUTED, animation: 'fg-rise .9s ease-out 2.5s both' }}>
            {ot.text('meta')}
          </div>
        )}

        {ot.show('cta') && (
          <div style={{
            marginTop: 26, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 50, padding: '14px 28px', borderRadius: 999,
            background: EUCA, color: TH.surface, fontSize: 15, fontWeight: 500, letterSpacing: '.01em',
            boxShadow: '0 12px 26px rgba(47,74,59,.28)',
            animation: 'fg-rise .9s ease-out 2.85s both',
          }}>
            {ot.text('cta')}
          </div>
        )}

        {ot.show('hint') && (
          <div style={{ marginTop: 14, fontSize: 12.5, color: MUTED, animation: 'fg-fade .8s ease-out 3.4s both, fg-breathe 3s ease-in-out 4.2s infinite' }}>
            {ot.text('hint')}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MUSİQİ — ağ dairə, evkalipt rəngli ekvalayzer
   ═══════════════════════════════════════════════════════════════════════════ */
function GardenMusic({ lang, music, playerRef, visible = false, autoPlay = false }) {
  const TH = useTH()
  const EUCA = TH.primary
  const MUTED = TH.muted
  const { audioProps, playing, play, pause, toggle, hasMusic } = useMusicPlayer({
    lang, music, autoStart: visible && autoPlay,
  })

  useEffect(() => {
    if (playerRef) playerRef.current = { play, pause }
  })

  const [prompt, dismissPrompt] = useMusicPrompt({ enabled: visible && hasMusic })

  if (!hasMusic) return null

  return (
    <>
      {/* ⚠ <audio> açılışdan əvvəl də mount olunur (iOS jest qaydası) */}
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
              right: 20, zIndex: 55, width: 48, height: 48, borderRadius: '50%',
              border: `1px solid ${LINE}`, background: 'rgba(255,255,255,.92)',
              boxShadow: '0 10px 24px rgba(33,50,41,.16)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
            }}
          >
            {[0, 0.18, 0.36].map((d) => (
              <span key={d} style={{
                width: 2.5, height: 13, borderRadius: 2, background: playing ? EUCA : `${MUTED}80`,
                transformOrigin: 'bottom', display: 'block',
                animation: playing ? `fg-eq 1s ease-in-out ${d}s infinite` : 'none',
                transform: playing ? undefined : 'scaleY(.45)',
              }} />
            ))}
          </button>
        </>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   BAĞ YATAĞI — bölmə qabı. Sol kənarda bağ yolu gövdəsi (ana qabın fonu),
   məzmun gövdənin sağında. `kicker` yalnız admin yazanda görünür.
   ═══════════════════════════════════════════════════════════════════════════ */
function Bed({ id, section, title, kicker, sub, children, style = {} }) {
  const TH = useTH()
  const INK = TH.text
  const MUTED = TH.muted
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '44px 24px 52px 58px', ...style }}>
      <Reveal style={{ maxWidth: 460 }}>
        {(title || kicker || sub) && (
          <div style={{ marginBottom: 26 }}>
            {title && (
              <h2 style={{
                margin: 0, fontFamily: serif, fontStyle: 'italic', fontWeight: 300,
                fontSize: scaleFont('clamp(30px, 8.8vw, 38px)', TH.headingScale), lineHeight: 1.08, color: INK,
                fontVariationSettings: SOFT, letterSpacing: '-.01em',
              }}>
                {title}
              </h2>
            )}
            {kicker && <div style={{ marginTop: 8, fontSize: 13.5, color: ROSE_TXT }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px 0 0', fontSize: 14.5, color: MUTED, lineHeight: 1.55, maxWidth: 320 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

/* Düymələr — həb formalı */
const pill = (TH, filled) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  minHeight: 46, padding: '12px 20px', borderRadius: 999, textDecoration: 'none', cursor: 'pointer',
  fontFamily: TH.fonts.body, fontSize: 14, fontWeight: 500,
  background: filled ? TH.primary : 'rgba(255,255,255,.7)',
  color: filled ? TH.surface : TH.text,
  border: filled ? '1px solid transparent' : `1px solid ${LINE}`,
  boxShadow: filled ? '0 8px 18px rgba(47,74,59,.2)' : 'none',
})

const fieldOf = (TH) => ({
  width: '100%', background: '#FFFFFF', border: `1px solid ${LINE}`, borderRadius: 999,
  padding: '14px 20px', fontFamily: TH.fonts.body, fontSize: 15, color: TH.text, outline: 'none',
})

/* Ağ kart — yalnız iki yerdə: yer kartı və RSVP */
const card = {
  position: 'relative', background: '#FFFFFF', borderRadius: 26,
  boxShadow: '0 1px 0 rgba(33,50,41,.04), 0 24px 48px -18px rgba(33,50,41,.22)',
}

function SuggestList({ id, items, activeIdx, setActiveIdx, onPick }) {
  const TH = useTH()
  const INK = TH.text
  if (!items.length) return null
  return (
    <ul id={id} role="listbox" style={{
      listStyle: 'none', margin: '8px 0 0', padding: 6, textAlign: 'left',
      background: TH.surface, border: `1px solid ${LINE}`, borderRadius: 18,
      boxShadow: '0 16px 30px -16px rgba(33,50,41,.25)', maxHeight: 280, overflowY: 'auto',
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
            padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
            background: i === activeIdx ? 'rgba(94,124,107,.1)' : 'transparent',
          }}
        >
          <span style={{ fontSize: 14.5, color: INK }}>{g.full_name}</span>
          {g.table_id && <span style={{ fontSize: 12.5, color: ROSE_TXT, whiteSpace: 'nowrap' }}>{g.table_id}</span>}
        </li>
      ))}
    </ul>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function FloralGardenTemplate({
  lang, setLang, weddingData, onBack, isDemoMode = false, initialGuestbook,
  adminOverrides = null, startOpened = false,
}) {
  /* Admin rəng/şrift override-ları (yoxdursa BASE_TH-nin özü — render dəyişmir) */
  const TH = applyThemeOverrides(BASE_TH, adminOverrides)
  const sans = TH.fonts.body
  const INK = TH.text
  const EUCA = TH.primary
  const PEONY = TH.accent
  const MUTED = TH.muted
  const KEYFRAMES = KEYFRAMESOf(TH)
  const field = fieldOf(TH)
  const adminStrings = adminOverrides?.strings || null
  const tr = withStringOverrides(t[lang] || t.az, adminStrings, lang)
  const L = makeLabelResolver(mergeSectionLabels(null, adminOverrides), lang)
  const [opened, setOpened] = useState(startOpened)
  /* Dəvətnamə açıldı — demo/önbaxışda gözləyən kuki banneri indi çıxa bilər (utils/consent.js) */
  useEffect(() => { if (opened) window.dispatchEvent(new Event('digitoy:invitation-opened')) }, [opened])
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
    'floral-garden', { weddingData, lang, isCouple, isCorp, eventLabel }, adminOverrides?.opening || null,
  )

  const activePkgId = isDemoMode ? 'PREMIUM' : (weddingData.package || 'SADE')

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
  const { inputRef: rsvpInputRef, ...rsvp } = useRsvp({ lang, weddingData })
  const gbook    = useGuestbook({ lang, initialMessages: initialGuestbook })
  const gallery  = useGallery({ weddingData, isCouple, isCorp })
  const rsvpL    = withStringOverrides(rsvp.labels,    adminStrings, lang, 'rsvp.')
  const gbookL   = withStringOverrides(gbook.labels,   adminStrings, lang, 'gbook.')
  const seatingL = withStringOverrides(seating.labels, adminStrings, lang, 'seating.')
  const tb = tableParts(seating.selected?.table_id)
  const heroTitle = L('hero', 'title', null)

  useEffect(() => {
    if (!isDemoMode) trackEvent('invitation_opened', { lang, event_type: weddingData?.eventType })
  }, [])

  const { formattedDate, dayName } = formatAzDate(weddingData.date, lang)
  const dp = dateParts(weddingData.date, lang)
  const time = weddingData.time ? formatTime24(weddingData.time) : ''
  const K = (key) => L(key, 'kicker', null)

  return (
    <ThemeCtx.Provider value={TH}>
<div
      data-fg
      data-enter={enterDirection('floral-garden')}
      style={{
        backgroundColor: TH.background, backgroundImage: PAPER_DATA_URI,
        minHeight: '100vh', fontFamily: sans, color: INK,
        fontSize: TH.bodyScale ? `${TH.bodyScale}em` : undefined,
        overflowX: 'hidden', position: 'relative', isolation: 'isolate',
        '--tpl-glow': `${TH.accent}40`,
        /* RU-da Cormorant — amma admin başlıq şriftini dəyişibsə onun seçimi */
        '--fg-serif': lang === 'ru' && TH.fonts.heading === BASE_TH.fonts.heading ? FONT_STACKS.cormorant : TH.fonts.heading,
      }}
    >
      <style>{KEYFRAMES}</style>

      {/* 01 — AÇILIŞ */}
      {!opened && (
        <GardenGate
          weddingData={weddingData}
          isCouple={isCouple}
          ot={ot}
          onOpen={() => setOpened(true)}
          onOpenStart={autoPlay ? () => musicRef.current?.play() : undefined}
        />
      )}

      {/* 03 — MUSİQİ */}
      <GardenMusic lang={lang} music={invMusic} playerRef={musicRef} visible={opened} autoPlay={autoPlay} />

      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            {/* 02 — BAŞLIQ ZOLAĞI */}
            <header style={{
              position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(244,246,239,.82)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
              borderBottom: `1px solid ${LINE}`,
            }}>
              <button
                onClick={onBack}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
                  fontSize: 14, color: MUTED, cursor: 'pointer', fontFamily: sans,
                  minHeight: 44, padding: '0 8px 0 0',
                }}
              >
                <span aria-hidden="true">←</span>{tr.btn_back}
              </button>
              <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 17, color: INK, fontVariationSettings: SOFT }}>
                Digitoy
              </div>
              <LanguageSwitcher lang={lang} setLang={setLang} theme={TH} />
            </header>

            {/* 04 — HERO: sağ küncdən sallanan buket, sola yığılmış adlar */}
            <section data-section="hero" style={{
              position: 'relative', minHeight: 'calc(100svh - 52px)', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              padding: 'clamp(220px, 58vw, 280px) 28px 64px',
            }}>
              {svgBox(HERO_TR, { position: 'absolute', right: -96, top: -78, width: 'min(92vw, 360px)', transform: 'scaleX(-1)' })}
              {svgBox(HERO_BL, { position: 'absolute', right: -70, bottom: -56, width: 200, transform: 'rotate(180deg)', opacity: 0.95 })}

              <div style={{ position: 'relative', maxWidth: 440 }}>
                <div style={{ fontSize: 14, color: ROSE_TXT, fontWeight: 500 }}>
                  {L('hero', 'kicker', eventLabel)}
                </div>
                <p style={{
                  margin: '10px 0 0', maxWidth: 280, fontFamily: serif, fontStyle: 'italic', fontWeight: 300,
                  fontSize: 17, lineHeight: 1.5, color: MUTED, fontVariationSettings: SOFT,
                }}>
                  {tr.inv_join}
                </p>

                <h1 data-fit style={{
                  margin: '22px 0 0', fontFamily: serif, fontWeight: 300, lineHeight: 0.98, color: INK,
                  fontSize: heroTitle || !isCouple ? 'clamp(44px, 13vw, 64px)' : 'clamp(54px, 17.5vw, 82px)',
                  letterSpacing: '-.02em', fontVariationSettings: SOFT,
                }}>
                  {heroTitle ? heroTitle : isCouple ? (
                    <>
                      <span style={{ display: 'block' }}>{weddingData.groomName}</span>
                      <span style={{ display: 'block', paddingLeft: '.42em' }}>
                        <span style={{ fontStyle: 'italic', color: PEONY, fontSize: '.72em', marginRight: '.18em' }}>{adminStrings?.inv_and ? tr.inv_and : '&'}</span>
                        {weddingData.brideName}
                      </span>
                    </>
                  ) : (weddingData.eventName || weddingData.brideName)}
                </h1>

                {isCorp && weddingData.organizer?.trim() && (
                  <div style={{ fontSize: 14, color: MUTED, marginTop: 12 }}>
                    {tr.organizer_display}: {weddingData.organizer}
                  </div>
                )}

                <div style={{ marginTop: 30, display: 'flex', gap: 16, alignItems: 'stretch' }}>
                  <span aria-hidden="true" style={{ width: 2, borderRadius: 2, background: PEONY, opacity: 0.7 }} />
                  <div>
                    <div style={{ fontFamily: serif, fontSize: 23, color: INK, fontVariationSettings: SOFT }}>
                      {dp ? `${dp.day} ${dp.month} ${dp.year}` : formattedDate}
                    </div>
                    <div style={{ fontSize: 14.5, color: MUTED, marginTop: 4 }}>
                      {[dp ? dp.weekday : dayName, time && time !== '—' ? time : ''].filter(Boolean).join(', ')}
                    </div>
                    {weddingData.venueName && (
                      <div style={{ fontSize: 14.5, color: INK, marginTop: 4 }}>{weddingData.venueName}</div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* BAĞ YOLU — sol kənarda bütün bölmələr boyunca gövdə */}
            <div style={{
              position: 'relative',
              backgroundImage: VINE_DATA_URI, backgroundRepeat: 'repeat-y',
              backgroundPosition: '4px 0', backgroundSize: '40px 240px',
            }}>

              {/* 05 — SAYĞAC */}
              {S.countdown && (
                <Bed section="countdown" title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
                    <div style={{
                      fontFamily: serif, fontWeight: 300, fontSize: 'clamp(84px, 28vw, 120px)', lineHeight: 0.82,
                      color: ROSE_TXT, letterSpacing: '-.04em', fontVariantNumeric: 'tabular-nums', fontVariationSettings: SOFT,
                    }}>
                      <PopDigit value={cd.days} />
                    </div>
                    <div style={{ paddingBottom: 6 }}>
                      {svgBox(SPRIG, { width: 34, height: 34, marginBottom: 4 })}
                      <div style={{ fontSize: 14, color: MUTED }}>{cd.labels.days}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 22, marginTop: 22, flexWrap: 'wrap' }}>
                    {[
                      { v: cd.hours, l: cd.labels.hours },
                      { v: cd.minutes, l: cd.labels.minutes },
                      { v: cd.seconds, l: cd.labels.seconds, pop: true },
                    ].map(({ v, l, pop }) => (
                      <div key={l} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{ fontFamily: serif, fontSize: 30, color: pop ? PEONY : INK, fontVariantNumeric: 'tabular-nums', fontVariationSettings: SOFT }}>
                          <PopDigit value={v} pop={pop} />
                        </span>
                        <span style={{ fontSize: 13, color: MUTED }}>{l}</span>
                      </div>
                    ))}
                  </div>
                </Bed>
              )}

              {/* 05b — BİZİM HEKAYƏMİZ (default bağlıdır) */}
              {S.lovestory && Array.isArray(weddingData.loveStory) && weddingData.loveStory.length > 0 && (
                <section data-section="lovestory" style={{ padding: 'clamp(48px,12vw,64px) 22px clamp(56px,14vw,80px)', background: getStoryTheme('floral-garden').bg }}>
                  <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                    <LoveStorySection
                      story={weddingData.loveStory} templateId="floral-garden" lang={lang}
                      copyOverrides={adminOverrides?.story?.text || null}
                    />
                  </Reveal>
                </section>
              )}

              {/* 06 — MƏKAN: tağlı bağ pəncərəsi */}
              {S.venue && (
                <Bed section="venue" title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
                  <div style={{ position: 'relative', maxWidth: 340, marginTop: 8 }}>
                    <div style={{
                      borderRadius: '999px 999px 24px 24px', overflow: 'hidden', border: '6px solid #FFFFFF',
                      boxShadow: '0 24px 44px -20px rgba(33,50,41,.35)',
                    }}>
                      <MapSection
                        weddingData={weddingData}
                        theme={TH}
                        accent={EUCA}
                        height="clamp(300px, 92vw, 380px)"
                        map={{ opacity: 0.95, filter: 'grayscale(.85) brightness(1.08) contrast(.92)', tintOpacity: 0.22 }}
                        frame={<BlossomPin />}
                        fallback={(
                          <div style={{
                            height: 'clamp(300px, 92vw, 380px)', position: 'relative',
                            background: 'linear-gradient(180deg, #EAF0E6, #DDE7DA)',
                          }}>
                            <span aria-hidden="true" style={{
                              position: 'absolute', inset: 0, opacity: 0.55,
                              backgroundImage: 'radial-gradient(rgba(94,124,107,.35) 1px, transparent 1.4px)',
                              backgroundSize: '18px 18px',
                            }} />
                            <BlossomPin />
                          </div>
                        )}
                      />
                    </div>
                    {svgBox(CARD, { position: 'absolute', right: -40, top: -46, width: 150 })}
                  </div>
                  <div style={{ marginTop: 22, fontFamily: serif, fontSize: 25, lineHeight: 1.25, color: INK, fontVariationSettings: SOFT }}>
                    {weddingData.venueName}
                  </div>
                  {weddingData.venueNote && (
                    <div style={{ marginTop: 6, fontSize: 14.5, color: MUTED, lineHeight: 1.55 }}>{weddingData.venueNote}</div>
                  )}
                  <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
                    {dirUrl && <a data-press href={dirUrl} target="_blank" rel="noopener noreferrer" style={pill(TH, true)}>{tr.inv_directions_btn}</a>}
                    {mapUrl && <a data-press href={mapUrl} target="_blank" rel="noopener noreferrer" style={pill(TH, !dirUrl)}>Maps</a>}
                    {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={pill(TH, false)}>Waze</a>}
                    {weddingData.appleMapsUrl && (
                      <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={pill(TH, false)}>Apple</a>
                    )}
                  </div>
                </Bed>
              )}

              {/* 07 — PROQRAM: hər hadisə bağ yolunda açan çiçəkdir */}
              {S.program && (
                <Bed section="program" title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
                  <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 26 }}>
                    {timeline.events.map((ev, i) => (
                      <li key={i} style={{ position: 'relative' }}>
                        <span aria-hidden="true" style={{
                          position: 'absolute', left: -45, top: 0, width: 24, height: 24,
                          backgroundImage: BLOSSOM_DATA_URI, backgroundSize: 'contain',
                          filter: 'drop-shadow(0 2px 3px rgba(33,50,41,.18))',
                        }} />
                        <div style={{ fontSize: 13.5, fontWeight: 500, color: ROSE_TXT, fontVariantNumeric: 'tabular-nums', letterSpacing: '.02em' }}>
                          {ev.time}
                        </div>
                        <div style={{ marginTop: 3, fontFamily: serif, fontSize: 20, lineHeight: 1.3, color: INK, fontVariationSettings: SOFT }}>
                          {ev.label}
                        </div>
                      </li>
                    ))}
                  </ol>
                </Bed>
              )}

              {/* 08 — GEYİM TƏRZİ */}
              {S.dresscode && (
                <Bed section="dresscode" title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
                  <DressCodeSection
                    theme={TH}
                    paletteId={weddingData.dressCodePalette}
                    customLabels={weddingData.dressCodeLabels}
                    customGenders={weddingData.dressCodeGenders}
                    note={weddingData.dressCodeDescription}
                    lang={lang}
                    serif={serif}
                    align="left"
                  />
                </Bed>
              )}

              {/* 09 — MASA AXTARIŞI: ağ yer kartı */}
              {canShowSeating && !seating.isEmpty && (
                <Bed section="seating" title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
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
                      aria-controls="fg-seating-list"
                      aria-autocomplete="list"
                      autoComplete="off"
                      style={field}
                    />
                    <SuggestList
                      id="fg-seating-list" items={seating.suggestions}
                      activeIdx={seating.activeIdx} setActiveIdx={seating.setActiveIdx} onPick={seating.pick}
                    />
                  </div>

                  {seating.showNotFound && (
                    <div style={{ marginTop: 12, fontSize: 13.5, color: MUTED }}>{tr.inv_seat_fullname}</div>
                  )}

                  {seating.selected && (
                    <div style={{ ...card, marginTop: 22, padding: '24px 22px 14px', maxWidth: 330 }}>
                      {svgBox(SPRIG, { position: 'absolute', right: 16, top: 14, width: 40, height: 40 })}
                      <div style={{ fontSize: 13.5, color: MUTED }}>{seating.selected.full_name}</div>
                      <div style={{
                        marginTop: 6, fontFamily: serif, fontStyle: 'italic', fontWeight: 300, fontSize: tableFontPx(tb.num, 44, 18), lineHeight: 1.1,
                        color: ROSE_TXT, fontVariationSettings: SOFT, overflowWrap: 'anywhere',
                      }}>
                        {tb.hasWord && <span style={{ display: 'block', fontFamily: sans, fontStyle: 'normal', fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: MUTED, marginBottom: 6 }}>{tr.inv_table}</span>}
                        {tb.num}
                      </div>
                      {seating.tablemates.length > 0 && (
                        <div style={{ fontSize: 13.5, color: MUTED, marginTop: 14, lineHeight: 1.6 }}>
                          {seating.tablemates.map((g) => g.full_name).join(', ')}
                        </div>
                      )}
                      <button
                        onClick={seating.reset}
                        data-press
                        style={{
                          marginTop: 6, background: 'none', border: 'none', cursor: 'pointer',
                          fontFamily: sans, fontSize: 14, fontWeight: 500, color: EUCA,
                          minHeight: 44, padding: 0, textDecoration: 'underline', textUnderlineOffset: 4,
                        }}
                      >
                        {seatingL.again || 'Yenidən axtar'}
                      </button>
                    </div>
                  )}
                </Bed>
              )}

              {/* 10 — FOTO PAYLAŞIMI */}
              {canShowGallery && (
                <Bed section="gallery" id="gallery-section" title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
                  {gallery.demoPhotos.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 26 }}>
                      {gallery.demoPhotos.map((url, i) => (
                        <div key={i} style={{
                          aspectRatio: '3/4', overflow: 'hidden', background: '#E6EDE3',
                          borderRadius: '999px 999px 12px 12px', border: '3px solid #FFFFFF',
                          boxShadow: '0 12px 22px -14px rgba(33,50,41,.4)',
                        }}>
                          <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{
                      width: 148, height: 148, flex: '0 0 auto', borderRadius: 22, background: TH.surface,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 18px 34px -18px rgba(33,50,41,.35)',
                    }}>
                      <QRCodeSVG value={gallery.photoShareUrl} size={112} bgColor={TH.surface} fgColor={INK} level="M" />
                    </div>
                    <div style={{ flex: '1 1 140px', fontSize: 14, color: MUTED, lineHeight: 1.5 }}>
                      {tr.inv_scan_upload}
                    </div>
                  </div>

                  <a data-press href={gallery.photoShareUrl} style={{ ...pill(TH, true), marginTop: 20 }}>
                    {tr.inv_gallery_btn}
                  </a>

                  <p style={{ fontSize: 14.5, color: MUTED, margin: '16px 0 0', lineHeight: 1.7, maxWidth: 360 }}>
                    {tr.inv_gallery_desc}
                  </p>
                </Bed>
              )}

              {/* 11 — İŞTİRAK TƏSDİQİ: bağın öz səhifəsində — ayrıca ağ kart yox
                   (qonaq rəyi: kart çox qabarıq görünürdü). Alt xətli ad sahəsi,
                   xırda pion qönçəsi ilə seçimlər, dar kontur düymə. Məntiq eynidir. */}
              {canShowRsvp && (
                <Bed section="rsvp" title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
                  <div style={{ maxWidth: 400, margin: '0 auto' }}>
                    {(rsvp.rsvpClosed && !rsvp.submitted) || rsvp.alreadyDone || rsvp.submitted ? (
                      <div style={{ textAlign: 'center', padding: '4px 0' }}>
                        <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 23, color: INK, fontVariationSettings: SOFT }}>
                          {rsvp.rsvpClosed && !rsvp.submitted ? tr.rsvp_closed_title : rsvp.alreadyDone ? rsvpL.already_done : rsvp.thanksMsg}
                        </div>
                        <div style={{ fontSize: 14, color: MUTED, marginTop: 6 }}>
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
                          style={{
                            width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${LINE}`, borderRadius: 0,
                            padding: '12px 2px', fontFamily: serif, fontStyle: 'italic', fontSize: 19, color: INK, outline: 'none',
                          }}
                        />
                        <SuggestList
                          items={rsvp.suggestions}
                          activeIdx={rsvp.activeIdx} setActiveIdx={rsvp.setActiveIdx} onPick={rsvp.pick}
                        />
                        {rsvp.showNotFound && (
                          <div style={{ fontSize: 13, color: ROSE_TXT, marginTop: 8 }}>{rsvpL.not_in_list}</div>
                        )}

                        <div role="radiogroup" aria-label={L('rsvp', 'title', rsvpL.title)} style={{ marginTop: 14 }}>
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
                                  display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 48, padding: '0 2px',
                                  background: 'none', border: 'none', borderBottom: `1px solid ${EUCA}26`, cursor: 'pointer', textAlign: 'left',
                                  fontFamily: sans, fontSize: 16, fontWeight: active ? 500 : 400, color: active ? INK : MUTED,
                                }}
                              >
                                <span aria-hidden="true" style={{
                                  width: 14, height: 14, flex: '0 0 auto', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)',
                                  border: `1px solid ${active ? PEONY : EUCA + '80'}`, background: active ? PEONY : 'transparent',
                                }} />
                                {label}
                              </button>
                            )
                          })}
                        </div>

                        {rsvp.status === 'yes' && (
                          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                            <span style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>{rsvpL.plusq}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: '0 0 auto' }}>
                              <button type="button" onClick={rsvp.decPlusOne} disabled={rsvp.plusOne === 0} data-press aria-label="Azalt"
                                style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${LINE}`, background: 'transparent', color: INK, fontSize: 18, cursor: 'pointer', opacity: rsvp.plusOne === 0 ? 0.35 : 1 }}>
                                −
                              </button>
                              <span style={{ fontFamily: serif, fontSize: 24, color: INK, width: 30, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
                                {rsvp.plusOne}
                              </span>
                              <button type="button" onClick={rsvp.incPlusOne} disabled={rsvp.plusOne === rsvp.maxExtraGuests} data-press aria-label="Artır"
                                style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${LINE}`, background: 'transparent', color: INK, fontSize: 18, cursor: 'pointer', opacity: rsvp.plusOne === rsvp.maxExtraGuests ? 0.35 : 1 }}>
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
                              minWidth: 200, minHeight: 46, padding: '0 28px', borderRadius: 999, background: 'transparent',
                              border: `1px solid ${rsvp.canSubmit ? EUCA : LINE}`, color: rsvp.canSubmit ? EUCA : MUTED,
                              fontFamily: sans, fontSize: 15, fontWeight: 500, opacity: rsvp.canSubmit ? 1 : 0.6,
                              cursor: rsvp.canSubmit ? 'pointer' : 'not-allowed',
                            }}
                          >
                            {rsvp.sending ? '…' : rsvpL.send}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                  {/* ⚠ Phase 27: RSVP statistika paneli qonağa göstərilmir */}
                </Bed>
              )}

              {/* 12 — TƏBRİK KİTABI: bağ qeydləri */}
              {S.guestbook && (
                <Bed section="guestbook" title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
                  <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 30 }}>
                    <input
                      type="text"
                      value={gbook.name}
                      onChange={(e) => gbook.setName(e.target.value)}
                      placeholder={gbookL.namePh}
                      style={field}
                    />
                    <textarea
                      value={gbook.text}
                      onChange={(e) => gbook.setText(e.target.value)}
                      placeholder={gbookL.msgPh}
                      rows={3}
                      style={{ ...field, borderRadius: 22, resize: 'none', lineHeight: 1.5 }}
                    />
                    <button
                      type="submit"
                      disabled={!gbook.canSubmit}
                      data-press
                      style={{
                        ...pill(TH, true), width: '100%', minHeight: 50, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed',
                        ...(gbook.canSubmit ? {} : { background: '#E3E9E1', color: '#7D8A81', boxShadow: 'none' }),
                      }}
                    >
                      {gbook.sending ? gbookL.sending : gbookL.btn}
                    </button>
                    {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 13, color: INK }}>⚠ {gbookL.error}</p>}
                  </form>

                  <div style={{ display: 'grid', gap: 22 }}>
                    {gbook.messages.map((raw, i) => {
                      const m = gbook.readMessage(raw)
                      return (
                        <figure key={m.name + i} style={{ margin: 0, position: 'relative' }}>
                          <span aria-hidden="true" style={{
                            position: 'absolute', left: -43, top: 4, width: 20, height: 20,
                            backgroundImage: BLOSSOM_DATA_URI, backgroundSize: 'contain', opacity: 0.85,
                          }} />
                          <blockquote style={{
                            margin: 0, fontFamily: serif, fontStyle: 'italic', fontWeight: 300, fontSize: 19,
                            lineHeight: 1.5, color: INK, fontVariationSettings: SOFT,
                          }}>
                            “{m.text}”
                          </blockquote>
                          <figcaption style={{ marginTop: 8, fontSize: 13.5, color: MUTED }}>
                            {m.name}{m.date ? `, ${gbook.formatDate(m.date)}` : ''}
                          </figcaption>
                        </figure>
                      )
                    })}
                  </div>
                </Bed>
              )}
            </div>

            {/* 12.5 — SİFARİŞ CTA (yalnız builder önbaxışında) */}
            <OrderCta
              theme={TH} weddingData={weddingData} lang={lang}
              pageSlug={gallery.pageSlug} isDemoMode={isDemoMode}
              effectiveSlug={gallery.effectiveSlug} serif={serif}
            />

            {/* 13 — SON HİSSƏ: demo CTA + footer */}
            <TemplateOutro
              theme={TH} weddingData={weddingData} lang={lang}
              isDemoMode={isDemoMode} isCouple={isCouple} isCorp={isCorp}
              eventLabel={eventLabel} serif={serif}
              footer={sectionHead(L, 'footer')} wrapNames
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
</ThemeCtx.Provider>
  )
}

/* Xəritənin mərkəzində kiçik çiçək nişanı */
function BlossomPin() {
  return (
    <span aria-hidden="true" style={{
      position: 'absolute', left: '50%', top: '50%', width: 30, height: 30, marginLeft: -15, marginTop: -15,
      backgroundImage: BLOSSOM_DATA_URI, backgroundSize: 'contain',
      filter: 'drop-shadow(0 3px 5px rgba(33,50,41,.3))', pointerEvents: 'none',
    }} />
  )
}
