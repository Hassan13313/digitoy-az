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
import { C, BAND, SHEEN, nameSize } from './palette'
import { Buta, ButaTrio, KelagayiSquare, Diamond } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   KƏLAĞAYI — «İpək kəlağayı» (Xına gecəsi konsepti, 2026-10)

   Konsept: Azərbaycanın basma naxışlı ipək kəlağayısı — kvadrat yaylıq,
   haşiyəsində butalar, ortada səkkizguşəli ulduzlu medalyon. Açılışda
   kəlağayı üçbucaq kimi qatlanıb; toxunanda üst qanadı açılır və bütöv
   romb görünür. Daxildə:
     hero      → açıq kəlağayı, üzərindən ipək parıltısı keçir
     sayğac    → indigo fonda romb lövhələr
     məkan     → üç rəngli haşiyəli çərçivə
     masa      → böyük romb lövhə
     fotolar   → romb pəncərələr
   Şriftlər: Playfair Display SC (başlıq) · Merriweather (mətn) — Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('kelagayi')
const ID = 'kelagayi'

const LABELS = {
  countdown: { title: { az: 'Gecəyə qalan vaxt', en: 'Time until the night', ru: 'До вечера осталось' } },
  venue:     { title: { az: 'Ünvan', en: 'The address', ru: 'Адрес' } },
  program:   { title: { az: 'Gecənin naxışı', en: 'The evening’s pattern', ru: 'Узор вечера' } },
  dresscode: { title: { az: 'Libas', en: 'Attire', ru: 'Наряд' } },
  seating:   { title: { az: 'Masanızı tapın', en: 'Find your table', ru: 'Найдите свой стол' } },
  gallery:   { title: { az: 'İpək kimi anlar', en: 'Silken moments', ru: 'Шёлковые мгновения' } },
  rsvp:      { title: { az: 'Cavabınızı gözləyirik', en: 'We await your reply', ru: 'Ждём вашего ответа' } },
  guestbook: { title: { az: 'Kəlağayıya düyün — bir arzu', en: 'Tie a wish to the scarf', ru: 'Завяжите желание на платке' } },
}
const TXT = {
  az: { table: 'Masa' },
  en: { table: 'Table' },
  ru: { table: 'Стол' },
}

const KEYFRAMES = `
@keyframes kg-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes kg-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes kg-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes kg-sheen { 0% { transform: translateX(-70%) } 60%,100% { transform: translateX(70%) } }
@keyframes kg-drop { 0% { transform: translateY(-20px) rotate(-12deg); opacity: 0 } 100% { transform: none; opacity: 1 } }
[data-kg] span[aria-hidden="true"], [data-kg] svg[aria-hidden="true"], [data-kg] div[aria-hidden="true"] { pointer-events: none; }
[data-kg] ::placeholder { color: rgba(110,95,78,.6); }
[data-kg] input:focus-visible, [data-kg] textarea:focus-visible { border-color: ${C.CRIMSON} !important; outline: none; }
[data-kg] button:focus-visible, [data-kg] a:focus-visible, [data-kg] [role="button"]:focus-visible { outline: 2px solid ${C.INDIGO}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-kg] *, [data-kg] { animation: none !important; transition: none !important; } }
`

const SILK_BG = `radial-gradient(90% 60% at 50% 0%, #FFFAEE, transparent 70%), ${C.SILK}`
const SILK_ALT = `radial-gradient(90% 60% at 50% 0%, #F8ECD4, transparent 70%), #F1E2C4`
const INDIGO_BG = `radial-gradient(90% 60% at 50% 0%, #34417A, transparent 70%), ${C.INDIGO}`

/** Qatlanan kəlağayı: open=false → üçbucaq, true → bütöv romb */
function FoldingScarf({ open, width, uid }) {
  return (
    <div aria-hidden="true" style={{ position: 'relative', width, aspectRatio: '1', perspective: 1000, margin: '0 auto' }}>
      <div style={{ position: 'absolute', inset: 0, filter: 'drop-shadow(0 22px 26px rgba(110,18,34,.28))' }}>
        {/* alt yarı */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '50%', overflow: 'hidden', clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}>
          <div style={{ position: 'absolute', left: 0, top: '-100%', width: '100%', height: '200%' }}><KelagayiSquare uid={`${uid}-b`} /></div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(60,10,20,.25), transparent 40%)', opacity: open ? 0 : 1, transition: 'opacity .8s ease .5s' }} />
        </div>
        {/* üst qanad */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '50%', transformOrigin: '50% 100%', transformStyle: 'preserve-3d', transform: open ? 'rotateX(0deg)' : 'rotateX(179.9deg)', transition: 'transform 1.25s cubic-bezier(.55,0,.25,1) .05s' }}>
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', clipPath: 'polygon(50% 0, 100% 100%, 0 100%)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '200%' }}><KelagayiSquare uid={`${uid}-t`} /></div>
          </div>
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateX(180deg)', clipPath: 'polygon(0 0, 100% 0, 50% 100%)', overflow: 'hidden', background: '#EFE2C8' }}>
            <div style={{ position: 'absolute', left: 0, top: '-100%', width: '100%', height: '200%' }}><KelagayiSquare uid={`${uid}-r`} dim /></div>
            <div style={{ position: 'absolute', inset: 0, background: SHEEN }} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══ 01 — AÇILIŞ: kəlağayı açılır ═══ */
function ScarfOpening({ inv, theme }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-kg
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: `radial-gradient(70% 50% at 50% 52%, #FFF9EA, #EEDCB6 85%)`, color: C.INK, fontFamily: theme.fonts.body }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 6, background: BAND }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 6, background: BAND }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ animation: 'kg-rise 1s ease-out .2s both' }}>
          <EmblemSlot mono={ot.mono} size={50} border={`1.5px solid ${C.CRIMSON}`} background={C.SILK} color={C.CRIMSON} font={head} style={{ animation: 'none', margin: '0 auto 10px' }}>
            <Buta size={16} style={{ margin: '0 auto' }} />
          </EmblemSlot>
          {ot.show('kicker') && <div style={{ fontFamily: head, fontSize: 15, letterSpacing: '.22em', color: C.CRIMSON }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 6, fontFamily: head, fontSize: 'clamp(40px, 12vw, 56px)', lineHeight: 1.05, color: C.INK, overflowWrap: 'anywhere' }}>
              {first}{second && <><span style={{ display: 'block', fontSize: '.5em', color: C.CRIMSON }}>&amp;</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 8, fontSize: 14.5, color: C.MUTED }}>{ot.text('meta')}</div>}
        </div>
        <div style={{ width: 'min(70vw, 290px)', marginTop: 14, transform: go ? 'translateY(-6%)' : 'translateY(-26%)', transition: 'transform 1.2s cubic-bezier(.55,0,.25,1)' }}>
          <FoldingScarf open={go} width="100%" uid="kg-op" />
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: -20 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 28px', display: 'inline-flex', alignItems: 'center', borderRadius: 2, background: C.CRIMSON, color: C.SILK, fontFamily: head, fontSize: 17, letterSpacing: '.06em', boxShadow: `0 0 0 3px ${C.SILK}, 0 0 0 4px ${C.SAFFRON_D}, 0 14px 24px -10px rgba(110,18,34,.5)`, animation: 'kg-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 13.5, color: C.MUTED, animation: 'kg-fade .8s ease-out 1.1s both, kg-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, bg = SILK_BG, dark = false }) {
  const mute = dark ? alpha(C.SILK, 0.75) : C.MUTED
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: bg, color: dark ? C.SILK : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <ButaTrio />
            {title && <h2 style={{ margin: '14px 0 0', fontFamily: head, fontWeight: 400, fontSize: 'clamp(27px, 7.8vw, 36px)', lineHeight: 1.15, color: dark ? C.SILK : C.CRIMSON_D, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontSize: 15, color: mute }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 340, fontSize: 15, color: mute, lineHeight: 1.65 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: '#FFFCF4', border: `1px solid ${alpha(C.INDIGO, 0.3)}`, borderRadius: 2,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
}
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 2,
  fontSize: 15, letterSpacing: '.02em', textDecoration: 'none', cursor: 'pointer',
  background: on ? C.CRIMSON : 'transparent', color: on ? C.SILK : C.CRIMSON, border: `1px solid ${on ? C.CRIMSON : alpha(C.CRIMSON, 0.5)}`,
})
const suggest = { bg: '#FFFCF4', border: `1px solid ${alpha(C.INDIGO, 0.25)}`, active: alpha(C.SAFFRON, 0.2), text: C.INK, table: C.CRIMSON, radius: 2 }

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function KelagayiTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = TXT[lang] || TXT.az
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} & ${inv.bride}` : inv.single)

  return (
    <div data-kg lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.SILK, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.SAFFRON, 0.3),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <ScarfOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: 4, background: C.CRIMSON, border: `2px solid ${C.SILK}`, outline: `1px solid ${C.SAFFRON_D}`, boxShadow: '0 8px 20px rgba(110,18,34,.35)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.SILK} idle={alpha(C.SILK, 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.SILK, 0.93), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.CRIMSON, 0.2)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 14, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontSize: 17, letterSpacing: '.08em', color: C.CRIMSON }}>Digitoy</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>
          <div aria-hidden="true" style={{ height: 5, background: BAND }} />

          {/* HERO — açıq kəlağayı */}
          <section style={{ position: 'relative', overflow: 'hidden', background: SILK_BG, padding: '46px 22px 58px', textAlign: 'center' }}>
            <div style={{ fontFamily: head, fontSize: 15, letterSpacing: '.24em', color: C.CRIMSON, animation: 'kg-rise .8s ease-out .2s both' }}>{L('hero', 'kicker', inv.eventLabel)}</div>
            <h1 style={{ margin: '10px 0 0', fontFamily: head, fontWeight: 400, fontSize: nameSize(heroName), lineHeight: 1.05, color: C.INK, overflowWrap: 'anywhere', animation: 'kg-rise 1s ease-out .35s both' }}>{heroName}</h1>
            <ButaTrio style={{ marginTop: 16 }} />
            <div style={{ marginTop: 16, fontFamily: head, fontSize: 'clamp(19px, 5.4vw, 23px)', color: C.CRIMSON_D }}>{inv.fullDate}</div>
            <div style={{ marginTop: 6, fontSize: 15.5, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 14.5, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <div style={{ position: 'relative', width: 'min(80vw, 320px)', margin: '26px auto 0' }}>
              <div style={{ filter: 'drop-shadow(0 22px 26px rgba(110,18,34,.25))' }}>
                <div style={{ aspectRatio: '1', clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)', position: 'relative', overflow: 'hidden' }}>
                  <KelagayiSquare uid="kg-hero" />
                  <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: SHEEN, animation: 'kg-sheen 5s ease-in-out 1s infinite' }} />
                </div>
              </div>
            </div>
            <p style={{ margin: '24px auto 0', maxWidth: 330, fontSize: 16, fontStyle: 'italic', fontWeight: 300, lineHeight: 1.65, color: C.MUTED }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — romb lövhələr */}
          {S.countdown && (
            <Panel head={head} bg={INDIGO_BG} dark title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(4px, 2vw, 10px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <Diamond size="min(21vw, 88px)">
                      <span style={{ fontFamily: head, fontSize: 'clamp(20px, 6vw, 27px)', lineHeight: 1, color: C.CRIMSON_D, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                    </Diamond>
                    <div style={{ marginTop: 6, fontSize: 13, letterSpacing: '.06em', color: alpha(C.SILK, 0.82) }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN — üç rəngli haşiyə */}
          {S.venue && (
            <Panel head={head} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: '10px 10px', background: '#FFFCF4', border: `3px solid ${C.CRIMSON}`, outline: `1px solid ${C.SAFFRON_D}`, outlineOffset: -9, boxShadow: '0 22px 34px -26px rgba(110,18,34,.6)' }}>
                <div style={{ height: 5, background: BAND, marginBottom: 8 }} />
                <div style={{ overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.CRIMSON} height="clamp(250px, 70vw, 320px)"
                    map={{ opacity: 0.9, filter: 'sepia(.25) saturate(.8)', tintOpacity: 0.12, tint: C.SAFFRON, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: SILK_ALT }}><MapPin /></div>}
                  />
                </div>
                <div style={{ height: 5, background: BAND, marginTop: 8 }} />
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontSize: 24, lineHeight: 1.25, color: C.INK }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 15, color: C.MUTED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn} />
            </Panel>
          )}

          {/* PROQRAM */}
          {S.program && (
            <Panel head={head} bg={SILK_ALT} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 400, margin: '0 auto', borderTop: `1px solid ${alpha(C.CRIMSON, 0.35)}` }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 76px minmax(0, 1fr)', gap: 12, alignItems: 'center', padding: '16px 4px', borderBottom: `1px solid ${alpha(C.CRIMSON, 0.35)}` }}>
                    <span aria-hidden="true" style={{ width: 12, height: 12, margin: '0 auto', transform: 'rotate(45deg)', background: [C.CRIMSON, C.SAFFRON, C.INDIGO][i % 3], boxShadow: `0 0 0 3px ${C.SILK}, 0 0 0 4px ${alpha(C.CRIMSON, 0.35)}` }} />
                    <div style={{ fontFamily: head, fontSize: 18, color: C.CRIMSON, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    <div style={{ fontSize: 16, lineHeight: 1.4, color: C.INK }}>{ev.label}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel head={head} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" />
            </Panel>
          )}

          {/* MASA — böyük romb */}
          {S.seating && !seating.isEmpty && (
            <Panel head={head} bg={SILK_ALT} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="kg-seat-list" field={field} suggest={suggest} font={body} muted={C.MUTED} accent={C.CRIMSON}
                nameStyle={{ fontFamily: head, fontSize: 22 }}
                card={(num) => (
                  <Diamond size={200} style={{ animation: 'kg-drop .7s cubic-bezier(.3,.8,.4,1) both' }}>
                    <span style={{ fontSize: 12.5, letterSpacing: '.22em', textTransform: 'uppercase', color: C.CRIMSON }}>{T.table}</span>
                    <span style={{ fontFamily: head, fontSize: tableSize(num, 54), lineHeight: 1.05, color: C.INK }}>{num}</span>
                  </Diamond>
                )} />
            </Panel>
          )}

          {/* FOTOLAR — romb pəncərələr */}
          {S.gallery && (
            <Panel id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '28px 10px', padding: '16px 6px 26px' }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ width: '70%', aspectRatio: '1', margin: '0 auto', overflow: 'hidden', transform: 'rotate(45deg)', background: C.SILK_D, border: `3px solid ${C.CRIMSON}`, boxShadow: `0 0 0 3px ${C.SILK}, 0 0 0 4px ${C.SAFFRON_D}, 0 14px 22px -12px rgba(110,18,34,.5)` }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: 'rotate(-45deg) scale(1.42)' }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.INDIGO} bg="#FFFCF4" frame={{ border: `3px solid ${C.CRIMSON}`, outline: `1px solid ${C.SAFFRON_D}`, outlineOffset: -8 }}
                btn={btn} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'night')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel head={head} bg={SILK_ALT} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.CRIMSON, 0.45), hair: alpha(C.CRIMSON, 0.22), accent: C.CRIMSON,
                font: body, display: head, btnFont: body,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Buta size={24} /></div>,
                marker: (a) => (a ? <span style={{ display: 'block', width: 11, height: 11, transform: 'rotate(45deg)', background: C.CRIMSON }} /> : <span style={{ display: 'block', width: 11, height: 11, transform: 'rotate(45deg)', border: `1px solid ${alpha(C.CRIMSON, 0.5)}` }} />),
                suggest: { ...suggest, font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR */}
          {S.guestbook && (
            <Panel head={head} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field} btn={btn} errorColor={C.CRIMSON} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, background: '#FFFCF4', border: `1px solid ${alpha(C.CRIMSON, 0.25)}` }}>
                      <div aria-hidden="true" style={{ height: 4, background: BAND }} />
                      <div style={{ padding: '16px 18px 16px' }}>
                        <blockquote style={{ margin: 0, fontSize: 16, fontStyle: 'italic', fontWeight: 300, lineHeight: 1.65, color: C.INK }}>{msg.text}</blockquote>
                        <figcaption style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, fontFamily: head, fontSize: 15, color: C.CRIMSON }}>
                          <Buta size={9} color={[C.CRIMSON, C.SAFFRON_D, C.INDIGO][i % 3]} />
                          <span>{msg.name}{msg.date ? <span style={{ fontFamily: body, fontSize: 13, color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}</span>
                        </figcaption>
                      </div>
                    </figure>
                  )
                })}
              </div>
            </Panel>
          )}

          <div aria-hidden="true" style={{ height: 5, background: BAND }} />
          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={head} />
        </motion.div>
      )}
    </div>
  )
}

function MapPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -14, top: -40, width: 28, height: 28, transform: 'rotate(45deg)', background: C.CRIMSON, border: `2px solid ${C.SILK}`, boxShadow: `0 0 0 1px ${C.SAFFRON_D}, 0 8px 14px rgba(110,18,34,.45)` }} />
      <span style={{ position: 'absolute', left: -1, top: -14, width: 2, height: 14, background: C.CRIMSON }} />
    </span>
  )
}
