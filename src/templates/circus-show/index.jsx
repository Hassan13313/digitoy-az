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
import { ageSentence, ageWord, kidsGalleryDesc, tableNum, tableSize } from '../_shared/kids'
import { C, CONFETTI, nameSize } from './palette'
import { Star, Bunting, StringLights, Tent, Drum, Starburst, TopHat, Hoop, Pedestal } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   CIRCUS SHOW — «Böyük sirk şousu» (Uşaq ad günü konsepti, 2026-10)

   Konsept: köhnə sirk afişası. Açılış — gecə, lampa girləndi altında
   zolaqlı çadır və nağara. Toxunanda nağara döyülür, iki projektor çadıra
   tuşlanır, giriş pərdələri yığılır, içəridən işıq düşür və konfetti
   partlayır. Daxildə:
     hero      → afişa: bayraqcıqlar, qövs lentdə «Böyük şou», Oi şriftində ad,
                 ulduz partlayışında yaş, çadır
     sayğac    → dörd nağara postamenti
     məkan     → sirk arenasının zolaqlı kənarında dairəvi xəritə
     proqram   → köhnə proqram vərəqi (playbill): nömrə-nömrə çıxışlar
     masa      → zolaqlı halqa
     fotolar   → afişa divarı
     arzular   → alqış kartları
   Şriftlər: Oi (ad, iri rəqəmlər) · Podkova (başlıq və mətn) — ikisində də Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('circus-show')
const ID = 'circus-show'

const LABELS = {
  countdown: { title: { az: 'Şouya qədər', en: 'Until showtime', ru: 'До начала шоу' } },
  venue:     { title: { az: 'Çadır burada', en: 'Find the big top', ru: 'Где наш шатёр' } },
  program:   { title: { az: 'Şou proqramı', en: 'Tonight’s acts', ru: 'Программа шоу' } },
  dresscode: { title: { az: 'Şou geyimi', en: 'Showtime attire', ru: 'Наряд для шоу' } },
  seating:   { title: { az: 'Arenada yeriniz', en: 'Your seat by the ring', ru: 'Ваше место у арены' } },
  gallery:   { title: { az: 'Afişa divarı', en: 'The poster wall', ru: 'Стена афиш' } },
  rsvp:      { title: { az: 'Şouya gələcəksiniz?', en: 'Coming to the show?', ru: 'Придёте на шоу?' } },
  guestbook: { title: { az: 'Alqışlar', en: 'Applause', ru: 'Аплодисменты' } },
}
const TXT = {
  az: { bigShow: 'Böyük şou', act: 'Nömrə', table: 'Masa', bravo: 'Bravo!', tonight: 'Yalnız bir gün!' },
  en: { bigShow: 'The big show', act: 'Act', table: 'Table', bravo: 'Bravo!', tonight: 'One day only!' },
  ru: { bigShow: 'Большое шоу', act: 'Номер', table: 'Стол', bravo: 'Браво!', tonight: 'Только один день!' },
}

const KEYFRAMES = `
@keyframes cs-bulb { 0%,100% { opacity: .15 } 50% { opacity: .55 } }
@keyframes cs-flag { 0%,100% { transform: skewY(0) scaleX(1) } 50% { transform: skewY(-8deg) scaleX(.86) } }
@keyframes cs-spin { to { transform: rotate(360deg) } }
@keyframes cs-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes cs-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes cs-hint { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
@keyframes cs-drum { 0%,100% { transform: translateY(0) scale(1) } 30% { transform: translateY(3px) scale(1.06,.94) } 60% { transform: translateY(-2px) scale(.98,1.03) } }
@keyframes cs-confetti { from { transform: translate(0,0) rotate(0); opacity: 1 } to { transform: translate(var(--dx), var(--dy)) rotate(var(--r)); opacity: 0 } }
@keyframes cs-wobble { 0%,100% { transform: rotate(-8deg) } 50% { transform: rotate(-3deg) scale(1.04) } }
@keyframes cs-pop { 0% { transform: scale(.4); opacity: 0 } 70% { transform: scale(1.08) } 100% { transform: scale(1); opacity: 1 } }
[data-cs] span[aria-hidden="true"], [data-cs] svg[aria-hidden="true"], [data-cs] div[aria-hidden="true"] { pointer-events: none; }
[data-cs] ::placeholder { color: rgba(106,85,70,.6); }
[data-cs] input:focus-visible, [data-cs] textarea:focus-visible { border-color: ${C.RED} !important; outline: none; }
[data-cs] button:focus-visible, [data-cs] a:focus-visible, [data-cs] [role="button"]:focus-visible { outline: 2px solid ${C.NAVY}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-cs] *, [data-cs] { animation: none !important; transition: none !important; } }
`

const PAPER_TEX = `radial-gradient(rgba(120,80,40,.07) 1px, transparent 1.3px) 0 0 / 7px 7px, radial-gradient(rgba(120,80,40,.05) 1px, transparent 1.3px) 3px 4px / 11px 11px, ${C.PAPER}`
const up = (s, lang) => String(s || '').toLocaleUpperCase(lang === 'az' ? 'az' : lang === 'ru' ? 'ru' : 'en')

/* ═══ 01 — AÇILIŞ: çadır, nağara, projektorlar ═══ */
function BigTopOpening({ inv, theme }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const disp = theme.fonts.heading
  const body = theme.fonts.body
  const go = gate.opening
  const beam = (side) => ({
    position: 'absolute', bottom: -40, [side]: '-12%', width: '46%', height: '115%',
    transformOrigin: '50% 100%', background: `linear-gradient(0deg, ${alpha('#FFF1C2', 0.55)}, ${alpha('#FFF1C2', 0)} 85%)`,
    clipPath: 'polygon(42% 100%, 58% 100%, 100% 0, 0 0)', mixBlendMode: 'screen',
    transform: go ? `rotate(${side === 'left' ? 24 : -24}deg)` : `rotate(${side === 'left' ? -30 : 30}deg)`,
    opacity: go ? 1 : 0, transition: 'transform .9s cubic-bezier(.3,.9,.3,1) .25s, opacity .3s ease .25s',
  })
  return (
    <motion.div {...gate.gateProps} data-cs
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: `radial-gradient(120% 70% at 50% 62%, #2A3A78, ${C.NAVY} 45%, ${C.NAVY_D})`, color: C.CREAM, fontFamily: body }}>
      <StringLights count={13} style={{ position: 'absolute', top: '3%', left: 0, right: 0 }} />
      <div aria-hidden="true" style={beam('left')} />
      <div aria-hidden="true" style={beam('right')} />

      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', padding: 'max(9vh, 64px) 20px max(4vh, 24px)', textAlign: 'center' }}>
        <motion.div animate={go ? { opacity: 0, y: -14 } : {}} transition={{ duration: 0.35, delay: 0.15 }}>
          {ot.show('kicker') && <div style={{ fontFamily: body, fontWeight: 800, fontSize: 14, letterSpacing: '.18em', color: C.MUSTARD, animation: 'cs-rise .8s ease-out .2s both' }}>{up(ot.text('kicker'), inv.lang)}</div>}
          {ot.show('sub') && ot.text('sub') && (
            <div style={{ display: 'inline-block', marginTop: 10, padding: '5px 16px', background: C.RED, color: C.CREAM, fontFamily: body, fontWeight: 700, fontSize: 13, letterSpacing: '.12em', clipPath: 'polygon(0 0, 100% 0, 94% 50%, 100% 100%, 0 100%, 6% 50%)', animation: 'cs-rise .8s ease-out .3s both' }}>
              {up(ot.text('sub'), inv.lang)}
            </div>
          )}
          {titleOv !== '' && (
            <div style={{ marginTop: 12, fontFamily: disp, fontSize: nameSize(first + second), lineHeight: 1.02, color: C.CREAM, textShadow: `3px 4px 0 ${C.RED}, 6px 8px 0 ${alpha('#000', 0.25)}`, overflowWrap: 'anywhere', animation: 'cs-pop .8s cubic-bezier(.2,.9,.3,1.3) .45s both' }}>
              {first}{second && <><span style={{ display: 'block', fontSize: '.45em', color: C.MUSTARD, textShadow: 'none', margin: '4px 0' }}>&amp;</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 12, fontFamily: body, fontWeight: 600, fontSize: 15, letterSpacing: '.06em', color: alpha(C.CREAM, 0.85), animation: 'cs-rise .8s ease-out .6s both' }}>{ot.text('meta')}</div>}
        </motion.div>

        <div style={{ position: 'relative', width: 'min(78vw, 34vh, 330px)', marginTop: 10 }}>
          <Tent width={330} open={go} glow={go} style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 18px 24px rgba(0,0,0,.45))' }} />
          {go && CONFETTI.map((p, i) => (
            <span key={i} aria-hidden="true" style={{
              position: 'absolute', left: '50%', top: '62%', width: p.w, height: p.round ? p.w : p.h, borderRadius: p.round ? '50%' : 2, background: p.c,
              '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--r': `${p.rot}deg`,
              animation: `cs-confetti 1.5s cubic-bezier(.15,.7,.35,1) ${0.75 + Number(p.delay)}s both`,
            }} />
          ))}
        </div>

        <motion.div animate={go ? { opacity: 0 } : {}} transition={{ duration: 0.3, delay: 0.5 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <div style={{ width: 74, animation: go ? 'cs-drum .18s ease-in-out 0s 4' : 'cs-rise .8s ease-out .8s both' }}>
            <Drum width={74} />
          </div>
          <div>
            {ot.show('cta') && (
              <div style={{ minHeight: 50, padding: '12px 24px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: C.MUSTARD, color: C.NAVY_D, fontFamily: body, fontWeight: 800, fontSize: 16, letterSpacing: '.04em', boxShadow: `0 0 0 3px ${C.NAVY_D}, 0 0 0 5px ${C.MUSTARD}, 0 14px 26px rgba(0,0,0,.4)`, animation: 'cs-rise .8s ease-out .9s both' }}>
                {ot.text('cta')}
              </div>
            )}
            {ot.show('hint') && <div style={{ marginTop: 10, fontSize: 13.5, color: alpha(C.CREAM, 0.75), animation: 'cs-fade .8s ease-out 1.2s both, cs-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə — afişa vərəqi */
function Act({ id, section, title, kicker, sub, children, body, tone = 'paper' }) {
  const bg = tone === 'cream' ? C.CREAM : tone === 'navy' ? `radial-gradient(120% 80% at 50% 0%, #2A3A78, ${C.NAVY} 60%)` : PAPER_TEX
  const navy = tone === 'navy'
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '58px 20px 64px', background: bg }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 34, height: 2, background: navy ? C.MUSTARD : C.RED }} />
              <Star size={12} color={navy ? C.MUSTARD : C.RED} /><Star size={18} color={C.MUSTARD} /><Star size={12} color={navy ? C.MUSTARD : C.RED} />
              <span style={{ width: 34, height: 2, background: navy ? C.MUSTARD : C.RED }} />
            </div>
            {title && <h2 style={{ margin: 0, fontFamily: body, fontWeight: 800, fontSize: 'clamp(26px, 7.6vw, 34px)', lineHeight: 1.12, letterSpacing: '.03em', textTransform: 'uppercase', color: navy ? C.CREAM : C.RED, textShadow: `2px 2px 0 ${navy ? C.RED : C.NAVY}`, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 10, fontSize: 15.5, color: navy ? alpha(C.CREAM, 0.8) : C.MUTED }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 330, fontSize: 15.5, color: navy ? alpha(C.CREAM, 0.8) : C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: C.CREAM, border: `2px solid ${alpha(C.NAVY, 0.25)}`, borderRadius: 12,
  padding: '13px 16px', fontSize: 16, color: C.INK, outline: 'none',
}
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 999,
  fontSize: 15, fontWeight: 700, letterSpacing: '.03em', textDecoration: 'none', cursor: 'pointer',
  background: on ? C.RED : 'transparent', color: on ? C.CREAM : C.RED, border: `2px solid ${C.RED}`,
})
const suggest = { bg: C.CREAM, border: `2px solid ${alpha(C.NAVY, 0.2)}`, active: alpha(C.MUSTARD, 0.22), text: C.INK, table: C.RED, radius: 12 }

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function CircusShowTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const disp = theme.fonts.heading
  const body = theme.fonts.body
  const T = TXT[lang] || TXT.az
  const age = inv.age
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} & ${inv.bride}` : inv.single)

  return (
    <div data-cs lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.PAPER,
      minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.RED, 0.2),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <BigTopOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.RED, border: `3px solid ${C.CREAM}`, boxShadow: `0 0 0 2px ${C.RED}, 0 8px 18px rgba(0,0,0,.3)` }}>
        {({ playing }) => <EqBars playing={playing} color={C.CREAM} idle={alpha(C.CREAM, 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.NAVY, 0.95), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `3px solid ${C.RED}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.CREAM, 0.8), fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: body, fontWeight: 800, fontSize: 16, letterSpacing: '.14em', color: C.MUSTARD }}>DIGITOY</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={{ ...theme, background: C.NAVY, surface: '#2A3A78', text: C.CREAM, muted: alpha(C.CREAM, 0.75) }} />
          </header>

          {/* HERO — sirk afişası */}
          <section style={{ position: 'relative', overflow: 'hidden', background: PAPER_TEX, paddingBottom: 34 }}>
            <Bunting count={11} height={48} />
            <div style={{ position: 'relative', textAlign: 'center', padding: '6px 18px 0' }}>
              {/* qövs lent */}
              <svg viewBox="0 0 340 92" width="100%" aria-hidden="true" style={{ display: 'block', maxWidth: 360, margin: '0 auto', overflow: 'visible' }}>
                <defs><path id="cs-arc" d="M24 84Q170 -4 316 84" /></defs>
                <path d="M24 84Q170 -4 316 84" fill="none" stroke={C.RED_D} strokeWidth="38" transform="translate(0 4)" />
                <path d="M24 84Q170 -4 316 84" fill="none" stroke={C.RED} strokeWidth="38" />
                <path d="M24 84Q170 -4 316 84" fill="none" stroke={C.CREAM} strokeWidth="1" strokeDasharray="3 4" transform="translate(0 -14)" opacity=".6" />
                <path d="M24 84Q170 -4 316 84" fill="none" stroke={C.CREAM} strokeWidth="1" strokeDasharray="3 4" transform="translate(0 14)" opacity=".6" />
                <text fontFamily={body} fontWeight="800" fontSize="20" letterSpacing="4" fill={C.CREAM} dy="7"><textPath href="#cs-arc" startOffset="50%" textAnchor="middle">{up(L('hero', 'kicker', T.bigShow), lang)}</textPath></text>
              </svg>
              <h1 style={{ margin: '4px 0 0', fontFamily: disp, fontWeight: 400, fontSize: nameSize(heroName), lineHeight: 1.04, color: C.RED, textShadow: `3px 3px 0 ${C.NAVY}, 5px 6px 0 ${alpha(C.NAVY, 0.2)}`, textWrap: 'balance', overflowWrap: 'anywhere' }}>
                {heroName}
              </h1>
              {age && <div style={{ marginTop: 10, fontWeight: 700, fontSize: 17, letterSpacing: '.04em', color: C.NAVY }}>{ageSentence(age, lang)}</div>}
            </div>

            <div style={{ position: 'relative', width: 'min(84vw, 340px)', margin: '22px auto 0' }}>
              <Tent width={340} style={{ width: '100%', height: 'auto' }} />
              <Starburst size={106} style={{ position: 'absolute', left: -14, top: -6, animation: 'cs-wobble 4s ease-in-out infinite' }}>
                {age ? (
                  <>
                    <span style={{ fontFamily: disp, fontSize: age > 9 ? 30 : 38, lineHeight: 0.9, color: C.CREAM }}>{age}</span>
                    <span style={{ fontWeight: 800, fontSize: 11, letterSpacing: '.12em', color: C.MUSTARD, marginTop: 3 }}>{up(ageWord(age, lang), lang)}</span>
                  </>
                ) : <Star size={34} color={C.MUSTARD} />}
              </Starburst>
              <Star size={18} style={{ position: 'absolute', right: 4, top: 10 }} color={C.RED} />
              <Star size={12} style={{ position: 'absolute', right: 30, top: 44 }} color={C.TEAL} />
            </div>

            <div style={{ position: 'relative', textAlign: 'center', padding: '18px 22px 0' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 'clamp(16px, 4.6vw, 19px)', letterSpacing: '.04em', color: C.NAVY, textTransform: 'uppercase' }}>
                <Star size={14} color={C.RED} />{inv.fullDate}<Star size={14} color={C.RED} />
              </div>
              <div style={{ marginTop: 6, fontSize: 16, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 15, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              <div style={{ display: 'inline-block', marginTop: 16, padding: '6px 14px', border: `2px solid ${C.NAVY}`, fontWeight: 800, fontSize: 12.5, letterSpacing: '.16em', color: C.NAVY, transform: 'rotate(-2deg)' }}>{up(T.tonight, lang)}</div>
              <p style={{ margin: '16px auto 0', maxWidth: 330, fontSize: 16.5, lineHeight: 1.6, color: C.MUTED }}>{tr.inv_join}</p>
            </div>
          </section>

          {/* SAYĞAC — nağara postamentləri */}
          {S.countdown && (
            <Act body={body} tone="navy" title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 380, margin: '0 auto', alignItems: 'end' }}>
                {[
                  { v: cd.days, l: cd.labels.days, c: C.RED, b: C.MUSTARD },
                  { v: cd.hours, l: cd.labels.hours, c: C.TEAL, b: C.CREAM },
                  { v: cd.minutes, l: cd.labels.minutes, c: C.MUSTARD_D, b: C.RED },
                  { v: cd.seconds, l: cd.labels.seconds, c: C.RED, b: C.MUSTARD, pop: true },
                ].map(({ v, l, c, b, pop }, i) => (
                  <div key={l} style={{ textAlign: 'center', marginBottom: i % 2 ? 10 : 0 }}>
                    <Pedestal color={c} band={b}>
                      <span style={{ fontWeight: 800, fontSize: 'clamp(22px, 7vw, 30px)', lineHeight: 1, color: C.CREAM, textShadow: `2px 2px 0 ${alpha('#000', 0.25)}`, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                    </Pedestal>
                    <div style={{ marginTop: 8, fontWeight: 700, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: alpha(C.CREAM, 0.85) }}>{l}</div>
                  </div>
                ))}
              </div>
            </Act>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN — arenanın kənarı */}
          {S.venue && (
            <Act body={body} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ position: 'relative', width: 'min(82vw, 330px)', margin: '0 auto', padding: 12, borderRadius: '50%', background: `repeating-conic-gradient(${C.RED} 0 15deg, ${C.CREAM} 15deg 30deg)`, boxShadow: `0 0 0 3px ${C.NAVY}, 0 18px 30px -16px rgba(0,0,0,.45)` }}>
                <div style={{ borderRadius: '50%', overflow: 'hidden', boxShadow: `0 0 0 3px ${C.NAVY}`, isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.RED} height="min(calc(82vw - 24px), 306px)"
                    map={{ opacity: 0.85, filter: 'sepia(.35) saturate(.85) contrast(.95)', tintOpacity: 0.14, tint: C.RED, blend: 'multiply' }}
                    frame={<TentPin />}
                    fallback={<div style={{ height: 'min(calc(82vw - 24px), 306px)', position: 'relative', background: `radial-gradient(circle, ${C.CREAM} 30%, ${C.PAPER_D})` }}><TentPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 22, fontWeight: 800, fontSize: 22, lineHeight: 1.25, letterSpacing: '.02em', textTransform: 'uppercase', color: C.NAVY }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 15.5, color: C.MUTED }}>{weddingData.venueNote}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={btn(true)}>{tr.inv_directions_btn}</a>}
                {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={btn(!inv.dirUrl)}>Maps</a>}
                {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Waze</a>}
                {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Apple</a>}
              </div>
            </Act>
          )}

          {/* PROQRAM — köhnə proqram vərəqi */}
          {S.program && (
            <Act body={body} tone="cream" title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ position: 'relative', maxWidth: 420, margin: '0 auto', padding: '10px 18px', background: '#FFFDF6', border: `2px solid ${C.NAVY}`, outline: `1px solid ${C.NAVY}`, outlineOffset: 4, boxShadow: '0 20px 34px -24px rgba(0,0,0,.5)' }}>
                {[['left', 'top'], ['right', 'top'], ['left', 'bottom'], ['right', 'bottom']].map(([x, y]) => (
                  <Star key={x + y} size={14} color={C.RED} style={{ position: 'absolute', [x]: 6, [y]: 6 }} />
                ))}
                <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {timeline.events.map((ev, i) => (
                    <li key={i} style={{ display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr) auto', gap: 12, alignItems: 'center', padding: '14px 4px', borderBottom: i < timeline.events.length - 1 ? `1.5px dashed ${alpha(C.NAVY, 0.3)}` : 'none' }}>
                      <span style={{ position: 'relative', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star size={44} color={[C.RED, C.TEAL, C.MUSTARD_D, C.NAVY][i % 4]} style={{ position: 'absolute', inset: 0 }} />
                        <span aria-hidden="true" style={{ position: 'relative', fontWeight: 800, fontSize: 15, color: C.CREAM, marginTop: 3 }}>{i + 1}</span>
                      </span>
                      <span style={{ minWidth: 0, fontWeight: 700, fontSize: 18, lineHeight: 1.25, color: C.INK }}>
                        <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{T.act} {i + 1}: </span>{ev.label}
                      </span>
                      <span style={{ fontWeight: 800, fontSize: 17, color: C.RED, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Act>
          )}

          {S.dresscode && (
            <Act body={body} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={body} align="center" />
            </Act>
          )}

          {/* MASA — zolaqlı halqa */}
          {S.seating && !seating.isEmpty && (
            <Act body={body} tone="cream" title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <input {...seatInputProps(inv, 'cs-seat-list')} style={field} />
              <SeatSuggest inv={inv} id="cs-seat-list" c={{ ...suggest, font: body }} />
              {seating.showNotFound && <div style={{ marginTop: 12, fontSize: 15, color: C.MUTED, textAlign: 'center' }}>{tr.inv_seat_fullname}</div>}
              {seating.selected && (
                <div style={{ marginTop: 26, textAlign: 'center', animation: 'cs-rise .6s ease-out both' }}>
                  <div style={{ fontWeight: 700, fontSize: 17, color: C.INK, marginBottom: 14 }}>{seating.selected.full_name}</div>
                  <Hoop size={220}>
                    <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: '.18em', color: C.NAVY }}>{up(T.table, lang)}</span>
                    <span style={{ fontFamily: disp, fontSize: tableSize(tableNum(seating.selected.table_id), 52), lineHeight: 1.05, color: C.RED, textShadow: `2px 2px 0 ${C.NAVY}` }}>{tableNum(seating.selected.table_id)}</span>
                  </Hoop>
                  {seating.tablemates.length > 0 && <div style={{ marginTop: 16, fontSize: 15.5, color: C.MUTED, lineHeight: 1.6 }}>{seating.tablemates.map((g) => g.full_name).join(', ')}</div>}
                  <button onClick={seating.reset} data-press style={{ marginTop: 6, background: 'none', border: 'none', color: C.RED, fontWeight: 700, fontSize: 15, minHeight: 44, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: body }}>
                    {seatingL.again || 'Yenidən axtar'}
                  </button>
                </div>
              )}
            </Act>
          )}

          {/* FOTOLAR — afişa divarı */}
          {S.gallery && (
            <Act id="gallery-section" body={body} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10, marginBottom: 30 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ margin: 7, aspectRatio: '3 / 4', overflow: 'hidden', background: C.PAPER_D, transform: `rotate(${[-3, 2, -1.5, 2.5, -2, 1][i % 6]}deg)`, boxShadow: `0 0 0 6px #FFFDF6, 0 0 0 8px ${[C.RED, C.NAVY, C.TEAL][i % 3]}, 0 14px 20px -8px rgba(0,0,0,.4)` }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
              )}
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: 12, background: '#FFFDF6', borderRadius: 8, border: `2px solid ${C.NAVY}`, boxShadow: `5px 5px 0 ${C.RED}` }}>
                  <QRCodeSVG value={gallery.photoShareUrl} size={126} bgColor="#FFFDF6" fgColor={C.NAVY} level="M" />
                </div>
                <div style={{ marginTop: 16, fontSize: 15, color: C.MUTED }}>{tr.inv_scan_upload}</div>
                <a data-press href={gallery.photoShareUrl} style={{ ...btn(true), marginTop: 16 }}>{tr.inv_gallery_btn}</a>
                <p style={{ margin: '16px auto 0', maxWidth: 340, fontSize: 15.5, color: C.MUTED, lineHeight: 1.65 }}>{kidsGalleryDesc(props.adminOverrides, tr, lang)}</p>
              </div>
            </Act>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Act body={body} tone="cream" title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.NAVY, 0.45), hair: alpha(C.NAVY, 0.16), accent: C.RED,
                font: body, display: body, btnFont: body, btnUpper: true, btnTracking: '.1em',
                doneMark: <TopHat size={48} style={{ margin: '0 auto 10px' }} />,
                marker: (a) => (a ? <Star size={18} color={C.RED} /> : <span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', border: `2px solid ${alpha(C.NAVY, 0.4)}` }} />),
                suggest: { ...suggest, font: body },
              }} />
            </Act>
          )}

          {/* ALQIŞLAR */}
          {S.guestbook && (
            <Act body={body} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 30 }}>
                <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={field} />
                <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...field, resize: 'none', lineHeight: 1.5 }} />
                <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...btn(gbook.canSubmit), width: '100%', opacity: gbook.canSubmit ? 1 : 0.5, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}>
                  {gbook.sending ? gbookL.sending : gbookL.btn}
                </button>
                {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 14, color: C.RED }}>⚠ {gbookL.error}</p>}
              </form>
              <div style={{ display: 'grid', gap: 18 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  const col = [C.RED, C.TEAL, C.NAVY, C.MUSTARD_D][i % 4]
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, background: '#FFFDF6', border: `2px solid ${C.NAVY}`, boxShadow: `4px 4px 0 ${col}`, transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)` }}>
                      <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', background: col, color: C.CREAM }}>
                        <span style={{ fontWeight: 800, fontSize: 12.5, letterSpacing: '.16em' }}>{up(T.bravo, lang)}</span>
                        <span style={{ display: 'flex', gap: 3 }}><Star size={11} color={C.CREAM} /><Star size={11} color={C.CREAM} /><Star size={11} color={C.CREAM} /></span>
                      </div>
                      <div style={{ padding: '12px 14px 14px' }}>
                        <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.55, color: C.INK }}>{msg.text}</blockquote>
                        <figcaption style={{ marginTop: 8, fontWeight: 800, fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', color: col }}>{msg.name}{msg.date ? <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none', color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}</figcaption>
                      </div>
                    </figure>
                  )
                })}
              </div>
            </Act>
          )}

          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={body} />
        </motion.div>
      )}
    </div>
  )
}

function TentPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -30, top: -50, width: 60 }}>
        <Tent width={60} />
      </span>
    </span>
  )
}
