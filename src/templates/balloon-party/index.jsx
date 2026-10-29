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
import { ageSentence, kidsGalleryDesc, tableNum, tableSize } from '../_shared/kids'
import { C, FOIL, ROSE_FOIL, BUNCH, letterSize } from './palette'
import { LABELS, TXT } from './copy'
import { Balloon, Confetti, Garland, CandyJar, GumballMachine, Candle } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   BALLOON PARTY — «Şar və şirniyyat bayramı» (Uşaq ad günü konsepti, 2026-10)

   Konsept: pastel şirniyyat dükanı və şar dəstəsi — müasir uşaq bayramı
   dekorunun dili. Açılış — parlaq şar dəstəsi, düyündən asılan hədiyyə
   etiketində ad. Toxunanda şarlar hərəsi öz sürəti ilə göyə uçur. Daxildə:
     hero      → şar girləndi, ad folqa şar hərfləri ilə, yaş nəhəng folqa rəqəm
     sayğac    → dörd konfet bankası
     məkan     → şar sancağı ilə xəritə
     proqram   → qatlı ad günü tortu: hər qat bir hadisə, üstündə şamlar
     masa      → saqqız avtomatı: masa nömrəsi saqqız topunda düşür
     fotolar   → ipdən asılan polaroidlər
     arzular   → arzu şarları
   Şriftlər: M PLUS Rounded 1c (başlıq və mətn) · Pacifico (yazı) — ikisində də Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('balloon-party')
const ID = 'balloon-party'
const SCRIPT = "'Pacifico', 'Great Vibes', cursive"

const KEYFRAMES = `
@keyframes bp-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
@keyframes bp-sway { 0%,100% { transform: rotate(-2deg) } 50% { transform: rotate(2deg) } }
@keyframes bp-flame { from { transform: scaleY(.85) } to { transform: scaleY(1.12) } }
@keyframes bp-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes bp-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes bp-hint { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
@keyframes bp-drop { 0% { transform: translateY(-70px) scale(.4); opacity: 0 } 55% { transform: translateY(8px) scale(1.04); opacity: 1 } 75% { transform: translateY(-6px) } 100% { transform: none } }
@keyframes bp-pop { 0% { transform: scale(.4); opacity: 0 } 70% { transform: scale(1.06) } 100% { transform: scale(1); opacity: 1 } }
@keyframes bp-tag { to { transform: translateY(40px) rotate(12deg); opacity: 0 } }
[data-bp] span[aria-hidden="true"], [data-bp] svg[aria-hidden="true"], [data-bp] div[aria-hidden="true"] { pointer-events: none; }
[data-bp] ::placeholder { color: rgba(125,100,121,.6); }
[data-bp] input:focus-visible, [data-bp] textarea:focus-visible { border-color: ${C.PINK} !important; outline: none; }
[data-bp] button:focus-visible, [data-bp] a:focus-visible, [data-bp] [role="button"]:focus-visible { outline: 2px solid ${C.PINK_D}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-bp] *, [data-bp] { animation: none !important; transition: none !important; } }
`

const foilText = (grad) => ({
  backgroundImage: grad, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent',
})

/* Folqa şar hərfləri */
function FoilLetters({ text, disp, size }) {
  const chars = Array.from(String(text || ''))
  return (
    <h1 aria-label={text} style={{ margin: '6px 0 0', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-end', gap: '0 .03em', fontFamily: disp, fontWeight: 900, fontSize: size, lineHeight: 1.08 }}>
      {chars.map((ch, i) => (ch === ' '
        ? <span key={i} aria-hidden="true" style={{ width: '.28em' }} />
        : (
          <span key={i} aria-hidden="true" style={{ position: 'relative', display: 'inline-block', paddingBottom: '.06em', animation: `bp-bob ${2.4 + (i % 3) * 0.4}s ease-in-out ${(i * 0.17).toFixed(2)}s infinite` }}>
            <span style={{ ...foilText(i % 2 ? ROSE_FOIL : FOIL), display: 'inline-block', transform: `rotate(${i % 2 ? 4 : -4}deg)`, WebkitTextStroke: '1px rgba(150,100,40,.22)', filter: 'drop-shadow(0 6px 6px rgba(150,90,40,.22))' }}>{ch}</span>
          </span>
        )))}
    </h1>
  )
}

/* ═══ 01 — AÇILIŞ: şar dəstəsi ═══ */
function BalloonOpening({ inv, theme }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const disp = theme.fonts.heading
  const go = gate.opening
  const KX = 150, KY = 262 /* düyün */
  return (
    <motion.div {...gate.gateProps} data-bp
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: `linear-gradient(180deg, ${C.CREAM} 0%, #FCE6EC 62%, #F6D3DD 100%)`, color: C.PLUM, fontFamily: theme.fonts.body }}>
      <Confetti opacity={0.55} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
        <div style={{ position: 'relative', width: 'min(86vw, 330px)' }}>
          {/* şar dəstəsi */}
          <div style={{ transformOrigin: `${(KX / 300) * 100}% ${(KY / 300) * 100}%`, animation: go ? 'none' : 'bp-sway 5s ease-in-out infinite' }}>
            <svg viewBox="0 0 300 300" width="100%" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
              {BUNCH.map((b, i) => {
                const cx = KX + b.x, cy = KY + b.y - 70
                const r = 32 * b.s
                const fill = b.c === 'gold' ? 'url(#bp-o-gold)' : b.c === 'rose' ? 'url(#bp-o-rose)' : `url(#bp-o-${i})`
                return (
                  <g key={i} style={{ transform: go ? `translate(${b.sway * 3}px, -760px) rotate(${b.sway}deg)` : 'none', transformOrigin: `${cx}px ${cy}px`, transition: `transform ${1.5 + b.d}s cubic-bezier(.45,0,.75,.45) ${b.d}s` }}>
                    <defs>
                      <radialGradient id={`bp-o-${i}`} cx="35%" cy="28%" r="78%"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".3" stopColor={b.c.startsWith('#') ? b.c : '#FFFFFF'} /><stop offset="1" stopColor={b.c.startsWith('#') ? b.c : '#FFFFFF'} stopOpacity=".85" /></radialGradient>
                    </defs>
                    <path d={`M${cx} ${cy + r * 1.08}Q${(cx + KX) / 2 + b.sway} ${(cy + KY) / 2} ${KX} ${KY}`} fill="none" stroke="rgba(74,48,70,.4)" strokeWidth="1" />
                    <path transform={`translate(${cx} ${cy}) scale(${(r / 30).toFixed(3)})`} d="M0 -36C18 -36 28 -20 28 -4C28 16 12 30 2 33L4.5 38H-4.5L-2 33C-12 30 -28 16 -28 -4C-28 -20 -18 -36 0 -36Z" fill={fill} />
                    <ellipse cx={cx - r * 0.33} cy={cy - r * 0.62} rx={r * 0.2} ry={r * 0.33} transform={`rotate(28 ${cx - r * 0.33} ${cy - r * 0.62})`} fill="#FFFFFF" opacity=".6" />
                  </g>
                )
              })}
              <defs>
                <radialGradient id="bp-o-gold" cx="35%" cy="28%" r="78%"><stop offset="0" stopColor="#FFF4D6" /><stop offset=".3" stopColor="#F2CF7E" /><stop offset=".75" stopColor="#C9913A" /><stop offset="1" stopColor="#B9822F" /></radialGradient>
                <radialGradient id="bp-o-rose" cx="35%" cy="28%" r="78%"><stop offset="0" stopColor="#FFE9E3" /><stop offset=".3" stopColor="#F3B9AA" /><stop offset=".75" stopColor="#C9786A" /><stop offset="1" stopColor="#B5685C" /></radialGradient>
              </defs>
              {/* fiyonq */}
              <g style={{ opacity: go ? 0 : 1, transition: 'opacity .3s ease .2s' }}>
                <path d={`M${KX} ${KY}c-14 -10 -24 -2 -18 6c4 5 12 2 18 -6zM${KX} ${KY}c14 -10 24 -2 18 6c-4 5 -12 2 -18 -6z`} fill={C.PINK_D} />
                <circle cx={KX} cy={KY} r="4" fill={C.PINK_D} />
                <path d={`M${KX} ${KY}l-6 22M${KX} ${KY}l7 20`} stroke={C.PINK_D} strokeWidth="2.4" strokeLinecap="round" />
              </g>
            </svg>
          </div>

          {/* hədiyyə etiketi */}
          <div style={{ position: 'relative', margin: '-8px auto 0', width: 'min(74vw, 280px)', animation: go ? 'bp-tag .6s ease-in .15s both' : 'bp-rise .9s ease-out .3s both' }}>
            <div style={{ position: 'relative', padding: '26px 18px 20px', textAlign: 'center', background: '#FFFFFF', borderRadius: 22, boxShadow: `0 0 0 2px ${C.BLUSH}, 0 18px 34px -16px rgba(201,87,124,.45)` }}>
              <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 10, marginLeft: -6, width: 12, height: 12, borderRadius: '50%', background: C.CREAM, boxShadow: `inset 0 0 0 2px ${C.BLUSH}` }} />
              <EmblemSlot mono={ot.mono} size={50} border={`2px solid ${C.BLUSH}`} background={C.CREAM} color={C.PINK_D} font={disp} style={{ animation: 'none', margin: '6px auto 8px' }}>
                <Balloon size={20} color="gold" string={10} style={{ margin: '2px auto 6px' }} />
              </EmblemSlot>
              {ot.show('kicker') && <div style={{ fontFamily: SCRIPT, fontSize: 20, color: C.PINK_D }}>{ot.text('kicker')}</div>}
              {titleOv !== '' && (
                <div style={{ marginTop: 4, fontFamily: disp, fontWeight: 900, fontSize: 'clamp(34px, 11vw, 46px)', lineHeight: 1.05, color: C.PLUM, overflowWrap: 'anywhere' }}>
                  {first}{second && <><span style={{ display: 'block', fontSize: '.45em', color: C.PINK, margin: '2px 0' }}>{ot.text('and')}</span>{second}</>}
                </div>
              )}
              {ot.show('meta') && <div style={{ marginTop: 8, fontSize: 14.5, color: C.MUTED }}>{ot.text('meta')}</div>}
            </div>
          </div>
        </div>

        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ textAlign: 'center', marginTop: 26 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 28px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: C.PINK_D, color: '#FFFFFF', fontFamily: disp, fontWeight: 800, fontSize: 16, boxShadow: `0 0 0 5px ${alpha(C.PINK, 0.25)}, 0 14px 26px -8px rgba(201,87,124,.6)`, animation: 'bp-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 10, fontSize: 13.5, color: C.MUTED, animation: 'bp-fade .8s ease-out 1.1s both, bp-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Party({ id, section, title, kicker, sub, children, disp, tint }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '60px 20px 66px', background: tint || C.CREAM, overflow: 'hidden' }}>
      <Confetti opacity={0.22} count={14} />
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 2, marginBottom: 8 }}>
              <Balloon size={18} color={C.PINK} string={12} />
              <Balloon size={24} color="gold" string={14} />
              <Balloon size={18} color={C.MINT_D} string={12} />
            </div>
            {title && <h2 style={{ margin: 0, fontFamily: disp, fontWeight: 800, fontSize: 'clamp(28px, 8vw, 36px)', lineHeight: 1.12, color: C.PLUM, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontSize: 15.5, color: C.MUTED }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 330, fontSize: 15.5, color: C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: '#FFFFFF', border: `2px solid ${alpha(C.PINK, 0.3)}`, borderRadius: 18,
  padding: '13px 16px', fontSize: 16, color: C.PLUM, outline: 'none',
}
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 999,
  fontSize: 15.5, fontWeight: 700, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.PINK_D : '#FFFFFF', color: on ? '#FFFFFF' : C.PINK_D, border: `2px solid ${on ? C.PINK_D : alpha(C.PINK_D, 0.45)}`,
})
const suggest = { bg: '#FFFFFF', border: `2px solid ${alpha(C.PINK, 0.25)}`, active: alpha(C.BLUSH, 0.35), text: C.PLUM, table: C.PINK_D, radius: 18 }

const TIERS = [
  { bg: C.BLUSH, frost: C.CREAM, ink: C.PINK_D },
  { bg: C.MINT, frost: '#FFFFFF', ink: '#3F8E78' },
  { bg: C.LEMON, frost: '#FFFFFF', ink: '#A87410' },
  { bg: C.LILAC, frost: '#FFFFFF', ink: '#6C55A8' },
]

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function BalloonPartyTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const disp = theme.fonts.heading
  const body = theme.fonts.body
  const script = SCRIPT
  const T = inv.copy(TXT)
  const age = inv.age
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const candles = Math.min(age || 3, 9)

  return (
    <div data-bp lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.CREAM,
      minHeight: '100vh', fontFamily: body, color: C.PLUM, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.PINK, 0.25),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <BalloonOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.PINK_D, border: '3px solid #FFFFFF', boxShadow: '0 8px 18px rgba(201,87,124,.35)' }}>
        {({ playing }) => <EqBars playing={playing} color="#FFFFFF" idle={alpha('#FFFFFF', 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.CREAM, 0.92), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.PINK, 0.25)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: script, fontSize: 19, color: C.PINK_D }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — şar girləndi və folqa hərflər */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: `linear-gradient(180deg, ${C.CREAM}, #FCEAF0)`, paddingBottom: 34 }}>
            <Confetti opacity={0.4} />
            <Garland />
            <div style={{ position: 'relative', textAlign: 'center', padding: '4px 16px 0' }}>
              <div style={{ fontFamily: script, fontSize: 24, color: C.PINK_D, animation: 'bp-rise .8s ease-out .2s both' }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              <FoilLetters text={heroName} disp={disp} size={letterSize(heroName)} />
              {age && <div style={{ marginTop: 4, fontWeight: 700, fontSize: 17, color: C.MUTED }}>{ageSentence(age, lang)}</div>}
            </div>

            {/* yaş — nəhəng folqa rəqəm, yanında şarlar */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 4, marginTop: 14, height: age ? 210 : 150 }}>
              <Balloon size={62} color={C.PINK} string={70} style={{ transform: 'rotate(-12deg)', animation: 'bp-bob 3s ease-in-out infinite' }} />
              {age ? (
                <div aria-hidden="true" style={{ position: 'relative', animation: 'bp-bob 3.4s ease-in-out .4s infinite' }}>
                  <span style={{ ...foilText(FOIL), display: 'block', fontFamily: disp, fontWeight: 900, fontSize: age > 9 ? 128 : 170, lineHeight: 0.9, WebkitTextStroke: '1.5px rgba(150,100,40,.25)', filter: 'drop-shadow(0 10px 10px rgba(150,90,40,.25))' }}>{age}</span>
                  <span style={{ position: 'absolute', left: '50%', top: '96%', width: 1.2, height: 34, background: alpha(C.GOLD_D, 0.6) }} />
                </div>
              ) : (
                <Balloon size={80} color="gold" string={60} style={{ animation: 'bp-bob 3.4s ease-in-out .4s infinite' }} />
              )}
              <Balloon size={56} color={C.MINT_D} string={80} style={{ transform: 'rotate(10deg)', animation: 'bp-bob 3.2s ease-in-out .8s infinite' }} />
            </div>

            <div style={{ position: 'relative', textAlign: 'center', padding: '26px 22px 0' }}>
              <div style={{ display: 'inline-block', padding: '10px 22px', borderRadius: 999, background: '#FFFFFF', boxShadow: `0 0 0 2px ${C.BLUSH}`, fontWeight: 800, fontSize: 'clamp(17px, 4.8vw, 20px)', color: C.PLUM }}>{inv.fullDate}</div>
              <div style={{ marginTop: 10, fontSize: 16.5, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 15, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              <p style={{ margin: '16px auto 0', maxWidth: 330, fontSize: 16.5, lineHeight: 1.6, color: C.MUTED }}>{tr.inv_join}</p>
            </div>
          </section>

          {/* SAYĞAC — konfet bankaları */}
          {S.countdown && (
            <Party section="countdown" disp={disp} tint="#FDF0F3" title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 380, margin: '0 auto' }}>
                {[
                  { v: cd.days, l: cd.labels.days, c: ['#EF8FA8', '#FFE495', '#F6C3CF'], lid: C.PINK_D },
                  { v: cd.hours, l: cd.labels.hours, c: ['#7FC8B0', '#BDE8D7', '#FFFFFF'], lid: '#3F8E78' },
                  { v: cd.minutes, l: cd.labels.minutes, c: ['#D6C5F3', '#BFDCF6', '#EF8FA8'], lid: '#6C55A8' },
                  { v: cd.seconds, l: cd.labels.seconds, c: ['#FFE495', '#EF8FA8', '#7FC8B0'], lid: '#C9913A', pop: true },
                ].map(({ v, l, c, lid, pop }) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <CandyJar candies={c} lid={lid}>
                      <span style={{ display: 'block', minWidth: '100%', padding: '6px 2px', borderRadius: 10, background: '#FFFFFF', boxShadow: '0 2px 6px rgba(74,48,70,.15)', fontFamily: disp, fontWeight: 800, fontSize: 'clamp(18px, 5.8vw, 24px)', lineHeight: 1, color: C.PLUM, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                    </CandyJar>
                    <div style={{ marginTop: 6, fontWeight: 700, fontSize: 12.5, color: C.MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
            </Party>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Party section="venue" disp={disp} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ position: 'relative', maxWidth: 420, margin: '0 auto', padding: 10, background: '#FFFFFF', borderRadius: 30, outline: `3px dashed ${alpha(C.PINK, 0.55)}`, outlineOffset: 6, boxShadow: '0 20px 34px -24px rgba(201,87,124,.6)' }}>
                <div style={{ borderRadius: 22, overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.PINK_D} height="clamp(250px, 70vw, 320px)"
                    map={{ opacity: 0.9, filter: 'saturate(.75) brightness(1.04)', tintOpacity: 0.12, tint: C.PINK, blend: 'multiply' }}
                    frame={<BalloonPin />}
                    fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: `radial-gradient(circle at 30% 30%, ${alpha(C.MINT, 0.7)}, transparent 40%), radial-gradient(circle at 70% 70%, ${alpha(C.BLUSH, 0.8)}, transparent 42%), ${C.CREAM}` }}><BalloonPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: disp, fontWeight: 800, fontSize: 24, lineHeight: 1.2, color: C.PLUM }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 15.5, color: C.MUTED }}>{weddingData.venueNote}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={btn(true)}>{tr.inv_directions_btn}</a>}
                {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={btn(!inv.dirUrl)}>Maps</a>}
                {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Waze</a>}
                {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Apple</a>}
              </div>
            </Party>
          )}

          {/* PROQRAM — qatlı tort */}
          {S.program && (
            <Party section="program" disp={disp} tint="#FDF0F3" title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div aria-hidden="true" style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: -2 }}>
                  {Array.from({ length: candles }, (_, k) => <Candle key={k} color={[C.MINT_D, C.PINK, '#C9913A', '#9D85D8'][k % 4]} h={26} />)}
                </div>
                {timeline.events.map((ev, i) => {
                  const t = TIERS[i % TIERS.length]
                  const w = Math.min(100, 62 + i * 8)
                  return (
                    <div key={i} style={{ position: 'relative', width: `${w}%`, padding: '22px 14px 14px', marginTop: i ? -1 : 0, textAlign: 'center', background: t.bg, borderRadius: i === 0 ? '20px 20px 8px 8px' : 8, boxShadow: 'inset 0 -6px 0 rgba(0,0,0,.05)' }}>
                      <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 16, borderRadius: i === 0 ? '20px 20px 0 0' : '8px 8px 0 0', background: `radial-gradient(circle at 10px 0, ${t.frost} 10px, transparent 11px) 0 0 / 20px 16px repeat-x, linear-gradient(${t.frost}, ${t.frost}) 0 0 / 100% 5px no-repeat` }} />
                      <div style={{ fontFamily: disp, fontWeight: 800, fontSize: 14.5, color: t.ink, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                      <div style={{ marginTop: 2, fontSize: 17.5, fontWeight: 500, lineHeight: 1.3, color: C.PLUM }}>{ev.label}</div>
                    </div>
                  )
                })}
                <div aria-hidden="true" style={{ width: '108%', height: 16, marginTop: 2, borderRadius: 999, background: 'linear-gradient(180deg, #FFFFFF, #EADDE6)', boxShadow: '0 10px 18px -10px rgba(74,48,70,.4)' }} />
              </div>
            </Party>
          )}

          {S.dresscode && (
            <Party section="dresscode" disp={disp} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={disp} align="center" />
            </Party>
          )}

          {/* MASA — saqqız avtomatı */}
          {S.seating && !seating.isEmpty && (
            <Party section="seating" disp={disp} tint="#FDF0F3" title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <input {...seatInputProps(inv, 'bp-seat-list')} style={field} />
              <SeatSuggest inv={inv} id="bp-seat-list" c={{ ...suggest, font: body }} />
              {seating.showNotFound && <div style={{ marginTop: 12, fontSize: 15, color: C.MUTED, textAlign: 'center' }}>{tr.inv_seat_fullname}</div>}
              {seating.selected && (
                <div key={seating.selected.full_name} style={{ marginTop: 24, textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 17, color: C.PLUM, marginBottom: 12 }}>{seating.selected.full_name}</div>
                  <GumballMachine width={170}>
                    <div style={{ position: 'absolute', left: '50%', bottom: -74, marginLeft: 4, width: 92, height: 92, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #FFFFFF, ${C.PINK} 32%, ${C.PINK_D})`, boxShadow: '0 12px 20px -8px rgba(201,87,124,.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'bp-drop .8s cubic-bezier(.3,.8,.4,1) .2s both' }}>
                      <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: '.1em', color: '#FFFFFF' }}>{T.table}</span>
                      <span style={{ fontFamily: disp, fontWeight: 900, fontSize: tableSize(tableNum(seating.selected.table_id), 40), lineHeight: 1, color: '#FFFFFF' }}>{tableNum(seating.selected.table_id)}</span>
                    </div>
                  </GumballMachine>
                  <div style={{ height: 84 }} />
                  {seating.tablemates.length > 0 && <div style={{ marginTop: 6, fontSize: 15.5, color: C.MUTED, lineHeight: 1.6 }}>{seating.tablemates.map((g) => g.full_name).join(', ')}</div>}
                  <button onClick={seating.reset} data-press style={{ marginTop: 6, background: 'none', border: 'none', color: C.PINK_D, fontWeight: 700, fontSize: 15.5, minHeight: 44, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: body }}>
                    {seatingL.again || 'Yenidən axtar'}
                  </button>
                </div>
              )}
            </Party>
          )}

          {/* FOTOLAR — ipdən asılan polaroidlər */}
          {S.gallery && (
            <Party section="gallery" id="gallery-section" disp={disp} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ position: 'relative', marginBottom: 30 }}>
                  <svg aria-hidden="true" viewBox="0 0 400 40" preserveAspectRatio="none" style={{ position: 'absolute', left: -10, right: -10, top: -6, width: 'calc(100% + 20px)', height: 40 }}>
                    <path d="M0 6Q200 46 400 6" fill="none" stroke={alpha(C.PLUM, 0.35)} strokeWidth="1.4" />
                  </svg>
                  <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, paddingTop: 10 }}>
                    {gallery.demoPhotos.map((url, i) => (
                      <div key={i} style={{ aspectRatio: '4 / 5.2', overflow: 'hidden', background: C.BLUSH, border: '7px solid #FFFFFF', borderBottomWidth: 24, transform: `rotate(${[-4, 2, -2, 3, -3, 1][i % 6]}deg) translateY(${i % 3 === 1 ? 14 : 0}px)`, boxShadow: '0 12px 20px -10px rgba(74,48,70,.4)' }}>
                        <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: 12, background: '#FFFFFF', borderRadius: 22, boxShadow: `0 0 0 3px ${C.BLUSH}, 0 12px 24px -12px rgba(201,87,124,.5)` }}>
                  <QRCodeSVG value={gallery.photoShareUrl} size={126} bgColor="#FFFFFF" fgColor={C.PLUM} level="M" />
                </div>
                <div style={{ marginTop: 16, fontSize: 15, color: C.MUTED }}>{tr.inv_scan_upload}</div>
                <a data-press href={gallery.photoShareUrl} style={{ ...btn(true), marginTop: 16 }}>{tr.inv_gallery_btn}</a>
                <p style={{ margin: '16px auto 0', maxWidth: 340, fontSize: 15.5, color: C.MUTED, lineHeight: 1.65 }}>{kidsGalleryDesc(props.adminOverrides, tr, lang)}</p>
              </div>
            </Party>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Party section="rsvp" disp={disp} tint="#FDF0F3" title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.PLUM, muted: C.MUTED, line: alpha(C.PINK_D, 0.45), hair: alpha(C.PINK, 0.25), accent: C.PINK_D,
                font: body, display: disp, btnFont: disp,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 8 }}><Balloon size={26} color={C.PINK} string={18} /><Balloon size={32} color="gold" string={20} /></div>,
                marker: (a) => (a ? <Balloon size={14} color={C.PINK} string={0} /> : <span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', border: `2px solid ${alpha(C.PINK_D, 0.45)}` }} />),
                suggest: { ...suggest, font: body },
              }} />
            </Party>
          )}

          {/* ARZU ŞARLARI */}
          {S.guestbook && (
            <Party section="guestbook" disp={disp} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 30 }}>
                <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={field} />
                <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...field, resize: 'none', lineHeight: 1.5 }} />
                <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...btn(gbook.canSubmit), width: '100%', opacity: gbook.canSubmit ? 1 : 0.55, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}>
                  {gbook.sending ? gbookL.sending : gbookL.btn}
                </button>
                {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 14, color: C.PINK_D }}>⚠ {gbookL.error}</p>}
              </form>
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  const col = [C.PINK, C.MINT_D, '#E2B23A', '#9D85D8'][i % 4]
                  const bg = ['#FDE7EC', '#E6F6EF', '#FFF6D8', '#EFE8FB'][i % 4]
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, display: 'grid', gridTemplateColumns: '36px minmax(0, 1fr)', gap: 12, alignItems: 'start', padding: '14px 16px', borderRadius: 24, background: bg }}>
                      <Balloon size={30} color={col} string={18} style={{ marginTop: 2 }} />
                      <div>
                        <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.55, color: C.PLUM }}>{msg.text}</blockquote>
                        <figcaption style={{ marginTop: 6, fontWeight: 800, fontSize: 14, color: C.PINK_D }}>{msg.name}{msg.date ? <span style={{ fontWeight: 400, color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}</figcaption>
                      </div>
                    </figure>
                  )
                })}
              </div>
            </Party>
          )}

          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={disp} />
        </motion.div>
      )}
    </div>
  )
}

function BalloonPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -21, top: -96, animation: 'bp-bob 3s ease-in-out infinite' }}>
        <Balloon size={42} color={C.PINK} string={50} id="bp-pin" />
      </span>
      <span style={{ position: 'absolute', left: -4, top: -4, width: 8, height: 8, borderRadius: '50%', background: C.PINK_D, boxShadow: '0 0 0 3px #FFFFFF' }} />
    </span>
  )
}
