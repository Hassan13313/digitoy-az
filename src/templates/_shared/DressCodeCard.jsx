import { Crown, Martini, Shirt, Palette, Sparkles, Leaf, Flower2, User, Users } from 'lucide-react'
import { DRESS_CODE_PALETTES } from '../../data/constants'

/* ─────────────────────────────────────────────────────────────────────────────
   DRESS CODE CARD — ikon əsaslı premium kart (Claude Design son versiyası).

   Köhnə görünüş (4 rəng zolağı + mətn) əvəzlənir:
     ikon dairəsi + başlıq + alt izah + rəng nümunələri + qeyd + Bəy/Xanım çipi

   ⚠ THEME-AWARE: bütün kart rəngləri `theme` token-lərindən gəlir
   (heç bir hardcode yoxdur). Yalnız swatch-lar palitranın öz rəngləridir —
   onlar məlumatdır, tema deyil.

   ⚠ ID uyğunlaşdırması: builder `DRESS_CODE_OPTIONS` (blacktie/cocktail/
   smartcasual/creative) yazır, dəvətnamə isə `DRESS_CODE_PALETTES`
   (pastel/earth/blacktie/garden) oxuyur. Bu komponent hər iki dəsti tanıyır,
   ona görə naməlum id-də boş kart çıxmır.
   ───────────────────────────────────────────────────────────────────────── */

const ICONS = {
  blacktie:    Crown,
  cocktail:    Martini,
  smartcasual: Shirt,
  creative:    Palette,
  pastel:      Sparkles,
  earth:       Leaf,
  garden:      Flower2,
}

/* Builder-də olan, amma DRESS_CODE_PALETTES-də olmayan id-lər üçün ehtiyat
   məlumat (ad + rənglər) — builder-in öz dəyərləri ilə eynidir. */
const EXTRA = {
  cocktail: {
    label: { az: 'Yarı-rəsmi', en: 'Semi-formal', ru: 'Полуформальный' },
    colors: ['#C4956A', '#E8D5C4', '#8B6347'],
  },
  smartcasual: {
    label: { az: 'Rahat və zərif', en: 'Smart casual', ru: 'Смарт-кэжуал' },
    colors: ['#6B8CAE', '#D4E4F0', '#4A6B8A'],
  },
  creative: {
    label: { az: 'Tematik', en: 'Themed', ru: 'Тематический' },
    colors: ['#9B6B9B', '#F0C4D4', '#6B9B6B'],
  },
}

const SUBTITLES = {
  blacktie:    { az: 'Smokin və axşam geyimi',        en: 'Tuxedo and evening wear',   ru: 'Смокинг и вечерний наряд' },
  cocktail:    { az: 'Müasir və eleqant geyim',       en: 'Modern and elegant',        ru: 'Современный и элегантный' },
  smartcasual: { az: 'Şıq, lakin rahat geyim',        en: 'Chic yet comfortable',      ru: 'Стильно, но удобно' },
  creative:    { az: 'Müəyyən konseptə uyğun geyim',  en: 'Matching the concept',      ru: 'В соответствии с концепцией' },
  pastel:      { az: 'Yumşaq pastel çalarlar',        en: 'Soft pastel shades',        ru: 'Мягкие пастельные оттенки' },
  earth:       { az: 'İsti torpaq tonları',           en: 'Warm earth tones',          ru: 'Тёплые земляные тона' },
  garden:      { az: 'Bağ mərasimi üçün təbii tonlar', en: 'Natural garden tones',     ru: 'Природные садовые тона' },
}

const ROLE_LABELS = {
  az: { groom: 'Bəy', bride: 'Xanım' },
  en: { groom: 'Groom', bride: 'Guests' },
  ru: { groom: 'Жених', bride: 'Гостьи' },
}

/** id → { label, colors } — hər iki id dəstini birləşdirir */
export function resolveDressCode(paletteId, lang = 'az') {
  const fromPalettes = DRESS_CODE_PALETTES.find((p) => p.id === paletteId)
  const extra = EXTRA[paletteId]
  const base = fromPalettes || extra || DRESS_CODE_PALETTES[0]

  return {
    id: paletteId || base.id,
    name: base.label?.[lang] || base.label?.az || '',
    colors: base.colors || [],
    subtitle: SUBTITLES[paletteId]?.[lang] || SUBTITLES[paletteId]?.az || '',
    description: fromPalettes?.description?.[lang] || fromPalettes?.description?.az || '',
    Icon: ICONS[paletteId] || Sparkles,
  }
}

/**
 * @param {object}  theme      şablonun `theme` token obyekti (templateConfig)
 * @param {string}  paletteId  weddingData.dressCodePalette
 * @param {string}  note       weddingData.dressCodeDescription (varsa)
 * @param {boolean} isCouple   Bəy/Xanım çipləri göstərilsinmi
 * @param {boolean} onDark     tünd fonlu şablonlar üçün (kart səthi işıqlanır)
 */
export default function DressCodeCard({ theme, paletteId, note, lang = 'az', isCouple = true, onDark = false }) {
  const dc = resolveDressCode(paletteId, lang)
  const roles = ROLE_LABELS[lang] || ROLE_LABELS.az
  const { Icon } = dc

  /* Kart səthi — açıq şablonda ağ üzərinə, tünd şablonda aksentin şəffaf qatı */
  const cardBg     = onDark ? `${theme.primary}0F` : '#FFFFFF'
  const cardBorder = `${theme.accent}${onDark ? '33' : '38'}`
  const iconBg     = `${theme.accent}1F`
  const iconBorder = `${theme.accent}45`
  const divider    = `${theme.accent}2E`

  const text = note || dc.description

  return (
    <div
      style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        borderRadius: 18,
        padding: 'clamp(16px, 4.5vw, 22px)',
        boxShadow: onDark ? 'none' : `0 10px 30px ${theme.primary}14`,
      }}
    >
      {/* Başlıq sətri: ikon + ad + alt izah */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 3.5vw, 16px)' }}>
        <span
          aria-hidden="true"
          style={{
            width: 48, height: 48, flex: '0 0 auto', borderRadius: '50%',
            background: iconBg, border: `1px solid ${iconBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon size={20} strokeWidth={1.4} style={{ color: theme.accent }} />
        </span>

        <span style={{ minWidth: 0 }}>
          <span style={{
            display: 'block',
            fontFamily: theme.fonts?.heading,
            fontSize: 'clamp(18px, 5vw, 22px)',
            lineHeight: 1.2, color: theme.text,
          }}>
            {dc.name}
          </span>
          {dc.subtitle && (
            <span style={{
              display: 'block', marginTop: 4,
              fontSize: 'clamp(11px, 3vw, 12.5px)', color: theme.muted, lineHeight: 1.45,
            }}>
              {dc.subtitle}
            </span>
          )}
        </span>
      </div>

      {/* Rəng nümunələri — palitranın öz rəngləri */}
      {dc.colors.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
          {dc.colors.map((c, i) => (
            <span
              key={`${c}-${i}`}
              title={c}
              style={{
                width: 26, height: 26, borderRadius: '50%', background: c,
                border: `1px solid ${theme.muted}40`, display: 'block',
                boxShadow: onDark ? 'none' : '0 2px 6px rgba(0,0,0,0.08)',
              }}
            />
          ))}
        </div>
      )}

      {/* Qeyd */}
      {text && (
        <>
          <div style={{ height: 1, background: divider, margin: '16px 0 14px' }} />
          <p style={{
            margin: 0, fontSize: 'clamp(12px, 3.2vw, 13px)',
            lineHeight: 1.8, color: theme.muted,
          }}>
            {text}
          </p>
        </>
      )}

      {/* Bəy / Xanım çipləri */}
      {isCouple && (
        <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
          {[{ Ico: User, l: roles.groom }, { Ico: Users, l: roles.bride }].map(({ Ico, l }) => (
            <span
              key={l}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 13px', borderRadius: 100,
                border: `1px solid ${theme.accent}33`,
                fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase',
                color: theme.muted,
              }}
            >
              <Ico size={11} strokeWidth={1.5} style={{ color: theme.accent }} />
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
