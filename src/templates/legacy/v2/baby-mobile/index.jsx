/* DONDURULMUŞ v2 SURƏTİ (2026-11-13) — redaktə etməyin, bax legacy/registry.js */
import { motion } from 'framer-motion'
import LanguageSwitcher from '../../../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../../../_shared/MapSection'
import { EmblemSlot } from '../../../_shared/MonoContent'
import { Reveal, PopDigit, enterDirection } from '../../../_shared/motion'
import { getTemplateTheme } from '../../../templateConfig'
import { useInvitation, useGate, openingNames, alpha } from '../../../_shared/useInvitation'
import { MusicFab, EqBars, StoryBlock, InvitationEnd, ReplyForm } from '../../../_shared/invitationKit'
import { VenueLinks, SeatFinder, PhotoQr, GuestbookForm } from '../../../_shared/blocks'
import { galleryDesc, tableSize } from '../../../_shared/kids'
import { C as PAL, FELT, NIGHT_BG, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Felt, Mobile, Sparks, Note } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../../../_shared/palette'
import FilmReel from '../../../_shared/FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   BABY MOBILE — «Beşik mobili» (Baby shower konsepti, 2026-10)

   Konsept: körpə beşiyinin üstündə asılan keçə mobil — ay, ulduzlar,
   bulud, ürək; gecə mavisi və xardal sarısı, tikiş xətləri. Açılışda
   mobil yavaş-yavaş yellənir; toxunanda fırlanır, fiqurlar dönür və
   layla notları uçur. Daxildə:
     hero      → gecə səmasında mobil
     sayğac    → dörd keçə bulud
     proqram   → sapdan asılan keçə fiqurlar
     masa      → böyük keçə ulduzda masa nömrəsi
   Şriftlər: Ysabeau Infant (başlıq) · Mulish (mətn) — Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('baby-mobile')
const ID = 'baby-mobile'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['NIGHT'], secondary: ['BLUSH'], accent: ['MUSTARD'], background: ['CLOUD'], text: ['INK'] }

const SHAPES = (C) => ([['cloud', C.CREAM], ['cloud', '#FCE3DC'], ['cloud', '#E3EEDF'], ['cloud', '#FBEBC4']])
const MARKERS = (C) => ([['star', C.MUSTARD], ['moon', C.MUSTARD], ['heart', C.BLUSH], ['cloud', C.CREAM], ['star', C.SAGE]])

const KEYFRAMES = (C) => (`
@keyframes bm-sway { 0%,100% { transform: rotate(-2deg) } 50% { transform: rotate(2deg) } }
@keyframes bm-swing { 0% { transform: rotate(0) } 30% { transform: rotate(-7deg) } 65% { transform: rotate(5deg) } 100% { transform: rotate(0) } }
@keyframes bm-dangle { 0%,100% { transform: rotate(-5deg) } 50% { transform: rotate(5deg) } }
@keyframes bm-turn { 0% { transform: rotateY(0) } 100% { transform: rotateY(360deg) } }
@keyframes bm-twinkle { 0%,100% { opacity: .2 } 50% { opacity: 1 } }
@keyframes bm-note { 0% { transform: translate(0, 0) rotate(0); opacity: 0 } 20% { opacity: 1 } 100% { transform: translate(var(--x), -180px) rotate(20deg); opacity: 0 } }
@keyframes bm-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes bm-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes bm-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes bm-pop { 0% { transform: scale(.4) rotate(-30deg); opacity: 0 } 70% { transform: scale(1.06) rotate(4deg) } 100% { transform: none; opacity: 1 } }
[data-bm] span[aria-hidden="true"], [data-bm] svg[aria-hidden="true"], [data-bm] div[aria-hidden="true"] { pointer-events: none; }
[data-bm] ::placeholder { color: rgba(107,111,136,.6); }
[data-bm] input:focus-visible, [data-bm] textarea:focus-visible { border-color: ${C.MUSTARD_D} !important; outline: none; }
[data-bm] button:focus-visible, [data-bm] a:focus-visible, [data-bm] [role="button"]:focus-visible { outline: 3px solid ${C.MUSTARD}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-bm] *, [data-bm] { animation: none !important; transition: none !important; } }
`)

const CREAM_BG = (C) => (`radial-gradient(90% 60% at 50% 0%, #FFFFFF, transparent 70%), ${C.CLOUD}`)
const NOTES = [[-60, 0.1], [40, 0.3], [-10, 0.5], [70, 0.2], [-90, 0.45]]

/* ═══ 01 — AÇILIŞ: mobil fırlanır ═══ */
function MobileOpening({ inv, theme }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-bm
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: NIGHT_BG(C), color: C.CREAM, fontFamily: theme.fonts.body }}>
      <Sparks />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, perspective: 600 }}>
        <Mobile width="min(86vw, 330px)" spin={go} />
      </div>
      <div aria-hidden="true" style={{ position: 'absolute', left: -30, right: -30, bottom: -26, height: 150 }}>
        {[[-2, 0, 170, C.CREAM], [22, 30, 130, '#E3EEDF'], [48, 6, 190, '#FCE3DC'], [74, 26, 150, C.CREAM], [90, 2, 160, '#FBEBC4']].map(([x, b, w, col], i) => (
          <Felt key={i} shape="cloud" size={w} color={col} style={{ position: 'absolute', left: `${x}%`, bottom: b, opacity: 0.92 }} />
        ))}
      </div>
      {go && NOTES.map(([x, d], i) => (
        <span key={i} aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 230, '--x': `${x}px`, animation: `bm-note 1.4s ease-out ${d}s both` }}><Note size={20 + (i % 2) * 6} color={i % 2 ? C.MUSTARD : C.CREAM} /></span>
      ))}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 'max(290px, 40%)', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ animation: 'bm-rise 1s ease-out .3s both' }}>
          <EmblemSlot mono={ot.mono} size={50} border={`2px dashed ${alpha(C.CREAM, 0.6)}`} background={C.NIGHT_L} color={C.MUSTARD} font={head} style={{ animation: 'none', margin: '0 auto 10px' }}>
            <Felt shape="moon" size={32} style={{ margin: '0 auto' }} />
          </EmblemSlot>
          {ot.show('kicker') && <div style={{ fontFamily: head, fontStyle: 'italic', fontSize: 19, color: C.MUSTARD }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 4, fontFamily: head, fontWeight: 700, fontSize: 'clamp(36px, 10.6vw, 50px)', lineHeight: 1.08, color: C.CREAM, overflowWrap: 'anywhere' }}>
              {first}{second && <><span style={{ display: 'block', fontSize: '.5em', color: C.BLUSH }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 8, fontSize: 15, color: alpha(C.CREAM, 0.75) }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: 22 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 28px', display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 999, background: FELT(C.MUSTARD), color: C.INK, fontFamily: head, fontWeight: 700, fontSize: 17, outline: '2px dashed rgba(255,255,255,.75)', outlineOffset: -6, boxShadow: '0 12px 24px -12px rgba(0,0,0,.6)', animation: 'bm-rise .8s ease-out .8s both' }}>
              <Note size={18} color={C.INK} />{ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 10, fontSize: 13.5, color: alpha(C.CREAM, 0.6), animation: 'bm-fade .8s ease-out 1.1s both, bm-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, night = false }) {
  const C = usePalette(PAL)
  const mute = night ? alpha(C.CREAM, 0.75) : C.MUTED
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: night ? NIGHT_BG(C) : CREAM_BG(C), color: night ? C.CREAM : C.INK }}>
      {night && <Sparks opacity={0.6} />}
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 14 }}>
              {[['star', C.MUSTARD, 18], ['moon', C.MUSTARD, 24], ['star', C.SAGE, 16]].map(([s, c, h], i) => (
                <span key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ width: 1, height: h, background: night ? alpha(C.CREAM, 0.5) : alpha(C.INK, 0.3) }} />
                  <Felt shape={s} size={22} color={c} />
                </span>
              ))}
            </div>
            {title && <h2 style={{ margin: '10px 0 0', fontFamily: head, fontWeight: 700, fontSize: scaleFont('clamp(28px, 8vw, 37px)', C.hs), lineHeight: 1.15, color: night ? C.CREAM : C.INK, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontFamily: head, fontStyle: 'italic', fontSize: 17, color: mute }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 340, fontSize: 15.5, color: mute, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: '#FFFFFF', border: `2px solid ${alpha(C.NIGHT, 0.15)}`, borderRadius: 16,
  padding: '13px 16px', fontSize: 16, color: C.INK, outline: 'none',
})
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 999,
  fontSize: 15.5, fontWeight: 700, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.NIGHT : '#FFFFFF', color: on ? C.CREAM : C.NIGHT, border: `2px solid ${on ? C.NIGHT : alpha(C.NIGHT, 0.25)}`,
}))
const suggest = (C) => ({ bg: '#FFFFFF', border: `2px solid ${alpha(C.NIGHT, 0.15)}`, active: alpha(C.MUSTARD, 0.25), text: C.INK, table: C.NIGHT, radius: 16 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function BabyMobileTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)

  return (
    <PaletteContext.Provider value={C}><div data-bm lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.CLOUD, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.MUSTARD, 0.35),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <MobileOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.NIGHT, border: `2px dashed ${C.MUSTARD}`, boxShadow: '0 8px 18px rgba(34,43,77,.45)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.MUSTARD} idle={alpha(C.MUSTARD, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.NIGHT_D, 0.94), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `2px dashed ${alpha(C.MUSTARD, 0.5)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.CREAM, 0.8), fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 700, fontSize: 18, color: C.MUSTARD }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — gecə səmasında mobil */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: NIGHT_BG(C), padding: '0 20px 58px', textAlign: 'center', color: C.CREAM }}>
            <Sparks />
            <div style={{ position: 'relative', perspective: 600 }}><Mobile width="min(86vw, 330px)" /></div>
            <div style={{ position: 'relative', marginTop: 10 }}>
              <div style={{ fontFamily: head, fontStyle: 'italic', fontSize: 21, color: C.MUSTARD }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              <h1 style={{ margin: '6px 0 0', fontFamily: head, fontWeight: 700, fontSize: nameSize(heroName), lineHeight: 1.06, color: C.CREAM, overflowWrap: 'anywhere', animation: 'bm-rise 1s ease-out .2s both' }}>{heroName}</h1>
              <div style={{ display: 'inline-block', marginTop: 20, padding: '14px 24px', borderRadius: 20, background: FELT(C.NIGHT_L), outline: `2px dashed ${alpha(C.CREAM, 0.45)}`, outlineOffset: -7 }}>
                <div style={{ fontFamily: head, fontWeight: 700, fontSize: 'clamp(19px, 5.4vw, 23px)', color: C.CREAM }}>{inv.fullDate}</div>
                <div style={{ marginTop: 4, fontSize: 15, color: alpha(C.CREAM, 0.75) }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
              </div>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 8, fontSize: 15, color: alpha(C.CREAM, 0.75) }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              <p style={{ margin: '18px auto 0', maxWidth: 320, fontFamily: head, fontStyle: 'italic', fontSize: 18, lineHeight: 1.55, color: alpha(C.CREAM, 0.85) }}>{tr.inv_join}</p>
            </div>
          </section>

          {/* SAYĞAC — keçə buludlar */}
          {S.countdown && (
            <Panel section="countdown" head={head} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(4px, 2vw, 10px)', maxWidth: 410, margin: '0 auto', justifyItems: 'center' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <Felt shape={SHAPES(C)[i][0]} size="min(22vw, 94px)" color={SHAPES(C)[i][1]}>
                      <span style={{ marginTop: '14%', fontFamily: head, fontWeight: 700, fontSize: 'clamp(19px, 5.6vw, 26px)', lineHeight: 1, color: C.INK, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                    </Felt>
                    <div style={{ marginTop: 2, fontWeight: 700, fontSize: 12.5, color: C.MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN — keçə çərçivə */}
          {S.venue && (
            <Panel section="venue" head={head} night title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: 14, borderRadius: 26, background: FELT(C.MUSTARD), outline: '2px dashed rgba(255,255,255,.8)', outlineOffset: -7, boxShadow: '0 24px 40px -24px rgba(0,0,0,.7)' }}>
                <div style={{ borderRadius: 16, overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.NIGHT} height="clamp(250px, 70vw, 320px)"
                    map={{ opacity: 0.92, filter: 'saturate(.8)', tintOpacity: 0.12, tint: C.NIGHT_L, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: CREAM_BG(C) }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 700, fontSize: 24, lineHeight: 1.2, color: C.CREAM }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontFamily: head, fontStyle: 'italic', fontSize: 17, color: alpha(C.CREAM, 0.75) }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={(on) => ({ ...btn(C)(on), background: on ? C.MUSTARD : 'transparent', color: on ? C.INK : C.CREAM, border: `2px solid ${on ? C.MUSTARD : alpha(C.CREAM, 0.45)}` })} />
            </Panel>
          )}

          {/* PROQRAM — sapdan asılan fiqurlar */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ position: 'relative', maxWidth: 380, margin: '0 auto' }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: 30, top: 0, bottom: 30, width: 1.4, background: alpha(C.INK, 0.25) }} />
                {timeline.events.map((ev, i) => {
                  const [shape, color] = MARKERS(C)[i % MARKERS(C).length]
                  return (
                    <div key={i} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '62px minmax(0, 1fr)', gap: 10, alignItems: 'center', padding: '8px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', animation: `bm-dangle ${3 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`, transformOrigin: '50% 0' }}><Felt shape={shape} size={42} color={color} /></div>
                      <div style={{ padding: '12px 16px', borderRadius: 18, background: '#FFFFFF', boxShadow: '0 8px 18px -14px rgba(34,43,77,.5)' }}>
                        <div style={{ fontFamily: head, fontWeight: 700, fontSize: 16, color: C.MUSTARD_D, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                        <div style={{ marginTop: 2, fontSize: 16.5, lineHeight: 1.35, color: C.INK }}>{ev.label}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" />
            </Panel>
          )}

          {/* MASA — keçə ulduz */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} night title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="bm-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={alpha(C.CREAM, 0.8)} accent={C.MUSTARD}
                nameStyle={{ fontFamily: head, fontWeight: 700, fontSize: 22 }}
                card={(num) => (
                  <Felt shape="star" size={220} color={C.MUSTARD} style={{ margin: '0 auto', animation: 'bm-pop .8s cubic-bezier(.3,1.3,.5,1) both' }}>
                    <span style={{ marginTop: '10%', fontWeight: 800, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: C.INK }}>{T.table}</span>
                    <span style={{ fontFamily: head, fontWeight: 700, fontSize: tableSize(num, 54), lineHeight: 1, color: C.INK }}>{num}</span>
                  </Felt>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 32 }} />}
              <PhotoQr inv={inv} tr={tr} fg={C.NIGHT} bg="#FFFFFF" frame={{ borderRadius: 22, outline: `2px dashed ${alpha(C.MUSTARD_D, 0.7)}`, outlineOffset: 4 }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.NIGHT, 0.35), hair: alpha(C.NIGHT, 0.12), accent: C.NIGHT,
                font: body, display: head, btnFont: head,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Felt shape="moon" size={46} /></div>,
                marker: (a) => (a ? <Felt shape="star" size={18} /> : <span style={{ display: 'block', width: 14, height: 14, borderRadius: '50%', border: `2px solid ${alpha(C.NIGHT, 0.3)}` }} />),
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* LAYLALAR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} night title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field(C)} btn={(on) => ({ ...btn(C)(on), background: on ? C.MUSTARD : 'transparent', color: on ? C.INK : C.CREAM, border: `2px solid ${on ? C.MUSTARD : alpha(C.CREAM, 0.45)}` })} errorColor={C.MUSTARD} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  const [shape, color] = MARKERS(C)[i % MARKERS(C).length]
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, display: 'grid', gridTemplateColumns: '34px minmax(0, 1fr)', gap: 12, padding: '18px 18px 16px', borderRadius: 22, background: FELT(C.NIGHT_L), outline: `2px dashed ${alpha(C.CREAM, 0.3)}`, outlineOffset: -7 }}>
                      <Felt shape={shape} size={30} color={color} />
                      <div>
                        <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.55, color: C.CREAM }}>{msg.text}</blockquote>
                        <figcaption style={{ marginTop: 8, fontFamily: head, fontWeight: 700, fontSize: 15, color: C.MUSTARD }}>{msg.name}{msg.date ? <span style={{ fontFamily: body, fontWeight: 400, color: alpha(C.CREAM, 0.55) }}> · {gbook.formatDate(msg.date)}</span> : null}</figcaption>
                      </div>
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
      <span style={{ position: 'absolute', left: -1, top: -70, width: 1.4, height: 30, background: C.INK, opacity: 0.4 }} />
      <span style={{ position: 'absolute', left: -22, top: -44, animation: 'bm-dangle 3s ease-in-out infinite', transformOrigin: '50% 0' }}><Felt shape="star" size={44} /></span>
    </span>
  )
}
