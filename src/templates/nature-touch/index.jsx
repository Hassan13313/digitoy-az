import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../_shared/MapSection'
import { EmblemSlot } from '../_shared/MonoContent'
import { parseLatLon } from '../_shared/geo'
import { Reveal, PopDigit, enterDirection } from '../_shared/motion'
import { hidePhoto } from '../../utils/photoGallery'
import { getTemplateTheme } from '../templateConfig'
import { useInvitation, useGate, openingNames, seatInputProps, rsvpInputProps, rsvpOptions, rsvpState, alpha } from '../_shared/useInvitation'
import { MusicFab, EqBars, SeatSuggest, RsvpSuggest, RsvpStatus, StoryBlock, InvitationEnd } from '../_shared/invitationKit'
import { frond, leafPath, branch, contours, dms, LINEN_URI, PAPER_URI } from './specimen'

/* ─────────────────────────────────────────────────────────────────────────────
   NATURE TOUCH — «Herbari» (premium redizayn, 2026-10)

   Konsept: botanika muzeyinin herbari qovluğu. Açılış — yaşıl cild parçalı
   qovluq, üstündə yapışdırılmış kağız etiket və kəndir düyünü. Toxunanda
   kəndir açılır, qapaq kitab kimi sola çevrilir. İçəridə:
     hero      → herbari vərəqi: preslənmiş qıjı, kağız lentlər, rəng şkalası
                 və muzey etiketi (adlar · tarix · saat · məkan)
     sayğac    → herbari vərəqinin miqyas xətkeşi
     məkan     → «tapıntı yeri»: topoqrafik izoxətlər, koordinat
     proqram   → botanika lövhəsi: budaqda nömrəli yarpaqlar + izah cədvəli
     masa      → toxum paketi
     RSVP      → arxiv kartoteka kartı
     xeyir-dua → nümunələrə bağlanan kraft etiketlər
   Rəng: pambıq kağız, meşə mürəkkəbi, mamır, terrakota, kraft.
   Şriftlər: Vollkorn (kitab serifi) · Geologica (etiket qroteski).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('nature-touch')
const ID = 'nature-touch'

const LABELS = {
  countdown: { title: { az: 'Görüşə qədər', en: 'Until we meet', ru: 'До встречи' } },
  venue:     { title: { az: 'Tapıntı yeri', en: 'Place of finding', ru: 'Место находки' } },
  program:   { title: { az: 'Günün lövhəsi', en: 'Plate of the day', ru: 'Таблица дня' } },
  dresscode: { title: { az: 'Geyim', en: 'Attire', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Sizin yeriniz', en: 'Your place', ru: 'Ваше место' } },
  gallery:   { title: { az: 'Sahə fotoları', en: 'Field photographs', ru: 'Полевые снимки' } },
  rsvp:      { title: { az: 'Cavab kartı', en: 'Reply card', ru: 'Карточка ответа' } },
  guestbook: { title: { az: 'Xoş sözlər', en: 'Kind words', ru: 'Тёплые слова' } },
}

const SHEET_LABELS = {
  az: { names: 'Adlar', name: 'Ad', event: 'Tədbir', date: 'Tarix', time: 'Saat', place: 'Məkan', plate: 'Lövhə', table: 'Masa', scale: 'gün · saat · dəqiqə · saniyə' },
  en: { names: 'Names', name: 'Name', event: 'Event', date: 'Date', time: 'Time', place: 'Place', plate: 'Plate', table: 'Table', scale: 'days · hours · minutes · seconds' },
  ru: { names: 'Имена', name: 'Имя', event: 'Событие', date: 'Дата', time: 'Время', place: 'Место', plate: 'Таблица', table: 'Стол', scale: 'дни · часы · минуты · секунды' },
}

const PAPER = '#F6F2E7'
const LINEN = '#E8E2D3'
const INK = '#2F3A2C'
const MOSS = '#5C6B4C'
const SAGE = '#93A07E'
const TERRA = '#9A5530'
const KRAFT = '#CDAE7C'
const COVER = '#34432F'
const TWINE = '#C9A46A'
const TAPE = 'rgba(238,231,212,.86)'

const FERN = frond({ len: 300, pairs: 15, bend: 0.14, maxPinna: 62 })
const SPRIG = frond({ len: 130, pairs: 8, bend: -0.2, maxPinna: 26 })

const KEYFRAMES = `
@keyframes nt-rise { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
@keyframes nt-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes nt-tie  { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
@keyframes nt-press { from { opacity: 0; transform: scale(1.04) } to { opacity: 1; transform: none } }
@keyframes nt-hint { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
[data-nt] span[aria-hidden="true"], [data-nt] svg[aria-hidden="true"], [data-nt] div[aria-hidden="true"] { pointer-events: none; }
[data-nt] ::placeholder { color: rgba(47,58,44,.42); }
[data-nt] input:focus-visible, [data-nt] textarea:focus-visible { border-color: ${INK} !important; outline: none; background: #FFFDF6 !important; }
[data-nt] button:focus-visible, [data-nt] a:focus-visible, [data-nt] [role="button"]:focus-visible { outline: 1.5px solid ${INK}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-nt] *, [data-nt] { animation: none !important; transition: none !important; } }
`

/* ─── Kiçik detallar ─── */
function Specimen({ data, color, stroke = '#4E5A3A', style }) {
  return (
    <g style={style}>
      <path d={data.rachis} fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
      {data.pinnae.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.a})`}>
          <path d={p.d} fill={color || p.c} fillOpacity=".9" stroke={stroke} strokeOpacity=".45" strokeWidth=".5" />
          <path d={`M0 0L${p.len * 0.92} 0`} stroke={stroke} strokeOpacity=".35" strokeWidth=".4" />
        </g>
      ))}
    </g>
  )
}

function Tape({ style }) {
  return <span aria-hidden="true" style={{ position: 'absolute', width: 56, height: 18, background: TAPE, boxShadow: '0 1px 2px rgba(60,50,30,.12)', clipPath: 'polygon(2% 8%, 98% 0, 100% 92%, 0 100%)', ...style }} />
}

function LeafMark({ size = 26, color = MOSS }) {
  return (
    <svg viewBox="-2 -16 44 32" width={size} height={size * 0.73} aria-hidden="true" style={{ display: 'block' }}>
      <path d={leafPath(40, 9)} fill={color} fillOpacity=".85" />
      <path d="M0 0L38 0" stroke={PAPER} strokeOpacity=".6" strokeWidth=".8" />
      {[8, 16, 24, 31].map((x) => <path key={x} d={`M${x} 0l5 -4M${x} 0l5 4`} stroke={PAPER} strokeOpacity=".45" strokeWidth=".6" />)}
    </svg>
  )
}

/* Kəndir düyünü */
function TwineBow({ width = 320 }) {
  const loop = 'M0 0C-30 -26 -52 -6 -40 6C-30 16 -12 6 0 0'
  const tails = ['M0 0C-6 16 -16 32 -26 48', 'M0 0C6 18 12 32 24 46']
  return (
    <svg viewBox={`${-width / 2} -40 ${width} 100`} width="100%" height="100" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <path d={`M${-width / 2 - 40} 0H${width / 2 + 40}`} stroke={TWINE} strokeWidth="2.6" />
      <path d={`M${-width / 2 - 40} 0H${width / 2 + 40}`} stroke="#7E6036" strokeWidth="2.6" strokeDasharray="1.6 2.4" strokeOpacity=".45" />
      {[loop, `${loop}`].map((d, i) => (
        <g key={i} transform={i ? 'scale(-1 1)' : undefined}>
          <path d={d} fill="none" stroke={TWINE} strokeWidth="2.4" />
          <path d={d} fill="none" stroke="#7E6036" strokeWidth="2.4" strokeDasharray="1.6 2.4" strokeOpacity=".45" />
        </g>
      ))}
      {tails.map((d) => (
        <g key={d}>
          <path d={d} fill="none" stroke={TWINE} strokeWidth="2.4" strokeLinecap="round" />
          <path d={d} fill="none" stroke="#7E6036" strokeWidth="2.4" strokeDasharray="1.6 2.4" strokeOpacity=".45" />
        </g>
      ))}
      <ellipse rx="5" ry="4" fill={TWINE} stroke="#7E6036" strokeOpacity=".5" />
    </svg>
  )
}

/* ═══ 01 — AÇILIŞ: herbari qovluğu ═══ */
function FolioOpening({ inv, theme }) {
  const { ot } = inv
  const gate = useGate({ inv, ms: 1500 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const serif = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-nt
      animate={gate.opening ? { opacity: 0 } : {}}
      transition={{ duration: 0.4, delay: 1.1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden', perspective: 1600,
        backgroundColor: PAPER, backgroundImage: PAPER_URI, color: INK, fontFamily: theme.fonts.body,
      }}>
      {/* altdakı vərəq — qapaq açılanda görünür */}
      <svg viewBox="-160 -330 320 360" preserveAspectRatio="xMidYMax meet" aria-hidden="true" style={{ position: 'absolute', left: '10%', right: '10%', bottom: '8%', width: '80%', height: '70%', opacity: 0.9 }}>
        <Specimen data={FERN} />
      </svg>

      {/* qapaq */}
      <motion.div
        animate={gate.opening ? { rotateY: -112 } : {}}
        transition={{ duration: 1.0, ease: [0.6, 0, 0.3, 1], delay: 0.35 }}
        style={{
          position: 'absolute', inset: 0, transformOrigin: 'left center', backfaceVisibility: 'hidden',
          backgroundColor: COVER, backgroundImage: `${LINEN_URI}, radial-gradient(120% 80% at 50% 40%, #3E4E38, #26311F)`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px',
          boxShadow: '12px 0 30px rgba(0,0,0,.25)',
        }}>
        <span aria-hidden="true" style={{ position: 'absolute', inset: 16, border: '1px solid rgba(0,0,0,.28)', boxShadow: '1px 1px 0 rgba(255,255,255,.07), inset 1px 1px 0 rgba(255,255,255,.06)', borderRadius: 3, pointerEvents: 'none' }} />
        {/* yapışdırılmış etiket */}
        <div style={{
          position: 'relative', width: 'min(82vw, 320px)', padding: '26px 22px 24px', textAlign: 'center',
          backgroundColor: '#EFE8D5', backgroundImage: PAPER_URI, color: INK,
          boxShadow: '0 1px 0 rgba(255,255,255,.4) inset, 0 10px 24px -10px rgba(0,0,0,.5)',
          outline: `1px solid ${alpha(INK, 0.55)}`, outlineOffset: -8,
          animation: 'nt-press 1.1s cubic-bezier(.2,.8,.2,1) .3s both',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', animation: 'nt-fade 1s ease-out .9s both' }}>
            <EmblemSlot mono={ot.mono} size={58} border={`1px solid ${alpha(INK, 0.4)}`} background={PAPER} color={INK} font={serif} style={{ animation: 'none' }}>
              <LeafMark size={44} />
            </EmblemSlot>
          </div>
          {titleOv !== '' && (
            <div style={{ marginTop: 14, fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(28px, 9vw, 36px)', lineHeight: 1.15, animation: 'nt-rise 1s ease-out 1.1s both' }}>
              {first}{second && <><span style={{ fontStyle: 'normal', fontSize: '.6em', color: TERRA, margin: '0 .3em' }}>&amp;</span>{second}</>}
            </div>
          )}
          <div aria-hidden="true" style={{ width: 40, height: 1, background: alpha(INK, 0.4), margin: '14px auto 12px' }} />
          {ot.show('meta') && <div style={{ fontSize: 13.5, letterSpacing: '.04em', color: MOSS, animation: 'nt-rise .9s ease-out 1.4s both' }}>{ot.text('meta')}</div>}
        </div>
        {/* kəndir */}
        <motion.div animate={gate.opening ? { opacity: 0, y: 30 } : {}} transition={{ duration: 0.35 }}
          style={{ width: '100%', marginTop: 26, animation: 'nt-fade 1s ease-out 1.6s both' }}>
          <TwineBow />
        </motion.div>
        {ot.show('cta') && (
          <div style={{ marginTop: 6, minHeight: 48, padding: '12px 26px', display: 'inline-flex', alignItems: 'center', background: '#EFE8D5', color: INK, fontSize: 15, borderRadius: 2, boxShadow: '0 6px 14px -6px rgba(0,0,0,.5)', animation: 'nt-rise .9s ease-out 2s both' }}>
            {ot.text('cta')}
          </div>
        )}
        {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 13, color: '#C9CFB8', animation: 'nt-fade .8s ease-out 2.4s both, nt-hint 3s ease-in-out 3.2s infinite' }}>{ot.text('hint')}</div>}
      </motion.div>
    </motion.div>
  )
}

/* Bölmə başlığı — yarpaq + kursiv başlıq + etiket qroteski */
function Sheet({ id, section, title, kicker, sub, children, serif, bg }) {
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '58px 20px 62px', background: bg }}>
      <Reveal style={{ maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><LeafMark size={24} color={SAGE} /></div>
            {title && <h2 style={{ margin: 0, fontFamily: serif, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(30px, 8.6vw, 38px)', lineHeight: 1.12, color: INK, textWrap: 'balance' }}>{title}</h2>}
            {kicker && <div style={{ marginTop: 8, fontSize: 14, color: MOSS }}>{kicker}</div>}
            {sub && <p style={{ margin: '8px auto 0', maxWidth: 320, fontSize: 15.5, color: MOSS, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = {
  width: '100%', background: 'rgba(255,253,246,.7)', border: 'none', borderBottom: `1px solid ${alpha(INK, 0.45)}`,
  borderRadius: 0, padding: '14px 4px', fontSize: 16.5, color: INK, outline: 'none',
}
const btn = (on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, padding: '12px 22px', borderRadius: 2,
  fontSize: 15, textDecoration: 'none', cursor: 'pointer',
  background: on ? INK : 'transparent', color: on ? PAPER : INK, border: `1px solid ${INK}`,
})

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function NatureTouchTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const { theme, tr, L, K, S, cd, timeline, seating, rsvp, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const serif = theme.fonts.heading
  const sans = theme.fonts.body
  const SL = SHEET_LABELS[lang] || SHEET_LABELS.az

  const ll = parseLatLon(weddingData)
  const coords = ll ? `${dms(ll[0], 'N', 'S')}  ${dms(ll[1], 'E', 'W')}` : ''
  const accession = String(weddingData.date || '').replace(/-/g, '').slice(2)
  const plate = branch(timeline.events.length, 300, 70 + timeline.events.length * 46)
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][Math.min(11, Math.max(0, Number(String(weddingData.date || '').split('-')[1]) - 1 || 0))]

  return (
    <div data-nt data-enter={enterDirection(ID)} style={{
      backgroundColor: LINEN, backgroundImage: PAPER_URI,
      minHeight: '100vh', fontFamily: sans, color: INK, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
      fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(MOSS, 0.25),
    }}>
      <style>{KEYFRAMES}</style>
      {!inv.opened && <FolioOpening inv={inv} theme={theme} />}

      <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: '50%', background: PAPER, border: `1px solid ${alpha(INK, 0.3)}`, boxShadow: '0 6px 16px rgba(47,58,44,.18)' }}>
        {({ playing }) => <EqBars playing={playing} color={INK} idle={alpha(INK, 0.3)} />}
      </MusicFab>

      {inv.opened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1 }}>
          <header style={{
            position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: alpha(LINEN, 0.9), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(INK, 0.12)}`,
          }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: MOSS, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: sans }}>
              <span aria-hidden="true">←</span>{tr.btn_back}
            </button>
            <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 18 }}>Digitoy</div>
            <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
          </header>

          {/* HERO — herbari vərəqi */}
          <section style={{ padding: '26px 16px 30px' }}>
            <div style={{ position: 'relative', maxWidth: 440, margin: '0 auto', padding: '18px 18px 20px', backgroundColor: PAPER, backgroundImage: PAPER_URI, boxShadow: '0 1px 0 #fff inset, 0 24px 40px -26px rgba(47,58,44,.45), 0 2px 6px rgba(47,58,44,.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 11.5, letterSpacing: '.18em', textTransform: 'uppercase', color: MOSS }}>
                <span>Herbarium</span><span style={{ letterSpacing: '.08em' }}>№ {accession}</span>
              </div>
              <div style={{ position: 'relative', height: 'min(96vw, 400px)', marginTop: 6 }}>
                <svg viewBox="-150 -330 300 340" width="100%" height="100%" aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                  <g transform="rotate(14) translate(-10 0)"><Specimen data={FERN} /></g>
                  <g transform="translate(-92 -6) rotate(-28)"><Specimen data={SPRIG} /></g>
                </svg>
                <Tape style={{ left: '44%', bottom: '4%', transform: 'rotate(-6deg)' }} />
                <Tape style={{ left: '58%', top: '38%', width: 44, transform: 'rotate(18deg)' }} />
                <Tape style={{ left: '16%', bottom: '16%', width: 38, transform: 'rotate(-30deg)' }} />
              </div>
              {/* rəng şkalası + miqyas */}
              <div aria-hidden="true" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10, marginTop: 8 }}>
                <div style={{ display: 'flex' }}>
                  {[INK, MOSS, SAGE, '#C9C3A2', KRAFT, TERRA].map((c) => <span key={c} style={{ width: 14, height: 14, background: c }} />)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', border: `1px solid ${INK}` }}>
                    {[0, 1, 2, 3, 4].map((k) => <span key={k} style={{ width: 14, height: 5, background: k % 2 ? PAPER : INK }} />)}
                  </div>
                  <span style={{ fontSize: 9.5, marginTop: 2, color: MOSS }}>0 — 5 cm</span>
                </div>
              </div>
              {/* muzey etiketi */}
              <div style={{ marginTop: 14, padding: '16px 16px 14px', border: `1px solid ${INK}`, outline: `1px solid ${alpha(INK, 0.5)}`, outlineOffset: -5, background: '#FBF8EF' }}>
                <div style={{ fontSize: 13.5, color: TERRA }}>{L('hero', 'kicker', inv.eventLabel)}</div>
                <h1 style={{ margin: '6px 0 0', fontFamily: serif, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(32px, 10vw, 44px)', lineHeight: 1.08, textWrap: 'balance' }}>
                  {inv.heroTitle ? inv.heroTitle : inv.isCouple ? <>{inv.groom} <span style={{ fontStyle: 'normal', fontSize: '.6em', color: TERRA }}>&amp;</span> {inv.bride}</> : inv.single}
                </h1>
                <dl style={{ margin: '14px 0 0', display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 14, rowGap: 6, fontSize: 15 }}>
                  {[
                    [SL.date, inv.fullDate],
                    [SL.time, inv.time],
                    [SL.place, weddingData.venueName],
                    inv.isCorp && weddingData.organizer?.trim() ? [tr.organizer_display, weddingData.organizer] : null,
                  ].filter((r) => r && r[1]).map(([k, v]) => (
                    <div key={k} style={{ display: 'contents' }}>
                      <dt style={{ fontSize: 12.5, color: MOSS, paddingTop: 2 }}>{k}</dt>
                      <dd style={{ margin: 0, borderBottom: `1px dotted ${alpha(INK, 0.35)}`, paddingBottom: 3, fontFamily: serif }}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <p style={{ margin: '24px auto 0', maxWidth: 320, textAlign: 'center', fontFamily: serif, fontStyle: 'italic', fontSize: 17.5, lineHeight: 1.55, color: MOSS }}>{tr.inv_join}</p>
          </section>

          {/* SAYĞAC — miqyas xətkeşi */}
          {S.countdown && (
            <Sheet serif={serif} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
              <div style={{ maxWidth: 380, margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                  {[
                    { v: cd.days, l: cd.labels.days },
                    { v: cd.hours, l: cd.labels.hours },
                    { v: cd.minutes, l: cd.labels.minutes },
                    { v: cd.seconds, l: cd.labels.seconds, pop: true },
                  ].map(({ v, l, pop }) => (
                    <div key={l} style={{ textAlign: 'left', paddingLeft: 6 }}>
                      <div style={{ fontFamily: serif, fontSize: 'clamp(32px, 9.4vw, 42px)', lineHeight: 1, color: pop ? TERRA : INK, fontVariantNumeric: 'tabular-nums' }}><PopDigit value={v} pop={pop} /></div>
                    </div>
                  ))}
                </div>
                <div aria-hidden="true" style={{ position: 'relative', marginTop: 10, height: 26 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', border: `1.5px solid ${INK}`, height: 12 }}>
                    {[0, 1, 2, 3].map((k) => <span key={k} style={{ background: k % 2 ? PAPER : INK }} />)}
                  </div>
                  <div style={{ position: 'absolute', left: 0, right: 0, top: 12, height: 10, backgroundImage: `repeating-linear-gradient(90deg, ${INK} 0 1px, transparent 1px 100%)`, backgroundSize: '5% 100%', opacity: 0.5 }} />
                  <div style={{ position: 'absolute', left: 0, right: 0, top: 12, height: 14, backgroundImage: `repeating-linear-gradient(90deg, ${INK} 0 1.5px, transparent 1.5px 100%)`, backgroundSize: '25% 100%' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', marginTop: 4 }}>
                  {[cd.labels.days, cd.labels.hours, cd.labels.minutes, cd.labels.seconds].map((l) => <div key={l} style={{ paddingLeft: 6, fontSize: 13, color: MOSS }}>{l}</div>)}
                </div>
              </div>
            </Sheet>
          )}

          <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

          {/* MƏKAN — topoqrafik xəritə */}
          {S.venue && (
            <Sheet serif={serif} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
              <div style={{ position: 'relative', background: PAPER, padding: 10, boxShadow: '0 18px 30px -22px rgba(47,58,44,.45)' }}>
                <div style={{ position: 'relative', overflow: 'hidden', border: `1px solid ${alpha(INK, 0.6)}` }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={TERRA} height="clamp(230px, 64vw, 300px)"
                    map={{ opacity: 0.75, filter: 'grayscale(1) sepia(.35) contrast(.95) brightness(1.05)', tintOpacity: 0.18, tint: SAGE, blend: 'multiply' }}
                    frame={<FindPin />}
                    fallback={<Topo height="clamp(230px, 64vw, 300px)" />}
                  />
                </div>
                {coords && <div style={{ position: 'absolute', left: 18, bottom: 18, padding: '4px 8px', background: alpha(PAPER, 0.92), fontSize: 12, letterSpacing: '.06em', color: INK }}>{coords}</div>}
              </div>
              <div style={{ textAlign: 'center', marginTop: 22, fontFamily: serif, fontSize: 25, lineHeight: 1.25 }}>{weddingData.venueName}</div>
              {weddingData.venueNote && <div style={{ textAlign: 'center', marginTop: 4, fontSize: 15, color: MOSS }}>{weddingData.venueNote}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={btn(true)}>{tr.inv_directions_btn}</a>}
                {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={btn(!inv.dirUrl)}>Maps</a>}
                {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Waze</a>}
                {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Apple</a>}
              </div>
            </Sheet>
          )}

          {/* PROQRAM — botanika lövhəsi */}
          {S.program && (
            <Sheet serif={serif} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
              <div style={{ background: PAPER, padding: '18px 18px 22px', boxShadow: '0 18px 30px -22px rgba(47,58,44,.45)' }}>
                <svg viewBox={`0 0 300 ${70 + timeline.events.length * 46}`} width="100%" aria-hidden="true" style={{ display: 'block', maxWidth: 320, margin: '0 auto', overflow: 'visible' }}>
                  <path d={plate.stem} fill="none" stroke="#5A4A2E" strokeWidth="2" strokeLinecap="round" />
                  {plate.leaves.map((lf, i) => (
                    <g key={i}>
                      <g transform={`translate(${lf.x} ${lf.y}) rotate(${lf.a})`}>
                        <path d={lf.d} fill={['#6E7E52', '#7A8659', '#66744B'][i % 3]} stroke="#4E5A3A" strokeOpacity=".5" strokeWidth=".6" />
                        <path d={`M0 0L${lf.len * 0.94} 0`} stroke={PAPER} strokeOpacity=".45" strokeWidth=".7" />
                      </g>
                      <text x={lf.tip[0]} y={lf.tip[1] + 4} textAnchor="middle" fontFamily={serif} fontStyle="italic" fontSize="15" fill={TERRA}>{i + 1}</text>
                    </g>
                  ))}
                </svg>
                <div style={{ textAlign: 'center', marginTop: 6, fontSize: 12, letterSpacing: '.14em', color: MOSS }}>{SL.plate} {roman}</div>
                <ol style={{ listStyle: 'none', margin: '18px 0 0', padding: 0, borderTop: `1px solid ${INK}` }}>
                  {timeline.events.map((ev, i) => (
                    <li key={i} style={{ display: 'grid', gridTemplateColumns: '28px 54px 1fr', alignItems: 'baseline', gap: 8, padding: '11px 0', borderBottom: `1px solid ${alpha(INK, 0.16)}` }}>
                      <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 17, color: TERRA }}>{i + 1}</span>
                      <span style={{ fontSize: 14, color: MOSS, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</span>
                      <span style={{ fontFamily: serif, fontSize: 17.5, lineHeight: 1.35, minWidth: 0 }}>{ev.label}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Sheet>
          )}

          {S.dresscode && (
            <Sheet serif={serif} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
              <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={serif} align="center" />
            </Sheet>
          )}

          {/* MASA — toxum paketi */}
          {S.seating && !seating.isEmpty && (
            <Sheet serif={serif} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
              <input {...seatInputProps(inv, 'nt-seat-list')} style={field} />
              <SeatSuggest inv={inv} id="nt-seat-list" c={{ bg: PAPER, border: `1px solid ${alpha(INK, 0.25)}`, active: alpha(MOSS, 0.1), text: INK, table: TERRA, radius: 2, font: sans }} />
              {seating.showNotFound && <div style={{ marginTop: 12, fontSize: 14.5, color: MOSS, textAlign: 'center' }}>{tr.inv_seat_fullname}</div>}
              {seating.selected && (
                <div style={{ position: 'relative', maxWidth: 270, margin: '30px auto 0', background: KRAFT, padding: '54px 20px 22px', textAlign: 'center', boxShadow: '0 20px 30px -20px rgba(70,50,20,.55)', animation: 'nt-rise .7s ease-out both' }}>
                  <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 46, background: '#B8955E', clipPath: 'polygon(0 0, 100% 0, 100% 55%, 50% 100%, 0 55%)' }} />
                  <div style={{ position: 'relative', background: '#FBF8EF', padding: '16px 14px', outline: `1px solid ${alpha(INK, 0.5)}`, outlineOffset: -5 }}>
                    <div style={{ fontSize: 14.5, color: MOSS }}>{seating.selected.full_name}</div>
                    <div style={{ marginTop: 4, fontSize: 12.5, letterSpacing: '.14em', color: TERRA }}>{SL.table}</div>
                    <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 58, lineHeight: 1 }}>{seating.selected.table_id}</div>
                  </div>
                  {seating.tablemates.length > 0 && <div style={{ marginTop: 14, fontSize: 14.5, color: '#3E3220', lineHeight: 1.55 }}>{seating.tablemates.map((g) => g.full_name).join(', ')}</div>}
                  <button onClick={seating.reset} data-press style={{ marginTop: 8, background: 'none', border: 'none', color: '#3E3220', fontSize: 14.5, minHeight: 44, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: sans }}>
                    {seatingL.again || 'Yenidən axtar'}
                  </button>
                </div>
              )}
            </Sheet>
          )}

          {/* FOTOLAR — lentlə yapışdırılmış sahə fotoları */}
          {S.gallery && (
            <Sheet id="gallery-section" serif={serif} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
              {gallery.demoPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 30 }}>
                  {gallery.demoPhotos.map((url, i) => (
                    <div key={i} style={{ position: 'relative', padding: 5, background: '#FFFDF6', boxShadow: '0 6px 12px -6px rgba(47,58,44,.35)', transform: `rotate(${[-2, 1.5, -1, 2, -1.5, 1][i % 6]}deg)` }}>
                      <div style={{ aspectRatio: '1', background: alpha(SAGE, 0.25) }}>
                        <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'sepia(.12)' }} />
                      </div>
                      <Tape style={{ left: '50%', top: -8, width: 36, height: 14, marginLeft: -18, transform: `rotate(${i % 2 ? 4 : -5}deg)` }} />
                    </div>
                  ))}
                </div>
              )}
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: 12, background: '#FFFDF6', boxShadow: '0 10px 20px -12px rgba(47,58,44,.4)' }}>
                  <QRCodeSVG value={gallery.photoShareUrl} size={128} bgColor="#FFFDF6" fgColor={INK} level="M" />
                </div>
                <div style={{ marginTop: 12, fontSize: 14, color: MOSS }}>{tr.inv_scan_upload}</div>
                <a data-press href={gallery.photoShareUrl} style={{ ...btn(true), marginTop: 16 }}>{tr.inv_gallery_btn}</a>
                <p style={{ margin: '16px auto 0', maxWidth: 340, fontSize: 15, color: MOSS, lineHeight: 1.65 }}>{tr.inv_gallery_desc}</p>
              </div>
            </Sheet>
          )}

          {/* RSVP — kartoteka kartı */}
          {S.rsvp && (
            <Sheet serif={serif} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
              <div style={{
                position: 'relative', padding: '50px 22px 24px', background: '#FCFAF3',
                backgroundImage: 'linear-gradient(transparent 39px, rgba(178,74,60,.55) 39px, rgba(178,74,60,.55) 40px, transparent 40px), repeating-linear-gradient(transparent 0 31px, rgba(70,110,150,.18) 31px 32px)',
                backgroundPosition: '0 0, 0 40px', backgroundSize: '100% 100%, 100% 32px', backgroundRepeat: 'no-repeat, repeat',
                boxShadow: '0 1px 0 #fff inset, 0 24px 40px -26px rgba(47,58,44,.5), 0 2px 5px rgba(47,58,44,.08)', borderRadius: 3,
              }}>
                <div style={{ position: 'absolute', top: 12, left: 22, right: 22, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: MOSS }}>
                  <span>{L('rsvp', 'title', rsvpL.title)}</span><span>№ {accession}</span>
                </div>
                <span aria-hidden="true" style={{ position: 'absolute', left: '50%', bottom: 10, width: 14, height: 14, marginLeft: -7, borderRadius: '50%', background: LINEN, boxShadow: 'inset 0 1px 2px rgba(0,0,0,.2)' }} />
                <RsvpStatus inv={inv} render={({ title, sub }) => (
                  <div style={{ padding: '10px 0 18px' }}>
                    <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 25, lineHeight: 1.3 }}>{title}</div>
                    {sub && <div style={{ marginTop: 6, fontSize: 15, color: MOSS }}>{sub}</div>}
                  </div>
                )} />
                {rsvpState(rsvp) === 'form' && (
                  <form onSubmit={rsvp.handleSubmit} style={{ paddingBottom: 14 }}>
                    <input {...rsvpInputProps(inv)} style={{ ...field, background: 'transparent', fontFamily: serif, fontSize: 18 }} />
                    <RsvpSuggest inv={inv} c={{ bg: '#FCFAF3', border: `1px solid ${alpha(INK, 0.25)}`, active: alpha(MOSS, 0.1), text: INK, table: TERRA, radius: 2, font: sans }} />
                    {rsvp.showNotFound && <div style={{ marginTop: 8, fontSize: 13.5, color: TERRA }}>{rsvpL.not_in_list}</div>}
                    <div role="radiogroup" aria-label={L('rsvp', 'title', rsvpL.title)} style={{ display: 'grid', marginTop: 12 }}>
                      {rsvpOptions(inv).map(({ val, label }) => {
                        const active = rsvp.status === val
                        return (
                          <button key={val} type="button" role="radio" aria-checked={active} onClick={() => rsvp.chooseStatus(val)} data-press style={{
                            display: 'flex', alignItems: 'center', gap: 12, minHeight: 48, padding: 0, background: 'none', border: 'none',
                            cursor: 'pointer', color: INK, fontFamily: serif, fontSize: 18, textAlign: 'left',
                          }}>
                            <span aria-hidden="true" style={{ width: 20, height: 20, flex: 'none', border: `1.5px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, lineHeight: 1, color: TERRA, fontFamily: sans }}>{active ? '✕' : ''}</span>
                            {label}
                          </button>
                        )
                      })}
                    </div>
                    {rsvp.status === 'yes' && (
                      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 15, color: MOSS }}>{rsvpL.plusq}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button type="button" onClick={rsvp.decPlusOne} disabled={rsvp.plusOne === 0} data-press aria-label="Azalt" style={{ width: 44, height: 44, border: `1px solid ${INK}`, borderRadius: 2, background: 'transparent', color: INK, fontSize: 19, cursor: 'pointer', opacity: rsvp.plusOne === 0 ? 0.35 : 1 }}>−</button>
                          <span style={{ width: 32, textAlign: 'center', fontFamily: serif, fontSize: 26 }}>{rsvp.plusOne}</span>
                          <button type="button" onClick={rsvp.incPlusOne} disabled={rsvp.plusOne === rsvp.maxExtraGuests} data-press aria-label="Artır" style={{ width: 44, height: 44, border: `1px solid ${INK}`, borderRadius: 2, background: 'transparent', color: INK, fontSize: 19, cursor: 'pointer', opacity: rsvp.plusOne === rsvp.maxExtraGuests ? 0.35 : 1 }}>+</button>
                        </div>
                      </div>
                    )}
                    <button type="submit" disabled={!rsvp.canSubmit} data-press style={{
                      ...btn(true), width: '100%', marginTop: 20, minHeight: 52, fontSize: 16,
                      opacity: rsvp.canSubmit ? 1 : 0.4, cursor: rsvp.canSubmit ? 'pointer' : 'not-allowed',
                    }}>
                      {rsvp.sending ? '…' : rsvpL.send}
                    </button>
                  </form>
                )}
              </div>
            </Sheet>
          )}

          {/* XOŞ SÖZLƏR — kraft etiketlər */}
          {S.guestbook && (
            <Sheet serif={serif} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
              <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 34 }}>
                <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={field} />
                <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...field, resize: 'none', lineHeight: 1.5 }} />
                <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...btn(gbook.canSubmit), width: '100%', marginTop: 6, opacity: gbook.canSubmit ? 1 : 0.45, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}>
                  {gbook.sending ? gbookL.sending : gbookL.btn}
                </button>
                {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 13.5, color: TERRA }}>⚠ {gbookL.error}</p>}
              </form>
              <div style={{ display: 'grid', gap: 16 }}>
                {gbook.messages.map((raw, i) => {
                  const m = gbook.readMessage(raw)
                  return (
                    <figure key={m.name + i} style={{ position: 'relative', margin: 0, marginLeft: i % 2 ? 22 : 10, marginRight: i % 2 ? 0 : 12, transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)` }}>
                      <span aria-hidden="true" style={{ position: 'absolute', left: -24, top: 26, width: 40, height: 2, background: TWINE, transform: 'rotate(-12deg)', transformOrigin: 'right center' }} />
                      <div style={{
                        position: 'relative', padding: '16px 18px 14px 40px', background: KRAFT, color: '#2E2615',
                        clipPath: 'polygon(18px 0, 100% 0, 100% 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)',
                        boxShadow: 'inset 0 0 0 1px rgba(80,55,20,.12)',
                      }}>
                        <span aria-hidden="true" style={{ position: 'absolute', left: 13, top: 22, width: 11, height: 11, borderRadius: '50%', background: LINEN, boxShadow: `0 0 0 2px #B8955E` }} />
                        <blockquote style={{ margin: 0, fontFamily: serif, fontStyle: 'italic', fontSize: 17.5, lineHeight: 1.5 }}>{m.text}</blockquote>
                        <figcaption style={{ marginTop: 8, fontSize: 13, color: '#5A4626' }}>{m.name}{m.date ? `, ${gbook.formatDate(m.date)}` : ''}</figcaption>
                      </div>
                    </figure>
                  )
                })}
              </div>
            </Sheet>
          )}

          <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={serif} />
        </motion.div>
      )}
    </div>
  )
}

const TOPO = contours(150, 110, 10, 13, 4)

function Topo({ height }) {
  return (
    <div style={{ height, position: 'relative', background: '#F1EDDF' }}>
      <svg viewBox="0 0 300 220" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        {TOPO.map((d, i) => <path key={i} d={d} fill="none" stroke={i % 5 === 4 ? '#8A6A44' : '#A88B63'} strokeOpacity={i % 5 === 4 ? 0.7 : 0.45} strokeWidth={i % 5 === 4 ? 1.1 : 0.6} />)}
        <path d="M0 180C60 160 90 200 150 186S250 150 300 168" fill="none" stroke="#7FA3B8" strokeOpacity=".6" strokeWidth="2" />
      </svg>
      <FindPin />
    </div>
  )
}

function FindPin() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
      <svg width="34" height="34" viewBox="-17 -17 34 34" style={{ position: 'absolute', left: -17, top: -17 }}>
        <circle r="13" fill="none" stroke={TERRA} strokeWidth="1.2" />
        <path d="M-17 0H-7M7 0H17M0 -17V-7M0 7V17" stroke={TERRA} strokeWidth="1.2" />
        <circle r="2.6" fill={TERRA} />
      </svg>
    </span>
  )
}
