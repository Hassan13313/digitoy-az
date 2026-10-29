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
import { galleryDesc, tableSize, ageWord } from '../_shared/kids'
import { C, DOTS, SPEED, OUTLINE, SFX, BURST_SHARP, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Emblem, Burst, Bubble, Caption } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   HERO COMIC — «Qəhrəman» (Sünnət toyu konsepti, 2026-10)

   Konsept: komiks kitabı — kiçik bəy bu günün super qəhrəmanıdır. Rastr
   nöqtələri, qalın qara konturlar, sürət xətləri, danışıq balonları.
   Açılışda komiks üz qabığı; toxunanda ortada «BAM!» partlayır və səhifə
   diaqonal iki yerə bölünüb kənara uçur. Daxildə:
     sayğac    → dörd rəngli komiks paneli
     proqram   → komiks lenti: hər hadisə öz panelində, mətn balonda
     masa      → «Missiya» partlayışı, içində masa nömrəsi
     arzular   → danışıq balonları
   Şriftlər: Unbounded (başlıq) · Balsamiq Sans (mətn) — Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('hero-comic')
const ID = 'hero-comic'

const PANEL_COLORS = [C.RED, C.BLUE, C.YELLOW, C.SKY]

const KEYFRAMES = `
@keyframes hc-pop { 0% { transform: scale(0) rotate(-20deg) } 60% { transform: scale(1.15) rotate(6deg) } 100% { transform: scale(1) rotate(-4deg) } }
@keyframes hc-shake { 0%,100% { transform: none } 20% { transform: translate(-6px, 3px) } 40% { transform: translate(5px, -4px) } 60% { transform: translate(-4px, -2px) } 80% { transform: translate(3px, 4px) } }
@keyframes hc-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes hc-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes hc-hint { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
@keyframes hc-wobble { 0%,100% { transform: rotate(-3deg) } 50% { transform: rotate(3deg) } }
[data-hc] span[aria-hidden="true"], [data-hc] svg[aria-hidden="true"], [data-hc] div[aria-hidden="true"] { pointer-events: none; }
[data-hc] ::placeholder { color: rgba(18,18,18,.45); }
[data-hc] input:focus-visible, [data-hc] textarea:focus-visible { border-color: ${C.BLUE} !important; outline: none; }
[data-hc] button:focus-visible, [data-hc] a:focus-visible, [data-hc] [role="button"]:focus-visible { outline: 3px solid ${C.BLUE}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-hc] *, [data-hc] { animation: none !important; transition: none !important; } }
`

/* Üz qabığının məzmunu (bölünmə üçün iki dəfə çəkilir) */
function Cover({ inv, head, hidden }) {
  const { ot } = inv
  const { titleOv, first, second } = openingNames(inv)
  return (
    <div aria-hidden={hidden ? 'true' : undefined} style={{ position: 'absolute', inset: 0, background: `${DOTS('rgba(255,255,255,.14)', 9)}, ${SPEED()}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center', borderLeft: `6px solid ${C.INK}`, borderRight: `6px solid ${C.INK}` }}>
      <div style={{ position: 'absolute', left: 14, right: 14, top: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ padding: '4px 10px', background: C.RED, border: `3px solid ${C.INK}`, fontFamily: head, fontWeight: 800, fontSize: 13, color: C.WHITE }}>№1</span>
        {inv.dp?.year && <span style={{ padding: '4px 10px', background: C.WHITE, border: `3px solid ${C.INK}`, fontFamily: head, fontWeight: 800, fontSize: 11, color: C.INK }}>{inv.dp.year}</span>}
      </div>
      <EmblemSlot mono={ot.mono} size={78} border={`3px solid ${C.INK}`} background={C.YELLOW} color={C.INK} font={head} style={{ animation: 'none', margin: '0 auto 14px' }}>
        <Emblem size={74} style={{ margin: '0 auto' }} />
      </EmblemSlot>
      {ot.show('kicker') && <Caption head={head} rotate={-3}>{ot.text('kicker')}</Caption>}
      {titleOv !== '' && (
        <div style={{ marginTop: 16, fontFamily: head, fontWeight: 800, fontSize: 'clamp(46px, 14vw, 66px)', lineHeight: 1, color: C.YELLOW, transform: 'rotate(-4deg) skewX(-6deg)', overflowWrap: 'anywhere', ...OUTLINE(4, 6) }}>
          {first}{second && <><span style={{ display: 'block', fontSize: '.45em', color: C.WHITE }}>{ot.text('and')}</span>{second}</>}
        </div>
      )}
      {ot.show('meta') && (
        <div style={{ marginTop: 22, padding: '6px 14px', background: C.WHITE, border: `3px solid ${C.INK}`, boxShadow: `4px 4px 0 ${C.INK}`, fontWeight: 700, fontSize: 15, color: C.INK, transform: 'rotate(2deg)' }}>{ot.text('meta')}</div>
      )}
    </div>
  )
}

/* ═══ 01 — AÇILIŞ: BAM! və səhifə bölünür ═══ */
function ComicOpening({ inv, theme, lang }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const go = gate.opening
  const head = theme.fonts.heading
  const half = (clip, out, hidden) => (
    <div style={{ position: 'absolute', inset: 0, clipPath: clip, transform: go ? out : 'none', transition: 'transform .8s cubic-bezier(.6,0,.3,1) .65s' }}>
      <Cover inv={inv} head={head} hidden={hidden} />
    </div>
  )
  return (
    <motion.div {...gate.gateProps} data-hc
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: `${DOTS('rgba(18,18,18,.2)', 8)}, ${C.YELLOW}`, color: C.INK, fontFamily: theme.fonts.body }}>
      <div style={{ position: 'absolute', inset: 0, animation: go ? 'hc-shake .4s linear .1s' : 'none' }}>
        {half('polygon(0 0, 100% 0, 100% 38%, 0 62%)', 'translate(-8%, -110%) rotate(-6deg)', false)}
        {half('polygon(0 62%, 100% 38%, 100% 100%, 0 100%)', 'translate(8%, 110%) rotate(6deg)', true)}
      </div>
      {go && (
        <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: -120, marginTop: -120, animation: 'hc-pop .45s cubic-bezier(.3,1.5,.5,1) both' }}>
          <Burst size={240} shape={BURST_SHARP}>
            <span style={{ fontFamily: head, fontWeight: 800, fontSize: 54, color: C.RED, ...OUTLINE(3, 4) }}>{SFX[lang] || SFX.az}</span>
          </Burst>
        </div>
      )}
      <motion.div animate={go ? { opacity: 0 } : {}} transition={{ duration: 0.15 }} style={{ position: 'absolute', left: 0, right: 0, bottom: 'max(36px, 7vh)', textAlign: 'center' }}>
        {ot.show('cta') && (
          <div style={{ minHeight: 52, padding: '12px 26px', display: 'inline-flex', alignItems: 'center', background: C.RED, border: `3px solid ${C.INK}`, boxShadow: `5px 5px 0 ${C.INK}`, color: C.WHITE, fontFamily: head, fontWeight: 800, fontSize: 16, letterSpacing: '.04em', textTransform: 'uppercase', animation: 'hc-rise .7s ease-out .7s both' }}>
            {ot.text('cta')}
          </div>
        )}
        {ot.show('hint') && <div style={{ marginTop: 12, fontWeight: 700, fontSize: 14, color: C.WHITE, textShadow: `0 0 6px ${C.INK}`, animation: 'hc-fade .8s ease-out 1s both, hc-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
      </motion.div>
    </motion.div>
  )
}

/* Bölmə: komiks səhifəsi + panel */
function Page({ id, section, title, kicker, sub, children, head, tint = C.PAPER, panel = true }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '56px 16px 62px', background: `${DOTS()}, ${tint}` }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            {title && (
              <h2 style={{ display: 'inline-block', margin: 0, padding: '10px 18px 9px', background: C.WHITE, border: `3px solid ${C.INK}`, boxShadow: `5px 5px 0 ${C.INK}`, transform: 'rotate(-1.5deg)', fontFamily: head, fontWeight: 800, fontSize: 'clamp(21px, 6.2vw, 28px)', lineHeight: 1.15, color: C.INK, textWrap: 'balance' }}>{title}</h2>
            )}
            {kicker && <div style={{ marginTop: 14, fontWeight: 700, fontSize: 15.5, color: C.MUTED }}>{kicker}</div>}
            {sub && <p style={{ margin: '10px auto 0', maxWidth: 340, fontSize: 15.5, color: C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {panel
          ? <div style={{ background: C.WHITE, border: `3px solid ${C.INK}`, boxShadow: `7px 7px 0 ${C.INK}`, padding: '24px 18px' }}>{children}</div>
          : children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: C.WHITE, border: `3px solid ${C.INK}`, borderRadius: 0,
  padding: '12px 14px', fontSize: 16, color: C.INK, outline: 'none',
}
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '11px 20px',
  fontSize: 15.5, fontWeight: 700, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.RED : C.WHITE, color: on ? C.WHITE : C.INK, border: `3px solid ${C.INK}`, boxShadow: `4px 4px 0 ${C.INK}`,
})
const suggest = { bg: C.WHITE, border: `3px solid ${C.INK}`, active: alpha(C.YELLOW, 0.6), text: C.INK, table: C.RED, radius: 0 }

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function HeroComicTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const age = inv.age

  return (
    <div data-hc lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.PAPER, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.YELLOW, 0.4),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <ComicOpening inv={inv} theme={theme} lang={lang} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.YELLOW, border: `3px solid ${C.INK}`, boxShadow: `3px 3px 0 ${C.INK}` }}>
        {({ playing }) => <EqBars playing={playing} color={C.INK} idle={alpha(C.INK, 0.35)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: C.YELLOW, borderBottom: `3px solid ${C.INK}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.INK, fontWeight: 700, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 800, fontSize: 16, color: C.RED, ...OUTLINE(1, 2) }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — üz qabığı */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: `${DOTS('rgba(255,255,255,.14)', 9)}, ${SPEED()}`, padding: '40px 18px 56px', textAlign: 'center', borderBottom: `4px solid ${C.INK}` }}>
            <Emblem size={84} style={{ margin: '0 auto', animation: 'hc-wobble 3s ease-in-out infinite' }} />
            <div style={{ marginTop: 16 }}><Caption head={head} rotate={-3}>{L('hero', 'kicker', inv.eventLabel)}</Caption></div>
            <h1 style={{ margin: '20px 0 0', fontFamily: head, fontWeight: 800, fontSize: nameSize(heroName), lineHeight: 1, color: C.YELLOW, transform: 'rotate(-4deg) skewX(-6deg)', overflowWrap: 'anywhere', ...OUTLINE(4, 6) }}>{heroName}</h1>
            {age && (
              <Burst size={112} style={{ margin: '18px auto 0', transform: 'rotate(8deg)' }}>
                <span style={{ fontFamily: head, fontWeight: 800, fontSize: 36, lineHeight: 0.9, color: C.RED, ...OUTLINE(2, 2) }}>{age}</span>
                <span style={{ fontFamily: head, fontWeight: 800, fontSize: 12, color: C.INK, textTransform: 'uppercase' }}>{ageWord(age, lang)}</span>
              </Burst>
            )}
            <div style={{ display: 'inline-block', marginTop: age ? 12 : 26, padding: '12px 18px', background: C.WHITE, border: `3px solid ${C.INK}`, boxShadow: `5px 5px 0 ${C.INK}`, transform: 'rotate(1.5deg)' }}>
              <div style={{ fontFamily: head, fontWeight: 800, fontSize: 'clamp(16px, 4.6vw, 20px)', color: C.INK }}>{inv.fullDate}</div>
              <div style={{ marginTop: 4, fontWeight: 700, fontSize: 15.5, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 4, fontSize: 14.5, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            </div>
            <Bubble style={{ maxWidth: 320, margin: '28px auto 0', textAlign: 'left' }}>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: C.INK }}>{tr.inv_join}</p>
            </Bubble>
          </section>

          {/* SAYĞAC — rəngli panellər */}
          {S.countdown && (
            <Page section="countdown" head={head} panel={false} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, maxWidth: 360, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <div key={l} style={{ position: 'relative', padding: '18px 10px 14px', textAlign: 'center', background: `${DOTS('rgba(255,255,255,.22)', 7)}, ${PANEL_COLORS[i]}`, border: `3px solid ${C.INK}`, boxShadow: `5px 5px 0 ${C.INK}`, transform: `rotate(${[-1.5, 1, 1.5, -1][i]}deg)` }}>
                    <div style={{ fontFamily: head, fontWeight: 800, fontSize: 'clamp(38px, 11vw, 52px)', lineHeight: 1, color: C.WHITE, fontVariantNumeric: 'tabular-nums', ...OUTLINE(3, 4) }}><PopDigit value={v} pop={pop} /></div>
                    <div style={{ display: 'inline-block', marginTop: 10, padding: '2px 10px', background: C.WHITE, border: `2px solid ${C.INK}`, fontWeight: 700, fontSize: 13.5, color: C.INK }}>{l}</div>
                  </div>
                ))}
              </div>
            </Page>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Page section="venue" head={head} tint="#E9F4FB" panel={false} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ border: `3px solid ${C.INK}`, boxShadow: `7px 7px 0 ${C.INK}`, background: C.WHITE, overflow: 'hidden', isolation: 'isolate' }}>
                <MapSection
                  weddingData={weddingData} theme={theme} accent={C.RED} height="clamp(250px, 70vw, 320px)"
                  map={{ opacity: 0.95, filter: 'saturate(1.15) contrast(1.05)', tintOpacity: 0.08, tint: C.SKY, blend: 'multiply' }}
                  frame={<MapPin label={T.mission} head={head} />}
                  fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: `${DOTS()}, #DDEFFA` }}><MapPin label={T.mission} head={head} /></div>}
                />
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 800, fontSize: 21, lineHeight: 1.25, color: C.INK }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontWeight: 700, fontSize: 15, color: C.MUTED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn} />
            </Page>
          )}

          {/* PROQRAM — komiks lenti */}
          {S.program && (
            <Page section="program" head={head} panel={false} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                {timeline.events.map((ev, i) => {
                  const last = i === timeline.events.length - 1 && timeline.events.length % 2 === 1
                  return (
                    <div key={i} style={{ gridColumn: last ? '1 / -1' : undefined, position: 'relative', minHeight: 132, padding: '40px 12px 14px', background: `${DOTS('rgba(18,18,18,.10)', 7)}, ${[C.WHITE, '#FFF1B8', '#E3F2FC', '#FFE1E3'][i % 4]}`, border: `3px solid ${C.INK}`, boxShadow: `5px 5px 0 ${C.INK}` }}>
                      <span style={{ position: 'absolute', left: -3, top: -3, padding: '5px 10px 4px', background: C.YELLOW, border: `3px solid ${C.INK}`, fontFamily: head, fontWeight: 800, fontSize: 14, color: C.INK, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</span>
                      <span style={{ position: 'absolute', right: 8, top: 6, fontFamily: head, fontWeight: 800, fontSize: 12, color: alpha(C.INK, 0.4) }}>{String(i + 1).padStart(2, '0')}</span>
                      <Bubble tail={i % 2 ? 'right' : 'left'} style={{ padding: '10px 12px', borderRadius: 20, boxShadow: 'none' }}>
                        <div style={{ fontWeight: 700, fontSize: 15.5, lineHeight: 1.3, color: C.INK }}>{ev.label}</div>
                      </Bubble>
                    </div>
                  )
                })}
              </div>
            </Page>
          )}

          {S.dresscode && (
            <Page section="dresscode" head={head} tint="#FFF1B8" title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" />
            </Page>
          )}

          {/* MASA — missiya partlayışı */}
          {S.seating && !seating.isEmpty && (
            <Page section="seating" head={head} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="hc-seat-list" field={field} suggest={suggest} font={body} muted={C.MUTED} accent={C.RED}
                nameStyle={{ fontFamily: head, fontWeight: 800, fontSize: 19, color: C.INK }}
                card={(num) => (
                  <Burst size={210} style={{ margin: '0 auto', animation: 'hc-pop .5s cubic-bezier(.3,1.5,.5,1) both' }}>
                    <span style={{ fontFamily: head, fontWeight: 800, fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', color: C.INK }}>{T.table}</span>
                    <span style={{ fontFamily: head, fontWeight: 800, fontSize: tableSize(num, 64), lineHeight: 1, color: C.RED, ...OUTLINE(3, 4) }}>{num}</span>
                  </Burst>
                )} />
            </Page>
          )}

          {/* FOTOLAR — kadrlar */}
          {S.gallery && (
            <Page section="gallery" id="gallery-section" head={head} tint="#E9F4FB" title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, marginBottom: 26 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ aspectRatio: i % 3 === 1 ? '3 / 4' : '1', alignSelf: 'center', overflow: 'hidden', background: C.SKY, border: `3px solid ${C.INK}`, boxShadow: `3px 3px 0 ${C.INK}` }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.INK} bg={C.WHITE} frame={{ border: `3px solid ${C.INK}`, boxShadow: `5px 5px 0 ${C.INK}` }}
                btn={btn} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Page>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Page section="rsvp" head={head} tint="#FFE1E3" title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: C.INK, hair: alpha(C.INK, 0.25), accent: C.RED,
                font: body, display: head, btnFont: head,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Emblem size={54} /></div>,
                marker: (a) => (a ? <span style={{ display: 'block', width: 14, height: 14, background: C.RED, border: `2px solid ${C.INK}` }} /> : <span style={{ display: 'block', width: 14, height: 14, border: `2px solid ${C.INK}` }} />),
                suggest: { ...suggest, font: body },
              }} />
            </Page>
          )}

          {/* ARZULAR — balonlar */}
          {S.guestbook && (
            <Page section="guestbook" head={head} panel={false} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <div style={{ background: C.WHITE, border: `3px solid ${C.INK}`, boxShadow: `7px 7px 0 ${C.INK}`, padding: '20px 16px 0', marginBottom: 30 }}>
                <GuestbookForm inv={inv} field={field} btn={btn} errorColor={C.RED} />
              </div>
              <div style={{ display: 'grid', gap: 34 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  const right = i % 2 === 1
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, maxWidth: '88%', justifySelf: right ? 'end' : 'start' }}>
                      <Bubble tail={right ? 'right' : 'left'} bg={right ? '#FFF1B8' : C.WHITE}>
                        <blockquote style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: C.INK }}>{msg.text}</blockquote>
                      </Bubble>
                      <figcaption style={{ marginTop: 26, textAlign: right ? 'right' : 'left', fontFamily: head, fontWeight: 800, fontSize: 13.5, color: C.INK }}>{msg.name}{msg.date ? <span style={{ fontFamily: body, fontWeight: 400, color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}</figcaption>
                    </figure>
                  )
                })}
              </div>
            </Page>
          )}

          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={head} />
        </motion.div>
      )}
    </div>
  )
}

function MapPin({ label, head }) {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -46, top: -70, width: 92, padding: '6px 0 5px', textAlign: 'center', background: C.YELLOW, border: `3px solid ${C.INK}`, boxShadow: `3px 3px 0 ${C.INK}`, fontFamily: head, fontWeight: 800, fontSize: 12, textTransform: 'uppercase', color: C.INK }}>{label}</span>
      <span style={{ position: 'absolute', left: -9, top: -36, width: 0, height: 0, borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderTop: `20px solid ${C.INK}` }} />
      <span style={{ position: 'absolute', left: -7, top: -7, width: 14, height: 14, borderRadius: '50%', background: C.RED, border: `3px solid ${C.INK}` }} />
    </span>
  )
}
