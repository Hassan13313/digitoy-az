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
import { C, GOLD_GRAD, LEATHER_BG, LEATHER_FLAT, PAGE_BG, goldText, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Album, GoldFrame, PhotoCorners, Flourish } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   GOLDEN JUBILEE — «Qızıl albom» (İldönümü konsepti, 2026-10)

   Konsept: qızıl toy (50 il) — tünd qırmızı dəri ailə albomu, üz qabığında
   qızıl basma «50». Toxunanda albomun qabığı açılır və ilk səhifədə cütlüyün
   adları, birlikdə keçən illər (məs. 1977 — 2027) görünür. Daxildə:
     səhifələr → krem albom vərəqi, foto küncləri
     sayğac    → foto künclərində rəqəmlər
     masa      → dəri lövhədə qızıl basma nömrə
   Şriftlər: Vollkorn SC (basma başlıq) · Brygada 1918 (mətn, italik).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('golden-jubilee')
const ID = 'golden-jubilee'

const KEYFRAMES = `
@keyframes gj-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes gj-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes gj-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes gj-shine { 0% { background-position: 160% 0 } 100% { background-position: -60% 0 } }
[data-gj] span[aria-hidden="true"], [data-gj] svg[aria-hidden="true"], [data-gj] div[aria-hidden="true"] { pointer-events: none; }
[data-gj] ::placeholder { color: rgba(134,115,90,.7); }
[data-gj] [data-dark] ::placeholder { color: rgba(243,222,156,.45); }
[data-gj] input:focus-visible, [data-gj] textarea:focus-visible { border-color: ${C.GOLD_D} !important; outline: none; }
[data-gj] button:focus-visible, [data-gj] a:focus-visible, [data-gj] [role="button"]:focus-visible { outline: 2px solid ${C.GOLD}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-gj] *, [data-gj] { animation: none !important; transition: none !important; } }
`

function initials(text) {
  return String(text || '').split('&').map((p) => p.trim()).filter(Boolean).slice(0, 2)
    .map((p) => Array.from(p)[0].toLocaleUpperCase('az')).join(' & ')
}

function yearSpan(inv) {
  const y = Number(inv.dp?.year)
  if (!inv.age || !Number.isFinite(y) || y < 1000) return ''
  return `${y - inv.age} — ${y}`
}

/* ═══ 01 — AÇILIŞ: albom açılır ═══ */
function AlbumOpening({ inv, theme, lang }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  const span = yearSpan(inv)
  return (
    <motion.div {...gate.gateProps} data-gj
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: 'radial-gradient(70% 50% at 50% 42%, #3A2419, #1A100B 75%)', color: C.CREAM, fontFamily: theme.fonts.body }}>
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ transform: go ? 'translateX(14%)' : 'none', transition: 'transform 1.3s cubic-bezier(.55,0,.2,1)' }}>
          <Album width="min(72vw, 300px)" open={go}
            cover={(
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 12%' }}>
                <GoldFrame inset="9%" radius={4} />
                {ot.show('kicker') && <div style={{ fontFamily: head, fontSize: 13, letterSpacing: '.24em', ...goldText }}>{ot.text('kicker')}</div>}
                {inv.age ? (
                  <div style={{ marginTop: 6, fontFamily: head, fontWeight: 700, fontSize: 'clamp(76px, 24vw, 110px)', lineHeight: 0.95, ...goldText, backgroundSize: '220% 100%', animation: 'gj-shine 3.2s ease-in-out 1s infinite' }}>{inv.age}</div>
                ) : (
                  <EmblemSlot mono={ot.mono} size={84} border={`1.5px solid ${C.GOLD}`} background="transparent" color={C.GOLD_L} font={head} style={{ animation: 'none', margin: '12px auto' }}>
                    <Flourish width={110} color={C.GOLD} />
                  </EmblemSlot>
                )}
                {inv.age && <div style={{ marginTop: 4, fontStyle: 'italic', fontSize: 15, color: C.GOLD_L, opacity: 0.85 }}>{yearsSentence(inv.age, lang).replace(String(inv.age), '').trim()}</div>}
                <Flourish width={120} color={C.GOLD} style={{ marginTop: 14 }} />
              </div>
            )}
            page={(
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 12%', color: C.INK }}>
                <div style={{ position: 'relative', width: '78%', aspectRatio: '1', background: '#FFFDF7', boxShadow: '0 6px 14px -8px rgba(60,40,20,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PhotoCorners size={16} />
                  <span style={{ fontStyle: 'italic', fontSize: 'clamp(30px, 9vw, 42px)', color: C.GOLD_D }}>{initials([first, second].filter(Boolean).join(' & ')) || '♥'}</span>
                </div>
                {span && <div style={{ marginTop: 14, fontFamily: head, fontSize: 15, letterSpacing: '.14em', color: C.MUTED }}>{span}</div>}
              </div>
            )} />
        </div>
        <div style={{ marginTop: 26, animation: 'gj-rise 1s ease-out .3s both' }}>
          {titleOv !== '' && (
            <div style={{ fontFamily: head, fontWeight: 600, fontSize: 'clamp(28px, 8.4vw, 40px)', lineHeight: 1.08, overflowWrap: 'anywhere', ...goldText }}>
              {first}{second && <><span style={{ display: 'inline-block', margin: '0 .22em', fontStyle: 'italic' }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 8, fontSize: 14.5, fontStyle: 'italic', color: alpha(C.CREAM, 0.7) }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: 20 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 4, background: GOLD_GRAD, color: C.LEATHER_D, fontFamily: head, fontWeight: 600, fontSize: 15, letterSpacing: '.12em', boxShadow: '0 12px 24px -12px rgba(212,175,90,.6), inset 0 0 0 1px rgba(255,241,194,.6)', animation: 'gj-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 13.5, fontStyle: 'italic', color: alpha(C.CREAM, 0.5), animation: 'gj-fade .8s ease-out 1.1s both, gj-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə: albom vərəqi və ya dəri */
function Panel({ id, section, title, kicker, sub, children, head, dark = false }) {
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? LEATHER_FLAT : PAGE_BG, color: dark ? C.CREAM : C.INK }}>
      {dark && <span aria-hidden="true" style={{ position: 'absolute', inset: 10, border: '1.5px dashed rgba(243,222,156,.25)', borderRadius: 4 }} />}
      {!dark && <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 18, background: 'linear-gradient(90deg, rgba(60,40,20,.12), transparent)' }} />}
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            {kicker && <div style={{ marginBottom: 8, fontFamily: head, fontSize: 13, letterSpacing: '.24em', color: dark ? C.GOLD : C.GOLD_D }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 600, fontSize: 'clamp(27px, 7.8vw, 36px)', lineHeight: 1.12, textWrap: 'balance', ...(dark ? goldText : { color: C.LEATHER }) }}>{title}</h2>}
            <Flourish width={170} color={dark ? C.GOLD : C.GOLD_D} style={{ marginTop: 14 }} />
            {sub && <p style={{ margin: '12px auto 0', maxWidth: 340, fontSize: 16, fontStyle: 'italic', color: dark ? alpha(C.CREAM, 0.7) : C.MUTED, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: '#FFFDF7', border: `1px solid ${alpha(C.GOLD_D, 0.45)}`, borderRadius: 4,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
}
const darkField = { ...field, background: alpha('#000000', 0.22), border: `1px solid ${alpha(C.GOLD, 0.4)}`, color: C.CREAM }
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 4,
  fontSize: 15, fontWeight: 600, letterSpacing: '.06em', textDecoration: 'none', cursor: 'pointer',
  background: on ? C.LEATHER : 'transparent', color: on ? C.GOLD_L : C.LEATHER, border: `1px solid ${on ? C.LEATHER : alpha(C.LEATHER, 0.4)}`,
})
const darkBtn = (on) => ({ ...btn(on), background: on ? GOLD_GRAD : 'transparent', color: on ? C.LEATHER_D : C.GOLD_L, border: `1px solid ${on ? C.GOLD : alpha(C.GOLD, 0.5)}` })
const suggest = { bg: '#FFFDF7', border: `1px solid ${alpha(C.GOLD_D, 0.4)}`, active: alpha(C.GOLD, 0.22), text: C.INK, table: C.LEATHER, radius: 4 }

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function GoldenJubileeTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const span = yearSpan(inv)

  return (
    <div data-gj lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.PAGE, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.GOLD, 0.4),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <AlbumOpening inv={inv} theme={theme} lang={lang} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: LEATHER_BG, border: `1.5px solid ${C.GOLD}`, boxShadow: '0 8px 20px rgba(51,16,14,.45)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.GOLD_L} idle={alpha(C.GOLD_L, 0.35)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.LEATHER_D, 0.94), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.GOLD, 0.35)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.CREAM, 0.7), fontSize: 15, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 600, fontSize: 19, letterSpacing: '.06em', ...goldText }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — dəri üz qabığı */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: LEATHER_BG, padding: '84px 22px 64px', textAlign: 'center', color: C.CREAM }}>
            <GoldFrame inset={14} radius={4} opacity={0.75} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: head, fontSize: 13.5, letterSpacing: '.26em', ...goldText }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              {inv.age ? (
                <>
                  <div style={{ marginTop: 6, fontFamily: head, fontWeight: 700, fontSize: 'clamp(96px, 30vw, 150px)', lineHeight: 0.92, ...goldText, backgroundSize: '220% 100%', animation: 'gj-shine 4s ease-in-out .8s infinite' }}>{inv.age}</div>
                  <div style={{ marginTop: 2, fontStyle: 'italic', fontSize: 19, color: C.GOLD_L, opacity: 0.85 }}>{yearsSentence(inv.age, lang).replace(String(inv.age), '').trim()}</div>
                </>
              ) : <Flourish width={160} color={C.GOLD} style={{ marginTop: 18 }} />}
              <h1 style={{ margin: '22px 0 0', fontFamily: head, fontWeight: 600, fontSize: nameSize(heroName), lineHeight: 1.08, overflowWrap: 'anywhere', ...goldText, animation: 'gj-rise 1s ease-out .2s both' }}>{heroName}</h1>
              {span && <div style={{ marginTop: 8, fontFamily: head, fontSize: 16, letterSpacing: '.2em', color: alpha(C.CREAM, 0.7) }}>{span}</div>}
              <Flourish width={200} color={C.GOLD} style={{ marginTop: 18 }} />
              <div style={{ marginTop: 16, fontFamily: head, fontWeight: 600, fontSize: 'clamp(19px, 5.4vw, 23px)', color: C.CREAM }}>{inv.fullDate}</div>
              <div style={{ marginTop: 6, fontSize: 16, fontStyle: 'italic', color: alpha(C.CREAM, 0.72) }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 15, color: alpha(C.CREAM, 0.72) }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              <p style={{ margin: '18px auto 0', maxWidth: 330, fontSize: 17, fontStyle: 'italic', lineHeight: 1.6, color: alpha(C.CREAM, 0.85) }}>{tr.inv_join}</p>
            </div>
          </section>

          {/* SAYĞAC — foto künclərində */}
          {S.countdown && (
            <Panel section="countdown" head={head} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(10px, 3.4vw, 16px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ position: 'relative', aspectRatio: '4 / 5', background: '#FFFDF7', boxShadow: '0 8px 16px -10px rgba(60,40,20,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${[-2, 1.5, -1, 2][i]}deg)` }}>
                      <PhotoCorners size={15} />
                      <span style={{ fontFamily: head, fontWeight: 600, fontSize: 'clamp(24px, 7vw, 32px)', lineHeight: 1, color: C.LEATHER, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                    </div>
                    <div style={{ marginTop: 10, fontFamily: head, fontSize: 12.5, letterSpacing: '.12em', color: C.MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} dark title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ position: 'relative', maxWidth: 430, margin: '0 auto', padding: 10, background: '#FFFDF7', boxShadow: '0 24px 36px -22px rgba(0,0,0,.8)', transform: 'rotate(-1deg)' }}>
                <PhotoCorners size={22} color="#1F0A09" />
                <div style={{ overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.LEATHER} height="clamp(240px, 66vw, 300px)"
                    map={{ opacity: 0.88, filter: 'sepia(.45) saturate(.8)', tintOpacity: 0.1, tint: C.GOLD, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(240px, 66vw, 300px)', position: 'relative', background: PAGE_BG }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 26, fontFamily: head, fontWeight: 600, fontSize: 25, lineHeight: 1.2, ...goldText }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 6, fontSize: 15, fontStyle: 'italic', color: alpha(C.CREAM, 0.7) }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={darkBtn} />
            </Panel>
          )}

          {/* PROQRAM */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ position: 'relative', maxWidth: 380, margin: '0 auto' }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: 74, top: 10, bottom: 10, width: 1.5, background: `linear-gradient(${C.GOLD_D}, ${alpha(C.GOLD_D, 0.2)})` }} />
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '60px 30px minmax(0, 1fr)', alignItems: 'center', padding: '11px 0' }}>
                    <div style={{ textAlign: 'right', fontFamily: head, fontWeight: 600, fontSize: 17, color: C.LEATHER, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    <span aria-hidden="true" style={{ justifySelf: 'center', width: 11, height: 11, transform: 'rotate(45deg)', background: GOLD_GRAD, boxShadow: `0 0 0 3px ${C.PAGE}` }} />
                    <div style={{ fontSize: 17, lineHeight: 1.35, color: C.INK }}>{ev.label}</div>
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

          {/* MASA — dəri lövhə */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} dark title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="gj-seat-list" field={darkField} suggest={suggest} font={body} muted={alpha(C.CREAM, 0.7)} accent={C.GOLD_L}
                nameStyle={{ fontFamily: head, fontWeight: 600, fontSize: 24 }}
                card={(num) => (
                  <div style={{ position: 'relative', width: 210, margin: '22px auto 0', padding: '26px 16px 24px', textAlign: 'center', borderRadius: 6, background: LEATHER_BG, boxShadow: '0 20px 30px -18px rgba(0,0,0,.85), inset 0 0 0 1px rgba(0,0,0,.35)' }}>
                    <GoldFrame inset={8} radius={4} />
                    <div style={{ position: 'relative', fontFamily: head, fontSize: 14, letterSpacing: '.3em', color: C.GOLD }}>{T.table}{' '}</div>
                    <div style={{ position: 'relative', marginTop: 4, fontFamily: head, fontWeight: 700, fontSize: tableSize(num, 64), lineHeight: 1, ...goldText }}>{num}</div>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 22, marginBottom: 34, padding: '0 6px' }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ position: 'relative', aspectRatio: '4 / 5', padding: 8, background: '#FFFDF7', boxShadow: '0 10px 18px -10px rgba(60,40,20,.5)', transform: `rotate(${i % 2 ? 1.6 : -1.6}deg)` }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'sepia(.25)' }} />
                      <PhotoCorners size={18} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.LEATHER_D} bg="#FFFDF7" frame={{ borderRadius: 4, border: `1px solid ${alpha(C.GOLD_D, 0.5)}`, boxShadow: '0 10px 18px -12px rgba(60,40,20,.5)' }}
                btn={btn} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.GOLD_D, 0.55), hair: alpha(C.GOLD_D, 0.28), accent: C.LEATHER,
                font: body, display: head, displayItalic: false, btnFont: body,
                doneMark: <Flourish width={140} color={C.GOLD_D} style={{ marginBottom: 12 }} />,
                marker: (a) => <span style={{ display: 'block', width: 13, height: 13, transform: 'rotate(45deg)', border: `1.5px solid ${a ? C.LEATHER : alpha(C.GOLD_D, 0.7)}`, background: a ? C.LEATHER : 'transparent' }} />,
                suggest: { ...suggest, font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField} btn={darkBtn} errorColor={C.GOLD_L} />
              <div style={{ display: 'grid', gap: 16 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ position: 'relative', margin: 0, padding: '20px 20px 16px', background: '#FFFDF7', color: C.INK, boxShadow: '0 12px 20px -14px rgba(0,0,0,.8)', transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)` }}>
                      <PhotoCorners size={16} color="#1F0A09" />
                      <blockquote style={{ margin: 0, fontSize: 17, fontStyle: 'italic', lineHeight: 1.55 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 10, fontFamily: head, fontSize: 14, letterSpacing: '.1em', color: C.LEATHER }}>
                        — {msg.name}{msg.date ? <span style={{ fontFamily: body, letterSpacing: 0, fontSize: 13, color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}
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
      <span style={{ position: 'absolute', left: -15, top: -15, width: 30, height: 30, transform: 'rotate(45deg)', background: GOLD_GRAD, boxShadow: '0 6px 12px rgba(0,0,0,.4), inset 0 0 0 2px rgba(255,241,194,.6)' }} />
    </span>
  )
}
