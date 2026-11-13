import { resolveDressCode, resolveDressGenders } from '../../data/dressCode'
import { alpha, readableOn, contrast } from './geo'
import t from '../../data/translations'
import { useTemplate } from '../TemplateProvider'
import { useInView } from './viralHooks'
import { withStringOverrides } from '../../data/adminOverrides'

/* ─────────────────────────────────────────────────────────────────────────────
   DRESS CODE — 9 şablonun YEGANƏ geyim tərzi bölməsi.

   Layihədə başqa dress code görünüşü YOXDUR (`ThreeDDressCode`, `DressCodeCard`
   və `assets/dresscode/*.gif` Phase 27.2-də silindi). Data `data/dressCode.js`.

   ── İKONLAR (2026-11 lüks versiya) ──
   İki ikon, ortada nazik ayırıcı xətt:

       kişi (asılqanda)   │   qadın (asılqanda)

   Cüt müştərinin seçdiyi geyim tərzinə görə dəyişir (bax PAIRS). Forma
   bütün şablonlarda EYNİDİR — yalnız rənglər şablonun theme-indən gəlir.
   (Əvvəlki dörd ikon — kostyum, ayaqqabı, don, daban — çıxdı.)

   Rəng uyğunluğu (design → theme):
     stroke  → aksent, fonda oxunmursa mətn rənginə düşür (`readableOn`)
              t1 #E8D5A3 = royal-gold accent · t3 #2B2723 = white-elegance text
     fill    → kartın səthi (tünd şablonda tünd, açıqda ağ)
     detal   → primary, fonda itirsə muted (qalstuk düyünü, ətək tikişi, daban)
   ───────────────────────────────────────────────────────────────────────── */

/* LÜKS İKONLAR (2026-11): hər geyim tərzinin öz cütü, hamısı zər asılqanda —
   butik vitrini kimi. 60×96 xətt-qrafika; rollar:
     filled  → kartın səthi (surface)
     tone    → xəttin rəngi ilə yüngül dolğu (atlas yaxa, korsaj, jilet)
     detail  → zər rəng (asılqan, papyon, qalstuk, daş, parıltı, maska)
     fillDetail → zər dolğu
     soft    → büküşlər, cib xətləri (yarı şəffaf)
   Tərz → cüt (PAIRS): Rəsmi — smokinq / axşam donu; Yarı-rəsmi — kostyum /
   kokteyl donu; Rahat və zərif — blazer / midi don; Tematik — jilet və
   maska / tül don və maska. Köhnə palitralar (pastel, earth, garden) ən
   yaxın cütü götürür. Bölmə görünəndə asılqan bir dəfə yüngülcə yellənir. */
const HANGER = [
  { d: 'M30 11 C30 8.5 30.4 7.6 31.6 6.6 C33 5.4 33.2 3.2 31.6 2.4 C30.3 1.8 28.8 2.6 28.8 4', detail: true },
  { d: 'M30 11 L8 21.5 H52 Z', detail: true },
]
const SLEEVES = [
  { d: 'M12.5 22 L7.5 26.5 L5.5 73 H11.5 L13 38 Z', filled: true },
  { d: 'M47.5 22 L52.5 26.5 L54.5 73 H48.5 L47 38 Z', filled: true },
]
const SPARKLE = (x, y, r = 1) => `M${x} ${y} l${0.8 * r} ${2 * r} ${2 * r} ${0.8 * r} ${-2 * r} ${0.8 * r} ${-0.8 * r} ${2 * r} ${-0.8 * r} ${-2 * r} ${-2 * r} ${-0.8 * r} ${2 * r} ${-0.8 * r} Z`
const MASK = (x) => [
  { d: `M31.6 6.6 C${x > 30 ? 34.5 : 28.5} 5.6 ${x > 30 ? 37 : 23} 6.4 ${x + 2} 8.2`, detail: true, soft: true },
  { d: `M${x} 8 C${x + 2.6} 6.4 ${x + 5.6} 6.4 ${x + 7.8} 8.2 C${x + 10} 6.4 ${x + 13} 6.4 ${x + 15.6} 8 C${x + 15.6} 11.6 ${x + 12.8} 13.4 ${x + 10.6} 12.4 C${x + 9.4} 11.8 ${x + 8.6} 11.6 ${x + 7.8} 12.2 C${x + 7} 11.6 ${x + 6.2} 11.8 ${x + 5} 12.4 C${x + 2.8} 13.4 ${x} 11.6 ${x} 8 Z`, detail: true, tone: true },
  { d: `M${x + 3} 9.4 q1.8 -1.2 3.4 0 q-1.6 1.4 -3.4 0 Z M${x + 9.2} 9.4 q1.8 -1.2 3.4 0 q-1.6 1.4 -3.4 0 Z`, detail: true },
]

const ICONS = {
  /* Rəsmi — kişi: smokinq (atlas yaxa, papyon, döş dəsmalı) */
  tux: [
    ...HANGER, ...SLEEVES,
    { d: 'M12.5 22 L22 18.5 L30 27 L38 18.5 L47.5 22 L48.5 89 H11.5 Z', filled: true },
    { d: 'M22 18.5 L30 41 L38 18.5', filled: true },
    { d: 'M22 18.5 L25.5 45 L30 41 Z', tone: true },
    { d: 'M38 18.5 L34.5 45 L30 41 Z', tone: true },
    { d: 'M30 41 V89' },
    { d: 'M25.6 21.8 L30 24.2 L25.6 26.6 Z M34.4 21.8 L30 24.2 L34.4 26.6 Z', detail: true, fillDetail: true },
    { d: 'M31.1 52 a1.1 1.1 0 1 1 -2.2 0 a1.1 1.1 0 1 1 2.2 0 M31.1 60 a1.1 1.1 0 1 1 -2.2 0 a1.1 1.1 0 1 1 2.2 0', detail: true, fillDetail: true },
    { d: 'M37.5 38.5 H45.5' },
    { d: 'M38.5 38.5 L40 35.2 L41.5 38.5 L43 35.6 L44.5 38.5', detail: true },
    { d: 'M15 64 H23 M37 64 H45', soft: true },
  ],
  /* Rəsmi — qadın: uzun axşam donu (ürək yaxa, daşlı kəmər, şleyf) */
  gown: [
    ...HANGER,
    { d: 'M19.5 21.5 L22.2 30.2 M40.5 21.5 L37.8 30.2' },
    { d: 'M23 44.5 C20 58 14.5 74 7 90 Q30 96 53 90 C45.5 74 40 58 37 44.5 Z', filled: true },
    { d: 'M21.2 30.4 C23.4 27.6 27.4 27.8 30 31.2 C32.6 27.8 36.6 27.6 38.8 30.4 L37 44.5 C34.4 46.6 25.6 46.6 23 44.5 Z', tone: true },
    { d: 'M23 44.5 C25.6 46.6 34.4 46.6 37 44.5', detail: true },
    { d: 'M30 43.4 L31.4 45 L30 46.6 L28.6 45 Z', detail: true, fillDetail: true },
    { d: 'M27 48 C25.6 62 21.6 76 18.4 92.6 M33 48 C34.4 62 38.4 76 41.6 92.6 M30 48 V94', soft: true },
    { d: `${SPARKLE(46.5, 62)} ${SPARKLE(13.5, 76, 0.75)} ${SPARKLE(41, 82, 0.6)}`, detail: true, fillDetail: true, glint: true },
  ],
  /* Yarı-rəsmi — kişi: kostyum (pilləli yaxa, uzun qalstuk, tək düymə) */
  suit: [
    ...HANGER, ...SLEEVES,
    { d: 'M12.5 22 L22 18.5 L30 27 L38 18.5 L47.5 22 L48.5 86 H11.5 Z', filled: true },
    { d: 'M22 18.5 L30 44 L38 18.5', filled: true },
    { d: 'M22 18.5 L24.6 30 L22.4 32 L28 46' },
    { d: 'M38 18.5 L35.4 30 L37.6 32 L32 46' },
    { d: 'M28.4 21.6 H31.6 L31 25 H29 Z', detail: true, fillDetail: true },
    { d: 'M29 25 L27.6 43 L30 46 L32.4 43 L31 25 Z', detail: true, tone: true },
    { d: 'M30 46 V86' },
    { d: 'M31.1 55 a1.1 1.1 0 1 1 -2.2 0 a1.1 1.1 0 1 1 2.2 0', detail: true, fillDetail: true },
    { d: 'M38 38 H45', soft: true },
    { d: 'M15 64 H23 M37 64 H45', soft: true },
  ],
  /* Yarı-rəsmi — qadın: diz boyu kokteyl donu (V yaxa, büzməli ətək, bant) */
  cocktail: [
    ...HANGER,
    { d: 'M20.5 21.5 L22.4 29 M39.5 21.5 L37.6 29' },
    { d: 'M23 45 C21 55 17.5 64 13.5 75 Q30 80 46.5 75 C42.5 64 39 55 37 45 Z', filled: true },
    { d: 'M21.8 29 L30 38 L38.2 29 L37 45 H23 Z', tone: true },
    { d: 'M26 47 C25 57 22 66 20.5 76.6 M34 47 C35 57 38 66 39.5 76.6 M30 47 V78', soft: true },
    { d: 'M30 45 L25.6 42.6 V47.4 Z M30 45 L34.4 42.6 V47.4 Z', detail: true, fillDetail: true },
    { d: 'M29 45.6 L27.4 52 M31 45.6 L32.6 52', detail: true },
    { d: SPARKLE(44, 60, 0.7), detail: true, fillDetail: true, glint: true },
  ],
  /* Rahat və zərif — kişi: blazer, yaxası açıq köynək (qalstuksuz) */
  blazer: [
    ...HANGER, ...SLEEVES,
    { d: 'M12.5 22 L22 18.5 L30 27 L38 18.5 L47.5 22 L48.5 82 H11.5 Z', filled: true },
    { d: 'M22 18.5 L30 44 L38 18.5', filled: true },
    { d: 'M24.6 19 L27.4 26.6 L30 23 L32.6 26.6 L35.4 19', detail: true },
    { d: 'M30 23 V44', soft: true },
    { d: 'M22 18.5 L24.4 30 L22.6 31.6 L28 46 M38 18.5 L35.6 30 L37.4 31.6 L32 46' },
    { d: 'M30 46 V82' },
    { d: 'M31.1 54 a1.1 1.1 0 1 1 -2.2 0 a1.1 1.1 0 1 1 2.2 0', detail: true, fillDetail: true },
    { d: 'M15.5 60 H23.5 V67.5 Q19.5 69 15.5 67.5 Z M36.5 60 H44.5 V67.5 Q40.5 69 36.5 67.5 Z', soft: true },
    { d: 'M39 38.4 L41 35.4 L43 38.4', detail: true },
  ],
  /* Rahat və zərif — qadın: midi bağlamalı don (qısa qol, kəmər bağı) */
  midi: [
    ...HANGER,
    { d: 'M23 45 C21 58 18.5 71 16 85 Q30 88 44 85 C41.5 71 39 58 37 45 Z', filled: true },
    { d: 'M20.5 22 L26 20.6 L30 29 L34 20.6 L39.5 22 L42.5 30.5 L37.8 33.4 L37 45 H23 L22.2 33.4 L17.5 30.5 Z', filled: true },
    { d: 'M26 20.6 L35 44.6 M34 20.6 L28.2 33.6', soft: true },
    { d: 'M22.2 33.4 L23 31.8 M37.8 33.4 L37 31.8', soft: true },
    { d: 'M23 45 H37', detail: true },
    { d: 'M34.6 45 L36.6 53.4 M35.6 45 L39.4 51.6', detail: true },
    { d: 'M34.6 45.2 C36 60 38.4 72 40.6 86', soft: true },
  ],
  /* Tematik — kişi: jilet, papyon, cib saatı + karnaval maskası */
  waistcoat: [
    ...HANGER,
    { d: 'M13.5 22 L22.5 18.8 L30 25 L37.5 18.8 L46.5 22 L49 30 L47 76 H13 L11 30 Z', filled: true },
    { d: 'M19.6 22 L30 45 L40.4 22 L42.6 71 L30 77.4 L17.4 71 Z', tone: true },
    { d: 'M30 45 V77' },
    { d: 'M25.8 20.8 L30 23.2 L25.8 25.6 Z M34.2 20.8 L30 23.2 L34.2 25.6 Z', detail: true, fillDetail: true },
    { d: 'M31 52 a1 1 0 1 1 -2 0 a1 1 0 1 1 2 0 M31 59 a1 1 0 1 1 -2 0 a1 1 0 1 1 2 0 M31 66 a1 1 0 1 1 -2 0 a1 1 0 1 1 2 0', detail: true, fillDetail: true },
    { d: 'M31 56 C34 60 37.5 60.6 39.6 57.4', detail: true },
    { d: 'M41.6 56.4 a2.2 2.2 0 1 1 -4.4 0 a2.2 2.2 0 1 1 4.4 0', detail: true, tone: true },
    ...MASK(37),
  ],
  /* Tematik — qadın: tül ətəkli don (çiyinsiz korsaj, qat-qat tül) + maska */
  tulle: [
    ...HANGER,
    { d: 'M20.5 21.5 L22 28.4 M39.5 21.5 L38 28.4' },
    { d: 'M23 44.5 C16 54 10 70 6 89 Q30 95 54 89 C50 70 44 54 37 44.5 Z', filled: true },
    { d: 'M19.6 29 C24 27 27 27.6 30 29.6 C33 27.6 36 27 40.4 29 L37 44.5 H23 Z', tone: true },
    { d: 'M19.6 29 L16.6 33.4 M40.4 29 L43.4 33.4' },
    { d: 'M14.6 62 q3.85 2.6 7.7 0 q3.85 2.6 7.7 0 q3.85 2.6 7.7 0 q3.85 2.6 7.7 0', soft: true },
    { d: 'M9.6 76 q5.1 3 10.2 0 q5.1 3 10.2 0 q5.1 3 10.2 0 q5.1 3 10.2 0', soft: true },
    { d: 'M23 44.5 H37', detail: true },
    { d: `${SPARKLE(47, 68, 0.8)} ${SPARKLE(12.5, 84, 0.6)}`, detail: true, fillDetail: true, glint: true },
    ...MASK(7.4),
  ],
}

/* Geyim tərzi → [kişi, qadın] */
const PAIRS = {
  blacktie: ['tux', 'gown'],
  cocktail: ['suit', 'cocktail'],
  smartcasual: ['blazer', 'midi'],
  creative: ['waistcoat', 'tulle'],
  pastel: ['suit', 'cocktail'],
  earth: ['suit', 'cocktail'],
  garden: ['blazer', 'midi'],
}

const SWAY_CSS = `
@keyframes dc-sway { 0% { rotate: -5deg } 30% { rotate: 3.5deg } 55% { rotate: -2deg } 78% { rotate: 1deg } 100% { rotate: 0deg } }
@keyframes dc-glint { 0%,100% { opacity: .35 } 50% { opacity: 1 } }
[data-dc-icon].on { animation: dc-sway 2.6s cubic-bezier(.3,.7,.3,1) both; }
[data-dc-icon] .dc-glint { animation: dc-glint 2.4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { [data-dc-icon], [data-dc-icon] * { animation: none !important; } }
`

function DressIcon({ icon, stroke, detail, surface, seen, delay = 0 }) {
  const paths = ICONS[icon] || ICONS.tux
  return (
    <svg
      data-dc-icon=""
      className={seen ? 'on' : undefined}
      viewBox="0 0 60 96"
      width={66}
      height={106}
      fill="none"
      stroke={stroke}
      strokeWidth={1.2}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      style={{ flexShrink: 0, overflow: 'visible', transformOrigin: '50% 3%', animationDelay: `${delay}s` }}
    >
      {paths.map((p, i) => (
        <path
          key={i}
          className={p.glint ? 'dc-glint' : undefined}
          d={p.d}
          fill={p.fillDetail ? detail : p.tone ? (p.detail ? detail : stroke) : p.filled ? surface : 'none'}
          fillOpacity={p.tone ? 0.16 : undefined}
          stroke={p.detail ? detail : undefined}
          strokeOpacity={p.soft ? 0.45 : undefined}
          strokeWidth={p.detail && !p.fillDetail ? 1.35 : undefined}
        />
      ))}
    </svg>
  )
}

/**
 * @param {object}  theme     şablonun theme token-ləri (templateConfig)
 * @param {string}  paletteId weddingData.dressCodePalette
 * @param {object}  customLabels weddingData.dressCodeLabels — fərdi kart adları;
 *                            yoxdursa standart adlar işlədilir (köhnə sifarişlər)
 * @param {object}  customGenders weddingData.dressCodeGenders — ikonların
 *                            altındakı fərdi kişi/qadın mətnləri; yoxdursa standart
 * @param {string}  note      weddingData.dressCodeDescription
 * @param {string}  title     bölmə başlığı (tr.inv_dresscode)
 * @param {string}  kicker    üst etiket (varsa)
 * @param {string}  serif     başlıq şrifti
 * @param {string}  align     'left' | 'center'
 * @param {boolean} onDark    tünd şablonlarda ikon səthi tündləşir
 */
export default function DressCodeSection({
  theme, paletteId, customLabels, customGenders, note, title, kicker, lang = 'az',
  serif, align = 'left', onDark = false, italic = false,
}) {
  /* Admin «Mətnlər › Geyim kodu»: başlıqlar və müştərinin seçdiyi tərzin adları */
  const { strings } = useTemplate()
  const tr = withStringOverrides(t[lang] || t.az, strings, lang)
  const own = withStringOverrides({}, strings, lang, 'dress.')
  const dcBase = resolveDressCode(paletteId, lang, customLabels)
  const dc = own.style ? { ...dcBase, name: own.style } : dcBase
  const gendersBase = resolveDressGenders(paletteId, lang, customGenders)
  const genders = { ...gendersBase, male: own.men || gendersBase.male, female: own.women || gendersBase.female }
  const labels = { male: tr.dresscode_male_label, female: tr.dresscode_female_label }
  /* Qeyd = YALNIZ müştərinin builder-də yazdığı mətn. Palitranın öz izahı
     burada göstərilmir, çünki ikonların altındakı kişi/qadın yazıları onsuz da
     eyni məlumatı verir — əks halda cümlə təkrarlanırdı. */
  const text = (note || '').trim()

  /* Design-dakı rəng rolları — hamısı theme-dən hesablanır, hardcode yoxdur */
  const bg      = theme.surface || theme.background
  /* Tünd fonu özü tanıyır (ağ mətn fonda qaradan daha oxunaqlıdırsa) — lüks
     şablonlar `onDark` ötürmür; tünd fonda ağ dolğu ağır görünür */
  const dark    = onDark || contrast('#FFFFFF', bg) > contrast('#000000', bg)
  const surface = dark ? alpha(theme.accent, 0.1) : '#FFFFFF'
  const stroke  = readableOn(bg, theme.accent, theme.text)
  /* Detal xətti dekorativdir (mətn deyil) → daha yumşaq kontrast həddi */
  const detail  = readableOn(bg, theme.primary, theme.muted, 2.2)
  const nameCol = readableOn(bg, theme.muted, theme.text)
  const noteCol = readableOn(bg, theme.muted, theme.text)
  const [iconsRef, seen] = useInView(0.35)
  const pair = PAIRS[paletteId] || PAIRS.blacktie

  return (
    /* `data-stagger`: ad → ikonlar → qeyd 55ms addımla gəlir.
       ⚠ `--tpl-base` 55ms — bölmə başlığından SONRA başlasın (bax index.css). */
    <div data-stagger style={{ maxWidth: 560, margin: '0 auto', textAlign: align, '--tpl-base': '55ms' }}>
      {kicker && (
        <div style={{
          fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase',
          color: theme.primary,
        }}>
          {kicker}
        </div>
      )}

      {title && (
        <div style={{
          fontFamily: serif || theme.fonts?.heading,
          fontStyle: italic ? 'italic' : 'normal',
          fontSize: 'clamp(22px, 6vw, 26px)', color: theme.text,
          marginTop: kicker ? 6 : 0, lineHeight: 1.25,
        }}>
          {title}
        </div>
      )}

      {/* Seçilmiş geyim tərzinin adı (design: 11px · .2em · uppercase) */}
      {dc.name && (
        <div style={{
          fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase',
          color: nameCol, marginTop: 14,
        }}>
          {dc.name}
        </div>
      )}

      {/* Dörd ikon iki qrupda: kişi │ qadın. Hər qrupun altında builder-də
          seçilmiş geyim tərzinin öz mətni yazılır (məs. Rəsmi → "Klassik
          kostyum" / "Rəsmi geyim"). Design gap:20px; 320px-də clamp ilə
          daralır, SVG-lər viewBox saxladığı üçün deformasiya olmur. */}
      <style>{SWAY_CSS}</style>
      <div ref={iconsRef} style={{
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
        gap: 'clamp(18px, 7vw, 40px)', margin: '22px 0 0', flexWrap: 'nowrap',
      }}>
        {[
          { key: 'm', icons: [pair[0]], role: labels.male,   text: genders.male },
          { key: 'f', icons: [pair[1]], role: labels.female, text: genders.female },
        ].map((g, gi) => (
          <div key={g.key} style={{ display: 'contents' }}>
            {gi === 1 && (
              <span style={{
                width: 1, height: 96, background: `linear-gradient(${alpha(theme.primary, 0)}, ${alpha(theme.primary, 0.3)}, ${alpha(theme.primary, 0)})`,
                margin: '4px clamp(0px, 0.8vw, 4px) 0', flexShrink: 0, alignSelf: 'flex-start',
              }} />
            )}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 10, minWidth: 0, flexShrink: 1,
            }}>
              <span style={{
                display: 'flex', alignItems: 'flex-end',
                gap: 'clamp(6px, 2.2vw, 14px)',
              }}>
                {g.icons.map((ic) => (
                  <DressIcon key={ic} icon={ic} stroke={stroke} detail={detail} surface={surface} seen={seen} delay={gi * 0.18} />
                ))}
              </span>
              <span style={{ display: 'block', textAlign: 'center', minWidth: 0 }}>
                <span style={{
                  display: 'block', fontSize: 10, letterSpacing: '.16em',
                  textTransform: 'uppercase', color: theme.primary,
                }}>
                  {g.role}
                </span>
                <span style={{
                  display: 'block', fontSize: 11.5, color: nameCol,
                  marginTop: 4, lineHeight: 1.45, overflowWrap: 'anywhere',
                }}>
                  {g.text}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Qeyd — müştərinin öz mətni, yoxdursa palitranın izahı */}
      {text && (
        <div style={{
          fontSize: 12.5, color: noteCol, marginTop: 18, lineHeight: 1.9,
          textAlign: align,
        }}>
          {text}
        </div>
      )}
    </div>
  )
}
