import { DRESS_CODE_PALETTES } from './constants'

/* ─────────────────────────────────────────────────────────────────────────────
   DRESS CODE — palitra məlumatı (UI YOXDUR).

   Əvvəl bu məntiq `templates/_shared/DressCodeCard.jsx` içində idi; həmin fayl
   həm data, həm də İKİNCİ bir dress code görünüşü saxlayırdı. Phase 27.2-də
   vizual hissə silindi (yeganə görünüş `DressCodeSection.jsx`-dir), data isə
   bura köçdü ki, komponent faylında qeyri-komponent export qalmasın.

   ⚠ ID uyğunlaşdırması: builder `DRESS_CODE_OPTIONS` (blacktie/cocktail/
   smartcasual/creative) yazır, dəvətnamə isə `DRESS_CODE_PALETTES`
   (pastel/earth/blacktie/garden) oxuyur. Bu modul hər iki dəsti tanıyır,
   ona görə naməlum id-də boş kart çıxmır.
   ───────────────────────────────────────────────────────────────────────── */

/* Builder-də olan, amma DRESS_CODE_PALETTES-də olmayan id-lər üçün ehtiyat */
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
  blacktie:    { az: 'Klassik Kostyum · Rəsmi Geyim',   en: 'Classic Suit · Formal Attire', ru: 'Классический костюм · Официальный наряд' },
  cocktail:    { az: 'Müasir Stil · Elegant Stil',    en: 'Modern Style · Elegant Style', ru: 'Современный стиль · Элегантный стиль' },
  smartcasual: { az: 'Rahat Stil · Zərif Stil',       en: 'Relaxed Style · Refined Style', ru: 'Свободный стиль · Изысканный стиль' },
  creative:    { az: 'Tematik Stil',                  en: 'Themed Style',              ru: 'Тематический стиль' },
  pastel:      { az: 'Yumşaq pastel çalarlar',        en: 'Soft pastel shades',        ru: 'Мягкие пастельные оттенки' },
  earth:       { az: 'İsti torpaq tonları',           en: 'Warm earth tones',          ru: 'Тёплые земляные тона' },
  garden:      { az: 'Bağ mərasimi üçün təbii tonlar', en: 'Natural garden tones',     ru: 'Природные садовые тона' },
}

/* Kişi / qadın geyim mətnləri — builder kartındakı ifadələrlə EYNİDİR.
   Dəvətnamədəki ikonların altında da məhz bunlar göstərilir ki, müştəri
   builder-də nə seçibsə, qonaq eyni ifadəni görsün. */
const GENDERS = {
  blacktie: {
    az: { male: 'Klassik Kostyum', female: 'Rəsmi Geyim' },
    en: { male: 'Classic Suit',    female: 'Formal Attire' },
    ru: { male: 'Классический костюм', female: 'Официальный наряд' },
  },
  cocktail: {
    az: { male: 'Müasir Stil',  female: 'Elegant Stil' },
    en: { male: 'Modern Style', female: 'Elegant Style' },
    ru: { male: 'Современный стиль', female: 'Элегантный стиль' },
  },
  smartcasual: {
    az: { male: 'Rahat Stil',    female: 'Zərif Stil' },
    en: { male: 'Relaxed Style', female: 'Refined Style' },
    ru: { male: 'Свободный стиль', female: 'Изысканный стиль' },
  },
  creative: {
    az: { male: 'Tematik Stil', female: 'Tematik Stil' },
    en: { male: 'Themed Style', female: 'Themed Style' },
    ru: { male: 'Тематический стиль', female: 'Тематический стиль' },
  },
  /* Köhnə palitralar — builder artıq yazmır, mövcud dəvətnamələrdə qalır */
  pastel: {
    az: { male: 'Klassik Kostyum', female: 'Pastel Stil' },
    en: { male: 'Classic Suit',    female: 'Pastel Style' },
    ru: { male: 'Классический костюм', female: 'Пастельный стиль' },
  },
  earth: {
    az: { male: 'Klassik Kostyum', female: 'Torpaq Stili' },
    en: { male: 'Classic Suit',    female: 'Earth-tone Style' },
    ru: { male: 'Классический костюм', female: 'Земляной стиль' },
  },
  garden: {
    az: { male: 'Kətan Kostyum', female: 'Bağ Stili' },
    en: { male: 'Linen Suit',    female: 'Garden Style' },
    ru: { male: 'Льняной костюм', female: 'Садовый стиль' },
  },
}

/**
 * Palitra → { male, female } geyim mətnləri (naməlum id-də blacktie)
 *
 * @param {object} [customGenders] `weddingData.dressCodeGenders` —
 *   { [paletteId]: { male, female } }. Hər sahə AYRICA yoxlanılır: boşdursa
 *   standart mətn qalır → köhnə sifarişlər və yarımçıq doldurulmuş kartlar
 *   eyni əvvəlki kimi göstərilir.
 */
export function resolveDressGenders(paletteId, lang = 'az', customGenders = null) {
  const g = GENDERS[paletteId] || GENDERS.blacktie
  const base = g[lang] || g.az
  const c = customGenders?.[paletteId]
  const pick = (v, fallback) => (typeof v === 'string' && v.trim() ? v.trim() : fallback)
  return {
    male: pick(c?.male, base.male),
    female: pick(c?.female, base.female),
  }
}

/**
 * id → { name, colors, subtitle, description } — hər iki id dəstini birləşdirir
 *
 * @param {object} [customLabels] `weddingData.dressCodeLabels` — istifadəçinin
 *   builder-də yazdığı fərdi adlar ({ blacktie: 'Black Tie', ... }).
 *   ⚠ FALLBACK: açar yoxdursa və ya boşdursa standart ad qalır → bu sahəsi
 *   olmayan KÖHNƏ sifarişlər eyni əvvəlki kimi göstərilir.
 */
export function resolveDressCode(paletteId, lang = 'az', customLabels = null) {
  const fromPalettes = DRESS_CODE_PALETTES.find((p) => p.id === paletteId)
  const extra = EXTRA[paletteId]
  const base = fromPalettes || extra || DRESS_CODE_PALETTES[0]

  const custom = typeof customLabels?.[paletteId] === 'string'
    ? customLabels[paletteId].trim()
    : ''

  return {
    id: paletteId || base.id,
    name: custom || base.label?.[lang] || base.label?.az || '',
    colors: base.colors || [],
    subtitle: SUBTITLES[paletteId]?.[lang] || SUBTITLES[paletteId]?.az || '',
    description: fromPalettes?.description?.[lang] || fromPalettes?.description?.az || '',
  }
}

export default resolveDressCode
