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
import { C, GLOW, GRID_BG, nameSize } from './palette'
import { Screen, LiveDot, Beams, Badge } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   KEYNOTE — «Konfrans səhnəsi» (Korporativ konsepti, 2026-10)

   Konsept: konfrans və təqdimat səhnəsi — qaranlıq zal, nöqtəli şəbəkə,
   böyük ekran, projektor şüaları. Açılışda ekran sönükdür; toxunanda CRT
   kimi yanır (əvvəl üfüqi xətt, sonra bütöv ekran), şüalar açılır. Daxildə:
     hero      → ekranda tədbirin adı, təşkilatçı
     sayğac    → səhnə taymeri (mono rəqəmlər)
     proqram   → gündəm: nömrəli slayd bəndləri
     masa      → konfrans bəyi — adınız və masa nömrəsi
   Şriftlər: Geologica (başlıq) · Onest (mətn) · JetBrains Mono (etiketlər) —
   hamısında Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('keynote')
const ID = 'keynote'
const MONO = "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace"

const LABELS = {
  countdown: { title: { az: 'Başlanğıca qədər', en: 'Starting in', ru: 'До начала' } },
  venue:     { title: { az: 'Məkan', en: 'Venue', ru: 'Место проведения' } },
  program:   { title: { az: 'Gündəm', en: 'Agenda', ru: 'Повестка' } },
  dresscode: { title: { az: 'Geyim qaydası', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Bəyiniz və masanız', en: 'Your badge and table', ru: 'Ваш бейдж и стол' } },
  gallery:   { title: { az: 'Kadrlar', en: 'Highlights', ru: 'Кадры' } },
  rsvp:      { title: { az: 'Qeydiyyat', en: 'Registration', ru: 'Регистрация' } },
  guestbook: { title: { az: 'Rəylər və təbriklər', en: 'Notes and congratulations', ru: 'Отзывы и поздравления' } },
}
const TXT = {
  az: { table: 'Masa', guest: 'Qonaq', host: 'Təşkilatçı', live: 'CANLI' },
  en: { table: 'Table', guest: 'Guest', host: 'Hosted by', live: 'LIVE' },
  ru: { table: 'Стол', guest: 'Гость', host: 'Организатор', live: 'В ЭФИРЕ' },
}

const KEYFRAMES = `
@keyframes kn-live { 0%,100% { opacity: 1 } 50% { opacity: .3 } }
@keyframes kn-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes kn-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes kn-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes kn-blink { 0%,49% { opacity: 1 } 50%,100% { opacity: 0 } }
@keyframes kn-swing { 0% { transform: rotate(-8deg) } 60% { transform: rotate(3deg) } 100% { transform: none } }
[data-kn] span[aria-hidden="true"], [data-kn] svg[aria-hidden="true"], [data-kn] div[aria-hidden="true"] { pointer-events: none; }
[data-kn] ::placeholder { color: rgba(138,151,180,.55); }
[data-kn] input:focus-visible, [data-kn] textarea:focus-visible { border-color: ${C.CYAN} !important; outline: none; }
[data-kn] button:focus-visible, [data-kn] a:focus-visible, [data-kn] [role="button"]:focus-visible { outline: 2px solid ${C.CYAN}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-kn] *, [data-kn] { animation: none !important; transition: none !important; } }
`

const gradText = { backgroundImage: GLOW, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent' }

/* ═══ 01 — AÇILIŞ: ekran yanır ═══ */
function KeynoteOpening({ inv, theme, T }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-kn
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: GRID_BG, color: C.WHITE, fontFamily: theme.fonts.body }}>
      <Beams on={go} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 18px', textAlign: 'center' }}>
        <div style={{ marginBottom: 18, animation: 'kn-rise .9s ease-out .2s both' }}><LiveDot label={T.live} font={MONO} /></div>
        <div style={{ width: 'min(92vw, 420px)' }}>
          <Screen on={go}>
            <EmblemSlot mono={ot.mono} size={44} border={`1px solid ${alpha(C.WHITE, 0.3)}`} background="transparent" color={C.WHITE} font={head} style={{ animation: 'none', margin: '0 auto 10px' }}>
              <span style={{ display: 'block', width: 26, height: 26, margin: '0 auto', borderRadius: 8, background: GLOW, opacity: go ? 1 : 0.4, transition: 'opacity .4s ease .6s' }} />
            </EmblemSlot>
            {ot.show('kicker') && <div style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: '.24em', textTransform: 'uppercase', color: go ? alpha(C.WHITE, 0.8) : C.FAINT, transition: 'color .4s ease .6s' }}>{ot.text('kicker')}</div>}
            {titleOv !== '' && (
              <div style={{ marginTop: 8, fontFamily: head, fontWeight: 400, fontSize: 'clamp(26px, 8vw, 38px)', lineHeight: 1.08, letterSpacing: '-.01em', color: go ? C.WHITE : '#4A5571', transition: 'color .4s ease .55s', overflowWrap: 'anywhere' }}>
                {first}{second && <><span style={{ display: 'block', fontSize: '.5em' }}>&amp;</span>{second}</>}
              </div>
            )}
            {ot.show('meta') && <div style={{ marginTop: 10, fontFamily: MONO, fontSize: 12, letterSpacing: '.06em', color: go ? C.CYAN : C.FAINT, transition: 'color .4s ease .6s' }}>{ot.text('meta')}</div>}
          </Screen>
        </div>
        <div aria-hidden="true" style={{ width: '58%', height: 10, marginTop: -2, borderRadius: '0 0 8px 8px', background: C.PANEL }} />
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: 30 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 26px', display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 999, background: C.WHITE, color: C.VOID, fontWeight: 500, fontSize: 15.5, boxShadow: '0 0 0 1px rgba(255,255,255,.2), 0 16px 30px -12px rgba(61,123,255,.7)', animation: 'kn-rise .8s ease-out .8s both' }}>
              <span aria-hidden="true" style={{ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: `9px solid ${C.BLUE}` }} />
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 12, fontFamily: MONO, fontSize: 11.5, letterSpacing: '.14em', textTransform: 'uppercase', color: C.FAINT, animation: 'kn-fade .8s ease-out 1.1s both, kn-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, index, alt = false }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: alt ? C.NAVY : GRID_BG, color: C.WHITE, borderTop: `1px solid ${C.LINE}` }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ marginBottom: 30 }}>
            {index && <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.2em', color: C.CYAN }}>{index}</div>}
            {title && <h2 style={{ margin: '8px 0 0', fontFamily: head, fontWeight: 300, fontSize: 'clamp(32px, 9.4vw, 44px)', lineHeight: 1.05, letterSpacing: '-.02em', color: C.WHITE, textWrap: 'balance' }}>{title}</h2>}
            <div aria-hidden="true" style={{ width: 56, height: 3, marginTop: 14, borderRadius: 3, background: GLOW }} />
            {kicker && <div style={{ marginTop: 12, fontSize: 15.5, color: C.MUTED }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px 0 0', maxWidth: 360, fontSize: 15.5, color: C.MUTED, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: C.PANEL, border: `1px solid ${C.LINE}`, borderRadius: 12,
  padding: '14px 16px', fontSize: 16, color: C.WHITE, outline: 'none',
}
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 999,
  fontSize: 15, fontWeight: 500, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.WHITE : 'transparent', color: on ? C.VOID : C.WHITE, border: `1px solid ${on ? C.WHITE : C.LINE}`,
})
const suggest = { bg: C.PANEL_L, border: `1px solid ${C.LINE}`, active: alpha(C.BLUE, 0.25), text: C.WHITE, table: C.CYAN, radius: 12 }

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function KeynoteTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = TXT[lang] || TXT.az
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} & ${inv.bride}` : inv.single)
  const host = inv.isCorp ? weddingData.organizer?.trim() : ''
  let n = 0
  const idx = () => String(++n).padStart(2, '0')

  return (
    <div data-kn lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.VOID, minHeight: '100vh', fontFamily: body, color: C.WHITE, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.BLUE, 0.35),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <KeynoteOpening inv={inv} theme={theme} T={T} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: 14, background: GLOW, boxShadow: '0 8px 24px rgba(61,123,255,.45)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.WHITE} idle={alpha(C.WHITE, 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.VOID, 0.85), backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
            borderBottom: `1px solid ${C.LINE}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontWeight: 500, fontSize: 17, letterSpacing: '-.01em', ...gradText }}>Digitoy</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — ekran */}
          <section style={{ position: 'relative', overflow: 'hidden', background: GRID_BG, padding: '40px 18px 56px' }}>
            <Beams instant />
            <div style={{ position: 'relative', maxWidth: 460, margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', color: C.MUTED }}>{L('hero', 'kicker', inv.eventLabel)}</span>
                <LiveDot label={T.live} font={MONO} />
              </div>
              <Screen instant>
                <h1 style={{ margin: 0, fontFamily: head, fontWeight: 400, fontSize: nameSize(heroName), lineHeight: 1.04, letterSpacing: '-.02em', color: C.WHITE, overflowWrap: 'anywhere' }}>{heroName}</h1>
                {host && <div style={{ marginTop: 12, fontFamily: MONO, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: alpha(C.WHITE, 0.75) }}>{T.host} · {host}</div>}
              </Screen>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 10, marginTop: 14 }}>
                <div style={{ padding: '14px 16px', borderRadius: 14, background: C.PANEL, border: `1px solid ${C.LINE}` }}>
                  <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: C.FAINT }}>{inv.dayName || '—'}</div>
                  <div style={{ marginTop: 4, fontFamily: head, fontWeight: 400, fontSize: 18, lineHeight: 1.2 }}>{inv.fullDate}</div>
                </div>
                <div style={{ padding: '14px 16px', borderRadius: 14, background: C.PANEL, border: `1px solid ${C.LINE}` }}>
                  <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: C.FAINT }}>{inv.time || '—'}</div>
                  <div style={{ marginTop: 4, fontFamily: head, fontWeight: 400, fontSize: 18, lineHeight: 1.2, overflowWrap: 'anywhere' }}>{weddingData.venueName}</div>
                </div>
              </div>
              <p style={{ margin: '20px 0 0', fontSize: 16, lineHeight: 1.6, color: C.MUTED }}>{tr.inv_join}</p>
            </div>
          </section>

          {/* SAYĞAC — səhnə taymeri */}
          {S.countdown && (
            <Panel head={head} alt index={idx()} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <div key={l} style={{ padding: '16px 6px 12px', borderRadius: 14, background: C.PANEL, border: `1px solid ${i === 3 ? alpha(C.CYAN, 0.5) : C.LINE}`, textAlign: 'center' }}>
                    <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 'clamp(22px, 6.6vw, 30px)', lineHeight: 1, color: i === 3 ? C.CYAN : C.WHITE, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></div>
                    <div style={{ marginTop: 8, fontFamily: MONO, fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: C.FAINT }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel head={head} index={idx()} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ padding: 3, borderRadius: 18, background: GLOW, boxShadow: '0 0 50px -16px rgba(61,123,255,.6)' }}>
                <div style={{ borderRadius: 15, overflow: 'hidden', isolation: 'isolate', background: C.NAVY }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.BLUE} height="clamp(250px, 70vw, 320px)"
                    map={{ opacity: 0.75, filter: 'invert(.92) hue-rotate(185deg) saturate(.7) brightness(.9)', tintOpacity: 0.18, tint: C.BLUE, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(250px, 70vw, 320px)', position: 'relative', background: GRID_BG }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ marginTop: 22, fontFamily: head, fontWeight: 400, fontSize: 25, lineHeight: 1.2 }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ marginTop: 4, fontFamily: MONO, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: C.FAINT }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn} style={{ justifyContent: 'flex-start' }} />
            </Panel>
          )}

          {/* PROQRAM — gündəm */}
          {S.program && (
            <Panel head={head} alt index={idx()} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ display: 'grid', gap: 8 }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '34px 64px minmax(0, 1fr)', gap: 10, alignItems: 'center', padding: '14px 14px', borderRadius: 14, background: C.PANEL, border: `1px solid ${C.LINE}` }}>
                    <span style={{ fontFamily: MONO, fontSize: 12, color: C.FAINT }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 15, color: C.CYAN, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</span>
                    <span style={{ fontSize: 16.5, lineHeight: 1.35, color: C.WHITE }}>{ev.label}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel head={head} index={idx()} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" />
            </Panel>
          )}

          {/* MASA — konfrans bəyi */}
          {S.seating && !seating.isEmpty && (
            <Panel head={head} alt index={idx()} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="kn-seat-list" field={field} suggest={suggest} font={body} muted={C.MUTED} accent={C.CYAN}
                nameStyle={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}
                card={(num) => (
                  <Badge name={seating.selected?.full_name} role={T.guest} head={head} mono={MONO} style={{ transformOrigin: '50% 0', animation: 'kn-swing .9s cubic-bezier(.3,.8,.4,1) both' }}>
                    <div style={{ marginTop: 14, padding: '10px 0 2px', borderTop: `1px dashed ${alpha(C.VOID, 0.2)}` }}>
                      <div style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: '.2em', textTransform: 'uppercase', color: C.FAINT }}>{T.table}</div>
                      <div style={{ fontFamily: head, fontWeight: 500, fontSize: tableSize(num, 58), lineHeight: 1.05, ...gradText }}>{num}</div>
                    </div>
                  </Badge>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel id="gallery-section" head={head} index={idx()} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, marginBottom: 30 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ aspectRatio: i % 4 === 0 ? '1' : '3 / 4', overflow: 'hidden', borderRadius: 14, background: C.PANEL, border: `1px solid ${C.LINE}` }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.VOID} bg={C.WHITE} frame={{ borderRadius: 16, boxShadow: '0 0 0 3px rgba(61,123,255,.6), 0 0 40px -10px rgba(34,211,238,.6)' }}
                btn={btn} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'event')} />
            </Panel>
          )}

          {/* RSVP — qeydiyyat */}
          {S.rsvp && (
            <Panel head={head} alt index={idx()} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.WHITE, muted: C.MUTED, line: C.LINE, hair: C.LINE, accent: C.CYAN,
                font: body, display: head, btnFont: body,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><span style={{ width: 40, height: 40, borderRadius: 12, background: GLOW }} /></div>,
                marker: (a) => (a ? <span style={{ display: 'block', width: 14, height: 14, borderRadius: 4, background: GLOW }} /> : <span style={{ display: 'block', width: 14, height: 14, borderRadius: 4, border: `1px solid ${C.MUTED}` }} />),
                suggest: { ...suggest, font: body },
              }} />
            </Panel>
          )}

          {/* RƏYLƏR */}
          {S.guestbook && (
            <Panel head={head} index={idx()} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field} btn={btn} errorColor={C.CYAN} />
              <div style={{ display: 'grid', gap: 10 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  const ini = Array.from(String(msg.name || '?'))[0]
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, display: 'grid', gridTemplateColumns: '38px minmax(0, 1fr)', gap: 12, padding: '16px 16px 14px', borderRadius: 16, background: C.PANEL, border: `1px solid ${C.LINE}` }}>
                      <span aria-hidden="true" style={{ width: 38, height: 38, borderRadius: '50%', background: GLOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: head, fontWeight: 500, fontSize: 16, color: C.WHITE }}>{ini}</span>
                      <div>
                        <figcaption style={{ fontWeight: 500, fontSize: 15, color: C.WHITE }}>{msg.name}{msg.date ? <span style={{ fontFamily: MONO, fontWeight: 400, fontSize: 11.5, color: C.FAINT }}> · {gbook.formatDate(msg.date)}</span> : null}</figcaption>
                        <blockquote style={{ margin: '4px 0 0', fontSize: 16, lineHeight: 1.55, color: C.MUTED }}>{msg.text}</blockquote>
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
    </div>
  )
}

function MapPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -22, top: -22, width: 44, height: 44, borderRadius: '50%', border: `2px solid ${C.CYAN}`, opacity: 0.6, animation: 'kn-live 1.6s ease-in-out infinite' }} />
      <span style={{ position: 'absolute', left: -8, top: -8, width: 16, height: 16, borderRadius: '50%', background: GLOW, boxShadow: '0 0 16px rgba(34,211,238,.8)' }} />
    </span>
  )
}
