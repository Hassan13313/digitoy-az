import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../_shared/MapSection'
import { EmblemSlot } from '../_shared/MonoContent'
import { parseLatLon } from '../_shared/geo'
import { Reveal, PopDigit, enterDirection } from '../_shared/motion'
import { hidePhoto } from '../../utils/photoGallery'
import { getTemplateTheme } from '../templateConfig'
import { useInvitation, useGate, openingNames, seatInputProps, alpha } from '../_shared/useInvitation'
import { MusicFab, EqBars, SeatSuggest, StoryBlock, InvitationEnd, ReplyForm } from '../_shared/invitationKit'
import { frond, leafPath, contours, dms, woodRings, landscape, LINEN_URI, PAPER_URI } from './specimen'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'
import { LABELS, TXT } from './copy'

/* ─────────────────────────────────────────────────────────────────────────────
   NATURE TOUCH — «Herbari qovluğu → dağ çəmənliyi» (premium redizayn, 2026-10)

   Açılış: kəndirlə bağlanmış herbari qovluğu — qapaq açılır, altında
   preslənmiş qıjı. Daxil (v2, qonaq rəyindən sonra yenidən qurulub): şəhərdən
   kənar toyun özü — qızıl saatda Qafqaz dağları, duman, küknarlar, çəmən.
     hero      → qatlı dağ mənzərəsi, günəş, çöl çiçəkləri; adlar səmada
     sayğac    → ağac kəsikləri (illik halqalar)
     məkan     → tağlı pəncərə, altda dağ silueti, koordinat
     proqram   → meşə cığırı: hadisələr cığırın iki tərəfində
     masa      → ağac kəsiyində masa nömrəsi (kənd toylarının öz adəti)
     RSVP      → səhifənin öz axınında, yarpaq nişanlı sətirlər
     xeyir-dua → yarpaqlı budaqla ayrılan sakit qeydlər
   Rəng: kətan, meşə yaşılı, mamır, qızıl saat, terrakota, qoz qabığı.
   Şriftlər: Vollkorn (kitab serifi) · Geologica.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('nature-touch')
const ID = 'nature-touch'

const PAL = {
  PAPER: '#F6F2E7',
  LINEN: '#E8E2D3',
  INK: '#2F3A2C',
  MOSS: '#5C6B4C',
  SAGE: '#93A07E',
  TERRA: '#9A5530',
  COVER: '#34432F',
  TWINE: '#C9A46A',
  GOLDEN: '#D9A55B',
  BARK: '#5B3F2A',
}

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['INK'], secondary: ['MOSS'], accent: ['TERRA'], background: ['PAPER'], text: ['INK'] }

const FERN = frond({ len: 300, pairs: 15, bend: 0.14, maxPinna: 62 })

const KEYFRAMES = (C) => `
@keyframes nt-rise { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
@keyframes nt-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes nt-tie  { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
@keyframes nt-press { from { opacity: 0; transform: scale(1.04) } to { opacity: 1; transform: none } }
@keyframes nt-hint { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
[data-nt] span[aria-hidden="true"], [data-nt] svg[aria-hidden="true"], [data-nt] div[aria-hidden="true"] { pointer-events: none; }
[data-nt] ::placeholder { color: rgba(47,58,44,.42); }
[data-nt] input:focus-visible, [data-nt] textarea:focus-visible { border-color: ${C.INK} !important; outline: none; background: #FFFDF6 !important; }
[data-nt] button:focus-visible, [data-nt] a:focus-visible, [data-nt] [role="button"]:focus-visible { outline: 1.5px solid ${C.INK}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-nt] *, [data-nt] { animation: none !important; transition: none !important; } }
`

/* ─── Kiçik detallar ─── */
function Specimen({ data, color, stroke = '#4E5A3A', style }) {
  return (
    <g style={style}>
      <path d={data.rachis} fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
      {data.pinnae.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.a})`}>
          <path d={p.d} fill={color || p.c} fillOpacity=".9" stroke={stroke} strokeOpacity=".45" strokeWidth=".5" />
          <path d={`M0 0L${p.len * 0.92} 0`} stroke={stroke} strokeOpacity=".35" strokeWidth=".4" />
        </g>
      ))}
    </g>
  )
}

function LeafMark(props) {
  const C = usePalette()
  const { size = 26, color = C.MOSS } = props
  return (
    <svg viewBox="-2 -16 44 32" width={size} height={size * 0.73} aria-hidden="true" style={{ display: 'block' }}>
      <path d={leafPath(40, 9)} fill={color} fillOpacity=".85" />
      <path d="M0 0L38 0" stroke={C.PAPER} strokeOpacity=".6" strokeWidth=".8" />
      {[8, 16, 24, 31].map((x) => <path key={x} d={`M${x} 0l5 -4M${x} 0l5 4`} stroke={C.PAPER} strokeOpacity=".45" strokeWidth=".6" />)}
    </svg>
  )
}

/* Kəndir düyünü */
function TwineBow({ width = 320 }) {
  const C = usePalette()
  const loop = 'M0 0C-30 -26 -52 -6 -40 6C-30 16 -12 6 0 0'
  const tails = ['M0 0C-6 16 -16 32 -26 48', 'M0 0C6 18 12 32 24 46']
  return (
    <svg viewBox={`${-width / 2} -40 ${width} 100`} width="100%" height="100" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <path d={`M${-width / 2 - 40} 0H${width / 2 + 40}`} stroke={C.TWINE} strokeWidth="2.6" />
      <path d={`M${-width / 2 - 40} 0H${width / 2 + 40}`} stroke="#7E6036" strokeWidth="2.6" strokeDasharray="1.6 2.4" strokeOpacity=".45" />
      {[loop, `${loop}`].map((d, i) => (
        <g key={i} transform={i ? 'scale(-1 1)' : undefined}>
          <path d={d} fill="none" stroke={C.TWINE} strokeWidth="2.4" />
          <path d={d} fill="none" stroke="#7E6036" strokeWidth="2.4" strokeDasharray="1.6 2.4" strokeOpacity=".45" />
        </g>
      ))}
      {tails.map((d) => (
        <g key={d}>
          <path d={d} fill="none" stroke={C.TWINE} strokeWidth="2.4" strokeLinecap="round" />
          <path d={d} fill="none" stroke="#7E6036" strokeWidth="2.4" strokeDasharray="1.6 2.4" strokeOpacity=".45" />
        </g>
      ))}
      <ellipse rx="5" ry="4" fill={C.TWINE} stroke="#7E6036" strokeOpacity=".5" />
    </svg>
  )
}

/* ═══ 01 — AÇILIŞ: herbari qovluğu ═══ */
function FolioOpening({ inv, theme }) {
  const C = usePalette()
  const { ot } = inv
  const gate = useGate({ inv, ms: 1500 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const serif = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-nt
      animate={gate.opening ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', perspective: 1600,
        backgroundColor: C.PAPER, backgroundImage: PAPER_URI, color: C.INK, fontFamily: theme.fonts.body,
      }}>
      {/* altdakı vərəq — qapaq açılanda görünür */}
      <svg viewBox="-160 -330 320 360" preserveAspectRatio="xMidYMax meet" aria-hidden="true" style={{ position: 'absolute', left: '10%', right: '10%', bottom: '8%', width: '80%', height: '70%', opacity: 0.9 }}>
        <Specimen data={FERN} />
      </svg>

      {/* qapaq */}
      <motion.div
        animate={gate.opening ? { rotateY: -112 } : {}}
        transition={{ duration: 1.0, ease: [0.6, 0, 0.3, 1], delay: 0.35 }}
        style={{
          position: 'absolute', inset: 0, transformOrigin: 'left center', backfaceVisibility: 'hidden',
          backgroundColor: C.COVER, backgroundImage: `${LINEN_URI}, radial-gradient(120% 80% at 50% 40%, #3E4E38, #26311F)`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px',
          boxShadow: '12px 0 30px rgba(0,0,0,.25)',
        }}>
        <span aria-hidden="true" style={{ position: 'absolute', inset: 16, border: '1px solid rgba(0,0,0,.28)', boxShadow: '1px 1px 0 rgba(255,255,255,.07), inset 1px 1px 0 rgba(255,255,255,.06)', borderRadius: 3, pointerEvents: 'none' }} />
        {/* yapışdırılmış etiket */}
        <div style={{
          position: 'relative', width: 'min(82vw, 320px)', padding: '26px 22px 24px', textAlign: 'center',
          backgroundColor: '#EFE8D5', backgroundImage: PAPER_URI, color: C.INK,
          boxShadow: '0 1px 0 rgba(255,255,255,.4) inset, 0 10px 24px -10px rgba(0,0,0,.5)',
          outline: `1px solid ${alpha(C.INK, 0.55)}`, outlineOffset: -8,
          animation: 'nt-press 1.1s cubic-bezier(.2,.8,.2,1) .3s both',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', animation: 'nt-fade 1s ease-out .9s both' }}>
            <EmblemSlot mono={ot.mono} size={58} border={`1px solid ${alpha(C.INK, 0.4)}`} background={C.PAPER} color={C.INK} font={serif} style={{ animation: 'none' }}>
              <LeafMark size={44} />
            </EmblemSlot>
          </div>
          {titleOv !== '' && (
            <div style={{ marginTop: 14, fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(28px, 9vw, 36px)', lineHeight: 1.15, animation: 'nt-rise 1s ease-out 1.1s both' }}>
              {first}{second && <><span style={{ fontStyle: 'normal', fontSize: '.6em', color: C.TERRA, margin: '0 .3em' }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          <div aria-hidden="true" style={{ width: 40, height: 1, background: alpha(C.INK, 0.4), margin: '14px auto 12px' }} />
          {ot.show('meta') && <div style={{ fontSize: 13.5, letterSpacing: '.04em', color: C.MOSS, animation: 'nt-rise .9s ease-out 1.4s both' }}>{ot.text('meta')}</div>}
        </div>
        {/* kəndir */}
        <motion.div animate={gate.opening ? { opacity: 0, y: 30 } : {}} transition={{ duration: 0.35 }}
          style={{ width: '100%', marginTop: 26, animation: 'nt-fade 1s ease-out 1.6s both' }}>
          <TwineBow />
        </motion.div>
        {ot.show('cta') && (
          <div style={{ marginTop: 6, minHeight: 48, padding: '12px 26px', display: 'inline-flex', alignItems: 'center', background: '#EFE8D5', color: C.INK, fontSize: 15, borderRadius: 2, boxShadow: '0 6px 14px -6px rgba(0,0,0,.5)', animation: 'nt-rise .9s ease-out 2s both' }}>
            {ot.text('cta')}
          </div>
        )}
        {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 13, color: '#C9CFB8', animation: 'nt-fade .8s ease-out 2.4s both, nt-hint 3s ease-in-out 3.2s infinite' }}>{ot.text('hint')}</div>}
      </motion.div>
    </motion.div>
  )
}

/* ═══ DAXİL: dağ çəmənliyi (2026-10, v2) ═══ */
const LAND = landscape({ w: 400, h: 520, seed: 3 })
const WOOD = woodRings(50, 11, 2)
const TOPO = contours(150, 110, 10, 13, 4)

/* Çöl çiçəyi budağı — bölmə nişanı (preslənmiş kimi) */
function Wildflower({ size = 34, style }) {
  const C = usePalette()
  return (
    <svg viewBox="-20 -34 40 40" width={size} height={size} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <path d="M0 6C-1 -6 1 -16 -2 -28M0 -6C5 -10 9 -14 10 -20M-1 -14C-6 -17 -10 -20 -12 -25" fill="none" stroke={C.MOSS} strokeWidth="1" strokeLinecap="round" />
      {[[-2, -29, C.GOLDEN], [10, -21, '#E9B8A6'], [-12, -26, '#F4E9D2']].map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} rx="1.6" ry="3.2" cy="-2.6" fill={c} stroke={alpha(C.INK, 0.25)} strokeWidth=".3" transform={`rotate(${a})`} />)}
          <circle r="1.3" fill={C.TERRA} />
        </g>
      ))}
      <path d="M-1 -2C-6 -4 -9 -2 -10 1C-6 2 -3 1 -1 -2ZM0 -9C4 -12 8 -11 9 -8C5 -6 2 -7 0 -9Z" fill={C.SAGE} />
    </svg>
  )
}

/* Ağac kəsiyi — illik halqalar; içində rəqəm (sayğac, masa) */
function WoodSlice({ size = 80, children, uid = 'w', style }) {
  const C = usePalette()
  return (
    <div style={{ position: 'relative', width: size, height: size, ...style }}>
      <svg viewBox="-53 -53 106 106" width="100%" height="100%" aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'visible', filter: 'drop-shadow(0 8px 10px rgba(60,40,20,.28))' }}>
        <defs>
          <radialGradient id={`nt-w-${uid}`} cx="46%" cy="44%" r="62%">
            <stop offset="0" stopColor="#F0DCB4" /><stop offset=".6" stopColor="#DDBC8A" /><stop offset="1" stopColor="#B88D5C" />
          </radialGradient>
        </defs>
        <path d={WOOD.bark} fill={C.BARK} />
        <circle r="45.5" fill={`url(#nt-w-${uid})`} />
        <circle r="45.5" fill="none" stroke="#9C7348" strokeWidth="1.2" />
        {WOOD.rings.map((d, i) => <path key={i} d={d} fill="none" stroke="#A47B4E" strokeOpacity={0.25 + (i % 3) * 0.1} strokeWidth={i % 4 === 3 ? 1 : 0.6} />)}
        <path d="M44 6L30 4L22 7" fill="none" stroke="#7C5634" strokeOpacity=".5" strokeWidth=".8" strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  )
}

/* Dağ mənzərəsi */
function Meadow() {
  return (
    <svg viewBox="0 0 400 520" preserveAspectRatio="xMidYMax slice" width="100%" height="100%" aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'block' }}>
      <defs>
        <linearGradient id="nt-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4EEE2" /><stop offset=".45" stopColor="#F5E2C4" /><stop offset=".62" stopColor="#F1CF9E" />
        </linearGradient>
        <radialGradient id="nt-sun" r=".5"><stop offset="0" stopColor="#FBE3B0" /><stop offset=".4" stopColor="#F6CB82" stopOpacity=".9" /><stop offset="1" stopColor="#F6CB82" stopOpacity="0" /></radialGradient>
        <linearGradient id="nt-mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF8EC" stopOpacity="0" /><stop offset=".6" stopColor="#FFF8EC" stopOpacity=".55" /><stop offset="1" stopColor="#FFF8EC" stopOpacity="0" /></linearGradient>
      </defs>
      <rect width="400" height="520" fill="url(#nt-sky)" />
      <circle cx="292" cy="236" r="90" fill="url(#nt-sun)" />
      <circle cx="292" cy="236" r="24" fill="#FBE6B8" />
      {LAND.layers.map((d, i) => (
        <g key={i}>
          <path d={d} fill={['#C9D3C4', '#A8B9A5', '#809682', '#5A715D'][i]} />
          {i < 3 && <rect y={[262, 300, 342][i]} width="400" height="34" fill="url(#nt-mist)" />}
        </g>
      ))}
      <path d={LAND.hill} fill="#33493A" />
      <path d={LAND.trees} fill="#22352A" />
      <rect y={505} width="400" height="15" fill="#2C4234" />
      {LAND.flowers.map((f, i) => <circle key={i} cx={f.x} cy={f.y} r={f.r} fill={f.c} opacity=".9" />)}
    </svg>
  )
}

/* Bölmə: çöl çiçəyi + kursiv başlıq */
function Clearing({ id, section, title, kicker, sub, children, serif, bg }) {
  const C = usePalette()
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '58px 20px 62px', background: bg }}>
      <Reveal style={{ maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <Wildflower size={34} style={{ margin: '0 auto 10px' }} />
            {title && <h2 style={{ margin: 0, fontFamily: serif, fontStyle: 'italic', fontWeight: 400, fontSize: scaleFont('clamp(30px, 8.6vw, 38px)', C.hs), lineHeight: 1.12, color: C.INK, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontSize: 14, color: C.MOSS }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 320, fontSize: 15.5, color: C.MOSS, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${alpha(C.INK, 0.4)}`,
  borderRadius: 0, padding: '13px 2px', fontSize: 16.5, color: C.INK, outline: 'none',
})
const btn = (C, on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 46, padding: '11px 22px', borderRadius: 999,
  fontSize: 15, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.INK : 'transparent', color: on ? C.PAPER : C.INK, border: `1px solid ${C.INK}`,
})
const leafDot = (C, a) => (
  <svg width="16" height="12" viewBox="-1 -8 30 16" aria-hidden="true"><path d={leafPath(28, 6.5)} fill={a ? C.MOSS : 'none'} stroke={a ? C.MOSS : alpha(C.MOSS, 0.6)} strokeWidth="1.4" /></svg>
)

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function NatureTouchTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, gbookL, seatingL } = inv
  const serif = theme.fonts.heading
  const sans = theme.fonts.body
  const SL = inv.copy(TXT)

  const ll = parseLatLon(weddingData)
  const coords = ll ? `${dms(ll[0], 'N', 'S')}  ${dms(ll[1], 'E', 'W')}` : ''

  return (
    <PaletteContext.Provider value={C}>
      <div data-nt data-enter={enterDirection(ID)} style={{
        backgroundColor: C.PAPER, backgroundImage: PAPER_URI,
        minHeight: '100vh', fontFamily: sans, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
        fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.MOSS, 0.25),
      }}>
        <style>{KEYFRAMES(C)}</style>
        {!inv.opened && <FolioOpening inv={inv} theme={theme} />}

        <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.PAPER, border: `1px solid ${alpha(C.INK, 0.3)}`, boxShadow: '0 6px 16px rgba(47,58,44,.18)' }}>
          {({ playing }) => <EqBars playing={playing} color={C.INK} idle={alpha(C.INK, 0.3)} />}
        </MusicFab>

        {inv.opened && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
            <header style={{
              position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: alpha(C.PAPER, 0.9), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
              borderBottom: `1px solid ${alpha(C.INK, 0.1)}`,
            }}>
              <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MOSS, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: sans }}>
                <span aria-hidden="true">←</span>{tr.btn_back}
              </button>
              <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 18 }}>{SL.brand}</div>
              <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
            </header>

            {/* HERO — dağ çəmənliyi, qızıl saat */}
            <section data-section="hero" style={{ position: 'relative' }}>
              <div style={{ position: 'relative', height: 'min(132vw, 600px)', overflow: 'hidden' }}>
                <Meadow />
                <div style={{ position: 'absolute', left: 0, right: 0, top: '9%', textAlign: 'center', padding: '0 22px', animation: 'nt-rise 1.2s ease-out .2s both' }}>
                  <div style={{ fontSize: 14, letterSpacing: '.04em', color: C.MOSS }}>{L('hero', 'kicker', inv.eventLabel)}</div>
                  <h1 style={{ margin: '10px 0 0', fontFamily: serif, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(44px, 13.5vw, 62px)', lineHeight: 1.02, color: C.INK, textWrap: 'balance' }}>
                    {inv.heroTitle ? inv.heroTitle : inv.isCouple ? <>{inv.groom}<span style={{ display: 'block', fontStyle: 'normal', fontSize: '.42em', color: C.TERRA, margin: '6px 0' }}>{inv.and}</span>{inv.bride}</> : inv.single}
                  </h1>
                </div>
              </div>
              <div style={{ position: 'relative', padding: '30px 22px 14px', textAlign: 'center' }}>
                <div style={{ fontFamily: serif, fontSize: 25, lineHeight: 1.2 }}>{inv.fullDate}</div>
                <div style={{ marginTop: 6, fontSize: 15.5, color: C.MOSS }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
                {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 15, color: C.MOSS }}>{tr.organizer_display}: {weddingData.organizer}</div>}
                <Wildflower size={40} style={{ margin: '22px auto 0' }} />
                <p style={{ margin: '14px auto 0', maxWidth: 320, fontFamily: serif, fontStyle: 'italic', fontSize: 18, lineHeight: 1.55, color: C.MOSS }}>{tr.inv_join}</p>
              </div>
            </section>

            {/* SAYĞAC — ağac kəsikləri */}
            {S.countdown && (
              <Clearing section="countdown" serif={serif} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(6px, 2.6vw, 14px)', maxWidth: 380, margin: '0 auto' }}>
                  {[
                    { v: cd.days, l: cd.labels.days },
                    { v: cd.hours, l: cd.labels.hours },
                    { v: cd.minutes, l: cd.labels.minutes },
                    { v: cd.seconds, l: cd.labels.seconds, pop: true },
                  ].map(({ v, l, pop }, i) => (
                    <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <WoodSlice size="min(20vw, 82px)" uid={`cd${i}`}>
                        <span style={{ fontFamily: serif, fontSize: 'clamp(20px, 6vw, 26px)', color: '#4A3220', textShadow: '0 1px 0 rgba(255,240,210,.7)', fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                      </WoodSlice>
                      <div style={{ marginTop: 10, fontSize: 13, color: C.MOSS }}>{l}</div>
                    </div>
                  ))}
                </div>
              </Clearing>
            )}

            <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

            {/* MƏKAN — tağlı pəncərə, altda dağ silueti */}
            {S.venue && (
              <Clearing section="venue" serif={serif} bg={C.LINEN} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
                <div style={{ position: 'relative', maxWidth: 360, margin: '0 auto', borderRadius: '180px 180px 18px 18px', overflow: 'hidden', boxShadow: '0 20px 34px -22px rgba(47,58,44,.55)' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.TERRA} height="clamp(300px, 86vw, 380px)"
                    map={{ opacity: 0.8, filter: 'grayscale(.6) sepia(.25) contrast(.95)', tintOpacity: 0.16, tint: C.SAGE, blend: 'multiply' }}
                    frame={<FindPin />}
                    fallback={<Topo height="clamp(300px, 86vw, 380px)" />}
                  />
                  <svg viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: 46 }}>
                    <path d="M0 60V38L40 22L70 34L110 12L150 30L190 18L230 34L270 10L310 28L350 20L400 36V60Z" fill={alpha('#33493A', 0.85)} />
                  </svg>
                </div>
                {coords && <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12.5, letterSpacing: '.12em', color: C.MOSS }}>{coords}</div>}
                <div style={{ textAlign: 'center', marginTop: 10, fontFamily: serif, fontSize: 25, lineHeight: 1.25 }}>{weddingData.venueName}</div>
                {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 15, color: C.MOSS }}>{weddingData.venueNote}</div>}
                <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={btn(C, true)}>{tr.inv_directions_btn}</a>}
                  {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={btn(C, !inv.dirUrl)}>Maps</a>}
                  {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(C, false)}>Waze</a>}
                  {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(C, false)}>Apple</a>}
                </div>
              </Clearing>
            )}

            {/* PROQRAM — meşə cığırı */}
            {S.program && (
              <Clearing section="program" serif={serif} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
                <ol style={{ listStyle: 'none', margin: '0 auto', padding: 0, maxWidth: 420 }}>
                  {timeline.events.map((ev, i) => {
                    const right = i % 2 === 1
                    const last = i === timeline.events.length - 1
                    return (
                      <li key={i} style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 40px minmax(0, 1fr)', minHeight: 92 }}>
                        {!last && (
                          <svg viewBox="0 0 40 100" preserveAspectRatio="none" aria-hidden="true" style={{ gridColumn: 2, gridRow: 1, position: 'absolute', left: 'calc(50% - 20px)', top: 18, width: 40, height: 'calc(100% + 0px)' }}>
                            <path d={right ? 'M20 0C4 30 36 64 20 100' : 'M20 0C36 30 4 64 20 100'} fill="none" stroke={C.TERRA} strokeOpacity=".55" strokeWidth="1.6" strokeDasharray="3 5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                          </svg>
                        )}
                        <span aria-hidden="true" style={{ gridColumn: 2, gridRow: 1, justifySelf: 'center', marginTop: 6, width: 26, height: 26, borderRadius: '50%', background: C.PAPER, boxShadow: `0 0 0 1.5px ${C.MOSS}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                          <svg width="14" height="10" viewBox="-1 -8 30 16"><path d={leafPath(28, 7)} fill={i % 3 === 1 ? C.GOLDEN : C.MOSS} /></svg>
                        </span>
                        <div style={{ gridColumn: right ? 3 : 1, gridRow: 1, textAlign: right ? 'left' : 'right', padding: right ? '6px 0 22px 10px' : '6px 10px 22px 0', minWidth: 0 }}>
                          <div style={{ fontSize: 13.5, letterSpacing: '.06em', color: C.TERRA, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                          <div style={{ marginTop: 3, fontFamily: serif, fontSize: 17.5, lineHeight: 1.3 }}>{ev.label}</div>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </Clearing>
            )}

            {S.dresscode && (
              <Clearing section="dresscode" serif={serif} bg={C.LINEN} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
                <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={serif} align="center" />
              </Clearing>
            )}

            {/* MASA — ağac kəsiyində masa nömrəsi */}
            {S.seating && !seating.isEmpty && (
              <Clearing section="seating" serif={serif} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
                <input {...seatInputProps(inv, 'nt-seat-list')} style={field(C)} />
                <SeatSuggest inv={inv} id="nt-seat-list" c={{ bg: C.PAPER, border: `1px solid ${alpha(C.INK, 0.25)}`, active: alpha(C.MOSS, 0.1), text: C.INK, table: C.TERRA, radius: 10, font: sans }} />
                {seating.showNotFound && <div style={{ marginTop: 12, fontSize: 14.5, color: C.MOSS, textAlign: 'center' }}>{tr.inv_seat_fullname}</div>}
                {seating.selected && (
                  <div style={{ marginTop: 28, textAlign: 'center', animation: 'nt-rise .7s ease-out both' }}>
                    <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 20 }}>{seating.selected.full_name}</div>
                    <WoodSlice size={176} uid="seat" style={{ margin: '16px auto 0' }}>
                      <span style={{ fontSize: 12, letterSpacing: '.2em', color: '#6B4A30' }}>{SL.table}</span>
                      <span style={{ fontFamily: serif, fontSize: 58, lineHeight: 1, color: '#4A3220', textShadow: '0 1px 0 rgba(255,240,210,.8), 0 -1px 0 rgba(90,60,30,.25)' }}>{seating.selected.table_id}</span>
                    </WoodSlice>
                    {seating.tablemates.length > 0 && <div style={{ marginTop: 16, fontSize: 15, color: C.MOSS, lineHeight: 1.6 }}>{seating.tablemates.map((g) => g.full_name).join(', ')}</div>}
                    <button onClick={seating.reset} data-press style={{ marginTop: 6, background: 'none', border: 'none', color: C.INK, fontSize: 14.5, minHeight: 44, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: sans }}>
                      {seatingL.again || 'Yenidən axtar'}
                    </button>
                  </div>
                )}
              </Clearing>
            )}

            {/* FOTOLAR */}
            {S.gallery && (
              <Clearing section="gallery" id="gallery-section" serif={serif} bg={C.LINEN} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
                {gallery.demoPhotos.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 30, alignItems: 'start' }}>
                    {gallery.demoPhotos.map((url, i) => (
                      <div key={i} style={{ marginTop: i % 3 === 1 ? 18 : 0, aspectRatio: '3 / 4', borderRadius: 14, overflow: 'hidden', background: alpha(C.SAGE, 0.3) }}>
                        <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', padding: 12, background: '#FFFDF6', borderRadius: 14, boxShadow: `0 0 0 1px ${alpha(C.INK, 0.12)}` }}>
                    <QRCodeSVG value={gallery.photoShareUrl} size={128} bgColor="#FFFDF6" fgColor={C.INK} level="M" />
                  </div>
                  <div style={{ marginTop: 12, fontSize: 14, color: C.MOSS }}>{tr.inv_scan_upload}</div>
                  <a data-press href={gallery.photoShareUrl} style={{ ...btn(C, true), marginTop: 16 }}>{tr.inv_gallery_btn}</a>
                  <p style={{ margin: '16px auto 0', maxWidth: 340, fontSize: 15, color: C.MOSS, lineHeight: 1.65 }}>{tr.inv_gallery_desc}</p>
                </div>
              </Clearing>
            )}

            {/* İŞTİRAK TƏSDİQİ — səhifənin öz axınında */}
            {S.rsvp && (
              <Clearing section="rsvp" serif={serif} title={L('rsvp', 'title', inv.rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={inv.rsvpL.subtitle}>
                <ReplyForm inv={inv} t={{ ink: C.INK, muted: C.MOSS, line: alpha(C.INK, 0.35), hair: alpha(C.INK, 0.12), accent: C.INK, font: sans, display: serif, displayItalic: true, doneMark: <Wildflower size={36} style={{ margin: '0 auto 8px' }} />, marker: (a) => leafDot(C, a), suggest: { bg: C.PAPER, border: `1px solid ${alpha(C.INK, 0.25)}`, active: alpha(C.MOSS, 0.1), text: C.INK, table: C.TERRA, radius: 10, font: sans } }} />
              </Clearing>
            )}

            {/* XOŞ SÖZLƏR */}
            {S.guestbook && (
              <Clearing section="guestbook" serif={serif} bg={C.LINEN} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
                <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 30 }}>
                  <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={field(C)} />
                  <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...field(C), resize: 'none', lineHeight: 1.5 }} />
                  <div style={{ textAlign: 'center', marginTop: 8 }}>
                    <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...btn(C, false), minWidth: 190, opacity: gbook.canSubmit ? 1 : 0.45, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}>
                      {gbook.sending ? gbookL.sending : gbookL.btn}
                    </button>
                  </div>
                  {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 13.5, color: C.TERRA }}>⚠ {gbookL.error}</p>}
                </form>
                <div>
                  {gbook.messages.map((raw, i) => {
                    const m = gbook.readMessage(raw)
                    return (
                      <figure key={m.name + i} style={{ margin: 0, padding: '18px 0', textAlign: 'center' }}>
                        {i > 0 && (
                          <svg viewBox="0 0 160 16" width="140" height="14" aria-hidden="true" style={{ display: 'block', margin: '-18px auto 18px' }}>
                            <path d="M4 8C40 2 60 14 80 8S120 2 156 8" fill="none" stroke={alpha(C.MOSS, 0.5)} strokeWidth="1" />
                            {[30, 62, 98, 130].map((x, k) => <path key={x} d={leafPath(9, 2.6)} fill={alpha(C.MOSS, 0.55)} transform={`translate(${x} ${k % 2 ? 9 : 6}) rotate(${k % 2 ? 30 : -30})`} />)}
                          </svg>
                        )}
                        <blockquote style={{ margin: 0, fontFamily: serif, fontStyle: 'italic', fontSize: 18.5, lineHeight: 1.55 }}>{m.text}</blockquote>
                        <figcaption style={{ marginTop: 8, fontSize: 13, color: C.MOSS }}>{m.name}{m.date ? `, ${gbook.formatDate(m.date)}` : ''}</figcaption>
                      </figure>
                    )
                  })}
                </div>
              </Clearing>
            )}

            <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={serif} />
          </motion.div>
        )}
      </div>
    </PaletteContext.Provider>
  )
}

function Topo({ height }) {
  return (
    <div style={{ height, position: 'relative', background: '#F1EDDF' }}>
      <svg viewBox="0 0 300 220" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        {TOPO.map((d, i) => <path key={i} d={d} fill="none" stroke={i % 5 === 4 ? '#8A6A44' : '#A88B63'} strokeOpacity={i % 5 === 4 ? 0.7 : 0.45} strokeWidth={i % 5 === 4 ? 1.1 : 0.6} />)}
        <path d="M0 180C60 160 90 200 150 186S250 150 300 168" fill="none" stroke="#7FA3B8" strokeOpacity=".6" strokeWidth="2" />
      </svg>
      <FindPin />
    </div>
  )
}

function FindPin() {
  const C = usePalette()
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '46%', width: 0, height: 0, pointerEvents: 'none' }}>
      <svg width="34" height="34" viewBox="-17 -17 34 34" style={{ position: 'absolute', left: -17, top: -17 }}>
        <circle r="13" fill={alpha(C.PAPER, 0.85)} stroke={C.TERRA} strokeWidth="1.2" />
        <path d={leafPath(16, 4.5)} transform="translate(-8 0)" fill={C.MOSS} />
      </svg>
    </span>
  )
}
