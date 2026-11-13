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
import { C as PAL, STAGE_BG, PEARL_BG, VIOLET_GRAD, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Rays, Orb, GiftBox, NewChip } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../../../_shared/palette'
import FilmReel from '../../../_shared/FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   UNBOXING — «Təqdimat» (Açılış konsepti, 2026-10)

   Konsept: yeni məhsulun / brendin təqdimatı. Açılışda səhnədə, işıq
   şüasının altında lentli premium qutu; toxunanda qapaq qalxıb uçur,
   içəridən işıq şüaları yayılır və parlayan «məhsul» yuxarı qalxır.
   Daxildə: şüşə kartlarda sayğac, texniki göstəricilər cədvəli kimi
   proqram, giriş kartında masa nömrəsi.
   Şrift: Noto Sans Display (bütün çəkilər).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('unboxing')
const ID = 'unboxing'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['VIOLET'], secondary: ['INK'], accent: ['VIOLET_L'], background: ['PEARL'], text: ['INK'] }

const KEYFRAMES = (C) => (`
@keyframes ub-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes ub-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes ub-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes ub-spin { to { transform: rotate(360deg) } }
@keyframes ub-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
@keyframes ub-shake { 0%,100% { transform: rotate(0) } 20% { transform: rotate(-2deg) } 40% { transform: rotate(2deg) } 60% { transform: rotate(-1deg) } 80% { transform: rotate(1deg) } }
[data-ub] span[aria-hidden="true"], [data-ub] svg[aria-hidden="true"], [data-ub] div[aria-hidden="true"] { pointer-events: none; }
[data-ub] ::placeholder { color: rgba(126,128,154,.7); }
[data-ub] [data-dark] ::placeholder { color: rgba(244,243,250,.45); }
[data-ub] input:focus-visible, [data-ub] textarea:focus-visible { border-color: ${C.VIOLET} !important; outline: none; }
[data-ub] button:focus-visible, [data-ub] a:focus-visible, [data-ub] [role="button"]:focus-visible { outline: 2px solid ${C.VIOLET_L}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-ub] *, [data-ub] { animation: none !important; transition: none !important; } }
`)

const violetText = (C) => ({ backgroundImage: `linear-gradient(120deg, #FFFFFF 10%, ${C.VIOLET_L} 55%, ${C.VIOLET})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent' })

/* ═══ 01 — AÇILIŞ: qutu açılır ═══ */
function UnboxOpening({ inv, theme }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  const T = inv.copy(TXT)
  return (
    <motion.div {...gate.gateProps} data-ub
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: STAGE_BG, color: C.PEARL, fontFamily: theme.fonts.body }}>
      <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 0, width: '90%', height: '72%', transform: 'translateX(-50%)', background: 'linear-gradient(180deg, rgba(185,168,255,.16), transparent)', clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)' }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ animation: 'ub-rise 1s ease-out .2s both' }}>
          {ot.show('kicker') && <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '.3em', textTransform: 'uppercase', color: C.VIOLET_L }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 10, fontWeight: 800, fontSize: 'clamp(32px, 9.6vw, 46px)', lineHeight: 1.04, letterSpacing: '-.01em', overflowWrap: 'anywhere', ...violetText(C) }}>
              {first}{second && <> {ot.text('and')} {second}</>}
            </div>
          )}
        </div>
        {/* səhnə */}
        <div style={{ position: 'relative', width: 'min(56vw, 220px)', marginTop: 'calc(min(56vw, 220px) * .62)', animation: go ? 'ub-shake .3s ease 1' : 'none' }}>
          <Rays on={go} size={460} style={{ top: '8%' }} />
          <div style={{ position: 'absolute', left: '50%', top: '20%', zIndex: 1, transform: go ? 'translate(-50%, -150%)' : 'translate(-50%, 0)', transition: 'transform .9s cubic-bezier(.2,.8,.3,1) .45s' }}>
            <Orb size={96}>
              <EmblemSlot mono={ot.mono} size={60} border="none" background="transparent" color="#FFFFFF" font={head} style={{ animation: 'none', margin: 0 }}>
                <span />
              </EmblemSlot>
            </Orb>
          </div>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <GiftBox width="100%" open={go} label={<NewChip text={T.fresh} font={head} />} />
          </div>
        </div>
        <div style={{ marginTop: 18, animation: 'ub-rise 1s ease-out .35s both' }}>
          {ot.show('meta') && <div style={{ fontSize: 16, color: alpha(C.PEARL, 0.7) }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.25 }} style={{ marginTop: 20 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 32px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: VIOLET_GRAD(C), color: '#FFFFFF', fontWeight: 600, fontSize: 16.5, letterSpacing: '.02em', boxShadow: '0 14px 30px -12px rgba(124,92,255,.8)', animation: 'ub-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 14, color: alpha(C.PEARL, 0.5), animation: 'ub-fade .8s ease-out 1.1s both, ub-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, dark = false }) {
  const C = usePalette(PAL)
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '68px 20px 74px', overflow: 'hidden', background: dark ? STAGE_BG : PEARL_BG(C), color: dark ? C.PEARL : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 34 }}>
            {kicker && <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, letterSpacing: '.28em', textTransform: 'uppercase', color: dark ? C.VIOLET_L : C.VIOLET }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontWeight: 800, fontSize: scaleFont('clamp(30px, 8.8vw, 42px)', C.hs), lineHeight: 1.06, letterSpacing: '-.015em', textWrap: 'balance', ...(dark ? violetText(C) : { color: C.INK }) }}>{title}</h2>}
            {sub && <p style={{ margin: '12px auto 0', maxWidth: 340, fontSize: 16, color: dark ? alpha(C.PEARL, 0.7) : C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: '#FFFFFF', border: `1px solid ${C.LINE}`, borderRadius: 14,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
})
const darkField = (C) => ({ ...field(C), background: alpha('#FFFFFF', 0.06), border: `1px solid ${alpha(C.VIOLET_L, 0.3)}`, color: C.PEARL })
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 15.5, fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.INK : '#FFFFFF', color: on ? '#FFFFFF' : C.INK, border: `1px solid ${on ? C.INK : C.LINE}`,
}))
const darkBtn = (C) => ((on) => ({ ...btn(C)(on), background: on ? VIOLET_GRAD(C) : 'transparent', color: '#FFFFFF', border: `1px solid ${on ? C.VIOLET : alpha(C.VIOLET_L, 0.45)}` }))
const suggest = (C) => ({ bg: '#FFFFFF', border: `1px solid ${C.LINE}`, active: alpha(C.VIOLET, 0.12), text: C.INK, table: C.VIOLET, radius: 14 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function UnboxingTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)

  return (
    <PaletteContext.Provider value={C}><div data-ub lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.PEARL, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.VIOLET, 0.4),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <UnboxOpening inv={inv} theme={theme} lang={lang} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: VIOLET_GRAD(C), boxShadow: '0 10px 24px rgba(124,92,255,.45)' }}>
        {({ playing }) => <EqBars playing={playing} color="#FFFFFF" idle={alpha('#FFFFFF', 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.NIGHT_D, 0.86), backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
            borderBottom: `1px solid ${alpha(C.VIOLET_L, 0.18)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.PEARL, 0.7), fontSize: 15, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-.01em', color: C.PEARL }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — açılmış qutu, havada məhsul */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: STAGE_BG, padding: '30px 22px 66px', textAlign: 'center', color: C.PEARL }}>
            <div style={{ position: 'relative', width: 'min(48vw, 190px)', margin: '0 auto', paddingTop: 'calc(min(48vw, 190px) * .8)' }}>
              <Rays size={380} style={{ top: '30%' }} />
              <div style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', animation: 'ub-float 4s ease-in-out infinite' }}><Orb size={88} /></div>
              <GiftBox width="100%" open instant label={<NewChip text={T.fresh} font={head} />} />
            </div>
            <div style={{ marginTop: 22, fontSize: 12.5, fontWeight: 600, letterSpacing: '.3em', textTransform: 'uppercase', color: C.VIOLET_L }}>{L('hero', 'kicker', T.launch)}</div>
            <h1 style={{ margin: '10px 0 0', fontWeight: 800, fontSize: nameSize(heroName), lineHeight: 1.03, letterSpacing: '-.02em', overflowWrap: 'anywhere', ...violetText(C), animation: 'ub-rise 1s ease-out .2s both' }}>{heroName}</h1>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 10, fontSize: 16, color: alpha(C.PEARL, 0.72) }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <div style={{ marginTop: 22, fontWeight: 600, fontSize: 'clamp(19px, 5.4vw, 23px)', color: C.PEARL }}>{inv.fullDate}</div>
            <div style={{ marginTop: 6, fontSize: 15.5, color: alpha(C.PEARL, 0.65) }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            <p style={{ margin: '18px auto 0', maxWidth: 330, fontSize: 16.5, fontWeight: 300, lineHeight: 1.6, color: alpha(C.PEARL, 0.85) }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — şüşə kartlar */}
          {S.countdown && (
            <Panel section="countdown" dark title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop]) => (
                  <div key={l} style={{ padding: '18px 0 14px', borderRadius: 18, textAlign: 'center', background: 'linear-gradient(160deg, rgba(255,255,255,.12), rgba(255,255,255,.03))', border: `1px solid ${alpha(C.VIOLET_L, 0.25)}`, backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                    <div style={{ fontWeight: 800, fontSize: 'clamp(24px, 7vw, 32px)', lineHeight: 1, letterSpacing: '-.02em', color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></div>
                    <div style={{ marginTop: 8, fontSize: 10.5, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: C.VIOLET_L }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', borderRadius: 24, overflow: 'hidden', isolation: 'isolate', boxShadow: '0 30px 50px -30px rgba(21,21,48,.5)' }}>
                <MapSection
                  weddingData={weddingData} theme={theme} accent={C.VIOLET} height="clamp(240px, 66vw, 300px)"
                  map={{ opacity: 0.94, filter: 'grayscale(.6)', tintOpacity: 0.1, tint: C.VIOLET, blend: 'multiply' }}
                  frame={<MapPin />}
                  fallback={<div style={{ height: 'clamp(240px, 66vw, 300px)', position: 'relative', background: PEARL_BG(C) }}><MapPin /></div>}
                />
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontWeight: 800, fontSize: 24, letterSpacing: '-.01em', lineHeight: 1.2, color: C.INK }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 6, fontSize: 15, color: C.MUTED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} />
            </Panel>
          )}

          {/* PROQRAM — göstəricilər cədvəli */}
          {S.program && (
            <Panel section="program" title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 420, margin: '0 auto', borderTop: `1px solid ${C.LINE}` }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '84px minmax(0, 1fr)', gap: 12, alignItems: 'baseline', padding: '18px 4px', borderBottom: `1px solid ${C.LINE}` }}>
                    <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-.01em', color: C.VIOLET, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    <div style={{ fontSize: 17.5, fontWeight: 400, lineHeight: 1.35, color: C.INK }}>{ev.label}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={body} align="center" />
            </Panel>
          )}

          {/* MASA — giriş kartı */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" dark title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="ub-seat-list" field={darkField(C)} suggest={suggest(C)} font={body} muted={alpha(C.PEARL, 0.7)} accent={C.VIOLET_L}
                nameStyle={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}
                card={(num) => (
                  <div style={{ position: 'relative', maxWidth: 300, margin: '22px auto 0', padding: 1.5, borderRadius: 24, background: VIOLET_GRAD(C), boxShadow: '0 30px 50px -24px rgba(124,92,255,.6)' }}>
                    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 22.5, padding: '34px 22px 26px', background: 'linear-gradient(160deg, #22205A, #131234)', textAlign: 'left', color: C.PEARL }}>
                      <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 12, width: 44, height: 8, marginLeft: -22, borderRadius: 4, background: alpha('#000000', 0.45) }} />
                      <span aria-hidden="true" style={{ position: 'absolute', right: -40, bottom: -40, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,92,255,.5), transparent 70%)' }} />
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.26em', textTransform: 'uppercase', color: C.VIOLET_L }}>{T.pass}</div>
                      <div style={{ marginTop: 10, fontWeight: 800, fontSize: 'clamp(22px, 6.4vw, 27px)', lineHeight: 1.15, letterSpacing: '-.01em', overflowWrap: 'anywhere' }}>{seating.selected?.full_name}</div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 26 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: alpha(C.PEARL, 0.65) }}>{T.table}{' '}</div>
                        <div style={{ position: 'relative', fontWeight: 800, fontSize: tableSize(num, 64), lineHeight: 0.9, letterSpacing: '-.03em', ...violetText(C) }}>{num}</div>
                      </div>
                    </div>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 34 }} />}
              <PhotoQr inv={inv} tr={tr} fg={C.INK} bg="#FFFFFF" frame={{ borderRadius: 20, boxShadow: '0 20px 40px -24px rgba(21,21,48,.4)' }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'event')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: C.LINE, hair: alpha(C.LINE, 0.7), accent: C.VIOLET,
                font: body, display: body, displayItalic: false, btnFont: body,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><Orb size={54} /></div>,
                marker: (a) => <span style={{ display: 'block', width: 16, height: 16, borderRadius: '50%', border: `1.5px solid ${a ? C.VIOLET : C.LINE}`, background: a ? VIOLET_GRAD(C) : 'transparent', boxShadow: a ? 'inset 0 0 0 3px #FFFFFF' : 'none' }} />,
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* RƏYLƏR */}
          {S.guestbook && (
            <Panel section="guestbook" dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField(C)} btn={darkBtn(C)} errorColor={C.VIOLET_L} />
              <div style={{ display: 'grid', gap: 12 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '20px 20px 16px', borderRadius: 20, background: 'linear-gradient(160deg, rgba(255,255,255,.09), rgba(255,255,255,.02))', border: `1px solid ${alpha(C.VIOLET_L, 0.2)}` }}>
                      <blockquote style={{ margin: 0, fontSize: 16.5, fontWeight: 300, lineHeight: 1.6, color: C.PEARL }}>“{msg.text}”</blockquote>
                      <figcaption style={{ marginTop: 10, fontSize: 13.5, fontWeight: 600, color: C.VIOLET_L }}>
                        {msg.name}{msg.date ? <span style={{ fontWeight: 400, color: alpha(C.PEARL, 0.45) }}> · {gbook.formatDate(msg.date)}</span> : null}
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
    </div></PaletteContext.Provider>
  )
}

function MapPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -15, top: -15 }}><Orb size={30} /></span>
    </span>
  )
}
