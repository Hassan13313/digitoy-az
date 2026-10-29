import { FONT_STACKS } from '../templateConfig'
import { storyPhotoSrc } from '../../utils/api'

/* ─────────────────────────────────────────────────────────────────────────────
   «BİZİM HEKAYƏMİZ» — ŞABLON TEMALARI (Phase 44)

   Mənbə: Claude Design › «Love Story.dc.html» (DigiToy · Love Story bölməsi).
   Hər şablonun hekayədə ÖZ vizual dili var: çərçivə (polaroid, bilet, film
   lenti, qəzet kəsiyi…), əsas fotonun forması (tağ, dairə, oktaqon…),
   fəsil nişanları (I · 01 · A1 · ✦ I) və başlıq mətni.

   ⚠ Rənglər dizayn faylındakı kimidir, `templateConfig`-dəki kimi DEYİL:
   dizaynda bəzi tonlar hekayə kartlarının kontrastı üçün incələşdirilib
   (məs. night-sky `mute`). Admin rəng override-ı varsa üstünə qoyulur
   (bax `getStoryTheme`).
   ⚠ Şriftlər FONT_STACKS-dan gəlir — orada `Ə` glyph-i olmayan ailələr üçün
   yaxın ehtiyat şrift var (bax templateConfig › FONT_STACKS).
   ───────────────────────────────────────────────────────────────────────── */

const F = {
  cormorant:  FONT_STACKS.cormorant,
  vibes:      "'Great Vibes', 'Cormorant Garamond', Georgia, cursive",
  jost:       FONT_STACKS.jost,
  dm:         FONT_STACKS.dmsans,
  archivo:    FONT_STACKS.archivo,
  instrument: FONT_STACKS.instrument,
  marcellus:  FONT_STACKS.marcellus,
  newsreader: FONT_STACKS.newsreader,
  amiri:      FONT_STACKS.amiri,
  sg:         FONT_STACKS.spacegrotesk,
  mono:       FONT_STACKS.jetbrains,
  bebas:      FONT_STACKS.bebas,
  cinzel:     FONT_STACKS.cinzel,
  bask:       FONT_STACKS.baskerville,
  inter:      FONT_STACKS.inter,
  notoDisplay: FONT_STACKS.notoDisplay,
  hanken:     FONT_STACKS.hanken,
  fraunces:   FONT_STACKS.fraunces,
  mulish:     FONT_STACKS.mulish,
  /* Floral Garden: rus dilində şablon başlıq şriftini Cormorant-a keçirir
     (Fraunces-də kiril yoxdur) — dəyişən şablonun kök elementindədir */
  fgSerif:    `var(--fg-serif, ${FONT_STACKS.fraunces})`,
  /* Premium redizayn (2026-10) — hər şablon öz cütünü yükləyir (fonts.js) */
  unbounded:  FONT_STACKS.unbounded,
  interTight: FONT_STACKS.interTight,
  spectral:   FONT_STACKS.spectral,
  sourceSerif: FONT_STACKS.sourceSerif,
  commissioner: FONT_STACKS.commissioner,
  reemKufi:   FONT_STACKS.reemKufi,
  alegreya:   FONT_STACKS.alegreya,
  vollkorn:   FONT_STACKS.vollkorn,
  geologica:  FONT_STACKS.geologica,
  josefin:    FONT_STACKS.josefin,
  onest:      FONT_STACKS.onest,
  oswald:     FONT_STACKS.oswald,
  plexSans:   FONT_STACKS.plexSans,
  plexMono:   FONT_STACKS.plexMono,
  bigShoulders: FONT_STACKS.bigShoulders,
  playfair:   FONT_STACKS.playfair,
  youngSerif: FONT_STACKS.youngSerif,
  montserrat: FONT_STACKS.montserrat,
  cormorantSC: FONT_STACKS.cormorantSC,
  ebGaramond: FONT_STACKS.ebGaramond,
  imperial:   FONT_STACKS.imperial,
  libreBodoni: FONT_STACKS.libreBodoni,
  literata:   FONT_STACKS.literata,
  libreCaslon: FONT_STACKS.libreCaslon,
  raleway:    FONT_STACKS.raleway,
  /* Uşaq ad günü konsepti (2026-10) */
  cormorantUnicase: FONT_STACKS.cormorantUnicase,
  bonaNova:   FONT_STACKS.bonaNova,
  tektur:     FONT_STACKS.tektur,
  exo2:       FONT_STACKS.exo2,
  oi:         FONT_STACKS.oi,
  podkova:    FONT_STACKS.podkova,
  shantell:   FONT_STACKS.shantell,
  andika:     FONT_STACKS.andika,
  mplusRounded: FONT_STACKS.mplusRounded,
  pacifico:   FONT_STACKS.pacifico,
  /* Konseptlər II (2026-10) */
  lora: FONT_STACKS.lora,
  alegreyaSans: FONT_STACKS.alegreyaSans,
  badScript: FONT_STACKS.badScript,
  playfairSC: FONT_STACKS.playfairSC,
  merriweather: FONT_STACKS.merriweather,
  spectralSC: FONT_STACKS.spectralSC,
  balsamiq: FONT_STACKS.balsamiq,
  nunitoSans: FONT_STACKS.nunitoSans,
  montserratAlt: FONT_STACKS.montserratAlt,
  nunito: FONT_STACKS.nunito,
  cormorantInfant: FONT_STACKS.cormorantInfant,
  caveat: FONT_STACKS.caveat,
  comfortaa: FONT_STACKS.comfortaa,
  playpen: FONT_STACKS.playpen,
  oldStandard: FONT_STACKS.oldStandard,
  ysabeauInfant: FONT_STACKS.ysabeauInfant,
  interTightBold: FONT_STACKS.interTightBold,
  jura: FONT_STACKS.jura,
  lobster: FONT_STACKS.lobster,
  vollkornSC: FONT_STACKS.vollkornSC,
  brygada: FONT_STACKS.brygada,
  piazzolla: FONT_STACKS.piazzolla,
  didact: FONT_STACKS.didact,
  marmelad: FONT_STACKS.marmelad,
  pangolin: FONT_STACKS.pangolin,
  bellotaText: FONT_STACKS.bellotaText,
  greatVibes: FONT_STACKS.greatVibes,
  alegreyaSC: FONT_STACKS.alegreyaSC,
  firaXC: FONT_STACKS.firaXC,
  firaC: FONT_STACKS.firaC,
  comforterBrush: FONT_STACKS.comforterBrush,
  robotoSerif: FONT_STACKS.robotoSerif,
  notoSans: FONT_STACKS.notoSans,
  comforter: FONT_STACKS.comforter,
  amatic: FONT_STACKS.amatic,
  ysabeauOffice: FONT_STACKS.ysabeauOffice,
  ysabeau: FONT_STACKS.ysabeau,
  martianMono: FONT_STACKS.martianMono,
  bonaNovaSC: FONT_STACKS.bonaNovaSC,
  robotoCondensed: FONT_STACKS.robotoCondensed,
  ibmPlexMono: FONT_STACKS.ibmPlexMono,
  alumniSans: FONT_STACKS.alumniSans,
  notoSansDisplay: FONT_STACKS.notoSansDisplay,
  ibmPlexSerif: FONT_STACKS.ibmPlexSerif,
  ibmPlexSans: FONT_STACKS.ibmPlexSans,
  robotoSlab: FONT_STACKS.robotoSlab,
  bellota: FONT_STACKS.bellota,
  cormorantFull: FONT_STACKS.cormorantFull,
}
export const STORY_FONTS = F

export const OCT = 'polygon(14% 0,86% 0,100% 14%,100% 86%,86% 100%,14% 100%,0 86%,0 14%)'

/* Struktur defaultları — şablon yalnız fərqli olanı yazır */
const BASE = {
  labels: 'roman', kpre: false, tilt: false, dash: '3 6', textItalic: true,
  titleSize: 44, titleItalic: false, titleUpper: false, bigSize: 40,
  capItalic: true, script: false, record: false,
}

const T = {
  'royal-gold':      { bg: 'radial-gradient(120% 60% at 50% 0%,#1C1509,#0B0906 72%)', surf: '#16110A', ink: '#F3EADA', mute: '#C6B59C', hi: '#C5A059', line: '#C5A059', paper: '#F3EADA', paperInk: '#5C4A3A', head: F.notoDisplay, body: F.hanken, cap: F.vibes, script: true, titleFont: F.vibes, titleSize: 56, frame: 'mat', hero: 'arch', tilt: false },
  'simple-luxury':   { bg: 'linear-gradient(170deg,#FDFAF4,#F2EAD6)', surf: '#FFFFFF', ink: '#1A1A1A', mute: '#5C4A3A', hi: '#8A6A2E', line: '#C5A059', paper: '#FFFFFF', paperInk: '#5C4A3A', head: F.cormorant, body: F.inter, cap: F.vibes, script: true, titleFont: F.vibes, titleSize: 56, frame: 'polaroid', hero: 'arch', tilt: true },
  'floral-garden':   { bg: 'linear-gradient(170deg,#F4F6EF,#E8EEE4)', surf: '#FFFFFF', ink: '#213229', mute: '#5D6B61', hi: '#5E7C6B', line: '#C9768A', paper: '#FFFFFF', paperInk: '#5D6B61', head: F.fgSerif, body: F.mulish, cap: F.vibes, script: true, titleFont: F.vibes, titleSize: 54, frame: 'polaroid', hero: 'oval', tilt: true },
  'modern-black':    { bg: '#000000', surf: '#0D0D0D', ink: '#FFFFFF', mute: '#A3A3A3', hi: '#FFFFFF', line: '#FFFFFF', paper: '#FFFFFF', paperInk: '#0A0A0A', head: F.interTight, body: F.interTight, cap: F.interTight, capItalic: false, titleFont: F.unbounded, titleUpper: true, titleSize: 36, frame: 'minimal', hero: 'rect', labels: 'num2', dash: '0', textItalic: false },
  'white-elegance':  { bg: '#F6F4F0', surf: '#FBFAF7', ink: '#2B2723', mute: '#7A7166', hi: '#5A534B', line: '#8B8175', paper: '#FFFFFF', paperInk: '#7A7166', head: F.spectral, body: F.spectral, cap: F.spectral, titleFont: F.spectral, titleItalic: true, titleSize: 42, frame: 'mat', hero: 'arch', dash: '1 5' },
  'night-sky':       { bg: 'radial-gradient(130% 70% at 50% 110%,#1B2340,#070B18 70%)', surf: '#0F1526', ink: '#E4E9F5', mute: '#A2A8BC', hi: '#F2D9A6', line: '#C8CEE0', head: F.sourceSerif, body: F.commissioner, cap: F.sourceSerif, titleFont: F.sourceSerif, titleItalic: true, titleSize: 44, frame: 'glow', hero: 'circle', dash: '1 7', labels: 'star' },
  'oriental-luxe':   { bg: 'radial-gradient(140% 70% at 50% 0%,#5C1424,#4A0F1C 45%,#2E0710)', surf: '#3E0C17', ink: '#F3E4C4', mute: '#CDA88E', hi: '#D9B36C', line: '#D9B36C', paper: '#F3E4C4', paperInk: '#4A0F1C', head: F.reemKufi, body: F.alegreya, cap: F.alegreya, titleFont: F.reemKufi, titleSize: 36, frame: 'heraldic', hero: 'arch' },
  'nature-touch':    { bg: '#E8E2D3', surf: '#F6F2E7', ink: '#2F3A2C', mute: '#5C6B4C', hi: '#9A5530', line: '#5C6B4C', paper: '#F6F2E7', paperInk: '#3E4A3A', head: F.vollkorn, body: F.geologica, cap: F.vollkorn, titleFont: F.vollkorn, titleItalic: true, titleSize: 40, frame: 'polaroid', hero: 'arch', tilt: true },
  'crystal-glass':   { bg: 'linear-gradient(180deg,#F7F9FB,#EEF2F6 40%,#E9EEF2)', surf: 'rgba(255,255,255,0.6)', ink: '#23303B', mute: '#5A6772', hi: '#23303B', line: '#AEB9C3', head: F.josefin, body: F.onest, cap: F.josefin, capItalic: false, titleFont: F.josefin, titleSize: 40, frame: 'glass', hero: 'rounded', dash: '2 6', textItalic: false },
  'boarding-pass':   { bg: 'linear-gradient(180deg,#0E1B2E,#08111E)', surf: '#14243B', ink: '#F4EFE4', mute: '#9AA6B6', hi: '#D2A262', line: '#9AA6B6', paper: '#F4EFE4', paperInk: '#14243B', head: F.oswald, body: F.plexSans, cap: F.plexMono, capItalic: false, titleFont: F.oswald, titleSize: 40, titleUpper: true, frame: 'ticket', hero: 'rect', labels: 'num2', kpre: true, textItalic: false, dash: '6 6', bigSize: 32 },
  'cinema-premiere': { bg: 'radial-gradient(120% 50% at 50% 0%,#2A0A0F,#0B0A0C 60%)', surf: '#141215', ink: '#F2EBDD', mute: '#A9A39A', hi: '#D9A441', line: '#D9A441', head: F.playfair, body: F.playfair, cap: F.playfair, titleFont: F.bigShoulders, titleSize: 58, titleUpper: true, frame: 'film', hero: 'letterbox', labels: 'num2', kpre: true, dash: '0' },
  'vinyl-record':    { bg: 'radial-gradient(120% 50% at 50% 0%,#2A2420,#151312 60%)', surf: '#1E1B19', ink: '#F1E8D6', mute: '#B3A894', hi: '#D2642F', line: '#E2A93B', head: F.youngSerif, body: F.montserrat, cap: F.montserrat, capItalic: false, titleFont: F.youngSerif, titleSize: 40, frame: 'sleeve', hero: 'disc', record: true, labels: 'vinyl', kpre: true, textItalic: false, bigSize: 32 },
  'royal-palace':    { bg: 'linear-gradient(180deg,#141B3A,#0C1128)', surf: '#141B3A', ink: '#F3ECDD', mute: '#AAB0CC', hi: '#F0DCA0', line: '#D6B76E', paper: '#EFE3C8', paperInk: '#2A2340', head: F.cormorantSC, body: F.ebGaramond, cap: F.imperial, script: true, titleFont: F.cormorantSC, titleSize: 36, frame: 'heraldic', hero: 'arch' },
  'mediterranean':   { bg: '#FBF8F1', surf: '#F1E7D3', ink: '#1E3348', mute: '#5A6B7A', hi: '#1F5FA6', line: '#D7774E', paper: '#FFFFFF', paperInk: '#5A6B7A', head: F.libreBodoni, body: F.literata, cap: F.libreBodoni, titleFont: F.libreBodoni, titleItalic: true, titleSize: 44, frame: 'mat', hero: 'arch' },
  'gazette':         { bg: '#F3EEE2', surf: '#FBF9F3', ink: '#1A1917', mute: '#55514A', hi: '#B3261E', line: '#1A1917', paper: '#FBF9F3', paperInk: '#55514A', head: F.playfair, body: F.sourceSerif, cap: F.sourceSerif, titleFont: F.playfair, titleSize: 36, frame: 'clipping', hero: 'rect', labels: 'num', kpre: true, dash: '0', textItalic: false, bigSize: 32 },
  'fairy-tale':      { bg: 'linear-gradient(180deg,#FBF5EA,#F3E7D1)', surf: '#FFFFFF', ink: '#2D2A4A', mute: '#625C7C', hi: '#5E4A9C', line: '#C8A15A', paper: '#FFFFFF', paperInk: '#625C7C', head: F.bonaNova, body: F.bonaNova, cap: F.bonaNova, titleFont: F.cormorantUnicase, titleSize: 40, frame: 'mat', hero: 'arch' },
  'space-mission':   { bg: 'radial-gradient(130% 70% at 50% 0%,#2A2466,#141A3C 60%)', surf: '#1C2350', ink: '#F5F3FF', mute: '#AEB4D8', hi: '#FFC94D', line: '#5FE0B7', head: F.unbounded, body: F.exo2, cap: F.exo2, capItalic: false, titleFont: F.unbounded, titleUpper: false, titleSize: 30, frame: 'glow', hero: 'circle', labels: 'num2', kpre: true, textItalic: false, dash: '2 7' },
  'circus-show':     { bg: '#F7ECD6', surf: '#FFF8EA', ink: '#2A1E1A', mute: '#6A5546', hi: '#C62537', line: '#1E2A57', paper: '#FFFFFF', paperInk: '#6A5546', head: F.podkova, body: F.podkova, cap: F.podkova, capItalic: false, titleFont: F.oi, titleSize: 34, frame: 'polaroid', hero: 'rect', labels: 'num', kpre: true, dash: '0', textItalic: false, tilt: true },
  'dino-adventure':  { bg: '#F5EBD3', surf: '#FBF4E2', ink: '#2B2A20', mute: '#615C47', hi: '#3E7A3A', line: '#E4683A', paper: '#FFFFFF', paperInk: '#615C47', head: F.shantell, body: F.andika, cap: F.shantell, capItalic: false, titleFont: F.shantell, titleSize: 38, frame: 'polaroid', hero: 'arch', tilt: true, labels: 'num', textItalic: false },
  'balloon-party':   { bg: 'linear-gradient(170deg,#FFF8F3,#FBEAF0)', surf: '#FFFFFF', ink: '#4A3046', mute: '#7D6479', hi: '#C9577C', line: '#EF8FA8', paper: '#FFFFFF', paperInk: '#7D6479', head: F.mplusRounded, body: F.mplusRounded, cap: F.pacifico, capItalic: false, titleFont: F.pacifico, titleSize: 42, frame: 'polaroid', hero: 'circle', tilt: true, labels: 'num', textItalic: false },
  'luxury-jewelry':  { bg: 'radial-gradient(120% 50% at 50% 0%,#143A31,#07110E 60%)', surf: '#0E2A23', ink: '#F4F1EA', mute: '#9DB5AE', hi: '#A3D6C7', line: '#D9DEE0', head: F.libreCaslon, body: F.raleway, cap: F.libreCaslon, titleFont: F.libreCaslon, titleSize: 42, frame: 'gem', hero: 'octagon' },
  /* 2026-10 — «Xına gecəsi» konsepti */
  'red-veil': { bg: 'linear-gradient(180deg,#F8EEE2,#EFE0CD)', surf: '#FFFDF9', ink: '#2A1014', mute: '#76524C', hi: '#8E1B2B', line: '#D4A64A', paper: '#FFFFFF', paperInk: '#76524C', head: F.cormorant, body: F.lora, cap: F.vibes, script: true, titleFont: F.vibes, titleSize: 54, frame: 'mat', hero: 'arch' },
  'xonca': { bg: 'linear-gradient(180deg,#341C11,#22120B)', surf: '#2C170E', ink: '#FFF1D6', mute: '#D9C1A0', hi: '#E3A06C', line: '#D9A54A', head: F.alegreya, body: F.alegreyaSans, cap: F.alegreya, titleFont: F.alegreya, titleItalic: true, titleSize: 42, frame: 'glow', hero: 'circle' },
  'henna-buta': { bg: 'linear-gradient(180deg,#FBF3E8,#F3E3CF)', surf: '#FFFCF7', ink: '#3A1E12', mute: '#7B5A48', hi: '#8A3A18', line: '#B5552B', paper: '#FFFFFF', paperInk: '#7B5A48', head: F.spectral, body: F.commissioner, cap: F.badScript, capItalic: false, titleFont: F.spectral, titleItalic: true, titleSize: 42, frame: 'polaroid', hero: 'oval', tilt: true },
  'mirror-candle': { bg: 'linear-gradient(180deg,#211A15,#14100D)', surf: '#1B1511', ink: '#F4ECDD', mute: '#B8AA94', hi: '#F6DFA0', line: '#E0B864', head: F.notoDisplay, body: F.ebGaramond, cap: F.notoDisplay, titleFont: F.notoDisplay, titleItalic: true, titleSize: 40, frame: 'glow', hero: 'oval' },
  'kelagayi': { bg: 'linear-gradient(180deg,#F7EED9,#F1E2C4)', surf: '#FFFCF4', ink: '#1E1A17', mute: '#6E5F4E', hi: '#9E1F32', line: '#24305E', paper: '#FFFCF4', paperInk: '#6E5F4E', head: F.playfairSC, body: F.merriweather, cap: F.merriweather, titleFont: F.playfairSC, titleSize: 34, frame: 'mat', hero: 'rect', labels: 'num2', textItalic: false },
  /* 2026-10 — «Sünnət toyu» konsepti */
  'little-prince': { bg: 'linear-gradient(180deg,#F8F2E4,#EFE5CF)', surf: '#FFFDF7', ink: '#16203D', mute: '#5D6684', hi: '#1C3474', line: '#D8B058', paper: '#FFFFFF', paperInk: '#5D6684', head: F.spectralSC, body: F.mulish, cap: F.spectralSC, capItalic: false, titleFont: F.spectralSC, titleSize: 36, frame: 'heraldic', hero: 'arch', textItalic: false },
  'hero-comic': { bg: '#FFF8E6', surf: '#FFFFFF', ink: '#121212', mute: '#4A4A4A', hi: '#E63946', line: '#121212', paper: '#FFFFFF', paperInk: '#4A4A4A', head: F.unbounded, body: F.balsamiq, cap: F.balsamiq, capItalic: false, titleFont: F.unbounded, titleSize: 30, frame: 'clipping', hero: 'rect', labels: 'num2', kpre: true, textItalic: false, dash: '0' },
  'mashallah': { bg: 'linear-gradient(180deg,#F6F2E8,#EDE6D6)', surf: '#FFFFFF', ink: '#0E1F3D', mute: '#56677F', hi: '#0D3B8E', line: '#27B0C8', paper: '#FFFFFF', paperInk: '#56677F', head: F.literata, body: F.nunitoSans, cap: F.literata, titleFont: F.literata, titleItalic: true, titleSize: 40, frame: 'polaroid', hero: 'circle', tilt: true, textItalic: false },
  'little-pilot': { bg: 'linear-gradient(180deg,#CDEEFC,#FFF9EE)', surf: '#FFFFFF', ink: '#18324F', mute: '#5C6F85', hi: '#E5533D', line: '#3B95D6', paper: '#FFFFFF', paperInk: '#5C6F85', head: F.montserratAlt, body: F.nunito, cap: F.nunito, capItalic: false, titleFont: F.montserratAlt, titleSize: 32, frame: 'polaroid', hero: 'circle', tilt: true, labels: 'num', kpre: true, textItalic: false },
  'football-star': { bg: 'linear-gradient(180deg,#EEF5EC,#DCEBD9)', surf: '#FFFFFF', ink: '#0C1B2C', mute: '#586878', hi: '#145A2B', line: '#0E2A47', paper: '#FFFFFF', paperInk: '#586878', head: F.oswald, body: F.interTight, cap: F.interTight, capItalic: false, titleFont: F.oswald, titleUpper: true, titleSize: 36, frame: 'polaroid', hero: 'circle', labels: 'num2', kpre: true, textItalic: false, dash: '0' },
  /* 2026-10 — «Baby shower» konsepti */
  'pastel-bloom': { bg: 'linear-gradient(180deg,#FCF8F2,#F4EDE2)', surf: '#FFFFFF', ink: '#4E3F45', mute: '#85737A', hi: '#D98E93', line: '#A9C2A2', paper: '#FFFFFF', paperInk: '#85737A', head: F.cormorantInfant, body: F.nunitoSans, cap: F.caveat, capItalic: false, titleFont: F.cormorantInfant, titleSize: 44, frame: 'polaroid', hero: 'oval', tilt: true },
  'teddy-bear': { bg: 'linear-gradient(180deg,#FBF5EC,#F2E8DA)', surf: '#FFFFFF', ink: '#5B4332', mute: '#8F7765', hi: '#8E6440', line: '#7FAAC8', paper: '#FFFFFF', paperInk: '#8F7765', head: F.comfortaa, body: F.nunito, cap: F.nunito, capItalic: false, titleFont: F.comfortaa, titleSize: 32, frame: 'polaroid', hero: 'circle', tilt: true, labels: 'num', textItalic: false },
  'gender-reveal': { bg: 'linear-gradient(180deg,#FFFBF7,#F4F0FA)', surf: '#FFFFFF', ink: '#33365C', mute: '#6E7091', hi: '#E0659C', line: '#3F8CD8', paper: '#FFFFFF', paperInk: '#6E7091', head: F.playpen, body: F.onest, cap: F.playpen, capItalic: false, titleFont: F.playpen, titleSize: 32, frame: 'polaroid', hero: 'circle', tilt: true, labels: 'num', textItalic: false },
  'stork-letter': { bg: 'linear-gradient(180deg,#F3EBDD,#E6D9C3)', surf: '#FBF6EC', ink: '#3E3A36', mute: '#776C61', hi: '#A9473A', line: '#7C97AE', paper: '#FBF6EC', paperInk: '#776C61', head: F.oldStandard, body: F.vollkorn, cap: F.vibes, script: true, titleFont: F.vibes, titleSize: 50, frame: 'mat', hero: 'rect', tilt: true },
  'baby-mobile': { bg: 'linear-gradient(180deg,#F8F1E6,#EDE4D3)', surf: '#FFFFFF', ink: '#2A2F4A', mute: '#6B6F88', hi: '#2E3A63', line: '#E9B949', paper: '#FFFFFF', paperInk: '#6B6F88', head: F.ysabeauInfant, body: F.mulish, cap: F.ysabeauInfant, titleFont: F.ysabeauInfant, titleSize: 38, frame: 'polaroid', hero: 'circle', tilt: true, textItalic: false },
  /* 2026-10 — «Korporativ» konsepti */
  'gala-night': { bg: 'linear-gradient(180deg,#151311,#0B0A09)', surf: '#1E1B18', ink: '#F5EFE3', mute: '#A99F8E', hi: '#F1DCA4', line: '#D4AF61', head: F.playfair, body: F.montserrat, cap: F.playfair, titleFont: F.playfair, titleItalic: true, titleSize: 40, frame: 'glow', hero: 'rect', labels: 'num2', kpre: true },
  'keynote': { bg: 'linear-gradient(180deg,#0C1324,#060A14)', surf: '#111A30', ink: '#F3F6FC', mute: '#8A97B4', hi: '#22D3EE', line: '#3D7BFF', head: F.geologica, body: F.onest, cap: F.mono, capItalic: false, titleFont: F.geologica, titleSize: 34, frame: 'glass', hero: 'rounded', labels: 'num2', kpre: true, textItalic: false, dash: '2 6' },
  'award-night': { bg: 'linear-gradient(180deg,#4E0D1A,#2A060E)', surf: '#3A0912', ink: '#F7EEDC', mute: '#CDB1A8', hi: '#F6DD95', line: '#E1B54E', head: F.cormorantSC, body: F.raleway, cap: F.cormorantSC, titleFont: F.cormorantSC, titleSize: 36, frame: 'heraldic', hero: 'arch', labels: 'roman' },
  'business-card': { bg: '#F4F3EF', surf: '#FFFFFF', ink: '#121212', mute: '#76756F', hi: '#2438E8', line: '#121212', paper: '#FFFFFF', paperInk: '#76756F', head: F.interTightBold, body: F.interTight, cap: F.mono, capItalic: false, titleFont: F.interTightBold, titleSize: 36, frame: 'minimal', hero: 'rect', labels: 'num2', dash: '0', textItalic: false },
  'neon-party': { bg: 'linear-gradient(180deg,#1B1428,#0D0A15)', surf: '#1B1428', ink: '#F6F0FF', mute: '#A99CC4', hi: '#FF4FD8', line: '#3CF2FF', head: F.jura, body: F.jura, cap: F.lobster, capItalic: false, titleFont: F.lobster, titleSize: 44, frame: 'glow', hero: 'circle', textItalic: false },
  /* 2026-10 — «İldönümü» konsepti */
  'silver-locket': { bg: 'linear-gradient(180deg,#1E2531,#141923)', surf: '#1E2531', ink: '#F4F1EC', mute: '#A9B0BA', hi: '#D9A3A6', line: '#C9CED6', head: F.cormorant, body: F.mulish, cap: F.cormorant, titleFont: F.cormorant, titleItalic: true, titleSize: 42, frame: 'glow', hero: 'oval', textItalic: false },
  'golden-jubilee': { bg: 'linear-gradient(180deg,#5A1E1B,#33100E)', surf: '#4A1816', ink: '#F6EAD0', mute: '#CDB79A', hi: '#F3DE9C', line: '#D4AF5A', head: F.brygada, body: F.brygada, cap: F.brygada, titleFont: F.vollkornSC, titleSize: 34, frame: 'mat', hero: 'rect', labels: 'roman' },
  'first-paper': { bg: '#F8F6F1', surf: '#FFFFFF', ink: '#232B4A', mute: '#737A8A', hi: '#3561C9', line: '#A9C0EE', paper: '#FFFFFF', paperInk: '#737A8A', head: F.piazzolla, body: F.didact, cap: F.piazzolla, titleFont: F.piazzolla, titleItalic: true, titleSize: 40, frame: 'clipping', hero: 'rect', labels: 'num', textItalic: false },
  'retro-polaroid': { bg: '#F4EAD5', surf: '#FFFDF8', ink: '#3B2418', mute: '#8A6E58', hi: '#E07A2E', line: '#E2B33C', paper: '#FFFDF8', paperInk: '#8A6E58', head: F.marmelad, body: F.bellotaText, cap: F.pangolin, capItalic: false, titleFont: F.marmelad, titleSize: 40, frame: 'polaroid', hero: 'rect', labels: 'num', tilt: true, textItalic: false },
  'love-letters': { bg: '#EFE6D8', surf: '#FBF6EC', ink: '#2F3550', mute: '#7D7468', hi: '#9C4A4A', line: '#C98B8B', paper: '#FBF6EC', paperInk: '#7D7468', head: F.ebGaramond, body: F.ebGaramond, cap: F.ebGaramond, titleFont: F.greatVibes, titleSize: 54, frame: 'mat', hero: 'oval', labels: 'roman' },
  /* 2026-10 — «Məzuniyyət» konsepti */
  'caps-toss': { bg: 'linear-gradient(180deg,#1F3160,#14213D)', surf: '#1F3160', ink: '#F7F4EC', mute: '#AEB6CC', hi: '#F6DC92', line: '#E5B94E', head: F.sourceSerif, body: F.sourceSerif, cap: F.alegreyaSC, capItalic: false, titleFont: F.alegreyaSC, titleSize: 36, frame: 'mat', hero: 'arch', labels: 'num' },
  'yearbook': { bg: '#FFFFFF', surf: '#F7F8FB', ink: '#14182B', mute: '#69708A', hi: '#1F4FD1', line: '#FFC629', paper: '#FFFFFF', paperInk: '#69708A', head: F.firaXC, body: F.firaC, cap: F.comforterBrush, capItalic: false, titleFont: F.firaXC, titleUpper: true, titleSize: 44, frame: 'polaroid', hero: 'rect', labels: 'num2', tilt: true, textItalic: false },
  'last-bell': { bg: '#FFFFFF', surf: '#F5F6F9', ink: '#1C2A4A', mute: '#6A7387', hi: '#C8102E', line: '#E2BD6A', paper: '#FFFFFF', paperInk: '#6A7387', head: F.robotoSerif, body: F.notoSans, cap: F.comforter, capItalic: false, titleFont: F.robotoSerif, titleSize: 36, frame: 'clipping', hero: 'rounded', labels: 'num', textItalic: false },
  'chalkboard': { bg: 'linear-gradient(180deg,#2A4B42,#22403A)', surf: '#1A322C', ink: '#F3F0E6', mute: 'rgba(243,240,230,.65)', hi: '#F5DE7A', line: '#F3A9B9', head: F.ysabeauOffice, body: F.ysabeauOffice, cap: F.amatic, capItalic: false, titleFont: F.amatic, titleSize: 56, frame: 'minimal', hero: 'rect', labels: 'num', dash: '6 4', textItalic: false },
  'paper-plane': { bg: 'linear-gradient(180deg,#CFE8F8,#FFFFFF)', surf: '#FFFFFF', ink: '#1B2D4F', mute: '#5E7290', hi: '#2F6FDB', line: '#E0483E', paper: '#FFFFFF', paperInk: '#5E7290', head: F.ysabeau, body: F.ysabeauOffice, cap: F.martianMono, capItalic: false, titleFont: F.ysabeau, titleSize: 38, frame: 'ticket', hero: 'rounded', labels: 'num2', textItalic: false },
  /* 2026-10 — «Açılış və təqdimat» konsepti */
  'ribbon-cut': { bg: 'linear-gradient(180deg,#175443,#0F3D30)', surf: '#0B3127', ink: '#F7F2E6', mute: '#B9C6BE', hi: '#F5DE9C', line: '#D8B25A', head: F.robotoCondensed, body: F.robotoCondensed, cap: F.bonaNovaSC, capItalic: false, titleFont: F.bonaNovaSC, titleSize: 36, frame: 'mat', hero: 'arch', labels: 'roman', textItalic: false },
  'bistro-sign': { bg: '#F4ECDC', surf: '#FBF6EC', ink: '#1F2A24', mute: '#7A786C', hi: '#7A1F2B', line: '#C9A04A', paper: '#FBF6EC', paperInk: '#7A786C', head: F.playfair, body: F.notoSans, cap: F.playfair, capItalic: true, titleFont: F.playfair, titleItalic: true, titleSize: 40, frame: 'mat', hero: 'arch', labels: 'num', textItalic: false },
  'roller-shutter': { bg: 'linear-gradient(180deg,#2A2E33,#1D2023)', surf: '#141618', ink: '#F7F8F9', mute: '#A7AFB7', hi: '#FFD23F', line: '#FFD23F', head: F.robotoCondensed, body: F.robotoCondensed, cap: F.ibmPlexMono, capItalic: false, titleFont: F.alumniSans, titleUpper: true, titleSize: 52, frame: 'minimal', hero: 'rect', labels: 'num2', dash: '0', textItalic: false },
  'unboxing': { bg: 'linear-gradient(180deg,#17163A,#101024)', surf: '#1B1A3A', ink: '#F4F3FA', mute: '#A9AAC4', hi: '#B9A8FF', line: '#7C5CFF', head: F.notoSansDisplay, body: F.notoSansDisplay, cap: F.notoSansDisplay, capItalic: false, titleFont: F.notoSansDisplay, titleSize: 38, frame: 'glass', hero: 'rounded', labels: 'num2', textItalic: false },
  'gallery-unveil': { bg: '#EEEDEA', surf: '#FFFFFF', ink: '#171717', mute: '#77746E', hi: '#5A1F3A', line: '#C8A55A', paper: '#FFFFFF', paperInk: '#77746E', head: F.ibmPlexSerif, body: F.ibmPlexSans, cap: F.ibmPlexSans, capItalic: false, titleFont: F.ibmPlexSerif, titleSize: 38, frame: 'mat', hero: 'rect', labels: 'num', textItalic: true },
  /* 2026-10 — «Bayram gecələri» konsepti */
  'novruz-bonfire': { bg: 'linear-gradient(180deg,#1A1230,#241838)', surf: '#2A1E4A', ink: '#FBF3E4', mute: '#C9B8A6', hi: '#FFC23D', line: '#FF7A1A', head: F.notoSans, body: F.notoSans, cap: F.robotoSlab, capItalic: false, titleFont: F.robotoSlab, titleSize: 36, frame: 'glow', hero: 'arch', labels: 'num', textItalic: false },
  'novruz-semeni': { bg: '#FFF8EA', surf: '#FFFFFF', ink: '#24331C', mute: '#6F7A62', hi: '#D7263D', line: '#8CCB4A', paper: '#FFFFFF', paperInk: '#6F7A62', head: F.bellota, body: F.bellotaText, cap: F.bellota, capItalic: false, titleFont: F.bellota, titleSize: 40, frame: 'polaroid', hero: 'oval', labels: 'num', textItalic: false },
  'midnight-clock': { bg: 'linear-gradient(180deg,#1A2350,#0E1430)', surf: '#1A2350', ink: '#F6E7C1', mute: '#B9BCCB', hi: '#F8E6B0', line: '#E8C46A', head: F.ysabeauOffice, body: F.ysabeauOffice, cap: F.cormorantFull, capItalic: true, titleFont: F.cormorantFull, titleSize: 42, frame: 'glow', hero: 'circle', labels: 'roman' },
  'snow-globe': { bg: 'linear-gradient(180deg,#2C4F7C,#1E3A5F)', surf: '#1E3A5F', ink: '#FFFFFF', mute: '#C4D6EA', hi: '#E2B65C', line: '#DCEBF7', head: F.nunito, body: F.nunito, cap: F.pacifico, capItalic: false, titleFont: F.pacifico, titleSize: 38, frame: 'polaroid', hero: 'circle', labels: 'num', textItalic: false },
  'masquerade-ball': { bg: 'linear-gradient(180deg,#1A0E18,#0D0A10)', surf: '#22091C', ink: '#F5EEE3', mute: '#C2B1BC', hi: '#F4DC9C', line: '#D9B25F', head: F.cormorant, body: F.cormorant, cap: F.playfairSC, capItalic: false, titleFont: F.playfairSC, titleSize: 34, frame: 'heraldic', hero: 'oval', labels: 'roman' },
}

/* ── Mətnlər (AZ/EN/RU) ── dizayndakı şablon adlandırmaları */
const COPY_BASE = {
  kicker:  { az: 'Hekayə', en: 'Story', ru: 'История' },
  title:   { az: 'Bizim Hekayəmiz', en: 'Our Story', ru: 'Наша история' },
  sub:     { az: 'Tanışlıqdan bu günə qədər yolumuz', en: 'Our journey from the day we met to today', ru: 'Наш путь от знакомства до сегодняшнего дня' },
  end:     { az: '…və hekayəmiz davam edir', en: '…and our story goes on', ru: '…и наша история продолжается' },
  next:    { az: 'Növbəti fəsil', en: 'Next chapter', ru: 'Следующая глава' },
  endSub:  { az: 'Bu günü sizinlə yazmaq istəyirik.', en: 'We want to write this day with you.', ru: 'Этот день мы хотим написать вместе с вами.' },
  kpre:    { az: '', en: '', ru: '' },
  photo:   { az: 'Foto', en: 'Photo', ru: 'Фото' },
}

const COPY = {
  'modern-black':    { title: { az: 'Bizim hekayəmiz', en: 'Our story', ru: 'Наша история' } },
  'night-sky':       { kicker: { az: 'Ulduz xəritəsi', en: 'Star map', ru: 'Звёздная карта' } },
  'boarding-pass':   {
    kicker: { az: 'Uçuş jurnalı', en: 'Flight log', ru: 'Бортовой журнал' },
    title:  { az: 'Bizim marşrut', en: 'Our route', ru: 'Наш маршрут' },
    end:    { az: 'Son dayanacaq: toy günümüz', en: 'Final stop: our wedding day', ru: 'Конечная остановка: наша свадьба' },
    kpre:   { az: 'Uçuş', en: 'Flight', ru: 'Рейс' },
  },
  'cinema-premiere': {
    kicker: { az: 'Premyera', en: 'Premiere', ru: 'Премьера' },
    title:  { az: 'Bizim Filmimiz', en: 'Our Film', ru: 'Наш фильм' },
    end:    { az: 'Davamı var…', en: 'To be continued…', ru: 'Продолжение следует…' },
    kpre:   { az: 'Səhnə', en: 'Scene', ru: 'Сцена' },
  },
  'vinyl-record':    {
    kicker: { az: 'Side A', en: 'Side A', ru: 'Side A' },
    title:  { az: 'Bizim albomumuz', en: 'Our album', ru: 'Наш альбом' },
    end:    { az: 'Side B — tezliklə', en: 'Side B — coming soon', ru: 'Side B — скоро' },
    kpre:   { az: 'Trek', en: 'Track', ru: 'Трек' },
  },
  'royal-palace':    { title: { az: 'Bizim Tariximiz', en: 'Our Chronicle', ru: 'Наша летопись' } },
  'mediterranean':   { kicker: { az: 'Sahil gündəliyi', en: 'Seaside diary', ru: 'Морской дневник' } },
  'gazette':         {
    kicker: { az: 'Xüsusi buraxılış', en: 'Special edition', ru: 'Специальный выпуск' },
    title:  { az: 'Bir sevgi hekayəsi', en: 'A love story', ru: 'История любви' },
    end:    { az: 'Davamı növbəti buraxılışda', en: 'Continued in the next issue', ru: 'Продолжение в следующем выпуске' },
    kpre:   { az: 'Səh.', en: 'P.', ru: 'Стр.' },
  },
  'luxury-jewelry':  { kicker: { az: 'Kolleksiya', en: 'Collection', ru: 'Коллекция' } },
  /* Uşaq ad günü konsepti — hekayə uşağın öz böyümə hekayəsidir */
  'fairy-tale': {
    kicker: { az: 'Nağıl', en: 'A tale', ru: 'Сказка' },
    title:  { az: 'Mənim nağılım', en: 'My fairy tale', ru: 'Моя сказка' },
    sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
    end:    { az: '…və nağıl davam edir', en: '…and the tale goes on', ru: '…и сказка продолжается' },
    endSub: { az: 'Bu fəsli sizinlə yazmaq istəyirik.', en: 'We want to write this chapter with you.', ru: 'Эту главу мы хотим написать вместе с вами.' },
  },
  'space-mission': {
    kicker: { az: 'Bort jurnalı', en: 'Ship’s log', ru: 'Бортовой журнал' },
    title:  { az: 'Mənim orbitim', en: 'My orbit', ru: 'Моя орбита' },
    sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
    end:    { az: 'Növbəti missiya: bu ad günü', en: 'Next mission: this birthday', ru: 'Следующая миссия: этот день рождения' },
    endSub: { az: 'Ekipajımızda sizi də görmək istəyirik.', en: 'We want you on our crew.', ru: 'Ждём вас в нашем экипаже.' },
    kpre:   { az: 'Missiya', en: 'Mission', ru: 'Миссия' },
  },
  'circus-show': {
    kicker: { az: 'Böyük şou', en: 'The big show', ru: 'Большое шоу' },
    title:  { az: 'Mənim şoum', en: 'My show', ru: 'Моё шоу' },
    sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
    end:    { az: 'Ən böyük nömrə hələ qabaqdadır', en: 'The best act is yet to come', ru: 'Лучший номер ещё впереди' },
    endSub: { az: 'Alqışlarınızı gözləyirik.', en: 'We are waiting for your applause.', ru: 'Ждём ваших аплодисментов.' },
    kpre:   { az: 'Nömrə', en: 'Act', ru: 'Номер' },
  },
  'dino-adventure': {
    kicker: { az: 'Ekspedisiya gündəliyi', en: 'Expedition journal', ru: 'Дневник экспедиции' },
    title:  { az: 'Mənim izlərim', en: 'My footprints', ru: 'Мои следы' },
    sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
    end:    { az: 'Yeni kəşflər qabaqdadır', en: 'New discoveries ahead', ru: 'Впереди новые открытия' },
    endSub: { az: 'Növbəti kəşfə bizimlə gəlin.', en: 'Join us for the next discovery.', ru: 'Присоединяйтесь к следующему открытию.' },
    kpre:   { az: 'Tapıntı', en: 'Find', ru: 'Находка' },
  },
  'balloon-party': {
    kicker: { az: 'Albom', en: 'Album', ru: 'Альбом' },
    title:  { az: 'Mənim albomum', en: 'My album', ru: 'Мой альбом' },
    sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
    end:    { az: '…və bayram davam edir', en: '…and the party goes on', ru: '…и праздник продолжается' },
    endSub: { az: 'Bu səhifəni sizinlə doldurmaq istəyirik.', en: 'We want to fill this page with you.', ru: 'Эту страницу мы хотим заполнить вместе с вами.' },
  },
  /* 2026-10 — «Sünnət toyu» konsepti */
  'little-prince': {
    kicker: { az: 'Saray salnaməsi', en: 'Royal chronicle', ru: 'Королевская летопись' },
    title:  { az: 'Mənim hekayəm', en: 'My story', ru: 'Моя история' },
    sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
    end:    { az: '…və hekayə davam edir', en: '…and the story goes on', ru: '…и история продолжается' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this day with you.', ru: 'Мы хотим отпраздновать этот день вместе с вами.' },
  },
  'hero-comic': {
    kicker: { az: 'Komiks', en: 'Comic', ru: 'Комикс' },
    title:  { az: 'Qəhrəmanın hekayəsi', en: 'The hero’s story', ru: 'История героя' },
    sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
    end:    { az: 'Davamı növbəti sayda…', en: 'To be continued in the next issue…', ru: 'Продолжение в следующем выпуске…' },
    endSub: { az: 'Bu səhifəni sizinlə birlikdə yazacağıq.', en: 'We will write this page together with you.', ru: 'Эту страницу мы напишем вместе с вами.' },
    kpre:   { az: 'Səh.', en: 'P.', ru: 'Стр.' },
  },
  'mashallah': {
    kicker: { az: 'Albom', en: 'Album', ru: 'Альбом' },
    title:  { az: 'Mənim hekayəm', en: 'My story', ru: 'Моя история' },
    sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
    end:    { az: '…və hekayə davam edir', en: '…and the story goes on', ru: '…и история продолжается' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this day with you.', ru: 'Мы хотим отпраздновать этот день вместе с вами.' },
  },
  'little-pilot': {
    kicker: { az: 'Pilot gündəliyi', en: 'Pilot’s diary', ru: 'Дневник пилота' },
    title:  { az: 'Mənim uçuşum', en: 'My flight', ru: 'Мой полёт' },
    sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
    end:    { az: 'Növbəti uçuş: bu bayram', en: 'Next flight: this celebration', ru: 'Следующий рейс: этот праздник' },
    endSub: { az: 'Bortda sizi də görmək istəyirik.', en: 'We want you on board.', ru: 'Ждём вас на борту.' },
    kpre:   { az: 'Uçuş', en: 'Flight', ru: 'Полёт' },
  },
  'football-star': {
    kicker: { az: 'Karyera', en: 'Career', ru: 'Карьера' },
    title:  { az: 'Ulduzun yolu', en: 'The star’s path', ru: 'Путь звезды' },
    sub:    { az: 'Doğulduğum gündən bu günə qədər', en: 'From the day I was born until today', ru: 'С самого первого дня и до сегодня' },
    end:    { az: 'Ən böyük qol hələ qabaqdadır', en: 'The best goal is yet to come', ru: 'Лучший гол ещё впереди' },
    endSub: { az: 'Bu matçda sizi tribunada görmək istəyirik.', en: 'We want to see you in the stands.', ru: 'Ждём вас на трибунах.' },
    kpre:   { az: 'Mövsüm', en: 'Season', ru: 'Сезон' },
  },
  /* 2026-10 — «Baby shower» konsepti */
  'pastel-bloom': {
    end:    { az: '…və tezliklə üç nəfər olacağıq', en: '…and soon we will be three', ru: '…и скоро нас будет трое' },
    endSub: { az: 'Bu sevinci sizinlə bölüşmək istəyirik.', en: 'We want to share this joy with you.', ru: 'Мы хотим разделить эту радость с вами.' },
  },
  'teddy-bear': {
    end:    { az: '…və tezliklə üç nəfər olacağıq', en: '…and soon we will be three', ru: '…и скоро нас будет трое' },
    endSub: { az: 'Bu sevinci sizinlə bölüşmək istəyirik.', en: 'We want to share this joy with you.', ru: 'Мы хотим разделить эту радость с вами.' },
  },
  'gender-reveal': {
    end:    { az: '…və tezliklə üç nəfər olacağıq', en: '…and soon we will be three', ru: '…и скоро нас будет трое' },
    endSub: { az: 'Sirri sizinlə birlikdə açmaq istəyirik.', en: 'We want to reveal the secret together with you.', ru: 'Мы хотим раскрыть секрет вместе с вами.' },
  },
  'stork-letter': {
    end:    { az: '…və leylək artıq yoldadır', en: '…and the stork is already on its way', ru: '…и аист уже в пути' },
    endSub: { az: 'Bu sevinci sizinlə bölüşmək istəyirik.', en: 'We want to share this joy with you.', ru: 'Мы хотим разделить эту радость с вами.' },
  },
  'baby-mobile': {
    end:    { az: '…və tezliklə üç nəfər olacağıq', en: '…and soon we will be three', ru: '…и скоро нас будет трое' },
    endSub: { az: 'Bu sevinci sizinlə bölüşmək istəyirik.', en: 'We want to share this joy with you.', ru: 'Мы хотим разделить эту радость с вами.' },
  },
  /* 2026-10 — «Korporativ» konsepti */
  'gala-night': {
    kicker: { az: 'Tarixçə', en: 'History', ru: 'История' },
    title:  { az: 'Bizim yolumuz', en: 'Our journey', ru: 'Наш путь' },
    sub:    { az: 'İlk gündən bu günə qədər', en: 'From day one to today', ru: 'С первого дня до сегодня' },
    end:    { az: '…və yeni zirvələr qabaqdadır', en: '…and new heights lie ahead', ru: '…и впереди новые вершины' },
    endSub: { az: 'Bu uğuru sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this success with you.', ru: 'Мы хотим отметить этот успех вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'keynote': {
    kicker: { az: 'Tarixçə', en: 'History', ru: 'История' },
    title:  { az: 'Bizim yolumuz', en: 'Our journey', ru: 'Наш путь' },
    sub:    { az: 'İlk gündən bu günə qədər', en: 'From day one to today', ru: 'С первого дня до сегодня' },
    end:    { az: '…və yeni zirvələr qabaqdadır', en: '…and new heights lie ahead', ru: '…и впереди новые вершины' },
    endSub: { az: 'Bu uğuru sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this success with you.', ru: 'Мы хотим отметить этот успех вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'award-night': {
    kicker: { az: 'Tarixçə', en: 'History', ru: 'История' },
    title:  { az: 'Bizim yolumuz', en: 'Our journey', ru: 'Наш путь' },
    sub:    { az: 'İlk gündən bu günə qədər', en: 'From day one to today', ru: 'С первого дня до сегодня' },
    end:    { az: '…və yeni zirvələr qabaqdadır', en: '…and new heights lie ahead', ru: '…и впереди новые вершины' },
    endSub: { az: 'Bu uğuru sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this success with you.', ru: 'Мы хотим отметить этот успех вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'business-card': {
    kicker: { az: 'Tarixçə', en: 'History', ru: 'История' },
    title:  { az: 'Bizim yolumuz', en: 'Our journey', ru: 'Наш путь' },
    sub:    { az: 'İlk gündən bu günə qədər', en: 'From day one to today', ru: 'С первого дня до сегодня' },
    end:    { az: '…və yeni zirvələr qabaqdadır', en: '…and new heights lie ahead', ru: '…и впереди новые вершины' },
    endSub: { az: 'Bu uğuru sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this success with you.', ru: 'Мы хотим отметить этот успех вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'neon-party': {
    kicker: { az: 'Tarixçə', en: 'History', ru: 'История' },
    title:  { az: 'Bizim yolumuz', en: 'Our journey', ru: 'Наш путь' },
    sub:    { az: 'İlk gündən bu günə qədər', en: 'From day one to today', ru: 'С первого дня до сегодня' },
    end:    { az: '…və yeni zirvələr qabaqdadır', en: '…and new heights lie ahead', ru: '…и впереди новые вершины' },
    endSub: { az: 'Bu uğuru sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this success with you.', ru: 'Мы хотим отметить этот успех вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  /* 2026-10 — «İldönümü» konsepti */
  'silver-locket': {
    kicker: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' },
    title:  { az: 'Bizim illərimiz', en: 'Our years', ru: 'Наши годы' },
    sub:    { az: 'İlk görüşdən bu günə qədər', en: 'From our first meeting to today', ru: 'С первой встречи до сегодняшнего дня' },
    end:    { az: '…və hekayəmiz davam edir', en: '…and our story goes on', ru: '…и наша история продолжается' },
    endSub: { az: 'Bu ildönümünü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this anniversary with you.', ru: 'Мы хотим отметить эту годовщину вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'golden-jubilee': {
    kicker: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' },
    title:  { az: 'Bizim illərimiz', en: 'Our years', ru: 'Наши годы' },
    sub:    { az: 'İlk görüşdən bu günə qədər', en: 'From our first meeting to today', ru: 'С первой встречи до сегодняшнего дня' },
    end:    { az: '…və hekayəmiz davam edir', en: '…and our story goes on', ru: '…и наша история продолжается' },
    endSub: { az: 'Bu ildönümünü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this anniversary with you.', ru: 'Мы хотим отметить эту годовщину вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'first-paper': {
    kicker: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' },
    title:  { az: 'Bizim illərimiz', en: 'Our years', ru: 'Наши годы' },
    sub:    { az: 'İlk görüşdən bu günə qədər', en: 'From our first meeting to today', ru: 'С первой встречи до сегодняшнего дня' },
    end:    { az: '…və hekayəmiz davam edir', en: '…and our story goes on', ru: '…и наша история продолжается' },
    endSub: { az: 'Bu ildönümünü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this anniversary with you.', ru: 'Мы хотим отметить эту годовщину вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'retro-polaroid': {
    kicker: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' },
    title:  { az: 'Bizim illərimiz', en: 'Our years', ru: 'Наши годы' },
    sub:    { az: 'İlk görüşdən bu günə qədər', en: 'From our first meeting to today', ru: 'С первой встречи до сегодняшнего дня' },
    end:    { az: '…və hekayəmiz davam edir', en: '…and our story goes on', ru: '…и наша история продолжается' },
    endSub: { az: 'Bu ildönümünü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this anniversary with you.', ru: 'Мы хотим отметить эту годовщину вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'love-letters': {
    kicker: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' },
    title:  { az: 'Bizim illərimiz', en: 'Our years', ru: 'Наши годы' },
    sub:    { az: 'İlk görüşdən bu günə qədər', en: 'From our first meeting to today', ru: 'С первой встречи до сегодняшнего дня' },
    end:    { az: '…və hekayəmiz davam edir', en: '…and our story goes on', ru: '…и наша история продолжается' },
    endSub: { az: 'Bu ildönümünü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this anniversary with you.', ru: 'Мы хотим отметить эту годовщину вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  /* 2026-10 — «Məzuniyyət» konsepti */
  'caps-toss': {
    kicker: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' },
    title:  { az: 'Məktəb illərim', en: 'My school years', ru: 'Мои школьные годы' },
    sub:    { az: 'Birinci sinifdən bu günə qədər', en: 'From first grade to today', ru: 'С первого класса до сегодняшнего дня' },
    end:    { az: '…və qarşıda yeni yol var', en: '…and a new road lies ahead', ru: '…а впереди новый путь' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirəm.', en: 'I want to celebrate this day with you.', ru: 'Я хочу отметить этот день вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'yearbook': {
    kicker: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' },
    title:  { az: 'Məktəb illərim', en: 'My school years', ru: 'Мои школьные годы' },
    sub:    { az: 'Birinci sinifdən bu günə qədər', en: 'From first grade to today', ru: 'С первого класса до сегодняшнего дня' },
    end:    { az: '…və qarşıda yeni yol var', en: '…and a new road lies ahead', ru: '…а впереди новый путь' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirəm.', en: 'I want to celebrate this day with you.', ru: 'Я хочу отметить этот день вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'last-bell': {
    kicker: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' },
    title:  { az: 'Məktəb illərim', en: 'My school years', ru: 'Мои школьные годы' },
    sub:    { az: 'Birinci sinifdən bu günə qədər', en: 'From first grade to today', ru: 'С первого класса до сегодняшнего дня' },
    end:    { az: '…və qarşıda yeni yol var', en: '…and a new road lies ahead', ru: '…а впереди новый путь' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirəm.', en: 'I want to celebrate this day with you.', ru: 'Я хочу отметить этот день вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'chalkboard': {
    kicker: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' },
    title:  { az: 'Məktəb illərim', en: 'My school years', ru: 'Мои школьные годы' },
    sub:    { az: 'Birinci sinifdən bu günə qədər', en: 'From first grade to today', ru: 'С первого класса до сегодняшнего дня' },
    end:    { az: '…və qarşıda yeni yol var', en: '…and a new road lies ahead', ru: '…а впереди новый путь' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirəm.', en: 'I want to celebrate this day with you.', ru: 'Я хочу отметить этот день вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'paper-plane': {
    kicker: { az: 'Xatirələr', en: 'Memories', ru: 'Воспоминания' },
    title:  { az: 'Məktəb illərim', en: 'My school years', ru: 'Мои школьные годы' },
    sub:    { az: 'Birinci sinifdən bu günə qədər', en: 'From first grade to today', ru: 'С первого класса до сегодняшнего дня' },
    end:    { az: '…və qarşıda yeni yol var', en: '…and a new road lies ahead', ru: '…а впереди новый путь' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirəm.', en: 'I want to celebrate this day with you.', ru: 'Я хочу отметить этот день вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  /* 2026-10 — «Açılış və təqdimat» konsepti */
  'ribbon-cut': {
    kicker: { az: 'Tariximiz', en: 'Our history', ru: 'Наша история' },
    title:  { az: 'Necə başladı', en: 'How it started', ru: 'Как всё начиналось' },
    sub:    { az: 'İdeyadan açılış gününə qədər', en: 'From the idea to opening day', ru: 'От идеи до дня открытия' },
    end:    { az: '…və qapılarımız sizin üçün açıqdır', en: '…and our doors are open for you', ru: '…и наши двери открыты для вас' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this day with you.', ru: 'Мы хотим отметить этот день вместе с вами.' },
    kpre:   { az: 'Mərhələ', en: 'Step', ru: 'Этап' },
  },
  'bistro-sign': {
    kicker: { az: 'Tariximiz', en: 'Our history', ru: 'Наша история' },
    title:  { az: 'Necə başladı', en: 'How it started', ru: 'Как всё начиналось' },
    sub:    { az: 'İdeyadan açılış gününə qədər', en: 'From the idea to opening day', ru: 'От идеи до дня открытия' },
    end:    { az: '…və qapılarımız sizin üçün açıqdır', en: '…and our doors are open for you', ru: '…и наши двери открыты для вас' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this day with you.', ru: 'Мы хотим отметить этот день вместе с вами.' },
    kpre:   { az: 'Mərhələ', en: 'Step', ru: 'Этап' },
  },
  'roller-shutter': {
    kicker: { az: 'Tariximiz', en: 'Our history', ru: 'Наша история' },
    title:  { az: 'Necə başladı', en: 'How it started', ru: 'Как всё начиналось' },
    sub:    { az: 'İdeyadan açılış gününə qədər', en: 'From the idea to opening day', ru: 'От идеи до дня открытия' },
    end:    { az: '…və qapılarımız sizin üçün açıqdır', en: '…and our doors are open for you', ru: '…и наши двери открыты для вас' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this day with you.', ru: 'Мы хотим отметить этот день вместе с вами.' },
    kpre:   { az: 'Mərhələ', en: 'Step', ru: 'Этап' },
  },
  'unboxing': {
    kicker: { az: 'Tariximiz', en: 'Our history', ru: 'Наша история' },
    title:  { az: 'Necə başladı', en: 'How it started', ru: 'Как всё начиналось' },
    sub:    { az: 'İdeyadan açılış gününə qədər', en: 'From the idea to opening day', ru: 'От идеи до дня открытия' },
    end:    { az: '…və qapılarımız sizin üçün açıqdır', en: '…and our doors are open for you', ru: '…и наши двери открыты для вас' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this day with you.', ru: 'Мы хотим отметить этот день вместе с вами.' },
    kpre:   { az: 'Mərhələ', en: 'Step', ru: 'Этап' },
  },
  'gallery-unveil': {
    kicker: { az: 'Tariximiz', en: 'Our history', ru: 'Наша история' },
    title:  { az: 'Necə başladı', en: 'How it started', ru: 'Как всё начиналось' },
    sub:    { az: 'İdeyadan açılış gününə qədər', en: 'From the idea to opening day', ru: 'От идеи до дня открытия' },
    end:    { az: '…və qapılarımız sizin üçün açıqdır', en: '…and our doors are open for you', ru: '…и наши двери открыты для вас' },
    endSub: { az: 'Bu günü sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this day with you.', ru: 'Мы хотим отметить этот день вместе с вами.' },
    kpre:   { az: 'Mərhələ', en: 'Step', ru: 'Этап' },
  },
  /* 2026-10 — «Bayram gecələri» konsepti */
  'novruz-bonfire': {
    kicker: { az: 'Ənənə', en: 'Tradition', ru: 'Традиция' },
    title:  { az: 'Bayram hekayəsi', en: 'Holiday story', ru: 'Праздничная история' },
    sub:    { az: 'İllər boyu bizimlə olan bayram anları', en: 'Festive moments that stayed with us over the years', ru: 'Праздничные моменты, которые с нами годами' },
    end:    { az: '…və yeni bayram başlayır', en: '…and a new celebration begins', ru: '…и начинается новый праздник' },
    endSub: { az: 'Bu bayramı sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this holiday with you.', ru: 'Мы хотим отметить этот праздник вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'novruz-semeni': {
    kicker: { az: 'Ənənə', en: 'Tradition', ru: 'Традиция' },
    title:  { az: 'Bayram hekayəsi', en: 'Holiday story', ru: 'Праздничная история' },
    sub:    { az: 'İllər boyu bizimlə olan bayram anları', en: 'Festive moments that stayed with us over the years', ru: 'Праздничные моменты, которые с нами годами' },
    end:    { az: '…və yeni bayram başlayır', en: '…and a new celebration begins', ru: '…и начинается новый праздник' },
    endSub: { az: 'Bu bayramı sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this holiday with you.', ru: 'Мы хотим отметить этот праздник вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'midnight-clock': {
    kicker: { az: 'Ənənə', en: 'Tradition', ru: 'Традиция' },
    title:  { az: 'Bayram hekayəsi', en: 'Holiday story', ru: 'Праздничная история' },
    sub:    { az: 'İllər boyu bizimlə olan bayram anları', en: 'Festive moments that stayed with us over the years', ru: 'Праздничные моменты, которые с нами годами' },
    end:    { az: '…və yeni bayram başlayır', en: '…and a new celebration begins', ru: '…и начинается новый праздник' },
    endSub: { az: 'Bu bayramı sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this holiday with you.', ru: 'Мы хотим отметить этот праздник вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'snow-globe': {
    kicker: { az: 'Ənənə', en: 'Tradition', ru: 'Традиция' },
    title:  { az: 'Bayram hekayəsi', en: 'Holiday story', ru: 'Праздничная история' },
    sub:    { az: 'İllər boyu bizimlə olan bayram anları', en: 'Festive moments that stayed with us over the years', ru: 'Праздничные моменты, которые с нами годами' },
    end:    { az: '…və yeni bayram başlayır', en: '…and a new celebration begins', ru: '…и начинается новый праздник' },
    endSub: { az: 'Bu bayramı sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this holiday with you.', ru: 'Мы хотим отметить этот праздник вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
  'masquerade-ball': {
    kicker: { az: 'Ənənə', en: 'Tradition', ru: 'Традиция' },
    title:  { az: 'Bayram hekayəsi', en: 'Holiday story', ru: 'Праздничная история' },
    sub:    { az: 'İllər boyu bizimlə olan bayram anları', en: 'Festive moments that stayed with us over the years', ru: 'Праздничные моменты, которые с нами годами' },
    end:    { az: '…və yeni bayram başlayır', en: '…and a new celebration begins', ru: '…и начинается новый праздник' },
    endSub: { az: 'Bu bayramı sizinlə qeyd etmək istəyirik.', en: 'We want to celebrate this holiday with you.', ru: 'Мы хотим отметить этот праздник вместе с вами.' },
    kpre:   { az: 'İl', en: 'Year', ru: 'Год' },
  },
}

/** Aktiv dil üçün mətnlər: şablon → baza, dil → AZ. */
export function getStoryCopy(templateId, lang = 'az') {
  const own = COPY[templateId] || {}
  const out = {}
  for (const key of Object.keys(COPY_BASE)) {
    const v = own[key] || COPY_BASE[key]
    out[key] = v[lang] ?? v.az
  }
  return out
}

/* ── Admin rəng override-ı (Phase 42) ──
   `form_data.admin.theme` yalnız `#RRGGBB` dəyərlər daşıyır (serverdə
   yoxlanılır). Hekayə palitrasına belə köçürülür:
     text → mətn, primary → vurğu, accent → xətlər, background → fon. */
export function getStoryTheme(templateId, adminTheme = null) {
  const t = { ...BASE, ...(T[templateId] || T['simple-luxury']) }
  if (adminTheme && typeof adminTheme === 'object') {
    const hex = (v) => (typeof v === 'string' && /^#[0-9A-Fa-f]{6}$/.test(v) ? v : null)
    if (hex(adminTheme.text))       t.ink  = adminTheme.text
    if (hex(adminTheme.primary))    t.hi   = adminTheme.primary
    if (hex(adminTheme.accent))     t.line = adminTheme.accent
    if (hex(adminTheme.background)) t.bg   = adminTheme.background
  }
  t.usesScript = [t.titleFont, t.cap].includes(F.vibes)
  return t
}

/* ── Tarix: `2019-06` / `2019-06-14` / sərbəst mətn → göstəriləcək etiket ── */
const MONTHS = {
  az: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
}

export function formatStoryDate(raw, lang = 'az') {
  const s = String(raw || '').trim()
  if (!s) return ''
  const months = MONTHS[lang] || MONTHS.az
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s)
  if (m) {
    const mi = Math.min(11, Math.max(0, parseInt(m[2], 10) - 1))
    return `${parseInt(m[3], 10)} ${months[mi]} ${m[1]}`
  }
  m = /^(\d{4})-(\d{1,2})$/.exec(s)
  if (m) {
    const mi = Math.min(11, Math.max(0, parseInt(m[2], 10) - 1))
    return `${months[mi]} ${m[1]}`
  }
  return s   /* sərbəst mətn (məs. «2019-cu ilin yazı») olduğu kimi */
}

/** Blokun şəkilləri: yeni `photos[]` + Phase 43-ün tək `photo` sahəsi.
    Təhlükəsiz olmayan ünvanlar (`storyPhotoSrc` → null) atılır. */
export const MAX_PHOTOS_PER_CHAPTER = 6
export function storyPhotos(block) {
  const raw = Array.isArray(block?.photos) ? block.photos : (block?.photo ? [block.photo] : [])
  return raw.map(storyPhotoSrc).filter(Boolean).slice(0, MAX_PHOTOS_PER_CHAPTER)
}

/* ── Fəsil nişanları — fəsil sayı sabit deyil, ona görə generasiya olunur ── */
function roman(n) {
  const map = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let out = ''
  for (const [v, s] of map) while (n >= v) { out += s; n -= v }
  return out
}

/** @param {number} i 0-dan  @param {number} total fəsil sayı */
export function chapterLabel(style, i, total) {
  const n = i + 1
  switch (style) {
    case 'num2':  return String(n).padStart(2, '0')
    case 'num':   return String(n)
    case 'star':  return '✦ ' + roman(n)
    /* Plastinka: birinci yarı A tərəfi, ikinci yarı B tərəfi (A1 A2 B1 B2) */
    case 'vinyl': {
      const half = Math.ceil(total / 2)
      return n <= half ? 'A' + n : 'B' + (n - half)
    }
    default:      return roman(n)
  }
}

/* ── Çərçivə (dizayndakı `frame()` ilə eyni) ── */
export function frameStyle(t, rot, ratio) {
  const r = t.tilt || t.frame === 'clipping' ? rot * (t.frame === 'clipping' ? 0.35 : 1) : 0
  const box = { position: 'relative', zIndex: 1, transform: `rotate(${r}deg)` }
  let outer = {}
  const inner = { width: '100%', aspectRatio: ratio, overflow: 'hidden', background: 'rgba(127,127,127,0.12)' }
  let cap = {
    fontFamily: t.cap, fontStyle: t.capItalic ? 'italic' : 'normal', fontSize: t.script ? 22 : 15,
    lineHeight: 1.2, paddingTop: 8, textAlign: 'center', color: t.mute, overflowWrap: 'anywhere',
  }
  const sh = '0 18px 40px rgba(0,0,0,0.35)'
  switch (t.frame) {
    case 'polaroid': Object.assign(box, { background: t.paper, padding: '10px 10px 8px', boxShadow: sh }); cap.color = t.paperInk; break
    case 'mat': Object.assign(box, { background: t.paper, padding: '14px 14px 12px', boxShadow: '0 14px 34px rgba(0,0,0,0.08)' }); cap.color = t.paperInk; break
    case 'minimal': outer = { border: '1px solid ' + t.line, padding: 6 }; Object.assign(cap, { fontSize: 18, textAlign: 'left', color: t.ink }); break
    case 'glow': outer = { border: '1px solid ' + t.line + '88', padding: 6, boxShadow: '0 0 40px ' + t.hi + '30' }; cap.fontSize = 17; break
    case 'heraldic': Object.assign(box, { background: t.surf, border: '1px solid ' + t.line, outline: '1px solid ' + t.line + '66', outlineOffset: 4, padding: 8, boxShadow: sh }); Object.assign(cap, { color: t.hi, fontSize: t.script ? 22 : 17 }); break
    case 'glass': Object.assign(box, { background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.95)', borderRadius: 18, padding: '8px 8px 6px', boxShadow: '0 20px 44px rgba(46,58,68,0.16)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }); inner.borderRadius = 12; cap.fontSize = 17; break
    case 'ticket': Object.assign(box, { background: t.paper, borderRadius: 10, padding: '8px 8px 10px', boxShadow: sh }); inner.borderRadius = 6
      cap = { fontFamily: t.cap, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.paperInk, borderTop: '1px dashed ' + t.paperInk + '66', marginTop: 10, padding: '10px 2px 26px', backgroundImage: `repeating-linear-gradient(90deg,${t.paperInk} 0 2px,transparent 2px 4px,${t.paperInk} 4px 5px,transparent 5px 8px)`, backgroundSize: '100% 14px', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom', overflowWrap: 'anywhere' }
      break
    case 'film': {
      const holes = 'repeating-linear-gradient(90deg,#F2F0EC66 0 7px,transparent 7px 15px)'
      Object.assign(box, { background: '#000', padding: '16px 6px 18px', backgroundImage: holes + ',' + holes, backgroundSize: '100% 5px,100% 5px', backgroundPosition: '0 5px,0 calc(100% - 5px)', backgroundRepeat: 'no-repeat', boxShadow: sh })
      Object.assign(cap, { color: t.hi, fontSize: 16 })
      break
    }
    case 'sleeve': Object.assign(box, { background: t.surf, border: '1px solid ' + t.line + '55', padding: '8px 8px 10px', boxShadow: sh }); cap = { fontFamily: t.cap, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.mute, paddingTop: 10, overflowWrap: 'anywhere' }; break
    case 'clipping': Object.assign(box, { background: t.paper, border: '1px solid ' + t.ink, padding: '6px 6px 8px', boxShadow: '3px 3px 0 rgba(0,0,0,0.08)' }); inner.filter = 'grayscale(1) contrast(1.05)'; Object.assign(cap, { fontSize: 12, textAlign: 'left', paddingTop: 6 }); break
    case 'gem': outer = { background: t.line, padding: 1.5, clipPath: OCT }; Object.assign(inner, { clipPath: OCT, background: t.surf }); Object.assign(cap, { color: t.hi, fontSize: 17, paddingTop: 10 }); break
    default: break
  }
  return { box, outer, inner, cap, tape: t.frame === 'polaroid' && t.tilt }
}

/* ── Əsas foto forması (dizayndakı `hero()` ilə eyni) ── */
export function heroStyle(t) {
  const L = '1px solid ' + t.line
  const o = { position: 'relative', width: '100%' }
  const i = { width: '100%', overflow: 'hidden', aspectRatio: '4/5', background: 'rgba(127,127,127,0.12)' }
  switch (t.hero) {
    case 'arch': Object.assign(o, { border: L, padding: 8, borderRadius: '999px 999px 0 0' }); Object.assign(i, { aspectRatio: '3/4', borderRadius: '999px 999px 0 0' }); break
    case 'circle': Object.assign(o, { border: L, padding: 8, borderRadius: '50%', boxShadow: '0 0 60px ' + t.hi + '26' }); Object.assign(i, { aspectRatio: '1', borderRadius: '50%' }); break
    case 'oval': Object.assign(o, { border: L, padding: 8, borderRadius: '50%' }); Object.assign(i, { aspectRatio: '3/4', borderRadius: '50%' }); break
    case 'rect': Object.assign(o, { border: L, padding: 8 }); if (t.frame === 'clipping') i.filter = 'grayscale(1) contrast(1.05)'; if (t.frame === 'ticket') { o.borderRadius = 14; i.borderRadius = 8 } break
    case 'letterbox': Object.assign(o, { background: '#000', padding: '26px 0', borderTop: L, borderBottom: L }); i.aspectRatio = '16/9'; break
    case 'disc': Object.assign(o, { padding: 12, borderRadius: '50%', background: 'repeating-radial-gradient(circle,#111 0 2px,#1D1D1D 2px 4px)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }); Object.assign(i, { aspectRatio: '1', borderRadius: '50%' }); break
    case 'octagon': Object.assign(o, { background: t.line, padding: 1.5, clipPath: OCT }); Object.assign(i, { clipPath: OCT, background: t.surf }); break
    case 'rounded': Object.assign(o, { background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.95)', borderRadius: 32, padding: 10, boxShadow: '0 24px 50px rgba(46,58,68,0.16)' }); i.borderRadius = 24; break
    default: break
  }
  return { outer: o, inner: i, disc: t.hero === 'disc' }
}

/* ── Fəsil maketi — şəkil sayına görə ──
   Dizaynda 4 maket var: `feature` (böyük çərçivə + üstünə düşən kart),
   `duo` (iki şəkilli kollaj), `hero` (mərkəzi forma), `split` (mətn + şəkil).
   Fəsil sayı və şəkil sayı sərbəst olduğu üçün seçim belədir:
     0 şəkil → `text` (kart), 2+ şəkil → `duo` (+ qalanlar kiçik çərçivələrdə),
     1 şəkil → dizayndakı ardıcıllıq: feature · split(güzgü) · hero · split. */
export function chapterLayout(index, photoCount) {
  if (photoCount === 0) return 'text'
  if (photoCount >= 2)  return 'duo'
  return ['feature', 'splitR', 'hero', 'split'][index % 4]
}

/* Birləşdirici xəttin giriş/çıxış nöqtələri (430 genişlikli viewBox-da) */
export function chapterAnchors(layout, index) {
  switch (layout) {
    case 'feature': return { in: 150, out: 120 }
    case 'duo':     return { in: 310, out: 300 }
    case 'hero':    return { in: 215, out: 215 }
    case 'split':   return { in: 130, out: 300 }
    case 'splitR':  return { in: 300, out: 130 }
    default:        return index % 2 ? { in: 160, out: 160 } : { in: 270, out: 270 }
  }
}
