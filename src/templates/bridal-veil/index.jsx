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
import { Words, Letters, Rise, Stagger, Photo, Roll, Burst, Confetti } from '../_shared/viral'
import { VIRAL_CSS, useInView } from '../_shared/viralHooks'
import { resolvePhotos } from '../templatePhotos'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { PaletteContext, resolvePalette, scaleFont } from '../_shared/palette'

/* ─────────────────────────────────────────────────────────────────────────────
   GƏLİN — «viral video» toy seriyası (2026-11)

   Konsept: duvaqlı gəlin. Açılış Reels kadrıdır:
     1. ekran ağ tül duvaqla örtülüdür — altında gəlinin silueti, duvaq yellənir
     2. «Duvağı qaldırın» — duvaq yuxarı sürüşüb itir, kadr aydınlaşır
     3. adlar hərf-hərf yazılır, kadr pəncərə önündəki gəlinə keçir
     4. açılış həmin kadra — səhifənin örtüyünə — həll olur
   Daxildə: ağ güllü buket, böyük tarix rəqəmi, iki kadrlı parallaks,
   ağ güllər fonunda son kadr. Fotolar GPT Image ilə yaradılıb (public/img/wedding/viral).
   Şriftlər: Cormorant Upright (mətn, başlıq) · Corinthia (adlar) — Ə var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('bridal-veil')
const ID = 'bridal-veil'

const LINKS = { primary: ['GUL'], secondary: ['SEDEF'], accent: ['GUL'], background: ['AG'], text: ['KOMUR'] }

const KEYFRAMES = (C) => (`
@keyframes bv-sway { 0%,100% { translate: 0 0; rotate: 0deg } 50% { translate: -1.5% 1%; rotate: -.6deg } }
@keyframes bv-out { to { opacity: 0 } }
@keyframes bv-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(185,143,134,.35) } 60% { box-shadow: 0 0 0 14px rgba(185,143,134,0) } }
[data-bv] canvas, [data-bv] div[aria-hidden="true"], [data-bv] span[aria-hidden="true"] { pointer-events: none; }
[data-bv] ::placeholder { color: ${alpha(C.BOZ, 0.75)}; font-style: italic; }
[data-bv] input:focus-visible, [data-bv] textarea:focus-visible { border-color: ${C.GUL} !important; outline: none; }
[data-bv] button:focus-visible, [data-bv] a:focus-visible, [data-bv] [role="button"]:focus-visible { outline: 2px solid ${C.GUL}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-bv] *, [data-bv] { animation: none !important; transition: none !important; } }
`)

const OPEN_MS = 5800
const REVEAL_MS = 4900
const ph = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }

/* ═══ AÇILIŞ: duvaq qalxır ═══ */
function VeilOpening({ inv, theme, C, scriptFont, weddingData, T }) {
  const P = resolvePhotos(PHOTOS, inv.images)
  const { ot } = inv
  const gate = useGate({ inv, ms: OPEN_MS, revealAt: REVEAL_MS })
  if (gate.gone) return null
  const go = gate.opening
  const { titleOv, first, second } = openingNames(inv)
  const names = titleOv !== '' ? [first, second].filter(Boolean).join(` ${ot.text('and') || inv.and} `) : ''
  return (
    <div {...gate.gateProps} data-bv style={{
      position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: C.AG, color: C.KOMUR,
      fontFamily: theme.fonts.body, animation: go ? `bv-out .9s ease ${(REVEAL_MS + 100) / 1000}s forwards` : undefined,
    }}>
      {P.opening && (<img src={P.opening} alt="" style={{ ...ph, objectPosition: '63% 22%', transformOrigin: '63% 22%', transform: go ? 'scale(1)' : 'scale(1.12)', transition: 'transform 7s cubic-bezier(.2,.6,.2,1)' }} />)}
      {P.hero && (<img src={P.hero} alt="" style={{ ...ph, objectPosition: '58% 25%', opacity: go ? 1 : 0, transform: go ? 'scale(1)' : 'scale(1.1)', transition: 'opacity 1.4s ease 3.4s, transform 7s cubic-bezier(.2,.6,.2,1) 3.4s' }} />)}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(255,255,255,0) 50%, rgba(255,255,255,.88))', opacity: go ? 1 : 0, transition: 'opacity 1.6s 1.4s' }} />

      {/* duvaq: bulanıq tül + ağ örtük */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: '-8% -4% 0', zIndex: 3, overflow: 'hidden', transform: go ? 'translateY(-108%) scaleY(1.06)' : 'none', opacity: go ? 0 : 1, transition: 'transform 2.6s cubic-bezier(.6,.02,.25,1), opacity 2.4s ease .4s' }}>
        {P.opening && (<img src={P.opening} alt="" style={{ ...ph, objectPosition: '63% 22%', filter: 'blur(18px) brightness(1.25) saturate(.6)', transform: 'scale(1.1)', animation: 'bv-sway 6s ease-in-out infinite' }} />)}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,.72), rgba(255,255,255,.5) 60%, rgba(255,255,255,.7))' }} />
      </div>

      {/* toxunmadan əvvəl */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '0 22px', textAlign: 'center', opacity: go ? 0 : 1, transition: 'opacity .7s' }}>
        {ot.show('kicker') && <div style={{ fontSize: 17, fontStyle: 'italic', color: C.BOZ }}>{ot.text('kicker')}</div>}
        {names && <div style={{ fontFamily: scriptFont, fontSize: nameSize(names), lineHeight: 1, color: C.KOMUR }}>{names}</div>}
        {ot.show('meta') && <div style={{ fontSize: 16, color: C.BOZ }}>{ot.text('meta')}</div>}
        {ot.show('cta') && <span style={{ marginTop: 18, display: 'inline-flex', alignItems: 'center', minHeight: 50, padding: '14px 30px', borderRadius: 999, border: `1px solid ${alpha(C.KOMUR, 0.35)}`, background: alpha(C.AG, 0.6), fontSize: 17, animation: 'bv-pulse 2.6s ease-in-out infinite' }}>{ot.text('cta')}</span>}
        {ot.show('hint') && <div style={{ fontSize: 13.5, color: C.BOZ }}>{ot.text('hint')}</div>}
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
    <div ref={ref} style={{ position: 'absolute', left: 0, right: 0, bottom: 46, padding: '0 18px', textAlign: 'center' }}>
      <div style={{ fontStyle: 'italic', fontSize: 17, color: C.KOMUR, opacity: 0.75, animation: a(0.2) }}>{kicker}</div>
      <h1 style={{ margin: '6px 0 10px', fontWeight: 400 }}>
        <Letters text={name} on={instant || (on && seen)} delay={start + 0.35} step={0.07} style={{ display: 'block', fontFamily: scriptFont, fontSize: nameSize(name, true), lineHeight: 0.98 }} />
      </h1>
      <div style={{ fontSize: 19, animation: a(1.4) }}>{inv.fullDate}</div>
      <div style={{ marginTop: 2, fontSize: 16, color: C.BOZ, animation: a(1.6) }}>{[inv.time, weddingData.venueName].filter(Boolean).join(', ')}</div>
      <div style={{ marginTop: 18, fontStyle: 'italic', fontSize: 14.5, color: C.BOZ, animation: a(2.2) }}>
        {T.scroll}
        <span aria-hidden="true" style={{ display: 'block', width: 1, height: 24, margin: '8px auto 0', background: C.GUL, transformOrigin: 'top', animation: 'vr-drop 2.2s ease-in-out infinite' }} />
      </div>
    </div>
  )
}

function Panel({ id, section, title, kicker, sub, children, head, C, tone = 'white', center = false }) {
  const bg = tone === 'pearl' ? C.SEDEF : tone === 'tulle' ? C.TUL : C.AG
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '66px 26px 70px', overflow: 'hidden', background: bg, color: C.KOMUR, textAlign: center ? 'center' : undefined }}>
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 480, margin: '0 auto' }}>
        {title && <Words as="h2" text={title} style={{ margin: 0, fontFamily: head, fontWeight: 400, fontSize: scaleFont('clamp(32px, 9vw, 40px)', C.hs), lineHeight: 1.08 }} />}
        {kicker && <Rise delay={0.2} style={{ marginTop: 8, fontSize: 16.5, fontStyle: 'italic', color: C.GUL }}>{kicker}</Rise>}
        {sub && <Rise delay={0.25} as="p" style={{ margin: center ? '10px auto 0' : '10px 0 0', maxWidth: '32ch', fontSize: 17, color: C.BOZ, lineHeight: 1.55 }}>{sub}</Rise>}
        <div style={{ marginTop: title || kicker || sub ? 28 : 0 }}>{children}</div>
      </div>
    </section>
  )
}

/* Böyük tarix rəqəmi: gün aşağıdan qalxır */
function BigDay({ date, C, head, fullDate }) {
  const [ref, seen] = useInView(0.3)
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(date || ''))
  if (!m) return null
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{ overflow: 'hidden', lineHeight: 0.9 }}>
        <div style={{ fontFamily: head, fontWeight: 300, fontSize: 'clamp(140px, 46vw, 200px)', color: C.KOMUR, translate: seen ? '0 0' : '0 100%', transition: 'translate 1.3s cubic-bezier(.2,.8,.2,1)' }}>{+m[3]}</div>
      </div>
      <div style={{ fontFamily: head, fontStyle: 'italic', fontSize: 22, color: C.GUL, marginTop: 6, opacity: seen ? 1 : 0, transition: 'opacity 1s .7s' }}>{fullDate}</div>
    </div>
  )
}

/* İki kadr, fərqli sürətlə. Admin birini gizlədəndə digəri tək (enli) göstərilir. */
function Pair({ P }) {
  const shots = [[P.pair1, '62% 40%', 0.08], [P.pair2, '58% 38%', 0.2]].filter(([src]) => src)
  if (!shots.length) return null
  const two = shots.length > 1
  return (
    <div data-section="photo" style={{ display: 'grid', gridTemplateColumns: two ? '1fr 1fr' : '1fr', gap: 10, padding: '0 10px', background: '#fff' }}>
      {shots.map(([src, focus, par], i) => (
        <Photo key={i} src={src} focus={focus} par={par} style={{ aspectRatio: two ? '3 / 4.6' : '4 / 5', marginTop: two && i === 1 ? 60 : 0 }} />
      ))}
    </div>
  )
}

function End({ inv, C, T, scriptFont }) {
  const P = resolvePhotos(PHOTOS, inv.images)
  const [ref, seen] = useInView(0.3)
  const names = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  return (
    <section ref={ref} data-section="finale" style={{ position: 'relative', height: '88svh', minHeight: 520, overflow: 'hidden', textAlign: 'center', color: C.KOMUR }}>
      {P.finale && (<Photo src={P.finale} par={0} wipe={false} focus="50% 50%" style={{ position: 'absolute', inset: 0 }} />)}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(80% 60% at 50% 50%, rgba(255,255,255,.88), rgba(255,255,255,.35))' }} />
      {seen && <Confetti count={26} loop colors={['#FFFFFF', '#F3F2F0', '#E9DFDA']} alpha={0.85} />}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 20px' }}>
        <Words text={T.end} style={{ fontStyle: 'italic', fontSize: 19, color: C.BOZ, maxWidth: '24ch' }} />
        <Letters text={names} on={seen} delay={0.5} step={0.07} style={{ display: 'block', marginTop: 10, fontFamily: scriptFont, fontSize: nameSize(names), lineHeight: 1.05 }} />
        <div style={{ marginTop: 12, fontSize: 16, color: C.BOZ, opacity: seen ? 1 : 0, transition: 'opacity 1s 1.8s' }}>{inv.fullDate}</div>
      </div>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${alpha(C.KOMUR, 0.28)}`, borderRadius: 0,
  padding: '12px 2px', fontSize: 18, color: C.KOMUR, outline: 'none',
})
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 17, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.KOMUR : 'transparent', color: on ? C.AG : C.KOMUR, border: `1px solid ${alpha(C.KOMUR, on ? 1 : 0.4)}`,
}))
const suggest = (C) => ({ bg: '#FFFFFF', border: `1px solid ${alpha(C.KOMUR, 0.18)}`, active: alpha(C.GUL, 0.16), text: C.KOMUR, table: C.GUL, radius: 12 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function BridalVeilTemplate(props) {
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
    <PaletteContext.Provider value={C}><div data-bv data-vr lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.AG, minHeight: '100vh', fontFamily: body, color: C.KOMUR, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale * 1.06}em` : '1.06em', '--tpl-glow': alpha(C.GUL, 0.25),
    }}>
      <style>{VIRAL_CSS + KEYFRAMES(C)}</style>
      {veil && <VeilOpening inv={inv} theme={theme} C={C} scriptFont={scriptFont} weddingData={weddingData} T={T} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: alpha(C.AG, 0.85), border: `1px solid ${alpha(C.KOMUR, 0.2)}`, backdropFilter: 'blur(6px)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.GUL} idle={alpha(C.GUL, 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.AG, 0.88), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: C.KOMUR, borderBottom: `1px solid ${alpha(C.KOMUR, 0.08)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.BOZ, fontSize: 15, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontSize: 19, color: C.GUL }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — pəncərə önündə gəlin */}
          <section data-section="hero" style={{ position: 'relative', marginTop: -52, height: '100svh', minHeight: 560, overflow: 'hidden' }}>
            {P.hero && (<Photo src={P.hero} alt="" par={0} wipe={false} focus="58% 25%" style={{ position: 'absolute', inset: 0 }} />)}
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(255,255,255,0) 50%, rgba(255,255,255,.9))' }} />
            <HeroText inv={inv} weddingData={weddingData} T={T} scriptFont={scriptFont} C={C} name={heroName} kicker={L('hero', 'kicker', inv.eventLabel)} instant={veil} />
          </section>

          {/* Dəvət */}
          <section data-section="invite" style={{ padding: '64px 28px 58px', textAlign: 'center', background: C.AG }}>
            <Words as="p" text={tr.inv_join} step={0.045} style={{ margin: '0 auto', maxWidth: '25ch', fontFamily: head, fontWeight: 300, fontSize: 'clamp(22px, 6.4vw, 26px)', lineHeight: 1.55 }} />
            {inv.isCorp && weddingData.organizer?.trim() && <Rise style={{ marginTop: 10, fontSize: 16, color: C.BOZ }}>{tr.organizer_display}: {weddingData.organizer}</Rise>}
          </section>

          {/* SAYĞAC — böyük gün rəqəmi */}
          {S.countdown && (
            <Panel section="countdown" head={head} C={C} tone="tulle" center title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <BigDay date={weddingData.date} C={C} head={head} fullDate={inv.fullDate} />
              <Rise delay={0.2} style={{ display: 'flex', justifyContent: 'center', gap: 22, marginTop: 30, paddingTop: 22, borderTop: `1px solid ${alpha(C.KOMUR, 0.1)}`, fontVariantNumeric: 'tabular-nums' }}>
                {[[T.left, cd.days], [cd.labels.hours, cd.hours], [cd.labels.minutes, cd.minutes], [cd.labels.seconds, cd.seconds]].map(([lbl, v], i) => (
                  <div key={i} style={{ minWidth: 54 }}>
                    <div style={{ fontFamily: head, fontSize: i === 0 ? 34 : 26, lineHeight: 1.1, color: i === 0 ? C.GUL : C.KOMUR }}><Roll value={i === 0 ? v : String(v).padStart(2, '0')} /></div>
                    <div style={{ marginTop: 4, fontSize: 14, fontStyle: 'italic', color: C.BOZ }}>{lbl}</div>
                  </div>
                ))}
              </Rise>
            </Panel>
          )}

          {/* Buket */}
          {P.bouquet && (<div data-section="photo" style={{ position: 'relative', height: '68svh', minHeight: 400 }}>
            <Photo src={P.bouquet} alt="" focus="58% 38%" style={{ position: 'absolute', inset: 0 }}>
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(255,255,255,.9), transparent 45%)' }} />
              <Words text={T.bouquet} step={0.08} style={{ position: 'absolute', left: 24, right: 24, bottom: 26, maxWidth: '22ch', fontFamily: head, fontStyle: 'italic', fontSize: 23, lineHeight: 1.35, color: C.KOMUR }} />
            </Photo>
          </div>)}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {S.program && (
            <Panel section="program" head={head} C={C} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <Stagger step={0.12}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '70px minmax(0, 1fr)', gap: 12, alignItems: 'baseline', padding: '16px 0', borderTop: `1px solid ${alpha(C.KOMUR, 0.1)}` }}>
                    <div style={{ fontFamily: scriptFont, fontSize: 30, lineHeight: 1, color: C.GUL, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    <div style={{ fontSize: 19, lineHeight: 1.35 }}>{ev.label}</div>
                  </div>
                ))}
              </Stagger>
            </Panel>
          )}

          <Pair P={P} />

          {S.venue && (
            <Panel section="venue" head={head} C={C} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <Rise style={{ overflow: 'hidden', isolation: 'isolate', borderRadius: '160px 160px 4px 4px' }}>
                <MapSection
                  weddingData={weddingData} theme={theme} accent={C.GUL} height="clamp(280px, 80vw, 340px)"
                  map={{ opacity: 0.9, filter: 'grayscale(.7) brightness(1.08)', tintOpacity: 0.1, tint: C.GUL, blend: 'multiply' }}
                  frame={<MapPin C={C} />}
                  fallback={<div style={{ height: 'clamp(280px, 80vw, 340px)', position: 'relative', background: C.TUL }}><MapPin C={C} /></div>}
                />
              </Rise>
              <Words text={weddingData.venueName || ''} step={0.1} style={{ marginTop: 22, fontFamily: head, fontSize: 30, lineHeight: 1.15 }} />
              {weddingData.venueNote && <Rise delay={0.2} style={{ marginTop: 6, fontStyle: 'italic', fontSize: 16, color: C.BOZ }}>{weddingData.venueNote}</Rise>}
              <Rise delay={0.3}><VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} /></Rise>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} C={C} tone="tulle" title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <Rise>
                <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="left" />
              </Rise>
            </Panel>
          )}

          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} C={C} center title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <div style={{ position: 'relative', textAlign: 'left' }}>
                <Burst fire={seating.selected?.full_name} color="185,143,134" />
                <SeatFinder inv={inv} tr={tr} listId="bv-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={C.BOZ} accent={C.GUL}
                  nameStyle={{ fontFamily: head, fontSize: 22 }}
                  card={(num) => (
                    <div style={{ display: 'inline-block', minWidth: 190, padding: '26px 22px 20px', borderRadius: '120px 120px 6px 6px', background: C.TUL, animation: 'vr-up .7s cubic-bezier(.2,.8,.2,1) both' }}>
                      <div style={{ fontFamily: scriptFont, fontSize: tableSize(num, 100), lineHeight: 1, color: C.GUL }}>{num}</div>
                      <div style={{ fontSize: 15, fontStyle: 'italic', color: C.BOZ }}>{T.table}</div>
                    </div>
                  )} />
              </div>
            </Panel>
          )}

          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} C={C} tone="tulle" title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, marginBottom: 28 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <Rise key={i} delay={(i % 2) * 0.12} style={{ aspectRatio: '3 / 4', overflow: 'hidden', borderRadius: i % 3 === 0 ? '90px 90px 4px 4px' : 4, background: C.SEDEF, marginTop: i % 2 ? 26 : 0 }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} className="vr-kb" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </Rise>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.KOMUR} bg="#FFFFFF" frame={{ border: `1px solid ${alpha(C.KOMUR, 0.14)}`, borderRadius: 12 }}
                btn={btn(C)} muted={C.BOZ} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {S.rsvp && (
            <Panel section="rsvp" head={head} C={C} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <div style={{ position: 'relative' }}>
                {rsvp.submitted && <Confetti count={60} colors={['#FFFFFF', '#E9DFDA', '#B98F86', '#F3F2F0']} />}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <ReplyForm inv={inv} t={{
                    ink: C.KOMUR, muted: C.BOZ, line: alpha(C.KOMUR, 0.3), hair: alpha(C.KOMUR, 0.1), accent: C.GUL,
                    font: body, display: head, displayItalic: false, btnFont: body, radius: 999,
                    doneMark: P.rsvpDone ? <img src={P.rsvpDone} alt="" style={{ width: 92, height: 92, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 14px', display: 'block' }} /> : null,
                    marker: (a) => <span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', background: a ? C.GUL : 'transparent', border: a ? 'none' : `1px solid ${alpha(C.KOMUR, 0.4)}`, transition: 'background .3s' }} />,
                    suggest: { ...suggest(C), font: body },
                  }} />
                </div>
              </div>
            </Panel>
          )}

          {S.guestbook && (
            <Panel section="guestbook" head={head} C={C} tone="tulle" title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={field(C)} btn={btn(C)} errorColor="#A04A43" />
              <Stagger step={0.1}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: '14px 0 0', padding: '18px 20px', background: '#FFFFFF', borderRadius: 14 }}>
                      <blockquote style={{ margin: 0, fontFamily: head, fontSize: 19, lineHeight: 1.5 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 6, fontFamily: scriptFont, fontSize: 28, lineHeight: 1.1, color: C.GUL }}>
                        {msg.name}{msg.date ? <span style={{ fontFamily: body, fontSize: 13, color: C.BOZ }}> · {gbook.formatDate(msg.date)}</span> : null}
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

function MapPin({ C }) {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -14, top: -14, width: 28, height: 28, borderRadius: '50%', background: '#fff', border: `6px solid ${C.GUL}`, boxShadow: '0 6px 16px rgba(44,38,39,.3)' }} />
    </span>
  )
}
