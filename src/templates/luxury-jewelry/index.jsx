import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../_shared/MapSection'
import { EmblemSlot } from '../_shared/MonoContent'
import { Reveal, PopDigit, enterDirection } from '../_shared/motion'
import { hidePhoto } from '../../utils/photoGallery'
import { getTemplateTheme } from '../templateConfig'
import { useInvitation, useGate, openingNames, seatInputProps, alpha } from '../_shared/useInvitation'
import { MusicFab, EqBars, SeatSuggest, StoryBlock, InvitationEnd, ReplyForm } from '../_shared/invitationKit'
import { brilliant, brilliantSide, stepCut, pearCut } from './gems'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   LUXURY JEWELRY — «Zərgərlik evi» (premium redizayn, 2026-10)

   Konsept: yüksək zərgərlik evinin (haute joaillerie) vitrini. Açılış —
   vitrin işığı altında zümrüd məxmər üzük qutusu, altında adlar. Toxunanda
   qapaq qalxır, atlaz astarda zərgərlik evinin möhürü kimi monoqram,
   yastıqda tək daşlı brilyant üzük; sonra daşın içinə girilir. Daxildə:
     hero      → kataloq səhifəsi: real faset sxemli böyük brilyant (gems.js)
     sayğac    → dörd kəsim: dəyirmi, oval, pilləli, armud — rəngsiz brilyant
     məkan     → pilləli kəsim (səkkizbucaq) çərçivə
     proqram   → hərrac kataloqu: «Lot 01 …»
     masa      → məxmər vitrin lövhəsində platin lövhəcik
     RSVP      → butik görüş kartı
     arzular   → lentli hədiyyə kartları
   Rəng: zümrüd məxmər, gecə yaşılı, platin, brilyant ağı, atlaz fil sümüyü.
   Şriftlər: Libre Caslon Display · Raleway (nazik).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('luxury-jewelry')
const ID = 'luxury-jewelry'

const PAL = {
  NIGHT: '#07110E',
  VELVET: '#0E2A23',
  MINT: '#A3D6C7',
  PLAT: '#D9DEE0',
  SATIN: '#EFEAE0',
  IVORY: '#F4F1EA',
  MUTED: '#9DB5AE',
}

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['MINT'], secondary: ['MUTED'], accent: ['MINT'], background: ['NIGHT'], text: ['IVORY'] }
const PLAT_GRAD = 'linear-gradient(135deg, #9EA6AA, #F4F6F7 35%, #C3C9CC 55%, #8E969A 80%, #E8EBEC)'
const VELVET_BG = (C) => `radial-gradient(120% 90% at 30% 20%, #1A4A3D, ${C.VELVET} 55%, #081A15)`

const KEYFRAMES = (C) => `
@keyframes lj-rise { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
@keyframes lj-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes lj-glint { 0%,100% { opacity: 0; transform: scale(.3) rotate(0) } 50% { opacity: 1; transform: scale(1) rotate(45deg) } }
@keyframes lj-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
[data-lj] span[aria-hidden="true"], [data-lj] svg[aria-hidden="true"], [data-lj] div[aria-hidden="true"] { pointer-events: none; }
[data-lj] ::placeholder { color: rgba(157,181,174,.6); }
[data-lj] .lj-satin ::placeholder { color: rgba(14,42,35,.42); }
[data-lj] input:focus-visible, [data-lj] textarea:focus-visible { border-color: ${C.MINT} !important; outline: none; }
[data-lj] button:focus-visible, [data-lj] a:focus-visible, [data-lj] [role="button"]:focus-visible { outline: 1px solid ${C.MINT}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-lj] *, [data-lj] { animation: none !important; transition: none !important; } }
`

/* ─── Brilyant (bax gems.js) ─── */
const BR = brilliant(50)
const SIDE = brilliantSide(20)
const STEP = stepCut(24, 32)
const PEAR = pearCut(36)

/** Dəyirmi brilyant — yuxarıdan, real faset sxemi */
function BrilliantTop({ size = 120, uid = 'b', style }) {
  return (
    <svg viewBox="-54 -54 108 108" width={size} height={size} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <defs>
        <radialGradient id={`lj-t-${uid}`} cx="42%" cy="38%" r="70%">
          <stop offset="0" stopColor="#FFFFFF" /><stop offset=".6" stopColor="#EEF3F6" /><stop offset="1" stopColor="#C2CDD6" />
        </radialGradient>
        <radialGradient id={`lj-v-${uid}`} r=".5">
          <stop offset=".7" stopColor="#0B1418" stopOpacity="0" /><stop offset="1" stopColor="#0B1418" stopOpacity=".28" />
        </radialGradient>
      </defs>
      <circle r="50.6" fill="#2A3540" />
      {BR.facets.map((f, i) => <path key={i} d={f.d} fill={f.fill} stroke="#FFFFFF" strokeOpacity=".55" strokeWidth=".35" strokeLinejoin="round" />)}
      {BR.fire.map((f, i) => <path key={`f${i}`} d={f.d} fill={f.fill} opacity=".6" />)}
      <path d={BR.table} fill={`url(#lj-t-${uid})`} stroke="#FFFFFF" strokeOpacity=".8" strokeWidth=".45" />
      {BR.inner.map((f, i) => <path key={`i${i}`} d={f.d} fill={f.fill} />)}
      <path d={BR.table} fill="none" stroke="#FFFFFF" strokeOpacity=".7" strokeWidth=".4" />
      <circle r="50.4" fill={`url(#lj-v-${uid})`} />
      <circle r="50.4" fill="none" stroke="#E9EEF1" strokeWidth=".9" />
      <path d="M-20 -30L-8 -33" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity=".85" />
    </svg>
  )
}

/** Brilyant — yandan (üzükdə, nişanlarda) */
function Diamond({ size = 30, style }) {
  return (
    <svg viewBox="-21 -9 42 30" width={size} height={size * 0.72} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      {SIDE.facets.map((f, i) => <path key={i} d={f.d} fill={f.fill} stroke="#FFFFFF" strokeOpacity=".7" strokeWidth=".4" strokeLinejoin="round" />)}
      <path d={SIDE.outline} fill="none" stroke="#8E9AA4" strokeWidth=".6" strokeLinejoin="round" />
      <path d={`M${-SIDE.w} 0H${SIDE.w}`} stroke="#8E9AA4" strokeWidth=".6" />
    </svg>
  )
}

/* Sayğac üçün dörd kəsim — hamısı rəngsiz brilyant */
function Round() { return <BrilliantTop size="100%" uid="cd-r" /> }
function Oval() { return <BrilliantTop size="100%" uid="cd-o" style={{ transform: 'scaleX(.74)' }} /> }
function StepTile() {
  return (
    <svg viewBox="-26 -34 52 68" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      {STEP.map((f, i) => <path key={i} d={f.d} fill={f.fill} stroke="#FFFFFF" strokeOpacity=".75" strokeWidth=".5" />)}
      {[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy], i) => (
        <path key={i} d={`M${sx * 16.8} ${sy * 32}L${sx * 7} ${sy * 13.4}M${sx * 24} ${sy * 24.8}L${sx * 10} ${sy * 10}`} stroke="#8E9AA4" strokeOpacity=".5" strokeWidth=".5" />
      ))}
      <path d="M-10 -20L2 -22" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".9" />
    </svg>
  )
}
function Pear() {
  const s = PEAR.s
  return (
    <svg viewBox={`${-s} ${-s - 2} ${2 * s} ${2 * s}`} width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="lj-pear" cx="45%" cy="55%" r="65%"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".6" stopColor="#DCE4EA" /><stop offset="1" stopColor="#8E9CA8" /></radialGradient>
      </defs>
      <path d={PEAR.outline} fill="url(#lj-pear)" stroke="#E9EEF1" strokeWidth=".9" />
      <path d={PEAR.outline} transform="translate(0 7) scale(.52)" fill="#F7FAFC" stroke="#8E9AA4" strokeOpacity=".6" strokeWidth="1" />
      {[-0.55, -0.25, 0.25, 0.55].map((k) => <path key={k} d={`M0 ${-s}L${k * s} ${s * 0.72}`} stroke="#8E9AA4" strokeOpacity=".35" strokeWidth=".6" />)}
      <path d={`M${-s * 0.3} ${-s * 0.05}L${-s * 0.12} ${-s * 0.32}`} stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Glint({ size = 18, delay = 0, style }) {
  return (
    <svg viewBox="-10 -10 20 20" width={size} height={size} aria-hidden="true" style={{ position: 'absolute', animation: `lj-glint 2.8s ease-in-out ${delay}s infinite`, ...style }}>
      <path d="M0 -10Q.9 -.9 10 0Q.9 .9 0 10Q-.9 .9 -10 0Q-.9 -.9 0 -10Z" fill="#fff" />
    </svg>
  )
}

function Chain({ width = 200 }) {
  const C = usePalette()
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <span style={{ width: width / 2 - 16, height: 3, backgroundImage: `radial-gradient(ellipse at center, ${C.PLAT} 0 45%, transparent 50%)`, backgroundSize: '6px 3px', opacity: 0.7 }} />
      <Diamond size={15} />
      <span style={{ width: width / 2 - 16, height: 3, backgroundImage: `radial-gradient(ellipse at center, ${C.PLAT} 0 45%, transparent 50%)`, backgroundSize: '6px 3px', opacity: 0.7 }} />
    </div>
  )
}

/* ═══ 01 — AÇILIŞ: üzük qutusu ═══ */
function RingBoxOpening({ inv, theme }) {
  const C = usePalette()
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const disp = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-lj
      animate={gate.opening ? { opacity: 0 } : {}}
      transition={{ duration: 0.45, delay: 1.65 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: `radial-gradient(60% 45% at 50% 34%, #1E4C40, ${C.NIGHT} 70%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', color: C.IVORY, fontFamily: theme.fonts.body }}>
      {/* vitrin işığı */}
      <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 0, width: '120%', height: '62%', transform: 'translateX(-50%)', background: 'conic-gradient(from 180deg at 50% 0%, transparent 160deg, rgba(220,255,240,.10) 172deg, rgba(220,255,240,.16) 180deg, rgba(220,255,240,.10) 188deg, transparent 200deg)', pointerEvents: 'none', animation: 'lj-fade 1.4s ease-out both' }} />

      <motion.div animate={gate.opening ? { scale: 3.4, y: 40, opacity: 0 } : {}} transition={{ duration: 0.75, ease: [0.7, 0, 0.84, 0], delay: 1.0 }}
        style={{ position: 'relative', width: 'min(74vw, 290px)', animation: 'lj-rise 1.1s cubic-bezier(.2,.8,.2,1) .3s both' }}>
        {/* qapaq: bağlı halda xarici məxmər, açılanda atlaz astar */}
        <div style={{ position: 'relative', height: 'min(50vw, 196px)' }}>
          <motion.div animate={gate.opening ? { scaleY: 0 } : { scaleY: 1 }} transition={{ duration: 0.35, ease: 'easeIn' }}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '38%', transformOrigin: 'bottom', borderRadius: '18px 18px 4px 4px', background: VELVET_BG(C), boxShadow: 'inset 0 2px 0 rgba(255,255,255,.08), inset 0 -8px 14px rgba(0,0,0,.4)' }} />
          <motion.div className="lj-satin" initial={{ scaleY: 0 }} animate={gate.opening ? { scaleY: 1 } : { scaleY: 0 }} transition={{ duration: 0.45, ease: 'easeOut', delay: 0.35 }}
            style={{ position: 'absolute', inset: 0, transformOrigin: 'bottom', borderRadius: '20px 20px 4px 4px', padding: 10, background: VELVET_BG(C) }}>
            <div style={{ height: '100%', borderRadius: '12px 12px 2px 2px', background: `radial-gradient(90% 80% at 50% 30%, #FBF8F1, ${C.SATIN} 60%, #D9D1C2)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.VELVET }}>
              <EmblemSlot mono={ot.mono} size={50} border={`1px solid ${alpha('#9C7A33', 0.6)}`} background="transparent" color="#8A6A2A" font={disp} style={{ animation: 'none' }}>
                <BrilliantTop size={30} uid="lid" />
              </EmblemSlot>
              {ot.show('brand') && <div style={{ marginTop: 8, fontFamily: disp, fontSize: 15, letterSpacing: '.24em', color: '#8A6A2A' }}>{ot.text('brand')}</div>}
              {ot.show('sub') && <div style={{ fontSize: 9.5, letterSpacing: '.3em', color: '#8A6A2A' }}>{ot.text('sub')}</div>}
            </div>
          </motion.div>
        </div>
        {/* gövdə + yastıq + üzük */}
        <div style={{ position: 'relative', height: 'min(36vw, 140px)', marginTop: -2, borderRadius: '4px 4px 16px 16px', background: VELVET_BG(C), boxShadow: '0 30px 50px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.06)', overflow: 'hidden' }}>
          <span aria-hidden="true" style={{ position: 'absolute', left: '8%', right: '8%', top: '10%', height: '44%', borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 35%, #2A6252, #12342B 70%)', boxShadow: 'inset 0 -6px 10px rgba(0,0,0,.45)' }} />
          <span aria-hidden="true" style={{ position: 'absolute', left: '49.6%', top: '22%', width: 2, height: '24%', background: '#06150F' }} />
          <motion.div initial={{ opacity: 0, y: 14 }} animate={gate.opening ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }} transition={{ duration: 0.5, delay: 0.6 }}
            style={{ position: 'absolute', left: 'calc(50% - 35px)', top: '-2%', width: 70, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Diamond size={36} style={{ position: 'relative', zIndex: 1 }} />
            <svg viewBox="-30 -4 60 40" width="56" height="37" aria-hidden="true" style={{ display: 'block', marginTop: -6, overflow: 'visible' }}>
              <defs>
                <linearGradient id="lj-band" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F4F6F7" /><stop offset=".45" stopColor="#9EA6AA" /><stop offset=".7" stopColor="#E8EBEC" /><stop offset="1" stopColor="#7E868A" /></linearGradient>
              </defs>
              <path d="M-6 0L-10 6M6 0L10 6M0 0V5" stroke="#C3C9CC" strokeWidth="1.6" strokeLinecap="round" />
              <ellipse cx="0" cy="20" rx="25" ry="14" fill="none" stroke="url(#lj-band)" strokeWidth="4.5" />
            </svg>
            <Glint size={20} delay={0.9} style={{ left: 10, top: -2 }} />
          </motion.div>
        </div>
      </motion.div>

      <motion.div animate={gate.opening ? { opacity: 0, y: 14 } : {}} transition={{ duration: 0.4 }}
        style={{ marginTop: 'clamp(26px, 5vh, 40px)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {ot.show('kicker') && <div style={{ fontSize: 11.5, letterSpacing: '.36em', paddingLeft: '.36em', color: C.MUTED, animation: 'lj-rise .8s ease-out .9s both' }}>{String(ot.text('kicker')).toLocaleUpperCase(inv.lang === 'az' ? 'az' : inv.lang)}</div>}
        {titleOv !== '' && (
          <div style={{ marginTop: 12, fontFamily: disp, fontSize: 'clamp(32px, 10vw, 42px)', lineHeight: 1.1, color: C.IVORY, animation: 'lj-rise 1s ease-out 1.1s both' }}>
            {first}{second && <><span style={{ fontStyle: 'italic', color: C.MINT, margin: '0 .25em', fontSize: '.8em' }}>{ot.text('and')}</span>{second}</>}
          </div>
        )}
        {ot.show('meta') && <div style={{ marginTop: 10, fontSize: 13.5, letterSpacing: '.14em', color: C.MUTED, animation: 'lj-rise .8s ease-out 1.3s both' }}>{ot.text('meta')}</div>}
        {ot.show('cta') && (
          <div style={{ marginTop: 22, minHeight: 48, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', border: `1px solid ${alpha(C.PLAT, 0.6)}`, color: C.IVORY, fontSize: 13.5, letterSpacing: '.24em', animation: 'lj-rise .8s ease-out 1.6s both' }}>
            {String(ot.text('cta')).toLocaleUpperCase(inv.lang === 'az' ? 'az' : inv.lang)}
          </div>
        )}
        {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 12.5, color: C.MUTED, animation: 'lj-fade .8s ease-out 2s both, lj-hint 3s ease-in-out 2.8s infinite' }}>{ot.text('hint')}</div>}
      </motion.div>
    </motion.div>
  )
}

/* Bölmə */
function Vitrine({ id, section, title, kicker, sub, children, disp }) {
  const C = usePalette()
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '60px 20px 64px' }}>
      <Reveal style={{ maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Chain width={150} />
            {title && <h2 style={{ margin: '16px 0 0', fontFamily: disp, fontWeight: 400, fontSize: scaleFont('clamp(30px, 8.6vw, 38px)', C.hs), lineHeight: 1.15, color: C.IVORY, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontSize: 13, letterSpacing: '.08em', color: C.MUTED }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 320, fontSize: 15, color: C.MUTED, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${alpha(C.PLAT, 0.4)}`, borderRadius: 0,
  padding: '14px 2px', fontSize: 16, color: C.IVORY, outline: 'none',
})
const btn = (C, on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 0,
  fontSize: 13, letterSpacing: '.2em', textDecoration: 'none', cursor: 'pointer', textTransform: 'uppercase',
  background: on ? PLAT_GRAD : 'transparent', color: on ? C.NIGHT : C.IVORY, border: on ? 'none' : `1px solid ${alpha(C.PLAT, 0.5)}`,
})

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function LuxuryJewelryTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const disp = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const year = String(weddingData.date || '').slice(0, 4)
  const OCT = 'polygon(14% 0, 86% 0, 100% 11%, 100% 89%, 86% 100%, 14% 100%, 0 89%, 0 11%)'

  return (
    <PaletteContext.Provider value={C}>
      <div data-lj data-enter={enterDirection(ID)} style={{
        background: `radial-gradient(120% 50% at 50% 0%, #143A31, ${C.NIGHT} 60%)`, backgroundColor: C.NIGHT,
        minHeight: '100vh', fontFamily: body, color: C.IVORY, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
        fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.MINT, 0.25),
      }}>
        <style>{KEYFRAMES(C)}</style>
        {!inv.opened && <RingBoxOpening inv={inv} theme={theme} />}

        <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.VELVET, border: `1px solid ${alpha(C.PLAT, 0.5)}` }}>
          {({ playing }) => <EqBars playing={playing} color={C.MINT} idle={alpha(C.PLAT, 0.35)} />}
        </MusicFab>

        {inv.opened && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
            <header style={{
              position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: alpha(C.NIGHT, 0.88), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
              borderBottom: `1px solid ${alpha(C.PLAT, 0.14)}`,
            }}>
              <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 14, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
                <span aria-hidden="true">←</span>{tr.btn_back}
              </button>
              <div style={{ fontFamily: disp, fontSize: 16, letterSpacing: '.3em', paddingLeft: '.3em' }}>{T.brand}</div>
              <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
            </header>

            {/* HERO — kataloq səhifəsi */}
            <section data-section="hero" style={{ padding: '44px 20px 40px', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 168, margin: '0 auto' }}>
                <span aria-hidden="true" style={{ position: 'absolute', inset: -46, borderRadius: '50%', background: `radial-gradient(circle, ${alpha('#E8F4FF', 0.22)}, transparent 62%)` }} />
                <BrilliantTop size={168} uid="hero" style={{ position: 'relative', margin: '0 auto', filter: 'drop-shadow(0 18px 26px rgba(0,0,0,.55))' }} />
                <Glint size={26} delay={0.4} style={{ left: 10, top: 18 }} />
                <Glint size={18} delay={1.6} style={{ right: 6, bottom: 34 }} />
                <Glint size={14} delay={2.4} style={{ right: 40, top: 6 }} />
              </div>
              <div style={{ marginTop: 26, fontSize: 11.5, letterSpacing: '.34em', paddingLeft: '.34em', color: C.MUTED }}>{String(`${T.collection} ${year}`).toLocaleUpperCase(lang === 'az' ? 'az' : lang)}</div>
              <div style={{ marginTop: 6, fontSize: 14.5, color: C.MINT }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              <h1 style={{ margin: '16px 0 0', fontFamily: disp, fontWeight: 400, fontSize: 'clamp(42px, 13vw, 60px)', lineHeight: 1.04, color: C.IVORY, textWrap: 'balance' }}>
                {inv.heroTitle ? inv.heroTitle : inv.isCouple ? <>{inv.groom}<span style={{ display: 'block', fontStyle: 'italic', fontSize: '.5em', color: C.MINT, margin: '4px 0' }}>{inv.and}</span>{inv.bride}</> : inv.single}
              </h1>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 12, fontSize: 14.5, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              <div style={{ margin: '26px 0 20px' }}><Chain width={200} /></div>
              <div style={{ fontFamily: disp, fontSize: 21 }}>{inv.fullDate}</div>
              <div style={{ marginTop: 6, fontSize: 14.5, letterSpacing: '.04em', color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
              <p style={{ margin: '22px auto 0', maxWidth: 300, fontSize: 15, lineHeight: 1.7, color: C.MUTED }}>{tr.inv_join}</p>
            </section>

            {/* SAYĞAC — dörd kəsim */}
            {S.countdown && (
              <Vitrine section="countdown" disp={disp} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, maxWidth: 380, margin: '0 auto' }}>
                  {[
                    { v: cd.days, l: cd.labels.days, G: Round },
                    { v: cd.hours, l: cd.labels.hours, G: Oval },
                    { v: cd.minutes, l: cd.labels.minutes, G: StepTile },
                    { v: cd.seconds, l: cd.labels.seconds, G: Pear, pop: true },
                  ].map(({ v, l, G, pop }) => (
                    <div key={l} style={{ textAlign: 'center' }}>
                      <div style={{ width: '70%', aspectRatio: '1', margin: '0 auto', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.5))' }}><G /></div>
                      <div style={{ marginTop: 10, fontFamily: disp, fontSize: 'clamp(28px, 8vw, 34px)', lineHeight: 1, color: pop ? C.MINT : C.IVORY, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></div>
                      <div style={{ marginTop: 6, fontSize: 11, letterSpacing: '.18em', color: C.MUTED, textTransform: 'uppercase' }}>{l}</div>
                    </div>
                  ))}
                </div>
              </Vitrine>
            )}

            <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

            {/* MƏKAN — zümrüd kəsim çərçivə */}
            {S.venue && (
              <Vitrine section="venue" disp={disp} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
                <div style={{ position: 'relative', width: 'min(84vw, 320px)', margin: '0 auto', padding: 3, clipPath: OCT, background: PLAT_GRAD }}>
                  <div style={{ clipPath: OCT, padding: 10, background: VELVET_BG(C) }}>
                    <div style={{ clipPath: OCT, overflow: 'hidden', background: C.NIGHT }}>
                      <MapSection
                        weddingData={weddingData} theme={theme} accent={C.MINT} height="clamp(300px, 92vw, 380px)"
                        map={{ opacity: 0.55, filter: 'grayscale(1) brightness(.6) contrast(1.2)', tintOpacity: 0.55, tint: '#1F5A4A', blend: 'color' }}
                        frame={<GemPin />}
                        fallback={<div style={{ height: 'clamp(300px, 92vw, 380px)', position: 'relative', background: `radial-gradient(circle at 50% 50%, #1A4A3D, ${C.NIGHT} 75%)` }}><GemPin /></div>}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: 24, fontFamily: disp, fontSize: 25, lineHeight: 1.25 }}>{weddingData.venueName}</div>
                {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 14.5, color: C.MUTED }}>{weddingData.venueNote}</div>}
                <div style={{ display: 'flex', gap: 8, marginTop: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={btn(C, true)}>{tr.inv_directions_btn}</a>}
                  {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={btn(C, !inv.dirUrl)}>Maps</a>}
                  {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(C, false)}>Waze</a>}
                  {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(C, false)}>Apple</a>}
                </div>
              </Vitrine>
            )}

            {/* PROQRAM — hərrac kataloqu */}
            {S.program && (
              <Vitrine section="program" disp={disp} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
                <ol style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: `1px solid ${alpha(C.PLAT, 0.25)}` }}>
                  {timeline.events.map((ev, i) => (
                    <li key={i} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 14, padding: '18px 0', borderBottom: `1px solid ${alpha(C.PLAT, 0.25)}` }}>
                      <div>
                        <div style={{ fontSize: 10.5, letterSpacing: '.22em', color: C.MUTED }}>{T.lot.toUpperCase()}</div>
                        <div style={{ fontFamily: disp, fontSize: 30, lineHeight: 1, color: C.MINT }}>{String(i + 1).padStart(2, '0')}</div>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: disp, fontSize: 20, lineHeight: 1.3 }}>{ev.label}</div>
                        <div style={{ marginTop: 4, fontSize: 13, letterSpacing: '.14em', color: C.MUTED, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </Vitrine>
            )}

            {S.dresscode && (
              <Vitrine section="dresscode" disp={disp} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
                <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={disp} align="center" onDark />
              </Vitrine>
            )}

            {/* MASA — məxmər vitrin */}
            {S.seating && !seating.isEmpty && (
              <Vitrine section="seating" disp={disp} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
                <input {...seatInputProps(inv, 'lj-seat-list')} style={field(C)} />
                <SeatSuggest inv={inv} id="lj-seat-list" c={{ bg: C.VELVET, border: `1px solid ${alpha(C.PLAT, 0.3)}`, active: alpha(C.MINT, 0.12), text: C.IVORY, table: C.MINT, radius: 0, font: body }} />
                {seating.showNotFound && <div style={{ marginTop: 12, fontSize: 14, color: C.MUTED, textAlign: 'center' }}>{tr.inv_seat_fullname}</div>}
                {seating.selected && (
                  <div style={{ marginTop: 28, padding: '28px 20px 22px', borderRadius: 14, background: VELVET_BG(C), boxShadow: 'inset 0 2px 0 rgba(255,255,255,.06), inset 0 -10px 20px rgba(0,0,0,.4), 0 24px 40px -20px #000', textAlign: 'center', animation: 'lj-rise .6s ease-out both' }}>
                    <div style={{ fontSize: 14.5, color: C.MUTED }}>{seating.selected.full_name}</div>
                    <div style={{ display: 'inline-block', marginTop: 14, padding: 2, background: PLAT_GRAD, borderRadius: 4 }}>
                      <div style={{ padding: '12px 30px', borderRadius: 3, background: 'linear-gradient(180deg, #F4F6F7, #C9CFD2)', color: C.VELVET }}>
                        <div style={{ fontSize: 10.5, letterSpacing: '.3em' }}>{T.table.toUpperCase()}</div>
                        <div style={{ fontFamily: disp, fontSize: 52, lineHeight: 1 }}>{seating.selected.table_id}</div>
                      </div>
                    </div>
                    {seating.tablemates.length > 0 && <div style={{ marginTop: 16, fontSize: 14, color: C.MUTED, lineHeight: 1.6 }}>{seating.tablemates.map((g) => g.full_name).join(' · ')}</div>}
                    <button onClick={seating.reset} data-press style={{ marginTop: 6, background: 'none', border: 'none', color: C.MINT, fontSize: 14, minHeight: 44, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: body }}>
                      {seatingL.again || 'Yenidən axtar'}
                    </button>
                  </div>
                )}
              </Vitrine>
            )}

            {/* KOLLEKSİYA */}
            {S.gallery && (
              <Vitrine section="gallery" id="gallery-section" disp={disp} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
                {gallery.demoPhotos.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 30 }}>
                    {gallery.demoPhotos.map((url, i) => (
                      <div key={i} style={{ padding: 1.5, background: PLAT_GRAD }}>
                        <div style={{ padding: 5, background: C.VELVET }}>
                          <div style={{ aspectRatio: '4 / 5', overflow: 'hidden', background: C.NIGHT }}>
                            <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', padding: 2, background: PLAT_GRAD }}>
                    <div style={{ padding: 12, background: C.IVORY }}>
                      <QRCodeSVG value={gallery.photoShareUrl} size={124} bgColor={C.IVORY} fgColor={C.VELVET} level="M" />
                    </div>
                  </div>
                  <div style={{ marginTop: 14, fontSize: 14, color: C.MUTED }}>{tr.inv_scan_upload}</div>
                  <a data-press href={gallery.photoShareUrl} style={{ ...btn(C, true), marginTop: 16 }}>{tr.inv_gallery_btn}</a>
                  <p style={{ margin: '16px auto 0', maxWidth: 340, fontSize: 14.5, color: C.MUTED, lineHeight: 1.7 }}>{tr.inv_gallery_desc}</p>
                </div>
              </Vitrine>
            )}

            {/* RSVP — butik görüş kartı */}
            {S.rsvp && (
              <Vitrine section="rsvp" disp={disp} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
                <ReplyForm inv={inv} t={{ ink: C.IVORY, muted: C.MUTED, line: alpha(C.PLAT, 0.4), hair: alpha(C.PLAT, 0.14), accent: C.PLAT, font: body, display: disp, radius: 0, btnUpper: true, btnTracking: '.2em', doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Diamond size={30} /></div>, marker: (a) => <svg width="14" height="14" viewBox="-8 -8 16 16"><path d="M-6 -2.5L-3 -6.5H3L6 -2.5L0 7Z" fill={a ? '#FFFFFF' : 'none'} stroke={a ? C.PLAT : alpha(C.PLAT, 0.45)} strokeWidth="1" strokeLinejoin="round" /></svg>, suggest: { bg: C.VELVET, border: `1px solid ${alpha(C.PLAT, 0.3)}`, active: alpha(C.MINT, 0.12), text: C.IVORY, table: C.MINT, radius: 0, font: body } }} />
              </Vitrine>
            )}

            {/* HƏDİYYƏ KARTLARI */}
            {S.guestbook && (
              <Vitrine section="guestbook" disp={disp} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
                <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 34 }}>
                  <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={field(C)} />
                  <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...field(C), resize: 'none', lineHeight: 1.5 }} />
                  <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...btn(C, gbook.canSubmit), width: '100%', marginTop: 10, opacity: gbook.canSubmit ? 1 : 0.5, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}>
                    {gbook.sending ? gbookL.sending : gbookL.btn}
                  </button>
                  {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 13.5 }}>⚠ {gbookL.error}</p>}
                </form>
                <div style={{ display: 'grid', gap: 16 }}>
                  {gbook.messages.map((raw, i) => {
                    const msg = gbook.readMessage(raw)
                    return (
                      <figure className="lj-satin" key={msg.name + i} style={{ position: 'relative', margin: 0, padding: '20px 20px 16px 22px', background: `linear-gradient(160deg, #FBF8F1, ${C.SATIN})`, color: C.VELVET, overflow: 'hidden', boxShadow: '0 16px 30px -18px #000' }}>
                        <span aria-hidden="true" style={{ position: 'absolute', right: -26, top: 14, width: 110, height: 14, background: `linear-gradient(180deg, #2A7A60, #1F7A5C 50%, #145440)`, transform: 'rotate(45deg)', boxShadow: '0 2px 4px rgba(0,0,0,.2)' }} />
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
    </PaletteContext.Provider>
  )
}

function GemPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -34, top: -34, width: 68, height: 68, borderRadius: '50%', background: `radial-gradient(circle, ${alpha('#E8F4FF', 0.35)}, transparent 70%)` }} />
      <span style={{ position: 'absolute', left: -17, top: -17 }}><BrilliantTop size={34} uid="pin" /></span>
    </span>
  )
}
