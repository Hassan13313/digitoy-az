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
import { ageSentence, ageWord, kidsGalleryDesc, tableNum, tableSize } from '../_shared/kids'
import { C, FOIL } from './palette'
import {
  Sparkle, StarField, Moon, Castle, Hill, Crown, Wand, Flourish, CornerFiligree,
  MirrorFrame, Compass, Vignette, CastleMark, AgeSeal, Cloud, Topiary,
} from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   FAIRY TALE — «Nağıl kitabı» (Uşaq ad günü konsepti, 2026-10)

   Konsept: dəvətnamə nağıl kitabıdır. Açılış — üzərində qızıl folqa ilə
   qəsr basılmış parça cildli kitab; toxunanda cild açılır və birinci
   səhifədən pop-up qəsr qalxır. Daxildə hər bölmə kitabın bir hissəsidir:
     hero      → «Biri var idi, biri yox idi…»: gecə səması, təpədə qəsr,
                 qızıl yaş möhürü, tarix lentdə
     sayğac    → dörd nağıl qülləsi (ulduzlu gecə fonunda)
     məkan     → köhnə sehrli xəritə və kompas
     proqram   → nağılın fəsilləri: vinyet + iri baş hərf
     masa      → «Güzgü, güzgü…» — masa nömrəsini göstərən sehrli güzgü
     fotolar   → qəsrin portret zalı
     arzular   → ulduzlu sehrli arzu kartları
   Şriftlər: Cormorant Unicase (başlıq) · Bona Nova (mətn) — ikisində də Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('fairy-tale')
const ID = 'fairy-tale'

const LABELS = {
  countdown: { title: { az: 'Nağıla qədər', en: 'Until the tale begins', ru: 'До начала сказки' } },
  venue:     { title: { az: 'Sehrli xəritə', en: 'The magic map', ru: 'Волшебная карта' } },
  program:   { title: { az: 'Nağılın fəsilləri', en: 'Chapters of the tale', ru: 'Главы сказки' } },
  dresscode: { title: { az: 'Nağıl kostyumu', en: 'Storybook costume', ru: 'Сказочный костюм' } },
  seating:   { title: { az: 'Sehrli güzgü', en: 'The magic mirror', ru: 'Волшебное зеркало' } },
  gallery:   { title: { az: 'Portret zalı', en: 'The portrait hall', ru: 'Портретный зал' } },
  rsvp:      { title: { az: 'Nağıla gələcəksiniz?', en: 'Will you join the tale?', ru: 'Придёте в сказку?' } },
  guestbook: { title: { az: 'Sehrli arzular', en: 'Magic wishes', ru: 'Волшебные пожелания' } },
}
const TXT = {
  az: { once: 'Biri var idi, biri yox idi…', chapter: 'Fəsil', table: 'Masa', mirror: 'Güzgü, güzgü, de görüm…', end: '…və nağıl başlayır' },
  en: { once: 'Once upon a time…', chapter: 'Chapter', table: 'Table', mirror: 'Mirror, mirror, show me…', end: '…and the tale begins' },
  ru: { once: 'Жили-были…', chapter: 'Глава', table: 'Стол', mirror: 'Свет мой, зеркальце, скажи…', end: '…и сказка начинается' },
}
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

const KEYFRAMES = `
@keyframes ft-twinkle { 0%,100% { opacity: .25 } 50% { opacity: 1 } }
@keyframes ft-glow { 0%,100% { opacity: .78 } 50% { opacity: 1 } }
@keyframes ft-flag { 0%,100% { transform: skewY(0) scaleX(1) } 50% { transform: skewY(-9deg) scaleX(.86) } }
@keyframes ft-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes ft-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes ft-hint { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
@keyframes ft-shine { 0% { background-position: 0% 50% } 100% { background-position: 200% 50% } }
@keyframes ft-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
@keyframes ft-burst { 0% { opacity: 0; transform: scale(.2) } 40% { opacity: 1 } 100% { opacity: 0; transform: scale(1.3) translateY(-18px) } }
[data-ft] span[aria-hidden="true"], [data-ft] svg[aria-hidden="true"], [data-ft] div[aria-hidden="true"] { pointer-events: none; }
[data-ft] ::placeholder { color: rgba(98,92,124,.6); }
[data-ft] input:focus-visible, [data-ft] textarea:focus-visible { border-color: ${C.VIOLET} !important; outline: none; }
[data-ft] button:focus-visible, [data-ft] a:focus-visible, [data-ft] [role="button"]:focus-visible { outline: 2px solid ${C.GOLD}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-ft] *, [data-ft] { animation: none !important; transition: none !important; } }
`

const foilText = {
  backgroundImage: FOIL, backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', backgroundClip: 'text',
  color: 'transparent', WebkitTextFillColor: 'transparent',
}

/* İlk hərf + qalan (Unicode-təhlükəsiz) — proqramın iri baş hərfi */
function splitFirst(s) {
  const chars = Array.from(String(s || ''))
  return [chars[0] || '', chars.slice(1).join('')]
}

/* ═══ 01 — AÇILIŞ: nağıl kitabı + pop-up qəsr ═══ */
function BookOpening({ inv, theme }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const serif = theme.fonts.heading
  const open = gate.opening
  const pop = (i) => ({
    position: 'absolute', left: 0, right: 0, bottom: 0, transformOrigin: '50% 100%',
    transform: open ? 'rotateX(0deg)' : 'rotateX(88deg)',
    transition: `transform .95s cubic-bezier(.3,1.45,.45,1) ${0.55 + i * 0.13}s`,
  })
  return (
    <motion.div {...gate.gateProps} data-ft
      animate={open ? { opacity: 0, scale: 1.12 } : {}}
      transition={{ duration: 0.45, delay: 1.65, ease: 'easeIn' }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: `radial-gradient(120% 80% at 50% 28%, ${C.DUSK}, ${C.NIGHT} 72%)`, color: C.CREAM, fontFamily: theme.fonts.body }}>
      <StarField opacity={0.85} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
        <div style={{ position: 'relative', width: 'min(78vw, 320px)', aspectRatio: '3 / 4.15', perspective: 1700, animation: 'ft-rise 1s ease-out both' }}>
          {/* səhifələrin kənarı (kitabın qalınlığı) */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: '7px -7px -9px 4px', borderRadius: '2px 7px 7px 2px', background: `repeating-linear-gradient(0deg, ${C.CREAM} 0 2px, #E6DCC6 2px 3px)`, boxShadow: '0 30px 60px -18px rgba(0,0,0,.6)' }} />

          {/* birinci səhifə — pop-up qəsr */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '2px 6px 6px 2px', overflow: 'hidden', background: `linear-gradient(180deg, ${C.DUSK} 0%, #8E7CC6 46%, ${C.ROSE} 70%, ${C.CREAM} 71%)`, boxShadow: 'inset 14px 0 18px -14px rgba(0,0,0,.35)' }}>
            <StarField count={14} opacity={0.9} />
            <Moon size={46} style={{ position: 'absolute', right: '14%', top: '9%' }} />
            <div style={{ position: 'absolute', inset: 0, perspective: 700 }}>
              <div style={{ ...pop(0), height: '44%' }}><Hill /></div>
              <div style={{ ...pop(1), bottom: '22%', display: 'flex', justifyContent: 'center' }}><Castle width={230} /></div>
              <div style={{ ...pop(2), height: '26%', background: `linear-gradient(180deg, transparent, ${alpha(C.SAGE, 0.6)} 60%)` }} />
            </div>
            {open && [[22, 30], [74, 24], [50, 14], [30, 54], [70, 50]].map(([x, y], i) => (
              <Sparkle key={i} size={16} color="#FFF3C9" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, animation: `ft-burst 1.1s ease-out ${1.1 + i * 0.1}s both` }} />
            ))}
          </div>

          {/* cild */}
          <div style={{ position: 'absolute', inset: 0, transformOrigin: 'left center', transformStyle: 'preserve-3d', transform: open ? 'rotateY(-168deg)' : 'rotateY(0deg)', transition: 'transform 1.3s cubic-bezier(.55,.05,.25,1) .1s' }}>
            <div style={{
              position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', borderRadius: '3px 8px 8px 3px', overflow: 'hidden',
              background: `repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,.06) 0 1px, transparent 1px 3px), linear-gradient(150deg, #33397A, ${C.NIGHT} 58%, #182044)`,
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.06), inset -6px 0 14px rgba(0,0,0,.25)',
            }}>
              {/* cildin beli */}
              <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 22, background: 'linear-gradient(90deg, #141A38, #2A3070 60%, #1B2250)', boxShadow: '2px 0 4px rgba(0,0,0,.3)' }}>
                {[14, 50, 86].map((p) => <span key={p} style={{ position: 'absolute', left: 0, right: 0, top: `${p}%`, height: 3, background: FOIL }} />)}
              </div>
              {/* qızıl çərçivə + künclər */}
              <div aria-hidden="true" style={{ position: 'absolute', left: 34, right: 12, top: 12, bottom: 12, border: `1.5px solid ${C.GOLD}`, borderRadius: 3 }} />
              <div aria-hidden="true" style={{ position: 'absolute', left: 40, right: 18, top: 18, bottom: 18, border: `.6px solid ${alpha(C.GOLD, 0.6)}` }} />
              <CornerFiligree style={{ left: 30, top: 8 }} />
              <CornerFiligree style={{ right: 8, top: 8, transform: 'scaleX(-1)' }} />
              <CornerFiligree style={{ left: 30, bottom: 8, transform: 'scaleY(-1)' }} />
              <CornerFiligree style={{ right: 8, bottom: 8, transform: 'scale(-1,-1)' }} />

              <div style={{ position: 'absolute', left: 40, right: 18, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 10px' }}>
                <EmblemSlot mono={ot.mono} size={70} border={`1.5px solid ${C.GOLD}`} background="transparent" color={C.GOLD_L} font={serif} style={{ animation: 'none' }}>
                  <CastleMark size={76} />
                </EmblemSlot>
                {ot.show('kicker') && <div style={{ marginTop: 16, fontStyle: 'italic', fontSize: 15.5, color: C.GOLD_L, lineHeight: 1.35 }}>{ot.text('kicker')}</div>}
                {titleOv !== '' && (
                  <div style={{ ...foilText, marginTop: 10, fontFamily: serif, fontWeight: 600, fontSize: 'clamp(34px, 11vw, 46px)', lineHeight: 1.04, animation: 'ft-shine 6s linear infinite', overflowWrap: 'anywhere' }}>
                    {first}{second && <><span style={{ display: 'block', fontSize: '.5em', margin: '2px 0' }}>&amp;</span>{second}</>}
                  </div>
                )}
                {ot.show('meta') && <div style={{ marginTop: 14, fontSize: 13.5, letterSpacing: '.04em', color: alpha(C.CREAM, 0.82) }}>{ot.text('meta')}</div>}
              </div>
            </div>
            {/* cildin içi (açılanda görünür) */}
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', borderRadius: '8px 3px 3px 8px', background: `radial-gradient(circle at 50% 50%, ${alpha(C.LILAC, 0.5)} 1.5px, transparent 2px) 0 0 / 16px 16px, ${C.LILAC_L}` }} />
          </div>
        </div>

        <motion.div animate={open ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ textAlign: 'center' }}>
          {ot.show('cta') && (
            <div style={{ marginTop: 36, minHeight: 50, padding: '13px 30px', display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 999, backgroundImage: FOIL, color: C.NIGHT, fontSize: 16.5, fontStyle: 'italic', fontWeight: 700, boxShadow: '0 0 0 4px rgba(235,212,154,.18), 0 14px 30px rgba(0,0,0,.4)', animation: 'ft-rise .8s ease-out 1s both' }}>
              <Sparkle size={12} color={C.NIGHT} />{ot.text('cta')}<Sparkle size={12} color={C.NIGHT} />
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 13.5, color: alpha(C.CREAM, 0.7), animation: 'ft-fade .8s ease-out 1.4s both, ft-hint 3s ease-in-out 2.2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə — kitab səhifəsi */
function Page({ id, section, title, kicker, sub, children, serif, tone = 'cream' }) {
  const night = tone === 'night'
  const bg = night ? `radial-gradient(130% 90% at 50% 0%, ${C.DUSK}, ${C.NIGHT} 70%)` : tone === 'parch' ? C.PARCH : C.CREAM
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '60px 20px 66px', background: bg, overflow: 'hidden' }}>
      {night && <StarField count={22} opacity={0.7} />}
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
              <Sparkle size={9} color={night ? C.GOLD_L : C.GOLD} style={{ marginTop: 6 }} />
              <Sparkle size={16} color={night ? C.GOLD_L : C.GOLD} />
              <Sparkle size={9} color={night ? C.GOLD_L : C.GOLD} style={{ marginTop: 6 }} />
            </div>
            {title && <h2 style={{ margin: 0, fontFamily: serif, fontWeight: 600, fontSize: 'clamp(31px, 8.8vw, 40px)', lineHeight: 1.08, color: night ? C.GOLD_L : C.VIOLET, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontStyle: 'italic', fontSize: 16, color: night ? alpha(C.CREAM, 0.8) : C.MUTED }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 330, fontSize: 16, color: night ? alpha(C.CREAM, 0.8) : C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: '#FFFFFF', border: `1px solid ${alpha(C.VIOLET, 0.25)}`, borderRadius: 14,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
}
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 999,
  fontSize: 15.5, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.VIOLET : 'transparent', color: on ? C.CREAM : C.VIOLET, border: `1.5px solid ${C.VIOLET}`,
})
const suggest = { bg: '#FFFFFF', border: `1px solid ${alpha(C.VIOLET, 0.22)}`, active: alpha(C.LILAC, 0.25), text: C.INK, table: C.VIOLET, radius: 14 }

/* Qüllə damı — sayğac */
function TowerRoof({ color, delay = 0 }) {
  return (
    <svg viewBox="0 0 80 58" width="100%" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <path d="M40 14v-12" stroke={C.GOLD} strokeWidth="1.4" />
      <path d="M40 2l12 3.4l-12 3.4z" fill={C.ROSE} style={{ transformOrigin: '40px 5px', animation: `ft-flag 2.6s ease-in-out ${delay}s infinite` }} />
      <path d="M6 56Q28 40 40 13Q52 40 74 56Z" fill={color} />
      <path d="M6 56Q28 40 40 13L40 56Z" fill="#FFFFFF" opacity=".16" />
      <rect x="3" y="54" width="74" height="5" rx="2" fill="#4A3C80" />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function FairyTaleTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const serif = theme.fonts.heading
  const body = theme.fonts.body
  const T = TXT[lang] || TXT.az
  const age = inv.age

  return (
    <div data-ft data-enter={enterDirection(ID)} style={{
      backgroundColor: C.CREAM,
      minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.VIOLET, 0.2),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <BookOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.NIGHT, border: `1.5px solid ${C.GOLD}`, boxShadow: '0 8px 18px rgba(31,42,82,.35)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.GOLD_L} idle={alpha(C.GOLD_L, 0.35)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.NIGHT, 0.92), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.GOLD, 0.35)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.CREAM, 0.8), fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ ...foilText, fontFamily: serif, fontWeight: 600, fontSize: 19 }}>Digitoy</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={{ ...theme, background: C.NIGHT, surface: '#2A3366', text: C.CREAM, muted: alpha(C.CREAM, 0.75) }} />
          </header>

          {/* HERO — «Biri var idi, biri yox idi…» */}
          <section style={{ position: 'relative', overflow: 'hidden', paddingTop: 36, background: `linear-gradient(180deg, ${C.NIGHT} 0%, ${C.DUSK} 34%, #8E7CC6 58%, ${C.ROSE} 80%, ${C.CREAM} 97%)` }}>
            <StarField count={30} opacity={0.95} />
            <Moon size={62} style={{ position: 'absolute', right: '9%', top: 26, animation: 'ft-float 7s ease-in-out infinite' }} />
            <div style={{ position: 'relative', textAlign: 'center', padding: '0 22px' }}>
              <div style={{ fontStyle: 'italic', fontSize: 17, color: C.GOLD_L, animation: 'ft-rise .9s ease-out .2s both' }}>{L('hero', 'kicker', T.once)}</div>
              <h1 style={{ ...foilText, margin: '10px 0 0', fontFamily: serif, fontWeight: 600, fontSize: 'clamp(48px, 15vw, 74px)', lineHeight: 1, textWrap: 'balance', overflowWrap: 'anywhere', filter: 'drop-shadow(0 3px 10px rgba(20,24,60,.45))', animation: 'ft-shine 7s linear infinite, ft-rise 1s ease-out .35s both' }}>
                {inv.heroTitle ? inv.heroTitle : inv.isCouple ? <>{inv.groom} &amp; {inv.bride}</> : inv.single}
              </h1>
              {age && <div style={{ marginTop: 10, fontStyle: 'italic', fontSize: 18, color: C.CREAM, animation: 'ft-rise .9s ease-out .5s both' }}>{ageSentence(age, lang)}</div>}
            </div>

            <div style={{ position: 'relative', height: 'min(84vw, 380px)', marginTop: 8 }}>
              <Cloud width={130} opacity={0.55} style={{ position: 'absolute', left: '-6%', top: '30%', animation: 'ft-float 9s ease-in-out infinite' }} />
              <Cloud width={110} opacity={0.5} style={{ position: 'absolute', right: '-4%', top: '18%', animation: 'ft-float 11s ease-in-out 2s infinite' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '46%' }}><Hill /></div>
              <Topiary size={40} style={{ position: 'absolute', left: '9%', bottom: '14%' }} />
              <Topiary size={30} tone="#7E9C79" style={{ position: 'absolute', left: '22%', bottom: '8%' }} />
              <Topiary size={42} style={{ position: 'absolute', right: '8%', bottom: '12%' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: '26%', display: 'flex', justifyContent: 'center' }}>
                <Castle width={Math.min(320, 300)} style={{ width: 'min(76vw, 320px)', height: 'auto' }} />
              </div>
              {/* yaş möhürü — yoxdursa tac */}
              <AgeSeal size={94} style={{ position: 'absolute', left: '5%', top: '8%', transform: 'rotate(-9deg)', animation: 'ft-float 6s ease-in-out 1s infinite' }}>
                {age ? (
                  <>
                    <span style={{ fontFamily: serif, fontWeight: 700, fontSize: age > 9 ? 34 : 40, lineHeight: 0.9, color: C.NIGHT }}>{age}</span>
                    <span style={{ fontSize: 12, letterSpacing: '.06em', color: C.NIGHT, marginTop: 2 }}>{ageWord(age, lang)}</span>
                  </>
                ) : <Crown size={40} color={C.NIGHT} />}
              </AgeSeal>
            </div>

            {/* tarix lenti */}
            <div style={{ position: 'relative', margin: '-6px auto 0', width: 'min(92vw, 390px)', height: 58 }}>
              <svg viewBox="0 0 390 58" width="100%" height="58" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
                <path d="M0 14H34V50H0L12 32Z" fill={C.ROSE_D} /><path d="M390 14H356V50H390L378 32Z" fill={C.ROSE_D} />
                <path d="M34 50L48 58V42ZM356 50L342 58V42Z" fill="#9C5E70" />
                <rect x="34" y="6" width="322" height="44" rx="2" fill={C.ROSE_D} />
                <rect x="34" y="6" width="322" height="44" rx="2" fill="url(#ft-rib)" />
                <defs><linearGradient id="ft-rib" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" stopOpacity=".28" /><stop offset=".5" stopColor="#FFFFFF" stopOpacity="0" /><stop offset="1" stopColor="#000000" stopOpacity=".12" /></linearGradient></defs>
                <path d="M40 12H350M40 44H350" stroke="#FBE3EA" strokeWidth=".8" strokeDasharray="3 3" />
              </svg>
              <div style={{ position: 'absolute', left: '11%', right: '11%', top: 6, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: serif, fontWeight: 600, fontSize: 'clamp(16px, 4.6vw, 19px)', color: '#FFF8F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {inv.fullDate}
              </div>
            </div>
            <div style={{ position: 'relative', padding: '18px 22px 30px', textAlign: 'center' }}>
              <div style={{ fontSize: 16.5, color: C.INK }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 15, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              <Flourish width={130} style={{ marginTop: 18 }} />
              <p style={{ margin: '14px auto 0', maxWidth: 330, fontStyle: 'italic', fontSize: 17.5, lineHeight: 1.6, color: C.MUTED }}>{tr.inv_join}</p>
            </div>
          </section>

          {/* SAYĞAC — dörd nağıl qülləsi */}
          {S.countdown && (
            <Page serif={serif} tone="night" title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 380, margin: '0 auto', alignItems: 'end' }}>
                {[
                  { v: cd.days, l: cd.labels.days, c: C.VIOLET },
                  { v: cd.hours, l: cd.labels.hours, c: C.ROSE_D },
                  { v: cd.minutes, l: cd.labels.minutes, c: '#6F8F6C' },
                  { v: cd.seconds, l: cd.labels.seconds, c: C.GOLD_D, pop: true },
                ].map(({ v, l, c, pop }, i) => (
                  <div key={l} style={{ textAlign: 'center', marginTop: i % 2 ? 0 : 14 }}>
                    <TowerRoof color={c} delay={i * 0.4} />
                    <div style={{ margin: '0 8%', padding: '12px 0 12px', background: 'linear-gradient(180deg, #FBF6FE, #E4D8F1)', borderRadius: '0 0 6px 6px', boxShadow: '0 16px 26px -14px rgba(0,0,0,.6), inset -8px 0 12px -10px rgba(94,74,156,.5)' }}>
                      <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 'clamp(22px, 7vw, 30px)', lineHeight: 1, color: C.NIGHT, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></div>
                      <div aria-hidden="true" style={{ width: 12, height: 16, margin: '8px auto 6px', borderRadius: '6px 6px 0 0', background: '#FFD98A', animation: 'ft-glow 3s ease-in-out infinite' }} />
                      <div style={{ fontSize: 12.5, color: C.MUTED }}>{l}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Page>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN — sehrli xəritə */}
          {S.venue && (
            <Page serif={serif} tone="parch" title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ position: 'relative', maxWidth: 420, margin: '0 auto', padding: 10, background: '#F8EED9', borderRadius: 6, boxShadow: `0 0 0 1px ${alpha(C.GOLD, 0.55)}, 0 0 0 6px #F8EED9, 0 0 0 7px ${alpha(C.GOLD, 0.4)}, 0 22px 38px -22px rgba(45,42,74,.55)` }}>
                <div style={{ border: `1px dashed ${alpha(C.GOLD_D, 0.55)}`, borderRadius: 3, padding: 5 }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.VIOLET} height="clamp(250px, 70vw, 320px)"
                    map={{ opacity: 0.82, filter: 'sepia(.4) saturate(.7) contrast(.95)', tintOpacity: 0.16, tint: C.VIOLET, blend: 'multiply' }}
                    frame={<CastlePin />}
                    fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: `radial-gradient(circle at 30% 40%, ${alpha(C.SAGE, 0.35)}, transparent 40%), radial-gradient(circle at 70% 70%, ${alpha(C.LILAC, 0.35)}, transparent 40%), #F3E7D1` }}><CastlePin /></div>}
                  />
                </div>
                <Compass size={62} style={{ position: 'absolute', right: -12, top: -18 }} />
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: serif, fontWeight: 600, fontSize: 26, lineHeight: 1.2, color: C.VIOLET }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 15.5, color: C.MUTED }}>{weddingData.venueNote}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={btn(true)}>{tr.inv_directions_btn}</a>}
                {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={btn(!inv.dirUrl)}>Maps</a>}
                {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Waze</a>}
                {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Apple</a>}
              </div>
            </Page>
          )}

          {/* PROQRAM — nağılın fəsilləri */}
          {S.program && (
            <Page serif={serif} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <ol style={{ listStyle: 'none', margin: '0 auto', padding: 0, maxWidth: 400 }}>
                {timeline.events.map((ev, i) => {
                  const [cap, rest] = splitFirst(ev.label)
                  return (
                    <li key={i} style={{ display: 'grid', gridTemplateColumns: '58px minmax(0, 1fr)', gap: 14, alignItems: 'start', padding: '16px 0', borderBottom: i < timeline.events.length - 1 ? `1px dashed ${alpha(C.GOLD, 0.5)}` : 'none' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}><Vignette kind={i} size={46} /></div>
                        <div style={{ marginTop: 5, fontSize: 11.5, letterSpacing: '.06em', color: C.GOLD_D, whiteSpace: 'nowrap' }}>{T.chapter} {ROMAN[i] || i + 1}</div>
                      </div>
                      <div style={{ paddingTop: 2 }}>
                        <div style={{ fontSize: 14.5, color: C.VIOLET, letterSpacing: '.04em', fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                        <div style={{ marginTop: 2, fontSize: 20, lineHeight: 1.3, color: C.INK }}>
                          <span style={{ fontFamily: serif, fontWeight: 700, fontSize: '1.65em', lineHeight: 0, color: C.GOLD_D, marginRight: 1 }}>{cap}</span>{rest}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ol>
              <div style={{ marginTop: 22, textAlign: 'center', fontStyle: 'italic', fontSize: 16, color: C.MUTED }}>{T.end}</div>
            </Page>
          )}

          {S.dresscode && (
            <Page serif={serif} tone="parch" title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={serif} align="center" italic />
            </Page>
          )}

          {/* MASA — sehrli güzgü */}
          {S.seating && !seating.isEmpty && (
            <Page serif={serif} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <input {...seatInputProps(inv, 'ft-seat-list')} style={field} />
              <SeatSuggest inv={inv} id="ft-seat-list" c={{ ...suggest, font: body }} />
              {seating.showNotFound && <div style={{ marginTop: 12, fontSize: 15, color: C.MUTED, textAlign: 'center' }}>{tr.inv_seat_fullname}</div>}
              {seating.selected && (
                <div style={{ marginTop: 26, textAlign: 'center', animation: 'ft-rise .6s ease-out both' }}>
                  <div style={{ fontSize: 17, color: C.INK }}>{seating.selected.full_name}</div>
                  <div style={{ marginTop: 14 }}>
                    <MirrorFrame width={220}>
                      <span style={{ fontStyle: 'italic', fontSize: 13, color: C.MUTED, lineHeight: 1.3 }}>{T.mirror}</span>
                      <span style={{ marginTop: 6, fontSize: 13, letterSpacing: '.14em', color: C.VIOLET }}>{T.table}</span>
                      <span style={{ fontFamily: serif, fontWeight: 700, fontSize: tableSize(tableNum(seating.selected.table_id), 64), lineHeight: 1, color: C.NIGHT }}>{tableNum(seating.selected.table_id)}</span>
                      <Sparkle size={14} color={C.GOLD} style={{ marginTop: 4, animation: 'ft-twinkle 2.4s ease-in-out infinite' }} />
                    </MirrorFrame>
                  </div>
                  {seating.tablemates.length > 0 && <div style={{ marginTop: 16, fontSize: 15.5, color: C.MUTED, lineHeight: 1.6 }}>{seating.tablemates.map((g) => g.full_name).join(', ')}</div>}
                  <button onClick={seating.reset} data-press style={{ marginTop: 6, background: 'none', border: 'none', color: C.VIOLET, fontSize: 15.5, minHeight: 44, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: body }}>
                    {seatingL.again || 'Yenidən axtar'}
                  </button>
                </div>
              )}
            </Page>
          )}

          {/* FOTOLAR — portret zalı */}
          {S.gallery && (
            <Page id="gallery-section" serif={serif} tone="parch" title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, marginBottom: 30, alignItems: 'end' }}>
                  {gallery.demoPhotos.map((url, i) => {
                    const arch = i % 3 === 1
                    /* Bir element: foto yüklənməsə hidePhoto bütün çərçivəni gizlədir */
                    return (
                      <div key={i} style={{ margin: 6, aspectRatio: arch ? '3 / 4.4' : '3 / 4', overflow: 'hidden', borderRadius: arch ? '999px 999px 4px 4px' : 4, background: alpha(C.LILAC, 0.3), boxShadow: `0 0 0 3px ${C.CREAM}, 0 0 0 5px ${C.GOLD}, 0 0 0 6px ${C.GOLD_D}, 0 12px 20px -8px rgba(45,42,74,.5)` }}>
                        <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </div>
                    )
                  })}
                </div>
              )}
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: 12, background: '#FFFFFF', borderRadius: 10, boxShadow: `0 0 0 1.5px ${C.GOLD}, 0 0 0 5px #FFFFFF, 0 0 0 6px ${alpha(C.GOLD, 0.5)}` }}>
                  <QRCodeSVG value={gallery.photoShareUrl} size={128} bgColor="#FFFFFF" fgColor={C.NIGHT} level="M" />
                </div>
                <div style={{ marginTop: 16, fontSize: 15, color: C.MUTED }}>{tr.inv_scan_upload}</div>
                <a data-press href={gallery.photoShareUrl} style={{ ...btn(true), marginTop: 16 }}>{tr.inv_gallery_btn}</a>
                <p style={{ margin: '16px auto 0', maxWidth: 340, fontSize: 15.5, color: C.MUTED, lineHeight: 1.65 }}>{kidsGalleryDesc(props.adminOverrides, tr, lang)}</p>
              </div>
            </Page>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Page serif={serif} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.VIOLET, 0.4), hair: alpha(C.GOLD, 0.35), accent: C.VIOLET,
                font: body, display: serif, doneMark: <Crown size={36} style={{ margin: '0 auto 10px' }} />,
                marker: (a) => <Wand active={a} />, suggest: { ...suggest, font: body },
              }} />
            </Page>
          )}

          {/* SEHRLİ ARZULAR */}
          {S.guestbook && (
            <Page serif={serif} tone="parch" title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 30 }}>
                <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={field} />
                <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...field, resize: 'none', lineHeight: 1.5 }} />
                <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...btn(gbook.canSubmit), width: '100%', opacity: gbook.canSubmit ? 1 : 0.5, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}>
                  {gbook.sending ? gbookL.sending : gbookL.btn}
                </button>
                {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 14, color: C.ROSE_D }}>⚠ {gbookL.error}</p>}
              </form>
              <div style={{ display: 'grid', gap: 16 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ position: 'relative', margin: 0, padding: '26px 20px 16px', background: '#FFFFFF', borderRadius: 16, boxShadow: `0 0 0 1px ${alpha(C.LILAC, 0.6)}, 0 14px 24px -18px rgba(45,42,74,.55)`, transform: `rotate(${i % 2 ? 0.6 : -0.6}deg)`, textAlign: 'center' }}>
                      <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: -12, marginLeft: -13, width: 26, height: 26, borderRadius: '50%', background: C.NIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkle size={13} color={C.GOLD_L} />
                      </span>
                      <blockquote style={{ margin: 0, fontStyle: 'italic', fontSize: 17.5, lineHeight: 1.55, color: C.INK }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 10, fontFamily: serif, fontWeight: 600, fontSize: 16, color: C.VIOLET }}>{msg.name}{msg.date ? <span style={{ fontFamily: body, fontWeight: 400, fontSize: 13.5, color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}</figcaption>
                    </figure>
                  )
                })}
              </div>
            </Page>
          )}

          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={serif} />
        </motion.div>
      )}
    </div>
  )
}

function CastlePin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -24, top: -48, width: 48, height: 48, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', background: C.NIGHT, boxShadow: `0 0 0 2px ${C.GOLD}, 0 10px 18px rgba(31,42,82,.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ transform: 'rotate(45deg)' }}><CastleMark size={28} /></span>
      </span>
    </span>
  )
}
