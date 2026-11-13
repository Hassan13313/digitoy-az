/* DONDURULMUŞ v2 SURƏTİ (2026-11-13) — redaktə etməyin, bax legacy/registry.js */
import { motion } from 'framer-motion'
import LanguageSwitcher from '../../../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../../../_shared/MapSection'
import { EmblemSlot } from '../../../_shared/MonoContent'
import { Reveal, PopDigit, enterDirection } from '../../../_shared/motion'
import { getTemplateTheme } from '../../../templateConfig'
import { useInvitation, useGate, openingNames, alpha } from '../../../_shared/useInvitation'
import { MusicFab, EqBars, StoryBlock, InvitationEnd, ReplyForm } from '../../../_shared/invitationKit'
import { VenueLinks, SeatFinder, PhotoQr, GuestbookForm } from '../../../_shared/blocks'
import { galleryDesc, tableSize } from '../../../_shared/kids'
import { C as PAL, NIGHT_BG, EMBER_BG, PAPER_BG, FIRE_GRAD, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Bonfire, Buta, ButaRule, Lamp } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../../../_shared/palette'
import FilmReel from '../../../_shared/FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   NOVRUZ BONFIRE — «Tonqal gecəsi» (Bayram gecələri konsepti, 2026-10)

   Konsept: Novruzun axır çərşənbə gecəsi — ulduzlu səma və tonqal.
   Açılışda odunlar yığılıb, yalnız közlər parlayır; toxunanda tonqal alovlanır,
   qığılcımlar göyə qalxır, isti işıq ekrana yayılır. Daxildə: buta naxışları,
   köz kimi parlayan sayğac, alov nişanlı proqram, mis çıraqda masa nömrəsi.
   Şriftlər: Roboto Slab (başlıq) · Noto Sans (mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('novruz-bonfire')
const ID = 'novruz-bonfire'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['RED'], secondary: ['EMBER'], accent: ['FLAME'], background: ['PAPER'], text: ['INK'] }

const KEYFRAMES = (C) => (`
@keyframes nb-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes nb-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes nb-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes nb-flick { 0% { transform: scale(1, 1) skewX(0) } 50% { transform: scale(.96, 1.06) skewX(2deg) } 100% { transform: scale(1.03, .95) skewX(-2deg) } }
@keyframes nb-spark { 0% { opacity: 0; transform: translate(0, 0) } 15% { opacity: 1 } 100% { opacity: 0; transform: translate(var(--dx), -180px) } }
@keyframes nb-glow { from { opacity: .6 } to { opacity: 1 } }
[data-nb] span[aria-hidden="true"], [data-nb] svg[aria-hidden="true"], [data-nb] div[aria-hidden="true"] { pointer-events: none; }
[data-nb] ::placeholder { color: rgba(133,112,95,.7); }
[data-nb] [data-dark] ::placeholder { color: rgba(251,243,228,.45); }
[data-nb] input:focus-visible, [data-nb] textarea:focus-visible { border-color: ${C.EMBER} !important; outline: none; }
[data-nb] button:focus-visible, [data-nb] a:focus-visible, [data-nb] [role="button"]:focus-visible { outline: 2px solid ${C.FLAME}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-nb] *, [data-nb] { animation: none !important; transition: none !important; } }
`)

const fireText = (C) => ({ backgroundImage: FIRE_GRAD(C), WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent' })
const Hills = () => (
  <svg aria-hidden="true" viewBox="0 0 400 80" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '22%' }}>
    <path d="M0 50C60 20 120 30 180 46S300 24 400 40V80H0Z" fill="#140C26" />
    <path d="M0 64C80 48 160 56 240 66S340 54 400 60V80H0Z" fill="#0C0718" />
  </svg>
)

/* ═══ 01 — AÇILIŞ: tonqal alovlanır ═══ */
function FireOpening({ inv, theme }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-nb
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: NIGHT_BG, color: C.CREAM, fontFamily: theme.fonts.body }}>
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 45% at 50% 70%, rgba(255,122,26,.35), transparent 70%)', opacity: go ? 1 : 0, transition: 'opacity .8s ease .2s' }} />
      <Hills />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ animation: 'nb-rise 1s ease-out .2s both' }}>
          {ot.show('kicker') && <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.26em', textTransform: 'uppercase', color: C.FLAME }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 10, fontFamily: head, fontWeight: 800, fontSize: 'clamp(36px, 10.6vw, 50px)', lineHeight: 1.04, overflowWrap: 'anywhere', ...fireText(C) }}>
              {first}{second && <> {ot.text('and')} {second}</>}
            </div>
          )}
          <ButaRule color={C.EMBER} width={180} style={{ marginTop: 12 }} />
        </div>
        <div style={{ position: 'relative', marginTop: 30 }}>
          <Bonfire size={210} lit={go} />
          {!go && (
            <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '38%', transform: 'translate(-50%, -50%)' }}>
              <EmblemSlot mono={ot.mono} size={58} border={`1.5px solid ${C.EMBER}`} background="rgba(26,18,48,.6)" color={C.FLAME} font={head} style={{ animation: 'none', margin: 0 }}>
                <span />
              </EmblemSlot>
            </div>
          )}
        </div>
        <div style={{ marginTop: 18, animation: 'nb-rise 1s ease-out .35s both' }}>
          {ot.show('meta') && <div style={{ fontSize: 16, color: alpha(C.CREAM, 0.75) }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.25 }} style={{ marginTop: 18 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: FIRE_GRAD(C), color: C.NIGHT_D, fontFamily: head, fontWeight: 700, fontSize: 17, boxShadow: '0 12px 28px -10px rgba(255,122,26,.75)', animation: 'nb-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 14.5, color: alpha(C.CREAM, 0.55), animation: 'nb-fade .8s ease-out 1.1s both, nb-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dark = false }) {
  const C = usePalette(PAL)
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? EMBER_BG : PAPER_BG(C), color: dark ? C.CREAM : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Buta size={26} color={dark ? C.FLAME : C.RED} style={{ margin: '0 auto 10px' }} />
            {kicker && <div style={{ marginBottom: 6, fontSize: 12.5, fontWeight: 600, letterSpacing: '.24em', textTransform: 'uppercase', color: dark ? C.FLAME : C.RED }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 800, fontSize: scaleFont('clamp(28px, 8.2vw, 38px)', C.hs), lineHeight: 1.12, textWrap: 'balance', ...(dark ? fireText(C) : { color: C.INK }) }}>{title}</h2>}
            {sub && <p style={{ margin: '12px auto 0', maxWidth: 340, fontSize: 16, color: dark ? alpha(C.CREAM, 0.72) : C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: '#FFFCF5', border: `1.5px solid ${alpha(C.WOOD, 0.25)}`, borderRadius: 12,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
})
const darkField = (C) => ({ ...field(C), background: alpha('#000000', 0.22), border: `1.5px solid ${alpha(C.EMBER, 0.35)}`, color: C.CREAM })
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 15.5, fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.RED : 'transparent', color: on ? '#FFFFFF' : C.INK, border: `1.5px solid ${on ? C.RED : alpha(C.INK, 0.3)}`,
}))
const darkBtn = (C) => ((on) => ({ ...btn(C)(on), background: on ? FIRE_GRAD(C) : 'transparent', color: on ? C.NIGHT_D : C.CREAM, border: `1.5px solid ${on ? C.FLAME : alpha(C.CREAM, 0.4)}` }))
const suggest = (C) => ({ bg: '#FFFCF5', border: `1.5px solid ${alpha(C.WOOD, 0.25)}`, active: alpha(C.FLAME, 0.25), text: C.INK, table: C.RED, radius: 12 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function NovruzBonfireTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)

  return (
    <PaletteContext.Provider value={C}><div data-nb lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.PAPER, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.EMBER, 0.4),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <FireOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.NIGHT, border: `1.5px solid ${C.EMBER}`, boxShadow: '0 8px 22px rgba(255,122,26,.35)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.FLAME} idle={alpha(C.FLAME, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.NIGHT_D, 0.94), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.EMBER, 0.35)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.CREAM, 0.72), fontSize: 15, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 800, fontSize: 20, ...fireText(C) }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — yanan tonqal */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: NIGHT_BG, padding: '34px 22px 64px', textAlign: 'center', color: C.CREAM }}>
            <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 360, background: 'radial-gradient(50% 50% at 50% 70%, rgba(255,122,26,.3), transparent 70%)' }} />
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}><Bonfire size={170} instant /></div>
            <div style={{ position: 'relative', marginTop: 18, fontSize: 13, fontWeight: 600, letterSpacing: '.26em', textTransform: 'uppercase', color: C.FLAME }}>{L('hero', 'kicker', T.fest)}</div>
            <h1 style={{ position: 'relative', margin: '10px 0 0', fontFamily: head, fontWeight: 800, fontSize: nameSize(heroName), lineHeight: 1.04, overflowWrap: 'anywhere', ...fireText(C), animation: 'nb-rise 1s ease-out .2s both' }}>{heroName}</h1>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ position: 'relative', marginTop: 10, fontSize: 16, color: alpha(C.CREAM, 0.75) }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <ButaRule color={C.EMBER} width={200} style={{ marginTop: 18 }} />
            <div style={{ position: 'relative', marginTop: 16, fontFamily: head, fontWeight: 700, fontSize: 'clamp(20px, 5.6vw, 24px)', color: C.CREAM }}>{inv.fullDate}</div>
            <div style={{ position: 'relative', marginTop: 6, fontSize: 15.5, color: alpha(C.CREAM, 0.7) }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            <p style={{ position: 'relative', margin: '18px auto 0', maxWidth: 330, fontSize: 16.5, lineHeight: 1.6, color: alpha(C.CREAM, 0.85) }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — közlər */}
          {S.countdown && (
            <Panel section="countdown" head={head} dark title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ aspectRatio: '1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 60%, #3A2440, #1A1230 70%)', boxShadow: `inset 0 -8px 16px rgba(255,122,26,.35), 0 0 0 1.5px ${alpha(C.EMBER, 0.6)}, 0 10px 20px -8px rgba(255,122,26,.4)` }}>
                      <span style={{ fontFamily: head, fontWeight: 800, fontSize: 'clamp(22px, 6.6vw, 30px)', lineHeight: 1, fontVariantNumeric: 'tabular-nums', ...fireText(C) }}><PopDigit value={v} pop={pop} /></span>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 11.5, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: C.FLAME }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', borderRadius: 22, overflow: 'hidden', isolation: 'isolate', boxShadow: `0 0 0 4px ${C.CREAM}, 0 0 0 5.5px ${alpha(C.RED, 0.5)}, 0 24px 36px -22px rgba(42,26,20,.55)` }}>
                <MapSection
                  weddingData={weddingData} theme={theme} accent={C.RED} height="clamp(240px, 66vw, 300px)"
                  map={{ opacity: 0.92, filter: 'sepia(.25)', tintOpacity: 0.1, tint: C.EMBER, blend: 'multiply' }}
                  frame={<MapPin />}
                  fallback={<div style={{ height: 'clamp(240px, 66vw, 300px)', position: 'relative', background: PAPER_BG(C) }}><MapPin /></div>}
                />
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 800, fontSize: 25, lineHeight: 1.2, color: C.INK }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 6, fontSize: 15.5, color: C.MUTED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} />
            </Panel>
          )}

          {/* PROQRAM — alov nişanları */}
          {S.program && (
            <Panel section="program" head={head} dark title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ position: 'relative', maxWidth: 380, margin: '0 auto' }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: 21, top: 14, bottom: 14, width: 2, background: `linear-gradient(${C.FLAME}, ${alpha(C.EMBER, 0.15)})` }} />
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr)', gap: 12, alignItems: 'center', padding: '10px 0' }}>
                    <svg aria-hidden="true" viewBox="0 0 30 40" width="26" height="34" style={{ justifySelf: 'center', overflow: 'visible', filter: 'drop-shadow(0 0 6px rgba(255,122,26,.6))' }}>
                      <path d="M15 38C5 36 2 26 7 18C9 23 12 23 12 19C12 12 15 6 19 1C19 8 24 12 26 18C29 28 25 37 15 38Z" fill={i % 2 ? C.FLAME : C.EMBER} />
                    </svg>
                    <div>
                      <div style={{ fontFamily: head, fontWeight: 800, fontSize: 19, color: C.FLAME, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                      <div style={{ marginTop: 1, fontSize: 16.5, lineHeight: 1.35, color: C.CREAM }}>{ev.label}</div>
                    </div>
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

          {/* MASA — mis çıraq */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} dark title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="nb-seat-list" field={darkField(C)} suggest={suggest(C)} font={body} muted={alpha(C.CREAM, 0.72)} accent={C.FLAME}
                nameStyle={{ fontFamily: head, fontWeight: 800, fontSize: 24, color: C.CREAM }}
                card={(num) => (
                  <div style={{ paddingTop: 26 }}>
                    <Lamp size={220}>
                      <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.24em', textTransform: 'uppercase', color: '#5A3A10' }}>{T.table}{' '}</span>
                      <span style={{ fontFamily: head, fontWeight: 800, fontSize: tableSize(num, 40), lineHeight: 1, color: '#3E2508' }}>{num}</span>
                    </Lamp>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 32 }} />}
              <PhotoQr inv={inv} tr={tr} fg={C.NIGHT} bg="#FFFCF5" frame={{ borderRadius: 14, border: `1.5px solid ${alpha(C.RED, 0.4)}` }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'night')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.WOOD, 0.3), hair: alpha(C.WOOD, 0.15), accent: C.RED,
                font: body, display: head, displayItalic: false, btnFont: head,
                doneMark: <Buta size={40} color={C.RED} style={{ margin: '0 auto 10px' }} />,
                marker: (a) => <span style={{ display: 'block', width: 15, height: 15, borderRadius: '50%', border: `2px solid ${a ? C.RED : alpha(C.WOOD, 0.35)}`, background: a ? FIRE_GRAD(C) : 'transparent' }} />,
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField(C)} btn={darkBtn(C)} errorColor={C.FLAME} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ position: 'relative', margin: 0, padding: '20px 20px 16px 54px', borderRadius: 16, background: alpha('#000000', 0.2), border: `1px solid ${alpha(C.EMBER, 0.3)}` }}>
                      <Buta size={22} color={C.FLAME} style={{ position: 'absolute', left: 18, top: 20 }} />
                      <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.55, color: C.CREAM }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, fontFamily: head, fontWeight: 700, fontSize: 15, color: C.FLAME }}>
                        {msg.name}{msg.date ? <span style={{ fontFamily: body, fontWeight: 400, fontSize: 13, color: alpha(C.CREAM, 0.5) }}> · {gbook.formatDate(msg.date)}</span> : null}
                      </figcaption>
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
      <svg viewBox="0 0 30 40" width="34" height="46" style={{ position: 'absolute', left: -17, top: -42, overflow: 'visible', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.35))' }}>
        <path d="M15 38C5 36 2 26 7 18C9 23 12 23 12 19C12 12 15 6 19 1C19 8 24 12 26 18C29 28 25 37 15 38Z" fill={C.EMBER} />
      </svg>
    </span>
  )
}
