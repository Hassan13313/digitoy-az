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
import { galleryDesc, tableSize } from '../_shared/kids'
import { C as PAL, KNIT, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Teddy, Heart, Button, Bunting, Patch } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'
import FilmReel from '../_shared/FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   TEDDY BEAR — «Ayıcıq» (Baby shower konsepti, 2026-10)

   Konsept: yumşaq plüş ayıcıq, toxunma yorğan, düymələr və bayraqcıqlar —
   uşaq otağının istiliyi. Açılışda ayıcıq toxunma yorğanın arxasından
   yalnız qulaqlarını göstərir; toxunanda qalxır, əl yelləyir, ürəkciklər
   uçur. Daxildə:
     hero      → bayraqcıq girlyandası və ürək tutan ayıcıq
     sayğac    → dörd toxunma yamaq (tikiş xətti ilə)
     proqram   → düymələr və sap
     masa      → ayıcığın əlindəki lövhədə masa nömrəsi
   Şriftlər: Comfortaa (başlıq) · Nunito (mətn) — Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('teddy-bear')
const ID = 'teddy-bear'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['HONEY_D'], secondary: ['BLUSH'], accent: ['SKY'], background: ['CREAM'], text: ['INK'] }

const PATCHES = (C) => ([C.SKY, C.BLUSH, '#F2E2B8', C.SAGE])

const KEYFRAMES = (C) => (`
@keyframes tb-wave { from { transform: rotate(-6deg) } to { transform: rotate(22deg) } }
@keyframes tb-flag { from { transform: rotate(-4deg) } to { transform: rotate(4deg) } }
@keyframes tb-float { 0% { transform: translateY(0) scale(.6); opacity: 0 } 20% { opacity: 1 } 100% { transform: translateY(-220px) scale(1.1); opacity: 0 } }
@keyframes tb-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
@keyframes tb-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes tb-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes tb-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes tb-peek { 0% { transform: translateY(40px) } 100% { transform: none } }
[data-tb] span[aria-hidden="true"], [data-tb] svg[aria-hidden="true"], [data-tb] div[aria-hidden="true"] { pointer-events: none; }
[data-tb] ::placeholder { color: rgba(143,119,101,.6); }
[data-tb] input:focus-visible, [data-tb] textarea:focus-visible { border-color: ${C.HONEY} !important; outline: none; }
[data-tb] button:focus-visible, [data-tb] a:focus-visible, [data-tb] [role="button"]:focus-visible { outline: 3px solid ${C.SKY_D}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-tb] *, [data-tb] { animation: none !important; transition: none !important; } }
`)

const CREAM_BG = (C) => (`radial-gradient(90% 60% at 50% 0%, #FFFFFF, transparent 70%), ${C.CREAM}`)
const OAT_BG = (C) => (`${KNIT(C)(C.HONEY_D, 0.05)}, ${C.OAT}`)
const HEARTS = (C) => ([[-70, 0.0, C.BLUSH_D], [-20, 0.25, C.SKY_D], [40, 0.12, C.BLUSH_D], [80, 0.35, '#E3B76B'], [0, 0.45, C.BLUSH_D]])

/* ═══ 01 — AÇILIŞ: ayıcıq yorğanın arxasından çıxır ═══ */
function TeddyOpening({ inv, theme }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-tb
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: `linear-gradient(180deg, #E4F0F8, ${C.CREAM} 60%)`, color: C.INK, fontFamily: theme.fonts.body }}>
      <Bunting count={8} style={{ position: 'absolute', left: 0, right: 0, top: 0 }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: '12%', padding: '0 24px', textAlign: 'center', animation: 'tb-rise 1s ease-out .2s both' }}>
        <EmblemSlot mono={ot.mono} size={50} border={`2px dashed ${C.HONEY}`} background="#FFFFFF" color={C.HONEY_D} font={head} style={{ animation: 'none', margin: '0 auto 10px' }}>
          <Heart size={22} style={{ margin: '0 auto' }} />
        </EmblemSlot>
        {ot.show('kicker') && <div style={{ fontFamily: head, fontWeight: 700, fontSize: 16, color: C.SKY_D }}>{ot.text('kicker')}</div>}
        {titleOv !== '' && (
          <div style={{ marginTop: 6, fontFamily: head, fontWeight: 700, fontSize: 'clamp(34px, 10vw, 48px)', lineHeight: 1.1, color: C.INK, overflowWrap: 'anywhere' }}>
            {first}{second && <><span style={{ display: 'block', fontSize: '.5em', color: C.BLUSH_D }}>{ot.text('and')}</span>{second}</>}
          </div>
        )}
        {ot.show('meta') && <div style={{ marginTop: 8, fontSize: 15, fontWeight: 600, color: C.MUTED }}>{ot.text('meta')}</div>}
      </div>
      {/* ayıcıq */}
      <div style={{ position: 'absolute', left: '50%', bottom: '18%', width: 'min(56vw, 220px)', marginLeft: 'calc(min(56vw, 220px) / -2)', transform: go ? 'translateY(-18%)' : 'translateY(42%)', transition: 'transform .9s cubic-bezier(.3,1.4,.5,1)', animation: go ? 'none' : 'tb-peek 1s ease-out .3s both' }}>
        <Teddy width="100%" wave={go} />
        {go && HEARTS(C).map(([x, d, c], i) => (
          <span key={i} aria-hidden="true" style={{ position: 'absolute', left: `calc(50% + ${x}px)`, top: '10%', animation: `tb-float 1.3s ease-out ${d + 0.4}s both` }}><Heart size={20 + (i % 2) * 6} color={c} /></span>
        ))}
      </div>
      {/* yorğan */}
      <div style={{ position: 'absolute', left: -10, right: -10, bottom: 0, height: '34%', background: `${KNIT(C)('#FFFFFF', 0.45)}, ${C.SKY}`, borderRadius: '50% 50% 0 0 / 22px 22px 0 0', boxShadow: '0 -10px 24px -10px rgba(91,67,50,.25)', transform: go ? 'translateY(30%)' : 'none', transition: 'transform .8s ease' }}>
        <div aria-hidden="true" style={{ position: 'absolute', left: 16, right: 16, top: 10, borderTop: '2px dashed rgba(255,255,255,.9)', borderRadius: '50% 50% 0 0 / 14px 14px 0 0' }} />
        <motion.div animate={go ? { opacity: 0 } : {}} transition={{ duration: 0.25 }} style={{ position: 'absolute', left: 0, right: 0, top: '30%', textAlign: 'center' }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 28px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: '#FFFFFF', color: C.INK, fontFamily: head, fontWeight: 700, fontSize: 16, boxShadow: '0 10px 20px -10px rgba(91,67,50,.5)', animation: 'tb-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 10, fontSize: 13.5, fontWeight: 600, color: C.INK, opacity: 0.75, animation: 'tb-fade .8s ease-out 1.1s both, tb-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, oat = false }) {
  const C = usePalette(PAL)
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '62px 20px 68px', overflow: 'hidden', background: oat ? OAT_BG(C) : CREAM_BG(C) }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
              <Button size={16} color={C.SKY} /><Button size={22} color={C.BLUSH} /><Button size={16} color={C.SAGE} />
            </div>
            {title && <h2 style={{ margin: '12px 0 0', fontFamily: head, fontWeight: 700, fontSize: scaleFont('clamp(25px, 7.4vw, 33px)', C.hs), lineHeight: 1.2, color: C.INK, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontWeight: 600, fontSize: 15.5, color: C.MUTED }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 340, fontSize: 15.5, color: C.MUTED, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: '#FFFFFF', border: `2px solid ${alpha(C.HONEY, 0.35)}`, borderRadius: 18,
  padding: '13px 16px', fontSize: 16, color: C.INK, outline: 'none',
})
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 999,
  fontSize: 15.5, fontWeight: 700, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.HONEY_D : '#FFFFFF', color: on ? '#FFFFFF' : C.HONEY_D, border: `2px solid ${on ? C.HONEY_D : alpha(C.HONEY_D, 0.35)}`,
}))
const suggest = (C) => ({ bg: '#FFFFFF', border: `2px solid ${alpha(C.HONEY, 0.3)}`, active: alpha(C.HONEY_L, 0.4), text: C.INK, table: C.HONEY_D, radius: 18 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function TeddyBearTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)

  return (
    <PaletteContext.Provider value={C}><div data-tb lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.CREAM, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.HONEY_L, 0.4),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <TeddyOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.HONEY_D, border: '3px solid #FFFFFF', boxShadow: '0 8px 18px rgba(142,100,64,.4)' }}>
        {({ playing }) => <EqBars playing={playing} color="#FFFFFF" idle={alpha('#FFFFFF', 0.5)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.CREAM, 0.93), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `2px dashed ${alpha(C.HONEY, 0.35)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontWeight: 600, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 700, fontSize: 17, color: C.HONEY_D }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — girlyanda və ayıcıq */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: `linear-gradient(180deg, #E4F0F8, ${C.CREAM} 70%)`, padding: '0 20px 58px', textAlign: 'center' }}>
            <Bunting count={8} style={{ marginLeft: -20, marginRight: -20 }} />
            <div style={{ marginTop: 18, fontFamily: head, fontWeight: 700, fontSize: 17, color: C.SKY_D }}>{L('hero', 'kicker', inv.eventLabel)}</div>
            <h1 style={{ margin: '8px 0 0', fontFamily: head, fontWeight: 700, fontSize: nameSize(heroName), lineHeight: 1.1, color: C.INK, overflowWrap: 'anywhere', animation: 'tb-rise 1s ease-out .2s both' }}>{heroName}</h1>
            <div style={{ width: 'min(52vw, 210px)', margin: '20px auto 0', animation: 'tb-bob 3.4s ease-in-out infinite' }}><Teddy width="100%" /></div>
            <Patch color="#FFFFFF" style={{ display: 'inline-block', marginTop: 18, padding: '16px 24px', outline: `2px dashed ${alpha(C.HONEY, 0.5)}`, background: '#FFFFFF' }}>
              <div style={{ fontFamily: head, fontWeight: 700, fontSize: 'clamp(18px, 5vw, 22px)', color: C.INK }}>{inv.fullDate}</div>
              <div style={{ marginTop: 4, fontWeight: 600, fontSize: 15, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            </Patch>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 8, fontSize: 15, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <p style={{ margin: '18px auto 0', maxWidth: 320, fontSize: 16, fontWeight: 600, lineHeight: 1.6, color: C.MUTED }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — yamaqlar */}
          {S.countdown && (
            <Panel section="countdown" head={head} oat title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 2.6vw, 12px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <Patch key={l} color={PATCHES(C)[i]} style={{ padding: '18px 4px 14px', textAlign: 'center', transform: `rotate(${[-2, 1.5, -1, 2][i]}deg)` }}>
                    <div style={{ fontFamily: head, fontWeight: 700, fontSize: 'clamp(22px, 6.6vw, 30px)', lineHeight: 1, color: C.INK, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></div>
                    <div style={{ marginTop: 6, fontWeight: 700, fontSize: 12.5, color: C.INK, opacity: 0.75 }}>{l}</div>
                  </Patch>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <Patch color={C.SAGE} style={{ maxWidth: 430, margin: '0 auto', padding: 14 }}>
                <div style={{ borderRadius: 14, overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.HONEY_D} height="clamp(250px, 70vw, 320px)"
                    map={{ opacity: 0.9, filter: 'saturate(.7) brightness(1.05)', tintOpacity: 0.12, tint: C.HONEY, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: OAT_BG(C) }}><MapPin /></div>}
                  />
                </div>
              </Patch>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 700, fontSize: 22, lineHeight: 1.25, color: C.INK }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontWeight: 600, fontSize: 15, color: C.MUTED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} />
            </Panel>
          )}

          {/* PROQRAM — düymələr və sap */}
          {S.program && (
            <Panel section="program" head={head} oat title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ position: 'relative', maxWidth: 380, margin: '0 auto' }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: 27, top: 24, bottom: 24, borderLeft: `2px dashed ${alpha(C.HONEY_D, 0.45)}` }} />
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '56px minmax(0, 1fr)', gap: 10, alignItems: 'center', padding: '8px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}><Button size={38} color={PATCHES(C)[i % 4]} /></div>
                    <div style={{ padding: '12px 16px', borderRadius: 18, background: '#FFFFFF', boxShadow: '0 8px 16px -12px rgba(91,67,50,.4)' }}>
                      <div style={{ fontFamily: head, fontWeight: 700, fontSize: 15, color: C.HONEY_D, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                      <div style={{ marginTop: 2, fontWeight: 600, fontSize: 16.5, lineHeight: 1.35, color: C.INK }}>{ev.label}</div>
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

          {/* MASA — ayıcığın lövhəsi */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} oat title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="tb-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={C.MUTED} accent={C.HONEY_D}
                nameStyle={{ fontFamily: head, fontWeight: 700, fontSize: 19, color: C.INK }}
                card={(num) => (
                  <div style={{ position: 'relative', width: 220, margin: '0 auto', animation: 'tb-rise .6s ease-out both' }}>
                    <Teddy width={180} holding="none" style={{ margin: '0 auto' }} />
                    <Patch color="#FFFFFF" style={{ position: 'relative', width: 150, margin: '-74px auto 0', padding: '14px 10px 12px', outline: `2px dashed ${alpha(C.HONEY, 0.55)}` }}>
                      <div style={{ fontWeight: 800, fontSize: 12.5, letterSpacing: '.1em', textTransform: 'uppercase', color: C.SKY_D }}>{T.table}</div>
                      <div style={{ fontFamily: head, fontWeight: 700, fontSize: tableSize(num, 48), lineHeight: 1.05, color: C.INK }}>{num}</div>
                    </Patch>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR — tikişli çərçivələr */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 32 }} />}
              <PhotoQr inv={inv} tr={tr} fg={C.INK} bg="#FFFFFF" frame={{ borderRadius: 20, outline: `2px dashed ${alpha(C.HONEY, 0.6)}`, outlineOffset: 4 }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} oat title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.HONEY_D, 0.45), hair: alpha(C.HONEY_D, 0.2), accent: C.HONEY_D,
                font: body, display: head, btnFont: head,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Heart size={34} /></div>,
                marker: (a) => (a ? <Heart size={16} /> : <span style={{ display: 'block', width: 14, height: 14, borderRadius: '50%', border: `2px solid ${alpha(C.HONEY_D, 0.4)}` }} />),
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* XOŞ SÖZLƏR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field(C)} btn={btn(C)} errorColor={C.BLUSH_D} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <Patch key={msg.name + i} color={PATCHES(C)[i % 4]} style={{ padding: '20px 20px 16px' }}>
                      <figure style={{ margin: 0 }}>
                        <Heart size={18} color="#FFFFFF" style={{ position: 'absolute', right: 18, top: 16 }} />
                        <blockquote style={{ margin: 0, paddingRight: 18, fontSize: 16.5, fontWeight: 600, lineHeight: 1.55, color: C.INK }}>{msg.text}</blockquote>
                        <figcaption style={{ marginTop: 8, fontFamily: head, fontWeight: 700, fontSize: 14.5, color: C.HONEY_D }}>{msg.name}{msg.date ? <span style={{ fontFamily: body, fontWeight: 400, color: C.INK, opacity: 0.6 }}> · {gbook.formatDate(msg.date)}</span> : null}</figcaption>
                      </figure>
                    </Patch>
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
      <span style={{ position: 'absolute', left: -26, top: -62, width: 52, animation: 'tb-bob 3s ease-in-out infinite' }}><Teddy width={52} holding="none" /></span>
    </span>
  )
}
