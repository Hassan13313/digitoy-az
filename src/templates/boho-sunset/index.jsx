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
import { C, BANDS, CREAM_BG, DUSK_BG, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { SunArch, Pampas, Rainbow, HalfSun } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   BOHO SUNSET — «Gün batımı» (Qız gecəsi konsepti, 2026-10)

   Konsept: boho üslubunda gün batımı — terrakota göy qurşağı tağı, qum
   təpələri, küləkdə yellənən pampas otu, makrame ipi. Açılışda tağın
   içində günəş üfüqdədir; toxunanda günəş təpələrin arxasına batır, səma
   bənövşəyiyə çalır, ulduzlar və aypara çıxır — gecə başlayır. Daxildə:
   tağ formalı sayğac, muncuqlu makrame ipində proqram, göy qurşağında masa.
   Şriftlər: Noto Serif (nazik italik, başlıq) · Alegreya Sans (mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('boho-sunset')
const ID = 'boho-sunset'

const KEYFRAMES = `
@keyframes bs-in { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes bs-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes bs-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes bs-sway { 0%,100% { transform: rotate(-3deg) } 50% { transform: rotate(3.5deg) } }
[data-bs] span[aria-hidden="true"], [data-bs] svg[aria-hidden="true"], [data-bs] div[aria-hidden="true"] { pointer-events: none; }
[data-bs] ::placeholder { color: rgba(134,105,90,.7); }
[data-bs] [data-dark] ::placeholder { color: rgba(234,217,191,.5); }
[data-bs] input:focus-visible, [data-bs] textarea:focus-visible { border-color: ${C.CLAY} !important; outline: none; }
[data-bs] button:focus-visible, [data-bs] a:focus-visible, [data-bs] [role="button"]:focus-visible { outline: 2px solid ${C.MUSTARD}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-bs] *, [data-bs] { animation: none !important; transition: none !important; } }
`

/* ═══ 01 — AÇILIŞ: gün batımı ═══ */
function SunsetOpening({ inv, theme, lang }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  const T = inv.copy(TXT)
  return (
    <motion.div {...gate.gateProps} data-bs
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: CREAM_BG, color: C.INK, fontFamily: theme.fonts.body }}>
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ animation: 'bs-in 1s ease-out .2s both' }}>
          {ot.show('kicker') && <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: '.26em', textTransform: 'uppercase', color: C.CLAY_D }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 6, fontFamily: head, fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(48px, 14vw, 66px)', lineHeight: 1.08, overflowWrap: 'anywhere', color: C.INK }}>
              {first}{second && <> {ot.text('and')} {second}</>}
            </div>
          )}
        </div>
        <div style={{ position: 'relative', marginTop: 24 }}>
          <Pampas height={210} delay={0} style={{ position: 'absolute', left: -46, bottom: -6, zIndex: 2 }} />
          <Pampas height={170} flip delay={0.8} color="#EBDCC2" style={{ position: 'absolute', left: -14, bottom: -6, zIndex: 2 }} />
          <Pampas height={190} flip delay={0.4} style={{ position: 'absolute', right: -40, bottom: -6, zIndex: 2 }} />
          <SunArch width={210} set={go} />
          <span aria-hidden="true" style={{ position: 'absolute', left: -60, right: -60, bottom: -2, height: 2, background: C.CLAY_D, opacity: 0.4 }} />
          <div style={{ position: 'absolute', left: '50%', top: 34, transform: 'translateX(-50%)', opacity: go ? 0 : 1, transition: 'opacity .4s' }}>
            <EmblemSlot mono={ot.mono} size={50} border={`1.5px solid ${C.CREAM}`} background="rgba(255,255,255,.18)" color={C.CREAM} font={head} style={{ animation: 'none', margin: 0 }}>
              <span aria-hidden="true" />
            </EmblemSlot>
          </div>
        </div>
        <div style={{ marginTop: 22, minHeight: 32, animation: 'bs-in 1s ease-out .35s both' }}>
          {go
            ? <div style={{ fontFamily: head, fontStyle: 'italic', fontWeight: 300, fontSize: 26, color: C.CLAY_D, animation: 'bs-in .5s ease-out .9s both' }}>{T.begins}</div>
            : ot.show('meta') && <div style={{ fontSize: 17, color: C.MUTED }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.25 }} style={{ marginTop: 14 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: '999px 999px 6px 6px', background: C.CLAY, color: C.CREAM, fontSize: 15, fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', boxShadow: '0 12px 22px -12px rgba(156,79,49,.7)', animation: 'bs-in .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 14, fontSize: 14.5, color: C.MUTED, animation: 'bs-fade .8s ease-out 1.1s both, bs-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dark = false }) {
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 72px', overflow: 'hidden', background: dark ? DUSK_BG : CREAM_BG, color: dark ? C.PAMPAS : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Rainbow size={46} style={{ margin: '0 auto 12px' }} />
            {kicker && <div style={{ marginBottom: 6, fontSize: 12.5, fontWeight: 500, letterSpacing: '.26em', textTransform: 'uppercase', color: dark ? C.MUSTARD : C.CLAY_D }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(34px, 10vw, 46px)', lineHeight: 1.12, textWrap: 'balance', color: dark ? C.CREAM : C.INK }}>{title}</h2>}
            {sub && <p style={{ margin: '12px auto 0', maxWidth: 340, fontSize: 17, color: dark ? alpha(C.PAMPAS, 0.8) : C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: '#FFFDF9', border: `1.5px solid ${C.LINE}`, borderRadius: 12,
  padding: '14px 16px', fontSize: 17, color: C.INK, outline: 'none',
}
const darkField = { ...field, background: alpha('#FFFFFF', 0.08), border: `1.5px solid ${alpha(C.PAMPAS, 0.35)}`, color: C.CREAM }
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 14.5, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', textDecoration: 'none', cursor: 'pointer',
  background: on ? C.CLAY : 'transparent', color: on ? C.CREAM : C.INK, border: `1.5px solid ${on ? C.CLAY : C.LINE}`,
})
const darkBtn = (on) => ({ ...btn(on), background: on ? C.MUSTARD : 'transparent', color: on ? C.DUSK : C.PAMPAS, border: `1.5px solid ${on ? C.MUSTARD : alpha(C.PAMPAS, 0.4)}` })
const suggest = { bg: '#FFFDF9', border: `1.5px solid ${C.LINE}`, active: alpha(C.ROSE, 0.25), text: C.INK, table: C.CLAY_D, radius: 12 }

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function BohoSunsetTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)

  return (
    <div data-bs lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.CREAM, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.CLAY, 0.45),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <SunsetOpening inv={inv} theme={theme} lang={lang} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '999px 999px 10px 10px', background: C.CLAY, boxShadow: '0 10px 22px rgba(156,79,49,.4)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.CREAM} idle={alpha(C.CREAM, 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.CREAM, 0.92), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${C.LINE}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 15.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontStyle: 'italic', fontWeight: 300, fontSize: 23, color: C.INK }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — tağ və pampas */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: CREAM_BG, padding: '34px 22px 66px', textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Pampas height={200} delay={0.2} style={{ position: 'absolute', left: -50, bottom: 0, zIndex: 2 }} />
              <Pampas height={160} flip delay={1} color="#EBDCC2" style={{ position: 'absolute', left: -18, bottom: 0, zIndex: 2 }} />
              <Pampas height={186} flip delay={0.6} style={{ position: 'absolute', right: -44, bottom: 0, zIndex: 2 }} />
              <SunArch width={200} />
            </div>
            <div style={{ height: 2, margin: '0 auto', maxWidth: 300, background: `linear-gradient(90deg, transparent, ${alpha(C.CLAY_D, 0.45)}, transparent)` }} />
            <div style={{ position: 'relative', marginTop: 26, fontSize: 13, fontWeight: 500, letterSpacing: '.26em', textTransform: 'uppercase', color: C.CLAY_D }}>{L('hero', 'kicker', inv.eventLabel)}</div>
            <h1 style={{ position: 'relative', margin: '6px 0 0', fontFamily: head, fontStyle: 'italic', fontWeight: 300, fontSize: nameSize(heroName), lineHeight: 1.08, overflowWrap: 'anywhere', color: C.INK, animation: 'bs-in 1s ease-out .2s both' }}>{heroName}</h1>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ position: 'relative', marginTop: 8, fontSize: 15.5, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 18 }}>
              <HalfSun size={30} color={C.MUSTARD} />
              <span style={{ fontSize: 'clamp(18px, 5vw, 21px)', fontWeight: 500, color: C.INK }}>{inv.fullDate}</span>
              <HalfSun size={30} color={C.MUSTARD} />
            </div>
            <div style={{ position: 'relative', marginTop: 6, fontSize: 16.5, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            <p style={{ position: 'relative', margin: '18px auto 0', maxWidth: 330, fontFamily: head, fontStyle: 'italic', fontWeight: 300, fontSize: 19, lineHeight: 1.55, color: C.INK }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — tağlar */}
          {S.countdown && (
            <Panel section="countdown" head={head} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ aspectRatio: '3 / 4', borderRadius: '999px 999px 8px 8px', padding: 5, background: BANDS[i] }}>
                      <div style={{ height: '100%', borderRadius: '999px 999px 5px 5px', border: `1.5px solid ${alpha('#FFFFFF', 0.55)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '18%' }}>
                        <span style={{ fontFamily: head, fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(26px, 7.8vw, 36px)', lineHeight: 1, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums lining-nums' }}><PopDigit value={v} pop={pop} /></span>
                      </div>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 12, fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', color: C.MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN — tağ çərçivə */}
          {S.venue && (
            <Panel section="venue" head={head} dark title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 400, margin: '0 auto', padding: 7, borderRadius: '999px 999px 14px 14px', background: `linear-gradient(180deg, ${C.CLAY}, ${C.ROSE})` }}>
                <div style={{ borderRadius: '999px 999px 9px 9px', overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.CLAY_D} height="clamp(300px, 86vw, 380px)"
                    map={{ opacity: 0.92, filter: 'sepia(.25) saturate(.8)', tintOpacity: 0.18, tint: C.ROSE, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(300px, 86vw, 380px)', position: 'relative', background: C.DUSK_L }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontStyle: 'italic', fontWeight: 300, fontSize: 32, lineHeight: 1.15, color: C.CREAM }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 6, fontSize: 13, fontWeight: 500, letterSpacing: '.22em', textTransform: 'uppercase', color: C.MUSTARD }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={darkBtn} />
            </Panel>
          )}

          {/* PROQRAM — makrame ipi və muncuqlar */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ position: 'relative', maxWidth: 380, margin: '0 auto', paddingLeft: 52 }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: 22, top: -10, bottom: -10, width: 5, borderRadius: 3, background: `repeating-linear-gradient(160deg, #E3CBA6 0 4px, #CBAE84 4px 7px)` }} />
                <div style={{ display: 'grid', gap: 22 }}>
                  {timeline.events.map((ev, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <span aria-hidden="true" style={{ position: 'absolute', left: -40, top: 2, width: 22, height: 22, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, ${alpha('#FFFFFF', 0.7)}, ${BANDS[i % 4]} 60%)`, boxShadow: '0 3px 6px rgba(74,47,36,.25)' }} />
                      <div style={{ fontFamily: head, fontStyle: 'italic', fontWeight: 300, fontSize: 24, lineHeight: 1.1, color: C.CLAY_D, fontVariantNumeric: 'lining-nums' }}>{ev.time}</div>
                      <div style={{ marginTop: 2, fontSize: 17.5, lineHeight: 1.35, color: C.INK }}>{ev.label}</div>
                    </div>
                  ))}
                </div>
                <span aria-hidden="true" style={{ position: 'absolute', left: 13, bottom: -44, width: 24, height: 30, background: `repeating-linear-gradient(90deg, #CBAE84 0 2px, transparent 2px 5px)`, borderRadius: '2px 2px 10px 10px' }} />
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={body} align="center" />
            </Panel>
          )}

          {/* MASA — göy qurşağı */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} dark title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="bs-seat-list" field={darkField} suggest={suggest} font={body} muted={alpha(C.PAMPAS, 0.8)} accent={C.MUSTARD}
                nameStyle={{ fontFamily: head, fontStyle: 'italic', fontWeight: 300, fontSize: 32, color: C.CREAM }}
                card={(num) => (
                  <div style={{ position: 'relative', width: 'min(100%, 260px)', margin: '24px auto 0', aspectRatio: '1 / .62' }}>
                    {BANDS.map((c, i) => (
                      <span key={i} aria-hidden="true" style={{ position: 'absolute', left: `${i * 6}%`, right: `${i * 6}%`, top: `${i * 9.6}%`, bottom: 0, borderRadius: '999px 999px 0 0', background: c }} />
                    ))}
                    <div style={{ position: 'absolute', left: '24%', right: '24%', top: '38.4%', bottom: 0, borderRadius: '999px 999px 0 0', background: C.CREAM, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: '.22em', textTransform: 'uppercase', color: C.CLAY_D }}>{T.table}{' '}</span>
                      <span style={{ fontFamily: head, fontStyle: 'italic', fontWeight: 300, fontSize: tableSize(num, 52), lineHeight: 1, color: C.INK, fontVariantNumeric: 'lining-nums' }}>{num}</span>
                    </div>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR — tağ çərçivələr */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16, marginBottom: 32 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ position: 'relative', aspectRatio: '3 / 4', marginTop: i % 2 ? 24 : 0 }}>
                      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, transform: 'translate(7px, 7px)', borderRadius: '999px 999px 10px 10px', border: `1.5px solid ${BANDS[i % 4]}` }} />
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '999px 999px 10px 10px' }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.INK} bg="#FFFDF9" frame={{ borderRadius: '90px 90px 12px 12px', border: `1.5px solid ${C.CLAY}` }}
                btn={btn} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'night')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: C.LINE, hair: alpha(C.LINE, 0.8), accent: C.CLAY,
                font: body, display: head, displayItalic: true, btnFont: body,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><Rainbow size={64} /></div>,
                marker: (a) => (a ? <HalfSun size={22} color={C.CLAY} /> : <span style={{ display: 'block', width: 16, height: 16, borderRadius: '50%', border: `1.5px solid ${C.LINE}` }} />),
                suggest: { ...suggest, font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR — kraft kağız etiketlər */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField} btn={darkBtn} errorColor={C.MUSTARD} />
              <div style={{ display: 'grid', gap: 18 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ position: 'relative', margin: 0, padding: '18px 20px 14px 46px', borderRadius: '6px 18px 18px 6px', background: C.KRAFT, color: C.INK, boxShadow: '0 14px 22px -14px rgba(0,0,0,.6)' }}>
                      <span aria-hidden="true" style={{ position: 'absolute', left: 16, top: 20, width: 12, height: 12, borderRadius: '50%', background: C.DUSK, boxShadow: `0 0 0 3px ${alpha('#FFFFFF', 0.5)}` }} />
                      <blockquote style={{ margin: 0, fontSize: 17, lineHeight: 1.5 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, fontFamily: head, fontStyle: 'italic', fontWeight: 300, fontSize: 19, color: C.CLAY_D }}>
                        — {msg.name}{msg.date ? <span style={{ fontFamily: body, fontStyle: 'normal', fontSize: 13, color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}
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
      <span style={{ position: 'absolute', left: -22, top: -26, filter: 'drop-shadow(0 3px 5px rgba(0,0,0,.35))' }}><HalfSun size={44} color={C.CLAY} /></span>
    </span>
  )
}
