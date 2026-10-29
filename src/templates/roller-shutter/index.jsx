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
import { C, HAZARD, STEEL_GRAD, CONCRETE_BG, CHAR_BG, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Rivets, NeonOpen, Storefront, SteelPlate } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   ROLLER SHUTTER — «Jalüz qalxır» (Açılış konsepti, 2026-10)

   Konsept: yeni mağaza / studiya / showroom açılışı — beton fasad, metal
   jalüz. Açılışda vitrin büzməli jalüzlə bağlıdır; toxunanda jalüz yuxarı
   qalxır, içəridə isti işıq və «Açıq» neon lövhəsi yanır. Daxildə: perçinli
   polad lövhələrdə sayğac, sarı etiketli proqram, trafaret masa lövhəsi,
   etiket kağızlarında təbriklər.
   Şriftlər: Alumni Sans (başlıq) · Roboto Condensed (mətn) · IBM Plex Mono (etiket).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('roller-shutter')
const ID = 'roller-shutter'

const KEYFRAMES = `
@keyframes rs-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes rs-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes rs-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes rs-flicker { 0%, 18%, 22%, 62%, 66%, 100% { opacity: 1 } 20%, 64% { opacity: .35 } }
[data-rs] span[aria-hidden="true"], [data-rs] svg[aria-hidden="true"], [data-rs] div[aria-hidden="true"] { pointer-events: none; }
[data-rs] ::placeholder { color: rgba(108,115,123,.7); }
[data-rs] [data-dark] ::placeholder { color: rgba(247,248,249,.45); }
[data-rs] input:focus-visible, [data-rs] textarea:focus-visible { border-color: ${C.YELLOW} !important; outline: none; }
[data-rs] button:focus-visible, [data-rs] a:focus-visible, [data-rs] [role="button"]:focus-visible { outline: 2px solid ${C.YELLOW}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-rs] *, [data-rs] { animation: none !important; transition: none !important; } }
`

/* Fasad lövhəsi (işıqlı qutu) */
function SignBox({ children, head, style }) {
  return (
    <div style={{ position: 'relative', padding: '12px 18px', borderRadius: 4, background: C.CHAR_D, boxShadow: `inset 0 0 0 2px ${C.CHAR_L}, 0 10px 18px -8px rgba(0,0,0,.6)`, ...style }}>
      <Rivets inset={6} size={5} />
      <div style={{ fontFamily: head, fontWeight: 800, letterSpacing: '.04em', textTransform: 'uppercase', color: C.WHITE, textShadow: '0 0 12px rgba(255,255,255,.35)' }}>{children}</div>
    </div>
  )
}

/* ═══ 01 — AÇILIŞ: jalüz qalxır ═══ */
function ShutterOpening({ inv, theme, lang, mono }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  const T = inv.copy(TXT)
  return (
    <motion.div {...gate.gateProps} data-rs
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: CONCRETE_BG, color: C.INK, fontFamily: theme.fonts.body }}>
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        {ot.show('kicker') && <div style={{ marginBottom: 10, fontFamily: mono, fontSize: 12, letterSpacing: '.22em', textTransform: 'uppercase', color: C.MUTED, animation: 'rs-rise .8s ease-out .2s both' }}>{ot.text('kicker')}</div>}
        {titleOv !== '' && (
          <SignBox head={head} style={{ maxWidth: 'min(86vw, 340px)', animation: 'rs-rise .9s ease-out .25s both' }}>
            <span style={{ fontSize: 'clamp(30px, 9vw, 42px)', lineHeight: 1 }}>{first}{second && <> {ot.text('and')} {second}</>}</span>
          </SignBox>
        )}
        <div style={{ width: 'min(76vw, 300px)', marginTop: 18 }}>
          <Storefront open={go}>
            <div style={{ animation: go ? 'rs-flicker .9s steps(1) 1.1s 1' : 'none' }}>
              <NeonOpen text={T.open} font={head} size={40} on={go} delay={1.05} />
            </div>
          </Storefront>
        </div>
        <div style={{ position: 'relative', marginTop: 16, animation: 'rs-rise 1s ease-out .35s both' }}>
          <EmblemSlot mono={ot.mono} size={56} border={`2px solid ${C.CHAR}`} background={C.YELLOW} color={C.CHAR} font={head} style={{ animation: 'none', margin: '0 auto 10px' }}>
            <span />
          </EmblemSlot>
          {ot.show('meta') && <div style={{ fontFamily: mono, fontSize: 13, letterSpacing: '.08em', color: C.INK }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.25 }} style={{ marginTop: 18 }}>
          {ot.show('cta') && (
            <div style={{ position: 'relative', minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 6, background: C.YELLOW, color: C.CHAR, fontFamily: head, fontWeight: 800, fontSize: 22, letterSpacing: '.08em', textTransform: 'uppercase', boxShadow: `0 4px 0 ${C.CHAR}`, animation: 'rs-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontFamily: mono, fontSize: 12, color: C.MUTED, animation: 'rs-fade .8s ease-out 1.1s both, rs-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
      <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 10, background: HAZARD }} />
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, mono, dark = false }) {
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? CHAR_BG : CONCRETE_BG, color: dark ? C.WHITE : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            {kicker && <div style={{ marginBottom: 6, fontFamily: mono, fontSize: 12, letterSpacing: '.22em', textTransform: 'uppercase', color: dark ? C.YELLOW : C.MUTED }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 800, fontSize: 'clamp(40px, 12vw, 56px)', lineHeight: 0.95, letterSpacing: '.02em', textTransform: 'uppercase', textWrap: 'balance', color: dark ? C.WHITE : C.CHAR }}>{title}</h2>}
            <span aria-hidden="true" style={{ display: 'block', width: 84, height: 8, margin: '14px auto 0', background: HAZARD, borderRadius: 2 }} />
            {sub && <p style={{ margin: '12px auto 0', maxWidth: 340, fontSize: 16.5, color: dark ? alpha(C.WHITE, 0.7) : C.MUTED, lineHeight: 1.5 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: '#FFFFFF', border: `2px solid ${C.LINE}`, borderRadius: 6,
  padding: '13px 16px', fontSize: 16.5, color: C.INK, outline: 'none',
}
const darkField = { ...field, background: alpha('#FFFFFF', 0.06), border: `2px solid ${alpha('#FFFFFF', 0.18)}`, color: C.WHITE }
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 6,
  fontSize: 16, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', textDecoration: 'none', cursor: 'pointer',
  background: on ? C.CHAR : 'transparent', color: on ? C.YELLOW : C.CHAR, border: `2px solid ${C.CHAR}`,
})
const darkBtn = (on) => ({ ...btn(on), background: on ? C.YELLOW : 'transparent', color: on ? C.CHAR : C.WHITE, border: `2px solid ${on ? C.YELLOW : alpha('#FFFFFF', 0.4)}` })
const suggest = { bg: '#FFFFFF', border: `2px solid ${C.LINE}`, active: alpha(C.YELLOW, 0.35), text: C.INK, table: C.CHAR, radius: 6 }

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function RollerShutterTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const mono = "'IBM Plex Mono', ui-monospace, monospace"
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)

  return (
    <div data-rs lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.CONCRETE, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.YELLOW, 0.45),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <ShutterOpening inv={inv} theme={theme} lang={lang} mono={mono} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: 10, background: C.YELLOW, boxShadow: `0 4px 0 ${C.CHAR}, 0 10px 20px rgba(0,0,0,.25)` }}>
        {({ playing }) => <EqBars playing={playing} color={C.CHAR} idle={alpha(C.CHAR, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.CHAR, 0.96), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `3px solid ${C.YELLOW}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.WHITE, 0.75), fontSize: 15.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 800, fontSize: 26, letterSpacing: '.06em', textTransform: 'uppercase', color: C.WHITE }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — açıq vitrin */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: CONCRETE_BG, padding: '36px 22px 64px', textAlign: 'center' }}>
            <div style={{ maxWidth: 360, margin: '0 auto' }}>
              <SignBox head={head}>
                <span style={{ fontSize: nameSize(heroName), lineHeight: 0.95, overflowWrap: 'anywhere' }}>{heroName}</span>
              </SignBox>
              <Storefront open instant aspect="1.5" style={{ marginTop: 14 }}>
                <NeonOpen text={T.open} font={head} size={36} />
              </Storefront>
            </div>
            <div style={{ marginTop: 24, fontFamily: mono, fontSize: 12.5, letterSpacing: '.22em', textTransform: 'uppercase', color: C.MUTED }}>{L('hero', 'kicker', T.opening)}</div>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 8, fontSize: 16.5, fontWeight: 600, color: C.INK }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <div style={{ display: 'inline-block', marginTop: 16, padding: '8px 16px', background: C.YELLOW, fontFamily: head, fontWeight: 800, fontSize: 'clamp(24px, 7vw, 30px)', lineHeight: 1, letterSpacing: '.04em', textTransform: 'uppercase', color: C.CHAR, boxShadow: `4px 4px 0 ${C.CHAR}` }}>{inv.fullDate}</div>
            <div style={{ marginTop: 12, fontFamily: mono, fontSize: 13, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            <p style={{ margin: '18px auto 0', maxWidth: 330, fontSize: 17, lineHeight: 1.55, color: C.INK }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — polad lövhələr */}
          {S.countdown && (
            <Panel section="countdown" head={head} mono={mono} dark title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <SteelPlate pad="18px 4px 14px">
                      <div style={{ fontFamily: head, fontWeight: 900, fontSize: 'clamp(32px, 10vw, 46px)', lineHeight: 0.9, color: C.CHAR, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></div>
                    </SteelPlate>
                    <div style={{ marginTop: 10, fontFamily: mono, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: C.YELLOW }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} mono={mono} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <SteelPlate pad="8px" radius={10} style={{ maxWidth: 430, margin: '0 auto' }}>
                <div style={{ borderRadius: 6, overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.CHAR} height="clamp(240px, 66vw, 300px)"
                    map={{ opacity: 0.92, filter: 'grayscale(.85) contrast(1.05)', tintOpacity: 0.1, tint: C.YELLOW, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(240px, 66vw, 300px)', position: 'relative', background: CONCRETE_BG }}><MapPin /></div>}
                  />
                </div>
              </SteelPlate>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 800, fontSize: 32, lineHeight: 1, textTransform: 'uppercase', color: C.CHAR }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 6, fontFamily: mono, fontSize: 12.5, letterSpacing: '.14em', textTransform: 'uppercase', color: C.MUTED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn} />
            </Panel>
          )}

          {/* PROQRAM — sarı etiketlər */}
          {S.program && (
            <Panel section="program" head={head} mono={mono} dark title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 400, margin: '0 auto', display: 'grid', gap: 10 }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '84px minmax(0, 1fr)', alignItems: 'stretch', borderRadius: 6, overflow: 'hidden', background: alpha('#FFFFFF', 0.06), border: `1px solid ${alpha('#FFFFFF', 0.1)}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 0', background: C.YELLOW, color: C.CHAR, fontFamily: head, fontWeight: 900, fontSize: 26, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', fontSize: 17, lineHeight: 1.3, color: C.WHITE }}>{ev.label}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} mono={mono} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={body} align="center" />
            </Panel>
          )}

          {/* MASA — trafaret lövhə */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} mono={mono} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="rs-seat-list" field={field} suggest={suggest} font={body} muted={C.MUTED} accent={C.CHAR}
                nameStyle={{ fontFamily: head, fontWeight: 800, fontSize: 32, textTransform: 'uppercase', color: C.CHAR }}
                card={(num) => (
                  <div style={{ maxWidth: 300, margin: '20px auto 0', padding: 8, borderRadius: 10, background: HAZARD, boxShadow: '0 18px 26px -16px rgba(0,0,0,.5)' }}>
                    <SteelPlate pad="18px 14px 20px" radius={6}>
                      <div style={{ fontFamily: mono, fontSize: 12, letterSpacing: '.3em', textTransform: 'uppercase', color: C.CHAR }}>{T.table}{' '}</div>
                      <div style={{ fontFamily: head, fontWeight: 900, fontSize: tableSize(num, 110), lineHeight: 0.85, color: C.CHAR, letterSpacing: '.02em' }}>{num}</div>
                    </SteelPlate>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} mono={mono} dark title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14, marginBottom: 32 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ position: 'relative', aspectRatio: '4 / 5', padding: 6, borderRadius: 6, background: STEEL_GRAD }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 3, filter: 'contrast(1.05) saturate(.9)' }} />
                      <Rivets inset={2} size={5} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.CHAR} bg="#FFFFFF" frame={{ borderRadius: 6, border: `3px solid ${C.YELLOW}` }}
                btn={darkBtn} muted={alpha(C.WHITE, 0.7)} desc={galleryDesc(props.adminOverrides, tr, lang, 'event')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} mono={mono} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: C.LINE, hair: alpha(C.LINE, 0.7), accent: C.CHAR,
                font: body, display: head, displayItalic: false, btnFont: head,
                doneMark: <span aria-hidden="true" style={{ display: 'block', width: 90, height: 12, margin: '0 auto 12px', background: HAZARD, borderRadius: 2 }} />,
                marker: (a) => <span style={{ display: 'block', width: 15, height: 15, borderRadius: 3, border: `2px solid ${C.CHAR}`, background: a ? C.YELLOW : 'transparent' }} />,
                suggest: { ...suggest, font: body },
              }} />
            </Panel>
          )}

          {/* TƏBRİKLƏR — etiketlər */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} mono={mono} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField} btn={darkBtn} errorColor={C.YELLOW} />
              <div style={{ display: 'grid', gap: 16 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ position: 'relative', margin: 0, padding: '18px 18px 14px 46px', background: '#F4EBD6', color: C.INK, clipPath: 'polygon(22px 0, 100% 0, 100% 100%, 22px 100%, 0 50%)', transform: `rotate(${[-0.8, 0.6, -0.4][i % 3]}deg)` }}>
                      <span aria-hidden="true" style={{ position: 'absolute', left: 16, top: '50%', width: 10, height: 10, marginTop: -5, borderRadius: '50%', background: C.CHAR, boxShadow: `0 0 0 3px ${C.STEEL_L}` }} />
                      <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.5 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, fontFamily: mono, fontSize: 12, fontWeight: 500, letterSpacing: '.06em', textTransform: 'uppercase', color: C.CHAR }}>
                        {msg.name}{msg.date ? <span style={{ color: C.MUTED, textTransform: 'none' }}> · {gbook.formatDate(msg.date)}</span> : null}
                      </figcaption>
                    </figure>
                  )
                })}
              </div>
            </Panel>
          )}

          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={body} />
        </motion.div>
      )}
    </div>
  )
}

function MapPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -16, top: -16, width: 32, height: 32, borderRadius: 6, background: C.YELLOW, boxShadow: `0 0 0 3px ${C.CHAR}, 0 6px 10px rgba(0,0,0,.35)`, transform: 'rotate(45deg)' }} />
    </span>
  )
}
