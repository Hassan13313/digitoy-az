import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../_shared/MapSection'
import { Reveal, PopDigit, enterDirection } from '../_shared/motion'
import { hidePhoto } from '../../utils/photoGallery'
import { getTemplateTheme } from '../templateConfig'
import { useInvitation, useGate, openingNames, seatInputProps, alpha } from '../_shared/useInvitation'
import { MusicFab, EqBars, SeatSuggest, StoryBlock, InvitationEnd, ReplyForm } from '../_shared/invitationKit'

/* ─────────────────────────────────────────────────────────────────────────────
   MODERN BLACK — «Moda evinin tipoqrafik afişası» (premium redizayn, 2026-10)

   Konsept: ornament yoxdur, rəng yoxdur — yalnız saf qara, saf ağ və şrift.
   Adlar ekranın enini dolduran geniş (extended) hərflərlə yazılır, məlumat
   isə Isveçrə afişasının spesifikasiya cədvəli kimi sətir-sətir düzülür.
   Bütün düzülüş sola yığılıb və kəskindir; radius yoxdur.

   Bölmələrin şablona məxsus forması:
     açılış   → iki adlı monoqram-afişa; toxunanda afişa ortadan yarılır,
                yuxarı yarı yuxarı, aşağı yarı aşağı çəkilir (qalereya qapısı)
     hero     → ekran enində adlar + «Tarix / Saat / Məkan» spesifikasiya cədvəli
     sayğac   → xaç xətli 2×2 rəqəm şəbəkəsi
     proqram  → saat | hadisə cədvəli
     masa     → ekran enində «MASA 4»
     RSVP     → səhifənin YEGANƏ ağ bloku — tərs kontrast
   Şriftlər: Unbounded (geniş başlıq) · Inter Tight (mətn).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('modern-black')
const ID = 'modern-black'

const LABELS = {
  countdown: { title: { az: 'Qalan vaxt', en: 'Time left', ru: 'Осталось' } },
  venue:     { title: { az: 'Məkan', en: 'Venue', ru: 'Место' } },
  program:   { title: { az: 'Proqram', en: 'Programme', ru: 'Программа' } },
  dresscode: { title: { az: 'Geyim kodu', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Masanız', en: 'Your table', ru: 'Ваш стол' } },
  gallery:   { title: { az: 'Fotolar', en: 'Photos', ru: 'Фото' } },
  guestbook: { title: { az: 'Təbriklər', en: 'Wishes', ru: 'Поздравления' } },
}

/* Spesifikasiya cədvəlinin sahə adları */
const SPEC = {
  az: { date: 'Tarix', time: 'Saat', place: 'Məkan' },
  en: { date: 'Date', time: 'Time', place: 'Venue' },
  ru: { date: 'Дата', time: 'Время', place: 'Место' },
}

const KEYFRAMES = `
@keyframes mb-up    { from { transform: translateY(105%) } to { transform: none } }
@keyframes mb-line  { from { transform: scaleX(0) } to { transform: scaleX(1) } }
@keyframes mb-fade  { from { opacity: 0 } to { opacity: 1 } }
@keyframes mb-blink { 0%,100% { opacity: .35 } 50% { opacity: 1 } }
[data-mb] span[aria-hidden="true"], [data-mb] svg[aria-hidden="true"], [data-mb] div[aria-hidden="true"] { pointer-events: none; }
[data-mb] ::placeholder { color: rgba(255,255,255,.38); }
[data-mb] .mb-invert ::placeholder { color: rgba(0,0,0,.38); }
[data-mb] input:focus-visible, [data-mb] textarea:focus-visible { border-color: #FFFFFF !important; outline: none; }
[data-mb] .mb-invert input:focus-visible { border-color: #000000 !important; }
[data-mb] button:focus-visible, [data-mb] a:focus-visible, [data-mb] [role="button"]:focus-visible { outline: 2px solid #FFFFFF; outline-offset: 3px; }
[data-mb] .mb-invert button:focus-visible { outline-color: #000000; }
@media (prefers-reduced-motion: reduce) { [data-mb] *, [data-mb] { animation: none !important; transition: none !important; } }
`

/** Adı ekran eninə sığdıran şrift ölçüsü (Unbounded geniş hərflidir) */
function fit(text, vw = 90, max = 120, min = 26) {
  const n = Math.max(4, String(text || '').length)
  return `clamp(${min}px, ${(vw / (n * 0.86)).toFixed(2)}vw, ${max}px)`
}

const upper = (s, lang) => String(s || '').toLocaleUpperCase(lang === 'az' ? 'az' : lang)

/* Maskalı sətir — hərflər öz xəttinin altından qalxır */
function MaskLine({ children, delay = 0, style = {} }) {
  return (
    <div style={{ overflow: 'hidden', ...style }}>
      <div style={{ animation: `mb-up 1s cubic-bezier(.7,0,.2,1) ${delay}s both` }}>{children}</div>
    </div>
  )
}

/* ═══ 01 — AÇILIŞ: monoqram-afişa, ortadan yarılır ═══ */
function PosterOpening({ inv, theme }) {
  const { ot, lang } = inv
  const gate = useGate({ inv, ms: 1100 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const display = theme.fonts.heading
  const sans = theme.fonts.body
  const metaOv = ot.override('meta')
  /* Defolt meta iki hissədir: «13.03.2027» və «BAKI · 19:00» (openingSpec) */
  const [dotted = '', venueTown = ''] = String(ot.defaults.meta || '').split('   ')
  const split = (dir) => ({
    animate: gate.opening ? { y: dir === 'up' ? '-102%' : '102%' } : {},
    transition: { duration: 0.95, ease: [0.76, 0, 0.24, 1] },
  })
  const rule = (delay) => ({
    height: 1, background: '#FFFFFF', opacity: 0.85, transformOrigin: '0 50%',
    animation: `mb-line 1.1s cubic-bezier(.7,0,.2,1) ${delay}s both`,
  })

  return (
    <div {...gate.gateProps} data-mb style={{
      position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden',
      color: '#FFFFFF', fontFamily: sans, background: gate.opening ? 'transparent' : '#000000',
      transition: 'background .4s ease .5s',
    }}>
      {/* yuxarı yarı */}
      <motion.div {...split('up')} style={{
        position: 'absolute', left: 0, right: 0, top: 0, height: '50%', background: '#000000',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: 'calc(env(safe-area-inset-top, 0px) + 22px) 20px 0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, letterSpacing: '.04em', animation: 'mb-fade .8s ease-out .2s both' }}>
          <span>{ot.text('brand')}</span>
          <span style={{ color: '#8C8C8C' }}>{ot.text('no')}</span>
        </div>
        <div>
          {ot.show('kicker') && (
            <MaskLine delay={0.35} style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: '#8C8C8C' }}>{ot.text('kicker')}</span>
            </MaskLine>
          )}
          {titleOv !== '' && (
            <MaskLine delay={0.5}>
              <div style={{ fontFamily: display, fontWeight: 300, fontSize: fit(first), lineHeight: 1.12, letterSpacing: '-.01em', whiteSpace: 'nowrap' }}>
                {upper(first, lang)}
              </div>
            </MaskLine>
          )}
          <div style={{ ...rule(0.9), marginTop: 14 }} />
        </div>
      </motion.div>

      {/* aşağı yarı */}
      <motion.div {...split('down')} style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%', background: '#000000',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '14px 20px calc(env(safe-area-inset-bottom, 0px) + 24px)',
      }}>
        <div>
          {second && (
            <>
              {ot.show('and') && (
                <MaskLine delay={0.7} style={{ textAlign: 'right' }}>
                  <span style={{ fontFamily: display, fontWeight: 200, fontSize: 14, letterSpacing: '.3em' }}>{ot.text('and')}</span>
                </MaskLine>
              )}
              <MaskLine delay={0.8} style={{ textAlign: 'right', marginTop: 6 }}>
                <div style={{ fontFamily: display, fontWeight: 300, fontSize: fit(second), lineHeight: 1.12, letterSpacing: '-.01em', whiteSpace: 'nowrap' }}>
                  {upper(second, lang)}
                </div>
              </MaskLine>
            </>
          )}
        </div>
        <div>
          {ot.show('meta') && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, animation: 'mb-fade .8s ease-out 1.3s both' }}>
              {metaOv !== undefined ? (
                <span style={{ fontSize: 14 }}>{metaOv}</span>
              ) : (
                <>
                  <span style={{ fontFamily: display, fontWeight: 300, fontSize: 22 }}>{dotted}</span>
                  <span style={{ fontSize: 13, color: '#BDBDBD', textAlign: 'right' }}>{venueTown}</span>
                </>
              )}
            </div>
          )}
          <div style={{ ...rule(1.2), margin: '16px 0 18px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'mb-fade .8s ease-out 1.6s both' }}>
            {ot.show('cta') && (
              <span style={{ fontSize: 15, fontWeight: 500, borderBottom: '1px solid #FFFFFF', paddingBottom: 3 }}>{ot.text('cta')}</span>
            )}
            {ot.show('hint') && (
              <span style={{ fontSize: 12.5, color: '#8C8C8C', animation: 'mb-blink 2.4s ease-in-out 2.4s infinite' }}>{ot.text('hint')}</span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ═══ Bölmə — üstündə tam enli xətt, başlıq geniş hərflərlə sola ═══ */
function Block({ id, section, title, kicker, sub, children, theme, invert = false, style = {} }) {
  const fg = invert ? '#000000' : '#FFFFFF'
  return (
    <section id={id} data-section={section} className={invert ? 'mb-invert' : undefined} style={{
      position: 'relative', padding: '56px 20px 64px', background: invert ? '#FFFFFF' : 'transparent', color: fg,
      borderTop: invert ? 'none' : '1px solid rgba(255,255,255,.18)', ...style,
    }}>
      <Reveal style={{ maxWidth: 620 }}>
        {(title || kicker) && (
          <div style={{ marginBottom: 30 }}>
            {title && (
              <h2 style={{
                margin: 0, fontFamily: theme.fonts.heading, fontWeight: 300, color: fg,
                fontSize: 'clamp(26px, 8.4vw, 40px)', lineHeight: 1, letterSpacing: '-.01em', textTransform: 'uppercase',
              }}>{title}</h2>
            )}
            {kicker && <div style={{ marginTop: 10, fontSize: 13, color: invert ? '#555555' : '#8C8C8C' }}>{kicker}</div>}
            {sub && <p style={{ margin: '10px 0 0', fontSize: 15, color: invert ? '#444444' : '#A3A3A3', maxWidth: 340, lineHeight: 1.5 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const btn = (filled, invert = false) => {
  const fg = invert ? '#000000' : '#FFFFFF'
  const bg = invert ? '#FFFFFF' : '#000000'
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 20px',
    fontSize: 14, fontWeight: 500, letterSpacing: '.01em', textDecoration: 'none', cursor: 'pointer', borderRadius: 0,
    background: filled ? fg : 'transparent', color: filled ? bg : fg, border: `1px solid ${fg}`,
  }
}

const lineField = (invert = false) => ({
  width: '100%', background: 'transparent', border: 'none', borderRadius: 0,
  borderBottom: `1px solid ${invert ? 'rgba(0,0,0,.4)' : 'rgba(255,255,255,.4)'}`,
  padding: '14px 0', fontSize: 17, color: invert ? '#000000' : '#FFFFFF', outline: 'none',
})

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function ModernBlackTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const display = theme.fonts.heading
  const sans = theme.fonts.body
  const spec = SPEC[lang] || SPEC.az
  const dateLine = inv.dp
    ? `${String(inv.dp.day).padStart(2, '0')} ${inv.dp.month} ${inv.dp.year}`
    : inv.formattedDate

  return (
    <div data-mb data-enter={enterDirection(ID)} style={{
      background: theme.background, minHeight: '100vh', fontFamily: sans, color: theme.text,
      overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined,
      '--tpl-glow': alpha('#FFFFFF', 0.25),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <PosterOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: 0, background: '#000000', border: '1px solid #FFFFFF' }}>
        {({ playing }) => <EqBars playing={playing} color="#FFFFFF" idle="#6B6B6B" radius={0} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(0,0,0,.88)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,.14)',
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#BDBDBD', fontSize: 14, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: sans }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: display, fontWeight: 300, fontSize: 13, letterSpacing: '.08em' }}>DIGITOY</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — ekran enində adlar + spesifikasiya cədvəli */}
          <section style={{ padding: '56px 20px 48px', minHeight: 'calc(100svh - 52px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, color: '#8C8C8C' }}>{L('hero', 'kicker', inv.eventLabel)}</div>
              <p style={{ margin: '10px 0 0', fontSize: 15.5, lineHeight: 1.5, color: '#BDBDBD', maxWidth: 300 }}>{tr.inv_join}</p>
            </div>
            <h1 style={{ margin: '40px 0', fontFamily: display, fontWeight: 300, lineHeight: 0.95, letterSpacing: '-.015em' }}>
              {inv.heroTitle ? (
                <span style={{ display: 'block', fontSize: fit(inv.heroTitle, 92, 72) }}>{upper(inv.heroTitle, lang)}</span>
              ) : inv.isCouple ? (
                <>
                  <span style={{ display: 'block', fontSize: fit(inv.groom, 92) }}>{upper(inv.groom, lang)}</span>
                  <span style={{ display: 'block', fontWeight: 200, fontSize: 'clamp(28px, 9vw, 44px)', margin: '8px 0', color: '#8C8C8C' }}>&amp;</span>
                  <span style={{ display: 'block', fontSize: fit(inv.bride, 92) }}>{upper(inv.bride, lang)}</span>
                </>
              ) : (
                <span style={{ display: 'block', fontSize: fit(inv.single, 92, 72) }}>{upper(inv.single, lang)}</span>
              )}
            </h1>
            {inv.isCorp && weddingData.organizer?.trim() && (
              <div style={{ fontSize: 14, color: '#BDBDBD', marginBottom: 20 }}>{tr.organizer_display}: {weddingData.organizer}</div>
            )}
            <dl style={{ margin: 0 }}>
              {[
                [spec.date, dateLine + (inv.dp ? `, ${inv.dp.weekday}` : '')],
                inv.time ? [spec.time, inv.time] : null,
                weddingData.venueName ? [spec.place, weddingData.venueName] : null,
              ].filter(Boolean).map(([k, v]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '84px 1fr', gap: 12, padding: '14px 0', borderTop: '1px solid rgba(255,255,255,.2)' }}>
                  <dt style={{ fontSize: 13, color: '#8C8C8C', paddingTop: 3 }}>{k}</dt>
                  <dd style={{ margin: 0, fontFamily: display, fontWeight: 300, fontSize: 17, lineHeight: 1.35 }}>{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* SAYĞAC — xaç xətli 2×2 şəbəkə */}
          {S.countdown && (
            <Block theme={theme} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', position: 'relative' }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,.22)' }} />
                <span aria-hidden="true" style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.22)' }} />
                {[
                  { v: cd.days, l: cd.labels.days },
                  { v: cd.hours, l: cd.labels.hours },
                  { v: cd.minutes, l: cd.labels.minutes },
                  { v: cd.seconds, l: cd.labels.seconds, pop: true },
                ].map(({ v, l, pop }, i) => (
                  <div key={l} style={{ padding: i < 2 ? '6px 16px 22px 0' : '22px 16px 6px 0', paddingLeft: i % 2 ? 18 : 0 }}>
                    <div style={{ fontFamily: display, fontWeight: 200, fontSize: 'clamp(46px, 15vw, 72px)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                      <PopDigit value={v} pop={pop} />
                    </div>
                    <div style={{ fontSize: 13, color: '#8C8C8C', marginTop: 6 }}>{l}</div>
                  </div>
                ))}
              </div>
            </Block>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} style={{ borderTop: '1px solid rgba(255,255,255,.18)' }} />

          {/* MƏKAN */}
          {S.venue && (
            <Block theme={theme} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ margin: '0 -20px', borderTop: '1px solid rgba(255,255,255,.2)', borderBottom: '1px solid rgba(255,255,255,.2)' }}>
                <MapSection
                  weddingData={weddingData} theme={theme} accent="#FFFFFF" height="min(92vw, 420px)"
                  map={{ opacity: 1, filter: 'grayscale(1) contrast(1.35) brightness(.72)', tintOpacity: 0 }}
                  frame={<Crosshair />}
                  fallback={(
                    <div style={{ height: 'min(92vw, 420px)', position: 'relative', background: '#0A0A0A' }}>
                      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: 0.16, backgroundImage: 'linear-gradient(#FFF 1px, transparent 1px), linear-gradient(90deg, #FFF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                      <Crosshair />
                    </div>
                  )}
                />
              </div>
              <div style={{ marginTop: 22, fontFamily: display, fontWeight: 300, fontSize: 22, lineHeight: 1.25 }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ marginTop: 6, fontSize: 15, color: '#A3A3A3' }}>{weddingData.venueNote}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
                {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={btn(true)}>{tr.inv_directions_btn}</a>}
                {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={btn(!inv.dirUrl)}>Maps</a>}
                {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Waze</a>}
                {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Apple</a>}
              </div>
            </Block>
          )}

          {/* PROQRAM — saat | hadisə cədvəli */}
          {S.program && (
            <Block theme={theme} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div>
                {timeline.events.map((ev, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '84px 1fr', gap: 12, padding: '16px 0', borderTop: '1px solid rgba(255,255,255,.2)', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: display, fontWeight: 300, fontSize: 18, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</span>
                    <span style={{ fontSize: 17, lineHeight: 1.4, color: '#E5E5E5' }}>{ev.label}</span>
                  </div>
                ))}
              </div>
            </Block>
          )}

          {S.dresscode && (
            <Block theme={theme} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection
                theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription}
                lang={lang} serif={display} align="left" onDark
              />
            </Block>
          )}

          {/* MASA */}
          {S.seating && !seating.isEmpty && (
            <Block theme={theme} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <input {...seatInputProps(inv, 'mb-seat-list')} style={lineField()} />
              <SeatSuggest inv={inv} id="mb-seat-list" c={{ bg: '#0D0D0D', border: '1px solid rgba(255,255,255,.3)', active: 'rgba(255,255,255,.1)', text: '#FFFFFF', table: '#BDBDBD' }} />
              {seating.showNotFound && <div style={{ marginTop: 12, fontSize: 14, color: '#A3A3A3' }}>{tr.inv_seat_fullname}</div>}
              {seating.selected && (
                <div style={{ marginTop: 34 }}>
                  <div style={{ fontSize: 15, color: '#A3A3A3' }}>{seating.selected.full_name}</div>
                  <div style={{ fontFamily: display, fontWeight: 300, fontSize: fit(seating.selected.table_id, 90, 110), lineHeight: 1, marginTop: 6 }}>
                    {upper(seating.selected.table_id, lang)}
                  </div>
                  {seating.tablemates.length > 0 && (
                    <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,.2)', fontSize: 15, lineHeight: 1.6, color: '#D4D4D4' }}>
                      {seating.tablemates.map((g) => g.full_name).join(' / ')}
                    </div>
                  )}
                  <button onClick={seating.reset} data-press style={{ marginTop: 14, background: 'none', border: 'none', borderBottom: '1px solid #FFFFFF', color: '#FFFFFF', padding: '6px 0', minHeight: 44, cursor: 'pointer', fontSize: 14, fontFamily: sans }}>
                    {seatingL.again || 'Yenidən axtar'}
                  </button>
                </div>
              )}
            </Block>
          )}

          {/* FOTOLAR */}
          {S.gallery && (
            <Block id="gallery-section" theme={theme} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, margin: '0 -20px 28px' }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ aspectRatio: '1', overflow: 'hidden', background: '#111' }}>
                      <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'grayscale(1) contrast(1.1)' }} />
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ width: 150, height: 150, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <QRCodeSVG value={gallery.photoShareUrl} size={126} bgColor="#FFFFFF" fgColor="#000000" level="M" />
                </div>
                <div style={{ flex: '1 1 140px', fontSize: 14, color: '#A3A3A3', lineHeight: 1.5 }}>{tr.inv_scan_upload}</div>
              </div>
              <a data-press href={gallery.photoShareUrl} style={{ ...btn(true), marginTop: 20, width: '100%' }}>{tr.inv_gallery_btn}</a>
              <p style={{ margin: '16px 0 0', fontSize: 15, color: '#A3A3A3', lineHeight: 1.65 }}>{tr.inv_gallery_desc}</p>
            </Block>
          )}

          {/* RSVP — yeganə ağ blok */}
          {S.rsvp && (
            <Block theme={theme} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <ReplyForm inv={inv} t={{ ink: '#FFFFFF', muted: '#8C8C8C', line: 'rgba(255,255,255,.5)', hair: 'rgba(255,255,255,.14)', accent: '#FFFFFF', font: sans, display, radius: 0, btnUpper: true, btnTracking: '.14em', marker: (a) => <span style={{ display: 'block', width: 11, height: 11, border: '1px solid #FFFFFF', background: a ? '#FFFFFF' : 'transparent' }} />, suggest: { bg: '#0D0D0D', border: '1px solid rgba(255,255,255,.2)', active: 'rgba(255,255,255,.08)', text: '#FFFFFF', table: '#8C8C8C', radius: 0, font: sans } }} />
            </Block>
          )}

          {/* TƏBRİKLƏR */}
          {S.guestbook && (
            <Block theme={theme} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')} style={{ borderTop: S.rsvp ? 'none' : undefined }}>
              <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 6, marginBottom: 30 }}>
                <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={lineField()} />
                <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...lineField(), resize: 'none', lineHeight: 1.5 }} />
                <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...btn(gbook.canSubmit), marginTop: 12, width: '100%', opacity: gbook.canSubmit ? 1 : 0.4, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}>
                  {gbook.sending ? gbookL.sending : gbookL.btn}
                </button>
                {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 13.5 }}>⚠ {gbookL.error}</p>}
              </form>
              <div>
                {gbook.messages.map((raw, i) => {
                  const m = gbook.readMessage(raw)
                  return (
                    <figure key={m.name + i} style={{ margin: 0, padding: '20px 0', borderTop: '1px solid rgba(255,255,255,.2)' }}>
                      <blockquote style={{ margin: 0, fontSize: 19, lineHeight: 1.45, letterSpacing: '-.005em' }}>{m.text}</blockquote>
                      <figcaption style={{ marginTop: 10, fontSize: 13.5, color: '#8C8C8C' }}>{m.name}{m.date ? `, ${gbook.formatDate(m.date)}` : ''}</figcaption>
                    </figure>
                  )
                })}
              </div>
            </Block>
          )}

          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={display} />
        </motion.div>
      )}
    </div>
  )
}

/* Xəritənin mərkəzində nazik nişan xaçı */
function Crosshair() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 44, height: 44, transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#FFFFFF' }} />
      <span style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#FFFFFF' }} />
      <span style={{ position: 'absolute', left: '50%', top: '50%', width: 10, height: 10, transform: 'translate(-50%,-50%)', border: '1px solid #FFFFFF', background: '#000000' }} />
    </span>
  )
}
