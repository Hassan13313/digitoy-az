import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../_shared/MapSection'
import { MonoContent } from '../_shared/MonoContent'
import { Reveal, enterDirection } from '../_shared/motion'
import { hidePhoto } from '../../utils/photoGallery'
import { getTemplateTheme } from '../templateConfig'
import { useInvitation, useGate, openingNames, seatInputProps, rsvpInputProps, rsvpOptions, rsvpState, alpha } from '../_shared/useInvitation'
import { MusicFab, EqBars, SeatSuggest, RsvpSuggest, RsvpStatus, StoryBlock, InvitationEnd } from '../_shared/invitationKit'

/* ─────────────────────────────────────────────────────────────────────────────
   VINYL RECORD — «Məhdud tirajlı LP» (premium redizayn, 2026-10)

   Konsept: audiofil hi-fi və 60-cı illərin caz albomu. Açılış — qoz ağacı
   gövdəli vallı (turntable) yuxarıdan: alüminium disk, plyonka, etiketdə
   monoqram və dairəvi yazı. Toxunanda tonarm yivə enir, plyonka fırlanır və
   etiketin içinə girilir. Daxildə:
     hero      → albom üz qabığı: mid-century həndəsə, «STEREO» nişanı,
                 qabıqdan çıxan plyonka
     sayğac    → hi-fi gücləndiricinin mavi VU-metri + kəhrəba VFD rəqəmləri
     məkan     → xəritə plyonkanın etiketində, mil — məkan nişanı
     proqram   → arxa qabıqdakı trek siyahısı (A1, A2 … B1)
     masa      → musiqi avtomatının (jukebox) seçim kartı
     RSVP      → daxili kağız qab, LED-li hi-fi düymələr
     arzular   → layner qeydləri
   Rəng: vinil qarası, qoz ağacı, krem, yanıq narıncı, firuzəyi, xardal.
   Şriftlər: Young Serif (70-ci illər serifi) · Montserrat (həndəsi).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('vinyl-record')
const ID = 'vinyl-record'

const LABELS = {
  countdown: { title: { az: 'Plyonka başlayana qədər', en: 'Until the needle drops', ru: 'Пока не опустится игла' } },
  venue:     { title: { az: 'Səhnə', en: 'The stage', ru: 'Сцена' } },
  program:   { title: { az: 'Trek siyahısı', en: 'Tracklist', ru: 'Треклист' } },
  dresscode: { title: { az: 'Səhnə geyimi', en: 'Stage attire', ru: 'Сценический образ' } },
  seating:   { title: { az: 'Sizin masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Albom fotoları', en: 'Album photos', ru: 'Фото альбома' } },
  rsvp:      { title: { az: 'Konsertə gəlirsiniz?', en: 'Coming to the show?', ru: 'Придёте на концерт?' } },
  guestbook: { title: { az: 'Layner qeydləri', en: 'Liner notes', ru: 'Заметки на конверте' } },
}

const TXT = {
  az: { track: 'Trek', side: 'Tərəf', table: 'Masa', remain: 'Qalan vaxt' },
  en: { track: 'Track', side: 'Side', table: 'Table', remain: 'Time remaining' },
  ru: { track: 'Трек', side: 'Сторона', table: 'Стол', remain: 'Осталось' },
}

const CHAR = '#151312'
const VINYL = '#0E0E0E'
const CREAM = '#F1E8D6'
const WALNUT = '#4A2F1B'
const ORANGE = '#D2642F'
const TEAL = '#1F5C5B'
const MUSTARD = '#E2A93B'
const MUTED = '#B3A894'
const WOOD = `linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.05) 30%, rgba(0,0,0,.35)), repeating-linear-gradient(92deg, #4A2F1B 0 7px, #553621 7px 10px, #41281A 10px 16px, #5B3A24 16px 19px, #46301D 19px 27px)`

const KEYFRAMES = `
@keyframes vr-spin  { to { transform: rotate(360deg) } }
@keyframes vr-rise  { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes vr-fade  { from { opacity: 0 } to { opacity: 1 } }
@keyframes vr-hint  { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
[data-vr] span[aria-hidden="true"], [data-vr] svg[aria-hidden="true"], [data-vr] div[aria-hidden="true"] { pointer-events: none; }
[data-vr] ::placeholder { color: rgba(179,168,148,.65); }
[data-vr] .vr-paper ::placeholder { color: rgba(21,19,18,.4); }
[data-vr] input:focus-visible, [data-vr] textarea:focus-visible { border-color: ${ORANGE} !important; outline: none; }
[data-vr] button:focus-visible, [data-vr] a:focus-visible, [data-vr] [role="button"]:focus-visible { outline: 1.5px solid ${ORANGE}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-vr] *, [data-vr] { animation: none !important; transition: none !important; } }
`

const upper = (s, lang) => String(s || '').toLocaleUpperCase(lang === 'ru' ? 'ru' : lang === 'en' ? 'en' : 'az')
const GROOVES = Array.from({ length: 34 }, (_, i) => 38 + i * 1.8)

/* ─── Plyonka ─── */
function Record({ label = ORANGE, children, arcText = '', head, spin = false, fast = false, uid = 'r' }) {
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1' }}>
      <div style={{ position: 'absolute', inset: 0, animation: spin ? `vr-spin ${fast ? 0.9 : 1.8}s linear infinite` : undefined }}>
        <svg viewBox="-100 -100 200 200" width="100%" height="100%" aria-hidden="true" style={{ display: 'block' }}>
          <defs>
            <path id={`vr-arc-${uid}`} d="M-25 0A25 25 0 1 1 25 0A25 25 0 1 1 -25 0" />
          </defs>
          <circle r="99" fill={VINYL} />
          {GROOVES.map((r, i) => <circle key={r} r={r} fill="none" stroke={i % 3 ? '#1C1C1C' : '#262626'} strokeWidth=".7" />)}
          <circle r="99" fill="none" stroke="#2C2C2C" strokeWidth="1.2" />
          <circle r="35" fill={label} />
          <circle r="33" fill="none" stroke={CREAM} strokeOpacity=".35" strokeWidth=".5" />
          {arcText && (
            <text fontFamily={head} fontSize="5.4" letterSpacing="1.2" fill={CREAM}>
              <textPath href={`#vr-arc-${uid}`} startOffset="50%" textAnchor="middle">{arcText}</textPath>
            </text>
          )}
          <circle r="2.6" fill={CHAR} />
        </svg>
      </div>
      {/* sabit işıq əksi — plyonka fırlansa da işıq yerində qalır */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: '0.5%', borderRadius: '50%', pointerEvents: 'none', background: 'conic-gradient(from 20deg, transparent 0 8%, rgba(255,255,255,.13) 13%, transparent 19%, transparent 50%, rgba(255,255,255,.1) 63%, transparent 69%)', WebkitMask: 'radial-gradient(circle, transparent 35.5%, #000 36%)', mask: 'radial-gradient(circle, transparent 35.5%, #000 36%)' }} />
      {children && <div style={{ position: 'absolute', inset: '36%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>{children}</div>}
    </div>
  )
}

/* Kiçik plyonka — bölmə nişanı */
function Disc({ size = 22, color = ORANGE }) {
  return (
    <svg viewBox="-12 -12 24 24" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
      <circle r="11.5" fill={VINYL} stroke="#333" strokeWidth=".6" />
      <circle r="8" fill="none" stroke="#2A2A2A" strokeWidth=".6" />
      <circle r="4.2" fill={color} />
      <circle r=".9" fill={CHAR} />
    </svg>
  )
}

/* ═══ 01 — AÇILIŞ: vallı ═══ */
function TurntableOpening({ inv, theme }) {
  const { ot, lang } = inv
  const gate = useGate({ inv, ms: 1600 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const head = theme.fonts.heading
  const arc = upper(`${titleOv !== undefined ? titleOv : [first, second].filter(Boolean).join(' & ')} · ${ot.text('kicker') || 'Side A'} · 33⅓`, lang)
  return (
    <motion.div {...gate.gateProps} data-vr
      animate={gate.opening ? { opacity: 0 } : {}}
      transition={{ duration: 0.45, delay: 1.15 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: WOOD, backgroundColor: WALNUT, color: CREAM, fontFamily: theme.fonts.body, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
      <motion.div
        animate={gate.opening ? { scale: 2.6, opacity: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.7, 0, 0.84, 0], delay: 0.7 }}
        style={{ position: 'relative', width: 'min(80vw, 320px)', aspectRatio: '1', animation: 'vr-fade 1s ease-out both' }}>
        {/* alüminium disk */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: '-4%', borderRadius: '50%', background: 'conic-gradient(from 0deg, #B9BCBF, #E8EAEC, #A7AAAE, #DADDE0, #B0B3B7, #E6E8EA, #B9BCBF)', boxShadow: '0 20px 40px rgba(0,0,0,.5), inset 0 0 0 1px rgba(0,0,0,.25)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: '-4%', borderRadius: '50%', background: 'repeating-conic-gradient(rgba(0,0,0,.35) 0 1.2deg, transparent 1.2deg 6deg)', WebkitMask: 'radial-gradient(circle, transparent 66%, #000 66.5%, #000 69%, transparent 69.5%)', mask: 'radial-gradient(circle, transparent 66%, #000 66.5%, #000 69%, transparent 69.5%)' }} />
        <div style={{ position: 'absolute', inset: 0 }}>
          <Record spin={gate.opening} fast head={head} arcText={arc} uid="open">
            <div style={{ width: '62%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '50%', fontFamily: head, fontSize: 'clamp(14px, 4.4vw, 18px)', color: CREAM, animation: 'vr-fade 1s ease-out .6s both' }}>
              <MonoContent mono={ot.mono} ornament={<Disc size={18} color={MUSTARD} />} imgStyle={{ borderRadius: '50%' }} />
            </div>
          </Record>
        </div>
        {/* tonarm */}
        <motion.svg viewBox="0 0 120 240" aria-hidden="true"
          animate={gate.opening ? { rotate: 24 } : { rotate: 0 }}
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          style={{ position: 'absolute', right: '-12%', top: '-10%', width: '40%', height: '80%', overflow: 'visible', transformOrigin: '76% 12%' }}>
          <circle cx="91" cy="29" r="20" fill="#2A2A2A" stroke="#888" strokeWidth="1.2" />
          <circle cx="91" cy="29" r="11" fill="#C9CCCF" />
          <rect x="84" y="-6" width="14" height="18" rx="3" fill="#1A1A1A" />
          <path d="M91 29L84 190L64 214" fill="none" stroke="#D8DBDE" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M91 29L84 190L64 214" fill="none" stroke="#8F9397" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="50" y="206" width="22" height="16" rx="2" fill="#1E1E1E" transform="rotate(-40 61 214)" />
        </motion.svg>
      </motion.div>

      <motion.div animate={gate.opening ? { opacity: 0, y: 16 } : {}} transition={{ duration: 0.4 }}
        style={{ marginTop: 'clamp(28px, 6vh, 46px)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {ot.show('kicker') && <div style={{ fontSize: 12, letterSpacing: '.3em', color: MUSTARD, animation: 'vr-rise .8s ease-out .8s both' }}>{upper(ot.text('kicker'), lang)}</div>}
        {titleOv !== '' && (
          <div style={{ marginTop: 10, fontFamily: head, fontSize: 'clamp(30px, 9.6vw, 40px)', lineHeight: 1.1, color: CREAM, animation: 'vr-rise 1s ease-out 1s both' }}>
            {first}{second && <><span style={{ color: ORANGE, margin: '0 .25em' }}>&amp;</span>{second}</>}
          </div>
        )}
        {ot.show('meta') && <div style={{ marginTop: 10, fontSize: 14, letterSpacing: '.12em', color: MUTED, animation: 'vr-rise .8s ease-out 1.3s both' }}>{ot.text('meta')}</div>}
        {ot.show('cta') && (
          <div style={{ marginTop: 24, minHeight: 50, padding: '13px 26px', display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 999, background: CREAM, color: CHAR, fontWeight: 600, fontSize: 14.5, letterSpacing: '.06em', boxShadow: '0 10px 24px rgba(0,0,0,.35)', animation: 'vr-rise .8s ease-out 1.6s both' }}>
            <span aria-hidden="true" style={{ width: 0, height: 0, borderLeft: `9px solid ${ORANGE}`, borderTop: '6px solid transparent', borderBottom: '6px solid transparent' }} />
            {ot.text('cta')}
          </div>
        )}
        {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 13, color: MUTED, animation: 'vr-fade .8s ease-out 2s both, vr-hint 3s ease-in-out 2.8s infinite' }}>{ot.text('hint')}</div>}
      </motion.div>
    </motion.div>
  )
}

/* Bölmə — trek nömrəsi + başlıq */
function Track({ id, section, n, title, kicker, sub, children, head, T, center = false }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '56px 20px 62px', borderTop: `1px solid ${alpha(CREAM, 0.08)}` }}>
      <Reveal style={{ maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ marginBottom: 28, textAlign: center ? 'center' : 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: center ? 'center' : 'flex-start', fontSize: 12, letterSpacing: '.2em', color: ORANGE, fontWeight: 600 }}>
              <Disc size={18} />{n ? `${T.track} ${String(n).padStart(2, '0')}` : ''}
            </div>
            {title && <h2 style={{ margin: '12px 0 0', fontFamily: head, fontWeight: 400, fontSize: 'clamp(30px, 8.8vw, 38px)', lineHeight: 1.12, color: CREAM, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 6, fontSize: 14, color: MUTED }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px 0 0', maxWidth: 340, fontSize: 15, color: MUTED, lineHeight: 1.55, marginInline: center ? 'auto' : 0 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: alpha(CREAM, 0.05), border: `1px solid ${alpha(CREAM, 0.2)}`, borderRadius: 999,
  padding: '14px 20px', fontSize: 15.5, color: CREAM, outline: 'none',
}
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 48, padding: '12px 22px', borderRadius: 999,
  fontSize: 14.5, fontWeight: 600, letterSpacing: '.04em', textDecoration: 'none', cursor: 'pointer',
  background: on ? ORANGE : 'transparent', color: on ? CREAM : CREAM, border: `1px solid ${on ? ORANGE : alpha(CREAM, 0.3)}`,
})

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function VinylRecordTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, rsvp, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = TXT[lang] || TXT.az
  let tn = 0
  const next = () => ++tn
  const P = { head, T }
  const half = Math.ceil(timeline.events.length / 2)
  const needle = -48 + (Number(cd.seconds) / 59) * 96
  const [, m, d] = String(weddingData.date || '').split('-')

  return (
    <div data-vr data-enter={enterDirection(ID)} style={{
      background: `radial-gradient(120% 50% at 50% 0%, #2A2420, ${CHAR} 60%)`, backgroundColor: CHAR,
      minHeight: '100vh', fontFamily: body, color: CREAM, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(ORANGE, 0.3),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <TurntableOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: VINYL, border: '1px solid #333' }}>
        {({ playing }) => <EqBars playing={playing} color={ORANGE} idle={alpha(CREAM, 0.3)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(CHAR, 0.9), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(CREAM, 0.1)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: MUTED, fontSize: 14, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: head, fontSize: 16 }}><Disc size={16} />Digitoy Records</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — albom qabığı */}
          <section style={{ padding: '30px 16px 30px' }}>
            <div style={{ position: 'relative', maxWidth: 440, margin: '0 auto', paddingRight: '16%' }}>
              <div aria-hidden="true" style={{ position: 'absolute', right: 0, top: '4%', width: '78%', animation: 'vr-rise 1s ease-out .3s both' }}>
                <Record head={head} arcText="DIGITOY RECORDS · STEREO · 33⅓ RPM" uid="hero" />
              </div>
              <div style={{
                position: 'relative', aspectRatio: '1', overflow: 'hidden', background: TEAL, boxShadow: '12px 0 24px rgba(0,0,0,.45), 0 30px 50px -30px #000',
              }}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                  <circle cx="30" cy="34" r="26" fill={ORANGE} />
                  <circle cx="30" cy="34" r="15" fill="none" stroke={CREAM} strokeWidth=".5" />
                  <path d="M58 0A42 42 0 0 1 100 42V0Z" fill={MUSTARD} />
                  <circle cx="74" cy="56" r="11" fill="none" stroke={CREAM} strokeWidth="2.6" />
                  {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${52 + k * 6} 70V100`} stroke={CREAM} strokeOpacity=".22" strokeWidth="2" />)}
                </svg>
                <span style={{ position: 'absolute', top: 12, right: 12, padding: '3px 7px', border: `1.2px solid ${CREAM}`, fontSize: 10, fontWeight: 700, letterSpacing: '.2em', color: CREAM }}>STEREO</span>
                <div style={{ position: 'absolute', left: '7%', right: '7%', bottom: '7%' }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '.22em', color: MUSTARD }}>{upper(L('hero', 'kicker', inv.eventLabel), lang)}</div>
                  <h1 style={{ margin: '6px 0 0', fontFamily: head, fontWeight: 400, fontSize: 'clamp(30px, 9vw, 42px)', lineHeight: 1.02, color: CREAM, textWrap: 'balance' }}>
                    {inv.heroTitle ? inv.heroTitle : inv.isCouple ? <>{inv.groom}<br /><span style={{ color: MUSTARD }}>&amp;</span> {inv.bride}</> : inv.single}
                  </h1>
                </div>
              </div>
            </div>
            <div style={{ maxWidth: 440, margin: '22px auto 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 14 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: head, fontSize: 21 }}>{inv.fullDate}</div>
                <div style={{ marginTop: 4, fontSize: 14.5, color: MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
                {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 4, fontSize: 14, color: MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.16em', color: ORANGE, whiteSpace: 'nowrap' }}>DTR-{d}{m}</div>
            </div>
            <p style={{ maxWidth: 440, margin: '18px auto 0', fontSize: 15.5, lineHeight: 1.6, color: MUTED }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — VU-metr */}
          {S.countdown && (
            <Track {...P} n={next()} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ padding: 16, borderRadius: 10, background: 'repeating-linear-gradient(180deg, #1B1B1B 0 1px, #151515 1px 3px)', boxShadow: 'inset 0 1px 0 #333, 0 20px 40px -20px #000' }}>
                <div style={{ position: 'relative', height: 132, borderRadius: 6, overflow: 'hidden', background: 'radial-gradient(120% 100% at 50% 100%, #5FC3F0, #1E78B4 55%, #0E3E63)', boxShadow: 'inset 0 0 18px rgba(0,0,0,.6)' }}>
                  <svg viewBox="-100 -100 200 110" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
                    <path d="M-76 -14A80 80 0 0 1 76 -14" fill="none" stroke="#0A1E2E" strokeWidth="1.2" />
                    <path d="M40 -66A80 80 0 0 1 76 -14" fill="none" stroke="#C8412F" strokeWidth="3" />
                    {Array.from({ length: 13 }, (_, i) => {
                      const a = (-140 + i * (100 / 12)) * Math.PI / 180
                      return <path key={i} d={`M${(Math.cos(a) * 80).toFixed(1)} ${(Math.sin(a) * 80 + 10).toFixed(1)}L${(Math.cos(a) * (i % 3 ? 74 : 70)).toFixed(1)} ${(Math.sin(a) * (i % 3 ? 74 : 70) + 10).toFixed(1)}`} stroke="#0A1E2E" strokeWidth="1" />
                    })}
                    <text y="-30" textAnchor="middle" fontFamily={body} fontSize="9" letterSpacing="2" fill="#0A1E2E">VU</text>
                    <g style={{ transform: `rotate(${needle}deg)`, transformOrigin: '0px 10px', transition: 'transform .5s cubic-bezier(.3,1.6,.5,1)' }}>
                      <path d="M0 10L0 -78" stroke="#111" strokeWidth="1.4" />
                    </g>
                    <circle cx="0" cy="10" r="7" fill="#111" />
                  </svg>
                </div>
                <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 8 }}>
                  {[
                    { v: cd.days, l: cd.labels.days },
                    { v: cd.hours, l: cd.labels.hours },
                    { v: cd.minutes, l: cd.labels.minutes },
                    { v: cd.seconds, l: cd.labels.seconds },
                  ].map(({ v, l }) => (
                    <div key={l} style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ fontFamily: body, fontWeight: 500, fontSize: 'clamp(26px, 8vw, 34px)', lineHeight: 1, color: '#FFB547', textShadow: '0 0 10px rgba(255,170,60,.65)', fontVariantNumeric: 'tabular-nums' }}>{String(v).padStart(2, '0')}</div>
                      <div style={{ marginTop: 6, fontSize: 10.5, fontWeight: 600, letterSpacing: '.16em', color: MUTED }}>{upper(l, lang)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Track>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN — etiketdə xəritə */}
          {S.venue && (
            <Track {...P} n={next()} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ position: 'relative', width: 'min(86vw, 340px)', aspectRatio: '1', margin: '0 auto' }}>
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `repeating-radial-gradient(circle, ${VINYL} 0 2px, #1D1D1D 2px 3px)`, boxShadow: '0 24px 40px -20px #000' }} />
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'conic-gradient(from 20deg, transparent 0 8%, rgba(255,255,255,.12) 13%, transparent 19%, transparent 50%, rgba(255,255,255,.09) 63%, transparent 69%)' }} />
                <div style={{ position: 'absolute', inset: '17%', borderRadius: '50%', overflow: 'hidden', background: ORANGE, boxShadow: `0 0 0 3px ${ORANGE}, 0 0 0 4px ${alpha(CREAM, 0.4)}` }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={CREAM} height="100%"
                    map={{ opacity: 0.75, filter: 'grayscale(1) contrast(1.1)', tintOpacity: 0.6, tint: ORANGE, blend: 'multiply' }}
                    frame={<Spindle />}
                    fallback={<div style={{ height: '100%', position: 'relative', background: `radial-gradient(circle, ${ORANGE}, #B4522A)` }}><Spindle /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontSize: 25, lineHeight: 1.25 }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 14.5, color: MUTED }}>{weddingData.venueNote}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={btn(true)}>{tr.inv_directions_btn}</a>}
                {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={btn(!inv.dirUrl)}>Maps</a>}
                {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Waze</a>}
                {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Apple</a>}
              </div>
            </Track>
          )}

          {/* PROQRAM — arxa qabıq trek siyahısı */}
          {S.program && (
            <Track {...P} n={next()} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div className="vr-paper" style={{ background: CREAM, color: CHAR, padding: '22px 20px 18px', boxShadow: '0 24px 40px -24px #000' }}>
                {[0, 1].map((sideIdx) => {
                  const evs = sideIdx ? timeline.events.slice(half) : timeline.events.slice(0, half)
                  if (!evs.length) return null
                  const sideL = sideIdx ? 'B' : 'A'
                  return (
                    <div key={sideL} style={{ marginTop: sideIdx ? 18 : 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, fontWeight: 700, letterSpacing: '.24em', color: sideIdx ? TEAL : ORANGE }}>
                        {upper(T.side, lang)} {sideL}<span style={{ flex: 1, height: 1.5, background: sideIdx ? TEAL : ORANGE }} />
                      </div>
                      <ol style={{ listStyle: 'none', margin: '6px 0 0', padding: 0 }}>
                        {evs.map((ev, k) => (
                          <li key={k} style={{ display: 'grid', gridTemplateColumns: '30px 1fr auto', alignItems: 'baseline', gap: 10, padding: '10px 0', borderBottom: `1px solid ${alpha(CHAR, 0.12)}` }}>
                            <span style={{ fontSize: 12.5, fontWeight: 700, color: sideIdx ? TEAL : ORANGE }}>{sideL}{k + 1}</span>
                            <span style={{ fontFamily: head, fontSize: 17.5, lineHeight: 1.3, minWidth: 0 }}>{ev.label}</span>
                            <span style={{ fontSize: 13.5, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )
                })}
                <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 600, letterSpacing: '.18em', color: alpha(CHAR, 0.55) }}>
                  <span>DIGITOY RECORDS</span><span>STEREO · 33⅓</span>
                </div>
              </div>
            </Track>
          )}

          {S.dresscode && (
            <Track {...P} n={next()} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')} center>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" onDark />
            </Track>
          )}

          {/* MASA — jukebox kartı */}
          {S.seating && !seating.isEmpty && (
            <Track {...P} n={next()} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <input {...seatInputProps(inv, 'vr-seat-list')} style={field} />
              <SeatSuggest inv={inv} id="vr-seat-list" c={{ bg: '#1E1B19', border: `1px solid ${alpha(CREAM, 0.2)}`, active: alpha(ORANGE, 0.15), text: CREAM, table: ORANGE, radius: 16, font: body }} />
              {seating.showNotFound && <div style={{ marginTop: 12, fontSize: 14, color: MUTED }}>{tr.inv_seat_fullname}</div>}
              {seating.selected && (
                <div className="vr-paper" style={{ marginTop: 26, maxWidth: 360, background: CREAM, color: CHAR, borderRadius: 6, overflow: 'hidden', boxShadow: '0 20px 40px -20px #000', animation: 'vr-rise .6s ease-out both' }}>
                  <div style={{ height: 10, background: ORANGE }} />
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center' }}>
                    <div style={{ padding: '14px 18px', borderRight: `1.5px solid ${alpha(CHAR, 0.2)}`, textAlign: 'center' }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.18em', color: TEAL }}>{upper(T.table, lang)}</div>
                      <div style={{ fontFamily: head, fontSize: 46, lineHeight: 1 }}>{seating.selected.table_id}</div>
                    </div>
                    <div style={{ padding: '14px 16px', minWidth: 0 }}>
                      <div style={{ fontFamily: head, fontSize: 19, lineHeight: 1.2 }}>{seating.selected.full_name}</div>
                      {seating.tablemates.length > 0 && <div style={{ marginTop: 6, fontSize: 13.5, color: alpha(CHAR, 0.7), lineHeight: 1.45 }}>{seating.tablemates.map((g) => g.full_name).join(' · ')}</div>}
                    </div>
                  </div>
                  <div style={{ height: 10, background: TEAL }} />
                </div>
              )}
              {seating.selected && (
                <button onClick={seating.reset} data-press style={{ marginTop: 8, background: 'none', border: 'none', padding: 0, color: CREAM, fontSize: 14.5, minHeight: 44, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: body }}>
                  {seatingL.again || 'Yenidən axtar'}
                </button>
              )}
            </Track>
          )}

          {/* FOTOLAR — qabıqlar qutusu */}
          {S.gallery && (
            <Track id="gallery-section" {...P} n={next()} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 28 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ aspectRatio: '1', background: [TEAL, ORANGE, MUSTARD][i % 3], boxShadow: '4px 6px 14px rgba(0,0,0,.45)', transform: `rotate(${[-2, 1.5, -1, 2.5, -1.5, 1][i % 6]}deg)`, overflow: 'hidden' }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 18, alignItems: 'center' }}>
                <div style={{ padding: 10, background: CREAM, borderRadius: 6 }}>
                  <QRCodeSVG value={gallery.photoShareUrl} size={112} bgColor={CREAM} fgColor={CHAR} level="M" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, color: MUTED }}>{tr.inv_scan_upload}</div>
                  <a data-press href={gallery.photoShareUrl} style={{ ...btn(true), marginTop: 12 }}>{tr.inv_gallery_btn}</a>
                </div>
              </div>
              <p style={{ margin: '18px 0 0', fontSize: 15, color: MUTED, lineHeight: 1.65 }}>{tr.inv_gallery_desc}</p>
            </Track>
          )}

          {/* RSVP — daxili kağız qab */}
          {S.rsvp && (
            <Track {...P} n={next()} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <div className="vr-paper" style={{
                position: 'relative', background: '#F7F1E4', color: CHAR, padding: '46px 20px 24px', borderRadius: 4,
                WebkitMask: 'radial-gradient(circle at 50% 0, transparent 30px, #000 30.5px)', mask: 'radial-gradient(circle at 50% 0, transparent 30px, #000 30.5px)',
                boxShadow: '0 24px 40px -24px #000',
              }}>
                <RsvpStatus inv={inv} render={({ title, sub }) => (
                  <div style={{ textAlign: 'center', padding: '4px 0 10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}><Disc size={34} /></div>
                    <div style={{ marginTop: 12, fontFamily: head, fontSize: 24, lineHeight: 1.25 }}>{title}</div>
                    {sub && <div style={{ marginTop: 6, fontSize: 14.5, color: alpha(CHAR, 0.7) }}>{sub}</div>}
                  </div>
                )} />
                {rsvpState(rsvp) === 'form' && (
                  <form onSubmit={rsvp.handleSubmit}>
                    <input {...rsvpInputProps(inv)} style={{ ...field, background: '#FFFDF7', color: CHAR, border: `1px solid ${alpha(CHAR, 0.2)}` }} />
                    <RsvpSuggest inv={inv} c={{ bg: '#FFFDF7', border: `1px solid ${alpha(CHAR, 0.2)}`, active: alpha(ORANGE, 0.1), text: CHAR, table: ORANGE, radius: 16, font: body }} />
                    {rsvp.showNotFound && <div style={{ marginTop: 8, fontSize: 13.5, color: ORANGE }}>{rsvpL.not_in_list}</div>}
                    <div role="radiogroup" aria-label={L('rsvp', 'title', rsvpL.title)} style={{ display: 'grid', gap: 8, marginTop: 16 }}>
                      {rsvpOptions(inv).map(({ val, label }) => {
                        const active = rsvp.status === val
                        return (
                          <button key={val} type="button" role="radio" aria-checked={active} onClick={() => rsvp.chooseStatus(val)} data-press style={{
                            display: 'flex', alignItems: 'center', gap: 12, minHeight: 52, padding: '0 16px', borderRadius: 8, cursor: 'pointer',
                            fontFamily: body, fontSize: 15.5, fontWeight: 500, textAlign: 'left', color: active ? CREAM : CHAR,
                            background: active ? 'linear-gradient(180deg, #2A2726, #151312)' : 'linear-gradient(180deg, #FFFFFF, #ECE5D6)',
                            border: `1px solid ${active ? '#000' : alpha(CHAR, 0.18)}`, boxShadow: active ? 'inset 0 2px 4px rgba(0,0,0,.6)' : '0 2px 0 rgba(0,0,0,.12)',
                          }}>
                            <span aria-hidden="true" style={{ width: 9, height: 9, borderRadius: '50%', flex: 'none', background: active ? '#FF8A3D' : '#8C8478', boxShadow: active ? '0 0 8px #FF8A3D' : 'none' }} />
                            {label}
                          </button>
                        )
                      })}
                    </div>
                    {rsvp.status === 'yes' && (
                      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 14.5, color: alpha(CHAR, 0.75) }}>{rsvpL.plusq}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button type="button" onClick={rsvp.decPlusOne} disabled={rsvp.plusOne === 0} data-press aria-label="Azalt" style={{ width: 44, height: 44, borderRadius: '50%', border: `1px solid ${alpha(CHAR, 0.25)}`, background: '#FFFDF7', color: CHAR, fontSize: 19, cursor: 'pointer', opacity: rsvp.plusOne === 0 ? 0.35 : 1 }}>−</button>
                          <span style={{ width: 30, textAlign: 'center', fontFamily: head, fontSize: 26 }}>{rsvp.plusOne}</span>
                          <button type="button" onClick={rsvp.incPlusOne} disabled={rsvp.plusOne === rsvp.maxExtraGuests} data-press aria-label="Artır" style={{ width: 44, height: 44, borderRadius: '50%', border: `1px solid ${alpha(CHAR, 0.25)}`, background: '#FFFDF7', color: CHAR, fontSize: 19, cursor: 'pointer', opacity: rsvp.plusOne === rsvp.maxExtraGuests ? 0.35 : 1 }}>+</button>
                        </div>
                      </div>
                    )}
                    <button type="submit" disabled={!rsvp.canSubmit} data-press style={{
                      ...btn(true), width: '100%', marginTop: 20, minHeight: 54, fontSize: 15.5, background: TEAL, border: 'none',
                      opacity: rsvp.canSubmit ? 1 : 0.45, cursor: rsvp.canSubmit ? 'pointer' : 'not-allowed',
                    }}>
                      {rsvp.sending ? '…' : rsvpL.send}
                    </button>
                  </form>
                )}
              </div>
            </Track>
          )}

          {/* LAYNER QEYDLƏRİ */}
          {S.guestbook && (
            <Track {...P} n={next()} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 32 }}>
                <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={field} />
                <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...field, borderRadius: 20, resize: 'none', lineHeight: 1.5 }} />
                <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...btn(gbook.canSubmit), width: '100%', opacity: gbook.canSubmit ? 1 : 0.5, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}>
                  {gbook.sending ? gbookL.sending : gbookL.btn}
                </button>
                {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 13.5 }}>⚠ {gbookL.error}</p>}
              </form>
              <div style={{ display: 'grid', gap: 26 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  const text = String(msg.text || '')
                  return (
                    <figure key={msg.name + i} style={{ margin: 0 }}>
                      <blockquote style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: alpha(CREAM, 0.92) }}>
                        <span style={{ float: 'left', fontFamily: head, fontSize: 46, lineHeight: 0.9, padding: '4px 8px 0 0', color: [ORANGE, MUSTARD, '#4FA3A1'][i % 3] }}>{text.charAt(0)}</span>
                        {text.slice(1)}
                      </blockquote>
                      <figcaption style={{ marginTop: 8, clear: 'both', fontSize: 12, fontWeight: 600, letterSpacing: '.16em', color: MUTED }}>{upper(msg.name, lang)}{msg.date ? ` · ${gbook.formatDate(msg.date)}` : ''}</figcaption>
                    </figure>
                  )
                })}
              </div>
            </Track>
          )}

          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={head} />
        </motion.div>
      )}
    </div>
  )
}

function Spindle() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -13, top: -13, width: 26, height: 26, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #F2F2F2, #9A9DA1 60%, #5E6165)', boxShadow: '0 3px 8px rgba(0,0,0,.5)' }} />
    </span>
  )
}
