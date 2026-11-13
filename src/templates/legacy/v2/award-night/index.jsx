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
import { C as PAL, GOLD_GRAD, VELVET, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Trophy, Laurel, Medal, Plaque } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../../../_shared/palette'
import FilmReel from '../../../_shared/FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   AWARD NIGHT — «Mükafat gecəsi» (Korporativ konsepti, 2026-10)

   Konsept: mükafatlandırma mərasimi — şərabı məxmər, qırmızı xalça, qızılı
   kubok, dəfnə çələngi, mis lövhələr. Açılışda səhnə qaranlıqdır, kubok
   örtük altındadır; toxunanda projektor yanır, örtük qalxır və kubok
   parıldayır. Daxildə:
     hero      → dəfnə çələngi içində kubok, tarix mis lövhədə
     sayğac    → lentli dörd medal
     proqram   → nominasiya kartları
     masa      → vintli mis lövhədə masa nömrəsi
   Şriftlər: Cormorant SC (başlıq) · Raleway (mətn) — Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('award-night')
const ID = 'award-night'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['GOLD'], secondary: ['CARPET'], accent: ['GOLD_L'], background: ['WINE_D'], text: ['CREAM'] }

const KEYFRAMES = (C) => (`
@keyframes aw-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes aw-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes aw-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes aw-sparkle { 0%,100% { opacity: 0; transform: scale(.4) } 50% { opacity: 1; transform: scale(1) } }
@keyframes aw-gleam { 0% { transform: translateX(-120%) skewX(-18deg) } 100% { transform: translateX(220%) skewX(-18deg) } }
@keyframes aw-plaque { 0% { transform: translateY(-16px) rotate(-3deg); opacity: 0 } 100% { transform: none; opacity: 1 } }
[data-aw] span[aria-hidden="true"], [data-aw] svg[aria-hidden="true"], [data-aw] div[aria-hidden="true"] { pointer-events: none; }
[data-aw] ::placeholder { color: rgba(205,177,168,.5); }
[data-aw] input:focus-visible, [data-aw] textarea:focus-visible { border-color: ${C.GOLD} !important; outline: none; }
[data-aw] button:focus-visible, [data-aw] a:focus-visible, [data-aw] [role="button"]:focus-visible { outline: 2px solid ${C.GOLD_L}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-aw] *, [data-aw] { animation: none !important; transition: none !important; } }
`)

const goldText = (C) => ({ backgroundImage: GOLD_GRAD(C), WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent' })
const SPARKS = [[-70, -40, 0.6], [64, -60, 0.8], [-40, 30, 1.0], [80, 20, 0.7], [0, -90, 0.9]]

/* ═══ 01 — AÇILIŞ: projektor və kubok ═══ */
function AwardOpening({ inv, theme }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-aw
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: `radial-gradient(60% 40% at 50% 70%, #3A0912, ${C.WINE_D} 75%)`, color: C.CREAM, fontFamily: theme.fonts.body }}>
      {/* projektor konusu */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: -20, width: 'min(120vw, 520px)', height: '78%', transform: 'translateX(-50%)', background: 'linear-gradient(180deg, rgba(255,240,200,.55), rgba(255,230,170,.08) 85%, transparent)', clipPath: 'polygon(44% 0, 56% 0, 92% 100%, 8% 100%)', opacity: go ? 1 : 0.08, transition: 'opacity .5s ease .1s', filter: 'blur(3px)' }} />
      {/* qırmızı xalça */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '50%', bottom: 0, width: '62%', height: '30%', transform: 'translateX(-50%) perspective(300px) rotateX(38deg)', transformOrigin: '50% 100%', background: `linear-gradient(180deg, ${C.CARPET}, #5E0C1A)`, boxShadow: `inset 4px 0 0 ${C.GOLD_D}, inset -4px 0 0 ${C.GOLD_D}` }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ animation: 'aw-rise 1s ease-out .2s both' }}>
          <EmblemSlot mono={ot.mono} size={46} border={`1px solid ${alpha(C.GOLD, 0.6)}`} background="transparent" color={C.GOLD_L} font={head} style={{ animation: 'none', margin: '0 auto 10px' }}>
            <Laurel width={44} />
          </EmblemSlot>
          {ot.show('kicker') && <div style={{ fontSize: 12.5, fontWeight: 500, letterSpacing: '.4em', textTransform: 'uppercase', color: C.GOLD }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 8, fontFamily: head, fontWeight: 500, fontSize: 'clamp(34px, 10vw, 48px)', lineHeight: 1.06, overflowWrap: 'anywhere', ...goldText(C) }}>
              {first}{second && <><span style={{ display: 'block', fontSize: '.5em' }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 10, fontSize: 13.5, letterSpacing: '.12em', textTransform: 'uppercase', color: C.MUTED }}>{ot.text('meta')}</div>}
        </div>
        {/* kubok və örtük */}
        <div style={{ position: 'relative', width: 'min(42vw, 160px)', marginTop: 26 }}>
          <Trophy width="100%" uid="aw-op" style={{ filter: go ? 'drop-shadow(0 0 24px rgba(246,221,149,.6))' : 'brightness(.35)', transition: 'filter .6s ease .4s' }} />
          <div aria-hidden="true" style={{ position: 'absolute', left: '-8%', right: '-8%', top: '-6%', height: '82%', borderRadius: '50% 50% 12% 12% / 60% 60% 12% 12%', background: VELVET(C), boxShadow: `inset 0 -6px 0 ${C.GOLD_D}, 0 10px 18px rgba(0,0,0,.5)`, transform: go ? 'translateY(-160%) rotate(-8deg)' : 'none', opacity: go ? 0 : 1, transition: 'transform .9s cubic-bezier(.5,0,.3,1) .2s, opacity .5s ease .5s' }}>
            <span style={{ position: 'absolute', left: '50%', top: -10, width: 14, height: 14, marginLeft: -7, borderRadius: '50%', background: GOLD_GRAD(C) }} />
          </div>
          {go && SPARKS.map(([x, y, d], i) => (
            <span key={i} aria-hidden="true" style={{ position: 'absolute', left: `calc(50% + ${x}px)`, top: `calc(40% + ${y}px)`, width: 16, height: 16, background: C.GOLD_L, clipPath: 'polygon(50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40%)', animation: `aw-sparkle 1s ease-in-out ${d}s 2` }} />
          ))}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: 26 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: GOLD_GRAD(C), color: C.INK, fontWeight: 600, fontSize: 13.5, letterSpacing: '.2em', textTransform: 'uppercase', boxShadow: '0 14px 26px -12px rgba(225,181,78,.6)', animation: 'aw-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 12.5, letterSpacing: '.16em', textTransform: 'uppercase', color: C.FAINT, animation: 'aw-fade .8s ease-out 1.1s both, aw-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, cream = false }) {
  const C = usePalette(PAL)
  const mute = cream ? '#7A5A52' : C.MUTED
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: cream ? `radial-gradient(90% 60% at 50% 0%, #FFFBF1, transparent 70%), ${C.CREAM}` : VELVET(C), color: cream ? C.INK : C.CREAM }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Laurel width={120} color={cream ? C.GOLD_D : C.GOLD} />
            {title && <h2 style={{ margin: '4px 0 0', fontFamily: head, fontWeight: 500, fontSize: scaleFont('clamp(29px, 8.4vw, 38px)', C.hs), lineHeight: 1.12, textWrap: 'balance', ...(cream ? { color: C.WINE } : goldText(C)) }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontSize: 12.5, fontWeight: 500, letterSpacing: '.28em', textTransform: 'uppercase', color: mute }}>{kicker}</div>}
            {sub && <p style={{ margin: '10px auto 0', maxWidth: 340, fontSize: 15.5, color: mute, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: '#FFFCF5', border: `1px solid ${alpha(C.GOLD_D, 0.45)}`, borderRadius: 4,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
})
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 999,
  fontSize: 13, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', textDecoration: 'none', cursor: 'pointer',
  background: on ? GOLD_GRAD(C) : 'transparent', color: on ? C.INK : C.GOLD_L, border: `1px solid ${on ? C.GOLD : alpha(C.GOLD, 0.5)}`,
}))
const suggest = (C) => ({ bg: '#FFFCF5', border: `1px solid ${alpha(C.GOLD_D, 0.4)}`, active: alpha(C.GOLD_L, 0.4), text: C.INK, table: C.WINE, radius: 4 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function AwardNightTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const host = inv.isCorp ? weddingData.organizer?.trim() : ''

  return (
    <PaletteContext.Provider value={C}><div data-aw lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.WINE_D, minHeight: '100vh', fontFamily: body, color: C.CREAM, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.GOLD, 0.3),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <AwardOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: GOLD_GRAD(C), boxShadow: '0 8px 20px rgba(0,0,0,.55)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.INK} idle={alpha(C.INK, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.WINE_D, 0.92), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.GOLD, 0.35)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 14, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 600, fontSize: 19, letterSpacing: '.08em', ...goldText(C) }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — çələng və kubok */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: VELVET(C), padding: '40px 22px 58px', textAlign: 'center' }}>
            <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: -20, width: 520, height: 420, transform: 'translateX(-50%)', background: 'linear-gradient(180deg, rgba(255,240,200,.28), transparent 85%)', clipPath: 'polygon(42% 0, 58% 0, 92% 100%, 8% 100%)', filter: 'blur(3px)' }} />
            <div style={{ position: 'relative' }}>
              <Laurel width="min(80vw, 300px)">
                <div style={{ width: '46%', marginTop: '6%' }}><Trophy width="100%" uid="aw-hero" style={{ filter: 'drop-shadow(0 0 18px rgba(246,221,149,.45))' }} /></div>
              </Laurel>
              <div style={{ marginTop: 18, fontSize: 12.5, fontWeight: 500, letterSpacing: '.4em', textTransform: 'uppercase', color: C.GOLD }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              <h1 style={{ margin: '10px 0 0', fontFamily: head, fontWeight: 500, fontSize: nameSize(heroName), lineHeight: 1.05, overflowWrap: 'anywhere', ...goldText(C), animation: 'aw-rise 1s ease-out .2s both' }}>{heroName}</h1>
              {host && <div style={{ marginTop: 10, fontSize: 13, letterSpacing: '.2em', textTransform: 'uppercase', color: C.MUTED }}>{T.host} · <span style={{ color: C.CREAM }}>{host}</span></div>}
              <Plaque style={{ display: 'inline-block', marginTop: 22 }}>
                <div style={{ fontFamily: head, fontWeight: 600, fontSize: 'clamp(18px, 5vw, 22px)', letterSpacing: '.04em' }}>{inv.fullDate}</div>
                <div style={{ marginTop: 2, fontSize: 13.5, letterSpacing: '.08em', color: '#4A2A10' }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
              </Plaque>
              <p style={{ margin: '20px auto 0', maxWidth: 330, fontSize: 15.5, lineHeight: 1.65, color: alpha(C.CREAM, 0.82) }}>{tr.inv_join}</p>
            </div>
          </section>

          {/* SAYĞAC — medallar */}
          {S.countdown && (
            <Panel section="countdown" head={head} cream title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(6px, 2.4vw, 12px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <Medal size={70} ribbon={i % 2 ? [C.GOLD, C.CARPET] : [C.CARPET, C.GOLD]}>
                      <span style={{ fontFamily: head, fontWeight: 600, fontSize: 'clamp(20px, 6vw, 28px)', lineHeight: 1, color: C.INK, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                    </Medal>
                    <div style={{ marginTop: 8, fontSize: 11.5, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: '#7A5A52' }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: 4, background: GOLD_GRAD(C), boxShadow: '0 26px 40px -24px rgba(0,0,0,.8)' }}>
                <div style={{ padding: 10, background: C.WINE_D }}>
                  <div style={{ overflow: 'hidden', isolation: 'isolate', outline: `1px solid ${alpha(C.GOLD, 0.5)}` }}>
                    <MapSection
                      weddingData={weddingData} theme={theme} accent={C.CARPET} height="clamp(250px, 70vw, 320px)"
                      map={{ opacity: 0.85, filter: 'sepia(.35) saturate(.8) brightness(.95)', tintOpacity: 0.18, tint: C.CARPET, blend: 'multiply' }}
                      frame={<MapPin />}
                      fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: '#3A0912' }}><MapPin /></div>}
                    />
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 26, fontFamily: head, fontWeight: 500, fontSize: 26, lineHeight: 1.2, color: C.CREAM }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 6, fontSize: 12.5, letterSpacing: '.24em', textTransform: 'uppercase', color: C.MUTED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} />
            </Panel>
          )}

          {/* PROQRAM — nominasiya kartları */}
          {S.program && (
            <Panel section="program" head={head} cream title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 400, margin: '0 auto', display: 'grid', gap: 12 }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '78px minmax(0, 1fr)', alignItems: 'center', gap: 14, padding: '14px 16px', background: '#FFFCF5', border: `1px solid ${alpha(C.GOLD_D, 0.4)}`, boxShadow: '0 10px 20px -16px rgba(42,6,14,.5)' }}>
                    <Plaque style={{ padding: '8px 6px', textAlign: 'center', fontFamily: head, fontWeight: 600, fontSize: 16, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</Plaque>
                    <div style={{ fontFamily: head, fontWeight: 500, fontSize: 19.5, lineHeight: 1.25, color: C.WINE }}>{ev.label}</div>
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

          {/* MASA — mis lövhə */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} cream title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="aw-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted="#7A5A52" accent={C.WINE}
                nameStyle={{ fontFamily: head, fontWeight: 500, fontSize: 24 }}
                card={(num) => (
                  <Plaque style={{ display: 'inline-block', minWidth: 200, padding: '22px 30px 18px', overflow: 'hidden', animation: 'aw-plaque .7s cubic-bezier(.3,.8,.4,1) both' }}>
                    <span aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '40%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent)', animation: 'aw-gleam 1.6s ease-out .5s both' }} />
                    <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.3em', textTransform: 'uppercase', color: '#4A2A10' }}>{T.table}</div>
                    <div style={{ fontFamily: head, fontWeight: 600, fontSize: tableSize(num, 60), lineHeight: 1.05, color: C.INK, textShadow: '0 1px 0 rgba(255,255,255,.5)' }}>{num}</div>
                  </Plaque>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 32 }} />}
              <PhotoQr inv={inv} tr={tr} fg={C.WINE_D} bg="#FFFCF5" frame={{ boxShadow: `0 0 0 6px ${C.WINE_D}, 0 0 0 8px ${C.GOLD}` }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'event')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} cream title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: '#7A5A52', line: alpha(C.WINE, 0.4), hair: alpha(C.WINE, 0.18), accent: C.WINE,
                font: body, display: head, btnFont: body,
                doneMark: <div style={{ width: 70, margin: '0 auto 10px' }}><Trophy width="100%" uid="aw-done" /></div>,
                marker: (a) => (a ? <span style={{ display: 'block', width: 14, height: 14, borderRadius: '50%', background: GOLD_GRAD(C), boxShadow: `0 0 0 2px ${C.WINE}` }} /> : <span style={{ display: 'block', width: 14, height: 14, borderRadius: '50%', border: `1px solid ${alpha(C.WINE, 0.45)}` }} />),
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* TƏBRİKLƏR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field(C)} btn={btn(C)} errorColor={C.GOLD_L} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '20px 20px 16px', background: alpha('#000000', 0.25), border: `1px solid ${alpha(C.GOLD, 0.35)}`, textAlign: 'center' }}>
                      <Laurel width={70} />
                      <blockquote style={{ margin: '6px 0 0', fontFamily: head, fontWeight: 500, fontSize: 19, lineHeight: 1.45, color: C.CREAM }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 10, fontSize: 12, fontWeight: 600, letterSpacing: '.22em', textTransform: 'uppercase', color: C.GOLD }}>{msg.name}{msg.date ? <span style={{ fontWeight: 400, letterSpacing: '.06em', textTransform: 'none', color: C.FAINT }}> · {gbook.formatDate(msg.date)}</span> : null}</figcaption>
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
      <span style={{ position: 'absolute', left: -20, top: -56, width: 40 }}><Trophy width={40} uid="aw-pin" /></span>
    </span>
  )
}
