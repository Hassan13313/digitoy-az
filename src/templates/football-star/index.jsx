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
import { galleryDesc, ageWord } from '../_shared/kids'
import { C as PAL, PITCH_BG, NIGHT_BG, GOAL_WORD, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Ball, Goal, Jersey, Whistle } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'

/* ─────────────────────────────────────────────────────────────────────────────
   FOOTBALL STAR — «Futbol ulduzu» (Sünnət toyu konsepti, 2026-10)

   Konsept: gecə stadionu, projektorlar, yaşıl meydança — kiçik bəy bu
   matçın ulduzudur. Açılışda top penalti nöqtəsindədir; toxunanda qapıya
   uçur, tor dartılır və «QOL!» yanır. Daxildə:
     hero      → arxadan forma: adı və yaşı nömrə kimi
     sayğac    → stadion tablosu (LED rəqəmlər)
     proqram   → matçın gedişi: hakim fiti ilə başlayır
     masa      → forma, arxasında masa nömrəsi
     fotolar   → futbolçu kartları
   Şriftlər: Oswald (başlıq) · Inter Tight (mətn) · Tektur (yalnız rəqəmlər) —
   Ə və kiril var (Tektur-da «Y» hərfi «V»-yə bənzədiyi üçün hərflərdə işlənmir).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('football-star')
const ID = 'football-star'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['PITCH_D'], secondary: ['NAVY'], accent: ['GOLD'], background: ['GRASS_L'], text: ['INK'] }
const LED = "'Tektur', 'Oswald', system-ui, sans-serif"

const KEYFRAMES = (C) => (`
@keyframes fs-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes fs-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes fs-hint { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
@keyframes fs-bounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
@keyframes fs-goal { 0% { transform: scale(.3); opacity: 0 } 60% { transform: scale(1.15); opacity: 1 } 100% { transform: scale(1); opacity: 1 } }
@keyframes fs-flash { 0% { opacity: 0 } 30% { opacity: .9 } 100% { opacity: 0 } }
@keyframes fs-jersey { 0% { transform: rotateY(90deg); opacity: 0 } 100% { transform: none; opacity: 1 } }
[data-fs] span[aria-hidden="true"], [data-fs] svg[aria-hidden="true"], [data-fs] div[aria-hidden="true"] { pointer-events: none; }
[data-fs] ::placeholder { color: rgba(88,104,120,.6); }
[data-fs] input:focus-visible, [data-fs] textarea:focus-visible { border-color: ${C.PITCH} !important; outline: none; }
[data-fs] button:focus-visible, [data-fs] a:focus-visible, [data-fs] [role="button"]:focus-visible { outline: 3px solid ${C.GOLD}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-fs] *, [data-fs] { animation: none !important; transition: none !important; } }
`)

const LIGHT_BG = (C) => (`radial-gradient(90% 60% at 50% 0%, #FFFFFF, transparent 70%), ${C.GRASS_L}`)

/* ═══ 01 — AÇILIŞ: zərbə və qol ═══ */
function GoalOpening({ inv, theme, lang }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-fs
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: NIGHT_BG(C), color: C.WHITE, fontFamily: theme.fonts.body }}>
      {/* meydança xətləri */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-20%', right: '-20%', top: '40%', bottom: 0, background: 'repeating-linear-gradient(180deg, rgba(255,255,255,.05) 0 40px, transparent 40px 80px)', transform: 'perspective(400px) rotateX(30deg)', transformOrigin: '50% 0' }} />
      <div aria-hidden="true" style={{ position: 'absolute', left: '50%', bottom: '8%', width: 260, height: 90, marginLeft: -130, border: `3px solid ${alpha(C.LINE, 0.55)}`, borderBottom: 'none', borderRadius: '130px 130px 0 0 / 90px 90px 0 0' }} />
      <div style={{ position: 'absolute', left: '50%', top: '9%', width: 'min(76vw, 300px)', transform: 'translateX(-50%)' }}>
        <Goal width="100%" bulge={go} delay={0.55} />
      </div>
      {/* qol yazısı */}
      {go && (
        <>
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: '#FFFFFF', animation: 'fs-flash .6s ease-out .55s both' }} />
          <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: '30%', textAlign: 'center', fontFamily: head, fontWeight: 600, fontSize: 'clamp(70px, 22vw, 110px)', lineHeight: 1, color: C.GOLD, textShadow: '0 6px 0 rgba(0,0,0,.35), 0 0 30px rgba(242,194,48,.6)', animation: 'fs-goal .5s cubic-bezier(.3,1.5,.5,1) .6s both' }}>{GOAL_WORD[lang] || GOAL_WORD.az}</div>
        </>
      )}
      <motion.div animate={go ? { opacity: 0 } : {}} transition={{ duration: 0.3 }} style={{ position: 'absolute', left: 0, right: 0, top: '33%', padding: '0 22px', textAlign: 'center' }}>
        <EmblemSlot mono={ot.mono} size={46} border={`2px solid ${C.GOLD}`} background={C.NAVY} color={C.GOLD} font={head} style={{ animation: 'none', margin: '0 auto 10px' }}>
          <Ball size={28} style={{ margin: '0 auto' }} />
        </EmblemSlot>
        {ot.show('kicker') && <div style={{ fontFamily: head, fontWeight: 500, fontSize: 15, letterSpacing: '.22em', textTransform: 'uppercase', color: C.GOLD }}>{ot.text('kicker')}</div>}
        {titleOv !== '' && (
          <div style={{ marginTop: 6, fontFamily: head, fontWeight: 600, fontSize: 'clamp(44px, 13vw, 64px)', lineHeight: 1, textTransform: 'uppercase', color: C.WHITE, overflowWrap: 'anywhere', textShadow: '0 4px 0 rgba(0,0,0,.3)' }}>
            {first}{second && <><span style={{ display: 'block', fontSize: '.45em', color: C.GOLD }}>{ot.text('and')}</span>{second}</>}
          </div>
        )}
        {ot.show('meta') && <div style={{ marginTop: 10, fontSize: 15, fontWeight: 500, color: alpha(C.WHITE, 0.8) }}>{ot.text('meta')}</div>}
      </motion.div>
      {/* top */}
      <div style={{ position: 'absolute', left: '50%', bottom: 'calc(8% + 116px)', marginLeft: -32, transform: go ? 'translateY(calc(180px - 76vh)) scale(.4) rotate(540deg)' : 'none', transition: 'transform .6s cubic-bezier(.2,.6,.4,1)' }}>
        <div style={{ animation: go ? 'none' : 'fs-bounce 1.6s ease-in-out infinite' }}><Ball size={64} /></div>
      </div>
      <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.2 }} style={{ position: 'absolute', left: 0, right: 0, bottom: 'max(26px, 4vh)', textAlign: 'center' }}>
        {ot.show('cta') && (
          <div style={{ minHeight: 50, padding: '12px 28px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: C.GOLD, color: C.NAVY, fontFamily: head, fontWeight: 600, fontSize: 17, letterSpacing: '.06em', textTransform: 'uppercase', boxShadow: '0 12px 24px -10px rgba(242,194,48,.6)', animation: 'fs-rise .8s ease-out .8s both' }}>
            {ot.text('cta')}
          </div>
        )}
        {ot.show('hint') && <div style={{ marginTop: 10, fontSize: 13.5, color: alpha(C.WHITE, 0.7), animation: 'fs-fade .8s ease-out 1.1s both, fs-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
      </motion.div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, pitch = false }) {
  const C = usePalette(PAL)
  const mute = pitch ? alpha(C.WHITE, 0.82) : C.MUTED
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: pitch ? PITCH_BG(C) : LIGHT_BG(C), color: pitch ? C.WHITE : C.INK }}>
      {pitch && <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 300, height: 300, margin: '-150px 0 0 -150px', borderRadius: '50%', border: `3px solid ${alpha(C.LINE, 0.18)}` }} />}
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <Ball size={26} style={{ margin: '0 auto 10px' }} />
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 600, fontSize: scaleFont('clamp(28px, 8.4vw, 38px)', C.hs), lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '.02em', color: pitch ? C.WHITE : C.NAVY, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontSize: 15.5, color: mute }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 340, fontSize: 15.5, color: mute, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: C.WHITE, border: `2px solid ${alpha(C.NAVY, 0.18)}`, borderRadius: 12,
  padding: '13px 16px', fontSize: 16, color: C.INK, outline: 'none',
})
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 12,
  fontSize: 15.5, fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.NAVY : C.WHITE, color: on ? C.GOLD : C.NAVY, border: `2px solid ${on ? C.NAVY : alpha(C.NAVY, 0.25)}`,
}))
const suggest = (C) => ({ bg: C.WHITE, border: `2px solid ${alpha(C.NAVY, 0.18)}`, active: alpha(C.GOLD, 0.25), text: C.INK, table: C.PITCH, radius: 12 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function FootballStarTemplate(props) {
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
    <PaletteContext.Provider value={C}><div data-fs lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.GRASS_L, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.GOLD, 0.35),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <GoalOpening inv={inv} theme={theme} lang={lang} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.NAVY, border: `2px solid ${C.GOLD}`, boxShadow: '0 8px 18px rgba(8,26,46,.45)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.GOLD} idle={alpha(C.GOLD, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.NAVY_D, 0.94), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `2px solid ${C.GOLD}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.WHITE, 0.8), fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 600, fontSize: 18, letterSpacing: '.12em', textTransform: 'uppercase', color: C.GOLD }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — forma */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: NIGHT_BG(C), padding: '40px 20px 56px', textAlign: 'center', color: C.WHITE }}>
            <div style={{ fontFamily: head, fontWeight: 500, fontSize: 15, letterSpacing: '.24em', textTransform: 'uppercase', color: C.GOLD }}>{L('hero', 'kicker', inv.eventLabel)}</div>
            <h1 style={{ margin: '6px 0 0', fontFamily: head, fontWeight: 600, fontSize: nameSize(heroName), lineHeight: 1, textTransform: 'uppercase', color: C.WHITE, overflowWrap: 'anywhere', textShadow: '0 4px 0 rgba(0,0,0,.3)', animation: 'fs-rise 1s ease-out .2s both' }}>{heroName}</h1>
            <div style={{ perspective: 800, marginTop: 22 }}>
              <Jersey width="min(66vw, 250px)" head={head} digits={LED} name={inv.isCouple ? '' : heroName} number={age || null} style={{ animation: 'fs-jersey .9s cubic-bezier(.3,.8,.4,1) .3s both' }}>
                {!age && <div style={{ marginTop: 10 }}><svg aria-hidden="true" viewBox="0 0 24 24" width="72" height="72"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7.1L12 17.3 5.7 21l1.7-7.1L2 9.2l7.1-.6z" fill={C.GOLD} /></svg></div>}
              </Jersey>
            </div>
            {age && <div style={{ marginTop: 10, fontFamily: head, fontWeight: 500, fontSize: 17, letterSpacing: '.12em', textTransform: 'uppercase', color: C.GOLD }}>{age} {ageWord(age, lang)}</div>}
            <div style={{ display: 'inline-block', marginTop: 20, padding: '12px 22px', borderRadius: 12, background: alpha(C.NAVY_D, 0.65), border: `1px solid ${alpha(C.WHITE, 0.2)}` }}>
              <div style={{ fontFamily: head, fontWeight: 500, fontSize: 'clamp(19px, 5.4vw, 23px)', letterSpacing: '.04em', color: C.WHITE }}>{inv.fullDate}</div>
              <div style={{ marginTop: 4, fontSize: 15, color: alpha(C.WHITE, 0.78) }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            </div>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 8, fontSize: 15, color: alpha(C.WHITE, 0.78) }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <p style={{ margin: '18px auto 0', maxWidth: 330, fontSize: 16, lineHeight: 1.6, color: alpha(C.WHITE, 0.88) }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — tablo */}
          {S.countdown && (
            <Panel section="countdown" head={head} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ maxWidth: 420, margin: '0 auto', padding: '16px 14px 18px', borderRadius: 16, background: `linear-gradient(180deg, #1A2430, ${C.INK})`, border: `4px solid #2E3B4A`, boxShadow: '0 22px 36px -22px rgba(0,0,0,.7)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px 12px', fontFamily: head, fontWeight: 500, fontSize: 13, letterSpacing: '.18em', color: alpha(C.WHITE, 0.55) }}><span>{T.home}</span><span>{T.away}</span></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
                  {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop]) => (
                    <div key={l} style={{ textAlign: 'center' }}>
                      <div style={{ padding: '10px 2px 8px', borderRadius: 8, background: '#0A0F14', boxShadow: 'inset 0 0 0 1px #26313D', backgroundImage: 'radial-gradient(circle, rgba(242,194,48,.08) 1px, transparent 1.4px)', backgroundSize: '5px 5px' }}>
                        <span style={{ fontFamily: LED, fontWeight: 800, fontSize: 'clamp(26px, 7.8vw, 36px)', lineHeight: 1, color: C.GOLD, textShadow: '0 0 12px rgba(242,194,48,.65)', fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                      </div>
                      <div style={{ marginTop: 8, fontSize: 12.5, fontWeight: 500, color: alpha(C.WHITE, 0.7) }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN — meydança çərçivəsi */}
          {S.venue && (
            <Panel section="venue" head={head} pitch title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ position: 'relative', maxWidth: 430, margin: '0 auto', padding: 10, borderRadius: 10, background: C.PITCH_D, boxShadow: `inset 0 0 0 3px ${C.LINE}, 0 24px 40px -24px rgba(0,0,0,.6)` }}>
                <div style={{ borderRadius: 4, overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.PITCH} height="clamp(250px, 70vw, 320px)"
                    map={{ opacity: 0.92, filter: 'saturate(.9)', tintOpacity: 0.14, tint: C.PITCH, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: PITCH_BG(C) }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 600, fontSize: 24, lineHeight: 1.2, textTransform: 'uppercase', color: C.WHITE }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 15.5, color: alpha(C.WHITE, 0.8) }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={(on) => ({ ...btn(C)(on), background: on ? C.GOLD : C.WHITE, color: C.NAVY, border: `2px solid ${on ? C.GOLD : C.WHITE}` })} />
            </Panel>
          )}

          {/* PROQRAM — matçın gedişi */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 400, margin: '0 auto', borderRadius: 16, overflow: 'hidden', background: C.WHITE, boxShadow: '0 18px 32px -24px rgba(8,26,46,.6)' }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '74px 32px minmax(0, 1fr)', alignItems: 'center', minHeight: 60, borderBottom: i < timeline.events.length - 1 ? `1px solid ${alpha(C.NAVY, 0.1)}` : 'none' }}>
                    <div style={{ alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'center', background: i === 0 ? C.NAVY : alpha(C.PITCH, 0.08), fontFamily: LED, fontWeight: 800, fontSize: 16, color: i === 0 ? C.GOLD : C.PITCH, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>{i === 0 ? <Whistle size={18} color={C.NAVY} /> : <Ball size={16} />}</div>
                    <div style={{ padding: '12px 14px 12px 4px', fontSize: 16.5, fontWeight: 500, lineHeight: 1.35, color: C.INK }}>{ev.label}</div>
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

          {/* MASA — forma */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} pitch title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="fs-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={alpha(C.WHITE, 0.85)} accent={C.GOLD}
                nameStyle={{ fontFamily: head, fontWeight: 600, fontSize: 20, letterSpacing: '.04em', textTransform: 'uppercase' }}
                card={(num) => (
                  <div style={{ perspective: 800 }}>
                    <Jersey width={210} head={head} digits={LED} name={T.table} number={num} color={C.WHITE} trim={C.NAVY} style={{ animation: 'fs-jersey .8s cubic-bezier(.3,.8,.4,1) both' }} />
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR — kartlar */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10, marginBottom: 32 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ aspectRatio: '3 / 4', overflow: 'hidden', borderRadius: 10, background: C.PITCH, border: '5px solid #FFFFFF', borderBottomWidth: 22, boxShadow: `0 0 0 2px ${C.NAVY}, 0 12px 20px -12px rgba(8,26,46,.6)` }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.NAVY} bg={C.WHITE} frame={{ borderRadius: 14, boxShadow: `0 0 0 3px ${C.NAVY}, 0 0 0 6px ${C.GOLD}` }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.NAVY, 0.4), hair: alpha(C.NAVY, 0.15), accent: C.PITCH,
                font: body, display: head, btnFont: head,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Ball size={44} /></div>,
                marker: (a) => (a ? <Ball size={15} /> : <span style={{ display: 'block', width: 14, height: 14, borderRadius: '50%', border: `2px solid ${alpha(C.NAVY, 0.35)}` }} />),
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* AZARKEŞ SÖZLƏRİ */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} pitch title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field(C)} btn={(on) => ({ ...btn(C)(on), background: on ? C.GOLD : C.WHITE, color: C.NAVY, border: `2px solid ${on ? C.GOLD : C.WHITE}` })} errorColor={C.GOLD} />
              <div style={{ display: 'grid', gap: 12 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '16px 18px 14px', borderRadius: 14, background: C.WHITE, borderLeft: `6px solid ${[C.NAVY, C.GOLD][i % 2]}`, boxShadow: '0 14px 24px -18px rgba(0,0,0,.6)' }}>
                      <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.55, color: C.INK }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, fontFamily: head, fontWeight: 600, fontSize: 14.5, letterSpacing: '.06em', textTransform: 'uppercase', color: C.PITCH }}>{msg.name}{msg.date ? <span style={{ fontFamily: body, fontWeight: 400, letterSpacing: 0, textTransform: 'none', color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}</figcaption>
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
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -18, top: -48, animation: 'fs-bounce 1.6s ease-in-out infinite' }}><Ball size={36} /></span>
      <span style={{ position: 'absolute', left: -14, top: -4, width: 28, height: 8, borderRadius: '50%', background: 'rgba(0,0,0,.3)' }} />
    </span>
  )
}
