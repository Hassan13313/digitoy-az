/* DONDURULMUŞ v2 SURƏTİ (2026-11-13) — redaktə etməyin, bax legacy/registry.js */
import { motion } from 'framer-motion'
import LanguageSwitcher from '../../../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSectionLux'
import MapSection from '../../../_shared/MapSection'
import { EmblemSlot } from '../../../_shared/MonoContent'
import { Reveal, PopDigit, enterDirection } from '../../../_shared/motion'
import { getTemplateTheme } from '../../../templateConfig'
import { useInvitation, useGate, openingNames, alpha } from '../../../_shared/useInvitation'
import { MusicFab, EqBars, StoryBlock, InvitationEnd, ReplyForm } from '../../../_shared/invitationKit'
import { VenueLinks, SeatFinder, PhotoQr, GuestbookForm } from '../../../_shared/blocks'
import { galleryDesc, tableSize, yearsSentence } from '../../../_shared/kids'
import { C as PAL, SILVER_GRAD, NIGHT_BG, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Locket, SmallHeart, ChainRule } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../../../_shared/palette'
import FilmReel from '../../../_shared/FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   SILVER LOCKET — «Gümüş medalyon» (İldönümü konsepti, 2026-10)

   Konsept: gümüş toy (25 il) — zəncirdən asılan ürək medalyon, gecə mavisi
   və gümüş, incə qızılgül çaları. Açılışda medalyon bağlıdır; toxunanda
   qapağı yana açılır, içində birlikdə keçən illər həkk olunub. Daxildə:
     hero      → açıq medalyon, adlar Cormorant italik
     sayğac    → dörd gümüş medalyon
     proqram   → gümüş zəncir boyunca ürəklər
     masa      → medalyonun içində masa nömrəsi
   Şriftlər: Cormorant Garamond (başlıq) · Mulish (mətn) — Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('silver-locket')
const ID = 'silver-locket'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['ROSE_D'], secondary: ['ROSE'], accent: ['SILVER'], background: ['IVORY'], text: ['INK'] }

const KEYFRAMES = (C) => (`
@keyframes sl2-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes sl2-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes sl2-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes sl2-swing { 0%,100% { transform: rotate(-2.5deg) } 50% { transform: rotate(2.5deg) } }
@keyframes sl2-glint { 0%,100% { opacity: 0; transform: scale(.4) } 50% { opacity: 1; transform: scale(1) } }
[data-sl2] span[aria-hidden="true"], [data-sl2] svg[aria-hidden="true"], [data-sl2] div[aria-hidden="true"] { pointer-events: none; }
[data-sl2] ::placeholder { color: rgba(124,133,146,.65); }
[data-sl2] [data-dark] ::placeholder { color: rgba(201,206,214,.5); }
[data-sl2] input:focus-visible, [data-sl2] textarea:focus-visible { border-color: ${C.ROSE_D} !important; outline: none; }
[data-sl2] button:focus-visible, [data-sl2] a:focus-visible, [data-sl2] [role="button"]:focus-visible { outline: 2px solid ${C.SILVER}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-sl2] *, [data-sl2] { animation: none !important; transition: none !important; } }
`)

const IVORY_BG = (C) => (`radial-gradient(90% 60% at 50% 0%, #FFFFFF, transparent 70%), ${C.IVORY}`)
const silverText = (C) => ({ backgroundImage: SILVER_GRAD(C), WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent' })

function yearsParts(age, lang, strings) {
  if (!age) return null
  const s = yearsSentence(age, lang, strings)
  return { n: String(age), word: s.replace(String(age), '').trim() }
}

/* ═══ 01 — AÇILIŞ: medalyon açılır ═══ */
function LocketOpening({ inv, theme, lang }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  const yp = yearsParts(inv.age, lang, inv.strings)
  return (
    <motion.div {...gate.gateProps} data-sl2
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: `radial-gradient(60% 40% at 50% 36%, #2A3242, ${C.NIGHT} 75%)`, color: C.IVORY, fontFamily: theme.fonts.body }}>
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ marginTop: 40, transformOrigin: '50% -140px', animation: go ? 'none' : 'sl2-swing 4s ease-in-out infinite' }}>
          <Locket width="min(46vw, 184px)" open={go} uid="sl2-op"
            style={{ transform: go ? 'translateX(44%)' : 'none', transition: 'transform 1.2s cubic-bezier(.5,0,.2,1) .1s' }}
            front={(
              <EmblemSlot mono={ot.mono} size={60} border="1px solid rgba(125,132,142,.5)" background="transparent" color="#6E7580" font={head} style={{ animation: 'none', margin: 0 }}>
                <SmallHeart size={34} color="#A9B0BA" style={{ margin: '0 auto' }} />
              </EmblemSlot>
            )}
            inside={yp ? (
              <>
                <span style={{ fontFamily: head, fontWeight: 500, fontSize: 'clamp(40px, 12vw, 56px)', lineHeight: 1, color: '#4A515C' }}>{yp.n}</span>
                <span style={{ fontFamily: head, fontStyle: 'italic', fontSize: 15, color: '#5A6372' }}>{yp.word}</span>
              </>
            ) : <SmallHeart size={44} color={C.ROSE_D} />} />
        </div>
        <div style={{ marginTop: 30, animation: 'sl2-rise 1s ease-out .3s both' }}>
          {ot.show('kicker') && <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '.32em', textTransform: 'uppercase', color: C.SILVER_D }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 8, fontFamily: head, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(38px, 11.4vw, 54px)', lineHeight: 1.06, overflowWrap: 'anywhere', ...silverText(C) }}>
              {first}{second && <><span style={{ display: 'inline-block', margin: '0 .2em', color: C.ROSE, WebkitTextFillColor: C.ROSE }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 10, fontSize: 14, letterSpacing: '.08em', color: C.MUTED }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: 24 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: SILVER_GRAD(C), color: C.INK, fontWeight: 600, fontSize: 14.5, letterSpacing: '.06em', boxShadow: '0 12px 26px -12px rgba(201,206,214,.5)', animation: 'sl2-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 13.5, color: C.FAINT, animation: 'sl2-fade .8s ease-out 1.1s both, sl2-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dark = false }) {
  const C = usePalette(PAL)
  const mute = dark ? C.MUTED : C.MUTED
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? NIGHT_BG : IVORY_BG(C), color: dark ? C.IVORY : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <ChainRule width={200} color={dark ? C.SILVER : C.SILVER_D} />
            {title && <h2 style={{ margin: '14px 0 0', fontFamily: head, fontStyle: 'italic', fontWeight: 400, fontSize: scaleFont('clamp(32px, 9.4vw, 44px)', C.hs), lineHeight: 1.1, textWrap: 'balance', ...(dark ? silverText(C) : { color: C.INK }) }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontSize: 12.5, fontWeight: 600, letterSpacing: '.26em', textTransform: 'uppercase', color: mute }}>{kicker}</div>}
            {sub && <p style={{ margin: '10px auto 0', maxWidth: 340, fontSize: 15.5, color: mute, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: '#FFFFFF', border: `1px solid ${alpha(C.SILVER_D, 0.5)}`, borderRadius: 12,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
})
const darkField = (C) => ({ ...field(C), background: alpha('#000000', 0.25), border: `1px solid ${alpha(C.SILVER, 0.35)}`, color: C.IVORY })
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 14.5, fontWeight: 600, letterSpacing: '.04em', textDecoration: 'none', cursor: 'pointer',
  background: on ? C.INK : 'transparent', color: on ? C.SILVER_L : C.INK, border: `1px solid ${on ? C.INK : alpha(C.INK, 0.35)}`,
}))
const darkBtn = (C) => ((on) => ({ ...btn(C)(on), background: on ? SILVER_GRAD(C) : 'transparent', color: on ? C.INK : C.SILVER_L, border: `1px solid ${on ? C.SILVER : alpha(C.SILVER, 0.45)}` }))
const suggest = (C) => ({ bg: '#FFFFFF', border: `1px solid ${alpha(C.SILVER_D, 0.45)}`, active: alpha(C.ROSE, 0.2), text: C.INK, table: C.ROSE_D, radius: 12 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function SilverLocketTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const yp = yearsParts(inv.age, lang, inv.strings)

  return (
    <PaletteContext.Provider value={C}><div data-sl2 lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.IVORY, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.SILVER, 0.35),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <LocketOpening inv={inv} theme={theme} lang={lang} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: SILVER_GRAD(C), boxShadow: '0 8px 20px rgba(20,25,35,.4)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.INK} idle={alpha(C.INK, 0.35)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.NIGHT, 0.92), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.SILVER, 0.25)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontStyle: 'italic', fontSize: 21, ...silverText(C) }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — açıq medalyon */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: NIGHT_BG, padding: '150px 22px 58px', textAlign: 'center', color: C.IVORY }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Locket width="min(42vw, 168px)" open instant uid="sl2-hero"
                inside={yp ? (
                  <>
                    <span style={{ fontFamily: head, fontWeight: 500, fontSize: 'clamp(34px, 10vw, 48px)', lineHeight: 1, color: '#4A515C' }}>{yp.n}</span>
                    <span style={{ fontFamily: head, fontStyle: 'italic', fontSize: 13.5, color: '#5A6372' }}>{yp.word}</span>
                  </>
                ) : <SmallHeart size={38} color={C.ROSE_D} />} style={{ transform: 'translateX(44%)' }} />
            </div>
            <div style={{ marginTop: 28, fontSize: 12.5, fontWeight: 600, letterSpacing: '.32em', textTransform: 'uppercase', color: C.SILVER_D }}>{L('hero', 'kicker', inv.eventLabel)}</div>
            <h1 style={{ margin: '10px 0 0', fontFamily: head, fontStyle: 'italic', fontWeight: 400, fontSize: nameSize(heroName), lineHeight: 1.05, overflowWrap: 'anywhere', ...silverText(C), animation: 'sl2-rise 1s ease-out .2s both' }}>{heroName}</h1>
            {yp && <div style={{ marginTop: 10, fontFamily: head, fontStyle: 'italic', fontSize: 22, color: C.ROSE }}>{yearsSentence(inv.age, lang, inv.strings)}</div>}
            <ChainRule width={220} style={{ marginTop: 18 }} />
            <div style={{ marginTop: 16, fontFamily: head, fontSize: 'clamp(21px, 6vw, 26px)', color: C.IVORY }}>{inv.fullDate}</div>
            <div style={{ marginTop: 6, fontSize: 15, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 14.5, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <p style={{ margin: '18px auto 0', maxWidth: 330, fontFamily: head, fontStyle: 'italic', fontSize: 19, lineHeight: 1.55, color: alpha(C.IVORY, 0.82) }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — gümüş medalyonlar */}
          {S.countdown && (
            <Panel section="countdown" head={head} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ aspectRatio: '1', borderRadius: '50%', padding: 4, background: `conic-gradient(from 200deg, #8D949E, #F4F6F9, ${C.SILVER}, #FFFFFF, #9AA1AB, #DDE1E6, #8D949E)`, boxShadow: '0 12px 20px -12px rgba(20,25,35,.55)' }}>
                      <div style={{ height: '100%', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 40% 35%, #FFFFFF, #E4E7EB 70%)', boxShadow: 'inset 0 2px 6px rgba(0,0,0,.15)' }}>
                        <span style={{ fontFamily: head, fontWeight: 500, fontSize: 'clamp(24px, 7vw, 32px)', lineHeight: 1, color: C.INK, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                      </div>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 11.5, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: C.MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} dark title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: 5, borderRadius: 26, background: SILVER_GRAD(C), boxShadow: '0 26px 40px -24px rgba(0,0,0,.8)' }}>
                <div style={{ borderRadius: 21, overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.ROSE_D} height="clamp(250px, 70vw, 320px)"
                    map={{ opacity: 0.85, filter: 'grayscale(.7) brightness(1.02)', tintOpacity: 0.12, tint: C.ROSE, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: IVORY_BG(C) }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontStyle: 'italic', fontSize: 27, lineHeight: 1.2, color: C.IVORY }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 6, fontSize: 12.5, fontWeight: 600, letterSpacing: '.22em', textTransform: 'uppercase', color: C.MUTED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={darkBtn(C)} />
            </Panel>
          )}

          {/* PROQRAM — zəncir */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ position: 'relative', maxWidth: 380, margin: '0 auto' }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: 23, top: 16, bottom: 16, width: 4, backgroundImage: `radial-gradient(ellipse 2px 3px, transparent 1px, ${C.SILVER_D} 1.4px, ${C.SILVER_D} 2px, transparent 2.4px)`, backgroundSize: '4px 7px' }} />
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '50px minmax(0, 1fr)', gap: 10, alignItems: 'center', padding: '10px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}><SmallHeart size={22} color={i % 2 ? C.ROSE : '#A9B0BA'} /></div>
                    <div>
                      <div style={{ fontFamily: head, fontWeight: 500, fontSize: 20, color: C.ROSE_D, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                      <div style={{ marginTop: 1, fontSize: 16.5, lineHeight: 1.35, color: C.INK }}>{ev.label}</div>
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

          {/* MASA — medalyonun içi */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} dark title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="sl2-seat-list" field={darkField(C)} suggest={suggest(C)} font={body} muted={C.MUTED} accent={C.SILVER_L}
                nameStyle={{ fontFamily: head, fontStyle: 'italic', fontSize: 26 }}
                card={(num) => (
                  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
                    <Locket width={150} open uid="sl2-seat" chain={false} style={{ transform: 'translateX(44%)' }}
                      inside={(
                        <>
                          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.24em', textTransform: 'uppercase', color: '#5A6372' }}>{T.table}</span>
                          <span style={{ fontFamily: head, fontWeight: 500, fontSize: tableSize(num, 52), lineHeight: 1, color: '#3A414B' }}>{num}</span>
                        </>
                      )} />
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 32 }} />}
              <PhotoQr inv={inv} tr={tr} fg={C.INK} bg="#FFFFFF" frame={{ borderRadius: 18, border: '4px solid #DDE1E6', boxShadow: '0 0 0 1px #9AA1AB' }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.SILVER_D, 0.6), hair: alpha(C.SILVER_D, 0.3), accent: C.ROSE_D,
                font: body, display: head, displayItalic: true, btnFont: body,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><SmallHeart size={34} color={C.ROSE_D} /></div>,
                marker: (a) => (a ? <SmallHeart size={14} color={C.ROSE_D} /> : <span style={{ display: 'block', width: 14, height: 14, borderRadius: '50%', border: `1px solid ${alpha(C.SILVER_D, 0.7)}` }} />),
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField(C)} btn={darkBtn(C)} errorColor={C.ROSE} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '20px 20px 16px', borderRadius: 18, background: alpha('#FFFFFF', 0.05), border: `1px solid ${alpha(C.SILVER, 0.22)}` }}>
                      <blockquote style={{ margin: 0, fontFamily: head, fontStyle: 'italic', fontSize: 19.5, lineHeight: 1.5, color: C.IVORY }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: C.SILVER }}>
                        <SmallHeart size={11} color={C.ROSE} /><span>{msg.name}{msg.date ? <span style={{ fontWeight: 400, letterSpacing: '.04em', textTransform: 'none', color: C.FAINT }}> · {gbook.formatDate(msg.date)}</span> : null}</span>
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
      <span style={{ position: 'absolute', left: -18, top: -40, filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.35))' }}><SmallHeart size={36} color={C.ROSE_D} /></span>
    </span>
  )
}
