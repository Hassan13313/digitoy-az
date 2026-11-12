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
import { Rise, Stagger, Roll } from '../_shared/viral'
import { VIRAL_CSS, useInView, coverSpot } from '../_shared/viralHooks'
import { resolvePhotos, isCustomPhoto } from '../templatePhotos'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { PaletteContext, resolvePalette, scaleFont } from '../_shared/palette'

/* ─────────────────────────────────────────────────────────────────────────────
   BAKI GECƏSİ — lüks toy seriyası (2026-11)

   Konsept: black tie axşamı, Bakı. Mavi saatda terrasda bəy və gəlin,
   arxada Alov Qüllələri, Teleqüllə və bulvar.
   Açılış örtüyün ÖZÜDÜR (Frame — açılışda və örtükdə eyni kadr):
     1. qaranlıq ekran, adlar səmada, «Dəvəti açın»
     2. toxunanda kadr film kimi qaranlıqdan işıqlanır, şəhər işıqlarında
        ulduz parıltıları yanır (fotodakı işıqlara bağlıdır — coverSpot)
     3. aşağıda tarix və məkan görünür, açılış söner
   Daxildə: tünd göy, sola düzlənmiş redaksiya üslubu; böyük didone rəqəmlər;
   başlıqlar soldan açılır; fotolar qaranlıqdan işıqlanır; parıltılı masa bileti.
   Fotolar GPT Image ilə bu şablon üçün yaradılıb (public/img/wedding/viral/baku-*).
   Şriftlər: Noto Serif Display (başlıq, adlar) · Albert Sans (mətn) — Ə var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('baku-night')
const ID = 'baku-night'

const LINKS = { primary: ['GOLD'], secondary: ['NIGHT2'], accent: ['GOLD'], background: ['NIGHT'], text: ['CHAM'] }

/* baku-1 fotosundakı şəhər işıqları (0..1) */
const LIGHTS = [[0.693, 0.597], [0.612, 0.597], [0.541, 0.591], [0.51, 0.585], [0.488, 0.538], [0.469, 0.584], [0.155, 0.567], [0.107, 0.568], [0.065, 0.568],
  [0.724, 0.601], [0.65, 0.594], [0.646, 0.575], [0.579, 0.588], [0.527, 0.608], [0.57, 0.609], [0.648, 0.617], [0.635, 0.51], [0.668, 0.505], [0.615, 0.52]]

const KEYFRAMES = (C) => (`
@keyframes bn-hold { from { filter: brightness(.14) saturate(.7) } to { filter: brightness(.22) saturate(.7) } }
@keyframes bn-tw { 0%,100% { opacity: 0; scale: .4 } 50% { opacity: .95; scale: 1.25 } }
@keyframes bn-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(201,164,92,.35) } 60% { box-shadow: 0 0 0 14px rgba(201,164,92,0) } }
@keyframes bn-out { to { opacity: 0 } }
@keyframes bn-rise { from { opacity: 0; translate: 0 16px } to { opacity: 1; translate: 0 0 } }
@keyframes bn-glint { from { translate: -100% 0 } to { translate: 100% 0 } }
[data-bn] .bn-tw { position: absolute; width: 3px; height: 3px; margin: -1.5px; border-radius: 50%; background: #fff6dc; box-shadow: 0 0 6px 2px rgba(255,214,140,.7), 0 0 18px 6px rgba(255,196,110,.25); opacity: 0; }
[data-bn] .bn-tw::before, [data-bn] .bn-tw::after { content: ""; position: absolute; left: 50%; top: 50%; width: 26px; height: 1px; margin: -.5px 0 0 -13px; background: linear-gradient(90deg, transparent, rgba(255,240,205,.95), transparent); }
[data-bn] .bn-tw::after { rotate: 90deg; }
[data-bn] .bn-fx { opacity: 0; transition: opacity 1.6s cubic-bezier(.2,.7,.2,1); }
[data-bn] .bn-fx.on { opacity: 1; }
[data-bn] .bn-cl { display: inline-block; clip-path: inset(-20% 100% -25% -4%); transition: clip-path 1.6s cubic-bezier(.65,0,.25,1); }
[data-bn] .on > .bn-cl { clip-path: inset(-20% -10% -25% -4%); }
[data-bn] .bn-ph img { filter: brightness(.25); scale: 1.1; transition: filter 2.4s cubic-bezier(.3,0,.2,1), scale 9s cubic-bezier(.2,.6,.2,1); }
[data-bn] .bn-ph.on img { filter: none; scale: 1; }
[data-bn] canvas, [data-bn] div[aria-hidden="true"], [data-bn] span[aria-hidden="true"] { pointer-events: none; }
[data-bn] ::placeholder { color: ${alpha(C.MUTE, 0.9)}; }
[data-bn] input:focus-visible, [data-bn] textarea:focus-visible { border-color: ${C.GOLD} !important; outline: none; }
[data-bn] button:focus-visible, [data-bn] a:focus-visible, [data-bn] [role="button"]:focus-visible { outline: 1px solid ${C.GOLD}; outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) { [data-bn] *, [data-bn] { animation: none !important; transition: none !important; } [data-bn] .bn-fx { opacity: 1; } [data-bn] .bn-cl { clip-path: none; } [data-bn] .bn-ph img { filter: none; } }
`)

const OPEN_MS = 4600
const REVEAL_MS = 3700

function Fx({ as: Tag = 'div', delay = 0, style, children }) {
  const [ref, seen] = useInView(0.2)
  return <Tag ref={ref} className={`bn-fx${seen ? ' on' : ''}`} style={{ transitionDelay: `${delay}s`, ...style }}>{children}</Tag>
}

/* Başlıq soldan açılır (daxili span kəsilir — IntersectionObserver kəsilmiş elementi görmür) */
function Title({ children, head, C, style }) {
  const [ref, seen] = useInView(0.2)
  return (
    <h2 ref={ref} className={seen ? 'on' : undefined} style={{ margin: '12px 0 0', fontFamily: head, fontWeight: 200, fontSize: scaleFont('clamp(36px, 10.5vw, 46px)', C.hs), lineHeight: 1.04, letterSpacing: '-.015em', ...style }}>
      <span className="bn-cl">{children}</span>
    </h2>
  )
}

/* Foto qaranlıqdan işıqlanır */
function Dark({ src, focus = '50% 50%', height, children, style }) {
  const [ref, seen] = useInView(0.2)
  return (
    <div ref={ref} data-section="photo" className={`bn-ph${seen ? ' on' : ''}`} style={{ position: 'relative', overflow: 'hidden', background: '#000', height, ...style }}>
      <img src={src} alt="" loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: focus }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(12,19,34,0) 55%, rgba(12,19,34,.85))' }} />
      {children}
    </div>
  )
}

/* Şəhər işıqlarında parıltılar — fotodakı nöqtələrə bağlı */
function Twinkles({ imgRef, on }) {
  const [pts, setPts] = useState([])
  useEffect(() => {
    const img = imgRef.current
    if (!img) return undefined
    const place = () => setPts(LIGHTS.map(([x, y]) => coverSpot(img, x, y)))
    if (img.complete) place(); else img.addEventListener('load', place)
    addEventListener('resize', place)
    return () => { img.removeEventListener('load', place); removeEventListener('resize', place) }
  }, [imgRef])
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      {pts.map(([x, y], i) => (
        <span key={i} className="bn-tw" style={{ left: `${x * 100}%`, top: `${y * 100}%`, animation: on ? `bn-tw 2.8s ease-in-out ${((i * 0.37) % 2.8).toFixed(2)}s infinite` : undefined }} />
      ))}
    </div>
  )
}

/* ═══ ÇƏRÇİVƏ: açılış və örtük eyni kadrdır ═══ */
function Frame({ inv, weddingData, T, C, fonts, kicker, first, second, single, go, gate = false, instant = false }) {
  const { ot } = inv
  const P = resolvePhotos(PHOTOS, inv.images)
  const img = useRef(null)
  const t = (v) => (instant ? 'none' : v)
  const longest = single || [first, second].sort((a, b) => String(b || '').length - String(a || '').length)[0] || ''
  return (
    <>
      {P.hero && <img ref={img} src={P.hero} alt="" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%',
        filter: go ? 'brightness(1) saturate(1)' : 'brightness(.16) saturate(.7)', scale: go ? '1' : '1.12',
        transition: t('filter 3.2s cubic-bezier(.3,0,.2,1), scale 7s cubic-bezier(.2,.6,.2,1)'),
        animation: gate && !go ? 'bn-hold 8s ease-in-out infinite alternate' : undefined,
      }} />}
      {/* parıltılar şablonun öz fotosundakı işıqlara bağlıdır — admin şəklində yoxdur */}
      {P.hero && !isCustomPhoto(inv.images, 'hero') && <Twinkles imgRef={img} on={go} />}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(12,19,34,.55) 0%, rgba(12,19,34,0) 34%, rgba(12,19,34,0) 70%, rgba(12,19,34,.8) 100%)' }} />

      <div style={{ position: 'absolute', left: 0, right: 0, top: 'max(10svh, 60px)', padding: '0 26px' }}>
        {kicker && <div style={{ fontSize: 12.5, fontWeight: 400, letterSpacing: '.24em', textTransform: 'uppercase', color: C.GOLD }}>{kicker}</div>}
        <h1 style={{ margin: '16px 0 0', fontFamily: fonts.head, fontWeight: 200, fontSize: nameSize(longest, true), lineHeight: 0.98, letterSpacing: '-.02em', color: C.CHAM }}>
          {single || (
            <>
              {first}
              {second && <em style={{ display: 'block', fontStyle: 'italic', fontWeight: 300, color: C.GOLD, fontSize: '.62em', lineHeight: 1.15, margin: '4px 0 2px .9em' }}>{inv.and}</em>}
              {second}
            </>
          )}
        </h1>
        <p style={{ margin: '20px 0 0', maxWidth: '24ch', fontSize: 16, color: alpha(C.CHAM, 0.85), opacity: go ? 1 : 0, transition: t('opacity 1.6s 1.8s') }}>{T.lead}</p>
      </div>

      <div style={{ position: 'absolute', left: 26, right: 26, bottom: 'max(7svh, 40px)' }}>
        {gate && (
          <div style={{ opacity: go ? 0 : 1, transition: 'opacity .8s', pointerEvents: go ? 'none' : undefined }}>
            {ot.show('cta') && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, minHeight: 52, fontSize: 15, letterSpacing: '.06em', color: C.CHAM }}>
                <span aria-hidden="true" style={{ width: 46, height: 46, borderRadius: '50%', border: `1px solid ${alpha(C.GOLD, 0.6)}`, background: 'radial-gradient(circle, rgba(255,214,140,.9) 0 2px, transparent 3px)', animation: 'bn-pulse 2.4s ease-in-out infinite' }} />
                {ot.text('cta')}
              </span>
            )}
            {ot.show('hint') && <div style={{ marginTop: 6, fontSize: 12.5, color: C.MUTE }}>{ot.text('hint')}</div>}
          </div>
        )}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, opacity: go ? 1 : 0, translate: go ? '0 0' : '0 10px', transition: t('opacity 1.4s 2.2s, translate 1.4s 2.2s') }}>
          <div style={{ fontFamily: fonts.head, fontWeight: 200, fontSize: 26, lineHeight: 1.1, color: C.CHAM }}>{inv.fullDate}</div>
          <div style={{ textAlign: 'right', fontSize: 14, lineHeight: 1.5, color: alpha(C.CHAM, 0.8) }}>{inv.time}{inv.time && weddingData.venueName ? <br /> : null}{weddingData.venueName}</div>
        </div>
      </div>
      {!gate && <div style={{ position: 'absolute', left: 26, bottom: 14, fontSize: 12, letterSpacing: '.06em', color: C.MUTE }}>{T.scroll}</div>}
    </>
  )
}

function NightOpening({ inv, weddingData, T, C, fonts }) {
  const gate = useGate({ inv, ms: OPEN_MS, revealAt: REVEAL_MS })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  return (
    <div {...gate.gateProps} data-bn style={{
      position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: '#000', color: C.CHAM, fontFamily: fonts.body,
      animation: gate.opening ? `bn-out .9s ease ${(REVEAL_MS + 100) / 1000}s forwards` : undefined,
    }}>
      <Frame inv={inv} weddingData={weddingData} T={T} C={C} fonts={fonts} kicker={inv.L('hero', 'kicker', inv.ot.text('kicker'))}
        first={titleOv === '' ? '' : first} second={titleOv === '' ? '' : second} go={gate.opening} gate />
    </div>
  )
}

function Panel({ id, section, kicker, title, sub, children, head, C, alt = false }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '84px 26px', background: alt ? C.NIGHT2 : C.NIGHT, color: C.CHAM }}>
      <div style={{ maxWidth: 440, margin: '0 auto' }}>
        {kicker && <Fx style={{ fontSize: 12, fontWeight: 400, letterSpacing: '.24em', textTransform: 'uppercase', color: C.GOLD }}>{kicker}</Fx>}
        {title && <Title head={head} C={C}>{title}</Title>}
        {sub && <Fx as="p" delay={0.18} style={{ margin: '12px 0 0', maxWidth: '30ch', fontSize: 16, color: C.MUTE }}>{sub}</Fx>}
        <div style={{ marginTop: title || sub ? 26 : 0 }}>{children}</div>
      </div>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${alpha(C.CHAM, 0.35)}`, borderRadius: 0,
  padding: '12px 2px', fontSize: 18, fontWeight: 300, color: C.CHAM, outline: 'none',
})
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '0 24px', borderRadius: 999,
  fontSize: 15, letterSpacing: '.02em', textDecoration: 'none', cursor: 'pointer',
  background: on ? C.GOLD : 'transparent', color: on ? '#16100a' : C.CHAM, border: `1px solid ${on ? C.GOLD : alpha(C.CHAM, 0.4)}`,
}))
const suggest = (C) => ({ bg: C.NIGHT2, border: `1px solid ${alpha(C.GOLD, 0.35)}`, active: alpha(C.GOLD, 0.14), text: C.CHAM, table: C.GOLD, radius: 2 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function BakuNightTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const fonts = { head, body }
  const T = inv.copy(TXT)
  const P = resolvePhotos(PHOTOS, inv.images)
  const [veil] = useState(() => !inv.opened)
  const single = inv.heroTitle || (inv.isCouple ? '' : inv.single)

  return (
    <PaletteContext.Provider value={C}><div data-bn data-vr lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.NIGHT, minHeight: '100vh', fontFamily: body, fontWeight: 300, color: C.CHAM, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.GOLD, 0.3),
    }}>
      <style>{VIRAL_CSS + KEYFRAMES(C)}</style>
      {veil && <NightOpening inv={inv} weddingData={weddingData} T={T} C={C} fonts={fonts} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: alpha(C.NIGHT, 0.6), border: `1px solid ${alpha(C.GOLD, 0.4)}`, backdropFilter: 'blur(8px)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.GOLD} idle={alpha(C.GOLD, 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.NIGHT, 0.82), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: C.CHAM,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.CHAM, 0.7), fontSize: 14, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontSize: 12, fontWeight: 400, letterSpacing: '.3em', color: C.GOLD }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          <section data-section="hero" style={{ position: 'relative', marginTop: -52, height: '100svh', minHeight: 620, overflow: 'hidden', background: '#000' }}>
            <Frame inv={inv} weddingData={weddingData} T={T} C={C} fonts={fonts} kicker={L('hero', 'kicker', inv.ot.text('kicker'))}
              first={inv.isCouple ? inv.groom : ''} second={inv.isCouple ? inv.bride : ''} single={single} go instant={veil} />
          </section>

          <section data-section="invite" style={{ padding: '84px 26px', background: C.NIGHT }}>
            <div style={{ maxWidth: 440, margin: '0 auto' }}>
              <Fx as="p" style={{ margin: 0, fontFamily: head, fontWeight: 200, fontSize: 30, lineHeight: 1.28, letterSpacing: '-.01em' }}>{T.intro}</Fx>
              <Fx as="p" delay={0.18} style={{ margin: '24px 0 0', maxWidth: '34ch', color: alpha(C.CHAM, 0.82) }}>{tr.inv_join}</Fx>
              {inv.isCorp && weddingData.organizer?.trim() && <Fx delay={0.36} style={{ marginTop: 18, fontSize: 14, color: C.MUTE }}>{tr.organizer_display}: {weddingData.organizer}</Fx>}
            </div>
          </section>

          {S.countdown && (
            <Panel section="countdown" head={head} C={C} alt kicker={K('countdown')} title={L('countdown', 'title', cd.title)}>
              <Fx delay={0.1} style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
                <b style={{ fontFamily: head, fontWeight: 100, fontSize: 'clamp(116px, 38vw, 170px)', lineHeight: 0.8, letterSpacing: '-.05em' }}><Roll value={cd.days} /></b>
                <span style={{ fontFamily: head, fontStyle: 'italic', fontWeight: 200, fontSize: 26, color: C.GOLD, paddingBottom: 8 }}>{T.days}</span>
              </Fx>
              <Fx delay={0.3} style={{ display: 'flex', gap: 28, marginTop: 28, paddingTop: 20, borderTop: `1px solid ${alpha(C.GOLD, 0.35)}`, fontVariantNumeric: 'tabular-nums' }}>
                {[['hours', cd.hours], ['minutes', cd.minutes], ['seconds', cd.seconds]].map(([k, v]) => (
                  <div key={k}><b style={{ display: 'block', fontFamily: head, fontWeight: 200, fontSize: 30, lineHeight: 1.1 }}>{String(v).padStart(2, '0')}</b><small style={{ fontSize: 12.5, color: C.MUTE }}>{cd.labels[k]}</small></div>
                ))}
              </Fx>
            </Panel>
          )}

          {P.city && (<Dark src={P.city} focus="50% 60%" height="90svh" style={{ minHeight: 540 }}>
            <Fx style={{ position: 'absolute', left: 26, right: 26, bottom: 30, zIndex: 2, fontFamily: head, fontWeight: 200, fontStyle: 'italic', fontSize: 26, lineHeight: 1.25, textShadow: '0 2px 20px rgba(0,0,0,.5)' }}>{T.city}</Fx>
          </Dark>)}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {S.program && (
            <section data-section="program" style={{ background: C.NIGHT, color: C.CHAM }}>
              {P.program && <Dark src={P.program} focus="50% 50%" height="78svh" style={{ minHeight: 480 }} />}
              <div style={{ padding: P.program ? '10px 26px 84px' : '84px 26px' }}><div style={{ maxWidth: 440, margin: '0 auto' }}>
                {K('program') && <Fx style={{ fontSize: 12, fontWeight: 400, letterSpacing: '.24em', textTransform: 'uppercase', color: C.GOLD }}>{K('program')}</Fx>}
                <Title head={head} C={C}>{L('program', 'title', timeline.sectionLabel)}</Title>
                <Stagger step={0.12} style={{ marginTop: 20 }}>
                  {timeline.events.map((ev, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '86px minmax(0, 1fr)', gap: 14, alignItems: 'baseline', padding: '18px 0', borderBottom: `1px solid ${alpha(C.GOLD, 0.35)}` }}>
                      <div style={{ fontFamily: head, fontWeight: 200, fontSize: 28, lineHeight: 1, color: C.GOLD, fontVariantNumeric: 'lining-nums' }}>{ev.time}</div>
                      <div style={{ fontSize: 18 }}>{ev.label}</div>
                    </div>
                  ))}
                </Stagger>
              </div></div>
            </section>
          )}

          {S.venue && (
            <Panel section="venue" head={head} C={C} alt kicker={K('venue')} title={L('venue', 'title', tr.inv_location)}>
              <Rise style={{ overflow: 'hidden', isolation: 'isolate' }}>
                <MapSection
                  weddingData={weddingData} theme={theme} accent={C.GOLD} height="clamp(240px, 68vw, 300px)"
                  map={{ opacity: 0.85, filter: 'invert(.92) hue-rotate(185deg) saturate(.5) brightness(.85) contrast(.95)', tintOpacity: 0.15, tint: C.NIGHT, blend: 'multiply' }}
                  frame={<MapPin />}
                  fallback={<div style={{ height: 'clamp(240px, 68vw, 300px)', position: 'relative', background: '#18233a' }}><MapPin /></div>}
                />
              </Rise>
              <Fx style={{ marginTop: 26, fontFamily: head, fontWeight: 200, fontSize: 34, lineHeight: 1.1 }}>{weddingData.venueName || ''}</Fx>
              {weddingData.venueNote && <Fx delay={0.18} style={{ marginTop: 6, fontSize: 15, color: C.MUTE }}>{weddingData.venueNote}</Fx>}
              <Fx delay={0.36}><VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} style={{ justifyContent: 'flex-start' }} /></Fx>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} C={C} kicker={K('dresscode')} title={L('dresscode', 'title', tr.inv_dresscode)}>
              <Fx>
                <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="left" />
              </Fx>
            </Panel>
          )}

          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} C={C} alt kicker={K('seating')} title={L('seating', 'title', seatingL.title)} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="bn-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={C.MUTE} accent={C.GOLD}
                nameStyle={{ fontSize: 15, color: C.MUTE }}
                card={(num) => (
                  <div style={{ position: 'relative', overflow: 'hidden', marginTop: 8, padding: '26px 24px', border: `1px solid ${alpha(C.GOLD, 0.35)}`, background: 'linear-gradient(160deg, rgba(201,164,92,.1), rgba(201,164,92,0) 60%)', animation: 'bn-rise 1s cubic-bezier(.2,.8,.2,1) both', textAlign: 'left' }}>
                    <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 40%, rgba(255,230,180,.22) 50%, transparent 60%)', translate: '-100% 0', animation: 'bn-glint 2.2s .4s ease-in-out both' }} />
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                      <b style={{ fontFamily: head, fontWeight: 100, fontSize: tableSize(num, 96), lineHeight: 0.85 }}>{num}</b>
                      <span style={{ fontFamily: head, fontStyle: 'italic', fontWeight: 200, fontSize: 22, color: C.GOLD, paddingBottom: 6 }}>{T.table}</span>
                    </div>
                  </div>
                )} />
            </Panel>
          )}

          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} C={C} kicker={K('gallery')} title={L('gallery', 'title', tr.inv_gallery)}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, marginBottom: 28 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <Rise key={i} delay={(i % 2) * 0.12} style={{ aspectRatio: i % 3 === 0 ? '3 / 4.4' : '3 / 4', overflow: 'hidden', background: C.NIGHT2 }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} className="vr-kb" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </Rise>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.NIGHT} bg={C.CHAM} frame={{ border: `1px solid ${alpha(C.GOLD, 0.35)}` }}
                btn={btn(C)} muted={C.MUTE} desc={galleryDesc(props.adminOverrides, tr, lang, 'night')} />
            </Panel>
          )}

          {S.rsvp && (
            <section data-section="rsvp" style={{ background: C.NIGHT, color: C.CHAM }}>
              {P.rsvp && <Dark src={P.rsvp} focus="50% 40%" height="70svh" style={{ minHeight: 440 }} />}
              <div style={{ padding: P.rsvp ? '10px 26px 84px' : '84px 26px' }}><div style={{ maxWidth: 440, margin: '0 auto' }}>
                <Fx style={{ fontSize: 12, fontWeight: 400, letterSpacing: '.24em', textTransform: 'uppercase', color: C.GOLD }}>{L('rsvp', 'kicker', tr.inv_rsvp)}</Fx>
                <Title head={head} C={C}>{L('rsvp', 'title', rsvpL.title)}</Title>
                {rsvpL.subtitle && <Fx as="p" delay={0.18} style={{ margin: '12px 0 22px', maxWidth: '30ch', color: C.MUTE }}>{rsvpL.subtitle}</Fx>}
                <ReplyForm inv={inv} t={{
                  ink: C.CHAM, muted: C.MUTE, line: alpha(C.CHAM, 0.35), hair: alpha(C.GOLD, 0.3), accent: C.GOLD,
                  font: body, display: head, displayItalic: false, btnFont: body, radius: 999, btnSolid: true,
                  doneMark: <div aria-hidden="true" style={{ width: 8, height: 8, margin: '0 0 18px', borderRadius: '50%', background: '#fff3d6', boxShadow: '0 0 22px 8px rgba(255,200,120,.5)' }} />,
                  marker: (a) => <span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', border: `1px solid ${a ? C.GOLD : alpha(C.CHAM, 0.6)}`, background: a ? C.GOLD : 'transparent', boxShadow: a ? '0 0 12px 3px rgba(201,164,92,.5)' : 'none', transition: 'all .3s' }} />,
                  suggest: { ...suggest(C), font: body },
                }} />
              </div></div>
            </section>
          )}

          {S.guestbook && (
            <Panel section="guestbook" head={head} C={C} alt kicker={K('guestbook')} title={L('guestbook', 'title', gbookL.title)}>
              <GuestbookForm inv={inv} field={field(C)} btn={btn(C)} errorColor="#E89A8A" />
              <Stagger step={0.1} style={{ marginTop: 30 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '24px 0', borderTop: `1px solid ${alpha(C.GOLD, 0.35)}` }}>
                      <blockquote style={{ margin: 0, fontFamily: head, fontWeight: 200, fontSize: 21, lineHeight: 1.45 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 10, fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', color: C.GOLD }}>
                        {msg.name}{msg.date ? <span style={{ textTransform: 'none', letterSpacing: 0, color: C.MUTE }}> · {gbook.formatDate(msg.date)}</span> : null}
                      </figcaption>
                    </figure>
                  )
                })}
              </Stagger>
            </Panel>
          )}

          <End inv={inv} T={T} C={C} head={head} />
          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={head} />
        </motion.div>
      )}
    </div></PaletteContext.Provider>
  )
}

function End({ inv, T, C, head }) {
  const [ref, seen] = useInView(0.3)
  const name = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const P = resolvePhotos(PHOTOS, inv.images)
  return (
    <section ref={ref} data-section="finale" style={{ position: 'relative', height: '100svh', minHeight: 620, overflow: 'hidden', background: '#000' }}>
      {P.finale && <img src={P.finale} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '62% 52%', transformOrigin: '62% 52%', scale: seen ? '1.25' : '1.5', transition: 'scale 10s cubic-bezier(.2,.6,.2,1)' }} />}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(12,19,34,.7), rgba(12,19,34,.15) 50%, rgba(12,19,34,.85))' }} />
      <div style={{ position: 'absolute', left: 26, right: 26, bottom: '12svh', color: C.CHAM }}>
        <Fx style={{ fontSize: 12.5, fontWeight: 400, letterSpacing: '.24em', textTransform: 'uppercase', color: C.GOLD }}>{T.end}</Fx>
        <Fx delay={0.18} style={{ marginTop: 12, fontFamily: head, fontWeight: 200, fontSize: nameSize(name), lineHeight: 1.02, letterSpacing: '-.02em' }}>{name}</Fx>
        <Fx delay={0.36} style={{ marginTop: 12, fontSize: 16 }}>{inv.fullDate}</Fx>
      </div>
    </section>
  )
}

function MapPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -6, top: -6, width: 12, height: 12, borderRadius: '50%', background: '#fff3d6', boxShadow: '0 0 18px 7px rgba(255,200,120,.55)', animation: 'bn-pulse 2.4s infinite' }} />
    </span>
  )
}
