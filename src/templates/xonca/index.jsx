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
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Star8, Engraving, Xonca, CandleStick } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'
import FilmReel from '../_shared/FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   XONÇA — «Şamlı xonça» (Xına gecəsi konsepti, 2026-10)

   Konsept: xına gecəsinin mərkəzi — şamlarla bəzənmiş mis xonça, ortasında
   xına kasası, ətrafında şirniyyat, önündə qırmızı lent. Açılışda şamlar
   sönükdür; toxunanda hər şam öz növbəsi ilə alışır və otaq isinir.
   Daxildə:
     sayğac    → dörd mis nəlbəki
     məkan     → dəyirmi mis məcməyi çərçivəsində xəritə
     proqram   → şamdanlar — gecə keçdikcə şam əriyib qısalır
     masa      → mis boşqab, üstündə qırmızı lent
     fotolar   → dəyirmi mis çərçivələr
   Şriftlər: Alegreya (başlıq) · Alegreya Sans (mətn) — ikisində də Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('xonca')
const ID = 'xonca'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['COPPER'], secondary: ['WALNUT'], accent: ['BRASS'], background: ['IVORY'], text: ['INK'] }

const KEYFRAMES = (C) => (`
@keyframes xc-flame { from { transform: scaleY(.86) rotate(-2deg) } to { transform: scaleY(1.1) rotate(2deg) } }
@keyframes xc-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes xc-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes xc-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes xc-plate { 0% { transform: rotate(-30deg) scale(.7); opacity: 0 } 70% { transform: rotate(4deg) scale(1.03) } 100% { transform: none; opacity: 1 } }
[data-xc] span[aria-hidden="true"], [data-xc] svg[aria-hidden="true"], [data-xc] div[aria-hidden="true"] { pointer-events: none; }
[data-xc] ::placeholder { color: rgba(122,95,76,.6); }
[data-xc] [data-dark] ::placeholder { color: rgba(246,234,216,.45); }
[data-xc] input:focus-visible, [data-xc] textarea:focus-visible { border-color: ${C.COPPER} !important; outline: none; }
[data-xc] button:focus-visible, [data-xc] a:focus-visible, [data-xc] [role="button"]:focus-visible { outline: 2px solid ${C.BRASS}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-xc] *, [data-xc] { animation: none !important; transition: none !important; } }
`)

const DARK_BG = (C) => (`radial-gradient(90% 60% at 50% 30%, rgba(227,160,108,.16), transparent 70%), linear-gradient(180deg, ${C.WALNUT_L}, ${C.WALNUT})`)
const LIGHT_BG = (C) => (`radial-gradient(80% 50% at 50% 0%, #FFF8EC, transparent 70%), ${C.IVORY}`)

/* ═══ 01 — AÇILIŞ: şamlar alışır ═══ */
function XoncaOpening({ inv, theme }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-xc
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: `radial-gradient(70% 45% at 50% 72%, #3E2214, ${C.WALNUT} 70%)`, color: C.CREAM, fontFamily: theme.fonts.body }}>
      {/* otaq isinir */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(75% 55% at 50% 70%, rgba(255,190,110,.42), rgba(255,170,90,.12) 50%, transparent 75%)', opacity: go ? 1 : 0, transition: 'opacity 1.2s ease .3s' }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ animation: 'xc-rise 1s ease-out .2s both' }}>
          <EmblemSlot mono={ot.mono} size={56} border={`1px solid ${alpha(C.BRASS, 0.7)}`} background={alpha(C.COPPER_D, 0.35)} color={C.COPPER_L} font={head} style={{ animation: 'none', margin: '0 auto 14px' }}>
            <Star8 size={22} color={C.COPPER_L} style={{ margin: '0 auto' }} />
          </EmblemSlot>
          {ot.show('kicker') && <div style={{ fontFamily: head, fontStyle: 'italic', fontSize: 22, color: C.COPPER_L }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 6, fontFamily: head, fontWeight: 500, fontSize: 'clamp(44px, 13vw, 62px)', lineHeight: 1.05, color: C.CREAM, overflowWrap: 'anywhere' }}>
              {first}{second && <><span style={{ display: 'block', fontStyle: 'italic', fontSize: '.45em', color: C.COPPER_L }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 10, fontSize: 15.5, letterSpacing: '.04em', color: alpha(C.CREAM, 0.75) }}>{ot.text('meta')}</div>}
        </div>

        <div style={{ position: 'relative', width: 'min(88vw, 340px)', marginTop: 18, transform: go ? 'scale(1.06)' : 'none', transition: 'transform 1.6s ease' }}>
          <Xonca uid="xc-op" lit={go} width="100%" />
        </div>

        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: 18 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 28px', display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 999, background: `linear-gradient(180deg, ${C.COPPER_L}, ${C.COPPER})`, color: C.WALNUT, fontFamily: head, fontWeight: 500, fontSize: 18, boxShadow: '0 12px 26px -10px rgba(227,160,108,.7), inset 0 1px 0 rgba(255,255,255,.4)', animation: 'xc-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 10, fontSize: 13.5, color: alpha(C.CREAM, 0.6), animation: 'xc-fade .8s ease-out 1.1s both, xc-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dark = false }) {
  const C = usePalette(PAL)
  const mute = dark ? alpha(C.CREAM, 0.72) : C.MUTED
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? DARK_BG(C) : LIGHT_BG(C), color: dark ? C.CREAM : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Engraving color={dark ? C.BRASS : C.COPPER} width={210} />
            {title && <h2 style={{ margin: '14px 0 0', fontFamily: head, fontWeight: 500, fontSize: scaleFont('clamp(29px, 8.4vw, 38px)', C.hs), lineHeight: 1.15, color: dark ? C.CREAM : C.COPPER_D, textWrap: 'balance' }}>{title}</h2>}
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
  width: '100%', background: '#FFFBF4', border: `1px solid ${alpha(C.COPPER, 0.4)}`, borderRadius: 12,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
})
const darkField = (C) => ({ ...field(C), background: alpha('#000000', 0.25), border: `1px solid ${alpha(C.COPPER_L, 0.4)}`, color: C.CREAM })
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 15.5, fontWeight: 500, textDecoration: 'none', cursor: 'pointer',
  background: on ? `linear-gradient(180deg, ${C.COPPER_L}, ${C.COPPER})` : 'transparent', color: on ? C.WALNUT : C.COPPER_D,
  border: `1px solid ${on ? C.COPPER : alpha(C.COPPER_D, 0.45)}`,
}))
const darkBtn = (C) => ((on) => ({ ...btn(C)(on), color: on ? C.WALNUT : C.COPPER_L, border: `1px solid ${on ? C.COPPER : alpha(C.COPPER_L, 0.5)}` }))
const suggest = (C) => ({ bg: '#FFFBF4', border: `1px solid ${alpha(C.COPPER, 0.35)}`, active: alpha(C.COPPER_L, 0.25), text: C.INK, table: C.COPPER_D, radius: 12 })

/* Mis nəlbəki — sayğac */
function Bowl({ value, label, pop, head }) {
  const C = usePalette(PAL)
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', aspectRatio: '1', borderRadius: '50%', padding: '11%', background: `conic-gradient(from 210deg, #7E3F1E, #E3A06C, ${C.COPPER}, #F2B987, #7E3F1E, #C97B48, #7E3F1E)`, boxShadow: '0 14px 22px -12px rgba(60,25,10,.6)' }}>
        <div style={{ height: '100%', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 40% 35%, #D88E58, #9C552B 70%, #7E3F1E)', boxShadow: 'inset 0 3px 8px rgba(40,15,5,.55)', outline: `1px dashed ${alpha('#FFE1BC', 0.45)}`, outlineOffset: -5 }}>
          <span style={{ fontFamily: head, fontWeight: 500, fontSize: 'clamp(22px, 6.8vw, 30px)', lineHeight: 1, color: C.CREAM, textShadow: '0 1px 2px rgba(60,20,5,.6)', fontVariantNumeric: 'tabular-nums' }}><PopDigit value={value} pop={pop} /></span>
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 13.5, color: C.MUTED }}>{label}</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function XoncaTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const MAP_H = 'min(78vw, 330px)'

  return (
    <PaletteContext.Provider value={C}><div data-xc lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.WALNUT, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.COPPER_L, 0.3),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <XoncaOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: `linear-gradient(180deg, ${C.COPPER_L}, ${C.COPPER})`, border: `1px solid ${C.BRASS}`, boxShadow: '0 8px 20px rgba(34,18,11,.45)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.WALNUT} idle={alpha(C.WALNUT, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.WALNUT, 0.92), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.COPPER, 0.4)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.CREAM, 0.78), fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontStyle: 'italic', fontSize: 20, color: C.COPPER_L }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — şamlı xonça */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: `radial-gradient(70% 40% at 50% 78%, rgba(255,180,100,.28), transparent 70%), ${DARK_BG(C)}`, padding: '48px 22px 54px', textAlign: 'center', color: C.CREAM }}>
            <div style={{ fontFamily: head, fontStyle: 'italic', fontSize: 24, color: C.COPPER_L, animation: 'xc-rise .8s ease-out .2s both' }}>{L('hero', 'kicker', inv.eventLabel)}</div>
            <h1 style={{ margin: '8px 0 0', fontFamily: head, fontWeight: 500, fontSize: nameSize(heroName), lineHeight: 1.04, color: C.CREAM, overflowWrap: 'anywhere', animation: 'xc-rise 1s ease-out .35s both' }}>{heroName}</h1>
            <Engraving width={220} style={{ marginTop: 18 }} />
            <div style={{ marginTop: 16, fontFamily: head, fontSize: 'clamp(21px, 6vw, 26px)', color: C.CREAM }}>{inv.fullDate}</div>
            <div style={{ marginTop: 6, fontSize: 16.5, color: alpha(C.CREAM, 0.72) }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 15, color: alpha(C.CREAM, 0.72) }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <div style={{ width: 'min(90vw, 360px)', margin: '22px auto 0' }}>
              <Xonca uid="xc-hero" lit width="100%" />
            </div>
            <p style={{ margin: '20px auto 0', maxWidth: 330, fontFamily: head, fontStyle: 'italic', fontSize: 19, lineHeight: 1.5, color: alpha(C.CREAM, 0.8) }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — mis nəlbəkilər */}
          {S.countdown && (
            <Panel section="countdown" head={head} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                <Bowl head={head} value={cd.days} label={cd.labels.days} />
                <Bowl head={head} value={cd.hours} label={cd.labels.hours} />
                <Bowl head={head} value={cd.minutes} label={cd.labels.minutes} />
                <Bowl head={head} value={cd.seconds} label={cd.labels.seconds} pop />
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN — dəyirmi məcməyi */}
          {S.venue && (
            <Panel section="venue" head={head} dark title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ width: `calc(${MAP_H} + 28px)`, maxWidth: '100%', margin: '0 auto', padding: 14, borderRadius: '50%', background: `conic-gradient(from 200deg, #7E3F1E, #E3A06C, ${C.COPPER}, #F2B987, #7E3F1E, #C97B48, #7E3F1E)`, boxShadow: '0 26px 40px -22px rgba(0,0,0,.8)', outline: `2px dotted ${alpha(C.BRASS, 0.8)}`, outlineOffset: -7 }}>
                <div style={{ borderRadius: '50%', overflow: 'hidden', isolation: 'isolate', aspectRatio: '1' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.COPPER_D} height={MAP_H}
                    map={{ opacity: 0.85, filter: 'sepia(.35) saturate(.85)', tintOpacity: 0.18, tint: C.COPPER, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: MAP_H, position: 'relative', background: `radial-gradient(circle, ${C.IVORY}, ${C.SAND})` }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 500, fontSize: 26, lineHeight: 1.2, color: C.CREAM }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 15.5, color: alpha(C.CREAM, 0.7) }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={darkBtn(C)} />
            </Panel>
          )}

          {/* PROQRAM — əriyən şamlar */}
          {S.program && (
            <Panel section="program" head={head} dark title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 380, margin: '0 auto', display: 'grid', gap: 4 }}>
                {timeline.events.map((ev, i) => {
                  const n = timeline.events.length
                  const h = Math.round(52 - (i / Math.max(1, n - 1)) * 34)
                  return (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr)', gap: 16, alignItems: 'end', padding: '10px 0', borderBottom: i < n - 1 ? `1px dotted ${alpha(C.COPPER_L, 0.3)}` : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', height: 86, alignItems: 'flex-end' }}><CandleStick h={h} /></div>
                      <div style={{ paddingBottom: 8 }}>
                        <div style={{ fontFamily: head, fontStyle: 'italic', fontSize: 19, color: C.COPPER_L, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                        <div style={{ marginTop: 2, fontSize: 17.5, lineHeight: 1.35, color: C.CREAM }}>{ev.label}</div>
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

          {/* MASA — lentli mis boşqab */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="xc-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={C.MUTED} accent={C.COPPER_D}
                nameStyle={{ fontFamily: head, fontStyle: 'italic', fontSize: 24 }}
                card={(num) => (
                  <div style={{ position: 'relative', width: 190, height: 190, margin: '8px auto 0', animation: 'xc-plate .8s cubic-bezier(.3,.8,.4,1) both' }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `conic-gradient(from 200deg, #7E3F1E, #E3A06C, ${C.COPPER}, #F2B987, #7E3F1E, #C97B48, #7E3F1E)`, boxShadow: '0 20px 30px -14px rgba(60,25,10,.65)', outline: `2px dotted ${alpha(C.BRASS, 0.9)}`, outlineOffset: -8 }} />
                    <div style={{ position: 'absolute', inset: 22, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #E9A570, #A75C30 70%, #7E3F1E)', boxShadow: 'inset 0 4px 10px rgba(40,15,5,.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 13, letterSpacing: '.24em', textTransform: 'uppercase', color: alpha(C.CREAM, 0.85) }}>{T.table}</span>
                      <span style={{ fontFamily: head, fontWeight: 500, fontSize: tableSize(num, 64), lineHeight: 1, color: C.CREAM, textShadow: '0 2px 2px rgba(60,20,5,.55)' }}>{num}</span>
                    </div>
                    <svg aria-hidden="true" viewBox="-40 -14 80 40" width="86" style={{ position: 'absolute', left: '50%', top: -16, marginLeft: -43 }}>
                      <path d="M0 0c-10-10-28-12-30-4s18 8 30 4zM0 0c10-10 28-12 30-4s-18 8-30 4z" fill={C.RIBBON} />
                      <path d="M0 0l-12 20M0 0l10 22" stroke={C.RIBBON} strokeWidth="4" strokeLinecap="round" />
                      <circle r="4.5" fill="#C93A47" />
                    </svg>
                  </div>
                )} />
              <div style={{ height: 8 }} />
            </Panel>
          )}

          {/* FOTOLAR — dəyirmi mis çərçivələr */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} dark title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 32 }} />}
              <PhotoQr inv={inv} tr={tr} fg={C.WALNUT} bg="#FFF6E8" frame={{ borderRadius: 18, boxShadow: `0 0 0 4px ${C.COPPER}, 0 0 0 6px ${alpha(C.BRASS, 0.6)}` }}
                btn={darkBtn(C)} muted={alpha(C.CREAM, 0.72)} desc={galleryDesc(props.adminOverrides, tr, lang, 'night')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.COPPER, 0.5), hair: alpha(C.COPPER, 0.25), accent: C.COPPER_D,
                font: body, display: head, btnFont: body,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><CandleStick h={30} /></div>,
                marker: (a) => (a ? <Star8 size={13} color={C.COPPER_D} fill={alpha(C.COPPER_L, 0.6)} /> : <span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', border: `1px solid ${alpha(C.COPPER_D, 0.5)}` }} />),
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField(C)} btn={darkBtn(C)} errorColor={C.COPPER_L} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, display: 'grid', gridTemplateColumns: '22px minmax(0, 1fr)', gap: 14, padding: '18px 18px 16px', borderRadius: 14, background: alpha('#000000', 0.2), border: `1px solid ${alpha(C.COPPER_L, 0.28)}` }}>
                      <Star8 size={18} color={C.COPPER_L} style={{ marginTop: 4 }} />
                      <div>
                        <blockquote style={{ margin: 0, fontFamily: head, fontStyle: 'italic', fontSize: 18.5, lineHeight: 1.5, color: C.CREAM }}>{msg.text}</blockquote>
                        <figcaption style={{ marginTop: 8, fontSize: 14, color: C.COPPER_L }}>{msg.name}{msg.date ? <span style={{ color: alpha(C.CREAM, 0.55) }}> · {gbook.formatDate(msg.date)}</span> : null}</figcaption>
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
      <span style={{ position: 'absolute', left: -15, top: -82 }}><CandleStick h={34} /></span>
      <span style={{ position: 'absolute', left: -5, top: -5, width: 10, height: 10, borderRadius: '50%', background: C.RIBBON, boxShadow: `0 0 0 3px ${C.CREAM}` }} />
    </span>
  )
}
