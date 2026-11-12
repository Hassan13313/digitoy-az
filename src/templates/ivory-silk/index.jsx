import { motion } from 'framer-motion'
import { useState } from 'react'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../_shared/MapSection'
import { enterDirection } from '../_shared/motion'
import { hidePhoto } from '../../utils/photoGallery'
import { getTemplateTheme, FONT_STACKS } from '../templateConfig'
import { useInvitation, useGate, openingNames, alpha } from '../_shared/useInvitation'
import { MusicFab, EqBars, StoryBlock, InvitationEnd, ReplyForm } from '../_shared/invitationKit'
import { VenueLinks, SeatFinder, PhotoQr, GuestbookForm } from '../_shared/blocks'
import { galleryDesc, tableSize } from '../_shared/kids'
import { Words, Rise, Stagger, Photo, Roll } from '../_shared/viral'
import { VIRAL_CSS, useInView } from '../_shared/viralHooks'
import { resolvePhotos } from '../templatePhotos'
import { PHOTOS } from './photos'
import { C as PAL, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { PaletteContext, resolvePalette, scaleFont } from '../_shared/palette'

/* ─────────────────────────────────────────────────────────────────────────────
   IVORY SILK — lüks toy seriyası (2026-11)

   Konsept: gündüz toyu, «köhnə pul» sakitliyi. Fil sümüyü ipək, tünd yaşıl
   məxmər qutuda iki qızıl üzük, mirvari, ağ güllər.
   Açılış örtüyün ÖZÜDÜR (Frame komponenti həm açılışda, həm örtükdə eynidir):
     1. adlar ipəyin boş yuxarı hissəsində, aşağıda «Dəvəti açın»
     2. toxunanda atlasın üzərindən işıq sürüşür, kamera azca geri çəkilir,
        aşağıda kağız zolağında tarix və məkan görünür
     3. açılış söner — altındakı örtük eyni kadrdır
   Daxildə: dəftərxana üslubu, mərkəzə düzlənmiş; bulanıqdan aydınlaşan mətn;
   masa fotosunun üstündə menyu kartı kimi proqram; qalxan yer kartı.
   Fotolar GPT Image ilə bu şablon üçün yaradılıb (public/img/wedding/viral/ivory-*).
   Şriftlər: Petit Formal Script (adlar) · Trirong (mətn) · Aboreto (tarix) — Ə var.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('ivory-silk')
const ID = 'ivory-silk'
const CAPS = FONT_STACKS.aboreto

const LINKS = { primary: ['INK'], secondary: ['PAPER'], accent: ['GOLD'], background: ['SILK'], text: ['INK'] }

const KEYFRAMES = (C) => (`
@keyframes iv-breathe { from { scale: 1.08 } to { scale: 1.11 } }
@keyframes iv-sweep { from { translate: -70% 0 } to { translate: 70% 0 } }
@keyframes iv-out { to { opacity: 0 } }
@keyframes iv-drip { 0% { scale: 1 0 } 50% { scale: 1 1 } 100% { scale: 1 1; opacity: 0 } }
@keyframes iv-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(31,51,39,.18) } 60% { box-shadow: 0 0 0 12px rgba(31,51,39,0) } }
@keyframes iv-lift { from { opacity: 0; transform: perspective(600px) rotateX(70deg) } to { opacity: 1; transform: none } }
[data-iv] .iv-fx { opacity: 0; filter: blur(6px); transition: opacity 1.4s cubic-bezier(.2,.7,.2,1), filter 1.4s; }
[data-iv] .iv-fx.on { opacity: 1; filter: none; }
[data-iv] canvas, [data-iv] div[aria-hidden="true"], [data-iv] span[aria-hidden="true"] { pointer-events: none; }
[data-iv] ::placeholder { color: ${alpha(C.MUTE, 0.7)}; font-style: italic; }
[data-iv] input:focus-visible, [data-iv] textarea:focus-visible { border-color: ${C.GOLD} !important; outline: none; }
[data-iv] button:focus-visible, [data-iv] a:focus-visible, [data-iv] [role="button"]:focus-visible { outline: 1px solid ${C.GOLD}; outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) { [data-iv] *, [data-iv] { animation: none !important; transition: none !important; } [data-iv] .iv-fx { opacity: 1; filter: none; } }
`)

const OPEN_MS = 4200
const REVEAL_MS = 3300
const ph = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 60%', display: 'block' }

/* Mətn görünəndə bulanıqdan aydınlaşır (sürüşmə yox) */
function Fx({ as: Tag = 'div', delay = 0, style, children }) {
  const [ref, seen] = useInView(0.18)
  return <Tag ref={ref} className={`iv-fx${seen ? ' on' : ''}`} style={{ transitionDelay: `${delay}s`, ...style }}>{children}</Tag>
}

/* Qızılı xətt: ortadan açılır */
function Rule({ C, style }) {
  const [ref, seen] = useInView(0.3)
  return <div ref={ref} aria-hidden="true" style={{ width: 56, height: 1, margin: '26px auto', background: C.GOLD, scale: seen ? '1 1' : '0 1', transition: 'scale 1.4s cubic-bezier(.2,.7,.2,1)', ...style }} />
}

/* Adlar: «Aysel / və / Nicat» */
function Names({ first, second, and, single, C, script, size }) {
  if (!first && !second && !single) return null
  return (
    <div style={{ fontFamily: script, fontSize: size, lineHeight: 1.18, color: C.INK }}>
      {single || (
        <>
          {first}
          {second && <span style={{ display: 'block', fontFamily: BASE.fonts.body, fontStyle: 'italic', fontWeight: 200, fontSize: 22, lineHeight: 1.4, color: C.GOLD }}>{and}</span>}
          {second}
        </>
      )}
    </div>
  )
}

/* ═══ ÇƏRÇİVƏ: açılış və örtük eyni kadrdır ═══ */
function Frame({ inv, weddingData, T, C, fonts, kicker, first, second, single, go, gate = false, instant = false }) {
  const { ot } = inv
  const P = resolvePhotos(PHOTOS, inv.images)
  const t = (v) => (instant ? 'none' : v)
  const longest = single || [first, second].sort((a, b) => String(b || '').length - String(a || '').length)[0] || ''
  return (
    <>
      {P.hero && <img src={P.hero} alt="" style={{ ...ph, scale: go ? '1' : '1.08', transition: t('scale 6s cubic-bezier(.2,.6,.2,1)'), animation: gate && !go ? 'iv-breathe 9s ease-in-out infinite alternate' : undefined }} />}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${alpha(C.SILK, 0.8)} 0%, ${alpha(C.SILK, 0.35)} 30%, ${alpha(C.SILK, 0)} 46%)` }} />
      {go && !instant && <div aria-hidden="true" style={{ position: 'absolute', inset: '-20% -60%', mixBlendMode: 'soft-light', background: 'linear-gradient(105deg, transparent 42%, rgba(255,250,238,.6) 50%, transparent 58%)', translate: '-70% 0', animation: 'iv-sweep 3.2s cubic-bezier(.45,0,.2,1) .15s both' }} />}

      <div style={{ position: 'absolute', left: 0, right: 0, top: 'max(9svh, 54px)', textAlign: 'center', padding: '0 22px' }}>
        {kicker && <div style={{ fontStyle: 'italic', fontWeight: 200, fontSize: 17, color: C.MUTE }}>{kicker}</div>}
        <h1 style={{ margin: '10px 0 0', fontWeight: 400 }}>
          <Names first={first} second={second} and={inv.and} single={single} C={C} script={fonts.script} size={nameSize(longest, true)} />
        </h1>
      </div>

      {/* kağız zolağı: tarix və məkan */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, padding: '120px 22px max(9svh, 56px)', textAlign: 'center',
        background: `linear-gradient(0deg, ${alpha(C.SILK, 0.94)} 30%, ${alpha(C.SILK, 0)})`,
        opacity: go ? 1 : 0, transition: t('opacity 1.6s 1s'),
      }}>
        <div style={{ fontFamily: CAPS, fontSize: 12.5, letterSpacing: '.32em', color: C.INK }}>{inv.fullDate}</div>
        <div style={{ marginTop: 6, fontStyle: 'italic', fontSize: 16, color: C.MUTE }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' — ')}</div>
        {!gate && (
          <div style={{ marginTop: 16, fontStyle: 'italic', fontSize: 13.5, color: C.MUTE }}>
            {T.scroll}
            <span aria-hidden="true" style={{ display: 'block', width: 1, height: 28, margin: '8px auto 0', background: `linear-gradient(${C.GOLD}, transparent)`, transformOrigin: 'top', animation: 'iv-drip 2.6s ease-in-out infinite' }} />
          </div>
        )}
      </div>

      {gate && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 'max(7svh, 40px)', textAlign: 'center', opacity: go ? 0 : 1, translate: go ? '0 8px' : '0 0', transition: 'opacity .7s, translate .7s', pointerEvents: go ? 'none' : undefined }}>
          {ot.show('cta') && <span style={{ display: 'inline-flex', alignItems: 'center', minHeight: 52, padding: '0 34px', borderRadius: 999, border: `1px solid ${alpha(C.INK, 0.4)}`, background: alpha(C.PAPER, 0.6), backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', fontSize: 16, color: C.INK, animation: 'iv-pulse 2.8s ease-in-out infinite' }}>{ot.text('cta')}</span>}
          {ot.show('hint') && <div style={{ marginTop: 12, fontStyle: 'italic', fontSize: 13, color: C.MUTE }}>{ot.text('hint')}</div>}
        </div>
      )}
    </>
  )
}

function SilkOpening({ inv, weddingData, T, C, fonts }) {
  const gate = useGate({ inv, ms: OPEN_MS, revealAt: REVEAL_MS })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const kicker = inv.L('hero', 'kicker', inv.ot.text('kicker'))
  return (
    <div {...gate.gateProps} data-iv style={{
      position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: C.SILK, color: C.INK, fontFamily: fonts.body,
      animation: gate.opening ? `iv-out .9s ease ${(REVEAL_MS + 100) / 1000}s forwards` : undefined,
    }}>
      <Frame inv={inv} weddingData={weddingData} T={T} C={C} fonts={fonts} kicker={kicker}
        first={titleOv === '' ? '' : first} second={titleOv === '' ? '' : second} go={gate.opening} gate />
    </div>
  )
}

/* Bölmə */
function Panel({ id, section, title, sub, children, head, C, tone = 'silk', center = true, style }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '76px 28px', background: tone === 'paper' ? C.PAPER : C.SILK, color: C.INK, textAlign: center ? 'center' : undefined, ...style }}>
      <div style={{ maxWidth: 430, margin: '0 auto' }}>
        {title && <Fx as="h2" style={{ margin: 0, fontFamily: head, fontWeight: 200, fontSize: scaleFont('clamp(30px, 8.6vw, 38px)', C.hs), lineHeight: 1.12 }}>{title}</Fx>}
        {title && <Rule C={C} style={{ margin: '22px auto 0' }} />}
        {sub && <Fx as="p" delay={0.15} style={{ margin: '16px auto 0', maxWidth: '32ch', fontStyle: 'italic', fontSize: 16, color: C.MUTE }}>{sub}</Fx>}
        <div style={{ marginTop: title || sub ? 28 : 0 }}>{children}</div>
      </div>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${alpha(C.INK, 0.35)}`, borderRadius: 0,
  padding: '12px 2px', fontSize: 18, fontWeight: 300, color: C.INK, outline: 'none', textAlign: 'center',
})
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '0 24px', borderRadius: 999,
  fontSize: 15.5, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.INK : 'transparent', color: on ? C.PAPER : C.INK, border: `1px solid ${on ? C.INK : alpha(C.INK, 0.35)}`,
}))
const suggest = (C) => ({ bg: C.PAPER, border: `1px solid ${alpha(C.GOLD, 0.35)}`, active: alpha(C.GOLD, 0.12), text: C.INK, table: C.GOLD, radius: 4 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function IvorySilkTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const fonts = { head, body, script: theme.fonts.script || BASE.fonts.script }
  const T = inv.copy(TXT)
  const [veil] = useState(() => !inv.opened)
  const single = inv.heroTitle || (inv.isCouple ? '' : inv.single)
  const kicker = L('hero', 'kicker', inv.ot.text('kicker'))
  const P = resolvePhotos(PHOTOS, inv.images)

  return (
    <PaletteContext.Provider value={C}><div data-iv data-vr lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.SILK, minHeight: '100vh', fontFamily: body, fontWeight: 300, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.GOLD, 0.25),
    }}>
      <style>{VIRAL_CSS + KEYFRAMES(C)}</style>
      {veil && <SilkOpening inv={inv} weddingData={weddingData} T={T} C={C} fonts={fonts} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: alpha(C.PAPER, 0.75), border: `1px solid ${alpha(C.INK, 0.18)}`, backdropFilter: 'blur(8px)' }}>
        {({ playing }) => <EqBars playing={playing} color={C.GOLD} idle={alpha(C.GOLD, 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.PAPER, 0.86), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', color: C.INK, borderBottom: `1px solid ${alpha(C.GOLD, 0.2)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTE, fontSize: 14, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: CAPS, fontSize: 12, letterSpacing: '.28em', color: C.INK }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* ÖRTÜK — açılışın son kadrı */}
          <section data-section="hero" style={{ position: 'relative', marginTop: -52, height: '100svh', minHeight: 600, overflow: 'hidden', background: C.SILK }}>
            <Frame inv={inv} weddingData={weddingData} T={T} C={C} fonts={fonts} kicker={kicker}
              first={inv.isCouple ? inv.groom : ''} second={inv.isCouple ? inv.bride : ''} single={single} go instant={veil} />
          </section>

          {/* Dəvət */}
          <section data-section="invite" style={{ padding: '72px 28px 64px', textAlign: 'center', background: C.SILK }}>
            <div style={{ maxWidth: 430, margin: '0 auto' }}>
              <Fx as="p" style={{ margin: 0, fontWeight: 200, fontSize: 'clamp(19px, 5.6vw, 22px)', lineHeight: 1.7 }}>{tr.inv_join}</Fx>
              <Rule C={C} />
              {inv.isCorp && weddingData.organizer?.trim() && <Fx delay={0.15} style={{ fontSize: 15, fontStyle: 'italic', color: C.MUTE }}>{tr.organizer_display}: {weddingData.organizer}</Fx>}
            </div>
          </section>

          {S.countdown && (
            <Panel section="countdown" head={head} C={C} tone="paper" title={L('countdown', 'title', cd.title)}>
              <Fx delay={0.1}>
                <div style={{ fontWeight: 200, fontSize: 'clamp(104px, 33vw, 148px)', lineHeight: 0.9, letterSpacing: '-.04em' }}><Roll value={cd.days} /></div>
                <div style={{ marginTop: 6, fontStyle: 'italic', fontSize: 18, color: C.GOLD }}>{T.left}</div>
              </Fx>
              <Fx delay={0.3} style={{ display: 'flex', justifyContent: 'center', gap: 34, marginTop: 30, fontVariantNumeric: 'tabular-nums lining-nums' }}>
                {[['hours', cd.hours], ['minutes', cd.minutes], ['seconds', cd.seconds]].map(([k, v]) => (
                  <div key={k}><b style={{ display: 'block', fontWeight: 300, fontSize: 26 }}>{String(v).padStart(2, '0')}</b><span style={{ fontSize: 13, fontStyle: 'italic', color: C.MUTE }}>{cd.labels[k]}</span></div>
                ))}
              </Fx>
              <Fx delay={0.45} style={{ marginTop: 34, paddingTop: 24, borderTop: `1px solid ${alpha(C.GOLD, 0.45)}`, fontFamily: CAPS, fontSize: 12, letterSpacing: '.3em' }}>{inv.fullDate}</Fx>
            </Panel>
          )}

          {/* Gəlin ayaqqabıları və buket */}
          {P.gown && (<div data-section="photo" style={{ position: 'relative', height: '88svh', minHeight: 520 }}>
            <Photo src={P.gown} alt="" focus="50% 42%" style={{ position: 'absolute', inset: 0 }}>
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(31,51,39,.4), transparent 40%)' }} />
              <Words text={T.gown} step={0.08} style={{ position: 'absolute', left: 24, right: 24, bottom: 30, textAlign: 'center', fontStyle: 'italic', fontWeight: 200, fontSize: 21, lineHeight: 1.4, color: C.PAPER }} />
            </Photo>
          </div>)}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* PROQRAM — masa fotosunun üstündə menyu kartı */}
          {S.program && (
            <section data-section="program" style={{ position: 'relative', paddingBottom: 76, background: C.SILK }}>
              {P.program && <Photo src={P.program} alt="" focus="50% 50%" style={{ height: '62svh', minHeight: 380 }} />}
              <div style={{ position: 'relative', zIndex: 2, maxWidth: 420, margin: P.program ? '-90px 22px 0' : '76px 22px 0', marginInline: 'max(22px, calc(50% - 210px))', padding: '46px 26px 40px', background: C.PAPER, textAlign: 'center', boxShadow: `0 30px 60px -40px ${alpha(C.INK, 0.5)}` }}>
                <div aria-hidden="true" style={{ position: 'absolute', inset: 8, border: `1px solid ${alpha(C.GOLD, 0.45)}` }} />
                <Fx as="h2" style={{ margin: 0, fontFamily: head, fontWeight: 200, fontSize: scaleFont('clamp(28px, 8vw, 36px)', C.hs), lineHeight: 1.12 }}>{L('program', 'title', timeline.sectionLabel)}</Fx>
                <Stagger step={0.12} style={{ marginTop: 22 }}>
                  {timeline.events.map((ev, i) => (
                    <div key={i} style={{ padding: '14px 0', borderTop: i ? `1px solid ${alpha(C.GOLD, 0.18)}` : 'none' }}>
                      <div style={{ fontFamily: CAPS, fontSize: 12, letterSpacing: '.28em', color: C.GOLD }}>{ev.time}</div>
                      <div style={{ marginTop: 4, fontStyle: 'italic', fontSize: 20, lineHeight: 1.35 }}>{ev.label}</div>
                    </div>
                  ))}
                </Stagger>
              </div>
            </section>
          )}

          {S.venue && (
            <Panel section="venue" head={head} C={C} title={L('venue', 'title', tr.inv_location)}>
              <Rise style={{ position: 'relative', overflow: 'hidden', isolation: 'isolate' }}>
                <MapSection
                  weddingData={weddingData} theme={theme} accent={C.INK} height="clamp(240px, 66vw, 280px)"
                  map={{ opacity: 0.9, filter: 'grayscale(1) sepia(.25) contrast(.9) brightness(1.05)', tintOpacity: 0.08, tint: C.GOLD, blend: 'multiply' }}
                  frame={<MapPin C={C} />}
                  fallback={<div style={{ height: 'clamp(240px, 66vw, 280px)', position: 'relative', background: '#E4DBCC' }}><MapPin C={C} /></div>}
                />
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, border: `1px solid ${alpha(C.GOLD, 0.45)}` }} />
              </Rise>
              <Fx style={{ marginTop: 24, fontWeight: 200, fontSize: 30, lineHeight: 1.15 }}>{weddingData.venueName || ''}</Fx>
              {weddingData.venueNote && <Fx delay={0.15} style={{ marginTop: 6, fontStyle: 'italic', fontSize: 16, color: C.MUTE }}>{weddingData.venueNote}</Fx>}
              <Fx delay={0.3}><VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={btn(C)} /></Fx>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} C={C} tone="paper" title={L('dresscode', 'title', tr.inv_dresscode)}>
              <Fx>
                <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="center" />
              </Fx>
            </Panel>
          )}

          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} C={C} title={L('seating', 'title', seatingL.title)} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="iv-seat-list" field={field(C)} suggest={suggest(C)} font={body} muted={C.MUTE} accent={C.GOLD}
                nameStyle={{ fontFamily: fonts.script, fontSize: 28, lineHeight: 1.2 }}
                card={(num) => (
                  <div style={{ position: 'relative', display: 'inline-block', width: 240, padding: '34px 20px 28px', background: C.PAPER, boxShadow: `0 26px 40px -28px ${alpha(C.INK, 0.5)}`, transformOrigin: '50% 100%', animation: 'iv-lift 1.1s cubic-bezier(.2,.8,.2,1) both' }}>
                    <div aria-hidden="true" style={{ position: 'absolute', inset: 7, border: `1px solid ${alpha(C.GOLD, 0.45)}` }} />
                    <div style={{ fontWeight: 200, fontSize: tableSize(num, 64), lineHeight: 1 }}>{num}</div>
                    <div style={{ marginTop: 6, fontStyle: 'italic', fontSize: 14, color: C.MUTE }}>{T.table}</div>
                  </div>
                )} />
            </Panel>
          )}

          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} C={C} tone="paper" title={L('gallery', 'title', tr.inv_gallery)}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, marginBottom: 28 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <Rise key={i} delay={(i % 2) * 0.12} style={{ aspectRatio: '3 / 4', overflow: 'hidden', background: C.SILK }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} className="vr-kb" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </Rise>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.INK} bg="#FFFFFF" frame={{ border: `1px solid ${alpha(C.GOLD, 0.45)}` }}
                btn={btn(C)} muted={C.MUTE} desc={galleryDesc(props.adminOverrides, tr, lang, 'celebration')} />
            </Panel>
          )}

          {S.rsvp && (
            <Panel section="rsvp" head={head} C={C} title={L('rsvp', 'title', rsvpL.title)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTE, line: alpha(C.INK, 0.35), hair: alpha(C.GOLD, 0.25), accent: C.INK,
                font: body, display: head, displayItalic: false, btnFont: body, radius: 999, btnSolid: true,
                doneMark: <div aria-hidden="true" style={{ width: 56, height: 1, margin: '0 auto 22px', background: C.GOLD }} />,
                marker: (a) => <span style={{ display: 'block', width: 13, height: 13, borderRadius: '50%', border: `1px solid ${C.INK}`, background: a ? C.INK : 'transparent', transition: 'background .3s' }} />,
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {S.guestbook && (
            <Panel section="guestbook" head={head} C={C} tone="paper" title={L('guestbook', 'title', gbookL.title)} center={false}>
              <GuestbookForm inv={inv} field={{ ...field(C), textAlign: 'left' }} btn={btn(C)} errorColor="#9A3B32" />
              <Stagger step={0.1} style={{ marginTop: 18 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  return (
                    <figure key={msg.name + i} style={{ margin: 0, padding: '22px 0', borderTop: `1px solid ${alpha(C.GOLD, 0.45)}` }}>
                      <blockquote style={{ margin: 0, fontWeight: 200, fontSize: 19, lineHeight: 1.6 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 8, fontFamily: fonts.script, fontSize: 24, color: C.GOLD }}>
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
  const single = inv.heroTitle || (inv.isCouple ? '' : inv.single)
  const longest = single || [inv.groom, inv.bride].sort((a, b) => String(b || '').length - String(a || '').length)[0] || ''
  const P = resolvePhotos(PHOTOS, inv.images)
  return (
    <section data-section="finale" style={{ position: 'relative', height: '100svh', minHeight: 600, overflow: 'hidden' }}>
      {P.finale && <Photo src={P.finale} par={0} wipe={false} focus="50% 70%" style={{ position: 'absolute', inset: 0 }} />}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${alpha(C.SILK, 0.88)}, ${alpha(C.SILK, 0.4)} 40%, ${alpha(C.SILK, 0)} 60%)` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: '12svh', textAlign: 'center', padding: '0 24px' }}>
        <Fx style={{ fontStyle: 'italic', fontWeight: 200, fontSize: 17, color: C.MUTE }}>{T.end}</Fx>
        <Fx delay={0.2} style={{ marginTop: 10 }}>
          <Names first={inv.isCouple ? inv.groom : ''} second={inv.isCouple ? inv.bride : ''} and={inv.and} single={single} C={C} script={fonts.script} size={nameSize(longest)} />
        </Fx>
        <Fx delay={0.4} style={{ marginTop: 14, fontFamily: CAPS, fontSize: 12, letterSpacing: '.3em' }}>{inv.fullDate}</Fx>
      </div>
    </section>
  )
}

function MapPin({ C }) {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -9, top: -9, width: 18, height: 18, borderRadius: '50%', background: C.PAPER, border: `5px solid ${C.INK}`, boxShadow: `0 6px 14px ${alpha(C.INK, 0.35)}` }} />
    </span>
  )
}
