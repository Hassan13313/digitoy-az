import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../_shared/MapSection'
import { MonoContent } from '../_shared/MonoContent'
import { Reveal, PopDigit, enterDirection } from '../_shared/motion'
import { hidePhoto } from '../../utils/photoGallery'
import { getTemplateTheme } from '../templateConfig'
import { useInvitation, useGate, openingNames, seatInputProps, alpha } from '../_shared/useInvitation'
import { MusicFab, EqBars, SeatSuggest, StoryBlock, InvitationEnd, ReplyForm } from '../_shared/invitationKit'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   WHITE ELEGANCE — «Pambıq kağız, rəngsiz qabartma» (premium redizayn, 2026-10)

   Konsept: ən bahalı dəftərxananın dili — boyasız qabartma (blind emboss),
   basma (deboss), cırılmış kənarlı (deckle) pambıq kağız, üst-üstə qoyulmuş
   kalka (vellum). Rəng demək olar yoxdur: forma yalnız işıq və kölgə ilə
   oxunur. Düzülüş mərkəzdə, boşluq bol.

   Bölmələrin şablona məxsus forması:
     açılış   → stol üstündə qabartma monoqramlı kart; üzərindən yan işıq
                keçir; toxunanda kart əldə qaldırılır
     hero     → cırıq kənarlı böyük kart, basma çərçivə
     sayğac   → dörd qabartma möhür (rəngsiz disklər)
     proqram  → kartın üstünə qoyulmuş kalka vərəq
     masa     → qatlanmış yer kartı, qabartma nömrə
     RSVP     → cırıq kənarlı cavab kartı, basma qutucuqlar
     təbriklər → üst-üstə düşmüş kiçik kartlar
   Şrift: yalnız Spectral (200–400, kursiv).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('white-elegance')
const ID = 'white-elegance'

const PAL = {
  PAPER: '#FBFAF7',
  TABLE: '#E8E5DF',
  INK: '#2B2723',
  GREY: '#7A7166',
}

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['INK'], accent: ['GREY'], background: ['TABLE'], text: ['INK'] }

/* Qabartma: kağız rəngində hərf, yuxarı-solda işıq, aşağı-sağda kölgə */
const EMBOSS = { color: '#F1EEE9', textShadow: '-1px -1px 0 rgba(255,255,255,1), 1px 1px 1.5px rgba(60,48,36,.32), 0 0 1px rgba(60,48,36,.08)' }
/* Basma: əksinə — hərf kağıza sıxılıb */
/* Basma xətt (yiv) */
const groove = (w = '100%') => ({ width: w, height: 2, margin: '0 auto', background: 'linear-gradient(rgba(60,48,36,.16) 0 1px, rgba(255,255,255,1) 1px 2px)' })

/* Cırıq (deckle) kənar — sabit toxum, hər render-də eyni forma */
function deckle(seed = 1, n = 46, amp = 0.55) {
  let s = seed >>> 0
  const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
  const pts = []
  for (let i = 0; i <= n; i++) pts.push(`${(i / n * 100).toFixed(2)}% ${(r() * amp).toFixed(2)}%`)
  for (let i = 0; i <= n; i++) pts.push(`${(100 - r() * amp * 0.7).toFixed(2)}% ${(i / n * 100).toFixed(2)}%`)
  for (let i = n; i >= 0; i--) pts.push(`${(i / n * 100).toFixed(2)}% ${(100 - r() * amp).toFixed(2)}%`)
  for (let i = n; i >= 0; i--) pts.push(`${(r() * amp * 0.7).toFixed(2)}% ${(i / n * 100).toFixed(2)}%`)
  return `polygon(${pts.join(',')})`
}
const DECKLE_A = deckle(7)
const DECKLE_B = deckle(19)

const KEYFRAMES = (C) => `
@keyframes we-in    { from { opacity: 0; transform: translateY(18px) rotate(-2deg) } to { opacity: 1; transform: rotate(-1.2deg) } }
@keyframes we-rake  { from { background-position: 120% 0 } to { background-position: -40% 0 } }
@keyframes we-rise  { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
@keyframes we-fade  { from { opacity: 0 } to { opacity: 1 } }
@keyframes we-breathe { 0%,100% { opacity: .45 } 50% { opacity: 1 } }
[data-we] span[aria-hidden="true"], [data-we] svg[aria-hidden="true"], [data-we] div[aria-hidden="true"] { pointer-events: none; }
[data-we] ::placeholder { color: rgba(122,113,102,.7); font-style: italic; }
[data-we] input:focus-visible, [data-we] textarea:focus-visible { border-color: ${C.INK} !important; outline: none; }
[data-we] button:focus-visible, [data-we] a:focus-visible, [data-we] [role="button"]:focus-visible { outline: 1px solid ${C.INK}; outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) { [data-we] *, [data-we] { animation: none !important; transition: none !important; } }
`

/* Pambıq kartı — kağız toxuması + yumşaq kölgə; `edge` cırıq kənar verir */
function CottonCard({ children, edge = DECKLE_A, style = {}, pad = '44px 26px' }) {
  const C = usePalette()
  return (
    <div style={{ position: 'relative', filter: 'drop-shadow(0 22px 26px rgba(43,39,35,.16)) drop-shadow(0 2px 3px rgba(43,39,35,.08))', ...style }}>
      <div style={{
        clipPath: edge, background: C.PAPER, padding: pad, position: 'relative',
        backgroundImage: 'radial-gradient(rgba(60,48,36,.035) 1px, transparent 1.2px)', backgroundSize: '5px 5px',
      }}>
        {children}
      </div>
    </div>
  )
}

/* ═══ 01 — AÇILIŞ: stol üstündə qabartma kart ═══ */
function CardOpening({ inv, theme }) {
  const C = usePalette()
  const { ot } = inv
  const gate = useGate({ inv, ms: 1250 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const f = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-we
      animate={gate.opening ? { backgroundColor: 'rgba(232,229,223,0)' } : {}}
      transition={{ duration: 0.5, delay: 0.7 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden',
        backgroundColor: C.TABLE, backgroundImage: 'radial-gradient(120% 80% at 50% 30%, rgba(255,255,255,.65), rgba(255,255,255,0) 70%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: f, color: C.INK, textAlign: 'center', padding: '0 24px',
      }}>
      <motion.div
        animate={gate.opening ? { y: -40, scale: 1.05, rotate: 0, opacity: 0 } : {}}
        transition={{ duration: 1.05, ease: [0.5, 0, 0.2, 1] }}
        style={{ width: 'min(80vw, 340px)', animation: 'we-in 1.4s cubic-bezier(.2,.8,.2,1) .15s both', transformOrigin: '50% 60%' }}
      >
        <CottonCard pad="clamp(34px, 9vw, 44px) 22px" edge={DECKLE_A}>
          {/* basma çərçivə */}
          <span aria-hidden="true" style={{ position: 'absolute', inset: 12, boxShadow: 'inset 1px 1px 0 rgba(60,48,36,.14), inset -1px -1px 0 rgba(255,255,255,1), 1px 1px 0 rgba(255,255,255,1), -1px -1px 0 rgba(60,48,36,.1)' }} />
          {/* yan işıq — qabartmanı göstərir */}
          <span aria-hidden="true" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'soft-light',
            background: 'linear-gradient(100deg, transparent 35%, rgba(255,255,255,.95) 50%, transparent 65%)', backgroundSize: '260% 100%',
            animation: 'we-rake 2.6s cubic-bezier(.4,0,.2,1) .9s both',
          }} />
          {ot.mono.kind !== 'none' && (
            <div style={{
              width: 116, height: 116, margin: '0 auto', borderRadius: '50%', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'inset 2px 2px 3px rgba(60,48,36,.14), inset -2px -2px 3px rgba(255,255,255,1)',
              fontStyle: 'italic', fontWeight: 200, fontSize: 40, letterSpacing: '.02em', ...EMBOSS,
              animation: 'we-fade 1.6s ease-out .7s both',
            }}>
              <MonoContent mono={ot.mono} imgStyle={{ borderRadius: '50%' }} />
            </div>
          )}
          {ot.show('sub') && (
            <div style={{ marginTop: 22, fontSize: 12, letterSpacing: '.34em', textTransform: 'uppercase', color: C.GREY, paddingLeft: '.34em', animation: 'we-rise .9s ease-out 1.2s both' }}>
              {ot.text('sub')}
            </div>
          )}
          {titleOv !== '' && (
            <div style={{ marginTop: 14, fontWeight: 300, fontSize: 'clamp(26px, 8vw, 32px)', lineHeight: 1.15, animation: 'we-rise 1s ease-out 1.45s both' }}>
              {first}
              {second && <><span style={{ fontStyle: 'italic', color: C.GREY, margin: '0 .3em' }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && (
            <div style={{ marginTop: 14, fontSize: 14, letterSpacing: '.12em', color: C.GREY, animation: 'we-rise .9s ease-out 1.7s both' }}>{ot.text('meta')}</div>
          )}
        </CottonCard>
      </motion.div>
      <motion.div animate={gate.opening ? { opacity: 0 } : {}} transition={{ duration: 0.4 }}
        style={{ marginTop: 34, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        {ot.show('cta') && (
          <span style={{ fontStyle: 'italic', fontSize: 19, borderBottom: `1px solid ${C.INK}`, paddingBottom: 4, animation: 'we-rise .9s ease-out 2.1s both' }}>{ot.text('cta')}</span>
        )}
        {ot.show('hint') && (
          <span style={{ fontSize: 13, color: C.GREY, letterSpacing: '.06em', animation: 'we-fade .8s ease-out 2.6s both, we-breathe 3s ease-in-out 3.4s infinite' }}>{ot.text('hint')}</span>
        )}
      </motion.div>
    </motion.div>
  )
}

/* Bölmə: yiv xətti + başlıq (mərkəzdə) */
function Folio({ id, section, title, kicker, sub, children, f, style = {} }) {
  const C = usePalette()
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '56px 22px 64px', textAlign: 'center', ...style }}>
      <div style={groove('min(46%, 180px)')} />
      <Reveal style={{ maxWidth: 480, margin: '40px auto 0' }}>
        {(title || kicker) && (
          <div style={{ marginBottom: 30 }}>
            {title && <h2 style={{ margin: 0, fontFamily: f, fontStyle: 'italic', fontWeight: 300, fontSize: scaleFont('clamp(30px, 8.6vw, 38px)', C.hs), lineHeight: 1.15, color: C.INK }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 10, fontSize: 12, letterSpacing: '.3em', textTransform: 'uppercase', color: C.GREY }}>{kicker}</div>}
            {sub && <p style={{ margin: '10px auto 0', maxWidth: 300, fontSize: 16, color: C.GREY, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const btn = (C, filled) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px',
  fontSize: 16, letterSpacing: '.02em', textDecoration: 'none', cursor: 'pointer', borderRadius: 0,
  background: filled ? C.INK : 'transparent', color: filled ? C.PAPER : C.INK, border: `1px solid ${filled ? C.INK : 'rgba(43,39,35,.35)'}`,
})
const lineField = (C) => ({
  width: '100%', background: 'transparent', border: 'none', borderRadius: 0, borderBottom: '1px solid rgba(43,39,35,.35)',
  padding: '12px 4px', fontSize: 18, color: C.INK, outline: 'none', textAlign: 'center',
})

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function WhiteEleganceTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const T = inv.copy(TXT)
  const f = theme.fonts.heading

  return (
    <PaletteContext.Provider value={C}>
      <div data-we data-enter={enterDirection(ID)} style={{
        background: theme.background, minHeight: '100vh', fontFamily: f, color: C.INK,
        overflowX: 'hidden', position: 'relative', isolation: 'isolate',
        backgroundImage: 'radial-gradient(rgba(60,48,36,.03) 1px, transparent 1.2px)', backgroundSize: '5px 5px',
        fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.INK, 0.12),
      }}>
        <style>{KEYFRAMES(C)}</style>
        {!inv.opened && <CardOpening inv={inv} theme={theme} />}

        <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.PAPER, border: 'none', boxShadow: '0 8px 20px rgba(43,39,35,.16), inset 1px 1px 0 #FFF, inset -1px -1px 2px rgba(60,48,36,.14)' }}>
          {({ playing }) => <EqBars playing={playing} color={C.INK} idle="rgba(43,39,35,.3)" w={2} />}
        </MusicFab>

        {inv.opened && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
            <header style={{
              position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(251,250,247,.88)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 1px 0 rgba(60,48,36,.08)',
            }}>
              <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.GREY, fontSize: 15, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: f }}>
                <span aria-hidden="true">←</span>{tr.btn_back}
              </button>
              <div style={{ fontStyle: 'italic', fontSize: 17 }}>{T.brand}</div>
              <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
            </header>

            {/* HERO — cırıq kənarlı böyük kart */}
            <section data-section="hero" style={{ padding: '44px 18px 56px', textAlign: 'center' }}>
              <CottonCard pad="clamp(44px, 12vw, 64px) 22px" edge={DECKLE_B} style={{ maxWidth: 460, margin: '0 auto' }}>
                <span aria-hidden="true" style={{ position: 'absolute', inset: 14, boxShadow: 'inset 1px 1px 0 rgba(60,48,36,.14), inset -1px -1px 0 #FFF, 1px 1px 0 #FFF, -1px -1px 0 rgba(60,48,36,.1)' }} />
                <div style={{ fontSize: 12, letterSpacing: '.36em', textTransform: 'uppercase', color: C.GREY, paddingLeft: '.36em' }}>{L('hero', 'kicker', inv.eventLabel)}</div>
                <p style={{ margin: '16px auto 0', maxWidth: 260, fontStyle: 'italic', fontWeight: 300, fontSize: 17, lineHeight: 1.5, color: C.GREY }}>{tr.inv_join}</p>
                <h1 style={{ margin: '30px 0 0', fontWeight: 200, lineHeight: 1.04, fontSize: 'clamp(44px, 13.5vw, 64px)', color: C.INK }}>
                  {inv.heroTitle ? inv.heroTitle : inv.isCouple ? (
                    <>
                      <span style={{ display: 'block' }}>{inv.groom}</span>
                      <span style={{ display: 'block', fontStyle: 'italic', fontSize: '.5em', color: C.GREY, margin: '8px 0' }}>{inv.and}</span>
                      <span style={{ display: 'block' }}>{inv.bride}</span>
                    </>
                  ) : inv.single}
                </h1>
                {inv.isCorp && weddingData.organizer?.trim() && (
                  <div style={{ marginTop: 14, fontSize: 15, color: C.GREY }}>{tr.organizer_display}: {weddingData.organizer}</div>
                )}
                <div style={{ ...groove('60px'), marginTop: 30 }} />
                <div style={{ marginTop: 26, fontSize: 19, fontWeight: 300 }}>{inv.fullDate}</div>
                {inv.time && <div style={{ marginTop: 6, fontSize: 16, color: C.GREY, letterSpacing: '.08em' }}>{inv.time}</div>}
                {weddingData.venueName && <div style={{ marginTop: 18, fontStyle: 'italic', fontSize: 18 }}>{weddingData.venueName}</div>}
              </CottonCard>
            </section>

            {/* SAYĞAC — qabartma möhürlər */}
            {S.countdown && (
              <Folio section="countdown" f={f} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(8px, 3vw, 16px)' }}>
                  {[
                    { v: cd.days, l: cd.labels.days },
                    { v: cd.hours, l: cd.labels.hours },
                    { v: cd.minutes, l: cd.labels.minutes },
                    { v: cd.seconds, l: cd.labels.seconds, pop: true },
                  ].map(({ v, l, pop }) => (
                    <div key={l}>
                      <div style={{
                        aspectRatio: '1', borderRadius: '50%', background: C.PAPER, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '-3px -3px 6px rgba(255,255,255,1), 3px 3px 8px rgba(60,48,36,.16), inset 1px 1px 0 rgba(255,255,255,.9)',
                      }}>
                        <span style={{ fontWeight: 300, fontSize: 'clamp(22px, 7vw, 30px)', color: C.INK, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                      </div>
                      <div style={{ marginTop: 10, fontSize: 13, letterSpacing: '.08em', color: C.GREY }}>{l}</div>
                    </div>
                  ))}
                </div>
              </Folio>
            )}

            <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

            {/* MƏKAN — basma pəncərə */}
            {S.venue && (
              <Folio section="venue" f={f} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
                <div style={{ padding: 10, background: C.PAPER, boxShadow: 'inset 2px 2px 5px rgba(60,48,36,.16), inset -2px -2px 4px #FFF' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.INK} height="clamp(220px, 62vw, 300px)"
                    map={{ opacity: 0.85, filter: 'grayscale(1) brightness(1.12) contrast(.85)', tintOpacity: 0 }}
                    frame={<Pin />}
                    fallback={<div style={{ height: 'clamp(220px, 62vw, 300px)', position: 'relative', background: '#F1EEE9', backgroundImage: 'linear-gradient(rgba(60,48,36,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(60,48,36,.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }}><Pin /></div>}
                  />
                </div>
                <div style={{ marginTop: 22, fontSize: 24, fontWeight: 300 }}>{weddingData.venueName}</div>
                {weddingData.venueNote && <div style={{ marginTop: 4, fontStyle: 'italic', fontSize: 16, color: C.GREY }}>{weddingData.venueNote}</div>}
                <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={btn(C, true)}>{tr.inv_directions_btn}</a>}
                  {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={btn(C, !inv.dirUrl)}>Maps</a>}
                  {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(C, false)}>Waze</a>}
                  {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(C, false)}>Apple</a>}
                </div>
              </Folio>
            )}

            {/* PROQRAM — kalka vərəq */}
            {S.program && (
              <Folio section="program" f={f} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
                <div style={{ position: 'relative', padding: '8px 6px' }}>
                  <div aria-hidden="true" style={{ position: 'absolute', inset: '-6px 10px', background: C.PAPER, boxShadow: '0 14px 30px -18px rgba(43,39,35,.35)', transform: 'rotate(1.4deg)' }} />
                  <div style={{
                    position: 'relative', padding: '30px 22px', transform: 'rotate(-.6deg)',
                    background: 'rgba(255,255,255,.55)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
                    border: '1px solid rgba(255,255,255,.9)', boxShadow: '0 1px 0 rgba(60,48,36,.06), 0 18px 40px -26px rgba(43,39,35,.4)',
                  }}>
                    {timeline.events.map((ev, i) => (
                      <div key={i} style={{ padding: '12px 0' }}>
                        <div style={{ fontSize: 13, letterSpacing: '.24em', color: C.GREY, paddingLeft: '.24em', fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                        <div style={{ marginTop: 4, fontSize: 20, fontWeight: 300, lineHeight: 1.3 }}>{ev.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Folio>
            )}

            {S.dresscode && (
              <Folio section="dresscode" f={f} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
                <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={f} align="center" />
              </Folio>
            )}

            {/* MASA — qatlanmış yer kartı */}
            {S.seating && !seating.isEmpty && (
              <Folio section="seating" f={f} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
                <input {...seatInputProps(inv, 'we-seat-list')} style={lineField(C)} />
                <SeatSuggest inv={inv} id="we-seat-list" c={{ bg: C.PAPER, border: '1px solid rgba(43,39,35,.18)', active: 'rgba(43,39,35,.06)', text: C.INK, table: C.GREY, shadow: '0 14px 28px -16px rgba(43,39,35,.3)', font: f }} />
                {seating.showNotFound && <div style={{ marginTop: 12, fontStyle: 'italic', fontSize: 15, color: C.GREY }}>{tr.inv_seat_fullname}</div>}
                {seating.selected && (
                  <div style={{ margin: '30px auto 0', maxWidth: 300, perspective: 600 }}>
                    <div style={{ height: 34, background: 'linear-gradient(#F1EEE8, #FBFAF7)', transform: 'rotateX(52deg)', transformOrigin: '50% 100%', boxShadow: '0 -1px 0 rgba(60,48,36,.06)' }} />
                    <div style={{ background: C.PAPER, padding: '20px 18px 16px', boxShadow: '0 22px 30px -18px rgba(43,39,35,.35), inset 0 1px 0 rgba(60,48,36,.08)' }}>
                      <div style={{ fontStyle: 'italic', fontSize: 18 }}>{seating.selected.full_name}</div>
                      <div style={{ marginTop: 8, fontWeight: 200, fontSize: 46, lineHeight: 1, ...EMBOSS }}>{seating.selected.table_id}</div>
                      {seating.tablemates.length > 0 && (
                        <div style={{ marginTop: 12, fontSize: 14.5, color: C.GREY, lineHeight: 1.6 }}>{seating.tablemates.map((g) => g.full_name).join(' · ')}</div>
                      )}
                      <button onClick={seating.reset} data-press style={{ marginTop: 8, background: 'none', border: 'none', fontFamily: f, fontStyle: 'italic', fontSize: 15, color: C.INK, minHeight: 44, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4 }}>
                        {seatingL.again || 'Yenidən axtar'}
                      </button>
                    </div>
                  </div>
                )}
              </Folio>
            )}

            {/* ALBOM */}
            {S.gallery && (
              <Folio section="gallery" id="gallery-section" f={f} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
                {gallery.demoPhotos.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 30 }}>
                    {gallery.demoPhotos.map((url, i) => (
                      <div key={i} style={{ background: C.PAPER, padding: 6, aspectRatio: '4/5', boxShadow: '0 10px 18px -12px rgba(43,39,35,.4)' }}>
                        <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'grayscale(.4) brightness(1.04)' }} />
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'inline-block', background: C.PAPER, padding: 16, boxShadow: '0 16px 30px -18px rgba(43,39,35,.4), inset 0 0 0 1px rgba(60,48,36,.08)' }}>
                  <QRCodeSVG value={gallery.photoShareUrl} size={130} bgColor={C.PAPER} fgColor={C.INK} level="M" />
                </div>
                <div style={{ marginTop: 12, fontStyle: 'italic', fontSize: 15, color: C.GREY }}>{tr.inv_scan_upload}</div>
                <div><a data-press href={gallery.photoShareUrl} style={{ ...btn(C, true), marginTop: 18 }}>{tr.inv_gallery_btn}</a></div>
                <p style={{ margin: '16px auto 0', maxWidth: 340, fontSize: 16, color: C.GREY, lineHeight: 1.65 }}>{tr.inv_gallery_desc}</p>
              </Folio>
            )}

            {/* CAVAB KARTI */}
            {S.rsvp && (
              <Folio section="rsvp" f={f} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
                <ReplyForm inv={inv} t={{ ink: C.INK, muted: C.GREY, line: 'rgba(43,39,35,.35)', hair: 'rgba(43,39,35,.1)', accent: C.INK, font: f, display: f, displayItalic: true, marker: (a) => <span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', border: `1px solid ${C.INK}`, background: a ? C.INK : 'transparent' }} />, suggest: { bg: C.PAPER, border: '1px solid rgba(43,39,35,.18)', active: 'rgba(43,39,35,.06)', text: C.INK, table: C.GREY, font: f } }} />
              </Folio>
            )}

            {/* XOŞ SÖZLƏR — üst-üstə kiçik kartlar */}
            {S.guestbook && (
              <Folio section="guestbook" f={f} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
                <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 8, marginBottom: 34 }}>
                  <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={lineField(C)} />
                  <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...lineField(C), resize: 'none', lineHeight: 1.5 }} />
                  <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...btn(C, gbook.canSubmit), marginTop: 14, width: '100%', opacity: gbook.canSubmit ? 1 : 0.45, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}>
                    {gbook.sending ? gbookL.sending : gbookL.btn}
                  </button>
                  {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 14 }}>⚠ {gbookL.error}</p>}
                </form>
                <div style={{ display: 'grid', gap: 18 }}>
                  {gbook.messages.map((raw, i) => {
                    const m = gbook.readMessage(raw)
                    return (
                      <figure key={m.name + i} style={{
                        margin: 0, background: C.PAPER, padding: '22px 20px', transform: `rotate(${[-1.2, 0.8, -0.4, 1.1][i % 4]}deg)`,
                        boxShadow: '0 14px 24px -16px rgba(43,39,35,.35), 0 1px 2px rgba(43,39,35,.06)',
                      }}>
                        <blockquote style={{ margin: 0, fontStyle: 'italic', fontWeight: 300, fontSize: 18, lineHeight: 1.55 }}>{m.text}</blockquote>
                        <figcaption style={{ marginTop: 10, fontSize: 13, letterSpacing: '.14em', color: C.GREY }}>{m.name}{m.date ? `, ${gbook.formatDate(m.date)}` : ''}</figcaption>
                      </figure>
                    )
                  })}
                </div>
              </Folio>
            )}

            <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={f} />
          </motion.div>
        )}
      </div>
    </PaletteContext.Provider>
  )
}

function Pin() {
  const C = usePalette()
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 16, height: 16, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: C.INK, boxShadow: '0 0 0 6px rgba(251,250,247,.85), 0 6px 14px rgba(43,39,35,.3)', pointerEvents: 'none' }} />
  )
}
