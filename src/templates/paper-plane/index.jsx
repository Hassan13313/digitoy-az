import { motion } from 'framer-motion'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../_shared/MapSection'
import { EmblemSlot } from '../_shared/MonoContent'
import { Reveal, PopDigit, enterDirection } from '../_shared/motion'
import { getTemplateTheme } from '../templateConfig'
import { useInvitation, useGate, openingNames, alpha } from '../_shared/useInvitation'
import { MusicFab, EqBars, StoryBlock, InvitationEnd, ReplyForm } from '../_shared/invitationKit'
import { VenueLinks, SeatFinder, PhotoQr, GuestbookForm } from '../_shared/blocks'
import { galleryDesc, tableSize } from '../_shared/kids'
import { C as PAL, SKY_BG, NIGHT_BG, LINED, AIRMAIL, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { fill } from '../_shared/copyText'
import { Plane, Cloud, Trail, Airmail, Postmark } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'
import FilmReel from '../_shared/FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   PAPER PLANE — «Gələcəyə məktub» (Məzuniyyət konsepti, 2026-10)

   Konsept: məzunun gələcəyə yazdığı məktub kağız təyyarəyə çevrilib uçur.
   Açılışda səmada xətli dəftər vərəqi; toxunanda vərəq qatlanıb təyyarəyə
   çevrilir və qırıq-qırıq iz buraxaraq səmaya uçur. Daxildə: hava poçtu
   zolaqlı sayğac, marşrut kimi proqram, açıqcada masa nömrəsi, gecə
   səmasında arzular.
   Şriftlər: Ysabeau (başlıq) · Ysabeau Office (mətn) · Martian Mono (poçt).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('paper-plane')
const ID = 'paper-plane'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['BLUE'], secondary: ['SUN'], accent: ['RED'], background: ['WHITE'], text: ['INK'] }

const KEYFRAMES = (C) => (`
@keyframes pp-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes pp-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes pp-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes pp-drift { from { transform: translateX(-12px) } to { transform: translateX(12px) } }
@keyframes pp-glide { 0%,100% { transform: translate(0, 0) rotate(-8deg) } 50% { transform: translate(-6px, 6px) rotate(-4deg) } }
@keyframes pp-fly { 0% { opacity: 0; transform: translate(0, 0) rotate(-6deg) scale(.6) } 15% { opacity: 1; transform: translate(0, 0) rotate(-10deg) scale(1) } 60% { transform: translate(24vw, -16vh) rotate(-18deg) scale(.9) } 100% { opacity: 1; transform: translate(70vw, -58vh) rotate(-26deg) scale(.55) } }
[data-pp] span[aria-hidden="true"], [data-pp] svg[aria-hidden="true"], [data-pp] div[aria-hidden="true"] { pointer-events: none; }
[data-pp] ::placeholder { color: rgba(94,114,144,.7); }
[data-pp] [data-dark] ::placeholder { color: rgba(255,255,255,.5); }
[data-pp] input:focus-visible, [data-pp] textarea:focus-visible { border-color: ${C.BLUE} !important; outline: none; }
[data-pp] button:focus-visible, [data-pp] a:focus-visible, [data-pp] [role="button"]:focus-visible { outline: 2px solid ${C.BLUE}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-pp] *, [data-pp] { animation: none !important; transition: none !important; } }
`)

/* ═══ 01 — AÇILIŞ: məktub təyyarəyə çevrilib uçur ═══ */
function PlaneOpening({ inv, theme, year, mono }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  const T = inv.copy(TXT)
  return (
    <motion.div {...gate.gateProps} data-pp
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: SKY_BG, color: C.INK, fontFamily: theme.fonts.body }}>
      <Cloud w={150} style={{ left: '-6%', top: '14%', animation: 'pp-drift 6s ease-in-out infinite alternate' }} />
      <Cloud w={110} opacity={0.75} style={{ right: '-4%', top: '30%', animation: 'pp-drift 7s ease-in-out -2s infinite alternate' }} />
      <Cloud w={170} opacity={0.85} style={{ left: '10%', bottom: '8%', animation: 'pp-drift 8s ease-in-out -4s infinite alternate' }} />
      <Trail on={go} delay={0.45} dur={1} style={{ left: '46%', top: '6%', width: '56%', height: '36%' }} d="M0 150C60 150 110 120 170 90S300 30 400 0" />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        {ot.show('kicker') && <div style={{ marginBottom: 14, fontFamily: mono, fontSize: 12.5, letterSpacing: '.22em', textTransform: 'uppercase', color: C.BLUE_D, animation: 'pp-rise .8s ease-out .2s both' }}>{ot.text('kicker')}</div>}
        <div style={{ position: 'relative', width: 'min(74vw, 290px)', aspectRatio: '1.25' }}>
          {/* məktub */}
          <div style={{
            position: 'absolute', inset: 0, padding: '18px 18px 14px 40px', background: LINED(C), borderRadius: 4, boxShadow: '0 18px 30px -16px rgba(27,45,79,.45)', textAlign: 'left',
            transform: go ? 'scale(.18) rotate(-30deg)' : 'rotate(-2deg)', opacity: go ? 0 : 1, transition: 'transform .45s cubic-bezier(.6,0,.4,1), opacity .25s ease .2s',
          }}>
            <div style={{ fontFamily: head, fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(22px, 6.6vw, 28px)', lineHeight: 1.1, color: C.BLUE }}>{T.letter}</div>
            <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
              {[86, 70, 78].map((w, i) => <span key={i} aria-hidden="true" style={{ display: 'block', width: `${w}%`, height: 2, borderRadius: 2, background: alpha(C.NAVY, 0.25) }} />)}
            </div>
            <div style={{ position: 'absolute', right: 14, bottom: 12 }}>
              <EmblemSlot mono={ot.mono} size={52} border={`2px solid ${C.RED}`} background="transparent" color={C.RED} font={head} style={{ animation: 'none', margin: 0, transform: 'rotate(-10deg)' }}>
                <Postmark size={58} color={C.RED}><span style={{ fontFamily: mono, fontSize: 11, fontWeight: 600 }}>{year}</span></Postmark>
              </EmblemSlot>
            </div>
          </div>
          {/* təyyarə */}
          {go && (
            <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: -60, marginTop: -36, filter: 'drop-shadow(0 8px 10px rgba(27,45,79,.25))', animation: 'pp-fly 1.35s cubic-bezier(.45,.05,.6,1) .3s both' }}>
              <Plane size={120} />
            </div>
          )}
        </div>
        <div style={{ marginTop: 28, animation: 'pp-rise 1s ease-out .3s both' }}>
          {titleOv !== '' && (
            <div style={{ fontFamily: head, fontWeight: 800, fontSize: 'clamp(40px, 12vw, 58px)', lineHeight: 1.04, overflowWrap: 'anywhere', color: C.NAVY }}>
              {first}{second && <><span style={{ display: 'inline-block', margin: '0 .2em', color: C.RED }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          {year && <div style={{ marginTop: 6, fontFamily: mono, fontSize: 13, letterSpacing: '.18em', textTransform: 'uppercase', color: C.BLUE_D }}>{fill(T.classOf, { y: year })}</div>}
          {ot.show('meta') && <div style={{ marginTop: 6, fontSize: 16, color: C.MUTED }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.25 }} style={{ marginTop: 20 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: C.BLUE, color: C.WHITE, fontFamily: head, fontWeight: 700, fontSize: 17, boxShadow: '0 12px 22px -12px rgba(47,111,219,.7)', animation: 'pp-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 14.5, color: C.MUTED, animation: 'pp-fade .8s ease-out 1.1s both, pp-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, mono, dark = false, sky = false }) {
  const C = usePalette(PAL)
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? NIGHT_BG(C) : sky ? `linear-gradient(180deg, ${C.SKY_L}, ${C.WHITE})` : C.WHITE, color: dark ? C.WHITE : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Plane size={44} tone={dark ? 'white' : 'blue'} style={{ margin: '0 auto 10px', transform: 'rotate(-12deg)' }} />
            {kicker && <div style={{ marginBottom: 6, fontFamily: mono, fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', color: dark ? C.SUN : C.BLUE }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 800, fontSize: scaleFont('clamp(30px, 8.8vw, 41px)', C.hs), lineHeight: 1.1, textWrap: 'balance', color: dark ? C.WHITE : C.NAVY }}>{title}</h2>}
            {sub && <p style={{ margin: '10px auto 0', maxWidth: 340, fontSize: 16.5, color: dark ? alpha(C.WHITE, 0.72) : C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: C.WHITE, border: `1.5px solid ${C.LINE}`, borderRadius: 12,
  padding: '14px 16px', fontSize: 16.5, color: C.INK, outline: 'none',
})
const darkField = (C) => ({ ...field(C), background: alpha(C.WHITE, 0.08), border: `1.5px solid ${alpha(C.WHITE, 0.22)}`, color: C.WHITE })
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 16, fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.BLUE : C.WHITE, color: on ? C.WHITE : C.NAVY, border: `1.5px solid ${on ? C.BLUE : C.LINE}`,
}))
const darkBtn = (C) => ((on) => ({ ...btn(C)(on), background: on ? C.SUN : 'transparent', color: on ? C.NAVY_D : C.WHITE, border: `1.5px solid ${on ? C.SUN : alpha(C.WHITE, 0.45)}` }))
const suggest = (C) => ({ bg: C.WHITE, border: `1.5px solid ${C.LINE}`, active: alpha(C.SKY, 0.5), text: C.INK, table: C.BLUE, radius: 12 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function PaperPlaneTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const mono = "'Martian Mono', ui-monospace, monospace"
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const year = inv.dp?.year || ''

  return (
    <PaletteContext.Provider value={C}><div data-pp lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.WHITE, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.BLUE, 0.3),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <PlaneOpening inv={inv} theme={theme} lang={lang} year={year} mono={mono} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.BLUE, boxShadow: '0 8px 20px rgba(31,79,168,.4)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.WHITE} idle={alpha(C.WHITE, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.WHITE, 0.9), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${C.LINE}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 15.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 800, fontSize: 21, color: C.NAVY }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — səmada təyyarə */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: SKY_BG, padding: '120px 22px 64px', textAlign: 'center' }}>
            <Cloud w={130} style={{ left: '-5%', top: '18%', animation: 'pp-drift 6s ease-in-out infinite alternate' }} />
            <Cloud w={100} opacity={0.75} style={{ right: '-3%', top: '46%', animation: 'pp-drift 7s ease-in-out -3s infinite alternate' }} />
            <Trail style={{ left: '4%', top: '6%', width: '70%', height: '18%' }} d="M0 140C80 150 140 60 220 80S340 40 400 10" />
            <div aria-hidden="true" style={{ position: 'absolute', right: '8%', top: '4%', animation: 'pp-glide 4s ease-in-out infinite' }}><Plane size={92} /></div>
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: mono, fontSize: 12.5, letterSpacing: '.22em', textTransform: 'uppercase', color: C.BLUE_D }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              <div style={{ marginTop: 10, fontFamily: head, fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(22px, 6.4vw, 28px)', color: C.BLUE }}>{T.letter}</div>
              <h1 style={{ margin: '6px 0 0', fontFamily: head, fontWeight: 800, fontSize: nameSize(heroName), lineHeight: 1.02, overflowWrap: 'anywhere', color: C.NAVY, animation: 'pp-rise 1s ease-out .2s both' }}>{heroName}</h1>
              {year && <div style={{ display: 'inline-block', marginTop: 14, padding: 4, borderRadius: 8, background: AIRMAIL(C) }}><div style={{ padding: '6px 14px', borderRadius: 5, background: C.WHITE, fontFamily: mono, fontSize: 13, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: C.NAVY }}>{fill(T.classOf, { y: year })}</div></div>}
              <div style={{ marginTop: 18, fontFamily: head, fontWeight: 700, fontSize: 'clamp(20px, 5.6vw, 24px)', color: C.NAVY }}>{inv.fullDate}</div>
              <div style={{ marginTop: 6, fontSize: 16, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 15.5, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              <p style={{ margin: '18px auto 0', maxWidth: 330, fontSize: 17, fontStyle: 'italic', lineHeight: 1.55, color: C.INK }}>{tr.inv_join}</p>
            </div>
          </section>

          {/* SAYĞAC — hava poçtu */}
          {S.countdown && (
            <Panel section="countdown" head={head} mono={mono} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop]) => (
                  <Airmail key={l} pad={5} radius={10}>
                    <div style={{ padding: '14px 0 10px', textAlign: 'center' }}>
                      <div style={{ fontFamily: head, fontWeight: 800, fontSize: 'clamp(24px, 7vw, 32px)', lineHeight: 1, color: C.NAVY, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></div>
                      <div style={{ marginTop: 6, fontFamily: mono, fontSize: 9.5, letterSpacing: '.08em', textTransform: 'uppercase', color: C.MUTED }}>{l}</div>
                    </div>
                  </Airmail>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} mono={mono} sky title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <Airmail pad={7} radius={20} style={{ maxWidth: 430, margin: '0 auto' }}>
                <div style={{ isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.BLUE} height="clamp(240px, 66vw, 300px)"
                    map={{ opacity: 0.92, filter: 'saturate(.85)', tintOpacity: 0.1, tint: C.SKY, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(240px, 66vw, 300px)', position: 'relative', background: SKY_BG }}><MapPin /></div>}
                  />
                </div>
              </Airmail>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 800, fontSize: 25, lineHeight: 1.2, color: C.NAVY }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 6, fontFamily: mono, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: C.MUTED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} />
            </Panel>
          )}

          {/* PROQRAM — marşrut */}
          {S.program && (
            <Panel section="program" head={head} mono={mono} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ position: 'relative', maxWidth: 380, margin: '0 auto' }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: 17, top: 18, bottom: 18, width: 0, borderLeft: `2.5px dashed ${alpha(C.BLUE, 0.45)}` }} />
                {timeline.events.map((ev, i) => {
                  const last = i === timeline.events.length - 1
                  return (
                    <div key={i} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '36px minmax(0, 1fr)', gap: 14, alignItems: 'center', padding: '12px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {last ? <Plane size={34} tone="blue" style={{ transform: 'rotate(-20deg)' }} /> : <span aria-hidden="true" style={{ width: 14, height: 14, borderRadius: '50%', background: C.WHITE, border: `3px solid ${i === 0 ? C.RED : C.BLUE}` }} />}
                      </div>
                      <div>
                        <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 600, letterSpacing: '.06em', color: C.BLUE, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                        <div style={{ marginTop: 2, fontSize: 17.5, fontWeight: 600, lineHeight: 1.3, color: C.NAVY }}>{ev.label}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} mono={mono} sky title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" />
            </Panel>
          )}

          {/* MASA — açıqca */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} mono={mono} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="pp-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={C.MUTED} accent={C.BLUE}
                nameStyle={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}
                card={(num) => (
                  <Airmail pad={7} radius={12} style={{ maxWidth: 340, margin: '22px auto 0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '42% minmax(0, 1fr)', minHeight: 170 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: `1.5px dashed ${C.LINE}`, padding: 10 }}>
                        <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: C.MUTED }}>{T.table}{' '}</div>
                        <div style={{ fontFamily: head, fontWeight: 800, fontSize: tableSize(num, 70), lineHeight: 1, color: C.BLUE }}>{num}</div>
                      </div>
                      <div style={{ position: 'relative', padding: '16px 14px', textAlign: 'left' }}>
                        <div style={{ position: 'absolute', right: 8, top: 8 }}><Postmark size={56}><span style={{ fontFamily: mono, fontSize: 10, fontWeight: 600 }}>{year}</span></Postmark></div>
                        <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase', color: C.RED }}>{T.air}</div>
                        <div style={{ marginTop: 52, fontFamily: head, fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(19px, 5.4vw, 22px)', lineHeight: 1.2, color: C.NAVY, overflowWrap: 'anywhere' }}>{seating.selected?.full_name}</div>
                        <span aria-hidden="true" style={{ display: 'block', height: 1.5, marginTop: 8, background: C.LINE }} />
                        <span aria-hidden="true" style={{ display: 'block', width: '70%', height: 1.5, marginTop: 14, background: C.LINE }} />
                      </div>
                    </div>
                  </Airmail>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} mono={mono} sky title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 32 }} />}
              <PhotoQr inv={inv} tr={tr} fg={C.NAVY} bg={C.WHITE} frame={{ borderRadius: 14, border: `1.5px solid ${C.LINE}` }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} mono={mono} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: C.LINE, hair: alpha(C.LINE, 0.7), accent: C.BLUE,
                font: body, display: head, displayItalic: false, btnFont: head,
                doneMark: <Plane size={70} tone="blue" style={{ margin: '0 auto 10px', transform: 'rotate(-12deg)' }} />,
                marker: (a) => <span style={{ display: 'block', width: 15, height: 15, borderRadius: '50%', border: `2px solid ${a ? C.BLUE : C.LINE}`, background: a ? C.BLUE : 'transparent', boxShadow: a ? `inset 0 0 0 2.5px ${C.WHITE}` : 'none' }} />,
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR — gecə səması */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} mono={mono} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField(C)} btn={darkBtn(C)} errorColor={C.SUN} />
              <div style={{ display: 'grid', gap: 16 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '16px 18px 12px 44px', background: LINED(C), color: C.INK, borderRadius: 4, boxShadow: '0 14px 22px -14px rgba(0,0,0,.7)', transform: `rotate(${[-1, 0.8, -0.5][i % 3]}deg)` }}>
                      <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.7 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 4, fontFamily: head, fontStyle: 'italic', fontWeight: 700, fontSize: 16, color: C.BLUE }}>
                        — {msg.name}{msg.date ? <span style={{ fontFamily: mono, fontStyle: 'normal', fontWeight: 400, fontSize: 11, color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}
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
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -30, top: -30, filter: 'drop-shadow(0 6px 6px rgba(0,0,0,.25))' }}><Plane size={60} style={{ transform: 'rotate(-14deg)' }} /></span>
    </span>
  )
}
