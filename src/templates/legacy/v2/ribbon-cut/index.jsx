/* DONDURULMUŞ v2 SURƏTİ (2026-11-13) — redaktə etməyin, bax legacy/registry.js */
import { motion } from 'framer-motion'
import LanguageSwitcher from '../../../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSectionLux'
import MapSection from '../../../_shared/MapSection'
import { EmblemSlot } from '../../../_shared/MonoContent'
import { Reveal, PopDigit, enterDirection } from '../../../_shared/motion'
import { getTemplateTheme } from '../../../templateConfig'
import { useInvitation, useGate, openingNames, alpha } from '../../../_shared/useInvitation'
import { MusicFab, EqBars, StoryBlock, InvitationEnd, ReplyForm } from '../../../_shared/invitationKit'
import { VenueLinks, SeatFinder, PhotoQr, GuestbookForm } from '../../../_shared/blocks'
import { galleryDesc, tableSize } from '../../../_shared/kids'
import { C as PAL, GOLD_GRAD, RIBBON, EMERALD_BG, IVORY_BG, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Scissors, Bow, RibbonBand, DoorLeaf, GoldRain } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../../../_shared/palette'
import FilmReel from '../../../_shared/FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   RIBBON CUT — «Lentin kəsilməsi» (Açılış konsepti, 2026-10)

   Konsept: təntənəli açılışın simvolu — qırmızı atlaz lent və qızılı qayçı.
   Açılışda zümrüd rəngli qapıların önündə fiyonklu lent çəkilib; toxunanda
   qayçı enib lenti kəsir, yarılar düşür, qapılar açılır, qızılı konfetti yağır.
   Daxildə: kəsilmiş lent ucları, zümrüd lövhələrdə sayğac, lent bayraqcıqlı
   proqram, VIP kartda masa nömrəsi.
   Şriftlər: Bona Nova SC (başlıq) · Roboto Condensed (mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('ribbon-cut')
const ID = 'ribbon-cut'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['EMERALD'], secondary: ['RED'], accent: ['GOLD'], background: ['IVORY'], text: ['INK'] }

const KEYFRAMES = (C) => (`
@keyframes rc-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes rc-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes rc-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes rc-hover { 0%,100% { transform: translateY(0) rotate(-4deg) } 50% { transform: translateY(-6px) rotate(4deg) } }
@keyframes rc-fall { from { transform: translate(0, 0) rotate(0) } to { transform: translate(var(--dx), 112vh) rotate(calc(var(--r) * 3)) } }
[data-rc] span[aria-hidden="true"], [data-rc] svg[aria-hidden="true"], [data-rc] div[aria-hidden="true"] { pointer-events: none; }
[data-rc] ::placeholder { color: rgba(110,124,116,.7); }
[data-rc] [data-dark] ::placeholder { color: rgba(245,222,156,.45); }
[data-rc] input:focus-visible, [data-rc] textarea:focus-visible { border-color: ${C.GOLD_D} !important; outline: none; }
[data-rc] button:focus-visible, [data-rc] a:focus-visible, [data-rc] [role="button"]:focus-visible { outline: 2px solid ${C.GOLD}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-rc] *, [data-rc] { animation: none !important; transition: none !important; } }
`)

const goldText = (C) => ({ backgroundImage: GOLD_GRAD(C), WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent' })
const TAIL = 'polygon(0 0, 100% 0, 100% 100%, 50% 72%, 0 100%)'

/* ═══ 01 — AÇILIŞ: lent kəsilir ═══ */
function RibbonOpening({ inv, theme }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  const half = (side) => ({
    position: 'absolute', top: 0, [side]: 0, width: '50%', transformOrigin: side === 'left' ? '0 50%' : '100% 50%',
    transform: go ? `rotate(${side === 'left' ? 32 : -32}deg) translateY(30%)` : 'none',
    transition: 'transform .8s cubic-bezier(.5,0,.4,1) .4s',
  })
  return (
    <motion.div {...gate.gateProps} data-rc
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: EMERALD_BG(C), color: C.IVORY, fontFamily: theme.fonts.body }}>
      <GoldRain on={go} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ animation: 'rc-rise 1s ease-out .2s both' }}>
          {ot.show('kicker') && <div style={{ fontFamily: head, fontSize: 15, letterSpacing: '.24em', color: C.GOLD_L }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 8, fontFamily: head, fontWeight: 700, fontSize: 'clamp(30px, 9vw, 42px)', lineHeight: 1.08, overflowWrap: 'anywhere', ...goldText(C) }}>
              {first}{second && <><span style={{ display: 'inline-block', margin: '0 .2em' }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
        </div>
        {/* giriş */}
        <div style={{ position: 'relative', width: 'min(68vw, 270px)', marginTop: 110 }}>
          <div style={{ position: 'relative', aspectRatio: '0.8', padding: 8, background: GOLD_GRAD(C), borderRadius: '50% 50% 6px 6px / 18% 18% 6px 6px', boxShadow: '0 30px 40px -24px rgba(0,0,0,.8)' }}>
            <div style={{ position: 'relative', height: '100%', overflow: 'hidden', borderRadius: '50% 50% 3px 3px / 17% 17% 3px 3px', background: 'radial-gradient(60% 50% at 50% 55%, #FFF6DA, #F0C868 60%, #C9963A)' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmblemSlot mono={ot.mono} size={84} border={`2px solid ${C.GOLD_D}`} background="rgba(255,255,255,.4)" color={C.EMERALD} font={head} style={{ animation: 'none' }}>
                  <span />
                </EmblemSlot>
              </div>
              <DoorLeaf side="left" open={go} />
              <DoorLeaf side="right" open={go} />
            </div>
          </div>
          {/* lent */}
          <div style={{ position: 'absolute', left: '-14%', right: '-14%', top: '52%', height: 30, zIndex: 3 }}>
            <div style={half('left')}><RibbonBand height={30} style={{ borderRadius: '6px 0 0 6px' }} /></div>
            <div style={half('right')}><RibbonBand height={30} style={{ borderRadius: '0 6px 6px 0' }} /></div>
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: go ? 'translate(-50%, 160%) rotate(24deg)' : 'translate(-50%, -50%)', opacity: go ? 0 : 1, transition: 'transform .7s cubic-bezier(.5,0,.8,.5) .38s, opacity .3s ease .9s' }}>
              <Bow size={96} />
            </div>
          </div>
          {/* qayçı */}
          <div style={{ position: 'absolute', left: '50%', top: go ? '20%' : '-40%', zIndex: 4, transform: 'translateX(-50%)', opacity: go ? 0 : 1, transition: 'top .26s ease-in, opacity .3s ease .75s' }}>
            <div style={{ animation: go ? 'none' : 'rc-hover 2.6s ease-in-out infinite' }}>
              <Scissors size={88} closed={go} style={{ transform: 'rotate(180deg)', filter: 'drop-shadow(0 8px 10px rgba(0,0,0,.4))' }} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 22, animation: 'rc-rise 1s ease-out .35s both' }}>
          {ot.show('meta') && <div style={{ fontSize: 17, letterSpacing: '.04em', color: alpha(C.IVORY, 0.75) }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.25 }} style={{ marginTop: 18 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: RIBBON(C), color: '#FFFFFF', fontFamily: head, fontWeight: 700, fontSize: 17, letterSpacing: '.06em', boxShadow: `0 0 0 1.5px ${C.GOLD}, 0 12px 24px -12px rgba(194,31,50,.7)`, animation: 'rc-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 15, color: alpha(C.IVORY, 0.55), animation: 'rc-fade .8s ease-out 1.1s both, rc-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dark = false }) {
  const C = usePalette(PAL)
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? EMERALD_BG(C) : IVORY_BG(C), color: dark ? C.IVORY : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            {kicker && <div style={{ marginBottom: 6, fontFamily: head, fontSize: 14.5, letterSpacing: '.22em', color: dark ? C.GOLD : C.GOLD_D }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 700, fontSize: scaleFont('clamp(28px, 8.2vw, 38px)', C.hs), lineHeight: 1.1, textWrap: 'balance', ...(dark ? goldText(C) : { color: C.EMERALD }) }}>{title}</h2>}
            <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 14 }}>
              <span style={{ width: 46, height: 8, background: RIBBON(C), clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 18% 50%)' }} />
              <span style={{ width: 6, height: 6, transform: 'rotate(45deg)', background: C.GOLD }} />
              <span style={{ width: 46, height: 8, background: RIBBON(C), clipPath: 'polygon(0 0, 100% 0, 82% 50%, 100% 100%, 0 100%)' }} />
            </div>
            {sub && <p style={{ margin: '12px auto 0', maxWidth: 340, fontSize: 16.5, color: dark ? alpha(C.IVORY, 0.72) : C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: '#FFFFFF', border: `1px solid ${alpha(C.GOLD_D, 0.4)}`, borderRadius: 8,
  padding: '14px 16px', fontSize: 16.5, color: C.INK, outline: 'none',
})
const darkField = (C) => ({ ...field(C), background: alpha('#000000', 0.2), border: `1px solid ${alpha(C.GOLD, 0.4)}`, color: C.IVORY })
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 16, fontWeight: 600, letterSpacing: '.04em', textDecoration: 'none', cursor: 'pointer',
  background: on ? C.EMERALD : 'transparent', color: on ? C.GOLD_L : C.EMERALD, border: `1.5px solid ${C.EMERALD}`,
}))
const darkBtn = (C) => ((on) => ({ ...btn(C)(on), background: on ? GOLD_GRAD(C) : 'transparent', color: on ? C.EMERALD_D : C.GOLD_L, border: `1.5px solid ${on ? C.GOLD : alpha(C.GOLD, 0.5)}` }))
const suggest = (C) => ({ bg: '#FFFFFF', border: `1px solid ${alpha(C.GOLD_D, 0.4)}`, active: alpha(C.GOLD, 0.22), text: C.INK, table: C.RED, radius: 8 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function RibbonCutTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)

  return (
    <PaletteContext.Provider value={C}><div data-rc lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.IVORY, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.GOLD, 0.4),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <RibbonOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.EMERALD, border: `1.5px solid ${C.GOLD}`, boxShadow: '0 8px 20px rgba(9,40,31,.45)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.GOLD_L} idle={alpha(C.GOLD_L, 0.35)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.EMERALD_D, 0.95), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.GOLD, 0.35)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.IVORY, 0.7), fontSize: 15.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 700, fontSize: 19, letterSpacing: '.06em', ...goldText(C) }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — kəsilmiş lent */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: EMERALD_BG(C), padding: '0 22px 64px', textAlign: 'center', color: C.IVORY }}>
            <div aria-hidden="true" style={{ position: 'relative', height: 150, margin: '0 -22px' }}>
              <span style={{ position: 'absolute', left: -10, top: 40, width: '46%', transformOrigin: '0 50%', transform: 'rotate(14deg)' }}>
                <RibbonBand height={24} style={{ clipPath: 'polygon(0 0, 100% 0, 94% 50%, 100% 100%, 0 100%)' }} />
              </span>
              <span style={{ position: 'absolute', right: -10, top: 40, width: '46%', transformOrigin: '100% 50%', transform: 'rotate(-14deg)' }}>
                <RibbonBand height={24} style={{ clipPath: 'polygon(6% 50%, 0 0, 100% 0, 100% 100%, 0 100%)' }} />
              </span>
              <span style={{ position: 'absolute', left: '50%', top: 54, transform: 'translateX(-50%) rotate(8deg)' }}><Scissors size={58} closed /></span>
            </div>
            <div style={{ fontFamily: head, fontSize: 15, letterSpacing: '.24em', color: C.GOLD_L }}>{L('hero', 'kicker', T.grand)}</div>
            <h1 style={{ margin: '12px 0 0', fontFamily: head, fontWeight: 700, fontSize: nameSize(heroName), lineHeight: 1.06, overflowWrap: 'anywhere', ...goldText(C), animation: 'rc-rise 1s ease-out .2s both' }}>{heroName}</h1>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 10, fontSize: 16, letterSpacing: '.06em', color: alpha(C.IVORY, 0.75) }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <div style={{ width: 70, height: 1.5, margin: '20px auto 0', background: GOLD_GRAD(C) }} />
            <div style={{ marginTop: 18, fontFamily: head, fontWeight: 700, fontSize: 'clamp(20px, 5.6vw, 24px)', color: C.IVORY }}>{inv.fullDate}</div>
            <div style={{ marginTop: 6, fontSize: 16.5, color: alpha(C.IVORY, 0.72) }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            <p style={{ margin: '18px auto 0', maxWidth: 330, fontSize: 17, lineHeight: 1.6, color: alpha(C.IVORY, 0.85) }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — zümrüd lövhələr */}
          {S.countdown && (
            <Panel section="countdown" head={head} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ aspectRatio: '0.86', padding: 3, borderRadius: '40% 40% 6px 6px / 22% 22% 6px 6px', background: GOLD_GRAD(C), boxShadow: '0 12px 18px -10px rgba(9,40,31,.5)' }}>
                      <div style={{ height: '100%', borderRadius: '40% 40% 4px 4px / 21% 21% 4px 4px', background: EMERALD_BG(C), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: head, fontWeight: 700, fontSize: 'clamp(22px, 6.6vw, 30px)', lineHeight: 1, fontVariantNumeric: 'tabular-nums', ...goldText(C) }}><PopDigit value={v} pop={pop} /></span>
                      </div>
                    </div>
                    <div style={{ marginTop: 10, fontFamily: head, fontSize: 13, letterSpacing: '.12em', color: C.MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} dark title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: 5, borderRadius: 18, background: GOLD_GRAD(C), boxShadow: '0 24px 36px -22px rgba(0,0,0,.8)' }}>
                <div style={{ borderRadius: 14, overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.RED} height="clamp(240px, 66vw, 300px)"
                    map={{ opacity: 0.9, filter: 'grayscale(.35)', tintOpacity: 0.12, tint: C.EMERALD_L, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(240px, 66vw, 300px)', position: 'relative', background: IVORY_BG(C) }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 700, fontSize: 24, lineHeight: 1.2, ...goldText(C) }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 6, fontSize: 16, color: alpha(C.IVORY, 0.72) }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={darkBtn(C)} />
            </Panel>
          )}

          {/* PROQRAM — lent bayraqcıqları */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 400, margin: '0 auto', display: 'grid', gap: 12 }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '74px minmax(0, 1fr)', alignItems: 'stretch', background: '#FFFFFF', borderRadius: 8, overflow: 'hidden', boxShadow: '0 10px 18px -14px rgba(9,40,31,.5)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px 0 18px', background: RIBBON(C), clipPath: TAIL, color: '#FFFFFF', fontFamily: head, fontWeight: 700, fontSize: 17, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', fontSize: 17, lineHeight: 1.3, color: C.INK }}>{ev.label}</div>
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

          {/* MASA — VIP kart */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} dark title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="rc-seat-list" field={darkField(C)} suggest={suggest(C)} font={body} muted={alpha(C.IVORY, 0.72)} accent={C.GOLD_L}
                nameStyle={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}
                card={(num) => (
                  <div style={{ position: 'relative', maxWidth: 320, margin: '22px auto 0', padding: 4, borderRadius: 14, background: GOLD_GRAD(C), boxShadow: '0 24px 34px -18px rgba(0,0,0,.85)' }}>
                    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 11, padding: '26px 20px 24px', background: IVORY_BG(C), color: C.INK, textAlign: 'center' }}>
                      <span aria-hidden="true" style={{ position: 'absolute', right: -42, top: 22, width: 170, transform: 'rotate(40deg)' }}><RibbonBand height={22} /></span>
                      <div style={{ position: 'relative', fontFamily: head, fontSize: 12.5, letterSpacing: '.24em', color: C.GOLD_D }}>{T.vip}</div>
                      <div style={{ position: 'relative', marginTop: 8, fontFamily: head, fontWeight: 700, fontSize: 'clamp(22px, 6.4vw, 27px)', lineHeight: 1.15, color: C.EMERALD, overflowWrap: 'anywhere', paddingInline: 14 }}>{seating.selected?.full_name}</div>
                      <div style={{ width: 50, height: 1.5, margin: '14px auto', background: GOLD_GRAD(C) }} />
                      <div style={{ fontFamily: head, fontSize: 15, letterSpacing: '.2em', color: C.MUTED }}>{T.table}{' '}</div>
                      <div style={{ fontFamily: head, fontWeight: 700, fontSize: tableSize(num, 64), lineHeight: 1, color: C.RED }}>{num}</div>
                    </div>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 32 }} />}
              <PhotoQr inv={inv} tr={tr} fg={C.EMERALD_D} bg="#FFFFFF" frame={{ borderRadius: 12, border: `1.5px solid ${C.GOLD}` }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'event')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.GOLD_D, 0.5), hair: alpha(C.GOLD_D, 0.25), accent: C.EMERALD,
                font: body, display: head, displayItalic: false, btnFont: head,
                doneMark: <Bow size={70} style={{ margin: '0 auto 10px' }} />,
                marker: (a) => <span style={{ display: 'block', width: 12, height: 12, transform: 'rotate(45deg)', border: `1.5px solid ${a ? C.RED : alpha(C.GOLD_D, 0.6)}`, background: a ? C.RED : 'transparent' }} />,
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* TƏBRİKLƏR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField(C)} btn={darkBtn(C)} errorColor={C.GOLD_L} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '20px 20px 16px', borderRadius: 12, background: alpha('#000000', 0.18), border: `1px solid ${alpha(C.GOLD, 0.28)}` }}>
                      <blockquote style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: C.IVORY }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 10, fontFamily: head, fontWeight: 700, fontSize: 14.5, letterSpacing: '.1em', color: C.GOLD_L }}>
                        {msg.name}{msg.date ? <span style={{ fontFamily: body, fontWeight: 400, letterSpacing: 0, fontSize: 13, color: alpha(C.IVORY, 0.5) }}> · {gbook.formatDate(msg.date)}</span> : null}
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
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -32, top: -26 }}><Bow size={64} /></span>
    </span>
  )
}
