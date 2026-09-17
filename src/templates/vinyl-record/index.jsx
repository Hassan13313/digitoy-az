import TemplateShell, { alpha } from '../_shared/TemplateShell'
import OpeningFrame, { Kicker, OpeningMeta } from '../_shared/OpeningFrame'
import { Ambient } from '../_shared/motion'
import { getTemplateTheme } from '../templateConfig'

/* ─────────────────────────────────────────────────────────────────────────────
   VINYL RECORD — Claude Design «Seçilmiş 7» · 03

   Design dili: toy bir albomdur. Fırlanan plyonka, qırmızı mərkəz etiketi
   (#C9472F), yiv halqaları, studiya mono tipoqrafiyası və qızıl aksent.

   Açılış: plyonka fırlanmağa başlayır, tonarm sağdan enib yivə oturur,
   etiketdə cütlüyün baş hərfləri görünür, altda «SIDE A» yazılır.
   Çıxış `zoom` — plyonkanın içinə girilir.

   ⚠ Fırlanma `transform: rotate` ilədir (kompozitor qatında) — layout
   yenidən hesablanmır, ona görə uzunmüddətli infinite animasiya təhlükəsizdir.
   ⚠ Etiket mətni adların BAŞ HƏRFLƏRİDİR: uzun ad etiketə sığmır, ona görə
   `initials()` yalnız ilk hərfləri götürür.
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('vinyl-record')

const DISP = TH.fonts.heading   /* Space Grotesk */
const MONO = TH.fonts.body      /* JetBrains Mono */

const KEYFRAMES = `
@keyframes tpl-hint  { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes tpl-eq    { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
/* Plyonka fırlanır — 33⅓ rpm hissi üçün yavaş */
@keyframes vr-spin   { from { transform: rotate(0) } to { transform: rotate(360deg) } }
/* Tonarm sağdan enib yivə oturur */
@keyframes vr-arm    { from { transform: rotate(20deg) } to { transform: rotate(-11deg) } }
/* Yiv halqalari merkezden acilir.
   DIQQET: translate(-50%,-50%) KEYFRAME-IN ICINDE olmalidir — animasiya
   edilen transform element uzerindeki inline transform-u tamamile evez edir.
   Olmayanda halqalar merkezden surusur ve firlanan diskde yayilmis qovs
   destesi kimi gorunurdu. (Bu serh template literal icindedir: BACKTICK
   ISLETME — literal-i kesir ve build sinir.) */
@keyframes vr-groove { from { opacity:0; transform: translate(-50%,-50%) scale(.82) } to { opacity:1; transform: translate(-50%,-50%) scale(1) } }
/* Etiketin üzərindən keçən işıq */
@keyframes vr-shine  { 0% { transform: translateX(-120%) skewX(-16deg) } 100% { transform: translateX(320%) skewX(-16deg) } }
/* Fonda toz dənəsi — plyonka cızığı hissi */
@keyframes vr-dust   { 0%,100% { opacity:.06 } 50% { opacity:.16 } }
`

/** Adların baş hərfləri — etiketə sığan qısa forma («N&R») */
function initials(weddingData, isCouple) {
  const cut = (s) => String(s || '').trim().charAt(0).toUpperCase()
  if (isCouple) {
    const a = cut(weddingData.groomName), b = cut(weddingData.brideName)
    return [a, b].filter(Boolean).join('&') || '♥'
  }
  return cut(weddingData.eventName || weddingData.brideName) || '♥'
}

function Opening(props) {
  const { theme, weddingData, isCouple } = props

  const dateStr = String(weddingData.date || '').split('-').reverse().join(' · ')

  return (
    <OpeningFrame
      {...props}
      exit="zoom"
      duration={950}
      label="Plyonkanı işə sal"
      ctaDelay={4.0}
      hintDelay={4.5}
      orbs="none"
      veil="#0E0E0E"
      background="radial-gradient(120% 86% at 50% 30%, #1C1C1C, #0B0B0B 76%)"
      ctaStyle={{
        border: `1px solid ${alpha(theme.primary, 0.6)}`,
        color: theme.accent, background: alpha(theme.secondary, 0.16),
        fontFamily: MONO, letterSpacing: '.18em', textTransform: 'uppercase',
      }}
      ctaGleam={alpha(theme.primary, 0.9)}
      hintColor={alpha(theme.muted, 0.95)}
    >
      {/* ── PLYONKA ── */}
      <div style={{
        position: 'relative', width: 'min(66vw, 232px)', height: 'min(66vw, 232px)',
        marginInline: 'auto',
      }}>
        {/* Disk — fırlanır */}
        <span aria-hidden="true" style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'radial-gradient(circle, #2A2A2A 28%, #141414 29%, #1C1C1C 100%)',
          animation: 'vr-spin 7s linear 1.1s infinite',
          boxShadow: '0 28px 64px rgba(0,0,0,.7)',
        }}>
          {/* Yiv halqaları — mərkəzdən açılır */}
          {[0.92, 0.84, 0.76, 0.68, 0.6, 0.52].map((sc, i) => (
            <span key={sc} style={{
              position: 'absolute', left: '50%', top: '50%',
              width: `${sc * 100}%`, height: `${sc * 100}%`,
              transform: 'translate(-50%,-50%)', borderRadius: '50%',
              border: `1px solid ${alpha(theme.accent, 0.13)}`,
              animation: `vr-groove .8s ease-out ${(0.9 + i * 0.16).toFixed(2)}s both`,
            }} />
          ))}
        </span>

        {/* Mərkəz etiketi — fırlanmır, oxunaqlı qalır.
            ⚠ İKİ QAT: xarici span YALNIZ mərkəzləyir, animasiya İÇƏRİDƏdir.
            Səbəb: `tpl-cta` keyframe-i `transform: none` ilə bitir və tək
            qatda `translate(-50%,-50%)` mərkəzləməsini SİLİRDİ — etiket
            diskin mərkəzindən sağa-yuxarı sürüşürdü. */}
        <span style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
          width: '35%', height: '35%',
        }}>
          <span style={{
            position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden',
            background: theme.secondary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'tpl-cta .9s cubic-bezier(.2,.9,.25,1) 1.9s both',
          }}>
            <span style={{
              fontFamily: DISP, fontWeight: 700, fontSize: 'clamp(13px, 4.6vw, 17px)',
              color: theme.accent, letterSpacing: '.02em',
            }}>{initials(weddingData, isCouple)}</span>

            {/* Etiketin üzərindən keçən işıq */}
            <span aria-hidden="true" style={{
              position: 'absolute', top: 0, bottom: 0, left: 0, width: '46%',
              background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.4), transparent)',
              animation: 'vr-shine 5.4s linear 3.2s infinite',
            }} />
          </span>
        </span>

        {/* İynə deşiyi */}
        <span aria-hidden="true" style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
          width: 6, height: 6, borderRadius: '50%', background: '#0E0E0E',
        }} />

        {/* Tonarm — sağ yuxarıdakı oxdan fırlanıb iynəsi diskin yivinə enir.
            ⚠ BUCAĞIN İŞARƏSİ: transform-origin SAĞDAdır və qol SOLA uzanır,
            ona görə MÜSBƏT bucaq ucu YUXARI qaldırır. Qol yuxarıdan (+20°)
            başlayıb diskin üstünə (−11°) enməlidir — əks işarədə qol havada
            qalıb «slider» kimi görünürdü. */}
        <span aria-hidden="true" style={{
          position: 'absolute', right: '-6%', top: '12%',
          width: '62%', height: 3, transformOrigin: 'right center',
          animation: 'vr-arm 1.3s cubic-bezier(.34,1.2,.64,1) 1.5s both',
        }}>
          <span style={{
            display: 'block', width: '100%', height: '100%', borderRadius: 2,
            background: `linear-gradient(90deg, ${theme.primary}, ${alpha(theme.primary, 0.55)})`,
          }} />
          <span style={{
            position: 'absolute', right: -7, top: -5, width: 13, height: 13,
            borderRadius: '50%', background: theme.primary,
          }} />
        </span>
      </div>

      <Kicker text="Side A" color={alpha(theme.muted, 0.95)} lineColor={alpha(theme.primary, 0.5)} delay={3.2} style={{ marginTop: 28 }} />

      <div style={{
        fontFamily: DISP, fontWeight: 500, fontSize: 'clamp(17px, 5.6vw, 22px)',
        letterSpacing: '.1em', textTransform: 'uppercase', color: theme.accent,
        marginTop: 14, animation: 'tpl-rise .8s ease-out 3.4s both',
      }}>
        {isCouple
          ? [weddingData.groomName, weddingData.brideName].filter(Boolean).join(' & ')
          : (weddingData.eventName || weddingData.brideName || '')}
      </div>

      <OpeningMeta text={dateStr} color={alpha(theme.muted, 0.9)} delay={3.7} style={{ marginTop: 12, letterSpacing: '.28em', fontFamily: MONO }} />
    </OpeningFrame>
  )
}

export default function VinylRecordTemplate(props) {
  return (
    <TemplateShell
      {...props}
      templateId="vinyl-record"
      theme={TH}
      Opening={Opening}
      keyframes={KEYFRAMES}
      ambient={
        <Ambient>
          {/* Fonda çox yavaş fırlanan nəhəng yiv halqası */}
          <span style={{
            position: 'absolute', left: '50%', top: '36%', width: 420, height: 420,
            margin: '-210px 0 0 -210px', borderRadius: '50%', opacity: 0.16,
            background: `repeating-radial-gradient(circle, transparent 0 7px, ${alpha(TH.accent, 0.05)} 7px 8px)`,
            animation: 'vr-spin 90s linear infinite',
          }} />
          {/* Qırmızı etiket işığı */}
          <span style={{
            position: 'absolute', left: '50%', top: '36%', width: 260, height: 260,
            margin: '-130px 0 0 -130px', borderRadius: '50%', opacity: 0.16,
            background: `radial-gradient(circle, ${TH.secondary}, transparent 66%)`,
            filter: 'blur(44px)', animation: 'ab-pulse 11s ease-in-out infinite',
          }} />
          {/* Plyonka tozu */}
          <span aria-hidden="true" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.1,
            backgroundImage: `radial-gradient(circle at 25% 35%, ${alpha(TH.accent, 0.5)} 0 .6px, transparent 1px), radial-gradient(circle at 68% 72%, ${alpha(TH.primary, 0.4)} 0 .5px, transparent 1px)`,
            backgroundSize: '9px 9px, 13px 13px',
            animation: 'vr-dust 4.2s steps(3) infinite',
          }} />
        </Ambient>
      }
      /* ── Bölmə adları — Claude Design-dakı metafora (Phase 41) ──────────
         AZ mətnlər birbaşa dizayn faylındandır; EN/RU həmin metaforanın
         qarşılığıdır. Verilməyən bölmə sistemin öz tərcüməsini işlədir.
         ⚠ `kicker` sətirdir (hər üç dildə eyni qalır — qısa etiketdir),
         `title` isə {az,en,ru} obyektidir. */
      sectionLabels={{
        countdown: { kicker: 'SIDE A',
                    title: { az: 'İynə düşənə qədər', en: 'Until the needle drops', ru: 'До первой дорожки' } },
        venue:     { kicker: 'STUDIO',
                    title: { az: 'Studiya · məkan', en: 'Studio · venue', ru: 'Студия · место' } },
        program:   { kicker: 'TRACKLIST',
                    title: { az: 'Tracklist · Side A', en: 'Tracklist · Side A', ru: 'Трек-лист · Сторона A' } },
        dresscode: { kicker: 'STAGE',
                    title: { az: 'Səhnə geyimi', en: 'Stage outfit', ru: 'Сценический образ' } },
        seating:   { kicker: 'SEATING',
                    title: { az: 'Zal planı · yeriniz', en: 'Seating · your spot', ru: 'План зала · ваше место' } },
        gallery:   { kicker: 'SLEEVE',
                    title: { az: 'Albom vərəqləri', en: 'Album sleeve', ru: 'Разворот альбома' } },
        rsvp:      { kicker: 'SESSİYA',
                    title: { az: 'Sessiyaya qoşulun', en: 'RSVP · join the session', ru: 'Присоединяйтесь' } },
        guestbook: { kicker: 'LINER NOTES',
                    title: { az: 'Liner notes', en: 'Liner notes', ru: 'Заметки на конверте' } },
      }}
      design={{
        /* ── Vizual şəxsiyyət (Phase 42) ─────────────────────────────
           Qırmızı etiketin işığı yuxarıda, qızıl isti alt ton.
           Tonlar dizayn faylındakı bölmə fonlarıdır; `pageWash` isə
           preview kartı ilə eyni dildə imza qradiyentidir — beləliklə
           vitrindəki görüntü ilə dəvətnamənin içi uyğun gəlir. */
        sectionTones: ['transparent', '#191919'],
        pageWash:
          'radial-gradient(90% 55% at 50% 22%, rgba(201,71,47,.10), transparent 64%), '
          + 'radial-gradient(120% 60% at 50% 100%, rgba(201,162,74,.08), transparent 70%)',
        programStyle: 'tracklist',
        programPrefix: 'A',      /* A1, A2… — Side A trekləri */
        programIndexColor: TH.secondary,
        /* Location — xeritə şəklinin şablona məxsus rəng emalı (bax MapSection) */
        /* Xəritənin rəng emalı — Claude Design-dakı DƏQİQ filter zənciri.
           ⚠ tintOpacity 0-dır: dizayn ayrıca tint QATI işlətmir, rəngi
           filter-in özü verir. Tint qatı vivid aksentlə xəritəni
           boyayıb küçə adlarını oxunmaz edirdi. */
        map: { opacity: 0.8, filter: 'grayscale(1) contrast(1.2) brightness(.44)', tintOpacity: 0 },
        radius: 4,
        buttonRadius: 100,
        align: 'left',
        headingTransform: 'uppercase',
        kicker: '.26em',
        dark: true,
        alternate: true,
        headingColor: TH.accent,
        accentColor: TH.primary,
        ctaBg: TH.secondary,
        ctaText: TH.accent,
      }}
    />
  )
}
