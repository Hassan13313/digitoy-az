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
import { C, PAPER_BG, OPEN_BLOOMS, WREATH, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { WatercolorDefs, Bloom, Dab, Sprig } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   PASTEL BLOOM — «Akvarel çiçəklər» (Baby shower konsepti, 2026-10)

   Konsept: akvarel kağızına çəkilmiş pastel çiçəklər — çəhrayı, adaçayı,
   yağ sarısı, lavanda. Açılışda kağız təmizdir; toxunanda çiçəklər
   akvarel kimi kağıza yayılır (blur → aydın). Daxildə:
     hero      → çiçək çələngi içində ad
     sayğac    → dörd akvarel ləkəsi
     masa      → böyük çiçəyin ortasında rəqəm
   Akvarel effekti SVG filtri ilə (feTurbulence + feDisplacementMap).
   Şriftlər: Cormorant Infant (başlıq) · Nunito Sans (mətn) · Caveat (əl yazısı) —
   hamısında Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('pastel-bloom')
const ID = 'pastel-bloom'
const HAND = "'Caveat', 'Cormorant Garamond', cursive"

const TONE_ROW = ['blush', 'sage', 'butter', 'lavender']

const KEYFRAMES = `
@keyframes pb-paint { 0% { opacity: 0; transform: scale(.35); filter: blur(10px) } 60% { opacity: .95; filter: blur(2px) } 100% { opacity: .92; transform: scale(1); filter: blur(0) } }
@keyframes pb-sway { 0%,100% { transform: rotate(-3deg) } 50% { transform: rotate(3deg) } }
@keyframes pb-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes pb-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes pb-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
[data-pb] span[aria-hidden="true"], [data-pb] svg[aria-hidden="true"], [data-pb] div[aria-hidden="true"] { pointer-events: none; }
[data-pb] ::placeholder { color: rgba(133,115,122,.6); }
[data-pb] input:focus-visible, [data-pb] textarea:focus-visible { border-color: ${C.BLUSH_D} !important; outline: none; }
[data-pb] button:focus-visible, [data-pb] a:focus-visible, [data-pb] [role="button"]:focus-visible { outline: 2px solid ${C.SAGE_D}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-pb] *, [data-pb] { animation: none !important; transition: none !important; } }
`

/* ═══ 01 — AÇILIŞ: çiçəklər kağıza yayılır ═══ */
function BloomOpening({ inv, theme }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-pb
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: PAPER_BG, color: C.INK, fontFamily: theme.fonts.body }}>
      {go && OPEN_BLOOMS.map(([x, y, s, tone, d, r], i) => (
        <div key={i} aria-hidden="true" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, animation: `pb-paint 1.1s cubic-bezier(.3,.7,.3,1) ${d}s both` }}>
          <Bloom size={s} tone={tone} rotate={r} />
        </div>
      ))}
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 26px', textAlign: 'center' }}>
        <div style={{ animation: 'pb-rise 1s ease-out .2s both' }}>
          <EmblemSlot mono={ot.mono} size={60} border={`1px solid ${alpha(C.BLUSH_D, 0.4)}`} background={alpha('#FFFFFF', 0.6)} color={C.BLUSH_D} font={head} style={{ animation: 'none', margin: '0 auto 14px' }}>
            <Bloom size={44} tone="blush" style={{ margin: '0 auto' }} />
          </EmblemSlot>
          {ot.show('kicker') && <div style={{ fontFamily: HAND, fontSize: 28, color: C.BLUSH_D }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 4, fontFamily: head, fontWeight: 500, fontSize: 'clamp(42px, 12.4vw, 58px)', lineHeight: 1.04, color: C.INK, overflowWrap: 'anywhere' }}>
              {first}{second && <><span style={{ display: 'block', fontFamily: HAND, fontSize: '.6em', color: C.SAGE_D }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 10, fontSize: 15, color: C.MUTED }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: 30 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 28px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: C.BLUSH_D, color: '#FFFFFF', fontWeight: 600, fontSize: 16, boxShadow: '0 12px 24px -12px rgba(217,142,147,.8)', animation: 'pb-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 10, fontFamily: HAND, fontSize: 19, color: C.MUTED, animation: 'pb-fade .8s ease-out 1.1s both, pb-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, tint }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: tint || PAPER_BG }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <Sprig />
            {title && <h2 style={{ margin: '10px 0 0', fontFamily: head, fontWeight: 500, fontSize: 'clamp(31px, 9vw, 42px)', lineHeight: 1.1, color: C.INK, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 6, fontFamily: HAND, fontSize: 22, color: C.BLUSH_D }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 340, fontSize: 15.5, color: C.MUTED, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: alpha('#FFFFFF', 0.8), border: `1px solid ${alpha(C.BLUSH_D, 0.35)}`, borderRadius: 18,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
}
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 15.5, fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.BLUSH_D : alpha('#FFFFFF', 0.7), color: on ? '#FFFFFF' : C.BLUSH_D, border: `1px solid ${on ? C.BLUSH_D : alpha(C.BLUSH_D, 0.45)}`,
})
const suggest = { bg: '#FFFFFF', border: `1px solid ${alpha(C.BLUSH_D, 0.3)}`, active: alpha(C.BLUSH, 0.3), text: C.INK, table: C.BLUSH_D, radius: 18 }
const ALT = `radial-gradient(circle at 80% 20%, rgba(205,191,230,.18), transparent 45%), radial-gradient(circle, rgba(78,63,69,.03) 1px, transparent 1.4px) 0 0 / 6px 6px, ${C.PAPER_D}`

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function PastelBloomTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)

  return (
    <div data-pb lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.PAPER, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.BLUSH, 0.35),
    }}>
      <style>{KEYFRAMES}</style>
      <WatercolorDefs />
      {!inv.opened && <BloomOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.BLUSH_D, border: '3px solid #FFFFFF', boxShadow: '0 8px 18px rgba(217,142,147,.45)' }}>
        {({ playing }) => <EqBars playing={playing} color="#FFFFFF" idle={alpha('#FFFFFF', 0.5)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.PAPER, 0.92), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.BLUSH_D, 0.2)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: HAND, fontSize: 24, color: C.BLUSH_D }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — çiçək çələngi */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: PAPER_BG, padding: '40px 18px 58px', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 'min(92vw, 380px)', aspectRatio: '1', margin: '0 auto' }}>
              {WREATH.map((w, i) => (
                <div key={i} aria-hidden="true" style={{ position: 'absolute', left: `${w.x}%`, top: `${w.y}%`, transform: 'translate(-50%, -50%)', animation: `pb-paint 1s cubic-bezier(.3,.7,.3,1) ${(0.1 + i * 0.08).toFixed(2)}s both` }}>
                  <Bloom size={w.s} tone={w.tone} rotate={w.r} />
                </div>
              ))}
              <div style={{ position: 'absolute', inset: '16%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontFamily: HAND, fontSize: 26, color: C.BLUSH_D }}>{L('hero', 'kicker', inv.eventLabel)}</div>
                <h1 style={{ margin: '4px 0 0', fontFamily: head, fontWeight: 500, fontSize: nameSize(heroName), lineHeight: 1.02, color: C.INK, overflowWrap: 'anywhere', animation: 'pb-rise 1s ease-out .4s both' }}>{heroName}</h1>
              </div>
            </div>
            <div style={{ marginTop: 18, fontFamily: head, fontWeight: 500, fontSize: 'clamp(22px, 6.4vw, 28px)', color: C.INK }}>{inv.fullDate}</div>
            <div style={{ marginTop: 6, fontSize: 16, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 15, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <p style={{ margin: '16px auto 0', maxWidth: 330, fontFamily: head, fontStyle: 'italic', fontSize: 20, lineHeight: 1.5, color: C.MUTED }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — akvarel ləkələri */}
          {S.countdown && (
            <Panel section="countdown" head={head} tint={ALT} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(6px, 2.4vw, 12px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <Dab key={l} size="min(22vw, 92px)" tone={TONE_ROW[i]}>
                    <span style={{ fontFamily: head, fontWeight: 600, fontSize: 'clamp(24px, 7vw, 32px)', lineHeight: 1, color: C.INK, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                    <span style={{ fontFamily: HAND, fontSize: 17, lineHeight: 1, color: C.INK }}>{l}</span>
                  </Dab>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ position: 'relative', maxWidth: 430, margin: '0 auto' }}>
                <div aria-hidden="true" style={{ position: 'absolute', left: -26, top: -30 }}><Bloom size={92} tone="blush" rotate={20} /></div>
                <div aria-hidden="true" style={{ position: 'absolute', right: -22, bottom: -26 }}><Bloom size={80} tone="lavender" rotate={-30} /></div>
                <div style={{ position: 'relative', padding: 8, background: '#FFFFFF', borderRadius: 28, boxShadow: '0 22px 40px -28px rgba(78,63,69,.5)' }}>
                  <div style={{ borderRadius: 22, overflow: 'hidden', isolation: 'isolate' }}>
                    <MapSection
                      weddingData={weddingData} theme={theme} accent={C.BLUSH_D} height="clamp(250px, 70vw, 320px)"
                      map={{ opacity: 0.85, filter: 'saturate(.6) brightness(1.06)', tintOpacity: 0.14, tint: C.BLUSH, blend: 'multiply' }}
                      frame={<MapPin />}
                      fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: ALT }}><MapPin /></div>}
                    />
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 30, fontFamily: head, fontWeight: 600, fontSize: 27, lineHeight: 1.2, color: C.INK }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 2, fontFamily: HAND, fontSize: 21, color: C.MUTED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn} />
            </Panel>
          )}

          {/* PROQRAM */}
          {S.program && (
            <Panel section="program" head={head} tint={ALT} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 380, margin: '0 auto', display: 'grid', gap: 12 }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '62px minmax(0, 1fr)', gap: 12, alignItems: 'center', padding: '8px 14px 8px 6px', borderRadius: 999, background: alpha('#FFFFFF', 0.7) }}>
                    <Dab size={60} tone={TONE_ROW[i % 4]}>
                      <span style={{ fontWeight: 700, fontSize: 13.5, color: C.INK, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</span>
                    </Dab>
                    <div style={{ fontSize: 16.5, lineHeight: 1.35, color: C.INK }}>{ev.label}</div>
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

          {/* MASA — çiçəyin ortasında */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} tint={ALT} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="pb-seat-list" field={field} suggest={suggest} font={body} muted={C.MUTED} accent={C.BLUSH_D}
                nameStyle={{ fontFamily: HAND, fontSize: 28 }}
                card={(num) => (
                  <div style={{ position: 'relative', width: 230, height: 230, margin: '0 auto', animation: 'pb-paint 1s cubic-bezier(.3,.7,.3,1) both' }}>
                    <Bloom size={230} tone="blush" petals={8} style={{ position: 'absolute', inset: 0 }} />
                    <div style={{ position: 'absolute', left: '50%', top: '50%', width: 104, height: 104, margin: '-52px 0 0 -52px', borderRadius: '50%', background: alpha('#FFFFFF', 0.92), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px -8px rgba(78,63,69,.4)' }}>
                      <span style={{ fontFamily: HAND, fontSize: 18, lineHeight: 1, color: C.BLUSH_D }}>{T.table}</span>
                      <span style={{ fontFamily: head, fontWeight: 600, fontSize: tableSize(num, 46), lineHeight: 1, color: C.INK }}>{num}</span>
                    </div>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, marginBottom: 32 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ aspectRatio: '4 / 5', overflow: 'hidden', borderRadius: 18, background: C.PAPER_D, border: '6px solid #FFFFFF', boxShadow: '0 14px 22px -14px rgba(78,63,69,.45)', transform: `rotate(${[-3, 2, -1.5, 2.5, -2, 1][i % 6]}deg)` }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.INK} bg="#FFFFFF" frame={{ borderRadius: 22, boxShadow: `0 0 0 6px ${alpha(C.BLUSH, 0.4)}` }}
                btn={btn} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} tint={ALT} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.BLUSH_D, 0.4), hair: alpha(C.BLUSH_D, 0.2), accent: C.BLUSH_D,
                font: body, display: head, btnFont: body,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}><Bloom size={56} tone="blush" /></div>,
                marker: (a) => (a ? <Bloom size={18} tone="blush" /> : <span style={{ display: 'block', width: 14, height: 14, borderRadius: '50%', border: `1.5px solid ${alpha(C.BLUSH_D, 0.45)}` }} />),
                suggest: { ...suggest, font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field} btn={btn} errorColor={C.BLUSH_D} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, position: 'relative', padding: '20px 22px 16px', borderRadius: 24, background: alpha('#FFFFFF', 0.8), boxShadow: '0 14px 26px -22px rgba(78,63,69,.5)' }}>
                      <div aria-hidden="true" style={{ position: 'absolute', right: -6, top: -12 }}><Bloom size={40} tone={TONE_ROW[i % 4]} rotate={i * 40} /></div>
                      <blockquote style={{ margin: 0, fontFamily: head, fontStyle: 'italic', fontSize: 19, lineHeight: 1.5, color: C.INK }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 6, fontFamily: HAND, fontSize: 21, color: C.BLUSH_D }}>{msg.name}{msg.date ? <span style={{ fontFamily: body, fontSize: 13.5, color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}</figcaption>
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
      <span style={{ position: 'absolute', left: -26, top: -60, animation: 'pb-sway 4s ease-in-out infinite', transformOrigin: '50% 100%' }}><Bloom size={52} tone="blush" /></span>
      <span style={{ position: 'absolute', left: -1, top: -12, width: 2, height: 12, background: C.SAGE_D }} />
    </span>
  )
}
