import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../_shared/MapSection'
import { EmblemSlot } from '../_shared/MonoContent'
import { Reveal, PopDigit, enterDirection } from '../_shared/motion'
import { hidePhoto } from '../../utils/photoGallery'
import { getTemplateTheme } from '../templateConfig'
import { useInvitation, useGate, openingNames, seatInputProps, rsvpInputProps, rsvpOptions, rsvpState, alpha } from '../_shared/useInvitation'
import { MusicFab, EqBars, SeatSuggest, RsvpSuggest, RsvpStatus, StoryBlock, InvitationEnd } from '../_shared/invitationKit'

/* ─────────────────────────────────────────────────────────────────────────────
   LUXURY JEWELRY — «Zərgərlik evi» (premium redizayn, 2026-10)

   Konsept: yüksək zərgərlik evinin (haute joaillerie) vitrini. Açılış —
   vitrin işığı altında zümrüd məxmər üzük qutusu, altında adlar. Toxunanda
   qapaq qalxır, atlaz astarda zərgərlik evinin möhürü kimi monoqram,
   yastıqda zümrüd kəsimli daşlı üzük; sonra daşın içinə girilir. Daxildə:
     hero      → kataloq səhifəsi: böyük zümrüd kəsim daş, kolleksiya ili
     sayğac    → dörd fərqli kəsim: dəyirmi, oval, zümrüd, armud
     məkan     → zümrüd kəsim (pilləli səkkizbucaq) çərçivə
     proqram   → hərrac kataloqu: «Lot 01 …»
     masa      → məxmər vitrin lövhəsində platin lövhəcik
     RSVP      → butik görüş kartı
     arzular   → lentli hədiyyə kartları
   Rəng: zümrüd məxmər, gecə yaşılı, platin, atlaz fil sümüyü.
   Şriftlər: Libre Caslon Display · Raleway (nazik).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('luxury-jewelry')
const ID = 'luxury-jewelry'

const LABELS = {
  countdown: { title: { az: 'Təqdimata qədər', en: 'Until the unveiling', ru: 'До презентации' } },
  venue:     { title: { az: 'Butik', en: 'The maison', ru: 'Бутик' } },
  program:   { title: { az: 'Axşamın kataloqu', en: 'Catalogue of the evening', ru: 'Каталог вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Attire', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Sizin vitrininiz', en: 'Your showcase', ru: 'Ваша витрина' } },
  gallery:   { title: { az: 'Kolleksiya', en: 'The collection', ru: 'Коллекция' } },
  rsvp:      { title: { az: 'Görüşünüzü təsdiqləyin', en: 'Confirm your appointment', ru: 'Подтвердите визит' } },
  guestbook: { title: { az: 'Hədiyyə kartları', en: 'Gift cards', ru: 'Подарочные открытки' } },
}
const TXT = {
  az: { lot: 'Lot', table: 'Masa', collection: 'Kolleksiya', maison: 'Zərgərlik evi' },
  en: { lot: 'Lot', table: 'Table', collection: 'Collection', maison: 'Maison' },
  ru: { lot: 'Лот', table: 'Стол', collection: 'Коллекция', maison: 'Ювелирный дом' },
}

const NIGHT = '#07110E'
const VELVET = '#0E2A23'
const EMERALD = '#1F7A5C'
const MINT = '#A3D6C7'
const PLAT = '#D9DEE0'
const SATIN = '#EFEAE0'
const IVORY = '#F4F1EA'
const MUTED = '#9DB5AE'
const PLAT_GRAD = 'linear-gradient(135deg, #9EA6AA, #F4F6F7 35%, #C3C9CC 55%, #8E969A 80%, #E8EBEC)'
const VELVET_BG = `radial-gradient(120% 90% at 30% 20%, #1A4A3D, ${VELVET} 55%, #081A15)`

const KEYFRAMES = `
@keyframes lj-rise { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
@keyframes lj-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes lj-glint { 0%,100% { opacity: 0; transform: scale(.3) rotate(0) } 50% { opacity: 1; transform: scale(1) rotate(45deg) } }
@keyframes lj-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
[data-lj] span[aria-hidden="true"], [data-lj] svg[aria-hidden="true"], [data-lj] div[aria-hidden="true"] { pointer-events: none; }
[data-lj] ::placeholder { color: rgba(157,181,174,.6); }
[data-lj] .lj-satin ::placeholder { color: rgba(14,42,35,.42); }
[data-lj] input:focus-visible, [data-lj] textarea:focus-visible { border-color: ${MINT} !important; outline: none; }
[data-lj] button:focus-visible, [data-lj] a:focus-visible, [data-lj] [role="button"]:focus-visible { outline: 1px solid ${MINT}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-lj] *, [data-lj] { animation: none !important; transition: none !important; } }
`

/* ─── Daş kəsimləri (yuxarıdan) ─── */
function step(w, h, c) { return `M${-w + c} ${-h}H${w - c}L${w} ${-h + c}V${h - c}L${w - c} ${h}H${-w + c}L${-w} ${h - c}V${-h + c}Z` }
function EmeraldCut({ w = 40, h = 54, uid = 'e', style }) {
  const rings = [1, 0.78, 0.56, 0.38]
  return (
    <svg viewBox={`${-w - 2} ${-h - 2} ${2 * w + 4} ${2 * h + 4}`} width={(w + 2) * 2} height={(h + 2) * 2} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <defs>
        <linearGradient id={`lj-g-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5FD3A6" /><stop offset=".45" stopColor={EMERALD} /><stop offset="1" stopColor="#0B3D2D" />
        </linearGradient>
      </defs>
      {rings.map((k, i) => {
        const c = w * 0.3 * k
        return <path key={k} d={step(w * k, h * k, c)} fill={i % 2 ? `url(#lj-g-${uid})` : alpha('#7BE0B8', 0.35 + i * 0.1)} stroke="#C8F2E1" strokeOpacity=".55" strokeWidth=".7" />
      })}
      {[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy], i) => (
        <path key={i} d={`M${sx * (w - w * 0.3)} ${sy * h}L${sx * (w * 0.38 - w * 0.3 * 0.38)} ${sy * h * 0.38}M${sx * w} ${sy * (h - w * 0.3)}L${sx * w * 0.38} ${sy * (h * 0.38 - w * 0.3 * 0.38)}`} stroke="#C8F2E1" strokeOpacity=".45" strokeWidth=".6" />
      ))}
      <path d={`M${-w * 0.2} ${-h * 0.25}L${w * 0.05} ${-h * 0.32}`} stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".8" />
    </svg>
  )
}
function Round({ r = 34 }) {
  const n = 8
  return (
    <svg viewBox={`${-r - 2} ${-r - 2} ${2 * r + 4} ${2 * r + 4}`} width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      <circle r={r} fill={alpha('#7BE0B8', 0.45)} stroke="#C8F2E1" strokeOpacity=".6" strokeWidth=".8" />
      <path d={Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return `${i ? 'L' : 'M'}${(Math.cos(a) * r * 0.55).toFixed(1)} ${(Math.sin(a) * r * 0.55).toFixed(1)}` }).join('') + 'Z'} fill={EMERALD} stroke="#C8F2E1" strokeOpacity=".5" strokeWidth=".6" />
      {Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2, b = ((i + 0.5) / n) * Math.PI * 2; return <path key={i} d={`M${(Math.cos(a) * r * 0.55).toFixed(1)} ${(Math.sin(a) * r * 0.55).toFixed(1)}L${(Math.cos(b) * r).toFixed(1)} ${(Math.sin(b) * r).toFixed(1)}`} stroke="#C8F2E1" strokeOpacity=".45" strokeWidth=".6" /> })}
    </svg>
  )
}
function Oval({ rx = 26, ry = 36 }) {
  return (
    <svg viewBox={`${-rx - 2} ${-ry - 2} ${2 * rx + 4} ${2 * ry + 4}`} width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      <ellipse rx={rx} ry={ry} fill={alpha('#7BE0B8', 0.45)} stroke="#C8F2E1" strokeOpacity=".6" strokeWidth=".8" />
      <ellipse rx={rx * 0.56} ry={ry * 0.56} fill={EMERALD} stroke="#C8F2E1" strokeOpacity=".5" strokeWidth=".6" />
      {[0, 45, 90, 135].map((a) => <path key={a} d={`M0 ${-ry}L0 ${ry}`} transform={`rotate(${a}) scale(${rx / ry} 1)`} stroke="#C8F2E1" strokeOpacity=".35" strokeWidth=".6" />)}
    </svg>
  )
}
function Pear({ s = 36 }) {
  const d = `M0 ${-s}C${s * 0.5} ${-s * 0.3} ${s * 0.75} ${s * 0.2} ${s * 0.55} ${s * 0.6}C${s * 0.4} ${s * 0.95} ${-s * 0.4} ${s * 0.95} ${-s * 0.55} ${s * 0.6}C${-s * 0.75} ${s * 0.2} ${-s * 0.5} ${-s * 0.3} 0 ${-s}Z`
  return (
    <svg viewBox={`${-s} ${-s - 2} ${2 * s} ${2 * s}`} width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      <path d={d} fill={alpha('#7BE0B8', 0.45)} stroke="#C8F2E1" strokeOpacity=".6" strokeWidth=".8" />
      <path d={d} transform="translate(0 6) scale(.55)" fill={EMERALD} stroke="#C8F2E1" strokeOpacity=".5" strokeWidth=".6" />
      <path d={`M0 ${-s}V${s * 0.85}`} stroke="#C8F2E1" strokeOpacity=".35" strokeWidth=".6" />
    </svg>
  )
}

function EmeraldTile() {
  return <EmeraldCut w={24} h={32} uid="cd" style={{ width: '100%', height: '100%' }} />
}

function Glint({ size = 18, delay = 0, style }) {
  return (
    <svg viewBox="-10 -10 20 20" width={size} height={size} aria-hidden="true" style={{ position: 'absolute', animation: `lj-glint 2.8s ease-in-out ${delay}s infinite`, ...style }}>
      <path d="M0 -10Q.9 -.9 10 0Q.9 .9 0 10Q-.9 .9 -10 0Q-.9 -.9 0 -10Z" fill="#fff" />
    </svg>
  )
}

function Chain({ width = 200 }) {
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <span style={{ width: width / 2 - 16, height: 3, backgroundImage: `radial-gradient(ellipse at center, ${PLAT} 0 45%, transparent 50%)`, backgroundSize: '6px 3px', opacity: 0.7 }} />
      <svg viewBox="-8 -10 16 20" width="11" height="14"><path d={step(6, 8, 2.4)} fill={EMERALD} stroke={MINT} strokeWidth=".8" /></svg>
      <span style={{ width: width / 2 - 16, height: 3, backgroundImage: `radial-gradient(ellipse at center, ${PLAT} 0 45%, transparent 50%)`, backgroundSize: '6px 3px', opacity: 0.7 }} />
    </div>
  )
}

/* ═══ 01 — AÇILIŞ: üzük qutusu ═══ */
function RingBoxOpening({ inv, theme }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const disp = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-lj
      animate={gate.opening ? { opacity: 0 } : {}}
      transition={{ duration: 0.45, delay: 1.65 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: `radial-gradient(60% 45% at 50% 34%, #1E4C40, ${NIGHT} 70%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', color: IVORY, fontFamily: theme.fonts.body }}>
      {/* vitrin işığı */}
      <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 0, width: '120%', height: '62%', transform: 'translateX(-50%)', background: 'conic-gradient(from 180deg at 50% 0%, transparent 160deg, rgba(220,255,240,.10) 172deg, rgba(220,255,240,.16) 180deg, rgba(220,255,240,.10) 188deg, transparent 200deg)', pointerEvents: 'none', animation: 'lj-fade 1.4s ease-out both' }} />

      <motion.div animate={gate.opening ? { scale: 3.4, y: 40, opacity: 0 } : {}} transition={{ duration: 0.75, ease: [0.7, 0, 0.84, 0], delay: 1.0 }}
        style={{ position: 'relative', width: 'min(74vw, 290px)', animation: 'lj-rise 1.1s cubic-bezier(.2,.8,.2,1) .3s both' }}>
        {/* qapaq: bağlı halda xarici məxmər, açılanda atlaz astar */}
        <div style={{ position: 'relative', height: 'min(50vw, 196px)' }}>
          <motion.div animate={gate.opening ? { scaleY: 0 } : { scaleY: 1 }} transition={{ duration: 0.35, ease: 'easeIn' }}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '38%', transformOrigin: 'bottom', borderRadius: '18px 18px 4px 4px', background: VELVET_BG, boxShadow: 'inset 0 2px 0 rgba(255,255,255,.08), inset 0 -8px 14px rgba(0,0,0,.4)' }} />
          <motion.div className="lj-satin" initial={{ scaleY: 0 }} animate={gate.opening ? { scaleY: 1 } : { scaleY: 0 }} transition={{ duration: 0.45, ease: 'easeOut', delay: 0.35 }}
            style={{ position: 'absolute', inset: 0, transformOrigin: 'bottom', borderRadius: '20px 20px 4px 4px', padding: 10, background: VELVET_BG }}>
            <div style={{ height: '100%', borderRadius: '12px 12px 2px 2px', background: `radial-gradient(90% 80% at 50% 30%, #FBF8F1, ${SATIN} 60%, #D9D1C2)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: VELVET }}>
              <EmblemSlot mono={ot.mono} size={50} border={`1px solid ${alpha('#9C7A33', 0.6)}`} background="transparent" color="#8A6A2A" font={disp} style={{ animation: 'none' }}>
                <EmeraldCut w={12} h={16} uid="lid" />
              </EmblemSlot>
              <div style={{ marginTop: 8, fontFamily: disp, fontSize: 15, letterSpacing: '.24em', color: '#8A6A2A' }}>DIGITOY</div>
              <div style={{ fontSize: 9.5, letterSpacing: '.3em', color: '#8A6A2A' }}>MAISON</div>
            </div>
          </motion.div>
        </div>
        {/* gövdə + yastıq + üzük */}
        <div style={{ position: 'relative', height: 'min(36vw, 140px)', marginTop: -2, borderRadius: '4px 4px 16px 16px', background: VELVET_BG, boxShadow: '0 30px 50px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.06)', overflow: 'hidden' }}>
          <span aria-hidden="true" style={{ position: 'absolute', left: '8%', right: '8%', top: '10%', height: '44%', borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 35%, #2A6252, #12342B 70%)', boxShadow: 'inset 0 -6px 10px rgba(0,0,0,.45)' }} />
          <span aria-hidden="true" style={{ position: 'absolute', left: '49.6%', top: '22%', width: 2, height: '24%', background: '#06150F' }} />
          <motion.div initial={{ opacity: 0, y: 14 }} animate={gate.opening ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }} transition={{ duration: 0.5, delay: 0.6 }}
            style={{ position: 'absolute', left: 'calc(50% - 35px)', top: '-2%', width: 70, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <EmeraldCut w={13} h={17} uid="ring" />
            <span style={{ display: 'block', width: 46, height: 30, marginTop: -6, borderRadius: '50%', border: '5px solid transparent', background: `${PLAT_GRAD} border-box`, WebkitMask: 'linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
            <Glint size={20} delay={0.9} style={{ left: 10, top: -2 }} />
          </motion.div>
        </div>
      </motion.div>

      <motion.div animate={gate.opening ? { opacity: 0, y: 14 } : {}} transition={{ duration: 0.4 }}
        style={{ marginTop: 'clamp(26px, 5vh, 40px)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {ot.show('kicker') && <div style={{ fontSize: 11.5, letterSpacing: '.36em', paddingLeft: '.36em', color: MUTED, animation: 'lj-rise .8s ease-out .9s both' }}>{String(ot.text('kicker')).toLocaleUpperCase(inv.lang === 'az' ? 'az' : inv.lang)}</div>}
        {titleOv !== '' && (
          <div style={{ marginTop: 12, fontFamily: disp, fontSize: 'clamp(32px, 10vw, 42px)', lineHeight: 1.1, color: IVORY, animation: 'lj-rise 1s ease-out 1.1s both' }}>
            {first}{second && <><span style={{ fontStyle: 'italic', color: MINT, margin: '0 .25em', fontSize: '.8em' }}>&amp;</span>{second}</>}
          </div>
        )}
        {ot.show('meta') && <div style={{ marginTop: 10, fontSize: 13.5, letterSpacing: '.14em', color: MUTED, animation: 'lj-rise .8s ease-out 1.3s both' }}>{ot.text('meta')}</div>}
        {ot.show('cta') && (
          <div style={{ marginTop: 22, minHeight: 48, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', border: `1px solid ${alpha(PLAT, 0.6)}`, color: IVORY, fontSize: 13.5, letterSpacing: '.24em', animation: 'lj-rise .8s ease-out 1.6s both' }}>
            {String(ot.text('cta')).toLocaleUpperCase(inv.lang === 'az' ? 'az' : inv.lang)}
          </div>
        )}
        {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 12.5, color: MUTED, animation: 'lj-fade .8s ease-out 2s both, lj-hint 3s ease-in-out 2.8s infinite' }}>{ot.text('hint')}</div>}
      </motion.div>
    </motion.div>
  )
}

/* Bölmə */
function Vitrine({ id, section, title, kicker, sub, children, disp }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '60px 20px 64px' }}>
      <Reveal style={{ maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Chain width={150} />
            {title && <h2 style={{ margin: '16px 0 0', fontFamily: disp, fontWeight: 400, fontSize: 'clamp(30px, 8.6vw, 38px)', lineHeight: 1.15, color: IVORY, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontSize: 13, letterSpacing: '.08em', color: MUTED }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 320, fontSize: 15, color: MUTED, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${alpha(PLAT, 0.4)}`, borderRadius: 0,
  padding: '14px 2px', fontSize: 16, color: IVORY, outline: 'none',
}
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 0,
  fontSize: 13, letterSpacing: '.2em', textDecoration: 'none', cursor: 'pointer', textTransform: 'uppercase',
  background: on ? PLAT_GRAD : 'transparent', color: on ? NIGHT : IVORY, border: on ? 'none' : `1px solid ${alpha(PLAT, 0.5)}`,
})

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function LuxuryJewelryTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, rsvp, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const disp = theme.fonts.heading
  const body = theme.fonts.body
  const T = TXT[lang] || TXT.az
  const year = String(weddingData.date || '').slice(0, 4)
  const OCT = 'polygon(14% 0, 86% 0, 100% 11%, 100% 89%, 86% 100%, 14% 100%, 0 89%, 0 11%)'

  return (
    <div data-lj data-enter={enterDirection(ID)} style={{
      background: `radial-gradient(120% 50% at 50% 0%, #143A31, ${NIGHT} 60%)`, backgroundColor: NIGHT,
      minHeight: '100vh', fontFamily: body, color: IVORY, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(MINT, 0.25),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <RingBoxOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: VELVET, border: `1px solid ${alpha(PLAT, 0.5)}` }}>
        {({ playing }) => <EqBars playing={playing} color={MINT} idle={alpha(PLAT, 0.35)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(NIGHT, 0.88), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(PLAT, 0.14)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: MUTED, fontSize: 14, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: disp, fontSize: 16, letterSpacing: '.3em', paddingLeft: '.3em' }}>DIGITOY</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — kataloq səhifəsi */}
          <section style={{ padding: '44px 20px 40px', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 150, margin: '0 auto' }}>
              <span aria-hidden="true" style={{ position: 'absolute', inset: -40, borderRadius: '50%', background: `radial-gradient(circle, ${alpha('#5FD3A6', 0.28)}, transparent 65%)` }} />
              <EmeraldCut w={56} h={74} uid="hero" style={{ position: 'relative', margin: '0 auto' }} />
              <Glint size={24} delay={0.4} style={{ left: 18, top: 14 }} />
              <Glint size={16} delay={1.6} style={{ right: 20, bottom: 30 }} />
            </div>
            <div style={{ marginTop: 26, fontSize: 11.5, letterSpacing: '.34em', paddingLeft: '.34em', color: MUTED }}>{String(`${T.collection} ${year}`).toLocaleUpperCase(lang === 'az' ? 'az' : lang)}</div>
            <div style={{ marginTop: 6, fontSize: 14.5, color: MINT }}>{L('hero', 'kicker', inv.eventLabel)}</div>
            <h1 style={{ margin: '16px 0 0', fontFamily: disp, fontWeight: 400, fontSize: 'clamp(42px, 13vw, 60px)', lineHeight: 1.04, color: IVORY, textWrap: 'balance' }}>
              {inv.heroTitle ? inv.heroTitle : inv.isCouple ? <>{inv.groom}<span style={{ display: 'block', fontStyle: 'italic', fontSize: '.5em', color: MINT, margin: '4px 0' }}>&amp;</span>{inv.bride}</> : inv.single}
            </h1>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 12, fontSize: 14.5, color: MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <div style={{ margin: '26px 0 20px' }}><Chain width={200} /></div>
            <div style={{ fontFamily: disp, fontSize: 21 }}>{inv.fullDate}</div>
            <div style={{ marginTop: 6, fontSize: 14.5, letterSpacing: '.04em', color: MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            <p style={{ margin: '22px auto 0', maxWidth: 300, fontSize: 15, lineHeight: 1.7, color: MUTED }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — dörd kəsim */}
          {S.countdown && (
            <Vitrine disp={disp} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, maxWidth: 380, margin: '0 auto' }}>
                {[
                  { v: cd.days, l: cd.labels.days, G: Round },
                  { v: cd.hours, l: cd.labels.hours, G: Oval },
                  { v: cd.minutes, l: cd.labels.minutes, G: EmeraldTile },
                  { v: cd.seconds, l: cd.labels.seconds, G: Pear, pop: true },
                ].map(({ v, l, G, pop }) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ width: '70%', aspectRatio: '1', margin: '0 auto', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.5))' }}><G /></div>
                    <div style={{ marginTop: 10, fontFamily: disp, fontSize: 'clamp(28px, 8vw, 34px)', lineHeight: 1, color: pop ? MINT : IVORY, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></div>
                    <div style={{ marginTop: 6, fontSize: 11, letterSpacing: '.18em', color: MUTED, textTransform: 'uppercase' }}>{l}</div>
                  </div>
                ))}
              </div>
            </Vitrine>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN — zümrüd kəsim çərçivə */}
          {S.venue && (
            <Vitrine disp={disp} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ position: 'relative', width: 'min(84vw, 320px)', margin: '0 auto', padding: 3, clipPath: OCT, background: PLAT_GRAD }}>
                <div style={{ clipPath: OCT, padding: 10, background: VELVET_BG }}>
                  <div style={{ clipPath: OCT, overflow: 'hidden', background: NIGHT }}>
                    <MapSection
                      weddingData={weddingData} theme={theme} accent={MINT} height="clamp(300px, 92vw, 380px)"
                      map={{ opacity: 0.55, filter: 'grayscale(1) brightness(.6) contrast(1.2)', tintOpacity: 0.55, tint: EMERALD, blend: 'color' }}
                      frame={<GemPin />}
                      fallback={<div style={{ height: 'clamp(300px, 92vw, 380px)', position: 'relative', background: `radial-gradient(circle at 50% 50%, #1A4A3D, ${NIGHT} 75%)` }}><GemPin /></div>}
                    />
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: disp, fontSize: 25, lineHeight: 1.25 }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 14.5, color: MUTED }}>{weddingData.venueNote}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
                {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={btn(true)}>{tr.inv_directions_btn}</a>}
                {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={btn(!inv.dirUrl)}>Maps</a>}
                {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Waze</a>}
                {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Apple</a>}
              </div>
            </Vitrine>
          )}

          {/* PROQRAM — hərrac kataloqu */}
          {S.program && (
            <Vitrine disp={disp} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <ol style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${alpha(PLAT, 0.25)}` }}>
                {timeline.events.map((ev, i) => (
                  <li key={i} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 14, padding: '18px 0', borderBottom: `1px solid ${alpha(PLAT, 0.25)}` }}>
                    <div>
                      <div style={{ fontSize: 10.5, letterSpacing: '.22em', color: MUTED }}>{T.lot.toUpperCase()}</div>
                      <div style={{ fontFamily: disp, fontSize: 30, lineHeight: 1, color: MINT }}>{String(i + 1).padStart(2, '0')}</div>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: disp, fontSize: 20, lineHeight: 1.3 }}>{ev.label}</div>
                      <div style={{ marginTop: 4, fontSize: 13, letterSpacing: '.14em', color: MUTED, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </Vitrine>
          )}

          {S.dresscode && (
            <Vitrine disp={disp} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={disp} align="center" onDark />
            </Vitrine>
          )}

          {/* MASA — məxmər vitrin */}
          {S.seating && !seating.isEmpty && (
            <Vitrine disp={disp} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <input {...seatInputProps(inv, 'lj-seat-list')} style={field} />
              <SeatSuggest inv={inv} id="lj-seat-list" c={{ bg: VELVET, border: `1px solid ${alpha(PLAT, 0.3)}`, active: alpha(MINT, 0.12), text: IVORY, table: MINT, radius: 0, font: body }} />
              {seating.showNotFound && <div style={{ marginTop: 12, fontSize: 14, color: MUTED, textAlign: 'center' }}>{tr.inv_seat_fullname}</div>}
              {seating.selected && (
                <div style={{ marginTop: 28, padding: '28px 20px 22px', borderRadius: 14, background: VELVET_BG, boxShadow: 'inset 0 2px 0 rgba(255,255,255,.06), inset 0 -10px 20px rgba(0,0,0,.4), 0 24px 40px -20px #000', textAlign: 'center', animation: 'lj-rise .6s ease-out both' }}>
                  <div style={{ fontSize: 14.5, color: MUTED }}>{seating.selected.full_name}</div>
                  <div style={{ display: 'inline-block', marginTop: 14, padding: 2, background: PLAT_GRAD, borderRadius: 4 }}>
                    <div style={{ padding: '12px 30px', borderRadius: 3, background: 'linear-gradient(180deg, #F4F6F7, #C9CFD2)', color: VELVET }}>
                      <div style={{ fontSize: 10.5, letterSpacing: '.3em' }}>{T.table.toUpperCase()}</div>
                      <div style={{ fontFamily: disp, fontSize: 52, lineHeight: 1 }}>{seating.selected.table_id}</div>
                    </div>
                  </div>
                  {seating.tablemates.length > 0 && <div style={{ marginTop: 16, fontSize: 14, color: MUTED, lineHeight: 1.6 }}>{seating.tablemates.map((g) => g.full_name).join(' · ')}</div>}
                  <button onClick={seating.reset} data-press style={{ marginTop: 6, background: 'none', border: 'none', color: MINT, fontSize: 14, minHeight: 44, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: body }}>
                    {seatingL.again || 'Yenidən axtar'}
                  </button>
                </div>
              )}
            </Vitrine>
          )}

          {/* KOLLEKSİYA */}
          {S.gallery && (
            <Vitrine id="gallery-section" disp={disp} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 30 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ padding: 1.5, background: PLAT_GRAD }}>
                      <div style={{ padding: 5, background: VELVET }}>
                        <div style={{ aspectRatio: '4 / 5', overflow: 'hidden', background: NIGHT }}>
                          <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: 2, background: PLAT_GRAD }}>
                  <div style={{ padding: 12, background: IVORY }}>
                    <QRCodeSVG value={gallery.photoShareUrl} size={124} bgColor={IVORY} fgColor={VELVET} level="M" />
                  </div>
                </div>
                <div style={{ marginTop: 14, fontSize: 14, color: MUTED }}>{tr.inv_scan_upload}</div>
                <a data-press href={gallery.photoShareUrl} style={{ ...btn(true), marginTop: 16 }}>{tr.inv_gallery_btn}</a>
                <p style={{ margin: '16px auto 0', maxWidth: 340, fontSize: 14.5, color: MUTED, lineHeight: 1.7 }}>{tr.inv_gallery_desc}</p>
              </div>
            </Vitrine>
          )}

          {/* RSVP — butik görüş kartı */}
          {S.rsvp && (
            <Vitrine disp={disp} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <div style={{ padding: 1.5, background: PLAT_GRAD }}>
                <div style={{ padding: '28px clamp(18px, 6vw, 26px) 26px', background: `linear-gradient(170deg, #123A30, ${VELVET} 60%, #0A211B)` }}>
                  <RsvpStatus inv={inv} render={({ title, sub }) => (
                    <div style={{ textAlign: 'center', padding: '6px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><EmeraldCut w={12} h={16} uid="ok" /></div>
                      <div style={{ fontFamily: disp, fontSize: 25, lineHeight: 1.25 }}>{title}</div>
                      {sub && <div style={{ marginTop: 6, fontSize: 14.5, color: MUTED }}>{sub}</div>}
                    </div>
                  )} />
                  {rsvpState(rsvp) === 'form' && (
                    <form onSubmit={rsvp.handleSubmit}>
                      <input {...rsvpInputProps(inv)} style={field} />
                      <RsvpSuggest inv={inv} c={{ bg: VELVET, border: `1px solid ${alpha(PLAT, 0.3)}`, active: alpha(MINT, 0.12), text: IVORY, table: MINT, radius: 0, font: body }} />
                      {rsvp.showNotFound && <div style={{ marginTop: 8, fontSize: 13.5, color: MUTED }}>{rsvpL.not_in_list}</div>}
                      <div role="radiogroup" aria-label={L('rsvp', 'title', rsvpL.title)} style={{ display: 'grid', marginTop: 16 }}>
                        {rsvpOptions(inv).map(({ val, label }) => {
                          const active = rsvp.status === val
                          return (
                            <button key={val} type="button" role="radio" aria-checked={active} onClick={() => rsvp.chooseStatus(val)} data-press style={{
                              display: 'flex', alignItems: 'center', gap: 14, minHeight: 52, padding: '0 4px', background: 'none', border: 'none',
                              borderBottom: `1px solid ${alpha(PLAT, 0.16)}`, cursor: 'pointer', color: IVORY, fontFamily: body, fontSize: 16, textAlign: 'left',
                            }}>
                              <svg width="16" height="20" viewBox="-8 -10 16 20" aria-hidden="true" style={{ flex: 'none' }}>
                                <path d={step(6.5, 8.5, 2.6)} fill={active ? EMERALD : 'none'} stroke={active ? MINT : alpha(PLAT, 0.5)} strokeWidth="1" />
                              </svg>
                              {label}
                            </button>
                          )
                        })}
                      </div>
                      {rsvp.status === 'yes' && (
                        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 14.5, color: MUTED }}>{rsvpL.plusq}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button type="button" onClick={rsvp.decPlusOne} disabled={rsvp.plusOne === 0} data-press aria-label="Azalt" style={{ width: 44, height: 44, border: `1px solid ${alpha(PLAT, 0.45)}`, background: 'transparent', color: IVORY, fontSize: 19, cursor: 'pointer', opacity: rsvp.plusOne === 0 ? 0.35 : 1 }}>−</button>
                            <span style={{ width: 30, textAlign: 'center', fontFamily: disp, fontSize: 28 }}>{rsvp.plusOne}</span>
                            <button type="button" onClick={rsvp.incPlusOne} disabled={rsvp.plusOne === rsvp.maxExtraGuests} data-press aria-label="Artır" style={{ width: 44, height: 44, border: `1px solid ${alpha(PLAT, 0.45)}`, background: 'transparent', color: IVORY, fontSize: 19, cursor: 'pointer', opacity: rsvp.plusOne === rsvp.maxExtraGuests ? 0.35 : 1 }}>+</button>
                          </div>
                        </div>
                      )}
                      <button type="submit" disabled={!rsvp.canSubmit} data-press style={{
                        ...btn(true), width: '100%', marginTop: 22, minHeight: 54,
                        opacity: rsvp.canSubmit ? 1 : 0.4, cursor: rsvp.canSubmit ? 'pointer' : 'not-allowed',
                      }}>
                        {rsvp.sending ? '…' : rsvpL.send}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </Vitrine>
          )}

          {/* HƏDİYYƏ KARTLARI */}
          {S.guestbook && (
            <Vitrine disp={disp} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 34 }}>
                <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={field} />
                <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...field, resize: 'none', lineHeight: 1.5 }} />
                <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...btn(gbook.canSubmit), width: '100%', marginTop: 10, opacity: gbook.canSubmit ? 1 : 0.5, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}>
                  {gbook.sending ? gbookL.sending : gbookL.btn}
                </button>
                {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 13.5 }}>⚠ {gbookL.error}</p>}
              </form>
              <div style={{ display: 'grid', gap: 16 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure className="lj-satin" key={msg.name + i} style={{ position: 'relative', margin: 0, padding: '20px 20px 16px 22px', background: `linear-gradient(160deg, #FBF8F1, ${SATIN})`, color: VELVET, overflow: 'hidden', boxShadow: '0 16px 30px -18px #000' }}>
                      <span aria-hidden="true" style={{ position: 'absolute', right: -26, top: 14, width: 110, height: 14, background: `linear-gradient(180deg, #2A7A60, ${EMERALD} 50%, #145440)`, transform: 'rotate(45deg)', boxShadow: '0 2px 4px rgba(0,0,0,.2)' }} />
                      <blockquote style={{ margin: 0, paddingRight: 28, fontFamily: disp, fontSize: 18, lineHeight: 1.5 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 10, fontSize: 11.5, letterSpacing: '.18em', color: '#4F6A62' }}>{String(msg.name).toLocaleUpperCase(lang === 'az' ? 'az' : lang)}{msg.date ? ` · ${gbook.formatDate(msg.date)}` : ''}</figcaption>
                    </figure>
                  )
                })}
              </div>
            </Vitrine>
          )}

          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={disp} />
        </motion.div>
      )}
    </div>
  )
}

function GemPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -32, top: -32, width: 64, height: 64, borderRadius: '50%', background: `radial-gradient(circle, ${alpha('#5FD3A6', 0.4)}, transparent 70%)` }} />
      <span style={{ position: 'absolute', left: -14, top: -18 }}><EmeraldCut w={12} h={16} uid="pin" /></span>
    </span>
  )
}
