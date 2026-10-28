import { memo, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
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
import { lattice, starPoints, shamsaPath, golPath, BUTA, BUTA_IN, HASIYE_URI, RHOMB_URI, GIRIH_URI } from './ornaments'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'
import { tableParts, tableFontPx } from '../_shared/tableBadge'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   ORIENTAL LUXE — «Şəbəkə və xalça» (premium redizayn, 2026-10)

   Konsept: Azərbaycan məclisinin öz sənəti. Açılış — Şəki Xan sarayının
   şəbəkə pəncərəsi: ağac qəfəsdə yüzlərlə rəngli şüşə mərkəzdən halqa-halqa
   işıqlanır, ortada şəmsə medalyonunda adlar. Toxunanda iki tay pəncərə
   içəri açılır. Daxildə hər şey xalçanın dilindədir:
     hero      → xalça: romb haşiyə, ortada pilləli göl medalyonu, künclərdə buta
     bölmələr  → xalça haşiyəsi zolağı ilə ayrılır
     sayğac    → səkkizguşəli kaşı ulduzları
     məkan     → şəbəkə tağı formasında pəncərə
     proqram   → göl medalyonlarının sütunu (xalçanın mərkəz oxu kimi)
     masa      → səkkizguşəli ulduzda süfrə nömrəsi
     RSVP      → ipək kart, nar emblemi
   Rəng: nar qırmızısı, qızıl, ipək fil sümüyü. Şriftlər: Reem Kufi (kufi
   xəttindən gələn həndəsi başlıq) · Alegreya (kalliqrafik mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('oriental-luxe')
const ID = 'oriental-luxe'

const PAL = {
  NAR: '#4A0F1C',
  DEEP: '#2E0710',
  GOLD: '#D9B36C',
  IVORY: '#F3E4C4',
  SILK: '#F6EBD3',
  MUTED: '#CDA88E',
  WOOD: '#22100A',
}

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['NAR'], accent: ['GOLD'], background: ['DEEP'], text: ['IVORY'] }

/* Şəbəkə: 80 vahidlik hücrə → mərkəz ulduzu iki tayın tam ortasına düşür
   (taylar simmetrik bölünür). ⚠ Hücrə əvvəl 36 idi və SVG 200% enində çəkilirdi:
   naxışın mərkəzi ekranın sağ kənarına düşürdü, telefonda isə hər tay ~200 KB
   path datasını hər kadrda yenidən rasterləşdirirdi — açılış ilişirdi. */
const LAT = lattice({ w: 400, h: 880, s: 80 })
const STAR8 = starPoints(0, 0, 10)
const CHAMFER = 'polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)'
const ARCH = 'M0 1V.36C0 .2 .3 .15 .5 0 .7 .15 1 .2 1 .36V1Z'
const ARCH100 = 'M0 100V36C0 20 30 15 50 0 70 15 100 20 100 36V100Z'

const KEYFRAMES = (C) => `
@keyframes ol-lit  { from { opacity: .08 } to { opacity: 1 } }
@keyframes ol-rise { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
@keyframes ol-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes ol-sun  { 0%,100% { transform: translate(-6%, -2%) } 50% { transform: translate(6%, 3%) } }
@keyframes ol-seal { from { opacity: 0; transform: scale(.86) rotate(-8deg) } to { opacity: 1; transform: none } }
@keyframes ol-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes ol-swing-l { from { transform: rotateY(0) } to { transform: rotateY(-100deg) } }
@keyframes ol-swing-r { from { transform: rotateY(0) } to { transform: rotateY(100deg) } }
@keyframes ol-out    { to { opacity: 0 } }
@keyframes ol-shrink { to { opacity: 0; transform: scale(.92) } }
[data-ol] span[aria-hidden="true"], [data-ol] svg[aria-hidden="true"], [data-ol] div[aria-hidden="true"] { pointer-events: none; }
[data-ol] ::placeholder { color: rgba(205,168,142,.6); }
[data-ol] .ol-silk ::placeholder { color: rgba(74,15,28,.45); }
[data-ol] input:focus-visible, [data-ol] textarea:focus-visible { background: rgba(243,228,196,.13) !important; outline: none; }
[data-ol] .ol-silk input:focus-visible { background: rgba(74,15,28,.05) !important; }
[data-ol] button:focus-visible, [data-ol] a:focus-visible, [data-ol] [role="button"]:focus-visible { outline: 1px solid ${C.GOLD}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-ol] *, [data-ol] { animation: none !important; transition: none !important; } }
`

/* ─── Kiçik motivlər ─── */
function Star8(props) {
  const C = usePalette()
  const { size = 14, color = C.GOLD, fill = 'none', sw = 1.4, style } = props
  return (
    <svg viewBox="-11 -11 22 22" width={size} height={size} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <path d={STAR8} fill={fill} stroke={color} strokeWidth={sw} strokeLinejoin="round" />
    </svg>
  )
}

function Buta(props) {
  const C = usePalette()
  const { size = 24, color = C.GOLD, style } = props
  return (
    <svg viewBox="0 0 24 32" width={size} height={size * 1.33} aria-hidden="true" style={{ display: 'block', ...style }}>
      <path d={BUTA} fill="none" stroke={color} strokeWidth="1.1" />
      <path d={BUTA_IN} fill="none" stroke={color} strokeWidth=".8" strokeOpacity=".7" />
      <circle cx="12" cy="20" r="2" fill={color} />
    </svg>
  )
}

/* Nar — bolluq və xoşbəxtliyin rəmzi */
function Pomegranate(props) {
  const C = usePalette()
  const { size = 54, color = C.NAR, seed = C.GOLD } = props
  return (
    <svg viewBox="0 0 60 64" width={size} height={size * 1.07} aria-hidden="true" style={{ display: 'block' }}>
      <path d="M23 18C10 21 5 33 8 44C11 55 21 61 30 61C39 61 49 55 52 44C55 33 50 21 37 18" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M23 19L21 8.5L25.6 12.6L27.4 5.4L30 11L32.6 5.4L34.4 12.6L39 8.5L37 19" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 42C16 50 22 55 29 56" fill="none" stroke={color} strokeWidth="1" strokeOpacity=".5" strokeLinecap="round" />
      {[[30, 34], [24, 39], [36, 39], [30, 44], [24, 48.5], [36, 48.5], [42, 33], [18, 33]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="2.3" ry="2.9" fill={seed} transform={`rotate(${(i * 37) % 60 - 30} ${x} ${y})`} />
      ))}
    </svg>
  )
}

function Hasiye({ style }) {
  return <div aria-hidden="true" style={{ height: 22, backgroundImage: HASIYE_URI, backgroundRepeat: 'repeat-x', backgroundPosition: 'center', opacity: 0.85, ...style }} />
}

/* ─── Şəbəkə pəncərəsi ───
   `memo`: açılış toxunuşda yenidən render olunur, bu ağır SVG isə dəyişmir. */
const Shebeke = memo(function Shebeke() {
  const C = usePalette()
  return (
    <svg viewBox={`0 0 ${LAT.w} ${LAT.h}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <radialGradient id="ol-glow" cx="50%" cy="44%" r="62%">
          <stop offset="0" stopColor="#FFF0C8" stopOpacity=".42" />
          <stop offset=".38" stopColor="#FFD58A" stopOpacity=".05" />
          <stop offset=".8" stopColor="#120404" stopOpacity=".45" />
          <stop offset="1" stopColor="#120404" stopOpacity=".7" />
        </radialGradient>
      </defs>
      <rect width={LAT.w} height={LAT.h} fill={C.WOOD} />
      {LAT.rings.map((rg, n) => (
        <g key={`g${n}`} style={{ animation: `ol-lit 1.1s ease-out ${(0.15 + n * 0.14).toFixed(2)}s both` }}>
          {Object.entries(rg.gaps).map(([c, d]) => <path key={c} d={d} fill={c} />)}
        </g>
      ))}
      {LAT.rings.map((rg, n) => (
        <g key={`s${n}`} style={{ animation: `ol-lit 1.1s ease-out ${(0.15 + n * 0.14).toFixed(2)}s both` }}>
          {Object.entries(rg.stars).map(([c, d]) => <path key={c} d={d} fill={c} />)}
        </g>
      ))}
      <rect width={LAT.w} height={LAT.h} fill="url(#ol-glow)" />
      <path d={LAT.outline} fill="none" stroke={C.WOOD} strokeWidth="9.2" strokeLinejoin="round" />
      <path d={LAT.outline} fill="none" stroke="#C9A35E" strokeWidth="1.4" strokeOpacity=".5" strokeLinejoin="round" />
    </svg>
  )
})

/* ═══ 01 — AÇILIŞ ═══
   ⚠ TELEFON (2026-10-28): toxunuşdan sonrakı hərəkətlərin HAMISI CSS
   animasiyasıdır (transform/opacity) — brauzer onları kompozitor axınında
   oynadır, ona görə dəvətnamə eyni anda pərdənin altında render olunanda da
   taylar ilişmədən açılır. Taylar `will-change` ilə əvvəlcədən ayrı qatdadır:
   toxunuş anında şəbəkə yenidən rasterləşdirilmir. Dəvətnamə toxunuşdan
   `REVEAL_MS` sonra pərdənin altında hazırlanır (`useGate › revealAt`) və
   pərdə YALNIZ iki şərtlə çəkilir: taylar açılıb qurtarıb VƏ dəvətnamə artıq
   render olunub. Zəif telefonda render uzun çəksə belə boş fon görünmür.
   `SAFETY_MS` — dəvətnamə hazır olandan sonra animasiya hadisəsi gəlməsə
   (məs. «azaldılmış hərəkət» rejimində animasiyalar söndürülüb) açılış bu
   vaxtdan sonra özü bitir. ⚠ Taymer toxunuşdan yox, MƏZMUN HAZIR OLANDAN
   sayılır: render uzun çəkəndə gecikmiş taymer pərdəni yarıda kəsməsin. */
const REVEAL_MS = 150
const SAFETY_MS = 3000

function ShebekeOpening({ inv, theme }) {
  const C = usePalette()
  const { ot } = inv
  const reduce = useReducedMotion()
  const gate = useGate({ inv, ms: null, revealAt: REVEAL_MS })
  const [swung, setSwung] = useState(false)
  const ready = gate.opening && inv.opened
  const { finish } = gate
  useEffect(() => {
    if (!ready) return undefined
    const t = setTimeout(finish, reduce ? 0 : SAFETY_MS)
    return () => clearTimeout(t)
  }, [ready, reduce, finish])
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const head = theme.fonts.heading
  const longest = Math.max(String(first || '').length, String(second || '').length, 1)
  const nameSize = Math.round(Math.max(22, Math.min(38, 250 / (longest * 0.6))))
  const on = gate.opening
  const fading = ready && swung
  const swing = (side) => `${side ? 'ol-swing-r' : 'ol-swing-l'} 1.05s cubic-bezier(.55,0,.3,1) .3s both`
  const onAnimationEnd = (e) => {
    if (e.animationName === 'ol-swing-r') setSwung(true)
    else if (e.animationName === 'ol-out' && e.target === e.currentTarget) gate.finish()
  }
  return (
    <div {...gate.gateProps} data-ol onAnimationEnd={onAnimationEnd}
      style={{
        position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden',
        background: `radial-gradient(90% 60% at 50% 42%, #7A2234, ${C.NAR} 55%, ${C.DEEP})`,
        perspective: 1400, color: C.IVORY, fontFamily: theme.fonts.body,
        animation: fading ? 'ol-out .4s ease both' : undefined,
      }}>
      {/* iki tay pəncərə */}
      {[0, 1].map((side) => (
        <div key={side}
          style={{
            position: 'absolute', top: 0, bottom: 0, width: '50%', left: side ? '50%' : 0, overflow: 'hidden',
            transformOrigin: side ? 'right center' : 'left center',
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', willChange: 'transform',
            animation: on ? swing(side) : undefined,
            boxShadow: `inset 0 0 0 7px ${C.WOOD}, inset 0 0 0 8px rgba(201,163,94,.55), inset 0 0 0 11px ${C.WOOD}`,
          }}>
          <div style={{ position: 'absolute', inset: 0, left: side ? '-100%' : 0, width: '200%' }}>
            <Shebeke />
          </div>
          <span aria-hidden="true" style={{ position: 'absolute', inset: 0, boxShadow: `inset 0 0 0 7px ${C.WOOD}, inset 0 0 0 8px rgba(201,163,94,.55)`, pointerEvents: 'none' }} />
        </div>
      ))}

      {/* günəş parıltısı — şüşədən keçən işıq */}
      <span aria-hidden="true"
        style={{ position: 'absolute', inset: '-10%', pointerEvents: 'none', mixBlendMode: 'soft-light', background: 'radial-gradient(40% 30% at 50% 42%, rgba(255,240,200,.75), transparent 70%)', animation: on ? 'ol-out .3s ease both' : 'ol-sun 14s ease-in-out infinite' }} />
      {/* aşağı kölgə — yazılar oxunsun */}
      <span aria-hidden="true"
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '44%', pointerEvents: 'none', background: `linear-gradient(transparent, ${alpha(C.DEEP, 0.86)} 45%, ${alpha(C.DEEP, 0.96)})`, animation: on ? 'ol-out .3s ease both' : 'ol-fade 1.2s ease-out 1.6s both' }} />

      <div
        style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px', textAlign: 'center', animation: on ? 'ol-shrink .35s ease both' : undefined }}>
        {/* Şəmsə medalyonu */}
        <div style={{ position: 'relative', width: 'min(80vw, 318px)', aspectRatio: '1', animation: 'ol-seal 1.3s cubic-bezier(.2,.8,.2,1) 1.25s both' }}>
          <svg viewBox="-110 -110 220 220" width="100%" height="100%" aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'visible', filter: 'drop-shadow(0 18px 30px rgba(20,3,6,.6))' }}>
            <defs>
              <radialGradient id="ol-sh" r=".75">
                <stop offset="0" stopColor="#6A1A2B" />
                <stop offset="1" stopColor="#3A0A14" />
              </radialGradient>
            </defs>
            <path d={shamsaPath(104, 28, 0.7)} fill="url(#ol-sh)" stroke={C.GOLD} strokeWidth="1.6" />
            <circle r="92" fill="none" stroke={C.GOLD} strokeWidth=".7" strokeOpacity=".8" />
            <circle r="87" fill="none" stroke={C.GOLD} strokeWidth="1.6" strokeOpacity=".55" strokeDasharray="0.1 5.2" strokeLinecap="round" />
            <circle r="81" fill="none" stroke={C.GOLD} strokeWidth=".5" strokeOpacity=".6" />
          </svg>
          <div style={{ position: 'absolute', inset: '14%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'ol-fade 1s ease-out 1.9s both' }}>
              <Star8 size={56} sw={0.8} style={{ position: 'absolute', inset: 0 }} />
              <span style={{ position: 'relative', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '50%', fontFamily: head, fontSize: 12, color: C.GOLD, whiteSpace: 'nowrap' }}>
                <MonoContent mono={ot.mono} ornament={<Star8 size={10} fill={C.GOLD} sw={0} />} imgStyle={{ borderRadius: '50%' }} />
              </span>
            </div>
            {ot.show('kicker') && <div style={{ marginTop: 10, fontStyle: 'italic', fontSize: 15, color: C.MUTED, animation: 'ol-rise .9s ease-out 2.1s both' }}>{ot.text('kicker')}</div>}
            {titleOv !== '' && (
              <div data-fit style={{ marginTop: 8, fontFamily: head, fontWeight: 500, fontSize: nameSize, lineHeight: 1.12, color: C.IVORY, animation: 'ol-rise 1s ease-out 2.3s both' }}>
                {first}
                {second && <><span style={{ display: 'block', fontFamily: theme.fonts.body, fontStyle: 'italic', fontWeight: 400, fontSize: '.55em', color: C.GOLD, margin: '2px 0' }}>{ot.text('and')}</span>{second}</>}
              </div>
            )}
          </div>
        </div>
        {ot.show('meta') && <div style={{ marginTop: 22, fontSize: 15.5, color: C.IVORY, textShadow: `0 1px 8px ${C.DEEP}`, animation: 'ol-rise .9s ease-out 2.7s both' }}>{ot.text('meta')}</div>}
        {ot.show('cta') && (
          <div style={{ marginTop: 18, minHeight: 48, padding: '13px 30px', display: 'inline-flex', alignItems: 'center', background: C.DEEP, color: C.GOLD, fontFamily: head, fontSize: 15, letterSpacing: '.05em', clipPath: CHAMFER, boxShadow: `inset 0 0 0 1px ${C.GOLD}`, animation: 'ol-rise .9s ease-out 3s both' }}>
            {ot.text('cta')}
          </div>
        )}
        {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 13, fontStyle: 'italic', color: C.MUTED, animation: 'ol-fade .8s ease-out 3.4s both, ol-hint 3s ease-in-out 4.2s infinite' }}>{ot.text('hint')}</div>}
      </div>
    </div>
  )
}

/* Bölmə — xalça haşiyəsi zolağı + səkkizguşəli ulduz + başlıq */
function Majlis({ id, section, title, kicker, sub, children, head }) {
  const C = usePalette()
  return (
    <section id={id} data-section={section} style={{ position: 'relative', paddingBottom: 60 }}>
      <Hasiye />
      <Reveal style={{ maxWidth: 500, margin: '0 auto', padding: '44px 20px 0' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <Star8 size={18} style={{ margin: '0 auto 14px' }} />
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 500, fontSize: scaleFont('clamp(26px, 7.6vw, 32px)', C.hs), lineHeight: 1.2, color: C.GOLD, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontStyle: 'italic', fontSize: 15, color: C.MUTED }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 320, fontSize: 16, color: C.MUTED, lineHeight: 1.5 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: 'rgba(243,228,196,.07)', border: 'none', clipPath: CHAMFER,
  boxShadow: `inset 0 -1px 0 ${alpha(C.GOLD, 0.6)}`, padding: '15px 18px', fontSize: 16.5, color: C.IVORY, outline: 'none',
})
const btn = (C, on, dark = false) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px',
  fontSize: 15, letterSpacing: '.04em', textDecoration: 'none', cursor: 'pointer', border: 'none', clipPath: CHAMFER,
  background: on ? (dark ? C.NAR : C.GOLD) : 'transparent', color: on ? (dark ? C.IVORY : C.DEEP) : C.GOLD,
  boxShadow: on ? 'none' : `inset 0 0 0 1px ${alpha(C.GOLD, 0.7)}`,
})

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function OrientalLuxeTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const tb = tableParts(seating.selected?.table_id)
  const T = inv.copy(TXT)
  const head = theme.fonts.heading
  const body = theme.fonts.body

  const longest = Math.max(String(inv.groom || inv.single || '').length, String(inv.bride || '').length, 1)
  const heroSize = Math.round(Math.max(28, Math.min(48, 230 / (longest * 0.58))))
  /* Açılış `inv.opened`-ə görə yox, öz `gone` vəziyyətinə görə yox olur —
     dəvətnamə pərdənin altında artıq render olunur (bax ShebekeOpening) */
  const [veil] = useState(() => !inv.opened)

  return (
    <PaletteContext.Provider value={C}>
      <div data-ol data-enter={enterDirection(ID)} style={{
        backgroundColor: C.DEEP,
        backgroundImage: `${GIRIH_URI}, radial-gradient(140% 70% at 50% 0%, #5C1424, ${C.NAR} 45%, ${C.DEEP})`,
        backgroundSize: '56px 56px, 100% 100%',
        minHeight: '100vh', fontFamily: body, color: C.IVORY, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
        fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.GOLD, 0.3),
      }}>
        <style>{KEYFRAMES(C)}</style>
        <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
          <clipPath id="ol-arch" clipPathUnits="objectBoundingBox"><path d={ARCH} /></clipPath>
        </svg>
        {veil && <ShebekeOpening inv={inv} theme={theme} />}

        <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: 0, clipPath: CHAMFER, background: C.DEEP, border: 'none', boxShadow: `inset 0 0 0 1px ${alpha(C.GOLD, 0.6)}` }}>
          {({ playing }) => <EqBars playing={playing} color={C.GOLD} idle={alpha(C.GOLD, 0.4)} />}
        </MusicFab>

        {inv.opened && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
            <header style={{
              position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: alpha(C.DEEP, 0.9), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
              borderBottom: `1px solid ${alpha(C.GOLD, 0.25)}`,
            }}>
              <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 15, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
                <span aria-hidden="true">←</span>{tr.btn_back}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: head, fontSize: 15, color: C.GOLD, letterSpacing: '.06em' }}><Star8 size={11} />{T.brand}</div>
              <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
            </header>

            {/* HERO — xalça */}
            <section data-section="hero" style={{ padding: '26px 14px 54px' }}>
              <div style={{ padding: 12, backgroundColor: C.DEEP, backgroundImage: RHOMB_URI, backgroundSize: '14px 14px', backgroundPosition: 'center', border: `1px solid ${C.GOLD}`, boxShadow: '0 40px 60px -34px rgba(0,0,0,.7)' }}>
                <div style={{
                  position: 'relative', overflow: 'hidden', textAlign: 'center', padding: '36px 18px 34px',
                  background: `radial-gradient(90% 60% at 50% 50%, #651a2c, ${C.NAR} 70%)`,
                  border: `1px solid ${C.GOLD}`, boxShadow: `inset 0 0 0 6px ${C.NAR}, inset 0 0 0 7px ${alpha(C.GOLD, 0.45)}`,
                }}>
                  {[0, 1, 2, 3].map((c) => (
                    <Buta key={c} size={20} color={alpha(C.GOLD, 0.75)} style={{
                      position: 'absolute', [c < 2 ? 'top' : 'bottom']: 16, [c % 2 ? 'right' : 'left']: 16,
                      transform: `rotate(${[-35, 35, -145, 145][c]}deg)`,
                    }} />
                  ))}
                  <div style={{ fontStyle: 'italic', fontSize: 16, color: C.MUTED }}>{L('hero', 'kicker', inv.eventLabel)}</div>
                  <p style={{ margin: '8px auto 0', maxWidth: 280, fontSize: 16.5, lineHeight: 1.5, color: C.IVORY }}>{tr.inv_join}</p>

                  <div style={{ position: 'relative', margin: '22px auto 0', width: '100%', maxWidth: 300, aspectRatio: '300 / 380' }}>
                    <svg viewBox="0 0 300 380" width="100%" height="100%" aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                      <path d={golPath(300, 380, 7)} fill={alpha(C.DEEP, 0.55)} stroke={C.GOLD} strokeWidth="1.3" />
                      <path d={golPath(300, 380, 7)} fill="none" stroke={C.GOLD} strokeOpacity=".45" strokeWidth=".8" transform="translate(30 38) scale(.8)" />
                      {[[150, -8], [150, 388], [-8, 190], [308, 190]].map(([x, y], i) => (
                        <path key={i} d={`M${x} ${y - 7}L${x + 7} ${y}L${x} ${y + 7}L${x - 7} ${y}Z`} fill={C.GOLD} />
                      ))}
                      <g transform="translate(150 60)"><path d={STAR8} transform="scale(.9)" fill="none" stroke={C.GOLD} strokeWidth="1.2" /></g>
                      <g transform="translate(150 320)"><path d={STAR8} transform="scale(.9)" fill="none" stroke={C.GOLD} strokeWidth="1.2" /></g>
                    </svg>
                    <h1 data-fit style={{ position: 'absolute', inset: '0 12%', margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: head, fontWeight: 500, fontSize: inv.heroTitle ? 'clamp(24px, 7vw, 32px)' : heroSize, lineHeight: 1.1, color: C.IVORY, textWrap: 'balance' }}>
                      {inv.heroTitle ? inv.heroTitle : inv.isCouple ? (
                        <>{inv.groom}<span style={{ fontFamily: body, fontStyle: 'italic', fontWeight: 400, fontSize: '.55em', color: C.GOLD, margin: '4px 0' }}>{inv.and}</span>{inv.bride}</>
                      ) : inv.single}
                    </h1>
                  </div>

                  {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 16, fontSize: 15, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
                  <div style={{ marginTop: 24, fontFamily: head, fontSize: 19, color: C.GOLD, letterSpacing: '.02em' }}>{inv.fullDate}</div>
                  <div style={{ marginTop: 6, fontSize: 16, color: C.IVORY }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
                </div>
              </div>
            </section>

            {/* SAYĞAC — kaşı ulduzları */}
            {S.countdown && (
              <Majlis section="countdown" head={head} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(6px, 2.4vw, 12px)' }}>
                  {[
                    { v: cd.days, l: cd.labels.days },
                    { v: cd.hours, l: cd.labels.hours },
                    { v: cd.minutes, l: cd.labels.minutes },
                    { v: cd.seconds, l: cd.labels.seconds, pop: true },
                  ].map(({ v, l, pop }) => (
                    <div key={l} style={{ textAlign: 'center' }}>
                      <div style={{ position: 'relative', width: 'clamp(70px, 20vw, 84px)', aspectRatio: '1' }}>
                        <svg viewBox="-52 -52 104 104" width="100%" height="100%" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
                          <defs>
                            <radialGradient id={`ol-k${l}`} r=".8"><stop offset="0" stopColor="#FBF1DC" /><stop offset="1" stopColor="#E6CFA1" /></radialGradient>
                          </defs>
                          <path d={starPoints(0, 0, 50)} fill={pop ? C.GOLD : `url(#ol-k${l})`} stroke={C.GOLD} strokeWidth="1.5" strokeLinejoin="round" />
                          <path d={starPoints(0, 0, 41)} fill="none" stroke={C.NAR} strokeOpacity=".35" strokeWidth=".8" strokeLinejoin="round" />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: head, fontSize: 'clamp(22px, 6.4vw, 27px)', color: C.NAR, fontVariantNumeric: 'tabular-nums' }}>
                          <PopDigit value={v} pop={pop} />
                        </div>
                      </div>
                      <div style={{ marginTop: 8, fontSize: 14, color: C.MUTED }}>{l}</div>
                    </div>
                  ))}
                </div>
              </Majlis>
            )}

            <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} before={<Hasiye />} />

            {/* MƏKAN — şəbəkə tağı */}
            {S.venue && (
              <Majlis section="venue" head={head} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
                <div style={{ position: 'relative', maxWidth: 320, margin: '0 auto', height: 'clamp(300px, 86vw, 360px)' }}>
                  <div style={{ position: 'absolute', inset: 0, clipPath: 'url(#ol-arch)', background: C.DEEP }}>
                    <MapSection
                      weddingData={weddingData} theme={theme} accent={C.GOLD} height="100%"
                      map={{ opacity: 0.6, filter: 'grayscale(1) sepia(.5) brightness(.6) contrast(1.15)', tintOpacity: 0.45, tint: C.NAR, blend: 'multiply' }}
                      frame={<ArchPin />}
                      fallback={<div style={{ height: '100%', position: 'relative', backgroundColor: C.DEEP, backgroundImage: RHOMB_URI, backgroundSize: '14px 14px' }}><span style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 58%, transparent 20%, ${C.DEEP} 75%)` }} /><ArchPin /></div>}
                    />
                  </div>
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
                    <path d={ARCH100} fill="none" stroke={C.GOLD} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                    <path d={ARCH100} fill="none" stroke={C.GOLD} strokeWidth=".7" strokeOpacity=".5" vectorEffect="non-scaling-stroke" transform="translate(4 4) scale(.92)" />
                  </svg>
                </div>
                <div style={{ textAlign: 'center', marginTop: 22, fontFamily: head, fontSize: 23, lineHeight: 1.3, color: C.IVORY }}>{weddingData.venueName}</div>
                {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 16, fontStyle: 'italic', color: C.MUTED }}>{weddingData.venueNote}</div>}
                <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={btn(C, true)}>{tr.inv_directions_btn}</a>}
                  {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={btn(C, !inv.dirUrl)}>Maps</a>}
                  {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(C, false)}>Waze</a>}
                  {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(C, false)}>Apple</a>}
                </div>
              </Majlis>
            )}

            {/* PROQRAM — göl sütunu */}
            {S.program && (
              <Majlis section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
                <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  {timeline.events.map((ev, i) => (
                    <li key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {i > 0 && (
                        <svg width="12" height="34" viewBox="0 0 12 34" aria-hidden="true" style={{ display: 'block', margin: '6px 0' }}>
                          <path d="M6 0V11M6 23V34" stroke={C.GOLD} strokeOpacity=".5" strokeWidth="1" />
                          <path d="M6 13L10 17L6 21L2 17Z" fill={C.GOLD} />
                        </svg>
                      )}
                      <div style={{ position: 'relative', width: 112, height: 58, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg viewBox="-4 -4 120 66" width="120" height="66" aria-hidden="true" style={{ position: 'absolute', left: -4, top: -4 }}>
                          <path d={golPath(112, 58, 4)} fill={i % 2 ? alpha(C.GOLD, 0.14) : C.DEEP} stroke={C.GOLD} strokeWidth="1.2" />
                        </svg>
                        <span style={{ position: 'relative', fontFamily: head, fontSize: 16, color: C.GOLD, letterSpacing: '.04em', fontVariantNumeric: 'tabular-nums' }}>{ev.time}</span>
                      </div>
                      <div style={{ marginTop: 10, maxWidth: 300, fontSize: 19, lineHeight: 1.35, color: C.IVORY }}>{ev.label}</div>
                    </li>
                  ))}
                </ol>
              </Majlis>
            )}

            {S.dresscode && (
              <Majlis section="dresscode" head={head} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
                <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" onDark />
              </Majlis>
            )}

            {/* MASA — səkkizguşəli ulduz */}
            {S.seating && !seating.isEmpty && (
              <Majlis section="seating" head={head} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
                <input {...seatInputProps(inv, 'ol-seat-list')} style={field(C)} />
                <SeatSuggest inv={inv} id="ol-seat-list" c={{ bg: C.DEEP, border: `1px solid ${alpha(C.GOLD, 0.4)}`, active: alpha(C.GOLD, 0.12), text: C.IVORY, table: C.GOLD, radius: 0, font: body }} />
                {seating.showNotFound && <div style={{ marginTop: 12, fontStyle: 'italic', fontSize: 15, color: C.MUTED, textAlign: 'center' }}>{tr.inv_seat_fullname}</div>}
                {seating.selected && (
                  <div style={{ marginTop: 28, textAlign: 'center' }}>
                    <div style={{ fontSize: 17, color: C.IVORY }}>{seating.selected.full_name}</div>
                    <div style={{ position: 'relative', width: 168, height: 168, margin: '14px auto 0', animation: 'ol-seal .9s cubic-bezier(.2,.8,.2,1) both' }}>
                      <svg viewBox="-56 -56 112 112" width="168" height="168" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
                        <path d={starPoints(0, 0, 54)} fill={C.SILK} stroke={C.GOLD} strokeWidth="1.4" strokeLinejoin="round" />
                        <path d={starPoints(0, 0, 46)} fill="none" stroke={C.NAR} strokeOpacity=".4" strokeWidth=".8" strokeLinejoin="round" />
                        <circle r="30" fill="none" stroke={C.NAR} strokeOpacity=".25" strokeWidth=".6" />
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4, fontFamily: head, fontSize: tableFontPx(tb.num, 50), lineHeight: 1, color: C.NAR, textAlign: 'center', padding: '0 34px' }}>{tb.hasWord && <span style={{ display: 'block', fontSize: 12, letterSpacing: '.12em', color: alpha(C.NAR, 0.7) }}>{tr.inv_table}</span>}{tb.num}</div>
                    </div>
                    {seating.tablemates.length > 0 && <div style={{ marginTop: 16, fontSize: 16, fontStyle: 'italic', color: C.MUTED, lineHeight: 1.6 }}>{seating.tablemates.map((g) => g.full_name).join(', ')}</div>}
                    <button onClick={seating.reset} data-press style={{ marginTop: 6, background: 'none', border: 'none', color: C.GOLD, fontSize: 15, minHeight: 44, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: body }}>
                      {seatingL.again || 'Yenidən axtar'}
                    </button>
                  </div>
                )}
              </Majlis>
            )}

            {/* FOTOLAR — tağlı çərçivələr */}
            {S.gallery && (
              <Majlis section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
                {gallery.demoPhotos.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 28 }}>
                    {gallery.demoPhotos.map((url, i) => (
                      <div key={i} style={{ aspectRatio: '3 / 4', clipPath: 'url(#ol-arch)', background: alpha(C.GOLD, 0.18) }}>
                        <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'sepia(.15) saturate(.9)' }} />
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', padding: 14, background: C.SILK, boxShadow: `0 0 0 1px ${C.GOLD}, 0 0 0 6px ${C.DEEP}, 0 0 0 7px ${alpha(C.GOLD, 0.5)}` }}>
                    <QRCodeSVG value={gallery.photoShareUrl} size={128} bgColor={C.SILK} fgColor={C.NAR} level="M" />
                  </div>
                  <div style={{ marginTop: 16, fontSize: 15, color: C.MUTED }}>{tr.inv_scan_upload}</div>
                  <a data-press href={gallery.photoShareUrl} style={{ ...btn(C, true), marginTop: 16 }}>{tr.inv_gallery_btn}</a>
                  <p style={{ margin: '16px auto 0', maxWidth: 340, fontSize: 16, color: C.MUTED, lineHeight: 1.6 }}>{tr.inv_gallery_desc}</p>
                </div>
              </Majlis>
            )}

            {/* RSVP — ipək kart */}
            {S.rsvp && (
              <Majlis section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
                <ReplyForm inv={inv} t={{ ink: C.IVORY, muted: C.MUTED, line: alpha(C.GOLD, 0.5), hair: alpha(C.GOLD, 0.16), accent: C.GOLD, font: body, display: head, radius: 0, btnFont: head, doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Pomegranate size={42} color={C.GOLD} seed={C.IVORY} /></div>, marker: (a) => <svg width="14" height="14" viewBox="-8 -8 16 16"><path d="M0 -7L7 0L0 7L-7 0Z" fill={a ? C.GOLD : 'none'} stroke={C.GOLD} strokeOpacity={a ? 1 : 0.5} strokeWidth="1.1" /></svg>, suggest: { bg: C.DEEP, border: `1px solid ${alpha(C.GOLD, 0.4)}`, active: alpha(C.GOLD, 0.12), text: C.IVORY, table: C.GOLD, radius: 0, font: body } }} />
              </Majlis>
            )}

            {/* XEYİR-DUALAR */}
            {S.guestbook && (
              <Majlis section="guestbook" head={head} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
                <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 34 }}>
                  <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={field(C)} />
                  <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...field(C), resize: 'none', lineHeight: 1.5 }} />
                  <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...btn(C, gbook.canSubmit), width: '100%', fontFamily: head, opacity: gbook.canSubmit ? 1 : 0.5, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}>
                    {gbook.sending ? gbookL.sending : gbookL.btn}
                  </button>
                  {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 14 }}>⚠ {gbookL.error}</p>}
                </form>
                <div style={{ display: 'grid', gap: 0, textAlign: 'center' }}>
                  {gbook.messages.map((raw, i) => {
                    const m = gbook.readMessage(raw)
                    return (
                      <figure key={m.name + i} style={{ margin: 0 }}>
                        {i > 0 && (
                          <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', gap: 6, margin: '22px 0' }}>
                            {[0, 1, 2].map((k) => <span key={k} style={{ width: 6, height: 6, transform: 'rotate(45deg)', background: k === 1 ? C.GOLD : alpha(C.GOLD, 0.45) }} />)}
                          </div>
                        )}
                        <blockquote style={{ margin: 0, fontStyle: 'italic', fontSize: 19, lineHeight: 1.55, color: C.IVORY }}>{m.text}</blockquote>
                        <figcaption style={{ marginTop: 10, fontFamily: head, fontSize: 14.5, letterSpacing: '.04em', color: C.GOLD }}>{m.name}{m.date ? <span style={{ fontFamily: body, color: C.MUTED, letterSpacing: 0 }}>{`, ${gbook.formatDate(m.date)}`}</span> : null}</figcaption>
                      </figure>
                    )
                  })}
                </div>
              </Majlis>
            )}

            <Hasiye />
            <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={head} />
          </motion.div>
        )}
      </div>
    </PaletteContext.Provider>
  )
}

function ArchPin() {
  const C = usePalette()
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '58%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', width: 64, height: 64, left: -32, top: -32, borderRadius: '50%', background: `radial-gradient(circle, ${alpha(C.GOLD, 0.35)}, transparent 70%)` }} />
      <Star8 size={30} fill={C.NAR} color={C.GOLD} sw={1.6} style={{ position: 'absolute', left: -15, top: -15 }} />
    </span>
  )
}
