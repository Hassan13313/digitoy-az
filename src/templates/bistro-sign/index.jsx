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
import { C, GREEN_BG, CREAM_BG, BRASS_GRAD, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Awning, StringLights, HangingSign, Saucer } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   BISTRO SIGN — «Açıqdır!» (Açılış konsepti, 2026-10)

   Konsept: yeni kafe/bistronun qapısı — zolaqlı tente, işıq girləndi və
   zəncirdən asılan emal lövhə. Açılışda lövhədə «Bağlı» yazılıb, lampalar
   sönükdür; toxunanda lövhə çevrilib «Açıq — Xoş gəlmisiniz!» olur,
   girləndin lampaları bir-bir yanır. Daxildə: nəlbəkilərdə sayğac, menyu
   kartı kimi proqram, «Rezerv» lövhəciyində masa, çek kağızında təbriklər.
   Şriftlər: Playfair Display (başlıq) · Noto Sans (mətn) · IBM Plex Mono (çek).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('bistro-sign')
const ID = 'bistro-sign'

const KEYFRAMES = `
@keyframes bs-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes bs-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes bs-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes bs-sway { 0%,100% { transform: rotate(-1.5deg) } 50% { transform: rotate(1.5deg) } }
[data-bs] span[aria-hidden="true"], [data-bs] svg[aria-hidden="true"], [data-bs] div[aria-hidden="true"] { pointer-events: none; }
[data-bs] ::placeholder { color: rgba(122,120,108,.7); }
[data-bs] [data-dark] ::placeholder { color: rgba(244,236,220,.5); }
[data-bs] input:focus-visible, [data-bs] textarea:focus-visible { border-color: ${C.GREEN} !important; outline: none; }
[data-bs] button:focus-visible, [data-bs] a:focus-visible, [data-bs] [role="button"]:focus-visible { outline: 2px solid ${C.BRASS}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-bs] *, [data-bs] { animation: none !important; transition: none !important; } }
`

const brassText = { backgroundImage: BRASS_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent' }

function SignFront({ T, head }) {
  return <span style={{ fontFamily: head, fontWeight: 900, fontSize: 'clamp(30px, 9vw, 42px)', letterSpacing: '.08em', textTransform: 'uppercase', color: C.WINE }}>{T.closed}</span>
}
function SignBack({ T, head }) {
  return (
    <>
      <span style={{ fontFamily: head, fontWeight: 900, fontSize: 'clamp(30px, 9vw, 42px)', lineHeight: 1.2, paddingBottom: '.06em', letterSpacing: '.08em', textTransform: 'uppercase', ...brassText }}>{T.open}</span>
      <span style={{ marginTop: 4, fontFamily: head, fontStyle: 'italic', fontSize: 15, color: C.CREAM }}>{T.welcome}</span>
    </>
  )
}

/* ═══ 01 — AÇILIŞ: lövhə «Açıq» tərəfə çevrilir ═══ */
function SignOpening({ inv, theme, lang }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  const T = inv.copy(TXT)
  return (
    <motion.div {...gate.gateProps} data-bs
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: go ? 'radial-gradient(70% 50% at 50% 40%, #3A6B54, #1F4D3A 70%)' : 'radial-gradient(70% 50% at 50% 40%, #234536, #132A20 70%)', transition: 'background .6s ease .3s', color: C.CREAM, fontFamily: theme.fonts.body }}>
      <Awning height={64} />
      <StringLights on={go} count={9} style={{ marginTop: 18 }} />
      <div style={{ position: 'relative', height: 'calc(100% - 132px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ transformOrigin: '50% 0', animation: 'bs-sway 4s ease-in-out infinite' }}>
          <HangingSign width="min(64vw, 250px)" open={go} front={<SignFront T={T} head={head} />} back={<SignBack T={T} head={head} />} />
        </div>
        <div style={{ marginTop: 26, animation: 'bs-rise 1s ease-out .3s both' }}>
          {ot.show('kicker') && <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.26em', textTransform: 'uppercase', color: C.BRASS_L }}>{ot.text('kicker')}</div>}
          <EmblemSlot mono={ot.mono} size={64} border={`1.5px solid ${C.BRASS}`} background="transparent" color={C.BRASS_L} font={head} style={{ animation: 'none', margin: '12px auto 0' }}>
            <span />
          </EmblemSlot>
          {titleOv !== '' && (
            <div style={{ marginTop: 8, fontFamily: head, fontStyle: 'italic', fontSize: 'clamp(34px, 10vw, 48px)', lineHeight: 1.08, overflowWrap: 'anywhere', color: C.CREAM }}>
              {first}{second && <><span style={{ display: 'inline-block', margin: '0 .2em', color: C.BRASS }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 8, fontSize: 15.5, color: alpha(C.CREAM, 0.7) }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.25 }} style={{ marginTop: 20 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: C.CREAM, color: C.GREEN_D, fontFamily: head, fontWeight: 700, fontSize: 17, boxShadow: `0 0 0 2px ${C.BRASS}, 0 12px 22px -12px rgba(0,0,0,.6)`, animation: 'bs-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 14.5, color: alpha(C.CREAM, 0.55), animation: 'bs-fade .8s ease-out 1.1s both, bs-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dark = false }) {
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? GREEN_BG : CREAM_BG, color: dark ? C.CREAM : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            {kicker && <div style={{ marginBottom: 6, fontSize: 12.5, fontWeight: 600, letterSpacing: '.24em', textTransform: 'uppercase', color: dark ? C.BRASS_L : C.WINE }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontStyle: 'italic', fontSize: 'clamp(30px, 8.8vw, 41px)', lineHeight: 1.12, textWrap: 'balance', color: dark ? C.CREAM : C.GREEN }}>{title}</h2>}
            <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14 }}>
              <span style={{ width: 40, height: 1.5, background: dark ? C.BRASS : C.GREEN }} />
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.BRASS }} />
              <span style={{ width: 40, height: 1.5, background: dark ? C.BRASS : C.GREEN }} />
            </div>
            {sub && <p style={{ margin: '12px auto 0', maxWidth: 340, fontSize: 16, color: dark ? alpha(C.CREAM, 0.72) : C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: C.CREAM_L, border: `1.5px solid ${C.LINE}`, borderRadius: 10,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
}
const darkField = { ...field, background: alpha('#000000', 0.18), border: `1.5px solid ${alpha(C.CREAM, 0.25)}`, color: C.CREAM }
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 15.5, fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.GREEN : 'transparent', color: on ? C.CREAM : C.GREEN, border: `1.5px solid ${C.GREEN}`,
})
const darkBtn = (on) => ({ ...btn(on), background: on ? C.CREAM : 'transparent', color: on ? C.GREEN_D : C.CREAM, border: `1.5px solid ${on ? C.CREAM : alpha(C.CREAM, 0.5)}` })
const suggest = { bg: C.CREAM_L, border: `1.5px solid ${C.LINE}`, active: alpha(C.BRASS, 0.22), text: C.INK, table: C.WINE, radius: 10 }

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function BistroSignTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const mono = "'IBM Plex Mono', ui-monospace, monospace"
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)

  return (
    <div data-bs lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.CREAM, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.BRASS, 0.4),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <SignOpening inv={inv} theme={theme} lang={lang} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.GREEN, border: `1.5px solid ${C.BRASS}`, boxShadow: '0 8px 20px rgba(20,54,40,.4)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.BULB} idle={alpha(C.BULB, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.GREEN_D, 0.95), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.BRASS, 0.35)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.CREAM, 0.75), fontSize: 15, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontStyle: 'italic', fontSize: 22, color: C.CREAM }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — tente, girlənd, «Açıq» */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: GREEN_BG, padding: '0 0 64px', textAlign: 'center', color: C.CREAM }}>
            <Awning height={54} />
            <StringLights count={9} style={{ marginTop: 16 }} />
            <div style={{ padding: '0 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                <div style={{ transformOrigin: '50% 0', animation: 'bs-sway 4.4s ease-in-out infinite' }}>
                  <HangingSign width="min(54vw, 210px)" open instant front={<SignFront T={T} head={head} />} back={<SignBack T={T} head={head} />} />
                </div>
              </div>
              <div style={{ marginTop: 26, fontSize: 13, fontWeight: 600, letterSpacing: '.26em', textTransform: 'uppercase', color: C.BRASS_L }}>{L('hero', 'kicker', T.since)}</div>
              <h1 style={{ margin: '8px 0 0', fontFamily: head, fontWeight: 900, fontSize: nameSize(heroName), lineHeight: 1.04, overflowWrap: 'anywhere', color: C.CREAM, animation: 'bs-rise 1s ease-out .2s both' }}>{heroName}</h1>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 10, fontFamily: head, fontStyle: 'italic', fontSize: 18, color: C.BRASS_L }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              <div style={{ marginTop: 18, fontFamily: head, fontWeight: 700, fontSize: 'clamp(20px, 5.6vw, 24px)', color: C.CREAM }}>{inv.fullDate}</div>
              <div style={{ marginTop: 6, fontSize: 15.5, color: alpha(C.CREAM, 0.72) }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
              <p style={{ margin: '18px auto 0', maxWidth: 330, fontFamily: head, fontStyle: 'italic', fontSize: 18, lineHeight: 1.55, color: alpha(C.CREAM, 0.88) }}>{tr.inv_join}</p>
            </div>
          </section>

          {/* SAYĞAC — nəlbəkilər */}
          {S.countdown && (
            <Panel section="countdown" head={head} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <Saucer>
                      <span style={{ fontFamily: head, fontWeight: 900, fontSize: 'clamp(20px, 6vw, 27px)', lineHeight: 1, color: C.GREEN, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                    </Saucer>
                    <div style={{ marginTop: 10, fontSize: 12, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: C.MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} dark title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', borderRadius: 18, overflow: 'hidden', isolation: 'isolate', boxShadow: `0 0 0 4px ${C.BRASS}, 0 24px 36px -22px rgba(0,0,0,.8)` }}>
                <Awning height={22} />
                <MapSection
                  weddingData={weddingData} theme={theme} accent={C.WINE} height="clamp(230px, 62vw, 290px)"
                  map={{ opacity: 0.9, filter: 'sepia(.25) saturate(.9)', tintOpacity: 0.1, tint: C.GREEN_L, blend: 'multiply' }}
                  frame={<MapPin />}
                  fallback={<div style={{ height: 'clamp(230px, 62vw, 290px)', position: 'relative', background: CREAM_BG }}><MapPin /></div>}
                />
              </div>
              <div style={{ textAlign: 'center', marginTop: 26, fontFamily: head, fontWeight: 700, fontSize: 25, lineHeight: 1.2, color: C.CREAM }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 6, fontFamily: head, fontStyle: 'italic', fontSize: 18, color: C.BRASS_L }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={darkBtn} />
            </Panel>
          )}

          {/* PROQRAM — menyu kartı */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 400, margin: '0 auto', padding: '26px 22px 22px', background: C.CREAM_L, borderRadius: 6, boxShadow: `0 0 0 1px ${C.LINE}, 0 0 0 7px ${C.CREAM_L}, 0 0 0 8px ${C.GREEN}, 0 20px 30px -20px rgba(31,42,36,.5)` }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '9px 0' }}>
                    <span style={{ fontFamily: head, fontStyle: 'italic', fontSize: 18.5, lineHeight: 1.3, color: C.INK }}>{ev.label}</span>
                    <span aria-hidden="true" style={{ flex: 1, minWidth: 20, borderBottom: `2px dotted ${alpha(C.GREEN, 0.4)}`, transform: 'translateY(-4px)' }} />
                    <span style={{ fontFamily: head, fontWeight: 700, fontSize: 17, color: C.WINE, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</span>
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

          {/* MASA — «Rezerv» lövhəciyi */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="bs-seat-list" field={field} suggest={suggest} font={body} muted={C.MUTED} accent={C.GREEN}
                nameStyle={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}
                card={(num) => (
                  <div style={{ paddingTop: 22, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 230, padding: 5, borderRadius: 12, background: BRASS_GRAD, boxShadow: '0 18px 26px -16px rgba(31,42,36,.6)' }}>
                      <div style={{ padding: '18px 14px 16px', borderRadius: 8, background: C.GREEN, color: C.CREAM, textAlign: 'center' }}>
                        <div style={{ fontFamily: head, fontStyle: 'italic', fontSize: 26, lineHeight: 1.25, ...brassText }}>{T.reserved}</div>
                        <div style={{ marginTop: 10, fontSize: 15, fontWeight: 600, lineHeight: 1.25, overflowWrap: 'anywhere' }}>{seating.selected?.full_name}</div>
                        <div style={{ width: 40, height: 1, margin: '10px auto', background: C.BRASS }} />
                        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.24em', textTransform: 'uppercase', color: alpha(C.CREAM, 0.7) }}>{T.table}{' '}</div>
                        <div style={{ fontFamily: head, fontWeight: 900, fontSize: tableSize(num, 54), lineHeight: 1, color: C.CREAM }}>{num}</div>
                      </div>
                    </div>
                    <span aria-hidden="true" style={{ width: 14, height: 26, background: BRASS_GRAD }} />
                    <span aria-hidden="true" style={{ width: 90, height: 10, borderRadius: '50%', background: BRASS_GRAD, boxShadow: '0 6px 8px -4px rgba(0,0,0,.4)' }} />
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14, marginBottom: 32 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ aspectRatio: '4 / 5', padding: 4, borderRadius: '50% 50% 10px 10px / 30% 30% 10px 10px', background: BRASS_GRAD, boxShadow: '0 12px 18px -12px rgba(31,42,36,.5)' }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '50% 50% 7px 7px / 29% 29% 7px 7px' }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.GREEN_D} bg={C.CREAM_L} frame={{ borderRadius: 12, border: `1.5px solid ${C.BRASS}` }}
                btn={btn} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'event')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: C.LINE, hair: alpha(C.LINE, 0.7), accent: C.GREEN,
                font: body, display: head, displayItalic: true, btnFont: head,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Saucer size={64}><span style={{ color: C.GREEN, fontSize: 22 }}>✓</span></Saucer></div>,
                marker: (a) => <span style={{ display: 'block', width: 15, height: 15, borderRadius: '50%', border: `2px solid ${a ? C.GREEN : C.LINE}`, background: a ? C.GREEN : 'transparent', boxShadow: a ? `inset 0 0 0 2.5px ${C.CREAM_L}` : 'none' }} />,
                suggest: { ...suggest, font: body },
              }} />
            </Panel>
          )}

          {/* QONAQ DƏFTƏRİ — çek kağızı */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField} btn={darkBtn} errorColor={C.BULB} />
              <div style={{ display: 'grid', gap: 18 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{
                      margin: '0 auto', width: '100%', maxWidth: 360, padding: '18px 18px 26px', background: '#FFFEFA', color: C.INK, fontFamily: mono,
                      clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), 95% 100%, 90% calc(100% - 8px), 85% 100%, 80% calc(100% - 8px), 75% 100%, 70% calc(100% - 8px), 65% 100%, 60% calc(100% - 8px), 55% 100%, 50% calc(100% - 8px), 45% 100%, 40% calc(100% - 8px), 35% 100%, 30% calc(100% - 8px), 25% 100%, 20% calc(100% - 8px), 15% 100%, 10% calc(100% - 8px), 5% 100%, 0 calc(100% - 8px))',
                      transform: `rotate(${[-1, 0.8, -0.5][i % 3]}deg)`,
                    }}>
                      <div aria-hidden="true" style={{ textAlign: 'center', fontSize: 11, letterSpacing: '.2em', color: C.MUTED }}>★ ★ ★</div>
                      <blockquote style={{ margin: '10px 0 0', fontSize: 14, lineHeight: 1.6 }}>{msg.text}</blockquote>
                      <div aria-hidden="true" style={{ margin: '10px 0 6px', borderTop: `1.5px dashed ${C.LINE}` }} />
                      <figcaption style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 12.5, fontWeight: 500, color: C.WINE }}>
                        <span>{msg.name}</span>{msg.date ? <span style={{ color: C.MUTED }}>{gbook.formatDate(msg.date)}</span> : null}
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
    </div>
  )
}

function MapPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -16, top: -16, width: 32, height: 32, borderRadius: '50%', background: C.GREEN, boxShadow: `0 0 0 3px ${C.BRASS}, 0 6px 10px rgba(0,0,0,.35)` }} />
    </span>
  )
}
