import TemplateShell, { alpha } from '../_shared/TemplateShell'
import OpeningFrame, { Kicker, NameRow, Ornament, OpeningMeta } from '../_shared/OpeningFrame'
import { Ambient } from '../_shared/motion'
import { getTemplateTheme } from '../templateConfig'

/* ─────────────────────────────────────────────────────────────────────────────
   MEDITERRANEAN — Claude Design «Seçilmiş 7» · 05

   Design dili: Amalfi sahili. Kadrın ortasından keçən ÜFÜQ XƏTTİ — yuxarısı
   açıq səma, aşağısı dəniz firuzəsi (#2E6E78); sağ yuxarıda terrakota günəş
   (#D98E5A), suda paralel işıq zolaqları.

   Açılış: üfüq xətti soldan-sağa çəkilir, günəş qalxır, suda dalğa zolaqları
   bir-bir görünür, adlar üfüqün ÜSTÜNDƏ yazılır. Çıxış `fade`.

   ⚠ BU AÇIQ FONLU ŞABLONDUR (`dark: false`, background #FCFAF5) — ambient
   qatı TemplateShell qaydasına görə məzmunun ALTINDA qalır, mətn ağarmır.
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('mediterranean')

const DISP = TH.fonts.heading   /* Cormorant Garamond */

/* Dizayn faylındakı səma/su qradiyenti — açılışda və ambient-də eynidir */
const SKY = '#EAF1F2'
const SKY2 = '#D7E6E7'
const SEA = '#2E6E78'
const SEA2 = '#1E5560'

const KEYFRAMES = `
@keyframes tpl-hint  { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes tpl-eq    { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
/* Günəş üfüqdən qalxır */
@keyframes md-sun    { from { opacity:0; transform: translateY(22px) scale(.7) } to { opacity:1; transform: none } }
/* Suyun üzərində işıq zolaqları yavaş sürüşür */
@keyframes md-tide   { 0%,100% { transform: translateX(-6px) } 50% { transform: translateX(6px) } }
/* Dalğa zolağı görünür */
@keyframes md-wave   { from { opacity:0; transform: scaleX(.4) } to { opacity:.5; transform: scaleX(1) } }
/* Günəşin nəfəsi */
@keyframes md-glow   { 0%,100% { opacity:.5 } 50% { opacity:.9 } }
`

function Opening(props) {
  const { theme, weddingData, isCouple } = props

  const dateStr = String(weddingData.date || '').split('-').reverse().join(' · ')

  return (
    <OpeningFrame
      {...props}
      exit="fade"
      duration={900}
      label="Dəvətnaməni aç"
      ctaDelay={4.0}
      hintDelay={4.5}
      orbs="none"
      veil="#FCFAF5"
      background="linear-gradient(180deg, #FCFAF5 0%, #F2EFE7 100%)"
      ctaStyle={{
        border: `1px solid ${alpha(theme.primary, 0.55)}`,
        color: theme.primary, background: 'rgba(255,255,255,.72)',
        letterSpacing: '.18em', textTransform: 'uppercase',
      }}
      ctaGleam="rgba(255,255,255,.95)"
      hintColor={alpha(theme.muted, 0.95)}
    >
      {/* ── SAHİL KADRI ── */}
      <div style={{
        position: 'relative', width: 'min(86vw, 300px)', height: 'min(64vw, 222px)',
        marginInline: 'auto', overflow: 'hidden',
        background: `linear-gradient(180deg, ${SKY} 0%, ${SKY2} 58%, ${SEA} 58%, ${SEA2} 100%)`,
        boxShadow: '0 26px 58px rgba(32,52,58,.22)',
      }}>
        {/* Günəş — sağ yuxarıda, üfüqdən qalxır */}
        <span aria-hidden="true" style={{
          position: 'absolute', right: '9%', top: '7%', width: 44, height: 44,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.secondary, 0.95)}, ${alpha(theme.secondary, 0.15)} 68%, transparent 72%)`,
          animation: 'md-sun 1.2s cubic-bezier(.22,.61,.36,1) 1.1s both',
        }}>
          <span style={{
            position: 'absolute', inset: -14, borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.secondary, 0.4)}, transparent 66%)`,
            animation: 'md-glow 6s ease-in-out 2.4s infinite',
          }} />
        </span>

        {/* ÜFÜQ XƏTTİ — soldan sağa çəkilir */}
        <span aria-hidden="true" style={{
          position: 'absolute', left: 0, right: 0, top: '58%', height: 1,
          background: 'rgba(255,255,255,.75)', transformOrigin: 'left',
          animation: 'tpl-drawx 1s cubic-bezier(.22,.61,.36,1) .7s both',
        }} />

        {/* Suda işıq zolaqları — bir-bir görünür, sonra yavaş yellənir */}
        <span aria-hidden="true" style={{
          position: 'absolute', left: 0, right: 0, top: '58%', bottom: 0,
          animation: 'md-tide 9s ease-in-out 3s infinite',
        }}>
          {[9, 24, 42, 63, 84].map((t, i) => (
            <span key={t} style={{
              position: 'absolute', left: '8%', right: '8%', top: `${t}%`, height: 1,
              background: 'rgba(255,255,255,.55)', transformOrigin: 'center',
              animation: `md-wave .7s ease-out ${(1.5 + i * 0.13).toFixed(2)}s both`,
            }} />
          ))}
        </span>

        {/* Adlar — üfüqün ÜSTÜNDƏ, səmanın içində */}
        {/* ⚠ Adlar TAM olaraq səmanın (üfüqdən yuxarı 58%) içində qalmalıdır:
            `stacked` üç sətirdir və böyük ölçüdə ikinci ad dənizin tünd
            firuzəsinin üstünə düşüb oxunmaz olurdu. Ölçü + sətir hündürlüyü
            bu çərçivəyə görə seçilib. */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: '7%', padding: '0 14px' }}>
          <NameRow
            theme={theme} weddingData={weddingData} isCouple={isCouple}
            delay={2.4} step={0.2} stacked
            size="clamp(17px, 5.6vw, 22px)" ampSize="clamp(12px, 4vw, 15px)"
            font={DISP} color={theme.accent} ampColor={theme.secondary}
            style={{ fontWeight: 500, lineHeight: 1.08, textAlign: 'center' }}
          />
        </div>

        {/* Suyun üstündəki terrakota nöqtə — məkan işarəsi */}
        <span aria-hidden="true" style={{
          position: 'absolute', left: '50%', top: '69%', width: 6, height: 6,
          marginLeft: -3, borderRadius: '50%', background: theme.secondary,
          boxShadow: `0 0 0 6px ${alpha(theme.secondary, 0.25)}`,
          animation: 'tpl-cta .8s cubic-bezier(.2,.9,.25,1) 3.1s both',
        }} />
      </div>

      <Kicker text="Dəvətnamə" color={alpha(theme.muted, 0.95)} lineColor={alpha(theme.primary, 0.5)} delay={3.2} style={{ marginTop: 26 }} />

      <Ornament color={theme.primary} mark="dot" delay={3.6} width={30} style={{ marginTop: 15 }} />

      <OpeningMeta
        text={[dateStr, weddingData.venueName].filter(Boolean).join(' · ')}
        color={alpha(theme.muted, 0.95)}
        delay={3.8}
        style={{ marginTop: 13, letterSpacing: '.24em' }}
      />
    </OpeningFrame>
  )
}

export default function MediterraneanTemplate(props) {
  return (
    <TemplateShell
      {...props}
      templateId="mediterranean"
      theme={TH}
      /* ⚠ Açıq fonlu şablon — blend qatı ağ mətni yuyardı, ona görə 'none' */
      ambientBlend="none"
      Opening={Opening}
      keyframes={KEYFRAMES}
      ambient={
        <Ambient>
          {/* Dəniz işığı — səhifənin altından zəif firuzə parıltı */}
          <span style={{
            position: 'absolute', left: '50%', bottom: '-14%', width: 460, height: 300,
            marginLeft: -230, borderRadius: '50%', opacity: 0.16,
            background: `radial-gradient(ellipse, ${TH.primary}, transparent 68%)`,
            filter: 'blur(52px)', animation: 'ab-pulse 15s ease-in-out infinite',
          }} />
          {/* Günəş istiliyi — sağ yuxarıdan terrakota */}
          <span style={{
            position: 'absolute', right: '-12%', top: '6%', width: 300, height: 300,
            borderRadius: '50%', opacity: 0.14,
            background: `radial-gradient(circle, ${TH.secondary}, transparent 66%)`,
            filter: 'blur(48px)', animation: 'ab-pulse 19s ease-in-out 4s infinite',
          }} />
          {/* Su səthinin zolaqları — çox zəif, bütün səhifədə */}
          <span aria-hidden="true" style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: '46%', opacity: 0.1,
            backgroundImage: `repeating-linear-gradient(180deg, ${alpha(TH.primary, 0.55)} 0 1px, transparent 1px 9px)`,
            animation: 'md-tide 14s ease-in-out infinite',
          }} />
        </Ambient>
      }
      /* ── Bölmə adları — Claude Design-dakı metafora (Phase 41) ──────────
         AZ mətnlər birbaşa dizayn faylındandır; EN/RU həmin metaforanın
         qarşılığıdır. Verilməyən bölmə sistemin öz tərcüməsini işlədir.
         ⚠ `kicker` sətirdir (hər üç dildə eyni qalır — qısa etiketdir),
         `title` isə {az,en,ru} obyektidir. */
      sectionLabels={{
        countdown: { kicker: 'SUNSET',
                    title: { az: 'Günəş batana qədər', en: 'Until sunset', ru: 'До заката' } },
        venue:     { kicker: 'COAST',
                    title: { az: 'Sahildəki məkan', en: 'The seaside venue', ru: 'Место у моря' } },
        program:   { kicker: 'EVENING',
                    title: { az: 'Axşamın axarı', en: 'Flow of the evening', ru: 'Ход вечера' } },
        dresscode: { kicker: 'LINEN',
                    title: { az: 'Geyim', en: 'What to wear', ru: 'Дресс-код' } },
        seating:   { kicker: 'TABLE',
                    title: { az: 'Masanız', en: 'Your table', ru: 'Ваш столик' } },
        gallery:   { kicker: 'ALBUM',
                    title: { az: 'Sahil albomu', en: 'Coastal album', ru: 'Морской альбом' } },
        rsvp:      { kicker: 'RSVP',
                    title: { az: 'Bizə qoşulursunuz?', en: 'Will you join us?', ru: 'Вы присоединитесь?' } },
        guestbook: { kicker: 'NOTES',
                    title: { az: 'Sahil məktubları', en: 'Seaside notes', ru: 'Записки с побережья' } },
      }}
      design={{
        /* ── Vizual şəxsiyyət (Phase 42) ─────────────────────────────
           Üfüq: yuxarıda səma, sağ yuxarıda terrakota günəş, aşağıda dəniz.
           Tonlar dizayn faylındakı bölmə fonlarıdır; `pageWash` isə
           preview kartı ilə eyni dildə imza qradiyentidir — beləliklə
           vitrindəki görüntü ilə dəvətnamənin içi uyğun gəlir. */
        /* Dizaynın sahil ritmi: şəffaf → yumşaq mavi → şəffaf → qum */
        sectionTones: ['transparent', 'rgba(215,230,231,.85)', 'transparent', 'rgba(242,239,231,.85)'],
        pageWash:
          /* ⚠ Dəyərlər Claude Design-ın ÖZ qradiyentlərindəndir. Əvvəlki
             variant çox solğun idi (dəniz .14, terrakota .22) və səhifə
             «boz/ölü» görünürdü — dizaynda isə İSTİ KƏHRƏBA işığı
             (rgba(255,241,214,.85) / rgba(255,224,178,.5)) və daha güclü
             dəniz (rgba(46,110,120,.32)) var. Yay hissini məhz o verir. */
          'radial-gradient(75% 30% at 88% 6%, rgba(255,224,178,.55), transparent 70%), '
          + 'linear-gradient(180deg, #D7E6E7 0%, rgba(234,241,242,.75) 22%, '
          + 'rgba(252,250,245,0) 46%, rgba(46,110,120,.14) 76%, rgba(46,110,120,.32) 100%)',
        /* Location — xeritə şəklinin şablona məxsus rəng emalı (bax MapSection) */
        /* Xəritənin rəng emalı — Claude Design-dakı DƏQİQ filter zənciri.
           ⚠ tintOpacity 0-dır: dizayn ayrıca tint QATI işlətmir, rəngi
           filter-in özü verir. Tint qatı vivid aksentlə xəritəni
           boyayıb küçə adlarını oxunmaz edirdi. */
        map: { opacity: 0.9, filter: 'grayscale(1) sepia(.22) hue-rotate(150deg) saturate(1.35) brightness(1.02) contrast(.95)', tintOpacity: 0 },
        radius: 2,
        buttonRadius: 100,
        align: 'center',
        headingTransform: 'none',
        kicker: '.24em',
        dark: false,
        alternate: true,
        headingColor: TH.accent,
        accentColor: TH.primary,
        ctaBg: TH.primary,
        ctaText: '#FCFAF5',
      }}
    />
  )
}
