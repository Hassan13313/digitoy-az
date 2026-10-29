import { motion } from 'framer-motion'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../_shared/MapSection'
import { EmblemSlot } from '../_shared/MonoContent'
import { Reveal, PopDigit, enterDirection } from '../_shared/motion'
import { hidePhoto } from '../../utils/photoGallery'
import { getTemplateTheme } from '../templateConfig'
import { useInvitation, useGate, openingNames, alpha } from '../_shared/useInvitation'
import { MusicFab, EqBars, StoryBlock, InvitationEnd, ReplyForm } from '../_shared/invitationKit'
import { VenueLinks, SeatFinder, PhotoQr, GuestbookForm } from '../_shared/blocks'
import { galleryDesc, tableSize } from '../_shared/kids'
import { C as PAL, CREAM_BG, NIGHT_BG, nameSize } from './palette'
import { LABELS, TXT } from './copy'
import { Pillow, Feather, FeatherBurst, SleepMask, Cucumber, Moon } from './art'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'

/* ─────────────────────────────────────────────────────────────────────────────
   PAJAMA SPA — «Pijama gecəsi» (Qız gecəsi konsepti, 2026-10)

   Konsept: rahat pijama və spa gecəsi — yumşaq yastıqlar, yuxu maskası,
   xiyar dilimləri, pastel yasəmən və nanə. Açılışda yastıq «z-z-z» ilə
   yatır; toxunanda yastıq sıçrayır və ətrafa lələklər səpələnir (yastıq
   davası!). Daxildə: yastıqlarda sayğac, xiyar dilimli proqram, yuxu
   maskasında masa nömrəsi, gecə səmasında arzular.
   Şriftlər: Pangolin (başlıq) · Nunito (mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('pajama-spa')
const ID = 'pajama-spa'

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['LILAC_D'], secondary: ['PEACH'], accent: ['MINT_D'], background: ['CREAM'], text: ['INK'] }

const KEYFRAMES = (C) => (`
@keyframes ps-in { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes ps-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes ps-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes ps-squash { 0% { transform: scale(1, 1) } 25% { transform: scale(1.12, .82) translateY(8%) } 55% { transform: scale(.92, 1.12) translateY(-14%) } 80% { transform: scale(1.03, .97) } 100% { transform: scale(1, 1) } }
@keyframes ps-feather { 0% { opacity: 0; transform: translate(0, 0) rotate(0) } 15% { opacity: 1 } 100% { opacity: .9; transform: translate(var(--tx), calc(var(--ty) + 60px)) rotate(var(--rot)) } }
@keyframes ps-zzz { 0% { opacity: 0; transform: translate(0, 0) scale(.6) } 30% { opacity: 1 } 100% { opacity: 0; transform: translate(20px, -40px) scale(1.1) } }
@keyframes ps-breathe { 0%,100% { transform: scale(1) } 50% { transform: scale(1.025) } }
[data-ps] span[aria-hidden="true"], [data-ps] svg[aria-hidden="true"], [data-ps] div[aria-hidden="true"] { pointer-events: none; }
[data-ps] ::placeholder { color: rgba(126,117,152,.7); }
[data-ps] [data-dark] ::placeholder { color: rgba(233,224,251,.55); }
[data-ps] input:focus-visible, [data-ps] textarea:focus-visible { border-color: ${C.LILAC_D} !important; outline: none; }
[data-ps] button:focus-visible, [data-ps] a:focus-visible, [data-ps] [role="button"]:focus-visible { outline: 2px solid ${C.LILAC_D}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-ps] *, [data-ps] { animation: none !important; transition: none !important; } }
`)

/* ═══ 01 — AÇILIŞ: yastıq davası ═══ */
function PillowOpening({ inv, theme }) {
  const C = usePalette(PAL)
  const { ot } = inv
  const gate = useGate({ inv, ms: 2100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const go = gate.opening
  const head = theme.fonts.heading
  const T = inv.copy(TXT)
  return (
    <motion.div {...gate.gateProps} data-ps
      animate={go ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.75 }}
      style={{ position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', background: CREAM_BG(C), color: C.INK, fontFamily: theme.fonts.body }}>
      <Moon size={52} style={{ position: 'absolute', right: '16%', top: '9%' }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px', textAlign: 'center' }}>
        <div style={{ animation: 'ps-in 1s ease-out .2s both' }}>
          {ot.show('kicker') && <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '.22em', textTransform: 'uppercase', color: C.LILAC_D }}>{ot.text('kicker')}</div>}
          {titleOv !== '' && (
            <div style={{ marginTop: 4, fontFamily: head, fontSize: 'clamp(50px, 15vw, 72px)', lineHeight: 1.05, overflowWrap: 'anywhere', color: C.INK }}>
              {first}{second && <> {ot.text('and')} {second}</>}
            </div>
          )}
        </div>
        <div style={{ position: 'relative', marginTop: 30 }}>
          {!go && [0, 0.8, 1.6].map((d, i) => (
            <span key={i} aria-hidden="true" style={{ position: 'absolute', right: `${4 - i * 6}%`, top: `${-6 - i * 8}%`, fontFamily: head, fontSize: 22 + i * 6, color: C.LILAC_D, animation: `ps-zzz 2.4s ease-out ${d}s infinite` }}>z</span>
          ))}
          <FeatherBurst on={go} />
          <div style={{ animation: go ? 'none' : 'ps-breathe 3s ease-in-out infinite' }}>
            <Pillow width="min(66vw, 260px)" bounce={go}>
              <EmblemSlot mono={ot.mono} size={58} border={`2px dashed ${C.LILAC_D}`} background="transparent" color={C.LILAC_D} font={head} style={{ animation: 'none', margin: 0 }}>
                <SleepMask width={110}><span style={{ position: 'relative', fontFamily: head, fontSize: 15, color: '#FFFFFF' }}>{T.zzz}</span></SleepMask>
              </EmblemSlot>
            </Pillow>
          </div>
        </div>
        <div style={{ marginTop: 22, minHeight: 30, animation: 'ps-in 1s ease-out .35s both' }}>
          {go
            ? <div style={{ fontFamily: head, fontSize: 26, color: C.LILAC_D, animation: 'ps-in .4s ease-out .3s both' }}>{T.party}</div>
            : ot.show('meta') && <div style={{ fontSize: 16, color: C.MUTED }}>{ot.text('meta')}</div>}
        </div>
        <motion.div animate={go ? { opacity: 0, y: 8 } : {}} transition={{ duration: 0.25 }} style={{ marginTop: 16 }}>
          {ot.show('cta') && (
            <div style={{ minHeight: 50, padding: '12px 30px', display: 'inline-flex', alignItems: 'center', borderRadius: 999, background: C.LILAC_D, color: '#FFFFFF', fontFamily: head, fontSize: 20, boxShadow: `0 6px 0 ${C.NIGHT}`, animation: 'ps-in .8s ease-out .8s both' }}>
              {ot.text('cta')}
            </div>
          )}
          {ot.show('hint') && <div style={{ marginTop: 14, fontSize: 14.5, color: C.MUTED, animation: 'ps-fade .8s ease-out 1.1s both, ps-hint 3s ease-in-out 2s infinite' }}>{ot.text('hint')}</div>}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* Bölmə */
function Panel({ id, section, title, kicker, sub, children, head, dark = false }) {
  const C = usePalette(PAL)
  return (
    <section id={id} data-section={section} data-dark={dark ? '' : undefined} style={{ position: 'relative', padding: '64px 20px 70px', overflow: 'hidden', background: dark ? NIGHT_BG(C) : CREAM_BG(C), color: dark ? C.LILAC_L : C.INK }}>
      <Reveal style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
              <Feather size={22} color={dark ? '#FFFFFF' : C.LILAC} style={{ transform: 'rotate(-30deg)' }} />
              <Feather size={26} color={dark ? C.LILAC_L : C.MINT} />
              <Feather size={22} color={dark ? '#FFFFFF' : C.PEACH} style={{ transform: 'rotate(30deg)' }} />
            </div>
            {kicker && <div style={{ marginBottom: 4, fontSize: 12.5, fontWeight: 800, letterSpacing: '.22em', textTransform: 'uppercase', color: dark ? C.MINT : C.LILAC_D }}>{kicker}</div>}
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 400, fontSize: scaleFont('clamp(34px, 10vw, 46px)', C.hs), lineHeight: 1.08, textWrap: 'balance', color: dark ? '#FFFFFF' : C.INK }}>{title}</h2>}
            {sub && <p style={{ margin: '10px auto 0', maxWidth: 340, fontSize: 16.5, color: dark ? alpha(C.LILAC_L, 0.8) : C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: '#FFFFFF', border: `2px solid ${C.LINE}`, borderRadius: 18,
  padding: '14px 16px', fontSize: 16.5, color: C.INK, outline: 'none',
})
const darkField = (C) => ({ ...field(C), background: alpha('#FFFFFF', 0.1), border: `2px solid ${alpha(C.LILAC, 0.4)}`, color: '#FFFFFF' })
const btn = (C) => ((on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 24px', borderRadius: 999,
  fontSize: 16, fontWeight: 800, textDecoration: 'none', cursor: 'pointer',
  background: on ? C.LILAC_D : '#FFFFFF', color: on ? '#FFFFFF' : C.INK, border: `2px solid ${on ? C.LILAC_D : C.LINE}`, boxShadow: on ? `0 4px 0 ${C.NIGHT}` : 'none',
}))
const darkBtn = (C) => ((on) => ({ ...btn(C)(on), background: on ? C.MINT : 'transparent', color: on ? C.NIGHT_D : '#FFFFFF', border: `2px solid ${on ? C.MINT : alpha(C.LILAC, 0.5)}`, boxShadow: 'none' }))
const suggest = (C) => ({ bg: '#FFFFFF', border: `2px solid ${C.LINE}`, active: alpha(C.LILAC, 0.25), text: C.INK, table: C.LILAC_D, radius: 18 })

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function PajamaSpaTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const T = inv.copy(TXT)
  const heroName = inv.heroTitle || (inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single)
  const PASTELS = [C.LILAC, C.MINT, C.PEACH, C.LILAC_L]

  return (
    <PaletteContext.Provider value={C}><div data-ps lang={lang} data-enter={enterDirection(ID)} style={{
      backgroundColor: C.CREAM, minHeight: '100vh', fontFamily: body, color: C.INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.LILAC, 0.5),
    }}>
      <style>{KEYFRAMES(C)}</style>
      {!inv.opened && <PillowOpening inv={inv} theme={theme} lang={lang} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: C.LILAC_D, boxShadow: `0 4px 0 ${C.NIGHT}, 0 10px 20px rgba(59,46,90,.3)` }}>
        {({ playing }) => <EqBars playing={playing} color="#FFFFFF" idle={alpha('#FFFFFF', 0.45)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(C.CREAM, 0.92), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `2px dashed ${C.LINE}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 15.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: head, fontSize: 23, color: C.INK }}>{T.brand}</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — yastıqlar */}
          <section data-section="hero" style={{ position: 'relative', overflow: 'hidden', background: CREAM_BG(C), padding: '30px 22px 64px', textAlign: 'center' }}>
            <Moon size={44} style={{ position: 'absolute', right: '12%', top: 24 }} />
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', height: 'min(50vw, 200px)' }}>
              <Pillow width="min(46vw, 180px)" style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-86%) rotate(-8deg)' }} />
              <Pillow width="min(46vw, 180px)" style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-14%) rotate(7deg)' }} />
              <SleepMask width={120} style={{ position: 'absolute', left: '50%', top: '12%', transform: 'translateX(-50%) rotate(-4deg)' }}><span style={{ position: 'relative', fontFamily: head, fontSize: 15, color: '#FFFFFF' }}>{T.zzz}</span></SleepMask>
              {[[-30, 20, 0], [140, 10, 1], [110, 70, 2]].map(([x, y, i]) => <Feather key={i} size={18} color={PASTELS[i]} style={{ position: 'absolute', left: `${x / 2}%`, top: `${y}%`, transform: `rotate(${i * 40 - 30}deg)` }} />)}
            </div>
            <div style={{ position: 'relative', marginTop: 22, fontSize: 13, fontWeight: 800, letterSpacing: '.22em', textTransform: 'uppercase', color: C.LILAC_D }}>{L('hero', 'kicker', inv.eventLabel)}</div>
            <h1 style={{ position: 'relative', margin: '4px 0 0', fontFamily: head, fontWeight: 400, fontSize: nameSize(heroName), lineHeight: 1.05, overflowWrap: 'anywhere', color: C.INK, animation: 'ps-in 1s ease-out .2s both' }}>{heroName}</h1>
            <div style={{ position: 'relative', marginTop: 8, fontFamily: head, fontSize: 22, color: C.MINT_D }}>{T.party}</div>
            {inv.isCorp && weddingData.organizer?.trim() && <div style={{ position: 'relative', marginTop: 6, fontSize: 15.5, color: C.MUTED }}>{tr.organizer_display}: {weddingData.organizer}</div>}
            <div style={{ position: 'relative', marginTop: 18, fontWeight: 800, fontSize: 'clamp(20px, 5.6vw, 24px)', color: C.INK }}>{inv.fullDate}</div>
            <div style={{ position: 'relative', marginTop: 6, fontSize: 16, color: C.MUTED }}>{[inv.time, weddingData.venueName].filter(Boolean).join(' · ')}</div>
            <p style={{ position: 'relative', margin: '18px auto 0', maxWidth: 330, fontSize: 17, lineHeight: 1.55, color: C.INK }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — yastıqlar */}
          {S.countdown && (
            <Panel section="countdown" head={head} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 3vw, 14px)', maxWidth: 400, margin: '0 auto' }}>
                {[[cd.days, cd.labels.days], [cd.hours, cd.labels.hours], [cd.minutes, cd.labels.minutes], [cd.seconds, cd.labels.seconds, true]].map(([v, l, pop], i) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ aspectRatio: '1', borderRadius: '40% 40% 36% 36% / 46% 46% 40% 40%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `radial-gradient(120% 90% at 30% 20%, #FFFFFF, ${PASTELS[i]})`, boxShadow: 'inset 0 -6px 12px rgba(142,114,214,.18), 0 10px 16px -10px rgba(59,46,90,.4)' }}>
                      <span style={{ fontFamily: head, fontSize: 'clamp(26px, 7.8vw, 36px)', lineHeight: 1, color: C.INK, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></span>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 12, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: C.MUTED }}>{l}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN */}
          {S.venue && (
            <Panel section="venue" head={head} dark title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ maxWidth: 430, margin: '0 auto', padding: 8, borderRadius: 32, background: alpha('#FFFFFF', 0.92), boxShadow: '0 24px 36px -22px rgba(0,0,0,.6)' }}>
                <div style={{ borderRadius: 26, overflow: 'hidden', isolation: 'isolate' }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.LILAC_D} height="clamp(240px, 66vw, 300px)"
                    map={{ opacity: 0.92, filter: 'saturate(.7)', tintOpacity: 0.16, tint: C.LILAC, blend: 'multiply' }}
                    frame={<MapPin />}
                    fallback={<div style={{ height: 'clamp(240px, 66vw, 300px)', position: 'relative', background: CREAM_BG(C) }}><MapPin /></div>}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 24, fontFamily: head, fontSize: 30, lineHeight: 1.15, color: '#FFFFFF' }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 6, fontSize: 16, color: C.MINT }}>{weddingData.venueNote}</div>}
              <VenueLinks inv={inv} weddingData={weddingData} tr={tr} btn={darkBtn(C)} />
            </Panel>
          )}

          {/* PROQRAM — xiyar dilimləri */}
          {S.program && (
            <Panel section="program" head={head} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ maxWidth: 400, margin: '0 auto', display: 'grid', gap: 12 }}>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 64px minmax(0, 1fr)', gap: 8, alignItems: 'center', padding: '12px 16px 12px 10px', borderRadius: 22, background: '#FFFFFF', boxShadow: `inset 0 0 0 2px ${PASTELS[i % 4]}, 0 10px 18px -14px rgba(59,46,90,.4)` }}>
                    <Cucumber size={30} style={{ justifySelf: 'center' }} />
                    <div style={{ fontFamily: head, fontSize: 20, color: C.LILAC_D, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</div>
                    <div style={{ fontSize: 16.5, fontWeight: 700, lineHeight: 1.3, color: C.INK }}>{ev.label}</div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {S.dresscode && (
            <Panel section="dresscode" head={head} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={body} align="center" />
            </Panel>
          )}

          {/* MASA — yuxu maskası */}
          {S.seating && !seating.isEmpty && (
            <Panel section="seating" head={head} dark title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <SeatFinder inv={inv} tr={tr} listId="ps-seat-list" field={darkField(C)} suggest={suggest(C)} font={body} muted={alpha(C.LILAC_L, 0.8)} accent={C.MINT}
                nameStyle={{ fontFamily: head, fontSize: 30, color: '#FFFFFF' }}
                card={(num) => (
                  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 22 }}>
                    <SleepMask width={260}>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 10, color: '#FFFFFF' }}>
                        <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '.2em', textTransform: 'uppercase' }}>{T.table}{' '}</span>
                        <span style={{ fontFamily: head, fontSize: tableSize(num, 54), lineHeight: 1 }}>{num}</span>
                      </div>
                    </SleepMask>
                  </div>
                )} />
            </Panel>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Panel section="gallery" id="gallery-section" head={head} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16, marginBottom: 32 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ position: 'relative', aspectRatio: '4 / 5', padding: 7, borderRadius: 24, background: PASTELS[i % 4], transform: `rotate(${i % 2 ? 2 : -2}deg)`, boxShadow: '0 12px 18px -12px rgba(59,46,90,.4)' }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 18 }} />
                    </div>
                  ))}
                </div>
              )}
              <PhotoQr inv={inv} tr={tr} fg={C.NIGHT} bg="#FFFFFF" frame={{ borderRadius: 22, border: `3px solid ${C.LILAC}` }}
                btn={btn(C)} muted={C.MUTED} desc={galleryDesc(props.adminOverrides, tr, lang, 'night')} />
            </Panel>
          )}

          {/* RSVP */}
          {S.rsvp && (
            <Panel section="rsvp" head={head} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{
                ink: C.INK, muted: C.MUTED, line: C.LINE, hair: alpha(C.LINE, 0.7), accent: C.LILAC_D,
                font: body, display: head, displayItalic: false, btnFont: head,
                doneMark: <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><Pillow width={90} /></div>,
                marker: (a) => (a ? <Cucumber size={18} /> : <span style={{ display: 'block', width: 16, height: 16, borderRadius: '50%', border: `2px solid ${C.LINE}` }} />),
                suggest: { ...suggest(C), font: body },
              }} />
            </Panel>
          )}

          {/* SÖZLƏR — danışıq buludları */}
          {S.guestbook && (
            <Panel section="guestbook" head={head} dark title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <GuestbookForm inv={inv} field={darkField(C)} btn={darkBtn(C)} errorColor={C.MINT} />
              <div style={{ display: 'grid', gap: 18 }}>
                {gbook.messages.map((raw, i) => {
                  const msg = gbook.readMessage(raw)
                  const left = i % 2 === 0
                  return (
                    <figure key={msg.name + i} style={{ position: 'relative', margin: 0, maxWidth: '88%', justifySelf: left ? 'start' : 'end', padding: '16px 18px 12px', borderRadius: left ? '22px 22px 22px 6px' : '22px 22px 6px 22px', background: PASTELS[i % 4], color: C.INK }}>
                      <blockquote style={{ margin: 0, fontSize: 16.5, lineHeight: 1.5 }}>{msg.text}</blockquote>
                      <figcaption style={{ marginTop: 6, fontFamily: head, fontSize: 18, color: C.LILAC_D }}>
                        {msg.name}{msg.date ? <span style={{ fontFamily: body, fontSize: 13, color: C.MUTED }}> · {gbook.formatDate(msg.date)}</span> : null}
                      </figcaption>
                    </figure>
                  )
                })}
              </div>
            </Panel>
          )}

          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={head} />
        </motion.div>
      )}
    </div></PaletteContext.Provider>
  )
}

function MapPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: -17, top: -17, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.3))' }}><Cucumber size={34} /></span>
    </span>
  )
}
