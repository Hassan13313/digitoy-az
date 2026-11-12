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
import { C as PAL, CHROME, HOT, NIGHT_BG, LIGHT_BG, SUNBURST, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { MirrorBall, LightSpots, Beam } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'
import FilmReel from '../_shared/FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   DISCO BALL — «Disko gecəsi» (Qız gecəsi konsepti, 2026-10)

   Konsept: 70-ci illər diskotekası — güzgü kürə, işıq ləkələri, gün şüalı
   rəqs meydançası. Açılışda kürə qaranlıqda sönük asılıb; toxunanda
   proyektorlar yanır, kürə parlayıb fırlanır, divarlarda işıq ləkələri
   dövrə vurur. Daxildə: xrom rəqəmli sayğac, işıqlı rəqs meydançası
   plitələrində proqram, parlayan kartda masa nömrəsi.
   Şriftlər: Exo 2 (qalın italik, xrom) · Onest (mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('disco-ball')
const ID = 'disco-ball'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['MAGENTA'], secondary: ['LILAC'], accent: ['GOLD'], background: ['LIGHT'], text: ['INK'] }

const KEYFRAMES = (C) => (`
@keyframes db-in { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes db-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes db-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes db-spin { to { background-position: var(--tile) 0, 0 0, var(--tile) 0 } }
@keyframes db-rotate { to { transform: rotate(360deg) } }
@keyframes db-twinkle { 0%,100% { opacity: .2; transform: scale(.6) } 50% { opacity: 1; transform: scale(1) } }
@keyframes db-drop { from { transform: translateY(-40px) } to { transform: translateY(0) } }
@keyframes db-floor { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
[data-db] span[aria-hidden="true"], [data-db] svg[aria-hidden="true"], [data-db] div[aria-hidden="true"] { pointer-events: none; }
[data-db] ::placeholder { color: rgba(125,109,153,.7); }
[data-db] [data-dark] ::placeholder { color: rgba(216,220,230,.5); }
[data-db] input:focus-visible, [data-db] textarea:focus-visible { border-color: ${C.MAGENTA} !important; outline: none; }
[data-db] button:focus-visible, [data-db] a:focus-visible, [data-db] [role="button"]:focus-visible { outline: 2px solid ${C.GOLD}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-db] *, [data-db] { animation: none !important; transition: none !important; } }
`)

const chromeText = { backgroundImage: CHROME, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 3px 0 rgba(255,62,165,.55))' }
const hotText = (C) => ({ backgroundImage: HOT(C), WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent' })

/* ═══ 01 — AÇILIŞ: işıqlar yanır, kürə fırlanır ═══ */
function DiscoOpening({ inv, theme }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-db
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: go ? NIGHT_BG : '#0B0619', transition: 'background .5s ease', color: C.SILVER, fontFamily: theme.fonts.body }}>
      <LightSpots on={go} />
      <Beam side="left" on={go} />
      <Beam side="right" on={go} color="rgba(255,201,74,.3)" />
      <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '28%', background: SUNBURST, opacity: go ? 1 : 0.15, transition: 'opacity .6s ease .3s', animation: go ? 'db-floor 1s ease-in-out .4s infinite' : 'none' }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ animation: go ? 'db-drop .6s cubic-bezier(.3,1.4,.5,1) both' : 'none' }}>
          <MirrorBall size={150} spin={go} lit={go} chain={60} />
        </div>
        <div style={{ position: 'relative', marginTop: 26, animation: 'db-in 1s ease-out .2s both' }}>
          {ot.show('kicker') && <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: '.3em', textTransform: 'uppercase', ...hotText(C) }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 6, fontFamily: head, fontStyle: 'italic', fontWeight: 800, fontSize: 'clamp(48px, 15vw, 70px)', lineHeight: 1, overflowWrap: 'anywhere', ...chromeText }}>
              {first}{second && <> {ot.text('and')} {second}</>}
            </div>
          )}
          <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: -18, transform: 'translateX(-50%)' }}>
            <EmblemSlot mono={ot.mono} size={44} border={`1.5px solid ${C.MAGENTA}`} background={C.NIGHT} color={C.GOLD} font={head} style={{ animation: 'none', margin: 0 }}>
              <span />
            </EmblemSlot>
          </div>
          {ot.show('meta') && <div style={{ marginTop: 10, fontSize: 15.5, color: alpha(C.SILVER, 0.8) }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.25 }} style={{ marginTop: 22 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: HOT(C), color: C.NIGHT_D, fontFamily: head, fontStyle: 'italic', fontWeight: 800, fontSize: 18, letterSpacing: '.04em', boxShadow: '0 0 24px rgba(255,62,165,.55)', animation: 'db-in .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 14, color: alpha(C.SILVER, 0.55), animation: 'db-fade .8s ease-out 1.1s both, db-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dark = false }) {
  const C = usePalette(PAL)
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? NIGHT_BG : LIGHT_BG(C), color: dark ? C.SILVER : C.INK }}>
      {dark && <LightSpots style={{ opacity: 0.45 }} />}
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            {kicker && <div style={{ marginBottom: 6, fontSize: 12.5, fontWeight: 500, letterSpacing: '.28em', textTransform: 'uppercase', ...hotText(C) }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontStyle: 'italic', fontWeight: 800, fontSize: scaleFont('clamp(32px, 9.4vw, 44px)', C.hs), lineHeight: 1.05, textWrap: 'balance', ...(dark ? chromeText : { color: C.INK }) }}>{title}</h2>}
            <span aria-hidden="true" style={{ display: 'block', width: 90, height: 4, margin: '14px auto 0', borderRadius: 2, background: HOT(C) }} />
            {sub && <p style={{ margin: '12px auto 0', maxWidth: 340, fontSize: 16, color: dark ? alpha(C.SILVER, 0.75) : C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: '#FFFFFF', border: `1.5px solid ${C.LINE}`, borderRadius: 14,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
})
const darkField = (C) => ({ ...field(C), background: alpha('#FFFFFF', 0.07), border: `1.5px solid ${alpha(C.LILAC, 0.4)}`, color: C.SILVER })
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 15.5, fontWeight: 500, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.INK : '#FFFFFF', color: on ? C.GOLD : C.INK, border: `1.5px solid ${on ? C.INK : C.LINE}`,
}))
const darkBtn = (C) => ((on) => ({ ...btn(C)(on), background: on ? HOT(C) : 'transparent', color: on ? C.NIGHT_D : C.SILVER, border: `1.5px solid ${on ? C.MAGENTA : alpha(C.LILAC, 0.5)}` }))
const suggest = (C) => ({ bg: '#FFFFFF', border: `1.5px solid ${C.LINE}`, active: alpha(C.MAGENTA, 0.12), text: C.INK, table: C.MAGENTA_D, radius: 14 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function DiscoBallTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const TILES = [C.MAGENTA, C.GOLD, C.LILAC, '#4FD1C5']

  return (
    <PaletteContext.Provider value={C}><div data-db lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.NIGHT, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.MAGENTA, 0.4),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <DiscoOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: HOT(C), boxShadow: '0 0 22px rgba(255,62,165,.55)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.NIGHT_D} idle={alpha(C.NIGHT_D, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.NIGHT_D, 0.9), backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '2px solid transparent', borderImage: `${HOT(C)} 1`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.SILVER, 0.75), fontSize: 15, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontStyle: 'italic', fontWeight: 800, fontSize: 22, ...hotText(C) }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — fırlanan kürə */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: NIGHT_BG, padding: '70px 22px 70px', textAlign: 'center', color: C.SILVER }}>
            <LightSpots />
            <Beam side="left" />
            <Beam side="right" color="rgba(255,201,74,.28)" />
            <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '30%', background: SUNBURST, animation: 'db-floor 1.2s ease-in-out infinite' }} />
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}><MirrorBall size={130} chain={70} /></div>
            <div style={{ position: 'relative', marginTop: 24, fontSize: 13, fontWeight: 500, letterSpacing: '.3em', textTransform: 'uppercase', ...hotText(C) }}>{L('hero', 'kicker', T.disco)}</div>
            <h1 style={{ position: 'relative', margin: '6px 0 0', fontFamily: head, fontStyle: 'italic', fontWeight: 800, fontSize: nameSize(heroName), lineHeight: 1, overflowWrap: 'anywhere', ...chromeText, animation: 'db-in 1s ease-out .2s both' }}>{heroName}</h1>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ position: 'relative', marginTop: 8, fontSize: 15.5, color: alpha(C.SILVER, 0.8) }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <div style={{ position: 'relative', marginTop: 20, fontFamily: head, fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(20px, 5.6vw, 24px)', color: '#FFFFFF' }}>{inv.fullDate}</div>
            <div style={{ position: 'relative', marginTop: 6, fontSize: 15.5, color: alpha(C.SILVER, 0.75) }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            <p style={{ position: 'relative', margin: '18px auto 0', maxWidth: 330, fontSize: 16.5, lineHeight: 1.55, color: alpha('#FFFFFF', 0.88) }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — xrom rəqəmlər */}
          {S.countdown && (
            <Panel section="countdown" head={head} dark title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ padding: 2, borderRadius: 16, background: `linear-gradient(135deg, ${TILES[i]}, transparent 70%)`, boxShadow: `0 0 18px ${alpha(TILES[i], 0.45)}` }}>
                      <div style={{ padding: '16px 0 14px', borderRadius: 14, background: C.NIGHT_D }}>
                        <span style={{ fontFamily: head, fontStyle: 'italic', fontWeight: 800, fontSize: 'clamp(26px, 7.8vw, 36px)', lineHeight: 1, fontVariantNumeric: 'tabular-nums', ...chromeText }}><PopDigit value={v} pop={pop} /></span>
                      </div>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 11, fontWeight: 500, letterSpacing: '.18em', textTransform: 'uppercase', color: TILES[i] }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: 3, borderRadius: 24, background: HOT(C), boxShadow: '0 20px 40px -24px rgba(194,31,122,.6)' }}>
                <div style={{ borderRadius: 21, overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.MAGENTA_D} height="clamp(240px, 66vw, 300px)"
                    map={{ opacity: 0.92, filter: 'saturate(.8)', tintOpacity: 0.12, tint: C.LILAC, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(240px, 66vw, 300px)', position: 'relative', background: LIGHT_BG(C) }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontStyle: 'italic', fontWeight: 800, fontSize: 26, lineHeight: 1.15, color: C.INK }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 6, fontSize: 12.5, fontWeight: 500, letterSpacing: '.22em', textTransform: 'uppercase', color: C.MAGENTA_D }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} />
            </Panel>
          )}

          {/* PROQRAM — rəqs meydançası plitələri */}
          {S.program && (
            <Panel section="program" head={head} dark title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 400, margin: '0 auto', display: 'grid', gap: 10 }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '78px minmax(0, 1fr)', alignItems: 'stretch', borderRadius: 14, overflow: 'hidden', background: alpha('#FFFFFF', 0.05), border: `1px solid ${alpha(TILES[i % 4], 0.45)}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${TILES[i % 4]}, ${alpha(TILES[i % 4], 0.55)})`, color: C.NIGHT_D, fontFamily: head, fontStyle: 'italic', fontWeight: 800, fontSize: 19, boxShadow: `0 0 20px ${alpha(TILES[i % 4], 0.6)}`, animation: `db-floor ${1 + (i % 3) * 0.3}s ease-in-out ${i * 0.2}s infinite` }}>{ev.time}</div>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', fontSize: 16.5, lineHeight: 1.3, color: '#FFFFFF' }}>{ev.label}</div>
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

          {/* MASA — parlayan kart */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} dark title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="db-seat-list" field={darkField(C)} suggest={suggest(C)} font={body} muted={alpha(C.SILVER, 0.75)} accent={C.GOLD}
                nameStyle={{ fontFamily: head, fontStyle: 'italic', fontWeight: 800, fontSize: 28, color: '#FFFFFF' }}
                card={(num) => (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16 }}>
                    <MirrorBall size={70} chain={0} />
                    <div style={{ marginTop: 14, padding: 2.5, borderRadius: 22, background: HOT(C), boxShadow: '0 0 30px rgba(255,62,165,.5)' }}>
                      <div style={{ width: 210, padding: '18px 14px 20px', borderRadius: 19.5, background: C.NIGHT_D, textAlign: 'center' }}>
                        <div style={{ fontSize: 12.5, fontWeight: 500, letterSpacing: '.3em', textTransform: 'uppercase', ...hotText(C) }}>{T.table}{' '}</div>
                        <div style={{ fontFamily: head, fontStyle: 'italic', fontWeight: 800, fontSize: tableSize(num, 80), lineHeight: 1, ...chromeText }}>{num}</div>
                      </div>
                    </div>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 32 }} />}
              <PhotoQr inv={inv} tr={tr} fg={C.NIGHT} bg="#FFFFFF" frame={{ borderRadius: 18, border: `2.5px solid ${C.MAGENTA}` }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'night')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: C.LINE, hair: alpha(C.LINE, 0.7), accent: C.MAGENTA_D,
                font: body, display: head, displayItalic: true, btnFont: head,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><MirrorBall size={56} chain={0} /></div>,
                marker: (a) => <span style={{ display: 'block', width: 15, height: 15, borderRadius: '50%', border: `2px solid ${a ? C.MAGENTA : C.LINE}`, background: a ? HOT(C) : 'transparent' }} />,
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField(C)} btn={darkBtn(C)} errorColor={C.GOLD} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '20px 20px 16px', borderRadius: 18, background: alpha('#000000', 0.25), border: `1px solid ${alpha(TILES[i % 4], 0.5)}`, boxShadow: `0 0 18px ${alpha(TILES[i % 4], 0.18)}` }}>
                      <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.55, color: '#FFFFFF' }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 10, fontFamily: head, fontStyle: 'italic', fontWeight: 700, fontSize: 16, color: TILES[i % 4] }}>
                        {msg.name}{msg.date ? <span style={{ fontFamily: body, fontStyle: 'normal', fontWeight: 400, fontSize: 13, color: alpha(C.SILVER, 0.5) }}> · {gbook.formatDate(msg.date)}</span> : null}
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
      <span style={{ position: 'absolute', left: -20, top: -20 }}><MirrorBall size={40} chain={0} /></span>
    </span>
  )
}
