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
import { C, GOLD_GRAD, VELVET, BALL_BG, IVORY_BG, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Mask, Curtain, GoldDust, Chandelier } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   MASQUERADE BALL — «Maskarad balı» (Bayram gecələri konsepti, 2026-10)

   Konsept: Yeni il maskarad balı — tünd məxmər pərdələr, çilçıraq və
   lələkli zərli Venesiya maskası. Toxunanda pərdələr tam açılır, maska
   yüksəlib əyilir, ətrafa qızılı toz səpələnir. Daxildə: kameo medalyonlarda
   sayğac, bal ənənəsindən «rəqs kartı» kimi proqram, maska nişanlı dəvət
   kartında masa nömrəsi.
   Şriftlər: Playfair Display SC (başlıq) · Cormorant Garamond (italik mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('masquerade-ball')
const ID = 'masquerade-ball'

const KEYFRAMES = `
@keyframes mb-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes mb-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes mb-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes mb-float { 0%,100% { transform: translateY(0) rotate(-3deg) } 50% { transform: translateY(-8px) rotate(2deg) } }
@keyframes mb-dust { from { opacity: 1; transform: translate(0, 0) scale(1) } to { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(.3) } }
@keyframes mb-glint { 0%,100% { opacity: 0 } 50% { opacity: 1 } }
[data-mb] span[aria-hidden="true"], [data-mb] svg[aria-hidden="true"], [data-mb] div[aria-hidden="true"] { pointer-events: none; }
[data-mb] ::placeholder { color: rgba(123,110,118,.7); }
[data-mb] [data-dark] ::placeholder { color: rgba(244,220,156,.45); }
[data-mb] input:focus-visible, [data-mb] textarea:focus-visible { border-color: ${C.GOLD_D} !important; outline: none; }
[data-mb] button:focus-visible, [data-mb] a:focus-visible, [data-mb] [role="button"]:focus-visible { outline: 2px solid ${C.GOLD}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-mb] *, [data-mb] { animation: none !important; transition: none !important; } }
`

const goldText = { backgroundImage: GOLD_GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent' }

/* ═══ 01 — AÇILIŞ: pərdələr açılır, maska qalxır ═══ */
function MaskOpening({ inv, theme, script }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-mb
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: BALL_BG, color: C.IVORY, fontFamily: theme.fonts.body }}>
      <Curtain side="left" open={go} />
      <Curtain side="right" open={go} />
      <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 34, zIndex: 4, background: VELVET, borderRadius: '0 0 50% 50% / 0 0 100% 100%', boxShadow: '0 8px 14px rgba(0,0,0,.45)' }} />
      <GoldDust on={go} />
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <Chandelier size={110} style={{ marginBottom: 10, filter: go ? 'drop-shadow(0 0 18px rgba(255,210,122,.8))' : 'drop-shadow(0 0 6px rgba(255,210,122,.4))', transition: 'filter .6s ease .3s' }} />
        <div style={{ animation: 'mb-rise 1s ease-out .2s both' }}>
          {ot.show('kicker') && <div style={{ fontFamily: script, fontStyle: 'italic', fontSize: 21, color: C.GOLD_L }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 4, fontFamily: head, fontWeight: 700, fontSize: 'clamp(30px, 9vw, 42px)', lineHeight: 1.08, overflowWrap: 'anywhere', ...goldText }}>
              {first}{second && <> {ot.text('and')} {second}</>}
            </div>
          )}
        </div>
        <div style={{ position: 'relative', marginTop: 46, transform: go ? 'translateY(-14px) rotate(-8deg) scale(1.06)' : 'none', transition: 'transform .8s cubic-bezier(.3,1.3,.5,1) .15s' }}>
          <div style={{ animation: go ? 'none' : 'mb-float 4s ease-in-out infinite' }}>
            <Mask size={230} />
          </div>
          <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '24%', transform: 'translate(-50%, -50%)' }}>
            <EmblemSlot mono={ot.mono} size={30} border="none" background="transparent" color={C.GOLD_L} font={head} style={{ animation: 'none', margin: 0, fontSize: 12 }}>
              <span />
            </EmblemSlot>
          </div>
        </div>
        <div style={{ marginTop: 18, animation: 'mb-rise 1s ease-out .35s both' }}>
          {ot.show('meta') && <div style={{ fontFamily: script, fontStyle: 'italic', fontSize: 19, color: alpha(C.IVORY, 0.8) }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.25 }} style={{ marginTop: 18 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: GOLD_GRAD, color: C.PLUM_D, fontFamily: head, fontWeight: 700, fontSize: 16, letterSpacing: '.06em', boxShadow: '0 12px 26px -12px rgba(217,178,95,.7)', animation: 'mb-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontFamily: script, fontStyle: 'italic', fontSize: 17, color: alpha(C.IVORY, 0.55), animation: 'mb-fade .8s ease-out 1.1s both, mb-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, script, dark = false }) {
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? BALL_BG : IVORY_BG, color: dark ? C.IVORY : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Mask size={60} stick={false} style={{ margin: '0 auto 8px' }} />
            {kicker && <div style={{ marginBottom: 2, fontFamily: script, fontStyle: 'italic', fontSize: 20, color: dark ? C.GOLD_L : C.CRIMSON }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 700, fontSize: 'clamp(27px, 7.8vw, 36px)', lineHeight: 1.12, textWrap: 'balance', ...(dark ? goldText : { color: C.PLUM }) }}>{title}</h2>}
            {sub && <p style={{ margin: '10px auto 0', maxWidth: 340, fontFamily: script, fontStyle: 'italic', fontSize: 19, color: dark ? alpha(C.IVORY, 0.72) : C.MUTED, lineHeight: 1.45 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: '#FFFDF8', border: `1px solid ${alpha(C.GOLD_D, 0.45)}`, borderRadius: 8,
  padding: '14px 16px', fontSize: 18, color: C.INK, outline: 'none',
}
const darkField = { ...field, background: alpha('#000000', 0.3), border: `1px solid ${alpha(C.GOLD, 0.4)}`, color: C.IVORY }
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 17, fontWeight: 500, letterSpacing: '.04em', textDecoration: 'none', cursor: 'pointer',
  background: on ? C.PLUM : 'transparent', color: on ? C.GOLD_L : C.PLUM, border: `1px solid ${C.PLUM}`,
})
const darkBtn = (on) => ({ ...btn(on), background: on ? GOLD_GRAD : 'transparent', color: on ? C.PLUM_D : C.GOLD_L, border: `1px solid ${on ? C.GOLD : alpha(C.GOLD, 0.5)}` })
const suggest = { bg: '#FFFDF8', border: `1px solid ${alpha(C.GOLD_D, 0.4)}`, active: alpha(C.GOLD, 0.22), text: C.INK, table: C.CRIMSON, radius: 8 }

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function MasqueradeBallTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const script = body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)

  return (
    <div data-mb lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.IVORY, minHeight: '100vh', fontFamily: body, fontSize: theme.bodyScale ? `${theme.bodyScale * 1.08}em` : '1.08em', color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      '--tpl-glow': alpha(C.GOLD, 0.4),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <MaskOpening inv={inv} theme={theme} script={script} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.PLUM, border: `1.5px solid ${C.GOLD}`, boxShadow: '0 8px 20px rgba(13,10,16,.5)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.GOLD_L} idle={alpha(C.GOLD_L, 0.35)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.BLACK, 0.94), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.GOLD, 0.3)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.IVORY, 0.72), fontSize: 17, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 700, fontSize: 19, letterSpacing: '.04em', ...goldText }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — pərdə, çilçıraq, maska */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: BALL_BG, padding: '56px 22px 64px', textAlign: 'center', color: C.IVORY }}>
            <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 30, background: VELVET, borderRadius: '0 0 50% 50% / 0 0 100% 100%', boxShadow: '0 8px 14px rgba(0,0,0,.45)' }} />
            <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '12%', background: VELVET, boxShadow: 'inset -10px 0 16px -6px rgba(0,0,0,.6)' }} />
            <span aria-hidden="true" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '12%', background: VELVET, boxShadow: 'inset 10px 0 16px -6px rgba(0,0,0,.6)' }} />
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Chandelier size={96} style={{ filter: 'drop-shadow(0 0 14px rgba(255,210,122,.7))' }} />
              <div style={{ marginTop: 10, animation: 'mb-float 5s ease-in-out infinite' }}><Mask size={190} /></div>
            </div>
            <div style={{ position: 'relative', marginTop: 14, fontFamily: script, fontStyle: 'italic', fontSize: 22, color: C.GOLD_L }}>{L('hero', 'kicker', T.ball)}</div>
            <h1 style={{ position: 'relative', margin: '6px 0 0', fontFamily: head, fontWeight: 700, fontSize: nameSize(heroName), lineHeight: 1.08, overflowWrap: 'anywhere', ...goldText, animation: 'mb-rise 1s ease-out .2s both' }}>{heroName}</h1>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ position: 'relative', marginTop: 8, fontSize: 18, fontStyle: 'italic', color: alpha(C.IVORY, 0.75) }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <div style={{ position: 'relative', width: 70, height: 1.5, margin: '18px auto 0', background: GOLD_GRAD }} />
            <div style={{ position: 'relative', marginTop: 16, fontFamily: head, fontWeight: 700, fontSize: 'clamp(19px, 5.4vw, 23px)', color: C.IVORY }}>{inv.fullDate}</div>
            <div style={{ position: 'relative', marginTop: 4, fontSize: 19, fontStyle: 'italic', color: alpha(C.IVORY, 0.72) }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            <p style={{ position: 'relative', margin: '16px auto 0', maxWidth: 320, fontSize: 20, fontStyle: 'italic', lineHeight: 1.5, color: alpha(C.IVORY, 0.88) }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — kameo medalyonlar */}
          {S.countdown && (
            <Panel section="countdown" head={head} script={script} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ aspectRatio: '0.8', padding: 4, borderRadius: '50%', background: GOLD_GRAD, boxShadow: '0 12px 18px -10px rgba(58,16,48,.55)' }}>
                      <div style={{ height: '100%', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `radial-gradient(circle at 50% 40%, ${C.PLUM_L}, ${C.PLUM_D})`, boxShadow: `inset 0 0 0 2px ${alpha(C.GOLD_L, 0.4)}` }}>
                        <span style={{ fontFamily: head, fontWeight: 700, fontSize: 'clamp(20px, 6vw, 27px)', lineHeight: 1, fontVariantNumeric: 'lining-nums tabular-nums', ...goldText }}><PopDigit value={v} pop={pop} /></span>
                      </div>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 16, fontStyle: 'italic', color: C.MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} script={script} dark title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: 5, borderRadius: '46% 46% 18px 18px / 22% 22% 18px 18px', background: GOLD_GRAD, boxShadow: '0 24px 36px -22px rgba(0,0,0,.85)' }}>
                <div style={{ borderRadius: '45% 45% 14px 14px / 21% 21% 14px 14px', overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.CRIMSON} height="clamp(250px, 70vw, 320px)"
                    map={{ opacity: 0.88, filter: 'grayscale(.5) sepia(.2)', tintOpacity: 0.16, tint: C.PLUM_L, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: IVORY_BG }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 700, fontSize: 24, lineHeight: 1.2, ...goldText }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 19, fontStyle: 'italic', color: alpha(C.IVORY, 0.72) }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={darkBtn} />
            </Panel>
          )}

          {/* PROQRAM — rəqs kartı */}
          {S.program && (
            <Panel section="program" head={head} script={script} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ position: 'relative', maxWidth: 340, margin: '46px auto 0', padding: '30px 26px 26px', background: '#FFFDF8', boxShadow: `0 0 0 1px ${alpha(C.GOLD_D, 0.4)}, 0 0 0 6px #FFFDF8, 0 0 0 7px ${C.GOLD}, 0 22px 30px -20px rgba(58,16,48,.55)` }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: -26, width: 3, height: 26, marginLeft: -1.5, background: C.CRIMSON }} />
                <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: -38, width: 16, height: 16, marginLeft: -8, borderRadius: '50%', background: C.CRIMSON, boxShadow: `0 0 0 2px ${C.GOLD}` }} />
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '26px minmax(0, 1fr) auto', gap: 8, alignItems: 'baseline', padding: '9px 0', borderBottom: i < timeline.events.length - 1 ? `1px dotted ${alpha(C.GOLD_D, 0.55)}` : 'none' }}>
                    <span style={{ fontFamily: head, fontWeight: 700, fontSize: 14, color: C.GOLD_D }}>{i + 1}.</span>
                    <span style={{ fontSize: 19.5, fontStyle: 'italic', lineHeight: 1.3, color: C.INK }}>{ev.label}</span>
                    <span style={{ fontFamily: head, fontWeight: 700, fontSize: 15, color: C.CRIMSON, fontVariantNumeric: 'lining-nums tabular-nums' }}>{ev.time}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} script={script} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" />
            </Panel>
          )}

          {/* MASA — dəvət kartı */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} script={script} dark title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="mb-seat-list" field={darkField} suggest={suggest} font={body} muted={alpha(C.IVORY, 0.72)} accent={C.GOLD_L}
                nameStyle={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}
                card={(num) => (
                  <div style={{ maxWidth: 300, margin: '22px auto 0', padding: 4, background: GOLD_GRAD, boxShadow: '0 24px 34px -18px rgba(0,0,0,.85)' }}>
                    <div style={{ padding: '22px 18px 24px', background: IVORY_BG, color: C.INK, textAlign: 'center', boxShadow: `inset 0 0 0 1px ${alpha(C.GOLD_D, 0.5)}` }}>
                      <Mask size={86} stick={false} style={{ margin: '0 auto' }} />
                      <div style={{ marginTop: 6, fontSize: 17, fontStyle: 'italic', color: C.MUTED }}>{T.guest}</div>
                      <div style={{ fontFamily: head, fontWeight: 700, fontSize: 'clamp(20px, 6vw, 25px)', lineHeight: 1.2, color: C.PLUM, overflowWrap: 'anywhere' }}>{seating.selected?.full_name}</div>
                      <div style={{ width: 50, height: 1, margin: '12px auto', background: C.GOLD_D }} />
                      <div style={{ fontFamily: head, fontSize: 14, letterSpacing: '.22em', color: C.GOLD_D }}>{T.table}{' '}</div>
                      <div style={{ fontFamily: head, fontWeight: 700, fontSize: tableSize(num, 56), lineHeight: 1, color: C.CRIMSON, fontVariantNumeric: 'lining-nums' }}>{num}</div>
                    </div>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} script={script} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16, marginBottom: 32 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ aspectRatio: '4 / 5', padding: 4, borderRadius: '50%', background: GOLD_GRAD, boxShadow: '0 12px 18px -12px rgba(58,16,48,.5)' }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '50%' }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.PLUM_D} bg="#FFFDF8" frame={{ borderRadius: 10, border: `1.5px solid ${C.GOLD}` }}
                btn={btn} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'night')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} script={script} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.GOLD_D, 0.5), hair: alpha(C.GOLD_D, 0.25), accent: C.PLUM,
                font: body, display: head, displayItalic: false, btnFont: head,
                doneMark: <Mask size={90} stick={false} style={{ margin: '0 auto 10px' }} />,
                marker: (a) => <span style={{ display: 'block', width: 12, height: 12, transform: 'rotate(45deg)', border: `1.5px solid ${a ? C.CRIMSON : alpha(C.GOLD_D, 0.6)}`, background: a ? C.CRIMSON : 'transparent' }} />,
                suggest: { ...suggest, font: body },
              }} />
            </Panel>
          )}

          {/* GİZLİ ARZULAR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} script={script} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField} btn={darkBtn} errorColor={C.GOLD_L} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '20px 22px 16px', borderRadius: 12, background: alpha('#000000', 0.28), border: `1px solid ${alpha(C.GOLD, 0.25)}` }}>
                      <blockquote style={{ margin: 0, fontSize: 21, fontStyle: 'italic', lineHeight: 1.4, color: C.IVORY }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 10, fontFamily: head, fontWeight: 700, fontSize: 14, letterSpacing: '.1em', color: C.GOLD_L }}>
                        {msg.name}{msg.date ? <span style={{ fontFamily: body, fontWeight: 400, letterSpacing: 0, fontSize: 15, fontStyle: 'italic', color: alpha(C.IVORY, 0.5) }}> · {gbook.formatDate(msg.date)}</span> : null}
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
    </div>
  )
}

function MapPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -34, top: -26, filter: 'drop-shadow(0 6px 6px rgba(0,0,0,.4))' }}><Mask size={68} stick={false} /></span>
    </span>
  )
}
