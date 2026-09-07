import { useId } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
   DİL SEÇİCİ — AZ / EN / RU

   Phase 36-ya qədər rənglər hardcode `gold` idi: modern-black, white-elegance,
   night-sky kimi şablonlarda sarı segment dizayn sisteminə yad element kimi
   görünürdü.

   İNDİ İKİ REJİM VAR:
     • `theme` VERİLMƏYƏNDƏ  → köhnə qızılı görünüş (landing + /templates
       səhifələri) — həmin səhifələr üçün HEÇ NƏ dəyişmir.
     • `theme` VERİLƏNDƏ     → rənglər şablonun öz palitrasından hesablanır.

   GÖRÜNƏN QALIR: aktiv seqment tam dolğun aksent fonlu, passivlər isə
   `muted` üzərində ən azı 1px sərhədlə saxlanılır — heç bir palitrada
   it-bat olmur. Qlobus ikonu isə elementin nə olduğunu ilk baxışda deyir.
   ───────────────────────────────────────────────────────────────────────── */

const LANGS = ['az', 'en', 'ru']

/* Hex + alpha → rgba. Token üzərində şəffaflıq; hardcode rəng deyil. */
function alpha(hex, a) {
  const h = String(hex || '').replace('#', '')
  if (h.length !== 6) return hex
  const n = parseInt(h, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

/* ── Kontrast riyaziyyatı (WCAG 2.1 nisbi parlaqlıq) ──
   NƏ ÜÇÜN LAZIMDIR: 9 şablonun palitrası çox fərqlidir. «Açıq fon → qara
   mətn» kimi sadə qayda ölçüldü və KİFAYƏT ETMƏDİ: white-elegance-də aktiv
   seqment 3.88, passivlər 3.61 verirdi (AA hədd 4.5). İndi rəng palitradan
   SEÇİLİR — hansı token 4.5-i keçirsə o götürülür. */
function luminance(hex) {
  const h = String(hex || '').replace('#', '')
  if (h.length !== 6) return null
  const n = parseInt(h, 16)
  const srgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
}

function contrast(a, b) {
  const l1 = luminance(a)
  const l2 = luminance(b)
  if (l1 === null || l2 === null) return 0
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

/* Namizədlərdən AA (4.5) keçən İLKİNİ seç — palitraya sadiq qalmaq üçün
   sıra vacibdir. Heç biri keçməsə ən yüksək kontrastlısı götürülür
   (#000/#fff namizədlərə sonda əlavə olunur ki, həmişə çıxış yolu olsun). */
function pickReadable(candidates, bg) {
  const list = [...candidates.filter(Boolean), '#000000', '#FFFFFF']
  for (const c of list) if (contrast(c, bg) >= 4.5) return c
  return list.reduce((best, c) => (contrast(c, bg) > contrast(best, bg) ? c : best), list[0])
}

function GlobeIcon({ color, size = 11 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false" style={{ flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
    </svg>
  )
}

/**
 * @param {string}  lang    aktiv dil
 * @param {Fn}      setLang dil dəyişdirici
 * @param {object=} theme   şablon tokenləri (templateConfig.theme). Verilməsə
 *                          köhnə qızılı görünüş qalır.
 * @param {string=} accent  şablonun hesabladığı aksent (design.accentColor).
 *                          Verilməsə `theme.primary` işlədilir.
 * @param {number=} radius  künc radiusu (design.buttonRadius ilə uyğunlaşsın)
 */
export default function LanguageSwitcher({ lang, setLang, theme, accent, radius = 999 }) {
  const groupId = useId()

  /* ── Köhnə (şablonsuz) görünüş — landing və /templates ── */
  if (!theme) {
    return (
      <div className="flex items-center gap-0 border border-gold/30 overflow-hidden" role="group" aria-label="Dil / Language">
        {LANGS.map((l, i) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={`px-3 py-1.5 text-xs font-medium tracking-widest uppercase transition-all duration-200 ${
              lang === l
                ? 'bg-gold text-white'
                : 'text-brown-muted hover:text-gold bg-transparent'
            } ${i < LANGS.length - 1 ? 'border-r border-gold/30' : ''}`}
          >
            {l}
          </button>
        ))}
      </div>
    )
  }

  /* ── Şablona inteqrasiya olunmuş görünüş ── */
  const ACC = accent || theme.primary
  /* Rels şəffafdır, amma kontrast hesabı üçün ALTINDAKI qeyri-şəffaf tonu
     götürürük — header də eyni ailədəndir, yəni hesab real nəticəyə uyğundur. */
  const trackSolid = theme.surface || theme.background
  const trackBg    = alpha(trackSolid, 0.55)
  const border     = alpha(ACC, 0.32)

  /* Aktiv seqment: fon = aksent, mətn = palitradan oxunaqlı olan ilk token */
  const activeText   = pickReadable([theme.background, theme.text], ACC)
  /* Passiv seqment: `muted` çox açıq şablonlarda AA-nı keçmir → `text`-ə düşür */
  const inactiveText = pickReadable([theme.muted, theme.text], trackSolid)

  return (
    <div
      role="group"
      aria-label="Dil / Language / Язык"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 2,
        padding: '3px 3px 3px 7px',
        borderRadius: radius, border: `1px solid ${border}`,
        background: trackBg,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <GlobeIcon color={alpha(ACC, 0.75)} />
      {LANGS.map((l) => {
        const active = lang === l
        return (
          <button
            key={l}
            id={`${groupId}-${l}`}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={active}
            lang={l}
            style={{
              /* 32×34px toxunma sahəsi — 320px-də də header-ə sığır (ölçüldü:
                 seçici 123px, viewport 320px), köhnə ~26px-dən böyükdür */
              minWidth: 34, height: 32,
              padding: '0 8px', touchAction: 'manipulation',
              border: active ? '1px solid transparent' : `1px solid ${alpha(ACC, 0.16)}`,
              borderRadius: radius,
              background: active ? ACC : 'transparent',
              color: active ? activeText : inactiveText,
              fontSize: 10, fontWeight: active ? 600 : 500,
              letterSpacing: '.12em', textTransform: 'uppercase',
              fontFamily: theme.fonts?.body,
              cursor: 'pointer', lineHeight: 1,
              transition: 'background 180ms ease, color 180ms ease, border-color 180ms ease',
            }}
          >
            {l}
          </button>
        )
      })}
    </div>
  )
}
