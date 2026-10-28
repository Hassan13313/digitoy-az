import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../_shared/MapSection'
import { parseLatLon } from '../_shared/geo'
import { Reveal, PopDigit, enterDirection } from '../_shared/motion'
import { hidePhoto } from '../../utils/photoGallery'
import { getTemplateTheme } from '../templateConfig'
import { useInvitation, useGate, openingNames, seatInputProps, alpha } from '../_shared/useInvitation'
import { MusicFab, EqBars, SeatSuggest, StoryBlock, InvitationEnd, ReplyForm } from '../_shared/invitationKit'
import { computeSky, faintStars, moonPath, dms } from './sky'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'
import { LABELS, TXT } from './copy'
import { fill } from '../_shared/copyText'

/* ─────────────────────────────────────────────────────────────────────────────
   NIGHT SKY ROMANCE — «O gecənin səması» (premium redizayn, 2026-10)

   Konsept: dəvətnamə tədbirin tarixində, saatında və məkanının üzərindəki
   HƏQİQİ ulduz xəritəsidir — parlaq ulduzlar və bürclər astronomik olaraq
   hesablanır (bax sky.js). Bölmələr göy xəritəsinin dilində qurulub.

     açılış   → planisfer: ulduzlar yanır, bürc xətləri çəkilir; toxunanda
                xəritənin mərkəzinə — zenitə uçuruq
     hero     → adlar + tarix + məkanın coğrafi koordinatı
     sayğac   → O GECƏ Ayın fazası (real hesab) + sayğac
     proqram  → «axşamın bürcü»: hadisələr bir bürc kimi ulduzdan ulduza
     masa     → «sizin ulduzunuz»
   Rəng: gecə mavisi, ay işığı gümüşü, isti ulduz qızılı.
   Şriftlər: Source Serif 4 (kursiv başlıq) · Commissioner (mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('night-sky')
const ID = 'night-sky'

const PAL = {
  NIGHT: '#070B18',
  DEEP: '#0F1526',
  MOON: '#E4E9F5',
  SILVER: '#C8CEE0',
  STARGOLD: '#F2D9A6',
  MUTED: '#A2A8BC',
}

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['STARGOLD'], secondary: ['MUTED'], accent: ['SILVER'], background: ['NIGHT'], text: ['MOON'] }

const KEYFRAMES = (C) => `
@keyframes ns-tw   { 0% { opacity: 0 } 60% { opacity: 1 } 100% { opacity: var(--o, 1) } }
@keyframes ns-draw { to { stroke-dashoffset: 0 } }
@keyframes ns-rise { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
@keyframes ns-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes ns-spin { to { transform: rotate(360deg) } }
@keyframes ns-glint { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
[data-ns] span[aria-hidden="true"], [data-ns] svg[aria-hidden="true"], [data-ns] div[aria-hidden="true"] { pointer-events: none; }
[data-ns] ::placeholder { color: rgba(200,206,224,.5); }
[data-ns] input:focus-visible, [data-ns] textarea:focus-visible { border-color: ${C.MOON} !important; outline: none; }
[data-ns] button:focus-visible, [data-ns] a:focus-visible, [data-ns] [role="button"]:focus-visible { outline: 1px solid ${C.MOON}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) {
  [data-ns] *, [data-ns] { animation: none !important; transition: none !important; }
  [data-ns] line, [data-ns] path { stroke-dashoffset: 0 !important; }
}
`

/* Dördguşəli parıltı */
function Sparkle(props) {
  const C = usePalette()
  const { size = 12, color = C.STARGOLD, style = {} } = props
  return (
    <svg viewBox="-10 -10 20 20" width={size} height={size} aria-hidden="true" style={{ display: 'block', ...style }}>
      <path d="M0 -10 Q1.2 -1.2 10 0 Q1.2 1.2 0 10 Q-1.2 1.2 -10 0 Q-1.2 -1.2 0 -10Z" fill={color} />
    </svg>
  )
}

/* ═══ Planisfer — o gecənin səması ═══ */
function StarChart({ sky, faint, dirs, animate = true, size = '100%' }) {
  const C = usePalette()
  const R = 150
  return (
    <svg viewBox="-180 -180 360 360" width={size} height={size} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id="ns-disc" r="1">
          <stop offset="0" stopColor="#141C36" />
          <stop offset="1" stopColor="#090E1E" />
        </radialGradient>
      </defs>
      <circle r={R} fill="url(#ns-disc)" />
      <circle r={R} fill="none" stroke={C.SILVER} strokeOpacity=".55" strokeWidth=".8" />
      <circle r={R + 10} fill="none" stroke={C.SILVER} strokeOpacity=".3" strokeWidth=".5" />
      {Array.from({ length: 72 }, (_, i) => {
        const a = (i * 5 * Math.PI) / 180, long = i % 6 === 0
        return <line key={i} x1={Math.sin(a) * R} y1={-Math.cos(a) * R} x2={Math.sin(a) * (R + (long ? 10 : 5))} y2={-Math.cos(a) * (R + (long ? 10 : 5))} stroke={C.SILVER} strokeOpacity={long ? 0.7 : 0.35} strokeWidth=".6" />
      })}
      {/* hündürlük dairələri 30° və 60° */}
      <circle r={R * (2 / 3)} fill="none" stroke={C.SILVER} strokeOpacity=".1" strokeWidth=".5" strokeDasharray="2 4" />
      <circle r={R / 3} fill="none" stroke={C.SILVER} strokeOpacity=".1" strokeWidth=".5" strokeDasharray="2 4" />
      <g fontSize="8.5" fill={C.SILVER} fillOpacity=".75" textAnchor="middle" style={{ letterSpacing: '.18em', textTransform: 'uppercase' }}>
        <text y={-R - 16}>{dirs.dirN}</text>
        <text y={R + 24}>{dirs.dirS}</text>
        <text x={-R - 18} y="3" transform={`rotate(-90 ${-R - 18} 0)`}>{dirs.dirE}</text>
        <text x={R + 18} y="3" transform={`rotate(90 ${R + 18} 0)`}>{dirs.dirW}</text>
      </g>
      {faint.map((s, i) => (
        <circle key={`f${i}`} cx={(s.x * R * 0.97).toFixed(1)} cy={(s.y * R * 0.97).toFixed(1)} r={s.s} fill={C.MOON}
          style={{ '--o': s.o, opacity: animate ? 0 : s.o, animation: animate ? `ns-tw 1.6s ease-out ${(0.2 + (i % 40) * 0.03).toFixed(2)}s forwards` : undefined }} />
      ))}
      {sky.lines.map(([x1, y1, x2, y2], i) => (
        <line key={`l${i}`} x1={(x1 * R).toFixed(1)} y1={(y1 * R).toFixed(1)} x2={(x2 * R).toFixed(1)} y2={(y2 * R).toFixed(1)}
          stroke={C.SILVER} strokeOpacity=".42" strokeWidth=".7" pathLength="1"
          style={animate ? { strokeDasharray: 1, strokeDashoffset: 1, animation: `ns-draw 1.2s ease-out ${(1.3 + i * 0.03).toFixed(2)}s forwards` } : undefined} />
      ))}
      {sky.stars.map((s, i) => {
        const r = Math.max(0.9, 3.2 - s.mag * 0.85)
        return (
          <g key={s.name} style={{ '--o': 1, opacity: animate ? 0 : 1, animation: animate ? `ns-tw 1.4s ease-out ${(0.7 + (i % 24) * 0.05).toFixed(2)}s forwards` : undefined }}>
            {s.mag < 1.2 && <circle cx={s.x * R} cy={s.y * R} r={r * 3.2} fill={C.STARGOLD} opacity=".14" />}
            <circle cx={s.x * R} cy={s.y * R} r={r} fill={s.mag < 0.6 ? '#FFF6E0' : C.MOON} />
          </g>
        )
      })}
    </svg>
  )
}

/* ═══ 01 — AÇILIŞ ═══ */
function SkyOpening({ inv, theme, sky, faint }) {
  const C = usePalette()
  const { ot } = inv
  const gate = useGate({ inv, ms: 1300 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const serif = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-ns
      animate={gate.opening ? { opacity: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.75 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden',
        background: `radial-gradient(120% 80% at 50% 30%, #121A35, ${C.NIGHT} 70%)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: C.MOON, textAlign: 'center', padding: '0 22px', fontFamily: theme.fonts.body,
      }}>
      <motion.div
        animate={gate.opening ? { scale: 3.2, opacity: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.7, 0, 0.84, 0] }}
        style={{ width: 'min(84vw, 340px)', aspectRatio: '1', animation: 'ns-fade 1s ease-out both' }}
      >
        <div style={{ width: '100%', height: '100%', animation: 'ns-spin 600s linear 3s infinite' }}>
          <StarChart sky={sky} faint={faint} dirs={inv.copy(TXT)} />
        </div>
      </motion.div>
      <motion.div animate={gate.opening ? { opacity: 0, y: 14 } : {}} transition={{ duration: 0.45 }}
        style={{ marginTop: 'clamp(22px, 5vh, 36px)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {ot.show('kicker') && (
          <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 16, color: C.SILVER, animation: 'ns-rise 1s ease-out 2s both' }}>{ot.text('kicker')}</div>
        )}
        {titleOv !== '' && (
          <div style={{ marginTop: 10, fontFamily: serif, fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(32px, 10vw, 42px)', lineHeight: 1.1, color: C.STARGOLD, animation: 'ns-rise 1.1s ease-out 2.3s both' }}>
            {first}{second && <><span style={{ color: C.SILVER, fontSize: '.7em', margin: '0 .3em' }}>{ot.text('and')}</span>{second}</>}
          </div>
        )}
        {ot.show('meta') && <div style={{ marginTop: 12, fontSize: 13, letterSpacing: '.06em', color: C.MUTED, animation: 'ns-rise .9s ease-out 2.6s both' }}>{ot.text('meta')}</div>}
        {ot.show('cta') && (
          <div style={{ marginTop: 24, padding: '13px 26px', minHeight: 48, borderRadius: 999, border: `1px solid ${alpha(C.SILVER, 0.5)}`, fontSize: 15, color: C.MOON, animation: 'ns-rise .9s ease-out 2.95s both' }}>
            {ot.text('cta')}
          </div>
        )}
        {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 12.5, color: C.MUTED, animation: 'ns-fade .8s ease-out 3.4s both, ns-glint 3s ease-in-out 4.2s infinite' }}>{ot.text('hint')}</div>}
      </motion.div>
    </motion.div>
  )
}

/* Bölmə — mərkəzdə parıltı + kursiv başlıq */
function Field({ id, section, title, kicker, sub, children, serif, style = {} }) {
  const C = usePalette()
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '56px 22px 64px', ...style }}>
      <Reveal style={{ maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <Sparkle size={14} style={{ margin: '0 auto 14px', opacity: 0.9 }} />
            {title && <h2 style={{ margin: 0, fontFamily: serif, fontStyle: 'italic', fontWeight: 300, fontSize: scaleFont('clamp(29px, 8.4vw, 36px)', C.hs), lineHeight: 1.15, color: C.MOON }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontSize: 13, color: C.SILVER }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 300, fontSize: 15, color: C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const pill = (C, filled) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 46, padding: '12px 20px', borderRadius: 999,
  fontSize: 14.5, fontWeight: 500, textDecoration: 'none', cursor: 'pointer',
  background: filled ? C.MOON : 'transparent', color: filled ? C.NIGHT : C.MOON, border: `1px solid ${filled ? C.MOON : alpha(C.SILVER, 0.45)}`,
})
const field = (C) => ({
  width: '100%', background: 'rgba(200,206,224,.06)', border: `1px solid ${alpha(C.SILVER, 0.28)}`, borderRadius: 999,
  padding: '14px 20px', fontSize: 15.5, color: C.MOON, outline: 'none',
})

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function NightSkyTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const T = inv.copy(TXT)
  const serif = theme.fonts.heading
  const sans = theme.fonts.body

  const ll = parseLatLon(weddingData)
  const lat = ll ? ll[0] : 40.38
  const lon = ll ? ll[1] : 49.87
  /* Hesab yalnız tarix/saat/koordinat dəyişəndə — sayğac hər saniyə render edir */
  const sky = useMemo(() => computeSky({ date: weddingData.date, time: weddingData.time, lat, lon }), [weddingData.date, weddingData.time, lat, lon])
  const faint = useMemo(() => faintStars(`${weddingData.date}${lat}`), [weddingData.date, lat])
  const coords = `${dms(lat, 'N', 'S')} · ${dms(lon, 'E', 'W')}`
  const moonPct = Math.round(sky.moon.illum * 100)

  return (
    <PaletteContext.Provider value={C}>
      <div data-ns data-enter={enterDirection(ID)} style={{
        background: `linear-gradient(180deg, ${C.NIGHT} 0%, #0B1124 40%, ${C.NIGHT} 100%)`, backgroundColor: C.NIGHT,
        minHeight: '100vh', fontFamily: sans, color: C.MOON, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
        fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.SILVER, 0.25),
      }}>
        <style>{KEYFRAMES(C)}</style>
        {!inv.opened && <SkyOpening inv={inv} theme={theme} sky={sky} faint={faint} />}

        <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: 'rgba(15,21,38,.85)', border: `1px solid ${alpha(C.SILVER, 0.4)}`, backdropFilter: 'blur(8px)' }}>
          {({ playing }) => <EqBars playing={playing} color={C.STARGOLD} idle={alpha(C.SILVER, 0.4)} />}
        </MusicFab>

        {inv.opened && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
            {/* sönük ulduz tozu — bütün səhifə boyu */}
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `radial-gradient(1px 1px at 12% 18%, ${alpha(C.MOON, 0.7)}, transparent), radial-gradient(1px 1px at 72% 9%, ${alpha(C.MOON, 0.6)}, transparent), radial-gradient(1.5px 1.5px at 38% 46%, ${alpha(C.MOON, 0.5)}, transparent), radial-gradient(1px 1px at 88% 61%, ${alpha(C.MOON, 0.6)}, transparent), radial-gradient(1px 1px at 22% 79%, ${alpha(C.MOON, 0.5)}, transparent), radial-gradient(1.5px 1.5px at 61% 92%, ${alpha(C.MOON, 0.45)}, transparent)`, backgroundSize: '260px 340px' }} />

            <header style={{
              position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(7,11,24,.82)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              borderBottom: `1px solid ${alpha(C.SILVER, 0.12)}`,
            }}>
              <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 14, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: sans }}>
                <span aria-hidden="true">←</span>{tr.btn_back}
              </button>
              <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 17, color: C.SILVER }}>{T.brand}</div>
              <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
            </header>

            {/* HERO */}
            <section data-section="hero" style={{ position: 'relative', padding: '40px 22px 64px', textAlign: 'center' }}>
              <div style={{ width: 'min(70vw, 280px)', margin: '0 auto', opacity: 0.9 }}>
                <StarChart sky={sky} faint={faint.slice(0, 120)} dirs={T} animate={false} />
              </div>
              <div style={{ marginTop: 26, fontSize: 13.5, color: C.SILVER }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              <p style={{ margin: '8px auto 0', maxWidth: 290, fontFamily: serif, fontStyle: 'italic', fontWeight: 300, fontSize: 16.5, lineHeight: 1.5, color: C.MUTED }}>{tr.inv_join}</p>
              <h1 style={{ margin: '22px 0 0', fontFamily: serif, fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(42px, 13vw, 60px)', lineHeight: 1.05, color: C.STARGOLD }}>
                {inv.heroTitle ? inv.heroTitle : inv.isCouple ? (
                  <>{inv.groom}<span style={{ display: 'block', fontSize: '.5em', color: C.SILVER, margin: '6px 0' }}>{inv.and}</span>{inv.bride}</>
                ) : inv.single}
              </h1>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 12, fontSize: 14.5, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              <div style={{ marginTop: 26, fontSize: 18, fontFamily: serif }}>{inv.fullDate}</div>
              <div style={{ marginTop: 6, fontSize: 14.5, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
              <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 12.5, letterSpacing: '.12em', color: C.SILVER }}>
                <Sparkle size={9} color={C.SILVER} />{coords}<Sparkle size={9} color={C.SILVER} />
              </div>
            </section>

            {/* SAYĞAC — o gecənin Ayı */}
            {S.countdown && (
              <Field section="countdown" serif={serif} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <svg viewBox="-60 -60 120 120" width="150" height="150" aria-hidden="true" style={{ overflow: 'visible' }}>
                    <defs>
                      <radialGradient id="ns-moon" cx="40%" cy="38%" r="70%">
                        <stop offset="0" stopColor="#FFFBEF" />
                        <stop offset="1" stopColor="#D9DCE6" />
                      </radialGradient>
                    </defs>
                    <circle r="58" fill={C.STARGOLD} opacity=".06" />
                    <circle r="46" fill="#1A2240" />
                    <path d={moonPath(46, sky.moon.illum, sky.moon.waxing)} fill="url(#ns-moon)" />
                    <circle r="46" fill="none" stroke={C.SILVER} strokeOpacity=".25" strokeWidth=".6" />
                  </svg>
                  <div style={{ marginTop: 10, fontFamily: serif, fontStyle: 'italic', fontSize: 15.5, color: C.SILVER }}>{fill(T.moon, { pct: moonPct })}</div>
                  <div style={{ marginTop: 26, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 'clamp(10px, 4vw, 18px)' }}>
                    {[
                      { v: cd.days, l: cd.labels.days },
                      { v: cd.hours, l: cd.labels.hours },
                      { v: cd.minutes, l: cd.labels.minutes },
                      { v: cd.seconds, l: cd.labels.seconds, pop: true },
                    ].map(({ v, l, pop }, i) => (
                      <div key={l} style={{ display: 'flex', alignItems: 'flex-start', gap: 'clamp(10px, 4vw, 18px)' }}>
                        {i > 0 && <Sparkle size={7} color={alpha(C.SILVER, 0.6)} style={{ marginTop: 16 }} />}
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontFamily: serif, fontWeight: 300, fontSize: 'clamp(30px, 9vw, 40px)', lineHeight: 1, color: pop ? C.STARGOLD : C.MOON, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></div>
                          <div style={{ marginTop: 6, fontSize: 12, color: C.MUTED }}>{l}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Field>
            )}

            <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

            {/* MƏKAN — koordinat şəbəkəsi */}
            {S.venue && (
              <Field section="venue" serif={serif} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
                <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', border: `1px solid ${alpha(C.SILVER, 0.25)}` }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.STARGOLD} height="clamp(240px, 70vw, 320px)"
                    map={{ opacity: 0.55, filter: 'grayscale(1) brightness(.5) contrast(1.2)', tintOpacity: 0.55, tint: '#1B2340', blend: 'color' }}
                    frame={<SkyPin coords={coords} />}
                    fallback={<div style={{ height: 'clamp(240px, 70vw, 320px)', position: 'relative', background: `radial-gradient(circle, #16203F, ${C.DEEP})` }}><SkyPin coords={coords} /></div>}
                  />
                  <span aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(${alpha(C.SILVER, 0.1)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(C.SILVER, 0.1)} 1px, transparent 1px)`, backgroundSize: '44px 44px' }} />
                </div>
                <div style={{ textAlign: 'center', marginTop: 22, fontFamily: serif, fontSize: 24, lineHeight: 1.25 }}>{weddingData.venueName}</div>
                {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 14.5, color: C.MUTED }}>{weddingData.venueNote}</div>}
                <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={pill(C, true)}>{tr.inv_directions_btn}</a>}
                  {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={pill(C, !inv.dirUrl)}>Maps</a>}
                  {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={pill(C, false)}>Waze</a>}
                  {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={pill(C, false)}>Apple</a>}
                </div>
              </Field>
            )}

            {/* PROQRAM — axşamın bürcü */}
            {S.program && (
              <Field section="program" serif={serif} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
                {/* Sol zolaqda bürc: ulduzlar zigzaqla düzülür, xətlər bir-birinə
                    bağlayır; mətn sağda tək sütunda — xətt heç vaxt mətni kəsmir. */}
                <ol style={{ listStyle: 'none', margin: '0 auto', padding: 0, maxWidth: 380 }}>
                  {timeline.events.map((ev, i) => {
                    const xs = [16, 52, 30, 58, 20, 46]
                    const x = xs[i % xs.length]
                    const nx = xs[(i + 1) % xs.length]
                    const last = i === timeline.events.length - 1
                    const big = i === 0 || last
                    return (
                      <li key={i} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '76px 1fr', minHeight: 78 }}>
                        {!last && (
                          <svg aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 76 100" style={{ position: 'absolute', left: 0, top: 13, width: 76, height: '100%', overflow: 'visible' }}>
                            <line x1={x} y1="0" x2={nx} y2="100" stroke={C.SILVER} strokeOpacity=".45" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                          </svg>
                        )}
                        <span aria-hidden="true" style={{ position: 'absolute', left: x, top: 13, width: 0, height: 0 }}>
                          <span style={{ position: 'absolute', width: 40, height: 40, left: -20, top: -20, borderRadius: '50%', background: `radial-gradient(circle, ${alpha(C.STARGOLD, 0.32)}, transparent 65%)` }} />
                          <Sparkle size={big ? 22 : 16} style={{ position: 'absolute', left: big ? -11 : -8, top: big ? -11 : -8 }} />
                        </span>
                        <div style={{ gridColumn: 2, paddingBottom: 24, minWidth: 0 }}>
                          <div style={{ fontSize: 13, letterSpacing: '.1em', color: C.STARGOLD, fontVariantNumeric: 'tabular-nums', lineHeight: '26px' }}>{ev.time}</div>
                          <div style={{ marginTop: 2, fontFamily: serif, fontSize: 19.5, lineHeight: 1.3 }}>{ev.label}</div>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </Field>
            )}

            {S.dresscode && (
              <Field section="dresscode" serif={serif} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
                <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={serif} align="center" onDark />
              </Field>
            )}

            {/* MASA — sizin ulduzunuz */}
            {S.seating && !seating.isEmpty && (
              <Field section="seating" serif={serif} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
                <input {...seatInputProps(inv, 'ns-seat-list')} style={field(C)} />
                <SeatSuggest inv={inv} id="ns-seat-list" c={{ bg: C.DEEP, border: `1px solid ${alpha(C.SILVER, 0.25)}`, active: alpha(C.SILVER, 0.1), text: C.MOON, table: C.STARGOLD, radius: 16 }} />
                {seating.showNotFound && <div style={{ marginTop: 12, fontSize: 14, color: C.MUTED, textAlign: 'center' }}>{tr.inv_seat_fullname}</div>}
                {seating.selected && (
                  <div style={{ marginTop: 26, textAlign: 'center', padding: '28px 20px', borderRadius: 22, background: `radial-gradient(90% 90% at 50% 20%, ${alpha(C.STARGOLD, 0.12)}, ${alpha(C.DEEP, 0.9)})`, border: `1px solid ${alpha(C.SILVER, 0.2)}` }}>
                    <Sparkle size={30} style={{ margin: '0 auto' }} />
                    <div style={{ marginTop: 12, fontSize: 15, color: C.SILVER }}>{seating.selected.full_name}</div>
                    <div style={{ marginTop: 6, fontFamily: serif, fontStyle: 'italic', fontWeight: 300, fontSize: 44, lineHeight: 1, color: C.STARGOLD }}>{seating.selected.table_id}</div>
                    {seating.tablemates.length > 0 && <div style={{ marginTop: 14, fontSize: 14.5, color: C.MUTED, lineHeight: 1.6 }}>{seating.tablemates.map((g) => g.full_name).join(', ')}</div>}
                    <button onClick={seating.reset} data-press style={{ marginTop: 8, background: 'none', border: 'none', color: C.MOON, fontSize: 14, minHeight: 44, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: sans }}>
                      {seatingL.again || 'Yenidən axtar'}
                    </button>
                  </div>
                )}
              </Field>
            )}

            {/* FOTOLAR */}
            {S.gallery && (
              <Field section="gallery" id="gallery-section" serif={serif} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
                {gallery.demoPhotos.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 28 }}>
                    {gallery.demoPhotos.map((url, i) => (
                      <div key={i} style={{ aspectRatio: '1', borderRadius: '50%', overflow: 'hidden', border: `1px solid ${alpha(C.SILVER, 0.3)}`, background: C.DEEP }}>
                        <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'saturate(.7) brightness(.9)' }} />
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', padding: 14, borderRadius: 20, background: C.MOON }}>
                    <QRCodeSVG value={gallery.photoShareUrl} size={128} bgColor={C.MOON} fgColor={C.NIGHT} level="M" />
                  </div>
                  <div style={{ marginTop: 12, fontSize: 14, color: C.MUTED }}>{tr.inv_scan_upload}</div>
                  <a data-press href={gallery.photoShareUrl} style={{ ...pill(C, true), marginTop: 18 }}>{tr.inv_gallery_btn}</a>
                  <p style={{ margin: '16px auto 0', maxWidth: 340, fontSize: 15, color: C.MUTED, lineHeight: 1.65 }}>{tr.inv_gallery_desc}</p>
                </div>
              </Field>
            )}

            {/* RSVP */}
            {S.rsvp && (
              <Field section="rsvp" serif={serif} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
                <ReplyForm inv={inv} t={{ ink: C.MOON, muted: C.MUTED, line: alpha(C.SILVER, 0.4), hair: alpha(C.SILVER, 0.14), accent: C.STARGOLD, font: sans, display: serif, displayItalic: true, doneMark: <Sparkle size={20} style={{ margin: '0 auto 10px' }} />, marker: (a) => <Sparkle size={13} color={a ? C.STARGOLD : alpha(C.SILVER, 0.35)} />, suggest: { bg: C.DEEP, border: `1px solid ${alpha(C.SILVER, 0.25)}`, active: alpha(C.SILVER, 0.1), text: C.MOON, table: C.STARGOLD, radius: 16 } }} />
              </Field>
            )}

            {/* ULDUZLARA DİLƏK */}
            {S.guestbook && (
              <Field section="guestbook" serif={serif} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
                <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 30 }}>
                  <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={field(C)} />
                  <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...field(C), borderRadius: 22, resize: 'none', lineHeight: 1.5 }} />
                  <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...pill(C, gbook.canSubmit), width: '100%', opacity: gbook.canSubmit ? 1 : 0.45, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}>
                    {gbook.sending ? gbookL.sending : gbookL.btn}
                  </button>
                  {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 13.5 }}>⚠ {gbookL.error}</p>}
                </form>
                <div style={{ display: 'grid', gap: 24 }}>
                  {gbook.messages.map((raw, i) => {
                    const m = gbook.readMessage(raw)
                    return (
                      <figure key={m.name + i} style={{ margin: 0, display: 'grid', gridTemplateColumns: '22px 1fr', gap: 12 }}>
                        <Sparkle size={14} style={{ marginTop: 6 }} color={i % 2 ? C.SILVER : C.STARGOLD} />
                        <div>
                          <blockquote style={{ margin: 0, fontFamily: serif, fontStyle: 'italic', fontWeight: 300, fontSize: 18.5, lineHeight: 1.5 }}>{m.text}</blockquote>
                          <figcaption style={{ marginTop: 8, fontSize: 13.5, color: C.MUTED }}>{m.name}{m.date ? `, ${gbook.formatDate(m.date)}` : ''}</figcaption>
                        </div>
                      </figure>
                    )
                  })}
                </div>
              </Field>
            )}

            <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={serif} />
          </motion.div>
        )}
      </div>
    </PaletteContext.Provider>
  )
}

function SkyPin({ coords }) {
  const C = usePalette()
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
      <span style={{ position: 'relative', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: alpha(C.STARGOLD, 0.18) }} />
        <Sparkle size={20} />
      </span>
      <span style={{ fontSize: 11.5, letterSpacing: '.1em', color: C.SILVER, background: alpha(C.NIGHT, 0.7), padding: '4px 10px', borderRadius: 999 }}>{coords}</span>
    </span>
  )
}
