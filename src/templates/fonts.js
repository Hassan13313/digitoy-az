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
  unbounded:    'Unbounded:wght@200;300;400',
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
