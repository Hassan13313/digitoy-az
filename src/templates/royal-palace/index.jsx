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

/* ─────────────────────────────────────────────────────────────────────────────
   ROYAL PALACE — «Saray fərmanı» (premium redizayn, 2026-10)

   Konsept: barokko sarayı — kral göyü məxmər üzərində zərli zanbaq (fleur-de-
   lis) naxışı. Açılış — tac altında qızıl valikli fərman tumarı özü açılır:
   tacli kartuşda monoqram, kalliqrafik adlar. Toxunanda tumar yaxınlaşıb
   saraya keçirik. Daxildə:
     hero      → saray gerbi: tac, dəfnə çələngi, monoqram, kalliqrafiya
     sayğac    → Versal pəncərələri kimi tağlı arkada
     məkan     → tacli oval zərli çərçivə
     proqram   → mərasim protokolu
     masa      → tacli kartuş, masa nömrəsi Roma rəqəmi ilə
     fotolar   → portret qalereyası
     arzular   → saray dəftəri — imzalar kalliqrafiya ilə
   Rəng: kral göyü, zər, fil sümüyü, perqament.
   Şriftlər: Cormorant SC · EB Garamond · Imperial Script (adlar).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('royal-palace')
const ID = 'royal-palace'

const LABELS = {
  countdown: { title: { az: 'Mərasimə qədər', en: 'Until the ceremony', ru: 'До церемонии' } },
  venue:     { title: { az: 'Saray', en: 'The palace', ru: 'Дворец' } },
  program:   { title: { az: 'Mərasim protokolu', en: 'Order of ceremony', ru: 'Протокол церемонии' } },
  dresscode: { title: { az: 'Saray etiketi', en: 'Court etiquette', ru: 'Дворцовый этикет' } },
  seating:   { title: { az: 'Ziyafət masanız', en: 'Your banquet table', ru: 'Ваш стол на банкете' } },
  gallery:   { title: { az: 'Portret qalereyası', en: 'Portrait gallery', ru: 'Портретная галерея' } },
  rsvp:      { title: { az: 'Cavabınızı gözləyirik', en: 'Your reply, please', ru: 'Ждём вашего ответа' } },
  guestbook: { title: { az: 'Saray dəftəri', en: 'The court register', ru: 'Дворцовая книга' } },
}
const TXT = {
  az: { table: 'Masa', honour: 'sizi şərəfli qonağımız olmağa dəvət edir' },
  en: { table: 'Table', honour: 'request the honour of your presence' },
  ru: { table: 'Стол', honour: 'имеют честь пригласить вас' },
}

const NAVY = '#141B3A'
const DEEP = '#0C1128'
const GOLD = '#D6B76E'
const GOLD_L = '#F0DCA0'
const IVORY = '#F3ECDD'
const PARCH = '#EFE3C8'
const MUTED = '#AAB0CC'
const INK = '#2A2340'
const GILT = `linear-gradient(135deg, #9C7A33, ${GOLD_L} 35%, ${GOLD} 55%, #8A6A2A 80%, ${GOLD_L})`

const svgUri = (s) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`
const FLEUR = 'M20 4C24 10 25 16 20 24C15 16 16 10 20 4ZM19 22C12 14 4 16 6 23C8 28 14 27 17 24.5M21 22C28 14 36 16 34 23C32 28 26 27 23 24.5M13 25H27V27.6H13ZM18 27.6C17 31 15 33 12.5 34M22 27.6C23 31 25 33 27.5 34M20 27.6V35'
const DAMASK = svgUri(`<svg xmlns='http://www.w3.org/2000/svg' width='64' height='72' viewBox='0 0 64 72'><g fill='none' stroke='#D6B76E' stroke-opacity='.11' stroke-width='1.2'><path transform='translate(12 2)' d='${FLEUR}'/><path transform='translate(-20 38)' d='${FLEUR}'/><path transform='translate(44 38)' d='${FLEUR}'/></g></svg>`)

const KEYFRAMES = `
@keyframes rp-unroll { from { clip-path: inset(0 0 100% 0) } to { clip-path: inset(0 0 0 0) } }
@keyframes rp-roller { from { transform: translateY(calc(-1 * var(--h))) } to { transform: none } }
@keyframes rp-rise  { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
@keyframes rp-fade  { from { opacity: 0 } to { opacity: 1 } }
@keyframes rp-glow  { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
[data-rp] span[aria-hidden="true"], [data-rp] svg[aria-hidden="true"], [data-rp] div[aria-hidden="true"] { pointer-events: none; }
[data-rp] ::placeholder { color: rgba(170,176,204,.6); }
[data-rp] .rp-parch ::placeholder { color: rgba(42,35,64,.42); }
[data-rp] input:focus-visible, [data-rp] textarea:focus-visible { border-color: ${GOLD} !important; outline: none; }
[data-rp] button:focus-visible, [data-rp] a:focus-visible, [data-rp] [role="button"]:focus-visible { outline: 1.5px solid ${GOLD}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-rp] *, [data-rp] { animation: none !important; transition: none !important; } }
`

function roman(v) {
  const n = Number(v)
  if (!Number.isInteger(n) || n <= 0 || n > 3999) return null
  const map = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let r = '', x = n
  for (const [k, s] of map) while (x >= k) { r += s; x -= k }
  return r
}

/* ─── Heraldika ─── */
function Crown({ size = 60, color = GOLD, style }) {
  return (
    <svg viewBox="-32 -28 64 40" width={size} height={size * 0.625} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <path d="M-24 4L-28 -14L-14 -4L-8 -20L0 -6L8 -20L14 -4L28 -14L24 4Z" fill={color} fillOpacity=".14" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
      <rect x="-25" y="4" width="50" height="7" rx="1.5" fill="none" stroke={color} strokeWidth="1.3" />
      {[-28, -8, 8, 28].map((x) => <circle key={x} cx={x} cy={x === -28 || x === 28 ? -15.5 : -21.5} r="2.4" fill={color} />)}
      <path d="M0 -6V-26M-3.5 -22.5H3.5" stroke={color} strokeWidth="1.3" />
      {[-16, 0, 16].map((x) => <circle key={x} cx={x} cy="7.5" r="1.7" fill={color} />)}
    </svg>
  )
}

function Laurel({ size = 230, color = GOLD, style }) {
  const leaves = Array.from({ length: 11 }, (_, i) => {
    const t = i / 10
    const a = (200 - t * 130) * Math.PI / 180
    return { x: Math.cos(a) * 92, y: Math.sin(a) * 92, r: (200 - t * 130) + 90, s: 1 - t * 0.35 }
  })
  return (
    <svg viewBox="-110 -110 220 220" width={size} height={size} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      {[1, -1].map((side) => (
        <g key={side} transform={side < 0 ? 'scale(-1 1)' : undefined}>
          <path d="M-20 92A92 92 0 0 1 -86 -30" fill="none" stroke={color} strokeWidth="1.2" transform="rotate(0)" />
          {leaves.map((l, i) => (
            <g key={i} transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.r.toFixed(0)}) scale(${l.s.toFixed(2)})`}>
              <path d="M0 0C5 -6 5 -16 0 -22C-5 -16 -5 -6 0 0Z" fill={color} fillOpacity=".85" transform="rotate(-35)" />
              <path d="M0 0C5 -6 5 -16 0 -22C-5 -16 -5 -6 0 0Z" fill={color} fillOpacity=".55" transform="rotate(35)" />
            </g>
          ))}
        </g>
      ))}
    </svg>
  )
}

function FleurRule({ color = GOLD, width = 200 }) {
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <span style={{ width: width / 2 - 20, height: 1, background: `linear-gradient(90deg, transparent, ${color})` }} />
      <svg viewBox="0 0 40 38" width="22" height="21" style={{ display: 'block' }}><path d={FLEUR} fill="none" stroke={color} strokeWidth="1.6" /></svg>
      <span style={{ width: width / 2 - 20, height: 1, background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  )
}

/* ═══ 01 — AÇILIŞ: fərman tumarı ═══ */
function DecreeOpening({ inv, theme }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 1200 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const capsF = theme.fonts.heading
  const script = theme.fonts.script || "'Imperial Script', 'Great Vibes', cursive"
  const roller = (
    <div aria-hidden="true" style={{ position: 'relative', height: 18, margin: '0 -14px', borderRadius: 9, background: 'linear-gradient(180deg, #7A5523, #C8A160 40%, #6A4718)', boxShadow: '0 6px 12px rgba(0,0,0,.45)' }}>
      {[0, 1].map((s) => <span key={s} style={{ position: 'absolute', top: -4, [s ? 'right' : 'left']: -10, width: 26, height: 26, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, ${GOLD_L}, ${GOLD} 45%, #7A5A20)` }} />)}
    </div>
  )
  return (
    <motion.div {...gate.gateProps} data-rp
      animate={gate.opening ? { opacity: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.7 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden',
        backgroundColor: DEEP, backgroundImage: `${DAMASK}, radial-gradient(90% 60% at 50% 35%, #233066, ${NAVY} 55%, ${DEEP})`,
        backgroundSize: '64px 72px, 100% 100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 26px', color: INK, fontFamily: theme.fonts.body,
      }}>
      <motion.div animate={gate.opening ? { scale: 1.12, opacity: 0, y: -20 } : {}} transition={{ duration: 0.8, ease: [0.6, 0, 0.3, 1] }}
        style={{ width: 'min(100%, 330px)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', animation: 'rp-fade 1s ease-out both' }}>
          <span aria-hidden="true" style={{ position: 'absolute', inset: -30, borderRadius: '50%', background: `radial-gradient(circle, ${alpha(GOLD, 0.35)}, transparent 70%)`, animation: 'rp-glow 4s ease-in-out infinite' }} />
          <Crown size={70} />
        </div>
        <div style={{ width: '100%', marginTop: 18, '--h': 'min(62vh, 440px)' }}>
          {roller}
          <div className="rp-parch" style={{
            position: 'relative', margin: '-4px 0', padding: '28px 24px 26px', textAlign: 'center', height: 'var(--h)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(90deg, rgba(120,90,40,.22), transparent 8%, transparent 92%, rgba(120,90,40,.22)), linear-gradient(180deg, #F6EDD6, ${PARCH} 50%, #E6D5B0)`,
            animation: 'rp-unroll 1.6s cubic-bezier(.5,0,.2,1) .5s both',
          }}>
            <span aria-hidden="true" style={{ position: 'absolute', inset: 10, border: `1px solid ${alpha('#8A6A2A', 0.5)}`, outline: `1px solid ${alpha('#8A6A2A', 0.3)}`, outlineOffset: -5 }} />
            {ot.show('kicker') && <div style={{ fontFamily: capsF, fontSize: 15, letterSpacing: '.2em', color: '#7A5A20' }}>{ot.text('kicker')}</div>}
            <div style={{ position: 'relative', marginTop: 16, width: 74, height: 74, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="-40 -40 80 80" width="74" height="74" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
                <ellipse rx="30" ry="36" fill="none" stroke="#8A6A2A" strokeWidth="1.2" />
                <ellipse rx="26" ry="32" fill="none" stroke="#8A6A2A" strokeWidth=".6" />
              </svg>
              <span style={{ position: 'relative', width: 46, height: 56, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: capsF, fontSize: 19, color: INK, letterSpacing: '.04em' }}>
                <MonoContent mono={ot.mono} ornament={<Crown size={30} color="#8A6A2A" />} imgStyle={{ borderRadius: '50%' }} />
              </span>
            </div>
            {titleOv !== '' && (
              <div style={{ marginTop: 14, fontFamily: script, fontSize: 'clamp(38px, 12vw, 50px)', lineHeight: 1.05, color: INK }}>
                {first}{second && <><span style={{ display: 'block', fontFamily: capsF, fontSize: '.36em', letterSpacing: '.2em', color: '#7A5A20', margin: '4px 0' }}>&amp;</span>{second}</>}
              </div>
            )}
            {ot.show('meta') && <div style={{ marginTop: 18, fontFamily: capsF, fontSize: 15, letterSpacing: '.16em', color: '#5A4A33' }}>{ot.text('meta')}</div>}
          </div>
          <div style={{ animation: 'rp-roller 1.6s cubic-bezier(.5,0,.2,1) .5s both' }}>{roller}</div>
        </div>
      </motion.div>
      {ot.show('cta') && (
        <motion.div animate={gate.opening ? { opacity: 0 } : {}} transition={{ duration: 0.3 }}
          style={{ marginTop: 26, minHeight: 48, padding: '12px 28px', display: 'inline-flex', alignItems: 'center', background: GILT, color: DEEP, fontFamily: capsF, fontSize: 16, fontWeight: 600, letterSpacing: '.14em', borderRadius: 2, boxShadow: '0 10px 24px rgba(0,0,0,.4)', animation: 'rp-rise .9s ease-out 2.2s both' }}>
          {ot.text('cta')}
        </motion.div>
      )}
      {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 14, fontStyle: 'italic', color: MUTED, animation: 'rp-fade .8s ease-out 2.6s both, rp-glow 3s ease-in-out 3.4s infinite' }}>{ot.text('hint')}</div>}
    </motion.div>
  )
}

/* Bölmə */
function Hall({ id, section, title, kicker, sub, children, capsF }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '60px 20px 64px' }}>
      <Reveal style={{ maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Crown size={34} style={{ margin: '0 auto 12px' }} />
            {title && <h2 style={{ margin: 0, fontFamily: capsF, fontWeight: 500, fontSize: 'clamp(28px, 8vw, 34px)', lineHeight: 1.15, letterSpacing: '.06em', color: GOLD_L, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontStyle: 'italic', fontSize: 16, color: MUTED }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 320, fontSize: 16.5, color: MUTED, lineHeight: 1.5 }}>{sub}</p>}
            <div style={{ marginTop: 16 }}><FleurRule width={180} /></div>
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: alpha('#FFFFFF', 0.04), border: `1px solid ${alpha(GOLD, 0.4)}`, borderRadius: 2,
  padding: '14px 16px', fontSize: 17, color: IVORY, outline: 'none',
}
const btn = (on, capsF) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 2,
  fontFamily: capsF, fontSize: 15.5, fontWeight: 600, letterSpacing: '.12em', textDecoration: 'none', cursor: 'pointer',
  background: on ? GILT : 'transparent', color: on ? DEEP : GOLD_L, border: on ? 'none' : `1px solid ${alpha(GOLD, 0.6)}`,
})

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function RoyalPalaceTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const capsF = theme.fonts.heading
  const body = theme.fonts.body
  const script = theme.fonts.script || "'Imperial Script', 'Great Vibes', cursive"
  const T = TXT[lang] || TXT.az
  const P = { capsF }

  return (
    <div data-rp data-enter={enterDirection(ID)} style={{
      backgroundColor: DEEP, backgroundImage: `${DAMASK}, linear-gradient(180deg, ${NAVY}, ${DEEP})`, backgroundSize: '64px 72px, 100% 100%',
      minHeight: '100vh', fontFamily: body, color: IVORY, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(GOLD, 0.3),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <DecreeOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: DEEP, border: `1px solid ${alpha(GOLD, 0.55)}` }}>
        {({ playing }) => <EqBars playing={playing} color={GOLD} idle={alpha(GOLD, 0.35)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(DEEP, 0.9), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(GOLD, 0.25)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: MUTED, fontSize: 15, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: capsF, fontSize: 16, letterSpacing: '.18em', color: GOLD }}>Digitoy</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — saray gerbi */}
          <section style={{ padding: '40px 20px 50px', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 230, height: 230, margin: '0 auto' }}>
              <Laurel size={230} style={{ position: 'absolute', inset: 0 }} />
              <Crown size={66} style={{ position: 'absolute', left: '50%', top: 2, transform: 'translateX(-50%)' }} />
              <div style={{ position: 'absolute', left: '50%', top: '54%', transform: 'translate(-50%, -50%)', width: 108, height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="-54 -64 108 128" width="108" height="128" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
                  <ellipse rx="50" ry="60" fill={alpha(DEEP, 0.6)} stroke={GOLD} strokeWidth="1.4" />
                  <ellipse rx="44" ry="54" fill="none" stroke={GOLD} strokeWidth=".6" strokeDasharray="1 3" />
                </svg>
                <span style={{ position: 'relative', width: 80, height: 96, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: capsF, fontSize: 30, letterSpacing: '.04em', color: GOLD_L }}>
                  <MonoContent mono={inv.ot.mono} ornament={<Crown size={44} />} imgStyle={{ borderRadius: '50%' }} />
                </span>
              </div>
            </div>
            <div style={{ marginTop: 22, fontFamily: capsF, fontSize: 15, letterSpacing: '.22em', color: GOLD }}>{L('hero', 'kicker', inv.eventLabel)}</div>
            <h1 style={{ margin: '12px 0 0', fontFamily: script, fontWeight: 400, fontSize: 'clamp(46px, 15vw, 66px)', lineHeight: 1.05, color: GOLD_L, textWrap: 'balance' }}>
              {inv.heroTitle ? inv.heroTitle : inv.isCouple ? <>{inv.groom}<span style={{ display: 'block', fontFamily: capsF, fontSize: '.32em', letterSpacing: '.2em', color: GOLD, margin: '6px 0' }}>&amp;</span>{inv.bride}</> : inv.single}
            </h1>
            {inv.isCouple && <div style={{ marginTop: 14, fontStyle: 'italic', fontSize: 18, color: IVORY }}>{T.honour}</div>}
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 12, fontSize: 16, color: MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <div style={{ margin: '24px 0 18px' }}><FleurRule width={220} /></div>
            <div style={{ fontFamily: capsF, fontSize: 21, letterSpacing: '.08em', color: IVORY }}>{inv.fullDate}</div>
            <div style={{ marginTop: 6, fontSize: 17, color: MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            <p style={{ margin: '22px auto 0', maxWidth: 320, fontStyle: 'italic', fontSize: 17, lineHeight: 1.55, color: MUTED }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — tağlı arkada */}
          {S.countdown && (
            <Hall {...P} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(8px, 2.6vw, 14px)', maxWidth: 380, margin: '0 auto' }}>
                {[
                  { v: cd.days, l: cd.labels.days },
                  { v: cd.hours, l: cd.labels.hours },
                  { v: cd.minutes, l: cd.labels.minutes },
                  { v: cd.seconds, l: cd.labels.seconds, pop: true },
                ].map(({ v, l, pop }) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ position: 'relative', aspectRatio: '3 / 4.4', padding: 3, borderRadius: '999px 999px 4px 4px', background: GILT }}>
                      <div style={{ height: '100%', borderRadius: '999px 999px 2px 2px', background: `linear-gradient(180deg, #24306A, ${DEEP})`, boxShadow: `inset 0 0 0 1px ${alpha(GOLD, 0.6)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '18%' }}>
                        <span style={{ fontFamily: capsF, fontWeight: 500, fontSize: 'clamp(24px, 7.4vw, 32px)', color: pop ? GOLD_L : IVORY, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                      </div>
                      <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '16%', width: 1, height: '18%', background: alpha(GOLD, 0.5) }} />
                    </div>
                    <div style={{ marginTop: 8, fontFamily: capsF, fontSize: 13.5, letterSpacing: '.1em', color: MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
            </Hall>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN — tacli oval çərçivə */}
          {S.venue && (
            <Hall {...P} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ position: 'relative', width: 'min(80vw, 300px)', margin: '0 auto', paddingTop: 26 }}>
                <Crown size={54} style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', zIndex: 2 }} />
                <div style={{ padding: 6, borderRadius: '50%', background: GILT, boxShadow: '0 24px 40px -20px #000' }}>
                  <div style={{ borderRadius: '50%', overflow: 'hidden', aspectRatio: '4 / 5', boxShadow: `inset 0 0 0 2px ${DEEP}`, background: NAVY }}>
                    <MapSection
                      weddingData={weddingData} theme={theme} accent={GOLD} height="100%"
                      map={{ opacity: 0.6, filter: 'grayscale(1) brightness(.6) contrast(1.15)', tintOpacity: 0.5, tint: '#24306A', blend: 'color' }}
                      frame={<CrestPin />}
                      fallback={<div style={{ height: '100%', position: 'relative', backgroundColor: NAVY, backgroundImage: DAMASK, backgroundSize: '64px 72px' }}><CrestPin /></div>}
                    />
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: capsF, fontSize: 24, letterSpacing: '.06em', lineHeight: 1.25, color: GOLD_L }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontStyle: 'italic', fontSize: 16.5, color: MUTED }}>{weddingData.venueNote}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={btn(true, capsF)}>{tr.inv_directions_btn}</a>}
                {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={btn(!inv.dirUrl, capsF)}>Maps</a>}
                {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(false, capsF)}>Waze</a>}
                {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(false, capsF)}>Apple</a>}
              </div>
            </Hall>
          )}

          {/* PROQRAM — mərasim protokolu */}
          {S.program && (
            <Hall {...P} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <ol style={{ listStyle: 'none', margin: 0, padding: 0, textAlign: 'center' }}>
                {timeline.events.map((ev, i) => (
                  <li key={i}>
                    {i > 0 && (
                      <svg viewBox="0 0 40 38" width="16" height="15" aria-hidden="true" style={{ display: 'block', margin: '14px auto' }}><path d={FLEUR} fill="none" stroke={alpha(GOLD, 0.7)} strokeWidth="2" /></svg>
                    )}
                    <div style={{ fontFamily: capsF, fontSize: 17, letterSpacing: '.14em', color: GOLD, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    <div style={{ marginTop: 4, fontSize: 21, lineHeight: 1.3, color: IVORY }}>{ev.label}</div>
                  </li>
                ))}
              </ol>
            </Hall>
          )}

          {S.dresscode && (
            <Hall {...P} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={capsF} align="center" onDark />
            </Hall>
          )}

          {/* MASA — tacli kartuş */}
          {S.seating && !seating.isEmpty && (
            <Hall {...P} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <input {...seatInputProps(inv, 'rp-seat-list')} style={field} />
              <SeatSuggest inv={inv} id="rp-seat-list" c={{ bg: NAVY, border: `1px solid ${alpha(GOLD, 0.4)}`, active: alpha(GOLD, 0.12), text: IVORY, table: GOLD_L, radius: 2, font: body }} />
              {seating.showNotFound && <div style={{ marginTop: 12, fontStyle: 'italic', fontSize: 16, color: MUTED, textAlign: 'center' }}>{tr.inv_seat_fullname}</div>}
              {seating.selected && (
                <div style={{ marginTop: 30, textAlign: 'center', animation: 'rp-rise .7s ease-out both' }}>
                  <Crown size={46} style={{ margin: '0 auto -4px' }} />
                  <div className="rp-parch" style={{ display: 'inline-block', minWidth: 230, padding: '20px 26px 18px', background: `linear-gradient(180deg, #F6EDD6, ${PARCH})`, color: INK, borderRadius: '50% / 18%', boxShadow: `0 0 0 3px ${GOLD}, 0 0 0 6px ${DEEP}, 0 0 0 7px ${alpha(GOLD, 0.6)}, 0 24px 40px -20px #000` }}>
                    <div style={{ fontFamily: script, fontSize: 30, lineHeight: 1.1 }}>{seating.selected.full_name}</div>
                    <div style={{ marginTop: 8, fontFamily: capsF, fontSize: 13.5, letterSpacing: '.24em', color: '#7A5A20' }}>{T.table}</div>
                    <div style={{ fontFamily: capsF, fontWeight: 600, fontSize: 48, lineHeight: 1 }}>{roman(seating.selected.table_id) || seating.selected.table_id}</div>
                    {roman(seating.selected.table_id) && <div style={{ fontSize: 14, color: '#5A4A33' }}>{seating.selected.table_id}</div>}
                  </div>
                  {seating.tablemates.length > 0 && <div style={{ marginTop: 18, fontStyle: 'italic', fontSize: 16.5, color: MUTED, lineHeight: 1.6 }}>{seating.tablemates.map((g) => g.full_name).join(', ')}</div>}
                  <button onClick={seating.reset} data-press style={{ marginTop: 6, background: 'none', border: 'none', color: GOLD_L, fontSize: 16, minHeight: 44, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: body }}>
                    {seatingL.again || 'Yenidən axtar'}
                  </button>
                </div>
              )}
            </Hall>
          )}

          {/* FOTOLAR — portret qalereyası */}
          {S.gallery && (
            <Hall id="gallery-section" {...P} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 30 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ padding: 4, background: GILT, borderRadius: i % 2 ? '50%' : '999px 999px 3px 3px' }}>
                      <div style={{ aspectRatio: '3 / 4', overflow: 'hidden', borderRadius: i % 2 ? '50%' : '999px 999px 2px 2px', background: NAVY, boxShadow: `inset 0 0 0 1px ${DEEP}` }}>
                        <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: 6, background: GILT }}>
                  <div style={{ padding: 10, background: IVORY }}>
                    <QRCodeSVG value={gallery.photoShareUrl} size={120} bgColor={IVORY} fgColor={DEEP} level="M" />
                  </div>
                </div>
                <div style={{ marginTop: 14, fontSize: 16, color: MUTED }}>{tr.inv_scan_upload}</div>
                <a data-press href={gallery.photoShareUrl} style={{ ...btn(true, capsF), marginTop: 16 }}>{tr.inv_gallery_btn}</a>
                <p style={{ margin: '16px auto 0', maxWidth: 340, fontSize: 16.5, color: MUTED, lineHeight: 1.6 }}>{tr.inv_gallery_desc}</p>
              </div>
            </Hall>
          )}

          {/* RSVP — perqament */}
          {S.rsvp && (
            <Hall {...P} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{ ink: IVORY, muted: MUTED, line: alpha(GOLD, 0.5), hair: alpha(GOLD, 0.16), accent: GOLD_L, font: body, display: script, radius: 2, btnFont: capsF, btnTracking: '.14em', doneMark: <Crown size={36} style={{ margin: '0 auto 8px' }} />, marker: (a) => <svg viewBox="0 0 40 38" width="15" height="14"><path d={FLEUR} fill="none" stroke={a ? GOLD_L : alpha(GOLD, 0.4)} strokeWidth={a ? 3 : 2} /></svg>, suggest: { bg: NAVY, border: `1px solid ${alpha(GOLD, 0.4)}`, active: alpha(GOLD, 0.12), text: IVORY, table: GOLD_L, radius: 2, font: body } }} />
            </Hall>
          )}

          {/* SARAY DƏFTƏRİ */}
          {S.guestbook && (
            <Hall {...P} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 34 }}>
                <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={field} />
                <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...field, resize: 'none', lineHeight: 1.5 }} />
                <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...btn(gbook.canSubmit, capsF), width: '100%', opacity: gbook.canSubmit ? 1 : 0.5, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}>
                  {gbook.sending ? gbookL.sending : gbookL.btn}
                </button>
                {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 15 }}>⚠ {gbookL.error}</p>}
              </form>
              <div className="rp-parch" style={{ padding: '6px 20px', color: INK, background: `linear-gradient(180deg, #F6EDD6, ${PARCH})`, boxShadow: `0 0 0 4px ${DEEP}, 0 0 0 5px ${alpha(GOLD, 0.6)}` }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '18px 0', borderTop: i ? `1px solid ${alpha('#8A6A2A', 0.25)}` : 'none' }}>
                      <blockquote style={{ margin: 0, fontStyle: 'italic', fontSize: 18, lineHeight: 1.55 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 6, textAlign: 'right' }}>
                        <span style={{ fontFamily: script, fontSize: 27, color: '#3A2E5A' }}>{msg.name}</span>
                        {msg.date && <span style={{ display: 'block', fontSize: 13.5, color: '#6A5A43' }}>{gbook.formatDate(msg.date)}</span>}
                      </figcaption>
                    </figure>
                  )
                })}
              </div>
            </Hall>
          )}

          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={capsF} />
        </motion.div>
      )}
    </div>
  )
}

function CrestPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -28, top: -28, width: 56, height: 56, borderRadius: '50%', background: `radial-gradient(circle, ${alpha(GOLD, 0.4)}, transparent 70%)` }} />
      <svg viewBox="0 0 40 38" width="30" height="28" style={{ position: 'absolute', left: -15, top: -15 }}><path d={FLEUR} fill={alpha(DEEP, 0.6)} stroke={GOLD_L} strokeWidth="2" /></svg>
    </span>
  )
}
