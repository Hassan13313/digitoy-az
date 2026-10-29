import { motion } from 'framer-motion'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../_shared/MapSection'
import { EmblemSlot } from '../_shared/MonoContent'
import { Reveal, PopDigit, enterDirection } from '../_shared/motion'
import { hidePhoto } from '../../utils/photoGallery'
import { getTemplateTheme } from '../templateConfig'
import { useInvitation, useGate, openingNames, alpha } from '../_shared/useInvitation'
import { MusicFab, EqBars, StoryBlock, InvitationEnd, ReplyForm } from '../_shared/invitationKit'
import { VenueLinks, SeatFinder, PhotoQr, GuestbookForm } from '../_shared/blocks'
import { galleryDesc, tableSize, ageWord } from '../_shared/kids'
import { C as PAL, SKY_BG, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Cloud, Sky, Plane, PlaneIcon, TailFin } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'

/* ─────────────────────────────────────────────────────────────────────────────
   LITTLE PILOT — «Kiçik pilot» (Sünnət toyu konsepti, 2026-10)

   Konsept: göy üzündə qırmızı təyyarə arxasınca adı yazılmış bayraq aparır.
   Açılışda təyyarə buludlar arasında süzür; toxunanda sürətlənib bayraqla
   birlikdə yuxarı uçur, buludlar iki yana çəkilir. Daxildə:
     sayğac    → dörd pilot cihazı (əqrəbli)
     məkan     → təyyarə pəncərəsində xəritə
     proqram   → uçuş marşrutu: buludlar üzərində dayanacaqlar
     masa      → təyyarənin quyruğunda masa nömrəsi
     fotolar   → illüminatorlar
   Şriftlər: Montserrat Alternates (başlıq) · Nunito (mətn) — Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('little-pilot')
const ID = 'little-pilot'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['RED'], secondary: ['SKY_D'], accent: ['YELLOW'], background: ['CREAM'], text: ['NAVY'] }

const KEYFRAMES = (C) => (`
@keyframes lp2-drift { from { transform: translateX(-14px) } to { transform: translateX(14px) } }
@keyframes lp2-prop { from { transform: scaleY(1) } 50% { transform: scaleY(.2) } to { transform: scaleY(1) } }
@keyframes lp2-bob { 0%,100% { transform: translateY(0) rotate(-1deg) } 50% { transform: translateY(-8px) rotate(1deg) } }
@keyframes lp2-wave { 0%,100% { transform: skewY(-2deg) } 50% { transform: skewY(2deg) } }
@keyframes lp2-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes lp2-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes lp2-hint { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
@keyframes lp2-land { 0% { transform: translate(-60px, -40px) rotate(-12deg); opacity: 0 } 100% { transform: none; opacity: 1 } }
[data-lp2] span[aria-hidden="true"], [data-lp2] svg[aria-hidden="true"], [data-lp2] div[aria-hidden="true"] { pointer-events: none; }
[data-lp2] ::placeholder { color: rgba(92,111,133,.6); }
[data-lp2] input:focus-visible, [data-lp2] textarea:focus-visible { border-color: ${C.SKY_D} !important; outline: none; }
[data-lp2] button:focus-visible, [data-lp2] a:focus-visible, [data-lp2] [role="button"]:focus-visible { outline: 3px solid ${C.NAVY}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-lp2] *, [data-lp2] { animation: none !important; transition: none !important; } }
`)

const LIGHT_BG = (C) => (`radial-gradient(90% 60% at 50% 0%, #FFFFFF, transparent 70%), ${C.CREAM}`)

/** Bayraq (adı daşıyır) + kəndir + təyyarə */
function Towline({ children, planeW = 112, badge }) {
  const C = usePalette(PAL)
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', flex: '0 1 auto', minWidth: 0, transformOrigin: '100% 50%', animation: 'lp2-wave 2.4s ease-in-out infinite' }}>
        <div style={{ position: 'relative', padding: '12px 22px 12px 34px', background: C.CREAM, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 9% 50%)', boxShadow: `inset 0 4px 0 ${C.RED}, inset 0 -4px 0 ${C.RED}` }}>
          {children}
        </div>
      </div>
      <svg aria-hidden="true" viewBox="0 0 40 20" width="34" height="18" style={{ flex: 'none', display: 'block' }}>
        <path d="M0 4L40 10M0 16L40 10" stroke={C.NAVY} strokeWidth="1.2" />
      </svg>
      <Plane width={planeW} badge={badge} style={{ flex: 'none', marginLeft: -4 }} />
    </div>
  )
}

/* ═══ 01 — AÇILIŞ: təyyarə uçur ═══ */
function PilotOpening({ inv, theme }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-lp2
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: SKY_BG(C), color: C.NAVY, fontFamily: theme.fonts.body }}>
      <Sky part={go} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 12px', textAlign: 'center' }}>
        <div style={{ animation: 'lp2-rise 1s ease-out .2s both' }}>
          <EmblemSlot mono={ot.mono} size={48} border={`2px solid ${C.CLOUD}`} background={C.RED} color={C.CLOUD} font={head} style={{ animation: 'none', margin: '0 auto 10px' }}>
            <PlaneIcon size={24} color={C.CLOUD} style={{ margin: '0 auto' }} />
          </EmblemSlot>
          {ot.show('kicker') && <div style={{ fontFamily: head, fontWeight: 700, fontSize: 15, letterSpacing: '.12em', textTransform: 'uppercase', color: C.CLOUD, textShadow: '0 1px 6px rgba(24,50,79,.35)' }}>{ot.text('kicker')}</div>}
        </div>
        <div style={{ width: '100%', maxWidth: 400, margin: '20px 0 0', transform: go ? 'translate(120vw, -46vh) rotate(-14deg)' : 'none', transition: 'transform 1.4s cubic-bezier(.55,0,.4,1) .1s' }}>
          <div style={{ animation: go ? 'none' : 'lp2-bob 3.2s ease-in-out infinite' }}>
            {titleOv !== '' && (
              <Towline>
                <div style={{ fontFamily: head, fontWeight: 800, fontSize: nameSize(first), lineHeight: 1.05, color: C.RED, overflowWrap: 'break-word' }}>
                  {first}{second && <><span style={{ display: 'block', fontSize: '.5em', color: C.NAVY }}>{ot.text('and')}</span>{second}</>}
                </div>
              </Towline>
            )}
          </div>
        </div>
        {ot.show('meta') && (
          <div style={{ position: 'relative', marginTop: 30, padding: '14px 26px', animation: 'lp2-rise .9s ease-out .5s both' }}>
            <Cloud w={250} style={{ left: '50%', top: '50%', marginLeft: -125, marginTop: -60, zIndex: 0 }} />
            <div style={{ position: 'relative', fontWeight: 700, fontSize: 15.5, color: C.NAVY }}>{ot.text('meta')}</div>
          </div>
        )}
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: 26 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 28px', display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 999, background: C.RED, color: C.CLOUD, fontFamily: head, fontWeight: 700, fontSize: 16, boxShadow: '0 12px 24px -10px rgba(184,58,40,.7)', animation: 'lp2-rise .8s ease-out .8s both' }}>
              <PlaneIcon size={20} color={C.CLOUD} />{ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 10, fontWeight: 600, fontSize: 13.5, color: C.NAVY, opacity: 0.75, animation: 'lp2-fade .8s ease-out 1.1s both, lp2-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, sky = false }) {
  const C = usePalette(PAL)
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: sky ? SKY_BG(C) : LIGHT_BG(C), color: C.NAVY }}>
      {sky && <Sky opacity={0.6} />}
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ width: 56, borderTop: `2px dashed ${sky ? C.CLOUD : alpha(C.SKY_D, 0.6)}` }} />
              <PlaneIcon size={24} color={sky ? C.CLOUD : C.RED} />
              <span style={{ width: 56, borderTop: `2px dashed ${sky ? C.CLOUD : alpha(C.SKY_D, 0.6)}` }} />
            </div>
            {title && <h2 style={{ margin: '12px 0 0', fontFamily: head, fontWeight: 800, fontSize: scaleFont('clamp(26px, 7.6vw, 34px)', C.hs), lineHeight: 1.15, color: sky ? C.CLOUD : C.NAVY, textShadow: sky ? '0 2px 10px rgba(24,50,79,.3)' : 'none', textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontWeight: 600, fontSize: 15.5, color: sky ? C.NAVY : C.MUTED }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 340, fontSize: 15.5, color: sky ? C.NAVY : C.MUTED, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: C.CLOUD, border: `2px solid ${alpha(C.SKY_D, 0.3)}`, borderRadius: 16,
  padding: '13px 16px', fontSize: 16, color: C.NAVY, outline: 'none',
})
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 999,
  fontSize: 15.5, fontWeight: 700, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.RED : C.CLOUD, color: on ? C.CLOUD : C.NAVY, border: `2px solid ${on ? C.RED : alpha(C.NAVY, 0.25)}`,
}))
const suggest = (C) => ({ bg: C.CLOUD, border: `2px solid ${alpha(C.SKY_D, 0.25)}`, active: alpha(C.SKY, 0.4), text: C.NAVY, table: C.RED, radius: 16 })

/* Pilot cihazı — sayğac */
function Gauge({ value, max, label, pop, head }) {
  const C = usePalette(PAL)
  const angle = -135 + Math.min(1, (Number(value) || 0) / max) * 270
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', aspectRatio: '1', borderRadius: '50%', background: `radial-gradient(circle at 50% 40%, #24486F, ${C.NAVY} 70%)`, border: `4px solid #DCE6EF`, boxShadow: '0 10px 18px -10px rgba(24,50,79,.7), inset 0 0 0 2px rgba(255,255,255,.15)' }}>
        <svg aria-hidden="true" viewBox="-50 -50 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {Array.from({ length: 10 }, (_, i) => {
            const a = ((-135 + i * 30) * Math.PI) / 180
            return <path key={i} d={`M${Math.sin(a) * 40} ${-Math.cos(a) * 40}L${Math.sin(a) * 33} ${-Math.cos(a) * 33}`} stroke={i > 7 ? C.RED : '#FFFFFF'} strokeWidth="2.2" strokeLinecap="round" />
          })}
          <g style={{ transform: `rotate(${angle}deg)`, transition: 'transform .6s ease' }}>
            <path d="M0 6L0 -36" stroke={C.YELLOW} strokeWidth="2.6" strokeLinecap="round" />
          </g>
          <circle r="4" fill={C.YELLOW} />
        </svg>
        <span style={{ position: 'absolute', left: 0, right: 0, bottom: '16%', fontFamily: head, fontWeight: 800, fontSize: 'clamp(16px, 4.8vw, 21px)', lineHeight: 1, color: C.CLOUD, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={value} pop={pop} /></span>
      </div>
      <div style={{ marginTop: 8, fontWeight: 700, fontSize: 13, color: C.MUTED }}>{label}</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function LittlePilotTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const age = inv.age

  return (
    <PaletteContext.Provider value={C}><div data-lp2 lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.CREAM, minHeight: '100vh', fontFamily: body, color: C.NAVY, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.SKY, 0.4),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <PilotOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.RED, border: `3px solid ${C.CLOUD}`, boxShadow: '0 8px 18px rgba(184,58,40,.4)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.CLOUD} idle={alpha(C.CLOUD, 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.CLOUD, 0.92), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.SKY_D, 0.2)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontWeight: 600, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 800, fontSize: 17, color: C.RED }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — göy üzü və bayraq */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: SKY_BG(C), padding: '46px 12px 56px', textAlign: 'center' }}>
            <Sky />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: head, fontWeight: 700, fontSize: 15, letterSpacing: '.12em', textTransform: 'uppercase', color: C.CLOUD, textShadow: '0 1px 6px rgba(24,50,79,.35)' }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              <div style={{ maxWidth: 420, margin: '22px auto 0', animation: 'lp2-bob 3.4s ease-in-out infinite' }}>
                <Towline planeW={104} badge={age || null}>
                  <h1 style={{ margin: 0, fontFamily: head, fontWeight: 800, fontSize: nameSize(heroName), lineHeight: 1.05, color: C.RED, overflowWrap: 'break-word' }}>{heroName}</h1>
                </Towline>
              </div>
              {age && <div style={{ marginTop: 14, fontWeight: 700, fontSize: 16, color: C.NAVY }}>{age} {ageWord(age, lang)}</div>}
              <div style={{ position: 'relative', display: 'inline-block', margin: '34px auto 0', padding: '20px 30px 16px' }}>
                <Cloud w={320} style={{ left: '50%', top: '50%', marginLeft: -160, marginTop: -80 }} />
                <div style={{ position: 'relative' }}>
                  <div style={{ fontFamily: head, fontWeight: 800, fontSize: 'clamp(18px, 5vw, 22px)', color: C.NAVY }}>{inv.fullDate}</div>
                  <div style={{ marginTop: 4, fontWeight: 600, fontSize: 15, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
                </div>
              </div>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 10, fontSize: 15, color: C.NAVY }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              <p style={{ margin: '28px auto 0', maxWidth: 320, fontWeight: 600, fontSize: 16, lineHeight: 1.6, color: C.NAVY }}>{tr.inv_join}</p>
            </div>
          </section>

          {/* SAYĞAC — cihazlar */}
          {S.countdown && (
            <Panel section="countdown" head={head} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                <Gauge head={head} value={cd.days} max={365} label={cd.labels.days} />
                <Gauge head={head} value={cd.hours} max={24} label={cd.labels.hours} />
                <Gauge head={head} value={cd.minutes} max={60} label={cd.labels.minutes} />
                <Gauge head={head} value={cd.seconds} max={60} label={cd.labels.seconds} pop />
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN — təyyarə pəncərəsi */}
          {S.venue && (
            <Panel section="venue" head={head} sky title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ width: 'min(80vw, 330px)', margin: '0 auto', padding: 16, borderRadius: '44% / 34%', background: 'linear-gradient(160deg, #FFFFFF, #DCE6EF)', boxShadow: '0 24px 40px -22px rgba(24,50,79,.6), inset 0 -4px 10px rgba(24,50,79,.15)' }}>
                <div style={{ borderRadius: '42% / 32%', overflow: 'hidden', isolation: 'isolate', boxShadow: 'inset 0 0 0 3px rgba(24,50,79,.25)' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.RED} height="min(100vw, 400px)"
                    map={{ opacity: 0.95, filter: 'saturate(1.05)', tintOpacity: 0.1, tint: C.SKY, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'min(100vw, 400px)', position: 'relative', background: SKY_BG(C) }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 800, fontSize: 22, lineHeight: 1.25, color: C.NAVY }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontWeight: 600, fontSize: 15, color: C.NAVY, opacity: 0.8 }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} />
            </Panel>
          )}

          {/* PROQRAM — uçuş marşrutu */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ position: 'relative', maxWidth: 380, margin: '0 auto' }}>
                <svg aria-hidden="true" viewBox="0 0 40 100" preserveAspectRatio="none" style={{ position: 'absolute', left: 6, top: 14, width: 40, height: 'calc(100% - 28px)' }}>
                  <path d="M20 0C0 20 40 40 20 50C0 60 40 80 20 100" fill="none" stroke={C.SKY_D} strokeWidth="2" strokeDasharray="5 6" vectorEffect="non-scaling-stroke" />
                </svg>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '52px minmax(0, 1fr)', gap: 10, alignItems: 'center', padding: '9px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <span style={{ display: 'flex', padding: 7, borderRadius: '50%', background: C.CLOUD, boxShadow: `0 0 0 2px ${alpha(C.SKY_D, 0.4)}` }}><PlaneIcon size={20} color={i === timeline.events.length - 1 ? C.RED : C.SKY_D} style={{ transform: 'rotate(90deg)' }} /></span>
                    </div>
                    <div style={{ padding: '12px 16px', borderRadius: 999, background: C.CLOUD, boxShadow: '0 10px 20px -16px rgba(24,50,79,.6)' }}>
                      <span style={{ fontFamily: head, fontWeight: 800, fontSize: 15, color: C.RED, marginRight: 10, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</span>
                      <span style={{ fontWeight: 600, fontSize: 16, lineHeight: 1.35, color: C.NAVY }}>{ev.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" />
            </Panel>
          )}

          {/* MASA — quyruq */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} sky title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="lp2-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={C.NAVY} accent={C.RED}
                nameStyle={{ fontFamily: head, fontWeight: 800, fontSize: 20, color: C.NAVY }}
                card={(num) => (
                  <TailFin width={190} style={{ animation: 'lp2-land .8s cubic-bezier(.3,.8,.4,1) both' }}>
                    <span style={{ fontWeight: 800, fontSize: 12.5, letterSpacing: '.14em', textTransform: 'uppercase', color: C.CLOUD }}>{T.table}</span>
                    <span style={{ fontFamily: head, fontWeight: 800, fontSize: tableSize(num, 58), lineHeight: 1, color: C.CLOUD }}>{num}</span>
                  </TailFin>
                )} />
            </Panel>
          )}

          {/* FOTOLAR — illüminatorlar */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, marginBottom: 32 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ aspectRatio: '3 / 4', overflow: 'hidden', borderRadius: '46% / 36%', background: C.SKY, border: '8px solid #EEF3F7', boxShadow: '0 0 0 1px #C8D5E0, 0 12px 20px -12px rgba(24,50,79,.55), inset 0 0 0 2px rgba(24,50,79,.2)' }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.NAVY} bg={C.CLOUD} frame={{ borderRadius: 24, border: '6px solid #EEF3F7', boxShadow: '0 0 0 1px #C8D5E0' }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.NAVY, muted: C.MUTED, line: alpha(C.SKY_D, 0.5), hair: alpha(C.SKY_D, 0.2), accent: C.RED,
                font: body, display: head, btnFont: head,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Plane width={90} /></div>,
                marker: (a) => (a ? <PlaneIcon size={16} color={C.RED} /> : <span style={{ display: 'block', width: 14, height: 14, borderRadius: '50%', border: `2px solid ${alpha(C.SKY_D, 0.5)}` }} />),
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* MESAJLAR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} sky title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field(C)} btn={btn(C)} errorColor={C.RED_D} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '18px 20px 16px', borderRadius: 28, background: C.CLOUD, boxShadow: '0 14px 26px -18px rgba(24,50,79,.55)' }}>
                      <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.55, color: C.NAVY }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, fontFamily: head, fontWeight: 700, fontSize: 14.5, color: C.RED }}>
                        <PlaneIcon size={14} color={C.RED} />
                        <span>{msg.name}{msg.date ? <span style={{ fontFamily: body, fontWeight: 400, color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}</span>
                      </figcaption>
                    </figure>
                  )
                })}
              </div>
            </Panel>
          )}

          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={head} />
        </motion.div>
      )}
    </div></PaletteContext.Provider>
  )
}

function MapPin() {
  const C = usePalette(PAL)
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -20, top: -48, display: 'flex', padding: 8, borderRadius: '50%', background: C.RED, boxShadow: `0 0 0 3px ${C.CLOUD}, 0 8px 14px rgba(24,50,79,.4)` }}>
        <PlaneIcon size={22} color={C.CLOUD} style={{ transform: 'rotate(45deg)' }} />
      </span>
      <span style={{ position: 'absolute', left: -1, top: -12, width: 2, height: 12, background: C.RED }} />
    </span>
  )
}
