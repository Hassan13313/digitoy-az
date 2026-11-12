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
import { C as PAL, GOLD_GRAD, NIGHT_BG, IVORY_BG, BURSTS, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { fill } from '../_shared/copyText'
import { ClockFace, Burst, MiniClock, PocketWatch } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'
import FilmReel from '../_shared/FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   MIDNIGHT CLOCK — «Gecə yarısı» (Bayram gecələri konsepti, 2026-10)

   Konsept: Yeni il gecəsi — zərli saat gecə yarısına üç dəqiqə qalmış dayanıb.
   Toxunanda dəqiqə əqrəbi «tık-tık-tık» edərək XII-yə çatır, saat parlayır,
   səmada atəşfəşanlıq açılır və yeni ilin rəqəmi görünür. Daxildə: saat
   kimi sayğac, hər tədbirin öz vaxtını göstərən kiçik saatlar, cib saatında
   masa nömrəsi.
   Şriftlər: Cormorant (başlıq, rum rəqəmləri) · Ysabeau Office (mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('midnight-clock')
const ID = 'midnight-clock'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['MIDNIGHT'], secondary: ['GOLD_D'], accent: ['GOLD'], background: ['IVORY'], text: ['INK'] }

const KEYFRAMES = (C) => (`
@keyframes mc-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes mc-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes mc-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes mc-ray { 0% { opacity: 0; transform: translateY(0) scaleY(.2) } 20% { opacity: 1 } 100% { opacity: 0; transform: translateY(240%) scaleY(1) } }
@keyframes mc-pop { 0% { opacity: 0; transform: scale(.6) } 60% { opacity: 1; transform: scale(1.08) } 100% { opacity: 1; transform: scale(1) } }
[data-mc] span[aria-hidden="true"], [data-mc] svg[aria-hidden="true"], [data-mc] div[aria-hidden="true"] { pointer-events: none; }
[data-mc] ::placeholder { color: rgba(122,128,154,.7); }
[data-mc] [data-dark] ::placeholder { color: rgba(246,231,193,.45); }
[data-mc] input:focus-visible, [data-mc] textarea:focus-visible { border-color: ${C.GOLD_D} !important; outline: none; }
[data-mc] button:focus-visible, [data-mc] a:focus-visible, [data-mc] [role="button"]:focus-visible { outline: 2px solid ${C.GOLD}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-mc] *, [data-mc] { animation: none !important; transition: none !important; } }
`)

const goldText = (C) => ({ backgroundImage: GOLD_GRAD(C), WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent' })

/* Yeni ilin rəqəmi: 25–31 dekabr → növbəti il */
function newYearOf(raw) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(raw || ''))
  if (!m) return ''
  const y = Number(m[1])
  return m[2] === '12' && Number(m[3]) >= 25 ? y + 1 : y
}

/* ═══ 01 — AÇILIŞ: saat XII-ni vurur ═══ */
function ClockOpening({ inv, theme, nyYear }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  const T = inv.copy(TXT)
  return (
    <motion.div {...gate.gateProps} data-mc
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: NIGHT_BG(C), color: C.CHAMPAGNE, fontFamily: theme.fonts.body, fontVariantNumeric: 'lining-nums' }}>
      {go && BURSTS(C).map((b, i) => <Burst key={i} x={b.x} y={b.y} size={b.s} color={b.c} delay={b.d} />)}
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ animation: 'mc-rise 1s ease-out .2s both' }}>
          {ot.show('kicker') && <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.28em', textTransform: 'uppercase', color: C.GOLD_L }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 8, fontFamily: head, fontWeight: 600, fontSize: 'clamp(36px, 10.6vw, 50px)', lineHeight: 1.06, overflowWrap: 'anywhere', ...goldText(C) }}>
              {first}{second && <> {ot.text('and')} {second}</>}
            </div>
          )}
        </div>
        <div style={{ position: 'relative', marginTop: 26 }}>
          <ClockFace size={240} minDeg={go ? 360 : 342} hourDeg={go ? 360 : 358.5} font={head} glow={go} />
          {!go && (
            <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '66%', transform: 'translate(-50%, -50%)' }}>
              <EmblemSlot mono={ot.mono} size={46} border={`1.5px solid ${C.GOLD_D}`} background="#FFFDF6" color={C.INK} font={head} style={{ animation: 'none', margin: 0 }}>
                <span />
              </EmblemSlot>
            </div>
          )}
        </div>
        {nyYear && (
          <div style={{ marginTop: 18, minHeight: 54, fontFamily: head, fontWeight: 700, fontSize: 'clamp(36px, 11vw, 50px)', lineHeight: 1, ...goldText(C), opacity: go ? 1 : 0, animation: go ? 'mc-pop .6s ease-out 1s both' : 'none' }}>{fill(T.welcome, { y: nyYear })}</div>
        )}
        <div style={{ marginTop: 8, animation: 'mc-rise 1s ease-out .35s both' }}>
          {ot.show('meta') && <div style={{ fontSize: 16, color: alpha(C.CHAMPAGNE, 0.72) }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.25 }} style={{ marginTop: 16 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: GOLD_GRAD(C), color: C.MIDNIGHT_D, fontFamily: head, fontWeight: 700, fontSize: 19, boxShadow: '0 12px 26px -12px rgba(232,196,106,.7)', animation: 'mc-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 14, color: alpha(C.CHAMPAGNE, 0.5), animation: 'mc-fade .8s ease-out 1.1s both, mc-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dark = false }) {
  const C = usePalette(PAL)
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? NIGHT_BG(C) : IVORY_BG(C), color: dark ? C.CHAMPAGNE : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            {kicker && <div style={{ marginBottom: 6, fontSize: 12.5, fontWeight: 600, letterSpacing: '.26em', textTransform: 'uppercase', color: dark ? C.GOLD_L : C.GOLD_D }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 600, fontSize: scaleFont('clamp(32px, 9.4vw, 44px)', C.hs), lineHeight: 1.08, textWrap: 'balance', ...(dark ? goldText(C) : { color: C.INK }) }}>{title}</h2>}
            <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 14 }}>
              <span style={{ width: 46, height: 1, background: dark ? C.GOLD : C.GOLD_D }} />
              <MiniClock time="00:00" size={18} color={dark ? C.GOLD : C.GOLD_D} />
              <span style={{ width: 46, height: 1, background: dark ? C.GOLD : C.GOLD_D }} />
            </div>
            {sub && <p style={{ margin: '12px auto 0', maxWidth: 340, fontSize: 16, color: dark ? alpha(C.CHAMPAGNE, 0.72) : C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: '#FFFFFF', border: `1px solid ${C.LINE}`, borderRadius: 10,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
})
const darkField = (C) => ({ ...field(C), background: alpha('#FFFFFF', 0.06), border: `1px solid ${alpha(C.GOLD, 0.35)}`, color: C.CHAMPAGNE })
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 15.5, fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.MIDNIGHT : 'transparent', color: on ? C.GOLD_L : C.MIDNIGHT, border: `1.5px solid ${C.MIDNIGHT}`,
}))
const darkBtn = (C) => ((on) => ({ ...btn(C)(on), background: on ? GOLD_GRAD(C) : 'transparent', color: on ? C.MIDNIGHT_D : C.GOLD_L, border: `1.5px solid ${on ? C.GOLD : alpha(C.GOLD, 0.5)}` }))
const suggest = (C) => ({ bg: '#FFFFFF', border: `1px solid ${C.LINE}`, active: alpha(C.GOLD, 0.25), text: C.INK, table: C.GOLD_D, radius: 10 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function MidnightClockTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const nyYear = newYearOf(weddingData.date)

  return (
    <PaletteContext.Provider value={C}><div data-mc lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.IVORY, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate', fontVariantNumeric: 'lining-nums',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.GOLD, 0.45),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <ClockOpening inv={inv} theme={theme} lang={lang} nyYear={nyYear} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.MIDNIGHT, border: `1.5px solid ${C.GOLD}`, boxShadow: '0 8px 20px rgba(8,12,32,.5)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.GOLD_L} idle={alpha(C.GOLD_L, 0.35)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.MIDNIGHT_D, 0.94), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.GOLD, 0.3)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.CHAMPAGNE, 0.72), fontSize: 15, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 700, fontSize: 22, ...goldText(C) }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — saat XII-də */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: NIGHT_BG(C), padding: '40px 22px 64px', textAlign: 'center', color: C.CHAMPAGNE }}>
            {BURSTS(C).slice(0, 3).map((b, i) => <Burst key={i} x={b.x} y={b.y * 0.8} size={b.s * 0.8} color={b.c} delay={i * 0.9} loop />)}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <ClockFace size={200} minDeg={0} hourDeg={0} font={head} instant glow />
            </div>
            <div style={{ position: 'relative', marginTop: 24, fontSize: 13, fontWeight: 600, letterSpacing: '.28em', textTransform: 'uppercase', color: C.GOLD_L }}>{L('hero', 'kicker', T.ny)}</div>
            <h1 style={{ position: 'relative', margin: '8px 0 0', fontFamily: head, fontWeight: 600, fontSize: nameSize(heroName), lineHeight: 1.05, overflowWrap: 'anywhere', ...goldText(C), animation: 'mc-rise 1s ease-out .2s both' }}>{heroName}</h1>
            {nyYear && <div style={{ position: 'relative', marginTop: 8, fontFamily: head, fontStyle: 'italic', fontWeight: 500, fontSize: 24, color: C.CHAMPAGNE }}>{fill(T.welcome, { y: nyYear })}</div>}
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ position: 'relative', marginTop: 8, fontSize: 15.5, color: alpha(C.CHAMPAGNE, 0.72) }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <div style={{ position: 'relative', width: 70, height: 1.5, margin: '18px auto 0', background: GOLD_GRAD(C) }} />
            <div style={{ position: 'relative', marginTop: 16, fontFamily: head, fontWeight: 700, fontSize: 'clamp(21px, 5.8vw, 25px)', color: C.CHAMPAGNE }}>{inv.fullDate}</div>
            <div style={{ position: 'relative', marginTop: 6, fontSize: 15.5, color: alpha(C.CHAMPAGNE, 0.7) }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            <p style={{ position: 'relative', margin: '18px auto 0', maxWidth: 330, fontSize: 16.5, lineHeight: 1.6, color: alpha(C.CHAMPAGNE, 0.85) }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — saat halqaları */}
          {S.countdown && (
            <Panel section="countdown" head={head} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days, 1], [cd.hours, cd.labels.hours, 24], [cd.minutes, cd.labels.minutes, 60], [cd.seconds, cd.labels.seconds, 60, true]].map(([v, l, max, pop]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ position: 'relative', aspectRatio: '1', borderRadius: '50%', padding: 4, background: max > 1 ? `conic-gradient(${C.GOLD} ${(Number(v) / max) * 360}deg, ${alpha(C.GOLD_D, 0.2)} 0)` : GOLD_GRAD(C) }}>
                      <div style={{ height: '100%', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.MIDNIGHT }}>
                        <span style={{ fontFamily: head, fontWeight: 700, fontSize: 'clamp(22px, 6.6vw, 30px)', lineHeight: 1, color: C.GOLD_L, fontVariantNumeric: 'lining-nums tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
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
              <div style={{ maxWidth: 430, margin: '0 auto', padding: 4, borderRadius: 22, background: GOLD_GRAD(C), boxShadow: '0 24px 36px -22px rgba(0,0,0,.8)' }}>
                <div style={{ borderRadius: 18, overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.MIDNIGHT} height="clamp(240px, 66vw, 300px)"
                    map={{ opacity: 0.9, filter: 'grayscale(.5)', tintOpacity: 0.16, tint: C.MIDNIGHT_L, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(240px, 66vw, 300px)', position: 'relative', background: IVORY_BG(C) }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 600, fontSize: 28, lineHeight: 1.2, ...goldText(C) }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 6, fontSize: 15.5, color: alpha(C.CHAMPAGNE, 0.72) }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={darkBtn(C)} />
            </Panel>
          )}

          {/* PROQRAM — hər tədbirin saatı */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 400, margin: '0 auto', display: 'grid', gap: 10 }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '44px 64px minmax(0, 1fr)', gap: 10, alignItems: 'center', padding: '12px 14px', borderRadius: 14, background: '#FFFFFF', boxShadow: '0 10px 18px -14px rgba(21,27,56,.45)' }}>
                    <MiniClock time={ev.time} size={36} color={i === timeline.events.length - 1 ? C.GOLD_D : C.INK} />
                    <div style={{ fontFamily: head, fontWeight: 700, fontSize: 21, color: C.GOLD_D, fontVariantNumeric: 'lining-nums tabular-nums' }}>{ev.time}</div>
                    <div style={{ fontSize: 16.5, lineHeight: 1.3, color: C.INK }}>{ev.label}</div>
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

          {/* MASA — cib saatı */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} dark title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="mc-seat-list" field={darkField(C)} suggest={suggest(C)} font={body} muted={alpha(C.CHAMPAGNE, 0.72)} accent={C.GOLD_L}
                nameStyle={{ fontFamily: head, fontWeight: 600, fontSize: 28, color: C.CHAMPAGNE }}
                card={(num) => (
                  <div style={{ paddingTop: 16 }}>
                    <PocketWatch size={190}>
                      <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '.24em', textTransform: 'uppercase', color: C.MUTED }}>{T.table}{' '}</span>
                      <span style={{ fontFamily: head, fontWeight: 700, fontSize: tableSize(num, 66), lineHeight: 1, color: C.INK }}>{num}</span>
                    </PocketWatch>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 32 }} />}
              <PhotoQr inv={inv} tr={tr} fg={C.MIDNIGHT} bg="#FFFFFF" frame={{ borderRadius: 14, border: `1.5px solid ${C.GOLD}` }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'night')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: C.LINE, hair: alpha(C.LINE, 0.7), accent: C.MIDNIGHT,
                font: body, display: head, displayItalic: false, btnFont: head,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><MiniClock time="00:00" size={48} color={C.GOLD_D} /></div>,
                marker: (a) => <span style={{ display: 'block', width: 15, height: 15, borderRadius: '50%', border: `1.5px solid ${a ? C.GOLD_D : C.LINE}`, background: a ? GOLD_GRAD(C) : 'transparent' }} />,
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField(C)} btn={darkBtn(C)} errorColor={C.GOLD_L} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '20px 20px 16px', borderRadius: 16, background: alpha('#FFFFFF', 0.05), border: `1px solid ${alpha(C.GOLD, 0.25)}` }}>
                      <blockquote style={{ margin: 0, fontFamily: head, fontStyle: 'italic', fontWeight: 500, fontSize: 20, lineHeight: 1.45, color: C.CHAMPAGNE }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 10, fontSize: 12.5, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: C.GOLD_L }}>
                        {msg.name}{msg.date ? <span style={{ fontWeight: 400, letterSpacing: '.04em', textTransform: 'none', color: alpha(C.CHAMPAGNE, 0.45) }}> · {gbook.formatDate(msg.date)}</span> : null}
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
      <span style={{ position: 'absolute', left: -20, top: -20, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 6px 10px rgba(0,0,0,.35)' }}><MiniClock time="00:00" size={40} color={C.MIDNIGHT} /></span>
    </span>
  )
}
