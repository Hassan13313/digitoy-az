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
import { Words, Rise, Stagger, Photo, Roll } from '../_shared/viral'
import { VIRAL_CSS, useInView, coverSpot, reduced, vimg } from '../_shared/viralHooks'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { PaletteContext, resolvePalette, scaleFont } from '../_shared/palette'

/* ─────────────────────────────────────────────────────────────────────────────
   ŞAHDAĞ — lüks toy seriyası (2026-11)

   Konsept: Böyük Qafqazda qış toyu. Qarlı zirvələr, daş və taxta dağ evi,
   şam işığında şam yeməyi, fənərli cığır.
   Açılış örtüyün ÖZÜDÜR (Frame — açılışda və örtükdə eyni kadr):
     1. mavi saat, qar yağır, adlar səmada, «Dəvəti açın»
     2. toxunanda dağ evinin pəncərələrində isti işıq yanır, zirvələr
        çəhrayı parlayır, aşağıda tarix görünür; qar yağmağa davam edir
   Daxildə: qar ağı və tünd şifer növbələşir; böyük rəqəmlər; dağ evinin
   içində proqram; qış buketi; fənərli cığırda son kadr.
   Fotolar GPT Image ilə bu şablon üçün yaradılıb (public/img/wedding/viral/sd-*).
   Şriftlər: Playfair Display SC (adlar, başlıq) · Plus Jakarta Sans (mətn) — Ə var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('shahdag')
const ID = 'shahdag'
/* sd-1 fotosunda dağ evinin pəncərələri (0..1) */
const WINDOWS = [[0.66, 0.52], [0.95, 0.47]]

const LINKS = { primary: ['SLATE'], secondary: ['FROST'], accent: ['AMBER'], background: ['SNOW'], text: ['SLATE'] }

const KEYFRAMES = (C) => (`
@keyframes sd-out { to { opacity: 0 } }
@keyframes sd-glow { from { opacity: 0; scale: .4 } to { opacity: 1; scale: 1 } }
@keyframes sd-flick { 0%,100% { opacity: .9 } 45% { opacity: 1 } 60% { opacity: .82 } }
@keyframes sd-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(246,247,248,.35) } 60% { box-shadow: 0 0 0 14px rgba(246,247,248,0) } }
@keyframes sd-rise { from { opacity: 0; translate: 0 16px } to { opacity: 1; translate: 0 0 } }
[data-sd] canvas, [data-sd] div[aria-hidden="true"], [data-sd] span[aria-hidden="true"] { pointer-events: none; }
[data-sd] ::placeholder { color: ${alpha(C.MUTE, 0.85)}; }
[data-sd] input:focus-visible, [data-sd] textarea:focus-visible { border-color: ${C.AMBER} !important; outline: none; }
[data-sd] button:focus-visible, [data-sd] a:focus-visible, [data-sd] [role="button"]:focus-visible { outline: 1px solid ${C.AMBER}; outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) { [data-sd] *, [data-sd] { animation: none !important; transition: none !important; } }
`)

const OPEN_MS = 4400
const REVEAL_MS = 3500

/* Qar: yavaş, müxtəlif ölçülü dənələr; görünməyəndə dayanır */
function Snow({ count = 70, style }) {
  const [box, seen] = useInView(0)
  const cv = useRef(null)
  useEffect(() => {
    const c = cv.current
    if (!c || !seen || reduced()) return undefined
    const ctx = c.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 0, raf = 0
    const size = () => { W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
    size()
    const flakes = Array.from({ length: count }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 0.6 + Math.random() * 2.2, v: 0.25 + Math.random() * 0.8, p: Math.random() * 6.28 }))
    const tick = () => {
      ctx.clearRect(0, 0, W, H)
      for (const f of flakes) {
        f.y += f.v; f.p += 0.01; f.x += Math.sin(f.p) * 0.35
        if (f.y > H + 4) { f.y = -4; f.x = Math.random() * W }
        ctx.globalAlpha = 0.35 + f.r / 4
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.283); ctx.fillStyle = '#ffffff'; ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    addEventListener('resize', size)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size) }
  }, [seen, count])
  return (
    <div ref={box} aria-hidden="true" style={{ position: 'absolute', inset: 0, ...style }}>
      <canvas ref={cv} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}

/* Pəncərələrdə isti işıq — fotodakı nöqtələrə bağlı */
function WindowGlow({ imgRef, on, instant }) {
  const [pts, setPts] = useState([])
  useEffect(() => {
    const img = imgRef.current
    if (!img) return undefined
    const place = () => setPts(WINDOWS.map(([x, y]) => coverSpot(img, x, y)))
    if (img.complete) place(); else img.addEventListener('load', place)
    addEventListener('resize', place)
    return () => { img.removeEventListener('load', place); removeEventListener('resize', place) }
  }, [imgRef])
  if (!on) return null
  return pts.map(([x, y], i) => (
    <div key={i} aria-hidden="true" style={{
      position: 'absolute', left: `${x * 100}%`, top: `${y * 100}%`, width: 280, height: 280, margin: '-140px 0 0 -140px', mixBlendMode: 'screen',
      background: 'radial-gradient(circle, rgba(255,200,120,.75) 0, rgba(255,170,80,.28) 25%, rgba(255,150,60,0) 60%)',
      animation: instant ? 'sd-flick 4s ease-in-out infinite' : `sd-glow 2s cubic-bezier(.2,.7,.2,1) ${0.4 + i * 0.5}s both, sd-flick 4s ease-in-out 3s infinite`,
    }} />
  ))
}

/* ═══ ÇƏRÇİVƏ: açılış və örtük eyni kadrdır ═══ */
function Frame({ inv, weddingData, T, C, fonts, kicker, name, go, gate = false, instant = false }) {
  const { ot } = inv
  const img = useRef(null)
  const t = (v) => (instant ? 'none' : v)
  return (
    <>
      <img ref={img} src={vimg('sd-1')} alt="" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%',
        filter: go ? 'none' : 'brightness(.62) saturate(.6) hue-rotate(12deg)', scale: go ? '1' : '1.06',
        transition: t('filter 3s cubic-bezier(.3,0,.2,1), scale 7s cubic-bezier(.2,.6,.2,1)'),
      }} />
      <WindowGlow imgRef={img} on={go} instant={instant} />
      <Snow />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,32,.45) 0%, rgba(15,23,32,0) 30%, rgba(15,23,32,0) 64%, rgba(15,23,32,.75) 100%)' }} />

      <div style={{ position: 'absolute', left: 0, right: 0, top: 'max(9svh, 54px)', textAlign: 'center', padding: '0 20px', color: C.SNOW }}>
        {kicker && <div style={{ fontSize: 12.5, fontWeight: 500, letterSpacing: '.3em', textTransform: 'uppercase', opacity: 0.85 }}>{kicker}</div>}
        <h1 style={{ margin: '14px 0 0', fontFamily: fonts.head, fontWeight: 400, fontSize: nameSize(name, true), lineHeight: 1.08, letterSpacing: '.04em' }}>{name}</h1>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 'max(7svh, 40px)', textAlign: 'center', padding: '0 20px', color: C.SNOW }}>
        <div style={{ opacity: go ? 1 : 0, translate: go ? '0 0' : '0 10px', transition: t('opacity 1.4s 1.8s, translate 1.4s 1.8s') }}>
          <div style={{ fontFamily: fonts.head, fontSize: 20, letterSpacing: '.06em' }}>{inv.fullDate}</div>
          <div style={{ marginTop: 4, fontSize: 14.5, opacity: 0.85 }}>{[inv.time, weddingData.venueName].filter(Boolean).join(', ')}</div>
          {!gate && <div style={{ marginTop: 16, fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', opacity: 0.7 }}>{T.scroll}</div>}
        </div>
        {gate && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, opacity: go ? 0 : 1, transition: 'opacity .7s', pointerEvents: go ? 'none' : undefined }}>
            {ot.show('cta') && <span style={{ display: 'inline-flex', alignItems: 'center', minHeight: 52, padding: '0 32px', borderRadius: 999, border: `1px solid ${alpha(C.SNOW, 0.6)}`, background: alpha(C.NIGHT, 0.35), backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', fontSize: 15.5, letterSpacing: '.04em', animation: 'sd-pulse 2.6s ease-in-out infinite' }}>{ot.text('cta')}</span>}
            {ot.show('hint') && <div style={{ marginTop: 10, fontSize: 12.5, opacity: 0.75 }}>{ot.text('hint')}</div>}
          </div>
        )}
      </div>
    </>
  )
}

function WinterOpening({ inv, weddingData, T, C, fonts }) {
  const gate = useGate({ inv, ms: OPEN_MS, revealAt: REVEAL_MS })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const name = titleOv === '' ? '' : [first, second].filter(Boolean).join(` ${inv.ot.text('and') || inv.and} `)
  return (
    <div {...gate.gateProps} data-sd style={{
      position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: C.NIGHT, color: C.SNOW, fontFamily: fonts.body,
      animation: gate.opening ? `sd-out .9s ease ${(REVEAL_MS + 100) / 1000}s forwards` : undefined,
    }}>
      <Frame inv={inv} weddingData={weddingData} T={T} C={C} fonts={fonts} kicker={inv.L('hero', 'kicker', inv.ot.text('kicker'))} name={name} go={gate.opening} gate />
    </div>
  )
}

function Panel({ id, section, title, sub, children, head, C, dark = false, center = false }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '78px 26px', background: dark ? C.SLATE : C.SNOW, color: dark ? C.SNOW : C.SLATE, textAlign: center ? 'center' : undefined }}>
      <div style={{ maxWidth: 440, margin: '0 auto' }}>
        {title && <Words as="h2" text={title} style={{ margin: 0, fontFamily: head, fontWeight: 400, fontSize: scaleFont('clamp(28px, 8vw, 36px)', C.hs), lineHeight: 1.12, letterSpacing: '.02em' }} />}
        {title && <Rise delay={0.15} aria-hidden="true" style={{ width: 40, height: 2, margin: center ? '18px auto 0' : '18px 0 0', background: C.AMBER }} />}
        {sub && <Rise delay={0.2} as="p" style={{ margin: center ? '14px auto 0' : '14px 0 0', maxWidth: '32ch', fontSize: 15.5, color: dark ? alpha(C.SNOW, 0.7) : C.MUTE }}>{sub}</Rise>}
        <div style={{ marginTop: title || sub ? 28 : 0 }}>{children}</div>
      </div>
    </section>
  )
}

const field = (C, dark) => ({
  width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${alpha(dark ? C.SNOW : C.SLATE, 0.3)}`, borderRadius: 0,
  padding: '12px 2px', fontSize: 17, color: dark ? C.SNOW : C.SLATE, outline: 'none',
})
const btn = (C, dark) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '0 24px', borderRadius: 999,
  fontSize: 15, letterSpacing: '.02em', textDecoration: 'none', cursor: 'pointer',
  background: on ? C.AMBER : 'transparent', color: on ? '#1B1209' : (dark ? C.SNOW : C.SLATE), border: `1px solid ${on ? C.AMBER : alpha(dark ? C.SNOW : C.SLATE, 0.35)}`,
}))
const suggest = (C) => ({ bg: '#FFFFFF', border: `1px solid ${alpha(C.SLATE, 0.18)}`, active: alpha(C.AMBER, 0.14), text: C.SLATE, table: C.AMBER, radius: 8 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function ShahdagTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const fonts = { head, body }
  const T = inv.copy(TXT)
  const [veil] = useState(() => !inv.opened)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)

  return (
    <PaletteContext.Provider value={C}><div data-sd data-vr lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.SNOW, minHeight: '100vh', fontFamily: body, color: C.SLATE, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.AMBER, 0.3),
    }}>
      <style>{VIRAL_CSS + KEYFRAMES(C)}</style>
      {veil && <WinterOpening inv={inv} weddingData={weddingData} T={T} C={C} fonts={fonts} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: alpha(C.NIGHT, 0.55), border: `1px solid ${alpha(C.SNOW, 0.4)}`, backdropFilter: 'blur(8px)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.AMBER} idle={alpha(C.AMBER, 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.NIGHT, 0.7), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: C.SNOW,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.SNOW, 0.75), fontSize: 14, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontSize: 15, letterSpacing: '.12em' }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          <section data-section="hero" style={{ position: 'relative', marginTop: -52, height: '100svh', minHeight: 600, overflow: 'hidden', background: C.NIGHT }}>
            <Frame inv={inv} weddingData={weddingData} T={T} C={C} fonts={fonts} kicker={L('hero', 'kicker', inv.ot.text('kicker'))} name={heroName} go instant={veil} />
          </section>

          <section data-section="invite" style={{ padding: '76px 26px 64px', textAlign: 'center', background: C.SNOW }}>
            <Words as="p" text={tr.inv_join} step={0.04} style={{ margin: '0 auto', maxWidth: '28ch', fontSize: 'clamp(18px, 5.2vw, 21px)', lineHeight: 1.7 }} />
            {inv.isCorp && weddingData.organizer?.trim() && <Rise style={{ marginTop: 12, fontSize: 14.5, color: C.MUTE }}>{tr.organizer_display}: {weddingData.organizer}</Rise>}
          </section>

          {S.countdown && (
            <Panel section="countdown" head={head} C={C} dark center title={L('countdown', 'title', cd.title)}>
              <Snow count={40} style={{ opacity: 0.6 }} />
              <Rise style={{ position: 'relative' }}>
                <div style={{ fontFamily: head, fontSize: 'clamp(96px, 30vw, 136px)', lineHeight: 0.95, letterSpacing: '.02em' }}><Roll value={cd.days} /></div>
                <div style={{ marginTop: 8, fontSize: 13, fontWeight: 500, letterSpacing: '.28em', textTransform: 'uppercase', color: C.AMBER }}>{T.left}</div>
              </Rise>
              <Rise delay={0.2} style={{ position: 'relative', display: 'flex', justifyContent: 'center', gap: 30, marginTop: 30, paddingTop: 22, borderTop: `1px solid ${alpha(C.SNOW, 0.18)}`, fontVariantNumeric: 'tabular-nums' }}>
                {[['hours', cd.hours], ['minutes', cd.minutes], ['seconds', cd.seconds]].map(([k, v]) => (
                  <div key={k}><b style={{ display: 'block', fontFamily: head, fontWeight: 400, fontSize: 26 }}>{String(v).padStart(2, '0')}</b><span style={{ fontSize: 12.5, color: alpha(C.SNOW, 0.65) }}>{cd.labels[k]}</span></div>
                ))}
              </Rise>
            </Panel>
          )}

          {/* Qış buketi */}
          <div data-section="photo" style={{ position: 'relative', height: '84svh', minHeight: 500 }}>
            <Photo src={vimg('sd-3')} alt="" focus="50% 35%" style={{ position: 'absolute', inset: 0 }}>
              <Snow count={36} />
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,32,.6), transparent 45%)' }} />
              <Words text={T.bouquet} step={0.1} style={{ position: 'absolute', left: 24, right: 24, bottom: 30, fontFamily: head, fontSize: 'clamp(24px, 7vw, 30px)', lineHeight: 1.25, letterSpacing: '.03em', color: C.SNOW }} />
            </Photo>
          </div>

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {S.program && (
            <section data-section="program" style={{ position: 'relative', background: C.NIGHT, color: C.SNOW }}>
              <Photo src={vimg('sd-2')} alt="" focus="50% 50%" style={{ height: '74svh', minHeight: 440 }} />
              <div style={{ padding: '12px 26px 80px' }}><div style={{ maxWidth: 440, margin: '0 auto' }}>
                <Words as="h2" text={L('program', 'title', timeline.sectionLabel)} style={{ margin: '30px 0 0', fontFamily: head, fontWeight: 400, fontSize: scaleFont('clamp(28px, 8vw, 36px)', C.hs), lineHeight: 1.12, letterSpacing: '.02em' }} />
                <Rise delay={0.15} aria-hidden="true" style={{ width: 40, height: 2, margin: '18px 0 0', background: C.AMBER }} />
                <Stagger step={0.12} style={{ marginTop: 20 }}>
                  {timeline.events.map((ev, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '72px minmax(0, 1fr)', gap: 14, alignItems: 'baseline', padding: '16px 0', borderBottom: `1px solid ${alpha(C.SNOW, 0.12)}` }}>
                      <div style={{ fontFamily: head, fontSize: 20, color: C.AMBER, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                      <div style={{ fontSize: 17, lineHeight: 1.4 }}>{ev.label}</div>
                    </div>
                  ))}
                </Stagger>
              </div></div>
            </section>
          )}

          {S.venue && (
            <Panel section="venue" head={head} C={C} title={L('venue', 'title', tr.inv_location)}>
              <Rise style={{ overflow: 'hidden', isolation: 'isolate', borderRadius: 4 }}>
                <MapSection
                  weddingData={weddingData} theme={theme} accent={C.SLATE} height="clamp(240px, 68vw, 300px)"
                  map={{ opacity: 0.9, filter: 'grayscale(.85) brightness(1.08) contrast(.95)', tintOpacity: 0.1, tint: '#7FA0C0', blend: 'multiply' }}
                  frame={<MapPin C={C} />}
                  fallback={<div style={{ height: 'clamp(240px, 68vw, 300px)', position: 'relative', background: C.FROST }}><MapPin C={C} /></div>}
                />
              </Rise>
              <Words text={weddingData.venueName || ''} step={0.1} style={{ marginTop: 22, fontFamily: head, fontSize: 28, lineHeight: 1.15, letterSpacing: '.02em' }} />
              {weddingData.venueNote && <Rise delay={0.2} style={{ marginTop: 6, fontSize: 15, color: C.MUTE }}>{weddingData.venueNote}</Rise>}
              <Rise delay={0.3}><VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} style={{ justifyContent: 'flex-start' }} /></Rise>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} C={C} title={L('dresscode', 'title', tr.inv_dresscode)}>
              <Rise>
                <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="left" />
              </Rise>
              <Rise delay={0.2} style={{ marginTop: 22, padding: '14px 18px', background: C.FROST, borderLeft: `2px solid ${C.AMBER}`, fontSize: 15 }}>{T.warm}</Rise>
            </Panel>
          )}

          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} C={C} dark title={L('seating', 'title', seatingL.title)} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="sd-seat-list" field={field(C, true)} suggest={suggest(C)} font={body} muted={alpha(C.SNOW, 0.65)} accent={C.AMBER}
                nameStyle={{ fontFamily: head, fontSize: 20, letterSpacing: '.03em' }}
                card={(num) => (
                  <div style={{ display: 'inline-block', minWidth: 200, padding: '24px 22px 20px', border: `1px solid ${alpha(C.SNOW, 0.25)}`, background: alpha(C.SNOW, 0.05), animation: 'sd-rise .9s cubic-bezier(.2,.8,.2,1) both' }}>
                    <div style={{ fontFamily: head, fontSize: tableSize(num, 72), lineHeight: 1, color: C.SNOW }}>{num}</div>
                    <div style={{ marginTop: 6, fontSize: 12.5, fontWeight: 500, letterSpacing: '.22em', textTransform: 'uppercase', color: C.AMBER }}>{T.table}</div>
                  </div>
                )} />
            </Panel>
          )}

          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} C={C} title={L('gallery', 'title', tr.inv_gallery)}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, marginBottom: 28 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <Rise key={i} delay={(i % 2) * 0.12} style={{ aspectRatio: '3 / 4', overflow: 'hidden', background: C.FROST }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} className="vr-kb" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </Rise>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.SLATE} bg="#FFFFFF" frame={{ border: `1px solid ${alpha(C.SLATE, 0.15)}` }}
                btn={btn(C)} muted={C.MUTE} desc={galleryDesc(props.adminOverrides, tr, lang, 'night')} />
            </Panel>
          )}

          {S.rsvp && (
            <Panel section="rsvp" head={head} C={C} dark title={L('rsvp', 'title', rsvpL.title)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.SNOW, muted: alpha(C.SNOW, 0.65), line: alpha(C.SNOW, 0.3), hair: alpha(C.SNOW, 0.12), accent: C.AMBER,
                font: body, display: head, displayItalic: false, btnFont: body, radius: 999, btnSolid: true,
                doneMark: <div aria-hidden="true" style={{ width: 10, height: 10, margin: '0 0 18px', borderRadius: '50%', background: '#FFD9A0', boxShadow: '0 0 22px 8px rgba(255,190,110,.5)' }} />,
                marker: (a) => <span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', background: a ? C.AMBER : 'transparent', border: a ? 'none' : `1px solid ${alpha(C.SNOW, 0.5)}`, transition: 'background .3s' }} />,
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {S.guestbook && (
            <Panel section="guestbook" head={head} C={C} title={L('guestbook', 'title', gbookL.title)}>
              <GuestbookForm inv={inv} field={field(C)} btn={btn(C)} errorColor="#A04A43" />
              <Stagger step={0.1} style={{ marginTop: 26 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '20px 0', borderTop: `1px solid ${alpha(C.SLATE, 0.12)}` }}>
                      <blockquote style={{ margin: 0, fontSize: 17, lineHeight: 1.6 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, fontFamily: head, fontSize: 16, letterSpacing: '.04em', color: C.AMBER }}>
                        {msg.name}{msg.date ? <span style={{ fontFamily: body, fontSize: 12.5, color: C.MUTE }}> · {gbook.formatDate(msg.date)}</span> : null}
                      </figcaption>
                    </figure>
                  )
                })}
              </Stagger>
            </Panel>
          )}

          <End inv={inv} T={T} C={C} head={head} name={heroName} />
          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={head} />
        </motion.div>
      )}
    </div></PaletteContext.Provider>
  )
}

function End({ inv, T, C, head, name }) {
  const [ref, seen] = useInView(0.3)
  return (
    <section ref={ref} data-section="finale" style={{ position: 'relative', height: '100svh', minHeight: 600, overflow: 'hidden', textAlign: 'center', color: C.SNOW, background: C.NIGHT }}>
      <Photo src={vimg('sd-4')} par={0} wipe={false} focus="50% 60%" style={{ position: 'absolute', inset: 0 }} />
      <Snow count={80} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,32,.55), rgba(15,23,32,0) 40%)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: '11svh', padding: '0 20px' }}>
        <div style={{ fontSize: 12.5, fontWeight: 500, letterSpacing: '.3em', textTransform: 'uppercase', opacity: seen ? 0.85 : 0, transition: 'opacity 1.2s .2s' }}>{T.end}</div>
        <div style={{ marginTop: 12, fontFamily: head, fontSize: nameSize(name), lineHeight: 1.1, letterSpacing: '.04em', opacity: seen ? 1 : 0, translate: seen ? '0 0' : '0 12px', transition: 'opacity 1.4s .5s, translate 1.4s .5s' }}>{name}</div>
        <div style={{ marginTop: 10, fontSize: 15, opacity: seen ? 0.85 : 0, transition: 'opacity 1.2s 1s' }}>{inv.fullDate}</div>
      </div>
    </section>
  )
}

function MapPin({ C }) {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -9, top: -9, width: 18, height: 18, borderRadius: '50%', background: C.AMBER, border: `4px solid ${C.SNOW}`, boxShadow: '0 6px 14px rgba(15,23,32,.35)' }} />
    </span>
  )
}
