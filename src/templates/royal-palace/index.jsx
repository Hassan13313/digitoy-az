import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../_shared/MapSection'
import { MonoContent } from '../_shared/MonoContent'
import { enterDirection } from '../_shared/motion'
import { hidePhoto } from '../../utils/photoGallery'
import { getTemplateTheme } from '../templateConfig'
import { useInvitation, useGate, openingNames, alpha } from '../_shared/useInvitation'
import { MusicFab, EqBars, StoryBlock, InvitationEnd, ReplyForm } from '../_shared/invitationKit'
import { VenueLinks, SeatFinder, PhotoQr, GuestbookForm } from '../_shared/blocks'
import { galleryDesc, tableSize } from '../_shared/kids'
import { Words, Rise, Stagger, Photo } from '../_shared/viral'
import { VIRAL_CSS, useInView, coverSpot } from '../_shared/viralHooks'
import { resolvePhotos, isCustomPhoto } from '../templatePhotos'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { PaletteContext, resolvePalette, scaleFont } from '../_shared/palette'
import Countdown, { COUNTDOWN_CSS } from '../_shared/luxe/Countdown'

/* ─────────────────────────────────────────────────────────────────────────────
   ROYAL PALACE — lüks toy seriyası (2026-11, foto redizayn)

   Konsept: barokko sarayında axşam. Zərli pilləkən, gecə mavisi məxmər
   pərdələr, kristal çilçıraq; bəy və gəlin saray qapısına doğru gedir.
   Açılış örtüyün ÖZÜDÜR (Frame — açılışda və örtükdə eyni kadr):
     1. kadr çilçırağa yaxındır və qaranlıqdır; yuxarıda tacli monoqram, adlar
     2. toxunanda çilçıraq yanır (fotodakı yerinə bağlıdır — coverSpot) və
        kamera çilçıraqdan aşağı, cütlüyə enir
     3. aşağıda tarix və məkan görünür, açılış söner
   Daxildə: mərkəzə düzlənmiş saray protokolu; başlıqlar geniş hərf
   aralığından yığılır; ikiqat zər çərçivələr; tağlı xəritə; tacli masa kartı.
   Fotolar GPT Image ilə bu şablon üçün yaradılıb (public/img/wedding/viral/rp-*).
   Şriftlər: Imperial Script (adlar) · Cormorant SC (başlıq) · EB Garamond.
   Köhnə sifarişlər pozulmur: id, açılış sahələri (openingSpec) və mətn
   açarları (copy.js) əvvəlki kimidir.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('royal-palace')
const ID = 'royal-palace'

const LINKS = { primary: ['NAVY2'], secondary: ['MUTE'], accent: ['GOLD'], background: ['NAVY'], text: ['IVORY'] }

/* rp-1 fotosunda çilçırağın yeri (0..1) */
const CHANDELIER = [0.5, 0.37]

const KEYFRAMES = (C) => (`
@keyframes rp-hold { from { scale: 1.34 } to { scale: 1.38 } }
@keyframes rp-ignite { 0% { opacity: 0; scale: .4 } 35% { opacity: 1; scale: 1.15 } 100% { opacity: .55; scale: 1 } }
@keyframes rp-flicker { 0%,100% { opacity: .55 } 50% { opacity: .7 } }
@keyframes rp-pulse { 0%,100% { box-shadow: 0 0 0 0 ${alpha(C.GOLD, 0.35)} } 60% { box-shadow: 0 0 0 14px ${alpha(C.GOLD, 0)} } }
@keyframes rp-out { to { opacity: 0 } }
@keyframes rp-drip { 0% { scale: 1 0 } 50% { scale: 1 1 } 100% { scale: 1 1; opacity: 0 } }
@keyframes rp-card { from { opacity: 0; transform: perspective(700px) rotateY(-80deg) } to { opacity: 1; transform: none } }
@keyframes rp-shine { from { translate: -120% 0 } to { translate: 120% 0 } }
[data-rp] .rp-fx { opacity: 0; transition: opacity 1.5s cubic-bezier(.2,.7,.2,1); }
[data-rp] .rp-fx.on { opacity: 1; }
[data-rp] .rp-tt { opacity: 0; letter-spacing: .42em; transition: opacity 1.6s cubic-bezier(.2,.7,.2,1), letter-spacing 1.8s cubic-bezier(.2,.7,.2,1); }
[data-rp] .rp-tt.on { opacity: 1; letter-spacing: .1em; }
[data-rp] canvas, [data-rp] div[aria-hidden="true"], [data-rp] span[aria-hidden="true"] { pointer-events: none; }
[data-rp] ::placeholder { color: ${alpha(C.MUTE, 0.85)}; font-style: italic; }
[data-rp] input:focus-visible, [data-rp] textarea:focus-visible { border-color: ${C.GOLD} !important; outline: none; }
[data-rp] button:focus-visible, [data-rp] a:focus-visible, [data-rp] [role="button"]:focus-visible { outline: 1px solid ${C.GOLD}; outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) { [data-rp] *, [data-rp] { animation: none !important; transition: none !important; } [data-rp] .rp-fx, [data-rp] .rp-tt { opacity: 1; letter-spacing: .1em; } }
`)

const OPEN_MS = 5000
const REVEAL_MS = 4000

function Fx({ as: Tag = 'div', delay = 0, style, children }) {
  const [ref, seen] = useInView(0.18)
  return <Tag ref={ref} className={`rp-fx${seen ? ' on' : ''}`} style={{ transitionDelay: `${delay}s`, ...style }}>{children}</Tag>
}

/* Başlıq: geniş hərf aralığından yığılır */
function Title({ children, head, C, style }) {
  const [ref, seen] = useInView(0.2)
  return <h2 ref={ref} className={`rp-tt${seen ? ' on' : ''}`} style={{ margin: 0, fontFamily: head, fontWeight: 400, fontSize: scaleFont('clamp(26px, 7.6vw, 34px)', C.hs), lineHeight: 1.2, color: C.IVORY, ...style }}>{children}</h2>
}

/* Tac ilə zər ayırıcı: xətlər mərkəzdən açılır */
function Crest({ C, style }) {
  const [ref, seen] = useInView(0.3)
  const line = { flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${C.GOLD})`, scale: seen ? '1 1' : '0 1', transition: 'scale 1.5s cubic-bezier(.2,.7,.2,1)' }
  return (
    <div ref={ref} aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 12, width: 150, margin: '20px auto', color: C.GOLD, ...style }}>
      <span style={{ ...line, transformOrigin: 'right' }} />
      <span style={{ fontSize: 15, lineHeight: 1, opacity: seen ? 1 : 0, transition: 'opacity 1s .5s' }}>♛</span>
      <span style={{ ...line, transformOrigin: 'left', background: `linear-gradient(270deg, transparent, ${C.GOLD})` }} />
    </div>
  )
}

/* Çilçıraq yanır — fotodakı yerinə bağlıdır */
function Glow({ imgRef, on, still }) {
  const [pt, setPt] = useState(null)
  useEffect(() => {
    const img = imgRef.current
    if (!img) return undefined
    const place = () => setPt(coverSpot(img, CHANDELIER[0], CHANDELIER[1]))
    if (img.complete) place(); else img.addEventListener('load', place)
    addEventListener('resize', place)
    return () => { img.removeEventListener('load', place); removeEventListener('resize', place) }
  }, [imgRef])
  if (!pt) return null
  return (
    <span aria-hidden="true" style={{
      position: 'absolute', left: `${pt[0] * 100}%`, top: `${pt[1] * 100}%`, width: '120vw', maxWidth: 620, aspectRatio: '1', translate: '-50% -50%',
      background: 'radial-gradient(circle, rgba(255,236,190,.85) 0, rgba(255,214,140,.35) 18%, rgba(255,200,120,.08) 42%, transparent 62%)', mixBlendMode: 'screen',
      opacity: still ? 0.55 : 0, animation: still ? 'rp-flicker 4s ease-in-out infinite' : on ? 'rp-ignite 2.6s cubic-bezier(.2,.7,.2,1) .2s forwards, rp-flicker 4s ease-in-out 3s infinite' : undefined,
    }} />
  )
}

/* Monoqram: incə zər halqada baş hərflər (admin dəyişə və ya gizlədə bilər) */
function Mono({ inv, C, head }) {
  const mono = inv.ot.mono
  if (!mono || mono.kind === 'none') return null
  return (
    <div style={{ display: 'grid', placeItems: 'center', width: 54, height: 54, margin: '0 auto 12px', borderRadius: '50%', overflow: 'hidden', border: `1px solid ${alpha(C.GOLD, 0.8)}`, boxShadow: `inset 0 0 0 3px ${alpha(C.NAVY, 0.5)}, inset 0 0 0 4px ${alpha(C.GOLD, 0.45)}`, background: alpha(C.NAVY, 0.35), backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', fontFamily: head, fontSize: 16, letterSpacing: '.1em', color: C.GOLD }}>
      <MonoContent mono={mono} ornament={<span style={{ fontSize: 24 }}>♛</span>} imgStyle={{ borderRadius: '50%' }} />
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
  /* qısa adlar bir sətirdə — çilçıraq açıq qalsın */
  const inline = !single && !!first && !!second && Array.from(`${first}${second}`).length <= 13
  const origin = `${CHANDELIER[0] * 100}% ${CHANDELIER[1] * 100}%`
  return (
    <>
      {P.hero && (
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, transformOrigin: origin, scale: go ? '1' : '1.36',
          filter: go ? 'brightness(1)' : 'brightness(.38) saturate(.8)',
          transition: t('scale 5.5s cubic-bezier(.45,0,.15,1), filter 2.4s cubic-bezier(.3,0,.2,1) .2s'),
          animation: gate && !go ? 'rp-hold 8s ease-in-out infinite alternate' : undefined,
        }}>
          <img ref={img} src={P.hero} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%', display: 'block' }} />
          {/* çilçıraq işığı şablonun öz fotosuna bağlıdır — admin şəklində yoxdur */}
          {!isCustomPhoto(inv.images, 'hero') && <Glow imgRef={img} on={go} still={instant} />}
        </div>
      )}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${alpha(C.NAVY, 0.72)} 0%, ${alpha(C.NAVY, 0.25)} 30%, ${alpha(C.NAVY, 0)} 46%, ${alpha(C.NAVY, 0)} 62%, ${alpha(C.NAVY, 0.9)} 100%)` }} />

      <div style={{ position: 'absolute', left: 0, right: 0, top: 'max(6svh, 40px)', textAlign: 'center', padding: '0 22px', color: C.IVORY }}>
        <Mono inv={inv} C={C} head={fonts.head} />
        {kicker && <div style={{ fontFamily: fonts.head, fontSize: 13, letterSpacing: '.34em', color: C.GOLD }}>{kicker}</div>}
        <h1 style={{ margin: '6px 0 0', fontFamily: fonts.script, fontWeight: 400, fontSize: inline ? 'clamp(42px, 12vw, 58px)' : nameSize(longest, true), lineHeight: 1.12, textShadow: `0 2px 24px ${alpha(C.NAVY, 0.8)}` }}>
          {single || (inline ? (
            <>{first} <span style={{ fontSize: '.7em', color: C.GOLD }}>{inv.and}</span> {second}</>
          ) : (
            <>
              {first}
              {second && <span style={{ display: 'block', fontFamily: fonts.head, fontSize: 15, letterSpacing: '.3em', lineHeight: 1.6, color: C.GOLD }}>{inv.and}</span>}
              {second}
            </>
          ))}
        </h1>
        <div style={{ position: 'relative', marginTop: 12, minHeight: 24 }}>
          {gate && ot.show('meta') && <div style={{ position: 'absolute', left: 0, right: 0, fontFamily: fonts.head, fontSize: 13.5, letterSpacing: '.22em', color: alpha(C.IVORY, 0.85), opacity: go ? 0 : 1, transition: 'opacity .8s' }}>{ot.text('meta')}</div>}
          <div style={{ fontStyle: 'italic', fontSize: 17, color: alpha(C.IVORY, 0.92), textShadow: `0 1px 14px ${alpha(C.NAVY, 0.9)}`, opacity: go ? 1 : 0, transition: t('opacity 1.6s 2.6s') }}>{T.honour}</div>
        </div>
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 'max(8svh, 50px)', textAlign: 'center', padding: '0 22px', color: C.IVORY,
        opacity: go ? 1 : 0, translate: go ? '0 0' : '0 10px', transition: t('opacity 1.4s 3s, translate 1.4s 3s'),
      }}>
        <div style={{ fontFamily: fonts.head, fontSize: 15, letterSpacing: '.3em', color: C.GOLD }}>{inv.fullDate}</div>
        <div style={{ marginTop: 6, fontStyle: 'italic', fontSize: 16, color: alpha(C.IVORY, 0.85) }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' — ')}</div>
        {!gate && (
          <div style={{ marginTop: 16, fontStyle: 'italic', fontSize: 13.5, color: C.MUTE }}>
            {T.scroll}
            <span aria-hidden="true" style={{ display: 'block', width: 1, height: 28, margin: '8px auto 0', background: `linear-gradient(${C.GOLD}, transparent)`, transformOrigin: 'top', animation: 'rp-drip 2.6s ease-in-out infinite' }} />
          </div>
        )}
      </div>

      {gate && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 'max(7svh, 40px)', textAlign: 'center', opacity: go ? 0 : 1, transition: 'opacity .7s', pointerEvents: go ? 'none' : undefined }}>
          {ot.show('cta') && <span style={{ display: 'inline-flex', alignItems: 'center', minHeight: 52, padding: '0 34px', borderRadius: 999, border: `1px solid ${alpha(C.GOLD, 0.7)}`, background: alpha(C.NAVY, 0.45), backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', fontFamily: fonts.head, fontSize: 15, letterSpacing: '.18em', color: C.IVORY, animation: 'rp-pulse 2.8s ease-in-out infinite' }}>{ot.text('cta')}</span>}
          {ot.show('hint') && <div style={{ marginTop: 12, fontStyle: 'italic', fontSize: 13.5, color: C.MUTE }}>{ot.text('hint')}</div>}
        </div>
      )}
    </>
  )
}

function PalaceOpening({ inv, weddingData, T, C, fonts }) {
  const gate = useGate({ inv, ms: OPEN_MS, revealAt: REVEAL_MS })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  return (
    <div {...gate.gateProps} data-rp style={{
      position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: C.NAVY, color: C.IVORY, fontFamily: fonts.body,
      animation: gate.opening ? `rp-out .9s ease ${(REVEAL_MS + 100) / 1000}s forwards` : undefined,
    }}>
      <Frame inv={inv} weddingData={weddingData} T={T} C={C} fonts={fonts} kicker={inv.L('hero', 'kicker', inv.ot.text('kicker'))}
        first={titleOv === '' ? '' : first} second={titleOv === '' ? '' : second} go={gate.opening} gate />
    </div>
  )
}

/* Bölmə */
function Panel({ id, section, title, sub, children, head, C, alt = false, center = true, style }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '80px 26px', background: alt ? C.NAVY2 : C.NAVY, color: C.IVORY, textAlign: center ? 'center' : undefined, ...style }}>
      <div style={{ maxWidth: 440, margin: '0 auto' }}>
        {title && <Title head={head} C={C}>{title}</Title>}
        {title && <Crest C={C} />}
        {sub && <Fx as="p" delay={0.15} style={{ margin: '0 auto', maxWidth: '32ch', fontStyle: 'italic', fontSize: 17, color: C.MUTE }}>{sub}</Fx>}
        <div style={{ marginTop: sub ? 26 : 8 }}>{children}</div>
      </div>
    </section>
  )
}

/* İkiqat zər çərçivə */
const double = (C, inset = 7) => ({ position: 'absolute', inset, border: `1px solid ${alpha(C.GOLD, 0.55)}`, boxShadow: `0 0 0 4px ${alpha(C.NAVY, 0)}, inset 0 0 0 4px ${alpha(C.NAVY2, 0)}, inset 0 0 0 5px ${alpha(C.GOLD, 0.25)}` })

const field = (C) => ({
  width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${alpha(C.IVORY, 0.35)}`, borderRadius: 0,
  padding: '12px 2px', fontSize: 18, color: C.IVORY, outline: 'none', textAlign: 'center',
})
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '0 24px', borderRadius: 999,
  fontSize: 15.5, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.GOLD : 'transparent', color: on ? C.NAVY : C.IVORY, border: `1px solid ${on ? C.GOLD : alpha(C.GOLD, 0.5)}`,
}))
const suggest = (C) => ({ bg: C.NAVY2, border: `1px solid ${alpha(C.GOLD, 0.35)}`, active: alpha(C.GOLD, 0.14), text: C.IVORY, table: C.GOLD, radius: 2 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function RoyalPalaceTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const fonts = { head, body, script: theme.fonts.script || BASE.fonts.script }
  const T = inv.copy(TXT)
  const P = resolvePhotos(PHOTOS, inv.images)
  const [veil] = useState(() => !inv.opened)
  const single = inv.heroTitle || (inv.isCouple ? '' : inv.single)

  return (
    <PaletteContext.Provider value={C}><div data-rp data-vr lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.NAVY, minHeight: '100vh', fontFamily: body, color: C.IVORY, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.GOLD, 0.3),
    }}>
      <style>{VIRAL_CSS + KEYFRAMES(C) + COUNTDOWN_CSS}</style>
      {veil && <PalaceOpening inv={inv} weddingData={weddingData} T={T} C={C} fonts={fonts} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: alpha(C.NAVY, 0.6), border: `1px solid ${alpha(C.GOLD, 0.45)}`, backdropFilter: 'blur(8px)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.GOLD} idle={alpha(C.GOLD, 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.NAVY, 0.82), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: C.IVORY, borderBottom: `1px solid ${alpha(C.GOLD, 0.2)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.IVORY, 0.7), fontSize: 15, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontSize: 13, letterSpacing: '.3em', color: C.GOLD }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* ÖRTÜK — açılışın son kadrı */}
          <section data-section="hero" style={{ position: 'relative', marginTop: -52, height: '100svh', minHeight: 620, overflow: 'hidden', background: C.NAVY }}>
            <Frame inv={inv} weddingData={weddingData} T={T} C={C} fonts={fonts} kicker={L('hero', 'kicker', inv.ot.text('kicker'))}
              first={inv.isCouple ? inv.groom : ''} second={inv.isCouple ? inv.bride : ''} single={single} go instant={veil} />
          </section>

          {/* Dəvət */}
          <section data-section="invite" style={{ padding: '76px 28px 64px', textAlign: 'center', background: C.NAVY }}>
            <div style={{ maxWidth: 430, margin: '0 auto' }}>
              <Fx as="p" style={{ margin: 0, fontSize: 'clamp(19px, 5.6vw, 22px)', lineHeight: 1.7 }}>{tr.inv_join}</Fx>
              <Crest C={C} style={{ marginBottom: 0 }} />
              {inv.isCorp && weddingData.organizer?.trim() && <Fx delay={0.15} style={{ marginTop: 18, fontSize: 15, fontStyle: 'italic', color: C.MUTE }}>{tr.organizer_display}: {weddingData.organizer}</Fx>}
            </div>
          </section>

          {S.countdown && (
            <Panel section="countdown" head={head} C={C} alt title={L('countdown', 'title', cd.title)}>
              <Countdown kind="crest" cd={cd} C={{ BG: C.NAVY2, BG2: C.NAVY, INK: C.IVORY, ACCENT: C.GOLD, MUTE: C.MUTE }} fonts={{ num: head, caps: head }} />
            </Panel>
          )}

          {/* Məxmər yastıqda tac */}
          {P.tiara && (<div data-section="photo" style={{ position: 'relative', height: '88svh', minHeight: 520 }}>
            <Photo src={P.tiara} alt="" focus="50% 45%" style={{ position: 'absolute', inset: 0 }}>
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${alpha(C.NAVY, 0.75)}, transparent 42%)` }} />
              <Words text={T.tiara} step={0.08} style={{ position: 'absolute', left: 24, right: 24, bottom: 34, textAlign: 'center', fontStyle: 'italic', fontSize: 23, lineHeight: 1.4, color: C.IVORY }} />
            </Photo>
          </div>)}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* PROQRAM — ziyafət fotosunun üstündə protokol kartı */}
          {S.program && (
            <section data-section="program" style={{ position: 'relative', paddingBottom: 80, background: C.NAVY }}>
              {P.program && <Photo src={P.program} alt="" focus="50% 50%" style={{ height: '64svh', minHeight: 400 }} />}
              <div style={{ position: 'relative', zIndex: 2, maxWidth: 420, margin: P.program ? '-96px auto 0' : '80px auto 0', marginInline: 'max(22px, calc(50% - 210px))', padding: '48px 26px 40px', background: C.NAVY2, textAlign: 'center', boxShadow: `0 30px 60px -30px ${alpha('#000', 0.7)}` }}>
                <span aria-hidden="true" style={double(C)} />
                <Title head={head} C={C}>{L('program', 'title', timeline.sectionLabel)}</Title>
                <Crest C={C} style={{ margin: '16px auto 6px' }} />
                <Stagger step={0.12}>
                  {timeline.events.map((ev, i) => (
                    <div key={i} style={{ padding: '14px 0', borderTop: i ? `1px solid ${alpha(C.GOLD, 0.2)}` : 'none' }}>
                      <div style={{ fontFamily: head, fontSize: 14, letterSpacing: '.26em', color: C.GOLD }}>{ev.time}</div>
                      <div style={{ marginTop: 4, fontSize: 20, lineHeight: 1.35 }}>{ev.label}</div>
                    </div>
                  ))}
                </Stagger>
              </div>
            </section>
          )}

          {S.venue && (
            <Panel section="venue" head={head} C={C} alt title={L('venue', 'title', tr.inv_location)}>
              <Rise style={{ position: 'relative', overflow: 'hidden', isolation: 'isolate', borderRadius: '999px 999px 0 0' }}>
                <MapSection
                  weddingData={weddingData} theme={theme} accent={C.GOLD} height="clamp(270px, 74vw, 320px)"
                  map={{ opacity: 0.85, filter: 'invert(.92) hue-rotate(195deg) saturate(.45) brightness(.8) contrast(.95)', tintOpacity: 0.2, tint: C.NAVY, blend: 'multiply' }}
                  frame={<MapPin C={C} />}
                  fallback={<div style={{ height: 'clamp(270px, 74vw, 320px)', position: 'relative', background: '#1A2350' }}><MapPin C={C} /></div>}
                />
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', border: `1px solid ${alpha(C.GOLD, 0.6)}`, boxShadow: `inset 0 0 0 6px ${alpha(C.NAVY2, 0.6)}, inset 0 0 0 7px ${alpha(C.GOLD, 0.35)}` }} />
              </Rise>
              <Fx style={{ marginTop: 24, fontFamily: head, fontSize: 30, lineHeight: 1.15 }}>{weddingData.venueName || ''}</Fx>
              {weddingData.venueNote && <Fx delay={0.15} style={{ marginTop: 6, fontStyle: 'italic', fontSize: 17, color: C.MUTE }}>{weddingData.venueNote}</Fx>}
              <Fx delay={0.3}><VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} /></Fx>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} C={C} title={L('dresscode', 'title', tr.inv_dresscode)}>
              <Fx>
                <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" />
              </Fx>
            </Panel>
          )}

          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} C={C} alt title={L('seating', 'title', seatingL.title)} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="rp-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={C.MUTE} accent={C.GOLD}
                nameStyle={{ fontFamily: fonts.script, fontSize: 34, lineHeight: 1.2 }}
                card={(num) => (
                  <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block', width: 240, padding: '30px 20px 28px', background: C.NAVY, boxShadow: `0 26px 40px -24px ${alpha('#000', 0.7)}`, transformOrigin: '0 50%', animation: 'rp-card 1.1s cubic-bezier(.2,.8,.2,1) both' }}>
                    <span aria-hidden="true" style={double(C)} />
                    <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 40%, rgba(255,230,180,.18) 50%, transparent 60%)', translate: '-120% 0', animation: 'rp-shine 2.2s .9s ease-in-out both' }} />
                    <div aria-hidden="true" style={{ fontSize: 22, color: C.GOLD }}>♛</div>
                    <div style={{ marginTop: 4, fontFamily: head, fontSize: tableSize(num, 64), lineHeight: 1 }}>{num}</div>
                    <div style={{ marginTop: 8, fontFamily: head, fontSize: 13, letterSpacing: '.3em', color: C.GOLD }}>{T.table}</div>
                  </div>
                )} />
            </Panel>
          )}

          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} C={C} title={L('gallery', 'title', tr.inv_gallery)}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, marginBottom: 28 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <Rise key={i} delay={(i % 2) * 0.12} style={{ position: 'relative', aspectRatio: '3 / 4', overflow: 'hidden', background: C.NAVY2, borderRadius: '999px 999px 0 0' }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} className="vr-kb" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', border: `1px solid ${alpha(C.GOLD, 0.5)}` }} />
                    </Rise>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.NAVY} bg={C.IVORY} frame={{ border: `1px solid ${alpha(C.GOLD, 0.45)}` }}
                btn={btn(C)} muted={C.MUTE} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {S.rsvp && (
            <Panel section="rsvp" head={head} C={C} alt title={L('rsvp', 'title', rsvpL.title)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.IVORY, muted: C.MUTE, line: alpha(C.IVORY, 0.35), hair: alpha(C.GOLD, 0.3), accent: C.GOLD,
                font: body, display: head, displayItalic: false, btnFont: body, radius: 999, btnSolid: true,
                doneMark: <div aria-hidden="true" style={{ margin: '0 auto 16px', fontSize: 28, color: C.GOLD }}>♛</div>,
                marker: (a) => <span style={{ display: 'block', width: 13, height: 13, borderRadius: '50%', border: `1px solid ${a ? C.GOLD : alpha(C.IVORY, 0.6)}`, background: a ? C.GOLD : 'transparent', transition: 'background .3s' }} />,
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {S.guestbook && (
            <Panel section="guestbook" head={head} C={C} title={L('guestbook', 'title', gbookL.title)} center={false}>
              <GuestbookForm inv={inv} field={{ ...field(C), textAlign: 'left' }} btn={btn(C)} errorColor="#E89A8A" />
              <Stagger step={0.1} style={{ marginTop: 18 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '22px 0', borderTop: `1px solid ${alpha(C.GOLD, 0.4)}` }}>
                      <blockquote style={{ margin: 0, fontSize: 19, lineHeight: 1.6 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, fontFamily: fonts.script, fontSize: 30, color: C.GOLD }}>
                        {msg.name}{msg.date ? <span style={{ fontFamily: body, fontSize: 13, color: C.MUTE }}> · {gbook.formatDate(msg.date)}</span> : null}
                      </figcaption>
                    </figure>
                  )
                })}
              </Stagger>
            </Panel>
          )}

          <End inv={inv} T={T} C={C} fonts={fonts} />
          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={head} />
        </motion.div>
      )}
    </div></PaletteContext.Provider>
  )
}

function End({ inv, T, C, fonts }) {
  const [ref, seen] = useInView(0.3)
  const single = inv.heroTitle || (inv.isCouple ? '' : inv.single)
  const longest = single || [inv.groom, inv.bride].sort((a, b) => String(b || '').length - String(a || '').length)[0] || ''
  const P = resolvePhotos(PHOTOS, inv.images)
  return (
    <section ref={ref} data-section="finale" style={{ position: 'relative', height: '100svh', minHeight: 620, overflow: 'hidden', background: C.NAVY }}>
      {P.finale && <img src={P.finale} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 55%', scale: seen ? '1' : '1.18', transition: 'scale 9s cubic-bezier(.2,.6,.2,1)' }} />}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${alpha(C.NAVY, 0.85)}, ${alpha(C.NAVY, 0.2)} 42%, ${alpha(C.NAVY, 0)} 60%, ${alpha(C.NAVY, 0.6)})` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: '11svh', textAlign: 'center', padding: '0 24px', color: C.IVORY }}>
        <Fx style={{ fontFamily: fonts.head, fontSize: 13, letterSpacing: '.32em', color: C.GOLD }}>{T.end}</Fx>
        <Fx delay={0.2} style={{ marginTop: 10, fontFamily: fonts.script, fontSize: nameSize(longest), lineHeight: 1.15 }}>
          {single || <>{inv.groom}<span style={{ display: 'block', fontFamily: fonts.head, fontSize: 14, letterSpacing: '.3em', lineHeight: 1.6, color: C.GOLD }}>{inv.and}</span>{inv.bride}</>}
        </Fx>
        <Fx delay={0.4} style={{ marginTop: 14, fontFamily: fonts.head, fontSize: 14, letterSpacing: '.3em' }}>{inv.fullDate}</Fx>
      </div>
    </section>
  )
}

function MapPin({ C }) {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -10, top: -10, width: 20, height: 20, borderRadius: '50%', background: C.NAVY, border: `5px solid ${C.GOLD}`, boxShadow: `0 6px 16px ${alpha('#000', 0.5)}` }} />
    </span>
  )
}
