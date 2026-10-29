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
import { galleryDesc, tableSize, yearsSentence } from '../_shared/kids'
import { C, ENVS, LINEN_BG, NAVY_BG, RULED, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Envelope, Stamp, HeartLine, LetterBundle } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   LOVE LETTERS — «Sevgi məktubları» (İldönümü konsepti, 2026-10)

   Konsept: illər boyu yazılmış məktublar — ipə bağlanmış bağlama. Toxunanda
   fiyonk açılıb ip sürüşür, zərflər yelpik kimi açılır və üstdəki zərfdən
   məktub qalxır: «25 il birlikdə». Daxildə:
     sayğac   → zərflər
     proqram  → xətli məktub vərəqi
     masa     → ünvan yerində masa nömrəsi, marka
     arzular  → «P.S.» qeydləri
   Şriftlər: Great Vibes (əl yazısı) · EB Garamond (mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('love-letters')
const ID = 'love-letters'

const KEYFRAMES = `
@keyframes ll-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes ll-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes ll-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes ll-bob { 0%,100% { transform: translateY(0) rotate(-1deg) } 50% { transform: translateY(-5px) rotate(1deg) } }
[data-ll] span[aria-hidden="true"], [data-ll] svg[aria-hidden="true"], [data-ll] div[aria-hidden="true"] { pointer-events: none; }
[data-ll] ::placeholder { color: rgba(125,116,104,.7); }
[data-ll] [data-dark] ::placeholder { color: rgba(239,230,216,.5); }
[data-ll] input:focus-visible, [data-ll] textarea:focus-visible { border-color: ${C.ROSE} !important; outline: none; }
[data-ll] button:focus-visible, [data-ll] a:focus-visible, [data-ll] [role="button"]:focus-visible { outline: 2px solid ${C.ROSE}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-ll] *, [data-ll] { animation: none !important; transition: none !important; } }
`

/* Məktubun üst hissəsi */
function LetterSheet({ inv, lang, script, body }) {
  return (
    <div style={{ height: '100%', padding: '9% 8% 0', background: RULED, borderRadius: 3, boxShadow: '0 6px 14px -8px rgba(47,53,80,.45)', textAlign: 'center' }}>
      {inv.age ? (
        <>
          <div style={{ fontFamily: body, fontWeight: 500, fontSize: 'clamp(36px, 11vw, 52px)', lineHeight: 1, color: C.INK }}>{inv.age}</div>
          <div style={{ fontFamily: script, fontSize: 'clamp(24px, 7vw, 32px)', lineHeight: 1.1, color: C.ROSE }}>{yearsSentence(inv.age, lang).replace(String(inv.age), '').trim()}</div>
        </>
      ) : <HeartLine size={40} style={{ margin: '8px auto 0' }} />}
    </div>
  )
}

/* Üstdəki zərfin üzü: ünvan sətirləri + marka */
function EnvelopeFront({ inv, script, children, stamp }) {
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '10% 8%' }}>
      <div style={{ position: 'absolute', right: '7%', top: '10%' }}>{stamp || <Stamp size={40} />}</div>
      <svg aria-hidden="true" viewBox="0 0 80 80" width="54" height="54" style={{ position: 'absolute', right: '22%', top: '12%', opacity: 0.35 }}>
        <circle cx="40" cy="40" r="30" fill="none" stroke={C.INK} strokeWidth="2" />
        <circle cx="40" cy="40" r="22" fill="none" stroke={C.INK} strokeWidth="1" />
        <path d="M74 30c8 0 8 6 16 6M74 44c8 0 8 6 16 6" fill="none" stroke={C.INK} strokeWidth="2" />
      </svg>
      <div style={{ position: 'absolute', left: '10%', right: '34%', bottom: '16%', textAlign: 'left' }}>
        {children || (
          <>
            <div style={{ fontFamily: script, fontSize: 22, lineHeight: 1.1, color: C.INK }}>{inv.fullDate}</div>
            <div style={{ height: 1, marginTop: 6, background: alpha(C.INK, 0.2) }} />
            <div style={{ height: 1, marginTop: 14, width: '70%', background: alpha(C.INK, 0.2) }} />
          </>
        )}
      </div>
    </div>
  )
}

/* ═══ 01 — AÇILIŞ: bağlama açılır ═══ */
function BundleOpening({ inv, theme, lang, script }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const body = theme.fonts.body
  return (
    <motion.div {...gate.gateProps} data-ll
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: LINEN_BG, color: C.INK, fontFamily: body }}>
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        {ot.show('kicker') && <div style={{ fontSize: 13.5, letterSpacing: '.28em', textTransform: 'uppercase', color: C.MUTED, animation: 'll-rise .8s ease-out .2s both' }}>{ot.text('kicker')}</div>}
        <div style={{ marginTop: 'calc(min(74vw, 300px) * .46)', animation: go ? 'none' : 'll-bob 4s ease-in-out infinite' }}>
          <LetterBundle width="min(74vw, 300px)" open={go}
            letter={<LetterSheet inv={inv} lang={lang} script={script} body={body} />}
            front={(
              <EnvelopeFront inv={inv} script={script} stamp={(
                <Stamp size={42}>
                  <EmblemSlot mono={ot.mono} size={30} border="none" background="transparent" color="#FFFDF8" font={body} style={{ animation: 'none', margin: 0, fontSize: 13 }}>
                    <HeartLine size={20} color="#FFFDF8" />
                  </EmblemSlot>
                </Stamp>
              )} />
            )} />
        </div>
        <div style={{ marginTop: 34, animation: 'll-rise 1s ease-out .3s both' }}>
          {titleOv !== '' && (
            <div style={{ fontFamily: script, fontSize: 'clamp(44px, 13vw, 62px)', lineHeight: 1.05, wordSpacing: '.14em', overflowWrap: 'anywhere', color: C.INK }}>
              {first}{second && <><span style={{ display: 'inline-block', margin: '0 .28em', color: C.ROSE }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 4, fontSize: 16, fontStyle: 'italic', color: C.MUTED }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: 20 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: C.INK, color: C.PAPER, fontSize: 16, letterSpacing: '.06em', boxShadow: '0 12px 22px -12px rgba(47,53,80,.7)', animation: 'll-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 14.5, fontStyle: 'italic', color: C.MUTED, animation: 'll-fade .8s ease-out 1.1s both, ll-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, script, dark = false }) {
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? NAVY_BG : LINEN_BG, color: dark ? C.LINEN : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            {kicker && <div style={{ marginBottom: 2, fontSize: 13, letterSpacing: '.26em', textTransform: 'uppercase', color: dark ? C.ROSE_L : C.MUTED }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: script, fontWeight: 400, fontSize: 'clamp(42px, 12.4vw, 58px)', lineHeight: 1.12, wordSpacing: '.14em', textWrap: 'balance', color: dark ? C.PAPER : C.INK }}>{title}</h2>}
            <HeartLine size={20} color={dark ? C.ROSE_L : C.ROSE} style={{ margin: '6px auto 0' }} />
            {sub && <p style={{ margin: '10px auto 0', maxWidth: 340, fontSize: 17, fontStyle: 'italic', color: dark ? alpha(C.LINEN, 0.72) : C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: C.PAPER, border: `1px solid ${alpha(C.INK, 0.2)}`, borderRadius: 4,
  padding: '14px 16px', fontSize: 17, color: C.INK, outline: 'none',
}
const darkField = { ...field, background: alpha('#FFFFFF', 0.06), border: `1px solid ${alpha(C.LINEN, 0.25)}`, color: C.PAPER }
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 16, letterSpacing: '.04em', textDecoration: 'none', cursor: 'pointer',
  background: on ? C.INK : 'transparent', color: on ? C.PAPER : C.INK, border: `1px solid ${on ? C.INK : alpha(C.INK, 0.35)}`,
})
const darkBtn = (on) => ({ ...btn(on), background: on ? C.ROSE_L : 'transparent', color: on ? C.NAVY : C.LINEN, border: `1px solid ${on ? C.ROSE_L : alpha(C.LINEN, 0.4)}` })
const suggest = { bg: C.PAPER, border: `1px solid ${alpha(C.INK, 0.2)}`, active: alpha(C.ROSE_L, 0.25), text: C.INK, table: C.ROSE, radius: 4 }

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function LoveLettersTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const script = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)

  return (
    <div data-ll lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.LINEN, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.ROSE_L, 0.4),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <BundleOpening inv={inv} theme={theme} lang={lang} script={script} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.INK, boxShadow: '0 8px 20px rgba(38,43,66,.4)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.ROSE_L} idle={alpha(C.ROSE_L, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.LINEN, 0.94), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.INK, 0.12)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 16, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: script, fontSize: 28, color: C.INK }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — açılmış bağlama */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: LINEN_BG, padding: '44px 22px 60px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'calc(min(66vw, 270px) * .5)' }}>
              <LetterBundle width="min(66vw, 270px)" open instant
                letter={<LetterSheet inv={inv} lang={lang} script={script} body={body} />}
                front={<EnvelopeFront inv={inv} script={script} />} />
            </div>
            <div style={{ marginTop: 40, fontSize: 13.5, letterSpacing: '.28em', textTransform: 'uppercase', color: C.MUTED }}>{L('hero', 'kicker', inv.eventLabel)}</div>
            <h1 style={{ margin: '4px 0 0', fontFamily: script, fontWeight: 400, fontSize: nameSize(heroName), lineHeight: 1.08, wordSpacing: '.14em', overflowWrap: 'anywhere', color: C.INK, animation: 'll-rise 1s ease-out .2s both' }}>{heroName}</h1>
            <HeartLine size={22} style={{ margin: '10px auto 0' }} />
            <div style={{ marginTop: 12, fontSize: 'clamp(20px, 5.6vw, 23px)', letterSpacing: '.04em', color: C.INK }}>{inv.fullDate}</div>
            <div style={{ marginTop: 4, fontSize: 17, fontStyle: 'italic', color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 16, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <p style={{ margin: '18px auto 0', maxWidth: 330, fontSize: 18.5, fontStyle: 'italic', lineHeight: 1.55, color: C.INK_L }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — zərflər */}
          {S.countdown && (
            <Panel section="countdown" script={script} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16, maxWidth: 380, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <Envelope key={l} width="100%" color={ENVS[i]} back={i % 2 === 0} style={{ transform: `rotate(${[-2, 1.5, 1.2, -1.8][i]}deg)` }}>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 'clamp(30px, 9vw, 40px)', fontWeight: 500, lineHeight: 1, color: C.INK, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                      <span style={{ marginTop: 2, fontFamily: script, fontSize: 20, color: C.ROSE }}>{l}</span>
                    </div>
                  </Envelope>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" script={script} dark title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: 10, background: C.PAPER, borderRadius: 4, boxShadow: '0 24px 36px -20px rgba(0,0,0,.7)' }}>
                <div style={{ overflow: 'hidden', isolation: 'isolate', borderRadius: 2 }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.ROSE} height="clamp(240px, 64vw, 300px)"
                    map={{ opacity: 0.88, filter: 'grayscale(.4) sepia(.2)', tintOpacity: 0.12, tint: C.ROSE_L, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(240px, 64vw, 300px)', position: 'relative', background: RULED }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: script, fontSize: 38, lineHeight: 1.15, color: C.PAPER }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 16, fontStyle: 'italic', color: C.ROSE_L }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={darkBtn} />
            </Panel>
          )}

          {/* PROQRAM — xətli vərəq */}
          {S.program && (
            <Panel section="program" script={script} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ position: 'relative', maxWidth: 400, margin: '0 auto', padding: '22px 22px 18px 52px', background: RULED, backgroundPositionY: 6, borderRadius: 3, boxShadow: '0 16px 26px -18px rgba(47,53,80,.5)', transform: 'rotate(-.6deg)' }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: 36, top: 0, bottom: 0, width: 1.5, background: alpha(C.ROSE, 0.5) }} />
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '58px minmax(0, 1fr)', gap: 10, alignItems: 'baseline', minHeight: 64, paddingTop: 10 }}>
                    <div style={{ fontSize: 17, fontWeight: 500, color: C.ROSE, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    <div style={{ fontSize: 18, fontStyle: 'italic', lineHeight: 1.3, color: C.INK }}>{ev.label}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" script={script} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={body} align="center" />
            </Panel>
          )}

          {/* MASA — ünvanlı zərf */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" script={script} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="ll-seat-list" field={field} suggest={suggest} font={body} muted={C.MUTED} accent={C.ROSE}
                nameStyle={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}
                card={(num) => (
                  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
                    <Envelope width="min(84vw, 320px)" color={C.ENV1} back={false} style={{ transform: 'rotate(-1.5deg)' }}>
                      <EnvelopeFront inv={inv} script={script} stamp={(
                        <Stamp size={52} color={C.ROSE_L}>
                          <div style={{ textAlign: 'center', color: '#FFFDF8', lineHeight: 1 }}>
                            <div style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase' }}>{T.table}{' '}</div>
                            <div style={{ marginTop: 2, fontSize: tableSize(num, 26), fontWeight: 500 }}>{num}</div>
                          </div>
                        </Stamp>
                      )}>
                        <div style={{ fontSize: 13, fontStyle: 'italic', color: C.MUTED }}>{T.to}</div>
                        <div style={{ fontFamily: script, fontSize: 'clamp(24px, 7vw, 30px)', lineHeight: 1.1, color: C.INK, overflowWrap: 'anywhere' }}>{seating.selected?.full_name}</div>
                        <div style={{ height: 1, marginTop: 4, background: alpha(C.INK, 0.2) }} />
                      </EnvelopeFront>
                    </Envelope>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" script={script} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 18, marginBottom: 34 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ aspectRatio: '4 / 5', padding: 8, background: C.PAPER, boxShadow: '0 12px 18px -12px rgba(47,53,80,.5)', transform: `rotate(${i % 2 ? 1.8 : -1.8}deg)` }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'sepia(.2) saturate(.9)' }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.INK} bg={C.PAPER} frame={{ borderRadius: 4, boxShadow: '0 12px 18px -12px rgba(47,53,80,.45)' }}
                btn={btn} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" script={script} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.INK, 0.28), hair: alpha(C.INK, 0.14), accent: C.ROSE,
                font: body, display: script, displayItalic: false, btnFont: body,
                doneMark: <HeartLine size={40} style={{ margin: '0 auto 10px' }} />,
                marker: (a) => <HeartLine size={16} color={a ? C.ROSE : alpha(C.INK, 0.35)} fill={a ? C.ROSE : 'none'} />,
                suggest: { ...suggest, font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR — P.S. */}
          {S.guestbook && (
            <Panel section="guestbook" script={script} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField} btn={darkBtn} errorColor={C.ROSE_L} />
              <div style={{ display: 'grid', gap: 16 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '22px 22px 16px', background: RULED, color: C.INK, borderRadius: 3, boxShadow: '0 14px 22px -14px rgba(0,0,0,.7)', transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)` }}>
                      <blockquote style={{ margin: 0, fontSize: 17.5, fontStyle: 'italic', lineHeight: 1.6 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 6, textAlign: 'right', fontFamily: script, fontSize: 27, lineHeight: 1.1, color: C.ROSE }}>
                        {msg.name}{msg.date ? <span style={{ display: 'block', fontFamily: body, fontSize: 13, color: C.MUTED }}>{gbook.formatDate(msg.date)}</span> : null}
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
      <span style={{ position: 'absolute', left: -21, top: -26 }}><Stamp size={36} rot={-6} /></span>
    </span>
  )
}
