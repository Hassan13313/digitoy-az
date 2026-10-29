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
import { C, GILT, GILT_BAR, GLOW_BG, nameSize } from './palette'
import { Glint, GiltRule, Mirror, Candlestick } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   MIRROR & CANDLE — «Güzgü və şam» (Xına gecəsi konsepti, 2026-10)

   Konsept: gəlinin qarşısına qoyulan güzgü və iki şam — aydınlıq və işıq
   arzusu. Açılışda qaranlıq otaqda qızılı oval güzgü, iki yanında sönük
   şamlar; toxunanda şamlar alışır, güzgü işıqlanır, üzərindən parıltı keçir.
   Daxildə:
     hero      → şamlar arasında güzgü, ad güzgüdə
     sayğac    → dörd kiçik oval güzgü
     məkan     → oval qızılı çərçivədə xəritə
     proqram   → qızılı xətt boyunca parıltılar
     masa      → güzgüdə həkk olunmuş rəqəm
   Şriftlər: Noto Serif Display (başlıq) · EB Garamond (mətn) — Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('mirror-candle')
const ID = 'mirror-candle'
const ON_MIRROR = '#3B2C14'

const LABELS = {
  countdown: { title: { az: 'Şamlar yanana qədər', en: 'Until the candles glow', ru: 'Пока не зажгутся свечи' } },
  venue:     { title: { az: 'İşığın yeri', en: 'Where the light gathers', ru: 'Где собирается свет' } },
  program:   { title: { az: 'Gecənin işıqları', en: 'Lights of the evening', ru: 'Огни вечера' } },
  dresscode: { title: { az: 'Güzgüyə yaraşan', en: 'Worthy of the mirror', ru: 'Достойно зеркала' } },
  seating:   { title: { az: 'Güzgüdə yeriniz', en: 'Your place in the mirror', ru: 'Ваше место в зеркале' } },
  gallery:   { title: { az: 'Əks olunan anlar', en: 'Reflected moments', ru: 'Отражённые мгновения' } },
  rsvp:      { title: { az: 'Gələcəksinizmi?', en: 'Will you be there?', ru: 'Вы будете?' } },
  guestbook: { title: { az: 'İşıqlı arzular', en: 'Bright wishes', ru: 'Светлые пожелания' } },
}
const TXT = {
  az: { table: 'Masa' },
  en: { table: 'Table' },
  ru: { table: 'Стол' },
}

const KEYFRAMES = `
@keyframes mc-flame { from { transform: scaleY(.88) rotate(-2deg) } to { transform: scaleY(1.1) rotate(2deg) } }
@keyframes mc-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes mc-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes mc-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes mc-twinkle { 0%,100% { opacity: .35; transform: scale(.8) } 50% { opacity: 1; transform: scale(1) } }
[data-mc] span[aria-hidden="true"], [data-mc] svg[aria-hidden="true"], [data-mc] div[aria-hidden="true"] { pointer-events: none; }
[data-mc] ::placeholder { color: rgba(244,236,221,.42); }
[data-mc] input:focus-visible, [data-mc] textarea:focus-visible { border-color: ${C.GOLD} !important; outline: none; }
[data-mc] button:focus-visible, [data-mc] a:focus-visible, [data-mc] [role="button"]:focus-visible { outline: 2px solid ${C.GOLD_L}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-mc] *, [data-mc] { animation: none !important; transition: none !important; } }
`

/* ═══ 01 — AÇILIŞ: şamlar alışır, güzgü işıqlanır ═══ */
function MirrorOpening({ inv, theme }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  const ink = go ? ON_MIRROR : C.GOLD_L
  return (
    <motion.div {...gate.gateProps} data-mc
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: `radial-gradient(60% 40% at 50% 46%, #241C16, ${C.NIGHT} 75%)`, color: C.IVORY, fontFamily: theme.fonts.body }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 45% at 50% 48%, rgba(255,196,110,.28), transparent 72%)', opacity: go ? 1 : 0, transition: 'opacity 1s ease .25s' }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 14px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 'clamp(4px, 2vw, 14px)', animation: 'mc-rise 1s ease-out .15s both' }}>
          <Candlestick h={64} lit={go} delay={0.05} style={{ marginBottom: 6 }} />
          <Mirror width="min(58vw, 236px)" lit={go} glintKey={go ? 'on' : 'off'}>
            <EmblemSlot mono={ot.mono} size={40} border={`1px solid ${alpha(ink, 0.5)}`} background="transparent" color={ink} font={head} style={{ animation: 'none', margin: '0 auto 8px', transition: 'color .8s' }}>
              <Glint size={16} color={go ? C.GOLD_D : C.GOLD_L} style={{ display: 'block', margin: '0 auto', transition: 'background .8s' }} />
            </EmblemSlot>
            {ot.show('kicker') && <div style={{ fontFamily: head, fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: ink, transition: 'color .8s ease .4s' }}>{ot.text('kicker')}</div>}
            {titleOv !== '' && (
              <div style={{ marginTop: 6, fontFamily: head, fontWeight: 300, fontSize: 'clamp(30px, 9vw, 40px)', lineHeight: 1.08, color: ink, transition: 'color .8s ease .4s', overflowWrap: 'anywhere' }}>
                {first}{second && <><span style={{ display: 'block', fontStyle: 'italic', fontSize: '.55em' }}>&amp;</span>{second}</>}
              </div>
            )}
          </Mirror>
          <Candlestick h={64} lit={go} delay={0.25} style={{ marginBottom: 6 }} />
        </div>
        {ot.show('meta') && <div style={{ marginTop: 22, fontFamily: head, fontWeight: 300, fontSize: 17, letterSpacing: '.04em', color: alpha(C.IVORY, 0.8), animation: 'mc-rise .9s ease-out .5s both' }}>{ot.text('meta')}</div>}
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.3 }} style={{ marginTop: 22, textAlign: 'center' }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, border: `1px solid ${C.GOLD}`, color: C.GOLD_L, fontFamily: head, fontWeight: 300, fontSize: 18, letterSpacing: '.03em', boxShadow: `inset 0 0 18px ${alpha(C.GOLD, 0.15)}`, animation: 'mc-rise .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 10, fontSize: 14, color: C.FAINT, animation: 'mc-fade .8s ease-out 1.1s both, mc-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, alt = false }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: alt ? `radial-gradient(70% 40% at 50% 0%, rgba(224,184,100,.08), transparent 70%), ${C.PANEL}` : GLOW_BG, color: C.IVORY }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 34 }}>
            <GiltRule width={200} />
            {title && <h2 style={{ margin: '16px 0 0', fontFamily: head, fontWeight: 300, fontSize: 'clamp(29px, 8.4vw, 38px)', lineHeight: 1.15, color: C.GOLD_L, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontSize: 16.5, fontStyle: 'italic', color: C.MUTED }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 340, fontSize: 16.5, color: C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: alpha('#000000', 0.28), border: `1px solid ${alpha(C.GOLD, 0.35)}`, borderRadius: 2,
  padding: '14px 16px', fontSize: 17, color: C.IVORY, outline: 'none',
}
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 16.5, textDecoration: 'none', cursor: 'pointer', letterSpacing: '.02em',
  background: on ? GILT_BAR : 'transparent', color: on ? '#2A1E0C' : C.GOLD_L, border: `1px solid ${on ? '#B8913F' : alpha(C.GOLD, 0.5)}`,
})
const suggest = { bg: C.NIGHT_L, border: `1px solid ${alpha(C.GOLD, 0.3)}`, active: alpha(C.GOLD, 0.16), text: C.IVORY, table: C.GOLD_L, radius: 2 }

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function MirrorCandleTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = TXT[lang] || TXT.az
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} & ${inv.bride}` : inv.single)

  return (
    <div data-mc lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.NIGHT, minHeight: '100vh', fontFamily: body, color: C.IVORY, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.GOLD, 0.3),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <MirrorOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: GILT_BAR, border: '1px solid #6E5220', boxShadow: '0 8px 22px rgba(0,0,0,.55)' }}>
        {({ playing }) => <EqBars playing={playing} color="#2A1E0C" idle={alpha('#2A1E0C', 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.NIGHT, 0.9), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.GOLD, 0.28)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 15.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontStyle: 'italic', fontWeight: 300, fontSize: 20, color: C.GOLD_L }}>Digitoy</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — güzgü və şamlar */}
          <section style={{ position: 'relative', overflow: 'hidden', background: `radial-gradient(55% 35% at 50% 42%, rgba(255,196,110,.20), transparent 72%), ${GLOW_BG}`, padding: '70px 14px 56px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 'clamp(4px, 2vw, 14px)' }}>
              <Candlestick h={70} style={{ marginBottom: 8 }} />
              <Mirror width="min(60vw, 250px)" glintKey="hero">
                <div style={{ fontFamily: head, fontStyle: 'italic', fontWeight: 300, fontSize: 17, color: ON_MIRROR }}>{L('hero', 'kicker', inv.eventLabel)}</div>
                <h1 style={{ margin: '6px 0 0', fontFamily: head, fontWeight: 300, fontSize: nameSize(heroName), lineHeight: 1.05, color: ON_MIRROR, overflowWrap: 'anywhere' }}>{heroName}</h1>
              </Mirror>
              <Candlestick h={70} style={{ marginBottom: 8 }} />
            </div>
            <GiltRule width={220} style={{ marginTop: 28 }} />
            <div style={{ marginTop: 18, fontFamily: head, fontWeight: 300, fontSize: 'clamp(22px, 6.4vw, 28px)', color: C.GOLD_L }}>{inv.fullDate}</div>
            <div style={{ marginTop: 6, fontSize: 17, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 16, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <p style={{ margin: '18px auto 0', maxWidth: 330, fontStyle: 'italic', fontSize: 19, lineHeight: 1.55, color: alpha(C.IVORY, 0.82) }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — kiçik güzgülər */}
          {S.countdown && (
            <Panel head={head} alt title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <Mirror width="100%" ratio={1.3} crest={false} glintKey={l} inner={{ boxShadow: 'inset 0 0 0 1px rgba(60,40,10,.6)' }}>
                      <span style={{ fontFamily: head, fontWeight: 300, fontSize: 'clamp(22px, 6.6vw, 30px)', lineHeight: 1, color: ON_MIRROR, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                    </Mirror>
                    <div style={{ marginTop: 10, fontSize: 14.5, fontStyle: 'italic', color: C.MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN — oval çərçivə */}
          {S.venue && (
            <Panel head={head} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ width: 'min(84vw, 340px)', margin: '0 auto', padding: 12, borderRadius: '50%', background: GILT, boxShadow: '0 30px 50px -24px rgba(0,0,0,.85)' }}>
                <div style={{ borderRadius: '50%', overflow: 'hidden', isolation: 'isolate', boxShadow: 'inset 0 0 0 2px rgba(60,40,10,.6)' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.GOLD_D} height="min(104vw, 400px)"
                    map={{ opacity: 0.8, filter: 'sepia(.5) saturate(.7) brightness(.95)', tintOpacity: 0.2, tint: '#8C6A2A', blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'min(104vw, 400px)', position: 'relative', background: 'radial-gradient(80% 70% at 40% 30%, #FFF6E2, #D9C7A6 40%, #8F826E)' }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 26, fontFamily: head, fontWeight: 300, fontSize: 27, lineHeight: 1.2, color: C.IVORY }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 16.5, fontStyle: 'italic', color: C.MUTED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn} />
            </Panel>
          )}

          {/* PROQRAM — qızılı xətt */}
          {S.program && (
            <Panel head={head} alt title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ position: 'relative', maxWidth: 380, margin: '0 auto' }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 6, bottom: 6, width: 1, background: `linear-gradient(180deg, transparent, ${C.GOLD} 12%, ${C.GOLD} 88%, transparent)` }} />
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 30px minmax(0, 1fr)', alignItems: 'center', padding: '14px 0' }}>
                    <div style={{ textAlign: 'right', fontFamily: head, fontWeight: 300, fontSize: 22, color: C.GOLD_L, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}><Glint size={16} style={{ animation: `mc-twinkle 3s ease-in-out ${i * 0.4}s infinite` }} /></div>
                    <div style={{ fontSize: 17.5, lineHeight: 1.35, color: C.IVORY }}>{ev.label}</div>
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

          {/* MASA — güzgüdə rəqəm */}
          {S.seating && !seating.isEmpty && (
            <Panel head={head} alt title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="mc-seat-list" field={field} suggest={suggest} font={body} muted={C.MUTED} accent={C.GOLD_L}
                nameStyle={{ fontFamily: head, fontWeight: 300, fontSize: 26 }}
                card={(num) => (
                  <div style={{ marginTop: 24 }}>
                    <Mirror width={170} ratio={1.3} glintKey={num}>
                      <span style={{ fontSize: 14, letterSpacing: '.24em', textTransform: 'uppercase', color: ON_MIRROR }}>{T.table}</span>
                      <span style={{ fontFamily: head, fontWeight: 300, fontSize: tableSize(num, 64), lineHeight: 1, color: ON_MIRROR }}>{num}</span>
                    </Mirror>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR — oval çərçivələr */}
          {S.gallery && (
            <Panel id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, marginBottom: 32 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ aspectRatio: '3 / 4', overflow: 'hidden', borderRadius: '50%', background: C.NIGHT_L, border: '5px solid #C9A04C', boxShadow: '0 0 0 1px #F6DFA0, 0 16px 24px -12px rgba(0,0,0,.8)' }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg="#2A1E0C" bg="#FFF8EA" frame={{ borderRadius: 4, boxShadow: '0 0 0 5px #C9A04C, 0 0 0 6px #F6DFA0' }}
                btn={btn} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'night')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel head={head} alt title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.IVORY, muted: C.MUTED, line: alpha(C.GOLD, 0.45), hair: alpha(C.GOLD, 0.2), accent: C.GOLD_L,
                font: body, display: head, btnFont: body,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Glint size={26} /></div>,
                marker: (a) => (a ? <Glint size={14} /> : <span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', border: `1px solid ${alpha(C.GOLD, 0.5)}` }} />),
                suggest: { ...suggest, font: body },
              }} />
            </Panel>
          )}

          {/* ARZULAR */}
          {S.guestbook && (
            <Panel head={head} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field} btn={btn} errorColor={C.GOLD_L} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, position: 'relative', padding: '20px 20px 18px', background: alpha('#000000', 0.22), border: `1px solid ${alpha(C.GOLD, 0.3)}`, borderRadius: 2 }}>
                      <Glint size={12} style={{ position: 'absolute', right: 16, top: 16 }} />
                      <blockquote style={{ margin: 0, paddingRight: 16, fontFamily: head, fontStyle: 'italic', fontWeight: 300, fontSize: 19, lineHeight: 1.5, color: C.IVORY }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 10, fontSize: 15, letterSpacing: '.04em', color: C.GOLD }}>{msg.name}{msg.date ? <span style={{ color: C.FAINT }}> · {gbook.formatDate(msg.date)}</span> : null}</figcaption>
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
      <span style={{ position: 'absolute', left: -22, top: -90 }}><Candlestick h={30} /></span>
    </span>
  )
}
