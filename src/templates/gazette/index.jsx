import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../_shared/MapSection'
import { Reveal, PopDigit, enterDirection } from '../_shared/motion'
import { hidePhoto } from '../../utils/photoGallery'
import { getTemplateTheme } from '../templateConfig'
import { useInvitation, useGate, openingNames, seatInputProps, alpha } from '../_shared/useInvitation'
import { MusicFab, EqBars, SeatSuggest, StoryBlock, InvitationEnd, ReplyForm } from '../_shared/invitationKit'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'
import { LABELS, TXT } from './copy'
import { fill } from '../_shared/copyText'

/* ─────────────────────────────────────────────────────────────────────────────
   GAZETTE — «Təcili buraxılış» (premium redizayn, 2026-10)

   Konsept: 1930-cu illərin böyük formatlı qəzeti. Açılış — kinodakı kimi
   fırlanaraq ekrana uçan qəzet: manşetdə adlar, rastr (halftone) şəkil,
   sütunlarda real xəbər mətni. Toxunanda qəzet fırlanıb uzaqlaşır. Daxildə
   hər bölmə qəzetin bir rubrikasıdır:
     hero      → birinci səhifə + «hava proqnozu» qutusu
     sayğac    → «Geri sayım» xəbər qutusu
     məkan     → rastrlı foto, foto altı yazı
     proqram   → teleproqram cədvəli
     masa      → elanlar (classifieds)
     RSVP      → kəsilib göndərilən kupon ✂
     arzular   → oxucu məktubları
   Rəng: qəzet kağızı, mətbəə qarası, bir rəngli qırmızı.
   Şriftlər: Old Standard TT (manşet) · Playfair Display · Source Serif 4.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('gazette')
const ID = 'gazette'

const PAL = {
  PAPER: '#F3EEE2',
  INK: '#1A1917',
  GREY: '#55514A',
  RED: '#B3261E',
}

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['INK'], secondary: ['GREY'], accent: ['RED'], background: ['PAPER'], text: ['INK'] }
const RULE = (C) => `linear-gradient(${C.INK}, ${C.INK}) top / 100% 3px no-repeat, linear-gradient(${C.INK}, ${C.INK}) 0 5px / 100% 1px no-repeat`
const DOTS = (C, c = C.INK, s = 4) => `radial-gradient(circle, ${c} 0.9px, transparent 1.3px) 0 0 / ${s}px ${s}px`

const KEYFRAMES = (C) => `
@keyframes gz-spin { from { transform: rotate(-1080deg) scale(.04); opacity: 0 } 15% { opacity: 1 } to { transform: rotate(-2deg) scale(1); opacity: 1 } }
@keyframes gz-rise { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
@keyframes gz-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes gz-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
[data-gz] span[aria-hidden="true"], [data-gz] svg[aria-hidden="true"], [data-gz] div[aria-hidden="true"] { pointer-events: none; }
[data-gz] ::placeholder { color: rgba(85,81,74,.55); }
[data-gz] input:focus-visible, [data-gz] textarea:focus-visible { border-color: ${C.INK} !important; outline: none; background: #fff !important; }
[data-gz] button:focus-visible, [data-gz] a:focus-visible, [data-gz] [role="button"]:focus-visible { outline: 2px solid ${C.INK}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-gz] *, [data-gz] { animation: none !important; transition: none !important; } }
`

const upper = (s, lang) => String(s || '').toLocaleUpperCase(lang === 'ru' ? 'ru' : lang === 'en' ? 'en' : 'az')

/* Rastr «foto» — iki üzük; nöqtə ekranı ilə çap olunmuş kimi */
function HalftoneRings({ height = 150 }) {
  const C = usePalette()
  return (
    <svg viewBox="0 0 300 150" width="100%" height={height} preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <pattern id="gz-dot" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.15" fill={C.INK} /></pattern>
        <pattern id="gz-dot2" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".65" fill={C.INK} /></pattern>
        <radialGradient id="gz-vig" r=".75"><stop offset=".5" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".35" /></radialGradient>
      </defs>
      <rect width="300" height="150" fill="url(#gz-dot2)" />
      <rect width="300" height="150" fill="url(#gz-vig)" />
      <circle cx="128" cy="78" r="38" fill="none" stroke="url(#gz-dot)" strokeWidth="14" />
      <circle cx="172" cy="78" r="38" fill="none" stroke="url(#gz-dot)" strokeWidth="14" />
      <circle cx="128" cy="78" r="38" fill="none" stroke={C.PAPER} strokeWidth="2.4" strokeDasharray="30 210" strokeDashoffset="-20" />
      <circle cx="172" cy="78" r="38" fill="none" stroke={C.PAPER} strokeWidth="2.4" strokeDasharray="30 210" strokeDashoffset="-150" />
      <path d="M128 40l6-10h-12z" fill="url(#gz-dot)" />
    </svg>
  )
}

/* Birinci səhifə — açılışda və hero-da eyni */
function FrontPage({ inv, weddingData, T, edition, masthead, rubric, title, venue, meta, compact = false }) {
  const C = usePalette()
  const { lang } = inv
  const head = "'Old Standard TT', 'Playfair Display', Georgia, serif"
  const disp = inv.theme.fonts.heading
  const body = inv.theme.fonts.body
  const nameStr = inv.isCouple ? `${inv.groom} ${T.and} ${inv.bride}` : inv.single
  const lead = fill(T.lead, {
    venue: weddingData.venueName || T.city, date: inv.fullDate, names: inv.heroTitle || nameStr,
    at: inv.time ? ` ${fill(T.leadAt, { time: inv.time }).trim()}` : '',
  })
  return (
    <div style={{ color: C.INK, fontFamily: body }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 10.5, letterSpacing: '.08em', paddingBottom: 6, borderBottom: `1px solid ${C.INK}` }}>
        <span>{edition}</span><span>{inv.formattedDate || inv.fullDate}</span><span>{T.price}</span>
      </div>
      {masthead !== null && <div style={{ fontFamily: head, fontWeight: 700, fontSize: compact ? 'clamp(34px, 11vw, 46px)' : 'clamp(38px, 12.5vw, 54px)', lineHeight: 1, letterSpacing: '-.01em', textAlign: 'center', padding: '10px 0 8px' }}>{masthead}</div>}
      <div style={{ height: 7, background: RULE(C) }} />
      {rubric && <div style={{ marginTop: 10, textAlign: 'center', fontSize: 12, letterSpacing: '.22em', color: C.RED, fontWeight: 600 }}>{upper(rubric, lang)}</div>}
      {title !== '' && (
        <h1 style={{ margin: '6px 0 0', textAlign: 'center', fontFamily: disp, fontWeight: 900, fontSize: compact ? 'clamp(34px, 11vw, 46px)' : 'clamp(38px, 12vw, 54px)', lineHeight: 0.98, letterSpacing: '-.01em', textWrap: 'balance' }}>
          {upper(title, lang)}
        </h1>
      )}
      {(venue || meta) && <div style={{ marginTop: 8, textAlign: 'center', fontStyle: 'italic', fontSize: 16, color: C.GREY }}>{[venue, meta].filter(Boolean).join(' — ')}</div>}
      <div style={{ marginTop: 12, borderTop: `1px solid ${C.INK}`, borderBottom: `1px solid ${C.INK}`, padding: '6px 0' }}>
        <HalftoneRings height={compact ? 120 : 140} />
      </div>
      <div style={{ marginTop: 4, fontSize: 11, fontStyle: 'italic', color: C.GREY }}>{T.caption}: {nameStr}</div>
      <div style={{ marginTop: 10, columnCount: 2, columnGap: 16, columnRule: `1px solid ${alpha(C.INK, 0.3)}`, fontSize: 12.5, lineHeight: 1.45, textAlign: 'left' }}>
        <span style={{ float: 'left', fontFamily: disp, fontWeight: 900, fontSize: 40, lineHeight: 0.8, padding: '4px 6px 0 0' }}>{lead.charAt(0)}</span>{lead.slice(1)}
      </div>
    </div>
  )
}

/* ═══ 01 — AÇILIŞ: fırlanan qəzet ═══ */
function SpinOpening({ inv, theme, weddingData, T }) {
  const C = usePalette()
  const { ot } = inv
  const gate = useGate({ inv, ms: 1050 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const title = titleOv !== undefined ? titleOv : (second ? `${first} & ${second}` : first)
  return (
    <motion.div {...gate.gateProps} data-gz
      animate={gate.opening ? { opacity: 0 } : {}}
      transition={{ duration: 0.3, delay: 0.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: `radial-gradient(80% 60% at 50% 45%, #3A3833, #121110)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 14px', fontFamily: theme.fonts.body }}>
      <motion.div animate={gate.opening ? { rotate: 540, scale: 0.05, opacity: 0 } : {}} transition={{ duration: 0.9, ease: [0.6, 0, 0.8, 0.4] }}
        style={{ width: 'min(100%, 380px)' }}>
        <div style={{ padding: '14px 14px 16px', background: `linear-gradient(160deg, #F7F3E8, ${C.PAPER} 60%, #E9E2D0)`, boxShadow: '0 30px 60px rgba(0,0,0,.6)', animation: 'gz-spin 1.3s cubic-bezier(.2,.7,.2,1) .15s both' }}>
          <FrontPage inv={inv} weddingData={weddingData} T={T} compact
            edition={ot.show('edition') ? ot.text('edition') : ''} masthead={ot.show('masthead') ? ot.text('masthead') : null}
            rubric={ot.show('sub') ? ot.text('sub') : ''} title={title}
            venue={ot.show('venue') ? ot.text('venue') : ''} meta={ot.show('meta') ? ot.text('meta') : ''} />
        </div>
      </motion.div>
      <motion.div animate={gate.opening ? { opacity: 0 } : {}} transition={{ duration: 0.25 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {ot.show('cta') && (
          <div style={{ marginTop: 22, minHeight: 48, padding: '12px 26px', display: 'inline-flex', alignItems: 'center', background: C.RED, color: '#FFF8EE', fontFamily: theme.fonts.heading, fontWeight: 700, fontSize: 16, letterSpacing: '.06em', animation: 'gz-rise .7s ease-out 1.5s both' }}>
            {upper(ot.text('cta'), inv.lang)}
          </div>
        )}
        {ot.show('hint') && <div style={{ marginTop: 10, fontSize: 13, fontStyle: 'italic', color: '#CFC8B8', animation: 'gz-fade .8s ease-out 1.9s both, gz-hint 3s ease-in-out 2.7s infinite' }}>{ot.text('hint')}</div>}
      </motion.div>
    </motion.div>
  )
}

/* Rubrika — qalın+nazik qayda, rubrika adı, səhifə nömrəsi */
function Column({ id, section, title, kicker, sub, children, disp, page, T, lang }) {
  const C = usePalette()
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '40px 18px 46px' }}>
      <Reveal style={{ maxWidth: 520, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ marginBottom: 22 }}>
            <div style={{ height: 7, background: RULE(C) }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 10, gap: 12 }}>
              {title && <h2 style={{ margin: 0, fontFamily: disp, fontWeight: 900, fontSize: scaleFont('clamp(28px, 8.4vw, 36px)', C.hs), lineHeight: 1.02, letterSpacing: '-.01em', textWrap: 'balance' }}>{title}</h2>}
              {page && <span style={{ flex: 'none', fontSize: 11.5, letterSpacing: '.12em', color: C.GREY }}>{upper(T.page, lang)} {page}</span>}
            </div>
            {kicker && <div style={{ marginTop: 6, fontStyle: 'italic', fontSize: 15, color: C.GREY }}>{kicker}</div>}
            {sub && <p style={{ margin: '6px 0 0', fontSize: 15, color: C.GREY, lineHeight: 1.5 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: '#FBF9F3', border: `1px solid ${C.INK}`, borderRadius: 0,
  padding: '13px 14px', fontSize: 16, color: C.INK, outline: 'none',
})
const btn = (C, on, disp) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 20px', borderRadius: 0,
  fontFamily: disp, fontWeight: 700, fontSize: 15.5, letterSpacing: '.02em', textDecoration: 'none', cursor: 'pointer',
  background: on ? C.INK : 'transparent', color: on ? C.PAPER : C.INK, border: `1.5px solid ${C.INK}`,
})

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function GazetteTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL, ot } = inv
  const disp = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  let pg = 1
  const P = { disp, T, lang }
  const nextPage = () => ++pg

  return (
    <PaletteContext.Provider value={C}>
      <div data-gz data-enter={enterDirection(ID)} style={{
        backgroundColor: C.PAPER, backgroundImage: `radial-gradient(${alpha('#8A7F66', 0.08)} 1px, transparent 1.2px)`, backgroundSize: '5px 5px',
        minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
        fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.INK, 0.15),
      }}>
        <style>{KEYFRAMES(C)}</style>
        {!inv.opened && <SpinOpening inv={inv} theme={theme} weddingData={weddingData} T={T} />}

        <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: 0, background: C.PAPER, border: `1.5px solid ${C.INK}` }}>
          {({ playing }) => <EqBars playing={playing} color={C.INK} idle={alpha(C.INK, 0.3)} />}
        </MusicFab>

        {inv.opened && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }} style={{ position: 'relative', zIndex: 1 }}>
            <header style={{
              position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: alpha(C.PAPER, 0.94), backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              borderBottom: `1.5px solid ${C.INK}`,
            }}>
              <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.INK, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
                <span aria-hidden="true">←</span>{tr.btn_back}
              </button>
              <div style={{ fontFamily: "'Old Standard TT', Georgia, serif", fontWeight: 700, fontSize: 18 }}>{ot.text('masthead') || 'The Gazette'}</div>
              <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
            </header>

            {/* HERO — birinci səhifə */}
            <section data-section="hero" style={{ padding: '22px 16px 10px' }}>
              <div style={{ maxWidth: 520, margin: '0 auto' }}>
                <FrontPage inv={inv} weddingData={weddingData} T={T}
                  edition={ot.text('edition')} masthead={ot.text('masthead') || 'The Gazette'}
                  rubric={L('hero', 'kicker', ot.text('sub'))} title={inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)}
                  venue={weddingData.venueName} meta={inv.time} />
                {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 10, fontSize: 14, color: C.GREY }}>{tr.organizer_display}: {weddingData.organizer}</div>}
                <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr auto', gap: 14, alignItems: 'stretch' }}>
                  <p style={{ margin: 0, fontFamily: disp, fontStyle: 'italic', fontSize: 17, lineHeight: 1.45 }}>{tr.inv_join}</p>
                  <div style={{ width: 118, border: `1.5px solid ${C.INK}`, padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 10.5, letterSpacing: '.14em', fontWeight: 700 }}>{upper(T.weather, lang)}</div>
                    <svg viewBox="0 0 40 26" width="44" height="28" aria-hidden="true" style={{ margin: '4px auto 2px', display: 'block' }}>
                      <circle cx="14" cy="12" r="6" fill="none" stroke={C.INK} strokeWidth="1.4" />
                      {Array.from({ length: 8 }, (_, k) => { const a = k * Math.PI / 4; return <path key={k} d={`M${14 + Math.cos(a) * 8.5} ${12 + Math.sin(a) * 8.5}L${14 + Math.cos(a) * 11} ${12 + Math.sin(a) * 11}`} stroke={C.INK} strokeWidth="1.2" /> })}
                      <path d="M27 15c-2.4-3 2-7 6-5" fill="none" stroke={C.RED} strokeWidth="1.6" /><path d="M33 10c4-2 7 3 3 6l-6 5-5-6" fill="none" stroke={C.RED} strokeWidth="1.6" />
                    </svg>
                    <div style={{ fontSize: 11.5, lineHeight: 1.35, fontStyle: 'italic' }}>{T.forecast}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* SAYĞAC */}
            {S.countdown && (
              <Column section="countdown" {...P} page={nextPage()} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', border: `1.5px solid ${C.INK}` }}>
                  {[
                    { v: cd.days, l: cd.labels.days },
                    { v: cd.hours, l: cd.labels.hours },
                    { v: cd.minutes, l: cd.labels.minutes },
                    { v: cd.seconds, l: cd.labels.seconds, pop: true },
                  ].map(({ v, l, pop }, i) => (
                    <div key={l} style={{ padding: '14px 4px 10px', textAlign: 'center', borderLeft: i ? `1px solid ${C.INK}` : 'none', background: pop ? C.INK : 'transparent', color: pop ? C.PAPER : C.INK }}>
                      <div style={{ fontFamily: disp, fontWeight: 900, fontSize: 'clamp(30px, 9vw, 42px)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></div>
                      <div style={{ marginTop: 6, fontSize: 11.5, letterSpacing: '.1em' }}>{upper(l, lang)}</div>
                    </div>
                  ))}
                </div>
              </Column>
            )}

            <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

            {/* MƏKAN — rastrlı foto */}
            {S.venue && (
              <Column section="venue" {...P} page={nextPage()} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
                <div style={{ position: 'relative', border: `1.5px solid ${C.INK}` }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.RED} height="clamp(220px, 60vw, 290px)"
                    map={{ opacity: 0.9, filter: 'grayscale(1) contrast(1.5) brightness(1.05)', tintOpacity: 0 }}
                    frame={<span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: DOTS(C, alpha(C.INK, 0.35), 3), mixBlendMode: 'multiply' }}><NewsPin /></span>}
                    fallback={<div style={{ height: 'clamp(220px, 60vw, 290px)', position: 'relative', background: `${DOTS(C, alpha(C.INK, 0.25), 4)}, #E8E2D2` }}><NewsPin /></div>}
                  />
                </div>
                <div style={{ marginTop: 6, fontSize: 12.5, fontStyle: 'italic', color: C.GREY }}>{T.caption}: {weddingData.venueName}{weddingData.venueNote ? ` — ${weddingData.venueNote}` : ''}</div>
                <div style={{ marginTop: 14, fontFamily: disp, fontWeight: 900, fontSize: 26, lineHeight: 1.1 }}>{weddingData.venueName}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                  {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={btn(C, true, disp)}>{tr.inv_directions_btn}</a>}
                  {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={btn(C, !inv.dirUrl, disp)}>Maps</a>}
                  {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(C, false, disp)}>Waze</a>}
                  {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(C, false, disp)}>Apple</a>}
                </div>
              </Column>
            )}

            {/* PROQRAM — teleproqram */}
            {S.program && (
              <Column section="program" {...P} page={nextPage()} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
                <div style={{ borderTop: `1.5px solid ${C.INK}` }}>
                  {timeline.events.map((ev, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 12, padding: '12px 0', borderBottom: `1px solid ${alpha(C.INK, 0.3)}`, alignItems: 'baseline' }}>
                      <span style={{ fontFamily: disp, fontWeight: 900, fontSize: 21, fontVariantNumeric: 'tabular-nums', color: i === 0 ? C.RED : C.INK }}>{ev.time}</span>
                      <span style={{ fontSize: 17, lineHeight: 1.35, minWidth: 0 }}>{ev.label}</span>
                    </div>
                  ))}
                </div>
              </Column>
            )}

            {S.dresscode && (
              <Column section="dresscode" {...P} page={nextPage()} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
                <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={disp} align="left" />
              </Column>
            )}

            {/* MASA — elanlar */}
            {S.seating && !seating.isEmpty && (
              <Column section="seating" {...P} page={nextPage()} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
                <input {...seatInputProps(inv, 'gz-seat-list')} style={field(C)} />
                <SeatSuggest inv={inv} id="gz-seat-list" c={{ bg: '#FBF9F3', border: `1px solid ${C.INK}`, active: alpha(C.INK, 0.07), text: C.INK, table: C.RED, radius: 0, font: body }} />
                {seating.showNotFound && <div style={{ marginTop: 10, fontStyle: 'italic', fontSize: 15, color: C.GREY }}>{tr.inv_seat_fullname}</div>}
                {seating.selected && (
                  <div style={{ marginTop: 22, border: `1.5px solid ${C.INK}`, padding: 4, animation: 'gz-rise .5s ease-out both' }}>
                    <div style={{ border: `1px solid ${C.INK}`, padding: '12px 14px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 14, alignItems: 'center' }}>
                      <div style={{ textAlign: 'center', paddingRight: 14, borderRight: `1px solid ${C.INK}` }}>
                        <div style={{ fontSize: 11, letterSpacing: '.14em', fontWeight: 700 }}>{upper(T.table, lang)}</div>
                        <div style={{ fontFamily: disp, fontWeight: 900, fontSize: 52, lineHeight: 1, color: C.RED }}>{seating.selected.table_id}</div>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: disp, fontWeight: 900, fontSize: 20, lineHeight: 1.15 }}>{upper(seating.selected.full_name, lang)}</div>
                        {seating.tablemates.length > 0 && <div style={{ marginTop: 6, fontSize: 13.5, lineHeight: 1.45, color: C.GREY }}><b style={{ color: C.INK }}>{T.mates}:</b> {seating.tablemates.map((g) => g.full_name).join(', ')}</div>}
                      </div>
                    </div>
                  </div>
                )}
                {seating.selected && (
                  <button onClick={seating.reset} data-press style={{ marginTop: 8, padding: 0, background: 'none', border: 'none', color: C.INK, fontSize: 14.5, minHeight: 44, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: body }}>
                    {seatingL.again || 'Yenidən axtar'}
                  </button>
                )}
              </Column>
            )}

            {/* FOTO REPORTAJ */}
            {S.gallery && (
              <Column section="gallery" id="gallery-section" {...P} page={nextPage()} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
                {gallery.demoPhotos.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 24 }}>
                    {gallery.demoPhotos.map((url, i) => (
                      <figure key={i} style={{ margin: 0 }}>
                        <div style={{ position: 'relative', aspectRatio: '4 / 5', overflow: 'hidden', border: `1px solid ${C.INK}`, background: '#DDD6C4' }}>
                          <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'grayscale(1) contrast(1.3)' }} />
                          <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: DOTS(C, alpha(C.INK, 0.3), 3), mixBlendMode: 'multiply' }} />
                        </div>
                      </figure>
                    ))}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'center', border: `1.5px solid ${C.INK}`, padding: 12 }}>
                  <QRCodeSVG value={gallery.photoShareUrl} size={108} bgColor={C.PAPER} fgColor={C.INK} level="M" />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: disp, fontWeight: 900, fontSize: 18, lineHeight: 1.15 }}>{tr.inv_scan_upload}</div>
                    <a data-press href={gallery.photoShareUrl} style={{ ...btn(C, true, disp), marginTop: 10 }}>{tr.inv_gallery_btn}</a>
                  </div>
                </div>
                <p style={{ margin: '14px 0 0', fontSize: 15, color: C.GREY, lineHeight: 1.6 }}>{tr.inv_gallery_desc}</p>
              </Column>
            )}

            {/* RSVP — kupon */}
            {S.rsvp && (
              <Column section="rsvp" {...P} page={nextPage()} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
                <ReplyForm inv={inv} t={{ ink: C.INK, muted: C.GREY, line: C.INK, hair: alpha(C.INK, 0.2), accent: C.INK, font: body, display: disp, radius: 0, btnFont: disp, marker: (a) => <span style={{ display: 'block', width: 14, height: 14, border: `1.5px solid ${C.INK}`, fontSize: 12, lineHeight: '11px', textAlign: 'center', color: C.RED, fontWeight: 900 }}>{a ? '✕' : ''}</span>, suggest: { bg: '#FBF9F3', border: `1px solid ${C.INK}`, active: alpha(C.INK, 0.07), text: C.INK, table: C.RED, radius: 0, font: body } }} />
              </Column>
            )}

            {/* OXUCU MƏKTUBLARI */}
            {S.guestbook && (
              <Column section="guestbook" {...P} page={nextPage()} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
                <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 26 }}>
                  <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={field(C)} />
                  <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...field(C), resize: 'none', lineHeight: 1.5 }} />
                  <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...btn(C, gbook.canSubmit, disp), width: '100%', opacity: gbook.canSubmit ? 1 : 0.45, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}>
                    {gbook.sending ? gbookL.sending : gbookL.btn}
                  </button>
                  {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 14, color: C.RED }}>⚠ {gbookL.error}</p>}
                </form>
                <div style={{ columnCount: 2, columnGap: 18, columnRule: `1px solid ${alpha(C.INK, 0.3)}` }}>
                  {gbook.messages.map((raw, i) => {
                    const msg = gbook.readMessage(raw)
                    return (
                      <figure key={msg.name + i} style={{ margin: '0 0 16px', breakInside: 'avoid', paddingBottom: 14, borderBottom: `1px solid ${alpha(C.INK, 0.2)}` }}>
                        <blockquote style={{ margin: 0, fontSize: 14.5, lineHeight: 1.5 }}>{msg.text}</blockquote>
                        <figcaption style={{ marginTop: 6, fontFamily: disp, fontWeight: 700, fontStyle: 'italic', fontSize: 14 }}>— {msg.name}{msg.date ? <span style={{ fontFamily: body, fontWeight: 400, fontStyle: 'normal', color: C.GREY }}>{`, ${gbook.formatDate(msg.date)}`}</span> : null}</figcaption>
                      </figure>
                    )
                  })}
                </div>
              </Column>
            )}

            <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={disp} />
          </motion.div>
        )}
      </div>
    </PaletteContext.Provider>
  )
}

function NewsPin() {
  const C = usePalette()
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -22, top: -22, width: 44, height: 44, borderRadius: '50%', border: `3px solid ${C.RED}` }} />
      <span style={{ position: 'absolute', left: -4, top: -4, width: 8, height: 8, borderRadius: '50%', background: C.RED }} />
    </span>
  )
}
