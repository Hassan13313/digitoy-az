import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import LanguageSwitcher from '../../../components/LanguageSwitcher'
import DressCodeSection from '../DressCodeSection'
import MapSection from '../MapSection'
import { MonoContent } from '../MonoContent'
import { enterDirection } from '../motion'
import { useGate, openingNames, alpha } from '../useInvitation'
import { MusicFab, EqBars, StoryBlock, InvitationEnd, ReplyForm } from '../invitationKit'
import { VenueLinks, SeatFinder, PhotoQr, GuestbookForm } from '../blocks'
import { galleryDesc, tableSize } from '../kids'
import { Words, Rise, Stagger, Photo } from '../viral'
import { VIRAL_CSS, useInView, coverSpot } from '../viralHooks'
import { resolvePhotos, isCustomPhoto } from '../../templatePhotos'
import { scaleFont } from '../palette'
import Countdown, { COUNTDOWN_CSS } from './Countdown'
import Overlay, { OVERLAY_CSS } from './Overlay'
import FilmReel from '../FilmReel'

/* ─────────────────────────────────────────────────────────────────────────────
   LÜKS FOTO ŞABLON MÜHƏRRİKİ (2026-11)

   Köhnə toy şablonları (Night Sky, Mediterranean, Royal Gold…) bugünkü lüks
   seriyanın quruluşuna bu mühərriklə keçir. Hər şablon öz qovluğunda yalnız
   bunları saxlayır: palette.js (rənglər, ad ölçüsü), photos.js (4 GPT fotosu),
   copy.js (mətnlər) və index.jsx (konfiqurasiya). Mühərrik eyni funksiyaları
   (masa axtarışı, RSVP, arzular, foto QR, xəritə, proqram, geyim, hekayə,
   musiqi, dil, admin override-ları) bütün şablonlarda eyni saxlayır; görünüşü
   konfiqurasiya dəyişir:
     tone      'dark' | 'light'      — fon/mətn kontrastı
     align     'center' | 'left'     — bölmələrin düzlənməsi
     opening   kind:                 — açılışın effekti (açılış örtüyün özüdür)
                 bright  qaranlıqdan işıqlanır
                 zoom    kamera nöqtədən geri çəkilir (origin)
                 iris    dairəvi pəncərə bütün ekrana açılır (origin)
                 frame   paspartulu kadr bütün ekrana açılır
                 arch    tağlı pəncərə açılır
                 split   iki tay qapı kimi ortadan açılır
                 letterbox  kino kimi üfüqi zolaqlar açılır
                 blur    bulanıqdan aydınlaşır
               glow: { kind: 'bloom' | 'stars', pts: [[x, y]] } — fotodakı işıq
                 nöqtələrinə bağlı effekt (coverSpot); admin şəkli qoyulanda sönür
     names     ad şrifti (script və ya başlıq), böyük/kiçik hərf
     ornament  ayırıcıdakı işarə
     countdown geri sayımın forması (bax Countdown.jsx — hər şablonun özününkü)
     seat      'card' | 'circle' | 'ticket'
     program   'card' (fotonun üstündə kart) | 'list' (fotonun altında siyahı)
     detail    'full' (yazı fotonun üstündə) | 'inset' (çərçivəli foto, yazı altda) | 'arch'
     gallery   'rect' | 'arch' | 'circle'
   Palitra açarları hər şablonda eynidir: BG, BG2, INK, ACCENT, MUTE.
   Şəkil açarları: hero, detail, program, finale. Mətn: brand, left, line,
   table, end, scroll (+ istəyə görə honour).
   ───────────────────────────────────────────────────────────────────────── */

const KEYFRAMES = (C) => (`
@keyframes lx-hold { from { scale: var(--lx-s0) } to { scale: calc(var(--lx-s0) + .04) } }
@keyframes lx-pulse { 0%,100% { box-shadow: 0 0 0 0 ${alpha(C.ACCENT, 0.35)} } 60% { box-shadow: 0 0 0 14px ${alpha(C.ACCENT, 0)} } }
@keyframes lx-out { to { opacity: 0 } }
@keyframes lx-drip { 0% { scale: 1 0 } 50% { scale: 1 1 } 100% { scale: 1 1; opacity: 0 } }
@keyframes lx-bloom { 0% { opacity: 0; scale: .4 } 40% { opacity: 1; scale: 1.15 } 100% { opacity: .6; scale: 1 } }
@keyframes lx-flicker { 0%,100% { opacity: .6 } 50% { opacity: .78 } }
@keyframes lx-tw { 0%,100% { opacity: 0; scale: .4 } 50% { opacity: .95; scale: 1.2 } }
@keyframes lx-card { from { opacity: 0; transform: perspective(700px) rotateX(70deg) } to { opacity: 1; transform: none } }
@keyframes lx-pop { from { opacity: 0; scale: .7 } to { opacity: 1; scale: 1 } }
@keyframes lx-shine { from { translate: -120% 0 } to { translate: 120% 0 } }
[data-lx] .lx-fx { opacity: 0; translate: 0 12px; transition: opacity 1.4s cubic-bezier(.2,.7,.2,1), translate 1.4s cubic-bezier(.2,.7,.2,1); }
[data-lx] .lx-fx.on { opacity: 1; translate: 0 0; }
[data-lx] .lx-cl { display: inline-block; clip-path: var(--lx-clip0); transition: clip-path 1.5s cubic-bezier(.65,0,.25,1); }
[data-lx] .on > .lx-cl { clip-path: inset(-20% -6% -25% -6%); }
[data-lx] .lx-tw { position: absolute; width: 3px; height: 3px; margin: -1.5px; border-radius: 50%; background: #fff; box-shadow: 0 0 6px 2px rgba(255,255,255,.75), 0 0 16px 5px rgba(200,215,255,.3); opacity: 0; }
[data-lx] .lx-tw::before, [data-lx] .lx-tw::after { content: ""; position: absolute; left: 50%; top: 50%; width: 22px; height: 1px; margin: -.5px 0 0 -11px; background: linear-gradient(90deg, transparent, rgba(255,255,255,.95), transparent); }
[data-lx] .lx-tw::after { rotate: 90deg; }
[data-lx] canvas, [data-lx] div[aria-hidden="true"], [data-lx] span[aria-hidden="true"] { pointer-events: none; }
[data-lx] ::placeholder { color: ${alpha(C.MUTE, 0.85)}; font-style: italic; }
[data-lx] input:focus-visible, [data-lx] textarea:focus-visible { border-color: ${C.ACCENT} !important; outline: none; }
[data-lx] button:focus-visible, [data-lx] a:focus-visible, [data-lx] [role="button"]:focus-visible { outline: 1px solid ${C.ACCENT}; outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) { [data-lx] *, [data-lx] { animation: none !important; transition: none !important; } [data-lx] .lx-fx { opacity: 1; translate: none; } [data-lx] .lx-cl { clip-path: none; } }
`)

/* Açılış növləri: bağlı vəziyyət (toxunmadan əvvəl) → açıq (örtük) */
const pct = (o) => `${o[0] * 100}% ${o[1] * 100}%`
function openingStyles(kind, origin) {
  switch (kind) {
    case 'oval': return { clip0: `ellipse(21vmin 29vmin at ${pct(origin)})`, clip1: `ellipse(150vmax 150vmax at ${pct(origin)})`, s0: 1.1 }
    case 'iris': return { clip0: `circle(27vmin at ${pct(origin)})`, clip1: `circle(150vmax at ${pct(origin)})`, s0: 1.12 }
    case 'frame': return { clip0: 'inset(24% 12% 17% 12%)', clip1: 'inset(0% 0% 0% 0%)', s0: 1.1 }
    case 'arch': return { clip0: 'inset(25% 13% 16% 13% round 37vw 37vw 0 0 / 40vw 40vw 0 0)', clip1: 'inset(0% 0% 0% 0% round 0vw 0vw 0 0 / 0vw 0vw 0 0)', s0: 1.12 }
    case 'split': return { clip0: 'inset(0% 47% 0% 47%)', clip1: 'inset(0% 0% 0% 0%)', s0: 1.15 }
    case 'letterbox': return { clip0: 'inset(41% 0% 41% 0%)', clip1: 'inset(0% 0% 0% 0%)', s0: 1.15 }
    case 'zoom': return { clip0: null, s0: 1.38, dim: 0.4 }
    case 'blur': return { clip0: null, s0: 1.14, blur: 16, dim: 0.75 }
    default: return { clip0: null, s0: 1.12, dim: 0.18 } /* bright */
  }
}

function Fx({ as: Tag = 'div', delay = 0, style, children }) {
  const [ref, seen] = useInView(0.18)
  return <Tag ref={ref} className={`lx-fx${seen ? ' on' : ''}`} style={{ transitionDelay: `${delay}s`, ...style }}>{children}</Tag>
}

/* Başlıq: ortadan (və ya soldan) açılır — daxili span kəsilir */
function Title({ children, cfg, C, style }) {
  const [ref, seen] = useInView(0.2)
  return (
    <h2 ref={ref} className={seen ? 'on' : undefined} style={{
      margin: 0, fontFamily: cfg.fonts.head, fontWeight: cfg.headWeight || 400, fontStyle: cfg.headItalic ? 'italic' : undefined,
      textTransform: cfg.headUpper ? 'uppercase' : undefined, letterSpacing: cfg.headUpper ? '.08em' : cfg.headTrack,
      fontSize: scaleFont(cfg.headSize || 'clamp(28px, 8.2vw, 36px)', C.hs), lineHeight: 1.18, color: C.INK,
      '--lx-clip0': cfg.align === 'left' ? 'inset(-20% 100% -25% -6%)' : 'inset(-20% 50% -25% 50%)', ...style,
    }}>
      <span className="lx-cl">{children}</span>
    </h2>
  )
}

/* Ayırıcı: xətlər açılır, ortada şablonun işarəsi */
function Divider({ cfg, C, style }) {
  const [ref, seen] = useInView(0.3)
  const left = cfg.align === 'left'
  const line = { flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${C.ACCENT})`, scale: seen ? '1 1' : '0 1', transition: 'scale 1.5s cubic-bezier(.2,.7,.2,1)' }
  if (left) return <div ref={ref} aria-hidden="true" style={{ width: 64, height: 1, margin: '18px 0', background: C.ACCENT, transformOrigin: 'left', scale: seen ? '1 1' : '0 1', transition: 'scale 1.4s cubic-bezier(.2,.7,.2,1)', ...style }} />
  return (
    <div ref={ref} aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 12, width: 150, margin: '18px auto', color: C.ACCENT, ...style }}>
      <span style={{ ...line, transformOrigin: 'right' }} />
      {cfg.ornament && <span style={{ fontSize: 13, lineHeight: 1, opacity: seen ? 1 : 0, transition: 'opacity 1s .5s' }}>{cfg.ornament}</span>}
      <span style={{ ...line, transformOrigin: 'left', background: `linear-gradient(270deg, transparent, ${C.ACCENT})` }} />
    </div>
  )
}

/* Fotodakı işıq nöqtələrinə bağlı effekt */
function Lights({ imgRef, glow, on, still }) {
  const [pts, setPts] = useState([])
  useEffect(() => {
    const img = imgRef.current
    if (!img) return undefined
    const place = () => setPts(glow.pts.map(([x, y]) => coverSpot(img, x, y)))
    if (img.complete) place(); else img.addEventListener('load', place)
    addEventListener('resize', place)
    return () => { img.removeEventListener('load', place); removeEventListener('resize', place) }
  }, [imgRef, glow])
  if (glow.kind === 'stars') {
    return (
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        {pts.map(([x, y], i) => (
          <span key={i} className="lx-tw" style={{ left: `${x * 100}%`, top: `${y * 100}%`, animation: on || still ? `lx-tw 3s ease-in-out ${((i * 0.41) % 3).toFixed(2)}s infinite` : undefined }} />
        ))}
      </div>
    )
  }
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      {pts.map(([x, y], i) => (
        <span key={i} style={{
          position: 'absolute', left: `${x * 100}%`, top: `${y * 100}%`, width: glow.size || '90vw', maxWidth: 520, aspectRatio: '1', translate: '-50% -50%',
          background: `radial-gradient(circle, ${glow.color || 'rgba(255,236,190,.8)'} 0, rgba(255,220,160,.22) 20%, transparent 60%)`, mixBlendMode: 'screen',
          opacity: still ? 0.6 : 0, animation: still ? 'lx-flicker 4s ease-in-out infinite' : on ? `lx-bloom 2.6s cubic-bezier(.2,.7,.2,1) ${0.2 + i * 0.25}s forwards, lx-flicker 4s ease-in-out 3s infinite` : undefined,
        }} />
      ))}
    </div>
  )
}

/* Adlar */
function Names({ cfg, C, inv, first, second, single, size, big }) {
  if (!first && !second && !single) return null
  const n = cfg.names
  const inline = !single && !!first && !!second && (n.inline === true || (n.inline !== false && Array.from(`${first}${second}`).length <= (n.inlineMax || 13)))
  const andStyle = n.andStyle || { fontFamily: cfg.fonts.caps || cfg.fonts.head, fontSize: 14, letterSpacing: '.3em', color: C.ACCENT }
  return (
    <div style={{ fontFamily: n.font, fontWeight: n.weight || 400, fontStyle: n.italic ? 'italic' : undefined, textTransform: n.upper ? 'uppercase' : undefined, letterSpacing: n.track, fontSize: inline ? (big ? n.inlineSize : n.inlineSizeSmall || n.inlineSize) : size, lineHeight: n.lh || 1.1 }}>
      {single || (inline ? (
        <>{first} <span style={{ fontSize: '.62em', color: C.ACCENT, fontStyle: n.andItalic ? 'italic' : undefined, textTransform: 'none', letterSpacing: 0 }}>{inv.and}</span> {second}</>
      ) : (
        <>
          {first}
          {second && <span style={{ display: 'block', lineHeight: 1.7, textTransform: 'none', fontStyle: 'normal', ...andStyle }}>{inv.and}</span>}
          {second}
        </>
      ))}
    </div>
  )
}

/* ═══ ÇƏRÇİVƏ: açılış və örtük eyni kadrdır ═══ */
function Frame({ cfg, inv, weddingData, T, C, kicker, first, second, single, go, gate = false, instant = false }) {
  const { ot } = inv
  const P = resolvePhotos(cfg.photos, inv.images)
  const img = useRef(null)
  const o = cfg.opening
  const origin = o.origin || [0.5, 0.5]
  const st = openingStyles(o.kind, origin)
  const t = (v) => (instant ? 'none' : v)
  const light = cfg.tone === 'light'
  const longest = single || [first, second].sort((a, b) => String(b || '').length - String(a || '').length)[0] || ''
  const left = cfg.heroAlign === 'left'
  const custom = isCustomPhoto(inv.images, 'hero')
  const shade = cfg.shade || (light ? 0.85 : 0.72)
  const mono = cfg.mono ? ot.mono : null
  return (
    <>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: cfg.gateBg || `radial-gradient(120% 70% at 50% 45%, ${C.BG2}, ${C.BG} 75%)` }} />
      {P.hero && (
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', clipPath: st.clip0 ? (go ? st.clip1 : st.clip0) : undefined, transition: t('clip-path 2.3s cubic-bezier(.7,0,.2,1) .15s') }}>
          <div style={{
            position: 'absolute', inset: 0, transformOrigin: pct(origin), '--lx-s0': st.s0, scale: go ? '1' : String(st.s0),
            filter: go ? 'none' : `${st.dim != null ? `brightness(${st.dim}) ` : ''}${st.blur ? `blur(${st.blur}px)` : ''}`.trim() || 'none',
            transition: t(`scale ${o.kind === 'zoom' ? 5.5 : 5}s cubic-bezier(.45,0,.15,1), filter 2.6s cubic-bezier(.3,0,.2,1) .2s`),
            animation: gate && !go ? 'lx-hold 8s ease-in-out infinite alternate' : undefined,
          }}>
            <img ref={img} src={P.hero} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%', display: 'block' }} />
            {o.glow && !custom && <Lights imgRef={img} glow={o.glow} on={go} still={instant} />}
          </div>
          <div style={{
            position: 'absolute', inset: 0, opacity: st.clip0 ? (go ? 1 : 0) : 1, transition: t('opacity 2s .6s'),
            background: `linear-gradient(180deg, ${alpha(C.BG, shade)} 0%, ${alpha(C.BG, shade * 0.4)} ${cfg.shadeTop || 30}%, ${alpha(C.BG, 0)} ${(cfg.shadeTop || 30) + 16}%, ${alpha(C.BG, 0)} ${light ? 50 : 58}%, ${alpha(C.BG, light ? 0.82 : 0.7)} ${light ? 80 : 84}%, ${alpha(C.BG, 0.94)} 100%)`,
          }} />
        </div>
      )}

      {gate && o.overlay && <Overlay o={o.overlay} go={go} instant={instant} />}

      {/* bağlı pəncərənin çərçivəsi */}
      {(o.kind === 'frame' || o.kind === 'arch' || o.kind === 'iris' || o.kind === 'oval') && (
        <div aria-hidden="true" style={{
          position: 'absolute', border: `1px solid ${alpha(C.ACCENT, 0.85)}`, boxShadow: `0 0 0 6px ${alpha(C.BG, 0)}, 0 0 0 7px ${alpha(C.ACCENT, 0.35)}`,
          ...(o.kind === 'iris' || o.kind === 'oval'
            ? { left: `${origin[0] * 100}%`, top: `${origin[1] * 100}%`, width: o.kind === 'oval' ? '42vmin' : '54vmin', height: o.kind === 'oval' ? '58vmin' : '54vmin', translate: '-50% -50%', borderRadius: '50%', ...(o.kind === 'oval' ? { border: `2px solid ${alpha(C.ACCENT, 0.95)}`, boxShadow: `0 0 0 5px ${alpha(C.BG, 0.5)}, 0 0 0 7px ${alpha(C.ACCENT, 0.55)}, 0 0 40px ${alpha(C.ACCENT, 0.35)}` } : null) }
            : o.kind === 'arch'
              ? { top: '25%', left: '13%', right: '13%', bottom: '16%', borderRadius: '50% 50% 0 0 / 40vw 40vw 0 0' }
              : { top: '24%', left: '12%', right: '12%', bottom: '17%' }),
          opacity: go ? 0 : 1, scale: go ? '1.3' : '1', transition: t('opacity .9s, scale 2.3s cubic-bezier(.7,0,.2,1)'),
        }} />
      )}

      <div style={{ position: 'absolute', left: 0, right: 0, top: cfg.namesTop || 'max(7svh, 44px)', textAlign: left ? 'left' : 'center', padding: '0 24px', color: C.INK }}>
        {mono && mono.kind !== 'none' && (
          <div style={{ display: 'grid', placeItems: 'center', width: 52, height: 52, margin: left ? '0 0 12px' : '0 auto 12px', borderRadius: '50%', overflow: 'hidden', border: `1px solid ${alpha(C.ACCENT, 0.8)}`, boxShadow: `inset 0 0 0 3px ${alpha(C.BG, 0.4)}, inset 0 0 0 4px ${alpha(C.ACCENT, 0.4)}`, background: alpha(C.BG, 0.35), backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', fontFamily: cfg.fonts.caps || cfg.fonts.head, fontSize: 15, letterSpacing: '.08em', color: C.ACCENT }}>
            <MonoContent mono={mono} ornament={<span style={{ fontSize: 18 }}>{cfg.ornament || '✦'}</span>} imgStyle={{ borderRadius: '50%' }} />
          </div>
        )}
        {kicker && <div style={{ fontFamily: cfg.fonts.caps || cfg.fonts.head, fontSize: 12.5, letterSpacing: '.3em', textTransform: 'uppercase', color: C.ACCENT }}>{kicker}</div>}
        {gate && cfg.subSlot && ot.show(cfg.subSlot) && <div style={{ marginTop: 6, fontStyle: 'italic', fontSize: 14.5, color: C.MUTE }}>{ot.text(cfg.subSlot)}</div>}
        <h1 style={{ margin: '8px 0 0', fontWeight: 400, color: C.INK, textShadow: light ? `0 1px 18px ${alpha(C.BG, 0.9)}` : `0 2px 24px ${alpha(C.BG, 0.75)}` }}>
          <Names cfg={cfg} C={C} inv={inv} first={first} second={second} single={single} size={cfg.nameSize(longest, true)} big />
        </h1>
        <div style={{ position: 'relative', marginTop: 10, minHeight: 22 }}>
          {gate && ot.show('meta') && <div style={{ position: 'absolute', left: 0, right: 0, fontStyle: 'italic', fontSize: 15, color: alpha(C.INK, 0.85), opacity: go ? 0 : 1, transition: 'opacity .8s' }}>{ot.text('meta')}</div>}
          {T.honour && <div style={{ fontStyle: 'italic', fontSize: 16.5, color: alpha(C.INK, 0.9), opacity: go ? 1 : 0, transition: t('opacity 1.6s 2.4s') }}>{T.honour}</div>}
        </div>
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 'max(8svh, 50px)', textAlign: left ? 'left' : 'center', padding: '0 24px', color: C.INK,
        opacity: go ? 1 : 0, translate: go ? '0 0' : '0 10px', transition: t('opacity 1.4s 2.6s, translate 1.4s 2.6s'),
      }}>
        <div style={{ fontFamily: cfg.fonts.caps || cfg.fonts.head, fontSize: cfg.dateSize || 15, letterSpacing: cfg.dateTrack || '.22em', textTransform: cfg.dateUpper ? 'uppercase' : undefined, color: C.ACCENT }}>{inv.fullDate}</div>
        <div style={{ marginTop: 6, fontStyle: 'italic', fontSize: 16, color: alpha(C.INK, 0.88) }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' — ')}</div>
        {!gate && (
          <div style={{ marginTop: 14, fontStyle: 'italic', fontSize: 13.5, color: C.MUTE }}>
            {T.scroll}
            <span aria-hidden="true" style={{ display: 'block', width: 1, height: 26, margin: left ? '8px 0 0' : '8px auto 0', background: `linear-gradient(${C.ACCENT}, transparent)`, transformOrigin: 'top', animation: 'lx-drip 2.6s ease-in-out infinite' }} />
          </div>
        )}
      </div>

      {gate && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: st.clip0 && o.kind !== 'split' && o.kind !== 'letterbox' ? 'max(3.5svh, 20px)' : 'max(7svh, 40px)', textAlign: 'center', opacity: go ? 0 : 1, transition: 'opacity .7s', pointerEvents: go ? 'none' : undefined }}>
          {ot.show('cta') && <span style={{ display: 'inline-flex', alignItems: 'center', minHeight: 50, padding: '0 32px', borderRadius: cfg.btnRadius ?? 999, border: `1px solid ${alpha(C.ACCENT, 0.75)}`, background: alpha(C.BG, 0.55), backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', fontFamily: cfg.fonts.caps || cfg.fonts.head, fontSize: 14.5, letterSpacing: '.12em', color: C.INK, animation: 'lx-pulse 2.8s ease-in-out infinite' }}>{ot.text('cta')}</span>}
          {ot.show('hint') && <div style={{ marginTop: 8, fontStyle: 'italic', fontSize: 13.5, color: C.MUTE }}>{ot.text('hint')}</div>}
        </div>
      )}
    </>
  )
}

function Opening({ cfg, inv, weddingData, T, C }) {
  const ms = cfg.opening.ms || 4600
  const reveal = cfg.opening.reveal || ms - 900
  const gate = useGate({ inv, ms, revealAt: reveal })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  return (
    <div {...gate.gateProps} data-lx style={{
      position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: C.BG, color: C.INK, fontFamily: cfg.fonts.body,
      animation: gate.opening ? `lx-out .9s ease ${(reveal + 100) / 1000}s forwards` : undefined,
    }}>
      <Frame cfg={cfg} inv={inv} weddingData={weddingData} T={T} C={C} kicker={inv.L('hero', 'kicker', inv.ot.text('kicker'))}
        first={titleOv === '' ? '' : first} second={titleOv === '' ? '' : second} go={gate.opening} gate />
    </div>
  )
}

/* Bölmə */
function Panel({ id, section, title, sub, children, cfg, C, alt = false, center, style }) {
  const c = center ?? cfg.align !== 'left'
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '78px 26px', background: alt ? C.BG2 : C.BG, color: C.INK, textAlign: c ? 'center' : undefined, ...style }}>
      <div style={{ maxWidth: 440, margin: '0 auto' }}>
        {title && <Title cfg={cfg} C={C}>{title}</Title>}
        {title && <Divider cfg={cfg} C={C} />}
        {sub && <Fx as="p" delay={0.15} style={{ margin: c ? '0 auto' : 0, maxWidth: '32ch', fontStyle: 'italic', fontSize: 17, color: C.MUTE }}>{sub}</Fx>}
        <div style={{ marginTop: sub ? 26 : 6 }}>{children}</div>
      </div>
    </section>
  )
}

const radiusOf = (shape) => (shape === 'arch' ? '999px 999px 0 0' : shape === 'circle' ? '50%' : 0)

const field = (C, left) => ({
  width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${alpha(C.INK, 0.35)}`, borderRadius: 0,
  padding: '12px 2px', fontSize: 18, color: C.INK, outline: 'none', textAlign: left ? 'left' : 'center',
})
const btn = (C, cfg) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '0 24px', borderRadius: cfg.btnRadius ?? 999,
  fontSize: 15.5, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.ACCENT : 'transparent', color: on ? (cfg.onAccent || C.BG) : C.INK, border: `1px solid ${on ? C.ACCENT : alpha(C.ACCENT, 0.55)}`,
}))
const suggest = (C) => ({ bg: C.BG2, border: `1px solid ${alpha(C.ACCENT, 0.35)}`, active: alpha(C.ACCENT, 0.14), text: C.INK, table: C.ACCENT, radius: 2 })

/* Masa kartı */
function SeatCard({ cfg, num, T, C }) {
  const kind = cfg.seat || 'card'
  const n = <div style={{ fontFamily: cfg.fonts.num || cfg.fonts.head, fontWeight: cfg.numWeight || 300, fontSize: tableSize(num, kind === 'circle' ? 58 : 66), lineHeight: 1 }}>{num}</div>
  const lab = <div style={{ marginTop: 8, fontFamily: cfg.fonts.caps || cfg.fonts.head, fontSize: 12.5, letterSpacing: '.28em', textTransform: 'uppercase', color: C.ACCENT }}>{T.table}</div>
  if (kind === 'circle') {
    return (
      <div style={{ display: 'grid', placeItems: 'center', width: 200, height: 200, margin: '0 auto', borderRadius: '50%', border: `1px solid ${alpha(C.ACCENT, 0.7)}`, boxShadow: `inset 0 0 0 6px ${alpha(C.BG2, 0)}, inset 0 0 0 7px ${alpha(C.ACCENT, 0.3)}`, background: C.BG2, animation: 'lx-pop 1s cubic-bezier(.2,.8,.2,1) both' }}>
        <div>{cfg.ornament && <div aria-hidden="true" style={{ color: C.ACCENT, fontSize: 16 }}>{cfg.ornament}</div>}{n}{lab}</div>
      </div>
    )
  }
  if (kind === 'ticket') {
    return (
      <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'stretch', maxWidth: 320, margin: '0 auto', background: C.BG2, border: `1px solid ${alpha(C.ACCENT, 0.45)}`, animation: 'lx-card 1s cubic-bezier(.2,.8,.2,1) both', textAlign: 'left' }}>
        <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 40%, rgba(255,240,210,.16) 50%, transparent 60%)', translate: '-120% 0', animation: 'lx-shine 2.2s .8s ease-in-out both' }} />
        <div style={{ flex: 1, padding: '22px 20px' }}>{lab}<div style={{ marginTop: 6 }}>{n}</div></div>
        <div aria-hidden="true" style={{ width: 70, borderLeft: `1px dashed ${alpha(C.ACCENT, 0.5)}`, display: 'grid', placeItems: 'center', color: C.ACCENT, fontSize: 20 }}>{cfg.ornament || '✦'}</div>
      </div>
    )
  }
  return (
    <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block', width: 240, padding: '30px 20px 28px', background: C.BG2, boxShadow: `0 26px 40px -26px ${alpha('#000', 0.55)}`, transformOrigin: '50% 100%', animation: 'lx-card 1.1s cubic-bezier(.2,.8,.2,1) both' }}>
      <span aria-hidden="true" style={{ position: 'absolute', inset: 7, border: `1px solid ${alpha(C.ACCENT, 0.5)}` }} />
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 40%, rgba(255,240,210,.16) 50%, transparent 60%)', translate: '-120% 0', animation: 'lx-shine 2.2s .9s ease-in-out both' }} />
      {cfg.ornament && <div aria-hidden="true" style={{ fontSize: 18, color: C.ACCENT }}>{cfg.ornament}</div>}
      <div style={{ marginTop: 4 }}>{n}</div>
      {lab}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function LuxeTemplate({ props, inv, C, T, cfg }) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const { theme, tr, L, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const P = resolvePhotos(cfg.photos, inv.images)
  const [veil] = useState(() => !inv.opened)
  const single = inv.heroTitle || (inv.isCouple ? '' : inv.single)
  const left = cfg.align === 'left'
  const head = cfg.fonts.head
  const body = cfg.fonts.body
  const detail = cfg.detail || 'full'

  return (
    <div data-lx data-vr lang={lang} data-enter={enterDirection(cfg.id)} style={{
      backgroundColor: C.BG, minHeight: '100vh', fontFamily: body, fontWeight: cfg.bodyWeight || 400, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.ACCENT, 0.3),
    }}>
      <style>{VIRAL_CSS + KEYFRAMES(C) + COUNTDOWN_CSS + OVERLAY_CSS}</style>
      {veil && <Opening cfg={cfg} inv={inv} weddingData={weddingData} T={T} C={C} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: alpha(C.BG, 0.6), border: `1px solid ${alpha(C.ACCENT, 0.45)}`, backdropFilter: 'blur(8px)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.ACCENT} idle={alpha(C.ACCENT, 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.BG, 0.84), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: C.INK, borderBottom: `1px solid ${alpha(C.ACCENT, 0.2)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: alpha(C.INK, 0.7), fontSize: 15, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: cfg.fonts.caps || head, fontSize: 12.5, letterSpacing: '.3em', textTransform: 'uppercase', color: C.ACCENT }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* ÖRTÜK — açılışın son kadrı */}
          <section data-section="hero" style={{ position: 'relative', marginTop: -52, height: '100svh', minHeight: 620, overflow: 'hidden', background: C.BG }}>
            <Frame cfg={cfg} inv={inv} weddingData={weddingData} T={T} C={C} kicker={L('hero', 'kicker', inv.ot.text('kicker'))}
              first={inv.isCouple ? inv.groom : ''} second={inv.isCouple ? inv.bride : ''} single={single} go instant={veil} />
          </section>

          {/* Dəvət */}
          <section data-section="invite" style={{ padding: '74px 28px 60px', textAlign: left ? 'left' : 'center', background: C.BG }}>
            <div style={{ maxWidth: 430, margin: '0 auto' }}>
              <Fx as="p" style={{ margin: 0, fontFamily: cfg.inviteFont || body, fontSize: 'clamp(19px, 5.6vw, 22px)', lineHeight: 1.7 }}>{tr.inv_join}</Fx>
              <Divider cfg={cfg} C={C} style={{ marginBottom: 0 }} />
              {inv.isCorp && weddingData.organizer?.trim() && <Fx delay={0.15} style={{ marginTop: 18, fontSize: 15, fontStyle: 'italic', color: C.MUTE }}>{tr.organizer_display}: {weddingData.organizer}</Fx>}
            </div>
          </section>

          {S.countdown && (
            <Panel section="countdown" cfg={cfg} C={C} alt title={L('countdown', 'title', cd.title)}>
              <Countdown kind={cfg.countdown} cd={cd} C={C} fonts={cfg.fonts} light={cfg.tone === 'light'} />
            </Panel>
          )}

          {/* Foto bloku */}
          {P.detail && (detail === 'full' ? (
            <div data-section="photo" style={{ position: 'relative', height: '88svh', minHeight: 520 }}>
              <Photo src={P.detail} alt="" focus={cfg.detailFocus || '50% 45%'} style={{ position: 'absolute', inset: 0 }}>
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${alpha(cfg.captionShade || C.BG, 0.78)}, transparent 42%)` }} />
                <Words text={T.line} step={0.08} style={{ position: 'absolute', left: 24, right: 24, bottom: 34, textAlign: left ? 'left' : 'center', fontFamily: cfg.lineFont || body, fontStyle: cfg.lineItalic === false ? undefined : 'italic', fontSize: 23, lineHeight: 1.4, color: cfg.captionInk || C.INK }} />
              </Photo>
            </div>
          ) : (
            <section data-section="photo" style={{ position: 'relative', padding: '64px 26px 70px', background: C.BG, textAlign: left ? 'left' : 'center' }}>
              <Rise style={{ position: 'relative', maxWidth: 400, margin: '0 auto', aspectRatio: '3 / 4.4', borderRadius: radiusOf(detail === 'arch' ? 'arch' : 'rect'), overflow: 'hidden', isolation: 'isolate' }}>
                <Photo src={P.detail} alt="" focus={cfg.detailFocus || '50% 50%'} style={{ position: 'absolute', inset: 0 }} />
                <span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', border: `1px solid ${alpha(C.ACCENT, 0.75)}`, boxShadow: `inset 0 0 0 6px ${alpha(C.BG, 0.5)}, inset 0 0 0 7px ${alpha(C.ACCENT, 0.4)}` }} />
              </Rise>
              <Words text={T.line} step={0.08} style={{ display: 'block', maxWidth: 360, margin: left ? '26px 0 0' : '26px auto 0', fontFamily: cfg.lineFont || body, fontStyle: 'italic', fontSize: 22, lineHeight: 1.45, color: C.INK }} />
            </section>
          ))}

          <StoryBlock inv={inv} templateId={cfg.id} weddingData={weddingData} lang={lang} />

          {/* PROQRAM */}
          {S.program && (cfg.program === 'list' ? (
            <section data-section="program" style={{ position: 'relative', background: C.BG2, color: C.INK }}>
              {P.program && (
                <div style={{ position: 'relative' }}>
                  <Photo src={P.program} alt="" focus="50% 50%" style={{ height: '66svh', minHeight: 420 }} />
                  <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 55%, ${C.BG2})` }} />
                </div>
              )}
              <div style={{ padding: P.program ? '0 26px 80px' : '80px 26px', textAlign: left ? 'left' : 'center' }}><div style={{ maxWidth: 440, margin: '0 auto' }}>
                <Title cfg={cfg} C={C}>{L('program', 'title', timeline.sectionLabel)}</Title>
                <Divider cfg={cfg} C={C} />
                <Stagger step={0.12}>
                  {timeline.events.map((ev, i) => (left ? (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '84px minmax(0, 1fr)', gap: 14, alignItems: 'baseline', padding: '16px 0', borderBottom: `1px solid ${alpha(C.ACCENT, 0.3)}` }}>
                      <div style={{ fontFamily: cfg.fonts.num || head, fontSize: 24, lineHeight: 1, color: C.ACCENT, fontVariantNumeric: 'lining-nums' }}>{ev.time}</div>
                      <div style={{ fontSize: 18.5 }}>{ev.label}</div>
                    </div>
                  ) : (
                    <div key={i} style={{ padding: '12px 0' }}>
                      {i > 0 && <span aria-hidden="true" style={{ display: 'block', width: 5, height: 5, margin: '0 auto 16px', borderRadius: '50%', background: C.ACCENT }} />}
                      <div style={{ fontFamily: cfg.fonts.num || head, fontSize: 22, letterSpacing: '.06em', color: C.ACCENT }}>{ev.time}</div>
                      <div style={{ marginTop: 4, fontSize: 19.5, lineHeight: 1.35 }}>{ev.label}</div>
                    </div>
                  )))}
                </Stagger>
              </div></div>
            </section>
          ) : (
            <section data-section="program" style={{ position: 'relative', paddingBottom: 80, background: C.BG }}>
              {P.program && <Photo src={P.program} alt="" focus="50% 50%" style={{ height: '64svh', minHeight: 400 }} />}
              <div style={{ position: 'relative', zIndex: 2, maxWidth: 420, margin: P.program ? '-96px auto 0' : '80px auto 0', marginInline: 'max(22px, calc(50% - 210px))', padding: '48px 26px 40px', background: C.BG2, textAlign: 'center', boxShadow: `0 30px 60px -32px ${alpha('#000', 0.6)}`, borderRadius: cfg.cardRadius || 0 }}>
                <span aria-hidden="true" style={{ position: 'absolute', inset: 8, border: `1px solid ${alpha(C.ACCENT, 0.45)}`, borderRadius: cfg.cardRadius ? cfg.cardRadius - 6 : 0 }} />
                <Title cfg={{ ...cfg, align: 'center' }} C={C}>{L('program', 'title', timeline.sectionLabel)}</Title>
                <Divider cfg={{ ...cfg, align: 'center' }} C={C} style={{ margin: '16px auto 6px' }} />
                <Stagger step={0.12}>
                  {timeline.events.map((ev, i) => (
                    <div key={i} style={{ padding: '14px 0', borderTop: i ? `1px solid ${alpha(C.ACCENT, 0.2)}` : 'none' }}>
                      <div style={{ fontFamily: cfg.fonts.caps || head, fontSize: 13.5, letterSpacing: '.24em', color: C.ACCENT }}>{ev.time}</div>
                      <div style={{ marginTop: 4, fontSize: 20, lineHeight: 1.35 }}>{ev.label}</div>
                    </div>
                  ))}
                </Stagger>
              </div>
            </section>
          ))}

          {S.venue && (
            <Panel section="venue" cfg={cfg} C={C} alt title={L('venue', 'title', tr.inv_location)}>
              <Rise style={{ position: 'relative', overflow: 'hidden', isolation: 'isolate', borderRadius: cfg.mapShape === 'arch' ? '999px 999px 0 0' : cfg.cardRadius || 0 }}>
                <MapSection
                  weddingData={weddingData} theme={theme} accent={C.ACCENT} height={cfg.mapShape === 'arch' ? 'clamp(280px, 78vw, 340px)' : 'clamp(240px, 66vw, 290px)'}
                  map={cfg.map}
                  frame={<MapPin C={C} />}
                  fallback={<div style={{ height: cfg.mapShape === 'arch' ? 'clamp(280px, 78vw, 340px)' : 'clamp(240px, 66vw, 290px)', position: 'relative', background: C.BG }}><MapPin C={C} /></div>}
                />
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', border: `1px solid ${alpha(C.ACCENT, 0.6)}` }} />
              </Rise>
              <Fx style={{ marginTop: 24, fontFamily: head, fontSize: 28, lineHeight: 1.2 }}>{weddingData.venueName || ''}</Fx>
              {weddingData.venueNote && <Fx delay={0.15} style={{ marginTop: 6, fontStyle: 'italic', fontSize: 17, color: C.MUTE }}>{weddingData.venueNote}</Fx>}
              <Fx delay={0.3}><VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C, cfg)} style={left ? { justifyContent: 'flex-start' } : undefined} /></Fx>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" cfg={cfg} C={C} title={L('dresscode', 'title', tr.inv_dresscode)}>
              <Fx>
                <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align={left ? 'left' : 'center'} />
              </Fx>
            </Panel>
          )}

          {S.seating && !seating.isEmpty && (
            <Panel section="seating" cfg={cfg} C={C} alt center title={L('seating', 'title', seatingL.title)} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId={`${cfg.id}-seat-list`} field={field(C)} suggest={suggest(C)} font={body} muted={C.MUTE} accent={C.ACCENT}
                nameStyle={{ fontFamily: cfg.names.font, fontSize: cfg.names.seatSize || 28, lineHeight: 1.2, fontStyle: cfg.names.italic ? 'italic' : undefined }}
                card={(num) => <SeatCard cfg={cfg} num={num} T={T} C={C} />} />
            </Panel>
          )}

          {S.gallery && (
            <Panel section="gallery" id="gallery-section" cfg={cfg} C={C} title={L('gallery', 'title', tr.inv_gallery)}>
              {gallery.demoPhotos.length > 0 && <FilmReel photos={gallery.demoPhotos} style={{ marginBottom: 28 }} />}
              <PhotoQr inv={inv} tr={tr} fg={cfg.tone === 'light' ? C.INK : C.BG} bg={cfg.tone === 'light' ? '#FFFFFF' : C.INK} frame={{ border: `1px solid ${alpha(C.ACCENT, 0.45)}` }}
                btn={btn(C, cfg)} muted={C.MUTE} desc={galleryDesc(props.adminOverrides, tr, lang, cfg.galleryKind || 'celebration')} />
            </Panel>
          )}

          {S.rsvp && (
            <Panel section="rsvp" cfg={cfg} C={C} alt title={L('rsvp', 'title', rsvpL.title)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTE, line: alpha(C.INK, 0.35), hair: alpha(C.ACCENT, 0.3), accent: C.ACCENT,
                font: body, display: head, displayItalic: !!cfg.headItalic, btnFont: body, radius: cfg.btnRadius ?? 999, btnSolid: true,
                doneMark: <div aria-hidden="true" style={{ margin: left ? '0 0 16px' : '0 auto 16px', fontSize: 24, color: C.ACCENT }}>{cfg.ornament || '✦'}</div>,
                marker: (a) => <span style={{ display: 'block', width: 13, height: 13, borderRadius: '50%', border: `1px solid ${a ? C.ACCENT : alpha(C.INK, 0.6)}`, background: a ? C.ACCENT : 'transparent', transition: 'background .3s' }} />,
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {S.guestbook && (
            <Panel section="guestbook" cfg={cfg} C={C} title={L('guestbook', 'title', gbookL.title)} center={false}>
              <GuestbookForm inv={inv} field={field(C, true)} btn={btn(C, cfg)} errorColor={cfg.tone === 'light' ? '#9A3B32' : '#F0A08F'} />
              <Stagger step={0.1} style={{ marginTop: 18 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '22px 0', borderTop: `1px solid ${alpha(C.ACCENT, 0.4)}` }}>
                      <blockquote style={{ margin: 0, fontSize: 19, lineHeight: 1.6 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, fontFamily: cfg.names.font, fontStyle: cfg.names.italic ? 'italic' : undefined, fontSize: cfg.names.signSize || 24, color: C.ACCENT }}>
                        {msg.name}{msg.date ? <span style={{ fontFamily: body, fontStyle: 'normal', fontSize: 13, color: C.MUTE }}> · {gbook.formatDate(msg.date)}</span> : null}
                      </figcaption>
                    </figure>
                  )
                })}
              </Stagger>
            </Panel>
          )}

          <End cfg={cfg} inv={inv} T={T} C={C} />
          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={head} />
        </motion.div>
      )}
    </div>
  )
}

function End({ cfg, inv, T, C }) {
  const [ref, seen] = useInView(0.3)
  const single = inv.heroTitle || (inv.isCouple ? '' : inv.single)
  const longest = single || [inv.groom, inv.bride].sort((a, b) => String(b || '').length - String(a || '').length)[0] || ''
  const P = resolvePhotos(cfg.photos, inv.images)
  const left = cfg.heroAlign === 'left'
  const light = cfg.tone === 'light'
  return (
    <section ref={ref} data-section="finale" style={{ position: 'relative', height: '100svh', minHeight: 620, overflow: 'hidden', background: C.BG }}>
      {P.finale && <img src={P.finale} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: cfg.finaleFocus || '50% 55%', scale: seen ? '1' : '1.16', transition: 'scale 9s cubic-bezier(.2,.6,.2,1)' }} />}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${alpha(C.BG, light ? 0.9 : 0.86)}, ${alpha(C.BG, 0.2)} 42%, ${alpha(C.BG, 0)} 60%, ${alpha(C.BG, 0.55)})` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: '11svh', textAlign: left ? 'left' : 'center', padding: '0 24px', color: C.INK }}>
        <Fx style={{ fontFamily: cfg.fonts.caps || cfg.fonts.head, fontSize: 12.5, letterSpacing: '.3em', textTransform: 'uppercase', color: C.ACCENT }}>{T.end}</Fx>
        <Fx delay={0.2} style={{ marginTop: 10 }}>
          <Names cfg={cfg} C={C} inv={inv} first={inv.isCouple ? inv.groom : ''} second={inv.isCouple ? inv.bride : ''} single={single} size={cfg.nameSize(longest)} />
        </Fx>
        <Fx delay={0.4} style={{ marginTop: 14, fontFamily: cfg.fonts.caps || cfg.fonts.head, fontSize: 14, letterSpacing: '.24em', textTransform: cfg.dateUpper ? 'uppercase' : undefined }}>{inv.fullDate}</Fx>
      </div>
    </section>
  )
}

function MapPin({ C }) {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -10, top: -10, width: 20, height: 20, borderRadius: '50%', background: C.BG, border: `5px solid ${C.ACCENT}`, boxShadow: `0 6px 16px ${alpha('#000', 0.45)}` }} />
    </span>
  )
}
