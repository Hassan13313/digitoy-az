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
import { C, NIGHT_BG, PAPER_BG, MACARONS, nameSize } from './palette'
import { EiffelTower, Macaron, HatBox, Bow, Awning, Postmark, Rooftops } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   PARIS NIGHT — «Paris gecəsi» (Qız gecəsi konsepti, 2026-10)

   Konsept: Parisdə bir gecə — Eyfel qülləsi, zolaqlı şlyapa qutusu,
   pastel makaronlar, kafe tentləri. Açılışda gecə səmasında qızılı qüllə
   və fiyonklu qutu; toxunanda qapaq uçur, qutudan makaronlar çıxır, qüllə
   saat başı olduğu kimi parıldamağa başlayır. Daxildə: makaron sayğac,
   bistro menyusu kimi proqram, şirniyyat qutusunda masa, açıqcalarda şəkillər.
   Şriftlər: Alumni Sans Pinstripe (başlıq) · Comforter Brush (yazı) ·
   Ysabeau Office (mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('paris-night')
const ID = 'paris-night'
const SCRIPT = "'Comforter Brush', 'Caveat', cursive"

const LABELS = {
  countdown: { title: { az: 'Parisə qədər', en: 'Until Paris', ru: 'До Парижа' } },
  venue:     { title: { az: 'Görüş yeri', en: 'Rendez-vous', ru: 'Место встречи' } },
  program:   { title: { az: 'Gecənin menyusu', en: 'Tonight’s menu', ru: 'Меню вечера' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Masan hazırdır', en: 'Your table', ru: 'Твой стол' } },
  gallery:   { title: { az: 'Paris xatirələri', en: 'Paris memories', ru: 'Парижские снимки' } },
  rsvp:      { title: { az: 'Gəlirsən?', en: 'Will you come?', ru: 'Придёшь?' } },
  guestbook: { title: { az: 'Gəlinə məktublar', en: 'Letters to the bride', ru: 'Письма невесте' } },
}
const TXT = {
  az: { table: 'Masa', ooh: 'Ooh là là!', menu: 'Menyu' },
  en: { table: 'Table', ooh: 'Ooh là là!', menu: 'Menu' },
  ru: { table: 'Стол', ooh: 'Ooh là là!', menu: 'Меню' },
}

const KEYFRAMES = `
@keyframes pn-in { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes pn-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes pn-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes pn-sparkle { 0%,100% { opacity: 0; transform: scale(.4) } 50% { opacity: 1; transform: scale(1.3) } }
@keyframes pn-beam { 0% { transform: rotate(-38deg) } 50% { transform: rotate(38deg) } 100% { transform: rotate(-38deg) } }
[data-pn] span[aria-hidden="true"], [data-pn] svg[aria-hidden="true"], [data-pn] div[aria-hidden="true"] { pointer-events: none; }
[data-pn] svg circle { transform-box: fill-box; transform-origin: center; }
[data-pn] ::placeholder { color: rgba(119,108,132,.7); }
[data-pn] [data-dark] ::placeholder { color: rgba(247,214,220,.5); }
[data-pn] input:focus-visible, [data-pn] textarea:focus-visible { border-color: ${C.ROSE} !important; outline: none; }
[data-pn] button:focus-visible, [data-pn] a:focus-visible, [data-pn] [role="button"]:focus-visible { outline: 2px solid ${C.GOLD}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-pn] *, [data-pn] { animation: none !important; transition: none !important; } }
`

/* ═══ 01 — AÇILIŞ: şlyapa qutusu ═══ */
function HatboxOpening({ inv, theme }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-pn
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: NIGHT_BG, color: '#FFFFFF', fontFamily: theme.fonts.body }}>
      <div aria-hidden="true" style={{ position: 'absolute', right: '-9vw', bottom: 24, opacity: 0.7 }}>
        {go && <span style={{ position: 'absolute', left: '50%', top: 4, width: 0, height: 0, transformOrigin: '0 0', animation: 'pn-beam 3s ease-in-out infinite' }}><span style={{ position: 'absolute', left: -60, top: -520, width: 120, height: 520, background: 'linear-gradient(0deg, rgba(255,243,214,.28), transparent)', clipPath: 'polygon(48% 100%, 52% 100%, 100% 0, 0 0)' }} /></span>}
        <EiffelTower height="min(50vh, 400px)" sparkle={go} />
      </div>
      <Rooftops style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ animation: 'pn-in 1s ease-out .2s both' }}>
          {ot.show('kicker') && <div style={{ fontFamily: SCRIPT, fontSize: 40, lineHeight: 1, color: C.ROSE }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 6, fontFamily: head, fontSize: 'clamp(58px, 18vw, 84px)', lineHeight: 1, textTransform: 'uppercase', letterSpacing: '.04em', overflowWrap: 'anywhere', color: C.GOLD, textShadow: '0 0 18px rgba(225,188,120,.35)' }}>
              {first}{second && <> &amp; {second}</>}
            </div>
          )}
        </div>
        <div style={{ position: 'relative', marginTop: 34 }}>
          <HatBox width={210} open={go} />
          <div style={{ position: 'absolute', left: '50%', top: 210 * 0.48, transform: 'translateX(-50%)', opacity: go ? 0 : 1, transition: 'opacity .3s' }}>
            <EmblemSlot mono={ot.mono} size={50} border={`1.5px solid ${C.GOLD}`} background={C.INK} color={C.GOLD} font={head} style={{ animation: 'none', margin: 0 }}>
              <span aria-hidden="true" />
            </EmblemSlot>
          </div>
        </div>
        <div style={{ marginTop: 8, minHeight: 44, animation: 'pn-in 1s ease-out .35s both' }}>
          {go
            ? <div style={{ fontFamily: SCRIPT, fontSize: 42, lineHeight: 1, color: C.ROSE, animation: 'pn-in .4s ease-out .6s both' }}>Ooh là là!</div>
            : ot.show('meta') && <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '.06em', color: C.BLUSH }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.25 }} style={{ marginTop: 12 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: C.BLUSH, color: C.INK, fontSize: 16, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', boxShadow: `0 0 0 1px ${C.GOLD}, 0 0 0 5px rgba(225,188,120,.18)`, animation: 'pn-in .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 14, fontSize: 14.5, color: alpha(C.BLUSH, 0.75), animation: 'pn-fade .8s ease-out 1.1s both, pn-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dark = false }) {
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '62px 20px 70px', overflow: 'hidden', background: dark ? NIGHT_BG : PAPER_BG, color: dark ? C.BLUSH : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <EiffelTower height={46} glow={dark} color={dark ? C.GOLD : C.GOLD_D} style={{ margin: '0 auto 10px' }} />
            {kicker && <div style={{ fontFamily: SCRIPT, fontSize: 32, lineHeight: 1, color: dark ? C.ROSE : C.ROSE_D }}>{kicker}</div>}
            {title && <h2 style={{ margin: '4px 0 0', fontFamily: head, fontWeight: 400, fontSize: 'clamp(42px, 12.6vw, 58px)', lineHeight: 1, letterSpacing: '.04em', textTransform: 'uppercase', textWrap: 'balance', color: dark ? C.GOLD : C.INK }}>{title}</h2>}
            {sub && <p style={{ margin: '12px auto 0', maxWidth: 340, fontSize: 16.5, color: dark ? alpha(C.BLUSH, 0.8) : C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: '#FFFFFF', border: `1.5px solid ${C.LINE}`, borderRadius: 14,
  padding: '14px 16px', fontSize: 16.5, color: C.INK, outline: 'none',
}
const darkField = { ...field, background: alpha('#FFFFFF', 0.08), border: `1.5px solid ${alpha(C.GOLD, 0.4)}`, color: '#FFFFFF' }
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 14.5, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', textDecoration: 'none', cursor: 'pointer',
  background: on ? C.INK : '#FFFFFF', color: on ? C.BLUSH : C.INK, border: `1.5px solid ${on ? C.INK : C.LINE}`,
})
const darkBtn = (on) => ({ ...btn(on), background: on ? C.BLUSH : 'transparent', color: on ? C.INK : C.BLUSH, border: `1.5px solid ${on ? C.BLUSH : alpha(C.GOLD, 0.5)}` })
const suggest = { bg: '#FFFFFF', border: `1.5px solid ${C.LINE}`, active: alpha(C.BLUSH, 0.6), text: C.INK, table: C.ROSE_D, radius: 14 }

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function ParisNightTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = TXT[lang] || TXT.az
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} & ${inv.bride}` : inv.single)

  return (
    <div data-pn lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.PAPER, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.GOLD, 0.5),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <HatboxOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.INK, border: `1.5px solid ${C.GOLD}`, boxShadow: '0 10px 22px rgba(21,25,53,.4)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.GOLD} idle={alpha(C.GOLD, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.NIGHT, 0.9), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.GOLD, 0.3)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.BLUSH, fontSize: 15.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontSize: 28, letterSpacing: '.08em', textTransform: 'uppercase', color: C.GOLD }}>Digitoy</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — gecə Parisi */}
          <section style={{ position: 'relative', overflow: 'hidden', background: NIGHT_BG, padding: '26px 22px 0', textAlign: 'center', color: C.BLUSH }}>
            <span aria-hidden="true" style={{ position: 'absolute', left: '14%', top: 40, width: 40, height: 40, borderRadius: '50%', boxShadow: `-9px 4px 0 0 ${C.MOON}`, transform: 'rotate(-20deg)' }} />
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <EiffelTower height="min(74vw, 300px)" sparkle />
            </div>
            <Rooftops style={{ position: 'relative', marginTop: -30, marginLeft: -22, width: 'calc(100% + 44px)' }} />
            <div style={{ position: 'relative', margin: '0 -22px', padding: '26px 22px 60px', background: 'linear-gradient(180deg, #0B0E22, #1C2140)' }}>
              <div style={{ fontFamily: SCRIPT, fontSize: 38, lineHeight: 1, color: C.ROSE }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              <h1 style={{ margin: '6px 0 0', fontFamily: head, fontWeight: 400, fontSize: nameSize(heroName), lineHeight: 1, letterSpacing: '.04em', textTransform: 'uppercase', overflowWrap: 'anywhere', color: C.GOLD, textShadow: '0 0 20px rgba(225,188,120,.35)', animation: 'pn-in 1s ease-out .2s both' }}>{heroName}</h1>
              <div style={{ marginTop: 6, fontFamily: SCRIPT, fontSize: 34, lineHeight: 1, color: C.BLUSH }}>{T.ooh}</div>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 8, fontSize: 15.5, color: alpha(C.BLUSH, 0.8) }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 20 }}>
                <span aria-hidden="true" style={{ width: 34, height: 1, background: C.GOLD }} />
                <span style={{ fontSize: 'clamp(18px, 5vw, 21px)', fontWeight: 600, letterSpacing: '.08em', color: '#FFFFFF' }}>{inv.fullDate}</span>
                <span aria-hidden="true" style={{ width: 34, height: 1, background: C.GOLD }} />
              </div>
              <div style={{ marginTop: 6, fontSize: 16, color: alpha(C.BLUSH, 0.8) }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
              <p style={{ margin: '18px auto 0', maxWidth: 330, fontSize: 17, lineHeight: 1.6, color: C.BLUSH }}>{tr.inv_join}</p>
            </div>
          </section>

          {/* SAYĞAC — makaronlar */}
          {S.countdown && (
            <Panel head={head} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Macaron size="100%" color={MACARONS[i]}>
                      <span style={{ fontSize: 'clamp(22px, 6.6vw, 30px)', fontWeight: 600, lineHeight: 1, color: C.INK, fontVariantNumeric: 'tabular-nums lining-nums' }}><PopDigit value={v} pop={pop} /></span>
                    </Macaron>
                    <div style={{ marginTop: 10, fontSize: 12, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: C.MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN — qızılı çərçivə */}
          {S.venue && (
            <Panel head={head} dark title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: 6, border: `1px solid ${C.GOLD}`, borderRadius: 4 }}>
                <div style={{ padding: 6, border: `3px double ${alpha(C.GOLD, 0.8)}`, borderRadius: 2 }}>
                  <div style={{ overflow: 'hidden', isolation: 'isolate' }}>
                    <MapSection
                      weddingData={weddingData} theme={theme} accent={C.ROSE_D} height="clamp(240px, 66vw, 300px)"
                      map={{ opacity: 0.9, filter: 'saturate(.6) contrast(1.05)', tintOpacity: 0.2, tint: C.BLUSH, blend: 'multiply' }}
                      frame={<MapPin />}
                      fallback={<div style={{ height: 'clamp(240px, 66vw, 300px)', position: 'relative', background: C.NIGHT_L }}><MapPin /></div>}
                    />
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontSize: 40, lineHeight: 1.05, letterSpacing: '.04em', textTransform: 'uppercase', color: '#FFFFFF' }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontFamily: SCRIPT, fontSize: 30, lineHeight: 1.1, color: C.ROSE }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={darkBtn} />
            </Panel>
          )}

          {/* PROQRAM — bistro menyusu */}
          {S.program && (
            <Panel head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 420, margin: '0 auto', borderRadius: '0 0 18px 18px', background: '#FFFFFF', boxShadow: '0 22px 34px -24px rgba(28,33,64,.5)', overflow: 'hidden' }}>
                <Awning />
                <div style={{ padding: '14px 22px 26px' }}>
                  <div style={{ textAlign: 'center', fontFamily: SCRIPT, fontSize: 34, lineHeight: 1, color: C.ROSE_D }}>{T.menu}</div>
                  <div style={{ display: 'grid', gap: 2, marginTop: 10 }}>
                    {timeline.events.map((ev, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '10px 0' }}>
                        <span style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.3, color: C.INK, minWidth: 0 }}>{ev.label}</span>
                        <span aria-hidden="true" style={{ flex: 1, minWidth: 18, borderBottom: `2px dotted ${C.ROSE}`, transform: 'translateY(-4px)' }} />
                        <span style={{ fontSize: 17, fontWeight: 600, color: C.GOLD_D, fontVariantNumeric: 'tabular-nums lining-nums' }}>{ev.time}</span>
                      </div>
                    ))}
                  </div>
                  <Bow size={44} color={C.ROSE} style={{ margin: '14px auto 0' }} />
                </div>
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel head={head} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={body} align="center" />
            </Panel>
          )}

          {/* MASA — şirniyyat qutusu */}
          {S.seating && !seating.isEmpty && (
            <Panel head={head} dark title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="pn-seat-list" field={darkField} suggest={suggest} font={body} muted={alpha(C.BLUSH, 0.8)} accent={C.ROSE}
                nameStyle={{ fontFamily: head, fontSize: 38, letterSpacing: '.04em', textTransform: 'uppercase', color: C.GOLD }}
                card={(num) => (
                  <div style={{ position: 'relative', maxWidth: 280, margin: '22px auto 0', aspectRatio: '1', borderRadius: 10, background: `linear-gradient(135deg, #F9C6D2, ${C.ROSE})`, boxShadow: 'inset 0 0 0 6px rgba(255,255,255,.35), 0 26px 40px -20px rgba(0,0,0,.7)' }}>
                    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 16, marginLeft: -8, background: `linear-gradient(90deg, ${C.GOLD_D}, ${C.GOLD}, ${C.GOLD_D})` }} />
                    <span aria-hidden="true" style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 16, marginTop: -8, background: `linear-gradient(180deg, ${C.GOLD_D}, ${C.GOLD}, ${C.GOLD_D})` }} />
                    <div style={{ position: 'absolute', left: '50%', top: '50%', width: '58%', aspectRatio: '1', transform: 'translate(-50%, -50%)', borderRadius: '50%', background: C.PAPER, border: `2px solid ${C.GOLD}`, boxShadow: `0 0 0 5px ${C.PAPER}, 0 0 0 6px ${C.GOLD}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: SCRIPT, fontSize: 30, lineHeight: 1, color: C.ROSE_D }}>{T.table}{' '}</span>
                      <span style={{ fontFamily: head, fontSize: tableSize(num, 72), lineHeight: 0.9, color: C.INK }}>{num}</span>
                    </div>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR — açıqcalar */}
          {S.gallery && (
            <Panel id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 18, marginBottom: 32 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ position: 'relative', aspectRatio: '4 / 5', padding: 8, background: '#FFFFFF', transform: `rotate(${i % 2 ? 2.2 : -2}deg)`, boxShadow: '0 14px 20px -14px rgba(28,33,64,.5)' }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      {i % 2 === 0 && <Postmark size={34} style={{ position: 'absolute', right: -6, top: -8, opacity: 0.85 }} />}
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.INK} bg="#FFFFFF" frame={{ borderRadius: 12, border: `1.5px solid ${C.ROSE}` }}
                btn={btn} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'night')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: C.LINE, hair: alpha(C.LINE, 0.8), accent: C.ROSE_D,
                font: body, display: head, displayItalic: false, btnFont: body,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Macaron size={70} color={C.ROSE} /></div>,
                marker: (a) => (a ? <Macaron size={20} color={C.ROSE} /> : <span style={{ display: 'block', width: 16, height: 16, borderRadius: '50%', border: `1.5px solid ${C.ROSE}` }} />),
                suggest: { ...suggest, font: body },
              }} />
            </Panel>
          )}

          {/* MƏKTUBLAR */}
          {S.guestbook && (
            <Panel head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField} btn={darkBtn} errorColor={C.ROSE} />
              <div style={{ display: 'grid', gap: 18 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ position: 'relative', margin: 0, padding: '22px 20px 14px', background: C.PAPER, color: C.INK, borderRadius: 4, transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)`, boxShadow: '0 16px 24px -16px rgba(0,0,0,.6)' }}>
                      <Bow size={36} color={MACARONS[i % 4]} style={{ position: 'absolute', left: '50%', top: -10, marginLeft: -18 }} />
                      <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.55 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: SCRIPT, fontSize: 30, lineHeight: 1, color: C.ROSE_D }}>{msg.name}</span>
                        {msg.date ? <span style={{ fontSize: 13, color: C.MUTED }}>{gbook.formatDate(msg.date)}</span> : null}
                      </figcaption>
                    </figure>
                  )
                })}
              </div>
            </Panel>
          )}

          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={body} />
        </motion.div>
      )}
    </div>
  )
}

function MapPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -20, top: -30, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.35))' }}><Macaron size={40} color={C.ROSE} /></span>
    </span>
  )
}
