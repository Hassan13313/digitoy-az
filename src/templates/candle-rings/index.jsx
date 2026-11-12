import { motion } from 'framer-motion'
import { useState } from 'react'
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
import { Words, Letters, Rise, Stagger, Photo, Roll, Dust, Burst, Flicker, Reel } from '../_shared/viral'
import { VIRAL_CSS, useInView } from '../_shared/viralHooks'
import { resolvePhotos } from '../templatePhotos'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { PaletteContext, resolvePalette, scaleFont } from '../_shared/palette'

/* ─────────────────────────────────────────────────────────────────────────────
   ŞAM VƏ ÜZÜK — «viral video» toy seriyası (2026-11)

   Konsept: qaranlıq zalda şamlar və iki nişan üzüyü. Açılış Reels kadrıdır:
     1. tam qaranlıq, bir qığılcım və «Şamları yandır»
     2. toxunanda işıq ortadan dairə kimi yayılır — real şam fotosu görünür,
        alov titrəyir, adlar hərf-hərf yazılır
     3. kadr üzüklərə keçir, üzüklərin üstündən qızılı parıltı sürüşür
     4. açılış həmin kadra — səhifənin örtüyünə — həll olur
   Daxildə: şam işığında dəvət, böyük fırlanan gün sayı, alovlu proqram xətti,
   şamlı pilləkən, şam işığında son kadr.
   Fotolar GPT Image ilə bu şablon üçün yaradılıb (public/img/wedding/viral); hərəkət _shared/viral.
   Şriftlər: Labrada (mətn, başlıq) · Carattere (adlar) — Ə var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('candle-rings')
const ID = 'candle-rings'

const LINKS = { primary: ['QIZIL'], secondary: ['MEXMER_2'], accent: ['QIZIL'], background: ['MEXMER'], text: ['FIL'] }

const KEYFRAMES = (C) => (`
@keyframes cr-spark { 0%,100% { opacity: .55; scale: .8 } 50% { opacity: 1; scale: 1.25 } }
@keyframes cr-halo { 0%,100% { box-shadow: 0 0 0 0 rgba(214,173,107,.35) } 60% { box-shadow: 0 0 0 16px rgba(214,173,107,0) } }
@keyframes cr-glint { 0% { background-position: 120% 0 } 60%,100% { background-position: -60% 0 } }
@keyframes cr-out { to { opacity: 0 } }
@keyframes cr-line { from { scale: 1 0 } to { scale: 1 1 } }
[data-cr] canvas, [data-cr] div[aria-hidden="true"], [data-cr] span[aria-hidden="true"] { pointer-events: none; }
[data-cr] ::placeholder { color: ${alpha(C.KUL, 0.75)}; font-style: italic; }
[data-cr] input:focus-visible, [data-cr] textarea:focus-visible { border-color: ${C.QIZIL} !important; outline: none; }
[data-cr] button:focus-visible, [data-cr] a:focus-visible, [data-cr] [role="button"]:focus-visible { outline: 2px solid ${C.QIZIL}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-cr] *, [data-cr] { animation: none !important; transition: none !important; } }
`)

const OPEN_MS = 5600
const REVEAL_MS = 4700
const ph = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }
const glint = { position: 'absolute', inset: 0, mixBlendMode: 'screen', background: 'linear-gradient(115deg, transparent 40%, rgba(255,236,190,.35) 48%, transparent 56%)', backgroundSize: '250% 100%' }

/* ═══ AÇILIŞ: qaranlıq → şamlar alışır → üzüklər ═══ */
function CandleOpening({ inv, theme, C, scriptFont, weddingData, T }) {
  const P = resolvePhotos(PHOTOS, inv.images)
  const { ot } = inv
  const gate = useGate({ inv, ms: OPEN_MS, revealAt: REVEAL_MS })
  if (gate.gone) return null
  const go = gate.opening
  const { titleOv, first, second } = openingNames(inv)
  const names = titleOv !== '' ? [first, second].filter(Boolean).join(` ${ot.text('and') || inv.and} `) : ''
  const mask = go ? '320% 320%' : '0% 0%'
  return (
    <div {...gate.gateProps} data-cr style={{
      position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: '#000', color: C.FIL,
      fontFamily: theme.fonts.body, animation: go ? `cr-out .9s ease ${(REVEAL_MS + 100) / 1000}s forwards` : undefined,
    }}>
      {/* şamlar: işıq ortadan dairə kimi yayılır */}
      {P.opening && (<img src={P.opening} alt="" style={{
        ...ph, objectPosition: '50% 40%',
        WebkitMaskImage: 'radial-gradient(circle, #000 35%, transparent 70%)', maskImage: 'radial-gradient(circle, #000 35%, transparent 70%)',
        WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskPosition: '50% 36%', maskPosition: '50% 36%',
        WebkitMaskSize: mask, maskSize: mask,
        filter: go ? 'brightness(1)' : 'brightness(.25)', transform: go ? 'scale(1.08)' : 'scale(1)',
        transition: 'filter 3s cubic-bezier(.3,0,.2,1), -webkit-mask-size 3.4s cubic-bezier(.4,0,.2,1), mask-size 3.4s cubic-bezier(.4,0,.2,1), transform 9s cubic-bezier(.2,.6,.2,1)',
      }} />)}
      {go && <Flicker at="50% 34%" color="255,180,100" strength={0.42} style={{ opacity: 0, animation: 'vr-up 2s ease 1.2s forwards' }} />}
      {/* üzüklər */}
      {P.hero && (<img src={P.hero} alt="" style={{ ...ph, objectPosition: '50% 40%', opacity: go ? 1 : 0, transform: go ? 'scale(1)' : 'scale(1.14)', transition: 'opacity 1.3s ease 3.3s, transform 6s cubic-bezier(.2,.6,.2,1) 3.3s' }} />)}
      <div aria-hidden="true" style={{ ...glint, opacity: go ? 1 : 0, transition: 'opacity 1s 3.8s', animation: go ? 'cr-glint 3.2s ease-in-out 3.9s infinite' : undefined }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,12,9,.55), rgba(8,12,9,0) 26%, rgba(8,12,9,0) 46%, rgba(8,12,9,.9))', opacity: go ? 1 : 0, transition: 'opacity 2s' }} />
      {go && <Dust count={26} color="255,214,160" alpha={0.55} style={{ opacity: 0, animation: 'vr-up 2s ease 1.8s forwards' }} />}

      {/* toxunmadan əvvəl */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '0 24px', textAlign: 'center', opacity: go ? 0 : 1, transition: 'opacity .8s' }}>
        <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffd79a', boxShadow: '0 0 18px 6px rgba(255,190,110,.6)', animation: 'cr-spark 1.8s ease-in-out infinite' }} />
        {ot.show('kicker') && <div style={{ fontStyle: 'italic', color: '#bfae8e', fontSize: 17, lineHeight: 1.5, maxWidth: '22ch' }}>{ot.text('kicker')}</div>}
        {ot.show('cta') && <span style={{ display: 'inline-flex', alignItems: 'center', minHeight: 50, padding: '14px 32px', borderRadius: 999, border: `1px solid ${alpha(C.QIZIL, 0.6)}`, color: C.QIZIL, fontSize: 17, animation: 'cr-halo 2.6s ease-in-out infinite' }}>{ot.text('cta')}</span>}
        {ot.show('hint') && <div style={{ fontSize: 13.5, color: alpha(C.KUL, 0.8) }}>{ot.text('hint')}</div>}
      </div>

      {/* toxunandan sonra — örtüyün yazısı burada yazılır */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        {go && <HeroText inv={inv} weddingData={weddingData} T={T} scriptFont={scriptFont} C={C} name={names} kicker={inv.L('hero', 'kicker', inv.eventLabel)} on={go} start={1.4} />}
      </div>
    </div>
  )
}

/* Örtüyün yazısı: açılışın son kadrı ilə eyni yerdə dayanır (instant — açılışdan gəlib) */
function HeroText({ inv, weddingData, T, scriptFont, name, kicker, C, on = true, start = 0, instant = false }) {
  const [ref, seen] = useInView(0.1)
  const a = (s) => (instant ? undefined : `vr-up .9s ease ${(start + s).toFixed(2)}s both`)
  return (
    <div ref={ref} style={{ position: 'absolute', left: 0, right: 0, bottom: 54, padding: '0 22px' }}>
      <div style={{ fontStyle: 'italic', fontSize: 16, color: C.KUL, animation: a(0.2) }}>{kicker}</div>
      <h1 style={{ margin: '8px 0 12px', fontWeight: 400 }}>
        <Letters text={name} on={instant || (on && seen)} delay={start + 0.35} step={0.07} style={{ display: 'block', fontFamily: scriptFont, fontSize: nameSize(name, true), lineHeight: 0.98, wordSpacing: '.14em' }} />
      </h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 18px', alignItems: 'baseline', fontSize: 17, color: C.QIZIL, animation: a(1.4) }}>
        <span>{inv.fullDate}</span>
        <span style={{ color: C.KUL, fontStyle: 'italic' }}>{[inv.time, weddingData.venueName].filter(Boolean).join(', ')}</span>
      </div>
      <div style={{ marginTop: 22, fontStyle: 'italic', fontSize: 14, color: C.KUL, animation: a(2.2) }}>
        {T.scroll}
        <span aria-hidden="true" style={{ display: 'block', width: 1, height: 26, margin: '10px 0 0 2px', background: C.QIZIL, transformOrigin: 'top', animation: 'vr-drop 2.2s ease-in-out infinite' }} />
      </div>
    </div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, C, alt = false, dust = false }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '64px 26px 68px', overflow: 'hidden', background: alt ? C.MEXMER_2 : C.MEXMER, color: C.FIL }}>
      {dust && <Dust count={24} color="255,214,160" alpha={0.45} />}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 480, margin: '0 auto' }}>
        {title && <Words as="h2" text={title} style={{ margin: 0, fontFamily: head, fontWeight: 400, fontSize: scaleFont('clamp(30px, 8.8vw, 38px)', C.hs), lineHeight: 1.1, letterSpacing: '-.01em' }} />}
        {kicker && <Rise delay={0.2} style={{ marginTop: 8, fontSize: 16, fontStyle: 'italic', color: C.QIZIL }}>{kicker}</Rise>}
        {sub && <Rise delay={0.25} as="p" style={{ margin: '10px 0 0', maxWidth: '32ch', fontSize: 16, color: C.KUL, lineHeight: 1.55 }}>{sub}</Rise>}
        <div style={{ marginTop: title || kicker || sub ? 28 : 0 }}>{children}</div>
      </div>
    </section>
  )
}

/* Proqram: qızılı xətt aşağı uzanır, hər nöqtə alov kimi yanır */
function Flame({ events, C, head }) {
  const [ref, seen] = useInView(0.2)
  return (
    <div ref={ref} style={{ position: 'relative', paddingLeft: 26 }}>
      <span aria-hidden="true" style={{ position: 'absolute', left: 4, top: 6, bottom: 18, width: 1, background: `linear-gradient(${C.QIZIL}, ${alpha(C.QIZIL, 0.1)})`, transformOrigin: 'top', scale: '1 0', animation: seen ? 'cr-line 2.4s cubic-bezier(.4,0,.2,1) .2s forwards' : undefined }} />
      <Stagger step={0.14}>
        {events.map((ev, i) => (
          <div key={i} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '58px minmax(0, 1fr)', gap: 12, padding: '0 0 24px' }}>
            <span aria-hidden="true" style={{ position: 'absolute', left: -26, top: 7, width: 9, height: 9, borderRadius: '50%', background: C.QIZIL, boxShadow: '0 0 10px 2px rgba(255,190,110,.5)', animation: `cr-spark 2.4s ease-in-out ${i * 0.3}s infinite` }} />
            <div style={{ fontVariantNumeric: 'tabular-nums', color: C.QIZIL, fontSize: 16, paddingTop: 3 }}>{ev.time}</div>
            <div style={{ fontFamily: head, fontSize: 20, lineHeight: 1.35 }}>{ev.label}</div>
          </div>
        ))}
      </Stagger>
    </div>
  )
}

function End({ inv, C, T, scriptFont }) {
  const P = resolvePhotos(PHOTOS, inv.images)
  const [ref, seen] = useInView(0.3)
  const names = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  return (
    <section ref={ref} data-section="finale" style={{ position: 'relative', height: '90svh', minHeight: 540, overflow: 'hidden', textAlign: 'center', color: C.FIL, background: '#000' }}>
      {P.finale && (<Photo src={P.finale} par={0} wipe={false} focus="50% 40%" style={{ position: 'absolute', inset: 0 }} />)}
      <Flicker at="50% 34%" color="255,180,100" strength={0.38} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,12,9,.2), rgba(8,12,9,.75))' }} />
      <Dust count={30} color="255,214,160" alpha={0.55} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: '14%', padding: '0 20px' }}>
        <Words text={T.end} style={{ fontStyle: 'italic', fontSize: 18, color: C.QIZIL, maxWidth: '26ch', margin: '0 auto' }} />
        <Letters text={names} on={seen} delay={0.5} step={0.07} style={{ display: 'block', marginTop: 12, fontFamily: scriptFont, fontSize: nameSize(names), lineHeight: 1.05 }} />
        <div style={{ marginTop: 14, fontSize: 15, color: C.KUL, opacity: seen ? 1 : 0, transition: 'opacity 1s 1.8s' }}>{inv.fullDate}</div>
      </div>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${alpha(C.FIL, 0.3)}`, borderRadius: 0,
  padding: '12px 2px', fontSize: 17, color: C.FIL, outline: 'none',
})
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 999,
  fontSize: 16, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.QIZIL : 'transparent', color: on ? '#1a140b' : C.FIL, border: `1px solid ${on ? C.QIZIL : alpha(C.FIL, 0.5)}`,
}))
const suggest = (C) => ({ bg: C.MEXMER_2, border: `1px solid ${alpha(C.QIZIL, 0.35)}`, active: alpha(C.QIZIL, 0.18), text: C.FIL, table: C.QIZIL, radius: 10 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function CandleRingsTemplate(props) {
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
  const P = resolvePhotos(PHOTOS, inv.images)

  return (
    <PaletteContext.Provider value={C}><div data-cr data-vr lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.MEXMER, minHeight: '100vh', fontFamily: body, color: C.FIL, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.QIZIL, 0.3),
    }}>
      <style>{VIRAL_CSS + KEYFRAMES(C)}</style>
      {veil && <CandleOpening inv={inv} theme={theme} C={C} scriptFont={scriptFont} weddingData={weddingData} T={T} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: alpha(C.GECE, 0.7), border: `1px solid ${alpha(C.QIZIL, 0.5)}`, backdropFilter: 'blur(6px)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.QIZIL} idle={alpha(C.QIZIL, 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.GECE, 0.86), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: C.FIL,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.FIL, 0.75), fontSize: 14, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontStyle: 'italic', fontSize: 18, color: C.QIZIL }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — üzüklər, açılışın son kadrı */}
          <section data-section="hero" style={{ position: 'relative', marginTop: -52, height: '100svh', minHeight: 560, overflow: 'hidden', background: '#000' }}>
            {P.hero && (<Photo src={P.hero} alt="" par={0} wipe={false} focus="50% 40%" style={{ position: 'absolute', inset: 0 }} />)}
            <div aria-hidden="true" style={{ ...glint, animation: 'cr-glint 5s ease-in-out 1.5s infinite' }} />
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,12,9,.5), rgba(8,12,9,0) 26%, rgba(8,12,9,0) 46%, rgba(8,12,9,.9))' }} />
            <Dust count={22} color="255,214,160" alpha={0.5} />
            <HeroText inv={inv} weddingData={weddingData} T={T} scriptFont={scriptFont} C={C} name={heroName} kicker={L('hero', 'kicker', inv.eventLabel)} instant={veil} />
          </section>

          {/* Dəvət — şam işığında */}
          <section data-section="invite" style={{ position: 'relative', padding: '68px 26px 60px', background: C.MEXMER, overflow: 'hidden' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <Words as="p" text={tr.inv_join} step={0.04} style={{ margin: 0, maxWidth: '25ch', fontFamily: head, fontWeight: 300, fontSize: 'clamp(20px, 6vw, 23px)', lineHeight: 1.6 }} />
              {inv.isCorp && weddingData.organizer?.trim() && <Rise style={{ marginTop: 12, fontSize: 15, color: C.KUL }}>{tr.organizer_display}: {weddingData.organizer}</Rise>}
              {P.invite && (<div style={{ position: 'relative', marginTop: 34, height: '58svh', minHeight: 340 }}>
                <Photo src={P.invite} alt="" focus="50% 50%" style={{ position: 'absolute', inset: 0 }}>
                  <Flicker at="45% 45%" color="255,170,90" strength={0.35} />
                </Photo>
              </div>)}
            </div>
          </section>

          {/* SAYĞAC — böyük gün sayı */}
          {S.countdown && (
            <Panel section="countdown" head={head} C={C} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <Rise>
                <div style={{ fontFamily: head, fontWeight: 300, fontSize: 'clamp(96px, 32vw, 132px)', lineHeight: 0.92, letterSpacing: '-.04em' }}><Roll value={cd.days} /></div>
                <div style={{ marginTop: 8, fontSize: 18, fontStyle: 'italic', color: C.QIZIL }}>{T.left}</div>
              </Rise>
              <Rise delay={0.2} style={{ display: 'flex', gap: 26, marginTop: 24, color: C.KUL, fontSize: 15 }}>
                {[['hours', cd.hours], ['minutes', cd.minutes], ['seconds', cd.seconds]].map(([k, v]) => (
                  <div key={k}><b style={{ display: 'block', color: C.FIL, fontWeight: 400, fontSize: 26, marginBottom: 4 }}><Roll value={String(v).padStart(2, '0')} /></b>{cd.labels[k]}</div>
                ))}
              </Rise>
              <Rise delay={0.3} style={{ marginTop: 30, paddingTop: 20, borderTop: `1px solid ${alpha(C.FIL, 0.14)}`, fontSize: 17 }}>
                {inv.fullDate}{inv.time ? <span style={{ color: C.KUL, fontStyle: 'italic' }}>, {inv.time}</span> : null}
              </Rise>
            </Panel>
          )}

          {/* Üzüklər — yaşıl zərfin üstündə */}
          {P.rings && (<div data-section="photo" style={{ position: 'relative', height: '66svh', minHeight: 400 }}>
            <Photo src={P.rings} alt="" focus="55% 35%" style={{ position: 'absolute', inset: 0 }}>
              <div aria-hidden="true" style={{ ...glint, animation: 'cr-glint 6s ease-in-out 1s infinite' }} />
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,12,9,.8), transparent 50%)' }} />
              <Words text={T.rings} step={0.1} style={{ position: 'absolute', left: 24, right: 24, bottom: 26, fontFamily: scriptFont, fontSize: 'clamp(40px, 12vw, 56px)', lineHeight: 1.05, color: C.FIL }} />
            </Photo>
          </div>)}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {S.program && (
            <Panel section="program" head={head} C={C} alt dust title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <Flame events={timeline.events} C={C} head={head} />
            </Panel>
          )}

          {S.venue && (
            <Panel section="venue" head={head} C={C} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <Rise style={{ overflow: 'hidden', isolation: 'isolate', borderRadius: 2 }}>
                <MapSection
                  weddingData={weddingData} theme={theme} accent={C.QIZIL} height="clamp(240px, 68vw, 300px)"
                  map={{ opacity: 0.85, filter: 'grayscale(.6) brightness(.8) contrast(1.1)', tintOpacity: 0.25, tint: C.MEXMER, blend: 'multiply' }}
                  frame={<MapPin />}
                  fallback={<div style={{ height: 'clamp(240px, 68vw, 300px)', position: 'relative', background: C.MEXMER_2 }}><MapPin /></div>}
                />
              </Rise>
              <Words text={weddingData.venueName || ''} step={0.1} style={{ marginTop: 22, fontFamily: head, fontSize: 28, lineHeight: 1.15 }} />
              {weddingData.venueNote && <Rise delay={0.2} style={{ marginTop: 6, fontStyle: 'italic', fontSize: 15.5, color: C.KUL }}>{weddingData.venueNote}</Rise>}
              <Rise delay={0.3}><VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} /></Rise>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} C={C} alt title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <Rise>
                <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="left" />
              </Rise>
            </Panel>
          )}

          {/* Şamlı pilləkən */}
          {P.stairs && (<div data-section="photo" style={{ position: 'relative', height: '60svh', minHeight: 360 }}>
            <Photo src={P.stairs} alt="" focus="50% 55%" style={{ position: 'absolute', inset: 0 }}>
              <Dust count={20} color="255,214,160" alpha={0.5} />
            </Photo>
          </div>)}

          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} C={C} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <div style={{ position: 'relative' }}>
                <Burst fire={seating.selected?.full_name} color="255,206,140" />
                <SeatFinder inv={inv} tr={tr} listId="cr-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={C.KUL} accent={C.QIZIL}
                  nameStyle={{ fontFamily: head, fontStyle: 'italic', fontSize: 20 }}
                  card={(num) => (
                    <div style={{ display: 'inline-block', minWidth: 190, padding: '18px 18px 16px', borderTop: `1px solid ${alpha(C.QIZIL, 0.5)}`, borderBottom: `1px solid ${alpha(C.QIZIL, 0.5)}`, animation: 'vr-up .7s cubic-bezier(.2,.8,.2,1) both' }}>
                      <div style={{ fontFamily: scriptFont, fontSize: tableSize(num, 90), lineHeight: 1, color: C.QIZIL, textShadow: '0 0 24px rgba(255,190,110,.45)' }}>{num}</div>
                      <div style={{ marginTop: 4, fontSize: 15, color: C.KUL }}>{T.table}</div>
                    </div>
                  )} />
              </div>
            </Panel>
          )}

          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} C={C} alt title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 ? (
                <div style={{ margin: '0 -26px 28px' }}>
                  <Reel photos={gallery.demoPhotos} height={260} seconds={34} onError={hidePhoto} />
                </div>
              ) : null}
              <PhotoQr inv={inv} tr={tr} fg={C.MEXMER} bg={C.FIL} frame={{ border: `1px solid ${alpha(C.QIZIL, 0.5)}` }}
                btn={btn(C)} muted={C.KUL} desc={galleryDesc(props.adminOverrides, tr, lang, 'night')} />
            </Panel>
          )}

          {S.rsvp && (
            <Panel section="rsvp" head={head} C={C} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <div style={{ position: 'relative' }}>
                <Burst fire={rsvp.submitted ? 1 : 0} color="255,206,140" />
                <ReplyForm inv={inv} t={{
                  ink: C.FIL, muted: C.KUL, line: alpha(C.FIL, 0.35), hair: alpha(C.FIL, 0.14), accent: C.QIZIL,
                  font: body, display: head, displayItalic: true, btnFont: body, radius: 999,
                  doneMark: <div aria-hidden="true" style={{ width: 8, height: 8, margin: '0 auto 18px', borderRadius: '50%', background: '#ffd79a', boxShadow: '0 0 22px 8px rgba(255,190,110,.55)', animation: 'cr-spark 1.8s ease-in-out infinite' }} />,
                  marker: (a) => <span style={{ display: 'block', width: 10, height: 10, borderRadius: '50%', background: a ? C.QIZIL : 'transparent', border: a ? 'none' : `1px solid ${alpha(C.FIL, 0.5)}`, boxShadow: a ? '0 0 10px 2px rgba(255,190,110,.5)' : 'none', transition: 'all .3s' }} />,
                  suggest: { ...suggest(C), font: body },
                }} />
              </div>
            </Panel>
          )}

          {S.guestbook && (
            <Panel section="guestbook" head={head} C={C} alt title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field(C)} btn={btn(C)} errorColor="#E89A8A" />
              <Stagger step={0.1}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '18px 0', borderTop: `1px solid ${alpha(C.FIL, 0.12)}` }}>
                      <blockquote style={{ margin: 0, fontFamily: head, fontWeight: 300, fontSize: 18, lineHeight: 1.55 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 6, fontStyle: 'italic', fontSize: 15, color: C.QIZIL }}>
                        {msg.name}{msg.date ? <span style={{ fontSize: 13, color: C.KUL }}> · {gbook.formatDate(msg.date)}</span> : null}
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
      <span style={{ position: 'absolute', left: -6, top: -6, width: 12, height: 12, borderRadius: '50%', background: '#ffd79a', boxShadow: '0 0 20px 8px rgba(255,190,110,.55)', animation: 'cr-spark 1.8s ease-in-out infinite' }} />
    </span>
  )
}
