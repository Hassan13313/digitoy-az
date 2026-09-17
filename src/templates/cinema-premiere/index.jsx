import TemplateShell, { alpha } from '../_shared/TemplateShell'
import OpeningFrame, { Kicker, NameRow, Ornament, OpeningMeta } from '../_shared/OpeningFrame'
import { Ambient, Scan, Beam } from '../_shared/motion'
import { getTemplateTheme } from '../templateConfig'

/* ─────────────────────────────────────────────────────────────────────────────
   CINEMA PREMIERE — Claude Design «Seçilmiş 7» · 02

   Design dili: toy bir filmdir. 2.39:1 letterbox kadr, qızıl titrlər
   (Bebas Neue), premyera afişası ritmi, proyektor işığı və plyonka dənəsi.

   Açılış: qaranlıq zalda letterbox zolaqları açılır, kadrın içində adlar
   titr kimi qalxır, üzərindən proyektor işığı süpürür, altda «BİR ÖMÜRLÜK
   FİLM» yazılır. Çıxış `fade` — kadr kəsilir.

   ⚠ Bebas Neue YALNIZ böyük hərfdə işləyir (kiçik hərf variantı yoxdur),
   ona görə bütün başlıqlarda `textTransform: uppercase` məcburidir —
   `design.headingTransform` da uppercase-dir.
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('cinema-premiere')

const DISP = TH.fonts.heading   /* Bebas Neue */
const BODY = TH.fonts.body      /* Archivo    */

const KEYFRAMES = `
@keyframes tpl-hint  { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes tpl-eq    { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
/* Letterbox zolaqları açılır (yuxarı və aşağı) */
@keyframes cp-barT   { from { transform: translateY(0) } to { transform: translateY(-100%) } }
@keyframes cp-barB   { from { transform: translateY(0) } to { transform: translateY(100%) } }
/* Proyektor işığı kadrın üstündən süpürür */
@keyframes cp-sweep  { 0% { transform: translateX(-130%) skewX(-14deg) } 100% { transform: translateX(330%) skewX(-14deg) } }
/* Plyonka dənəsi — çox zəif titrəyiş */
@keyframes cp-grain  { 0%,100% { opacity:.05 } 50% { opacity:.12 } }
/* Proyektor konusunun nəfəsi */
@keyframes cp-lamp   { 0%,100% { opacity:.18 } 50% { opacity:.34 } }
`

function Opening(props) {
  const { theme, weddingData, isCouple } = props

  /* Premyera afişası tarixi nöqtə ilə verir: «21.11.2026» */
  const dateStr = String(weddingData.date || '').split('-').reverse().join('.')

  return (
    <OpeningFrame
      {...props}
      exit="fade"
      duration={900}
      label="Premyeranı aç"
      ctaDelay={4.0}
      hintDelay={4.5}
      orbs="none"
      veil="#07080A"
      background="radial-gradient(130% 90% at 50% 18%, #15181C, #07080A 74%)"
      ctaStyle={{
        border: `1px solid ${alpha(theme.primary, 0.65)}`,
        color: theme.primary, background: 'rgba(0,0,0,.35)',
        fontFamily: BODY, letterSpacing: '.22em', textTransform: 'uppercase',
      }}
      ctaGleam={alpha(theme.secondary, 0.95)}
      hintColor={alpha(theme.muted, 0.95)}
    >
      {/* Proyektor konusu — yuxarıdan aşağı açılan işıq */}
      <span aria-hidden="true" style={{
        position: 'absolute', left: '50%', top: '-12%', transform: 'translateX(-50%)',
        width: '150%', height: '78%', pointerEvents: 'none',
        background: `conic-gradient(from 168deg at 50% 0%, transparent 0deg, ${alpha(theme.primary, 0.16)} 12deg, transparent 26deg)`,
        filter: 'blur(14px)', animation: 'cp-lamp 7s ease-in-out infinite',
      }} />

      {/* ── LETTERBOX KADR ── */}
      <div style={{
        position: 'relative', width: 'min(88vw, 330px)', aspectRatio: '2.39 / 1',
        marginInline: 'auto', overflow: 'hidden',
        border: `1px solid ${alpha(theme.primary, 0.4)}`,
        background: 'linear-gradient(180deg, #0E1013, #07080A)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Açılan zolaqlar — kadrın içindən yığışırlar */}
        <span aria-hidden="true" style={{
          position: 'absolute', left: 0, right: 0, top: 0, height: '50%', background: '#07080A',
          animation: 'cp-barT 1.1s cubic-bezier(.65,0,.35,1) .7s both', zIndex: 3,
        }} />
        <span aria-hidden="true" style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%', background: '#07080A',
          animation: 'cp-barB 1.1s cubic-bezier(.65,0,.35,1) .7s both', zIndex: 3,
        }} />

        {/* Titr — adlar */}
        <NameRow
          theme={theme} weddingData={weddingData} isCouple={isCouple}
          delay={1.9} step={0.2}
          size="clamp(24px, 8.4vw, 34px)" ampSize="clamp(18px, 6vw, 24px)"
          font={DISP} color={theme.accent} ampColor={theme.primary}
          style={{ letterSpacing: '.03em', textTransform: 'uppercase', lineHeight: 1, padding: '0 14px' }}
        />

        <div style={{
          fontFamily: BODY, fontSize: 'clamp(6.5px, 2.1vw, 8px)', letterSpacing: '.3em',
          textTransform: 'uppercase', color: theme.primary, marginTop: 8,
          animation: 'tpl-rise .8s ease-out 2.7s both',
        }}>bir ömürlük film</div>

        {/* Proyektor işığı kadrın üstündən keçir */}
        <span aria-hidden="true" style={{
          position: 'absolute', top: 0, bottom: 0, left: 0, width: '30%', pointerEvents: 'none',
          background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.14), transparent)',
          animation: 'cp-sweep 6.5s linear 3s infinite',
        }} />
      </div>

      <Kicker text="Premyera" color={alpha(theme.muted, 0.95)} lineColor={alpha(theme.primary, 0.5)} delay={3.1} style={{ marginTop: 26 }} />

      <Ornament color={theme.primary} mark="dot" delay={3.5} width={30} style={{ marginTop: 16 }} />

      <OpeningMeta
        text={[dateStr, weddingData.venueName].filter(Boolean).join(' · ')}
        color={alpha(theme.muted, 0.95)}
        delay={3.7}
        style={{ marginTop: 14, letterSpacing: '.26em' }}
      />
    </OpeningFrame>
  )
}

export default function CinemaPremiereTemplate(props) {
  return (
    <TemplateShell
      {...props}
      templateId="cinema-premiere"
      theme={TH}
      Opening={Opening}
      keyframes={KEYFRAMES}
      ambient={
        <Ambient>
          {/* Proyektor işığı — səhifə boyu çox yavaş */}
          <Beam color={alpha(TH.primary, 0.3)} width="26%" duration={17} delay={0} />
          {/* Skan xətti — köhnə plyonka hissi */}
          <Scan color={alpha(TH.secondary, 0.35)} duration={9} delay={3} />
          {/* Plyonka dənəsi — çox zəif, bütün ekranda */}
          <span aria-hidden="true" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.08,
            backgroundImage: `radial-gradient(circle at 20% 30%, ${alpha(TH.accent, 0.5)} 0 .6px, transparent 1px), radial-gradient(circle at 70% 65%, ${alpha(TH.accent, 0.4)} 0 .5px, transparent 1px)`,
            backgroundSize: '7px 7px, 11px 11px',
            animation: 'cp-grain 3.4s steps(3) infinite',
          }} />
        </Ambient>
      }
      /* ── Bölmə adları — Claude Design-dakı metafora (Phase 41) ──────────
         AZ mətnlər birbaşa dizayn faylındandır; EN/RU həmin metaforanın
         qarşılığıdır. Verilməyən bölmə sistemin öz tərcüməsini işlədir.
         ⚠ `kicker` sətirdir (hər üç dildə eyni qalır — qısa etiketdir),
         `title` isə {az,en,ru} obyektidir. */
      sectionLabels={{
        countdown: { kicker: 'SHOWTIME',
                    title: { az: 'Seansa qalan vaxt', en: 'Time to showtime', ru: 'До начала сеанса' } },
        venue:     { kicker: 'LOC · 01',
                    title: { az: 'Çəkiliş məkanı', en: 'Filming location', ru: 'Место съёмок' } },
        program:   { kicker: 'SCHEDULE',
                    title: { az: 'Çəkiliş cədvəli', en: 'Shooting schedule', ru: 'График съёмок' } },
        dresscode: { kicker: 'WARDROBE',
                    title: { az: 'Kostyum şöbəsi', en: 'Wardrobe department', ru: 'Костюмерная' } },
        seating:   { kicker: 'SEATING',
                    title: { az: 'Zal planı', en: 'Seating chart', ru: 'План зала' } },
        gallery:   { kicker: 'STILLS',
                    title: { az: 'Kadrlar', en: 'Stills', ru: 'Кадры' } },
        rsvp:      { kicker: 'GUEST LIST',
                    title: { az: 'Qonaq siyahısı', en: 'Guest list', ru: 'Список гостей' } },
        guestbook: { kicker: 'REVIEWS',
                    title: { az: 'Tənqidçi rəyləri', en: 'Reviews', ru: 'Отзывы' } },
      }}
      design={{
        /* ── Vizual şəxsiyyət (Phase 42) ─────────────────────────────
           Proyektor konusu yuxarıdan, zalın qaranlığı aşağıdan.
           Tonlar dizayn faylındakı bölmə fonlarıdır; `pageWash` isə
           preview kartı ilə eyni dildə imza qradiyentidir — beləliklə
           vitrindəki görüntü ilə dəvətnamənin içi uyğun gəlir. */
        sectionTones: ['transparent', '#0D1114', '#141013', '#101215', '#151116'],
        pageWash:
          'radial-gradient(100% 50% at 50% 0%, rgba(217,164,65,.10), transparent 60%), '
          + 'radial-gradient(120% 70% at 50% 100%, rgba(20,22,26,.9), transparent 70%)',
        programStyle: 'table',
        /* Location — xeritə şəklinin şablona məxsus rəng emalı (bax MapSection) */
        /* Xəritənin rəng emalı — Claude Design-dakı DƏQİQ filter zənciri.
           ⚠ tintOpacity 0-dır: dizayn ayrıca tint QATI işlətmir, rəngi
           filter-in özü verir. Tint qatı vivid aksentlə xəritəni
           boyayıb küçə adlarını oxunmaz edirdi. */
        map: { opacity: 0.8, filter: 'grayscale(1) contrast(1.28) brightness(.42)', tintOpacity: 0 },
        radius: 0,
        buttonRadius: 0,
        align: 'center',
        headingTransform: 'uppercase',
        kicker: '.3em',
        dark: true,
        alternate: true,
        headingColor: TH.accent,
        accentColor: TH.primary,
        ctaBg: TH.primary,
        ctaText: '#07080A',
      }}
    />
  )
}
