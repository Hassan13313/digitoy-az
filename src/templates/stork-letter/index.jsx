import { motion } from 'framer-motion'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../_shared/MapSection'
import { EmblemSlot } from '../_shared/MonoContent'
import { Reveal, PopDigit, enterDirection } from '../_shared/motion'
import { hidePhoto } from '../../utils/photoGallery'
import { getTemplateTheme } from '../templateConfig'
import { useInvitation, useGate, openingNames, alpha } from '../_shared/useInvitation'
import { MusicFab, EqBars, StoryBlock, InvitationEnd, ReplyForm } from '../_shared/invitationKit'
import { VenueLinks, SeatFinder, PhotoQr, GuestbookForm } from '../_shared/blocks'
import { galleryDesc, tableSize } from '../_shared/kids'
import { C as PAL, PAPER_BG, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Stork, Stamp, Postmark, WaxSeal } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'

/* ─────────────────────────────────────────────────────────────────────────────
   STORK LETTER — «Leyləkdən məktub» (Baby shower konsepti, 2026-10)

   Konsept: köhnə poçt məktubu — leylək körpəni gətirir. Kağız, poçt
   markaları, dairəvi ştamp, mum möhür; toz mavisi və terrakota.
   Açılışda möhürlü zərf; toxunanda möhür sınır, qapaq açılır və içindən
   leyləkli məktub qalxır. Daxildə:
     hero      → uçan leylək, ad əl yazısı ilə, tarix ştampda
     sayğac    → dörd poçt markası
     məkan     → poçt kartı kimi xəritə
     proqram   → xətli məktub kağızı, saatlar qırmızı haşiyədə
     masa      → markada masa nömrəsi və ştamp
   Şriftlər: Old Standard TT (başlıq) · Vollkorn (mətn) · Great Vibes (imza) —
   hamısında Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('stork-letter')
const ID = 'stork-letter'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['SEAL'], secondary: ['TERRA'], accent: ['DUSTY'], background: ['PAPER'], text: ['INK'] }
const SCRIPT = "'Great Vibes', 'Cormorant Garamond', Georgia, cursive"

const STAMP_COLORS = (C) => ([C.DUSTY, C.TERRA, '#9DB08F', C.SEPIA])

const KEYFRAMES = (C) => (`
@keyframes sl-flap { from { transform: rotate(-6deg) } to { transform: rotate(10deg) } }
@keyframes sl-glide { 0%,100% { transform: translate(0, 0) } 50% { transform: translate(6px, -8px) } }
@keyframes sl-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes sl-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes sl-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes sl-stamp { 0% { transform: scale(1.6) rotate(-20deg); opacity: 0 } 60% { transform: scale(.95) rotate(-8deg); opacity: 1 } 100% { transform: scale(1) rotate(-8deg); opacity: 1 } }
[data-sl] span[aria-hidden="true"], [data-sl] svg[aria-hidden="true"], [data-sl] div[aria-hidden="true"] { pointer-events: none; }
[data-sl] ::placeholder { color: rgba(119,108,97,.6); }
[data-sl] input:focus-visible, [data-sl] textarea:focus-visible { border-color: ${C.DUSTY_D} !important; outline: none; }
[data-sl] button:focus-visible, [data-sl] a:focus-visible, [data-sl] [role="button"]:focus-visible { outline: 2px solid ${C.SEAL}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-sl] *, [data-sl] { animation: none !important; transition: none !important; } }
`)

const DUSTY_BG = (C) => (`radial-gradient(90% 60% at 50% 0%, #8FA8BE, transparent 70%), ${C.DUSTY_D}`)

/** Zərf — `open` möhürü sındırır, qapağı açır, məktubu qaldırır */
function Envelope({ open, width, head, initial }) {
  const C = usePalette(PAL)
  return (
    <div aria-hidden="true" style={{ position: 'relative', width, aspectRatio: '1.45 / 1', perspective: 900 }}>
      {/* daxili arxa panel */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 6, background: '#D8C8AC', boxShadow: '0 22px 36px -22px rgba(62,58,54,.6)' }} />
      {/* məktub */}
      <div style={{ position: 'absolute', left: '7%', right: '7%', top: '8%', height: '84%', zIndex: 1, background: C.PAPER_L, borderRadius: 4, boxShadow: '0 4px 10px rgba(62,58,54,.15)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '6%', transform: open ? 'translateY(-62%)' : 'none', transition: 'transform .9s cubic-bezier(.3,.7,.3,1) .45s' }}>
        <Stork width="64%" flap={false} />
      </div>
      {/* cib (ön üçbucaqlar) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#EADFCB', clipPath: 'polygon(0 0, 52% 56%, 0 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: '#E5D8C1', clipPath: 'polygon(100% 0, 48% 56%, 100% 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: '#EFE5D3', clipPath: 'polygon(0 100%, 50% 46%, 100% 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.4)' }} />
      </div>
      {/* qapaq */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '60%', zIndex: open ? 0 : 3, transformOrigin: '50% 0', transform: open ? 'rotateX(180deg)' : 'none', transition: 'transform .6s ease .15s, z-index 0s linear .45s', transformStyle: 'preserve-3d' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#E2D4BB', clipPath: 'polygon(0 0, 100% 0, 50% 100%)', filter: 'drop-shadow(0 2px 2px rgba(62,58,54,.2))' }} />
        <div style={{ position: 'absolute', left: '50%', top: '100%', transform: 'translate(-50%, -62%)' }}>
          <WaxSeal size={58} cracked={open} initial={initial} font={head} />
        </div>
      </div>
    </div>
  )
}

/* ═══ 01 — AÇILIŞ: zərf açılır ═══ */
function LetterOpening({ inv, theme, T }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-sl
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: `radial-gradient(70% 50% at 50% 50%, #F4ECDE, #DDCDB2 90%)`, color: C.INK, fontFamily: theme.fonts.body }}>
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <motion.div animate={go ? { opacity: 0, y: -10 } : {}} transition={{ duration: 0.3, delay: 0.3 }} style={{ animation: 'sl-rise 1s ease-out .2s both' }}>
          <EmblemSlot mono={ot.mono} size={46} border={`1px solid ${alpha(C.SEAL, 0.5)}`} background="transparent" color={C.SEAL} font={head} style={{ animation: 'none', margin: '0 auto 8px' }}>
            <Stork width={40} flap={false} style={{ margin: '0 auto' }} />
          </EmblemSlot>
          {ot.show('kicker') && <div style={{ fontFamily: head, fontSize: 14, letterSpacing: '.24em', textTransform: 'uppercase', color: C.DUSTY_D }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 4, fontFamily: SCRIPT, fontSize: 'clamp(44px, 13vw, 62px)', lineHeight: 1.1, color: C.INK, overflowWrap: 'anywhere' }}>
              {first}{second && <><span style={{ display: 'inline-block', margin: '0 .2em', fontSize: '.7em', color: C.SEAL }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
        </motion.div>
        <div style={{ marginTop: 26 }}><Envelope open={go} width="min(80vw, 320px)" head={head} initial={Array.from(String(first || ''))[0] || ''} /></div>
        {ot.show('meta') && (
          <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 12, animation: 'sl-rise .9s ease-out .5s both' }}>
            <Postmark size={70} top={T.post} mid={inv.dp?.year || ''} bottom="" font={head} />
            <div style={{ fontFamily: head, fontStyle: 'italic', fontSize: 16, color: C.MUTED }}>{ot.text('meta')}</div>
          </div>
        )}
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: 20 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 28px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: C.SEAL, color: C.PAPER_L, fontFamily: head, fontSize: 17, letterSpacing: '.04em', boxShadow: '0 12px 24px -12px rgba(126,47,37,.7)', animation: 'sl-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 10, fontSize: 14, fontStyle: 'italic', color: C.MUTED, animation: 'sl-fade .8s ease-out 1.1s both, sl-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dusty = false }) {
  const C = usePalette(PAL)
  const mute = dusty ? alpha(C.PAPER_L, 0.82) : C.MUTED
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dusty ? DUSTY_BG(C) : PAPER_BG(C), color: dusty ? C.PAPER_L : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span style={{ width: 60, height: 6, background: `repeating-linear-gradient(90deg, ${C.SEAL} 0 10px, transparent 10px 14px, ${C.DUSTY} 14px 24px, transparent 24px 28px)` }} />
              <Stork width={44} flap={false} />
              <span style={{ width: 60, height: 6, background: `repeating-linear-gradient(90deg, ${C.SEAL} 0 10px, transparent 10px 14px, ${C.DUSTY} 14px 24px, transparent 24px 28px)` }} />
            </div>
            {title && <h2 style={{ margin: '12px 0 0', fontFamily: head, fontWeight: 400, fontSize: scaleFont('clamp(28px, 8vw, 36px)', C.hs), lineHeight: 1.15, color: dusty ? C.PAPER_L : C.INK, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontStyle: 'italic', fontSize: 16, color: mute }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 340, fontSize: 16, color: mute, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: C.PAPER_L, border: `1px solid ${alpha(C.SEPIA, 0.4)}`, borderRadius: 3,
  padding: '14px 16px', fontSize: 16.5, color: C.INK, outline: 'none',
})
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 16, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.SEAL : 'transparent', color: on ? C.PAPER_L : C.SEAL, border: `1px solid ${on ? C.SEAL : alpha(C.SEAL, 0.5)}`,
}))
const suggest = (C) => ({ bg: C.PAPER_L, border: `1px solid ${alpha(C.SEPIA, 0.35)}`, active: alpha(C.DUSTY_L, 0.6), text: C.INK, table: C.SEAL, radius: 3 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function StorkLetterTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const dp = inv.dp

  return (
    <PaletteContext.Provider value={C}><div data-sl lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.PAPER, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.DUSTY, 0.3),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <LetterOpening inv={inv} theme={theme} T={T} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.SEAL, border: `2px solid ${C.PAPER_L}`, boxShadow: '0 8px 18px rgba(126,47,37,.4)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.PAPER_L} idle={alpha(C.PAPER_L, 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.PAPER, 0.93), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.SEPIA, 0.3)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 15, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: SCRIPT, fontSize: 24, color: C.SEAL }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — məktub */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: PAPER_BG(C), padding: '34px 18px 58px' }}>
            <div style={{ position: 'relative', maxWidth: 420, margin: '0 auto', padding: '34px 22px 30px', background: C.PAPER_L, borderRadius: 4, boxShadow: '0 1px 0 rgba(255,255,255,.6) inset, 0 24px 40px -26px rgba(62,58,54,.55)', textAlign: 'center' }}>
              <div style={{ position: 'absolute', right: 14, top: 14 }}>
                <Stamp width={64} color={C.DUSTY} rotate={4}><Stork width="90%" flap={false} /></Stamp>
              </div>
              <div style={{ width: 'min(64vw, 230px)', margin: '10px auto 0', animation: 'sl-glide 4s ease-in-out infinite' }}><Stork width="100%" /></div>
              <div style={{ marginTop: 18, fontFamily: head, fontSize: 14, letterSpacing: '.26em', textTransform: 'uppercase', color: C.DUSTY_D }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              <h1 style={{ margin: '6px 0 0', fontFamily: SCRIPT, fontWeight: 400, fontSize: nameSize(heroName), lineHeight: 1.1, color: C.INK, overflowWrap: 'anywhere', animation: 'sl-rise 1s ease-out .3s both' }}>{heroName}</h1>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 18 }}>
                <Postmark size={84} top={T.post} mid={dp ? `${String(dp.day).padStart(2, '0')}·${dp.year}` : ''} bottom="" font={head} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: head, fontSize: 'clamp(18px, 5vw, 22px)', color: C.INK }}>{inv.fullDate}</div>
                  <div style={{ marginTop: 4, fontStyle: 'italic', fontSize: 15.5, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
                </div>
              </div>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 10, fontSize: 15, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              <p style={{ margin: '20px auto 0', maxWidth: 320, fontStyle: 'italic', fontSize: 17, lineHeight: 1.6, color: C.MUTED }}>{tr.inv_join}</p>
            </div>
          </section>

          {/* SAYĞAC — poçt markaları */}
          {S.countdown && (
            <Panel section="countdown" head={head} dusty title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(6px, 2.4vw, 12px)', maxWidth: 400, margin: '0 auto', justifyItems: 'center' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <Stamp key={l} width="min(20vw, 84px)" color={STAMP_COLORS(C)[i]} rotate={[-3, 2, -1.5, 3][i]}>
                    <span style={{ fontFamily: head, fontSize: 'clamp(22px, 6.6vw, 30px)', lineHeight: 1, color: C.PAPER_L, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                    <span style={{ marginTop: 4, fontSize: 12, letterSpacing: '.06em', color: alpha(C.PAPER_L, 0.9) }}>{l}</span>
                  </Stamp>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN — poçt kartı */}
          {S.venue && (
            <Panel section="venue" head={head} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ position: 'relative', maxWidth: 430, margin: '0 auto', padding: 10, background: C.PAPER_L, borderRadius: 4, boxShadow: '0 24px 40px -26px rgba(62,58,54,.55)', transform: 'rotate(-1deg)' }}>
                <div style={{ overflow: 'hidden', isolation: 'isolate', borderRadius: 2 }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.SEAL} height="clamp(250px, 70vw, 320px)"
                    map={{ opacity: 0.85, filter: 'sepia(.45) saturate(.75)', tintOpacity: 0.14, tint: C.SEPIA, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: C.PAPER_D }}><MapPin /></div>}
                  />
                </div>
                <div aria-hidden="true" style={{ position: 'absolute', right: -10, top: -14 }}><Postmark size={78} top={T.post} mid="✉" font={head} waves style={{ transform: 'rotate(-12deg)' }} /></div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 26, fontFamily: head, fontSize: 25, lineHeight: 1.2, color: C.INK }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontStyle: 'italic', fontSize: 16, color: C.MUTED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} />
            </Panel>
          )}

          {/* PROQRAM — xətli kağız */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 420, margin: '0 auto', padding: '26px 18px 22px 0', background: `repeating-linear-gradient(180deg, transparent 0 39px, ${alpha(C.DUSTY, 0.35)} 39px 40px), ${C.PAPER_L}`, backgroundPosition: '0 14px', borderRadius: 4, boxShadow: '0 20px 34px -24px rgba(62,58,54,.5)' }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '78px minmax(0, 1fr)', alignItems: 'baseline', minHeight: 40, padding: '6px 0' }}>
                    <div style={{ paddingRight: 12, textAlign: 'right', borderRight: `1.5px solid ${alpha(C.SEAL, 0.55)}`, fontFamily: head, fontSize: 17, color: C.SEAL, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    <div style={{ paddingLeft: 14, fontSize: 17, lineHeight: 1.4, color: C.INK }}>{ev.label}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" />
            </Panel>
          )}

          {/* MASA — marka */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} dusty title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="sl-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={alpha(C.PAPER_L, 0.85)} accent={C.PAPER_L}
                nameStyle={{ fontFamily: SCRIPT, fontSize: 34, lineHeight: 1.1 }}
                card={(num) => (
                  <div style={{ position: 'relative', display: 'inline-block', margin: '6px 0 10px' }}>
                    <Stamp width={150} color={C.TERRA} rotate={-3}>
                      <span style={{ fontSize: 13, letterSpacing: '.2em', textTransform: 'uppercase', color: alpha(C.PAPER_L, 0.9) }}>{T.table}</span>
                      <span style={{ fontFamily: head, fontSize: tableSize(num, 60), lineHeight: 1.05, color: C.PAPER_L }}>{num}</span>
                    </Stamp>
                    <div aria-hidden="true" style={{ position: 'absolute', right: -40, bottom: -10, animation: 'sl-stamp .6s ease-out .3s both' }}><Postmark size={84} top={T.post} mid={dp?.year || ''} color={C.SEAL_D} font={head} /></div>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR — poçt kartları */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, marginBottom: 32 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ aspectRatio: '4 / 5', overflow: 'hidden', background: C.PAPER_D, border: `6px solid ${C.PAPER_L}`, borderBottomWidth: 20, boxShadow: '0 12px 20px -12px rgba(62,58,54,.5)', transform: `rotate(${[-3, 2, -1.5, 2.5, -2, 1][i % 6]}deg)` }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.INK} bg={C.PAPER_L} frame={{ borderRadius: 3, boxShadow: `0 0 0 1px ${alpha(C.SEPIA, 0.4)}, 0 14px 24px -16px rgba(62,58,54,.5)` }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.SEPIA, 0.5), hair: alpha(C.SEPIA, 0.25), accent: C.SEAL,
                font: body, display: head, btnFont: body,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><WaxSeal size={46} initial={Array.from(String(heroName || ''))[0] || ''} font={head} /></div>,
                marker: (a) => (a ? <span style={{ display: 'block', width: 14, height: 14, borderRadius: '50%', background: C.SEAL, boxShadow: `0 0 0 2px ${C.PAPER_L}, 0 0 0 3px ${alpha(C.SEAL, 0.5)}` }} /> : <span style={{ display: 'block', width: 14, height: 14, borderRadius: '50%', border: `1px solid ${alpha(C.SEAL, 0.5)}` }} />),
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* MƏKTUBLAR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dusty title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field(C)} btn={(on) => ({ ...btn(C)(on), background: on ? C.PAPER_L : 'transparent', color: on ? C.SEAL : C.PAPER_L, border: `1px solid ${C.PAPER_L}` })} errorColor={C.PAPER_L} />
              <div style={{ display: 'grid', gap: 16 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, position: 'relative', padding: '20px 82px 18px 20px', background: `repeating-linear-gradient(180deg, transparent 0 29px, ${alpha(C.DUSTY, 0.25)} 29px 30px), ${C.PAPER_L}`, borderRadius: 3, boxShadow: '0 16px 26px -18px rgba(0,0,0,.5)', transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)` }}>
                      <div aria-hidden="true" style={{ position: 'absolute', right: 14, top: 14 }}>
                        <Stamp width={52} color={STAMP_COLORS(C)[i % 4]} rotate={6}><Stork width="88%" flap={false} /></Stamp>
                      </div>
                      <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: '30px', color: C.INK }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 6, fontFamily: SCRIPT, fontSize: 26, lineHeight: 1.1, color: C.SEAL }}>{msg.name}{msg.date ? <span style={{ fontFamily: body, fontSize: 13.5, color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}</figcaption>
                    </figure>
                  )
                })}
              </div>
            </Panel>
          )}

          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={head} />
        </motion.div>
      )}
    </div></PaletteContext.Provider>
  )
}

function MapPin() {
  const C = usePalette(PAL)
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -46, top: -74, animation: 'sl-glide 4s ease-in-out infinite' }}><Stork width={92} /></span>
      <span style={{ position: 'absolute', left: -5, top: -5, width: 10, height: 10, borderRadius: '50%', background: C.SEAL, boxShadow: `0 0 0 3px ${C.PAPER_L}` }} />
    </span>
  )
}
