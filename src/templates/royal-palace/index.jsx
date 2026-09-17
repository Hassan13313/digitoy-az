import TemplateShell, { alpha } from '../_shared/TemplateShell'
import OpeningFrame, { Kicker, NameRow, Ornament, OpeningMeta } from '../_shared/OpeningFrame'
import { Ambient, RotRing, Particles } from '../_shared/motion'
import { getTemplateTheme } from '../templateConfig'

/* ─────────────────────────────────────────────────────────────────────────────
   ROYAL PALACE — Claude Design «Seçilmiş 7» · 04

   Design dili: gecə göyü (#0F1326) üzərində saray heraldikası. İkiqat qızıl
   çərçivə, 45° döndərilmiş romb möhür, Cinzel kapitel yazıları.

   Açılış: çərçivə dörd tərəfdən çəkilir (üfüqi xətlər soldan-sağa, şaquli
   xətlər yuxarıdan-aşağı), sonra romb möhür mərkəzdə oturur və ondan zərif
   bir dalğa yayılır. Çıxış `curtain` — pərdə qalxır.

   ⚠ Cinzel yalnız kapiteldə düzgün görünür (kiçik hərfləri qısadır), ona görə
   `design.headingTransform: 'uppercase'`.
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('royal-palace')

const DISP = TH.fonts.heading   /* Cinzel */

const KEYFRAMES = `
@keyframes tpl-hint  { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes tpl-eq    { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
/* Möhürdən yayılan dalğa */
@keyframes rp-shock  { 0% { opacity:0; transform: translate(-50%,-50%) rotate(45deg) scale(.4) } 14% { opacity:.7 } 100% { opacity:0; transform: translate(-50%,-50%) rotate(45deg) scale(2.6) } }
/* Romb möhür yerinə oturur */
@keyframes rp-seal   { from { opacity:0; transform: rotate(45deg) scale(.5) } to { opacity:1; transform: rotate(45deg) scale(1) } }
/* Qızıl toz — yuxarı süzülür */
@keyframes rp-dust   { 0% { opacity:0; transform: translateY(0) } 20% { opacity:.55 } 100% { opacity:0; transform: translateY(-58px) } }
`

function Opening(props) {
  const { theme, weddingData, isCouple } = props

  const dateStr = String(weddingData.date || '').split('-').reverse().join(' · ')

  /* Çərçivə xətti — `tpl-drawx`/`tpl-drawy` OpeningFrame-də elan olunub */
  const lineH = (delay, extra) => ({
    position: 'absolute', height: 1, background: alpha(theme.primary, 0.65),
    transformOrigin: 'left', animation: `tpl-drawx .8s cubic-bezier(.22,.61,.36,1) ${delay}s both`,
    ...extra,
  })
  const lineV = (delay, extra) => ({
    position: 'absolute', width: 1, background: alpha(theme.primary, 0.65),
    transformOrigin: 'top', animation: `tpl-drawy .8s cubic-bezier(.22,.61,.36,1) ${delay}s both`,
    ...extra,
  })

  return (
    <OpeningFrame
      {...props}
      exit="curtain"
      duration={950}
      label="Dəvətnaməni aç"
      ctaDelay={4.1}
      hintDelay={4.6}
      orbs="halo"
      orbTop="44%"
      veil="#0F1326"
      background="radial-gradient(120% 82% at 50% 26%, #1B2246, #0A0D1E 78%)"
      ctaStyle={{
        border: `1px solid ${alpha(theme.primary, 0.7)}`,
        color: theme.primary, background: 'rgba(0,0,0,.3)',
        fontFamily: DISP, letterSpacing: '.2em', textTransform: 'uppercase',
      }}
      ctaGleam={alpha(theme.secondary, 0.95)}
      hintColor={alpha(theme.muted, 0.95)}
    >
      {/* ── SARAY ÇƏRÇİVƏSİ ── */}
      <div style={{
        position: 'relative', width: 'min(80vw, 268px)', height: 'min(80vw, 268px)',
        marginInline: 'auto',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Xarici çərçivə — dörd xətt ardıcıl çəkilir */}
        <span aria-hidden="true" style={lineH(0.8, { left: 0, right: 0, top: 0 })} />
        <span aria-hidden="true" style={lineH(1.5, { left: 0, right: 0, bottom: 0 })} />
        <span aria-hidden="true" style={lineV(1.05, { top: 0, bottom: 0, left: 0 })} />
        <span aria-hidden="true" style={lineV(1.05, { top: 0, bottom: 0, right: 0 })} />

        {/* Daxili çərçivə — bir qədər gec, daha solğun */}
        <span aria-hidden="true" style={{
          position: 'absolute', inset: 9, border: `1px solid ${alpha(theme.primary, 0.3)}`,
          animation: 'tpl-rise .8s ease-out 1.9s both',
        }} />

        {/* Möhürdən yayılan dalğa
            ⚠ İKİ QÜSUR DÜZƏLDİLDİ (açılışda ekranın ortasında kvadrat çıxırdı):
            1) `backwards` fill-mode YOX İDİ → 2.9 saniyəlik gecikmə boyunca
               element STATİK halında görünürdü: 76×76, qızıl haşiyəli,
               qeyri-şəffaf KVADRAT (keyframe-in `rotate(45deg)`-i hələ
               tətbiq olunmamışdı).
            2) Mərkəzləyən `translate(-50%,-50%)` YALNIZ keyframe-in içində
               idi, ona görə statik halda yerləşmə də sürüşürdü.
            İndi həm başlanğıc transform elementin özündədir, həm də
            `backwards` ilə animasiyanın 0% halı gecikmə boyunca saxlanılır. */}
        <span aria-hidden="true" style={{
          position: 'absolute', left: '50%', top: '50%',
          width: 76, height: 76, border: `1px solid ${alpha(theme.primary, 0.7)}`,
          transform: 'translate(-50%,-50%) rotate(45deg) scale(.4)',
          opacity: 0,
          animation: 'rp-shock 4.2s ease-out 2.9s infinite backwards',
        }} />

        {/* Romb möhür — baş hərflər */}
        <span style={{
          width: 76, height: 76, border: `1px solid ${alpha(theme.primary, 0.85)}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'rp-seal 1s cubic-bezier(.2,.9,.25,1) 2.2s both',
        }}>
          <span style={{
            transform: 'rotate(-45deg)', fontFamily: DISP,
            fontSize: 'clamp(15px, 5vw, 19px)', letterSpacing: '.08em', color: theme.secondary,
          }}>
            {[weddingData.groomName, weddingData.brideName]
              .map((n) => String(n || '').trim().charAt(0).toUpperCase())
              .filter(Boolean).join(' ') || '♛'}
          </span>
        </span>
      </div>

      <Kicker text="Dəvətnamə" color={alpha(theme.muted, 0.95)} lineColor={alpha(theme.primary, 0.55)} delay={3.0} style={{ marginTop: 28 }} />

      <NameRow
        theme={theme} weddingData={weddingData} isCouple={isCouple}
        delay={3.3} step={0.2}
        size="clamp(21px, 7.2vw, 28px)" ampSize="clamp(16px, 5.4vw, 20px)"
        font={DISP} color={theme.accent} ampColor={theme.primary}
        style={{ marginTop: 16, letterSpacing: '.1em', textTransform: 'uppercase', lineHeight: 1.25 }}
      />

      <Ornament color={theme.primary} mark="rhomb" delay={3.8} width={32} style={{ marginTop: 16 }} />

      <OpeningMeta text={dateStr} color={alpha(theme.muted, 0.95)} delay={4.0} style={{ marginTop: 13, letterSpacing: '.28em' }} />
    </OpeningFrame>
  )
}

export default function RoyalPalaceTemplate(props) {
  return (
    <TemplateShell
      {...props}
      templateId="royal-palace"
      theme={TH}
      Opening={Opening}
      keyframes={KEYFRAMES}
      ambient={
        <Ambient>
          {/* Saray tavanının qızıl halqaları — çox yavaş dönür */}
          <RotRing color={alpha(TH.primary, 0.16)} size={360} top="34%" duration={70} />
          <RotRing color={alpha(TH.primary, 0.1)} size={250} top="34%" duration={95} dashed reverse />
          {/* Gecə göyünün dərinliyi */}
          <span style={{
            position: 'absolute', left: '50%', top: '30%', width: 400, height: 400,
            margin: '-200px 0 0 -200px', borderRadius: '50%', opacity: 0.2,
            background: `radial-gradient(circle, ${TH.primary}, transparent 64%)`,
            filter: 'blur(58px)', animation: 'ab-pulse 13s ease-in-out infinite',
          }} />
          {/* Qızıl toz — yuxarı süzülür */}
          <Particles kind="up" count={7} color={alpha(TH.secondary, 0.65)} size={2} seed={9} minDur={13} maxDur={20} />
        </Ambient>
      }
      /* ── Bölmə adları — Claude Design-dakı metafora (Phase 41) ──────────
         AZ mətnlər birbaşa dizayn faylındandır; EN/RU həmin metaforanın
         qarşılığıdır. Verilməyən bölmə sistemin öz tərcüməsini işlədir.
         ⚠ `kicker` sətirdir (hər üç dildə eyni qalır — qısa etiketdir),
         `title` isə {az,en,ru} obyektidir. */
      sectionLabels={{
        countdown: { kicker: 'CEREMONY',
                    title: { az: 'Mərasimə qalan vaxt', en: 'Time until the ceremony', ru: 'До начала церемонии' } },
        venue:     { kicker: 'PALACE',
                    title: { az: 'Sarayın ünvanı', en: 'The palace address', ru: 'Адрес дворца' } },
        program:   { kicker: 'PROTOCOL',
                    title: { az: 'Mərasim protokolu', en: 'Ceremony protocol', ru: 'Протокол церемонии' } },
        dresscode: { kicker: 'ETIQUETTE',
                    title: { az: 'Saray qaydası · geyim', en: 'Court dress code', ru: 'Придворный дресс-код' } },
        seating:   { kicker: 'BANQUET',
                    title: { az: 'Ziyafət cədvəli', en: 'Banquet seating', ru: 'Рассадка на банкете' } },
        gallery:   { kicker: 'GALLERY',
                    title: { az: 'Saray qalereyası', en: 'Palace gallery', ru: 'Дворцовая галерея' } },
        rsvp:      { kicker: 'DECREE',
                    title: { az: 'Fərmana cavab', en: 'Reply to the decree', ru: 'Ответ на указ' } },
        guestbook: { kicker: 'SCROLLS',
                    title: { az: 'Təbrik fərmanları', en: 'Congratulatory scrolls', ru: 'Поздравительные свитки' } },
      }}
      design={{
        /* ── Vizual şəxsiyyət (Phase 42) ─────────────────────────────
           Saray tavanının dərinliyi + mərkəzdə qızıl halo.
           Tonlar dizayn faylındakı bölmə fonlarıdır; `pageWash` isə
           preview kartı ilə eyni dildə imza qradiyentidir — beləliklə
           vitrindəki görüntü ilə dəvətnamənin içi uyğun gəlir. */
        sectionTones: ['transparent', '#131A31', '#121629', '#161C38', '#0D1224', '#1A2140'],
        pageWash:
          'radial-gradient(110% 55% at 50% 4%, rgba(27,34,70,.9), transparent 62%), '
          + 'radial-gradient(80% 40% at 50% 46%, rgba(214,183,110,.09), transparent 68%)',
        programStyle: 'table',
        /* Location — xeritə şəklinin şablona məxsus rəng emalı (bax MapSection) */
        /* Xəritənin rəng emalı — Claude Design-dakı DƏQİQ filter zənciri.
           ⚠ tintOpacity 0-dır: dizayn ayrıca tint QATI işlətmir, rəngi
           filter-in özü verir. Tint qatı vivid aksentlə xəritəni
           boyayıb küçə adlarını oxunmaz edirdi. */
        map: { opacity: 0.85, filter: 'grayscale(1) invert(.9) sepia(.4) hue-rotate(178deg) saturate(1.6) brightness(.55) contrast(1.1)', tintOpacity: 0 },
        radius: 0,
        buttonRadius: 0,
        align: 'center',
        headingTransform: 'uppercase',
        kicker: '.26em',
        dark: true,
        alternate: true,
        headingColor: TH.accent,
        accentColor: TH.primary,
        ctaBg: TH.primary,
        ctaText: '#0F1326',
      }}
    />
  )
}
