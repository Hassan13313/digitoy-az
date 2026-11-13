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
import { galleryDesc, tableSize } from '../../../_shared/kids'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Mandala, Leaf, DotRule, HennaHand } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../../../_shared/palette'
import FilmReel from '../../../_shared/FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   HENNA BUTA — «Xına naxışı» (Xına gecəsi konsepti, 2026-10)

   Konsept: gəlinin ovucuna çəkilən xına — mərkəzdə gül, baş barmaq tərəfində
   buta, barmaq ucları tünd xına ilə. Açılışda ovuc təmizdir; toxunanda naxış
   xətt-xətt özü çəkilir, barmaq ucları dolur. Daxildə:
     hero      → nazik xına gülü, ad Spectral ilə
     sayğac    → dörd mandala
     proqram   → xına sarmaşığı boyunca yarpaqlar
     masa      → böyük mandalanın ortasında rəqəm
     fotolar   → günbəz formalı, nöqtəli xına çərçivələr
   Şriftlər: Spectral (başlıq) · Commissioner (mətn) · Bad Script (yazı) —
   hamısında Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('henna-buta')
const ID = 'henna-buta'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['HENNA'], secondary: ['LEAF'], accent: ['TERRA'], background: ['CREAM'], text: ['INK'] }
const SCRIPT = "'Bad Script', 'Cormorant Garamond', Georgia, cursive"

const KEYFRAMES = (C) => (`
@keyframes hb-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes hb-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes hb-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes hb-spin { to { transform: rotate(360deg) } }
@keyframes hb-bloom { 0% { transform: scale(.6) rotate(-40deg); opacity: 0 } 100% { transform: none; opacity: 1 } }
[data-hb] span[aria-hidden="true"], [data-hb] svg[aria-hidden="true"], [data-hb] div[aria-hidden="true"] { pointer-events: none; }
[data-hb] ::placeholder { color: rgba(123,90,72,.6); }
[data-hb] input:focus-visible, [data-hb] textarea:focus-visible { border-color: ${C.HENNA} !important; outline: none; }
[data-hb] button:focus-visible, [data-hb] a:focus-visible, [data-hb] [role="button"]:focus-visible { outline: 2px solid ${C.TERRA}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-hb] *, [data-hb] { animation: none !important; transition: none !important; } }
`)

const PAPER = (C) => (`radial-gradient(120% 70% at 50% 0%, #FFFAF2, transparent 70%), ${C.CREAM}`)
const SAND = (C) => (`radial-gradient(120% 70% at 50% 0%, #F8EBDB, transparent 70%), ${C.SAND}`)

/* ═══ 01 — AÇILIŞ: xına özü çəkilir ═══ */
function HennaOpening({ inv, theme }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-hb
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: `radial-gradient(80% 50% at 50% 62%, #FFF6EA, ${C.SAND} 75%)`, color: C.INK, fontFamily: theme.fonts.body }}>
      <Mandala size={520} color={alpha(C.HENNA, 0.07)} petals={16} style={{ position: 'absolute', left: '50%', top: '58%', marginLeft: -260, marginTop: -260, animation: 'hb-spin 90s linear infinite' }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ animation: 'hb-rise 1s ease-out .2s both' }}>
          <EmblemSlot mono={ot.mono} size={52} border={`1px solid ${alpha(C.HENNA, 0.4)}`} background={alpha('#FFFFFF', 0.5)} color={C.HENNA} font={head} style={{ animation: 'none', margin: '0 auto 10px' }}>
            <Mandala size={30} petals={8} style={{ margin: '0 auto' }} />
          </EmblemSlot>
          {ot.show('kicker') && <div style={{ fontFamily: SCRIPT, fontSize: 24, color: C.TERRA }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 2, fontFamily: head, fontWeight: 300, fontSize: 'clamp(42px, 12.6vw, 58px)', lineHeight: 1.05, color: C.HENNA_D, overflowWrap: 'anywhere' }}>
              {first}{second && <><span style={{ display: 'block', fontFamily: SCRIPT, fontSize: '.5em', color: C.TERRA }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 8, fontSize: 15, letterSpacing: '.04em', color: C.MUTED }}>{ot.text('meta')}</div>}
        </div>

        <div style={{ position: 'relative', width: 'min(52vw, 210px)', marginTop: 18, transform: go ? 'rotate(-4deg) scale(1.04)' : 'rotate(-4deg)', transition: 'transform 1.4s ease', filter: 'drop-shadow(0 18px 22px rgba(90,35,12,.18))' }}>
          <HennaHand drawn={go} width="100%" />
        </div>

        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: 20 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 28px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: C.HENNA, color: C.CREAM, fontFamily: head, fontSize: 18, boxShadow: '0 12px 24px -10px rgba(90,35,12,.55)', animation: 'hb-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 10, fontSize: 13.5, color: C.MUTED, animation: 'hb-fade .8s ease-out 1.1s both, hb-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, sand = false }) {
  const C = usePalette(PAL)
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: sand ? SAND(C) : PAPER(C) }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <DotRule width={210} />
            {title && <h2 style={{ margin: '14px 0 0', fontFamily: head, fontWeight: 300, fontSize: scaleFont('clamp(30px, 8.6vw, 40px)', C.hs), lineHeight: 1.15, color: C.HENNA_D, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 6, fontFamily: SCRIPT, fontSize: 20, color: C.TERRA }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 340, fontSize: 15.5, color: C.MUTED, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: '#FFFCF7', border: `1px solid ${alpha(C.HENNA, 0.28)}`, borderRadius: 14,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
})
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 15.5, fontWeight: 500, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.HENNA : 'transparent', color: on ? C.CREAM : C.HENNA, border: `1px solid ${on ? C.HENNA : alpha(C.HENNA, 0.45)}`,
}))
const suggest = (C) => ({ bg: '#FFFCF7', border: `1px solid ${alpha(C.HENNA, 0.25)}`, active: alpha(C.SKIN, 0.6), text: C.INK, table: C.HENNA, radius: 14 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function HennaButaTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)

  return (
    <PaletteContext.Provider value={C}><div data-hb lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.CREAM, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.TERRA, 0.25),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <HennaOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.HENNA, border: `2px solid ${C.CREAM}`, boxShadow: '0 8px 20px rgba(90,35,12,.35)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.CREAM} idle={alpha(C.CREAM, 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.CREAM, 0.92), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.HENNA, 0.18)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: SCRIPT, fontSize: 21, color: C.HENNA }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — xına gülü */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: PAPER(C), padding: '54px 22px 60px', textAlign: 'center' }}>
            <Mandala size={460} color={alpha(C.HENNA, 0.09)} petals={16} style={{ position: 'absolute', left: '50%', top: 40, marginLeft: -230, animation: 'hb-spin 120s linear infinite' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: SCRIPT, fontSize: 28, color: C.TERRA, animation: 'hb-rise .8s ease-out .2s both' }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              <h1 style={{ margin: '6px 0 0', fontFamily: head, fontWeight: 300, fontSize: nameSize(heroName), lineHeight: 1.04, color: C.HENNA_D, overflowWrap: 'anywhere', animation: 'hb-rise 1s ease-out .35s both' }}>{heroName}</h1>
              <DotRule width={230} style={{ marginTop: 18 }} />
              <div style={{ marginTop: 18, fontFamily: head, fontSize: 'clamp(21px, 6vw, 26px)', color: C.INK }}>{inv.fullDate}</div>
              <div style={{ marginTop: 6, fontSize: 16, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 15, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              <div style={{ width: 'min(46vw, 180px)', margin: '26px auto 0', transform: 'rotate(-4deg)' }}>
                <HennaHand drawn instant width="100%" />
              </div>
              <p style={{ margin: '22px auto 0', maxWidth: 330, fontFamily: head, fontStyle: 'italic', fontWeight: 300, fontSize: 19, lineHeight: 1.55, color: C.MUTED }}>{tr.inv_join}</p>
            </div>
          </section>

          {/* SAYĞAC — mandalalar */}
          {S.countdown && (
            <Panel section="countdown" head={head} sand title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '18px 14px', maxWidth: 330, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop]) => (
                  <Mandala key={l} size={150} petals={12} disc="#FFFCF7" style={{ margin: '0 auto', maxWidth: '100%' }}>
                    <span style={{ fontFamily: head, fontWeight: 400, fontSize: 27, lineHeight: 1, color: C.HENNA_D, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                    <span style={{ marginTop: 1, fontFamily: SCRIPT, fontSize: 13.5, lineHeight: 1.1, color: C.TERRA }}>{l}</span>
                  </Mandala>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: 8, background: '#FFFCF7', borderRadius: 30, border: `1px solid ${alpha(C.HENNA, 0.35)}`, outline: `2px dotted ${alpha(C.HENNA, 0.55)}`, outlineOffset: 6, boxShadow: '0 20px 34px -26px rgba(90,35,12,.6)' }}>
                <div style={{ borderRadius: 23, overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.HENNA} height="clamp(250px, 70vw, 320px)"
                    map={{ opacity: 0.88, filter: 'sepia(.3) saturate(.8)', tintOpacity: 0.12, tint: C.TERRA, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: SAND(C) }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 26, fontFamily: head, fontSize: 26, lineHeight: 1.2, color: C.INK }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 15.5, color: C.MUTED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} />
            </Panel>
          )}

          {/* PROQRAM — xına sarmaşığı */}
          {S.program && (
            <Panel section="program" head={head} sand title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ position: 'relative', maxWidth: 380, margin: '0 auto' }}>
                <svg aria-hidden="true" viewBox="0 0 24 100" preserveAspectRatio="none" style={{ position: 'absolute', left: 14, top: 10, bottom: 10, width: 24, height: 'calc(100% - 20px)' }}>
                  <path d="M12 0C4 12 20 25 12 37C4 50 20 62 12 75C4 87 20 95 12 100" fill="none" stroke={alpha(C.HENNA, 0.55)} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
                </svg>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '52px minmax(0, 1fr)', gap: 12, alignItems: 'center', padding: '12px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <span style={{ display: 'flex', padding: 5, borderRadius: '50%', background: C.SAND }}>
                        <Leaf size={22} rotate={i % 2 ? 0 : -90} />
                      </span>
                    </div>
                    <div>
                      <div style={{ fontFamily: SCRIPT, fontSize: 20, color: C.TERRA, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                      <div style={{ marginTop: 1, fontSize: 17.5, lineHeight: 1.35, color: C.INK }}>{ev.label}</div>
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

          {/* MASA — mandala */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} sand title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="hb-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={C.MUTED} accent={C.HENNA}
                nameStyle={{ fontFamily: SCRIPT, fontSize: 26 }}
                card={(num) => (
                  <Mandala size={210} petals={14} disc="#FFFCF7" style={{ margin: '0 auto', animation: 'hb-bloom .9s cubic-bezier(.3,.8,.4,1) both' }}>
                    <span style={{ fontFamily: SCRIPT, fontSize: 16, lineHeight: 1, color: C.TERRA }}>{T.table}</span>
                    <span style={{ fontFamily: head, fontWeight: 400, fontSize: tableSize(num, 44), lineHeight: 1, color: C.HENNA_D }}>{num}</span>
                  </Mandala>
                )} />
            </Panel>
          )}

          {/* FOTOLAR — günbəz çərçivələr */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 32 }} />}
              <PhotoQr inv={inv} tr={tr} fg={C.HENNA_D} bg="#FFFCF7" frame={{ borderRadius: 22, border: `1px solid ${alpha(C.HENNA, 0.35)}`, outline: `2px dotted ${alpha(C.HENNA, 0.5)}`, outlineOffset: 5 }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'night')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} sand title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.HENNA, 0.4), hair: alpha(C.HENNA, 0.2), accent: C.HENNA,
                font: body, display: head, btnFont: body,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Mandala size={46} petals={10} /></div>,
                marker: (a) => (a ? <Mandala size={16} petals={8} color={C.HENNA} /> : <span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', border: `1px solid ${alpha(C.HENNA, 0.45)}` }} />),
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field(C)} btn={btn(C)} errorColor={C.HENNA} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, position: 'relative', padding: '20px 20px 18px', background: '#FFFCF7', borderRadius: 20, border: `1px solid ${alpha(C.HENNA, 0.2)}` }}>
                      <Leaf size={16} rotate={i % 2 ? 0 : -90} style={{ position: 'absolute', right: 16, top: 16, opacity: 0.7 }} />
                      <blockquote style={{ margin: 0, paddingRight: 18, fontFamily: head, fontStyle: 'italic', fontWeight: 300, fontSize: 18.5, lineHeight: 1.55, color: C.INK }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, fontFamily: SCRIPT, fontSize: 19, color: C.TERRA }}>{msg.name}{msg.date ? <span style={{ fontFamily: body, fontSize: 13.5, color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}</figcaption>
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
      <span style={{ position: 'absolute', left: -22, top: -22 }}><Mandala size={44} petals={10} /></span>
      <span style={{ position: 'absolute', left: -4, top: -4, width: 8, height: 8, borderRadius: '50%', background: C.HENNA }} />
    </span>
  )
}
