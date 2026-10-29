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
import { C } from './palette'
import { HatchEgg, DinoBadge, NumberEgg, Fern, Volcano, Brachio, Footprint, Bone, Nest } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   DINO ADVENTURE — «Dinozavr ekspedisiyası» (Uşaq ad günü konsepti, 2026-10)

   Konsept: ad günü bir paleontoloji ekspedisiyasıdır. Açılış — qıjılar
   arasında, yuvada xallı dinozavr yumurtası. Toxunanda yumurta titrəyir,
   çatlayır, qabıq uçur və içindən balaca dino boylanır. Daxildə:
     hero      → tüstülənən vulkan, uzunboyun dinozavr, qıjılar; ad oyma daş
                 lövhədə, yaş nəhəng dinozavr izinin içində
     sayğac    → dörd xallı yumurta (saniyə yumurtası titrəyir)
     məkan     → ekspedisiya xəritəsi: izlər yuvaya aparır
     proqram   → iz cığırı
     masa      → qazıntı sahəsi: toz çəkilir, fosil lövhədə masa nömrəsi
     fotolar   → kəhrəba damcıları
     arzular   → qaya yazıları
   Şriftlər: Shantell Sans (başlıq) · Andika (mətn) — ikisində də Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('dino-adventure')
const ID = 'dino-adventure'

const LABELS = {
  countdown: { title: { az: 'Ekspedisiyaya qədər', en: 'Until the expedition', ru: 'До экспедиции' } },
  venue:     { title: { az: 'Ekspedisiya xəritəsi', en: 'Expedition map', ru: 'Карта экспедиции' } },
  program:   { title: { az: 'İz cığırı', en: 'The footprint trail', ru: 'Тропа следов' } },
  dresscode: { title: { az: 'Kəşfiyyatçı geyimi', en: 'Explorer outfit', ru: 'Наряд исследователя' } },
  seating:   { title: { az: 'Qazıntı sahəsi', en: 'The dig site', ru: 'Место раскопок' } },
  gallery:   { title: { az: 'Kəhrəba kolleksiyası', en: 'The amber collection', ru: 'Янтарная коллекция' } },
  rsvp:      { title: { az: 'Ekspedisiyaya qoşulun', en: 'Join the expedition', ru: 'Присоединяйтесь к экспедиции' } },
  guestbook: { title: { az: 'Qaya yazıları', en: 'Cave wall wishes', ru: 'Наскальные пожелания' } },
}
const TXT = {
  az: { table: 'Masa', found: 'Tapıntı!', hello: 'Salam!' },
  en: { table: 'Table', found: 'Found it!', hello: 'Hello!' },
  ru: { table: 'Стол', found: 'Находка!', hello: 'Привет!' },
}

const KEYFRAMES = `
@keyframes da-wobble { 0%,100% { transform: rotate(0) } 20% { transform: rotate(-6deg) } 40% { transform: rotate(5deg) } 60% { transform: rotate(-3deg) } 80% { transform: rotate(2deg) } }
@keyframes da-idle { 0%,82%,100% { transform: rotate(0) } 86% { transform: rotate(-5deg) } 90% { transform: rotate(4deg) } 94% { transform: rotate(-2deg) } }
@keyframes da-shake { 0%,100% { transform: rotate(0) } 25% { transform: rotate(-7deg) } 75% { transform: rotate(7deg) } }
@keyframes da-smoke { 0%,100% { transform: translateY(0) scale(1); opacity: .85 } 50% { transform: translateY(-8px) scale(1.12); opacity: .6 } }
@keyframes da-glow { 0%,100% { opacity: .35 } 50% { opacity: .75 } }
@keyframes da-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes da-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes da-hint { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
@keyframes da-sway { 0%,100% { transform: rotate(0) } 50% { transform: rotate(2.5deg) } }
@keyframes da-dust { to { opacity: 0; transform: scale(1.06) } }
@keyframes da-pop { 0% { transform: scale(.3); opacity: 0 } 70% { transform: scale(1.1) } 100% { transform: scale(1); opacity: 1 } }
[data-da] span[aria-hidden="true"], [data-da] svg[aria-hidden="true"], [data-da] div[aria-hidden="true"] { pointer-events: none; }
[data-da] ::placeholder { color: rgba(97,92,71,.6); }
[data-da] input:focus-visible, [data-da] textarea:focus-visible { border-color: ${C.LEAF} !important; outline: none; }
[data-da] button:focus-visible, [data-da] a:focus-visible, [data-da] [role="button"]:focus-visible { outline: 2px solid ${C.LAVA}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-da] *, [data-da] { animation: none !important; transition: none !important; } }
`

const STONE_BG = `radial-gradient(rgba(0,0,0,.06) 1px, transparent 1.4px) 0 0 / 9px 9px, radial-gradient(rgba(255,255,255,.18) 1px, transparent 1.4px) 4px 5px / 13px 13px, linear-gradient(160deg, #D3C9B4, #B9AE98 60%, #A89C84)`

/* ═══ 01 — AÇILIŞ: dinozavr yumurtası ═══ */
function EggOpening({ inv, theme }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const disp = theme.fonts.heading
  const go = gate.opening
  const T = TXT[inv.lang] || TXT.az
  return (
    <motion.div {...gate.gateProps} data-da
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: `linear-gradient(180deg, ${C.SKY} 0%, #E6F0DA 46%, ${C.SAND} 72%)`, color: C.INK, fontFamily: theme.fonts.body }}>
      <Volcano width={190} style={{ position: 'absolute', right: '-8%', top: '30%', opacity: 0.85 }} />
      <svg aria-hidden="true" viewBox="0 0 400 120" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, top: '46%', width: '100%', height: '18%' }}>
        <path d="M0 50C70 30 140 46 220 30C300 16 350 34 400 26V120H0Z" fill="#B9D4A6" />
      </svg>
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '36%', background: `linear-gradient(180deg, ${C.FERN_L}, ${C.FERN} 60%, ${C.LEAF})` }} />
      <Fern width={150} color={C.LEAF} style={{ position: 'absolute', left: -40, bottom: '6%', animation: 'da-sway 5s ease-in-out infinite', transformOrigin: 'bottom left' }} />
      <Fern width={130} color="#356A32" flip style={{ position: 'absolute', right: -36, bottom: '10%', animation: 'da-sway 6s ease-in-out 1s infinite', transformOrigin: 'bottom right' }} />
      <Fern width={100} color={C.FERN} style={{ position: 'absolute', left: '18%', bottom: '-4%' }} />

      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', padding: 'max(7vh, 48px) 20px max(4vh, 24px)', textAlign: 'center' }}>
        <motion.div animate={go ? { opacity: 0, y: -14 } : {}} transition={{ duration: 0.35 }}>
          {ot.show('kicker') && <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 999, background: alpha(C.JUNGLE, 0.85), color: C.SAND, fontFamily: disp, fontWeight: 600, fontSize: 14, animation: 'da-rise .8s ease-out .2s both' }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 12, fontFamily: disp, fontWeight: 800, fontSize: 'clamp(44px, 14vw, 66px)', lineHeight: 1, color: C.JUNGLE, textShadow: `3px 3px 0 ${C.SAND}, 5px 5px 0 ${alpha(C.JUNGLE, 0.2)}`, overflowWrap: 'anywhere', animation: 'da-pop .8s cubic-bezier(.2,.9,.3,1.3) .35s both' }}>
              {first}{second && <><span style={{ display: 'block', fontSize: '.45em', color: C.LAVA, margin: '4px 0' }}>&amp;</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 10, fontFamily: disp, fontWeight: 600, fontSize: 16, color: C.MUTED, animation: 'da-rise .8s ease-out .5s both' }}>{ot.text('meta')}</div>}
        </motion.div>

        <div style={{ position: 'relative', width: 'min(52vw, 26vh, 220px)' }}>
          <div style={{ animation: go ? 'da-shake .12s linear 0s 6' : 'da-idle 3.4s ease-in-out 1s infinite', transformOrigin: '50% 88%' }}>
            <HatchEgg size={220} open={go} style={{ width: '100%', height: 'auto' }} />
          </div>
          {go && (
            <div aria-hidden="true" style={{ position: 'absolute', right: '-18%', top: '4%', padding: '6px 12px', borderRadius: 14, background: '#FFFFFF', color: C.JUNGLE, fontFamily: disp, fontWeight: 800, fontSize: 16, boxShadow: '0 8px 16px rgba(0,0,0,.15)', animation: 'da-pop .5s cubic-bezier(.2,.9,.3,1.4) 1.35s both' }}>
              {T.hello}
            </div>
          )}
        </div>

        <motion.div animate={go ? { opacity: 0 } : {}} transition={{ duration: 0.3 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 26px', display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 999, background: C.LAVA, color: '#FFFFFF', fontFamily: disp, fontWeight: 800, fontSize: 16.5, boxShadow: `0 6px 0 ${C.LAVA_D}, 0 16px 26px rgba(0,0,0,.25)`, animation: 'da-rise .8s ease-out .8s both' }}>
              <Footprint size={18} color="#FFFFFF" />{ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 14, fontSize: 14, fontWeight: 700, color: C.JUNGLE, animation: 'da-fade .8s ease-out 1.1s both, da-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə — düşərgə */
function Camp({ id, section, title, kicker, sub, children, disp, tone = 'sand' }) {
  const jungle = tone === 'jungle'
  const bg = jungle ? `linear-gradient(180deg, ${C.JUNGLE}, #1C3825)` : tone === 'egg' ? C.EGG : C.SAND
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '60px 20px 66px', background: bg, overflow: 'hidden' }}>
      {jungle && <Fern width={120} color={alpha(C.FERN, 0.25)} style={{ position: 'absolute', left: -30, bottom: -20 }} />}
      {jungle && <Fern width={110} color={alpha(C.FERN, 0.2)} flip style={{ position: 'absolute', right: -30, top: -10 }} />}
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 10 }}>
              <Footprint size={18} color={jungle ? C.FERN : C.LEAF} style={{ transform: 'rotate(-14deg)' }} />
              <Footprint size={18} color={jungle ? C.FERN : C.LEAF} style={{ transform: 'rotate(14deg) translateY(-6px)' }} />
            </div>
            {title && <h2 style={{ margin: 0, fontFamily: disp, fontWeight: 800, fontSize: 'clamp(28px, 8vw, 36px)', lineHeight: 1.12, color: jungle ? C.SAND : C.JUNGLE, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontSize: 15.5, color: jungle ? alpha(C.SAND, 0.8) : C.MUTED }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 330, fontSize: 15.5, color: jungle ? alpha(C.SAND, 0.8) : C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: '#FFFDF6', border: `2px solid ${alpha(C.LEAF, 0.28)}`, borderRadius: 16,
  padding: '13px 16px', fontSize: 16, color: C.INK, outline: 'none',
}
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 999,
  fontSize: 15.5, fontWeight: 700, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.LEAF : 'transparent', color: on ? '#FFFFFF' : C.LEAF, border: `2px solid ${C.LEAF}`,
  boxShadow: on ? `0 4px 0 ${C.JUNGLE}` : 'none',
})
const suggest = { bg: '#FFFDF6', border: `2px solid ${alpha(C.LEAF, 0.22)}`, active: alpha(C.FERN, 0.2), text: C.INK, table: C.LEAF, radius: 16 }

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function DinoAdventureTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const disp = theme.fonts.heading
  const body = theme.fonts.body
  const T = TXT[lang] || TXT.az
  const age = inv.age

  return (
    <div data-da lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.SAND,
      minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.LEAF, 0.2),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <EggOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.LEAF, border: 'none', boxShadow: `0 4px 0 ${C.JUNGLE}, 0 10px 18px rgba(0,0,0,.25)` }}>
        {({ playing }) => <EqBars playing={playing} color="#FFFFFF" idle={alpha('#FFFFFF', 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.JUNGLE, 0.94), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.SAND, 0.85), fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: disp, fontWeight: 800, fontSize: 18, color: C.AMBER_L }}>Digitoy</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={{ ...theme, background: C.JUNGLE, surface: '#2F5A3C', text: C.SAND, muted: alpha(C.SAND, 0.75) }} />
          </header>

          {/* HERO — tarixdən əvvəlki vadi */}
          <section style={{ position: 'relative', overflow: 'hidden', background: C.SAND }}>
            <div style={{ position: 'relative', height: 'min(92vw, 400px)', background: `linear-gradient(180deg, ${C.SKY}, #E3EFD8 58%, ${C.SAND})`, overflow: 'hidden' }}>
              <Volcano width={210} style={{ position: 'absolute', right: '-6%', top: '14%' }} />
              <svg aria-hidden="true" viewBox="0 0 400 140" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, bottom: '18%', width: '100%', height: '34%' }}>
                <path d="M0 70C80 40 150 64 230 44C300 28 360 46 400 40V140H0Z" fill="#B9D4A6" />
                <path d="M0 100C90 80 170 96 250 82C320 72 370 84 400 80V140H0Z" fill={C.FERN_L} />
              </svg>
              <Brachio width={240} style={{ position: 'absolute', left: '-4%', bottom: '14%', animation: 'da-sway 7s ease-in-out infinite', transformOrigin: '60% 100%' }} />
              <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '22%', background: `linear-gradient(180deg, ${C.FERN}, ${C.LEAF})` }} />
              <Fern width={110} color="#356A32" flip style={{ position: 'absolute', right: -24, bottom: -10 }} />
              <Fern width={90} color={C.LEAF} style={{ position: 'absolute', left: '38%', bottom: -24 }} />
            </div>

            {/* oyma daş lövhə */}
            <div style={{ position: 'relative', margin: '-56px 18px 0', padding: '22px 18px 20px', textAlign: 'center', background: STONE_BG, borderRadius: '28px 34px 24px 30px', boxShadow: 'inset 0 2px 0 rgba(255,255,255,.35), inset 0 -4px 10px rgba(0,0,0,.15), 0 18px 30px -18px rgba(0,0,0,.45)' }}>
              <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 15, color: C.STONE_D }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              <h1 style={{ margin: '6px 0 0', fontFamily: disp, fontWeight: 800, fontSize: 'clamp(42px, 13vw, 64px)', lineHeight: 1.02, color: '#4E463A', textShadow: '0 1px 0 rgba(255,255,255,.55), 0 -1px 0 rgba(0,0,0,.25)', textWrap: 'balance', overflowWrap: 'anywhere' }}>
                {inv.heroTitle ? inv.heroTitle : inv.isCouple ? <>{inv.groom} &amp; {inv.bride}</> : inv.single}
              </h1>
              {age && <div style={{ marginTop: 6, fontFamily: disp, fontWeight: 600, fontSize: 17, color: C.JUNGLE }}>{ageSentence(age, lang)}</div>}
              <Bone width={56} style={{ position: 'absolute', left: 14, bottom: 10, transform: 'rotate(-18deg)', opacity: 0.9 }} />
              {/* yaş — nəhəng iz (lövhənin küncündə möhür kimi) */}
              <Footprint size={88} color={C.LAVA} style={{ position: 'absolute', right: -8, top: -58, transform: 'rotate(14deg)', filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.2))', animation: 'da-pop .8s cubic-bezier(.2,.9,.3,1.3) .3s both' }}>
                {age ? (
                  <>
                    <span style={{ fontFamily: disp, fontWeight: 800, fontSize: age > 9 ? 26 : 32, lineHeight: 0.9, color: '#FFFFFF', transform: 'rotate(-14deg)' }}>{age}</span>
                    <span style={{ fontFamily: disp, fontWeight: 700, fontSize: 11, color: '#FFFFFF', transform: 'rotate(-14deg)' }}>{ageWord(age, lang)}</span>
                  </>
                ) : null}
              </Footprint>
            </div>

            <div style={{ position: 'relative', padding: '22px 22px 34px', textAlign: 'center' }}>
              <div style={{ fontFamily: disp, fontWeight: 800, fontSize: 'clamp(19px, 5.4vw, 23px)', color: C.JUNGLE }}>{inv.fullDate}</div>
              <div style={{ marginTop: 6, fontSize: 16.5, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 15, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', gap: 14, margin: '16px 0 0' }}>
                {[0, 1, 2, 3].map((k) => <Footprint key={k} size={14} color={alpha(C.LEAF, 0.55)} style={{ transform: `rotate(${k % 2 ? 16 : -16}deg) translateY(${k % 2 ? -5 : 0}px)` }} />)}
              </div>
              <p style={{ margin: '14px auto 0', maxWidth: 330, fontSize: 16.5, lineHeight: 1.6, color: C.MUTED }}>{tr.inv_join}</p>
            </div>
          </section>

          {/* SAYĞAC — dörd yumurta */}
          {S.countdown && (
            <Camp disp={disp} tone="jungle" title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(10px, 3.4vw, 16px)', maxWidth: 380, margin: '0 auto', alignItems: 'end' }}>
                {[
                  { v: cd.days, l: cd.labels.days, s: C.TEAL },
                  { v: cd.hours, l: cd.labels.hours, s: C.LAVA },
                  { v: cd.minutes, l: cd.labels.minutes, s: C.AMBER },
                  { v: cd.seconds, l: cd.labels.seconds, s: C.LEAF, pop: true },
                ].map(({ v, l, s, pop }, i) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <NumberEgg id={`da-egg-${i}`} spot={s} wobble={pop}>
                      <span style={{ fontFamily: disp, fontWeight: 800, fontSize: 'clamp(20px, 6.4vw, 28px)', color: C.JUNGLE, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                    </NumberEgg>
                    <div style={{ marginTop: 8, fontFamily: disp, fontWeight: 600, fontSize: 13, color: alpha(C.SAND, 0.85) }}>{l}</div>
                  </div>
                ))}
              </div>
            </Camp>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN — ekspedisiya xəritəsi */}
          {S.venue && (
            <Camp disp={disp} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ position: 'relative', maxWidth: 420, margin: '0 auto', padding: 10, background: '#FFFDF6', borderRadius: 18, border: `2px dashed ${alpha(C.LEAF, 0.45)}`, boxShadow: '0 20px 34px -24px rgba(0,0,0,.45)' }}>
                <div style={{ borderRadius: 12, overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.LAVA} height="clamp(250px, 70vw, 320px)"
                    map={{ opacity: 0.85, filter: 'sepia(.3) saturate(.9) contrast(.95)', tintOpacity: 0.14, tint: C.LEAF, blend: 'multiply' }}
                    frame={<TrailPin />}
                    fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: `radial-gradient(circle at 30% 30%, ${alpha(C.FERN, 0.35)}, transparent 40%), radial-gradient(circle at 75% 70%, ${alpha(C.SKY, 0.6)}, transparent 40%), ${C.SAND}` }}><TrailPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 22, fontFamily: disp, fontWeight: 800, fontSize: 24, lineHeight: 1.2, color: C.JUNGLE }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 15.5, color: C.MUTED }}>{weddingData.venueNote}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={btn(true)}>{tr.inv_directions_btn}</a>}
                {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={btn(!inv.dirUrl)}>Maps</a>}
                {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Waze</a>}
                {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Apple</a>}
              </div>
            </Camp>
          )}

          {/* PROQRAM — iz cığırı */}
          {S.program && (
            <Camp disp={disp} tone="egg" title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <ol style={{ listStyle: 'none', margin: '0 auto', padding: 0, maxWidth: 400 }}>
                {timeline.events.map((ev, i) => {
                  const right = i % 2 === 1
                  return (
                    <li key={i} style={{ position: 'relative', display: 'grid', gridTemplateColumns: right ? 'minmax(0, 1fr) 62px' : '62px minmax(0, 1fr)', gap: 12, alignItems: 'center', paddingBottom: 10 }}>
                      <div style={{ order: right ? 2 : 1, display: 'flex', justifyContent: 'center' }}>
                        <Footprint size={50} color={[C.LEAF, C.LAVA, C.TEAL, C.AMBER][i % 4]} style={{ transform: `rotate(${right ? 16 : -16}deg)` }} />
                      </div>
                      <div style={{ order: right ? 1 : 2, minWidth: 0, padding: '12px 16px', borderRadius: right ? '18px 18px 6px 18px' : '18px 18px 18px 6px', background: '#FFFFFF', boxShadow: `0 0 0 2px ${alpha(C.LEAF, 0.15)}, 0 10px 18px -14px rgba(0,0,0,.4)`, textAlign: right ? 'right' : 'left' }}>
                        <div style={{ fontFamily: disp, fontWeight: 800, fontSize: 15, color: C.LAVA, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                        <div style={{ marginTop: 2, fontSize: 18, lineHeight: 1.3, color: C.INK }}>{ev.label}</div>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </Camp>
          )}

          {S.dresscode && (
            <Camp disp={disp} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={disp} align="center" />
            </Camp>
          )}

          {/* MASA — qazıntı sahəsi */}
          {S.seating && !seating.isEmpty && (
            <Camp disp={disp} tone="egg" title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <input {...seatInputProps(inv, 'da-seat-list')} style={field} />
              <SeatSuggest inv={inv} id="da-seat-list" c={{ ...suggest, font: body }} />
              {seating.showNotFound && <div style={{ marginTop: 12, fontSize: 15, color: C.MUTED, textAlign: 'center' }}>{tr.inv_seat_fullname}</div>}
              {seating.selected && (
                <div key={seating.selected.full_name} style={{ marginTop: 26, textAlign: 'center' }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: C.INK, marginBottom: 14 }}>{seating.selected.full_name}</div>
                  <div style={{ position: 'relative', maxWidth: 300, margin: '0 auto', padding: '26px 18px', borderRadius: 22, background: `radial-gradient(rgba(120,90,40,.12) 1.2px, transparent 1.6px) 0 0 / 10px 10px, linear-gradient(180deg, #E8D3A4, #D9BE85)`, boxShadow: 'inset 0 6px 16px rgba(0,0,0,.18)', overflow: 'hidden' }}>
                    <Bone width={64} style={{ position: 'absolute', left: 14, top: 18, transform: 'rotate(-24deg)' }} />
                    <Bone width={52} style={{ position: 'absolute', right: 16, bottom: 20, transform: 'rotate(30deg)' }} />
                    <Bone width={40} style={{ position: 'absolute', right: 28, top: 22, transform: 'rotate(8deg)' }} />
                    <div style={{ position: 'relative', display: 'inline-block', padding: '12px 26px 14px', background: STONE_BG, borderRadius: '20px 26px 18px 24px', boxShadow: 'inset 0 2px 0 rgba(255,255,255,.35), 0 10px 18px -10px rgba(0,0,0,.45)' }}>
                      <div style={{ fontFamily: disp, fontWeight: 700, fontSize: 13, color: C.LAVA_D }}>{T.found}</div>
                      <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 14, color: C.STONE_D }}>{T.table}</div>
                      <div style={{ fontFamily: disp, fontWeight: 800, fontSize: tableSize(tableNum(seating.selected.table_id), 58), lineHeight: 1, color: '#4E463A', textShadow: '0 1px 0 rgba(255,255,255,.55)' }}>{tableNum(seating.selected.table_id)}</div>
                    </div>
                    {/* toz çəkilir */}
                    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `radial-gradient(rgba(120,90,40,.2) 1.4px, transparent 1.8px) 0 0 / 8px 8px, #E2C995`, animation: 'da-dust .9s ease-out .25s both' }} />
                  </div>
                  {seating.tablemates.length > 0 && <div style={{ marginTop: 16, fontSize: 15.5, color: C.MUTED, lineHeight: 1.6 }}>{seating.tablemates.map((g) => g.full_name).join(', ')}</div>}
                  <button onClick={seating.reset} data-press style={{ marginTop: 6, background: 'none', border: 'none', color: C.LEAF, fontWeight: 700, fontSize: 15.5, minHeight: 44, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: body }}>
                    {seatingL.again || 'Yenidən axtar'}
                  </button>
                </div>
              )}
            </Camp>
          )}

          {/* FOTOLAR — kəhrəba */}
          {S.gallery && (
            <Camp id="gallery-section" disp={disp} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10, marginBottom: 30 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ margin: 6, aspectRatio: '4 / 5', overflow: 'hidden', borderRadius: ['48% 52% 44% 56% / 55% 45% 55% 45%', '56% 44% 52% 48% / 46% 54% 46% 54%', '44% 56% 50% 50% / 52% 48% 52% 48%'][i % 3], background: C.AMBER_L, boxShadow: `0 0 0 5px ${alpha(C.AMBER, 0.75)}, 0 0 0 7px ${alpha(C.AMBER_L, 0.6)}, 0 12px 24px -8px ${alpha(C.LAVA_D, 0.5)}` }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'sepia(.12) saturate(1.05)' }} />
                    </div>
                  ))}
                </div>
              )}
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: 12, background: '#FFFFFF', borderRadius: 18, boxShadow: `0 0 0 3px ${C.LEAF}, 0 6px 0 3px ${C.JUNGLE}` }}>
                  <QRCodeSVG value={gallery.photoShareUrl} size={126} bgColor="#FFFFFF" fgColor={C.JUNGLE} level="M" />
                </div>
                <div style={{ marginTop: 18, fontSize: 15, color: C.MUTED }}>{tr.inv_scan_upload}</div>
                <a data-press href={gallery.photoShareUrl} style={{ ...btn(true), marginTop: 16 }}>{tr.inv_gallery_btn}</a>
                <p style={{ margin: '16px auto 0', maxWidth: 340, fontSize: 15.5, color: C.MUTED, lineHeight: 1.65 }}>{kidsGalleryDesc(props.adminOverrides, tr, lang)}</p>
              </div>
            </Camp>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Camp disp={disp} tone="egg" title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.LEAF, 0.5), hair: alpha(C.LEAF, 0.18), accent: C.LEAF,
                font: body, display: disp, btnFont: disp,
                doneMark: <DinoBadge size={46} style={{ margin: '0 auto 8px' }} />,
                marker: (a) => (a ? <Footprint size={18} color={C.LEAF} /> : <span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', border: `2px solid ${alpha(C.LEAF, 0.45)}` }} />),
                suggest: { ...suggest, font: body },
              }} />
            </Camp>
          )}

          {/* QAYA YAZILARI */}
          {S.guestbook && (
            <Camp disp={disp} tone="jungle" title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 30 }}>
                <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={field} />
                <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...field, resize: 'none', lineHeight: 1.5 }} />
                <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...btn(gbook.canSubmit), width: '100%', opacity: gbook.canSubmit ? 1 : 0.55, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed', background: gbook.canSubmit ? C.LAVA : 'transparent', borderColor: gbook.canSubmit ? C.LAVA : alpha(C.SAND, 0.5), color: gbook.canSubmit ? '#FFFFFF' : alpha(C.SAND, 0.8), boxShadow: gbook.canSubmit ? `0 4px 0 ${C.LAVA_D}` : 'none' }}>
                  {gbook.sending ? gbookL.sending : gbookL.btn}
                </button>
                {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 14, color: C.AMBER_L }}>⚠ {gbookL.error}</p>}
              </form>
              <div style={{ display: 'grid', gap: 16 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ position: 'relative', margin: 0, padding: '16px 18px 14px', background: STONE_BG, borderRadius: ['26px 34px 22px 30px', '32px 24px 30px 26px'][i % 2], boxShadow: 'inset 0 2px 0 rgba(255,255,255,.35), inset 0 -4px 10px rgba(0,0,0,.15), 0 14px 24px -16px rgba(0,0,0,.6)' }}>
                      <blockquote style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: '#3A342A' }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, fontFamily: disp, fontWeight: 700, fontSize: 14.5, color: C.JUNGLE }}>
                        <Footprint size={14} color={C.LAVA_D} />{msg.name}{msg.date ? <span style={{ fontFamily: body, fontWeight: 400, fontSize: 13, color: C.STONE_D }}>· {gbook.formatDate(msg.date)}</span> : null}
                      </figcaption>
                    </figure>
                  )
                })}
              </div>
            </Camp>
          )}

          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={disp} />
        </motion.div>
      )}
    </div>
  )
}

function TrailPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {[[14, 82, -30], [24, 74, 20], [32, 66, -20], [40, 60, 24]].map(([x, y, r], i) => (
        <span key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: `rotate(${r}deg)` }}><Footprint size={16} color={alpha(C.LEAF, 0.75)} /></span>
      ))}
      <span style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: -30, marginTop: -30 }}><Nest size={60} /></span>
    </span>
  )
}
