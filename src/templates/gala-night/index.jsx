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
import { C as PAL, GOLD_GRAD, DECO, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { ChampagneTower, Sunburst, Fan, CornerFans } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'

/* ─────────────────────────────────────────────────────────────────────────────
   GALA NIGHT — «Gala gecəsi» (Korporativ konsepti, 2026-10)

   Konsept: art-deco gala — qara oniks, qızılı şüalar, pilləli künclər və
   şampan qülləsi. Açılışda qədəhlər boşdur; toxunanda şampan yuxarıdan
   tökülür və qədəhlər sıra-sıra dolur, köpüklər qalxır. Daxildə:
     hero      → künc yelpikli deco çərçivə, tədbirin adı və təşkilatçı
     sayğac    → pilləli künclü dörd panel
     proqram   → qızılı bilet-saatlar
     masa      → qızılı haşiyəli yer kartı
   Şriftlər: Playfair Display (başlıq) · Montserrat (mətn) — Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('gala-night')
const ID = 'gala-night'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['GOLD'], secondary: ['GOLD_D'], accent: ['GOLD_L'], background: ['BLACK'], text: ['IVORY'] }

const KEYFRAMES = (C) => (`
@keyframes gn-stream { to { stroke-dashoffset: -7 } }
@keyframes gn-bubble { 0% { transform: translateY(0); opacity: 0 } 20% { opacity: 1 } 100% { transform: translateY(-14px); opacity: 0 } }
@keyframes gn-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes gn-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes gn-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes gn-shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
@keyframes gn-card { 0% { transform: rotateX(70deg); opacity: 0 } 100% { transform: none; opacity: 1 } }
[data-gn] span[aria-hidden="true"], [data-gn] svg[aria-hidden="true"], [data-gn] div[aria-hidden="true"] { pointer-events: none; }
[data-gn] ::placeholder { color: rgba(245,239,227,.4); }
[data-gn] input:focus-visible, [data-gn] textarea:focus-visible { border-color: ${C.GOLD} !important; outline: none; }
[data-gn] button:focus-visible, [data-gn] a:focus-visible, [data-gn] [role="button"]:focus-visible { outline: 2px solid ${C.GOLD_L}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-gn] *, [data-gn] { animation: none !important; transition: none !important; } }
`)

const ONYX_BG = (C) => (`radial-gradient(70% 40% at 50% 0%, rgba(212,175,97,.12), transparent 70%), linear-gradient(180deg, ${C.ONYX}, ${C.BLACK})`)
const goldText = (C) => ({ backgroundImage: GOLD_GRAD(C), WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent' })

/* ═══ 01 — AÇILIŞ: şampan qülləsi dolur ═══ */
function GalaOpening({ inv, theme }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-gn
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: `radial-gradient(60% 40% at 50% 62%, #241F18, ${C.BLACK} 75%)`, color: C.IVORY, fontFamily: theme.fonts.body }}>
      <Sunburst size={560} opacity={0.22} style={{ position: 'absolute', left: '50%', top: 0, marginLeft: -280, transform: 'scaleY(-1)' }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ animation: 'gn-rise 1s ease-out .2s both' }}>
          <EmblemSlot mono={ot.mono} size={48} border={`1px solid ${alpha(C.GOLD, 0.6)}`} background="transparent" color={C.GOLD_L} font={head} style={{ animation: 'none', margin: '0 auto 12px' }}>
            <Fan width={60} />
          </EmblemSlot>
          {ot.show('kicker') && <div style={{ fontSize: 12.5, fontWeight: 500, letterSpacing: '.42em', textTransform: 'uppercase', color: C.GOLD }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 10, fontFamily: head, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(36px, 10.6vw, 52px)', lineHeight: 1.08, overflowWrap: 'anywhere', ...goldText(C) }}>
              {first}{second && <><span style={{ display: 'block', fontSize: '.5em' }}>{ot.text('and')}</span>{second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 12, fontSize: 13.5, letterSpacing: '.14em', textTransform: 'uppercase', color: C.MUTED }}>{ot.text('meta')}</div>}
        </div>
        <div style={{ width: 'min(70vw, 270px)', marginTop: 34 }}>
          <ChampagneTower width="100%" pour={go} />
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: 24 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', clipPath: DECO, background: GOLD_GRAD(C), color: C.BLACK, fontWeight: 600, fontSize: 14, letterSpacing: '.22em', textTransform: 'uppercase', animation: 'gn-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 12.5, letterSpacing: '.16em', textTransform: 'uppercase', color: C.FAINT, animation: 'gn-fade .8s ease-out 1.1s both, gn-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, alt = false }) {
  const C = usePalette(PAL)
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '66px 20px 72px', overflow: 'hidden', background: alt ? C.ONYX : ONYX_BG(C), color: C.IVORY, borderTop: `1px solid ${alpha(C.GOLD, 0.18)}` }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 34 }}>
            <Fan width={200} />
            {title && <h2 style={{ margin: '16px 0 0', fontFamily: head, fontStyle: 'italic', fontWeight: 400, fontSize: scaleFont('clamp(30px, 8.8vw, 40px)', C.hs), lineHeight: 1.12, textWrap: 'balance', ...goldText(C) }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 10, fontSize: 12.5, fontWeight: 500, letterSpacing: '.3em', textTransform: 'uppercase', color: C.MUTED }}>{kicker}</div>}
            {sub && <p style={{ margin: '10px auto 0', maxWidth: 340, fontSize: 15, color: C.MUTED, lineHeight: 1.65 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: alpha('#000000', 0.35), border: `1px solid ${alpha(C.GOLD, 0.35)}`, borderRadius: 0,
  padding: '14px 16px', fontSize: 16, color: C.IVORY, outline: 'none',
})
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px',
  fontSize: 13, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', textDecoration: 'none', cursor: 'pointer',
  background: on ? GOLD_GRAD(C) : 'transparent', color: on ? C.BLACK : C.GOLD_L, border: `1px solid ${on ? C.GOLD : alpha(C.GOLD, 0.45)}`,
}))
const suggest = (C) => ({ bg: C.ONYX_L, border: `1px solid ${alpha(C.GOLD, 0.3)}`, active: alpha(C.GOLD, 0.15), text: C.IVORY, table: C.GOLD_L, radius: 0 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function GalaNightTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const host = inv.isCorp ? weddingData.organizer?.trim() : ''

  return (
    <PaletteContext.Provider value={C}><div data-gn lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.BLACK, minHeight: '100vh', fontFamily: body, color: C.IVORY, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.GOLD, 0.3),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <GalaOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: 0, clipPath: DECO, background: GOLD_GRAD(C), boxShadow: '0 8px 20px rgba(0,0,0,.6)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.BLACK} idle={alpha(C.BLACK, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.BLACK, 0.9), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.GOLD, 0.3)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 14, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontStyle: 'italic', fontSize: 20, ...goldText(C) }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — deco çərçivə */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: ONYX_BG(C), padding: '30px 16px 56px' }}>
            <Sunburst size={520} opacity={0.18} style={{ position: 'absolute', left: '50%', top: 0, marginLeft: -260, transform: 'scaleY(-1)' }} />
            <div style={{ position: 'relative', maxWidth: 440, margin: '0 auto', padding: '54px 26px 44px', textAlign: 'center', border: `1px solid ${alpha(C.GOLD, 0.7)}`, outline: `1px solid ${alpha(C.GOLD, 0.35)}`, outlineOffset: -9 }}>
              <CornerFans />
              <div style={{ fontSize: 12.5, fontWeight: 500, letterSpacing: '.42em', textTransform: 'uppercase', color: C.GOLD }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              <h1 style={{ margin: '14px 0 0', fontFamily: head, fontStyle: 'italic', fontWeight: 400, fontSize: nameSize(heroName), lineHeight: 1.06, overflowWrap: 'anywhere', ...goldText(C), animation: 'gn-rise 1s ease-out .2s both' }}>{heroName}</h1>
              {host && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 11.5, letterSpacing: '.3em', textTransform: 'uppercase', color: C.FAINT }}>{T.host}</div>
                  <div style={{ marginTop: 4, fontFamily: head, fontSize: 21, color: C.IVORY }}>{host}</div>
                </div>
              )}
              <div style={{ width: 'min(54vw, 200px)', margin: '24px auto 0' }}><ChampagneTower width="100%" instant /></div>
              <Fan width={210} style={{ marginTop: 22 }} />
              <div style={{ marginTop: 16, fontSize: 15, fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', color: C.IVORY }}>{inv.fullDate}</div>
              <div style={{ marginTop: 6, fontSize: 14.5, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
              <p style={{ margin: '18px auto 0', maxWidth: 320, fontFamily: head, fontStyle: 'italic', fontSize: 18, lineHeight: 1.55, color: alpha(C.IVORY, 0.82) }}>{tr.inv_join}</p>
            </div>
          </section>

          {/* SAYĞAC — deco panellər */}
          {S.countdown && (
            <Panel section="countdown" head={head} alt title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(6px, 2.4vw, 12px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop]) => (
                  <div key={l} style={{ padding: 1, background: GOLD_GRAD(C), clipPath: DECO }}>
                    <div style={{ clipPath: DECO, background: `linear-gradient(180deg, ${C.ONYX_L}, ${C.BLACK})`, padding: '20px 4px 14px', textAlign: 'center' }}>
                      <div style={{ fontFamily: head, fontWeight: 400, fontSize: 'clamp(26px, 7.6vw, 36px)', lineHeight: 1, fontVariantNumeric: 'tabular-nums', ...goldText(C) }}><PopDigit value={v} pop={pop} /></div>
                      <div style={{ marginTop: 8, fontSize: 10.5, fontWeight: 500, letterSpacing: '.18em', textTransform: 'uppercase', color: C.MUTED }}>{l}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: 1, background: GOLD_GRAD(C), clipPath: DECO }}>
                <div style={{ clipPath: DECO, padding: 10, background: C.BLACK }}>
                  <div style={{ overflow: 'hidden', isolation: 'isolate' }}>
                    <MapSection
                      weddingData={weddingData} theme={theme} accent={C.GOLD_D} height="clamp(250px, 70vw, 320px)"
                      map={{ opacity: 0.7, filter: 'grayscale(1) contrast(1.1) brightness(.85)', tintOpacity: 0.25, tint: C.GOLD_D, blend: 'multiply' }}
                      frame={<MapPin />}
                      fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: C.ONYX_L }}><MapPin /></div>}
                    />
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 26, fontFamily: head, fontStyle: 'italic', fontSize: 27, lineHeight: 1.2, color: C.IVORY }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 6, fontSize: 12.5, letterSpacing: '.24em', textTransform: 'uppercase', color: C.MUTED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} />
            </Panel>
          )}

          {/* PROQRAM — qızılı biletlər */}
          {S.program && (
            <Panel section="program" head={head} alt title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 400, margin: '0 auto', display: 'grid', gap: 10 }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '86px minmax(0, 1fr)', alignItems: 'stretch', border: `1px solid ${alpha(C.GOLD, 0.35)}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: GOLD_GRAD(C), color: C.BLACK, fontWeight: 600, fontSize: 15, letterSpacing: '.06em', fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    <div style={{ padding: '15px 16px', fontFamily: head, fontSize: 18.5, lineHeight: 1.3, color: C.IVORY }}>{ev.label}</div>
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

          {/* MASA — yer kartı */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} alt title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="gn-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={C.MUTED} accent={C.GOLD_L}
                nameStyle={{ fontFamily: head, fontStyle: 'italic', fontSize: 25 }}
                card={(num) => (
                  <div style={{ perspective: 600 }}>
                    <div style={{ position: 'relative', width: 230, margin: '0 auto', padding: '30px 20px 26px', background: `linear-gradient(180deg, ${C.IVORY}, #E9E0CC)`, color: C.BLACK, boxShadow: '0 22px 34px -18px rgba(0,0,0,.8)', outline: `1px solid ${C.GOLD_D}`, outlineOffset: -8, transformOrigin: '50% 100%', animation: 'gn-card .7s cubic-bezier(.3,.8,.4,1) both' }}>
                      <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '.36em', textTransform: 'uppercase', color: C.GOLD_D }}>{T.table}</div>
                      <div style={{ fontFamily: head, fontStyle: 'italic', fontSize: tableSize(num, 64), lineHeight: 1.05 }}>{num}</div>
                      <Fan width={120} color={C.GOLD_D} style={{ marginTop: 10 }} />
                    </div>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10, marginBottom: 32 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ aspectRatio: '3 / 4', overflow: 'hidden', clipPath: DECO, background: C.ONYX_L, outline: `1px solid ${C.GOLD}`, outlineOffset: -6 }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.BLACK} bg={C.IVORY} frame={{ clipPath: DECO, outline: `1px solid ${C.GOLD_D}`, outlineOffset: -5 }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'event')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} alt title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.IVORY, muted: C.MUTED, line: alpha(C.GOLD, 0.45), hair: alpha(C.GOLD, 0.2), accent: C.GOLD_L,
                font: body, display: head, displayItalic: true, btnFont: body,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Fan width={80} /></div>,
                marker: (a) => (a ? <span style={{ display: 'block', width: 12, height: 12, transform: 'rotate(45deg)', background: GOLD_GRAD(C) }} /> : <span style={{ display: 'block', width: 12, height: 12, transform: 'rotate(45deg)', border: `1px solid ${alpha(C.GOLD, 0.5)}` }} />),
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* TƏBRİKLƏR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field(C)} btn={btn(C)} errorColor={C.GOLD_L} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '20px 20px 18px', background: C.ONYX_L, borderLeft: `2px solid ${C.GOLD}` }}>
                      <blockquote style={{ margin: 0, fontFamily: head, fontStyle: 'italic', fontSize: 18.5, lineHeight: 1.5, color: C.IVORY }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 10, fontSize: 12, fontWeight: 600, letterSpacing: '.22em', textTransform: 'uppercase', color: C.GOLD }}>{msg.name}{msg.date ? <span style={{ fontWeight: 400, letterSpacing: '.06em', textTransform: 'none', color: C.FAINT }}> · {gbook.formatDate(msg.date)}</span> : null}</figcaption>
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
      <span style={{ position: 'absolute', left: -14, top: -40, width: 28, height: 28, transform: 'rotate(45deg)', background: GOLD_GRAD(C), boxShadow: '0 8px 14px rgba(0,0,0,.5)' }} />
      <span style={{ position: 'absolute', left: -5, top: -31, width: 10, height: 10, transform: 'rotate(45deg)', background: C.BLACK }} />
    </span>
  )
}
