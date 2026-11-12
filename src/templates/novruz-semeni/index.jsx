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
import { C as PAL, CREAM_BG, GREEN_BG, COPPER_GRAD, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Egg, Semeni, Tray, Sprout } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'
import FilmReel from '../_shared/FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   NOVRUZ SƏMƏNİ — «Bahar xonçası» (Bayram gecələri konsepti, 2026-10)

   Konsept: Novruz xonçası — mis sinidə qırmızı lentli səməni və boyanmış
   yumurtalar. Açılışda qabda cücərti təzə çıxıb; toxunanda səməni boy atır,
   lent bağlanır, rəngli yumurtalar bir-bir xonçaya düzülür. Daxildə:
   yumurtalarda sayğac, cücərtili proqram, böyük yumurtada masa nömrəsi.
   Şriftlər: Bellota (başlıq) · Bellota Text (mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('novruz-semeni')
const ID = 'novruz-semeni'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['GREEN'], secondary: ['COPPER'], accent: ['RED'], background: ['CREAM'], text: ['INK'] }

const KEYFRAMES = (C) => (`
@keyframes ns-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes ns-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes ns-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes ns-sway { from { transform: rotate(-2.5deg) } to { transform: rotate(2.5deg) } }
@keyframes ns-petal { 0% { opacity: 0; transform: translate(0, 0) rotate(0) } 15% { opacity: 1 } 100% { opacity: 0; transform: translate(var(--dx), -40vh) rotate(260deg) } }
[data-ns] span[aria-hidden="true"], [data-ns] svg[aria-hidden="true"], [data-ns] div[aria-hidden="true"] { pointer-events: none; }
[data-ns] ::placeholder { color: rgba(111,122,98,.7); }
[data-ns] [data-dark] ::placeholder { color: rgba(255,248,234,.55); }
[data-ns] input:focus-visible, [data-ns] textarea:focus-visible { border-color: ${C.GREEN} !important; outline: none; }
[data-ns] button:focus-visible, [data-ns] a:focus-visible, [data-ns] [role="button"]:focus-visible { outline: 2px solid ${C.RED}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-ns] *, [data-ns] { animation: none !important; transition: none !important; } }
`)

const EGG_POS = [
  { left: '2%', bottom: '6%', r: -14, s: 46, d: 0.45 },
  { left: '16%', bottom: '0%', r: 8, s: 40, d: 0.6 },
  { right: '15%', bottom: '0%', r: -6, s: 42, d: 0.75 },
  { right: '1%', bottom: '7%', r: 14, s: 46, d: 0.9 },
]

function Xoncha({ grown, instant, width = 'min(80vw, 320px)', eggsIn = true }) {
  return (
    <Tray width={width}>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', paddingTop: '18%', paddingBottom: '9%' }}>
        <Semeni size="56%" grown={grown} instant={instant} />
        {EGG_POS.map((p, i) => (
          <div key={i} style={{ position: 'absolute', left: p.left, right: p.right, bottom: p.bottom, transform: `rotate(${p.r}deg) scale(${eggsIn ? 1 : 0})`, transition: instant ? 'none' : `transform .38s cubic-bezier(.3,1.6,.5,1) ${p.d}s` }}>
            <Egg size={p.s} i={i} />
          </div>
        ))}
      </div>
    </Tray>
  )
}

/* ═══ 01 — AÇILIŞ: səməni boy atır ═══ */
function SemeniOpening({ inv, theme }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-ns
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: CREAM_BG(C), color: C.INK, fontFamily: theme.fonts.body }}>
      {go && [[18, -30], [40, 20], [62, -10], [80, 30], [30, 40]].map(([x, dx], i) => (
        <span key={i} aria-hidden="true" style={{ position: 'absolute', left: `${x}%`, top: '62%', width: 12, height: 8, borderRadius: '50% 0', background: i % 2 ? C.SPROUT : '#F6A5B6', '--dx': `${dx}px`, animation: `ns-petal 1.8s ease-out ${0.5 + i * 0.12}s both` }} />
      ))}
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ animation: 'ns-rise 1s ease-out .2s both' }}>
          {ot.show('kicker') && <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '.2em', textTransform: 'uppercase', color: C.RED }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 8, fontFamily: head, fontWeight: 700, fontSize: 'clamp(36px, 10.6vw, 50px)', lineHeight: 1.06, overflowWrap: 'anywhere', color: C.GREEN_D }}>
              {first}{second && <> {ot.text('and')} {second}</>}
            </div>
          )}
        </div>
        <div style={{ position: 'relative', marginTop: 20 }}>
          <Xoncha grown={go} eggsIn={go} />
          {!go && (
            <div aria-hidden="true" style={{ position: 'absolute', left: '50%', bottom: '2%', transform: 'translateX(-50%)' }}>
              <EmblemSlot mono={ot.mono} size={44} border={`2px solid ${C.CREAM}`} background={C.RED} color={C.CREAM} font={head} style={{ animation: 'none', margin: 0 }}>
                <span />
              </EmblemSlot>
            </div>
          )}
        </div>
        <div style={{ marginTop: 16, animation: 'ns-rise 1s ease-out .35s both' }}>
          {ot.show('meta') && <div style={{ fontSize: 16.5, color: C.MUTED }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.25 }} style={{ marginTop: 18 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: C.GREEN, color: C.CREAM, fontFamily: head, fontWeight: 700, fontSize: 18, boxShadow: `0 0 0 3px ${C.CREAM}, 0 0 0 5px ${C.RED}, 0 12px 22px -10px rgba(43,106,31,.6)`, animation: 'ns-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 14, fontSize: 14.5, color: C.MUTED, animation: 'ns-fade .8s ease-out 1.1s both, ns-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dark = false }) {
  const C = usePalette(PAL)
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? GREEN_BG(C) : CREAM_BG(C), color: dark ? C.CREAM : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
              <Sprout size={22} /><Sprout size={28} /><Sprout size={22} />
            </div>
            {kicker && <div style={{ marginBottom: 4, fontWeight: 700, fontSize: 13, letterSpacing: '.2em', textTransform: 'uppercase', color: dark ? C.SPROUT_L : C.RED }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 700, fontSize: scaleFont('clamp(30px, 8.8vw, 41px)', C.hs), lineHeight: 1.1, textWrap: 'balance', color: dark ? C.CREAM : C.GREEN_D }}>{title}</h2>}
            {sub && <p style={{ margin: '10px auto 0', maxWidth: 340, fontSize: 16.5, color: dark ? alpha(C.CREAM, 0.78) : C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: '#FFFFFF', border: `1.5px solid ${C.LINE}`, borderRadius: 14,
  padding: '14px 16px', fontSize: 16.5, color: C.INK, outline: 'none',
})
const darkField = (C) => ({ ...field(C), background: alpha('#FFFFFF', 0.12), border: `1.5px solid ${alpha(C.CREAM, 0.35)}`, color: C.CREAM })
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 16, fontWeight: 700, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.GREEN : '#FFFFFF', color: on ? C.CREAM : C.GREEN_D, border: `1.5px solid ${on ? C.GREEN : C.LINE}`,
}))
const darkBtn = (C) => ((on) => ({ ...btn(C)(on), background: on ? C.CREAM : 'transparent', color: on ? C.GREEN_D : C.CREAM, border: `1.5px solid ${on ? C.CREAM : alpha(C.CREAM, 0.5)}` }))
const suggest = (C) => ({ bg: '#FFFFFF', border: `1.5px solid ${C.LINE}`, active: alpha(C.SPROUT, 0.25), text: C.INK, table: C.RED, radius: 14 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function NovruzSemeniTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)

  return (
    <PaletteContext.Provider value={C}><div data-ns lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.CREAM, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.SPROUT, 0.45),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <SemeniOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.GREEN, border: `2px solid ${C.CREAM}`, boxShadow: `0 0 0 2px ${C.RED}, 0 8px 18px rgba(43,106,31,.4)` }}>
        {({ playing }) => <EqBars playing={playing} color={C.CREAM} idle={alpha(C.CREAM, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.CREAM, 0.94), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `3px solid ${C.RED}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 15.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 700, fontSize: 21, color: C.GREEN_D }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — xonça */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: CREAM_BG(C), padding: '30px 22px 64px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}><Xoncha grown instant width="min(78vw, 310px)" /></div>
            <div style={{ marginTop: 22, fontWeight: 700, fontSize: 14, letterSpacing: '.2em', textTransform: 'uppercase', color: C.RED }}>{L('hero', 'kicker', T.fest)}</div>
            <h1 style={{ margin: '8px 0 0', fontFamily: head, fontWeight: 700, fontSize: nameSize(heroName), lineHeight: 1.05, overflowWrap: 'anywhere', color: C.GREEN_D, animation: 'ns-rise 1s ease-out .2s both' }}>{heroName}</h1>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 10, fontSize: 17, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <div aria-hidden="true" style={{ width: 120, height: 6, margin: '18px auto 0', borderRadius: 3, background: C.RED }} />
            <div style={{ marginTop: 16, fontFamily: head, fontWeight: 700, fontSize: 'clamp(21px, 5.8vw, 25px)', color: C.INK }}>{inv.fullDate}</div>
            <div style={{ marginTop: 6, fontSize: 16.5, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            <p style={{ margin: '18px auto 0', maxWidth: 330, fontSize: 17, lineHeight: 1.55, color: C.INK }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — yumurtalar */}
          {S.countdown && (
            <Panel section="countdown" head={head} dark title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 380, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Egg size="100%" i={i}>
                      <span style={{ display: 'inline-block', padding: '2px 6px', borderRadius: 8, background: alpha('#FFFFFF', 0.9), fontFamily: head, fontWeight: 700, fontSize: 'clamp(17px, 5vw, 23px)', lineHeight: 1.1, color: C.INK, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                    </Egg>
                    <div style={{ marginTop: 10, fontWeight: 700, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: C.SPROUT_L }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: 6, borderRadius: 26, background: COPPER_GRAD(C), boxShadow: '0 22px 34px -22px rgba(36,51,28,.6)' }}>
                <div style={{ borderRadius: 20, overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.RED} height="clamp(240px, 66vw, 300px)"
                    map={{ opacity: 0.92, filter: 'saturate(.9)', tintOpacity: 0.1, tint: C.SPROUT, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(240px, 66vw, 300px)', position: 'relative', background: CREAM_BG(C) }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 700, fontSize: 26, lineHeight: 1.2, color: C.GREEN_D }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 6, fontSize: 16, color: C.MUTED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} />
            </Panel>
          )}

          {/* PROQRAM — cücərtilər */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 400, margin: '0 auto', display: 'grid', gap: 12 }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 64px minmax(0, 1fr)', gap: 8, alignItems: 'center', padding: '12px 16px 12px 10px', borderRadius: 18, background: '#FFFFFF', boxShadow: `inset 4px 0 0 ${i % 2 ? C.RED : C.GREEN}, 0 10px 18px -14px rgba(36,51,28,.45)` }}>
                    <Sprout size={28} style={{ justifySelf: 'center' }} />
                    <div style={{ fontFamily: head, fontWeight: 700, fontSize: 18, color: C.RED, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    <div style={{ fontSize: 16.5, fontWeight: 700, lineHeight: 1.3, color: C.INK }}>{ev.label}</div>
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

          {/* MASA — böyük yumurta */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} dark title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="ns-seat-list" field={darkField(C)} suggest={suggest(C)} font={body} muted={alpha(C.CREAM, 0.78)} accent={C.CREAM}
                nameStyle={{ fontFamily: head, fontWeight: 700, fontSize: 26, color: C.CREAM }}
                card={(num) => (
                  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
                    <Egg size={170} i={2}>
                      <div style={{ padding: '8px 18px', borderRadius: 16, background: alpha('#FFFFFF', 0.92), boxShadow: '0 4px 10px -4px rgba(0,0,0,.25)' }}>
                        <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', color: C.MUTED }}>{T.table}{' '}</div>
                        <div style={{ fontFamily: head, fontWeight: 700, fontSize: tableSize(num, 46), lineHeight: 1, color: C.RED }}>{num}</div>
                      </div>
                    </Egg>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 32 }} />}
              <PhotoQr inv={inv} tr={tr} fg={C.GREEN_D} bg="#FFFFFF" frame={{ borderRadius: 18, border: `2px solid ${C.SPROUT}` }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'night')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: C.LINE, hair: alpha(C.LINE, 0.7), accent: C.GREEN,
                font: body, display: head, displayItalic: false, btnFont: head,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Egg size={46} i={1} /></div>,
                marker: (a) => (a ? <Sprout size={18} /> : <span style={{ display: 'block', width: 15, height: 15, borderRadius: '50%', border: `2px solid ${C.LINE}` }} />),
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* TƏBRİKLƏR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField(C)} btn={darkBtn(C)} errorColor={C.SPROUT_L} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ position: 'relative', margin: 0, padding: '18px 18px 14px 60px', borderRadius: 20, background: C.CREAM, color: C.INK }}>
                      <div style={{ position: 'absolute', left: 16, top: 16 }}><Egg size={30} i={i} /></div>
                      <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.5 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, fontFamily: head, fontWeight: 700, fontSize: 15.5, color: C.GREEN_D }}>
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
    </div></PaletteContext.Provider>
  )
}

function MapPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -15, top: -34, filter: 'drop-shadow(0 6px 6px rgba(0,0,0,.3))' }}><Egg size={30} i={0} /></span>
    </span>
  )
}
