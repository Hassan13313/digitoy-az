import { motion } from 'framer-motion'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../_shared/MapSection'
import { EmblemSlot } from '../_shared/MonoContent'
import { Reveal, PopDigit, enterDirection } from '../_shared/motion'
import { getTemplateTheme } from '../templateConfig'
import { useInvitation, useGate, openingNames, alpha } from '../_shared/useInvitation'
import { MusicFab, EqBars, StoryBlock, InvitationEnd, ReplyForm } from '../_shared/invitationKit'
import { VenueLinks, SeatFinder, PhotoQr, GuestbookForm } from '../_shared/blocks'
import { galleryDesc, tableSize, yearsSentence } from '../_shared/kids'
import { C as PAL, RAINBOW, CREAM_BG, CHOC_BG, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Rainbow, SunsetScene, Polaroid, Camera } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'
import FilmReel from '../_shared/FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   RETRO POLAROID — «Ani foto» (İldönümü konsepti, 2026-10)

   Konsept: 70-ci illərin ani foto kamerası. Açılışda kamera dayanır; toxunanda
   flaş çaxır, kameradan polaroid çıxır və gözümüz önündə aşkarlanır —
   gün batımı səhnəsində birlikdə keçən illər, ağ kənarında əl yazısı ilə adlar.
   Daxildə: polaroid sayğac, göy qurşağı zolaqlı proqram, polaroid masa kartı.
   Şriftlər: Marmelad (başlıq) · Pangolin (əl yazısı) · Bellota Text (mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('retro-polaroid')
const ID = 'retro-polaroid'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['ORANGE'], secondary: ['TEAL'], accent: ['MUSTARD'], background: ['CREAM'], text: ['INK'] }

const KEYFRAMES = (C) => (`
@keyframes rp-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes rp-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes rp-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes rp-flash { 0% { opacity: 0 } 12% { opacity: .95 } 100% { opacity: 0 } }
@keyframes rp-shake { 0%,100% { transform: rotate(0) } 25% { transform: rotate(-1.5deg) } 75% { transform: rotate(1.5deg) } }
[data-rp] span[aria-hidden="true"], [data-rp] svg[aria-hidden="true"], [data-rp] div[aria-hidden="true"] { pointer-events: none; }
[data-rp] ::placeholder { color: rgba(138,110,88,.7); }
[data-rp] [data-dark] ::placeholder { color: rgba(244,234,213,.5); }
[data-rp] input:focus-visible, [data-rp] textarea:focus-visible { border-color: ${C.ORANGE} !important; outline: none; }
[data-rp] button:focus-visible, [data-rp] a:focus-visible, [data-rp] [role="button"]:focus-visible { outline: 2px solid ${C.ORANGE}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-rp] *, [data-rp] { animation: none !important; transition: none !important; } }
`)

function shortDate(inv, raw) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(raw || ''))
  return m ? `${m[3]}.${m[2]}.${m[1]}` : inv.fullDate
}

const OUTLINE = '2px 0 0 #7A3B2A, -2px 0 0 #7A3B2A, 0 2px 0 #7A3B2A, 0 -2px 0 #7A3B2A, 2px 2px 0 #7A3B2A, -2px 2px 0 #7A3B2A, 2px -2px 0 #7A3B2A, -2px -2px 0 #7A3B2A, 0 5px 0 #7A3B2A'

/* Foto sahəsi: gün batımı + il sayı */
function ScenePhoto({ inv, lang, head, big = 'clamp(54px, 17vw, 76px)' }) {
  return (
    <SunsetScene>
      {inv.age ? (
        <div style={{ marginTop: '-14%' }}>
          <div style={{ fontFamily: head, fontSize: big, lineHeight: 1, color: '#FFF4D6', textShadow: OUTLINE }}>{inv.age}</div>
          <div style={{ display: 'inline-block', marginTop: 6, padding: '3px 12px 4px', borderRadius: 999, background: '#7A3B2A', fontFamily: head, fontSize: 14, color: '#FFF4D6' }}>{yearsSentence(inv.age, lang, inv.strings).replace(String(inv.age), '').trim()}</div>
        </div>
      ) : null}
    </SunsetScene>
  )
}

/* ═══ 01 — AÇILIŞ: kamera şəkil çəkir ═══ */
function CameraOpening({ inv, theme, lang, hand, date }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-rp
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: CREAM_BG(C), color: C.INK, fontFamily: theme.fonts.body }}>
      <Rainbow style={{ position: 'absolute', left: 0, right: 0, top: 0 }} thick={4} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 22px 0', textAlign: 'center' }}>
        <div style={{ animation: 'rp-rise 1s ease-out .2s both' }}>
          {ot.show('kicker') && <div style={{ fontFamily: hand, fontSize: 18, color: C.ORANGE }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 4, fontFamily: head, fontSize: 'clamp(32px, 9.6vw, 46px)', lineHeight: 1.08, overflowWrap: 'anywhere', color: C.CHOC }}>
              {first}{second && <><span style={{ display: 'inline-block', margin: '0 .2em', color: C.ORANGE }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 6, fontSize: 15, color: C.MUTED }}>{ot.text('meta')}</div>}
        </div>
        <div style={{ position: 'relative', marginTop: 22, zIndex: 2, animation: go ? 'rp-shake .25s ease 1' : 'none' }}>
          <Camera width="min(54vw, 220px)" flash={go} />
          {!go && (
            <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '57%', transform: 'translate(-50%, -50%)' }}>
              <EmblemSlot mono={ot.mono} size={46} border="none" background="#2A2420" color={C.CREAM} font={head} style={{ animation: 'none', margin: 0 }}>
                <span />
              </EmblemSlot>
            </div>
          )}
        </div>
        {/* foto çıxışı: polaroid buradan sürüşür */}
        <div style={{ position: 'relative', width: 'min(60vw, 240px)', height: 'calc(min(48vw, 196px) * 1.2)', marginTop: -10, overflow: 'hidden', zIndex: 1 }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, transform: `translate(-50%, ${go ? '0' : '-102%'})`, transition: 'transform .75s cubic-bezier(.3,.7,.3,1) .2s' }}>
            <Polaroid width="min(48vw, 196px)" developed={go}
              photo={<ScenePhoto inv={inv} lang={lang} head={head} big="clamp(44px, 14vw, 62px)" />}
              caption={<span style={{ fontFamily: hand, fontSize: 15, color: C.CHOC_L, lineHeight: 1.2 }}>{shortDate(inv, date)}</span>} />
          </div>
          <motion.div animate={go ? { opacity: 0 } : {}} transition={{ duration: 0.2 }} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {ot.show('cta') && (
              <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: C.CHOC, color: C.CREAM, fontFamily: head, fontSize: 17, boxShadow: `0 4px 0 ${C.ORANGE}`, animation: 'rp-rise .8s ease-out .8s both' }}>
                {ot.text('cta')}
              </div>
            )}
            {ot.show('hint') && <div style={{ marginTop: 14, fontFamily: hand, fontSize: 15, color: C.MUTED, animation: 'rp-fade .8s ease-out 1.1s both, rp-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
          </motion.div>
        </div>
      </div>
      {go && <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: '#FFFFFF', animation: 'rp-flash .6s ease-out both' }} />}
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, hand, dark = false }) {
  const C = usePalette(PAL)
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? CHOC_BG(C) : CREAM_BG(C), color: dark ? C.CREAM : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            {kicker && <div style={{ marginBottom: 4, fontFamily: hand, fontSize: 18, color: dark ? C.MUSTARD : C.ORANGE }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 400, fontSize: scaleFont('clamp(31px, 9vw, 42px)', C.hs), lineHeight: 1.1, textWrap: 'balance', color: dark ? C.CREAM : C.CHOC }}>{title}</h2>}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}><Rainbow thick={2.5} style={{ width: 72, borderRadius: 3 }} /></div>
            {sub && <p style={{ margin: '12px auto 0', maxWidth: 340, fontSize: 16, color: dark ? alpha(C.CREAM, 0.72) : C.MUTED, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: C.WHITE, border: `1.5px solid ${alpha(C.BROWN, 0.3)}`, borderRadius: 14,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
})
const darkField = (C) => ({ ...field(C), background: alpha('#FFFFFF', 0.07), border: `1.5px solid ${alpha(C.CREAM, 0.25)}`, color: C.CREAM })
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 15.5, fontWeight: 700, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.CHOC : 'transparent', color: on ? C.CREAM : C.CHOC, border: `1.5px solid ${C.CHOC}`, boxShadow: on ? `0 4px 0 ${C.ORANGE}` : 'none',
}))
const darkBtn = (C) => ((on) => ({ ...btn(C)(on), background: on ? C.MUSTARD : 'transparent', color: on ? C.CHOC : C.CREAM, border: `1.5px solid ${on ? C.MUSTARD : alpha(C.CREAM, 0.45)}`, boxShadow: on ? `0 4px 0 ${C.RED}` : 'none' }))
const suggest = (C) => ({ bg: C.WHITE, border: `1.5px solid ${alpha(C.BROWN, 0.3)}`, active: alpha(C.MUSTARD, 0.3), text: C.INK, table: C.ORANGE, radius: 14 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function RetroPolaroidTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const hand = "'Pangolin', 'Marmelad', cursive"
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)

  return (
    <PaletteContext.Provider value={C}><div data-rp lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.CREAM, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.ORANGE, 0.35),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <CameraOpening inv={inv} theme={theme} lang={lang} hand={hand} date={weddingData.date} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.CHOC, boxShadow: `0 4px 0 ${C.ORANGE}, 0 10px 20px rgba(59,36,24,.35)` }}>
        {({ playing }) => <EqBars playing={playing} color={C.MUSTARD} idle={alpha(C.MUSTARD, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.CREAM, 0.94), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.BROWN, 0.18)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 15, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontSize: 21, color: C.CHOC }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — aşkarlanmış polaroid */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: CREAM_BG(C), padding: '44px 22px 60px', textAlign: 'center' }}>
            <Rainbow vertical thick={5} style={{ position: 'absolute', left: 18, top: 0, bottom: 0, opacity: 0.9 }} />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Polaroid width="min(62vw, 250px)" rot={-3}
                photo={<ScenePhoto inv={inv} lang={lang} head={head} />}
                caption={<span style={{ fontFamily: hand, fontSize: 18, color: C.CHOC_L, lineHeight: 1.2 }}>{shortDate(inv, weddingData.date)}</span>} />
            </div>
            <div style={{ marginTop: 26, fontFamily: hand, fontSize: 19, color: C.ORANGE }}>{L('hero', 'kicker', inv.eventLabel)}</div>
            <h1 style={{ margin: '4px 0 0', fontFamily: head, fontWeight: 400, fontSize: nameSize(heroName), lineHeight: 1.06, overflowWrap: 'anywhere', color: C.CHOC, animation: 'rp-rise 1s ease-out .2s both' }}>{heroName}</h1>
            <div style={{ marginTop: 18, fontFamily: head, fontSize: 'clamp(20px, 5.6vw, 24px)', color: C.CHOC }}>{inv.fullDate}</div>
            <div style={{ marginTop: 6, fontSize: 16, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 15, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <p style={{ margin: '18px auto 0', maxWidth: 330, fontFamily: hand, fontSize: 19, lineHeight: 1.5, color: C.CHOC_L }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — kiçik polaroidlər */}
          {S.countdown && (
            <Panel section="countdown" head={head} hand={hand} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <div key={l} style={{ padding: '7% 7% 0', background: C.WHITE, boxShadow: '0 10px 16px -10px rgba(59,36,24,.5)', transform: `rotate(${[-4, 3, -2, 4][i]}deg)` }}>
                    <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: RAINBOW(C)[i] }}>
                      <span style={{ fontFamily: head, fontSize: 'clamp(22px, 6.6vw, 30px)', lineHeight: 1, color: C.WHITE, fontVariantNumeric: 'tabular-nums', textShadow: '0 2px 0 rgba(0,0,0,.18)' }}><PopDigit value={v} pop={pop} /></span>
                    </div>
                    <div style={{ padding: '6px 0 8px', textAlign: 'center', fontFamily: hand, fontSize: 13.5, color: C.CHOC_L }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} hand={hand} dark title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: '10px 10px 40px', background: C.WHITE, boxShadow: '0 24px 36px -20px rgba(0,0,0,.7)', transform: 'rotate(-1.5deg)' }}>
                <div style={{ overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.ORANGE} height="clamp(230px, 62vw, 290px)"
                    map={{ opacity: 0.88, filter: 'sepia(.35) saturate(1.1)', tintOpacity: 0.14, tint: C.MUSTARD, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(230px, 62vw, 290px)', position: 'relative', background: CREAM_BG(C) }}><MapPin /></div>}
                  />
                </div>
                <div style={{ marginTop: 10, textAlign: 'center', fontFamily: hand, fontSize: 19, color: C.CHOC }}>{weddingData.venueName}</div>
              </div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 20, fontFamily: hand, fontSize: 17, color: C.MUSTARD }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={darkBtn(C)} />
            </Panel>
          )}

          {/* PROQRAM — göy qurşağı xətti */}
          {S.program && (
            <Panel section="program" head={head} hand={hand} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ position: 'relative', maxWidth: 380, margin: '0 auto' }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '72px minmax(0, 1fr)', gap: 14, alignItems: 'stretch' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px 0', background: RAINBOW(C)[i % 4], color: C.WHITE, borderRadius: i === 0 ? '14px 14px 0 0' : i === timeline.events.length - 1 ? '0 0 14px 14px' : 0 }}>
                      <span style={{ fontFamily: head, fontSize: 18, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '14px 0', borderBottom: i < timeline.events.length - 1 ? `1px dashed ${alpha(C.BROWN, 0.25)}` : 'none', fontSize: 16.5, lineHeight: 1.35, color: C.INK }}>{ev.label}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} hand={hand} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" />
            </Panel>
          )}

          {/* MASA — polaroid */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} hand={hand} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="rp-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={C.MUTED} accent={C.ORANGE}
                nameStyle={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}
                card={(num) => (
                  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 22 }}>
                    <Polaroid width={210} rot={2}
                      photo={(
                        <SunsetScene sun={false}>
                          <div style={{ marginTop: '-12%', color: '#FFF4D6' }}>
                            <div style={{ display: 'inline-block', padding: '2px 12px 3px', borderRadius: 999, background: '#7A3B2A', fontFamily: hand, fontSize: 16 }}>{T.table}{' '}</div>
                            <div style={{ marginTop: 4, fontFamily: head, fontSize: tableSize(num, 74), lineHeight: 1, textShadow: OUTLINE }}>{num}</div>
                          </div>
                        </SunsetScene>
                      )}
                      caption={<span style={{ fontFamily: hand, fontSize: 18, color: C.CHOC, lineHeight: 1.2 }}>{seating.selected?.full_name}</span>} />
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} hand={hand} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 34 }} />}
              <PhotoQr inv={inv} tr={tr} fg={C.CHOC} bg={C.WHITE} frame={{ borderRadius: 4, padding: 10, boxShadow: '0 12px 18px -12px rgba(59,36,24,.5)' }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} hand={hand} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.BROWN, 0.35), hair: alpha(C.BROWN, 0.18), accent: C.ORANGE,
                font: body, display: head, displayItalic: false, btnFont: head,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><Rainbow thick={4} style={{ width: 80, borderRadius: 4 }} /></div>,
                marker: (a) => <span style={{ display: 'block', width: 15, height: 15, borderRadius: '50%', border: `2px solid ${a ? C.ORANGE : alpha(C.BROWN, 0.4)}`, background: a ? C.MUSTARD : 'transparent' }} />,
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} hand={hand} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField(C)} btn={darkBtn(C)} errorColor={C.MUSTARD} />
              <div style={{ display: 'grid', gap: 16 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, display: 'grid', gridTemplateColumns: '8px minmax(0, 1fr)', background: C.CREAM_L, color: C.INK, borderRadius: 4, overflow: 'hidden', transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)` }}>
                      <span aria-hidden="true" style={{ background: RAINBOW(C)[i % 4] }} />
                      <div style={{ padding: '18px 18px 14px' }}>
                        <blockquote style={{ margin: 0, fontFamily: hand, fontSize: 18.5, lineHeight: 1.45 }}>{msg.text}</blockquote>
                        <figcaption style={{ marginTop: 8, fontFamily: head, fontSize: 15, color: C.ORANGE }}>
                          {msg.name}{msg.date ? <span style={{ fontFamily: body, fontSize: 13, color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}
                        </figcaption>
                      </div>
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
      <span style={{ position: 'absolute', left: -16, top: -16, width: 32, height: 32, borderRadius: '50%', background: `conic-gradient(${C.RED} 0 25%, ${C.ORANGE} 0 50%, ${C.MUSTARD} 0 75%, ${C.TEAL} 0)`, boxShadow: '0 0 0 4px #FFFFFF, 0 6px 12px rgba(0,0,0,.35)' }} />
    </span>
  )
}
