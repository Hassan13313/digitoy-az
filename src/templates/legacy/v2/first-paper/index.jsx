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
import { galleryDesc, tableSize, yearsSentence } from '../../../_shared/kids'
import { C as PAL, WASHI, PAPER_BG, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { FoldedSheet, PaperHeart, TentCard, Tape } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../../../_shared/palette'
import FilmReel from '../../../_shared/FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   FIRST PAPER — «Kağız toy» (İldönümü konsepti, 2026-10)

   Konsept: birinci ildönümü ənənəvi olaraq «kağız toy»dur. Açılışda mavi
   dalğa naxışlı origami vərəq qatlanmış zərf kimi durur; toxunanda dörd
   künc bir-bir açılır, ağ üzündə «1 il birlikdə» yazılıb. Daxildə:
     sayğac   → qat izli kağız kvadratlar
     proqram  → origami ürəklər
     masa     → çadır qatlı masa kartı
     şəkillər → kağız lentlə yapışdırılmış fotolar
   Şriftlər: Piazzolla (başlıq, italik) · Didact Gothic (mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('first-paper')
const ID = 'first-paper'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['BLUE'], secondary: ['BLUE_D'], accent: ['SKY'], background: ['PAPER'], text: ['INK'] }

const KEYFRAMES = (C) => (`
@keyframes fp-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes fp-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes fp-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes fp-float { 0%,100% { transform: translateY(0) rotate(var(--r, 0deg)) } 50% { transform: translateY(-8px) rotate(var(--r, 0deg)) } }
@keyframes fp-breathe { 0%,100% { transform: scale(1) } 50% { transform: scale(1.03) } }
[data-fp] span[aria-hidden="true"], [data-fp] svg[aria-hidden="true"], [data-fp] div[aria-hidden="true"] { pointer-events: none; }
[data-fp] ::placeholder { color: rgba(115,122,138,.7); }
[data-fp] [data-dark] ::placeholder { color: rgba(169,192,238,.55); }
[data-fp] input:focus-visible, [data-fp] textarea:focus-visible { border-color: ${C.BLUE} !important; outline: none; }
[data-fp] button:focus-visible, [data-fp] a:focus-visible, [data-fp] [role="button"]:focus-visible { outline: 2px solid ${C.BLUE}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-fp] *, [data-fp] { animation: none !important; transition: none !important; } }
`)

const INK_BG = (C) => (`radial-gradient(70% 50% at 50% 0%, rgba(53,97,201,.35), transparent 70%), ${C.INK}`)

function SheetInside({ inv, lang, head, big = 'clamp(64px, 20vw, 92px)' }) {
  const C = usePalette(PAL)
  if (!inv.age) return <PaperHeart size={64} />
  return (
    <>
      <span style={{ fontFamily: head, fontWeight: 600, fontSize: big, lineHeight: 0.9, color: C.BLUE }}>{inv.age}</span>
      <span style={{ marginTop: 4, fontFamily: head, fontStyle: 'italic', fontSize: 16, color: C.INK }}>{yearsSentence(inv.age, lang, inv.strings).replace(String(inv.age), '').trim()}</span>
    </>
  )
}

/* ═══ 01 — AÇILIŞ: origami vərəq açılır ═══ */
function PaperOpening({ inv, theme, lang }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-fp
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: PAPER_BG(C), color: C.INK, fontFamily: theme.fonts.body }}>
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        {ot.show('kicker') && <div style={{ marginBottom: 18, fontFamily: head, fontStyle: 'italic', fontSize: 17, color: C.BLUE, animation: 'fp-rise .8s ease-out .2s both' }}>{ot.text('kicker')}</div>}
        <div style={{ position: 'relative', filter: 'drop-shadow(0 18px 18px rgba(35,43,74,.22))', animation: go ? 'none' : 'fp-breathe 3.4s ease-in-out infinite' }}>
          <FoldedSheet width="min(72vw, 300px)" open={go}>
            <SheetInside inv={inv} lang={lang} head={head} />
          </FoldedSheet>
          {/* qatları tutan möhür-stiker */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${go ? 0.6 : 1})`, opacity: go ? 0 : 1, transition: 'opacity .25s ease, transform .25s ease', pointerEvents: 'none' }}>
            <EmblemSlot mono={ot.mono} size={60} border={`2px solid ${C.WHITE}`} background={C.WHITE} color={C.BLUE_D} font={head} style={{ animation: 'none', margin: 0, boxShadow: '0 4px 10px rgba(0,0,0,.25)' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: C.WHITE, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,.25)' }}>
                <PaperHeart size={30} />
              </div>
            </EmblemSlot>
          </div>
        </div>
        <div style={{ marginTop: 26, animation: 'fp-rise 1s ease-out .3s both' }}>
          {titleOv !== '' && (
            <div style={{ fontFamily: head, fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(32px, 9.6vw, 46px)', lineHeight: 1.08, overflowWrap: 'anywhere', color: C.INK }}>
              {first}{second && <><span style={{ display: 'inline-block', margin: '0 .2em', color: C.BLUE }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 8, fontSize: 15, color: C.MUTED }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: 22 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: C.BLUE, color: '#FFFFFF', fontFamily: head, fontWeight: 600, fontSize: 16, boxShadow: '0 12px 22px -12px rgba(53,97,201,.7)', animation: 'fp-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 14, color: C.MUTED, animation: 'fp-fade .8s ease-out 1.1s both, fp-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dark = false, white = false }) {
  const C = usePalette(PAL)
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? INK_BG(C) : white ? C.WHITE : PAPER_BG(C), color: dark ? '#FFFFFF' : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
              <PaperHeart size={20} tone={dark ? 'sky' : 'blue'} style={{ transform: 'rotate(-10deg)' }} />
            </div>
            {kicker && <div style={{ marginBottom: 6, fontFamily: head, fontStyle: 'italic', fontSize: 16, color: dark ? C.SKY : C.BLUE }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 600, fontSize: scaleFont('clamp(30px, 8.6vw, 40px)', C.hs), lineHeight: 1.12, textWrap: 'balance', color: dark ? '#FFFFFF' : C.INK }}>{title}</h2>}
            {sub && <p style={{ margin: '10px auto 0', maxWidth: 340, fontSize: 16, color: dark ? alpha('#FFFFFF', 0.7) : C.MUTED, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: C.WHITE, border: `1px solid ${C.CREASE}`, borderRadius: 10,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
})
const darkField = (C) => ({ ...field(C), background: alpha('#FFFFFF', 0.08), border: `1px solid ${alpha(C.SKY, 0.35)}`, color: '#FFFFFF' })
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 15.5, fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.BLUE : C.WHITE, color: on ? '#FFFFFF' : C.INK, border: `1px solid ${on ? C.BLUE : C.CREASE}`,
}))
const darkBtn = (C) => ((on) => ({ ...btn(C)(on), background: on ? '#FFFFFF' : 'transparent', color: on ? C.INK : '#FFFFFF', border: `1px solid ${on ? '#FFFFFF' : alpha(C.SKY, 0.45)}` }))
const suggest = (C) => ({ bg: C.WHITE, border: `1px solid ${C.CREASE}`, active: alpha(C.SKY, 0.3), text: C.INK, table: C.BLUE, radius: 10 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function FirstPaperTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)

  return (
    <PaletteContext.Provider value={C}><div data-fp lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.PAPER, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.BLUE, 0.3),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <PaperOpening inv={inv} theme={theme} lang={lang} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: WASHI(C), boxShadow: '0 8px 20px rgba(35,43,74,.35)' }}>
        {({ playing }) => <EqBars playing={playing} color="#FFFFFF" idle={alpha('#FFFFFF', 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.PAPER, 0.92), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${C.CREASE}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 15, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontStyle: 'italic', fontWeight: 600, fontSize: 20, color: C.INK }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — açılmış vərəq */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: PAPER_BG(C), padding: '46px 22px 60px', textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{ transform: 'rotate(-4deg)', filter: 'drop-shadow(0 18px 20px rgba(35,43,74,.18))' }}>
                <FoldedSheet width="min(62vw, 250px)" open instant>
                  <SheetInside inv={inv} lang={lang} head={head} big="clamp(54px, 17vw, 78px)" />
                </FoldedSheet>
              </div>
              {[[-6, 12, 30, 'blue', -14], [84, 4, 22, 'sky', 12], [90, 70, 26, 'blue', 8], [-2, 78, 18, 'sky', -6]].map(([x, y, sz, tone, r], i) => (
                <span key={i} aria-hidden="true" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, '--r': `${r}deg`, animation: `fp-float ${4 + i * 0.6}s ease-in-out ${i * 0.4}s infinite` }}>
                  <PaperHeart size={sz} tone={tone} />
                </span>
              ))}
            </div>
            <div style={{ marginTop: 30, fontFamily: head, fontStyle: 'italic', fontSize: 18, color: C.BLUE }}>{L('hero', 'kicker', inv.eventLabel)}</div>
            <h1 style={{ margin: '6px 0 0', fontFamily: head, fontWeight: 600, fontSize: nameSize(heroName), lineHeight: 1.06, overflowWrap: 'anywhere', color: C.INK, animation: 'fp-rise 1s ease-out .2s both' }}>{heroName}</h1>
            <div style={{ width: 120, height: 1, margin: '18px auto 0', backgroundImage: `linear-gradient(90deg, ${C.CREASE} 50%, transparent 50%)`, backgroundSize: '8px 1px' }} />
            <div style={{ marginTop: 16, fontFamily: head, fontWeight: 500, fontSize: 'clamp(20px, 5.6vw, 24px)', color: C.INK }}>{inv.fullDate}</div>
            <div style={{ marginTop: 6, fontSize: 16, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 15, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <p style={{ margin: '18px auto 0', maxWidth: 330, fontFamily: head, fontStyle: 'italic', fontSize: 18, lineHeight: 1.55, color: C.INK }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — qat izli kvadratlar */}
          {S.countdown && (
            <Panel section="countdown" head={head} white title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{
                      position: 'relative', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: `linear-gradient(135deg, transparent calc(50% - .5px), ${C.CREASE} 50%, transparent calc(50% + .5px)), linear-gradient(45deg, ${C.PAPER} 50%, #F1EEE7 50%)`,
                      boxShadow: '0 8px 14px -10px rgba(35,43,74,.45)', transform: `rotate(${[-3, 2, -2, 3][i]}deg)`,
                    }}>
                      <span style={{ fontFamily: head, fontWeight: 600, fontSize: 'clamp(24px, 7vw, 32px)', lineHeight: 1, color: C.BLUE, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 12.5, letterSpacing: '.1em', textTransform: 'uppercase', color: C.MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} dark title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ position: 'relative', maxWidth: 430, margin: '0 auto', padding: 8, background: '#FFFFFF', boxShadow: '0 24px 36px -22px rgba(0,0,0,.7)', transform: 'rotate(-1.2deg)' }}>
                <Tape rot={-3} />
                <div style={{ overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.BLUE} height="clamp(240px, 66vw, 300px)"
                    map={{ opacity: 0.9, filter: 'grayscale(.5)', tintOpacity: 0.12, tint: C.SKY, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(240px, 66vw, 300px)', position: 'relative', background: PAPER_BG(C) }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 26, fontFamily: head, fontWeight: 600, fontSize: 25, lineHeight: 1.2, color: '#FFFFFF' }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 6, fontFamily: head, fontStyle: 'italic', fontSize: 16, color: C.SKY }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={darkBtn(C)} />
            </Panel>
          )}

          {/* PROQRAM — origami ürəklər */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ position: 'relative', maxWidth: 380, margin: '0 auto', padding: '6px 18px', background: C.WHITE, boxShadow: '0 16px 26px -20px rgba(35,43,74,.5)' }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '34px 64px minmax(0, 1fr)', gap: 8, alignItems: 'center', padding: '14px 0', borderTop: i ? `1px dashed ${C.CREASE}` : 'none' }}>
                    <PaperHeart size={26} tone={i % 2 ? 'sky' : 'blue'} style={{ transform: `rotate(${i % 2 ? 8 : -8}deg)` }} />
                    <div style={{ fontFamily: head, fontWeight: 600, fontSize: 18, color: C.BLUE, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    <div style={{ fontSize: 16.5, lineHeight: 1.35, color: C.INK }}>{ev.label}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} white title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" />
            </Panel>
          )}

          {/* MASA — çadır kartı */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="fp-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={C.MUTED} accent={C.BLUE}
                nameStyle={{ fontFamily: head, fontStyle: 'italic', fontWeight: 600, fontSize: 26, color: C.INK }}
                card={(num) => (
                  <div style={{ paddingTop: 18 }}>
                    <TentCard width={210}>
                      <div style={{ fontSize: 12.5, letterSpacing: '.24em', textTransform: 'uppercase', color: C.MUTED }}>{T.table}{' '}</div>
                      <div style={{ marginTop: 4, fontFamily: head, fontWeight: 600, fontSize: tableSize(num, 60), lineHeight: 1, color: C.BLUE }}>{num}</div>
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}><PaperHeart size={20} tone="sky" /></div>
                    </TentCard>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} white title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 34 }} />}
              <PhotoQr inv={inv} tr={tr} fg={C.INK} bg={C.WHITE} frame={{ borderRadius: 10, border: `1px solid ${C.CREASE}`, boxShadow: '0 10px 18px -12px rgba(35,43,74,.4)' }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: C.CREASE, hair: alpha(C.CREASE, 0.6), accent: C.BLUE,
                font: body, display: head, displayItalic: true, btnFont: head,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><PaperHeart size={40} /></div>,
                marker: (a) => (a ? <PaperHeart size={16} /> : <span style={{ display: 'block', width: 14, height: 14, transform: 'rotate(45deg)', border: `1.5px solid ${C.CREASE}` }} />),
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField(C)} btn={darkBtn(C)} errorColor={C.SKY} />
              <div style={{ display: 'grid', gap: 16 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ position: 'relative', margin: 0, padding: '20px 22px 16px', background: C.WHITE, color: C.INK, clipPath: 'polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 0 100%)', transform: `rotate(${i % 2 ? 0.7 : -0.7}deg)` }}>
                      <span aria-hidden="true" style={{ position: 'absolute', right: 0, top: 0, width: 26, height: 26, background: `linear-gradient(225deg, transparent 50%, ${C.SHADE} 50%)` }} />
                      <blockquote style={{ margin: 0, fontFamily: head, fontStyle: 'italic', fontSize: 18, lineHeight: 1.5 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: C.BLUE }}>
                        <PaperHeart size={14} /><span>{msg.name}{msg.date ? <span style={{ color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}</span>
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
      <span style={{ position: 'absolute', left: -20, top: -36, filter: 'drop-shadow(0 6px 6px rgba(0,0,0,.3))' }}><PaperHeart size={40} /></span>
    </span>
  )
}
