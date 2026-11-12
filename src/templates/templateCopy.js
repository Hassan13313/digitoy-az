/* ─────────────────────────────────────────────────────────────────────────────
   ŞABLON MƏTNLƏRİNİN REYESTRİ (2026-10-28) — admin «Mətnlər» tabı üçün

   Hər premium şablonun `copy.js` faylı (LABELS + TXT + FIELDS) burada
   toplanır. Admin paneli buradan:
     • şablonun ÖZ bölmə başlıqlarını placeholder kimi göstərir,
     • yalnız həmin şablona aid sətirlərin sahələrini qurur.
   Override qatı (`data/adminOverrides.js`) bu açarları ağ siyahıya əlavə edir.

   ⚠ Şablon komponentləri bu faylı İDXAL ETMİR (hər biri yalnız öz copy.js-ini
   yükləyir) — reyestr şablon chunk-larına düşmür.
   ⚠ React YOXDUR, uzantılar qəsdən yazılıb — node testləri birbaşa yükləyir.
   ───────────────────────────────────────────────────────────────────────── */
import { copyPrefix, variantCopy } from './_shared/copyText.js'
import * as orientalLuxe from './oriental-luxe/copy.js'
import * as whiteElegance from './white-elegance/copy.js'
import * as vinylRecord from './vinyl-record/copy.js'
import * as royalPalace from './royal-palace/copy.js'
import * as crystalGlass from './crystal-glass/copy.js'
import * as luxuryJewelry from './luxury-jewelry/copy.js'
import * as natureTouch from './nature-touch/copy.js'
import * as boardingPass from './boarding-pass/copy.js'
import * as cinemaPremiere from './cinema-premiere/copy.js'
import * as gazette from './gazette/copy.js'
import * as mediterranean from './mediterranean/copy.js'
import * as nightSky from './night-sky/copy.js'
import * as modernBlack from './modern-black/copy.js'
/* 2026-10 — konsept şablonları (50) */
import * as fairyTale from './fairy-tale/copy.js'
import * as spaceMission from './space-mission/copy.js'
import * as circusShow from './circus-show/copy.js'
import * as dinoAdventure from './dino-adventure/copy.js'
import * as balloonParty from './balloon-party/copy.js'
import * as redVeil from './red-veil/copy.js'
import * as xonca from './xonca/copy.js'
import * as hennaButa from './henna-buta/copy.js'
import * as mirrorCandle from './mirror-candle/copy.js'
import * as kelagayi from './kelagayi/copy.js'
import * as candleRings from './candle-rings/copy.js'
import * as bridalVeil from './bridal-veil/copy.js'
import * as firstDance from './first-dance/copy.js'
import * as ivorySilk from './ivory-silk/copy.js'
import * as bakuNight from './baku-night/copy.js'
import * as goldenHour from './golden-hour/copy.js'
import * as shahdag from './shahdag/copy.js'
import * as littlePrince from './little-prince/copy.js'
import * as heroComic from './hero-comic/copy.js'
import * as mashallah from './mashallah/copy.js'
import * as littlePilot from './little-pilot/copy.js'
import * as footballStar from './football-star/copy.js'
import * as pastelBloom from './pastel-bloom/copy.js'
import * as teddyBear from './teddy-bear/copy.js'
import * as genderReveal from './gender-reveal/copy.js'
import * as storkLetter from './stork-letter/copy.js'
import * as babyMobile from './baby-mobile/copy.js'
import * as galaNight from './gala-night/copy.js'
import * as keynote from './keynote/copy.js'
import * as awardNight from './award-night/copy.js'
import * as businessCard from './business-card/copy.js'
import * as neonParty from './neon-party/copy.js'
import * as silverLocket from './silver-locket/copy.js'
import * as goldenJubilee from './golden-jubilee/copy.js'
import * as firstPaper from './first-paper/copy.js'
import * as retroPolaroid from './retro-polaroid/copy.js'
import * as loveLetters from './love-letters/copy.js'
import * as capsToss from './caps-toss/copy.js'
import * as yearbook from './yearbook/copy.js'
import * as lastBell from './last-bell/copy.js'
import * as chalkboard from './chalkboard/copy.js'
import * as paperPlane from './paper-plane/copy.js'
import * as ribbonCut from './ribbon-cut/copy.js'
import * as bistroSign from './bistro-sign/copy.js'
import * as rollerShutter from './roller-shutter/copy.js'
import * as unboxing from './unboxing/copy.js'
import * as galleryUnveil from './gallery-unveil/copy.js'
import * as novruzBonfire from './novruz-bonfire/copy.js'
import * as novruzSemeni from './novruz-semeni/copy.js'
import * as midnightClock from './midnight-clock/copy.js'
import * as snowGlobe from './snow-globe/copy.js'
import * as masqueradeBall from './masquerade-ball/copy.js'
import * as pinkChampagne from './pink-champagne/copy.js'
import * as discoBall from './disco-ball/copy.js'
import * as pajamaSpa from './pajama-spa/copy.js'
import * as parisNight from './paris-night/copy.js'
import * as bohoSunset from './boho-sunset/copy.js'
import * as royalGold from './royal-gold/copy.js'
import * as floralGarden from './floral-garden/copy.js'

const REGISTRY = {
  'royal-gold': royalGold,
  'floral-garden': floralGarden,
  'oriental-luxe': orientalLuxe,
  'white-elegance': whiteElegance,
  'vinyl-record': vinylRecord,
  'royal-palace': royalPalace,
  'crystal-glass': crystalGlass,
  'luxury-jewelry': luxuryJewelry,
  'nature-touch': natureTouch,
  'boarding-pass': boardingPass,
  'cinema-premiere': cinemaPremiere,
  'gazette': gazette,
  'mediterranean': mediterranean,
  'night-sky': nightSky,
  'modern-black': modernBlack,
  'fairy-tale': fairyTale,
  'space-mission': spaceMission,
  'circus-show': circusShow,
  'dino-adventure': dinoAdventure,
  'balloon-party': balloonParty,
  'red-veil': redVeil,
  'xonca': xonca,
  'henna-buta': hennaButa,
  'mirror-candle': mirrorCandle,
  'kelagayi': kelagayi,
  'candle-rings': candleRings,
  'bridal-veil': bridalVeil,
  'first-dance': firstDance,
  'ivory-silk': ivorySilk,
  'baku-night': bakuNight,
  'golden-hour': goldenHour,
  'shahdag': shahdag,
  'little-prince': littlePrince,
  'hero-comic': heroComic,
  'mashallah': mashallah,
  'little-pilot': littlePilot,
  'football-star': footballStar,
  'pastel-bloom': pastelBloom,
  'teddy-bear': teddyBear,
  'gender-reveal': genderReveal,
  'stork-letter': storkLetter,
  'baby-mobile': babyMobile,
  'gala-night': galaNight,
  'keynote': keynote,
  'award-night': awardNight,
  'business-card': businessCard,
  'neon-party': neonParty,
  'silver-locket': silverLocket,
  'golden-jubilee': goldenJubilee,
  'first-paper': firstPaper,
  'retro-polaroid': retroPolaroid,
  'love-letters': loveLetters,
  'caps-toss': capsToss,
  'yearbook': yearbook,
  'last-bell': lastBell,
  'chalkboard': chalkboard,
  'paper-plane': paperPlane,
  'ribbon-cut': ribbonCut,
  'bistro-sign': bistroSign,
  'roller-shutter': rollerShutter,
  'unboxing': unboxing,
  'gallery-unveil': galleryUnveil,
  'novruz-bonfire': novruzBonfire,
  'novruz-semeni': novruzSemeni,
  'midnight-clock': midnightClock,
  'snow-globe': snowGlobe,
  'masquerade-ball': masqueradeBall,
  'pink-champagne': pinkChampagne,
  'disco-ball': discoBall,
  'pajama-spa': pajamaSpa,
  'paris-night': parisNight,
  'boho-sunset': bohoSunset,
}

/** Şablonun öz bölmə başlıqları `{ countdown: { title: {az,en,ru} } … }` (yoxdursa null) */
export function templateLabels(templateId) {
  return REGISTRY[templateId]?.LABELS || null
}

/**
 * Şablonun admin sahələri, FIELDS sırası ilə:
 * `[{ key: 'tpl_boarding_pass.pax', section: 'hero', label, hint, defaults: {az,en,ru} }]`
 * `eventType` — placeholder-lar həmin tədbirin versiyasından gəlir (ad günü ≠ toy).
 */
export function templateCopyFields(templateId, eventType = null) {
  const mod = REGISTRY[templateId]
  if (!mod) return []
  const prefix = copyPrefix(templateId)
  const txt = variantCopy(mod.TXT, mod.VARIANTS, eventType)
  return mod.FIELDS.map(([k, section, label, hint]) => ({
    key: prefix + k,
    section,
    label,
    hint: hint || null,
    defaults: { az: txt.az[k], en: txt.en[k], ru: txt.ru[k] },
  }))
}

/** Bütün şablonların admin açarları — override qatının ağ siyahısı üçün */
export const TEMPLATE_COPY_KEYS = new Set(
  Object.keys(REGISTRY).flatMap((id) => templateCopyFields(id).map((f) => f.key)),
)
