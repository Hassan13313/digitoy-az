import TemplateShell, { alpha } from '../_shared/TemplateShell'
import OpeningFrame, { NameRow, OpeningMeta } from '../_shared/OpeningFrame'
import { Ambient } from '../_shared/motion'
import { getTemplateTheme } from '../templateConfig'

/* ─────────────────────────────────────────────────────────────────────────────
   GAZETTE — Claude Design «Seçilmiş 7» · 06

   Design dili: qəzetin xüsusi buraxılışı. Kağız ağı (#FBFAF6), klişe
   qırmızısı (#8A2B22), qalın qara başlıq qaydaları və Libre Baskerville
   mətn yığımı. Sütunlu görüntü, hər şey xəttlə ayrılıb.

   Açılış: qəzetin başlığı (masthead) yazılır, altından qalın qayda xətti
   çəkilir, sütunlar yığılır, sonra əsas xəbər başlığı — cütlüyün adı —
   düşür. Çıxış `up` — səhifə çevrilir.

   ⚠ BU AÇIQ FONLU ŞABLONDUR (`dark: false`) — ambient məzmunun altındadır.
   ⚠ Qəzet dili «ornamentsizdir»: `radius: 0`, halqa/parıltı YOXDUR, yalnız
   xətt və tipoqrafiya. Ona görə `orbs="none"` və ambient çox sakitdir.
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('gazette')

const DISP = TH.fonts.heading   /* Libre Baskerville */

const KEYFRAMES = `
@keyframes tpl-hint  { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes tpl-eq    { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
/* Sütun sətirləri bir-bir yığılır */
@keyframes gz-line   { from { opacity:0; transform: scaleX(0) } to { opacity:1; transform: scaleX(1) } }
/* Kağız dənəsi — çox zəif */
@keyframes gz-grain  { 0%,100% { opacity:.05 } 50% { opacity:.1 } }
`

/* Sütun «mətni» — dekorativ sətirlər (real mətn deyil, yığım təsviri).
   Enlər sabitdir: təsadüfi olsaydı hər render-də sıçrayardı. */
const COL_A = [100, 92, 97, 86, 100, 74]
const COL_B = [100, 88, 95, 100, 81]

function Column({ widths, delay, color }) {
  return (
    <span aria-hidden="true" style={{ flex: 1, display: 'block' }}>
      {widths.map((w, i) => (
        <span key={i} style={{
          display: 'block', width: `${w}%`, height: 2, marginBottom: 4,
          background: color, transformOrigin: 'left',
          animation: `gz-line .5s ease-out ${(delay + i * 0.07).toFixed(2)}s both`,
        }} />
      ))}
    </span>
  )
}

function Opening(props) {
  const { theme, weddingData, isCouple } = props

  const dateStr = String(weddingData.date || '').split('-').reverse().join('.')

  return (
    <OpeningFrame
      {...props}
      exit="up"
      duration={900}
      label="Buraxılışı oxu"
      ctaDelay={3.9}
      hintDelay={4.4}
      orbs="none"
      veil="#FBFAF6"
      background="linear-gradient(170deg, #FBFAF6 0%, #F0EDE6 60%, #E4E0D7 100%)"
      ctaStyle={{
        border: `1px solid ${theme.accent}`,
        color: theme.accent, background: 'rgba(255,255,255,.7)',
        fontFamily: DISP, letterSpacing: '.16em', textTransform: 'uppercase',
      }}
      ctaGleam="rgba(255,255,255,.9)"
      hintColor={alpha(theme.muted, 0.95)}
    >
      {/* ── QƏZET SƏHİFƏSİ ── */}
      <div style={{
        position: 'relative', width: 'min(86vw, 300px)', marginInline: 'auto',
        background: '#FBFAF6', padding: '16px 15px 18px',
        boxShadow: '0 24px 54px rgba(22,21,18,.2)',
        animation: 'tpl-rise .9s cubic-bezier(.22,.61,.36,1) .7s both',
      }}>
        {/* Üst xırda sətir — buraxılış məlumatı */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 7, letterSpacing: '.18em', textTransform: 'uppercase', color: theme.muted,
          animation: 'tpl-rise .6s ease-out 1.1s both',
        }}>
          <span>Xüsusi buraxılış</span>
          <span>{dateStr}</span>
        </div>

        {/* MASTHEAD */}
        <div style={{
          fontFamily: DISP, fontWeight: 700, fontSize: 'clamp(16px, 5.6vw, 21px)',
          letterSpacing: '-.02em', color: theme.accent, textAlign: 'center', marginTop: 7,
          animation: 'tpl-rise .8s ease-out 1.3s both',
        }}>THE GAZETTE</div>

        {/* Qalın qayda xətti */}
        <span aria-hidden="true" style={{
          display: 'block', height: 2, background: theme.accent, margin: '7px 0 4px',
          transformOrigin: 'left', animation: 'tpl-drawx .7s cubic-bezier(.22,.61,.36,1) 1.7s both',
        }} />
        <span aria-hidden="true" style={{
          display: 'block', height: 1, background: alpha(theme.accent, 0.4), marginBottom: 12,
          transformOrigin: 'left', animation: 'tpl-drawx .7s cubic-bezier(.22,.61,.36,1) 1.85s both',
        }} />

        {/* Klişe qırmızısı ilə rubrika */}
        <div style={{
          fontSize: 7.5, letterSpacing: '.24em', textTransform: 'uppercase',
          color: theme.primary, textAlign: 'center', marginBottom: 9,
          animation: 'tpl-rise .6s ease-out 2.0s both',
        }}>Toy elanı · Bakı</div>

        {/* ƏSAS XƏBƏR BAŞLIĞI — adlar */}
        <NameRow
          theme={theme} weddingData={weddingData} isCouple={isCouple}
          delay={2.3} step={0.2} stacked
          size="clamp(19px, 6.6vw, 25px)" ampSize="clamp(14px, 4.8vw, 18px)"
          font={DISP} color={theme.accent} ampColor={theme.primary}
          style={{ fontWeight: 700, lineHeight: 1.2, textAlign: 'center' }}
        />

        {/* Sütunlar — yığım təsviri */}
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <Column widths={COL_A} delay={3.0} color={alpha(theme.muted, 0.45)} />
          <span aria-hidden="true" style={{
            width: 1, background: alpha(theme.accent, 0.2), transformOrigin: 'top',
            animation: 'tpl-drawy .6s ease-out 3.0s both',
          }} />
          <Column widths={COL_B} delay={3.15} color={alpha(theme.muted, 0.45)} />
        </div>

        {/* Alt qayda + məkan */}
        <span aria-hidden="true" style={{
          display: 'block', height: 1, background: alpha(theme.accent, 0.35), margin: '12px 0 8px',
          transformOrigin: 'left', animation: 'tpl-drawx .6s ease-out 3.5s both',
        }} />
        <div style={{
          fontFamily: DISP, fontSize: 9, color: theme.secondary, textAlign: 'center',
          animation: 'tpl-rise .6s ease-out 3.6s both',
        }}>{weddingData.venueName || ''}</div>
      </div>

      <OpeningMeta
        text={weddingData.time ? `Saat ${weddingData.time}` : ''}
        color={alpha(theme.muted, 0.95)}
        delay={3.8}
        style={{ marginTop: 20, letterSpacing: '.26em' }}
      />
    </OpeningFrame>
  )
}

export default function GazetteTemplate(props) {
  return (
    <TemplateShell
      {...props}
      templateId="gazette"
      theme={TH}
      /* ⚠ Açıq fonlu şablon — blend qatı kağız ağını çirkləndirir */
      ambientBlend="none"
      Opening={Opening}
      keyframes={KEYFRAMES}
      ambient={
        <Ambient>
          {/* Kağız dənəsi — qəzet kağızının toxuması */}
          <span aria-hidden="true" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.07,
            backgroundImage: `radial-gradient(circle at 22% 34%, ${alpha(TH.accent, 0.5)} 0 .6px, transparent 1px), radial-gradient(circle at 71% 68%, ${alpha(TH.secondary, 0.4)} 0 .5px, transparent 1px)`,
            backgroundSize: '8px 8px, 12px 12px',
            animation: 'gz-grain 5s steps(3) infinite',
          }} />
          {/* Klişe qırmızısının çox zəif izi */}
          <span style={{
            position: 'absolute', right: '-10%', top: '18%', width: 300, height: 300,
            borderRadius: '50%', opacity: 0.08,
            background: `radial-gradient(circle, ${TH.primary}, transparent 66%)`,
            filter: 'blur(54px)', animation: 'ab-pulse 21s ease-in-out infinite',
          }} />
          {/* Kağızın kölgəsi — soldan zəif boz */}
          <span style={{
            position: 'absolute', left: '-12%', bottom: '10%', width: 320, height: 260,
            borderRadius: '50%', opacity: 0.1,
            background: `radial-gradient(ellipse, ${TH.secondary}, transparent 68%)`,
            filter: 'blur(50px)', animation: 'ab-pulse 26s ease-in-out 7s infinite',
          }} />
        </Ambient>
      }
      /* ── Bölmə adları — Claude Design-dakı metafora (Phase 41) ──────────
         AZ mətnlər birbaşa dizayn faylındandır; EN/RU həmin metaforanın
         qarşılığıdır. Verilməyən bölmə sistemin öz tərcüməsini işlədir.
         ⚠ `kicker` sətirdir (hər üç dildə eyni qalır — qısa etiketdir),
         `title` isə {az,en,ru} obyektidir. */
      sectionLabels={{
        countdown: { kicker: 'EDITION',
                    title: { az: 'Nəşrə qalan', en: 'Until publication', ru: 'До выхода номера' } },
        venue:     { kicker: 'PAGE 4',
                    title: { az: 'Hadisə yeri', en: 'Scene of the event', ru: 'Место события' } },
        program:   { kicker: 'SCHEDULE',
                    title: { az: 'Günün cədvəli', en: 'Schedule of the day', ru: 'Расписание дня' } },
        dresscode: { kicker: 'NOTICE',
                    title: { az: 'Geyim elanı', en: 'Dress notice', ru: 'Объявление о дресс-коде' } },
        seating:   { kicker: 'SEATING',
                    title: { az: 'Oxucu yeri', en: 'Reader’s seat', ru: 'Место читателя' } },
        gallery:   { kicker: 'PHOTO NEWS',
                    title: { az: 'Fotoxəbər', en: 'Photo report', ru: 'Фоторепортаж' } },
        rsvp:      { kicker: 'REPLY',
                    title: { az: 'Redaksiyaya cavab', en: 'Reply to the editor', ru: 'Ответ в редакцию' } },
        guestbook: { kicker: 'LETTERS',
                    title: { az: 'Oxucu məktubları', en: 'Letters to the editor', ru: 'Письма читателей' } },
      }}
      design={{
        /* ── Vizual şəxsiyyət (Phase 42) ─────────────────────────────
           Qəzet kağızı: yuxarıda təmiz vərəq, klişe qırmızısının izi, altda mürəkkəb kölgəsi.
           Tonlar dizayn faylındakı bölmə fonlarıdır; `pageWash` isə
           preview kartı ilə eyni dildə imza qradiyentidir — beləliklə
           vitrindəki görüntü ilə dəvətnamənin içi uyğun gəlir. */
        sectionTones: ['transparent', '#F0EDE6', 'transparent', '#E9E5DC'],
        pageWash:
          'radial-gradient(100% 45% at 50% 0%, rgba(251,250,246,.95), transparent 58%), '
          + 'radial-gradient(70% 35% at 96% 16%, rgba(138,43,34,.07), transparent 70%), '
          + 'linear-gradient(180deg, transparent 60%, rgba(22,21,18,.07) 100%)',
        programStyle: 'table',
        /* Location — xeritə şəklinin şablona məxsus rəng emalı (bax MapSection) */
        /* Xəritənin rəng emalı — Claude Design-dakı DƏQİQ filter zənciri.
           ⚠ tintOpacity 0-dır: dizayn ayrıca tint QATI işlətmir, rəngi
           filter-in özü verir. Tint qatı vivid aksentlə xəritəni
           boyayıb küçə adlarını oxunmaz edirdi. */
        map: { opacity: 0.9, filter: 'grayscale(1) contrast(1.3) brightness(1.06)', tintOpacity: 0 },
        radius: 0,
        buttonRadius: 0,
        align: 'left',
        headingTransform: 'none',
        kicker: '.24em',
        dark: false,
        alternate: true,
        headingColor: TH.accent,
        accentColor: TH.primary,
        ctaBg: TH.accent,
        ctaText: '#FBFAF6',
      }}
    />
  )
}
