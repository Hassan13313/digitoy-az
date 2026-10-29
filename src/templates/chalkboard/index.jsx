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
import { galleryDesc, tableSize } from '../_shared/kids'
import { C, BOARD_BG, PAPER_BG, chalky, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { fill } from '../_shared/copyText'
import { WoodFrame, ChalkTray, ChalkDoodle, ChalkLine } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   CHALKBOARD — «Təbaşir lövhə» (Məzuniyyət konsepti, 2026-10)

   Konsept: sinif otağının yaşıl lövhəsi. Açılışda taxta çərçivəli lövhədə
   məzunun adı silinmiş təbaşir izi kimi zəif görünür; toxunanda təbaşir
   «Məzun 2027» və adı təzədən yazır, altından xətt çəkilir, cizgilər çıxır.
   Daxildə: təbaşirlə çəkilmiş qutularda sayğac, oxlu proqram, kiçik lövhədə
   masa nömrəsi, maqnitlə bərkidilmiş fotolar.
   Şriftlər: Amatic SC (təbaşir) · Ysabeau Office (mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('chalkboard')
const ID = 'chalkboard'

const KEYFRAMES = `
@keyframes cb-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes cb-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes cb-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes cb-pop { from { opacity: 0; transform: scale(.4) rotate(-20deg) } to { opacity: .9; transform: scale(1) rotate(0) } }
[data-cb] span[aria-hidden="true"], [data-cb] svg[aria-hidden="true"], [data-cb] div[aria-hidden="true"] { pointer-events: none; }
[data-cb] ::placeholder { color: rgba(111,122,114,.7); }
[data-cb] [data-dark] ::placeholder { color: rgba(243,240,230,.45); }
[data-cb] input:focus-visible, [data-cb] textarea:focus-visible { border-color: ${C.YELLOW} !important; outline: none; }
[data-cb] button:focus-visible, [data-cb] a:focus-visible, [data-cb] [role="button"]:focus-visible { outline: 2px dashed ${C.YELLOW}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-cb] *, [data-cb] { animation: none !important; transition: none !important; } }
`

/* Təbaşirlə yazılan sətir: soldan sağa açılır, təbaşir parçası kənarı izləyir */
function WriteLine({ children, on, delay = 0, dur = 0.7, ghost = false, style }) {
  const tr = `${dur}s linear ${delay}s`
  return (
    <span style={{ position: 'relative', display: 'inline-block', ...style }}>
      {ghost && <span aria-hidden="true" style={{ display: 'block', opacity: 0.2, filter: 'blur(.6px)' }}>{children}</span>}
      <span style={{ display: 'block', position: ghost ? 'absolute' : 'relative', inset: 0, clipPath: on ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)', transition: `clip-path ${tr}` }}>{children}</span>
      <span aria-hidden="true" style={{ position: 'absolute', top: '55%', left: on ? '100%' : '0%', width: 26, height: 9, marginLeft: -4, borderRadius: 3, background: C.CHALK, boxShadow: '0 2px 3px rgba(0,0,0,.35)', transform: 'rotate(-35deg)', opacity: on ? 0 : 0, animation: on ? `cb-chalk ${dur}s linear ${delay}s forwards` : 'none', transition: `left ${tr}` }} />
    </span>
  )
}

/* ═══ 01 — AÇILIŞ: təbaşir yazır ═══ */
function ChalkOpening({ inv, theme, lang, year }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  const T = inv.copy(TXT)
  return (
    <motion.div {...gate.gateProps} data-cb
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: BOARD_BG, color: C.CHALK, fontFamily: theme.fonts.body }}>
      <style>{'@keyframes cb-chalk { 0% { opacity: 1 } 92% { opacity: 1 } 100% { opacity: 0 } }'}</style>
      <WoodFrame thick={14} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 30px 40px', textAlign: 'center' }}>
        {ot.show('kicker') && <div style={{ fontFamily: head, fontWeight: 700, fontSize: 26, letterSpacing: '.08em', color: C.CHALK_DIM, ...chalky, animation: 'cb-rise .8s ease-out .2s both' }}>{ot.text('kicker')}</div>}
        <div style={{ position: 'relative', marginTop: 10 }}>
          <EmblemSlot mono={ot.mono} size={70} border={`2px dashed ${C.CHALK_DIM}`} background="transparent" color={C.CHALK} font={head} style={{ animation: 'none', marginBottom: 12 }}>
            <span />
          </EmblemSlot>
          {year && (
            <div style={{ fontFamily: head, fontWeight: 700, fontSize: 'clamp(40px, 12vw, 56px)', lineHeight: 1, color: C.YELLOW, ...chalky }}>
              <WriteLine on={go} delay={0.1} dur={0.55} ghost>{fill(T.classOf, { y: year })}</WriteLine>
            </div>
          )}
          {titleOv !== '' && (
            <div style={{ marginTop: 6, fontFamily: head, fontWeight: 700, fontSize: 'clamp(70px, 22vw, 104px)', lineHeight: 0.95, overflowWrap: 'anywhere', color: C.CHALK, ...chalky }}>
              <WriteLine on={go} delay={0.7} dur={0.75} ghost>{first}{second ? ` ${ot.text('and')} ${second}` : ''}</WriteLine>
            </div>
          )}
          <ChalkLine width={210} draw={go} delay={1.4} color={C.PINK} style={{ marginTop: 6 }} />
          {go && [['star', -46, -10, C.YELLOW, 0.9], ['cap', 102, -18, C.BLUE, 1.1], ['heart', -40, 92, C.PINK, 1.25], ['aplus', 104, 86, C.CHALK, 1.35]].map(([k, x, y, c, d]) => (
            <span key={k} aria-hidden="true" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, animation: `cb-pop .35s ease-out ${d}s both` }}><ChalkDoodle kind={k} size={40} color={c} /></span>
          ))}
        </div>
        {ot.show('meta') && <div style={{ marginTop: 18, fontFamily: head, fontWeight: 700, fontSize: 25, color: C.CHALK_DIM, ...chalky }}>{ot.text('meta')}</div>}
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.25 }} style={{ marginTop: 20 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '10px 30px', display: 'inline-flex', alignItems: 'center', border: `2.5px dashed ${C.CHALK}`, borderRadius: 14, color: C.CHALK, fontFamily: head, fontWeight: 700, fontSize: 28, lineHeight: 1, animation: 'cb-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 14.5, color: C.CHALK_DIM, animation: 'cb-fade .8s ease-out 1.1s both, cb-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
      <ChalkTray style={{ position: 'absolute', left: 14, right: 14, bottom: 14 }} />
    </motion.div>
  )
}

/* Bölmə: lövhə (dark) və ya kağız */
function Panel({ id, section, title, kicker, sub, children, head, dark = false, doodle }) {
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: dark ? '70px 26px 76px' : '64px 20px 70px', overflow: 'hidden', background: dark ? BOARD_BG : PAPER_BG, color: dark ? C.CHALK : C.INK }}>
      {dark && <WoodFrame thick={10} />}
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            {doodle && <ChalkDoodle kind={doodle} size={34} color={dark ? C.YELLOW : C.INK} style={{ margin: '0 auto 6px' }} />}
            {kicker && <div style={{ fontFamily: head, fontWeight: 700, fontSize: 24, letterSpacing: '.06em', color: dark ? C.YELLOW : C.WOOD_D }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 700, fontSize: 'clamp(46px, 14vw, 62px)', lineHeight: 1, textWrap: 'balance', color: dark ? C.CHALK : C.INK, ...(dark ? chalky : null) }}>{title}</h2>}
            <ChalkLine width={150} color={dark ? C.PINK : C.WOOD} style={{ marginTop: 6 }} />
            {sub && <p style={{ margin: '10px auto 0', maxWidth: 340, fontSize: 17, color: dark ? C.CHALK_DIM : C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: '#FFFFFF', border: `1.5px solid ${C.LINE}`, borderRadius: 10,
  padding: '14px 16px', fontSize: 17, color: C.INK, outline: 'none',
}
const darkField = { ...field, background: alpha('#000000', 0.18), border: `2px dashed ${alpha(C.CHALK, 0.45)}`, color: C.CHALK }
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 12,
  fontSize: 17, fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.BOARD : '#FFFFFF', color: on ? C.CHALK : C.INK, border: `2px solid ${C.BOARD}`,
})
const darkBtn = (on) => ({ ...btn(on), background: on ? C.CHALK : 'transparent', color: on ? C.BOARD_D : C.CHALK, border: `2px dashed ${on ? C.CHALK : alpha(C.CHALK, 0.55)}` })
const suggest = { bg: '#FFFFFF', border: `1.5px solid ${C.LINE}`, active: alpha(C.YELLOW, 0.35), text: C.INK, table: C.WOOD_D, radius: 10 }

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function ChalkboardTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const year = inv.dp?.year || ''

  return (
    <div data-cb lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.PAPER, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.YELLOW, 0.4),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <ChalkOpening inv={inv} theme={theme} lang={lang} year={year} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.BOARD, border: `2px dashed ${C.CHALK}`, boxShadow: '0 8px 20px rgba(26,50,44,.45)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.YELLOW} idle={alpha(C.YELLOW, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.WOOD_D, 0.96), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 2px 0 rgba(0,0,0,.2)',
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.CHALK, 0.8), fontSize: 16, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 700, fontSize: 30, lineHeight: 1, color: C.CHALK }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — yazılmış lövhə */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: BOARD_BG, padding: '66px 30px 92px', textAlign: 'center', color: C.CHALK }}>
            <WoodFrame thick={12} />
            <ChalkDoodle kind="star" size={38} color={C.YELLOW} style={{ position: 'absolute', left: '9%', top: '12%' }} />
            <ChalkDoodle kind="cap" size={44} color={C.BLUE} style={{ position: 'absolute', right: '9%', top: '10%' }} />
            <ChalkDoodle kind="sun" size={34} color={C.YELLOW} style={{ position: 'absolute', left: '10%', bottom: 44 }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: head, fontWeight: 700, fontSize: 26, letterSpacing: '.08em', color: C.CHALK_DIM, ...chalky }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              {year && <div style={{ marginTop: 4, fontFamily: head, fontWeight: 700, fontSize: 'clamp(40px, 12vw, 54px)', lineHeight: 1, color: C.YELLOW, ...chalky }}>{fill(T.classOf, { y: year })}</div>}
              <h1 style={{ margin: '6px 0 0', fontFamily: head, fontWeight: 700, fontSize: nameSize(heroName), lineHeight: 0.95, overflowWrap: 'anywhere', color: C.CHALK, ...chalky }}>{heroName}</h1>
              <ChalkLine width={220} color={C.PINK} style={{ marginTop: 4 }} />
              <div style={{ marginTop: 18, fontFamily: head, fontWeight: 700, fontSize: 'clamp(28px, 8vw, 34px)', lineHeight: 1.1, color: C.CHALK, ...chalky }}>{inv.fullDate}</div>
              <div style={{ marginTop: 6, fontSize: 16.5, color: C.CHALK_DIM }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 16, color: C.CHALK_DIM }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              <p style={{ margin: '18px auto 0', maxWidth: 320, fontSize: 17, lineHeight: 1.55, color: C.CHALK }}>{tr.inv_join}</p>
            </div>
            <ChalkTray style={{ position: 'absolute', left: 12, right: 12, bottom: 12 }} />
          </section>

          {/* SAYĞAC — təbaşir qutuları */}
          {S.countdown && (
            <Panel section="countdown" head={head} doodle="sun" title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BOARD_BG, borderRadius: 6, boxShadow: `0 0 0 4px ${C.WOOD}, 0 10px 16px -8px rgba(0,0,0,.45)`, transform: `rotate(${[-2, 1.5, -1, 2][i]}deg)` }}>
                      <span style={{ fontFamily: head, fontWeight: 700, fontSize: 'clamp(34px, 10.4vw, 48px)', lineHeight: 1, color: [C.CHALK, C.YELLOW, C.PINK, C.BLUE][i], fontVariantNumeric: 'tabular-nums', ...chalky }}><PopDigit value={v} pop={pop} /></span>
                    </div>
                    <div style={{ marginTop: 12, fontFamily: head, fontWeight: 700, fontSize: 21, color: C.INK }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} dark doodle="arrow" title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: 6, borderRadius: 4, border: `2.5px dashed ${alpha(C.CHALK, 0.6)}` }}>
                <div style={{ overflow: 'hidden', isolation: 'isolate', borderRadius: 2 }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.BOARD} height="clamp(240px, 64vw, 300px)"
                    map={{ opacity: 0.9, filter: 'grayscale(.5)', tintOpacity: 0.16, tint: C.BOARD, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(240px, 64vw, 300px)', position: 'relative', background: PAPER_BG }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 22, fontFamily: head, fontWeight: 700, fontSize: 38, lineHeight: 1.05, color: C.CHALK, ...chalky }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontFamily: head, fontWeight: 700, fontSize: 26, color: C.YELLOW }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={darkBtn} />
            </Panel>
          )}

          {/* PROQRAM — oxlu siyahı */}
          {S.program && (
            <Panel section="program" head={head} dark doodle="aplus" title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 380, margin: '0 auto' }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 36px minmax(0, 1fr)', alignItems: 'center', gap: 4, padding: '8px 0' }}>
                    <div style={{ textAlign: 'right', fontFamily: head, fontWeight: 700, fontSize: 32, lineHeight: 1, color: [C.YELLOW, C.PINK, C.BLUE, C.CHALK][i % 4], fontVariantNumeric: 'tabular-nums', ...chalky }}>{ev.time}</div>
                    <svg aria-hidden="true" viewBox="0 0 36 14" width="34" height="14"><path d="M3 8C12 5 22 9 32 7M32 7l-6-4M32 7l-5 5" fill="none" stroke={C.CHALK_DIM} strokeWidth="2" strokeLinecap="round" /></svg>
                    <div style={{ fontSize: 17.5, lineHeight: 1.35, color: C.CHALK }}>{ev.label}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} doodle="heart" title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={body} align="center" />
            </Panel>
          )}

          {/* MASA — kiçik lövhə */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} doodle="star" title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="cb-seat-list" field={field} suggest={suggest} font={body} muted={C.MUTED} accent={C.WOOD_D}
                nameStyle={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}
                card={(num) => (
                  <div style={{ position: 'relative', maxWidth: 300, margin: '22px auto 0', padding: '26px 22px 34px', background: BOARD_BG, color: C.CHALK, textAlign: 'center', boxShadow: '0 20px 28px -16px rgba(0,0,0,.55)' }}>
                    <WoodFrame thick={10} />
                    <div style={{ position: 'relative', fontFamily: head, fontWeight: 700, fontSize: 'clamp(30px, 9vw, 38px)', lineHeight: 1, color: C.CHALK, ...chalky, overflowWrap: 'anywhere' }}>{seating.selected?.full_name}</div>
                    <ChalkLine width={140} color={C.PINK} style={{ marginTop: 4 }} />
                    <div style={{ position: 'relative', marginTop: 8, fontFamily: head, fontWeight: 700, fontSize: 30, color: C.YELLOW }}>{T.table}{' '}</div>
                    <div style={{ position: 'relative', fontFamily: head, fontWeight: 700, fontSize: tableSize(num, 96), lineHeight: 0.9, color: C.CHALK, ...chalky }}>{num}</div>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR — maqnitlər */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} dark doodle="heart" title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 18, marginBottom: 34, paddingTop: 8 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ position: 'relative', aspectRatio: '4 / 5', padding: 6, background: '#FFFFFF', boxShadow: '0 12px 18px -10px rgba(0,0,0,.55)', transform: `rotate(${i % 2 ? 2 : -2}deg)` }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: -8, width: 18, height: 18, marginLeft: -9, borderRadius: '50%', background: ['#E9573F', '#4A90D9', '#F5C33B', '#3BB273'][i % 4], boxShadow: 'inset -2px -3px 4px rgba(0,0,0,.25), 0 3px 4px rgba(0,0,0,.35)' }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.BOARD_D} bg="#FFFFFF" frame={{ borderRadius: 6 }}
                btn={darkBtn} muted={C.CHALK_DIM} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {/* RSVP — yoxlama */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} doodle="aplus" title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: C.LINE, hair: alpha(C.LINE, 0.7), accent: C.BOARD,
                font: body, display: head, displayItalic: false, btnFont: head,
                doneMark: <ChalkDoodle kind="star" size={48} color={C.WOOD} style={{ margin: '0 auto 10px' }} />,
                marker: (a) => <span style={{ display: 'block', width: 16, height: 16, borderRadius: 4, border: `2px solid ${a ? C.BOARD : C.LINE}`, background: a ? C.BOARD : 'transparent', boxShadow: a ? `inset 0 0 0 3px ${C.PAPER}` : 'none' }} />,
                suggest: { ...suggest, font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR — lövhəyə yazılanlar */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark doodle="heart" title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField} btn={darkBtn} errorColor={C.PINK} />
              <div style={{ display: 'grid', gap: 22, marginTop: 6 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '4px 4px 12px', borderBottom: `2px dashed ${alpha(C.CHALK, 0.2)}`, transform: `rotate(${[-1, 0.8, -0.5][i % 3]}deg)` }}>
                      <blockquote style={{ margin: 0, fontSize: 17.5, lineHeight: 1.55, color: C.CHALK }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 4, textAlign: 'right', fontFamily: head, fontWeight: 700, fontSize: 28, lineHeight: 1.1, color: [C.YELLOW, C.PINK, C.BLUE][i % 3], ...chalky }}>
                        — {msg.name}{msg.date ? <span style={{ fontFamily: body, fontWeight: 400, fontSize: 13, color: C.CHALK_DIM }}> · {gbook.formatDate(msg.date)}</span> : null}
                      </figcaption>
                    </figure>
                  )
                })}
              </div>
            </Panel>
          )}

          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={body} />
        </motion.div>
      )}
    </div>
  )
}

function MapPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -15, top: -15, width: 30, height: 30, borderRadius: '50%', background: '#E9573F', boxShadow: 'inset -3px -4px 6px rgba(0,0,0,.3), 0 0 0 3px #FFFFFF, 0 6px 10px rgba(0,0,0,.35)' }} />
    </span>
  )
}
