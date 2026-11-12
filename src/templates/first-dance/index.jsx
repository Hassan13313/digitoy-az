import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../_shared/MapSection'
import { enterDirection } from '../_shared/motion'
import { hidePhoto } from '../../utils/photoGallery'
import { getTemplateTheme } from '../templateConfig'
import { useInvitation, useGate, openingNames, alpha } from '../_shared/useInvitation'
import { MusicFab, EqBars, StoryBlock, InvitationEnd, ReplyForm } from '../_shared/invitationKit'
import { VenueLinks, SeatFinder, PhotoQr, GuestbookForm } from '../_shared/blocks'
import { galleryDesc, tableSize } from '../_shared/kids'
import { Words, Letters, Rise, Stagger, Photo, Roll, Dust, Burst, Sparks, Confetti } from '../_shared/viral'
import { VIRAL_CSS, coverSpot, useInView, vimg } from '../_shared/viralHooks'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { PaletteContext, resolvePalette, scaleFont } from '../_shared/palette'

/* ─────────────────────────────────────────────────────────────────────────────
   İLK RƏQS — «viral video» toy seriyası (2026-11)

   Konsept: toy gecəsinin ən çox paylaşılan anı — fişənglər altında ilk rəqs.
   Açılış Reels kadrıdır:
     1. qaranlıq, bir qığılcım və «Fişəngləri yandır»
     2. toxunanda cütlüyün əlindəki fişəngdən qığılcımlar uçur (qığılcım
        fotodakı fişəngin yerinə bağlıdır — coverSpot), adlar yazılır
     3. işıq çaxır, kadr konfetili rəqsə keçir, konfeti dayanmadan yağır
     4. açılış həmin kadra — səhifənin örtüyünə — həll olur
   Daxildə: ağ-qara fişəngli rəqs, çilçıraq altında yavaş rəqs, RSVP «gəlirəm»
   deyəndə konfeti, sonda yenə fişəng. Fotolar GPT Image ilə yaradılıb (reqs-1 istisna, bax CREDITS.md).
   Şriftlər: Gideon Roman (başlıq) · Josefin Sans (mətn) · Luxurious Script (adlar) — Ə var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('first-dance')
const ID = 'first-dance'

const LINKS = { primary: ['FISHENG'], secondary: ['GECE_2'], accent: ['GUL'], background: ['GECE'], text: ['SAMPAN'] }

const KEYFRAMES = (C) => (`
@keyframes fd-spark { 0%,100% { opacity: .55; scale: .8 } 50% { opacity: 1; scale: 1.3 } }
@keyframes fd-halo { 0%,100% { box-shadow: 0 0 0 0 rgba(245,198,107,.4) } 60% { box-shadow: 0 0 0 16px rgba(245,198,107,0) } }
@keyframes fd-out { to { opacity: 0 } }
[data-fd] canvas, [data-fd] div[aria-hidden="true"], [data-fd] span[aria-hidden="true"] { pointer-events: none; }
[data-fd] ::placeholder { color: ${alpha(C.BOZ, 0.8)}; }
[data-fd] input:focus-visible, [data-fd] textarea:focus-visible { border-color: ${C.FISHENG} !important; outline: none; }
[data-fd] button:focus-visible, [data-fd] a:focus-visible, [data-fd] [role="button"]:focus-visible { outline: 2px solid ${C.FISHENG}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-fd] *, [data-fd] { animation: none !important; transition: none !important; } }
`)

const OPEN_MS = 5800
const REVEAL_MS = 4900
const CUT_MS = 3500
const SPARK = [0.51, 0.43] // fotodakı fişəngin yeri (reqs-1)
const ph = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }
const CONF = ['#F5C66B', '#EAD7B7', '#FFFFFF', '#C98B8B']

/* ═══ AÇILIŞ: fişənglər yanır → konfetili rəqs ═══ */
function SparklerOpening({ inv, theme, C, scriptFont, weddingData, T, head }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: OPEN_MS, revealAt: REVEAL_MS })
  const img = useRef(null)
  const [cut, setCut] = useState(false)
  const go = gate.opening
  useEffect(() => {
    if (!go) return undefined
    const t = setTimeout(() => setCut(true), CUT_MS)
    return () => clearTimeout(t)
  }, [go])
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const names = titleOv !== '' ? [first, second].filter(Boolean).join(` ${ot.text('and') || inv.and} `) : ''
  return (
    <div {...gate.gateProps} data-fd style={{
      position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: '#000', color: C.SAMPAN,
      fontFamily: theme.fonts.body, animation: go ? `fd-out .9s ease ${(REVEAL_MS + 100) / 1000}s forwards` : undefined,
    }}>
      <img ref={img} src={vimg('reqs-1')} alt="" style={{ ...ph, objectPosition: '50% 45%', filter: go ? 'brightness(1.15)' : 'brightness(.18)', transform: go ? 'scale(1)' : 'scale(1.06)', transition: 'filter 2.4s cubic-bezier(.3,0,.2,1), transform 6s cubic-bezier(.2,.6,.2,1)' }} />
      {go && !cut && <Sparks at={() => [coverSpot(img.current, SPARK[0], SPARK[1])]} rate={7} speed={4.2} />}
      <img src={vimg('reqs-3')} alt="" style={{ ...ph, objectPosition: '50% 40%', opacity: cut ? 1 : 0, transform: cut ? 'scale(1)' : 'scale(1.12)', transition: 'opacity .25s ease, transform 6s cubic-bezier(.2,.6,.2,1)' }} />
      {cut && <Confetti count={70} loop colors={CONF} />}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: '#fff3d6', opacity: 0, animation: cut ? 'vr-flash 1s ease' : undefined }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(18,14,22,.5), rgba(18,14,22,0) 28%, rgba(18,14,22,0) 50%, rgba(18,14,22,.9))', opacity: go ? 1 : 0, transition: 'opacity 2s' }} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '0 24px', textAlign: 'center', opacity: go ? 0 : 1, transition: 'opacity .7s' }}>
        <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffe2a3', boxShadow: '0 0 20px 7px rgba(245,198,107,.6)', animation: 'fd-spark 1.4s ease-in-out infinite' }} />
        {ot.show('kicker') && <div style={{ fontSize: 15, letterSpacing: '.08em', color: C.BOZ, maxWidth: '24ch', lineHeight: 1.5 }}>{ot.text('kicker')}</div>}
        {ot.show('cta') && <span style={{ display: 'inline-flex', alignItems: 'center', minHeight: 50, padding: '14px 32px', borderRadius: 999, border: `1px solid ${alpha(C.FISHENG, 0.65)}`, color: C.FISHENG, fontSize: 16, letterSpacing: '.04em', animation: 'fd-halo 2.4s ease-in-out infinite' }}>{ot.text('cta')}</span>}
        {ot.show('hint') && <div style={{ fontSize: 13, color: alpha(C.BOZ, 0.85) }}>{ot.text('hint')}</div>}
      </div>

      {/* toxunandan sonra — örtüyün yazısı burada yazılır */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        {go && <HeroText inv={inv} weddingData={weddingData} T={T} scriptFont={scriptFont} C={C} head={head} name={names} kicker={inv.L('hero', 'kicker', inv.eventLabel)} on={go} start={1.3} />}
      </div>
    </div>
  )
}

/* Örtüyün yazısı: açılışın son kadrı ilə eyni yerdə dayanır (instant — açılışdan gəlib) */
function HeroText({ inv, weddingData, T, scriptFont, name, kicker, C, head, on = true, start = 0, instant = false }) {
  const [ref, seen] = useInView(0.1)
  const a = (s) => (instant ? undefined : `vr-up .9s ease ${(start + s).toFixed(2)}s both`)
  return (
    <div ref={ref} style={{ position: 'absolute', left: 0, right: 0, bottom: 50, padding: '0 18px', textAlign: 'center' }}>
      <div style={{ fontSize: 14.5, letterSpacing: '.08em', color: C.SAMPAN, animation: a(0.2) }}>{kicker}</div>
      <h1 style={{ margin: '8px 0 10px', fontWeight: 400 }}>
        <Letters text={name} on={instant || (on && seen)} delay={start + 0.35} step={0.07} style={{ display: 'block', fontFamily: scriptFont, fontSize: nameSize(name, true), lineHeight: 1, color: '#FFF6E6' }} />
      </h1>
      <div style={{ fontFamily: head, fontSize: 19, color: C.FISHENG, animation: a(1.4) }}>{inv.fullDate}</div>
      <div style={{ marginTop: 4, fontSize: 15, fontWeight: 300, color: C.SAMPAN, animation: a(1.6) }}>{[inv.time, weddingData.venueName].filter(Boolean).join(', ')}</div>
      <div style={{ marginTop: 20, fontSize: 13.5, letterSpacing: '.06em', color: C.BOZ, animation: a(2.2) }}>
        {T.scroll}
        <span aria-hidden="true" style={{ display: 'block', width: 1, height: 26, margin: '10px auto 0', background: C.FISHENG, transformOrigin: 'top', animation: 'vr-drop 2.2s ease-in-out infinite' }} />
      </div>
    </div>
  )
}

function Panel({ id, section, title, kicker, sub, children, head, C, alt = false, center = false }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '64px 24px 68px', overflow: 'hidden', background: alt ? C.GECE_2 : C.GECE, color: C.SAMPAN, textAlign: center ? 'center' : undefined }}>
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 480, margin: '0 auto' }}>
        {title && <Words as="h2" text={title} style={{ margin: 0, fontFamily: head, fontWeight: 400, fontSize: scaleFont('clamp(30px, 8.6vw, 38px)', C.hs), lineHeight: 1.12 }} />}
        {kicker && <Rise delay={0.2} style={{ marginTop: 8, fontSize: 15, letterSpacing: '.04em', color: C.FISHENG }}>{kicker}</Rise>}
        {sub && <Rise delay={0.25} as="p" style={{ margin: center ? '10px auto 0' : '10px 0 0', maxWidth: '32ch', fontSize: 16, fontWeight: 300, color: C.BOZ, lineHeight: 1.6 }}>{sub}</Rise>}
        <div style={{ marginTop: title || kicker || sub ? 28 : 0 }}>{children}</div>
      </div>
    </section>
  )
}

/* Kadr + yazı (tam en) */
function Band({ src, focus, height = '64svh', children, confetti = false }) {
  const [ref, seen] = useInView(0.25)
  return (
    <div ref={ref} data-section="photo" style={{ position: 'relative', height, minHeight: 380, background: '#000' }}>
      <Photo src={src} alt="" focus={focus} style={{ position: 'absolute', inset: 0 }}>
        {confetti && seen && <Confetti count={40} loop colors={CONF} alpha={0.85} />}
        {children}
      </Photo>
    </div>
  )
}

function End({ inv, C, T, scriptFont }) {
  const [ref, seen] = useInView(0.3)
  const img = useRef(null)
  const names = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  return (
    <section ref={ref} data-section="finale" style={{ position: 'relative', height: '90svh', minHeight: 540, overflow: 'hidden', textAlign: 'center', color: C.SAMPAN, background: '#000' }}>
      <img ref={img} src={vimg('reqs-1')} alt="" loading="lazy" style={{ ...ph, objectPosition: '50% 45%', filter: 'brightness(.9)' }} />
      {seen && <Sparks at={() => [coverSpot(img.current, SPARK[0], SPARK[1])]} rate={4} speed={3.2} />}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(18,14,22,.1) 40%, rgba(18,14,22,.88))' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: '12%', padding: '0 20px' }}>
        <Words text={T.end} style={{ fontSize: 16, letterSpacing: '.06em', color: C.FISHENG }} />
        <Letters text={names} on={seen} delay={0.5} step={0.07} style={{ display: 'block', marginTop: 10, fontFamily: scriptFont, fontSize: nameSize(names), lineHeight: 1.05, color: '#FFF6E6' }} />
        <div style={{ marginTop: 12, fontSize: 15, color: C.BOZ, opacity: seen ? 1 : 0, transition: 'opacity 1s 1.8s' }}>{inv.fullDate}</div>
      </div>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${alpha(C.SAMPAN, 0.3)}`, borderRadius: 0,
  padding: '12px 2px', fontSize: 17, color: C.SAMPAN, outline: 'none',
})
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 999,
  fontSize: 15.5, letterSpacing: '.03em', textDecoration: 'none', cursor: 'pointer',
  background: on ? C.FISHENG : 'transparent', color: on ? '#21170A' : C.SAMPAN, border: `1px solid ${on ? C.FISHENG : alpha(C.SAMPAN, 0.45)}`,
}))
const suggest = (C) => ({ bg: C.GECE_2, border: `1px solid ${alpha(C.FISHENG, 0.35)}`, active: alpha(C.FISHENG, 0.16), text: C.SAMPAN, table: C.FISHENG, radius: 10 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function FirstDanceTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvp, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const scriptFont = theme.fonts.script || BASE.fonts.script
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const [veil] = useState(() => !inv.opened)

  return (
    <PaletteContext.Provider value={C}><div data-fd data-vr lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.GECE, minHeight: '100vh', fontFamily: body, color: C.SAMPAN, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.FISHENG, 0.3),
    }}>
      <style>{VIRAL_CSS + KEYFRAMES(C)}</style>
      {veil && <SparklerOpening inv={inv} theme={theme} C={C} scriptFont={scriptFont} weddingData={weddingData} T={T} head={head} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: alpha(C.GECE, 0.75), border: `1px solid ${alpha(C.FISHENG, 0.5)}`, backdropFilter: 'blur(6px)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.FISHENG} idle={alpha(C.FISHENG, 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.GECE, 0.86), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: C.SAMPAN,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.SAMPAN, 0.75), fontSize: 14, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontSize: 18, color: C.FISHENG }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — konfetili rəqs, açılışın son kadrı */}
          <section data-section="hero" style={{ position: 'relative', marginTop: -52, height: '100svh', minHeight: 560, overflow: 'hidden', background: '#000' }}>
            <Photo src={vimg('reqs-3')} alt="" par={0} wipe={false} focus="50% 40%" style={{ position: 'absolute', inset: 0 }} />
            <Confetti count={46} loop colors={CONF} alpha={0.85} />
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(18,14,22,.45), rgba(18,14,22,0) 28%, rgba(18,14,22,0) 50%, rgba(18,14,22,.9))' }} />
            <HeroText inv={inv} weddingData={weddingData} T={T} scriptFont={scriptFont} C={C} head={head} name={heroName} kicker={L('hero', 'kicker', inv.eventLabel)} instant={veil} />
          </section>

          {/* Dəvət */}
          <section data-section="invite" style={{ padding: '66px 26px 58px', textAlign: 'center', background: C.GECE }}>
            <Words as="p" text={tr.inv_join} step={0.045} style={{ margin: '0 auto', maxWidth: '26ch', fontFamily: head, fontSize: 'clamp(21px, 6vw, 24px)', lineHeight: 1.55 }} />
            {inv.isCorp && weddingData.organizer?.trim() && <Rise style={{ marginTop: 10, fontSize: 15, color: C.BOZ }}>{tr.organizer_display}: {weddingData.organizer}</Rise>}
          </section>

          {S.countdown && (
            <Panel section="countdown" head={head} C={C} alt center title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <Dust count={24} color="245,198,107" alpha={0.45} />
              <Rise>
                <div style={{ fontFamily: head, fontSize: 'clamp(100px, 34vw, 140px)', lineHeight: 0.95, color: '#FFF6E6', textShadow: '0 0 40px rgba(245,198,107,.25)' }}><Roll value={cd.days} /></div>
                <div style={{ marginTop: 6, fontSize: 16, letterSpacing: '.08em', color: C.FISHENG }}>{T.left}</div>
              </Rise>
              <Rise delay={0.2} style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 26, fontVariantNumeric: 'tabular-nums' }}>
                {[['hours', cd.hours], ['minutes', cd.minutes], ['seconds', cd.seconds]].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontFamily: head, fontSize: 28 }}><Roll value={String(v).padStart(2, '0')} /></div>
                    <div style={{ marginTop: 4, fontSize: 13.5, color: C.BOZ }}>{cd.labels[k]}</div>
                  </div>
                ))}
              </Rise>
            </Panel>
          )}

          {/* Ağ-qara fişəngli rəqs */}
          <Band src={vimg('reqs-2')} focus="50% 45%" height="70svh">
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,14,22,.85), transparent 50%)' }} />
            <Words text={T.dance} step={0.1} style={{ position: 'absolute', left: 24, right: 24, bottom: 28, maxWidth: '18ch', fontFamily: scriptFont, fontSize: 'clamp(40px, 11.5vw, 54px)', lineHeight: 1.1, color: '#FFF6E6' }} />
          </Band>

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {S.program && (
            <Panel section="program" head={head} C={C} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <Stagger step={0.12}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '64px minmax(0, 1fr)', gap: 14, alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${alpha(C.SAMPAN, 0.12)}` }}>
                    <div style={{ fontFamily: head, fontSize: 18, color: C.FISHENG, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 17.5, lineHeight: 1.35 }}>
                      <span style={{ flex: 1 }}>{ev.label}</span>
                      <span aria-hidden="true" style={{ flex: 'none', width: 5, height: 5, borderRadius: '50%', background: '#ffe2a3', boxShadow: '0 0 12px 4px rgba(245,198,107,.5)', animation: `fd-spark 1.8s ease-in-out ${i * 0.25}s infinite` }} />
                    </div>
                  </div>
                ))}
              </Stagger>
            </Panel>
          )}

          {/* Çilçıraq altında yavaş rəqs */}
          <Band src={vimg('reqs-5')} focus="50% 30%" height="66svh">
            <Dust count={22} color="255,240,210" alpha={0.5} />
          </Band>

          {S.venue && (
            <Panel section="venue" head={head} C={C} alt title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <Rise style={{ overflow: 'hidden', isolation: 'isolate', borderRadius: 4 }}>
                <MapSection
                  weddingData={weddingData} theme={theme} accent={C.FISHENG} height="clamp(240px, 68vw, 300px)"
                  map={{ opacity: 0.85, filter: 'grayscale(.8) brightness(.75) contrast(1.15)', tintOpacity: 0.3, tint: C.GECE_2, blend: 'multiply' }}
                  frame={<MapPin />}
                  fallback={<div style={{ height: 'clamp(240px, 68vw, 300px)', position: 'relative', background: C.GECE }}><MapPin /></div>}
                />
              </Rise>
              <Words text={weddingData.venueName || ''} step={0.1} style={{ marginTop: 22, fontFamily: head, fontSize: 27, lineHeight: 1.15 }} />
              {weddingData.venueNote && <Rise delay={0.2} style={{ marginTop: 6, fontSize: 15, fontWeight: 300, color: C.BOZ }}>{weddingData.venueNote}</Rise>}
              <Rise delay={0.3}><VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} /></Rise>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} C={C} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <Rise>
                <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="left" />
              </Rise>
            </Panel>
          )}

          <Band src={vimg('reqs-4')} focus="50% 30%" height="64svh" confetti />

          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} C={C} alt center title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <div style={{ position: 'relative', textAlign: 'left' }}>
                <Burst fire={seating.selected?.full_name} color="245,198,107" />
                <SeatFinder inv={inv} tr={tr} listId="fd-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={C.BOZ} accent={C.FISHENG}
                  nameStyle={{ fontFamily: head, fontSize: 20 }}
                  card={(num) => (
                    <div style={{ display: 'inline-block', minWidth: 180, padding: '20px 18px 16px', border: `1px solid ${alpha(C.FISHENG, 0.45)}`, borderRadius: 999, animation: 'vr-up .7s cubic-bezier(.2,.8,.2,1) both' }}>
                      <div style={{ fontFamily: head, fontSize: tableSize(num, 64), lineHeight: 1, color: '#FFF6E6', textShadow: '0 0 22px rgba(245,198,107,.45)' }}>{num}</div>
                      <div style={{ marginTop: 4, fontSize: 13.5, letterSpacing: '.06em', color: C.FISHENG }}>{T.table}</div>
                    </div>
                  )} />
              </div>
            </Panel>
          )}

          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} C={C} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, marginBottom: 28 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <Rise key={i} delay={(i % 2) * 0.12} style={{ aspectRatio: i % 3 === 0 ? '3 / 4.4' : '3 / 4', overflow: 'hidden', background: C.GECE_2 }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} className="vr-kb" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </Rise>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.GECE} bg={C.SAMPAN} frame={{ border: `1px solid ${alpha(C.FISHENG, 0.45)}` }}
                btn={btn(C)} muted={C.BOZ} desc={galleryDesc(props.adminOverrides, tr, lang, 'night')} />
            </Panel>
          )}

          {S.rsvp && (
            <Panel section="rsvp" head={head} C={C} alt title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <div style={{ position: 'relative' }}>
                {rsvp.submitted && <Confetti count={90} colors={CONF} />}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <ReplyForm inv={inv} t={{
                    ink: C.SAMPAN, muted: C.BOZ, line: alpha(C.SAMPAN, 0.35), hair: alpha(C.SAMPAN, 0.12), accent: C.FISHENG,
                    font: body, display: head, displayItalic: false, btnFont: body, radius: 999,
                    doneMark: <div aria-hidden="true" style={{ width: 8, height: 8, margin: '0 auto 18px', borderRadius: '50%', background: '#ffe2a3', boxShadow: '0 0 24px 9px rgba(245,198,107,.55)', animation: 'fd-spark 1.4s ease-in-out infinite' }} />,
                    marker: (a) => <span style={{ display: 'block', width: 10, height: 10, borderRadius: '50%', background: a ? C.FISHENG : 'transparent', border: a ? 'none' : `1px solid ${alpha(C.SAMPAN, 0.5)}`, boxShadow: a ? '0 0 10px 3px rgba(245,198,107,.5)' : 'none', transition: 'all .3s' }} />,
                    suggest: { ...suggest(C), font: body },
                  }} />
                </div>
              </div>
            </Panel>
          )}

          {S.guestbook && (
            <Panel section="guestbook" head={head} C={C} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field(C)} btn={btn(C)} errorColor="#E89A8A" />
              <Stagger step={0.1}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '18px 0', borderTop: `1px solid ${alpha(C.SAMPAN, 0.12)}` }}>
                      <blockquote style={{ margin: 0, fontSize: 17, fontWeight: 300, lineHeight: 1.6 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 6, fontFamily: scriptFont, fontSize: 26, lineHeight: 1.1, color: C.FISHENG }}>
                        {msg.name}{msg.date ? <span style={{ fontFamily: body, fontSize: 12.5, color: C.BOZ }}> · {gbook.formatDate(msg.date)}</span> : null}
                      </figcaption>
                    </figure>
                  )
                })}
              </Stagger>
            </Panel>
          )}

          <End inv={inv} C={C} T={T} scriptFont={scriptFont} />
          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={head} />
        </motion.div>
      )}
    </div></PaletteContext.Provider>
  )
}

function MapPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -6, top: -6, width: 12, height: 12, borderRadius: '50%', background: '#ffe2a3', boxShadow: '0 0 22px 9px rgba(245,198,107,.55)', animation: 'fd-spark 1.4s ease-in-out infinite' }} />
    </span>
  )
}
