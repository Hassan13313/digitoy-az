import { motion } from 'framer-motion'
import { useState } from 'react'
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
import { VIRAL_CSS, useInView } from '../_shared/viralHooks'
import { resolvePhotos, isCustomPhoto } from '../templatePhotos'
import { HASIYE_URI } from './ornaments'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { PaletteContext, resolvePalette, scaleFont } from '../_shared/palette'
import Countdown, { COUNTDOWN_CSS } from '../_shared/luxe/Countdown'

/* ─────────────────────────────────────────────────────────────────────────────
   ORIENTAL LUXE — lüks toy seriyası (2026-11, foto redizayn)

   Konsept: Azərbaycan məclisi — Şəki şəbəkəsinin rəngli şüşələrindən düşən
   işıq, nar qırmızısı məxmər, xalça, mis sini, nar və fənərlər.
   Açılış örtüyün ÖZÜDÜR (Frame — açılışda və örtükdə eyni kadr):
     1. nar qırmızısı fonda tağ formalı pəncərə; içində gəlin, şəbəkə işığı
        rəngli ləkələrlə tərpənir; tağın başında səkkizguşəli ulduzda monoqram
     2. toxunanda tağ bütün ekrana açılır (clip-path), kamera azca geri çəkilir
     3. aşağıda tarix və məkan görünür, açılış söner
   Daxildə: mərkəzə düzlənmiş; bölmələr xalça haşiyəsi zolağı ilə ayrılır;
   başlıqlar ortadan açılır; tağlı fotolar; səkkizguşəli ulduzlarda geri sayım və süfrə.
   Fotolar GPT Image ilə bu şablon üçün yaradılıb (public/img/wedding/viral/ol-*).
   Şriftlər: Reem Kufi (başlıq, adlar) · Alegreya (mətn).
   Köhnə sifarişlər pozulmur: id, açılış sahələri (openingSpec) və mətn
   açarları (copy.js) əvvəlki kimidir.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('oriental-luxe')
const ID = 'oriental-luxe'

const LINKS = { primary: ['NAR'], accent: ['GOLD'], background: ['DEEP'], text: ['IVORY'] }

/* Tağ: açılışda pəncərə, toxunanda bütün ekran */
const ARCH_CLOSED = 'inset(25% 13% 16% 13% round 37vw 37vw 0 0 / 40vw 40vw 0 0)'
const ARCH_OPEN = 'inset(0% 0% 0% 0% round 0vw 0vw 0 0 / 0vw 0vw 0 0)'

const KEYFRAMES = (C) => (`
@keyframes ol-drift { 0% { translate: -6% -3% } 50% { translate: 5% 4% } 100% { translate: -6% -3% } }
@keyframes ol-hold { from { scale: 1.12 } to { scale: 1.16 } }
@keyframes ol-pulse { 0%,100% { box-shadow: 0 0 0 0 ${alpha(C.GOLD, 0.35)} } 60% { box-shadow: 0 0 0 14px ${alpha(C.GOLD, 0)} } }
@keyframes ol-out { to { opacity: 0 } }
@keyframes ol-drip { 0% { scale: 1 0 } 50% { scale: 1 1 } 100% { scale: 1 1; opacity: 0 } }
@keyframes ol-spin { from { rotate: 0deg } to { rotate: 45deg } }
@keyframes ol-star { from { opacity: 0; scale: .6; rotate: -45deg } to { opacity: 1; scale: 1; rotate: 0deg } }
[data-ol] .ol-fx { opacity: 0; translate: 0 10px; transition: opacity 1.4s cubic-bezier(.2,.7,.2,1), translate 1.4s cubic-bezier(.2,.7,.2,1); }
[data-ol] .ol-fx.on { opacity: 1; translate: 0 0; }
[data-ol] .ol-cl { display: inline-block; clip-path: inset(-20% 50% -25% 50%); transition: clip-path 1.5s cubic-bezier(.65,0,.25,1); }
[data-ol] .on > .ol-cl { clip-path: inset(-20% -6% -25% -6%); }
[data-ol] canvas, [data-ol] div[aria-hidden="true"], [data-ol] span[aria-hidden="true"] { pointer-events: none; }
[data-ol] ::placeholder { color: ${alpha(C.MUTE, 0.85)}; font-style: italic; }
[data-ol] input:focus-visible, [data-ol] textarea:focus-visible { border-color: ${C.GOLD} !important; outline: none; }
[data-ol] button:focus-visible, [data-ol] a:focus-visible, [data-ol] [role="button"]:focus-visible { outline: 1px solid ${C.GOLD}; outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) { [data-ol] *, [data-ol] { animation: none !important; transition: none !important; } [data-ol] .ol-fx { opacity: 1; translate: none; } [data-ol] .ol-cl { clip-path: none; } }
`)

const OPEN_MS = 4400
const REVEAL_MS = 3500

function Fx({ as: Tag = 'div', delay = 0, style, children }) {
  const [ref, seen] = useInView(0.18)
  return <Tag ref={ref} className={`ol-fx${seen ? ' on' : ''}`} style={{ transitionDelay: `${delay}s`, ...style }}>{children}</Tag>
}

/* Başlıq ortadan açılır (daxili span kəsilir — IntersectionObserver kəsilmiş elementi görmür) */
function Title({ children, head, C, style }) {
  const [ref, seen] = useInView(0.2)
  return (
    <h2 ref={ref} className={seen ? 'on' : undefined} style={{ margin: 0, fontFamily: head, fontWeight: 400, fontSize: scaleFont('clamp(28px, 8.2vw, 36px)', C.hs), lineHeight: 1.2, color: C.IVORY, ...style }}>
      <span className="ol-cl">{children}</span>
    </h2>
  )
}

/* Xalça haşiyəsi zolağı */
function Band({ style }) {
  return <div aria-hidden="true" style={{ height: 22, backgroundImage: HASIYE_URI, backgroundRepeat: 'repeat-x', backgroundPosition: 'center', opacity: 0.8, ...style }} />
}

/* Səkkizguşəli ulduz: iki kvadrat (biri 45° fırlanır) */
function Star({ size, C, fill, seen = true, children, style }) {
  const sq = { position: 'absolute', inset: '14.6%', border: `1px solid ${alpha(C.GOLD, 0.8)}`, background: fill }
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'grid', placeItems: 'center', ...style }}>
      <span aria-hidden="true" style={{ ...sq, opacity: seen ? 1 : 0, transition: 'opacity 1s' }} />
      <span aria-hidden="true" style={{ ...sq, rotate: seen ? '45deg' : '0deg', opacity: seen ? 1 : 0, transition: 'rotate 1.6s cubic-bezier(.2,.7,.2,1) .2s, opacity 1s' }} />
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  )
}

/* Şəbəkə işığı: rəngli şüşədən düşən ləkələr yavaş tərpənir */
function GlassLight({ strong }) {
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', inset: '-15%', mixBlendMode: 'soft-light', opacity: strong ? 0.7 : 0.3, transition: 'opacity 2.4s',
      background: 'radial-gradient(28% 22% at 22% 30%, rgba(214,40,60,.9), transparent 70%), radial-gradient(24% 20% at 74% 24%, rgba(40,90,200,.85), transparent 70%), radial-gradient(26% 22% at 64% 62%, rgba(232,180,60,.9), transparent 70%), radial-gradient(22% 18% at 30% 70%, rgba(40,150,110,.75), transparent 70%)',
      animation: 'ol-drift 14s ease-in-out infinite',
    }} />
  )
}

/* ═══ ÇƏRÇİVƏ: açılış və örtük eyni kadrdır ═══ */
function Frame({ inv, weddingData, T, C, fonts, kicker, first, second, single, go, gate = false, instant = false }) {
  const { ot } = inv
  const P = resolvePhotos(PHOTOS, inv.images)
  const t = (v) => (instant ? 'none' : v)
  const line = single || [first, second].filter(Boolean).join(` ${inv.and} `)
  const mono = ot.mono
  return (
    <>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `radial-gradient(120% 70% at 50% 45%, ${C.NAR}, ${C.DEEP} 75%)` }} />
      {P.hero && (
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', clipPath: go ? ARCH_OPEN : ARCH_CLOSED, transition: t('clip-path 2.3s cubic-bezier(.7,0,.2,1) .15s') }}>
          <img src={P.hero} alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%', display: 'block',
            scale: go ? '1' : '1.12', transition: t('scale 5s cubic-bezier(.2,.6,.2,1)'), animation: gate && !go ? 'ol-hold 8s ease-in-out infinite alternate' : undefined,
          }} />
          {/* rəngli işıq yalnız şablonun öz fotosunda — admin şəklində yoxdur */}
          {!isCustomPhoto(inv.images, 'hero') && <GlassLight strong={!go} />}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${alpha(C.DEEP, 0.78)} 0%, ${alpha(C.DEEP, 0.3)} 28%, ${alpha(C.DEEP, 0)} 44%, ${alpha(C.DEEP, 0)} 60%, ${alpha(C.DEEP, 0.92)} 100%)`, opacity: go ? 1 : 0, transition: t('opacity 2s .6s') }} />
        </div>
      )}

      {/* tağın zər çərçivəsi və başındakı ulduz — yalnız bağlı pəncərədə */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '25%', left: '13%', right: '13%', bottom: '16%', borderRadius: '50% 50% 0 0 / 40vw 40vw 0 0', border: `1px solid ${alpha(C.GOLD, 0.85)}`, boxShadow: `0 0 0 6px ${alpha(C.DEEP, 0.0)}, 0 0 0 7px ${alpha(C.GOLD, 0.35)}`, opacity: go ? 0 : 1, scale: go ? '1.25' : '1', transition: t('opacity .9s, scale 2.3s cubic-bezier(.7,0,.2,1)') }} />
      {mono && mono.kind !== 'none' && (
        <div style={{ position: 'absolute', left: '50%', top: '25%', translate: '-50% -50%', opacity: go ? 0 : 1, transition: t('opacity .8s') }}>
          <Star size={62} C={C} fill={C.DEEP}>
            <span style={{ display: 'grid', placeItems: 'center', width: 34, height: 34, overflow: 'hidden', borderRadius: '50%', fontFamily: fonts.head, fontSize: 15, color: C.GOLD }}>
              <MonoContent mono={mono} ornament={<span aria-hidden="true" style={{ display: 'block', width: 7, height: 7, rotate: '45deg', background: C.GOLD }} />} imgStyle={{ borderRadius: '50%' }} />
            </span>
          </Star>
        </div>
      )}

      <div style={{ position: 'absolute', left: 0, right: 0, top: 'max(7svh, 44px)', textAlign: 'center', padding: '0 20px', color: C.IVORY }}>
        {kicker && <div style={{ fontFamily: fonts.head, fontSize: 13, letterSpacing: '.3em', textTransform: 'uppercase', color: C.GOLD }}>{kicker}</div>}
        <h1 style={{ margin: '8px 0 0', fontFamily: fonts.head, fontWeight: 400, fontSize: nameSize(line, true), lineHeight: 1.08, textShadow: `0 2px 22px ${alpha(C.DEEP, 0.7)}` }}>{line}</h1>
        {gate && ot.show('meta') && <div style={{ marginTop: 8, fontStyle: 'italic', fontSize: 15.5, color: alpha(C.IVORY, 0.85), opacity: go ? 0 : 1, transition: 'opacity .7s' }}>{ot.text('meta')}</div>}
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 'max(8svh, 50px)', textAlign: 'center', padding: '0 22px', color: C.IVORY,
        opacity: go ? 1 : 0, translate: go ? '0 0' : '0 10px', transition: t('opacity 1.4s 2.4s, translate 1.4s 2.4s'),
      }}>
        <Band style={{ width: 140, margin: '0 auto 14px', height: 22 }} />
        <div style={{ fontFamily: fonts.head, fontSize: 17, letterSpacing: '.12em', color: C.GOLD }}>{inv.fullDate}</div>
        <div style={{ marginTop: 6, fontStyle: 'italic', fontSize: 16.5, color: alpha(C.IVORY, 0.88) }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' — ')}</div>
        {!gate && (
          <div style={{ marginTop: 14, fontStyle: 'italic', fontSize: 14, color: C.MUTE }}>
            {T.scroll}
            <span aria-hidden="true" style={{ display: 'block', width: 1, height: 26, margin: '8px auto 0', background: `linear-gradient(${C.GOLD}, transparent)`, transformOrigin: 'top', animation: 'ol-drip 2.6s ease-in-out infinite' }} />
          </div>
        )}
      </div>

      {gate && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 'max(3.5svh, 20px)', textAlign: 'center', opacity: go ? 0 : 1, transition: 'opacity .7s', pointerEvents: go ? 'none' : undefined }}>
          {ot.show('cta') && <span style={{ display: 'inline-flex', alignItems: 'center', minHeight: 50, padding: '0 32px', borderRadius: 999, border: `1px solid ${alpha(C.GOLD, 0.75)}`, background: alpha(C.DEEP, 0.55), fontFamily: fonts.head, fontSize: 15, letterSpacing: '.08em', color: C.IVORY, animation: 'ol-pulse 2.8s ease-in-out infinite' }}>{ot.text('cta')}</span>}
          {ot.show('hint') && <div style={{ marginTop: 8, fontStyle: 'italic', fontSize: 13.5, color: C.MUTE }}>{ot.text('hint')}</div>}
        </div>
      )}
    </>
  )
}

function ArchOpening({ inv, weddingData, T, C, fonts }) {
  const gate = useGate({ inv, ms: OPEN_MS, revealAt: REVEAL_MS })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  return (
    <div {...gate.gateProps} data-ol style={{
      position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: C.DEEP, color: C.IVORY, fontFamily: fonts.body,
      animation: gate.opening ? `ol-out .9s ease ${(REVEAL_MS + 100) / 1000}s forwards` : undefined,
    }}>
      <Frame inv={inv} weddingData={weddingData} T={T} C={C} fonts={fonts} kicker={inv.L('hero', 'kicker', inv.ot.text('kicker'))}
        first={titleOv === '' ? '' : first} second={titleOv === '' ? '' : second} go={gate.opening} gate />
    </div>
  )
}

/* Bölmə */
function Panel({ id, section, title, sub, children, head, C, alt = false, center = true, band = true, style }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '76px 26px', background: alt ? C.NAR : C.DEEP, color: C.IVORY, textAlign: center ? 'center' : undefined, ...style }}>
      {band && <Band style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
      <div style={{ maxWidth: 440, margin: '0 auto' }}>
        {title && <Title head={head} C={C}>{title}</Title>}
        {sub && <Fx as="p" delay={0.15} style={{ margin: '14px auto 0', maxWidth: '32ch', fontStyle: 'italic', fontSize: 17, color: C.MUTE }}>{sub}</Fx>}
        <div style={{ marginTop: title || sub ? 28 : 0 }}>{children}</div>
      </div>
    </section>
  )
}

const archR = '999px 999px 0 0'

const field = (C) => ({
  width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${alpha(C.IVORY, 0.35)}`, borderRadius: 0,
  padding: '12px 2px', fontSize: 18, color: C.IVORY, outline: 'none', textAlign: 'center',
})
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '0 24px', borderRadius: 999,
  fontSize: 16, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.GOLD : 'transparent', color: on ? C.DEEP : C.IVORY, border: `1px solid ${on ? C.GOLD : alpha(C.GOLD, 0.55)}`,
}))
const suggest = (C) => ({ bg: C.DEEP, border: `1px solid ${alpha(C.GOLD, 0.35)}`, active: alpha(C.GOLD, 0.14), text: C.IVORY, table: C.GOLD, radius: 2 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function OrientalLuxeTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const fonts = { head, body }
  const T = inv.copy(TXT)
  const P = resolvePhotos(PHOTOS, inv.images)
  const [veil] = useState(() => !inv.opened)
  const single = inv.heroTitle || (inv.isCouple ? '' : inv.single)

  return (
    <PaletteContext.Provider value={C}><div data-ol data-vr lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.DEEP, minHeight: '100vh', fontFamily: body, color: C.IVORY, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.GOLD, 0.3),
    }}>
      <style>{VIRAL_CSS + KEYFRAMES(C) + COUNTDOWN_CSS}</style>
      {veil && <ArchOpening inv={inv} weddingData={weddingData} T={T} C={C} fonts={fonts} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: alpha(C.DEEP, 0.6), border: `1px solid ${alpha(C.GOLD, 0.45)}`, backdropFilter: 'blur(8px)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.GOLD} idle={alpha(C.GOLD, 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.DEEP, 0.84), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: C.IVORY, borderBottom: `1px solid ${alpha(C.GOLD, 0.22)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.IVORY, 0.7), fontSize: 15, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontSize: 13, letterSpacing: '.28em', color: C.GOLD }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* ÖRTÜK — açılışın son kadrı */}
          <section data-section="hero" style={{ position: 'relative', marginTop: -52, height: '100svh', minHeight: 620, overflow: 'hidden', background: C.DEEP }}>
            <Frame inv={inv} weddingData={weddingData} T={T} C={C} fonts={fonts} kicker={L('hero', 'kicker', inv.ot.text('kicker'))}
              first={inv.isCouple ? inv.groom : ''} second={inv.isCouple ? inv.bride : ''} single={single} go instant={veil} />
          </section>

          {/* Dəvət */}
          <section data-section="invite" style={{ position: 'relative', padding: '70px 28px 64px', textAlign: 'center', background: C.DEEP }}>
            <div style={{ maxWidth: 430, margin: '0 auto' }}>
              <Fx as="p" style={{ margin: 0, fontSize: 'clamp(19px, 5.6vw, 22px)', lineHeight: 1.7 }}>{tr.inv_join}</Fx>
              {inv.isCorp && weddingData.organizer?.trim() && <Fx delay={0.15} style={{ marginTop: 18, fontSize: 15, fontStyle: 'italic', color: C.MUTE }}>{tr.organizer_display}: {weddingData.organizer}</Fx>}
            </div>
          </section>

          {S.countdown && (
            <Panel section="countdown" head={head} C={C} alt title={L('countdown', 'title', cd.title)}>
              <Countdown kind="star8" cd={cd} C={{ BG: C.DEEP, BG2: C.NAR, NAR: C.NAR, INK: C.IVORY, ACCENT: C.GOLD, MUTE: C.MUTE }} fonts={{ num: head, caps: head }} />
            </Panel>
          )}

          {/* Nar və mis sini — tağlı pəncərədə */}
          {P.nar && (
            <section data-section="photo" style={{ position: 'relative', padding: '64px 26px 70px', background: C.DEEP, textAlign: 'center' }}>
              <Band style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
              <Rise style={{ position: 'relative', maxWidth: 400, margin: '0 auto', aspectRatio: '3 / 4.4', borderRadius: archR, overflow: 'hidden', isolation: 'isolate' }}>
                <Photo src={P.nar} alt="" focus="50% 50%" style={{ position: 'absolute', inset: 0 }} />
                <span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', border: `1px solid ${alpha(C.GOLD, 0.8)}`, boxShadow: `inset 0 0 0 6px ${alpha(C.DEEP, 0.55)}, inset 0 0 0 7px ${alpha(C.GOLD, 0.4)}` }} />
              </Rise>
              <Words text={T.nar} step={0.08} style={{ display: 'block', maxWidth: 360, margin: '26px auto 0', fontStyle: 'italic', fontSize: 22, lineHeight: 1.45, color: C.IVORY }} />
            </section>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* PROQRAM — məclis süfrəsi */}
          {S.program && (
            <section data-section="program" style={{ position: 'relative', background: C.NAR, color: C.IVORY }}>
              {P.program && (
                <div style={{ position: 'relative' }}>
                  <Photo src={P.program} alt="" focus="50% 50%" style={{ height: '68svh', minHeight: 420 }} />
                  <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 55%, ${C.NAR})` }} />
                </div>
              )}
              <div style={{ position: 'relative', padding: P.program ? '0 26px 80px' : '80px 26px', textAlign: 'center' }}>
                {!P.program && <Band style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
                <div style={{ maxWidth: 440, margin: '0 auto' }}>
                  <Title head={head} C={C}>{L('program', 'title', timeline.sectionLabel)}</Title>
                  <Stagger step={0.12} style={{ marginTop: 18 }}>
                    {timeline.events.map((ev, i) => (
                      <div key={i} style={{ padding: '12px 0' }}>
                        {i > 0 && <span aria-hidden="true" style={{ display: 'block', width: 7, height: 7, margin: '0 auto 18px', rotate: '45deg', border: `1px solid ${C.GOLD}` }} />}
                        <div style={{ fontFamily: head, fontSize: 22, letterSpacing: '.06em', color: C.GOLD }}>{ev.time}</div>
                        <div style={{ marginTop: 4, fontSize: 20, lineHeight: 1.35 }}>{ev.label}</div>
                      </div>
                    ))}
                  </Stagger>
                </div>
              </div>
            </section>
          )}

          {S.venue && (
            <Panel section="venue" head={head} C={C} title={L('venue', 'title', tr.inv_location)}>
              <Rise style={{ position: 'relative', overflow: 'hidden', isolation: 'isolate', borderRadius: archR }}>
                <MapSection
                  weddingData={weddingData} theme={theme} accent={C.GOLD} height="clamp(280px, 78vw, 340px)"
                  map={{ opacity: 0.85, filter: 'grayscale(1) sepia(.5) hue-rotate(-20deg) brightness(.75) contrast(1.05)', tintOpacity: 0.25, tint: C.NAR, blend: 'multiply' }}
                  frame={<MapPin C={C} />}
                  fallback={<div style={{ height: 'clamp(280px, 78vw, 340px)', position: 'relative', background: '#3A0B16' }}><MapPin C={C} /></div>}
                />
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', border: `1px solid ${alpha(C.GOLD, 0.7)}`, boxShadow: `inset 0 0 0 6px ${alpha(C.DEEP, 0.6)}, inset 0 0 0 7px ${alpha(C.GOLD, 0.35)}` }} />
              </Rise>
              <Fx style={{ marginTop: 24, fontFamily: head, fontSize: 28, lineHeight: 1.2 }}>{weddingData.venueName || ''}</Fx>
              {weddingData.venueNote && <Fx delay={0.15} style={{ marginTop: 6, fontStyle: 'italic', fontSize: 17, color: C.MUTE }}>{weddingData.venueNote}</Fx>}
              <Fx delay={0.3}><VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} /></Fx>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} C={C} alt title={L('dresscode', 'title', tr.inv_dresscode)}>
              <Fx>
                <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" />
              </Fx>
            </Panel>
          )}

          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} C={C} title={L('seating', 'title', seatingL.title)} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="ol-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={C.MUTE} accent={C.GOLD}
                nameStyle={{ fontFamily: head, fontSize: 26, lineHeight: 1.2 }}
                card={(num) => (
                  <div style={{ display: 'grid', placeItems: 'center', animation: 'ol-star 1.1s cubic-bezier(.2,.8,.2,1) both' }}>
                    <Star size={200} C={C} fill={C.NAR}>
                      <div style={{ fontFamily: head, fontSize: tableSize(num, 60), lineHeight: 1 }}>{num}</div>
                      <div style={{ marginTop: 6, fontStyle: 'italic', fontSize: 15, color: C.GOLD }}>{T.table}</div>
                    </Star>
                  </div>
                )} />
            </Panel>
          )}

          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} C={C} alt title={L('gallery', 'title', tr.inv_gallery)}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, marginBottom: 28 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <Rise key={i} delay={(i % 2) * 0.12} style={{ position: 'relative', aspectRatio: '3 / 4', overflow: 'hidden', background: C.DEEP, borderRadius: archR }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} className="vr-kb" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', border: `1px solid ${alpha(C.GOLD, 0.55)}` }} />
                    </Rise>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.DEEP} bg={C.IVORY} frame={{ border: `1px solid ${alpha(C.GOLD, 0.45)}` }}
                btn={btn(C)} muted={C.MUTE} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {S.rsvp && (
            <Panel section="rsvp" head={head} C={C} title={L('rsvp', 'title', rsvpL.title)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.IVORY, muted: C.MUTE, line: alpha(C.IVORY, 0.35), hair: alpha(C.GOLD, 0.3), accent: C.GOLD,
                font: body, display: head, displayItalic: false, btnFont: body, radius: 999, btnSolid: true,
                doneMark: <span aria-hidden="true" style={{ display: 'block', width: 14, height: 14, margin: '0 auto 20px', rotate: '45deg', background: C.GOLD }} />,
                marker: (a) => <span style={{ display: 'block', width: 11, height: 11, rotate: '45deg', border: `1px solid ${a ? C.GOLD : alpha(C.IVORY, 0.6)}`, background: a ? C.GOLD : 'transparent', transition: 'background .3s' }} />,
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {S.guestbook && (
            <Panel section="guestbook" head={head} C={C} alt title={L('guestbook', 'title', gbookL.title)} center={false}>
              <GuestbookForm inv={inv} field={{ ...field(C), textAlign: 'left' }} btn={btn(C)} errorColor="#F0A08F" />
              <Stagger step={0.1} style={{ marginTop: 18 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '22px 0', borderTop: `1px solid ${alpha(C.GOLD, 0.4)}` }}>
                      <blockquote style={{ margin: 0, fontStyle: 'italic', fontSize: 19, lineHeight: 1.6 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, fontFamily: head, fontSize: 16, letterSpacing: '.06em', color: C.GOLD }}>
                        {msg.name}{msg.date ? <span style={{ fontFamily: body, fontSize: 13, letterSpacing: 0, color: C.MUTE }}> · {gbook.formatDate(msg.date)}</span> : null}
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
  const line = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const P = resolvePhotos(PHOTOS, inv.images)
  return (
    <section ref={ref} data-section="finale" style={{ position: 'relative', height: '100svh', minHeight: 620, overflow: 'hidden', background: C.DEEP }}>
      {P.finale && <img src={P.finale} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 55%', scale: seen ? '1' : '1.16', transition: 'scale 9s cubic-bezier(.2,.6,.2,1)' }} />}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${alpha(C.DEEP, 0.88)}, ${alpha(C.DEEP, 0.2)} 42%, ${alpha(C.DEEP, 0)} 60%, ${alpha(C.DEEP, 0.6)})` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: '11svh', textAlign: 'center', padding: '0 24px', color: C.IVORY }}>
        <Fx style={{ fontStyle: 'italic', fontSize: 18, color: C.GOLD }}>{T.end}</Fx>
        <Fx delay={0.2} style={{ marginTop: 10, fontFamily: fonts.head, fontSize: nameSize(line), lineHeight: 1.1 }}>{line}</Fx>
        <Fx delay={0.4}><Band style={{ width: 140, margin: '16px auto 10px' }} /></Fx>
        <Fx delay={0.5} style={{ fontFamily: fonts.head, fontSize: 16, letterSpacing: '.12em' }}>{inv.fullDate}</Fx>
      </div>
    </section>
  )
}

function MapPin({ C }) {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '55%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -9, top: -9, width: 18, height: 18, rotate: '45deg', background: C.DEEP, border: `4px solid ${C.GOLD}`, boxShadow: `0 6px 16px ${alpha('#000', 0.5)}` }} />
    </span>
  )
}
