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

/* ─────────────────────────────────────────────────────────────────────────────
   CINEMA PREMIERE — «Qırmızı xalça premyerası» (premium redizayn, 2026-10)

   Konsept: art-deko kino sarayında premyera gecəsi. Açılış — qırmızı məxmər
   pərdə, qızıl zərli saçaq, ortada lampaları qaçan «marquee» lövhəsində
   qara hərflərlə adlar. Toxunanda lövhə sönür, pərdə iki yana açılır.
   Daxildə:
     hero      → art-deko afişa: günəş şüaları, «billing block» titrləri
     sayğac    → kinoplyonkanın geri sayım lideri
     məkan     → məxmər pərdəli ekran
     proqram   → kinoplyonka: hər kadr bir seans
     masa      → «bir nəfərlik» qırmızı kino bileti
     RSVP      → kassa
     arzular   → afişadakı kimi ★★★★★ tamaşaçı rəyləri
   Rəng: məxmər qırmızı, kino qarası, zər, marquee işığı.
   Şriftlər: Big Shoulders Display (art-deko kondens) · Playfair Display.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('cinema-premiere')
const ID = 'cinema-premiere'

const LABELS = {
  countdown: { title: { az: 'Seansa qalıb', en: 'Until showtime', ru: 'До сеанса' } },
  venue:     { title: { az: 'Kinoteatr', en: 'The theatre', ru: 'Кинотеатр' } },
  program:   { title: { az: 'Seanslar', en: 'Showtimes', ru: 'Сеансы' } },
  dresscode: { title: { az: 'Qırmızı xalça', en: 'Red carpet', ru: 'Красная дорожка' } },
  seating:   { title: { az: 'Yeriniz', en: 'Your seat', ru: 'Ваше место' } },
  gallery:   { title: { az: 'Kadrlar', en: 'Stills', ru: 'Кадры' } },
  rsvp:      { title: { az: 'Biletinizi təsdiqləyin', en: 'Confirm your ticket', ru: 'Подтвердите билет' } },
  guestbook: { title: { az: 'Tamaşaçı rəyləri', en: 'Audience reviews', ru: 'Отзывы зрителей' } },
}

const CREDITS = {
  az: { presents: 'təqdim edir', star: (n) => `Baş rollarda ${n}`, rest: ['Ssenari: Sevgi', 'Rejissor: Tale', 'Musiqi: Ürək döyüntüsü'], premiere: 'Premyera', admit: 'Bir nəfərlik', table: 'Masa', hall: 'Zal' },
  en: { presents: 'presents', star: (n) => `Starring ${n}`, rest: ['Written by Love', 'Directed by Fate', 'Music by Heartbeat'], premiere: 'Premiere', admit: 'Admit one', table: 'Table', hall: 'Hall' },
  ru: { presents: 'представляет', star: (n) => `В главных ролях ${n}`, rest: ['Сценарий: Любовь', 'Режиссёр: Судьба', 'Музыка: Сердцебиение'], premiere: 'Премьера', admit: 'Входной билет', table: 'Стол', hall: 'Зал' },
}

const BLACK = '#0B0A0C'
const VELVET = '#7A111B'
const GOLD = '#D9A441'
const GOLD_L = '#F1CF7E'
const LIGHT = '#FFF3DA'
const IVORY = '#F2EBDD'
const MUTED = '#A9A39A'
const GOLD_TEXT = `linear-gradient(180deg, ${GOLD_L} 10%, ${GOLD} 55%, #9C6E22 100%)`
const CURTAIN = `repeating-linear-gradient(90deg, #3E070D 0, #7A111B 2.2%, #A72330 3.6%, #7A111B 5%, #3E070D 7%)`

const KEYFRAMES = `
@keyframes cp-bulb  { 0%,100% { opacity: .35 } 40% { opacity: 1 } }
@keyframes cp-rise  { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes cp-fade  { from { opacity: 0 } to { opacity: 1 } }
@keyframes cp-on    { 0% { opacity: 0 } 10% { opacity: .8 } 14% { opacity: .2 } 30% { opacity: 1 } 100% { opacity: 1 } }
@keyframes cp-sweep { to { transform: rotate(360deg) } }
@keyframes cp-hint  { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
[data-cp] span[aria-hidden="true"], [data-cp] svg[aria-hidden="true"], [data-cp] div[aria-hidden="true"] { pointer-events: none; }
[data-cp] ::placeholder { color: rgba(169,163,154,.6); }
[data-cp] input:focus-visible, [data-cp] textarea:focus-visible { border-color: ${GOLD} !important; outline: none; }
[data-cp] button:focus-visible, [data-cp] a:focus-visible, [data-cp] [role="button"]:focus-visible { outline: 1.5px solid ${GOLD}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-cp] *, [data-cp] { animation: none !important; transition: none !important; } }
`

const upper = (s, lang) => String(s || '').toLocaleUpperCase(lang === 'ru' ? 'ru' : lang === 'en' ? 'en' : 'az')

/* Marquee lampaları — düzbucaqlının perimetri boyunca */
function bulbs(w, h, gap = 18) {
  const out = []
  const per = 2 * (w + h)
  const n = Math.floor(per / gap)
  for (let i = 0; i < n; i++) {
    let d = (i / n) * per, x, y
    if (d < w) { x = d; y = 0 } else if ((d -= w) < h) { x = w; y = d } else if ((d -= h) < w) { x = w - d; y = h } else { d -= w; x = 0; y = h - d }
    out.push([x, y])
  }
  return out
}
const BULBS = bulbs(300, 230)

/* Zərli saçaq — pərdənin üstü */
function Valance() {
  return (
    <svg viewBox="0 0 400 70" preserveAspectRatio="none" width="100%" height="70" aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="cp-val" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5A0A12" /><stop offset="1" stopColor="#8E1A24" /></linearGradient>
      </defs>
      <rect width="400" height="26" fill="url(#cp-val)" />
      <path d={Array.from({ length: 8 }, (_, i) => `M${i * 50} 26Q${i * 50 + 25} 62 ${i * 50 + 50} 26`).join('')} fill="url(#cp-val)" stroke={GOLD} strokeWidth="1.4" />
      <path d="M0 24H400" stroke={GOLD} strokeWidth="2" />
      {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={i * 50} cy="27" r="3.2" fill={GOLD} />)}
      {Array.from({ length: 80 }, (_, i) => {
        const x = i * 5 + 2.5, k = (x % 50) / 50
        const yb = 26 + Math.sin(Math.PI * k) * 36
        return <path key={`f${i}`} d={`M${x} ${yb}v6`} stroke={GOLD} strokeWidth="1" strokeOpacity=".8" />
      })}
    </svg>
  )
}

/* Art-deko yelpik — bölmə nişanı */
function Fan({ size = 40, color = GOLD }) {
  return (
    <svg viewBox="-20 -20 40 22" width={size} height={size * 0.55} aria-hidden="true" style={{ display: 'block', margin: '0 auto' }}>
      {Array.from({ length: 9 }, (_, i) => {
        const a = Math.PI + (i / 8) * Math.PI
        return <path key={i} d={`M0 0L${(Math.cos(a) * 18).toFixed(1)} ${(Math.sin(a) * 18).toFixed(1)}`} stroke={color} strokeWidth="1" />
      })}
      <path d="M-18 0A18 18 0 0 1 18 0" fill="none" stroke={color} strokeWidth="1.2" />
      <path d="M-7 0A7 7 0 0 1 7 0Z" fill={color} />
    </svg>
  )
}

/* ═══ 01 — AÇILIŞ: pərdə + marquee ═══ */
function PremiereOpening({ inv, theme }) {
  const { ot, lang } = inv
  const gate = useGate({ inv, ms: 1450 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const head = theme.fonts.heading
  const l1 = upper(first, lang), l2 = second ? `& ${upper(second, lang)}` : ''
  const longest = Math.max(Array.from(l1).length, Array.from(l2).length, 4)
  const fs = Math.round(Math.max(26, Math.min(46, 250 / (longest * 0.5))))
  const curtain = (side) => ({
    position: 'absolute', top: 0, bottom: 0, width: '52%', [side]: 0,
    background: `linear-gradient(180deg, rgba(0,0,0,.45), transparent 22%, transparent 70%, rgba(0,0,0,.5)), ${CURTAIN}`,
    boxShadow: side === 'left' ? 'inset -18px 0 30px rgba(0,0,0,.5)' : 'inset 18px 0 30px rgba(0,0,0,.5)',
  })
  return (
    <motion.div {...gate.gateProps} data-cp
      animate={gate.opening ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.1 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: `radial-gradient(70% 50% at 50% 50%, #FFF8E8, #D9CBB0 40%, ${BLACK} 100%)`, color: IVORY, fontFamily: theme.fonts.body }}>
      <motion.div animate={gate.opening ? { x: '-100%', scaleX: 0.7 } : {}} transition={{ duration: 1.1, ease: [0.6, 0, 0.3, 1], delay: 0.35 }} style={{ ...curtain('left'), transformOrigin: 'left center' }} />
      <motion.div animate={gate.opening ? { x: '100%', scaleX: 0.7 } : {}} transition={{ duration: 1.1, ease: [0.6, 0, 0.3, 1], delay: 0.35 }} style={{ ...curtain('right'), transformOrigin: 'right center' }} />
      <motion.div animate={gate.opening ? { y: -90 } : {}} transition={{ duration: 0.9, delay: 0.4 }} style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
        <Valance />
      </motion.div>

      <motion.div animate={gate.opening ? { opacity: 0, y: -24 } : {}} transition={{ duration: 0.35 }}
        style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 18px 0', textAlign: 'center' }}>
        {ot.show('kicker') && <div style={{ fontFamily: theme.fonts.body, fontStyle: 'italic', fontSize: 18, color: GOLD_L, textShadow: '0 2px 10px rgba(0,0,0,.6)', animation: 'cp-rise .9s ease-out .5s both' }}>{ot.text('kicker')}</div>}
        {/* marquee */}
        <div style={{ position: 'relative', width: 'min(86vw, 330px)', aspectRatio: '300 / 230', marginTop: 14, animation: 'cp-rise 1s cubic-bezier(.2,.8,.2,1) .3s both' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 10, background: 'linear-gradient(180deg, #2A2320, #120E0C)', boxShadow: `0 0 0 2px ${GOLD}, 0 0 0 6px #1A1310, 0 0 0 7px ${alpha(GOLD, 0.6)}, 0 30px 60px rgba(0,0,0,.6)` }} />
          <svg viewBox="-12 -12 324 254" width="100%" height="100%" aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            {BULBS.map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="6" fill="#FFD88A" opacity=".25" />
                <circle cx={x} cy={y} r="3.4" fill="#FFE9B8" style={{ animation: `cp-bulb 1.2s ease-in-out ${((i % 3) * 0.4).toFixed(1)}s infinite` }} />
              </g>
            ))}
          </svg>
          <div style={{
            position: 'absolute', inset: '14% 9%', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: `repeating-linear-gradient(180deg, transparent 0 ${fs * 1.18 - 2}px, rgba(0,0,0,.12) ${fs * 1.18 - 2}px ${fs * 1.18}px), linear-gradient(180deg, #FFFBF0, ${LIGHT} 60%, #F5E2B8)`,
            boxShadow: 'inset 0 0 22px rgba(255,200,120,.55), 0 0 30px rgba(255,220,150,.35)', animation: 'cp-on 1.4s linear .9s both',
          }}>
            {titleOv !== '' && (
              <div style={{ fontFamily: head, fontWeight: 800, fontSize: fs, lineHeight: 1.18, color: '#141010', letterSpacing: '.04em' }}>
                <div>{l1}</div>{l2 && <div>{l2}</div>}
              </div>
            )}
            {ot.show('sub') && <div style={{ marginTop: 6, fontFamily: theme.fonts.body, fontStyle: 'italic', fontSize: 14, color: VELVET }}>{ot.text('sub')}</div>}
          </div>
        </div>
        {ot.show('meta') && <div style={{ marginTop: 26, fontFamily: head, fontWeight: 700, fontSize: 16, letterSpacing: '.14em', color: IVORY, textShadow: '0 2px 10px rgba(0,0,0,.7)', animation: 'cp-rise .9s ease-out 1.6s both' }}>{upper(ot.text('meta'), lang)}</div>}
        {ot.show('cta') && (
          <div style={{ marginTop: 20, minHeight: 50, padding: '13px 30px', display: 'inline-flex', alignItems: 'center', background: GOLD_TEXT, color: '#1A1208', fontFamily: head, fontWeight: 800, fontSize: 17, letterSpacing: '.12em', clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0 50%)', animation: 'cp-rise .9s ease-out 1.9s both' }}>
            {upper(ot.text('cta'), lang)}
          </div>
        )}
        {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 13.5, fontStyle: 'italic', color: '#F3D9C0', textShadow: '0 1px 6px rgba(0,0,0,.7)', animation: 'cp-fade .8s ease-out 2.3s both, cp-hint 3s ease-in-out 3.1s infinite' }}>{ot.text('hint')}</div>}
      </motion.div>
    </motion.div>
  )
}

/* Bölmə */
function Reel({ id, section, title, kicker, sub, children, head, lang, center = true }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '58px 20px 64px' }}>
      <Reveal style={{ maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 30 }}>
            {center && <Fan />}
            {title && <h2 style={{ margin: '14px 0 0', fontFamily: head, fontWeight: 800, fontSize: 'clamp(34px, 10.5vw, 46px)', lineHeight: 1, letterSpacing: '.03em', background: GOLD_TEXT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{upper(title, lang)}</h2>}
            {kicker && <div style={{ marginTop: 8, fontStyle: 'italic', fontSize: 16, color: MUTED }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 320, fontSize: 15.5, color: MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: '#141215', border: `1px solid ${alpha(GOLD, 0.35)}`, borderRadius: 2,
  padding: '14px 16px', fontSize: 16, color: IVORY, outline: 'none',
}
const btn = (on, head) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 2,
  fontFamily: head, fontWeight: 700, fontSize: 16, letterSpacing: '.1em', textDecoration: 'none', cursor: 'pointer',
  background: on ? GOLD_TEXT : 'transparent', color: on ? '#1A1208' : GOLD_L, border: on ? 'none' : `1px solid ${alpha(GOLD, 0.6)}`,
})

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function CinemaPremiereTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const C = CREDITS[lang] || CREDITS.az
  const names = inv.heroTitle || (inv.isCouple ? `${inv.groom} & ${inv.bride}` : inv.single)
  const [y, m, d] = String(weddingData.date || '').split('-')
  const dotted = d ? `${d}.${m}.${y}` : ''
  const P = { head, lang }

  return (
    <div data-cp data-enter={enterDirection(ID)} style={{
      background: `radial-gradient(120% 50% at 50% 0%, #2A0A0F, ${BLACK} 60%)`, backgroundColor: BLACK,
      minHeight: '100vh', fontFamily: body, color: IVORY, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(GOLD, 0.3),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <PremiereOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: '#141215', border: `1px solid ${alpha(GOLD, 0.5)}` }}>
        {({ playing }) => <EqBars playing={playing} color={GOLD} idle={alpha(GOLD, 0.35)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(BLACK, 0.88), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(GOLD, 0.22)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: MUTED, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 800, fontSize: 17, letterSpacing: '.16em', color: GOLD }}>DIGITOY PICTURES</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — art-deko afişa */}
          <section style={{ padding: '24px 14px 30px' }}>
            <div style={{ position: 'relative', maxWidth: 440, margin: '0 auto', padding: '40px 22px 26px', textAlign: 'center', overflow: 'hidden',
              background: `repeating-conic-gradient(from 180deg at 50% 0%, ${alpha(GOLD, 0.09)} 0deg 4deg, transparent 4deg 9deg), linear-gradient(180deg, #1C0A0E, #0E0A0B 70%)`,
              boxShadow: `inset 0 0 0 1px ${GOLD}, inset 0 0 0 6px #0E0A0B, inset 0 0 0 7px ${alpha(GOLD, 0.55)}, 0 30px 60px -30px #000`,
            }}>
              {[0, 1, 2, 3].map((c) => (
                <svg key={c} viewBox="0 0 30 30" width="30" height="30" aria-hidden="true" style={{ position: 'absolute', [c < 2 ? 'top' : 'bottom']: 12, [c % 2 ? 'right' : 'left']: 12, transform: `scale(${c % 2 ? -1 : 1}, ${c < 2 ? 1 : -1})` }}>
                  <path d="M0 30V10H10V0H30M5 30V15H15V5H30" fill="none" stroke={GOLD} strokeWidth="1.2" />
                </svg>
              ))}
              <div style={{ fontFamily: head, fontWeight: 700, fontSize: 14, letterSpacing: '.3em', color: GOLD_L }}>DIGITOY PICTURES</div>
              <div style={{ marginTop: 4, fontStyle: 'italic', fontSize: 15, color: MUTED }}>{C.presents}</div>
              <div style={{ marginTop: 26, fontStyle: 'italic', fontSize: 16, color: IVORY }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              <h1 style={{ margin: '10px 0 0', fontFamily: head, fontWeight: 800, fontSize: 'clamp(46px, 15vw, 72px)', lineHeight: 0.95, letterSpacing: '.02em', background: GOLD_TEXT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', textWrap: 'balance' }}>
                {inv.heroTitle ? upper(inv.heroTitle, lang) : inv.isCouple ? <>{upper(inv.groom, lang)}<span style={{ display: 'block', fontFamily: body, fontStyle: 'italic', fontWeight: 400, fontSize: '.42em', lineHeight: 1.4 }}>&amp;</span>{upper(inv.bride, lang)}</> : upper(inv.single, lang)}
              </h1>
              {inv.ot.show('sub') && <div style={{ marginTop: 16, fontStyle: 'italic', fontSize: 19, color: IVORY }}>{inv.ot.text('sub')}</div>}
              <div style={{ margin: '28px auto 0', display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: head, fontWeight: 700, fontSize: 24, letterSpacing: '.08em' }}>
                <span style={{ width: 28, height: 1, background: GOLD }} />{dotted}<span style={{ width: 28, height: 1, background: GOLD }} />
              </div>
              <div style={{ marginTop: 4, fontSize: 15, color: MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 8, fontSize: 14.5, color: MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              {/* billing block */}
              <div style={{ marginTop: 26, paddingTop: 14, borderTop: `1px solid ${alpha(GOLD, 0.3)}`, fontFamily: head, fontWeight: 500, fontSize: 12.5, lineHeight: 1.5, letterSpacing: '.12em', color: alpha(IVORY, 0.7), textWrap: 'balance' }}>
                {upper([C.star(names), ...C.rest, `${C.premiere} ${dotted}`].join(' · '), lang)}
              </div>
            </div>
            <p style={{ margin: '26px auto 0', maxWidth: 320, textAlign: 'center', fontStyle: 'italic', fontSize: 17, lineHeight: 1.55, color: MUTED }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — plyonka lideri */}
          {S.countdown && (
            <Reel {...P} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ position: 'relative', width: 'min(70vw, 240px)', aspectRatio: '1', margin: '0 auto' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, #E9E1D2, #BDB29E)', boxShadow: '0 0 0 6px #141215, 0 0 0 7px ' + alpha(GOLD, 0.5) }} />
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'conic-gradient(rgba(20,16,16,.28) 0 60deg, transparent 60deg)', animation: 'cp-sweep 4s linear infinite' }} />
                <svg viewBox="-50 -50 100 100" width="100%" height="100%" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
                  <circle r="44" fill="none" stroke="#141010" strokeWidth=".8" />
                  <circle r="36" fill="none" stroke="#141010" strokeWidth=".8" />
                  <path d="M-50 0H50M0 -50V50" stroke="#141010" strokeWidth=".6" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#141010' }}>
                  <div style={{ fontFamily: head, fontWeight: 800, fontSize: 'clamp(56px, 18vw, 78px)', lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>{cd.days}</div>
                  <div style={{ fontFamily: head, fontWeight: 700, fontSize: 14, letterSpacing: '.2em' }}>{upper(cd.labels.days, lang)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 22, marginTop: 24 }}>
                {[
                  { v: cd.hours, l: cd.labels.hours },
                  { v: cd.minutes, l: cd.labels.minutes },
                  { v: cd.seconds, l: cd.labels.seconds, pop: true },
                ].map(({ v, l, pop }) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: head, fontWeight: 800, fontSize: 36, lineHeight: 1, color: pop ? GOLD_L : IVORY, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></div>
                    <div style={{ marginTop: 4, fontFamily: head, fontWeight: 500, fontSize: 12.5, letterSpacing: '.16em', color: MUTED }}>{upper(l, lang)}</div>
                  </div>
                ))}
              </div>
            </Reel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN — pərdəli ekran */}
          {S.venue && (
            <Reel {...P} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ position: 'relative', padding: '14px 26px 0' }}>
                <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 34, background: CURTAIN, borderRadius: '0 0 40% 0', boxShadow: 'inset -6px 0 10px rgba(0,0,0,.5)' }} />
                <div aria-hidden="true" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 34, background: CURTAIN, borderRadius: '0 0 0 40%', boxShadow: 'inset 6px 0 10px rgba(0,0,0,.5)' }} />
                <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 14, background: `linear-gradient(180deg, #5A0A12, ${VELVET})`, borderBottom: `1.5px solid ${GOLD}` }} />
                <div style={{ position: 'relative', overflow: 'hidden', boxShadow: '0 0 40px rgba(255,240,210,.12)' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={GOLD} height="clamp(210px, 58vw, 270px)"
                    map={{ opacity: 0.65, filter: 'grayscale(1) contrast(1.15) brightness(.85)', tintOpacity: 0.25, tint: '#E9E1D2', blend: 'multiply' }}
                    frame={<ScreenPin />}
                    fallback={<div style={{ height: 'clamp(210px, 58vw, 270px)', position: 'relative', background: 'radial-gradient(circle, #E9E1D2, #9E9483)' }}><ScreenPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 700, fontSize: 28, letterSpacing: '.04em', lineHeight: 1.1 }}>{upper(weddingData.venueName, lang)}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 6, fontStyle: 'italic', fontSize: 16, color: MUTED }}>{weddingData.venueNote}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={btn(true, head)}>{upper(tr.inv_directions_btn, lang)}</a>}
                {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={btn(!inv.dirUrl, head)}>MAPS</a>}
                {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(false, head)}>WAZE</a>}
                {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(false, head)}>APPLE</a>}
              </div>
            </Reel>
          )}

          {/* PROQRAM — kinoplyonka */}
          {S.program && (
            <Reel {...P} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {timeline.events.map((ev, i) => (
                  <li key={i} style={{ display: 'grid', gridTemplateColumns: '96px 1fr', alignItems: 'stretch', gap: 16 }}>
                    <div style={{ position: 'relative', background: '#16130F', padding: '6px 16px', display: 'flex', alignItems: 'center' }}>
                      <span aria-hidden="true" style={{ position: 'absolute', left: 3, top: 0, bottom: 0, width: 8, backgroundImage: SPROCKET, backgroundSize: '8px 14px' }} />
                      <span aria-hidden="true" style={{ position: 'absolute', right: 3, top: 0, bottom: 0, width: 8, backgroundImage: SPROCKET, backgroundSize: '8px 14px' }} />
                      <div style={{ width: '100%', minHeight: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #3A2A1A, #1D1610)', boxShadow: `inset 0 0 0 1px ${alpha(GOLD, 0.25)}`, fontFamily: head, fontWeight: 800, fontSize: 20, letterSpacing: '.04em', color: GOLD_L, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    </div>
                    <div style={{ padding: '16px 0', borderBottom: `1px solid ${alpha(GOLD, 0.16)}`, display: 'flex', alignItems: 'center', minWidth: 0 }}>
                      <div style={{ fontFamily: body, fontSize: 19, lineHeight: 1.3 }}>{ev.label}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </Reel>
          )}

          {S.dresscode && (
            <Reel {...P} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={body} align="center" onDark italic />
            </Reel>
          )}

          {/* MASA — kino bileti */}
          {S.seating && !seating.isEmpty && (
            <Reel {...P} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <input {...seatInputProps(inv, 'cp-seat-list')} style={field} />
              <SeatSuggest inv={inv} id="cp-seat-list" c={{ bg: '#141215', border: `1px solid ${alpha(GOLD, 0.35)}`, active: alpha(GOLD, 0.12), text: IVORY, table: GOLD_L, radius: 2, font: body }} />
              {seating.showNotFound && <div style={{ marginTop: 12, fontStyle: 'italic', fontSize: 15, color: MUTED, textAlign: 'center' }}>{tr.inv_seat_fullname}</div>}
              {seating.selected && (
                <div style={{ position: 'relative', maxWidth: 320, margin: '28px auto 0', padding: 12, background: '#B3262F', color: '#FFF1DE',
                  WebkitMask: 'radial-gradient(circle at 0 50%, transparent 6px, #000 6.5px) 0 0 / 51% 18px repeat-y, radial-gradient(circle at 100% 50%, transparent 6px, #000 6.5px) 100% 0 / 51% 18px repeat-y',
                  mask: 'radial-gradient(circle at 0 50%, transparent 6px, #000 6.5px) 0 0 / 51% 18px repeat-y, radial-gradient(circle at 100% 50%, transparent 6px, #000 6.5px) 100% 0 / 51% 18px repeat-y',
                  animation: 'cp-rise .6s ease-out both' }}>
                  <div style={{ border: '1.5px dashed rgba(255,241,222,.6)', padding: '14px 16px', textAlign: 'center' }}>
                    <div style={{ fontFamily: head, fontWeight: 700, fontSize: 14, letterSpacing: '.3em' }}>{upper(C.admit, lang)}</div>
                    <div style={{ marginTop: 8, fontSize: 15 }}>{seating.selected.full_name}</div>
                    <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 10 }}>
                      <span style={{ fontFamily: head, fontWeight: 700, fontSize: 16, letterSpacing: '.2em' }}>{upper(C.table, lang)}</span>
                      <span style={{ fontFamily: head, fontWeight: 800, fontSize: 64, lineHeight: 1 }}>{seating.selected.table_id}</span>
                    </div>
                    {seating.tablemates.length > 0 && <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.5, opacity: 0.9 }}>{seating.tablemates.map((g) => g.full_name).join(', ')}</div>}
                  </div>
                </div>
              )}
              {seating.selected && (
                <div style={{ textAlign: 'center' }}>
                  <button onClick={seating.reset} data-press style={{ marginTop: 10, background: 'none', border: 'none', color: GOLD_L, fontSize: 15, minHeight: 44, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: body }}>
                    {seatingL.again || 'Yenidən axtar'}
                  </button>
                </div>
              )}
            </Reel>
          )}

          {/* FOTOLAR — plyonka kadrları */}
          {S.gallery && (
            <Reel id="gallery-section" {...P} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ position: 'relative', background: '#16130F', padding: '18px 8px', marginBottom: 28 }}>
                  <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 3, height: 8, backgroundImage: SPROCKET_H, backgroundSize: '14px 8px' }} />
                  <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 3, height: 8, backgroundImage: SPROCKET_H, backgroundSize: '14px 8px' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                    {gallery.demoPhotos.map((url, i) => (
                      <div key={i} style={{ aspectRatio: '4 / 3', background: '#2A2420', overflow: 'hidden' }}>
                        <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'sepia(.25) contrast(1.05)' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: 12, background: IVORY, boxShadow: `0 0 0 1px ${GOLD}, 0 0 0 6px ${BLACK}, 0 0 0 7px ${alpha(GOLD, 0.5)}` }}>
                  <QRCodeSVG value={gallery.photoShareUrl} size={128} bgColor={IVORY} fgColor="#141010" level="M" />
                </div>
                <div style={{ marginTop: 16, fontSize: 15, color: MUTED }}>{tr.inv_scan_upload}</div>
                <a data-press href={gallery.photoShareUrl} style={{ ...btn(true, head), marginTop: 16 }}>{upper(tr.inv_gallery_btn, lang)}</a>
                <p style={{ margin: '16px auto 0', maxWidth: 340, fontSize: 15.5, color: MUTED, lineHeight: 1.6 }}>{tr.inv_gallery_desc}</p>
              </div>
            </Reel>
          )}

          {/* RSVP — kassa */}
          {S.rsvp && (
            <Reel {...P} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{ ink: IVORY, muted: MUTED, line: alpha(GOLD, 0.45), hair: alpha(GOLD, 0.16), accent: GOLD_L, font: body, display: head, radius: 2, btnFont: head, btnUpper: true, btnTracking: '.12em', doneMark: <Fan size={30} />, marker: (a) => <span style={{ color: a ? GOLD_L : alpha(GOLD, 0.35), fontSize: 13, lineHeight: 1 }}>★</span>, suggest: { bg: '#141215', border: `1px solid ${alpha(GOLD, 0.35)}`, active: alpha(GOLD, 0.12), text: IVORY, table: GOLD_L, radius: 2, font: body } }} />
            </Reel>
          )}

          {/* TAMAŞAÇI RƏYLƏRİ */}
          {S.guestbook && (
            <Reel {...P} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 34 }}>
                <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={field} />
                <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...field, resize: 'none', lineHeight: 1.5 }} />
                <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...btn(gbook.canSubmit, head), width: '100%', opacity: gbook.canSubmit ? 1 : 0.5, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}>
                  {gbook.sending ? gbookL.sending : upper(gbookL.btn, lang)}
                </button>
                {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 14 }}>⚠ {gbookL.error}</p>}
              </form>
              <div style={{ display: 'grid', gap: 30, textAlign: 'center' }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0 }}>
                      <div aria-hidden="true" style={{ fontSize: 17, letterSpacing: '.3em', color: GOLD }}>★★★★★</div>
                      <blockquote style={{ margin: '10px 0 0', fontStyle: 'italic', fontSize: 20, lineHeight: 1.45, color: IVORY }}>«{msg.text}»</blockquote>
                      <figcaption style={{ marginTop: 10, fontFamily: head, fontWeight: 700, fontSize: 15, letterSpacing: '.14em', color: GOLD_L }}>— {upper(msg.name, lang)}{msg.date ? <span style={{ fontFamily: body, fontWeight: 400, letterSpacing: 0, color: MUTED }}>{`, ${gbook.formatDate(msg.date)}`}</span> : null}</figcaption>
                    </figure>
                  )
                })}
              </div>
            </Reel>
          )}

          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={head} />
        </motion.div>
      )}
    </div>
  )
}

const SPROCKET = `url("data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='8' height='14'><rect x='1' y='3' width='6' height='8' rx='1.6' fill='#E9DFC9'/></svg>")}")`
const SPROCKET_H = `url("data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='14' height='8'><rect x='3' y='1' width='8' height='6' rx='1.6' fill='#E9DFC9'/></svg>")}")`

function ScreenPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <svg width="36" height="36" viewBox="-18 -18 36 36" style={{ position: 'absolute', left: -18, top: -18 }}>
        <path d="M0 -15L4.4 -4.6L15 -4.6L6.4 2.2L9.6 13L0 6.6L-9.6 13L-6.4 2.2L-15 -4.6L-4.4 -4.6Z" fill={GOLD} stroke="#141010" strokeWidth="1.2" />
      </svg>
    </span>
  )
}
