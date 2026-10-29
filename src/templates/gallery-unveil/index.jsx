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
import { C as PAL, GOLD_GRAD, WALL_BG, CHAR_BG, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Artwork, GildedFrame, VelvetCloth, MuseumLabel } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'

/* ─────────────────────────────────────────────────────────────────────────────
   GALLERY UNVEIL — «Pərdə açılır» (Açılış konsepti, 2026-10)

   Konsept: sərgi, qalereya və ya studiya açılışı. Açılışda ağ divarda,
   işıq altında zərli çərçivə məxmər örtüklə bağlıdır; toxunanda örtük
   sürüşüb düşür və abstrakt əsər üzə çıxır, altında muzey etiketi. Daxildə:
   paspartulu kiçik kətanlarda sayğac, kataloq kimi proqram, muzey etiketində
   masa nömrəsi, «salon» düzülüşündə fotolar, ziyarətçi dəftəri.
   Şriftlər: IBM Plex Serif (başlıq) · IBM Plex Sans (mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('gallery-unveil')
const ID = 'gallery-unveil'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['PLUM'], secondary: ['INK'], accent: ['GOLD'], background: ['WALL'], text: ['INK'] }

const KEYFRAMES = (C) => (`
@keyframes gu-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes gu-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes gu-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
[data-gu] span[aria-hidden="true"], [data-gu] svg[aria-hidden="true"], [data-gu] div[aria-hidden="true"] { pointer-events: none; }
[data-gu] ::placeholder { color: rgba(119,116,110,.7); }
[data-gu] [data-dark] ::placeholder { color: rgba(247,246,243,.45); }
[data-gu] input:focus-visible, [data-gu] textarea:focus-visible { border-color: ${C.PLUM} !important; outline: none; }
[data-gu] button:focus-visible, [data-gu] a:focus-visible, [data-gu] [role="button"]:focus-visible { outline: 2px solid ${C.PLUM}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-gu] *, [data-gu] { animation: none !important; transition: none !important; } }
`)

/* ═══ 01 — AÇILIŞ: örtük düşür ═══ */
function UnveilOpening({ inv, theme }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  const T = inv.copy(TXT)
  return (
    <motion.div {...gate.gateProps} data-gu
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: WALL_BG, color: C.INK, fontFamily: theme.fonts.body }}>
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        {ot.show('kicker') && <div style={{ marginBottom: 18, fontSize: 12, fontWeight: 500, letterSpacing: '.3em', textTransform: 'uppercase', color: C.MUTED, animation: 'gu-rise .8s ease-out .2s both' }}>{ot.text('kicker')}</div>}
        <div style={{ position: 'relative', width: 'min(62vw, 250px)' }}>
          <GildedFrame>
            <Artwork>
              <EmblemSlot mono={ot.mono} size={70} border={`2px solid ${C.INK}`} background="#F1E9DA" color={C.INK} font={head} style={{ animation: 'none' }}>
                <span />
              </EmblemSlot>
            </Artwork>
          </GildedFrame>
          <VelvetCloth off={go} />
        </div>
        <MuseumLabel style={{ marginTop: 22, width: 'min(62vw, 250px)', animation: 'gu-rise 1s ease-out .35s both' }}>
          {titleOv !== '' && (
            <div style={{ fontFamily: head, fontStyle: 'italic', fontSize: 'clamp(19px, 5.6vw, 23px)', lineHeight: 1.2, color: C.INK, overflowWrap: 'anywhere' }}>
              {first}{second && <> {ot.text('and')} {second}</>}
            </div>
          )}
          {ot.show('meta') && <div style={{ marginTop: 6, fontSize: 12.5, color: C.MUTED }}>{ot.text('meta')}</div>}
          <div style={{ marginTop: 2, fontSize: 12, color: C.MUTED }}>{T.medium}</div>
        </MuseumLabel>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.25 }} style={{ marginTop: 22 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 0, background: C.INK, color: C.WALL_L, fontSize: 14, fontWeight: 500, letterSpacing: '.2em', textTransform: 'uppercase', animation: 'gu-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 13.5, color: C.MUTED, animation: 'gu-fade .8s ease-out 1.1s both, gu-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dark = false }) {
  const C = usePalette(PAL)
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '68px 20px 74px', overflow: 'hidden', background: dark ? CHAR_BG : WALL_BG, color: dark ? C.WALL_L : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ marginBottom: 32, textAlign: 'left', borderLeft: `2px solid ${dark ? C.GOLD : C.PLUM}`, paddingLeft: 16 }}>
            {kicker && <div style={{ marginBottom: 6, fontSize: 11.5, fontWeight: 500, letterSpacing: '.3em', textTransform: 'uppercase', color: dark ? C.GOLD_L : C.MUTED }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 300, fontSize: scaleFont('clamp(32px, 9.4vw, 44px)', C.hs), lineHeight: 1.08, textWrap: 'balance', color: dark ? C.WALL_L : C.INK }}>{title}</h2>}
            {sub && <p style={{ margin: '10px 0 0', maxWidth: 360, fontSize: 15.5, color: dark ? alpha(C.WALL_L, 0.68) : C.MUTED, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: '#FFFFFF', border: `1px solid ${C.LINE}`, borderRadius: 0,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
})
const darkField = (C) => ({ ...field(C), background: alpha('#FFFFFF', 0.05), border: `1px solid ${alpha(C.WALL_L, 0.2)}`, color: C.WALL_L })
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 0,
  fontSize: 13.5, fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', textDecoration: 'none', cursor: 'pointer',
  background: on ? C.INK : 'transparent', color: on ? C.WALL_L : C.INK, border: `1px solid ${C.INK}`,
}))
const darkBtn = (C) => ((on) => ({ ...btn(C)(on), background: on ? C.WALL_L : 'transparent', color: on ? C.INK : C.WALL_L, border: `1px solid ${on ? C.WALL_L : alpha(C.WALL_L, 0.45)}` }))
const suggest = (C) => ({ bg: '#FFFFFF', border: `1px solid ${C.LINE}`, active: alpha(C.PLUM, 0.08), text: C.INK, table: C.PLUM, radius: 0 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function GalleryUnveilTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const year = inv.dp?.year || ''

  return (
    <PaletteContext.Provider value={C}><div data-gu lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.WALL, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.GOLD, 0.35),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <UnveilOpening inv={inv} theme={theme} lang={lang} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: 0, background: C.INK, boxShadow: '0 8px 20px rgba(0,0,0,.3)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.GOLD_L} idle={alpha(C.GOLD_L, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.WALL_L, 0.92), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${C.LINE}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 15, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontStyle: 'italic', fontSize: 20, color: C.INK }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — açılmış əsər + etiket */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: WALL_BG, padding: '44px 22px 64px' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GildedFrame style={{ width: 'min(56vw, 230px)' }}><Artwork /></GildedFrame>
            </div>
            <div style={{ maxWidth: 380, margin: '36px auto 0' }}>
              <div style={{ fontSize: 11.5, fontWeight: 500, letterSpacing: '.3em', textTransform: 'uppercase', color: C.MUTED }}>{L('hero', 'kicker', T.opening)}</div>
              <h1 style={{ margin: '10px 0 0', fontFamily: head, fontWeight: 300, fontSize: nameSize(heroName), lineHeight: 1.04, overflowWrap: 'anywhere', color: C.INK, animation: 'gu-rise 1s ease-out .2s both' }}>{heroName}</h1>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 10, fontFamily: head, fontStyle: 'italic', fontSize: 18, color: C.PLUM }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)', gap: '8px 18px', marginTop: 24, paddingTop: 18, borderTop: `1px solid ${C.LINE}`, fontSize: 15.5 }}>
                <span style={{ color: C.MUTED }}>{year || '—'}</span><span style={{ fontWeight: 500 }}>{inv.fullDate}</span>
                {(inv.time || weddingData.venueName) && <><span style={{ color: C.MUTED }}>{inv.time || '—'}</span><span>{weddingData.venueName}</span></>}
              </div>
              <p style={{ margin: '20px 0 0', fontFamily: head, fontStyle: 'italic', fontSize: 18, lineHeight: 1.6, color: C.INK }}>{tr.inv_join}</p>
            </div>
          </section>

          {/* SAYĞAC — kiçik kətanlar */}
          {S.countdown && (
            <Panel section="countdown" head={head} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <div key={l}>
                    <div style={{ padding: 4, background: C.INK, boxShadow: '0 12px 18px -12px rgba(0,0,0,.5)' }}>
                      <div style={{ padding: '14%', background: '#FBFAF7' }}>
                        <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: [C.OCHRE, C.PLUM, C.TEAL, C.INK][i] }}>
                          <span style={{ fontFamily: head, fontWeight: 300, fontSize: 'clamp(18px, 5.4vw, 24px)', lineHeight: 1, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: 8, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: C.MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} dark title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: 8, background: GOLD_GRAD(C) }}>
                <div style={{ padding: 10, background: '#FBFAF7' }}>
                  <div style={{ overflow: 'hidden', isolation: 'isolate' }}>
                    <MapSection
                      weddingData={weddingData} theme={theme} accent={C.PLUM} height="clamp(230px, 62vw, 290px)"
                      map={{ opacity: 0.92, filter: 'grayscale(1) contrast(1.05)', tintOpacity: 0.06, tint: C.PLUM, blend: 'multiply' }}
                      frame={<MapPin />}
                      fallback={<div style={{ height: 'clamp(230px, 62vw, 290px)', position: 'relative', background: WALL_BG }}><MapPin /></div>}
                    />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 24, fontFamily: head, fontWeight: 300, fontSize: 26, lineHeight: 1.2, color: C.WALL_L }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ marginTop: 4, fontFamily: head, fontStyle: 'italic', fontSize: 17, color: C.GOLD_L }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={darkBtn(C)} />
            </Panel>
          )}

          {/* PROQRAM — kataloq */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 420, margin: '0 auto' }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '48px minmax(0, 1fr) auto', gap: 12, alignItems: 'baseline', padding: '16px 0', borderTop: `1px solid ${C.LINE}` }}>
                    <span style={{ fontSize: 12.5, color: C.MUTED }}>{T.no} {i + 1}</span>
                    <span style={{ fontFamily: head, fontStyle: 'italic', fontSize: 19, lineHeight: 1.3, color: C.INK }}>{ev.label}</span>
                    <span style={{ fontSize: 15, fontWeight: 500, color: C.PLUM, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</span>
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

          {/* MASA — muzey etiketi */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="gu-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={C.MUTED} accent={C.PLUM}
                nameStyle={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}
                card={(num) => (
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: 16, alignItems: 'end', maxWidth: 380, margin: '22px auto 0' }}>
                    <GildedFrame aspect="0.8" mat="10%"><Artwork /></GildedFrame>
                    <MuseumLabel style={{ padding: '14px 14px 16px' }}>
                      <div style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: C.MUTED }}>{T.table}{' '}</div>
                      <div style={{ fontFamily: head, fontWeight: 300, fontSize: tableSize(num, 58), lineHeight: 1, color: C.PLUM }}>{num}</div>
                      <div style={{ marginTop: 10, fontFamily: head, fontStyle: 'italic', fontSize: 17, lineHeight: 1.25, color: C.INK, overflowWrap: 'anywhere' }}>{seating.selected?.full_name}</div>
                      <div style={{ marginTop: 4, fontSize: 11.5, color: C.MUTED }}>{T.guest}{year ? `, ${year}` : ''}</div>
                    </MuseumLabel>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR — salon düzülüşü */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 12, marginBottom: 34, alignItems: 'start' }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ gridColumn: ['1 / 5', '5 / 7', '1 / 3', '3 / 7', '1 / 4', '4 / 7'][i % 6], aspectRatio: ['4 / 3', '3 / 4', '3 / 4', '4 / 3', '1', '1'][i % 6], padding: i % 2 ? 4 : 6, background: i % 2 ? C.INK : GOLD_GRAD(C), boxShadow: '0 12px 18px -12px rgba(0,0,0,.45)' }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.INK} bg="#FFFFFF" frame={{ borderRadius: 0, padding: 10, boxShadow: '0 12px 18px -12px rgba(0,0,0,.4)' }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'event')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: C.LINE, hair: alpha(C.LINE, 0.7), accent: C.PLUM,
                font: body, display: head, displayItalic: true, btnFont: body,
                doneMark: <div style={{ width: 70, margin: '0 auto 12px' }}><GildedFrame aspect="1" mat="8%"><Artwork /></GildedFrame></div>,
                marker: (a) => <span style={{ display: 'block', width: 14, height: 14, border: `1.5px solid ${a ? C.PLUM : C.LINE}`, background: a ? C.PLUM : 'transparent', boxShadow: a ? 'inset 0 0 0 2.5px #FFFFFF' : 'none' }} />,
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* ZİYARƏTÇİ DƏFTƏRİ */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField(C)} btn={darkBtn(C)} errorColor={C.GOLD_L} />
              <div style={{ display: 'grid', gap: 0 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '18px 0', borderTop: `1px solid ${alpha(C.WALL_L, 0.14)}` }}>
                      <blockquote style={{ margin: 0, fontFamily: head, fontStyle: 'italic', fontWeight: 300, fontSize: 19, lineHeight: 1.55, color: C.WALL_L }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: C.GOLD_L }}>
                        {msg.name}{msg.date ? <span style={{ letterSpacing: '.04em', textTransform: 'none', color: alpha(C.WALL_L, 0.45) }}> · {gbook.formatDate(msg.date)}</span> : null}
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
  const C = usePalette(PAL)
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -14, top: -14, width: 28, height: 28, borderRadius: '50%', background: C.PLUM, boxShadow: '0 0 0 4px #FFFFFF, 0 6px 10px rgba(0,0,0,.35)' }} />
    </span>
  )
}
