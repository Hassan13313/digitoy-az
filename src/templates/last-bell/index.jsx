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
import { C, SASH, GOLD_GRAD, GRID_BG, NAVY_BG, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { fill } from '../_shared/copyText'
import { Bell, SoundRings, Bow, Sash } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   LAST BELL — «Son zəng» (Məzuniyyət konsepti, 2026-10)

   Konsept: məktəbin son zəngi — ağ bantlar, qırmızı «Məzun» lenti və
   mis zəng. Açılışda dama-dama dəftər vərəqində zəng dayanır; toxunanda
   zəng çalınır, səs dalğaları yayılır və ekranı qızılı yazılı qırmızı lent
   kəsib keçir. Daxildə: qopan təqvim vərəqləri (sayğac), dərs cədvəli
   (proqram), qırmızı rozet (masa), «5» qiyməti ilə arzular.
   Şriftlər: Roboto Serif (başlıq) · Noto Sans (mətn) · Comforter (lent yazısı).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('last-bell')
const ID = 'last-bell'

const KEYFRAMES = `
@keyframes lb-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes lb-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes lb-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes lb-ring { from { transform: rotate(-22deg) } to { transform: rotate(22deg) } }
@keyframes lb-sway { 0%,100% { transform: rotate(-4deg) } 50% { transform: rotate(4deg) } }
@keyframes lb-wave { from { opacity: .9; transform: scale(.6) } to { opacity: 0; transform: scale(2.6) } }
[data-lb] span[aria-hidden="true"], [data-lb] svg[aria-hidden="true"], [data-lb] div[aria-hidden="true"] { pointer-events: none; }
[data-lb] ::placeholder { color: rgba(106,115,135,.7); }
[data-lb] [data-dark] ::placeholder { color: rgba(255,255,255,.5); }
[data-lb] input:focus-visible, [data-lb] textarea:focus-visible { border-color: ${C.RED} !important; outline: none; }
[data-lb] button:focus-visible, [data-lb] a:focus-visible, [data-lb] [role="button"]:focus-visible { outline: 2px solid ${C.RED}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-lb] *, [data-lb] { animation: none !important; transition: none !important; } }
`

const goldText = { backgroundImage: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent' }

/* ═══ 01 — AÇILIŞ: son zəng çalınır ═══ */
function BellOpening({ inv, theme, year, script }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  const T = inv.copy(TXT)
  return (
    <motion.div {...gate.gateProps} data-lb
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: GRID_BG, color: C.INK, fontFamily: theme.fonts.body }}>
      <Bow size={96} style={{ position: 'absolute', left: -10, top: 18, transform: 'rotate(-18deg)' }} />
      <Bow size={96} style={{ position: 'absolute', right: -10, top: 18, transform: 'rotate(18deg) scaleX(-1)' }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        {ot.show('kicker') && <div style={{ marginBottom: 14, fontFamily: head, fontWeight: 600, fontSize: 14, letterSpacing: '.22em', textTransform: 'uppercase', color: C.RED, animation: 'lb-rise .8s ease-out .2s both' }}>{ot.text('kicker')}</div>}
        <div style={{ position: 'relative', animation: go ? 'none' : 'lb-sway 3.2s ease-in-out infinite', transformOrigin: '50% 10%' }}>
          <SoundRings on={go} />
          <Bell size="min(38vw, 150px)" ringing={go} />
          {!go && (
            <div aria-hidden="true" style={{ position: 'absolute', left: '50%', bottom: '18%', transform: 'translateX(-50%)' }}>
              <EmblemSlot mono={ot.mono} size={44} border={`2px solid ${C.GOLD_L}`} background={C.RED} color="#FFFFFF" font={head} style={{ animation: 'none', margin: 0 }}>
                <span />
              </EmblemSlot>
            </div>
          )}
        </div>
        <div style={{ marginTop: 24, animation: 'lb-rise 1s ease-out .3s both' }}>
          {titleOv !== '' && (
            <div style={{ fontFamily: head, fontWeight: 700, fontSize: 'clamp(40px, 12vw, 58px)', lineHeight: 1.04, overflowWrap: 'anywhere', color: C.NAVY }}>
              {first}{second && <><span style={{ display: 'inline-block', margin: '0 .2em', color: C.RED }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 8, fontSize: 15.5, color: C.MUTED }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.25 }} style={{ marginTop: 22 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: SASH, color: '#FFFFFF', fontFamily: head, fontWeight: 600, fontSize: 16.5, boxShadow: '0 12px 22px -12px rgba(147,11,33,.7)', animation: 'lb-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 14, color: C.MUTED, animation: 'lb-fade .8s ease-out 1.1s both, lb-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
      {/* lent ekranı kəsib keçir */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-15%', right: '-15%', top: '65%', transform: 'rotate(-11deg)', clipPath: go ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)', transition: 'clip-path .65s cubic-bezier(.6,0,.3,1) .55s' }}>
        <Sash height={76}>
          <span style={{ fontFamily: script, fontSize: 'clamp(50px, 15vw, 66px)', lineHeight: 1, paddingTop: 8, ...goldText }}>{year ? fill(T.classOf, { y: year }) : ot.text('kicker')}</span>
        </Sash>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dark = false }) {
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? NAVY_BG : GRID_BG, color: dark ? C.WHITE : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            {kicker && <div style={{ marginBottom: 6, fontFamily: head, fontWeight: 600, fontSize: 13.5, letterSpacing: '.22em', textTransform: 'uppercase', color: dark ? C.GOLD : C.RED }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 700, fontSize: 'clamp(29px, 8.4vw, 39px)', lineHeight: 1.1, textWrap: 'balance', color: dark ? C.WHITE : C.NAVY }}>{title}</h2>}
            <div aria-hidden="true" style={{ width: 54, height: 5, margin: '14px auto 0', background: SASH, borderRadius: 1, boxShadow: `inset 0 1px 0 ${C.GOLD}, inset 0 -1px 0 ${C.GOLD}` }} />
            {sub && <p style={{ margin: '12px auto 0', maxWidth: 340, fontSize: 16, color: dark ? alpha(C.WHITE, 0.72) : C.MUTED, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: C.WHITE, border: `1.5px solid ${C.LINE}`, borderRadius: 10,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
}
const darkField = { ...field, background: alpha('#FFFFFF', 0.07), border: `1.5px solid ${alpha('#FFFFFF', 0.22)}`, color: C.WHITE }
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 15.5, fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.RED : C.WHITE, color: on ? '#FFFFFF' : C.NAVY, border: `1.5px solid ${on ? C.RED : C.LINE}`,
})
const darkBtn = (on) => ({ ...btn(on), background: on ? C.WHITE : 'transparent', color: on ? C.NAVY : C.WHITE, border: `1.5px solid ${on ? C.WHITE : alpha('#FFFFFF', 0.45)}` })
const suggest = { bg: C.WHITE, border: `1.5px solid ${C.LINE}`, active: alpha(C.RED, 0.1), text: C.INK, table: C.RED, radius: 10 }

/* Qırmızı rozet (büzməli lent) */
function Rosette({ size = 190, children }) {
  return (
    <div style={{ position: 'relative', width: size, height: size * 1.32, margin: '0 auto' }}>
      <span aria-hidden="true" style={{ position: 'absolute', left: '26%', top: '60%', width: '20%', height: '40%', background: SASH, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 86%, 0 100%)', transform: 'rotate(12deg)' }} />
      <span aria-hidden="true" style={{ position: 'absolute', right: '26%', top: '60%', width: '20%', height: '40%', background: SASH, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 86%, 0 100%)', transform: 'rotate(-12deg)' }} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: size, height: size, borderRadius: '50%', background: `repeating-conic-gradient(from 0deg, #E0213F 0 7.5deg, #A50D26 7.5deg 15deg)`, boxShadow: '0 16px 26px -14px rgba(147,11,33,.7)' }}>
        <div style={{ position: 'absolute', inset: '17%', borderRadius: '50%', background: C.WHITE, boxShadow: `0 0 0 3px ${C.GOLD}, inset 0 2px 6px rgba(0,0,0,.12)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function LastBellTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const script = "'Comforter', 'Great Vibes', cursive"
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const year = inv.dp?.year || ''

  return (
    <div data-lb lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.WHITE, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.RED, 0.3),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <BellOpening inv={inv} theme={theme} lang={lang} year={year} script={script} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: SASH, boxShadow: '0 8px 20px rgba(147,11,33,.4)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.GOLD_L} idle={alpha(C.GOLD_L, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.WHITE, 0.94), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `3px solid ${C.RED}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 15, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 700, fontSize: 20, color: C.NAVY }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — zəng, lent, bantlar */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: GRID_BG, padding: '36px 0 60px', textAlign: 'center' }}>
            <Bow size={86} style={{ position: 'absolute', left: -12, top: 10, transform: 'rotate(-18deg)' }} />
            <Bow size={86} style={{ position: 'absolute', right: -12, top: 10, transform: 'rotate(18deg) scaleX(-1)' }} />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ transformOrigin: '50% 10%', animation: 'lb-sway 3.6s ease-in-out infinite' }}><Bell size="min(30vw, 116px)" /></div>
            </div>
            <div style={{ margin: '18px -10% 0', transform: 'rotate(-5deg)' }}>
              <Sash height={68}>
                <span style={{ fontFamily: script, fontSize: 'clamp(46px, 14vw, 60px)', lineHeight: 1, paddingTop: 8, ...goldText }}>{year ? fill(T.classOf, { y: year }) : inv.eventLabel}</span>
              </Sash>
            </div>
            <div style={{ padding: '0 22px' }}>
              <div style={{ marginTop: 30, fontFamily: head, fontWeight: 600, fontSize: 13.5, letterSpacing: '.22em', textTransform: 'uppercase', color: C.RED }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              <h1 style={{ margin: '8px 0 0', fontFamily: head, fontWeight: 700, fontSize: nameSize(heroName), lineHeight: 1.04, overflowWrap: 'anywhere', color: C.NAVY, animation: 'lb-rise 1s ease-out .2s both' }}>{heroName}</h1>
              <div style={{ marginTop: 16, fontFamily: head, fontWeight: 600, fontSize: 'clamp(19px, 5.4vw, 23px)', color: C.NAVY }}>{inv.fullDate}</div>
              <div style={{ marginTop: 6, fontSize: 15.5, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 15, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              <p style={{ margin: '18px auto 0', maxWidth: 330, fontSize: 16.5, lineHeight: 1.6, color: C.INK }}>{tr.inv_join}</p>
            </div>
          </section>

          {/* SAYĞAC — qopan təqvim vərəqləri */}
          {S.countdown && (
            <Panel section="countdown" head={head} dark title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop]) => (
                  <div key={l} style={{ textAlign: 'center', borderRadius: 8, overflow: 'hidden', background: C.WHITE, boxShadow: '0 12px 18px -10px rgba(0,0,0,.5)' }}>
                    <div style={{ position: 'relative', height: 18, background: SASH }}>
                      <span aria-hidden="true" style={{ position: 'absolute', left: '28%', top: 6, width: 6, height: 6, borderRadius: '50%', background: C.NAVY_D }} />
                      <span aria-hidden="true" style={{ position: 'absolute', right: '28%', top: 6, width: 6, height: 6, borderRadius: '50%', background: C.NAVY_D }} />
                    </div>
                    <div style={{ padding: '12px 0 6px', fontFamily: head, fontWeight: 700, fontSize: 'clamp(24px, 7vw, 32px)', lineHeight: 1, color: C.NAVY, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></div>
                    <div style={{ paddingBottom: 10, fontSize: 11.5, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: C.MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', borderRadius: 18, overflow: 'hidden', isolation: 'isolate', border: `3px solid ${C.NAVY}`, boxShadow: '0 20px 30px -20px rgba(28,42,74,.6)' }}>
                <MapSection
                  weddingData={weddingData} theme={theme} accent={C.RED} height="clamp(240px, 66vw, 300px)"
                  map={{ opacity: 0.92, filter: 'grayscale(.3)', tintOpacity: 0.08, tint: C.RED, blend: 'multiply' }}
                  frame={<MapPin />}
                  fallback={<div style={{ height: 'clamp(240px, 66vw, 300px)', position: 'relative', background: GRID_BG }}><MapPin /></div>}
                />
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 700, fontSize: 25, lineHeight: 1.2, color: C.NAVY }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 6, fontSize: 15, color: C.MUTED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn} />
            </Panel>
          )}

          {/* PROQRAM — dərs cədvəli */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 400, margin: '0 auto', borderRadius: 14, overflow: 'hidden', background: C.WHITE, border: `1.5px solid ${C.LINE}`, boxShadow: '0 16px 26px -20px rgba(28,42,74,.5)' }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '44px 66px minmax(0, 1fr)', alignItems: 'center', minHeight: 58, borderTop: i ? `1px solid ${C.LINE}` : 'none' }}>
                    <div style={{ alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'center', background: i % 2 ? C.SNOW : alpha(C.RED, 0.06), borderRight: `2px solid ${alpha(C.RED, 0.45)}`, fontFamily: head, fontWeight: 700, fontSize: 18, color: C.RED }}>{i + 1}</div>
                    <div style={{ paddingLeft: 12, fontFamily: head, fontWeight: 600, fontSize: 17, color: C.NAVY, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    <div style={{ padding: '10px 14px 10px 0', fontSize: 16, lineHeight: 1.35, color: C.INK }}>{ev.label}</div>
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

          {/* MASA — rozet */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="lb-seat-list" field={field} suggest={suggest} font={body} muted={C.MUTED} accent={C.RED}
                nameStyle={{ fontFamily: head, fontWeight: 700, fontSize: 24, color: C.NAVY }}
                card={(num) => (
                  <div style={{ paddingTop: 20 }}>
                    <Rosette size={180}>
                      <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '.22em', textTransform: 'uppercase', color: C.MUTED }}>{T.table}{' '}</span>
                      <span style={{ fontFamily: head, fontWeight: 700, fontSize: tableSize(num, 52), lineHeight: 1, color: C.RED }}>{num}</span>
                    </Rosette>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 18, marginBottom: 32, paddingTop: 14 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ position: 'relative', aspectRatio: '4 / 5', padding: 6, background: C.WHITE, borderRadius: 6, boxShadow: '0 12px 20px -12px rgba(28,42,74,.45)' }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 3 }} />
                      <Bow size={46} style={{ position: 'absolute', left: '50%', top: -16, marginLeft: -23 }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.NAVY} bg={C.WHITE} frame={{ borderRadius: 14, border: `1.5px solid ${C.LINE}` }}
                btn={btn} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: C.LINE, hair: alpha(C.LINE, 0.7), accent: C.RED,
                font: body, display: head, displayItalic: false, btnFont: head,
                doneMark: <Bow size={70} style={{ margin: '0 auto 10px' }} />,
                marker: (a) => <span style={{ display: 'block', width: 15, height: 15, borderRadius: '50%', border: `2px solid ${a ? C.RED : C.LINE}`, background: a ? C.RED : 'transparent', boxShadow: a ? `inset 0 0 0 2px ${C.WHITE}` : 'none' }} />,
                suggest: { ...suggest, font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR — «5» qiyməti */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField} btn={darkBtn} errorColor={C.GOLD_L} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ position: 'relative', margin: 0, padding: '18px 54px 14px 18px', background: GRID_BG, color: C.INK, borderRadius: 8, boxShadow: '0 12px 20px -14px rgba(0,0,0,.6)' }}>
                      <span aria-hidden="true" style={{ position: 'absolute', right: 12, top: 10, width: 34, height: 34, borderRadius: '50%', border: `2px solid ${C.RED}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: head, fontStyle: 'italic', fontWeight: 700, fontSize: 20, color: C.RED, transform: 'rotate(-10deg)' }}>5</span>
                      <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.55 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, fontFamily: head, fontWeight: 600, fontSize: 14.5, color: C.RED }}>
                        {msg.name}{msg.date ? <span style={{ fontFamily: body, fontWeight: 400, fontSize: 13, color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}
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
      <span style={{ position: 'absolute', left: -22, top: -50, filter: 'drop-shadow(0 6px 6px rgba(0,0,0,.3))' }}><Bell size={44} /></span>
    </span>
  )
}
