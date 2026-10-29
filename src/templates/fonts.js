/* ─────────────────────────────────────────────────────────────────────────────
   ŞABLON ŞRİFTLƏRİ — tələb olunduqda yüklənir.

   ⚠ Bu şriftlər QƏSDƏN index.html-də deyil: simple-luxury (bütün mövcud
   müştərilər) yalnız Cormorant Garamond + Inter işlədir və onlar artıq
   index.html-dədir. Əlavə ailələri hər səhifə yükləsəydi landing-in LCP-si
   pisləşərdi.

   PREMİUM REDİZAYN (2026-10): hər şablonun öz şrift cütü var, ona görə
   dəvətnamə YALNIZ öz ailələrini yükləyir (`ensureTemplateFonts(id)`) —
   bütün 30-a yaxın ailəni bir CSS-də çəkmək mənasız yük olardı.
   Arqumentsiz çağırış (şablon qalereyası, admin şrift override-ı) hamısını
   yükləyir — əvvəlki davranış.

   ⚠ Yeni ailə əlavə edəndə `Ə` yoxlanmalıdır (tests/az_glyph_test.mjs).
   ───────────────────────────────────────────────────────────────────────── */

/* Google Fonts css2 `family=` dəyərləri — çəkilər dizaynın işlətdiyi qədər */
const FAMILY = {
  /* köhnə dəst — admin şrift seçicisi və hekayə temaları üçün qalır */
  marcellus:    'Marcellus',
  instrument:   'Instrument+Serif:ital@0;1',
  newsreader:   'Newsreader:ital,opsz,wght@0,6..72,200..500;1,6..72,200..400',
  italiana:     'Italiana',
  amiri:        'Amiri:ital,wght@0,400;0,700;1,400',
  archivo:      'Archivo:wght@300;400;500;600',
  jost:         'Jost:wght@200;300;400;500',
  dmsans:       'DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500',
  spacegrotesk: 'Space+Grotesk:wght@300;400;500;700',
  jetbrains:    'JetBrains+Mono:wght@300;400;500',
  bebas:        'Bebas+Neue',
  cinzel:       'Cinzel:wght@400;500;600',
  baskerville:  'Libre+Baskerville:ital,wght@0,400;0,700;1,400',

  /* premium redizayn */
  notoDisplay:  'Noto+Serif+Display:ital,wght@0,300;0,400;1,300;1,400',
  hanken:       'Hanken+Grotesk:wght@300;400;500',
  ballet:       'Ballet',
  fraunces:     'Fraunces:ital,opsz,wght,SOFT@0,9..144,300..500,0..100;1,9..144,300..500,0..100',
  mulish:       'Mulish:wght@300;400;500;600',
  unbounded:    'Unbounded:wght@200;300;400;700;800',
  interTight:   'Inter+Tight:wght@300;400;500',
  spectral:     'Spectral:ital,wght@0,200;0,300;0,400;1,200;1,300;1,400',
  sourceSerif:  'Source+Serif+4:ital,opsz,wght@0,8..60,200..500;1,8..60,200..500',
  commissioner: 'Commissioner:wght@200;300;400;500',
  reemKufi:     'Reem+Kufi:wght@400;500;600',
  alegreya:     'Alegreya:ital,wght@0,400;0,500;1,400',
  vollkorn:     'Vollkorn:ital,wght@0,400;0,600;1,400',
  geologica:    'Geologica:wght@300;400;500',
  josefin:      'Josefin+Sans:wght@100;200;300;400',
  onest:        'Onest:wght@300;400;500',
  oswald:       'Oswald:wght@300;400;500;600',
  plexSans:     'IBM+Plex+Sans:wght@300;400;500',
  plexMono:     'IBM+Plex+Mono:wght@400;500',
  bigShoulders: 'Big+Shoulders+Display:wght@500;700;800',
  playfair:     'Playfair+Display:ital,wght@0,400;0,700;0,900;1,400',
  youngSerif:   'Young+Serif',
  montserrat:   'Montserrat:wght@300;400;500;600',
  cormorantSC:  'Cormorant+SC:wght@400;500;600',
  ebGaramond:   'EB+Garamond:ital,wght@0,400;0,500;1,400',
  imperial:     'Imperial+Script',
  libreBodoni:  'Libre+Bodoni:ital,wght@0,400;0,500;1,400;1,500',
  literata:     'Literata:ital,opsz,wght@0,7..72,300..500;1,7..72,300..500',
  oldStandard:  'Old+Standard+TT:ital,wght@0,400;0,700;1,400',
  libreCaslon:  'Libre+Caslon+Display',
  raleway:      'Raleway:wght@200;300;400;500',

  /* uşaq ad günü konsepti (2026-10) */
  cormorantUnicase: 'Cormorant+Unicase:wght@500;600;700',
  bonaNova:     'Bona+Nova:ital,wght@0,400;0,700;1,400',
  tektur:       'Tektur:wght@700;800',
  exo2:         'Exo+2:ital,wght@0,400;0,500;0,600;1,400',
  oi:           'Oi',
  podkova:      'Podkova:wght@400;500;700;800',
  shantell:     'Shantell+Sans:ital,wght@0,400;0,600;0,800;1,400',
  andika:       'Andika:ital,wght@0,400;0,700;1,400',
  mplusRounded: 'M+PLUS+Rounded+1c:wght@400;500;700;800;900',
  pacifico:     'Pacifico',
  /* konseptlər II (2026-10) */
  lora: 'Lora:ital,wght@0,400;0,500;1,400',
  greatVibes: 'Great+Vibes',
  alegreyaSans: 'Alegreya+Sans:ital,wght@0,300;0,400;0,500;1,400',
  badScript: 'Bad+Script',
  playfairSC: 'Playfair+Display+SC:wght@400;700',
  merriweather: 'Merriweather:ital,wght@0,300;0,400;1,300',
  spectralSC: 'Spectral+SC:wght@400;500;600',
  balsamiq: 'Balsamiq+Sans:ital,wght@0,400;0,700;1,400',
  nunitoSans: 'Nunito+Sans:ital,wght@0,400;0,600;0,700;1,400',
  montserratAlt: 'Montserrat+Alternates:wght@500;600;700;800',
  nunito: 'Nunito:ital,wght@0,400;0,600;0,700;0,800;1,400',
  cormorantInfant: 'Cormorant+Infant:ital,wght@0,400;0,500;0,600;1,400',
  caveat: 'Caveat:wght@400;500;600',
  comfortaa: 'Comfortaa:wght@500;600;700',
  playpen: 'Playpen+Sans:wght@400;600;700;800',
  ysabeauInfant: 'Ysabeau+Infant:ital,wght@0,400;0,600;0,700;1,400',
  interTightBold: 'Inter+Tight:wght@400;500;600;700',
  lobster: 'Lobster',
  jura: 'Jura:wght@400;500;600;700',
  vollkornSC: 'Vollkorn+SC:wght@400;600;700',
  brygada: 'Brygada+1918:ital,wght@0,400;0,600;1,400',
  piazzolla: 'Piazzolla:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600',
  didact: 'Didact+Gothic',
  marmelad: 'Marmelad',
  pangolin: 'Pangolin',
  bellotaText: 'Bellota+Text:wght@400;700',
  alegreyaSC: 'Alegreya+SC:wght@400;500;700',
  firaXC: 'Fira+Sans+Extra+Condensed:wght@600;700;800',
  firaC: 'Fira+Sans+Condensed:wght@400;600',
  comforterBrush: 'Comforter+Brush',
  robotoSerif: 'Roboto+Serif:ital,wght@0,500;0,600;0,700;1,700',
  notoSans: 'Noto+Sans:wght@400;600',
  comforter: 'Comforter',
  amatic: 'Amatic+SC:wght@400;700',
  ysabeauOffice: 'Ysabeau+Office:wght@400;600',
  ysabeau: 'Ysabeau:ital,wght@0,600;0,700;0,800;1,700',
  martianMono: 'Martian+Mono:wght@400;600',
}

/* Hər şablonun öz ailələri */
const TEMPLATE_FONTS = {
  'royal-gold':      ['notoDisplay', 'hanken', 'ballet'],
  'floral-garden':   ['fraunces', 'mulish'],
  'modern-black':    ['unbounded', 'interTight'],
  'white-elegance':  ['spectral'],
  'night-sky':       ['sourceSerif', 'commissioner'],
  'oriental-luxe':   ['reemKufi', 'alegreya'],
  'nature-touch':    ['vollkorn', 'geologica'],
  'crystal-glass':   ['josefin', 'onest'],
  'boarding-pass':   ['oswald', 'plexSans', 'plexMono'],
  'cinema-premiere': ['bigShoulders', 'playfair', 'oswald'],
  'vinyl-record':    ['youngSerif', 'montserrat'],
  'royal-palace':    ['cormorantSC', 'ebGaramond', 'imperial'],
  'mediterranean':   ['libreBodoni', 'literata'],
  'gazette':         ['playfair', 'sourceSerif', 'oldStandard'],
  'luxury-jewelry':  ['libreCaslon', 'raleway'],
  'fairy-tale':      ['cormorantUnicase', 'bonaNova'],
  'space-mission':   ['unbounded', 'tektur', 'exo2'],
  'circus-show':     ['oi', 'podkova'],
  'dino-adventure':  ['shantell', 'andika'],
  'balloon-party':   ['mplusRounded', 'pacifico'],
  /* 2026-10 — «Xına gecəsi» konsepti */
  'red-veil': ['lora', 'greatVibes'],
  'xonca': ['alegreya', 'alegreyaSans'],
  'henna-buta': ['spectral', 'commissioner', 'badScript'],
  'mirror-candle': ['notoDisplay', 'ebGaramond'],
  'kelagayi': ['playfairSC', 'merriweather'],
  /* 2026-10 — «Sünnət toyu» konsepti */
  'little-prince': ['spectralSC', 'mulish'],
  'hero-comic': ['unbounded', 'balsamiq'],
  'mashallah': ['literata', 'nunitoSans'],
  'little-pilot': ['montserratAlt', 'nunito'],
  'football-star': ['oswald', 'interTight', 'tektur'],
  /* 2026-10 — «Baby shower» konsepti */
  'pastel-bloom': ['cormorantInfant', 'nunitoSans', 'caveat'],
  'teddy-bear': ['comfortaa', 'nunito'],
  'gender-reveal': ['playpen', 'onest'],
  'stork-letter': ['oldStandard', 'vollkorn', 'greatVibes'],
  'baby-mobile': ['ysabeauInfant', 'mulish'],
  /* 2026-10 — «Korporativ» konsepti */
  'gala-night': ['playfair', 'montserrat'],
  'keynote': ['geologica', 'onest', 'jetbrains'],
  'award-night': ['cormorantSC', 'raleway'],
  'business-card': ['interTightBold', 'jetbrains'],
  'neon-party': ['lobster', 'jura'],
  /* 2026-10 — «İldönümü» konsepti */
  'silver-locket': ['mulish'],
  'golden-jubilee': ['vollkornSC', 'brygada'],
  'first-paper': ['piazzolla', 'didact'],
  'retro-polaroid': ['marmelad', 'pangolin', 'bellotaText'],
  'love-letters': ['greatVibes', 'ebGaramond'],
  /* 2026-10 — «Məzuniyyət» konsepti */
  'caps-toss': ['alegreyaSC', 'sourceSerif'],
  'yearbook': ['firaXC', 'firaC', 'comforterBrush'],
  'last-bell': ['robotoSerif', 'notoSans', 'comforter'],
  'chalkboard': ['amatic', 'ysabeauOffice'],
  'paper-plane': ['ysabeau', 'ysabeauOffice', 'martianMono'],
}

const ALL = Object.keys(FAMILY)
const LINK_ID = 'digitoy-template-fonts'

function hrefFor(keys) {
  return 'https://fonts.googleapis.com/css2?' + keys.map((k) => `family=${FAMILY[k]}`).join('&') + '&display=swap'
}

/* ── «Bizim Hekayəmiz» əl yazısı şrifti (Phase 44) ──
   Great Vibes yalnız hekayə bölməsinin başlıq/şəkil altı yazılarında işlənir.
   Ayrı link-dir: bölmə olmayan dəvətnamələr (default bağlıdır) onu HEÇ VAXT
   yükləmir, simple-luxury-nin yuxarıdakı dəstdən asılı olmaması da qorunur. */
const SCRIPT_HREF = 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap'
const SCRIPT_LINK_ID = 'digitoy-script-font'

export function ensureScriptFont() {
  if (typeof document === 'undefined') return
  if (document.getElementById(SCRIPT_LINK_ID)) return
  const link = document.createElement('link')
  link.id   = SCRIPT_LINK_ID
  link.rel  = 'stylesheet'
  link.href = SCRIPT_HREF
  document.head.appendChild(link)
}

/**
 * Şablon şriftlərini bir dəfə <head>-ə əlavə edir (idempotent).
 * @param {string} [templateId] verilibsə yalnız o şablonun ailələri;
 *        verilməyibsə (qalereya, admin şrift override-ı) — hamısı.
 */
export function ensureTemplateFonts(templateId) {
  if (typeof document === 'undefined') return
  /* Tam dəst artıq yüklənibsə heç nə lazım deyil */
  if (document.getElementById(LINK_ID)) return
  const own = templateId && TEMPLATE_FONTS[templateId]
  const id = own ? `${LINK_ID}-${templateId}` : LINK_ID
  if (document.getElementById(id)) return

  const link = document.createElement('link')
  link.id   = id
  link.rel  = 'stylesheet'
  link.href = hrefFor(own || ALL)
  document.head.appendChild(link)
}
