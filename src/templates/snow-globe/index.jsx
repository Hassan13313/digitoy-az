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
import { C, NIGHT_BG, FROST_BG, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { SnowGlobe, SkySnow, Bauble, Flake, GiftTag } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   SNOW GLOBE — «Qar kürəsi» (Bayram gecələri konsepti, 2026-10)

   Konsept: qış nağılı — taxta altlıqlı qar kürəsinin içində küknarlar və
   pəncərəsi işıqlı kiçik ev. Açılışda kürənin içi sakitdir; toxunanda kürə
   silkələnir, içində qar fırlanıb yağmağa başlayır, ekranda da qar yağır.
   Daxildə: yolka oyuncaqlarında sayğac, qar dənəli proqram, hədiyyə
   etiketində masa nömrəsi, açıqca kimi arzular.
   Şriftlər: Pacifico (başlıq) · Nunito (mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('snow-globe')
const ID = 'snow-globe'

const KEYFRAMES = `
@keyframes sg-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes sg-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes sg-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes sg-shake { 0%,100% { transform: rotate(0) } 20% { transform: rotate(-9deg) } 45% { transform: rotate(8deg) } 70% { transform: rotate(-5deg) } 85% { transform: rotate(3deg) } }
@keyframes sg-fall { from { transform: translate(0, 0) } to { transform: translate(var(--dx), 300px) } }
@keyframes sg-sky { from { transform: translate(0, 0) } to { transform: translate(var(--dx), 110vh) } }
[data-sg] span[aria-hidden="true"], [data-sg] svg[aria-hidden="true"], [data-sg] div[aria-hidden="true"] { pointer-events: none; }
[data-sg] ::placeholder { color: rgba(107,122,142,.7); }
[data-sg] [data-dark] ::placeholder { color: rgba(220,235,247,.55); }
[data-sg] input:focus-visible, [data-sg] textarea:focus-visible { border-color: ${C.RED} !important; outline: none; }
[data-sg] button:focus-visible, [data-sg] a:focus-visible, [data-sg] [role="button"]:focus-visible { outline: 2px solid ${C.GOLD}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-sg] *, [data-sg] { animation: none !important; transition: none !important; } }
`

/* ═══ 01 — AÇILIŞ: kürə silkələnir ═══ */
function GlobeOpening({ inv, theme }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-sg
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: NIGHT_BG, color: C.SNOW, fontFamily: theme.fonts.body }}>
      <SkySnow on={go} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ animation: 'sg-rise 1s ease-out .2s both' }}>
          {ot.show('kicker') && <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: C.GOLD }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 6, fontFamily: head, fontSize: 'clamp(34px, 10vw, 48px)', lineHeight: 1.2, overflowWrap: 'anywhere', color: C.SNOW, textShadow: '0 4px 18px rgba(0,0,0,.25)' }}>
              {first}{second && <> {ot.text('and')} {second}</>}
            </div>
          )}
        </div>
        <div style={{ position: 'relative', marginTop: 18 }}>
          <SnowGlobe size={240} snowing={go} shaking={go}
            plaque={(
              <EmblemSlot mono={ot.mono} size={30} border="none" background="transparent" color={C.NIGHT_D} font={head} style={{ animation: 'none', margin: 0, fontSize: 13 }}>
                <Flake size={16} color={C.NIGHT_D} />
              </EmblemSlot>
            )} />
        </div>
        <div style={{ marginTop: 16, animation: 'sg-rise 1s ease-out .35s both' }}>
          {ot.show('meta') && <div style={{ fontSize: 16.5, color: alpha(C.ICE, 0.8) }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.25 }} style={{ marginTop: 18 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: C.RED, color: C.SNOW, fontWeight: 800, fontSize: 16.5, boxShadow: `0 0 0 3px ${alpha(C.SNOW, 0.85)}, 0 12px 22px -10px rgba(0,0,0,.5)`, animation: 'sg-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 14, fontSize: 14.5, color: alpha(C.ICE, 0.6), animation: 'sg-fade .8s ease-out 1.1s both, sg-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dark = false }) {
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? NIGHT_BG : FROST_BG, color: dark ? C.SNOW : C.INK }}>
      {dark && <SkySnow />}
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Flake size={26} color={dark ? C.ICE : C.RED} style={{ margin: '0 auto 10px' }} />
            {kicker && <div style={{ marginBottom: 4, fontSize: 12.5, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: dark ? C.GOLD : C.RED }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 400, fontSize: 'clamp(28px, 8.4vw, 38px)', lineHeight: 1.25, textWrap: 'balance', color: dark ? C.SNOW : C.NIGHT }}>{title}</h2>}
            {sub && <p style={{ margin: '10px auto 0', maxWidth: 340, fontSize: 16.5, color: dark ? alpha(C.ICE, 0.8) : C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: '#FFFFFF', border: `1.5px solid ${C.LINE}`, borderRadius: 14,
  padding: '14px 16px', fontSize: 16.5, color: C.INK, outline: 'none',
}
const darkField = { ...field, background: alpha('#FFFFFF', 0.1), border: `1.5px solid ${alpha(C.ICE, 0.35)}`, color: C.SNOW }
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 16, fontWeight: 800, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.RED : '#FFFFFF', color: on ? C.SNOW : C.NIGHT, border: `1.5px solid ${on ? C.RED : C.LINE}`,
})
const darkBtn = (on) => ({ ...btn(on), background: on ? C.SNOW : 'transparent', color: on ? C.NIGHT : C.SNOW, border: `1.5px solid ${on ? C.SNOW : alpha(C.ICE, 0.5)}` })
const suggest = { bg: '#FFFFFF', border: `1.5px solid ${C.LINE}`, active: alpha(C.ICE, 0.8), text: C.INK, table: C.RED, radius: 14 }

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function SnowGlobeTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)

  return (
    <div data-sg lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.FROST, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.ICE, 0.6),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <GlobeOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.RED, border: `2px solid ${C.SNOW}`, boxShadow: '0 8px 20px rgba(20,40,66,.4)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.SNOW} idle={alpha(C.SNOW, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.NIGHT_D, 0.94), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.ICE, 0.25)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.ICE, 0.8), fontSize: 15.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontSize: 22, lineHeight: 1, color: C.SNOW }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — qar yağan kürə */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: NIGHT_BG, padding: '34px 22px 64px', textAlign: 'center', color: C.SNOW }}>
            <SkySnow />
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <SnowGlobe size={200} snowing plaque={<Flake size={16} color={C.NIGHT_D} />} />
            </div>
            <div style={{ position: 'relative', marginTop: 24, fontSize: 13, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: C.GOLD }}>{L('hero', 'kicker', T.ny)}</div>
            <h1 style={{ position: 'relative', margin: '6px 0 0', fontFamily: head, fontWeight: 400, fontSize: nameSize(heroName), lineHeight: 1.2, overflowWrap: 'anywhere', color: C.SNOW, animation: 'sg-rise 1s ease-out .2s both' }}>{heroName}</h1>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ position: 'relative', marginTop: 6, fontSize: 16, color: alpha(C.ICE, 0.8) }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <div style={{ position: 'relative', marginTop: 18, fontWeight: 800, fontSize: 'clamp(20px, 5.6vw, 24px)', color: C.SNOW }}>{inv.fullDate}</div>
            <div style={{ position: 'relative', marginTop: 6, fontSize: 16, color: alpha(C.ICE, 0.75) }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            <p style={{ position: 'relative', margin: '18px auto 0', maxWidth: 330, fontSize: 17, lineHeight: 1.55, color: alpha(C.SNOW, 0.9) }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — yolka oyuncaqları */}
          {S.countdown && (
            <Panel section="countdown" head={head} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ position: 'relative', maxWidth: 400, margin: '0 auto' }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: -6, right: -6, top: 0, height: 4, borderRadius: 2, background: `repeating-linear-gradient(90deg, ${C.PINE} 0 14px, ${C.PINE_L} 14px 28px)` }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(10px, 3.6vw, 18px)' }}>
                  {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                    <div key={l} style={{ textAlign: 'center' }}>
                      <Bauble i={i} drop={[22, 34, 18, 28][i]}>
                        <span style={{ position: 'relative', fontWeight: 800, fontSize: 'clamp(20px, 6vw, 27px)', lineHeight: 1, color: C.SNOW, textShadow: '0 2px 4px rgba(0,0,0,.3)', fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                      </Bauble>
                      <div style={{ marginTop: 8, fontSize: 11.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: C.MUTED }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} dark title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ position: 'relative', maxWidth: 430, margin: '0 auto', padding: 8, borderRadius: 28, background: alpha('#FFFFFF', 0.9), boxShadow: '0 24px 36px -22px rgba(0,0,0,.7)' }}>
                <div style={{ borderRadius: 22, overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.RED} height="clamp(240px, 66vw, 300px)"
                    map={{ opacity: 0.9, filter: 'saturate(.6) brightness(1.05)', tintOpacity: 0.14, tint: C.ICE, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(240px, 66vw, 300px)', position: 'relative', background: FROST_BG }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontSize: 28, lineHeight: 1.25, color: C.SNOW }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 16, color: alpha(C.ICE, 0.8) }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={darkBtn} />
            </Panel>
          )}

          {/* PROQRAM — qar dənələri */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 400, margin: '0 auto', display: 'grid', gap: 12 }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '38px 66px minmax(0, 1fr)', gap: 8, alignItems: 'center', padding: '13px 16px 13px 12px', borderRadius: 18, background: '#FFFFFF', boxShadow: '0 10px 18px -14px rgba(27,43,64,.45)' }}>
                    <Flake size={26} color={i % 2 ? C.PINE : C.RED} style={{ justifySelf: 'center' }} />
                    <div style={{ fontWeight: 800, fontSize: 18, color: C.RED, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    <div style={{ fontSize: 16.5, fontWeight: 700, lineHeight: 1.3, color: C.INK }}>{ev.label}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={body} align="center" />
            </Panel>
          )}

          {/* MASA — hədiyyə etiketi */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} dark title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="sg-seat-list" field={darkField} suggest={suggest} font={body} muted={alpha(C.ICE, 0.8)} accent={C.SNOW}
                nameStyle={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}
                card={(num) => (
                  <div style={{ paddingTop: 10, filter: 'drop-shadow(0 16px 18px rgba(0,0,0,.45))' }}>
                    <GiftTag width={220}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#6B4E2E' }}>{T.to}</div>
                      <div style={{ fontFamily: head, fontSize: 'clamp(22px, 6.4vw, 27px)', lineHeight: 1.25, color: C.NIGHT_D, overflowWrap: 'anywhere' }}>{seating.selected?.full_name}</div>
                      <div style={{ width: 50, height: 2, margin: '10px auto', background: C.RED, borderRadius: 1 }} />
                      <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '.22em', textTransform: 'uppercase', color: '#6B4E2E' }}>{T.table}{' '}</div>
                      <div style={{ fontWeight: 800, fontSize: tableSize(num, 58), lineHeight: 1, color: C.RED }}>{num}</div>
                    </GiftTag>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR — buzlu pəncərələr */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14, marginBottom: 32 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ aspectRatio: '4 / 5', padding: 6, borderRadius: '50% 50% 14px 14px / 26% 26% 14px 14px', background: '#FFFFFF', boxShadow: `inset 0 0 0 2px ${C.ICE}, 0 12px 20px -12px rgba(27,43,64,.4)` }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '50% 50% 10px 10px / 25% 25% 10px 10px' }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.NIGHT_D} bg="#FFFFFF" frame={{ borderRadius: 18, border: `2px solid ${C.ICE}` }}
                btn={btn} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'night')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: C.LINE, hair: alpha(C.LINE, 0.7), accent: C.RED,
                font: body, display: head, displayItalic: false, btnFont: body,
                doneMark: <Flake size={44} color={C.RED} style={{ margin: '0 auto 10px' }} />,
                marker: (a) => (a ? <Flake size={18} color={C.RED} /> : <span style={{ display: 'block', width: 15, height: 15, borderRadius: '50%', border: `2px solid ${C.LINE}` }} />),
                suggest: { ...suggest, font: body },
              }} />
            </Panel>
          )}

          {/* AÇIQCALAR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField} btn={darkBtn} errorColor={C.GOLD} />
              <div style={{ display: 'grid', gap: 16 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ position: 'relative', margin: 0, padding: '20px 20px 16px', borderRadius: 6, background: '#FFFFFF', color: C.INK, boxShadow: `inset 0 0 0 6px #FFFFFF, inset 0 0 0 7.5px ${i % 2 ? C.PINE : C.RED}`, transform: `rotate(${[-1, 0.8, -0.5][i % 3]}deg)` }}>
                      <Flake size={20} color={C.ICE} style={{ position: 'absolute', right: 16, top: 14 }} />
                      <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.5, paddingRight: 20 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, fontFamily: head, fontSize: 19, lineHeight: 1.3, color: i % 2 ? C.PINE : C.RED }}>
                        {msg.name}{msg.date ? <span style={{ fontFamily: body, fontSize: 13, color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}
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
      <span style={{ position: 'absolute', left: -18, top: -18, width: 36, height: 36, borderRadius: '50%', background: C.RED, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 3px #FFFFFF, 0 6px 10px rgba(0,0,0,.35)' }}><Flake size={20} color="#FFFFFF" /></span>
    </span>
  )
}
