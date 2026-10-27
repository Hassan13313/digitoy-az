import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapSection from '../_shared/MapSection'
import { Reveal, enterDirection } from '../_shared/motion'
import { hidePhoto } from '../../utils/photoGallery'
import { getTemplateTheme } from '../templateConfig'
import { useInvitation, useGate, openingNames, seatInputProps, alpha } from '../_shared/useInvitation'
import { MusicFab, EqBars, SeatSuggest, StoryBlock, InvitationEnd, ReplyForm } from '../_shared/invitationKit'
import { PaletteContext, usePalette, resolvePalette, scaleFont } from '../_shared/palette'

/* ─────────────────────────────────────────────────────────────────────────────
   BOARDING PASS — «Birinci sinif» (premium redizayn, 2026-10)

   Konsept: reaktiv əsrin birinci sinif səyahəti. Açılış — hava limanının
   mexaniki «split-flap» uçuş lövhəsi: hərflər fırlanaraq adlara, tarixə və
   saata düzülür. Daxildə:
     hero      → qalın fil sümüyü kartonda mətbəə üsulu ilə basılmış minik
                 talonu: mis folqa gerb, marşrut, perforasiya, qoparma talonu
     sayğac    → split-flap rəqəmləri
     məkan     → təyinat: xəritə üzərində uçuş qövsü
     proqram   → uçuş lövhəsi cədvəli (saat · hadisə · status)
     masa      → oturacaq talonu
     RSVP      → check-in
     arzular   → «Par Avion» hava poçtu kartları
   Rəng: gecə göyü, fil sümüyü karton, mis, hava poçtu qırmızı-göy.
   Şriftlər: Oswald (lövhə) · IBM Plex Sans (mətn) · IBM Plex Mono (kodlar).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = getTemplateTheme('boarding-pass')
const ID = 'boarding-pass'

const LABELS = {
  countdown: { title: { az: 'Uçuşa qalıb', en: 'Time to departure', ru: 'До вылета' } },
  venue:     { title: { az: 'Təyinat', en: 'Destination', ru: 'Пункт назначения' } },
  program:   { title: { az: 'Uçuş planı', en: 'Flight plan', ru: 'План полёта' } },
  dresscode: { title: { az: 'Geyim', en: 'Dress code', ru: 'Дресс-код' } },
  seating:   { title: { az: 'Yeriniz', en: 'Your seat', ru: 'Ваше место' } },
  gallery:   { title: { az: 'Səyahət albomu', en: 'Travel album', ru: 'Альбом путешествия' } },
  rsvp:      { title: { az: 'Check-in', en: 'Check-in', ru: 'Регистрация' } },
  guestbook: { title: { az: 'Hava poçtu', en: 'Air mail', ru: 'Авиапочта' } },
}

const TXT = {
  az: { pax: 'Sərnişinlər', paxOne: 'Sərnişin', flight: 'Uçuş', date: 'Tarix', boarding: 'Minmə', place: 'Məkan', cls: 'Birinci sinif', table: 'Masa', status: 'Vaxtında', from: 'Bakı', gate: 'Qapı' },
  en: { pax: 'Passengers', paxOne: 'Passenger', flight: 'Flight', date: 'Date', boarding: 'Boarding', place: 'Venue', cls: 'First class', table: 'Table', status: 'On time', from: 'Baku', gate: 'Gate' },
  ru: { pax: 'Пассажиры', paxOne: 'Пассажир', flight: 'Рейс', date: 'Дата', boarding: 'Посадка', place: 'Место', cls: 'Первый класс', table: 'Стол', status: 'По расписанию', from: 'Баку', gate: 'Выход' },
}
const MONTHS = {
  az: ['YAN', 'FEV', 'MAR', 'APR', 'MAY', 'İYN', 'İYL', 'AVQ', 'SEN', 'OKT', 'NOY', 'DEK'],
  en: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
  ru: ['ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК'],
}
const POOL = 'ABCDEFGHIJKLMNOPRSTUVYZ0123456789'

const PAL = {
  NAVY: '#0E1B2E',
  NIGHT: '#08111E',
  IVORY: '#F4EFE4',
  INK: '#14243B',
  COPPER: '#B8743E',
  BRASS: '#D2A262',
  RED: '#C8412F',
  BLUE: '#2D4F8C',
  TILE: '#1A1F26',
  FLAP: '#F3EAD6',
  MUTED: '#9AA6B6',
}

/* Admin «Rəng» tabının token-i → bu palitranın açarları (bax _shared/palette.js).
   Override yoxdursa PAL olduğu kimi qalır. */
const LINKS = { primary: ['BRASS'], secondary: ['MUTED'], accent: ['COPPER'], background: ['NAVY', 'NIGHT'], text: ['IVORY'] }

const KEYFRAMES = (C) => `
@keyframes bp-flip { from { transform: scaleY(.15) translateY(-40%); opacity: .3 } to { transform: none; opacity: 1 } }
@keyframes bp-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@keyframes bp-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes bp-fly  { from { offset-distance: 0% } to { offset-distance: 100% } }
@keyframes bp-hint { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
[data-bp] span[aria-hidden="true"], [data-bp] svg[aria-hidden="true"], [data-bp] div[aria-hidden="true"] { pointer-events: none; }
[data-bp] ::placeholder { color: rgba(154,166,182,.7); }
[data-bp] .bp-card ::placeholder { color: rgba(20,36,59,.4); }
[data-bp] input:focus-visible, [data-bp] textarea:focus-visible { border-color: ${C.BRASS} !important; outline: none; }
[data-bp] button:focus-visible, [data-bp] a:focus-visible, [data-bp] [role="button"]:focus-visible { outline: 1.5px solid ${C.BRASS}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { [data-bp] *, [data-bp] { animation: none !important; transition: none !important; } }
`

const upper = (s, lang) => String(s || '').toLocaleUpperCase(lang === 'ru' ? 'ru' : lang === 'en' ? 'en' : 'az')

/* ─── Split-flap ─── */
function Flap(props) {
  const C = usePalette()
  const { ch, size = 'var(--tw)', anim = true, color = C.FLAP } = props
  return (
    <span style={{
      position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      width: size, height: `calc(${size} * 1.42)`, borderRadius: 3, flex: 'none',
      background: `linear-gradient(#232931 0 49%, #07090C 49% 52%, ${C.TILE} 52%)`,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,.07), 0 2px 2px rgba(0,0,0,.5)',
      fontSize: `calc(${size} * .92)`, lineHeight: 1, color,
    }}>
      <span key={ch} style={{ display: 'block', animation: anim ? 'bp-flip .16s ease-out' : undefined }}>{ch === ' ' ? '\u00A0' : ch === '♥' ? <Heart color={color} size=".8em" /> : ch}</span>
    </span>
  )
}

/* Hərflər təsadüfi simvollardan keçib yerinə oturur (interval effektdədir —
   render təmiz qalır). Mətn dəyişəndə `key` ilə yenidən qurulur. */
function FlapText({ text, delay = 0, step = 55, color, size }) {
  const [shown, setShown] = useState(() => Array.from(text).map(() => ' '))
  useEffect(() => {
    const chars = Array.from(text)
    const t0 = performance.now() + delay * 1000
    const settle = chars.map((_, i) => i * step + 260 + ((i * 97) % 200))
    const id = setInterval(() => {
      const el = performance.now() - t0
      if (el < 0) return
      let done = true
      setShown(chars.map((c, i) => {
        if (c === ' ' || el >= settle[i]) return c
        done = false
        return POOL[Math.floor(Math.random() * POOL.length)]
      }))
      if (done) clearInterval(id)
    }, 65)
    return () => clearInterval(id)
  }, [text, delay, step])
  return (
    <span aria-label={text} style={{ display: 'inline-flex', gap: 2, flexWrap: 'nowrap' }}>
      {shown.map((c, i) => <Flap key={i} ch={c} color={color} size={size} />)}
    </span>
  )
}

/* Ürək — mətn simvolu yox, SVG: bəzi telefonlarda «♥» rəngli emoji kimi çıxır */
function Heart({ color = 'currentColor', size = '.82em' }) {
  return (
    <svg viewBox="0 0 24 22" width={size} height={size} aria-hidden="true" style={{ display: 'inline-block', verticalAlign: '-0.06em' }}>
      <path d="M12 21.4l-1.5-1.3C5.4 15.4 2 12.3 2 8.5 2 5.4 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2.1C13.1 3.8 14.8 3 16.5 3 19.6 3 22 5.4 22 8.5c0 3.8-3.4 6.9-8.5 11.6L12 21.4z" fill={color} />
    </svg>
  )
}

function Plane(props) {
  const C = usePalette()
  const { size = 16, color = C.BRASS, style } = props
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: 'block', ...style }}>
      <path d="M21 13.6v-1.8l-7.6-4.6V2.6C13.4 1.7 12.8 1 12 1s-1.4.7-1.4 1.6v4.6L3 11.8v1.8l7.6-2.4v4.6l-2.2 1.6V19l3.6-1.1 3.6 1.1v-1.6l-2.2-1.6v-4.6z" fill={color} />
    </svg>
  )
}

/* Qanadlı gerb — mis folqa */
function Crest(props) {
  const C = usePalette()
  const { size = 34, color = C.COPPER } = props
  return (
    <svg viewBox="-30 -14 60 28" width={size * 2.1} height={size} aria-hidden="true" style={{ display: 'block' }}>
      {[0, 1].map((s) => (
        <g key={s} transform={s ? 'scale(-1 1)' : undefined}>
          {[0, 1, 2, 3].map((k) => <path key={k} d={`M-7 ${-4 + k * 3.4}C-14 ${-8 + k * 3.2} -22 ${-8 + k * 3} -${28 - k * 4} ${-6 + k * 3}`} fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" />)}
        </g>
      ))}
      <circle r="7" fill="none" stroke={color} strokeWidth="1.3" />
      <path d="M0 -3.8L1.1 -1.2L3.8 -1.1L1.7 .6L2.4 3.3L0 1.8L-2.4 3.3L-1.7 .6L-3.8 -1.1L-1.1 -1.2Z" fill={color} />
    </svg>
  )
}

/* Sabit «barkod» — mətndən deterministik */
function Barcode(props) {
  const C = usePalette()
  const { seed = 'DIGITOY', height = 44, color = C.INK, bars = 46 } = props
  const ws = Array.from({ length: bars }, (_, i) => 1 + ((seed.charCodeAt(i % seed.length) * (i + 7)) % 4))
  return (
    <span aria-hidden="true" style={{ display: 'flex', gap: 1.6, height, alignItems: 'stretch' }}>
      {ws.map((w, i) => <span key={i} style={{ width: w, background: color }} />)}
    </span>
  )
}

/* ═══ 01 — AÇILIŞ: split-flap lövhə ═══ */
function BoardOpening({ inv, theme, weddingData }) {
  const C = usePalette()
  const { ot, lang } = inv
  const gate = useGate({ inv, ms: 1050 })
  if (gate.gone) return null
  const { titleOv, first, second } = openingNames(inv)
  const L1 = upper(first, lang)
  const L2 = second ? `& ${upper(second, lang)}` : ''
  const route = ot.custom('route') ? upper(ot.text('route'), lang) : `GYD → ${inv.isCouple ? '♥' : '★'}`
  const cols = Math.max(12, Array.from(L1).length, Array.from(L2).length, Array.from(route).length)
  const [, m, d] = String(weddingData.date || '').split('-')
  const dateV = d ? `${d} ${(MONTHS[lang] || MONTHS.az)[Number(m) - 1] || ''}` : ''
  const mono = theme.fonts.mono || "'IBM Plex Mono', ui-monospace, monospace"
  const head = theme.fonts.heading
  return (
    <motion.div {...gate.gateProps} data-bp
      animate={gate.opening ? { opacity: 0 } : {}}
      transition={{ duration: 0.35, delay: 0.65 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden',
        background: `radial-gradient(120% 80% at 50% 0%, #1A2D47, ${C.NAVY} 50%, ${C.NIGHT})`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 16px',
        color: C.FLAP, fontFamily: theme.fonts.body,
      }}>
      <motion.div animate={gate.opening ? { y: '-120%' } : {}} transition={{ duration: 0.85, ease: [0.6, 0, 0.35, 1] }}
        style={{ width: 'min(100%, 400px)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px 10px', fontFamily: mono, fontSize: 11.5, letterSpacing: '.2em', color: C.BRASS, animation: 'bp-fade .8s ease-out .2s both' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{ot.show('brand') && <><Plane size={14} />{ot.text('brand')}</>}</span>
          {ot.show('pass') && <span style={{ color: C.MUTED }}>{ot.text('pass')}</span>}
        </div>
        <div style={{
          '--tw': `min(28px, calc((min(100vw, 400px) - 56px - ${cols * 2}px) / ${cols}))`,
          width: '100%', padding: '18px 12px', borderRadius: 8, background: '#0B0E12', fontFamily: head, fontWeight: 500,
          boxShadow: 'inset 0 0 0 1px #2A313A, inset 0 0 0 5px #10141A, inset 0 0 0 6px #2A313A, 0 30px 60px rgba(0,0,0,.55)',
          display: 'flex', flexDirection: 'column', gap: 6, animation: 'bp-rise .8s ease-out .1s both',
        }}>
          {ot.show('route') && <FlapText key={`r${route}`} text={route.padEnd(cols, ' ')} delay={0.4} color={C.BRASS} />}
          {titleOv !== '' && <FlapText key={`a${L1}`} text={L1.padEnd(cols, ' ')} delay={0.7} />}
          {titleOv !== '' && L2 && <FlapText key={`b${L2}`} text={L2.padEnd(cols, ' ')} delay={1.0} />}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', justifyContent: 'space-between', marginTop: 10, paddingTop: 12, borderTop: '1px solid #232A33', '--tw': 'min(20px, calc((min(100vw, 400px) - 70px) / 15))' }}>
            {[
              ot.show('fDate') && [ot.text('fDate'), dateV],
              ot.show('fTime') && [ot.text('fTime'), weddingData.time || ''],
              ot.show('fGate') && [ot.text('fGate'), 'VIP'],
            ].filter(Boolean).map(([lab, val], i) => (
              <div key={lab} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.16em', color: C.MUTED }}>{upper(lab, lang)}</span>
                <FlapText key={val} text={val} delay={1.3 + i * 0.2} step={70} />
              </div>
            ))}
          </div>
        </div>
        {ot.show('kicker') && <div style={{ marginTop: 22, fontFamily: mono, fontSize: 12, letterSpacing: '.24em', color: C.MUTED, animation: 'bp-rise .8s ease-out 2.2s both' }}>{upper(ot.text('kicker'), lang)}</div>}
        {ot.show('meta') && <div style={{ marginTop: 8, fontSize: 16, color: C.FLAP, textAlign: 'center', animation: 'bp-rise .8s ease-out 2.4s both' }}>{ot.text('meta')}</div>}
        {ot.show('cta') && (
          <div style={{ marginTop: 22, minHeight: 50, padding: '13px 28px', display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 4, background: C.BRASS, color: C.NIGHT, fontFamily: head, fontWeight: 500, fontSize: 16, letterSpacing: '.08em', animation: 'bp-rise .8s ease-out 2.7s both' }}>
            <Plane size={16} color={C.NIGHT} style={{ transform: 'rotate(45deg)' }} />{upper(ot.text('cta'), lang)}
          </div>
        )}
        {ot.show('hint') && <div style={{ marginTop: 12, fontSize: 13, color: C.MUTED, animation: 'bp-fade .8s ease-out 3.1s both, bp-hint 3s ease-in-out 3.9s infinite' }}>{ot.text('hint')}</div>}
      </motion.div>
    </motion.div>
  )
}

/* Bölmə — lövhə başlığı: təyyarə + şaquli xətt + başlıq */
function Leg({ id, section, title, kicker, sub, children, head, mono, lang }) {
  const C = usePalette()
  return (
    <section id={id} data-section={section} style={{ position: 'relative', padding: '56px 18px 60px' }}>
      <Reveal style={{ maxWidth: 500, margin: '0 auto' }}>
        {(title || kicker) && (
          <div style={{ marginBottom: 28 }}>
            <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Plane size={16} style={{ transform: 'rotate(90deg)' }} />
              <span style={{ flex: 1, height: 0, borderTop: `1px dashed ${alpha(C.BRASS, 0.45)}` }} />
            </div>
            {title && <h2 style={{ margin: 0, fontFamily: head, fontWeight: 500, fontSize: scaleFont('clamp(30px, 9vw, 40px)', C.hs), lineHeight: 1.05, letterSpacing: '.02em', color: C.IVORY }}>{upper(title, lang)}</h2>}
            {kicker && <div style={{ marginTop: 8, fontFamily: mono, fontSize: 12.5, letterSpacing: '.14em', color: C.BRASS }}>{upper(kicker, lang)}</div>}
            {sub && <p style={{ margin: '8px 0 0', maxWidth: 340, fontSize: 15.5, color: C.MUTED, lineHeight: 1.55 }}>{sub}</p>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  )
}

const field = (C) => ({
  width: '100%', background: alpha('#FFFFFF', 0.05), border: `1px solid ${alpha(C.MUTED, 0.35)}`, borderRadius: 4,
  padding: '14px 16px', fontSize: 16, color: C.IVORY, outline: 'none',
})
const btn = (C, on) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 48, padding: '12px 20px', borderRadius: 4,
  fontSize: 15, textDecoration: 'none', cursor: 'pointer', letterSpacing: '.04em',
  background: on ? C.BRASS : 'transparent', color: on ? C.NIGHT : C.IVORY, border: `1px solid ${on ? C.BRASS : alpha(C.MUTED, 0.5)}`,
})

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function BoardingPassTemplate(props) {
  const { lang, setLang, weddingData, onBack, isDemoMode = false } = props
  const inv = useInvitation({ ...props, templateId: ID, baseTheme: BASE, sectionLabels: LABELS })
  const C = resolvePalette(PAL, LINKS, inv.theme, BASE)
  const { theme, tr, L, K, S, cd, timeline, seating, gbook, gallery, rsvpL, gbookL, seatingL } = inv
  const head = theme.fonts.heading
  const body = theme.fonts.body
  const mono = theme.fonts.mono || "'IBM Plex Mono', ui-monospace, monospace"
  const T = TXT[lang] || TXT.az
  const [y, m, d] = String(weddingData.date || '').split('-')
  const flight = `DT ${d || '00'}${m || '00'}`
  const dateTicket = d ? `${d} ${(MONTHS[lang] || MONTHS.az)[Number(m) - 1] || ''} ${y}` : ''
  const dest = inv.isCouple ? <Heart /> : '★'
  const P = { lang, head, mono }

  return (
    <PaletteContext.Provider value={C}>
      <div data-bp data-enter={enterDirection(ID)} style={{
        backgroundColor: C.NAVY,
        backgroundImage: `radial-gradient(${alpha('#FFFFFF', 0.06)} 1px, transparent 1.2px), linear-gradient(180deg, ${C.NAVY}, ${C.NIGHT})`,
        backgroundSize: '16px 16px, 100% 100%',
        minHeight: '100vh', fontFamily: body, color: C.IVORY, overflowX: 'hidden', position: 'relative', isolation: 'isolate',
        fontSize: theme.bodyScale ? `${theme.bodyScale}em` : undefined, '--tpl-glow': alpha(C.BRASS, 0.3),
      }}>
        <style>{KEYFRAMES(C)}</style>
        {!inv.opened && <BoardOpening inv={inv} theme={theme} weddingData={weddingData} />}

        <MusicFab inv={inv} theme={theme} lang={lang} style={{ borderRadius: 8, background: '#0B0E12', border: '1px solid #2A313A' }}>
          {({ playing }) => <EqBars playing={playing} color={C.BRASS} idle={alpha(C.BRASS, 0.35)} />}
        </MusicFab>

        {inv.opened && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }} style={{ position: 'relative', zIndex: 1 }}>
            <header style={{
              position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: alpha(C.NIGHT, 0.88), backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
              borderBottom: `1px solid ${alpha(C.MUTED, 0.18)}`,
            }}>
              <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.MUTED, fontSize: 14.5, cursor: 'pointer', minHeight: 44, padding: '0 8px 0 0', fontFamily: body }}>
                <span aria-hidden="true">←</span>{tr.btn_back}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: mono, fontSize: 12, letterSpacing: '.2em', color: C.BRASS }}><Plane size={13} />{flight}</div>
              <LanguageSwitcher lang={lang} setLang={setLang} theme={theme} />
            </header>

            {/* HERO — minik talonu */}
            <section data-section="hero" style={{ padding: '28px 16px 26px' }}>
              <div className="bp-card" style={{ maxWidth: 420, margin: '0 auto', color: C.INK, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,.45))', animation: 'bp-rise .8s ease-out both' }}>
                <div style={{ background: C.IVORY, borderRadius: '10px 10px 0 0', overflow: 'hidden' }}>
                  <div style={{ background: C.INK, color: C.IVORY, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Crest size={18} color={C.BRASS} />
                      <span style={{ fontFamily: head, fontWeight: 500, fontSize: 15, letterSpacing: '.14em' }}>DIGITOY AIR</span>
                    </div>
                    <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.14em', color: C.BRASS }}>{upper(T.cls, lang)}</span>
                  </div>
                  <div style={{ padding: '20px 18px 18px' }}>
                    <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.16em', color: alpha(C.INK, 0.6) }}>{upper(inv.isCouple ? T.pax : T.paxOne, lang)}</div>
                    <h1 style={{ margin: '4px 0 0', fontFamily: head, fontWeight: 500, fontSize: 'clamp(30px, 9.6vw, 42px)', lineHeight: 1.05, letterSpacing: '.01em', color: C.INK, textWrap: 'balance' }}>
                      {upper(inv.heroTitle ? inv.heroTitle : inv.isCouple ? `${inv.groom} ${inv.and} ${inv.bride}` : inv.single, lang)}
                    </h1>
                    {inv.isCorp && weddingData.organizer?.trim() && <div style={{ marginTop: 6, fontSize: 14, color: alpha(C.INK, 0.7) }}>{tr.organizer_display}: {weddingData.organizer}</div>}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', margin: '20px 0 4px' }}>
                      <div>
                        <div style={{ fontFamily: head, fontWeight: 500, fontSize: 46, lineHeight: 1 }}>GYD</div>
                        <div style={{ fontSize: 13, color: alpha(C.INK, 0.65) }}>{T.from}</div>
                      </div>
                      <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.COPPER, padding: '0 8px' }}>
                        <span style={{ width: 26, borderTop: `1.5px dotted ${C.COPPER}` }} />
                        <Plane size={20} color={C.COPPER} style={{ transform: 'rotate(90deg)' }} />
                        <span style={{ width: 26, borderTop: `1.5px dotted ${C.COPPER}` }} />
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: head, fontWeight: 500, fontSize: 46, lineHeight: 1, color: C.RED }}>{dest}</div>
                        <div style={{ fontSize: 13, color: alpha(C.INK, 0.65) }}>{L('hero', 'kicker', inv.eventLabel)}</div>
                      </div>
                    </div>

                    <dl style={{ margin: '18px 0 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 12px', borderTop: `1px solid ${alpha(C.INK, 0.15)}`, paddingTop: 16 }}>
                      {[
                        [T.flight, flight],
                        [T.date, dateTicket],
                        [T.boarding, inv.time],
                        [T.gate, 'VIP'],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <dt style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.16em', color: alpha(C.INK, 0.55) }}>{upper(k, lang)}</dt>
                          <dd style={{ margin: '3px 0 0', fontFamily: head, fontWeight: 500, fontSize: 21, letterSpacing: '.02em' }}>{v}</dd>
                        </div>
                      ))}
                      {weddingData.venueName && (
                        <div style={{ gridColumn: '1 / -1' }}>
                          <dt style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.16em', color: alpha(C.INK, 0.55) }}>{upper(T.place, lang)}</dt>
                          <dd style={{ margin: '3px 0 0', fontSize: 17, fontWeight: 500 }}>{weddingData.venueName}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
                {/* perforasiya */}
                <div aria-hidden="true" style={{ position: 'relative', height: 22, background: `radial-gradient(circle at 0 50%, transparent 11px, ${C.IVORY} 11.5px) left / 51% 100% no-repeat, radial-gradient(circle at 100% 50%, transparent 11px, ${C.IVORY} 11.5px) right / 51% 100% no-repeat` }}>
                  <span style={{ position: 'absolute', left: 16, right: 16, top: '50%', borderTop: `2px dashed ${alpha(C.INK, 0.28)}` }} />
                </div>
                {/* qoparma talonu */}
                <div style={{ background: C.IVORY, borderRadius: '0 0 10px 10px', padding: '12px 18px 18px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.16em', color: alpha(C.INK, 0.55) }}>{flight} · {dateTicket}</div>
                    <div style={{ marginTop: 4, fontFamily: head, fontWeight: 500, fontSize: 18, letterSpacing: '.04em' }}>GYD → {dest}</div>
                  </div>
                  <Barcode seed={flight + (inv.groom || inv.single || '')} height={40} bars={30} />
                </div>
              </div>
              <p style={{ margin: '26px auto 0', maxWidth: 330, textAlign: 'center', fontSize: 16, lineHeight: 1.6, color: C.MUTED }}>{tr.inv_join}</p>
            </section>

            {/* SAYĞAC — split-flap */}
            {S.countdown && (
              <Leg section="countdown" {...P} title={L('countdown', 'title', cd.title)} kicker={K('countdown')}>
                <div style={{ padding: '18px 12px', borderRadius: 8, background: '#0B0E12', boxShadow: 'inset 0 0 0 1px #2A313A, inset 0 0 0 5px #10141A, inset 0 0 0 6px #2A313A', fontFamily: head, fontWeight: 500, '--tw': 'min(30px, calc((min(100vw, 500px) - 110px) / 9))' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                    {[
                      { v: cd.days, l: cd.labels.days, pad: 3 },
                      { v: cd.hours, l: cd.labels.hours },
                      { v: cd.minutes, l: cd.labels.minutes },
                      { v: cd.seconds, l: cd.labels.seconds, c: C.BRASS },
                    ].map(({ v, l, pad = 2, c }) => (
                      <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <div style={{ display: 'flex', gap: 2 }}>
                          {String(v).padStart(pad, '0').split('').map((ch, i) => <Flap key={i} ch={ch} color={c} />)}
                        </div>
                        <span style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.14em', color: C.MUTED }}>{upper(l, lang)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Leg>
            )}

            <StoryBlock inv={inv} templateId={ID} weddingData={weddingData} lang={lang} />

            {/* MƏKAN — uçuş qövsü */}
            {S.venue && (
              <Leg section="venue" {...P} title={L('venue', 'title', tr.inv_location)} kicker={K('venue')}>
                <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: `1px solid ${alpha(C.MUTED, 0.25)}` }}>
                  <MapSection
                    weddingData={weddingData} theme={theme} accent={C.BRASS} height="clamp(230px, 64vw, 300px)"
                    map={{ opacity: 0.55, filter: 'grayscale(1) brightness(.55) contrast(1.2)', tintOpacity: 0.5, tint: '#1B3456', blend: 'color' }}
                    frame={<FlightArc />}
                    fallback={<div style={{ height: 'clamp(230px, 64vw, 300px)', position: 'relative', background: `radial-gradient(${alpha('#FFFFFF', 0.12)} 1px, transparent 1.3px) 0 0 / 12px 12px, ${C.NAVY}` }}><FlightArc /></div>}
                  />
                </div>
                <div style={{ marginTop: 20, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ fontFamily: head, fontWeight: 500, fontSize: 25, lineHeight: 1.2 }}>{weddingData.venueName}</div>
                  <span style={{ fontFamily: mono, fontSize: 12, color: C.BRASS, whiteSpace: 'nowrap' }}>{inv.time}</span>
                </div>
                {weddingData.venueNote && <div style={{ marginTop: 4, fontSize: 15, color: C.MUTED }}>{weddingData.venueNote}</div>}
                <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
                  {inv.dirUrl && <a data-press href={inv.dirUrl} target="_blank" rel="noopener noreferrer" style={btn(C, true)}>{tr.inv_directions_btn}</a>}
                  {inv.mapUrl && <a data-press href={inv.mapUrl} target="_blank" rel="noopener noreferrer" style={btn(C, !inv.dirUrl)}>Maps</a>}
                  {weddingData.wazeUrl && <a data-press href={weddingData.wazeUrl} target="_blank" rel="noopener noreferrer" style={btn(C, false)}>Waze</a>}
                  {weddingData.appleMapsUrl && <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(C, false)}>Apple</a>}
                </div>
              </Leg>
            )}

            {/* PROQRAM — uçuş lövhəsi */}
            {S.program && (
              <Leg section="program" {...P} title={L('program', 'title', timeline.sectionLabel)} kicker={K('program')}>
                <div style={{ borderRadius: 8, background: '#0B0E12', boxShadow: 'inset 0 0 0 1px #2A313A', padding: '6px 14px', '--tw': '17px' }}>
                  {timeline.events.map((ev, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', gap: 14, padding: '13px 0', borderTop: i ? '1px solid #1E242C' : 'none' }}>
                      <div style={{ display: 'flex', gap: 2, fontFamily: head, fontWeight: 500 }}>
                        {String(ev.time || '').padEnd(5, ' ').slice(0, 5).split('').map((ch, k) => <Flap key={k} ch={ch} anim={false} color={C.BRASS} />)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: head, fontWeight: 400, fontSize: 17.5, lineHeight: 1.25, letterSpacing: '.03em', color: C.FLAP }}>{upper(ev.label, lang)}</div>
                        <div style={{ marginTop: 3, display: 'flex', alignItems: 'center', gap: 6, fontFamily: mono, fontSize: 10.5, letterSpacing: '.14em', color: '#7FC49A' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7FC49A' }} />{upper(T.status, lang)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Leg>
            )}

            {S.dresscode && (
              <Leg section="dresscode" {...P} title={L('dresscode', 'title', tr.inv_dresscode)} kicker={K('dresscode')}>
                <DressCodeSection theme={theme} paletteId={weddingData.dressCodePalette} customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders} note={weddingData.dressCodeDescription} lang={lang} serif={head} align="left" onDark />
              </Leg>
            )}

            {/* MASA — oturacaq talonu */}
            {S.seating && !seating.isEmpty && (
              <Leg section="seating" {...P} title={L('seating', 'title', seatingL.title)} kicker={K('seating')} sub={seatingL.sub}>
                <input {...seatInputProps(inv, 'bp-seat-list')} style={field(C)} />
                <SeatSuggest inv={inv} id="bp-seat-list" c={{ bg: '#0F1A2A', border: `1px solid ${alpha(C.MUTED, 0.35)}`, active: alpha(C.BRASS, 0.14), text: C.IVORY, table: C.BRASS, radius: 4, font: body }} />
                {seating.showNotFound && <div style={{ marginTop: 12, fontSize: 14.5, color: C.MUTED }}>{tr.inv_seat_fullname}</div>}
                {seating.selected && (
                  <div className="bp-card" style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1fr auto', background: C.IVORY, color: C.INK, borderRadius: 8, overflow: 'hidden', animation: 'bp-rise .6s ease-out both' }}>
                    <div style={{ padding: '16px 16px 14px', minWidth: 0 }}>
                      <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.16em', color: alpha(C.INK, 0.55) }}>{upper(T.paxOne, lang)}</div>
                      <div style={{ marginTop: 3, fontFamily: head, fontWeight: 500, fontSize: 20, lineHeight: 1.15 }}>{upper(seating.selected.full_name, lang)}</div>
                      {seating.tablemates.length > 0 && <div style={{ marginTop: 10, fontSize: 14, color: alpha(C.INK, 0.7), lineHeight: 1.5 }}>{seating.tablemates.map((g) => g.full_name).join(', ')}</div>}
                      <button onClick={seating.reset} data-press style={{ marginTop: 6, padding: 0, background: 'none', border: 'none', color: C.INK, fontSize: 14, minHeight: 44, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: body }}>
                        {seatingL.again || 'Yenidən axtar'}
                      </button>
                    </div>
                    <div style={{ padding: '16px 18px', background: C.INK, color: C.IVORY, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: `2px dashed ${alpha(C.IVORY, 0.4)}` }}>
                      <span style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: '.16em', color: C.BRASS }}>{upper(T.table, lang)}</span>
                      <span style={{ fontFamily: head, fontWeight: 500, fontSize: 52, lineHeight: 1 }}>{seating.selected.table_id}</span>
                    </div>
                  </div>
                )}
              </Leg>
            )}

            {/* FOTOLAR — pasport möhürləri */}
            {S.gallery && (
              <Leg section="gallery" id="gallery-section" {...P} title={L('gallery', 'title', tr.inv_gallery)} kicker={K('gallery')}>
                {gallery.demoPhotos.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 28 }}>
                    {gallery.demoPhotos.map((url, i) => (
                      <div key={i} style={{ position: 'relative', aspectRatio: '4 / 5', borderRadius: 4, overflow: 'hidden', background: '#16263C' }}>
                        <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        <span aria-hidden="true" style={{ position: 'absolute', right: 4, bottom: 4, width: 38, height: 38, borderRadius: '50%', border: `1.5px solid ${alpha(C.RED, 0.8)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${-14 + i * 9}deg)`, fontFamily: mono, fontSize: 7.5, color: alpha(C.RED, 0.9), letterSpacing: '.06em', textAlign: 'center', lineHeight: 1.1 }}>GYD<br />{d}.{m}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 18, alignItems: 'center' }}>
                  <div style={{ padding: 10, background: C.IVORY, borderRadius: 6 }}>
                    <QRCodeSVG value={gallery.photoShareUrl} size={112} bgColor={C.IVORY} fgColor={C.INK} level="M" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, color: C.MUTED }}>{tr.inv_scan_upload}</div>
                    <a data-press href={gallery.photoShareUrl} style={{ ...btn(C, true), marginTop: 12 }}>{tr.inv_gallery_btn}</a>
                  </div>
                </div>
                <p style={{ margin: '18px 0 0', fontSize: 15, color: C.MUTED, lineHeight: 1.65 }}>{tr.inv_gallery_desc}</p>
              </Leg>
            )}

            {/* RSVP — check-in */}
            {S.rsvp && (
              <Leg section="rsvp" {...P} title={L('rsvp', 'title', rsvpL.title)} kicker={L('rsvp', 'kicker', tr.inv_rsvp)} sub={rsvpL.subtitle}>
                <ReplyForm inv={inv} t={{ ink: C.IVORY, muted: C.MUTED, line: alpha(C.MUTED, 0.45), hair: alpha(C.MUTED, 0.16), accent: C.BRASS, font: body, display: head, radius: 4, btnFont: head, btnUpper: true, btnTracking: '.1em', marker: (a) => <Plane size={13} color={a ? C.BRASS : alpha(C.MUTED, 0.45)} style={{ transform: 'rotate(90deg)' }} />, suggest: { bg: '#0F1A2A', border: `1px solid ${alpha(C.MUTED, 0.35)}`, active: alpha(C.BRASS, 0.14), text: C.IVORY, table: C.BRASS, radius: 4, font: body } }} />
              </Leg>
            )}

            {/* HAVA POÇTU */}
            {S.guestbook && (
              <Leg section="guestbook" {...P} title={L('guestbook', 'title', gbookL.title)} kicker={K('guestbook')}>
                <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 30 }}>
                  <input type="text" value={gbook.name} onChange={(e) => gbook.setName(e.target.value)} placeholder={gbookL.namePh} style={field(C)} />
                  <textarea value={gbook.text} onChange={(e) => gbook.setText(e.target.value)} placeholder={gbookL.msgPh} rows={3} style={{ ...field(C), resize: 'none', lineHeight: 1.5 }} />
                  <button type="submit" disabled={!gbook.canSubmit} data-press style={{ ...btn(C, gbook.canSubmit), width: '100%', opacity: gbook.canSubmit ? 1 : 0.5, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed' }}>
                    {gbook.sending ? gbookL.sending : gbookL.btn}
                  </button>
                  {gbook.error && <p role="alert" style={{ margin: 0, fontSize: 13.5 }}>⚠ {gbookL.error}</p>}
                </form>
                <div style={{ display: 'grid', gap: 14 }}>
                  {gbook.messages.map((raw, i) => {
                    const m2 = gbook.readMessage(raw)
                    return (
                      <figure key={m2.name + i} style={{
                        margin: 0, padding: 7, borderRadius: 4,
                        background: `repeating-linear-gradient(135deg, ${C.RED} 0 12px, ${C.IVORY} 12px 18px, ${C.BLUE} 18px 30px, ${C.IVORY} 30px 36px)`,
                      }}>
                        <div style={{ position: 'relative', background: C.IVORY, color: C.INK, padding: '16px 16px 14px' }}>
                          <span aria-hidden="true" style={{ position: 'absolute', right: 12, top: 10, fontFamily: mono, fontSize: 9.5, letterSpacing: '.14em', color: C.BLUE }}>PAR AVION</span>
                          <blockquote style={{ margin: '10px 0 0', fontSize: 16.5, lineHeight: 1.55 }}>{m2.text}</blockquote>
                          <figcaption style={{ marginTop: 8, fontFamily: mono, fontSize: 12, color: alpha(C.INK, 0.65) }}>— {m2.name}{m2.date ? `, ${gbook.formatDate(m2.date)}` : ''}</figcaption>
                        </div>
                      </figure>
                    )
                  })}
                </div>
              </Leg>
            )}

            <InvitationEnd inv={inv} theme={theme} weddingData={weddingData} lang={lang} isDemoMode={isDemoMode} serif={head} />
          </motion.div>
        )}
      </div>
    </PaletteContext.Provider>
  )
}

function FlightArc() {
  const C = usePalette()
  const path = 'M30 150 Q150 10 270 90'
  return (
    <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <path d={path} fill="none" stroke={C.BRASS} strokeWidth="1.4" strokeDasharray="4 5" />
      <circle cx="30" cy="150" r="4" fill={C.IVORY} />
      <text x="30" y="172" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="11" fill={C.IVORY}>GYD</text>
      <circle cx="270" cy="90" r="9" fill="none" stroke={C.RED} strokeWidth="1.4" />
      <circle cx="270" cy="90" r="4" fill={C.RED} />
      <g style={{ offsetPath: `path('${path}')`, offsetRotate: 'auto', animation: 'bp-fly 6s ease-in-out infinite' }}>
        <path d="M6 0L-4 -5L-2 0L-4 5Z" fill={C.BRASS} />
      </g>
    </svg>
  )
}
