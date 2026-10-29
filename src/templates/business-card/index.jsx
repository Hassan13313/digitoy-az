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
import { C, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Card, CropMarks } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   BUSINESS CARD — «Vizit kartı» (Korporativ konsepti, 2026-10)

   Konsept: İsveçrə tipoqrafiyası — ciddi şəbəkə, nazik xətlər, iri hərf,
   bir rəng vurğusu (Klein mavisi). Açılışda masanın üstündə ağ vizit kartı;
   toxunanda kart çevrilir, mavi arxa üzündə tarix, saat və məkan. Daxildə:
     hero      → iri ad, məlumat cədvəli (tarix · saat · məkan · təşkilatçı)
     sayğac    → dörd sütun, nazik xətlər
     proqram   → cədvəl sətirləri
     masa      → qonağın adı və masası yazılmış vizit kartı
   Şriftlər: Inter Tight (başlıq və mətn) · JetBrains Mono (rəqəm və etiket) —
   Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('business-card')
const ID = 'business-card'
const MONO = "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace"

const KEYFRAMES = `
@keyframes bc-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes bc-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes bc-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes bc-slide { from { transform: translateX(-30px) rotate(-4deg); opacity: 0 } to { transform: none; opacity: 1 } }
[data-bc] span[aria-hidden="true"], [data-bc] svg[aria-hidden="true"], [data-bc] div[aria-hidden="true"] { pointer-events: none; }
[data-bc] ::placeholder { color: rgba(118,117,111,.65); }
[data-bc] input:focus-visible, [data-bc] textarea:focus-visible { border-color: ${C.KLEIN} !important; outline: none; }
[data-bc] button:focus-visible, [data-bc] a:focus-visible, [data-bc] [role="button"]:focus-visible { outline: 2px solid ${C.KLEIN}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-bc] *, [data-bc] { animation: none !important; transition: none !important; } }
`

const lbl = { fontFamily: MONO, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: C.MUTED }

/* ═══ 01 — AÇILIŞ: kart çevrilir ═══ */
function CardOpening({ inv, theme, T, weddingData }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-bc
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: `radial-gradient(80% 60% at 50% 40%, #F5F4F0, ${C.DESK} 80%)`, color: C.INK, fontFamily: theme.fonts.body }}>
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px' }}>
        <div style={{ position: 'relative', animation: 'bc-slide .9s cubic-bezier(.3,.8,.4,1) .2s both' }}>
          <CropMarks />
          <Card width="min(84vw, 340px)" flipped={go}
            front={(
              <div style={{ height: '100%', padding: '8% 8% 7%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <EmblemSlot mono={ot.mono} size={36} border={`1px solid ${C.HAIR}`} background={C.WHITE} color={C.KLEIN} font={head} style={{ animation: 'none', margin: 0 }}>
                    <span style={{ display: 'block', width: 22, height: 22, background: C.KLEIN }} />
                  </EmblemSlot>
                  {ot.show('kicker') && <span style={lbl}>{ot.text('kicker')}</span>}
                </div>
                {titleOv !== '' && (
                  <div style={{ fontFamily: head, fontWeight: 600, fontSize: 'clamp(22px, 6.6vw, 30px)', lineHeight: 1.02, letterSpacing: '-.03em', overflowWrap: 'anywhere' }}>
                    {first}{second && <> {ot.text('and')} {second}</>}
                  </div>
                )}
              </div>
            )}
            back={(
              <div style={{ height: '100%', padding: '8% 8% 7%', display: 'grid', gridTemplateRows: '1fr auto', gap: 8 }}>
                <div style={{ fontFamily: head, fontWeight: 600, fontSize: 'clamp(20px, 6vw, 26px)', lineHeight: 1.05, letterSpacing: '-.02em' }}>{ot.show('meta') ? ot.text('meta') : inv.fullDate}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontFamily: MONO, fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                  <span style={{ opacity: 0.75 }}>{T.time} {inv.time || '—'}</span>
                  <span style={{ opacity: 0.75, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{weddingData.venueName}</span>
                </div>
              </div>
            )} />
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: 44, textAlign: 'center' }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 26px', display: 'inline-flex', alignItems: 'center', gap: 12, background: C.INK, color: C.WHITE, fontWeight: 500, fontSize: 15, animation: 'bc-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}<span aria-hidden="true" style={{ width: 10, height: 10, background: C.KLEIN }} />
            </div>
          )}
          {ot.show('hint') && <div style={{ ...lbl, marginTop: 14, animation: 'bc-fade .8s ease-out 1.1s both, bc-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə — sol hizalı İsveçrə başlığı */
function Panel({ id, section, title, kicker, sub, children, head, alt = false }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '56px 20px 64px', background: alt ? C.WHITE : C.PAPER, color: C.INK, borderTop: `1px solid ${C.HAIR}` }}>
      <Reveal style={{ position: 'relative', maxWidth: 520, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ display: 'grid', gridTemplateColumns: '14px minmax(0, 1fr)', gap: 12, marginBottom: 28 }}>
            <span aria-hidden="true" style={{ width: 14, height: 14, marginTop: 10, background: C.KLEIN }} />
            <div>
              {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 600, fontSize: 'clamp(30px, 8.8vw, 42px)', lineHeight: 1, letterSpacing: '-.035em', color: C.INK, textWrap: 'balance' }}>{title}</h2>}
              {kicker && <div style={{ ...lbl, marginTop: 10 }}>{kicker}</div>}
              {sub && <p style={{ margin: '10px 0 0', maxWidth: 380, fontSize: 15.5, color: C.GRAPHITE, lineHeight: 1.55 }}>{sub}</p>}
            </div>
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: C.WHITE, border: `1px solid ${C.HAIR}`, borderRadius: 0,
  padding: '14px 14px', fontSize: 16, color: C.INK, outline: 'none',
}
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 20px',
  fontSize: 15, fontWeight: 500, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.INK : 'transparent', color: on ? C.WHITE : C.INK, border: `1px solid ${C.INK}`,
})
const suggest = { bg: C.WHITE, border: `1px solid ${C.HAIR}`, active: alpha(C.KLEIN, 0.08), text: C.INK, table: C.KLEIN, radius: 0 }

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function BusinessCardTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const host = inv.isCorp ? weddingData.organizer?.trim() : ''
  const rows = [[T.date, inv.fullDate], [T.time, inv.time], [T.venue, weddingData.venueName], [T.host, host]].filter(([, v]) => v)

  return (
    <div data-bc lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.PAPER, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.KLEIN, 0.25),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <CardOpening inv={inv} theme={theme} T={T} weddingData={weddingData} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: 0, background: C.KLEIN, boxShadow: '0 8px 20px rgba(36,56,232,.35)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.WHITE} idle={alpha(C.WHITE, 0.45)} radius={0} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.PAPER, 0.94), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${C.HAIR}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.GRAPHITE, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: head, fontWeight: 600, fontSize: 16, letterSpacing: '-.02em' }}><span aria-hidden="true" style={{ width: 9, height: 9, background: C.KLEIN }} />{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — iri ad və cədvəl */}
          <section data-section="hero" style={{ position: 'relative', background: C.PAPER, padding: '36px 20px 56px' }}>
            <div style={{ maxWidth: 520, margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...lbl }}>
                <span>{L('hero', 'kicker', inv.eventLabel)}</span>
                <span>{inv.dp?.year || ''}</span>
              </div>
              <div style={{ height: 1, background: C.INK, margin: '10px 0 0' }} />
              <h1 style={{ margin: '22px 0 0', fontFamily: head, fontWeight: 600, fontSize: nameSize(heroName), lineHeight: 0.96, letterSpacing: '-.045em', color: C.INK, overflowWrap: 'anywhere', animation: 'bc-rise .8s ease-out .1s both' }}>{heroName}</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 96px', gap: 12, alignItems: 'end', marginTop: 26 }}>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: C.GRAPHITE }}>{tr.inv_join}</p>
                <div aria-hidden="true" style={{ aspectRatio: '1', background: C.KLEIN }} />
              </div>
              <div style={{ marginTop: 28, borderTop: `1px solid ${C.INK}` }}>
                {rows.map(([k, v]) => (
                  <div key={k} style={{ display: 'grid', gridTemplateColumns: '108px minmax(0, 1fr)', gap: 12, alignItems: 'baseline', padding: '13px 0', borderBottom: `1px solid ${C.HAIR}` }}>
                    <span style={lbl}>{k}</span>
                    <span style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.35, overflowWrap: 'anywhere' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SAYĞAC */}
          {S.countdown && (
            <Panel section="countdown" head={head} alt title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', borderTop: `1px solid ${C.INK}`, borderBottom: `1px solid ${C.INK}` }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <div key={l} style={{ padding: '18px 6px 14px', borderLeft: i ? `1px solid ${C.HAIR}` : 'none' }}>
                    <div style={{ fontFamily: head, fontWeight: 600, fontSize: 'clamp(30px, 9vw, 44px)', lineHeight: 1, letterSpacing: '-.04em', color: i === 3 ? C.KLEIN : C.INK, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></div>
                    <div style={{ ...lbl, marginTop: 8 }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ position: 'relative', margin: '0 8px' }}>
                <CropMarks />
                <div style={{ overflow: 'hidden', isolation: 'isolate', border: `1px solid ${C.INK}` }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.KLEIN} height="clamp(250px, 70vw, 320px)"
                    map={{ opacity: 0.9, filter: 'grayscale(1) contrast(1.05)', tintOpacity: 0, tint: C.KLEIN, blend: 'normal' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: `repeating-linear-gradient(0deg, ${C.HAIR} 0 1px, transparent 1px 32px), repeating-linear-gradient(90deg, ${C.HAIR} 0 1px, transparent 1px 32px), ${C.WHITE}` }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '108px minmax(0, 1fr)', gap: 12, alignItems: 'baseline', borderTop: `1px solid ${C.INK}`, paddingTop: 12 }}>
                <span style={lbl}>{T.venue}</span>
                <div>
                  <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-.01em', lineHeight: 1.25 }}>{weddingData.venueName}</div>
                  {weddingData.venueNote && <div style={{ marginTop: 2, fontSize: 15, color: C.MUTED }}>{weddingData.venueNote}</div>}
                </div>
              </div>
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn} style={{ justifyContent: 'flex-start' }} />
            </Panel>
          )}

          {/* PROQRAM — cədvəl */}
          {S.program && (
            <Panel section="program" head={head} alt title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ borderTop: `1px solid ${C.INK}` }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '108px minmax(0, 1fr)', gap: 12, alignItems: 'baseline', padding: '15px 0', borderBottom: `1px solid ${C.HAIR}` }}>
                    <span style={{ fontFamily: MONO, fontSize: 15, fontWeight: 500, color: i === 0 ? C.KLEIN : C.INK, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</span>
                    <span style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.35 }}>{ev.label}</span>
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

          {/* MASA — vizit kartı */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} alt title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="bc-seat-list" field={field} suggest={suggest} font={body} muted={C.MUTED} accent={C.KLEIN}
                nameStyle={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}
                card={(num) => (
                  <div style={{ position: 'relative', display: 'inline-block', margin: '4px 0 8px', animation: 'bc-slide .7s cubic-bezier(.3,.8,.4,1) both' }}>
                    <CropMarks />
                    <div style={{ width: 'min(80vw, 320px)', aspectRatio: '85 / 55', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 36%', background: C.WHITE, boxShadow: '0 24px 40px -22px rgba(0,0,0,.35)', textAlign: 'left' }}>
                      <div style={{ padding: '8% 8%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <span style={lbl}>{T.guest}</span>
                        <span style={{ fontFamily: head, fontWeight: 600, fontSize: 19, lineHeight: 1.1, letterSpacing: '-.02em', overflowWrap: 'anywhere' }}>{seating.selected?.full_name}</span>
                      </div>
                      <div style={{ background: C.KLEIN, color: C.WHITE, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <span style={{ ...lbl, color: alpha(C.WHITE, 0.8) }}>{T.table}</span>
                        <span style={{ fontFamily: head, fontWeight: 600, fontSize: tableSize(num, 52), lineHeight: 1, letterSpacing: '-.03em' }}>{num}</span>
                      </div>
                    </div>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 4, marginBottom: 30 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ aspectRatio: '1', overflow: 'hidden', background: C.HAIR }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.INK} bg={C.WHITE} frame={{ border: `1px solid ${C.INK}` }}
                btn={btn} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'event')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} alt title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: C.INK, hair: C.HAIR, accent: C.KLEIN,
                font: body, display: head, btnFont: body,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><span style={{ width: 28, height: 28, background: C.KLEIN }} /></div>,
                marker: (a) => (a ? <span style={{ display: 'block', width: 14, height: 14, background: C.KLEIN }} /> : <span style={{ display: 'block', width: 14, height: 14, border: `1px solid ${C.INK}` }} />),
                suggest: { ...suggest, font: body },
              }} />
            </Panel>
          )}

          {/* QEYDLƏR */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field} btn={btn} errorColor={C.KLEIN} />
              <div style={{ borderTop: `1px solid ${C.INK}` }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, display: 'grid', gridTemplateColumns: '108px minmax(0, 1fr)', gap: 12, padding: '16px 0', borderBottom: `1px solid ${C.HAIR}` }}>
                      <figcaption style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.3 }}>{msg.name}{msg.date ? <div style={{ ...lbl, marginTop: 4 }}>{gbook.formatDate(msg.date)}</div> : null}</figcaption>
                      <blockquote style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: C.GRAPHITE }}>{msg.text}</blockquote>
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
      <span style={{ position: 'absolute', left: -1, top: -40, width: 2, height: 40, background: C.KLEIN }} />
      <span style={{ position: 'absolute', left: -9, top: -58, width: 18, height: 18, background: C.KLEIN }} />
      <span style={{ position: 'absolute', left: -4, top: -4, width: 8, height: 8, borderRadius: '50%', background: C.INK }} />
    </span>
  )
}
