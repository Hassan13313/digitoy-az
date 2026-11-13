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
import { C as PAL, GOLD_GRAD, ROSE_GRAD, BLUSH_BG, WINE_BG, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Bottle, Coupe, Bubbles, Sash } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../../../_shared/palette'
import FilmReel from '../../../_shared/FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   PINK CHAMPAGNE — «Çəhrayı şampan» (Qız gecəsi konsepti, 2026-10)

   Konsept: gəlinin qız gecəsi — çəhrayı şampan, qabarcıqlar, «Gəlin olacaq»
   lenti. Açılışda zərli folqalı butulka dayanıb; toxunanda tıxac atılır,
   çəhrayı-ağ köpük havaya səpələnir. Daxildə: qabarcıqlarda sayğac, bokal
   nişanlı proqram, fiyonklu masa kartı, tünd şərab rəngli arzular bölməsi.
   Şriftlər: Playfair Display (italik başlıq) · Montserrat (mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('pink-champagne')
const ID = 'pink-champagne'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['ROSE'], secondary: ['WINE'], accent: ['GOLD'], background: ['BLUSH'], text: ['INK'] }

const KEYFRAMES = (C) => (`
@keyframes pc-rise { from { transform: translateY(0) } to { transform: translateY(-120vh) } }
@keyframes pc-in { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes pc-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes pc-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes pc-foam { 0% { opacity: 1; transform: translate(0, 0) scale(.4) } 100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(1.1) } }
@keyframes pc-wiggle { 0%,100% { transform: rotate(-4deg) } 50% { transform: rotate(4deg) } }
@keyframes pc-clink { 0%,100% { transform: rotate(var(--r)) } 50% { transform: rotate(calc(var(--r) * .4)) } }
[data-pc] span[aria-hidden="true"], [data-pc] svg[aria-hidden="true"], [data-pc] div[aria-hidden="true"] { pointer-events: none; }
[data-pc] ::placeholder { color: rgba(142,107,117,.7); }
[data-pc] [data-dark] ::placeholder { color: rgba(249,227,231,.5); }
[data-pc] input:focus-visible, [data-pc] textarea:focus-visible { border-color: ${C.ROSE} !important; outline: none; }
[data-pc] button:focus-visible, [data-pc] a:focus-visible, [data-pc] [role="button"]:focus-visible { outline: 2px solid ${C.ROSE_D}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-pc] *, [data-pc] { animation: none !important; transition: none !important; } }
`)

/* ═══ 01 — AÇILIŞ: tıxac atılır ═══ */
function PopOpening({ inv, theme }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  const T = inv.copy(TXT)
  return (
    <motion.div {...gate.gateProps} data-pc
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: BLUSH_BG(C), color: C.INK, fontFamily: theme.fonts.body }}>
      <Bubbles />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ animation: 'pc-in 1s ease-out .2s both' }}>
          {ot.show('kicker') && <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '.3em', textTransform: 'uppercase', color: C.ROSE_D }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 6, fontFamily: head, fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(48px, 15vw, 70px)', lineHeight: 1.04, overflowWrap: 'anywhere', color: C.WINE }}>
              {first}{second && <> {ot.text('and')} {second}</>}
            </div>
          )}
          <Sash text={T.bride} font={head} style={{ marginTop: 10 }} />
        </div>
        <div style={{ position: 'relative', marginTop: 30, transformOrigin: '50% 100%', animation: go ? 'none' : 'pc-wiggle 2.4s ease-in-out infinite', transform: go ? 'rotate(14deg)' : 'none', transition: 'transform .2s ease' }}>
          <Bottle size={96} popped={go} label={(
            <EmblemSlot mono={ot.mono} size={40} border="none" background="transparent" color={C.WINE} font={head} style={{ animation: 'none', margin: 0, fontSize: 14 }}>
              <span style={{ fontFamily: head, fontStyle: 'italic', fontSize: 13, color: C.WINE }}>{T.cheers}</span>
            </EmblemSlot>
          )} />
        </div>
        <div style={{ marginTop: 18, animation: 'pc-in 1s ease-out .35s both' }}>
          {ot.show('meta') && <div style={{ fontSize: 15, color: C.MUTED }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.25 }} style={{ marginTop: 18 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: ROSE_GRAD(C), color: '#FFFFFF', fontSize: 15, fontWeight: 600, letterSpacing: '.06em', boxShadow: '0 14px 26px -12px rgba(194,84,112,.7)', animation: 'pc-in .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 13.5, color: C.MUTED, animation: 'pc-fade .8s ease-out 1.1s both, pc-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dark = false }) {
  const C = usePalette(PAL)
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? WINE_BG(C) : BLUSH_BG(C), color: dark ? C.BLUSH : C.INK }}>
      {dark && <Bubbles color="rgba(255,255,255,.18)" ring="rgba(243,163,181,.35)" />}
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 6 }}>
              <span style={{ '--r': '-14deg', animation: 'pc-clink 2.6s ease-in-out infinite' }}><Coupe size={30} tilt={-14} /></span>
              <span style={{ '--r': '14deg', animation: 'pc-clink 2.6s ease-in-out infinite' }}><Coupe size={30} tilt={14} /></span>
            </div>
            {kicker && <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 600, letterSpacing: '.28em', textTransform: 'uppercase', color: dark ? C.GOLD_L : C.ROSE_D }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontStyle: 'italic', fontWeight: 500, fontSize: scaleFont('clamp(32px, 9.4vw, 44px)', C.hs), lineHeight: 1.1, textWrap: 'balance', color: dark ? C.BLUSH : C.WINE }}>{title}</h2>}
            {sub && <p style={{ margin: '10px auto 0', maxWidth: 340, fontSize: 15.5, color: dark ? alpha(C.BLUSH, 0.75) : C.MUTED, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: '#FFFFFF', border: `1.5px solid ${C.LINE}`, borderRadius: 999,
  padding: '14px 20px', fontSize: 16, color: C.INK, outline: 'none',
})
const darkField = (C) => ({ ...field(C), borderRadius: 18, background: alpha('#FFFFFF', 0.08), border: `1.5px solid ${alpha(C.BLUSH, 0.3)}`, color: C.BLUSH })
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 14.5, fontWeight: 600, letterSpacing: '.04em', textDecoration: 'none', cursor: 'pointer',
  background: on ? ROSE_GRAD(C) : '#FFFFFF', color: on ? '#FFFFFF' : C.WINE, border: `1.5px solid ${on ? C.ROSE : C.LINE}`,
}))
const darkBtn = (C) => ((on) => ({ ...btn(C)(on), background: on ? GOLD_GRAD(C) : 'transparent', color: on ? C.WINE_D : C.BLUSH, border: `1.5px solid ${on ? C.GOLD : alpha(C.BLUSH, 0.4)}` }))
const suggest = (C) => ({ bg: '#FFFFFF', border: `1.5px solid ${C.LINE}`, active: alpha(C.ROSE, 0.15), text: C.INK, table: C.ROSE_D, radius: 18 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function PinkChampagneTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)

  return (
    <PaletteContext.Provider value={C}><div data-pc lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.BLUSH, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.ROSE, 0.4),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <PopOpening inv={inv} theme={theme} lang={lang} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: ROSE_GRAD(C), boxShadow: '0 10px 22px rgba(194,84,112,.45)' }}>
        {({ playing }) => <EqBars playing={playing} color="#FFFFFF" idle={alpha('#FFFFFF', 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.BLUSH, 0.92), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${C.LINE}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontStyle: 'italic', fontWeight: 500, fontSize: 22, color: C.WINE }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — butulka, bokal, lent */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: BLUSH_BG(C), padding: '30px 22px 64px', textAlign: 'center' }}>
            <Bubbles />
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 6 }}>
              <Coupe size={74} tilt={-12} style={{ marginBottom: 4 }} />
              <Bottle size={78} popped={false} />
              <Coupe size={74} tilt={12} style={{ marginBottom: 4 }} />
            </div>
            <div style={{ position: 'relative', marginTop: 22, fontSize: 12.5, fontWeight: 600, letterSpacing: '.3em', textTransform: 'uppercase', color: C.ROSE_D }}>{L('hero', 'kicker', inv.eventLabel)}</div>
            <h1 style={{ position: 'relative', margin: '4px 0 0', fontFamily: head, fontStyle: 'italic', fontWeight: 500, fontSize: nameSize(heroName), lineHeight: 1.04, overflowWrap: 'anywhere', color: C.WINE, animation: 'pc-in 1s ease-out .2s both' }}>{heroName}</h1>
            <Sash text={T.bride} font={head} style={{ marginTop: 10 }} />
            <div style={{ position: 'relative', marginTop: 20, fontFamily: head, fontWeight: 600, fontSize: 'clamp(19px, 5.4vw, 23px)', color: C.INK }}>{inv.fullDate}</div>
            <div style={{ position: 'relative', marginTop: 6, fontSize: 14.5, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ position: 'relative', marginTop: 6, fontSize: 14.5, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <p style={{ position: 'relative', margin: '18px auto 0', maxWidth: 320, fontFamily: head, fontStyle: 'italic', fontSize: 18, lineHeight: 1.55, color: C.WINE }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — qabarcıqlar */}
          {S.countdown && (
            <Panel section="countdown" head={head} dark title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <div key={l} style={{ textAlign: 'center', transform: `translateY(${[0, -10, 4, -6][i]}px)` }}>
                    <div style={{ aspectRatio: '1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 34% 28%, rgba(255,255,255,.9) 0 8%, rgba(243,163,181,.55) 30%, rgba(194,84,112,.35) 70%)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.55), 0 12px 20px -10px rgba(0,0,0,.4)' }}>
                      <span style={{ fontFamily: head, fontWeight: 700, fontSize: 'clamp(22px, 6.6vw, 30px)', lineHeight: 1, color: '#FFFFFF', textShadow: '0 2px 6px rgba(62,15,28,.4)', fontVariantNumeric: 'lining-nums tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 11, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: C.GOLD_L }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: 4, borderRadius: 30, background: GOLD_GRAD(C), boxShadow: '0 24px 36px -22px rgba(92,26,43,.5)' }}>
                <div style={{ borderRadius: 26, overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.ROSE_D} height="clamp(240px, 66vw, 300px)"
                    map={{ opacity: 0.92, filter: 'saturate(.8)', tintOpacity: 0.14, tint: C.ROSE, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(240px, 66vw, 300px)', position: 'relative', background: BLUSH_BG(C) }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontStyle: 'italic', fontWeight: 500, fontSize: 28, lineHeight: 1.2, color: C.WINE }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 6, fontSize: 12.5, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: C.ROSE_D }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} />
            </Panel>
          )}

          {/* PROQRAM */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 400, margin: '0 auto', display: 'grid', gap: 12 }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 62px minmax(0, 1fr)', gap: 8, alignItems: 'center', padding: '12px 18px 12px 10px', borderRadius: 999, background: '#FFFFFF', boxShadow: '0 10px 20px -14px rgba(92,26,43,.4)' }}>
                    <Coupe size={28} tilt={i % 2 ? 10 : -10} style={{ justifySelf: 'center' }} />
                    <div style={{ fontFamily: head, fontWeight: 700, fontSize: 17, color: C.ROSE_D, fontVariantNumeric: 'lining-nums tabular-nums' }}>{ev.time}</div>
                    <div style={{ fontSize: 15.5, fontWeight: 500, lineHeight: 1.3, color: C.INK }}>{ev.label}</div>
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

          {/* MASA — fiyonklu kart */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} dark title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="pc-seat-list" field={darkField(C)} suggest={suggest(C)} font={body} muted={alpha(C.BLUSH, 0.75)} accent={C.GOLD_L}
                nameStyle={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}
                card={(num) => (
                  <div style={{ position: 'relative', maxWidth: 290, margin: '34px auto 0', padding: 4, borderRadius: 20, background: GOLD_GRAD(C), boxShadow: '0 24px 34px -18px rgba(0,0,0,.7)' }}>
                    <svg aria-hidden="true" viewBox="0 0 120 80" width="96" style={{ position: 'absolute', left: '50%', top: -36, marginLeft: -48, overflow: 'visible', zIndex: 2 }}>
                      <path d="M60 40C44 14 14 14 16 34C18 52 40 54 60 44ZM60 40C76 14 106 14 104 34C102 52 80 54 60 44Z" fill="#F3A3B5" stroke="#C25470" strokeWidth="1.5" />
                      <path d="M54 46L40 78L50 72L56 80L60 48ZM66 46L80 78L70 72L64 80L60 48Z" fill={C.ROSE} />
                      <circle cx="60" cy="42" r="7" fill={C.ROSE} stroke="#C25470" strokeWidth="1.5" />
                    </svg>
                    <div style={{ padding: '32px 18px 24px', borderRadius: 17, background: C.CREAM, color: C.INK, textAlign: 'center' }}>
                      <div style={{ fontFamily: head, fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(24px, 7vw, 30px)', lineHeight: 1.15, color: C.WINE, overflowWrap: 'anywhere' }}>{seating.selected?.full_name}</div>
                      <div style={{ width: 46, height: 1.5, margin: '12px auto', background: GOLD_GRAD(C) }} />
                      <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '.26em', textTransform: 'uppercase', color: C.MUTED }}>{T.table}{' '}</div>
                      <div style={{ fontFamily: head, fontWeight: 700, fontSize: tableSize(num, 60), lineHeight: 1, color: C.ROSE_D, fontVariantNumeric: 'lining-nums' }}>{num}</div>
                    </div>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 32 }} />}
              <PhotoQr inv={inv} tr={tr} fg={C.WINE} bg="#FFFFFF" frame={{ borderRadius: 20, border: `2px solid ${C.BLUSH_D}` }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'night')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: C.LINE, hair: alpha(C.LINE, 0.7), accent: C.ROSE_D,
                font: body, display: head, displayItalic: true, btnFont: body,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Coupe size={40} tilt={-12} /><Coupe size={40} tilt={12} /></div>,
                marker: (a) => <span style={{ display: 'block', width: 15, height: 15, borderRadius: '50%', border: `2px solid ${a ? C.ROSE : C.LINE}`, background: a ? ROSE_GRAD(C) : 'transparent' }} />,
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField(C)} btn={darkBtn(C)} errorColor={C.GOLD_L} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '20px 22px 16px', borderRadius: 22, background: C.CREAM, color: C.INK, boxShadow: '0 14px 22px -14px rgba(0,0,0,.6)' }}>
                      <blockquote style={{ margin: 0, fontFamily: head, fontStyle: 'italic', fontSize: 18.5, lineHeight: 1.5, color: C.WINE }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 10, fontSize: 12, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: C.ROSE_D }}>
                        {msg.name}{msg.date ? <span style={{ fontWeight: 400, letterSpacing: '.04em', textTransform: 'none', color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}
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
      <span style={{ position: 'absolute', left: -20, top: -46, filter: 'drop-shadow(0 6px 6px rgba(0,0,0,.3))' }}><Coupe size={40} /></span>
    </span>
  )
}
