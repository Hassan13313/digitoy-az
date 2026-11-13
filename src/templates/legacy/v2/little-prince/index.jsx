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
import { galleryDesc, tableSize, ageWord } from '../../../_shared/kids'
import { C as PAL, GOLD_GRAD, NAVY_BG, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Crown, Cushion, SHIELD, Dust, CrownRule } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../../../_shared/palette'
import FilmReel from '../../../_shared/FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   LITTLE PRINCE — «Kiçik şahzadə» (Sünnət toyu konsepti, 2026-10)

   Konsept: sünnət toyunun «kiçik bəyi» — məxmər yastıq üstündə tac, kral
   mavisi və qızıl. Açılışda tac yastığın üstündədir; toxunanda yuxarı
   qalxır, arxasından qızılı şüalar açılır. Daxildə:
     hero      → şüalar fonunda tac, ad qızılı kapitellə, yaş medalyonu
     sayğac    → dörd qızılı haşiyəli qalxan
     proqram   → şah fərmanı — fil sümüyü kağızda siyahı
     masa      → yastığın üstündə masa nömrəsi, üstündə tac
   Şriftlər: Spectral SC (başlıq) · Mulish (mətn) — Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('little-prince')
const ID = 'little-prince'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['ROYAL'], secondary: ['NAVY'], accent: ['GOLD'], background: ['IVORY'], text: ['INK'] }

const KEYFRAMES = (C) => (`
@keyframes lp-twinkle { 0%,100% { opacity: .2; transform: scale(.7) } 50% { opacity: 1; transform: scale(1.1) } }
@keyframes lp-rays { to { transform: rotate(360deg) } }
@keyframes lp-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
@keyframes lp-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes lp-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes lp-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes lp-crown { 0% { transform: translateY(-40px) scale(.7); opacity: 0 } 70% { transform: translateY(4px) scale(1.04) } 100% { transform: none; opacity: 1 } }
[data-lp] span[aria-hidden="true"], [data-lp] svg[aria-hidden="true"], [data-lp] div[aria-hidden="true"] { pointer-events: none; }
[data-lp] ::placeholder { color: rgba(93,102,132,.6); }
[data-lp] input:focus-visible, [data-lp] textarea:focus-visible { border-color: ${C.ROYAL} !important; outline: none; }
[data-lp] button:focus-visible, [data-lp] a:focus-visible, [data-lp] [role="button"]:focus-visible { outline: 2px solid ${C.GOLD}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-lp] *, [data-lp] { animation: none !important; transition: none !important; } }
`)

const RAYS = `repeating-conic-gradient(from 0deg, rgba(243,220,152,.16) 0deg 6deg, transparent 6deg 18deg)`
const IVORY_BG = (C) => (`radial-gradient(90% 60% at 50% 0%, #FFFBF1, transparent 70%), ${C.IVORY}`)

/* ═══ 01 — AÇILIŞ: tac qalxır ═══ */
function PrinceOpening({ inv, theme }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-lp
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: NAVY_BG(C), color: C.IVORY, fontFamily: theme.fonts.body }}>
      <Dust />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 'min(72vw, 280px)', height: 230, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '42%', width: 560, height: 560, margin: '-280px 0 0 -280px', borderRadius: '50%', background: RAYS, WebkitMaskImage: 'radial-gradient(circle, #000 18%, transparent 62%)', maskImage: 'radial-gradient(circle, #000 18%, transparent 62%)', opacity: go ? 1 : 0.35, transform: go ? 'scale(1.25)' : 'none', transition: 'opacity .8s ease, transform 1.6s ease', animation: 'lp-rays 40s linear infinite' }} />
          <Cushion width="100%" style={{ position: 'absolute', bottom: 0 }} />
          <div style={{ position: 'absolute', left: '50%', bottom: 46, width: '58%', marginLeft: '-29%', transform: go ? 'translateY(-70px) scale(1.12)' : 'none', transition: 'transform 1.2s cubic-bezier(.3,.7,.3,1) .05s', filter: go ? 'drop-shadow(0 0 22px rgba(243,220,152,.75))' : 'drop-shadow(0 10px 12px rgba(0,0,0,.4))' }}>
            <div style={{ animation: go ? 'none' : 'lp-crown 1s cubic-bezier(.3,.8,.4,1) .2s both' }}><Crown width="100%" uid="lp-op" /></div>
          </div>
        </div>
        <div style={{ marginTop: 22, animation: 'lp-rise 1s ease-out .5s both' }}>
          <EmblemSlot mono={ot.mono} size={46} border={`1px solid ${alpha(C.GOLD, 0.7)}`} background="transparent" color={C.GOLD_L} font={head} style={{ animation: 'none', margin: '0 auto 10px' }}>
            <CrownRule width={60} />
          </EmblemSlot>
          {ot.show('kicker') && <div style={{ fontFamily: head, fontSize: 15, letterSpacing: '.24em', color: C.GOLD_L }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 6, fontFamily: head, fontSize: 'clamp(40px, 12vw, 56px)', lineHeight: 1.05, color: '#FFF6DE', overflowWrap: 'anywhere', textShadow: '0 2px 16px rgba(0,0,0,.35)' }}>
              {first}{second && <><span style={{ display: 'block', fontSize: '.5em', color: C.GOLD_L }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 8, fontSize: 15, color: alpha(C.IVORY, 0.78) }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: 22 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: GOLD_GRAD(C), color: C.NAVY, fontFamily: head, fontSize: 17, letterSpacing: '.06em', boxShadow: '0 12px 26px -10px rgba(243,220,152,.6)', animation: 'lp-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 10, fontSize: 13.5, color: alpha(C.IVORY, 0.6), animation: 'lp-fade .8s ease-out 1.1s both, lp-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dark = false }) {
  const C = usePalette(PAL)
  const mute = dark ? alpha(C.IVORY, 0.75) : C.MUTED
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? NAVY_BG(C) : IVORY_BG(C), color: dark ? C.IVORY : C.INK }}>
      {dark && <Dust opacity={0.5} />}
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <CrownRule color={dark ? C.GOLD_L : C.GOLD_D} width={210} />
            {title && <h2 style={{ margin: '12px 0 0', fontFamily: head, fontWeight: 500, fontSize: scaleFont('clamp(28px, 8vw, 37px)', C.hs), lineHeight: 1.15, color: dark ? C.GOLD_L : C.ROYAL, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontSize: 15.5, color: mute }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 340, fontSize: 15.5, color: mute, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: '#FFFDF7', border: `1px solid ${alpha(C.ROYAL, 0.3)}`, borderRadius: 10,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
})
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 15.5, fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.ROYAL : 'transparent', color: on ? C.GOLD_L : C.ROYAL, border: `1px solid ${on ? C.ROYAL : alpha(C.ROYAL, 0.45)}`,
}))
const suggest = (C) => ({ bg: '#FFFDF7', border: `1px solid ${alpha(C.ROYAL, 0.25)}`, active: alpha(C.GOLD_L, 0.4), text: C.INK, table: C.ROYAL, radius: 10 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function LittlePrinceTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const age = inv.age

  return (
    <PaletteContext.Provider value={C}><div data-lp lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.IVORY, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.GOLD, 0.3),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <PrinceOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.ROYAL, border: `2px solid ${C.GOLD}`, boxShadow: '0 8px 20px rgba(15,28,63,.45)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.GOLD_L} idle={alpha(C.GOLD_L, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.NAVY, 0.92), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.GOLD, 0.4)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.IVORY, 0.8), fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontSize: 18, letterSpacing: '.1em', color: C.GOLD_L }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — şüalar və tac */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: NAVY_BG(C), padding: '40px 22px 60px', textAlign: 'center', color: C.IVORY }}>
            <Dust />
            <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 110, width: 640, height: 640, margin: '-320px 0 0 -320px', borderRadius: '50%', background: RAYS, WebkitMaskImage: 'radial-gradient(circle, #000 14%, transparent 60%)', maskImage: 'radial-gradient(circle, #000 14%, transparent 60%)', animation: 'lp-rays 60s linear infinite' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ width: 150, margin: '0 auto', animation: 'lp-float 4s ease-in-out infinite', filter: 'drop-shadow(0 0 18px rgba(243,220,152,.5))' }}><Crown width="100%" uid="lp-hero" /></div>
              <div style={{ marginTop: 20, fontFamily: head, fontSize: 15, letterSpacing: '.26em', color: C.GOLD_L }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              <h1 style={{ margin: '8px 0 0', fontFamily: head, fontWeight: 500, fontSize: nameSize(heroName), lineHeight: 1.04, overflowWrap: 'anywhere', backgroundImage: GOLD_GRAD(C), WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent', animation: 'lp-rise 1s ease-out .3s both' }}>{heroName}</h1>
              {age && (
                <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, marginTop: 14, padding: '6px 18px', borderRadius: 999, border: `1px solid ${alpha(C.GOLD, 0.6)}`, color: C.GOLD_L }}>
                  <span style={{ fontFamily: head, fontSize: 24, lineHeight: 1 }}>{age}</span>
                  <span style={{ fontSize: 14, letterSpacing: '.08em' }}>{ageWord(age, lang, inv.strings)}</span>
                </div>
              )}
              <CrownRule color={C.GOLD_L} width={230} style={{ marginTop: 18 }} />
              <div style={{ marginTop: 16, fontFamily: head, fontSize: 'clamp(20px, 5.8vw, 25px)', color: C.IVORY }}>{inv.fullDate}</div>
              <div style={{ marginTop: 6, fontSize: 16, color: alpha(C.IVORY, 0.75) }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 15, color: alpha(C.IVORY, 0.75) }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              <p style={{ margin: '18px auto 0', maxWidth: 330, fontSize: 16.5, lineHeight: 1.6, color: alpha(C.IVORY, 0.82) }}>{tr.inv_join}</p>
            </div>
          </section>

          {/* SAYĞAC — qalxanlar */}
          {S.countdown && (
            <Panel section="countdown" head={head} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ padding: 3, background: GOLD_GRAD(C), clipPath: SHIELD, filter: 'drop-shadow(0 10px 12px rgba(15,28,63,.3))' }}>
                      <div style={{ aspectRatio: '1 / 1.18', clipPath: SHIELD, background: `linear-gradient(180deg, ${C.ROYAL_L}, ${C.ROYAL} 60%, ${C.NAVY})`, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '18%' }}>
                        <span style={{ fontFamily: head, fontWeight: 500, fontSize: 'clamp(22px, 7vw, 32px)', lineHeight: 1, color: C.GOLD_L, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                      </div>
                    </div>
                    <div style={{ marginTop: 8, fontSize: 13.5, fontWeight: 600, color: C.MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} dark title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ position: 'relative', maxWidth: 430, margin: '30px auto 0', padding: 6, background: GOLD_GRAD(C), borderRadius: '24px 24px 8px 8px', boxShadow: '0 28px 40px -24px rgba(0,0,0,.7)' }}>
                <div style={{ position: 'absolute', left: '50%', top: -34, width: 70, marginLeft: -35, zIndex: 2 }}><Crown width="100%" uid="lp-map" /></div>
                <div style={{ borderRadius: '19px 19px 4px 4px', overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.ROYAL} height="clamp(250px, 70vw, 320px)"
                    map={{ opacity: 0.9, filter: 'saturate(.8)', tintOpacity: 0.14, tint: C.ROYAL, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: C.IVORY_D }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontSize: 25, lineHeight: 1.2, color: C.GOLD_L }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 15.5, color: alpha(C.IVORY, 0.72) }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={(on) => ({ ...btn(C)(on), background: on ? GOLD_GRAD(C) : 'transparent', color: on ? C.NAVY : C.GOLD_L, border: `1px solid ${on ? C.GOLD : alpha(C.GOLD, 0.5)}` })} />
            </Panel>
          )}

          {/* PROQRAM — fərman */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ position: 'relative', maxWidth: 400, margin: '0 auto', padding: '34px 24px 30px', background: 'linear-gradient(180deg, #FFFCF2, #F5EBD2)', borderRadius: 6, boxShadow: `0 0 0 1px ${alpha(C.GOLD_D, 0.4)}, 0 0 0 6px #FFFCF2, 0 0 0 7px ${alpha(C.GOLD_D, 0.5)}, 0 24px 40px -26px rgba(15,28,63,.5)` }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: -9, height: 18, borderRadius: 9, background: 'linear-gradient(180deg, #E7D7B0, #C9B07A)', boxShadow: '0 4px 6px rgba(0,0,0,.15)' }} />
                <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: -9, height: 18, borderRadius: 9, background: 'linear-gradient(180deg, #E7D7B0, #C9B07A)', boxShadow: '0 4px 6px rgba(0,0,0,.15)' }} />
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '64px minmax(0, 1fr)', gap: 12, alignItems: 'baseline', padding: '10px 0', borderBottom: i < timeline.events.length - 1 ? `1px dashed ${alpha(C.GOLD_D, 0.4)}` : 'none' }}>
                    <div style={{ fontFamily: head, fontSize: 18, color: C.GOLD_D, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    <div style={{ fontSize: 17, lineHeight: 1.4, color: C.INK }}>{ev.label}</div>
                  </div>
                ))}
                <div aria-hidden="true" style={{ position: 'absolute', right: 18, bottom: 18, width: 46, height: 46, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #C0384F, ${C.VELVET} 70%)`, boxShadow: '0 4px 8px rgba(110,20,38,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 40 26" width="24" height="16"><path d="M4 22L2 6L12 14L20 2L28 14L38 6L36 22Z" fill="#F3DC98" /></svg>
                </div>
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" />
            </Panel>
          )}

          {/* MASA — yastıq üstündə */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} dark title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="lp-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={alpha(C.IVORY, 0.75)} accent={C.GOLD_L}
                nameStyle={{ fontFamily: head, fontSize: 24 }}
                card={(num) => (
                  <div style={{ position: 'relative', width: 240, margin: '0 auto', paddingTop: 56, animation: 'lp-crown .8s cubic-bezier(.3,.8,.4,1) both' }}>
                    <div style={{ position: 'absolute', left: '50%', top: 0, width: 90, marginLeft: -45 }}><Crown width="100%" uid="lp-seat" /></div>
                    <Cushion width="100%">
                      <div style={{ textAlign: 'center', color: C.GOLD_L, lineHeight: 1 }}>
                        <span style={{ fontSize: 11.5, letterSpacing: '.24em', textTransform: 'uppercase', marginRight: 4 }}>{T.table}</span>{' '}
                        <span style={{ fontFamily: head, fontSize: tableSize(num, 40) }}>{num}</span>
                      </div>
                    </Cushion>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 32 }} />}
              <PhotoQr inv={inv} tr={tr} fg={C.NAVY} bg="#FFFDF7" frame={{ borderRadius: 14, border: `3px solid ${C.GOLD}`, boxShadow: `0 0 0 4px ${C.IVORY}, 0 0 0 5px ${C.ROYAL}` }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.ROYAL, 0.4), hair: alpha(C.ROYAL, 0.18), accent: C.ROYAL,
                font: body, display: head, btnFont: body,
                doneMark: <div style={{ width: 70, margin: '0 auto 10px' }}><Crown width="100%" uid="lp-done" /></div>,
                marker: (a) => (a ? <span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', background: GOLD_GRAD(C), boxShadow: `0 0 0 2px ${C.ROYAL}` }} /> : <span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', border: `1px solid ${alpha(C.ROYAL, 0.45)}` }} />),
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field(C)} btn={(on) => ({ ...btn(C)(on), background: on ? GOLD_GRAD(C) : 'transparent', color: on ? C.NAVY : C.GOLD_L, border: `1px solid ${C.GOLD}` })} errorColor={C.GOLD_L} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '18px 20px 16px', background: alpha('#FFFFFF', 0.06), border: `1px solid ${alpha(C.GOLD, 0.35)}`, borderRadius: 12 }}>
                      <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.6, color: C.IVORY }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 10, fontFamily: head, fontSize: 15.5, letterSpacing: '.04em', color: C.GOLD_L }}>{msg.name}{msg.date ? <span style={{ fontFamily: body, fontSize: 13.5, color: alpha(C.IVORY, 0.55) }}> · {gbook.formatDate(msg.date)}</span> : null}</figcaption>
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
      <span style={{ position: 'absolute', left: -22, top: -40, width: 44 }}><Crown width="100%" uid="lp-pin" /></span>
      <span style={{ position: 'absolute', left: -4, top: -4, width: 8, height: 8, borderRadius: '50%', background: C.ROYAL, boxShadow: `0 0 0 3px ${C.GOLD_L}` }} />
    </span>
  )
}
