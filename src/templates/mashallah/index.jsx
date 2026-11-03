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
import { galleryDesc, ageWord } from '../_shared/kids'
import { C as PAL, TILE, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Nazar, Bead, BeadRule, Sash } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'

/* ─────────────────────────────────────────────────────────────────────────────
   MAŞALLAH — «Göz muncuğu və atlas lent» (Sünnət toyu konsepti, 2026-10)

   Konsept: sünnət toyunun ənənəvi rəmzləri — kiçik bəyin çiyninə taxılan
   «Maşallah» lenti və göz dəyməsin deyə göz muncuğu. Kobalt, firuzəyi və
   qızıl, krem fonda incə kaşı naxışı. Açılışda böyük göz muncuğu; toxunanda
   üzərindən parıltı keçir, ətrafdakı muncuq sapı açılır və lent uçub gəlir.
   Daxildə:
     sayğac    → sapa düzülmüş dörd şüşə muncuq
     məkan     → muncuq haşiyəli xəritə
     proqram   → şaquli muncuq sapı
     masa      → böyük göz muncuğu, üzərində lentdə masa nömrəsi
   Şriftlər: Literata (başlıq) · Nunito Sans (mətn) — Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('mashallah')
const ID = 'mashallah'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['COBALT'], secondary: ['GOLD'], accent: ['TURQ'], background: ['CREAM'], text: ['INK'] }

const KEYFRAMES = (C) => (`
@keyframes mh-spin { to { transform: rotate(360deg) } }
@keyframes mh-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes mh-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes mh-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes mh-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-7px) } }
@keyframes mh-sash { from { transform: rotate(-8deg) scaleX(0) } to { transform: rotate(-8deg) scaleX(1) } }
@keyframes mh-drop { 0% { transform: translateY(-30px) scale(.8); opacity: 0 } 70% { transform: translateY(4px) } 100% { transform: none; opacity: 1 } }
[data-mh] span[aria-hidden="true"], [data-mh] svg[aria-hidden="true"], [data-mh] div[aria-hidden="true"] { pointer-events: none; }
[data-mh] ::placeholder { color: rgba(86,103,127,.6); }
[data-mh] input:focus-visible, [data-mh] textarea:focus-visible { border-color: ${C.TURQ} !important; outline: none; }
[data-mh] button:focus-visible, [data-mh] a:focus-visible, [data-mh] [role="button"]:focus-visible { outline: 2px solid ${C.COBALT}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-mh] *, [data-mh] { animation: none !important; transition: none !important; } }
`)

const CREAM_BG = (C) => (`${TILE}, radial-gradient(90% 60% at 50% 0%, #FFFDF7, transparent 70%), ${C.CREAM}`)
const COBALT_BG = (C) => (`radial-gradient(90% 60% at 50% 0%, #1A55B8, transparent 70%), linear-gradient(180deg, ${C.COBALT}, ${C.COBALT_D})`)
const RING = Array.from({ length: 18 }, (_, i) => i)

/* ═══ 01 — AÇILIŞ: göz muncuğu və lent ═══ */
function NazarOpening({ inv, theme }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-mh
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: CREAM_BG(C), color: C.INK, fontFamily: theme.fonts.body }}>
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 'min(64vw, 250px)', aspectRatio: '1' }}>
          {/* muncuq sapı */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: '-8%', transform: go ? 'scale(1.35) rotate(90deg)' : 'none', opacity: go ? 0 : 1, transition: 'transform 1.4s cubic-bezier(.3,.6,.3,1) .2s, opacity .9s ease .7s' }}>
            <div style={{ position: 'absolute', inset: 0, animation: 'mh-spin 40s linear infinite' }}>
              {RING.map((i) => (
                <Bead key={i} size={i % 3 === 0 ? 16 : 11} color={[C.COBALT, C.TURQ, C.WHITE][i % 3]}
                  style={{ position: 'absolute', left: '50%', top: '50%', transform: `rotate(${i * 20}deg) translateY(calc(-1 * min(38vw, 147px))) translate(-50%, -50%)`, transformOrigin: '0 0' }} />
              ))}
            </div>
          </div>
          <div style={{ position: 'absolute', inset: '8%', transform: go ? 'scale(1.08)' : 'none', transition: 'transform 1s ease', animation: go ? 'none' : 'mh-float 4s ease-in-out infinite' }}>
            <Nazar size="100%" shine={go} />
          </div>
          {go && (
            <div aria-hidden="true" style={{ position: 'absolute', left: '-12%', right: '-12%', bottom: '4%', display: 'flex', justifyContent: 'center', transformOrigin: '50% 50%', animation: 'mh-sash .6s cubic-bezier(.3,.8,.4,1) .35s both' }}>
              <Sash font={head} rotate={0} size={26}>{inv.copy(TXT).sash}</Sash>
            </div>
          )}
        </div>
        <div style={{ marginTop: 26, animation: 'mh-rise 1s ease-out .3s both' }}>
          <EmblemSlot mono={ot.mono} size={42} border={`1px solid ${alpha(C.COBALT, 0.4)}`} background={C.WHITE} color={C.COBALT} font={head} style={{ animation: 'none', margin: '0 auto 10px' }}>
            <Nazar size={22} style={{ margin: '0 auto' }} />
          </EmblemSlot>
          {ot.show('kicker') && <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: C.TURQ }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 6, fontFamily: head, fontWeight: 500, fontSize: 'clamp(40px, 12vw, 56px)', lineHeight: 1.05, color: C.COBALT, overflowWrap: 'anywhere' }}>
              {first}{second && <><span style={{ display: 'block', fontStyle: 'italic', fontSize: '.5em', color: C.GOLD }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 8, fontSize: 15, color: C.MUTED }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: 22 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 28px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: C.COBALT, color: C.WHITE, fontWeight: 700, fontSize: 16, boxShadow: `0 0 0 4px ${alpha(C.TURQ, 0.25)}, 0 12px 24px -10px rgba(8,38,88,.55)`, animation: 'mh-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 10, fontSize: 13.5, color: C.MUTED, animation: 'mh-fade .8s ease-out 1.1s both, mh-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dark = false }) {
  const C = usePalette(PAL)
  const mute = dark ? alpha(C.WHITE, 0.78) : C.MUTED
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? COBALT_BG(C) : CREAM_BG(C), color: dark ? C.WHITE : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <BeadRule width={210} />
            {title && <h2 style={{ margin: '14px 0 0', fontFamily: head, fontWeight: 500, fontSize: scaleFont('clamp(29px, 8.4vw, 38px)', C.hs), lineHeight: 1.15, color: dark ? C.WHITE : C.COBALT, textWrap: 'balance' }}>{title}</h2>}
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
  width: '100%', background: C.WHITE, border: `1.5px solid ${alpha(C.COBALT, 0.25)}`, borderRadius: 16,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
})
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 15.5, fontWeight: 700, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.COBALT : C.WHITE, color: on ? C.WHITE : C.COBALT, border: `1.5px solid ${on ? C.COBALT : alpha(C.COBALT, 0.35)}`,
}))
const suggest = (C) => ({ bg: C.WHITE, border: `1.5px solid ${alpha(C.COBALT, 0.22)}`, active: alpha(C.SKY, 0.6), text: C.INK, table: C.COBALT, radius: 16 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function MashallahTemplate(props) {
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
    <PaletteContext.Provider value={C}><div data-mh lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.CREAM, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.TURQ, 0.3),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <NazarOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.COBALT, border: `2px solid ${C.WHITE}`, boxShadow: `0 0 0 2px ${C.TURQ}, 0 8px 18px rgba(8,38,88,.4)` }}>
        {({ playing }) => <EqBars playing={playing} color={C.WHITE} idle={alpha(C.WHITE, 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.CREAM, 0.93), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.COBALT, 0.15)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontStyle: 'italic', fontSize: 20, color: C.COBALT }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: CREAM_BG(C), padding: '46px 22px 60px', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 170, height: 170, margin: '0 auto' }}>
              <div aria-hidden="true" style={{ position: 'absolute', inset: -26, animation: 'mh-spin 50s linear infinite' }}>
                {RING.map((i) => (
                  <Bead key={i} size={i % 3 === 0 ? 13 : 9} color={[C.COBALT, C.TURQ, C.GOLD][i % 3]}
                    style={{ position: 'absolute', left: '50%', top: '50%', transform: `rotate(${i * 20}deg) translateY(-110px) translate(-50%, -50%)`, transformOrigin: '0 0' }} />
                ))}
              </div>
              <div style={{ animation: 'mh-float 4.5s ease-in-out infinite' }}><Nazar size={170} /></div>
            </div>
            <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center' }}><Sash font={head} size={24}>{T.sash}</Sash></div>
            <div style={{ marginTop: 26, fontSize: 14, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: C.TURQ }}>{L('hero', 'kicker', inv.eventLabel)}</div>
            <h1 style={{ margin: '6px 0 0', fontFamily: head, fontWeight: 500, fontSize: nameSize(heroName), lineHeight: 1.04, color: C.COBALT, overflowWrap: 'anywhere', animation: 'mh-rise 1s ease-out .3s both' }}>{heroName}</h1>
            {age && <div style={{ marginTop: 8, fontFamily: head, fontStyle: 'italic', fontSize: 20, color: C.GOLD }}>{age} {ageWord(age, lang, inv.strings)}</div>}
            <BeadRule width={230} style={{ marginTop: 18 }} />
            <div style={{ marginTop: 16, fontFamily: head, fontSize: 'clamp(20px, 5.8vw, 25px)', color: C.INK }}>{inv.fullDate}</div>
            <div style={{ marginTop: 6, fontSize: 16, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 15, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <p style={{ margin: '18px auto 0', maxWidth: 330, fontSize: 16.5, lineHeight: 1.6, color: C.MUTED }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — sapa düzülmüş muncuqlar */}
          {S.countdown && (
            <Panel section="countdown" head={head} dark title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: -10, right: -10, top: 'calc(min(19vw, 84px) / 2 + 4px)', height: 1.5, background: C.GOLD }} />
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <div key={l} style={{ position: 'relative', textAlign: 'center' }}>
                    <div style={{ width: 'min(19vw, 84px)', aspectRatio: '1', margin: '4px auto 0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `radial-gradient(circle at 34% 28%, rgba(255,255,255,.75), ${[C.TURQ, '#2E7FD6', C.TURQ, '#2E7FD6'][i]} 40%, ${C.COBALT_D})`, boxShadow: '0 10px 16px -8px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,.3)' }}>
                      <span style={{ fontFamily: head, fontWeight: 500, fontSize: 'clamp(22px, 6.6vw, 30px)', lineHeight: 1, color: C.WHITE, textShadow: '0 1px 3px rgba(8,38,88,.6)', fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 13.5, fontWeight: 600, color: alpha(C.WHITE, 0.8) }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN — muncuq haşiyəsi */}
          {S.venue && (
            <Panel section="venue" head={head} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: 12, borderRadius: 28, background: `radial-gradient(circle, ${C.COBALT} 3.4px, transparent 3.9px) 0 0 / 14px 14px, radial-gradient(circle, ${C.TURQ} 2.6px, transparent 3px) 7px 7px / 14px 14px, ${C.WHITE}`, boxShadow: '0 22px 36px -26px rgba(8,38,88,.6)' }}>
                <div style={{ borderRadius: 18, overflow: 'hidden', isolation: 'isolate', boxShadow: `0 0 0 3px ${C.WHITE}` }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.COBALT} height="clamp(250px, 70vw, 320px)"
                    map={{ opacity: 0.92, filter: 'saturate(.85)', tintOpacity: 0.12, tint: C.TURQ, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: CREAM_BG(C) }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 500, fontSize: 25, lineHeight: 1.2, color: C.COBALT }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 15.5, color: C.MUTED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} />
            </Panel>
          )}

          {/* PROQRAM — muncuq sapı */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ position: 'relative', maxWidth: 380, margin: '0 auto' }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: 25, top: 18, bottom: 18, width: 1.5, background: C.GOLD }} />
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '52px minmax(0, 1fr)', gap: 12, alignItems: 'center', padding: '11px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      {i % 2 === 0 ? <Nazar size={30} /> : <Bead size={20} color={C.TURQ} />}
                    </div>
                    <div style={{ padding: '12px 16px', borderRadius: 16, background: C.WHITE, boxShadow: '0 8px 18px -14px rgba(8,38,88,.5)' }}>
                      <div style={{ fontFamily: head, fontWeight: 500, fontSize: 17, color: C.TURQ, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                      <div style={{ marginTop: 2, fontSize: 16.5, lineHeight: 1.35, color: C.INK }}>{ev.label}</div>
                    </div>
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

          {/* MASA — göz muncuğu və lent */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} dark title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="mh-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={alpha(C.WHITE, 0.78)} accent={C.GOLD_L}
                nameStyle={{ fontFamily: head, fontSize: 24 }}
                card={(num, raw) => (
                  <div style={{ position: 'relative', width: 200, margin: '0 auto 10px', animation: 'mh-drop .8s cubic-bezier(.3,.8,.4,1) both' }}>
                    <Nazar size={170} shine style={{ margin: '0 auto' }} />
                    <div style={{ position: 'absolute', left: '50%', bottom: -8, transform: 'translateX(-50%)' }}>
                      <Sash font={head} size={24}>{num !== String(raw || '').trim() ? `${T.table} ${num}` : raw}</Sash>
                    </div>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR — muncuq çərçivələr */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14, marginBottom: 32 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ aspectRatio: '1', overflow: 'hidden', borderRadius: '50%', background: C.SKY, border: `5px solid ${C.WHITE}`, boxShadow: `0 0 0 5px ${C.COBALT}, 0 0 0 7px ${C.TURQ}, 0 14px 22px -10px rgba(8,38,88,.5)`, margin: 7 }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.COBALT_D} bg={C.WHITE} frame={{ borderRadius: 22, boxShadow: `0 0 0 4px ${C.COBALT}, 0 0 0 6px ${C.TURQ}` }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.COBALT, 0.4), hair: alpha(C.COBALT, 0.15), accent: C.COBALT,
                font: body, display: head, btnFont: body,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Nazar size={48} /></div>,
                marker: (a) => (a ? <Nazar size={16} /> : <span style={{ display: 'block', width: 14, height: 14, borderRadius: '50%', border: `1.5px solid ${alpha(C.COBALT, 0.4)}` }} />),
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field(C)} btn={(on) => ({ ...btn(C)(on), background: on ? C.GOLD : C.WHITE, color: C.COBALT_D, border: `1.5px solid ${C.GOLD}` })} errorColor={C.GOLD_L} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, display: 'grid', gridTemplateColumns: '30px minmax(0, 1fr)', gap: 14, padding: '18px 18px 16px', borderRadius: 20, background: alpha(C.WHITE, 0.08), border: `1px solid ${alpha(C.WHITE, 0.16)}` }}>
                      <Nazar size={28} />
                      <div>
                        <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.55, color: C.WHITE }}>{msg.text}</blockquote>
                        <figcaption style={{ marginTop: 8, fontFamily: head, fontStyle: 'italic', fontSize: 16, color: C.GOLD_L }}>{msg.name}{msg.date ? <span style={{ fontFamily: body, fontStyle: 'normal', fontSize: 13.5, color: alpha(C.WHITE, 0.55) }}> · {gbook.formatDate(msg.date)}</span> : null}</figcaption>
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
      <span style={{ position: 'absolute', left: -20, top: -48, animation: 'mh-float 3s ease-in-out infinite' }}><Nazar size={40} /></span>
      <span style={{ position: 'absolute', left: -1, top: -10, width: 2, height: 10, background: C.GOLD }} />
      <span style={{ position: 'absolute', left: -4, top: -4, width: 8, height: 8, borderRadius: '50%', background: C.COBALT, boxShadow: `0 0 0 3px ${C.WHITE}` }} />
    </span>
  )
}
