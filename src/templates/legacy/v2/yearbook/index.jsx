/* DONDURULMUŞ v2 SURƏTİ (2026-11-13) — redaktə etməyin, bax legacy/registry.js */
import { motion } from 'framer-motion'
import LanguageSwitcher from '../../../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../../../_shared/MapSection'
import { EmblemSlot } from '../../../_shared/MonoContent'
import { Reveal, PopDigit, enterDirection } from '../../../_shared/motion'
import { getTemplateTheme } from '../../../templateConfig'
import { useInvitation, useGate, openingNames, alpha } from '../../../_shared/useInvitation'
import { MusicFab, EqBars, StoryBlock, InvitationEnd, ReplyForm } from '../../../_shared/invitationKit'
import { VenueLinks, SeatFinder, PhotoQr, GuestbookForm } from '../../../_shared/blocks'
import { galleryDesc, tableSize } from '../../../_shared/kids'
import { C as PAL, MARKERS, PAGE_BG, BLUE_BG, varsity, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { fill } from '../../../_shared/copyText'
import { Doodle, Patch, Signature } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../../../_shared/palette'
import FilmReel from '../../../_shared/FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   YEARBOOK — «Məzun albomu» (Məzuniyyət konsepti, 2026-10)

   Konsept: sinif yoldaşlarının imzaladığı məzun albomu, varsity üslubu.
   Açılışda xətli albom vərəqində məzunun «şəkli» (baş hərfi); toxunanda
   rəngli markerlə imzalar və cizgilər bir-bir peyda olur, sonra «2027»
   yamağı möhür kimi vurulur. Daxildə: forma nömrəsi kimi sayğac, işarələnən
   proqram, varsity yamağında masa nömrəsi, imza kimi arzular.
   Şriftlər: Fira Sans Extra Condensed (varsity) · Fira Sans Condensed (mətn)
   · Comforter Brush (imzalar).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('yearbook')
const ID = 'yearbook'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['BLUE'], secondary: ['RED'], accent: ['YELLOW'], background: ['WHITE'], text: ['INK'] }

const KEYFRAMES = (C) => (`
@keyframes yb-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes yb-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes yb-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes yb-stamp { 0% { opacity: 0; transform: scale(2.2) rotate(-30deg) } 60% { opacity: 1; transform: scale(.92) rotate(-10deg) } 100% { opacity: 1; transform: scale(1) rotate(-12deg) } }
[data-yb] span[aria-hidden="true"], [data-yb] svg[aria-hidden="true"], [data-yb] div[aria-hidden="true"] { pointer-events: none; }
[data-yb] ::placeholder { color: rgba(105,112,138,.7); }
[data-yb] [data-dark] ::placeholder { color: rgba(255,255,255,.5); }
[data-yb] input:focus-visible, [data-yb] textarea:focus-visible { border-color: ${C.BLUE} !important; outline: none; }
[data-yb] button:focus-visible, [data-yb] a:focus-visible, [data-yb] [role="button"]:focus-visible { outline: 2px solid ${C.YELLOW}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-yb] *, [data-yb] { animation: none !important; transition: none !important; } }
`)

const SIGN_POS = [
  { left: '6%', top: '6%', rot: -9 },
  { right: '5%', top: '12%', rot: 8 },
  { left: '5%', bottom: '22%', rot: 6 },
  { right: '6%', bottom: '14%', rot: -7 },
]
const DOODLES = (C) => ([
  { kind: 'star', left: '14%', top: '26%', c: C.RED },
  { kind: 'heart', right: '10%', top: '22%', c: C.PURPLE },
  { kind: 'smile', left: '10%', bottom: '12%', c: C.GREEN },
  { kind: 'burst', right: '14%', bottom: '28%', c: C.BLUE },
])

function initial(text) {
  const t = String(text || '').trim()
  return t ? Array.from(t)[0].toLocaleUpperCase('az') : '★'
}

/* Albom «şəkli» — baş hərf */
function PhotoSlot({ name, head, size = 'min(46vw, 190px)', patch, year }) {
  const C = usePalette(PAL)
  return (
    <div style={{ position: 'relative', width: size, aspectRatio: '4 / 5', padding: 8, background: C.WHITE, boxShadow: '0 14px 24px -14px rgba(20,24,43,.45)', transform: 'rotate(-2deg)' }}>
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(160deg, ${C.BLUE}, ${C.BLUE_DD})`, overflow: 'hidden' }}>
        <span style={{ fontFamily: head, fontWeight: 800, fontSize: 'clamp(80px, 26vw, 120px)', lineHeight: 1, ...varsity(C)(100) }}>{initial(name)}</span>
      </div>
      <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: -10, width: 70, height: 20, marginLeft: -35, transform: 'rotate(3deg)', background: 'rgba(255,198,41,.75)' }} />
      {year && patch}
    </div>
  )
}

/* ═══ 01 — AÇILIŞ: imzalar peyda olur ═══ */
function YearbookOpening({ inv, theme, year, sign }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  const T = inv.copy(TXT)
  const signs = [T.sign1, T.sign2, T.sign3, T.sign4]
  return (
    <motion.div {...gate.gateProps} data-yb
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: PAGE_BG(C), color: C.INK, fontFamily: theme.fonts.body }}>
      {signs.map((t, i) => <Signature key={i} text={t} font={sign} color={MARKERS(C)[i]} rot={SIGN_POS[i].rot} size={42} delay={0.1 + i * 0.2} show={go} style={SIGN_POS[i]} />)}
      {DOODLES(C).map((d, i) => (
        <span key={i} aria-hidden="true" style={{ position: 'absolute', left: d.left, right: d.right, top: d.top, bottom: d.bottom, transform: `scale(${go ? 1 : 0})`, transition: `transform .3s cubic-bezier(.3,1.6,.5,1) ${0.2 + i * 0.2}s` }}>
          <Doodle kind={d.kind} color={d.c} size={34} />
        </span>
      ))}
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        {ot.show('kicker') && <div style={{ marginBottom: 16, fontFamily: head, fontWeight: 700, fontSize: 16, letterSpacing: '.2em', textTransform: 'uppercase', color: C.BLUE, animation: 'yb-rise .8s ease-out .2s both' }}>{ot.text('kicker')}</div>}
        <div style={{ position: 'relative' }}>
          <EmblemSlot mono={ot.mono} size={150} border={`6px solid ${C.WHITE}`} background={C.BLUE} color={C.YELLOW} font={head} style={{ animation: 'none', boxShadow: '0 14px 24px -14px rgba(20,24,43,.45)' }}>
            <PhotoSlot name={first || titleOv} head={head} year={year} patch={go ? (
              <div style={{ position: 'absolute', right: -30, bottom: -24, animation: 'yb-stamp .45s cubic-bezier(.3,.9,.4,1) 1s both' }}>
                <Patch size={78}><span style={{ fontFamily: head, fontWeight: 800, fontSize: 30, lineHeight: 1, ...varsity(C)(30) }}>{String(year).slice(-2)}</span></Patch>
              </div>
            ) : null} />
          </EmblemSlot>
        </div>
        <div style={{ marginTop: 28, animation: 'yb-rise 1s ease-out .3s both' }}>
          {titleOv !== '' && (
            <div style={{ fontFamily: head, fontWeight: 800, fontSize: 'clamp(46px, 14vw, 66px)', lineHeight: 0.95, textTransform: 'uppercase', overflowWrap: 'anywhere', color: C.BLUE }}>
              {first}{second && <><span style={{ display: 'inline-block', margin: '0 .2em', color: C.RED }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          {year && <div style={{ marginTop: 8, fontFamily: head, fontWeight: 700, fontSize: 19, letterSpacing: '.1em', textTransform: 'uppercase', color: C.INK }}>{fill(T.classOf, { y: year })}</div>}
          {ot.show('meta') && <div style={{ marginTop: 4, fontSize: 15.5, color: C.MUTED }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.25 }} style={{ marginTop: 22 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 12, background: C.YELLOW, color: C.BLUE_DD, fontFamily: head, fontWeight: 800, fontSize: 19, letterSpacing: '.06em', textTransform: 'uppercase', boxShadow: `0 5px 0 ${C.BLUE_D}`, animation: 'yb-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 14, fontSize: 14.5, color: C.MUTED, animation: 'yb-fade .8s ease-out 1.1s both, yb-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dark = false, mark = 0 }) {
  const C = usePalette(PAL)
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? BLUE_BG(C) : PAGE_BG(C), color: dark ? C.WHITE : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            {kicker && <div style={{ marginBottom: 4, fontFamily: head, fontWeight: 700, fontSize: 15, letterSpacing: '.18em', textTransform: 'uppercase', color: dark ? C.YELLOW : MARKERS(C)[mark % 4] }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 800, fontSize: scaleFont('clamp(34px, 10vw, 46px)', C.hs), lineHeight: 1, textTransform: 'uppercase', textWrap: 'balance', ...(dark ? varsity(C)(44) : { color: C.BLUE }) }}>{title}</h2>}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
              <svg aria-hidden="true" viewBox="0 0 120 12" width="110" height="11"><path d="M2 8C30 2 60 11 118 4" fill="none" stroke={dark ? C.YELLOW : MARKERS(C)[mark % 4]} strokeWidth="3" strokeLinecap="round" /></svg>
            </div>
            {sub && <p style={{ margin: '10px auto 0', maxWidth: 340, fontSize: 17, color: dark ? alpha(C.WHITE, 0.75) : C.MUTED, lineHeight: 1.5 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: C.WHITE, border: `2px solid ${C.LINE}`, borderRadius: 12,
  padding: '13px 16px', fontSize: 17, color: C.INK, outline: 'none',
})
const darkField = (C) => ({ ...field(C), background: alpha(C.WHITE, 0.1), border: `2px solid ${alpha(C.WHITE, 0.25)}`, color: C.WHITE })
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 12,
  fontSize: 17, fontWeight: 600, letterSpacing: '.04em', textDecoration: 'none', cursor: 'pointer',
  background: on ? C.BLUE : C.WHITE, color: on ? C.WHITE : C.BLUE, border: `2px solid ${C.BLUE}`, boxShadow: on ? `0 4px 0 ${C.BLUE_DD}` : 'none',
}))
const darkBtn = (C) => ((on) => ({ ...btn(C)(on), background: on ? C.YELLOW : 'transparent', color: on ? C.BLUE_DD : C.WHITE, border: `2px solid ${on ? C.YELLOW : alpha(C.WHITE, 0.5)}`, boxShadow: on ? `0 4px 0 ${C.BLUE_DD}` : 'none' }))
const suggest = (C) => ({ bg: C.WHITE, border: `2px solid ${C.LINE}`, active: alpha(C.YELLOW, 0.3), text: C.INK, table: C.BLUE, radius: 12 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function YearbookTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const sign = "'Comforter Brush', 'Caveat', cursive"
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const year = inv.dp?.year || ''
  const signs = [T.sign1, T.sign2, T.sign3, T.sign4]

  return (
    <PaletteContext.Provider value={C}><div data-yb lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.WHITE, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.YELLOW, 0.45),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <YearbookOpening inv={inv} theme={theme} year={year} sign={sign} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.YELLOW, boxShadow: `0 4px 0 ${C.BLUE_D}, 0 10px 20px rgba(15,37,102,.3)` }}>
        {({ playing }) => <EqBars playing={playing} color={C.BLUE_DD} idle={alpha(C.BLUE_DD, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.BLUE, 0.96), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `3px solid ${C.YELLOW}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.WHITE, 0.8), fontSize: 16, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 800, fontSize: 22, letterSpacing: '.04em', textTransform: 'uppercase', color: C.YELLOW }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — imzalanmış vərəq */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: PAGE_BG(C), padding: '58px 22px 60px', textAlign: 'center' }}>
            {signs.slice(0, 2).map((t, i) => <Signature key={i} text={t} font={sign} color={MARKERS(C)[i]} rot={SIGN_POS[i].rot} size={34} style={{ ...SIGN_POS[i], top: SIGN_POS[i].top ? `calc(${SIGN_POS[i].top} - 6%)` : undefined, bottom: SIGN_POS[i].bottom ? `calc(${SIGN_POS[i].bottom} + 4%)` : undefined }} />)}
            {DOODLES(C).slice(0, 2).map((d, i) => (
              <span key={i} aria-hidden="true" style={{ position: 'absolute', left: d.left, right: d.right, top: d.top, bottom: d.bottom }}><Doodle kind={d.kind} color={d.c} size={30} /></span>
            ))}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <PhotoSlot name={heroName} head={head} size="min(44vw, 180px)" year={year} patch={(
                <div style={{ position: 'absolute', right: -30, bottom: -22, transform: 'rotate(-12deg)' }}>
                  <Patch size={74}><span style={{ fontFamily: head, fontWeight: 800, fontSize: 28, lineHeight: 1, ...varsity(C)(28) }}>{String(year).slice(-2)}</span></Patch>
                </div>
              )} />
            </div>
            <div style={{ position: 'relative', marginTop: 34, fontFamily: head, fontWeight: 700, fontSize: 16, letterSpacing: '.2em', textTransform: 'uppercase', color: C.RED }}>{L('hero', 'kicker', inv.eventLabel)}</div>
            <h1 style={{ position: 'relative', margin: '6px 0 0', fontFamily: head, fontWeight: 800, fontSize: nameSize(heroName), lineHeight: 0.95, textTransform: 'uppercase', overflowWrap: 'anywhere', color: C.BLUE, animation: 'yb-rise 1s ease-out .2s both' }}>{heroName}</h1>
            {year && <div style={{ position: 'relative', display: 'inline-block', marginTop: 12, padding: '5px 14px', background: C.YELLOW, color: C.BLUE_DD, fontFamily: head, fontWeight: 800, fontSize: 18, letterSpacing: '.08em', textTransform: 'uppercase', transform: 'rotate(-2deg)' }}>{fill(T.classOf, { y: year })}</div>}
            <div style={{ position: 'relative', marginTop: 18, fontFamily: head, fontWeight: 700, fontSize: 'clamp(22px, 6.2vw, 27px)', color: C.INK }}>{inv.fullDate}</div>
            <div style={{ position: 'relative', marginTop: 4, fontSize: 17, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ position: 'relative', marginTop: 6, fontSize: 16, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <p style={{ position: 'relative', margin: '18px auto 0', maxWidth: 330, fontSize: 18, lineHeight: 1.5, color: C.INK }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — forma nömrələri */}
          {S.countdown && (
            <Panel section="countdown" head={head} dark title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ position: 'relative', aspectRatio: '1 / 1.1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.WHITE, borderRadius: '10px 10px 14px 14px', clipPath: 'polygon(0 12%, 22% 0, 36% 0, 50% 10%, 64% 0, 78% 0, 100% 12%, 100% 100%, 0 100%)', boxShadow: '0 10px 16px -10px rgba(0,0,0,.5)' }}>
                      <span style={{ marginTop: '8%', fontFamily: head, fontWeight: 800, fontSize: 'clamp(28px, 8.6vw, 40px)', lineHeight: 1, color: C.BLUE, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                    </div>
                    <div style={{ marginTop: 10, fontFamily: head, fontWeight: 700, fontSize: 13.5, letterSpacing: '.12em', textTransform: 'uppercase', color: C.YELLOW }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} mark={1} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ position: 'relative', maxWidth: 430, margin: '0 auto', padding: 8, background: C.WHITE, boxShadow: '0 18px 30px -18px rgba(20,24,43,.5)', transform: 'rotate(-1deg)' }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: 16, top: -10, width: 64, height: 20, zIndex: 2, transform: 'rotate(-6deg)', background: 'rgba(255,198,41,.75)' }} />
                <div style={{ overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.BLUE} height="clamp(240px, 66vw, 300px)"
                    map={{ opacity: 0.92, filter: 'saturate(.8)', tintOpacity: 0.1, tint: C.BLUE, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(240px, 66vw, 300px)', position: 'relative', background: PAGE_BG(C) }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 800, fontSize: 28, lineHeight: 1.1, textTransform: 'uppercase', color: C.INK }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontFamily: sign, fontSize: 26, color: C.RED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} />
            </Panel>
          )}

          {/* PROQRAM — işarələnən siyahı */}
          {S.program && (
            <Panel section="program" head={head} mark={2} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 400, margin: '0 auto' }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '34px 70px minmax(0, 1fr)', gap: 8, alignItems: 'center', padding: '12px 0', borderBottom: `2px dashed ${C.LINE}` }}>
                    <svg aria-hidden="true" viewBox="0 0 28 28" width="28" height="28">
                      <rect x="3" y="3" width="22" height="22" rx="4" fill="none" stroke={C.INK} strokeWidth="2" />
                      <path d="M7 14l5 5L24 5" fill="none" stroke={MARKERS(C)[i % 4]} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div style={{ fontFamily: head, fontWeight: 800, fontSize: 21, color: C.BLUE, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    <div style={{ fontSize: 17.5, lineHeight: 1.3, color: C.INK }}>{ev.label}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} mark={3} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" />
            </Panel>
          )}

          {/* MASA — varsity yamağı */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} dark title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="yb-seat-list" field={darkField(C)} suggest={suggest(C)} font={body} muted={alpha(C.WHITE, 0.75)} accent={C.YELLOW}
                nameStyle={{ fontFamily: sign, fontSize: 34, color: C.WHITE }}
                card={(num) => (
                  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 22 }}>
                    <Patch size={170} bg={C.BLUE_DD}>
                      <span style={{ position: 'relative', fontFamily: head, fontWeight: 700, fontSize: 16, letterSpacing: '.24em', textTransform: 'uppercase', color: C.WHITE }}>{T.table}{' '}</span>
                      <span style={{ position: 'relative', fontFamily: head, fontWeight: 800, fontSize: tableSize(num, 74), lineHeight: 0.95, ...varsity(C)(70) }}>{num}</span>
                    </Patch>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} mark={1} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 34 }} />}
              <PhotoQr inv={inv} tr={tr} fg={C.BLUE_DD} bg={C.WHITE} frame={{ borderRadius: 12, border: `3px solid ${C.BLUE}` }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} mark={0} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: C.LINE, hair: alpha(C.LINE, 0.7), accent: C.BLUE,
                font: body, display: head, displayItalic: false, btnFont: head,
                doneMark: <Doodle kind="star" size={48} color={C.YELLOW} style={{ margin: '0 auto 10px' }} />,
                marker: (a) => (
                  <svg aria-hidden="true" viewBox="0 0 28 28" width="20" height="20">
                    <rect x="3" y="3" width="22" height="22" rx="4" fill="none" stroke={a ? C.BLUE : C.LINE} strokeWidth="2.4" />
                    {a && <path d="M7 14l5 5L24 5" fill="none" stroke={C.RED} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
                  </svg>
                ),
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR — imzalar */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField(C)} btn={darkBtn(C)} errorColor={C.YELLOW} />
              <div style={{ display: 'grid', gap: 16 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '18px 20px 12px', background: PAGE_BG(C), color: C.INK, borderRadius: 4, boxShadow: '0 12px 20px -14px rgba(0,0,0,.6)', transform: `rotate(${[-1, 0.8, -0.6][i % 3]}deg)` }}>
                      <blockquote style={{ margin: 0, paddingLeft: 30, fontSize: 17.5, lineHeight: 1.7 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 2, textAlign: 'right', fontFamily: sign, fontSize: 30, lineHeight: 1.1, color: MARKERS(C)[i % 4] }}>
                        {msg.name}{msg.date ? <span style={{ display: 'block', fontFamily: body, fontSize: 13, color: C.MUTED }}>{gbook.formatDate(msg.date)}</span> : null}
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
      <span style={{ position: 'absolute', left: -20, top: -20 }}><Doodle kind="star" size={40} color={C.RED} /></span>
    </span>
  )
}
