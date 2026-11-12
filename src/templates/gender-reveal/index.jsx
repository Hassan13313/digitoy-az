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
import { C as PAL, SPLIT, RELEASE, CONFETTI, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Balloon, GiftBox, Question } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'
import FilmReel from '../_shared/FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   GENDER REVEAL — «Oğlan, yoxsa qız?» (Baby shower konsepti, 2026-10)

   Konsept: cinsiyyət açılışı əyləncəsi — yarı mavi, yarı çəhrayı dünya,
   qızılı sual işarəsi və zolaqlı hədiyyə qutusu. Açılışda qutu bağlıdır;
   toxunanda qapaq uçur, içindən mavi və çəhrayı şarlar, konfetti çıxır.
   Şablon cinsiyyəti AÇMIR — sürprizi ev sahibləri öz tədbirində edir.
   Daxildə:
     hero      → «Oğlan, yoxsa qız?» — iki tərəf, ortada sual
     sayğac    → növbə ilə mavi/çəhrayı bloklar
     masa      → hədiyyə qutusunun etiketində masa nömrəsi
   Şriftlər: Playpen Sans (başlıq) · Onest (mətn) — Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('gender-reveal')
const ID = 'gender-reveal'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['INK'], secondary: ['PINK'], accent: ['GOLD'], background: ['CREAM'], text: ['INK'] }

const TONES = (C) => ([C.BLUE, C.PINK])
const TONES_L = (C) => ([C.BLUE_L, C.PINK_L])

const KEYFRAMES = (C) => (`
@keyframes gr-fly { 0% { transform: translateY(0) scale(.5); opacity: 0 } 15% { opacity: 1 } 100% { transform: translateY(-115vh) scale(1); opacity: 1 } }
@keyframes gr-conf { 0% { transform: translate(0, 0) rotate(0); opacity: 1 } 100% { transform: translate(var(--x), var(--y)) rotate(var(--r)); opacity: 0 } }
@keyframes gr-wiggle { 0%,100% { transform: rotate(-3deg) } 50% { transform: rotate(3deg) } }
@keyframes gr-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
@keyframes gr-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes gr-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes gr-hint { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
@keyframes gr-pop { 0% { transform: scale(.5); opacity: 0 } 70% { transform: scale(1.06) } 100% { transform: none; opacity: 1 } }
[data-gr] span[aria-hidden="true"], [data-gr] svg[aria-hidden="true"], [data-gr] div[aria-hidden="true"] { pointer-events: none; }
[data-gr] ::placeholder { color: rgba(110,112,145,.6); }
[data-gr] input:focus-visible, [data-gr] textarea:focus-visible { border-color: ${C.BLUE_D} !important; outline: none; }
[data-gr] button:focus-visible, [data-gr] a:focus-visible, [data-gr] [role="button"]:focus-visible { outline: 3px solid ${C.GOLD_D}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-gr] *, [data-gr] { animation: none !important; transition: none !important; } }
`)

/* ═══ 01 — AÇILIŞ: qutu açılır, şarlar uçur ═══ */
function RevealOpening({ inv, theme }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-gr
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: SPLIT(C)(), color: C.INK, fontFamily: theme.fonts.body }}>
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ animation: 'gr-rise 1s ease-out .2s both' }}>
          <EmblemSlot mono={ot.mono} size={50} border={`2px solid ${C.GOLD}`} background="#FFFFFF" color={C.GOLD_D} font={head} style={{ animation: 'none', margin: '0 auto 8px' }}>
            <Question size={30} style={{ fontFamily: head, display: 'block', margin: '0 auto' }} />
          </EmblemSlot>
          {ot.show('kicker') && <div style={{ fontFamily: head, fontWeight: 700, fontSize: 16, color: C.MUTED }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 4, fontFamily: head, fontWeight: 800, fontSize: 'clamp(34px, 10vw, 48px)', lineHeight: 1.1, color: C.INK, overflowWrap: 'anywhere' }}>
              {first}{second && <><span style={{ display: 'block', fontSize: '.5em', color: C.GOLD_D }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          <div style={{ marginTop: 10, fontFamily: head, fontWeight: 700, fontSize: 20 }}>
            <span style={{ color: C.BLUE_D }}>{inv.copy(TXT).boy}</span>
            <span style={{ color: C.MUTED }}> · </span>
            <span style={{ color: C.PINK_D }}>{inv.copy(TXT).girl}</span>
          </div>
        </div>
        <div style={{ position: 'relative', marginTop: 22, animation: go ? 'none' : 'gr-wiggle 1.8s ease-in-out infinite' }}>
          <GiftBox width="min(52vw, 200px)" open={go} tag={!go && <Question size={46} style={{ fontFamily: head }} />} />
          {go && RELEASE.map(([x, tone, d, s], i) => (
            <span key={i} aria-hidden="true" style={{ position: 'absolute', left: `calc(50% + ${x}px - ${s / 2}px)`, top: '20%', animation: `gr-fly 1.6s cubic-bezier(.4,0,.6,1) ${d + 0.15}s both` }}><Balloon size={s} tone={tone} string={30} /></span>
          ))}
          {go && CONFETTI(C).map((c, i) => (
            <span key={`c${i}`} aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '30%', width: c.w, height: c.w * 0.5, background: c.c, borderRadius: 2, '--x': `${c.x}px`, '--y': `${c.y}px`, '--r': `${c.rot}deg`, animation: `gr-conf 1.2s ease-out ${c.d}s both` }} />
          ))}
        </div>
        {ot.show('meta') && <div style={{ marginTop: 18, fontWeight: 600, fontSize: 15, color: C.INK }}>{ot.text('meta')}</div>}
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: 18 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 28px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: C.INK, color: '#FFFFFF', fontFamily: head, fontWeight: 700, fontSize: 16, boxShadow: `0 0 0 4px ${C.GOLD}, 0 12px 24px -10px rgba(51,54,92,.6)`, animation: 'gr-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 13.5, fontWeight: 600, color: C.MUTED, animation: 'gr-fade .8s ease-out 1.1s both, gr-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, split = false }) {
  const C = usePalette(PAL)
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '62px 20px 68px', overflow: 'hidden', background: split ? SPLIT(C)(C.BLUE_L, C.PINK_L, 100) : `radial-gradient(90% 60% at 50% 0%, #FFFFFF, transparent 70%), ${C.CREAM}` }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 2 }}>
              <Balloon size={18} tone="blue" string={10} /><Balloon size={24} tone="gold" string={12} /><Balloon size={18} tone="pink" string={10} />
            </div>
            {title && <h2 style={{ margin: '8px 0 0', fontFamily: head, fontWeight: 800, fontSize: scaleFont('clamp(26px, 7.6vw, 34px)', C.hs), lineHeight: 1.18, color: C.INK, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontWeight: 500, fontSize: 15.5, color: C.MUTED }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 340, fontSize: 15.5, color: C.MUTED, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: '#FFFFFF', border: `2px solid ${alpha(C.INK, 0.12)}`, borderRadius: 16,
  padding: '13px 16px', fontSize: 16, color: C.INK, outline: 'none',
})
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 999,
  fontSize: 15.5, fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.INK : '#FFFFFF', color: on ? '#FFFFFF' : C.INK, border: `2px solid ${on ? C.INK : alpha(C.INK, 0.2)}`,
}))
const suggest = (C) => ({ bg: '#FFFFFF', border: `2px solid ${alpha(C.INK, 0.12)}`, active: alpha(C.GOLD, 0.25), text: C.INK, table: C.PINK_D, radius: 16 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function GenderRevealTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const { boy, girl } = T

  return (
    <PaletteContext.Provider value={C}><div data-gr lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.CREAM, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.GOLD, 0.35),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <RevealOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: `linear-gradient(115deg, ${C.BLUE} 50%, ${C.PINK} 50%)`, border: '3px solid #FFFFFF', boxShadow: '0 8px 18px rgba(51,54,92,.3)' }}>
        {({ playing }) => <EqBars playing={playing} color="#FFFFFF" idle={alpha('#FFFFFF', 0.55)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha('#FFFFFF', 0.9), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `3px solid transparent`, borderImage: `linear-gradient(90deg, ${C.BLUE} 50%, ${C.PINK} 50%) 1`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 800, fontSize: 17 }}><span style={{ color: C.BLUE_D }}>Digi</span><span style={{ color: C.PINK_D }}>toy</span></div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — iki tərəf */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: SPLIT(C)(C.BLUE_L, C.PINK_L, 100), padding: '40px 20px 56px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', maxWidth: 360, margin: '0 auto' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ animation: 'gr-bob 3s ease-in-out infinite' }}><Balloon size={60} tone="blue" string={44} /></div>
                <div style={{ marginTop: 4, fontFamily: head, fontWeight: 800, fontSize: 18, color: C.BLUE_D }}>{boy}</div>
              </div>
              <Question size={110} style={{ fontFamily: head, animation: 'gr-wiggle 2.4s ease-in-out infinite' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ animation: 'gr-bob 3s ease-in-out .5s infinite' }}><Balloon size={60} tone="pink" string={44} /></div>
                <div style={{ marginTop: 4, fontFamily: head, fontWeight: 800, fontSize: 18, color: C.PINK_D }}>{girl}</div>
              </div>
            </div>
            <div style={{ marginTop: 18, fontFamily: head, fontWeight: 700, fontSize: 'clamp(22px, 6.4vw, 28px)', color: C.INK }}>{T.question}</div>
            <div style={{ marginTop: 18, fontWeight: 600, fontSize: 15, color: C.MUTED }}>{L('hero', 'kicker', inv.eventLabel)}</div>
            <h1 style={{ margin: '4px 0 0', fontFamily: head, fontWeight: 800, fontSize: nameSize(heroName), lineHeight: 1.1, color: C.INK, overflowWrap: 'anywhere', animation: 'gr-rise 1s ease-out .2s both' }}>{heroName}</h1>
            <div style={{ display: 'inline-block', marginTop: 18, padding: '14px 22px', borderRadius: 20, background: '#FFFFFF', boxShadow: `0 0 0 3px ${C.GOLD}, 0 14px 24px -14px rgba(51,54,92,.5)` }}>
              <div style={{ fontFamily: head, fontWeight: 700, fontSize: 'clamp(18px, 5vw, 22px)', color: C.INK }}>{inv.fullDate}</div>
              <div style={{ marginTop: 4, fontSize: 15, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            </div>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 8, fontSize: 15, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <p style={{ margin: '18px auto 0', maxWidth: 320, fontSize: 16, lineHeight: 1.6, color: C.INK }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC */}
          {S.countdown && (
            <Panel section="countdown" head={head} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 2.6vw, 12px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <div key={l} style={{ position: 'relative', padding: '18px 4px 14px', textAlign: 'center', borderRadius: 22, background: TONES_L(C)[i % 2], boxShadow: `inset 0 0 0 2px ${TONES(C)[i % 2]}`, overflow: 'hidden' }}>
                    <span aria-hidden="true" style={{ position: 'absolute', right: -4, bottom: -18, fontFamily: head, fontWeight: 800, fontSize: 70, lineHeight: 1, color: alpha(TONES(C)[i % 2], 0.25) }}>?</span>
                    <div style={{ position: 'relative', fontFamily: head, fontWeight: 800, fontSize: 'clamp(22px, 6.6vw, 30px)', lineHeight: 1, color: C.INK, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></div>
                    <div style={{ position: 'relative', marginTop: 6, fontWeight: 600, fontSize: 12.5, color: C.MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} split title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: 8, borderRadius: 28, background: `linear-gradient(115deg, ${C.BLUE} 50%, ${C.PINK} 50%)`, boxShadow: '0 22px 36px -24px rgba(51,54,92,.6)' }}>
                <div style={{ borderRadius: 22, overflow: 'hidden', isolation: 'isolate', border: '4px solid #FFFFFF' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.INK} height="clamp(250px, 70vw, 320px)"
                    map={{ opacity: 0.92, filter: 'saturate(.85)', tintOpacity: 0.1, tint: C.BLUE, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: C.CREAM }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 800, fontSize: 22, lineHeight: 1.25, color: C.INK }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 15, color: C.MUTED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} />
            </Panel>
          )}

          {/* PROQRAM */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 380, margin: '0 auto', display: 'grid', gap: 12 }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr)', gap: 12, alignItems: 'center', padding: '12px 16px 12px 10px', borderRadius: 20, background: '#FFFFFF', boxShadow: `inset 4px 0 0 ${TONES(C)[i % 2]}, 0 10px 18px -14px rgba(51,54,92,.45)` }}>
                    <div style={{ display: 'flex', justifyContent: 'center', height: 50, overflow: 'hidden' }}><Balloon size={30} tone={i % 2 ? 'pink' : 'blue'} string={14} /></div>
                    <div>
                      <div style={{ fontFamily: head, fontWeight: 800, fontSize: 15.5, color: i % 2 ? C.PINK_D : C.BLUE_D, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                      <div style={{ marginTop: 2, fontSize: 16.5, lineHeight: 1.35, color: C.INK }}>{ev.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} split title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" />
            </Panel>
          )}

          {/* MASA — qutunun etiketi */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="gr-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={C.MUTED} accent={C.PINK_D}
                nameStyle={{ fontFamily: head, fontWeight: 800, fontSize: 20, color: C.INK }}
                card={(num) => (
                  <GiftBox width={210} style={{ margin: '0 auto', animation: 'gr-pop .6s cubic-bezier(.3,1.3,.5,1) both' }} tag={(
                    <>
                      <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: C.MUTED }}>{T.table}</div>
                      <div style={{ fontFamily: head, fontWeight: 800, fontSize: tableSize(num, 44), lineHeight: 1.05, color: C.INK }}>{num}</div>
                    </>
                  )} />
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} split title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 32 }} />}
              <PhotoQr inv={inv} tr={tr} fg={C.INK} bg="#FFFFFF" frame={{ borderRadius: 22, boxShadow: `0 0 0 4px ${C.GOLD}` }}
                btn={btn(C)} muted={C.INK} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.INK, 0.3), hair: alpha(C.INK, 0.12), accent: C.PINK_D,
                font: body, display: head, btnFont: head,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 8 }}><Balloon size={28} tone="blue" string={14} /><Balloon size={28} tone="pink" string={14} /></div>,
                marker: (a) => (a ? <span style={{ display: 'block', width: 14, height: 14, borderRadius: '50%', background: `linear-gradient(115deg, ${C.BLUE} 50%, ${C.PINK} 50%)` }} /> : <span style={{ display: 'block', width: 14, height: 14, borderRadius: '50%', border: `2px solid ${alpha(C.INK, 0.3)}` }} />),
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* TƏXMİNLƏR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} split title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field(C)} btn={btn(C)} errorColor={C.PINK_D} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '18px 20px 16px', borderRadius: 22, background: '#FFFFFF', boxShadow: `inset 0 4px 0 ${TONES(C)[i % 2]}, 0 14px 24px -18px rgba(51,54,92,.5)` }}>
                      <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.55, color: C.INK }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, fontFamily: head, fontWeight: 700, fontSize: 14.5, color: i % 2 ? C.PINK_D : C.BLUE_D }}>{msg.name}{msg.date ? <span style={{ fontFamily: body, fontWeight: 400, color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}</figcaption>
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
      <span style={{ position: 'absolute', left: -38, top: -84, display: 'flex', gap: 2, animation: 'gr-bob 3s ease-in-out infinite' }}>
        <Balloon size={34} tone="blue" string={40} /><Balloon size={34} tone="pink" string={40} />
      </span>
      <span style={{ position: 'absolute', left: -4, top: -4, width: 8, height: 8, borderRadius: '50%', background: C.INK, boxShadow: '0 0 0 3px #FFFFFF' }} />
    </span>
  )
}
