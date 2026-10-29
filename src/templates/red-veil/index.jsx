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
import { C, VELVET_BG, VEIL_PATTERN, IVORY_PATTERN, nameSize } from './palette'
import { Buta, ButaRule, Tassel, EmbroideryBand, VeilDrape, Candle } from './art'

/* ─────────────────────────────────────────────────────────────────────────────
   RED VEIL — «Qırmızı örpək» (Xına gecəsi konsepti, 2026-10)

   Konsept: xına gecəsində gəlinin başına örtülən qırmızı məxmər örpək —
   qızılı tikmə, buta naxışı, ətəkdə qotazlar. Açılışda bütün ekran örpəkdir;
   toxunanda örpək yuxarı qalxır və altından şam işığı görünür. Daxildə:
     hero      → yuxarıdan asılan örpək qıvrımı, ad Great Vibes ilə
     sayğac    → qızılı tikmə rozetlər məxmər üzərində
     proqram   → tikmə xətti boyunca butalar
     masa      → məxmər kisə, qızılı rəqəm, qotazlar
     fotolar   → mehrab tağı çərçivələr
   Şriftlər: Cormorant Garamond (başlıq) · Lora (mətn) · Great Vibes (yazı) —
   hamısında Ə və kiril var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('red-veil')
const ID = 'red-veil'
const SCRIPT = "'Great Vibes', 'Cormorant Garamond', Georgia, cursive"

const LABELS = {
  countdown: { title: { az: 'Xına gecəsinə qədər', en: 'Until the henna night', ru: 'До вечера хны' } },
  venue:     { title: { az: 'Gecənin ünvanı', en: 'Where we gather', ru: 'Где мы соберёмся' } },
  program:   { title: { az: 'Gecənin ahəngi', en: 'The evening', ru: 'Ход вечера' } },
  dresscode: { title: { az: 'Gecənin libası', en: 'Evening attire', ru: 'Наряд вечера' } },
  seating:   { title: { az: 'Yeriniz hazırdır', en: 'Your seat awaits', ru: 'Ваше место готово' } },
  gallery:   { title: { az: 'Gecənin xatirələri', en: 'Memories of the night', ru: 'Воспоминания вечера' } },
  rsvp:      { title: { az: 'Gələcəksinizmi?', en: 'Will you join us?', ru: 'Вы придёте?' } },
  guestbook: { title: { az: 'Gəlinə xoş sözlər', en: 'Kind words for the bride', ru: 'Тёплые слова невесте' } },
}
const TXT = {
  az: { table: 'Masa' },
  en: { table: 'Table' },
  ru: { table: 'Стол' },
}

const KEYFRAMES = `
@keyframes rv-swing { 0%,100% { transform: translateX(-50%) rotate(-4deg) } 50% { transform: translateX(-50%) rotate(4deg) } }
@keyframes rv-flame { from { transform: scaleY(.88) rotate(-2deg) } to { transform: scaleY(1.1) rotate(2deg) } }
@keyframes rv-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes rv-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes rv-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes rv-glow { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
@keyframes rv-seal { 0% { transform: scale(.6); opacity: 0 } 70% { transform: scale(1.04) } 100% { transform: scale(1); opacity: 1 } }
[data-rv] span[aria-hidden="true"], [data-rv] svg[aria-hidden="true"], [data-rv] div[aria-hidden="true"] { pointer-events: none; }
[data-rv] ::placeholder { color: rgba(118,82,76,.6); }
[data-rv] input:focus-visible, [data-rv] textarea:focus-visible { border-color: ${C.CRIMSON} !important; outline: none; }
[data-rv] button:focus-visible, [data-rv] a:focus-visible, [data-rv] [role="button"]:focus-visible { outline: 2px solid ${C.GOLD}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-rv] *, [data-rv] { animation: none !important; transition: none !important; } }
`

/* ═══ 01 — AÇILIŞ: örpək qalxır ═══ */
function VeilOpening({ inv, theme }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-rv
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.7 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: 'radial-gradient(circle at 50% 46%, #FFF5E3 0%, #F4DDBE 45%, #C99A68 100%)', color: C.IVORY, fontFamily: theme.fonts.body }}>
      {/* örpəyin altı — şam işığı */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28 }}>
          <Candle h={54} />
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', inset: -40, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,214,140,.7), transparent 66%)', animation: 'rv-glow 2.4s ease-in-out infinite' }} />
            <Buta size={70} color={C.GOLD_D} fill={alpha(C.GOLD_L, 0.55)} />
          </div>
          <Candle h={54} />
        </div>
      </div>

      {/* örpək */}
      <div style={{
        position: 'absolute', inset: '0 0 -6% 0', display: 'flex', flexDirection: 'column',
        transform: go ? 'translateY(-112%)' : 'none',
        borderRadius: go ? '0 0 50% 50% / 0 0 18% 18%' : '0',
        transition: 'transform 1.35s cubic-bezier(.6,.02,.3,1) .1s, border-radius 1.1s ease .1s',
        boxShadow: '0 30px 60px rgba(40,4,10,.55)',
      }}>
        <div style={{ position: 'relative', flex: 1, background: `${VEIL_PATTERN}, ${VELVET_BG}`, backgroundSize: '64px 80px, auto, auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 8vh', textAlign: 'center' }}>
          <div style={{ position: 'relative', padding: '34px 22px 28px', width: 'min(84vw, 330px)', border: `1px solid ${alpha(C.GOLD, 0.7)}`, outline: `1px dashed ${alpha(C.GOLD_L, 0.55)}`, outlineOffset: -9, borderRadius: '160px 160px 14px 14px', background: 'radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,.07), rgba(0,0,0,.18))', animation: 'rv-rise 1s ease-out .2s both' }}>
            <EmblemSlot mono={ot.mono} size={58} border={`1px solid ${alpha(C.GOLD, 0.8)}`} background="rgba(62,9,17,.5)" color={C.GOLD_L} font={head} style={{ animation: 'none', margin: '0 auto 12px' }}>
              <Buta size={22} color={C.GOLD_L} style={{ margin: '0 auto' }} />
            </EmblemSlot>
            {ot.show('kicker') && <div style={{ fontFamily: head, fontSize: 14, letterSpacing: '.32em', textTransform: 'uppercase', color: C.GOLD_L }}>{ot.text('kicker')}</div>}
            {titleOv !== '' && (
              <div style={{ marginTop: 10, fontFamily: SCRIPT, fontSize: 'clamp(46px, 14vw, 64px)', lineHeight: 1.05, color: '#FFF3E0', textShadow: '0 2px 18px rgba(0,0,0,.35)', overflowWrap: 'anywhere' }}>
                {first}{second && <><span style={{ display: 'block', fontSize: '.5em', color: C.GOLD_L }}>&amp;</span>{second}</>}
              </div>
            )}
            <ButaRule color={alpha(C.GOLD_L, 0.85)} width={180} style={{ marginTop: 14 }} />
            {ot.show('meta') && <div style={{ marginTop: 12, fontFamily: head, fontSize: 17, color: alpha('#FFF3E0', 0.88) }}>{ot.text('meta')}</div>}
          </div>
          <motion.div animate={go ? { opacity: 0 } : {}} transition={{ duration: 0.25 }} style={{ marginTop: 30 }}>
            {ot.show('cta') && (
              <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, border: `1px solid ${C.GOLD}`, background: 'rgba(62,9,17,.45)', color: C.GOLD_L, fontFamily: head, fontWeight: 500, fontSize: 19, letterSpacing: '.04em', animation: 'rv-rise .8s ease-out .8s both' }}>
                {ot.text('cta')}
              </div>
            )}
            {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 13.5, color: alpha('#FFF3E0', 0.7), animation: 'rv-fade .8s ease-out 1.1s both, rv-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
          </motion.div>
        </div>
        {/* ətək: tikmə zolağı + qotazlar */}
        <div style={{ position: 'relative', background: C.WINE }}>
          <EmbroideryBand id="rv-hem" height={22} />
          <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: '100%', display: 'flex', justifyContent: 'space-around' }}>
            {Array.from({ length: 9 }, (_, i) => <Tassel key={i} h={i % 2 ? 30 : 38} />)}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, velvet = false }) {
  const ink = velvet ? '#FFF3E0' : C.INK
  const mute = velvet ? alpha('#FFF3E0', 0.75) : C.MUTED
  return (
    <section id={id} data-section={section} style={{
      position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', color: ink,
      background: velvet ? `${VEIL_PATTERN}, ${VELVET_BG}` : `${IVORY_PATTERN}, ${C.IVORY}`,
      backgroundSize: velvet ? '64px 80px, auto, auto' : '64px 80px, auto',
    }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <ButaRule color={velvet ? C.GOLD_L : C.GOLD} width={200} />
            {title && <h2 style={{ margin: '14px 0 0', fontFamily: head, fontWeight: 500, fontSize: 'clamp(30px, 8.6vw, 40px)', lineHeight: 1.12, color: velvet ? '#FFF3E0' : C.CRIMSON, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontSize: 15.5, color: mute }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 340, fontSize: 15.5, color: mute, lineHeight: 1.6 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: '#FFFDF9', border: `1px solid ${alpha(C.GOLD_D, 0.4)}`, borderRadius: 4,
  padding: '14px 16px', fontSize: 16, color: C.INK, outline: 'none',
}
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 15.5, fontWeight: 500, letterSpacing: '.02em', textDecoration: 'none', cursor: 'pointer',
  background: on ? C.CRIMSON : 'transparent', color: on ? '#FFF3E0' : C.CRIMSON, border: `1px solid ${on ? C.CRIMSON : alpha(C.CRIMSON, 0.5)}`,
})
const suggest = { bg: '#FFFDF9', border: `1px solid ${alpha(C.GOLD_D, 0.35)}`, active: alpha(C.GOLD_L, 0.3), text: C.INK, table: C.CRIMSON, radius: 4 }

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function RedVeilTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = TXT[lang] || TXT.az
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} & ${inv.bride}` : inv.single)

  return (
    <div data-rv data-enter={enterDirection(ID)} style={{
      backgroundColor: C.IVORY, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.GOLD, 0.3),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <VeilOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.CRIMSON, border: `1px solid ${C.GOLD}`, boxShadow: '0 8px 20px rgba(62,9,17,.4)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.GOLD_L} idle={alpha(C.GOLD_L, 0.4)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.WINE, 0.94), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(C.GOLD, 0.45)}`, color: '#FFF3E0',
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha('#FFF3E0', 0.8), fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: SCRIPT, fontSize: 24, color: C.GOLD_L }}>Digitoy</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — asılan örpək */}
          <section style={{ position: 'relative', overflow: 'hidden', background: `${IVORY_PATTERN}, radial-gradient(90% 60% at 50% 40%, #FFF8EE, ${C.IVORY} 60%, ${C.IVORY_D})`, backgroundSize: '64px 80px, auto', padding: '150px 22px 56px', textAlign: 'center' }}>
            <VeilDrape height={130} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: head, fontSize: 14, letterSpacing: '.34em', textTransform: 'uppercase', color: C.GOLD_D, animation: 'rv-rise .8s ease-out .2s both' }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              <h1 style={{ margin: '14px 0 0', fontFamily: SCRIPT, fontWeight: 400, fontSize: nameSize(heroName), lineHeight: 1.05, color: C.CRIMSON, overflowWrap: 'anywhere', animation: 'rv-rise 1s ease-out .35s both' }}>{heroName}</h1>
              <ButaRule width={230} style={{ marginTop: 18 }} />
              <div style={{ marginTop: 18, fontFamily: head, fontWeight: 500, fontSize: 'clamp(22px, 6.4vw, 28px)', color: C.INK }}>{inv.fullDate}</div>
              <div style={{ marginTop: 6, fontSize: 16.5, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
              {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 15, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
              <p style={{ margin: '20px auto 0', maxWidth: 330, fontFamily: head, fontStyle: 'italic', fontSize: 20, lineHeight: 1.5, color: C.MUTED }}>{tr.inv_join}</p>
              <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 18, marginTop: 26 }}>
                <Candle h={34} /><Candle h={50} /><Candle h={34} />
              </div>
            </div>
          </section>

          {/* SAYĞAC — tikmə rozetlər */}
          {S.countdown && (
            <Panel head={head} velvet title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ position: 'relative', aspectRatio: '1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${C.GOLD}`, outline: `1px dashed ${alpha(C.GOLD_L, 0.7)}`, outlineOffset: -7, background: 'radial-gradient(circle at 50% 35%, rgba(255,255,255,.1), rgba(0,0,0,.25))' }}>
                      <span style={{ fontFamily: head, fontWeight: 500, fontSize: 'clamp(24px, 7.4vw, 34px)', lineHeight: 1, color: C.GOLD_L, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 13, letterSpacing: '.08em', color: alpha('#FFF3E0', 0.8) }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel head={head} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: 8, background: '#FFFDF9', border: `1px solid ${alpha(C.GOLD, 0.8)}`, outline: `1px dashed ${alpha(C.GOLD_D, 0.5)}`, outlineOffset: -5, borderRadius: '180px 180px 6px 6px', boxShadow: '0 24px 40px -28px rgba(62,9,17,.6)' }}>
                <div style={{ borderRadius: '172px 172px 2px 2px', overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.CRIMSON} height="clamp(270px, 76vw, 340px)"
                    map={{ opacity: 0.88, filter: 'sepia(.25) saturate(.8)', tintOpacity: 0.14, tint: C.CRIMSON, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(270px, 76vw, 340px)', position: 'relative', background: `${IVORY_PATTERN}, ${C.IVORY_D}`, backgroundSize: '64px 80px, auto' }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontWeight: 500, fontSize: 27, lineHeight: 1.2, color: C.INK }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 15.5, color: C.MUTED }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn} />
            </Panel>
          )}

          {/* PROQRAM — tikmə xətti */}
          {S.program && (
            <Panel head={head} velvet title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ position: 'relative', maxWidth: 380, margin: '0 auto', padding: '4px 0' }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: 31, top: 0, bottom: 0, width: 1, borderLeft: `1px dashed ${alpha(C.GOLD_L, 0.6)}` }} />
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '62px minmax(0, 1fr)', gap: 14, alignItems: 'center', padding: '12px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <span style={{ display: 'flex', padding: '6px 9px', background: C.WINE, borderRadius: 999, boxShadow: `0 0 0 1px ${alpha(C.GOLD, 0.6)}` }}><Buta size={18} color={C.GOLD_L} flip={i % 2 === 1} /></span>
                    </div>
                    <div>
                      <div style={{ fontFamily: head, fontWeight: 500, fontSize: 20, color: C.GOLD_L, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                      <div style={{ marginTop: 2, fontSize: 17.5, lineHeight: 1.35, color: '#FFF3E0' }}>{ev.label}</div>
                    </div>
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

          {/* MASA — məxmər kisə */}
          {S.seating && !seating.isEmpty && (
            <Panel head={head} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="rv-seat-list" field={field} suggest={suggest} font={body} muted={C.MUTED} accent={C.CRIMSON}
                nameStyle={{ fontFamily: SCRIPT, fontSize: 36, lineHeight: 1.1 }}
                card={(num) => (
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: 46, animation: 'rv-seal .7s cubic-bezier(.3,.8,.4,1) both' }}>
                    <div style={{ minWidth: 170, padding: '26px 30px 24px', borderRadius: '90px 90px 10px 10px', background: `${VEIL_PATTERN}, ${VELVET_BG}`, backgroundSize: '64px 80px, auto, auto', border: `1px solid ${C.GOLD}`, outline: `1px dashed ${alpha(C.GOLD_L, 0.6)}`, outlineOffset: -8, boxShadow: '0 22px 34px -18px rgba(62,9,17,.7)' }}>
                      <div style={{ fontFamily: head, fontSize: 13, letterSpacing: '.3em', textTransform: 'uppercase', color: C.GOLD_L }}>{T.table}</div>
                      <div style={{ fontFamily: head, fontWeight: 500, fontSize: tableSize(num, 68), lineHeight: 1.05, color: '#FFF3E0' }}>{num}</div>
                    </div>
                    <span aria-hidden="true" style={{ position: 'absolute', left: 18, top: '100%' }}><Tassel h={36} /></span>
                    <span aria-hidden="true" style={{ position: 'absolute', right: 18, top: '100%' }}><Tassel h={36} /></span>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR — mehrab tağları */}
          {S.gallery && (
            <Panel id="gallery-section" head={head} velvet title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10, marginBottom: 30 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ aspectRatio: '3 / 4.4', overflow: 'hidden', borderRadius: '999px 999px 4px 4px', background: C.WINE, border: `2px solid ${C.GOLD}`, boxShadow: `0 0 0 4px ${alpha(C.WINE, 0.6)}, 0 0 0 5px ${alpha(C.GOLD_L, 0.45)}`, transform: i % 3 === 1 ? 'translateY(14px)' : 'none' }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.WINE} bg="#FFF8EE" frame={{ borderRadius: 6, border: `1px solid ${C.GOLD}`, boxShadow: `0 0 0 6px ${alpha(C.WINE, 0.5)}, 0 0 0 7px ${alpha(C.GOLD_L, 0.5)}` }}
                btn={(on) => ({ ...btn(on), background: on ? C.GOLD : 'transparent', color: on ? C.WINE : C.GOLD_L, border: `1px solid ${C.GOLD}` })}
                muted={alpha('#FFF3E0', 0.78)} desc={galleryDesc(props.adminOverrides, tr, lang, 'night')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: alpha(C.CRIMSON, 0.45), hair: alpha(C.GOLD_D, 0.3), accent: C.CRIMSON,
                font: body, display: head, btnFont: body,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Buta size={30} color={C.CRIMSON} fill={alpha(C.GOLD_L, 0.4)} /></div>,
                marker: (a) => (a ? <Buta size={10} color={C.CRIMSON} fill={C.CRIMSON} /> : <span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', border: `1px solid ${alpha(C.CRIMSON, 0.5)}` }} />),
                suggest: { ...suggest, font: body },
              }} />
            </Panel>
          )}

          {/* XOŞ SÖZLƏR */}
          {S.guestbook && (
            <Panel head={head} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field} btn={btn} errorColor={C.CRIMSON} />
              <div style={{ display: 'grid', gap: 14 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, position: 'relative', padding: '18px 18px 16px 54px', background: '#FFFDF9', border: `1px solid ${alpha(C.GOLD, 0.45)}`, borderRadius: 4 }}>
                      <Buta size={18} color={C.CRIMSON} flip={i % 2 === 1} style={{ position: 'absolute', left: 18, top: 18 }} />
                      <blockquote style={{ margin: 0, fontFamily: head, fontStyle: 'italic', fontSize: 19, lineHeight: 1.5, color: C.INK }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, fontSize: 14, letterSpacing: '.04em', color: C.CRIMSON }}>{msg.name}{msg.date ? <span style={{ color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}</figcaption>
                    </figure>
                  )
                })}
              </div>
            </Panel>
          )}

          <div style={{ background: C.WINE }}><EmbroideryBand id="rv-foot" height={20} /></div>
          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={head} />
        </motion.div>
      )}
    </div>
  )
}

function MapPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -16, top: -50, display: 'flex', padding: '8px 10px', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', background: C.CRIMSON, boxShadow: `0 0 0 2px ${C.GOLD}, 0 10px 16px rgba(62,9,17,.45)` }}>
        <span style={{ transform: 'rotate(45deg)', display: 'block' }}><Buta size={12} color={C.GOLD_L} /></span>
      </span>
    </span>
  )
}
