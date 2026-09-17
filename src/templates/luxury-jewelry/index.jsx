import TemplateShell, { alpha } from '../_shared/TemplateShell'
import OpeningFrame, { Kicker, NameRow, Ornament, OpeningMeta } from '../_shared/OpeningFrame'
import { Ambient, RotRing, Particles } from '../_shared/motion'
import { getTemplateTheme } from '../templateConfig'

/* ─────────────────────────────────────────────────────────────────────────────
   LUXURY JEWELRY — Claude Design «Seçilmiş 7» · 07

   Design dili: zərgərlik vitrini. Dərin zümrüd-qara fon (#0A1513), məxmər
   qutu, altından qalxan zümrüd işıq hovuzu və kəsilmiş daş (#A3D6C7).

   Açılış: vitrin işığı yanır, məxmər qutunun qapağı açılır (rg-flap),
   daş qutudan qalxır, kölgəsi böyüyür, üzərindən parıltı keçir.
   Çıxış `zoom` — daşın içinə girilir.

   ⚠ Qutu qapağı `transform-origin: bottom` + `rotateX` ilə açılır; 3D üçün
   valideyndə `perspective` MƏCBURİDİR, yoxsa qapaq sadəcə yastılaşır.
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('luxury-jewelry')

const DISP = TH.fonts.heading   /* Cormorant Garamond */

const KEYFRAMES = `
@keyframes tpl-hint  { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes tpl-eq    { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
/* Məxmər qutunun qapağı arxaya açılır */
@keyframes lj-flap   { from { transform: rotateX(0) } to { transform: rotateX(-104deg) } }
/* Daş qutudan qalxır */
@keyframes lj-rise   { from { opacity:0; transform: translateY(20px) scale(.72) } to { opacity:1; transform: none } }
/* Daşın kölgəsi böyüyür */
@keyframes lj-shadow { from { opacity:0; transform: translateX(-50%) scaleX(.3) } to { opacity:.55; transform: translateX(-50%) scaleX(1) } }
/* Vitrin işığı yanır */
@keyframes lj-lamp   { from { opacity:0 } to { opacity:1 } }
/* Daşın üzərindən keçən parıltı */
@keyframes lj-spark  { 0%,88%,100% { opacity:0; transform: scale(.4) } 94% { opacity:1; transform: scale(1) } }
`

/* Kəsilmiş zümrüd — yuxarıdan masa, aşağıdan pavilyon, faset xətləri ilə */
function Gem({ delay = 0 }) {
  return (
    <span style={{
      position: 'relative', display: 'block', width: 76, height: 84, marginInline: 'auto',
      animation: `lj-rise 1.1s cubic-bezier(.2,.9,.25,1) ${delay}s both`,
    }}>
      <svg viewBox="0 0 76 84" width="76" height="84" fill="none" aria-hidden="true" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="ljCrown" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#EFF6F3" stopOpacity=".96" />
            <stop offset=".5" stopColor="#A3D6C7" stopOpacity=".85" />
            <stop offset="1" stopColor="#5E8E80" stopOpacity=".72" />
          </linearGradient>
          <linearGradient id="ljPav" x1=".2" y1="0" x2=".8" y2="1">
            <stop offset="0" stopColor="#C6E7DC" stopOpacity=".92" />
            <stop offset=".6" stopColor="#6F9E90" stopOpacity=".8" />
            <stop offset="1" stopColor="#2E5A4E" stopOpacity=".7" />
          </linearGradient>
        </defs>

        {/* Pavilyon (alt konus) */}
        <path d="M3 28 L73 28 L38 80 Z" fill="url(#ljPav)" />
        {/* Tac (üst) */}
        <path d="M22 5 L54 5 L73 28 L3 28 Z" fill="url(#ljCrown)" />
        {/* Masa */}
        <path d="M22 5 L54 5 L57 10 L19 10 Z" fill="#F4FBF8" opacity=".92" />

        {/* Faset xətləri */}
        <g stroke={alpha('#A3D6C7', 0.55)} strokeWidth=".7" strokeLinejoin="round">
          <path d="M3 28 L73 28" />
          <path d="M22 5 L13 28 M54 5 L63 28 M31 5 L24 28 M45 5 L52 28 M38 5 L38 28" />
          <path d="M13 28 L38 80 M24 28 L38 80 M38 28 L38 80 M52 28 L38 80 M63 28 L38 80" />
        </g>

        <path d="M22 5 L54 5 L73 28 L3 28 Z" fill="none" stroke="#A3D6C7" strokeWidth="1" strokeLinejoin="round" />
        <path d="M3 28 L73 28 L38 80 Z" fill="none" stroke="#A3D6C7" strokeWidth="1" strokeLinejoin="round" />
        <path d="M3 28 L73 28" stroke="#EFF6F3" strokeWidth="1.4" opacity=".9" />
      </svg>

      {/* Parıltı — arabir bir faseti yandırır */}
      <span aria-hidden="true" style={{
        position: 'absolute', left: '26%', top: '18%', width: 12, height: 12,
        background: 'radial-gradient(circle, #FFFFFF, transparent 62%)',
        animation: `lj-spark 6.5s ease-in-out ${delay + 2}s infinite`,
      }} />
    </span>
  )
}

function Opening(props) {
  const { theme, weddingData, isCouple } = props

  const dateStr = String(weddingData.date || '').split('-').reverse().join(' · ')

  return (
    <OpeningFrame
      {...props}
      exit="zoom"
      duration={950}
      label="Qutunu aç"
      ctaDelay={4.1}
      hintDelay={4.6}
      orbs="none"
      veil="#0A1513"
      background="radial-gradient(110% 80% at 50% 62%, #123029, #06100E 76%)"
      ctaStyle={{
        border: `1px solid ${alpha(theme.primary, 0.6)}`,
        color: theme.primary, background: 'rgba(0,0,0,.3)',
        letterSpacing: '.2em', textTransform: 'uppercase',
      }}
      ctaGleam="rgba(255,255,255,.9)"
      hintColor={alpha(theme.muted, 0.95)}
    >
      {/* Vitrin işığı — daşın altından qalxan zümrüd hovuzu */}
      <span aria-hidden="true" style={{
        position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-50%)',
        width: 'min(90vw, 320px)', height: 200, borderRadius: '50%', pointerEvents: 'none',
        background: `radial-gradient(ellipse, ${alpha(theme.primary, 0.3)}, transparent 68%)`,
        filter: 'blur(30px)', animation: 'lj-lamp 1.4s ease-out .6s both',
      }} />

      {/* ── MƏXMƏR QUTU ── */}
      <div style={{
        position: 'relative', width: 'min(60vw, 210px)', marginInline: 'auto',
        perspective: 520,   /* ⚠ qapağın rotateX-i üçün MƏCBURİ */
      }}>
        {/* Daşın kölgəsi — qutunun ağzında */}
        <span aria-hidden="true" style={{
          position: 'absolute', left: '50%', bottom: 42, width: 96, height: 14,
          background: 'radial-gradient(ellipse, rgba(0,0,0,.75), transparent 70%)',
          filter: 'blur(5px)', transformOrigin: 'center',
          animation: 'lj-shadow 1s ease-out 2.3s both',
        }} />

        {/* Daş */}
        <div style={{ position: 'relative', paddingBottom: 12 }}>
          <Gem delay={2.1} />
        </div>

        {/* Qutunun gövdəsi */}
        <div style={{
          position: 'relative', height: 58, borderRadius: '5px',
          background: `linear-gradient(160deg, ${alpha(theme.primary, 0.22)}, #0C201B)`,
          border: `1px solid ${alpha(theme.primary, 0.34)}`,
          animation: 'tpl-rise .9s cubic-bezier(.22,.61,.36,1) .9s both',
        }}>
          {/* Qapaq — arxaya açılır */}
          <span aria-hidden="true" style={{
            position: 'absolute', left: -1, right: -1, bottom: '100%', height: 46,
            borderRadius: '5px 5px 0 0', transformOrigin: 'bottom',
            background: `linear-gradient(180deg, #123029, ${alpha(theme.primary, 0.18)})`,
            border: `1px solid ${alpha(theme.primary, 0.3)}`, borderBottom: 0,
            animation: 'lj-flap 1.3s cubic-bezier(.34,1.1,.64,1) 1.4s both',
          }} />
          {/* Məxmər astar xətti */}
          <span aria-hidden="true" style={{
            position: 'absolute', left: 10, right: 10, top: 9, height: 1,
            background: alpha(theme.primary, 0.3),
          }} />
        </div>
      </div>

      <Kicker text="Dəvətnamə" color={alpha(theme.muted, 0.95)} lineColor={alpha(theme.primary, 0.5)} delay={3.3} style={{ marginTop: 28 }} />

      <NameRow
        theme={theme} weddingData={weddingData} isCouple={isCouple}
        delay={3.5} step={0.2}
        size="clamp(22px, 7.6vw, 30px)" ampSize="clamp(16px, 5.4vw, 21px)"
        font={DISP} color={theme.accent} ampColor={theme.primary}
        style={{ marginTop: 16, letterSpacing: '.06em', lineHeight: 1.2 }}
      />

      <Ornament color={theme.primary} mark="rhomb" delay={3.9} width={30} style={{ marginTop: 15 }} />

      <OpeningMeta text={dateStr} color={alpha(theme.muted, 0.95)} delay={4.05} style={{ marginTop: 13, letterSpacing: '.28em' }} />
    </OpeningFrame>
  )
}

export default function LuxuryJewelryTemplate(props) {
  return (
    <TemplateShell
      {...props}
      templateId="luxury-jewelry"
      theme={TH}
      Opening={Opening}
      keyframes={KEYFRAMES}
      ambient={
        <Ambient>
          {/* Vitrin işığı — səhifənin altından zümrüd hovuzu */}
          <span style={{
            position: 'absolute', left: '50%', top: '58%', width: 420, height: 300,
            margin: '-150px 0 0 -210px', borderRadius: '50%', opacity: 0.22,
            background: `radial-gradient(ellipse, ${TH.primary}, transparent 66%)`,
            filter: 'blur(56px)', animation: 'ab-pulse 14s ease-in-out infinite',
          }} />
          {/* Zərgərlik halqaları */}
          <RotRing color={alpha(TH.primary, 0.14)} size={330} top="40%" duration={78} />
          <RotRing color={alpha(TH.secondary, 0.1)} size={220} top="40%" duration={104} dashed reverse />
          {/* Daş qırıqları — havada yavaş parıldayır */}
          <Particles kind="up" count={6} color={alpha(TH.accent, 0.7)} size={2} seed={13} minDur={14} maxDur={22} />
        </Ambient>
      }
      /* ── Bölmə adları — Claude Design-dakı metafora (Phase 41) ──────────
         AZ mətnlər birbaşa dizayn faylındandır; EN/RU həmin metaforanın
         qarşılığıdır. Verilməyən bölmə sistemin öz tərcüməsini işlədir.
         ⚠ `kicker` sətirdir (hər üç dildə eyni qalır — qısa etiketdir),
         `title` isə {az,en,ru} obyektidir. */
      sectionLabels={{
        countdown: { kicker: 'PREVIEW',
                    title: { az: 'Təqdimata qalan vaxt', en: 'Until the unveiling', ru: 'До презентации' } },
        venue:     { kicker: 'BOUTIQUE',
                    title: { az: 'Butikin ünvanı', en: 'The boutique address', ru: 'Адрес бутика' } },
        program:   { kicker: 'COLLECTION',
                    title: { az: 'Kolleksiya · axşamın parçaları', en: 'The collection', ru: 'Коллекция' } },
        dresscode: { kicker: 'DETAIL',
                    title: { az: 'Geyim · zərif detal', en: 'Dress · the fine detail', ru: 'Дресс-код · деталь' } },
        seating:   { kicker: 'CERTIFICATE',
                    title: { az: 'Sertifikat · yeriniz', en: 'Certificate · your seat', ru: 'Сертификат · ваше место' } },
        gallery:   { kicker: 'SHOWCASE',
                    title: { az: 'Vitrin', en: 'Showcase', ru: 'Витрина' } },
        rsvp:      { kicker: 'RSVP',
                    title: { az: 'Dəvətə cavab', en: 'Reply to the invitation', ru: 'Ответ на приглашение' } },
        guestbook: { kicker: 'NOTES',
                    title: { az: 'Qonaq qeydləri', en: 'Guest notes', ru: 'Записи гостей' } },
      }}
      design={{
        programStyle: 'tracklist',
        /* Location — xeritə şəklinin şablona məxsus rəng emalı (bax MapSection) */
        /* Xəritənin rəng emalı — Claude Design-dakı DƏQİQ filter zənciri.
           ⚠ tintOpacity 0-dır: dizayn ayrıca tint QATI işlətmir, rəngi
           filter-in özü verir. Tint qatı vivid aksentlə xəritəni
           boyayıb küçə adlarını oxunmaz edirdi. */
        map: { opacity: 0.85, filter: 'grayscale(1) sepia(.32) hue-rotate(120deg) saturate(1.5) brightness(.52) contrast(1.08)', tintOpacity: 0 },
        radius: 5,
        buttonRadius: 100,
        align: 'center',
        headingTransform: 'none',
        kicker: '.24em',
        dark: true,
        alternate: true,
        headingColor: TH.accent,
        accentColor: TH.primary,
        ctaBg: TH.primary,
        ctaText: '#0A1513',
      }}
    />
  )
}
