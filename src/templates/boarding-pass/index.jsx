import TemplateShell, { alpha } from '../_shared/TemplateShell'
import OpeningFrame, { Kicker, NameRow, OpeningMeta } from '../_shared/OpeningFrame'
import { Ambient, Particles } from '../_shared/motion'
import { getTemplateTheme } from '../templateConfig'

/* ─────────────────────────────────────────────────────────────────────────────
   BOARDING PASS — Claude Design «Seçilmiş 7» · 01

   Design dili: dəvətnamə bir uçuş biletidir. Check-in kartı, perforasiya
   xətti ilə ayrılan qoparma talonu, şaquli barkod, mono tipoqrafiya və
   naranc-qırmızı aksent (#E2542F) sakit slate-teal fon üzərində.

   Açılış: bilet aşağıdan qalxır, perforasiya xətti soldan sağa «deşilir»,
   barkod zolaqları növbə ilə düşür, sonra marşrut (GYD → ♥) yazılır.
   Çıxış `up` — bilet yuxarı dartılıb qopardılır.

   ⚠ Bütün rənglər `theme` token-lərindəndir (templateConfig · boarding-pass);
   bu faylda hardcode rəng YALNIZ ağ/qara alpha overlay-lərdir.
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('boarding-pass')

/* Mono tipoqrafiya bu şablonun onurğasıdır — bilet üzərindəki hər kiçik
   etiket eyni mono ailədədir (theme.fonts.body = JetBrains Mono). */
const MONO = TH.fonts.body
const DISP = TH.fonts.heading

/* ⚠ BİLETİN MÜRƏKKƏBİ — `theme.text` DEYİL.
   Bilet kartının fonu `theme.accent` (#F2F5F4, demək olar ağ), `theme.text`
   isə tünd fon üçün nəzərdə tutulub (#F2F5F4 — eyni rəng!). Kartın içindəki
   hər şey bu tünd mürəkkəblə yazılır, yoxsa ağ üzərində ağ olur. */
const TICKET_INK = '#12191D'

const KEYFRAMES = `
@keyframes tpl-hint  { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes tpl-eq    { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
/* Perforasiya soldan sağa deşilir */
@keyframes bp-perf   { from { transform: scaleX(0) } to { transform: scaleX(1) } }
/* Barkod zolaqları növbə ilə yuxarıdan düşür */
@keyframes bp-bar    { from { opacity:0; transform: scaleY(.2) } to { opacity:1; transform: scaleY(1) } }
/* Bilet aşağıdan qalxır */
@keyframes bp-ticket { from { opacity:0; transform: translateY(26px) } to { opacity:1; transform: none } }
/* Uçuş izi — fonda çox yavaş sürüşən nazik qövs */
@keyframes bp-trail  { 0% { transform: translateX(-30%); opacity:0 } 18% { opacity:.5 } 100% { transform: translateX(130%); opacity:0 } }
`

/* Barkod — eyni enli zolaqlar deyil, real barkod kimi qeyri-bərabər.
   Sabit massivdir (Math.random DEYİL): hər render-də eyni qalsın, yoxsa
   React yenidən çəkəndə barkod «titrəyərdi». */
const BARS = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2]

function Barcode({ delay = 0, height = 46, color }) {
  return (
    <span aria-hidden="true" style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height }}>
      {BARS.map((w, i) => (
        <span key={i} style={{
          width: w, height: '100%', background: color, transformOrigin: 'top',
          animation: `bp-bar .5s cubic-bezier(.22,.61,.36,1) ${(delay + i * 0.035).toFixed(2)}s both`,
        }} />
      ))}
    </span>
  )
}

/* Bilet üzərindəki kiçik sahə: etiket + dəyər (eyni mono ritmdə) */
function Field({ label, value, delay = 0, align = 'left' }) {
  return (
    <div style={{ textAlign: align, animation: `tpl-rise .7s ease-out ${delay}s both` }}>
      <div style={{
        fontFamily: MONO, fontSize: 7.5, letterSpacing: '.18em',
        textTransform: 'uppercase', color: TH.muted,
      }}>{label}</div>
      <div style={{
        fontFamily: DISP, fontWeight: 500, fontSize: 13, color: TICKET_INK, marginTop: 3,
      }}>{value}</div>
    </div>
  )
}

function Opening(props) {
  const { theme, weddingData, isCouple } = props

  /* Tarix biletdəki kimi qısa mono formatda: «21 NOY 2026» */
  const MONTHS = ['YAN', 'FEV', 'MAR', 'APR', 'MAY', 'İYN', 'İYL', 'AVQ', 'SEN', 'OKT', 'NOY', 'DEK']
  const [y, m, d] = String(weddingData.date || '').split('-')
  const dateStr = y ? `${d} ${MONTHS[Number(m) - 1] || ''} ${y}` : ''

  /* Marşrut kodu — məkanın adından deyil, sabit «GYD» (Bakı) + ürək.
     Məkan adı biletin alt sətrində onsuz da yazılır. */
  return (
    <OpeningFrame
      {...props}
      exit="up"
      duration={950}
      label="Check-in et"
      ctaDelay={3.9}
      hintDelay={4.4}
      orbs="none"
      veil="#0B1216"
      background="radial-gradient(120% 84% at 50% 26%, #173039, #080D11 78%)"
      ctaStyle={{
        border: `1px solid ${alpha(theme.primary, 0.6)}`,
        color: theme.text, background: alpha(theme.primary, 0.14),
        fontFamily: MONO, letterSpacing: '.16em',
      }}
      ctaGleam={alpha(theme.primary, 0.9)}
      hintColor={alpha(theme.muted, 0.9)}
    >
      {/* Uçuş izi — fonda çox yavaş keçən nazik qövs */}
      <span aria-hidden="true" style={{
        position: 'absolute', left: 0, right: 0, top: '22%', height: 1, pointerEvents: 'none',
        background: `linear-gradient(90deg, transparent, ${alpha(theme.primary, 0.5)}, transparent)`,
        animation: 'bp-trail 11s ease-in-out 2s infinite',
      }} />

      {/* ── BİLET ── */}
      <div style={{
        position: 'relative', width: 'min(86vw, 300px)', marginInline: 'auto',
        background: theme.accent, color: TICKET_INK,
        animation: 'bp-ticket .9s cubic-bezier(.22,.61,.36,1) .8s both',
        boxShadow: '0 30px 70px rgba(0,0,0,.55)',
      }}>
        {/* Üst zolaq — hava yolu adı */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '9px 12px', borderBottom: `1px solid ${alpha(theme.secondary, 0.35)}`,
        }}>
          <span style={{
            fontFamily: MONO, fontSize: 8, letterSpacing: '.24em', color: '#5E7078',
          }}>DIGITOY AIR</span>
          <span style={{
            fontFamily: MONO, fontSize: 8, letterSpacing: '.24em', color: theme.primary,
          }}>BOARDING PASS</span>
        </div>

        {/* Marşrut */}
        <div style={{
          padding: '16px 12px 12px', textAlign: 'center',
          animation: 'tpl-rise .8s ease-out 1.5s both',
        }}>
          <div style={{
            fontFamily: DISP, fontWeight: 700, fontSize: 'clamp(22px, 7.4vw, 28px)',
            letterSpacing: '.02em', color: TICKET_INK, lineHeight: 1,
          }}>
            GYD <span style={{ color: theme.primary }}>→</span> ♥
          </div>
        </div>

        {/* Adlar */}
        <NameRow
          theme={theme} weddingData={weddingData} isCouple={isCouple}
          delay={1.9} step={0.18}
          size="clamp(15px, 5vw, 18px)" ampSize="clamp(13px, 4.2vw, 15px)"
          font={DISP} color={TICKET_INK} ampColor={theme.primary}
          style={{
            padding: '0 12px', letterSpacing: '.06em',
            textTransform: 'uppercase', fontWeight: 500,
          }}
        />

        {/* Perforasiya — soldan sağa deşilir */}
        <div aria-hidden="true" style={{
          margin: '14px 0 0', height: 1, transformOrigin: 'left',
          backgroundImage: `repeating-linear-gradient(90deg, ${alpha(theme.secondary, 0.75)} 0 4px, transparent 4px 8px)`,
          animation: 'bp-perf .7s cubic-bezier(.22,.61,.36,1) 2.5s both',
        }} />

        {/* Qoparma talonu — sahələr + barkod */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px' }}>
          <div style={{ flex: 1, display: 'grid', gap: 9 }}>
            <Field label="Tarix"  value={dateStr} delay={2.8} />
            <Field label="Saat"   value={weddingData.time || ''} delay={2.95} />
            <Field label="Qapı"   value={weddingData.venueName || ''} delay={3.1} />
          </div>
          <Barcode delay={3.1} color={TICKET_INK} />
        </div>
      </div>

      <Kicker text="Dəvətnamə" color={alpha(theme.muted, 0.95)} lineColor={alpha(theme.primary, 0.5)} delay={3.5} style={{ marginTop: 24 }} />
      <OpeningMeta text={weddingData.venueName || ''} color={alpha(theme.muted, 0.9)} delay={3.7} style={{ marginTop: 10, letterSpacing: '.26em' }} />
    </OpeningFrame>
  )
}

export default function BoardingPassTemplate(props) {
  return (
    <TemplateShell
      {...props}
      templateId="boarding-pass"
      theme={TH}
      Opening={Opening}
      keyframes={KEYFRAMES}
      ambient={
        <Ambient>
          {/* Uçuş izləri — üç nazik qövs, fərqli sürətlə */}
          {[
            { top: '18%', dur: 16, delay: 0 },
            { top: '52%', dur: 22, delay: 6 },
            { top: '78%', dur: 19, delay: 11 },
          ].map((t, i) => (
            <span key={i} style={{
              position: 'absolute', left: 0, right: 0, top: t.top, height: 1,
              background: `linear-gradient(90deg, transparent, ${alpha(TH.primary, 0.4)}, transparent)`,
              animation: `bp-trail ${t.dur}s ease-in-out ${t.delay}s infinite`,
            }} />
          ))}
          {/* Bulud dənəsi — çox seyrək, aşağıdan yuxarı */}
          <Particles kind="up" count={5} color={alpha(TH.accent, 0.5)} size={1.5} seed={4} minDur={16} maxDur={24} glow={false} />
        </Ambient>
      }
      /* ── Bölmə adları — Claude Design-dakı metafora (Phase 41) ──────────
         AZ mətnlər birbaşa dizayn faylındandır; EN/RU həmin metaforanın
         qarşılığıdır. Verilməyən bölmə sistemin öz tərcüməsini işlədir.
         ⚠ `kicker` sətirdir (hər üç dildə eyni qalır — qısa etiketdir),
         `title` isə {az,en,ru} obyektidir. */
      sectionLabels={{
        countdown: { kicker: 'BOARDING',
                    title: { az: 'Boarding başlayır', en: 'Boarding begins', ru: 'Посадка начнётся' } },
        venue:     { kicker: 'GATE',
                    title: { az: 'Gate · təyinat', en: 'Gate · destination', ru: 'Гейт · пункт назначения' } },
        program:   { kicker: 'SCHEDULE',
                    title: { az: 'Uçuş cədvəli', en: 'Flight schedule', ru: 'Расписание рейса' } },
        dresscode: { kicker: 'ATTIRE',
                    title: { az: 'Cabin attire · geyim', en: 'Cabin attire', ru: 'Дресс-код салона' } },
        seating:   { kicker: 'SEAT',
                    title: { az: 'Seat assignment', en: 'Seat assignment', ru: 'Ваше место' } },
        gallery:   { kicker: 'ALBUM',
                    title: { az: 'In-flight album', en: 'In-flight album', ru: 'Бортовой альбом' } },
        rsvp:      { kicker: 'CHECK-IN',
                    title: { az: 'Check-in · İştirak təsdiqi', en: 'Check-in · RSVP', ru: 'Регистрация · Подтверждение' } },
        guestbook: { kicker: 'NOTES',
                    title: { az: 'Sərnişin qeydləri', en: 'Passenger notes', ru: 'Записи пассажиров' } },
      }}
      design={{
        /* ── Vizual şəxsiyyət (Phase 42) ─────────────────────────────
           Yuxarıdan soyuq teal işıq (kabin), aşağıda naranc aksentin izi.
           Tonlar dizayn faylındakı bölmə fonlarıdır; `pageWash` isə
           preview kartı ilə eyni dildə imza qradiyentidir — beləliklə
           vitrindəki görüntü ilə dəvətnamənin içi uyğun gəlir. */
        sectionTones: ['transparent', '#111A1F'],
        pageWash:
          'radial-gradient(120% 60% at 50% 0%, rgba(23,48,57,.75), transparent 62%), '
          + 'radial-gradient(80% 45% at 88% 96%, rgba(226,84,47,.10), transparent 70%)',
        programStyle: 'table',
        programRule: 'dashed',   /* uçuş biletinin perforasiya dili */
        /* Location — xeritə şəklinin şablona məxsus rəng emalı (bax MapSection) */
        /* Xəritənin rəng emalı — Claude Design-dakı DƏQİQ filter zənciri.
           ⚠ tintOpacity 0-dır: dizayn ayrıca tint QATI işlətmir, rəngi
           filter-in özü verir. Tint qatı vivid aksentlə xəritəni
           boyayıb küçə adlarını oxunmaz edirdi. */
        map: { opacity: 0.85, filter: 'grayscale(1) sepia(.2) hue-rotate(170deg) saturate(1.5) brightness(.5) contrast(1.1)', tintOpacity: 0 },
        radius: 0,
        buttonRadius: 0,
        align: 'left',
        headingTransform: 'uppercase',
        kicker: '.24em',
        dark: true,
        alternate: true,
        headingColor: TH.accent,
        accentColor: TH.primary,
        ctaBg: TH.primary,
        ctaText: '#0E1418',
      }}
    />
  )
}
