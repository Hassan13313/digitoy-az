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
import { C, GOLD_GRAD, NAVY_BG, IVORY_BG, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { fill } from '../_shared/copyText'
import { Cap, ConfettiBurst, Seal, Scroll } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   CAPS TOSS — «Papaqlar havaya» (Məzuniyyət konsepti, 2026-10)

   Konsept: məzunların ən məşhur anı — papaqları havaya atmaq. Açılışda gecə
   mavisi səhnədə üç məzun papağı; toxunanda papaqlar fırlanaraq havaya uçur,
   qızılı konfetti yağır. Daxildə:
     hero     → havada asılı papaqlar, «Məzun 2027»
     sayğac   → papaq taxtası kimi romb kartlar
     proqram  → diplom tumarı
     masa     → qızıl möhürlü sertifikat
   Şriftlər: Alegreya SC (başlıq) · Source Serif 4 (mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('caps-toss')
const ID = 'caps-toss'

const KEYFRAMES = `
@keyframes ct-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes ct-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes ct-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes ct-bob { 0%,100% { transform: translateY(0) rotate(var(--r, 0deg)) } 50% { transform: translateY(-6px) rotate(var(--r, 0deg)) } }
@keyframes ct-fall { from { transform: translate(0, 0) rotate(0) } to { transform: translate(var(--dx), 112vh) rotate(calc(var(--r) * 3)) } }
[data-ct] span[aria-hidden="true"], [data-ct] svg[aria-hidden="true"], [data-ct] div[aria-hidden="true"] { pointer-events: none; }
[data-ct] ::placeholder { color: rgba(107,117,144,.7); }
[data-ct] [data-dark] ::placeholder { color: rgba(246,220,146,.45); }
[data-ct] input:focus-visible, [data-ct] textarea:focus-visible { border-color: ${C.GOLD_D} !important; outline: none; }
[data-ct] button:focus-visible, [data-ct] a:focus-visible, [data-ct] [role="button"]:focus-visible { outline: 2px solid ${C.GOLD}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-ct] *, [data-ct] { animation: none !important; transition: none !important; } }
`

const goldText = { backgroundImage: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent' }
const CAPS = [
  { x: -36, r: -14, fly: 'translate(-60vw, -120vh) rotate(-620deg)', d: 0 },
  { x: 0, r: 4, fly: 'translate(4vw, -130vh) rotate(560deg)', d: 0.08 },
  { x: 36, r: 16, fly: 'translate(58vw, -118vh) rotate(700deg)', d: 0.15 },
]

/* ═══ 01 — AÇILIŞ: papaqlar havaya ═══ */
function CapsOpening({ inv, theme, year }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  const T = inv.copy(TXT)
  return (
    <motion.div {...gate.gateProps} data-ct
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: NAVY_BG, color: C.IVORY, fontFamily: theme.fonts.body }}>
      <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: -80, width: '130%', height: '70%', transform: 'translateX(-50%)', background: 'radial-gradient(50% 60% at 50% 0%, rgba(246,220,146,.18), transparent 70%)' }} />
      <ConfettiBurst on={go} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ animation: 'ct-rise 1s ease-out .2s both' }}>
          {ot.show('kicker') && <div style={{ fontFamily: head, fontSize: 15, letterSpacing: '.22em', color: C.GOLD_L }}>{ot.text('kicker')}</div>}
          {year && <div style={{ marginTop: 6, fontFamily: head, fontWeight: 700, fontSize: 'clamp(26px, 8vw, 36px)', letterSpacing: '.04em', ...goldText }}>{fill(T.classOf, { y: year })}</div>}
        </div>
        {/* papaqlar */}
        <div style={{ position: 'relative', width: 'min(86vw, 340px)', height: 'min(40vw, 160px)', marginTop: 26 }}>
          {CAPS.map((c, i) => (
            <div key={i} style={{ position: 'absolute', left: `calc(50% + ${c.x}%)`, top: i === 1 ? 0 : '22%', transform: 'translateX(-50%)' }}>
              <div style={{ transform: go ? c.fly : 'none', transition: `transform 1.35s cubic-bezier(.45,.05,.55,.95) ${c.d}s` }}>
                <div style={{ '--r': `${c.r}deg`, animation: go ? 'none' : `ct-bob ${3 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`, transform: `rotate(${c.r}deg)` }}>
                  <Cap size={i === 1 ? 'min(34vw, 136px)' : 'min(27vw, 108px)'} />
                </div>
              </div>
            </div>
          ))}
          {!go && (
            <div aria-hidden="true" style={{ position: 'absolute', left: '50%', bottom: -28, transform: 'translateX(-50%)' }}>
              <EmblemSlot mono={ot.mono} size={52} border={`1.5px solid ${C.GOLD}`} background={C.NAVY} color={C.GOLD_L} font={head} style={{ animation: 'none', margin: 0 }}>
                <span />
              </EmblemSlot>
            </div>
          )}
        </div>
        <div style={{ marginTop: 40, animation: 'ct-rise 1s ease-out .35s both' }}>
          {titleOv !== '' && (
            <div style={{ fontFamily: head, fontWeight: 700, fontSize: 'clamp(40px, 12vw, 58px)', lineHeight: 1.04, overflowWrap: 'anywhere', color: C.IVORY }}>
              {first}{second && <><span style={{ display: 'inline-block', margin: '0 .2em', color: C.GOLD }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 8, fontSize: 16, color: alpha(C.IVORY, 0.7) }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: 22 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: GOLD_GRAD, color: C.NAVY_D, fontFamily: head, fontWeight: 700, fontSize: 17, letterSpacing: '.06em', boxShadow: '0 12px 24px -12px rgba(229,185,78,.6)', animation: 'ct-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 14.5, color: alpha(C.IVORY, 0.55), animation: 'ct-fade .8s ease-out 1.1s both, ct-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dark = false }) {
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? NAVY_BG : IVORY_BG, color: dark ? C.IVORY : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Cap size={46} style={{ margin: '0 auto 10px', transform: 'rotate(-8deg)' }} />
            {kicker && <div style={{ marginBottom: 6, fontFamily: head, fontSize: 14.5, letterSpacing: '.2em', color: dark ? C.GOLD : C.GOLD_D }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 700, fontSize: 'clamp(28px, 8.2vw, 38px)', lineHeight: 1.1, textWrap: 'balance', ...(dark ? goldText : { color: C.NAVY }) }}>{title}</h2>}
            {sub && <p style={{ margin: '10px auto 0', maxWidth: 340, fontSize: 16.5, color: dark ? alpha(C.IVORY, 0.7) : C.MUTED, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: '#FFFFFF', border: `1px solid ${alpha(C.NAVY, 0.2)}`, borderRadius: 10,
  padding: '14px 16px', fontSize: 16.5, color: C.INK, outline: 'none',
}
const darkField = { ...field, background: alpha('#FFFFFF', 0.06), border: `1px solid ${alpha(C.GOLD, 0.35)}`, color: C.IVORY }
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 16, fontWeight: 500, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.NAVY : 'transparent', color: on ? C.GOLD_L : C.NAVY, border: `1.5px solid ${C.NAVY}`,
})
const darkBtn = (on) => ({ ...btn(on), background: on ? GOLD_GRAD : 'transparent', color: on ? C.NAVY_D : C.GOLD_L, border: `1.5px solid ${on ? C.GOLD : alpha(C.GOLD, 0.5)}` })
const suggest = { bg: '#FFFFFF', border: `1px solid ${alpha(C.NAVY, 0.2)}`, active: alpha(C.GOLD, 0.25), text: C.INK, table: C.GOLD_D, radius: 10 }

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function CapsTossTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const year = inv.dp?.year || ''

  return (
    <div data-ct lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.IVORY, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.GOLD, 0.4),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <CapsOpening inv={inv} theme={theme} lang={lang} year={year} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.NAVY, border: `1.5px solid ${C.GOLD}`, boxShadow: '0 8px 20px rgba(12,21,41,.45)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.GOLD_L} idle={alpha(C.GOLD_L, 0.35)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.NAVY_D, 0.94), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.GOLD, 0.3)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.IVORY, 0.7), fontSize: 15.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 700, fontSize: 20, letterSpacing: '.06em', ...goldText }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — havada papaqlar */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: NAVY_BG, padding: '40px 22px 64px', textAlign: 'center', color: C.IVORY }}>
            <div aria-hidden="true" style={{ position: 'relative', height: 'min(44vw, 180px)', maxWidth: 360, margin: '0 auto' }}>
              {[[8, 30, -24, 92], [40, 0, 10, 120], [72, 34, 28, 86]].map(([x, y, r, s], i) => (
                <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, '--r': `${r}deg`, animation: `ct-bob ${3.4 + i * 0.5}s ease-in-out ${i * 0.4}s infinite` }}>
                  <Cap size={s} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, fontFamily: head, fontSize: 15, letterSpacing: '.22em', color: C.GOLD_L }}>{L('hero', 'kicker', inv.eventLabel)}</div>
            {year && <div style={{ display: 'inline-block', marginTop: 10, padding: '6px 18px', border: `1px solid ${alpha(C.GOLD, 0.6)}`, borderRadius: 999, fontFamily: head, fontWeight: 700, fontSize: 19, letterSpacing: '.06em', ...goldText }}>{fill(T.classOf, { y: year })}</div>}
            <h1 style={{ margin: '16px 0 0', fontFamily: head, fontWeight: 700, fontSize: nameSize(heroName), lineHeight: 1.04, overflowWrap: 'anywhere', color: C.IVORY, animation: 'ct-rise 1s ease-out .2s both' }}>{heroName}</h1>
            <div style={{ width: 70, height: 2, margin: '20px auto 0', background: GOLD_GRAD }} />
            <div style={{ marginTop: 18, fontFamily: head, fontWeight: 500, fontSize: 'clamp(20px, 5.6vw, 24px)', color: C.IVORY }}>{inv.fullDate}</div>
            <div style={{ marginTop: 6, fontSize: 16, color: alpha(C.IVORY, 0.7) }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 15, color: alpha(C.IVORY, 0.7) }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <p style={{ margin: '18px auto 0', maxWidth: 330, fontSize: 17, fontStyle: 'italic', lineHeight: 1.6, color: alpha(C.IVORY, 0.85) }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — romb kartlar */}
          {S.countdown && (
            <Panel section="countdown" head={head} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(10px, 3.6vw, 18px)', maxWidth: 380, margin: '0 auto', paddingTop: 10 }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ position: 'relative', width: '76%', aspectRatio: '1', margin: '10% auto', transform: 'rotate(45deg)', background: C.NAVY, borderRadius: 6, boxShadow: `0 0 0 2px ${C.IVORY}, 0 0 0 3.5px ${C.GOLD}, 0 12px 18px -10px rgba(12,21,41,.6)` }}>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-45deg)' }}>
                        <span style={{ fontFamily: head, fontWeight: 700, fontSize: 'clamp(20px, 6vw, 27px)', lineHeight: 1, color: C.GOLD_L, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                      </div>
                    </div>
                    <div style={{ marginTop: 12, fontFamily: head, fontSize: 13, letterSpacing: '.12em', color: C.MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} dark title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: 4, borderRadius: 20, background: GOLD_GRAD, boxShadow: '0 24px 36px -22px rgba(0,0,0,.8)' }}>
                <div style={{ borderRadius: 16, overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.NAVY} height="clamp(240px, 66vw, 300px)"
                    map={{ opacity: 0.9, filter: 'grayscale(.4) contrast(1.05)', tintOpacity: 0.14, tint: C.NAVY_L, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(240px, 66vw, 300px)', position: 'relative', background: IVORY_BG }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 700, fontSize: 25, lineHeight: 1.2, color: C.IVORY }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 6, fontSize: 16, fontStyle: 'italic', color: C.GOLD_L }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={darkBtn} />
            </Panel>
          )}

          {/* PROQRAM — diplom tumarı */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <Scroll style={{ maxWidth: 400, marginInline: 'auto' }}>
                <div style={{ padding: '30px 22px 26px' }}>
                  {timeline.events.map((ev, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '64px 18px minmax(0, 1fr)', alignItems: 'center', gap: 6, padding: '10px 0', borderTop: i ? `1px solid ${alpha(C.NAVY, 0.1)}` : 'none' }}>
                      <div style={{ fontFamily: head, fontWeight: 700, fontSize: 18, color: C.NAVY, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                      <span aria-hidden="true" style={{ width: 8, height: 8, transform: 'rotate(45deg)', background: C.GOLD }} />
                      <div style={{ fontSize: 17, lineHeight: 1.35, color: C.INK }}>{ev.label}</div>
                    </div>
                  ))}
                </div>
              </Scroll>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" />
            </Panel>
          )}

          {/* MASA — sertifikat */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} dark title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="ct-seat-list" field={darkField} suggest={suggest} font={body} muted={alpha(C.IVORY, 0.7)} accent={C.GOLD_L}
                nameStyle={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}
                card={(num) => (
                  <div style={{ position: 'relative', maxWidth: 320, margin: '22px auto 0', padding: '26px 20px 30px', background: C.PARCH, color: C.INK, textAlign: 'center', boxShadow: `0 0 0 6px ${C.PARCH}, 0 0 0 7px ${C.GOLD_D}, 0 24px 34px -18px rgba(0,0,0,.8)` }}>
                    <div style={{ fontFamily: head, fontWeight: 700, fontSize: 'clamp(22px, 6.4vw, 28px)', lineHeight: 1.15, color: C.NAVY, overflowWrap: 'anywhere' }}>{seating.selected?.full_name}</div>
                    <div style={{ width: 60, height: 1, margin: '12px auto', background: C.GOLD_D }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                      <div style={{ fontFamily: head, fontSize: 16, letterSpacing: '.2em', color: C.MUTED }}>{T.table}{' '}</div>
                      <Seal size={76}>
                        <span style={{ fontFamily: head, fontWeight: 700, fontSize: tableSize(num, 30), lineHeight: 1, color: '#5E4410' }}>{num}</span>
                      </Seal>
                    </div>
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
                    <div key={i} style={{ aspectRatio: '4 / 5', padding: 5, borderRadius: 12, background: C.NAVY, boxShadow: `inset 0 0 0 1.5px ${C.GOLD}, 0 12px 18px -12px rgba(12,21,41,.5)` }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 8 }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.NAVY} bg="#FFFFFF" frame={{ borderRadius: 14, border: `1.5px solid ${C.GOLD}`, boxShadow: '0 12px 18px -12px rgba(12,21,41,.4)' }}
                btn={btn} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.NAVY, 0.25), hair: alpha(C.NAVY, 0.12), accent: C.NAVY,
                font: body, display: head, displayItalic: false, btnFont: head,
                doneMark: <Cap size={64} style={{ margin: '0 auto 10px' }} />,
                marker: (a) => <span style={{ display: 'block', width: 12, height: 12, transform: 'rotate(45deg)', border: `1.5px solid ${a ? C.GOLD_D : alpha(C.NAVY, 0.35)}`, background: a ? C.GOLD : 'transparent' }} />,
                suggest: { ...suggest, font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField} btn={darkBtn} errorColor={C.GOLD_L} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '20px 20px 16px', borderRadius: 14, background: alpha('#FFFFFF', 0.05), border: `1px solid ${alpha(C.GOLD, 0.25)}` }}>
                      <blockquote style={{ margin: 0, fontSize: 17, fontStyle: 'italic', lineHeight: 1.55, color: C.IVORY }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 10, fontFamily: head, fontWeight: 700, fontSize: 15, letterSpacing: '.08em', color: C.GOLD_L }}>
                        {msg.name}{msg.date ? <span style={{ fontFamily: body, fontWeight: 400, letterSpacing: 0, fontSize: 13, color: alpha(C.IVORY, 0.5) }}> · {gbook.formatDate(msg.date)}</span> : null}
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
      <span style={{ position: 'absolute', left: -28, top: -30, filter: 'drop-shadow(0 6px 6px rgba(0,0,0,.35))' }}><Cap size={56} /></span>
    </span>
  )
}
