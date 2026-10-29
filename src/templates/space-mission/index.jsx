import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../_shared/MapSection'
import { EmblemSlot } from '../_shared/MonoContent'
import { Reveal, PopDigit, enterDirection } from '../_shared/motion'
import { parseLatLon } from '../_shared/geo'
import { hidePhoto } from '../../utils/photoGallery'
import { getTemplateTheme, FONT_STACKS } from '../templateConfig'
import { useInvitation, useGate, openingNames, seatInputProps, alpha } from '../_shared/useInvitation'
import { MusicFab, EqBars, SeatSuggest, StoryBlock, InvitationEnd, ReplyForm } from '../_shared/invitationKit'
import { ageSentence, ageWord, kidsGalleryDesc, tableNum, tableSize } from '../_shared/kids'
import { C } from './palette'
import { LABELS, TXT } from './copy'
import { Stars, Rocket, Planet, Gantry, Smoke, RadarGrid, MissionPatch, Helmet, StarMark, OrbitIcon, Comet } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   SPACE MISSION — «Kosmik səyahət» (Uşaq ad günü konsepti, 2026-10)

   Konsept: ad günü bir kosmik missiyadır. Açılış — sübh çağı buraxılış
   meydançası: qəfəs qüllənin yanında retro raket, üstdə «T−3» lövhəsi.
   Toxunanda geri sayım 3·2·1 olur, tüstü qalxır, raket göyə uçur və səma
   ulduzlu kosmosa çevrilir. Daxildə:
     hero      → halqalı planet: yaş planetin üstündə, raket onun orbitində
     sayğac    → missiya pultu: yaşıl işıqlı ekranlar, işıq diodları
     məkan     → radar ekranında dairəvi xəritə + koordinatlar
     proqram   → uçuş planı: hər hadisə bir planet
     masa      → tikişli missiya nişanı
     fotolar   → illuminatorlar
     arzular   → kosmosdan siqnallar
   Şriftlər: Unbounded (ad, başlıq) · Tektur (yalnız rəqəmlər) · Exo 2 (mətn) — hamısında Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('space-mission')
const ID = 'space-mission'
/* Tektur — yalnız rəqəmlər üçün (LED ekranlar). Hərflərdə «Y» «V»-yə bənzəyir,
   ona görə adlar və başlıqlar Unbounded, kiçik etiketlər Exo 2 ilə yazılır. */
const LED = FONT_STACKS.tektur

const KEYFRAMES = `
@keyframes sm-twinkle { 0%,100% { opacity: .3 } 50% { opacity: 1 } }
@keyframes sm-flame { from { transform: scaleY(.88) scaleX(1.04) } to { transform: scaleY(1.12) scaleX(.94) } }
@keyframes sm-blink { 0%,100% { opacity: 1 } 50% { opacity: .2 } }
@keyframes sm-sweep { to { transform: rotate(360deg) } }
@keyframes sm-orbit { to { transform: rotate(360deg) } }
@keyframes sm-shake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-2px) } 75% { transform: translateX(2px) } }
@keyframes sm-count { to { transform: translateY(-3em) } }
@keyframes sm-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes sm-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes sm-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes sm-puff { from { transform: scale(.3); opacity: 0 } 30% { opacity: 1 } to { transform: scale(1.5); opacity: .9 } }
@keyframes sm-wave { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
@keyframes sm-drift { 0%,100% { transform: translate(0,0) } 50% { transform: translate(6px,-8px) } }
[data-sm] span[aria-hidden="true"], [data-sm] svg[aria-hidden="true"], [data-sm] div[aria-hidden="true"] { pointer-events: none; }
[data-sm] ::placeholder { color: rgba(174,180,216,.6); }
[data-sm] input:focus-visible, [data-sm] textarea:focus-visible { border-color: ${C.MINT} !important; outline: none; }
[data-sm] button:focus-visible, [data-sm] a:focus-visible, [data-sm] [role="button"]:focus-visible { outline: 2px solid ${C.SUN}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-sm] *, [data-sm] { animation: none !important; transition: none !important; } }
`

const upAz = (s, lang) => String(s || '').toLocaleUpperCase(lang === 'az' ? 'az' : lang === 'ru' ? 'ru' : 'en')

/* Künc mötərizələri — HUD çərçivəsi */
function Hud({ children, color = C.MINT, style }) {
  const c = (pos) => ({ position: 'absolute', width: 16, height: 16, borderColor: color, borderStyle: 'solid', borderWidth: 0, ...pos })
  return (
    <div style={{ position: 'relative', padding: '18px 18px', ...style }}>
      <span aria-hidden="true" style={c({ left: 0, top: 0, borderLeftWidth: 2, borderTopWidth: 2 })} />
      <span aria-hidden="true" style={c({ right: 0, top: 0, borderRightWidth: 2, borderTopWidth: 2 })} />
      <span aria-hidden="true" style={c({ left: 0, bottom: 0, borderLeftWidth: 2, borderBottomWidth: 2 })} />
      <span aria-hidden="true" style={c({ right: 0, bottom: 0, borderRightWidth: 2, borderBottomWidth: 2 })} />
      {children}
    </div>
  )
}

/* ═══ 01 — AÇILIŞ: buraxılış meydançası ═══ */
function LaunchOpening({ inv, theme }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const disp = theme.fonts.heading
  const go = gate.opening
  return (
    <motion.div {...gate.gateProps} data-sm
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: C.DEEP, color: C.WHITE, fontFamily: theme.fonts.body }}>
      {/* sübh səması → kosmos */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${C.DEEP} 0%, ${C.SPACE} 28%, ${C.VIOLET} 52%, #B4508C 74%, ${C.TANGERINE} 90%, ${C.SUN} 100%)`, opacity: go ? 0 : 1, transition: 'opacity 1s ease .95s' }} />
      <Stars count={60} opacity={go ? 1 : 0.75} />

      {/* yer, qüllə, raket */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, transform: go ? 'translateY(60%)' : 'none', transition: 'transform 1.2s cubic-bezier(.55,0,.8,.3) .9s' }}>
        <svg viewBox="0 0 400 120" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '15%' }}>
          <path d="M0 40C60 26 110 34 160 24C220 14 280 30 400 20V120H0Z" fill="#1A1C40" />
          <path d="M0 64C80 50 140 60 220 50C300 42 340 56 400 50V120H0Z" fill="#0B0D24" />
        </svg>
        <div style={{ position: 'absolute', left: 'calc(50% - 112px)', bottom: '12%' }}>
          <Gantry height={300} />
        </div>
        <div style={{ position: 'absolute', left: 'calc(50% - 80px)', bottom: '11%', width: 160, height: 14, borderRadius: 4, background: '#2A2F57', boxShadow: '0 4px 0 #14183A' }} />
        {/* tüstü */}
        <div style={{ position: 'absolute', left: 'calc(50% - 130px)', bottom: '8%', width: 260, transformOrigin: '50% 80%', animation: go ? 'sm-puff 1.1s ease-out .45s both' : 'none', opacity: go ? undefined : 0 }}>
          <Smoke width={260} />
        </div>
        {/* raket */}
        <div style={{
          position: 'absolute', left: 'calc(50% - 42px)', bottom: 'calc(11% + 8px)', width: 84,
          transform: go ? 'translateY(-140vh)' : 'none', transition: 'transform 1.15s cubic-bezier(.6,0,.85,.25) .95s',
        }}>
          <div style={{ animation: go ? 'sm-shake .08s linear 0s 12' : 'none' }}>
            <Rocket size={84} flame={go} big={go} />
          </div>
        </div>
      </div>

      {/* geri sayım lövhəsi */}
      <motion.div animate={go ? { opacity: 0 } : {}} transition={{ duration: 0.3, delay: 1.0 }}
        style={{ position: 'absolute', top: 'max(7vh, 40px)', left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, background: 'rgba(6,8,26,.75)', border: `1px solid ${alpha(C.MINT, 0.35)}`, fontFamily: LED, fontWeight: 700, color: C.MINT, textShadow: `0 0 10px ${C.MINT}` }}>
          <span style={{ fontSize: 15, letterSpacing: '.1em' }}>T−</span>
          <span style={{ display: 'inline-block', height: '1em', overflow: 'hidden', fontSize: 30, lineHeight: 1 }}>
            <span style={{ display: 'block', animation: go ? 'sm-count .9s steps(3, end) forwards' : 'none' }}>
              {['3', '2', '1', '0'].map((d) => <span key={d} style={{ display: 'block', height: '1em' }}>{d}</span>)}
            </span>
          </span>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.RED, animation: 'sm-blink 1s steps(2) infinite' }} />
        </div>
      </motion.div>

      {/* adlar və düymə */}
      <motion.div animate={go ? { opacity: 0, y: -16 } : {}} transition={{ duration: 0.35 }}
        style={{ position: 'absolute', top: 'calc(max(7vh, 40px) + 64px)', left: 0, right: 0, textAlign: 'center', padding: '0 22px' }}>
        <EmblemSlot mono={ot.mono} size={56} border={`1.5px solid ${C.SUN}`} background={alpha(C.DEEP, 0.4)} color={C.SUN} font={disp} style={{ animation: 'none', marginBottom: 12 }}>
          <Planet size={46} c1={C.SUN} c2={C.TANGERINE} ring ringColor={C.MINT} style={{ margin: '0 auto 12px' }} />
        </EmblemSlot>
        {ot.show('kicker') && <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 13, letterSpacing: '.24em', color: C.MINT, animation: 'sm-rise .8s ease-out .2s both' }}>{upAz(ot.text('kicker'), inv.lang)}</div>}
        {titleOv !== '' && (
          <div style={{ marginTop: 8, fontFamily: disp, fontWeight: 800, fontSize: 'clamp(34px, 11vw, 54px)', lineHeight: 1, color: C.WHITE, textShadow: `0 0 24px ${alpha(C.SUN, 0.45)}`, overflowWrap: 'anywhere', animation: 'sm-rise .9s ease-out .35s both' }}>
            {first}{second && <><span style={{ display: 'block', fontSize: '.45em', color: C.SUN, margin: '4px 0' }}>{ot.text('and')}</span>{second}</>}
          </div>
        )}
        {ot.show('meta') && <div style={{ marginTop: 10, fontFamily: LED, fontSize: 15, letterSpacing: '.14em', color: alpha(C.WHITE, 0.85), animation: 'sm-rise .8s ease-out .5s both' }}>{ot.text('meta')}</div>}
        {ot.show('cta') && (
          <div style={{ marginTop: 22, minHeight: 50, padding: '12px 26px', display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 999, background: C.TANGERINE, color: C.DEEP, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 15.5, letterSpacing: '.06em', boxShadow: `0 0 0 4px ${alpha(C.TANGERINE, 0.25)}, 0 12px 26px rgba(0,0,0,.45)`, animation: 'sm-rise .8s ease-out .7s both' }}>
            <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: '50%', background: C.DEEP, animation: 'sm-blink 1s steps(2) infinite' }} />
            {upAz(ot.text('cta'), inv.lang)}
          </div>
        )}
        {ot.show('hint') && <div style={{ marginTop: 10, fontSize: 13.5, color: alpha(C.WHITE, 0.75), animation: 'sm-fade .8s ease-out 1.1s both, sm-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
      </motion.div>
    </motion.div>
  )
}

/* Bölmə — kosmik göyərtə */
function Deck({ id, section, title, kicker, sub, children, disp, deep }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '60px 20px 66px', background: deep ? C.DEEP : C.SPACE, overflow: 'hidden' }}>
      <Stars count={26} opacity={0.5} />
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <OrbitIcon />
            {title && <h2 style={{ margin: '12px 0 0', fontFamily: disp, fontWeight: 700, fontSize: 'clamp(22px, 6.4vw, 29px)', lineHeight: 1.18, letterSpacing: 0, color: C.WHITE, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontSize: 15, color: C.MUTED }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 330, fontSize: 15.5, color: C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: alpha(C.WHITE, 0.06), border: `1px solid ${alpha(C.WHITE, 0.18)}`, borderRadius: 14,
  padding: '14px 16px', fontSize: 16, color: C.WHITE, outline: 'none',
}
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 999,
  fontSize: 15, fontWeight: 600, textDecoration: 'none', cursor: 'pointer', letterSpacing: '.02em',
  background: on ? C.TANGERINE : 'transparent', color: on ? C.DEEP : C.WHITE, border: `1.5px solid ${on ? C.TANGERINE : alpha(C.WHITE, 0.4)}`,
})
const suggest = { bg: C.PANEL, border: `1px solid ${alpha(C.WHITE, 0.16)}`, active: alpha(C.MINT, 0.14), text: C.WHITE, table: C.SUN, radius: 14 }

const PLANETS = [
  [C.MINT, '#2BAE8A'], [C.PINK, '#C2477A'], [C.SUN, C.TANGERINE], [C.SKY, '#3B5FBF'], ['#C9B8FF', C.PURPLE], [C.TANGERINE, '#B8482A'],
]

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function SpaceMissionTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const disp = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const age = inv.age
  const ll = parseLatLon(weddingData)
  const coords = ll ? `${Math.abs(ll[0]).toFixed(4)}° ${ll[0] >= 0 ? 'N' : 'S'} · ${Math.abs(ll[1]).toFixed(4)}° ${ll[1] >= 0 ? 'E' : 'W'}` : ''
  const year = String(weddingData.date || '').slice(0, 4)

  return (
    <div data-sm lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.SPACE,
      minHeight: '100vh', fontFamily: body, color: C.WHITE, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.SUN, 0.25),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <LaunchOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.TANGERINE, border: 'none', boxShadow: `0 0 0 4px ${alpha(C.TANGERINE, 0.25)}, 0 8px 18px rgba(0,0,0,.4)` }}>
        {({ playing }) => <EqBars playing={playing} color={C.DEEP} idle={alpha(C.DEEP, 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.DEEP, 0.88), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.WHITE, 0.1)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: disp, fontWeight: 700, fontSize: 15, letterSpacing: '.06em', color: C.SUN }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — halqalı planet */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', padding: '34px 20px 44px', background: `radial-gradient(110% 60% at 85% 8%, ${C.VIOLET}, ${C.SPACE} 52%, ${C.DEEP})` }}>
            <Stars count={60} />
            <Comet width={110} style={{ position: 'absolute', left: '4%', top: 70, transform: 'rotate(-14deg)', opacity: 0.8 }} />
            <Planet size={46} c1={C.MINT} c2="#2BAE8A" craters style={{ position: 'absolute', left: '8%', top: '44%', animation: 'sm-drift 8s ease-in-out infinite' }} />
            <Planet size={30} c1={C.SKY} c2="#3B5FBF" bands style={{ position: 'absolute', right: '9%', top: '36%', animation: 'sm-drift 10s ease-in-out 1s infinite' }} />

            <div style={{ position: 'relative', textAlign: 'center' }}>
              <div style={{ fontFamily: body, fontWeight: 700, fontSize: 13, letterSpacing: '.26em', color: C.MINT }}>{upAz(L('hero', 'kicker', `${T.mission} · ${inv.eventLabel}`), lang)}</div>
              <h1 style={{ margin: '10px 0 0', fontFamily: disp, fontWeight: 800, fontSize: 'clamp(38px, 12vw, 58px)', lineHeight: 1, color: C.WHITE, textShadow: `0 0 30px ${alpha(C.SUN, 0.35)}`, textWrap: 'balance', overflowWrap: 'anywhere' }}>
                {inv.heroTitle ? inv.heroTitle : inv.isCouple ? <>{inv.groom} <span style={{ color: C.SUN }}>{inv.and}</span> {inv.bride}</> : inv.single}
              </h1>
              {age && <div style={{ marginTop: 10, fontSize: 17, color: C.MUTED }}>{ageSentence(age, lang)}</div>}
            </div>

            {/* planet + orbitdə raket */}
            <div style={{ position: 'relative', width: 'min(66vw, 270px)', aspectRatio: '1', margin: '48px auto 0' }}>
              <div aria-hidden="true" style={{ position: 'absolute', inset: '-14%', borderRadius: '50%', border: `1.5px dashed ${alpha(C.WHITE, 0.25)}` }} />
              <div aria-hidden="true" style={{ position: 'absolute', inset: '-14%', animation: 'sm-orbit 14s linear infinite' }}>
                <div style={{ position: 'absolute', left: 'calc(50% - 13px)', top: -26, width: 26, transform: 'rotate(90deg)' }}>
                  <Rocket size={26} />
                </div>
              </div>
              <Planet size={270} c1="#FFB27A" c2="#E2557C" ring ringColor={C.SUN} bands={!age} craters={!age} style={{ width: '100%', height: '100%' }} childStyle={{ paddingBottom: '20%' }}>
                {age ? (
                  <>
                    <span style={{ fontFamily: LED, fontWeight: 800, fontSize: age > 9 ? 'clamp(64px, 20vw, 96px)' : 'clamp(80px, 26vw, 120px)', lineHeight: 0.9, color: C.WHITE, textShadow: '0 6px 18px rgba(120,20,60,.45)' }}>{age}</span>
                    <span style={{ fontFamily: body, fontWeight: 700, fontSize: 14, letterSpacing: '.3em', color: C.WHITE, marginTop: 6 }}>{upAz(ageWord(age, lang), lang)}</span>
                  </>
                ) : null}
              </Planet>
            </div>

            {/* missiya brifinqi */}
            <Hud style={{ maxWidth: 380, margin: '40px auto 0' }}>
              <div style={{ display: 'grid', gap: 12 }}>
                {[
                  [T.date, inv.fullDate],
                  inv.time ? [T.time, inv.time] : null,
                  weddingData.venueName ? [T.place, weddingData.venueName] : null,
                ].filter(Boolean).map(([k, v]) => (
                  <div key={k} style={{ display: 'grid', gridTemplateColumns: '78px minmax(0, 1fr)', gap: 10, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: body, fontWeight: 700, fontSize: 11.5, letterSpacing: '.18em', color: C.MINT }}>{upAz(k, lang)}</span>
                    <span style={{ fontSize: 17, color: C.WHITE, lineHeight: 1.35 }}>{v}</span>
                  </div>
                ))}
              </div>
            </Hud>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 10, textAlign: 'center', fontSize: 15, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <p style={{ position: 'relative', margin: '22px auto 0', maxWidth: 330, textAlign: 'center', fontSize: 16.5, lineHeight: 1.6, color: C.MUTED }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — missiya pultu */}
          {S.countdown && (
            <Deck section="countdown" disp={disp} deep title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ maxWidth: 400, margin: '0 auto', padding: '14px 14px 16px', borderRadius: 22, background: `linear-gradient(180deg, ${C.PANEL_L}, ${C.PANEL})`, border: `1px solid ${alpha(C.WHITE, 0.08)}`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.12), 0 24px 44px -22px rgba(0,0,0,.8)' }}>
                <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '0 4px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[C.MINT, C.SUN, C.TANGERINE, C.PINK, C.SKY].map((c, i) => <span key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}`, animation: `sm-blink ${1.4 + i * 0.3}s steps(2) ${i * 0.2}s infinite` }} />)}
                  </div>
                  <span style={{ fontFamily: LED, fontWeight: 700, fontSize: 12, letterSpacing: '.2em', color: C.MUTED }}>T−</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
                  {[
                    { v: cd.days, l: cd.labels.days },
                    { v: cd.hours, l: cd.labels.hours },
                    { v: cd.minutes, l: cd.labels.minutes },
                    { v: cd.seconds, l: cd.labels.seconds, pop: true },
                  ].map(({ v, l, pop }) => (
                    <div key={l} style={{ textAlign: 'center', padding: '14px 0 10px', borderRadius: 12, background: '#06081A', boxShadow: 'inset 0 2px 8px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.05)' }}>
                      <div style={{ fontFamily: LED, fontWeight: 700, fontSize: 'clamp(22px, 7vw, 30px)', lineHeight: 1, color: pop ? C.SUN : C.MINT, textShadow: `0 0 12px ${pop ? C.SUN : C.MINT}`, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></div>
                      <div style={{ marginTop: 8, fontSize: 11.5, letterSpacing: '.08em', color: C.MUTED }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, padding: '0 6px' }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[1, 0, 1].map((on, i) => (
                      <span key={i} style={{ position: 'relative', width: 30, height: 16, borderRadius: 999, background: on ? alpha(C.MINT, 0.35) : '#0A0D24', boxShadow: 'inset 0 1px 3px rgba(0,0,0,.6)' }}>
                        <span style={{ position: 'absolute', top: 2, left: on ? 16 : 2, width: 12, height: 12, borderRadius: '50%', background: on ? C.MINT : C.MUTED }} />
                      </span>
                    ))}
                  </div>
                  <span style={{ fontFamily: body, fontWeight: 600, fontSize: 11, letterSpacing: '.16em', color: C.MINT }}>{upAz(T.status, lang)}</span>
                </div>
              </div>
            </Deck>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN — radar ekranı */}
          {S.venue && (
            <Deck section="venue" disp={disp} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ position: 'relative', width: 'min(84vw, 340px)', margin: '0 auto', padding: 10, borderRadius: '50%', background: `radial-gradient(circle, ${C.PANEL_L}, ${C.PANEL})`, boxShadow: `0 0 0 2px ${alpha(C.MINT, 0.5)}, 0 0 44px ${alpha(C.MINT, 0.22)}` }}>
                <div style={{ borderRadius: '50%', overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.SUN} height="min(calc(84vw - 20px), 320px)"
                    map={{ opacity: 0.75, filter: 'grayscale(.6) contrast(1.1) brightness(.85)', tintOpacity: 0.45, tint: C.VIOLET, blend: 'multiply' }}
                    frame={<><RadarGrid /><LandingPin /></>}
                    fallback={<div style={{ height: 'min(calc(84vw - 20px), 320px)', position: 'relative', background: `radial-gradient(circle, #1B2A4A, #0A1228)` }}><RadarGrid /><LandingPin /></div>}
                  />
                </div>
              </div>
              {coords && <div style={{ textAlign: 'center', marginTop: 16, fontFamily: LED, fontSize: 13, letterSpacing: '.14em', color: C.MINT }}>{coords}</div>}
              <div style={{ textAlign: 'center', marginTop: 10, fontFamily: disp, fontWeight: 700, fontSize: 21, lineHeight: 1.2, color: C.WHITE }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 15, color: C.MUTED }}>{weddingData.venueNote}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={btn(true)}>{tr.inv_directions_btn}</a>}
                {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={btn(!inv.dirUrl)}>Maps</a>}
                {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Waze</a>}
                {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Apple</a>}
              </div>
            </Deck>
          )}

          {/* PROQRAM — uçuş planı */}
          {S.program && (
            <Deck section="program" disp={disp} deep title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <ol style={{ position: 'relative', listStyle: 'none', margin: '0 auto', padding: 0, maxWidth: 400 }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: 31, top: 30, bottom: 30, borderLeft: `2px dashed ${alpha(C.WHITE, 0.22)}` }} />
                {timeline.events.map((ev, i) => {
                  const [c1, c2] = PLANETS[i % PLANETS.length]
                  const sz = [40, 52, 36, 48, 44, 56][i % 6]
                  return (
                    <li key={i} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '64px minmax(0, 1fr)', gap: 12, alignItems: 'center', padding: '9px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Planet size={sz} c1={c1} c2={c2} ring={i % 3 === 1} ringColor={C.WHITE} bands={i % 2 === 0} craters={i % 3 === 2} tilt={i % 2 ? 14 : -16} />
                      </div>
                      <div style={{ minWidth: 0, padding: '12px 14px', borderRadius: 14, background: alpha(C.WHITE, 0.045), border: `1px solid ${alpha(C.WHITE, 0.09)}` }}>
                        <div style={{ fontFamily: LED, fontWeight: 700, fontSize: 13.5, letterSpacing: '.12em', color: c1, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                        <div style={{ marginTop: 3, fontSize: 18.5, lineHeight: 1.3, color: C.WHITE }}>{ev.label}</div>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </Deck>
          )}

          {S.dresscode && (
            <Deck section="dresscode" disp={disp} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={disp} align="center" />
            </Deck>
          )}

          {/* MASA — missiya nişanı */}
          {S.seating && !seating.isEmpty && (
            <Deck section="seating" disp={disp} deep title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <input {...seatInputProps(inv, 'sm-seat-list')} style={field} />
              <SeatSuggest inv={inv} id="sm-seat-list" c={{ ...suggest, font: body }} />
              {seating.showNotFound && <div style={{ marginTop: 12, fontSize: 15, color: C.MUTED, textAlign: 'center' }}>{tr.inv_seat_fullname}</div>}
              {seating.selected && (
                <div style={{ marginTop: 26, textAlign: 'center', animation: 'sm-rise .6s ease-out both' }}>
                  <div style={{ fontSize: 17, color: C.WHITE, marginBottom: 14 }}>{seating.selected.full_name}</div>
                  <MissionPatch size={230} top={T.crew} bottom={[T.mission, year].filter(Boolean).join(' · ')}>
                    <span style={{ fontFamily: body, fontWeight: 600, fontSize: 12, letterSpacing: '.2em', color: C.MUTED }}>{upAz(T.table, lang)}</span>
                    <span style={{ fontFamily: LED, fontWeight: 800, fontSize: tableSize(tableNum(seating.selected.table_id), 56), lineHeight: 1, color: C.SUN, textShadow: `0 0 16px ${alpha(C.SUN, 0.5)}` }}>{tableNum(seating.selected.table_id)}</span>
                  </MissionPatch>
                  {seating.tablemates.length > 0 && <div style={{ marginTop: 16, fontSize: 15, color: C.MUTED, lineHeight: 1.6 }}>{seating.tablemates.map((g) => g.full_name).join(', ')}</div>}
                  <button onClick={seating.reset} data-press style={{ marginTop: 6, background: 'none', border: 'none', color: C.SUN, fontSize: 15, minHeight: 44, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: body }}>
                    {seatingL.again || 'Yenidən axtar'}
                  </button>
                </div>
              )}
            </Deck>
          )}

          {/* FOTOLAR — illuminatorlar */}
          {S.gallery && (
            <Deck section="gallery" id="gallery-section" disp={disp} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, marginBottom: 30 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ margin: 9, aspectRatio: '1', borderRadius: '50%', overflow: 'hidden', background: C.PANEL, boxShadow: `0 0 0 5px #A6ACD0, 0 0 0 7px #5C628E, 0 0 0 9px ${C.DEEP}, 0 12px 24px -8px rgba(0,0,0,.6)` }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
              )}
              <div style={{ textAlign: 'center' }}>
                <Hud style={{ display: 'inline-block', padding: 16 }} color={C.SUN}>
                  <div style={{ padding: 10, background: '#FFFFFF', borderRadius: 10 }}>
                    <QRCodeSVG value={gallery.photoShareUrl} size={124} bgColor="#FFFFFF" fgColor={C.DEEP} level="M" />
                  </div>
                </Hud>
                <div style={{ marginTop: 12, fontSize: 14.5, color: C.MUTED }}>{tr.inv_scan_upload}</div>
                <a data-press href={gallery.photoShareUrl} style={{ ...btn(true), marginTop: 16 }}>{tr.inv_gallery_btn}</a>
                <p style={{ margin: '16px auto 0', maxWidth: 340, fontSize: 15, color: C.MUTED, lineHeight: 1.65 }}>{kidsGalleryDesc(props.adminOverrides, tr, lang)}</p>
              </div>
            </Deck>
          )}

          {/* RSVP — ekipaja qoşulun */}
          {S.rsvp && (
            <Deck section="rsvp" disp={disp} deep title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.WHITE, muted: C.MUTED, line: alpha(C.WHITE, 0.35), hair: alpha(C.WHITE, 0.12), accent: C.SUN,
                font: body, display: disp, btnFont: body, btnUpper: true, btnTracking: '.12em',
                doneMark: <Helmet size={44} style={{ margin: '0 auto 10px' }} />,
                marker: (a) => <StarMark active={a} />, suggest: { ...suggest, font: body },
              }} />
            </Deck>
          )}

          {/* KOSMOSDAN SİQNALLAR */}
          {S.guestbook && (
            <Deck section="guestbook" disp={disp} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 30 }}>
                <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={field} />
                <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...field, resize: 'none', lineHeight: 1.5 }} />
                <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...btn(gbook.canSubmit), width: '100%', opacity: gbook.canSubmit ? 1 : 0.5, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}>
                  {gbook.sending ? gbookL.sending : gbookL.btn}
                </button>
                {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 14, color: C.PINK }}>⚠ {gbookL.error}</p>}
              </form>
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  const col = [C.MINT, C.SUN, C.PINK, C.SKY][i % 4]
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '14px 16px 14px', borderRadius: 16, background: C.PANEL, border: `1px solid ${alpha(col, 0.28)}`, boxShadow: '0 14px 28px -20px rgba(0,0,0,.8)' }}>
                      <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontFamily: body, fontWeight: 700, fontSize: 11, letterSpacing: '.22em', color: col }}>{T.signal} #{String(i + 1).padStart(2, '0')}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 2, height: 14 }}>
                          {[0.5, 1, 0.7, 0.9, 0.4, 0.8, 0.6].map((h, k) => <span key={k} style={{ width: 2.5, height: 14 * h, borderRadius: 2, background: col, transformOrigin: 'center', animation: `sm-wave ${0.9 + (k % 3) * 0.3}s ease-in-out ${k * 0.1}s infinite` }} />)}
                        </span>
                      </div>
                      <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.55, color: C.WHITE }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, fontSize: 13.5, color: C.MUTED }}>— {msg.name}{msg.date ? ` · ${gbook.formatDate(msg.date)}` : ''}</figcaption>
                    </figure>
                  )
                })}
              </div>
            </Deck>
          )}

          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={disp} />
        </motion.div>
      )}
    </div>
  )
}

function LandingPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -22, top: -22, width: 44, height: 44, borderRadius: '50%', background: alpha(C.SUN, 0.18), animation: 'sm-blink 1.6s ease-in-out infinite' }} />
      <span style={{ position: 'absolute', left: -9, top: -9, width: 18, height: 18, borderRadius: '50%', background: C.SUN, boxShadow: `0 0 0 3px ${C.DEEP}, 0 0 16px ${C.SUN}` }} />
    </span>
  )
}
