import { PHOTOS as candleRings } from './candle-rings/photos.js'
import { PHOTOS as bridalVeil } from './bridal-veil/photos.js'
import { PHOTOS as firstDance } from './first-dance/photos.js'
import { PHOTOS as ivorySilk } from './ivory-silk/photos.js'
import { PHOTOS as bakuNight } from './baku-night/photos.js'
import { PHOTOS as goldenHour } from './golden-hour/photos.js'
import { PHOTOS as shahdag } from './shahdag/photos.js'
import { PHOTOS as royalPalace } from './royal-palace/photos.js'
import { PHOTOS as orientalLuxe } from './oriental-luxe/photos.js'
import { PHOTOS as nightSky } from './night-sky/photos.js'
import { PHOTOS as mediterranean } from './mediterranean/photos.js'
import { PHOTOS as crystalGlass } from './crystal-glass/photos.js'
import { PHOTOS as gazette } from './gazette/photos.js'
import { PHOTOS as royalGold } from './royal-gold/photos.js'
import { PHOTOS as luxuryJewelry } from './luxury-jewelry/photos.js'
import { PHOTOS as floralGarden } from './floral-garden/photos.js'
import { PHOTOS as whiteElegance } from './white-elegance/photos.js'
import { PHOTOS as natureTouch } from './nature-touch/photos.js'
import { PHOTOS as vinylRecord } from './vinyl-record/photos.js'
import { PHOTOS as cinemaPremiere } from './cinema-premiere/photos.js'
import { PHOTOS as boardingPass } from './boarding-pass/photos.js'
import { PHOTOS as modernBlack } from './modern-black/photos.js'
import { PHOTOS as redVeil } from './red-veil/photos.js'
import { PHOTOS as xonca } from './xonca/photos.js'
import { PHOTOS as hennaButa } from './henna-buta/photos.js'
import { PHOTOS as mirrorCandle } from './mirror-candle/photos.js'
import { PHOTOS as kelagayi } from './kelagayi/photos.js'
import { PHOTOS as littlePrince } from './little-prince/photos.js'
import { PHOTOS as heroComic } from './hero-comic/photos.js'
import { PHOTOS as mashallah } from './mashallah/photos.js'
import { PHOTOS as littlePilot } from './little-pilot/photos.js'
import { PHOTOS as footballStar } from './football-star/photos.js'
import { PHOTOS as fairyTale } from './fairy-tale/photos.js'
import { PHOTOS as spaceMission } from './space-mission/photos.js'
import { PHOTOS as circusShow } from './circus-show/photos.js'
import { PHOTOS as dinoAdventure } from './dino-adventure/photos.js'
import { PHOTOS as balloonParty } from './balloon-party/photos.js'
import { PHOTOS as pastelBloom } from './pastel-bloom/photos.js'
import { PHOTOS as teddyBear } from './teddy-bear/photos.js'
import { PHOTOS as genderReveal } from './gender-reveal/photos.js'
import { PHOTOS as storkLetter } from './stork-letter/photos.js'
import { PHOTOS as babyMobile } from './baby-mobile/photos.js'
import { PHOTOS as galaNight } from './gala-night/photos.js'
import { PHOTOS as keynote } from './keynote/photos.js'
import { PHOTOS as awardNight } from './award-night/photos.js'
import { PHOTOS as businessCard } from './business-card/photos.js'
import { PHOTOS as neonParty } from './neon-party/photos.js'
import { PHOTOS as silverLocket } from './silver-locket/photos.js'
import { PHOTOS as goldenJubilee } from './golden-jubilee/photos.js'
import { PHOTOS as firstPaper } from './first-paper/photos.js'
import { PHOTOS as retroPolaroid } from './retro-polaroid/photos.js'
import { PHOTOS as loveLetters } from './love-letters/photos.js'
import { PHOTOS as capsToss } from './caps-toss/photos.js'
import { PHOTOS as yearbook } from './yearbook/photos.js'
import { PHOTOS as lastBell } from './last-bell/photos.js'
import { PHOTOS as chalkboard } from './chalkboard/photos.js'
import { PHOTOS as paperPlane } from './paper-plane/photos.js'
import { PHOTOS as ribbonCut } from './ribbon-cut/photos.js'
import { PHOTOS as bistroSign } from './bistro-sign/photos.js'
import { PHOTOS as rollerShutter } from './roller-shutter/photos.js'
import { PHOTOS as unboxing } from './unboxing/photos.js'
import { PHOTOS as galleryUnveil } from './gallery-unveil/photos.js'
import { PHOTOS as novruzBonfire } from './novruz-bonfire/photos.js'
import { PHOTOS as novruzSemeni } from './novruz-semeni/photos.js'
import { PHOTOS as midnightClock } from './midnight-clock/photos.js'
import { PHOTOS as snowGlobe } from './snow-globe/photos.js'
import { PHOTOS as masqueradeBall } from './masquerade-ball/photos.js'
import { PHOTOS as pinkChampagne } from './pink-champagne/photos.js'
import { PHOTOS as discoBall } from './disco-ball/photos.js'
import { PHOTOS as pajamaSpa } from './pajama-spa/photos.js'
import { PHOTOS as parisNight } from './paris-night/photos.js'
import { PHOTOS as bohoSunset } from './boho-sunset/photos.js'

/* ─────────────────────────────────────────────────────────────────────────────
   ŞABLONUN ŞƏKİL YERLƏRİ (2026-11) — admin «Şəkillər» tabı

   Foto ilə qurulmuş şablonlarda hər şəkil yeri (`<şablon>/photos.js › PHOTOS`)
   admin paneldən gizlədilə və ya başqa şəkillə əvəz edilə bilər.
   Model: `admin.images = { <açar>: { hide: true } | { src: '/uploads/_admin/…' } }`
   — həm şablon səviyyəsində («Şablonlar»), həm dəvətnamədə («Məzmun»).
   Açar yoxdursa şablonun öz fotosu göstərilir (davranış dəyişmir).
   ───────────────────────────────────────────────────────────────────────── */

const REGISTRY = {
  'candle-rings': candleRings,
  'bridal-veil': bridalVeil,
  'first-dance': firstDance,
  'ivory-silk': ivorySilk,
  'baku-night': bakuNight,
  'golden-hour': goldenHour,
  shahdag,
  'royal-palace': royalPalace,
  'oriental-luxe': orientalLuxe,
  'night-sky': nightSky,
  'mediterranean': mediterranean,
  'crystal-glass': crystalGlass,
  'gazette': gazette,
  'royal-gold': royalGold,
  'luxury-jewelry': luxuryJewelry,
  'floral-garden': floralGarden,
  'white-elegance': whiteElegance,
  'nature-touch': natureTouch,
  'vinyl-record': vinylRecord,
  'cinema-premiere': cinemaPremiere,
  'boarding-pass': boardingPass,
  'modern-black': modernBlack,
  /* 2026-11-13 — xına gecəsi seriyası */
  'red-veil': redVeil,
  xonca,
  'henna-buta': hennaButa,
  'mirror-candle': mirrorCandle,
  kelagayi,
  /* 2026-11-13 — sünnət toyu seriyası */
  'little-prince': littlePrince,
  'hero-comic': heroComic,
  mashallah,
  'little-pilot': littlePilot,
  'football-star': footballStar,
  /* 2026-11-13 — uşaq ad günü seriyası */
  'fairy-tale': fairyTale,
  'space-mission': spaceMission,
  'circus-show': circusShow,
  'dino-adventure': dinoAdventure,
  'balloon-party': balloonParty,
  /* 2026-11-13 — baby shower seriyası */
  'pastel-bloom': pastelBloom,
  'teddy-bear': teddyBear,
  'gender-reveal': genderReveal,
  'stork-letter': storkLetter,
  'baby-mobile': babyMobile,
  /* 2026-11-13 — korporativ seriyası */
  'gala-night': galaNight,
  keynote,
  'award-night': awardNight,
  'business-card': businessCard,
  'neon-party': neonParty,
  /* 2026-11-13 — ildönümü seriyası */
  'silver-locket': silverLocket,
  'golden-jubilee': goldenJubilee,
  'first-paper': firstPaper,
  'retro-polaroid': retroPolaroid,
  'love-letters': loveLetters,
  /* 2026-11-13 — məzuniyyət seriyası */
  'caps-toss': capsToss,
  yearbook,
  'last-bell': lastBell,
  chalkboard,
  'paper-plane': paperPlane,
  /* 2026-11-13 — açılış və təqdimat seriyası */
  'ribbon-cut': ribbonCut,
  'bistro-sign': bistroSign,
  'roller-shutter': rollerShutter,
  unboxing,
  'gallery-unveil': galleryUnveil,
  /* 2026-11-13 — bayram gecələri seriyası */
  'novruz-bonfire': novruzBonfire,
  'novruz-semeni': novruzSemeni,
  'midnight-clock': midnightClock,
  'snow-globe': snowGlobe,
  'masquerade-ball': masqueradeBall,
  /* 2026-11-13 — qız gecəsi seriyası */
  'pink-champagne': pinkChampagne,
  'disco-ball': discoBall,
  'pajama-spa': pajamaSpa,
  'paris-night': parisNight,
  'boho-sunset': bohoSunset,
}

/** Bütün şablonların şəkil açarları — admin datasının ağ siyahısı */
export const TEMPLATE_PHOTO_KEYS = new Set(Object.values(REGISTRY).flat().map((p) => p.key))

/** Şablonun şəkil yerləri ([] — şəkil tabı yoxdur) */
export function templatePhotoSlots(templateId) {
  return REGISTRY[templateId] || []
}

/**
 * Hər yer üçün göstəriləcək şəkil: admin şəkli → şablonun fotosu; gizlədilibsə null.
 * `images` — normalizeOverrides-dən keçmiş `admin.images` (və ya null).
 */
export function resolvePhotos(slots, images) {
  const out = {}
  for (const p of slots) {
    const o = images?.[p.key]
    out[p.key] = o?.hide ? null : (o?.src || p.src)
  }
  return out
}

/** Admin bu yerə öz şəklini qoyub? (fotoya bağlı effektlər — məs. qığılcım yeri — söndürülür) */
export function isCustomPhoto(images, key) {
  return !!images?.[key]?.src
}
