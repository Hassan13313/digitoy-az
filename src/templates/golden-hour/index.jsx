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
import { Words, Rise, Stagger, Photo, Roll, Dust } from '../_shared/viral'
import { VIRAL_CSS, useInView, coverSpot } from '../_shared/viralHooks'
import { resolvePhotos, isCustomPhoto } from '../templatePhotos'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { PaletteContext, resolvePalette, scaleFont } from '../_shared/palette'

/* ─────────────────────────────────────────────────────────────────────────────
   GOLDEN HOUR — lüks toy seriyası (2026-11)

   Konsept: Abşeronda, Mərdəkan bağında gün batanda açıq havada nikah.
   Köhnə əhəng daşı divarlar, zeytun və əncir ağacları, ağ-şaftalı güllü
   nikah tağı, süfrədə nar və əncir.
   Açılış örtüyün ÖZÜDÜR (Frame — açılışda və örtükdə eyni kadr):
     1. kadr axşamüstü kimi solğun, adlar səmada, «Dəvəti açın»
     2. toxunanda tağın arxasındakı günəş parlayır, işıq kadrı isidir,
        havada qızılı toz üzür, aşağıda tarix görünür
   Daxildə: mərkəzə düzlənmiş, isti; tağ formalı masa kartı və xəritə;
   gün batımında son kadr.
   Fotolar GPT Image ilə bu şablon üçün yaradılıb (public/img/wedding/viral/gh-*).
   Şriftlər: Mea Culpa (adlar) · Hahmlet (mətn, başlıq) — Ə var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('golden-hour')
const ID = 'golden-hour'
const SUN = [0.755, 0.473] /* gh-1 fotosunda günəşin yeri (0..1) */

/* Fotodakı nöqtə ekranda hara düşür (object-fit: cover) */
function useSpot(ref, fx, fy) {
  const [pt, setPt] = useState([fx, fy])
  useEffect(() => {
    const img = ref.current
    if (!img) return undefined
    const place = () => setPt(coverSpot(img, fx, fy))
    if (img.complete) place(); else img.addEventListener('load', place)
    addEventListener('resize', place)
    return () => { img.removeEventListener('load', place); removeEventListener('resize', place) }
  }, [ref, fx, fy])
  return pt
}

const LINKS = { primary: ['SUN'], secondary: ['PEACH'], accent: ['ROSE'], background: ['CREAM'], text: ['INK'] }

const KEYFRAMES = (C) => (`
@keyframes gh-bloom { from { opacity: 0; scale: .3 } to { opacity: 1; scale: 1 } }
@keyframes gh-breathe { 0%,100% { opacity: .85; scale: 1 } 50% { opacity: 1; scale: 1.06 } }
@keyframes gh-out { to { opacity: 0 } }
@keyframes gh-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(199,123,69,.3) } 60% { box-shadow: 0 0 0 14px rgba(199,123,69,0) } }
@keyframes gh-drip { 0% { scale: 1 0 } 50% { scale: 1 1 } 100% { scale: 1 1; opacity: 0 } }
@keyframes gh-rise { from { opacity: 0; translate: 0 18px } to { opacity: 1; translate: 0 0 } }
[data-gh] canvas, [data-gh] div[aria-hidden="true"], [data-gh] span[aria-hidden="true"] { pointer-events: none; }
[data-gh] ::placeholder { color: ${alpha(C.MUTE, 0.75)}; font-style: italic; }
[data-gh] input:focus-visible, [data-gh] textarea:focus-visible { border-color: ${C.SUN} !important; outline: none; }
[data-gh] button:focus-visible, [data-gh] a:focus-visible, [data-gh] [role="button"]:focus-visible { outline: 1px solid ${C.SUN}; outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) { [data-gh] *, [data-gh] { animation: none !important; transition: none !important; } }
`)

const OPEN_MS = 4400
const REVEAL_MS = 3500

/* ═══ ÇƏRÇİVƏ: açılış və örtük eyni kadrdır ═══ */
function Frame({ inv, weddingData, T, C, fonts, kicker, name, go, gate = false, instant = false }) {
  const { ot } = inv
  const P = resolvePhotos(PHOTOS, inv.images)
  /* günəş şablonun öz fotosundakı tağa bağlıdır — admin şəklində yoxdur */
  const sun = !!P.hero && !isCustomPhoto(inv.images, 'hero')
  const img = useRef(null)
  const [sx, sy] = useSpot(img, SUN[0], SUN[1])
  const t = (v) => (instant ? 'none' : v)
  return (
    <>
      {P.hero && <img ref={img} src={P.hero} alt="" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 50%',
        filter: go ? 'none' : 'saturate(.55) brightness(.82) contrast(.95)', scale: go ? '1' : '1.07',
        transition: t('filter 3s cubic-bezier(.3,0,.2,1), scale 7s cubic-bezier(.2,.6,.2,1)'),
      }} />}
      {/* günəş: tağın arxasında parlayır */}
      {sun && <div aria-hidden="true" style={{ position: 'absolute', left: `${sx * 100}%`, top: `${sy * 100}%`, width: '150vmax', height: '150vmax', margin: '-75vmax 0 0 -75vmax', mixBlendMode: 'screen',
        background: 'radial-gradient(circle, rgba(255,236,200,.95) 0, rgba(255,190,120,.55) 6%, rgba(255,160,90,.18) 22%, rgba(255,140,80,0) 45%)',
        opacity: go ? 1 : 0, animation: go && !instant ? 'gh-bloom 2.6s cubic-bezier(.2,.7,.2,1) .2s both, gh-breathe 6s ease-in-out 3s infinite' : (go ? 'gh-breathe 6s ease-in-out infinite' : undefined) }} />}
      {go && <Dust count={28} color="255,214,160" alpha={0.55} rise={0.15} />}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${alpha(C.CREAM, 0.82)} 0%, ${alpha(C.CREAM, 0.5)} 22%, ${alpha(C.CREAM, 0)} 40%, ${alpha(C.CREAM, 0)} 68%, ${alpha(C.INK, 0.6)} 100%)` }} />

      <div style={{ position: 'absolute', left: 0, right: 0, top: 'max(8svh, 50px)', textAlign: 'center', padding: '0 20px' }}>
        {kicker && <div style={{ fontSize: 15, fontWeight: 300, letterSpacing: '.04em', color: C.INK }}>{kicker}</div>}
        <h1 style={{ margin: '4px 0 0', fontFamily: fonts.script, fontWeight: 400, fontSize: nameSize(name, true), lineHeight: 1.1, color: C.INK }}>{name}</h1>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 'max(7svh, 40px)', textAlign: 'center', padding: '0 20px', color: '#FFF6EC' }}>
        <div style={{ opacity: go ? 1 : 0, translate: go ? '0 0' : '0 10px', transition: t('opacity 1.4s 1.6s, translate 1.4s 1.6s') }}>
          <div style={{ fontSize: 19, fontWeight: 300 }}>{inv.fullDate}</div>
          <div style={{ marginTop: 2, fontSize: 15, opacity: 0.85 }}>{[inv.time, weddingData.venueName].filter(Boolean).join(', ')}</div>
          {!gate && (
            <div style={{ marginTop: 14, fontSize: 13, opacity: 0.8 }}>
              {T.scroll}
              <span aria-hidden="true" style={{ display: 'block', width: 1, height: 24, margin: '8px auto 0', background: 'currentColor', transformOrigin: 'top', animation: 'gh-drip 2.6s ease-in-out infinite' }} />
            </div>
          )}
        </div>
        {gate && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, opacity: go ? 0 : 1, transition: 'opacity .7s', pointerEvents: go ? 'none' : undefined }}>
            {ot.show('cta') && <span style={{ display: 'inline-flex', alignItems: 'center', minHeight: 52, padding: '0 32px', borderRadius: 999, background: alpha(C.CREAM, 0.88), color: C.INK, fontSize: 16, animation: 'gh-pulse 2.6s ease-in-out infinite' }}>{ot.text('cta')}</span>}
            {ot.show('hint') && <div style={{ marginTop: 10, fontSize: 13 }}>{ot.text('hint')}</div>}
          </div>
        )}
      </div>
    </>
  )
}

function SunOpening({ inv, weddingData, T, C, fonts }) {
  const gate = useGate({ inv, ms: OPEN_MS, revealAt: REVEAL_MS })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const name = titleOv === '' ? '' : [first, second].filter(Boolean).join(` ${inv.ot.text('and') || inv.and} `)
  return (
    <div {...gate.gateProps} data-gh style={{
      position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: C.PEACH, color: C.INK, fontFamily: fonts.body,
      animation: gate.opening ? `gh-out .9s ease ${(REVEAL_MS + 100) / 1000}s forwards` : undefined,
    }}>
      <Frame inv={inv} weddingData={weddingData} T={T} C={C} fonts={fonts} kicker={inv.L('hero', 'kicker', inv.ot.text('kicker'))} name={name} go={gate.opening} gate />
    </div>
  )
}

function Panel({ id, section, title, sub, children, head, C, tone = 'cream', center = true }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '74px 26px', background: tone === 'peach' ? C.PEACH : C.CREAM, color: C.INK, textAlign: center ? 'center' : undefined }}>
      <div style={{ maxWidth: 440, margin: '0 auto' }}>
        {title && <Words as="h2" text={title} style={{ margin: 0, fontFamily: head, fontWeight: 300, fontSize: scaleFont('clamp(30px, 8.8vw, 38px)', C.hs), lineHeight: 1.12 }} />}
        {sub && <Rise delay={0.2} as="p" style={{ margin: center ? '12px auto 0' : '12px 0 0', maxWidth: '32ch', fontSize: 16, color: C.MUTE }}>{sub}</Rise>}
        <div style={{ marginTop: title || sub ? 28 : 0 }}>{children}</div>
      </div>
    </section>
  )
}

/* Sayğac: üfüqdə batan günəş */
function Sunset({ days, label, C, head }) {
  const [ref, seen] = useInView(0.3)
  return (
    <div ref={ref} style={{ position: 'relative', height: 230, margin: '0 auto', maxWidth: 320, overflow: 'hidden' }}>
      <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 40, width: 260, height: 260, marginLeft: -130, borderRadius: '50%', background: `radial-gradient(circle at 50% 40%, #FFE3C0, ${C.SUN} 70%)`, opacity: 0.9, translate: seen ? '0 0' : '0 -60px', transition: 'translate 3.2s cubic-bezier(.2,.7,.2,1)' }} />
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 170, bottom: 0, background: C.CREAM, borderTop: `1px solid ${alpha(C.INK, 0.25)}` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 62, textAlign: 'center', color: '#FFF8F0' }}>
        <div style={{ fontFamily: head, fontWeight: 200, fontSize: 84, lineHeight: 1 }}><Roll value={days} /></div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 184, textAlign: 'center', fontSize: 16, color: C.MUTE }}>{label}</div>
    </div>
  )
}

const field = (C) => ({
  width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${alpha(C.INK, 0.3)}`, borderRadius: 0,
  padding: '12px 2px', fontSize: 18, fontWeight: 300, color: C.INK, outline: 'none',
})
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '0 24px', borderRadius: 999,
  fontSize: 15.5, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.SUN : 'transparent', color: on ? '#FFF8F0' : C.INK, border: `1px solid ${on ? C.SUN : alpha(C.INK, 0.35)}`,
}))
const suggest = (C) => ({ bg: '#FFFFFF', border: `1px solid ${alpha(C.SUN, 0.3)}`, active: alpha(C.PEACH, 0.6), text: C.INK, table: C.SUN, radius: 12 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function GoldenHourTemplate(props) {
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
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)

  return (
    <PaletteContext.Provider value={C}><div data-gh data-vr lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.CREAM, minHeight: '100vh', fontFamily: body, fontWeight: 300, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.SUN, 0.3),
    }}>
      <style>{VIRAL_CSS + KEYFRAMES(C)}</style>
      {veil && <SunOpening inv={inv} weddingData={weddingData} T={T} C={C} fonts={fonts} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: alpha(C.CREAM, 0.8), border: `1px solid ${alpha(C.SUN, 0.35)}`, backdropFilter: 'blur(8px)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.SUN} idle={alpha(C.SUN, 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.CREAM, 0.85), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: C.INK,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTE, fontSize: 14, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: fonts.script, fontSize: 26, lineHeight: 1, color: C.SUN }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          <section data-section="hero" style={{ position: 'relative', marginTop: -52, height: '100svh', minHeight: 600, overflow: 'hidden', background: C.PEACH }}>
            <Frame inv={inv} weddingData={weddingData} T={T} C={C} fonts={fonts} kicker={L('hero', 'kicker', inv.ot.text('kicker'))} name={heroName} go instant={veil} />
          </section>

          <section data-section="invite" style={{ padding: '72px 28px 60px', textAlign: 'center', background: C.CREAM }}>
            <Words as="p" text={tr.inv_join} step={0.04} style={{ margin: '0 auto', maxWidth: '27ch', fontFamily: head, fontWeight: 200, fontSize: 'clamp(20px, 5.8vw, 23px)', lineHeight: 1.65 }} />
            {inv.isCorp && weddingData.organizer?.trim() && <Rise style={{ marginTop: 12, fontSize: 15, color: C.MUTE }}>{tr.organizer_display}: {weddingData.organizer}</Rise>}
          </section>

          {S.countdown && (
            <Panel section="countdown" head={head} C={C} tone="peach" title={L('countdown', 'title', cd.title)}>
              <Sunset days={cd.days} label={T.left} C={C} head={head} />
              <Rise delay={0.2} style={{ display: 'flex', justifyContent: 'center', gap: 30, marginTop: 18, fontVariantNumeric: 'tabular-nums' }}>
                {[['hours', cd.hours], ['minutes', cd.minutes], ['seconds', cd.seconds]].map(([k, v]) => (
                  <div key={k}><b style={{ display: 'block', fontFamily: head, fontWeight: 300, fontSize: 26 }}>{String(v).padStart(2, '0')}</b><span style={{ fontSize: 13, color: C.MUTE }}>{cd.labels[k]}</span></div>
                ))}
              </Rise>
            </Panel>
          )}

          {/* Buket */}
          {P.bouquet && (<div data-section="photo" style={{ position: 'relative', height: '84svh', minHeight: 500 }}>
            <Photo src={P.bouquet} alt="" focus="55% 35%" style={{ position: 'absolute', inset: 0 }}>
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(58,42,34,.6), transparent 45%)' }} />
              <Words text={T.bouquet} step={0.1} style={{ position: 'absolute', left: 24, right: 24, bottom: 34, textAlign: 'center', fontFamily: fonts.script, fontSize: 'clamp(40px, 12vw, 56px)', lineHeight: 1.1, color: '#FFF6EC' }} />
            </Photo>
          </div>)}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {S.program && (
            <Panel section="program" head={head} C={C} title={L('program', 'title', timeline.sectionLabel)}>
              <div style={{ position: 'relative' }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: `linear-gradient(${alpha(C.SUN, 0)}, ${alpha(C.SUN, 0.6)} 10%, ${alpha(C.SUN, 0.6)} 90%, ${alpha(C.SUN, 0)})` }} />
                <Stagger step={0.12}>
                  {timeline.events.map((ev, i) => (
                    <div key={i} style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'baseline', padding: '14px 0' }}>
                      <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 22, width: 9, height: 9, marginLeft: -4.5, borderRadius: '50%', background: C.SUN, boxShadow: `0 0 0 4px ${C.CREAM}` }} />
                      <div style={{ textAlign: 'right', fontFamily: head, fontWeight: 300, fontSize: 22, color: C.SUN, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                      <div style={{ textAlign: 'left', fontSize: 17.5, lineHeight: 1.35 }}>{ev.label}</div>
                    </div>
                  ))}
                </Stagger>
              </div>
            </Panel>
          )}

          {/* Zeytun ağacları altında süfrə */}
          {P.table && (<div data-section="photo" style={{ position: 'relative', height: '78svh', minHeight: 460 }}>
            <Photo src={P.table} alt="" focus="50% 55%" style={{ position: 'absolute', inset: 0 }} />
          </div>)}

          {S.venue && (
            <Panel section="venue" head={head} C={C} title={L('venue', 'title', tr.inv_location)}>
              <Rise style={{ overflow: 'hidden', isolation: 'isolate', borderRadius: '170px 170px 6px 6px' }}>
                <MapSection
                  weddingData={weddingData} theme={theme} accent={C.SUN} height="clamp(290px, 82vw, 350px)"
                  map={{ opacity: 0.9, filter: 'sepia(.35) saturate(.9) brightness(1.04)', tintOpacity: 0.12, tint: C.SUN, blend: 'multiply' }}
                  frame={<MapPin C={C} />}
                  fallback={<div style={{ height: 'clamp(290px, 82vw, 350px)', position: 'relative', background: C.PEACH }}><MapPin C={C} /></div>}
                />
              </Rise>
              <Words text={weddingData.venueName || ''} step={0.1} style={{ marginTop: 24, fontFamily: head, fontWeight: 300, fontSize: 30, lineHeight: 1.15 }} />
              {weddingData.venueNote && <Rise delay={0.2} style={{ marginTop: 6, fontSize: 16, color: C.MUTE }}>{weddingData.venueNote}</Rise>}
              <Rise delay={0.3}><VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} /></Rise>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} C={C} tone="peach" title={L('dresscode', 'title', tr.inv_dresscode)}>
              <Rise>
                <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" />
              </Rise>
            </Panel>
          )}

          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} C={C} title={L('seating', 'title', seatingL.title)} sub={seatingL.sub}>
              <div style={{ textAlign: 'left' }}>
                <SeatFinder inv={inv} tr={tr} listId="gh-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={C.MUTE} accent={C.SUN}
                  nameStyle={{ fontFamily: fonts.script, fontSize: 34, lineHeight: 1.1 }}
                  card={(num) => (
                    /* tağ formalı masa kartı — nikah tağı kimi */
                    <div style={{ display: 'inline-block', minWidth: 200, padding: '40px 22px 22px', borderRadius: '120px 120px 6px 6px', background: `linear-gradient(180deg, ${C.PEACH}, #FFFFFF)`, border: `1px solid ${alpha(C.SUN, 0.35)}`, animation: 'gh-rise .9s cubic-bezier(.2,.8,.2,1) both' }}>
                      <div style={{ fontFamily: head, fontWeight: 200, fontSize: tableSize(num, 72), lineHeight: 1, color: C.SUN }}>{num}</div>
                      <div style={{ marginTop: 6, fontSize: 14, color: C.MUTE }}>{T.table}</div>
                    </div>
                  )} />
              </div>
            </Panel>
          )}

          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} C={C} tone="peach" title={L('gallery', 'title', tr.inv_gallery)}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, marginBottom: 28 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <Rise key={i} delay={(i % 2) * 0.12} style={{ aspectRatio: '3 / 4', overflow: 'hidden', borderRadius: i % 3 === 0 ? '90px 90px 6px 6px' : 6, background: C.CREAM, marginTop: i % 2 ? 26 : 0 }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} className="vr-kb" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </Rise>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.INK} bg="#FFFFFF" frame={{ border: `1px solid ${alpha(C.SUN, 0.3)}`, borderRadius: 12 }}
                btn={btn(C)} muted={C.MUTE} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {S.rsvp && (
            <Panel section="rsvp" head={head} C={C} title={L('rsvp', 'title', rsvpL.title)} sub={rsvpL.subtitle} center={false}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTE, line: alpha(C.INK, 0.3), hair: alpha(C.SUN, 0.25), accent: C.SUN,
                font: body, display: head, displayItalic: false, btnFont: body, radius: 999, btnSolid: true,
                doneMark: <div aria-hidden="true" style={{ width: 54, height: 54, margin: '0 auto 16px', borderRadius: '50%', background: `radial-gradient(circle at 50% 40%, #FFE3C0, ${C.SUN})` }} />,
                marker: (a) => <span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', background: a ? C.SUN : 'transparent', border: a ? 'none' : `1px solid ${alpha(C.INK, 0.4)}`, transition: 'background .3s' }} />,
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {S.guestbook && (
            <Panel section="guestbook" head={head} C={C} tone="peach" title={L('guestbook', 'title', gbookL.title)} center={false}>
              <GuestbookForm inv={inv} field={field(C)} btn={btn(C)} errorColor="#A04A43" />
              <Stagger step={0.1} style={{ marginTop: 10 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: '14px 0 0', padding: '18px 20px', background: alpha('#FFFFFF', 0.7), borderRadius: 14 }}>
                      <blockquote style={{ margin: 0, fontFamily: head, fontWeight: 300, fontSize: 18, lineHeight: 1.55 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 6, fontFamily: fonts.script, fontSize: 30, lineHeight: 1.1, color: C.SUN }}>
                        {msg.name}{msg.date ? <span style={{ fontFamily: body, fontSize: 13, color: C.MUTE }}> · {gbook.formatDate(msg.date)}</span> : null}
                      </figcaption>
                    </figure>
                  )
                })}
              </Stagger>
            </Panel>
          )}

          <End inv={inv} T={T} C={C} fonts={fonts} name={heroName} />
          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={head} />
        </motion.div>
      )}
    </div></PaletteContext.Provider>
  )
}

function End({ inv, T, C, fonts, name }) {
  const [ref, seen] = useInView(0.3)
  const P = resolvePhotos(PHOTOS, inv.images)
  return (
    <section ref={ref} data-section="finale" style={{ position: 'relative', height: '100svh', minHeight: 600, overflow: 'hidden', textAlign: 'center', color: C.INK }}>
      {P.finale && <Photo src={P.finale} par={0} wipe={false} focus="45% 50%" style={{ position: 'absolute', inset: 0 }} />}
      <Dust count={24} color="255,220,170" alpha={0.5} rise={0.15} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: '11svh', padding: '0 20px' }}>
        <div style={{ fontSize: 16, opacity: seen ? 1 : 0, transition: 'opacity 1.2s .2s' }}>{T.end}</div>
        <div style={{ marginTop: 4, fontFamily: fonts.script, fontSize: nameSize(name), lineHeight: 1.1, opacity: seen ? 1 : 0, translate: seen ? '0 0' : '0 12px', transition: 'opacity 1.4s .5s, translate 1.4s .5s' }}>{name}</div>
        <div style={{ marginTop: 8, fontSize: 16, opacity: seen ? 0.85 : 0, transition: 'opacity 1.2s 1s' }}>{inv.fullDate}</div>
      </div>
    </section>
  )
}

function MapPin({ C }) {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -14, top: -14, width: 28, height: 28, borderRadius: '50%', background: '#FFFFFF', border: `6px solid ${C.SUN}`, boxShadow: '0 6px 16px rgba(58,42,34,.3)' }} />
    </span>
  )
}
