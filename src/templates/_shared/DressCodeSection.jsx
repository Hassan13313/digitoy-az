import { resolveDressCode, resolveDressGenders } from '../../data/dressCode'
import { alpha, readableOn } from './geo'
import t from '../../data/translations'

/* ─────────────────────────────────────────────────────────────────────────────
   DRESS CODE — 9 şablonun YEGANƏ geyim tərzi bölməsi.

   Layihədə başqa dress code görünüşü YOXDUR (`ThreeDDressCode`, `DressCodeCard`
   və `assets/dresscode/*.gif` Phase 27.2-də silindi). Data `data/dressCode.js`.

   ── İKONLAR: Claude Design "Digitoy Templates.dc.html" (yenilənmiş versiya) ──
   Design köhnə clip-path siluetlərini SVG xətt-qrafikası ilə əvəz etdi. İndi
   dörd ikon iki qrupa bölünür — ortada nazik ayırıcı xətt:

       kostyum + kişi ayaqqabısı   │   don + qadın ayaqqabısı

   `path` dəyərləri design faylından hərf-hərf köçürülüb və 8 şablonun
   hamısında EYNİDİR — design yalnız rəngləri dəyişir. Ona görə burada da
   yeganə dəyişən rənglərdir, forma sabitdir.

   Rəng uyğunluğu (design → theme):
     stroke  → aksent, fonda oxunmursa mətn rənginə düşür (`readableOn`)
              t1 #E8D5A3 = royal-gold accent · t3 #2B2723 = white-elegance text
     fill    → kartın səthi (tünd şablonda tünd, açıqda ağ)
     detal   → primary, fonda itirsə muted (qalstuk düyünü, ətək tikişi, daban)
   ───────────────────────────────────────────────────────────────────────── */

/* Design-dakı dörd ikon. viewBox və `d` dəyərləri design faylından olduğu kimi. */
const ICONS = {
  /* Kişi: kostyum (34×48) */
  suit: {
    viewBox: '0 0 34 48', w: 52, h: 74, strokeWidth: 1.3,
    paths: [
      { d: 'M12 5 L17 8 L22 5 L29 8 L31 20 L26 21 V45 H8 V21 L3 20 L5 8 Z', filled: true },
      { d: 'M12 5 L17 13 L22 5' },
      { d: 'M17 13 V44' },
      { d: 'M13 8 L17 5 L21 8', detail: true },
      { d: 'M8 21 L5 20 M26 21 L31 20' },
    ],
  },
  /* Kişi: klassik ayaqqabı (34×24) */
  shoe: {
    viewBox: '0 0 34 24', w: 46, h: 33, strokeWidth: 1.3,
    paths: [
      { d: 'M4 20 V11 C4 8 6 6 9 6 L14 6 C17 6 19 8 23 9 L28 11 C30 12 31 14 31 16 V20 Z', filled: true },
      { d: 'M4 20 H31' },
      { d: 'M9 6 L12 11 L18 12', detail: true },
    ],
  },
  /* Qadın: uzun don (34×48) */
  gown: {
    viewBox: '0 0 34 48', w: 52, h: 74, strokeWidth: 1.3,
    paths: [
      { d: 'M13 6 L17 3 L21 6 L19 16 L31 45 H3 L15 16 Z', filled: true },
      { d: 'M15 16 H19' },
      { d: 'M8 36 H26', detail: true, dash: '2.5 3.5' },
    ],
  },
  /* Qadın: daban (34×24) */
  heel: {
    viewBox: '0 0 34 24', w: 46, h: 33, strokeWidth: 1.1,
    paths: [
      { d: 'M4 19.5 C4 17 6.5 16 9 15 C15 12.5 19 8 21 4.5 C21.6 3.4 23 3.4 23.8 4.4 C25.6 6.6 26.6 9 26.4 11.6 C26.2 13.6 25 15 23.4 16.2 C22 17.2 21.4 18.2 21.2 19.5 Z', filled: true },
      { d: 'M23.4 16.2 C24.6 17 25.2 18.4 25.4 20.4 L26.6 20.4 C26.4 17.6 26 15.4 25.2 13.8', filled: true, detail: true },
      { d: 'M22.6 5.6 C24 7.2 24.8 9 24.8 11', detail: true },
      { d: 'M3.6 20.4 H27.4' },
    ],
  },
}

function DressIcon({ icon, stroke, detail, surface }) {
  const ic = ICONS[icon]
  return (
    <svg
      viewBox={ic.viewBox}
      width={ic.w}
      height={ic.h}
      fill="none"
      stroke={stroke}
      strokeWidth={ic.strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {ic.paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill={p.filled ? surface : 'none'}
          stroke={p.detail ? detail : undefined}
          strokeDasharray={p.dash}
        />
      ))}
    </svg>
  )
}

/**
 * @param {object}  theme     şablonun theme token-ləri (templateConfig)
 * @param {string}  paletteId weddingData.dressCodePalette
 * @param {string}  note      weddingData.dressCodeDescription
 * @param {string}  title     bölmə başlığı (tr.inv_dresscode)
 * @param {string}  kicker    üst etiket (varsa)
 * @param {string}  serif     başlıq şrifti
 * @param {string}  align     'left' | 'center'
 * @param {boolean} onDark    tünd şablonlarda ikon səthi tündləşir
 */
export default function DressCodeSection({
  theme, paletteId, note, title, kicker, lang = 'az',
  serif, align = 'left', onDark = false, italic = false,
}) {
  const tr = t[lang] || t.az
  const dc = resolveDressCode(paletteId, lang)
  const genders = resolveDressGenders(paletteId, lang)
  const labels = { male: tr.dresscode_male_label, female: tr.dresscode_female_label }
  /* Qeyd = YALNIZ müştərinin builder-də yazdığı mətn. Palitranın öz izahı
     burada göstərilmir, çünki ikonların altındakı kişi/qadın yazıları onsuz da
     eyni məlumatı verir — əks halda cümlə təkrarlanırdı. */
  const text = (note || '').trim()

  /* Design-dakı rəng rolları — hamısı theme-dən hesablanır, hardcode yoxdur */
  const surface = onDark ? alpha(theme.accent, 0.09) : '#FFFFFF'
  const bg      = theme.surface || theme.background
  const stroke  = readableOn(bg, theme.accent, theme.text)
  /* Detal xətti dekorativdir (mətn deyil) → daha yumşaq kontrast həddi */
  const detail  = readableOn(bg, theme.primary, theme.muted, 2.2)
  const nameCol = readableOn(bg, theme.muted, theme.text)
  const noteCol = readableOn(bg, theme.muted, theme.text)

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
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
        gap: 'clamp(10px, 4vw, 22px)', margin: '22px 0 0', flexWrap: 'nowrap',
      }}>
        {[
          { key: 'm', icons: ['suit', 'shoe'], role: labels.male,   text: genders.male },
          { key: 'f', icons: ['gown', 'heel'], role: labels.female, text: genders.female },
        ].map((g, gi) => (
          <div key={g.key} style={{ display: 'contents' }}>
            {gi === 1 && (
              <span style={{
                width: 1, height: 56, background: alpha(theme.primary, 0.22),
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
                  <DressIcon key={ic} icon={ic} stroke={stroke} detail={detail} surface={surface} />
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
