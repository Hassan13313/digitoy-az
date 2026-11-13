/* DONDURULMUŞ v2 SURƏTİ (2026-11-13) — redaktə etməyin, bax legacy/registry.js */
import { motion } from 'framer-motion'
import LanguageSwitcher from '../../../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSectionLux'
import MapSection from '../../../_shared/MapSection'
import { EmblemSlot } from '../../../_shared/MonoContent'
import { Reveal, PopDigit, enterDirection } from '../../../_shared/motion'
import { getTemplateTheme } from '../../../templateConfig'
import { useInvitation, useGate, openingNames, alpha } from '../../../_shared/useInvitation'
import { MusicFab, EqBars, StoryBlock, InvitationEnd, ReplyForm } from '../../../_shared/invitationKit'
import { VenueLinks, SeatFinder, PhotoQr, GuestbookForm } from '../../../_shared/blocks'
import { galleryDesc, tableSize } from '../../../_shared/kids'
import { C as PAL, BRICKS, glow, boxGlow, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { NeonStar, NeonFrame, NeonRule } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../../../_shared/palette'
import FilmReel from '../../../_shared/FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   NEON PARTY — «Neon gecə» (Korporativ konsepti, 2026-10)

   Konsept: kərpic divarda neon lövhə — çəhrayı, firuzəyi, bənövşəyi işıq
   boruları; korporativ əyləncə gecəsi, yeni il partisi. Açılışda borular
   sönükdür; toxunanda lövhə titrəyərək yanır. Daxildə:
     hero      → neon çərçivədə ad
     sayğac    → neon rəqəmlər, rəngli boru çərçivələr
     proqram   → neon xətt boyunca işıq nöqtələri
     masa      → neon lövhədə masa nömrəsi
   Şriftlər: Lobster (neon yazı) · Jura (mətn) — Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('neon-party')
const ID = 'neon-party'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['PINK'], secondary: ['VIOLET'], accent: ['CYAN'], background: ['WALL'], text: ['WHITE'] }
const NEON = "'Lobster', 'Pacifico', cursive"

const RING = (C) => ([C.PINK, C.CYAN, C.VIOLET, C.YELLOW])

const KEYFRAMES = (C) => (`
@keyframes np-flicker { 0% { opacity: .1 } 8% { opacity: 1 } 12% { opacity: .2 } 18% { opacity: 1 } 24% { opacity: .35 } 30%,100% { opacity: 1 } }
@keyframes np-buzz { 0%,100% { opacity: 1 } 92% { opacity: 1 } 94% { opacity: .55 } 96% { opacity: 1 } }
@keyframes np-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes np-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes np-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes np-pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.08) } }
[data-np] span[aria-hidden="true"], [data-np] svg[aria-hidden="true"], [data-np] div[aria-hidden="true"] { pointer-events: none; }
[data-np] ::placeholder { color: rgba(169,156,196,.55); }
[data-np] input:focus-visible, [data-np] textarea:focus-visible { border-color: ${C.CYAN} !important; outline: none; }
[data-np] button:focus-visible, [data-np] a:focus-visible, [data-np] [role="button"]:focus-visible { outline: 2px solid ${C.CYAN}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-np] *, [data-np] { animation: none !important; transition: none !important; } }
`)

const WALL_BG = `radial-gradient(70% 50% at 50% 40%, rgba(155,92,255,.16), transparent 70%), ${BRICKS}`
const neonText = (C) => ((c, on = true, s = 1) => (on ? { color: '#FFF5FE', textShadow: glow(c, s) } : { color: C.TUBE, textShadow: 'none' }))

/* ═══ 01 — AÇILIŞ: neon lövhə yanır ═══ */
function NeonOpening({ inv, theme }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  const fl = (d) => (go ? `np-flicker .9s steps(1, end) ${d}s both` : 'none')
  return (
    <motion.div {...gate.gateProps} data-np
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: BRICKS, color: C.WHITE, fontFamily: theme.fonts.body }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 45% at 50% 42%, rgba(255,79,216,.28), rgba(60,242,255,.08) 50%, transparent 75%)', opacity: go ? 1 : 0, transition: 'opacity .3s ease .35s' }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(5,3,10,.45)', opacity: go ? 0 : 1, transition: 'opacity .3s ease .3s' }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px', textAlign: 'center' }}>
        <NeonFrame color={C.CYAN} on={go} radius={28} flicker={fl(0.05)} style={{ width: 'min(86vw, 340px)', padding: '30px 18px 26px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10, animation: fl(0.25) }}>
            <EmblemSlot mono={ot.mono} size={44} border={`1.5px solid ${go ? C.YELLOW : C.TUBE}`} background="transparent" color={go ? C.YELLOW : C.TUBE} font={head} style={{ animation: 'none', margin: 0 }}>
              <NeonStar size={26} on={go} style={{ margin: '0 auto' }} />
            </EmblemSlot>
          </div>
          {ot.show('kicker') && <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '.3em', textTransform: 'uppercase', ...neonText(C)(C.CYAN, go, 0.7), animation: fl(0.15) }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 8, fontFamily: NEON, fontSize: 'clamp(42px, 13vw, 62px)', lineHeight: 1.08, overflowWrap: 'anywhere', ...neonText(C)(C.PINK, go), animation: fl(0.3) }}>
              {first}{second && <><span style={{ display: 'block', fontSize: '.5em', ...neonText(C)(C.VIOLET, go) }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 12, fontSize: 15, fontWeight: 500, letterSpacing: '.08em', ...neonText(C)(C.YELLOW, go, 0.5), animation: fl(0.45) }}>{ot.text('meta')}</div>}
        </NeonFrame>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: 34 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 28px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, boxShadow: boxGlow(C.PINK), color: '#FFF5FE', fontWeight: 700, fontSize: 15, letterSpacing: '.14em', textTransform: 'uppercase', textShadow: glow(C.PINK, 0.5), animation: 'np-rise .8s ease-out .8s both, np-buzz 4s linear 2s infinite' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 13, letterSpacing: '.14em', textTransform: 'uppercase', color: C.MUTED, animation: 'np-fade .8s ease-out 1.1s both, np-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel($p) {
  const C = usePalette(PAL)
  const { id, section, title, kicker, sub, children, alt = false, tone = C.PINK } = $p
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: alt ? `radial-gradient(70% 40% at 50% 0%, ${alpha(tone, 0.12)}, transparent 70%), ${C.WALL}` : WALL_BG, color: C.WHITE }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <NeonRule width={200} />
            {title && <h2 style={{ margin: '16px 0 0', fontFamily: NEON, fontWeight: 400, fontSize: scaleFont('clamp(34px, 10vw, 46px)', C.hs), lineHeight: 1.1, textWrap: 'balance', ...neonText(C)(tone, true, 0.8) }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 10, fontSize: 13.5, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: C.MUTED }}>{kicker}</div>}
            {sub && <p style={{ margin: '10px auto 0', maxWidth: 340, fontSize: 15.5, color: C.MUTED, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: alpha('#000000', 0.4), border: `1.5px solid ${alpha(C.VIOLET, 0.6)}`, borderRadius: 14,
  padding: '14px 16px', fontSize: 16, color: C.WHITE, outline: 'none',
})
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 999,
  fontSize: 14, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', textDecoration: 'none', cursor: 'pointer',
  background: on ? C.PINK : 'transparent', color: on ? '#16051A' : C.WHITE, border: 'none', boxShadow: on ? `0 0 16px ${C.PINK}, 0 0 30px ${alpha(C.PINK, 0.5)}` : boxGlow(C.CYAN),
}))
const suggest = (C) => ({ bg: C.PANEL, border: `1.5px solid ${alpha(C.VIOLET, 0.5)}`, active: alpha(C.PINK, 0.2), text: C.WHITE, table: C.CYAN, radius: 14 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function NeonPartyTemplate(props) {
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
    <PaletteContext.Provider value={C}><div data-np lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.WALL, minHeight: '100vh', fontFamily: body, color: C.WHITE, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.PINK, 0.35),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <NeonOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.WALL, boxShadow: boxGlow(C.PINK) }}>
        {({ playing }) => <EqBars playing={playing} color={C.PINK} idle={alpha(C.PINK, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.WALL, 0.9), backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${alpha(C.VIOLET, 0.4)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: NEON, fontSize: 22, ...neonText(C)(C.PINK, true, 0.6) }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — neon lövhə */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: WALL_BG, padding: '46px 20px 58px', textAlign: 'center' }}>
            <NeonFrame color={C.CYAN} radius={30} style={{ maxWidth: 420, margin: '0 auto', padding: '36px 20px 32px', animation: 'np-buzz 6s linear infinite' }}>
              <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '.3em', textTransform: 'uppercase', ...neonText(C)(C.CYAN, true, 0.7) }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              <h1 style={{ margin: '10px 0 0', fontFamily: NEON, fontWeight: 400, fontSize: nameSize(heroName), lineHeight: 1.08, overflowWrap: 'anywhere', ...neonText(C)(C.PINK), animation: 'np-rise .9s ease-out .2s both' }}>{heroName}</h1>
              {host && <div style={{ marginTop: 10, fontSize: 13.5, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: C.MUTED }}>{T.host} · <span style={{ color: C.WHITE }}>{host}</span></div>}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 18 }}>
                {[C.YELLOW, C.PINK, C.CYAN].map((c, i) => <NeonStar key={i} size={22} color={c} style={{ animation: `np-pulse 2s ease-in-out ${i * 0.3}s infinite` }} />)}
              </div>
              <div style={{ marginTop: 16, fontSize: 'clamp(18px, 5vw, 22px)', fontWeight: 700, letterSpacing: '.06em', ...neonText(C)(C.YELLOW, true, 0.45) }}>{inv.fullDate}</div>
              <div style={{ marginTop: 6, fontSize: 15, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            </NeonFrame>
            <p style={{ margin: '24px auto 0', maxWidth: 330, fontSize: 16, lineHeight: 1.6, color: C.MUTED }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC */}
          {S.countdown && (
            <Panel section="countdown" head={head} alt tone={C.CYAN} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <NeonFrame key={l} color={RING(C)[i]} radius={16} style={{ padding: '18px 4px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 'clamp(24px, 7vw, 32px)', fontWeight: 700, lineHeight: 1, fontVariantNumeric: 'tabular-nums', ...neonText(C)(RING(C)[i], true, 0.7) }}><PopDigit value={v} pop={pop} /></div>
                    <div style={{ marginTop: 8, fontSize: 11.5, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: C.MUTED }}>{l}</div>
                  </NeonFrame>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} tone={C.VIOLET} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <NeonFrame color={C.VIOLET} radius={22} style={{ maxWidth: 430, margin: '0 auto', padding: 6 }}>
                <div style={{ borderRadius: 16, overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.PINK} height="clamp(250px, 70vw, 320px)"
                    map={{ opacity: 0.7, filter: 'invert(.9) hue-rotate(210deg) saturate(1.2) brightness(.85)', tintOpacity: 0.2, tint: C.VIOLET, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: C.PANEL }}><MapPin /></div>}
                  />
                </div>
              </NeonFrame>
              <div style={{ textAlign: 'center', marginTop: 24, fontSize: 22, fontWeight: 700, lineHeight: 1.25, color: C.WHITE }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 13.5, letterSpacing: '.16em', textTransform: 'uppercase', color: C.MUTED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} />
            </Panel>
          )}

          {/* PROQRAM */}
          {S.program && (
            <Panel section="program" head={head} alt tone={C.YELLOW} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ position: 'relative', maxWidth: 380, margin: '0 auto' }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: 21, top: 14, bottom: 14, width: 2, borderRadius: 2, background: '#FFFFFF', boxShadow: `0 0 6px ${C.VIOLET}, 0 0 14px ${C.VIOLET}` }} />
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr)', gap: 12, alignItems: 'center', padding: '12px 0' }}>
                    <span aria-hidden="true" style={{ justifySelf: 'center', width: 14, height: 14, borderRadius: '50%', background: '#FFFFFF', boxShadow: `0 0 6px ${RING(C)[i % 4]}, 0 0 16px ${RING(C)[i % 4]}, 0 0 28px ${RING(C)[i % 4]}` }} />
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '.06em', fontVariantNumeric: 'tabular-nums', ...neonText(C)(RING(C)[i % 4], true, 0.45) }}>{ev.time}</div>
                      <div style={{ marginTop: 2, fontSize: 17, lineHeight: 1.35, color: C.WHITE }}>{ev.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} tone={C.PINK} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" />
            </Panel>
          )}

          {/* MASA — neon lövhə */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} alt tone={C.CYAN} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="np-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={C.MUTED} accent={C.CYAN}
                nameStyle={{ fontWeight: 700, fontSize: 19 }}
                card={(num) => (
                  <NeonFrame color={C.PINK} radius={24} flicker="np-flicker .8s steps(1, end) both" style={{ display: 'inline-block', minWidth: 200, padding: '22px 28px 18px', background: alpha('#000000', 0.3) }}>
                    <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.3em', textTransform: 'uppercase', ...neonText(C)(C.CYAN, true, 0.6) }}>{T.table}</div>
                    <div style={{ fontFamily: NEON, fontSize: tableSize(num, 72), lineHeight: 1.1, ...neonText(C)(C.PINK) }}>{num}</div>
                  </NeonFrame>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} tone={C.VIOLET} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 32 }} />}
              <PhotoQr inv={inv} tr={tr} fg="#16051A" bg="#FFFFFF" frame={{ borderRadius: 16, boxShadow: boxGlow(C.CYAN) }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'night')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} alt tone={C.PINK} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.WHITE, muted: C.MUTED, line: alpha(C.VIOLET, 0.6), hair: alpha(C.VIOLET, 0.3), accent: C.PINK,
                font: body, display: NEON, btnFont: body,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><NeonStar size={40} /></div>,
                marker: (a) => (a ? <span style={{ display: 'block', width: 14, height: 14, borderRadius: '50%', background: '#FFFFFF', boxShadow: `0 0 6px ${C.PINK}, 0 0 14px ${C.PINK}` }} /> : <span style={{ display: 'block', width: 14, height: 14, borderRadius: '50%', border: `1.5px solid ${C.FAINT}` }} />),
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* DİVARA YAZIN */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} tone={C.YELLOW} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field(C)} btn={btn(C)} errorColor={C.PINK} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  const c = RING(C)[i % 4]
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '18px 18px 16px 22px', borderRadius: 16, background: alpha('#000000', 0.35), boxShadow: `inset 3px 0 0 #FFFFFF, -4px 0 14px -6px ${c}` }}>
                      <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.55, color: C.WHITE }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, fontFamily: NEON, fontSize: 21, ...neonText(C)(c, true, 0.5) }}>{msg.name}{msg.date ? <span style={{ fontFamily: body, fontSize: 13, color: C.FAINT, textShadow: 'none' }}> · {gbook.formatDate(msg.date)}</span> : null}</figcaption>
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
      <span style={{ position: 'absolute', left: -16, top: -40, animation: 'np-pulse 2s ease-in-out infinite' }}><NeonStar size={32} color={C.PINK} /></span>
      <span style={{ position: 'absolute', left: -4, top: -4, width: 8, height: 8, borderRadius: '50%', background: '#FFFFFF', boxShadow: `0 0 8px ${C.CYAN}, 0 0 16px ${C.CYAN}` }} />
    </span>
  )
}
