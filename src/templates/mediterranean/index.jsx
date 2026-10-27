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

/* ─────────────────────────────────────────────────────────────────────────────
   MEDITERRANEAN — «Riviera: limon və mayolika» (premium redizayn, 2026-10)

   Konsept: Amalfi sahilində yay toyu. Açılış — əl ilə boyanmış kobalt-limon
   mayolika kaşılarından divar; kaşılar mərkəzdən dalğa ilə düzülür, ortada
   Pozitano evlərindəki kimi kaşı lövhədə adlar. Toxunanda kaşılar dalğa ilə
   çevrilir və altından dəniz çıxır. Daxildə:
     hero      → Riviera mənzərəsi: dəniz, günəş, qayada rəngli evlər, limon budağı
     sayğac    → dörd mayolika kaşısı
     məkan     → mavi taxta pəncərə qapaqları açıq pəncərə
     proqram   → limon budağı: hər limon bir hadisə
     masa      → əl boyası keramika boşqab — masa nömrəsi
     fotolar   → poçt markası
     RSVP      → Rivyeradan poçt kartı
     arzular   → çimərlik zolaqlı kartlar
   Rəng: əhəng ağı, kobalt, dəniz, limon, yarpaq yaşılı, terrakota.
   Şriftlər: Libre Bodoni (kursiv başlıq) · Literata (mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('mediterranean')
const ID = 'mediterranean'

const LABELS = {
  countdown: { title: { az: 'Yaya qədər', en: 'Until summer comes', ru: 'До нашего лета' } },
  venue:     { title: { az: 'Villa', en: 'The villa', ru: 'Вилла' } },
  program:   { title: { az: 'Gün batana qədər', en: 'Until sunset', ru: 'До заката' } },
  dresscode: { title: { az: 'Yay geyimi', en: 'Summer attire', ru: 'Летний дресс-код' } },
  seating:   { title: { az: 'Masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Sahildən kartlar', en: 'Postcards from the coast', ru: 'Открытки с побережья' } },
  rsvp:      { title: { az: 'Cavab kartı', en: 'Reply postcard', ru: 'Открытка-ответ' } },
  guestbook: { title: { az: 'Dənizdən məktublar', en: 'Letters by the sea', ru: 'Письма у моря' } },
}
const TXT = {
  az: { table: 'Masa', greet: 'Sahildən salamlar' },
  en: { table: 'Table', greet: 'Greetings from the coast' },
  ru: { table: 'Стол', greet: 'Привет с побережья' },
}

const PAL = {
  PLASTER: '#FBF8F1',
  SAND: '#F1E7D3',
  AZURE: '#1F5FA6',
  SEA: '#2E7C96',
  LEMON: '#F2C94C',
  LEAF: '#4E7A3A',
  TERRA: '#D7774E',
  INK: '#1E3348',
  MUTED: '#5A6B7A',
}

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['AZURE'], secondary: ['SEA'], accent: ['TERRA'], background: ['PLASTER'], text: ['INK'] }

const svgUri = (s) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`
/* Mayolika kaşıları — künclərdəki dörddəbir dairələr qonşu kaşılarla tam dairə olur */
const TILE_A = svgUri(`<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><rect width='60' height='60' fill='#FBF8F1'/><g fill='#1F5FA6'><path d='M0 0h13a13 13 0 0 1-13 13zM60 0v13a13 13 0 0 1-13-13zM60 60h-13a13 13 0 0 1 13-13zM0 60v-13a13 13 0 0 1 13 13z'/><ellipse cx='30' cy='19' rx='4.6' ry='9'/><ellipse cx='30' cy='41' rx='4.6' ry='9'/><ellipse cx='19' cy='30' rx='9' ry='4.6'/><ellipse cx='41' cy='30' rx='9' ry='4.6'/><path d='M30 1.5l3 3-3 3-3-3zM30 52.5l3 3-3 3-3-3zM1.5 30l3-3 3 3-3 3zM52.5 30l3-3 3 3-3 3z'/></g><circle cx='30' cy='30' r='4.4' fill='#F2C94C'/><g fill='none' stroke='#1F5FA6' stroke-width='.8'><circle cx='30' cy='30' r='16'/></g></svg>`)
const TILE_B = svgUri(`<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><rect width='60' height='60' fill='#FBF8F1'/><g fill='#1F5FA6'><path d='M0 0h13a13 13 0 0 1-13 13zM60 0v13a13 13 0 0 1-13-13zM60 60h-13a13 13 0 0 1 13-13zM0 60v-13a13 13 0 0 1 13 13z'/></g><path d='M22 38c-4-7 0-16 8-17 8 1 12 10 8 17-3 5-13 5-16 0z' fill='#F2C94C' stroke='#C99A1E' stroke-width='.8' transform='rotate(-20 30 30)'/><path d='M33 20c4-6 10-7 14-5-3 5-9 7-14 5z' fill='#4E7A3A'/><path d='M31 21c-2-5-7-7-11-6 2 4 7 6 11 6z' fill='#6E9A4E'/><g fill='none' stroke='#1F5FA6' stroke-width='.9'><path d='M30 3c6 4 6 8 0 10-6-2-6-6 0-10zM30 57c6-4 6-8 0-10-6 2-6 6 0 10zM3 30c4-6 8-6 10 0-2 6-6 6-10 0zM57 30c-4-6-8-6-10 0 2 6 6 6 10 0z'/></g></svg>`)

const KEYFRAMES = (C) => `
@keyframes md-in   { from { opacity: 0; transform: scale(.6) rotate(-8deg) } to { opacity: 1; transform: none } }
@keyframes md-out  { to { opacity: 0; transform: perspective(500px) rotateY(90deg) scale(.9) } }
@keyframes md-rise { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
@keyframes md-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes md-glint { 0%,100% { opacity: .3 } 50% { opacity: .9 } }
@keyframes md-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
[data-md] span[aria-hidden="true"], [data-md] svg[aria-hidden="true"], [data-md] div[aria-hidden="true"] { pointer-events: none; }
[data-md] ::placeholder { color: rgba(90,107,122,.6); }
[data-md] input:focus-visible, [data-md] textarea:focus-visible { border-color: ${C.AZURE} !important; outline: none; }
[data-md] button:focus-visible, [data-md] a:focus-visible, [data-md] [role="button"]:focus-visible { outline: 1.5px solid ${C.AZURE}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-md] *, [data-md] { animation: none !important; transition: none !important; } }
`

/* ─── Motivlər ─── */
function Lemon({ size = 26, style, rot = -20 }) {
  const C = usePalette()
  return (
    <svg viewBox="-20 -20 40 40" width={size} height={size} aria-hidden="true" style={{ display: 'block', overflow: 'visible', ...style }}>
      <g transform={`rotate(${rot})`}>
        <path d="M-15 0C-15 -8 -8 -11.5 0 -11.5C8 -11.5 15 -8 15 0C15 8 8 11.5 0 11.5C-8 11.5 -15 8 -15 0Z" fill={C.LEMON} stroke="#C99A1E" strokeWidth=".9" />
        <path d="M15 0l3.5 0M-15 0l-3 0" stroke="#C99A1E" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M-6 -6C-3 -8 2 -8 5 -6" fill="none" stroke="#FFF3B8" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <path d="M2 -11C8 -20 16 -20 20 -17C15 -11 8 -10 2 -11Z" fill={C.LEAF} />
    </svg>
  )
}

function LemonBranch({ width = 160, style, flip }) {
  const C = usePalette()
  return (
    <svg viewBox="0 0 160 110" width={width} height={width * 0.69} aria-hidden="true" style={{ display: 'block', overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined, ...style }}>
      <path d="M0 8C40 14 80 30 150 80" fill="none" stroke="#6B5434" strokeWidth="2.4" strokeLinecap="round" />
      {[[30, 14, -30], [58, 22, 40], [84, 34, -20], [108, 50, 50], [128, 64, -10]].map(([x, y, r], i) => (
        <path key={i} d="M0 0C8 -8 22 -10 32 -4C22 4 8 6 0 0Z" fill={i % 2 ? C.LEAF : '#6E9A4E'} transform={`translate(${x} ${y}) rotate(${r})`} />
      ))}
      <g transform="translate(70 52)"><Lemon size={44} rot={-30} /></g>
      <g transform="translate(118 84)"><Lemon size={36} rot={10} /></g>
    </svg>
  )
}

/* Riviera mənzərəsi */
function Riviera() {
  const C = usePalette()
  const houses = [
    [230, 168, 28, 24, '#F6D8C8'], [262, 160, 24, 32, '#F2C94C'], [288, 150, 30, 42, '#FFFFFF'], [322, 142, 26, 50, '#E79E7A'],
    [350, 132, 34, 60, '#F7E9C9'], [244, 186, 30, 26, '#FFFFFF'], [276, 182, 26, 30, '#D9E8EE'], [304, 176, 30, 36, '#F6D8C8'],
    [336, 170, 28, 42, '#FFFFFF'], [366, 162, 34, 50, '#F2C94C'],
  ]
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="md-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#A9D6EA" /><stop offset=".75" stopColor="#F7E6CB" /></linearGradient>
        <linearGradient id="md-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A8FA8" /><stop offset="1" stopColor="#1F5FA6" /></linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#md-sky)" />
      <circle cx="120" cy="176" r="26" fill="#F6CF7E" opacity=".9" />
      <rect y="196" width="400" height="104" fill="url(#md-sea)" />
      {[[70, 210, 90], [96, 222, 60], [60, 236, 110], [110, 250, 40], [40, 264, 80]].map(([x, y, w], i) => (
        <path key={i} d={`M${x} ${y}h${w}`} stroke="#FFF1C9" strokeWidth="2" strokeLinecap="round" style={{ animation: `md-glint ${3 + i * 0.6}s ease-in-out ${i * 0.4}s infinite` }} />
      ))}
      <path d="M200 300C210 240 220 210 250 190C280 170 300 130 340 118C370 110 390 112 400 116V300Z" fill="#C9A77A" />
      <path d="M215 300C225 250 240 225 268 210C300 194 320 170 360 164C380 162 395 164 400 166V300Z" fill="#B08A5C" />
      {houses.map(([x, y, w, h, c], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill={c} stroke="rgba(0,0,0,.08)" />
          <rect x={x + w * 0.3} y={y + h * 0.28} width={w * 0.18} height={h * 0.22} fill={C.AZURE} opacity=".75" />
          <rect x={x + w * 0.58} y={y + h * 0.28} width={w * 0.18} height={h * 0.22} fill={C.AZURE} opacity=".75" />
        </g>
      ))}
      <path d="M352 132a14 14 0 0 1 28 0z" fill="#3A7BBE" />
      <path d="M150 212l12 -18 6 18z" fill="#FFFFFF" /><path d="M146 212h26l-3 4h-20z" fill={C.TERRA} />
    </svg>
  )
}

/* ═══ 01 — AÇILIŞ: mayolika divarı ═══ */
function TileOpening({ inv, theme }) {
  const C = usePalette()
  const { ot } = inv
  const gate = useGate({ inv, ms: 1500 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const serif = theme.fonts.heading
  const COLS = 6, ROWS = 14
  return (
    <motion.div {...gate.gateProps} data-md
      animate={gate.opening ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.1 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: `linear-gradient(180deg, #A9D6EA, #F7E6CB 46%, #3A8FA8 50%, ${C.AZURE})`, color: C.INK, fontFamily: theme.fonts.body }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridAutoRows: `calc(100vw / ${COLS})`, alignContent: 'center' }}>
        {Array.from({ length: COLS * ROWS }, (_, k) => {
          const i = k % COLS, j = Math.floor(k / COLS)
          const dist = Math.hypot(i - (COLS - 1) / 2, (j - (ROWS - 1) / 2) * 0.8)
          const d = (dist * 0.08).toFixed(2)
          return (
            <span key={k} style={{
              backgroundImage: (i + j * 2) % 5 === 0 ? TILE_B : TILE_A, backgroundSize: '100% 100%',
              boxShadow: 'inset 0 0 0 .5px rgba(31,95,166,.25)',
              animation: gate.opening ? `md-out .45s ease-in ${(0.25 + dist * 0.05).toFixed(2)}s forwards` : `md-in .6s cubic-bezier(.2,.8,.2,1) ${d}s both`,
            }} />
          )
        })}
      </div>

      <motion.div animate={gate.opening ? { opacity: 0, scale: 0.94 } : {}} transition={{ duration: 0.3 }}
        style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 'min(84vw, 330px)', padding: '30px 22px 26px', background: C.PLASTER, boxShadow: `0 0 0 3px ${C.AZURE}, 0 0 0 7px ${C.PLASTER}, 0 0 0 8px ${C.AZURE}, 0 24px 50px rgba(20,40,70,.45)`, borderRadius: 3, animation: 'md-in .9s cubic-bezier(.2,.8,.2,1) .9s both' }}>
          <LemonBranch width={120} style={{ position: 'absolute', left: -26, top: -30 }} />
          <LemonBranch width={96} flip style={{ position: 'absolute', right: -30, bottom: -58, transform: 'scale(-1,-1)' }} />
          {ot.show('kicker') && <div style={{ fontStyle: 'italic', fontSize: 16, color: C.SEA, animation: 'md-rise .8s ease-out 1.4s both' }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 10, fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(34px, 10.5vw, 44px)', lineHeight: 1.08, color: C.AZURE, animation: 'md-rise 1s ease-out 1.6s both' }}>
              {first}{second && <><span style={{ display: 'block', fontSize: '.5em', color: C.TERRA, margin: '2px 0' }}>&amp;</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 14, fontSize: 14, color: C.MUTED, animation: 'md-rise .8s ease-out 1.9s both' }}>{ot.text('meta')}</div>}
        </div>
        {ot.show('cta') && (
          <div style={{ marginTop: 34, minHeight: 50, padding: '13px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: C.AZURE, color: C.PLASTER, fontSize: 15.5, boxShadow: `0 0 0 3px ${C.PLASTER}, 0 14px 30px rgba(20,40,70,.4)`, animation: 'md-rise .8s ease-out 2.3s both' }}>
            {ot.text('cta')}
          </div>
        )}
        {ot.show('hint') && <div style={{ marginTop: 12, padding: '4px 12px', borderRadius: 999, background: alpha(C.PLASTER, 0.85), fontSize: 13, color: C.INK, animation: 'md-fade .8s ease-out 2.7s both, md-hint 3s ease-in-out 3.5s infinite' }}>{ot.text('hint')}</div>}
      </motion.div>
    </motion.div>
  )
}

/* Bölmə */
function Terrace({ id, section, title, kicker, sub, children, serif, tinted }) {
  const C = usePalette()
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '58px 20px 62px', background: tinted ? C.SAND : 'transparent' }}>
      <Reveal style={{ maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <Lemon size={30} style={{ margin: '0 auto 10px' }} />
            {title && <h2 style={{ margin: 0, fontFamily: serif, fontStyle: 'italic', fontWeight: 400, fontSize: scaleFont('clamp(32px, 9vw, 40px)', C.hs), lineHeight: 1.1, color: C.AZURE, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontSize: 14.5, color: C.SEA }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 320, fontSize: 15.5, color: C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: '#FFFFFF', border: `1px solid ${alpha(C.AZURE, 0.25)}`, borderRadius: 12,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
})
const btn = (C, on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 999,
  fontSize: 15, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.AZURE : 'transparent', color: on ? C.PLASTER : C.AZURE, border: `1.5px solid ${C.AZURE}`,
})

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function MediterraneanTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const serif = theme.fonts.heading
  const body = theme.fonts.body
  const T = TXT[lang] || TXT.az

  return (
    <PaletteContext.Provider value={C}>
      <div data-md data-enter={enterDirection(ID)} style={{
        backgroundColor: C.PLASTER,
        minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
        fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.AZURE, 0.2),
      }}>
        <style>{KEYFRAMES(C)}</style>
        {!inv.opened && <TileOpening inv={inv} theme={theme} />}

        <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.PLASTER, border: `2px solid ${C.AZURE}`, boxShadow: '0 8px 18px rgba(31,95,166,.2)' }}>
          {({ playing }) => <EqBars playing={playing} color={C.AZURE} idle={alpha(C.AZURE, 0.3)} />}
        </MusicFab>

        {inv.opened && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
            <header style={{
              position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: alpha(C.PLASTER, 0.9), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
              borderBottom: `1px solid ${alpha(C.AZURE, 0.15)}`,
            }}>
              <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
                <span aria-hidden="true">←</span>{tr.btn_back}
              </button>
              <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 19, color: C.AZURE }}>Digitoy</div>
              <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
            </header>

            {/* HERO — Riviera */}
            <section data-section="hero" style={{ position: 'relative' }}>
              <div style={{ position: 'relative', height: 'min(118vw, 520px)' }}>
                <Riviera />
                <LemonBranch width={170} style={{ position: 'absolute', left: -20, top: -6 }} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: '15%', textAlign: 'center', padding: '0 20px' }}>
                  <div style={{ fontStyle: 'italic', fontSize: 16, color: C.INK }}>{L('hero', 'kicker', inv.eventLabel)}</div>
                  <h1 style={{ margin: '8px 0 0', fontFamily: serif, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(42px, 13vw, 60px)', lineHeight: 1.02, color: C.AZURE, textWrap: 'balance', textShadow: '0 1px 0 rgba(255,255,255,.4)' }}>
                    {inv.heroTitle ? inv.heroTitle : inv.isCouple ? <>{inv.groom} <span style={{ color: C.TERRA }}>{inv.and}</span><br />{inv.bride}</> : inv.single}
                  </h1>
                </div>
              </div>
              <div style={{ height: 14, backgroundImage: `repeating-linear-gradient(90deg, ${C.AZURE} 0 18px, ${C.PLASTER} 18px 36px)` }} />
              <div style={{ padding: '28px 20px 10px', textAlign: 'center' }}>
                <div style={{ fontFamily: serif, fontSize: 24, color: C.INK }}>{inv.fullDate}</div>
                <div style={{ marginTop: 6, fontSize: 15.5, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
                {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 15, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
                <p style={{ margin: '18px auto 0', maxWidth: 320, fontStyle: 'italic', fontSize: 17, lineHeight: 1.55, color: C.SEA }}>{tr.inv_join}</p>
              </div>
            </section>

            {/* SAYĞAC — mayolika kaşıları */}
            {S.countdown && (
              <Terrace section="countdown" serif={serif} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(6px, 2.4vw, 12px)', maxWidth: 380, margin: '0 auto' }}>
                  {[
                    { v: cd.days, l: cd.labels.days },
                    { v: cd.hours, l: cd.labels.hours },
                    { v: cd.minutes, l: cd.labels.minutes },
                    { v: cd.seconds, l: cd.labels.seconds, pop: true },
                  ].map(({ v, l, pop }) => (
                    <div key={l} style={{ textAlign: 'center' }}>
                      <div style={{ position: 'relative', aspectRatio: '1', backgroundImage: TILE_A, backgroundSize: '100% 100%', boxShadow: `0 0 0 1px ${alpha(C.AZURE, 0.3)}, 0 10px 18px -10px rgba(31,95,166,.5)`, borderRadius: 3 }}>
                        <span style={{ position: 'absolute', inset: '24%', borderRadius: '50%', background: C.PLASTER, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 2px ${pop ? C.LEMON : C.AZURE}` }}>
                          <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(17px, 5vw, 22px)', color: C.AZURE, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                        </span>
                      </div>
                      <div style={{ marginTop: 8, fontSize: 13, color: C.MUTED }}>{l}</div>
                    </div>
                  ))}
                </div>
              </Terrace>
            )}

            <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

            {/* MƏKAN — qapaqlı pəncərə */}
            {S.venue && (
              <Terrace section="venue" serif={serif} tinted title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
                <div style={{ position: 'relative', margin: '0 auto', maxWidth: 360, display: 'grid', gridTemplateColumns: '18% 1fr 18%', alignItems: 'stretch' }}>
                  {[0, 2].map((pos) => (
                    <div key={pos} aria-hidden="true" style={{ gridColumn: pos + 1, gridRow: 1, background: `repeating-linear-gradient(180deg, #2C6AA8 0 9px, #1F5FA6 9px 12px, #174F8C 12px 14px)`, boxShadow: `inset 0 0 0 3px #174F8C`, transform: `perspective(400px) rotateY(${pos ? -28 : 28}deg)`, transformOrigin: pos ? 'left center' : 'right center', borderRadius: 2 }} />
                  ))}
                  <div style={{ gridColumn: 2, gridRow: 1, padding: 8, background: C.PLASTER, borderRadius: '999px 999px 2px 2px', boxShadow: '0 20px 30px -20px rgba(31,95,166,.6)' }}>
                    <div style={{ overflow: 'hidden', borderRadius: '999px 999px 2px 2px', border: `2px solid ${C.AZURE}` }}>
                      <MapSection
                        weddingData={weddingData} theme={theme} accent={C.TERRA} height="clamp(260px, 72vw, 330px)"
                        map={{ opacity: 0.85, filter: 'saturate(.7) contrast(.95)', tintOpacity: 0.15, tint: C.SEA, blend: 'multiply' }}
                        frame={<VillaPin />}
                        fallback={<div style={{ height: 'clamp(260px, 72vw, 330px)', position: 'relative', background: `linear-gradient(180deg, #CFE7F1, ${C.PLASTER} 60%, #F3E3C3)` }}><VillaPin /></div>}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: 24, fontFamily: serif, fontStyle: 'italic', fontSize: 27, lineHeight: 1.2, color: C.AZURE }}>{weddingData.venueName}</div>
                {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 15, color: C.MUTED }}>{weddingData.venueNote}</div>}
                <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={btn(C, true)}>{tr.inv_directions_btn}</a>}
                  {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={btn(C, !inv.dirUrl)}>Maps</a>}
                  {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(C, false)}>Waze</a>}
                  {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(C, false)}>Apple</a>}
                </div>
              </Terrace>
            )}

            {/* PROQRAM — limon budağı */}
            {S.program && (
              <Terrace section="program" serif={serif} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
                <ol style={{ listStyle: 'none', margin: '0 auto', padding: 0, maxWidth: 380 }}>
                  {timeline.events.map((ev, i) => (
                    <li key={i} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '64px 1fr', gap: 8, paddingBottom: 18 }}>
                      <svg aria-hidden="true" viewBox="0 0 64 100" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 0, width: 64, height: '100%' }}>
                        <path d={i % 2 ? 'M30 0C36 30 24 70 30 100' : 'M30 0C24 30 36 70 30 100'} fill="none" stroke="#6B5434" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
                      </svg>
                      <div style={{ position: 'relative', height: 44 }}>
                        <svg viewBox="0 0 64 44" width="64" height="44" aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                          <path d={i % 2 ? 'M30 10C20 2 8 2 2 8C10 14 22 14 30 10Z' : 'M31 10C41 2 53 2 60 8C52 14 40 14 31 10Z'} fill={i % 2 ? C.LEAF : '#6E9A4E'} />
                        </svg>
                        <Lemon size={34} rot={i % 2 ? 18 : -22} style={{ position: 'absolute', left: 14, top: 12 }} />
                      </div>
                      <div style={{ paddingTop: 6, minWidth: 0 }}>
                        <div style={{ fontSize: 14, letterSpacing: '.06em', color: C.TERRA, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                        <div style={{ marginTop: 3, fontFamily: serif, fontSize: 21, lineHeight: 1.25, color: C.INK }}>{ev.label}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </Terrace>
            )}

            {S.dresscode && (
              <Terrace section="dresscode" serif={serif} tinted title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
                <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={serif} align="center" italic />
              </Terrace>
            )}

            {/* MASA — keramika boşqab */}
            {S.seating && !seating.isEmpty && (
              <Terrace section="seating" serif={serif} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
                <input {...seatInputProps(inv, 'md-seat-list')} style={field(C)} />
                <SeatSuggest inv={inv} id="md-seat-list" c={{ bg: '#FFFFFF', border: `1px solid ${alpha(C.AZURE, 0.25)}`, active: alpha(C.AZURE, 0.08), text: C.INK, table: C.AZURE, radius: 12, font: body }} />
                {seating.showNotFound && <div style={{ marginTop: 12, fontSize: 15, color: C.MUTED, textAlign: 'center' }}>{tr.inv_seat_fullname}</div>}
                {seating.selected && (
                  <div style={{ marginTop: 28, textAlign: 'center', animation: 'md-rise .6s ease-out both' }}>
                    <div style={{ fontSize: 16, color: C.INK }}>{seating.selected.full_name}</div>
                    <div style={{ position: 'relative', width: 200, height: 200, margin: '14px auto 0', borderRadius: '50%', background: `radial-gradient(circle, #FFFFFF 54%, ${C.AZURE} 54.5%, ${C.AZURE} 56%, #FFFFFF 56.5%, #FFFFFF 62%, ${C.AZURE} 62.5%)`, boxShadow: '0 18px 30px -16px rgba(31,95,166,.6), inset 0 -4px 10px rgba(0,0,0,.08)' }}>
                      <svg viewBox="-100 -100 200 200" width="200" height="200" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
                        {Array.from({ length: 24 }, (_, k) => {
                          const a = (k / 24) * Math.PI * 2
                          return <circle key={k} cx={(Math.cos(a) * 84).toFixed(1)} cy={(Math.sin(a) * 84).toFixed(1)} r={k % 2 ? 3 : 5} fill={k % 2 ? C.LEMON : C.PLASTER} />
                        })}
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 12.5, letterSpacing: '.18em', color: C.SEA }}>{T.table}</span>
                        <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 58, lineHeight: 1, color: C.AZURE }}>{seating.selected.table_id}</span>
                      </div>
                    </div>
                    {seating.tablemates.length > 0 && <div style={{ marginTop: 16, fontSize: 15, color: C.MUTED, lineHeight: 1.6 }}>{seating.tablemates.map((g) => g.full_name).join(', ')}</div>}
                    <button onClick={seating.reset} data-press style={{ marginTop: 6, background: 'none', border: 'none', color: C.AZURE, fontSize: 15, minHeight: 44, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: body }}>
                      {seatingL.again || 'Yenidən axtar'}
                    </button>
                  </div>
                )}
              </Terrace>
            )}

            {/* FOTOLAR — poçt markaları */}
            {S.gallery && (
              <Terrace section="gallery" id="gallery-section" serif={serif} tinted title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
                {gallery.demoPhotos.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 30 }}>
                    {gallery.demoPhotos.map((url, i) => (
                      <div key={i} style={{ padding: 7, background: `radial-gradient(circle, ${C.SAND} 2.6px, transparent 3px) -4px -4px / 9px 9px, #FFFFFF`, boxShadow: '0 6px 12px -6px rgba(30,51,72,.35)', transform: `rotate(${[-2, 1.5, -1, 2, -1.5, 1][i % 6]}deg)` }}>
                        <div style={{ aspectRatio: '4 / 5', overflow: 'hidden', background: alpha(C.SEA, 0.2) }}>
                          <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', padding: 12, background: '#FFFFFF', borderRadius: 12, boxShadow: `0 0 0 2px ${C.AZURE}` }}>
                    <QRCodeSVG value={gallery.photoShareUrl} size={128} bgColor="#FFFFFF" fgColor={C.AZURE} level="M" />
                  </div>
                  <div style={{ marginTop: 14, fontSize: 14.5, color: C.MUTED }}>{tr.inv_scan_upload}</div>
                  <a data-press href={gallery.photoShareUrl} style={{ ...btn(C, true), marginTop: 16 }}>{tr.inv_gallery_btn}</a>
                  <p style={{ margin: '16px auto 0', maxWidth: 340, fontSize: 15, color: C.MUTED, lineHeight: 1.65 }}>{tr.inv_gallery_desc}</p>
                </div>
              </Terrace>
            )}

            {/* RSVP — poçt kartı */}
            {S.rsvp && (
              <Terrace section="rsvp" serif={serif} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
                <ReplyForm inv={inv} t={{ ink: C.INK, muted: C.MUTED, line: alpha(C.AZURE, 0.4), hair: alpha(C.AZURE, 0.14), accent: C.AZURE, font: body, display: serif, displayItalic: true, doneMark: <Lemon size={30} style={{ margin: '0 auto 8px' }} />, marker: (a) => (a ? <Lemon size={18} /> : <span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', border: `1.5px solid ${alpha(C.AZURE, 0.45)}` }} />), suggest: { bg: '#FFFFFF', border: `1px solid ${alpha(C.AZURE, 0.25)}`, active: alpha(C.AZURE, 0.08), text: C.INK, table: C.AZURE, radius: 12, font: body } }} />
              </Terrace>
            )}

            {/* DƏNİZDƏN MƏKTUBLAR */}
            {S.guestbook && (
              <Terrace section="guestbook" serif={serif} tinted title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
                <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 30 }}>
                  <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={field(C)} />
                  <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...field(C), resize: 'none', lineHeight: 1.5 }} />
                  <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...btn(C, gbook.canSubmit), width: '100%', opacity: gbook.canSubmit ? 1 : 0.5, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}>
                    {gbook.sending ? gbookL.sending : gbookL.btn}
                  </button>
                  {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 14, color: C.TERRA }}>⚠ {gbookL.error}</p>}
                </form>
                <div style={{ display: 'grid', gap: 16 }}>
                  {gbook.messages.map((raw, i) => {
                    const msg = gbook.readMessage(raw)
                    const stripe = [C.AZURE, C.TERRA, C.SEA][i % 3]
                    return (
                      <figure key={msg.name + i} style={{ margin: 0, background: '#FFFFFF', borderRadius: 4, overflow: 'hidden', boxShadow: '0 10px 20px -14px rgba(30,51,72,.45)' }}>
                        <div aria-hidden="true" style={{ height: 12, backgroundImage: `repeating-linear-gradient(90deg, ${stripe} 0 14px, #FFFFFF 14px 28px)` }} />
                        <div style={{ padding: '14px 16px 14px' }}>
                          <blockquote style={{ margin: 0, fontFamily: serif, fontStyle: 'italic', fontSize: 18, lineHeight: 1.5, color: C.INK }}>{msg.text}</blockquote>
                          <figcaption style={{ marginTop: 8, fontSize: 13.5, color: C.MUTED }}>{msg.name}{msg.date ? `, ${gbook.formatDate(msg.date)}` : ''}</figcaption>
                        </div>
                      </figure>
                    )
                  })}
                </div>
              </Terrace>
            )}

            <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={serif} />
          </motion.div>
        )}
      </div>
    </PaletteContext.Provider>
  )
}

function VillaPin() {
  const C = usePalette()
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -20, top: -20, width: 40, height: 40, borderRadius: '50%', background: C.PLASTER, boxShadow: `0 0 0 2px ${C.AZURE}, 0 8px 16px rgba(30,51,72,.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Lemon size={26} />
      </span>
    </span>
  )
}
