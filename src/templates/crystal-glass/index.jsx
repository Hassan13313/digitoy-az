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
   CRYSTAL GLASS — «Çilçıraq» (premium redizayn, 2026-10)

   Konsept: böyük toy salonunun kristal çilçırağı və kəsilmiş şüşə.
   Açılış — yuxarıdan kristal muncuq sapları enir, ucunda badam damcılar;
   işıq onlardan keçib divara göy qurşağı salır, ortada kristal lövhədə adlar.
   Toxunanda çilçıraq yuxarı qalxır. Daxildə:
     hero      → səkkizbucaq fasetli (bevel) kristal çərçivə
     sayğac    → kəsilmiş kristal kublar
     məkan     → fasetli güzgü çərçivə
     proqram   → prizma: ağ işıq spektrə ayrılır, hər rəng bir hadisəyə gedir
     masa/RSVP → akril kart, kənarında spektral parıltı
   Rəng: buz ağı, qrafit, gümüş; yeganə rəng — işığın öz spektri.
   Şriftlər: Josefin Sans (nazik, art-deko həndəsə) · Onest (mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('crystal-glass')
const ID = 'crystal-glass'

const LABELS = {
  countdown: { title: { az: 'İşıqlar yanana qədər', en: 'Until the lights come on', ru: 'Пока не зажгутся огни' } },
  venue:     { title: { az: 'Salon', en: 'The hall', ru: 'Зал' } },
  program:   { title: { az: 'Axşamın spektri', en: 'Spectrum of the evening', ru: 'Спектр вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Attire', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Əks olunanlar', en: 'Reflections', ru: 'Отражения' } },
  rsvp:      { title: { az: 'Bizimlə olacaqsınızmı?', en: 'Will you be with us?', ru: 'Вы будете с нами?' } },
  guestbook: { title: { az: 'Arzular', en: 'Wishes', ru: 'Пожелания' } },
}

const ICE = '#EEF2F6'
const INK = '#23303B'
const STEEL = '#5A6772'
const SILVER = '#AEB9C3'
const SPEC = ['#EF8A86', '#F2B36E', '#E9CF6A', '#8ACB98', '#7DB8E6', '#958FE6', '#C094E0']
const SPEC_LINE = `linear-gradient(90deg, ${SPEC.join(', ')})`
const SPEC_SOFT = `linear-gradient(120deg, ${SPEC.map((c) => alpha(c, 0.75)).join(', ')})`
const FACE = 'linear-gradient(160deg, #FCFDFE, #EEF3F7 62%, #F6F9FB)'
const BEVEL = 'conic-gradient(from -45deg, #FFFFFF 0 25%, #C9D3DC 25% 50%, #B6C2CD 50% 75%, #E3E9EF 75% 100%)'
const oct = (c) => `polygon(${c}px 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, ${c}px 100%, 0 calc(100% - ${c}px), 0 ${c}px)`

/* Çilçıraq sapları — mərkəzdə uzun, kənarlarda qısa (V forması) */
const STRANDS = [
  { x: 28, n: 3 }, { x: 70, n: 5 }, { x: 112, n: 6 }, { x: 156, n: 8 }, { x: 200, n: 9 },
  { x: 244, n: 8 }, { x: 288, n: 6 }, { x: 330, n: 5 }, { x: 372, n: 3 },
]
const BEAD_GAP = 27
const SWAG = (() => {
  const pts = []
  for (let s = 0; s < STRANDS.length - 1; s++) {
    const a = STRANDS[s].x, b = STRANDS[s + 1].x
    for (let k = 1; k < 7; k++) {
      const t = k / 7
      pts.push([a + (b - a) * t, 16 + Math.sin(Math.PI * t) * 20])
    }
  }
  return pts
})()

const KEYFRAMES = `
@keyframes cg-drop  { 0% { transform: translateY(-460px) } 70% { transform: translateY(10px) } 85% { transform: translateY(-4px) } 100% { transform: none } }
@keyframes cg-sway  { 0%,100% { transform: rotate(-1.2deg) } 50% { transform: rotate(1.2deg) } }
@keyframes cg-glint { 0%,100% { opacity: 0; transform: scale(.4) } 50% { opacity: 1; transform: scale(1) } }
@keyframes cg-rise  { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
@keyframes cg-fade  { from { opacity: 0 } to { opacity: 1 } }
@keyframes cg-sheen { 0% { transform: translateX(-130%) skewX(-18deg); opacity: 1 } 85% { opacity: 1 } 100% { transform: translateX(330%) skewX(-18deg); opacity: 0 } }
@keyframes cg-hint  { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
[data-cg] span[aria-hidden="true"], [data-cg] svg[aria-hidden="true"], [data-cg] div[aria-hidden="true"] { pointer-events: none; }
[data-cg] ::placeholder { color: rgba(90,103,114,.6); }
[data-cg] input:focus-visible, [data-cg] textarea:focus-visible { border-color: ${INK} !important; outline: none; background: #fff !important; }
[data-cg] button:focus-visible, [data-cg] a:focus-visible, [data-cg] [role="button"]:focus-visible { outline: 1.5px solid ${INK}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-cg] *, [data-cg] { animation: none !important; transition: none !important; } }
`

/* ─── Kristal elementləri ─── */
function CrystalDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="cg-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset=".35" stopColor="#DCE5EC" />
          <stop offset=".55" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#B9C6D1" />
        </linearGradient>
        <linearGradient id="cg-spec" x1="0" y1="0" x2="1" y2="0">
          {SPEC.map((c, i) => <stop key={c} offset={i / (SPEC.length - 1)} stopColor={c} />)}
        </linearGradient>
      </defs>
    </svg>
  )
}

const BEAD_OUT = 'M-4 -11L4 -11L8.5 -4.5L8.5 4.5L4 11L-4 11L-8.5 4.5L-8.5 -4.5Z'
const BEAD_IN = 'M-2 -5.5L2 -5.5L4.2 -2.2L4.2 2.2L2 5.5L-2 5.5L-4.2 2.2L-4.2 -2.2Z'
function Bead({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={BEAD_OUT} fill="url(#cg-glass)" stroke="#8C9BA8" strokeOpacity=".55" strokeWidth=".5" />
      <path d={BEAD_IN} fill="#fff" fillOpacity=".75" stroke="#8C9BA8" strokeOpacity=".35" strokeWidth=".4" />
      <path d="M-4 -11L-2 -5.5M4 -11L2 -5.5M8.5 -4.5L4.2 -2.2M8.5 4.5L4.2 2.2M4 11L2 5.5M-4 11L-2 5.5M-8.5 4.5L-4.2 2.2M-8.5 -4.5L-4.2 -2.2" stroke="#8C9BA8" strokeOpacity=".35" strokeWidth=".4" />
    </g>
  )
}
function Drop({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 -24C11 -9 11 11 0 27C-11 11 -11 -9 0 -24Z" fill="url(#cg-glass)" stroke="#8C9BA8" strokeOpacity=".55" strokeWidth=".5" />
      <path d="M0 -24V27M0 -24C5 -8 5 10 0 27M0 -24C-5 -8 -5 10 0 27M-8.5 2H8.5" fill="none" stroke="#8C9BA8" strokeOpacity=".35" strokeWidth=".45" />
      <path d="M-3 -12C-5 -4 -5 4 -3 10" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M2 4L6 6" stroke="url(#cg-spec)" strokeWidth="2.4" strokeLinecap="round" opacity=".8" />
    </g>
  )
}
function Sparkle({ x, y, d = 0, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -9Q1 -1 9 0Q1 1 0 9Q-1 1 -9 0Q-1 -1 0 -9Z" fill="#fff" style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: `cg-glint 2.6s ease-in-out ${d}s infinite` }} />
    </g>
  )
}

function Chandelier() {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMin meet" width="100%" height="100%" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <path d="M0 6H400" stroke="#C2CCD5" strokeWidth="1.2" />
      {SWAG.map(([x, y], i) => <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="2.6" fill="url(#cg-glass)" stroke="#8C9BA8" strokeOpacity=".5" strokeWidth=".4" />)}
      {STRANDS.map((s, i) => {
        const end = 26 + s.n * BEAD_GAP
        return (
          <g key={s.x} style={{ animation: `cg-drop 1.5s cubic-bezier(.3,.7,.3,1) ${(0.1 + Math.abs(i - 4) * 0.12).toFixed(2)}s both` }}>
            <g style={{ transformBox: 'view-box', transformOrigin: `${s.x}px 6px`, animation: `cg-sway ${(5 + (i % 3) * 0.9).toFixed(1)}s ease-in-out ${(1.6 + i * 0.2).toFixed(1)}s infinite` }}>
              <path d={`M${s.x} 6V${end + 4}`} stroke="#B8C3CD" strokeWidth=".8" />
              {Array.from({ length: s.n }, (_, k) => <Bead key={k} x={s.x} y={30 + k * BEAD_GAP} />)}
              <Drop x={s.x} y={end + 30} />
              {i % 2 === 0 && <Sparkle x={s.x + 4} y={end + 22} d={2 + i * 0.5} s={0.8} />}
              {i % 3 === 1 && <Sparkle x={s.x - 5} y={30 + Math.floor(s.n / 2) * BEAD_GAP} d={2.6 + i * 0.4} s={0.6} />}
            </g>
          </g>
        )
      })}
    </svg>
  )
}

/* Brilyant kəsimi — yuxarıdan baxış (bölmə nişanı) */
function Brilliant({ size = 16, color = INK, style }) {
  return (
    <svg viewBox="-10 -10 20 20" width={size} height={size} aria-hidden="true" style={{ display: 'block', ...style }}>
      <path d="M-4 -9.5L4 -9.5L9.5 -4L9.5 4L4 9.5L-4 9.5L-9.5 4L-9.5 -4Z" fill="none" stroke={color} strokeWidth=".8" />
      <path d="M-2 -4.6L2 -4.6L4.6 -2L4.6 2L2 4.6L-2 4.6L-4.6 2L-4.6 -2Z" fill="none" stroke={color} strokeWidth=".7" />
      <path d="M0 -9.5L-2 -4.6M0 -9.5L2 -4.6M9.5 0L4.6 -2M9.5 0L4.6 2M0 9.5L2 4.6M0 9.5L-2 4.6M-9.5 0L-4.6 2M-9.5 0L-4.6 -2" stroke={color} strokeWidth=".55" />
    </svg>
  )
}

/* Fasetli kristal çərçivə — bevel kənar + buzlu üz */
function Bevel({ cut = 22, depth = 10, children, style, inner, shadow = true }) {
  return (
    <div style={{ filter: shadow ? 'drop-shadow(0 22px 26px rgba(35,48,59,.16))' : undefined, ...style }}>
      <div style={{ position: 'relative', clipPath: oct(cut), padding: depth, background: BEVEL }}>
        <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 8%, rgba(239,138,134,.45) 14%, rgba(233,207,106,.45) 18%, rgba(138,203,152,.45) 22%, rgba(125,184,230,.45) 26%, rgba(149,143,230,.45) 30%, transparent 36%)' }} />
        <div style={{ position: 'relative', clipPath: oct(Math.max(0, cut - depth * 0.6)), background: FACE, ...inner }}>{children}</div>
      </div>
    </div>
  )
}

/* Akril kart — buzlu səth, spektral kənar */
function Acrylic({ children, style, pad = '26px 22px' }) {
  return (
    <div style={{ position: 'relative', padding: 1.2, borderRadius: 20, background: SPEC_SOFT, boxShadow: '0 26px 44px -28px rgba(35,48,59,.42)', ...style }}>
      <div style={{ borderRadius: 19, padding: pad, background: 'linear-gradient(150deg, rgba(255,255,255,.96), rgba(244,248,251,.9))' }}>{children}</div>
    </div>
  )
}

/* Asılı damcı — bölmə ayırıcısı */
function Pendant() {
  return (
    <svg viewBox="-12 0 24 96" width="20" height="80" aria-hidden="true" style={{ display: 'block', margin: '0 auto' }}>
      <path d="M0 0V40" stroke={SILVER} strokeWidth=".8" />
      <Bead x={0} y={26} />
      <Drop x={0} y={66} />
    </svg>
  )
}

/* ═══ 01 — AÇILIŞ ═══ */
function ChandelierOpening({ inv, theme }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 1350 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-cg
      animate={gate.opening ? { opacity: 0 } : {}}
      transition={{ duration: 0.45, delay: 0.85 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden',
        background: `radial-gradient(110% 70% at 50% 20%, #FFFFFF, ${ICE} 60%, #DFE6EC)`, color: INK, fontFamily: theme.fonts.body,
      }}>
      {/* divara düşən göy qurşaqları */}
      <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'blur(5px)', animation: 'cg-fade 2s ease-out 1.6s both' }}>
        <path d="M-40 560Q120 470 260 540" fill="none" stroke="url(#cg-spec)" strokeWidth="9" opacity=".22" />
        <path d="M200 760Q320 660 460 700" fill="none" stroke="url(#cg-spec)" strokeWidth="7" opacity=".18" />
        <path d="M300 300Q370 250 440 290" fill="none" stroke="url(#cg-spec)" strokeWidth="6" opacity=".16" />
      </svg>

      <motion.div animate={gate.opening ? { y: '-108%' } : {}} transition={{ duration: 1.0, ease: [0.6, 0, 0.35, 1] }}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '50%' }}>
        <Chandelier />
      </motion.div>

      <motion.div
        animate={gate.opening ? { opacity: 0, filter: 'blur(8px) brightness(1.6)', scale: 1.04 } : {}}
        transition={{ duration: 0.6 }}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '47%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ width: 'min(86vw, 336px)', animation: 'cg-rise 1.2s cubic-bezier(.2,.8,.2,1) 1.4s both' }}>
          <Bevel cut={20} depth={8} inner={{ padding: '22px 18px 22px', overflow: 'hidden' }}>
            <span aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '30%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.9), transparent)', animation: 'cg-sheen 1.6s ease-in-out 2.4s both' }} />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <EmblemSlot mono={ot.mono} size={48} border={`1px solid ${alpha(INK, 0.3)}`} background="#fff" color={INK} font={head} style={{ animation: 'none' }}>
                <Brilliant size={22} color={STEEL} />
              </EmblemSlot>
            </div>
            {ot.show('kicker') && <div style={{ marginTop: 12, fontFamily: head, fontWeight: 300, fontSize: 12.5, letterSpacing: '.32em', textTransform: 'uppercase', paddingLeft: '.32em', color: STEEL }}>{ot.text('kicker')}</div>}
            {titleOv !== '' && (
              <div style={{ marginTop: 10, fontFamily: head, fontWeight: 200, fontSize: 'clamp(30px, 9.4vw, 40px)', lineHeight: 1.15, color: INK }}>
                {first}{second && <><span style={{ fontWeight: 300, margin: '0 .28em', background: SPEC_LINE, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>&amp;</span>{second}</>}
              </div>
            )}
            {ot.show('meta') && <div style={{ marginTop: 12, fontSize: 13.5, color: STEEL }}>{ot.text('meta')}</div>}
          </Bevel>
        </div>
        {ot.show('cta') && (
          <div style={{ marginTop: 26, minHeight: 48, padding: '13px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: INK, color: '#fff', fontFamily: head, fontWeight: 400, fontSize: 15, letterSpacing: '.08em', animation: 'cg-rise .9s ease-out 2.1s both' }}>
            {ot.text('cta')}
          </div>
        )}
        {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 13, color: STEEL, animation: 'cg-fade .8s ease-out 2.6s both, cg-hint 3s ease-in-out 3.4s infinite' }}>{ot.text('hint')}</div>}
      </motion.div>
    </motion.div>
  )
}

/* Bölmə */
function Hall({ id, section, title, kicker, sub, children, head }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '0 20px 64px' }}>
      <Pendant />
      <Reveal style={{ maxWidth: 500, margin: '0 auto', paddingTop: 22 }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 300, fontSize: 'clamp(28px, 8vw, 34px)', lineHeight: 1.2, color: INK, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontSize: 14, color: STEEL }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 320, fontSize: 15.5, color: STEEL, lineHeight: 1.55 }}>{sub}</p>}
            <div aria-hidden="true" style={{ width: 54, height: 1.5, margin: '16px auto 0', background: SPEC_LINE, opacity: 0.8 }} />
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: 'rgba(255,255,255,.75)', border: `1px solid ${alpha(SILVER, 0.9)}`, borderRadius: 14,
  padding: '14px 16px', fontSize: 16, color: INK, outline: 'none', boxShadow: 'inset 0 1px 2px rgba(35,48,59,.06)',
}
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 999,
  fontSize: 15, textDecoration: 'none', cursor: 'pointer', letterSpacing: '.02em',
  background: on ? INK : 'rgba(255,255,255,.7)', color: on ? '#fff' : INK, border: `1px solid ${on ? INK : alpha(SILVER, 0.9)}`,
})

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function CrystalGlassTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, rsvp, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const n = timeline.events.length
  const lineX = (k) => 12 + (n - 1 - k) * 6

  return (
    <div data-cg data-enter={enterDirection(ID)} style={{
      background: `linear-gradient(180deg, #F7F9FB, ${ICE} 30%, #E9EEF2 100%)`, backgroundColor: ICE,
      minHeight: '100vh', fontFamily: body, color: INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(SILVER, 0.5),
    }}>
      <style>{KEYFRAMES}</style>
      <CrystalDefs />
      {!inv.opened && <ChandelierOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: 'rgba(255,255,255,.9)', border: `1px solid ${alpha(SILVER, 0.9)}`, boxShadow: '0 8px 20px rgba(35,48,59,.14)' }}>
        {({ playing }) => <EqBars playing={playing} color={INK} idle={alpha(INK, 0.3)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(247,249,251,.84)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${alpha(SILVER, 0.5)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: STEEL, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 300, fontSize: 16, letterSpacing: '.2em' }}>DIGITOY</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — fasetli kristal çərçivə */}
          <section style={{ padding: '30px 18px 30px' }}>
            <Bevel cut={34} depth={12} style={{ maxWidth: 420, margin: '0 auto' }} inner={{ padding: '44px 22px 40px', textAlign: 'center' }}>
              <Brilliant size={26} color={STEEL} style={{ margin: '0 auto' }} />
              <div style={{ marginTop: 16, fontFamily: head, fontWeight: 300, fontSize: 12.5, letterSpacing: '.32em', textTransform: 'uppercase', paddingLeft: '.32em', color: STEEL }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              <p style={{ margin: '12px auto 0', maxWidth: 280, fontSize: 15.5, lineHeight: 1.55, color: STEEL }}>{tr.inv_join}</p>
              <h1 style={{ margin: '24px 0 0', fontFamily: head, fontWeight: 200, fontSize: 'clamp(40px, 12.5vw, 56px)', lineHeight: 1.08, color: INK, textWrap: 'balance' }}>
                {inv.heroTitle ? inv.heroTitle : inv.isCouple ? (
                  <>{inv.groom}<span style={{ display: 'block', fontWeight: 300, fontSize: '.6em', margin: '4px 0', background: SPEC_LINE, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>&amp;</span>{inv.bride}</>
                ) : inv.single}
              </h1>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 14, fontSize: 15, color: STEEL }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              <div aria-hidden="true" style={{ width: 70, height: 1.5, margin: '26px auto 22px', background: SPEC_LINE }} />
              <div style={{ fontFamily: head, fontWeight: 300, fontSize: 21, letterSpacing: '.02em' }}>{inv.fullDate}</div>
              <div style={{ marginTop: 6, fontSize: 15, color: STEEL }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            </Bevel>
          </section>

          {/* SAYĞAC — kristal kublar */}
          {S.countdown && (
            <Hall head={head} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(8px, 2.6vw, 14px)', maxWidth: 380, margin: '0 auto' }}>
                {[
                  { v: cd.days, l: cd.labels.days },
                  { v: cd.hours, l: cd.labels.hours },
                  { v: cd.minutes, l: cd.labels.minutes },
                  { v: cd.seconds, l: cd.labels.seconds, pop: true },
                ].map(({ v, l, pop }) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <Bevel cut={10} depth={8} inner={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: head, fontWeight: 300, fontSize: 'clamp(24px, 7vw, 30px)', color: INK, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                    </Bevel>
                    <div style={{ marginTop: 8, fontSize: 13, color: STEEL }}>{l}</div>
                  </div>
                ))}
              </div>
            </Hall>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN — fasetli güzgü */}
          {S.venue && (
            <Hall head={head} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <Bevel cut={18} depth={10} inner={{ overflow: 'hidden' }}>
                <MapSection
                  weddingData={weddingData} theme={theme} accent={INK} height="clamp(220px, 62vw, 290px)"
                  map={{ opacity: 0.9, filter: 'grayscale(1) brightness(1.08) contrast(.9)', tintOpacity: 0.12, tint: '#9FB6CA', blend: 'multiply' }}
                  frame={<CrystalPin />}
                  fallback={<div style={{ height: 'clamp(220px, 62vw, 290px)', position: 'relative', background: 'linear-gradient(150deg, #F6F9FB, #E3EAF0)' }}><span style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${alpha(SILVER, 0.35)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(SILVER, 0.35)} 1px, transparent 1px)`, backgroundSize: '32px 32px' }} /><CrystalPin /></div>}
                />
              </Bevel>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 300, fontSize: 25, lineHeight: 1.25 }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 15, color: STEEL }}>{weddingData.venueNote}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={btn(true)}>{tr.inv_directions_btn}</a>}
                {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={btn(!inv.dirUrl)}>Maps</a>}
                {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Waze</a>}
                {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Apple</a>}
              </div>
            </Hall>
          )}

          {/* PROQRAM — prizma spektri */}
          {S.program && (
            <Hall head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 400, margin: '0 auto' }}>
                <svg viewBox="0 0 120 64" width="120" height="64" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
                  <path d="M-30 30L40 30" stroke="#fff" strokeWidth="3" />
                  <path d="M-30 30L40 30" stroke={SILVER} strokeWidth=".8" />
                  <path d="M30 50L48 14L66 50Z" fill="url(#cg-glass)" stroke="#8C9BA8" strokeWidth=".8" strokeLinejoin="round" />
                  <path d="M48 14L52 50" stroke="#fff" strokeWidth="1.2" opacity=".8" />
                  {timeline.events.map((_, k) => {
                    const x = lineX(k)
                    return <path key={k} d={`M57 34C${x + 20} 40 ${x} 46 ${x} 64`} fill="none" stroke={SPEC[Math.round(k * (SPEC.length - 1) / Math.max(1, n - 1))]} strokeWidth="1.6" />
                  })}
                </svg>
                <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {timeline.events.map((ev, i) => {
                    const c = SPEC[Math.round(i * (SPEC.length - 1) / Math.max(1, n - 1))]
                    return (
                      <li key={i} style={{ position: 'relative', paddingLeft: 86, paddingBottom: 20, minHeight: 56 }}>
                        {timeline.events.map((__, k) => {
                          if (k < i) return null
                          const ck = SPEC[Math.round(k * (SPEC.length - 1) / Math.max(1, n - 1))]
                          if (k > i) return <span key={k} aria-hidden="true" style={{ position: 'absolute', left: lineX(k) - 0.8, top: 0, bottom: 0, width: 1.6, background: ck }} />
                          return <span key={k} aria-hidden="true" style={{ position: 'absolute', left: lineX(k) - 0.8, width: 62 - lineX(k), top: 0, height: 22, borderLeft: `1.6px solid ${ck}`, borderBottom: `1.6px solid ${ck}`, borderBottomLeftRadius: 10 }} />
                        })}
                        <span aria-hidden="true" style={{ position: 'absolute', left: 60, top: 15, width: 14, height: 14, borderRadius: '50%', background: '#fff', boxShadow: `0 0 0 1.6px ${c}, 0 0 12px ${alpha(c, 0.7)}` }} />
                        <div style={{ fontFamily: head, fontSize: 14, letterSpacing: '.1em', color: STEEL, fontVariantNumeric: 'tabular-nums', lineHeight: '22px', paddingTop: 10 }}>{ev.time}</div>
                        <div style={{ marginTop: 2, fontSize: 17, lineHeight: 1.35 }}>{ev.label}</div>
                      </li>
                    )
                  })}
                </ol>
              </div>
            </Hall>
          )}

          {S.dresscode && (
            <Hall head={head} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" />
            </Hall>
          )}

          {/* MASA — akril yer kartı */}
          {S.seating && !seating.isEmpty && (
            <Hall head={head} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <input {...seatInputProps(inv, 'cg-seat-list')} style={field} />
              <SeatSuggest inv={inv} id="cg-seat-list" c={{ bg: '#fff', border: `1px solid ${alpha(SILVER, 0.9)}`, active: alpha(SILVER, 0.2), text: INK, table: STEEL, radius: 14, font: body, shadow: '0 18px 30px -18px rgba(35,48,59,.3)' }} />
              {seating.showNotFound && <div style={{ marginTop: 12, fontSize: 14.5, color: STEEL, textAlign: 'center' }}>{tr.inv_seat_fullname}</div>}
              {seating.selected && (
                <div style={{ maxWidth: 280, margin: '28px auto 0', animation: 'cg-rise .6s ease-out both' }}>
                  <Acrylic pad="26px 20px 18px" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 15, color: STEEL }}>{seating.selected.full_name}</div>
                    <div style={{ marginTop: 6, fontFamily: head, fontWeight: 200, fontSize: 68, lineHeight: 1 }}>{seating.selected.table_id}</div>
                    <div aria-hidden="true" style={{ width: 48, height: 1.5, margin: '10px auto 0', background: SPEC_LINE }} />
                    {seating.tablemates.length > 0 && <div style={{ marginTop: 12, fontSize: 14.5, color: STEEL, lineHeight: 1.55 }}>{seating.tablemates.map((g) => g.full_name).join(', ')}</div>}
                    <button onClick={seating.reset} data-press style={{ marginTop: 6, background: 'none', border: 'none', color: INK, fontSize: 14.5, minHeight: 44, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: body }}>
                      {seatingL.again || 'Yenidən axtar'}
                    </button>
                  </Acrylic>
                  <div aria-hidden="true" style={{ width: '70%', height: 10, margin: '0 auto', borderRadius: '0 0 50% 50%', background: 'radial-gradient(ellipse at top, rgba(35,48,59,.16), transparent 70%)' }} />
                </div>
              )}
            </Hall>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Hall id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 30 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <Bevel key={i} cut={8} depth={5} shadow={false} inner={{ aspectRatio: '1', overflow: 'hidden' }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </Bevel>
                  ))}
                </div>
              )}
              <div style={{ textAlign: 'center' }}>
                <Acrylic pad="14px" style={{ display: 'inline-block' }}>
                  <QRCodeSVG value={gallery.photoShareUrl} size={128} bgColor="#FFFFFF" fgColor={INK} level="M" />
                </Acrylic>
                <div style={{ marginTop: 14, fontSize: 14, color: STEEL }}>{tr.inv_scan_upload}</div>
                <a data-press href={gallery.photoShareUrl} style={{ ...btn(true), marginTop: 16 }}>{tr.inv_gallery_btn}</a>
                <p style={{ margin: '16px auto 0', maxWidth: 340, fontSize: 15, color: STEEL, lineHeight: 1.65 }}>{tr.inv_gallery_desc}</p>
              </div>
            </Hall>
          )}

          {/* RSVP — akril kart */}
          {S.rsvp && (
            <Hall head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <Acrylic pad="26px clamp(18px, 5vw, 24px) 24px">
                <RsvpStatus inv={inv} render={({ title, sub }) => (
                  <div style={{ textAlign: 'center', padding: '6px 0' }}>
                    <Brilliant size={22} color={STEEL} style={{ margin: '0 auto 12px' }} />
                    <div style={{ fontFamily: head, fontWeight: 300, fontSize: 24, lineHeight: 1.3 }}>{title}</div>
                    {sub && <div style={{ marginTop: 6, fontSize: 15, color: STEEL }}>{sub}</div>}
                  </div>
                )} />
                {rsvpState(rsvp) === 'form' && (
                  <form onSubmit={rsvp.handleSubmit}>
                    <input {...rsvpInputProps(inv)} style={field} />
                    <RsvpSuggest inv={inv} c={{ bg: '#fff', border: `1px solid ${alpha(SILVER, 0.9)}`, active: alpha(SILVER, 0.2), text: INK, table: STEEL, radius: 14, font: body }} />
                    {rsvp.showNotFound && <div style={{ marginTop: 8, fontSize: 13.5, color: STEEL }}>{rsvpL.not_in_list}</div>}
                    <div role="radiogroup" aria-label={L('rsvp', 'title', rsvpL.title)} style={{ display: 'grid', gap: 8, marginTop: 16 }}>
                      {rsvpOptions(inv).map(({ val, label }) => {
                        const active = rsvp.status === val
                        return (
                          <button key={val} type="button" role="radio" aria-checked={active} onClick={() => rsvp.chooseStatus(val)} data-press style={{
                            display: 'flex', alignItems: 'center', gap: 12, minHeight: 52, padding: '0 16px', borderRadius: 14, cursor: 'pointer',
                            fontFamily: body, fontSize: 16, textAlign: 'left', color: INK,
                            background: active ? '#fff' : 'rgba(255,255,255,.5)', border: `1px solid ${active ? INK : alpha(SILVER, 0.8)}`,
                            boxShadow: active ? '0 8px 18px -10px rgba(35,48,59,.35)' : 'none',
                          }}>
                            <svg width="18" height="18" viewBox="-10 -10 20 20" aria-hidden="true" style={{ flex: 'none' }}>
                              <path d="M-4 -9.5L4 -9.5L9.5 -4L9.5 4L4 9.5L-4 9.5L-9.5 4L-9.5 -4Z" fill={active ? 'url(#cg-spec)' : 'none'} stroke={active ? INK : SILVER} strokeWidth="1.1" />
                            </svg>
                            {label}
                          </button>
                        )
                      })}
                    </div>
                    {rsvp.status === 'yes' && (
                      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 15, color: STEEL }}>{rsvpL.plusq}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button type="button" onClick={rsvp.decPlusOne} disabled={rsvp.plusOne === 0} data-press aria-label="Azalt" style={{ width: 44, height: 44, borderRadius: '50%', border: `1px solid ${alpha(SILVER, 0.9)}`, background: '#fff', color: INK, fontSize: 19, cursor: 'pointer', opacity: rsvp.plusOne === 0 ? 0.35 : 1 }}>−</button>
                          <span style={{ width: 30, textAlign: 'center', fontFamily: head, fontWeight: 300, fontSize: 26 }}>{rsvp.plusOne}</span>
                          <button type="button" onClick={rsvp.incPlusOne} disabled={rsvp.plusOne === rsvp.maxExtraGuests} data-press aria-label="Artır" style={{ width: 44, height: 44, borderRadius: '50%', border: `1px solid ${alpha(SILVER, 0.9)}`, background: '#fff', color: INK, fontSize: 19, cursor: 'pointer', opacity: rsvp.plusOne === rsvp.maxExtraGuests ? 0.35 : 1 }}>+</button>
                        </div>
                      </div>
                    )}
                    <button type="submit" disabled={!rsvp.canSubmit} data-press style={{
                      ...btn(rsvp.canSubmit), width: '100%', marginTop: 20, minHeight: 54, fontSize: 16,
                      opacity: rsvp.canSubmit ? 1 : 0.5, cursor: rsvp.canSubmit ? 'pointer' : 'not-allowed',
                    }}>
                      {rsvp.sending ? '…' : rsvpL.send}
                    </button>
                  </form>
                )}
              </Acrylic>
            </Hall>
          )}

          {/* ARZULAR */}
          {S.guestbook && (
            <Hall head={head} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 32 }}>
                <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={field} />
                <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...field, resize: 'none', lineHeight: 1.5 }} />
                <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...btn(gbook.canSubmit), width: '100%', opacity: gbook.canSubmit ? 1 : 0.5, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}>
                  {gbook.sending ? gbookL.sending : gbookL.btn}
                </button>
                {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 13.5 }}>⚠ {gbookL.error}</p>}
              </form>
              <div>
                {gbook.messages.map((raw, i) => {
                  const m = gbook.readMessage(raw)
                  return (
                    <figure key={m.name + i} style={{ margin: 0, padding: '20px 0' }}>
                      {i > 0 && <div aria-hidden="true" style={{ height: 1, marginTop: -20, marginBottom: 20, background: SPEC_LINE, opacity: 0.35 }} />}
                      <blockquote style={{ margin: 0, fontFamily: head, fontWeight: 300, fontSize: 19, lineHeight: 1.5 }}>{m.text}</blockquote>
                      <figcaption style={{ marginTop: 8, fontSize: 13.5, color: STEEL }}>{m.name}{m.date ? `, ${gbook.formatDate(m.date)}` : ''}</figcaption>
                    </figure>
                  )
                })}
              </div>
            </Hall>
          )}

          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={head} />
        </motion.div>
      )}
    </div>
  )
}

function CrystalPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -26, top: -26, width: 52, height: 52, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,.95), rgba(255,255,255,0) 70%)' }} />
      <span style={{ position: 'absolute', left: -15, top: -15, width: 30, height: 30, borderRadius: '50%', background: '#fff', boxShadow: '0 6px 14px rgba(35,48,59,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Brilliant size={18} color={INK} />
      </span>
    </span>
  )
}
